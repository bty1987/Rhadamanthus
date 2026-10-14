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
        
        self.receiptTypes = {}

        self.colum = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            cu.`name` AS `客户名`,
            d.contractTime AS `签单时间`,
            d.balanceTime AS `内决时间`,
            d.accountTime AS `决算时间`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `订单状态`,
            cn.name AS `工程状态`,
            d.orderTotalPrice AS `签单额`,
            d.factPrice AS `实收额`,
            if(p.balance, p.balance, 0) AS `合同预付款余额`,
            if(p.materialbalance, p.materialbalance, 0) AS `主材预付款余额`,
            co.name AS `公司`,
            communion.kv("decoration", "decoration", "typeness", d.typeness) AS `订单类型`,
            da.paidupMatching AS `实花配比`
        """

        self.SQL_DECORATION_INFO = """
            SELECT 
                %s
            FROM 
                decoration.decoration d
                LEFT JOIN payment.advancepayment p ON d.orderId = p.orderId
                LEFT JOIN decoration.decorationAccount da ON d.orderId = da.orderId
                LEFT JOIN construction.construction c ON d.orderId = c.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer cu ON d.customerId = cu.cid
                LEFT JOIN data.constructionnode cn ON d.projectstatus = cn.cnid
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE
                %s >= '%s 00:00:00' AND 
                %s <= '%s 23:59:59'
                %s
            """

        self.SQL_PAYMNET_DECORATION = """
            SELECT
                dr.cash,
                dr.cashinfo,
                dr.bank,
                dr.bankinfo,
                dr.checkv,
                dr.checkvBank,
                dr.advance,
                dp.onetype,
                dp.twotype,
                ar.atttype,
                dp.company,
                dp.paymentType
            FROM
                payment.decorationpayment dp
                LEFT JOIN quotation.addreduce ar ON dp.dpId = ar.dpId,
                payment.decorationreceipt dr
            WHERE
                dp.drid = dr.drid AND
                dp.orderId = '%s'
        """

        self.SQL_PAYMNET_ADVANCE = """
            SELECT
                ar.cash,
                ar.cashinfo,
                ar.bank,
                ar.bankinfo,
                ar.checkv,
                ar.checkvBank,
                ap.type,
                ap.paymenttype,
                ap.company
            FROM
                payment.payment ap,
                payment.advancereceipt ar
            WHERE
                ap.arid = ar.arid AND
                ap.orderId = '%s'
        """

        self.SQL_PAYMNET_SALES = """
            SELECT
                sr.cash,
                sr.cashinfo,
                sr.bank,
                sr.bankinfo,
                sr.checkv,
                sr.checkvBank,
                sr.advance,
                sp.type,
                sp.company
            FROM
                payment.salespayment sp,
                payment.salesreceipt sr
            WHERE
                sp.srid = sr.srid AND
                sp.status IN (1, 2) AND
                sp.orderId = '%s'
            GROUP BY
                sr.srid
        """

        self.SQL_RECEIPTTYPE = """SELECT fund FROM data.receipttype rt WHERE rt.no = '%s' AND rt.company = %s"""

    def company(self, cloumCompany, company):
    
        if company != 0:
            companyId = "AND %s in (%s)" % (cloumCompany, company)
        else:
            companyId = " "

        return companyId

    def receipttype(self, ctid, company):
    
        if self.receiptTypes.get(str(ctid), None):
            return self.receiptTypes.get(str(ctid), None)
        
        self.cursor.execute(self.SQL_RECEIPTTYPE % (ctid, company))
        rt = self.cursor.fetchone()
        
        self.receiptTypes[str(ctid)] = rt
        
        return rt

    def main(self, type, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False

            timeColumn = "d.accounttime"
            if type == "0":
                timeColumn = "d.accounttime"
            elif type == "1":
                timeColumn = "d.balanceTime"
            elif type == "2":
                timeColumn = "c.finishTime"

            sqlcount = self.SQL_DECORATION_INFO % ("count(*)", timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

            count = self.count(sqlcount)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            sql = self.SQL_DECORATION_INFO % (self.colum, timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook("款项信息汇总")

            tableHead = [
                "装修单号", "楼盘", "楼号", "客户名", "签单时间", "内决时间", "决算时间", "订单状态", "工程状态", "签单额", 
                "实收额", "合同预付款余额", "主材预付款余额", "公司", "订单类型", "实花配比", "设计费", "设计费退款", "实际工程收款额", "实际其他款项收款额", 
                "实际工程退款额", "实际其他款项退款额", "实际增项款工程合计", "实际增项款主材合计", "实际减项款工程合计", "实际减项款主材合计", "实际合同预付款退款合计", "实际主材预付款退款合计", "实际主材收款额", "实际主材退款额"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    
                    data = list(v)

                    # 处理数值
                    self.divNum(data, [9, 10, 11, 12, 15])

                    # 各个款项收据信息
                    orderId = data[0]

                    designFee = 0 # 设计费
                    refundDesignFee = 0 # 设计费退款

                    realcontract = 0 # 实际工程收款额(三笔款或者四笔款合计)
                    realother = 0 # 实际其他款项收款额(装修款其他款项)
                    realrefund = 0 # 实际工程退款额(三笔款或四笔款退款合计)
                    realrefundother = 0 # 实际其他款项退款额(装修款其他款项退款)

                    realaddconpay = 0 # 实际增项款工程合计
                    realaddmalpay = 0 # 实际增项款主材合计
                    realsubconpay = 0 # 实际减项款工程合计
                    realsubmalpay = 0 # 实际减项款主材合计

                    realadvconref = 0 # 实际合同预付款退款合计
                    realadvmarref = 0 # 实际主材预付款退款合计

                    realsalestotal = 0 # 实际主材收款额(销售款)
                    realsalesrefund = 0 # 实际主材退款额(销售款退款)

                    # 装修款
                    self.cursor.execute(self.SQL_PAYMNET_DECORATION % orderId)
                    decorationPayments = self.cursor.fetchall()

                    for di, dv in enumerate(decorationPayments):
                    
                        decorationPayment = list(dv)
                        
                        self.divNum(decorationPayment, [0, 2, 4, 6])

                        cash = decorationPayment[0]
                        cashinfo = decorationPayment[1]
                        bank = decorationPayment[2]
                        bankinfo = decorationPayment[3]
                        checkv = decorationPayment[4]
                        checkvinfo = decorationPayment[5]
                        advance = decorationPayment[6]

                        onetype = decorationPayment[7]
                        twotype = decorationPayment[8]
                        atttype = decorationPayment[9]

                        dpompany = decorationPayment[10]
                        paymentType = decorationPayment[11]

                        if cash != 0:

                            rt = self.receipttype(cashinfo, dpompany)

                            if rt and rt[0] == 1:
                            
                                cash = float(cash)
                            
                                if onetype == 0 and twotype == 0: realother += cash
                                if onetype == 0 and twotype == 1: realcontract += cash
                                if onetype == 0 and twotype == 3: realother += cash
                                if onetype == 1 and twotype == 0: realrefundother += cash
                                if onetype == 1 and twotype == 1: realrefund += cash
                                if onetype == 1 and twotype == 3: realrefundother += cash

                                if onetype == 0 and twotype == 2 and atttype == 0: realaddconpay += cash
                                if onetype == 0 and twotype == 2 and atttype == 1: realaddmalpay += cash
                                if onetype == 1 and twotype == 2 and atttype == 0: realsubconpay += cash
                                if onetype == 1 and twotype == 2 and atttype == 1: realsubmalpay += cash
                                
                                if paymentType == "设计费": designFee += cash
                                if paymentType == "设计费退款": refundDesignFee += cash

                        if bank != 0:

                            rtinfos = bankinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], dpompany)

                                if rt and rt[0] == 1:
                                
                                    bankm = float(rtinfo[1])
                                
                                    if onetype == 0 and twotype == 0: realother += bankm
                                    if onetype == 0 and twotype == 1: realcontract += bankm
                                    if onetype == 0 and twotype == 3: realother += bankm
                                    if onetype == 1 and twotype == 0: realrefundother += bankm
                                    if onetype == 1 and twotype == 1: realrefund += bankm
                                    if onetype == 1 and twotype == 3: realrefundother += bankm

                                    if onetype == 0 and twotype == 2 and atttype == 0: realaddconpay += bankm
                                    if onetype == 0 and twotype == 2 and atttype == 1: realaddmalpay += bankm
                                    if onetype == 1 and twotype == 2 and atttype == 0: realsubconpay += bankm
                                    if onetype == 1 and twotype == 2 and atttype == 1: realsubmalpay += bankm
                                    
                                    if paymentType == "设计费": designFee += bankm
                                    if paymentType == "设计费退款": refundDesignFee += bankm

                        if checkv != 0:

                            rtinfos = checkvinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], dpompany)

                                if rt and rt[0] == 1:
                                
                                    checkm = float(rtinfo[1])
                                
                                    if onetype == 0 and twotype == 0: realother += checkm
                                    if onetype == 0 and twotype == 1: realcontract += checkm
                                    if onetype == 0 and twotype == 3: realother += checkm
                                    if onetype == 1 and twotype == 0: realrefundother += checkm
                                    if onetype == 1 and twotype == 1: realrefund += checkm
                                    if onetype == 1 and twotype == 3: realrefundother += checkm

                                    if onetype == 0 and twotype == 2 and atttype == 0: realaddconpay += checkm
                                    if onetype == 0 and twotype == 2 and atttype == 1: realaddmalpay += checkm
                                    if onetype == 1 and twotype == 2 and atttype == 0: realsubconpay += checkm
                                    if onetype == 1 and twotype == 2 and atttype == 1: realsubmalpay += checkm
                                    
                                    if paymentType == "设计费": designFee += checkm
                                    if paymentType == "设计费退款": refundDesignFee += checkm

                        if advance != 0:
                        
                            advance = float(advance)
                        
                            if onetype == 0 and twotype == 0: realother += advance
                            if onetype == 0 and twotype == 1: realcontract += advance
                            if onetype == 0 and twotype == 3: realother += advance
                            if onetype == 1 and twotype == 0: realrefundother += advance
                            #if onetype == 1 and twotype == 1: realrefund += advance
                            if onetype == 1 and twotype == 3: realrefundother += advance

                            if onetype == 0 and twotype == 2 and atttype == 0: realaddconpay += advance
                            if onetype == 0 and twotype == 2 and atttype == 1: realaddmalpay += advance
                            if onetype == 1 and twotype == 2 and atttype == 0: realsubconpay += advance
                            if onetype == 1 and twotype == 2 and atttype == 1: realsubmalpay += advance
                            
                            if paymentType == "设计费": designFee += advance
                            if paymentType == "设计费退款": refundDesignFee += advance

                    # 预付款
                    self.cursor.execute(self.SQL_PAYMNET_ADVANCE % orderId)
                    advancePayments = self.cursor.fetchall()

                    for ai, av in enumerate(advancePayments):
                    
                        advancePayment = list(av)
                        
                        self.divNum(advancePayment, [0, 2, 4])

                        cash = advancePayment[0]
                        cashinfo = advancePayment[1]
                        bank = advancePayment[2]
                        bankinfo = advancePayment[3]
                        checkv = advancePayment[4]
                        checkvinfo = advancePayment[5]

                        type = advancePayment[6]
                        paymenttype = advancePayment[7]

                        apompany = advancePayment[8]

                        if type != 0: continue

                        if cash != 0:

                            rt = self.receipttype(cashinfo, apompany)

                            if rt and rt[0] == 1:
                                if paymenttype == 0: realadvconref += float(cash)
                                if paymenttype == 2: realadvmarref += float(cash)

                        if bank != 0:

                            rtinfos = bankinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], apompany)

                                if rt and rt[0] == 1:
                                    if paymenttype == 0: realadvconref += float(rtinfo[1])
                                    if paymenttype == 2: realadvmarref += float(rtinfo[1])

                        if checkv != 0:

                            rtinfos = checkvinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], apompany)

                                if rt and rt[0] == 1:
                                    if paymenttype == 0: realadvconref += float(rtinfo[1])
                                    if paymenttype == 2: realadvmarref += float(rtinfo[1])

                    # 销售款
                    self.cursor.execute(self.SQL_PAYMNET_SALES % orderId)
                    salesPayments = self.cursor.fetchall()

                    for si, sv in enumerate(salesPayments):
                        salesPayment = list(sv)
                        self.divNum(salesPayment, [0, 2, 4, 6])

                        cash = salesPayment[0]
                        cashinfo = salesPayment[1]
                        bank = salesPayment[2]
                        bankinfo = salesPayment[3]
                        checkv = salesPayment[4]
                        checkvinfo = salesPayment[5]
                        advance = salesPayment[6]

                        type = salesPayment[7]

                        spompany = salesPayment[8]

                        if cash != 0:
                            
                            rt = self.receipttype(cashinfo, spompany)

                            if rt and rt[0] == 1:
                                if type in (2, 3, 8): realsalestotal += float(cash)
                                if type not in (2, 3, 8): realsalesrefund += float(cash)

                        if bank != 0:

                            rtinfos = bankinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], spompany)

                                if rt and rt[0] == 1:
                                    if type in (2, 3, 8): realsalestotal += float(rtinfo[1])
                                    if type not in (2, 3, 8): realsalesrefund += float(rtinfo[1])

                        if checkv != 0:

                            rtinfos = checkvinfo.split("#")

                            for v in rtinfos:

                                rtinfo = v.split("|")

                                if len(rtinfo) < 3: continue
                                
                                rt = self.receipttype(rtinfo[0], spompany)

                                if rt and rt[0] == 1:
                                    if type in (2, 3, 8): realsalestotal += float(rtinfo[1])
                                    if type not in (2, 3, 8): realsalesrefund += float(rtinfo[1])

                        if advance != 0:
                            if type in (2, 3, 8): realsalestotal += float(advance)
                            if type not in (2, 3, 8): realsalesrefund += float(advance)

                    data.append(designFee)
                    data.append(refundDesignFee)
                    data.append(realcontract)
                    data.append(realother)
                    data.append(realrefund)
                    data.append(realrefundother)
                    data.append(realaddconpay)
                    data.append(realaddmalpay)
                    data.append(realsubconpay)
                    data.append(realsubmalpay)
                    data.append(realadvconref)
                    data.append(realadvmarref)
                    data.append(realsalestotal)
                    data.append(realsalesrefund)

                    self.createTableHead(sheet, data, count)
                    
                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导出款项信息脚本说明:
        根据查询条件,以分页拿数据的方式导出各项款项信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        0:决算时间 1:内决时间;
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司:1
        2.脚本传参说明:
             plan_export_payment_inclusive.py   pid   args   company 
             plan_export_payment_inclusive.py   929   2018/12/01-2018/12/31   1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
