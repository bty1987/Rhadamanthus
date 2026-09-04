# A20260904Action 对外接口调用说明

> 模块: seiya (Seiya供应链数据同步接口 - 库存)
> 版本: 1.0
> 日期: 2026-09-04

---

## 一、接口概述

`A20260904Action` 提供以下三个接口，供其他系统同步供应链库存数据：

| 接口 | 路径 | 用途 |
|------|------|------|
| 同步辅材 | `POST /syncAoods.do` | 按货号新增或更新辅材档案（含商品档案） |
| 同步仓库 | `POST /syncStorehouse.do` | 按仓库编号新增或更新仓库档案 |
| 同步出入库 | `POST /syncStorehouseStock.do` | 按货号+仓库执行入库/出库，生成 ERP 库存单据（manifest） |

三个接口都会写入 ERP 数据库。出入库接口依赖辅材/仓库档案已同步存在。

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
- 认证串对应账号将作为出入库单据（manifest）的经办人（creater）
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

### 3.1 同步辅材 - syncAoods

**接口路径**: POST /syncAoods.do

**功能说明**: 同步辅材档案。以货号 `no`（公司维度唯一）判断：商品不存在则创建商品档案（自动生成拼音，并创建默认颜色"默认"/规格"默认"供库存挂靠）+ 辅材档案；存在则更新商品名称/单位，辅材不存在补建、存在更新定额/库房字段（未传的可选字段保持原值不动）。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| no | String | 是 | 货号（业务唯一键，公司维度；建议独立前缀如 `A_`，避免与 ERP 内部货号撞号） |
| name | String | 是 | 辅材名称 |
| measurementUnit | String | 否 | 计量单位 |
| normunit | String | 否 | 定额单位（传入即覆盖） |
| normnum | Integer | 否 | 定额数量（传入即覆盖） |
| storeunit | String | 否 | 库房单位（传入即覆盖） |
| storenum | Integer | 否 | 库房数量（传入即覆盖） |
| atid | Long | 否 | 辅材分类ID（ERP 分配；传入校验存在，无效报 400042；不传不修改） |
| company | Integer | 是 | 公司ID（租户） |

#### 请求示例

```
POST /syncAoods.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&no=A_0001&name=轻钢龙骨&measurementUnit=米&storeunit=米&storenum=1&company=1
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "add",
    "no": "A_0001",
    "name": "轻钢龙骨",
    "aid": 1001,
    "gid": 2001
  }
}
```

- `operation`: `add` 新建 / `update` 更新
- `aid`: 辅材ID，`gid`: 商品ID（ERP 内部主键，可用于对账）

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400035 | 辅材货号不能为空 |
| 400003 | 商品名称不能为空 |
| 400024 | 公司ID不能为空 |
| 400042 | 辅材分类无效 |
| 230015 | 公司不存在 |

---

### 3.2 同步仓库 - syncStorehouse

**接口路径**: POST /syncStorehouse.do

**功能说明**: 同步仓库档案。以仓库编号 `code` 判断：不存在则创建，存在则更新名称/状态（未传 status 不修改）。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| code | String | 是 | 仓库编号（全局唯一；建议独立前缀如 `WH_`） |
| name | String | 是 | 仓库名称 |
| status | Integer | 否 | 0 启用（缺省）/ 1 停用 |

#### 请求示例

```
POST /syncStorehouse.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&code=WH_001&name=中心库
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "add",
    "shid": 101,
    "code": "WH_001",
    "name": "中心库"
  }
}
```

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400036 | 仓库编号不能为空 |
| 400043 | 仓库名称不能为空 |

---

### 3.3 同步出入库 - syncStorehouseStock

**接口路径**: POST /syncStorehouseStock.do

**功能说明**: 按货号+仓库执行入库/出库，同时生成 ERP 库存单据（manifest）及明细。整体单事务，任一步失败（如库存不足）全部回滚，不产生半状态数据。

**业务规则**:

- 校验辅材（货号→商品→辅材档案链）存在，不存在返回 400037
- 校验仓库存在，不存在返回 400038
- **入库（type=in）**：库存行不存在自动创建并累加数量；生成进货单（type=CG，单号 `公司简称+CG+yyMMdd+序号`）
- **出库（type=out）**：库存行不存在返回 260011，库存不足返回 260008（消息含商品名），均不产生单据；成功则扣减并生成出货单（type=XG）
- 单据经办人（creater）取认证串对应账号
- 入库/出库数量为追加/扣减语义，接口层无幂等键

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| authentication | String | 是 | ERP 分配的认证串 |
| no | String | 是 | 货号（**须已通过 syncAoods 同步存在**） |
| storehouseCode | String | 是 | 仓库编号（**须已通过 syncStorehouse 同步存在**） |
| type | String | 是 | `in` 入库 / `out` 出库，其他值报 400039 |
| num | Integer | 是 | 数量，必须大于 0 |
| manifestTime | String | 否 | 单据时间，格式 `yyyy-MM-dd HH:mm:ss`，缺省当前时间，格式错报 400041 |
| comment | String | 否 | 备注（落 manifest.comment） |
| company | Integer | 是 | 公司ID |

#### 请求示例

入库：

```
POST /syncStorehouseStock.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&no=A_0001&storehouseCode=WH_001&type=in&num=100&company=1&comment=首批入库
```

出库：

```
POST /syncStorehouseStock.do
Content-Type: application/x-www-form-urlencoded

authentication=xxx&no=A_0001&storehouseCode=WH_001&type=out&num=20&company=1&manifestTime=2026-09-04 10:30:00
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "in",
    "mid": 3001,
    "manifestCode": "FLCG2609040001",
    "no": "A_0001",
    "name": "轻钢龙骨",
    "storehouseCode": "WH_001",
    "num": 100
  }
}
```

- `operation`: 本次操作类型 `in`/`out`
- `mid` / `manifestCode`: 生成的单据ID与单号（**调用方对账依据，务必记录**）
- `num`: 操作后该货号在该仓库的库存余量

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400035 | 辅材货号不能为空 |
| 400036 | 仓库编号不能为空 |
| 400039 | 出入库类型无效 |
| 400005 | 数量必须大于0 |
| 400024 | 公司ID不能为空 |
| 400037 | 辅材不存在 |
| 400038 | 仓库不存在 |
| 400040 | 操作账号无效 |
| 400041 | 单据时间格式无效 |
| 230015 | 公司不存在 |
| 260008 | 商品库存不足（消息含商品名） |
| 260011 | 商品库存不存在（出库时） |

---

## 四、调用方实施要求

1. **调用顺序**：先 `syncAoods` + `syncStorehouse`（档案层，可随时重推），再 `syncStorehouseStock`（业务层）。
2. **幂等与防重**：
   - 档案同步（syncAoods/syncStorehouse）幂等安全，失败可重试
   - **出入库无幂等键**：网络超时后不要盲目重发（可能重复入库），应记录 `manifestCode`/`mid` 对账后再决定补发
3. **编号体系**：货号/仓库编号建议独立前缀（如 `A_`/`WH_`）；`no` 公司维度唯一，与 ERP 内部货号撞号会更新到内部商品档案。
4. **字段覆盖语义**：syncAoods 可选字段（normunit/normnum/storeunit/storenum/atid）**传入即覆盖、不传保持原值**；如需清空请显式传空串/0。
5. **事务边界**：出入库单次调用整体事务，失败回滚。调用方仍应记录请求流水与响应（含 `manifestCode`），不要仅凭网络超时判断服务端未执行。
6. **认证串**：通过 ERP 管理方获取；认证串对应账号即为单据经办人。
7. **URL 编码**：表单值含空格/中文/特殊字符时须 URL 编码（如 `manifestTime=2026-09-04%2010%3A30%3A00`）。

---

## 五、部署清单

```sql
-- operation 注册（through=2 免登通用；moduleId=4 与 syncSupplier 同模块；重复执行安全）
-- 完整脚本见: sqls/communion/12_operation_inventory_sync.sql
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncAoods', 'syncAoods', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncAoods');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncStorehouse', 'syncStorehouse', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncStorehouse');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncStorehouseStock', 'syncStorehouseStock', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncStorehouseStock');
```

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20260904Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20260904Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20260904ServiceImpl.java |
| 部署SQL | sqls/communion/12_operation_inventory_sync.sql |
| 错误码登记 | docs/03-API文档/API/error.md (400035-400043) |
