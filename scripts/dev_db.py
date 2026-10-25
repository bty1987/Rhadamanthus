# -*- coding: utf-8 -*-
# dev(5.21)库直连小工具: 允许写(仅dev), SQL从argv[1]或--file读取
import sys
import pymysql

HOST = "192.168.5.21"
USER = "root"
PASS = "Neusoft!"
PORT = 3306

def main():
    sql = sys.argv[1]
    conn = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASS,
                           connect_timeout=15, read_timeout=60, autocommit=True, charset="utf8mb4")
    cur = conn.cursor()
    cur.execute(sql)
    if cur.description:
        headers = [d[0] for d in cur.description]
        rows = cur.fetchall()
        widths = [max(len(h), *(len(str(r[i])) for r in rows)) if rows else len(h) for i, h in enumerate(headers)]
        print(" | ".join(h.ljust(w) for h, w in zip(headers, widths)))
        print("-+-".join("-" * w for w in widths))
        for r in rows:
            print(" | ".join(str(c).ljust(w) for c, w in zip(r, widths)))
        print("[%d row(s)]" % len(rows))
    else:
        conn.commit()
        print("OK affected=%d" % cur.rowcount)
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
