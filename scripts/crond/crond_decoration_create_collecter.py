#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import pymysql
from datetime import timedelta, datetime
from elasticsearch import Elasticsearch
import elasticsearch.helpers
import datetime
import sys
import json
import os

class Collecter :
    
    SQL_DECORATION_STR = """SELECT
                d.orderId,
                co.`name`,
                o.dsuid,
                o.smuid,
                ds.currentName,
                sm.currentName,
                dpdsd.no,
                dpdsd.name,
                dpdsr.no,
                dpdsr.name,
                dpsmd.no,
                dpsmd.name,
                dpsmr.no,
                dpsmr.name,
                o.VALUE,
                o.VALUE,
                o.operateTime,
                d.contractTime,
                d.createTime,
                d.orderTotalPrice 
            FROM
                decoration.decoration AS d,
                communion.`user` AS ds,
                communion.`user` AS sm,
                communion.company AS co,
                decoration.decorationoperate AS o,
                communion.department AS dpdsd,
                communion.department AS dpdsr,
                communion.department AS dpsmd,
                communion.department AS dpsmr 
            WHERE
                d.orderId = o.orderId 
                AND d.company = co.cid 
                AND o.type IN ( 8, 9 ) 
                AND o.dsuid = ds.uid 
                AND ds.deptId = dpdsd.dId 
                AND dpdsd.fdid = dpdsr.dId 
                AND o.smuid = sm.uid 
                AND sm.deptId = dpsmd.dId 
                AND dpsmd.fdid = dpsmr.dId
                AND %s
            LIMIT % d OFFSET % d;"""
    
    def __init__(self, host='', username='', password='', esHost='', timeDiff='', charset='utf8'):

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.esHost = esHost
        
        self.dbconn = None
        self.cursor = None
        
        self.userCounts = {}
        self.departmentCounts = {}
        self.regionCounts = {}
        self.es = Elasticsearch(self.esHost)
        self.timeDiff = timeDiff
        self._source = ['orderId', 'company', 'designerUid', 'salesmanUid', 'designerName', 'salesmanName', 'designerDeptId', 'designerDeptName', 'designerRegionId', 'designerRegionName', 'salesmanDeptId', 'salesmanDeptName', 'salesmanRegionId', 'salesmanRegionName', 'designerRate', 'salesmanRate', 'operateTime', 'contractTime', 'createTime', 'orderTotalPrice']
        
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
        
    def commit(self):
        self.dbconn and self.dbconn.commit()
        
    def rollback(self):

        self.dbconn and self.dbconn.rollback()
        
    def divNum(self, data, numList):
        if len(numList) > 0:
            for i, v in enumerate(numList):
                if not data[v] is None:
                    data[v] = data[v]/1000
        
    def search(self, sql, date, startTime, limit):
        
        self.getDBCursor()
        
        pages = 0
        
        startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d').strftime('%Y%m')

        while pages % limit == 0:
            
            self.cursor.execute(sql % (date, limit, pages))
            
            decorations = self.cursor.fetchall()
            
            decoration = list(decorations)
            
            package = []
            
            if len(decoration) == 0:
                
                break
            
            for i in range(len(decoration)):
                
                pages += 1
                
                _sources = {}
                
                [_sources.setdefault(y, datetime.datetime.strptime(decoration[i][x].strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S") - datetime.timedelta(hours=self.timeDiff) if (y == "createTime" or (y == "contractTime" and decoration[i][x] != None)) else decoration[i][x]) for x, y in enumerate(self._source)]
                
                row = {
                    '_op_type': 'index',
                    '_index': 'decoration-create-' + startTime,
                    '_type': 'decoration',
                    '_source': _sources
                }
                
                package.append(row)

            elasticsearch.helpers.bulk(self.es, package, request_timeout=60)
            
        self.closeDBConnect()

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

    def all(self, limit,startTime, endTime):

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        pdate = "(d.createTime between '%s 00:00:00' and '%s 23:59:59')" % (startTime, endTime) 
        
        self.search(self.SQL_DECORATION_STR, pdate, startTime, limit)
        
    def current(self,limit):
        
        yesterday = datetime.date.today() + timedelta(-1)
    
        yesterday_format = yesterday.strftime('%Y-%m-%d')
        
        pdate = "(d.createTime between '%s 00:00:00' and '%s 23:59:59')" % (yesterday_format, yesterday_format) 

        self.search(self.SQL_DECORATION_STR, pdate, yesterday_format, limit)
        
            
if __name__ == "__main__":
    
    """
    1.按照指定日期查询装修单量尺信息：查询订单编号，公司，创建时间，签单时间，签单额，设计师，设计师比例，设计师部门及大区，业务员，业务员比例，业务员部门及大区，面积，地址，所在城市，
                         
    2.传入参数：
        limit（必填项）： 查询条数 （50） 查询limit条数据
        startTime（可填项）：起始时间 （2018-01-01） 量尺日期从startTime开始的装修单
        endTime（可填项）：结束时间 （2018-05-01） 量尺日期已endTime结束的装修单
    3.开关控制：
        all：定制。 必须传入startTime与endTime，指定查询从startTime到endTime的区间数据
        current：每天。 不需要传递startTime与endTime，查询当天的前一天数据。
                        注：两种方式都必须传入limit。
    4.python es_decoration_create_collecter.py all <limit> <startTime> <endTime>
                         例：python es_decoration_create_collecter.py all 50 2018-01-01 2018-05-01
                         则：执行脚本，查询2018-01-01到2018-05-01的量尺信息，以50条显示。
      python es_decoration_create_collecter.py current <limit>
                          例：python es_decoration_create_collecter.py current 50 
                         则：执行脚本，查询前一天的量尺信息，以50条显示。
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))

    dbconf = config.get("database")

    collecter = Collecter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("eshost"), int(config.get("timeDiff")));
    action = sys.argv[1]

    if action == 'all':
        getattr(collecter, action)(int(sys.argv[2]), sys.argv[3], sys.argv[4])
    elif action == 'current':
        getattr(collecter, action)(int(sys.argv[2]))
    elif action == 'help':
        print ('python es_decoration_create_collecter.py all <limit> <startTime> <endTime>')
        print ('python es_decoration_create_collecter.py current <limit>')
    else:
        sys.exit()

