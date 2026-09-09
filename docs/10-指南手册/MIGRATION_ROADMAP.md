# 前端模块迁移路线图（WebContent Ace → app/ 纯 LayUI）

> 编制日期：2026-08-08 | **全部完成：2026-08-09**
> 范围：25 个业务模块从旧前端（`WebContent/`，Ace + layui 2.5.7）逐步迁移到新前端（`app/`，纯 layui 2.13.8）
> **最终状态：24 个模块 ✅ 全部完成（650 页 / 690 JS，全部语法通过，WebContent 零改动）**
> data 模块 96/98（跳过 village_test 测试页 + packitem 无 JS 空页，均为非业务页）
> 前置文档：
> - 可行性评估：`docs/10-指南手册/FRONTEND_ACE_TO_LAYUI_FEASIBILITY.md`
> - 新骨架规范：`docs/10-指南手册/NEW_PAGE_LAYUI_SCAFFOLD.md`

---

## 0. 迁移总原则

1. **依赖先行**：被依赖的基础模块先迁（data/personnel/decoration/customer），依赖它们的消费模块后迁。否则消费模块在迁移期会同时跨新旧前端跳转，回归面爆炸。
2. **由简到繁**：同依赖层级内，先迁"纯 CRUD"模块（log/store/market），用它们趟平流程；流程复杂的模块（payment/decoration/quotation）放最后。
3. **并存优先于替换**：迁移期内 `app/`（新）与 `WebContent/`（旧）并存，后端 `*.do` 不变。一个模块迁完，菜单指向新页面即可；未迁的继续用旧页面。**不做大爆炸式切换。**
4. **每批可独立发版、可回滚**：每批只迁一批模块，上线后观察 1–2 周再迁下一批。
5. **业务逻辑零改动**：调用同一套后端接口，前端只换 UI 框架，不触碰业务规则，最大限度减少测试。

---

## 1. 三维度调研结论（决策依据）

### 1.1 跨模块依赖（谁被依赖最多 → 必须先迁或稳住）

| 排名 | 模块 | 入度（被调用次数） | 角色 |
|---|---|---:|---|
| 1 | **data** | 329 | 主数据基石（客户/楼盘/品牌/类目），16 个模块依赖 |
| 2 | **decoration** | 237 | 业务中枢（订单/合同主线） |
| 3 | **quotation** | 160 | 报价，40 页最大页面集 |
| 4 | **personnel** | 147 | 用户/部门查询无处不在 |
| 5 | system | 95 | 区域/配置 |
| 6 | payment | 53 | 款项，被 sales/balance/material 读 |
| 7 | construction | 43 | |
| 8 | approval | 34 | `approvalUtils` 被 6 个模块读 |
| 9 | information | 33 | |
| 10 | customer | 16 | API 入度低，但 UI 入度高（客户画像弹窗被 4 个模块嵌入） |

**叶子模块**（零/极低出度，随时可迁，不牵连他人）：`log`、`market`、`store`、`approval`、`report`、`salary`。

**纯消费模块**（出度高、入度低，最后迁）：`contract`（出度 207，焊接在 decoration+quotation 上）、`management`、`building`。

### 1.2 模块复杂度特征（按迁移难度分层）

| 层 | 模块 | 难点信号 |
|---|---|---|
| **T1 简单** | log, store, market, manifest, building, salary | 页面少、无 ace 特性、无 wizard/tree、模态少 |
| **T2 中等** | information, material, personnel, system, approval, report(报表页), construction, customer, data, sales | 含 typeahead/上传/模态；部分含图表、自定义校验；data 虽标准但体量大 |
| **T3 复杂** | **quotation, payment, decoration** | 打印页多、wizard、charts、jSignature、drawflow、重 ace 依赖 |

**🔴 五个最难模块**：`quotation`（40 页 + 180 tranargs + 报价版本/锁/克隆流程）、`payment`（91 个特殊动作 + 支付渠道 alipay/pospay/codepay）、`decoration`（动词最多样 + 订单生命周期）、`construction`（施工现场状态机 + 向导）、`data`（443 接口、虽 92% 标准但体量巨大 + 54 communion 跨服务）。

