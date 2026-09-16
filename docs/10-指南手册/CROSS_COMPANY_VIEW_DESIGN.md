# 跨公司数据查看授权方案（Cross Company View）

> 状态：**定稿 v2 → 数据源复议中，未实施**（2026-09-16 方案分析 + 四项拍板；同日提出复用 usercompany 替代新建表，分析见 §2.7）
> 需求：指定登录人员**不切换公司**，在**原有功能页面**上直接查看其它公司的数据；
> 业务面覆盖 decoration / payment / sales 等，分批实现；
> 子场景：issueCustomerSource 的人员候选查询结合同一授权结构放开跨公司。
> 性质：**只读放行**（查看），写操作路径不放宽。
>
> **四项拍板（2026-09-16）**：① 授权粒度 = **用户级**；② 范围 = **指定公司集合**（非全部放开）；
> ③ decoration 批次 = **全部锁公司页面**；④ 授权管理 = **做管理页面**（非纯 SQL）。
> **复议中（§2.7）**：⑤ 范围数据源 = 新建 crosscompanyright（A案） vs 复用 usercompany（B/B+案，推荐B+）。

---

## 1. 现状分析（代码 + 生产只读库双重核实，2026-09-16）

### 1.1 公司隔离机制：没有统一注入点

- company 值只有两个来源入口：
  - `BaseAction.queryCompany()`（`src/com/fanglin/core/action/BaseAction.java:109-127`，从加密认证串解出，未登录返回 0）——全库 693 处调用 / 256 个文件；
  - `authentication().getCompany()`（`core/vo/Authentication.java:96`，登录时由 `LoginAction.java:190` 写入认证串）。
- 过滤条件本身是各业务 DAO/Service **手写**的，两种形态：
  - DAO 直写：`query.getCriterion("company", company, "eq")`（44 处）+ `Restrictions.eq("company"/COLUMN_COMPANY_STR, ...)`（329 处）；
  - VO 转 Filter（payment 特例）：`PaymentVO.filter()`（`payment/vo/PaymentVO.java:364-379`）——**仅当前端传了 `payment.company` 才追加 company eq，且值强制取登录公司**（Service 传入的 `company` 参数，而非 VO 值）。
- 基类（`BaseListAction` / `GenericDaoImpl` / `PagingQuery`）对 company **零感知**，不存在 Hibernate filter/拦截器式的中央注入点。

### 1.2 项目既有的三种"放行全部"惯例（本方案的地基）

| 惯例 | 代表代码 | 说明 |
|---|---|---|
| `company == null` → DAO 跳过过滤 | `DecorationDaoImpl.java:42-44`、`DepartmentDaoImpl.java:58-61`、`CustomerUserRuleDaoImpl.java:56-58` | 主流惯例 |
| `company == 0`（总部 TYPE_HEADQUARTER）→ 跳过 | `CustomerAfterSalesDaoImpl.java:29-31` 等 customer 模块 | 仅个别模块，未推广 |
| `multicompany` 文件开关 | `utils/SystemConfig` 读 `/sysconfig.properties`；`CustomerUserRuleServiceImpl.java:113-115` 等 | =0（单公司模式）时人员/客户/楼盘等查询置 null 放开；**仓库 `conf/sysconfig.properties` 无此键 → 默认放开**；🔴生产该文件的实际值需上线前核实 |

### 1.3 decoration 已存在"跨公司页面"先例（集团页面）

最重要的现状事实：**跨公司查看在装修单模块已经有成熟先例**，只是形态是"专用集团页面 + 菜单授权"，不是"原有页面按人放开"。

链路（生产实证）：

