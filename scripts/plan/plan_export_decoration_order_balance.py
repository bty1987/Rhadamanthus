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

        self.column = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.housenumber as `楼号`,
            c.name AS `客户名`,
            h.buildArea AS `建筑面积`,
            h.innerArea AS `计价面积`,
            du.userId AS `设计师工号`,
            du.currentName AS `设计师`,
            su.userId AS `业务员工号`,
            su.currentName AS `业务员`,
            eu.userId AS `方案设计工号`,
            eu.currentName AS `方案设计`,
            d.contractTime AS `签单时间`,
            d.balanceTime AS `内决时间`,
            communion.kv("decoration", "decoration", "status", d.status) AS `订单状态`,
            communion.kv("decoration", "decoration", "projectStatus", d.projectStatus) AS `工程状态`,
            communion.kv("decoration", "decoration", "typeness", d.typeness) AS `订单类型`,
            u.userId AS `归属人工号`,
            u.currentName AS `归属人`,
            db.type AS `归属类型`,
            ur.no AS `分区编号`,
            ur.name AS `分区名称`,
            ud.no AS `部门编号`,
            ud.name AS `部门名称`,
            db.rate AS `归属比例`
        """

        self.SQL_EXPORT_DECORATION_BALANCE = """
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer c ON d.customerid = c.cid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.user su ON d.smuid = su.uid
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId AND db.status = 0)
                LEFT JOIN communion.user u ON db.buid = u.uid
                LEFT JOIN communion.department ud ON u.deptId = ud.did
                LEFT JOIN communion.department ur ON ud.fdid = ur.did
            WHERE
                d.balanceTime >= '%s 00:00:00' AND 
                d.balanceTime <= '%s 23:59:59'
                %s
        """


    def company(self, columnCompany, company):
        if company != 0:
            companyString = "AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

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

            sqlcount = self.SQL_EXPORT_DECORATION_BALANCE % ("count(*)", startTime, endTime, self.company("d.company", company))

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
                "plan.schedule": schedule,
                "plan.status": 4
            })

            sql = self.SQL_EXPORT_DECORATION_BALANCE % (self.column, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook("装修内决信息")
            
            tableHead = [
                "装修单号", "楼盘", "楼号", "客户名", "建筑面积", "计价面积",
                "设计师工号", "设计师", "业务员工号", "业务员", "方案设计工号", "方案设计",
                "签单时间", "内决时间", "订单状态", "工程状态", "订单类型",
                "归属人工号", "归属人", "归属类型", "分区编号", "分区名称", "部门编号", "部门名称", "归属比例"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)
                    
                    self.divNum(rows, [4, 5, 24])

                    rows[19] = self.decorationbelongType.get(rows[19], rows[19])

                    if (rows[12] is None): rows[12] = ""
                    if (rows[13] is None): rows[13] = ""

                    self.createTableHead(sheet, rows, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    flag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导出装修内决信息脚本说明:
            根据查询条件,以分页形式导出内决订单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_balance.py  pid args company
                   plan_export_decoration_order_balance.py  299 2018/11/01-2018/11/30 1

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
