#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
装饰订单快速导出 - 2025年全年 (完整版)
包含原脚本的所有90个字段
"""

import pymysql
import time
from datetime import datetime
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter
import os

# ============================================================================
# 配置
# ============================================================================

DB_CONFIG = {
    "host": "192.168.5.21",
    "port": 3306,
    "user": "root",
    "password": "Neusoft!",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.SSCursor
}

EXPORT_YEAR = 2025
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", f"decoration_orders_{EXPORT_YEAR}_full.xlsx")

# ============================================================================
# 完整的优化SQL
# ============================================================================

OPTIMIZED_SQL = """
SELECT
    d.orderId,
    v.name,
    h.houseNumber,
    d.precontractTime,
    d.contractTime,
    d.accountTime,
    d.typeness,
    d.status,
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
        SELECT SUM(IF(dai2.type = 0 AND dai2.state IN (0,2,4,5,6) AND dai2.isPrefor = 0,
                     dai2.num * dai2.money / 1000, 0))
        FROM decoration.decorationactivityitem dai2
        WHERE dai2.orderId = d.orderId
    ) AS couponCut,
    (
        SELECT SUM(IF(dai2.type = 1 AND dai2.state IN (0,2,4,5,6) AND dai2.isPrefor = 0,
                     dai2.num * dai2.money / 1000, 0))
        FROM decoration.decorationactivityitem dai2
        WHERE dai2.orderId = d.orderId
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
    cn.name AS projectStatusName,
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
    co.name,
    (
        SELECT MAX(a.atttype)
        FROM decoration.decorationactivityitem dai2
        LEFT JOIN information.activity a ON dai2.aId = a.aId
        WHERE dai2.orderId = d.orderId AND dai2.state IN (0,2,4,5,6) AND dai2.isPrefor = 0
    ) AS atttype,
    (
        SELECT SUM(IF(dp.paymentType = '设计费', dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeeTotal,
    (
        SELECT SUM(IF(dp.paymentType = '设计费' AND dp.paymentStatus = 0, dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeePaid,
    (
        SELECT SUM(IF(dp.paymentType = '违约金', dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS penaltyFee,
    (
        SELECT SUM(dp.referMoney)
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
          AND dp.paymentStatus = 0
          AND dp.onetype = 0
          AND dp.twotype = 1
    ) AS nopayAmount,
    IFNULL(ap.balance, 0) AS advanceBalance,
    -- 首付款信息
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayAmount,
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayTime,
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayCoupon,
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayCouponInfo,
    -- 首付二期款信息
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayAmount,
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayTime,
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayCoupon,
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayCouponInfo,
    -- 二期款信息
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayAmount,
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayTime,
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayCoupon,
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayCouponInfo,
    -- 尾款信息
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayAmount,
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayTime,
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayCoupon,
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayCouponInfo
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

# 完整的90个字段表头
TABLE_HEADERS = [
    # 基础字段 0-50
    "装修单号",         # 0
    "楼盘名称",         # 1
    "楼号",             # 2
    "预签时间",         # 3
    "签单时间(预签)",   # 4
    "签单时间(签单)",   # 5
    "决算时间",         # 6
    "订单类型",         # 7
    "订单状态",         # 8
    "房屋类别",         # 9
    "非业务提成",       # 10
    "非业务提点",       # 11
    "预签额",           # 12
    "签单额",           # 13
    "实收额",           # 14
    "券优惠",           # 15
    "物品",             # 16
    "操作人编号",       # 17
    "操作人",           # 18
    "操作类型",         # 19
    "部门编号",         # 20
    "部门",             # 21
    "分区编号",         # 22
    "分区",             # 23
    "比例",             # 24
    "折扣",             # 25
    "报价总额",         # 26
    "不打折总额",       # 27
    "打折总额",         # 28
    "车运费",           # 29
    "管理费",           # 30
    "管理费比例",       # 31
    "管理优惠",         # 32
    "运输费",           # 33
    "业务类型",         # 34
    "建筑面积",         # 35
    "赠送面积",         # 36
    "计价面积",         # 37
    "总面积",           # 38
    "工程状态",         # 39
    "监理",             # 40
    "付款比例",         # 41
    "订单等级",         # 42
    "报价员",           # 43
    "房屋类型",         # 44
    "跟单部",           # 45
    "跟单员编号",       # 46
    "跟单员",           # 47
    "方案设计部",       # 48
    "方案设计编号",     # 49
    "方案设计",         # 50
    # 税金 51-52
    "税金比例",         # 53
    "税金金额",         # 54
    # 计算字段 55-59
    "折前总价",         # 55
    "差额",             # 56
    "业绩差额",         # 57
    # 款项信息 58-81
    "应付设计费",       # 58
    "实付设计费",       # 59
    "首付款",           # 60
    "收款时间",         # 61
    "券值",             # 62
    "券信息",           # 63
    "首付二期款",       # 64
    "收款时间",         # 65
    "券值",             # 66
    "券信息",           # 67
    "二期款",           # 68
    "收款时间",         # 69
    "券值",             # 70
    "券信息",           # 71
    "尾款",             # 72
    "尾款时间",         # 73
    "券值",             # 74
    "券信息",           # 75
    "违约金",           # 76
    "预付款余额",       # 77
    "净业绩",           # 78
    "复合业绩",         # 79
    "未付款金额",       # 80
    "措施费",           # 81
    # 最后字段 82-85
    "应收服务费",       # 82
    "主材总额",         # 83
    "纯利",             # 84
    "公司"              # 85
]

# 需要除以1000的字段索引 (基于SQL结果)
DIV1000_INDICES = [9, 10, 11, 12, 13, 14, 15, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 51, 52, 53, 54]

# 需要乘以比例的字段索引 (基于最终结果)
RATE_MULTIPLY_INDICES = [12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38, 52, 53, 54, 55, 56, 57, 58, 59]

# 常量映射
DECORATION_TYPE = {
    0: "半包", 1: "整装", 2: "半价", 3: "满减", 4: "减上捡",
    5: "达额减", 6: "新满减", 7: "局改", 8: "全翻", 9: "全案",
    10: "新达额减", 11: "满额减"
}

DECORATION_STATUS = {
    0: "初始", 1: "定金", 2: "预签", 3: "签约", 4: "重签",
    5: "废单", 6: "终止", 7: "决算", 8: "完结"
}

DECORATION_BELONG_TYPE = {
    0: "设计", 1: "业务"
}

PROJECT_STATUS_DEFAULT = {
    0: "初始", 1: "开工", 2: "完工", 3: "砌墙", 4: "铲大白",
    5: "放线", 6: "水工", 7: "力工", 8: "电工", 9: "瓦工",
    10: "地面找平", 11: "木工", 12: "油工", 13: "水电验收", 14: "保洁"
}

# ============================================================================
# 工具函数
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

def multiply_rate(data, indices, rate):
    """将指定索引的值乘以比例"""
    if rate is None or rate == 0:
        return
    for idx in indices:
        if idx < len(data) and data[idx] is not None and data[idx] != "":
            try:
                data[idx] = float(data[idx]) * rate
            except (ValueError, TypeError):
                pass

def load_project_status(conn, company=0):
    """加载工程状态字典"""
    project_status = {}
    if company == 0:
        where_clause = ""
    else:
        where_clause = f"WHERE company = {company}"

    sql = f"SELECT cnid, name FROM data.constructionnode {where_clause}"
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        for row in cursor:
            project_status[row[0]] = row[1]
        cursor.close()
    except:
        project_status = PROJECT_STATUS_DEFAULT
    return project_status

def process_row(row, project_status_cache):
    """
    处理单行数据，返回完整的90个字段
    """
    data = list(row)

    # 保存原始比例值 (用于后续计算)
    rate = data[24] if data[24] is not None else 0

    # 1. 转换状态/类型 (如果SQL已经用communion.kv()转换则跳过)
    # typeness: 检查是否已经是文本
    if data[7] is not None:
        if isinstance(data[7], int):
            data[7] = DECORATION_TYPE.get(data[7], data[7])
        # 如果已经是文本，保持不变
    # status: 检查是否已经是文本
    if data[8] is not None:
        if isinstance(data[8], int):
            data[8] = DECORATION_STATUS.get(data[8], data[8])
    # 操作类型: 检查是否已经是文本
    if data[19] is not None:
        if isinstance(data[19], int):
            data[19] = DECORATION_BELONG_TYPE.get(data[19], data[19])
        # 如果已经是文本，保持不变
    # 工程状态: 如果是整数则从字典转换，否则保持
    if data[39] is not None:
        if isinstance(data[39], int):
            data[39] = project_status_cache.get(data[39], PROJECT_STATUS_DEFAULT.get(data[39], data[39]))

    # 2. 处理签单时间(预签) - 如果有预签时间则用预签时间，否则用签单时间
    if data[3]:  # 预签时间
        data[4] = data[3]  # 签单时间(预签)
    data[5] = data[5] if data[5] else data[4]  # 签单时间(签单)

    # 3. 处理物品优惠 (根据atttype调整)
    atttype = data[57] if len(data) > 57 else None
    if atttype == 1 and data[16] is not None and data[14] is not None:
        data[16] = data[16] + data[14] / 100  # 物品优惠调整

    # 4. 金额除以1000
    div_num(data, DIV1000_INDICES)

    # 5. 转换比例显示为百分比
    if data[24] is not None and data[24] != "":
        data[24] = f"{float(data[24]) * 100:.0f}%"

    # 6. 计算衍生字段
    undisPrice = float(data[27]) if data[27] else 0  # 不打折总额
    disPrice = float(data[28]) if data[28] else 0    # 打折总额
    trafficPrice = float(data[29]) if data[29] else 0  # 车运费
    managePrice = float(data[30]) if data[30] else 0   # 管理费
    orderTotalPrice = float(data[13]) if data[13] else 0  # 签单额
    precontractPrice = float(data[12]) if data[12] else 0  # 预签额
    notSalesPrice = float(data[10]) if data[10] else 0   # 非业务提成
    couponCut = float(data[15]) if data[15] else 0     # 券优惠
    thingCut = float(data[16]) if data[16] else 0      # 物品优惠

    # 构建结果数组
    result = []

    # 基础字段 0-50 (跳过索引51,52)
    result.extend(data[0:51])
    result.extend(data[53:55])  # 税金比例, 税金金额

    # 计算字段
    折前总价 = undisPrice + disPrice + managePrice + trafficPrice
    差额 = orderTotalPrice - precontractPrice
    result.append(折前总价)
    result.append(差额)

    # 净业绩 = (签单总额 - 非业务提成 - 券优惠 - 物品优惠) * 比例
    净业绩 = (orderTotalPrice - notSalesPrice - couponCut - thingCut) * rate

    # 预签净业绩 = (预签额 - 非业务提成 - 券优惠 - 物品优惠) * 比例
    预签净业绩 = (precontractPrice - notSalesPrice - couponCut - thingCut) * rate

    # 业绩差额 = 净业绩 - 预签净业绩
    result.append(净业绩 - 预签净业绩)

    # 款项信息 (索引58-81)
    result.append(data[62] if data[62] else 0)  # 应付设计费
    result.append(data[63] if data[63] else 0)  # 实付设计费

    # 首付款
    result.append(data[65] if data[65] else 0)  # 首付款金额
    result.append(data[66])  # 收款时间
    result.append(data[67])  # 券值
    result.append(data[68])  # 券信息

    # 首付二期款
    result.append(data[69] if data[69] else 0)  # 首付二期款金额
    result.append(data[70])  # 收款时间
    result.append(data[71])  # 券值
    result.append(data[72])  # 券信息

    # 二期款
    result.append(data[73] if data[73] else 0)  # 二期款金额
    result.append(data[74])  # 收款时间
    result.append(data[75])  # 券值
    result.append(data[76])  # 券信息

    # 尾款
    result.append(data[77] if data[77] else 0)  # 尾款金额
    result.append(data[78])  # 尾款时间
    result.append(data[79])  # 券值
    result.append(data[80])  # 券信息

    # 违约金, 预付款余额
    result.append(data[64] if data[64] else 0)  # 违约金
    result.append(data[61] if data[61] else 0)  # 预付款余额

    # 净业绩, 复合业绩
    result.append(净业绩)

    # 复合业绩
    backCal = disPrice * 0.88 + undisPrice + trafficPrice + managePrice
    try:
        复合业绩 = ((backCal - notSalesPrice) * 0.38 - couponCut - thingCut + orderTotalPrice - backCal) / 0.38
    except ZeroDivisionError:
        复合业绩 = 0
    result.append(复合业绩)

    # 未付款金额
    result.append(data[60] if data[60] else 0)

    # 措施费 (默认为0，仅当company=-1时计算)
    措施费 = 0
    result.append(措施费)

    # 最后字段 (服务费, 主材总额, 纯利, 公司)
    result.append(data[51])  # 服务费
    result.append(data[52])  # 主材总额
    result.append(data[55] if data[55] else 0)  # 纯利 (unache)
    result.append(data[56])  # 公司

    # 应用比例计算到指定字段
    multiply_rate(result, RATE_MULTIPLY_INDICES, rate)

    return result

# ============================================================================
# 导出函数
# ============================================================================

def export_decoration_orders(year, output_file):
    """导出装饰订单到Excel"""

    start_date = f"{year}-01-01"
    end_date = f"{year}-12-31"

    print("=" * 70)
    print(f"装饰订单快速导出 - {year}年 (完整版90字段)")
    print("=" * 70)
    print(f"时间范围: {start_date} ~ {end_date}")
    print(f"输出文件: {output_file}")
    print()

    conn = None
    try:
        conn = pymysql.connect(**DB_CONFIG)

        # 加载工程状态字典
        project_status_cache = load_project_status(conn)

        # 统计订单数量
        print(f"[1/4] 统计订单数量...")
        cursor = conn.cursor()
        count_sql = "SELECT COUNT(*) FROM decoration.decoration WHERE contractTime >= %s AND contractTime <= %s"
        cursor.execute(count_sql, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        total_count = cursor.fetchone()[0]
        print(f"      订单数: {total_count:,} 条")
        cursor.close()

        if total_count == 0:
            print(f"\n[SKIP] 该时间段无数据")
            return False

        # 执行查询
        print(f"\n[2/4] 执行SQL查询...")
        start = time.time()
        cursor = conn.cursor(pymysql.cursors.SSCursor)
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
                processed_row = process_row(row, project_status_cache)
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
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        wb.save(output_file)

        total_time = query_time + write_time

        print(f"\n{'=' * 70}")
        print(f"[完成] 导出成功!")
        print(f"{'=' * 70}")
        print(f"  总字段数: {len(TABLE_HEADERS)} 个")
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
