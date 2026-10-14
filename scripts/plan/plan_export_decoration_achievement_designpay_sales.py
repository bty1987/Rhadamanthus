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
        self.size = 400

        self.colum = u"""
            d.orderId AS `装修单号`,
            v.NAME AS `楼盘`,
            h.houseNumber AS `楼号`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `类型`,
            du.userId AS `业务员编号`,
            du.currentName AS `业务员`,
            dd.no AS `业务部编号`,
            dd.name AS `业务部`,
            dr.no AS `业务分区编号`,
            dr.name AS `业务分区`,
            db.rate AS `比例`,
            if(dp.paymenttype = '设计费', dp.refermoney, -dp.refermoney) as `金额`,
            pr.collecttime AS `收款时间`,
            c.name AS `归属公司`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.house h,
                communion.village v,
                communion.USER du,
                communion.USER su,
                communion.company c,
                communion.department dd,
                communion.department dr,
                payment.decorationpayment dp,
                payment.decorationreceipt pr 
            WHERE
                d.orderId = db.orderId 
                AND d.hid = h.hid 
                AND h.vid = v.vid 
                AND db.did = dd.did 
                AND db.rid = dr.did 
                AND d.smuid = su.uid 
                AND db.buid = du.uid 
                AND dp.drId = pr.drid 
                AND su.company = c.cid
                AND d.orderId = dp.orderId 
                AND dp.paymentType in ('设计费', '设计费退款')
                AND pr.collectTime > '%s 00:00:00' 
                AND pr.collecttime < '%s 23:59:59' 
                AND d.company = %s 
                AND db.type = 1 
                AND db.status = 0
        """

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

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime, company)

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook(u"业务员设计费业绩")

            tableHead = [u"装修单号", u"楼盘", u"楼号", u"类型", u"业务员编号", u'业务员', u'业务部编号', u'业务部', u"业务分区编号", u"业务分区",
                         u"比例", u"金额", u"收款时间", u"归属公司"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    rows = list(v)

                    self.divNum(rows, [10, 11])

                    rates = float(rows[10])
                    test_list = [11]

                    self.rates(rows, rates, test_list)

                    self.createTableHead(sheet, rows, count)
                    count += 1

                nowPage = nowPage + 1

                if len(data) < self.size:
                    flag = False

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
        业务员设计费业绩脚本说明:
            根据查询条件,以分页拿数据的方式导出业务员签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     1
        2.脚本传参说明:
            plan_export_payment_decoration_designpay_sales.py  pid args company
            plan_export_payment_decoration_designpay_sales.py  299 2022/12/01-2022/12/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 4061
    # args = '2021/11/01-2021/11/30'
    # company = 1
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))