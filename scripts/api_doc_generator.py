# -*- coding: utf-8 -*-
"""
API 文档补录生成器
扫描 src/com/fanglin 全部 @Action 接口, 与 docs/03-API文档/API/modules/*.md 已有文档条目比对,
将缺失接口按现有文档风格生成段落, 追加到对应模块 md 末尾 (幂等: 已文档化的跳过, 可重复执行)。

用法: python -I scripts/api_doc_generator.py
"""
import os
import re
from collections import defaultdict, OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'com', 'fanglin')
MOD_DIR = os.path.join(ROOT, 'docs', '03-API文档', 'API', 'modules')
TODAY = '2026-11-03'

# 包名 -> modules 文件
PKG_MOD = {
    'approval': 'approval', 'balance': 'balance', 'building': 'building', 'communion': 'common',
    'construction': 'construction', 'customer': 'customer', 'data': 'data', 'decoration': 'decoration',
    'dingtalk': 'dingtalk', 'elecsign': 'decoration', 'esign': 'decoration', 'fadada': 'decoration',
    'finance': 'finance', 'information': 'information', 'inventory': 'inventory', 'market': 'market',
    'material': 'material', 'payment': 'payment', 'personel': 'user', 'seiya': 'user',
    'production': 'production', 'quotation': 'quotation', 'right': 'right', 'salary': 'salary',
    'sales': 'sales', 'system': 'system', 'user': 'user', 'utils': 'system', 'aliyun': 'system',
    'secret': 'system', 'factory': 'system', 'kingdee': 'finance', 'camera': 'construction',
    'workflow': 'common', 'chating': 'common', 'famewall': 'common', 'store': 'data',
    'price': 'quotation', 'swiftpass': 'payment', 'yspay': 'payment', 'postar': 'payment',
    'log': 'log', 'wechat': 'wechat', 'wecom': 'wecom',
}

CAT_QUERY = ('query', 'page', 'count', 'amount', 'fetch', 'check', 'search')
CAT_ADD = ('add', 'create', 'issue', 'make', 'regist', 'bind', 'import', 'init')


def category_of(name):
    for p in CAT_QUERY:
        if name.startswith(p):
            return '查询'
    for p in CAT_ADD:
        if name.startswith(p):
            return '新增'
    if name.startswith('delete'):
        return '删除'
    if name.startswith(('cancel', 'refuse', 'reject')):
        return '撤销'
    return '更新'


FIELD_PAT = re.compile(r'^\s*private\s+([\w<>,\.\s]+?)\s+(\w+)\s*(?:=|;)')
ACTION_PAT = re.compile(r'@Action\(value\s*=\s*"(\w+)"')
METHOD_PAT = re.compile(r'public\s+String\s+(\w+)\s*\(')
PKG_PAT = re.compile(r'package\s+com\.fanglin\.(\w+)')
CLASS_PAT = re.compile(r'public\s+class\s+(\w+)')


def parse_action_file(path):
    """解析一个 Action 文件, 返回 (module, class_name, fields, endpoints)"""
    txt = open(path, encoding='utf-8', errors='ignore').read()
    pm = PKG_PAT.search(txt)
    if not pm:
        return None
    module = PKG_MOD.get(pm.group(1))
    if module is None:
        module = pm.group(1)
    cm = CLASS_PAT.search(txt)
    cls = cm.group(1) if cm else os.path.basename(path)[:-5]

    fields = []  # (name, type, is_service)
    for line in txt.splitlines():
        fm = FIELD_PAT.match(line)
        if fm:
            ftype, fname = fm.group(1).strip(), fm.group(2)
            is_svc = ftype.endswith('Service') or ftype.endswith('Dao') or ftype == 'Logger'
            fields.append((fname, ftype, is_svc))

    endpoints = []
    lines = txt.splitlines()
    for i, line in enumerate(lines):
        am = ACTION_PAT.search(line)
        if not am:
            continue
        endpoint = am.group(1)
        # 找 @Action 之后的 public String 方法
        method = None
        sig_line = None
        for j in range(i + 1, min(i + 8, len(lines))):
            mm = METHOD_PAT.search(lines[j])
            if mm:
                method = mm.group(1)
                sig_line = j
                break
        if method is None:
            continue
        # javadoc: 从 @Action 行向上跳过注解/空行, 找最近的 /** */
        javadoc_lines = []
        k = i - 1
        while k >= 0 and (lines[k].strip().startswith('@') or not lines[k].strip()):
            k -= 1
        if k >= 0 and lines[k].strip().endswith('*/'):
            jend = k
            jstart = k
            while jstart >= 0 and not lines[jstart].strip().startswith('/**'):
                jstart -= 1
            if jstart >= 0:
                for jl in lines[jstart:jend + 1]:
                    s = jl.strip().strip('/*').strip()
                    if s and not s.startswith('@'):
                        javadoc_lines.append(s)
        # 方法体
        body = ''
        depth = 0
        started = False
        for j in range(sig_line, len(lines)):
            depth += lines[j].count('{') - lines[j].count('}')
            if '{' in lines[j]:
                started = True
            if started and depth <= 0:
                body = '\n'.join(lines[sig_line:j + 1])
                break
        endpoints.append({
            'endpoint': endpoint, 'method': method,
            'javadoc': javadoc_lines[:3], 'body': body,
        })
    return module, cls, fields, endpoints


