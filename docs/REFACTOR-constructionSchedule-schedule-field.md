# 重构设计：ConstructionSchedule 废弃 schedule 数值，引入独立 sort 字段

> 版本：v1.0  
> 日期：2026-06-27  
> 状态：**待评审**  
> 作者：AI Agent 协助  
> 模块：`com.fanglin.construction`（施工）+ 关联模块

---

## 一、背景与问题

### 1.1 现状

`ConstructionSchedulePO`（施工进度表）有一个 `schedule` 字段（short），其值在创建时从
`ConstructionNodePO.sort` 拷贝而来（`init()` 方法 `setSchedule(node.getSort())`）。

```
ConstructionNodePO.sort  --拷贝-->  ConstructionSchedulePO.schedule
       (基础数据,可变)                    (业务快照,本应不变)
```

### 1.2 两个核心痛点

#### 痛点 A：基础数据 node 的 sort 变更，老数据语义漂移

`ConstructionNode.sort` 是"当前节点排序序号"，管理员调整节点顺序（增删节点）后 sort 会重新分配。
但 `ConstructionSchedule.schedule` 是创建时的快照，**不会跟随更新**，导致：

- 历史数据的 schedule 值与当前 node.sort 错位
- 用 schedule 数值做业务判断的逻辑（前端魔法数字、后端数值比较）语义失效

**生产实锤**（只读库 2026-06-27 查证）：

| orderId | csid | schedule(快照) | 当前 node.sort | name | 漂移 |
|---|---|---|---|---|---|
| 2103090133 | 961517 | 12 | 13 | 地面找平 | +1 |
| 2103090133 | 961518 | 15 | 16 | 木工 | +1 |
| 2103090133 | 961520 | 17 | 19 | 电工安装 | +2 |
| 2103090133 | 961521 | 19 | 20 | 保洁 | +1 |

根因：该公司在订单创建后插入了新节点（如"美缝"），node.sort 整体后移，schedule 快照未同步。

且 sort 取值**各公司不同**（多租户）：

| company | "瓦工"的 sort | sort 范围 | 节点数 |
|---|---|---|---|
| 1 | 11 | 3–20 | 18 |
| 4 | 11 | 3–16 | 14 |
| 7 | 14 | 3–22 | 20 |
| 8 | 14 | 3–21 | 19 |
| 12 | 11 | 3–25 | 23 |

前端 `drawline4user.js` 硬编码 `if (v.schedule == 7/8/9/11/12)`，只在 sort 序列匹配的
公司（如 company=1）上正确，其他公司对应的是完全不同的工种。

#### 痛点 B：ConstructionSchedule 需要支持独立维护

业务诉求：ConstructionSchedule 应支持**凭空创建**（自定义进度节点，不依赖 node 表）和
**删除原有数据**（移除不再需要的节点）。

当前系统**完全没有 add/delete schedule 接口**，schedule 只能在放线（DrawLine）时从 node
批量生成（`DrawLineServiceImpl`、`DecorationMeasureServiceImpl`、`A20251208ServiceImpl`）。

如果继续用 `schedule = node.sort` 的设计：
- 凭空创建的 schedule 没有 node 关联，`schedule` 数值无处可来（得编造）
- 删除 schedule 后，下游依赖 schedule 数值的查询（DAO `eq("schedule",x)`）会断链

### 1.3 根因总结

`schedule` 字段**身兼两职，却两个都做不好**：
1. 当排序序号用——但它是易变 node.sort 的快照，会漂移
2. 当节点标识用——但 sort 不唯一（各公司不同、随调整变化），不适合做标识

---

## 二、设计目标

1. **历史数据稳定**：node.sort 变更不影响已有 ConstructionSchedule 的排序与语义
2. **支持独立维护**：可凭空创建（cnid 可空）、可删除 schedule 记录
3. **业务判断解耦**：业务逻辑不再依赖 sort 数值，改用稳定标识（cnid / csid）
4. **可分阶段上线**：每个阶段独立可测、可回滚，不要求一次性大改

---

## 三、设计方案

### 3.1 字段设计

