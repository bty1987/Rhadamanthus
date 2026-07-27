# P1 · 缓存刷新彻底化 + 表结构加固

> 实施日期：2026-07-27
> 状态：P1-a ✅ 已完成 / P1-b ✅ 脚本就绪（待 DBA 执行）/ P1-c ⏸️ 推迟（依赖 P1-b 落地）

---

## P1-a：切公司刷新彻底化（projectStatus 同步等待）

### 问题
`Constant().init()`（`constant.js:245`）里调用 `loadConstructionNodes()`，原代码用 `com.post` **异步**请求施工节点。切公司场景下的竞态：
1. `init()` 把 `constant["decoration"]` 重建为访问器函数
2. `loadConstructionNodes()` 发异步请求（上一家公司数据）
3. 异步回调可能在访问器重建**之后**才返回，把上一家公司节点数据写进新公司的 `constant.data.construction.node` —— **公司隔离 bug**

### 修复
`WebContent/js/com/constant.js`：
- `loadConstructionNodes(opts)` 新增 `opts.async` 参数
- `init()` 里改为 `loadConstructionNodes({ async: false })` 同步加载
- 同步保证 init 返回时节点数据已就绪、且不会被旧公司异步回调污染

### 取舍
登录后 init() 会多一次同步阻塞（施工节点请求），但：
- 节点数据量小、单次请求
- 同步保证"init 返回即常量就绪"，业务代码语义更清晰
- 切公司也是低频操作

### 同时加固的点
- 补回 `loadConstructionNodes` 里被误删的 `if (!constant["decoration"])` 防御检查
- `projectStatus` 镜像构建用 `nodeData` 局部变量，消除重复访问

---

## P1-b：constant 表去重 + 唯一约束 + 索引（SQL 脚本）

### 🔴 生产真实结构与设计文档的偏差（关键发现）
探查阶段基于 `dbs/communion.sql` 的 DDL，假设生产表有 `updateTime` 列。但 `prod-readonly-rds` 核对 `information_schema` 发现：

| 项 | dbs/communion.sql（设计） | 生产实际 |
|---|---|---|
| `updateTime` 列 | 有（`DEFAULT CURRENT_TIMESTAMP`） | **无** |
| 现有索引 | 仅 PRIMARY | PRIMARY + `indexone(module,clazz,type)` |
| `name` 列注释 | "姓名" | "姓名"（误植，实际是常量集中文名） |

**结论：以生产实际为准**，SQL 脚本已全部据此重写。

### 生产重复数据现状（44 组）
查重发现三类重复，清理策略不同：
- **类A 完全重复**（如 `customer.feedbackGuarantee.upgradeSource`）：两条业务字段全相同，脚本自动清理（保留 status=0、cid 最小）
- **类B 语义重叠**（如 `decoration.decoration.status key=22`：`STATUS_PROSIGN_APPROVE_INT` vs `STATUS_PROSIGNAPPROVAL_INT`）：历史别名，**人工裁决**
- **类C 语义冲突**（如 `personel.supplierContractBrand.ctype key=0`：低价 vs 底价）：**人工裁决**

### 产出
`sqls/communion/10_constant_dedup_and_constraints.sql`，四段式：
1. **查重**（只读，可反复执行）
2. **类A 自动清理**（保留 status=0、cid 最小；逻辑已用纯 SELECT 在只读库验证通过）
3. **DDL 变更**：ADD COLUMN updateTime、ADD UNIQUE uk_module_clazz_type_key、DROP indexone + ADD idx_module_clazz_type_status（含 status 覆盖索引）、修正列注释/长度
4. **验证**

### 执行前置条件
- ⚠️ 必须先备份：`CREATE TABLE communion.constant_bak_20260727 AS SELECT * FROM communion.constant;`
- ⚠️ 类B/类C 需业务/DBA 人工裁决（清单见脚本 2.4 段注释）
- ⚠️ 只读 RDS 无法执行（ERROR 1290），必须在可写主库执行
- ⚠️ 加唯一约束前必须重新查重确认 0 重复，否则 ALTER 失败

### 状态
脚本就绪，**待 DBA 评审 + 执行**。本批次不擅自改生产数据。

---

## P1-c：ConstantPO 补 updateTime 映射 — ⏸️ 推迟

### 决策调整
原计划直接给 `ConstantPO.java` 加 `updateTime` 字段映射。但核对生产后发现 **生产表根本没有 updateTime 列**。

如果 PO 领先于表结构加映射，Hibernate 启动时会因"未知列 updateTime"导致整个 communion 模块查询失败。

### 正确顺序
```
P1-b 落地（DDL: ADD COLUMN updateTime）
    ↓ DBA 执行 + 验证生产已有该列
P1-c 解锁（PO 加映射）
```

### P1-b 落地后的 P1-c 方案（备用）
communion 模块惯用 `java.sql.Timestamp`（参照 `VillagePO.java:57,281-288`）：
```java
import java.sql.Timestamp;

// 字段
private Timestamp updateTime;

// getter（insertable=false/updatable=false，让 MySQL 的 ON UPDATE 自动维护）
@Column(name = "updateTime", insertable = false, updatable = false)
public Timestamp getUpdateTime() { return updateTime; }
public void setUpdateTime(Timestamp updateTime) { this.updateTime = updateTime; }
```

### 当前状态
PO 已回滚到原始状态（9 字段，无 updateTime）。待 P1-b 执行后再启动 P1-c。

---

## 验证

- [x] constant.js 语法检查通过（`node --check`）
- [x] index.js 语法检查通过
- [x] 类A 清理 SQL 逻辑用纯 SELECT 在只读库验证正确（保留 status=0、cid 最小）
- [x] ConstantPO 已回滚，与当前生产表结构（9 列）一致
- [ ] P1-b 脚本待 DBA 执行
- [ ] P1-b 执行后启动 P1-c

## 回滚
- P1-a：git revert `constant.js` 本次改动（恢复 loadConstructionNodes 异步）
- P1-b：脚本内有备份表 `constant_bak_20260727`，可回滚数据；DDL 变更可逆向 ALTER
- P1-c：当前未改动，无需回滚
