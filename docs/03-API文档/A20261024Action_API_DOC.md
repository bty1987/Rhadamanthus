# A20261024Action 对外接口调用说明

> 模块: seiya (NERP预签同步接口)
> 版本: 1.0
> 日期: 2026-10-24

---

## 一、接口概述

`A20261024Action` 提供以下接口，供 NERP 等外部系统直接触发装修单预签：

| 接口 | 路径 | 用途 |
|------|------|------|
| NERP凭空预签 | `POST /syncProsignForNerp.do` | 不依赖 ERP 预签报价流程，凭空创建一张无明细的锁定预签单（protation），并将装修单推进到预签状态 |

接口复刻 ERP 内部预签接口 `presignDecorationContract` 的全部副作用（装修单状态推进、归属回刷、操作留痕、客源状态联动消息），仅"预签单从哪来"不同：ERP 页面预签要求订单已存在锁定预签单，本接口凭空生成一张占位预签单（**无预签单明细**），供 NERP 侧单向同步预签事实。

---

## 二、请求约定

### 2.1 基础地址

实际地址由部署环境提供：

```text
http(s)://{ERP_HOST}/{接口路径}
```

### 2.2 HTTP 约定

| 项目 | 要求 |
|------|------|
| HTTP 方法 | `POST` |
| 请求 Content-Type | `application/x-www-form-urlencoded` |
| 字符编码 | UTF-8 |
| 响应内容 | JSON |
| 响应 Content-Type | 当前 Action 配置为 `text/html`，调用方仍应按 JSON 解析响应体 |

### 2.3 认证参数（必传）

接口走 ERP 统一鉴权（AccessInterceptor），operation 配置为 `through=2`（免登通用）：

- **`authentication` 必传**，否则返回 110005（登陆超时）
- 值为 **ERP 分配的认证串**（AES 加密的账号标识），无需 ERP 登录态
- 认证串对应账号将作为预签单创建人（creater）与装修单操作记录（decorationoperate）的操作人
- 认证串无效返回 -2（无操作权限）

### 2.4 通用响应格式

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": { ... }
}
```

- `errorCode=0` 表示成功，非 0 为错误码（见错误码表）
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
4. 该单**不存在默认预签单**，已存在返回 400044（防止覆盖 ERP 侧正常报价流程产生的预签单）
5. 凭空创建预签单：`ppid=0`（不挂预签产品）、不挂报价版本、`quotePrice = totalPrice = price`、状态=锁定(2)、默认单(defaults=1)、**无预签单明细**
6. 更新装修单：`precontractPrice = price`、`precontractTime = 当前时间`、状态推进为**预签(2)**
7. 归属信息（设计/业务）的部门、大区按归属人当前部门回刷，并刷新附加信息中的设计/业务快照
8. 写入装修单操作记录（Prosign）与消息队列（复用 `presignDecorationContract` 事件），下游客源状态联动与页面预签完全一致

**金额口径**: `price` 为预签金额，**单位:分**（与 ERP 内部一致，如 1880000 = 18800.00 元）。**不做活动券抵扣**——传入的 price 即最终预签合同额。

**幂等性**: 接口**非幂等**。同一单重复推送会被拒绝（已预签→140004；已有预签单→400044），**调用方应将这两种错误码视为"目标状态已达成"**，不要当作失败重试。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| orderId | String | 是 | 装修单号 |
| name | String | 否 | 预签单名称，缺省 `预签单` |
| price | Long | 否 | 预签金额，单位:分，缺省 0（写入预签单总价与装修单预签合同额） |

#### 请求示例

```
POST /syncProsignForNerp.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&orderId=FL2609010021&name=NERP预签&price=1880000
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
    "pid": 1713,
    "name": "NERP预签",
    "precontractPrice": 1880000
  }
}
```

- `pid`: 生成的预签单ID（ERP 内部主键，可用于对账）
- `precontractPrice`: 回显装修单预签合同额（分）

#### 错误码

| 错误码 | 说明 | 调用方应对 |
|--------|------|------------|
| 110005 | 未传认证串 | 检查参数 |
| 400013 | 装修单号不能为空 | 检查参数 |
| 400040 | 操作账号无效 | 认证串账号在 ERP 不存在，联系 ERP 管理方 |
| 400044 | 预签单已存在 | **视为成功**（ERP 侧已有预签单） |
| 140013 | 装修单不存在 | 单号错误，或装修单尚未同步到 ERP |
| 140004 | 装修单状态不可操作（非初始/定金态） | **视为成功**（大概率已预签）；如确认未预签，联系 ERP 管理方核查 |
| 110000 | 系统繁忙（服务端异常） | 可重试；持续出现联系 ERP 管理方 |

---

## 四、调用方实施要求

1. **前置条件**：装修单须已存在于 ERP 且状态为初始(0)/定金(1)。装修单本身由 ERP 侧建档流程产生（NERP 同步创建装修单走其他通道）。
2. **幂等与防重**：接口非幂等，**不要盲目重试**。收到 140004/400044 视为目标状态已达成；网络超时后应先查询 ERP 装修单状态再决定是否补发。
3. **金额单位**：`price` 单位为分（Long），注意与元之间的换算；传 0 或不传则预签合同额记 0，后续可通过 ERP 签约流程修正。
4. **状态单向**：预签是不可逆推进（0/1 → 2），本接口不提供撤销；如需回退联系 ERP 管理方处理。
5. **事务边界**：单次调用整体事务，失败全回滚。调用方仍应记录请求流水与响应（含 `pid`），不要仅凭网络超时判断服务端未执行。
6. **认证串**：通过 ERP 管理方获取（专用对接账号的固定认证串，当前使用 FL-06651 刘阳）；认证串对应账号即为预签单创建人/操作人。
7. **URL 编码**：表单值含空格/中文/特殊字符时须 URL 编码。

---

## 五、部署清单

```sql
-- operation 注册（through=2 免登通用；moduleId=6 与 presignDecorationContract 同模块；重复执行安全）
-- 完整脚本见: sqls/communion/20_operation_sync_prosign_for_nerp.sql
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncProsignForNerp', 'syncProsignForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncProsignForNerp');
```

**上线顺序**: 先执行上述 SQL（operation 行缺失时接口调用直接异常），再热替换 `fanglin-seiya-8.3.030.jar`（100491B，MD5 `4621f579c89bf79854262ff8dfabd354`）并重启 Tomcat。零 DDL、零前端。

**部署后探活**: `GET /syncProsignForNerp.do?orderId=` 应返回 `{"errorCode":110005,"errorMsg":"登陆超时"}`（接口已注册、闸门生效），而非 404。

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20261024Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20261024Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20261024ServiceImpl.java |
| 部署SQL | sqls/communion/20_operation_sync_prosign_for_nerp.sql |
| 错误码登记 | docs/03-API文档/API/error.md (400044) |
| 参照的原生预签 | src/com/fanglin/decoration/service/impl/DecorationContractServiceImpl.java (presignDecorationContract) |