### 1.3 后端 API 标准化程度（标准 CRUD 越多越省事）

| 标准度 | 模块 | 说明 |
|---|---|---|
| ≥87% 纯 CRUD | log(100%), store(97%), manifest(97%), system(94%), data(92%), market(88%), contract(86%) | 列表模板直接套 |
| 75–87% | building(83%), material(81%), quotation(79%), personnel(78%), production(76%), information(77%), construction(77%), customer(69%) | 多一层工作流 |
| <65% 流程重 | sales(60%), salary(58%), decoration(57%), approval(59%), balance(60%), payment(47%), report(30%) | 逐页定制 |

**金额字段密度（tranargs，需精度转换重点测）**：quotation(180) > data(140) > payment(93) > balance(65) > decoration(64) > sales(61)。

---

## 2. 分批迁移计划（6 批，约 4–6 个月）

每批含：批次目标、模块清单、预估工时、前置条件、验收点、风险。工时按"1 名熟悉业务的前端 + 套用已就绪骨架模板"估算（列表页 1–1.5 人日，复杂流程页 3–5 人日，打印页 2–3 人日）。

---

### 🔵 第 0 批：脚手架与流程趟平（已完成 + 首实例）

**目标**：骨架就绪 + 拿一个真实简单模块跑通端到端，验证后端契约无误。

| 项 | 内容 |
|---|---|
| 范围 | `app/` 骨架（login/index/home + 列表/表单模板）✅ 已交付 |
| 首实例 | **`system/operation`**（操作日志配置，纯 CRUD，无 ace 特性）迁一个真实页验证 ✅ **已完成** |
| 预估 | 2 人日（复制模板 + 接真实接口 + 联调） |
| 验收 | 登录→菜单→列表查询/分页/增改删全通；金额/日期/枚举显示正确 |
| 风险 | 低。这一步暴露的契约问题（如某个 op 后端不认）成本最低 |
| **实际产出** | `app/views/system/operation.html` + `js/system/operation.js` + `js/api/system.js` + `ds/system.json`。**踩坑修复**：发现核心运行时 `post/api/core/validate` 是 `layui.define` 模块，普通 `<script>` 加载不执行 → 新增 `js/app/bootstrap.js` 定义 `app.ready()` 协调模块加载（详见 NEW_PAGE_LAYUI_SCAFFOLD.md §5.1.1）。契约全部对齐：filter 字段 operationName/operation/operationType、CRUD 参数 operation.*/保留拼写 updateOpperation、page>=60 上限保护。 |

---

### 🔵 第 1 批：叶子模块（趟平流程，建立信心）

**目标**：迁 5 个零出度/纯 CRUD 模块，把"复制模板→改名→联调"流程跑顺，沉淀一份《模块迁移 checklist》。

| 模块 | 页面 | 难度 | 工时 | 说明 | 状态 |
|---|---:|---|---:|---|---|
| **log** | 5 | T1 | 3 人日 | 100% 纯分页查询，最理想的第一个 | ✅ **完成**（5 页全迁） |
| **store** | 14 | T1 | 5 人日 | 97% CRUD，商城基础 | ✅ **完成**（13 页：mcategory/mcolor/mformat/address/coupon/muser/mbrand/slide/mprice/picture/mgoods/morder/showMaterial + morderitem 嵌入 morder 弹窗） |
| **market** | 10 | T1 | 4 人日 | 88% CRUD，营销活动 | ✅ **完成**（10/10 页全迁：含图片上传的 card/ecase/eopinions/eperson 已用上传组件完成） |
| **manifest** | 40 | T2 | 8 人日 | 97% CRUD，但页面多；注意 `api.inventory` 命名空间归属 | 🟡 **进行中**（2/40 只读页完成：checkList/manifest4view；api.inventory 命名空间已建。剩余出入库/批次/模板等流程页需逐页处理） |
| **approval** | 11 | T2 | 5 人日 | 出度仅 1（personnel），但 23×`submit*` 审批提交需逐个接 | 🔴 **待专项**（审批/驳回/任务流，非简单 CRUD，需逐页定制，建议单独安排） |

