# Operation 影子收集与关闸 运维 SOP

> 本文档指导运维完成"operation 权限影子收集 → 平滑关闸"全流程。
>
> **背景**：系统大量 `.do` 接口未在 `operation` 表登记，鉴权形同虚设。本次改造在 `AccessInterceptor` 增加了**自动补全逻辑**：每个已登录请求触发后，自动创建缺失的 operation 记录（默认 `through=1` 放行）并补全 roleoperation。收集一段时间后，运维逐个把 operation 的 `through` 改为 0 即可激活强制校验。

---

## 一、原理速览（必读）

### operation 表关键字段

| 字段 | 值 | 含义 |
|------|-----|------|
| `through` | **1** = 放行收集（PASS），**0** = 强制校验 | 关闸开关（每个接口独立） |
| `type` | 0 = 走校验，1/2 = 内部短路放行 | 自动创建的记录恒为 0 |
| `status` | 0 = 启用，1 = 禁用 | |
| `operation` | 接口名（如 `queryDecorationByOrderId`） | 对应 `.do` 的 actionName |

### 自动补全的行为

- **只对已登录请求**收集（四要素 userId/roleId/company/actionName 齐全才触发）。
- `through=1`(PASS) 分支**不补**（无 authentication，无法取 userId）——这是正常的，登录页/验证码等接口本来就不需要补。
- 新建的 operation 一律 `through=1`，**对现有功能完全无感**。
- roleoperation 按 `(rid, oid, company)` 三元组补全，天然按公司拆分。

### 关闸的本质

把 operation 的 `through` 从 `1` 改成 `0`。改完之后该接口走强制校验：命中 roleoperation 放行，否则抛"无操作权限"。

---

## 二、上线前准备

### 步骤 1：执行索引 SQL（必须，否则收集期会拖垮数据库）

```sql
-- 覆盖两种查询:补全(rid,oid,company) + 校验(rids,oid)
ALTER TABLE communion.roleoperation
  ADD INDEX idx_rid_oid_company (rid, oid, company);
```

### 步骤 2：记录基线数据量（用于后续对比）

```sql
-- 记录收集前的行数,保存好这两个数字
SELECT COUNT(*) AS operation_cnt  FROM communion.operation;       -- 预期约 164
SELECT COUNT(*) AS roleoperation_cnt FROM communion.roleoperation; -- 预期约 48668
```

> 把这两个数字记在工单里。收集期结束后对比，能直观看出收集了多少。

### 步骤 3：部署代码

替换以下 3 个 class（或重新打包对应 jar）：
- `com.fanglin.system.service.OperationService`
- `com.fanglin.system.service.impl.OperationServiceImpl`
- `com.fanglin.core.interceptor.AccessInterceptor`

重启应用。

---

## 三、收集期观察

### 每日巡检 SQL（建议每天跑一次）

```sql
-- 1. operation 增长情况(对比基线)
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN through = 1 THEN 1 ELSE 0 END) AS pass_cnt,    -- 收集期放行中
  SUM(CASE WHEN through = 0 THEN 1 ELSE 0 END) AS check_cnt    -- 已关闸
FROM communion.operation;

-- 2. roleoperation 增长情况(对比基线)
SELECT COUNT(*) AS total FROM communion.roleoperation;

-- 3. 今日新增的 operation(看是否还在长新数据)
SELECT oid, operation, name, through, createTime
FROM communion.operation
WHERE createTime >= CURDATE()
ORDER BY oid DESC
LIMIT 50;

-- 4. 近 7 天 operation 增长趋势(判断何时收敛)
SELECT DATE(createTime) AS dt, COUNT(*) AS new_cnt
FROM communion.operation
WHERE createTime >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(createTime)
ORDER BY dt DESC;
```

### 收敛判断标准

当**连续 3~5 天**满足以下两条，认为收集基本完整：
1. 每日新增 operation 数 **趋近于 0**（说明没有新接口被调用了）。
2. 每日新增 roleoperation 数 **趋近于 0**。

> ⚠️ **周期性操作提醒**：收集期必须覆盖至少一个完整的月度结算周期。装修/工程业务有月结、季度结算，若收集期不足一个月，月底/季底首次触发的接口会漏采。建议**最短收集期 30~45 天**。

### 异常监控（上线头 3 天重点看）

收集期第一天最可能暴露的问题是：**原本靠"operation 未登记→放行"活着的接口**，现在被自动登记成 `through=1`，看似无影响——但如果某些内部脚本/cron 裸调接口（不带 authentication），它们之前走的是 `through` 为 null 或 operation 不存在的路径。

监控应用日志中的以下关键字：
```
aseerror          -- AccessInterceptor AES 解密失败
登陆超时           -- authentication 缺失或过期
```

若某接口高频报错，判断：
- 若是合法的裸调内部接口 → 把它的 operation 设为 `through=1`（本来就是，确认即可），或显式设 `through=2`(COMMON 弱校验)。
- 若是异常流量 → 正好暴露了原来的鉴权漏洞，关闸时直接 `through=0` 拦掉。

---

## 四、关闸操作

### 关闸原则

- **不要批量关、不要一次性全关**。逐个接口、或按业务模块小批关闸。
- 每关一批，观察 24~48 小时无报错，再关下一批。

### 关闸单个接口

```sql
-- 把目标接口从放行(1)改为强制校验(0)
UPDATE communion.operation
SET through = 0
WHERE operation = '接口名';
```

执行后该接口立即生效：命中 roleoperation 放行，未命中抛"无操作权限"。

### 关闸批量（按模块前缀，谨慎）

例如关掉所有 `queryDecoration` 开头的查询接口：

