#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""扫描 menu-{en,tw}.json 的异常值"""
import json

LANGS = ['en', 'tw']

for lang in LANGS:
    path = 'WebContent/js/i18n/menu-' + lang + '.json'
    d = json.load(open(path, 'r', encoding='utf-8'))
    print('=== ' + path + ' 异常值扫描 ===')
    weird = []
    total = 0
    for k, v in d.items():
        if k.startswith('_') or not isinstance(v, str):
            continue
        total += 1
        problems = []
        if '<' in v or '>' in v:
            problems.append('含<>')
        if '"' in v:
            problems.append('含双引号')
        if "'" in v:
            problems.append('含单引号')
        if '\\' in v:
            problems.append('含反斜杠')
        if '\n' in v or '\r' in v:
            problems.append('含换行')
        if '&' in v and ';' in v:
            problems.append('可能HTML实体')
        if not v.strip():
            problems.append('空值')
        if v != v.strip():
            problems.append('首尾空格')
        if len(v) > 30:
            problems.append('过长(' + str(len(v)) + '字)')
        # 中文里夹杂英文(可能翻译漏了)
        if lang == 'en':
            # 英文包里若含中文字符,说明翻译漏了
            import re
            if re.search(r'[\u4e00-\u9fff]', v):
                problems.append('英文包含中文')
        if problems:
            weird.append((k, v, problems))
    print('  异常条数: %d / %d' % (len(weird), total))
    for k, v, p in weird[:30]:
        print('  %s = [%s] 问题: %s' % (k, v, ','.join(p)))
    print('')
