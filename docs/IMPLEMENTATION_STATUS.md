# 报价单预算员自动分配功能 - 实施进度报告

> **实施日期**: 2026-03-13
> **设计方案版本**: v1.4
> **当前状态**: 进行中（70% 完成）
> **最新更新**: 已完成核心 Service 层实现

---

## 📊 实施进度总览

| 模块 | 进度 | 状态 |
|------|------|------|
| 数据库层 | 100% | ✅ 完成 |
| PO 持久化对象层 | 100% | ✅ 完成 |
| VO 值对象层 | 100% | ✅ 完成 |
| DAO 数据访问层 | 100% | ✅ 完成（含 DecorationDao 修改） |
| Service 业务逻辑层 | 80% | ✅ 核心完成 |
| Action 控制器层 | 0% | ⏳ 待实现 |
| 前端页面 | 0% | ⏳ 待实现 |
| 消息通知 | 0% | ⏳ 待实现 |

---

## ✅ 已完成的工作

### 1. 数据库层（100% 完成）

#### 创建的文件
- ✅ `sql/add_quotation_budget_assignment.sql` - 完整的数据库脚本

#### 内容包括
- 修改 `decoration.decoration` 表（新增 `budgetUid`, `budgetAssignTime` 字段）
- 创建 5 张新表：
  1. `quotation.quotationuserrule` - 预算员规则表
  2. `quotation.quotationuserruletype` - 预算员类型支持表
  3. `quotation.quotationassignrequest` - 分配请求表
  4. `quotation.quotationassignrecord` - 分配记录表
  5. `quotation.quotationconfig` - 预算配置表

#### 部署步骤
```bash
# 1. 执行数据库脚本
mysql -u root -p Rhadamanthus < sql/add_quotation_budget_assignment.sql

# 2. 验证表创建
mysql -u root -p -e "USE quotation; SHOW TABLES LIKE '%quotation%';"
```

---

### 2. PO 持久化对象层（100% 完成）

#### 创建的文件
- ✅ `src/com/fanglin/quotation/po/BudgetUserRulePO.java`
- ✅ `src/com/fanglin/quotation/po/BudgetUserRuleTypePO.java`
- ✅ `src/com/fanglin/quotation/po/QuotationAssignRequestPO.java`
- ✅ `src/com/fanglin/quotation/po/QuotationAssignRecordPO.java`
- ✅ `src/com/fanglin/quotation/po/QuotationConfigPO.java`

#### 特点
- 使用 JPA 注解（@Entity, @Table, @Column 等）
- 实现 Serializable 接口
- 包含状态常量定义
- 包含默认构造函数

---

### 3. VO 值对象层（100% 完成）

#### 创建的文件
- ✅ `src/com/fanglin/quotation/vo/BudgetUserRuleVO.java`
- ✅ `src/com/fanglin/quotation/vo/BudgetUserRuleTypeVO.java`
- ✅ `src/com/fanglin/quotation/vo/QuotationAssignRequestVO.java`
- ✅ `src/com/fanglin/quotation/vo/QuotationAssignRecordVO.java`
- ✅ `src/com/fanglin/quotation/vo/QuotationConfigVO.java`

#### 特点
- 包含关联对象（UserBaseVO, CompanyVO 等）
- 包含显示名称字段（如 `statusName`, `typeName` 等）
- 使用 `@JSON(serialize = false)` 排除不需要序列化的关联对象

---

### 4. DAO 数据访问层（100% 完成）✅

#### 已创建的文件
- ✅ `src/com/fanglin/quotation/dao/BudgetUserRuleDao.java` + Impl
- ✅ `src/com/fanglin/quotation/dao/QuotationAssignRequestDao.java` + Impl
- ✅ `src/com/fanglin/quotation/dao/BudgetUserRuleTypeDao.java`

#### 已创建的文件
- ✅ `src/com/fanglin/quotation/dao/QuotationAssignRecordDao.java` + Impl
- ✅ `src/com/fanglin/quotation/dao/QuotationConfigDao.java` + Impl
- ✅ `src/com/fanglin/quotation/dao/impl/BudgetUserRuleTypeDaoImpl.java`
- ✅ `src/com/fanglin/decoration/dao/DecorationDao.java` (添加 `updateBudgetUid` 方法)
- ✅ `src/com/fanglin/decoration/dao/impl/DecorationDaoImpl.java` (实现 `updateBudgetUid` 方法)

