# 离职移交审批方案（designer/salesman 批量移交 decorationbelong）

> 状态：方案设计稿（2026-11-11），八项拍板全部落定（见§7），未落码。
> 范围：设计师/业务员离职时，其名下在途装修单（含已签约）的归属批量移交，支持分给多个接手人，全程走审批模块审核；调职本期不关联（字段预留）。

---

## 1. 现状盘点（调查结论，均有代码实证）

### 1.1 已有能力（可复用）

| 能力 | 位置 | 说明 |
|---|---|---|
| 单票归属直转 | `DecorationBelongServiceImpl.tranDecorationBelong`(:197-260) | 一单一次可换设计+业务两类目标人；写库三件套自动联动 |
| 单票归属变更审批通道 | `ApprovalDecorationBelongServiceImpl`(:114-358, type=`APPROVAL_TYPE_DECORATION_BELONG_INT`) | 支持多人分 rate、合尺(500/500)、钉钉推送；审批通过才物化 |
| 换人的写库全套 | 同上两文件 | `decoration.dsuid/smuid/ddid/sdid` + `decorationbelong`(旧行 status0→1 留痕+插新行) + `decorationaddtion` 姓名/部门/大区字符串快照 + `belongTime` + `TEAM_DESIGNER_CHANGED/TEAM_SALESMAN_CHANGED` 下游事件 |
| 客户确认机制 | `sendDecorationBelong/confirmDecorationBelong` | 移交如需客户侧知晓可挂同款确认 |
| 列表批量操作先例 | `salesPayment.js`(checkbox列+全选+顶部按钮)、`batchDecorationPicture.do`(批量Action+索引参数) | 移交页签的 checkbox+批量按钮交互直接照抄 |
| 审批接入模板 | type=26 提现全链(`ApprovalPaymentWithdrawServiceImpl`) + `docs/01-方案设计/DESIGN_wallet_withdraw_approval.md` | 新审批业务的标准文件清单 |

### 1.2 🔴 关键障碍：两条现有通道都放不了"已签约"单

状态机（`DecorationPO`:51-69）：0初始 1定金 2预签 **3签约** 4重签 5废单 6终止 7决算 8完工。

- 直转通道（`DecorationBelongServiceImpl`:186-188）：禁 {2预签, 3签约, 4重签, 8完工} → 140004"装修单状态不可操作"。
- 审批通道（`ApprovalDecorationBelongServiceImpl`:144-147）：白名单仅 {0初始,1定金,2预签,4重签}，**status=3 签约 → 140011"订单已签订不可修改归属信息"**。
- 两通道交集结论：**签约在途单哪里都改不了归属**；且重签单(4)只有审批通道放行——移交豁免白名单需覆盖 {0,1,2,3,4}。

而离职人员名下大量单据恰是**已签约施工中**——现有归属变更语义只服务"未成交客源改派"，不覆盖成交后的移交。故本方案**必须新增"移交场景豁免状态白名单"**（放宽至含 3签约/4重签，排除 5废单/6终止/7决算/8完工），这是核心语义变更，不是简单包装。

### 1.3 离职/调职与装修域零联动

`quitUser`(`UserServiceImpl`:1109-1176)/`tranUser`(:1180-1328) 只动人员侧（user.status/角色/部门/userinfo），**不检查、不触碰任何在途装修单**——离职后名下单据归属人仍是"死人"，报表、收款转换款(`PaytranServiceImpl`:849 读 `decoration.designer`)、NERP同步继续按原人走。

### 1.4 用户点名要更新的表，实际口径

| 表 | 是否要动 | 依据 |
|---|---|---|
| `decoration.decoration` | ✅ dsuid/smuid + ddid/sdid | 现有换人链路已同步，复用即得 |
| `decoration.decorationbelong` | ✅ 旧行置失效+插新行（留痕，非UPDATE原行） | 同上 |
| `decoration.decorationinfo` | ❌ **无人员外键**，仅外部介绍人/返单人员纯文本 | `DecorationInfoPO`:110-161，无需改 |
| `decoration.decorationaddition` | ✅ 姓名/部门/大区快照+belongTime | 现有链路自动刷新 |
| `decoration.decorationoperate` | 🔒 **不回改**——每笔收款冗余当时归属人(buid/rate)，是历史业绩/结算依据 | `DecorationPO`调查结果；历史归历史 |
| `decoration.auditscale` | 🔒 审核比例行冗余归属人，已审定的不改；审核进行中的随单移交后是否换人=拍板点 | |
| `decoration.decorationuser` | ⚪ 辅助人员/销售合伙人（多行），移交默认不动，可选纳入 | 拍板点 |
| 合同/量尺/回访/服务节点等表的操作人 | ❌ 均为"谁做过什么"历史凭证，不换 | |
| platform 三权限表(uid×did×company) | ✅ 无需改数据——按部门授权，新归属人所在部门由 Manager 权限行覆盖；移交后 designDept/salesDept 已跟随换人 | 方案依赖，非改动项 |

