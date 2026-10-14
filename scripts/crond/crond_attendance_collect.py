#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import os
import pytz
import time
import json
import pymysql
import datetime
import urllib, urllib.request
import redis
import codecs
from pymongo import MongoClient
from datetime import timedelta
import ssl

class Attendance:

    SQL = "SELECT userId, username, uid FROM communion.user"
    # SQL = "SELECT userId, userName, uid FROM test.user"

    def __init__(self, host='', username='', password='', redis='', mongoDB='', charset='utf8'):

        ssl._create_default_https_context = ssl._create_unverified_context

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.redisConf = redis

        self.dbconn = None
        self.cursor = None

        self.users = {}
        self.attendances = {}
        self.checkins = {}

        #self.redisTrue = False
        self.redis = None
        self.key = u"notSignedCount_attendance_Records"
        self.datas = {}  # 连续三天未打卡
        self.datasAll = {}  # 全部考勤

        self.mongodbConf = mongoDB
        self.mongodb = None
        self.mongoData = []
        self.mongodatas = {}

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

    # redis连接池
    def redisPool(self, db):
        r = redis.ConnectionPool(host = self.redisConf.get("host"), password = self.redisConf.get("password"), db = db, decode_responses=True)
        self.redis = redis.Redis(connection_pool=r)

    # mongodb连接池
    def mongodbPool(self):
        m = MongoClient(host = self.mongodbConf.get("host"), port = self.mongodbConf.get("port"))
        self.mongodb = m

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

            self.users[_user[0]] = {"name": _user[1], "uid" : _user[2]}

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

    # 未打卡考勤记录
    def notAttendanceRecords(self,ymd):

        self.redisPool(db)
        self.mongodbPool()
        mongo = self.mongodb.attendance  # 连接attendance数据库，没有则自动创建
        myMongoDB = mongo.ac2019  # 连接user数据库下ac2019表，没有则自动创建

        pipe = self.redis.pipeline()

        times = timedelta(days=2)  # 时间类型---两天
        ymdTime = datetime.datetime.strptime(ymd, '%y%m%d')  # 时间由字符串转换为时间类型
        newTime = ymdTime - times  # 脚本传入的时间-2天(寻找3天连续未打卡的数据)

        for i, v in enumerate(self.users):

            if ymd in self.users[v]:
                commute = self.users[v][ymd]
                onduty = self.wokerTypeJudgment(commute[0])#上班 --> 打卡类型(正常,早退,迟到,严重迟到,旷工迟到,未打卡)
                offduty = self.wokerTypeJudgment(commute[1])  #下班 --> 打卡类型(正常,早退,迟到,严重迟到,旷工迟到,未打卡)
                if onduty!="" or offduty !="":
                    month = ymd[2:4]
                    day = ymd[4:]
                    month = datetime.datetime.strptime(month, '%m') #- >datetime
                    day = datetime.datetime.strptime(day, '%d') #- >datetime
                    month = month.month #- >int --获取月份
                    day = day.day #- >int -- 获取日期

                    self.mongoData = {"uid":self.users[v]["uid"], "userId":v, "userName":self.users[v]["name"], "onduty":onduty, "offduty":offduty, "month" : month, "day":day,"creatrTime":ymdTime}
                    myMongoDB.insert_one(self.mongoData)

        for mv in myMongoDB.aggregate([
            {'$match': {'creatrTime': {'$gte': newTime, '$lte': ymdTime}}},
            {'$match': {'onduty': int(5),'offduty':  int(5)}},#int(5)---未打卡
            {"$group": {"_id": {"id": "$userId", "name": "$userName"}, "count": {"$sum": 1}}},
            {'$match': {'count': 3}}
        ]):

            muserId = mv["_id"]["id"]  # 员工id
            mName = mv["_id"]["name"]  # 员工姓名
            st = newTime.strftime('%y%m%d')#未打卡开始日期
            et = ymdTime.strftime('%y%m%d')#未打卡结束日期

            vals = [muserId, mName, u"%s--%s" % (st, et)]
            self.datas[muserId] = self.convertToUnicode(vals)

            if self.datas:
                pipe.hmset(self.key, self.datas)#u"%s--%s" % (ymd,(int(ymd) + 2))
                pipe.execute()

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

        count=0
        countStartTime = _startTime
        while(count<daynum):

            ymd =str(countStartTime.strftime('%y%m%d'))

            self.attendance(countStartTime, 1, self.users, accessToken)
            countStartTime = countStartTime + datetime.timedelta(days=1)

            self.notAttendanceRecords(ymd)

            count = count +1

        end = datetime.datetime.now()
        print (u"执行完毕,总耗时(s): %s" % (end - start).seconds)

if __name__ == '__main__':
    """
     1.脚本说明:
        自动获取前一天的时间, 并查询前一天的所有人员的考勤和签到记录, 然后把数据存到mongoDB中,并把连续三天未打卡的人员考勤记录到redis中
        注:获取签到数据时间为, 早04:00:00 -- 晚22:00:00
           签到时间在,早09:30:00之前 -- 晚17:00:00之后 修改考勤数据为正常 
     3.例:
        db 固定为---1, 本脚本无需传参 自动获取时间为前一天
        1.python crond_dttendance_collect.py <自动获取昨天时间>  
          python crond_dttendance_collect.py  
    
    mongoDB中:
    全部考勤:
        _id                       uid    userName       onduty     userId       offduty      month    day    creatrTime
        5c88c96928b5900e56c4ac35   1         方鑫          正常       FL-03336      未打卡        3       12    2019-04-15
        5c88c96928b5900e56c4ac36   2         崔国富        正常       FL-00128       正常         3       12    2019-04-15
    
    redis中:
    未打卡:
        key            value
        FL-03336        [FL-03336, 方鑫, "190309-190312"]
        FL-00128        [FL-00128, 崔国富, "190309-190312"]
        
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    attendance = Attendance(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get('redis'), config.get('mongoDB'))

    db = 15

    nowTime = datetime.datetime.now()
    yesterday = nowTime - datetime.timedelta(days=1)
    yesterdayStr = yesterday.strftime("%Y-%m-%d")
    attendance.main(yesterdayStr, yesterdayStr, int(db))