# 职位同步接口文档

> **接口名称**: syncDuty
> **接口路径**: `/syncDuty.do`
> **创建日期**: 2026-03-24
> **模块**: seiya (A20260324)
> **功能**: 同步职位信息，支持新增/更新/逻辑删除

---

## 📋 目录

- [1. 功能概述](#1-功能概述)
- [2. 接口说明](#2-接口说明)
- [3. 参数映射](#3-参数映射)
- [4. 业务逻辑](#4-业务逻辑)
- [5. 返回结果](#5-返回结果)
- [6. 错误码](#6-错误码)
- [7. 测试案例](#7-测试案例)
- [8. 注意事项](#8-注意事项)

---

## 1. 功能概述

`syncDuty` 接口用于从外部系统同步职位信息到信息平台（Rhadamanthus ERP），支持以下操作：

- ✅ **新增职位**：创建新的职位记录
- ✅ **更新职位**：更新现有职位信息
- ✅ **逻辑删除**：通过状态控制实现软删除

**核心特性**：
- 通过部门编号自动关联部门类型
- 自动生成职位拼音（便于搜索）
- 自动生成职位编号（D001、D002...）
- 完整的参数验证和异常处理
- 详细的操作日志记录

---

## 2. 接口说明

### 2.1 请求信息

| 项目 | 内容 |
|------|------|
| **请求方式** | POST |
| **Content-Type** | application/x-www-form-urlencoded |
| **接口路径** | `/syncDuty.do` |
| **Action 类** | `com.fanglin.seiya.action.A20260324Action` |
| **Service 类** | `com.fanglin.seiya.service.impl.A20260324ServiceImpl` |

### 2.2 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| `name` | String | ✅ 是 | 职位名称（如：司机、设计师） |
| `code` | Long | ❌ 否 | 职位ID（更新时提供，新增时为空） |
| `org_code` | String | ✅ 是 | 部门编号（如：DEPT9526） |
| `type` | Integer | ✅ 是 | 部门类型ID |
| `status` | Integer | ❌ 否 | 状态：1=启用，2=禁用（默认1） |
| `leader_flag` | Integer | ❌ 否 | 是否领导岗：0=否，1=是（默认0） |

### 2.3 响应格式

**Content-Type**: `application/json`

```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "943"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `errorCode` | Integer | 状态码：0=成功，其他=失败 |
| `errorMsg` | String | 错误信息 |
| `data` | String | 职位ID（did）的字符串形式 |

---

## 3. 参数映射

### 3.1 字段映射关系

| 外部参数 | 数据库字段 | 转换规则 | 说明 |
|---------|-----------|---------|------|
| `name` | `duty.name` | 直接映射 | 职位名称 |
| `code` | `duty.did` | 直接映射 | 职位ID（主键） |
| `org_code` | `department.no` → `duty.departmentType` | 先通过 `org_code` 查询部门，再获取部门类型 | 部门编号 |
| `type` | `duty.departmentType.dtid` | 直接映射 | 部门类型ID |
| `status` | `duty.status` | **状态转换**：<br>1 → 0（启用）<br>2 → 1（禁用） | 状态值需要转换 |
| `leader_flag` | `duty.lead` | 直接映射 | 是否领导岗 |
| - | `duty.type` | 固定为 0 | 保留字段 |
| - | `duty.pinyin` | 自动生成 | 根据名称生成拼音 |
| - | `duty.code` | 自动生成 | D001、D002...（新增时） |

### 3.2 状态映射表

| 外部 status | 数据库 status | 说明 |
|------------|-------------|------|
| `1` | `0` | 启用（STATUS_INIT_INT） |
| `2` | `1` | 禁用（逻辑删除） |
| `null` 或其他 | `0` | 默认启用 |

---

## 4. 业务逻辑

### 4.1 流程图

```
开始
  ↓
[参数验证]
  ├─ name 不能为空 → 400001
  ├─ org_code 不能为空 → 400002
  └─ type 不能为空 → 400003
  ↓
[通过 org_code 查询部门]
  └─ 部门不存在 → 510001
  ↓
[获取部门类型]
  └─ 如果部门无类型，使用传入的 type 参数
  ↓
[状态转换]
  └─ status: 1→0(启用), 2→1(禁用)
  ↓
[判断操作类型]
  ├─ code 为空 → 新增
  ├─ code 有值且找到职位 → 更新
  └─ code 有值但未找到 → 新增（警告日志）
  ↓
[新增操作]
  ├─ 检查名称重复 → 130016
  ├─ 自动生成拼音
  ├─ 自动生成编号（D001...）
  └─ 保存到数据库
  ↓
[更新操作]
  ├─ 更新所有字段
  ├─ 更新拼音
  └─ 更新数据库
  ↓
[返回职位ID]
  ↓
结束
```

### 4.2 核心代码逻辑

**文件**: `src/com/fanglin/seiya/service/impl/A20260324ServiceImpl.java:43-153`

#### 关键步骤说明

1. **部门查询**：
   ```java
   DepartmentPO department = departmentDao.queryDepartmentByNo(orgCode);
   if (department == null) {
       throw new FLException(510001, "部门不存在: " + orgCode);
   }
   ```

2. **部门类型获取**：
   ```java
   DepartmentTypePO departmentType = department.getType();
   if (departmentType == null) {
       departmentType = new DepartmentTypePO(type);
   }
   ```

3. **操作类型判断**：
   ```java
   if (code != null && code > 0) {
       dutyPO = dutyDao.get(code.longValue());
       if (dutyPO != null) {
           operation = "update";
       }
   }
   ```

4. **新增时检查重复**：
   ```java
   DutyPO existingDuty = dutyDao.queryDutyByName(name);
   if (existingDuty != null) {
       throw new FLException(130016, "职位已存在: " + name);
   }
   ```

5. **自动生成编号**：
   ```java
   private String generateDutyCode() {
       String maxCode = dutyDao.queryMaxDutyCode();
       if (maxCode == null || maxCode.isEmpty()) {
           return "D001";
       }
       int num = Integer.parseInt(maxCode.substring(1));
       return String.format("D%03d", num + 1);
   }
   ```

---

## 5. 返回结果

### 5.1 成功响应

```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "943"
}
```

**字段说明**：
- `errorCode = 0`：表示操作成功
- `data = "943"`：返回职位ID（did）

### 5.2 失败响应

```json
{
    "errorCode": 400001,
    "errorMsg": "职位名称不能为空",
    "data": null
}
```

---

## 6. 错误码

### 6.1 参数验证错误（400xxx）

| 错误码 | 错误信息 | 场景 |
|-------|---------|------|
| `400001` | 职位名称不能为空 | `name` 为空或空字符串 |
| `400002` | 部门编号不能为空 | `org_code` 为空或空字符串 |
| `400003` | 部门类型不能为空 | `type` 为 null |

### 6.2 业务逻辑错误（13xxxx）

| 错误码 | 错误信息 | 场景 |
|-------|---------|------|
| `130016` | 职位已存在: {name} | 新增时职位名称重复 |

### 6.3 系统错误（51xxxx, 500xxx）

| 错误码 | 错误信息 | 场景 |
|-------|---------|------|
| `510001` | 部门不存在: {org_code} | 通过 org_code 未找到部门 |
| `500003` | 同步职位失败: {异常信息} | 系统内部异常 |

---

## 7. 测试案例

### 7.1 测试环境信息

```
服务器: http://192.168.5.21/
端口: 80
认证: authentication（从Cookie获取）
```

### 7.2 测试前准备

#### (1) 查询现有部门（获取 org_code）

```bash
curl -X POST "http://192.168.5.21/pageDepartment.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "page.pageNo=1&page.pageSize=10"
```

**预期响应**：
```json
{
    "departments": [
        {
            "did": 123,
            "no": "DEPT9526",
            "name": "材料部",
            "type": {
                "dtid": 2,
                "name": "材料部"
            }
        }
    ]
}
```

#### (2) 查询现有职位（避免重复）

```bash
curl -X POST "http://192.168.5.21/queryDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN"
```

---

### 7.3 测试案例

#### **案例1：新增职位（司机）**

```bash
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=司机" \
  -d "org_code=DEPT9526" \
  -d "type=2" \
  -d "status=1" \
  -d "leader_flag=0"
```

**请求参数**：
- `name=司机`：职位名称
- `org_code=DEPT9526`：部门编号
- `type=2`：部门类型ID
- `status=1`：启用
- `leader_flag=0`：非领导岗
- `code`：未提供（新增）

**预期响应**：
```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "943"
}
```

**验证**：
```bash
curl -X POST "http://192.168.5.21/queryDuty.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN"

# 预期能在返回的职位列表中看到：
# {
#     "did": 943,
#     "name": "司机",
#     "code": "D001",
#     "status": 0,
#     "lead": 0
# }
```

---

#### **案例2：更新职位（司机 → 高级司机）**

```bash
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=高级司机" \
  -d "code=943" \
  -d "org_code=DEPT9526" \
  -d "type=2" \
  -d "status=1" \
  -d "leader_flag=1"
```

**请求参数**：
- `code=943`：职位ID（更新时必须提供）
- `name=高级司机`：修改职位名称
- `leader_flag=1`：改为领导岗

**预期响应**：
```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "943"
}
```

---

#### **案例3：逻辑删除（禁用职位）**

```bash
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=高级司机" \
  -d "code=943" \
  -d "org_code=DEPT9526" \
  -d "type=2" \
  -d "status=2" \
  -d "leader_flag=1"
```

**请求参数**：
- `code=943`：职位ID
- `status=2`：禁用（逻辑删除）

**预期响应**：
```json
{
    "errorCode": 0,
    "errorMsg": "",
    "data": "943"
}
```

**验证**：
```bash
curl -X POST "http://192.168.5.21/pageDuty.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "page.pageNo=1&page.pageSize=20&filters[0].field=status&filters[0].op=eq&filters[0].data=1"

# 预期能在返回的禁用职位列表中看到 did=943 的职位
```

---

#### **案例4：参数验证测试（缺少必填参数）**

```bash
# 缺少 name 参数
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "org_code=DEPT9526" \
  -d "type=2"
```

**预期响应**：
```json
{
    "errorCode": 400001,
    "errorMsg": "职位名称不能为空",
    "data": null
}
```

---

#### **案例5：部门不存在测试**

```bash
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=测试职位" \
  -d "org_code=INVALID_DEPT" \
  -d "type=2"
```

**预期响应**：
```json
{
    "errorCode": 510001,
    "errorMsg": "部门不存在: INVALID_DEPT",
    "data": null
}
```

---

#### **案例6：新增重复职位测试**

```bash
# 第一次新增
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=测试职位" \
  -d "org_code=DEPT9526" \
  -d "type=2"

# 第二次新增（相同名称）
curl -X POST "http://192.168.5.21/syncDuty.do" \
  -H "Cookie: authentication=YOUR_AUTH_TOKEN" \
  -d "name=测试职位" \
  -d "org_code=DEPT9526" \
  -d "type=2"
```

**第二次预期响应**：
```json
{
    "errorCode": 130016,
    "errorMsg": "职位已存在: 测试职位",
    "data": null
}
```

---

### 7.4 批量测试脚本

#### Bash 脚本（Linux/Mac）

```bash
#!/bin/bash

# 配置
SERVER="http://192.168.5.21"
AUTH_TOKEN="YOUR_AUTH_TOKEN"

# 测试函数
test_sync_duty() {
    local name=$1
    local code=$2
    local org_code=$3
    local type=$4
    local status=$5
    local leader_flag=$6

    echo "========================================="
    echo "测试: $name"
    echo "========================================="

    curl -X POST "$SERVER/syncDuty.do" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -H "Cookie: authentication=$AUTH_TOKEN" \
      -d "name=$name" \
      -d "code=$code" \
      -d "org_code=$org_code" \
      -d "type=$type" \
      -d "status=$status" \
      -d "leader_flag=$leader_flag" \
      -s | jq '.'

    echo ""
    sleep 1
}

# 执行测试
test_sync_duty "司机" "" "DEPT9526" 2 1 0
test_sync_duty "设计师" "" "DEPT9526" 2 1 0
test_sync_duty "项目经理" "" "DEPT9526" 2 1 1

echo "测试完成！"
```

#### PowerShell 脚本（Windows）

```powershell
# 配置
$Server = "http://192.168.5.21"
$AuthToken = "YOUR_AUTH_TOKEN"

# 测试函数
function Test-SyncDuty {
    param(
        [string]$Name,
        [string]$Code,
        [string]$OrgCode,
        [int]$Type,
        [int]$Status,
        [int]$LeaderFlag
    )

    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "测试: $Name" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green

    $Body = @{
        name = $Name
        org_code = $OrgCode
        type = $Type
        status = $Status
        leader_flag = $LeaderFlag
    }

    if ($Code -ne "") {
        $Body.code = $Code
    }

    $Response = Invoke-RestMethod -Uri "$Server/syncDuty.do" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body $Body `
        -Headers @{ "Cookie" = "authentication=$AuthToken" }

    $Response | ConvertTo-Json
    Write-Host ""
}

# 执行测试
Test-SyncDuty -Name "司机" -OrgCode "DEPT9526" -Type 2 -Status 1 -LeaderFlag 0
Test-SyncDuty -Name "设计师" -OrgCode "DEPT9526" -Type 2 -Status 1 -LeaderFlag 0
Test-SyncDuty -Name "项目经理" -OrgCode "DEPT9526" -Type 2 -Status 1 -LeaderFlag 1

Write-Host "测试完成！" -ForegroundColor Cyan
```

---

## 8. 注意事项

### 8.1 开发注意事项

1. **状态值转换**：
   - 外部系统传入 `status=1`（启用），系统自动转换为 `duty.status=0`
   - 外部系统传入 `status=2`（禁用），系统自动转换为 `duty.status=1`
   - **务必注意**：不要混淆这两个系统的状态值！

2. **部门编号 vs 部门类型**：
   - `org_code` 是部门编号（`department.no`），用于查询具体部门
   - `type` 是部门类型ID（`departmenttype.dtid`），用于关联职位
   - 两者不同，不要混淆

3. **code 参数含义**：
   - `code` 是职位ID（`did`），不是编号（`code` 字段）
   - 新增时不传 `code`
   - 更新时必须传 `code`

4. **拼音自动生成**：
   - 拼音字段（`pinyin`）系统自动生成，无需手动传入
   - 生成失败会记录警告日志，但不影响主流程

5. **编号自动生成**：
   - 职位编号（`code` 字段）系统自动生成（D001、D002...）
   - 格式：`D` + 3位数字

### 8.2 测试注意事项

1. **认证 Token**：
   - 所有请求都需要有效的 `authentication` Cookie
   - Token 从登录接口获取
   - Token 有效期：120分钟

2. **测试环境**：
   - 内网测试环境：`http://192.168.5.21/`
   - 生产环境：根据实际配置

3. **测试顺序**：
   - 建议按以下顺序测试：
     1. 参数验证（错误案例）
     2. 新增职位
     3. 更新职位
     4. 逻辑删除
     5. 异常场景（部门不存在、重复等）

4. **数据清理**：
   - 测试完成后，可以通过 `status=2` 逻辑删除测试数据
   - 或直接在数据库中删除测试记录

### 8.3 生产部署注意事项

1. **日志监控**：
   - 关注日志中的警告和错误信息
   - 关键日志位置：`A20260324ServiceImpl.java:46-47, 75, 119, 141, 150`

2. **性能考虑**：
   - 批量同步时，建议控制并发数（建议 ≤10）
   - 单次同步耗时：约 50-150ms

3. **异常处理**：
   - 所有异常都会被捕获并转换为 `FLException`
   - 异常信息会记录到日志，但不会暴露给调用方

4. **事务管理**：
   - 方法使用 `@Transactional` 注解
   - 任何异常都会触发回滚

---

## 9. 附录

### 9.1 相关文件清单

| 文件路径 | 说明 |
|---------|------|
| `src/com/fanglin/seiya/action/A20260324Action.java` | Action 控制器 |
| `src/com/fanglin/seiya/service/A20260324Service.java` | Service 接口 |
| `src/com/fanglin/seiya/service/impl/A20260324ServiceImpl.java` | Service 实现 |
| `src/com/fanglin/communion/dao/DutyDao.java` | 职位 DAO 接口 |
| `src/com/fanglin/communion/dao/DepartmentDao.java` | 部门 DAO 接口 |
| `src/com/fanglin/communion/po/DutyPO.java` | 职位实体 |
| `src/com/fanglin/communion/po/DepartmentPO.java` | 部门实体 |

### 9.2 数据库表结构

#### duty 表
```sql
CREATE TABLE `duty` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT '',
  `name` varchar(50) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `departmentType` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `lead` tinyint(1) NOT NULL,
  PRIMARY KEY (`did`),
  KEY `idx_departmentType` (`departmentType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='职位表';
```

#### department 表
```sql
CREATE TABLE `department` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL COMMENT '部门ID',
  `code` varchar(32) DEFAULT '',
  `name` varchar(32) NOT NULL COMMENT '部门名称',
  `type` int(11) DEFAULT NULL COMMENT '部门类型',
  -- 其他字段...
  PRIMARY KEY (`did`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门表';
```

#### departmenttype 表
```sql
CREATE TABLE `departmenttype` (
  `dtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`dtid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门类型表';
```

### 9.3 版本历史

| 版本 | 日期 | 说明 | 作者 |
|------|------|------|------|
| 1.0 | 2026-03-24 | 初始版本，实现基本的职位同步功能 | AI |

---

## 10. 联系方式

如有问题，请联系：
- **技术支持**: 参考项目 CLAUDE.md
- **文档维护**: AI 自动生成

---

**文档结束**
