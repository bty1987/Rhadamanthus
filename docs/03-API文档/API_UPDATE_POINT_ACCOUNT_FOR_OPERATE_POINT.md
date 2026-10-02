# updatePointAccountForOperatePoint 接口说明文档

## 接口概述

**接口名称**: updatePointAccountForOperatePoint
**功能描述**: 按装修单维度直接**覆盖**设置运营积分(绝对值覆盖,非增量增减),并在积分台账留下调整流水
**接口路径**: `/updatePointAccountForOperatePoint.do`
**请求方式**: `POST`
**内容类型**: `application/x-www-form-urlencoded` 或 `application/json`
**字符编码**: `UTF-8`

**所属模块**: customer(积分账户)
**代码位置**: `PointAccountAction` → `PointAccountServiceImpl.updatePointAccountForOperatePoint` → `PointAccountDao` / `PointRecordDao`
**版本**: v1.0
**最后更新**: 2026-09-27
**维护方**: 方林装饰 ERP 团队

### 版本依赖(重要)

| jar | 状态 |
|-----|------|
| `fanglin-customer-8.3.031.000` | 🔴 **勿部署**——该版本 `PointAccountDaoImpl` 存在 Criteria 裸 `cid` 炸点(QueryException),本接口及全部积分接口一调用即报错 |
| `fanglin-customer-8.3.029` | ✅ 定稿版本,含 ace080a02 修复(`customer.cid` 关联路径),本接口可用 |

---

## 认证方式

| Header 名称 | 值 | 必填 | 说明 |
|-------------|---|------|------|
| `authentication` | AES 加密的认证串 | 是 | 用户身份认证(LoginInterceptor 校验) |
| `Cookie` | authentication=xxx | 可选 | 浏览器场景自动携带 |

仅需登录态,无细粒度权限点(无 pageBtn/功能右键控)。

---

## 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `pointAccount.orderId` | String | 是 | 装修单号 | `"2608100108"` |
| `pointAccount.operatePoint` | Long | 是 | 目标运营积分(**绝对值**,覆盖语义) | `100000` |

**说明**:

- **覆盖语义**: 传入值即账户最终值,`delta = 传入值 − 账户当前 opoint`,不做增量累加。与 `grantPoint`(增量发放)/`consumePoint`(增量消耗)语义不同
- **量纲**: ×1000,页面显示 100 分 = 传 `100000`。前端 `api/customer.js` 已注册 `tranargs: ["pointAccount.operatePoint"]` 自动放大;直接调接口的调用方须自行换算
- **传 0 合法**(清零),**不传(null)报 330050**;后端无非负校验,负值会原样覆盖,调用方须自行约束
- `pointAccount` 其余字段(decorationPoint/materialPoint/point/company 等)即使传入也被忽略
- 装修单不存在报 140013;积分账户不存在时**懒开户**(对齐 makeMemberOrder 口户,四项积分 0 起户),不报"积分不存在"

---

## 处理流程

1. 按 `orderId` 查装修单 `decoration`,不存在 → 抛 `140013 装修单不存在`
2. `operatePoint` 为 null → 抛 `330050 运营积分不能为空`
3. 按 `(company, cid, orderId)` 三条件查积分账户 `customer.cppoint`;查不到则**懒开户**(customer/orderId/company 落户,dpoint/spoint/opoint/point 均为 0)
4. `delta = operatePoint − 账户当前 opoint`,账户 `opoint` 覆盖为传入值,saveOrUpdate
5. `delta ≠ 0` 时写一条积分台账 `customer.cppointRecord`(见下节)
6. 全程 `@Transactional(rollbackFor = Exception.class)`,账户更新与台账同事务,要么都成要么都回滚

---

## 台账流水(记录信息)

**会产生记录。** `delta ≠ 0` 时向 `customer.cppointRecord` 写入一条流水,`delta = 0`(重复提交同值)不写流水,天然幂等。

| 列 | 字段 | 本接口取值 |
|-----|------|-----------|
| `cprid` | recordId | 自增主键 |
| `cid` | cid | 客户 id |
| `cpid` | accountId | 积分账户 id |
| `type` | type | `0` ADDUP 调增(delta>0) / `1` USERUP 调减(delta<0) |
| `pointType` | pointType | `2` 运营积分(POINTTYPE_OPOINT) |
| `point` | point | **变化量 delta(带符号)**,调增为正、调减为负 |
| `balance` | balance | 调整后 装修积分+主材积分 合计快照 |
| `dpoint` | decorationPoint | 调整后装修积分快照 |
| `spoint` | materialPoint | 调整后主材积分快照 |
| `opoint` | operatePoint | 调整后运营积分快照 |
| `no` | no | null(无积分单号) |
| `orderId` | orderId | 装修单号 |
| `cuid` | operater | 当前登录操作人 |
| `operateTime` | operateTime | 操作时间 |
| `status` | status | 数据库默认 `0` 有效 |

与 grantPoint/consumePoint 流水的差异:那两类 `point` 列存**正数量**,方向由 `type` 表达;本接口 `point` 列存**带符号 delta**(`type` 与符号一致),对账按 `SUM(IF(type=0, point, -point))` 口径两种存法结果相同。

流水查询走 `queryPointRecord.do`。

---

## 响应

返回标准包装 + `pointAccount` 回显(原样返回请求绑定值,不回账户快照;查账户用 `queryPointAccount`):

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "pointAccount": {
    "orderId": "2608100108",
    "operatePoint": 100000,
    "decorationPoint": null,
    "materialPoint": null,
    "point": null
  }
}
```

失败时 `errorCode` 为对应错误码,`errorMsg` 为错误信息。

---

## cURL 调用示例

### 1. JSON 格式

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/updatePointAccountForOperatePoint.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{
    "pointAccount": {
      "orderId": "2608100108",
      "operatePoint": 100000
    }
  }'
```

### 2. Form 表单格式

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/updatePointAccountForOperatePoint.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -d 'pointAccount.orderId=2608100108' \
  -d 'pointAccount.operatePoint=100000'
```

### 3. 清零(传 0,合法)

```bash
curl -X POST 'http://localhost:8080/Rhadamanthus/updatePointAccountForOperatePoint.do' \
  -H 'authentication: YOUR_ENCRYPTED_AUTH_STRING' \
  -H 'Content-Type: application/json' \
  -d '{"pointAccount": {"orderId": "2608100108", "operatePoint": 0}}'
```

---

## 错误码

| 错误码 | 说明 | 触发条件 |
|--------|------|----------|
| 140013 | 装修单不存在 | `orderId` 查不到装修单 |
| 330050 | 运营积分不能为空 | `pointAccount.operatePoint` 未传(null) |
| 110000 | 系统繁忙,请稍后重试 | 非业务异常兜底(拦截器) |

---

## 关联接口

| 接口 | 关系 |
|------|------|
| `queryMemberPoint.do` | 读——装修单活动信息节点四项积分展示(运营积分读本接口维护的 `cppoint.opoint`) |
| `queryPointRecord.do` | 读——积分台账流水分页查询 |
| `queryPointAccount.do` | 读——按 cid 查积分账户(取最新户) |
| `grantPoint.do` / `consumePoint.do` | 写——增量发放/消耗(与本接口覆盖语义互补) |
| `makeMemberOrder.do` | 平台侧积分消耗单同步(同懒开户口径) |

---

## 变更记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-09-26 | v1.0 | 接口随运营积分功能上线(commit 98361de3e),error.md 登记 330050 |
| 2026-09-27 | — | 依赖 jar 修正为 fanglin-customer-8.3.029(ace080a02 修复 Criteria 裸 cid 炸点);补本接口文档 |
