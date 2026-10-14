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
            d.grade,
            v.name,
            h.houseNumber,
            supervisor.currentName,
            a.acceptanceTime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.discount,
            d.orderTotalPrice,
            d.couponCut,
            d.thingCut
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                construction.acceptance AS a
                LEFT JOIN decoration.decoration AS d ON a.orderId = d.orderId
                LEFT JOIN communion.`user` AS supervisor ON d.svuid = supervisor.uid,
                communion.house AS h,
                communion.village AS v
            WHERE
                d.hid = h.hid
                AND h.vid = v.vid
                AND a.acceptanceTime >= '%s 00:00:00'
                AND a.acceptanceTime <= '%s 23:59:59'
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

    def rower(self, row):

        self.divNum(row, [7, 8, 9, 10])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"装修单等级", u"楼盘", u"楼号", u"监理", u"验收时间", u"装修单类型", u"折扣", u"签单额", u"券优惠", u"物品优惠"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"装修竣工", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        装修竣工信息脚本说明:
            根据查询条件,以分页形式导出装修竣工信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.命令使用 plan_export_decoration_completed.py  pid args company
                   plan_export_decoration_completed.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