**移交后的业绩语义**（沿用现状，自动成立）：已收款项的既有记录归原人（decorationoperate 历史不动）；**今后新收款/转换款归新人**（动态读 `decoration.designer`）；报表业绩从移交日切换。原人留成比例=用现有合尺能力（rate 500/500 两行 status=0），移交默认 rate=1000 全额归新人。

---

## 2. 方案总览

**概念**：一张"移交单"（BelongTran）= 原人员（uid）× 移交类型（设计/业务/两者）× N 明细（每单号→指定接手人），整体提交一条审批（新 type=27），审批通过=全批物化，驳回=零变更可重提。

```
decoration4belong「离职移交」页签 ──► 筛原移交人(归属表聚合含离职) ──► 勾选(多行批量/单行)
        ──► 页内 modal 指派接手人(挂列表+页内草稿缓存, 草稿不落库) ──► 统一提交 submitApprovalForBelongTran(服务端三重复验, 一人一组=一张审批 type=27)
                                                                    │
审批人 ERP Web approveApproval ──► switch case 27 ──► approveForBelongTran
                                                                    │
                                            循环明细, 整批单事务, 逐单复用既有换人写库:
                                            decorationbelong 翻转+插入 / decoration 主字段+部门
                                            / decorationaddition 快照 / TEAM_*_CHANGED 事件(不推客户确认, 拍板5)
```

要点：
- **rate 与默认人 = 指派 modal 人工编辑（2026-11-11 三轮拍板：不固定、非推导）**：modal 三字段——接手人（必选在职）、比例 `rate`（千分率 0~1000）、默认人勾选。系统**按单据状态预填推荐值**（签约3/重签4 → rate=0、默认=勾；初始0/定金1/预签2 → rate=1000、默认=勾），操作员可自由改，**物化按编辑后的值落库**，不做物化时刻推导。合尺原单因此天然兼容（在职搭档行保留、新人比例手定，无业绩缺口残留）；完整性只硬校验两条：①每单每类型**生效行中恰有一个 defaultFlag=1**（保障主表 dsuid/smuid 跟随默认人同步）②rate∈[0,1000]；**不强校 140016"比例和=1"**——签约移交把业绩清零或留部分和属合法业务态；
- 🔴 **rate=0 的背景口径（复核修正，作为预填依据而非硬规则）**：设计业绩报表（`countDecorationForAchievement1~4`，DecorationReportDaoImpl:110-155）实时 JOIN `decorationbelong WHERE status=0 ×rate/1000`，**实时归属架构下"历史留原人"不可表达**——预填 0 的语义=该单移交后业绩归零（业务已确认接受，报表零改动兼容：rate 全仓只作乘数/求和无除法、无除零风险；NERP 只读人员部门不读 rate）；若业务希望新人承接业绩，modal 里把 rate 改成原值即可；
- **审批粒度=整批一张**（评审的是"这次离职移交安排"整体，通过即全做，杜绝半批生效导致死人单残留）；
- 物化阶段**不重写一套换人逻辑**：把 `ApprovalDecorationBelongServiceImpl.approveForDecorationBelong` 的单票落库段提为可复用私有入口，移交回调按明细逐单调用——保证与现有审批通道行为严格一致（含事件契约），下游小程序/NERP/报表零适配。🔴 **提段时必须带四处改造（复核坐实的复用陷阱，整段照搬即炸）**：
  1. **只翻原移交人行**：现有失效 SQL `updateDecorationBelong(orderId,type,source,target)` 无 buid 条件（DecorationBelongDaoImpl:74-80），会连同类型合尺的在职他人行一起翻失效——移交入口必须按 `buid=原移交人` 精确失效；
  2. **关掉"完成关联客户机会"副作用**（approveForDecorationBelong:347-353 会把 CONFIRM 态客源置 COMPLETE+写客源记录）——移交带开关禁用；
  3. **部门快照取物化时刻**：现有代码主表用 `userPO.getDept()`（现部门）而归属行用提交时 bdid/brid 快照，窗口期调职即分叉；移交统一物化时刻取接手人实时部门链，且 **brid(大区)必须非空**——报表按 `belongds.rid=regionds.dId` INNER JOIN，断链的移交行会**整单从分区报表消失**（唯一真"出问题"点）；
  4. **单一外层事务**：移交方法一个 @Transactional，物化入口提为**本类私有方法自调用**（跨 bean 循环各自成事务=半批提交残留，违"整批回滚"承诺）；
  5. TEAM_*_CHANGED 事件 `:341-343` 的双写 replace 怪异行为**原样继承**（保持与单票通道同契约，不在移交里修）。
