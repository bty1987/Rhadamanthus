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

        # 布尔字典照 communion.constant 实况(inventory/occessories), rower 本地翻译,
        # 不走 communion.kv(28万行×5次constant子查询会拖垮导出)
        self.isEnter = {0: u"可", 1: u"不"}
        self.isLift = {0: u"有", 1: u"无"}
        self.isExceed = {0: u"有", 1: u"无"}
        self.isAttic = {0: u"有", 1: u"无"}

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
            c.name,
            up.currentName,
            cu.currentName,
            o.createTime,
            o.deliveTime,
            o.receiveTime,
            o.balanceTime,
            communion.kv('inventory', 'occessories', 'status', o.status),
            oi.rbalance,
            oi.vbalance,
            oi.sennum * oi.vbalance / 1000,
            o.isEnter,
            o.isLift,
            o.isExceed,
            o.isAttic,
            o.comment,
            o.content,
            d.grade
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
                data.goods g,
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
                %s
            ORDER BY
                oi.oiid
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND d.company = %s" % company
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = "createTime"
        if type == "0":
            timeColumn = "createTime"
        elif type == "1":
            timeColumn = "receiveTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

    def rower(self, row):

        # 结算金额(sennum*vbalance)为×10⁶口径, SQL层已/1000降到×1000口径, 此处随金额列统一÷1000
        self.divNum(row, [4, 8, 9, 18, 19, 20])

        row[21] = self.isEnter[row[21]]
        row[22] = self.isLift[row[22]]
        row[23] = self.isExceed[row[23]]
        row[24] = self.isAttic[row[24]]

        return row

    def main(self, pid, type, args, company):

        tableheads = [
            u"外辅单号", u"装修单号", u"监理姓名", u"楼盘地址", u"建筑面积", u"商品编号", u"商品名称", u"单位", u"数量",
            u"送货数量", u"公司", u"厂商", u"创建人", u"创建时间", u"送货时间", u"到货时间", u"结算时间", u"状态",
            u"原结算价", u"结算价",u"结算金额", u"可进园区", u"有无电梯", u"有无超阶", u"有无阁楼",
            u"外辅单备注（创建时监理填的）", u"备注（厂商填的）", u"装修单等级"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"外辅项", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出外辅项脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅项;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        创建时间 0/到货时间 1
            2.pid         information.plan的主键;
            3.args        "2022/03/07-2022/03/24"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_inventory_occessories_item.py type pid   args              company
             plan_export_inventory_occessories_item.py   1  1482  "2022/03/07-2022/03/24"  1
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
    exporter.main(pid, type, args, int(company))