```
ConstructionSchedulePO（重构后）
├── csid            (PK, 不变)
├── cid / orderId   (关联工程, 不变)
├── node (cnid)     ← 来源标记: 来自标准 node 时填, 凭空创建时为 NULL
├── sort            ← 【新增】独立排序: 初始=创建时的 node.sort, 之后独立维护
├── name            ← 节点名: 来自 node 则拷贝, 自定义则手填
├── schedule        ← 【废弃】过渡期保留兼容, 最终删除 (阶段5)
└── ... (其他业务字段不变)
```

### 3.2 字段语义对照

| 字段 | 类型 | 含义 | 可空 | 痛点A解决 | 痛点B解决 |
|---|---|---|---|---|---|
| `node.cnid` | long | 来源标记（来自哪个标准节点） | ✅ 可空 | 永久指向原始 node，稳定 | 凭空创建=null，明确"自定义节点" |
| `sort`（新增） | short | 独立排序序号 | ❌ | 创建时拷贝 node.sort，之后**不再跟随 node 变化** | 凭空创建时手填，完全自治 |
| `schedule`（废弃） | short | 旧排序快照 | — | 过渡期保留，供回滚兜底 | 最终删除 |

### 3.3 设计原则

- **排序**用 `sort`（独立维护，创建后不变）
- **节点标识/业务判断**用 `cnid`（稳定主键）或 `csid`（本表主键）
- **不再用 schedule 数值做任何业务判断**
- 凭空创建的 schedule：`cnid=NULL`、`sort` 手填、`name` 手填

---

## 四、影响面清单（按风险分级）

> 完整 file:line 见各阶段实施清单。此处为分类总览。

### 4.1 易迁移（机械替换，低风险）

| 项 | 位置 | 说明 |
|---|---|---|
| PO 字段定义 | `ConstructionSchedulePO.java:45,106,169-183,323-330` | 加 sort 字段、标 schedule 废弃 |
| ptv 自赋值 | `ConstructionSchedulePO.java:514`、`ConstructionScheduleDO.java:439` | 无意义自赋值，清理 |
| VO 字段 | `construction/vo/ConstructionScheduleVO.java:64,251-257` | 加 sort 字段 |
| PO.init 源头 | `ConstructionSchedulePO.java:499` | `setSchedule` → `setSort` |

### 4.2 需谨慎（DAO 查询 / 数值语义依赖）

| 项 | 位置 | 说明 |
|---|---|---|
| DAO schedule 查询 | `ConstructionScheduleDaoImpl.java:49-50,59-60` | 2 个重载废弃，改用已存在的 cnid 重载（:54-55,64-65） |
| 4 个 service 调用点 | `ConstructionScheduleServiceImpl:126`、`ConstructionDrawingServiceImpl:128,160`、`ConstructionDiaryDrawingServiceImpl:118` | 传参从 schedule 改 cnid |
| DecorationAddition 数值比较 | `DecorationAdditionServiceImpl.java:134-146` | **不可用 cnid**，改读 `cs.getSort()` 做范围比较 |
| customer map key | `customer/ConstructionServiceImpl.java:71,85-86` | map key 是 sort，改读 `cs.getSort()` |
| 下游 6 个影子 PO 拷贝 | ConstructerRecord/WorkerSalary/Accessories(×2)/ConstructionServiceImpl:274 等 | `cs.getSchedule()` → `cs.getSort()` |
| 前端排序 | `customer4detail.js:13`、`supervision4detail.js:47` | `a.schedule - b.schedule` → `a.sort - b.sort` |
| 前端 DOM 拼接 | supervision4detail/customer4detail/allocation4detail 大量 `#step`+schedule | **建议改用 csid 做 DOM id**（唯一稳定），sort 仅排序 |

### 4.3 高风险（协议级 / 业务逻辑耦合）

| 项 | 位置 | 风险 | 建议 |
|---|---|---|---|
| **前端魔法数字 7/8/9/11/12** | `drawline4user.js:194-206,237-249` | 多租户下语义错乱（已存在的 bug） | 改用 cnid 判断，但需动态获取公司级 cnid，**独立专项** |
| **前端魔法数字 3** | `supervision4detail.js:471` | "当前进行中节点"判断 | 改用 `status==STATUS_BEGIN` 替代 |
| **静态数值索引表** | `decorationUtils.js:2016` | `scheduleInfos[parseInt(schedule)]` 全局映射 | 需改为按 cnid 查节点名 |
| **API 参数 `xxx.schedule`** | supervision4detail/customer4detail/allocation4detail/constructionDiary 等 | 前后端协议联动 | 改 `xxx.cnid`，后端 service 同步切 cnid 查询 |
| **Accessories 传参** | `accessories2create.js:249-250` | 同时传 cnid+schedule 且同值 | 直接废弃 schedule，留 cnid |

