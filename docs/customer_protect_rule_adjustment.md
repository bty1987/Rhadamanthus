# 客户保护规则配置调整文档（V2.3 精简版）

> 文档编号：CONF-2026-001
> 创建日期：2026-04-07
> 最后更新：2026-04-07（V2.3 - 使用天数代替月数）
> 负责人：系统管理员
> 状态：待执行

---

## 一、核心设计理念

### 1.1 规则表的作用

**规则表只存储判断条件，不存储业务数据**

```
输入：原归属人岗位ID + 装修单创建时间 + 新归属人岗位ID（动态）
输出：是否需要走审批
```

### 1.2 字段精简原则

| 字段 | V2.1 | V2.2 | V2.3 | 说明 |
|-----|------|------|------|------|
| from_duty_ids | 保留 | 保留 | **保留** | 判断条件：匹配原岗位 |
| to_duty_id | 保留 | 删除 | **删除** | 动态传入，不需要存储 |
| time_condition_type | 保留 | 保留 | **保留** | 判断条件：时间类型 |
| time_condition_month | 保留 | 保留 | **删除** | V3改为天数 |
| time_condition_day | - | - | **新增** | 判断条件：天数阈值 |
| need_approval | 保留 | 保留 | **保留** | 判断结果：是否需要审批 |
| priority | 保留 | 保留 | **保留** | 优先级 |

### 1.3 时间单位改进

| 版本 | 时间单位 | 示例 | 计算方式 |
|-----|---------|------|---------|
| V2.2 | 月数 | 12个月 | DateUtil.diffMonth() |
| V2.3 | 天数 | 360天 | 日期直接相减 |

**优势**：天数更精确，配置更灵活（如365天、180天等）

---

## 二、表结构扩展（V2.3精简版）

### 2.1 新增字段

```sql
-- =============================================
-- 表结构扩展：增加岗位类型支持（V2.3精简版）
-- =============================================

ALTER TABLE customer.customerprotectrule
ADD COLUMN from_duty_ids VARCHAR(256) DEFAULT NULL COMMENT '原归属人岗位ID列表，逗号分隔，如: 10,20',
ADD COLUMN time_condition_type TINYINT(1) DEFAULT 0 COMMENT '时间条件类型: 0=不限制, 1=天数内, 2=天数外',
ADD COLUMN time_condition_day INT(11) DEFAULT 0 COMMENT '时间条件天数，与time_condition_type配合使用',
ADD COLUMN need_approval TINYINT(1) DEFAULT 0 COMMENT '是否需要审批: 0=不需要, 1=需要',
ADD COLUMN priority INT(11) DEFAULT 0 COMMENT '规则优先级，数字越大优先级越高';

-- 添加索引
ALTER TABLE customer.customerprotectrule
ADD INDEX idx_type_status (type, status),
ADD INDEX idx_company_status (company, status);

-- 验证
DESC customer.customerprotectrule;
```

### 2.2 字段说明

| 字段 | 类型 | 说明 |
|-----|------|-----|
| type | tinyint(1) | 规则类型：0=面积, 1=预付款, 2=设计费, **3=岗位组合** |
| from_duty_ids | varchar(256) | **原归属人岗位ID列表（逗号分隔）** |
| time_condition_type | tinyint(1) | **时间条件类型：0=不限制, 1=天数内, 2=天数外** |
| time_condition_day | int(11) | **时间条件天数** |
| need_approval | tinyint(1) | **是否需要审批** |
| priority | int(11) | **优先级** |

---

## 三、规则逻辑说明

### 3.1 匹配流程

