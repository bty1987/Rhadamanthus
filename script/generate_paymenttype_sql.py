# -*- coding: utf-8 -*-
import pymysql

conn = pymysql.connect(
    host='rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com',
    port=3306,
    user='fanglin1918',
    password='Fanglin1918!',
    database='data',
    charset='utf8mb4'
)

cursor = conn.cursor(pymysql.cursors.DictCursor)
cursor.execute('SELECT * FROM paymenttype WHERE company = 35 ORDER BY ptid')

results = cursor.fetchall()
print('-- Found {} rows for company=35'.format(len(results)))
print()

companies = [79, 80, 88, 89, 87, 75, 76, 82, 83]

print('-- SQL INSERT statements for new companies')
print('-- Target companies: 79, 80, 88, 89, 87, 75, 76, 82, 83')
print()

for company in companies:
    print('-- Company {}'.format(company))
    for row in results:
        name = conn.escape_string(row['name'])
        type_val = row['type']
        paytype = row['paytype']
        bustype = row['bustype']
        atttype = row['atttype'] if row['atttype'] is not None else 'NULL'
        payScale = row['payScale']
        saleScale = row['saleScale']
        code = row['code'] if row['code'] is not None else 'NULL'
        taxrate = row['taxrate'] if row['taxrate'] is not None else 'NULL'
        kino = conn.escape_string(row['kino']) if row['kino'] else ''
        kiname = conn.escape_string(row['kiname']) if row['kiname'] else ''
        kibalance = conn.escape_string(row['kibalance']) if row['kibalance'] else ''
        billType = 'NULL' if row['billType'] is None else '"{}"'.format(row['billType'])
        status = row['status']

        atttype_str = str(atttype) if atttype != 'NULL' else 'NULL'
        code_str = str(code) if code != 'NULL' else 'NULL'
        taxrate_str = str(taxrate) if taxrate != 'NULL' else 'NULL'

        sql = "INSERT INTO paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company) VALUES ('{}', {}, {}, {}, {}, {}, {}, {}, {}, '{}', '{}', '{}', {}, {}, {});".format(
            name, type_val, paytype, bustype, atttype_str, payScale, saleScale, code_str, taxrate_str, kino, kiname, kibalance, billType, status, company)
        print(sql)
    print()

cursor.close()
conn.close()
