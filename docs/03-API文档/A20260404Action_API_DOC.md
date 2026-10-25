# A20260404Action 接口说明文档

> 模块: seiya (Seiya供应链数据同步接口)
> 版本: 1.2
> 日期: 2026-04-04
> 更新: 2026-08-20 brands 调整为非必填（未传时跳过品牌绑定管理）
> 更新: 2026-10-25 syncInstorer 新增第 6 步——厂商归属关系落库（userpartner type=5，以传入 supplierUserId 为准 upsert）

---

## 一、模块概述

A20260404Action 用于对接外部供应链/主材管理系统，实现**供应商、驻店人员**两类数据的同步：

- **供应商** (`syncSupplier`)：外部供应商档案同步，按编号存在即更新、不存在即创建
- **驻店人员** (`syncInstorer`)：品牌驻店员同步，按编号创建/更新人员，并按品牌编号列表**全量对齐**品牌绑定关系（补缺、删多）

---

## 二、基础信息

| 项目 | 值 |
|------|-----|
| 基础URL | http://[服务器地址]/ |
| Content-Type | application/x-www-form-urlencoded |
| 响应格式 | JSON |
| HTTP方法 | POST（GET 亦可） |

### 认证方式

接口走 ERP 统一鉴权（AccessInterceptor），按 `communion.operation` 表中同名 operation 的 `through` 配置决定放行策略：

- **through=2（免登通用，推荐）**：无需登录态，直接调用。生产库中 `syncSupplier` 已配置为 through=2；`syncInstorer` 需在部署时插入 operation 行（见文末部署清单）
- through=1（直接放行）/ through=0（需登录 authentication）为其他存量接口的配置，本模块对外对接按 through=2 使用

### 通用响应格式

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "data": { ... }
}
```

- `errorCode=0` 表示成功，非 0 为错误码（见各接口错误码表）
- 业务数据统一在 `data` 对象中返回

---

## 三、接口详情

### 3.1 同步供应商 - syncSupplier

**接口路径**: POST /syncSupplier.do

**功能说明**: 同步供应商档案。以 `userId`（供应商编号）判断：已存在则更新基本信息，不存在则创建供应商用户（`communion.user` 表 `type=1`）。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | String | 是 | 供应商编号（全局唯一，同时作为登录账号 loginId） |
| userName | String | 是 | 供应商名称 |
| phone | String | 是 | 联系电话 |
| company | Integer | 是 | 公司ID（租户，对应 communion.company.cid） |
| creditCode | String | 否 | 统一社会信用编码（存入 user.identity） |

#### 请求示例

```
POST /syncSupplier.do
Content-Type: application/x-www-form-urlencoded

