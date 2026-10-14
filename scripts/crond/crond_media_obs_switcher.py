#!/usr/bin/evn python3.7
#-*- encoding: utf-8 -*-

from obs.client import ObsClient
import json
import os
import pymysql
import requests
import ssl
import sys
from urllib import request

ssl._create_default_https_context = ssl._create_unverified_context

class SwitchMedia():
    
    MEDIA_HOST_STR = "http://192.168.5.101/%s"
    
    def __init__(self, host='', username='', password='', database='', charset='utf8', mm=None, dd=None):
        
        self.host = host
        self.username = username
        self.password = password
        self.database = database
        self.charset = charset
        
        self.dbconn = None
        self.cursor = None
        
        self.limit = 1
        
        self.tmpath = "/home/fanglin/logs/obsupload.log" # 临时文件
        
        self.obs = ObsClient(
            access_key_id='',    
            secret_access_key='',    
            server='https://obs.cn-north-4.myhuaweicloud.com'
        )
        
        self.bucket = "fanglin-media"

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, self.database, charset=self.charset)
    
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
        
    def get(self, url):
        return requests.get(url)
    
    def readTmp(self):
        seek = {}
        if not os.path.exists(self.tmpath):
            tmpfile = open(self.tmpath, 'w')
            tmpfile.write("{}")
        else:
            tmpfile = open(self.tmpath, encoding='utf-8')
            seek = json.loads(tmpfile.readline())
            
        return seek
    
    def wirteTmp(self, lines):
        save = open(self.tmpath, 'w')
        save.write(lines)
        save.close()
        
    def main(self):
        
        seek = self.readTmp()
        
        seek["constructiondrawing"] = self.constructiondrawing(seek.get("constructiondrawing", 0))
        seek["decorationpicture"] = self.decorationpicture(seek.get("decorationpicture", 0))
        seek["userphoto"] = self.userphoto(seek.get("userphoto", 0))
        
        self.wirteTmp(json.dumps(seek))
        
    def switch(self, sql, offset, limit):
        
        self.openDBConnect()
        self.getDBCursor()
        
        self.cursor.execute(sql % (offset, limit))
        
        infos = self.cursor.fetchall()
        
        self.closeDBConnect()
        
        for i in range(len(infos)):
            
            filename = infos[i][0]
            url = self.MEDIA_HOST_STR % filename
            
            resp = self.obs.putContent(self.bucket, filename, content = request.urlopen(url).read())
            
            if resp.status != 200:
                return offset + i
            
        return offset + len(infos)
        
    def constructiondrawing(self, offset):
        return self.switch("select drawingUrl from construction.constructiondrawing where type = 0 limit %d, %d", offset, self.limit)
        
    def decorationpicture(self, offset):
        return self.switch("select path from decoration.decorationpicture limit %d, %d", offset, self.limit)
    
    def userphoto(self, offset):
        return self.switch("select userPhoto from communion.user where userPhoto is not null and userPhoto != '' limit %d, %d", offset, self.limit)
        
if __name__ == "__main__":
    
    switchMedia = SwitchMedia('localhost', '', '', '', 'utf8')
    
    action = sys.argv[1]
    
    if action == 'all':
        switchMedia.main()
    elif action == 'switch':
        
        _ = sys.argv[2]
        offset = sys.argv[3]

        if getattr(switchMedia, _):
            getattr(switchMedia, _)(offset)
        
        print("No available method")
        
    sys.exit(0)
