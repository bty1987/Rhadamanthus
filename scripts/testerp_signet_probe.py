# -*- coding: utf-8 -*-
"""test-erp 印章链路探针：add -> regist -> auth -> confirm（宜家装饰测试 cid=3）"""
import json, ssl, urllib.request, urllib.parse

BASE = "https://test-erp.fanglin.vip"
AUTH = "eX3o2SZdrpVOV9HC4UYTRA=="
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE

def post(path, params):
    data = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(BASE + path, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
    with urllib.request.urlopen(req, timeout=30, context=CTX) as resp:
        return json.loads(resp.read().decode("utf-8"))

# 0. token有效性: 加一个印章(公司随token)
r = post("/addSignet.do", {"authentication": AUTH, "signet.name": "宜家装饰测试", "signet.keyword": "乙方（盖章）", "signet.type": "0"})
print("addSignet:", json.dumps(r, ensure_ascii=False)[:200])

# 1. 查询拿 sid
r = post("/querySignet.do", {"authentication": AUTH, "signet.type": "0"})
sid = None
for s in (r.get("signets") or []):
    if s.get("name") == "宜家装饰测试":
        sid = s.get("sid"); print("找到印章 sid=%s signno=%s provider?=%s" % (sid, s.get("signno"), s.get("provider")))
if not sid:
    print("querySignet 响应:", json.dumps(r, ensure_ascii=False)[:400]); raise SystemExit(1)

# 2. 注册（e签宝为占位）
r = post("/registSignet.do", {"authentication": AUTH, "signet.sid": sid})
print("registSignet:", json.dumps(r, ensure_ascii=False)[:200])

# 3. 认证（org-auth-url）
r = post("/authSignet.do", {"authentication": AUTH, "signet.sid": sid})
print("authSignet:", json.dumps(r, ensure_ascii=False)[:300])

# 4. 确认认证（identity-info 查 orgId）
r = post("/confirmSignet.do", {"authentication": AUTH, "signet.sid": sid})
print("confirmSignet:", json.dumps(r, ensure_ascii=False)[:300])

# 5. 查最终状态
r = post("/querySignet.do", {"authentication": AUTH, "signet.type": "0"})
for s in (r.get("signets") or []):
    if s.get("sid") == sid:
        print("最终: sid=%s status=%s signno=%s authurl=%s" % (sid, s.get("status"), s.get("signno"), (s.get("authurl") or "")[:60]))
