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

        self.type = {
            1: u"进货",
            2: u"进退",
            3: u"出货",
            4: u"出返",
            5: u"调拨",
            6: u"采购",
            7: u"辅料",
            8: u"辅退",
            9: u"套合",
            10: u"套拆",
            11: u"盘盈",
            12: u"盘亏"
        }

        self.colum = u"""
            m.code,
            m.createTime,
            m.manifestTime,
            s.no,
            d.orderId,
            v.name,
            h.housenumber,
            g.no,
            g.name,
            g.category,
            g.brand,
            c.name,
            f.info,
            g.measurementUnit,
            g.pieceNum,
            mi.num,
            ish.name,
            osh.name,
            m.type,
            mi.inprice,
            mi.outprice,
            m.`comment`,
            mi.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.manifest m,
                inventory.manifestitem mi
                LEFT JOIN inventory.storehouse ish ON mi.ishid = ish.shid
                LEFT JOIN inventory.storehouse osh ON mi.oshid = osh.shid,
                data.goods g,
                data.color c,
                data.format f,
                sales.salesitem si,
                sales.sales s,
                decoration.decoration d,
                communion.house h,
                communion.village v
            WHERE
                m.mid = mi.mid
            AND mi.siid = si.siid
            AND si.sid = s.sid
            AND mi.gid = g.gid
            AND mi.cid = c.cid
            AND mi.fid = f.fid
            AND s.orderId = d.orderId
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND %s BETWEEN '%s 00:00:00' AND '%s 23:59:59'
            AND mi.siid != 0
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = u"m.createTime"
        if type == "0":
            timeColumn = u"m.createTime"
        elif type == "1":
            timeColumn = u"m.manifestTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, endTime, self.company(u"m.company", company))

    def rower(self, row):

        self.divNum(row, [14, 15, 19, 20])

        if (row[16] is None): row[16] = u"无"
        if (row[17] is None): row[17] = u"无"
        if (row[22] is None): row[22] = ""

        row[18] = self.type[row[18]]

        return row

    def main(self, type, pid, args, company):

        tableheads = [u"货单号", u"创建时间", u"货单时间", u"销售单号", u"装修单号", u"楼盘", u"楼号", u"商品编号", u"商品名称", u"品类", u"品牌",
                      u"颜色", u"规格", u"单位", u"件数", u"数量", u"进货仓库", u"出货仓库", u"货单类型", u"入库价", u"出库价", u"订单备注", u"项目备注"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"货单-销售", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出货单-销售脚本说明:
            根据查询条件,以分页拿数据的方式导出货单-销售;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        0(创建时间) 1(货单时间)
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_manifest_sales.py type pid args company
            python plan_export_inventory_manifest_sales.py   1  942 2018/12/01-2018/12/31 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
