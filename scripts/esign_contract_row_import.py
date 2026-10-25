# -*- coding: utf-8 -*-
"""
esign_contract_row_import.py — e签宝合同模板行批量导入(SQL 生成器)

双并行铺模板的自动化步骤: e签宝控制台建模板(唯一硬人工环节, 服务端无创建模板API)
完成后, 把 docTemplateId 清单交给本工具, 批量生成 data.contract 新行 INSERT SQL
(path=esign://docTemplateId, page 复用原法大大表单页, 老行并存不停用)。

输入 CSV 两列+可选四列(UTF-8, 无表头或带表头均可):
    company,cid_of_source_row,esign_template_id[,new_name]
    company         = 目标公司 cid(0=全局)
    cid_of_source_row = 参照的既有模板行(取其 page/name/title/atttype; 该行应是法大大模板)
    esign_template_id = e签宝控制台拿到的 docTemplateId
    new_name        = 可选, 缺省 "【e签宝】"+源行名

用法:
    python esign_contract_row_import.py templates.csv > 20_signet_contract_rows.sql
然后人工核对生成的 SQL 落盘 sqls/elecsign/ 执行(先 SELECT 预览再 INSERT)。
"""
import csv
import sys

import pymysql

HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"

LOOKUP_SQL = "SELECT cid, no, name, title, page, atttype, company FROM data.contract WHERE cid = %d"


def esc(v):
    return (v or "").replace("\\", "\\\\").replace("'", "\\'")


def read_rows(path):
    with open(path, encoding="utf-8-sig") as f:
        sample = f.read(4096)
        f.seek(0)
        has_header = not sample.splitlines()[0].split(",")[0].strip().isdigit()
        reader = csv.reader(f)
        if has_header:
            next(reader, None)
        for i, r in enumerate(reader):
            if not r or not [c for c in r if c.strip()]:
                continue
            if len(r) < 3:
                sys.exit("第 %d 行列数不足(company,cid_of_source_row,esign_template_id[,new_name]): %s" % (i + 1, r))
            yield int(r[0]), int(r[1]), r[2].strip(), (r[3].strip() if len(r) > 3 else "")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    rows = list(read_rows(sys.argv[1]))
    if not rows:
        sys.exit("输入为空")

    conn = pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60)
    print("-- e签宝合同模板行批量导入(生成于 esign_contract_row_import.py, 执行前先跑预览 SELECT)")
    print("-- 幂等守卫: 同 company+path 已存在则跳过; 回滚 = DELETE 对应行(no LIKE 'ESIGN-%')\n")

    ok = miss = dup = 0
    try:
        for company, src_cid, template_id, new_name in rows:
            with conn.cursor() as cur:
                cur.execute(LOOKUP_SQL % src_cid)
                src = cur.fetchone()
            if not src:
                print("-- [MISS] 源模板行 cid=%d 不存在, 跳过" % src_cid)
                miss += 1
                continue

            with conn.cursor() as cur:
                cur.execute(
                    "SELECT COUNT(*) FROM data.contract WHERE company = %d AND path = '%s'"
                    % (company, esc("esign://" + template_id))
                )
                if cur.fetchone()[0] > 0:
                    print("-- [DUP] company=%d esign://%s 已存在, 跳过" % (company, template_id))
                    dup += 1
                    continue

            _, src_no, src_name, src_title, src_page, atttype, _ = src
            name = new_name or ("【e签宝】" + (src_name or ""))
            no = "ESIGN-" + template_id[:16]
            print(
                "INSERT INTO data.contract (no, name, title, page, path, status, atttype, company) "
                "SELECT '%s', '%s', '%s', '%s', 'esign://%s', 0, %d, %d FROM DUAL "
                "WHERE NOT EXISTS (SELECT 1 FROM data.contract WHERE company = %d AND path = 'esign://%s');"
                % (esc(no), esc(name), esc(src_title or ""), esc(src_page or ""), esc(template_id),
                   atttype, company, company, esc(template_id))
            )
            print("-- ^ company=%d 源cid=%d name=%s\n" % (company, src_cid, name))
            ok += 1
    finally:
        conn.close()

    print("-- 生成 %d 条 INSERT(跳过: 源缺失 %d / 已存在 %d)" % (ok, miss, dup))
    print("-- 验证: SELECT company, cid, no, name, path FROM data.contract WHERE path LIKE 'esign://%' ORDER BY company;")


if __name__ == "__main__":
    main()