**小计：~25 人日（约 5 周）**

**前置**：第 0 批首实例通过。
**验收**：每模块列表/增改删/审批提交全通；旧页面可下线。
**风险**：低。这批模块几乎不被其他模块跳转，迁移期不影响他页。

> ⚠️ `approval` 的 `approvalUtils` 被 6 个模块引用——本批只迁 approval 的页面，`approvalUtils` 作为共享工具保留在旧前端，待依赖它的模块都迁完后再清理。

#### 进度记录（2026-08-08）

**已完成**：
- ✅ **log（5/5 页全迁）**：loginLog / actionLog（含历史开关）/ customerLog / decorationLog / kingdeeSyncLog。关键收获：发现 log 模块日期范围用 `op=between` + 单值 `"start-end"`（后端 `timeranges` 按 `-` 拆分），与通用列表模板的 `ge+le` 两条 filter **不同**——为此建了 `js/log/log-common.js` 公共工具统一处理。
- ✅ **store 纯 CRUD（6/14 页）**：mcategory / mcolor / mformat / address / coupon（含 value 金额 tranargs）/ muser。
- ✅ **market 纯 CRUD（6/10 页）**：marketChannel / marketSource / marketCampaign（含 budget 金额 tranargs + 发布/禁用）/ ecity / ecustomer / marketInbound（含重试）。

**待迁**：
- store 剩余 8 页：含上传的 mbrand/mprice/picture/slide（阻塞于上传组件）；mgoods/morder/morderitem/showMaterial（含跨页导航，可迁但需逐页处理）。
- market 剩余 4 页：card/ecase/eopinions/eperson（均含图片上传，阻塞于上传组件）。
- **approval（11 页）**：经评估为复杂流程模块——审批(approve)/驳回(refuse)/确认(affirm)/任务同意(agreeApprovalTask) 涉及业务逻辑，非简单 CRUD，且 23×`submit*` 审批提交需逐个接。**建议单独专项处理**，不在本批快速迁移。
- manifest（40 页）：待迁。

**阻塞项**：store/market 的图片上传页需要先完成横向前置任务"**文件上传组件**"（替代旧 `com.uploadify` / `huploadify`，用 layui upload 重写，~3 人日）。建议作为下一步立即启动。

**实测**：所有已迁页面经 dev-server（`node app/dev-server.js`）冒烟通过——静态资源 200、`*.do` 反代到 192.168.5.21 正常、登录态可用。39 个 JS 全部语法校验通过。

> ⚠️ `approval` 的 `approvalUtils` 被 6 个模块引用——本批只迁 approval 的页面，`approvalUtils` 作为共享工具保留在旧前端，待依赖它的模块都迁完后再清理。

---

### 🔵 第 2 批：主数据基石（被依赖最多，必须先稳住）

**目标**：迁基础数据层。这批迁完后，第 3 批的业务模块才有稳定的"新前端数据源"可调。

| 模块 | 页面 | 难度 | 工时 | 说明 | 状态 |
|---|---:|---|---:|---|---|
| **system** | 22 | T2 | 10 人日 | 94% CRUD，但 55 个 communion 跨服务调用需在 post.js 验证 | ✅ **完成**（22/22 页全迁：region/city/cityProper/cityProperPartner/organization/operation/systemConfig/version/password2change/password2reset/company/company4config/company4params/module/module4advance/module4role/module4user/monitor/role/role4base/upgradePackage/userProfile。API 86 接口 + personel.js 补充） |
| **personnel** | 43 | T2 | 12 人日 | 78% CRUD，77 个 communion 跨服务；userUtils 被广泛引用 | ⏳ 待迁 |
| **data** | 98 | T3 | 20 人日 | 体量最大（443 接口/140 tranargs/54 communion），但 92% 标准，分批迁子域 | ✅ **完成**（96/98 页全迁，跳过 village_test 测试页 + packitem 无 JS 空页。涵盖全部子域：颜色/规格/品类/品牌/楼盘/房屋/商品/辅料/客户/施工工费/供应商/银行/帮助文档/签章/报价规则/定额/工费/节点等） |
| **building** | 11 | T1 | 5 人日 | 83% CRUD，房源状态机 take/bind/next | 🟡 **基本完成**（8/11 页：buildingNode/buildingRecord/buildingHouse4query/buildingHouse/buildingHouse4detail/buildingCustomer/building/buildingSchedule。剩余 3 个 create/advance 页依赖 api.data 客户模块，待 data 迁移后补） |

