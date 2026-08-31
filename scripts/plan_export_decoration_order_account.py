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
            eu.userId AS `方案设计工号`,
            eu.currentName AS `方案设计`,
            d.contractTime AS `签单时间`,
            d.accountTime AS `决算时间`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`,
            cn.name AS `工程状态`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `类型`,
            u.userId AS `归属人工号`,
            u.currentName AS `归属人`,
            db.type AS `归属类型`,
            ur.no AS `分区编号`,
            ur.name AS `分区名称`,
            ud.no AS `部门编号`,
            ud.name AS `部门名称`,
            communion.kv('decoration', 'decorationbelong', 'defaultflag', db.defaultflag) AS `是否默认`,
            db.rate AS `归属比例`,
            da.paidupMatching AS `决算实花配比`,
            cc.name AS `公司`
        """

        self.SQL_EXPORT_DECORATION_ACCOUNT = """
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN decoration.decorationaccount AS da ON d.orderId = da.orderId
                LEFT JOIN data.constructionnode AS cn on d.projectstatus = cn.cnid
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.company AS cc ON d.company = cc.cid
                LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId and db.status = 0)
                LEFT JOIN communion.user AS u ON db.buid = u.uid
                LEFT JOIN communion.department AS ud ON u.deptId = ud.did
                LEFT JOIN communion.department AS ur ON ud.fdid = ur.did
            WHERE
                d.accountTime >= '%s 00:00:00' AND
                d.accountTime <= '%s 23:59:59' 
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

            self.constructionnode(company)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_ACCOUNT % ("count(*)", startTime, endTime, self.company("d.company", company))

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

            sql = self.SQL_EXPORT_DECORATION_ACCOUNT % (self.column, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook("装修决算信息")

            tableHead = [
                "装修单号", "楼盘", "楼号", "客户名", "建筑面积", "计价面积", "方案设计工号", "方案设计", "签单时间", "决算时间",
                "订单状态", "工程状态", "订单类型", "归属人工号", "归属人", "归属类型", "分区编号", "分区名称", "部门编号", "部门名称",
                "是否默认", "归属比例", "决算实花配比", "公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)

                    self.divNum(rows, [4, 5, 21, 22])

                    rates = float(rows[21] or 0)

                    rows[15] = self.decorationbelongType.get(rows[15], rows[15])

                    rows[22] = (rows[22] or 0) * rates

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
        导出装修决算信息脚本说明:
            根据查询条件,以分页形式导出决算订单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_account.py  pid args company
                   plan_export_decoration_order_account.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2021/04/01-2021/04/30'
    # company = 0
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
