# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
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

# 取所有公司
cursor.execute("SELECT cid FROM communion.company ORDER BY cid")
companies = cursor.fetchall()

# 原始特权购的字段值（除了 ptid, atttype, company）
name = '特权购'
type_val = 1
paytype = 0
bustype = 0
atttype = 1
payScale = 0
saleScale = 0
code = 0
taxrate = 9000
kino = '100.03.01.09'
kiname = '特权购'
kibalance = '80.05'
billType = ''
status = 0

sql_lines = []
sql_lines.append("-- 特权购 atttype=1 各公司数据")
sql_lines.append("-- 基于 ptid=4307 (company=0, atttype=0) 复制生成")
sql_lines.append("-- 执行前请确认已解除 read-only 模式")
sql_lines.append("")

for c in companies:
    cid = c['cid']
    sql_lines.append(
        "INSERT INTO data.paymenttype "
        "(name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company) "
        "VALUES ('特权购', 1, 0, 0, 1, 0, 0, 0, 9000, '100.03.01.09', '特权购', '80.05', '', 0, {});".format(cid)
    )

sql_content = '\n'.join(sql_lines)

output_path = 'D:/GIT/Rhadamanthus/sql/insert_paymenttype_tequangou_atttype1.sql'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(sql_content)

print('SQL文件已生成: {}'.format(output_path))
print('共 {} 条 INSERT 语句'.format(len(companies)))
print()
print('--- 前5条预览 ---')
for line in sql_lines[4:9]:
    print(line)
print('...')
print('--- 最后1条 ---')
print(sql_lines[-1])

conn.close()