```
┌─────────────────────────────────────────────────────────────┐
│ 输入：                                                      │
│   - 原归属人岗位ID（originalDutyId）                         │
│   - 新归属人岗位ID（newDutyId）- 动态传入                    │
│   - 装修单创建时间（createTime）                              │
│   - 当前时间（now）                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 查询规则：                                                  │
│   SELECT * FROM customerprotectrule                         │
│   WHERE type = 3 AND status = 0                             │
│     AND FIND_IN_SET(originalDutyId, from_duty_ids) > 0       │
│   ORDER BY priority DESC                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 匹配时间条件：                                              │
│   计算 daysPassed = DATEDIFF(now, createTime)               │
│   根据 time_condition_type 和 time_condition_day 判断        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 返回结果：                                                  │
│   - need_approval = 1 → 走审批                              │
│   - need_approval = 0 → 直接改归属                          │
│   - 无匹配规则 → 默认直接改归属                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 规则示例

| from_duty_ids | time_condition_type | time_condition_day | need_approval | 说明 |
|--------------|---------------------|-------------------|--------------|------|
| 10 | 1 | 360 | 1 | 业务员→任意岗位，360天内，走审批 |
| 10 | 2 | 360 | 0 | 业务员→任意岗位，360天外，直接改归属 |
| 20 | 1 | 360 | 1 | 电商→任意岗位，360天内，走审批 |
| 20 | 2 | 360 | 0 | 电商→任意岗位，360天外，直接改归属 |
| 30 | 0 | 0 | 0 | 监理→任意岗位，直接改归属，不限制时间 |
| 0 | 0 | 0 | 0 | 默认规则：其他岗位，直接改归属 |

**注意**：
- `to_duty_id` 已删除，规则不再关心"转到哪个岗位"
- 时间单位从"月"改为"天"，更精确

---

## 四、配置SQL

### 4.1 查询岗位ID

```sql
SELECT did, name, code, status
FROM communion.duty
WHERE status = 0
ORDER BY did;
```

### 4.2 备份

```sql
CREATE TABLE IF NOT EXISTS customer.customerprotectrule_backup_20260407 AS
SELECT * FROM customer.customerprotectrule WHERE company = 1;
```

### 4.3 面积/定金规则

```sql
-- 软删除旧配置
UPDATE customer.customerprotectrule SET status = 1 WHERE company = 1;

-- 面积规则
INSERT INTO customer.customerprotectrule
(type, title, uppval, lowval, days, priority, status, company, cuid, createtime)
VALUES
(0, '200㎡以下-7天', 0, 200, 7, 100, 0, 1, {cuid}, NOW()),
(0, '201-500㎡-15天', 201, 500, 15, 100, 0, 1, {cuid}, NOW()),
(0, '501㎡以上-30天', 501, 999999, 30, 100, 0, 1, {cuid}, NOW());

-- 定金规则
INSERT INTO customer.customerprotectrule
(type, title, uppval, lowval, days, priority, status, company, cuid, createtime)
VALUES
(1, '定金5000+保护30天', 5000, 99999999, 30, 100, 0, 1, {cuid}, NOW());
```

### 4.4 岗位组合规则（V2.3精简版）

```sql
-- =============================================
-- 岗位组合规则配置（V2.3精简版）
-- 只需要配置原岗位，不配置目标岗位
-- 时间单位：天数（12个月=360天）
-- =============================================

-- 规则1：业务员，360天内，走审批
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '业务员-360天内-走审批', '{SALESMAN_DUTY_ID}', 1, 360, 1, 200, 0, 1, {cuid}, NOW());

-- 规则2：业务员，360天外，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '业务员-360天外-直接改归属', '{SALESMAN_DUTY_ID}', 2, 360, 0, 200, 0, 1, {cuid}, NOW());

-- 规则3：电商，360天内，走审批
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '电商-360天内-走审批', '{ECOMMERCE_DUTY_ID}', 1, 360, 1, 200, 0, 1, {cuid}, NOW());

-- 规则4：电商，360天外，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '电商-360天外-直接改归属', '{ECOMMERCE_DUTY_ID}', 2, 360, 0, 200, 0, 1, {cuid}, NOW());