---

## 五、分阶段实施计划

> 原则：每阶段独立可上线、可回滚。前阶段不依赖后阶段。

## 五、分阶段实施计划（基于最终决策修订）

> 原则：每阶段独立可上线、可回滚。决策 9 选 D——分次推进，间隔观察。
> 决策 7 选 C——schedule 字段长期保留标废弃，**原阶段 5（删字段）取消**。

### 阶段 1：加字段 + 数据初始化（低风险）

**目标**：`constructionschedule` 和 `construction` 两表各加 `sort` 列，用现有 schedule 值回填，不改业务逻辑。

**数据库迁移**：
```sql
-- constructionschedule 表（215万行，分批回填）
ALTER TABLE construction.constructionschedule ADD COLUMN sort SMALLINT NULL AFTER schedule;
UPDATE construction.constructionschedule SET sort = schedule WHERE sort IS NULL;  -- 分批，每次 5 万
ALTER TABLE construction.constructionschedule MODIFY COLUMN sort SMALLINT NOT NULL;
CREATE INDEX idx_constructionschedule_sort ON construction.constructionschedule(cid, sort);

-- construction 表（17万行）
ALTER TABLE construction.construction ADD COLUMN sort INT NULL AFTER schedule;
UPDATE construction.construction SET sort = schedule WHERE sort IS NULL;
ALTER TABLE construction.construction MODIFY COLUMN sort INT NOT NULL;
```

**代码改动**：
- `ConstructionSchedulePO.java`：加 `private short sort;` + `@Column(name="sort")` + `COLUMN_SORT_STR`
- `ConstructionSchedulePO.init():499`：新增 `setSort(node.getSort())`（保留 `setSchedule` 兼容）
- `ConstructionPO.java`：加 `private int sort;` + `@Column(name="sort")`
- `construction/vo/ConstructionScheduleVO.java`：加 `sort` 字段
- `ConstructionVO`（如存在）：加 `sort` 字段
- ptv 自动拷贝（BeanUtil 按名匹配）

**风险**：低。215 万行回填需评估窗口（建议低峰期，分批 UPDATE）。

**回滚**：`ALTER TABLE ... DROP COLUMN sort`（两张表）。

---

### 阶段 2：切换读取源（中风险）

**目标**：后端读取改用 `getSort()`，前端排序改用 `sort`，DOM id 改用 `csid`。schedule 仅写入不再读取。

**后端改动**：
- 6 个影子 PO 拷贝点：`cs.getSchedule()` → `cs.getSort()`
  - `ConstructerRecordServiceImpl:99`、`WorkerSalaryServiceImpl:229`
  - `AccessoriesServiceImpl:171,184`、`ConstructionServiceImpl(customer):274`
- `DecorationAdditionServiceImpl:134`：`cs.getSchedule()` → `cs.getSort()`（范围比较，不可用 cnid）
- `customer/ConstructionServiceImpl:85-86`：map key 查询改 `cs.getSort()`
- `ConstructionScheduleServiceImpl:243` + `A20251208ServiceImpl:655`：`constructionPO.setSchedule` → 同时 `setSort`

**前端改动**：
- 排序：`a.schedule - b.schedule` → `a.sort - b.sort`（customer4detail:13、supervision4detail:47）
- **DOM id 改 csid**（决策 2）：supervision4detail / customer4detail / allocation4detail 中所有
  `#step` + schedule、`data-schedule`、`schedule + "NavTab"` 等改为 `#step` + csid、`data-csid`、
  `csid + "NavTab"`。涉及约 30+ 处 DOM 选择器，需逐文件排查替换。
- 显示用 schedule 数值的地方改读 sort

**不改动**：DAO 查询、API 参数名、魔法数字（留给阶段 3-4）。

**风险**：中。DOM id 大面积重写，需重点回归 supervision4detail 的步骤切换、tab 切换、上传按钮等交互。

