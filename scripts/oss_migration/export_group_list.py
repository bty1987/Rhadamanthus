# -*- coding: utf-8 -*-
"""从生产只读RDS导出指定group的文件清单(权威列表):
   python -I scripts/oss_migration/export_group_list.py group1 out/g1_dblist.txt
   输出行: <磁盘相对路径>\t<DB filesize>   (相对路径 = path 去掉 groupN/M00/ 前缀)
"""
import os
import sys

import pymysql

RDS = dict(
    host="rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com",
    port=3306, user="fanglin1918", password="Fanglin1918!",
    charset="utf8mb4", connect_timeout=15, read_timeout=600,
)
PREFIX_LEN = len("group1/M00/")


def main():
    group, out_file = sys.argv[1], sys.argv[2]
    like = f"{group}/%"

    conn = pymysql.connect(**RDS)
    cur = conn.cursor()
    cur.execute(
        "SELECT path, filesize FROM decoration.decorationpicture WHERE path LIKE %s",
        (like,),
    )

    n = 0
    seen = set()
    with open(out_file, "w", encoding="utf-8", newline="\n") as f:
        while True:
            rows = cur.fetchmany(5000)
            if not rows:
                break
            buf = []
            for path, size in rows:
                rel = path[PREFIX_LEN:] if path.startswith("group") else path
                if not rel or "/" not in rel or rel in seen:
                    continue
                seen.add(rel)
                buf.append(f"{rel}\t{size or 0}")
            f.write("\n".join(buf) + "\n")
            n += len(buf)
    conn.close()
    print(f"{group}: exported {n} rows -> {out_file}")


if __name__ == "__main__":
    main()
