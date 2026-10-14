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
        self.size = 100

        self.colum = """
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness)  AS '装修单类型',
            communion.kv('decoration', 'decoration', 'status', d.status) AS '装修单状态',
            d.contractTime AS '签单时间',
            dco.name AS '装修公司',
            s.no AS '销售单号',
            s.category AS '品类',
            b.name AS '品牌',
            dr.name AS '分区',
            dd.name AS '部门',
            cu.userId AS '创建人工号',
            cu.currentName AS '创建人',
            du.userid AS '渠道ID',
            du.currentname AS '渠道',
            iu.userid AS '驻店工号',
            iu.currentname AS '驻店工号',
            gu.userId AS '导购工号',
            gu.currentName AS '导购',
            su.currentname AS '设计师',
	        sd.name AS '设计部',
	        sr.name AS '设计分区',
            s.total AS '总价',
            s.coupon AS '券值',
            s.couponInfo AS '券信息',
            s.maling AS '抹零',
            s.venderMaling AS '厂商抹零',
            s.fullpaytime AS '补款时间',
            sco.name AS '销售公司',
            pc.name AS '款项公司',
            sb.balance AS '预结算值',
            sb.createTime AS '预结算时间',
            pru.currentname AS '预结算人',    
            sb.posttime AS '结算时间',
            pou.currentname AS '结算人',
            communion.kv('sales', 'salesbalance', 'type', sb.type) AS '结算类型',
            communion.kv('sales', 'salesbalance', 'onetype', sb.onetype) AS '结算类型',
            communion.kv('sales', 'salesbalance', 'status', sb.status) AS '结算状态',
            sb.allowance AS '补贴',
            g.no AS '商品编号',
            g.name AS '商品名称',
            c.name AS '商品颜色',
            f.info AS '商品规格',
            si.selling AS '售价',
            si.disPrice AS '折扣价',
            si.price AS '折让价',
            si.priceType AS '价格类型',
            si.num AS '数量',
            si.total AS '销售项总价',
            si.ctype AS '结算方式',
            si.cvalue  AS '结算值',
            b.kino AS '金蝶编号',
            b.kiname AS '金蝶名称',
            gk0.name AS '统计类别',
            gk1.name AS '一类',
            gk2.name AS '二类',
            gk3.name AS '三类'
        """

        self.SQL_EXPORT_SALES_BALABCE = """           
            SELECT
                %s
            FROM
                sales.salesbalance sb
                LEFT JOIN sales.salesbalanceitem sbi ON sb.sbid = sbi.sbid
                LEFT JOIN sales.sales s ON sb.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.department dd ON s.did = dd.did
                LEFT JOIN communion.department dr ON s.rid = dr.did
                LEFT JOIN communion.user iu ON iu.uid = s.iuid
                LEFT JOIN communion.user pru ON pru.uid = sb.cuid
                LEFT JOIN communion.user pou ON pou.uid = sb.puid
                LEFT JOIN communion.user su ON db.buid = su.uid
                LEFT JOIN communion.user gu ON s.guid = gu.uid
                LEFT JOIN communion.user cu ON s.cuid = cu.uid
                LEFT JOIN communion.department sd ON db.did = sd.did
                LEFT JOIN communion.department sr ON db.rid = sr.did
                LEFT JOIN communion.company dco ON d.company = dco.cid
                LEFT JOIN communion.company sco ON s.company = sco.cid
                LEFT JOIN communion.company pc ON s.pompany = pc.cid
                LEFT JOIN communion.brand b ON s.bid = b.bid
                LEFT JOIN sales.salesitem si ON sbi.siid = si.siid
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN data.color c ON si.cid = c.cid
                LEFT JOIN data.format f ON si.fid = f.fid
                LEFT JOIN data.goodskind gk0 ON g.zerokind = gk0.gkid
                LEFT JOIN data.goodskind gk1 ON g.onekind = gk1.gkid
                LEFT JOIN data.goodskind gk2 ON g.twokind = gk2.gkid
                LEFT JOIN data.goodskind gk3 ON g.thrkind = gk3.gkid
            WHERE
                %s
        """

    def rower(self, row):

        self.divNum(row, [23, 24, 26, 27, 31, 39, 44, 45, 46, 48, 49, 51])
        return row

    def sqler(self, cloumCompany, company, timeType, timeargs):

        startTime, endTime = timeargs.split("-")

        companyId = ""
        if company != 0:
            if cloumCompany == 0:
                companyId = "AND s.company = %s " % company
            elif cloumCompany == 1:
                companyId = "AND s.dompany = %s " % company
            elif cloumCompany == 2:
                companyId = "AND s.pompany = %s " % company
        else:
            companyId = " "

        column = ''
        if timeType == 0:
            column = "sb.createTime"
        elif timeType == 1:
            column = "sb.postTime"
        condition = " %s >= '%s 00:00:00' AND %s <= '%s 23:59:59' AND s.type = %s %s" %(column, startTime, column, endTime, type, companyId)

        return self.SQL_EXPORT_SALES_BALABCE % ("%s", condition)

    def main(self, timeType, companyType, type, pid, args, company):
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableheads = [
            "装修单号", "楼盘", "楼号", "装修单类型", "装修单状态", "签单时间", "装修公司", "销售单号", "品类", "品牌", 
            "分区", "部门", "创建人工号", "创建人", "渠道ID", "渠道", "驻店ID", "驻店", "导购工号", "导购", 
            "设计师", "设计部", "设计分区", "总价", "券值", "券信息", "抹零", "厂商抹零", "补款时间","销售公司", 
            "款项公司", "预结算值", "预结算时间", "预结算人", "结算时间", "结算人", "结算类型", "结算类型", "结算状态", "补贴", 
            "商品编号", "商品名称", "商品颜色", "商品规格", "售价", "折扣价", "折让价", "价格类型", "数量", "销售项总价", 
            "结算方式", "结算值", "金蝶编号", "金蝶名称", "统计类别", "一类", "二类", "三类"
        ]

        sql = self.sqler(companyType, company, timeType, args)

        self.exporter(pid, '', "导出销售结算", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出销售结算脚本说明:
            根据查询条件,以分页形式导出销售结算信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2020/08/01-2020/08/30
            3.company     公司:1
        2.命令使用 plan_export_sales_balance_item.py  pid args company
                   plan_export_sales_balance_item.py  299 2020/08/01-2020/08/30 1
      """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    timeType = int(sys.argv[1])
    companyType = int(sys.argv[2])
    type = sys.argv[3]
    pid = sys.argv[4]
    args = sys.argv[5]
    company = sys.argv[6]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(timeType, companyType, type, pid, args, int(company))
