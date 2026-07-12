#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
装饰订单快速导出 - 2025年全年 (完整版90字段)
修复字段顺序问题
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
    "host": "rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com",
    "port": 3306,
    "user": "fanglin1918",
    "password": "Fanglin1918!",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.SSCursor
}

EXPORT_YEAR = 2025
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", f"decoration_orders_{EXPORT_YEAR}_full.xlsx")

# ============================================================================
# 完整的优化SQL - 保持与原脚本相同的字段顺序
# ============================================================================

OPTIMIZED_SQL = """
SELECT
    -- 0-8: 基础信息
    d.orderId,                                                                  -- 0
    v.name,                                                                     -- 1
    h.houseNumber,                                                              -- 2
    d.precontractTime,                                                          -- 3
    d.contractTime,                                                             -- 4
    d.accountTime,                                                              -- 5
    d.typeness,                                                                 -- 6
    d.status,                                                                   -- 7
    d.houseType,                                                                -- 8
    -- 9-16: 金额类 (先放原始字段，后面再通过子查询计算活动优惠)
    IF(d.notSalesmanRate BETWEEN 0 AND 1000,
       IF(q.manageRate = 0 OR q.manageRate IS NULL, 0,
          q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate),
       d.notSalesmanRate),                                                     -- 9
    d.notSalesmanRate,                                                          -- 10
    d.precontractPrice,                                                         -- 11
    d.orderTotalPrice,                                                          -- 12
    d.factPrice,                                                                -- 13
    -- 14-15: 活动优惠 (后面用Python计算)
    0 AS couponCut,                                                             -- 14 (占位)
    0 AS thingCut,                                                              -- 15 (占位)
    -- 16-23: 人员部门
    u.userId,                                                                   -- 16
    u.currentName,                                                              -- 17
    db.type,                                                                    -- 18
    dd.no,                                                                      -- 19
    dd.name,                                                                    -- 20
    dr.no,                                                                      -- 21
    dr.name,                                                                    -- 22
    -- 24-38: 比例折扣报价面积
    db.rate,                                                                    -- 23
    q.discount,                                                                 -- 24
    q.totalPrice,                                                               -- 25
    q.undisPrice,                                                               -- 26
    q.disPrice,                                                                 -- 27
    q.trafficPrice,                                                             -- 28
    q.managePrice,                                                              -- 29
    q.manageRate,                                                               -- 30
    IFNULL(qp.managePrefer, 0),                                                 -- 31
    q.trafficPrice,                                                             -- 32
    busitype.name,                                                              -- 33
    h.buildArea,                                                                -- 34
    h.freeArea,                                                                 -- 35
    h.innerArea,                                                                -- 36
    h.totalArea,                                                                -- 37
    cn.name AS projectStatusName,                                               -- 38
    -- 39-50: 其他人员信息
    supervisor.currentName,                                                     -- 39
    d.paySacle,                                                                 -- 40
    d.grade,                                                                    -- 41
    us.currentName,                                                             -- 42
    d.houseClass,                                                               -- 43
    md.name,                                                                    -- 44
    mu.userId,                                                                  -- 45
    mu.currentName,                                                             -- 46
    ed.name,                                                                    -- 47
    eu.userId,                                                                  -- 48
    eu.currentName,                                                             -- 49
    -- 51-54: 服务费主材税金
    IF(d.type = 0, dm.servicePrice, IF(d.type = 2, dh.servicePrice, 0)),        -- 50
    IF(d.type = 0, dm.materialPrice, IF(d.type = 2, dh.materialPrice, 0)),     -- 51
    q.taxRate,                                                                  -- 52
    q.taxPrice,                                                                 -- 53
    q.unachePrice,                                                              -- 54
    co.name,                                                                    -- 55
    -- 56-60: atttype和款项信息 (后面处理)
    (
        SELECT MAX(a.atttype)
        FROM decoration.decorationactivityitem dai2
        LEFT JOIN information.activity a ON dai2.aId = a.aId
        WHERE dai2.orderId = d.orderId AND dai2.state IN (0,2,4,5,6) AND dai2.isPrefor = 0
    ) AS atttype,                                                               -- 56
    (
        SELECT SUM(IF(dp.paymentType = '设计费', dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeeTotal,                                                        -- 57
    (
        SELECT SUM(IF(dp.paymentType = '设计费' AND dp.paymentStatus = 0, dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS designFeePaid,                                                         -- 58
    (
        SELECT SUM(IF(dp.paymentType = '违约金', dp.referMoney, 0))
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
    ) AS penaltyFee,                                                            -- 59
    (
        SELECT SUM(dp.referMoney)
        FROM payment.decorationpayment dp
        WHERE dp.orderId = d.orderId
          AND dp.paymentStatus = 0
          AND dp.onetype = 0
          AND dp.twotype = 1
    ) AS nopayAmount,                                                           -- 60
    IFNULL(ap.balance, 0) AS advanceBalance,                                   -- 61
    -- 62-77: 各期款项信息
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayAmount,     -- 62
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayTime,       -- 63
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayCoupon,     -- 64
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付款' LIMIT 1) AS firstPayCouponInfo, -- 65
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayAmount, -- 66
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayTime,    -- 67
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayCoupon,  -- 68
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '首付二期款' LIMIT 1) AS secondPayCouponInfo, -- 69
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayAmount,     -- 70
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayTime,       -- 71
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayCoupon,     -- 72
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '二期款' LIMIT 1) AS thirdPayCouponInfo,  -- 73
    (SELECT dp.referMoney FROM payment.decorationpayment dp
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayAmount,      -- 74
    (SELECT dr.collectTime FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayTime,        -- 75
    (SELECT dr.coupon FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayCoupon,      -- 76
    (SELECT dr.couponInfo FROM payment.decorationreceipt dr
     INNER JOIN payment.decorationpayment dp ON dr.drId = dp.drId
     WHERE dp.orderId = d.orderId AND dp.paymentType = '尾款' LIMIT 1) AS finalPayCouponInfo   -- 77
FROM decoration.decoration AS d
LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
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
LEFT JOIN data.constructionnode cn ON d.projectStatus = cn.cnid
LEFT JOIN decoration.decorationbelong AS db ON d.orderId = db.orderId AND db.status = 0 AND db.defaultFlag = 1
LEFT JOIN communion.user AS u ON db.buid = u.uid
LEFT JOIN communion.department AS dd ON db.did = dd.did
LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
LEFT JOIN data.decorationbusitype AS busitype ON busitype.dbid = d.busitype
LEFT JOIN communion.company co ON d.company = co.cid
LEFT JOIN payment.advancepayment AS ap ON d.orderId = ap.orderId
WHERE d.contractTime >= %s AND d.contractTime <= %s
"""

