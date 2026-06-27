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

### 阶段 1：加字段 + 数据初始化（低风险，纯加列）

**目标**：新增 `sort` 列，用现有 `schedule` 值初始化，不改任何业务逻辑。

**数据库迁移**：
```sql
-- 1. 加列
ALTER TABLE construction.constructionschedule ADD COLUMN sort SMALLINT NULL AFTER schedule;

-- 2. 用 schedule 值初始化 sort
UPDATE construction.constructionschedule SET sort = schedule WHERE sort IS NULL;

-- 3. （确认后）设非空
ALTER TABLE construction.constructionschedule MODIFY COLUMN sort SMALLINT NOT NULL;

-- 4. 加索引（按 sort 查询/排序场景）
CREATE INDEX idx_constructionschedule_sort ON construction.constructionschedule(cid, sort);
```

**代码改动**：
- `ConstructionSchedulePO.java`：加 `private short sort;` + `@Column(name="sort")` getter/setter + `COLUMN_SORT_STR` 常量
- `ConstructionSchedulePO.init()`：`setSort(constructionNodePO.getSort())`（保留 setSchedule 兼容）
- `construction/vo/ConstructionScheduleVO.java`：加 `sort` 字段
- ptv 自动拷贝（BeanUtil 按名匹配，无需手改）

**风险**：低。纯加列+回填，旧逻辑全部继续用 schedule，互不影响。

**回滚**：`ALTER TABLE ... DROP COLUMN sort`。

---

### 阶段 2：切换读取源（中风险）

**目标**：前端/后端读取改用 `sort`，schedule 仅写入不再读取。VO 同时返回 sort 和 schedule（兼容）。

**后端改动**：
- 下游 6 个影子 PO 拷贝点：`cs.getSchedule()` → `cs.getSort()`
- `DecorationAdditionServiceImpl:134`：`cs.getSchedule()` → `cs.getSort()`
- `customer/ConstructionServiceImpl:85-86`：`cs.getSchedule()` → `cs.getSort()`（map key 仍是 node.sort）
- ptv：确保 `sort` 被拷贝到 VO（BeanUtil 自动）

**前端改动**：
- 排序：`a.schedule - b.schedule` → `a.sort - b.sort`（2 处）
- 显示用 schedule 的地方改读 sort

**不改动**：DAO 查询、API 参数名、魔法数字（留给后续阶段）。

**风险**：中。需回归"排序/显示"相关页面。

**回滚**：前端改回读 schedule；后端改回 getSchedule。

---

### 阶段 3：新增 CRUD 接口（中风险）

**目标**：支持凭空创建/删除 schedule。

**新增接口**：
- `addConstructionSchedule`：创建一条 schedule。cnid 可空（凭空创建时），sort/name 必填。
- `deleteConstructionSchedule`：按 csid 删除。需校验状态（如已开工的不可删）。

**代码改动**：
- `ConstructionScheduleAction`：加 2 个 @Action
- `ConstructionScheduleService` / `Impl`：加 2 个方法
- 前端：在 constructionSchedule 页面或 supervision4detail 加"添加节点"/"删除"按钮

**业务规则**（需确认）：
- 凭空创建的 schedule，sort 如何分配？（建议：当前最大 sort +1）
- 删除限制：status != INIT 的不可删？已有 workerSalary/constructer 关联的不可删？

**风险**：中。新增功能，需测试创建/删除流程及下游影响。

**回滚**：下线接口即可。

---

### 阶段 4：切换查询条件（高风险）

**目标**：DAO 的 schedule 查询改用 cnid，废弃 schedule 查询重载。

**后端改动**：
- `ConstructionScheduleDaoImpl:49-50,59-60`：废弃 2 个 schedule 重载（或内部转调 cnid 重载）
- 4 个 service 调用点：传 cnid 而非 schedule
- 前端 API 参数：`"constructionSchedule.schedule"` → `"constructionSchedule.cnid"`（需前端确认选中行的 cnid）

**风险**：高。查询逻辑变化，需全面回归以下流程：
- 监理详情（supervision4detail）按节点查询 schedule/drawing/constructer
- 分配详情（allocation4detail）按节点查询
- 施工日志图纸（constructionDiaryDrawing）

**回滚**：DAO 恢复 schedule 重载。

---

### 阶段 5：删除 schedule 字段（中风险，收尾）

**目标**：确认无任何代码读 schedule 后，删除字段。

**前置确认**：
- 全局搜索 `getSchedule` / `setSchedule` / `.schedule` 无业务读取（仅剩 PO 定义）
- 生产 sort 列数据完整（无 null）

**改动**：
- `ConstructionSchedulePO`：删 schedule 字段、getter/setter、构造器参数、COLUMN_SCHEDULE_STR
- 数据库：`ALTER TABLE ... DROP COLUMN schedule`
- 影子 PO 的 schedule 列：**单独决策**（它们各自独立，可保留也可同步改 sort/cnid，不在本阶段强制）

**风险**：中。删字段不可逆，务必确认无依赖。

**回滚**：❌ 不可回滚（需从备份恢复）。务必在阶段 2-4 稳定运行一段时间后再执行。

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
| 1 加字段 | 低 | DROP COLUMN | 上线即生效 |
| 2 切读取 | 中 | 前后端改回 schedule | 1 周 |
| 3 加 CRUD | 中 | 下线接口 | 2 周 |
| 4 切查询 | 高 | DAO 恢复 schedule 重载 | 2 周 |
| 5 删字段 | 中 | ❌ 不可回滚 | 阶段2-4稳定后 |

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
