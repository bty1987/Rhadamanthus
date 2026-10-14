#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class funds_ranking(Util):
    
    def __init__(self, host='', username='', password='', media='', pthost="", charset='utf8'):
        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.flag = True
        self.size = 400

        self.colum = u"""
                    ap.orderId AS '装修单号',
                    ap.balance AS '合同预付款',
                    ap.materialBalance AS '主材预付款',
                    ap.zhenglinBalance AS '正林预付款',
                    ap.projectBalance AS '工程预付款',
                    ap.checked AS '需核对预付款',
                    c.name AS '装修单公司'
                """

        self.SQL_advance_orderId = u"""
            SELECT
                %s
            FROM
                payment.advancepayment ap INNER JOIN payment.payment p ON ap.orderId = p.orderId,
                decoration.decoration d,
                communion.company c
            WHERE
                p.createTime >= '%s 00:00:00' AND
                p.createTime <= '%s 23:59:59' AND
                ap.orderId = d.orderId AND
                d.company = c.cid
                %s
            GROUP BY
                ap.orderId
        """
        self.SQL_advance = u"""SELECT apid, customerId, orderId, balance, materialBalance, zhenglinBalance, projectBalance, company, checked FROM payment.advancepayment where orderId = '%s'"""
        self.SQL_advancePayment = u"""SELECT paymentType, SUM(if(type IN (1, 3), recharge, -recharge)) AS paymentBalance FROM payment.payment WHERE orderId = '%s' AND status in (1, 2) GROUP BY paymentType ORDER BY paymentType"""
        self.SQL_update_advancePayment = u"""UPDATE payment.advancepayment SET checked = %d WHERE orderId = '%s' and checked != 16"""

    def main(self, pid, args):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            timeFlag = self.controlTime(startTime, endTime)
            if timeFlag == False:
                raise RuntimeError(u'时间应在1-31内')

            orderIds = self.executeQuerySQL(self.SQL_advance_orderId % ("ap.orderId", startTime, endTime, ""))

            for i, v in enumerate(orderIds):
                checkNum = 0
                payment = self.executeQuerySQL(self.SQL_advance % v)
                paymentBalance = self.executeQuerySQL(self.SQL_advancePayment % v)

                # 封装payment中得到的各预付款的金额
                self.paymentTypeData(paymentBalance)

                if payment[0][3] != self.advanceData["balance"]:
                    checkNum = checkNum + 1

                if payment[0][4] != self.advanceData["material"]:
                    checkNum = checkNum + 2

                if payment[0][5] != self.advanceData["zhenglin"]:
                    checkNum = checkNum + 4

                if payment[0][6] != self.advanceData["project"]:
                    checkNum = checkNum + 8

                if checkNum > 0:
                    self.cursor.execute(self.SQL_update_advancePayment % (checkNum, v[0]))
                    self.commit()

            # 导出有问题数据
            self.exportData(pid, startTime, endTime)

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

    def paymentTypeData(self, data):
        self.advanceData = {"balance": 0, "project": 0, "material": 0, "zhenglin": 0}
        for i, v in enumerate(data):
            if v[0] == 0:
                self.advanceData["balance"] = v[1]
            if v[0] == 1:
                self.advanceData["project"] = v[1]
            if v[0] == 2:
                self.advanceData["material"] = v[1]
            if v[0] == 3:
                self.advanceData["zhenglin"] = v[1]

    def exportData(self, pid, startTime, endTime):
        sql = self.SQL_advance_orderId % (self.colum, startTime, endTime, u"AND ap.checked > 0")
        self.cursor.execute(sql)
        rows = self.cursor.fetchall()

        if len(rows) == 0:
            raise RuntimeError(u'The query result is zero!')

        all = len(rows) / 0.8
        molecular = all * 0.1
        schedule = (molecular / all) * 100

        plan = {
            u"plan.schedule": schedule,
            u"plan.status": 4
        }

        self.updataSchedule(self.pthost, pid, plan)

        tableHead = [
            u"装修单号", u"合同预付款", u"主材预付款", u"正林预付款", u"工程预付款", u"需核对预付款", u"装修单公司"
        ]

        workbook, sheet = self.createWorkbook(u"sheet1")
        self.createTableHead(sheet, tableHead)

        counts = 1

        for i, v in enumerate(rows):

            data = list(v)
            self.divNum(data, [1, 2, 3, 4])
            self.jointTypeData(data)
            data[5] = self.joinAdvance

            self.createTableHead(sheet, data, counts)
            counts += 1

        molecular = molecular + len(rows)
        schedules = (molecular / all) * 100

        plan = {
            u"plan.schedule": int(schedules)
        }

        self.updataSchedule(self.pthost, pid, plan)

        path = tempfile.gettempdir() + u"/核对预付款.xls"
        self.saveWorkbook(path, workbook)

        url = self.media + u"uploadOther.do"
        resultfilepath = self.uploudFile(path, url)

        self.delFile(path)

        plan = {
            u"plan.resultFilepath": resultfilepath
        }

        self.updataSchedule(self.pthost, pid, plan)

    def jointTypeData(self, data):
        advanceType = [[1, "合同预付款"], [2, "主材预付款"], [4, "正林预付款"], [8, "工程预付款"]]

        self.joinAdvance = ""
        for i, v in enumerate(advanceType):
            if((data[5]&v[0]) > 0):
                self.joinAdvance = "%s/%s" % (self.joinAdvance, v[1])


if __name__ == '__main__':
    """
            核对预付款脚本说明:
            根据查询条件, 核对advancePayment中余额与payment中明细剩余, 标记金额不匹配数据并导出;

            1.参数说明参数要对应
                1.pid        计划id 2685
                2.args       "2020/10/15-2020/10/25"
                
            2.脚本传参说明:
                 plan_check_payment_advance.py pid args
                 plan_check_payment_advance.py 2685 "2020/10/15-2020/10/25"

            3.注:
                1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]

    funds_ranking = funds_ranking(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    funds_ranking.main(pid, args)
