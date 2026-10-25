# -*- coding: utf-8 -*-
"""
esign_signet_auth_batch.py — e签宝印章认证授权链接批量生成

双并行铺章后(19号SQL)的自动化第二步: 遍历待认证的 e签宝印章(provider=2, status=0/1),
逐个调 ERP authSignet.do 生成"机构实名+静默签授权"合一 H5 链接(服务端已带 authorizedScopes),
输出分发清单(CSV)交各公司经办人手机点完(约10分钟/家, 法律效力要求真人, 无法代点)。
经办人点完后 orgId 回写/状态推进走回调自动化, 无需再人工确认。

用法:
    python esign_signet_auth_batch.py --base https://service-erp.fanglin.vip/platform --auth <authentication>
    python esign_signet_auth_batch.py --base ... --auth ... --company 43      # 只处理某公司
    python esign_signet_auth_batch.py --base ... --auth ... --out links.csv   # 指定输出CSV

authentication 获取: 管理员登录 ERP 后从请求中取, 或用仓库 conf 的 AES key 构造
    (userId 必须为工号如 FL-00479, company=0)。
"""
import argparse
import csv
import json
import ssl
import sys
import urllib.parse
import urllib.request

import pymysql

# ---- 生产只读库(与 prod-readonly-rds/q.py 同款配置, 仅 SELECT) ----
HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

SEED_SQL = (
    "SELECT s.sid, s.company, s.no, s.name AS signet_name, s.status, c.fullname "
    "FROM data.signet s LEFT JOIN communion.company c ON c.cid = s.company "
    "WHERE s.provider = 2 AND s.status IN (0, 1) {company_cond} "
    "ORDER BY s.company"
)


def query_seed(company):
    conn = pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60)
    try:
        cond = "AND s.company = %d" % company if company else ""
        with conn.cursor() as cur:
            cur.execute(SEED_SQL.format(company_cond=cond))
            cols = [d[0] for d in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
    finally:
        conn.close()


def erp_post(base, auth, path, params):
    data = dict(params)
    data["authentication"] = auth
    body = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(base.rstrip("/") + path, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
    with urllib.request.urlopen(req, timeout=30, context=CTX) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True, help="ERP 基址, 生产=https://service-erp.fanglin.vip/platform")
    ap.add_argument("--auth", required=True, help="authentication 串")
    ap.add_argument("--company", type=int, default=None, help="只处理该公司(缺省全部铺建章)")
    ap.add_argument("--out", default="esign_signet_auth_links.csv", help="输出 CSV 路径")
    args = ap.parse_args()

    seeds = query_seed(args.company)
    if not seeds:
        print("无待认证 e签宝印章(先执行 19 号铺章 SQL)")
        return

    print("待认证印章 %d 个, 逐个生成认证授权链接...\n" % len(seeds))
    rows = []
    ok = fail = 0

    for s in seeds:
        try:
            r = erp_post(args.base, args.auth, "/authSignet.do", {"signet.sid": s["sid"]})
            link = ((r.get("signet") or {}).get("path")) or ""
            if r.get("errorCode") not in (0, None):
                raise RuntimeError(r.get("errorMsg") or ("errorCode=%s" % r.get("errorCode")))
            if not link:
                raise RuntimeError("响应无 signet.path")
            ok += 1
            print("[OK] company=%s(%s) %s %s\n     %s" % (s["company"], s["fullname"] or "-", s["no"], s["signet_name"], link))
        except Exception as e:
            fail += 1
            link = ""
            print("[FAIL] company=%s %s: %s" % (s["company"], s["signet_name"], e))

        rows.append([s["sid"], s["company"], s["fullname"] or "", s["no"], s["signet_name"], link])

    with open(args.out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["sid", "company", "company_name", "signet_no", "signet_name", "auth_link"])
        w.writerows(rows)

    print("\n完成: 成功 %d / 失败 %d, 清单已写 %s" % (ok, fail, args.out))
    print("后续: 各公司经办人手机点链接(实名+授权合一, 约10分钟) -> 回调自动回写 orgId/status=3")
    print("核验: SELECT company, no, status, signno FROM data.signet WHERE provider = 2 ORDER BY company;")


if __name__ == "__main__":
    sys.exit(main())
