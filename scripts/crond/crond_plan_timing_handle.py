#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import pymysql
import os
import datetime
import json
import sys


class PlanCronScript:
    
    def __init__(self, host='', userName='', passWord='',charset='utf8'):
        
        self.host = host
        self.userName = userName
        self.passWord = passWord
        self.charset = charset
        
        self.dbconn = None
        self.cursor = None
        
        self.scriptNum = None
        
        self.QUERY_PLAN_CROND_STR = """
             SELECT 
                t.type, p.pid, t.filepath, p.args, p.company, t.handle
            FROM
                information.plan p, data.task t
            WHERE
                t.tid = p.tid AND p.status = 0 AND p.executetime = '%s' AND t.handle= %s
        """
        
        self.UPDATE_PLAN_INVALID_STR = """update information.plan set info = "%s", status = %s where executetime < %s and status = 0"""

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.userName, self.passWord, charset=self.charset)

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

    def handle(self, currentTime, handle):

        self.cursor.execute(self.QUERY_PLAN_CROND_STR % (currentTime, handle))
        _plans = self.cursor.fetchall()

        for i, v in enumerate(_plans):
        
            type = int(v[0])
            pid = int(v[1])
            filepath = v[2]
            args = v[3]
            company = v[4]
            
            executeStr = u"%s %s %s %s %s &" % (["python", "sh", "/usr/local/bin/python3.7"][type], filepath, pid, args, company)
            
            print(executeStr)
            
            os.system(executeStr.encode("utf-8"))
            
            if i + 1 > self.scriptNum: break
            
        self.cursor.execute(self.UPDATE_PLAN_INVALID_STR % (u"计划超时未执行", 3, currentTime))

        self.commit()

    def main(self,handle, scriptNum):

        self.scriptNum = scriptNum

        currentTime = datetime.datetime.now().strftime('%y%m%d%H%M')
        self.getDBCursor()

        self.handle(currentTime, handle)

        self.closeDBConnect()

        sys.exit(0)

if __name__ == "__main__":
    """
    
        1.当前文件配置在 /var/spool/cron/root 下root 文件(Linux)
            * * * * * python3 /home/fanglin/cronbin/crond_plan_timing_handle.py 0 10
        
        2.脚本命令:
            python3 /home/fanglin/cronbin/crond_plan_timing_handle.py <0读1写> <执行阈值>
            python3 /home/fanglin/cronbin/crond_plan_timing_handle.py 0 10
            
        3. 脚本说明
            3.1 分钟级执行计划(任务)
            3.2 计划(任务)每分钟执行阀值控制 , 超出阀值计划(任务)按照执行失败处理
            3.3 计划执行类型分为三种 , phthon(py2)/shell(sh)/python(py3)
            3.4 计划执行官命令 , <python3/sh> <filepath:脚本路径> <pid:任务主键> <args:自定义脚本参数> <company:公司>
            ps: sh /home/fanglin/cronbin/plan_achievement_decoration_collecter.py 667 2015/08/02-2018/10/03 0 0
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    handle = sys.argv[1]
    scriptNum = sys.argv[2]

    plans = PlanCronScript(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"))
    plans.main(int(handle), int(scriptNum))
