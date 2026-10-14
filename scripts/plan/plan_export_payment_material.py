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
            ms.orderId,
            ms.no,
            communion.kv('decoration', 'decoration', 'typeness', de.typeness),
            de.contractTime,
            CONCAT(cv.name, " ", h.houseNumber),
            cc.name,
            designer.userId,
            designer.currentName,
            dept.name,
            region.name,
            ms.category,
            ms.brand,
            ms.depositPayment,
            ms.total,
            ms.coupon,
            ms.couponInfo,
            mr.mrid,
            mr.cash,
            mr.bank,
            mr.bankInfo,
            mr.checkv,
            mr.checkvBank,
            mr.installment,
            mr.installmentBank,
            mr.accounts,
            mr.accountsBank,
            mr.coupon,
            mr.couponInfo,
            mr.advance,
            communion.kv('payment', 'materialPayment', 'advanceType', mr.advanceType),
            communion.kv('payment', 'materialPayment', 'paymentType', mp.paymentType),
            IF(mp.paymentType in (4, 5, 6, 7), -mp.referMoney, mp.referMoney),
            ct.currentName,
            mr.collecterName,
            mr.collectTime,
            mr.confirmTime,
            mr.comment
        """

        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM
                material.material AS ms,
                communion.house AS h,
                communion.village AS cv,
                communion.user AS designer,
                communion.user AS ct,
                communion.customer AS cc,
                payment.materialpayment AS mp,
                decoration.decoration AS de,
                payment.materialreceipt AS mr,
                communion.department AS dept,
                communion.department AS region
            WHERE
                ms.mid = mp.mid
                AND ms.orderId = de.orderId
                AND mp.mrId = mr.mrId
                AND ms.hid = h.hid
                AND h.vid = cv.vid
                AND mp.cuid = ct.uid
                AND ms.departmentId = dept.did
                AND ms.regionId = region.did
                AND ms.customerId = cc.cid
                AND de.dsuid = designer.uid
                AND mr.collectTime >= '%s'
                AND mr.collectTime <= '%s'
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("ms.company", company))

    def rower(self, row):

        self.divNum(row, [12, 13, 14, 17, 18, 20, 22, 24, 26, 28, 31])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"订单编号", u"主材编号", u"订单类型", u"签单时间", u"楼盘地址", u"客户", u"装修顾问ID", u"装修顾问", u"部门", u"分区",
            u"品类", u"品牌", u"定金", u"主材订单总价", u"主材劵值", u"主材劵", u"MRID", u"现金", u"刷卡", u"刷卡信息",
            u"转账", u"转账银行", u"分期", u"分期银行", u"对公", u"对公银行", u"收款劵值", u"收款劵", u"预付款", u"预付款类型",
            u"收款类型", u"收款金额", u"创建人", u"收款人", u"收款时间", u"确认时间", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"主材收款", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出主材收款_外链统计脚本说明:
            根据查询条件,以分页拿数据的方式导出主材收款;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1. pid : information.plan的主键;
            2. args:startTime:开始时间, endTime:结束时间
            3. company: 公司cid, 0为全部(不传默认0)
            
        2.脚本传参说明:
             plan_export_payment_material.py         pid         args                company
             plan_export_payment_material.py         299  "2018/10/01-2018/10/31"      0
        
        3.注:1,结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
