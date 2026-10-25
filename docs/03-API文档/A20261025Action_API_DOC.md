# A20261025Action 对外接口调用说明

> 模块: seiya (NERP预签/签约/款项同步接口)
> 版本: 2.0
> 日期: 2026-10-25
> 变更: v2.0 原 A20261024Action（凭空预签 syncProsignForNerp）合并入本 Action，三接口统一由 A20261025Action 承载；**接口路径/参数/行为均不变，调用方零感知**，原 A20261024Action_API_DOC.md 废止并入本文档。

---

## 一、接口概述

`A20261025Action` 提供以下三个接口，供 NERP 等外部系统为迁移单补齐 ERP 业务流转（预签 → 款项计划 → 签约），支撑后续在 ERP 内走正常收款动作：

| 接口 | 路径 | 用途 |
|------|------|------|
| NERP凭空预签 | `POST /syncProsignForNerp.do` | 不依赖 ERP 预签报价流程，凭空创建一张无明细的锁定预签单（protation，业务字段按入参回填），并将装修单推进到预签状态 |
| NERP凭空签约 | `POST /syncSignContractForNerp.do` | 匹配 ERP 签约（signDecorationContract）：订单无报价时凭空创建报价单并锁单，装修单推进签约状态(3) |
| NERP凭空款项计划 | `POST /syncDecorationPaymentForNerp.do` | 匹配 ERP 款项生成（makeDecorationPayment）：按款项比例方案生成未收合同款项，**后续收款动作走 ERP 正常流程** |

三接口均为"迁移补齐"语义：ERP 页面流转要求已有预签单/报价/已收款/工程信息等前置，迁移单不具备，故凭空放宽；其余副作用（状态推进、归属回刷/提成挂账、操作留痕、消息联动）与页面操作完全同路。

**推荐调用顺序**: `syncProsignForNerp`(预签) → `syncDecorationPaymentForNerp`(款项计划) → `syncSignContractForNerp`(签约)。顺序不强制（签约不要求款项已收），但按此序与 ERP 真实业务流转一致。

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
- 认证串对应账号将作为预签单创建人、签约人（contracter）、报价创建人、款项创建人与操作记录操作人（三接口同一对接账号）
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
| 140037 | 订单存在未处理审批项 | 处理完 ERP 审批后重推 |
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
4. 该单存在已收(1)/已确认(2)/审批中(3)的合同款项返回 150001（款项已付不可重建）
5. psid 的比例项非空，否则返回 150093
6. 重建合同款项计划（先清该单原有未收合同款项，再按比例拆分）：
   - 单比例项：referMoney = 提交额 × 比例
   - 多比例项：前 N-1 项按比例**向上取整到千元**，末位项取余额（合计恒等于提交额）
   - cost > 0 且公司配置了成本利润款项类型（PAYMENT_TYPE_SUPROFIT_INT）时，追加一条成本利润款项
7. 全部款项状态=未收(0)、类型=合同款项（onetype=0/twotype=1）
8. 装修单写签单额（orderTotalPrice=提交额取整）与实际额（factPrice=提交额取整，迁移单无活动优惠抵扣）

**相对原版的放宽点**: 跳过活动物品核销与优惠抵扣（迁移单无 ERP 活动物品），优惠额按 0 处理。

**幂等性**: 非幂等但有守卫——已收/已确认/审批中的款项存在时拒绝重建（150001）；全未收时重推会**先清后建**（结果幂等）。

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
| 150001 | 款项已付,不可修改 | **视为成功**（该单已有生效款项计划，多为重复推送） |
| 150093 | 款项比例不正确 | psid 传错，核对 ERP 分配的款项比例方案ID |
| 150100 | 款项金额必须大于0 | 检查 money |
| 110000 | 系统繁忙 | 可重试 |

---

## 四、调用方实施要求

1. **调用顺序**：推荐 预签 → 款项计划 → 签约（与 ERP 真实流转一致）；签约不强制要求款项接口先调，但 ERP 报表口径建议按序补齐。
2. **前置条件**：装修单须已存在于 ERP。装修单本身由 ERP 侧建档流程产生（NERP 同步创建装修单走其他通道）。
3. **psid 分配**：款项比例方案由 ERP 管理方按公司分配（如 199=首付款65%/二期款33%/尾款2%），NERP 侧按公司维度配置，勿硬编码。
4. **金额单位**：全部金额字段单位为分（Long），面积单位为平米×1000，注意换算；比例拆分向上取整到千元、末位取余额，合计恒等于提交额。
5. **字段回填语义**（预签）：可选字段**传入即写入、不传保持 0/空**（预签单是一次性凭空创建，不支持二次修改；如需调整数据联系 ERP 管理方）。
6. **幂等与防重**：三接口均非幂等，**不要盲目重试**——预签 140004/400044、签约 140005、款项 150001 均视为目标状态已达成；款项在全未收时重推先清后建（结果幂等）。网络超时先查 ERP 单据状态再决定补发。
7. **状态单向**：预签（0/1→2）与签约（→3）均为不可逆推进，本组接口不提供撤销；如需回退联系 ERP 管理方处理。
8. **事务边界**：单次调用整体事务，失败全回滚。调用方仍应记录请求流水与响应（预签记 `pid`、签约记 `qid`），不要仅凭网络超时判断服务端未执行。
9. **认证串**：通过 ERP 管理方获取（专用对接账号的固定认证串，当前使用 FL-06651 刘阳，三接口同一账号）。
10. **URL 编码**：表单值含空格/中文/特殊字符时须 URL 编码（UTF-8）。

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
```

**上线顺序**: 先执行上述 SQL（三行可同批执行；operation 行缺失时接口调用直接异常），再热替换 `fanglin-seiya-8.3.030.jar` 并重启 Tomcat。零 DDL、零前端。

**部署后探活**: `GET /syncProsignForNerp.do?orderId=` 与 `GET /syncSignContractForNerp.do?orderId=` 应返回 `{"errorCode":110005,"errorMsg":"登陆超时"}`（接口已注册、闸门生效），而非 404。

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20261025Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20261025Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20261025ServiceImpl.java |
| 部署SQL | sqls/communion/20_operation_sync_prosign_for_nerp.sql、sqls/communion/21_operation_sync_sign_payment_for_nerp.sql |
| 错误码登记 | docs/03-API文档/API/error.md (400044/200050/150100) |
| 参照的原生预签 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (presignDecorationContract) |
| 参照的原生签约 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (signDecorationContract) |
| 参照的原生款项 | src/com/fanglin/payment/service/impl/DecorationPaymentServiceImpl.java (makeDecorationPayment) |

> 历史: 预签接口原由 A20261024Action 承载（文档 A20261024Action_API_DOC.md 已废止），2026-10-25 v2.0 合并入本 Action。接口名（operation）未变，operation 注册行、调用方 URL 均不受影响。
