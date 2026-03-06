#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
测试 communion.kv() 函数
验证 typeness/status/projectStatus 字段转换
"""

import pymysql
from datetime import datetime

# 数据库配置
DB_CONFIG = {
    "host": "192.168.5.21",
    "port": 3306,
    "user": "root",
    "password": "Neusoft!",
    "charset": "utf8mb4"
}

# 测试 SQL：验证 communion.kv() 函数
TEST_SQL = """
SELECT
    d.orderId,
    d.typeness AS typeness_raw,
    communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS typeness_kv,
    d.status AS status_raw,
    communion.kv('decoration', 'decoration', 'status', d.status) AS status_kv,
    d.projectStatus AS projectStatus_raw,
    cn.name AS projectStatus_name
FROM decoration.decoration AS d
LEFT JOIN data.constructionnode cn ON d.projectStatus = cn.cnid
WHERE d.contractTime >= '2024-01-01' AND d.contractTime <= '2024-12-31'
LIMIT 10
"""

# 对比 SQL：使用 CASE WHEN 的方式
COMPARE_SQL = """
SELECT
    d.orderId,
    d.typeness,
    CASE d.typeness
        WHEN 0 THEN '半包'
        WHEN 1 THEN '整装'
        WHEN 2 THEN '半价'
        WHEN 3 THEN '满减'
        WHEN 4 THEN '减上捡'
        WHEN 5 THEN '达额减'
        WHEN 6 THEN '新满减'
        WHEN 7 THEN '局改'
        WHEN 8 THEN '全翻'
        WHEN 9 THEN '全案'
        WHEN 10 THEN '新达额减'
        WHEN 11 THEN '满额减'
        ELSE CAST(d.typeness AS CHAR)
    END AS typename_case,
    d.status,
    CASE d.status
        WHEN 0 THEN '初始'
        WHEN 1 THEN '定金'
        WHEN 2 THEN '预签'
        WHEN 3 THEN '签约'
        WHEN 4 THEN '重签'
        WHEN 5 THEN '废单'
        WHEN 6 THEN '终止'
        WHEN 7 THEN '决算'
        WHEN 8 THEN '完结'
        ELSE CAST(d.status AS CHAR)
    END AS statusname_case,
    cn.name AS projectstatus_join
FROM decoration.decoration AS d
LEFT JOIN data.constructionnode cn ON d.projectStatus = cn.cnid
WHERE d.contractTime >= '2024-01-01' AND d.contractTime <= '2024-12-31'
LIMIT 10
"""

def test_kv_function():
    """测试 communion.kv() 函数"""

    print("=" * 80)
    print("测试 communion.kv() 函数")
    print("=" * 80)
    print(f"时间: {datetime.now()}")
    print()

    conn = None
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 测试 1: communion.kv() 函数
        print("【测试 1】使用 communion.kv() 函数")
        print("-" * 80)
        cursor.execute(TEST_SQL)
        results = cursor.fetchall()

        if results:
            print(f"{'订单号':<15} {'typeness_raw':<5} {'typeness_kv':<10} {'status_raw':<5} {'status_kv':<8} {'ps_raw':<5} {'ps_name':<10}")
            print("-" * 80)
            for row in results:
                orderId = row[0]
                typeness_raw = row[1]
                typeness_kv = row[2]
                status_raw = row[3]
                status_kv = row[4]
                ps_raw = row[5]
                ps_name = row[6]
                print(f"{str(orderId):<15} {str(typeness_raw):<5} {str(typeness_kv):<10} {str(status_raw):<5} {str(status_kv):<8} {str(ps_raw):<5} {str(ps_name):<10}")
            print(f"\n[OK] 查询成功，返回 {len(results)} 条记录")
        else:
            print("[X] 未查询到数据")

        print()

        # 测试 2: CASE WHEN 方式对比
        print("【测试 2】使用 CASE WHEN 对比")
        print("-" * 80)
        cursor.execute(COMPARE_SQL)
        results2 = cursor.fetchall()

        if results2:
            print(f"{'订单号':<15} {'typeness':<5} {'typename_case':<10} {'status':<5} {'statusname_case':<8} {'ps_name':<10}")
            print("-" * 80)
            for row in results2:
                orderId = row[0]
                typeness = row[1]
                typename_case = row[2]
                status = row[3]
                statusname_case = row[4]
                ps_name = row[5]
                print(f"{str(orderId):<15} {str(typeness):<5} {str(typename_case):<10} {str(status):<5} {str(statusname_case):<8} {str(ps_name):<10}")
            print(f"\n[OK] 查询成功，返回 {len(results2)} 条记录")
        else:
            print("[X] 未查询到数据")

        cursor.close()

    except Exception as e:
        print(f"[X] 错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if conn:
            conn.close()

    print()
    print("=" * 80)
    print("测试完成")
    print("=" * 80)

if __name__ == '__main__':
    test_kv_function()