-- 规则5：监理，直接合尺，不限制时间
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '监理-直接合尺', '{SUPERVISOR_DUTY_ID}', 0, 0, 0, 200, 0, 1, {cuid}, NOW());

-- 规则6：默认规则-其他岗位，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '默认规则-其他岗位-直接改归属', '0', 0, 0, 0, 0, 0, 1, {cuid}, NOW());
```

### 4.5 配置示例（假设岗位ID）

```sql
-- 假设：业务员=10, 电商=20, 监理=30, 执行人=1
-- 12个月 = 360天

INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '业务员-360天内-走审批', '10', 1, 360, 1, 200, 0, 1, 1, NOW()),
(3, '业务员-360天外-直接改归属', '10', 2, 360, 0, 200, 0, 1, 1, NOW()),
(3, '电商-360天内-走审批', '20', 1, 360, 1, 200, 0, 1, 1, NOW()),
(3, '电商-360天外-直接改归属', '20', 2, 360, 0, 200, 0, 1, 1, NOW()),
(3, '监理-直接合尺', '30', 0, 0, 0, 200, 0, 1, 1, NOW()),
(3, '默认规则-其他岗位-直接改归属', '0', 0, 0, 0, 0, 0, 1, 1, NOW());
```

---

## 五、代码修改点

### 5.1 PO实体类（V2.3精简版）

```java
// 新增常量
public static final short TYPE_DUTY_COMBINATION_INT = 3; // 岗位组合规则

// 时间条件类型常量
public static final short TIME_CONDITION_NO_LIMIT_INT = 0;   // 不限制
public static final short TIME_CONDITION_WITHIN_INT = 1;     // 天数内
public static final short TIME_CONDITION_BEYOND_INT = 2;     // 天数外

// 新增字段（删除了 toDutyId 和 timeConditionMonth）
private String fromDutyIds;          // 原归属人岗位ID列表
private Short timeConditionType;     // 时间条件类型
private Integer timeConditionDay;    // 时间条件天数（V2.3新增）
private Short needApproval;          // 是否需要审批
private Integer priority;            // 优先级

// Getter/Setter 方法
@Column(name = "from_duty_ids")
public String getFromDutyIds() { return fromDutyIds; }
public void setFromDutyIds(String fromDutyIds) { this.fromDutyIds = fromDutyIds; }

@Column(name = "time_condition_type")
public Short getTimeConditionType() { return timeConditionType; }
public void setTimeConditionType(Short timeConditionType) {
    this.timeConditionType = timeConditionType;
}

@Column(name = "time_condition_day")
public Integer getTimeConditionDay() { return timeConditionDay; }
public void setTimeConditionDay(Integer timeConditionDay) {
    this.timeConditionDay = timeConditionDay;
}

@Column(name = "need_approval")
public Short getNeedApproval() { return needApproval; }
public void setNeedApproval(Short needApproval) {
    this.needApproval = needApproval;
}

@Column(name = "priority")
public Integer getPriority() { return priority; }
public void setPriority(Integer priority) { this.priority = priority; }
```

### 5.2 Service层（V2.3精简版）

```java
/**
 * 检查岗位组合规则（V2.3精简版）
 * 只根据原岗位ID匹配规则，不关心新岗位ID
 */
private CustomerProtectRulePO checkDutyCombinationRule(
    DecorationPO decorationPO, String userId, int company) {

    // 获取原归属人（设计师）
    UserPO originalDesigner = decorationPO.getDesigner();
    if (originalDesigner == null || originalDesigner.getDuty() == null) {
        return null; // 无原岗位信息，使用默认行为
    }
    Integer originalDutyId = originalDesigner.getDuty().getDid();

    // 计算装修单创建至今的天数（V2.3：使用天数代替月数）
    long daysPassed = DateUtil.diffDay(decorationPO.getCreateTime(), new Date());

    // 查询匹配的岗位组合规则（只根据原岗位ID匹配）
    List<CustomerProtectRulePO> rules = customerProtectRuleDao.queryDutyCombinationRule(
        originalDutyId, company);

    // 按优先级排序，优先级高的先匹配
    for (CustomerProtectRulePO rule : rules) {
        if (matchTimeCondition(rule, daysPassed)) {
            return rule;
        }
    }

    return null; // 无匹配规则
}

