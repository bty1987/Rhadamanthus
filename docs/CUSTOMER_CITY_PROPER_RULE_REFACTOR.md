# CustomerCityRule 重命名总结文档

> 日期：2026-03-15
> 目的：将 CustomerCityRule 重命名为 CustomerCityProperRule，消除命名歧义

---

## 一、重命名原因

### 问题分析
- **原命名**：`CustomerCityRule` 容易误解为"城市规则"
- **实际含义**：该实体管理的是"城区规则"（cityproper = 城区）
- **命名冲突**：
  - `city` 通常指城市（主键 `cid`）
  - `cityproper` 才是指城区（主键 `cpid`）

### 解决方案
统一命名为 `CustomerCityProperRule`，明确表示这是城区规则。

---

## 二、数据库变更

### 表重命名
```sql
-- 原表名
customercityrule

-- 新表名
customercityproperrule
```

### 执行脚本
文件位置：`sql/rename_customercityrule_to_customercityproperrule.sql`

```bash
# 执行方式
mysql -u username -p customer < sql/rename_customercityrule_to_customercityproperrule.sql
```

### 表结构
```
ccrid          BIGINT(20)    主键
cpid           INT(11)       城区ID（关联cityproper.cpid）
cid            INT(11)       公司ID
did            INT(11)       部门ID
uid            INT(11)       用户ID
type           SMALLINT(6)   规则类型（0=公司, 1=部门, 2=设计师）
priority       SMALLINT(6)   优先级
status         SMALLINT(6)   状态（0=启用, 1=禁用）
company        INT(11)       公司ID（外键）
createruid     INT(11)       创建人
createTime     TIMESTAMP     创建时间
updateruid     INT(11)       更新人
updateTime     TIMESTAMP     更新时间
finishTime     TIMESTAMP     完成时间
comment        VARCHAR(500)  备注
```

---

## 三、后端代码变更

### 1. PO 实体类

| 原文件 | 新文件 | 状态 |
|-------|-------|------|
| `CustomerCityRulePO.java` | `CustomerCityProperRulePO.java` | ✅ 已创建 |

**关键变更**：
- `@Table(name = "customercityproperrule")`
- 类名：`CustomerCityRulePO` → `CustomerCityProperRulePO`
- 保持字段名不变（`cpid`, `type` 等）

### 2. VO 值对象类

| 原文件 | 新文件 | 状态 |
|-------|-------|------|
| `CustomerCityRuleVO.java` | `CustomerCityProperRuleVO.java` | ✅ 已创建 |

### 3. DAO 接口和实现

| 原文件 | 新文件 | 状态 |
|-------|-------|------|
| `CustomerCityRuleDao.java` | `CustomerCityProperRuleDao.java` | ✅ 已创建 |
| `CustomerCityRuleDaoImpl.java` | `CustomerCityProperRuleDaoImpl.java` | ✅ 已创建 |

**方法重命名**：
- `pageCustomerCityRule()` → `pageCustomerCityProperRule()`
- `queryCustomerCityRule()` → `queryCustomerCityProperRule()`
- `queryCustomerCityRuleByType()` → `queryCustomerCityProperRuleByType()`

**参数名调整**：
- `cityid` → `cpid` (明确表示城区ID)

### 4. Service 层

#### 4.1 新建文件

| 文件 | 说明 |
|------|------|
| `CustomerCityProperRuleService.java` | 服务接口 |
| `CustomerCityProperRuleServiceImpl.java` | 服务实现 |

**核心方法**：
```java
// 分页查询
void pageCustomerCityProperRule(Paging paging, List<Filter> filters, int company);

// 条件查询
List<CustomerCityProperRuleVO> queryCustomerCityProperRule(...);

// 新增规则
void addCustomerCityProperRule(CustomerCityProperRuleVO vo, String userId, int company);

// 删除规则
void deleteCustomerCityProperRule(CustomerCityProperRuleVO vo);

// 更新规则
void updateCustomerCityProperRule(CustomerCityProperRuleVO vo);
```

#### 4.2 更新现有文件

**文件**：`CustomerCompanyRuleServiceImpl.java`

