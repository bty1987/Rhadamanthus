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
            d.orderId,
            dd.name,
            dr.name,
            u.userId,
            u.userName,
            d.depositTime,
            communion.kv('decoration', 'decoration', 'status', d.status),
            c.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.department dd,
                communion.department dr,
                communion.company c,
                communion.user u
            WHERE
                d.dsuid = u.uid
                AND u.deptId = dd.dId
                AND dd.fdid = dr.dId
                AND d.company = c.cid
                AND d.status = 1
                AND d.depositTime >= '%s 00:00:00'
                AND d.depositTime <= '%s 23:59:59'
                %s
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
            u"装修单号", u"设计部", u"设计分区", u"设计师工号", u"设计师", u"定金时间", u"状态", u"装修单公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"shee1", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出定金信息脚本说明:
            根据查询条件,以分页形式并根据公司导出装修定金信息(可导出全集团);并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.命令使用 plan_export_decoration_order_deposit.py  pid  args  company
                   plan_export_decoration_order_deposit.py  299 2018/11/01-2018/11/30 0

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    # pid = 299
    # args = "2022/05/01-2022/05/30"
    # company = 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