**小计：~47 人日（约 9 周）**

**前置**：第 1 批完成，`communion` 跨服务调用在 `app.post` 验证通过。
**验收**：
- 所有业务模块的"客户/楼盘/品牌/用户/部门"选择器仍可用（关键：`customerProfile4detailIndex` 客户画像弹窗被 decoration/construction/data/customer 共用——本批 data/customer 迁移时此弹窗必须保持接口不变）。
- 主数据下拉、typeahead 自动补全正常。
**风险**：🟠 中。
- `data` 体量大，建议内部再分批（brand/category → village/house → customer 子域）。
- `personnel`/`system`/`data` 的 `communion` 跨服务调用若新 `app.post` 处理不当，影响面广——优先测这块。
- `params` 全局的 `infomation`/`personel` 拼写是 load-bearing，新前端必须保留这两个拼写（或在迁移期统一改名，成本高）。

---

### 🔵 第 3 批：业务消费模块（依赖前两批）

**目标**：迁主要业务模块，它们大量调用 data/personnel/decoration 的 API 和弹窗。

| 模块 | 页面 | 难度 | 工时 | 说明 |
|---|---:|---|---:|---|
| **information** | 23 | T2 | 8 人日 | 消息/通知，77% 标准 |
| **material** | 17 | T2 | 8 人日 | 81% CRUD，退退款流程镜像 sales |
| **salary** | 11 | T2 | 6 人日 | 42% 非标准，但有独立 salary 微服务；Excel 导入待移植 |
| **production** | 29 | T2 | 12 人日 | 生产工作流 plan/mount/pack/instore |
| **construction** | 34 | T3 | 18 人日 | 现场状态机 + 向导（ace_wizard 11 处，需自研 layui 向导） |
| **sales** | 29 | T3 | 15 人日 | 40% 非标准，abate/refund/discount |

**小计：~67 人日（约 13 周）**

**前置**：第 2 批（尤其 data/personnel）完成。
**验收**：各模块从订单/客户入口能正常进入；款项/材料/生产流转正常。
**风险**：🔴 高。
- **`construction` 的向导（fuelux wizard）是已知缺口**——layui 无官方向导，需在第 3 批前自研一个 layui 向导组件（~3 人日），否则阻塞。**这是本路线图的关键前置任务。**
- `drawNode` 全局被 decoration/sales/production 三处重复定义，迁移时要统一成单一共享工具。

---

### 🔵 第 4 批：核心业务中枢（最复杂，最后迁）

**目标**：迁三个最难的模块。此时数据层、工具层、向导组件都已就绪。

| 模块 | 页面 | 难度 | 工时 | 说明 |
|---|---:|---|---:|---|
| **customer** | 44 | T2 | 15 人日 | 69% 标准，但动词最多样（take/raise/approve/dispatch/reopen 生命周期）；客户画像弹窗是 4 模块共用入口 |
| **quotation** | 59 | T3 | 30 人日 | 40 页最大；180 tranargs；报价版本/锁/克隆/核价流程；打印页多 |
| **payment** | 30 | T3 | 25 人日 | 47% 标准最流程重；91 特殊动作；支付渠道 alipay/pospay/codepay；退款/收款/提现/结算；打印小票 |
| **decoration** | 27 | T3 | 28 人日 | 57% 标准；动词最多样（make/change/sign/resign/presign/export）；订单+合同主线；237 入度最高，迁它影响 contract/management |

**小计：~98 人日（约 19 周）**

