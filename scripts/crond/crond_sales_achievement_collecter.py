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


class sales7achievement():
    # 销售单
    SQL_QUERY_COUNTSALESFORACHIEVEMENT1 = """
        SELECT
            d.did,
	        s.company,
	        COUNT(*)*1000 AS cs0
        FROM
	        sales.sales s,
	        communion.department d
        WHERE
	        s.did = d.did
	        AND s.createTime > '%s 00:00:00'
            AND s.createTime < '%s 23:59:59'
            %s
        GROUP BY
	        s.did;
        """

    # 定金
    SQL_QUERY_COUNTSALESFORACHIEVEMENT2 = """
        SELECT
            d.did,
            s.company,
	        SUM(s.depositpay) AS cs1
        FROM
	        sales.sales s,
	        communion.department d
        WHERE
	        s.depositpayStatus >= 1
	        AND s.did = d.did
	        AND s.createTime > '%s 00:00:00'
            AND s.createTime < '%s 23:59:59'
            %s
        GROUP BY
	        s.did;
        """

    # 补款
    SQL_QUERY_COUNTSALESFORACHIEVEMENT3 = """
        SELECT
	        d.did,
            s.company,
	        SUM(s.fullpay) AS cs2,
	        COUNT(*)*1000 AS cs3
        FROM
	        sales.sales s,
	        communion.department d
        WHERE
	        s.did = d.did
            AND s.fullpayTime > '%s 00:00:00'
            AND s.fullpayTime < '%s 23:59:59'
            %s
        GROUP BY
	        s.did;
        """

    # 退款
    SQL_QUERY_COUNTSALESFORACHIEVEMENT4 = """
        SELECT
            d.did,
            s.company,
            COUNT(*)*1000 AS cs4,
            SUM(r.total) AS cs5
        FROM
            sales.sales s,
            sales.salesRefunds r,
            communion.department d
        WHERE
            r.sid = s.sid
            and s.did = d.did
            AND r.createTime > '%s 00:00:00'
            AND r.createTime < '%s 23:59:59'
            %s
        GROUP BY
            s.did;
         """

    # 结算
    SQL_QUERY_COUNTSALESFORACHIEVEMENT5 = """
        SELECT
            d.did,
            s.company,
            COUNT(*)*1000 AS cs6,
            SUM(b.total) AS cs7
        FROM
            communion.department d,
	        sales.salesbalance b,
	        sales.sales s
        WHERE
            b.did = d.did
            AND s.sid = b.sid
            AND b.createTime > '%s 00:00:00'
            AND b.createTime < '%s 23:59:59'
            %s
        GROUP BY
            b.did;
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

    def query1sales7achievement(self, startTime, endTime, company):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT1 % (startTime, endTime, self.company(u"s.company", company))
        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()

        result = []
        fields = ["did", "company", "cs0"]

        for sales7achievement in sales7achievements:
            _ = dict(zip(fields, sales7achievement))

            result.append(_)

        return result

    def query2sales7achievement(self, startTime, endTime, company, sales7achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT2 % (startTime, endTime, self.company(u"s.company", company))

        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()
        fields = ["did", "company", "cs1"]

        for sales7achievement in sales7achievements:
            _ = dict(zip(fields, sales7achievement))
            index = 0

            for sales7achievement1 in sales7achievements1:
                if (_['did'] == sales7achievement1['did'] and _['company'] == sales7achievement1['company']):
                    index = 1
                    sales7achievement1.update(_)

            if (index == 0):
                sales7achievements1.append(_)

        return sales7achievements1

    def query3sales7achievement(self, startTime, endTime, company, sales7achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT3 % (startTime, endTime, self.company(u"s.company", company))

        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()
        fields = ["did", "company", "cs2", "cs3"]

        for sales7achievement in sales7achievements:
            _ = dict(zip(fields, sales7achievement))
            index = 0

            for sales7achievement1 in sales7achievements1:
                if (_['did'] == sales7achievement1['did'] and _['company'] == sales7achievement1['company']):
                    index = 1
                    sales7achievement1.update(_)

            if (index == 0):
                sales7achievements1.append(_)

        return sales7achievements1

    def query4sales7achievement(self, startTime, endTime, company, sales7achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT4 % (startTime, endTime, self.company(u"s.company", company))

        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()
        fields = ["did", "company", "cs4", "cs5"]

        for sales7achievement in sales7achievements:
            _ = dict(zip(fields, sales7achievement))
            index = 0

            for sales7achievement1 in sales7achievements1:
                if (_['did'] == sales7achievement1['did'] and _['company'] == sales7achievement1['company']):
                    index = 1
                    sales7achievement1.update(_)

            if (index == 0):
                sales7achievements1.append(_)

        return sales7achievements1

    def query5sales7achievement(self, startTime, endTime, company, sales7achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT5 % (startTime, endTime, self.company(u"s.company", company))

        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()
        fields = ["did", "company", "cs6", "cs7"]

        for sales7achievement in sales7achievements:
            _ = dict(zip(fields, sales7achievement))
            index = 0

            for sales7achievement1 in sales7achievements1:
                if (_['did'] == sales7achievement1['did'] and _['company'] == sales7achievement1['company']):
                    index = 1
                    sales7achievement1.update(_)

            if (index == 0):
                sales7achievements1.append(_)

        return sales7achievements1

    def update1sales7achievement(self, sales7achievements1, year, month):

        fields = ["year", "month"]

        for sales7achievements in sales7achievements1:
            sales7achievements.update(dict(zip(fields, (year, month))))

            keys = []
            values = []

            for key in sales7achievements:
                keys.append(key)
                values.append(str(int(sales7achievements[key] if sales7achievements[key] else 0)))

            sql = "REPLACE INTO report.sales7achievement (%s) VALUES (%s);" % (",".join(keys), ",".join(values))

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
        # week = 0
        while True:

            # 开始时间
            start = datetime.datetime(year, month, 1) + relativedelta(months=count + week * offset)
            # 执行时间截止到当前年月份
            if start > today: break

            if count >= offset: break

            startTime, endTime = self.currentMonth(start.year, start.month)
            self.getDBCursor()
            # 更新设计分区业绩
            sales7achievements1 = self.query1sales7achievement(startTime, endTime, company)
            sales7achievements1 = self.query2sales7achievement(startTime, endTime, company, sales7achievements1)
            sales7achievements1 = self.query3sales7achievement(startTime, endTime, company, sales7achievements1)
            sales7achievements1 = self.query4sales7achievement(startTime, endTime, company, sales7achievements1)
            sales7achievements1 = self.query5sales7achievement(startTime, endTime, company, sales7achievements1)
            self.update1sales7achievement(sales7achievements1, start.year, start.month)

            count = count + 1

            time.sleep(2)

        self.closeDBConnect()

    def manual(self, year, month, company):

        self.getDBCursor()
        startTime, endTime = self.currentMonth(year, month)

        sales7achievements1 = self.query1sales7achievement(startTime, endTime, company)
        sales7achievements1 = self.query2sales7achievement(startTime, endTime, company, sales7achievements1)
        sales7achievements1 = self.query3sales7achievement(startTime, endTime, company, sales7achievements1)
        sales7achievements1 = self.query4sales7achievement(startTime, endTime, company, sales7achievements1)
        sales7achievements1 = self.query5sales7achievement(startTime, endTime, company, sales7achievements1)
        self.update1sales7achievement(sales7achievements1, year, month)

        self.closeDBConnect()


if __name__ == '__main__':

    """
        1.脚本说明: 每2秒,以当前星期为判断更新20个月的装修业绩进行统计

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_sales7Achievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    sales7achievement = sales7achievement(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"
    if callback == 'automatic':

        company = sys.argv[2]
        # company = 1
        getattr(sales7achievement, callback)(company)

    elif callback == 'manual':

        year = sys.argv[2]
        month = sys.argv[3]
        company = sys.argv[4]

        getattr(sales7achievement, callback)(int(year), int(month), company)
    elif callback == 'help':
        print('python es_sales7achievement_replace.py automatic <company>')
        print('python es_sales7achievement_replace.py manual <year> <month> <company>')
    else:
        sys.exit()
