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
            d.orderid,
            d.grade,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            city.`name`,
            cp.`name`,
            CONCAT(v.NAME, ' ', h.houseNumber),
            c.name,
            du.userId,
            du.currentName,
            communion.kv('decoration', 'decorationbelong', 'defaultflag', db.defaultflag),
            db.rate,
            dd.name,
            cu.currentName,
            r.collectTime,
            IF(p.type in (1, 3), p.recharge, -p.recharge),
            communion.kv('payment', 'advancepayment', 'type', p.type),
            communion.kv('payment', 'advancepayment', 'paymenttype', p.paymenttype),
            communion.kv('payment', 'payment', 'status', p.status),
            r.cash,
            r.cashInfo,
            r.bank,
            r.bankInfo,
            r.checkv,
            r.checkvBank,
            r.installment,
            r.installmentBank,
            r.accounts,
            r.accountsBank,
            d.contractTime,
            communion.kv('decoration', 'decoration', 'status', d.status),
            dc.name,
            pc.name,
            r.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db, 
                communion.customer c, 
                communion.house h, 
                communion.village v, 
                communion.cityproper cp,
                communion.city city,
                communion.user du,
                communion.department dd, 
                communion.user cu,
                payment.payment p,
                payment.advancereceipt r,
                communion.company dc,
                communion.company pc
            WHERE
                p.orderId = d.orderId AND
                d.orderId = db.orderId AND
                p.arid = r.arid AND
                d.customerId = c.cid AND
                d.hid = h.hid AND
                h.vid = v.vid AND
                v.cityProperId = cp.cpid AND
                cp.cid = city.cid AND
                db.buid = du.uid AND
                db.did = dd.did AND
                r.cluid = cu.uid AND
                d.company = dc.cid AND
                p.company = pc.cid AND
                db.`status` = 0 AND
                db.`type` = 0 AND
                r.%s >= '%s 00:00:00' AND 
                r.%s <= '%s 23:59:59' 
                %s
            """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = "collectTime"
        if type == "0":
            timeColumn = "collectTime"
        elif type == "1":
            timeColumn = "confirmTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, self.company("p.company", company))

    def rower(self, row):

        self.divNum(row, [10, 14, 18, 20, 22, 24, 26])

        return row

    def main(self, pid, type, args, company):

        tableheads = [
            u"装修单号", u"装修单等级", u"装修单类型", u"城市", u"城区", u"楼盘地址", u"客户", u"设计师编号", u"设计师", u"是否默认", u"比例",
            u"设计部", u"收款人", u"收款时间", u"金额", u"类型", u"预付款类型", u"状态", u"现金", u"现金信息", u"刷卡",
            u"刷卡信息", u"转账", u"转账银行", u"分期", u"分期银行", u"对公", u"对公银行", u"签单时间", u"订单状态", u"装修单公司",
            u"款项公司", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"预付款", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出预付款装修归属统计脚本说明:
        根据查询条件,以分页拿数据的方式导出预付款归属信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.timeType 时间, 0: 收款时间 1: 确认时间
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_payment_advance_belong.py time pid     args             company
             plan_export_payment_advance_belong.py 0 929 2018/12/01-2018/12/31 1

        3.注:
            1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    timeType = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, timeType, args, int(company))
