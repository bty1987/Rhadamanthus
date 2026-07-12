# -*- coding: utf-8 -*-
"""
数据库表结构同步脚本
从 MySQL 数据库获取表结构并更新到 dbs 目录的 SQL 文件
"""

import pymysql
import os
import re
from datetime import datetime

# 数据库配置
DB_CONFIG = {
    'host': '192.168.5.21',
    'port': 3306,
    'user': 'root',
    'password': 'Neusoft!',
    'charset': 'utf8mb4'
}

# 项目根目录
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DBS_DIR = os.path.join(PROJECT_ROOT, 'dbs')

# 需要同步的数据库列表（对应 dbs 目录中的 sql 文件）
DATABASES = [
    'platform', 'customer', 'decoration', 'quotation', 'construction',
    'balance', 'sales', 'material', 'building', 'communion', 'data',
    'information', 'payment', 'production', 'approval', 'salary',
    'factory', 'inventory', 'finance', 'log', 'market', 'store',
    'report', 'dataviewer'
]


def get_connection():
    """获取数据库连接"""
    return pymysql.connect(**DB_CONFIG)


def get_all_databases(connection):
    """获取所有数据库名称"""
    cursor = connection.cursor()
    cursor.execute("SHOW DATABASES")
    databases = [row[0] for row in cursor.fetchall()]
    cursor.close()

    # 过滤掉系统数据库，只保留业务数据库
    system_dbs = ['information_schema', 'mysql', 'performance_schema', 'sys']
    return [db for db in databases if db not in system_dbs]


def get_table_columns(connection, database, table):
    """获取表的列信息"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW FULL COLUMNS FROM `{database}`.`{table}`")
    columns = cursor.fetchall()
    cursor.close()
    return columns


def get_table_indexes(connection, database, table):
    """获取表的索引信息"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW INDEX FROM `{database}`.`{table}`")
    indexes = cursor.fetchall()
    cursor.close()
    return indexes


