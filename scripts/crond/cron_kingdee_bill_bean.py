#!/usr/bin/evn python
#-*- encoding: utf-8 -*-
import json

class Bill():

    collectBillBatch = ["AR_RECEIVEBILL", {"BatchCount": 10, "IsAutoSubmitAndAudit": "true", "Model": []}]  # 收款单批量
    refundBillBatch = ["AR_REFUNDBILL", {"BatchCount": 10, "Model": []}]  # 收款退款单批量
    bankTransitionBillBatch = ["SFKD_BankTransBill", {"BatchCount": 10, "IsAutoSubmitAndAudit": "true", "Model": []}]  # 银行过渡单批量
    materialTransferBillBatch = ["SFKD_ZhuCaiZhuanKuanBill", {"BatchCount": 10, "IsAutoSubmitAndAudit": "true", "Model": []}]  # 主材转款批量
    receivableBillBatch = ["AR_receivable", {"BatchCount": 10, "IsAutoSubmitAndAudit": "true", "Model": []}]  # 应收单批量

    collectBillItems = []  # 收款单单据体
    refundBillItems = []  # 收款退款单据体
    bankTransitionBillItems = []  # 银行过渡单单据体
    materialTransferBillItems = []  # 转款单单据体
    receivableBillItems = []  # 应收单单据体

    def __init__(self):

        # 收款日期/单据类型/往来单位类型(FCONTACTUNITTYPE)/单号/付款单位类型(FPAYUNITTYPE)/付款单位(FPAYUNIT)/款项公司/结算组织/等级/款项类型/备注/单据体明细
        self.collectBill = '{"FDATE": "%s", "FBillTypeID": {"FNumber": "%s"}, "FCONTACTUNITTYPE": "%s", "FCONTACTUNIT": {"FNumber": "%s"}, "FPAYUNITTYPE": "%s", "FPAYUNIT": {"FNumber": "%s"}, "FPAYORGID": {"FNumber": "%s"}, "FSETTLEORGID": {"FNumber": "%s"}, "F_SFKD_Hslb": {"FNumber": "%s"}, "F_SFKD_Base": {"FNumber": "%s"}, "FREMARK": "%s"}'  # 收款单

        # 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
        self.refundBill = '{"FDATE": "%s", "FBILLTYPEID": {"FNumber": "%s"}, "FSETTLEORGID": {"FNumber": "%s"}, "FCONTACTUNITTYPE": "%s", "FRECTUNITTYPE": "%s", "FCONTACTUNIT": {"FNumber": "%s"}, "FRECTUNIT": {"FNumber": "%s"}, "FPAYORGID": {"FNumber": "%s"}, "F_ORA_BASE": {"FNumber": "%s"}, "F_SFKD_GCKXLX": {"FNumber": "%s"}}'  # 收款退款单

        # 单据编号/业务日期/往来单位类型/付款单位类型/收款组织/销售组织/核算类别/客户/实收金额/单据体明细
        self.bankTransitionBill = '{"FBillNo": "%s", "F_SFKD_Date": "%s", "F_SFKD_WangLaiOrgType": "%s", "F_SFKD_RecOrgType": "%s", "F_SFKD_RecOrg": {"FNumber": "%s"}, "F_SFKD_SaleOrg": {"FNumber": "%s"}, "F_ora_Base3": {"FNumber": "%s"}, "F_ora_Base2": {"FNumber": "%s"}, "F_SFKD_RealAmount": "%s"}'  # 银行过渡单

        # 单据编号/业务日期/往来单位类型/付款单位类型/核算类别/收款组织/销售组织/客户/实收金额/单据体明细
        self.materialTransferBill = '{"FBillNo": "%s", "F_SFKD_Date": "%s", "F_SFKD_WangLaiUnitType": "%s", "F_SFKD_PayUnitType": "%s", "F_SFKD_ABC": {"FNumber": "%s"}, "F_SFKD_RecOrgId": {"FNumber": "%s"}, "F_SFKD_SaleOrgId": {"FNumber": "%s"}, "F_ora_Base": {"FNumber": "%s"}, "F_SFKD_ShiShouAmount": "%s"}'  # 主材转款单

        # 收款日期/单据类型/客户/结算组织/收款单位/核算类别/款项类型/备注/单据体明细
        self.receivableBill = '{"FDATE": "%s", "FBillTypeID": {"FNumber": "%s"}, "FCUSTOMERID": {"FNumber": "%s"}, "FSETTLEORGID": {"FNumber": "%s"}, "FPAYORGID": {"FNumber": "%s"}, "F_ORA_BASE1": {"FNumber": "%s"}, "F_SFKD_Base2": {"FNumber": "%s"}, "FAR_Remark": "%s"}'  # 应收单

    def PayBill(self, collectTime, receiptType, fcontactunittype, orderId, fpayunittype, fpayunit, pcompany, scompany, grade, paymentType, comment):
        # 收款日期/单据类型/往来单位类型/单号/付款单位类型/付款单位/款项公司/结算组织/等级/款项类型/备注/单据体明细
        collectBill = json.loads(self.collectBill % (collectTime, receiptType, fcontactunittype, orderId, fpayunittype, fpayunit, pcompany, scompany, grade, paymentType, comment))
        collectBill["FRECEIVEBILLENTRY"] = Bill.collectBillItems
        self.collectBillBatch[1]["Model"].append(collectBill)

    def BanBill(self, receiptNo, collectTime, fcontactunittype, fpayunittype, pcompany, scompany, grade, customer, referMoney):
        # 单据编号/业务日期/往来单位类型/付款单位类型/收款组织/销售组织/核算类别/客户/实收金额/单据体明细
        bankTransitionBill = json.loads(self.bankTransitionBill % (receiptNo, collectTime, fcontactunittype, fpayunittype, pcompany, scompany, grade, customer, referMoney))
        bankTransitionBill["FEntity"] = Bill.bankTransitionBillItems
        self.bankTransitionBillBatch[1]["Model"].append(bankTransitionBill)

    def ManBill(self, receiptNo, collectTime, fcontactunittype, fpayunittype, grade, pcompany, scompany, customer, referMoney):
        # 单据编号/业务日期/往来单位类型/付款单位类型/核算类别/收款组织/销售组织/客户/实收金额/单据体明细
        materialTransferBill = json.loads(self.materialTransferBill % (receiptNo, collectTime, fcontactunittype, fpayunittype, grade, pcompany, scompany, customer, referMoney))
        materialTransferBill["FEntity"] = Bill.materialTransferBillItems
        self.materialTransferBillBatch[1]["Model"].append(materialTransferBill)

    def RecBill(self, collectTime, receiptType, customer, scomany, pcompany, grade, paymentType, comment):
        # 收款日期/单据类型/客户/结算组织/收款组织/核算类别/款项类型/备注/明细
        receivableBill = json.loads(self.receivableBill % (collectTime, receiptType, customer, scomany, pcompany, grade, paymentType, comment))
        receivableBill["FENTITYDETAIL"] = Bill.receivableBillItems
        self.receivableBillBatch[1]["Model"].append(receivableBill)

    def RefBill(self, collectTime, receiptType, scompany, fcontactunittype, collectunittype, contactunit, collectunit, payorg, grade, paymentType):
        # 收款日期 / 单据类型 / 结算组织 / 往来单位类型 / 收款单位类型 / 往来单位 / 收款单位 / 付款组织 / 核算类别 / 款项类型 / 单据体明细
        refundBill = json.loads(self.refundBill % (collectTime, receiptType, scompany, fcontactunittype, collectunittype, contactunit, collectunit, payorg, grade, paymentType))
        refundBill["FREFUNDBILLENTRY"] = Bill.refundBillItems
        self.refundBillBatch[1]["Model"].append(refundBill)

