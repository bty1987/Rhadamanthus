# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path

SPHINX_DIR = "D:/ERP/Rhadamanthus/docs/sphinx"


class RstToMarkdownConverter:
    def convert_file(self, rst_path):
        with open(rst_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        md_content = self.convert_content(content)
        md_path = rst_path.replace('.rst', '.md')
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        return md_path

    def convert_content(self, content):
        if not content.strip():
            return content

        # 锚点 .. _label:
        content = re.sub(r'^\.\. _(\w+):$', r'# \1 {#\1}', content, flags=re.MULTILINE)

        # 章节标题 (****** 标题 ****** 或 ### 标题 ###)
        content = re.sub(r'^#+\s*\n(.+?)\n#+\s*$', r'% \1' if len(r'\1'.split()[0]) < 20 else r'# \1', content, flags=re.MULTILINE)
        content = re.sub(r'^\*{7,}\s*\n(.+?)\n\*{7,}\s*$', r'# \1', content, flags=re.MULTILINE)
        content = re.sub(r'^={7,}\s*\n(.+?)\n={7,}\s*$', r'## \1', content, flags=re.MULTILINE)
        content = re.sub(r'^-{7,}\s*\n(.+?)\n-{7,}\s*$', r'### \1', content, flags=re.MULTILINE)

        # 单行下划线标题
        content = re.sub(r'^(.+?)\n=+$', r'## \1', content, flags=re.MULTILINE)
        content = re.sub(r'^(.+?)\n-+$', r'### \1', content, flags=re.MULTILINE)

        # 标题分隔符 #######################
        content = re.sub(r'#{10,}', '', content)

        # 超链接 `文本 <url>`__
        content = re.sub(r'`([^`]+?)\s*<([^>]+)>`__', r'[\1](\2)', content)

        # 代码块 .. code-block:: lang
        content = re.sub(r'\.\. code-block::\s*(\w+)(?:\s*\n|$)', r'```\1\n', content)

        # .. class:: 声明
        content = re.sub(r'\.\. class::\s+(.+?)\s*\n\s*\n', r'## \1\n\n', content)

        # .. method:: 声明
        content = re.sub(r'\.\. method::\s+(.+?)\s*\n', r'### \1\n\n', content)

        # .. data:: 声明
        content = re.sub(r'\.\. data::\s+(.+?)\s*\n', r'#### \1\n\n', content)

        # 参数 :param: 和 :type:
        content = re.sub(r':param\s+(\w+):\s*(.+)', r'- **\1**: \2', content)
        content = re.sub(r':type\s+(\w+):\s*(.+)', r'  - 类型: *\2*', content)

        # Example:: 标记
        content = re.sub(r'\nExample::\s*\n\s*\n', r'\n**示例**:\n\n```\n', content)

        # 表格边框
        content = re.sub(r'\+\-+\+\s*\n', '', content)
        content = re.sub(r'\|[+-]+\|\s*\n', '', content)

        # 交叉引用
        content = re.sub(r':ref:`(\w+)`', r'[\1](#\1)', content)
        content = re.sub(r':data:`(\w+)`', r'*\1*', content)

        # .. note::
        content = re.sub(r'\.\. note::\s*\n\s*(.+)', r'> **Note**: \1', content)

        # .. image::
        content = re.sub(r'\.\. image::\s+(.+)', r'![\1](\1)', content)

        # .. toctree:: 转换为 Markdown 列表
        content = re.sub(r'\.\. toctree::.*?(?=\n\n|\Z)', self._convert_toctree, content, flags=re.DOTALL)

        # 清理多余的空行
        content = re.sub(r'\n{3,}', '\n\n', content)

        return content.strip() + '\n'

    def _convert_toctree(self, match):
        """转换 toctree 指令为 Markdown 列表"""
        toctree_content = match.group(0)
        # 提取列表项
        lines = toctree_content.split('\n')
        items = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('..') and not line.startswith(':'):
                # 转换为 Markdown 链接
                if line.endswith('.rst'):
                    md_file = line.replace('.rst', '.md')
                    title = md_file.replace('./modules/', '').replace('.md', '').capitalize()
                    items.append(f'- [{title}]({md_file})')
                elif line.startswith('./'):
                    items.append(f'- {line}')
        return '\n'.join(items) if items else ''


def convert_all_files():
    converter = RstToMarkdownConverter()
    sphinx_path = Path(SPHINX_DIR)
    rst_files = list(sphinx_path.glob('**/*.rst'))

    print(f"Found {len(rst_files)} RST files")
    print("-" * 40)

    converted = []
    for rst_file in rst_files:
        try:
            md_path = converter.convert_file(str(rst_file))
            converted.append(md_path)
            print(f"OK: {rst_file.name}")
        except Exception as e:
            print(f"ERROR: {rst_file.name}: {e}")

    print("-" * 40)
    print(f"Converted {len(converted)} files")
    return converted


def main():
    print("=" * 40)
    print("RST to Markdown Converter")
    print("=" * 40)
    convert_all_files()


if __name__ == '__main__':
    main()