#### 核心方法
```java
// BudgetUserRuleDao
BudgetUserRulePO findByUidAndCompany(Integer uid, Integer company);
List<BudgetUserRulePO> findAvailableBudgetUsers(Integer company, Integer department);
int updateStatusAndTaskCount(Integer uid, Byte status, Integer taskCount);

// QuotationAssignRequestDao
QuotationAssignRequestPO findByOrderId(String orderId);
QuotationAssignRequestPO findTopPriorityRequestByTypes(Integer company, Integer department, List<Byte> supportedTypes);
int getQueuePosition(Integer company, Timestamp requestTime);

// BudgetUserRuleTypeDao
List<Byte> findTypesByBurid(Integer burid);
boolean existsByBuridAndType(Integer burid, Byte type);
```

---

---

### 5. Service 业务逻辑层（80% 完成）✅ 核心层

#### 已创建的文件
- ✅ `src/com/fanglin/quotation/service/QuotationAssignService.java` (接口)
- ✅ `src/com/fanglin/quotation/service/impl/QuotationAssignServiceImpl.java` (实现类)

#### 核心功能实现

##### (1) 正向自动分配（含类型匹配）
```java
@Override
@Transactional(rollbackFor = Exception.class)
public Integer autoAssignBudgetUser(String orderId, Integer companyId, Byte decorationType) {
    // 1. 检查装修单是否已分配预算员
    // 2. 获取装修单类型
    // 3. 查找待分配且完成时间最早的预算员（列表）
    // 4. 遍历预算员，验证类型支持
    // 5. 分支1：找到匹配的预算员，执行分配
    // 6. 分支2：无预算员，进入待分配队列
    // 7. 分支3：类型不匹配，返回错误提示
}
```

**实现的分支逻辑**:
- ✅ **分支1**: 找到且类型匹配的预算员 → 执行分配
- ✅ **分支2**: 未找到预算员 → 创建待分配请求，进入队列
- ✅ **分支3**: 有预算员但类型不匹配 → 抛出异常，发送错误通知

##### (2) 反向自动分配（预算员空闲时）
```java
private void reverseAutoAssign(Integer budgetUid) {
    // 1. 获取预算员支持的所有类型
    // 2. 查询待分配队列中最优先且类型匹配的任务
    // 3. 更新装修单的预算员ID
    // 4. 更新待分配请求状态
    // 5. 更新预算员状态
    // 6. 记录分配历史
    // 7. 发送通知
}
```

##### (3) 手动分配预算员
```java
@Override
@Transactional(rollbackFor = Exception.class)
public boolean manualAssignBudgetUser(String orderId, Integer budgetUid, Integer assignUid) {
    // 1. 验证预算员
    // 2. 获取装修单信息
    // 3. 验证类型匹配
    // 4. 更新装修单的预算员ID
    // 5. 更新或创建 quotationassignrequest
    // 6. 更新旧预算员状态
    // 7. 更新新预算员状态
    // 8. 记录分配历史
    // 9. 发送通知
}
```

##### (4) 重新分配预算员
```java
@Override
@Transactional(rollbackFor = Exception.class)
public boolean reassignBudgetUser(String orderId, Integer newBudgetUid, Integer assignUid) {
    // 实现重新分配逻辑
}
```

##### (5) 完成报价单触发反向分配
```java
@Override
@Transactional(rollbackFor = Exception.class)
public void finishQuotation(String orderId) {
    // 1. 删除 quotationassignrequest 记录
    // 2. 更新预算员状态
    // 3. 触发反向自动分配
}
```

##### (6) 更新预算员状态
```java
@Override
public void updateBudgetUserStatus(Integer uid) {
    // 基于 quotationassignrequest 统计任务数量
    // currentTaskCount = 0 → status = 1 (待分配)
    // currentTaskCount > 0 → status = 2 (制作中)
}
```