1. 页面配置：`decorationfunctionright`（platform 库，**按公司**配置，`DecorationFunctionRightDaoImpl.java:22` 严格 `eq("company", 登录公司)`）× `decorationfunction`（decoration 库，功能项）；
2. 前端 `decorationPageUtils.js:738-809` 按 URL 参数 `depage` 拉取配置（apiPage / condArr / pageBtn / extraParam / propertyArr）；
3. **生产 95 家公司**的 `streamlinedBusiness` / `streamlinedDesign` 两页面全部配置了 `companyType=0`（生产库核实，且**没有任何页面配置非 0 值**）；
4. 前端把它作为请求参数发出（`decoration.js:3100-3102`）→ `DecorationServiceImpl.java:226`：`companyType==0/null → company=null` → `DecorationDaoImpl.pageDecoration:42-44` 跳过过滤 → **查全部公司**；
5. 配套的跨公司候选条件 `decoration-cross-company-sales-region/dept`（`js/condition/decoration.js:336-415`）：`queryDepartmentByName` 传 `dept.company=0` → `DepartmentServiceImpl.java:168-186` 置 null 不过滤 → 部门候选跨全集团；
6. 菜单：`communion.module` mid=334/335（"装修单-通用-设计/业务"），rolemodule 授权 company=1 有 9 个管理角色（总经理/事业部总监/市场总监/系统管理员等），各公司约 32 个角色。

**结论**：后端放行能力与前端页面配置机制都已存在且在生产运行多年。本方案与该先例的差异：先例是"专用集团页 + 角色菜单授权 + 全部公司"；本方案是"**原有页面 + 用户级授权 + 指定公司集合**"（in 钳制而非 null 放开）。

### 1.4 payment / sales 现状

- **payment**：`PaymentAction → PaymentServiceImpl.java:128-146 → PaymentVO.filter`（见 1.1）。前端唯一的公司入参是 URL `depage` → `payment.company` extraParam（`js/payment/payment.js:685-687`）。条件组件 `js/condition/payment.js` **无公司条件**。
- **sales**：`SalesDaoImpl.java:30` 硬 `eq`（`pageSalesForAdvance/Balance` 同），前端无公司条件、无 depage 机制。
- VO 侧：`DecorationVO.company`（Integer，`DecorationVO.java:141`）可直供公司列显示；`PaymentVO.company` 是 String（`:87`，用途存疑）、`SalesVO` 未核实——**各批次需盘点 VO 是否透传 company**。

### 1.5 issueCustomerSource 链路（子场景）

- 主链路：`CustomerSourceAction.java:98-104` → `CustomerSourceServiceImpl.issueCustomerSource:496-859`，四分支（auto :567 / region :702 / dept :748 / user :802）。
- **人员分支候选查询**（本场景核心）：前端 typeahead（`js/customer/customerSource.js:491、1049`）→ `queryCustomerUserRuleByPinyin`：
  - `CustomerUserRuleAction.java:63` **硬编码 `queryCompany()`，前端无法传公司**；
  - `CustomerUserRuleServiceImpl.java:113-115`：`multicompany==0 → company=null`（文件开关，仓库当前=放开）；
  - `CustomerUserRuleDaoImpl.java:52-102`：两处 company 条件（:56-58 主过滤、:95-96 排除 ADVANCE_INVALID 的子查询）目前是 null 保护的 `Integer` 单值形态。
- 分区/部门分支候选：`queryDepartment` 可随页面公司下拉（加密 cid）切换（`DepartmentAction.java:57`：前端传了就用，否则退回登录公司）。
- **不一致点**：人员分支不跟随页面公司下拉。
- 落库：`chance.company` 四分支均取**目标对象自身**的 company（region/dept/belonger），与传参无关——即**跨公司分配本身天然支持**，瓶颈只在候选查询。
- 🔴上线前核实：生产 `sysconfig.properties` 的 `multicompany` 键值。若=1（隔离开），人员候选现状锁本公司，与用户感知一致；若未设（同仓库），现状其实已放开，本场景只剩"判权可控化"的意义。

### 1.6 管理页面样板（usercompany 授权块）

- 后端：`personel/action/UserCompanyAction.java:35-52` 三接口 `queryUserCompany / queryUserCompanyForSelf / updateUserCompany`；
- 前端：`WebContent/views/personnel/user.html` + `js/personnel/user.js`（:1009 回显授权、:1850 数组保存 `companys[i].cid`、:1949-1954 组装参数）——用户管理对话框内的公司多选授权块。
- 新接口无需手工登记 operation：按 `OPERATION_COLLECT_CUTOVER_SOP.md`，AccessInterceptor 自动补全（through=1 放行），后续关闸时再配 roleoperation。

---

## 2. 方案设计（定稿）

### 2.1 授权模型：用户级"跨公司查看权"（right 家族新表）

落 `com.fanglin.right`（platform 库）——业务模块已依赖该包（`DecorationServiceImpl.java:95-100` 已 import 三个 right DAO），不引入新的 jar 依赖方向。

