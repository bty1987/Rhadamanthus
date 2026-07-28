# -*- coding: utf-8 -*-
"""
一次性数据导出脚本：拉取 communion.operation 全量 (oid, name, operation) 到 TSV。
仅执行 SELECT，复用 prod-readonly-rds 的只读连接，不破坏只读契约。
导出完成后即可删除本脚本。
"""
import io
import os
import sys

import pymysql

HOST = os.environ.get("PROD_RDS_HOST", "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com")
USER = os.environ.get("PROD_RDS_USER", "fanglin1918")
PASS = os.environ.get("PROD_RDS_PASS", "Fanglin1918!")
PORT = int(os.environ.get("PROD_RDS_PORT", "3306"))

OUT = sys.argv[1] if len(sys.argv) > 1 else r"D:\ERP\Rhadamanthus\scripts\operation_dump.tsv"

conn = pymysql.connect(
    host=HOST, port=PORT, user=USER, password=PASS,
    connect_timeout=20, read_timeout=60, autocommit=True, charset="utf8mb4",
)
try:
    cur = conn.cursor()
    cur.execute("SELECT oid, moduleId, name, operation FROM communion.operation ORDER BY oid")
    rows = cur.fetchall()
finally:
    conn.close()

with io.open(OUT, "w", encoding="utf-8", newline="") as fh:
    fh.write("oid\tmoduleId\tname\toperation\n")
    for oid, mid, name, op in rows:
        mid = "" if mid is None else str(mid)
        name = "" if name is None else name
        op = "" if op is None else op
        fh.write("%s\t%s\t%s\t%s\n" % (oid, mid, name, op))

print("exported %d rows to %s" % (len(rows), OUT))
