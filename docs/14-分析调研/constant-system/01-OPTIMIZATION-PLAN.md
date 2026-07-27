# 01 · 分批优化方案总览

> 基于 `00-AUDIT.md` 的事实结论，按收益/风险/改动面排定优先级。
> 每批独立可交付、独立可回滚。

---

## 优先级矩阵

| 优先级 | 批次 | 主题 | 改动面 | 收益 | 风险 |
|--------|------|------|--------|------|------|
| **P0** | P0 | constant.js 同步请求改异步 + index.js 标志位笔误修正 | 1 文件 + 1 行 | 消除菜单卡顿，立竿见影 | 低（load 标志兜底） |
| **P1** | P1-a | 切公司刷新彻底化 + projectStatus 同步等待 | index.js + constant.js | 修数据隔离 bug | 低 |
| **P1** | P1-b | constant 表加唯一约束 + 查询索引 | 1 个 SQL 脚本 | 防脏数据 + 提速 | 中（需先查重清理） |
| **P1** | P1-c | ConstantPO 补 updateTime 映射 | ConstantPO.java | 审计能力 | 低 |
| **P2** | P2-a | localStorage 持久化 + 登录后并发预加载 | constant.js + index.js | 消除竞态、刷新零请求 | 中（序列化处理） |
| **P2** | P2-b | 收敛 status 0/1 魔法数（317 处，分模块） | ~50 文件 | 可读性、可维护性 | 中（回归测试） |
| **P3** | P3 | 后端聚合接口 + ETag | 后端 Action + 前台 | 长期最优 | 高（改动大） |

---

## P0 批次：同步改异步 + 标志位修正

### 目标
消灭菜单点击卡顿 + 排掉"标志位名字写错"的雷。零业务影响。

### 改动点
1. `WebContent/js/com/constant.js` 的 `handle()`：新增 `opts.async` 参数，默认翻转 `false`→`true`。
2. `WebContent/js/index.js:962` 的 `["update"]` → `["load"]`。

### 实施记录
见 `batches/P0-async-and-flag-fix.md`（实施时补写）。

---

## P1 批次：缓存刷新 + 表结构加固

### P1-a：切公司刷新彻底化
- `Constant().init()` 重建访问器时显式丢弃旧 load 标志
- `loadConstructionNodes()` 在切公司场景加同步等待或 loading 态

### P1-b：constant 表唯一约束 + 索引
```sql
-- 先查重
SELECT module, clazz, type, `key`, COUNT(*) c
FROM communion.constant
GROUP BY module, clazz, type, `key` HAVING c > 1;

-- 人工清理后加约束
ALTER TABLE communion.constant
ADD UNIQUE KEY uk_module_clazz_type_key (`module`, `clazz`, `type`, `key`);
ALTER TABLE communion.constant
ADD INDEX idx_module_clazz_type_status (`module`, `clazz`, `type`, `status`);
ALTER TABLE communion.constant
MODIFY COLUMN `name` varchar(64) NOT NULL COMMENT '常量集中文名';
```
配合 `ConstantServiceImpl.addConstant` 捕获唯一键冲突回友好提示。

### P1-c：ConstantPO 补 updateTime
DDL 改为 `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`，PO 补：
```java
@Column(name = "updateTime", insertable = false, updatable = false)
private Date updateTime;
```

---

## P2 批次：根治竞态 + 收敛魔法数

### P2-a：localStorage 持久化 + 并发预加载
- 登录后并发异步预取 16 个模块（消除首次访问竞态）
- localStorage 按 `companyId + module + version` 缓存，版本号失效

### P2-b：收敛 status 0/1 魔法数
分模块渐进替换，优先 approval/balance/building（魔法数最密集）。配合 pre-commit grep 检查防增量。

---

## P3 批次：后端聚合接口（长期最优）

后端开 `queryAllConstants` 聚合接口，一次返回全量常量树 + ETag，前台一次拉全、HTTP 304 增量校验。改动面大，视资源选做。

---

## 落地顺序建议

```
P0  →  P1-a/P1-b/P1-c（可并行）  →  P2-a  →  P2-b（分模块滚动）  →  P3（可选）
```

每完成一批：
1. 在 `batches/` 下补写实施记录
2. 更新 `README.md` 进度表（⬜→✅）
3. 按需 `git commit`（遵循 AGENTS.md：默认 master 直提，只纳入本批相关文件）
