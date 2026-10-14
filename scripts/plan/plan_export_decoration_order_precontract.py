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
            d.orderId AS `编号`,
            v.`name` AS `楼盘名称`,
            h.houseNumber AS `楼号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间`,
            d.accountTime AS `决算时间`,
            d.typeness AS `订单类型`,
            d.`status` AS `订单状态`,
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
            ddept.no AS `部门编号`,
            ddept.name AS `部门`,
            ddeptfa.no AS `分区编号`,
            ddeptfa.name AS `分区`,
            db.rate AS `比例`,
            q.discount AS `折扣`,
            q.totalPrice AS `报价总额`,
            q.undisPrice AS `不打折总额`,
            q.disPrice AS `打折总额`,
            q.trafficPrice AS `车运费`,
            q.managePrice AS `管理费`,
            q.manageRate AS `管理费提点`,
            q.trafficPrice AS `运输费`,
            busitype.name AS `业务类型`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea  AS `套内面积`,
            h.totalArea AS `总面积`,
            d.projectStatus AS `工程状态`,
            supervisor.currentName AS `监理`,
            d.paySacle AS `付款比例`,
            d.grade AS `装修单等级`,
            us.currentName AS `报价员`,
            d.houseClass AS `房屋类型`,
            ed.name AS `方案设计部`,
            eu.userId AS `方案设计编号`,
            eu.currentName AS `方案设计`,
            p.totalPrice AS `总额`,
            p.preferPrice AS `优惠价`,
            p.managePrice AS `管理费`,
            p.manageProfit AS `管理费优惠`,
            p.taxRate AS `税金比例`,
            p.taxPrice AS `税金`,
            q.unachePrice AS `纯利`,
            co.name AS `公司`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = """
            SELECT
                %s
            FROM
                decoration.decoration AS d 
                LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId AND db.status = 0)
                LEFT JOIN quotation.quotation AS q ON (d.orderId = q.orderId AND q.defaults = 1)
                LEFT JOIN quotation.protation AS p ON (d.orderId = p.orderId AND p.defaults = 1)
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS supervisor ON d.svuid = supervisor.uid 
                LEFT JOIN communion.user AS us ON d.quid = us.uid 
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.department AS ed ON eu.deptid = ed.did
                LEFT JOIN communion.user AS u ON db.buid = u.uid
                LEFT JOIN communion.department AS ddept ON db.did = ddept.did
                LEFT JOIN communion.department AS ddeptfa ON ddept.fdid = ddeptfa.did
                LEFT JOIN data.decorationbusitype AS busitype ON busitype.dbid = d.busitype
                LEFT JOIN communion.company AS co ON d.company = co.cid
            WHERE 
                d.precontractTime >= '%s 00:00:00' AND
                d.precontractTime <= '%s 23:59:59' 
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

        self.SQL_EXPORT_PAYMENT_ADVANCE = """
           SELECT
                decoration.orderId AS `订单编号`,
                advancepayment.balance AS `预付款`
            FROM
                decoration.decoration AS decoration,
                payment.advancepayment AS advancepayment 
            WHERE
                decoration.orderId = advancepayment.orderId 
                AND decoration.orderId = '%s' 
        """
        
        self.SQL_QUERY_DECORATION_PAYMENT_NOPAY = """
           SELECT
               orderId, SUM(referMoney)
           FROM
               payment.decorationpayment
           WHERE
               paymentStatus = 0
               AND onetype = 0
               AND twotype = 1
               AND orderId= '%s'
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
                sum(num*money)/1000, type 
            FROM 
                decoration.decorationactivityitem 
            WHERE 
                orderId = '%s' AND 
                state in (0,2,4,5,6) AND 
                isprefor = 0
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
    def queryBalanceByOrder(self, orderId):

        infos = self.executeQuerySQL(self.SQL_EXPORT_PAYMENT_ADVANCE % (orderId))
        
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

    # 款项
    def queryDecorationPayment(self, orderId):

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_PAYMENT % (orderId))
        
        template = [None] * 22
        design = 0
        paid = 0

        if infos != ():
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

    # 装修活动
    def queryDecorationActivityItem(self, orderId):
    
        couponCut = 0
        thingCut = 0;

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_ACTIVITY_ITEM % (orderId))
        
        if not infos: return [couponCut, thingCut]
        
        for info in infos:
            
            if info[1] == 0: couponCut = info[0]
            if info[1] == 1: thingCut = info[0]

        return [couponCut, thingCut]

    def company(self, columnCompany, company):
    
        if company != 0:
            companyString = "AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

    def statisticalServicePrice(self, orderId):

        self.cursor.execute(self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE % (orderId))

        data = self.cursor.fetchall()

        if data and data[0]:
            return float(data[0][0]) / 1000

        return 0

    def main(self, pid, args, company):
    
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)
            
            self.constructionnode(company)

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
                "非业务提点", "预签额", "签单额", "实收额", "券优惠", "物品优惠", "操作人编号", "操作人", "操作类型", "部门编号",
                "部门", "分区编号", "分区", "比例", "折扣", "报价总额", "不打折总额", "打折总额", "车运费", "管理费",
                "管理费提点", "运输费", "业务类型", "建筑面积", "赠送面积", "套内面积", "总面积", "工程状态", "监理", "付款比例",
                "订单等级", "报价员", "房屋类型", "方案设计部", "方案设计编号", "方案设计", "总额", "差额", "业绩差额", "应付设计费", 
                "实付设计费", "首付款", "收款时间", "券值", "券信息", "首付二期款", "收款时间", "券值", "券信息", "二期款", 
                "收款时间", "券值", "券信息", "尾款", "尾款时间", "券值", "券信息", "违约金", "预付款余额", "净业绩", 
                "复合业绩", "未付款金额", "措施费", "应收服务费", "优惠价", "预签管理费", "预签管理优惠", "税金比例", "税金", "主材额", 
                "纯利", "公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True
            servicePrice = 0  # 应收服务费

            while pageflag:

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)

                    if rows[40] is None: rows[40] = rows[11]
                    
                    rows[14], rows[15] = self.queryDecorationActivityItem(rows[0])

                    self.divNum(rows, [9, 10, 11, 12, 13, 14, 15, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 46, 47, 48, 49, 50, 51, 52])

                    rates = float(rows[23])
                    orderId = rows[0]  # 订单号
                    type = rows[6]  # 订单类型
                    status = rows[7] # 订单状态
                    rows[23] = '%d%%' % (rows[23] / 1 * 100)
                    rows[9] = int(rows[9])

                    rows[37] = self.projectStatus[rows[37]]

                    rows[6] = self.decorationType[rows[6]]
                    rows[7] = self.decorationStatus[rows[7]]
                    rows[18] = self.decorationbelongType[rows[18]]

                    if type == 2:
                        servicePrice = self.statisticalServicePrice(orderId)
                    else:
                        servicePrice = 0

                    # 差额 = 签单额 - 预签额
                    rows.append(rows[12] - rows[11])
                    rows.append("") # 业绩差额

                    template = self.queryDecorationPayment(rows[0])
                    template[18] = self.queryDecorationPaymentForNopay(rows[0])  # 未付款
                    template[19] = self.queryBalanceByOrder(rows[0])  # 已付款 预付款余额

                    price = rows[46] if status not in (3, 7) else rows[12]

                    # 净业绩 = 总额(签单/决算使用签单额,否则不变)- 非提金额 - 券优惠 - 物品优化
                    template[21] = int(price) - int(rows[9]) - int(rows[14]) - int(rows[15])

                    template = [
                        template[0], template[1], template[2], template[3], template[4], template[5],
                        template[6], template[7], template[8], template[9], template[10], template[11],
                        template[12], template[13], template[14], template[15], template[16], template[17],
                        template[20], template[19], template[21], " ", template[18], " "
                    ]

                    template.append(servicePrice)  # 应收服务费
                    template.append(rows[47])  # 优惠价
                    template.append(rows[48])  # 管理费
                    template.append(rows[49])  # 管理费优惠
                    template.append(rows[50])  # 税金比例
                    template.append(rows[51])  # 税金
                    template.append(0)  # 主材额
                    template.append(rows[52])  # 纯利
                    template.append(rows[53])  # 公司

                    row = rows[0:47] + rows[54:] + template

                    test_list = [11, 12, 13, 14, 15, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 46, 47, 50, 69, 71, 73, 74, 75, 76, 77, 78, 79, 80]

                    self.rates(row, rates, test_list)

                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage = nowPage + 1

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
        导出装修预签脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出订单预签信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_precontract.py  pid args company
                   plan_export_decoration_order_precontract.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]
    
    # pid = 3625
    # args = "2023/10/01-2023/10/30"
    # company = 1


    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))
