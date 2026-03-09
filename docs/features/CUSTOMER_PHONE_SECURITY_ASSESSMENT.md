# 🔒 Customer模块Phone字段安全风险评估报告

> **评估范围** - customer模块中source/chance相关的phone字段暴露风险
> **评估日期** - 2025-12-14

---

## 📊 风险等级概览

| 风险等级 | 评分 | 说明 |
|---------|------|------|
| **🔴 高风险** | 8.5/10 | 存在多个phone字段暴露点，缺乏权限控制 |
| **🟡 中风险** | - | 需要关注的部分 |
| **🟢 低风险** | - | 相对安全的部分 |

---

## 🚨 发现的主要安全问题

### 1. **前端页面phone字段明文显示**

#### ❌ 问题位置
- **文件**: `WebContent/js/customer/customerSource.js:557-565`
- **代码**:
```javascript
// 第557行：客户电话明文显示
{
    field: "phone",
    name: "客户电话",
    prop: "phone",
    clazz: "grey",
    show: function(v) {
        return (customerSource.depage == "user"); // 用户页面显示完整手机号
    }
}
```

#### 🔒 风险分析
- **问题**: 在用户页面(depage == "user")显示完整手机号
- **影响**: 业务员可以看到客户的完整手机号
- **风险等级**: 🔴 **高风险**

### 2. **推荐客户phone字段部分脱敏**

#### ✅ 安全措施
- **文件**: `WebContent/js/customer/customerSource.js:262,314`
- **代码**:
```javascript
// 第262行：推荐客户手机号部分脱敏
customerSource.items.referPhone.val(
    (decoration.status == 3 || decoration.status == 7)
    ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9))
    : "客户电话"
);

// 第314行：推荐客户手机号部分脱敏
customerSource.items.referPhone.val(
    (decoration.status == 3 || decoration.status == 7)
    ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9))
    : "客户电话"
);
```

#### ✅ 安全分析
- **保护措施**: 部分脱敏显示 `138****5678`
- **条件**: 仅在特定状态下显示脱敏号码
- **风险等级**: 🟢 **低风险**

### 3. **Customer Chance页面phone字段脱敏处理**

#### ✅ 安全措施
- **文件**: `WebContent/js/customer/customerChance.js:317-332`
- **代码**:
```javascript
// 第319-326行：客户电话脱敏显示
{
    field: "phone",
    name: "客户电话",
    prop: function(v) {
        if (v.customer && v.customer.phone) {
            return v.customer.phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
        } else {
            return v.source.phone;
        }
    },
    clazz: "grey",
    show: function(v) {
        return ((v.isRead == constant.customer().customerChance.ISREAD_READ_INT) &&
                (customerChance.depage == "user" || customerChance.depage == "designer"));
    }
}
```

#### ✅ 安全分析
- **保护措施**: 正则表达式脱敏 `138****5678`
- **条件限制**: 仅在已读状态下显示给用户/设计师
- **风险等级**: 🟢 **低风险**

### 4. **多个API接口可能暴露phone字段**

#### ❌ 风险接口
1. `pageCustomerSource.do` - 分页查询客户来源
2. `pageCustomerChance.do` - 分页查询客户机会
3. `queryCustomerForPhone.do` - 根据手机号查询客户
4. `queryCustomerPhoneByCid.do` - 根据客户ID查询手机号

#### 🔒 风险分析
- **问题**: 后端API返回完整phone字段
- **影响**: 如果API被调用或爬取，可能批量获取客户手机号
- **风险等级**: 🔴 **高风险**

---

## 📋 具体风险点清单

### 🔴 高风险点

| 序号 | 文件位置 | 问题描述 | 风险等级 |
|------|----------|----------|----------|
| 1 | `customerSource.js:557` | 用户页面显示完整手机号 | 高 |
| 2 | `api/customer.js:330` | `pageCustomerSource.do` 接口无权限控制 | 高 |
| 3 | `api/customer.js:391` | `pageCustomerChance.do` 接口无权限控制 | 高 |
| 4 | `api/data.js:230` | `queryCustomerForPhone.do` 可根据手机号查询客户 | 高 |
| 5 | `api/data.js:238` | `queryCustomerPhoneByCid.do` 可获取客户手机号 | 高 |

### 🟡 中风险点

| 序号 | 文件位置 | 问题描述 | 风险等级 |
|------|----------|----------|----------|
| 1 | `customerSource.js:375,431` | 部分场景下显示完整手机号 | 中 |
| 2 | `customerChance.js:847` | 审批模态框中显示完整手机号 | 中 |

### 🟢 低风险点

| 序号 | 文件位置 | 问题描述 | 风险等级 |
|------|----------|----------|----------|
| 1 | `customerSource.js:262,314` | 推荐客户已脱敏处理 | 低 |
| 2 | `customerChance.js:319-326` | 客户机会已脱敏处理 | 低 |

---

## 🛡️ 安全修复建议

### 1. **前端显示脱敏优化**

#### 🎯 建议1: 统一phone字段脱敏显示
```javascript
// 建议的统一脱敏函数
function maskPhoneNumber(phone) {
    if (!phone || phone.length !== 11) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
}

// 在所有显示phone字段的地方应用
{
    field: "phone",
    name: "客户电话",
    prop: function(v) {
        return maskPhoneNumber(v.phone || v.customer?.phone || "");
    }
}
```