**回滚**：前端改回 schedule、后端改回 getSchedule。

---

### 阶段 3：修复 ConstructionPO 既有 bug + 新增 schedule CRUD（中风险）

**目标**：(a) 修复 `construction.schedule` 筛选 bug；(b) 新增 schedule 选择式新增/删除。

**(a) ConstructionPO bug 修复**：
- `condition/construction.js:60-74`：参数名 `construction.schedule` → `construction.cnid`
- `ConstructionDaoImpl:103-104`：删除 schedule 分支，复用:100 已有的 cnid 分支
- 前端若有读 `construction.schedule` 的列表显示，改读 `construction.sort`

**(b) 新增 CRUD 接口**（决策 3：从标准 node 选择）：
- `addConstructionSchedule` 接口：
  - 入参：orderId、cnid（必填，来自选择的 node）
  - 逻辑：查 node → 填充 sort/name → 校验该订单是否已有此 cnid → save
  - **cnid 始终非空**（决策 3 确定，不存在纯自定义节点）
- `deleteConstructionSchedule` 接口：
  - 入参：csid
  - 校验：status == INIT 方可删；有关联 workerSalary/constructer 的拒绝（抛 FLException）
- `ConstructionScheduleAction`：加 2 个 @Action
- `ConstructionScheduleService` / `Impl`：加 2 个方法
- 前端：在 constructionSchedule 页面或 supervision4detail 加"添加节点"（弹窗选 node）/"删除"按钮

**业务规则**：
- 添加：候选 = 该公司 node 表中当前订单未包含的节点
- 删除：仅 status==INIT 可删；有下游关联数据拒绝删除

**风险**：中。新增功能 + condition bug 修复，需测试筛选 + 创建/删除流程。

**回滚**：下线新接口；condition 改回 `construction.schedule`。

---

### 阶段 4：切换查询条件 + scheduleInfos 改造（高风险）

**目标**：DAO 的 schedule 查询改用 cnid；scheduleInfos 改按 cnid 查；supervision4detail 魔法数字 3 改用 status 判断。

**后端改动**：
- `ConstructionScheduleDaoImpl:49-50,59-60`：废弃 2 个 schedule 重载，内部转调 cnid 重载（:54-55,64-65）
- 4 个 service 调用点：传 cnid 而非 schedule
  - `ConstructionScheduleServiceImpl:126`、`ConstructionDrawingServiceImpl:128,160`
  - `ConstructionDiaryDrawingServiceImpl:118`
- 前端 API 参数：`"constructionSchedule.schedule"` → `"constructionSchedule.cnid"`

**scheduleInfos 改造**（决策 6）：
- `decorationUtils.js:2497` 的静态数组废弃
- 新增/复用"按 cnid 查节点名"机制（后端接口或前端从 schedule 数据中取 node.name）
- `decorationUtils.js:2016` 调用点改为按 cnid 查

**魔法数字 3 修复**（决策 5）：
- `supervision4detail.js:471`：`if (schedule == 3)` → `if (v.status == STATUS_BEGIN)` 或等效状态判断

**风险**：高。查询逻辑 + 显示映射双重变化，需全面回归：
- 监理详情按节点查询 schedule/drawing/constructer
- 分配详情按节点查询
- 施工日志图纸
- 工期时间线（decoration4timeline）

**回滚**：DAO 恢复 schedule 重载；scheduleInfos 恢复静态数组。

---

### 阶段 5：（取消）

决策 7 选 C——schedule 字段**长期保留**，标 `@Deprecated`，新代码不再读写。
原"删除字段"阶段取消，避免不可回滚的 DDL。

**废弃标注**：
- `ConstructionSchedulePO.schedule` / `ConstructionPO.schedule` 加 `@Deprecated`
- Javadoc 注释："改用 sort 字段，本字段保留兼容，勿新增读取"

---

## 六、关键决策点（待确认）