```sql
CREATE TABLE `platform`.`crosscompanyright` (
  `ucrid`     int(11) NOT NULL AUTO_INCREMENT,
  `uid`       int(11) NOT NULL,
  `module`    varchar(20) NOT NULL DEFAULT '',  -- 'customer'/'decoration'/'payment'/'sales'...
  `cids`      varchar(1000) NOT NULL DEFAULT '',-- 逗号分隔公司cid集合；非空校验
  `status`    tinyint NOT NULL DEFAULT 0,
  `cuid`      int(11) NOT NULL DEFAULT 0,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`ucrid`),
  UNIQUE KEY `uk_uid_module` (`uid`,`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

- **粒度（拍板①）**：用户 × 模块 × 公司集合。
- **范围语义（拍板②）**：`cids` 为**指定公司集合**，**不含"全部公司"哨兵**——要近似全部就列全。生效口径：
  - **可见集合 = 本公司 ∪ cids**（授权只做加法，绝不减掉本公司，否则用户会失去原有数据）；
  - 无授权行 → 可见集合 = {本公司}，与今天逐字节等价（零配置等价）；
  - 查询落点：集合大小为 1 → 维持现状 `eq`；≥2 → `in` 集合（`PagingQuery.getCriterion(..., "in")` 已支持 List，`GenericDaoImpl.java:212-213`）。
- **限损特性**：指定集合天然比"全部放开"收敛，授权面即暴露面。

### 2.2 判权服务与管理接口

`com.fanglin.right` 新增 `CrossCompanyRightPO / CrossCompanyRightDao / CrossCompanyRightService`（三层同名，方法命名守规范）：

**消费侧（业务模块一行接入）：**

```java
// 业务 Service 读方法内的标准替换形态（示意，非实施代码）
// 返回值恒 ≥1 元素且必含本公司：无授权=[own]，有授权=[own, cids...]
List<Integer> companys = crossCompanyRightService.queryCompanysForView(userPO.getUid(), authentication.getCompany(), "payment");
```

- `queryCompanysForView(uid, ownCompany, module)`：唯一索引一次查询，把"并集 + 去重 + 排序"收在 right 服务内，业务层不再分支。
- 表极小（预期几十行内），逐请求一次查询可接受；性能敏感后再考虑进程内缓存。

**管理侧（拍板④，参考 usercompany 样板 §1.6）：**

- `CrossCompanyRightAction`：`queryCrossCompanyRightByUid`（回显）/ `updateCrossCompanyRight`（全量覆盖式保存，同 `updateUserCompany` 模式），分页浏览 `pageCrossCompanyRight` 可选；
- 前端：**挂在用户管理页 `user.html` / `user.js` 对话框内**（用户编辑时配置"跨公司查看"块：模块 × 公司多选）——**复用既有菜单，无需新菜单 SQL**；
- 授权变更即时生效（无缓存依赖），保存后该用户下一次查询即按新集合钳制。

### 2.3 业务模块统一改造套路（每批次复制）

1. **Service 读方法入口**：`authentication.getCompany()` / `queryCompany()` 的实参换成 `queryCompanysForView(...)` 结果（List）。**只动查询方法，不动写方法**（add/update/submit/confirm/cancel 等里面的 company 仍取登录公司）。
2. **DAO 对应方法**：`Integer company` 参数改 `List<Integer> companys`，内部 `size()==1 ? eq : in`；逐方法盘点形成批次清单。
   - 🔴 **payment 特例**：`PaymentVO.filter` 走 Filter 机制，而 Filter 的 List 构造器只支持 `List<Short>`（`core/vo/Filter.java:63-78`），**不能承载 `List<Integer>`**——payment 的集合钳制必须下推到 `PaymentDaoImpl` 直加 criterion，不经过 Filter。
