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
            CONCAT(v.NAME, ' ', h.houseNumber),
            c.name,
            du.userId,
            du.currentName,
            dd.name,
            cu.currentName,
            r.collectTime,
            p.serviceMoney,
            p.advanceMoney,
            communion.kv('payment', 'servicePayment', 'type', p.type),
            communion.kv('payment', 'materialPayment', 'status', p.status),
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
            r.advance,
            communion.kv('payment', 'salesPayment', 'advanceType', r.advanceType),
            communion.kv('decoration', 'decoration', 'status', d.status),
            dc.name,
            spc.name,
            p.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                payment.servicepayment p
                LEFT JOIN payment.servicereceipt r ON p.srid = r.srid
                LEFT JOIN decoration.decoration d ON p.orderId = d.orderId
                LEFT JOIN communion.customer c ON d.customerId = c.cid
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.user cu ON r.cluid = cu.uid
                LEFT JOIN communion.company dc ON d.company = dc.cid
                LEFT JOIN communion.company spc ON p.company = spc.cid
            WHERE
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

        self.divNum(row, [10, 11, 14, 16, 18, 20, 22, 24])

        return row

    def main(self, pid, type, args, company):

        tableheads = [
            u"装修单号", u"装修单等级", u"装修单类型", u"楼盘地址", u"客户", u"设计师编号", u"设计师", u"设计部", u"收款人", u"收款时间",
            u"服务金额", u"预付金额", u"类型", u"状态", u"现金", u"现金信息", u"刷卡", u"刷卡信息", u"转账", u"转账银行",
            u"分期", u"分期银行", u"对公", u"对公银行", u"预付款", u"预付款类型", u"订单状态", u"装修单公司", u"款项公司", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"服务款", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出服务款脚本说明:
        根据查询条件,以分页拿数据的方式导出服务款;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.timeType 时间, 0: 收款时间 1: 确认时间
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_payment_service.py time  pid     args             company
             plan_export_payment_service.py   1   929 2018/12/01-2018/12/31 1

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
