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

        self.colum = u"""
            d.orderId,
            v.name,
            h.houseNumber,
            d.contractTime,
            dr.name,
            dd.name,
            du.currentName,
            ci.drawlineTime,
            dl.applayTime,
            cs.endTime,
            d.edesignTime,
            co.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.USER du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptId = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN construction.constructioninfo ci ON d.orderId = ci.orderId
                LEFT JOIN construction.constructionschedule cs ON ( d.orderId = cs.orderId AND cs.SCHEDULE = 5 )
                LEFT JOIN construction.drawline dl ON ( d.orderId = dl.orderId AND dl.STATUS = 2 )
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE
                d.contractTime >= '%s 00:00:00' AND
                d.contractTime <= '%s 23:59:59'
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
            u"装修单号", u"楼盘", u"楼号", u"签单时间", u"设计分区", u"设计部", u"设计师", u"预计放线时间", u"申请时间", u"放线时间",
            u"确认放线方案时间", u"公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"装修时间信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出装修图纸信息说明:
            根据查询条件,以分页形式导出装修图纸信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2023/9/01-2023/9/30
            3.company     公司cid, 0为全部(不传默认0)
        2.命令使用
            plan_export_decoration_drawline_schedule.py  pid args company
            plan_export_decoration_drawline_schedule.py  4572 2023/9/01-2023/9/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
