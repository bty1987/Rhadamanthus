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
cursor.execute('SELECT * FROM constructionnode WHERE company = 35 ORDER BY cnid')
results = cursor.fetchall()

print('Found {} rows for company=35'.format(len(results)))

# 表结构字段
fields = ['name', 'precheck', 'postcheck', 'stacheck', 'fincheck',
          'startalk', 'endtalk', 'sstid', 'estid', 'timeLimit',
          'accessoryLimit', 'salaryLimit', 'process', 'sort',
          'proset', 'kino', 'kiname', 'mark', 'status', 'company']

# 生成 SQL 文件
companies = [79, 80, 88, 89, 87, 75, 76, 82, 83]

with open('D:/ERP/Rhadamanthus/sql/insert_constructionnode_companies.sql', 'w', encoding='utf-8') as f:
    f.write('-- Constructionnode INSERT statements\n')
    f.write('-- Source: company=35, {} rows\n'.format(len(results)))
    f.write('-- Target companies: 79, 80, 88, 89, 87, 75, 76, 82, 83\n')
    f.write('-- Total: {} INSERT statements\n\n'.format(len(results) * len(companies)))

    for company in companies:
        f.write('-- Company {}\n'.format(company))
        for row in results:
            values = []
            for field in fields:
                if field == 'company':
                    values.append(str(company))
                elif row[field] is None:
                    values.append('NULL')
                elif isinstance(row[field], str):
                    # 转义单引号
                    escaped = row[field].replace("'", "''")
                    values.append("'{}'".format(escaped))
                else:
                    values.append(str(row[field]))

            field_list = ', '.join(fields)
            value_list = ', '.join(values)
            f.write("INSERT INTO constructionnode ({}) VALUES ({});\n".format(field_list, value_list))
        f.write('\n')

print('SQL file saved to: sql/insert_constructionnode_companies.sql')
print('\nAttempting to execute inserts...')

total_inserted = 0
skipped = []

for company in companies:
    print('\nProcessing company {}...'.format(company))

    # 先检查该公司是否已有数据
    cursor.execute('SELECT COUNT(*) as cnt FROM constructionnode WHERE company = {}'.format(company))
    count = cursor.fetchone()['cnt']

    if count > 0:
        print('  Company {} already has {} records, skipping...'.format(company, count))
        skipped.append(company)
        continue

    # 插入数据
    for row in results:
        sql = """INSERT INTO constructionnode
            (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk,
             sstid, estid, timeLimit, accessoryLimit, salaryLimit, process,
             sort, proset, kino, kiname, mark, status, company)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        values = (
            row['name'], row['precheck'], row['postcheck'], row['stacheck'], row['fincheck'],
            row['startalk'], row['endtalk'], row['sstid'], row['estid'], row['timeLimit'],
            row['accessoryLimit'], row['salaryLimit'], row['process'], row['sort'],
            row['proset'], row['kino'], row['kiname'], row['mark'], row['status'],
            company
        )

        cursor.execute(sql, values)
        total_inserted += 1

    conn.commit()
    print('  Inserted {} records for company {}'.format(len(results), company))

cursor.close()
conn.close()

print('\n' + '='*50)
print('Summary:')
print('  Total inserted: {} records'.format(total_inserted))
print('  Skipped companies (already have data): {}'.format(skipped))
print('  Done!')
