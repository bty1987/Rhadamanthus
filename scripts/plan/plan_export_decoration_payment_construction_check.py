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
        self.size = 4000

        self.colum = u"""
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.houseNumber AS `楼号`,
            dr.name AS `设计分区`,
            dd.name AS `设计部`,
            du.currentName AS `设计师`,
            su.currentName AS `监理`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `装修单类型`,
            dp.paymentType AS `款项类型`,
            dp.referMoney AS `款项金额`,
            cs.endTime AS `完工时间`,
            pcn.name AS `工程节点`,
            cn.name AS `未缴费工程节点`, 
            d.balanceTime AS `内决时间`,
            communion.kv('decoration', 'decoration', 'repairStatus', d.repairStatus) AS `保修状态`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `装修单状态`,
            co.name AS `公司`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.user su,
                communion.user du,
                payment.decorationpayment dp,
                construction.constructionschedule cs,
                data.constructionnode cn,
                data.constructionnode pcn,
                communion.company co
            WHERE
                d.hid = h.hid 
                AND h.vid = v.vid 
                AND d.dsuid = du.uid 
                AND d.svuid = su.uid
                AND du.deptId = dd.did 
                AND dd.fdid = dr.did 
                AND d.orderId = cs.orderId 
                AND cs.cnid = cn.cnid 
                AND d.orderId = dp.orderId
                AND d.projectstatus = pcn.cnid  
                AND d.company = co.cid
                AND ((dp.paymentType = '二期款' AND cn.name = '瓦工' AND cs.status = 2) OR 
                     (dp.paymentType = '二期款' AND cn.name = '木工' AND cs.status = 1) OR 
                     (dp.paymentType = '尾款' AND cn.name = '油工' AND cs.status = 2) OR 
                     (dp.paymentType = '尾款' AND cn.name = '保洁' AND cs.status = 1) OR 
                     ((dp.paymentType = '增项款' OR dp.paymentType = '减项款') AND cn.name = '放线'))
                AND dp.paymentStatus = 0
                AND d.contractTime >= '%s 00:00:00' 
                AND d.contractTime <= '%s 23:59:59' 
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
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime, self.company("d.company", company))

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook(u"款项工程验证")

            tableHead = [u"装修单号", u"楼盘", u"楼号", u"设计分区", u"设计部", u'设计师', u'监理', u'装修单类型', u"款项类型", u"款项金额",
                         u"完工时间", u"工程节点", u"说明", u"内决时间", u"保修状态", "状态", "公司"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                data = self.page("%s GROUP BY dp.dpid " % sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    rows = list(v)

                    self.divNum(rows, [9])

                    if rows[8] == '二期款' and rows[11] == '瓦工': rows[12] = "瓦工完工未交二期款"
                    if rows[8] == '二期款' and rows[11] == '木工': rows[12] = "木工开工未交二期款"
                    if rows[8] == '尾款' and rows[11] == '油工': rows[12] = "油工完工未交尾款"
                    if rows[8] == '尾款' and rows[11] == '保洁': rows[12] = "保洁开工未交尾款"
                    if rows[8] == '增项款': rows[12] = "签单未交增项款"
                    if rows[8] == '减项款': rows[12] = "签单未交减项款"

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
        导出款项工程验证(导出瓦工完工未缴二期款/木工完工未缴尾款)脚本说明:
            根据查询条件,以分页拿数据的方式导出瓦工完工未缴二期款/木工完工未缴尾款信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     1
        2.脚本传参说明:
            plan_export_decoration_payment_construction_check.py  pid args company
            plan_export_decoration_payment_construction_check.py  299 2022/12/01-2022/12/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2018/09/01-2018/09/30'
    # company = 1
    
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