3. **🔴 跨公司视图下"个人范围权限"不收窄（重要设计点）**：decoration 多个页方法在 company 之外还叠加 uid+本公司的范围权限（`pageDecorationForCommon:274-300` 的设计部/状态 right，Designer/Salesman 族的部门 right）。这些 right 行只存在于本公司维度，若继续套用会把其它公司的数据**误杀**（其它公司的单子不在本公司部门 id 集合里）。规则：**可见集合 >1 时，跳过个人范围权限收窄，等同 `DEPARTMENT_ALL_ENABLE_INT` / `STATUS_ALL_ENABLE_INT` 语义（集团全量视图）**；集合 =1（即无授权）时一切照旧。
4. **前端**：页面 init 拉一次权限（新接口返回授权公司集合，dict-fetch-at-init 惯例）；有权 →
   - 列表加"公司"列（VO 缺 company 透传的补上，DecorationVO 已有）；
   - 公司筛选条件下拉**只列授权范围内的公司**（本公司+授权集，选项来自权限接口返回；**后端 in 钳制是安全边界**，前端选项只是体验收敛——即使绕过前端传其它公司，后端也查不到）；
   - 无权 → 页面与今天逐字节等价。
   - decoration 已有现成 `company` 条件定义（`js/condition/decoration.js:679`，需改为选项来自权限接口）；payment/sales 需新增条件定义。
5. **批次审计三件**：详情接口是否查公司（跨公司行点详情会不会抛"不存在"）/ 导出链路是否复制了同样的过滤 / 写按钮在跨公司行上的暴露登记。

### 2.4 issueCustomerSource 改造（试点）

- `CustomerUserRuleAction.java:63`：`queryCompany()` → `queryCompanysForView(uid, queryCompany(), "customer")`；
- DAO `queryCustomerUserRuleByPinyin`：`Integer company` → `List<Integer> companys`，两处条件同步改（:56-58 主过滤 eq→in；:95-96 排除 ADVANCE_INVALID 的 sqlRestriction 增加 `cur.company in (...)` 变体，参数化绑定防注入）；
- 候选显示区分公司：`UserBaseVO.ptv(userPO, companyName)` 目前只在单公司时带公司名（Service :151），多公司时需按行携带候选人**自身**公司名（从 UserPO.company 反查或批量取公司名），前端 typeahead 展示"姓名(公司)"——批次 1 明细项；
- 与 `multicompany` 开关的关系：判权与开关取"或"（任一放开即放开），不改变开关既有语义；
- 可选对齐项（独立小改，不随本方案强制）：人员分支候选跟随页面公司下拉（Action 接受加密 company 参数，`DepartmentAction:57` 同款模式）——解决三分支行为不一致。

### 2.5 写路径与风险

- **现状即有同类暴露**：streamlined 页面已向各公司约 32 个管理角色展示全公司数据 + 查看详情，且全库写接口普遍不校验数据行归属公司。本方案是把既有暴露面**受控地扩大到指定用户的指定公司**，风险与现状同构且比先例更收敛（in 钳制）。
- 二期加固（不阻塞一期）：跨公司行的操作按钮前端隐藏；写接口补公司白名单校验（抛新错误码，需 error.md 登记）；LogUtils 记录跨公司查看行为。
- 性能：`in (集合)` 走 company 索引（同 eq 的索引路径），扫描量 = 授权公司数据量之和，上限即集团页现状，可接受。

### 2.6 明确不做（防走偏）

- ❌ 不改 `BaseAction.queryCompany()` 全局行为——它同时服务写路径/默认值/日志，全局放开=事故；
- ❌ 不改 `PagingQuery`/`GenericDaoImpl` 基类注入——基类零 company 感知，中央注入需识别实体含列+用户白名单，侵入面更大；
- ❌ 不用"给跨公司用户发 company=0 认证串"——0 已被多处当"未登录/回退"哨兵，语义风险大；
- ❌ 不做切换公司的替代品（需求明确排除）；
- ❌ 不给 cids 设"全部公司"哨兵（拍板②指定集合；近似全部=列全公司）；
- ⚠️ 是否复用 usercompany 作为范围数据源：**复议中，见 §2.7**（若定 B+ 案则撤销本条）。

### 2.7 备选方案：复用 usercompany 作为多公司范围数据源（B / B+ 案）

**提案**（2026-09-16）：不新建 crosscompanyright，把 `communion.usercompany`（现为"可切换公司"授权）扩展理解为"该用户的多公司范围"——业务数据查询（decoration/payment/sales）与人员类查询（queryUser 族、候选 typeahead）统一按 `本公司 ∪ usercompany(uid)` 做 in 范围查询；既保留独立公司的数据维护（默认本公司上下文），又获得跨公司的数据查看范围。

