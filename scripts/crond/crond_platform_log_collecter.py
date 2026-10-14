# !/usr/bin/env python
# -*- encoding: utf-8 -*-

from pymongo import MongoClient
import datetime
import os
import json
import sys
import base64
import time

class Collector():

    def __init__(self, config, logpath):
    
        self.host = config.get("name") # 主机名
        self.mongoConf = config.get("mongoDB") # mongo配置
        
        self.mongo = None # mongo操作实例
        self.mongodb = None


        self.logpath = logpath # 日志文件路径+名称 , 脚本执行参数
        self.tmpath = "/home/fanglin/logs/tmp.log" # 临时文件

        self.result = {}

    # mongodb连接池
    def mongos(self):
        self.mongo = MongoClient(host=self.mongoConf.get('host'), port= self.mongoConf.get('port'))
        self.mongodb = self.mongo.log[datetime.datetime.now().strftime('%Y')]

    #前一天时间
    def yesterday(self):
        return (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')

    #写入
    def wirte(self, lines):
        save = open(self.tmpath, 'w')
        save.write(lines)
        save.close()
        
    def checkTime(self, start, end, days=31):
        try:

            _start = time.strptime(start,"%Y-%m-%d")
            _end = time.strptime(end,"%Y-%m-%d")

            start=datetime.datetime(_start[0], _start[1], _start[2])  
            end=datetime.datetime(_end[0], _end[1], _end[2])
        
            if (start - end > datetime.timedelta(days=days)):
                raise RuntimeError(u'时间应在1-31内')
            
            return [start, end]
        except RuntimeError as re:
            raise re
        except Exception as e:
            raise RuntimeError(u'日期格式错误')
        
    #mongo数据库添加与修改
    def update(self):

        inserts = []

        for data in self.result.values():
            _query = dict((key, value) for key, value in data.items() if key in ["time", "api", "userId", "company", "host"])
            _doc = self.mongodb.find_one(_query)

            if _doc:
                self.mongodb.update_one(_query,{'$inc':{'count':data['count']}})
            else:
                inserts.append(data)

        if inserts:
            self.mongodb.insert_many(inserts)
            
        self.result = {}

    def handle(self, logfile, seeknum):

        fields = ["time", "api", "userId", "company"]
        logfile.seek(seeknum, 0)
        
        lines = logfile.readlines()

        for line in lines:

            try:
                infos = line.strip().split("|")
                today = datetime.datetime.strptime(infos[0], '%Y-%m-%d %H:%M:%S').date()

                if len(infos) == 6 :

                    info = [str(today), infos[3], infos[4], infos[5]]

                    unionid = base64.b64encode("".join(infos[3:]).encode("utf-8"))

                    if unionid in self.result.keys():
                        self.result[unionid]['count'] += 1
                    else:
                        self.result[unionid] = dict(zip(fields, info))
                        count = {"count": 1, "host": self.host}
                        self.result[unionid].update(count)
            except Exception as e:
                print(e)

        return  "%d" % logfile.tell()
    
    def custom(self, startTime, endTime):
        
        start, end = self.checkTime(startTime, endTime)
        
        self.mongos()
        
        while start <= end:
            
            _logpath = "%s.%s" % (self.logpath, start.strftime("%Y-%m-%d"))
            
            start += datetime.timedelta(days=1)
            
            if not os.path.exists(_logpath): continue
   
            print(_logpath)
            
            logfile = open(_logpath, encoding='utf-8')
            
            self.handle(logfile, 0)

            self.update()

    def main(self):

        # 1 判断操作日志文件是否存在 , 判断临时文件是否存在
        # 1.1 临时文件不存在 , 创建临时文件 , seek初始为0

        # 2 获取mongo操作对象

        # 3 获取操作日志文件对象 , 获取临时文件

        # 4 操作日志文件tell() , 日志文件最后位置 , 比较临时文件存储seek位置
        # 4.1 如果tell小于seek , 日志文件已经更新(跨天) , 获取前一天日志操作文件 , 利用tell和seek判断是否需要处理 , 初始seek为0
        # 4.2 如果tell大于seek , 获取当前日志操作文件 , 利用tell和seek处理

        # 5 处理日志行信息过程 , 定义全局字典 , 存储汇总及统计的日志信息
        # 5.1 每行数据利用|拆分 , 根据拆分得到信息 , 更新全局字典

        # 6 利用全局字典更新

        # 7 将新seek存储到临时文件中

        # 8 关闭日志文件 , 关闭临时文件

        # 9 关闭mongo实例对象

        self.mongos()
        seek = 0

        if not os.path.exists(self.tmpath):
            tmpfile = open(self.tmpath, 'w')
            tmpfile.write("")
        else:
            tmpfile = open(self.tmpath, encoding='utf-8')
            seek = int(tmpfile.readline())

        logfile = open(self.logpath, encoding='utf-8')
        logfileSize = os.path.getsize(self.logpath)

        if logfileSize < seek:
            oldpath = "%s.%s" % (self.logpath, self.yesterday())

            oldfile = open(oldpath, encoding='UTF-8')
            #昨天得行数大于存得seek 说明有数据没存上
            oldfileSize = os.path.getsize(oldpath)
            if oldfileSize > seek:
                self.handle(oldfile, seek)
            oldfile.close()

            seek = 0

        tmpinfo = self.handle(logfile, seek)
        
        print("Logger: %s" % tmpinfo)
        
        self.update()
        self.wirte(tmpinfo)

        logfile.close()
        tmpfile.close()
        
        self.mongo.close()

if __name__ == '__main__':

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    
    type = sys.argv[1]
    
    if type == "auto":
        logpath = sys.argv[2]
        Collector(config, logpath).main()
    elif type == "custom":
        logpath = sys.argv[2]
        startTime = sys.argv[3]
        endTime = sys.argv[4]
        
        Collector(config, logpath).custom(startTime, endTime)
        
    sys.exit()

