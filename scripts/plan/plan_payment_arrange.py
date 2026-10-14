#!/usr/bin/python
# -*- coding:UTF-8 -*-
# @Time    : 2018/10/27 15:02
# @Author  : Aries
# @Site    : 
# @File    : payment_arrange.py
# @Software: PyCharm

from dateutil.relativedelta import relativedelta
from plan_util import *
from string import Template
import json
import os
import sys
import tempfile

class payment_arrange(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.sheets = None
        self.tableHead = [u"凭证日期", u"会计年度", u"会计期间", u"凭证字", u"凭证号", u"科目代码",
                          u"科目名称", u"币别代码", u"币别名称", u"原币金额", u"借方",
                          u"贷方", u"制单", u"审核", u"核准", u"出纳",
                          u"经办", u"结算方式", u"结算号", u"凭证摘要", u"数量",
                          u"数量单位", u"单价", u"参考信息", u"业务日期", u"往来业务编号",
                          u"附件数", u"序号", u"系统模块", u"业务描述", u"汇率类型",
                          u"汇率", u"分录序号", u"核算项目", u"过账", u"机制凭证", u"现金流量"]

        self.RECEIPTTYPE_SQL = u"""SELECT * FROM data.receipttype"""

        # 装修sql
        self.decoration_column = u"""
                pd.orderId 	AS `订单号0`,
                pd.company 	AS `公司id1`,
                pd.paymentType AS `款项类型/类别2`,
                pd.referMoney AS `应收款3`,
                pdr.collectTime  AS `凭证收款时间4`,
                pdr.cash AS `现金5`,
                pdr.cashInfo AS `现金信息6`,
                pdr.bank  AS `刷卡7`,
                pdr.bankInfo AS `刷卡信息8`,
                pdr.checkv  AS `转账9`,
                pdr.checkvBank AS `转账银行信息10`,
                pdr.installment  AS `分期11`,
                pdr.installmentBank AS `分期银行信息12`,
                pdr.accounts  AS `对公13`,
                pdr.accountsBank AS `对公银行信息14`,
                pdr.coupon  AS `卷值15`,
                pdr.couponInfo AS `卷值信息16`,
                pdr.advance  AS `预付款17`,
                pdr.advanceType  AS `预付款类型1合同2工程18`,
                pdr.confirmTime  AS `凭证确认时间19`,   
                concat(v.name,h.houseNumber) AS `楼盘号20`,
                dd.dsuid AS `设计师ID21`,
                cu.userName AS `设计师姓名22`,
                cu.userId AS `设计师ID23`,
                cu.status AS `0在职1离职2停薪留职24`,
                cd.name AS `部门名称15`,
                cd.kino AS `部门金蝶编号26`,
                cd.kiname AS `部门金蝶编号27`,
	            dd.grade AS '等级'
        """
        self.DECORATION_SQL = u"""
            SELECT
                %s
            FROM
                payment.decorationpayment AS pd,
                payment.decorationreceipt AS pdr,
                decoration.decoration AS dd,
                communion.house AS h,
                communion.village AS v,
                communion.user AS cu,
                communion.department AS cd
            where
                pd.orderId = dd.orderId
            AND pdr.drId = pd.drId
            AND dd.hid = h.hid 
            AND h.vid = v.vid
            AND cu.uid = dd.dsuid
            AND cd.did = cu.deptId
            AND pdr.collectTime >= '%s'
            AND pdr.collectTime <= '%s'
            AND dd.company = %s
        """
        
        # 预付款sql
        self.advance_column = u"""
            p.orderId AS `装修单号`,
            p.type AS `类型`,
            p.paymentType AS `款项类型`,
            pa.cash AS `现金`,
            pa.bank AS `刷卡`,
            pa.checkv AS `转账`,
            pa.installment AS `分期`,
            pa.accounts AS `对公`,
            pa.collectTime AS `预付款合同收款凭证时间`,
            v.`name` AS `楼盘`,
            h.houseNumber AS `楼号`,
            pa.cashInfo AS `现金信息`,
            pa.bankInfo AS `刷卡信息`,
            pa.checkvBank AS `转账信息`,
            pa.installmentBank AS `分期信息`,
            pa.accountsBank AS `对公银行`,
            p.recharge AS `实收金额`,
            d.company AS "公司",
	        d.grade AS '等级'
        """
        self.ADVANCE_SQL = u"""
            SELECT
                %s
            FROM
                payment.payment p,
                payment.advancereceipt pa,
                decoration.decoration d,
                communion.house h,
                communion.village v
            WHERE
            p.arId = pa.arId
            AND p.orderId = d.orderId
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND pa.collectTime >= '%s'
            AND pa.collectTime <= '%s'
            AND d.company = %s
                                                        """
        # 主材
        self.material_column = u"""
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
            mr.confirmTime AS `凭证确认时间`,
            concat(v. NAME, h.houseNumber) AS `楼盘号`,
            mm.regionId AS `设计师ID`,
            cu.userName AS `设计师姓名`,
            cu.userId AS `设计师ID`,
            cu.STATUS AS `0在职1离职2停薪留职`,
            cd.name AS `部门名称`,
            mp.referMoney AS `金额`,
            mm.brand AS `品牌`,
            mm.category AS `品类`,
            cd.kino AS `部门金蝶编号`,
            cd.kiname AS `部门金蝶名称`,
            b.kino AS `品牌金蝶编号`,
            b.kiname AS `品牌金蝶名称`,
            c.kino AS `品类金蝶编号`,
            c.kiname AS `品类金蝶名称`,
            mm.depositStatus AS `定金状态`,
            mm.depositPayment AS `定金金额`,
            mm.fullPayment AS `补款金额`,
            mm.fullStatus AS `补款状态`,
            mr.mrid,
	        mm.grade AS '等级'
        """
        self.MATERIAL_SQL = u"""
            SELECT
                %s
            FROM
                payment.materialpayment AS mp,
                payment.materialreceipt AS mr,
                material.material AS mm,
                communion.house AS h,
                communion.village AS v,
                communion. USER AS cu,
                communion.department AS cd,
                communion.brand AS b,
                communion.category AS c
            WHERE
                mp.mid = mm.mid
                AND mr.mrId = mp.mrId
                AND mm.hid = h.hid
                AND h.vid = v.vid
                AND cu.uid = mm.smuid
                AND cd.did = cu.deptId
                AND b.bid = mm.bid
                AND c.cid = b.cid 
                AND mr.collectTime >= '%s'
                AND mr.collectTime <= '%s'
                AND mm.company = %s
            ORDER BY mr.mrid 
        """

        # 销售
        self.sales_sql_colum = u"""
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
                sr.coupon AS `卷值 `,
                sr.couponInfo AS `卷值信息`,
                sr.advance AS `预付款`,
                sr.advanceType AS `预付款类型1合同2工程`,
                sr.confirmTime AS `凭证确认时间`,
                concat(v. NAME, h.houseNumber) AS `楼盘号`,
                ss.suid AS `设计师ID`,
                cu.userName AS `设计师姓名`,
                cu.userId AS `设计师ID`,
                cu.status AS `0在职1离职2停薪留职`,
                cd.name AS `部门名称`,
                sp.referMoney AS `金额`,
                ss.brand AS `品牌`,
                ss.category AS `品类`,
                cd.kino AS `部门金蝶编号`,
                cd.kiname AS `部门金蝶名称`,
                b.kino AS `品牌金蝶编号`,
                b.kiname AS `品牌金蝶名称`,
                c.kino AS `品类金蝶编号`,
                c.kiname AS `品类金蝶名称`,
                ss.depositpayStatus AS `定金状态`,
                ss.fullpayStatus  AS `补款状态`,
                ss.depositpay AS `定金金额`,
                ss.fullpay AS `补款金额`,
                sr.srid,
	            ss.grade AS '等级'
        """
        self.SALES_SQL = u"""
            SELECT
                %s
            FROM
                payment.salespayment AS sp,
                payment.salesreceipt AS sr,
                sales.sales AS ss,
                communion.house AS h,
                communion.village AS v,
                communion. USER AS cu,
                communion.department AS cd,
                communion.brand AS b,
                communion.category AS c
            WHERE
                sp.sid = ss.sid
                AND sr.srId = sp.srId
                AND ss.hid = h.hid
                AND h.vid = v.vid
                AND cu.uid = ss.suid
                AND cd.did = cu.deptId
                AND ss.bid = b.bid
                AND b.cid = c.cid
                AND sr.collectTime >= '%s'
                AND sr.collectTime <= '%s'
                AND sp.company = %s
            ORDER BY
                sr.srid
            
                        """

        # 服务
        self.servicepayment_colum = u"""
            dd.orderId AS `订单号`,
            ps.type AS `类型`,
            ps.status AS `收退状态`,
            (ps.serviceMoney + ps.advanceMoney) AS `实收金额`,
            pse.cash AS `现金`,
            pse.cashInfo AS `现金信息`,
            pse.bank AS `刷卡`,
            pse.bankInfo AS `刷卡信息`,
            pse.checkv AS `转账`,
            pse.checkvBank AS `转账银行`,
            pse.installment AS `分期`,
            pse.installmentBank AS `分期银行`,
            pse.accounts AS `对公`,
            pse.accountsBank AS `对公银行`,
            cu.userId AS `设计师ID`,
            cu.userName AS `设计师`,
            cu.status AS `在职离职`,
            concat(v.name,h.houseNumber) AS `楼盘号`,
            cd.kino AS `部门金蝶编号`,
            pse.collectTime AS `凭证收款时间`,
            dd.company AS `公司`,
            cd.kiname AS `部门金蝶名称`,
	        dd.grade AS '等级'
        """
        self.SERVICEPAYMENT_SQL = u"""
        SELECT 
            %s
        FROM
            payment.servicepayment ps,
            payment.servicereceipt pse,
            decoration.decoration AS dd,
            communion.house AS h,
            communion.village AS v,
            communion.user AS cu,
            communion.department AS cd
        WHERE
            ps.srid = pse.srid
        AND ps.orderId = dd.orderId
        AND dd.hid = h.hid 
        AND h.vid = v.vid
        AND cu.uid = dd.dsuid
        AND cd.did = cu.deptId
        AND pse.collectTime >= '%s'
        AND pse.collectTime <= '%s'
        AND dd.company = %s
        """

        # 主材
        self.paymentType_materialPayment = {
            1:u"预付款",
            2:u"定金",
            3:u"补款",
            4:u"退款",
            5:u"补款退款",
            6:u"券退款"
        }

        self.receiptType_Data = {}

        self.workbooks = None
        self.vouchorNum = 1
        self.molecular = 1
        self.countAll = 1
        self.row = 1
        self.vouchorNum1 = 1
        self.vouchorNum2 = 1
        self.vouchorNum3 = 1
        self.vouchorNum4 = 1
        self.vouchorNum5 = 1
        
    # 预付款
    def prepayments(self, startTime, endTime, company):
        self.row = 1
        nowPage = 1
        flag = True
        sql = self.ADVANCE_SQL % (self.advance_column, startTime, endTime, company)

        while (flag):
            
            data = self.page(sql, nowPage, size=200)
            
            for i, v in enumerate(data):
            
                v = list(v)
                
                self.divNum(v, [3, 4, 5, 6, 7, 16])
                
                vouchorNum = self.vouchorNum5
                
                subjectNum = 0
                collection = u""
                
                orderId, type, paymentType, cash, bank, checkv, installment, accounts, collectTime, villageName, houseNumber, cashInfo, bankInfo, checkvBank, installmentBank, accountsBank, money, company, grade = v
                
                subjectNum = 0

                voucherTime = (str(collectTime)[0:10]).replace(u"-", u"/")
                spTimes = str(collectTime).split("-")

                voucherYear = spTimes[0]
                voucherPeriod = spTimes[1]
                tmpdate = [voucherTime, voucherYear, voucherPeriod, voucherTime[-5:].replace("/", "")]

                direction = True  # True: 借 , False: 贷
                abstract = u""

                accountInfo = {"OI": orderId, "OA": "%s %s" % (villageName, houseNumber)}

                # 跳过type为2是付款的  跳过paymentType为1和3的是工程和正林的
                if type == 2: continue
                if paymentType == 1 or paymentType == 3: continue

                # 合同收款
                if type == 1 and paymentType == 0:

                    self.grade(0, grade, accountInfo)

                    direction, abstract = self.ContractReceipts(tmpdate, money, vouchorNum, subjectNum, orderId, accountInfo)
                    collection = u"合收"
                    
                # 合同提现
                if type == 0 and paymentType == 0:

                    self.grade(0, grade, accountInfo)

                    direction, abstract = self.ContractPresentation(tmpdate, money, vouchorNum, subjectNum, orderId, accountInfo)
                    collection = u"合收"

                # 主材收款
                if type == 1 and paymentType == 2:

                    self.grade(1, grade, accountInfo)

                    direction, abstract = self.materialReceipts(tmpdate, money, vouchorNum, subjectNum, orderId, accountInfo)
                    collection = u"材收"

                # 主材提现
                if type == 0 and paymentType == 2:

                    self.grade(1, grade, accountInfo)

                    direction, abstract = self.materialPutForward(tmpdate, money, vouchorNum, subjectNum, orderId, accountInfo)
                    collection = u"材收"

                subjectNum += 1

                # 现金
                if cash != 0:
                    subjectNum = self.cash(tmpdate, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 0, accountInfo)

                # 刷卡
                if bank != 0:
                    subjectNum = self.bank(tmpdate, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 0, accountInfo)

                # 分期
                if installment != 0:
                    subjectNum = self.installment(tmpdate, installment, installmentBank, vouchorNum, subjectNum, abstract, direction, company, collection, 0, accountInfo)

                # 转账
                if checkv != 0:
                    subjectNum = self.checkv(tmpdate, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, 0, accountInfo)

                # 对公
                if accounts != 0:
                    subjectNum = self.accounts(tmpdate, accounts, accountsBank, vouchorNum, subjectNum, abstract, direction, company, collection, 0, accountInfo)

                self.vouchorNum5 += 1

            self.molecular = self.molecular + len(data)
            schedules = (self.molecular / self.countAll) * 100

            paln = {
                u"plan.schedule": int(schedules)
            }

            self.updataSchedule(self.pthost, pid, paln)

            nowPage = nowPage + 1
            if len(data) < 200:
                flag = False

    # 合同收款
    def ContractReceipts(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s收%s合同预付款" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---01---合同预付款", **accountInfo)

        datase = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName,
                  u"RMB", u"人民币", money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"",
                  u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                  u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(datase, self.sheets[0], 0)
        
        return False, abstract

    # 合同提现
    def ContractPresentation(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s退%s合同预付款" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||收款类别---01---工程定金", **accountInfo)

        datase = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName,
                  u"RMB", u"人民币", -money, 0, -money, u"", u"NONE", u"NONE", u"NONE",
                  u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                  u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(datase, self.sheets[0], 0)
        
        return True, abstract

    # 主材收款
    def materialReceipts(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        subjectNo = u"2241.01"
        subjectName = u"主材预付款"

        abstract = u"%s收%s主材预付款" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR", **accountInfo)

        datase = [date[0], date[1], date[2], u"材收", vouchorNum, subjectNo, subjectName,
                  u"RMB", u"人民币", money, 0, money, u"", u"NONE", u"NONE", u"NONE",
                  u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0],
                  u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(datase, self.sheets[0], 0)
        
        return False, abstract

    # 主材提现 预付款END
    def materialPutForward(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        subjectNo = u"2241.01"
        subjectName = u"主材预收"

        abstract = u"%s退%s主材预付款" % (date[3], orderId)

        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR", **accountInfo)

        datase = [date[0], date[1], date[2], u"材收", vouchorNum, subjectNo, subjectName,
                  u"RMB", u"人民币", -money, 0, -money, u"", u"NONE", u"NONE", u"NONE",
                  u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"",
                  u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(datase, self.sheets[0], 0)
        
        return True, abstract

    # 完成装修sheet页
    def decorationPage(self, pid, startTime, endTime, company):
        flag = True
        self.row = 1
        nowPage = 1

        sql = self.DECORATION_SQL % (self.decoration_column, startTime, endTime, company)

        while (flag):
            data = self.page(sql, nowPage, size=200)
            self.decoration(data)

            self.molecular = self.molecular + len(data)
            schedules = (self.molecular / self.countAll) * 100

            paln = {
                u"plan.schedule": int(schedules)
            }

            self.updataSchedule(self.pthost, pid, paln)

            nowPage += 1
            if len(data) < 200:
                flag = False

    def decoration(self, data):
    
        collection = u"合收"
        
        for i, v in enumerate(data):
        
            v = list(v)
                
            self.divNum(v, [3, 5, 7, 9, 11, 13, 15, 17])
            
            vouchorNum = self.vouchorNum1
            
            orderId = v[0]
            company = int(v[1])  # 公司id
            paymentType = v[2]  # 款项类型/类别
            referMoney = float(v[3])
            collectTime = str(v[4])  # 凭证收款时间
            cash = float(v[5])  # 现金
            cashInfo = v[6]  # 现金信息
            bank = float(v[7])  # 刷卡
            bankInfo = v[8]  # 刷卡信息
            checkv = float(v[9])  # 转账
            checkvBank = v[10]  # 转账银行信息
            installment = float(v[11])  # 分期
            installmentBank = v[12]  # 分期银行信息
            accounts = float(v[13])  # 对公
            accountsBank = v[14]  # 对公银行信息
            coupon = float(v[15])  # 卷值
            couponInfo = v[16]  # 卷值信息
            advance = float(v[17])  # 预付款
            advanceType = int(v[18])  # 预付款类型1合同2工程
            orderAddr = v[20]  # 楼盘号
            userName = v[22]  # 设计师姓名
            userId = v[23]  # 设计师ID
            status = int(v[24]) + 1  # 0在职1离职2停薪留职
            deptName = v[25]  # 部门名称
            deptKino = v[26]  # `金蝶编号`
            deptKinoName = v[27]  # `金蝶名称`
            grade = v[28]

            if paymentType.find(u"历史") != -1: continue
            if paymentType.find(u"VIP") != -1: continue
            
            subjectNum = 0

            voucherTime = (collectTime[0:10]).replace(u"-", u"/")

            spTimes = collectTime.split("-")
            voucherYear = spTimes[0]
            voucherPeriod = spTimes[1]
            tmpdate = [voucherTime, voucherYear, voucherPeriod , voucherTime[-5:].replace("/", "")]

            abstract = ""  # 摘要
            direction = True  # True: 借 , False: 贷
            
            accountInfo = {"OI": orderId, "OA": orderAddr}
            
            self.grade(0, grade, accountInfo) # 根据等级获取核算类别 , A/B/C等级

            if paymentType.find(u'首付款') != -1:
                direction, abstract = self.firstpayment(tmpdate, paymentType, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType.find(u'首付二期款') != -1:
                direction, abstract = self.downpayment(tmpdate, paymentType, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType.find(u'二期款') != -1:
                direction, abstract = self.secondpayment(tmpdate, paymentType, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType.find(u'尾款') != -1:
                direction, abstract = self.tailpayment(tmpdate, paymentType, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType.find(u'设计费') != -1:
                direction, abstract = self.designpayment(tmpdate, paymentType, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType == u'增项款':
                direction, abstract = self.additionalpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType == u'减项款':
                direction, abstract = self.subpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType == u'违约金':
                direction, abstract = self.penaltypayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

            elif paymentType == u'合同退款':
                direction, abstract = self.contractBackpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                
            elif paymentType.find(u"决算") != -1:
                direction, abstract = self.accountpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, paymentType, accountInfo)
                
            if abstract == "": continue

            subjectNum += 1

            if advance != 0:
                subjectNum = self.advance(tmpdate, advance, vouchorNum, subjectNum, direction, orderId, paymentType, accountInfo)

            # 现金
            if cash != 0:
                subjectNum = self.cash(tmpdate, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 1, accountInfo)

            # 刷卡
            if bank != 0:
                subjectNum = self.bank(tmpdate, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 1, accountInfo)

            # 卷
            if coupon != 0:
                subjectNum = self.coupon(tmpdate, couponInfo, vouchorNum, subjectNum, abstract, direction, orderId, company, collection, 1, accountInfo)

            # 转账
            if checkv != 0:
                subjectNum = self.checkv(tmpdate, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, 1, accountInfo)

            # 分期
            if installment != 0:
                subjectNum = self.installment(tmpdate, installment, installmentBank, vouchorNum, subjectNum, abstract, direction, company, collection, 1, accountInfo)

            # 对公
            if accounts != 0:
                subjectNum = self.accounts(tmpdate, accounts, accountsBank, vouchorNum, subjectNum, abstract, direction, company, collection, 1, accountInfo)

            self.vouchorNum1 += 1

    # 首付款
    def firstpayment(self, date, paymentType, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"  # 科目代码
        subjectName = u"基础工程款"  # 科目名称
        
        refundFlag = paymentType.find(u'退款') == -1
        
#        debit = money if not refundFlag else 0
#        credit = money if refundFlag else 0

        money = money if refundFlag else -money
        abstract = u"%s收%s首付款" % (date[3], orderId) if refundFlag else u"%s退%s首付款退款" % (date[3], orderId)
        direction = not refundFlag
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---02---首付款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)

        return direction, abstract
    
    # 首付二期款
    def downpayment(self, date, paymentType, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"
        
        refundFlag = paymentType.find(u'退款') == -1
        
        money = money if refundFlag else -money
        abstract = u"%s收%s首付二期款" % (date[3], orderId) if refundFlag else u"%s退%s首付二期款退款" % (date[3], orderId)
        direction = not refundFlag
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---03---首付二期款", **accountInfo)

        subjectmodule = [ date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"  ", abstract, 0, u"*", 0, u"",
                          date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return direction, abstract

    # 二期款
    def secondpayment(self, date, paymentType, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"
        
        refundFlag = paymentType.find(u'退款') == -1
        
        money = money if refundFlag else -money
        abstract = u"%s收%s二期款 " % (date[3], orderId) if refundFlag else u"%s退%s二期款退款" % (date[3], orderId)
        direction = not refundFlag

        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---04---二期款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return direction, abstract

    # 尾款
    def tailpayment(self, date, paymentType, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"
        
        refundFlag = paymentType.find(u'退款') == -1
        
        money = money if refundFlag else -money
        abstract = u"%s收%s尾款" % (date[3], orderId) if refundFlag else u"%s退%s尾款退款" % (date[3], orderId)
        direction = not refundFlag
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---05---尾款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return direction, abstract

    # 设计费
    def designpayment(self, date, paymentType, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"
        
        refundFlag = paymentType.find(u'退款') == -1
        
        money = money if refundFlag else -money
        abstract = u"%s收%s设计费" % (date[3], orderId) if refundFlag else u"%s退%s设计费退款" % (date[3], orderId)
        direction = not refundFlag
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---08---设计费", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)

        return direction, abstract

    # 增项款
    def additionalpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s收%s增项款" % (date[3], orderId)
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---06---增减项款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)

        return False, abstract

    # 减项款
    def subpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s退%s减项款" % (date[3], orderId)
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---06---增减项款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         -money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)

        return True, abstract

    # 合同退款
    def contractBackpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s退%s合同退款" % (date[3], orderId)
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---02---首付款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         -money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"参考信息",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return True, abstract
    
    # 违约金
    def penaltypayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"

        abstract = u"%s收%s违约金" % (date[3], orderId)
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---02---首付款", **accountInfo)
        
        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         -money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        subjectNo = u"6301.01"
        subjectName = u"工程退单违约金"

        fuhe = self.checkAccount(u"客户---.$OI---$OA||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return False, abstract
    
    # 决算  装修END
    def accountpayment(self, date, money, vouchorNum, subjectNum, orderId, paymentType, accountInfo):
        
        subjectNo = u"1122.01"
        subjectName = u"基础工程款"
        
        direction = not paymentType == u"决算补款"
        abstract = u"%s%s%s%s" % (date[3], direction and u"退" or u"收", orderId, paymentType)
        money = money if not direction else -money
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---07---决算扣补款", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"参考信息",
                         date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        
        return direction, abstract

    # 预付款
    def advance(self, date, money, vouchorNum, subjectNum, direction, orderId, paymentType, accountInfo):

        subjectNo = u"1131.01"
        subjectName = u"基础工程款"
        
#        debit = money if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
#        credit = money if direction else 0

        abstract = u"%s收%s定金转%s" % (date[3], orderId, paymentType)
        
        fuhe = self.checkAccount(u"客户---02.$OI---$OA||核算类别---$NU---$GR||收款类别---01---工程定金", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName,
                             u"RMB", u"人民币", -money, 0, -money, u"", u"NONE", u"NONE", u"NONE",
                             u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                             u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[1], 1)
        return subjectNum + 1

    # 主材
    def matreial(self, startTime, endTime, company):
        self.row = 1
        collection = u"材收"
        flag = True
        nowPage = 1
        sql = self.MATERIAL_SQL % (self.material_column, startTime, endTime, company)

        receiptId = 0
        vouchorNum = 0
        subjectNum = 0
        
        while (flag):
            data = self.page(sql, nowPage, size=200)
            
            for i, v in enumerate(data):
            
                v = list(v)
                
                self.divNum(v, [4, 6, 8, 10, 12, 14, 16, 25, 35, 36])
                
                orderId = v[0]
                company = v[1]  # 公司id
                paymentType = v[2]  # 款项类型/类别
                collectTime = v[3]  # 凭证收款时间
                cash = float(v[4])  # 现金
                cashInfo = v[5]  # 现金信息
                bank = float(v[6])  # 刷卡
                bankInfo = v[7]  # 刷卡信息
                checkv = float(v[8])  # 转账
                checkvBank = v[9]  # 转账银行信息
                installment = float(v[10])  # 分期
                installmentBank = v[11]  # 分期银行信息
                accounts = float(v[12])  # 对公
                accountsBank = v[13]  # 对公银行信息
                coupon = float(v[14])  # 卷值
                couponInfo = v[15]  # 卷值信息
                advance = float(v[16])  # 预付款
                advanceType = int(v[17])  # 预付款类型1主材2正林
                confirmTime = v[18]  # 凭证确认时间
                orderAddr = v[19]  # 楼盘号
                userName = v[21]  # 设计师姓名
                userId = v[22]  # 设计师ID
                status = int(v[23]) + 1  # 0在职1离职2停薪留职
                deptName = v[24]  # 部门名称
                referMoney = float(v[25])  # 原币金额
                brand = v[26]  # 品牌
                category = v[27]  # 品类
                deptKino = v[28]  # `金蝶编号`
                deptKiName = v[29]  # `金蝶部门名称`
                brandKino = v[30]  # 金蝶品牌编号
                brandKiname = v[31]  # 金蝶品牌名称
                categoryKino = v[32]  # 金蝶品类编号
                categoryKiname = v[33]  # 金蝶品类名称
                depositStatus = v[34]  # 定金状态
                depositPayment = float(v[35])  # 定金金额
                fullPayment = float(v[36])  # 补款状态
                fullStatus = float(v[37])  # 补款金额
                mrid = int(v[38])
                grade = v[39]
                
                voucherTime = str(collectTime)[0:10].replace(u"-", u"/")
                spTimes = str(collectTime).split("-")
                voucherYear = spTimes[0]
                voucherPeriod = spTimes[1]
                
                tmpdate = [voucherTime, voucherYear, voucherPeriod, voucherTime[-5:].replace("/", "")]
                abstract = ""  # 摘要
                direction = True  # True: 借 , False: 贷
                receiptFlag = False

                accountInfo = {"OI": orderId, "OA": orderAddr, "CI": categoryKino, "CN": categoryKiname, "BI": brandKino, "BN": brandKiname}
                
                self.grade(0, grade, accountInfo) # 根据等级获取核算类别 , A/B/C等级
                
                if mrid != receiptId:
                    receiptId = mrid
                    vouchorNum += 1
                    subjectNum = 0
                    receiptFlag = True
                
                if paymentType == 2:  # 定金
                    direction, abstract = self.mfirstpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                elif paymentType == 3:  # 补款 + 主材定金转收入
                    direction, abstract, subjectNum = self.msecondpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, depositStatus, depositPayment, accountInfo)
                elif paymentType in (4, 6):  # 退款
                    direction, abstract = self.mthirdpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                elif paymentType == 5:  # 补款退款
                    direction, abstract, subjectNum = self.mfourthpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, depositPayment, fullPayment, accountInfo)
                elif paymentType == 7:  # 定金退款
                    direction, abstract = self.msixthpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                    
                subjectNum = subjectNum + 1
                
                if receiptFlag:
                    if cash != 0:
                        subjectNum = self.cash(tmpdate, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 2, accountInfo)
                    # 刷卡
                    if bank != 0:
                        subjectNum = self.bank(tmpdate, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 2, accountInfo)
                    # #卷
                    if coupon != 0:
                        subjectNum = self.coupon(tmpdate, couponInfo, vouchorNum, subjectNum, abstract, direction, orderId, company, collection, 2, accountInfo)
                    # 转账
                    if checkv != 0:
                        subjectNum = self.checkv(tmpdate, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, 2, accountInfo)
                    # 分期
                    if installment != 0:
                        subjectNum = self.installment(tmpdate, installment, installmentBank, vouchorNum, subjectNum, abstract, direction, company, collection, 2, accountInfo)
                    # 对公
                    if accounts != 0:
                        subjectNum = self.accounts(tmpdate, accounts, accountsBank, vouchorNum, subjectNum, abstract, direction, company, collection, 2, accountInfo)
                    
                    if advance != 0:
                        subjectNum = self.materialAdvance(tmpdate, advance, vouchorNum, subjectNum, orderId, paymentType, 2, accountInfo)

            self.molecular = self.molecular + len(data)
            schedules = (self.molecular / self.countAll) * 100

            paln = {
                u"plan.schedule": int(schedules)
            }

            self.updataSchedule(self.pthost, pid, paln)

            nowPage += 1
            if len(data) < 200:
                flag = False
                
        return self.molecular

    # 主材定金
    def mfirstpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        kino = u"2241.02"
        kiname = u"主材定金"
        
        abstract = u"%s收%s主材定金" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe,
                         0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
        
        return False, abstract
        
    # 主材补款 / 主材定金转收入
    def msecondpayment(self, date, money, vouchorNum, subjectNum, orderId, depositStatus, depositPayment, accountInfo):

        if depositStatus == 0:
            kino = u"2241.03"
            kiname = u"主材合同款"
    
            abstract = u"%s收%s主材款" % (date[3], orderId)
    
            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                             money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*",
                             0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
    
            self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
            
        else:
            kino = u"2241.02"
            kiname = u"主材定金"
            
            abstract = u"%s收%s主材定金转收入" % (date[3], orderId)  # 1015收1810150070主材定金

            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---GR", **accountInfo)

            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币", depositPayment,
                             depositPayment, 0, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                             date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
            self.wirteSheetValue(subjectmodule, self.sheets[2], 2)

            kino = u"2241.02"
            kiname = u"主材收入"

            subjectNum = subjectNum + 1

            abstract = u"%s收%s主材款" % (date[3], orderId)  # 1015收1810150070主材定金

            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)
            
            fullpay = money + depositPayment

            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币", fullpay,
                             0, -fullpay, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                             date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
            self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
            

        return False, abstract, subjectNum

    # 主材退款
    def mthirdpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        kino = u"2241.03"
        kiname = u"主材合同款"

        abstract = u"%s退%s主材款" % (date[3], orderId)

        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         - money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[2], 2)

        return True, abstract

    # 主材补款退款
    def mfourthpayment(self, date, money, vouchorNum, subjectNum, orderId, depositPayment, fullPayment, accountInfo):

        kino = u"2241.02"
        kiname = u"主材定金"

        abstract = u"%s退%s主材定金转全款" % (date[3], orderId)  # 1015收1810150070主材定金
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         - depositPayment, 0, -depositPayment, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
        
        kino = u"2241.02"
        kiname = u"主材收入"
        subjectNum = subjectNum + 1
        abstract = u"%s退%s主材定金" % (date[3], orderId)  # 1015收1810150070主材定金
        #02.
        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         depositPayment + fullPayment, 0, depositPayment + fullPayment, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
        
        return True, abstract, subjectNum

    # 定金退款
    def msixthpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        kino = u"2241.02"
        kiname = u"主材定金"

        abstract = u"%s退%s主材定金" % (date[3], orderId)  # 1015收1810150070主材定金

        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||主材结算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         - money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe,
                         0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[2], 2)
        
        return True, abstract
    
    # 主材 END
    def materialAdvance(self, date, money, vouchorNum, subjectNum, orderId, paymentType, sheet, accountInfo):
        
        subjectNo = u"2241.01"
        subjectName = u"主材预付款"

        abstract = u"%s收%s预收转%s" % (date[3], orderId, paymentType == 2 and u"主材定金" or u"主材款")

        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0,
                         u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
        
        return subjectNum + 1
    
    # 销售
    def sales(self, startTime, endTime, company):
        self.row = 1
        collection = u"材收"
        flag = True
        nowPage = 1
        sql = self.SALES_SQL % (self.sales_sql_colum, startTime, endTime, company)

        receiptId = 0
        vouchorNum = 0
        subjectNum = 0
        
        while (flag):
            
            data = self.page(sql, nowPage, size=200)
            
            for i, v in enumerate(data):
            
                v = list(v)
                
                self.divNum(v, [4, 6, 8, 10, 12, 14, 16, 25, 36, 37])
                
                orderId = v[0]
                company = v[1]  # 公司id
                paymentType = v[2]  # 款项类型/类别
                collectTime = v[3]  # 凭证收款时间
                cash = v[4]  # 现金
                cashInfo = v[5]  # 现金信息
                bank = v[6]  # 刷卡
                bankInfo = v[7]  # 刷卡信息
                checkv = v[8]  # 转账
                checkvBank = v[9]  # 转账银行信息
                installment = v[10]  # 分期
                installmentBank = v[11]  # 分期银行信息
                accounts = v[12]  # 对公
                accountsBank = v[13]  # 对公银行信息
                coupon = v[14]  # 卷值
                couponInfo = v[15]  # 卷值信息
                advance = v[16]  # 预付款
                advanceType = v[17]  # 预付款类型1合同2工程
                confirmTime = v[18]  # 凭证确认时间
                orderAddr = v[19]  # 楼盘号
                userName = v[21]  # 设计师姓名
                userId = v[22]  # 设计师ID
                status = int(v[23]) + 1  # 0在职1离职2停薪留职
                deptName = v[24]  # 部门名称
                referMoney = v[25]  # 原币金额
                brand = v[26]  # 品牌
                category = v[27]  # 品类
                deptKino = v[28]  # `金蝶编号`
                deptKiname = v[29]  # 金蝶名称
                brandKino = v[30]  # 金蝶品牌编号
                brandKiname = v[31]  # 金蝶品牌名称
                categoryKino = v[32]  # 金蝶品类编号
                categoryKiname = v[33]  # 金蝶品类名称
                depositStatus = v[34]  # 定金状态
                fullStatus = v[35]  # 补款状态
                depositPay = v[36]  # 定金金额
                fullPay = v[37]  # 补款金额
                srid = v[38]
                grade = v[39]

                voucherTime = str(collectTime)[0:10].replace(u"-", u"/")
                spTimes = str(collectTime).split("-")
                voucherYear = spTimes[0]
                voucherPeriod = spTimes[1]
                tmpdate = [voucherTime, voucherYear, voucherPeriod, voucherTime[-5:].replace("/", "")]

                abstract = ""  # 摘要
                direction = True  # True: 借 , False: 贷

                accountInfo = {"OI": orderId, "OA": orderAddr, "CI": categoryKino, "CN": categoryKiname, "BI": brandKino, "BN": brandKiname}
                
                self.grade(1, grade, accountInfo) # 根据等级获取核算类别 , A/B/C等级

                receiptFlag = False
                
                if srid != receiptId:
                    receiptId = srid
                    vouchorNum += 1
                    subjectNum = 0
                    receiptFlag = True
                
                if paymentType == 2:  # 定金
                    direction, abstract = self.sfirstpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                elif paymentType == 3:  # 补款  + 主材定金转收入
                    direction, abstract, subjectNum = self.ssecondpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, depositPay, depositStatus, accountInfo)
                elif paymentType in (4, 6):  # 退款
                    direction, abstract = self.sthirdpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                elif paymentType == 5:  # 补款退款
                    direction, abstract, subjectNum  = self.sfourthpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, depositPay, depositStatus, fullPay, fullStatus, accountInfo)
                elif paymentType == 7:  # 定金退款
                    direction, abstract = self.ssixthpayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)
                    
                subjectNum += 1

                if receiptFlag:
                    if cash != 0:
                        subjectNum = self.cash(tmpdate, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 4, accountInfo)
                    if bank != 0:
                        subjectNum = self.bank(tmpdate, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 4, accountInfo)
                    if coupon != 0:
                        subjectNum = self.coupon(tmpdate, couponInfo, vouchorNum, subjectNum, abstract, direction, orderId, company, collection, 4, accountInfo)
                    if checkv != 0:
                        subjectNum = self.checkv(tmpdate, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, 4, accountInfo)
                    if installment != 0:
                        subjectNum = self.installment(tmpdate, installment, installmentBank, vouchorNum, subjectNum, abstract, direction, company, collection, 4, accountInfo)
                    if accounts != 0:
                        subjectNum = self.accounts(tmpdate, accounts, accountsBank, vouchorNum, subjectNum, abstract, direction, company, collection, 4, accountInfo)
                    if advance != 0:
                        subjectNum = self.materialAdvance(tmpdate, advance, vouchorNum, subjectNum, orderId, paymentType, 4, accountInfo)

            self.molecular = self.molecular + len(data)
            schedules = (self.molecular / self.countAll) * 100

            paln = {
                u"plan.schedule": int(schedules)
            }

            self.updataSchedule(self.pthost, pid, paln)

            nowPage += 1
            if len(data) < 200:
                flag = False
        return self.molecular

    # 定金 / 定金转收入
    def sfirstpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        kino = u"2241.02"
        kiname = u"主材定金"
        
        abstract = u"%s收%s主材定金" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe,
                         0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[4], 4)
        
        return False, abstract
        
    # 补款
    def ssecondpayment(self, date, money, vouchorNum, subjectNum, orderId, depositPay, depositStatus, accountInfo):

        if depositStatus == -1:

            kino = u"2241.03"
            kiname = u"主材合同款"
    
            abstract = u"%s收%s主材款" % (date[3], orderId)  # 1015收1810150070主材定金
    
            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)
    
            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                             money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                             u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
    
            self.wirteSheetValue(subjectmodule, self.sheets[4], 4)

        else:
            kino = u"2241.02"
            kiname = u"主材定金"
            abstract = u"%s收%s主材定金转收入" % (date[3], orderId)  # 1015收1810150070主材定金

            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币", depositPay,
                             depositPay, 0, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                             date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
            
            self.wirteSheetValue(subjectmodule, self.sheets[4], 4)

            kino = u"2241.03"
            kiname = u"主材收入"
            subjectNum = subjectNum + 1
            fullpay = depositPay + money

            abstract = u"%s收%s主材款" % (date[3], orderId)  # 1015收1810150070主材定金
            
            fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

            subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币", fullpay,
                             0, fullpay, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"",
                             date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
            
            self.wirteSheetValue(subjectmodule, self.sheets[4], 4)
            
        return False, abstract, subjectNum

    # 退款
    def sthirdpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        kino = u"2241.03"
        kiname = u"主材合同款"

        abstract = u"%s退%s主材款" % (date[3], orderId)  # 1015收1810150070主材定金

        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB", u"人民币",
                         - money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0,
                         u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[4], 4)

        return True, abstract

    # 补款退款
    def sfourthpayment(self, date, money, vouchorNum, subjectNum, orderId, depositPay, depositStatus, fullPay, fullStatus, accountInfo):

        kino = u"2241.02"
        kiname = u"主材定金"
        
        abstract = u"%s退%s主材定金转全款" % (date[3], orderId)  # 1015收1810150070主材定金

        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB",
                         u"人民币", -depositPay, 0, -depositPay, u"", u"NONE", u"NONE", u"NONE", u"",
                         u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0,
                         1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
        
        self.wirteSheetValue(subjectmodule, self.sheets[4], 4)

        kino = u"2241.03"
        kiname = u"主材合同款"
        subjectNum = subjectNum + 1
        abstract = u"%s退%s主材定金转全款" % (date[3], orderId)  # 1015收1810150070主材定金

        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)
        
        fullpay = depositPay - money

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB",
                         u"人民币", fullpay, 0, fullpay, u"", u"NONE", u"NONE", u"NONE", u"",
                         u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0,
                         1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
            
        self.wirteSheetValue(subjectmodule, self.sheets[4], 4)
            
        return True, abstract, subjectNum

    # 定金退款
    def ssixthpayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):

        kino = u"2241.02"
        kiname = u"主材定金"

        abstract = u"%s退%s主材定金" % (date[3], orderId)  # 1015收1810150070主材定金
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||供应商---$BI---$BN||主材大类---$CI---$CN||核算类别---$NU---$GR", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"材收", vouchorNum, kino, kiname, u"RMB",
                         u"人民币", -money, 0, -money, u"", u"NONE", u"NONE",
                         u"NONE", u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0,
                         1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[4], 4)
        
        return True, abstract
        
    # 服务
    def servicePaymentPage(self, startTime, endTime, company):
        self.row = 1
        flag = True
        nowPage = 1
        collection = u"合收"
        sql = self.SERVICEPAYMENT_SQL % (self.servicepayment_colum, startTime, endTime, company)

        while (flag):
        
            data = self.page(sql, nowPage, size=200)
            
            for i, v in enumerate(data):
            
                v = list(v)
                
                self.divNum(v, [3, 4, 6, 8, 10, 12])
            
                vouchorNum = self.vouchorNum3
                orderId = v[0]  # 订单号
                type = int(v[1])  # 类型0: 收款 , 1: 退款
                status = int(v[2])  # 收退状态`
                referMoney = float(v[3])  # `实收金额
                cash = float(v[4])  # `现金`,
                cashInfo = v[5]  # `现金信息
                bank = float(v[6])  # `刷卡`,
                bankInfo = v[7]  # `刷卡信息
                checkv = float(v[8])  # `转账`,
                checkvBank = v[9]  # `转账银行`
                installment = float(v[10])  # `分期`,
                installmentBank = v[11]  # `分期银行`,
                accounts = float(v[12])  # `对公`,
                accountsBank = v[13]  # `对公银行`,
                userId = v[14]  # `设计师ID`,
                userName = v[15]  # `设计师`,
                status = int(v[16]) + 1  # `在职离职`,
                orderAddr = v[17]  # `楼盘号`,
                kino = v[18]  # `部门金蝶编号`
                collectTime = str(v[19])  # 凭证收款时间
                company = int(v[20])  # `公司`
                kiname = v[21]  # 部门金蝶名称
                grade = v[22]  # 部门金蝶名称

                subjectNum = 0

                voucherTime = (collectTime[0:10]).replace(u"-", u"/")
                spTimes = collectTime.split("-")
                voucherYear = spTimes[0]
                voucherPeriod = spTimes[1]
                tmpdate = [voucherTime, voucherYear, voucherPeriod, voucherTime[-5:].replace("/", "")]

                abstract = ""  # 摘要
                direction = True  # True: 借 , False: 贷

                accountInfo = {"OI": orderId, "OA": orderAddr}
                
                self.grade(0, grade, accountInfo) # 根据等级获取核算类别 , A/B/C等级

                if type == 0:
                    direction, abstract = self.servicePayment(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

                if type == 1:
                    direction, abstract = self.servicePaymentBack(tmpdate, referMoney, vouchorNum, subjectNum, orderId, accountInfo)

                subjectNum = subjectNum + 1

                # 现金
                if cash != 0:
                    subjectNum = self.cash(tmpdate, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 3, accountInfo)
                # 刷卡
                if bank != 0:
                    subjectNum = self.bank(tmpdate, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, 3, accountInfo)

                # 转账
                if checkv != 0:
                    subjectNum = self.checkv(tmpdate, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, 3, accountInfo)

                # 分期
                if installment != 0:
                    subjectNum = self.installment(tmpdate, installment, installmentBank, vouchorNum, subjectNum, abstract, direction, company, collection, 3, accountInfo)

                # 对公
                if accounts != 0:
                    subjectNum = self.accounts(tmpdate, accounts, accountsBank, vouchorNum, subjectNum, abstract, direction, company, collection, 3, accountInfo)

                self.vouchorNum3 += 1

            self.molecular = self.molecular + len(data)
            schedules = (self.molecular / self.countAll) * 100

            paln = {
                u"plan.schedule": int(schedules)
            }

            self.updataSchedule(self.pthost, pid, paln)

            nowPage += 1
            if len(data) < 200:
                flag = False

    def servicePayment(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"  # 科目代码
        subjectName = u"基础工程款"  # 科目名称

        abstract = u"%s收%s服务款" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---09---服务费", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         money, 0, money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0,
                         u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
        self.wirteSheetValue(subjectmodule, self.sheets[3], 3)

        return False, abstract

    def servicePaymentBack(self, date, money, vouchorNum, subjectNum, orderId, accountInfo):
        
        subjectNo = u"1122.01"  # 科目代码
        subjectName = u"基础工程款"  # 科目名称

        abstract = u"%s退%s服务款" % (date[3], orderId)
        
        fuhe = self.checkAccount(u"客户---$OI---$OA||核算类别---$NU---$GR||收款类别---09---服务费", **accountInfo)

        subjectmodule = [date[0], date[1], date[2], u"合收", vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         -money, 0, -money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0,
                         u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[3], 3)

        return True, abstract

    # 现金--通用
    def cash(self, date, cash, cashInfo, vouchorNum, subjectNum, abstract, direction, company, collection, sheet, accountInfo):
        
        receiptType = self.getReceiptType(cashInfo, company)
        
        if receiptType == None:
            # print u"凭证号%s, 现金中发现receiptType为空!!!" % vouchorNum
            pass
        else:
            subjectNo = receiptType["kino"]
            subjectName = receiptType["kiname"]

            debit = cash if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
            credit = cash if direction else 0

            fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

            subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName,
                             u"RMB", u"人民币", cash, debit, credit, u"", u"NONE", u"NONE", u"NONE",
                             u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                             u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

            self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)

        return subjectNum + 1

    # 刷卡--通用
    def bank(self, date, bankInfo, vouchorNum, subjectNum, abstract, direction, company, collection, sheet, accountInfo):
        
        banks = bankInfo.split("#")

        for _bank in banks:

            if _bank == "": continue

            _info = _bank.split("|")

            _no = _info[0]
            _money = float(_info[1])
            _time = _info[2]

            receiptType = self.getReceiptType(_no, company)
            if receiptType == None:
                # print u"凭证号%s, 刷卡发现receiptType为空!!!" % vouchorNum
                pass
            else:
                subjectNo = receiptType["kino"]
                subjectName = receiptType["kiname"]

                debit = _money if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
                credit = _money if direction else 0
                
                fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

                subjectmodule = [ date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                                  _money, debit, credit, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*",
                                  0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

                self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
                
                subjectNum = subjectNum + 1
        
        return subjectNum

    # 转账--通用
    def checkv(self, date, checkv, checkvBank, vouchorNum, subjectNum, abstract, direction, company, collection, sheet, accountInfo):
    
        if checkvBank.find(u"#") != -1:
            # 包含#号
            checkvBanks = checkvBank.split("#")
            for _checkvBanks in checkvBanks:
                try:
                    if _checkvBanks == "": continue

                    _info = _checkvBanks.split("|")

                    _no = _info[0]
                    _money = float(_info[1])
                    _time = _info[2]

                    receiptType = self.getReceiptType(_no, company)
                    if receiptType != None:
                        subjectNo = receiptType["kino"]
                        subjectName = receiptType["kiname"]

                        debit = _money if not direction else 0
                        credit = _money if direction else 0
                        
                        fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)
                        
                        subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName,
                                         u"RMB", u"人民币", _money, debit, credit, u"", u"NONE", u"NONE", u"NONE",
                                         u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                                         u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]
                        
                        self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
                        
                        subjectNum = subjectNum + 1
                        
                except Exception as e:
                    e = u"发现转账脏数据: %s" % _info[1]
                    self.errCall(pid, self.pthost, self.media, e, False)
            
            return subjectNum
        else:
            # 不包含#号 老数据
            receiptType = self.getReceiptType(checkvBank, company)
            if receiptType == None:
                print (u"凭证号: %s转账receiptType发现为空" % checkvBank)
            else:

                subjectNo = receiptType["kino"]
                subjectName = receiptType["kiname"]

                debit = checkv if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
                credit = checkv if direction else 0
                
                fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

                subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName,
                                 u"RMB", u"人民币", checkv, debit, credit, u"", u"NONE", u"NONE", u"NONE",
                                 u"", u"*", u"", abstract, 0, u"*", 0, u"", date[0], u"", 0, 1807, u"", u"",
                                 u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

                self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
                
            return subjectNum + 1

    # 分期--通用
    def installment(self, date, installment, installmentnfo, vouchorNum, subjectNum, abstract, direction, company, collection, sheet, accountInfo):

        receiptType = self.getReceiptType(installmentnfo, company)
        if receiptType == None: return subjectNum
        
        subjectNo = receiptType["kino"]
        subjectName = receiptType["kiname"]

        debit = installment if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
        credit = installment if direction else 0

        fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

        subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         installment, debit, credit, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0,
                         u"*", 0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"",
                         u""]
        
        self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
            
        return subjectNum + 1

    # 对公--通用
    def accounts(self, date, accounts, installmentnfo, vouchorNum, subjectNum, abstract, direction, company, collection, sheet, accountInfo):
        # 需要通过cashInfo,company获取receiptType中对应的科目信息

        receiptType = self.getReceiptType(installmentnfo, company)
        if receiptType == None: return subjectNum
        
        subjectNo = receiptType["kino"]
        subjectName = receiptType["kiname"]

        debit = accounts if not direction else 0  # 如果为 direction==True  debit =cash  else debit=0
        credit = accounts if direction else 0

        fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

        subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName, u"RMB", u"人民币",
                         accounts, debit, credit, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*",
                         0, u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

        self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)

        return subjectNum + 1

    # 优惠卷--通用
    def coupon(self, date, couponInfo, vouchorNum, subjectNum, abstract, direction, orderId, company, collection, sheet, accountInfo):
        coupons = couponInfo.split("#")

        for _coupon in coupons:

            if _coupon == "": continue

            _info = _coupon.split(":")

            _no = _info[0]
            _money = -float(_info[1])

            receiptType = self.getReceiptType(_no, company)
            subjectNo = receiptType["kino"]
            subjectName = receiptType["kiname"]
            
            debit = 0  # 如果为 direction==True  debit =cash  else debit=0
            _money = _money if not direction else -_money

            fuhe = self.checkAccount(receiptType["assistant"], **accountInfo)

            subjectmodule = [date[0], date[1], date[2], collection, vouchorNum, subjectNo, subjectName, u"RMB", u"人民币", _money,
                             0, _money, u"", u"NONE", u"NONE", u"NONE", u"", u"*", u"", abstract, 0, u"*", 0,
                             u"", date[0], u"", 0, 1807, u"", u"", u"公司汇率", 1, subjectNum, fuhe, 0, u"", u""]

            self.wirteSheetValue(subjectmodule, self.sheets[sheet], sheet)
            
            subjectNum = subjectNum + 1

        return subjectNum
    
    def grade(self, type, grade, accountInfo):
        
        nu = '02'
        gr = '对内'
        
        if type == 0 and grade in ['A', 'C']:
            nu = '01'
            gr = '对外'
            
        if type == 1 and grade in ['B']:
            nu = '01'
            gr = '对外'
        
        accountInfo['NU'] = nu
        accountInfo['GR'] = gr
    
    def checkAccount(self, format, **kwargs):
        if format:
            return Template(format).substitute(kwargs)

    def getRow(self, path, num):
        book, sheet = self.openWorkbook(path, num)
        sheet = sheet.col_values(0)
        return len(sheet)

    def wirteSheetValue(self, data, sheet, num):
        for i, v in enumerate(data):
            self.writeWorkbook(sheet, self.row , i, v)
        self.row += 1

    # 创建表格返回sheet页
    def createWorkbookAndSheet(self, path):
        workbookParams = self.createWorkbook(u"预付")
        self.workbooks = workbookParams[0]

        sheet1 = workbookParams[1]
        sheet2 = self.workbooks.add_sheet(u"装修", cell_overwrite_ok=True)
        sheet3 = self.workbooks.add_sheet(u"主材", cell_overwrite_ok=True)
        sheet4 = self.workbooks.add_sheet(u"服务", cell_overwrite_ok=True)
        sheet5 = self.workbooks.add_sheet(u"销售", cell_overwrite_ok=True)

        self.createTableHead(sheet1, self.tableHead)
        self.createTableHead(sheet2, self.tableHead)
        self.createTableHead(sheet3, self.tableHead)
        self.createTableHead(sheet4, self.tableHead)
        self.createTableHead(sheet5, self.tableHead)

        self.saveWorkbook(path, self.workbooks)

        return sheet1, sheet2, sheet3, sheet4, sheet5

    # 缓存receipttype收据类型
    def cacheReceiptType(self):
        sql = u"SELECT no, company, kino, kiname, assistant FROM data.receipttype"
        data = self.executeQuerySQL(sql)
        for i, v in enumerate(data):
            no = v[0]
            company = int(v[1])
            keyName = u"%s-%s" % (no, company)

            self.receiptType_Data[keyName] = {"no":no, "company":company , "kino":v[2], "kiname":v[3],"assistant":v[4]}

    # 通过 no company获得receipttype收据类型数据
    def getReceiptType(self, no, company):
        keyName = u"%s-%s" % (no, int(company))
        if keyName in self.receiptType_Data :
            return self.receiptType_Data[keyName]

    def countSschedule(self, startTime, endTime, company):

        count = 0

        countSQL = self.DECORATION_SQL % (u"count(*)", startTime, endTime, company)
        counts = self.count(countSQL)
        count = count + counts

        countSQL = self.ADVANCE_SQL % (u"count(*)", startTime, endTime, company)
        counts = self.count(countSQL)
        count = count + counts

        countSQL = self.MATERIAL_SQL % (u"count(*)", startTime, endTime, company)
        counts = self.count(countSQL)
        count = count + counts

        countSQL = self.SALES_SQL % (u"count(*)", startTime, endTime, company)
        counts = self.count(countSQL)
        count = count + counts

        countSQL = self.SERVICEPAYMENT_SQL % (u"count(*)", startTime, endTime, company)
        counts = self.count(countSQL)
        count = count + counts

        if count == 0:
            raise RuntimeError(u'The query result is zero!')

        all = count / 0.9
        self.molecular = all * 0.1
        schedule = (self.molecular / all) * 100

        paln = {
            u"plan.schedule": int(schedule),
            u"plan.status": 4
        }
        self.updataSchedule(self.pthost, pid, paln)

        return all

    def main(self, pid, startTime, endTime, company):
        try:
            falgs = self.controlTime(startTime, endTime)
            if falgs == False:
                raise RuntimeError(u'时间应在1-31内')

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            # 创建sheet
            path = tempfile.gettempdir() + u"/paymentArrange.xls"
            self.sheets = self.createWorkbookAndSheet(path)

            # 缓存ReceiptType
            self.cacheReceiptType()

            # 计算进度
            self.countAll = self.countSschedule(startTime, endTime, company)

            self.decorationPage(pid, startTime, endTime, company)
            self.prepayments(startTime, endTime, company)
            self.matreial(startTime, endTime, company)
            self.sales(startTime, endTime, company)
            self.servicePaymentPage(startTime, endTime, company)

            self.saveWorkbook(path, self.workbooks)

            url = self.media + u"uploadOther.do"
            resultfilepath = self.uploudFile(path, url)

            paln = {
               u"plan.resultFilepath": resultfilepath
            }
            self.updataSchedule(self.pthost, pid, paln)

            self.delFile(path)

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)
        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':
    """
    金蝶导出款项(预付,装修,主材,服务,销售)
    根据凭证收款时间查询:, 时间为当前月1日00:00:00 - 月末23:59:59
    命令:      
     python plan_payment_arrange.py <pid> <年/月/日-年/月/日> <company>
     python plan_payment_arrange.py 710 2018/10/01-2018/10/31 1
    """
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    spargs = args.split("-")
    startTime = u"%s 00:00:00" % spargs[0]
    endTime = u"%s 23:59:59" % spargs[1]

    payment_arrange = payment_arrange(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    payment_arrange.main(pid, startTime, endTime, int(company))
