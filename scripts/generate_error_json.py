#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
error.md → error-cn.json 生成脚本

从 error.md 权威文档派生前端错误码映射表(flat JSON)。
前端 core.js 按 errorCode 查表展示,查不到 fallback 后端 errorMsg。

用法:
  python scripts/generate_error_json.py
  python scripts/generate_error_json.py --output WebContent/js/com/error-cn.json

产物格式:
  { "150043": "转换款不存在", "150046": "转换款支付异常,{0}", ... }

跳过: reserved(预留)、deprecated:xxx(废弃)、空消息、特殊语义码(0/-1/-2/-3)
占位符: error.md 已统一为 {0}/{1}(MessageFormat 标准),原样保留
"""

import os
import re
import json
import argparse

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ERROR_MD = os.path.join(PROJECT_ROOT, "docs", "03-API文档", "API", "error.md")
DEFAULT_OUTPUT = os.path.join(PROJECT_ROOT, "WebContent", "js", "com", "error-cn.json")

# 特殊语义码:在拦截器里以字符串形式使用,不进映射表
SPECIAL_CODES = {"0", "-1", "-2", "-3"}

RE_MD_ROW = re.compile(r"^\|\s*(-?\d+)\s*\|\s*(.+?)\s*\|\s*$")


def parse_error_md():
    """解析 error.md,返回 {code: message}。跳过 reserved/deprecated/空/特殊码。"""
    entries = {}
    skipped = {"reserved": 0, "deprecated": 0, "empty": 0, "special": 0, "header": 0}

    with open(ERROR_MD, encoding="utf-8") as f:
        for line in f:
            m = RE_MD_ROW.match(line)
            if not m:
                continue
            code, msg = m.group(1), m.group(2).strip()

            # 跳过非数字码(模块分隔行如 | Construction |  |)
            if not re.match(r"^-?\d+$", code):
                skipped["header"] += 1
                continue

            # 跳过特殊语义码
            if code in SPECIAL_CODES:
                skipped["special"] += 1
                continue

            # 跳过 reserved
            if msg == "reserved":
                skipped["reserved"] += 1
                continue

            # 跳过 deprecated
            if msg.startswith("deprecated:"):
                skipped["deprecated"] += 1
                continue

            # 跳过空消息
            if msg == "":
                skipped["empty"] += 1
                continue

            entries[code] = msg

    return entries, skipped


def main():
    parser = argparse.ArgumentParser(description="error.md → error-cn.json 生成")
    parser.add_argument("--output", "-o", default=DEFAULT_OUTPUT,
                        help="输出文件路径(默认 WebContent/js/com/error-cn.json)")
    args = parser.parse_args()

    if not os.path.exists(ERROR_MD):
        print("[X] error.md 不存在: %s" % ERROR_MD)
        raise SystemExit(1)

    entries, skipped = parse_error_md()

    # 按码值排序(int 排序,保持可读性)
    sorted_entries = dict(sorted(entries.items(), key=lambda x: int(x[0])))

    # 写 JSON(ensure_ascii=False 保留中文,indent=1 可读但紧凑)
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(sorted_entries, f, ensure_ascii=False, indent=1)

    print("=" * 60)
    print("  error-cn.json 生成完成")
    print("=" * 60)
    print("  源文件: %s" % os.path.relpath(ERROR_MD, PROJECT_ROOT))
    print("  产物:   %s" % os.path.relpath(args.output, PROJECT_ROOT))
    print("  条目数: %d" % len(sorted_entries))
    print()
    print("  跳过统计:")
    for reason, count in skipped.items():
        if count:
            print("    %-12s %d" % (reason, count))
    print()
    print("  样本(前5条):")
    for i, (code, msg) in enumerate(sorted_entries.items()):
        if i >= 5:
            break
        print("    %s | %s" % (code, msg))


if __name__ == "__main__":
    main()
