# A20261025Action 对外接口调用说明

> 模块: seiya (NERP预签/签约/报价/款项/销售款项/增减款同步接口)
> 版本: 2.4
> 日期: 2026-11-24
> 变更:
> - v2.4 (2026-11-24) 迁移期校验放宽三处（阻断改幂等跳过，重推不再报错）：syncQuotationForNerp 移除报价锁定拦截（200033 删除，锁定报价允许更新）；syncDecorationPaymentForNerp 移除"款项已付不可重建"拦截（150001 删除，已付/审批中改为幂等跳过返回 operation=exists，已收款项行保护不变不删除）；syncSignContractForNerp 已签约单重推改为幂等跳过返回（原 140005 拦截，不重复执行提成挂账/消息副作用）。
> - v2.3 (2026-11-22) syncQuotationForNerp 支持装修单优惠五列同步：couponCut/thingCut/factPrice/orderTotalPrice/quotationPrice 更新分支传入即写 decoration 对应列（null 不动，创建分支不写——装修单金额随签约接口），返回体补五列终值对账口径。
> - v2.2 (2026-11-21) 新增报价单主数据同步 syncQuotationForNerp（A20261025 家族第 6 端点）：报价单创建或更新（不含明细，不推进装修单状态），凭空建单不锁单无提成消息副作用，已有报价部分更新（null 字段不动），锁定报价拒绝 200033。
> - v2.1 (2026-11-13) 新增销售款项同步 syncSalesPaymentForNerp（sales.sales + payment.salespayment, type=2 定金/3 补款/4 退款, 判断补充式建销售单+落待收/待退款项, 退款凭空生成 salesRefunds）与增减款同步 syncAddreduceForNerp（quotation.addreduce + payment.decorationpayment 增减款, 判断补充式建增减单+经提交链落未收款项）；零 DDL, 幂等锚嵌既有文本列（NERP: 前缀隔离）。
> - v2.0 (2026-10-25) 原 A20261024Action（凭空预签 syncProsignForNerp）合并入本 Action，三接口统一承载；接口路径/参数/行为不变，调用方零感知。

---

## 一、接口概述

`A20261025Action` 提供以下六个接口，供 NERP 等外部系统为迁移单补齐 ERP 单据与业务流转，**生成的款项均为待收/待退状态，收款/退款动作统一在 ERP 走正常流程**：

| 接口 | 路径 | 用途 |
|------|------|------|
| NERP凭空预签 | `POST /syncProsignForNerp.do` | 不依赖 ERP 预签报价流程，凭空创建一张无明细的锁定预签单（protation，业务字段按入参回填），并将装修单推进到预签状态 |
| NERP凭空签约 | `POST /syncSignContractForNerp.do` | 匹配 ERP 签约（signDecorationContract）：订单无报价时凭空创建报价单并锁单，装修单推进签约状态(3) |
| NERP凭空款项计划 | `POST /syncDecorationPaymentForNerp.do` | 匹配 ERP 款项生成（makeDecorationPayment）：按款项比例方案生成未收合同款项，后续收款走 ERP 正常流程 |
| NERP报价单数据同步 | `POST /syncQuotationForNerp.do` | 报价单主数据同步（创建或更新，不含明细，不推进装修单状态）：无默认报价凭空建无明细初始报价单（不锁单/无提成消息副作用），有默认报价按传参部分更新（null 字段不动）；**支持装修单优惠五列同步**（couponCut/thingCut/factPrice/orderTotalPrice/quotationPrice 更新分支传入即写） |
| NERP销售款项同步 | `POST /syncSalesPaymentForNerp.do` | 兼容 sales.sales / payment.salespayment：销售单判断补充（不存在凭空创建），落待收/待退款项（type=2 定金/3 补款/4 退款），退款凭空生成退货单 salesRefunds，后续收款/退款走 ERP 正常流程 |
| NERP增减款同步 | `POST /syncAddreduceForNerp.do` | 兼容 quotation.addreduce / payment.decorationpayment：增减单判断补充（不存在凭空创建），经 ERP 提交链落未收增项款/减项款（dpId 关联），后续收款走 ERP 装修款流程 |

六接口均为"迁移补齐"语义：ERP 页面流转要求已有预签单/报价/已收款/工程信息等前置，迁移单不具备，故凭空放宽；其余副作用（状态推进、归属回刷/提成挂账、操作留痕、消息联动）与页面操作完全同路。payment 数据一律经由对应单据（销售单/增减单）的生成过程产生，不裸落。

