# addCustomerChance 异常场景汇总文档

> 最后更新：2026-04-20
>
> **文档说明**：本文档详细说明了 `addCustomerChance` 方法执行过程中所有抛出 `FLException` 的场景，包括异常码、异常信息和触发条件。
>
> **完整接口文档**：详见 [A20260103Action_API.md](./A20260103Action_API.md)

---

## 📋 目录

1. [方法概述](#方法概述)
2. [异常分类总览](#异常分类总览)
3. [直接异常场景](#直接异常场景)
4. [间接异常场景（子方法调用）](#间接异常场景子方法调用)
5. [错误码速查表](#错误码速查表)
6. [调用链路图](#调用链路图)

---

## 方法概述

### 方法签名
```java
@Transactional(rollbackFor = Exception.class)
public CustomerChanceVO addCustomerChance(CustomerChanceVO customerChanceVO, String userId, int company) throws FLException
```

### 方法位置
- **文件**: `src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java`
- **行号**: 229-313

### 方法功能
添加客户机会，自动处理客户和房产信息，创建客户资源并分配给设计师。

### 核心流程
```
1. 参数校验
2. 处理客户信息 (existCustomer)
3. 处理房产信息 (existHouse)
4. 创建客户资源 (addCustomerSource)
5. 分配客户资源 (issueCustomerSource)
```

---

## 异常分类总览

### 异常统计
- **直接异常**: 4 种场景
- **间接异常**: 14 种场景
- **总计**: 18 种异常场景

### 错误码分类
| 错误码前缀 | 分类 | 数量 |
|-----------|------|------|
| 13xxxx | 基础数据异常 | 5 种 |
| 19xxxx | 人员管理异常 | 1 种 |
| 31xxxx | 部门管理异常 | 2 种 |
| 33xxxx | 客户管理异常 | 9 种 |
| 33**** | 客户资源异常 | 6 种 |
| 33**** | 客户机会异常 | 3 种 |

---

## 直接异常场景

### 1. 客户机会对象为空
**位置**: `CustomerChanceServiceImpl.java:231-233`

```java
if (customerChanceVO == null) {
    throw new FLException(330075, "客户机会不存在");
}
```

**触发条件**:
- 传入的 `customerChanceVO` 参数为 `null`

**处理建议**:
- 检查调用方是否正确构造了对象
- 确保前端传递了完整的客户机会数据

---

### 2. 客户资源对象为空
**位置**: `CustomerChanceServiceImpl.java:235-237`

```java
if (customerChanceVO.getSource() == null) {
    throw new FLException(330071, "客户资源不存在");
}
```

**触发条件**:
- `customerChanceVO.getSource()` 为 `null`
- 客户资源（source）对象未正确设置

**处理建议**:
- 确保客户机会对象包含完整的 source 信息
- 检查前端数据绑定是否正确

---

### 3. 楼盘信息为空（对象级别）
**位置**: `CustomerChanceServiceImpl.java:276-278`

```java
if (customerChanceVO.getSource().getVillage() == null ||
    customerChanceVO.getSource().getVillage().getNo() == null) {
    throw new FLException(130018, "楼盘不存在");
}
```

**触发条件**:
- 客户资源中的楼盘对象（village）为 `null`
- 楼盘编号（village.no）为 `null`

**处理建议**:
- 确保选择了有效的楼盘
- 检查楼盘选择器功能是否正常

---

### 4. 楼盘不存在（数据库级别）
**位置**: `CustomerChanceServiceImpl.java:280-283`

```java
VillagePO villagePO = villageDao.get(customerChanceVO.getSource().getVillage().getNo());
if (villagePO == null) {
    throw new FLException(130018, "楼盘不存在");
}
```

**触发条件**:
- 根据楼盘编号在数据库中未找到对应的楼盘记录

**处理建议**:
- 检查楼盘数据是否存在
- 确认楼盘编号是否正确
- 可能需要重新同步楼盘数据

---

## 间接异常场景（子方法调用）

### 一、客户资源创建异常 (addCustomerSource)

#### 5. 客户手机号重复（撞尺）
**位置**: `CustomerSourceServiceImpl.java:186-188`

```java
if (customerSourceDao.queryCustomerSource(creater.getUid(), phone, company) != null) {
    throw new FLException(330071, "客户手机号存在,发生撞尺");
}
```

**触发条件**:
- 同一创建人已存在相同手机号的客户资源

**处理建议**:
- 检查是否已存在该客户的资源
- 可以复用已有客户资源
- 或使用不同的手机号

---

#### 6. 业务类型为空
**位置**: `CustomerSourceServiceImpl.java:190-192`

```java
if (customerSourceVO.getBusitype() == null ||
    customerSourceVO.getBusitype().getDbid() == null) {
    throw new FLException(130061, "业务类型不存在");
}
```

**触发条件**:
- 客户资源中未设置业务类型
- 业务类型的 ID 为空

**处理建议**:
- 确保选择了业务类型（整装/定制等）
- 检查业务类型数据绑定

---

#### 7. 业务类型不存在
**位置**: `CustomerSourceServiceImpl.java:194-198`

```java
DecorationBusitypePO busitype = decorationBusitypeDao.get(customerSourceVO.getBusitype().getDbid());
if (busitype == null) {
    throw new FLException(130061, "业务类型不存在");
}
```

**触发条件**:
- 根据业务类型 ID 在数据库中未找到记录

**处理建议**:
- 检查业务类型配置表
- 确认业务类型 ID 是否有效

---

#### 8. 业务类型不匹配
**位置**: `CustomerSourceServiceImpl.java:200-202`

```java
if (busitype.getType() == DecorationBusitypePO.TYPE_ORIGIN_INT) {
    throw new FLException(130062, "业务类型不匹配");
}
```

**触发条件**:
- 使用的业务类型是来源类型（TYPE_ORIGIN），不是客户资源类型

**处理建议**:
- 使用正确的业务类型
- 区分来源类型和客户资源类型

---

### 二、客户资源分配异常 (issueCustomerSource)

#### 9. 客户资源不存在（分配时）
**位置**: `CustomerSourceServiceImpl.java:457-461`

```java
CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());
if (customerSourcePO == null) {
    throw new FLException(330071, "客户资源不存在");
}
```

**触发条件**:
- 根据 csid 未找到客户资源记录

**处理建议**:
- 确认客户资源是否已成功创建
- 检查 csid 是否正确

---

#### 10. 客户资源不可操作（状态错误）
**位置**: `CustomerSourceServiceImpl.java:463-465`

```java
if (Arrays.asList(CustomerSourcePO.STATUS_DISABLE_INT,
                  CustomerSourcePO.STATUS_TRAN_INT)
                  .contains(customerSourcePO.getStatus())) {
    throw new FLException(330074, "客户资源不可操作");
}
```

**触发条件**:
- 客户资源状态为 `STATUS_DISABLE_INT`（已禁用）
- 客户资源状态为 `STATUS_TRAN_INT`（已转装修单）

**处理建议**:
- 检查客户资源状态
- 只能分配初始状态的客户资源

---

#### 11. 客户机会已存在（自动分配）
**位置**: `CustomerSourceServiceImpl.java:515-517`

```java
if (customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), company) != null) {
    throw new FLException(330076, "客户机会已存在");
}
```

**触发条件**:
- 该客户资源已存在客户机会
- 自动分配时发现重复

**处理建议**:
- 检查是否已分配过
- 避免重复分配

---

#### 12. 设计公司无设计师接单
**位置**: `CustomerSourceServiceImpl.java:519-521`

```java
if (customerUserRuleDao.existCustomerUserRule(company, area) == 0) {
    throw new FLException(330081, "设计公司无设计师接单");
}
```

**触发条件**:
- 该公司该面积段没有配置设计师分配规则

**处理建议**:
- 配置客户分配规则（CustomerUserRule）
- 为面积段指定接单设计师

---

#### 13-17. 各种聚焦模式无设计师接单
**位置**: `CustomerSourceServiceImpl.java:544-563`

**13. 无设计师接单（公司聚焦）**
```java
if (customerUserRuleItemPO == null &&
    customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_COM_INT) {
    throw new FLException(330081, "无设计师接单");
}
```

**14. 面积段无设计师接单**
```java
if (customerUserRuleItemPO == null &&
    customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_AREA_INT) {
    throw new FLException(330081, "面积段无设计师接单");
}
```

**15. 部门类型无设计师接单**
```java
if (customerUserRuleItemPO == null &&
    customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_TYPE_INT) {
    throw new FLException(330081, "部门类型无设计师接单");
}
```

**16. 部门无设计师接单**
```java
if (customerUserRuleItemPO == null &&
    customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_INT) {
    throw new FLException(330081, "部门无设计师接单");
}
```

**17. 城区无设计师接单**
```java
if (customerUserRuleItemPO == null &&
    customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_CITY_INT) {
    throw new FLException(330081, "城区无设计师接单");
}
```

**触发条件**:
- 在各种聚焦模式下，没有找到匹配的设计师分配规则项

**处理建议**:
- 检查部门规则配置（CustomerDeptRule）
- 确保每个聚焦模式都有对应的规则项
- 配置设计师分配规则项（CustomerUserRuleItem）

---

#### 18. 设计师匹配规则不存在
**位置**: `CustomerSourceServiceImpl.java:567-569`

```java
customerUserRulePO = customerUserRuleDao.get(customerUserRuleItemPO.getCurid());
if (customerUserRulePO == null) {
    throw new FLException(330081, "设计师匹配规则不存在");
}
```

**触发条件**:
- 根据规则项的 curid 未找到对应的分配规则

**处理建议**:
- 检查规则数据完整性
- 确保规则项和规则的关联关系正确

---

#### 19. 无匹配规则（循环超限）
**位置**: `CustomerSourceServiceImpl.java:571-572`

```java
if (customerSourceDao.countCustomerSource(customerUserRulePO.getUser().getUid(),
                                          customerSourcePO.getPhone(), company) == 0) break;
if (exporters.size() >= 100) throw new FLException(330081, "无匹配规则");
```

**触发条件**:
- 循环尝试分配 100 次后仍未找到合适的设计师
- 所有候选设计师都与该客户手机号有冲突

**处理建议**:
- 检查客户手机号是否被过多设计师占用
- 调整分配规则避免冲突
- 扩大设计师池

---

#### 20. 客户机会已存在（再次检查）
**位置**: `CustomerSourceServiceImpl.java:593-595`

```java
if (customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(),
                                          belonger.getCompany()) != null) {
    throw new FLException(330076, "客户机会已存在");
}
```

**触发条件**:
- 分配前再次检查，发现客户机会已存在

**处理建议**:
- 这是重复检查，确保数据一致性
- 如果触发，说明有并发问题

---

#### 21. 部门不存在（区域分配）
**位置**: `CustomerSourceServiceImpl.java:638-642`

```java
DepartmentPO region = departmentDao.get(customerChanceVO.getRegion().getDid());
if (region == null) {
    throw new FLException(310001, "部门不存在");
}
```

**触发条件**:
- 按 region 分配时，部门不存在

**处理建议**:
- 检查部门配置
- 确保 department 表数据完整

---

#### 22. 部门不存在（部门分配）
**位置**: `CustomerSourceServiceImpl.java:678-682`

```java
DepartmentPO dept = departmentDao.get(customerChanceVO.getDepartment().getDid());
if (dept == null) {
    throw new FLException(310001, "部门不存在");
}
```

**触发条件**:
- 按 department 分配时，部门不存在

**处理建议**:
- 检查部门配置
- 确保部门 ID 正确

---

#### 23. 人员不存在
**位置**: `CustomerSourceServiceImpl.java:726-730`

```java
UserPO belonger = userDao.queryUserByUserId(customerChanceVO.getBelonger().getUserId());
if (belonger == null) {
    throw new FLException(190005, "人员不存在");
}
```

**触发条件**:
- 按人员分配时，用户不存在

**处理建议**:
- 检查用户是否在职
- 确认 user_id 是否正确

---

#### 24. 客户机会已存在（人员分配）
**位置**: `CustomerSourceServiceImpl.java:732-734`

```java
if (customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(),
                                          belonger.getCompany()) != null) {
    throw new FLException(330076, "客户机会已存在");
}
```

**触发条件**:
- 人员分配前检查，发现客户机会已存在

**处理建议**:
- 同场景20，确保数据一致性

---

## 错误码速查表

### 客户管理相关 (33xxxx)

| 错误码 | 异常信息 | 触发场景 | 优先级 |
|--------|---------|---------|--------|
| 330071 | 客户资源不存在 | source为空、资源ID无效、手机号重复 | ⭐⭐⭐ |
| 330074 | 客户资源不可操作 | 资源状态为禁用或已转单 | ⭐⭐⭐ |
| 330075 | 客户机会不存在 | chance对象为空 | ⭐⭐⭐ |
| 330076 | 客户机会已存在 | 重复分配机会 | ⭐⭐ |
| 330081 | 无设计师接单 | 分配规则未配置或无匹配规则 | ⭐⭐⭐ |

### 基础数据相关 (13xxxx)

| 错误码 | 异常信息 | 触发场景 | 优先级 |
|--------|---------|---------|--------|
| 130018 | 楼盘不存在 | 楼盘对象为空或ID无效 | ⭐⭐⭐ |
| 130061 | 业务类型不存在 | 业务类型为空或ID无效 | ⭐⭐⭐ |
| 130062 | 业务类型不匹配 | 使用了来源类型的业务类型 | ⭐⭐ |

### 人员部门相关 (19xxxx/31xxxx)

| 错误码 | 异常信息 | 触发场景 | 优先级 |
|--------|---------|---------|--------|
| 190005 | 人员不存在 | 分配的用户不存在 | ⭐⭐⭐ |
| 310001 | 部门不存在 | 分配的部门不存在 | ⭐⭐⭐ |

---

## 调用链路图

### addCustomerChance 调用链

```
addCustomerChance (CustomerChanceServiceImpl:223)
│
├─ 【参数校验】
│  ├─ 330075: customerChanceVO == null
│  ├─ 330071: source == null
│  ├─ 130018: village == null
│  └─ 130018: villagePO == null
│
├─ existCustomer (CustomerServiceImpl:240)
│  └─ 不抛出 FLException
│
├─ existHouse (HouseServiceImpl:101)
│  └─ 不抛出 FLException
│
├─ addCustomerSource (CustomerSourceServiceImpl:176)
│  ├─ 330071: 客户手机号重复
│  ├─ 130061: 业务类型为空
│  ├─ 130061: 业务类型不存在
│  └─ 130062: 业务类型不匹配
│
└─ issueCustomerSource (CustomerSourceServiceImpl:455)
   ├─ 330071: 客户资源不存在
   ├─ 330074: 客户资源不可操作
   ├─ 330076: 客户机会已存在（多处）
   ├─ 330081: 无设计师接单（6种场景）
   ├─ 310001: 部门不存在（2处）
   └─ 190005: 人员不存在
```

---

## 异常处理建议

### 开发者建议

1. **参数校验**
   - 在调用 addCustomerChance 前，完成基本参数校验
   - 确保 source、village、busitype 等必填字段不为空

2. **业务配置检查**
   - 确保已配置客户分配规则（CustomerUserRule）
   - 确保已配置部门规则（CustomerDeptRule）
   - 确保设计师在职且有接单权限

3. **数据一致性**
   - 检查楼盘数据是否存在
   - 检查业务类型配置是否正确
   - 检查部门和用户数据完整性

4. **异常处理**
   ```java
   try {
       CustomerChanceVO result = customerChanceService.addCustomerChance(
           customerChanceVO, userId, company
       );
   } catch (FLException e) {
       if (e.getErrorCode() == 330071) {
           // 客户资源不存在 - 提示用户完善信息
       } else if (e.getErrorCode() == 330081) {
           // 无设计师接单 - 提示管理员配置规则
       } else if (e.getErrorCode() == 130018) {
           // 楼盘不存在 - 提示用户选择有效楼盘
       }
       // ... 其他错误码处理
   }
   ```

### 测试建议

1. **单元测试覆盖**
   - 测试所有必填字段为空的场景
   - 测试数据不存在的场景
   - 测试重复数据的场景
   - 测试业务规则不配置的场景

2. **集成测试场景**
   - 正常流程测试
   - 楼盘不存在测试
   - 手机号重复测试
   - 业务类型不匹配测试
   - 分配规则未配置测试

3. **异常恢复测试**
   - 补全缺失数据后重试
   - 配置规则后重试
   - 使用不同数据重试

---

## 相关文档

- [A20260103Action 完整接口文档](./A20260103Action_API.md)
- [addCustomerLead 异常场景文档](./ADD_CUSTOMER_LEAD_EXCEPTIONS.md)
- [客户管理模块文档](../src/com/fanglin/customer/CLAUDE.md)
- [客户资源分配规则说明](../src/com/fanglin/customer/service/impl/CustomerSourceServiceImpl.java)
- [FLException 异常处理规范](../src/com/fanglin/core/interceptor/FLException.java)

---

## 变更记录

### 2026-04-20
- 更新方法行号 L223-307 → L229-313
- 更新异常行号（+6偏移）
- 新增完整接口文档交叉引用

### 2026-03-14
- 初始版本
- 完成 addCustomerChance 异常场景分析
- 统计 18 种异常场景
- 绘制调用链路图