def analyze_endpoint(ep, fields):
    """从方法体提取入参/出参字段"""
    body = ep['body']
    non_svc = [(n, t) for n, t, svc in fields if not svc and n != 'serialVersionUID']
    params, outputs = [], []
    for n, t in non_svc:
        if not re.search(r'\b%s\b' % n, body):
            continue
        if re.search(r'(?:this\.)?%s\s*(?:=|\.[\w]+\s*=)' % n, body, re.M):
            outputs.append((n, t))
        else:
            params.append((n, t))
    has_paging = 'getPaging()' in body
    return params, outputs, has_paging


def load_documented():
    """全部模块文件已文档化的接口名集合(全局跨文件, 历史文档按业务域组织而非按包)"""
    doc = set()
    if not os.path.isdir(MOD_DIR):
        return doc
    for f in os.listdir(MOD_DIR):
        if not f.endswith('.md'):
            continue
        txt = open(os.path.join(MOD_DIR, f), encoding='utf-8', errors='ignore').read()
        for m in re.finditer(r'#####\s+`[^`]+`\s+(\w+)', txt):
            doc.add(m.group(1))
    return doc


def gen_section(cls, module, eps, fields, first):
    out = []
    if first:
        out.append('\n## 补录接口 (自动生成 %s)\n' % TODAY)
    out.append('\n> **类**: `api.%s.%s`\n' % (module, cls))
    for ep in eps:
        params, outputs, has_paging = analyze_endpoint(ep, fields)
        cat = category_of(ep['method'])
        # 标题格式与既有条目一致: ##### `分类` 接口名 (保证重跑幂等可识别)
        out.append('\n##### `%s` %s' % (cat, ep['endpoint']))
        out.append('\n- **接口**: `%s.do`' % ep['endpoint'])
        out.append('- **方法**: `%s()`' % ep['method'])
        if ep['javadoc']:
            out.append('- **说明**: %s' % ' '.join(ep['javadoc']))
        rows = []
        if has_paging:
            rows.append(('paging', 'Paging', '分页参数 , 参照 [paging](../check_rule.html#page)'))
        for n, t in params:
            rows.append((n, t, ''))
        if rows:
            out.append('\n**入参:**\n')
            out.append('| 参数 | 类型 | 说明 |')
            out.append('|------|------|------|')
            for n, t, d in rows:
                out.append('| `%s` | %s | %s |' % (n, t, d))
        if outputs:
            out.append('\n**出参:**\n')
            out.append('| 字段 | 类型 |')
            out.append('|------|------|')
            for n, t in outputs:
                out.append('| `%s` | %s |' % (n, t))
    out.append('\n')
    return '\n'.join(out)


def main():
    documented = load_documented()
    # 收集全部缺失(全局比对: 任一模块文件已文档化即跳过, 避免跨文件重复)
    per_file = OrderedDict()  # modfile -> list of (cls, module, eps, fields)
    added = 0
    for root, dirs, files in os.walk(SRC):
        if not root.replace('\\', '/').endswith('/action'):
            continue
        for f in sorted(files):
            if not f.endswith('.java') or f.startswith('Base'):
                continue
            path = os.path.join(root, f)
            parsed = parse_action_file(path)
            if not parsed:
                continue
            module, cls, fields, eps = parsed
            missing = [ep for ep in eps if ep['endpoint'] not in documented]
            if not missing:
                continue
            per_file.setdefault(module + '.md', []).append((cls, module, missing, fields))
            added += len(missing)

    # 追加写入
    for modfile, classes in per_file.items():
        target = os.path.join(MOD_DIR, modfile)
        chunk = ''
        for i, (cls, module, eps, fields) in enumerate(classes):
            chunk += gen_section(cls, module, eps, fields, i == 0)
        with open(target, 'a', encoding='utf-8') as fh:
            fh.write(chunk)
        print('%-16s +%d 接口' % (modfile, sum(len(e) for _, _, e, _ in classes)))

    print('\n共补录 %d 个接口到 %d 个模块文件' % (added, len(per_file)))


if __name__ == '__main__':
    main()
