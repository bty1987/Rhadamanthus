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
                d.orderId AS `装修单号`,
                d.grade AS `装修等级`,
                v.`name` AS `楼盘名称`,
                h.houseNumber AS `楼号`,
                supervisor.currentName AS `监理`,
                a.acceptanceTime AS `验收时间`,
                communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `装修单类型`,
                d.discount AS `折扣`,
                d.orderTotalPrice AS `签单额`,
                d.couponCut AS `卷优惠`,
                d.thingCut AS `物品优惠`
        """
        
        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM 
                construction.acceptance AS a 
                LEFT JOIN decoration.decoration AS d ON a.orderId = d.orderId 
                LEFT JOIN communion.`user` AS supervisor ON d.svuid = supervisor.uid,
                communion.house AS h,
                communion.village AS v
            WHERE 
                d.hid = h.hid 
                AND h.vid = v.vid 
                AND a.acceptanceTime >= '%s 00:00:00' 
                AND a.acceptanceTime <= '%s 23:59:59'
                AND d.company = %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

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

            sqlcount = self.SQL_QUERY % ("count(*)" ,startTime, endTime, company)
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

            paln = {
                u"plan.schedule": schedule,
                u"plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, paln)

            workbook, sheet = self.createWorkbook(u"装修竣工")

            sql = self.SQL_QUERY % (self.column, startTime, endTime, company)

            tableHead = [u"装修单号", u"装修单等级", u"楼盘", u"楼号", u"监理", u"验收时间", u"装修单类型", u"折扣", u"签单额", u"券优惠", u"物品优惠"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):

                    rows = list(v)
                    self.divNum(rows, [7, 8, 9, 10])

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
        装修竣工信息脚本说明:
            根据查询条件,以分页形式导出装修竣工信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_completed.py  pid args company
                   plan_export_decoration_completed.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid =  299
    # args = "2018/11/01-2018/11/30"
    # company =  1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)