#### 🎯 建议2: 添加权限验证
```javascript
show: function(v) {
    // 只有管理员或授权人员才能看到完整手机号
    return hasPermission('VIEW_FULL_PHONE') && customerSource.depage == "admin";
}
```

### 2. **后端API权限控制**

#### 🎯 建议3: API接口权限验证
```java
// 在CustomerSourceAction中添加权限检查
@Action(value = "pageCustomerSource")
public String pageCustomerSource() throws FLException {
    // 检查用户是否有查看客户信息的权限
    if (!hasPermission("VIEW_CUSTOMER_INFO")) {
        throw new FLException("无权限查看客户信息");
    }

    // 对phone字段进行脱敏处理
    customerSourceService.pageCustomerSourceWithMaskedPhone(getPaging(), getFilters());
    return SUCCESS;
}
```

#### 🎯 建议4: 敏感接口限制
```java
// 限制根据手机号查询客户的接口
@Action(value = "queryCustomerForPhone")
public String queryCustomerForPhone() throws FLException {
    // 只有管理员或客服人员才能使用此接口
    if (!hasRole("ADMIN") && !hasRole("CUSTOMER_SERVICE")) {
        throw new FLException("无权限查询客户手机号");
    }

    // 记录查询日志
    logSecurityEvent("QUERY_CUSTOMER_BY_PHONE", getUserId(), customerPhone);

    customerService.queryCustomerForPhone(customerPhone);
    return SUCCESS;
}
```

### 3. **数据访问层加密**

#### 🎯 建议5: 数据库加密存储
```java
@Entity
public class CustomerOriginPO {
    @Column(name = "phone")
    private String encryptedPhone;  // 加密存储的手机号

    // 提供脱敏的getter方法
    @Transient
    public String getMaskedPhone() {
        return MaskUtil.maskPhone(encryptedPhone);
    }

    // 需要权限才能获取完整手机号
    public String getPhone() {
        if (hasPermission("VIEW_FULL_PHONE")) {
            return DecryptUtil.decryptPhone(encryptedPhone);
        }
        return getMaskedPhone();
    }
}
```

### 4. **审计日志记录**

#### 🎯 建议6: 添加安全审计日志
```java
@Component
public class CustomerSecurityAuditor {

    @EventListener
    public void onCustomerPhoneQuery(CustomerPhoneQueryEvent event) {
        // 记录手机号查询日志
        AuditLog log = new AuditLog();
        log.setUserId(event.getUserId());
        log.setAction("QUERY_CUSTOMER_PHONE");
        log.setDetails("查询客户手机号: " + maskPhoneNumber(event.getPhone()));
        log.setTimestamp(LocalDateTime.now());
        auditLogService.save(log);
    }

    @EventListener
    public void onCustomerDataAccess(CustomerDataAccessEvent event) {
        // 记录客户数据访问日志
        if (event.getFields().contains("phone")) {
            logSecurityEvent("ACCESS_CUSTOMER_PHONE", event.getUserId(), event.getCustomerId());
        }
    }
}
```

---

## 🔧 紧急修复措施（优先级排序）

### 🚨 立即修复（高优先级）

1. **修改前端显示逻辑**
   ```javascript
   // 将所有phone字段显示改为脱敏模式
   prop: function(v) {
       var phone = v.phone || v.customer?.phone || "";
       return phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
   }
   ```

2. **限制API接口权限**
   - 为 `queryCustomerForPhone.do` 添加权限检查
   - 为 `queryCustomerPhoneByCid.do` 添加权限检查

### 📅 短期改进（中优先级）

1. **实现基于角色的访问控制**
2. **添加API调用频率限制**
3. **实现数据访问审计日志**

### 🏗️ 长期规划（低优先级）

1. **数据库字段加密存储**
2. **实现数据脱敏策略配置化**
3. **建立客户数据安全管理制度**

---

## 📊 风险评估矩阵

| 威胁向量 | 可能性 | 影响程度 | 风险等级 | 缓解措施 |
|---------|--------|----------|----------|----------|
| **内部员工滥用** | 高 | 高 | 🔴 高 | 权限控制+审计日志 |
| **API接口调用** | 中 | 高 | 🔴 高 | 接口权限限制+频率控制 |
| **前端页面查看** | 高 | 中 | 🟡 中 | 统一脱敏+权限验证 |
| **数据导出泄露** | 低 | 高 | 🟡 中 | 导出权限控制+脱敏处理 |
| **数据库直接访问** | 低 | 高 | 🟢 低 | 数据库加密+访问控制 |

---

## ✅ 合规性建议

### 1. **个人信息保护法合规**
- 实施最小化原则：只收集必要的个人信息
- 建立数据分类分级制度
- 实施数据脱敏和访问控制

### 2. **等保2.0要求**
- 身份鉴别和访问控制
- 安全审计
- 数据保密性保护

### 3. **行业最佳实践**
- 客户敏感信息加密存储
- 基于角色的访问控制
- 完整的审计追踪

---

## 📞 紧急联系方式

如发现数据泄露事件，请立即联系：
- **安全团队**: security@company.com
- **技术负责人**: tech-lead@company.com
- **法务部门**: legal@company.com

---

**评估结论**: 当前系统存在多个phone字段暴露风险，建议立即采取前端脱敏和后端权限控制措施，并建立长期的数据安全管理体系。