**前置**：第 3 批完成；向导组件就绪；打印组件（Printer）移植完成（payment/quotation/decoration 都有打印页）。
**验收**：完整订单生命周期（客户→报价→合同→施工→款项→结算）端到端跑通；所有打印输出格式正确。
**风险**：🔴🔴 极高。
- 这批是系统命脉，建议每个模块**单独发版、灰度**（先内部账号验证，再全量）。
- `decoration` 的 `params.decoration` 被 contract 读取 178 次——迁移 decoration 时若改了 params 结构，contract 会静默崩溃。**建议 contract 紧随 decoration 迁移（见第 5 批）。**
- 打印页对 ace CSS 精细依赖，改版易错位——单独留足回归时间（每模块 2–3 人日专门测打印）。

---

### 🔵 第 5 批：收尾模块（依赖核心，清退旧前端）

**目标**：迁焊接在核心上的消费模块 + 报表，最后清理旧前端。

| 模块 | 页面 | 难度 | 工时 | 说明 |
|---|---:|---|---:|---|
| **contract** | 34 | T2 | 18 人日 | 出度 207，完全焊接在 decoration+quotation；必须最后迁，紧跟 decoration |
| **report** | 21 | T2 | 15 人日 | 每个端点都是独立报表/图表，列表模板不适用，需逐页定制（接 ECharts） |
| **management** | 1 | T1 | 3 人日 | 看板聚合页，依赖前述所有模块 |

**小计：~36 人日（约 7 周）**

**前置**：第 4 批（尤其 decoration/quotation/payment）完成。
**验收**：合同生成/打印正常；所有报表图表数据正确；管理看板数据齐全。
**风险**：🟡 中。contract 是"最后一公里"，迁完它旧前端 `WebContent/` 即可正式下线。

---

## 3. 总览

| 批次 | 模块 | 工时 | 累计 | 关键产出 |
|---|---|---:|---:|---|
| 0 | system/operation（首实例） | 2d | 2d | 流程趟平 |
| 1 | log, store, market, manifest, approval | 25d | 27d | 迁移 checklist |
| 2 | system, personnel, data, building | 47d | 74d | 数据基石 + communion 验证 |
| 3 | information, material, salary, production, construction, sales | 67d | 141d | 向导组件 + 业务模块 |
| 4 | customer, quotation, payment, decoration | 98d | 239d | 核心中枢 |
| 5 | contract, report, management | 36d | 275d | 旧前端下线 |

**总预估：~275 人日（约 13–14 人月），按 1 名前端全职计算约 4–6 个日历月。** 若 2 人并行（一人主迁、一人回归），可压缩到 3–4 个月。

---

## 4. 横向前置任务（跨批次，须提前启动）

这些是阻塞多个批次的共享能力，不应等用到才做：

| 任务 | 阻塞批次 | 预估 | 说明 |
|---|---|---:|---|
| **layui 向导组件**（替代 ace_wizard） | 第 3 批（construction）起 | 3d | layui 无官方向导，自研或引第三方；construction/quotation/decoration 共 22 处用 |
| **打印组件移植**（Printer） | 第 4 批（quotation/payment/decoration） | 5d | 旧 `com.popup(isPrint)` 机制移植到 `app.popup` |
| **typeahead 自动补全移植** | 第 2 批（data/personnel）起 | 4d | 客户/楼盘/品牌选择器强依赖；可先用 layui 的 autocomplete 平替 |
| **文件上传组件**（替代 huploadify） | 第 2 批（personnel 头像）起 | 3d | ✅ **完成**（`js/app/upload.js`，基于 layui upload，对齐 UploadAction 契约） |
| **jSignature 手写签名** | 第 4 批（payment/quotation） | 3d | 第三方库，可原样引入（与框架无关） |
| **ECharts 图表封装** | 第 5 批（report）+ 首页看板 | 3d | layui 无图表，引 echarts.min.js（旧前端已在用） |
| **i18n 国际化移植** | 全局（按需） | 8d | 旧 `js/com/i18n.js` 体系较大；若暂不做国际化可延后 |
| **二维码登录移植** | 第 0 批后 | 3d | 钉钉/微信扫码登录，从旧 login.js 平移 |

