#!/usr/bin/python
# -*- coding:UTF-8 -*-

from pymongo import MongoClient
import pymysql
import os
import sys
import datetime
import json


class Collecter:

    def __init__(self, host='', username='', password='', media='', pthost='', mongoDB='', charset='utf8'):
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.mongodbConf = mongoDB
        self.mongodb = None

        self.decoration_collecter = u"""
            d.orderId AS `装修单号`,
            bu.userId AS `人员Id`,
            bu.currentName AS `人员名称`,
            dept.no AS `部门编号`,
            dept.name AS `部门名称`,
            regin.no AS `分区编号`,
            regin.name AS `分区名称`,
            c.cid AS `公司编号`,
            c.name AS `公司名称`,
            d.orderTotalPrice / 1000 AS `签单额`,
            db.rate / 1000 AS `比例`,
            db.type AS `人员类型`,
            d.contractTime AS `签单时间`
        """
        self.decoration_measure = u"""
            d.orderId AS `装修单号`,
            bu.userId AS `人员Id`,
            bu.currentName AS `人员名称`,
            dept.no AS `部门编号`,
            dept.name AS `部门名称`,
            regin.no AS `分区编号`,
            regin.name AS `分区名称`,
            c.cid AS `公司编号`,
            c.name AS `公司名称`,
            db.type AS `人员类型`,
            d.measureTime AS `量尺时间`
        """
        self.SQL_DECORATION_COLLECTER = u"""
            select
                %s
            from
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.user bu,
                communion.department dept,
                communion.department regin,
                communion.company c
            where
                d.orderId = db.orderId and
                db.buid = bu.uid and
                db.did = dept.did and
                db.rid = regin.did and
                d.company = c.cid and
                db.status = 0 and %s
        """

    # 连接MongoDB
    def mongodbPool(self):
        mongo = MongoClient(host=self.mongodbConf.get("host"), port=self.mongodbConf.get("port"))
        self.mongodb = mongo.decoration

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def closeDBConnect(self):
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def getDBCursor(self):
        if not self.dbconn:
            self.openDBConnect()
        self.cursor = self.dbconn.cursor()
    
    def divNum(self, data, numList):
        if len(numList) > 0:
            for i, v in enumerate(numList):
                if not data[v] is None:
                    data[v] = data[v]/1000

    def controlTime(self, startTime, endTime, num=31):

        startTime = datetime.datetime.strptime("%s 00:00:00" % startTime, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.datetime.strptime("%s 23:59:59" % endTime, '%Y-%m-%d %H:%M:%S')

        if endTime - startTime > datetime.timedelta(days=num):
            raise RuntimeError(u'时间应在1-31内')

    def pageData(self, sql, nowPage, size=200):

        limtStr = """limit %s,%s; """ % (nowPage * size, size)

        pageSql = sql + limtStr

        self.cursor.execute(pageSql)
        _datas = self.cursor.fetchall()

        return _datas

    def getContractData(self, _users):
        result = []
        fields = ["orderId", "userId", "currentName", "deptNo", "deptName", "reginNo", "reginName", "cid", "name",
                  "orderTotalPrice", "rate", "type", "contractTime"]
        for user in _users:
            _ = dict(zip(fields, user))
            _["type"] = int(_["type"])
            _["contractTime"] = _["contractTime"].strftime('%Y-%m-%d')
            _["orderTotalPrice"] = float(_["orderTotalPrice"])
            _["rate"] = float(_["rate"])
            result.append(_)

        return result

    # 签单额
    def contract(self, startTime, endTime):

        sql = self.SQL_DECORATION_COLLECTER % (self.decoration_collecter,"d.contractTime >= '%s 00:00:00' and d.contractTime <= '%s 23:59:59'" % (startTime, endTime))

        contract = self.mongodb.contract

        nowPage = 0

        while (True):

            users = self.pageData(sql, nowPage)
            datas = self.getContractData(users)

            if datas:
                
                contract.insert_many(datas)

            nowPage = nowPage + 1

            if len(datas) < 200: break

    def getMeasureData(self, _decoration):
        result = []
        fields = ["orderId", "userId", "currentName", "deptNo", "deptName", "reginNo", "reginName", "cid", "name",
                  "type", "measureTime"]
        for decoration in _decoration:
            _ = dict(zip(fields, decoration))
            _.update({"count": 1})
            _["type"] = int(_["type"])
            _["measureTime"] = _["measureTime"].strftime('%Y-%m-%d')
            result.append(_)
        return result

    # 量尺数
    def measure(self, startTime, endTime):

        sql = self.SQL_DECORATION_COLLECTER % (self.decoration_measure,"d.measureTime >= '%s 00:00:00' and d.measureTime <= '%s 23:59:59'" % (startTime, endTime))

        measure = self.mongodb.measure

        nowPage = 0

        while (True):

            users = self.pageData(sql, nowPage)
            datas = self.getMeasureData(users)

            for data in datas:
                
                _query = dict((key, value) for key, value in data.items() if key in ["userId", "usType", "company", "measureTime"])
                _doc = measure.find_one(_query)
                if _doc:
                    measure.update_one(_query, {'$inc': {'count': 1}})
                else:
                    measure.insert_one(data)

            nowPage = nowPage + 1

            if len(datas) < 200: break

    def main(self, startTime, endTime):

        self.controlTime(startTime, endTime)

        self.getDBCursor()
        self.mongodbPool()

        self.contract(startTime, endTime)
        self.measure(startTime, endTime)

        self.closeDBConnect()

        sys.exit(0)


if __name__ == '__main__':
    """
        装修单业绩统计,根据签单时间进行查询说明:
        其中: 部门是从decorationbelong表中关联的
        
    1.传入必须参数说明
        2.startTime  开始时间 例"2014-06-14"
        3.endTime    结束时间 例"2018-06-14"

    2.使用说用名
        python crond_decoration_perform_collecter.py auto
        python crond_decoration_perform_collecter.py customer 2016-01/01-2016/01/01
        
    """
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))

    dbconf = config.get("database")

    collecter = Collecter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"), config.get('mongoDB'))

    type = sys.argv[1]

    if type == "auto":

        yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        collecter.main(yesterday, yesterday)
    elif type == "custom":

        startTime = sys.argv[2]
        endTime = sys.argv[3]

        collecter.main(startTime, endTime)
