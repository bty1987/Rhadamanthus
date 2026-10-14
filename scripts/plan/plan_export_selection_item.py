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
        self.size = 400

        self.colum = u"""
            d.orderId,
            v.name,
            h.housenumber,
            su.userId,
            su.currentName,
            du.userId,
            du.currentName,
            dd.name,
            dr.name,
            d.contractTime,
            d.precontractTime,
            d.accountTime,
            c.createTime,
            h.buildArea,
            h.freeArea,
            h.innerArea,
            h.houseType,
            g.no,
            g.name,
            g.category,
            g.brand,
            communion.kv('quotation', 'selectionitem', 'type', si.type),
            si.num,
            si.refnum,
            si.num-si.refnum,
            si.initnum,
            si.preprice,
            si.postprice,
            si.balanceTime,
            communion.kv('quotation', 'selectionitem', 'status', si.status),
            si.comment,
            si.areaName,
            si.preprice,
            bu.currentName,
            bu.userId,
            ju.currentName,
            ju.userId,
            si.finishTime,
            ocu.currentName,
            co.name,
            b.kiname,
            b.kino,
            communion.kv('balance', 'balance', 'ispay', b.ispay),
            b.payedtime
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                quotation.selectionitem si
                LEFT JOIN quotation.selection s ON si.sid = s.sid
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN decoration.decoration d ON si.orderId = d.orderId
                LEFT JOIN construction.construction c ON d.orderId = c.orderId
                LEFT JOIN construction.acceptance ca ON d.orderId = ca.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user su ON d.smuid = su.uid
                LEFT JOIN communion.user bu ON si.buid = bu.uid
                LEFT JOIN communion.user ju ON d.svuid = ju.uid
                LEFT JOIN communion.brand b ON g.bid = b.bid
                LEFT JOIN communion.user ocu ON b.ocuid = ocu.uid
                LEFT JOIN communion.company co ON d.company = co.cid
                LEFT JOIN balance.balanceselectionitem bsi ON si.siid = bsi.siid
                LEFT JOIN balance.balanceselection bs ON bsi.bsid = bs.bsid
                LEFT JOIN balance.balance b ON bs.bid = b.bid
            WHERE
                %s
                %s
        """

    def datetime(self, type, beginTime, endTime):

        if type == "0":
            _type = "si.balanceTime"
        elif type == "1":
            _type = "si.createTime"
        elif type == "2":
            _type = "si.finishTime"
        elif type == "3":
            _type = "d.accountTime"
        elif type == "4":
            _type = "ca.acceptanceTime"
        else:
            return " "

        return "%s >= '%s 00:00:00' AND %s <= '%s 23:59:59'" % (_type, beginTime, _type, endTime)

    def company(self, columnCompany, company):

        if company != 0:
            companyId = u"AND %s = %s" % (columnCompany, company)
        else:
            companyId = u" "

        return companyId

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY % ("%s", self.datetime(type, startTime, endTime), self.company("si.company", company))

    def rower(self, row):

        # 选材类型/状态已由SQL层communion.kv翻译, rower仅做面积/数量/单价÷1000
        self.divNum(row, [13, 14, 15, 22, 23, 24, 25, 26, 27])

        return row

    def main(self, pid, type, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"地址", u"业务员工号", u"业务员", u"设计师工号", u"设计师", u"设计部", u"设计分区", u"签单时间",
            u"预签时间", u"决算时间", u"开工时间", u"建筑面积", u"赠送面积", u"套内面积", u"户型", u"商品编号", u"商品名称", u"品类",
            u"品牌", u"选材类型", u"选材数量", u"退货数量", u"剩余数量", u"工程量", u"报价项单价", u"结算价", u"结算时间", u"状态",
            u"备注", u"功能区", u"预算金额", u"结算人", u"结算人工号", u"监理", u"监理工号", u"完结时间", u"供应商", u"公司",
            u"金蝶名称", u"金蝶编号", u"付款状态", u"付款时间"
        ]

        if type not in ("0", "1", "2", "3", "4"):
            self.updataSchedule(self.pthost, pid, {
                u"plan.status": 3,
                u"plan.info": u'时间类型有误'
            })
            return False

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"选材结算导出", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出选材项脚本说明:
            根据查询条件,以分页拿数据的方式导出选材项;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        结算时间 0/创建时间 1/完结时间 2/决算时间 3/开工验收时间 4
            2.pid         information.plan的主键;
            3.args        "2020/06/01-2020/06/30"
            4.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_selection_item.py type pid args company
            python plan_export_selection_item.py 1 942 2020/06/01-2020/06/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args, int(company))