userId=S_0001&userName=某某瓷砖厂&phone=13800000000&company=1&creditCode=91210XXXXXXXXXXXX
```

#### 响应示例

新增成功：
```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "add",
    "uid": 10086,
    "userId": "S_0001",
    "userName": "某某瓷砖厂"
  }
}
```

更新成功：
```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "update",
    "uid": 10086,
    "userId": "S_0001",
    "userName": "某某瓷砖厂"
  }
}
```

#### 业务逻辑

1. 校验 company 对应公司存在
2. 按 `userId` 查 `communion.user`：
   - **存在**：更新 userName/currentName/phone/creditCode（operation=update）
   - **不存在**：创建供应商用户（operation=add），创建时：
     - 检查供应商数量上限（systemconfig `supplierlimit`，按公司维度，缺省 100）
     - 部门/角色/职位取 systemconfig `supplierDept` / `supplier` / `supplierDuty` 配置
     - 初始密码取 systemconfig `password`（按公司，缺省 `helloworld`，MD5 存储）
     - 自动生成拼音缩写，type=1（供应商）， extranet=WEB+PC
     - 同时创建角色关联（userrole）与用户信息（userinfo）

> 注意：更新时不校验已有用户类型。若 `userId` 撞内部员工编号，会直接覆盖该员工姓名/电话——调用方需保证编号体系独立。

#### 错误码

| errorCode | 说明 |
|-----------|------|
| 400011 | 供应商编号不能为空 |
| 400016 | 供应商名称不能为空 |
| 400020 | 联系电话不能为空 |
| 400024 | 公司ID不能为空 |
| 510000 | 公司不存在 |
| 190036 | 供应商数已达上限 |
| 310004 | 供应商部门配置不存在(supplierDept) |
| 310002 | 供应商部门不存在 |
| 230029 | 供应商角色配置不存在(supplier) |
| 230027 | 供应商职位配置不存在(supplierDuty) |
| 230011 | 供应商职位不存在 |

---

### 3.2 同步驻店人员 - syncInstorer

**接口路径**: POST /syncInstorer.do

**功能说明**: 同步品牌驻店员。以 `userId`（驻店员编号）判断：

- 不存在 → 创建驻店员用户（`communion.user` 表 `type=4`）
- 存在且 type=4（驻店员）→ 更新基本信息
- 存在但非驻店员 → **报错拒绝**（防止外部编号撞车覆盖内部员工，400030）

传入 `brands` 时，以本次品牌编号列表为准**全量对齐**品牌绑定关系（`communion.brandInstorer`）：缺的补建、多的删除、已有的按需更新代理信息；**brands 未传时跳过品牌绑定管理**，只同步人员信息。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | String | 是 | 驻店员编号（全局唯一，同时作为登录账号 loginId） |
| userName | String | 是 | 驻店员名称 |
| phone | String | 是 | 联系电话 |
| company | Integer | 是 | 公司ID（租户） |
| supplierUserId | String | 是 | 所属厂商编号（须为已存在的供应商用户，user.type=1） |
| brands | String(JSON数组) | 否 | 品牌编号列表，如 `["B_001","B_002"]`，对应 brand.no；重复自动去重。**未传(null/空白)时跳过品牌绑定管理**，只同步人员信息（不新增/不删除/不改代理信息）；传入但非JSON数组或为空数组 `[]` 仍报 400033 |
| agentName | String | 否 | 代理名称（落 brandInstorer.agentName；仅在传入 brands 时生效） |
| agentPhone | String | 否 | 代理电话（落 brandInstorer.agentPhone；仅在传入 brands 时生效） |

#### 请求示例

```
POST /syncInstorer.do
Content-Type: application/x-www-form-urlencoded

