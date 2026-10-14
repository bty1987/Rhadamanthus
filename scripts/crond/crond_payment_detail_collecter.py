#!/usr/bin/python
# -*- coding:UTF-8 -*-
import os
import re
import sys
import json
import pymysql
import datetime

class Espayment:
    def __init__(self, host='', username='', password='', media='', pthost='', esHost='', charset='utf8'):
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.esHost = esHost

        self.receiptType_Data = {}
        self.insertResult = []
        self.result = []
        self.size = 400
        self.style = 3
        self.rule = u"""^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$"""

        # 装修 SQL
        self.DECORATION_COLUMN = u"""
            pd.company,
            pd.orderId,
            pdr.collectTime  AS `收款时间`,
            pdr.cluid AS `收款人uid`,
            pdr.collecterName AS `收款人名`,
            pdr.cash AS `现金5`,
            pdr.cashInfo AS `现金信息`,
            pdr.bank  AS `刷卡7`,
            pdr.bankInfo AS `刷卡信息`,
            pdr.checkv  AS `转账9`,
            pdr.checkvBank AS `转账银行信息`,
            pdr.installment  AS `分期11`,
            pdr.installmentBank AS `分期银行信息`,
            pdr.accounts  AS `对公13`,
            pdr.accountsBank AS `对公银行信息`,
            pdr.coupon  AS `卷值`,
            pdr.couponInfo AS `卷值信息`,
            pdr.advance  AS `预付款`,
            pdr.advanceType  AS `预付款类型1合同2工程`,
            pd.paymentType AS `款项类型/类别2`,
            pd.onetype AS `一类0:收款,1:退款,2:历史`,
            pdr.drId AS `收据Id`
        """
        self.DECORATION_SQL = u""" 
            SELECT
                %s
            FROM
                payment.decorationpayment AS pd,
                payment.decorationreceipt AS pdr
            WHERE
                pd.drId = pdr.drId
            AND pdr.collectTime >= '%s 00:00:00'
            AND pdr.collectTime <= '%s 23:59:59'
            %s
        """

        # 主材 SQL
        self.MATERIAL_COLUMN = u"""
            mm.orderId AS `订单号`,
            mm.company AS `公司id`,
            mp.paymentType AS `款项类型/类别`,
            mr.collectTime AS `凭证收款时间`,
            mr.cash AS `现金`,
            mr.cashInfo AS `现金信息`,
            mr.bank AS `刷卡`,
            mr.bankInfo AS `刷卡信息`,
            mr.checkv AS `转账`,
            mr.checkvBank AS `转账银行信息`,
            mr.installment AS `分期`,
            mr.installmentBank AS `分期银行信息`,
            mr.accounts AS `对公`,
            mr.accountsBank AS `对公银行信息`,
            mr.coupon AS `卷值 `,
            mr.couponInfo AS `卷值信息`,
            mr.advance AS `预付款`,
            mr.advanceType AS `预付款类型1合同2工程`,
            mr.collecterName AS `收款人姓名`,
            mr.cluid AS `收款人uid`,
            mr.mrId AS `收据Id`
        """
        self.MATERIAL_SQL = u"""
            SELECT 
                %s
            FROM
                payment.materialpayment AS mp,
                payment.materialreceipt AS mr,
                material.material AS mm
            where 
                mp.mrId = mr.mrId
            AND mm.mid = mp.mid
            AND mr.collectTime >= '%s 00:00:00'
            AND mr.collectTime <= '%s 23:59:59'
            %s
        """

        # 销售 SQL
        self.SALES_COLUM = u"""
            ss.orderId AS `订单号`,
            sp.company AS `公司id`,
            sp.type AS `款项类型/类别`,
            sr.collectTime AS `凭证收款时间`,
            sr.cash AS `现金`,
            sr.cashInfo AS `现金信息`,
            sr.bank AS `刷卡`,
            sr.bankInfo AS `刷卡信息`,
            sr.checkv AS `转账`,
            sr.checkvBank AS `转账银行信息`,
            sr.installment AS `分期`,
            sr.installmentBank AS `分期银行信息`,
            sr.accounts AS `对公`,
            sr.accountsBank AS `对公银行信息`,
            sr.coupon AS `券值 `,
            sr.couponInfo AS `券值信息`,
            sr.advance AS `预付款`,
            sr.advanceType AS `预付款类型1合同2工程`,
            sr.collecterName AS `收款人`,
	        sr.cluid AS `收款人ID`,
	        sr.srid AS `收据ID`
        """
        self.SALES_SQL = u"""
            SELECT 
                %s
            FROM
                payment.salespayment AS sp,
                payment.salesreceipt AS sr,
                sales.sales AS ss
            where
                sp.sid = ss.sid
            AND sp.srid = sr.srid
            AND sr.collectTime >= '%s 00:00:00'
            AND sr.collectTime <= '%s 23:59:59'
            %s
        """

        # 预付 SQL
        self.ADVANCE_COLUMN = u"""
            p.company,
            p.orderId AS `装修单号`,
            pad.collectTime AS `收款时间`,
            p.type AS `类型`,
            p.paymentType AS `款项类型`,
            pad.cluid AS `收款人uid`,
            pad.collecterName AS `收款人姓名`,
            pad.cash AS `现金`,
            pad.cashInfo AS `现金信息`,
            pad.bank AS `刷卡`,
            pad.bankInfo AS `刷卡信息`,
            pad.checkv AS `转账`,
            pad.checkvBank AS `转账信息`,
            pad.installment AS `分期`,
            pad.installmentBank AS `分期信息`,
            pad.accounts AS `对公`,
            pad.accountsBank AS `对公银行`,
            pad.arId AS `收据Id`
        """

        self.ADVANCE_SQL = u"""
            SELECT 
                %s
            FROM
                payment.payment AS p,
                payment.advancereceipt AS pad
            WHERE
                p.arId = pad.arId
            AND pad.collectTime >= '%s 00:00:00'
            AND pad.collectTime <= '%s 23:59:59'
            %s
        """

        # 服务 SQL
        self.SERVICE_COLUMN = u"""
            s.company,
            d.orderId AS `装修单号`,
            sr.collectTime AS `收款时间`,
            s.type AS `类型`,
            sr.cluid AS `收款人uid`,
            sr.collecterName AS `收款人姓名`,
            sr.cash AS `现金`,
            sr.cashInfo AS `现金信息`,
            sr.bank AS `刷卡`,
            sr.bankInfo AS `刷卡信息`,
            sr.checkv AS `转账`,
            sr.checkvBank AS `转账信息`,
            sr.installment AS `分期`,
            sr.installmentBank AS `分期信息`,
            sr.accounts AS `对公`,
            sr.accountsBank AS `对公银行`,
            sr.srid AS `服务款收据id`
        """

        self.SERVICE_SQL = u"""
            SELECT 
                %s
            FROM
                payment.servicepayment AS s,
                payment.servicereceipt AS sr,
                decoration.decoration AS d
            WHERE
                s.srid = sr.srid
            AND s.orderId = d.orderId
            AND sr.collectTime >= '%s 00:00:00'
            AND sr.collectTime <= '%s 23:59:59'
            %s
        """

        # 插入sql
        self.INSERT_INVENTORY_FORMAT = u"""
            INSERT INTO  payment.receipt 
                    (prid, rtid, no, name, orderId, type, paymentType, paymentName, receiptType, money, collectTime, company)
            VALUES
                    %s
                """

        self.insert_Colum = u""" ({prid},{rtid},'{no}','{name}','{orderId}',{type},{paymentType},'{paymentName}',{receiptType},{money},'{collectTime}',{company} ) """

    def fmtTime(self, collectTime, flags=True):
        if flags:
            return collectTime - datetime.timedelta(hours=8)
        else:
            return collectTime + datetime.timedelta(hours=8)
        
    def divNum(self, data, numList):
        if len(numList) > 0:
            for i, v in enumerate(numList):
                if not data[v] is None:
                    data[v] = data[v]/1000

    def importCommit(self, res, sql, cmt=1000):
        for i in range(0, len(res), cmt):
            lists = res[i:i + cmt]
            sqls = ",".join(lists)

            exsql = sql % sqls

            try:
                self.cursor.execute(exsql)
                self.commit()
            except Exception as e:
                print (exsql)

    def checkResult(self, flags=False):
        if len(self.insertResult) == 10000:
            self.importCommit(self.insertResult, self.INSERT_INVENTORY_FORMAT)
            self.insertResult = []
        if flags:
            self.importCommit(self.insertResult, self.INSERT_INVENTORY_FORMAT)
            self.insertResult = []
        self.result = []

    def refiningPayStyle(self, manyType, money, no, name, times, collecterName, cluid, company, paymentType, receiptType, paymentreId, rtid, orderId, paymentName):
        money = money if manyType  else -money
        type = 0 if manyType  else 1

        template = {
            u"rtid": rtid,
            u"no": no,
            u"name": name,
            u"orderId": orderId,
            u"money": money,
            u"collectTime": times,
            u"collecterName": collecterName,
            u"uid": cluid,
            u"company": company,
            u"paymentType": paymentType,  # 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款
            u"paymentName": paymentName,
            u"receiptType ": receiptType,  # 收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠
            u"type": type  # 类型 , 0: 收款, 1: 退款
        }

        options = {
            u"_op_type": u"index",
            u"_index": u"payment-%s" % self.nowTime()[0:4],
            u"_type": u"payment",
            u"_source": template
        }

        insetTemp = {
            u"prid": paymentreId,
            u"rtid": rtid,
            u"no": no,
            u"name": name,
            u"orderId": orderId,
            u"type": type,
            u"paymentType": paymentType,
            u"paymentName": paymentName,
            u"receiptType": receiptType,
            u"money": abs(money),
            u"collectTime": str(self.fmtTime(times, False)),
            u"company": company
        }

        valus = self.insert_Colum.format(**insetTemp)
        del insetTemp

        self.result.append(options)
        self.insertResult.append(valus)

        self.checkResult()

    # 装修款
    def decorationPage(self, startTime, endTime, company):
        flag = True
        nowPage = 1

        self.result = []
        self.insertResult = []
        company = self.company(u"pd.company", company)

        # 主材款项类型
        advanceTypes = {1: "合同预付款" , 2: "工程预付款"}

        sql = self.DECORATION_SQL % (self.DECORATION_COLUMN, startTime, endTime, company)
        while (flag):
            data = self.page(sql, nowPage, self.size)
            for i, v in enumerate(data):
                
                v = list(v)
                
                self.divNum(v, [5, 7, 9, 11, 13, 15, 17])
                
                company = int(v[0])
                orderId = v[1]
                collectTimes = v[2]  # `收款时间`
                collectTime = self.fmtTime(collectTimes)
                cluid = v[3]  # `收款人uid`
                collecterName = v[4]  # `收款人名`
                cash = float(v[5])  # `现金5`
                cashInfo = str(v[6])  # `现金信息`
                bank = float(v[7])  # `刷卡7`
                bankInfo = v[8]  # `刷卡信息`
                checkv = float(v[9])  # `转账9`
                checkvBank = str(v[10])  # `转账银行信息`
                installment = float(v[11])  # `分期11`
                installmentBank = str(v[12])  # `分期银行信息`
                accounts = float(v[13])  # `对公13`
                accountsBank = str(v[14])  # `对公银行信息`
                coupon = float(v[15])  # `卷值`
                couponInfo = v[16]  # `卷值信息`
                advance = float(v[17])  # `预付款`
                advanceType = v[18]  # `预付款类型1合同2工程`
                paymentType = v[19]  # `类型
                onetype = int(v[20])  # 一类0:收款,1:退款,2:历史
                drId = int(v[21])  # `收据Id`

                bigType = 1

                manyType = True
                if onetype == 2:
                    continue
                if onetype == 0:
                    manyType = True
                if onetype == 1:
                    manyType = False

                # 现金
                if cash != 0:
                    self.cash(bigType, cash, collectTime, cashInfo, collecterName, cluid, company, orderId, manyType,drId, paymentType)

                # 刷卡
                if bank != 0:
                    self.bank(bigType, bankInfo, collecterName, cluid, company, orderId, manyType,drId, paymentType)

                # 转账
                if checkv != 0:
                    self.checkv(bigType, checkv, collectTime, checkvBank, collecterName, cluid, company, orderId, manyType,drId, paymentType)

                # 预付款
                if advance != 0 and advanceType != 0:
                    self.advance(bigType, advance, collectTime, advanceTypes[advanceType], collecterName, cluid, company, orderId, drId, paymentType)

                # 券
                if coupon != 0:
                    self.coupon(bigType, collectTime, couponInfo, collecterName, cluid, company, orderId, manyType, drId, paymentType)

                # 分期
                if installment != 0:
                    self.installment(bigType, installment, collectTime, installmentBank, collecterName, cluid, company, orderId, manyType, drId, paymentType)

                # 对公
                if accounts != 0:
                    self.accounts(bigType, accounts, collectTime, accountsBank, collecterName, cluid, company, orderId, manyType, drId, paymentType)

            nowPage += 1
            if len(data) < self.size:
                flag = False

        self.checkResult(True)

    # 主材款
    def materialPage(self, startTime, endTime, company):
        flag = True
        nowPage = 1
        self.result = []
        self.insertResult = []
        company = self.company(u"mp.company", company)

        # 款项类型
        paymentNames = {1: "预付款", 2: "定金", 3: "补款", 4: "退款", 5: "补款退款", 6: "券退款", 7: "定金退款"}

        # 主材款项类型
        advanceTypes = {1: "主材预付款" , 2: "正林预付款"}

        sql = self.MATERIAL_SQL % (self.MATERIAL_COLUMN, startTime, endTime, company)
        while (flag):
            data = self.page(sql, nowPage, self.size)  # size :400
            for i, v in enumerate(data):
                
                v = list(v)
                
                self.divNum(v, [4, 6, 8, 10, 12, 14, 16])
                
                orderId = v[0]  # `订单号`
                company = int(v[1])  # `公司id`
                paymentType = int(v[2])  # `款项类型/类别`
                collectTimes = v[3]  # `凭证收款时间`
                collectTime = self.fmtTime(collectTimes)
                cash = float(v[4])  # `现金`
                cashInfo = v[5]  # `现金信息`
                bank = float(v[6])  # `刷卡`
                bankInfo = v[7]  # `刷卡信息`
                checkv = float(v[8])  # `转账`
                checkvBank = v[9]  # `转账银行信息`
                installment = float(v[10])  # `分期`
                installmentBank = v[11]  # `分期银行信息`
                accounts = float(v[12])  # `对公`
                accountsBank = v[13]  # `对公银行信息`
                coupon = float(v[14])  # `卷值 `
                couponInfo = v[15]  # `卷值信息`
                advance = float(v[16])  # `预付款`
                advanceType = v[17]  # `预付款类型1合同2工程`
                collecterName = v[18]  # 收款人姓名
                cluid = v[19]  # 收款人uid
                mrId = int(v[20]) # `收据Id`

                # 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款
                if paymentType == 1: continue

                bigType = 2
                manyType = True

                if paymentType in [4, 5, 6, 7]:
                    manyType = False

                # 款项名称
                paymentName = paymentNames[paymentType]

                # 现金
                if cash != 0:
                    self.cash(bigType, cash, collectTime, cashInfo, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

                # 刷卡
                if bank != 0:
                    self.bank(bigType, bankInfo, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

                # 转账
                if checkv != 0:
                    self.checkv(bigType, checkv, collectTime, checkvBank, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

                # 预付款
                if advance != 0 and advanceType != 0:
                    self.advance(bigType, advance, collectTime, advanceTypes[advanceType], collecterName, cluid, company, orderId, mrId, paymentName)

                # 券
                if coupon != 0:
                    self.coupon(bigType, collectTime, couponInfo, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

                # 分期
                if installment != 0:
                    self.installment(bigType, installment, collectTime, installmentBank, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

                # 对公
                if accounts != 0:
                    self.accounts(bigType, accounts, collectTime, accountsBank, collecterName, cluid, company, orderId, manyType, mrId, paymentName)

            nowPage += 1
            if len(data) < self.size:
                flag = False
        self.checkResult(True)

    # 销售
    def salesPage(self, startTime, endTime, company):
        flag = True
        nowPage = 1
        self.result = []
        self.insertResult = []
        company = self.company(u"sp.company", company)

        # 款项类型
        paymentNames = {1: "预付款", 2: "定金", 3: "补款", 4: "退款", 5: "补款退款", 6: "券退款", 7: "定金退款", 8: "不可退定金"}

        # 主材款项类型
        advanceTypes = {1: "合同预付款", 2: "工程预付款", 3: "主材预付款", 4: "正林预付款"}

        sql = self.SALES_SQL % (self.SALES_COLUM, startTime, endTime, company)
        while (flag):
            data = self.page(sql, nowPage, self.size)
            for i, v in enumerate(data):
                
                v = list(v)
                
                self.divNum(v, [4, 6, 8, 10, 12, 14, 16])
                
                orderId = v[0]  # `订单号`
                company = int(v[1])  # `公司id`
                type = v[2]  # `款项类型/类别`
                collectTimes = v[3]  # `凭证收款时间`
                collectTime = self.fmtTime(collectTimes)
                cash = float(v[4])  # `现金`
                cashInfo = v[5]  # `现金信息`
                bank = float(v[6])  # `刷卡`
                bankInfo = v[7]  # `刷卡信息`
                checkv = float(v[8])  # `转账`
                checkvBank = v[9]  # `转账银行信息`
                installment = float(v[10])  # `分期`
                installmentBank = v[11]  # `分期银行信息`
                accounts = float(v[12])  # `对公`
                accountsBank = v[13]  # `对公银行信息`
                coupon = float(v[14])  # `卷值 `
                couponInfo = v[15]  # `卷值信息`
                advance = float(v[16])  # `预付款`
                advanceType = v[17]  # `预付款类型1合同2工程`
                collecterName = v[18]  # 收款人
                cluid = v[19]  # 收款人ID
                srid = int(v[20])  # 收据ID

                # 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款, 8: 不可退定金
                if type == 1: continue

                bigType = 3
                manyType = True
                if type in [4, 5, 6, 7]:
                    manyType = False

                # 款项名称
                paymentName = paymentNames[type]

                # 现金
                if cash != 0:
                    self.cash(bigType, cash, collectTime, cashInfo, collecterName, cluid, company, orderId, manyType, srid, paymentName)

                # 刷卡
                if bank != 0:
                    self.bank(bigType, bankInfo, collecterName, cluid, company, orderId, manyType, srid, paymentName)

                # 转账
                if checkv != 0:
                    self.checkv(bigType, checkv, collectTime, checkvBank, collecterName, cluid, company, orderId, manyType, srid, paymentName)

                # 预付款
                if advance != 0 and advanceType != 0:
                    self.advance(bigType, advance, collectTime, advanceTypes[advanceType], collecterName, cluid, company, orderId, srid, paymentName)

                # 券
                if coupon != 0:
                    self.coupon(bigType, collectTime, couponInfo, collecterName, cluid, company, orderId, manyType, srid, paymentName)

                # 分期
                if installment != 0:
                    self.installment(bigType, installment, collectTime, installmentBank, collecterName, cluid, company, orderId, manyType, srid, paymentName)

                # 对公
                if accounts != 0:
                    self.accounts(bigType, accounts, collectTime, accountsBank, collecterName, cluid, company, orderId, manyType, srid, paymentName)

            nowPage += 1
            if len(data) < self.size:
                flag = False
        self.checkResult(True)

    # 预付
    def paymentPage(self, startTime, endTime, company):
        flag = True
        nowPage = 1
        self.result = []
        self.insertResult = []
        company = self.company(u"p.company", company)

        # 款项类型
        paymentNames = ["合同预付款", "工程预付款", "主材预付款", "正林预付款"]

        sql = self.ADVANCE_SQL % (self.ADVANCE_COLUMN, startTime, endTime, company)

        while (flag):
            data = self.page(sql, nowPage, self.size)
            for i, v in enumerate(data):

                v = list(v)

                self.divNum(v, [7, 9, 11, 13, 15])

                company = int(v[0])  # 公司
                orderId = v[1]  # `装修单号`
                collectTimes = v[2]  # `收款时间`
                collectTime = self.fmtTime(collectTimes)
                type = v[3]  # `类型`,
                paymentType = v[4]  # `款项类型`
                cluid = v[5]  # `收款人uid`
                collecterName = v[6]  # `收款人姓名`
                cash = float(v[7])  # `现金`
                cashInfo = v[8]  # `现金信息`
                bank = float(v[9])  # `刷卡`
                bankInfo = v[10]  # `刷卡信息`
                checkv = float(v[11])  # `转账`
                checkvBank = v[12]  # `转账信息`
                installment = float(v[13])  # `分期`
                installmentBank = v[14]  # `分期信息`
                accounts = float(v[15])  # `对公`
                accountsBank = v[16]  # `对公银行`
                arId = int(v[17]) # `收据Id`
                # 0: 提现, 1: 收款, 2: 付款
                bigType = 0
                manyType = True
                if type == 0:
                    manyType = False

                # 款项名称
                paymentName = paymentNames[paymentType]

                # 现金
                if cash != 0:
                    self.cash(bigType, cash, collectTime, cashInfo, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 刷卡
                if bank != 0:
                    self.bank(bigType, bankInfo, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 转账
                if checkv != 0:
                    self.checkv(bigType, checkv, collectTime, checkvBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 分期
                if installment != 0:
                    self.installment(bigType, installment, collectTime, installmentBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 对公
                if accounts != 0:
                    self.accounts(bigType, accounts, collectTime, accountsBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

            nowPage += 1
            if len(data) < self.size:
                flag = False
        self.checkResult(True)

    # 服务
    def servicePage(self, startTime, endTime, company):
        flag = True
        nowPage = 1
        self.result = []
        self.insertResult = []
        company = self.company(u"s.company", company)

        # 款项名称
        paymentName = "服务款"

        sql = self.SERVICE_SQL % (self.SERVICE_COLUMN, startTime, endTime, company)

        while (flag):
            data = self.page(sql, nowPage, self.size)
            for i, v in enumerate(data):

                v = list(v)

                self.divNum(v, [6, 8, 10, 12, 14])

                company = int(v[0])  # 公司
                orderId = v[1]  # `装修单号`
                collectTimes = v[2]  # `收款时间`
                collectTime = self.fmtTime(collectTimes)
                type = v[3]  # `类型`,
                cluid = v[4]  # `收款人uid`
                collecterName = v[5]  # `收款人姓名`
                cash = float(v[6])  # `现金`
                cashInfo = v[7]  # `现金信息`
                bank = float(v[8])  # `刷卡`
                bankInfo = v[9]  # `刷卡信息`
                checkv = float(v[10])  # `转账`
                checkvBank = v[11]  # `转账信息`
                installment = float(v[12])  # `分期`
                installmentBank = v[13]  # `分期信息`
                accounts = float(v[14])  # `对公`
                accountsBank = v[15]  # `对公银行`
                arId = int(v[16])  # `收据Id`

                bigType = 4
                manyType = True

                # type=1时 收据中的类型就是退款
                if type == 1:
                    manyType = False

                # 现金
                if cash != 0:
                    self.cash(bigType, cash, collectTime, cashInfo, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 刷卡
                if bank != 0:
                    self.bank(bigType, bankInfo, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 转账
                if checkv != 0:
                    self.checkv(bigType, checkv, collectTime, checkvBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 分期
                if installment != 0:
                    self.installment(bigType, installment, collectTime, installmentBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

                # 对公
                if accounts != 0:
                    self.accounts(bigType, accounts, collectTime, accountsBank, collecterName, cluid, company, orderId, manyType, arId, paymentName)

            nowPage += 1

            if len(data) < self.size:
                flag = False

        self.checkResult(True)

    # 现金--通用
    def cash(self, paymentType, money, collectTime, cashInfo, collecterName, cluid, company, orderId, moneyType, paymentreId, paymentName):
        try:
            receiptType = self.getReceiptType(cashInfo, company)

            self.refiningPayStyle(moneyType, money, receiptType[2], receiptType[1], collectTime, collecterName, cluid, company, paymentType, 0, paymentreId, receiptType[0], orderId, paymentName)

        except Exception as e:
            print (u"现金-发现异常: cashInfo = %s ||company = %s||orderid = %s" % (cashInfo, company, orderId))

    # 刷卡--通用
    def bank(self, paymentType, bankInfo, collecterName, cluid, company, orderId, moneyType, paymentreId, paymentName):
        banks = bankInfo.split("#")

        for _bank in banks:
            try:
                if _bank == "": continue

                _info = _bank.split("|")

                _no = _info[0]  # 编号
                _money = float(_info[1])
                _time = _info[2][0:19]
                timeCheck = self.paramCheck(self.rule, _time)

                if not timeCheck:
                    raise RuntimeError(u"时间格式错误, 错误时间为: %s" % _time)
                else:
                    if int(_time[:4])-10<int(self.nowTime()[0:4])<int(_time[:4])+10:
                        _time = datetime.datetime.strptime(_time, '%Y-%m-%d %H:%M:%S') - datetime.timedelta(hours=8)
                        receiptType = self.getReceiptType(_no, company)

                        self.refiningPayStyle(moneyType, _money, receiptType[2], receiptType[1], _time, collecterName, cluid, company, paymentType, 1, paymentreId, receiptType[0], orderId, paymentName)
                    else:
                        print (u"与当前时间差距太大,时间为: %s" % _time)

            except Exception as e:
                print (u"刷卡-发现异常: bankInfo = %s ||company = %s||orderid = %s, %s" % (bankInfo, company, orderId, e))

    # 转账--通用
    def checkv(self, paymentType, money, collectTime, checkvBank, collecterName, cluid, company, orderId, moneyType, paymentreId, paymentName):

        if checkvBank.find(u"#") != -1:
            # 包含#号
            checkvBanks = checkvBank.split("#")

            for _checkvBanks in checkvBanks:
                try:
                    if _checkvBanks == "":
                        continue
                    _info = _checkvBanks.split("|")

                    _no = _info[0]
                    _money = float(_info[1])
                    _time = _info[2]

                    #日期判断 "2018-12-05 12:01:02" 格式字符串 包括闰年，月份等
                    timeCheck = self.paramCheck(self.rule, _time)

                    if not timeCheck:
                        raise RuntimeError(u"时间格式错误, 错误时间为: %s" % _time)
                    else:
                        if int(_time[:4])-10 <= int(self.nowTime()[0:4]) <= int(_time[:4])+10:
                            _time = datetime.datetime.strptime(_time, '%Y-%m-%d %H:%M:%S') - datetime.timedelta(hours=8)
                            receiptType = self.getReceiptType(_no, company)

                            self.refiningPayStyle(moneyType, _money, receiptType[2], receiptType[1], _time, collecterName, cluid, company, paymentType, 2, paymentreId, receiptType[0], orderId, paymentName)
                        else:
                            print (u"与当前时间差距太大,时间为: %s" % _time)
                except Exception as e:
                    print (u"转账-新数据-发现异常: company = %s ||checkvBank = %s || orderId = %s, %s " % (company, checkvBank, orderId, e))
        else:
            # 不包含#号 老数据
            try:
                receiptType = self.getReceiptType(checkvBank, company)

                self.refiningPayStyle(moneyType, money, receiptType[2], receiptType[1], collectTime, collecterName, cluid, company,paymentType, 2, paymentreId, receiptType[0], orderId, paymentName)
            except Exception as e:
                print (u"转账-老数据-发现异常: company = %s ||checkvBank = %s || orderId = %s " % (company, checkvBank, orderId))

    # 预付款--通用
    def advance(self, paymentType, money, collectTime, advanceType, collecterName, cluid, company, orderId, paymentreId, paymentName):
        try:
            self.refiningPayStyle(True, money, 0, advanceType, collectTime, collecterName, cluid, company, paymentType, 6, paymentreId, 0, orderId, paymentName)
        except Exception as e:
            print (u"预付款-发现异常: advanceType = %s ||company = %s||orderid = %s" % (advanceType, company, orderId))

    # 优惠券--通用
    def coupon(self, paymentType, collectTime, couponInfo, collecterName, cluid, company, orderId, moneyType,paymentreId, paymentName):

        coupons = couponInfo.split("#")

        for _coupon in coupons:
            try:
                if _coupon == "": continue

                _info = _coupon.split(":")
                _no = _info[0]
                _money = float(_info[1])

                receiptType = self.getReceiptType(_no, company)

                self.refiningPayStyle(moneyType, _money, receiptType[2], receiptType[1], collectTime, collecterName, cluid, company, paymentType, 5, paymentreId, receiptType[0], orderId, paymentName)
            except Exception as e:
                print (u"优惠卷-发现异常:company= %s ||couponInfo = %s || orderId = %s" % (company, couponInfo, orderId))

    # 分期--通用2
    def installment(self, paymentType, money, collectTime, installmentBank, collecterName, cluid, company, orderId, moneyType, paymentreId, paymentName):
        try:
            receiptType = self.getReceiptType(installmentBank, company)

            self.refiningPayStyle(moneyType, money, receiptType[2], receiptType[1], collectTime, collecterName, cluid, company,paymentType, 4, paymentreId, receiptType[0], orderId, paymentName)
        except Exception as e:
            print (u"分期-发现异常:|| company= %s ||couponInfo = %s || orderId = %s" % (company, installmentBank, orderId))

    # 对公--通用2
    def accounts(self, paymentType, money, collectTime, accountsBank, collecterName, cluid, company, orderId, moneyType, paymentreId, paymentName):
        try:
            receiptType = self.getReceiptType(accountsBank, company)

            self.refiningPayStyle(moneyType, money, receiptType[2], receiptType[1], collectTime, collecterName, cluid, company,paymentType, 3, paymentreId, receiptType[0], orderId, paymentName)
        except Exception as e:
            print (u"对公-发现异常: company= %s ||couponInfo = %s || orderId = %s" % (company, accountsBank, orderId))

    # 缓存receipttype收据类型
    def cacheReceiptType(self):
        sql = u"SELECT rtid, `name`, `no`, company from data.receipttype"
        self.cursor.execute(sql)
        data = self.cursor.fetchall()

        for i, v in enumerate(data):
            no = v[2]
            company = int(v[3])
            keyName = u"%s-%s" % (no, company)

            self.receiptType_Data[keyName] = v

    # 通过 no company获得receipttype收据类型数据
    def getReceiptType(self, no, company):
        keyName = u"%s-%s" % (no, int(company))

        if keyName in self.receiptType_Data:
            _no = u"%s" % no

            if self.receiptType_Data[keyName] == None:
                rtid = 0  # id
                name = u""  # 名称
                _no = u""  # 编号
            else:
                rtid = self.receiptType_Data[keyName][0]  # id
                name = self.receiptType_Data[keyName][1]  # 名称

            return [rtid, name, _no]
        return  [0, "", no]

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def getDBCursor(self):

        if not self.dbconn:
            self.openDBConnect()

        self.cursor = self.dbconn.cursor()

    def closeDBConnect(self):
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def commit(self):
        self.dbconn and self.dbconn.commit()

    def rollback(self):
        self.dbconn and self.dbconn.rollback()

    # 分页
    def page(self, sql, nowPage, size=200):

        nowPage = (nowPage - 1) * size

        limtStr = """limit %s,%s; """ % (nowPage, size)
        pageSql = sql + limtStr

        self.cursor.execute(pageSql)
        data = self.cursor.fetchall()

        return data

    # @功能,返回当前时间, 格式为 %Y-%m-%d %H:%M:%S
    def nowTime(self):
        nowTime = datetime.datetime.now()
        strNowTime = nowTime.strftime("%Y-%m-%d %H:%M:%S")
        return strNowTime

    # 公司条件识别
    def company(self, cloumCompany, company):

        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "

        return companyId

    # 时间差判断是否在num值范围内, 支持传入字符串/时间类型,支持配合"/"替换为"-"
    # 返回值 boolean:True 在范围内, False 不在
    def time(self, startTime, endTime, num=31):
        if type(startTime) != datetime.datetime:
            if startTime.find(u"/") != -1:
                startTime = startTime.replace("/", "-")
                endTime = endTime.replace("/", "-")

            if len(startTime) == 10:
                startTime = "%s 00:00:00" % startTime
                endTime = "%s 23:59:59" % endTime

            startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
        if endTime - startTime <= datetime.timedelta(days=num):
            return True
        else:
            return False

    def paramCheck(self, rule, content):

        pattern = re.compile(rule)
        contents = u"%s" % content
        result = pattern.search(contents)
        if result:
            return True
        else:
            return False

    def main(self, startTime, endTime, company, style):
        self.style = style

        if startTime == "" or endTime == "":
            return

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        self.getDBCursor()
        self.cacheReceiptType()

        self.decorationPage(startTime, endTime, company)
        self.materialPage(startTime, endTime, company)
        self.salesPage(startTime, endTime, company)
        self.paymentPage(startTime, endTime, company)
        self.servicePage(startTime, endTime, company)

        self.closeDBConnect()
        sys.exit(0)

if __name__ == '__main__':
    """
    按 装修/主材/销售/预付 款项收据拆分出 现金/刷卡/转账/券/分期/对公
    每个方式对应  编号/名称/大类(装修)/小类(现金)/金额/收款时间/收款人uid/收款人名/公司/收款类别(收/退)
    
    Kibana 中 Index Patterns :payment-年份 例: payment-2018
    重要使用参数:
        style :执行插入风格方式 
        1. ES插入 
        2. DB插入
        3. ES + DB 插入
        注:  只有在 自动auto 情况下默认走 3(ES + DB 插入)
             手动时必须指定style状态!!!
            
    使用控制:
    python crond_decoration_payment.py args company style
    1.自动获取昨天时间
    python crond_decoration_payment.py <args> <company>
    python crond_decoration_payment.py auto 1 3
    2.指定时间
    python crond_decoration_payment.py <args> <company> <style>
    python crond_decoration_payment.py 2018/10/01-2018/10/30 1 1
    
    """
    espayment = Espayment
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    args = sys.argv[1]
    company = sys.argv[2]

    if args == "auto":
        nowTime = datetime.datetime.now()
        strNowTime = nowTime.strftime("%Y-%m-%d %H:%M:%S")

        startTime = str(datetime.datetime.now() - datetime.timedelta(days=1))[0:10]
        endTime = startTime
        style = 3
    else:
        spargs = args.split("-")
        startTime = spargs[0]
        endTime = spargs[1]
        style = sys.argv[3]

    espayment = Espayment(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"), config.get("eshost"))
    espayment.main(startTime, endTime, int(company), int(style))

