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


class approval7Achievement():
    # 总数 / 创建数量
    SQL_QUERY_COUNTSALESFORACHIEVEMENT1 = """
        SELECT
            apr.type,
            apr.company,
            COUNT(*) AS cs0,
            COUNT(*) AS cs1
        FROM
            approval.approval apr
        WHERE
            apr.createTime >= '%s 00:00:00'
            AND apr.createTime <= '%s 23:59:59'
            %s
        GROUP BY
            apr.company,
            apr.type;
        """

    # 未处理数量
    SQL_QUERY_COUNTSALESFORACHIEVEMENT2 = """
        SELECT
            apr.type,
            apr.company,
            COUNT(*) AS cs2
        FROM
            approval.approval apr
        WHERE
            apr.status = 3
            AND apr.createTime >= '%s 00:00:00'
            AND apr.createTime <= '%s 23:59:59'
            %s
        GROUP BY
            apr.company,
            apr.type;
        """

    # 通过数量
    SQL_QUERY_COUNTSALESFORACHIEVEMENT3 = """
        SELECT
            apr.type,
            apr.company,
            COUNT(*) AS cs3
        FROM
            approval.approval apr
        WHERE
            apr.status = 1
            AND apr.createTime >= '%s 00:00:00'
            AND apr.createTime <= '%s 23:59:59'
            %s
        GROUP BY
            apr.company,
            apr.type;
        """

    # 驳回数量
    SQL_QUERY_COUNTSALESFORACHIEVEMENT4 = """
        SELECT
            apr.type,
            apr.company,
            COUNT(*) AS cs4
        FROM
            approval.approval apr
        WHERE
            apr.status = 2
            AND apr.createTime >= '%s 00:00:00'
            AND apr.createTime <= '%s 23:59:59'
            %s
        GROUP BY
            apr.company,
            apr.type;
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

    def query1approval7Achievement(self, startTime, endTime, company):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT1 % (startTime, endTime, self.company(u"apr.company", company))
        self.cursor.execute(sql)

        approval7Achievements = self.cursor.fetchall()

        result = []
        fields = ["type", "company", "cs0", "cs1"]

        for approval7Achievement in approval7Achievements:
            _ = dict(zip(fields, approval7Achievement))

            result.append(_)

        return result

    def query2approval7Achievement(self, startTime, endTime, company, approval7Achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT2 % (startTime, endTime, self.company(u"apr.company", company))

        self.cursor.execute(sql)

        approval7Achievements = self.cursor.fetchall()
        fields = ["type", "company", "cs2"]

        for approval7Achievement in approval7Achievements:
            _ = dict(zip(fields, approval7Achievement))
            index = 0

            for approval7Achievement1 in approval7Achievements1:
                if (_['type'] == approval7Achievement1['type'] and _['company'] == approval7Achievement1['company']):
                    index = 1
                    approval7Achievement1.update(_)

            if (index == 0):
                approval7Achievements1.append(_)

        return approval7Achievements1

    def query3approval7Achievement(self, startTime, endTime, company, approval7Achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT3 % (startTime, endTime, self.company(u"apr.company", company))

        self.cursor.execute(sql)

        approval7Achievements = self.cursor.fetchall()
        fields = ["type", "company", "cs3"]

        for approval7Achievement in approval7Achievements:
            _ = dict(zip(fields, approval7Achievement))
            index = 0

            for approval7Achievement1 in approval7Achievements1:
                if (_['type'] == approval7Achievement1['type'] and _['company'] == approval7Achievement1['company']):
                    index = 1
                    approval7Achievement1.update(_)

            if (index == 0):
                approval7Achievements1.append(_)

        return approval7Achievements1

    def query4approval7Achievement(self, startTime, endTime, company, approval7Achievements1):

        sql = self.SQL_QUERY_COUNTSALESFORACHIEVEMENT4 % (startTime, endTime, self.company(u"apr.company", company))

        self.cursor.execute(sql)

        approval7Achievements = self.cursor.fetchall()
        fields = ["type", "company", "cs4"]

        for approval7Achievement in approval7Achievements:
            _ = dict(zip(fields, approval7Achievement))
            index = 0

            for approval7Achievement1 in approval7Achievements1:
                if (_['type'] == approval7Achievement1['type'] and _['company'] == approval7Achievement1['company']):
                    index = 1
                    approval7Achievement1.update(_)

            if (index == 0):
                approval7Achievements1.append(_)

        return approval7Achievements1


    def update1approval7Achievement(self, approval7Achievements1, year, month):

        fields = ["year", "month"]

        for approval7Achievements in approval7Achievements1:
            approval7Achievements.update(dict(zip(fields, (year, month))))

            keys = []
            values = []

            for key in approval7Achievements:
                keys.append(key)
                values.append(str(int(approval7Achievements[key] if approval7Achievements[key] else 0)))

            sql = "REPLACE INTO report.approval7Achievement (%s) VALUES (%s);" % (",".join(keys), ",".join(values))

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
            start = datetime.datetime(year, month, 1) + relativedelta(months=count + week * offset)
            # 执行时间截止到当前年月份
            if start > today: break

            if count >= offset: break

            startTime, endTime = self.currentMonth(start.year, start.month)

            # 更新设计分区业绩
            approval7Achievements1 = self.query1approval7Achievement(startTime, endTime, company)
            approval7Achievements1 = self.query2approval7Achievement(startTime, endTime, company, approval7Achievements1)
            approval7Achievements1 = self.query3approval7Achievement(startTime, endTime, company, approval7Achievements1)
            approval7Achievements1 = self.query4approval7Achievement(startTime, endTime, company, approval7Achievements1)
            self.update1approval7Achievement(approval7Achievements1, start.year, start.month)

            count = count + 1

            time.sleep(2)

        self.closeDBConnect()

    def manual(self, year, month, company):

        self.getDBCursor()
        startTime, endTime = self.currentMonth(year, month)

        approval7Achievements1 = self.query1approval7Achievement(startTime, endTime, company)
        approval7Achievements1 = self.query2approval7Achievement(startTime, endTime, company, approval7Achievements1)
        approval7Achievements1 = self.query3approval7Achievement(startTime, endTime, company, approval7Achievements1)
        approval7Achievements1 = self.query4approval7Achievement(startTime, endTime, company, approval7Achievements1)
        self.update1approval7Achievement(approval7Achievements1, year, month)

        self.closeDBConnect()


if __name__ == '__main__':

    """
        1.脚本说明: 每2秒,以当前星期为判断更新20个月的装修业绩进行统计

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_approval7Achievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    approval7Achievement = approval7Achievement(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"
    if callback == 'automatic':

        company = sys.argv[2]
        getattr(approval7Achievement, callback)(company)

    elif callback == 'manual':

        year = sys.argv[2]
        month = sys.argv[3]
        company = sys.argv[4]

        getattr(approval7Achievement, callback)(int(year), int(month), company)
    elif callback == 'help':
        print('python es_approval7Achievement_replace.py automatic <company>')
        print('python es_approval7Achievement_replace.py manual <year> <month> <company>')
    else:
        sys.exit()
