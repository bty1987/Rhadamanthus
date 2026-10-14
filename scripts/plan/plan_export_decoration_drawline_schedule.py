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
            d.orderId,
            v.name,
            h.houseNumber,
            d.contractTime,
            dr.name,
            dd.name,
            du.currentName,
            ci.drawlineTime,
            dl.applayTime,
            cs.endTime,
            d.edesignTime,
            co.name
        """

        self.SQL_EXPORT_DRAWLINE_SCHEDULE = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.USER du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptId = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN construction.constructioninfo ci ON d.orderId = ci.orderId
                LEFT JOIN construction.constructionschedule cs ON ( d.orderId = cs.orderId AND cs.SCHEDULE = 5 )
                LEFT JOIN construction.drawline dl ON ( d.orderId = dl.orderId AND dl.STATUS = 2 )
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE
                d.contractTime >= '%s 00:00:00' AND 
                d.contractTime <= '%s 23:59:59'  
                %s
        """

    def company(self, column, company):

        if int(company) != 0:
            companyId = u"AND %s = %s" % (column, company)
        else:
            companyId = u" "

        return companyId

    def main(self, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.SQL_EXPORT_DRAWLINE_SCHEDULE % ("count(*)" ,startTime, endTime, self.company("d.company", company))

            count = self.count(sqlcount)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "无可导出数据"
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            workbook, sheet = self.createWorkbook(u"装修时间信息")

            sql = self.SQL_EXPORT_DRAWLINE_SCHEDULE % (self.column, startTime, endTime, self.company("d.company", company))
            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"签单时间", u"设计分区", u"设计部", u"设计师", u"预计放线时间", u"申请时间", u"放线时间", 
                u"确认放线方案时间", "公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)

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
        导出装修图纸信息说明:
            根据查询条件,以分页形式导出装修图纸信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2023/9/01-2023/9/30
            3.company     公司:1
        2.命令使用 
            plan_export_design_schedule.py  pid args company
            plan_export_design_schedule.py  4572 2023/9/01-2023/9/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
