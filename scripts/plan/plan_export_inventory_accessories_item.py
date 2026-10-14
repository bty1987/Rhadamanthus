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
            v. NAME,
            h.houseNumber,
            a. NO,
            sv.userName,
            au.userName,
            a.approverTime,
            m.`code`,
            cu.userName,
            g.brand,
            g.`no`,
            g.`name`,
            g.measurementUnit,
            mi.num,
            osh.`name`,
            act.`name`,
            c.`name`,
            d.`grade`
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.accessories a,
                decoration.decoration d
                LEFT JOIN communion.`user` sv ON d.svuid = sv.uid,
                inventory.accessoriesitem ai,
                inventory.accessoriesmanifest am,
                inventory.manifest m,
                inventory.manifestitem mi
                LEFT JOIN inventory.storehouse osh ON mi.oshid = osh.shid,
                data.goods g
                LEFT JOIN inventory.accessoriestype act ON g.atid = act.atid,
                communion.house h,
                communion.village v,
                communion.`user` au,
                communion.`user` cu,
                communion.company c
            WHERE
                a.orderId = d.orderId AND
                a.aid = am.aid AND
                a.aid = ai.aid AND
                am.mid = m.mid AND
                m.mid = mi.mid AND
                ai.gid = mi.gid AND
                mi.gid = g.gid AND
                d.hid = h.hid AND
                h.vid = v.vid AND
                m.cuid = au.uid AND
                a.cuid = cu.uid AND
                mi.aiid = ai.aiid AND
                a.company = c.cid AND
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        if type == 0:
            startTime, endTime = args.split("-")
            condition = u" a.approverTime >= '%s 00:00:00' AND a.approverTime <= '%s 23:59:59' %s" % (startTime, endTime, self.company("a.company", company))
        else:
            condition = u" a.orderId = '%s'" % (args)

        return self.SQL_QUERY % ("%s", condition)

    def rower(self, row):

        self.divNum(row, [13])

        if (row[15] is None): row[15] = ""

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"辅料单号", u"监理", u"审批人", u"审批时间", u"货单编号", u"创建人", u"品牌",
            u"商品编号", u"商品名称", u"单位", u"数量", u"出货仓库", u"辅类", u"辅料单公司", u"等级"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, (args if type == 0 else ""), u"导出辅料项", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出辅料项脚本说明:
            根据查询条件,以分页拿数据的方式导出辅料项;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        0(按审批时间区间) 1(按装修单号, args传装修单号)
            2.pid         information.plan的主键;
            3.args        type=0: "2020/05/01-2020/05/31"  type=1: 装修单号
            4.company     公司cid, 0为全部(不传默认0), 仅type=0时生效

        2.使用
            python plan_export_inventory_accessories_item.py type pid args company
            python plan_export_inventory_accessories_item.py 0 199 2020/05/01-2020/05/31 1
            python plan_export_inventory_accessories_item.py 1 199 202005010001 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = int(sys.argv[1])
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
