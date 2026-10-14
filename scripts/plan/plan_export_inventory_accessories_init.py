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
            ac.no,
            ac.orderId,
            g.`name`,
            g.category,
            g.brand,
            g.measurementUnit,
            ai.num,
            g.pieceNum,
            cu.userName,
            ac.createTime,
            ac.`schedule`,
            d.`grade`,
            ac.`comment`
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
             FROM
                inventory.accessoriesitem ai,
                inventory.accessories ac,
                decoration.decoration d,
                data.goods g,
                communion.`user` cu
            WHERE
                ai.aid = ac.aid AND
                ac.orderId = d.orderId AND
                cu.uid = ac.cuid AND
                ai.gid = g.gid AND
                ac.`status` = 0 AND
                ac.createTime >= '%s 00:00:00' AND
                ac.createTime <= '%s 23:59:59'
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

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("ac.company", company))

    def rower(self, row):

        self.divNum(row, [6, 7])

        row[10] = self.projectStatus[row[10]]

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"辅料单号", u"装修单号", u"商品名称", u"品类", u"品牌", u"单位", u"数量", u"件数", u"创建人", u"创建时间",
            u"施工环节", u"等级", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"辅料单(初始)", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出辅料单脚本说明:
            根据查询条件,以分页拿数据的方式导出辅料单(初始);并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_accessories_init.py pid args company
            python plan_export_inventory_accessories_init.py 942 2018/12/13-2018/12/13 1
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
