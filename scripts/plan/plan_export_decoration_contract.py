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
            d.orderId AS `订单编号`,
            v.`name` AS `楼盘名称`,
            h.buildArea AS `面积`,
            d.contractTime AS `签单时间`,
            cc.keyTime AS `预计交钥匙时间`,
            cc.finishTime AS `预计竣工时间`,
            cc.drawlineTime AS `预计放线时间`,
            dl.actualTime AS `放线时间`,
            communion.kv ( 'decoration', 'decoration', 'typeness', d.typeness ) AS `订单类型`,
            d.projectStatus AS `工程状态`,
            d.factPrice AS `实收额`,
            us.currentName AS `设计师`,
            ddept. NAME AS `设计部`,
            ddeptfa. NAME AS `设计分区`,
            d.paySacle AS `付款比例`,
            dh.materialPrice AS `主材应收款`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.`user` AS us ON d.dsuid = us.uid
                LEFT JOIN construction.constructioninfo AS cc ON d.orderId = cc.orderId
                LEFT JOIN construction.drawline AS dl ON d.orderId = dl.orderId
                LEFT JOIN decoration.decorationholonomy AS dh ON d.orderId = dh.orderId,
                communion.house AS h,
                communion.village AS v,
                communion.`user` AS u,
                decoration.decorationbelong AS db,
                communion.department AS ddept
                LEFT JOIN communion.department AS ddeptfa ON ddept.fdid = ddeptfa.did
            WHERE 
                d.orderId = db.orderId AND
                db.did = ddept.did AND 
                d.hid = h.hid AND 
                h.vid = v.vid AND 
                db.buid = u.uid AND 
                d.company = %s AND 
                d.contractTime >= '%s 00:00:00' AND 
                d.contractTime <= '%s 23:59:59' AND 
                db.`status` = 0 AND 
                db.defaultFlag = 1
        """

        self.SQL_QUERY_DECORATIONPAYMENT = u"""
            SELECT
                dp.orderId AS `订单编号`,
                dp.paymentType AS `款项类型`,
                dp.referMoney AS `金额`,
                dp.paymentStatus AS `状态`,
                dr.collectTime AS `交款时间`
            FROM
                payment.decorationpayment AS dp 
                LEFT JOIN payment.decorationreceipt AS dr on dp.drid = dr.drid
            WHERE
                dp.orderId = '%s'
        """

        self.SQL_QUERY_ADVANCEPAYMENT = u"""
            SELECT
                decoration.orderId AS `订单编号`,
                advancepayment.balance AS `预付款`,
                advancepayment.materialBalance AS `主材预付款`
            FROM
                decoration.decoration AS decoration ,
                payment.advancepayment AS advancepayment
            WHERE
                decoration.customerId = advancepayment.customerId AND 
                decoration.orderId = '%s' AND 
                decoration.company = %s AND 
                advancepayment.company = %s
        """

        self.SQL_QUERY_SALESPAYMENT = u"""
            SELECT
                sales.sales.orderId,
                SUM(
                    IF (
                        payment.salespayment.type IN (4, 5, 6, 7) ,- payment.salespayment.referMoney,
                        payment.salespayment.referMoney
                    )
                )money
            FROM
                payment.salespayment,
                sales.sales
            WHERE
                sales.sales.sid = payment.salespayment.sid AND
                payment.salespayment.`status` IN (1, 2) AND
                sales.sales.orderId = '%s'
        """


    # 已付款
    def queryBalanceByOrder(self, orderId, company):
    
        sql_advance = self.SQL_QUERY_ADVANCEPAYMENT % (orderId, company, company)
        advance_Date = self.executeQuerySQL(sql_advance)
        template = [None] * 2
        
        if advance_Date != ():
            data = list(advance_Date[0])
            self.divNum(data, [1, 2])
            template[0] = data[1]
            template[1] = data[2]
        else:
            template[0] = 0
            template[1] = 0

        return template

    # 未付款
    def queryNoPaymentByOrderForDecorationPayment(self, orderId):
    
        sql_noPayment = self.SQL_QUERY_SALESPAYMENT % (orderId)
        noPayment_Date = self.executeQuerySQL(sql_noPayment)

        if noPayment_Date[0][0] != None and noPayment_Date[0][1] != None:
            data = list(noPayment_Date[0])
            self.divNum(data, [1])
            sumReferMoney = data[1]
        else:
            sumReferMoney = 0

        return sumReferMoney

    # 款项
    def queryDecorationPaymentByOrder(self, orderId):
    
        sql_decorationPayment = self.SQL_QUERY_DECORATIONPAYMENT % (orderId)

        decorationPayment_Date = self.executeQuerySQL(sql_decorationPayment)
        template = [None] * 8

        if decorationPayment_Date != ():
            for i, v in enumerate(decorationPayment_Date):
                data = list(v)
                self.divNum(data, [2])

                if data[1] == u"首付款":
                    template[0] = int(data[2])
                    template[1] = data[4]

                if data[1] == u"首付二期款":
                    template[2] = int(data[2])
                    template[3] = data[4]

                if data[1] == u"二期款":
                    template[4] = int(data[2])
                    template[5] = data[4]

                if data[1] == u"尾款":
                    template[6] = int(data[2])
                    template[7] = data[4]

            return template
        else:
            return template

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

            workbook, sheet = self.createWorkbook(u"shee1")

            sql = self.SQL_EXPORT_DECORATION_COLLECTER % (self.column, company, startTime, endTime)

            tableHead = [
                u"订单编号", u"楼盘名称", u"面积", u"签单时间", u"预计交钥匙时间", u"预计放线时间", u"放线时间", u"预计竣工时间", u"订单类型", u"工程状态",
                u"实收额", u"设计师", u"设计部", u"设计分区", u"付款比例", u"主材应付款", u"首付款", u"收款时间", u"首付二期款", u"收款时间",
                u"二期款", u"收款时间", u"尾款", u"收款时间", u"合同预付款", u"主材预付款", u"主材实收款"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):
                    rows = list(v)
                    self.divNum(rows, [2, 10, 15])

                    rows[9] = self.projectStatus[rows[9]]

                    template = self.queryDecorationPaymentByOrder(rows[0])

                    advance = self.queryBalanceByOrder(rows[0], company)
                    material = self.queryNoPaymentByOrderForDecorationPayment(rows[0])

                    template=[template[0],template[1],template[2],template[3],template[4],template[5],template[6],template[7],advance[0],advance[1],material]
                    row = rows + template

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
        签单管理明细脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出签单管理明细;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_contract.py  pid args company
                   plan_export_decoration_contract.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]
    
    # pid = 299
    # args = "2023/09/01-2023/09/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"),dbconf.get("password"), config.get("media"),config.get("pthost"))
    exporter.main(pid, args, company)
