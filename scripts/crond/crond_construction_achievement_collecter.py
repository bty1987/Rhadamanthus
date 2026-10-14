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


class construction7Achievement():
    # 未开工数
    SQL_QUERY_CONSTRUCTIONREPORT0 = """
        SELECT
	        d.company,
	        COUNT(*) AS cs0
        FROM
	        decoration.decoration d,
	        construction.constructionschedule c,
		    construction.construction co
        WHERE
	        c.cid = co.cid
		    AND c.status = 0
		    AND c.orderId = d.orderId
	        AND co.startTime > '%s 00:00:00'
            AND co.startTime < '%s 23:59:59'
            %s
        GROUP BY
            d.company;
        """

    # 开工数
    SQL_QUERY_CONSTRUCTIONREPORT1 = """
        SELECT
	        d.company,
	        COUNT(*) AS cs1
        FROM
	        decoration.decoration d,
	        construction.constructionschedule c,
		    construction.construction co
        WHERE
	        c.cid = co.cid
	        AND c.orderId = d.orderId
	        AND c.startTime > '%s 00:00:00'
            AND c.startTime < '%s 23:59:59'
            %s
        GROUP BY
            d.company;        
        """

    # 完工数
    SQL_QUERY_CONSTRUCTIONREPORT2 = """
        SELECT
	        d.company,
	        COUNT(*) AS cs2
        FROM
	        decoration.decoration d,
	        construction.constructionschedule c,
		    construction.construction co
        WHERE
	        c.cid = co.cid
	        AND c.orderId = d.orderId
	        AND c.endTime > '%s 00:00:00'
            AND c.endTime < '%s 23:59:59'
            %s
        GROUP BY
            d.company;            
        """

    # 砌墙
    SQL_QUERY_CONSTRUCTIONREPORT3 = """
            SELECT
    	        d.company,
    	        COUNT(*) AS cs3
            FROM
    	        decoration.decoration d,
    	        construction.constructionschedule c
            WHERE
    	        c.schedule = 3
    	        AND c.orderId = d.orderId
    	        AND c.startTime > '%s 00:00:00'
                AND c.startTime < '%s 23:59:59'
                %s
            GROUP BY
                d.company;            
             """
    # 铲大白
    SQL_QUERY_CONSTRUCTIONREPORT4 = """
            SELECT
    	        d.company,
    	        COUNT(*) AS cs4
            FROM
    	        decoration.decoration d,
    	        construction.constructionschedule c
            WHERE
    	        c.schedule = 4
    	        AND c.orderId = d.orderId
    	        AND c.startTime > '%s 00:00:00'
                AND c.startTime < '%s 23:59:59'
                %s
            GROUP BY
                d.company;            
             """
    # 放线
    SQL_QUERY_CONSTRUCTIONREPORT5 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs5
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 5
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
            GROUP BY
                d.company;                
                 """
    # 水暖
    SQL_QUERY_CONSTRUCTIONREPORT6 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs6
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 6
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
            GROUP BY
                d.company;                
                 """
    # 力工
    SQL_QUERY_CONSTRUCTIONREPORT7 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs7
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 7
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
            GROUP BY
                d.company;                
                 """
    # 电工
    SQL_QUERY_CONSTRUCTIONREPORT8 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs8
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 8
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """
    # 瓦工
    SQL_QUERY_CONSTRUCTIONREPORT9 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs9
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 9
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """
    # 地面找平
    SQL_QUERY_CONSTRUCTIONREPORT10 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs10
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 10
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """
    # 木工
    SQL_QUERY_CONSTRUCTIONREPORT11 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs11
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 11
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """
    # 油工
    SQL_QUERY_CONSTRUCTIONREPORT12 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs12
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 12
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """
    # 水电验收
    SQL_QUERY_CONSTRUCTIONREPORT13 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs13
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 13
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
                 """

    # 保洁
    SQL_QUERY_CONSTRUCTIONREPORT14 = """
                SELECT
        	        d.company,
        	        COUNT(*) AS cs14
                FROM
        	        decoration.decoration d,
        	        construction.constructionschedule c
                WHERE
        	        c.schedule = 14
        	        AND c.orderId = d.orderId
        	        AND c.startTime > '%s 00:00:00'
                    AND c.startTime < '%s 23:59:59'
                    %s
                GROUP BY
                    d.company;                
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

    def query0Construction7Achievement(self, startTime, endTime, company):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT0 % (startTime, endTime, self.company(u"d.company", company))
        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()

        result = []
        fields = ["company", "cs0"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            if (_['company'] == None):
                return result
            result.append(_)

        return result

    def query1Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT1 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs1"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if ( _['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query2Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT2 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs2"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query3Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT3 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs3"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query4Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT4 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs4"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query5Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT5 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs5"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query6Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT6 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs6"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query7Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT7 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs7"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query8Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT8 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs8"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query9Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT9 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs9"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query10Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT10 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs10"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query11Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT11 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs11"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query12Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT12 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs12"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query13Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT13 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs13"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def query14Construction7Achievement(self, startTime, endTime, company, construction7Achievements1):

        sql = self.SQL_QUERY_CONSTRUCTIONREPORT14 % (startTime, endTime, self.company(u"d.company", company))

        self.cursor.execute(sql)

        construction7Achievements = self.cursor.fetchall()
        fields = ["company", "cs14"]

        for construction7Achievement in construction7Achievements:
            _ = dict(zip(fields, construction7Achievement))
            index = 0
            if (_['company'] == None):
                return construction7Achievements1

            for construction7Achievement1 in construction7Achievements1:
                if (_['company'] == construction7Achievement1['company']):
                    index = 1
                    construction7Achievement1.update(_)

            if (index == 0):
                construction7Achievements1.append(_)

        return construction7Achievements1

    def update1construction7Achievement(self, construction7Achievements1, year, month):

        fields = ["year", "month"]

        for construction7Achievements in construction7Achievements1:

            construction7Achievements.update(dict(zip(fields, (year, month))))

            keys = []
            values = []

            for key in construction7Achievements:
                keys.append(key)

                values.append(str(int(construction7Achievements[key] if construction7Achievements[key] else 0)))

            sql = "REPLACE INTO report.construction7Achievement (%s) VALUES (%s);" % (",".join(keys), ",".join(values))

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

            # 更新工程状态
            construction7Achievements1 = self.query0Construction7Achievement(startTime, endTime, company)
            construction7Achievements1 = self.query1Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query2Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query3Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query4Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query5Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query6Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query7Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query8Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query9Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query10Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query11Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query12Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query13Construction7Achievement(startTime, endTime, company, construction7Achievements1)
            construction7Achievements1 = self.query14Construction7Achievement(startTime, endTime, company,construction7Achievements1)

            self.update1construction7Achievement(construction7Achievements1, start.year, start.month)

            count = count + 1

            time.sleep(2)

        self.closeDBConnect()

    def manual(self, year, month, company):

        self.getDBCursor()
        startTime, endTime = self.currentMonth(year, month)

        construction7Achievements1 = self.query0Construction7Achievement(startTime, endTime, company)
        construction7Achievements1 = self.query1Construction7Achievement(startTime, endTime, company, construction7Achievements1)
        construction7Achievements1 = self.query2Construction7Achievement(startTime, endTime, company, construction7Achievements1)
        construction7Achievements1 = self.query3Construction7Achievement(startTime, endTime, company, construction7Achievements1)
        construction7Achievements1 = self.query4Construction7Achievement(startTime, endTime, company, construction7Achievements1)
        construction7Achievements1 = self.query5Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query6Construction7Achievement(startTime, endTime, company, construction7Achievements1)
        construction7Achievements1 = self.query7Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query8Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query9Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query10Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query11Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query12Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query13Construction7Achievement(startTime, endTime, company,construction7Achievements1)
        construction7Achievements1 = self.query14Construction7Achievement(startTime, endTime, company,construction7Achievements1)

        self.update1construction7Achievement(construction7Achievements1, year, month)

        self.closeDBConnect()


if __name__ == '__main__':

    """
        1.脚本说明: 每2秒,以当前星期为判断更新20个月的装修业绩进行统计

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_construction7Achievement_replace.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    construction7Achievement = construction7Achievement(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"
    if callback == 'automatic':
        # company = 0
        company = sys.argv[2]
        getattr(construction7Achievement, callback)(company)

    elif callback == 'manual':

        # type = 0
        # pid = 3294
        # args = "2021/12/06-2021/12/09"
        # company = 1
        year = sys.argv[2]
        month = sys.argv[3]
        company = sys.argv[4]

        getattr(construction7Achievement, callback)(int(year), int(month), company)
    elif callback == 'help':
        print('python es_construction7Achievement_replace.py automatic <company>')
        print('python es_construction7Achievement_replace.py manual <year> <month> <company>')
    else:
        sys.exit()
