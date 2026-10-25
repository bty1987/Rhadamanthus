# -*- coding: utf-8 -*-
"""
esign_signet_orgid_pull.py — 正式环境已实名企业批量拉取, orgId 直接回填签章

切正式后的加速器: 逐章按印章名(=企业主体名)直查 e签宝正式网关 identity-info——
该主体此前已在正式应用实名过的(realnameStatus=1)直接取 orgId 回填(status=3),
跳过人工点链接; 未实名的输出清单交给 esign_signet_auth_batch.py 出认证链接。
identity-info 为只读接口, 本脚本不写库——回填 SQL 落盘人工核对后执行。

用法:
    python esign_signet_orgid_pull.py --cred target/esign-local.json \
        [--out-sql sqls/elecsign/22_signet_orgid_pull_backfill.sql] \
        [--out-pending pending_signets.csv] [--sleep 0.2]
cred 文件: {"host": "https://openapi.esign.cn", "appId": "...", "appSecret": "..."}
"""
import argparse
import csv
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pymysql  # noqa: E402
import esign_flow  # noqa: E402

HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"

PENDING_SQL = (
    "SELECT s.sid, s.company, IFNULL(c.fullname, '') AS fullname, s.no, s.name "
    "FROM data.signet s LEFT JOIN communion.company c ON c.cid = s.company "
    "WHERE s.provider = 2 AND s.status IN (0, 1, 2) AND (s.signno IS NULL OR s.signno = '') "
    "{cond} ORDER BY s.company"
)


def esc(v):
    return (v or "").replace("\\", "\\\\").replace("'", "\\'")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cred", default="target/esign-local.json")
    ap.add_argument("--company", type=int, default=None, help="只拉某公司")
    ap.add_argument("--out-sql", default="sqls/elecsign/22_signet_orgid_pull_backfill.sql")
    ap.add_argument("--out-pending", default="esign_pending_realname.csv")
    ap.add_argument("--sleep", type=float, default=0.2)
    args = ap.parse_args()

    esign_flow.CRED = args.cred
    cred = json.load(open(args.cred, encoding="utf-8"))
    print("网关 %s appId=%s" % (cred["host"], cred["appId"]))

    conn = pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60, charset="utf8mb4")
    cond = "AND s.company = %d" % args.company if args.company else ""
    with conn.cursor() as cur:
        cur.execute(PENDING_SQL.format(cond=cond))
        seeds = cur.fetchall()  # sid, company, fullname, no, name
    conn.close()

    print("待核签章 %d 把, 逐把直查 identity-info...\n" % len(seeds))
    pulled, unknown, errors = [], [], []

    for sid, company, fullname, no, name in seeds:
        try:
            r = esign_flow.invoke("GET", "/v3/organizations/identity-info", query={"orgName": name})
            data = r.get("data") or {}
            code = str(r.get("code") or "")
            if r.get("code") == 0 and data.get("realnameStatus") == 1:
                pulled.append((sid, company, fullname, no, name, data["orgId"]))
                print("[PULL] company=%s(%s) %s '%s' -> orgId=%s (已实名, 免点链接)" % (company, fullname or "-", no, name, data["orgId"][:12]))
            elif r.get("code") == 0 or code == "1435203":
                # 1435203=正式应用无该企业档案(未实名), 与 code=0 未实名同归待点链接
                unknown.append((sid, company, fullname, no, name))
                print("[WAIT] company=%s %s '%s' 未实名 -> 走认证链接" % (company, no, name))
            else:
                errors.append((sid, company, no, name, "%s %s" % (r.get("code"), r.get("message"))))
                print("[ERR ] company=%s %s '%s': %s %s" % (company, no, name, r.get("code"), r.get("message")))
        except Exception as e:
            errors.append((sid, company, no, name, str(e)))
            print("[ERR ] company=%s %s '%s': %s" % (company, no, name, e))
        time.sleep(args.sleep)

    if pulled and args.out_sql:
        with open(args.out_sql, "w", encoding="utf-8", newline="\n") as f:
            f.write("-- =====================================================================\n")
            f.write("-- 文件: %s\n" % os.path.basename(args.out_sql))
            f.write("-- 用途: 正式环境已实名企业 orgId 批量回填签章(esign_signet_orgid_pull.py 生成)\n")
            f.write("--       该主体已在正式应用完成实名(identity-info realnameStatus=1), 直接取 orgId\n")
            f.write("--       等价完成机构认证, 跳过人工点链接; 未实名章走认证链接(bat脚本另出)\n")
            f.write("-- 前置条件: 21号配置切换已执行(正式凭证); 回填前核对下方清单企业主体\n")
            f.write("-- 回滚方式: UPDATE data.signet SET signno = NULL, status = 1 WHERE sid IN (<下列sid>) AND provider = 2;\n")
            f.write("-- 验证语句: SELECT sid, company, name, status, LEFT(signno,16) FROM data.signet WHERE provider = 2 AND status = 3;\n")
            f.write("-- 幂等性: 幂等(同值重复UPDATE无变化)\n-- =====================================================================\n\n")
            for sid, company, fullname, no, name, orgid in pulled:
                f.write("UPDATE data.signet SET signno = '%s', status = 3 WHERE sid = %d AND provider = 2 AND (signno IS NULL OR signno = '');\n" % (esc(orgid), sid))
            f.write("\n-- 共 %d 条(每条仅当该章尚无orgId时生效, 防覆盖)\n" % len(pulled))
        print("\n回填SQL已写 %s (%d条)" % (args.out_sql, len(pulled)))

    if args.out_pending:
        with open(args.out_pending, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["sid", "company", "company_name", "no", "name"])
            w.writerows(unknown)
        print("待实名清单已写 %s (%d把, 交 esign_signet_auth_batch.py 出认证链接)" % (args.out_pending, len(unknown)))

    print("\n汇总: 直接回填 %d / 待点链接 %d / 查询异常 %d" % (len(pulled), len(unknown), len(errors)))
    if errors:
        print("异常明细(多为网络抖动可重跑):")
        for sid, company, no, name, msg in errors[:10]:
            print("  sid=%s company=%s %s: %s" % (sid, company, name, msg))


if __name__ == "__main__":
    main()
