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
        self.refundBatchData = []

        self.decorationPurposes = None
        self.materialPurposes = None
        self.collectReceiptType = None
        self.otherReceiptType = None

        self.logFile = "payment_advance_kingdee"
        self.tableHead = [u"订单号", u"预付款款项类型", u"收据ID", u"属性类型", u"错误信息"]
        self.fieldNo = [0, 2, 10, 20]
        self.fieldName = ["orderId", "type", "rtid", "atttype"]

        self.COLUMN = u"""
            d.orderId AS `订单号`,
            p.type AS `收退款类型`,
            p.paymentType AS `预付款款项类型`,
            d.company AS `装修单公司`,
            org.`no` AS `装修组织编号`,
            ar.collectTime AS `收款时间`,
            ar.cash AS `现金`,
            ar.cashInfo AS `现金信息`,
            ar.checkv AS `银行`,
            ar.checkvBank AS `银行信息`,
            ar.arid AS `收据ID`,
            d.grade AS `装修单等级`,
            sorg.`no` AS `销售组织编号`,
            ar.`comment` AS `收据备注`,
            CONCAT(v.NAME, ' ', h.houseNumber) AS `客户地址`,
            ar.bank AS `刷卡`,
            ar.bankInfo AS `刷卡信息`,
            cu.companyName AS `个人名称`,
            cu.companyBank AS `开户行`,
            cu.companyBankno AS `开户账号`,
            0 AS `业务类型`
        """

        self.SQL_ADVANCEPAYMENT_RECEIPT = u"""
            SELECT
                %s
            FROM
                payment.advancereceipt ar,
                payment.payment p,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.company c,
                communion.organization org,
                communion.organization sorg,
                communion.systemconfig sys,
                communion.customer cu
            WHERE
                ar.arid = p.arId
            AND p.orderId = d.orderId
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND d.company = c.cid
            AND c.doid = org.oid
            AND c.soid = sorg.oid
            AND sys.key = 'KINGDEEENABLE' AND sys.value & 1
            AND d.company = sys.company
            AND d.customerId = cu.cid
            AND p.type in (0, 1)
            AND p.`status` = 2
            AND ar.confirmTime >= '%s 00:00:00'
            AND ar.confirmTime <= '%s 23:59:59'
        """

        self.SQL_SYSTEMCONFIG = u"""SELECT s.`value` FROM communion.systemconfig s WHERE s.`key` = '%s' %s"""

        self.SQL_RECEIPT = u"""SELECT rt.kibalance, rt.bankno, rt.fund, rt.rtid, rt.kino FROM data.receipttype rt WHERE rt.rtid = IFNULL((SELECT r.rtid FROM data.receipttype r WHERE %s AND r.company = %s), 1)"""

        self.SQL_RECEIPT_ITEMS = u"""SELECT rpi.paytype, rpi.name FROM data.receipttypeitem rpi WHERE rpi.`rtid` = '%s' AND rpi.paytype = '%s' AND rpi.type = '%s'"""

        self.SQL_PAYMENTTYPE = u"""SELECT pt.name, pt.kino, pt.billType from data.paymenttype pt where %s %s"""

        self.SQL_PAYTRAN = u"""SELECT pt.msgId from payment.paytran pt where pt.ptid = '%s'"""

    def main(self, startTime, endTime):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        # 预付款款收据信息
        sql = self.SQL_ADVANCEPAYMENT_RECEIPT % (self.COLUMN, startTime, endTime)

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

            for i, v in enumerate(rows):

                data = list(v)
                # 处理数值
                self.divNum(data, [6, 8, 15])
                data[13] = str(data[13]).replace("\t", ",").replace("\n", ",").replace("'", "").replace('"', "")

                # 检查金蝶基础数据
                self.verifyBasicData("BD_Customer", data[0], data[14], data[4], self) # 单号-客户

                Bill.collectBillItems = []  # 收款单单据体
                Bill.refundBillItems = []  # 收款退款单据体

                purposesStr = ""
                orgno = ""  # 组织编号
                paymentBusType = 0
                isCollect = 0
                currentPurposes = None

                if data[2] == 0:
                    purposesStr = "decorationCollectPurpose"
                    currentPurposes = self.decorationPurposes
                    orgno = data[4]
                    paymentBusType = 0
                elif data[2] == 2:
                    purposesStr = "replaceMaterialAdvance"
                    currentPurposes = self.materialPurposes
                    orgno = data[12]
                    paymentBusType = 3

                if data[1] == 0:
                    isCollect = 1

                receiptCash = self.getReiceipt(self, 'no', data[7], data[3])
                receiptItems = self.getReceiptTypeItem(self, receiptCash[0][3], isCollect, paymentBusType)

                currentPurposes = self.querySystemConfig(currentPurposes, self.SQL_SYSTEMCONFIG, purposesStr, "")  # 收款用途

                advancePaymentTypes = self.queryPaymentType(self.SQL_PAYMENTTYPE, "pt.type = 0 AND pt.atttype = 0", "AND pt.company = %s" % data[3])

                currentPaymentType = advancePaymentTypes[self.advancePaymentType[data[2]]][0]

                #  0: 提现, 1: 收款, 2: 付款 , 3: 退款(付款和退款不处理)
                if data[1] == 1: # 收款

                    if data[6] > 0: # 现金==收款单
                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', '', data[6], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItems, '', '', data[17], data[18], data[19])

                    if data[8] > 0: # 银行==收款单
                        splitAllBankInfo = data[9].split("#")

                        for v in range(1, len(splitAllBankInfo)-1):
                            splitBankInfo = splitAllBankInfo[v].split("|")

                            receiptBank = self.getReiceipt(self, 'no', splitBankInfo[0], data[3])

                            if receiptBank[0][2] == 0:  # 非资金
                                continue

                            receiptItemsBank = self.getReceiptTypeItem(self, receiptBank[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称/结算号/国通平台号
                            ReceiptType().main(receiptBank[0][0], receiptBank[0][1], '', splitBankInfo[1], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItemsBank, splitBankInfo[2], '', data[17], data[18], data[19])

                    if data[15] > 0: # 刷卡==收款单
                        splitAllCheckvInfo = data[16].split("#")

                        for v in range(1, len(splitAllCheckvInfo)-1):
                            splitCheckvInfo = splitAllCheckvInfo[v].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', splitCheckvInfo[0], data[3])

                            if receiptCheckv[0][2] == 0:  # 非资金
                                continue

                            receiptItemsCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], isCollect, paymentBusType)

                            comment = ""
                            if len(splitCheckvInfo) == 4 and splitCheckvInfo[3]:
                                comment = self.getPayTran(self, splitCheckvInfo[3])[0][0]

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], '', splitCheckvInfo[1], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItemsCheckv, splitCheckvInfo[2], comment, data[17], data[18], data[19])

                elif data[1] == 0: # 退款

                    if data[6] > 0: # 现金==收款退款单
                        # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                        ReceiptType().main(receiptCash[0][0], '', '', data[6], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItems, '', '', data[17], data[18], data[19])

                    if data[8] > 0: # 银行==收款退款单
                        refundSplitAllBankInfo = data[9].split("#")

                        for k in range(1, len(refundSplitAllBankInfo)-1):
                            refundSplitBankInfo = refundSplitAllBankInfo[k].split("|")

                            receiptBank = self.getReiceipt(self, 'no', refundSplitBankInfo[0], data[3])

                            if receiptBank[0][2] == 0:  # 非资金
                                continue

                            receiptItemsRefundBank = self.getReceiptTypeItem(self, receiptBank[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptBank[0][0], receiptBank[0][1], '', refundSplitBankInfo[1], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItemsRefundBank, '', '', data[17], data[18], data[19])

                    if data[15] > 0: # 刷卡==收款退款单
                        refundSplitAllCheckvInfo = data[16].split("#")

                        for k in range(1, len(refundSplitAllCheckvInfo)-1):
                            refundSplitCheckvInfo = refundSplitAllCheckvInfo[k].split("|")

                            receiptCheckv = self.getReiceipt(self, 'no', refundSplitCheckvInfo[0], data[3])

                            if receiptCheckv[0][2] == 0:  # 非资金
                                continue

                            receiptItemsRefundCheckv = self.getReceiptTypeItem(self, receiptCheckv[0][3], isCollect, paymentBusType)

                            # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称
                            ReceiptType().main(receiptCheckv[0][0], receiptCheckv[0][1], '', refundSplitCheckvInfo[1], currentPaymentType, 0, data[13], None, None, None, currentPurposes, receiptItemsRefundCheckv, '', '', data[17], data[18], data[19])

                if len(Bill.collectBillItems) > 0:
                    self.collectReceiptType = self.querySystemConfig(self.collectReceiptType, self.SQL_SYSTEMCONFIG, "otherCollectBill", "")

                    # 收款日期/单据类型/往来单位类型/单号/付款单位类型/付款单位/款项公司/结算组织/等级/款项类型/备注/单据体明细
                    Bill().PayBill(data[5], self.collectReceiptType, "BD_Customer", data[0], "BD_Customer", data[0], orgno, orgno, data[11], currentPaymentType, data[13])
                    self.collectBatchData.append(data)

                if len(Bill.refundBillItems) > 0:
                    self.otherReceiptType = self.querySystemConfig(self.otherReceiptType, self.SQL_SYSTEMCONFIG, "otherRefundBill", "")

                    # 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
                    Bill().RefBill(data[5], self.otherReceiptType, orgno, "BD_Customer", "BD_Customer", data[0], data[0], orgno, data[11], currentPaymentType)
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
            预付款收据进入金蝶脚本说明:
            合同预付款收款: 现金 + 资金类型的银行 + 资金类型的刷卡==>收款单
            合同预付款退款: 现金 + 资金类型的银行 + 资金类型的刷卡==>收款退款单
            主材预付款收款: 现金 + 资金类型银行 + 资金类型的刷卡==>收款单
            主材预付款退款: 现金 + 资金类型银行 + 资金类型的刷卡==>收款退款单

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