# 签约准备操作台(Sign Prepare)设计方案

> 版本:v3.2(2026-09-19,三次微调:款项区块去跳转只留状态展示;审批项隐藏——pageApproval 系操作人视角非装修单归属口径,不做展示与判定,签约硬拦由后端 140037 兜底)
> 状态:已实施完毕(实施记录见 §8),待生产发版与回归测试
> 关联记忆:material-plan-design(popup4page 弹窗页先例)、supervision4detail(嵌套弹窗 modal+.load 先例)、app.popup 先例(additem/matplan)

---

## 0. 需求与定位(拍板后)

在**现有装修单列表页(decoration.html/app 版同)新增功能按钮**(决议 #8:**原有"签约"/"预签"按钮及其直签流程一行不动**,新增按钮走新版):

- 新增"**签约准备**"/"**预签准备**"行按钮,点击弹出**签约准备弹窗**:一屏展示该单全部签约前置条件状态,以 **checklist 向导+说明**形式逐项列出签约前未完成/待确认的工作;
- 弹窗内可**就地完成轻操作**(报价锁定/解锁、活动锁定/解锁、合同创建与签署推进、放线时间设置、放线申请等),**不做详细编辑**(报价编辑、收款登记、物品申领等回原页面);
- 全部硬条件就绪后,弹窗内"确认签约"衔接**既有签约弹窗**(drawContractModal,券优惠/净业绩/复合业绩/工程公司表单为必填,不可省);
- **预签同批支持**(预签口径独立,见 §2.3);重签不做。

红线:**零 DDL、操作全部复用既有后端接口**;新增后端 = 一个**单单聚合查询**(编排既有 DAO,零新 SQL);新增配置仅 decorationfunction 主表 2 行 pageBtn 定义(幂等,公司授权走装修功能配置页勾选或附带批量右行 SQL);权限 = pageBtn 控制新入口按钮显隐 + 各接口既有 operation 校验兜底(拍板 #2/#5)。

## 1. 现状盘点(事实基础,实施对照用)

### 1.1 正式签约硬校验(`signDecorationContract`,`DecorationContractServiceImpl.java:505-685`)

| # | 校验 | 行号 | 错误码 |
|---|------|------|--------|
| 1 | 装修单存在 | :520-522 | 140013 |
| 2 | 状态 ∈ {0 初始, 1 定金, 2 预签, 4 重签} | :524-526 | 140005 |
| 3 | 合同款已付/已确认:oneType=0、twoType=1、paymentStatus ∈ {1,2} | :528-532 | **140006** |
| 4 | 无未处理审批 `countApprovalForInitByIdent==0` | :534-536 | 140037 |
| 5 | 默认报价存在(defaults=1) | :538-542 | **140008** |
| 6 | 工程信息存在 | :544-548 | 120020 |
| 7 | `constructionInfo.drawlineTime != null` | :554-556 | **120032** |

签约执行:自动锁定该单全部报价(:558)、status→3、写 contractTime、designStatus 0→1、记 sign 业绩、发 CUSTOMER_SIGNED 消息。**不校验活动、不校验电子合同**。

### 1.2 预签硬校验(`presignDecorationContract`,`:744-826`)

| # | 校验 | 行号 | 错误码 |
|---|------|------|--------|
| 1 | 装修单存在 | :751-753 | 140013 |
| 2 | 状态 ∈ {0,1,2} | :755-757 | 140005 |
| 3 | 活动存在 | :759-761 | **140033** |
| 4 | 活动已锁定 | :763-765 | **140060** |
| 5 | 预签报价 ProtationPO 存在 | :767-771 | **200046** |
| 6 | protation.status==锁定 | :773-775 | **200047** |

预签执行:status→2、写 precontractPrice/precontractTime、记 prosign 业绩。

### 1.3 软前置(后端不拦,业务要求;弹窗内作"建议完成"项)

| 项 | 机制与既有接口 |
|----|--------------|
| 报价预先锁定 | `lockQuotation`(前置 attstatus=3、status=0、无未关联选材项 200041)/`unlockQuotation`(前置装修单未签约 200005);签约时自动锁全部,签约后不可解锁 |
| 活动参加+锁定 | decorationactivity.status 0↔1,每单限一个;`add/delete/lock/unlockDecorationActivity`;锁定后不可删、不可再申领物品;换活动=删(须未锁)后加 |
| 电子合同创建+签署 | `addDecorationContract`(仅要求模板存在 130044)→ `signDecorationContractForCompany/ForCustomer` → `affixDecorationContract`(0→1)→ `filingDecorationContract`(→3);与订单签约**两条独立链路**,仅 orderId 弱关联 |
| 定金/合同款收取 | 首笔收款 0→1 定金态;`collectDecorationPayment` 收款弹窗为重表单,本页只展示+跳转 |
| 放线 | 签约只看 drawlineTime;`applayDrawLine`(要求默认报价存在);放线完成属开工侧 |

## 2. 页面设计

### 2.1 入口与流程(新增按钮,原按钮保留,决议 #8)

**老版 `decoration.js`**:

- **原"签约"按钮(sign 键,:1678-1689,status∈{1,2,4})与原"预签"按钮(pcontract 键,:1393-1412,status∈{0,1})行为完全不动**——保留直签/直预签流程,老用户习惯零影响。
- 新增"**签约准备**"行按钮(新键 `signprepare`,显示条件与原签约按钮一致:status∈{1,2,4} 且 pageBtn 含 `signprepare`):点击弹签约准备弹窗(**正式签约模式**)。
- 新增"**预签准备**"行按钮(新键 `presignprepare`,status∈{0,1}):点击弹签约准备弹窗(**预签模式**)。
- `#customerInfoBtn` 第二签约入口保持不动。

**app 版 `app/js/decoration/decoration.js`**:sign(:167-169)/pcontract(:77-80)原按钮不动,同位置新增两个准备按钮,弹 app 版准备页(app.popup,照 matplan/additem 先例)。

### 2.1.1 准备弹窗页 `decoration4sign.html`(老版被 popup4page 加载;app 版独立双文件)

**挂载**:decoration.html 加 `#signPreparePopUp` holder;`com.popup4page("#signPreparePopUp", "/views/decoration/decoration4sign.html", "签约准备")`,params 传 `decoration.orderId` + `mode`(sign/presign)。弹窗页尾部 `$.loadScript` 挂载🔴(popup4page 惯例)。

**结构**(checklist 向导式,一屏):

1. **顶部摘要行**:订单号/客户/楼盘/面积/设计师/总价/当前状态 + 模式徽标(正式签约/预签)+ 就绪度汇总("硬条件全部满足,可签约"绿 / "缺 N 项"红)。
2. **前置条件 checklist**(正式签约模式 8 项,预签模式 6 项,§2.2.1/§2.2):每项 = 状态图标(✓绿满足/✗红硬缺/!黄建议未完/—灰不适用) + 标题 + **说明文字**(该项作用、当前值、不满足原因、去哪完成) + 轻操作按钮/跳转链接。自上而下即办理顺序,构成"简单向导"。
3. **底部动作区**:全部硬项 ✓ 时"确认签约"(预签模式"确认预签")亮起 → 老版衔接既有 drawContractModal(预签为既有 presign 确认链);未就绪时按钮置灰 + 点击滚动定位到第一个红项。

### 2.2.1 正式签约模式 checklist(8 项)

| # | 项 | 硬/软 | 展示 | 轻操作(直调既有接口)/跳转 |
|---|----|------|------|--------------------------|
| 1 | 订单状态可签 | 硬 | 当前状态值;✗ 时说明(已签约/废单等) | — |
| 2 | 合同款已收 | 硬 | 已收合同款金额+状态 | 跳装修款页/详情页款项节点(收款重表单不在此做) |
| 3 | 默认报价存在 | 硬 | 版本/总价/状态/attstatus | 无→跳报价页;有且 attstatus=3 且 status=0→**锁定报价**;status=1→**解锁报价**(附说明:签约时将自动锁定) |
| 4 | 活动已锁定 | **软**(正式签约不拦) | 未参加/已参加未锁/已锁定+活动名 | **锁定/解锁活动**;跳 decoration4activity(参加/换活动/申领物品);说明:预签硬要求,锁定后防误改 |
| 5 | 电子合同已签署 | **软** | 未创建/待签(0)/已签(1)/归档(3)+签署进度 | **创建合同**(嵌套弹窗加载 decorationContract2create,modal+.load 照 supervision4detail 先例)/公司签/客户签(取URL)/确认已签/废止;跳合同页;说明:签约与合同签署相互独立,建议签约前完成 |
| 6 | 预计放线时间已配置 | 硬 | drawlineTime 值/✗ | **设置放线时间**(日期弹窗,updateConstructionInfo;若要求全量回传则先 query 再改,实现时核对) |
| 7 | 工程信息存在 | 硬 | 一般都有 | ✗ 时跳工程信息页 |
| 8 | 审批已清零 | 硬 | N 条未处理 | 跳审批页(处理属审批模块) |

### 2.2 预签模式 checklist(6 项,对齐 §1.2)

| # | 项 | 硬/软 | 展示与操作 |
|---|----|------|-----------|
| 1 | 订单状态 ∈ {0,1,2} | 硬 | 当前状态值 |
| 2 | 已参加活动 | 硬(140033) | 活动名;未参加→**参加活动**(有效活动下拉 queryActivityForValid type=1 + addDecorationActivity)或跳 decoration4activity |
| 3 | 活动已锁定 | 硬(140060) | **锁定活动**/解锁 |
| 4 | 预签报价存在 | 硬(200046) | protation 总价/状态;跳预签报价页(protationIndex) |
| 5 | 预签报价已锁定 | 硬(200047) | 跳 protationIndex 完成锁定(实现时核对 protation 锁定接口与前置) |
| 6 | 合同款/定金参考信息 | 软 | 展示已收款项概况(辅助判断,不拦截) |

### 2.3 权限与配置(拍板 #2/#5 + 决议 #8)

- **入口按钮**:新按钮走 decoration 页既有 pageBtn 白名单机制,新键 `signprepare`/`presignprepare`——**不插配置行则按钮不显示**(白名单性质,老版/app 版同)。原 `sign`/`pcontract` 键配置零变更。
- **配置 SQL**(本方案唯一 SQL,照 `sqls/decoration/add_decoration_create_buttons_function.sql` 先例):
  1. decorationfunction 插 2 行 pageBtn 定义(`signprepare`/`presignprepare`,type=4/subtype=1,幂等);
  2. 公司授权二选一:①执行后到**装修功能配置页**(decorationFunction.html)按公司手工勾选(先例惯例);②附带一段按装修单页公司集批量插 decorationfunctionright 右行的可选 SQL(🔴 无 company=0 回退,须逐公司插行)。
- **弹窗内动作**:签约/预签/各轻操作接口本身受 **operation 权限**校验(AccessInterceptor 拦截),前端不做额外白名单——无权限用户点击后由拦截器统一返回错误。
- 不新增菜单、不改既有 decorationfunction 行。

## 3. 技术设计

### 3.1 数据层(v3.0 定稿:**前端拼装既有接口,零后端改动**;v2.x 的后端聚合已撤销)

弹窗页打开时同步串行调 8 个既有接口拼装 checklist 数据,不新增任何后端接口/VO(DecorationSignPrepareVO 已删除,Service/Action 方法已回滚):

| 数据 | 既有接口 | 口径说明 |
|------|---------|---------|
| 订单基础 | `decoration.queryDecorationForCommonByOrderId` | status/orderTotalPrice/customer/house/designer |
| 款项 | `payment.queryDecorationPaymentForContractByOrderId` | **与签约校验同源**(DecorationPaymentServiceImpl:205-217 与 signDecorationContract:528 同一 DAO 调用:收款+合同款+已付/已确认);前端合计 referMoney,非空即 paymentReady |
| 默认报价 | `quotation.queryQuotationForDefaultByOrderId` | qid 非空即存在;status/attstatus/totalPrice/version.name |
| 活动 | `decoration.queryDecorationActivityByOrderId` | 存在任一 status=0 行即未锁定(预签同口径) |
| 合同 | `decoration.queryDecorationContractByOrderId` | 取 dcid 最大(最新创建)一份的状态 |
| 工程信息 | `construction.queryConstructionInfoByOrderId` | drawlineTime 非空即就绪 |
| ~~审批~~ | (v3.2 废止) | pageApproval 带操作人 company 过滤,系操作人视角而非装修单归属口径,展示会误导——审批项整体隐藏,signReady 判定不含审批,签约硬拦完全由后端 140037 兜底 |
| 预签报价 | `quotation.queryProtationForDefaultByOrderId` | pid 非空即存在;锁定=status 2 |

就绪汇总(signReady/presignReady)由前端按 §1.1/§1.2 口径计算,与后端校验逐条对齐。金额 tranargs 各接口既有定义已覆盖(÷1000),前端展示直接用返回值;报价/工程/预签域接口 fail 时静默(PO 不存在会抛错,属预期分支)。

### 3.2 前端

- 老版:`decoration.js` **新增** signprepare/presignprepare 两行按钮(原 sign/pcontract 逻辑不动)+ 新 `views/decoration/decoration4sign.html` + `js/decoration/decoration4sign.js`(8 接口拼装);`decoration.html` 零改动(#layerPopUp 既有);创建合同嵌套弹窗复用 popup4page(decorationContract 页同款先例)。
- app 版(同批,拍板 #4):`app/views/decoration/decoration4sign.html` + `app/js/decoration/decoration4sign.js`(layui,同款 8 接口拼装)+ `app/js/decoration/decoration.js` 新增两按钮(原按钮不动);接口与老版共用,`app.post` 第 5 参 false 同步(query/page 开头接口天然免防重)。
- 签约提交链完全复用:老版 drawContractModal 表单+signDecorationContract;预签复用既有 presign 确认;事件桥 `decoration:signprepare`(老版同 window / app 版 parent document)。

### 3.3 发版(v3.0)

两件:①decorationfunction 2 行配置 SQL(幂等,🔴 先行)+ 公司勾选;②前端文件(WebContent 2 改 2 新 + app 2 改 2 新)。**无需发 jar(后端零改动)**;SQL 插行而前端未发版无副作用。

## 4. 开发计划

| 阶段 | 内容 | 交付物 | 工作量 |
|------|------|--------|--------|
| 0 | 实现前核对三处口径:①countApprovalForInitByIdent 的 ident 过滤;②updateConstructionInfo 是否全量回传;③Protation 查询/锁定接口;④decorationfunction 既有 sign/pcontract 行的 type/subtype 取值(新键照抄) | 核对记录入本文档 | 0.25 天 |
| 1 | 后端:VO + Service 聚合方法 + Action 方法 | decoration 模块代码 | 0.5 天 |
| 2 | 老版前端:新增两按钮 + decoration4sign 弹窗页 + api 注册 | 4 处前端改动 | 1 天 |
| 3 | app 版同构:双文件 + 新增两按钮 + api 注册 | 3 处前端改动 | 1 天 |
| 4 | 配置 SQL:decorationfunction 2 行 + 可选批量右行 | 1 个 SQL 脚本(幂等) | 0.25 天 |
| 5 | 联调 + 测试矩阵(§5)+ jar 构建 | fanglin-decoration-8.3.0xx | 0.5 天 |

## 5. 测试矩阵

1. **正式签约两路**:八项全绿→确认签约亮起→衔接 drawContractModal→签约成功(状态 3、报价自动锁、业绩/消息正常);缺任一硬项(六种)→红标+说明+按钮置灰+定位滚动。
2. **预签两路**:六项全绿→确认预签→status 2+precontractTime;缺活动/活动未锁/无 protation/protation 未锁四路红标。
3. **软项行为**:活动未锁/合同未创建不拦正式签约(黄标);报价 attstatus≠3 时锁定按钮置灰+提示;签约后(unlock 场景)不可解锁报价。
4. **轻操作回归**(与本页操作后原页面状态同步):本页锁报价↔quotationIndex 状态;锁活动↔decoration4activity 不可删;创建合同↔decorationContract 页可见;设放线时间↔drawline4apply 工程信息;申请放线↔放线队列出现。
5. **权限与配置**:无 operation 权限用户点签约/轻操作→拦截器报错正常;🔴 未插 decorationfunction 行/未勾选公司的 pageBtn 不含新键→新按钮不显示(老版+app 版都验);已勾选公司正常显示。
6. **双版一致**:老版/app 版 checklist 项、口径、操作结果一致。
7. **原功能回归(决议 #8 核心)**:原 sign 按钮直签流程、原 pcontract 直预签流程、`#customerInfoBtn` 直签入口、resign 重签按钮——四者行为与改造前完全一致;新按钮与原按钮可同屏共存(status 同时满足时)。

## 6. 风险清单

| 风险 | 缓解 |
|------|------|
| Service 补注入 DAO 的模块 jar 版本(运行时 Spring byName 注入) | 引用的均为生产已部署既有类;构建后启动验证 Bean 装配 |
| updateConstructionInfo 全量回传/Protation 接口口径不明 | 阶段 0 先核对 |
| 新按钮键配置遗漏致按钮不显示(白名单性质) | 阶段 4 SQL + 测试矩阵 5 专项验证;上线 checklist 含"勾选公司"步骤 |
| 嵌套弹窗冲突(popup4page 内创建合同模板填写页) | 照 supervision4detail 先例 Bootstrap modal+.load |
| 弹窗页脚本未挂载(静默死亡) | 尾部 $.loadScript 红线 |
| app 版 layui 表单校验坑(select 必填被跳过) | 参照 app-scaffold-validate-pitfalls 记忆:doSave 手动判 |

## 7. 拍板记录(2026-09-19)

1. 形态:**装修单页功能按钮弹窗**(非独立页、非列表页);弹窗内 checklist 向导+说明展示签约前未完成工作 ✅
2. 签约动作:入本页,权限走 **operation** 控制接口 ✅
3. 预签:**同批支持**;重签不做 ✅
4. app 版:**同批** ✅
5. 权限:入口走 pageBtn,弹窗内依赖接口 operation 校验 ✅
6. 缺项反查:不做 ✅
7. **不做独立待签约查询 page**,利用现有装修单页面加功能 ✅(后端随之取消分页聚合,仅留单单聚合)
8. **保留原有签约/预签按钮及直签流程,新增 signprepare/presignprepare 两按钮适配新版功能** ✅(代价:decorationfunction 2 行配置 SQL + 公司勾选;原按钮零改动)

---

## 8. 实施记录(2026-09-19)

### 8.1 阶段0 核对结论(实施前已验证)

1. 审批口径:`countApprovalForInitByIdent` = `approval.approval where ident=:orderId and status=0`,聚合直接复用同方法零漂移;
2. 放线时间:老版放线页先例(drawline4apply)= 先 `queryConstructionInfoByOrderId` 回填再全量 `updateConstructionInfoByOrderId` 提交;timeLimit 走 tranargs 双向换算(查询÷1000/提交×1000)闭环安全;
3. protation:`queryProtationForDefaultByOrderId`,锁定=STATUS_LOCK_INT(2,注意与 QuotationPO 的 1 不同);活动口径=presign 用 `countDecorationActivity(orderId,INIT)>0` 判未锁定,聚合改为逐行判定等价实现;
4. 配置:pageBtn 行=`key:'pageBtn'/value:按钮键/type:4/subtype:1`;right 表 name=角色变体名(designer/synthesize/finance 等 25 个,即 decoration.html?depage=xxx);生产授权实测 sign=directer96+finance74+designermanager2,pcontract=finance73+designermanager2。

### 8.2 后端(decoration 模块,零新 SQL 零新 DAO 零补注入)

- `decoration/vo/DecorationSignPrepareVO.java`(新增):26 字段含 quotationQid/activityDaId/contractDcid 三个操作回链 id;
- `DecorationContractServiceImpl.queryDecorationForSignPrepareByOrderId`(Service 接口+实现):**所需 8 个 DAO 全部已在既有注入区**(:88-163),纯编排;signReady/presignReady 与 sign/presign 校验逐条对齐;
- `DecorationContractAction.queryDecorationForSignPrepareByOrderId`(Action+getter/setter)。

### 8.3 老版前端

- `WebContent/js/api/decoration.js`:api.index.decorationSignPrepareIndex + api.decoration.queryDecorationForSignPrepareByOrderId(tranargs:orderTotalPrice/paymentMoney/quotationTotalPrice/protationTotalPrice ÷1000);
- `WebContent/views/decoration/decoration4sign.html` + `js/decoration/decoration4sign.js`(新增):checklist 双模式渲染(正式签约 8 项/预签 6 项)+ 轻操作(锁定/解锁报价与活动、创建合同(嵌套 popup4page #signLayerPopUp)、客户签(popup4frame)/确认已签/废止、设置放线时间(先查后全量)、申请放线、参加活动)+ 事件桥 `decoration:signprepare`;
- `WebContent/js/decoration/decoration.js`:linebtns 新增 `presignprepare`(pcontract 后)/`signprepare`(sign 后)两按钮(原按钮零改动)+ `openSignPrepare`(popup4page 复用 #layerPopUp,关弹窗回调 searcher.doSearch)+ 事件桥监听(sign→signOrder/presign→既有确认链/goto→六页跳转,layer.closeAll 后衔接);
- `decoration.html` 零改动(#layerPopUp:799 既有)。

### 8.4 app 版(iframe 机制)

- `app/js/api/decoration.js`:同款两处注册;
- `app/js/decoration/decoration.js`:reg 两按钮(显示条件同老版)+ `openSignPrepare`(app.popup iframe,end 回调刷新)+ 事件桥监听(同 window parent document);
- `app/views/decoration/decoration4sign.html` + `app/js/decoration/decoration4sign.js`(新增):layui 同构,上下文读 `(parent.app.params.signPrepare)||(app.params.signPrepare)`(approvalFlowCreate 先例);弹窗用 layer.open type:1+页内隐藏 div;确认签约/预签/跳转经 `parent.$(parent.document).trigger` 回宿主。

### 8.5 SQL 与发版

- `sqls/decoration/decoration_sign_prepare.sql`:decorationfunction 2 行(幂等)+ 可选授权复制段(INSERT...SELECT 复制 sign/pcontract 授权集,含核验查询);
- jar:**fanglin-decoration-8.3.032.000**(309974B,BUILD SUCCESS;🔴 8.3.031.000 已被退报单批次占用故升版;含退报单批次既有内容+本次聚合查询);
- 发版顺序:SQL → jar → 前端(老版 4 文件 + app 5 文件)。

### 8.6 待办

- 测试矩阵 §5 未跑(dev 库凭据已失效无法联调,需生产/恢复 dev 后回归);
- 代码未提交(待用户指示);
- 上线 checklist:①执行 SQL(含或不含授权复制段);②替换 jar;③发前端;④未勾选公司的 pageBtn 不含新键→按钮不显示属预期。

### 8.7 v3.0 改造记录(2026-09-19 同日,用户拍板:撤销后端聚合 VO,前端拼装既有接口)

- **后端全部回滚**:删除 `DecorationSignPrepareVO.java`,git checkout 还原 DecorationContractAction/DecorationContractService/DecorationContractServiceImpl(残留 grep 清零);🔴 **fanglin-decoration-8.3.032.000 jar 作废勿发**(后端零改动,§8.2 的后端实施记录仅作历史留档);
- 两版 `js/api/decoration.js` 删除聚合接口注册(api.index.decorationSignPrepareIndex 保留);
- 两版 `decoration4sign.js` 数据层重写:queryData 改为 8 个既有接口同步串行拼装(§3.1 表),渲染/轻操作/事件桥零改动;款项域与签约校验同源接口,审批计数用 pageApproval+filters(totalRecords,company 过滤可能有微小偏差→前端参考口径,后端 140037 兜底);
- 发版缩为两件:SQL + 前端(零 jar)。

### 8.8 v3.1 改造记录(2026-09-19 同日,用户拍板:就绪台内加载对应数据就地完成操作,不再跳转;收款不就地收款、审批仅提示)

- **就地化新增**(两版弹窗页同构):
  - 款项区块:加载全单款项明细(`queryDecorationPaymentByOrderId`,详情页 initPayment 同款接口),checklist 内逐行展示 类型/应收/状态;保留"去装修款页"跳转(收款豁免,收款表单含六种方式不就地复刻);
  - 报价区块:展示报价构成(优惠内/优惠外/运费/管理费,quotation VO 现成字段);无报价时给"刷新"按钮;**去"去报价页"跳转**;
  - 活动区块:补"换活动"(确认→deleteDecorationActivity→刷新后重新参加)与未参加时"参加活动";**去"去活动页"跳转**;活动有效期展示;
  - 合同区块:补**公司签**(querySignet 签章下拉+signDecorationContractForCompany{dcid,sid},与 decorationContract 页同参)与**查看合同**(viewDecorationContract→popup4frame/parent.app.popup);**去"去合同页"跳转**;
  - 预签报价区块:补**就地锁定/解锁**(lockProtation/unlockProtation{pid},锁定条件 status=0/解锁条件 status=2);**去"去预签报价页"跳转**;app 版 api/quotation.js 补 lock/unlockProtation 两行注册;
  - 审批区块:**去"去审批页"按钮**,仅状态+提示文字("请先处理完相关审批后再回本页签约",处理不就地)。
- **宿主事件桥裁剪**:两版 decoration.js 的 goto 分支只留 payment,删 quotation/activity/contract/protation/approval 五分支(不再触发)。
- checklist item 渲染支持 detail 明细行(款项列表)。
- 发版物不变:SQL + 前端(零 jar)。

### 8.9 v3.2 改造记录(2026-09-19 同日,用户拍板)

- **款项区块**:删除"去装修款页"跳转按钮(准备台操作人基本无装修款页权限),仅保留款项明细状态展示(明细列表不变);
- **审批项整体隐藏**:pageApproval 计数是当前操作人视角(带 company 过滤)而非装修单归属口径,展示会误导——checklist 删审批项、数据层删审批查询(少一次请求)、signReady/presignReady 判定不含审批;存在未处理审批时由后端签约校验 140037 报错兜底;
- **宿主事件桥**:goto 分支整体删除(仅剩 sign/presign 两个动作),两版弹窗页分发同步删 goto 分支;
- 正式签约 checklist 由 8 项收敛为 7 项,预签 6 项不变(款项参考无按钮)。