#### 2.7.1 事实基础（生产只读库 + 代码，2026-09-16）

| 事实 | 数据/位置 | 含义 |
|---|---|---|
| usercompany 存量 | **16655 行 / 2145 用户 / 覆盖全部 97 公司**；每用户 1~3 家的占 70%（241+945+318），最多 20+ 家 | 存量体量大：B 案生效当天即有 2145 人获得跨公司查看 |
| 91% 行是"其它公司" | 16654 行中仅 1540 行 cid=用户本公司 | 该表语义=纯"切换到别处"；**复用必须显式 本公司∪集合**，不能只取表内行 |
| 切换校验 | `LoginServiceImpl.changeAuthCode:169-173`：无 usercompany 行 → 拒切 | 配了行=该公司出现在切换下拉且可切换（**查看授权与切换授权天然绑定**） |
| 管理 UI 现成 | `UserCompanyAction` + user.html/user.js 授权块 | 拍板④（管理页面）自动满足，**零新 UI** |
| 人员查询已有放开先例 | `UserServiceImpl.queryUserByPinyin:335`（multicompany==0 && all → null）；`queryCustomerUserRuleByPinyin` 同款 | queryUser 族纳入 in 范围 = 同一 DAO 套路，无新障碍 |
| 数据读取成本 | usercompany 按 uid 索引查询，2145×平均 8 行 | 与 A 案判权查询同量级，可接受 |

#### 2.7.2 三案对比

| 维度 | A：新建 crosscompanyright | B：纯复用 usercompany | **B+：复用 + 模块开关（推荐）** |
|---|---|---|---|
| DDL | 新表 | 无 | **无**（仅 systemconfig 配置行 INSERT） |
| 管理 UI | user.html 新增配置块 | **现成**（既有授权块） | **现成** |
| 范围语义 | 本公司∪cids，按用户 | 本公司∪usercompany，按用户 | 同 B |
| 模块维度 | **每用户×每模块** | 无（改造到哪全量生效到哪） | **模块级开关**（systemconfig `CROSS_VIEW_<MODULE>_INT`，company=0 全局行）：分批=开配置，可随时关配置回滚而不回滚 jar |
| 查看≠切换 | **可分离**（只给看不给切） | 绑定（配查看=给切换+切换下拉出现该公司） | 绑定（同 B） |
| 存量影响 | 零（无行=不变） | 2145 人立即跨公司可见 | 同 B，但可按模块逐个放开、随时收缩 |
| 同屏/导出能力放大 | 授权集合内 | 集合内（存量用户此前只能互斥切换，现在可同屏+批量导出——实质新增能力，需业务认可） | 同 B |
| 概念成本 | 两套"公司范围"（切换/查看）并存，可能配漂移 | **单一数据源**，心智简单 | 同 B |

#### 2.7.3 分析结论

1. **技术上完全可行**，且与 A 案共享全部改造结构（Service 读方法换集合参数、DAO eq/in、范围权限跳过、payment 下推 DAO、前端公司列/条件）——两案差别**只在数据源与授权模型**，改造工作量同级。
2. **"能切换者本就能看"** 削弱了 B 的安全顾虑：2145 名存量用户本就可以切换到授权公司查看，B 案给他们的只是"不切也能看 + 同屏/导出"；真正的实质新增是**批量导出跨公司数据**与**未来"只给查看"的人群无法表达**。
3. **queryCompany 层统一处理的两点澄清**（对提案技术形态的回答）：
   - `queryCompany()` **本身不能改**——693 处调用混着写路径归属（setCompany(queryCompany())）、计数器、配置读取、日志，返回集合会写歪数据。正确形态是**并列新增集合入口**（如 `queryCompanys()` 返回 `本公司∪usercompany`），由各查询方法换用；
   - 即便如此也**不存在"一处改全局生效"**：大量 Service 走 `authentication().getCompany()`（decoration ForCommon、payment filter 值等），同样要逐方法换参。改造点集合与 A 案一致。
4. **queryUser 族纳入**：成立。`queryUserByPinyin` / `queryCustomerUserRuleByPinyin` 等 Integer→List 同套路；且这些查询现状受 `multicompany` 文件开关控制，B+ 判权结果与开关取"或"。
5. **推荐 B+**：零 DDL、零新 UI、单一数据源，用 systemconfig 模块开关找回模块维度与逐批/回滚节奏（与拍板③"分批实现"天然对齐）。**选 A 的唯一硬理由**是存在"只许查看、不许切换"的人群——若业务确认存在此类需求（如外部审计账号、只读顾问），则回到 A；否则 B+ 以更低的配置成本达到同等效果。

