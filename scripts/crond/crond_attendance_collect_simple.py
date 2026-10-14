#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import os
import pytz
import time
import json
import pymysql
import datetime
import urllib, urllib.request
import codecs
import ssl

class Attendance:

    SQL = "SELECT userId, username, uid FROM communion.user"
    SQLS = "SELECT uid, month FROM communion.attendance"

    def __init__(self, host='', username='', password='', charset='utf8'):

        ssl._create_default_https_context = ssl._create_unverified_context

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset

        self.dbconn = None
        self.cursor = None

        self.attends={}
        self.users = {}
        self.day=""
        self.attendances = {}
        self.checkins = {}

        self.key = u"notSignedCount_attendance_Records"

        self.SQL_INSERT_ATTENDANCE = """
                                insert into communion.attendance(uid,month,%s)
                        values
                          (%s);
                                  """


    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def getDBCursor(self):

        if not self.dbconn:
            self.openDBConnect()

        self.cursor = self.dbconn.cursor()

    def commit(self):
        self.dbconn and self.dbconn.commit()

    def closeDBConnect(self):
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None


    def post(self, url, args, local=True):
        if local:
            req = urllib.request.Request(url=url, data=urllib.parse.urlencode(args).encode(encoding='UTF8'))  # urllib.urlencode(args) / json.dumps(args)
            return json.loads(urllib.request.urlopen(req).read())
        else:
            header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',"Content-Type": "application/json"}
            req = urllib.request.Request(url=url, data=json.dumps(args).encode(encoding='UTF8'),headers=header)  # urllib.urlencode(args) / json.dumps(args)
            return json.loads(urllib.request.urlopen(req).read())

    def formatData(self, time):
        data = datetime.datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
        return data

    def wokerTypeJudgment(self, timeResult):

        strTimeResult = u""

        if timeResult == "Normal":
            strTimeResult = int(0)

        if timeResult == "Early":
            strTimeResult = int(1)

        if timeResult == "Late":
            strTimeResult = int(2)

        if timeResult == "SeriousLate":
            strTimeResult = int(3)

        if timeResult == "Absenteeism":
            strTimeResult = int(4)

        if timeResult == "NotSigned":
            strTimeResult = int(5)

        return strTimeResult

    def getAccessToken(self):
        url = 'http://114.215.183.148//queryDAccessTokenForNew.do?company=101'
        res = self.post(url, {})

        if "errorCode" in res and res.get("errorCode") == 0:
            return res['dAccessToken']['accesstoken']
        else:
            return ''

    def getUser(self, sql):

        self.getDBCursor()

        self.cursor.execute(sql)

        _users = self.cursor.fetchall()

        self.closeDBConnect()

        for i in range(len(_users)):

            _user = _users[i]
            self.users[_user[0]] = { "name": _user[1], "uid": _user[2]}

    def getAttend(self, sql):

        self.getDBCursor()

        self.cursor.execute(sql)

        _attends = self.cursor.fetchall()

        self.closeDBConnect()

        for i in range(len(_attends)):
            _attend = _attends[i]
            self.attends[i] = { "uid": _attend[0], "month": _attend[1]}

    def getAttendance(self, userIds, startTime, daynum, accessToken):

        url = "https://oapi.dingtalk.com/attendance/list?access_token=%s" % accessToken

        args = {
            "userIdList": userIds,#员工在企业内的UserID列表，企业用来唯一标识用户的字段。最多不能超过50个
            "offset": 0,#表示获取考勤数据的起始点，第一次传0，如果还有多余数据，下次获取传的offset值为之前的offset+limit，0、1、2...依次递增
            "limit": 50#表示获取考勤数据的条数，最大不能超过50条
        }

        records = []

        if len(userIds) == 0:
            return

        for i in range(daynum):
            _startTime = startTime + datetime.timedelta(days=i)
            _endTime = startTime + datetime.timedelta(days=i + 1) - datetime.timedelta(seconds=1)

            args["workDateFrom"] = str(_startTime)#查询考勤打卡记录的起始工作日。格式为“yyyy-MM-dd hh:mm:ss”，hh:mm:ss可以使用00:00:00，具体查询的时候不会起作用，最后将返回此日期从0点到24点的结果
            args["workDateTo"] = str(_endTime)#查询考勤打卡记录的结束工作日。格式为“yyyy-MM-dd hh:mm:ss”，hh:mm:ss可以使用00:00:00，具体查询的时候不会起作用，最后将返回此日期从0点到24点的结果。注意，起始与结束工作日最多相隔7天

            res = self.post(url, args, False)

            if "errcode" in res and res.get("errcode") == 0:#返回码
                records = records + res.get("recordresult")

        for record in records:

            userId = record.get("userId")
            workdate = time.strftime("%y%m%d", time.localtime(record.get("workDate") / 1000))
            checktype = record.get("checkType")#考勤类型 OnDuty ：上班    OffDuty ：下班
            timeresult = record.get("timeResult")#时间结果Normal：正常;Early：早退;Late：迟到;SeriousLate：严重迟到；Absenteeism：旷工迟到；NotSigned：未打卡

            if userId not in self.users:
                user = self.users[userId] = {"name": "", "uid" : ""}#, "uid":self.users[userId]["uid"]

            else:
                user = self.users[userId]

            if workdate not in user:
                check = user[workdate] = ["", ""]
            else:
                check = user.get(workdate) #workdate--数据时间

            if checktype == "OnDuty":
                check[0] = timeresult
            else:
                check[1] = timeresult

            if timeresult != "Normal":

                if workdate in self.checkins:
                    _checkins = self.checkins.get(workdate)

                    if userId not in _checkins:
                        self.checkins.get(workdate).append(userId)
                else:
                    self.checkins[workdate] = [userId]

    def attendance(self, startTime, daynum, users, accessToken):

        userIds = list(users.keys())

        for i in range(0, len(users.keys()), 25):

            self.getAttendance(userIds[i: i + 25], startTime, daynum, accessToken)

        for date in self.checkins.keys():

            userIds = self.checkins.get(date)

            for i in range(0, len(userIds), 10):
                self.checkin(date, userIds[i: i + 10], accessToken, 0)

    def checkin(self, date, userIds, accessToken, cursor):

        _startTime = int(time.mktime(time.strptime("%s040000" % date, "%y%m%d%H%M%S"))) * 1000
        _endTime = int(time.mktime(time.strptime("%s220000" % date, "%y%m%d%H%M%S"))) * 1000

        args = {
            "userid_list": ",".join(userIds),
            "start_time": _startTime,
            "end_time": _endTime,
            "cursor": cursor,
            "size": 100,
            "method": "dingtalk.smartwork.checkin.record.get",
            "session": accessToken,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "v": "2.0",
            "format": "json",
            "simplify": False
        }

        url = "https://eco.taobao.com/router/rest"

        res = self.post(url, args, True)

        response = res.get("dingtalk_smartwork_checkin_record_get_response")
        result = response.get("result")
        pagelist = result.get("result").get("page_list")

        if "checkin_record_vo" in pagelist:
            records = pagelist.get("checkin_record_vo")
            for i in records:

                userId = i.get("userid")

                if userId in self.users:
                    user = self.users[userId]
                    checkinTime = datetime.datetime.fromtimestamp(int(i.get("checkin_time") / 1000),pytz.timezone('Asia/Shanghai'))

                    _date = checkinTime.strftime("%y%m%d")
                    if _date in user:
                        _info = user.get(_date)
                        if checkinTime.strftime("%H%M") < "0930":
                            _info[0] = "Normal"
                        if checkinTime.strftime("%H%M") > "1700":
                            _info[1] = "Normal"

        if "next_cursor" in result:
            cursor = result.get("next_cursor")
            self.checkin(date, userIds, accessToken, cursor)

    #转换格式
    def convertToUnicode(self, data):
        data = json.dumps(data)
        data = codecs.decode(data, "unicode-escape")
        return data

    # 考勤记录
    def notAttendanceRecords(self,ymd,sql,month):

        arry = []
        uarry = []
        uids=[]
        for i, v in enumerate(self.users):

            if ymd in self.users[v]:
                if len(str(self.users[v]['uid'])) == 0:
                    continue
                else:
                    uids.append(self.users[v]['uid'])
                    uid = self.users[v]['uid']
                commute = self.users[v][ymd]

                onduty = self.wokerTypeJudgment(commute[0])  # 上班 --> 打卡类型(正常,早退,迟到,严重迟到,旷工迟到,未打卡)
                offduty = self.wokerTypeJudgment(commute[1])  # 下班 --> 打卡类型(正常,早退,迟到,严重迟到,旷工迟到,未打卡)

                if onduty == 0 and offduty == 0: #0正常 1早退 2迟到 3严重迟到 4矿工迟到 5未打卡
                    self.aduty = u'11'
                elif onduty == 5 and offduty == 5:
                    self.aduty = u'33'
                elif (onduty == 2 or onduty == 3 or onduty == 4) and offduty == 1:
                    self.aduty = u'22'
                elif onduty == 0 and offduty == 1:
                    self.aduty = u'12'
                elif (onduty == 2 or onduty == 3 or onduty == 4) and offduty == 0:
                    self.aduty = u'21'
                elif onduty == 0 and offduty == 5:
                    self.aduty = u'13'
                elif onduty == 5 and offduty == 0:
                    self.aduty = u'31'
                elif onduty == 5 and offduty == 1:
                    self.aduty = u'32'
                elif (onduty == 2 or onduty == 3 or onduty == 4) and offduty == 5:
                    self.aduty = u'23'

                if onduty != "" or offduty != "":
                    day = ymd[4:]
                    day = datetime.datetime.strptime(day, '%d')  # - >datetime

                    self.day = day.day  # - >int -- 获取日期

                arry.append(str(uid))
                arry.append(str(month))             #uid--month--考勤信息
                arry.append(self.aduty)

                uarry.append(self.aduty)
                uarry.append(str(uid))
                uarry.append(str(month))

        self.updateAttendance(uarry,uids,arry,sql)

    #更新数据
    def updateAttendance(self,uarry,uids,arry,sql):

        sql2 = """ update communion.attendance set %s where uid = %s and month = %s ; """

        if self.attends == {}: #数据库中没有数据则录入考勤
            for a in range(0, len(arry), 3):
                array = arry[a:a + 3]

                self.getDBCursor()
                sqls = sql % (u'a'+str(self.day),','.join(array))
                self.cursor.execute(sqls)
                self.commit()
                self.closeDBConnect()

        for b in range(len(self.attends)):

            if self.attends[b].get('uid') in uids: #查询数据库中的考勤表如果里面数据的uid在考勤的uid中整明之前收集过数据

                if self.day == 1:                   #如果是1号将会插入新的月份的考勤
                    for a in range(0, len(arry), 3):
                        array = arry[a:a + 3]

                        self.getDBCursor()
                        sqls = sql % (u'a' + str(self.day), ','.join(array))
                        self.cursor.execute(sqls)
                        self.commit()
                        self.closeDBConnect()

                elif self.day != 1:
                    for c in range(0, len(uarry), 3):

                        arrays = uarry[c: c + 3]
                        self.getDBCursor()
                        qlls = sql2 % (u'a' + str(self.day) + ' = ' + arrays[0], arrays[1], arrays[2])
                        self.cursor.execute(qlls)
                        self.commit()
                        self.closeDBConnect()

                if len(uarry):
                    break;

    def time(self, startTime, endTime, num=31):
        if type(startTime) != datetime.datetime:
            if startTime.find(u"/") != -1:
                startTime = startTime.replace("/", "-")
                endTime = endTime.replace("/", "-")

            if len(startTime) == 10:
                startTime = "%s 00:00:00" % startTime
                endTime = "%s 23:59:59" % endTime

            startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')

        if endTime - startTime <= datetime.timedelta(days=num):
            return True
        else:
            return False

    def main(self, startTime, endTime, db = None):

        start = datetime.datetime.now()

        if not db and not db.isdigit() and not 0 <= db <= 15: self.db = 0
        else: self.db = db

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        accessToken = self.getAccessToken()

        _startTime = self.formatData("%s 00:00:00" % startTime)
        _endTime = self.formatData("%s 23:59:59" % endTime)

        daynum = (_endTime - _startTime).days + 1

        self.getUser(self.SQL)
        self.getAttend(self.SQLS)

        count=0
        countStartTime = _startTime
        month = str(countStartTime).split('-')[0]+str(countStartTime).split('-')[1]
        while(count<daynum):

            ymd =str(countStartTime.strftime('%y%m%d'))

            self.attendance(countStartTime, 1, self.users, accessToken)
            countStartTime = countStartTime + datetime.timedelta(days=1)

            self.notAttendanceRecords(ymd,self.SQL_INSERT_ATTENDANCE,month)

            count = count +1

        end = datetime.datetime.now()
        print (u"执行完毕,总耗时(s): %s" % (end - start).seconds)

if __name__ == '__main__':
    """
     1.脚本说明:
        自动获取前一天的时间, 并查询前一天的所有人员的考勤和签到记录, 如果数据库中没有数据，
        把数据存入mysql中,如果数据库中已经有之前的考勤数据，会自动更新新的日期的考勤数据到数据库中
        
        注:获取签到数据时间为, 早04:00:00 -- 晚22:00:00
           签到时间在,早08:30:00之前 -- 晚18:00:00之后 修改考勤数据为正常 
     3.例:
        db 固定为---1, 本脚本无需传参 自动获取时间为前一天
        1.python crond_dttendance_collect.py <自动获取昨天时间>  
          python crond_dttendance_collect.py  
    
    mysql中:
    全部考勤:
        aid                       uid        month        a1      a2       ...      a31  
        5c88c96928b5900e56c4ac35   1         202002       11     12        ...       33    
        5c88c96928b5900e56c4ac36   2         202002       33     21        ...       33     

        
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    attendance = Attendance(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"))

    db = 15

    nowTime = datetime.datetime.now()
    yesterday = nowTime - datetime.timedelta(days=1)
    yesterdayStr = yesterday.strftime("%Y-%m-%d")

    attendance.main(yesterdayStr, yesterdayStr, int(db))