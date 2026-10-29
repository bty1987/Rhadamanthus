# -*- coding: utf-8 -*-
# 盯 decorationactivitycost 外部接口调用: 轮询 erp-T RDS 2610210003 的物品行/缓存档,
# 有新行即触发抓 ERP catalina 优惠额度日志 + fl-yy validate 接口日志发现, 全程输出供主会话汇报
import pymysql
import subprocess
import sys
import time
import datetime

HOST = "rm-2zexuf802bx4s8110vo.mysql.rds.aliyuncs.com"
USER = "fanglin1918"
PASS = "Fanglin1918!"
ORDER = "2610210003"
ECSHELPER = r"C:\Users\Admin\aliyun-cli\ecshelper.py"
RUN_SECONDS = 560


def q(sql):
    conn = pymysql.connect(host=HOST, port=3306, user=USER, password=PASS,
                           connect_timeout=15, read_timeout=30, autocommit=True, charset="utf8mb4")
    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall() if cur.description else []
        cur.close()
        return rows
    finally:
        conn.close()


def ecs(cmd, timeout=150):
    try:
        p = subprocess.run([sys.executable, ECSHELPER, cmd], capture_output=True,
                           text=True, encoding="utf-8", errors="replace", timeout=timeout)
        return (p.stdout or "") + (("\n[stderr] " + p.stderr) if p.stderr.strip() else "")
    except Exception as e:
        return "ECS CALL FAIL: %r" % (e,)


def snap():
    items = q("SELECT daiId,type,money,num,content,createTime FROM decoration.decorationactivityitem "
              "WHERE orderId='%s' ORDER BY daiId DESC LIMIT 5" % ORDER)
    costs = q("SELECT dacId,daiId,money,balance,toplimit,createTime FROM decoration.decorationactivitycost "
              "WHERE orderId='%s' ORDER BY dacId DESC LIMIT 5" % ORDER)
    return items, costs


def show(tag, items, costs):
    print("== %s decorationactivityitem (%d) ==" % (tag, len(items)))
    for r in items:
        print(r)
    print("== %s decorationactivitycost (%d) ==" % (tag, len(costs)))
    for r in costs:
        print(r)


print("[watcher start]", datetime.datetime.now().strftime("%H:%M:%S"), "order", ORDER)
base_i, base_c = snap()
show("BASE", base_i, base_c)
base_dai = base_i[0][0] if base_i else 0
base_dac = base_c[0][0] if base_c else 0

deadline = time.time() + RUN_SECONDS
fired = False
while time.time() < deadline:
    time.sleep(5)
    try:
        i, c = snap()
    except Exception as e:
        print("[poll err]", repr(e))
        continue
    mi = i[0][0] if i else 0
    mc = c[0][0] if c else 0
    if mi > base_dai or mc > base_dac:
        fired = True
        print("\n[TRIGGER]", datetime.datetime.now().strftime("%H:%M:%S"), "new rows detected")
        show("NEW", i, c)
        break

print("\n[ERP catalina 优惠额度 last lines]")
print(ecs("tail -c 300000 /usr/local/Tomcat/tomcat/logs/catalina.out | grep -a '优惠额度' | tail -n 20; echo GREP_DONE"))

print("\n[fl-yy validate requests in medical.log]")
print(ecs("tail -c 200000 /home/fanglin/logs/medical.log | grep -a -i -B1 -A3 'discount-quota/validate' | tail -n 40; echo GREP_DONE"))

print("\n[fl-yy validate interface recent logs (30min)]")
print(ecs("find /home/fanglin -maxdepth 3 \\( -name '*.log' -o -name '*.out' \\) -mmin -30 2>/dev/null | head -n 10"))

if not fired:
    i, c = snap()
    show("FINAL", i, c)
    print("[TIMEOUT] %dmin 无新行: 若页面报140108=拦截分支(不落数据,属预期); 若页面提交成功但无行=校验被静默跳过,查日志与反查链" % (RUN_SECONDS // 60))
print("[watcher end]", datetime.datetime.now().strftime("%H:%M:%S"))