- **状态白名单只在本场景放宽**：移交物化入口带豁免标志，直转/原归属审批通道维持原禁改口径不受影响。

---

## 3. 数据与接口设计

### 3.1 新表（approval 库，仿 approvaldecorationbelong 族）

`approval.approvalbelongtran`（主行）
- `abtId` PK、`aid`（关联 approval）、`ouid`（原人员 uid）、`tranType`（0设计/1业务/2两者）、`reason` 文本、`ccid` 冗余、`company`、`initiator`、`createTime`

`approval.approvalbelongtranitem`（明细）
- `abtiId` PK、`abtId`、`orderId`、`belongType`（0/1）、`buid`（接手人）、`bdid/brid`（接手人部门/大区快照，同 decorationbelong 三件套）、`rate`（千分率 0~1000，**modal 编辑值，预填按状态 3/4→0、0/1/2→1000，非物化推导**）、`defaultFlag`（modal 勾选，每单每类型生效行恰一默认）
- 索引 `(aid)`、`(orderId)`；SQL 放 `sqls/approval/`（幂等、NOT EXISTS 风格按规范）

`approval` 主表复用：ident=原人员uid+时间戳、orderId 存第一单号或空、contents=摘要（"张三(设计)离职移交 12 单 → 李四8单/王五4单"）。

### 3.2 端点（新增 Action=ApprovalBelongTranAction）

| 端点 | 说明 | 关键校验 |
|---|---|---|
| `queryDecorationBelongForTran.do` | "待移交人员"候选清单（decorationbelong status=0 × decoration 可移交状态 **group by buid**，出人名/部门/设计N单/业务M单） | 🔴 不能用 `queryUserByPinyin` 当主数据源——该接口默认强制在职过滤（`UserServiceImpl`:343-345 `userVO.status==null→STATUS_ONJOB`），离职人员搜不到；聚合按归属表取人天然含离职者（§6.10 离职后补办场景） |
| `pageDecorationForTranByBelonger.do` | 按原人员+类型拉名下生效归属单（decorationbelong status=0 × buid 联 decoration 带状态/客户/金额），**不受操作人三权限表约束**，靠 operation 强权限把关；分页 total 即汇总 count；行内"移交状态标记"由同查询联 approval(type=27/decorationbelong, status∈{0,5,6}) 服务端算出（置灰用，无独立端点）；合同额/已收款两列按 orderIds 批量聚合子查询装配（DAO 层 sum，遵守统计SQL优先规范） | 排除 {废单/终止/决算/完工}；已带在途审批的单置灰 |
| `submitApprovalForBelongTran.do` | 移交单提交（前端缓存草稿转正式单：此刻才落两表+approval 行） | 🔴 复验五则：①每单该类型**现生效归属仍=原移交人**（期间被人直转过/审批改过即拒）②状态仍在移交白名单③无在途移交/归属审批④**rate/defaultFlag 完整性（全单视角）**：物化后该单该类型生效行中恰一 defaultFlag=1，rate∈[0,1000]（不强校比例和=1，140016 不引入）⑤接手人在职(新码)/明细非空/每组防重(240004口径)。任一不过→**整批拒绝并精确返回不合格 orderId 清单**（前端据此从缓存剔除标红，剩余可重提，不静默整丢） |
| `approveApproval`（既有） | type=27 分发 `approveForBelongTran`：整批单事务循环物化+每单发 TEAM_*_CHANGED 事件；可选逐单推客户确认 | 物化前逐单复核状态仍在白名单，任一失效则整批回滚（防审批期间状态漂移） |
| `refuseApproval`（既有） | 驳回零动作（明细留在审批表），对齐现有"驳回可重提"口径 | |
| `queryApprovalBelongTranByAId.do` | 审批详情弹层读移交明细列表 | |

