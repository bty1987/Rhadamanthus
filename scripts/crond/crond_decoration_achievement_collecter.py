#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import os
import sys
import calendar
import datetime
import time
from dateutil.relativedelta import relativedelta

import pymysql


class Decoration7achievement():

    SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT1 = """
        SELECT
            regionds.did AS did,
            d.typeness AS typeness,
            d.company AS company,
            sum(belongds.rate) AS cs0,
            sum(d.orderTotalPrice * (belongds.rate/1000)) AS cs2,
            sum((orderTotalPrice - ( IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) ) - couponCut - thingCut) * (belongds.rate/1000)) AS cs3
        FROM
            decoration.decoration d,
            quotation.quotation q,
            communion.department regionds,
            decoration.decorationbelong belongds
        WHERE
            d.orderId = belongds.orderId
            AND d.orderId = q.orderId 
            AND belongds.rid = regionds.dId 
            AND belongds.`status` = 0 
            AND belongds.`type` = 0 
            AND q.defaults = 1 
            AND d.contractTime > '%s 00:00:00'
            AND d.contractTime < '%s 23:59:59'
            %s
        GROUP BY 
            d.company,
            regionds.did,
            d.typeness;
        """

    SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT2 = """
        SELECT
            regionds.did AS did, 
            d.typeness AS typeness,
            d.company AS company,
            sum(belongds.rate) AS cs1, 
            sum(dp.refermoney * (belongds.rate/1000)) AS cs4 
        FROM
            payment.decorationpayment dp,
            payment.decorationreceipt dr,
            decoration.decoration d,
            communion.department regionds,
            decoration.decorationbelong belongds,
            data.paymenttype cp 
        WHERE
            dp.drid = dr.drid
            AND d.orderId = belongds.orderId
            AND dp.orderId = d.orderId 
            AND belongds.rid = regionds.dId 
            AND belongds.`status` = 0
            AND belongds.`type` = 0
            AND dp.ptid = cp.ptid 
            AND cp.paytype = 0 
            AND cp.bustype = 0 
            AND cp.atttype = 0 
            AND dp.paymentStatus in ( 1, 2 )
            AND dr.collectTime > '%s 00:00:00'
            AND dr.collectTime < '%s 23:59:59'
            %s
        GROUP BY
            d.company,
            regionds.did,
            d.typeness;
        """

    SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT3 = """
        SELECT
            regionds.did AS did,
            d.typeness AS typeness,
            d.company AS company,
            sum( sp.serviceMoney * (belongds.rate/1000))  AS cs5
        FROM
            payment.servicepayment sp,
            payment.servicereceipt sr,
            decoration.decoration d,
            communion.department regionds,
            decoration.decorationbelong belongds 
        WHERE
            sp.srid = sr.srid
            AND sp.orderId = d.orderId 
            AND d.orderId = belongds.orderId 
            AND belongds.rid = regionds.dId 
            AND belongds.`status` = 0 
            AND belongds.`type` = 0 
            AND sr.collectTime > '%s 00:00:00'
            AND sr.collectTime < '%s 23:59:59'
            %s
        GROUP BY
            d.company,
            regionds.did,
            d.typeness;
        """

    SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT7 = """
         SELECT
            regionds.did AS did,
            d.typeness AS typeness,
            d.company AS company,
            sum(belongds.rate) AS cs6,
            sum(dp.refermoney * (belongds.rate/1000)) AS cs7
         FROM
            payment.decorationpayment dp,
            payment.decorationreceipt dr,
            data.paymenttype cp,
            decoration.decoration d,
            communion.department regionds,
            decoration.decorationbelong belongds
         WHERE
            dp.drid = dr.drid 
            AND d.orderId = belongds.orderId
            AND dp.orderId = d.orderId 
            AND belongds.rid = regionds.dId 
            AND dp.ptid = cp.ptid
            AND cp.paytype = 0
            AND cp.bustype = 0
            AND cp.atttype = 0
            AND dp.paymentStatus in (1, 2)
            AND d.status not in (3, 7)
            AND belongds.`status` = 0
            AND belongds.`type` = 0
            AND dr.collectTime > '%s 00:00:00' 
            AND dr.collectTime < '%s 23:59:59' 
            %s 
         GROUP BY
            d.company,
            regionds.did,
            d.typeness;
         """

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        
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

    def currentMonth(self, year, month):

        last_day = calendar.monthrange(year, month)[1]
        start = datetime.date(year, month, 1)
        end = datetime.date(year, month, last_day)

        return start, end

    # 公司条件识别
    def company(self, cloumCompany, company):
    
        if company != 0 and company != "0":
            return u"AND %s = %s" % (cloumCompany, company)

        return " "

    def query1decoration7achievement(self, startTime, endTime, company):

        sql = self.SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT1 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        decoration7achievements = self.cursor.fetchall()

        result = []
        fields = ["did", "typeness", "company", "cs0", "cs2", "cs3"]
        
        for decoration7achievement in decoration7achievements:
            _ = dict(zip(fields, decoration7achievement))

            result.append(_)

        return result

    def query2decoration7achievement(self, startTime, endTime, company, decoration7achievements1):

        sql = self.SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT2 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        decoration7achievements = self.cursor.fetchall()
        fields = ["did", "typeness", "company", "cs1", "cs4"]

        for decoration7achievement in decoration7achievements:
            _ = dict(zip(fields, decoration7achievement))
            index = 0

            for decoration7achievement1 in decoration7achievements1:
                if (_['did'] == decoration7achievement1['did'] and _['typeness'] == decoration7achievement1['typeness'] and _['company'] == decoration7achievement1['company']):
                    index = 1
                    decoration7achievement1.update(_)

            if(index == 0):
                decoration7achievements1.append(_)

        return decoration7achievements1

    def query3decoration7achievement(self, startTime, endTime, company, decoration7achievements1):

        sql = self.SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT3 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        decoration7achievements = self.cursor.fetchall()
        fields = ["did", "typeness", "company", "cs5"]

        for decoration7achievement in decoration7achievements:
            _ = dict(zip(fields, decoration7achievement))
            index = 0

            for decoration7achievement1 in decoration7achievements1:
                if (_['did'] == decoration7achievement1['did'] and _['typeness'] == decoration7achievement1['typeness'] and _['company'] == decoration7achievement1['company']):
                    index = 1
                    decoration7achievement1.update(_)

            if(index == 0):
                decoration7achievements1.append(_)

        return decoration7achievements1

    def query4decoration7achievement(self, startTime, endTime, company, decoration7achievements1):

        sql = self.SQL_QUERY_COUNTDECORATIONFORACHIEVEMENT7 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        decoration7achievements = self.cursor.fetchall()
        fields = ["did", "typeness", "company", "cs6", "cs7"]

        for decoration7achievement in decoration7achievements:
            _ = dict(zip(fields, decoration7achievement))
            index = 0

            for decoration7achievement1 in decoration7achievements1:
                if (_['did'] == decoration7achievement1['did'] and _['typeness'] == decoration7achievement1['typeness'] and _['company'] == decoration7achievement1['company']):
                    index = 1
                    decoration7achievement1.update(_)

            if(index == 0):
                decoration7achievements1.append(_)

        return decoration7achievements1
    
    def update1decoration7achievement(self, decoration7achievements1, year, month):

        fields = ["year", "month"]

        for decoration7achievements in decoration7achievements1:
            decoration7achievements.update(dict(zip(fields, (year, month))))

            keys = []
            values = []

            for key in decoration7achievements:
                keys.append(key)
                values.append(str(int(decoration7achievements[key] if decoration7achievements[key] else 0)))

            sql = "REPLACE INTO report.decoration7achievement (%s) VALUES (%s);" % (",".join(keys), ",".join(values))

            self.cursor.execute(sql)
            self.commit()

    def automatic(self, company):

        year = 2015
        month = 1
        offset = 20
        count = 0

        # 当天日期
        today = datetime.datetime.now()

        self.manual(today.year, today.month, company)

        # 获取星期几
        week = datetime.date(today.year, today.month, today.day).weekday()

        while True:

            # 开始时间
            start = datetime.datetime(year, month, 1) + relativedelta(months = count + week * offset)

            # 执行时间截止到当前年月份
            if start > today: break

            if count >= offset: break

            startTime, endTime = self.currentMonth(start.year, start.month)

            self.getDBCursor()

            # 更新设计分区业绩
            decoration7achievements1 = self.query1decoration7achievement(startTime, endTime, company)
            decoration7achievements1 = self.query2decoration7achievement(startTime, endTime, company, decoration7achievements1)
            decoration7achievements1 = self.query3decoration7achievement(startTime, endTime, company, decoration7achievements1)
            decoration7achievements1 = self.query4decoration7achievement(startTime, endTime, company, decoration7achievements1)
            self.update1decoration7achievement(decoration7achievements1, start.year, start.month)

            count = count + 1

            time.sleep(2)# 延迟2S

        self.closeDBConnect()

    def manual(self, year, month, company):

        self.getDBCursor()
        startTime, endTime = self.currentMonth(year, month)

        decoration7achievements1 = self.query1decoration7achievement(startTime, endTime, company)
        decoration7achievements1 = self.query2decoration7achievement(startTime, endTime, company, decoration7achievements1)
        decoration7achievements1 = self.query3decoration7achievement(startTime, endTime, company, decoration7achievements1)
        decoration7achievements1 = self.query4decoration7achievement(startTime, endTime, company, decoration7achievements1)
        self.update1decoration7achievement(decoration7achievements1, year, month)

        self.closeDBConnect()

if __name__ == '__main__':

    """
        1.脚本说明: 每2秒,以当前星期为判断更新20个月的装修业绩进行统计

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_decoration7achievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    decoration7achievement = Decoration7achievement(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"/"manual"
    # callback = "automatic"
    # year = '2022'
    # month = '5'
    # company = 0

    if callback == 'automatic':
    
        company = sys.argv[2]
    
        getattr(decoration7achievement, callback)(company)
    elif callback == 'manual':
    
        year = sys.argv[2]
        month = sys.argv[3]
        company = sys.argv[4]
    
        getattr(decoration7achievement, callback)(int(year), int(month), company)
    elif callback == 'help':
        print ('python es_decoration7achievement_replace.py automatic <company>')
        print ('python es_decoration7achievement_replace.py manual <year> <month> <company>')
    else:
        sys.exit()
    