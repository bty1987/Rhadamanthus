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

        self.colunm = u"""
            o.no AS `外辅单号`,
            d.orderId AS `装修单号`,
            su.currentName AS `监理姓名`,
            CONCAT(v.name, h.houseNumber) AS `楼盘地址`,
            h.buildArea AS `建筑面积`,
            g.no AS `商品编号`,
            g.name AS `商品名称`,
            g.measurementUnit AS `单位`,
            oi.num AS `数量`,
            oi.sennum AS `送货数量`,
            c.name AS `公司`,
            up.currentName AS `厂商`,
            cu.currentName AS `创建人`,
            o.createTime AS `创建时间`,
            o.deliveTime AS `送货时间`,
            o.receiveTime AS `到货时间`,
            o.balanceTime AS `结算时间`,
            communion.kv('inventory', 'occessories', 'status', o.status),
            oi.rbalance AS '原结算价',
            oi.vbalance AS '结算价',
            oi.sennum*oi.vbalance AS '结算金额',
            o.isEnter AS '可进园区',
            o.isLift AS '有无电梯',
            o.isExceed AS '有无超阶',
            o.isAttic AS '有无阁楼',
            o.comment AS '外辅单备注（创建时监理填的）',
            o.content AS '备注（厂商填的）',
            d.grade AS `装修单等级`
        """
        
        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                inventory.occessories o,
                inventory.occessoriesItem oi,
                communion.company c,
                communion.village v,
                communion.house h,
                inventory.goods g,
                communion.user up,
                communion.user su,
                communion.user cu
            WHERE
                o.oid = oi.oid
                AND o.spuid = up.uid
                AND o.svuid = su.uid
                AND o.cuid = cu.uid
                AND d.company = c.cid
                AND o.orderId = d.orderId
                AND d.hid = h.hid
                AND v.vid = h.vid
                AND oi.gid = g.gid
                AND o.%s >= '%s 00:00:00'
                AND o.%s <= '%s 23:59:59'
            ORDER BY
                oi.oiid
        """

    def sqler(self, type, args):

        startTime, endTime = args.split("-")

        timeColumn = "createTime"
        if type == "0":
            timeColumn = "createTime"
        elif type == "1":
            timeColumn = "receiveTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime)

    def rower(self, row):

        self.divNum(row, [4, 8, 9, 18, 19, 20])

        row[21] = self.isEnter[row[21]]
        row[22] = self.isLift[row[22]]
        row[23] = self.isExceed[row[23]]
        row[24] = self.isAttic[row[24]]

        return row

    def main(self, pid, type, args):

        tableheads = [
            u"外辅单号", u"装修单号", u"监理姓名", u"楼盘地址", u"建筑面积", u"商品编号", u"商品名称", u"单位", u"数量",
            u"送货数量", u"公司", u"厂商", u"创建人", u"创建时间", u"送货时间", u"到货时间", u"结算时间", u"状态",
            u"原结算价", u"结算价",u"结算金额", u"可进园区", u"有无电梯", u"有无超阶", u"有无阁楼",
            u"外辅单备注（创建时监理填的）", u"备注（厂商填的）", u"装修单等级"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args)

        self.exporter(pid, args, u"外辅项", tableheads, self.colunm, sql, self.rower)

if __name__ == '__main__':

    """
        导出外辅项脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅项;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        创建时间 0/到货时间 1
            2.pid         information.plan的主键;
            3.args        "2022/03/07-2022/03/24"
        2.脚本传参说明:
             plan_export_inventory_occessories_item.py type pid   args
             plan_export_inventory_occessories_item.py   1  1482  "2022/03/07-2022/03/24"
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args)