def get_table_options(connection, database, table):
    """获取表的选项信息（ENGINE, CHARSET, COMMENT等）"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW TABLE STATUS FROM `{database}` WHERE Name = '{table}'")
    result = cursor.fetchone()
    cursor.close()

    if result:
        # 返回字典格式的表选项
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, result))
    return {}


def generate_create_table_sql(connection, database, table):
    """生成完整的 CREATE TABLE 语句"""
    columns = get_table_columns(connection, database, table)
    indexes = get_table_indexes(connection, database, table)
    table_options = get_table_options(connection, database, table)

    # 收集主键列
    primary_keys = set()
    # 收集索引
    index_dict = {}

    for idx in indexes:
        key_name = idx[2]  # Key_name
        column_name = idx[4]  # Column_name
        seq_in_index = idx[3]  # Seq_in_index
        non_unique = idx[1]  # Non_unique
        index_type = idx[10] if len(idx) > 10 else 'BTREE'  # Index_type

        if key_name == 'PRIMARY':
            primary_keys.add(column_name)
        else:
            if key_name not in index_dict:
                index_dict[key_name] = {
                    'columns': [],
                    'unique': not non_unique,
                    'type': index_type
                }
            index_dict[key_name]['columns'].append((seq_in_index, column_name))

    # 构建列定义
    column_defs = []
    auto_increment_col = None

    for col in columns:
        field = col[0]  # Field
        type_info = col[1]  # Type
        collation = col[2]  # Collation (not used)
        null = col[3]  # Null
        key = col[4]  # Key
        default = col[5]  # Default
        extra = col[6] if col[6] is not None else ''  # Extra
        privileges = col[7]  # Privileges (not used)
        comment = col[8] if len(col) > 8 and col[8] is not None else ''  # Comment

        col_def = f"  `{field}` {type_info}"

        # NOT NULL
        if null == 'NO':
            col_def += " NOT NULL"
        else:
            col_def += " NULL"

        # DEFAULT
        if default is not None:
            default_str = str(default)
            if default_str.upper() == 'NULL':
                col_def += " DEFAULT NULL"
            elif default_str.upper() == 'CURRENT_TIMESTAMP':
                col_def += " DEFAULT CURRENT_TIMESTAMP"
            else:
                # 字符串需要引号
                if type_info.upper().startswith(('VARCHAR', 'CHAR', 'TEXT', 'DATE', 'DATETIME', 'TIME')):
                    col_def += f" DEFAULT '{default}'"
                else:
                    col_def += f" DEFAULT {default}"

        # AUTO_INCREMENT
        if extra and 'auto_increment' in extra.lower():
            col_def += " AUTO_INCREMENT"
            auto_increment_col = field

        # COMMENT
        if comment:
            # 转义单引号
            comment = comment.replace("'", "''")
            col_def += f" COMMENT '{comment}'"

        column_defs.append(col_def)

    # 添加主键
    if primary_keys:
        pk_cols = ', '.join([f"`{col}`" for col in sorted(primary_keys)])
        column_defs.append(f"  PRIMARY KEY ({pk_cols})")

    # 添加唯一索引和普通索引
    for idx_name, idx_info in sorted(index_dict.items()):
        idx_info['columns'].sort()
        cols = ', '.join([f"`{col[1]}`" for col in idx_info['columns']])

        if idx_info['unique']:
            column_defs.append(f"  UNIQUE KEY `{idx_name}` ({cols}) USING {idx_info['type']}")
        else:
            column_defs.append(f"  KEY `{idx_name}` ({cols}) USING {idx_info['type']}")

    # 构建表选项
    engine = table_options.get('Engine', 'InnoDB')
    charset = table_options.get('Collation', 'utf8_general_ci').replace('_', '-')
    auto_increment = table_options.get('Auto_increment')
    row_format = table_options.get('Row_format', '')
    table_comment = table_options.get('Comment', '')

    options = f") ENGINE={engine}"
    if auto_increment:
        options += f" AUTO_INCREMENT={auto_increment}"
    options += f" DEFAULT CHARSET={charset}"

    if row_format:
        options += f" ROW_FORMAT={row_format}"

    if table_comment:
        comment_escaped = table_comment.replace("'", "''")
        options += f" COMMENT='{comment_escaped}'"

    # 组装完整的 CREATE TABLE 语句
    sql = f"DROP TABLE IF EXISTS `{table}`;\n"
    sql += f"CREATE TABLE `{table}` (\n"
    sql += ",\n".join(column_defs)
    sql += "\n"
    sql += options + ";"

    return sql


def generate_database_sql(database, connection):
    """生成整个数据库的 SQL"""
    # 获取数据库的所有表
    cursor = connection.cursor()
    cursor.execute(f"SHOW TABLES FROM `{database}`")
    tables = [row[0] for row in cursor.fetchall()]
    cursor.close()

    if not tables:
        return f"-- Database {database} has no tables\n"

    # 按表名排序
    tables.sort()

    sql_lines = []
    sql_lines.append(f"CREATE DATABASE IF NOT EXISTS `{database}`;")
    sql_lines.append(f"USE `{database}`;")
    sql_lines.append("")
    sql_lines.append(f"-- Generated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_lines.append(f"-- Total tables: {len(tables)}")
    sql_lines.append("")

    for table in tables:
        create_sql = generate_create_table_sql(connection, database, table)
        sql_lines.append(create_sql)
        sql_lines.append("")

    return '\n'.join(sql_lines)


def sync_database_schema():
    """同步数据库结构到 SQL 文件"""
    print("=" * 60)
    print("数据库表结构同步工具")
    print("=" * 60)

    connection = None
    try:
        connection = get_connection()
        print(f"\n成功连接到数据库: {DB_CONFIG['host']}:{DB_CONFIG['port']}\n")

        # 获取所有数据库
        all_databases = get_all_databases(connection)
        print(f"发现 {len(all_databases)} 个业务数据库")
        print(f"数据库列表: {', '.join(all_databases)}\n")

        # 确保 dbs 目录存在
        os.makedirs(DBS_DIR, exist_ok=True)

        # 同步每个数据库
        synced_count = 0
        for db_name in DATABASES:
            if db_name in all_databases:
                print(f"正在同步数据库: {db_name}...")
                sql_content = generate_database_sql(db_name, connection)

                # 写入文件
                sql_file = os.path.join(DBS_DIR, f"{db_name}.sql")
                with open(sql_file, 'w', encoding='utf-8') as f:
                    f.write(sql_content)

                print(f"  [OK] Updated: {sql_file}")
                synced_count += 1
            else:
                print(f"  [SKIP] {db_name} (database not exists)")

        print("\n" + "=" * 60)
        print(f"同步完成! 共更新 {synced_count} 个数据库文件")
        print("=" * 60)

        # 显示同步结果
        print("\n已同步的数据库:")
        for db_name in DATABASES:
            sql_file = os.path.join(DBS_DIR, f"{db_name}.sql")
            if os.path.exists(sql_file):
                # 获取文件大小
                size = os.path.getsize(sql_file)
                print(f"  - {db_name}.sql ({size:,} bytes)")

    except pymysql.Error as e:
        print(f"\n数据库错误: {e}")
    except Exception as e:
        print(f"\n发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if connection:
            connection.close()
            print("\n数据库连接已关闭")


if __name__ == '__main__':
    sync_database_schema()
