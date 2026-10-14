# !/usr/bin/evn python
# -*- encoding: utf-8 -*-

from dateutil.relativedelta import relativedelta
import json
import os
import redis
import pymysql
import datetime


class reportUserAchievement():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        self.rc = None

        self.today = datetime.datetime.now()  # 当天日期
        self.userType = {
            0: u"女",
            1: u"男"
        }
        self.educationType = {
            0: u"小学及以下",
            1: u"初中",
            2: u"中专",
            3: u"高中",
            4: u"大专",
            5: u"本科",
            6: u"研究生及以上"
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
            self.rc = redis.Redis(connection_pool=redis.ConnectionPool(host=redis_config.get("host"),password=redis_config.get("password"), db=db, decode_responses=True))
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

    # 人员公司总数(表格)
    def cs0(self):

        sql = "SELECT SUM(ru.cs0), ru.company, c.name FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid  GROUP BY ru.company ORDER BY SUM(ru.cs0) DESC;"

        self.cursor.execute(sql)
        user7achievements = self.cursor.fetchall()
        result = []
        fields = ['cs0', 'company', 'name']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))
            data['cs0'] = float(data['cs0'])

            result.append(data)

        result.append({'cs0': 0, 'company': -1, 'name': '占位'})

        return result

    # 在职/离职/总人数(数字)
    def cs1(self):

        sql = "SELECT SUM(cs0), SUM(cs1), SUM(cs2) FROM report.user7achievement;"
        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs1', 'cs2']

        for user7achievement in user7achievements:

            data = dict(zip(fields, user7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs1'] = float(data['cs1'])
            data['cs2'] = float(data['cs2'])
            result.append(data)

        return result

    # 在离职总数(饼状)
    def cs2(self):

        sql = "SELECT SUM(cs0), SUM(cs1), SUM(cs2), c.name  FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs1', 'cs2', 'cname']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs1'] = float(data['cs1'])
            data['cs2'] = float(data['cs2'])

            result.append(data)

        return result

    # 近12个月人员入职人数走势(折线)
    def cs3(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(ru.cs3), ru.year, ru.month, ru.company, c.name FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid AND cs3 != 0 AND (( ru.year >= %s AND ru.month >= %s ) OR ( ru.year = %s AND ru.month <= %s ) ) GROUP BY ru.company, ru.YEAR, ru.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))

        user7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs3', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (user7achievements == ()):
            return result

        for user7achievement in user7achievements:

            data = dict(zip(fields, user7achievement))
            data['cs3'] = float(data['cs3'])

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
                    data2['cs3'] = 0
                    data2['year'] = year
                    data2['month'] = month
                    data2['company'] = cid
                    data2['name'] = data['name']

                    result.append(data2)
                    data2 = {}

        return self.supplement(result, ["cs3"], 0)

    # 近12个月人员离职人数走势(折线)
    def cs4(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(ru.cs4), ru.year, ru.month, ru.company, c.name FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid AND cs4 != 0 AND (( ru.year >= %s AND ru.month >= %s ) OR ( ru.year = %s AND ru.month <= %s ) ) GROUP BY ru.company, ru.YEAR, ru.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))

        user7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs4', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (user7achievements == ()):
            return result

        for user7achievement in user7achievements:

            data = dict(zip(fields, user7achievement))
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

    # 近12个月调职人数走势(折线)
    def cs5(self):

        today = self.today  # 当天日期
        start = datetime.datetime(today.year, today.month, 1) - relativedelta(months=11)

        sql = "SELECT SUM(ru.cs5), ru.year, ru.month, ru.company, c.name FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid AND cs5 != 0 AND (( ru.year >= %s AND ru.month >= %s ) OR ( ru.year = %s AND ru.month <= %s ) ) GROUP BY ru.company, ru.YEAR, ru.MONTH;"

        self.cursor.execute(sql % (start.year, start.month, today.year, today.month))

        user7achievements = self.cursor.fetchall()

        cid = -1
        data2 = {}
        result = []
        fields = ['cs5', 'year', 'month', 'company', 'name']
        start2 = datetime.datetime(today.year, today.month, 1) - relativedelta(months=12)

        if (user7achievements == ()):
            return result

        for user7achievement in user7achievements:

            data = dict(zip(fields, user7achievement))
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

    # 人员工龄分布(柱状)
    def cs6(self):

        sql = "SELECT COUNT(*) j, info.jobYears FROM communion.userinfo info GROUP BY info.jobYears;"

        self.cursor.execute(sql)
        user7achievement = self.cursor.fetchall()

        result = []
        fields = ['j', 'jobYears']

        for user7achievement in user7achievement:
            data = dict(zip(fields, user7achievement))
            data['j'] = float(data['j'])
            data['jobYears'] = int(data['jobYears'])

            result.append(data)

        return result

    # 性别分布(饼状)
    def cs7(self):

        sql = "SELECT info.gender, COUNT(*) u FROM communion.userinfo info WHERE info.gender = 0 OR info.gender = 1 GROUP BY info.gender;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['gender', 'u']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['u'] = float(data['u'])
            data['name'] = self.userType[int(data['gender'])]
            data['gender'] = int(data['gender'])

            result.append(data)

        return result

    # 人员学历分布(饼状)
    def cs8(self):

        sql = "SELECT COUNT(*) e, info.education FROM communion.userinfo info GROUP BY info.education;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['e', 'education']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['e'] = float(data['e'])
            data['name'] = self.educationType[int(data['education'])]
            data['education'] = int(data['education'])

            result.append(data)

        return result

    # 公司
    # 在职/离职/总人数(数字)
    def cs10(self):

        sql = "SELECT SUM(cs0), SUM(cs1), SUM(cs2), ru.company FROM report.user7achievement ru GROUP BY ru.company"
        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs0', 'cs1', 'cs2', 'company']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['cs0'] = float(data['cs0'])
            data['cs1'] = float(data['cs1'])
            data['cs2'] = float(data['cs2'])
            result.append(data)

        return result

    # 公司
    # 在离职数(饼状)
    def cs11(self):

        sql = "SELECT SUM(cs1), SUM(cs2), c.name, ru.company  FROM report.user7achievement ru, communion.company c WHERE ru.company = c.cid GROUP BY ru.company;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['cs1', 'cs2', 'cname', 'company']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['cs1'] = float(data['cs1'])
            data['cs2'] = float(data['cs2'])

            result.append(data)

        return result

    # 公司
    # 人员工龄分布(柱状)
    def cs15(self):

        sql = "SELECT COUNT(*) j, info.jobYears,company FROM communion.userinfo info,communion.user u  WHERE info.uid = u.uid GROUP BY u.company, info.jobYears;"

        self.cursor.execute(sql)
        user7achievement = self.cursor.fetchall()

        result = []
        fields = ['j', 'jobYears', 'company']

        for user7achievement in user7achievement:
            data = dict(zip(fields, user7achievement))
            data['j'] = float(data['j'])
            data['jobYears'] = int(data['jobYears'])

            result.append(data)

        return result

    # 公司
    # 性别分布(饼状)
    def cs16(self):

        sql = "SELECT info.gender, COUNT(*) u, u.company FROM communion.userinfo info, communion.user u WHERE info.uid = u.uid GROUP BY u.company , info.gender;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['gender', 'u', 'company']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['u'] = float(data['u'])
            data['name'] = self.userType[int(data['gender'])]
            data['gender'] = int(data['gender'])

            result.append(data)

        return result

    # 公司
    # 人员学历分布(饼状)
    def cs17(self):

        sql = "SELECT COUNT(*) e, info.education, u.company FROM communion.userinfo info, communion.user u WHERE info.uid = u.uid GROUP BY u.company, info.education;"

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ['e', 'education', 'company']

        for user7achievement in user7achievements:
            data = dict(zip(fields, user7achievement))

            data['e'] = float(data['e'])
            data['name'] = self.educationType[int(data['education'])]
            data['education'] = int(data['education'])

            result.append(data)

        return result


    def automatic(self):

        raisecache = self.__rediscache__(1)

        raise_cs0 = raisecache.exists("ucs0")
        raise_cs1 = raisecache.exists("ucs1")
        raise_cs2 = raisecache.exists("ucs2")
        raise_cs3 = raisecache.exists("ucs3")
        raise_cs4 = raisecache.exists("ucs4")
        raise_cs5 = raisecache.exists("ucs5")
        raise_cs6 = raisecache.exists("ucs6")
        raise_cs7 = raisecache.exists("ucs7")
        raise_cs8 = raisecache.exists("ucs8")

        raise_cs10 = raisecache.exists("ucs10")
        raise_cs11 = raisecache.exists("ucs11")
        raise_cs15 = raisecache.exists("ucs15")
        raise_cs16 = raisecache.exists("ucs16")
        raise_cs17 = raisecache.exists("ucs17")


        self.getDBCursor()

        ucs0 = self.cs0()  # 人员公司总数(表格)
        ucs1 = self.cs1()  # 在职/离职/总人数(数字)
        ucs2 = self.cs2()  # 在离职总数(饼状)
        ucs3 = self.cs3()  # 近12个月人员离职人数走势(折线)
        ucs4 = self.cs4()  # 近12个月人员离职人数走势(折线)
        ucs5 = self.cs5()  # 近12个月人员离职人数走势(折线)
        ucs6 = self.cs6()  # 人员工龄分布(柱状)
        ucs7 = self.cs7()  # 性别分布(饼状)
        ucs8 = self.cs8()  # 人员学历分布(饼状)

        ucs10 = self.cs10()  # 公司在职/离职/总人数(数字)
        ucs11 = self.cs11()  # 公司在离职数(饼状)
        ucs15 = self.cs15()  # 公司人员工龄分布(柱状)
        ucs16 = self.cs16()  # 公司性别分布(饼状)
        ucs17 = self.cs17()  # 公司人员学历分布(饼状)

        if raise_cs0 : raisecache.delete("ucs0")
        if raise_cs1 : raisecache.delete("ucs1")
        if raise_cs2 : raisecache.delete("ucs2")
        if raise_cs3 : raisecache.delete("ucs3")
        if raise_cs4 : raisecache.delete("ucs4")
        if raise_cs5 : raisecache.delete("ucs5")
        if raise_cs6 : raisecache.delete("ucs6")
        if raise_cs7 : raisecache.delete("ucs7")
        if raise_cs8 : raisecache.delete("ucs8")

        if raise_cs10: raisecache.delete("ucs10")
        if raise_cs11: raisecache.delete("ucs11")
        if raise_cs15: raisecache.delete("ucs15")
        if raise_cs16: raisecache.delete("ucs16")
        if raise_cs17: raisecache.delete("ucs17")

        raisecache.set("ucs0", json.dumps(ucs0), 22 * 60 * 60)  # 人员公司总数(表格)
        raisecache.set("ucs1", json.dumps(ucs1), 22 * 60 * 60)  # 在职/离职/总人数(数字)
        raisecache.set("ucs2", json.dumps(ucs2), 22 * 60 * 60)  # 在离职总数(饼状)
        raisecache.set("ucs3", json.dumps(ucs3), 22 * 60 * 60)  # 近12个月人员入职人数走势(折线)
        raisecache.set("ucs4", json.dumps(ucs4), 22 * 60 * 60)  # 近12个月人员离职人数走势(折线)
        raisecache.set("ucs5", json.dumps(ucs5), 22 * 60 * 60)  # 近12个月人员调职人数走势(折线)
        raisecache.set("ucs6", json.dumps(ucs6), 22 * 60 * 60)  # 人员工龄分布(柱状)
        raisecache.set("ucs7", json.dumps(ucs7), 22 * 60 * 60)  # 性别分布(饼状)
        raisecache.set("ucs8", json.dumps(ucs8), 22 * 60 * 60)  # 人员学历分布(饼状)

        raisecache.set("ucs10", json.dumps(ucs10), 22 * 60 * 60)  # 公司在职/离职/总人数(数字)
        raisecache.set("ucs11", json.dumps(ucs11), 22 * 60 * 60)  #  公司在离职数(饼状)
        raisecache.set("ucs15", json.dumps(ucs15), 22 * 60 * 60)  # 公司人员工龄分布(柱状)
        raisecache.set("ucs16", json.dumps(ucs16), 22 * 60 * 60)  # 公司性别分布(饼状)
        raisecache.set("ucs17", json.dumps(ucs17), 22 * 60 * 60)  # 公司人员学历分布(饼状)



if __name__ == '__main__':

    """
        1.脚本说明: 收集人资状态统计首页图表数据
                key:    集团
                "ucs0"  # 人员公司总数(表格)
                "ucs1"  # 在职/离职/总人数(数字)
                "ucs2"  # 在离职总数(饼状)
                "ucs3"  # 近12个月人员入职人数走势(折线)
                "ucs4"  # 近12个月人员离职人数走势(折线)
                "ucs5"  # 近12个月人员调职人数走势(折线)
                "ucs6"  # 人员工龄分布(柱状)
                "ucs7"  # 性别分布(饼状)
                "ucs8"  # 人员学历分布(饼状)
                
                        公司
                "ucs10"  # 公司在职/离职/总人数(数字)
                "ucs11"  # 公司在离职数(饼状)
                "ucs15"  # 人员工龄分布(柱状)
                "ucs16"  # 公司性别分布(饼状)
                "ucs17"  # 公司人员学历分布(饼状)

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_report_user_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    reportUserAchievement = reportUserAchievement(config.get("database"))

    getattr(reportUserAchievement, 'automatic')()