#### 2.7.4 B+ 案落地要点（若采纳）

- 范围计算收口在一个服务方法（建议 `UserCompanyService.queryCompanysForView(uid, ownCompany)` 或 right 包新服务读 usercompany），业务层一行接入，同 §2.2 消费形态；
- 模块开关：`communion.systemconfig` 加 `company=0` 全局行（如 `CROSS_VIEW_DECORATION_INT=1`），判权服务按 module 读开关，开关关=集合退化为 {本公司}（**配置级回滚**）；
- 🔴 上线前业务确认：存量 2145 名 usercompany 用户将在已开模块获得跨公司查看（含同屏与导出）；如需收缩，先清理 usercompany 存量或先只开 decoration 观察；
- 授权心智文案：用户管理页公司授权块即"可切换+可查看"双重语义（可加页面提示文案，非必须）；
- 其余（本公司并集、DAO in、范围权限跳过、payment Filter 约束、issueCustomerSource 试点、写路径不放宽）全部沿用 §2.2-2.5。

---

## 3. 分批实施计划

| 批次 | 内容 | 后端 | jar | 前端 | SQL |
|---|---|---|---|---|---|
| **0 机制层+管理页** | DDL + PO/DAO/Service + 管理 Action + user.html 授权块 | right 模块新增 3 类 + Action；personel 模块 user 页关联 | fanglin-right（🔴若此前未发过 jar，按 elecsign 先例首次打 jar 并核实生产 class 部署形态）、fanglin-personel | user.js 增"跨公司查看"配置块（模块×公司多选） | CREATE TABLE（幂等）；无新菜单（复用用户管理页）；operation 自动补全无需登记 |
| **1 试点：customer** | issueCustomerSource 人员查询放开（module=customer） | `CustomerUserRuleAction` + Service + DAO（Integer→List） | customer | typeahead 候选显示公司名 | 无 |
| **2 decoration：全部锁公司页面** | 拍板③：16 个 page 方法全量改造（见 3.1 清单） | Service/DAO 逐方法 + 范围权限跳过（§2.3-3） | decoration | 公司列 + 公司条件（选项=授权集合） | 无 |
| **3 payment** | 同套路（module=payment） | `PaymentServiceImpl` 判权；**钳制下推 DAO 直加 criterion（不走 Filter，§2.3-2）** | payment | 公司列+新增公司条件定义 | 无 |
| **4 sales** | 同套路（module=sales） | `SalesDaoImpl` eq→集合 + Service 换参 | sales | 公司列+新增公司条件定义 | 无 |
| **5+ 按需** | balance / construction / ... 复制套路 | 同上 | 各模块 | 同上 | 同上 |

### 3.1 decoration 批次方法清单（`DecorationService.java:27-57` 全量 16 个分页方法）

| 方法 | 现状 company 来源 | 改造点 |
|---|---|---|
| `pageDecoration` | companyType 参数（0→null 全部） | 集团页现状保留；增加 in 钳制叠加（有权用户传 companyType 时仍受授权集合约束）或维持原样（实施时定，倾向维持原样不叠加） |
| `pageDecorationForGeneral` | `authentication.getCompany()`（:249） | 换集合 |
| `pageDecorationForCommon` | `authentication.getCompany()`（:265）+ **设计部/状态 right 收窄**（:274-300） | 换集合 + 集合>1 跳过 right 收窄 |
| `pageDecorationForCompany` | `int company` 参数 | 换集合 |
| `pageDecorationForGrade` | `int company` 参数 | 换集合 |
| `pageDecorationForCustomer` | customerPhone（无 company） | 审计确认是否需要纳入 |
| `ForDesigner / ForDesignerDept / ForDesignerManager` | authentication + 设计部门 right | 换集合 + 跳过 right |
| `ForSalesman / ForSalesmanDept / ForSalesmanManager` | authentication + 业务部门 right | 换集合 + 跳过 right |
| `ForQuoter / ForEscorter / ForMaterialer / ForBelong` | authentication（含各自 right/角色逻辑） | 逐个审计后换集合 |

