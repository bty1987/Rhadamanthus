# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path

SPHINX_DIR = "D:/ERP/Rhadamanthus/docs/sphinx"


class MarkdownFixer:
    """修复 MD 文件中的 RST 语法残留 v3"""

    def fix_file(self, md_path):
        """修复单个 MD 文件"""
        with open(md_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        fixed_content = self.fix_content(content)
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        return md_path

    def fix_content(self, content):
        """修复内容中的 RST 语法"""
        if not content.strip():
            return content

        # 1. 清理 BOM 和开头空行
        content = content.lstrip('\ufeff').strip()

        # 2. 移除 RST 字段列表语法 :Release: |version| 等
        content = re.sub(r'^:[\w\s]+:\s*\|\w+\|\s*$', '', content, flags=re.MULTILINE)

        # 3. 处理 % 开头的标题（RST 特殊格式）
        content = re.sub(r'^#\s*(\w+)%\s*(.+)$', r'# \2', content, flags=re.MULTILINE)

        # 4. 移除重复的标题
        content = re.sub(r'^# (\w+)#\s*', r'# \1', content, flags=re.MULTILINE)

        # 5. 移除锚点 {#label} 语法
        content = re.sub(r'\s*\{#[\w:]+\}\s*', '', content)

        # 6. 转换 |Requests:| |Returns:| |DataType:| 标记
        content = re.sub(r'\|Requests:\|', '**请求参数**:', content)
        content = re.sub(r'\|Returns:\|', '**返回参数**:', content)
        content = re.sub(r'\|DataType:\|', '**数据类型**:', content)

        # 7. 清理 Example:: download:: 等标记（提前处理，避免与表格冲突）
        content = re.sub(r'\bExample::\s*', '**示例**:', content)
        content = re.sub(r'\bdownload::\s*', 'download', content)
        content = re.sub(r'::\s*\w+\s*::\s*', '', content)

        # 8. 清理 RST 表格边框和表格行
        lines = content.split('\n')
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            # 跳过纯表格边框行
            if re.match(r'^[\+\=\-]{10,}', stripped):
                continue
            if re.match(r'^\|[\+\-\=\s]{5,}\|?\s*$', stripped):
                continue
            if re.match(r'^\+[\+\-\=]+\+\s*$', stripped):
                continue
            if '=============' in stripped or '-------------' in stripped:
                continue
            # 处理 | fieldName | description | 类型的表格行 - 转换为 Markdown 格式
            if re.match(r'^\|\s*\w+\s*\|', stripped) and 'http' not in stripped:
                # 如果是表格边框行，跳过
                if re.search(r'\|[\s\-]{10,}\|', stripped):
                    continue
            cleaned_lines.append(line)
        content = '\n'.join(cleaned_lines)

        # 9. 处理 :param: 和 :type:
        # 首先处理多行组合 :param xxx: \n :type xxx:
        def fix_param_block(content):
            """处理参数块"""
            # 匹配 :param xxx: 描述 后面跟着 :type xxx: 类型的模式
            pattern = r':param\s+([\w\[\].]+):\s*(.*?)\n\s*:type\s+[\w\[\].]+:\s*(.*?)(?=\n|$)'
            def repl(m):
                param = m.group(1)
                desc = m.group(2).strip() if m.group(2) else ''
                type_val = m.group(3).strip() if m.group(3) else ''
                result = f'- **{param}**:'
                if desc:
                    result += f'\n  - {desc}'
                if type_val:
                    result += f'\n  - 类型: `{type_val}`'
                return result
            return re.sub(pattern, repl, content, flags=re.MULTILINE)

        content = fix_param_block(content)

        # 处理单独的 :param: 行
        content = re.sub(r'\s*:param\s+([\w\[\].]+):\s*', r'\n- **\1**:', content)

        # 处理单独的 :type: 行（紧跟在参数行后的类型）
        content = re.sub(r'(:type\s+[\w\[\].]+:\s*)(.*?)(?=\n|$)', r'  - 类型: `\2`', content)

        # 10. 清理 RST 风格的表格边框残留
        content = re.sub(r'\+={20,}\+', '', content)
        content = re.sub(r'\+-{20,}\+', '', content)
        content = re.sub(r'^\|[\s\-|]{20,}\|\s*$', '', content, flags=re.MULTILINE)

        # 11. 清理多余空行
        content = re.sub(r'\n{4,}', '\n\n\n', content)

        # 12. 清理行尾空格
        lines = content.split('\n')
        lines = [line.rstrip() for line in lines]
        content = '\n'.join(lines)

        return content.strip() + '\n'


def fix_all_files():
    """修复所有 MD 文件"""
    fixer = MarkdownFixer()
    sphinx_path = Path(SPHINX_DIR)

    # 获取所有 MD 文件
    md_files = list(sphinx_path.glob('**/*.md'))
    md_files = list(set(md_files))  # 去重

    print(f"找到 {len(md_files)} 个 MD 文件需要修复")
    print("-" * 40)

    fixed = []
    for md_file in md_files:
        try:
            fixer.fix_file(str(md_file))
            fixed.append(str(md_file))
            print(f"OK: {md_file.relative_to(sphinx_path)}")
        except Exception as e:
            print(f"ERROR: {md_file.relative_to(sphinx_path)}: {e}")

    print("-" * 40)
    print(f"修复了 {len(fixed)} 个文件")
    return fixed


def main():
    print("=" * 40)
    print("Markdown 语法修复工具 v3")
    print("=" * 40)
    fix_all_files()


if __name__ == '__main__':
    main()