**推荐调用顺序**: 合同域 `syncProsignForNerp`(预签) → `syncDecorationPaymentForNerp`(款项计划) → `syncSignContractForNerp`(签约)；报价主数据 `syncQuotationForNerp`（签约前后均可，锁定前有效）；销售域 `syncSalesPaymentForNerp`(销售款项, 可多笔按 type 逐笔推)；增减域 `syncAddreduceForNerp`(增减款)。顺序不强制（签约不要求款项已收），但按此序与 ERP 真实业务流转一致。

---

## 二、请求约定

### 2.1 基础地址

```text
http(s)://{ERP_HOST}/{接口路径}
```

### 2.2 HTTP 约定

| 项目 | 要求 |
|------|------|
| HTTP 方法 | `POST` |
| 请求 Content-Type | `application/x-www-form-urlencoded` |
| 字符编码 | **UTF-8**（名称/产品/备注等文本字段） |
| 响应内容 | JSON |
| 响应 Content-Type | 当前 Action 配置为 `text/html`，调用方仍应按 JSON 解析响应体 |

### 2.3 认证参数（必传）

接口走 ERP 统一鉴权（AccessInterceptor），operation 配置为 `through=2`（免登通用）：

- **`authentication` 必传**，否则返回 110005（登陆超时）
- 值为 **ERP 分配的认证串**（AES 加密的账号标识），无需 ERP 登录态
- 认证串对应账号将作为预签单创建人、签约人（contracter）、报价创建人、款项创建人、销售单/增减单创建人与操作记录操作人（六接口同一对接账号）
- 认证串无效返回 -2（无操作权限）

