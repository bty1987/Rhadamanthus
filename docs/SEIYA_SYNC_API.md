# Seiya 模块同步接口 API 文档

> **版本**: v1.1
> **更新日期**: 2026-03-26
> **模块**: seiya（第三方数据同步模块）
> **功能**: 职位、部门、用户信息同步

---

## 📋 目录

- [接口概述](#接口概述)
- [1. 职位同步接口](#1-职位同步接口-syncduty)
- [2. 部门同步接口](#2-部门同步接口-syncdepartment)
- [3. 用户同步接口](#3-用户同步接口-syncuser)
- [错误码说明](#错误码说明)
- [数据字典](#数据字典)

---

## 接口概述

### 基础信息

| 项目 | 说明 |
|------|------|
| **基础URL** | `http://localhost:8080/Rhadamanthus` |
| **请求方式** | POST |
| **内容类型** | `application/x-www-form-urlencoded` |
| **响应格式** | JSON |
| **字符编码** | UTF-8 |

### 统一响应格式

**成功响应**:
```json
{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": "123"  // 返回的职位ID或部门ID
}
```

**失败响应**:
```json
{
    "errorCode": 400001,
    "errorMsg": "职位名称不能为空",
    "data": null
}
```

---

## 1. 职位同步接口

### 接口信息

| 项目 | 说明 |
|------|------|
| **接口URL** | `/syncDuty.do` |
| **请求方式** | POST |
| **功能描述** | 同步职位信息，支持新增、更新操作 |
| **权限要求** | 需要登录认证 |

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `name` | String | ✅ | 职位名称 | "司机" |
| `code` | String | ❌ | 职位编码（更新时提供） | "POST9526" |
| `type` | Integer | ✅ | 部门类型ID | 1 |
| `org_code` | String | ❌ | 部门编号（保留未使用） | "DEPT9526" |
| `status` | Integer | ❌ | 状态：1启用，2禁用 | 1 |
| `leader_flag` | Integer | ❌ | 是否领导岗：0否，1是 | 0 |

### 业务规则

1. **新增职位**：不提供 `code` 参数时，系统自动生成编号（D001, D002...）
2. **更新职位**：提供 `code` 参数时，系统查找并更新对应职位
3. **唯一性校验**：职位名称不能重复
4. **并发控制**：职位编号生成使用 synchronized 保护
5. **自动生成**：职位拼音自动生成

### 请求示例

#### 新增职位

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=司机" \
  -d "type=1" \
  -d "status=1" \
  -d "leader_flag=0"
```

#### 更新职位

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=POST9526" \
  -d "name=高级司机" \
  -d "type=1" \
  -d "status=1" \
  -d "leader_flag=1"
```

#### 使用自定义编码新增

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=POST8888" \
  -d "name=测试职位" \
  -d "type=1" \
  -d "status=1" \
  -d "leader_flag=0"
```

### 响应示例

**成功响应**:
```json
{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": "123"
}
```

**失败响应**:
```json
{
    "errorCode": 400001,
    "errorMsg": "职位名称不能为空",
    "data": null
}
```

```json
{
    "errorCode": 400003,
    "errorMsg": "部门类型不能为空",
    "data": null
}
```

```json
{
    "errorCode": 130016,
    "errorMsg": "职位已存在: 司机",
    "data": null
}
```

---

## 2. 部门同步接口

### 接口信息

| 项目 | 说明 |
|------|------|
| **接口URL** | `/syncDepartment.do` |
| **请求方式** | POST |
| **功能描述** | 同步部门信息，支持新增、更新操作 |
| **权限要求** | 需要登录认证 |

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `name` | String | ✅ | 部门名称 | "设计一部" |
| `code` | String | ❌ | 部门编码（更新时提供） | "DEPT9526" |
| `type` | Integer | ✅ | 部门类型ID | 1 |
| `parent_code` | String | ❌ | 父部门编号 | "DEPT9525" |
| `org_code` | String | ✅ | 公司ID（对应 company.cid） | "1" |
| `status` | Integer | ❌ | 状态：1启用，2禁用 | 1 |
| `order_value` | Integer | ❌ | 排序值 | 1 |
| `leader_code` | String | ❌ | 部门经理工号 | "FL-09527" |
| `posts` | String | ❌ | 定岗数据（JSON字符串） | "{\"1\": 10, \"2\": 20}" |

### 业务规则

1. **新增部门**：不提供 `code` 参数时，系统自动生成编号（DEPT0001, DEPT0002...）
2. **更新部门**：提供 `code` 参数时，系统查找并更新对应部门
3. **唯一性校验**：同一公司下部门名称不能重复
4. **父部门校验**：如果提供 `parent_code`，必须存在
5. **经理校验**：如果提供 `leader_code`，用户必须存在
6. **公司ID格式**：`org_code` 必须是纯数字字符串
7. **自动生成**：部门拼音自动生成

### 请求示例

#### 新增顶级部门

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=设计一部" \
  -d "type=1" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=1"
```

#### 新增子部门

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=设计一组" \
  -d "type=1" \
  -d "parent_code=DEPT9526" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=1" \
  -d "leader_code=FL-09527" \
  -d 'posts={"1": 10, "2": 20}'
```

#### 更新部门

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=DEPT9526" \
  -d "name=设计一部（更新）" \
  -d "type=1" \
  -d "parent_code=DEPT9525" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=2" \
  -d "leader_code=FL-09528"
```

#### 使用自定义编码新增

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=DEPT8888" \
  -d "name=测试部门" \
  -d "type=1" \
  -d "org_code=1" \
  -d "status=1"
```

#### 完整参数示例

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=设计一部" \
  -d "code=DEPT9526" \
  -d "type=1" \
  -d "parent_code=DEPT9525" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=1" \
  -d "leader_code=FL-09527" \
  -d 'posts={"1": 10, "2": 20, "3": 30}'
```

### 响应示例

**成功响应**:
```json
{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": "456"
}
```

**失败响应**:
```json
{
    "errorCode": 401001,
    "errorMsg": "部门名称不能为空",
    "data": null
}
```

```json
{
    "errorCode": 401002,
    "errorMsg": "组织编码不能为空",
    "data": null
}
```

```json
{
    "errorCode": 401003,
    "errorMsg": "部门类型不能为空",
    "data": null
}
```

```json
{
    "errorCode": 511001,
    "errorMsg": "部门类型不存在: 999",
    "data": null
}
```

```json
{
    "errorCode": 511002,
    "errorMsg": "父部门不存在: DEPT9999",
    "data": null
}
```

```json
{
    "errorCode": 511003,
    "errorMsg": "部门经理不存在: FL-99999",
    "data": null
}
```

```json
{
    "errorCode": 511004,
    "errorMsg": "组织编码格式错误，必须是数字: ABC",
    "data": null
}
```

```json
{
    "errorCode": 130017,
    "errorMsg": "部门名称已存在: 设计一部",
    "data": null
}
```

---

## 3. 用户同步接口 (syncUser)

### 接口信息

| 项目 | 说明 |
|------|------|
| **接口URL** | `/syncUser.do` |
| **请求方式** | POST |
| **功能描述** | 同步用户信息，支持新增、更新操作 |
| **权限要求** | 需要登录认证 |

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `name` | String | ✅ | 姓名 | "张三" |
| `code` | String | ❌ | 用户工号（更新时提供） | "FL-09527" |
| `current_name` | String | ❌ | 现用名（默认使用name） | "张三" |
| `gender` | Integer | ❌ | 性别：0女，1男（默认1） | 1 |
| `identity` | String | ✅ | 身份证号 | "210xxx199001011234" |
| `phone` | String | ✅ | 手机号 | "13800138000" |
| `login_id` | String | ❌ | 登录用户名（默认使用userId） | "zhangsan" |
| `dept_id` | Integer | ✅ | 部门ID | 123 |
| `duty_id` | Integer | ✅ | 职位ID | 456 |
| `company` | Integer | ✅ | 公司ID（user.company） | 1 |
| `status` | Integer | ❌ | 状态：1在职，0离职，2停薪留职（默认1） | 1 |

### 业务规则

#### 新增场景（code 为空）
1. **工号生成**：不提供 `code` 参数时，系统自动生成工号（格式：公司简称U-编号，如：FLU-00001）
2. **唯一性校验**：
   - 手机号不能已存在
   - 身份证号不能已存在
   - 登录名不能已存在
3. **默认设置**：
   - 默认密码：系统配置的默认密码（MD5加密）
   - 默认角色：游客角色
   - 默认状态：在职（status=1）
4. **定岗处理**：新增时自动更新定岗人数 +1
5. **拼音生成**：自动生成姓名拼音

#### 更新场景（code 有值）
1. **用户查找**：通过 `code`（工号）查找现有用户
2. **灵活修改**：
   - ✅ 允许修改手机号/身份证（不检查重复）
   - ✅ 允许跨公司调动
   - ✅ 允许修改部门和职位
   - ❌ 不允许修改登录名（login_id）
3. **定岗处理**：更新时不处理定岗人数
4. **状态更新**：支持修改用户状态（在职/离职/停薪留职）

#### 状态值转换
- **外部参数** → **内部常量**
  - `1`（在职）→ `0`（STATUS_ONJOB_INT）
  - `0`（离职）→ `1`（STATUS_QUIT_INT）
  - `2`（停薪留职）→ `2`（STATUS_SUSPEND_INT）

### 请求示例

#### 新增用户（自动生成工号）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=张三" \
  -d "gender=1" \
  -d "identity=210xxx199001011234" \
  -d "phone=13800138000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=1"
```

#### 新增用户（指定工号）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "current_name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "login_id=lisi" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=1"
```

#### 更新用户（基本信息）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四（更新）" \
  -d "gender=0" \
  -d "identity=210xxx199002023456" \
  -d "phone=13900139999" \
  -d "dept_id=124" \
  -d "duty_id=457" \
  -d "company=1" \
  -d "status=1"
```

#### 更新用户（跨公司调动）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "dept_id=200" \
  -d "duty_id=500" \
  -d "company=2" \
  -d "status=1"
```

#### 更新用户（离职）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=0"
```

#### 更新用户（停薪留职）

```bash
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=2"
```

### 响应示例

**成功响应（新增用户）**:
```json
{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": "{\"code\":\"12345\",\"belong_org_code\":\"1\",\"userId\":\"FLU-00001\"}"
}
```

**成功响应（更新用户）**:
```json
{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": "{\"code\":\"12345\",\"belong_org_code\":\"1\",\"userId\":\"FL-09527\"}"
}
```

**data 字段说明**:
- `code`: user.uid（用户内部ID）
- `belong_org_code`: user.company（公司ID）
- `userId`: user.userId（工号）

**失败响应（参数缺失）**:
```json
{
    "errorCode": 402001,
    "errorMsg": "姓名不能为空",
    "data": null
}
```

```json
{
    "errorCode": 402002,
    "errorMsg": "身份证号不能为空",
    "data": null
}
```

```json
{
    "errorCode": 402003,
    "errorMsg": "手机号不能为空",
    "data": null
}
```

```json
{
    "errorCode": 402005,
    "errorMsg": "部门ID不能为空",
    "data": null
}
```

```json
{
    "errorCode": 402006,
    "errorMsg": "职位ID不能为空",
    "data": null
}
```

```json
{
    "errorCode": 402007,
    "errorMsg": "公司ID不能为空",
    "data": null
}
```

**失败响应（业务校验）**:
```json
{
    "errorCode": 402008,
    "errorMsg": "公司不存在: 999",
    "data": null
}
```

```json
{
    "errorCode": 402009,
    "errorMsg": "部门不存在: 999",
    "data": null
}
```

```json
{
    "errorCode": 402010,
    "errorMsg": "职位不存在: 999",
    "data": null
}
```

```json
{
    "errorCode": 402011,
    "errorMsg": "手机号或身份证已被使用",
    "data": null
}
```

```json
{
    "errorCode": 402012,
    "errorMsg": "登录名已存在: zhangsan",
    "data": null
}
```

```json
{
    "errorCode": 402013,
    "errorMsg": "游客角色配置不存在",
    "data": null
}
```

**失败响应（系统异常）**:
```json
{
    "errorCode": 500006,
    "errorMsg": "同步用户失败: 数据库异常",
    "data": null
}
```

---

## 错误码说明

### 通用错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 500003 | 同步职位失败 |
| 500004 | 同步部门失败 |
| 500006 | 同步用户失败 |

### 职位同步错误码

| 错误码 | 说明 |
|--------|------|
| 400001 | 职位名称不能为空 |
| 400003 | 部门类型不能为空 |
| 510001 | 部门类型不存在 |
| 130016 | 职位已存在 |

### 部门同步错误码

| 错误码 | 说明 |
|--------|------|
| 401001 | 部门名称不能为空 |
| 401002 | 组织编码不能为空 |
| 401003 | 部门类型不能为空 |
| 511001 | 部门类型不存在 |
| 511002 | 父部门不存在 |
| 511003 | 部门经理不存在 |
| 511004 | 组织编码格式错误，必须是数字 |
| 130017 | 部门名称已存在 |

### 用户同步错误码

| 错误码 | 说明 |
|--------|------|
| 402001 | 姓名不能为空 |
| 402002 | 身份证号不能为空 |
| 402003 | 手机号不能为空 |
| 402005 | 部门ID不能为空 |
| 402006 | 职位ID不能为空 |
| 402007 | 公司ID不能为空 |
| 402008 | 公司不存在 |
| 402009 | 部门不存在 |
| 402010 | 职位不存在 |
| 402011 | 手机号或身份证已被使用 |
| 402012 | 登录名已存在 |
| 402013 | 游客角色配置不存在 |

---

## 数据字典

### 状态值 (status)

#### 职位/部门状态

| 值 | 说明 |
|----|------|
| 1 | 启用 |
| 2 | 禁用 |

#### 用户状态

| 外部参数 | 内部常量 | 说明 |
|----------|---------|------|
| 1 | 0 | 在职 |
| 0 | 1 | 离职 |
| 2 | 2 | 停薪留职 |

### 性别值 (gender)

| 值 | 说明 |
|----|------|
| 0 | 女 |
| 1 | 男 |

### 是否领导岗 (leader_flag)

| 值 | 说明 |
|----|------|
| 0 | 否 |
| 1 | 是 |

### 部门类型 (type)

部门类型ID 需要从 `departmenttype` 表中查询，常见的类型包括：

| 类型ID | 说明 |
|--------|------|
| 1 | 默认类型 |
| ... | 其他类型（根据实际业务配置） |

### 编号规则

| 对象 | 编号规则 | 示例 |
|------|---------|------|
| 职位 | D + 3位数字 | D001, D002, D003 |
| 部门 | DEPT + 4位数字 | DEPT0001, DEPT0002, DEPT0003 |
| 用户 | 公司简称U- + 5位数字 | FLU-00001, FLU-00002, SYU-00001 |

---

## 测试场景

### 场景1：新增职位

```bash
# 1. 新增职位（自动生成编号）
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=司机" \
  -d "type=1" \
  -d "status=1" \
  -d "leader_flag=0"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"123"}
```

### 场景2：更新职位

```bash
# 2. 更新职位名称和状态
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=POST9526" \
  -d "name=高级司机" \
  -d "type=1" \
  -d "status=1" \
  -d "leader_flag=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"123"}
```

### 场景3：新增顶级部门

```bash
# 3. 新增顶级部门
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=设计一部" \
  -d "type=1" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"456"}
```

### 场景4：新增子部门

```bash
# 4. 新增子部门
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=设计一组" \
  -d "type=1" \
  -d "parent_code=DEPT9526" \
  -d "org_code=1" \
  -d "status=1" \
  -d "order_value=1" \
  -d "leader_code=FL-09527" \
  -d 'posts={"1": 10, "2": 20}'

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"457"}
```

### 场景5：更新部门

```bash
# 5. 更新部门信息
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=DEPT9526" \
  -d "name=设计一部（更新）" \
  -d "type=1" \
  -d "org_code=1" \
  -d "status=2" \
  -d "order_value=2"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"456"}
```

### 场景6：错误测试 - 名称重复

```bash
# 6. 测试职位名称重复
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=司机" \
  -d "type=1"

# 预期返回：{"errorCode":130016,"errorMsg":"职位已存在: 司机","data":null}
```

### 场景7：错误测试 - 缺少必填参数

```bash
# 7. 测试缺少必填参数
curl -X POST "http://localhost:8080/Rhadamanthus/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "type=1"

# 预期返回：{"errorCode":400001,"errorMsg":"职位名称不能为空","data":null}
```

### 场景8：错误测试 - org_code 格式错误

```bash
# 8. 测试 org_code 格式错误
curl -X POST "http://localhost:8080/Rhadamanthus/syncDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=测试部门" \
  -d "type=1" \
  -d "org_code=ABC" \
  -d "status=1"

# 预期返回：{"errorCode":511004,"errorMsg":"组织编码格式错误，必须是数字: ABC","data":null}
```

### 场景9：新增用户（自动生成工号）

```bash
# 9. 新增用户，系统自动生成工号
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=张三" \
  -d "gender=1" \
  -d "identity=210xxx199001011234" \
  -d "phone=13800138000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"{\"code\":\"12345\",\"belong_org_code\":\"1\",\"userId\":\"FLU-00001\"}"}
```

### 场景10：新增用户（指定工号）

```bash
# 10. 新增用户，指定工号
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "login_id=lisi" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"{\"code\":\"12346\",\"belong_org_code\":\"1\",\"userId\":\"FL-09527\"}"}
```

### 场景11：更新用户（基本信息）

```bash
# 11. 更新用户基本信息
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四（更新）" \
  -d "gender=0" \
  -d "identity=210xxx199002023456" \
  -d "phone=13900139999" \
  -d "dept_id=124" \
  -d "duty_id=457" \
  -d "company=1" \
  -d "status=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"{\"code\":\"12346\",\"belong_org_code\":\"1\",\"userId\":\"FL-09527\"}"}
```

### 场景12：更新用户（跨公司调动）

```bash
# 12. 用户跨公司调动
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "dept_id=200" \
  -d "duty_id=500" \
  -d "company=2" \
  -d "status=1"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"{\"code\":\"12346\",\"belong_org_code\":\"2\",\"userId\":\"FL-09527\"}"}
```

### 场景13：更新用户（离职）

```bash
# 13. 用户离职
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09527" \
  -d "name=李四" \
  -d "gender=1" \
  -d "identity=210xxx199002022345" \
  -d "phone=13900139000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1" \
  -d "status=0"

# 预期返回：{"errorCode":0,"errorMsg":"成功","data":"{\"code\":\"12346\",\"belong_org_code\":\"1\",\"userId\":\"FL-09527\"}"}
```

### 场景14：错误测试 - 手机号重复

```bash
# 14. 测试手机号重复
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=王五" \
  -d "identity=210xxx199003033456" \
  -d "phone=13800138000" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1"

# 预期返回：{"errorCode":402011,"errorMsg":"手机号或身份证已被使用","data":null}
```

### 场景15：错误测试 - 登录名重复

```bash
# 15. 测试登录名重复
curl -X POST "http://localhost:8080/Rhadamanthus/syncUser.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=FL-09528" \
  -d "name=王五" \
  -d "identity=210xxx199003033456" \
  -d "phone=13900139555" \
  -d "login_id=lisi" \
  -d "dept_id=123" \
  -d "duty_id=456" \
  -d "company=1"

# 预期返回：{"errorCode":402012,"errorMsg":"登录名已存在: lisi","data":null}
```

---

## 注意事项

### 1. 编号生成规则

- **职位编号**：自动生成时格式为 `D001`, `D002`，递增
- **部门编号**：自动生成时格式为 `DEPT0001`, `DEPT0002`，递增
- **用户工号**：自动生成时格式为 `公司简称U-00001`，递增（如：FLU-00001）
- **编号唯一性**：系统保证编号不会重复

### 2. 更新操作

- **通过编码查找**：更新时必须提供 `code` 参数
- **部分更新**：只更新提供的字段，未提供的字段保持不变
- **编码不可修改**：更新时不能修改 `code` 字段
- **用户特殊限制**：
  - ❌ 不允许修改登录名（login_id）
  - ✅ 允许修改手机号/身份证（更新时不检查重复）
  - ✅ 允许跨公司调动

### 3. 业务校验

- **名称唯一性**：
  - 职位：全局唯一
  - 部门：同一公司内唯一
  - 用户：不限制姓名重复
- **关联数据校验**：
  - 父部门必须存在
  - 部门经理用户必须存在
  - 部门类型必须存在
  - 公司必须存在（用户）
  - 部门必须存在（用户）
  - 职位必须存在（用户）
- **唯一性校验（用户新增）**：
  - 手机号不能已存在
  - 身份证号不能已存在
  - 登录名不能已存在

### 4. 并发控制

- **职位编号生成**：使用 `synchronized` 保护，避免单机并发重复
- **部门编号生成**：查询数据库最大编号后递增
- **用户工号生成**：使用计数器服务（countingService），保证编号唯一性

### 5. 字段说明

- **org_code（职位）**：保留字段，当前未使用
- **org_code（部门）**：对应 `company.cid`，必须是纯数字字符串
- **posts**：定岗数据，JSON 字符串格式，存储在部门备注字段
- **login_id（用户）**：登录用户名，可选，默认使用工号（userId）
- **current_name（用户）**：现用名，可选，默认使用姓名（name）
- **status（用户）**：
  - 外部参数：1=在职，0=离职，2=停薪留职
  - 内部常量：0=在职，1=离职，2=停薪留职

---

## 附录

### A. 数据库表结构

#### duty（职位表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| did | BIGINT | 职位ID（主键） |
| name | VARCHAR | 职位名称 |
| code | VARCHAR | 职位编码 |
| dtid | INT | 部门类型ID |
| status | SMALLINT | 状态 |
| lead | SMALLINT | 是否领导岗 |
| pinyin | VARCHAR | 拼音 |

#### department（部门表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| did | BIGINT | 部门ID（主键） |
| name | VARCHAR | 部门名称 |
| no | VARCHAR | 部门编号 |
| type | INT | 部门类型ID |
| fatherDept | BIGINT | 父部门ID |
| company | INT | 公司ID |
| aompany | INT | 业绩公司ID |
| status | SMALLINT | 状态 |
| manager | BIGINT | 部门经理ID |
| pinyin | VARCHAR | 拼音 |
| alias | VARCHAR | 别称 |
| comment | TEXT | 备注（存储定岗数据） |
| limit | INT | 排序值/限制 |
| isdet | SMALLINT | 是否详细部门 |

#### user（用户表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| uid | INT | 用户ID（主键） |
| userId | VARCHAR | 工号 |
| name | VARCHAR | 姓名 |
| currentName | VARCHAR | 现用名 |
| gender | VARCHAR | 性别 |
| identity | VARCHAR | 身份证号 |
| mobile | VARCHAR | 手机号 |
| loginId | VARCHAR | 登录用户名 |
| password | VARCHAR | 密码（MD5加密） |
| dept | BIGINT | 部门ID（外键） |
| duty | BIGINT | 职位ID（外键） |
| company | INT | 公司ID |
| status | SMALLINT | 状态 |
| role | BIGINT | 角色ID（外键） |
| pinYin | VARCHAR | 拼音 |
| isLogin | SMALLINT | 是否允许登录 |
| extranet | SMALLINT | 外网访问权限 |
| type | SMALLINT | 用户类型 |
| isUpdate | SMALLINT | 更新标识 |

### B. 相关文件

- **Action**: `src/com/fanglin/seiya/action/A20260324Action.java`
- **Service接口**: `src/com/fanglin/seiya/service/A20260324Service.java`
- **Service实现**: `src/com/fanglin/seiya/service/impl/A20260324ServiceImpl.java`
- **DAO接口**: `src/com/fanglin/communion/dao/DepartmentDao.java`
- **DAO实现**: `src/com/fanglin/communion/dao/impl/DepartmentDaoImpl.java`

---

## 更新日志

### v1.1 (2026-03-26)

- ✅ 新增用户同步接口（syncUser）
- ✅ 支持用户新增和更新操作
- ✅ 支持自动生成工号和指定工号
- ✅ 支持跨公司调动
- ✅ 支持状态管理（在职/离职/停薪留职）
- ✅ 完善用户数据校验
- ✅ 添加定岗人数处理

### v1.0 (2026-03-24)

- ✅ 新增职位同步接口
- ✅ 新增部门同步接口
- ✅ 支持新增和更新操作
- ✅ 完善业务校验
- ✅ 添加并发控制
- ✅ 优化编号生成算法

---

**文档维护**: 如有疑问或需要更新，请联系开发团队
