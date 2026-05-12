#!/usr/bin/env python3
"""
从MySQL查询合同数据并下载PDF，按公司ID分目录存放。

用法:
  python download_contracts.py                          # 使用默认配置
  python download_contracts.py --host x --user x -p x   # 自定义数据库连接
"""

import argparse
import os
import sys
import pymysql
import requests
from pathlib import Path

# ── 数据库配置 ──
DB_CONFIG = {
    "host": "rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com",
    "port": 3306,
    "user": "fanglin1918",
    "password": "Fanglin1918!",
    "database": "decoration",
    "charset": "utf8mb4",
}

# ── SQL查询 ──
SQL = """
SELECT dc.orderId, dc.name, d.company, dc.download
FROM decoration.decoration d
JOIN decoration.decorationcontract dc ON d.orderId = dc.orderId
WHERE d.company IN (1, 12, 3)
  AND dc.status = 4
  AND d.contractTime >= '2024-01-01 00:00:00'
  AND d.contractTime < '2025-01-01 00:00:00'
"""

# 公司ID映射（可按需补充）
COMPANY_MAP = {
    1: "方林",
    3: "1918",
    12: "方林装饰",
}


def sanitize_filename(name: str) -> str:
    """清理文件名中的非法字符"""
    for ch in r'\/:*?"<>|':
        name = name.replace(ch, "-")
    return name


def download_contracts(root_dir: str = r"G:\合同"):
    root = Path(root_dir)

    print(f"📂 根目录: {root}")
    print(f"🔌 连接数据库: {DB_CONFIG['host']}")

    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute(SQL)
    rows = cursor.fetchall()
    total = len(rows)
    print(f"📊 查询到 {total} 条合同记录\n")

    conn.close()

    success = 0
    fail = 0
    skip = 0

    for i, (order_id, contract_name, company_id, download_url) in enumerate(rows, 1):
        company_id = str(company_id)
        order_id = str(order_id)
        contract_name = str(contract_name or "").strip()
        download_url = str(download_url or "").strip()

        if not download_url:
            print(f"⚠️  [{i}/{total}] {order_id} 无下载地址，跳过")
            skip += 1
            continue

        # 构建目录
        company_dir = root / company_id
        company_dir.mkdir(parents=True, exist_ok=True)

        # 文件名
        filename = sanitize_filename(f"{company_id}-{order_id}-{contract_name}.pdf")
        save_path = company_dir / filename

        # 跳过已存在的
        if save_path.exists() and save_path.stat().st_size > 0:
            print(f"⏭️  [{i}/{total}] 已存在: {filename}")
            skip += 1
            continue

        print(f"⬇️  [{i}/{total}] {order_id} → {filename}")
        try:
            resp = requests.get(download_url, timeout=60, verify=False)
            resp.raise_for_status()

            with open(save_path, "wb") as f:
                f.write(resp.content)

            size_kb = len(resp.content) / 1024
            print(f"   ✅ ({size_kb:.1f} KB)")
            success += 1

        except Exception as e:
            print(f"   ❌ 失败: {e}")
            if save_path.exists():
                save_path.unlink()
            fail += 1

    print(f"\n{'='*50}")
    print(f"总计 {total} 条 | ✅ {success} | ❌ {fail} | ⏭️ {skip}")


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    parser = argparse.ArgumentParser(description="下载合同PDF")
    parser.add_argument("--root", default=r"G:\合同", help="保存根目录")
    parser.add_argument("--host", help="数据库地址")
    parser.add_argument("--port", type=int, help="数据库端口")
    parser.add_argument("--user", help="数据库用户")
    parser.add_argument("-p", "--password", help="数据库密码")
    parser.add_argument("--db", help="数据库名")
    args = parser.parse_args()

    if args.host:
        DB_CONFIG["host"] = args.host
    if args.port:
        DB_CONFIG["port"] = args.port
    if args.user:
        DB_CONFIG["user"] = args.user
    if args.password:
        DB_CONFIG["password"] = args.password
    if args.db:
        DB_CONFIG["database"] = args.db

    download_contracts(args.root)