常量：`ApprovalPO.APPROVAL_TYPE_BELONG_TRAN_INT = 27`。分发器接入：老链 `ApprovalServiceImpl.approve` switch(:262) 加 case（拒绝侧无须 refuseFor——驳回零动作；提现先例=老链 switch）；渠道=系统 Web 审批，无钉钉回调分叉。

**命名对照（已按 `METHOD_NAMING_CONVENTION.md` 校验，禁自创词）**：移交=`tran`（既有 tranDecorationBelong/tranUser/tranCustomerChance）、离职=`quit`、归属=`belong`；单据实体仿 `PaymentWithdraw`（type=26）构词 `BelongTran`；For=场景、By=字段名带Id、三层同名。

| 命名点 | 终名 | 规范依据 |
|---|---|---|
| 表/PO | `approval.approvalbelongtran`(+`item`) / `ApprovalBelongTranPO`(+`ItemPO`)，PK `abtId`/`abtiId` | 仿 approvalpaymentwithdraw / ApprovalDecorationBelong 族 |
| 类型常量 | `APPROVAL_TYPE_BELONG_TRAN_INT = 27` | ApprovalPO 常量族 |
| 候选人员聚合查询 | `queryDecorationBelongForTran` | query+对象=DecorationBelong(DAO实体真身)+For场景；弃 "Summary"（形态词非实体） |
| 名下单据分页 | `pageDecorationForTranByBelonger` | 骨架先例 `queryDecorationForCommonByOrderId`；page=分页结构 |
| 提交 | `submitApprovalForBelongTran` | 先例 submitApprovalForPaymentWithdraw / ForDecorationBelong |
| 分发回调 | `approveForBelongTran` | 先例 approveForPaymentWithdraw / ForDecorationBelong |
| 详情查询 | `queryApprovalBelongTranByAId` | ByAId 见缩写表；先例 queryApprovalByAId |
| 物化入口（decoration 侧） | `tranDecorationBelongForQuit`（状态豁免+rate推导版单票落库，循环内逐单调用；常规直转仍走 `tranDecorationBelong`） | tran 既有动词 + ForQuit 场景 |
| Service/Action/DAO | `ApprovalBelongTranService/Impl`、`ApprovalBelongTranAction`、`ApprovalBelongTranDao(+Impl)`/Item 同构 | 类名=对象名；三层同名 |
| 页面/脚本 | 工作台取消（不建新页）；移交功能嵌入 `decoration4belong.html/js` 改造；仅保留 `decorationBelongTranDetail.html/js`（审批只读详情，1 对轻量新文件） | 前端规范 [模块名][业务功能]；页面嵌入形态=拍板7/8 |

### 3.3 登记类 SQL（4 张，sqls/approval/ 序号递增）

1. 两表 DDL；2. `communion.operation` 4 端点行（`queryDecorationBelongForTran`/`pageDecorationForTranByBelonger`/`submitApprovalForBelongTran`/`queryApprovalBelongTranByAId`，建议提交/查询类 through=0 强权限——移交=高危写操作，参照 [[verify-permission-via-interceptor-not-action]] 教训按模块拦截器档位定档）；3. operation 中文名回填；4. `approval.approver` type=27 默认审批人。**菜单 SQL 取消（嵌入现有归属管理页，移交页签显隐走既有 pageBtn 页面配置机制）；钉钉不接（拍板6=系统审批），dingtalkapprovalconfig 不登记**。

### 3.4 错误码（error.md 240xxx 段登记）

复用 240004(防重)/140013/190005；新增约 4 枚：`24008x 移交明细为空或单据归属与移交人不符`（提交三验①）、`24008x 接手人非在职`、`24008x 该装修单状态已变化不可移交`（提交三验②/通过复核共用）、`24008x 该装修单已有在途审批不可移交`（提交三验③）（同码在所有 throw 点消息一致，登记后使用）。

