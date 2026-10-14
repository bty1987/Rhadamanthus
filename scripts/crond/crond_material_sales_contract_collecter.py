#!/usr/bin/python
# -*- coding:UTF-8 -*-
import os
import datetime
import sys
import json
import pymysql
from elasticsearch import Elasticsearch
import elasticsearch.helpers
import time


class Export_Material:
    def __init__(self, host='', username='', password='', media='', pthost='', eshost='', charset='utf8'):
        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.flag = True

        self.esHost = eshost
        self.materialResultCash = []
        self.salesResultCash = []

        self.es = Elasticsearch(self.esHost)

        self.materialcolum = u"""
                            de.orderId as `装修单号`,
                            mm.no as `主材单号`,
                            u1.username as `业务员姓名`,
                            dept1.name as `业务员部门`,
                            dept2.name as `业务员分区`,
                            u2.username as `导购`,
                            u3.username as `驻店`,
                            dept3.name as `主材部`,
                            mp.referMoney as `总额`,
                            mr.coupon as `劵`,
                            com.name as `公司`,
                            mp.paymentType as `款项类型`
                            """

        self.SELECT_MATERIAL = u"""SELECT
                                          %s
                                        FROM 
                                    decoration.decoration AS de,
                                    material.material AS mm,
                                    payment.materialpayment AS mp,
                                    payment.materialreceipt AS mr,
                                    communion.department AS dept1,
                                    communion.department AS dept2,
                                    communion.user AS u1,
                                    communion.user AS u2,
                                    communion.user AS u3,
                                    communion.department AS dept3,
                                    communion.company AS com
                                    WHERE 
                                    de.orderId = mm.orderId
                                    AND mm.smuid = u1.uid
                                    AND mp.mid = mm.mid
                                    AND mr.mrId = mp.mrId
                                    AND mm.departmentId = dept1.did
                                    AND mm.regionId = dept2.did
                                    AND mm.muid = u2.uid
                                    AND mm.iuid = u3.uid
                                    AND mm.materialDeptId = dept3.did
                                    AND mp.company = com.cid
                                    AND mr.collectTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
                                    %s
                              """

        self.salescolum = u"""
                        de.orderId as `装修单号`,
                        ss.no as `销售单号`,
                        u1.username as `业务员姓名`,
                        dept1.name as `业务员部门`,
                        dept2.name as `业务员分区`,
                        u2.username as `导购`,
                        u3.username as `驻店`,
                        dept3.name as `导购归属部门`,
                        sp.referMoney as `总额`,
                        sr.coupon as `劵`,
                        com.name as `公司`,
                        sp.Type AS `款项类型`
                        """

        self.SELECT_SALES = u"""
                                    SELECT 
                                          %s
                                    FROM 
                                     sales.sales AS ss,
                                     decoration.decoration AS de,
                                     payment.salespayment AS sp,
                                     payment.salesreceipt AS sr,
                                     communion.user AS u1,
                                     communion.user AS u2,
                                     communion.user AS u3,
                                     communion.department AS dept1,
                                     communion.department AS dept2,
                                     communion.department AS dept3,
                                     communion.company AS com
                                     WHERE
                                     ss.orderId = de.orderId
                                     AND sp.sid = ss.sid
                                     AND sp.srid = sr.srid
                                     AND ss.suid = u1.uid
                                     AND ss.guid = u2.uid
                                     AND ss.iuid = u3.uid
                                     AND ss.did = dept1.did
                                     AND ss.rid = dept2.did
                                     AND ss.gdid = dept3.did
                                     AND sp.company = com.cid
                                      AND sr.collectTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
                                      %s
        """

    def material(self, company, startTime, endTime):

        companyId = self.company(u"mp.company", company)

        sqls = self.SELECT_MATERIAL % (self.materialcolum, startTime, endTime, companyId)

        nowPage = 1
        flag = True
        while (flag):
            data = self.page(sqls, nowPage)
            materialResultCash = []

            for i, v in enumerate(data):
                orderId = v[0]  # 装修单号
                materialOrderId = v[1]  # 主材单号
                salesName = v[2]  # 业务员姓名
                salesDept = v[3]  # 业务部门
                deptName = v[4]  # 业务分区
                shoppinger = v[5]  # 导购
                instorer = v[6]  # 驻店
                materialDept = v[7]  # 主材部
                total = v[8]  # 总额
                coupons = v[9]  # 券
                companys = v[10]  # 公司
                paymentType = v[11]  # 款项类型

                if paymentType == 1: continue

                template = {
                    u"orderId": orderId,
                    u"materialOrderId": materialOrderId,
                    u"salesName": salesName,
                    u"salesDept": salesDept,
                    u"deptName": deptName,
                    u"shoppinger": shoppinger,
                    u"instorer": instorer,
                    u"materialDept": materialDept,
                    u"total": total,
                    u"moneyType": u"收款",
                    u"coupons": coupons,
                    u"companys": companys
                }
                if paymentType in [4, 5, 6, 7]:
                    template[u"total"] = -total
                    template[u"moneyType"] = u"退款"

                options = {
                    u"_op_type": u"index",
                    u"_index": u"material-%s" % time.strftime('%Y.%m.%d', time.localtime(time.time()))[0:4],  # 表名
                    u"_type": u"material",  # 库名
                    u"_source": template
                }
                materialResultCash.append(options)
            elasticsearch.helpers.bulk(self.es, materialResultCash, request_timeout=60)

            nowPage = nowPage + 1

            if len(data) < 200:
                flag = False

    def sales(self, company, startTime, endTime):

        companyId = self.company(u"sp.company", company)
        sql = self.SELECT_SALES % (self.salescolum, startTime, endTime, companyId)
        nowPage = 1
        flag = True

        while (flag):
            data = self.page(sql, nowPage)
            salesResultCash = []
            for i, v in enumerate(data):
                orderId = v[0]  # 装修单号
                salesOrderId = v[1]  # 销售单号
                salesName = v[2]  # 业务员姓名
                salesDept = v[3]  # 业务部门
                deptName = v[4]  # 业务分区
                shoppinger = v[5]  # 导购
                instorer = v[6]  # 驻店
                instorerDept = v[7]  # 驻店所属部门
                total = v[8]  # 总额
                coupons = v[9]  # 券
                company = v[10]  # 公司
                paymentType = v[11]  # 款项类型

                if paymentType == 1: continue
                template = {
                    u"orderId": orderId,
                    u"salesOrderId": salesOrderId,
                    u"salesName": salesName,
                    u"salesDept": salesDept,
                    u"deptName": deptName,
                    u"shoppinger": shoppinger,
                    u"instorer": instorer,
                    u"instorerDept": instorerDept,
                    u"moneyType": u"收款",
                    u"total": total,
                    u"coupons": coupons,
                    u"company": company
                }
                if paymentType in [4, 5, 6, 7]:
                    template[u"total"] = -total
                    template[u"moneyType"] = u"退款"

                options = {
                    u"_op_type": u"index",
                    u"_index": u"sales-%s" % time.strftime('%Y.%m.%d', time.localtime(time.time()))[0:4],
                    u"_type": u"sales",
                    u"_source": template
                }
                salesResultCash.append(options)
            elasticsearch.helpers.bulk(self.es, salesResultCash, request_timeout=60)

            nowPage = nowPage + 1

            if len(data) < 200:
                flag = False

    def executeSQL(self, sql):

        self.cursor.execute(sql)
        data = self.cursor.fetchall()

        return data

    def company(self, cloumCompany, company):

        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "

        return companyId

    def page(self, sql, nowPage, size=200):

        nowPage = (nowPage - 1) * size

        limtStr = """limit %s,%s; """ % (nowPage, size)
        pageSql = sql + limtStr

        self.cursor.execute(pageSql)

        data = self.cursor.fetchall()

        return data

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

    def main(self, company, startTime, endTime):

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        self.getDBCursor()
        self.material(company, startTime, endTime)
        self.sales(company, startTime, endTime)
        self.closeDBConnect()

        sys.exit(0)


if __name__ == '__main__':
    """
            脚本说明:
            crond_materialAndsales_volume.用来统计指定时间内的主材, 销售的销售额并存储在elasticsearch中

            1.传入必须参数说明
                1.args        查询时间
                2.company     公司

            2,使用控制:
            python crond_materialAndsales_volume.py  args company
            1.自动获取昨天时间
            python crond_materialAndsales_volume.py  auto 1
            2.指定时间
            python crond_materialAndsales_volume.py  2018/10/01-2018/11/31 1
            """

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
    else:
        spargs = args.split("-")
        startTime = spargs[0]
        endTime = spargs[1]

    Export_Material = Export_Material(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),
                                      config.get("media"), config.get("pthost"), config.get("eshost"))
    Export_Material.main(company, startTime, endTime)
