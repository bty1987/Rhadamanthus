# A20261025Action 对外接口调用说明

> 模块: seiya (NERP签约/款项同步接口)
> 版本: 1.0
> 日期: 2026-10-25

---

## 一、接口概述

`A20261025Action` 提供以下接口，供 NERP 等外部系统为迁移单补齐 ERP 业务流转（假装有业务流转），支撑后续在 ERP 内走正常收款动作：

| 接口 | 路径 | 用途 |
|------|------|------|
| NERP凭空签约 | `POST /syncSignContractForNerp.do` | 匹配 ERP 签约（signDecorationContract）：订单无报价时凭空创建报价单并锁单，装修单推进签约状态(3) |
| NERP凭空款项计划 | `POST /syncDecorationPaymentForNerp.do` | 匹配 ERP 款项生成（makeDecorationPayment）：按款项比例方案生成未收合同款项，**后续收款动作走 ERP 正常流程** |

两接口均为"迁移补齐"语义：ERP 页面签约要求已有报价/已收款/工程信息等前置，迁移单不具备，故凭空放宽；其余副作用（状态推进、归属提成挂账、操作留痕、消息联动）与页面操作完全同路。

**推荐调用顺序**: `syncProsignForNerp`(预签, 见 A20261024Action 文档) → `syncDecorationPaymentForNerp`(款项计划) → `syncSignContractForNerp`(签约)。顺序不强制（签约不要求款项已收），但按此序与 ERP 真实业务流转一致。

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
| 字符编码 | **UTF-8** |
| 响应内容 | JSON |
| 响应 Content-Type | 当前 Action 配置为 `text/html`，调用方仍应按 JSON 解析响应体 |

### 2.3 认证参数（必传）

接口走 ERP 统一鉴权（AccessInterceptor），operation 配置为 `through=2`（免登通用）：

- **`authentication` 必传**，否则返回 110005（登陆超时）
- 值为 **ERP 分配的认证串**（AES 加密的账号标识），无需 ERP 登录态
- 认证串对应账号将作为签约人（contracter）、报价创建人、款项创建人与操作记录操作人
- 认证串无效返回 -2（无操作权限）

### 2.4 通用响应格式

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": { ... }
}
```

---

## 三、接口详情

### 3.1 NERP凭空签约 - syncSignContractForNerp

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

### 3.2 NERP凭空款项计划 - syncDecorationPaymentForNerp

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
2. **psid 分配**：款项比例方案由 ERP 管理方按公司分配（如 199=首付款65%/二期款33%/尾款2%），NERP 侧按公司维度配置，勿硬编码。
3. **金额单位**：全部金额字段单位为分（Long）；比例拆分向上取整到千元、末位取余额，合计恒等于提交额。
4. **幂等与防重**：签约非幂等（140005/140037 需区分处理）；款项有重建守卫（150001），全未收时重推幂等。网络超时先查 ERP 单据状态再决定补发。
5. **状态单向**：签约推进不可逆（→3），撤销需 ERP 管理方处理。
6. **认证串**：通过 ERP 管理方获取（当前对接账号 FL-06651 刘阳，与 syncProsignForNerp 同一账号）。
7. **URL 编码**：表单值含空格/中文/特殊字符时须 URL 编码（UTF-8）。

---

## 五、部署清单

```sql
-- operation 注册（through=2 免登通用；moduleId=6 装修域；重复执行安全）
-- 完整脚本见: sqls/communion/21_operation_sync_sign_payment_for_nerp.sql
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncSignContractForNerp', 'syncSignContractForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSignContractForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncDecorationPaymentForNerp', 'syncDecorationPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncDecorationPaymentForNerp');
```

**上线顺序**: 先执行上述 SQL（与 20 号 syncProsignForNerp 的 operation 行同批执行亦可），再热替换 `fanglin-seiya-8.3.030.jar`（113609B，MD5 `8864a8ed0f9610f6653e4daaec6b9879`）并重启 Tomcat。零 DDL、零前端。三接口共用同一 seiya jar。

**部署后探活**: `GET /syncSignContractForNerp.do?orderId=` 应返回 `{"errorCode":110005,"errorMsg":"登陆超时"}`，而非 404。

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20261025Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20261025Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20261025ServiceImpl.java |
| 部署SQL | sqls/communion/21_operation_sync_sign_payment_for_nerp.sql |
| 错误码登记 | docs/03-API文档/API/error.md (200050/150100) |
| 参照的原生签约 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (signDecorationContract) |
| 参照的原生款项 | src/com/fanglin/payment/service/impl/DecorationPaymentServiceImpl.java (makeDecorationPayment) |
