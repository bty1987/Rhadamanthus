#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
    
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.size = 300

        self.column = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘名称`,
            h.houseNumber AS `楼号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间`,
            d.accountTime AS `决算时间`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `订单类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `订单状态`,
            d.houseType AS `房屋类别`,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.notSalesmanRate AS `非业务提点`, # 10
            d.precontractPrice AS `预签额`,
            d.orderTotalPrice AS `签单额`,
            d.factPrice AS `实收额`,
            d.couponCut AS `券优惠`,
            d.thingCut AS `物品`,
            u.userId AS `操作人编号`,
            u.currentName AS `操作人`,
            db.type AS `操作类型`,
            dd.no AS `部门编号`,
            dd.name AS `部门`, # 20
            dr.no AS `分区编号`,
            dr.name AS `分区`,
            db.rate AS `比例`,
            q.discount AS `折扣`,
            q.totalPrice AS `报价总额`,
            q.undisPrice AS `不打折总额`,
            q.disPrice AS `打折总额`,
            q.trafficPrice AS `车运费`,
            q.managePrice AS `管理费`,
            q.manageRate AS `管理费提点`, # 30
            if(qp.qpid is null, 0, qp.managePrefer) AS `管理优惠`,
            q.trafficPrice AS `运输费`,
            busitype.alias AS `业务类型`,
            busitype.name AS `业务类型`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea AS `套内面积`,
            h.totalArea AS `总面积`,
            cn.name AS `工程状态`,
            supervisor.currentName AS `监理`, # 40
            d.paySacle AS `付款比例`,
            d.grade AS `订单等级`,
            us.currentName AS `报价员`,
            d.houseClass AS `房屋类型`,
            md.name AS `跟单部`,
            mu.userId AS `跟单员编号`,
            mu.currentName AS `跟单员`,
            ed.name AS `方案设计部`,
            eu.userId AS `方案设计编号`,
            eu.currentName AS `方案设计`, # 50
            q.taxRate AS `税金比例`,
            q.taxPrice AS `税金`,
            if(d.type = 0, dm.servicePrice, if(d.type = 2, dh.servicePrice, 0)) AS `应收服务费`,
            if(d.type = 0, dm.materialPrice, if(d.type = 2, dh.materialPrice, 0)) AS `主材总额`,
            q.unachePrice AS `纯利`,
            co.name AS `装修单公司`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = """
            SELECT
                %s
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
                LEFT JOIN data.constructionnode AS cn ON d.projectStatus = cn.cnid
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE 
                d.contractTime >= '%s 00:00:00' AND
                d.contractTime <= '%s 23:59:59' 
                %s
        """

        self.SQL_QUERY_DECORATION_PAYMENT = """
            SELECT
                decorationpayment.orderId AS `订单编号`,
                decorationpayment.paymentType AS `款项类型`,
                decorationpayment.referMoney AS `金额`,
                decorationpayment.paymentStatus AS `状态`,
                decorationreceipt.collectTime AS `交款时间`,
                decorationreceipt.coupon AS `券值`,
                decorationreceipt.couponInfo AS `券信息`
            FROM
                payment.decorationpayment AS decorationpayment
                LEFT JOIN payment.decorationreceipt AS decorationreceipt ON decorationpayment.drId = decorationreceipt.drId
            WHERE
                decorationpayment.orderId = '%s'
        """

        self.SQL_EXPORT_DECORATION_ADVANCE = """
            SELECT
                decoration.orderId AS `订单编号`,
                advancepayment.balance AS `预付款`
            FROM
                decoration.decoration AS decoration ,
                payment.advancepayment AS advancepayment
            WHERE
                decoration.orderId = advancepayment.orderId AND 
                decoration.orderId = '%s'
        """

        self.SQL_QUERY_DECORATION_PAYMENT_NOPAY = """
           SELECT
               orderId, SUM(referMoney)
           FROM
               payment.decorationpayment
           WHERE
               paymentStatus = 0 AND 
               onetype = 0 AND 
               twotype = 1 AND 
               orderId= '%s'
        """
        
        self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE = """
            SELECT 
                SUM(servicePrice),
                orderId
            FROM    
                decoration.decorationHolonomy
            WHERE
                orderId = '%s'
            GROUP BY 
                orderId
        """
        
        self.SQL_QUERY_DECORATION_ACTIVITY_ITEM = """
            SELECT 
                sum(dai.num * dai.money)/1000, dai.type, a.atttype, a.multiple
            FROM 
                decoration.decorationactivityitem dai LEFT JOIN information.activity a on dai.aid = a.aid
            WHERE 
                dai.orderId = '%s' AND 
                dai.state in (0,2,4,5,6) AND 
                dai.isprefor = 0
            GROUP BY type;
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    # 已付款
    def queryAdvancePayment(self, orderId):

        infos = self.executeQuerySQL(self.SQL_EXPORT_DECORATION_ADVANCE % (orderId))
        
        if infos != ():
            data = list(infos[0])
            self.divNum(data, [1])
            balance = data[1]
        else:
            balance = 0

        return balance

    # 未付款
    def queryDecorationPaymentForNopay(self, orderId):

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_PAYMENT_NOPAY % (orderId))

        if infos[0][0] != None and infos[0][1] != None:
            data = list(infos[0])
            self.divNum(data, [1])
            sumReferMoney = int(data[1])
        else:
            sumReferMoney = ""

        return sumReferMoney

    # 装修活动
    def queryDecorationActivityItem(self, orderId):
    
        couponCut = 0
        thingCut = 0
        
        atttype = -1
        multiple = 0

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_ACTIVITY_ITEM % (orderId))
        
        if not infos: return [couponCut, thingCut, atttype, multiple]
        
        for info in infos:
            
            if info[1] == 0: couponCut = info[0]
            if info[1] == 1: thingCut = info[0]
            
            atttype = info[2]
            multiple = info[3]

        return [couponCut, thingCut, atttype, multiple]

    # 款项
    def queryDecorationPayment(self, orderId):

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_PAYMENT % (orderId))
        
        template = [None] * 24
        design = 0 # 应付设计费
        paid = 0 # 实付设计费

        if infos == ():
            return template

        for i, v in enumerate(infos):
            data = list(v)
            self.divNum(data, [2, 5])

            if data[1] == "设计费":
                template[0] = design + float(data[2])
                if data[3] != 0:
                    template[1] = paid + float(data[2])
                    paid = paid + float(data[2])

                design = design + float(data[2])

            if data[1] == "首付款":
                template[2] = int(data[2])
                template[3] = data[4]
                template[4] = data[5]
                template[5] = data[6]

            if data[1] == "首付二期款":
                template[6] = int(data[2])
                template[7] = data[4]
                template[8] = data[5]
                template[9] = data[6]

            if data[1] == "二期款":
                template[10] = int(data[2])
                template[11] = data[4]
                template[12] = data[5]
                template[13] = data[6]

            if data[1] == "尾款":
                template[14] = int(data[2])
                template[15] = data[4]
                template[16] = data[5]
                template[17] = data[6]

            if data[1] == "违约金":
                template[20] = int(data[2])

        return template

    def company(self, columnCompany, company):

        if company != 0:
            companyString = " AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

    def main(self, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_COLLECTER % ("count(*)", startTime, endTime, self.company("d.company", company))
            count = self.count(sqlcount)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            workbook, sheet = self.createWorkbook("shee1")

            sql = self.SQL_EXPORT_DECORATION_COLLECTER % (self.column, startTime, endTime, self.company("d.company", company))

            tableHead = [
                "装修单号", "楼盘名称", "楼号", "预签时间", "签单时间", "决算时间", "订单类型", "订单状态", "房屋类别", "非业务提成",
                "非业务提点", "预签额", "签单额", "实收额", "券优惠", "物品", "操作人编号", "操作人", "操作类型", "部门编号",
                "部门", "分区编号", "分区", "比例", "折扣", "报价总额", "不打折总额", "打折总额", "车运费", "管理费",
                "管理费提点", "管理优惠", "运输费", "业务类型", "业务类型", "建筑面积", "赠送面积", "套内面积", "总面积", "工程状态",
                "监理", "付款比例", "订单等级", "报价员", "房屋类型", "跟单部", "跟单员编号", "跟单员", "方案设计部", "方案设计编号",
                "方案设计", "折前总价", "差额", "业绩差额", "设计费", "设计费状态", "首付款", "收款时间", "券值", "券信息",
                "首付二期款", "收款时间", "券值", "券信息", "二期款", "收款时间", "券值", "券信息", "尾款", "尾款时间",
                "券值", "券信息", "违约金", "预付款余额", "净业绩", "复合业绩", "未付款金额", "措施费", "应收服务费", "税金比例",
                "税金", "主材总额", "纯利", "装修单公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)

                    order_id = rows[0]

                    # Step 1: Update coupon and item fields
                    rows[14], rows[15], atttype, multiple = self.queryDecorationActivityItem(order_id)  # 券优惠, 物品: From activity item query
                    
                    self.divNum(rows, [9, 10, 11, 12, 13, 14, 15, 18, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 41, 51, 52, 53, 54, 55])  # Convert numeric fields to appropriate format
                    
                    rate = rows[23] if rows[23] is not None else 0  # 比例: Handle null rate

                    # Step 2: Apply mappings and fallbacks
                    rows[18] = rows[18] == 0 and '设计' or '业务'  # 操作类型: Map type to readable value
                    rows[15] = rows[15] if atttype != 1 else (rows[15] + rows[13]*multiple/1000)
                    rows[23] = '%d%%' % (rate * 100) if rate else ""  # 比例: Format as percentage

                    # Step 3: Calculate financial metrics
                    order_total_price = float(rows[12]) if rows[12] else 0  # 签单额: From SQL (index 12)
                    precontract_price = float(rows[11]) if rows[11] else 0  # 预签额: From SQL (index 11)
                    not_sales_price = float(rows[9]) if rows[9] else 0  # 非业务提成: From SQL (index 9)
                    coupon_cut = float(rows[14]) if rows[14] else 0  # 券优惠: From queryDecorationActivityItem
                    thing_cut = float(rows[15]) if rows[15] else 0  # 物品: From queryDecorationActivityItem
                    dis_price = float(rows[27]) if rows[27] else 0  # 打折总额: From SQL (index 27)
                    undis_price = float(rows[26]) if rows[26] else 0  # 不打折总额: From SQL (index 26)
                    traffic_price = float(rows[28]) if rows[28] else 0  # 车运费: From SQL (index 28)
                    manage_price = float(rows[29]) if rows[29] else 0  # 管理费: From SQL (index 29)
                    total_before_discount = undis_price + dis_price + manage_price + traffic_price  # 折前总价: Sum of relevant fields
                    difference = order_total_price - precontract_price  # 差额: 签单额 - 预签额
                    net_performance = (order_total_price - not_sales_price - coupon_cut - thing_cut) * rate  # 净业绩: (签单额 - 非业务提成 - 券优惠 - 物品) * 比例
                    presign_net_performance = (precontract_price - not_sales_price - coupon_cut - thing_cut) * rate  # 预签净业绩
                    performance_difference = net_performance - presign_net_performance  # 业绩差额: 净业绩 - 预签净业绩
                    back_cal = dis_price * 0.88 + undis_price + traffic_price + manage_price  # Intermediate calculation for 复合业绩
                    composite_performance = ((back_cal - not_sales_price) * 0.38 - coupon_cut - thing_cut + order_total_price - back_cal) / 0.38 if back_cal else 0  # 复合业绩
                    measure_fee = (undis_price - manage_price) * 0.019 if company == -1 else 0  # 措施费: Conditional on company

                    # Step 4: Process payment data (no reordering)
                    template = self.queryDecorationPayment(order_id)  # Returns 21 fields: 设计费, 设计费状态, 首付款, 收款时间, 券值, 券信息, ...
                    template[21] = self.queryDecorationPaymentForNopay(order_id)  # 未付款金额: Append as index 21
                    template[22] = self.queryAdvancePayment(order_id)  # 预付款余额: Append as index 22
                    template[23] = composite_performance  # 复合业绩: Append as index 23

                    # Step 5: Assign all 81 fields explicitly
                    row = [
                        rows[0],  # 装修单号: From SQL (d.orderId)
                        rows[1],  # 楼盘名称: From SQL (v.name)
                        rows[2],  # 楼号: From SQL (h.houseNumber)
                        rows[3],  # 预签时间: From SQL (d.precontractTime)
                        rows[4],  # 签单时间: From SQL (d.contractTime)
                        rows[5],  # 决算时间: From SQL (d.accountTime)
                        rows[6],  # 订单类型: From SQL (d.typeness) with mapping
                        rows[7],  # 订单状态: From SQL (communion.kv)
                        rows[8],  # 房屋类别: From SQL (d.houseType)
                        not_sales_price,  # 非业务提成: From SQL (calculated)
                        rows[10], # 非业务提点: From SQL (d.notSalesmanRate)
                        rows[11], # 预签额: From SQL (d.precontractPrice)
                        rows[12], # 签单额: From SQL (d.orderTotalPrice)
                        rows[13], # 实收额: From SQL (d.factPrice)
                        rows[14], # 券优惠: From queryDecorationActivityItem
                        rows[15], # 物品: From queryDecorationActivityItem
                        rows[16], # 操作人编号: From SQL (u.userId)
                        rows[17], # 操作人: From SQL (u.currentName)
                        rows[18], # 操作类型: From SQL (db.type) with mapping
                        rows[19], # 部门编号: From SQL (dd.no)
                        rows[20], # 部门: From SQL (dd.name)
                        rows[21], # 分区编号: From SQL (dr.no)
                        rows[22], # 分区: From SQL (dr.name)
                        rows[23], # 比例: From SQL (db.rate) formatted as percentage
                        rows[24], # 折扣: From SQL (q.discount)
                        rows[25], # 报价总额: From SQL (q.totalPrice)
                        rows[26], # 不打折总额: From SQL (q.undisPrice)
                        rows[27], # 打折总额: From SQL (q.disPrice)
                        rows[28], # 车运费: From SQL (q.trafficPrice)
                        rows[29], # 管理费: From SQL (q.managePrice)
                        rows[30], # 管理费提点: From SQL (q.manageRate)
                        rows[31], # 管理优惠: From SQL (qp.managePrefer)
                        rows[32], # 运输费: From SQL (q.trafficPrice)
                        rows[33], # 业务类型: From SQL (busitype.alise)
                        rows[34], # 业务类型: From SQL (busitype.name)
                        rows[35], # 建筑面积: From SQL (h.buildArea)
                        rows[36], # 赠送面积: From SQL (h.freeArea)
                        rows[37], # 套内面积: From SQL (h.innerArea)
                        rows[38], # 总面积: From SQL (h.totalArea)
                        rows[39], # 工程状态: From SQL (d.projectStatus) with mapping
                        rows[40], # 监理: From SQL (supervisor.currentName)
                        rows[41], # 付款比例: From SQL (d.paySacle)
                        rows[42], # 订单等级: From SQL (d.grade)
                        rows[43], # 报价员: From SQL (us.currentName)
                        rows[44], # 房屋类型: From SQL (d.houseClass)
                        rows[45], # 跟单部: From SQL (md.name)
                        rows[46], # 跟单员编号: From SQL (mu.userId)
                        rows[47], # 跟单员: From SQL (mu.currentName)
                        rows[48], # 方案设计部: From SQL (ed.name)
                        rows[49], # 方案设计编号: From SQL (eu.userId)
                        rows[50], # 方案设计: From SQL (eu.currentName)
                        total_before_discount, # 折前总价: Calculated (undis_price + dis_price + manage_price + traffic_price)
                        difference, # 差额: Calculated (order_total_price - precontract_price)
                        performance_difference, # 业绩差额: Calculated (net_performance - presign_net_performance)
                        template[0],  # 设计费: From payment query
                        template[1],  # 设计费状态: From payment query
                        template[2],  # 首付款: From payment query
                        template[3],  # 收款时间: From payment query
                        template[4],  # 券值: From payment query
                        template[5],  # 券信息: From payment query
                        template[6],  # 首付二期款: From payment query 60
                        template[7],  # 收款时间: From payment query
                        template[8],  # 券值: From payment query 62
                        template[9],  # 券信息: From payment query
                        template[10], # 二期款: From payment query 64
                        template[11], # 收款时间: From payment query
                        template[12], # 券值: From payment query 66
                        template[13], # 券信息: From payment query
                        template[14], # 尾款: From payment query 68
                        template[15], # 尾款时间: From payment query
                        template[16], # 券值: From payment query 70
                        template[17], # 券信息: From payment query
                        template[18], # 违约金: From payment query 72
                        template[22], # 预付款余额: From queryAdvancePayment 73
                        net_performance, # 净业绩: Calculated 74
                        composite_performance, # 复合业绩: Calculated 75
                        template[21], # 未付款金额: From queryDecorationPaymentForNopay 76
                        measure_fee, # 措施费: Calculated 77
                        rows[53], # 应收服务费: From SQL (rows[53]) 78
                        rows[51], # 税金比例: From SQL (q.taxRate)
                        rows[52], # 税金: From SQL (q.taxPrice) 80
                        rows[54], # 主材总额: From SQL (dm/dh.materialPrice)
                        rows[55], # 纯利: From SQL (q.unachePrice)
                        rows[56]  # 装修单公司: From SQL (co.name)
                    ]
                    
                    test_list = [9, 10, 11, 12, 13, 14, 15, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 51, 52, 53, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 73, 74, 75, 76, 77, 78, 80, 81, 82]
                    
                    self.rates(row, rate, test_list)

                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage += 1

                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)
        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导出装修签单脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出订单签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_information.py  pid args company
                   plan_export_decoration_order_information.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/03/01-2023/03/30'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
