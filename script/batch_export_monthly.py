#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
批量导出装修订单数据 - 按月导出
"""

import os
import sys
import subprocess

# 阿里云RDS数据库配置
DB_HOST = "rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com"
DB_USER = "fanglin1918"
DB_PASS = "Fanglin1918!"

def export_month(year, month):
    """导出指定年月的数据"""
    start_time = f"{year}/{month:02d}/01"
    # 计算当月最后一天
    if month == 12:
        end_time = f"{year}/{month:02d}/31"
    else:
        # 简化处理，所有月份都用31日（SQL会处理无效日期）
        end_time = f"{year}/{month:02d}/31"

    print(f"\n========== 导出 {year}年{month}月 ==========")

    cmd = [
        sys.executable,
        "D:\\ERP\\Rhadamanthus\\script\\export_decoration_2015_2025_v2.py",
        start_time,
        end_time,
        "0"
    ]

    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0

def export_year(year):
    """导出一整年的数据（按月）"""
    print(f"\n\n{'='*50}")
    print(f"开始导出 {year} 年数据（按月）")
    print(f"{'='*50}")

    success_count = 0
    for month in range(1, 13):
        if export_month(year, month):
            success_count += 1
        else:
            print(f"警告: {year}年{month}月 导出失败")

    print(f"\n{year}年完成: {success_count}/12 个月")

def export_range(start_year, end_year):
    """导出年份范围的数据"""
    print(f"\n\n{'#'*50}")
    print(f"批量导出 {start_year}-{end_year} 年装修订单数据")
    print(f"{'#'*50}")

    for year in range(start_year, end_year + 1):
        export_year(year)

if __name__ == '__main__':
    # 导出2015-2025年，按月导出
    export_range(2015, 2025)

    print("\n\n全部导出完成！")
    print("文件保存在: D:\\ERP\\Rhadamanthus\\script\\output\\")
