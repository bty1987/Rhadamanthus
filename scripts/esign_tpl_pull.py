# -*- coding: utf-8 -*-
"""拉取 e签宝 orgId 下全部流程模板清单(列表翻页+逐张详情), 落盘 JSON 供分析/同步用。

用法:
  python scripts/esign_tpl_pull.py                     # 数林 orgId(esign.template.orgid)
  python scripts/esign_tpl_pull.py --orgid <orgId>     # 指定归属企业
输出:
  scripts/out/esign_templates_pull.json   全量(列表项+detail)
  控制台: 一行一模板摘要
"""

import argparse
import base64
import datetime
import hashlib
import hmac
import json
import os
import time
import urllib.error
import urllib.request
from urllib.parse import urlencode

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED = os.path.join(BASE, "target", "esign-local.json")
OUT = os.path.join(BASE, "scripts", "out", "esign_templates_pull.json")

DEFAULT_ORGID = "0b94fe62e691451e8e342cdea237ae8d"  # 数林 = 生产 systemconfig esign.template.orgid


def load_cred():
    with open(CRED, encoding="utf-8") as f:
        return json.load(f)


def invoke(cred, method, path, body=None, query=None):
    host = cred["host"].rstrip("/")
    app_id, secret = cred["appId"], cred["appSecret"]

    content_md5 = ""
    body_bytes = b""
    if body is not None:
        body_bytes = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        content_md5 = base64.b64encode(hashlib.md5(body_bytes).digest()).decode()

    path_and_query = path
    if query:
        qs = urlencode({k: v for k, v in sorted(query.items())})
        path_and_query = f"{path}?{qs}"

    ts = str(int(time.time() * 1000))
    content_type = "application/json; charset=UTF-8" if body_bytes else ""

    string_to_sign = "\n".join([method, "*/*", content_md5, content_type, "", path_and_query])
    sig = base64.b64encode(hmac.new(secret.encode(), string_to_sign.encode("utf-8"), hashlib.sha256).digest()).decode()

    req = urllib.request.Request(host + path_and_query, data=body_bytes if method == "POST" else None, method=method)
    req.add_header("Accept", "*/*")
    req.add_header("X-Tsign-Open-App-Id", app_id)
    req.add_header("X-Tsign-Open-Auth-Mode", "Signature")
    req.add_header("X-Tsign-Open-Ca-Signature", sig)
    req.add_header("X-Tsign-Open-Ca-Timestamp", ts)
    req.add_header("Date", "")
    req.add_header("Content-Type", content_type)
    req.add_header("Content-MD5", content_md5)

    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        resp = json.loads(e.read().decode("utf-8", errors="replace"))

    if resp.get("code") != 0:
        raise RuntimeError(f"{method} {path_and_query} -> code={resp.get('code')} msg={resp.get('message')}")

    return resp.get("data")


def fmt_ts(ts):
    if not ts:
        return ""
    return datetime.datetime.fromtimestamp(ts / 1000).strftime("%Y-%m-%d %H:%M")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--orgid", default=DEFAULT_ORGID)
    args = ap.parse_args()

    cred = load_cred()

    items, page = [], 1
    while True:
        data = invoke(cred, "GET", "/v3/sign-templates",
                      query={"pageNumber": page, "pageSize": 50, "orgId": args.orgid})
        batch = data.get("signTemplates") or []
        items.extend(batch)
        print(f"page {page}: +{len(batch)} (accumulated {len(items)}/{data.get('total')})")
        if len(items) >= data.get("total", 0) or not batch:
            break
        page += 1

    result = {"orgId": args.orgid, "total": len(items), "pulledAt": fmt_ts(int(time.time() * 1000)), "templates": []}

    for t in items:
        tid = t["signTemplateId"]
        detail = invoke(cred, "GET", "/v3/sign-templates/detail",
                        query={"signTemplateId": tid, "orgId": args.orgid, "queryComponents": "true"})
        entry = {"list": t, "detail": detail}
        result["templates"].append(entry)

        d_parts = detail.get("participants") or []
        roles = "/".join(
            ("企业" if (p.get("participantType") == 1 or p.get("orgParticipant")) else "个人")
            + (f"(setMode={p.get('participantSetMode')})" if p.get("participantSetMode") is not None else "")
            for p in d_parts)
        n_comp = len(detail.get("components") or [])
        print(f"{fmt_ts(t.get('createTime'))}  status={t.get('status')}  {tid}")
        print(f"    name={t['signTemplateName']}  参与方[{len(d_parts)}]={roles}  控件={n_comp}  文档={len(detail.get('docs') or [])}")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\nsaved -> {OUT}")


if __name__ == "__main__":
    main()