userId=I_0001&userName=张三&phone=13900000000&company=1&supplierUserId=S_0001&brands=["B_001","B_002"]&agentName=李四&agentPhone=13700000000
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "success": true,
    "operation": "add",
    "uid": 10087,
    "userId": "I_0001",
    "userName": "张三",
    "supplierUserId": "S_0001",
    "brands": [
      { "bid": 501, "no": "B_001", "name": "某某瓷砖" },
      { "bid": 502, "no": "B_002", "name": "某某地板" }
    ]
  }
}
```

#### 业务逻辑

1. 校验 company 对应公司存在
2. 校验 `supplierUserId` 对应厂商存在且 type=1（供应商）
3. 传入 `brands` 时解析 JSON 数组（去重保序），逐个定位品牌（`brand.no`），任一不存在即报 400029；品牌直属厂商与传入厂商不一致时仅记日志告警，不阻断（品牌-厂商为多对多绑定）。brands 未传时跳过本步及第 5 步
4. 按 `userId` 查驻店员：
   - **创建**（不存在）：数量上限校验（systemconfig `instorerlimit`，缺省 100）→ 部门/角色/职位取 `instorerDept`/`instorer`/`instorerDuty` 配置 → 创建用户+角色关联+用户信息，type=4
   - **更新**（存在且 type=4）：更新 userName/currentName/phone
5. 品牌绑定全量对齐（**仅当传入 brands 时执行**，brandInstorer，以 iuid 维度）：
   - 本次 brands 中缺失的绑定 → 新增（带 agentName/agentPhone）
   - 已有绑定 → 仅当传入 agentName 或 agentPhone 时覆盖对应字段，未传不动
   - 本次列表之外的多余绑定 → 删除
6. 厂商归属关系落库（userpartner type=5，uid=厂商/puid=驻店员）：`supplierUserId` 必传，以本次传入为准——无关系则新建；已归属同一厂商则不动（幂等）；已归属其他厂商则**覆盖**为新厂商并记日志。ERP 侧「厂商管理页-关联用户」维护页与 OC 同步共用该关系

#### 错误码

| errorCode | 说明 |
|-----------|------|
| 400025 | 驻店员编号不能为空 |
| 400026 | 驻店员名称不能为空 |
| 400020 | 联系电话不能为空 |
| 400024 | 公司ID不能为空 |
| 400027 | 厂商编号不能为空 |
| 400033 | 品牌列表不能为空且必须为JSON数组格式 |
| 230015 | 公司不存在 |
| 400028 | 厂商不存在 |
| 400029 | 品牌不存在 |
| 400030 | 编号已存在且非驻店员 |
| 190008 | 人员数已达上限 |
| 400031 | 驻店员部门配置无效(instorerDept) |
| 230010 | 角色不存在 |
| 400032 | 驻店员职位配置无效(instorerDuty) |

---

## 四、调用注意事项

1. **编号体系**：`userId` 在 `communion.user` 全表唯一（不分类型）。供应商/驻店员编号务必使用独立前缀（如 `S_`/`I_`），避免与内部员工编号（`X-xxxxx` 等）冲突。撞号后果：syncSupplier 会静默覆盖；syncInstorer 会报 400030 拒绝。
2. **幂等性**：两个接口均幂等，重复调用安全。syncInstorer 传入 brands 时为全量对齐语义——每次调用请传**该驻店员的完整品牌列表**，漏传会导致多余绑定被删除；**不传 brands 则完全不动品牌绑定**（适合只改人员姓名/电话的场景），要清空全部绑定请显式传入空数组以外的合法列表（空数组 `[]` 会被 400033 拒绝，防止误清空）。厂商归属（userpartner type=5）每次调用均按传入 `supplierUserId` 对齐：换厂商直接覆盖，如需"解绑"（归属置空）当前无入口，请联系 ERP 侧处理。
3. **事务**：单次调用整体事务，失败回滚，不会出现半创建状态。
4. **JSON 数组传参**：`brands` 为表单字段，值为 JSON 数组字符串，注意 URL 编码（`[` `]` `"` 需编码）。
5. **前置依赖**：
   - syncInstorer 依赖 operation 注册（through=2）+ systemconfig 四键（`instorer`/`instorerDept`/`instorerDuty`/`instorerlimit`），部署 SQL：`sqls/communion/11_systemconfig_instorer_sync.sql`
   - 厂商（supplierUserId）需先经 syncSupplier 同步存在
   - 品牌编号（brand.no，`B_001` 格式）须已存在于 `communion.brand`
6. **新增用户初始密码**：取 systemconfig `password`（按公司，缺省 `helloworld`），首次登录后可修改。

---

## 五、部署清单（syncInstorer）

```sql
-- 1. operation 注册（through=2 免登通用；moduleId=4 与 syncSupplier 同模块；重复执行安全）
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncInstorer', 'syncInstorer', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncInstorer');

-- 2. systemconfig 四键：执行 sqls/communion/11_systemconfig_instorer_sync.sql
```

---

## 六、相关代码

| 文件 | 路径 |
|------|------|
| Action | src/com/fanglin/seiya/action/A20260404Action.java |
| Service接口 | src/com/fanglin/seiya/service/A20260404Service.java |
| Service实现 | src/com/fanglin/seiya/service/impl/A20260404ServiceImpl.java |
| 部署SQL | sqls/communion/11_systemconfig_instorer_sync.sql |
| 错误码登记 | docs/03-API文档/API/error.md（400011-400033 段） |
