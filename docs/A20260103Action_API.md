# A20260103Action 客户线索接入接口文档

> 最后更新：2026-04-20
>
> **控制器**: `com.fanglin.seiya.action.A20260103Action`
>
> **Service**: `com.fanglin.seiya.service.impl.A20260103ServiceImpl`
>
> **父包**: `@ParentPackage("base")`, `@Namespace("/")`
>
> **协议**: Struts2 + JSON, 所有接口 POST, Content-Type: `text/html`
>
> **通用响应格式**:
> ```json
> {
>   "errorCode": 0,
>   "errorMsg": null,
>   "data": { ... }
> }
> ```
> `errorCode=0` 表示成功, 非零为异常码。

---

## 目录

1. [addCustomerLead - 添加客户线索](#1-addcustomerlead---添加客户线索)
2. [updateCustomerLead - 更新客户线索](#2-updatecustomerlead---更新客户线索)
3. [queryCustomerLead - 查询客户线索](#3-querycustomerlead---查询客户线索)
4. [checkoverCustomerLead - 验证装修单是否存在](#4-checkovercustomerlead---验证装修单是否存在)
5. [updateDecorationForSF - SF更新装修单](#5-updatedecorationforsf---sf更新装修单)
6. [queryDepartmentByNameForSF - 查询部门列表](#6-querydepartmentbynameforsf---查询部门列表)
7. [queryUserByPinyinForSF - 根据拼音查询用户](#7-queryuserbypinyinforsf---根据拼音查询用户)
8. [queryCustomerDeptRuleByDbidForSF - 查询客户部门规则](#8-querycustomerdeptrulebydbidforsf---查询客户部门规则)
9. [queryCompanyForSF - 查询公司列表](#9-querycompanyforsf---查询公司列表)
10. [错误码速查表](#错误码速查表)

---

## 1. addCustomerLead - 添加客户线索

**路径**: `/addCustomerLead`
**方法位置**: `A20260103Action.java:340-486`

接收外部系统（如 Salesforce）传入的客户线索信息, 转换为 ERP 客户机会并创建, 支持客户线索的自动分配和设计师指派。

### 核心流程

```
参数必填验证 → 查询创建人 → 查询业务类型 → 构建客户资源对象
→ 设置设计师/部门/分区 → 调用 addCustomerChance → 返回 ERP 编码信息
```

### 请求参数

#### 基础参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|:----:|------|--------|
| `leadCode` | String | 否 | 线索编码（对应 customerChance.cno） | `"LEAD202603140001"` |
| `adornCode` | String | 否 | 尺源编码（对应 source.no） | `"ADORN202603140001"` |
| `name` | String | **是** | 客户名称 | `"张三"` |
| `phone` | String | **是** | 客户电话（11位） | `"13800138000"` |
| `gender` | String | 否 | 客户性别 | `"男"` / `"女"` |
| `village` | String | 否 | 楼盘名称 | `"方林世纪城"` |
| `houseNumber` | String | 否 | 楼号 | `"1-101"` |
| `buildArea` | Integer | 否 | 建筑面积（单位：千分之一平方米，即 分㎡, 传 120000 表示 120.000㎡） | `120000` |
| `busitype` | String | 否 | 业务类型名称（默认：`"电商信息流客源"`） | `"电商信息流客源"` |
| `userId` | String | **是** | 创建人工号 | `"FL-123456"` |
| `orgId` | Integer | **是** | 公司标识（AES加密后的公司ID） | `1` |
| `cpid` | Integer | 否 | 客户电话ID | `1001` |
| `referOrderId` | String | 否 | 转介绍订单ID | `"FL2603140001"` |
| `sourceInfo` | String | 否 | 来源（三方信息） | `"抖音推广"` |
| `contactInfo` | String | 否 | 联系方式（三方信息） | `"微信:zhangsan"` |

#### 分配参数（根据部门规则传参）

| 参数名 | 类型 | 必填 | 适用场景 | 说明 | 示例值 |
|--------|------|:----:|:---------|------|--------|
| `designerId` | String | 条件必填 | 规则3：派到设计师 | 设计师工号 | `"FL-789012"` |
| `departmentId` | Integer | 条件必填 | 规则2：派到设计部门 | 部门ID | `101` |
| `regionId` | Integer | 条件必填 | 规则1：派到设计分区 | 分区ID | `100` |

> **注意**: 三个分配参数根据部门规则选择传递, 优先级从高到低: designerId > departmentId > regionId

### 响应参数

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
    "gender": "男",
    "village": "方林世纪城",
    "houseNumber": "1-101",
    "buildArea": 120.0,
    "busitype": "电商信息流客源",
    "userId": "FL-123456",
    "orgId": 1,
    "designerId": "FL-789012",
    "departmentId": null,
    "regionId": null,
    "erpJhCode": "12345",
    "erpAssignerCode": "FL-123456",
    "erpDesignerCode": "FL-789012",
    "issusTime": "2026-03-14 10:30:00",
    "erpZxdCode": "FL2603140001",
    "isIssue": 1
  }
}
```

#### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `erpJhCode` | String | ERP系统机会编码（对应 ccid） |
| `erpAssignerCode` | String | ERP设计师分派人编码（对应 issuer.userId, 工号如 FL-xxx） |
| `erpDesignerCode` | String | ERP设计师编码（对应 belonger.userId, 工号如 FL-xxx） |
| `issusTime` | String | 派尺时间（对应 issueTime, 格式 yyyy-MM-dd HH:mm:ss） |
| `erpZxdCode` | String | 装修单编码（对应 orderId） |
| `isIssue` | Integer | 是否已分配（0: 未分配, 1: 已分配） |
| `buildArea` | Double | 回显的建筑面积（已除以1000, 单位㎡） |

### 异常场景

#### 接口层异常（Action, 4种）

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400001 | 客户名称不能为空 | `name == null \|\| name.trim().isEmpty()` | A20260103Action:347-349 |
| 2 | 400002 | 客户电话不能为空 | `phone == null \|\| phone.trim().isEmpty()` | A20260103Action:350-352 |
| 3 | 400004 | 公司标识不能为空 | `orgId == null` | A20260103Action:353-355 |
| 4 | 190005 | 人员不存在 | `userService.queryUserByUserId() == null` | A20260103Action:369-371 |
| 5 | 130061 | 业务类型不存在 | `decorationBusitypeService.queryByName() == null` | A20260103Action:377-379 |

#### 服务层异常（addCustomerChance 调用, 约18种）

详见 [ADD_CUSTOMER_CHANCE_EXCEPTIONS.md](./ADD_CUSTOMER_CHANCE_EXCEPTIONS.md), 包含客户机会创建、客户资源创建、客户资源分配等全部异常链路。

### 调用示例

```bash
curl -X POST "http://erp.example.com/addCustomerLead.do" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "leadCode=LEAD202603140001" \
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

---

## 2. updateCustomerLead - 更新客户线索

**路径**: `/updateCustomerLead`
**方法位置**: `A20260103Action.java:238-253`

通过线索编号更新现有客户线索信息。

### 更新规则

1. 楼盘 + 楼号必须一起更新, 缺一不可
2. house 存在则关联, 不存在则创建
3. customer 存在则关联, 不存在则创建
4. referOrderId / sourceInfo / contactInfo 独立更新, 互不影响

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `leadCode` | String | **是** | 线索编号（对应 customerChance.cno） |
| `phone` | String | 否 | 客户电话（传则更新客户关联） |
| `name` | String | 否 | 客户名称（新建客户时使用） |
| `village` | String | 条件必填 | 楼盘名称（需与 houseNumber 一同传入） |
| `houseNumber` | String | 条件必填 | 楼号（需与 village 一同传入） |
| `buildArea` | Integer | 否 | 建筑面积（千分之一㎡） |
| `referOrderId` | String | 否 | 转介绍订单ID |
| `sourceInfo` | String | 否 | 来源（三方信息） |
| `contactInfo` | String | 否 | 联系方式（三方信息） |
| `userId` | String | **是** | 操作人工号 |
| `orgId` | Integer | **是** | 公司标识 |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "leadCode": "LEAD202603140001",
    "updateTime": "2026-04-20 14:30:00",
    "message": "更新成功"
  }
}
```

### 异常场景

#### Service 层异常（A20260103ServiceImpl, 4种）

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400001 | 线索编号不能为空 | `leadCode == null \|\| leadCode.trim().isEmpty()` | ServiceImpl:113-115 |
| 2 | 400002 | 楼盘和楼号必须同时提供 | village 和 houseNumber 只传了一个 | ServiceImpl:118-122 |
| 3 | 330075 | 客户线索不存在 | `customerChanceDao.queryCustomerChanceByCno() == null` | ServiceImpl:93-95 |
| 4 | 190005 | 人员不存在 | `userService.queryUserByUserId() == null` | ServiceImpl:129-131 |

> **注意**: 还会间接触发 `houseService.existHouse`、`customerService.existCustomer`、`customerSourceService.updateCustomerSourceForHouse`、`customerSourceService.updateCustomerSourceForCustomer` 等方法的异常。

---

## 3. queryCustomerLead - 查询客户线索

**路径**: `/queryCustomerLead`
**方法位置**: `A20260103Action.java:266-300`

查询装修单信息, 支持三种查询方式。

### 查询方式（优先级从高到低）

1. **orderId** - 单独查询
2. **village + houseNumber** - 楼盘 + 楼号一同查询
3. **phone** - 单独查询

> 三种方式互斥, 按优先级取第一个有效条件

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `orderId` | String | 三选一 | 装修单编号 |
| `village` | String | 三选一 | 楼盘名称（需与 houseNumber 一同传入） |
| `houseNumber` | String | 三选一 | 楼号（需与 village 一同传入） |
| `phone` | String | 三选一 | 客户电话 |
| `orgId` | Integer | **是** | 公司标识 |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "orderId": "FL2603140001",
    "contractTime": "2026-03-14",
    "house": {
      "houseNumber": "1-101",
      "village": {
        "no": "V001",
        "name": "方林世纪城"
      }
    },
    "customer": {
      "phone": "138****8000"
    }
  }
}
```

> **注意**: `customer.phone` 返回脱敏后的电话（中间4位用 `****` 替代）

### 异常场景

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400003 | 请提供查询条件：orderId 或 楼盘+楼号 或 电话 | 三种查询条件都未提供 | ServiceImpl:249 |
| 2 | 140013 | 订单不存在 | 根据查询条件未找到装修单 | ServiceImpl:253 |

---

## 4. checkoverCustomerLead - 验证装修单是否存在

**路径**: `/checkoverCustomerLead`
**方法位置**: `A20260103Action.java:317-330`

通过客户电话和楼盘 + 楼号查询是否存在有效装修单。参考 `DecorationService.checkOverDecoration` 逻辑。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `phone` | String | **是** | 客户电话 |
| `village` | String | **是** | 楼盘名称 |
| `houseNumber` | String | **是** | 楼号 |
| `orgId` | Integer | **是** | 公司标识 |

### 响应参数

**成功**（无装修单存在）:

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "message": "验证通过，无装修单存在"
  }
}
```

**失败**（存在装修单）: 会抛出 FLException（由 `decorationService.checkOverDecoration` 抛出, 错误码 140063）。

### 异常场景

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400002 | 客户电话不能为空 | `phone` 为空 | ServiceImpl:297 |
| 2 | 400003 | 楼盘和楼号不能为空 | `village` 或 `houseNumber` 为空 | ServiceImpl:300 |
| 3 | 400004 | 公司标识不能为空 | `orgId` 为空 | ServiceImpl:304 |
| 4 | 140063 | 装修单已存在 | 同客户+同房屋存在有效装修单 | DecorationService（间接） |

### 核心流程

```
参数验证 → 通过电话查询客户cid → 通过楼盘+楼号查询房屋hid
→ 调用 decorationService.checkOverDecoration(cid, hid, orgId)
```

---

## 5. updateDecorationForSF - SF更新装修单

**路径**: `/updateDecorationForSF`
**方法位置**: `A20260103Action.java:765-780`

通过装修单号(orderId)修改装修单的客户电话和楼盘楼号。客户不存在则创建, 存在则更新; 房屋不存在则创建, 存在则更新。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `orderId` | String | **是** | 装修单号 |
| `phone` | String | 否 | 客户电话（传则更新） |
| `village` | String | 条件必填 | 楼盘名称（需与 houseNumber 一同传入） |
| `houseNumber` | String | 条件必填 | 楼号（需与 village 一同传入） |
| `orgId` | Integer | **是** | 公司标识 |
| `userId` | String | 否 | 操作人userId |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "orderId": "FL2603140001",
    "updateTime": "2026-04-20 14:30:00",
    "message": "更新成功"
  }
}
```

### 异常场景

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400001 | 装修单号不能为空 | `orderId` 为空 | ServiceImpl:341 |
| 2 | 400004 | 公司标识不能为空 | `orgId` 为空 | ServiceImpl:345 |
| 3 | 140013 | 订单不存在 | `decorationDao.queryDecorationByOrderId() == null` | ServiceImpl:353 |

---

## 6. queryDepartmentByNameForSF - 查询部门列表

**路径**: `/queryDepartmentByNameForSF`
**方法位置**: `A20260103Action.java:501-542`

查询部门列表, 返回简化格式（id + name）。SF（Salesforce）专用。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `orgId` | Integer | **是** | 公司标识 |
| `deptType` | String | 否 | 部门类型（1: 设计分区, 2: 设计部门） |
| `deptName` | String | 否 | 部门名称（支持模糊匹配。为空时按类型查询全部） |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "simpleDeptList": [
      { "id": "101", "name": "设计一部" },
      { "id": "102", "name": "设计二部" }
    ]
  }
}
```

#### simpleDeptList 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 部门ID（department.did 转字符串） |
| `name` | String | 部门名称 |

---

## 7. queryUserByPinyinForSF - 根据拼音查询用户

**路径**: `/queryUserByPinyinForSF`
**方法位置**: `A20260103Action.java:555-599`

根据拼音查询用户列表, 返回简化格式。SF（Salesforce）专用。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `pinyinName` | String | 否 | 设计师名称（支持拼音模糊匹配） |
| `userStatus` | String | 否 | 人员状态（0: 在职, 1: 离职） |
| `orgId` | Integer | 否 | 公司标识 |

> 当 `departmentType` 未传时, 默认使用 `"设计部"` 作为部门类型过滤条件。

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "simpleUserList": [
      {
        "id": "1001",
        "code": "FL-123456",
        "name": "张三",
        "dept": "设计一部",
        "region": "沈阳分区",
        "company": "方林装饰"
      }
    ]
  }
}
```

#### simpleUserList 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 用户UID（转字符串） |
| `code` | String | 用户工号（userId） |
| `name` | String | 用户姓名（currentName） |
| `dept` | String | 所属部门名称 |
| `region` | String | 所属分区名称（上级部门） |
| `company` | String | 所属公司名称 |

---

## 8. queryCustomerDeptRuleByDbidForSF - 查询客户部门规则

**路径**: `/queryCustomerDeptRuleByDbidForSF`
**方法位置**: `A20260103Action.java:612-674`

根据用户工号查询该用户所属部门的客户分配规则类型。SF（Salesforce）专用。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `orgId` | Integer | **是** | 公司标识 |
| `userId` | String | **是** | 约访专员工号（如 FL-123456） |
| `busitype` | String | 否 | 业务类型名称（默认：`"电商信息流客源"`） |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "ruleId": 3
  }
}
```

#### ruleId 含义

| ruleId | 说明 | 后续操作 |
|:------:|------|---------|
| 0 | 派到公司 | 无需传分配参数 |
| 1 | 派到设计分区 | 调用 addCustomerLead 时传 `regionId` |
| 2 | 派到设计部门 | 调用 addCustomerLead 时传 `departmentId` |
| 3 | 派到设计师 | 调用 addCustomerLead 时传 `designerId` |

### 异常场景

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400004 | 公司标识不能为空 | `orgId` 为空 | Action:620 |
| 2 | 190005 | 用户工号不能为空 | `userId` 为空 | Action:622 |
| 3 | 130061 | 业务类型不存在 | busitype 名称查不到 | Action:638 |
| 4 | 190005 | 人员不存在 | `userService.queryUserByUserId() == null` | Action:645 |
| 5 | 190005 | 用户未关联部门 | `creater.getDept() == null` | Action:654 |
| 6 | 130062 | 部门规则不存在 | `customerDeptRuleVO == null` | Action:665 |

---

## 9. queryCompanyForSF - 查询公司列表

**路径**: `/queryCompanyForSF`
**方法位置**: `A20260103Action.java:687-747`

根据用户工号和业务类型查询客户公司规则列表, 返回可分配的公司信息。SF（Salesforce）专用。

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `orgId` | Integer | **是** | 公司标识 |
| `userId` | String | **是** | 用户工号 |
| `busitype` | String | 否 | 业务类型名称 |
| `buildArea` | Integer | 否 | 建筑面积（用于面积段规则匹配） |
| `cpid` | Integer | 否 | 客户电话ID |

### 响应参数

```json
{
  "errorCode": 0,
  "errorMsg": null,
  "data": {
    "simpleCompanyList": [
      { "id": 1, "name": "方林装饰" },
      { "id": 2, "name": "1918装饰" }
    ]
  }
}
```

#### simpleCompanyList 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | int | 公司ID（经 CompanyServiceImpl.decode 解密后的原始ID） |
| `name` | String | 公司名称 |

### 异常场景

| 序号 | 错误码 | 错误信息 | 触发条件 | 代码位置 |
|:---:|:------:|:---------|:---------|:---------|
| 1 | 400004 | 公司标识不能为空 | `orgId` 为空 | Action:694 |
| 2 | 190005 | 用户工号不能为空 | `userId` 为空 | Action:697 |
| 3 | 190005 | 人员不存在 | `userService.queryUserByUserId() == null` | Action:704 |
| 4 | 190005 | 用户未关联部门 | `creater.getDept() == null` | Action:719 |

---

## 错误码速查表

### 按错误码排序

| 错误码 | 错误信息 | 分类 | 涉及接口 | 触发场景 |
|--------|---------|------|----------|----------|
| 400001 | 客户名称不能为空 | 参数验证 | addCustomerLead | name为空 |
| 400001 | 线索编号不能为空 | 参数验证 | updateCustomerLead | leadCode为空 |
| 400001 | 装修单号不能为空 | 参数验证 | updateDecorationForSF | orderId为空 |
| 400002 | 客户电话不能为空 | 参数验证 | addCustomerLead, checkoverCustomerLead | phone为空 |
| 400002 | 楼盘和楼号必须同时提供 | 参数验证 | updateCustomerLead | village和houseNumber只传了一个 |
| 400003 | 请提供查询条件 | 参数验证 | queryCustomerLead | 无查询条件 |
| 400003 | 楼盘和楼号不能为空 | 参数验证 | checkoverCustomerLead | village或houseNumber为空 |
| 400004 | 公司标识不能为空 | 参数验证 | 多个接口 | orgId为空 |
| 130018 | 楼盘不存在 | 基础数据 | addCustomerLead(间接) | village数据不存在 |
| 130061 | 业务类型不存在 | 基础数据 | addCustomerLead, queryCustomerDeptRuleByDbidForSF | busitype查不到 |
| 130062 | 业务类型不匹配 | 基础数据 | addCustomerLead(间接) | 使用了来源类型 |
| 130062 | 部门规则不存在 | 基础数据 | queryCustomerDeptRuleByDbidForSF | 部门规则查不到 |
| 140013 | 订单不存在 | 装修单 | queryCustomerLead, updateDecorationForSF | 装修单查不到 |
| 140063 | 装修单已存在 | 装修单 | checkoverCustomerLead(间接) | 同客户+同房屋已有装修单 |
| 190005 | 人员不存在 | 人员管理 | 多个接口 | userId无效或用户未关联部门 |
| 310001 | 部门不存在 | 部门管理 | addCustomerLead(间接) | departmentId/regionId无效 |
| 330071 | 客户资源不存在/手机号重复 | 客户管理 | addCustomerLead(间接) | 资源为空或撞尺 |
| 330074 | 客户资源不可操作 | 客户管理 | addCustomerLead(间接) | 资源已禁用或已转单 |
| 330075 | 客户机会不存在 | 客户管理 | updateCustomerLead | leadCode查不到机会 |
| 330076 | 客户机会已存在 | 客户管理 | addCustomerLead(间接) | 重复分配 |
| 330081 | 无设计师接单 | 客户管理 | addCustomerLead(间接) | 分配规则未配置 |

---

## SF 接口调用流程

Salesforce 端调用 ERP 接口的典型流程：

```
1. queryCustomerDeptRuleByDbidForSF
   传入 userId + orgId → 获取 ruleId（分配规则类型）

