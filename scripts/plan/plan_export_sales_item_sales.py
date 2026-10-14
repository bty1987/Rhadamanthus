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
        self.size = 200

        self.colum = u"""
            s.orderId,
            s.no,
            CONCAT(
                v.`name`,
                CONCAT('  ', h.houseNumber)
            ),
            u.userId,
            u.currentName,
            b.name,
            g.no,
            ss.num,
            ss.price,
            ss.disPrice,
            s.total,
            communion.kv('data', 'price', 'type', ss.priceType),
            communion.kv('sales', 'salesItem', 'ctype', ss.ctype),
            ss.cvalue,
            s.fullpay,
            ss.`comment`,
            b.kino,
            b.kiname
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                sales.sales s,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.user u,
                communion.brand b,
                sales.salesitem ss,
                data.goods g
            WHERE
                s.orderId = d.orderId
                AND s.bid = b.bid
                AND s.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = u.uid
                AND ss.sid = s.sid
                AND ss.gid = g.gid
                AND s.fullpayTime BETWEEN '%s' AND '%s'
                %s
        """

    def company(self, company):

        if company != 0:
            companyId = u"AND s.pompany = %s " % company
        else:
            companyId = u" "

        return companyId

    def sqler(self, args, company):

        startTime, endTime = args.split("-")
        startTime = startTime + " 00:00:00"
        endTime = endTime + " 23:59:59"

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company(company))

    def rower(self, row):

        # 价格类型/结算类型已由SQL层communion.kv翻译, rower仅做金额÷1000
        self.divNum(row, [7, 8, 9, 10, 13, 14])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u'装修单号', u'销售单号', u"楼盘地址", u'设计师编号', u'设计师', u'品牌', u'型号', u'数量', u'折让价', u'折扣价',
            u'销售单总价', u'价格类型', u'结算类型', u'结算值', u'补款金额', u'备注', u'金蝶编号', u'金蝶名称'
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"销售明细", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出销售明细脚本说明:
            根据查询条件,以分页拿数据的方式导出销售明细;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_sales_item_sales.py      pid              args                company
             plan_export_sales_item_sales.py      299          2020/04/01-2020/04/30      1

        3.注:
            1.结束时间不能大于开始时间31天
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
