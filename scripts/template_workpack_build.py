# -*- coding: utf-8 -*-
"""
template_workpack_build.py — e签宝模板迁移工作包生成器

把指定公司的全部有效模板打包成"控制台建模板流水线工作包":
  drafts/           底稿PDF(按 公司_cid_no_名称 命名, 从fastdfs下载)
  workpack.md       操作卡(每模板: 底稿文件/控件key清单/签章锚点检查结果)
  id_backfill.csv   docTemplateId回填清单模板(控制台建完后填此表交esign_contract_row_import.py)

控件key=表单HTML的input id(con-*/cov-*/sin-*), 与e签宝模板控件key同源(5.21已验证对齐);
纯签收类模板可零控件(只设签章区); 表单传模板没有的key静默忽略——控件可少配。

用法:
    python template_workpack_build.py --company 55,57 [--out target/template_workpack]
"""
import argparse
import os
import re
import subprocess
import sys
import urllib.request

import pymysql

HOST = "rr-2zeu742hyrc68mn5o3o.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"
MEDIA = "http://192.168.5.101/"  # fastdfs文件服务器(5.21是ERP应用服务器无文件)
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEW_DIR = os.path.join(REPO, "WebContent", "views", "contract")
ANCHOR = "乙方（盖章）"

LIST_SQL = (
    "SELECT c.cid, c.company, c.no, c.name, c.atttype, c.page, c.path "
    "FROM data.contract c WHERE c.company IN ({comps}) AND c.status = 0 "
    "ORDER BY c.company, c.cid"
)


def fetch_templates(companies):
    conn = pymysql.connect(host=HOST, user=USER, password=PASS, connect_timeout=20, read_timeout=60, charset="utf8mb4")
    try:
        with conn.cursor() as cur:
            cur.execute(LIST_SQL.format(comps=",".join(str(c) for c in companies)))
            return cur.fetchall()
    finally:
        conn.close()


def download(path, dest):
    """先本机直连fastdfs, 失败走5.21 SSH(内网通道)"""
    url = MEDIA + path
    try:
        urllib.request.urlretrieve(url, dest)
        return "direct"
    except Exception:
        try:
            r = subprocess.run(["ssh", "root@5.21", "curl -s --max-time 30 'http://127.0.0.1/%s'" % path],
                               capture_output=True, timeout=60)
            if r.returncode == 0 and len(r.stdout) > 500:
                open(dest, "wb").write(r.stdout)
                return "ssh521"
        except Exception:
            pass
    return None


def anchor_check(pdf_path):
    """提取PDF文本查签章锚点关键字, 返回 (命中页数, 总页数) 或 None(无法解析)"""
    try:
        import pymupdf
        doc = pymupdf.open(pdf_path)
        hit = 0
        for page in doc:
            if ANCHOR in page.get_text():
                hit += 1
        n = doc.page_count
        doc.close()
        return (hit, n)
    except Exception:
        return None


def control_keys(page_col):
    """page列(如 /views/contract/C-001-D-8-0001.html?type=0)→表单HTML提取控件id"""
    m = re.search(r"([A-Z0-9-]+\.html)", page_col or "")
    if not m:
        return [], None
    fname = m.group(1)
    html_path = os.path.join(VIEW_DIR, fname)
    if not os.path.exists(html_path):
        return [], fname
    ids = sorted(set(re.findall(r'id="((?:con|cov|sin)-[a-zA-Z0-9-]+)"', open(html_path, encoding="utf-8", errors="ignore").read())))
    return ids, fname


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--company", required=True, help="逗号分隔公司列表, 如 55,57")
    ap.add_argument("--out", default=os.path.join(REPO, "target", "template_workpack"))
    args = ap.parse_args()
    companies = [int(x) for x in args.company.split(",")]

    templates = fetch_templates(companies)
    print("模板 %d 个: %s" % (len(templates), ", ".join("%d(%d个)" % (c, sum(1 for t in templates if t[1] == c)) for c in companies)))

    draft_dir = os.path.join(args.out, "drafts")
    os.makedirs(draft_dir, exist_ok=True)

    cards, backfill, fail = [], [], []
    for cid, company, no, name, atttype, page, path in templates:
        safe_name = re.sub(r'[\\/:*?"<>|\s]+', "_", name)[:40]
        pdf_name = "%d_%d_%s_%s.pdf" % (company, cid, no, safe_name)
        dest = os.path.join(draft_dir, pdf_name)

        src = None
        if path and os.path.exists(dest) and os.path.getsize(dest) > 500:
            src = "cached"
        elif path:
            src = download(path, dest)

        if not src:
            fail.append((cid, no, name))
            print("[FAIL] %s %s 底稿下载失败(path=%s)" % (no, name, (path or "")[:40]))
            continue

        anch = anchor_check(dest) if os.path.getsize(dest) > 500 else None
        anchor_txt = ("锚点命中%d/%d页" % anch) if anch else "无法解析,人工检查"

        ids, page_file = control_keys(page)
        backfill.append([company, cid, "", "【e签宝】" + name])
        cards.append((company, cid, no, name, pdf_name, page_file or page, ids, anchor_txt, os.path.getsize(dest)))
        print("[OK] %s %s (%dKB, %s, %s)" % (no, name, os.path.getsize(dest) // 1024, src, anchor_txt))

    # 操作卡
    with open(os.path.join(args.out, "workpack.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("# e签宝模板迁移工作包(公司 %s)\n\n" % ",".join(map(str, companies)))
        f.write("控制台入口: 沙箱 https://smlfront.esign.cn:8880 / 正式(商务提供); 每模板三步: 传底稿→照卡配控件→签章区选锚点页。\n")
        f.write("纯签收类可零控件; 控件可少配(表单传模板没有的key静默忽略); docTemplateId建完填 id_backfill.csv。\n\n")
        f.write("---\n\n")
        for company, cid, no, name, pdf_name, page_file, ids, anchor_txt, size in cards:
            f.write("## %d / %s / %s\n\n" % (company, no, name))
            f.write("- 底稿: `drafts/%s` (%dKB)\n- 表单页(控件key来源): `%s`\n- 签章锚点: %s (关键字\"%s\")\n" % (pdf_name, size // 1024, page_file, anchor_txt, ANCHOR))
            if ids:
                f.write("- 控件key清单(%d个, 可少配): %s\n" % (len(ids), ", ".join(ids)))
            else:
                f.write("- 控件key清单: 该表单页无con/cov/sin控件(纯签收类, 建模板零控件)\n")
            f.write("\n---\n\n")

    with open(os.path.join(args.out, "id_backfill.csv"), "w", newline="", encoding="utf-8-sig") as f:
        import csv
        w = csv.writer(f)
        w.writerow(["company", "cid_of_source_row", "esign_template_id", "new_name"])
        w.writerows(backfill)

    print("\n工作包: %s (drafts %d个PDF, workpack.md, id_backfill.csv)" % (args.out, len(cards)))
    if fail:
        print("下载失败 %d 个: %s" % (len(fail), ", ".join(no for _, no, _ in fail)))


if __name__ == "__main__":
    sys.exit(main())
