# !/usr/bin/evn python
# -*- encoding: utf-8 -*-

from dateutil.relativedelta import relativedelta
import json
import os
import redis
import pymysql
import datetime


class reportApprovalAchievement():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        self.rc = None

        self.today = datetime.datetime.now()  # 当天日期
        self.approvalType = {
            1: u"客户信息修改",
            2: u"订单房产信息修改",
            3: u"订单归属信息修改",
            4: u"报价折扣修改",
            5: u"订单退款",
            6: u"主材退货",
            7: u"主材场外退款",
            8: u"活动物品申领",
            9: u"主材补款提交",
            10: u"销售退货",
            11: u"商品库存调拨",
            12: u"销售补款提交",
            13: u"人资",
            14: u"客源转装修单",
            15: u"归属",
            16: u"装修满减修改",
            17: u"客源初审",
            18: u"销售不退定金",
        }

    def openDBConnect(self):
        self.dbconn = pymysql.connect(host=self.host,user=self.username,password=self.password, charset=self.charset)

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

                if list[len(list) - 1]["year"] == self.today.year and list[len(list) - 1][
                    "month"] == self.today.month: return list

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

    # 近12个月创建数量走势(折线)
    def cs1(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( ra.cs1 ), ra.year, ra.month, ra.company, c.name FROM report.approval7achievement ra, communion.company c WHERE ra.company = c.cid AND cs1 != 0 AND (( ra.year >= %s AND ra.month >= %s ) OR ( ra.year = %s AND ra.month <= %s ) ) GROUP BY ra.company, ra.YEAR, ra.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))

        approval7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs1', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (approval7achievements == ()):
            return result

        for approval7achievement in approval7achievements:

            data = dict(zip(fields, approval7achievement))
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

    # 各类型审批总数(柱状)
    def cs2(self):

        sql = "SELECT SUM( cs0 ), type FROM report.approval7achievement WHERE cs0 !=0 GROUP BY type;"

        self.cursor.execute(sql)
        approval7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'type']

        for approval7achievement in approval7achievements:

            data = dict(zip(fields, approval7achievement))
            data['cs0'] = float(data['cs0'])
            data['name'] = self.approvalType[int(data['type'])]
            data['type'] = int(data['type'])

            result.append(data)

        return result

    # 近12个月通过数量走势(折线)
    def cs3(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( ra.cs3 ), ra.year, ra.month, ra.company, c.name FROM report.approval7achievement ra, communion.company c WHERE ra.company = c.cid AND cs3 != 0 AND (( ra.year >= %s AND ra.month >= %s ) OR ( ra.year = %s AND ra.month <= %s ) ) GROUP BY ra.company, ra.YEAR, ra.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        approval7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs3', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (approval7achievements == ()):
            return result

        for approval7achievement in approval7achievements:

            data = dict(zip(fields, approval7achievement))
            data['cs3'] = float(data['cs3'])

            if cid != data["company"]:
                cid = data["company"]
                year = start2.year
                month = start2.month
                if result:
                    result = self.supplement(result, ["cs3"], 0)  # 补充没有的数据
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
                    data2['cs3'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs3"], 0)

    # 近12个月驳回数量走势(折线)
    def cs4(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM( ra.cs4 ), ra.year, ra.month, ra.company, c.name FROM report.approval7achievement ra, communion.company c WHERE ra.company = c.cid AND cs4 != 0 AND (( ra.year >= %s AND ra.month >= %s ) OR ( ra.year = %s AND ra.month <= %s ) ) GROUP BY ra.company, ra.YEAR, ra.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))
        approval7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs4', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (approval7achievements == ()):
            return result

        for approval7achievement in approval7achievements:

            data = dict(zip(fields, approval7achievement))
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

    # 集团版各类型审批总数(表格)
    def cs5(self):

        sql = "SELECT SUM( cs0 ), type FROM report.approval7achievement WHERE cs0 !=0 GROUP BY type;"

        self.cursor.execute(sql)
        approval7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'type']

        for approval7achievement in approval7achievements:

            data = dict(zip(fields, approval7achievement))
            data['cs0'] = float(data['cs0'])
            data['name'] = self.approvalType[int(data['type'])]
            data['type'] = int(data['type'])

            result.append(data)

        return result

    # 总数/未处理/通过/驳回总数(数字)
    def cs6(self):

        sql = "SELECT SUM(cs0), SUM(cs2), SUM(cs3), SUM(cs4), company  FROM report.approval7achievement GROUP BY company;"
        self.cursor.execute(sql)

        approval7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs2', 'cs3', 'cs4', 'company']

        for approval7achievement in approval7achievements:
            data = dict(zip(fields, approval7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs2'] = float(data['cs2'])
            data['cs3'] = float(data['cs3'])
            data['cs4'] = float(data['cs4'])

            result.append(data)

        return result

    # 公司版各类型审批总数(表格)
    def cs7(self):

        sql = "SELECT SUM( cs0 ), type, ra.company FROM report.approval7achievement ra, communion.company c WHERE ra.company = c.cid AND cs0 !=0 GROUP BY ra.company, type"

        self.cursor.execute(sql)
        approval7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'type', 'company']

        for approval7achievement in approval7achievements:
            data = dict(zip(fields, approval7achievement))
            data['cs0'] = float(data['cs0'])
            data['name'] = self.approvalType[int(data['type'])]
            data['type'] = int(data['type'])

            result.append(data)

        return result

    def automatic(self):

        raisecache = self.__rediscache__(1)

        raise_cs1 = raisecache.exists("acs0")
        raise_cs3 = raisecache.exists("acs1")
        raise_cs4 = raisecache.exists("acs2")
        raise_cs2 = raisecache.exists("acs3")
        raise_cs5 = raisecache.exists("acs4")
        raise_cs6 = raisecache.exists("acs5")
        raise_cs7 = raisecache.exists("acs6")

        self.getDBCursor()

        acs0 = self.cs1()  # 近12个月创建数量走势(折线)
        acs1 = self.cs3()  # 近12个月通过数量走势(折线)
        acs2 = self.cs4()  # 近12个月驳回数量走势(折线)
        acs3 = self.cs2()  # 各类型审批总数(柱状)
        acs4 = self.cs5()  # 集团版各类型审批总数(表格)
        acs5 = self.cs6()  # 总数/未处理/通过/驳回总数(数字)
        acs6 = self.cs7()  # 公司版各类型审批总数(表格)

        if raise_cs1: raisecache.delete("acs0")
        if raise_cs3: raisecache.delete("acs1")
        if raise_cs4: raisecache.delete("acs2")
        if raise_cs2: raisecache.delete("acs3")
        if raise_cs5: raisecache.delete("acs4")
        if raise_cs6: raisecache.delete("acs5")
        if raise_cs7: raisecache.delete("acs6")

        raisecache.set("acs0", json.dumps(acs0), 22 * 60 * 60)  # 近12个月创建数量走势(折线)
        raisecache.set("acs1", json.dumps(acs1), 22 * 60 * 60)  # 近12个月通过数量走势(折线)
        raisecache.set("acs2", json.dumps(acs2), 22 * 60 * 60)  # 近12个月驳回数量走势(折线)
        raisecache.set("acs3", json.dumps(acs3), 22 * 60 * 60)  # 各类型审批总数(柱状)
        raisecache.set("acs4", json.dumps(acs4), 22 * 60 * 60)  # 集团版各类型审批总数(表格)
        raisecache.set("acs5", json.dumps(acs5), 22 * 60 * 60)  # 总数/未处理/通过/驳回总数(数字)
        raisecache.set("acs6", json.dumps(acs6), 22 * 60 * 60)  # 公司版各类型审批总数(表格)

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

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_report_sales_collecter.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    reportApprovalAchievement = reportApprovalAchievement(config.get("database"))

    getattr(reportApprovalAchievement, 'automatic')()
