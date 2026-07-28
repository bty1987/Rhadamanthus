# -*- coding: utf-8 -*-
"""
读取 operation_module_map.tsv, 生成 "临时表 + 连表更新" SQL 脚本。
模式:
  1. DROP (IF EXISTS) + CREATE TEMPORARY TABLE tmp_operation_module (oid INT, moduleId INT)
  2. 批量 INSERT INTO tmp_operation_module VALUES (...),(...)  -- 每批 100 条
  3. UPDATE communion.operation o JOIN tmp_operation_module t ON o.oid = t.oid
            SET o.moduleId = t.moduleId
  4. SELECT 校验: 统计更新前后 moduleId 为空的数量, 以及分布
  5. DROP TEMPORARY TABLE

事务包裹: 整个脚本在一个事务里执行, 保证原子性。
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

BATCH = 100


def chunked(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


lines = []
A = lines.append

A("-- ============================================================================")
A("-- communion.operation.moduleId 批量补全脚本")
A("-- 模式: 临时表插入映射数据 + 连表 UPDATE (单事务原子)")
A("-- ")
A("-- 背景:")
A("--   operation.moduleId 在生产库 1343 条全空 (字段为手工维护, 自动注册时未填)。")
A("--   本脚本依据 operation 字段(Action 方法名)的业务关键词, 归类到 24 个一级模块。")
A("--   归类规则见 scripts/classify_module.py (1343 条全覆盖, 0 遗漏)。")
A("-- ")
A("-- 执行前: 建议先备份 communion.operation (mysqldump 单表)。")
A("-- 执行后: 脚本末尾的 SELECT 会校验 moduleId 空值归零 + 各模块分布。")
A("-- ============================================================================")
A("")
A("START TRANSACTION;")
A("")
A("-- ---------- 1. 建临时表 ----------")
A("DROP TEMPORARY TABLE IF EXISTS tmp_operation_module;")
A("CREATE TEMPORARY TABLE tmp_operation_module (")
A("    oid       INT NOT NULL PRIMARY KEY,")
A("    moduleId  INT NOT NULL")
A(") ENGINE=Memory;")
A("")
A("-- ---------- 2. 批量插入映射数据 (%d 条, 每批 %d) ----------" % (len(rows), BATCH))
for i, batch in enumerate(chunked(rows, BATCH), 1):
    vals = ",".join("(%d,%d)" % (oid, mid) for oid, mid in batch)
    A("INSERT INTO tmp_operation_module (oid, moduleId) VALUES %s;" % vals)
A("")
A("-- ---------- 3. 连表更新 operation.moduleId ----------")
A("-- 仅更新临时表覆盖的 oid, 其余 operation 不受影响")
A("UPDATE communion.operation o")
A("    INNER JOIN tmp_operation_module t ON o.oid = t.oid")
A("SET o.moduleId = t.moduleId;")
A("")
A("-- ---------- 4. 校验 ----------")
A("-- 4.1 moduleId 为空的数量 (期望: 0)")
A("SELECT COUNT(*) AS empty_moduleId_count")
A("FROM communion.operation")
A("WHERE moduleId IS NULL OR moduleId = 0;")
A("")
A("-- 4.2 各模块 operation 数量分布")
A("SELECT m.mid, m.name AS module_name, COUNT(o.oid) AS op_count")
A("FROM communion.operation o")
A("    LEFT JOIN communion.module m ON o.moduleId = m.mid")
A("GROUP BY m.mid, m.name")
A("ORDER BY op_count DESC;")
A("")
A("-- ---------- 5. 清理临时表 ----------")
A("DROP TEMPORARY TABLE IF EXISTS tmp_operation_module;")
A("")
A("-- 确认无误后提交; 如需回滚, 把下一行改为 ROLLBACK 后重新执行整段")
A("COMMIT;")
A("")

with io.open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("\n".join(lines))

print("generated %s" % OUT)
print("  rows: %d" % len(rows))
print("  insert batches: %d (x%d)" % ((len(rows) + BATCH - 1) // BATCH, BATCH))