2. 根据 ruleId 查询分配目标:
   ruleId=1 → queryDepartmentByNameForSF (查分区)
   ruleId=2 → queryDepartmentByNameForSF (查部门)
   ruleId=3 → queryUserByPinyinForSF (查设计师)

3. queryCompanyForSF
   查询可分配的公司列表

4. checkoverCustomerLead
   验证是否已有装修单（防重复）

5. addCustomerLead
   创建客户线索（传入完整的客户信息 + 分配参数）

6. updateCustomerLead
   如需修改线索信息（如更新楼盘、电话等）

7. queryCustomerLead
   查询已创建的线索状态

8. updateDecorationForSF
   SF端更新装修单的客户电话和楼盘楼号
```

---

## 相关文档

- [addCustomerChance 异常场景文档](./ADD_CUSTOMER_CHANCE_EXCEPTIONS.md)
- [addCustomerLead 异常场景文档](./ADD_CUSTOMER_LEAD_EXCEPTIONS.md)

---

## 变更记录

### 2026-04-20
- 重新输出完整接口文档（覆盖所有9个接口方法）
- 更新 addCustomerLead 代码行号（L340-486）
- 新增 updateCustomerLead、queryCustomerLead、checkoverCustomerLead 接口文档
- 新增 updateDecorationForSF、queryDepartmentByNameForSF、queryUserByPinyinForSF 接口文档
- 新增 queryCustomerDeptRuleByDbidForSF、queryCompanyForSF 接口文档
- 新增 SF 接口调用流程说明
- 新增全部错误码速查表
