# addCustomerLead 异常场景汇总文档

> 最后更新：2026-03-14
>
> **文档说明**：本文档详细说明了 `addCustomerLead` 接口执行过程中所有抛出 `FLException` 的场景，包含完整的异常表格和处理建议。

---

## 📋 目录

1. [接口概述](#接口概述)
2. [异常分类总览](#异常分类总览)
3. [异常场景详细表格](#异常场景详细表格)
4. [接口参数说明](#接口参数说明)
5. [异常处理建议](#异常处理建议)
6. [调用示例](#调用示例)

---

## 接口概述

### 接口信息
- **接口名称**: 添加客户线索接口
- **接口路径**: `/addCustomerLead`
- **控制器**: `A20260103Action`
- **方法位置**: `src/com/fanglin/seiya/action/A20260103Action.java:210-352`

### 接口功能
接收外部系统（如 Salesforce）传入的客户线索信息，转换为 ERP 客户机会并创建，支持客户线索的自动分配和设计师指派。

### 核心流程
```
1. 参数必填验证
2. 查询创建人信息
3. 查询业务类型
4. 构建客户资源对象
5. 设置设计师/部门/分区
6. 调用 addCustomerChance 方法
7. 返回 ERP 编码信息
```

---

## 异常分类总览

### 异常统计
- **直接异常**: 4 种场景（接口层验证）
- **间接异常**: 18 种场景（调用 addCustomerChance）
- **总计**: 22 种异常场景

### 错误码分类
| 错误码前缀 | 分类 | 数量 |
|-----------|------|------|
| 40xxxx | 参数验证异常 | 2 种 |
| 13xxxx | 基础数据异常 | 5 种 |
| 19xxxx | 人员管理异常 | 1 种 |
| 31xxxx | 部门管理异常 | 2 种 |
| 33xxxx | 客户管理异常 | 12 种 |

---

## 异常场景详细表格

### 一、接口层异常（4种）

#### 1. 参数验证异常

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 | 优先级 |
|:---:|:------:|:---------|:---------|:---------|:------:|
| 1 | **400001** | 客户名称不能为空 | `name == null \|\| name.trim().isEmpty()` | A20260103Action:216-218 | ⭐⭐⭐ |
| 2 | **400002** | 客户电话不能为空 | `phone == null \|\| phone.trim().isEmpty()` | A20260103Action:219-221 | ⭐⭐⭐ |

**详细说明：**

- **400001 - 客户名称不能为空**
  - **触发场景**: 请求参数中 `name` 字段为空或只包含空白字符
  - **处理建议**: 确保传入有效的客户姓名
  - **示例值**: `"张三"`, `"李四"`

- **400002 - 客户电话不能为空**
  - **触发场景**: 请求参数中 `phone` 字段为空或只包含空白字符
  - **处理建议**: 确保传入有效的客户手机号（11位数字）
  - **示例值**: `"13800138000"`

#### 2. 业务数据验证异常

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 | 优先级 |
|:---:|:------:|:---------|:---------|:---------|:------:|
| 3 | **190005** | 人员不存在 | `userService.queryUserByUserId() == null` | A20260103Action:235-237 | ⭐⭐⭐ |
| 4 | **130061** | 业务类型不存在 | `decorationBusitypeService.queryByName() == null` | A20260103Action:243-245 | ⭐⭐⭐ |

**详细说明：**

- **190005 - 人员不存在**
  - **触发场景**: 根据 `userId` 未找到对应的用户记录
  - **处理建议**:
    - 检查 `userId` 是否正确（应为工号，如 "FL-123456"）
    - 确认用户是否在职（status=0）
    - 确认用户是否存在于系统中

- **130061 - 业务类型不存在**
  - **触发场景**: 根据 `busitype` 名称未找到对应的业务类型
  - **处理建议**:
    - 如果不传 `busitype`，默认使用 "电商信息流客源"
    - 确保业务类型名称正确
    - 检查业务类型是否已配置

---

### 二、服务层异常（18种）

#### 3. 客户机会创建异常（addCustomerChance 调用）

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 | 优先级 |
|:---:|:------:|:---------|:---------|:---------|:------:|
| 5 | **330075** | 客户机会不存在 | `customerChanceVO == null` | CustomerChanceServiceImpl:225-227 | ⭐⭐⭐ |
| 6 | **330071** | 客户资源不存在 | `source == null` | CustomerChanceServiceImpl:229-231 | ⭐⭐⭐ |
| 7 | **130018** | 楼盘不存在 | `village == null \|\| village.no == null` | CustomerChanceServiceImpl:270-272 | ⭐⭐⭐ |
| 8 | **130018** | 楼盘不存在 | `villageDao.get() == null` | CustomerChanceServiceImpl:274-277 | ⭐⭐⭐ |

#### 4. 客户资源创建异常

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 | 优先级 |
|:---:|:------:|:---------|:---------|:---------|:------:|
| 9 | **330071** | 客户手机号存在，发生撞尺 | 同一创建人已有相同手机号的资源 | CustomerSourceServiceImpl:186-188 | ⭐⭐ |
| 10 | **130061** | 业务类型为空 | `busitype == null \|\| dbid == null` | CustomerSourceServiceImpl:190-192 | ⭐⭐⭐ |
| 11 | **130061** | 业务类型不存在 | `decorationBusitypeDao.get() == null` | CustomerSourceServiceImpl:194-198 | ⭐⭐⭐ |
| 12 | **130062** | 业务类型不匹配 | `busitype.type == TYPE_ORIGIN_INT` | CustomerSourceServiceImpl:200-202 | ⭐⭐ |

#### 5. 客户资源分配异常

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 | 优先级 |
|:---:|:------:|:---------|:---------|:---------|:------:|
| 13 | **330071** | 客户资源不存在 | `customerSourceDao.get() == null` | CustomerSourceServiceImpl:457-461 | ⭐⭐⭐ |
| 14 | **330074** | 客户资源不可操作 | status为禁用或已转单 | CustomerSourceServiceImpl:463-465 | ⭐⭐⭐ |
| 15 | **330076** | 客户机会已存在 | 重复分配 | CustomerSourceServiceImpl:515-517,593-595,732-734 | ⭐⭐ |
| 16 | **330081** | 设计公司无设计师接单 | `existCustomerUserRule() == 0` | CustomerSourceServiceImpl:519-521 | ⭐⭐⭐ |
| 17 | **330081** | 无设计师接单 | 公司聚焦模式下无匹配规则 | CustomerSourceServiceImpl:544-546 | ⭐⭐⭐ |
| 18 | **330081** | 面积段无设计师接单 | 面积聚焦模式下无匹配规则 | CustomerSourceServiceImpl:548-550 | ⭐⭐⭐ |
| 19 | **330081** | 部门类型无设计师接单 | 部门类型聚焦模式下无匹配规则 | CustomerSourceServiceImpl:552-554 | ⭐⭐⭐ |
| 20 | **330081** | 部门无设计师接单 | 部门聚焦模式下无匹配规则 | CustomerSourceServiceImpl:556-558 | ⭐⭐⭐ |
| 21 | **330081** | 城区无设计师接单 | 城区聚焦模式下无匹配规则 | CustomerSourceServiceImpl:561-563 | ⭐⭐⭐ |
| 22 | **330081** | 设计师匹配规则不存在 | `customerUserRuleDao.get() == null` | CustomerSourceServiceImpl:567-569 | ⭐⭐⭐ |
| 23 | **310001** | 部门不存在 | `departmentDao.get() == null` | CustomerSourceServiceImpl:638-642,678-682 | ⭐⭐⭐ |
| 24 | **190005** | 人员不存在 | `userDao.queryUserByUserId() == null` | CustomerSourceServiceImpl:726-730 | ⭐⭐⭐ |

---

## 接口参数说明

### 请求参数

#### 基础参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|:----:|------|--------|
| `leadCode` | String | 否 | 线索编码（对应 cno） | `"LEAD202603140001"` |
| `adornCode` | String | 否 | 尺源编码（对应 source.no） | `"ADORN202603140001"` |
| `name` | String | **是** | 客户名称 | `"张三"` |
| `phone` | String | **是** | 客户电话（11位） | `"13800138000"` |
| `gender` | String | 否 | 客户性别 | `"男"` / `"女"` |
| `village` | String | 条件必填 | 楼盘名称 | `"方林世纪城"` |
| `houseNumber` | String | 条件必填 | 楼号 | `"1-101"` |
| `buildArea` | Integer | 否 | 建筑面积（单位：平方厘米） | `120000` (表示120㎡) |
| `busitype` | String | 否 | 业务类型名称（默认："电商信息流客源"） | `"电商信息流客源"` |
| `userId` | String | **是** | 创建人工号 | `"FL-123456"` |
| `orgId` | Integer | **是** | 公司标识（加密后的公司ID） | `1` |

#### 分配参数（根据部门规则传参）

| 参数名 | 类型 | 必填 | 适用场景 | 说明 | 示例值 |
|--------|------|:----:|:---------|------|--------|
| `designerId` | String | 条件必填 | 规则3：派到设计师 | 设计师工号 | `"FL-789012"` |
| `departmentId` | Integer | 条件必填 | 规则2：派到设计部门 | 部门ID | `101` |
| `regionId` | Integer | 条件必填 | 规则1：派到设计分区 | 分区ID | `100` |

**注意**：三个分配参数（designerId、departmentId、regionId）根据部门规则选择传递，优先级从高到低。

### 响应参数

#### 成功响应

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "condition": null,
  "data": {
    "leadCode": "LEAD202603140001",
    "adornCode": "ADORN202603140001",
    "name": "张三",
    "phone": "13800138000",
    "erpJhCode": "12345",
    "erpAssignerCode": "FL-123456",
    "erpDesignerCode": "FL-789012",
    "issusTime": "2026-03-14 10:30:00",
    "erpZxdCode": "FL2603140001",
    "isIssue": 1
  }
}
```

#### 异常响应

```json
{
  "errorCode": 400001,
  "errorMsg": "客户名称不能为空",
  "condition": null,
  "data": null
}
```

**返回字段说明：**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `erpJhCode` | String | ERP系统机会编码（对应 ccid） |
| `erpAssignerCode` | String | ERP设计师分派人编码（对应 issuer.userId） |
| `erpDesignerCode` | String | ERP设计师编码（对应 belonger.userId） |
| `issusTime` | String | 派尺时间（对应 issueTime） |
| `erpZxdCode` | String | 装修单编码（对应 orderId） |
| `isIssue` | Integer | 是否已分配（0:未分配, 1:已分配） |

---

## 异常处理建议

### 开发者建议

#### 1. 参数校验

在调用接口前，建议进行以下前置校验：

```javascript
// 前端校验示例
function validateParams(params) {
  // 必填参数校验
  if (!params.name || params.name.trim() === '') {
    return { valid: false, message: '客户名称不能为空' };
  }

  if (!params.phone || params.phone.trim() === '') {
    return { valid: false, message: '客户电话不能为空' };
  }

  // 手机号格式校验
  if (!/^1[3-9]\d{9}$/.test(params.phone)) {
    return { valid: false, message: '手机号格式不正确' };
  }

  // 建筑面积校验（如果提供）
  if (params.buildArea && params.buildArea <= 0) {
    return { valid: false, message: '建筑面积必须大于0' };
  }

  return { valid: true };
}
```

#### 2. 异常处理

```java
// Java 客户端异常处理示例
try {
    CustomerLeadResult result = customerLeadService.addCustomerLead(params);
    log.info("客户线索创建成功: {}", result.getErpJhCode());
} catch (FLException e) {
    int errorCode = e.getErrorCode();
    String errorMsg = e.getMessage();

    switch (errorCode) {
        case 400001:
        case 400002:
            // 参数错误 - 提示用户补全信息
            log.warn("参数错误: {}", errorMsg);
            break;

        case 190005:
            // 人员不存在 - 检查userId配置
            log.error("创建人不存在，请检查userId配置");
            break;

        case 130061:
            // 业务类型不存在 - 检查业务类型配置
            log.error("业务类型配置错误: {}", errorMsg);
            break;

        case 130018:
            // 楼盘不存在 - 提示用户选择有效楼盘
            log.warn("楼盘数据异常: {}", errorMsg);
            break;

        case 330081:
            // 无设计师接单 - 提示管理员配置分配规则
            log.error("客户分配规则未配置，请联系管理员");
            break;

        default:
            log.error("未知错误: [{}] {}", errorCode, errorMsg);
    }

    // 返回友好提示给用户
    return errorResponse(errorCode, errorMsg);
}
```

#### 3. 常见错误码处理流程

```
┌─────────────────┐
│  40xxxx 参数错误  │ → 检查必填参数 → 补全后重试
└─────────────────┘
         ↓
┌─────────────────┐
│ 19xxxx 人员错误  │ → 检查userId配置 → 使用正确的工号
└─────────────────┘
         ↓
┌─────────────────┐
│ 13xxxx 数据错误  │ → 检查基础数据配置 → 联系管理员
└─────────────────┘
         ↓
┌─────────────────┐
│ 33xxxx 客户错误  │ → 检查客户资源状态 → 使用新手机号
└─────────────────┘
         ↓
┌─────────────────┐
│ 330081 分配错误  │ → 检查分配规则配置 → 联系管理员配置
└─────────────────┘
```

---

## 调用示例

### 完整调用流程示例

```java
// 1. 构建请求参数
CustomerLeadRequest request = new CustomerLeadRequest();
request.setLeadCode("LEAD" + System.currentTimeMillis());
request.setAdornCode("ADORN" + System.currentTimeMillis());
request.setName("张三");
request.setPhone("13800138000");
request.setGender("男");
request.setVillage("方林世纪城");
request.setHouseNumber("1-101");
request.setBuildArea(120000); // 120㎡
request.setBusitype("电商信息流客源");
request.setUserId("FL-123456");
request.setOrgId(1);

// 根据部门规则设置分配参数
// 场景1：派到设计师
request.setDesignerId("FL-789012");

// 场景2：派到设计部门
// request.setDepartmentId(101);

// 场景3：派到设计分区
// request.setRegionId(100);

// 2. 调用接口
try {
    CustomerLeadResult result = customerLeadService.addCustomerLead(request);

    // 3. 处理返回结果
    System.out.println("ERP机会编码: " + result.getErpJhCode());
    System.out.println("装修单编码: " + result.getErpZxdCode());
    System.out.println("设计师编码: " + result.getErpDesignerCode());
    System.out.println("分配时间: " + result.getIssusTime());

} catch (FLException e) {
    System.err.println("错误码: " + e.getErrorCode());
    System.err.println("错误信息: " + e.getMessage());

    // 根据错误码进行相应处理
    handleError(e);
}
```

### HTTP 请求示例

```bash
curl -X POST "http://erp.example.com/addCustomerLead.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "leadCode=LEAD202603140001" \
  -d "adornCode=ADORN202603140001" \
  -d "name=张三" \
  -d "phone=13800138000" \
  -d "gender=男" \
  -d "village=方林世纪城" \
  -d "houseNumber=1-101" \
  -d "buildArea=120000" \
  -d "busitype=电商信息流客源" \
  -d "userId=FL-123456" \
  -d "orgId=1" \
  -d "designerId=FL-789012"
```

### Python 调用示例

```python
import requests

def add_customer_lead():
    url = "http://erp.example.com/addCustomerLead.do"

    # 构建请求参数
    params = {
        "leadCode": "LEAD202603140001",
        "adornCode": "ADORN202603140001",
        "name": "张三",
        "phone": "13800138000",
        "gender": "男",
        "village": "方林世纪城",
        "houseNumber": "1-101",
        "buildArea": 120000,
        "busitype": "电商信息流客源",
        "userId": "FL-123456",
        "orgId": 1,
        "designerId": "FL-789012"
    }

    try:
        # 发送请求
        response = requests.post(url, data=params)
        result = response.json()

        # 检查响应
        if result.get("errorCode") == 0:
            print("客户线索创建成功！")
            print(f"ERP机会编码: {result['data'].get('erpJhCode')}")
            print(f"装修单编码: {result['data'].get('erpZxdCode')}")
            print(f"设计师编码: {result['data'].get('erpDesignerCode')}")
        else:
            error_code = result.get("errorCode")
            error_msg = result.get("errorMsg")
            print(f"创建失败: [{error_code}] {error_msg}")

            # 根据错误码处理
            handle_error(error_code, error_msg)

    except Exception as e:
        print(f"请求异常: {str(e)}")

def handle_error(error_code, error_msg):
    """处理错误"""
    error_map = {
        400001: "客户名称不能为空",
        400002: "客户电话不能为空",
        190005: "创建人不存在",
        130061: "业务类型不存在",
        130018: "楼盘不存在",
        330081: "无设计师接单，请检查分配规则"
    }

    solution = error_map.get(error_code, "未知错误")
    print(f"解决方案: {solution}")

if __name__ == "__main__":
    add_customer_lead()
```

---

## 测试建议

### 单元测试场景

1. **参数验证测试**
   - 客户名称为空 → 预期：400001
   - 客户电话为空 → 预期：400002
   - 客户电话格式错误 → 预期：创建成功或后续报错

2. **业务数据测试**
   - userId不存在 → 预期：190005
   - busitype不存在 → 预期：130061
   - village不存在 → 预期：130018

3. **分配规则测试**
   - 未配置分配规则 → 预期：330081
   - 指定设计师不存在 → 预期：190005
   - 指定部门不存在 → 预期：310001

### 集成测试场景

1. **正常流程测试**
   - 完整参数 → 预期：成功创建并返回ERP编码

2. **边界条件测试**
   - 建筑面积为0
   - 建筑面积异常大
   - 楼盘名称包含特殊字符

3. **并发测试**
   - 同一手机号重复提交 → 预期：330071 撞尺

---

## 错误码完整速查表

### 按错误码排序

| 错误码 | 错误信息 | 分类 | 触发场景 | 优先级 |
|--------|---------|------|----------|--------|
| 400001 | 客户名称不能为空 | 参数验证 | name为空 | ⭐⭐⭐ |
| 400002 | 客户电话不能为空 | 参数验证 | phone为空 | ⭐⭐⭐ |
| 130018 | 楼盘不存在 | 基础数据 | village数据不存在 | ⭐⭐⭐ |
| 130061 | 业务类型不存在 | 基础数据 | busitype为空或不存在 | ⭐⭐⭐ |
| 130062 | 业务类型不匹配 | 基础数据 | 使用了来源类型 | ⭐⭐ |
| 190005 | 人员不存在 | 人员管理 | userId无效 | ⭐⭐⭐ |
| 310001 | 部门不存在 | 部门管理 | departmentId/regionId无效 | ⭐⭐⭐ |
| 330071 | 客户资源不存在/手机号重复 | 客户管理 | 资源对象为空或手机号撞尺 | ⭐⭐⭐ |
| 330074 | 客户资源不可操作 | 客户管理 | 资源状态为禁用或已转单 | ⭐⭐⭐ |
| 330075 | 客户机会不存在 | 客户管理 | 机会对象为空 | ⭐⭐⭐ |
| 330076 | 客户机会已存在 | 客户管理 | 重复分配机会 | ⭐⭐ |
| 330081 | 无设计师接单 | 客户管理 | 分配规则未配置或无匹配 | ⭐⭐⭐ |

---

## 相关文档

- [addCustomerChance 异常场景文档](./ADD_CUSTOMER_CHANCE_EXCEPTIONS.md)
- [客户管理模块文档](../src/com/fanglin/customer/CLAUDE.md)
- [客户资源分配规则说明](../src/com/fanglin/customer/service/impl/CustomerSourceServiceImpl.java)
- [FLException 异常处理规范](../src/com/fanglin/core/interceptor/FLException.java)

---

## 变更记录

### 2026-03-14
- 初始版本
- 完成 addCustomerLead 接口异常场景分析
- 统计 22 种异常场景（4种接口层 + 18种服务层）
- 创建完整异常表格
- 提供多语言调用示例
