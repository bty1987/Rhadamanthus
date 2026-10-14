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
        self.size = 300

        self.colum = u"""
            p.no,
            s.no,
            s.orderId,
            v.name,
            h.housenumber,
            cu.currentName,
            gu.currentname,
            iu.currentname,
            s.category,
            s.brand,
            g.no,
            g.name,
            pi.num,
            pi.inprice,
            g.measurementUnit,
            p.deliveryTime,
            p.balanceTime,
            p.status,
            p.balanceStatus,
            p.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.purchase p,
                inventory.purchaseitem pi,
                sales.sales s,
                sales.salesitem si,
                data.goods g,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.user gu,
                communion.user iu,
                communion.user cu

            WHERE
                p.pid = pi.pid AND
                pi.siid = si.siid AND
                si.sid = s.sid AND
                si.gid = g.gid AND
                s.orderId = d.orderId AND
                d.hid = h.hid AND
                h.vid = v.vid AND
                s.guid = gu.uid AND
                s.iuid = iu.uid AND
                p.cuid = cu.uid AND
                p.createTime > '%s 00:00:00' AND
                p.createTime < '%s 23:59:59'
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

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("p.company", company))

    def rower(self, row):

        self.divNum(row, [12, 13])

        row[17] = self.purchaseStatus[row[17]]
        row[18] = self.purchaseBalanceStatus[row[18]]

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"采购单号", u"销售单号", u"装修单号", u"楼盘", u"楼号", u"创建人", u"驻店", u"导购", u"品类", u"品牌", u"型号",
            u"商品名", u"数量", u"采购价", u"单位", u"交货时间", u"结算时间", u"状态", u"结算状态", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"货单", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出采购单(销售)脚本说明:
            根据查询条件,以分页拿数据的方式导出采购单(销售);并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_purchase_sales.py pid args company
            python plan_export_inventory_purchase_sales.py 942 2018/12/13-2018/12/13 1
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
