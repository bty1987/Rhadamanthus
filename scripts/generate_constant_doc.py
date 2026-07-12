# -*- coding: utf-8 -*-
"""
从 communion.constant 表生成常量文档
"""

import pymysql
from collections import defaultdict
from datetime import datetime

# 数据库配置
DB_CONFIG = {
    'host': '192.168.5.21',
    'port': 3306,
    'user': 'root',
    'password': 'Neusoft!',
    'charset': 'utf8mb4',
    'database': 'communion'
}


def fetch_constants():
    """从数据库获取所有常量"""
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT cid, name, module, clazz, type, field, `key`, value, status, updateTime
        FROM constant
        WHERE status = 0
        ORDER BY module, clazz, type, field, value
    """)

    columns = ['cid', 'name', 'module', 'clazz', 'type', 'field', 'key', 'value', 'status', 'updateTime']
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    cursor.close()
    conn.close()
    return results


def group_constants(constants):
    """按模块、类、字段分组"""
    grouped = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    for const in constants:
        module = const['module'] or 'unknown'
        clazz = const['clazz'] or 'unknown'
        field = const['field'] or 'unknown'
        grouped[module][clazz][field].append(const)

    return grouped


def generate_markdown(grouped):
    """生成 Markdown 文档 - 按 module -> clazz -> type 分类，同 type 汇总到一个表格"""

    lines = []
    lines.append("# 系统常量定义文档")
    lines.append("")
    lines.append(f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("> 来源: `communion.constant` 表")
    lines.append("")

    # 生成统计信息
    total_modules = len(grouped)
    total_classes = sum(len(v) for v in grouped.values())
    total_consts = 0
    for module in grouped.values():
        for clazz in module.values():
            for field in clazz.values():
                total_consts += len(field)

    lines.append("## 统计信息")
    lines.append("")
    lines.append(f"- **模块数**: {total_modules}")
    lines.append(f"- **类数**: {total_classes}")
    lines.append(f"- **常量数**: {total_consts}")
    lines.append("")

    # 生成目录
    lines.append("## 目录")
    lines.append("")
    for module in sorted(grouped.keys()):
        module_lower = module.lower()
        lines.append(f"- [{module.upper()}](#{module_lower})")
        for clazz in sorted(grouped[module].keys()):
            # 生成锚点（替换特殊字符）
            anchor = clazz.lower().replace('_', '-')
            lines.append(f"  - [{clazz}](#{module_lower}-{anchor})")
    lines.append("")

    lines.append("---")
    lines.append("")

    # 按模块遍历
    for module in sorted(grouped.keys()):
        module_lower = module.lower()
        lines.append(f"## {module.upper()} 模块")
        lines.append("")
        lines.append(f"<a name=\"{module_lower}\"></a>")
        lines.append("")

        # 按类遍历
        for clazz in sorted(grouped[module].keys()):
            anchor = f"{module_lower}-{clazz.lower().replace('_', '-')}"
            lines.append(f"### {clazz}")
            lines.append("")
            lines.append(f"<a name=\"{anchor}\"></a>")
            lines.append("")

            # 按 type 分类汇总
            type_groups = defaultdict(list)
            for field in grouped[module][clazz].keys():
                consts = grouped[module][clazz][field]
                field_type = consts[0]['type'] if consts else ''
                type_groups[field_type].extend(consts)

            # 遍历每个 type，生成一个汇总表格
            for field_type in sorted(type_groups.keys()):
                type_display = field_type if field_type else '未分类'
                all_consts = type_groups[field_type]

                lines.append(f"#### **{field_type}** ({len(all_consts)} 项)")
                lines.append("")

                # 汇总表格：字段 | 值 | 描述
                lines.append("| 字段 | 值 | 描述 |")
                lines.append("|:---|---:|:---|")

                for const in all_consts:
                    field = const['field'] or ''
                    value = const['key'] or ''
                    name = const['name'] or ''
                    lines.append(f"| `{field}` | `{value}` | {name} |")

                lines.append("")

    return '\n'.join(lines)


def generate_json_enums(grouped):
    """生成 JSON 格式的枚举定义"""

    result = {}

    for module in grouped:
        result[module] = {}
        for clazz in grouped[module]:
            result[module][clazz] = {}
            for field in grouped[module][clazz]:
                consts = grouped[module][clazz][field]
                enums = []
                for const in consts:
                    enums.append({
                        'value': const['value'],
                        'key': const['key'],
                        'name': const['name']
                    })
                result[module][clazz][field] = enums

    return result


def generate_java_constants(grouped):
    """生成 Java 常量定义"""

    lines = []
    lines.append("/**")
    lines.append(" * 系统常量定义")
    lines.append(f" * 自动生成于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(" */")
    lines.append("package com.fanglin.communion.constant;")
    lines.append("")
    lines.append("/**")
    lines.append(" * 系统常量接口")
    lines.append(" * 包含所有业务模块的常量定义")
    lines.append(" */")
    lines.append("public interface SystemConstants {")
    lines.append("")

    for module in sorted(grouped.keys()):
        lines.append(f"\t// ==================== {module.upper()} 模块 ====================")
        lines.append("")

        for clazz in sorted(grouped[module].keys()):
            # 移除可能的 PO 后缀
            class_name = clazz.replace('PO', '').replace('AO', '')
            lines.append(f"\t// {class_name}")

            for field in sorted(grouped[module][clazz].keys()):
                consts = grouped[module][clazz][field]

                # 创建内部接口
                # 转换字段名为合法的 Java 类名
                inner_class_name = to_java_class_name(field)

                lines.append(f"\tinterface {inner_class_name} {{")

                for const in consts:
                    original_key = const['key'] or ''  # 这是常量值 (如 "0", "1")
                    value = const['value'] or ''       # 这是中文描述
                    name = const['name'] or ''

                    # 从字段名提取常量名基础
                    # 例如: STATUS_INIT_INT -> STATUS_INIT
                    if original_key and original_key.replace('_INT', '').replace('_SHORT', '').replace('-', '').replace('_', '').isalnum():
                        key = original_key.replace('_INT', '').replace('_SHORT', '')
                    else:
                        # 从 name 或 value 生成常量名
                        key = to_constant_name(value or name or field)

                    # 转为合法的 Java 标识符（大写下划线）
                    key = key.replace('-', '_').replace(' ', '_').upper()
                    if not key or not key[0].isalpha():
                        key = 'VAL_' + key

                    # 判断常量值类型 (key 是常量值)
                    if original_key and original_key.lstrip('-').isdigit():
                        lines.append(f"\t\tint {key} = {original_key}; // {name}")
                    else:
                        # 字符串值需要加引号
                        escaped_key = (original_key or '').replace("'", "\\'")
                        lines.append(f"\t\tString {key} = \"{escaped_key}\"; // {name}")

                lines.append(f"\t}}")
                lines.append("")

    lines.append("}")
    return '\n'.join(lines)


def to_java_class_name(field_name):
    """将字段名转换为合法的 Java 类名"""
    # 移除特殊字符，转驼峰
    name = field_name.replace('-', '_').replace(' ', '_')
    parts = name.split('_')
    result = ''.join([p.capitalize() for p in parts if p])
    # 如果结果为空或以数字开头，添加前缀
    if not result or result[0].isdigit():
        result = 'Field' + result
    return result


def to_constant_name(text):
    """将中文/英文文本转换为常量名（大写下划线）"""
    if not text:
        return 'UNKNOWN'
    # 移除括号内容，移除空格和特殊字符
    text = text.split('(')[0]
    # 转拼音（简单处理：移除非ASCII字符）
    import re
    # 只保留字母和数字
    text = re.sub(r'[^a-zA-Z0-9]', '_', text)
    text = text.strip('_').upper()
    return text or 'UNKNOWN'


def main():
    """主函数"""
    print("正在从数据库读取常量...")

    constants = fetch_constants()
    print(f"共读取 {len(constants)} 条常量定义")

    grouped = group_constants(constants)

    # 统计信息
    module_count = len(grouped)
    class_count = sum(len(v) for v in grouped.values())
    field_count = sum(len(v2) for v in grouped.values() for v2 in v.values())

    print(f"包含 {module_count} 个模块, {class_count} 个类, {field_count} 个字段")

    # 生成 Markdown 文档
    markdown = generate_markdown(grouped)
    md_path = "D:/ERP/Rhadamanthus/docs/CONSTANTS.md"
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(markdown)
    print(f"Markdown 文档已生成: {md_path}")

    # 生成 JSON 文件
    import json
    json_data = generate_json_enums(grouped)
    json_path = "D:/ERP/Rhadamanthus/docs/constants.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"JSON 文件已生成: {json_path}")

    # 生成 Java 文件
    java_code = generate_java_constants(grouped)
    java_path = "D:/ERP/Rhadamanthus/src/com/fanglin/communion/constant/SystemConstants.java"
    import os
    os.makedirs(os.path.dirname(java_path), exist_ok=True)
    with open(java_path, 'w', encoding='utf-8') as f:
        f.write(java_code)
    print(f"Java 常量类已生成: {java_path}")

    print("\n生成完成!")


if __name__ == '__main__':
    main()
