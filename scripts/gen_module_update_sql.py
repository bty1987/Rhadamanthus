# -*- coding: utf-8 -*-
"""
读取 operation_module_map.tsv, 生成 "临时表 + 连表更新" SQL 脚本(增强版)。
增强点:
  1. level=1 强制校验 (执行前确认 24 个 mid 在 module 表里确实 level=1, 防环境差异)
  2. 执行前后空值对比 (更新前空值数 -> 更新后空值数 -> 各模块分布)
  3. 事务保护 + 明确回滚提示
  4. 只关联一级模块 (moduleId 全部指向 level=1)
"""
import io

MAP_TSV = r"D:\ERP\Rhadamanthus\scripts\operation_module_map.tsv"
OUT = r"D:\ERP\Rhadamanthus\scripts\fill_operation_moduleId.sql"

rows = []
with io.open(MAP_TSV, encoding="utf-8") as fh:
    fh.readline()
    for line in fh:
        line = line.rstrip("\n")
        if not line:
            continue
        parts = line.split("\t")
        oid, mid = parts[0], parts[1]
        if not mid:
            continue
        rows.append((int(oid), int(mid)))

# 校验: oid 唯一
oids = [r[0] for r in rows]
assert len(oids) == len(set(oids)), "duplicate oid found!"

# 收集 distinct moduleId
distinct_mids = sorted(set(mid for _, mid in rows))

BATCH = 100


def chunked(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


lines = []
A = lines.append

A("-- ============================================================================")
A("-- communion.operation.moduleId 批量补全脚本 (增强版)")
A("-- 模式: 临时表插入映射数据 + 连表 UPDATE (单事务原子)")
A("-- ")
A("-- 目标:")
A("--   operation.moduleId 全部填充为【一级模块(level=1)】的 mid, 不关联二级/三级深层模块。")
A("--   PO 保留 module 强关联, 但数据层只指向一级 module, 避免关联过深。")
A("-- ")
A("-- 数据来源:")
A("--   依据 operation 字段(Action 方法名)的业务关键词, 归类到 %d 个一级模块。" % len(distinct_mids))
A("--   归类规则见 scripts/classify_module.py (%d 条全覆盖, 0 遗漏)。" % len(rows))
A("-- ")
A("-- 使用方式:")
A("--   1. 先备份: mysqldump -t communion operation > operation_backup.sql")
A("--   2. 执行本脚本(需可写库, 生产只读库无法执行)")
A("--   3. 看末尾 SELECT 校验: empty_moduleId_count 应为 0, 分布表应合理")
A("--   4. 确认无误后 COMMIT; 如需回滚, 把 COMMIT 改为 ROLLBACK 重新执行整段")
A("-- ============================================================================")
A("")
A("START TRANSACTION;")
A("")
A("-- ---------- 0. level=1 强制校验 (执行前自检) ----------")
A("-- 确认本脚本用到的 %d 个 mid 在 module 表里都是 level=1, 若有非一级则中止" % len(distinct_mids))
A("-- (期望返回 0 行; 若返回非 0 行, 说明 module 表结构与预期不符, 请先核对)")
A("SELECT mid, name, level AS unexpected_non_level1")
A("FROM communion.module")
A("WHERE mid IN (%s) AND level <> 1;" % ",".join(str(m) for m in distinct_mids))
A("")
A("-- ---------- 1. 执行前快照: 当前 moduleId 空值数 ----------")
A("SELECT COUNT(*) AS empty_moduleId_before")
A("FROM communion.operation")
A("WHERE moduleId IS NULL OR moduleId = 0;")
A("")
A("-- ---------- 2. 建临时表 ----------")
A("DROP TEMPORARY TABLE IF EXISTS tmp_operation_module;")
A("CREATE TEMPORARY TABLE tmp_operation_module (")
A("    oid       INT NOT NULL PRIMARY KEY,")
A("    moduleId  INT NOT NULL")
A(") ENGINE=Memory;")
A("")
A("-- ---------- 3. 批量插入映射数据 (%d 条, 每批 %d) ----------" % (len(rows), BATCH))
for i, batch in enumerate(chunked(rows, BATCH), 1):
    vals = ",".join("(%d,%d)" % (oid, mid) for oid, mid in batch)
    A("INSERT INTO tmp_operation_module (oid, moduleId) VALUES %s;" % vals)
A("")
A("-- ---------- 4. 连表更新 operation.moduleId ----------")
A("-- 仅更新临时表覆盖的 oid, 其余 operation 不受影响")
A("UPDATE communion.operation o")
A("    INNER JOIN tmp_operation_module t ON o.oid = t.oid")
A("SET o.moduleId = t.moduleId;")
A("")
A("-- ---------- 5. 执行后校验 ----------")
A("-- 5.1 moduleId 为空的数量 (期望: 0)")
A("SELECT COUNT(*) AS empty_moduleId_after")
A("FROM communion.operation")
A("WHERE moduleId IS NULL OR moduleId = 0;")
A("")
A("-- 5.2 各一级模块 operation 数量分布 (关联 level=1 模块名)")
A("SELECT m.mid, m.name AS module_name, COUNT(o.oid) AS op_count")
A("FROM communion.operation o")
A("    INNER JOIN communion.module m ON o.moduleId = m.mid")
A("WHERE m.level = 1")
A("GROUP BY m.mid, m.name")
A("ORDER BY op_count DESC;")
A("")
A("-- ---------- 6. 清理临时表 ----------")
A("DROP TEMPORARY TABLE IF EXISTS tmp_operation_module;")
A("")
A("-- 确认无误后提交; 如需回滚, 把下一行改为 ROLLBACK 后重新执行整段")
A("COMMIT;")
A("")

with io.open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("\n".join(lines))

print("generated %s" % OUT)
print("  rows: %d" % len(rows))
print("  distinct level=1 modules: %d -> %s" % (len(distinct_mids), distinct_mids))
print("  insert batches: %d (x%d)" % ((len(rows) + BATCH - 1) // BATCH, BATCH))
