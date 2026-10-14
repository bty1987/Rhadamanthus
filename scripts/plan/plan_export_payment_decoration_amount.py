#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Ranker(Util):

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
        self.list = []
        self.size = 400

        self.DECORATION_COLUMN = u"""
            d.orderId AS `订单编号`,
            CONCAT(v.NAME, ' ', h.houseNumber) AS `楼盘地址`,
            d.contractTime AS `签单时间`,
            d.accountTime AS `决算时间`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `装修单状态`,
            d.projectStatus AS `工程状态`,
            d.orderTotalPrice AS `签单额`,
            d.thingCut AS `物品`,
            d.factPrice AS `实收额`
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
              FROM
                decoration.decoration d,
                communion.village v,
                communion.house h
              WHERE
                d.accountTime >= '%s 00:00:00' AND
                d.accountTime <= '%s 23:59:59' AND 
                d.hid = h.hid AND 
                h.vid = v.vid 
                %s
            """

        self.SQL_DECORATIONPAYMENT_INFO = u"""
            SELECT
                dp.paymentType AS `款项类型`,
                dr.collectTime AS `收款时间`,
                dp.onetype AS `一类`,
                dp.twotype AS `二类`,
                dp.referMoney AS `实付金额`
            FROM
                payment.decorationpayment dp,
                payment.decorationreceipt dr
            WHERE
                dp.drid = dr.drId AND
                orderId = '%s' AND
                paymentstatus IN (1, 2, 4)
                ORDER BY dr.collectTime DESC 
        """

    def company(self, cloumCompany, company):
        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "

        return companyId

    def paymentData(self, orderId):
        paymentSql = self.SQL_DECORATIONPAYMENT_INFO % (orderId)

        decorationPayments = self.executeQuerySQL(paymentSql)

        template = [None] * 14

        refundAmount = 0
        refundTime = None
        addReduceAmount = 0
        addReduceTime = None
        otherAmount = 0
        total = 0

        if decorationPayments != ():
            for i, v in enumerate(decorationPayments):
                data = list(v)

                self.divNum(data, [4])

                if data[0] == u"首付款":
                    template[0] = data[4]
                    template[1] = data[1]
                    total = total + data[4]

                if data[0] == u"首付二期款":
                    template[2] = data[4]
                    template[3] = data[1]
                    total = total + data[4]

                if data[0] == u"二期款":
                    template[4] = data[4]
                    template[5] = data[1]
                    total = total + data[4]

                if data[0] == u"尾款":
                    template[6] = data[4]
                    template[7] = data[1]
                    total = total + data[4]

                if data[2] == 1 and  data[3] == 2: # 减项款退款
                    refundAmount = refundAmount + data[4]

                    if refundTime == None:
                        refundTime = data[1]

                if data[2] == 0 and data[3] == 2: # 增项款
                    addReduceAmount = addReduceAmount + data[4]

                    if addReduceTime == None:
                        addReduceTime = data[1]

                if data[3] == 3: # 其他款项
                    if data[2] == 1:
                        otherAmount = otherAmount - data[4]
                    else:
                        otherAmount = otherAmount + data[4]

                if data[0] == u"设计费": # 其他款项
                    otherAmount = otherAmount + data[4]

            total = total - refundAmount + addReduceAmount + otherAmount

            template[8] = refundAmount
            template[9] = refundTime
            template[10] = addReduceAmount
            template[11] = addReduceTime
            template[12] = otherAmount
            template[13] = total

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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, self.company("d.company", company))

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

            sql = self.SQL_QUERY % (self.DECORATION_COLUMN, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook(u"装修款汇总")

            # 退款合计(减项款合计))/退款时间(取最后一次退款时间)
            # 增项款总额(增项款有多次的，算合计数) / 增项款收款时间(取最后一次收款时间)
            # 其他款项总额(装修款的其他款项收款和退款+设计费收款)
            # 收款合计(首付款 + 首付二期款 + 二期款 + 尾款 - 退款 + 增项款 + 其他收费)
            
            tableHead = [
                u"装修单号", u'楼盘地址', u"签单时间", u"决算时间", u"装修单状态", u"工程状态", u"签单额", u'物品', u"实收额",
                u'首付款', u"收款时间", u"首付二期款", u"收款时间", u"二期款", u"收款时间", u"尾款", u"收款时间", u"退款合计", u"退款时间",
                u"增项款总额", u"增项款收款时间", u"其他款项总额", u"收款合计"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    # 处理数值
                    self.divNum(data, [6, 8])

                    data[5] = self.projectStatus[data[5]] # 先不转之后再说

                    template = self.paymentData(data[0])

                    row = data + template

                    self.createTableHead(sheet, row, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

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
        导出装修款汇总导出计划脚本说明:
        根据查询条件,以分页拿数据的方式导出装修款;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        决算时间:2022/09/08-2022/10/08
            3.company     公司:1
        2.脚本传参说明:
            plan_export_payment_decoration_amount.py  pid args company
            plan_export_payment_decoration_amount.py  3862 "2022/09/08-2022/10/08" 1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    ranker = Ranker(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    ranker.main(pid, args, int(company))
