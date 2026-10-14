# -*- encoding: utf-8 -*-

from datetime import timedelta, datetime
from elasticsearch import Elasticsearch
import pymysql
import datetime
import elasticsearch.helpers
import json
import os
import sys

class Signing():

    SQL = """
        SELECT
            d.orderId,
            c.`name`,
            CASE
            WHEN b.type = 0 THEN '设计'
            WHEN b.type = 1 THEN '业务'
            END,
            b.buid,
            u.currentName,
            dept.no,
            dept.name,
            region.no,
            region.name,
            b.rate,
            d.contractTime,
            d.createTime,
            d.orderTotalPrice,
            d.notSalesmanRate  AS `非业务人员提点`,
            d.couponCut AS `券优惠额`,
            d.thingCut AS `奖品优惠额`,
            qq.disPrice  AS `打折总额`,
            qq.undisPrice  AS `不打折项总额`,
            qq.managePrice AS`管理费`,
            qq.trafficPrice  AS `车运费`,
            qq.manageRate AS `管理费比例`    
        FROM
            decoration.decoration AS d,
            decoration.decorationbelong AS b,
            communion.`user` AS u,
            communion.company AS c,
            communion.department AS dept,
            communion.department AS region,
            quotation.quotation AS qq
        WHERE
            d.orderId = b.orderId 
            AND d.company = c.cid
            AND b.buid = u.uid
            AND b.did = dept.dId
            AND b.rid = region.dId
            AND b.`status` = 0
            AND d.contractTime IS NOT NULL 
            AND qq.orderId = d.orderId
            AND qq.defaults = 1
            AND %s LIMIT % d OFFSET % d
        """

    def __init__(self, host='', username='', password='', esHost='', timeDiff='', charset='utf8'):

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.esHost = esHost

        self.dbconn = None
        self.cursor = None

        self.userCounts = {}
        self.departmentCounts = {}
        self.regionCounts = {}
        self.es = Elasticsearch(self.esHost)

        self.timeDiff = timeDiff

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def closeDBConnect(self):

        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def getDBCursor(self):

        if not self.dbconn:
            self.openDBConnect()

        self.cursor = self.dbconn.cursor()

    def commit(self):
        self.dbconn and self.dbconn.commit()

    def rollback(self):

        self.dbconn and self.dbconn.rollback()

    def fmtTime(self, times):
        return datetime.datetime.strptime(times.strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S") - datetime.timedelta(hours=8)
    
    def divNum(self, data, numList):
        if len(numList) > 0:
            for i, v in enumerate(numList):
                if not data[v] is None:
                    data[v] = data[v]/1000

    def performance(self, orderId, *args):

        biliOrderTotalPrice = float(args[0])  # 签单额
        rates = float(args[1])  # 比例
        undisPrice = float(args[2])  # 不打折总额
        sumdisPrice = float(args[3])  # 打折总额
        trafficPrice = float(args[4])  # 车运费
        managePrice = float(args[5])  # 管理费
        manageRate = float(args[6])  # 管理费比例
        notSalesmanRate = float(args[7])  # 非业务提点比例
        biliCouponCut = float(args[8]) * rates  # 卷
        biliThingCut = float(args[9]) * rates  # 赠送礼品

        # 推回8.8折合同报价=打折总额*0.88+不打折总额+车运费+管理费
        back88 = (sumdisPrice * 0.88 + undisPrice + trafficPrice + managePrice) * rates

        # 非业务人员提点金额=管理费/（管理费比例+非业务提点比例）*非业务提点比例
        if manageRate + notSalesmanRate == 0:
            fuhePrice = jingYeJi = biliOrderTotalPrice - biliCouponCut - biliThingCut
        else:
#            raise RuntimeError(u'管理费比例+非业务提点比例 出现0,该订单号为:%s' % orderId)
            feiTi = if notSalesmanRate >= 0 and notSalesmanRate <= 1: (managePrice / (manageRate + notSalesmanRate) * notSalesmanRate) * rates else notSalesmanRate

            # 复核业绩=[(推回8.8折合同报价—非业务人员提点金额)*0.38-券-礼品+签单额-推回8.8折合同报价]/0.38
            fuhePrice = ((back88 - feiTi) * 0.38 - biliCouponCut - biliThingCut + biliOrderTotalPrice - back88) / 0.38

            # 净业绩 = 签单额-非业务人员提点金额-优惠券-赠送礼品
            jingYeJi = biliOrderTotalPrice - feiTi - biliCouponCut - biliThingCut

        return jingYeJi, fuhePrice

    def selectSigning(self, sql, date, startTime, limit):

        self.getDBCursor()

        startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d').strftime('%Y%m')
        pages = 0
        while pages % limit == 0:

            self.cursor.execute(sql % (date, limit, pages))

            results = self.cursor.fetchall()

            result = list(results)

            arrList = []

            if len(result) == 0:

                break

            for i, v in enumerate(result):
                pages += 1
                
                self.divNum(v, [9, 12, 13, 14, 15, 16, 17, 18, 19, 20])

                orderId = v[0]
                companyName = v[1]  # 公司名
                typeName = v[2]  # 设计/业务
                buid = int(v[3])  # uid
                currentName = v[4]  # 姓名
                deptId = v[5]  # 部门编号
                deptName = v[6]  # 部门名称
                regionId = v[7]  # 大区编号
                regionName = v[8]  # 大区名称
                rate = float(v[9])  # 比例
                contractTime = self.fmtTime(v[10])  # 签单时间
                createTime = self.fmtTime(v[11])  # 创建时间

                orderTotalPrice = float(v[12]) # 签单额
                notSalesmanRate = float(v[13])  # `非业务人员提点`,

                couponCut = float(v[14]) * rate  # `券优惠额`,
                thingCut = float(v[15]) * rate  # `奖品优惠额`,

                disPrice = float(v[16])  # `打折总额`,
                undisPrice = float(v[17])  # `不打折项总额`,
                managePrice = float(v[18])  # `管理费`,
                trafficPrice = float(v[19])  # `车运费`,
                manageRate = float(v[20])  # `管理费比例`

                netperfor = 0  # 净业绩
                comperfor = 0  # 复合业绩

                totalPrice = orderTotalPrice * rate

                netperfor, comperfor = self.performance(orderId, totalPrice, rate, undisPrice, disPrice, trafficPrice, managePrice, manageRate, notSalesmanRate, couponCut, thingCut)

                netperfor = round(netperfor, 3)
                comperfor = round(comperfor, 3)

                _sources = {
                    "orderId": orderId,
                    "company": companyName,
                    "type": typeName,
                    "uid": buid,
                    "currentName": currentName,
                    "deptId": deptId,
                    "deptName": deptName,
                    "regionId": regionId,
                    "regionName": regionName,
                    "rate": rate,
                    "contractTime": contractTime,
                    "createTime": createTime,
                    "totalPrice": totalPrice,
                    "orderTotalPrice": orderTotalPrice,
                    "netperfor": netperfor,  # 净业绩
                    "comperfor": comperfor  # 复合业绩
                }
                options = {
                    '_op_type': 'index',
                    '_index': 'decoration-contract-' + startTime,
                    '_type': 'decorations',
                    '_source': _sources
                }

                arrList.append(options)

            elasticsearch.helpers.bulk(self.es, arrList, request_timeout=60)

        self.closeDBConnect()

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

    def customize_main(self, limit, startTime, endTime):

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        pdate = "(d.contractTime between '%s 00:00:00' and '%s 23:59:59')" % (startTime, endTime)

        self.selectSigning(self.SQL, pdate, startTime, limit)

    def daily_main(self, limit):

        yesterday = datetime.date.today() + timedelta(-1)

        yesterday_format = yesterday.strftime('%Y-%m-%d')

        pdate = "(d.contractTime between '%s 00:00:00' and '%s 23:59:59')" % (yesterday_format, yesterday_format)

        self.selectSigning(self.SQL, pdate, yesterday_format, limit)


if __name__ == "__main__":

    """
    1.按照指定日期查询装修单签单信息：查询订单编号，公司，创建时间，签单时间，签单额，设计师，设计师比例，设计师部门及大区，业务员，业务员比例，业务员部门及大区。
                         特殊参数： 签单额  = 订单签单额  * 比例 
    2.传入参数：
        limit（必填项）： 查询条数 （50） 查询limit条数据
        startTime（可填项）：起始时间 （2018-01-01） 签单日期从startTime开始的装修单
        endTime（可填项）：结束时间 （2018-05-01） 签单日期已endTime结束的装修单
    3.开关控制：
        customize：定制。 必须传入startTime与endTime，指定查询从startTime到endTime的区间数据
        daily：每天。 不需要传递startTime与endTime，查询当天的前一天数据。
                        注：两种方式都必须传入limit。
    4.python es_decoration_contract_collecter.py customize <limit> <startTime> <endTime>
                         例：python es_decoration_contract_collecter.py customize 50 2018-01-01 2018-05-01
                         则：执行脚本，查询2018-01-01到2018-05-01的签单信息，以50条显示。
      python es_decoration_contract_collecter.py daily <limit>
                          例：python es_decoration_contract_collecter.py daily 50 
                         则：执行脚本，查询前一天的签单信息，以50条显示。
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))

    dbconf = config.get("database")

    signing = Signing(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("eshost"), int(config.get("timeDiff")))

    option = sys.argv[1]

    if option == "customize":
        signing.customize_main(int(sys.argv[2]), sys.argv[3], sys.argv[4])

    elif option == "daily":
        signing.daily_main(int(sys.argv[2]))

    else:
        print ('python es_decoration_contract_collecter.py customize <limit> <startTime> <endTime>')
        print ('python es_decoration_contract_collecter.py daily <limit>')
        sys.exit()
