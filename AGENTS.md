# Rhadamanthus - Agents开发指南

> 本文件为AI Agent提供的开发规范与命令指南

---

## 构建与测试

### Maven命令
```bash
mvn clean compile              # 编译项目
mvn clean package              # 打包项目
mvn dependency:copy-dependencies # 复制依赖到WEB-INF/lib
mvn clean package -DskipTests  # 跳过测试构建
```

### 测试
项目无完整测试套件，仅在 `src/com/fanglin/swiftpass/airpos/Test.java` 发现测试文件。

运行单个测试：`mvn test -Dtest=ClassName`
运行所有测试：`mvn test`

---

## 代码风格规范

### Java后端规范

#### 包结构
```
com.fanglin.[模块名]/
├── action/          # Struts2控制器
├── service/impl/    # 业务实现
├── dao/impl/        # 数据访问实现
├── po/              # Hibernate实体
└── vo/              # 视图对象
```

#### 命名约定
- Action: `XxxAction.java` - 继承 `BaseAction`/`BaseListAction`
- Service: `XxxService.java` / `XxxServiceImpl.java`
- DAO: `XxxDao.java` / `XxxDaoImpl.java`
- PO: `XxxPO.java` - Hibernate实体
- VO: `XxxVO.java` - 传输对象

#### 注解规范
```java
@ParentPackage("base")
@Namespace("/")
@Controller
public class XxxAction extends BaseListAction {
    @Action(value = "methodName", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String methodName() throws FLException { }
}

@Service
public class XxxServiceImpl implements XxxService {
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void method(XxxVO vo) { }
}

@Repository("xxxDao")
public class XxxDaoImpl extends DaoImpl<XxxPO> implements XxxDao {
    public XxxDaoImpl() { super(XxxPO.class); }
}

@Entity
@Table(name = "table_name", catalog = "schema_name")
public class XxxPO implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") private Long id;
}
```

#### 导入顺序
1. `java.*` 标准库
2. `javax.*` 扩展库
3. 第三方库 (org.*, com.*)
4. 项目内部导入 (`com.fanglin.*`)

#### 分层调用规范
```
Action层 → 传递VO对象 → Service层 → 提取属性 → 传递基本类型 → DAO层
```

#### 异常处理与日志
```java
throw new FLException("错误信息");
@Transactional(rollbackFor = Exception.class)
LogUtils.log(userId, "操作描述", "操作模块", 对象ID);
```

#### 🔴 方法命名规范（强约束）
骨架：`动词 + 对象 + [By条件] + [For目的/范围]`
- **CRUD动词**：`query`(单条/列表) / `page`(分页) / `add` / `update` / `delete` / `get` / `count` / `amount`
- **🔴 page vs query 硬规则**：`page` 必须返回分页结构，`query` 不分页，禁止混用
- **By条件**：取字段名带Id后缀（`ByOrderId`/`ByAId`/`ByOrderIds`），不要自然语言,不要用And拼接多条件(用VO传参)
- **For目的**：范围/场景/角色/状态（`ForBalance`/`ForDeposit`/`ForPlatforPm`/`ForEnable`），与By条件区分
- **业务动词**(CRUD表达不了时用)：`submit`/`confirm`/`cancel`/`sign`/`approve`/`affirm`/`enable`/`disable`/`bind`/`lock`/`reset` 等
- **三层同名**：Action/Service/DAO 同一操作方法名保持一致
- 示例：`queryDecorationByOrderId`、`pageSalesForBalanceByCompany`、`cancelMaterialPaymentForDeposit`
- 详见：`docs/10-指南手册/METHOD_NAMING_CONVENTION.md`（含2963个方法名统计、动词频次表、缩写表）

### JavaScript前端规范

#### 文件组织
- 页面: `WebContent/views/[模块]/[页面名].html`
- 脚本: `WebContent/js/[模块]/[页面名].js`
- API定义: `WebContent/js/api/[模块].js`

