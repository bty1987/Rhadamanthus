# -*- coding: utf-8 -*-
"""e签宝 v3 联调流程脚本（复用 probe 的签名逻辑，完整解析响应）。"""

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


def invoke(method, path, body=None, query=None):
    cred = json.load(open(CRED, encoding="utf-8"))
    host, app_id, secret = cred["host"].rstrip("/"), cred["appId"], cred["appSecret"]

    content_md5 = ""
    body_bytes = b""
    if body is not None:
        body_bytes = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        content_md5 = base64.b64encode(hashlib.md5(body_bytes).digest()).decode()

    path_and_query = path
    if query:
        qs_sig = "&".join(f"{k}={v}" for k, v in sorted(query.items()))
        qs_send = urlencode({k: v for k, v in sorted(query.items())})
        path_and_query = f"{path}?{qs_send}"
        path_and_query_sig = f"{path}?{qs_sig}"

    ts = str(int(time.time() * 1000))
    content_type = "application/json; charset=UTF-8" if body_bytes else ""

    string_to_sign = "\n".join([method, "*/*", content_md5, content_type, "", path_and_query_sig if query else path_and_query])
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
            raw = r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")

    try:
        return json.loads(raw)
    except Exception:
        return {"raw": raw}


def step2_put(upload_url, pdf_path):
    pdf = open(pdf_path, "rb").read()
    md5_b64 = base64.b64encode(hashlib.md5(pdf).digest()).decode()
    req = urllib.request.Request(upload_url, data=pdf, method="PUT")
    # 坑：PUT 的头必须与预签名一致——Content-Type 用 JSON（easy-esign 惯例）+ 必须带 Content-MD5
    req.add_header("Content-Type", "application/json; charset=UTF-8")
    req.add_header("Content-MD5", md5_b64)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", errors="replace")[:200]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")[:300]


if __name__ == "__main__":
    # step1 上传地址
    pdf_path = os.path.join(BASE, "target", "esign-templates", "11093", "template.pdf")
    pdf = open(pdf_path, "rb").read()
    md5_b64 = base64.b64encode(hashlib.md5(pdf).digest()).decode()

    r1 = invoke("POST", "/v3/files/file-upload-url", {
        "contentMd5": md5_b64,
        "contentType": "application/pdf;",
        "fileName": "工程合同底稿.pdf",
        "fileSize": len(pdf),
    })
    print("step1:", r1.get("code"), r1.get("message"))
    data = r1.get("data") or {}
    file_id, upload_url = data.get("fileId"), data.get("fileUploadUrl")
    print("fileId:", file_id)

    # step2 PUT 上传
    code, resp = step2_put(upload_url, pdf_path)
    print(f"step2 PUT: HTTP {code} {resp}")

    # step3 验证文件状态
    r3 = invoke("GET", f"/v3/files/{file_id}")
    print("step3 文件详情:", json.dumps(r3, ensure_ascii=False)[:300])
