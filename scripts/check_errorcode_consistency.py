#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
错误码一致性校验

对比 error.md(权威文档) 与 Java 代码(实际 throw/setCode)的错误码使用情况,
输出三类差异报告:
  1. 代码用了但文档没有的码(未登记码 / 可能是 magic number 笔误)
  2. 文档有但代码完全没用的码(死码 / 待回收)
  3. 同一码在代码里出现多种消息文本(消息漂移)
  4. 同一码文档消息与代码消息不符(文档滞后)

用法:
  python scripts/check_errorcode_consistency.py
  python scripts/check_errorcode_consistency.py --detail   # 显示每个码的明细位置
  python scripts/check_errorcode_consistency.py --csv out.csv  # 导出CSV

退出码:
  0  正常(差异数量不影响构建,脚本仅为诊断)
"""

import os
import re
import sys
import csv
import argparse
from collections import defaultdict

# ============================================================================
# 配置
# ============================================================================

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ERROR_MD = os.path.join(PROJECT_ROOT, "docs", "03-API文档", "API", "error.md")
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

# 匹配 error.md 的错误码行: | 150043 | 转换款不存在 |
# 码可为负数;消息列允许任意字符(含占位符、逗号)
RE_MD_ROW = re.compile(r"^\|\s*(-?\d+)\s*\|\s*(.+?)\s*\|\s*$")

# 匹配代码里的错误码使用。覆盖两种写法:
#   throw new FLException(150043, "...")     —— 构造方法,带消息
#   throw new FLException(150043)            —— 构造方法,无消息
#   setErrorCode(150043)                     —— Action 里直接 set
#   xxx.setCode(110007)                      —— PO 设置码
RE_CODE_FL = re.compile(
    r'FLException\s*\(\s*(\d{4,7})\s*(?:,\s*"([^"]*)")?\s*\)'
)
RE_CODE_SET = re.compile(r'set(?:Error)?Code\s*\(\s*(\d{4,7})\s*\)')

# 只扫 Java 源码,排除 test
def iter_java_files():
    for root, dirs, files in os.walk(SRC_DIR):
        # 跳过测试目录
        dirs[:] = [d for d in dirs if d.lower() != "test"]
        for f in files:
            if f.endswith(".java"):
                yield os.path.join(root, f)

# ============================================================================
# 解析 error.md
# ============================================================================

def parse_error_md():
    """返回 dict: code(str) -> message(str)。空位标 reserved 的不计入。"""
    doc = {}
    with open(ERROR_MD, encoding="utf-8") as f:
        for line in f:
            m = RE_MD_ROW.match(line)
            if not m:
                continue
            code, msg = m.group(1), m.group(2).strip()
            # 跳过表头行、模块分隔行(如 | Construction |  |)、reserved/deprecated 空位
            if not re.match(r"^-?\d+$", code):
                continue
            if msg == "reserved" or msg == "":
                continue
            if msg.startswith("deprecated:"):
                continue
            # 跳过模块名分隔行(码列是英文单词)
            if re.match(r"^[A-Za-z]+$", code):
                continue
            doc[code] = msg
    return doc

# ============================================================================
# 扫描代码
# ============================================================================

def scan_code():
    """
    返回:
      code_usage: code(str) -> list of (file_relpath, lineno, message_or_None)
    """
    code_usage = defaultdict(list)

    for filepath in iter_java_files():
        relpath = os.path.relpath(filepath, PROJECT_ROOT).replace("\\", "/")
        try:
            with open(filepath, encoding="utf-8") as f:
                for lineno, line in enumerate(f, 1):
                    # FLException 构造(带或不带消息)
                    for m in RE_CODE_FL.finditer(line):
                        code = m.group(1)
                        msg = m.group(2)  # 可能为 None
                        code_usage[code].append((relpath, lineno, msg))
                    # setErrorCode / setCode
                    for m in RE_CODE_SET.finditer(line):
                        code = m.group(1)
                        code_usage[code].append((relpath, lineno, None))
        except (UnicodeDecodeError, OSError):
            # 跳过无法读取的文件
            continue

    return code_usage

# ============================================================================
# 差异分析
# ============================================================================

def analyze(doc, code_usage):
    """返回四类差异 + 统计。"""

    doc_codes = set(doc.keys())
    used_codes = set(code_usage.keys())

    # 1. 代码用了但文档没有
    unregistered = sorted(used_codes - doc_codes, key=lambda x: int(x))

    # 2. 文档有但代码完全没用(死码)
    dead = sorted(doc_codes - used_codes, key=lambda x: int(x))

    # 3. 同一码在代码里有多种非空消息(漂移)
    drift_code = {}
    for code, usages in code_usage.items():
        msgs = set(m for _, _, m in usages if m)  # 去 None
        if len(msgs) > 1:
            drift_code[code] = sorted(msgs)

    # 4. 文档消息 vs 代码消息不符(文档滞后)
    #    规则:代码里若所有非空消息一致(无漂移),则与文档比对
    doc_lag = {}
    for code in sorted(used_codes & doc_codes, key=lambda x: int(x)):
        msgs = set(m for _, _, m in code_usage[code] if m)
        if len(msgs) == 1:
            code_msg = next(iter(msgs))
            doc_msg = doc[code]
            # 占位符归一化后比对([0-9] 占位符不影响语义判断)
            norm_code = re.sub(r"\{[0-9]+\}", "{}", code_msg)
            norm_doc = re.sub(r"\{[0-9]+\}", "{}", doc_msg)
            if norm_code != norm_doc:
                doc_lag[code] = (doc_msg, code_msg)

    return {
        "unregistered": unregistered,      # 代码有/文档无
        "dead": dead,                      # 文档有/代码无
        "drift_code": drift_code,          # 代码内多种消息
        "doc_lag": doc_lag,                # 文档与代码不符
    }

# ============================================================================
# 输出
# ============================================================================

def print_report(diff, doc, code_usage, detail=False):
    print("=" * 72)
    print("  错误码一致性校验报告")
    print("  error.md 文档码数: %d | 代码实际使用码数: %d"
          % (len(doc), len(code_usage)))
    print("=" * 72)

    # --- 1. 未登记码 ---
    print("\n【1】代码使用但文档未登记的码: %d 个" % len(diff["unregistered"]))
    print("    (可能是 magic number 笔误,或文档遗漏)")
    if diff["unregistered"]:
        for code in diff["unregistered"][:30]:
            sample = code_usage[code][0]
            print("    %s  首次: %s:%d" % (code, sample[0], sample[1]))
        if len(diff["unregistered"]) > 30:
            print("    ... 还有 %d 个,详见 --detail 或 --csv" %
                  (len(diff["unregistered"]) - 30))

    # --- 2. 死码 ---
    print("\n【2】文档有但代码完全未用的码(疑似死码): %d 个" % len(diff["dead"]))
    if diff["dead"]:
        for code in diff["dead"][:30]:
            print("    %s  文档: %s" % (code, doc[code]))
        if len(diff["dead"]) > 30:
            print("    ... 还有 %d 个" % (len(diff["dead"]) - 30))

    # --- 3. 代码内消息漂移 ---
    print("\n【3】同一码在代码里出现多种消息(漂移): %d 个" % len(diff["drift_code"]))
    for code, msgs in sorted(diff["drift_code"].items(), key=lambda x: int(x[0])):
        print("    %s:" % code)
        for m in msgs:
            print("        - %s" % m)

    # --- 4. 文档滞后 ---
    print("\n【4】文档消息与代码消息不符(文档滞后): %d 个" % len(diff["doc_lag"]))
    for code, (doc_msg, code_msg) in sorted(diff["doc_lag"].items(),
                                            key=lambda x: int(x[0])):
        print("    %s:" % code)
        print("        文档: %s" % doc_msg)
        print("        代码: %s" % code_msg)

    # --- 汇总 ---
    print("\n" + "=" * 72)
    print("  汇总")
    print("=" * 72)
    print("  未登记码(代码有/文档无): %d" % len(diff["unregistered"]))
    print("  死码(文档有/代码无):     %d" % len(diff["dead"]))
    print("  代码内漂移:               %d" % len(diff["drift_code"]))
    print("  文档滞后:                 %d" % len(diff["doc_lag"]))
    total_issue = (len(diff["unregistered"]) + len(diff["dead"])
                   + len(diff["drift_code"]) + len(diff["doc_lag"]))
    print("  问题总数:                 %d" % total_issue)

# ============================================================================

def export_csv(diff, doc, code_usage, path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["类型", "错误码", "文档消息", "代码消息/说明", "位置"])
        for code in diff["unregistered"]:
            usages = code_usage[code]
            locs = "; ".join("%s:%d" % (u[0], u[1]) for u in usages[:3])
            w.writerow(["未登记", code, "(无)", "", locs])
        for code in diff["dead"]:
            w.writerow(["死码", code, doc[code], "(代码未使用)", ""])
        for code, msgs in diff["drift_code"].items():
            w.writerow(["代码内漂移", code, doc.get(code, "(无)"),
                        " | ".join(msgs), ""])
        for code, (doc_msg, code_msg) in diff["doc_lag"].items():
            w.writerow(["文档滞后", code, doc_msg, code_msg, ""])
    print("CSV 已导出: %s" % path)

# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="错误码一致性校验")
    parser.add_argument("--detail", action="store_true",
                        help="显示每个码的完整明细位置")
    parser.add_argument("--csv", metavar="PATH",
                        help="导出差异到 CSV 文件")
    args = parser.parse_args()

    if not os.path.exists(ERROR_MD):
        print("[X] error.md 不存在: %s" % ERROR_MD)
        sys.exit(1)

    doc = parse_error_md()
    code_usage = scan_code()
    diff = analyze(doc, code_usage)

    print_report(diff, doc, code_usage, detail=args.detail)

    if args.csv:
        export_csv(diff, doc, code_usage, args.csv)

if __name__ == "__main__":
    main()
