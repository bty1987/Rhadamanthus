#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
    
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.size = 400

        self.colum = """
            o.no AS `外辅单号`,
            d.orderId AS `装修单号`,
            CONCAT(v.name, h.houseNumber) AS `楼盘地址`,
            su.userId AS `监理工号`,
            su.currentName AS `监理姓名`,
            communion.kv('inventory', 'occessories', 'loadFloor', o.loadFloor) AS `上料楼层`,
            g.no AS `商品编号`,
            g.name AS `商品名称`,
            g.measurementUnit AS `商品单位`,
            oi.num AS `材料数量`,
            c.name AS `公司`,
            up.currentName AS `厂商`,
            cu.currentName AS `创建人`,
            o.createTime AS `创建时间`,
            o.deliveTime AS `送货时间`,
            o.receiveTime AS `到货时间`,
            o.balanceTime AS `结算时间`,
            communion.kv('inventory', 'occessories', 'status', o.status) AS `状态`,
            oi.vbalance AS `结算价`,
            oi.num * oi.vbalance / 1000 AS `结算金额`,
            communion.kv('inventory', 'occessories', 'isLift', o.isLift) AS `有无电梯`,
            communion.kv('inventory', 'occessories', 'isExceed', o.isExceed) AS `有无超阶`,
            communion.kv('inventory', 'occessories', 'isAttic', o.isAttic) AS `有无阁楼`,
            o.comment AS `外辅单备注`,
            o.content AS `厂商备注`,
            d.grade AS `装修单等级`,
            o.rbalance AS `材料金额`,
            o.charge AS `费用金额`,
            o.vbalance AS `材料结算额`,
            o.rcharge AS `费用结算额`,
            oc.name AS `费用名称`,
            oc.num AS `费用数量`,
            oc.price AS `费用单价`,
            oc.num * oc.price / 1000 AS `费用小计`,
            o.remark AS `备注`
        """

        self.SELECT_SQL = """
            SELECT
                %s
            FROM
                inventory.occessories o
                LEFT JOIN inventory.occessoriesItem oi ON o.oid = oi.oid
                LEFT JOIN inventory.occessoriescharge oc ON oi.oiid = oc.oiid
                LEFT JOIN decoration.decoration d on o.orderId = d.orderId
                LEFT JOIN communion.company c on d.company = c.cid
                LEFT JOIN communion.house h on d.hid = h.hid
                LEFT JOIN communion.village v on v.vid = h.vid
                LEFT JOIN data.goods g on oi.gid = g.gid
                LEFT JOIN communion.user up on o.spuid = up.uid
                LEFT JOIN communion.user su on o.svuid = su.uid
                LEFT JOIN communion.user cu on o.cuid = cu.uid
            WHERE
                o.receiveTime >= '%s 00:00:00'
                AND o.receiveTime <= '%s 23:59:59'
                %s
            GROUP BY
                oc.acid, oi.oiid, oc.num
            HAVING
                oc.num IS NULL OR oc.num != 0
        """

    def sqler(self, timeargs, company):

        startTime, endTime = timeargs.split("-")
        
        if company != 0:
            companyId = " AND d.company = %s" % (company)
        else:
            companyId = " "

        return self.SELECT_SQL % ("%s", startTime, endTime, companyId)

    def rower(self, row):
    
        self.divNum(row, [9, 18, 19, 26, 27, 28, 29, 31, 32, 33])
        
        return row

    def main(self, pid, args, company):

        tableheads = [
            "外辅单号", "装修单号", "楼盘地址", "监理工号", "监理姓名", "上料楼层",
            "商品编号", "商品名称", "商品单位", "材料数量",
            "公司", "厂商", "创建人", "创建时间", "送货时间", "到货时间", "结算时间", "状态",
            "结算价", "结算金额",
            "有无电梯", "有无超阶", "有无阁楼",
            "外辅单备注", "厂商备注", "装修单等级",
            "材料金额", "费用金额", "材料结算额", "费用结算额",
            "费用名称", "费用数量", "费用单价", "费用小计", "备注"
        ]
    
        sql = self.sqler(args, company)
    
        self.exporter(pid, args, "外辅费用", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出外辅费用脚本说明:
            根据查询条件,以分页拿数据的方式导出外辅费用;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid information.plan的主键;
            2.args 时间范围 "2022/03/07-2022/03/24"
            3.company 公司cid, 0为全部
        2.脚本传参说明:
            plan_export_inventory_occessories_charge.py pid        args           company
            plan_export_inventory_occessories_charge.py  299 2024/01/01-2024/01/01    1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