class ReceiptType():
    
    def __init__(self):

        self.methods = {"收款单": "paybill", "银行过渡单": "banbill", "转款单": "manbill", "应收单": "recbill", "收款退款单": "refbill"}
        
        # 收据信息
        self.receipt = {} # 结算方式(receiptType-kibalance)/银行账号(bankno)/费用项目编码(paymentType-kibalance==>costNo)

        # 款项信息
        self.payment = {} # 应收金额(money)/款项类型(kino)/税率(tax)/备注(comment)

        #品牌信息
        self.brand = {} # 品牌(brand)/供应商(supplier)/销售单号(salesNo)

        # 其它信息
        self.other = {} # 收款用途(purposes)

    def receiptParams(self, kibalance, bankno, costNo):
        self.receipt["kibalance"] = kibalance
        self.receipt["bankno"] = bankno
        self.receipt["costNo"] = costNo

    def paymentParams(self, money, kino, tax, comment):
        self.payment["money"] = money
        self.payment["kino"] = kino
        self.payment["tax"] = tax
        self.payment["comment"] = comment

    def brandParams(self, brand, supplier, salesNo):
        self.brand["brand"] = brand
        self.brand["supplier"] = supplier
        self.brand["salesNo"] = salesNo

    def otherParams(self, purposes, settleno, msgid, accountName, openBank, bankNo):
        self.other["purposes"] = purposes
        self.other["settleno"] = settleno # 结算号-银行时间
        self.other["msgid"] = msgid # 备注-国通平台订单号orderNo
        self.other["accountName"] = accountName # 退款-对方账户名称
        self.other["openBank"] = openBank # 退款-对方开户行
        self.other["bankNo"] = bankNo # 退款-对方银行账号

    def paybill(self):
        
        item = '{"fpurposeid": {"FNumber": "%s"}, "fsettletypeid":{"FNumber": "%s"}, "frectotalamountfor":"%s", "faccountid":{"FNumber": "%s"}, "fsettleno": "%s", "FCOMMENT": "%s"}' % (self.other["purposes"], self.receipt["kibalance"], self.payment["money"], self.receipt["bankno"], self.other["settleno"],  self.other["msgid"])

        Bill.collectBillItems.append(json.loads(item))

    def banbill(self):
        
        item = '{"F_SFKD_ShiShouAmount": "%s", "F_ora_Base6": {"FNumber": "%s"}}' % (self.payment["money"], self.payment["kino"])

        Bill.bankTransitionBillItems.append(json.loads(item))

    def manbill(self):
        
        # 实收金额/品牌/供应商/销售单号/款项类型
        item = '{"F_SFKD_RealAmount": "%s", "F_ora_Base3":{"FNumber": "%s"}, "F_ora_Base4":{"FNumber": "%s"}, "F_ora_Text":"%s", "F_SFKD_Base":{"FNumber": "%s"}}' % (self.payment["money"], self.brand["brand"], self.brand["supplier"], self.brand["salesNo"], self.payment["kino"])

        Bill.materialTransferBillItems.append(json.loads(item))

    def recbill(self):
        
        noTaxMoney = self.payment["money"]/(1+(self.payment["tax"]/100)) # 不含税金额
        taxMoney = self.payment["money"]-noTaxMoney
        
        item = '{"FCOSTID": {"FNumber": "%s"}, "FNoTaxAmountFor_D":"%s", "FTAXAMOUNTFOR_D":"%s"}' % (self.receipt["costNo"], noTaxMoney, taxMoney)

        Bill.receivableBillItems.append(json.loads(item))

    def refbill(self):

        # 结算方式/原收款用途/应退金额/我方银行账号/备注/对方账户名称/对方开户行/对方银行账号
        item = '{"FSETTLETYPEID": {"FNumber": "%s"}, "FPURPOSEID":{"FNumber": "%s"}, "FREFUNDAMOUNTFOR":"%s", "FACCOUNTID":{"FNumber": "%s"}, "FNOTE":"%s", "FOPPOSITECCOUNTNAME":"%s", "FOPPOSITEBANKNAME":"%s", "FOPPOSITEBANKACCOUNT":"%s"}' % (self.receipt["kibalance"], self.other["purposes"], self.payment["money"], self.receipt["bankno"], self.payment["comment"], self.other["accountName"], self.other["openBank"], self.other["bankNo"])

        Bill.refundBillItems.append(json.loads(item))

    # 结算方式/银行账号/费用项目编码/应收金额/款项类型/税率/备注/品牌/供应商/销售单号/收款用途/单据名称/结算号/对方账户名称/对方开户行/对方银行账号
    def main(self, kibalance, bankno, costNo, money, kino, tax, comment, brand, supplier, salesNo, purposes, receiptItem, settleno, msgid, accountName, openBank, bankNo):

        if isinstance(receiptItem, tuple):
            if len(receiptItem) > 0:
                receiptItemBilltype = receiptItem[0][1]
            else:
                return
        else:
            if receiptItem == "" or receiptItem == None:
                return
            else:
                receiptItemBilltype = receiptItem

        self.receiptParams(kibalance, bankno, costNo)
        self.paymentParams(money, kino, tax, comment)
        self.brandParams(brand, supplier, salesNo)
        self.otherParams(purposes, settleno, msgid, accountName, openBank, bankNo)
        methodName =self.methods[receiptItemBilltype]
        getattr(ReceiptType, methodName)(self)

