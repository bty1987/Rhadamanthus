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
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            du.currentName AS '设计师',
            g.category AS '品类',
            g.brand AS '品牌',
            g.no AS '商品编号',
            g.name AS '商品名',
            si.areaName AS '功能区',
            si.num AS '拆单量',
            si.createTime AS '拆单时间',
            communion.kv('quotation', 'selectionitem', 'type', si.type) AS '类型',
            communion.kv('quotation', 'selectionitem', 'status', si.status) AS '状态',
            communion.kv('quotation', 'addreduce', 'type', ar.type) AS '增减类型',
            communion.kv('quotation', 'addreduce', 'atttype', ar.atttype) AS '业务类型',
            communion.kv('quotation', 'addreduce', 'paytype', ar.paytype) AS '付款类型',
            communion.kv('quotation', 'addreduce', 'status', ar.status) AS '增减状态'
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT
                %s
            FROM
                quotation.selectionitem si
                LEFT JOIN decoration.decoration d ON si.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN quotation.addreduce ar ON si.areaId = ar.arid
            WHERE
                si.createtime > '%s 00:00:00' AND 
                si.createtime < '%s 23:59:59' AND 
                si.type = 3 AND 
                d.company = %s
            """

    def sqler(self, timeargs, company):

        startTime, endTime = timeargs.split("-")

        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, company)

    def rower(self, row):

        self.divNum(row, [9])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u'装修单号', u'楼盘', u"楼号", u'设计师', u'品类', u'品牌', u'商品编号', u'商品名', u'功能区', u'拆单量',
            u'拆单时间', u'选材类型', u'选材状态', u'增减类型', u"业务类型", u"付款类型", u"增减状态"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, int(company))

        self.exporter(pid, args, u"选材项", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出选材项信息脚本说明:
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