### 2.4 通用响应格式

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": { ... }
}
```

- `errorCode=0` 表示成功，非 0 为错误码（见各接口错误码表）
- 业务数据统一在 `data` 对象中返回

---

## 三、接口详情

### 3.1 NERP凭空预签 - syncProsignForNerp

**接口路径**: POST /syncProsignForNerp.do

**功能说明**: 对指定装修单执行预签。整体单事务，任一步失败全部回滚，不产生半状态数据。

**业务规则**（按校验顺序）:

1. 装修单存在，不存在返回 140013
2. 装修单状态必须为 **初始(0)** 或 **定金(1)**，否则返回 140004（已预签/已签约等后续状态一律拒绝）
3. 认证串对应账号存在，无效返回 400040
4. `ppid > 0` 时校验预签产品存在，无效返回 130080
5. `qvid > 0` 时校验报价版本存在，无效返回 200050
6. 该单**不存在默认预签单**，已存在返回 400044（防止覆盖 ERP 侧正常报价流程产生的预签单）
7. 凭空创建预签单：业务字段按入参回填（未传字段保持 0/空）、状态=锁定(2)、默认单(defaults=1)、**无预签单明细**
8. 更新装修单：`precontractPrice = totalPrice`、`precontractTime = 当前时间`、状态推进为**预签(2)**
9. 归属信息（设计/业务）的部门、大区按归属人当前部门回刷，并刷新附加信息中的设计/业务快照
10. 写入装修单操作记录（Prosign）与消息队列（复用 `presignDecorationContract` 事件），下游客源状态联动与页面预签完全一致

**幂等性**: 接口**非幂等**。同一单重复推送会被拒绝（已预签→140004；已有预签单→400044），**调用方应将这两种错误码视为"目标状态已达成"**，不要当作失败重试。

#### 请求参数

除 `authentication`、`orderId` 外全部可选；可选字段**不传即保持 ERP 缺省值 0/空**，传了才回填。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| name | String | 否 | 预签单名称，缺省 `预签单` |
| ppid | Long | 否 | 预签产品ID（ERP 分配，>0 时校验存在） |
| qvid | Long | 否 | 报价版本ID（ERP 分配，>0 时校验存在并挂接，预签单页面"版本"列显示其名） |
| product | String | 否 | 产品名称 |
| comment | String | 否 | 备注 |
| **totalPrice** | Long | 否 | **总价/预签合同额，单位:分**（缺省0；同时写入装修单预签合同额，是装修单口径的关键金额） |
| quotePrice | Long | 否 | 起报价，单位:分（缺省取 totalPrice） |
| quoteArea | Integer | 否 | 面积，**单位:平米×1000**（如 116000 = 116 平米） |
| unitPrice | Long | 否 | 计价单价，单位:分 |
| costPrice | Long | 否 | 成本价，单位:分 |
| profitRate | Integer | 否 | 利润率（按 ERP 页面口径） |
| basicPrice | Long | 否 | 基础额，单位:分 |
| comdPrice | Long | 否 | 工程额，单位:分 |
| commPrice | Long | 否 | 主材额，单位:分 |
| adddPrice | Long | 否 | 增工额，单位:分 |
| addmPrice | Long | 否 | 增主额，单位:分 |
| subdPrice | Long | 否 | 减工额，单位:分 |
| submPrice | Long | 否 | 减主额，单位:分 |
| subcPrice | Long | 否 | 预签项差额，单位:分 |
| accdPrice | Long | 否 | 附加设计额，单位:分 |
| accmPrice | Long | 否 | 附加管理额，单位:分 |
| mostPrice | Long | 否 | 主材成本，单位:分 |
| costRate | Integer | 否 | 工程增项成本比例（按 ERP 页面口径） |
| mostRate | Integer | 否 | 主材增项成本比例（按 ERP 页面口径） |
| totalCost | Long | 否 | 成本总额，单位:分 |
| totalProfit | Long | 否 | 利润总额，单位:分 |
| discount | Integer | 否 | 折扣，**万分比，10000=不打折**（如 7500 = 75折） |
| manageRate | Integer | 否 | 管理费比例（按 ERP 页面口径） |
| manageFormula | String | 否 | 管理费公式 |
| manageDiscount | Integer | 否 | 管理折扣（按 ERP 页面口径） |
| managePrice | Long | 否 | 管理费，单位:分 |
| taxRate | Integer | 否 | 税金比例（按 ERP 页面口径） |
| taxFormula | String | 否 | 税金公式 |
| taxPrice | Long | 否 | 税金，单位:分 |
| preferPrice | Long | 否 | 优惠价，单位:分 |
| activityPrice | Long | 否 | 浮动额，单位:分（**ERP 内部预签优惠审批的金额上限即此值**） |
| activityProfit | Long | 否 | 活动优惠，单位:分 |
| manageProfit | Long | 否 | 管理利润，单位:分 |
| advanceProfit | Long | 否 | 预收利润，单位:分 |

> **金额字段单位统一为:分**（与 ERP 内部一致，如 173500000 = 1735000.00 元）。
> **费率/比例字段**（profitRate/costRate/mostRate/manageRate/manageDiscount/taxRate）ERP 内部为公式串计算的展示值，本接口原样存储，建议取 ERP 页面同口径数值。

#### 请求示例

全字段示例（实际调用只需传 NERP 有的字段）：

```
POST /syncProsignForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL2609010021&name=NERP预签&product=F7&totalPrice=173500000&quotePrice=174908000&quoteArea=116000&discount=7500&qvid=256&ppid=109&comment=NERP预签
```

最简示例（只推预签事实，不带回填数据）：

```
POST /syncProsignForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL2609010021&totalPrice=173500000
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "prosign",
    "orderId": "FL2609010021",
    "pid": 1714,
    "name": "NERP预签",
    "precontractPrice": 173500000
  }
}
```

- `pid`: 生成的预签单ID（ERP 内部主键，可用于对账）
- `precontractPrice`: 回显装修单预签合同额（分，= 入参 totalPrice）

#### 错误码

| 错误码 | 说明 | 调用方应对 |
|--------|------|------------|
| 110005 | 未传认证串 | 检查参数 |
| 400013 | 装修单号不能为空 | 检查参数 |
| 400040 | 操作账号无效 | 认证串账号在 ERP 不存在，联系 ERP 管理方 |
| 400044 | 预签单已存在 | **视为成功**（ERP 侧已有预签单） |
| 130080 | 预签产品不存在 | ppid 传错，核对 ERP 分配的预签产品ID |
| 200050 | 报价版本不存在 | qvid 传错，核对 ERP 分配的报价版本ID |
| 140013 | 装修单不存在 | 单号错误，或装修单尚未同步到 ERP |
| 140004 | 装修单状态不可操作（非初始/定金态） | **视为成功**（大概率已预签）；如确认未预签，联系 ERP 管理方核查 |
| 110000 | 系统繁忙（服务端异常） | 可重试；持续出现联系 ERP 管理方 |

---

### 3.2 NERP凭空签约 - syncSignContractForNerp

**接口路径**: POST /syncSignContractForNerp.do

**业务规则**（按校验顺序）:

1. 装修单存在，不存在返回 140013
2. 装修单状态必须为 初始(0)/定金(1)/预签(2)/重签(4) 之一，否则返回 140005
3. 认证串对应账号存在，无效返回 400040
4. 订单存在未处理审批项返回 140037
5. **无默认报价时凭空创建**一条无明细报价单（name/quvid/totalPrice/discount 按入参；qvid 缺省按公司默认报价版本解析）——原版此处要求已有报价（140008），迁移单不具备故放宽
6. 锁定该单全部报价（status→锁定）
7. 按业务类型写提成规则（CustomerUserRule，与原版一致）
8. 装修单推进签约状态(3)、写签约人/签约时间、待设计态推进入设计中并发设计师消息
9. 归属（设计/业务）部门大区回刷 + 写提成挂账操作记录（decorationoperate.sign.belong）
10. 更新账户状态（signStatus）+ 工程信息初始设计时间（**工程信息行不存在则跳过**——原版要求存在，放宽）
11. 签约消息队列（复用 `signDecorationContract` 事件），下游客源联动与页面签约同路

**相对原版的放宽点**: 不要求已有款项交付（原 140006）、不要求工程信息存在（原 120020/120032）。

**幂等性**: 非幂等。已签约/已重签等状态再推返回 140005（**视为目标状态已达成**）；已有报价时不新建、只锁单复用。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| totalPrice | Long | 否 | 签单额，**单位:分**（写凭空报价单总价与装修单 orderTotalPrice；订单已有报价时仍会更新装修单签单额） |
| quotationName | String | 否 | 报价单名称，缺省 `报价单`（仅凭空创建时生效） |
| qvid | Long | 否 | 报价版本ID（>0 校验存在 200050；缺省按公司默认版本解析，仍无则 200050） |
| discount | Integer | 否 | 折扣，万分比 10000=不打折（缺省 10000，仅凭空创建时生效） |

#### 请求示例

```
POST /syncSignContractForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL2609010021&totalPrice=173500000&qvid=256
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "sign",
    "orderId": "FL2609010021",
    "qid": 5477,
    "quotationCreated": true,
    "orderTotalPrice": 173500000
  }
}
```

- `qid`: 报价单ID（新建或复用的既有报价单）
- `quotationCreated`: 本次是否凭空创建了报价单
- `orderTotalPrice`: 装修单签单额（分）

#### 错误码

| 错误码 | 说明 | 调用方应对 |
|--------|------|------------|
| 110005 | 未传认证串 | 检查参数 |
| 400013 | 装修单号不能为空 | 检查参数 |
| 400040 | 操作账号无效 | 联系 ERP 管理方 |
| 140013 | 装修单不存在 | 单号错误或单未同步 |
| 140005 | 订单合同不能修改（非初始/定金/预签/重签态） | **视为成功**（已签约/已重签）；确认未签约联系 ERP 管理方 |
| 140037 | 订单存在未处理审批项（已签约(状态3)单重推不报此错——幂等跳过返回 operation=exists，不重复执行签约副作用） | 处理完 ERP 审批后重推 |
| 200050 | 报价版本不存在 | qvid 传错，或该公司未配置默认报价版本 |
| 110000 | 系统繁忙 | 可重试 |

---

### 3.3 NERP凭空款项计划 - syncDecorationPaymentForNerp

**接口路径**: POST /syncDecorationPaymentForNerp.do

**功能说明**: 按款项比例方案（psid）将提交额拆分为若干**未收**合同款项（decorationpayment，状态=未收），即 ERP 的"合同款项计划"。后续收款动作**走 ERP 正常收款流程**（收款/确认/审批），本接口只负责生成计划。

**业务规则**（按校验顺序）:

1. 装修单存在，不存在返回 140013
2. 装修单状态必须为 初始(0)/定金(1)/预签(2)/签约(3)/重签(4) 之一，否则返回 140004
3. money 必须大于 0，否则返回 150100
4. 该单存在已收(1)/已确认(2)/审批中(3)的合同款项时**幂等跳过**（operation=exists 返回现况，不报 150001、不重建、已收款项行保护不变）——2026-11-24 由阻断改为跳过
5. psid 的比例项非空，否则返回 150093
6. 重建合同款项计划（先清该单原有未收合同款项，再按比例拆分）：
   - 单比例项：referMoney = 提交额 × 比例
   - 多比例项：前 N-1 项按比例**向上取整到千元**，末位项取余额（合计恒等于提交额）
   - cost > 0 且公司配置了成本利润款项类型（PAYMENT_TYPE_SUPROFIT_INT）时，追加一条成本利润款项
7. 全部款项状态=未收(0)、类型=合同款项（onetype=0/twotype=1）
8. 装修单写签单额（orderTotalPrice=提交额取整）与实际额（factPrice=提交额取整，迁移单无活动优惠抵扣）

**相对原版的放宽点**: 跳过活动物品核销与优惠抵扣（迁移单无 ERP 活动物品），优惠额按 0 处理。

**幂等性**: 全未收时重推会**先清后建**（结果幂等）；已收/已确认/审批中的款项存在时**幂等跳过**（operation=exists 返回现况，不重建不报错）——2026-11-24 由 150001 阻断改为跳过。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| money | Long | 是 | 提交额（签单总额），**单位:分**，必须大于 0 |
| psid | Long | 是 | 款项比例方案ID（ERP data.paymentscale，如 199=首付65%/二期33%/尾款2%），由 ERP 管理方分配 |
| cost | Long | 否 | 成本额，单位:分（缺省 0；>0 且公司配置时追加成本利润款项） |

#### 请求示例

```
POST /syncDecorationPaymentForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL2609010021&money=173500000&psid=199&cost=120000000
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "payment",
    "orderId": "FL2609010021",
    "count": 4,
    "money": 173500000,
    "paymentMoney": 173500000,
    "orderTotalPrice": 173500000
  }
}
```

- `count`: 生成的款项行数（比例项 + 可选成本利润项）
- `paymentMoney`: 优惠抵扣后生成款项总额（迁移单恒=提交额取整）
- `orderTotalPrice`: 装修单签单额（分）

#### 错误码

| 错误码 | 说明 | 调用方应对 |
|--------|------|------------|
| 110005 | 未传认证串 | 检查参数 |
| 400013 | 装修单号不能为空 | 检查参数 |
| 400040 | 操作账号无效 | 联系 ERP 管理方 |
| 140013 | 装修单不存在 | 单号错误或单未同步 |
| 140004 | 装修单状态不可操作 | 单已终态（决算/完工等），确认后联系 ERP 管理方 |
| 150001 | ~~款项已付,不可修改~~ 已废止（2026-11-24 改为幂等跳过 operation=exists，不再返回此码） |
| 150093 | 款项比例不正确 | psid 传错，核对 ERP 分配的款项比例方案ID |
| 150100 | 款项金额必须大于0 | 检查 money |
| 110000 | 系统繁忙 | 可重试 |

---

### 3.4 NERP销售款项同步 - syncSalesPaymentForNerp

**接口路径**: POST /syncSalesPaymentForNerp.do

**功能说明**: 补全单据语义——兼容 `sales.sales` / `payment.salespayment`。销售单按 `sales.comment='NERP:{salesNo}'` 判断补充（不存在时凭空创建，照 ERP 开单口径：单号走 counting、客户/楼盘/部门从装修单带出、品类由品牌带出；存在时复用）；款项按 **销售单(NERP锚)+类型+金额+待收/待退态** 组合查重防重推，落 `salespayment`（status=0 待收/待退）。

**收款/退款动作在 ERP 完成**（同 3.3 款项计划的定位）：
- type=2 定金 / 3 补款 → 生成**待收款项行**，后续在 ERP 走正常收款（`collectSalesPayment`：渠道/收据/销售单状态推进/销售比例重算）
- type=4 退款 → 生成**待退款项行** + 凭空生成退货单 `salesRefunds`（照 ERP 退款落行口径，spid 回填、待退态、comment 嵌 NERP 款项单号）并关联款项，后续在 ERP 走退款（`refundSalesPayment`）
- 单事务，失败整体回滚

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| salesNo | String | 是 | NERP销售单号（幂等锚，嵌 sales.comment） |
| paymentNo | String | 是 | NERP款项单号（留痕嵌 salesRefunds.comment；幂等按组合查重） |
| type | Integer | 是 | 2 定金 / 3 补款 / 4 退款，其他值报 400045 |
| money | Long | 是 | 金额，单位:分，>0 |
| bid | Long | 凭空建单时必填 | 品牌ID（品类由品牌带出），无效报 130077 |
| supplierUid | String | 凭空建单时必传 | 厂商工号 |
| salesmanUid | String | 凭空建单时必传 | 销售员工号 |
| instorerUid | String | 凭空建单时必传 | 驻店员工号 |
| guiderUid | String | 凭空建单时必传 | 导购工号 |
| salesAmount | Long | 否 | 销售单商品总额（分），凭空建单时缺省取首笔 money；复用已有单不修改 |

#### 请求示例

```
POST /syncSalesPaymentForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL1812310023&salesNo=NRPS20261113001&paymentNo=NRPP20261113001&type=2&money=3000000&bid=12&supplierUid=OC-03685&salesmanUid=FL-00123&instorerUid=IM-00001&guiderUid=FL-00456&salesAmount=10000000
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "operation": "add",
    "sid": 12345,
    "no": "FL2611130001",
    "spid": 67890,
    "orderId": "FL1812310023",
    "type": 2,
    "money": 3000000
  }
}
```

- `operation`: `add` 新建销售单 / `update` 复用已有单 / `exists` 款项幂等命中
- `spid`: 待收/待退款项ID；type=4 时另返回 `rid`（退货单ID）

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400013 | 装修单号不能为空 |
| 400040 | 操作账号无效 |
| 400045 | 款项类型无效 |
| 400046 | NERP单号不能为空 |
| 150100 | 款项金额必须大于0 |
| 130077 | 品牌不存在 |
| 190005 | 人员不存在 |
| 140013 | 装修单不存在 |

---

### 3.5 NERP增减款同步 - syncAddreduceForNerp

**接口路径**: POST /syncAddreduceForNerp.do

**功能说明**: 兼容 `quotation.addreduce` / `payment.decorationpayment`。补全单据语义——增减单按 `orderId+content` 精等查重（content 嵌 `NERP:{arNo} ` 前缀作幂等锚，NERP 重试报文一致即命中），不存在时经 ERP 增减单创建链凭空创建（金额=入参，paytype=应收），再走 ERP 增减单提交链落装修款项：`payment.decorationpayment`（paymentType=增项款/减项款、分类=增减款、金额取整千元、**未收状态**）+ dpId 回写 + 工费材料变更记录留痕，payment 数据由增减单提交动作产生，不裸落。增减款收款在 ERP 装修款流程完成。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| arNo | String | 是 | NERP增减单号（幂等锚） |
| type | Integer | 是 | 0 增项 / 1 减项（2 漏项不开放），其他值报 400045 |
| money | Long | 是 | 金额，单位:分，>0 |
| content | String | 是 | 增减明细说明（NERP 原文；重推时须与首次完全一致以命中幂等；含 NERP 前缀总长不得超 256 字符） |

#### 请求示例

```
POST /syncAddreduceForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL1812310023&arNo=NRPA20261113001&type=0&money=5000000&content=主材升级差额
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "operation": "add",
    "arId": 24680,
    "dpId": 13579,
    "orderId": "FL1812310023",
    "type": 0,
    "money": 5000000,
    "paymentMoney": 5000000
  }
}
```

- `operation`: `add` 新建增减单 / `exists` 幂等命中
- `dpId`: 生成的装修款项ID（增项款/减项款行）
- `paymentMoney`: 实际落库款项金额（按 ERP 原版口径取整到千元，与入参 money 可能存在零头差，**对账以本字段为准**）

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400013 | 装修单号不能为空 |
| 400040 | 操作账号无效 |
| 400045 | 款项类型无效 |
| 400046 | NERP单号不能为空 |
| 400047 | 增减明细不能为空 |
| 150100 | 款项金额必须大于0 |
| 140004 | 装修单状态不可操作（减项单据状态） |
| 140013 | 装修单不存在 |

---

### 3.6 NERP报价单数据同步 - syncQuotationForNerp

**接口路径**: POST /syncQuotationForNerp.do

**功能说明**: 报价单主数据同步（创建或更新，**不含明细，不推进装修单状态**）。装修单状态白名单 [0 初始, 1 定金, 2 预签, 4 重签]，其余状态报 140005。

- **无默认报价单** → 凭空创建一条无明细初始报价单（建法同 3.2 签约接口但不锁单/不签约/无提成与消息副作用）：名称缺省"报价单"，折扣缺省 10000（不打折），totalPrice 同步写入 undisPrice/disPrice，版本缺省按公司默认版本解析（qvid 传入则校验存在 200050）；创建分支不走报价数量上限校验
- **已有默认报价单** → 按传参部分更新（名称/版本/总价（undisPrice/disPrice 同步写）/折扣，**null 字段保持不动**），仅刷 updateTime；**锁定报价单同样放行**（2026-11-24 移除 200033 锁定拦截——NERP 迁移补数据场景）
- **装修单优惠五列同步（更新分支专属）**：couponCut/thingCut/factPrice/orderTotalPrice/quotationPrice 传入即写 `decoration` 对应列（不传不动），写入不动装修单状态、不涉及款项；列语义照原生维护口径（原生 couponCut/thingCut 来自活动项统计、factPrice=orderTotalPrice-couponCut、quotationPrice=默认报价总价回写——NERP 场景无活动项行由 NERP 侧核算直传）；**创建分支不写装修单**（装修单金额随 3.2 签约接口）
- **幂等**：重推同值无副作用（部分更新同值等价刷新 updateTime）

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| quotationName | String | 否 | 报价单名称（创建缺省"报价单"；更新传入才改） |
| qvid | Long | 否 | 报价版本ID（>0 校验存在 200050；创建缺省按公司默认版本解析；更新传入才改） |
| totalPrice | Long | 否 | 报价单总价，单位:分（创建写入并同步 undisPrice/disPrice；更新传入才改） |
| discount | Integer | 否 | 折扣，万分比 10000=不打折（创建缺省 10000；更新传入才改） |
| couponCut | Long | 否 | 券抵扣金额，单位:分（**更新分支传入即写 decoration.couponCut**，不传不动；NERP 场景无 ERP 活动项行，由 NERP 侧核算直传） |
| thingCut | Long | 否 | 物品抵扣金额，单位:分（**更新分支传入即写 decoration.thingCut**） |
| factPrice | Long | 否 | 成交价，单位:分（**更新分支传入即写 decoration.factPrice**；原生口径=orderTotalPrice-couponCut，NERP 直传终值） |
| orderTotalPrice | Long | 否 | 订单总价(签约合同额)，单位:分（**更新分支传入即写 decoration.orderTotalPrice**） |
| quotationPrice | Long | 否 | 报价金额，单位:分（**更新分支传入即写 decoration.quotationPrice**；原生口径=默认报价 totalPrice 回写） |

#### 请求示例

```
POST /syncQuotationForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL1812310023&quotationName=NERP主材报价&qvid=256&totalPrice=15000000&discount=9500
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "syncQuotation",
    "orderId": "FL1812310023",
    "qid": 30001,
    "quotationCreated": true,
    "name": "NERP主材报价",
    "totalPrice": 15000000,
    "discount": 9500,
    "couponCut": 200000,
    "thingCut": 50000,
    "factPrice": 14800000,
    "orderTotalPrice": 15000000,
    "quotationPrice": 15000000
  }
}
```

- `quotationCreated`: true 本次凭空创建 / false 复用已有默认报价（更新）
- `qid`: 报价单ID（后续对账与关联依据）
- `couponCut/thingCut/factPrice/orderTotalPrice/quotationPrice`: 装修单优惠五列**终值**（对账口径，含本次未传的列返回现库值）

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400013 | 装修单号不能为空 |
| 400040 | 操作账号无效 |
| 140013 | 装修单不存在 |
| 140005 | 订单合同不能修改（装修单状态不在白名单） |
| 200050 | 报价版本不存在 |
| 200033 | ~~报价已锁定~~ 已废止（2026-11-24 锁定报价同样放行更新，不再返回此码） |

---

## 四、调用方实施要求

1. **调用顺序**：推荐 预签 → 款项计划 → 签约（与 ERP 真实流转一致）；签约不强制要求款项接口先调，但 ERP 报表口径建议按序补齐。
2. **前置条件**：装修单须已存在于 ERP。装修单本身由 ERP 侧建档流程产生（NERP 同步创建装修单走其他通道）。
3. **psid 分配**：款项比例方案由 ERP 管理方按公司分配（如 199=首付款65%/二期款33%/尾款2%），NERP 侧按公司维度配置，勿硬编码。
4. **金额单位**：全部金额字段单位为分（Long），面积单位为平米×1000，注意换算；比例拆分向上取整到千元、末位取余额，合计恒等于提交额。
5. **字段回填语义**（预签）：可选字段**传入即写入、不传保持 0/空**（预签单是一次性凭空创建，不支持二次修改；如需调整数据联系 ERP 管理方）。
6. **幂等与防重**（两组语义不同）：
   - 合同域接口幂等口径（2026-11-24 放宽后）：报价同步锁定报价放行/重推同值无副作用；签约已签约单**幂等跳过**（operation=exists）；款项计划已付/审批中**幂等跳过**（operation=exists），全未收先清后建；预签 140004/400044 仍视为目标状态已达成
   - 款项已收后 NERP 侧金额变更**不要靠重推调整**（已收款项行受保护不重建）——需调整联系 ERP 管理方
   - 销售款项/增减款两接口**幂等命中返回既有记录**（`data.operation=exists`）：销售款项按 销售单(NERP锚)+类型+金额+待收态 组合精等，增减款按 content 精等——**重推报文必须与首次完全一致**才可命中（尤其 content 不得改写）
   - 网络超时先查 ERP 单据状态再决定补发；本组两接口重试安全（命中即返回，不重复落行）
7. **状态单向**：预签（0/1→2）与签约（→3）均为不可逆推进，本组接口不提供撤销；如需回退联系 ERP 管理方处理。
8. **事务边界**：单次调用整体事务，失败全回滚。调用方仍应记录请求流水与响应（预签记 `pid`、签约记 `qid`），不要仅凭网络超时判断服务端未执行。
9. **认证串**：通过 ERP 管理方获取（专用对接账号的固定认证串，当前使用 FL-06651 刘阳，三接口同一账号）。
10. **URL 编码**：表单值含空格/中文/特殊字符时须 URL 编码（UTF-8）。
11. **销售款项/增减款专属**：
    - 销售单四人员（supplierUid/salesmanUid/instorerUid/guiderUid）凭空建单时必传，工号须为 ERP 在职人员（厂商工号形如 OC-xxxxx）
    - 同一 NERP 销售单多笔款项（如定金+补款）复用首建的销售单；**同单同类型同金额视为同一笔**（组合幂等）——真实两笔同额款项请在金额上做区分（如差 1 分）
    - salesAmount 为销售单商品总额（单据属性），与款项金额（收款流水）无关；复用已有单时不修改
    - 增减款 content 为 NERP 明细原文，ERP 落库时自动拼 `NERP:{arNo} ` 前缀作幂等锚——重推时 content 必须逐字一致
    - 增减款金额按 ERP 原版口径取整到千元落款项，响应体 `paymentMoney` 为实际落库金额，**对账以 paymentMoney 为准**
    - **改单不支持**：同 NERP 单号重推但类型/金额与首笔不一致将报 200061 拒绝（款项已落不支持改单），需调整请联系 ERP 管理方

---

## 五、部署清单

```sql
-- operation 注册（through=2 免登通用；moduleId=6 装修域；重复执行安全）
-- 完整脚本见: sqls/communion/20_operation_sync_prosign_for_nerp.sql（预签）
--            sqls/communion/21_operation_sync_sign_payment_for_nerp.sql（签约/款项）
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncProsignForNerp', 'syncProsignForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncProsignForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncSignContractForNerp', 'syncSignContractForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSignContractForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncDecorationPaymentForNerp', 'syncDecorationPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncDecorationPaymentForNerp');

