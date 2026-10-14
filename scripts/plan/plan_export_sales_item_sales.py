#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

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
        self.size = 200

        self.colum = u"""
            s.orderId AS '装修单号',
	        s.no AS '销售单号',
            CONCAT(
                v.`name`,
                CONCAT('  ', h.houseNumber)
            ) AS '楼盘地址',
            u.userId AS '设计师编号',
            u.currentName AS '设计师',
            b.name AS '品牌',
            g.no AS '型号',
            ss.num AS '数量',
            ss.price AS '折让价',
            ss.disPrice AS '折扣价',
            s.total AS '销售单总价',
            ss.priceType AS '价格类型',
            ss.ctype AS '结算类型',
            ss.cvalue AS '结算值',
            s.fullpay AS '补款金额',
            ss.`comment` '备注',
            b.kino AS '金蝶编号',
            b.kiname AS '金蝶名称'
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                sales.sales s,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.user u,
                communion.brand b,
                sales.salesitem ss,
                data.goods g
            WHERE
                s.orderId = d.orderId
                AND s.bid = b.bid
                AND s.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = u.uid
                AND ss.sid = s.sid
                AND ss.gid = g.gid
                AND s.fullpayTime BETWEEN '%s' AND '%s'
                %s
        """
    def company(self, company):

        if company != 0:
            companyId = u"AND s.pompany = %s " % company
        else:
            companyId = u" "

        return companyId
    def main(self, pid, args, comapny):

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

            startTime = startTime + " 00:00:00"
            endTime = endTime + " 23:59:59"

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, self.company(comapny))

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

            sql = self.SQL_QUERY % (self.colum, startTime, endTime, self.company(comapny))

            workbook, sheet = self.createWorkbook(u"销售明细")

            tableHead = [
                u'装修单号', u'销售单号', u"楼盘地址", u'设计师编号', u'设计师', u'品牌', u'型号', u'数量', u'折让价', u'折扣价', 
                u'销售单总价', u'价格类型', u'结算类型', u'结算值', u'补款金额', u'备注', u'金蝶编号', u'金蝶名称'
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    self.divNum(data, [7, 8, 9, 10, 13, 14])
                    
                    data[11] = data[11] == 0 and u"正价" or u"特价"
                    data[12] = data[12] == 0 and u"底价" or u"点位"
                    
                    self.createTableHead(sheet, data, count)

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
        导出销售明细脚本说明:
            根据查询条件,以分页拿数据的方式导出销售明细;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_sales.py      pid              args                company
             plan_export_funds.py      299          2020/04/01-2020/04/30      1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
