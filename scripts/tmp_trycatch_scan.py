# -*- coding: utf-8 -*-
"""全系统 try-catch 合规扫描器
规则依据 AGENTS.md:
- 业务逻辑禁止 try-catch 做判断(com.fanglin 下 action/service/dao/po/vo)
- 豁免: core 框架代码 / utils 工具类 / Action 白名单(登录认证回调类)
- catch 后必须 throw new FLException(码, 消息[, e]) 或 throw e(FLException透传)
- catch 后吞掉/return兜底/仅记录/分支 = 违规
"""
import json, os, re, sys

SRC = os.path.join(os.path.dirname(__file__), "..", "src", "com", "fanglin")
SRC = os.path.abspath(SRC)

# Action 层豁免白名单(AGENTS.md 原文)
ACTION_WHITELIST = {
    "LoginAction", "DoginAction", "VerifyCodeAction", "WMCodeAction",
    "FactoryAction", "LoginInfoAction", "SecretAction", "PhoneCallAction",
    "PostarAction", "SwiftpassAction", "UploadAction", "DingTalkCallbackAction",
    "OssConfigAction",
    # imports 模块导入 Action(2026-11-09 登记: 文件解析失败需专用业务反馈, 分层 catch 全路径 FLException 收尾)
    "UserSalaryImport", "WorkerSalaryImport", "AccessoriesTypeImport",
    "ColorImport", "FormatImport", "GoodsImport", "MaterialModuleImport",
    "PriceImport", "PriceImportDelete", "QuotationItemImport",
}

