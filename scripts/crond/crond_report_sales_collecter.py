# !/usr/bin/evn python
# -*- encoding: utf-8 -*-

from dateutil.relativedelta import relativedelta
import json
import os
import redis
import pymysql
import datetime


class reportSalesAchievement():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        self.rc = None

        self.today = datetime.datetime.now()  # 当天日期
        self.refundsType = {
            0: u"购货",
            1: u"退货",
            2: u"全退",
            3: u"倒单"
        }

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

    def __rediscache__(self, db):

        if not self.rc:
            redis_config = config.get('redis')
            self.rc = redis.Redis(connection_pool=redis.ConnectionPool(host=redis_config.get("host"), password=redis_config.get("password"), db=db, decode_responses=True))
            # self.rc = redis.Redis(connection_pool=redis.ConnectionPool(host='localhost', db=db, decode_responses=True))
        return self.rc

    # 补充(月)
    def supplement(self, list, css, company):

        data = list[len(list) - 1]

        year = data['year']
        month = data['month']

        if data['year'] != self.today.year or data['month'] != self.today.month:
            while True:
                data2 = {}

                if list[len(list) - 1]["year"] == self.today.year and list[len(list) - 1]["month"] == self.today.month: return list

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)

                for cs in css:
                    data2['%s' % cs] = 0
                data2['year'] = start.year
                data2['month'] = start.month
                data2['company'] = data['company']
                data2['name'] = data['name']
                if company: data2['regionds'] = data['regionds']
                if company: data2['rename'] = data['rename']

                year = start.year
                month = start.month
                list.append(data2)
        else:
            return list

    # 补充(年)
    def supplement2(self, list, css):

        data = list[len(list) - 1]
        year = data['year']

        if data['year'] != self.today.year:
            while True:
                data2 = {}

                if list[len(list) - 1]["year"] == self.today.year: return list
                year = year + 1

                for cs in css:
                    data2['%s' % cs] = 0
                data2['year'] = year
                data2['company'] = data['company']

                year = year
                list.append(data2)
        else:
            return list
    # 集团版
    # 近12个月销售单数量走势(折线)
    def cs0(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs0 )/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs0', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs0'] = float(data['cs0'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs0"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs0'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs0"], 0)

    # 近12个月补款总额走势(折线)
    def cs2(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs2)/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs2', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs2"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs2'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs2"], 0)

    # 近12个月退货数量走势(折线)
    def cs4(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs4)/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs4', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs4'] = float(data['cs4'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs4"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs4'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs4"], 0)

    # 近12个月退货总额走势(折线)
    def cs5(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs5)/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs5', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs5'] = float(data['cs5'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs5"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs5'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs5"], 0)

    # 近12个月结算数量走势(折线)
    def cs6(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs6)/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs6', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs6'] = float(data['cs6'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs6"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs6'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs6"], 0)

    # 近12个月结算总额走势(折线)
    def cs7(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs7)/1000, rd.year, rd.month, rd.company, c.name FROM report.sales7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs7', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs7'] = float(data['cs7'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs7"], 0)  # 补充没有的数据
            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs7'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs7"], 0)

    # 销售单总数(数字) 销售单总额(数字)
    def cs8(self):

        sql = "SELECT SUM(cs0)/1000, SUM(cs1 + cs2)/1000, company  FROM report.sales7achievement GROUP BY company;"
        self.cursor.execute(sql)

        sales7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs2', 'company']

        for sales7achievement in sales7achievements:
            data = dict(zip(fields, sales7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs2'] = float(data['cs2'])
            result.append(data)

        return result

    # 15-22 销售总额对比(柱状)
    def cs9(self):

        sql = "SELECT SUM( cs1 + cs2 ) / 1000, year FROM report.sales7achievement WHERE cs2 !=0 GROUP BY year;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs2', 'year']
        year = 2014
        data2 = {}

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])

            while True:

                if data['year'] == year:
                    year = data['year']
                    result.append(data)
                    break

                year = year + 1

                if data['year'] != year:
                    data2['cs2'] = 0
                    data2['year'] = year

                    result.append(data2)
                    data2 = {}

        return self.supplement2(result, ["cs2"])

    # 品牌销售TOP10(表格)
    def cs10(self):

        sql = "SELECT COUNT(*) AS cs2, s.brand AS brand, SUM(s.total)/1000 FROM sales.sales s WHERE brand IN (SELECT brand FROM sales.sales GROUP BY brand HAVING COUNT(brand) > 1) GROUP BY s.brand ORDER BY COUNT(*) DESC LIMIT 10;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs2', 'brand', 'total']

        for sales7achievement in sales7achievements:
            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])
            data['brand'] = data['brand']
            data['total'] = float(data['total'])

            result.append(data)

        result.append({'cs2': 0, 'brand': '占位', 'total': 0})

        return result

    # 品牌退货TOP10(表格)
    def cs11(self):

        sql = "SELECT COUNT(*) AS cs2, s.brand AS brand, SUM(s.total)/1000 FROM sales.sales s, sales.salesRefunds r WHERE s.sid = r.rid AND brand IN (SELECT brand FROM sales.sales GROUP BY brand HAVING COUNT(brand) > 1) GROUP BY s.brand ORDER BY COUNT(*) DESC LIMIT 10;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs2', 'brand', 'total']

        for sales7achievement in sales7achievements:
            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])
            data['brand'] = data['brand']
            data['total'] = float(data['total'])

            result.append(data)

        result.append({'cs2': 0, 'brand': '占位', 'total': 0})

        return result

    # 公司版
    # 近12个月销售单数量走势(折线)
    def cs14(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs0 )/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs0', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs0'] = float(data['cs0'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs0"], 1)# 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs0'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs0"], 1)

    # 近12个月补款总额走势(折线)
    def cs15(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs2)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs2', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs2"], 1)# 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs2'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs2"], 1)

    # 近12个月退货数量走势(折线)
    def cs16(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(rd.cs4)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs4', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs4'] = float(data['cs4'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs4"], 1)# 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs4'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs4"], 1)

    # 近12个月退货数量走势(折线)
    def cs17(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(rd.cs5)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs5', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs5'] = float(data['cs5'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs5"], 1)  # 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs5'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs5"], 1)

    # 近12个月结算数量走势(折线)
    def cs18(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(rd.cs6)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs6', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs6'] = float(data['cs6'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs6"], 1)  # 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs6'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs6"], 1)

    # 近12个月结算总额走势(折线)
    def cs19(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs7)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.sales7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        sales7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs7', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))
            data['cs7'] = float(data['cs7'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs7"], 1)  # 补充没有的数据

            while True:

                if data['year'] == year and data['month'] == month:
                    year = data['year']
                    month = data['month']
                    result.append(data)
                    break

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)
                year = start.year
                month = start.month

                if data['year'] != year or data['month'] != month:
                    data2['cs7'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs7"], 1)

    # 公司品牌销售TOP10(表格)
    def cs20(self):

        sql = "SELECT COUNT(*) AS cs2, s.brand AS brand, s.company, SUM(s.total)/1000 FROM sales.sales s WHERE brand IN (SELECT brand FROM sales.sales GROUP BY brand HAVING COUNT(brand) > 1) GROUP BY s.company, s.brand ORDER BY COUNT(*) DESC;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs2', 'brand', 'company', 'total']

        for sales7achievement in sales7achievements:
            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])
            data['brand'] = data['brand']
            data['total'] = float(data['total'])

            result.append(data)

        result.append({'cs2': 0, 'brand': '占位', 'company':-1, 'total':0})

        return result

    # 公司品牌退货TOP10(表格)
    def cs21(self):

        sql = "SELECT COUNT(*) AS cs2, s.brand AS brand, s.company, SUM(s.total)/1000 FROM sales.sales s, sales.salesRefunds r WHERE s.sid = r.rid AND brand IN (SELECT brand FROM sales.sales GROUP BY brand HAVING COUNT(brand) > 1) GROUP BY s.company, s.brand ORDER BY COUNT(*) DESC;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs2', 'brand', 'company', 'total']

        for sales7achievement in sales7achievements:
            data = dict(zip(fields, sales7achievement))
            data['cs2'] = float(data['cs2'])
            data['brand'] = data['brand']
            data['total'] = float(data['total'])

            result.append(data)

        result.append({'cs2': 0, 'brand': '占位', 'company': -1, 'total': 0})

        return result
    # 退货类型比例(饼状)
    def cs22(self):

        sql = "SELECT COUNT(*), r.type, s.company, c.name FROM sales.salesRefunds r, sales.sales s, communion.company c WHERE r.sid = s.sid AND s.company = c.cid GROUP BY type, company;"

        self.cursor.execute(sql)
        sales7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'type', 'company', 'cname']

        for sales7achievement in sales7achievements:

            data = dict(zip(fields, sales7achievement))

            data['cs0'] = float(data['cs0'])
            data['name'] = self.refundsType[int(data['type'])]
            data['type'] = int(data['type'])

            result.append(data)

        result.append({'cs0': 0, 'typeness': -1, 'company': -1, 'cname': '占位', 'name': '占位'})

        return result

    def automatic(self):

        raisecache = self.__rediscache__(1)

        raise_cs0 = raisecache.exists("scs0")
        raise_cs2 = raisecache.exists("scs1")
        raise_cs4 = raisecache.exists("scs2")
        raise_cs5 = raisecache.exists("scs3")
        raise_cs6 = raisecache.exists("scs4")
        raise_cs7 = raisecache.exists("scs5")
        raise_cs8 = raisecache.exists("scs6")
        raise_cs9 = raisecache.exists("scs7")
        raise_cs10 = raisecache.exists("scs8")
        raise_cs11 = raisecache.exists("scs9")
        raise_cs22 = raisecache.exists("scs10")
        raise_cs14 = raisecache.exists("scs12")
        raise_cs15 = raisecache.exists("scs13")
        raise_cs16 = raisecache.exists("scs14")
        raise_cs17 = raisecache.exists("scs15")
        raise_cs18 = raisecache.exists("scs16")
        raise_cs19 = raisecache.exists("scs17")
        raise_cs20 = raisecache.exists("scs20")
        raise_cs21 = raisecache.exists("scs21")


        self.getDBCursor()

        scs0 = self.cs0()  # 近12个月销售单数量走势(折线)
        scs1 = self.cs2()   #近12个月补款总额走势(折线)
        scs2 = self.cs4()  # 近12个月退货数量走势(折线)
        scs3 = self.cs5()  # 近12个月退货总额走势(折线)
        scs4 = self.cs6()  # 近12个月结算数量走势(折线)
        scs5 = self.cs7()  # 近12个月结算总额走势(折线)
        scs6 = self.cs8()  # 销售单总数(数字) 销售单总额(数字)
        scs7 = self.cs9()  # 15-22 销售总额对比(柱状)
        scs8 = self.cs10()  # 品牌销售TOP10(表格)
        scs9 = self.cs11()  # 品牌退货TOP10(表格)
        scs10 = self.cs22()  # 退货类型比例(饼状)

        # 公司版
        scs12 = self.cs14()  # 近12个月销售单数量走势(折线)
        scs13 = self.cs15()  # 近12个月补款总额走势(折线)
        scs14 = self.cs16()  # 近12个月退货数量走势(折线)
        scs15 = self.cs17()  # 近12个月退货总额走势(折线)
        scs16 = self.cs18()  # 近12个月结算数量走势(折线)
        scs17 = self.cs19()  # 近12个月结算总额走势(折线)
        scs20 = self.cs20()  # 品牌销售TOP10(表格)
        scs21 = self.cs21()  # 品牌退货TOP10(表格)

        if raise_cs0: raisecache.delete("scs0")
        if raise_cs2: raisecache.delete("scs1")
        if raise_cs4: raisecache.delete("scs2")
        if raise_cs5: raisecache.delete("scs3")
        if raise_cs6: raisecache.delete("scs4")
        if raise_cs7: raisecache.delete("scs5")
        if raise_cs8: raisecache.delete("scs6")
        if raise_cs9: raisecache.delete("scs7")
        if raise_cs10: raisecache.delete("scs8")
        if raise_cs11: raisecache.delete("scs9")
        if raise_cs22: raisecache.delete("scs10")
        if raise_cs14: raisecache.delete("scs12")
        if raise_cs15: raisecache.delete("scs13")
        if raise_cs16: raisecache.delete("scs14")
        if raise_cs17: raisecache.delete("scs15")
        if raise_cs18: raisecache.delete("scs16")
        if raise_cs19: raisecache.delete("scs17")
        if raise_cs20: raisecache.delete("scs20")
        if raise_cs21: raisecache.delete("scs21")

        raisecache.set("scs0", json.dumps(scs0), 22 * 60 * 60)  # 近12个月销售单数量走势(折线)
        raisecache.set("scs1", json.dumps(scs1), 22 * 60 * 60)  # 近12个月补款总额走势(折线)
        raisecache.set("scs2", json.dumps(scs2), 22 * 60 * 60)  # 近12个月退货数量走势(折线)
        raisecache.set("scs3", json.dumps(scs3), 22 * 60 * 60)  # 近12个月退货总额走势(折线)
        raisecache.set("scs4", json.dumps(scs4), 22 * 60 * 60)  # 近12个月结算数量走势(折线)
        raisecache.set("scs5", json.dumps(scs5), 22 * 60 * 60)  # 近12个月结算总额走势(折线)
        raisecache.set("scs6", json.dumps(scs6), 22 * 60 * 60)  # 销售单总数(数字) 销售单总额(数字)
        raisecache.set("scs7", json.dumps(scs7), 22 * 60 * 60)  # 15-22 销售总额对比(柱状)
        raisecache.set("scs8", json.dumps(scs8), 22 * 60 * 60)  # 品牌销售TOP10(表格)
        raisecache.set("scs9", json.dumps(scs9), 22 * 60 * 60)  # 品牌退货TOP10(表格)
        raisecache.set("scs10", json.dumps(scs10), 22 * 60 * 60)  # 退货类型比例(饼状)

        # 公司版
        raisecache.set("scs12", json.dumps(scs12), 22 * 60 * 60)  # 近12个月销售单数量走势(折线)
        raisecache.set("scs13", json.dumps(scs13), 22 * 60 * 60)  # 近12个月补款总额走势(折线)
        raisecache.set("scs14", json.dumps(scs14), 22 * 60 * 60)  # 近12个月退货数量走势(折线)
        raisecache.set("scs15", json.dumps(scs15), 22 * 60 * 60)  # 近12个月退货总额走势(折线)
        raisecache.set("scs16", json.dumps(scs16), 22 * 60 * 60)  # 近12个月结算数量走势(折线)
        raisecache.set("scs17", json.dumps(scs17), 22 * 60 * 60)  # 近12个月结算总额走势(折线)
        raisecache.set("scs20", json.dumps(scs20), 22 * 60 * 60)  # 品牌销售TOP10(表格)
        raisecache.set("scs21", json.dumps(scs21), 22 * 60 * 60)  # 品牌退货TOP10(表格)


