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
        self.refundBatchData = []
        self.materialTransferBatchData = []
        self.receivableBatchData = []

        self.salesPurposes = None
        self.salesCollectBill = None
        self.salesRefundBill = None
        self.receivableType = None

        self.logFile = "payment_service_kingdee"
        self.tableHead = [u"订单号", u"款项类型", u"收据ID", u"属性类型", u"错误信息"]
        self.fieldNo = [0, 2, 14, 29]
        self.fieldName = ["orderId", "type", "rtid", "atttype"]

        self.COLUMN = u"""
            d.orderId AS `订单号`,
            pt.paytype AS `收付款类型`,
            pt.`name` AS `款项类型`,
            pt.kino AS `款项类型编号`,
            pt.kibalance AS `费用项目编码`,
            d.company AS `装修单公司`,
            org.`no` AS `装修组织编号`,
            sr.collectTime AS `收款时间`,
            sr.cash AS `现金`,
            sr.cashInfo AS `现金信息`,
            sr.checkv AS `银行`,
            sr.checkvBank AS `银行信息`,
            sr.advance AS `预付款信息`,
            sr.advanceType AS `预付款类型`,
            sr.srid AS `收据ID`,
            d.grade AS `装修单等级`,
            sr.`comment` AS `收据备注`,
            CONCAT(v.NAME, ' ', h.houseNumber) AS `客户地址`,
            CONCAT(ct.province, '', ct.`name`, '', cp.`name`, '', v. NAME, h.houseNumber) AS `备注`,
            pt.bustype AS `款项类型-业务类型`,
            sp.serviceMoney AS `实收金额`,
            sorg.`no` AS `销售组织编号`,
            pt.taxrate AS `税率`,
            pt.billType AS `单据名称`,
            sr.bank AS `刷卡`,
            sr.bankInfo AS `刷卡信息`,
            cu.companyName AS `个人名称`,
            cu.companyBank AS `开户行`,
            cu.companyBankno AS `开户账号`,
            4 AS `业务类型`
        """

        self.SQL_SERVICE_RECEIPT = u"""
            SELECT
              %s  
            FROM
                payment.servicereceipt sr,
                payment.servicepayment sp,
                data.paymenttype pt,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.cityproper cp,
                communion.city ct,
                communion.company c,
                communion.organization org,
                communion.organization sorg,
                communion.systemconfig sys,
                communion.customer cu
            WHERE
                sr.srid = sp.srid
            AND sp.orderId = d.orderId
            AND sp.type = pt.paytype
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND v.cityProperId = cp.cpid
            AND cp.cid = ct.cid
            AND d.company = c.cid
            AND c.doid = org.oid
            AND c.soid = sorg.oid
            AND sys.key = 'KINGDEEENABLE' AND sys.value & 8
            AND d.company = sys.company
            AND d.company = pt.company
            AND d.customerId = cu.cid
            AND sp.`status` = 2
            AND pt.type = 4
            AND sp.serviceMoney > 0
            AND sp.advanceMoney = 0
            AND sr.confirmTime >= '%s 00:00:00'
            AND sr.confirmTime <= '%s 23:59:59'
        """

        self.SQL_SYSTEMCONFIG = u"""SELECT s.`value` FROM communion.systemconfig s WHERE s.`key` = '%s' %s"""

        self.SQL_RECEIPT = u"""SELECT rt.kibalance, rt.bankno, rt.fund, rt.rtid, rt.kino FROM data.receipttype rt WHERE rt.rtid = IFNULL((SELECT r.rtid FROM data.receipttype r WHERE %s AND r.company = %s), 1)"""

        self.SQL_RECEIPT_ITEMS = u"""SELECT rpi.paytype, rpi.name FROM data.receipttypeitem rpi WHERE rpi.`rtid` = '%s' AND rpi.paytype = '%s' AND rpi.type = '%s'"""

        self.SQL_PAYMENTTYPE = u"""SELECT pt.name, pt.kino, pt.billType FROM data.paymenttype pt WHERE %s %s"""

        self.SQL_PAYTRAN = u"""SELECT pt.msgId from payment.paytran pt where pt.ptid = '%s'"""

    def main(self, startTime, endTime):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        # 装修款收据信息
        sql = self.SQL_SERVICE_RECEIPT % (self.COLUMN, startTime, endTime)

        count = 1
        nowPage = 1
        flag = True

        # 金蝶登录
        self.kingdeeCookies = self.kingdeeLogin(self)
        if not self.kingdeeCookies:
            return

        while (flag):

            rows = self.page(sql, nowPage, self.size)

            Bill.collectBillBatch[1]["Model"] = []
            Bill.refundBillBatch[1]["Model"] = []
            Bill.materialTransferBillBatch[1]["Model"] = []
            Bill.receivableBillBatch[1]["Model"] = []

            for i, v in enumerate(rows):

                data = list(v)
                # 处理数值
                self.divNum(data, [8, 10, 12, 20, 22, 24])
                data[16] = str(data[16]).replace("\t", ",").replace("\n", ",").replace("'", "").replace('"', "")

                # 检查金蝶基础数据
                self.verifyBasicData("BD_Customer", data[0], data[17], data[6], self) # 单号-客户

                Bill.collectBillItems = []  # 收款单单据体
                Bill.refundBillItems = []  # 收款退款单据体
                Bill.materialTransferBillItems = []  # 转款单单据体
                Bill.receivableBillItems = []  # 应收单单据体

                receivableTotal = 0  # 应收单总额
                fundBankMoney = 0 # 资金类型的银行金额

                orgno = data[6]  # 组织编号
                collectReceiptType = "salesCollectBill"
                currenCollectReceiptType = self.salesCollectBill
                refundReceiptType = "salesRefundBill"
                currenRefundReceiptType = self.salesRefundBill
                purposeString = "salesCollectPurpose"
                currenPurposes = self.salesPurposes
                paymentAdvanceType = "合同预付款"
                paymentBusType = 4

                receiptCash = self.getReiceipt(self, 'no', data[9], data[5])

                receiptItems = self.getReceiptTypeItem(self, receiptCash[0][3], data[1], paymentBusType)

                sign = "-"  # 正负数

                currenPurposes = self.querySystemConfig(currenPurposes, self.SQL_SYSTEMCONFIG, purposeString, "")  # 收款用途

                if data[1] == 0: # 收款
                    sign = ""

                    if data[8] > 0: # 现金==收款单

                        receivableTotal = sum([receivableTotal, data[8]])
                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', data[4], data[8], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItems, '', '', data[26], data[27], data[28])

                    if data[10] > 0: # 银行==收款单
                        splitAllBankInfo = data[11].split("#")

                        for v in range(1, len(splitAllBankInfo)-1):
                            splitBankInfo = splitAllBankInfo[v].split("|")

                            receiptBank = self.getReiceipt(self, 'no', splitBankInfo[0], data[5])

                            receiptItemsRefundBank = self.getReceiptTypeItem(self, receiptBank[0][3], data[1], paymentBusType)

                            if receiptBank[0][2] == 1: # 资金
                                fundBankMoney = sum([fundBankMoney, float(splitBankInfo[1])])
                                receivableTotal = sum([receivableTotal, float(splitBankInfo[1])])

                                # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                                ReceiptType().main(receiptBank[0][0], receiptBank[0][1], data[4], splitBankInfo[1], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItemsRefundBank, splitBankInfo[2], '', data[26], data[27], data[28])

                    if data[24] > 0: # 刷卡==收款单
                        splitAllCheckvInfo = data[25].split("#")

                        for v in range(1, len(splitAllCheckvInfo)-1):
                            splitCheckvInfo = splitAllCheckvInfo[v].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', splitCheckvInfo[0], data[5])

                            receiptItemsRefundCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], data[1], paymentBusType)

                            comment = ""
                            if len(splitCheckvInfo) == 4 and splitCheckvInfo[3]:
                                comment = self.getPayTran(self, splitCheckvInfo[3])[0][0]

                            if receiptCheckv[0][2] == 1: # 资金
                                fundBankMoney = sum([fundBankMoney, float(splitCheckvInfo[1])])
                                receivableTotal = sum([receivableTotal, float(splitCheckvInfo[1])])

                                # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                                ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], data[4], splitCheckvInfo[1], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItemsRefundCheckv, splitCheckvInfo[2], comment, data[26], data[27], data[28])

                elif data[1] == 1: # 退款

                    if data[8] > 0: # 现金==收款退款单
                        receivableTotal = sum([receivableTotal, -data[8]])

                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', data[4], data[8], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItems, '', '', data[26], data[27], data[28])

                    if data[10] > 0: # 银行==收款退款单
                        refundSplitAllBankInfo = data[11].split("#")

                        for k in range(1, len(refundSplitAllBankInfo)-1):
                            refundSplitBankInfo = refundSplitAllBankInfo[k].split("|")

                            receiptBank = self.getReiceipt(self, 'no', refundSplitBankInfo[0], data[5])

                            receiptItemsRefundBank = self.getReceiptTypeItem(self, receiptBank[0][3], data[1], paymentBusType)

                            if receiptBank[0][2] == 1: # 资金
                                fundBankMoney = sum([fundBankMoney, float(refundSplitBankInfo[1])])
                                receivableTotal = sum([receivableTotal, -(float(refundSplitBankInfo[1]))])

                                # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                                ReceiptType().main(receiptBank[0][0], receiptBank[0][1], data[4], refundSplitBankInfo[1], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItemsRefundBank, '', '', data[26], data[27], data[28])

                    if data[24] > 0: # 刷卡==收款退款单
                        refundSplitAllCheckvInfo = data[25].split("#")

                        for k in range(1, len(refundSplitAllCheckvInfo)-1):
                            refundSplitCheckvInfo = refundSplitAllCheckvInfo[k].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', refundSplitCheckvInfo[0], data[5])

                            receiptItemsRefundCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], data[1], paymentBusType)

                            if receiptCheckv[0][2] == 1: # 资金
                                fundBankMoney = sum([fundBankMoney, float(refundSplitCheckvInfo[1])])
                                receivableTotal = sum([receivableTotal, -(float(refundSplitCheckvInfo[1]))])

                                # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                                ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], data[4], refundSplitCheckvInfo[1], data[3], data[22], data[16], None, None, None, currenPurposes, receiptItemsRefundCheckv, '', '', data[26], data[27], data[28])

                if data[12] > 0 and data[19] == 0: # 预付款==转款单 装修类型

                    receiptAdvance = self.getReiceipt(self, 'name', paymentAdvanceType, data[5])

                    receiptItemsAdvance = self.getReceiptTypeItem(self, receiptAdvance[0][3], data[1], paymentBusType)

                    receivableTotal = sum([receivableTotal, float("%s%s" % (sign, data[12]))])

                    # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                    ReceiptType().main(receiptAdvance[0][0], receiptAdvance[0][1], data[4], "%s%s" % (sign, data[12]), data[3], data[22], data[16], None, None, None, currenPurposes, receiptItemsAdvance, '', '', data[26], data[27], data[28])

                receiptNo =  "%s%s" % (int(time.mktime(time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S"))), i) # 单据编号

                if len(Bill.collectBillItems) > 0:

                    currenCollectReceiptType = self.querySystemConfig(currenCollectReceiptType, self.SQL_SYSTEMCONFIG, collectReceiptType, "")

                    # 收款日期/单据类型/往来单位类型/单号/付款单位类型/付款单位/款项公司/结算组织/等级/款项类型/备注/单据体明细
                    Bill().PayBill(data[7], currenCollectReceiptType, "BD_Customer", data[0], "BD_Customer", data[0], orgno, orgno, data[15], data[3], data[16])
                    self.collectBatchData.append(data)

                if len(Bill.refundBillItems) > 0:

                    currenRefundReceiptType = self.querySystemConfig(currenRefundReceiptType, self.SQL_SYSTEMCONFIG, refundReceiptType, "")

                    # 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
                    Bill().RefBill(data[7], currenRefundReceiptType, orgno, "BD_Customer", "BD_Customer", data[0], data[0], orgno, data[15], data[3])
                    self.refundBatchData.append(data)

                if len(Bill.materialTransferBillItems) > 0:
                    # 单据编号/业务日期/往来单位类型/付款单位类型/核算类别/收款组织/销售组织/客户/实收金额/单据体明细
                    materialRealMoney = "%s%s" % (sign, data[12])
                    Bill().ManBill(receiptNo, data[7], "BD_Customer", "BD_Customer", data[15], orgno, orgno, data[0], materialRealMoney)
                    self.materialTransferBatchData.append(data)

                if data[19] == 0 and sum([data[8], fundBankMoney, data[12]]) > 0:

                    # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                    ReceiptType().main('', '', data[4], receivableTotal, data[3], data[22], data[16], None, None, None, currenPurposes, data[23], '', '', data[26], data[27], data[28])

                    self.receivableType = self.querySystemConfig(self.receivableType, self.SQL_SYSTEMCONFIG, "costReceivableBill", "")

                    # 收款日期/单据类型/客户/结算组织/收款组织/核算类别/款项类型/备注/明细
                    Bill().RecBill(data[7], self.receivableType, data[0], orgno, orgno, data[15], data[3], "%s%s" % ("项目地址:", data[18]))
                    self.receivableBatchData.append(data)

                count += 1

            nowPage = nowPage + 1

            if len(rows) < self.size:
                flag = False

            # 将信息存入到金蝶
            self.saveBillToKingdee(self, Bill.collectBillBatch, self.collectBatchData)
            self.saveBillToKingdee(self, Bill.refundBillBatch, self.refundBatchData)
            self.saveBillToKingdee(self, Bill.materialTransferBillBatch, self.materialTransferBatchData)
            self.saveBillToKingdee(self, Bill.receivableBillBatch, self.receivableBatchData)

if __name__ == '__main__':
    """
            服务款收据进入金蝶脚本说明:
            收款: 现金 + 资金类型的银行==>收款单
                  预付款==>转款单(正数)
                  应收单(费用应收单-正数)
                  
            退款: 现金 + 资金类型的银行==>收款退款单
                  预付款==>转款单(负数)
                  应收单(费用应收单-负数)

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