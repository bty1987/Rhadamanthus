#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Achievement(Util):
    
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

        self.column = u"""
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.houseNumber AS `楼号`,
            regionds.no AS `设计大区ID`,
            regionds.name AS `设计分区`,
            deptds.no AS `设计部ID`,
            deptds.name AS `设计部`,
            ds.userId AS `设计师ID`,
            ds.currentName AS `设计师`,
            regionsm.no AS `业务分区ID`,
            regionsm.name AS `业务分区`,
            deptsm.no AS `业务部ID`,
            deptsm.name AS `业务部`,
            sm.userId AS `业务员ID`,
            sm.currentName AS `业务员`,
            d.precontractPrice AS `预签额`,
            d.orderTotalPrice AS `签单额`,
            d.couponCut AS `券优惠额`,
            d.thingCut AS `奖品优惠额`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间`,
            ds.uid AS `设计师uid`,
            sm.uid AS `业务员uid`,
            d.type AS `类型`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `装修单类型`,
            cc.name AS `公司`,
            belongds.rate AS `设计师比例`,
            belongsm.rate AS `业务员比例`,
            d.discount AS `订单折扣0为10折`,
            d.notSalesmanRate  AS `非业务人员提点`,
            qq.disPrice  AS `打折总额`,
            qq.undisPrice  AS `不打折项总额`,
            qq.managePrice AS`管理费`,
            qq.trafficPrice  AS `车运费`,
            (d.orderTotalPrice - d.precontractPrice) AS `差额`,
            qq.manageRate AS `管理费比例`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea  AS `赠送面积`,
            h.totalArea AS `总面积`,
            d.grade AS `装修单等级`,
            cc.cid AS `公司ID`,
            d.houseClass AS `房屋类型`,
            eu.currentName AS `跟单员`,
            busitype.name AS `业务类型`,
            qq.unachePrice AS 非业绩总额,
            c.name AS `城市`,
            cp.name AS `城区`,
            cn.name AS `工程公司`,
            d.projectStatus AS `工程状态`,
            qq.taxPrice AS `税金`

        """
        self.SQL_EXPORT_ACHIEVEMENT_DECORATION_COLLECTER = u"""
            SELECT 
                %s
            FROM
                decoration.decoration AS d LEFT JOIN communion.user AS eu ON d.euid = eu.uid,
                communion.house AS h,
                communion.village AS v,
                communion.cityProper AS cp,
                communion.city AS c,
                communion.user AS ds,
                communion.user AS sm,
                communion.department AS deptds,
                communion.department AS regionds,
                communion.department AS deptsm,
                communion.department AS regionsm,
                decoration.decorationbelong AS belongds,
                decoration.decorationbelong AS belongsm,
                communion.company AS cc,
                communion.company AS cn,
                quotation.quotation AS qq,
                data.decorationbusitype AS busitype
            WHERE
                d.hid = h.hid 
                AND h.vid = v.vid
                AND v.cityProperId = cp.cpid
                AND cp.cid = c.cid
                AND d.orderId = belongds.orderId
                AND d.orderId = belongsm.orderId
                AND belongds.buid = ds.uid 
                AND belongds.did = deptds.dId
                AND belongds.rid = regionds.dId 
                AND belongds.`status` = 0
                AND belongds.`type` = 0
                AND belongsm.buid = sm.uid 
                AND belongsm.did = deptsm.dId
                AND belongsm.rid = regionsm.dId 
                AND belongsm.`status` = 0
                AND belongsm.`type` = 1
                AND d.company = cc.cid
                AND d.conpany = cn.cid
                AND qq.orderId = d.orderId
                AND qq.defaults = 1
                AND busitype.dbid = d.busitype
                %s
                AND
                %s
        """
        self.SQL_COUNT_DECORATIONPAYMENT_DESIGNFEE = u"""
            SELECT 
                SUM(referMoney),
                orderId
            FROM    
                payment.decorationpayment
            WHERE
                orderId = '%s'
            AND 
                paymentType = '设计费'
            GROUP BY 
                orderId                
        """
        self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE = u"""
            SELECT 
                SUM(servicePrice),
                SUM(servicePaidup),
                orderId
            FROM    
                decoration.decorationHolonomy
            WHERE
                orderId = '%s'
            GROUP BY 
                orderId                
        """

        self.user = {}  # 设计师2
        self.dsUser = {}  # 业务员3
        self.designArea = {}  # 设计大区4
        self.designUnit = {}  # 设计部5
        self.designRegion = {}  # 业务大区6
        self.businessUnit = {}  # 业务部7

    def assortDate(self, v):

        type = v[0]  # 装修单类型
        smuid = v[1]  # 设计师uid
        netperfor = float(v[2])  # 净业绩
        comperfor = float(v[3])  # 复合业绩
        orderTotalPrice = float(v[17])
        rates = v[18]

        smUserId = v[4]  # 设计师ID
        smUserName = v[5]  # 设计师名称
        designRegionID = v[6]  # 设计大区ID
        designRegionName = v[7]  # 设计分区
        designDept = v[8]  # 设计部门ID
        designDeptName = v[9]  # 设计部门

        dsuid = v[10]  # 业务员uid
        dsUserId = v[11]  # 业务员ID
        dsUserName = v[12]  # 业务员名称
        businessPartitionID = v[13]  # 业务分区ID
        businessPartitionName = v[14]  # 业务分区
        businessPartitionDept = v[15]  # 业务部门ID
        businessPartitionDeptName = v[16]  # 业务部门
        # 17

        if type != 0: # 装修单类型为半包的计算复合业绩 , 其他类型复合业绩=净业绩
            comperfor = netperfor  # 整装/半价 净业绩

        users = (smUserId, smUserName, designDeptName, orderTotalPrice, netperfor, comperfor, rates)  # 设计师
        dsusers = (dsUserId, dsUserName, businessPartitionDeptName, orderTotalPrice, netperfor, comperfor, rates)  # 业务员
        designAreas = (designRegionID, designRegionName, orderTotalPrice, netperfor, comperfor, rates)  # 设计大区
        designUnits = (designDept, designDeptName, orderTotalPrice, netperfor, comperfor, rates)  # 设计部
        designRegions = (businessPartitionID, businessPartitionName, orderTotalPrice, netperfor, comperfor, rates)  # 业务大区
        businessUnits = (businessPartitionDept, businessPartitionDeptName, orderTotalPrice, netperfor, comperfor, rates)  # 业务部

        # 设计师
        if smuid not in self.user:
            self.user[smuid] = users
        else:
            users = list(self.user[smuid])
            self.user[smuid] = (smUserId, smUserName, designDeptName, users[3] + orderTotalPrice, users[4] + netperfor, users[5] + comperfor, users[6] + rates)

        # 业务员
        if dsuid not in self.dsUser:
            self.dsUser[dsuid] = dsusers
        else:
            dsusers = list(self.dsUser[dsuid])
            self.dsUser[dsuid] = (dsUserId, dsUserName, businessPartitionDeptName, users[3] + orderTotalPrice, dsusers[4] + netperfor, dsusers[5] + comperfor, dsusers[6] + rates)

        # 设计大区
        if designRegionID not in self.designArea:
            self.designArea[designRegionID] = designAreas
        else:
            designAreas = list(self.designArea[designRegionID])
            self.designArea[designRegionID] = (designRegionID, designRegionName, designAreas[2] + orderTotalPrice, designAreas[3] + netperfor, designAreas[4] + comperfor, designAreas[5] + rates)

        # 设计部
        if designDept not in self.designUnit:
            self.designUnit[designDept] = designUnits
        else:
            designUnits = list(self.designUnit[designDept])
            self.designUnit[designDept] = (designDept, designDeptName, designUnits[2] + orderTotalPrice, designUnits[3] + netperfor, designUnits[4] + comperfor, designUnits[5] + rates)

        # 业务大区
        if businessPartitionID not in self.designRegion:
            self.designRegion[businessPartitionID] = designRegions
        else:
            designRegions = list(self.designRegion[businessPartitionID])
            self.designRegion[businessPartitionID] = (businessPartitionID, businessPartitionName, designRegions[2] + orderTotalPrice, designRegions[3] + netperfor, designRegions[4] + comperfor, designRegions[5] + rates)

        # 业务部
        if businessPartitionDept not in self.businessUnit:
            self.businessUnit[businessPartitionDept] = businessUnits
        else:
            businessUnits = list(self.businessUnit[businessPartitionDept])
            self.businessUnit[businessPartitionDept] = (businessPartitionDept, businessPartitionDeptName, businessUnits[2] + orderTotalPrice, businessUnits[3] + netperfor, businessUnits[4] + comperfor, businessUnits[5] + rates)

    def sheet2(self, workbook):
        self.user = self.user.values()
        self.user = sorted(self.user, key=lambda user: user[2], reverse=True)
        tableHeadTwo = [u"人员ID", u"设计师姓名", u"设计部", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet2 = workbook.add_sheet(u"签单额排名-设计师", cell_overwrite_ok=True)
        self.createTableHead(sheet2, tableHeadTwo)

        portrait = 1
        for i, v in enumerate(self.user):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet2, portrait, j, k)
            portrait = portrait + 1

    def sheet3(self, workbook):
        self.dsUser = self.dsUser.values()
        self.dsUser = sorted(self.dsUser, key=lambda user: user[2], reverse=True)
        tableHead3 = [u"人员ID", u"业务员姓名", u"业务部", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet3 = workbook.add_sheet(u"签单额排名-业务员", cell_overwrite_ok=True)
        self.createTableHead(sheet3, tableHead3)

        portraits = 1
        for i, v in enumerate(self.dsUser):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet3, portraits, j, k)
            portraits = portraits + 1

    def sheet4(self, workbook):
        self.designArea = self.designArea.values()
        self.designArea = sorted(self.designArea, key=lambda designArea: designArea[2], reverse=True)
        tableHead4 = [u"业务大区ID", u"业务大区", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet4 = workbook.add_sheet(u"签单额排名-设计大区", cell_overwrite_ok=True)
        self.createTableHead(sheet4, tableHead4)

        portraits = 1
        for i, v in enumerate(self.designArea):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet4, portraits, j, k)
            portraits = portraits + 1

    def sheet5(self, workbook):
        self.designUnit = self.designUnit.values()
        self.designUnit = sorted(self.designUnit, key=lambda designUnit: designUnit[2], reverse=True)
        tableHead5 = [u"设计部ID", u"设计部", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet5 = workbook.add_sheet(u"签单额排名-设计部", cell_overwrite_ok=True)
        self.createTableHead(sheet5, tableHead5)

        portraits = 1
        for i, v in enumerate(self.designUnit):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet5, portraits, j, k)
            portraits = portraits + 1

    def sheet6(self, workbook):
        self.designRegion = self.designRegion.values()
        self.designRegion = sorted(self.designRegion, key=lambda designRegion: designRegion[2], reverse=True)
        tableHead6 = [u"业务大区ID", u"业务大区", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet6 = workbook.add_sheet(u"签单额排名-业务大区", cell_overwrite_ok=True)
        self.createTableHead(sheet6, tableHead6)

        portraits = 1
        for i, v in enumerate(self.designRegion):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet6, portraits, j, k)
            portraits = portraits + 1

    def sheet7(self, workbook):
        self.businessUnit = self.businessUnit.values()
        self.businessUnit = sorted(self.businessUnit, key=lambda businessUnit: businessUnit[2], reverse=True)
        tableHead7 = [u"业务部ID", u"业务部", u"签单额", u"净业绩", u"复合业绩", u"户数"]
        sheet7 = workbook.add_sheet(u"签单额排名-业务部", cell_overwrite_ok=True)
        self.createTableHead(sheet7, tableHead7)

        portraits = 1
        for i, v in enumerate(self.businessUnit):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet7, portraits, j, k)
            portraits = portraits + 1

    def statisticalDesignFee(self, orderId):
        sql = self.SQL_COUNT_DECORATIONPAYMENT_DESIGNFEE % (orderId)
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        if data:
            if data[0]:
                return float(data[0][0]) / 1000
        return 0

    def statisticalServicePrice(self, orderId):
        sql = self.SQL_COUNT_DECORATIONHOLONOMY_SERVICEPRICE % (orderId)
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        if data:
            if data[0]:
                return float(data[0][0]) / 1000, float(data[0][1]) / 1000
        return 0, 0

    def formTime (self, form, startTime, endTime) :
        column = "d.contractTime"

        if form == "0":
           column = "d.contractTime"
        elif form == "1":
           column = "d.precontractTime"

        return u"%s >= '%s' AND %s <= '%s'" % (column, startTime, column, endTime)

    def main(self, form, pid, startTime, endTime, companys):
        try:

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            tableHead = [u"装修单号", u"楼盘", u"楼号", u"设计大区ID", u"设计分区", u"设计部ID", u"设计部", u" 设计师ID", u"设计师 ", u" 业务分区ID",
                         u"业务分区", u"业务部ID", u"业务部", u" 业务员ID", u"业务员", u"预签额", u"签单额", u"差额", u"券优惠额 ", u"奖品优惠额", u"净业绩 ",
                         u"复合业绩", u"预签时间", u"签单时间", u"公司", u"比例", u"折扣", u"类型", u"非业务人员提点", u"非业务人员提点金额", u"建筑面积",
                         u"赠送面积", u"套内面积", u"总面积", u"装修单等级", u"不打折总额", u"打折总额", u"车运费", u"管理费", u"设计费", u"应收服务费",
                         u"实收服务费", u"房屋类型", u"跟单员", u"业务类型", u"非业绩总额", u"城市", u"城区", u"工程公司", u"工程状态", u"税金"]

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            self.constructionnode(companys)

            term = u" "
            if int(companys) != 0:
                term = u"""AND d.company = %s""" % companys

            startTime = startTime + " 00:00:00"
            endTime = endTime + " 23:59:59"
            countSQL = self.SQL_EXPORT_ACHIEVEMENT_DECORATION_COLLECTER % ("count(*)", term, self.formTime(form, startTime, endTime))

            count = self.count(countSQL)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8

            params = self.createWorkbook(u"sheet1")

            workbook = params[0]
            sheet = params[1]

            self.createTableHead(sheet, tableHead)

            path = tempfile.gettempdir() + u"/decoration.xls"
            self.saveWorkbook(path, workbook)

            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sql = self.SQL_EXPORT_ACHIEVEMENT_DECORATION_COLLECTER % (self.column, term, self.formTime(form, startTime, endTime))

            nowPage = 1
            length = 1
            flag = True

            orderIdList = []
            designFee = 0  # 设计费
            servicePrice = 0  # 服务费
            servicePaidup = 0  # 实收服务费

            self.constructionnode(companys)

            while (flag):
                data = self.page(sql, nowPage, size=200)

                for i, v in enumerate(data):
                    try:

                        v = list(v)

                        self.divNum(v, [15, 16, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 50])

                        orderId = v[0]  # 订单号
                        propertiesName = v[1]  # 楼盘名字
                        houseNumber = v[2]  # 楼号
                        type = v[23]  # 装修单类型
                        smuid = v[21]  # 设计师uid
                        precontractPrice = float(v[15])  # 预签额
                        orderTotalPrice = float(v[16])  # 签单额
                        couponCut = float(v[17])  # 券优惠额
                        thingCut = float(v[18])  # 奖品优惠额
                        precontractTime = v[19]  # 预签时间
                        contractTime = v[20]  # 签单时间
                        typeness = v[24]  # 类型
                        companys = v[25]  # 公司
                        buildArea = v[36]  # 建筑面积
                        freeArea= v[37]  # 赠送面积
                        innerArea= v[38]  # 套内面积
                        totalArea= v[39]  # 总面积
                        grade = v[40]  # 装修单等级
                        company = v[41]  # 公司
                        houseClass = v[42] #房屋类型
                        escorter = v[43]  # 跟单员
                        busitype = v[44]  #业务类型
                        unachePrice = v[45] #非业绩总额
                        city = v[46]  # 城市
                        cityProper = v[47]  # 城区
                        conpany = v[48]  # 工程公司
                        projectStatus = self.projectStatus[v[49]]  # 工程状态
                        taxPrice = v[50] # 税金

                        dsRate = float(v[26])  # 设计师合尺比例
                        smRate = float(v[27])  # 业务员合尺比例
                        discount = float(v[28])  # 订单折扣0为10折
                        notSalesmanRate = float(v[29])  # 非业务人员提点

                        sumdisPrice = float(v[30])  # 打折总额
                        undisPrice = float(v[31])  # 不打折项总额
                        managePrice = float(v[32])  # 管理费
                        trafficPrice = float(v[33])  # 车运费
                        balanceSum = float(v[34])  # 差额
                        manageRate = float(v[35])  # 管理费比例

                        smUserId = v[7]  # 设计师ID
                        smUserName = v[8]  # 设计师名称
                        designRegionID = v[3]  # 设计大区ID
                        designRegionName = v[4]  # 设计分区
                        designDept = v[5]  # 设计部门ID
                        designDeptName = v[6]  # 设计部门

                        dsuid = v[22]  # 业务员uid
                        dsUserId = v[13]  # 业务员ID
                        dsUserName = v[14]  # 业务员名称
                        businessPartitionID = v[9]  # 业务分区ID
                        businessPartitionName = v[10]  # 业务分区
                        businessPartitionDept = v[11]  # 业务部门ID
                        businessPartitionDeptName = v[12]  # 业务部门
                        rates = dsRate * smRate  # 比例

                        biliOrderTotalPrice = orderTotalPrice * rates
                        biliCouponCut = couponCut * rates
                        biliThingCut = thingCut * rates
                        biliUnachePrice = unachePrice * rates
                        contractTime = u"%s" % precontractTime if precontractTime else u"%s" % contractTime
                        precontractTime = u"%s" % precontractTime

                        if orderIdList.count(orderId) == 0:
                            orderIdList.append(orderId)
                            designFee = self.statisticalDesignFee(orderId)

                        if type == 2:
                            servicePrice, servicePaidup = self.statisticalServicePrice(orderId)
                        else:
                            servicePrice = 0
                            servicePaidup = 0

                        taxPrice = taxPrice * rates #税金按比例计算
                        servicePrice = servicePrice * rates #应收服务费按比例计算
                        servicePaidup = servicePaidup * rates #实收服务费按比例计算
                        buildArea = buildArea * rates #建筑面积按比例计算
                        totalArea = totalArea * rates #总面积按比例计算

                        # 直接费 = 打折总额+不打折总额+车运费+管理费
                        zhiJieFei = (sumdisPrice + undisPrice + trafficPrice + managePrice) * rates

                        # 非业务提成金额 = (打折总额+不打折总额+车运费)*非业务提点
                        #if manageRate + notSalesmanRate == 0:
                        #    raise RuntimeError(u'管理费比例+非业务提点比例 出现0,该订单号为%s' % orderId)

                        feiTi = ((sumdisPrice + undisPrice + trafficPrice) * notSalesmanRate) * rates if notSalesmanRate >= 0 and notSalesmanRate <= 1 else notSalesmanRate

                        # 净业绩 = 签单额-非业务人员提点金额-优惠券-赠送礼品-非计入业绩
                        jingYeJi = biliOrderTotalPrice - feiTi - biliCouponCut - biliThingCut

                        # 默认 复合业绩 = 净业绩
                        fuhePrice = jingYeJi

                        if discount == 0.00:
                            discount = 10.00

                        # 公司为辽宁方林装饰(1) , 装修单类型为0(半包) 并且部门为 FL_DR_05, 计算复合业绩 , 其他复合业绩=净业绩
                        # 非业务提成 = (打折总额 + 不打折总额 + 车运费) * 非业务提点
                        # 复合业绩 = ((直接费 - 非业务提成)* 0.41 - 券优惠 - 物品优惠 + 签单额 - 直接费) / 0.41
                        if self.company4Scale.get(company) and type == 0:
                            if company == 1 and designRegionID != u"FL_DR_05":
                                fuhePrice = ((zhiJieFei - feiTi) * self.company4Scale.get(company) - biliCouponCut - biliThingCut + biliOrderTotalPrice - zhiJieFei) / self.company4Scale.get(company)
                            elif company != 1:
                                fuhePrice = ((zhiJieFei - feiTi) * self.company4Scale.get(company) - biliCouponCut - biliThingCut + biliOrderTotalPrice - zhiJieFei) / self.company4Scale.get(company)

                        # 公司为宜家装饰(3) , 所有装修单类型计算符合业绩
                        # 非业务提成 = (打折总额+不打折总额+车运费)*非业务提点
                        # 复合业绩 = (折扣/8.8*(签单额-非业务提成)*0.38-券优惠-物品优惠)/0.38
                        elif company == 3:
                            fuhePrice = (discount / 8.8 * (biliOrderTotalPrice - feiTi) * 0.38 - biliCouponCut -biliThingCut) / 0.38

                        fuhePrice = round(fuhePrice, 3)
                        jingYeJi = round(jingYeJi, 3)
                        biliOrderTotalPrice = round(biliOrderTotalPrice, 3)

                        sumdisPrice = sumdisPrice * rates   # 打折总额
                        undisPrice = undisPrice * rates     # 不打折项总额
                        managePrice = managePrice * rates   # 管理费
                        trafficPrice = trafficPrice * rates # 车运费

                        datas = (orderId, propertiesName, houseNumber, designRegionID, designRegionName, designDept,
                                 designDeptName, smUserId, smUserName, businessPartitionID, businessPartitionName,
                                 businessPartitionDept, businessPartitionDeptName, dsUserId, dsUserName, precontractPrice,
                                 biliOrderTotalPrice, balanceSum, biliCouponCut, biliThingCut, jingYeJi, fuhePrice, precontractTime,
                                 contractTime, companys, rates, discount, typeness, notSalesmanRate, feiTi, buildArea, freeArea, innerArea,
                                 totalArea, grade, undisPrice, sumdisPrice, trafficPrice, managePrice, designFee, servicePrice,
                                 servicePaidup, houseClass, escorter, busitype, biliUnachePrice, city, cityProper, conpany,
                                 projectStatus, taxPrice)

                        lists = (type, smuid, jingYeJi, fuhePrice, smUserId, smUserName, designRegionID, designRegionName,
                                 designDept, designDeptName, dsuid, dsUserId, dsUserName, businessPartitionID, businessPartitionName,
                                 businessPartitionDept, businessPartitionDeptName, biliOrderTotalPrice, rates)

                        self.assortDate(lists)

                        for j, k in enumerate(datas):
                            self.writeWorkbook(sheet, length, j, k)
                        length = length + 1

                    except Exception as e:
                        e = u"发现异常!。%s。" % (e)
                        self.errCall(pid, self.pthost, self.media, e, False)

                self.saveWorkbook(path, workbook)

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

                nowPage = nowPage + 1

                if len(data) < 200:
                    flag = False

            self.sheet2(workbook)
            self.sheet3(workbook)
            self.sheet4(workbook)
            self.sheet5(workbook)
            self.sheet6(workbook)
            self.sheet7(workbook)
            
            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                u"plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        装修单业绩统计,根据签单时间进行查询说明:
        其中: 部门是从decorationbelong表中关联的
        根据查询条件,以分页(200条/次)拿数据的方式导出装修单业绩统计;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        注: 排名时, 整装/半价 使用净业绩 ,半包使用复合业绩
        导出结果 例子:
        装修单号	    楼盘	        楼号	设计大区ID	设计分区	设计部ID	设计部	        设计师ID	设计师 	 业务分区ID	 业务分区	    业务部ID	业务部	        业务员ID	业务员	签单额	券优惠额 	奖品优惠额	净业绩 	 复合业绩	签单时间
        1603230009	巴黎春天	#12-12-12	FL_DR_04	设计四分区	FL_DD_15	设计中心三部	FL-00168	杜若平	FL_BR_01	市场营销一分区	FL_BD_01	市场营销一部	FL-00638	李宁	50000	0	            0	    0	        0	2016-05-29 06:26:49
        sheet1页: 基础详细数据
        sheet2页: 按设计师进行合并,并累加签单额后进行排序(高>低)
        sheet3页: 按业务员进行合并,并累加签单额后进行排序(高>低)
        sheet4页: 按设计大区进行合并,并累加签单额后进行排序(高>低)
        sheet5页: 按设计部进行合并,并累加签单额后进行排序(高>低)
        sheet6页: 按业务大区进行合并,并累加签单额后进行排序(高>低)
        sheet7页: 按业务部进行合并,并累加签单额后进行排序(高>低)

        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.startTime  开始时间 例"2014-06-14"
            3.endTime    结束时间 例"2018-06-14"
            
        2.使用说用名
            python plan_achievement_decoration_collecter.py type pid   args                   company
            python plan_achievement_decoration_collecter.py  0   288   2014/06/14-2018/06/14     1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    form = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]
    
    # form = 0
    # pid = 299
    # args = "2022/10/01-2022/10/31"
    # company = 1

    times = args.split("-")
    startTime = times[0]
    endTime = times[1]
    
    achievement = Achievement(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    achievement.main(form, pid, startTime, endTime, company)