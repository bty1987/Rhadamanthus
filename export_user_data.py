# -*- coding: utf-8 -*-
import mysql.connector
import csv
import codecs

# 数据库配置
DB_CONFIG = {
    'host': 'rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com',
    'port': 3306,
    'user': 'fanglin1918',
    'password': 'Fanglin1918!',
    'database': 'communion',
    'charset': 'utf8mb4',
    'use_unicode': True
}

# SQL查询
SQL = """
SELECT u.currentName, u.userId, u.phone,
       d.name AS departmentName, d.did AS departmentDid,
       c.cid, c.name AS companyName,
       dt.did AS dutyDid, dt.name AS dutyName
FROM communion.user u
LEFT JOIN communion.department d ON u.deptId = d.did
LEFT JOIN communion.company c ON u.company = c.cid
LEFT JOIN communion.duty dt ON u.did = dt.did
WHERE u.status = 0
ORDER BY u.userId
"""

def export_to_csv():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    print("正在查询数据...")
    cursor.execute(SQL)
    rows = cursor.fetchall()
    print(f"查询完成，共 {len(rows)} 条记录")

    # 写入CSV
    output_file = 'D:/GIT/Rhadamanthus/user_export_full.csv'
    with codecs.open(output_file, 'w', 'utf-8-sig') as f:
        if rows:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)

    print(f"已保存到: {output_file}")

    cursor.close()
    conn.close()

if __name__ == '__main__':
    export_to_csv()
