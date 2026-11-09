# -*- coding: utf-8 -*-
"""全系统 N+1 静态扫描器
模式A: for/while 循环体内逐条 Dao.get(...) 且参数含循环变量 (经典逐行主键查询 N+1)
模式B: 循环体内链式访问 PO 懒代理关联 (po.getXxx().getYyy(), Xxx 为某PO的@ManyToOne LAZY字段) (懒加载 N+1)
"""
import json, os, re, sys
from collections import Counter, defaultdict

SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "com", "fanglin"))

def read_text(path):
    raw = open(path, "rb").read()
    for enc in ("utf-8", "gbk"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")

def strip_comments_and_strings(src):
    out = []
    i, n = 0, len(src)
    NORMAL, LINE, BLOCK, STR, CHAR = range(5)
    st = NORMAL
    while i < n:
        c = src[i]
        if st == NORMAL:
            if c == '"':
                out.append('"'); st = STR; i += 1; continue
            if c == "'":
                out.append("'"); st = CHAR; i += 1; continue
            if c == '/' and i + 1 < n and src[i+1] == '/':
                st = LINE; out.append('  '); i += 2; continue
            if c == '/' and i + 1 < n and src[i+1] == '*':
                st = BLOCK; out.append('  '); i += 2; continue
            out.append(c); i += 1
        elif st == LINE:
            out.append('\n' if c == '\n' else ' '); i += 1
            if c == '\n': st = NORMAL
        elif st == BLOCK:
            if c == '*' and i + 1 < n and src[i+1] == '/':
                out.append('  '); st = NORMAL; i += 2; continue
            out.append('\n' if c == '\n' else ' '); i += 1
        elif st == STR:
            if c == '\\':
                out.append('  '); i += 2; continue
            out.append('\n' if c == '\n' else ' ')
            if c == '"': st = NORMAL
            i += 1
        else:
            if c == '\\':
                out.append('  '); i += 2; continue
            out.append(' ')
            if c == "'": st = NORMAL
            i += 1
    return "".join(out)

def match_brace(text, open_pos):
    depth, i, n = 0, open_pos, len(text)
    while i < n:
        c = text[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1

def line_of(text, pos):
    return text.count("\n", 0, pos) + 1

FOR_RE = re.compile(r'\bfor\s*\(([^;{]*?):\s*([A-Za-z0-9_.\[\]()]+)\s*(?::[^)]*)?\)\s*\{')
WHILE_RE = re.compile(r'\bwhile\s*\([^)]*\)\s*\{')
GET_RE = re.compile(r'\b([a-z][A-Za-z0-9_]*)\.get\(\s*([^;{)]+?)\s*\)')
LAZYCHAIN_RE = re.compile(r'\.\s*get([A-Z][A-Za-z0-9_]*)\s*\(\s*\)\s*(?:\.\s*get[A-Z][A-Za-z0-9_]*\s*\(|\.\s*get[A-Z])')

def scan_po_lazy_fields():
    """解析全部 PO 的 @ManyToOne/@OneToOne LAZY 关联字段 getter 名 -> (类型, PO文件)"""
    fields = {}
    getter_re = re.compile(r'@ManyToOne[\s\S]{0,200}?@JoinColumn[\s\S]{0,200}?\n?\tpublic\s+([A-Za-z0-9_]+)\s+get([A-Za-z0-9_]+)\s*\(', re.M)
    getter_any = re.compile(r'\n\tpublic\s+([A-Za-z0-9_]+)\s+get([A-Za-z0-9_]+)\s*\(\s*\)\s*\{')
    for root, dirs, files in os.walk(SRC):
        for fn in files:
            if not fn.endswith("PO.java"):
                continue
            path = os.path.join(root, fn)
            text = read_text(path)
            stripped = strip_comments_and_strings(text)
            rel = os.path.relpath(path, SRC)
            # 找 LAZY 关联: @ManyToOne...FetchType.LAZY 或 @ManyToOne(fetch...) 段之后的下一个 PO类型 getter
            for m in re.finditer(r'@ManyToOne\s*(\([^)]*\))?', stripped):
                seg = stripped[m.start():m.start()+600]
                if 'LAZY' not in seg:
                    continue
                # 段内第一个 PO 类型 getter(类型名以 PO 结尾)
                for g in getter_any.finditer(seg):
                    typ, name = g.group(1), g.group(2)
                    if typ.endswith("PO") or typ in ("UserPO",):
                        fields.setdefault(name, set()).add(typ)
                    break
    return fields

def main():
    lazy_fields = scan_po_lazy_fields()
    # 粗筛常见 LAZY 关联 getter 名(用于模式B)
    findings_a = []
    findings_b = []
    files_scanned = 0
    for root, dirs, files in os.walk(SRC):
        for fn in files:
            if not fn.endswith(".java") or fn.endswith("PO.java") and False:
                pass
            if not fn.endswith(".java"):
                continue
            path = os.path.join(root, fn)
            rel = os.path.relpath(path, SRC).replace("\\", "/")
            # PO 本体不算
            if fn.endswith("PO.java"):
                continue
            files_scanned += 1
            text = read_text(path)
            stripped = strip_comments_and_strings(text)
            module = rel.split("/")[0]

            # 模式A/B: 提取所有循环体
            loop_bodies = []
            for m in FOR_RE.finditer(stripped):
                var = m.group(1).strip().split()[-1] if m.group(1).strip() else "?"
                open_brace = stripped.find("{", m.end()-1)
                end = match_brace(stripped, open_brace)
                if end < 0:
                    continue
                loop_bodies.append((m.start(), open_brace, end, var, line_of(text, m.start())))
            for m in WHILE_RE.finditer(stripped):
                open_brace = stripped.find("{", m.end()-1)
                end = match_brace(stripped, open_brace)
                if end < 0:
                    continue
                loop_bodies.append((m.start(), open_brace, end, "?", line_of(text, m.start())))

            for start, open_brace, end, var, lineno in loop_bodies:
                body = stripped[open_brace:end]
                # A: 体内 dao.get(参数含循环变量)
                for g in GET_RE.finditer(body):
                    recv, arg = g.group(1), g.group(2)
                    if not recv.lower().endswith("dao"):
                        continue
                    if var != "?" and re.search(r'\b' + re.escape(var) + r'\b', arg):
                        findings_a.append(dict(module=module, file=rel, line=lineno,
                                               loop_var=var, recv=recv, arg=arg.strip()[:60]))
                # B: 体内懒代理链式访问(致命: 每行一次懒加载SQL)
                for g in LAZYCHAIN_RE.finditer(body):
                    name = g.group(1)
                    if name in lazy_fields:
                        findings_b.append(dict(module=module, file=rel, line=lineno,
                                               getter=name, types=",".join(sorted(lazy_fields[name]))))

    result = dict(
        files_scanned=files_scanned,
        lazy_field_getters={k: sorted(v) for k, v in sorted(lazy_fields.items())},
        pattern_a_count=len(findings_a),
        pattern_b_count=len(findings_b),
        pattern_a=findings_a,
        pattern_b=findings_b,
    )
    out = os.path.join(os.path.dirname(__file__), "tmp_nplus1_scan_result.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)

    print("files=%d patternA(循环内逐条dao.get)=%d patternB(懒代理链式)=%d" % (files_scanned, len(findings_a), len(findings_b)))
    print("--- A by module ---")
    for k, v in Counter(x["module"] for x in findings_a).most_common(15):
        print("  %-12s %d" % (k, v))
    print("--- A by dao ---")
    for k, v in Counter(x["recv"] for x in findings_a).most_common(15):
        print("  %-28s %d" % (k, v))
    print("--- B by getter ---")
    for k, v in Counter(x["getter"] for x in findings_b).most_common(15):
        print("  %-28s %d" % (k, v))
    print("--- B by module ---")
    for k, v in Counter(x["module"] for x in findings_b).most_common(15):
        print("  %-12s %d" % (k, v))

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
