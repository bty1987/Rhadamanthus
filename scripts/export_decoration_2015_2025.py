#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
独立版本的装修订单导出脚本 - 优化版 V2
使用批量查询避免N+1问题
"""

import os
import sys
import xlwt
import pymysql
import datetime

# 数据库配置 - 阿里云RDS
DB_CONFIG = {
    "host": "rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com",
    "port": 3306,
    "user": "fanglin1918",
    "password": "Fanglin1918!",
    "charset": "utf8",
    "db": None
}

class DecorationExporter:

    def __init__(self):
        self.typeness_key = {
            0: "半包", 1: "整装", 2: "半价", 3: "满减", 4: "减上捡",
            5: "达额减", 6: "新满减", 7: "局改", 8: "全翻", 9: "全案",
            10: "新达额减", 11: "满额减"
        }
        self.decorationbelongType = {0: "设计", 1: "业务"}
        self.projectStatus = {}

        # 主查询SQL - 保持与原脚本相同的列顺序和命名
        self.SQL_MAIN = """
            SELECT
                d.orderId,
                v.name AS villageName,
                h.houseNumber,
                d.precontractTime,
                d.contractTime,
                d.contractTime,
                d.accountTime,
                d.typeness,
                d.status,
                d.houseType,
                IF(d.notSalesmanRate >= 0 AND d.notSalesmanRate <= 1000,
                   IF(q.manageRate = 0 OR q.manageRate IS NULL, 0,
                      q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate),
                   d.notSalesmanRate) AS notSalesmanRate,
                d.notSalesmanRate AS notSalesmanRateRaw,
                d.precontractPrice,
                d.orderTotalPrice,
                d.factPrice,
                0 AS couponCut,
                0 AS thingCut,
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
                IF(qp.qpid IS NULL, 0, qp.managePrefer) AS managePrefer,
                q.trafficPrice,
                busitype.name,
                h.buildArea,
                h.freeArea,
                h.innerArea,
                h.totalArea,
                d.projectStatus,
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
                IF(d.type = 0, dm.servicePrice, IF(d.type = 2, dh.servicePrice, 0)) AS servicePrice,
                IF(d.type = 0, dm.materialPrice, IF(d.type = 2, dh.materialPrice, 0)) AS materialPrice,
                q.taxRate,
                q.taxPrice,
                q.unachePrice,
                co.name
            FROM decoration.decoration AS d
            LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
            LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
            LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId AND db.status = 0)
            LEFT JOIN quotation.quotation AS q ON (d.orderId = q.orderId AND q.defaults = 1)
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
            WHERE d.contractTime >= '__START_TIME__ 00:00:00' AND d.contractTime <= '__END_TIME__ 23:59:59' __COMPANY_FILTER__
        """

        # 批量查询SQL
        self.SQL_BATCH_ACTIVITY = """
            SELECT orderId,
                   SUM(CASE WHEN dai.type = 0 THEN num * money / 1000 ELSE 0 END) AS coupon_cut,
                   SUM(CASE WHEN dai.type = 1 THEN num * money / 1000 ELSE 0 END) AS thing_cut,
                   MAX(a.atttype) AS atttype
            FROM decoration.decorationactivityitem dai
            LEFT JOIN information.activity a ON dai.aid = a.aid
            WHERE dai.orderId IN (%s) AND dai.state IN (0,2,4,5,6) AND dai.isprefor = 0
            GROUP BY orderId
        """

        self.SQL_BATCH_PAYMENT = """
            SELECT p.orderId, p.paymentType, p.referMoney, p.paymentStatus,
                   r.collectTime, r.coupon, r.couponInfo
            FROM payment.decorationpayment p
            LEFT JOIN payment.decorationreceipt r ON p.drId = r.drId
            WHERE p.orderId IN (%s)
        """

        self.SQL_BATCH_ADVANCE = """
            SELECT d.orderId, ap.balance
            FROM decoration.decoration d
            INNER JOIN payment.advancepayment ap ON d.orderId = ap.orderId
            WHERE d.orderId IN (%s)
        """

        self.SQL_BATCH_NOPAY = """
            SELECT orderId, SUM(referMoney)
            FROM payment.decorationpayment
            WHERE paymentStatus = 0 AND onetype = 0 AND twotype = 1 AND orderId IN (%s)
            GROUP BY orderId
        """

        self.SQL_BATCH_UNACHE = """
            SELECT q.orderId,
                   SUM(CASE WHEN qfai.discount = 1
                       THEN qfai.initnum/1000*qfai.unitprice/1000*q.discount/10
                       ELSE qfai.initnum/1000*qfai.unitprice END)
            FROM quotation.quotation q
            INNER JOIN quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId
            INNER JOIN quotation.quotationfunctionareaitem%s qfai ON qfa.qfaid = qfai.quotationFunctionAreaId
            WHERE q.orderId IN (__PLACEHOLDERS__) AND q.defaults = 1 AND qfai.type = 6
            GROUP BY q.orderId
        """

    def connectDB(self):
        self.dbconn = pymysql.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            charset=DB_CONFIG["charset"]
        )
        self.cursor = self.dbconn.cursor()

    def closeDB(self):
        if self.cursor:
            self.cursor.close()
        if self.dbconn:
            self.dbconn.close()

    def loadProjectStatus(self):
        self.cursor.execute("SELECT cnid, name FROM data.constructionnode")
        for node in self.cursor.fetchall():
            self.projectStatus[node[0]] = node[1]

    def safe_float(self, val, default=0):
        """安全转换为浮点数"""
        try:
            if val is None:
                return default
            return float(val)
        except:
            return default

    def safe_int(self, val, default=0):
        """安全转换为整数"""
        try:
            if val is None:
                return default
            return int(val)
        except:
            return default

    def to_str(self, val):
        """转换为字符串"""
        if val is None:
            return ""
        return str(val)

    # ========== 批量查询方法 ==========

    def batchQueryActivity(self, order_ids):
        if not order_ids:
            return {}
        placeholders = ','.join(['%s'] * len(order_ids))
        self.cursor.execute(self.SQL_BATCH_ACTIVITY % placeholders, order_ids)
        result = {}
        for row in self.cursor.fetchall():
            result[row[0]] = {
                'coupon': self.safe_float(row[1]),
                'thing': self.safe_float(row[2]),
                'atttype': row[3] if row[3] is not None else -1
            }
        return result

    def batchQueryPayment(self, order_ids):
        if not order_ids:
            return {}
        placeholders = ','.join(['%s'] * len(order_ids))
        self.cursor.execute(self.SQL_BATCH_PAYMENT % placeholders, order_ids)
        result = {}
        for row in self.cursor.fetchall():
            order_id = row[0]
            if order_id not in result:
                result[order_id] = []
            result[order_id].append({
                'type': row[1],
                'money': self.safe_float(row[2]) / 1000 if row[2] else 0,
                'status': row[3],
                'time': row[4],
                'coupon': self.safe_float(row[5]) / 1000 if row[5] else 0,
                'info': row[6]
            })
        return result

    def batchQueryAdvance(self, order_ids):
        if not order_ids:
            return {}
        placeholders = ','.join(['%s'] * len(order_ids))
        self.cursor.execute(self.SQL_BATCH_ADVANCE % placeholders, order_ids)
        result = {}
        for row in self.cursor.fetchall():
            result[row[0]] = self.safe_float(row[1]) / 1000
        return result

    def batchQueryNopay(self, order_ids):
        if not order_ids:
            return {}
        placeholders = ','.join(['%s'] * len(order_ids))
        self.cursor.execute(self.SQL_BATCH_NOPAY % placeholders, order_ids)
        result = {}
        for row in self.cursor.fetchall():
            result[row[0]] = self.safe_int(row[1]) / 1000  # 需要除以1000
        return result

    def batchQueryUnache(self, order_ids):
        if not order_ids:
            return {}
        placeholders = ','.join(['%s'] * len(order_ids))
        for suffix in [2, 1, 0]:
            sql = self.SQL_BATCH_UNACHE % suffix
            sql = sql.replace('__PLACEHOLDERS__', placeholders)
            self.cursor.execute(sql, order_ids)
            if self.cursor.rowcount > 0:
                result = {}
                for row in self.cursor.fetchall():
                    # SQL中已经除以1000（initnum/1000*unitprice/1000），需要再除以1000转为千元
                    result[row[0]] = self.safe_int(row[1]) / 1000
                if result:
                    return result
        return {}

    def buildPaymentTemplate(self, payment_list):
        template = [None] * 24
        design = 0
        paid = 0
        for p in payment_list:
            pay_type = p['type']
            money = p['money']
            status = p['status']
            if pay_type == "设计费":
                design += money
                template[0] = design
                if status != 0:
                    paid += money
                    template[1] = paid
            elif pay_type == "首付款":
                template[2:6] = [self.safe_int(money), p['time'], p['coupon'], p['info']]
            elif pay_type == "首付二期款":
                template[6:10] = [self.safe_int(money), p['time'], p['coupon'], p['info']]
            elif pay_type == "二期款":
                template[10:14] = [self.safe_int(money), p['time'], p['coupon'], p['info']]
            elif pay_type == "尾款":
                template[14:18] = [self.safe_int(money), p['time'], p['coupon'], p['info']]
            elif pay_type == "违约金":
                template[20] = self.safe_int(money)
        return template

    def export(self, start_time, end_time, company=0, output_file=None):
        try:
            self.connectDB()
            self.loadProjectStatus()

            company_filter = "" if company == 0 else f" AND d.company = {company}"

            # 构建完整SQL
            full_sql = """
                SELECT
                    d.orderId,
                    v.name AS villageName,
                    h.houseNumber,
                    d.precontractTime,
                    d.contractTime,
                    d.contractTime,
                    d.accountTime,
                    d.typeness,
                    d.status,
                    d.houseType,
                    IF(d.notSalesmanRate >= 0 AND d.notSalesmanRate <= 1000,
                       IF(q.manageRate = 0 OR q.manageRate IS NULL, 0,
                          q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate),
                       d.notSalesmanRate) AS notSalesmanRate,
                    d.notSalesmanRate AS notSalesmanRateRaw,
                    d.precontractPrice,
                    d.orderTotalPrice,
                    d.factPrice,
                    0 AS couponCut,
                    0 AS thingCut,
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
                    IF(qp.qpid IS NULL, 0, qp.managePrefer) AS managePrefer,
                    q.trafficPrice,
                    busitype.name,
                    h.buildArea,
                    h.freeArea,
                    h.innerArea,
                    h.totalArea,
                    d.projectStatus,
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
                    IF(d.type = 0, dm.servicePrice, IF(d.type = 2, dh.servicePrice, 0)) AS servicePrice,
                    IF(d.type = 0, dm.materialPrice, IF(d.type = 2, dh.materialPrice, 0)) AS materialPrice,
                    q.taxRate,
                    q.taxPrice,
                    q.unachePrice,
                    co.name
                FROM decoration.decoration AS d
                LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
                LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId AND db.status = 0)
                LEFT JOIN quotation.quotation AS q ON (d.orderId = q.orderId AND q.defaults = 1)
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
                WHERE d.contractTime >= '""" + start_time + """ 00:00:00'
                  AND d.contractTime <= '""" + end_time + """ 23:59:59'
                  """ + company_filter

            # 统计总数
            count_sql = "SELECT COUNT(*) " + full_sql[full_sql.index("FROM"):]
            self.cursor.execute(count_sql)
            total = self.cursor.fetchone()[0]

            if total == 0:
                print(f"无可导出数据: {start_time} ~ {end_time}")
                return False

            print(f"共 {total} 条数据待导出")

            # 一次性获取所有数据
            self.cursor.execute(full_sql)
            all_data = self.cursor.fetchall()

            order_ids = [row[0] for row in all_data]

            print(f"批量查询关联数据...")
            activity_map = self.batchQueryActivity(order_ids)
            payment_map = self.batchQueryPayment(order_ids)
            advance_map = self.batchQueryAdvance(order_ids)
            nopay_map = self.batchQueryNopay(order_ids)
            unache_map = self.batchQueryUnache(order_ids)

            workbook = xlwt.Workbook()
            sheet = workbook.add_sheet("Sheet1", cell_overwrite_ok=True)

            headers = [
                "装修单号", "楼盘名称", "楼号", "预签时间", "签单时间(预签)", "签单时间(签单)", "决算时间", "订单类型", "订单状态", "房屋类别",
                "非业务提成", "非业务提点", "预签额", "签单额", "实收额", "券优惠", "物品", "操作人编号", "操作人", "操作类型",
                "部门编号", "部门", "分区编号", "分区", "比例", "折扣", "报价总额", "不打折总额", "打折总额", "车运费",
                "管理费", "管理费比例", "管理优惠", "运输费", "业务类型", "建筑面积", "赠送面积", "计价面积", "总面积", "工程状态",
                "监理", "付款比例", "订单等级", "报价员", "房屋类型", "跟单部", "跟单员编号", "跟单员", "方案设计部", "方案设计编号",
                "方案设计", "税金比例", "税金金额", "折前总价", "差额", "业绩差额", "应付设计费", "实付设计费", "首付款", "收款时间",
                "券值", "券信息", "首付二期款", "收款时间", "券值", "券信息", "二期款", "收款时间", "券值", "券信息",
                "尾款", "尾款时间", "券值", "券信息", "违约金", "预付款余额", "净业绩", "复合业绩", "未付款金额", "措施费",
                "应收服务费", "主材总额", "纯利", "公司"
            ]
            for col, h in enumerate(headers):
                sheet.write(0, col, h)

            print(f"开始写入数据...")

            for row_idx, r in enumerate(all_data, start=1):
                order_id = r[0]

                # 获取关联数据
                activity = activity_map.get(order_id, {'coupon': 0, 'thing': 0, 'atttype': -1})
                coupon_cut = activity['coupon']
                thing_cut = activity['thing']
                atttype = activity['atttype']

                payment_list = payment_map.get(order_id, [])
                template = self.buildPaymentTemplate(payment_list)
                template[18] = nopay_map.get(order_id, "")
                template[19] = advance_map.get(order_id, 0)
                unache = unache_map.get(order_id, 0)

                # 数值字段需要除以1000
                def div1000(idx):
                    val = r[idx]
                    if val is None:
                        return 0
                    try:
                        return float(val) / 1000
                    except:
                        return 0

                # 构建行数据（索引对应SQL中的列顺序）
                row = [
                    r[0],  # 0: orderId
                    r[1],  # 1: 楼盘名称
                    r[2],  # 2: 楼号
                    r[3],  # 3: 预签时间
                    r[3] if r[3] else r[4],  # 4: 签单时间(预签)
                    r[4],  # 5: 签单时间(签单)
                    r[5],  # 6: 决算时间
                    self.typeness_key.get(self.safe_int(r[7]), r[7]),  # 7: 订单类型
                    r[8],  # 8: 订单状态
                    r[9],  # 9: 房屋类别
                    div1000(10),  # 10: 非业务提成
                    div1000(11),  # 11: 非业务提点
                    div1000(12),  # 12: 预签额
                    div1000(13),  # 13: 签单额
                    div1000(14),  # 14: 实收额
                    coupon_cut,  # 15: 券优惠
                    thing_cut,  # 16: 物品
                    r[17],  # 17: 操作人编号
                    r[18],  # 18: 操作人
                    self.decorationbelongType.get(r[19], r[19]),  # 19: 操作类型
                    r[20],  # 20: 部门编号
                    r[21],  # 21: 部门
                    r[22],  # 22: 分区编号
                    r[23],  # 23: 分区
                    r[24],  # 24: 比例
                    div1000(25),  # 25: 折扣
                    div1000(26),  # 26: 报价总额
                    div1000(27),  # 27: 不打折总额
                    div1000(28),  # 28: 打折总额
                    div1000(29),  # 29: 车运费
                    div1000(30),  # 30: 管理费
                    div1000(31),  # 31: 管理费比例
                    div1000(32),  # 32: 管理优惠
                    div1000(33),  # 33: 运输费
                    r[34],  # 34: 业务类型
                    div1000(35),  # 35: 建筑面积
                    div1000(36),  # 36: 赠送面积
                    div1000(37),  # 37: 计价面积
                    div1000(38),  # 38: 总面积
                    self.projectStatus.get(r[39], r[39]),  # 39: 工程状态
                    r[40],  # 40: 监理
                    r[41],  # 41: 付款比例
                    r[42],  # 42: 订单等级
                    r[43],  # 43: 报价员
                    r[44],  # 44: 房屋类型
                    r[45],  # 45: 跟单部
                    r[46],  # 46: 跟单员编号
                    r[47],  # 47: 跟单员
                    r[48],  # 48: 方案设计部
                    r[49],  # 49: 方案设计编号
                    r[50],  # 50: 方案设计
                    div1000(51),  # 51: 税金比例
                    div1000(52),  # 52: 税金金额
                    div1000(53),  # 53: 服务费
                    div1000(54),  # 54: 主材总额
                    r[55],  # 55: 公司
                ]

                # 获取数值
                not_sales_price = row[10]
                precontract_price = row[12]
                order_total_price = row[13]
                undis_price = row[27]
                dis_price = row[28]
                traffic_price = row[29]
                manage_price = row[30]
                rates_val = self.safe_float(row[24])

                # 格式化比例
                row[24] = f'{int(rates_val * 100)}%' if rates_val else ''

                # 计算字段
                pre_total = undis_price + dis_price + manage_price + traffic_price  # 折前总价
                diff = order_total_price - precontract_price  # 差额

                # 净业绩和预签净业绩
                net_achievement = (self.safe_int(order_total_price) - self.safe_int(not_sales_price) - self.safe_int(coupon_cut) - self.safe_int(thing_cut)) * rates_val
                pre_net = (self.safe_int(precontract_price) - self.safe_int(not_sales_price) - self.safe_int(coupon_cut) - self.safe_int(thing_cut)) * rates_val
                achievement_diff = net_achievement - pre_net  # 业绩差额

                # 复合业绩
                back_cal = dis_price * 0.88 + undis_price + traffic_price + manage_price
                compound_achievement = ((back_cal - not_sales_price) * 0.38 - coupon_cut - thing_cut + order_total_price - back_cal) / 0.38

                # 措施费
                measure_fee = (undis_price - manage_price) * 0.019 if company == -1 else 0

                # 纯利（从quotation.unachePrice获取或使用批量查询结果）
                unache_price = div1000(54) if r[54] else unache

                # 扩展行数据
                row.extend([
                    pre_total,  # 折前总价
                    diff,  # 差额
                    achievement_diff,  # 业绩差额
                ])

                row.extend([
                    template[0], template[1], template[2], template[3], template[4], template[5],
                    template[6], template[7], template[8], template[9], template[10], template[11],
                    template[12], template[13], template[14], template[15], template[16], template[17],
                    template[20], template[19], net_achievement, compound_achievement, template[18], measure_fee
                ])

                row.extend([row[53], row[54], unache_price, row[55]])

                # 比例计算
                rate_indices = [12, 13, 14, 15, 16, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 53, 54]
                for idx in rate_indices:
                    if row[idx] not in [None, ""]:
                        try:
                            row[idx] = float(row[idx]) * rates_val
                        except:
                            pass

                for col, val in enumerate(row):
                    sheet.write(row_idx, col, val)

                if row_idx % 500 == 0:
                    print(f"已处理 {row_idx} 条记录...")

            if output_file is None:
                output_dir = os.path.join(os.path.dirname(__file__), "output")
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                filename = f"decoration_{start_time.replace('/', '-')}_{end_time.replace('/', '-')}.xls"
                output_file = os.path.join(output_dir, filename)

            workbook.save(output_file)
            print(f"\n导出完成！文件: {output_file}")
            print(f"共导出 {len(all_data)} 条数据")
            return True

        except Exception as e:
            print(f"导出出错: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            self.closeDB()


def main():
    if len(sys.argv) < 3:
        print("用法: python export_decoration_2015_2025.py <开始时间> <结束时间> [公司ID]")
        print("示例: python export_decoration_2015_2025.py 2015/01/01 2015/12/31 0")
        sys.exit(1)

    start_time = sys.argv[1]
    end_time = sys.argv[2]
    company = int(sys.argv[3]) if len(sys.argv) > 3 else 0

    exporter = DecorationExporter()
    exporter.export(start_time, end_time, company)


if __name__ == '__main__':
    main()
