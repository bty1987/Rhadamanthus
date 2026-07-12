#!/usr/bin/python
# -*- coding:UTF-8 -*-
"""
装修订单导出脚本 - SQL优化版本
通过LEFT JOIN消除N+1查询问题，保持业务逻辑不变
"""

import os
import sys
import xlwt
import pymysql
import datetime
import traceback

class Exporter:

    def __init__(self, host='', username='', password='', charset='utf8'):

        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.size = 500

        # 订单类型映射
        self.typeness_key = {
            "0": "半包", "1": "整装", "2": "半价", "3": "满减", "4": "减上捡",
            "5": "达额减", "6": "新满减", "7": "局改", "8": "全翻", "9": "全案",
            "10": "新达额减", "11": "满额减"
        }

        # 装修归属类型
        self.decorationbelongType = {0: "设计", 1: "业务"}

        # 工程状态（从数据库加载）
        self.projectStatus = {}

        # 订单状态映射
        self.decorationStatus = {
            0: "初始", 1: "定金", 2: "预签", 3: "签约", 4: "重签",
            5: "废单", 6: "终止", 7: "决算", 8: "完结"
        }

        # 基础列定义 (与v2完全一致)
        # 注意：{{}} 是转义后的 {}，用于 format()
        self.base_columns = """
            d.orderId AS `编号`,
            v.name AS `楼盘名称`,
            h.houseNumber AS `楼号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间(预签)`,
            d.contractTime AS `签单时间(签单)`,
            d.accountTime AS `决算时间`,
            d.typeness AS `订单类型`,
            d.status AS `订单状态`,
            d.houseType AS `房屋类别`,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.notSalesmanRate AS `非业务员提点`,
            d.precontractPrice AS `预签额`,
            d.orderTotalPrice AS `签单额`,
            d.factPrice AS `实收额`,
            d.couponCut AS `券优惠`,
            d.thingCut AS `物品优惠`,
            u.userId AS `操作人编号`,
            u.currentName AS `操作人`,
            db.type AS `操作类型`,
            dd.no AS `部门编号`,
            dd.name AS `部门`,
            dr.no AS `分区编号`,
            dr.name AS `分区`,
            db.rate AS `比例`,
            q.discount AS `折扣`,
            q.totalPrice AS `报价总额`,
            q.undisPrice AS `不打折总额`,
            q.disPrice AS `打折总额`,
            q.trafficPrice AS `车运费`,
            q.managePrice AS `管理费`,
            q.manageRate AS `管理费比例`,
            if(qp.qpid is null, 0, qp.managePrefer) AS `管理优惠`,
            q.trafficPrice AS `运输费`,
            busitype.name AS `业务类型`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea AS `计价面积`,
            h.totalArea AS `总面积`,
            d.projectStatus AS `工程状态`,
            supervisor.currentName AS `监理`,
            d.paySacle AS `付款比例`,
            d.grade AS `装修单等级`,
            us.currentName AS `报价员`,
            d.houseClass AS `房屋类型`,
            md.name AS `跟单部`,
            mu.userId AS `跟单员编号`,
            mu.currentName AS `跟单员`,
            ed.name AS `方案设计部`,
            eu.userId AS `方案设计编号`,
            eu.currentName AS `方案设计`,
            if(d.type = 0, dm.servicePrice, if(d.type = 2, dh.servicePrice, 0)) AS `服务费`,
            if(d.type = 0, dm.materialPrice, if(d.type = 2, dh.materialPrice, 0)) AS `主材总额`,
            q.taxRate AS `税金比例`,
            q.taxPrice AS `税金金额`,
            q.unachePrice AS `纯利`,
            co.name AS `公司`
        """

        # 优化后的SQL - 通过LEFT JOIN一次性获取所有数据
        # 额外列添加在基础列之后
        self.SQL_EXPORT_OPTIMIZED = """
            SELECT
                {base_columns},
                -- 预付款 (advancepayment.balance)
                COALESCE(adv.balance, 0) AS `advanceBalance`,
                -- 未付款金额 (decorationpayment)
                COALESCE(nopay.sumReferMoney, 0) AS `nopaySumReferMoney`,
                -- 券优惠 sum
                COALESCE(act.couponCutSum, 0) AS `couponCutSum`,
                -- 物品优惠 sum
                COALESCE(act.thingCutSum, 0) AS `thingCutSum`,
                -- 活动类型
                act.atttype AS `atttype`,
                -- 款项详情 (GROUP_CONCAT格式)
                payment_data.paymentDetails AS `paymentDetails`,
                -- 报价纯利 (三个版本)
                q2.unachePrice2 AS `unachePrice2`,
                q1.unachePrice1 AS `unachePrice1`,
                q0.unachePrice0 AS `unachePrice0`
            FROM
                decoration.decoration AS d
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
                -- 预付款 LEFT JOIN
                LEFT JOIN payment.advancepayment adv ON d.orderId = adv.orderId
                -- 未付款 LEFT JOIN
                LEFT JOIN (
                    SELECT orderId, SUM(referMoney) AS sumReferMoney
                    FROM payment.decorationpayment
                    WHERE paymentStatus = 0 AND onetype = 0 AND twotype = 1
                    GROUP BY orderId
                ) nopay ON d.orderId = nopay.orderId
                -- 装修活动 LEFT JOIN
                LEFT JOIN (
                    SELECT
                        dai.orderId,
                        SUM(CASE WHEN dai.type = 0 THEN dai.num * dai.money ELSE 0 END)/1000 AS couponCutSum,
                        SUM(CASE WHEN dai.type = 1 THEN dai.num * dai.money ELSE 0 END)/1000 AS thingCutSum,
                        MAX(a.atttype) AS atttype
                    FROM decoration.decorationactivityitem dai
                    LEFT JOIN information.activity a ON dai.aid = a.aid
                    WHERE dai.state IN (0,2,4,5,6) AND dai.isprefor = 0
                    GROUP BY dai.orderId
                ) act ON d.orderId = act.orderId
                -- 报价纯利 LEFT JOIN (三个版本)
                LEFT JOIN (
                    SELECT q.orderId,
                        SUM(IF(qfai.discount = 1, qfai.initnum/1000*qfai.unitprice/1000*q.discount/10, qfai.initnum/1000*unitprice)) AS unachePrice2
                    FROM quotation.quotation q
                    LEFT JOIN quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId
                    LEFT JOIN quotation.quotationfunctionareaitem2 qfai ON qfa.qfaid = qfai.quotationFunctionAreaId
                    WHERE qfai.type = 6
                    GROUP BY q.orderId
                ) q2 ON d.orderId = q2.orderId
                LEFT JOIN (
                    SELECT q.orderId,
                        SUM(IF(qfai.discount = 1, qfai.initnum/1000*qfai.unitprice/1000*q.discount/10, qfai.initnum/1000*unitprice)) AS unachePrice1
                    FROM quotation.quotation q
                    LEFT JOIN quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId
                    LEFT JOIN quotation.quotationfunctionareaitem1 qfai ON qfa.qfaid = qfai.quotationFunctionAreaId
                    WHERE qfai.type = 6
                    GROUP BY q.orderId
                ) q1 ON d.orderId = q1.orderId
                LEFT JOIN (
                    SELECT q.orderId,
                        SUM(IF(qfai.discount = 1, qfai.initnum/1000*qfai.unitprice/1000*q.discount/10, qfai.initnum/1000*unitprice)) AS unachePrice0
                    FROM quotation.quotation q
                    LEFT JOIN quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId
                    LEFT JOIN quotation.quotationfunctionareaitem0 qfai ON qfa.qfaid = qfai.quotationFunctionAreaId
                    WHERE qfai.type = 6
                    GROUP BY q.orderId
                ) q0 ON d.orderId = q0.orderId
                -- 款项详情 LEFT JOIN (使用GROUP_CONCAT)
                LEFT JOIN (
                    SELECT
                        dp.orderId,
                        GROUP_CONCAT(
                            CONCAT(dp.paymentType, '|',
                                   COALESCE(dp.referMoney, 0), '|',
                                   dp.paymentStatus, '|',
                                   COALESCE(dr.collectTime, ''), '|',
                                   COALESCE(dr.coupon, 0), '|',
                                   COALESCE(dr.couponInfo, '')
                            ) ORDER BY dp.paymentType SEPARATOR ';;'
                        ) AS paymentDetails
                    FROM payment.decorationpayment dp
                    LEFT JOIN payment.decorationreceipt dr ON dp.drId = dr.drId
                    GROUP BY dp.orderId
                ) payment_data ON d.orderId = payment_data.orderId
            WHERE
                d.contractTime >= '{start_time} 00:00:00' AND
                d.contractTime <= '{end_time} 23:59:59'
                {company_filter}
        """

        # 列索引常量
        # 基础列: 0-56 (57列)
        # 57: advanceBalance (预付款)
        # 58: nopaySumReferMoney (未付款)
        # 59: couponCutSum (券优惠)
        # 60: thingCutSum (物品优惠)
        # 61: atttype (活动类型)
        # 62: paymentDetails (款项详情)
        # 63: unachePrice2 (报价纯利2)
        # 64: unachePrice1 (报价纯利1)
        # 65: unachePrice0 (报价纯利0)

    def getDBCursor(self, host='', username='', password='', charset=''):
        if not self.dbconn:
            self.dbconn = pymysql.connect(host=host, user=username, password=password, charset=charset)
            self.cursor = self.dbconn.cursor()

    def closeDBConnect(self):
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def constructionnode(self, company):
        """加载工程状态"""
        if int(company) == 0:
            company_sql = ''
        else:
            company_sql = 'where company = %s' % company

        sql = "SELECT cnid, name from data.constructionnode %s" % company_sql
        self.cursor.execute(sql)
        nodes = self.cursor.fetchall()

        for node in nodes:
            self.projectStatus[node[0]] = node[1]

    def createWorkbook(self, sheetName):
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet(sheetName, cell_overwrite_ok=True)
        return workbook, sheet

    def saveWorkbook(self, filePaths, workbook):
        filePath = os.path.dirname(filePaths)
        if not os.path.exists(filePath):
            os.makedirs(filePath)
        workbook.save(filePaths)

    def writeWorkbook(self, sheet, row, col, value):
        sheet.write(row, col, value)

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta
            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def count(self, sql):
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        return (data and len(data) > 0) and (len(data[0]) > 0 and data[0][0] or 0) or 0

    def page(self, sql, nowPage, size=200):
        nowPage = (nowPage - 1) * size
        limtStr = """limit %s,%s; """ % (nowPage, size)
        pageSql = sql + limtStr
        self.cursor.execute(pageSql)
        data = self.cursor.fetchall()
        return data

    def executeQuerySQL(self, sql):
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        return data

    def divNum(self, data, numList):
        """数值除以1000"""
        if len(numList) > 0:
            for i, v in enumerate(numList):
                if not data[v] is None:
                    data[v] = float(data[v]) / 1000
                else:
                    data[v] = 0

    def rates(self, row, rates, list):
        """比例计算"""
        if len(list) > 0:
            for i, v in enumerate(list):
                if not row[v] is None and row[v] != "":
                    row[v] = float(row[v]) * rates

    # 从JOIN结果中解析预付款 (替代 queryAdvancePayment)
    def getAdvancePaymentFromJoin(self, row):
        balance = row[57]  # advanceBalance
        if balance is not None and balance != 0:
            balance = float(balance) / 1000
        else:
            balance = 0
        return balance

    # 从JOIN结果中解析未付款 (替代 queryDecorationPaymentForNopay)
    def getDecorationPaymentForNopayFromJoin(self, row):
        sumReferMoney = row[58]  # nopaySumReferMoney
        if sumReferMoney is not None and sumReferMoney != 0:
            return float(sumReferMoney) / 1000
        else:
            return ""

    # 从JOIN结果中解析装修活动 (替代 queryDecorationActivityItem)
    def getDecorationActivityItemFromJoin(self, row):
        couponCut = row[59] or 0
        thingCut = row[60] or 0
        atttype = row[61]
        if atttype is None:
            atttype = -1
        return [couponCut, thingCut, atttype]

    # 从JOIN结果中解析报价纯利 (替代 queryQuotationUnache)
    def getQuotationUnacheFromJoin(self, row):
        # 依次尝试 version 2, 1, 0
        if row[63] is not None:
            return int(row[63])
        elif row[64] is not None:
            return int(row[64])
        elif row[65] is not None:
            return int(row[65])
        return 0

    # 从JOIN结果中解析款项详情 (替代 queryDecorationPayment)
    def getDecorationPaymentFromJoin(self, row):
        """解析paymentDetails字段，返回template数组"""
        paymentDetails = row[62]  # paymentDetails (GROUP_CONCAT结果)
        template = [None] * 24
        design = 0  # 应付设计费
        paid = 0   # 实付设计费

        if not paymentDetails:
            return template

        # 按;;分割每条款项记录
        for record in paymentDetails.split(';;'):
            if not record:
                continue
            parts = record.split('|')
            if len(parts) < 6:
                continue

            paymentType = parts[0]
            referMoney = float(parts[1]) / 1000 if parts[1] else 0  # 除以1000
            paymentStatus = int(parts[2]) if parts[2] else 0
            collectTime = parts[3]
            coupon = float(parts[4]) / 1000 if parts[4] else 0
            couponInfo = parts[5]

            if paymentType == "设计费":
                template[0] = design + referMoney
                if paymentStatus != 0:
                    template[1] = paid + referMoney
                    paid = paid + referMoney
                design = design + referMoney

            if paymentType == "首付款":
                template[2] = int(referMoney)
                template[3] = collectTime
                template[4] = coupon
                template[5] = couponInfo

            if paymentType == "首付二期款":
                template[6] = int(referMoney)
                template[7] = collectTime
                template[8] = coupon
                template[9] = couponInfo

            if paymentType == "二期款":
                template[10] = int(referMoney)
                template[11] = collectTime
                template[12] = coupon
                template[13] = couponInfo

            if paymentType == "尾款":
                template[14] = int(referMoney)
                template[15] = collectTime
                template[16] = coupon
                template[17] = couponInfo

            if paymentType == "违约金":
                template[20] = int(referMoney)

        return template

    def company(self, columnCompany, company):
        if company != 0:
            companyString = " AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "
        return companyString

    def main(self, startTime, endTime, company=0, output_file=None):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)
            self.constructionnode(company)

            # 构建SQL - 使用format
            company_filter = self.company("d.company", company)

            # 构建count SQL
            sqlcount = f"""
                SELECT count(*)
                FROM
                    decoration.decoration AS d
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
                WHERE
                    d.contractTime >= '{startTime} 00:00:00' AND
                    d.contractTime <= '{endTime} 23:59:59'
                    {company_filter}
            """

            count = self.count(sqlcount)

            if count == 0:
                print(f"无可导出数据: {startTime} ~ {endTime}")
                return False

            print(f"共 {count} 条数据待导出")

            workbook, sheet = self.createWorkbook("shee1")

            # 构建主SQL
            sql = self.SQL_EXPORT_OPTIMIZED.format(
                base_columns=self.base_columns,
                start_time=startTime,
                end_time=endTime,
                company_filter=company_filter
            )

            tableHead = [
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

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            print("开始导出数据...")

            while pageflag:
                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    rows = list(v)

                    orderId = rows[0]  # 订单号
                    type = rows[7] # 订单类型

                    # 从JOIN结果中获取数据（替代N+1查询）
                    rows[15], rows[16], atttype = self.getDecorationActivityItemFromJoin(rows)
                    rows[55] = self.getQuotationUnacheFromJoin(rows)

                    self.divNum(rows, [10, 11, 12, 13, 14, 15, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 51, 52, 53, 54, 55])

                    disPrice = float(rows[28]) # 打折总额
                    undisPrice = float(rows[27]) # 不打折总额
                    trafficPrice = float(rows[29]) # 车运费
                    managePrice = float(rows[30]) # 管理费

                    orderTotalPrice = float(rows[13]) # 签单总额
                    notSalesPrice = float(rows[10]) # 非提金额
                    couponCut = float(rows[15]) # 券优惠
                    thingCut = float(rows[16]) if atttype != 1 else (rows[16] + rows[14]/100) # 物品优惠

                    rates = float(rows[24])

                    rows[4] = rows[3] if rows[3] else rows[4] #签单时间(预签)
                    rows[7] = self.typeness_key.get(str(rows[7]), rows[7])
                    rows[8] = self.decorationStatus.get(rows[8], rows[8])  # 订单状态
                    rows[16] = thingCut
                    rows[19] = self.decorationbelongType.get(rows[19], rows[19])
                    rows[24] = '%d%%' % (rows[24] * 100)
                    rows[39] = self.projectStatus.get(rows[39], rows[39])
                    rows[51] = rows[51] if rows[51] else 0 #主材总额

                    # 从JOIN结果中获取款项详情
                    template = self.getDecorationPaymentFromJoin(rows)
                    template[18] = self.getDecorationPaymentForNopayFromJoin(rows) # 未付款
                    template[19] = self.getAdvancePaymentFromJoin(rows)  # 已付款

                    # 折前总价 = 不打折总额 + 打折总额 + 管理费 + 运输费
                    rows.append(undisPrice + disPrice + managePrice + trafficPrice)
                    # 差额 = 签单额 - 预签额
                    rows.append(rows[13] - rows[12])

                    # 净业绩 = 签单总额 - 非业务提成 - 券优惠 - 物品优化
                    template[21] = (int(orderTotalPrice) - int(notSalesPrice) - int(couponCut) - int(thingCut)) * rates
                    #预签净业绩 = 预签额 - 非提金额 - 券优惠 - 物品优化
                    presignPrice = (int(rows[12]) - int(rows[10]) - int(rows[15]) - int(rows[16])) * rates
                    #业绩差额=净业绩-预签净业绩
                    rows.append(template[21] - presignPrice)

                    #复合业绩
                    # 推回8.8折合同报价=打折总额*0.88+不打折总额+车运费+管理费
                    backCal = (disPrice * 0.88 + undisPrice + trafficPrice + managePrice)

                    # 复核业绩=[(推回8.8折合同报价—非业务人员提点金额)*0.38-券-礼品+签单额-推回8.8折合同报价]/0.38
                    template[22] = ((backCal - notSalesPrice) * 0.38 - couponCut - thingCut + orderTotalPrice - backCal) / 0.38

                    # 措施费=直接费*0.019，直接费是折前总价-管理费
                    if company == -1:
                        template[23] = (undisPrice - managePrice) * 0.019
                    else:
                        template[23] = 0

                    template = [
                        template[0], template[1], template[2], template[3], template[4], template[5],
                        template[6], template[7], template[8], template[9], template[10], template[11],
                        template[12], template[13], template[14], template[15], template[16], template[17],
                        template[20], template[19], template[21], template[22], template[18], template[23]
                    ]

                    template.append(rows[51]) # 服务费
                    template.append(rows[52]) # 主材额
                    template.append(rows[55]) # 纯利
                    template.append(rows[56]) # 公司

                    # 构建最终行：保持与v2完全一致的结构
                    # v2: rows[0:51] (51列) + rows[53:55] (2列) + rows[57:] (空列) + template (28列) = 81列
                    # v3: rows[0:51] (51列) + rows[53:55] (2列) + template (28列) = 81列
                    # 注意：rows[57:]在v2是空的（总共57列），在v3不使用
                    row = rows[0:51] + rows[53:55] + template

                    # test_list索引对应最终row中的位置
                    # 0-50来自rows[0:51], 51-52来自rows[53:55], 53-80来自template
                    # template有28个元素(53-80), 加上前面53个 = 81个元素(索引0-80)
                    # 索引80是公司名称(字符串)，移除
                    test_list = [12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38, 52, 53, 54, 55, 57, 77, 78]

                    self.rates(row, rates, test_list)

                    self.createTableHead(sheet, row, count)
                    count += 1

                    if count % 500 == 0:
                        print(f"已处理 {count-1} 条记录...")

                nowPage = nowPage + 1

                if len(data) < self.size:
                    pageflag = False

            # 保存到本地文件
            if output_file is None:
                output_dir = os.path.join(os.path.dirname(__file__), "output")
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                filename = f"decoration_{startTime.replace('/', '-')}_{endTime.replace('/', '-')}.xls"
                output_file = os.path.join(output_dir, filename)

            self.saveWorkbook(output_file, workbook)
            print(f"\n导出完成！文件: {output_file}")
            print(f"共导出 {count-1} 条数据")

            return True

        except Exception as e:
            print(f"导出出错: {e}")
            traceback.print_exc()
            return False
        finally:
            self.closeDBConnect()


if __name__ == '__main__':
    """
    导出装修签单脚本说明:
        根据查询条件导出订单签单信息到本地Excel文件
    用法: python export_decoration_2015_2025_v3.py <开始时间> <结束时间> [公司ID]
    示例: python export_decoration_2015_2025_v3.py 2015/01/01 2015/12/31 0
    """

    # 阿里云RDS数据库配置
    DB_HOST = "rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com"
    DB_USER = "fanglin1918"
    DB_PASS = "Fanglin1918!"

    if len(sys.argv) < 3:
        print("用法: python export_decoration_2015_2025_v3.py <开始时间> <结束时间> [公司ID]")
        print("示例: python export_decoration_2015_2025_v3.py 2015/01/01 2015/12/31 0")
        sys.exit(1)

    start_time = sys.argv[1]
    end_time = sys.argv[2]
    company = int(sys.argv[3]) if len(sys.argv) > 3 else 0

    exporter = Exporter(DB_HOST, DB_USER, DB_PASS)
    exporter.main(start_time, end_time, company)
