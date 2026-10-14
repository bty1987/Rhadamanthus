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
            o.no,
            d.orderId,
            su.currentName,
            CONCAT(v.name, h.houseNumber),
            h.buildArea,
            g.no,
            g.name,
            g.measurementUnit,
            oi.num,
            oi.sennum,
            oc.price,
            communion.kv('inventory', 'occessoriesCost', 'type', oc.type),
            c.name,
            up.currentName
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                inventory.occessories o
                left join inventory.occessoriescost oc on o.oid = oc.oid,
                inventory.occessoriesItem oi,
                communion.company c,
                communion.village v,
                communion.house h,
                data.goods g,
                communion.user up,
                communion.user su
            WHERE
                o.oid = oi.oid
                AND o.spuid = up.uid
                AND o.svuid = su.uid
                AND d.company = c.cid
                AND o.orderId = d.orderId
                AND d.hid = h.hid
                AND v.vid = h.vid
                AND oi.gid = g.gid
                AND o.createTime >= '%s 00:00:00'
                AND o.createTime <= '%s 23:59:59'
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

        # 费用类型列已由SQL层communion.kv翻译, rower仅做金额量纲处理
        self.divNum(row, [4, 8, 9, 10])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"外辅单号", u"装修单号", u"监理姓名", u"楼盘地址", u"建筑面积", u"商品编号", u"商品名称", u"单位", u"数量",
            u"送货数量", u"费用金额", u"类型", u"公司", u"厂商"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"外辅单", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出外辅单脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅单;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2021/01/01-2021/09/24"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_inventory_occessories.py pid   args                   company
             plan_export_inventory_occessories.py 1482  "2021/01/01-2021/09/24"  1
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
