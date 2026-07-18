#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
i18n HTML 自动打标工具(基于已有语言包回填 data-i18n 属性)

读取 message-{lang}.json + page/{module}-{lang}.json 建立中文→key 反查表,
扫描指定 HTML,自动给中文文本节点和 placeholder 加 data-i18n 属性。

工作流(推荐配合 extract_i18n.py 使用):
  1. extract_i18n.py 扫描模块,人工校对生成 page/{module}-cn.json 语言包
  2. 本脚本基于该语言包,自动把 data-i18n 属性回填到 HTML
  3. 剩余未命中的中文(长描述等)留待人工处理

特性:
  - 安全:默认 dry-run,加 --write 才改文件
  - 幂等:已带 data-i18n 的元素不重复标记
  - 保留原文:只加属性,不删文本(原文作 fallback)
  - 三种属性:data-i18n(文本)/ data-i18n-ph(placeholder)/ data-i18n-title(title)

用法:
  # dry-run:只报告,不改文件
  python scripts/apply_i18n_marks.py WebContent/views/decoration/ --module decoration

  # 实际写入
  python scripts/apply_i18n_marks.py WebContent/views/decoration/ --module decoration --write

  # 单文件
  python scripts/apply_i18n_marks.py WebContent/views/decoration/decorationMeasure.html --module decoration --write

