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

        self.COLUMN = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.houseNumber AS `楼号`,
            dr.no AS `设计分区编号`,
            dr.name AS `设计分区`,
            dd.no AS `设计部编号`,
            dd.name AS `设计部`,
            du.userid AS `设计师编号`,
            du.currentName AS `设计师`,
            pq.product AS `预签产品`,
            pq.quoteArea AS `面积`,
            pq.totalPrice AS `预签总额`,
            (pq.quotearea*pq.costPrice/1000) AS `工程成本`,
            pq.mostPrice AS `主材成本`,
            sum(if(pqi.type in (0), (pqi.num - pqi.basicNum) * pqi.cost / 1000, 0)) AS `功能区成本`,
            sum(if(pqi.type in (3, 4), if(pqi.areaCale = 1, pq.quoteArea / 1000, 1) * pqi.num * pqi.cost / 1000, 0)) AS `个性化成本`,
            sum(if(pqi.type in (5, 6), if(pqi.areaCale = 1, pq.quoteArea / 1000, 1) * pqi.num * pqi.cost / 1000, 0)) AS `减项成本`,
            sum(if(pqi.type in (7, 8), if(pqi.areaCale = 1, pq.quoteArea / 1000, 1) * pqi.num * pqi.addprice / 1000, 0)) AS `赋能增补额`,
            sum(if(pqi.type in (5, 6), if(pqi.areaCale = 1, pq.quoteArea / 1000, 1) * pqi.num * pqi.addprice / 1000, 0)) AS `减项增补额`,
            pq.subcPrice AS `减通额`,
            pq.preferPrice AS `优惠额`,
            pq.manageProfit AS `管理优惠`,
            pq.advanceProfit AS `特殊优惠`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`,
            d.couponcut AS '券优惠',
            d.thingcut AS '物品优惠'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN quotation.protation pq ON (d.orderId = pq.orderId AND pq.defaults = 1)
                LEFT JOIN quotation.protationitem pqi ON pq.pid = pqi.pid
            WHERE
                d.precontractTime >= '%s 00:00:00' AND
                d.precontractTime <= '%s 23:59:59' AND pq.pid is not null
                %s
                GROUP BY d.orderId
        """

    def company(self, column, company):

        if int(company) != 0:
            companyId = "AND %s = %s" % (column, company)
        else:
            companyId = " "

        return companyId

    def sqler(self, timeargs, company):

        startTime, endTime = timeargs.split("-")

        return self.SQL_QUERY_STR % ("%s", startTime, endTime, self.company("d.company", company))

    def rower(self, row):

        status = row[23]
        coupon = row[24]
        thing = row[25]

        row[23] = row[12] + row[13] + row[14] + row[15] - row[16] if row[12] else 0
        row[24] = row[11] - row[17] + row[18]
        row[25] = ((1 - row[23] / (row[24] - coupon - thing)) if (row[24] - coupon - thing) else 0)

        row.append(status)
        row.append(coupon)
        row.append(thing)

        self.divNum(row, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 28])

        return row

    def main(self, pid, args, company):

        tableheads = [
            "装修单号", "楼盘", "楼号", "设计分区编号", "设计分区", "设计部编号", "设计部", "设计师编号", "设计师", "预签产品", 
            "面积", "预签总额", "工程成本", "主材成本", "功能区成本", "个性化成本", "减项成本", "赋能增补额", "减项增补额", "减通额", 
            "优惠额", "管理优惠", "特殊优惠", "预签成本", "提成基数", "毛利率", "装修状态", "券优惠", "物品优惠"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)
        
        sql = exporter.sqler(args, int(company))

        self.exporter(pid, args, "预签成本", tableheads, self.COLUMN, sql, self.rower)

if __name__ == '__main__':

    """
        导出预签成本脚本说明:
            根据查询条件,以分页形式导出预签成本信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2023/11/01-2023/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_procontract_cost.py  pid args company
                   plan_export_decoration_procontract_cost.py  48842 2023/11/01-2023/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
