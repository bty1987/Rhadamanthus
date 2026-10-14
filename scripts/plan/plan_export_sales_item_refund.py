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
            s.no,
            s.orderId,
            cc.name,
            CONCAT(v.`name`, CONCAT('  ', h.houseNumber)),
            u.userId,
            u.currentName,
            s.total,
            s.fullpay,
            r.total,
            sb.balance,
            r.createTime,
            us.currentName,
            dept.name,
            region.name,
            communion.kv('sales', 'refunds', 'type', r.type),
            b.kino,
            b.kiname
        """

        self.SQL_SalesItem = u"""
            SELECT
                %s
            FROM
                sales.salesrefunds AS r
                LEFT JOIN sales.sales AS s ON s.sid = r.sid
                LEFT JOIN payment.salespayment AS sp ON sp.spid = r.spid
                LEFT JOIN sales.salesbalance AS sb ON sb.rid = r.rid
                LEFT JOIN decoration.decoration AS d ON d.orderId = s.orderId
                LEFT JOIN communion.brand b ON s.bid = b.bid
                LEFT JOIN communion.house AS h ON h.hid = s.hid
                LEFT JOIN communion.village AS v ON v.vid = h.vid
                LEFT JOIN communion.user AS u ON u.uid = s.suid
                LEFT JOIN communion.company cc ON s.dompany = cc.cid
                LEFT JOIN communion.user AS us ON us.uid = sb.cuid,
                communion.department AS dept,
                communion.department AS region
            WHERE
                r.createTime BETWEEN '%s' AND '%s'
                AND s.did = dept.did
                AND s.rid = region.did
                %s
        """

    def company(self, form, company):

        companyId = u" "
        if company != 0:
            if form == "0":
                companyId = u"AND s.company = %s " % company
        else:
            companyId = u" "

        return companyId

    def sqler(self, form, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_SalesItem % ("%s", startTime, endTime, self.company(form, company))

    def rower(self, row):

        # 退款类型已由SQL层communion.kv翻译, rower仅做金额÷1000
        self.divNum(row, [6, 7, 8, 9])

        return row

    def main(self, form, pid, args, company):

        tableheads = [u'销售单号', u'装修单号', u'装修单公司', u'楼盘地址', u'设计师编号', u'设计师', u'销售单总额', u'补款', u'退款总额',
                      u'预结算值', u'退款时间', u'审批人', u'部门', u'分区', u'类型', u'金蝶编号', u'金蝶名称']

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(form, args, company)

        self.exporter(pid, args, u"销售单-商品退款", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        销售单-商品退款脚本说明:
            根据查询条件,以分页拿数据的方式导出销售结算;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.form        自动获取查询条件公司
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_sales_item_refund.py   form     pid              args                company
             plan_export_sales_item_refund.py    0       299          2020/04/01-2020/04/30      1

        3.注:
            1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    form = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(form, pid, args, int(company))
