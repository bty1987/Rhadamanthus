# -*- coding: utf-8 -*-
"""
OSS存量迁移·ossimport url-list 生成器

用法:
  1. 用只读库导出某表 path 清单(每行一个路径, FastDFS相对路径如 group8/M00/...):
       python .agents/skills/prod-readonly-rds/scripts/q.py "SELECT path FROM decoration.decorationpicture WHERE path LIKE 'group%'" --no-limit > paths_raw.txt
     (q.py输出带表头与[行数]行, 本脚本自动跳过非路径行; 或自行清洗成纯路径文件)
  2. 生成 ossimport url-list:
       python -I scripts/oss_migration/gen_urllist.py paths_raw.txt urllist.txt
  3. urllist.txt 上传到文件服务器的 ossimport job 目录

url-list 行格式(ossimport url_list 模式):
  http://<SRC_BASE>/<path>\toss://<BUCKET>/<path>
"""
import sys

SRC_BASE = "http://172.16.0.73"          # 文件服务器(FastDFS经nginx), 按实际内网地址调整
BUCKET = "fl-prod-erp"


def is_valid_path(line: str) -> bool:
    """路径行判定: 排除表头/统计行/空行"""
    line = line.strip()
    if not line:
        return False
    if line.startswith(("Field", "-----", "[", "+")):
        return False
    return line.startswith("group") and "/" in line


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src_file, dst_file = sys.argv[1], sys.argv[2]

    total, skipped = 0, 0
    seen = set()  # 去重(740万独立文件 vs 756万行, 重复行只迁一次)

    with open(src_file, "r", encoding="utf-8", errors="replace") as fin, \
         open(dst_file, "w", encoding="utf-8", newline="\n") as fout:
        for line in fin:
            path = line.strip()
            if not is_valid_path(path):
                skipped += 1
                continue
            if path in seen:
                continue
            seen.add(path)
            fout.write(f"{SRC_BASE}/{path}\toss://{BUCKET}/{path}\n")
            total += 1

    print(f"written={total} skipped_lines={skipped} distinct={len(seen)} -> {dst_file}")


if __name__ == "__main__":
    main()