```sql
UPDATE communion.operation
SET through = 0
WHERE operation LIKE 'queryDecoration%';
```

### 关闸前自检（强烈建议）

对准备关闸的接口，先查"有没有 roleoperation 覆盖到所有该用的角色"。下面这条查出的是**关闸后会立即被拒绝的 (角色, 公司) 组合**：

```sql
-- 找出:关闸接口中,某些角色在该公司还没补到 roleoperation 的
-- (即收集期内该角色没调用过此接口 → 关闸即误杀)
SELECT
  r.rid, r.name AS role_name,
  o.operation, o.oid,
  c.cid AS company
FROM communion.role r
CROSS JOIN communion.operation o
CROSS JOIN (SELECT DISTINCT company FROM communion.roleoperation) c
LEFT JOIN communion.roleoperation ro
  ON ro.rid = r.rid AND ro.oid = o.oid AND ro.company = c.cid
WHERE o.through = 0                  -- 已关闸或准备关闸的接口
  AND ro.roid IS NULL                -- 没有 roleoperation 记录
  AND o.operation = '接口名'         -- 替换成具体接口
ORDER BY r.rid, c.cid;
```

> 这条 SQL 比较重（笛卡尔积），只在关闸前对**单个接口**跑，别全表跑。

### 关闸回滚

若关闸后出现批量报错，立即回滚：

```sql
UPDATE communion.operation
SET through = 1
WHERE operation = '出问题的接口名';
```

回滚是即时生效的，无需重启。

---

## 五、常规运维命令

### 查看哪些接口已关闸

```sql
SELECT oid, operation, name, through, type, status
FROM communion.operation
WHERE through = 0
ORDER BY oid;
```

### 查看某角色在某公司拥有的全部接口权限

```sql
SELECT o.operation, o.name, ro.company, ro.createTime
FROM communion.roleoperation ro
JOIN communion.operation o ON ro.oid = o.oid
WHERE ro.rid = ?      -- 角色ID
  AND ro.company = ?  -- 公司ID
ORDER BY o.operation;
```

### 手动给某角色补一个接口权限（关闸后正常运维）

```sql
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
VALUES (?, ?, ?, ?, NOW());
```

> `cuid` 是操作人 uid，`createTime` 用 NOW()。

### 禁用一个接口（不再被任何角色调用）

```sql
-- status=1 禁用后,queryRoleOperation 查询会自动过滤掉(status=0 才算)
UPDATE communion.operation
SET status = 1
WHERE operation = '接口名';
```

---

## 六、应急处理

### 场景 1：关闸后某用户报"无操作权限"

1. 确认该用户角色（主角色 + 附加角色）：
   ```sql
   SELECT u.userId, u.currentName, r.rid, r.name
   FROM communion.user u
   JOIN communion.role r ON u.roleId = r.rid
   WHERE u.userId = '?';
   -- 附加角色
   SELECT ur.uid, r.rid, r.name
   FROM communion.userrole ur
   JOIN communion.role r ON ur.rid = r.rid
   JOIN communion.user u ON ur.uid = u.uid
   WHERE u.userId = '?';
   ```
2. 确认该接口在该公司有没有 roleoperation：
   ```sql
   SELECT * FROM communion.roleoperation
   WHERE oid = (SELECT oid FROM communion.operation WHERE operation = '?')
     AND company = ?;
   ```
3. 若缺失 → 手动补一条（见"手动补权限"SQL），或临时回滚 `through=1`。

### 场景 2：收集期数据库压力骤增

检查索引是否建成功：
```sql
SHOW INDEX FROM communion.roleoperation;
-- 应能看到 idx_rid_oid_company
```

若索引缺失，立即补建（见步骤 1）。补建期间可考虑临时回滚代码（替换回旧 class），但**不要**删除已收集的数据——它们是有效的。

### 场景 3：误删了 roleoperation 数据

```sql
-- 从 binlog 恢复,或:
-- 由于 through=1 的接口不校验,误删后只要把对应 operation 改回 through=1 即可临时放行
UPDATE communion.operation SET through = 1 WHERE operation IN ('受影响的接口');
```

---

## 七、流程时间线建议

| 阶段 | 时间 | 动作 |
|------|------|------|
| 准备 | Day 0 | 执行索引 SQL、记录基线、部署代码 |
| 收集 | Day 1 ~ Day 45 | 每日巡检、监控异常日志 |
| 收敛判断 | Day 30 起 | 连续 3~5 天新增趋零则视为收敛 |
| 试关闸 | 收敛后 | 选 5~10 个低风险接口（如纯查询）先关，观察 48 小时 |
| 分批关闸 | 试关闸无问题后 | 按模块小批关，每批观察 24~48 小时 |
| 全量关闸 | 全部分批完成 | 所有 operation `through=0` |

> 全量关闸后，`collectOperation` 仍会继续为新接口自动补全——这是**期望行为**：未来新增的 `.do` 接口会被自动登记（through=1），运维定期巡检发现后主动改 0，形成长期机制。

---

## 附：相关代码位置

| 文件 | 说明 |
|------|------|
| `src/com/fanglin/core/interceptor/AccessInterceptor.java` | 拦截器，补全调用点（行 96、行 159） |
| `src/com/fanglin/system/service/impl/OperationServiceImpl.java` | `collectOperation` 实现（行 276） |
| `src/com/fanglin/system/po/OperationPO.java` | operation 实体，`through`/`type` 常量定义 |
| `src/com/fanglin/system/po/RoleOperationPO.java` | roleoperation 实体 |
| `src/com/fanglin/system/dao/impl/RoleOperationDaoImpl.java` | 查询方法 `queryRoleOperation(rid, oid, company)` |