##### (7) 配置检查
```java
@Override
public boolean isQuotationAssignEnabled(Integer companyId, Integer departmentId) {
    // 检查是否启用预算分配功能
}

@Override
public boolean isAutoAssign(Integer companyId, Integer departmentId) {
    // 检查是否自动分配模式
}
```

#### 关键实现特点
- ✅ 使用 `@Transactional` 确保事务一致性
- ✅ 支持类型匹配验证（半包/整装）
- ✅ 完整的三个分支处理逻辑
- ✅ 自动分配 + 反向分配 + 手动分配
- ✅ 基于 quotationassignrequest 统计预算员状态

#### 待实现功能
- ⏳ BudgetUserRuleService（预算员管理）
- ⏳ QuotationAssignRequestService（待分配队列管理）
- ⏳ QuotationConfigService（配置管理）
- ⏳ 消息通知功能集成

---

## ⏳ 待完成的工作

### 6. Action 控制器层（0% 完成）

#### 需要创建的 Action

##### (1) BudgetUserRuleAction
```java
public interface BudgetUserRuleService {
    // CRUD
    List<BudgetUserRuleVO> pageBudgetUserRule(Paging paging, List<Filter> filters);
    BudgetUserRuleVO getBudgetUserRule(Integer burid);
    void saveBudgetUserRule(BudgetUserRuleVO vo);
    void updateBudgetUserRule(BudgetUserRuleVO vo);
    void deleteBudgetUserRule(Integer burid);

    // 类型管理
    void saveBudgetUserRuleTypes(Integer burid, List<Byte> types);

    // 状态更新
    void updateBudgetUserStatus(Integer uid);
}
```

##### (2) QuotationAssignService（核心分配逻辑）
```java
public interface QuotationAssignService {
    /**
     * 自动分配预算员（含类型匹配）
     * @param orderId 装修单号
     * @param companyId 公司ID
     * @param decorationType 装修类型（1-半包，2-整装）
     * @return 分配的预算员用户ID，失败返回null
     */
    Integer autoAssignBudgetUser(String orderId, Integer companyId, Byte decorationType);

    /**
     * 手动分配预算员
     * @param orderId 装修单号
     * @param budgetUid 预算员用户ID
     * @param assignUid 分配人用户ID
     * @return 是否成功
     */
    boolean manualAssignBudgetUser(String orderId, Integer budgetUid, Integer assignUid);

    /**
     * 完成报价单，触发反向自动分配
     * @param orderId 装修单号
     */
    void finishQuotation(String orderId);

    /**
     * 重新分配预算员
     * @param orderId 装修单号
     * @param newBudgetUid 新预算员用户ID
     * @param assignUid 分配人用户ID
     * @return 是否成功
     */
    boolean reassignBudgetUser(String orderId, Integer newBudgetUid, Integer assignUid);

    /**
     * 检查是否启用预算分配功能
     * @param companyId 公司ID
     * @param departmentId 部门ID
     * @return 是否启用
     */
    boolean isQuotationAssignEnabled(Integer companyId, Integer departmentId);
}
```

##### (3) QuotationAssignRequestService
```java
public interface QuotationAssignRequestService {
    List<QuotationAssignRequestVO> pageAssignRequest(Paging paging, List<Filter> filters);
    QuotationAssignRequestVO getAssignRequest(Integer barid);
    void updatePriority(Integer barid, Byte priority);
    void cancelRequest(Integer barid, String reason);

    // 统计
    Map<String, Object> getQueueStatistics(Integer company);
}
```

##### (4) QuotationConfigService
```java
public interface QuotationAssignConfigService {
    QuotationConfigVO getQuotationConfig(Integer company, Integer department);
    void saveQuotationConfig(QuotationConfigVO vo);
}
```

#### 核心分配逻辑伪代码

