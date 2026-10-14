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
            v.NAME,
            h.houseNumber,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            du.userId,
            du.currentName,
            dd.no,
            dd.name,
            dr.no,
            dr.name,
            db.rate,
            if(dp.paymenttype = '设计费', dp.refermoney, -dp.refermoney),
            pr.collecttime,
            c.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.house h,
                communion.village v,
                communion.USER du,
                communion.USER su,
                communion.company c,
                communion.department dd,
                communion.department dr,
                payment.decorationpayment dp,
                payment.decorationreceipt pr
            WHERE
                d.orderId = db.orderId
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND db.did = dd.did
                AND db.rid = dr.did
                AND d.smuid = su.uid
                AND db.buid = du.uid
                AND dp.drId = pr.drid
                AND su.company = c.cid
                AND d.orderId = dp.orderId
                AND dp.paymentType in ('设计费', '设计费退款')
                AND pr.collectTime > '%s 00:00:00'
                AND pr.collecttime < '%s 23:59:59'
                %s
                AND db.type = 1
                AND db.status = 0
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

        self.divNum(row, [10, 11])

        # 金额 = 金额 * 比例
        self.rates(row, float(row[10]), [11])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"类型", u"业务员编号", u'业务员', u'业务部编号', u'业务部', u"业务分区编号", u"业务分区",
            u"比例", u"金额", u"收款时间", u"归属公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"业务员设计费业绩", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        业务员设计费业绩脚本说明:
            根据查询条件,以分页拿数据的方式导出业务员签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_decoration_achievement_designpay_sales.py  pid args company
            plan_export_decoration_achievement_designpay_sales.py  299 2022/12/01-2022/12/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))
