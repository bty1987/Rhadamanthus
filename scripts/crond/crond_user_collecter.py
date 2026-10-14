#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import pymysql
import datetime
import os
from pymongo import MongoClient
import sys

class Collecter():

    SQL_QUERY_STR = """
        SELECT
            u.uid AS '员工ID',
            u.userId AS '员工编号',
            u.userName AS '姓名',
            u.gender AS '性别',
            u.birthday AS '生日',
            info.education AS '学历',
            info.jobYears AS '工龄',
            r.`name` AS '角色',
            du.`name` AS '职位',
            d.`name` AS '部门',
            dt.`name` AS '部门类型',
            u.status AS '状态',
            u.company AS '所属公司',
            u.isUpdate AS  '是否更新'
        FROM
            communion.`user` u,
            communion.userinfo info,
            communion.role r,
            communion.duty du,
            communion.department d,
            communion.departmenttype dt
        WHERE
            u.roleId = r.rid AND
            u.uid = info.uid AND
            u.did = du.did AND
            u.deptId = d.dId AND
            u.dtid = dt.dtid %s
        """

    SQL_UPDATE_STR = """UPDATE communion.`user` SET isUpdate = 0"""

    def __init__(self, dbconf, mongoconf):
        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")
        
        self.dbconn = None
        self.cursor = None

        self.mongoconf = mongoconf
        
        self.mongo = None
        self.mongodb = None
        
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

    def mongo2init(self):
        self.mongo = MongoClient(host = self.mongoconf.get("host"), port = self.mongoconf.get("port"))
        if self.mongo:
            self.mongodb = self.mongo.communion.user
            
    def mongo2close(self):
        if self.mongo:
            self.mongo.close()
            self.mongo = None
            
    def query4user(self, isUpdate=False):

        self.cursor.execute(self.SQL_QUERY_STR % (" AND u.isUpdate > 0" if isUpdate else ''))
        
        users = self.cursor.fetchall()

        result = []
        fields = ["uid", "userId", "userName", "gender", "birthday", "education", "jobYears", "roleName", "duty", "deptName", "deptTypeName", "status", "company", "isUpdate"]
        
        for user in users:
            _ = dict(zip(fields, user))

            if not isUpdate:_["isUpdate"] = 2
            _["birthday"] = datetime.datetime.strptime(str(_["birthday"]), '%Y-%m-%d')
            
            result.append(_)
            
        return result
    
    def update2mongo(self, users):
        
        inserts = []

        for user in users:
            isUpdate = user.pop("isUpdate")

            if isUpdate == 1:
                self.mongodb.update_one({"uid": user["uid"]}, {'$set': user})
            elif isUpdate == 2:
                inserts.append(user)

        if inserts: self.mongodb.insert_many(inserts)
        
    def update2database(self):
        
        self.cursor.execute(self.SQL_UPDATE_STR)
        self.commit()
            
    def init(self):
        
        self.getDBCursor()
        self.mongo2init()
        
        users = self.query4user()
        
        self.update2mongo(users)
        self.update2database()
        
        self.closeDBConnect()
        
    def update(self):
        
        self.getDBCursor()
        self.mongo2init()
        
        users = self.query4user(True)
        
        self.update2mongo(users)
        self.update2database()
        
        self.closeDBConnect()
        self.mongo2close()

if __name__ == '__main__':
    """
     1.脚本说明:
        获取人员信息, 然后把数据存到mongo中
    
    本脚本命令为:
    python3 /home/fanglin/cronbin/crond_user_collecter.py
    
    定时任务:控制每10分钟需要执行的脚本
    1.每十分钟执行脚本检查人员是否有新增或更新的信息, 如果有将新的人员信息更新到mongo中
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))

    collecter = Collecter(config.get("database"), config.get('mongoDB'))

    callback = sys.argv[1]

    method = getattr(collecter, callback)
    if method: method()
    