# !/usr/bin/evn python
# -*- encoding: utf-8 -*-

from dateutil.relativedelta import relativedelta
import json
import os
import redis
import pymysql
import calendar
import datetime


class reportConstructionAchievement():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        self.rc = None
        self.type = {
            0: u"未开工",
            1: u"已开工",
            2: u"已完工"
        }

        self.today = datetime.datetime.now()  # 当天日期

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
        
    def constructionnode(self):
    
        sql = "SELECT cnid, name from data.constructionnode"

        self.cursor.execute(sql)
        nodes = self.cursor.fetchall()
        
        for node in nodes:
            self.type[node[0]] = node[1]

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

    def currentMonth(self, year, month):

        last_day = calendar.monthrange(year, month)[1]
        start = datetime.date(year, month, 1)
        end = datetime.date(year, month, last_day)

        return start, end

    # 近12个月未开工数走势(折线)
    def cs0(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs0 ), rd.year, rd.month, rd.company, c.name FROM report.construction7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7Constructions = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs0', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for decoration7Construction in decoration7Constructions:

            data = dict(zip(fields, decoration7Construction))
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

    # 近12个月开工数走势(折线)
    def cs1(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs1 ), rd.year, rd.month, rd.company, c.name FROM report.construction7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7Constructions = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs1', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for decoration7Construction in decoration7Constructions:

            data = dict(zip(fields, decoration7Construction))
            data['cs1'] = float(data['cs1'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs1"], 0)  # 补充没有的数据
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
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs1"], 0)

    # 近12个月完工数走势(折线)
    def cs2(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( rd.cs2 ), rd.year, rd.month, rd.company, c.name FROM report.construction7achievement rd, communion.company c WHERE rd.company = c.cid AND cs0 != 0 AND (( rd.year >= %s AND rd.month >= %s ) OR ( rd.year = %s AND rd.month <= %s ) ) GROUP BY rd.company, rd.YEAR, rd.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        decoration7Constructions = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs2', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        for decoration7Construction in decoration7Constructions:

            data = dict(zip(fields, decoration7Construction))
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

    # 各施工节点数(数字)
    def cs3(self):

        sql = "SELECT d.company,c.schedule, count(cid) FROM construction.construction c, decoration.decoration d WHERE c.orderId = d.orderId GROUP BY d.company, c.schedule;"

        self.cursor.execute(sql)

        decoration7Constructions = self.cursor.fetchall()

        result = []
        fields = ['company', 'schedule','count']

        for decoration7Construction in decoration7Constructions:

            data = dict(zip(fields, decoration7Construction))

            data['company'] = float(data['company'])
            data['schedule'] = float(data['schedule'])
            data['name'] = self.type[int(data['schedule'])]
            data['count'] = float(data['count'])

            result.append(data)

        return result
    # 签单排名TOP9
    def cs4(self):

        today = self.today  # 当天日期

        startTime, endTime = self.currentMonth(today.year, today.month)

        sql = "SELECT u.userPhoto,u.currentName, dm.NAME,com.name,u.company FROM communion.user u,communion.department dm, construction.construction c, communion.company com WHERE c.suid = u.uid AND u.deptId = dm.dId AND u.company = com.cid AND c.createTime >  '%s 00:00:00' AND c.createTime <  '%s 00:00:00' GROUP BY u.userName ASC;"

        self.cursor.execute(sql % (startTime, endTime))

        decoration7achievements = self.cursor.fetchall()

        result = []
        counte = {}
        fields = ['userPhoto', 'currentName','department','cName','company']
        for decoration7achievement in decoration7achievements:

            data = dict(zip(fields, decoration7achievement))

            if not data["company"] in counte: counte[data["company"]] = 0

            if counte[data["company"]] < 6:

                counte[data["company"]] = counte[data["company"]] + 1
                if (data["userPhoto"] == None or data["userPhoto"] == ""):
                    data["userPhoto"] = "assets/altogether/images/avatar2.png"

                result.append(data)


        return result

    def automatic(self):

        raisecache = self.__rediscache__(1)

        raise_cs0 = raisecache.exists("ccs0")
        raise_cs1 = raisecache.exists("ccs1")
        raise_cs2 = raisecache.exists("ccs2")
        raise_cs3 = raisecache.exists("ccs3")
        raise_cs4 = raisecache.exists("ccs4")

        self.getDBCursor()
        
        self.constructionnode()

        ccs0 = self.cs0()  # 近12个月未开工数走势(折线)
        ccs1 = self.cs1()   #近12个月开工数走势(折线)
        ccs2 = self.cs2()  # 近12个月完工数走势(折线)
        ccs3 = self.cs3()  # 各施工节点数(数字)
        ccs4 = self.cs4()  # top

        if raise_cs0: raisecache.delete("ccs0")
        if raise_cs1: raisecache.delete("ccs1")
        if raise_cs2: raisecache.delete("ccs2")
        if raise_cs3: raisecache.delete("ccs3")
        if raise_cs4: raisecache.delete("ccs4")

        raisecache.set("ccs0", json.dumps(ccs0), 22 * 60 * 60)  # 近12个月销售单数量走势(折线)
        raisecache.set("ccs1", json.dumps(ccs1), 22 * 60 * 60)  # 近12个月补款总额走势(折线)
        raisecache.set("ccs2", json.dumps(ccs2), 22 * 60 * 60)  # 近12个月退货数量走势(折线)
        raisecache.set("ccs3", json.dumps(ccs3), 22 * 60 * 60)  # 各施工节点数(数字)
        raisecache.set("ccs4", json.dumps(ccs4), 22 * 60 * 60)  # TOP

if __name__ == '__main__':
    """
        1.脚本说明: 收集装修业绩首页图表数据
                key:    集团
                "ccs0"  # 近12个月未开工数走势(折线)
                "ccs1"  # 近12个月开工数走势(折线)
                "ccs2"  # 近12个月完工数走势(折线)
                "ccs3"  # 各施工节点数(数字)
                "ccs4"  # 各施工节点数(数字)

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_report_counstruction_collecter.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    reportConstructionAchievement = reportConstructionAchievement(config.get("database"))

    getattr(reportConstructionAchievement, 'automatic')()
