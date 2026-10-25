# -*- coding: utf-8 -*-
"""
esign_signet_auth_progress.py — e签宝印章认证进度巡检(按时间点拉报表)

批量铺章/批量出链接后的进度跟踪: 按公司汇总 e签宝印章(provider=2)的认证状态,
输出 待认证/认证中(链接已生成未点)/已认证/已作废 分布 + 未完成清单, 盯批量分发进度用。
只读, 随时可跑; 正式环境切配后同款可复用。

用法:
    python esign_signet_auth_progress.py                  # 全公司汇总
    python esign_signet_auth_progress.py --detail 43      # 只看某公司明细
    python esign_signet_auth_progress.py --out report.csv # 明细落CSV
"""
import argparse
import csv
import sys

import pymysql

HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"

SUMMARY_SQL = (
    "SELECT s.company, IFNULL(c.fullname, '') AS fullname, "
    "COUNT(*) AS total, "
    "SUM(s.status IN (0,1)) AS pending, "          # 待生成/待点链接
    "SUM(s.status = 2) AS authing, "               # 链接已生成, 待经办人点(认证中)
    "SUM(s.status = 3 AND s.signno IS NOT NULL AND s.signno != '') AS confirmed, "  # 已认证(orgId回写)
    "SUM(s.status = 5) AS cancelled "
    "FROM data.signet s LEFT JOIN communion.company c ON c.cid = s.company "
    "WHERE s.provider = 2 {cond} "
    "GROUP BY s.company, c.fullname "
    "HAVING total > cancelled "
    "ORDER BY confirmed DESC, total DESC"
)

DETAIL_SQL = (
    "SELECT s.sid, s.company, IFNULL(c.fullname, '') AS fullname, s.no, s.name, s.status, "
    "CASE s.status WHEN 0 THEN '待生成链接' WHEN 1 THEN '待点链接(已铺)' WHEN 2 THEN '认证中(链接已生成,待经办人点)' "
    "WHEN 3 THEN CASE WHEN s.signno IS NOT NULL AND s.signno != '' THEN '已认证' ELSE '已确认但无orgId(异常)' END "
    "WHEN 5 THEN '已作废' ELSE s.status END AS state, "
    "CASE WHEN s.authurl IS NOT NULL AND s.authurl != '' THEN LEFT(s.authurl, 60) ELSE '' END AS authurl_prefix, "
    "LEFT(IFNULL(s.signno, ''), 16) AS orgid_prefix "
    "FROM data.signet s LEFT JOIN communion.company c ON c.cid = s.company "
    "WHERE s.provider = 2 {cond} ORDER BY s.company, s.sid"
)

STATUS_LABEL = {0: "待生成链接", 1: "待点链接", 2: "认证中", 3: "已认证", 5: "已作废"}


def query(sql):
    conn = pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            cols = [d[0] for d in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
    finally:
        conn.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--company", type=int, default=None, help="只看某公司")
    ap.add_argument("--out", default=None, help="明细落CSV路径")
    args = ap.parse_args()

    cond = "AND s.company = %d" % args.company if args.company else ""

    summary = query(SUMMARY_SQL.format(cond=cond))
    total = dict(pending=0, authing=0, confirmed=0)
    for r in summary:
        for k in total:
            total[k] += int(r[k] or 0)

    print("=" * 78)
    print("e签宝印章认证进度  (provider=2, 汇总 %d 家公司)" % len(summary))
    print("=" * 78)
    print("%-6s %-28s %5s %8s %8s %8s" % ("公司", "名称", "总数", "待点", "认证中", "已认证"))
    print("-" * 78)
    for r in summary:
        print("%-6s %-28s %5s %8s %8s %8s" % (
            r["company"], (r["fullname"] or "-")[:26], r["total"], r["pending"], r["authing"], r["confirmed"]))
    print("-" * 78)
    print("合计: 待点/待生成 %d, 认证中(链接已发未点) %d, 已认证 %d" % (total["pending"], total["authing"], total["confirmed"]))
    print()
    print("口径: 认证中=脚本已出链接且经办人未点完; 链接过期(点开失效)则重跑 esign_signet_auth_batch.py 换新链接(幂等,旧authFlowId作废)")
    print("完成标准: 待点+认证中 = 0; 已认证 = 铺章总数")

    detail = query(DETAIL_SQL.format(cond=cond))

    if args.out:
        with open(args.out, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["sid", "company", "company_name", "no", "name", "status", "state", "authurl_prefix", "orgid_prefix"])
            for d in detail:
                w.writerow([d[k] for k in ("sid", "company", "fullname", "no", "name", "status", "state", "authurl_prefix", "orgid_prefix")])
        print("\n明细 %d 行已写 %s" % (len(detail), args.out))
    elif args.company:
        print("\n明细:")
        for d in detail:
            print("  sid=%-4s %-14s %-24s [%s]" % (d["sid"], d["no"], d["name"], d["state"]))


if __name__ == "__main__":
    sys.exit(main())
