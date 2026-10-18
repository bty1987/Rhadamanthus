# -*- coding: utf-8 -*-
"""
e签宝模板制作工单生成器（开发工具，只读本地资源，不碰库）。

用法：
  python scripts/esign_template_workorder.py --cid 8069 --name "装饰设计委托合同" \
      --page WebContent/views/contract/C-001-D-1-0001.html \
      --pdf-url https://service-erp.fanglin.vip/group6/M00/xx/yy/zz.pdf

产出（target/esign-templates/{cid}/）：
  - template.pdf          合同底稿（e签宝上传用）
  - WORKORDER.md          制作工单：变量清单(变量名/页面标签/必填) + 制作步骤

背景：法大大模板 = 干净 PDF 底稿 + 平台域定义。PDF 内无占位符文本，
变量清单来源 = 模板表单页 HTML 的 .conitem 元素 id（即法大大域字段名，
也是将来 e签宝 控件名 / components.componentKey）。
控件位置：人工在 e签宝 模板编辑器按 PDF 版式对位（v1）；
v2 增强=用已生成历史合同 PDF 与底稿做文本 diff 自动反推控件锚点。
"""

import argparse
import os
import re
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_ROOT = os.path.join(BASE, "target", "esign-templates")


def conitem_variables(html_path):
    """提取模板页 .conitem 元素：id（变量名）+ label（附近中文标签）+ 是否必填。"""
    with open(html_path, encoding="utf-8", errors="ignore") as f:
        s = f.read()

    items = []
    for tag in re.findall(r"<[^>]*conitem[^>]*>", s):
        m_id = re.search(r'id="([^"]+)"', tag)
        if not m_id:
            continue
        vid = m_id.group(1)
        required = "v_required" in tag
        # label：向前找最近的 label>/span> 中文文本（尽力而为，供人工对位参考）
        pos = s.find(tag)
        before = s[max(0, pos - 400):pos]
        m_label = re.findall(r"([\u4e00-\u9fa5A-Za-z0-9（）()、.．]{2,20})\s*</label>|([\u4e00-\u9fa5（）()、.．]{2,15})\s*:?\s*<", before)
        label = (m_label[-1][0] or m_label[-1][1]) if m_label else ""
        items.append({"id": vid, "label": label.strip(), "required": required})

    # 去重保序
    seen, uniq = set(), []
    for it in items:
        if it["id"] not in seen:
            seen.add(it["id"])
            uniq.append(it)
    return uniq


def download_pdf(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
        f.write(r.read())
    return os.path.getsize(dest)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cid", required=True, help="data.contract.cid")
    ap.add_argument("--name", required=True, help="模板名称")
    ap.add_argument("--page", required=True, help="模板表单页 HTML 路径（相对仓库根）")
    ap.add_argument("--pdf-url", required=True, help="底稿 PDF 完整 URL")
    ap.add_argument("--note", default="", help="备注（如：仅装修合同场景启用）")
    args = ap.parse_args()

    out_dir = os.path.join(OUT_ROOT, str(args.cid))
    os.makedirs(out_dir, exist_ok=True)

    pdf_path = os.path.join(out_dir, "template.pdf")
    size = download_pdf(args.pdf_url, pdf_path)

    page_path = args.page if os.path.isabs(args.page) else os.path.join(BASE, args.page)
    variables = conitem_variables(page_path)

    wo = []
    wo.append(f"# e签宝模板制作工单 · {args.name}（cid={args.cid}）\n")
    wo.append(f"- 底稿 PDF：`target/esign-templates/{args.cid}/template.pdf`（{size//1024}KB，上传 e签宝 用）")
    wo.append(f"- 变量来源页：`{args.page}`（conitem id = 法大大域字段名 = e签宝控件名 = components.componentKey）")
    if args.note:
        wo.append(f"- 备注：{args.note}")
    wo.append(f"\n## 变量清单（{len(variables)} 个）\n")
    wo.append("| # | 控件名(componentKey) | 页面标签 | 必填 |")
    wo.append("|---|---------------------|---------|:---:|")
    for i, v in enumerate(variables, 1):
        wo.append(f"| {i} | `{v['id']}` | {v['label']} | {'✓' if v['required'] else ''} |")
    wo.append("""
## 制作步骤（e签宝开放平台控制台）

1. 文档模板 → 上传底稿 PDF（本工单 template.pdf）
2. 按上表逐个添加**文本控件**：控件名 = componentKey 列（原样，含连字符，勿改写）；位置对照 PDF 版式（label 列提示了控件含义）
3. 签章区：
   - 企业章：添加签章区，位置按"甲方（盖章）"等关键字文本（系统的 autosign keyword 定位）
   - 客户签名：添加签名区（个人签署）
4. 记录 docTemplateId → 回填 `data.contract`（试点公司新增模板行，no = docTemplateId）
5. 沙箱 generate 联调：components 传上表 componentKey+示例值，核对填充位置

## 派生变量提示

模板表单页 JS（如 decorationContractTemp*.js）在提交时还会追加派生变量
（如 con-sign-year/month/day、金额大写 con-contract-total-cn 等），
建模板时一并添加控件，变量名以 JS 提交 payload 为准（可在测试环境抓 addDecorationContract 请求体确认）。
""")

    wo_path = os.path.join(out_dir, "WORKORDER.md")
    with open(wo_path, "w", encoding="utf-8") as f:
        f.write("\n".join(wo))

    print(f"[v] 工单已生成: {wo_path}")
    print(f"    底稿: {pdf_path} ({size//1024}KB)")
    print(f"    变量: {len(variables)} 个")


if __name__ == "__main__":
    main()
