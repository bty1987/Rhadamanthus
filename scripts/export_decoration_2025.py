#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
装饰订单快速导出 - 2025年全年
SQL优化 + 流式导出 + Excel写入
"""

import pymysql
import time
from datetime import datetime
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

# ============================================================================
# 配置
# ============================================================================

DB_CONFIG = {
    "host": "192.168.5.21",
    "port": 3306,
    "user": "root",
    "password": "Neusoft!",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.SSCursor  # 流式游标
}

EXPORT_YEAR = 2025
import os
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", f"decoration_orders_{EXPORT_YEAR}.xlsx")

# ============================================================================
# 优化后的SQL
# ============================================================================

OPTIMIZED_SQL = """
SELECT
    d.orderId,
    v.name,
    h.houseNumber,
    d.precontractTime,
    d.contractTime,
    d.accountTime,
    communion.kv('decoration', 'decoration', 'typeness', d.typeness),
    communion.kv('decoration', 'decoration', 'status', d.status),
    d.houseType,
    IF(d.notSalesmanRate BETWEEN 0 AND 1000,
       IF(q.manageRate = 0 OR q.manageRate IS NULL, 0,
          q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate),
       d.notSalesmanRate),
    d.notSalesmanRate,
    d.precontractPrice,
    d.orderTotalPrice,
    d.factPrice,
    (
        SELECT SUM(IF(dai.type = 0 AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0,
                     dai.num * dai.money / 1000, 0))
        FROM decoration.decorationactivityitem dai
        WHERE dai.orderId = d.orderId
    ) AS couponCut,
    (
        SELECT SUM(IF(dai.type = 1 AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0,
                     dai.num * dai.money / 1000, 0))
        FROM decoration.decorationactivityitem dai
        WHERE dai.orderId = d.orderId
    ) AS thingCut,
    u.userId,
    u.currentName,
    db.type,
    dd.no,
    dd.name,
    dr.no,
    dr.name,
    db.rate,
    q.discount,
    q.totalPrice,
    q.undisPrice,
    q.disPrice,
    q.trafficPrice,
    q.managePrice,
    q.manageRate,
    IFNULL(qp.managePrefer, 0),
    q.trafficPrice,
    busitype.name,
    h.buildArea,
    h.freeArea,
    h.innerArea,
    h.totalArea,
    cn.name,
    supervisor.currentName,
    d.paySacle,
    d.grade,
    us.currentName,
    d.houseClass,
    md.name,
    mu.userId,
    mu.currentName,
    ed.name,
    eu.userId,
    eu.currentName,
    IF(d.type = 0, dm.servicePrice, IF(d.type = 2, dh.servicePrice, 0)),
    IF(d.type = 0, dm.materialPrice, IF(d.type = 2, dh.materialPrice, 0)),
    q.taxRate,
    q.taxPrice,
    q.unachePrice,
    co.name
