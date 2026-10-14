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
            p.`no`,
            cu.currentName,
            g.category,
            g.brand,
            c.`name`,
            f.info,
            g.`no`,
            g.`name`,
            pi.num,
            pi.surplus,
            pi.inprice,
            g.measurementUnit,
            p.deliveryTime,
            p.`comment`
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.purchase p,
                inventory.purchaseitem pi,
                communion.`user` cu,
                data.goods g,
                data.color c,
                data.format f
            WHERE
                p.pid = pi.pid
            AND pi.gid = g.gid
            AND pi.cid = c.cid
            AND pi.fid = f.fid
            AND p.cuid = cu.uid
            AND p.createTime >= '%s 00:00:00' AND
                p.createTime <= '%s 23:59:59'
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

        self.divNum(row, [8, 9, 10])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"采购单号", u"创建人", u"品类", u"品牌", u"颜色", u"规格", u"商品编号", u"商品名", u"数量", u"剩余数量",
            u"采购价", u"单位", u"交货时间", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"货单", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出采购单脚本说明:
            根据查询条件,以分页拿数据的方式导出采购单;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_purchase.py pid args company
            python plan_export_inventory_purchase.py 942 2018/12/13-2018/12/13 1
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
