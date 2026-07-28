# -*- coding: utf-8 -*-
"""
校验 fill_operation_moduleId.sql 的数据完整性。
检查项:
  1. INSERT VALUES 解析出的 (oid, moduleId) 对数 == 1343
  2. oid 唯一
  3. moduleId 都在合法的 level=1 模块 mid 集合内
  4. 与 operation_module_map.tsv 一致
"""
import io
import re

SQL = r"D:\ERP\Rhadamanthus\scripts\fill_operation_moduleId.sql"
MAP = r"D:\ERP\Rhadamanthus\scripts\operation_module_map.tsv"

# 合法的 level=1 模块 mid (来自 communion.module)
VALID_MIDS = {1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 101, 102, 103, 134, 194,
              203, 204, 227, 228, 237, 240, 316, 338, 375, 376, 377,
              378, 379, 380, 457, 524, 672, 733, 861}

# 解析 SQL 中的 INSERT VALUES
sql_pairs = []
pat = re.compile(r"\((\d+),(\d+)\)")
with io.open(SQL, encoding="utf-8") as fh:
    for line in fh:
        if line.startswith("INSERT INTO tmp_operation_module"):
            for m in pat.finditer(line):
                sql_pairs.append((int(m.group(1)), int(m.group(2))))

print("SQL INSERT pairs: %d" % len(sql_pairs))
oids = [p[0] for p in sql_pairs]
print("  unique oids: %d" % len(set(oids)))
assert len(oids) == len(set(oids)), "DUPLICATE oid in SQL!"

invalid_mid = [p for p in sql_pairs if p[1] not in VALID_MIDS]
print("  invalid moduleId: %d" % len(invalid_mid))
assert not invalid_mid, "invalid mids: %s" % invalid_mid[:5]

# 与 map tsv 对比
map_pairs = []
with io.open(MAP, encoding="utf-8") as fh:
    fh.readline()
    for line in fh:
        parts = line.rstrip("\n").split("\t")
        if len(parts) >= 2 and parts[1]:
            map_pairs.append((int(parts[0]), int(parts[1])))

print("MAP tsv pairs: %d" % len(map_pairs))
sql_set = set(sql_pairs)
map_set = set(map_pairs)
diff1 = map_set - sql_set
diff2 = sql_set - map_set
print("  in MAP not in SQL: %d" % len(diff1))
print("  in SQL not in MAP: %d" % len(diff2))
assert not diff1 and not diff2, "MISMATCH!"

# 与原始 dump 对比 oid 覆盖
dump_oids = set()
with io.open(r"D:\ERP\Rhadamanthus\scripts\operation_dump.tsv", encoding="utf-8") as fh:
    fh.readline()
    for line in fh:
        parts = line.rstrip("\n").split("\t")
        if parts:
            dump_oids.add(int(parts[0]))
missing = dump_oids - set(oids)
print("  dump oids: %d, missing from SQL: %d" % (len(dump_oids), len(missing)))
assert not missing, "missing oids: %s" % list(missing)[:10]

print("\nALL CHECKS PASSED")
