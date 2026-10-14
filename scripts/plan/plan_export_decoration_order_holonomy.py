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
            v.name,
            h.housenumber,
            du.currentName,
            dd.name,
            su.currentName,
            sd.name,
            dh.originMaterialPrice,
            dh.materialPrice,
            dh.originMaterialPrice - dh.materialPrice,
            d.contractTime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            communion.kv('decoration', 'decoration', 'status', d.status),
            d.orderTotalPrice,
            d.factPrice,
            dh.materialPrice,
            dh.materialPaidup,
            dh.servicePrice,
            dh.servicePaidup
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.house AS h,
                communion.village AS v,
                communion.user AS du,
                communion.user AS su,
                communion.department AS dd,
                communion.department AS sd,
                decoration.decorationholonomy as dh
            WHERE
                d.orderId = dh.orderId
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND d.smuid = su.uid
                AND du.deptid = dd.did
                AND su.deptid = sd.did
                AND d.contractTime >= '%s 00:00:00'
                AND d.contractTime <= '%s 23:59:59'
                AND d.type = 2
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

        self.divNum(row, [7, 8, 9, 13, 14, 15, 16, 17, 18])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"设计师", u"设计部", u"业务员", u"业务部", u"原主材配比额", u"现主材配比额", u"主材配比差额",
            u"签单时间", u"订单类型", u"订单状态", u"签单额", u"实收额", u"主材总额", u"实收主材额", u"服务费", u"实收服务费"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"装修满减信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出装修满减信息脚本说明:
            根据查询条件,以分页拿数据的方式导出装修满减信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_decoration_order_holonomy.py  pid args                 company
            plan_export_decoration_order_holonomy.py  299 2018/11/01-2018/11/30 1

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