| # | 决策 | 选项 | 建议 |
|---|---|---|---|
| 1 | 影子 PO（ConstructerRecord/WorkerSalary/Accessories 等）的 schedule 列是否同步改 | A. 仅改读取源为 cs.getSort()，列名保留<br>B. 列也改名为 sort | A（阶段2只改读取源，列名改动留作各 PO 独立专项） |
| 2 | 前端 DOM id 用什么 | A. 继续用 sort<br>B. 改用 csid | B（csid 唯一稳定，sort 未来可能重复） |
| 3 | 魔法数字 7/8/9/11/12 是否在本重构内修 | A. 一并修<br>B. 独立专项 | B（涉及 qualiter 表协议，风险独立） |
| 4 | 凭空创建的 sort 分配规则 | A. 当前最大+1<br>B. 手填 | A（自动分配，UI 可编辑） |
| 5 | schedule 字段何时删 | A. 阶段5立即删<br>B. 长期保留兼容 | B（建议阶段2-4稳定运行 1-2 个版本后再删） |
| 6 | 静态索引表 `scheduleInfos`（decorationUtils:2016）如何处理 | A. 改按 cnid 查<br>B. 保留按 sort 索引 | A（cnid 更稳定，但需重构该工具方法） |

### 6.1 决策结论（2026-06-27 已确认）

| # | 决策项 | 选择 | 影响 |
|---|---|---|---|
| 1 | 影子 PO 范围 | **A** 仅改读取源 `cs.getSort()`，列名保留 | 工作量小；影子 PO 列名改动留作独立专项 |
| 2 | 前端 DOM id | **B** 改用 `csid` | 唯一稳定；需改 supervision4detail / customer4detail / allocation4detail 几十处 DOM 选择器 |
| 3 | sort 分配规则 | **选择式**：不手动输入，利用现有 constructionschedule 进行选择 | ⚠️ 数据源/交互待细化（见 6.2） |
| 4 | 魔法数字 7/8/9/11/12 | **B** 独立专项 | 本重构不含，避免范围蔓延 |
| 5 | 魔法数字 3 | **A** 改用 `status == STATUS_BEGIN` 判断 | supervision4detail.js:471 |
| 6 | scheduleInfos 表 | **A** 改按 cnid 查 | decorationUtils.js:2497，需重构为后端查询 |
| 7 | schedule 删除时机 | **C** 长期保留（`@Deprecated`） | **阶段 5 取消**——schedule 字段不删除，仅标注废弃 |
| 8 | ConstructionPO.schedule | **A** 同步改（加 sort 字段） | ⚠️ 范围扩大到工程主表（见 6.3） |
| 9 | 推进节奏 | **D** 分次推进，每阶段独立上线、间隔观察 | 每阶段独立可测可回滚 |

### 6.2 决策 3 细化（已确认）

**选择式新增：候选列表 = 该公司 node 表中、当前订单尚未包含的标准节点。**

- 用户从下拉/弹窗选择一个标准节点
- 选中后 `cnid` / `sort` / `name` **自动从 node 填充**（取当前 node.sort 作为初始值）
- **不存在 cnid=NULL 的纯自定义节点**——所有 schedule 都关联标准 node
- 这简化了设计：cnid 始终非空，无需处理"自定义节点无 cnid"的分支
- 删除场景同理：仅允许删除当前订单的 schedule 记录，不影响 node 主数据

> 与原文档 3.1 节"凭空创建 cnid 可空"的设想不同，已据此修订（见 6.4）。

### 6.3 决策 8 的影响（已确认：加 sort + 修既有 bug）

`ConstructionPO`（工程主表，`construction.construction`）同步处理，且**修复既有 bug**：

**既有 bug 描述**：
- 前端 condition（`condition/construction.js:60-74`）的"进度"筛选器，`keyPath: "cnid"`（提交值是 cnid）
- 但 `submitConfig.name: "construction.schedule"`（参数名却叫 schedule）
- 后端 `ConstructionDaoImpl:103-104` 按参数名查 `schedule` 列：`query.getCriterion("schedule", Integer.parseInt(data), op)`
- 结果：用 cnid 数值去查 schedule 列，**只有数值碰巧相等时才能查到**，筛选功能实际失效

**修复方案**：
- condition 参数名改为 `construction.cnid`
- 后端 filter 改为按 cnid 查询（`ConstructionDaoImpl` 已有 cnid 分支:100，复用即可）
- ConstructionPO 加 `sort` 字段，`setSchedule(node.sort)` → 同时 `setSort(node.sort)`

