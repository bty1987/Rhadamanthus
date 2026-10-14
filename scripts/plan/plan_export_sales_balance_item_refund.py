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
        self.size = 200

        self.colum = u"""
            s.orderId,
            cc.name,
            s.no,
            uc.name,
            communion.kv('decoration', 'decoration', 'status', d.status),
            CONCAT(v.name, CONCAT(' ', h.houseNumber)),
            b.name,
            s.category,
            gk0.name,
            gk1.name,
            gk2.name,
            gk3.name,
            du.userId,
            du.currentName,
            eu.userId,
            eu.currentName,
            sdr.no,
            sdr.alias,
            sdd.no,
            sdd.alias,
            dr.no,
            dr.alias,
            dd.no,
            dd.alias,
            s.total,
            s.coupon,
            s.couponInfo,
            cru.userId,
            cru.currentName,
            iu.userId,
            iu.currentName,
            gu.userId,
            gu.currentName,
            sb.balance,
            sb.createTime,
            cu.currentName,
            sb.vbalance,
            sb.pbalance,
            sb.allowance,
            sb.postTime,
            pu.currentName,
            s.maling,
            s.venderMaling,
            communion.kv('sales', 'salesbalance', 'status', sb.status),
            communion.kv('sales', 'salesbalance', 'type', sb.type),
            g.name,
            g.no,
            c.name,
            f.info,
            sitem.selling,
            sitem.disPrice,
            sitem.price,
            communion.kv('data', 'price', 'type', sitem.priceType),
            ritem.num,
            ritem.total,
            communion.kv('sales', 'salesItem', 'ctype', sitem.ctype),
            sitem.cvalue,
            sb.createTime,
            b.kino,
            b.kiname,
            s.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                sales.salesbalance sb
                LEFT JOIN sales.salesrefunds r ON sb.rid = r.rid
                LEFT JOIN sales.salesrefundsitem ritem ON r.rid = ritem.rid
                LEFT JOIN sales.salesitem sitem ON ritem.siid = sitem.siid
                LEFT JOIN sales.sales s ON sitem.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN communion.house h ON s.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.department sdr ON db.rid = sdr.did
                LEFT JOIN communion.department sdd ON db.did = sdd.did
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user iu ON s.iuid = iu.uid
                LEFT JOIN communion.user cu ON sb.cuid = cu.uid
                LEFT JOIN communion.user pu ON sb.puid = pu.uid
                LEFT JOIN communion.user gu ON s.guid = gu.uid
                LEFT JOIN communion.user cru ON s.cuid = cru.uid
                LEFT JOIN data.goods g ON sitem.gid = g.gid
                LEFT JOIN data.color c ON sitem.cid = c.cid
                LEFT JOIN data.format f ON sitem.fid = f.fid
                LEFT JOIN communion.company cc ON s.dompany = cc.cid
                LEFT JOIN communion.company uc ON s.company = uc.cid
                LEFT JOIN communion.brand b ON s.bid = b.bid
                LEFT JOIN data.goodskind gk0 ON g.zerokind = gk0.gkid
                LEFT JOIN data.goodskind gk1 ON g.onekind = gk1.gkid
                LEFT JOIN data.goodskind gk2 ON g.twokind = gk2.gkid
                LEFT JOIN data.goodskind gk3 ON g.thrkind = gk3.gkid
            WHERE
                %s >= '%s 00:00:00' AND
                %s <= '%s 23:59:59' AND
                s.type = %s
                %s
        """

    def timetype(self, timeType):

        column = "sb.createTime"

        if timeType == "0":
            column = "sb.createTime"
        elif timeType == "1":
            column = "sb.postTime"
        elif timeType == "2":
            column = "s.createTime"

        return column

    def company(self, companyType, company):

        companyId = u" "
        if company != 0:
            if companyType == "0":
                companyId = u"AND s.company = %s " % company
            elif companyType == "1":
                companyId = u"AND s.pompany = %s " % company
        else:
            companyId = u" "

        return companyId

    def sqler(self, timeType, companyType, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = self.timetype(timeType)

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, type, self.company(companyType, company))

    def rower(self, row):

        # 装修单状态/结算状态/结算类型/价格类型/结算方式已由SQL层communion.kv翻译
        # 原尾部的统计类别/一类/二类/三类重复列已去除, 列数与表头61列对齐
        self.divNum(row, [24, 25, 33, 36, 37, 38, 41, 42, 49, 50, 51, 53, 54, 56])

        if row[36] == None: row[36] = u'无'; row[37] = u'无'

        return row

    def main(self, timeType, companyType, type, pid, args, company):

        tableheads = [
            u"装修单号", u"装修单公司", u"销售单号", u"销售公司", u"销售单状态", u"楼盘地址", u"品牌", u"品类", u"统计类别", u"一类",
            u"二类", u"三类", u"设计师编号", u"设计师", u"方案设计编号", u"方案设计", u"签约设计大区编号", u"签约设计大区", u"签约设计部门编号", u"签约设计部门",
            u"设计师大区编号", u"设计师大区", u"设计师部编号", u"设计师部", u"销售总价", u"券值", u"券信息", u"创建人工号", u"创建人", u"驻店工号",
            u"驻店", u"导购工号", u"导购", u"预结算值", u"预结算时间", u"预结算人", u"厂商结算", u"结算值", u"补贴", u"结算时间",
            u"结算人", u"抹零", u"厂商抹零", u"状态", u"类型", u"商品名称", u"商品编号", u"商品颜色", u"商品规格", u"售价",
            u"折扣价", u"折让价", u"价格类型", u"数量", u"销售项总价", u"结算方式", u"结算值", u"审批时间", u"金蝶编号", u"金蝶名称",
            u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(timeType, companyType, type, args, company)

        self.exporter(pid, args, u"销售结算-退货", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出销售结算退货脚本说明:
            根据查询条件,以分页拿数据的方式导出销售结算;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.timeType        自动获取查询条件时间字段
            2.companyType        自动获取查询条件公司
            3.type        销售单类型
            4.pid         information.plan的主键;
            5.args        "2018/12/13-2018/12/13"
            6.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_sales_balance_item_refund.py   timeType       companyType      type   pid              args                company
             plan_export_sales_balance_item_refund.py      0                1           0     299       2020/04/01-2020/04/30         1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    timeType = sys.argv[1]
    companyType = sys.argv[2]
    type = sys.argv[3]
    pid = sys.argv[4]
    args = sys.argv[5]
    company = sys.argv[6] if len(sys.argv) > 6 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(timeType, companyType, type, pid, args, int(company))
