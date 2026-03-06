#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
测试装饰订单导出 SQL 性能
对比原脚本（N+1查询）vs 优化SQL（一次性JOIN）
"""

import pymysql
import time
from datetime import datetime

# 数据库配置
DB_CONFIG = {
    "host": "192.168.5.21",
    "port": 3306,
    "user": "root",
    "password": "Neusoft!",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.SSCursor  # 流式游标
}

# ============================================================================
# 优化后的完整 SQL（一次性获取所有数据）
# ============================================================================

OPTIMIZED_SQL = """
SELECT
    d.orderId,
    v.name,
    h.houseNumber,
    d.precontractTime,
    d.contractTime,
    d.accountTime,
    communion.kv('decoration', 'decoration', 'typeness', d.typeness),
    communion.kv('decoration', 'decoration', 'status', d.status),
    d.houseType,
    IF(d.notSalesmanRate BETWEEN 0 AND 1000,
       IF(q.manageRate = 0 OR q.manageRate IS NULL, 0,
          q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate),
       d.notSalesmanRate),
    d.notSalesmanRate,
    d.precontractPrice,
    d.orderTotalPrice,
    d.factPrice,
    (
        SELECT SUM(IF(dai.type = 0 AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0,
                     dai.num * dai.money / 1000, 0))
        FROM decoration.decorationactivityitem dai
        WHERE dai.orderId = d.orderId
    ) AS couponCut,
    (
        SELECT SUM(IF(dai.type = 1 AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0,
                     dai.num * dai.money / 1000, 0))
        FROM decoration.decorationactivityitem dai
        WHERE dai.orderId = d.orderId
    ) AS thingCut,
    u.userId,
    u.currentName,
    db.type,
    dd.no,
    dd.name,
    dr.no,
    dr.name,
    db.rate,
    q.discount,
    q.totalPrice,
    q.undisPrice,
    q.disPrice,
    q.trafficPrice,
    q.managePrice,
    q.manageRate,
    IFNULL(qp.managePrefer, 0),
    q.trafficPrice,
    busitype.name,
    h.buildArea,
    h.freeArea,
    h.innerArea,
    h.totalArea,
    cn.name,
    supervisor.currentName,
    d.paySacle,
    d.grade,
    us.currentName,
    d.houseClass,
    md.name,
    mu.userId,
    mu.currentName,
    ed.name,
    eu.userId,
    eu.currentName,
    IF(d.type = 0, dm.servicePrice, IF(d.type = 2, dh.servicePrice, 0)),
    IF(d.type = 0, dm.materialPrice, IF(d.type = 2, dh.materialPrice, 0)),
    q.taxRate,
    q.taxPrice,
    q.unachePrice,
    co.name,
    (
        SELECT MAX(a.atttype)
        FROM decoration.decorationactivityitem dai
        LEFT JOIN information.activity a ON dai.aid = a.aid
        WHERE dai.orderId = d.orderId AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0
    ) AS atttype,
    (
        SELECT SUM(IF(dp.paymentType = '设计费', dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeeTotal,
    (
        SELECT SUM(IF(dp.paymentType = '设计费' AND dp.paymentStatus = 0, dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeePaid,
    (
        SELECT SUM(dp.referMoney)
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
          AND dp.paymentStatus = 0
          AND dp.onetype = 0
          AND dp.twotype = 1
    ) AS nopayAmount,
    IFNULL(ap.balance, 0)
FROM decoration.decoration AS d
LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
LEFT JOIN decoration.decorationbelong AS db ON d.orderId = db.orderId AND db.status = 0
LEFT JOIN quotation.quotation AS q ON d.orderId = q.orderId AND q.defaults = 1
LEFT JOIN quotation.quotationprefer AS qp ON q.qid = qp.qid
LEFT JOIN communion.house AS h ON d.hid = h.hid
LEFT JOIN communion.village AS v ON h.vid = v.vid
LEFT JOIN communion.user AS supervisor ON d.svuid = supervisor.uid
LEFT JOIN communion.user AS us ON d.quid = us.uid
LEFT JOIN communion.user AS mu ON d.msuid = mu.uid
LEFT JOIN communion.department AS md ON mu.deptid = md.did
LEFT JOIN communion.user AS eu ON d.euid = eu.uid
LEFT JOIN communion.department AS ed ON eu.deptid = ed.did
LEFT JOIN communion.user AS u ON db.buid = u.uid
LEFT JOIN communion.department AS dd ON db.did = dd.did
LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
LEFT JOIN data.decorationbusitype AS busitype ON busitype.dbid = d.busitype
LEFT JOIN communion.company co ON d.company = co.cid
LEFT JOIN payment.advancepayment AS ap ON d.orderId = ap.orderId
LEFT JOIN data.constructionnode cn ON d.projectStatus = cn.cnid
WHERE d.contractTime >= %s AND d.contractTime <= %s
"""

# ============================================================================
# 简化版 SQL（仅基础字段，用于对比）
# ============================================================================

SIMPLE_SQL = """
SELECT COUNT(*)
FROM decoration.decoration AS d
WHERE d.contractTime >= %s AND d.contractTime <= %s
"""

# ============================================================================
# 性能测试函数
# ============================================================================

def test_performance(start_date, end_date, name):
    """测试指定时间范围的查询性能"""

    print(f"\n{'=' * 70}")
    print(f"[测试] {name}")
    print(f"时间范围: {start_date} ~ {end_date}")
    print(f"{'=' * 70}")

    conn = None
    try:
        conn = pymysql.connect(**DB_CONFIG)

        # 先统计订单数量
        print(f"[1/3] 统计订单数量...")
        cursor = conn.cursor()
        start = time.time()
        cursor.execute(SIMPLE_SQL, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        count = cursor.fetchone()[0]
        elapsed = time.time() - start
        print(f"      订单数: {count:,} 条 | 耗时: {elapsed:.2f} 秒")
        cursor.close()

        if count == 0:
            print(f"      [SKIP] 该时间段无数据")
            return

        # 测试优化SQL性能
        print(f"\n[2/3] 测试优化SQL性能...")
        cursor = conn.cursor(pymysql.cursors.SSCursor)

        start = time.time()
        cursor.execute(OPTIMIZED_SQL, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        query_time = time.time() - start
        print(f"      SQL执行: {query_time:.2f} 秒")

        # 读取数据
        start = time.time()
        row_count = 0
        batch_size = 500

        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            row_count += len(rows)
            if row_count % 1000 == 0:
                elapsed = time.time() - start
                print(f"      已读取: {row_count:,} 条 | 耗时: {elapsed:.2f} 秒")

        fetch_time = time.time() - start
        total_time = query_time + fetch_time

        print(f"\n[3/3] 性能汇总:")
        print(f"      总记录数: {row_count:,} 条")
        print(f"      SQL执行: {query_time:.2f} 秒")
        print(f"      数据读取: {fetch_time:.2f} 秒")
        print(f"      总耗时: {total_time:.2f} 秒")
        print(f"      平均速度: {row_count / total_time:.0f} 条/秒")

        cursor.close()

        return {
            "name": name,
            "count": row_count,
            "query_time": query_time,
            "fetch_time": fetch_time,
            "total_time": total_time
        }

    except Exception as e:
        print(f"[X] 错误: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        if conn:
            conn.close()

def run_all_tests():
    """运行所有性能测试"""

    print("=" * 70)
    print("装饰订单导出 SQL 性能测试")
    print("=" * 70)
    print(f"测试时间: {datetime.now()}")
    print()

    results = []

    # 测试 1: 1个月数据
    result = test_performance("2024-01-01", "2024-01-31", "1个月数据 (2024-01)")
    if result:
        results.append(result)

    # 测试 2: 3个月数据
    result = test_performance("2024-01-01", "2024-03-31", "3个月数据 (2024 Q1)")
    if result:
        results.append(result)

    # 测试 3: 1年数据
    result = test_performance("2024-01-01", "2024-12-31", "1年数据 (2024)")
    if result:
        results.append(result)

    # 测试 4: 3年数据
    result = test_performance("2022-01-01", "2024-12-31", "3年数据 (2022-2024)")
    if result:
        results.append(result)

    # 测试 5: 10年数据（可选，可能比较慢）
    print(f"\n是否测试10年数据？(2015-2024) - 这可能需要几分钟时间")
    # result = test_performance("2015-01-01", "2024-12-31", "10年数据 (2015-2024)")
    # if result:
    #     results.append(result)

    # 打印汇总
    if results:
        print(f"\n{'=' * 70}")
        print("[性能测试汇总]")
        print(f"{'=' * 70}")
        print(f"{'测试项':<25} {'记录数':<12} {'查询耗时':<12} {'读取耗时':<12} {'总耗时':<12} {'速度':<12}")
        print("-" * 90)

        for r in results:
            print(f"{r['name']:<25} {r['count']:<12,} {r['query_time']:<12.2f} {r['fetch_time']:<12.2f} {r['total_time']:<12.2f} {r['count']/r['total_time']:<12.0f}")

        print("-" * 90)

        # 估算10年数据
        if len(results) >= 2:
            avg_speed = sum(r['count']/r['total_time'] for r in results) / len(results)
            estimated_10y = 30000 / avg_speed  # 假设10年约3万条
            print(f"\n[估算] 10年数据 (~30,000条): 预计耗时约 {estimated_10y/60:.1f} 分钟")

    print(f"\n{'=' * 70}")
    print("测试完成")
    print(f"{'=' * 70}")

if __name__ == '__main__':
    run_all_tests()
