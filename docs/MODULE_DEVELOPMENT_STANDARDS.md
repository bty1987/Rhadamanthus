# Rhadamanthus 模块开发前后台规范说明

> **文档版本**: v1.0
> **创建日期**: 2026-03-19
> **适用范围**: 所有新功能模块开发
> **核心原则**: 遵循项目现有代码风格，保持一致性

---

## 📚 文档说明

本文档基于 **QuotationAssign（预算员分配）模块** 的实际开发经验总结，提炼出项目的前后端开发规范。

**为什么需要这个文档？**
- ✅ 确保所有开发人员遵循统一的代码风格
- ✅ 避免常见的代码模式错误
- ✅ 提高代码可维护性和可读性
- ✅ 新人快速上手项目开发

**文档定位**：
- 项目级开发规范补充（与 `CLAUDE.md` 配合使用）
- 模块级开发实践指南
- 代码审查的参考标准

---

## 🎯 核心开发原则

### 1. 三层架构职责明确

```
┌─────────────────────────────────────────────┐
│  Action 层（控制器）                         │
│  - 职责：接收 HTTP 请求，调用 Service        │
│  - 参数：使用 VO 对象，让框架自动填充        │
│  - 返回：JSON 响应（SUCCESS/ERROR）          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Service 层（业务逻辑）                      │
│  - 职责：业务逻辑处理、数据校验、PO↔VO转换   │
│  - 参数：统一使用 VO 对象                    │
│  - 依赖：调用 DAO 层，注入其他 Service       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  DAO 层（数据访问）                          │
│  - 职责：数据库操作，使用 Hibernate          │
│  - 参数：使用基本类型（long, int, String）   │
│  - 返回：PO 对象或基本类型                   │
└─────────────────────────────────────────────┘
```

### 2. 命名规范

| 层级 | 规范 | 示例 | 反例 ❌ |
|------|------|------|---------|
| **Action 字段** | 使用完整对象名 | `quotationAssignConfig` | `config` |
| **Service 方法参数** | 统一使用 VO 对象 | `QuotationAssignConfigVO config` | `long qacid` |
| **DAO 方法参数** | 使用基本类型 | `long qacid, short enabled` | `QuotationAssignConfigVO config` |
| **方法命名** | 动词+名词，清晰表达意图 | `pageQuotationAssignConfig` | `getConfigList` |

### 3. 参数传递规范

**关键原则**：
- ✅ Action → Service：传递完整的 **VO 对象**
- ✅ Service → DAO：从 VO 中**提取属性**，传递基本类型
- ❌ 不要在 Action 中手动 `new VO()` 对象
- ❌ 不要在 Action 中手动 `getLong()` 提取参数

---

## 📐 Action 层开发规范

### 1. 字段定义规范

#### ✅ 正确示例

```java
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignConfigAction extends BaseListAction {

    @Autowired
    private QuotationAssignConfigService quotationAssignConfigService;

    // ✅ 使用完整对象名，清晰表达业务含义
    private QuotationAssignConfigVO quotationAssignConfig;

    // Getter/Setter
    public QuotationAssignConfigVO getQuotationAssignConfig() {
        return quotationAssignConfig;
    }

    public void setQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig) {
        this.quotationAssignConfig = quotationAssignConfig;
    }
}
```

#### ❌ 错误示例

```java
// ❌ 字段名太通用，不清晰
private QuotationAssignConfigVO config;

// ❌ 不要定义多个字段来存储参数
private Long qacid;
private Short enabled;
private Integer company;
```

### 2. 方法实现规范

#### ✅ 正确示例（分页查询）

```java
@Action(value = "pageQuotationAssignConfig", results = {
    @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
}, params = { "contentType", "text/html" })
public String pageQuotationAssignConfig() throws FLException {
    // ✅ 直接传递参数，让 Service 处理
    quotationAssignConfigService.pageQuotationAssignConfig(
        getPaging(),
        getFilters(),        // 使用统一的筛选器
        queryCompany()       // 使用工具方法获取公司ID
    );
    return SUCCESS;
}
```

