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
            d.precontractTime,
            d.contractTime,
            communion.kv ( 'decoration', 'decoration', 'typeness', d.typeness ) AS typeness,
            communion.kv ( 'decoration', 'decoration', 'status', d.STATUS ) AS STATUS,
            su.userid,
            su.currentname,
            sd.name,
            du.content 
        """
        
        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN decoration.decorationuser du on d.orderId = du.orderId
                LEFT JOIN communion.house h on d.hid = h.hid
                LEFT JOIN communion.village v on h.vid = v.vid 
                LEFT JOIN communion.user su on du.user = su.uid
                LEFT JOIN communion.duty sd on su.did = sd.did 
            WHERE
                d.%s >= '%s 00:00:00' AND
                d.%s <= '%s 23:59:59' AND
                d.company = %s
        """

    def main(self, type, pid, args, company):

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

            timeColumn = "contractTime"
            if type == "0":
                timeColumn = "contractTime"
            elif type == "1":
                timeColumn = "precontractTime"

            sqlcount = self.SELECT_SQL % ("count(*)" ,timeColumn, startTime, timeColumn, endTime, company)
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

            workbook, sheet = self.createWorkbook(u"服务人员")

            sql = self.SELECT_SQL % (self.column, timeColumn, startTime, timeColumn, endTime, company)

            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"预签时间", u"签单时间", u"订单类型", u"订单状态", u"工号", u"人员姓名", u"职位",
                u"备注"
            ]
            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):

                    rows = list(v)

                    if (rows[3] is None): rows[3] = ""
                    if (rows[7] is None): rows[7] = ""
                    if (rows[8] is None): rows[8] = ""
                    if (rows[9] is None): rows[9] = ""
                    if (rows[10] is None): rows[10] = ""

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
        导出服务人员信息脚本说明:
            根据查询条件,以分页形式导出服务人员信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/7/01-2022/7/31
            3.company     公司:1
        2.命令使用 plan_export_decoration_user.py  pid args company
                   plan_export_decoration_user.py  3866 2022/7/01-2022/7/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, company)