def read_text(path):
    raw = open(path, "rb").read()
    for enc in ("utf-8", "gbk"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")

def strip_comments_and_strings(src):
    """去注释并清空字符串/字符字面量内容, 保留换行以维持行号"""
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
            if c == '\n':
                out.append('\n'); st = NORMAL
            else:
                out.append(' ')
            i += 1
        elif st == BLOCK:
            if c == '*' and i + 1 < n and src[i+1] == '/':
                out.append('  '); st = NORMAL; i += 2; continue
            out.append('\n' if c == '\n' else ' '); i += 1
        elif st == STR:
            if c == '\\':
                out.append('  '); i += 2; continue
            if c == '"':
                out.append('"'); st = NORMAL; i += 1; continue
            out.append('\n' if c == '\n' else ' '); i += 1
        else:  # CHAR
            if c == '\\':
                out.append('  '); i += 2; continue
            if c == "'":
                out.append("'"); st = NORMAL; i += 1; continue
            out.append(' ' if c != '\n' else '\n'); i += 1
    return "".join(out)

def line_of(text, pos):
    return text.count("\n", 0, pos) + 1

def match_brace(text, open_pos):
    """从 { 匹配到配对 }, 返回闭括号位置"""
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

CATCH_RE = re.compile(r'catch\s*\(')
THROW_RE = re.compile(r'\bthrow\b')
RETURN_RE = re.compile(r'\breturn\b')
CONTBREAK_RE = re.compile(r'\bcontinue\b|\bbreak\b')
PRINTSTACK_RE = re.compile(r'printStackTrace')
LOG_RE = re.compile(r'\blogger\b|\blog\b\s*\.|\bLOG\b|LogUtils|loggerFactory', re.IGNORECASE)
SETERR_RE = re.compile(r'setErrorMsg')

def analyze_body(body, param):
    """返回 (分类, 子类, 摘要行)"""
    # throw 深度判断: 只认 catch 体顶层(相对深度0)的 throw, 嵌套 try/catch 内的不算
    throws_at = []
    depth = 0
    i, n = 0, len(body)
    while i < n:
        c = body[i]
        if c == '{':
            depth += 1; i += 1; continue
        if c == '}':
            depth -= 1; i += 1; continue
        if c == 't' and body.startswith('throw', i) and (i == 0 or not (body[i-1].isalnum() or body[i-1] in '_$')):
            throws_at.append(depth)
            i += 5; continue
        i += 1

    compact = re.sub(r'\s+', ' ', body).strip()
    summary = compact[:110]

    has_throw_top = any(d <= 0 for d in throws_at)
    has_throw_any = len(throws_at) > 0
    if has_throw_any and 'FLException' in body:
        # 任意深度存在FLException抛出(含if/else分支包装, 如PaytranServiceImpl反射unwrap模式) = 合规
        return "合规", "FLException包装/透传", summary
    if has_throw_top:
        if re.search(r'\bthrow\s+e\s*;', body) and 'FLException' in param:
            return "合规", "FLException透传", summary
        return "违规", "抛非FLException异常", summary
    # 无任何 throw
    if compact == '':
        return "违规", "空catch吞掉", summary
    if 'instanceof' in body or 'getClass()' in body:
        return "违规", "摸异常类型分支(instanceof/getClass)", summary
    if RETURN_RE.search(body):
        return "违规", "catch后return兜底", summary
    if CONTBREAK_RE.search(body):
        return "违规", "break/continue流程控制", summary
    if SETERR_RE.search(body):
        return "违规", "setErrorMsg吞掉不抛", summary
    if PRINTSTACK_RE.search(body) or LOG_RE.search(body):
        return "违规", "仅记录日志吞掉", summary
    return "违规", "其他吞掉", summary

def module_of(rel):
    parts = rel.replace("\\", "/").split("/")
    return parts[0] if parts else "?"

def is_exempt(rel, cls):
    """豁免=顶层 core/ 与顶层 utils/ + Action白名单(按规则字面)"""
    reln = rel.replace("\\", "/")
    if reln.startswith("core/") or reln.startswith("utils/"):
        return True
    if cls in ACTION_WHITELIST:
        return True
    return False

def is_gray_zone(rel):
    """灰区: 模块内嵌套的 utils/util 目录(工具类但不在顶层utils)"""
    reln = rel.replace("\\", "/")
    parts = reln.split("/")
    return len(parts) > 1 and parts[1] in ("utils", "util")

def main():
    findings = []      # 违规
    compliant = []     # 合规的 catch(业务代码里 throw FLException)
    exempt = []        # 豁免区 catch
    files_scanned = 0
    files_with_catch = set()
    total_catches = 0
    gray_count = 0

    for root, dirs, files in os.walk(SRC):
        for fn in files:
            if not fn.endswith(".java"):
                continue
            path = os.path.join(root, fn)
            rel = os.path.relpath(path, SRC)
            cls = fn[:-5]
            files_scanned += 1
            text = read_text(path)
            stripped = strip_comments_and_strings(text)
            matches = list(CATCH_RE.finditer(stripped))
            if not matches:
                continue
            files_with_catch.add(rel)
            exempt_file = is_exempt(rel, cls)
            for m in matches:
                total_catches += 1
                open_paren = m.end() - 1
                close_paren = stripped.find(")", open_paren)
                if close_paren < 0:
                    continue
                param = stripped[open_paren+1:close_paren].strip()
                brace = stripped.find("{", close_paren)
                if brace < 0:
                    continue
                end = match_brace(stripped, brace)
                body = stripped[brace+1:end] if end > 0 else stripped[brace+1:brace+400]
                lineno = line_of(text, m.start())
                module = module_of(rel)
                is_action_file = ("/action/" in rel.replace("\\", "/")) or cls.endswith("Action")
                gray = is_gray_zone(rel)

                if exempt_file:
                    cat, sub, summ = analyze_body(body, param)
                    exempt.append(dict(file=rel, line=lineno, module=module, cls=cls,
                                       param=param, cat=cat, sub=sub, summary=summ,
                                       action=is_action_file, gray=gray))
                    continue

                cat, sub, summ = analyze_body(body, param)
                rec = dict(file=rel, line=lineno, module=module, cls=cls, param=param,
                           sub=sub, summary=summ, action=is_action_file, gray=gray)
                if gray:
                    # 灰区(嵌套utils/util工具类): 单列不混入业务违规主表
                    if cat == "合规":
                        compliant.append(rec)
                    else:
                        exempt.append(dict(rec, sub="灰区:" + sub))
                        gray_count += 1
                    continue

                if is_action_file:
                    # Action 层: 白名单外一律禁本地 catch; catch内throw FLException 也算违规但降级标注
                    if cat == "合规":
                        rec["sub"] = "FLException包装(仍属本地catch)"
                        findings.append(rec)
                    else:
                        rec["sub"] = sub + "(Action本地catch)"
                        findings.append(rec)
                elif cat == "违规":
                    findings.append(rec)
                else:
                    compliant.append(rec)

    result = dict(
        files_scanned=files_scanned,
        files_with_catch=len(files_with_catch),
        total_catches=total_catches,
        exempt_count=len(exempt),
        compliant_count=len(compliant),
        findings_count=len(findings),
        gray_count=gray_count,
        findings=findings,
        compliant=compliant,
        exempt=exempt,
    )
    out = os.path.join(os.path.dirname(__file__), "tmp_trycatch_scan_result.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)

    # 控制台摘要
    print("files=%d filesWithCatch=%d catches=%d" % (files_scanned, len(files_with_catch), total_catches))
    print("exempt=%d(含灰区%d) compliant=%d findings=%d" % (len(exempt), gray_count, len(compliant), len(findings)))
    subs = {}
    for r in findings:
        subs[r["sub"]] = subs.get(r["sub"], 0) + 1
    for k, v in sorted(subs.items(), key=lambda x: -x[1]):
        print("  [%4d] %s" % (v, k))
    mods = {}
    for r in findings:
        mods[r["module"]] = mods.get(r["module"], 0) + 1
    print("by module:", ", ".join("%s=%d" % (k, v) for k, v in sorted(mods.items(), key=lambda x: -x[1])))

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
