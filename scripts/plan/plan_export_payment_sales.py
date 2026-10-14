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
            s.orderId AS `装修单号`,
            d.grade AS `装修等级`,
            communion.kv("decoration", "decoration", "typeness", d.typeness) AS "装修类型",
            dc.name AS `装修公司`,
            s.no AS `销售单号`,
            s.grade AS `销售等级`,
            sc.name AS `销售公司`,
            d.contractTime,
            CONCAT(v.name, " ", h.houseNumber) AS `客户地址`,
            c.name AS `客户名`,
            du.userId AS `设计师编号`,
            du.currentName AS `设计师`,
            eu.userId AS `方案设计编号`,
            eu.currentName AS `方案设计`,
            gu.userId AS `导购人员编号`,
            gu.currentName AS `导购`,
            sdd.no AS `签约设计部编号`,
            sdd.alias AS `签约设计部`,
            sdr.no AS `签约设计分区编号`,
            sdr.alias AS `签约设计分区`,
            dd.no AS `设计师部编号`,
            dd.alias AS `设计师部`,
            dr.no AS `设计师分区编号`,
            dr.alias AS `设计师分区`,
            s.category AS `品类`,
            b.name AS `品牌`,
            s.total AS `销售单总价`,
            s.coupon AS `销售券值`,
            s.couponInfo AS `销售券`,
            clu.currentName AS `收款人`,
            sr.collectTime AS `收款时间`,
            communion.kv("payment", "salespayment", "type", sp.type) AS "收款类型",
            communion.kv("payment", "materialPayment", "status", sp.status) AS "状态",
            IF(sp.type in (4, 5, 6, 7), -sp.referMoney, sp.referMoney) AS "应交金额",
            s.depositpay AS `定金`,
            s.venderMaling AS `厂商抹零`,
            s.maling AS `抹零`,
            sr.cash AS `现金`,
            sr.cashInfo AS `现金信息`,
            sr.bank AS `刷卡`,
            sr.bankInfo AS `刷卡信息`,
            sr.checkv AS `转账`,
            sr.checkvBank AS `转账银行`,
            sr.installment AS `分期`,
            sr.installmentBank AS `分期银行`,
            sr.accounts AS `对公`,
            sr.accountsBank AS `对公银行`,
            sr.advance AS `预付款`,
            communion.kv("payment", "salespayment", "advanceType", sr.advanceType) AS "预付款类型",
            sr.coupon AS `券值`,
            sr.couponInfo AS `券信息`,
            cuid.currentName AS `创建人`,
            communion.kv("decoration", "decoration", "status", d.status) AS "订单状态",
            spc.name AS `款项公司`,
            b.kino AS `金蝶编号`,
            b.kiname AS `金蝶名称`,
            smu.userId AS `业务员编号`,
            smu.currentName AS `业务员`,
            smd.alias AS `业务部`,
            s.comment AS `销售备注`,
            sr.comment AS `备注`
        """

        self.EXPORTER_SQL_STR = """
            SELECT
                %s
            FROM
                payment.salesreceipt sr
                LEFT JOIN payment.salespayment sp ON sr.srid = sp.srid
                LEFT JOIN sales.sales s ON sp.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderid = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer c ON d.customerid = c.cid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.user gu ON s.guid = gu.uid
                LEFT JOIN communion.user iu ON s.iuid = iu.uid
                LEFT JOIN communion.department sdd ON db.did = sdd.did
                LEFT JOIN communion.department sdr ON db.rid = sdr.did
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user clu ON sr.cluid = clu.uid
                LEFT JOIN communion.company sc ON s.company = sc.cid
                LEFT JOIN communion.company dc ON d.company = dc.cid
                LEFT JOIN communion.company spc ON sp.company = spc.cid
                LEFT JOIN communion.user cuid ON sp.cuid = cuid.uid
                LEFT JOIN communion.brand b ON s.bid = b.bid
                LEFT JOIN communion.user smu ON d.smuid = smu.uid
                LEFT JOIN communion.department smd ON smu.deptid = smd.did
            WHERE
                s.type = 0 AND 
                sr.%s >= '%s 00:00:00' AND
                sr.%s <= '%s 23:59:59' 
                %s
        """

    def sqler(self, form, timeType, timeargs, company):
    
        startTime, endTime = timeargs.split("-")
        
        timeColumn = "collectTime"
        if timeType == "0":
            timeColumn = "collectTime"
        elif timeType == "1":
            timeColumn = "confirmTime"
            
        column = "s.company"
        
        if form == "0":
            column = "s.company"
        elif form == "1":
            column = "s.dompany"
        elif form == "2":
            column = "sp.company"
        
        if company != 0:
            companyId = "AND %s = %s" % (column, company)
        else:
            companyId = " "
        
        return self.EXPORTER_SQL_STR % ("%s", timeColumn, startTime, timeColumn, endTime, companyId)
        
    def rower(self, row):
    
        self.divNum(row, [26, 27, 33, 34, 35, 36, 37, 39, 41, 43, 45, 47, 49])
        
        return row

    def main(self, form, timeType, pid, args, company):

        tableheads = [
            "装修单号", "装修等级", "装修类型", "装修公司", "销售单号", "销售等级", "销售公司", "签单时间", "客户地址", "客户名",
            "渠道编号", "渠道", "方案设计编号", "方案设计", "导购编号", "导购", "签约设计部编号", "签约设计部", "签约设计分区编号", "签约设计分区", 
            "设计师部编号", "设计师部", "设计师分区编号", "设计师设计分区", "品类", "品牌", "总价", "优惠券", "券信息", "收款人", 
            "收款时间", "款项类型", "状态", "金额", "定金", "厂商抹零", "抹零", "现金", "现金信息", "刷卡", 
            "刷卡信息", "转账", "转账银行", "分期", "分期银行", "对公", "对公银行", "预付款", "预付款类型", "收款劵值", 
            "收款劵", "创建人", "订单状态", "款项公司", "金蝶编号", "金蝶名称", "业务员编号", "业务员", "业务部", "销售备注", "款项备注"
        ]
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(form, timeType, args, int(company))

        self.exporter(pid, args, "销售款", tableheads, self.colum, sql, self.rower)

if __name__ == "__main__":

    """
        导出销售款项_外链统计脚本说明:
        根据查询条件,以分页拿数据的方式导出销售收款;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.form 类型, 0: 销售单公司 1: 装修单公司 2: 款项公司
            2.timeType 时间, 0: 收款时间 1: 确认时间
            3.pid         information.plan的主键;
            4.args        "2018/12/13-2018/12/13"
            5.company     公司:1

        2.脚本传参说明:
             plan_export_payment_sales.py form   timeType    pid              args              company
             plan_export_payment_sales.py  0        1        929     2018/12/01-2018/12/31         1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    form = sys.argv[1]
    timeType = sys.argv[2]
    pid = sys.argv[3]
    args = sys.argv[4]
    company = sys.argv[5]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))

    exporter.main(form, timeType, pid, args, int(company))