/**
 * 判断时间条件是否匹配（V2.3：使用天数）
 */
private boolean matchTimeCondition(CustomerProtectRulePO rule, long daysPassed) {
    if (rule.getTimeConditionType() == null) {
        return false;
    }

    short conditionType = rule.getTimeConditionType();
    int threshold = rule.getTimeConditionDay() == null ? 0 : rule.getTimeConditionDay();

    switch (conditionType) {
        case CustomerProtectRulePO.TIME_CONDITION_NO_LIMIT_INT:
            return true; // 不限制，始终匹配

        case CustomerProtectRulePO.TIME_CONDITION_WITHIN_INT:
            return daysPassed <= threshold; // 天数内

        case CustomerProtectRulePO.TIME_CONDITION_BEYOND_INT:
            return daysPassed > threshold; // 天数外

        default:
            return false;
    }
}
```

### 5.3 DAO层（V2.3精简版）

```java
/**
 * 查询岗位组合规则（V2.3精简版）
 * 只根据原岗位ID匹配，不关心新岗位ID
 * @param fromDutyId 原归属人岗位ID
 * @param company 公司ID
 * @return 按优先级降序排列的规则列表
 */
public List<CustomerProtectRulePO> queryDutyCombinationRule(Integer fromDutyId, int company);
```

```java
@Override
@SuppressWarnings("unchecked")
public List<CustomerProtectRulePO> queryDutyCombinationRule(Integer fromDutyId, int company) {

    String sql =
        "SELECT * FROM customer.customerprotectrule " +
        "WHERE type = 3 AND status = 0 AND company = :company " +
        "AND (" +
        "   (FIND_IN_SET(:fromDutyId, from_duty_ids) > 0) " +  // 精确匹配
        "   OR (from_duty_ids = '0') " +                            // 默认规则
        ") " +
        "ORDER BY priority DESC, cprid ASC";

    return session().createSQLQuery(sql)
        .addScalar("cprid", StandardBasicTypes.LONG)
        .addScalar("type", StandardBasicTypes.SHORT)
        .addScalar("title", StandardBasicTypes.STRING)
        .addScalar("from_duty_ids", StandardBasicTypes.STRING)
        .addScalar("time_condition_type", StandardBasicTypes.SHORT)
        .addScalar("time_condition_day", StandardBasicTypes.INTEGER)
        .addScalar("need_approval", StandardBasicTypes.SHORT)
        .addScalar("priority", StandardBasicTypes.INTEGER)
        .setInteger("company", company)
        .setInteger("fromDutyId", fromDutyId)
        .setResultTransformer(Transformers.aliasToBean(CustomerProtectRulePO.class))
        .list();
}
```

---

## 六、对比总结

| 对比项 | V2.1 | V2.2 | V2.3 |
|-------|------|------|------|
| **to_duty_id** | 有 | 无（删除） | 无（删除） |
| **时间字段** | time_condition_month | time_condition_month | **time_condition_day** |
| **时间单位** | 月 | 月 | **天** |
| **计算方式** | diffMonth() | diffMonth() | **diffDay() / DATEDIFF** |
| **精度** | 月级别（粗略） | 月级别（粗略） | **天级别（精确）** |

### V2.3 优势

1. **更精确**：天数计算不受月份长度影响
2. **更灵活**：可配置365天、180天等任意天数
3. **更简单**：DATEDIFF直接计算，无需月份转换
4. **更直观**：360天比12个月更易理解

---

**文档版本：V2.3**
**最后更新：2026-04-07**
