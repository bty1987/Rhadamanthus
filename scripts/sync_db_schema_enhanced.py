# -*- coding: utf-8 -*-
"""
数据库表结构同步脚本（增强版）
从 MySQL 数据库获取表结构，并从 Java PO 类中提取枚举值注释
"""

import pymysql
import os
import re
from datetime import datetime
from collections import defaultdict

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
SRC_DIR = os.path.join(PROJECT_ROOT, 'src', 'com', 'fanglin')

# 模块到数据库的映射
MODULE_DB_MAP = {
    'approval': 'approval',
    'balance': 'balance',
    'building': 'building',
    'communion': 'communion',
    'common': 'platform',
    'construction': 'construction',
    'customer': 'customer',
    'data': 'data',
    'decoration': 'decoration',
    'factory': 'factory',
    'information': 'information',
    'inventory': 'inventory',
    'log': 'platform',
    'market': 'market',
    'material': 'material',
    'payment': 'payment',
    'personel': 'platform',
    'production': 'production',
    'quotation': 'quotation',
    'salary': 'salary',
    'sales': 'sales',
    'store': 'store',
    'system': 'platform',
    'report': 'report',
}


class JavaEnumExtractor:
    """从 Java PO 类中提取枚举值和常量定义"""

    def __init__(self, src_dir):
        self.src_dir = src_dir
        self.cache = {}  # (module, table) -> {field: [(value, comment)]}

    def extract_constants_from_file(self, file_path):
        """从 Java 文件中提取常量定义"""
        if not os.path.exists(file_path):
            return {}

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        constants = defaultdict(list)

        # 匹配模式: public static final TYPE_TYPE_INT = 1; // 类型描述
        # 或者: public static final TYPE_TYPE = 1; // 类型描述

        # 1. 提取状态枚举 (STATUS_xxx_INT = value // comment)
        pattern1 = r'public\s+static\s+(?:final\s+)?(?:short|int|long)\s+(\w+)\s*=\s*(\d+)\s*;\s*//\s*(.+?)(?:\n|$)'
        for match in re.finditer(pattern1, content):
            name = match.group(1)
            value = match.group(2)
            comment = match.group(3).strip()

            # 提取字段名部分 (如 STATUS_INIT_INT -> status)
            field_name = self._extract_field_name(name)
            if field_name:
                constants[field_name].append((value, comment))

        # 2. 提取常量 (TYPE_xxx = value // comment)
        pattern2 = r'private\s+static\s+final\s+(?:short|int|long)\s+(\w+)\s*=\s*(\d+)\s*;\s*//\s*(.+?)(?:\n|$)'
        for match in re.finditer(pattern2, content):
            name = match.group(1)
            value = match.group(2)
            comment = match.group(3).strip()

            field_name = self._extract_field_name(name)
            if field_name:
                constants[field_name].append((value, comment))

        # 3. 提取行内注释 (private FieldType fieldName; // 注释)
        pattern3 = r'private\s+(\w+(?:\[\])?)\s+(\w+)\s*;\s*//\s*(.+?)(?:\n|$)'
        for match in re.finditer(pattern3, content):
            field_type = match.group(1)
            field_name = match.group(2)
            comment = match.group(3).strip()

            # 转换为下划线命名
            db_field = self._camel_to_snake(field_name)
            constants[db_field + '_inline'] = [(None, comment)]

        return dict(constants)

    def _extract_field_name(self, constant_name):
        """从常量名提取字段名"""
        # 例如: STATUS_INIT_INT -> status
        #       TYPE_INIT_SALESCALE_INT -> type
        #       DESIGNSTATUS_INITIA_INT -> designStatus

        # 移除常见的后缀
        name = constant_name
        for suffix in ['_INT', '_LONG', '_SHORT']:
            if name.endswith(suffix):
                name = name[:-len(suffix)]

        # 按下划线分割
        parts = name.split('_')

        # 识别字段部分（通常是第一部分，或者包含特定关键词的部分）
        field_keywords = ['STATUS', 'TYPE', 'STATE', 'CODE']
        for i, part in enumerate(parts):
            if part in field_keywords:
                # 找到字段结束位置
                field_parts = []
                for j in range(i + 1, len(parts)):
                    next_part = parts[j]
                    # 遇到状态词表示字段结束
                    if next_part.upper() in ['INIT', 'INITIAL', 'INT', 'START', 'BEGIN',
                                              'DEPOSIT', 'PROSIGN', 'SIGNED', 'RESIGNED',
                                              'WASTE', 'TERMINATION', 'FINAL', 'COMPLETED',
                                              'APPROVAL', 'TERMINABLE', 'CONDUCT', 'END',
                                              'MORE', 'MINI', 'MID', 'INCLUSIVE', 'HOLONOMY']:
                        break
                    field_parts.append(next_part)

                # 如果没有找到字段部分，使用状态词本身作为字段
                if not field_parts and i == 0:
                    return part.lower()

                # 组合字段名
                if field_parts:
                    result = part.lower() + ''.join([p.capitalize() for p in field_parts])
                    # 转换为下划线命名
                    return self._camel_to_snake(result)

        # 默认返回第一部分（转小写）
        if parts:
            return parts[0].lower()
        return None

    def _camel_to_snake(self, name):
        """驼峰命名转下划线命名"""
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    def get_constants_for_table(self, module, table_name):
        """获取表的常量定义"""
        cache_key = (module, table_name)
        if cache_key in self.cache:
            return self.cache[cache_key]

        # 查找对应的 PO 文件
        po_file = os.path.join(self.src_dir, module, 'po',
                               self._table_to_class(table_name) + 'PO.java')

        constants = self.extract_constants_from_file(po_file)
        self.cache[cache_key] = constants
        return constants

    def _table_to_class(self, table_name):
        """表名转类名"""
        # 例如: customerorigin -> CustomerOrigin
        return ''.join([p.capitalize() for p in table_name.split('_')])

    def get_enhanced_comment(self, module, table, field, original_comment):
        """获取增强的字段注释"""
        constants = self.get_constants_for_table(module, table)

        # 检查是否有枚举值
        field_key = field
        if field_key in constants and constants[field_key]:
            values = constants[field_key]
            if len(values) > 0:
                # 格式化枚举值
                value_str = ', '.join([f"{v}:{c}" for v, c in values[:10]])  # 最多显示10个
                if original_comment:
                    return f"{original_comment} ({value_str})"
                return value_str

        # 检查是否有行内注释
        inline_key = field + '_inline'
        if inline_key in constants and constants[inline_key]:
            inline_comment = constants[inline_key][0][1]
            if original_comment and inline_comment:
                return f"{original_comment} {inline_comment}"
            return inline_comment or original_comment

        return original_comment


