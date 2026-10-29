# -*- coding: utf-8 -*-
# 探测 fl-yy validate 接口连通性+签名正确性(与 DecorationActivityCostServiceImpl.post 同算法)
# 用法: python scripts/probe_cost_validate.py [url] [secret] [staffCode] [orderId] [amount]
import hashlib
import json
import secrets
import sys
import time
import urllib.request
import urllib.error

url = sys.argv[1] if len(sys.argv) > 1 else "http://192.168.5.21:9999/validate"
secret = sys.argv[2] if len(sys.argv) > 2 else "af7nPP/AzXXBDArwOYtLZdui"
staff = sys.argv[3] if len(sys.argv) > 3 else "FL-00479"
order = sys.argv[4] if len(sys.argv) > 4 else "2610260002"
amount = sys.argv[5] if len(sys.argv) > 5 else "1000"

ts = str(int(time.time() * 1000))
nonce = secrets.token_hex(16)
raw_body = json.dumps({"staffCode": staff, "orderId": order, "amount": int(amount)},
                      ensure_ascii=False, separators=(",", ":"))
header_string = "appId=erp_project_sync&nonce=%s&timestamp=%s" % (nonce, ts)
sign = hashlib.sha256(("#" + raw_body + "##" + header_string + "###" + secret).encode("utf-8")).hexdigest()

req = urllib.request.Request(url, data=raw_body.encode("utf-8"), method="POST")
req.add_header("Content-Type", "application/json")
req.add_header("appId", "erp_project_sync")
req.add_header("timestamp", ts)
req.add_header("nonce", nonce)
req.add_header("sign", sign)

print("POST %s" % url)
print("body=%s" % raw_body)
try:
    resp = urllib.request.urlopen(req, timeout=15)
    print("HTTP %s" % resp.status)
    print(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP %s" % e.code)
    print(e.read().decode("utf-8", errors="replace"))
except Exception as e:
    print("FAIL %s: %s" % (type(e).__name__, e))
