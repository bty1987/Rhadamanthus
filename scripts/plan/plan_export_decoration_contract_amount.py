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
        self.size = 400

        self.colum = u"""
            co.name,
            sum(d.orderTotalPrice),
            sum(d.factPrice),
            count(d.doid)
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.company co
            WHERE
                d.contractTime > '%s 00:00:00' AND
                d.contractTime < '%s 23:59:59' AND
                d.company = co.cid
                %s
            GROUP BY co.cid
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("d.company", company))

    def main(self, pid, args, company):

        tableheads = [
            u"装修单公司", u"签单额", u"实收额", u"签单个数"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"计划", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出签单统计脚本说明:
        根据查询条件,以分页拿数据的方式导出签单统计;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2023/09/01-2023/09/30"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_decoration_contract_amount.py pid   args                    company
             plan_export_decoration_contract_amount.py 929   "2023/09/01-2023/09/30" 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    # pid = 299
    # args = "2023/09/01-2023/09/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