if __name__ == '__main__':
    """
        1.脚本说明: 收集装修业绩首页图表数据
                key:    集团
                "scs0"  # 近12个月销售单数量走势(折线)
                "scs1"  # 近12个月补款总额走势(折线)
                "scs2"  # 近12个月退货数量走势(折线)
                "scs3"  # 近12个月退货总额走势(折线)
                "scs4"  # 近12个月结算数量走势(折线)
                "scs5"  # 近12个月结算总额走势(折线)
                "scs6"  # 销售单总数(数字)# 销售单总额(数字)
                "scs7"  # 15-22 销售总额对比(柱状)
                "scs8"  # 品牌销售TOP10(表格)
                "scs9"  # 品牌退货TOP10(表格)
                "scs10"  # 退货类型比例(饼状)
                "scs11"  # 厂商抹零总额(数字)
                公司
                "scs12"  # 近12个月销售单数量走势(折线)
                "scs13"  # 近12个月补款总额走势(折线)
                "scs14"  # 近12个月退货数量走势(折线)
                "scs15"  # 近12个月退货总额走势(折线)
                "scs16"  # 近12个月结算数量走势(折线)
                "scs17"  # 近12个月结算总额走势(折线)
                "scs18"  # 销售单总数(数字)# 销售单总额(数字)
                "scs19"  # 15-22 销售总额对比(柱状)
                "scs20"  # 品牌销售TOP10(表格)
                "scs21"  # 品牌退货TOP10(表格)
                "scs22"  # 退货类型比例(饼状)
                "scs23"  # 厂商抹零总额(数字)

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_report_sales_collecter.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    reportSalesAchievement = reportSalesAchievement(config.get("database"))

    getattr(reportSalesAchievement, 'automatic')()
