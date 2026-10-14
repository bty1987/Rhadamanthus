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

        self.column = u"""
            d.orderId AS `编号`,
            v.`name` AS `楼盘名称`,
            h.houseNumber AS `楼号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间(预签)`,
            d.contractTime AS `签单时间(签单)`,
            d.accountTime AS `决算时间`,
            d.typeness AS `订单类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `订单状态`,
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
            us.currentName AS `报价员名称`,
            d.houseClass AS `房屋类型`,
            eu.currentName AS `跟单员`,
            dh.materialPrice AS `主材总额`,
            q.taxRate AS `税金比例`,
            q.taxPrice AS `税金金额`,
            co.name AS `公司`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.`user` AS supervisor ON d.svuid = supervisor.uid 
                LEFT JOIN communion.`user` AS us ON d.quid = us.uid 
                LEFT JOIN communion.`user` AS eu ON d.euid = eu.uid
                LEFT JOIN decoration.decorationholonomy dh on d.orderId = dh.orderId,
                payment.decorationpayment AS dp,
                communion.house AS h,
                communion.village AS v,
                communion.`user` AS u,
                quotation.quotation AS q,
                decoration.decorationbelong AS db,
                data.decorationbusitype AS busitype,
                communion.department AS ddept LEFT JOIN communion.department AS ddeptfa on ddept.fdid = ddeptfa.did,
                communion.company co
            WHERE 
                d.orderId = db.orderId
                AND db.did = ddept.did
                AND d.hid = h.hid 
                AND h.vid = v.vid 
                AND db.buid = u.uid
                AND d.orderId = q.orderId
                AND busitype.dbid = d.busitype
                AND d.company = co.cid
                AND d.orderId = dp.orderId 
                AND dp.paymenttype = '合同退款'
                AND dp.createTime >= '%s 00:00:00' 
                AND dp.createTime <= '%s 23:59:59'
                AND q.defaults = 1
                AND db.`status` = 0
                %s
        """

        self.SQL_EXPORT_DECORATION_PAYMENT = u"""
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
                LEFT JOIN payment.decorationreceipt AS decorationreceipt on decorationpayment.drId = decorationreceipt.drId
            WHERE
                decorationpayment.orderId = '%s'
        """

        self.SQL_EXPORT_DECORATION_ADVANCE = u"""
           SELECT
               decoration.orderId AS `订单编号`,
               advancepayment.balance AS `预付款`
           FROM
               decoration.decoration AS decoration ,
               payment.advancepayment AS advancepayment
           WHERE
               decoration.orderId = advancepayment.orderId
               AND decoration.orderId = '%s'
        """

        self.noPayment = u"""
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

        self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE = u"""
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

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    # 已付款
    def queryBalanceByOrder(self, orderId):
        sql_advance = self.SQL_EXPORT_DECORATION_ADVANCE % (orderId)
        advance_Date = self.executeQuerySQL(sql_advance)
        if advance_Date != ():
            data = list(advance_Date[0])
            self.divNum(data, [1])
            balance = data[1]
        else:
            balance = 0

        return balance

    # 未付款
    def queryNoPaymentByOrderForDecorationPayment(self, orderId):
        sql_noPayment = self.noPayment % (orderId)
        noPayment_Date = self.executeQuerySQL(sql_noPayment)

        if noPayment_Date[0][0] != None and noPayment_Date[0][1] != None:
            data = list(noPayment_Date[0])
            self.divNum(data, [1])
            sumReferMoney = int(data[1])
        else:
            sumReferMoney = ""

        return sumReferMoney

    # 款项
    def queryDecorationPaymentByOrder(self, orderId):
        sql_decorationPayment = self.SQL_EXPORT_DECORATION_PAYMENT % (orderId)

        decorationPayment_Date = self.executeQuerySQL(sql_decorationPayment)
        template = [None] * 24
        design = 0 # 应付设计费
        paid = 0 # 实付设计费

        if decorationPayment_Date != ():
            for i, v in enumerate(decorationPayment_Date):
                data = list(v)
                self.divNum(data, [2, 5])

                if data[1] == u"设计费":
                    template[0] = design + float(data[2])
                    if data[3] != 0:
                        template[1] = paid + float(data[2])
                        paid = paid + float(data[2])

                    design = design + float(data[2])

                if data[1] == u"首付款":
                    template[2] = int(data[2])
                    template[3] = data[4]
                    template[4] = data[5]
                    template[5] = data[6]

                if data[1] == u"首付二期款":
                    template[6] = int(data[2])
                    template[7] = data[4]
                    template[8] = data[5]
                    template[9] = data[6]

                if data[1] == u"二期款":
                    template[10] = int(data[2])
                    template[11] = data[4]
                    template[12] = data[5]
                    template[13] = data[6]

                if data[1] == u"尾款":
                    template[14] = int(data[2])
                    template[15] = data[4]
                    template[16] = data[5]
                    template[17] = data[6]

                if data[1] == u"违约金":
                    template[20] = int(data[2])

            return template
        else:
            return template

    def statisticalServicePrice(self, orderId):
        sql = self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE % (orderId)
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        if data:
            if data[0]:
                return float(data[0][0]) / 1000
        return 0

    def company(self, columnCompany, company):
        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def main(self, pid, args, company):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            self.constructionnode(company)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_COLLECTER % (u"count(*)", startTime, endTime, self.company("d.company", company))
            count = self.count(sqlcount)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            workbook, sheet = self.createWorkbook(u"shee1")

            sql = self.SQL_EXPORT_DECORATION_COLLECTER % (self.column, startTime, endTime, self.company("d.company", company))

            tableHead = [
                u"编号", u"楼盘名称", u"楼号", u"预签时间", u"签单时间(预签)", u"签单时间(签单)", u"决算时间", u"订单类型", u"订单状态", u"房屋类别",
                u"非业务提成", u"非业务提点", u"预签额", u"签单额", u"实收额", u"券优惠", u'物品', u"操作人编号", u"操作人", u"操作类型",
                u"部门编号", u"部门", u"分区编号", u"分区", u"比例", u"折扣", u"报价总额", u"不打折总额", u"打折总额", u"车运费",
                u"管理费", u"管理费提点", u"运输费", u"业务类型", u"建筑面积", u"赠送面积", u"套内面积", u"总面积", u"工程状态", u"监理",
                u"付款比例", u"订单等级", u"报价员", u"房屋类型", u"跟单员", u"税金比例", u"税金金额", u"折前总价", u"差额", u"业绩差额",
                u"应付设计费", u"实付设计费", u"首付款", u"收款时间", u"券值", u"券信息", u"首付二期款", u"收款时间", u"券值", u"券信息",
                u"二期款", u"收款时间", u"券值", u"券信息", u"尾款", u"尾款时间", u"券值", u"券信息", u"违约金", u"预付款余额",
                u"净业绩", u'复合业绩', u"未付款金额", u"措施费", u"应收服务费", u"主材总额", u"公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):

                    rows = list(v)

                    self.divNum(rows, [10, 11, 12, 13, 14, 15, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 45, 46, 47])

                    orderId = rows[0]  # 订单号
                    type = rows[7] # 订单类型
                    disPrice = float(rows[28]) # 打折总额
                    undisPrice = float(rows[27]) # 不打折总额
                    trafficPrice = float(rows[29]) # 车运费
                    managePrice = float(rows[30]) # 管理费

                    orderTotalPrice = float(rows[13]) # 签单总额
                    notSalesPrice = float(rows[10]) # 非提金额  非业务人员提点金额=管理费/（管理费比例+非业务提点比例）*非业务提点比例
                    couponCut = float(rows[15]) # 券优惠
                    thingCut = float(rows[16]) # 物品优惠

                    rates = float(rows[24])

                    rows[4] = rows[3] if rows[3] else rows[4] #签单时间(预签)
                    rows[7] = self.decorationType[rows[7]]
                    rows[19] = self.decorationbelongType[rows[19]]
                    rows[24] = '%d%%' % (rows[24] / 1 * 100)
                    rows[38] = self.projectStatus[rows[38]]
                    rows[45] = rows[45] if rows[45] else 0 #主材总额

                    template = self.queryDecorationPaymentByOrder(rows[0])
                    template[18] = self.queryNoPaymentByOrderForDecorationPayment(rows[0]) # 未付款
                    template[19] = self.queryBalanceByOrder(rows[0])  # 已付款

                    if type in [2, 3, 4]:
                        servicePrice = self.statisticalServicePrice(orderId)
                    else:
                        servicePrice = 0

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
                    if company == 1:
                        template[23] = (undisPrice - managePrice) * 0.019
                    else:
                        template[23] = 0

                    template = [template[0], template[1], template[2], template[3], template[4], template[5],
                                template[6], template[7], template[8], template[9], template[10], template[11],
                                template[12], template[13], template[14], template[15], template[16], template[17],
                                template[20], template[19], template[21], template[22], template[18], template[23]]

                    template.append(servicePrice) # 应收服务费
                    template.append(rows[45]) # 主材服务费
                    template.append(rows[48]) # 公司

                    row = rows[0:45] + rows[46:48] + rows[49:] + template

                    test_list = [12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30, 34, 35, 36, 37, 46, 47, 48, 49, 51, 71, 72, 74, 75]

                    self.rates(row, rates, test_list)

                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage = nowPage + 1

                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                u"plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)

            sys.exit(0)
if __name__ == '__main__':

    """
        导出装修终止信息脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出订单签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_terminal.py  pid args company
                   plan_export_decoration_order_terminal.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 4493
    # args = '2022/11/01-2022/11/30'
    # company = 1
    
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