**涉及改动**：
- `ConstructionPO.java`：加 `sort` 字段 + getter/setter
- 数据库迁移：`construction.construction` 表加列 + 回填（约 17 万订单）
- `ConstructionScheduleServiceImpl:243`、`A20251208ServiceImpl:655`：`setSchedule` → 同时 `setSort`
- `condition/construction.js:64`：`construction.schedule` → `construction.cnid`
- `ConstructionDaoImpl:103-104`：改为按 cnid 查询（或直接删除该分支，复用:100 的 cnid 分支）
- ConstructionPO.schedule 前端读取点的排查与切换

### 6.4 基于决策结论的设计修订

1. **cnid 不再可空**：决策 3 确定新增只能从标准 node 选择，所有 schedule 的 cnid 始终非空。原文档 3.1/3.3 中"凭空创建 cnid=NULL"的设想**作废**。
2. **schedule 字段长期保留**（决策 7 选 C）：阶段 5"删除 schedule 字段"**取消**，改为标 `@Deprecated`，新代码不再读写。
3. **ConstructionPO 同步改**（决策 8）：实施计划每阶段加入 ConstructionPO 的对应改动。
4. **前端 DOM id 改 csid**（决策 2）：阶段 2 的前端改动包含 DOM 选择器重写。
5. **scheduleInfos 改按 cnid 查**（决策 6）：新增一个"按 cnid 查节点名"的后端接口或前端缓存机制。

---

## 七、不在本次范围

- `RepairPO.schedule`：维修子状态，语义无关
- `PlanPO.schedule` / `AddReducePO.schedule`：装修状态映射，独立业务
- `ConstructionPO.schedule`：工程当前进度（顶层），虽由 node.sort 写入，但属独立列，**协同评估但不强制改**
- 各影子 PO 的 schedule **列名改动**：仅改读取源，列名保留

---

## 八、风险与回滚策略

| 阶段 | 风险等级 | 回滚方式 | 建议观察期 |
|---|---|---|---|
| 1 加字段（两表） | 低 | DROP COLUMN | 上线即生效 |
| 2 切读取源 + DOM改csid | 中 | 前后端改回 schedule | 1 周 |
| 3 修ConstructionPO bug + CRUD | 中 | 下线接口；condition改回 | 2 周 |
| 4 切查询 + scheduleInfos + 魔法数3 | 高 | DAO 恢复 schedule 重载 | 2 周 |
| 5 标 @Deprecated（不删字段） | 低 | 移除注解 | 即时 |

> 决策 7 选 C，无删字段的不可逆操作。整个重构**全程可回滚**。

---

## 附录 A：生产数据现状（2026-06-27 只读库查证）

- 总记录：2,156,373 条，覆盖 172,827 个订单
- 每订单 schedule 数：1–25 不等（说明已存在差异化维护）
- cnid 为空/0 的记录：132 条（2015 年老数据，早期无 node 关联）
- schedule 与当前 node.sort 错位的记录：已确认存在（见 1.2 节）
- **`scheduleInfos` 静态表缺陷**：`decorationUtils.js:2497` 定义为 9 项数组（下标 0-8），
  但生产 sort 实际取值 0–25，**超出 9 项的 sort 值会取到 undefined**——这是既有的显示 bug，
  也是"用 sort 数值做下标"设计缺陷的又一证据

## 附录 B：关键代码位置索引

| 文件 | 关键行 | 内容 |
|---|---|---|
| `ConstructionSchedulePO.java` | 499 | init() 源头赋值 setSchedule(node.sort) |
| `ConstructionSchedulePO.java` | 514 | ptv 自赋值（无效） |
| `ConstructionScheduleDaoImpl.java` | 49-50, 59-60 | schedule 查询重载（待废弃） |
| `ConstructionScheduleDaoImpl.java` | 54-55, 64-65 | cnid 查询重载（已存在，复用） |
| `ConstructionScheduleServiceImpl.java` | 126, 243 | service 调用点 |
| `DecorationAdditionServiceImpl.java` | 134-146 | 数值范围比较（不可用 cnid） |
| `drawline4user.js` | 194-206, 237-249 | 魔法数字 7/8/9/11/12 |
| `supervision4detail.js` | 471 | 魔法数字 3 |
| `decorationUtils.js` | 2016, 2497 | 静态索引表 scheduleInfos |
