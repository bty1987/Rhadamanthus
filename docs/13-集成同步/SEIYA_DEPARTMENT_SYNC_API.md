# 部门同步接口 - 新增功能说明

> **接口名称**: syncDepartment
> **接口路径**: `/syncDepartment.do`
> **创建日期**: 2026-03-24
> **模块**: seiya (A20260324)

---

## 📋 功能概述

在 `A20260324Action` 中新增 `syncDepartment` 方法，用于同步部门信息，支持新增/更新/逻辑删除。

---

## 1️⃣ 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `dept_name` | String | ✅ 是 | 部门名称 |
| `dept_code` | Long | ❌ 否 | 部门ID（更新时提供） |
| `dept_type` | Integer | ✅ 是 | 部门类型ID |
| `dept_parent_code` | String | ❌ 否 | 父部门编号（如：FL_ED_02） |
| `dept_org_code` | Integer | ✅ 是 | 公司ID |
| `dept_status` | Integer | ❌ 否 | 状态：1=启用，2=禁用 |
| `dept_leader_code` | String | ❌ 否 | 部门经理工号（如：FL-09527） |
| `dept_posts` | String | ❌ 否 | 定岗数据JSON（如：{"1": 10, "2": 20}） |

**参数命名说明**：所有部门同步参数都加了 `dept_` 前缀，避免与职位参数（`name`, `code`, `type` 等）冲突。

---

## 2️⃣ 参数映射

### 字段映射关系

| 外部参数 | Department字段 | 转换规则 |
|---------|---------------|---------|
| `dept_name` | `name` | 直接映射 |
| `dept_code` | `did` | 直接映射 |
| `dept_type` | `type.dtid` | 直接映射 |
| `dept_parent_code` | `fatherDept.did` | 查询转换 |
| `dept_org_code` | `company` | 直接映射 |
| `dept_status` | `status` | **1→1, 2→0** |
| `dept_leader_code` | `manager.uid` | 查询转换 |
| `dept_posts` | `comment` | JSON存储 |
| - | `no` | 自动生成 |
| - | `pinyin` | 自动生成 |
| - | `alias` | 自动生成（=name） |
| - | `aompany` | 自动设置（=company） |

---

## 3️⃣ 与 syncDuty 的关键差异

| 项目 | syncDuty（职位） | syncDepartment（部门） |
|------|-----------------|---------------------|
| **主键类型** | `Long` | `Integer` |
| **状态转换** | 1→0启用，2→1禁用 | **1→1启用，2→0禁用（相反！）** |
| **父级关系** | 无 | 有（`fatherDept`） |
| **领导字段** | `leader_flag`（0/1） | `manager`（用户对象） |
| **扩展数据** | 无 | `posts`（定岗JSON） |
| **公司关联** | 通过部门编号 | 直接指定公司ID |
| **编号生成** | `D001`、`D002` | `SYNC_xxx_xxx`（简化实现） |

---

## 4️⃣ 核心业务逻辑

### 状态转换（重要）

```java
// Department状态转换：与Duty相反！
short deptStatus = (status == 1)
    ? DepartmentPO.STATUS_ENABLE_INT   // 1 → 1（启用）
    : DepartmentPO.STATUS_DISABLE_INT;  // 2 → 0（禁用）
```

### 操作类型判断

```java
if (code != null && code > 0) {
    deptPO = departmentDao.get(code.intValue());
    if (deptPO != null) {
        operation = "update";  // 更新
    } else {
        operation = "add";     // 新增（code无效）
    }
} else {
    operation = "add";         // 新增（code为空）
}
```

### 自动生成内容

- **拼音**：根据部门名称自动生成
- **编号**：`SYNC_{时间戳}_{随机数}`（简化实现）
- **别称**：与部门名称相同
- **业绩公司**：与公司ID相同

### 可选字段处理

- **父部门**：找不到时记录警告日志，继续执行
- **部门经理**：找不到时记录警告日志，继续执行

---

## 5️⃣ 返回结果

```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "123"
}
```

- `errorCode`: 0=成功
- `data`: 部门ID（did）的字符串形式

---

## 6️⃣ 错误码

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| `401001` | 部门名称不能为空 | 参数验证 |
| `401002` | 公司ID不能为空 | 参数验证 |
| `401003` | 部门类型不能为空 | 参数验证 |
| `511001` | 部门类型不存在: {type} | 业务验证 |
| `500004` | 同步部门失败: {异常信息} | 系统异常 |

---

## 7️⃣ 测试示例

### 新增部门

```bash
curl -X POST "http://192.168.5.21/syncDepartment.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "dept_name=设计一部" \
  -d "dept_type=1" \
  -d "dept_org_code=1" \
  -d "dept_status=1" \
  -d "dept_parent_code=FL_ED_02" \
  -d "dept_leader_code=FL-09527" \
  -d "dept_posts={\"1\": 10, \"2\": 20}"
```

### 更新部门

```bash
curl -X POST "http://192.168.5.21/syncDepartment.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "dept_name=设计一部（更新）" \
  -d "dept_code=123" \
  -d "dept_type=1" \
  -d "dept_org_code=1" \
  -d "dept_status=1"
```

### 逻辑删除

```bash
curl -X POST "http://192.168.5.21/syncDepartment.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "dept_name=设计一部" \
  -d "dept_code=123" \
  -d "dept_type=1" \
  -d "dept_org_code=1" \
  -d "dept_status=2"
```

---

## 8️⃣ 实现文件

| 文件路径 | 说明 |
|---------|------|
| `src/com/fanglin/seiya/action/A20260324Action.java:122-141` | 新增 `syncDepartment()` 方法 |
| `src/com/fanglin/seiya/service/A20260324Service.java:21-36` | 新增 `syncDepartment()` 接口定义 |
| `src/com/fanglin/seiya/service/impl/A20260324ServiceImpl.java:187-345` | 新增 `syncDepartment()` 实现 |

---

## 9️⃣ 注意事项

⚠️ **状态转换与 syncDuty 相反**：
- syncDuty: `status=1` → 数据库 `0`（启用）
- syncDepartment: `status=1` → 数据库 `1`（启用）

⚠️ **参数命名**：
- 部门参数都带 `dept_` 前缀，避免与职位参数冲突

⚠️ **部门编号生成**：
- 当前使用简化实现（时间戳+随机数）
- 生产环境建议改为规则化编号（如：FL_ED_001）

---

**文档结束**
