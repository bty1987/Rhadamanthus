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
        self.size = 100

        self.colum = """
            cs.name '客户',
            cp0.name '城区',
            v0.name '楼盘',
            cs.housenumber '楼号',
            cs.buildarea/1000 '派尺面积',
            su.userid '业务员编号',
            su.currentname '业务员',
            sd.name '业务部',
            sr.name '业务分区',
            cs.createtime '创建时间',
            du.userId '设计师ID',
            du.currentName '设计师',
            dd.name '设计部',
            dr.name '设计分区',
            co.name '公司',
            d.orderId '装修单号',
            cp2.name '城区',
            v2.name '楼盘',
            h2.housenumber '楼号',
            h2.innerarea/1000 '计价面积',
            d.contracttime '签单时间', 
            cs.comment '备注'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM
                customer.customersource cs
                LEFT JOIN communion.village v0 ON cs.vid = v0.vid
                LEFT JOIN communion.cityproper cp0 ON v0.cityProperId = cp0.cpid
                LEFT JOIN customer.customerchance cc ON cc.csid = cs.csid
                LEFT JOIN communion.house h1 ON cc.hid = h1.hid
                LEFT JOIN communion.village v1 ON h1.vid = v1.vid
                LEFT JOIN communion.cityproper cp1 ON v1.cityProperId = cp1.cpid
                LEFT JOIN communion.user su ON cs.cuid = su.uid
                LEFT JOIN communion.department sd ON su.deptid = sd.did
                LEFT JOIN communion.department sr ON sd.fdid = sr.did
                LEFT JOIN communion.user du ON cc.buid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.company co ON cc.company = co.cid
                LEFT JOIN decoration.decoration d ON cc.orderId = d.orderId
                LEFT JOIN communion.house h2 ON d.hid = h2.hid
                LEFT JOIN communion.village v2 ON h2.vid = v2.vid 
                LEFT JOIN communion.cityproper cp2 ON v2.cityProperId = cp2.cpid
            WHERE
                %s
        """

    def rower(self, row):
        self.divNum(row, [4, 19])

        return row

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        if company != 0:
            companyId = "AND cs.company = %s " % company
        else:
            companyId = " "

        condition = " cs.createtime >= '%s 00:00:00' AND cs.createtime <= '%s 23:59:59' %s" % (startTime, endTime, companyId)

        return self.SQL_QUERY_STR % ("%s", condition)

    def main(self, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "客户", "城区", "楼盘", "楼号", "面积", "业务员编号", "业务员", "业务部", "业务分区", "创建时间", 
            "设计师编号", "设计师", "设计部", "设计分区", "公司", "装修单号", "城区", "楼盘", "楼号", "面积", 
            "签单时间", "备注"
        ]
        sql = self.sqler(args, int(company))

        self.exporter(pid, "", "sheet1", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出客户资源信息说明:
            根据查询条件,以分页拿数据的方式导出客户资源信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid           information.plan的主键;
            2.args          "2024/07/01 - 2024/7/30"
            3.company       公司
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4991
    # args = "2024/07/01-2024/07/30"
    # company = 1


    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
