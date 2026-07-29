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

        self.colum = """
            s.orderId AS '装修单号',
            cc.name AS '装修公司',
            s.no AS '销售单号',
            uc.name AS '销售公司',
            communion.kv('sales', 'sales', 'status', s.status) AS '销售状态',
            CONCAT(v.name, CONCAT(' ', h.houseNumber)) AS '楼盘地址',
            b.name AS '品牌',
            s.category AS '品类',
            gk0.name AS '统计类别',
            gk1.name AS '一类',
            gk2.name AS '二类',
            gk3.name AS '三类',
            du.userId AS '设计师编号',
            du.currentName AS '设计师',
            eu.userId AS '方案设计编号',
            eu.currentName AS '方案设计',
            sdr.no AS '签约设计大区编号',
            sdr.alias AS '签约设计大区',
            sdd.no AS '签约设计部编号',
            sdd.alias AS '签约设计部',
            dr.no AS '设计师大区编号',
            dr.alias AS '设计师大区',
            dd.no AS '设计师部编号',
            dd.alias AS '设计师部',
            s.fullpayTime AS '补款时间',
            s.coupon AS '劵值',
            s.couponInfo AS '劵信息',
            cru.userId AS '创建人工号',
            cru.currentName AS '创建人',
            uu.userId AS '驻店工号',
            uu.currentName AS '驻店',
            gu.userId AS '导购工号',
            gu.currentName AS '导购',
            sb.balance AS '预结算值',
            sb.createTime AS '预结时间',
            cu.currentName AS '预结算人',
            sb.vbalance AS '厂商结算',
            sb.pbalance AS '结算值',
            sb.allowance AS '补贴',
            sb.postTime AS '结算时间',
            pu.currentName AS '结算人',
            s.maling AS '抹零',
            s.venderMaling AS '厂商抹零',
            communion.kv('sales', 'salesbalance', 'status', sb.status) AS '结算状态',
            communion.kv('sales', 'salesbalance', 'type', sb.type) AS '结算类型',
            g.name AS '商品名称',
            g.no AS '商品编号',
            c.name AS '颜色',
            f.info AS '规格',
            item.selling AS '售价',
            item.disPrice AS '折扣价',
            item.price AS '折让价',
            item.priceType AS '价格类型',
            item.num AS '数量',
            item.total AS '销售项总价',
            item.ctype AS '结算方式',
            item.cvalue AS '结算值',
            sbi.num AS '原数',
            b.kino AS '金蝶编号',
            b.kiname AS '金蝶名称',
            s.comment AS '备注'
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                sales.salesbalance sb
                LEFT JOIN sales.sales s ON sb.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid
                LEFT JOIN sales.salesitem item ON item.siid = sbi.siid
                LEFT JOIN communion.house h ON s.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.department sdd ON db.did = sdd.did
                LEFT JOIN communion.department sdr ON db.rid = sdr.did
                LEFT JOIN communion.department dd ON du.did = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user uu ON s.iuid = uu.uid
                LEFT JOIN communion.user gu ON s.guid = gu.uid
                LEFT JOIN communion.user cu ON sb.cuid = cu.uid
                LEFT JOIN communion.user pu ON sb.puid = pu.uid
                LEFT JOIN communion.user cru ON s.cuid = cru.uid
                LEFT JOIN data.goods g ON item.gid = g.gid
                LEFT JOIN data.color c ON item.cid = c.cid
                LEFT JOIN data.format f ON item.fid = f.fid
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
                sb.onetype = 0 AND
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

        companyId = ""
        if company != 0:
            if companyType == "0":
                companyId = "AND s.company = %s " % company
            elif companyType == "1":
                companyId = "AND s.pompany = %s " % company
        else:
            companyId = " "
        return companyId

    def sqler(self, timeType, companyType, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = self.timetype(timeType)

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, type, self.company(companyType, company))

    def rower(self, row):

        self.divNum(row, [25, 33, 36, 37, 38, 41, 42, 49, 50, 51, 53, 54, 56, 57])

        if row[52]: row[52] = self.salesPriceType[row[52]]
        if row[55]: row[55] = self.salesCType[row[55]]

        if row[39] == None: row[39] = u'无'; row[40] = u'无'

        return row

    def main(self, timeType, companyType, type, pid, args, company):

        tableheads = [
            "装修单号", "装修公司", "销售单号", "销售公司", "销售单状态", "楼盘地址", "品牌", "品类", "统计类别", "一类",
            "二类", "三类", "设计师编号", "设计师", "方案设计编号", "方案设计", "签约设计大区编号", "签约设计大区", "签约设计部编号", "签约设计部门",
            "设计师大区编号", "设计师大区", "设计师部编号", "设计师部", "补款时间", "券值", "券信息", "创建人工号", "创建人", "驻店工号",
            "驻店", "导购工号", "导购", "预结算值", "预结算时间", "预结算人", "厂商结算", "结算值", "补贴", "结算时间",
            "结算人", "抹零", "厂商抹零", "状态", "类型", "商品名称", "商品编号", "商品颜色", "商品规格", "售价",
            "折扣价", "折让价", "价格类型", "数量", "销售项总价", "结算方式", "结算值", "原数", "金蝶编号", "金蝶名称",
            "备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(timeType, companyType, type, args, company)

        self.exporter(pid, args, "销售结算-购货", tableheads, self.colum, sql, self.rower)


if __name__ == '__main__':

    """
        导出销售结算脚本说明:
            根据查询条件,以分页拿数据的方式导出销售结算;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.timeType        自动获取查询条件时间字段
            2.companyType        自动获取查询条件公司
            3.pid         information.plan的主键;
            4.args        "2018/12/13-2018/12/13"
            5.company     公司:1
        2.脚本传参说明:
             plan_export_sales_balance_item_sales.py   timeType       companyType      pid              args                company
             plan_export_sales_balance_item_sales.py      0                1           299       2020/04/01-2020/04/30         1

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
    company = sys.argv[6]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(timeType, companyType, type, pid, args, int(company))