#### ✅ 正确示例（查询详情）

```java
@Action(value = "queryQuotationAssignConfigById", results = {
    @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
}, params = { "contentType", "text/html" })
public String queryQuotationAssignConfigById() throws FLException {
    // ✅ 直接传递 VO 对象，Struts2 会自动填充 qacid 字段
    quotationAssignConfig = quotationAssignConfigService.queryQuotationAssignConfigById(quotationAssignConfig);
    return SUCCESS;
}
```

#### ✅ 正确示例（删除操作）

```java
@Action(value = "deleteQuotationAssignConfig", results = {
    @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
}, params = { "contentType", "text/html" })
public String deleteQuotationAssignConfig() throws FLException {
    // ✅ 直接传递 VO 对象
    quotationAssignConfigService.deleteQuotationAssignConfig(quotationAssignConfig);
    return SUCCESS;
}
```

#### ❌ 错误示例

```java
// ❌ 错误：手动提取参数
public String queryQuotationAssignConfigById() throws FLException {
    long qacid = getLong("qacid");  // ❌ 不要手动提取
    quotationAssignConfig = quotationAssignConfigService.queryQuotationAssignConfigById(qacid);
    return SUCCESS;
}

// ❌ 错误：手动封装 VO
public String deleteQuotationAssignConfig() throws FLException {
    QuotationAssignConfigVO vo = new QuotationAssignConfigVO();  // ❌ 不要手动 new
    vo.setQacid(getLong("qacid"));
    quotationAssignConfigService.deleteQuotationAssignConfig(vo);
    return SUCCESS;
}

// ❌ 错误：不必要的 try-catch
public String deleteQuotationAssignConfig() throws FLException {
    try {  // ❌ 异常由框架统一处理
        quotationAssignConfigService.deleteQuotationAssignConfig(quotationAssignConfig);
        return SUCCESS;
    } catch (Exception e) {
        return ERROR;
    }
}
```

### 3. Action 层核心规则总结

| 规则 | 说明 | 示例 |
|------|------|------|
| **字段命名** | 使用完整对象名 | `quotationAssignConfig` |
| **参数接收** | 让 Struts2 自动填充 VO | 直接使用 `quotationAssignConfig` |
| **参数传递** | 直接传递 VO 对象给 Service | `service.method(vo)` |
| **筛选条件** | 使用 `getFilters()` 获取筛选器 | `getFilters()` |
| **公司ID** | 使用 `queryCompany()` 获取 | `queryCompany()` |
| **异常处理** | 不需要 try-catch | 让框架统一处理 |
| **返回值** | 返回 `SUCCESS` 或 `ERROR` | `return SUCCESS;` |

---

## 🔧 Service 层开发规范

### 1. 接口定义规范

#### ✅ 正确示例

```java
public interface QuotationAssignConfigService {

    /**
     * 分页查询配置列表
     *
     * @param paging 分页对象
     * @param filters 筛选条件列表
     * @param company 公司ID
     * @throws FLException 业务异常
     */
    void pageQuotationAssignConfig(
        Paging paging,
        List<Filter> filters,      // ✅ 使用 Filter 筛选器
        Integer company
    ) throws FLException;

    /**
     * 根据ID查询配置
     *
     * @param quotationAssignConfig 配置VO对象（包含 qacid）
     * @return 配置VO对象
     * @throws FLException 业务异常
     */
    QuotationAssignConfigVO queryQuotationAssignConfigById(
        QuotationAssignConfigVO quotationAssignConfig  // ✅ 参数使用 VO 对象
    ) throws FLException;

    /**
     * 创建配置
     *
     * @param quotationAssignConfig 配置VO对象
     * @return 成功返回1，失败返回0
     * @throws FLException 业务异常
     */
    int createQuotationAssignConfig(
        QuotationAssignConfigVO quotationAssignConfig  // ✅ 参数使用 VO 对象
    ) throws FLException;

    /**
     * 更新启用状态
     *
     * @param quotationAssignConfig 配置VO对象（包含 qacid 和 enabled）
     * @return 成功返回1，失败返回0
     * @throws FLException 业务异常
     */
    int updateQuotationAssignConfigForStatus(
        QuotationAssignConfigVO quotationAssignConfig  // ✅ 参数使用 VO 对象
    ) throws FLException;
}
```