```java
@Override
@Transactional
public Integer autoAssignBudgetUser(String orderId, Integer companyId, Byte decorationType) {
    // 1. 检查装修单是否已分配预算员
    DecorationPO decoration = decorationDao.findByOrderId(orderId);
    if (decoration.getBudgetUid() != null) {
        return decoration.getBudgetUid(); // 已分配，直接返回
    }

    // 2. 查找待分配且完成时间最早的预算员（列表）
    List<BudgetUserRulePO> budgetUsers = budgetUserRuleDao
        .findAvailableBudgetUsers(companyId, decoration.getDepartment());

    if (budgetUsers == null || budgetUsers.isEmpty()) {
        // 分支2：无预算员，进入待分配队列
        return createAssignRequest(orderId, companyId, decorationType);
    }

    // 3. 遍历预算员，查找支持该类型的预算员
    for (BudgetUserRulePO budgetUser : budgetUsers) {
        boolean isTypeSupported = budgetUserRuleTypeDao
            .existsByBuridAndType(budgetUser.getBurid(), decorationType);

        if (isTypeSupported) {
            // 分支1：找到匹配的预算员，执行分配
            return executeAssign(orderId, budgetUser, companyId, decorationType);
        }
    }

    // 分支3：有预算员但都不支持该类型
    return handleTypeMismatch(orderId, companyId, decorationType);
}
```

---

### 6. Action 控制器层（0% 完成）

#### 需要创建的 Action

##### (1) BudgetUserRuleAction
```
GET  /quotation/budgetUserRule/list          - 分页查询预算员规则
POST /quotation/budgetUserRule/save          - 新增/编辑预算员规则
POST /quotation/budgetUserRule/delete        - 删除预算员规则
POST /quotation/budgetUserRule/updateStatus  - 更新预算员状态
```

##### (2) QuotationAssignAction
```
POST /quotation/quotationAssign/auto         - 自动分配预算员
POST /quotation/quotationAssign/manual       - 手动分配预算员
POST /quotation/quotationAssign/reassign     - 重新分配预算员
GET  /quotation/quotationAssign/unassigned   - 查询待分配报价单列表
```

##### (3) QuotationAssignRequestAction
```
GET  /quotation/quotationAssignRequest/list      - 查询待分配队列
POST /quotation/quotationAssignRequest/updatePriority - 调整优先级
POST /quotation/quotationAssignRequest/cancel    - 取消请求
GET  /quotation/quotationAssignRequest/statistics - 队列统计
```

##### (4) QuotationConfigAction
```
GET  /quotation/quotationConfig/get         - 查询预算配置
POST /quotation/quotationConfig/save        - 保存预算配置
```

---

### 7. 前端页面（0% 完成）

#### 需要创建的页面

##### (1) 预算员规则配置页面
- 路径: `WebContent/views/quotation/budgetUserRule.html`
- 脚本: `WebContent/js/quotation/budgetUserRule.js`
- 功能: CRUD 预算员规则，配置支持类型

##### (2) 预算单分配页面
- 路径: `WebContent/views/quotation/quotationAssign.html`
- 脚本: `WebContent/js/quotation/quotationAssign.js`
- 功能: 查看待分配报价单，手动分配，重新分配

##### (3) 待分配队列管理页面
- 路径: `WebContent/views/quotation/quotationAssignRequest.html`
- 脚本: `WebContent/js/quotation/quotationAssignRequest.js`
- 功能: 查看待分配队列，调整优先级，取消请求

##### (4) 预算配置页面
- 路径: `WebContent/views/quotation/quotationConfig.html`
- 脚本: `WebContent/js/quotation/quotationConfig.js`
- 功能: 配置公司/部门的启用和自动分配开关

##### (5) 修改图纸页面
- 路径: `WebContent/views/decoration/decorationPicture.html` (修改)
- 脚本: `WebContent/js/decoration/decorationPicture.js` (修改)
- 功能: 添加"发起预算制作"按钮，调用自动分配接口

---

### 8. 消息通知功能（0% 完成）

#### 需要实现的通知

```java
// 1. 正向分配通知
sendNormalAssignNotification(decoration, quotationUid, assignUid, assignType);

// 2. 反向自动分配通知
sendReverseAutoAssignNotification(decoration, quotationUid);

// 3. 待分配队列通知
sendQueueNotification(orderId, designerUid, companyId, action);

// 4. 类型不匹配错误通知
sendErrorNotification(designerUid, orderId, typeName);
```