---

## 4. 页面设计与嵌入（终版形态，2026-11-11 三轮拍板收敛）

**定稿：不建独立工作台页。嵌入现有「归属管理」页 `decoration4belong`，加"离职移交"页签模式 + 页内 BS3 modal 指派 + 前端缓存草稿（不落库），按勾选配置情况发起审批。**

### 4.1 嵌入结构（decoration4belong.html/js 页内改造）

| 改造点 | 做法 |
|---|---|
| **页签/模式开关** | decoration4belong 加"日常维护 / 离职移交"两模式（按钮或页签）。移交模式下列表查询切交接视角：筛选器换"原移交人员"（数据源=归属表聚合，含离职者）+ 设计/业务类型；行加 checkbox 列（Searcher 原生，照 salesPayment.js:312）与"新接手人(草稿)"列；查询走放开状态的交接视图（🔴 `pageDecorationForBelong` 现硬编码 {0,1,2,4} 无签约单，DecorationServiceImpl:797——移交模式必须以参数驱动加 status=3/4，日常模式零变化） |
| **指派 modal（页内新增）** | 页内 BS3 modal 三字段编辑（**拍板9：rate/默认人人工编辑不固定**）：①接手人——typeahead `queryUserByPinyin` 默认在职口径正合要求，选人带出部门/大区 bdid/brid 复用既有联动；②比例 rate——千分率数字框 0~1000，**预填按行状态**（签约/重签→0，未签→1000）可改；③默认人勾选——**预填=原移交人在该单该类型的 defaultFlag**（合尺单在职搭档仍持默认时，新人预填非默认，避免双默认）。**双通道**：勾选多行→打开 modal 一次配好"人+比例+默认"应用全部勾选行；勾选单行→单指精调。确认后**挂到页面列表显示**（列=新接手人/比例/默认徽标）并写入页内草稿变量 |
| **草稿缓存（不落库）** | 页面级变量 map（key=`orderId\|belongType`，value=接手人三件套+`rate`+`defaultFlag`）+ `sessionStorage` 双份：翻页/筛选（AJAX 局刷）变量天然存活；菜单跳页/F5 回页时检测未提交草稿**询问恢复**；带时间戳 **TTL 24h 过期即弃**（陈旧草稿风险大于收益，不用 localStorage 防跨会话残留）。切换原移交人员时若有未提交草稿→提示先提交或清空；草稿按"原移交人×类型"分组，**一组=一张审批**（合拍板2） |
| **统一提交** | 页顶"发起移交审批"按钮（按钮显隐走 pageBtn 权限配置惯例）：汇总当前页签勾选与草稿 → 原因/备注 + 审批人预选（`queryApproverByType.do` type=27）→ `submitApprovalForBelongTran.do`（索引参数 `items[i].orderId=...`）。**移交主/明细表只在提交成功时刻落库=正式移交单+审批行，草稿态全程不入库**；成功后清该组 sessionStorage 草稿+刷新，行回显"移交审批中" |
| **共享弹层零侵入** | 不打开也不修改 `decorationBelong.js`/popup4page 弹层（日常维护模式行为原样），无客源保护期审批回归面；modal 独立使用不与 layer 交叠，避开 [[bootstrap-modal-focus-trap-popup4frame]] 陷阱 |
| **不动的页面** | decoration.html/js 零改动；人员管理 user.js 零改动（拍板3 不联动）；调职不建入口（拍板4，`tranType` 字段预留） |

### 4.2 页面数据源与接口对照

| 页面区域 | 数据 | 接口 | 新/旧 |
|---|---|---|---|
| 移交模式·人员筛选 | 原移交人员候选（按归属表聚合出人名/部门/设计N单/业务M单，天然含离职者） | `queryDecorationBelongForTran.do` | 🆕 decoration 模块 |
| 移交模式·清单 | 名下生效归属单分页（单号/客户/状态/合同额/已收款/归属部门/在途审批置灰标记；**含签约单**） | `pageDecorationForTranByBelonger.do` | 🆕 decoration 模块 |
| 指派 modal | 接手人搜索+部门/大区带出 | `queryUserByPinyin.do`（既有，在职口径正确） | ✅ 既有 |
| 统一提交 | 建移交审批（草稿集→正式两表行+approval 行） | `submitApprovalForBelongTran.do` | 🆕 approval 模块 |
| 审批人·待审/通过/驳回 | type=27 进入现有审批链 | `approveApproval`/`refuseApproval` 既有 | ✅ 零新页面 |
| 审批人·详情 | 审批主行+移交明细（只读小页，多单展示既有归属详情页装不下，保留 1 个轻量新文件） | `queryApprovalByAId.do`（既有）+ `queryApprovalBelongTranByAId.do`（🆕），`approval4track.js` detailAPI 路由加 type=27 | 混合 |
| 历史追溯 | 已提移交单 | 审批列表按 type=27 过滤 | ✅ 既有 |