- 批次内顺序：**SQL(DDL) → jar → 授权配置（管理页）→ 前端**。**DDL 必须先于 jar**（判权代码查表，缺表启动即炸，同 SQL12 先于 jar 的约束）。
- 每批次交付核对清单：无授权账号回归（行为等价）+ 授权账号正向验证（只多不少：本公司数据不丢、授权公司可见、未授权公司不可见）+ 详情跳转/导出抽测 + 写操作抽测（跨公司行上的操作行为与预期登记一致）。
- **app 版前端**（`app/` 平行版本）同步为各批次后续项，老版（WebContent）先行——与既往功能发版惯例一致。

---

## 4. 拍板记录与遗留核实项

| # | 问题 | 结论（2026-09-16） |
|---|---|---|
| 1 | 授权粒度 | **用户级**（uid × 模块 × 公司集合） |
| 2 | 范围语义 | **指定公司集合**（无"全部"哨兵；可见集合=本公司∪cids） |
| 3 | decoration 改造范围 | **全部锁公司页面**（16 方法清单 §3.1） |
| 4 | 授权管理 | **管理页面**（挂用户管理页对话框，复用 usercompany 样板与菜单） |
| 5 | **数据源（已定）** | **A 案：新建 crosscompanyright**（2026-09-16 拍板；B/B+ 分析保留于 §2.7 供追溯） |
| ✅ | multicompany 语义 | **公司隔离标识，生产为完全隔离态**（2026-09-16 用户确认）：人员/客户等查询现状锁本公司，批次 1 判权与开关取"或"，开关语义不变 |
| ✅ | fanglin-right 发版 | **非首次**（target 存量 fanglin-right-8.3.027.jar 实证），按常规模块发版即可 |

设计推论（随拍板②③产生的行为定义，如无异议按此实施）：
- 跨公司视图下**个人范围权限（设计部/业务部/状态 right）不收窄**，等同 ALL_ENABLE 集团全量视图（§2.3-3）；
- 集团页（streamlined，companyType=0 查全部）**维持现状不叠加授权钳制**——它由菜单角色授权独立管控。

---

## 5. 实施状态

### 批次 0（机制层+管理页）+ 批次 1（issueCustomerSource 试点）——已实施，2026-09-16

**批次 0 文件清单：**

| 文件 | 内容 |
|---|---|
| `sqls/right/10_crosscompanyright.sql`（新） | DDL（幂等）+ 授权/撤销 SQL 模板（🔴非幂等） |
| `right/po/CrossCompanyRightPO.java`（新） | 实体 + MODULE_*_STR 四模块常量 |
| `right/vo/CrossCompanyRightVO.java`（新） | cids(List\<String\>加密串,输入) / companys(List\<CompanyVO\>,输出) |
| `right/dao/CrossCompanyRightDao.java` + impl（新） | queryCrossCompanyRight(uid) / queryCrossCompanyRight(userId,module)（跨库 join communion.user）/ add / delete×2 |
| `right/service/CrossCompanyRightService.java` + impl（新） | **queryCompanysForView(userId, company, module)**（消费侧唯一入口,恒返回升序集合且含本公司）/ queryCrossCompanyRightByUid / updateCrossCompanyRight（全量覆盖式, @Transactional） |
| `right/action/CrossCompanyRightAction.java`（新） | queryCrossCompanyRightByUid / updateCrossCompanyRight |
| `WebContent/js/api/right.js` | 两接口定义 |
| `WebContent/views/personnel/user.html` | crossCompanyModal（含只读语义提示文案） |
| `WebContent/js/personnel/user.js` | `crossModules` 清单（当前仅 customer,随批次扩展）+ 用户行"跨公司"按钮（**与"公司"按钮同 pageBtn=company 门控**）+ 保存函数 |

**批次 1 文件清单：**