#### ❌ 错误示例

```java
// ❌ 错误：参数类型不统一（有的用 VO，有的用基本类型）
QuotationAssignConfigVO queryQuotationAssignConfigById(long qacid) throws FLException;

int createQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException;

int deleteQuotationAssignConfig(long qacid) throws FLException;  // ❌ 应该用 VO

// ❌ 错误：方法命名不清晰
QuotationAssignConfigVO get(long id) throws FLException;
int add(QuotationAssignConfigVO config) throws FLException;
```

### 2. 实现类规范

#### ✅ 正确示例

```java
@Service("quotationAssignConfigService")
public class QuotationAssignConfigServiceImpl implements QuotationAssignConfigService {

    @Autowired
    private QuotationAssignConfigDao quotationAssignConfigDao;

    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private DepartmentDao departmentDao;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void pageQuotationAssignConfig(
        Paging paging,
        List<Filter> filters,
        Integer company
    ) throws FLException {
        // ✅ 调用 DAO 查询
        List<QuotationAssignConfigPO> poList = quotationAssignConfigDao.pageQuotationAssignConfig(
            paging,
            filters,
            company
        );

        // ✅ PO 转 VO 并填充关联数据
        List<QuotationAssignConfigVO> voList = new ArrayList<QuotationAssignConfigVO>();
        for (QuotationAssignConfigPO po : poList) {
            QuotationAssignConfigVO vo = convertToVO(po);
            voList.add(vo);
        }

        // ✅ 设置分页结果
        paging.setData(voList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public QuotationAssignConfigVO queryQuotationAssignConfigById(
        QuotationAssignConfigVO quotationAssignConfigVO
    ) throws FLException {
        // ✅ 从 VO 中提取属性
        long qacid = quotationAssignConfigVO.getQacid();

        // ✅ 调用 DAO 查询
        QuotationAssignConfigPO po = quotationAssignConfigDao.queryById(qacid);
        if (po == null) {
            return null;
        }

        // ✅ PO 转 VO 并填充关联数据
        return convertToVO(po);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int createQuotationAssignConfig(
        QuotationAssignConfigVO quotationAssignConfigVO
    ) throws FLException {
        // ✅ 业务校验：公司部门组合唯一性
        int company = quotationAssignConfigVO.getCompany();
        Integer department = quotationAssignConfigVO.getDepartment();
        QuotationAssignConfigPO existPO = quotationAssignConfigDao.queryQuotationAssignConfig(
            company,
            department
        );
        if (existPO != null) {
            throw new FLException("该公司和部门的配置已存在");
        }

        // ✅ VO 转 PO
        QuotationAssignConfigPO po = new QuotationAssignConfigPO();
        BeanUtils.copyProperties(quotationAssignConfigVO, po);

        // ✅ 保存
        quotationAssignConfigDao.save(po);

        // ✅ 设置返回的ID
        quotationAssignConfigVO.setQacid(po.getQacid());

        return 1;
    }

    /**
     * PO 转 VO 并填充关联数据
     *
     * @param po 持久化对象
     * @return 值对象
     */
    private QuotationAssignConfigVO convertToVO(QuotationAssignConfigPO po) {
        if (po == null) {
            return null;
        }

        // PO 转 VO
        QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
        BeanUtils.copyProperties(po, vo);

        // ✅ 填充公司信息
        if (po.getCompany() > 0) {
            CompanyPO companyPO = companyDao.queryById(po.getCompany());
            if (companyPO != null) {
                vo.setCompanyVO(companyPO);
            }
        }

        // ✅ 填充部门信息（可能为NULL）
        if (po.getDepartment() != null && po.getDepartment() > 0) {
            DepartmentPO departmentPO = departmentDao.queryById(po.getDepartment());
            if (departmentPO != null) {
                vo.setDepartmentVO(departmentPO);
            }
        }

        return vo;
    }
}
```

