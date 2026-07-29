#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from openpyxl import Workbook

class Exporter(Util):

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
        self.size = 300

        self.column = """
            d.orderId AS `编号`,
            v.name AS `楼盘名称`,
            h.houseNumber AS `楼号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间(预签)`,
            d.contractTime AS `签单时间(签单)`,
            d.accountTime AS `决算时间`,
            d.typeness AS `订单类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `订单状态`,
            d.houseType AS `房屋类别`,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.notSalesmanRate AS `非业务员提点`,
            d.precontractPrice AS `预签额`,
            d.orderTotalPrice AS `签单额`,
            d.factPrice AS `实收额`,
            d.couponCut AS `券优惠`,
            d.thingCut AS `物品优惠`,
            u.userId AS `操作人编号`,
            u.currentName AS `操作人`,
            db.type AS `操作类型`,
            dd.no AS `部门编号`,
            dd.name AS `部门`,
            dr.no AS `分区编号`,
            dr.name AS `分区`,
            db.rate AS `比例`,
            q.discount AS `折扣`,
            q.totalPrice AS `报价总额`,
            q.undisPrice AS `不打折总额`,
            q.disPrice AS `打折总额`,
            q.trafficPrice AS `车运费`,
            q.managePrice AS `管理费`,
            q.manageRate AS `管理费比例`,
            if(qp.qpid is null, 0, qp.managePrefer) AS `管理优惠`,
            q.trafficPrice AS `运输费`,
            busitype.name AS `业务类型`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea AS `计价面积`,
            h.totalArea AS `总面积`,
            d.projectStatus AS `工程状态`,
            supervisor.currentName AS `监理`,
            d.paySacle AS `付款比例`,
            d.grade AS `装修单等级`,
            us.currentName AS `报价员`,
            d.houseClass AS `房屋类型`,
            md.name AS `跟单部`,
            mu.userId AS `跟单员编号`,
            mu.currentName AS `跟单员`,
            ed.name AS `方案设计部`,
            eu.userId AS `方案设计编号`,
            eu.currentName AS `方案设计`,
            if(d.type = 0, dm.servicePrice, if(d.type = 2, dh.servicePrice, 0)) AS `服务费`,
            if(d.type = 0, dm.materialPrice, if(d.type = 2, dh.materialPrice, 0)) AS `主材总额`,
            q.taxRate AS `税金比例`,
            q.taxPrice AS `税金金额`,
            q.unachePrice AS `纯利`,
            co.name AS `公司`
        """

        self.SQL_EXPORT_DECORATION_COLLECTER = """
            SELECT
                %s
            FROM
                decoration.decoration AS d 
                LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
                LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId AND db.status = 0)
                LEFT JOIN quotation.quotation AS q ON (d.orderId = q.orderId AND q.defaults = 1)
                LEFT JOIN quotation.quotationprefer AS qp ON q.qid = qp.qid
                LEFT JOIN communion.house AS h ON d.hid = h.hid 
                LEFT JOIN communion.village AS v ON h.vid = v.vid 
                LEFT JOIN communion.user AS supervisor ON d.svuid = supervisor.uid 
                LEFT JOIN communion.user AS us ON d.quid = us.uid 
                LEFT JOIN communion.user AS mu ON d.msuid = mu.uid
                LEFT JOIN communion.department AS md ON mu.deptid = md.did
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.department AS ed ON eu.deptid = ed.did
                LEFT JOIN communion.user AS u ON db.buid = u.uid
                LEFT JOIN communion.department AS dd ON db.did = dd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN data.decorationbusitype AS busitype ON busitype.dbid = d.busitype
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE 
                d.contractTime >= '%s 00:00:00' AND
                d.contractTime <= '%s 23:59:59' 
                %s
        """

        self.SQL_EXPORT_DECORATION_PAYMENT = """
            SELECT
                decorationpayment.orderId AS `订单编号`,
                decorationpayment.paymentType AS `款项类型`,
                decorationpayment.referMoney AS `金额`,
                decorationpayment.paymentStatus AS `状态`,
                decorationreceipt.collectTime AS `交款时间`,
                decorationreceipt.coupon AS `券值`,
                decorationreceipt.couponInfo AS `券信息`
            FROM
                payment.decorationpayment AS decorationpayment 
                LEFT JOIN payment.decorationreceipt AS decorationreceipt ON decorationpayment.drId = decorationreceipt.drId
            WHERE
                decorationpayment.orderId = '%s'
        """

        self.SQL_EXPORT_DECORATION_ADVANCE = """
            SELECT
                decoration.orderId AS `订单编号`,
                advancepayment.balance AS `预付款`
            FROM
                decoration.decoration AS decoration ,
                payment.advancepayment AS advancepayment
            WHERE
                decoration.orderId = advancepayment.orderId AND 
                decoration.orderId = '%s'
        """

        self.SQL_QUERY_DECORATION_PAYMENT = """
           SELECT 
               orderId, SUM(referMoney)
           FROM
               payment.decorationpayment
           WHERE
               paymentStatus = 0 AND 
               onetype = 0 AND 
               twotype = 1 AND 
               orderId= '%s'
        """
        
        self.SQL_QUERY_DECORATION_ACTIVITY_ITEM = """
            SELECT 
                sum(dai.num * dai.money)/1000, dai.type, a.atttype, a.multiple
            FROM 
                decoration.decorationactivityitem dai LEFT JOIN information.activity a on dai.aid = a.aid
            WHERE 
                dai.orderId = '%s' AND 
                dai.state in (0,2,4,5,6) AND 
                dai.isprefor = 0
            GROUP BY type;
        """
        
        self.SQL_QUERY_QUOTATION_UNACHE_SUM = """
            SELECT SUM(if(qfai.discount = 1, qfai.initnum/1000*qfai.unitprice/1000*q.discount/10, qfai.initnum/1000*unitprice))
            FROM quotation.quotation q, quotation.quotationfunctionarea qfa, quotation.quotationfunctionareaitem%s qfai
            WHERE q.orderId = '%s' AND q.defaults = 1 AND q.qid = qfa.quotationId AND qfa.qfaid = qfai.quotationFunctionAreaId AND qfai.type = 6;
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    # 已付款
    def queryAdvancePayment(self, orderId):

        infos = self.executeQuerySQL(self.SQL_EXPORT_DECORATION_ADVANCE % (orderId))
        
        if infos != ():
            data = list(infos[0])
            self.divNum(data, [1])
            balance = data[1]
        else:
            balance = 0

        return balance

    # 未付款
    def queryDecorationPaymentForNopay(self, orderId):

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_PAYMENT % (orderId))

        if infos[0][0] != None and infos[0][1] != None:
            data = list(infos[0])
            self.divNum(data, [1])
            sumReferMoney = int(data[1])
        else:
            sumReferMoney = ""

        return sumReferMoney

    # 装修活动
    def queryDecorationActivityItem(self, orderId):
    
        couponCut = 0
        thingCut = 0;
        
        atttype = -1
        multiple = 0

        infos = self.executeQuerySQL(self.SQL_QUERY_DECORATION_ACTIVITY_ITEM % (orderId))
        
        if not infos: return [couponCut, thingCut, atttype, multiple]
        
        for info in infos:
            
            if info[1] == 0: couponCut = info[0]
            if info[1] == 1: thingCut = info[0]
            
            atttype = info[2]
            multiple = info[3]

        return [couponCut, thingCut, atttype, multiple]

    # 款项
    def queryDecorationPayment(self, orderId):
    
        infos = self.executeQuerySQL(self.SQL_EXPORT_DECORATION_PAYMENT % (orderId))
        
        template = [None] * 24
        design = 0 # 应付设计费
        paid = 0 # 实付设计费

        if infos == ():
            return template

        for i, v in enumerate(infos):
            data = list(v)
            self.divNum(data, [2, 5])

            if data[1] == "设计费":
                template[0] = design + float(data[2])
                if data[3] != 0:
                    template[1] = paid + float(data[2])
                    paid = paid + float(data[2])

                design = design + float(data[2])

            if data[1] == "首付款":
                template[2] = int(data[2])
                template[3] = data[4]
                template[4] = data[5]
                template[5] = data[6]

            if data[1] == "首付二期款":
                template[6] = int(data[2])
                template[7] = data[4]
                template[8] = data[5]
                template[9] = data[6]

            if data[1] == "二期款":
                template[10] = int(data[2])
                template[11] = data[4]
                template[12] = data[5]
                template[13] = data[6]

            if data[1] == "尾款":
                template[14] = int(data[2])
                template[15] = data[4]
                template[16] = data[5]
                template[17] = data[6]

            if data[1] == "违约金":
                template[20] = int(data[2])

        return template
        
    def queryQuotationUnache(self, orderId):
    
        infos = self.executeQuerySQL(self.SQL_QUERY_QUOTATION_UNACHE_SUM % (2, orderId))
        
        sumReferMoney = 0

        if infos[0][0] != None:
            data = list(infos[0])
            sumReferMoney = int(data[0])
            
        infos = self.executeQuerySQL(self.SQL_QUERY_QUOTATION_UNACHE_SUM % (1, orderId))
        
        if infos[0][0] != None:
            data = list(infos[0])
            sumReferMoney = int(data[0])
            
        infos = self.executeQuerySQL(self.SQL_QUERY_QUOTATION_UNACHE_SUM % (0, orderId))
        
        if infos[0][0] != None:
            data = list(infos[0])
            sumReferMoney = int(data[0])

        return sumReferMoney

    def company(self, columnCompany, company):
        if company != 0:
            companyString = " AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

    def main(self, pid, args, company):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            self.constructionnode(company)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_COLLECTER % ("count(*)", startTime, endTime, self.company("d.company", company))
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

            workbook = Workbook()
            sheet = workbook.active
            sheet.title = "shee1"

            sql = self.SQL_EXPORT_DECORATION_COLLECTER % (self.column, startTime, endTime, self.company("d.company", company))

            tableHead = [
                "装修单号", "楼盘名称", "楼号", "预签时间", "签单时间(预签)", "签单时间(签单)", "决算时间", "订单类型", "订单状态", "房屋类别",
                "非业务提成", "非业务提点", "预签额", "签单额", "实收额", "券优惠", u'物品', "操作人编号", "操作人", "操作类型",
                "部门编号", "部门", "分区编号", "分区", "比例", "折扣", "报价总额", "不打折总额", "打折总额", "车运费",
                "管理费", "管理费比例", "管理优惠", "运输费", "业务类型", "建筑面积", "赠送面积", "计价面积", "总面积", "工程状态", 
                "监理", "付款比例", "订单等级", "报价员", "房屋类型", "跟单部", "跟单员编号", "跟单员", "方案设计部", "方案设计编号", 
                "方案设计", "税金比例", "税金金额", "折前总价", "差额", "业绩差额", "应付设计费", "实付设计费", "首付款", "收款时间", 
                "券值", "券信息", "首付二期款", "收款时间", "券值", "券信息", "二期款", "收款时间", "券值", "券信息", 
                "尾款", "尾款时间", "券值", "券信息", "违约金", "预付款余额", "净业绩", u'复合业绩', "未付款金额", "措施费", 
                "应收服务费", "主材总额", "纯利", "公司"
            ]

            sheet.append([(v if v is not None else None) for v in tableHead])

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:
            
                data = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(data):

                    rows = list(v)
                    
                    orderId = rows[0]  # 订单号
                    type = rows[7] # 订单类型
                    
                    rows[15], rows[16], atttype, multiple = self.queryDecorationActivityItem(orderId)
                    rows[55] = self.queryQuotationUnache(orderId)

                    self.divNum(rows, [10, 11, 12, 13, 14, 15, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 51, 52, 53, 54, 55])
                    
                    disPrice = float(rows[28]) # 打折总额
                    undisPrice = float(rows[27]) # 不打折总额
                    trafficPrice = float(rows[29]) # 车运费
                    managePrice = float(rows[30]) # 管理费
                    
                    orderTotalPrice = float(rows[13]) # 签单总额
                    notSalesPrice = float(rows[10]) # 非提金额  非业务人员提点金额=管理费/（管理费比例+非业务提点比例）*非业务提点比例
                    couponCut = float(rows[15]) # 券优惠
                    thingCut = float(rows[16]) if atttype != 1 else (rows[16] + rows[14]*multiple/1000) # 物品优惠

                    rates = float(rows[24])

                    rows[4] = rows[3] if rows[3] else rows[4] #签单时间(预签)
                    rows[7] = self.decoration.decoration.typeness.key[str(rows[7])]
                    rows[16] = thingCut
                    rows[19] = self.decorationbelongType[rows[19]]
                    rows[24] = '%d%%' % (rows[24] / 1 * 100)
                    rows[39] = self.projectStatus[rows[39]]
                    rows[51] = rows[51] if rows[51] else 0 #主材总额

                    template = self.queryDecorationPayment(rows[0])
                    template[18] = self.queryDecorationPaymentForNopay(rows[0]) # 未付款
                    template[19] = self.queryAdvancePayment(rows[0])  # 已付款

                    # 折前总价 = 不打折总额 + 打折总额 + 管理费 + 运输费
                    rows.append(undisPrice + disPrice + managePrice + trafficPrice)
                    # 差额 = 签单额 - 预签额
                    rows.append(rows[13] - rows[12])

                    # 净业绩 = 签单总额 - 非业务提成 - 券优惠 - 物品优化
                    template[21] = (int(orderTotalPrice) - int(notSalesPrice) - int(couponCut) - int(thingCut)) * rates
                    #预签净业绩 = 预签额 - 非提金额 - 券优惠 - 物品优化
                    presignPrice = (int(rows[12]) - int(rows[10]) - int(rows[15]) - int(rows[16])) * rates
                    #业绩差额=净业绩-预签净业绩
                    rows.append(template[21] - presignPrice)

                    #复合业绩
                    # 推回8.8折合同报价=打折总额*0.88+不打折总额+车运费+管理费
                    backCal = (disPrice * 0.88 + undisPrice + trafficPrice + managePrice)

                    # 复核业绩=[(推回8.8折合同报价—非业务人员提点金额)*0.38-券-礼品+签单额-推回8.8折合同报价]/0.38
                    template[22] = ((backCal - notSalesPrice) * 0.38 - couponCut - thingCut + orderTotalPrice - backCal) / 0.38

                    # 措施费=直接费*0.019，直接费是折前总价-管理费
                    if company == -1:
                        template[23] = (undisPrice - managePrice) * 0.019
                    else:
                        template[23] = 0

                    template = [
                        template[0], template[1], template[2], template[3], template[4], template[5],
                        template[6], template[7], template[8], template[9], template[10], template[11],
                        template[12], template[13], template[14], template[15], template[16], template[17],
                        template[20], template[19], template[21], template[22], template[18], template[23]
                    ]

                    template.append(rows[51]) # 服务费
                    template.append(rows[52]) # 主材额
                    template.append(rows[55]) # 纯利
                    template.append(rows[56]) # 公司

                    row = rows[0:51] + rows[53:55] + rows[57:] + template

                    test_list = [12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38, 52, 53, 54, 55, 57, 77, 78, 80, 81, 82]

                    self.rates(row, rates, test_list)

                    sheet.append([(v if v is not None else None) for v in row])
                    count += 1

                nowPage = nowPage + 1

                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

            resultfilepath = self.packXlsxFile(pid, workbook)

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
        导出装修签单脚本说明:
            根据查询条件,以分页形式分别以设计,业务,分别导出订单签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_information.py  pid args company
                   plan_export_decoration_order_information.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/03/01-2023/03/30'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
