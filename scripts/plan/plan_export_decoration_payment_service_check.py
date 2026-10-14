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
            dr.NAME AS `设计分区`,
            dd.NAME AS `设计部`,
            du.currentName AS `设计师`,
            su.currentName AS `监理`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `装修单类型`,
            d.contractTime AS `签单时间`,
            dh.servicePrice AS `应收服务费`,
            dh.servicePaidup AS `已收服务费`,
            dh.servicePrice-dh.servicePaidup AS `差额`,
            d.balanceTime AS `内决时间`,
            communion.kv('decoration', 'decoration', 'repairStatus', d.repairStatus) AS `保修状态`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationholonomy dh,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.`user` su,
                communion.`user` du
            WHERE
                d.hid = h.hid 
                AND h.vid = v.vid 
                AND d.dsuid = du.uid 
                AND d.svuid = su.uid
                AND du.deptId = dd.did 
                AND dd.fdid = dr.did 
                AND d.orderId = dh.orderId
                AND d.contractTime > '%s 00:00:00' 
                AND d.contractTime < '%s 23:59:59' 
                AND d.company = %s
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

            workbook, sheet = self.createWorkbook(u"服务费信息导出")

            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"设计分区", u"设计部", u"设计师", u"监理", u"装修单类型", u"签单时间", u"应收服务费", u"实收服务费", 
                u"差额", u"内决时间", u"保修状态"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    if v[11] == 0: continue

                    data = list(v)

                    self.divNum(data, [9, 10, 11])
                    self.createTableHead(sheet, data, count)
                    count += 1

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

                molecular = molecular + len(rows)
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
        导出服务款项验证脚本说明:
            根据查询条件,以分页拿数据的方式导出付款代理信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     1
        2.脚本传参说明:
            plan_export_decoration_payment_service_check.py  pid args company
            plan_export_decoration_payment_service_check.py  299 2022/12/01-2022/12/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 4061
    # args = '2022/02/01-2022/02/28'
    # company = 1
    
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))