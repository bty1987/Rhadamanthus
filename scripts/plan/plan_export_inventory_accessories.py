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
            a.orderId,
            a. NO,
            v. NAME,
            h.houseNumber,
            sv.userId,
            sv.userName,
            au.userName,
            m.manifestTime,
            m.`code`,
            cu.userName,
            g.brand,
            g.`no`,
            g.`name`,
            g.measurementUnit,
            mi.num,
            f.info,
            c.`name`,
            ish.`name`,
            osh.`name`,
            m.type,
            d.`grade`,
            d.paySacle,
            co.name,
            a.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.accessories a,
                decoration.decoration d
                LEFT JOIN communion.`user` sv on d.svuid = sv.uid,
                inventory.accessoriesitem ai,
                inventory.accessoriesmanifest am,
                inventory.manifest m,
                inventory.manifestitem mi
                LEFT JOIN inventory.storehouse ish ON mi.ishid = ish.shid
                LEFT JOIN inventory.storehouse osh ON mi.oshid = osh.shid,
                data.goods g,
                data.format f,
                data.color c,
                communion.house h,
                communion.village v,
                communion.`user` au,
                communion.`user` cu,
                communion.company co
            WHERE
                a.orderId = d.orderId
                AND a.aid = am.aid
                AND a.aid = ai.aid
                AND am.mid = m.mid
                AND m.mid = mi.mid
                AND ai.gid = mi.gid
                AND mi.gid = g.gid
                AND mi.cid = c.cid
                AND mi.fid = f.fid
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND m.cuid = au.uid
                AND a.cuid = cu.uid
                AND mi.aiid = ai.aiid
                AND d.company = co.cid
                AND m.manifestTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
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

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("a.company", company))

    def rower(self, row):

        self.divNum(row, [14, 21])

        if (row[17] is None): row[17] = ""
        if (row[18] is None): row[18] = ""
        row[19] = self.accessoriesType[row[19]]

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"辅料单号", u"楼盘", u"楼号", u"监理工号", u"监理", u"审批人", u"审批时间", u"货单编号", u"创建人",
            u"品牌", u"商品编号", u"商品名称", u"单位", u"数量", u"规格", u"颜色", u"入货仓库", u"出货仓库", u"类型",
            u"等级", u"付款比例", u"公司名", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"辅料单", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出辅料单脚本说明:
            根据查询条件,以分页拿数据的方式导出辅料单;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_accessories.py pid args company
            python plan_export_inventory_accessories.py 942 2018/12/13-2018/12/13 1
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