### 3. Service 层核心规则总结

| 规则 | 说明 | 示例 |
|------|------|------|
| **方法参数** | 统一使用 VO 对象 | `QuotationAssignConfigVO config` |
| **分页参数** | 包含 `Paging, List<Filter>, Integer` | 三个参数齐全 |
| **DAO 调用** | 从 VO 提取属性传递基本类型 | `config.getQacid()` |
| **业务校验** | 在 Service 层进行 | 唯一性校验、数据有效性 |
| **PO ↔ VO** | Service 层负责转换 | `convertToVO()` |
| **关联数据** | 查询并填充关联对象 | `companyVO`, `departmentVO` |
| **事务管理** | 使用 `@Transactional` | `@Transactional(rollbackFor=Exception.class)` |

---

## 💾 DAO 层开发规范

### 1. 接口定义规范

#### ✅ 正确示例

```java
public interface QuotationAssignConfigDao extends Dao<QuotationAssignConfigPO> {

    /**
     * 分页查询配置列表
     *
     * @param paging 分页对象
     * @param filters 筛选条件列表
     * @param company 公司ID
     * @return 配置列表
     */
    List<QuotationAssignConfigPO> pageQuotationAssignConfig(
        Paging paging,
        List<Filter> filters,    // ✅ 支持 Filter 筛选器
        Integer company
    );

    /**
     * 查询配置（根据公司+部门）
     *
     * @param company 公司ID
     * @param department 部门ID
     * @return 配置对象
     */
    QuotationAssignConfigPO queryQuotationAssignConfig(
        int company,
        Integer department
    );

    /**
     * 查询公司的所有配置
     *
     * @param company 公司ID
     * @return 配置列表
     */
    List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company);

    /**
     * 查询启用自动分配的配置
     *
     * @param company 公司ID
     * @return true-启用，false-未启用
     */
    boolean queryQuotationAssignConfigForEnable(int company);
}
```

#### ❌ 错误示例

```java
// ❌ 错误：方法过多，功能重复
int deleteQuotationAssignConfig(long qacid);                  // 应该用基础 DAO 的 delete()
int updateQuotationAssignConfigForStatus(long qacid, short enabled);  // 应该用基础 DAO 的 update()
int updateQuotationAssignConfigForAssign(long qacid, short autoAssign); // 应该用基础 DAO 的 update()

// ❌ 错误：过度封装
QuotationAssignConfigPO queryById(long qacid);                // 基础 DAO 已有
List<QuotationAssignConfigPO> queryAll();                     // 基础 DAO 已有
void save(QuotationAssignConfigPO po);                        // 基础 DAO 已有
void update(QuotationAssignConfigPO po);                      // 基础 DAO 已有
```

### 2. 实现类规范

#### ✅ 正确示例

