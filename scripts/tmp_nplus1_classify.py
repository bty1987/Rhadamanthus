# -*- coding: utf-8 -*-
"""模式A 152处按所在方法读/写路径分层(后处理)"""
import json, io, sys, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

d = json.load(open('scripts/tmp_nplus1_scan_result.json', encoding='utf-8'))

def strip(src):
    out = []
    i = 0
    n = len(src)
    st = 0
    while i < n:
        c = src[i]
        if st == 0:
            if c == '"':
                out.append('"'); st = 3; i += 1; continue
            if c == "'":
                out.append("'"); st = 4; i += 1; continue
            if c == '/' and i + 1 < n and src[i+1] == '/':
                st = 1; out.append('  '); i += 2; continue
            if c == '/' and i + 1 < n and src[i+1] == '*':
                st = 2; out.append('  '); i += 2; continue
            out.append(c); i += 1
        elif st == 1:
            if c == '\n':
                out.append('\n'); st = 0
            else:
                out.append(' ')
            i += 1
        elif st == 2:
            if c == '*' and i + 1 < n and src[i+1] == '/':
                out.append('  '); st = 0; i += 2; continue
            out.append('\n' if c == '\n' else ' '); i += 1
        elif st == 3:
            if c == '\\':
                out.append('  '); i += 2; continue
            out.append('\n' if c == '\n' else ' ')
            if c == '"':
                st = 0
            i += 1
        else:
            if c == '\\':
                out.append('  '); i += 2; continue
            out.append(' ')
            if c == "'":
                st = 0
            i += 1
    return ''.join(out)

READ = re.compile(r'(page|query|get|count|amount|list|init|show|load|find)', re.I)
WRITE = re.compile(r'(add|update|delete|tran|submit|audit|confirm|cancel|sign|apply|save|collect|deliver|receive|assign|reset|issue|refund|withdraw|bind)', re.I)

from collections import Counter
buckets = {'READ': [], 'WRITE': [], 'OTHER': []}
cache = {}
for x in d['pattern_a']:
    path = os.path.join('src', 'com', 'fanglin', x['file'].replace('/', os.sep))
    if path not in cache:
        raw = open(path, 'rb').read()
        try:
            t = raw.decode('utf-8')
        except UnicodeDecodeError:
            t = raw.decode('gbk', errors='replace')
        cache[path] = strip(t)
    s = cache[path]
    lines = s.split('\n')
    ln = min(x['line'], len(lines)) - 1
    mname = '?'
    for i in range(ln, max(0, ln - 200), -1):
        m = re.match(r'\s+(?:public|private|protected)[^;{=]*\b([a-zA-Z][A-Za-z0-9_]*)\s*\(', lines[i])
        if m and not lines[i].strip().startswith(('if', 'for', 'while', 'switch', 'catch', 'new')):
            mname = m.group(1)
            break
    kind = 'OTHER'
    if WRITE.match(mname):
        kind = 'WRITE'
    elif READ.match(mname):
        kind = 'READ'
    x['method'] = mname
    x['kind'] = kind
    buckets[kind].append(x)

d['pattern_a_classified'] = buckets
json.dump(d, open('scripts/tmp_nplus1_scan_result.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

for k in ('READ', 'WRITE', 'OTHER'):
    print('=== %s: %d ===' % (k, len(buckets[k])))
    c = Counter((x['file'], x['method']) for x in buckets[k])
    for (f, m), n in c.most_common(15):
        print('  %-58s %-30s x%d' % (f, m, n))
