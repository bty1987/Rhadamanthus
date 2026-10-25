# -*- coding: utf-8 -*-
"""
esign_contract_row_import.py — e签宝合同模板行批量导入(SQL 生成器)

e签宝控制台建模板(唯一硬人工环节, 服务端无创建模板API; 模板是应用级的, 一个 docTemplateId 全公司通用)
完成后, 用本工具批量生成 data.contract 新行 INSERT SQL(path=esign://docTemplateId,
page/name/title/atttype 复用源法大大行, 老行并存不停用)。

两种模式:

【模式1 CSV 精确导入】逐行指定公司:
    python esign_contract_row_import.py templates.csv
    CSV 列: company,cid_of_source_row,esign_template_id[,new_name]
      company           = 目标公司 cid
      cid_of_source_row = 参照的既有模板行(取其 page/name/title/atttype)
      esign_template_id = e签宝 docTemplateId
      new_name          = 可选, 缺省 "【e签宝】"+源行名

【模式2 同名铺开】仅限同名且底稿逐字一致的场景(如集团统一文本"初见合同"24家):
    python esign_contract_row_import.py --spread <源行cid> <docTemplateId> [--only 43,1] [--exclude 90]
      自动找出与源行同名同 atttype 的全部模板行所在公司, 逐公司生成;
      --only/--exclude 控制公司范围; 幂等, 可随新 docTemplateId 追加执行。
      🔴适用边界: 实证有效模板945行中92%(659/717名)为单公司独有底稿——每公司每类合同
      底稿独立, 跨公司共用 docTemplate 仅限集团统一文本; 常规迁移主路径=模式1 CSV 逐行
      精确导入(每公司每类合同一个独立 docTemplate)。

输出到 stdout, 人工核对后落盘 sqls/elecsign/ 执行(先跑预览 SELECT 再 INSERT)。
"""
import argparse
import csv
import sys

import pymysql

HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"


def esc(v):
    return (v or "").replace("\\", "\\\\").replace("'", "\\'")


def connect():
    return pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60, charset="utf8mb4")


def emit_insert(cur, company, template_id, src, new_name=""):
    """按源行+docTemplateId 打印一条幂等 INSERT(含 DUP 预检), 返回是否生成"""
    src_cid, src_no, src_name, src_title, src_page, atttype = src
    path = "esign://" + template_id

    cur.execute("SELECT COUNT(*) FROM data.contract WHERE company = %s AND path = %s", (company, path))
    if cur.fetchone()[0] > 0:
        print("-- [DUP] company=%s esign://%s 已存在, 跳过" % (company, template_id))
        return False

    name = new_name or ("【e签宝】" + (src_name or ""))
    no = "ESIGN-" + template_id[:16]
    print(
        "INSERT INTO data.contract (no, name, title, page, path, status, atttype, company) "
        "SELECT '%s', '%s', '%s', '%s', '%s', 0, %s, %s FROM DUAL "
        "WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE company = %s AND path = '%s');"
        % (esc(no), esc(name), esc(src_title or ""), esc(src_page or ""), esc(path),
           atttype, company, company, esc(path))
    )
    print("-- ^ company=%s 源cid=%s name=%s\n" % (company, src_cid, name))
    return True


def mode_spread(conn, args):
    """模式2: 源行cid + docTemplateId → 同名同atttype行所在公司全铺"""
    cur = conn.cursor()
    cur.execute("SELECT cid, no, name, title, page, atttype, company FROM data.contract WHERE cid = %s", (args.spread[0],))
    row = cur.fetchone()
    if not row:
        sys.exit("源模板行 cid=%s 不存在" % args.spread[0])
    src = row[:6]
    print("-- [spread] 源行 cid=%s name='%s' atttype=%s → docTemplate %s" % (src[0], src[2], src[5], args.spread[1]))
    print("-- 预览: SELECT company, cid, name, path FROM data.contract WHERE name = '%s' AND atttype = %s;\n" % (esc(src[2]), src[5]))

    only = set(int(x) for x in args.only.split(",")) if args.only else None
    exclude = set(int(x) for x in args.exclude.split(",")) if args.exclude else set()

    cur.execute(
        "SELECT company, cid FROM data.contract WHERE name = %s AND atttype = %s ORDER BY company",
        (src[2], src[5]),
    )
    companies = cur.fetchall()

    ok = dup = 0
    for company, src_cid in companies:
        if only is not None and company not in only:
            continue
        if company in exclude:
            continue
        if emit_insert(cur, company, args.spread[1], src):
            ok += 1
        else:
            dup += 1

    print("-- spread 完成: 生成 %d 条(跳过已存在 %d, 范围外自动略过)" % (ok, dup))
    print("-- 验证: SELECT company, cid, no, name, path FROM data.contract WHERE path = 'esign://%s' ORDER BY company;" % esc(args.spread[1]))


def mode_csv(conn, path):
    """模式1: CSV 逐行导入"""
    cur = conn.cursor()
    with open(path, encoding="utf-8-sig") as f:
        sample = f.read(4096)
        f.seek(0)
        has_header = not sample.splitlines()[0].split(",")[0].strip().isdigit()
        reader = csv.reader(f)
        if has_header:
            next(reader, None)
        rows = [r for r in reader if r and [c for c in r if c.strip()]]
    if not rows:
        sys.exit("输入为空")

    print("-- CSV 导入(执行前先跑预览 SELECT)\n")
    ok = miss = dup = 0
    for i, r in enumerate(rows):
        if len(r) < 3:
            print("-- [SKIP] 第 %d 行列数不足(company,cid_of_source_row,esign_template_id[,new_name]): %s" % (i + 1, r))
            continue
        company, src_cid, template_id = int(r[0]), int(r[1]), r[2].strip()
        new_name = r[3].strip() if len(r) > 3 else ""

        cur.execute("SELECT cid, no, name, title, page, atttype, company FROM data.contract WHERE cid = %s", (src_cid,))
        src = cur.fetchone()
        if not src:
            print("-- [MISS] 源模板行 cid=%s 不存在, 跳过" % src_cid)
            miss += 1
            continue

        if emit_insert(cur, company, template_id, src, new_name):
            ok += 1
        else:
            dup += 1

    print("-- CSV 完成: 生成 %d 条(源缺失 %d / 已存在 %d)" % (ok, miss, dup))
    print("-- 验证: SELECT company, cid, no, name, path FROM data.contract WHERE path LIKE 'esign://%%' ORDER BY company;")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csvfile", nargs="?", default=None, help="模式1: CSV 文件路径")
    ap.add_argument("--spread", nargs=2, metavar=("源行cid", "docTemplateId"), default=None, help="模式2: 全公司铺开")
    ap.add_argument("--only", default=None, help="模式2: 只铺这些公司(逗号分隔)")
    ap.add_argument("--exclude", default=None, help="模式2: 排除这些公司(逗号分隔)")
    args = ap.parse_args()

    if not args.csvfile and not args.spread:
        ap.print_help()
        sys.exit(1)

    conn = connect()
    try:
        if args.spread:
            mode_spread(conn, args)
        else:
            mode_csv(conn, args.csvfile)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