退出码: 0 正常, 1 路径错误
"""

import os
import re
import sys
import json
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WC = os.path.join(ROOT, 'WebContent')
CJK_RE = re.compile(r'[\u4e00-\u9fff]')

# 标签识别:开标签(用于回填属性)、属性抽取
OPEN_TAG_RE = re.compile(r'<([a-zA-Z][\w-]*)(\s[^>]*?)?(/?)>')
ATTR_RE = re.compile(r'(\w[\w-]*)\s*=\s*"([^"]*)"')


def build_reverse_map(module):
    """合并 message-cn + page/{module}-cn,建立 {中文文案: key} 反查表"""
    rev = {}
    files = [
        os.path.join(WC, 'js', 'i18n', 'message-cn.json'),
        os.path.join(WC, 'js', 'i18n', 'page', module + '-cn.json'),
    ]
    for f in files:
        if not os.path.exists(f):
            print('[WARN] 语言包不存在,跳过: %s' % f)
            continue
        with open(f, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
        for k, v in data.items():
            if k.startswith('_') or not isinstance(v, str):
                continue
            # 用更长的 key 覆盖短的(同一中文文案,优先更具体的 page.* 而非通用 msg.*)
            if v in rev:
                if len(k) > len(rev[v]):
                    rev[v] = k
            else:
                rev[v] = k
    return rev


def is_already_marked(tag_attrs):
    """该标签是否已有 data-i18n 属性"""
    return bool(re.search(r'data-i18n(\s*=|-ph=|-title=)', tag_attrs or ''))


def find_text_key(text, rev):
    """中文文本 → key。完全匹配优先,否则 None"""
    if not text:
        return None
    t = text.strip()
    if not t or not CJK_RE.search(t):
        return None
    return rev.get(t)


def find_attr_key(val, rev):
    """属性值 → key"""
    if not val:
        return None
    t = val.strip()
    if not t or not CJK_RE.search(t):
        return None
    return rev.get(t)


def process_html(filepath, rev, do_write):
    """
    处理一个 HTML 文件,自动回填 data-i18n 属性
    策略:逐行处理,对每行的中文做匹配
      - placeholder="中文" → 加 data-i18n-ph
      - title="中文" → 加 data-i18n-title
      - <tag ...>中文< 后续行</tag>:给该开标签加 data-i18n
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    rel = os.path.relpath(filepath, ROOT)

    stats = {'text': 0, 'ph': 0, 'title': 0, 'miss': 0}

    # === ① placeholder / title 属性回填 ===
    def repl_attr(match):
        prefix, attr_name, val = match.group(1), match.group(2), match.group(3)
        key = find_attr_key(val, rev)
        if not key:
            return match.group(0)
        # 判定该标签是否已有该 data-i18n-* 属性(粗略:在前后 200 字符内查)
        ctx_start = max(0, match.start() - 200)
        ctx = content[ctx_start:match.end() + 200]
        new_attr = 'data-i18n-ph' if attr_name == 'placeholder' else 'data-i18n-title'
        if re.search(new_attr + r'\s*=', ctx):
            return match.group(0)
        stats['ph' if attr_name == 'placeholder' else 'title'] += 1
        return match.group(0) + ' ' + new_attr + '="' + key + '"'

    # 匹配 placeholder="..." 或 title="..."
    content = re.sub(
        r'(\s)(placeholder|title)\s*=\s*"([^"]*[\u4e00-\u9fff][^"]*)"',
        repl_attr, content
    )

    # === ② 文本节点回填 ===
    # 策略:逐开标签扫描,看其紧随的纯文本是否完全等于某个 key 的中文
    # <label ...>中文</label> 给 label 加 data-i18n
    # <button ...><i></i> 中文</button> 给 button 加 data-i18n(中文是其唯一文本)
    # <h4 ...>中文</h4> 类似
    # 为安全起见,只在标签紧邻的文本"完全匹配"时才标记

    def repl_text_tag(match):
        tag_name = match.group(1)
        attrs = match.group(2) or ''
        self_close = match.group(3)
        full = match.group(0)
        if self_close:
            return full
        if is_already_marked(attrs):
            return full
        # 在原 content 里查这个标签之后紧跟的文本(到下一个 < 为止)
        after = content[match.end():match.end() + 500]
        # 取首个文本片段
        m = re.match(r'\s*([^<]+)', after)
        if not m:
            return full
        text = m.group(1).strip()
        if not text:
            return full
        key = find_text_key(text, rev)
        if not key:
            # 尝试剥离常见内部元素后的纯文本(如 <i class="x"></i>保存)
            # 取整段到 </tag> 的纯文本拼接
            close_re = re.compile(r'</' + tag_name + r'\s*>', re.DOTALL)
            close_m = close_re.search(after)
            if close_m:
                inner = after[:close_m.start()]
                # 去掉所有标签
                pure = re.sub(r'<[^>]+>', '', inner).strip()
                key = find_text_key(pure, rev)
            if not key:
                return full
        stats['text'] += 1
        # 在开标签末尾(self_close 之前)插入 data-i18n
        return '<' + tag_name + attrs + ' data-i18n="' + key + '"' + self_close + '>'

    # 只对常见的"包裹中文文本"的标签处理,避免误伤
    content = re.sub(
        r'<(label|button|h[1-6]|small|span|a|strong|em|p|div|option|li)(\s[^>]*?)?(/?)>',
        repl_text_tag, content
    )

    if content != original:
        changed = sum(stats.values())
        if do_write:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print('[WRITE] %s: 标记 %d 处 (text=%d, ph=%d, title=%d)'
                  % (rel, changed, stats['text'], stats['ph'], stats['title']))
        else:
            print('[DRY-RUN] %s: 将标记 %d 处 (text=%d, ph=%d, title=%d)'
                  % (rel, changed, stats['text'], stats['ph'], stats['title']))
        return changed
    else:
        print('[SKIP] %s: 无可标记内容' % rel)
        return 0


def main():
    parser = argparse.ArgumentParser(description='i18n HTML 自动打标工具')
    parser.add_argument('paths', nargs='+', help='HTML 文件或目录')
    parser.add_argument('--module', required=True, help='业务模块名(用于加载 page/{module}-cn.json)')
    parser.add_argument('--write', action='store_true', help='实际写入文件(默认 dry-run)')
    args = parser.parse_args()

    rev = build_reverse_map(args.module)
    print('反查表大小: %d 条 (message + page/%s)' % (len(rev), args.module))
    print('=' * 60)

    total = 0
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
        for h in sorted(htmls):
            total += process_html(h, rev, args.write)

    print('=' * 60)
    print('总计标记: %d 处' % total)
    if not args.write:
        print('(dry-run 模式,加 --write 实际写入)')


if __name__ == '__main__':
    sys.exit(main() or 0)
