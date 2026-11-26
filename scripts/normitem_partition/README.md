# normitem 三表 RANGE 分区 — 半夜定时执行包

方案依据: `sqls/quotation/41_normitem_range_partition.sql`（RANGE(qid) 每 10 万 qid 一段 + MAXVALUE 兜底）。

## 使用步骤（生产侧一次性准备）

1. 把本目录整个传到任一**可连生产主库**的 ECS（应用服务器即满足）
2. 编辑 `partition_normitem.sh` 头部 `DB_HOST/DB_PORT/DB_USER/DB_PASS` 四项（生产主库连接，账号需 DDL 权限，可照应用 jdbc.properties 同源信息）
3. `chmod +x partition_normitem.sh`
4. **首次先手动跑 time 试点段验证脚本可用**（脚本按 time→ood→rice 顺序断点续跑，手动停在第 time 步的方式：先注释掉 ood/rice 两段再跑；或信任幂等守卫直接挂定时）
5. 挂定时（每日 02:00 触发）：

```bash
crontab -e
# 追加一行:
0 2 * * * /bin/bash /path/to/partition_normitem.sh >> /path/to/logs/cron.log 2>&1
```

## 幂等与断点续跑

- 已分区的表自动跳过（information_schema 守卫），全部完成后每日触发秒退
- 单表 ALTER 失败（如锁超时）即停，已完成表不受影响，次日定时自动从失败表重试
- 前置守卫：`max(qid) ≥ 100 万` 时拒绝执行（pmax 兜底段将承接存量+增量），提示先扩段边界（41 号段5 模板）

## 验证与回滚

- 日志：`logs/partition_YYYYMMDD.log`，每表完成后输出 `partitions=11` + 行数守恒
- 裁剪验证：脚本末尾 `EXPLAIN PARTITIONS` 应命中单分区
- 回滚：`ALTER TABLE <表> REMOVE PARTITIONING`（重建回单表）；RDS 快照为最终底牌
- 失败排查：`target/compile-errors.log` 不适用（本包纯 SQL）；看 mysql 报错段（日志内）

## 配套代码（同批发版）

- confirm/reject 双键化（quotation jar 8.3.031，519169B）：分区后按主键裸改=全分区扫描，已改 `qid+主键` 双条件
- jar 与分区先后无依赖（双键化 SQL 在单表状态同样正确），但建议**先发 jar 再跑分区**