新增端点仍 3 查询+1 提交；页面零新文件（独立工作台取消、审批详情复用 approval4track 的 approvalItemInfo 内嵌渲染）。**前端比例口径**：modal 输入小数(0~1)走 `tranargs approvalBelongTranItems.rate` 提交×1000→后端千分率存储/校验，与单票归属审批链(小数提交)同口径。

---

## 5. 改动量评估

| 块 | 数量 | 明细 |
|---|---|---|
| 后端新增 | 11 文件 | approval 模块：Action、Service接口+Impl、主/明细 PO(+AO)、主/明细 Dao+Impl、VO×2 |
| 后端修改 | 6~8 文件 | `ApprovalPO`常量、`ApprovalServiceImpl` approve switch(+1 case)；decoration 模块：`DecorationBelongDao/Service` 新增"按归属人分页查询"+ `ApprovalDecorationBelongServiceImpl` 单票落库段提公共物化入口（含状态豁免参数 + rate 按状态推导） |
| 前端 | 1 新对 + 6 改 | 新 `decorationBelongTranDetail.html/js`（审批只读详情）；改 `decoration4belong.html`（页签+modal 容器+checkbox 列）、`decoration4belong.js`（移交模式全套交互+草稿缓存——前端主要工作量）、`api/approval.js`、`api/decoration.js`、`approval4track.js`(详情路由)、字典两处。**共享弹层 decorationBelong.js 与人员页 user.js 零改动（无回归面）** |
| SQL | 4 张 | 60_approvalbelongtran(两表DDL)/61_belong_tran_operation(4端点 through=0)/62_constant_approval_type(类型27字典)/🔴38_roleoperation_belong_tran_grant(communion目录·授权投放——61登记强权限后必须配授权行否则全员被拦功能不可用；默认名单86/168/117/272×4oid×103在营公司，rid名单参数待业务圈定)；approver 各公司审批人配置留管理员维护（前端对空列表有 typeahead 手选兜底）；菜单与钉钉均取消 |
| jar | **2 个同批** | approval + decoration（跨模块新签名，须 `rm -rf target/classes` 全量编译，见提现批教训 c675c02bc）。personel 不出包。部署序：SQL→jar→前端 |
| 工作量 | 后端≈3-4 人日，前端≈2 人日，联调+test 冒烟≈1-2 人日 | 不含生产 SQL 执行窗口；渠道已收敛为系统 Web 审批，无钉钉配置量 |

## 6. 风险与边界