```java
@Repository("quotationAssignConfigDao")
public class QuotationAssignConfigDaoImpl extends DaoImpl<QuotationAssignConfigPO>
    implements QuotationAssignConfigDao {

    public QuotationAssignConfigDaoImpl() {
        super(QuotationAssignConfigPO.class);
    }

    @Override
    public List<QuotationAssignConfigPO> pageQuotationAssignConfig(
        Paging paging,
        List<Filter> filters,
        Integer company
    ) {
        PagingQuery<QuotationAssignConfigPO> query = pagingQuery(paging, QuotationAssignConfigPO.class);

        // ✅ 按公司筛选
        if (company != null) {
            query.add(query.getCriterion("company", company, "eq"));
        }

        // ✅ 处理筛选器
        if (filters != null && !filters.isEmpty()) {
            for (Filter filter : filters) {
                // 根据 filter.field 动态添加查询条件
                queryFilterExecute(query, filter);
            }
        }

        // ✅ 按创建时间倒序排序
        query.addOrder(Order.desc("createTime"));

        return query.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public QuotationAssignConfigPO queryQuotationAssignConfig(int company, Integer department) {
        return (QuotationAssignConfigPO) createCriteria(QuotationAssignConfigPO.class)
            .add(Restrictions.eq("company", company))
            .add(Restrictions.eq("department", department))
            .uniqueResult();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company) {
        return createCriteria(QuotationAssignConfigPO.class)
            .add(Restrictions.eq("company", company))
            .addOrder(Order.asc("department"))
            .list();
    }

    @Override
    public boolean queryQuotationAssignConfigForEnable(int company) {
        Number count = (Number) createCriteria(QuotationAssignConfigPO.class)
            .add(Restrictions.eq("company", company))
            .add(Restrictions.eq("enabled", (short) 1))
            .add(Restrictions.eq("autoAssign", (short) 1))
            .setProjection(Projections.rowCount())
            .uniqueResult();

        return count != null && count.intValue() > 0;
    }

    /**
     * 处理筛选条件
     */
    private void queryFilterExecute(PagingQuery<?> query, Filter filter) {
        String field = filter.getField();
        String data = filter.getData();
        String op = filter.getOp();

        if ("company".equals(field)) {
            query.add(query.getCriterion(field, Integer.parseInt(data), op));
        } else if ("enabled".equals(field)) {
            query.add(query.getCriterion(field, Short.parseShort(data), op));
        } else if ("createTime".equals(field)) {
            query.timeranges("createTime", "createTime", data);
        }
    }
}
```

### 3. DAO 层核心规则总结

| 规则 | 说明 | 示例 |
|------|------|------|
| **方法参数** | 使用基本类型 | `long qacid, short enabled` |
| **分页方法** | 包含 `Paging, List<Filter>` | 三个参数 |
| **复用基础方法** | 不要重复实现已有方法 | 使用 `queryById()`, `save()`, `update()`, `delete()` |
| **查询条件** | 使用 Hibernate Criteria | `Restrictions.eq()`, `Restrictions.or()` |
| **Filter 处理** | 支持动态筛选条件 | 遍历 filters 处理 |
| **命名规范** | `query + 业务含义` | `queryQuotationAssignConfig()` |

---

## 📦 PO/VO 开发规范

### 1. PO（持久化对象）规范

#### ✅ 正确示例

```java
@Entity
@Table(name = "quotationassignconfig", catalog = "quotation")
public class QuotationAssignConfigPO implements Serializable {

    private static final long serialVersionUID = 1L;

    // ==================== 常量定义 ====================

    /**
     * 禁用状态
     */
    public static final Short ENABLED_DISABLED_INT = 0;

    /**
     * 启用状态
     */
    public static final Short ENABLED_ENABLED_INT = 1;

    /**
     * 手动分配
     */
    public static final Short AUTO_ASSIGN_MANUAL_INT = 0;

    /**
     * 自动分配
     */
    public static final Short AUTO_ASSIGN_AUTO_INT = 1;

    // ==================== 字段定义 ====================

    @Id
    @GeneratedValue
    @Column(name = "qacid", unique = true, nullable = false)
    private long qacid;

    @Column(name = "company", nullable = false)
    private int company;

    @Column(name = "department")
    private Integer department;  // ✅ NULL 表示该公司所有部门

    @Column(name = "enabled", nullable = false)
    private short enabled;

    @Column(name = "autoAssign", nullable = false)
    private short autoAssign;

    @Column(name = "createTime", nullable = false, updatable = false)
    private Timestamp createTime;

    @Column(name = "updateTime", nullable = false)
    private Timestamp updateTime;

    // ==================== Getter/Setter ====================
    // （省略）

    // ==================== 工具方法（PO 可以有） ====================

    /**
     * 判断是否启用
     *
     * @return true-启用，false-禁用
     */
    public boolean isEnabled() {
        return this.enabled == ENABLED_ENABLED_INT;
    }

    /**
     * 判断是否自动分配
     *
     * @return true-自动分配，false-手动分配
     */
    public boolean isAutoAssign() {
        return this.autoAssign == AUTO_ASSIGN_AUTO_INT;
    }
}
```

