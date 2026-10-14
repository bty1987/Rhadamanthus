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

        self.SQL_COLUMN = u"""
            d.orderId AS `装修单号`,
            dd.name AS `设计部`,
            dr.name AS `设计分区`,
            u.userId AS `设计师工号`,
            u.userName AS `设计师`,
            d.depositTime AS `定金时间`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`,
            c.name AS '装修单公司'
        """
        
        self.SQL_EXPORT_DECORATION_MEASUREINFO = u"""
            SELECT 
                %s
            FROM 
                decoration.decoration d,
                communion.department dd,
                communion.department dr,
                communion.company c,
                communion.user u
            WHERE
                d.dsuid = u.uid
                AND u.deptId = dd.dId
                AND dd.fdid = dr.dId
                AND d.company = c.cid
                AND d.status = 1
                AND d.depositTime >= '%s 00:00:00'
                AND d.depositTime <= '%s 23:59:59'
                %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def company(self, columnCompany, company):
        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString


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

            sqlcount = self.SQL_EXPORT_DECORATION_MEASUREINFO % ("count(*)" ,startTime, endTime, self.company("d.company", company))

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

            sql = self.SQL_EXPORT_DECORATION_MEASUREINFO % (self.SQL_COLUMN, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook(u"shee1")

            tableHead = [u"装修单号",u"设计部", u"设计分区", u"设计师工号", u"设计师", u"定金时间", u"状态", u"装修单公司"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):
                    row = list(v)

                    self.createTableHead(sheet, row, count)
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
        导出定金信息脚本说明:
            根据查询条件,以分页形式并根据公司导出装修定金信息(可导出全集团);并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_deposit.py  pid  args  company
                   plan_export_decoration_order_deposit.py  299 2018/11/01-2018/11/30 0

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath,encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 299
    # args = "2022/05/01-2022/05/30"
    # company = 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))