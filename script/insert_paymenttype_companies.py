# -*- coding: utf-8 -*-
import pymysql

# 连接数据库
conn = pymysql.connect(
    host='rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com',
    port=3306,
    user='fanglin1918',
    password='Fanglin1918!',
    database='data',
    charset='utf8mb4'
)

cursor = conn.cursor(pymysql.cursors.DictCursor)

# 查询 company=35 的数据
cursor.execute('SELECT * FROM paymenttype WHERE company = 35 ORDER BY ptid')
results = cursor.fetchall()

print('Found {} rows for company=35'.format(len(results)))

# 目标公司列表
companies = [79, 80, 88, 89, 87, 75, 76, 82, 83]

total_inserted = 0

for company in companies:
    print('\nProcessing company {}...'.format(company))

    # 先检查该公司是否已有数据
    cursor.execute('SELECT COUNT(*) as cnt FROM paymenttype WHERE company = {}'.format(company))
    count = cursor.fetchone()['cnt']

    if count > 0:
        print('  Company {} already has {} records, skipping...'.format(company, count))
        continue

    # 插入数据
    for row in results:
        sql = """INSERT INTO paymenttype
            (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        values = (
            row['name'],
            row['type'],
            row['paytype'],
            row['bustype'],
            row['atttype'],
            row['payScale'],
            row['saleScale'],
            row['code'],
            row['taxrate'],
            row['kino'],
            row['kiname'],
            row['kibalance'],
            row['billType'],
            row['status'],
            company
        )

        cursor.execute(sql, values)
        total_inserted += 1

    conn.commit()
    print('  Inserted {} records for company {}'.format(len(results), company))

cursor.close()
conn.close()

print('\nTotal inserted: {} records'.format(total_inserted))
print('Done!')