-- 销售款项/增减款同步（v2.1, 完整脚本见: sqls/communion/46_operation_nerp_sales_addreduce.sql）
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'NERP销售款项同步', 'syncSalesPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSalesPaymentForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'NERP增减款同步', 'syncAddreduceForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncAddreduceForNerp');
```

**上线顺序**: 先执行上述 SQL（五行可同批执行；operation 行缺失时接口调用直接异常），再热替换 `fanglin-seiya-8.3.030.jar` 并重启 Tomcat。零 DDL、零前端。

**部署后探活**: `GET /syncProsignForNerp.do?orderId=` / `GET /syncSalesPaymentForNerp.do?orderId=` / `GET /syncAddreduceForNerp.do?orderId=` 应返回 `{"errorCode":110005,"errorMsg":"登陆超时"}`（接口已注册、闸门生效），而非 404。

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20261025Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20261025Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20261025ServiceImpl.java |
| 部署SQL | sqls/communion/20_operation_sync_prosign_for_nerp.sql、sqls/communion/21_operation_sync_sign_payment_for_nerp.sql、sqls/communion/46_operation_nerp_sales_addreduce.sql |
| 错误码登记 | docs/03-API文档/API/error.md (400044/400045/400046/400047/200050/200033/150100) |
| 参照的原生预签 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (presignDecorationContract) |
| 参照的原生签约 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (signDecorationContract) |
| 参照的原生款项 | src/com/fanglin/payment/service/impl/DecorationPaymentServiceImpl.java (makeDecorationPayment) |
| 参照的原生开单 | src/com/fanglin/sales/service/impl/SalesServiceImpl.java (addSales) |
| 参照的原生收款 | src/com/fanglin/payment/service/impl/SalesPaymentServiceImpl.java (collectSalesPayment) |
| 参照的原生退款 | src/com/fanglin/payment/service/impl/SalesPaymentServiceImpl.java (refundSalesPayment) |
| 参照的原生退货物化 | src/com/fanglin/approval/service/impl/ApprovalSalesRefundServiceImpl.java |
| 参照的原生增减落款 | src/com/fanglin/quotation/service/impl/AddReduceServiceImpl.java (addAddReduce/submitAddReduce) |

> 历史: 预签接口原由 A20261024Action 承载（文档 A20261024Action_API_DOC.md 已废止），2026-10-25 v2.0 合并入本 Action。接口名（operation）未变，operation 注册行、调用方 URL 均不受影响。