1. **状态白名单放宽是本方案最大语义变更**：拍板口径"移交生效点=审批通过时刻，签约单新人 default=1/rate=0"。已确认兼容边界（报表零改动，2026-11-11 复核）：签约单**后续收款转换款挂新人**（PaytranServiceImpl:849 动态读 decoration.designer），**比例业绩归零**——实时归属报表架构下移交即该单业绩清零（历史也不会留存原人，见§2 口径修正），业务接受；后续要给新人分业绩走现有单票归属审批改比例即可。rate=0 消费链已全量审计无风险：报表 4 SQL 只 sum/乘、无除 rate 运算、NERP 同步只读人部不读 rate、决算 decorationoperate 快照同口径跟随。
2. **移交后生效归属行比例和=0（签约单）属预期态**：不违反任何现存写库约束（140016"比例和=1"仅存在于单票审批通道的提交校验，移交物化入口不经过）；但需通知报表/下游消费方知晓该新形态，防被当脏数据清洗。
3. **前端缓存草稿的陈旧风险（嵌入形态固有代价）**：草稿期间单据可能被人直转过归属/签了约/进了在途审批——提交端三重复验（现归属仍=原移交人/状态在白名单/无在途审批）+ **整批拒绝并列不合格单号，绝不静默剔除**；sessionStorage TTL 24h 过期即弃；提交成功即清组。放弃的是"指派中途 PC 崩溃后精确恢复"（重做指派即可，离职移交低频操作可接受），换来的是零服务端草稿态。
4. **审批期间状态漂移**：通过后物化前逐单复核状态，任一单不合规则**整批回滚**，重新调整清单再提（宁可重发不可半做）；rate 亦以物化时刻状态推导。
5. 与既有单票归属审批互斥：提交时校验目标单无在途 decorationbelong 审批；反向，在途移交审批的单应挡住单票归属提交（防重条件加 type=27 一次扫描）。
6. 下游事件量大：N 单 ×TEAM_*_CHANGED 消息同事务写入——单批量级预计几十~几百，可接受；超大离职（上千单）建议分批提交（移交页签按页勾选自然分批）。
7. 重签单(4)已签约语义类似——纳入可移交（rate 按签约口径=0）；废单/终止/决算/完工排除。
8. **合尺多行并存的原单（与§2复用改造第1条联动）**：移交**只翻原移交人的行**（buid=原移交人），**保留同类型下非移交在职人的行**——不能沿用现有物化"整排 status=0 全失效"，否则合尺里的在职搭档被误伤。翻掉原移交人一行后按 modal 编辑值插接手人行——**rate/默认人工编辑（拍板9）使合尺缺口自然消解**：原移交人带 500 比例的单，操作员可把新人 rate 填 500 接续（默认人也按搭档是否持默认正确勾选），无需移交后再走单票审批二次调整；填 0 则同§6.1 口径归零，均由操作员当场决定。
9. 接手人本身已离职/停用必须挡住（190005 之外加在职校验）——防"死人转死人"。
10. 原人员已是离职态再补移交 = 合法路径（移交页签筛选按归属表聚合，不限在职态，离职后补办是本功能主要用法之一）。

## 7. 拍板记录（2026-11-11）

| # | 问题 | 结果 |
|---|---|---|
| 1 | 签约单可否移交、比例口径 | ✅ 可移交；比例口径原拍"系统推导不手填"，**已被 #9 修订为 modal 人工编辑+状态预填**；签约单预填 rate=0 语义与业绩报表兼容结论（见§2/§6.1）继续有效 |
| 2 | 审批粒度 | ✅ 整批一张审批 |
| 3 | 离职流程联动 | ✅ 不联动（quitUser 零改动，personel 不出包） |
| 4 | 调职 | ✅ 不关联，仅离职场景（字段预留） |
| 5 | 客户确认推送 | ✅ 不推送 |
| 6 | 审批渠道 | ✅ 系统审批（ERP Web 现有审批链），钉钉不接入——零渠道配置，approver 表登记默认审批人即可 |
| 7 | 页面形态 | ✅ 不建独立工作台页，**嵌入 decoration4belong 加"离职移交"页签**；共享弹层 decorationBelong.js 零侵入 |
| 8 | 指派与提交交互 | ✅ 页内 BS3 modal 选人，**支持多勾选一次批量指派与单行单指混用**；草稿=页面变量+sessionStorage（TTL 24h，不落库），按勾选配置情况一人一组统一发起审批 |
| 9 | rate 与默认人的确定方式 | ✅ **改为 modal 人工编辑**（比例数字框+默认勾选），系统按单据状态**预填**（签约/重签→rate=0、未签→1000）作推荐默认，可自由改；物化按编辑值落库，**不做状态推导**。提交端只硬校"每单每类型生效行恰一默认+rate∈[0,1000]"，不强校比例和=1。此改动顺带消解合尺业绩缺口 |

## 8. 备选方案对比（否掉的路）

- **B：复用现有归属审批逐单提 N 张**——被 140011 签约禁改挡死，且审批碎片化，否。
- **C：离职时脚本批量 UPDATE 三表（免审批）**——违合规要求，且绕过事件契约/留痕语义，否。
- **D：直转批量循环（免审批）**——同样撞状态白名单，且无审核环节，仅可作为拍板"不走审批"时的降级备选。

---

附：调查证据行号见各节内联；本报告引用的 `decoration/CLAUDE.md` 归属节描述已过期勿采信（表名/字段与实际不符）。