#### 核心对象使用
```javascript
com.api.decoration.method(params, callback);
com.condition.decoration.show(params);
com.validator.validate(form, rules);
com.printer.print(printData);
com.exporter.export(data, filename);
```

#### 模块化命名
- 页面脚本: `[模块名][业务功能].js`
- 工具脚本: `[模块名]Utils.js`
- 条件组件: `[模块名].js` (js/condition/目录)

---

## 重要开发原则

### 🔴 Git 提交规则（默认）
- **默认直接在 `master` 分支上工作并提交**，无需新建分支，除非用户明确要求走分支/PR 流程。
- 用户说"提交并推送"时，直接 `git add` + `git commit` + `git push origin master`，不要先创建分支。
- 仅当用户明确要求"建分支""发 PR""走 review"等，才按分支流程操作。
- 提交前先 `git status` 核对暂存内容，**只纳入本次任务相关的文件**，不要把工作区遗留的 untracked 目录（如 `.agents/`、`project-libs/`）误带入提交。

### 🔴 直接修改原则
修改现有功能必须直接修改原文件，禁止创建新文件实现相同功能。

### 安全规范
- **手机号加密**: 使用 `AESHelper.encrypt()` 加密存储
- **SQL注入防护**: 必须使用参数化查询，禁止字符串拼接
- **权限验证**: 所有接口需验证用户登录状态和操作权限

### 事务管理
- Service层方法必须添加 `@Transactional(rollbackFor = Exception.class)`
- 事务范围尽可能短，避免在事务中进行网络调用

### 工具类优先级
优先使用 `com.fanglin.utils` 包：
- `DateUtil` - 日期处理
- `PoiExcelUtil` - Excel导入导出
- `HttpHelper` - HTTP请求
- `Arith` - 精确数学运算
- `Base64Util` - Base64工具

---

## 数据库操作规范

### 参数化查询
```java
// ✅ 正确
String hql = "from XxxPO where name = :name";
session.createQuery(hql).setParameter("name", name).list();

// ❌ 错误
String hql = "from XxxPO where name = '" + name + "'";
```

### 分页查询
```java
PagingQuery<XxxPO> query = pagingQuery(paging, XxxPO.class);
query.add(query.getCriterion("field", value, "eq"));
query.add(query.getCriterion("otherField", value, "like")).desc("id");
return query.list();
```

---

## 配置文件与路径

| 类型 | 路径 |
|-----|------|
| Spring配置 | `conf/ApplicationContext.xml` |
| Struts路由 | `conf/struts.xml` |
| 数据库配置 | `conf/jdbc.properties` |
| 系统参数 | `conf/sysconfig.properties` |
| Maven配置 | `pom.xml` |

### 常用模块路径
- 装饰订单: `src/com/fanglin/decoration/`
- 报价管理: `src/com/fanglin/quotation/`
- 施工管理: `src/com/fanglin/construction/`
- 财务结算: `src/com/fanglin/balance/`
- 主材销售: `src/com/fanglin/sales/`
- 核心组件: `src/com/fanglin/core/`
- 工具类: `src/com/fanglin/utils/`

---

## 参考文档

- **项目知识库**: `docs/KNOWLEDGE_BASE.md` (AI每次对话自动参考)
- **前端架构**: `WebContent/CLAUDE.md`
- **模块文档**: 各模块目录下的 `CLAUDE.md`
- **方法命名规范**: `docs/10-指南手册/METHOD_NAMING_CONVENTION.md` (新增方法/接口必须遵守)
- **Operation收集关闸SOP**: `docs/10-指南手册/OPERATION_COLLECT_CUTOVER_SOP.md`

---

## 版本

- Java: 1.8
- Spring: 4.3.17.RELEASE
- Struts2: 2.5.16
- Hibernate: 3.6.10.Final
- MySQL: 5.x
- Maven: 3.x
