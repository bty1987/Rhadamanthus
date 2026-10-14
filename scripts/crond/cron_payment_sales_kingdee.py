import time

from cron_kingdee_util import *
from cron_kingdee_bill_bean import *

class funds_ranking(kingdeeUtil):
    def __init__(self, dbconf, khost, kloginconf, urlconf, media, pthost, authentication):
        self.dbconn = None
        self.cursor = None
        self.kingdeeCookies = None

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = 'utf8'
        self.media = media
        self.pthost = pthost
        self.authentication = authentication

        self.kloginconf = kloginconf
        self.login = "%s%s" % (khost, urlconf.get("Login"))
        self.save = "%s%s" % (khost, urlconf.get("Save"))
        self.batchSave = "%s%s" % (khost, urlconf.get("BatchSave"))
        self.view = "%s%s" % (khost, urlconf.get("View"))

        self.flag = True
        self.size = 300

        self.collectBatchData = []
        self.bankTransitionBatchData = []
        self.materialTransferBatchData = []
        self.refundBatchData = []

        self.purposes = None
        self.collectReceiptType = None
        self.otherReceiptType = None

        self.salesPaymentCollectType = [2, 3, 8]
        self.salesPaymentRefundType = [4, 5, 6, 7]

        self.logFile = "payment_sales_kingdee"
        self.tableHead = [u"销售单号", u"款项类型", u"收据ID", u"属性类型", u"错误信息"]
        self.fieldNo = [16, 24, 14, 31]
        self.fieldName = ["orderId", "type", "rtid", "atttype"]

        self.COLUMN = u"""
            d.orderId AS `订单号`,
            sp.type AS `款项类型`,
            s.pompany AS `款项公司`,
            sr.collectTime AS `收款时间`,
            sr.cash AS `现金`,
            sr.cashInfo AS `现金信息`,
            sr.checkv AS `银行`,
            sr.checkvBank AS `银行信息`,
            sr.advance AS `预付款`,
            sr.advanceType AS `预付款信息`,
            sr.coupon AS `优惠券`,
            sr.couponInfo AS `优惠券信息`,
            b.kino AS `品牌编号`,
            u.oldUserId AS `供应商编号`,
            sr.srid AS `收据ID`,
            sp.referMoney AS `实收金额`,
            s.`no` AS `销售单号`,
            s.depositpayStatus AS `定金状态`,
            s.depositpay AS `定金金额`,
            org.`no` AS `销售组织编号`,
            d.grade AS `装修单等级`,
            sr.`comment` AS `收据备注`,
            CONCAT(v. NAME, ' ', h.houseNumber) AS `客户地址`,
            pt.kino AS `款型类型金蝶编号`,
            pt.name AS `款型类型名称`,
            pt.billType AS `单据名称`,
            sr.bank AS `刷卡`,
            sr.bankInfo AS `刷卡信息`,
            cu.companyName AS `个人名称`,
            cu.companyBank AS `开户行`,
            cu.companyBankno AS `开户账号`,
            3 AS `业务类型`,
            dorg.no AS `装修单装修组织编号`
        """

        self.SALESPAYMENT_COLUMN = u"""
            sp.referMoney AS `实收金额`,
            b.kino AS `品牌编号`,
            u.oldUserId AS `供应商编号`,
            s.`no` AS `销售单号`,
            sp.type AS `款项类型`,
            s.depositpayStatus AS `定金状态`,
            s.depositpay AS `定金金额`,
            pt.kino AS `款项类型金蝶编号`,
            pt.billType AS `单据名称`
        """

        self.SQL_SALESPAYMENT_RECEIPT = u"""
            SELECT
                %s
            FROM
                payment.salespayment sp,
                payment.salesreceipt sr,
                sales.sales s,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.brand b,
                communion.`user` u,
                communion.company c,
                communion.organization org,
                data.paymenttype pt,
                communion.systemconfig sys,
                communion.customer cu,
                communion.company dc,
                communion.organization dorg
            WHERE
                sp.srid = sr.srid
            AND sp.sid = s.sid
            AND s.orderId = d.orderId
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND s.bid = b.bid
            AND b.ocuid = u.uid
            AND s.pompany = c.cid
            AND c.soid = org.oid
            AND d.company = dc.cid
            AND dc.doid = dorg.oid
            AND sp.type = pt.`code`
            AND sys.key = 'KINGDEEENABLE' AND sys.value & 4
            AND s.pompany = sys.company
            AND s.pompany = pt.company
            AND s.cid = cu.cid
            AND sp.`status` = 2
            AND sr.confirmTime >= '%s 00:00:00'
            AND sr.confirmTime <= '%s 23:59:59'
            GROUP BY
                sr.srid
        """

        self.SQL_SYSTEMCONFIG = u"""SELECT s.`value` FROM communion.systemconfig s WHERE s.`key` = '%s' %s"""

        self.SQL_RECEIPT = u"""SELECT rt.kibalance, rt.bankno, rt.fund, rt.rtid, rt.kino FROM data.receipttype rt WHERE rt.rtid = IFNULL((SELECT r.rtid FROM data.receipttype r WHERE %s AND r.company = %s), 1)"""

        self.SQL_RECEIPT_ITEMS = u"""SELECT rpi.paytype, rpi.name FROM data.receipttypeitem rpi WHERE rpi.`rtid` = '%s' AND rpi.paytype = '%s' AND rpi.type = '%s'"""

        self.SQL_SALESPAYMENT = u"""
            SELECT
                %s
            FROM
                payment.salespayment sp,
                sales.sales s,
                communion.brand b,
                communion.`user` u,
                data.paymenttype pt
            WHERE
                sp.sid = s.sid
            AND s.bid = b.bid
            AND b.ocuid = u.uid
            AND sp.type = pt.`code`
            AND sp.srid = %s
            AND s.pompany = pt.company
        """

        self.SQL_SALES_PAYMENTTYPE = u"""SELECT pt.name, pt.kino, pt.billType FROM data.paymenttype pt WHERE %s %s"""

        self.SQL_PAYTRAN = u"""SELECT pt.msgId from payment.paytran pt where pt.ptid = '%s'"""

    def main(self, startTime, endTime):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        # 销售款收据信息
        sql = self.SQL_SALESPAYMENT_RECEIPT % (self.COLUMN, startTime, endTime)

        count = 1
        nowPage = 1
        flag = True
        paymentBusType = 3

        self.purposes = self.querySystemConfig(self.purposes, self.SQL_SYSTEMCONFIG, "replaceMaterial", "") # 销售收款-收款用途

        # 金蝶登录
        self.kingdeeCookies = self.kingdeeLogin(self)
        if not self.kingdeeCookies:
            return

        while (flag):

            rows = self.page(sql, nowPage, self.size)

            Bill.collectBillBatch[1]["Model"] = []
            Bill.refundBillBatch[1]["Model"] = []

            for i, v in enumerate(rows):

                data = list(v)
                # 处理数值
                self.divNum(data, [4, 6, 8, 10, 15, 18, 26])
                data[21] = str(data[21]).replace("\t", ",").replace('\n', ',').replace("'", "").replace('"', "")

                # 检查金蝶基础数据
                self.verifyBasicData("BD_Customer", data[0], data[22], data[32], self) # 单号-客户

                Bill.collectBillItems = []  # 收款单单据体
                Bill.refundBillItems = []  # 收款退款单据体

                receiptCash = self.getReiceipt(self, 'no', data[5], data[2])

                if data[1] in self.salesPaymentCollectType:
                    isCollect = 0
                else:
                    isCollect = 1

                receiptItems = self.getReceiptTypeItem(self, receiptCash[0][3], isCollect, paymentBusType)

                otherPaymentTypes = self.queryPaymentType(self.SQL_SALES_PAYMENTTYPE, "pt.`name` IN ('定金出', '定金转全款', '主材预付款', '转回主材预付款')", "AND pt.company = %s" % data[2])  # 其他款型类型

                if data[1] in self.salesPaymentCollectType: # 收款

                    if data[4] > 0: # 现金==收款单
                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', '', data[4], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItems, '', '', data[28], data[29], data[30])

                    if data[6] > 0: # 银行==收款单
                        splitAllBankInfo = data[7].split("#")

                        for v in range(1, len(splitAllBankInfo)-1):
                            splitBankInfo = splitAllBankInfo[v].split("|")

                            receiptBank = self.getReiceipt(self, 'no', splitBankInfo[0], data[2])

                            if receiptBank[0][2] == 0:  # 非资金
                                continue

                            receiptItemsBank = self.getReceiptTypeItem(self, receiptBank[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptBank[0][0], receiptBank[0][1], '', splitBankInfo[1], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItemsBank, splitBankInfo[2], '', data[28], data[29], data[30])

                    if data[26] > 0: # 刷卡==收款单
                        splitAllCheckvInfo = data[27].split("#")

                        for v in range(1, len(splitAllCheckvInfo)-1):
                            splitCheckvInfo = splitAllCheckvInfo[v].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', splitCheckvInfo[0], data[2])

                            if receiptCheckv[0][2] == 0: # 非资金
                                continue

                            receiptItemsCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], isCollect, paymentBusType)

                            comment = ""
                            if len(splitCheckvInfo) == 4 and splitCheckvInfo[3]:
                                comment = self.getPayTran(self, splitCheckvInfo[3])[0][0]

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], '', splitCheckvInfo[1], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItemsCheckv, splitCheckvInfo[2], comment, data[28], data[29], data[30])

                else: # 退款

                    if data[4] > 0: # 现金==收款退款单
                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', '', data[4], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItems, '', '', data[28], data[29], data[30])

                    if data[6] > 0: # 银行==收款退款单
                        refundSplitAllBankInfo = data[7].split("#")

                        for k in range(1, len(refundSplitAllBankInfo)-1):
                            refundSplitBankInfo = refundSplitAllBankInfo[k].split("|")

                            receiptBank = self.getReiceipt(self, 'no', refundSplitBankInfo[0], data[2])

                            if receiptBank[0][2] == 0: # 非资金
                                continue

                            receiptItemsBank = self.getReceiptTypeItem(self, receiptBank[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptBank[0][0], receiptBank[0][1], '', refundSplitBankInfo[1], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItemsBank, '', '', data[28], data[29], data[30])

                    if data[26] > 0: # 刷卡==收款退款单
                        refundSplitAllCheckvInfo = data[27].split("#")

                        for k in range(1, len(refundSplitAllCheckvInfo)-1):
                            refundSplitCheckvInfo = refundSplitAllCheckvInfo[k].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', refundSplitCheckvInfo[0], data[2])

                            if receiptCheckv[0][2] == 0: # 非资金
                                continue

                            receiptItemsCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], '', refundSplitCheckvInfo[1], data[23], 0, data[21], data[12], data[13], data[16], self.purposes, receiptItemsCheckv, '', '', data[28], data[29], data[30])

                if len(Bill.collectBillItems) > 0:

                    self.collectReceiptType = self.querySystemConfig(self.collectReceiptType, self.SQL_SYSTEMCONFIG, "otherCollectBill", "")

                    # 收款日期/单据类型/往来单位类型/单号/付款单位类型/付款单位/款项公司/结算组织/等级/款项类型/备注/单据体明细
                    Bill().PayBill(data[3], self.collectReceiptType, "BD_Customer", data[0], "BD_Customer", data[0], data[19], data[19], data[20], "", data[21])
                    self.collectBatchData.append(data)

                if len(Bill.refundBillItems) > 0:

                    self.otherReceiptType = self.querySystemConfig(self.otherReceiptType, self.SQL_SYSTEMCONFIG, "otherRefundBill", "")

                    # 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
                    Bill().RefBill(data[3], self.otherReceiptType, data[19], "BD_Customer", "BD_Customer", data[0], data[0], data[19], data[20], data[23])
                    self.refundBatchData.append(data)

                count += 1

            nowPage = nowPage + 1

            if len(rows) < self.size:
                flag = False

            # 将信息存入到金蝶
            self.saveBillToKingdee(self, Bill.collectBillBatch, self.collectBatchData)
            self.saveBillToKingdee(self, Bill.refundBillBatch, self.refundBatchData)

if __name__ == '__main__':
    """
            销售款收据进入金蝶脚本说明:
            收款: 现金 + 资金类银行 + 资金类刷卡 ==> 收款单
            退款: 现金 + 资金类银行 + 资金类刷卡 ==> 收款退款单

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding='UTF-8'))
    dbconf = config.get("database")
    khost = config.get("khost")
    kloginconf = config.get("kingdeeData")
    urlconf = config.get("kingdeeUrl")

    args = sys.argv[1]

    if args == "auto":
        nowTime = datetime.datetime.now()
        strNowTime = nowTime.strftime("%Y-%m-%d %H:%M:%S")

        startTime = str(datetime.datetime.now() - datetime.timedelta(days=1))[0:10]
        endTime = startTime
    else:
        spargs = args.split("-")
        startTime = spargs[0]
        endTime = spargs[1]

    funds_ranking = funds_ranking(dbconf, khost, kloginconf, urlconf, config.get("media"), config.get("pthost"), config.get("authentication"))
    funds_ranking.main(startTime, endTime)