# 获取活动优惠的SQL
GET_ACTIVITY_SQL = """
SELECT
    SUM(IF(dai.type = 0 AND dai.state IN (0,2,4,5,6) AND dai.isPrefor = 0,
             dai.num * dai.money / 1000, 0)) AS couponCut,
    SUM(IF(dai.type = 1 AND dai.state IN (0,2,4,5,6) AND dai.isPrefor = 0,
             dai.num * dai.money / 1000, 0)) AS thingCut,
    MAX(a.atttype) AS atttype
FROM decoration.decorationactivityitem dai
LEFT JOIN information.activity a ON dai.aId = a.aId
WHERE dai.orderId = %s AND dai.state IN (0,2,4,5,6) AND dai.isPrefor = 0
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
    # 服务费/主材 51-52
    "服务费",           # 51
    "主材总额",         # 52
    # 税金 53-54
    "税金比例",         # 53
    "税金金额",         # 54
    # 计算字段 55-57
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
    "纯利",             # 82
    "公司"              # 83
]

# 需要除以1000的字段索引
DIV1000_INDICES = [10, 11, 12, 13, 14, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 51, 52, 53, 54]

# 需要乘以比例的字段索引
RATE_MULTIPLY_INDICES = [12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38, 52, 53, 54]

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

def get_activity_info(conn, orderId):
    """获取活动优惠信息"""
    cursor = conn.cursor()
    cursor.execute(GET_ACTIVITY_SQL, (orderId,))
    result = cursor.fetchone()
    cursor.close()
    if result:
        return (result[0] or 0, result[1] or 0, result[2])  # couponCut, thingCut, atttype
    return (0, 0, None)

# ============================================================================
# 处理函数
# ============================================================================

def process_row(row, conn, project_status_cache):
    """处理单行数据，返回完整的84个字段"""
    data = list(row)

    # 获取活动优惠信息
    orderId = data[0]
    couponCut, thingCut, atttype = get_activity_info(conn, orderId)
    data[14] = couponCut
    data[15] = thingCut

    # 保存原始比例值
    rate = data[23] if data[23] is not None else 0

    # 1. 转换状态/类型
    if data[7] is not None and isinstance(data[7], int):
        data[7] = DECORATION_TYPE.get(data[7], data[7])
    if data[8] is not None and isinstance(data[8], int):
        data[8] = DECORATION_STATUS.get(data[8], data[8])
    if data[19] is not None and isinstance(data[19], int):
        data[19] = DECORATION_BELONG_TYPE.get(data[19], data[19])

    # 2. 处理签单时间
    if data[3]:  # 预签时间
        data[4] = data[3]
    data[5] = data[5] if data[5] else data[4]

    # 3. 处理物品优惠 (根据atttype调整)
    if atttype == 1 and data[14] is not None:
        data[15] = thingCut + data[14] / 100

    # 4. 金额除以1000
    div_num(data, DIV1000_INDICES)

    # 5. 转换比例显示为百分比
    if data[23] is not None and data[23] != "":
        data[23] = f"{float(data[23]) * 100:.0f}%"

    # 6. 计算衍生字段
    undisPrice = float(data[27]) if data[27] else 0
    disPrice = float(data[28]) if data[28] else 0
    trafficPrice = float(data[29]) if data[29] else 0
    managePrice = float(data[30]) if data[30] else 0
    orderTotalPrice = float(data[13]) if data[13] else 0
    precontractPrice = float(data[12]) if data[12] else 0
    notSalesPrice = float(data[10]) if data[10] else 0
    couponCut = float(data[14]) if data[14] else 0
    thingCut = float(data[15]) if data[15] else 0

    # 构建结果
    result = []

    # 基础字段 0-54
    result.extend(data[0:55])

    # 计算字段
    折前总价 = undisPrice + disPrice + managePrice + trafficPrice
    差额 = orderTotalPrice - precontractPrice
    result.append(折前总价)  # 55
    result.append(差额)       # 56

    # 净业绩和业绩差额
    净业绩 = (orderTotalPrice - notSalesPrice - couponCut - thingCut) * rate
    预签净业绩 = (precontractPrice - notSalesPrice - couponCut - thingCut) * rate
    result.append(净业绩 - 预签净业绩)  # 57

    # 款项信息
    result.append(data[57] or 0)  # 58: 应付设计费
    result.append(data[58] or 0)  # 59: 实付设计费

    # 首付款
    result.append(data[62] or 0)  # 60: 首付款
    result.append(data[63])       # 61: 收款时间
    result.append(data[64])       # 62: 券值
    result.append(data[65])       # 63: 券信息

    # 首付二期款
    result.append(data[66] or 0)  # 64: 首付二期款
    result.append(data[67])       # 65: 收款时间
    result.append(data[68])       # 66: 券值
    result.append(data[69])       # 67: 券信息

    # 二期款
    result.append(data[70] or 0)  # 68: 二期款
    result.append(data[71])       # 69: 收款时间
    result.append(data[72])       # 70: 券值
    result.append(data[73])       # 71: 券信息

    # 尾款
    result.append(data[74] or 0)  # 72: 尾款
    result.append(data[75])       # 73: 尾款时间
    result.append(data[76])       # 74: 券值
    result.append(data[77])       # 75: 券信息

    # 违约金, 预付款余额
    result.append(data[59] or 0)  # 76: 违约金
    result.append(data[61] or 0)  # 77: 预付款余额

    # 净业绩, 复合业绩
    result.append(净业绩)  # 78

    # 复合业绩
    backCal = disPrice * 0.88 + undisPrice + trafficPrice + managePrice
    try:
        复合业绩 = ((backCal - notSalesPrice) * 0.38 - couponCut - thingCut + orderTotalPrice - backCal) / 0.38
    except ZeroDivisionError:
        复合业绩 = 0
    result.append(复合业绩)  # 79

    # 未付款金额, 措施费
    result.append(data[60] or 0)  # 80: 未付款
    result.append(0)            # 81: 措施费

    # 最后字段
    result.append(data[54] or 0)  # 82: 纯利
    result.append(data[55])       # 83: 公司

    # 应用比例计算
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
    print(f"装饰订单快速导出 - {year}年 (完整版)")
    print("=" * 70)
    print(f"时间范围: {start_date} ~ {end_date}")
    print(f"输出文件: {output_file}")
    print()

    # 主连接 (用于 SSCursor 流式查询)
    main_conn = None
    # 辅助连接 (用于活动信息子查询，避免干扰主游标)
    sub_conn_config = DB_CONFIG.copy()
    sub_conn_config.pop('cursorclass', None)  # 移除 SSCursor，使用默认游标
    sub_conn = None

    try:
        # 创建主连接 (使用 SSCursor)
        main_conn = pymysql.connect(**DB_CONFIG)

        # 统计订单数量
        print(f"[1/4] 统计订单数量...")
        count_cursor = main_conn.cursor()
        count_sql = "SELECT COUNT(*) FROM decoration.decoration WHERE contractTime >= %s AND contractTime <= %s"
        count_cursor.execute(count_sql, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        total_count = count_cursor.fetchone()[0]
        count_cursor.close()
        print(f"      订单数: {total_count:,} 条")

        if total_count == 0:
            print(f"\n[SKIP] 该时间段无数据")
            return False

        # 创建辅助连接 (用于子查询)
        print(f"      创建辅助连接用于子查询...")
        sub_conn = pymysql.connect(**sub_conn_config)

        # 执行查询
        print(f"\n[2/4] 执行SQL查询...")
        start = time.time()
        cursor = main_conn.cursor(pymysql.cursors.SSCursor)
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
        batch_size = 500  # 使用适中的批次大小
        start = time.time()

        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break

            for row in rows:
                try:
                    # 使用辅助连接查询活动信息
                    processed_row = process_row(row, sub_conn, {})
                    ws.append(processed_row)
                    count += 1
                except Exception as e:
                    print(f"      [警告] 处理行 {count} 时出错: {e}")
                    import traceback
                    traceback.print_exc()
                    continue

            if count % 500 == 0:
                elapsed = time.time() - start
                print(f"      已处理: {count:,} 条 | 耗时: {elapsed:.2f} 秒 | 速度: {count/elapsed:.0f} 条/秒")

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
        if sub_conn:
            sub_conn.close()
        if main_conn:
            main_conn.close()

if __name__ == '__main__':
    export_decoration_orders(EXPORT_YEAR, OUTPUT_FILE)
