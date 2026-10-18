# -*- coding: utf-8 -*-
"""
e签宝 v3 联调探针（开发工具，凭证在 target/esign-local.json，不进 git）。

用法：
  python scripts/esign_probe.py GET  /v3/files/xxx/url
  python scripts/esign_probe.py POST /v3/psn-auth-url '{"psnAccount":"13800138000",...}'
  python scripts/esign_probe.py --accept "*/*" POST ...   # 换 Accept 参与签名试错
"""

import argparse
import base64
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


def load_cred():
    with open(CRED, encoding="utf-8") as f:
        return json.load(f)


def invoke(method, path, body=None, query=None, accept="application/json; charset=UTF-8"):
    cred = load_cred()
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
    content_type = "application/json; charset=UTF-8"

    if not body_bytes:
        content_type = ""  # GET/DELETE 无 payload 时 Content-Type 置空（与 easy-esign 实现一致）

    # 官方签名串 6 段（dev-guide3/tggw2e）：method \n "*/*" \n contentMD5 \n contentType \n ""(Date段恒空,时间戳不参与签名) \n pathAndParameters
    string_to_sign = "\n".join([method, "*/*", content_md5, content_type, "", path_and_query])

    sig = base64.b64encode(hmac.new(secret.encode(), string_to_sign.encode("utf-8"), hashlib.sha256).digest()).decode()

    url = host + path_and_query
    req = urllib.request.Request(url, data=body_bytes if method == "POST" else None, method=method)
    req.add_header("Accept", "*/*")
    req.add_header("X-Tsign-Open-App-Id", app_id)
    req.add_header("X-Tsign-Open-Auth-Mode", "Signature")
    req.add_header("X-Tsign-Open-Ca-Signature", sig)
    req.add_header("X-Tsign-Open-Ca-Timestamp", ts)
    req.add_header("Date", "")
    req.add_header("Content-Type", content_type)
    req.add_header("Content-MD5", content_md5)

    print(f">> {method} {path_and_query}")
    if body is not None:
        print(f">> body: {body_bytes.decode('utf-8')[:400]}")

    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = r.read().decode("utf-8")
            code = r.status
    except urllib.error.HTTPError as e:
        resp = e.read().decode("utf-8", errors="replace")
        code = e.code

    print(f"<< HTTP {code}")
    try:
        print(json.dumps(json.loads(resp), ensure_ascii=False, indent=2)[:1500])
    except Exception:
        print(resp[:1500])
    return resp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("method", choices=["GET", "POST"])
    ap.add_argument("path")
    ap.add_argument("--body", default=None, help="JSON 字符串或 @file")
    ap.add_argument("--query", default=None, help="k=v&k2=v2")
    ap.add_argument("--accept", default="application/json; charset=UTF-8")
    args = ap.parse_args()

    body = None
    if args.body:
        raw = args.body
        if raw.startswith("@"):
            with open(raw[1:], encoding="utf-8") as f:
                raw = f.read()
        body = json.loads(raw)

    query = None
    if args.query:
        query = dict(kv.split("=", 1) for kv in args.query.split("&"))

    invoke(args.method, args.path, body, query, args.accept)


if __name__ == "__main__":
    main()