**变更内容**：
```java
// 导入更新
-import com.fanglin.customer.dao.CustomerCityRuleDao;
-import com.fanglin.customer.po.CustomerCityRulePO;
+import com.fanglin.customer.dao.CustomerCityProperRuleDao;
+import com.fanglin.customer.po.CustomerCityProperRulePO;

// 依赖注入更新
-@Autowired
-private CustomerCityRuleDao customerCityRuleDao;
+@Autowired
+private CustomerCityProperRuleDao customerCityProperRuleDao;

// 方法调用更新
-List<CustomerCityRulePO> cityRules = customerCityRuleDao.queryCustomerCityRuleByType(...);
+List<CustomerCityProperRulePO> cityRules = customerCityProperRuleDao.queryCustomerCityProperRuleByType(...);
```

### 5. Action 控制器

| 文件 | 说明 | 状态 |
|------|------|------|
| `CustomerCityProperRuleAction.java` | Struts2 Action | ✅ 已创建 |

**请求映射**：
```
POST /pageCustomerCityProperRule.do       - 分页查询
POST /queryCustomerCityProperRule.do      - 条件查询
POST /addCustomerCityProperRule.do        - 新增规则
POST /deleteCustomerCityProperRule.do     - 删除规则
POST /updateCustomerCityProperRule.do     - 更新规则
```

---

## 四、前端代码变更

### 1. HTML 页面

| 文件 | 路径 | 说明 | 状态 |
|------|------|------|------|
| `customerCityProperRule.html` | `WebContent/views/customer/` | 管理页面 | ✅ 已创建 |

**页面功能**：
- ✅ 三种规则类型管理（城区→公司、城区→部门、城区→设计师）
- ✅ 级联选择：城市 → 城区
- ✅ 动态表单：根据类型显示对应字段
- ✅ 列表展示：支持分页、排序、删除
- ✅ 弹窗表单：添加/编辑规则

### 2. JavaScript 文件

| 文件 | 路径 | 说明 | 状态 |
|------|------|------|------|
| `customerCityProperRule.js` | `WebContent/js/customer/` | 业务逻辑 | ✅ 已创建 |

**核心功能**：
```javascript
// 规则类型
TYPE_COMPANY_INT = 0;  // 城区→公司
TYPE_DEPT_INT = 1;     // 城区→部门
TYPE_USER_INT = 2;     // 城区→设计师

// 级联选择
citySel.change() → queryCityProperByCid() → 更新 cityProperSel

// 类型切换
type.change() → 显示/隐藏对应字段（targetCompany/dept/user）
```

### 3. API 定义

**文件**：`WebContent/js/api/customer.js`

**新增接口**：
```javascript
// 页面路由
customerCityProperRule: {
    url: "/views/customer/customerCityProperRule.html"
}

// API 接口
pageCustomerCityProperRule: {
    url: "pageCustomerCityProperRule.do",
    type: "query"
},
queryCustomerCityProperRule: {
    url: "queryCustomerCityProperRule.do",
    type: "query"
},
addCustomerCityProperRule: {
    url: "addCustomerCityProperRule.do",
    type: "update"
},
deleteCustomerCityProperRule: {
    url: "deleteCustomerCityProperRule.do",
    type: "update"
},
updateCustomerCityProperRule: {
    url: "updateCustomerCityProperRule.do",
    type: "update"
}
```

---

## 五、功能特性

### 1. 规则类型

| 类型值 | 名称 | 说明 | 目标字段 |
|-------|------|------|---------|
| 0 | 城区→公司 | 根据城区分配公司 | targetCompany.cid |
| 1 | 城区→部门 | 根据城区分配部门 | department.did |
| 2 | 城区→设计师 | 根据城区分配设计师 | user.uid |

### 2. 级联选择

```
用户选择城市（citySel）
    ↓
触发 change 事件
    ↓
调用 api.system.queryCityProperByCid
    ↓
更新城区下拉框（cityProperSel）
    ↓
用户选择城区
    ↓
提交 cpid（城区ID）
```

### 3. 动态表单

根据规则类型显示不同字段：
- **TYPE_COMPANY_INT**：显示"目标公司"下拉框
- **TYPE_DEPT_INT**：显示"部门"下拉框
- **TYPE_USER_INT**：显示"设计师"下拉框

---

## 六、文件清单

### 新建文件（11个）

