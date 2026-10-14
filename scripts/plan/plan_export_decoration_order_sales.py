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
                v.name AS `楼盘名称`,
                h.housenumber AS `楼号`,
                c.name AS `客户名`,
                dd.name AS `设计部`,
                du.userid AS `设计师编号`,
                du.currentname AS `设计师`,
                su.currentname AS `监理`,
                h.buildarea AS `面积`,
                communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `订单类型`,
                d.contracttime AS `签单时间`,
                d.projectstatus AS `工程状态`,
                dh.projectBase AS `折前总价`,
                d.orderTotalPrice AS `签单额`,
                dh.serviceprice AS `服务费`,
                dh.materialprice AS `主材总额`,
                dh.materialPaidup AS `实收主材额`,
                sum(if(sp.type in (2,3,8), referMoney, -refermoney)) AS `主材额`,
                ap.materialBalance AS `主材预付款`
        """

        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM 
                decoration.decoration d
                left join decoration.decorationholonomy dh on d.orderId = dh.orderId
                left join payment.advancepayment ap on d.orderId = ap.orderId
                left join sales.sales s on d.orderId = s.orderId
                left join communion.`user` AS su ON d.svuid = su.uid,
                communion.house h,
                communion.village v,
                communion.user du,
                communion.department dd,
                communion.customer c,
                
                payment.salespayment sp
            WHERE
                d.hid = h.hid and
                h.vid = v.vid and
                d.dsuid = du.uid and
                du.deptid = dd.did and
                d.customerId = c.cid and
                s.sid = sp.sid and
                sp.status != 0 and
                d.contracttime >= '%s 00:00:00' and
                d.contracttime <= '%s 23:59:59' and
                d.company = %s
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

            sqlcount = self.SQL_QUERY % ("count(*)" ,startTime, endTime, company, " ")
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

            sql = self.SQL_QUERY % (self.SQL_COLUMN, startTime, endTime, company, "group by d.orderId")
            workbook, sheet = self.createWorkbook(u"shee1")

            tableHead = [u"装修单号", u"楼盘", u"楼号", u"客户名", u"设计部", u"设计师编号", u"设计师", u"监理", u"面积", u"订单类型",
                         u"签单时间", u"工程状态", u"折前总价", u"签单额", u"服务费", u"主材总额", u"实收主材额", u"主材额", u"主材预付款余额"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            while (flag):

                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):
                    row = list(v)

                    self.divNum(row, [8, 12, 13, 14, 15, 16, 17, 18])

                    row[11] = self.projectStatus[row[11]]

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
        导出主材数据信息脚本说明:
            根据查询条件,以分页形式导出装修竣工信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_sales.py  pid args company
                   plan_export_decoration_order_sales.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath,encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]
    
    # pid = 3200
    # args = "2021/11/01-2021/11/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))