# !/usr/bin/python
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
        self.numCount = 1

        self.QUERY_COLUMN_STR = """
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.houseNumber AS '楼号',
            h.innerArea AS '计价面积',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS '类型',
            communion.kv('decoration', 'decoration', 'status', d.status) AS '状态',
            d.accounttime AS '决算时间',
            co.name as '公司',
            '' AS '款项类型',
            '' AS '款项类型',
            '' AS '收款方式',
            '' AS '收据名称',
            '' AS '金额',
            '' AS '银行帐号',
            '' AS '收款时间'
        """

        self.QUERY_SQL_STR = """
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN construction.acceptance a ON d.orderId = a.orderId
                LEFT JOIN construction.construction c ON d.orderId = c.orderId,
                communion.house h,
                communion.village v,
                communion.company co
            WHERE
                %s >= '%s 00:00:00' AND
                %s <= '%s 23:59:59' AND
                d.hid = h.hid AND
                h.vid = v.vid AND
                d.company = co.cid 
                %s
        """

        self.QUERY_DECORATION_PAYMENT_STR = """
            SELECT dr.cash, dr.cashInfo, dr.bank, dr.bankInfo, dr.checkv, dr.checkvBank, dr.advance, CONCAT(communion.kv('payment', 'salesPayment', 'advanceType', dr.advanceType), '预付款'), dr.collectTime, dp.company, dp.paymentType
            FROM payment.decorationpayment dp, payment.decorationreceipt dr 
            WHERE dp.orderId = '%s' AND dp.drid = dr.drid AND dp.paymentstatus IN (1, 2, 4)
        """

        self.QUERY_SERVICE_PAYMENT_STR = """
            SELECT sr.cash, sr.cashInfo, sr.bank, sr.bankInfo, sr.checkv, sr.checkvBank, sr.advance, CONCAT(communion.kv('payment', 'salesPayment', 'advanceType', sr.advanceType), '预付款'), sr.collectTime, sp.company, if(sp.type == 0, '服务款', '服务款退款')
            FROM payment.servicepayment sp, payment.servicereceipt sr 
            WHERE sp.orderId = '%s' AND sp.srid = sr.srid AND sp.status IN (1, 2)
        """

        self.QUERY_RECEIPT_TYPE_STR = "SELECT rt.name, rt.bankno FROM data.receipttype rt WHERE rt.no = '%s' AND rt.company = %s"

    def sqler(self, type, sql, timeargs, company):

        startTime, endTime = timeargs.split("-")
        
        columnStr = 'd.accountTime'
        
        if type == '0':
            columnStr = 'd.accountTime'
        elif type == '1':
            columnStr = 'a.acceptanceTime'
        elif type == '2':
            columnStr = 'c.processTime'

        if company != 0:
            companyStr = "AND %s = %s" % ("d.company", company)
        else:
            companyStr = " "

        return sql % ("%s", columnStr, startTime, columnStr, endTime, companyStr)

    def rower(self, row):

        result = []

        orderId = row[0]
        
        self.divNum(row, [3])

        self.handlePayment(result, self.QUERY_DECORATION_PAYMENT_STR % orderId, "装修款", row)

        self.handlePayment(result, self.QUERY_SERVICE_PAYMENT_STR % orderId, "服务款", row)
        
        return result

    def handleReceipt(self, moneyrow, paymenttype, _paymenttype, receipttype, money, collecttime, no, company):

        moneyrow[7] = paymenttype
        moneyrow[8] = _paymenttype
        moneyrow[9] = receipttype
        moneyrow[11] = money
        moneyrow[13] = collecttime

        self.cursor.execute(self.QUERY_RECEIPT_TYPE_STR % (no, company))
        receipt = self.cursor.fetchall()

        if len(receipt) >= 1:
            moneyrow[10] = receipt[0][0]
            moneyrow[12] = receipt[0][1]

        return moneyrow

    def handlePayment(self, result, sql, paymenttype, row):

        self.cursor.execute(sql)
        pays = self.cursor.fetchall()

        for pay in pays:

            # 现金
            if int(pay[0]) > 0:
                result.append(self.handleReceipt(row.copy(), paymenttype, pay[10], '现金', int(pay[0]) / 1000, pay[8], pay[1], pay[9]))

            # 刷卡
            if int(pay[2]) > 0:

                banks = pay[3].split("#")

                for bank in banks:

                    if bank == "": continue

                    info = bank.split("|")

                    if len(info) == 1: info = [bank, int(pay[2]) / 1000, pay[8]]

                    result.append(self.handleReceipt(row.copy(), paymenttype, pay[10], '刷卡', info[1], info[2], info[0], pay[9]))

            # 银行
            if int(pay[4]) > 0:

                banks = pay[5].split("#")

                for bank in banks:

                    if bank == "": continue

                    info = bank.split("|")

                    if len(info) == 1: info = [bank, int(pay[2]) / 1000, pay[8]]

                    result.append(self.handleReceipt(row.copy(), paymenttype, pay[10], '银行', info[1], info[2], info[0], pay[9]))

            # 预付款
            if int(pay[6]) > 0:
                moneyrow = row.copy()
                moneyrow[8] = paymenttype
                moneyrow[9] = pay[10]
                moneyrow[10] = pay[7]
                moneyrow[12] = int(pay[6]) / 1000
                moneyrow[14] = pay[8]

                result.append(moneyrow)

    def main(self, type, pid, args, company):

        tableheads = [
            "装修单号", "楼盘", "楼号", "计价面积", "类型", "状态", "决算时间", "公司", "款项类型", "款项类型", 
            "收款方式", "收据名称", "金额", "银行帐号", "收款时间"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, self.QUERY_SQL_STR, args, int(company))

        self.exporter(pid, args, "款项收据", tableheads, self.QUERY_COLUMN_STR, sql, self.rower)


if __name__ == '__main__':
    """
        导出款项收据信息脚本说明:
        根据查询条件,以分页拿数据的方式导出款项收据;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        0: 决算时间 , 1: 验收时间
            2.pid         information.plan的主键;
            3.args        "2023/07/22-2023/07/22"
            4.company     公司:1
        2.脚本传参说明:
             plan_export_payment_receipt.py    type     pid              args              company
             plan_export_payment_receipt.py     0       4918     "2023/07/22-2023/07/22"      1

        3.注:
            1.结束时间不能大于开始时间90天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args, int(company))