FROM decoration.decoration AS d
LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
LEFT JOIN decoration.decorationbelong AS db ON d.orderId = db.orderId AND db.status = 0
LEFT JOIN quotation.quotation AS q ON d.orderId = q.orderId AND q.defaults = 1
LEFT JOIN quotation.quotationprefer AS qp ON q.qid = qp.qid
LEFT JOIN communion.house AS h ON d.hid = h.hid
LEFT JOIN communion.village AS v ON h.vid = v.vid
LEFT JOIN communion.user AS supervisor ON d.svuid = supervisor.uid
LEFT JOIN communion.user AS us ON d.quid = us.uid
LEFT JOIN communion.user AS mu ON d.msuid = mu.uid
LEFT JOIN communion.department AS md ON mu.deptid = md.did
LEFT JOIN communion.user AS eu ON d.euid = eu.uid
LEFT JOIN communion.department AS ed ON eu.deptid = ed.did
LEFT JOIN communion.user AS u ON db.buid = u.uid
LEFT JOIN communion.department AS dd ON db.did = dd.did
LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
LEFT JOIN data.decorationbusitype AS busitype ON busitype.dbid = d.busitype
LEFT JOIN communion.company co ON d.company = co.cid
LEFT JOIN payment.advancepayment AS ap ON d.orderId = ap.orderId
LEFT JOIN data.constructionnode cn ON d.projectStatus = cn.cnid
WHERE d.contractTime >= %s AND d.contractTime <= %s
"""

# 表头
TABLE_HEADERS = [
    "装修单号", "楼盘名称", "楼号", "预签时间", "签单时间", "决算时间",
    "订单类型", "订单状态", "房屋类别", "非业务提成", "非业务员提点",
    "预签额", "签单额", "实收额", "券优惠", "物品优惠", "操作人编号",
    "操作人", "操作类型", "部门编号", "部门", "分区编号", "分区",
    "比例", "折扣", "报价总额", "不打折总额", "打折总额", "车运费",
    "管理费", "管理费比例", "管理优惠", "运输费", "业务类型", "建筑面积",
    "赠送面积", "计价面积", "总面积", "工程状态", "监理", "付款比例",
    "订单等级", "报价员", "房屋类型", "跟单部", "跟单员编号", "跟单员",
    "方案设计部", "方案设计编号", "方案设计", "服务费", "主材总额",
    "税金比例", "税金金额", "纯利", "公司"
]

# 需要除以1000的字段索引
DIV1000_INDICES = [9, 10, 11, 12, 13, 14, 15, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 51, 52, 53, 54]

# ============================================================================
# 导出函数
# ============================================================================

def div_num(data, indices):
    """将指定索引的值除以1000"""
    for idx in indices:
        if idx < len(data) and data[idx] is not None:
            try:
                data[idx] = float(data[idx]) / 1000.0
            except (ValueError, TypeError):
                data[idx] = 0
        elif idx < len(data):
            data[idx] = 0

def process_row(row):
    """处理单行数据：金额除以1000，格式化比例"""
    data = list(row)

    # 转换操作类型
    if data[18] is not None:
        data[18] = "设计" if int(data[18]) == 0 else "业务"

    # 保存原始比例值
    rate = data[23] if data[23] is not None else 0

    # 金额除以1000
    div_num(data, DIV1000_INDICES)

    # 转换比例显示为百分比
    if data[23] is not None and data[23] != "":
        data[23] = f"{float(data[23]) * 100:.0f}%"

    return data

def export_decoration_orders(year, output_file):
    """导出装饰订单到Excel"""

    start_date = f"{year}-01-01"
    end_date = f"{year}-12-31"

    print("=" * 70)
    print(f"装饰订单快速导出 - {year}年")
    print("=" * 70)
    print(f"时间范围: {start_date} ~ {end_date}")
    print(f"输出文件: {output_file}")
    print()

    conn = None
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 统计订单数量
        print(f"[1/4] 统计订单数量...")
        count_sql = "SELECT COUNT(*) FROM decoration.decoration WHERE contractTime >= %s AND contractTime <= %s"
        cursor.execute(count_sql, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        total_count = cursor.fetchone()[0]
        print(f"      订单数: {total_count:,} 条")

        if total_count == 0:
            print(f"\n[SKIP] 该时间段无数据")
            return False

        # 执行查询
        print(f"\n[2/4] 执行SQL查询...")
        start = time.time()
        cursor.execute(OPTIMIZED_SQL, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        query_time = time.time() - start
        print(f"      查询耗时: {query_time:.2f} 秒")

        # 创建Excel
        print(f"\n[3/4] 写入Excel文件...")
        wb = Workbook()
        ws = wb.active
        ws.title = f"{year}年装饰订单"

        # 写入表头
        ws.append(TABLE_HEADERS)

        # 设置表头样式
        header_fill = PatternFill(start_color="CCE5FF", end_color="CCE5FF", fill_type="solid")
        for col_num in range(1, len(TABLE_HEADERS) + 1):
            cell = ws.cell(row=1, column=col_num)
            cell.font = Font(bold=True, size=11)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.fill = header_fill

        # 写入数据
        count = 0
        batch_size = 500
        start = time.time()

        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break

            for row in rows:
                processed_row = process_row(row)
                ws.append(processed_row)
                count += 1

            if count % 500 == 0:
                elapsed = time.time() - start
                print(f"      已处理: {count:,} 条 | 耗时: {elapsed:.2f} 秒")

        write_time = time.time() - start

        # 自动调整列宽
        for col in ws.columns:
            max_length = 0
            column_letter = get_column_letter(col[0].column)
            for cell in col:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 30)
            ws.column_dimensions[column_letter].width = adjusted_width

        cursor.close()

        # 保存文件
        print(f"\n[4/4] 保存Excel文件...")
        import os
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        wb.save(output_file)

        total_time = query_time + write_time

        print(f"\n{'=' * 70}")
        print(f"[完成] 导出成功!")
        print(f"{'=' * 70}")
        print(f"  总记录数: {count:,} 条")
        print(f"  查询耗时: {query_time:.2f} 秒")
        print(f"  写入耗时: {write_time:.2f} 秒")
        print(f"  总耗时: {total_time:.2f} 秒")
        print(f"  平均速度: {count / total_time:.0f} 条/秒")
        print(f"  文件位置: {output_file}")
        print(f"{'=' * 70}")

        return True

    except Exception as e:
        print(f"\n[X] 错误: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    export_decoration_orders(EXPORT_YEAR, OUTPUT_FILE)