### 2. VO（值对象）规范

#### ✅ 正确示例

```java
public class QuotationAssignConfigVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // ==================== 字段定义 ====================

    /**
     * 配置ID
     */
    private Long qacid;

    /**
     * 公司ID
     */
    private Integer company;

    /**
     * 公司信息（关联对象）
     */
    private Object companyVO;

    /**
     * 部门ID（NULL表示该公司所有部门）
     */
    private Integer department;

    /**
     * 部门信息（关联对象）
     */
    private Object departmentVO;

    /**
     * 是否启用（0-禁用，1-启用）
     */
    private Short enabled;

    /**
     * 是否自动分配（0-手动，1-自动）
     */
    private Short autoAssign;

    /**
     * 创建时间
     */
    private Timestamp createTime;

    /**
     * 更新时间
     */
    private Timestamp updateTime;

    // ==================== Getter/Setter ====================
    // （只包含纯 getter/setter，无其他方法）
}
```

#### ❌ 错误示例（VO 中不要有这些）

```java
// ❌ 错误：VO 中不要有枚举转文字的方法
public String getEnabledText() {
    return enabled == 1 ? "启用" : "禁用";
}

// ❌ 错误：VO 中不要有工具方法
public boolean isEnabled() {
    return this.enabled == 1;
}

// ❌ 错误：VO 中不要有业务逻辑
public boolean canAutoAssign() {
    return this.enabled == 1 && this.autoAssign == 1;
}
```

### 3. PO/VO 核心规则总结

| 规则 | PO（持久化对象） | VO（值对象） |
|------|----------------|-------------|
| **常量定义** | ✅ 可以有 | ❌ 不需要 |
| **JPA 注解** | ✅ 需要 | ❌ 不需要 |
| **工具方法** | ✅ 可以有（如 `isEnabled()`） | ❌ 不可以有 |
| **枚举转换** | ✅ 可以有 | ❌ 不可以有（由前端处理） |
| **关联对象** | 使用 `@ManyToOne` 等 | 使用 `Object` |
| **Getter/Setter** | ✅ 必需 | ✅ 必需 |
| **其他方法** | ✅ 可以有业务方法 | ❌ 只能有 getter/setter |

**关键原则**：
- **PO**：可以包含工具方法、常量定义、业务逻辑
- **VO**：纯数据传输对象，只包含字段和 getter/setter

---

## 🎨 前端开发规范（简要说明）

### 1. API 调用规范

```javascript
// ✅ 正确：使用 com.post() 统一调用
com.post('/pageQuotationAssignConfig.do', {
    paging: paging,
    filters: filters,
    company: company
}, function(result) {
    // 处理结果
});

// ❌ 错误：不要使用 $.ajax()
$.ajax({
    url: '/pageQuotationAssignConfig.do',
    type: 'POST',
    data: {...}
});
```

### 2. 枚举值处理规范

```javascript
// ✅ 正确：使用三元运算符
var enabledText = vo.enabled == 1 ? "启用" : "禁用";
var autoAssignText = vo.autoAssign == 1 ? "自动" : "手动";

// ✅ 正确：从 ds/*.json 读取枚举定义
var enabledText = constant.quotationAssign().enabled.datas[vo.enabled];

// ❌ 错误：不要在后端转换
// VO.getEnabledText()  // ❌ 后端不要提供此方法
```

---

## 🔍 代码审查检查清单

### Action 层

- [ ] 字段是否使用完整对象名（如 `quotationAssignConfig`）？
- [ ] 方法是否直接传递 VO 对象给 Service？
- [ ] 是否使用 `getFilters()` 获取筛选条件？
- [ ] 是否使用 `queryCompany()` 获取公司ID？
- [ ] 是否没有手动 `getLong()` 提取参数？
- [ ] 是否没有手动 `new VO()` 对象？
- [ ] 是否没有不必要的 try-catch？

### Service 层

