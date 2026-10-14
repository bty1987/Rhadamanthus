#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host="", username="", password="", media="", pthost="", charset="utf8"):

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

        self.colum = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.houseNumber AS `地址`,
            h.buildarea AS `面积`,
            c.name AS `客户名`,
            du.currentname AS `设计师`,
            su.currentname AS `业务员`,
            eu.currentname AS `跟单员`,
            sv.currentname AS `监理`,
            sv.phone AS `监理电话`,
            sp.currentname AS `厂商`,
            sp.phone AS `厂商电话`,
            g.no AS `商品编号`,
            g.name AS `商品名称`,
            g.category AS `品类`,
            g.brand AS `品牌`,
            si.areaName AS `功能区`,
            communion.kv('quotation', 'selectionitem', 'type', si.type) AS `类型`,
            communion.kv('quotation', 'selectionitem', 'status', si.status) AS `状态`,
            qv.name AS `报价版本`,
            si.preprice AS `预算金额`,
            si.postprice AS `结算价`,
            si.initnum AS `预算量`,
            si.num AS `拆单量`,
            (si.num - si.refnum) AS `实用量`,
            si.refnum AS `退货量`,
            sicu.currentname AS `创建人`,
            spu.currentname AS `拆单员`,
            si.createTime AS `拆单时间`,
            stu.currentname AS `下单员`,
            situ.currentname AS `配送人`,
            si.tranTime AS `下单时间`,
            sichu.currentname AS `审核人`,
            si.checkTime AS `审核时间`,
            sicou.currentName AS `确认人`,
            si.confirmTime AS `确认时间`,
            sifu.currentname AS `完结人`,
            si.finishTime AS `完结时间`,
            siru.currentName AS `核对人`,
            si.reviewTime AS `核对时间`,
            sibu.currentname AS `结算人`,
            si.balanceTime AS `结算时间`,
            si.comment AS `备注`,
            communion.kv('balance', 'balance', 'ispay', b.ispay) '付款状态',
            b.payedtime '付款时间'
        """

        self.EXPORTER_SQL_STR = """
            SELECT
                %s
            FROM
                quotation.selectionitem si
                LEFT JOIN quotation.selection s ON si.sid = s.sid
                LEFT JOIN decoration.decoration d ON si.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer c ON d.customerid = c.cid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.user su ON d.smuid = su.uid
                LEFT JOIN communion.user sv ON d.svuid = sv.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN quotation.quotationversion qv ON d.versionid = qv.no
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN communion.user sp ON si.suid = sp.uid
                LEFT JOIN communion.user sicu ON si.cuid = sicu.uid
                LEFT JOIN communion.user situ ON si.tuid = situ.uid
                LEFT JOIN communion.user sichu ON si.chuid = sichu.uid
                LEFT JOIN communion.user sicou ON si.couid = sicou.uid
                LEFT JOIN communion.user sifu ON si.fuid = sifu.uid
                LEFT JOIN communion.user siru ON si.ruid = siru.uid
                LEFT JOIN communion.user sibu ON si.buid = sibu.uid
                LEFT JOIN communion.user spu ON s.suid = spu.uid
                LEFT JOIN communion.user stu ON s.tuid = stu.uid
                LEFT JOIN balance.balanceselectionitem bsi ON si.siid = bsi.siid
                LEFT JOIN balance.balanceselection bs ON bsi.bsid = bs.bsid
                LEFT JOIN balance.balance b ON bs.bid = b.bid
            WHERE
                si.createtime >= '%s 00:00:00' AND
                si.createtime <= '%s 23:59:59' AND
                si.company = %s
        """

    def sqler(self, timeargs, company):
    
        startTime, endTime = timeargs.split("-")
        
        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, company)

    def rower(self, row):
    
        self.divNum(row, [3, 20, 21, 22, 23, 24, 25])
        
        return row

    def main(self, pid, args, company):

        tableheads = [
            "装修单号", "楼盘", "地址", "面积", "客户名", "设计师", "业务员", "跟单员", "监理", "监理电话", "厂商",
            "厂商电话", "商品编号", "商品名称", "品类", "品牌", "功能区", "类型", "状态", "报价版本",
            "预算金额", "结算价", "预算量", "拆单量", "实用量", "退货量", "创建人", "拆单员", "拆单时间", "下单员",
            "配送人", "下单时间", "审核人", "审核时间", "确认人", "确认时间", "完结人", "完结时间", "核对人","核对时间",
            "结算人", "结算时间", "备注", "付款状态", "付款时间"
        ]
        
        self.getDBCursor(self.host, self.username, self.password, self.charset)
        
        sql = self.sqler(args, int(company))

        self.exporter(pid, args, "选材项", tableheads, self.colum, sql, self.rower)
            
if __name__ == "__main__":

    """
        导出选材行信息脚本说明:
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)