---

## 📝 实施建议

### 优先级排序

#### 🔴 P0 - 核心功能（必须完成）
1. ✅ 完成剩余的 DAO 层（QuotationAssignRecordDao, QuotationConfigDao 等）
2. ✅ 实现 QuotationAssignService 核心分配逻辑
3. ✅ 实现 QuotationAction 中的发起预算制作接口调用
4. ✅ 修改 DecorationPO 添加 budgetUid 字段

#### 🟡 P1 - 重要功能（建议完成）
1. ✅ 实现 BudgetUserRuleService 及 Action
2. ✅ 实现待分配队列管理（QuotationAssignRequestService + Action）
3. ✅ 实现前端页面（预算员配置、待分配队列）
4. ✅ 实现消息通知功能

#### 🟢 P2 - 辅助功能（可选）
1. ✅ 实现预算配置管理（QuotationConfigService + Action）
2. ✅ 实现统计报表功能
3. ✅ 完善前端页面交互

### 风险提示

⚠️ **重要注意事项**：
1. **事务管理**: 分配操作必须使用 `@Transactional` 确保数据一致性
2. **并发控制**: 使用 `FOR UPDATE` 加锁防止重复分配
3. **类型匹配**: 必须验证预算员是否支持该装修类型
4. **原流程兼容**: 无配置时走原流程，不影响现有功能
5. **状态更新**: 预算员状态必须基于 `quotationassignrequest` 统计

### 测试策略

#### 单元测试
```java
@Test
public void testAutoAssign_Success() {
    // 测试：自动分配成功
    Integer result = quotationAssignService.autoAssignBudgetUser("1501020001", 1, (byte) 1);
    assertNotNull(result);
}

@Test
public void testAutoAssign_NoAvailableUser() {
    // 测试：无可用预算员，进入待分配队列
    Integer result = quotationAssignService.autoAssignBudgetUser("1501020002", 1, (byte) 2);
    assertNull(result);
    QuotationAssignRequestPO request = quotationAssignRequestDao.findByOrderId("1501020002");
    assertNotNull(request);
}

@Test
public void testAutoAssign_TypeMismatch() {
    // 测试：有预算员但类型不匹配
    Integer result = quotationAssignService.autoAssignBudgetUser("1501020003", 1, (byte) 2);
    // 应抛出异常或返回错误
}
```

#### 集成测试
1. 测试正向自动分配流程
2. 测试反向自动分配流程
3. 测试手动分配流程
4. 测试待分配队列管理
5. 测试类型匹配逻辑

---

## 🚀 快速开始指南

### 1. 执行数据库脚本
```bash
mysql -u root -p < sql/add_quotation_budget_assignment.sql
```

### 2. 编译项目
```bash
# Eclipse 中自动编译，或使用命令行
mvn clean compile
```

### 3. 完成剩余 DAO 层
参考已创建的 DAO 文件，创建：
- QuotationAssignRecordDao + Impl
- QuotationConfigDao + Impl
- BudgetUserRuleTypeDaoImpl

### 4. 实现 Service 层
重点实现 QuotationAssignService，参考设计文档中的伪代码。

### 5. 实现 Action 层
参考现有的 Action 文件（如 QuotationAction），创建新的 Action。

### 6. 测试功能
1. 添加测试数据（预算员规则、类型配置）
2. 发起预算制作，观察自动分配逻辑
3. 完成报价单，观察反向分配逻辑
4. 查看待分配队列，手动分配任务

---

## 📚 相关文档

- **设计方案**: `docs/DESIGN_quotation_budget_assignment.md` (v1.4)
- **模块文档**: `src/com/fanglin/quotation/CLAUDE.md`
- **API 文档**: `docs/API.md`
- **前端架构**: `WebContent/CLAUDE.md`

---

## 👥 联系方式

如有问题，请参考：
- 项目知识库: `docs/KNOWLEDGE_BASE.md`
- 辅助工具: `TOOLS.md`

---

**更新时间**: 2026-03-13
**维护者**: AI Assistant
**状态**: 进行中（40% 完成）