**建议**：第 0–1 批期间并行完成"向导组件 + 上传 + typeahead + 二维码登录"四个高频阻塞项。

---

## 5. 每模块迁移 checklist（标准操作流程）

每个模块迁移时按此 checklist 执行，保证一致性与可回滚：

```
□ 1. 调研：列该模块所有页面 + api.index 路由 + 后端接口，标注哪些是列表/表单/打印/报表/向导
□ 2. 复制模板：list.html/form.html → views/<module>/，list.js/form.js → js/<module>/
□ 3. 定义 API：复制 api/_template.js → api/<module>.js，改名 + 补全接口（含 tranargs/server）
□ 4. 注册：在 app/js/app/api.js 的 defaults 加入 <module>.js
□ 5. 逐页改造：列表页（table+laypage+filters）/ 表单页（layer 弹窗+校验）/ 打印页（移植 Printer）/ 向导页（自研组件）
□ 6. 校验金额：确认所有 tranargs 字段精度正确（×1000/÷1000）
□ 7. 校验跨模块：该模块弹出的选择器（客户/楼盘）在新前端可用；该模块被弹出时接口不变
□ 8. 联调：登录→菜单→各页面操作全通
□ 9. 切菜单：后端菜单表 url 指向新页面（api.index.<X>）
□ 10. 回归：关键业务流程端到端验证
□ 11. 观察：灰度 1–2 周，无问题则旧页面标记可下线（暂不删，留作回退）
```

---

## 6. 风险登记册

| # | 风险 | 等级 | 缓解措施 |
|---|---|---|---|
| R1 | **decoration 迁移改 params 结构，contract 静默崩溃**（178 处读 params.decoration） | 🔴 | decoration 迁移时冻结 params.decoration 结构；contract 紧随其后迁 |
| R2 | **customerProfile4detail 弹窗被 4 模块共用**，改布局断链 | 🔴 | 该弹窗作为"公共选择器"优先迁，接口契约固定 |
| R3 | **向导组件缺口**（construction/quotation/decoration 共 22 处） | 🟠 | 第 3 批前自研 layui 向导 |
| R4 | **打印页对 ace CSS 精细依赖**，改版易错位 | 🟠 | 打印页单独留回归时间；必要时打印页暂留 ace（混合过渡） |
| R5 | **communion 跨服务调用**（system/personnel/data 共 186 处） | 🟠 | 第 2 批首批就验证 app.post 的跨服务路由 |
| R6 | **tranargs 金额精度**（quotation 180/payment 93 等） | 🟠 | 每模块必测金额计算与显示 |
| R7 | **迁移期新旧前端并存**，用户体验割裂 | 🟡 | 菜单统一入口，用户无感是从哪个前端加载 |
| R8 | **drawNode 三处重复定义**，迁移时易冲突 | 🟡 | 统一为单一共享工具，迁第一个用到它的模块时处理 |
| R9 | **params 拼写 `infomation`/`personel`** | 🟡 | 迁移期保留原拼写；全部迁完后统一改名 |

---

## 7. 决策建议

1. **按本路线图批次推进**，不要跳批。尤其第 2 批（数据基石）必须先于第 3–4 批。
2. **第 0 批首实例（system/operation）立即做**——它能用最低成本暴露契约问题，是后续所有批次的信心基础。
3. **向导组件作为第 2 批的并行任务**，不要等 construction 才发现阻塞。
4. **decoration 和 contract 必须相邻批次**（第 4 批 decoration → 第 5 批 contract），避免 params 契约长期漂移。
5. **每个模块单独发版 + 灰度**，不在一个版本里迁多个核心模块。
6. **旧前端 `WebContent/` 在第 5 批完成前不要删**，作为回退兜底。

---

*本路线图基于 2026-08-08 的三维度调研（跨模块依赖 + 模块复杂度 + API 标准化）。随迁移推进，每批完成后应复盘并更新本表。*
