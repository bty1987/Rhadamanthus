# !/usr/bin/evn python
# -*- encoding: utf-8 -*-

from dateutil.relativedelta import relativedelta
import json
import os
import redis
import pymysql
import calendar
import datetime


class reportDecorationAchievement():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        self.rc = None

        self.today = datetime.datetime.now()  # 当天日期
        self.decorationType = {}

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
            self.rc = redis.Redis(connection_pool=redis.ConnectionPool(host=redis_config.get("host"),password=redis_config.get("password"), db=db, decode_responses=True))
            # self.rc = redis.Redis(connection_pool=redis.ConnectionPool(host='localhost', db=db, decode_responses=True))
        return self.rc

    def decorationtype(self):

        sql = "select `key`, `value` from communion.constant where module = 'decoration' and clazz = 'decoration' and type = 'typeness'"

        self.cursor.execute(sql)
        constants = self.cursor.fetchall()

        for constant in constants:
            self.decorationType[int(constant[0])] = constant[1]

    # 补充(月)
    def supplement(self, infos, css, company):
    
        if not infos: return []
        if len(infos) == 0: return []

        data = infos[len(infos) - 1]

        year = data['year']
        month = data['month']

        if data['year'] != self.today.year or data['month'] != self.today.month:
            while True:
                data2 = {}

                if infos[len(infos) - 1]["year"] == self.today.year and infos[len(infos) - 1]["month"] == self.today.month: return infos

                start = datetime.datetime(year, month, 1) + relativedelta(months=1)

                for cs in css:
                    data2['%s' % cs] = 0
                data2['year'] = start.year
                data2['month'] = start.month
                data2['company'] = data['company']
                data2['name'] = data['name']
                if company : data2['regionds'] = data['regionds']
                if company : data2['rename'] = data['rename']

                year = start.year
                month = start.month
                infos.append(data2)
        else:
            return infos

    # 补充(年)
    def supplement2(self, infos, css):
    
        if not infos: return []
        if len(infos) == 0: return []

        data = infos[len(infos) - 1]
        year = data['year']

        if data['year'] != self.today.year:
            while True:
                data2 = {}

                if infos[len(infos) - 1]["year"] == self.today.year : return infos
                year = year +1

                for cs in css:
                    data2['%s' % cs] = 0
                data2['year'] = year
                data2['company'] = data['company']

                year = year
                infos.append(data2)
        else:
            return infos

    def currentMonth(self, year, month):

        last_day = calendar.monthrange(year, month)[1]
        start = datetime.date(year, month, 1)
        end = datetime.date(year, month, last_day)

        return start, end

    # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
    def cs0(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs0 ) / 1000, SUM( rd.cs2 ) / 1000, rd.year, rd.month, rd.company, c.name FROM report.decoration7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs0', 'cs2', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs0'] = float(data['cs0'])
            data['cs2'] = float(data['cs2'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs0", "cs2"], 0)# 补充没有的数据

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
                    data2['cs2'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs0", "cs2"], 0)

    # 签单类型比例(饼状)
    def cs1(self):

        sql = "SELECT SUM( cs0 ) / 1000, typeness, company, c.name  FROM report.decoration7achievement rd, communion.company c WHERE rd.company = c.cid GROUP BY typeness, company;"

        self.cursor.execute(sql)
        decoration7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'typeness', 'company', 'cname']

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))

            data['cs0'] = float(data['cs0'])
            data['name'] = self.decorationType.get(data['typeness'])
            data['typeness'] = int(data['typeness'])

            result.append(data)

        result.append({'cs0': 0, 'typeness': -1, 'company': -1, 'cname': '占位', 'name': '占位'})

        return result

    # 公司签单额排名(表格)
    def cs2(self):

        sql = "SELECT rd.company, c.name, rd.did, regionds.name, SUM( rd.cs2 ) / 1000 FROM report.decoration7achievement rd, communion.company c, communion.department regionds WHERE c.cid = rd.company AND rd.did = regionds.dId GROUP BY regionds.dId ORDER BY rd.company, SUM(rd.cs2) DESC;"

        self.cursor.execute(sql)
        decoration7achievements = self.cursor.fetchall()
        result = []
        fields = ['company', 'name', 'regionds', 'rename', 'cs2']

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs2'] = float(data['cs2'])

            result.append(data)

        result.append({'company': -1, 'name': '占位','regionds': -1,'rename': '占位', 'cs2': 0})

        return result

    # 15 - 22年各公司月签单额走势(折线)
    def cs3(self):

        sql = "SELECT SUM(rd.cs2)/1000, rd.year, rd.month, rd.company, c.name FROM report.decoration7achievement rd, communion.company c WHERE c.cid = rd.company AND cs0 != 0 GROUP BY rd.company, rd.year, rd.month;"
        self.cursor.execute(sql)
        decoration7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs2', 'year', 'month', 'company', 'name']
        year = 2014
        month = 12
        cid = -1
        data2 = {}

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs2'] = float(data['cs2'])

            if cid != data["company"]:
                cid = data["company"]
                year = 2014
                month = 12
                if result :
                    result = self.supplement(result, ["cs2"], 0)# 补充没有的数据
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

    # 15 - 22 年签单额对比(柱状)
    def cs4(self):

        sql = "SELECT SUM( cs2 ) / 1000, year, company FROM report.decoration7achievement WHERE cs2 !=0 GROUP BY company, year;"

        self.cursor.execute(sql)
        decoration7achievements = self.cursor.fetchall()


        result = []
        fields = ['cs2', 'year', 'company']
        year = 2014
        company = -1
        data2 = {}

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs2'] = float(data['cs2'])

            if company != data["company"]:
                company = data["company"]
                year = 2014
                if result :
                    result = self.supplement2(result, ["cs2"])# 补充没有的数据
            while True:

                if data['year'] == year:
                    year = data['year']
                    result.append(data)
                    break

                year = year + 1

                if data['year'] != year:
                    data2['cs2'] = 0
                    data2['year'] = year
                    data2['company'] = data['company']

                    result.append(data2)
                    data2 = {}

        return self.supplement2(result, ["cs2"])

    # 签单总数(数字) 签单总额(数字)
    def cs5(self):

        sql = "SELECT SUM(cs0)/1000, SUM(cs2)/1000, company  FROM report.decoration7achievement GROUP BY company;"
        self.cursor.execute(sql)

        decoration7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs2', 'company']

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs2'] = float(data['cs2'])
            result.append(data)

        return result

    # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)
    def cs6(self):

        today = self.today  # 当天日期today = self.today
        start1 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 11)

        sql = "SELECT SUM( rd.cs1 ) / 1000, SUM( rd.cs4 ) / 1000, rd.year, rd.month, rd.company, c.name FROM report.decoration7achievement rd, communion.company c WHERE rd.company = c.cid AND rd.cs1 != 0 AND (( rd.YEAR >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.year, rd.month;"

        self.cursor.execute(sql % (start1.year, start1.month, today.year, today.month))
        decoration7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs1', 'cs4', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs1'] = float(data['cs1'])
            data['cs4'] = float(data['cs4'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs1", "cs4"], 0)# 补充没有的数据

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
                    data2['cs1'] = 0
                    data2['cs4'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs1", "cs4"], 0)

    # 公司版
    # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
    def cs7(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs0 ) / 1000, SUM( rd.cs2 ) / 1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.decoration7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs0', 'cs2', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs0'] = float(data['cs0'])
            data['cs2'] = float(data['cs2'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs0", "cs2"], 1)# 补充没有的数据

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
                    data2['cs2'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs0", "cs2"], 1)

    # 15 - 22年各公司月签单额走势(折线)
    def cs8(self):

        sql = "SELECT SUM(rd.cs2)/1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.decoration7achievement rd, communion.company c, communion.department regionds WHERE c.cid = rd.company AND rd.did = regionds.dId AND cs0 != 0 GROUP BY rd.company, rd.did, rd.year, rd.month;"
        self.cursor.execute(sql)
        decoration7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs2', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        year = 2014
        month = 12
        did = -1
        data2 = {}

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs2'] = float(data['cs2'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = 2014
                month = 12
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

    # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)
    def cs9(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs1 ) / 1000, SUM( rd.cs4 ) / 1000, rd.year, rd.month, rd.company, c.name, rd.did, regionds.name FROM report.decoration7achievement rd, communion.company c, communion.department regionds WHERE rd.company = c.cid AND rd.did = regionds.dId AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.did, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7achievements = self.cursor.fetchall()

        did = -1
        data2 = {}
        result = []
        fields = ['cs1', 'cs4', 'year', 'month', 'company', 'name', 'regionds', 'rename']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months = 12)

        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))
            data['cs1'] = float(data['cs1'])
            data['cs4'] = float(data['cs4'])

            if did != data["regionds"]:
                did = data["regionds"]
                year = start2.year
                month = start2.month
                if result :
                    result = self.supplement(result, ["cs1", "cs4"], 1)# 补充没有的数据

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
                    data2['cs1'] = 0
                    data2['cs4'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = data['company']
                    data2['name'] = data['name']
                    data2['regionds'] = data['regionds']
                    data2['rename'] = data['rename']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs1", "cs4"], 1)

    # 签单排名TOP6
    def cs10(self, type):

        today = self.today  # 当天日期
        startTime, endTime = self.currentMonth(today.year, today.month)

        sql = "SELECT u.userPhoto AS `头像`, u.currentName AS `签单人`, dm.NAME AS `签单部门`, c.NAME AS `归属公司`, d.company, sum(db.rate) / 1000 FROM decoration.decorationbelong db, decoration.decoration d, communion.department dm, communion.company c, communion.USER u WHERE d.orderId = db.orderId AND db.buid = u.uid AND u.deptId = dm.dId AND d.company = c.cid AND db.`status` = 0 AND db.`type` = %s AND d.contractTime > '%s 00:00:00' AND d.contractTime < '%s 23:59:59' GROUP BY d.company, u.userid ORDER BY sum(db.rate) DESC;"
        self.cursor.execute(sql % (type, startTime, endTime))

        decoration7achievements = self.cursor.fetchall()

        result = []
        counte = {}
        fields = ['userPhoto', 'currentName', 'department', 'cName', 'company', 'cs0']
        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))

            if not data["company"] in counte: counte[data["company"]] = 0

            if counte[data["company"]] < 6:

                counte[data["company"]] = counte[data["company"]] + 1
                data["cs0"] = float(data["cs0"])
                if (data["userPhoto"] == None or data["userPhoto"] == ""):
                    data["userPhoto"] = "assets/altogether/images/avatar2.png"

                result.append(data)


        return result

    def automatic(self):

        raisecache = self.__rediscache__(1)

        raise_cs0 = raisecache.exists("cs0")
        raise_cs1 = raisecache.exists("cs1")
        raise_cs2 = raisecache.exists("cs2")
        raise_cs3 = raisecache.exists("cs3")
        raise_cs4 = raisecache.exists("cs4")
        raise_cs5 = raisecache.exists("cs5")
        raise_cs6 = raisecache.exists("cs6")
        raise_cs7 = raisecache.exists("cs7")
        raise_cs8 = raisecache.exists("cs8")
        raise_cs9 = raisecache.exists("cs9")
        raise_cs10 = raisecache.exists("cs10")
        raise_cs11 = raisecache.exists("cs11")

        self.getDBCursor()

        self.decorationtype()

        cs0 = self.cs0() # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
        cs1 = self.cs1() # 签单类型比例(饼状)
        cs2 = self.cs2() # 公司签单额排名(表格)
        cs3 = self.cs3() # 15 - 22 年各公司月签单额走势(折线)
        cs4 = self.cs4() # 15 - 22 年签单额对比(柱状)
        cs5 = self.cs5() # 签单总数(数字) 签单总额(数字)
        cs6 = self.cs6() # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)

        if raise_cs0 : raisecache.delete("cs0")
        if raise_cs1 : raisecache.delete("cs1")
        if raise_cs2 : raisecache.delete("cs2")
        if raise_cs3 : raisecache.delete("cs3")
        if raise_cs4 : raisecache.delete("cs4")
        if raise_cs5 : raisecache.delete("cs5")
        if raise_cs6 : raisecache.delete("cs6")

        raisecache.set("cs0", json.dumps(cs0), 22 * 60 * 60) # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
        raisecache.set("cs1", json.dumps(cs1), 22 * 60 * 60) # 签单类型比例(饼状)
        raisecache.set("cs2", json.dumps(cs2), 22 * 60 * 60) # 公司签单额排名(表格)
        raisecache.set("cs3", json.dumps(cs3), 22 * 60 * 60) # 15 - 22 年各公司月签单额走势(折线)
        raisecache.set("cs4", json.dumps(cs4), 22 * 60 * 60) # 15 - 22 年签单额对比(柱状)
        raisecache.set("cs5", json.dumps(cs5), 22 * 60 * 60) # 签单总额(数字) 签单总数(数字)
        raisecache.set("cs6", json.dumps(cs6), 22 * 60 * 60) # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)

        # 公司版
        cs7 = self.cs7()    # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
        cs8 = self.cs8()    # 15 - 22 月签单额走势(折线)
        cs9 = self.cs9()    # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)
        cs10 = self.cs10(0) # 签单设计排名TOP9
        cs11 = self.cs10(1) # 签单业务排名TOP9

        if raise_cs7 : raisecache.delete("cs7")
        if raise_cs8 : raisecache.delete("cs8")
        if raise_cs9 : raisecache.delete("cs9")
        if raise_cs10: raisecache.delete("cs10")
        if raise_cs11: raisecache.delete("cs11")

        raisecache.set("cs7", json.dumps(cs7), 22 * 60 * 60) # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
        raisecache.set("cs8", json.dumps(cs8), 22 * 60 * 60) # 15 - 22 月签单额走势(折线)
        raisecache.set("cs9", json.dumps(cs9), 22 * 60 * 60) # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)
        raisecache.set("cs10", json.dumps(cs10), 22 * 60 * 60)  # 签单设计排名TOP9
        raisecache.set("cs11", json.dumps(cs11), 22 * 60 * 60)  # 签单业务排名TOP9


if __name__ == '__main__':

    """
        1.脚本说明: 收集装修业绩首页图表数据
                key:    集团
                "cs0"  # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
                "cs3"  # 15 - 22 年各公司月签单额走势(折线)
                "cs6"  # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)

                        公司
                "cs7"  # 近12个月签单额走势(折线) 近12个月签单数走势(折线)
                "cs8"  # 15 - 22 月签单额走势(折线)
                "cs9"  # 近12个月设计户数走势(折线) 近12个月设计费走势(折线)
                "cs10" # 签单 设计/业务 排名TOP6

                       集团+公司
                "cs1"  # 签单类型比例(饼状)
                "cs2"  # 公司签单额排名(表格)
                "cs4"  # 15 - 22 年签单额对比(柱状)(明细)
                "cs5"  # 签单总额(数字) 签单总数(数字)(明细)

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_report_decorationAchievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    reportDecorationAchievement = reportDecorationAchievement(config.get("database"))

    getattr(reportDecorationAchievement, 'automatic')()