```
数据库脚本：
1. sql/rename_customercityrule_to_customercityproperrule.sql

后端代码：
2. src/com/fanglin/customer/po/CustomerCityProperRulePO.java
3. src/com/fanglin/customer/vo/CustomerCityProperRuleVO.java
4. src/com/fanglin/customer/dao/CustomerCityProperRuleDao.java
5. src/com/fanglin/customer/dao/impl/CustomerCityProperRuleDaoImpl.java
6. src/com/fanglin/customer/service/CustomerCityProperRuleService.java
7. src/com/fanglin/customer/service/impl/CustomerCityProperRuleServiceImpl.java
8. src/com/fanglin/customer/action/CustomerCityProperRuleAction.java

前端代码：
9. WebContent/views/customer/customerCityProperRule.html
10. WebContent/js/customer/customerCityProperRule.js

API定义：
11. WebContent/js/api/customer.js (更新)
```

### 更新文件（1个）

```
1. src/com/fanglin/customer/service/impl/CustomerCompanyRuleServiceImpl.java
   - 导入语句更新
   - 依赖注入更新
   - 方法调用更新
```

### 待删除文件（4个）⚠️

**建议保留旧文件作为参考，测试通过后再删除**：

```
1. src/com/fanglin/customer/po/CustomerCityRulePO.java
2. src/com/fanglin/customer/vo/CustomerCityRuleVO.java
3. src/com/fanglin/customer/dao/CustomerCityRuleDao.java
4. src/com/fanglin/customer/dao/impl/CustomerCityRuleDaoImpl.java
```

---

## 七、部署步骤

### 步骤1：执行数据库脚本
```bash
# 生产环境
D:/Python/Python38/python.exe .claude/skills/simple_query.py prod "source sql/rename_customercityrule_to_customercityproperrule.sql"

# 测试环境
D:/Python/Python38/python.exe .claude/skills/simple_query.py test "source sql/rename_customercityrule_to_customercityproperrule.sql"
```

### 步骤2：编译Java代码
```bash
# 使用 Eclipse 或 Maven 编译
# 确保所有新文件都被编译
```

### 步骤3：部署到服务器
```bash
# 1. 备份当前版本
# 2. 停止 Tomcat
# 3. 部署新版本
# 4. 启动 Tomcat
# 5. 检查日志
```

### 步骤4：验证功能
1. 访问 `/views/customer/customerCityProperRule.html`
2. 测试三种规则类型的添加
3. 测试城市→城区级联选择
4. 测试列表查询、删除功能
5. 验证 `CustomerCompanyRuleServiceImpl` 中的引用是否正常

---

## 八、测试检查清单

### 数据库测试
- [ ] 表名已正确重命名为 `customercityproperrule`
- [ ] 表结构完整，所有字段存在
- [ ] 历史数据迁移正确

### 后端测试
- [ ] PO 类编译通过，可正常映射数据库
- [ ] DAO 查询功能正常（分页、条件查询）
- [ ] Service CRUD 功能正常
- [ ] Action 请求响应正确
- [ ] `CustomerCompanyRuleServiceImpl` 引用正常

### 前端测试
- [ ] 页面加载正常
- [ ] 规则类型切换正常
- [ ] 城市→城区级联选择正常
- [ ] 表单验证功能正常
- [ ] 列表查询、分页正常
- [ ] 添加、删除功能正常

### 集成测试
- [ ] 城区规则在 `CustomerCompanyRule` 中正确应用
- [ ] 城区→公司规则正常过滤
- [ ] 优先级排序正确

---

## 九、注意事项

### 1. 命名规范
- ✅ **正确**：`CustomerCityProperRule`（城区规则）
- ❌ **错误**：`CustomerCityRule`（易误解为城市规则）
- ✅ **正确**：`cpid`（城区ID，关联 cityproper.cpid）
- ❌ **错误**：`cityid`（易误解为城市ID）

### 2. 参数传递
```java
// ✅ 正确：使用 cpid
queryCustomerCityProperRule(Integer cpid, int company)

// ❌ 错误：使用 cityid（已废弃）
queryCustomerCityRule(Integer cityid, int company)
```

### 3. 向后兼容
- 旧代码中的 `customerCityRuleDao` 引用已更新
- 建议测试通过后再删除旧文件
- 如有其他模块引用旧类名，需要同步更新

### 4. 前端集成
- 确保页面路由已添加到导航菜单（数据库配置）
- 确保用户权限配置正确
- 测试与其他规则模块的交互

---

## 十、相关文档

- [客户管理模块文档](../src/com/fanglin/customer/CLAUDE.md)
- [前端架构文档](../WebContent/CLAUDE.md)
- [API接口文档](../docs/API.md)
- [数据库设计文档](../db/README.md)

---

**变更完成日期**：2026-03-15
**文档版本**：v1.0
**维护者**：Claude Code AI