| 文件 | 改动 |
|---|---|
| `customer/action/CustomerUserRuleAction.java` | 判权入口换 queryCompanysForView；packageUserName 增加 crossCompany 参数——**仅跨公司集合(size>1)时候选显示"姓名-部门-公司"，单公司模式显示格式与今天逐字节一致** |
| `customer/service/CustomerUserRuleService.java` + impl | `Integer company` → `List<Integer> companys`；公司名解析：单元素=companyDao.get（原行为），多元素=queryCompanyByIds 建映射（跨公司时候选带各自公司名）；multicompany==0→null 语义保留 |
| `customer/dao/CustomerUserRuleDao.java` + impl | 两处 company 条件支持集合（size==1→eq / ≥2→in）；排除 ADVANCE_INVALID 的 sqlRestriction 增加动态 in 占位变体（参数化绑定） |
| `seiya/action/A20260103Action.java` | **实施中发现的隐藏调用方**（方案期 grep 被截断遗漏）：orgId 包单元素集合传入，单公司语义不变 |

**行为等价矩阵（无授权行 = 零变化）：** queryCompanysForView 返回 [本公司] → DAO eq 单值 → 与改造前完全一致；seiya 外部接口 orgId 路径不变；multicompany 开关语义不变（判权与开关取"或"）。

**jar（8.3.030 戳，🔴版本号待定夺）：** fanglin-right-8.3.030.jar / fanglin-customer-8.3.030.jar / fanglin-seiya-8.3.030.jar（⚠️ seiya 此前有 8.3.028.024 在途，本 jar 含其全部内容+本次适配，部署时二选一，勿并存）。

**部署顺序：** ① DDL（sqls/right/10_crosscompanyright.sql）→ ② 三 jar → ③ 前端（WebContent，user.html/user.js/api/right.js）→ ④ 用户管理页授权配置（无授权 SQL 也可跑通管理页）。

### 待实施

- 批次 2 decoration（16 方法清单 §3.1 + 范围权限跳过 §2.3-3 + 前端公司列/条件）
- 批次 3 payment / 批次 4 sales / 批次 5+ 按需
- app 版前端同步（后续项）

---

## 附：关键代码索引

| 事实 | 位置 |
|---|---|
| company 两入口 | `core/action/BaseAction.java:109-127`；`core/vo/Authentication.java:96`；`common/action/LoginAction.java:190` |
| null 跳过惯例 | `decoration/dao/impl/DecorationDaoImpl.java:42-44`；`communion/dao/impl/DepartmentDaoImpl.java:58-61` |
| getCriterion "in" 支持 List | `core/dao/impl/GenericDaoImpl.java:212-213` |
| Filter List 构造仅支持 Short | `core/vo/Filter.java:63-78`（payment 不走 Filter 的依据） |
| companyType 放行链 | `decoration/service/impl/DecorationServiceImpl.java:226`；`js/decoration/decoration.js:3100-3102`；`js/utils/decorationPageUtils.js:738-809` |
| 页面配置查询 | `right/dao/impl/DecorationFunctionRightDaoImpl.java:21-23`（严格 eq company） |
| 范围权限消费点（跳过项） | `decoration/service/impl/DecorationServiceImpl.java:274-300`（ForCommon 设计部/状态 right） |
| 跨公司部门候选 | `js/condition/decoration.js:336-415`；`communion/service/impl/DepartmentServiceImpl.java:168-186` |
| payment 公司过滤 | `payment/vo/PaymentVO.java:364-379`；`js/payment/payment.js:685-687` |
| sales 硬过滤 | `sales/dao/impl/SalesDaoImpl.java:30` |
| issueCustomerSource | `customer/action/CustomerSourceAction.java:98-104`；`customer/service/impl/CustomerSourceServiceImpl.java:496-859` |
| 人员候选查询 | `customer/action/CustomerUserRuleAction.java:63`；`customer/service/impl/CustomerUserRuleServiceImpl.java:105-155`；`customer/dao/impl/CustomerUserRuleDaoImpl.java:52-102` |
| multicompany 开关 | `utils/SystemConfig.java`（读 `/sysconfig.properties`）；`CustomerUserRuleServiceImpl.java:113-115` |
| 管理页样板 | `personel/action/UserCompanyAction.java:35-52`；`js/personnel/user.js:1009、1850、1949-1954` |
| operation 自动补全 | `docs/10-指南手册/OPERATION_COLLECT_CUTOVER_SOP.md`（新 .do 无需手工登记，through=1 收集） |
| 生产配置实证 | decorationfunctionright：95 公司 × streamlinedBusiness/streamlinedDesign 全部 companyType=0；菜单 mid=334/335，company=1 授权 9 角色（2026-09-16 只读库） |