- [ ] 方法参数是否统一使用 VO 对象？
- [ ] 分页方法是否包含 `Paging, List<Filter>, Integer` 三个参数？
- [ ] 是否从 VO 中提取属性传递给 DAO？
- [ ] 是否包含业务校验（如唯一性）？
- [ ] 是否包含 PO ↔ VO 转换？
- [ ] 是否填充关联数据（如 companyVO）？
- [ ] 是否使用 `@Transactional` 注解？

### DAO 层

- [ ] 方法参数是否使用基本类型？
- [ ] 分页方法是否包含 `Paging, List<Filter>`？
- [ ] 是否没有重复实现基础 DAO 的方法（如 delete, update）？
- [ ] 是否使用 Hibernate Criteria？
- [ ] 是否支持 Filter 动态筛选？

### VO/PO

- [ ] VO 中是否没有枚举转文字的方法？
- [ ] VO 中是否没有工具方法（如 `isEnabled()`）？
- [ ] PO 中是否包含常量定义？
- [ ] PO 中是否包含工具方法？

---

## 📖 参考示例

### 完整的三层调用流程示例

#### 1. Action 层

```java
@Action(value = "updateQuotationAssignConfigForStatus", results = {
    @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
}, params = { "contentType", "text/html" })
public String updateQuotationAssignConfigForStatus() throws FLException {
    // ✅ 直接传递 VO 对象
    quotationAssignConfigService.updateQuotationAssignConfigForStatus(quotationAssignConfig);
    return SUCCESS;
}
```

#### 2. Service 层

```java
@Override
@Transactional(rollbackFor = Exception.class)
public int updateQuotationAssignConfigForStatus(
    QuotationAssignConfigVO quotationAssignConfigVO
) throws FLException {
    // ✅ 从 VO 提取属性
    long qacid = quotationAssignConfigVO.getQacid();
    short enabled = quotationAssignConfigVO.getEnabled();

    // ✅ 调用 DAO 更新（使用基础 DAO 的 update 方法）
    QuotationAssignConfigPO po = new QuotationAssignConfigPO();
    po.setQacid(qacid);
    po.setEnabled(enabled);

    quotationAssignConfigDao.update(po);

    return 1;
}
```

#### 3. 前端调用

```javascript
// 前端：设置 VO 对象的值
var config = {
    qacid: selectedId,
    enabled: 1  // 0-禁用，1-启用
};

// 调用接口
com.post('/updateQuotationAssignConfigForStatus.do', config, function(result) {
    com.showAlert('操作成功');
    // 刷新列表
    loadConfigList();
});
```

---

## 📝 附录：常见错误对照表

| 错误类型 | 错误代码 | 正确代码 |
|---------|---------|---------|
| **字段命名** | `private ConfigVO config;` | `private QuotationAssignConfigVO quotationAssignConfig;` |
| **参数提取** | `long id = getLong("id");` | 让 Struts2 自动填充 VO |
| **手动封装** | `ConfigVO vo = new ConfigVO();` | 直接使用注入的 VO |
| **参数不统一** | `service.delete(long id)` | `service.delete(ConfigVO vo)` |
| **过度封装** | `dao.deleteXxx(long id)` | 使用 `dao.delete(po)` |
| **VO 工具方法** | `vo.getEnabledText()` | 前端用三元运算符 |
| **异常处理** | `try {...} catch (e) {}` | 让框架处理 |
| **缺少 Filter** | `page(Paging, Integer)` | `page(Paging, List<Filter>, Integer)` |

---

## 🎓 学习建议

1. **阅读现有代码**：参考 `quotation`、`decoration` 等模块的实现
2. **遵循本规范**：严格按照本规范进行开发
3. **代码审查**：使用检查清单进行自我审查
4. **持续改进**：根据实际情况补充完善本规范

---

**文档维护**：
- 本文档应随着项目发展持续更新
- 发现新的规范或错误时，及时更新本文档
- 所有开发人员都有责任维护本文档的准确性

**版本历史**：
- v1.0 (2026-03-19): 初始版本，基于 QuotationAssign 模块开发经验