def get_connection():
    """获取数据库连接"""
    return pymysql.connect(**DB_CONFIG)


def get_all_databases(connection):
    """获取所有数据库名称"""
    cursor = connection.cursor()
    cursor.execute("SHOW DATABASES")
    databases = [row[0] for row in cursor.fetchall()]
    cursor.close()

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
    """获取表的选项信息"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW TABLE STATUS FROM `{database}` WHERE Name = '{table}'")
    result = cursor.fetchone()
    cursor.close()

    if result:
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, result))
    return {}


def get_module_for_database(database):
    """根据数据库名获取对应的模块名"""
    for module, db in MODULE_DB_MAP.items():
        if db == database:
            return module
    return database


def generate_create_table_sql(connection, database, table, enum_extractor):
    """生成完整的 CREATE TABLE 语句"""
    columns = get_table_columns(connection, database, table)
    indexes = get_table_indexes(connection, database, table)
    table_options = get_table_options(connection, database, table)

    module = get_module_for_database(database)

    # 收集主键和索引
    primary_keys = set()
    index_dict = {}

    for idx in indexes:
        key_name = idx[2]
        column_name = idx[4]
        seq_in_index = idx[3]
        non_unique = idx[1]
        index_type = idx[10] if len(idx) > 10 else 'BTREE'

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

    for col in columns:
        field = col[0]
        type_info = col[1]
        null = col[3]
        key = col[4]
        default = col[5]
        extra = col[6] if col[6] is not None else ''
        comment = col[8] if len(col) > 8 and col[8] is not None else ''

        # 获取增强注释
        enhanced_comment = enum_extractor.get_enhanced_comment(
            module, table, field, comment
        )

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
                if type_info.upper().startswith(('VARCHAR', 'CHAR', 'TEXT', 'DATE', 'DATETIME', 'TIME')):
                    col_def += f" DEFAULT '{default}'"
                else:
                    col_def += f" DEFAULT {default}"

        # AUTO_INCREMENT
        if extra and 'auto_increment' in extra.lower():
            col_def += " AUTO_INCREMENT"

        # COMMENT (使用增强注释)
        if enhanced_comment:
            comment_escaped = enhanced_comment.replace("'", "''")
            col_def += f" COMMENT '{comment_escaped}'"

        column_defs.append(col_def)

    # 添加主键
    if primary_keys:
        pk_cols = ', '.join([f"`{col}`" for col in sorted(primary_keys)])
        column_defs.append(f"  PRIMARY KEY ({pk_cols})")

    # 添加索引
    for idx_name, idx_info in sorted(index_dict.items()):
        idx_info['columns'].sort()
        cols = ', '.join([f"`{col[1]}`" for col in idx_info['columns']])

        if idx_info['unique']:
            column_defs.append(f"  UNIQUE KEY `{idx_name}` ({cols}) USING {idx_info['type']}")
        else:
            column_defs.append(f"  KEY `{idx_name}` ({cols}) USING {idx_info['type']}")

    # 表选项
    engine = table_options.get('Engine', 'InnoDB')
    charset = table_options.get('Collation', 'utf8_general_ci').replace('-', '')
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

    sql = f"DROP TABLE IF EXISTS `{table}`;\n"
    sql += f"CREATE TABLE `{table}` (\n"
    sql += ",\n".join(column_defs)
    sql += "\n"
    sql += options + ";"

    return sql


def generate_database_sql(database, connection, enum_extractor):
    """生成整个数据库的 SQL"""
    cursor = connection.cursor()
    cursor.execute(f"SHOW TABLES FROM `{database}`")
    tables = [row[0] for row in cursor.fetchall()]
    cursor.close()

    if not tables:
        return f"-- Database {database} has no tables\n"

    tables.sort()

    sql_lines = []
    sql_lines.append(f"CREATE DATABASE IF NOT EXISTS `{database}`;")
    sql_lines.append(f"USE `{database}`;")
    sql_lines.append("")
    sql_lines.append(f"-- Generated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_lines.append(f"-- Total tables: {len(tables)}")
    sql_lines.append("")

    for table in tables:
        create_sql = generate_create_table_sql(connection, database, table, enum_extractor)
        sql_lines.append(create_sql)
        sql_lines.append("")

    return '\n'.join(sql_lines)


def sync_database_schema():
    """同步数据库结构到 SQL 文件"""
    print("=" * 60)
    print("数据库表结构同步工具（增强版 - 带枚举注释）")
    print("=" * 60)

    # 初始化枚举提取器
    enum_extractor = JavaEnumExtractor(SRC_DIR)

    connection = None
    try:
        connection = get_connection()
        print(f"\n成功连接到数据库: {DB_CONFIG['host']}:{DB_CONFIG['port']}\n")

        all_databases = get_all_databases(connection)
        print(f"发现 {len(all_databases)} 个业务数据库\n")

        os.makedirs(DBS_DIR, exist_ok=True)

        synced_count = 0
        for db_name in set(MODULE_DB_MAP.values()):
            if db_name in all_databases:
                print(f"正在同步数据库: {db_name}...")
                sql_content = generate_database_sql(db_name, connection, enum_extractor)

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
