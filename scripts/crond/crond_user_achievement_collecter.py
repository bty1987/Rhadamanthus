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


class User7achievement():
    # 总数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT1 = """
        SELECT
            u.company,
            COUNT(*) AS cs0
        FROM
            communion.userinfo info,
            communion.user u
        WHERE
            info.uid = u.uid
            AND info.entryTime > '%s 00:00:00'
            AND info.entryTime < '%s 23:59:59'
            %s
        GROUP BY
            u.company;
        """

    # 在职总数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT2 = """
        SELECT
            u.company,
            COUNT(*) AS cs1
        FROM
            communion.userinfo info,
            communion.user u
        WHERE
            info.uid = u.uid
            AND u.`status` = 0
            AND info.entryTime > '%s 00:00:00'
            AND info.entryTime < '%s 23:59:59'
            %s
        GROUP BY
            u.company;
        """

    # 离职总数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT3 = """
        SELECT
            u.company,
            COUNT(*) AS cs2
        FROM
            communion.userinfo info,
            communion.user u
        WHERE
            info.uid = u.uid
            AND u.`status` = 1
            AND info.entryTime > '%s 00:00:00'
            AND info.entryTime < '%s 23:59:59'
            %s
        GROUP BY
            u.company;
        """

    # 入职人数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT4 = """
        SELECT
            u.company,
            COUNT(*) AS cs3
        FROM
            communion.userinfo info,
            communion.user u,
            communion.recruitment r
        WHERE
            info.uid = u.uid
            AND r.name = u.userName
            AND r.`status` = 1
            AND info.entryTime > '%s 00:00:00'
            AND info.entryTime < '%s 23:59:59'
            %s
        GROUP BY
            u.company;
        """

    # 离职人数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT5 = """
        SELECT
            u.company,
            COUNT(*) AS cs4
        FROM
            communion.userinfo info,
            communion.user u
        WHERE
            info.uid = u.uid
            AND u.`status` = 1
            AND info.entryTime > '%s 00:00:00'
            AND info.entryTime < '%s 23:59:59'
           %s
         GROUP BY
            u.company;
        """

    # 调职人数
    SQL_QUERY_COUNTUSERFORACHIEVEMENT6 = """
        SELECT
            u.company,
            COUNT(*) AS cs5
        FROM
            communion.user u,
            communion.userexperience e
        WHERE
            u.uid = e.uid
            AND e.type = "调职"
            AND e.createTime > '%s 00:00:00'
            AND e.createTime < '%s 23:59:59'
            %s
        GROUP BY
            u.company;
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

    def query1user7achievement(self, startTime, endTime, company):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT1 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        result = []
        fields = ["company", "cs0"]
        
        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))

            if (_['company'] == None):
                return result

            result.append(_)

        return result

    def query2user7achievement(self, startTime, endTime, company, user7achievements1):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT2 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        fields = [ "company", "cs1"]

        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))
            index = 0

            if (_['company'] == None):
                return user7achievements1

            for user7achievement1 in user7achievements1:
                if (_['company'] == user7achievement1['company']):
                    index = 1
                    user7achievement1.update(_)

            if(index == 0):
                user7achievements1.append(_)

        return user7achievements1

    def query3user7achievement(self, startTime, endTime, company, user7achievements1):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT3 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)


        user7achievements = self.cursor.fetchall()

        fields = ["company", "cs2"]

        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))
            index = 0

            if (_['company'] == None):
                return user7achievements1

            for user7achievement1 in user7achievements1:
                if (_['company'] == user7achievement1['company']):
                    index = 1
                    user7achievement1.update(_)

            if(index == 0):
                user7achievements1.append(_)

        return user7achievements1

    def query4user7achievement(self, startTime, endTime, company, user7achievements1):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT4 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        fields = ["company", "cs3"]

        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))
            index = 0

            if (_['company'] == None):
                return user7achievements1

            for user7achievement1 in user7achievements1:
                if (_['company'] == user7achievement1['company']):
                    index = 1
                    user7achievement1.update(_)

            if(index == 0):
                user7achievements1.append(_)

        return user7achievements1

    def query5user7achievement(self, startTime, endTime, company, user7achievements1):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT5 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        fields = ["company", "cs4"]

        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))
            index = 0

            if (_['company'] == None):
                return user7achievements1

            for user7achievement1 in user7achievements1:
                if (_['company'] == user7achievement1['company']):
                    index = 1
                    user7achievement1.update(_)

            if (index == 0):
                user7achievements1.append(_)

        return user7achievements1

    def query6user7achievement(self, startTime, endTime, company, user7achievements1):

        sql = self.SQL_QUERY_COUNTUSERFORACHIEVEMENT6 % (startTime, endTime, self.company(u"u.company", company))

        self.cursor.execute(sql)

        user7achievements = self.cursor.fetchall()

        fields = ["company", "cs5"]

        for user7achievement in user7achievements:
            _ = dict(zip(fields, user7achievement))
            index = 0

            if (_['company'] == None):
                return user7achievements1

            for user7achievement1 in user7achievements1:
                if (_['company'] == user7achievement1['company']):
                    index = 1
                    user7achievement1.update(_)

            if (index == 0):
                user7achievements1.append(_)

        return user7achievements1
    
    def update1user7achievement(self, user7achievements1, year, month):

        fields = ["year", "month"]

        for user7achievements in user7achievements1:
            user7achievements.update(dict(zip(fields, (year, month))))

            keys = []
            values = []

            for key in user7achievements:
                keys.append(key)
                values.append(str(int(user7achievements[key] if user7achievements[key] else 0)))

            sql = "REPLACE INTO report.user7achievement (%s) VALUES (%s);" % (",".join(keys), ",".join(values))

            self.cursor.execute(sql)

            self.commit()

    def automatic(self, company):
        
        self.getDBCursor()

        year = 2015
        month = 1
        offset = 20
        count = 0

        # 当天日期
        today = datetime.datetime.now()
        # 获取星期几
        week = datetime.date(today.year, today.month, today.day).weekday()
        # week = 0

        while True:

            # 开始时间
            start = datetime.datetime(year, month, 1) + relativedelta(months = count + week * offset)

            # 执行时间截止到当前年月份
            if start > today: break

            if count >= offset: break

            startTime, endTime = self.currentMonth(start.year, start.month)

            # 更新人资状态统计
            user7achievements1 = self.query1user7achievement(startTime, endTime, company)
            user7achievements1 = self.query2user7achievement(startTime, endTime, company, user7achievements1)
            user7achievements1 = self.query3user7achievement(startTime, endTime, company, user7achievements1)
            user7achievements1 = self.query4user7achievement(startTime, endTime, company, user7achievements1)
            user7achievements1 = self.query5user7achievement(startTime, endTime, company, user7achievements1)
            user7achievements1 = self.query6user7achievement(startTime, endTime, company, user7achievements1)
            self.update1user7achievement(user7achievements1, start.year, start.month)

            count = count + 1

            time.sleep(2)# 延迟2S

        self.closeDBConnect()

    def manual(self, year, month, company):

        self.getDBCursor()
        startTime, endTime = self.currentMonth(year, month)

        user7achievements1 = self.query1user7achievement(startTime, endTime, company)
        user7achievements1 = self.query2user7achievement(startTime, endTime, company, user7achievements1)
        user7achievements1 = self.query3user7achievement(startTime, endTime, company, user7achievements1)
        user7achievements1 = self.query4user7achievement(startTime, endTime, company, user7achievements1)
        user7achievements1 = self.query5user7achievement(startTime, endTime, company, user7achievements1)
        user7achievements1 = self.query6user7achievement(startTime, endTime, company, user7achievements1)
        self.update1user7achievement(user7achievements1, year, month)

        self.closeDBConnect()

if __name__ == '__main__':

    """
        1.脚本说明: 每2秒,以当前星期为判断更新20个月的装修业绩进行统计

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_decoration7achievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    user7achievement = User7achievement(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"

    if callback == 'automatic':
    
        company = sys.argv[2]
        # company = 0
    
        getattr(user7achievement, callback)(company)

    elif callback == 'manual':
    
        year = sys.argv[2]
        month = sys.argv[3]
        company = sys.argv[4]
    
        getattr(user7achievement, callback)(int(year), int(month), company)
    elif callback == 'help':
        print ('python es_decoration7achievement_replace.py automatic <company>')
        print ('python es_decoration7achievement_replace.py manual <year> <month> <company>')
    else:
        sys.exit()
    