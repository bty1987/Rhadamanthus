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
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            su.userid AS `监理工号`,
            su.currentname AS `监理`,
            wu.userid AS `工人工号`,
            wu.currentName AS `工人`,
            cn.name AS `施工节点`,
            cu.sendTime AS `推送时间`,
            cu.finishTime AS `确认时间`,
            cu.rate AS `工地卫生`,
            cu.rate1 AS `质量标准`,
            cu.rate2 AS `沟通服务`,
            cu.assessment AS `备注`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                construction.constructer AS cu,
                decoration.decoration AS d,
                communion.village AS v,
                communion.house AS h,
                communion.user AS su,
                communion.user AS wu,
                data.constructionnode AS cn
            WHERE
                cu.sendTime >= '%s 00:00:00' AND
                cu.sendTime <= '%s 23:59:59' AND
                cu.orderId = d.orderId AND
                d.hid = h.hid AND 
                h.vid = v.vid AND 
                cu.wuid = wu.uid AND 
                d.svuid = su.uid AND
                cu.cnid = cn.cnid AND
                d.company = %s
        """

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

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime, company)

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook(u"工人评分信息")

            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"监理工号", u"监理", u"工人工号", u"工人", u'施工节点', u'推送时间', u'确认时间',
                u"工地卫生", u"质量标准", u"沟通服务", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    row = list(v)

                    row[9] = row[9] if row[9] else ''
                    row[13] = row[13] if row[13] else ''
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
        导出工人评分信息脚本说明:
            根据查询条件,以分页拿数据的方式导出工人评分信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_constructer_rate.py  pid args company
            plan_export_constructer_rate.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/04/01-2023/04/30'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))