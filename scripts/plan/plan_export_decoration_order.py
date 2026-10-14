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
            decoration.decoration.orderId AS `编号`,
            CONCAT(village.name, house.houseNumber) AS `楼盘地址`,
            decoration.decoration.contractTime AS `签单时间`,
            decoration.decoration.accountTime AS `决算时间`,
            communion.kv ( 'decoration', 'decoration', 'typeness', decoration.decoration.typeness) AS '订单类型',
            decoration.decoration.houseType AS '房屋类别',
            communion.kv('decoration', 'decoration', 'status', decoration.decoration.status) AS '状态',
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            decoration.decoration.notSalesmanRate AS `非业务员提点`,
            decoration.decoration.orderTotalPrice AS `签单额`,
            belong.userId AS `操作人编号`,
            belong.currentName AS `操作人`,
            IF(decorationbelong.type = 0, '设计', '业务') AS '操作类型',
            belongdept.no AS `部门编号`,
            belongdept.name AS `部门`,
            belongdeptfa.no AS `分区编号`,
            belongdeptfa.name AS `分区`,
            decoration.decorationbelong.rate AS `比例`,
            quotation.discount AS `折扣`,
            quotation.totalPrice AS `报价总额`,
            quotation.undisPrice AS `不打折总额`,
            quotation.disPrice AS `打折总额`,
            quotation.trafficPrice AS `车运费`,
            quotation.managePrice AS `管理费`,
            quotation.manageRate AS `管理费提点`,
            quotation.trafficPrice AS `运输费`,
            decoration.decoration.salesmanType AS `业务类型`,
            house.buildArea AS `建筑面积`,
            house.freeArea AS `赠送面积`,
            house.innerArea  AS `套内面积`,
            house.totalArea AS `总面积`,
            supervisor.currentName AS `监理`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS decoration
                LEFT JOIN communion.`user` AS supervisor ON decoration.svuid = supervisor.uid,
                communion.village AS village,
                decoration.decorationbelong AS decorationbelong,
                quotation.quotation AS quotation,
                communion.house AS house,
                communion.`user` AS belong,
                communion.department AS belongdept LEFT JOIN 
                communion.department AS belongdeptfa on belongdept.fdid = belongdeptfa.did
            WHERE
                decoration.orderId = decorationbelong.orderId AND 
                decorationbelong.did = belongdept.did AND 
                decorationbelong.buid = belong.uid AND 
                decoration.hid = house.hid AND 
                house.vid = village.vid AND 
                decoration.orderId = quotation.orderId AND 
                decoration.status in (2, 6) AND 
                decorationbelong.status = 0 AND 
                quotation.defaults = 1 AND 
                decoration.company = %s AND 
                decoration.contractTime >= '%s 00:00:00' AND 
                decoration.contractTime <= '%s 23:59:59'
        """

        self.SQL_QUERY_ADVANCEPAYMENT = u"""
            SELECT
                decoration.orderId AS `订单编号`,
                advancepayment.balance AS `预付款`
            FROM
                decoration.decoration AS decoration ,
                payment.advancepayment AS advancepayment
            WHERE
                decoration.customerId = advancepayment.customerId AND 
                decoration.orderId = '%s' AND 
                decoration.company = %s AND 
                advancepayment.company = %s
        """

        self.SQL_QUERY_ADDREDUCE = u"""
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

        self.SQL_QUERY_DECORATIONPAYMENT = u"""
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
                LEFT JOIN payment.decorationreceipt AS decorationreceipt on decorationpayment.drId = decorationreceipt.drId,
                decoration.decoration AS decoration 
            WHERE
                decorationpayment.orderId = '%s' AND 
                decoration.company = %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):

        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    #已付款
    def queryBalanceByOrder(self, orderId, company):
    
        sql_advance = self.SQL_QUERY_ADVANCEPAYMENT % (orderId, company, company)
        
        advance_Date = self.executeQuerySQL(sql_advance)

        if advance_Date != ():
            data = list(advance_Date[0])
            self.divNum(data, [1])
            balance = data[1]
        else:
            balance = 0

        return balance

    #款项
    def queryDecorationPaymentByOrder(self, orderId, company):
    
        sql_decorationPayment = self.SQL_QUERY_DECORATIONPAYMENT % (orderId, company)

        decorationPayment_Date = self.executeQuerySQL(sql_decorationPayment)

        if decorationPayment_Date != ():

            template = [None] * 22
            paymentStatusName = {
                0: "初始",
                1: "已付款",
                2: "已确认",
                3: "审批中",
                4: "历史"
            }

            for i, v in enumerate(decorationPayment_Date):
                datas = list(v)
                self.divNum(datas , [2, 5])
                paymentType = datas[1]  # 款项类型,
                referMoney = datas[2]  # 金额,
                paymentStatus = int(datas[3])  # 状态,0:初始, 1:已付款, 2:已确认 , 3: 审批中 , 4: 历史
                collectTime = datas[4]  # 交款时间,
                coupon = datas[5]  # 券值,
                couponInfo = datas[6]  # 券信息

                if paymentType == u"设计费":
                    template[0] = int(referMoney)
                    template[1] = paymentStatusName[paymentStatus]

                if paymentType == u"首付款":
                    template[2] = int(referMoney)
                    template[3] = collectTime
                    template[4] = coupon
                    template[5] = couponInfo

                if paymentType == u"首付二期款":
                    template[6] = int(referMoney)
                    template[7] = collectTime
                    template[8] = coupon
                    template[9] = couponInfo

                if paymentType == u"二期款":
                    template[10] = int(referMoney)
                    template[11] = collectTime
                    template[12] = coupon
                    template[13] = couponInfo

                if paymentType == u"尾款":
                    template[14] = int(referMoney)
                    template[15] = collectTime
                    template[16] = coupon
                    template[17] = couponInfo

                if paymentType == u"违约金":
                    template[20] = int(referMoney)

            return template

    #未付款
    def queryNoPaymentByOrderForDecorationPayment(self, orderId):
    
        sql_noPayment = self.SQL_QUERY_ADDREDUCE % (orderId)
        
        noPayment_Date = self.executeQuerySQL(sql_noPayment)

        if noPayment_Date != () and noPayment_Date[0][1] != None:
            data = list(noPayment_Date[0])
            self.divNum(data, [1])
            sumReferMoney = int(data[1])
        else:
            sumReferMoney = ""

        return sumReferMoney

    def main(self, pid, args, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_COLLECTER % ("count(*)", company, startTime, endTime)

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

            sql = self.SQL_EXPORT_DECORATION_COLLECTER % (self.column, company, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"shee1")

            tableHead = [
                u"编号", u"楼盘地址", u"签单时间", u"决算时间", u"订单类型", u"房屋类别", u"订单状态", u"非业务提成", u"非业务提点", u"签单额", u"操作人编号", u"操作人",
                u"操作类型", u"部门编号", u"部门", u"分区编号", u"分区", u"比例", u"折扣", u"报价总额", u"不打折总额", u"打折总额", u"车运费", u"管理费",
                u"管理费提点", u"运输费", u"业务类型",u"建筑面积", u"赠送面积", u"套内面积", u"总面积", u"监理", u"设计费", u"设计费状态", u"首付款", u"收款时间", u"券值", u"券信息", u"首付二期款", u"收款时间",
                u"券值", u"券信息",u"二期款", u"收款时间", u"券值", u"券信息", u"尾款", u"尾款时间", u"券值", u"券信息", u"违约金", u"预付款余额", u"净业绩", u"未付款金额"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)
                    self.divNum(rows, [7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30])

                    #比例
                    rates = rows[17] / 1 * 100
                    rows[17] = '%d%%' % rates

                    template = self.queryDecorationPaymentByOrder(rows[0], company)
                    template[18] = self.queryNoPaymentByOrderForDecorationPayment(rows[0])#未付款
                    template[19] = self.queryBalanceByOrder(rows[0], company)#已付款

                    # 净业绩
                    performance = int(rows[9]) - int(rows[7])
                    template[21] = performance

                    if type(template[18]) == float:
                        unpaidAmount = int(template[18])
                    else:
                        unpaidAmount = template[18]

                    template = (template[0], template[1], template[2], template[3], template[4], template[5], template[6], template[7], template[8], template[9], template[10], template[11],
                    template[12], template[13], template[14], template[15], template[16], template[17], template[20], int(template[19]), template[21], unpaidAmount )

                    rows = tuple(rows) + tuple(template)

                    self.createTableHead(sheet, rows, count)
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
        订单签单信息脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出订单签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order.py  pid args company
                   plan_export_decoration_order.py  299 2018/11/01-2018/11/30 1
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
