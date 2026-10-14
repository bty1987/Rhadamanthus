#!/usr/bin/evn python3.7
#-*- encoding: utf-8 -*-

import datetime
import pymysql
import requests
import ssl
import urllib
import math

ssl._create_default_https_context = ssl._create_unverified_context

class SwitchMedia():
    
    DMEDIA_MAIN_STR = "https://static.dingtalk.com/media/"
    MEDIA_HOST_STR = "http://223.100.27.233/uploadImg.do"
    MEDIA_LOCAL_STR = "http://223.100.27.233/"
    
    SQL_UPDATE_MEDIA_STR = "update %s set drawingUrl = '%s', type = 0 where cdid = %s"
    
    SQL_COUNT_MEDIA_STR = "select count(*) from %s where type = 1"
    
    def __init__(self, host='', username='', password='', database='', charset='utf8', mm=None, dd=None):
        
        self.host = host
        self.username = username
        self.password = password
        self.database = database
        self.charset = charset
        
        self.dbconn = None
        self.cursor = None
        
        self.limit = 500
        self.ci = 0
        self.mm = mm
        self.dd = dd

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
    
    def post(self, url, args):
        return requests.post(url, args)
    
    def count(self):
        
        if self.ci > 50:
            self.ci = 0
            self.commit()
            
        self.ci += 1
        
    def getMM(self):
        return self.mm and self.mm or datetime.datetime.now().strftime('%m')
    
    def getDD(self):
        return self.dd and self.dd or datetime.datetime.now().strftime('%d')
    
    def constructiondrawing(self):
        
        self.getDBCursor()
        
        self.cursor.execute("select * from construction.constructiondrawing where type = 1 limit 50")
        
        _infos = self.cursor.fetchall()
        
        for i in _infos:
            
            filename = i[3]
            postfix = filename.split(".")[1]
            
            (width, height) = filename.split(".")[0].split("_")[-2:]
            
            if width > 1000 or height > 1000:
                width = width / 2;
                height = height / 2;
            
            if width > 1000 or height > 1000:
                width = width / 2;
                height = height / 2;
                
            url = "%s%s_%dx%d.%s" % (self.DMEDIA_MAIN_STR, filename, width, height, postfix)

            try:

                print(url)
                
                res = self.uploudFile(urllib.request.urlopen(url).read(), filename)
                
                if res.get('errorCode') == 0:
                    
                    path = res.get("resUrl").replace('\\', '\/')
                    
                    print("update construction.constructiondrawing set drawingUrl = '%s', type = 0 where cdid = %s" % (path, i[0]))
                    self.cursor.execute("update construction.constructiondrawing set drawingUrl = '%s', type = 0 where cdid = %s" % (path, i[0]))
            except Exception as e:
                print(e)
#                print("delete from construction.constructiondrawing where cdid = %s;" % (i[0]))
            
#            print res.get("generateName")
#            print self.SQL_UPDATE_MEDIA_STR % (table, res.get("generateName"), id, i[0])
            finally:
                self.count()
                
        self.commit()
        self.closeDBConnect()
    
    def constructiondrawingsize(self):

        self.getDBCursor()

        self.cursor.execute("select * from construction.constructiondrawing where cdid > 0 and filesize = 0 and type = 0 limit 50")

        _infos = self.cursor.fetchall()

        for i in _infos:

            cdid = i[0]
            path = i[3]

            url = "%s%s" % (self.MEDIA_LOCAL_STR, path)

            try:

                size = math.ceil(len(urllib.request.urlopen(url).read())/1000)

#                print("update construction.constructiondrawing set filesize = %d where cdid = %s" % (size, cdid))
                self.cursor.execute("update construction.constructiondrawing set filesize = %d where cdid = %s" % (size, cdid))
            except Exception as e:
                print(e)
#                print("delete from construction.constructiondrawing where cdid = %s;" % (i[0]))

#            print res.get("generateName")
#            print self.SQL_UPDATE_MEDIA_STR % (table, res.get("generateName"), id, i[0])
            finally:
                self.count()

        self.commit()
        self.closeDBConnect()
        
    def decorationcontract(self):
    
        self.getDBCursor()
        
        self.cursor.execute("select dcid, download from decoration.decorationcontract where status = 3 limit 10")
        
        _infos = self.cursor.fetchall()
        
        for i in _infos:
        
            download = i[1]
            postfix = "pdf"

            try:

                print(url)
                
                res = self.uploudFile(urllib.request.urlopen(download).read(), "decorationcontract.pdf")
                
                if res.get('errorCode') == 0:
                    
                    path = res.get("resUrl").replace('\\', '\/')
                    
                    print("update decoration.decorationcontract set path = '%s', status = 4 where dcid = %s" % (path, i[0]))
                    self.cursor.execute("update decoration.decorationcontract set path = '%s', status = 4 where dcid = %s" % (path, i[0]))
            except Exception as e:
                print(e)

            finally:
                self.count()
                
        self.commit()
        self.closeDBConnect()
        
    def customerauth(self):
    
        self.getDBCursor()
        
        self.cursor.execute("select cid, photoPath, identityPathF, identityPathB from communion.customer where status = 1 limit 10")
        
        _infos = self.cursor.fetchall()
        
        for i in _infos:
        
            cid = i[0]
            photoPic = i[1]
            identPicF = i[2]

            try:

                photoUrl = self.fdd_file_uuid(photoPic)
                
                res = self.uploudFile(urllib.request.urlopen(photoUrl).read(), "photoPic.jpg")
                
                if res.get('errorCode') == 0:
                    photoPic = res.get("resUrl").replace('\\', '\/')

                    
                identUrl = self.fdd_file_uuid(identPicF)
                
                res = self.uploudFile(urllib.request.urlopen(identUrl).read(), "identPic.jpg")
                
                if res.get('errorCode') == 0:
                    identPicF = res.get("resUrl").replace('\\', '\/')
                    
                print("update communion.customer set photoPath = '%s', identityPathF = '%s', status = 2 where cid = %s" % (photoPic, identPicF, cid))
                self.cursor.execute("update communion.customer set photoPath = '%s', identityPathF = '%s', status = 2 where cid = %s" % (photoPic, identPicF, cid))
                
            except Exception as e:
                print(e)

            finally:
                self.count()
                
        self.commit()
        self.closeDBConnect()
        
    def fdd_file_uuid(self, uuid):
    
        url = "https://extapi.fadada.com/api2/"
    
        appid = "001691"
        secret = "fwgvDtsvkOnzCe6RrkbO9dPj"
        version = "2.0"
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        
        m = hashlib.md5()
        m.update(timestamp.encode())
        
        #print(m.hexdigest().upper())

        s1 = hashlib.sha1()
        s1.update((secret + uuid).encode())
        
        #print(s1.hexdigest().upper())
        
        s2 = hashlib.sha1();
        s2.update((appid + m.hexdigest().upper() + s1.hexdigest().upper()).encode())
        
        #print(s2.hexdigest().upper())
        #print(base64.b64encode(s2.hexdigest().upper().encode()).decode())
        
        digest = base64.b64encode(s2.hexdigest().upper().encode()).decode()
        
        return "%sget_file.api?app_id=%s&v=%s&timestamp=%s&uuid=%s&doc_type=&msg_digest=%s" % (url, appid, version, timestamp, uuid, digest)

    def counts(self, table):
        
        self.getDBCursor()
        
        self.cursor.execute(self.SQL_COUNT_MEDIA_STR % (table))
        
        _infos = self.cursor.fetchall()
        
        for i in _infos:
            print(i)
        
        self.closeDBConnect()
        
    def uploudFile(self, file, name):
        
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}
        
        files = {'strutsUploads': (name, file, {"name": "strutsUploads"})}
        
        ret = requests.post("http://223.100.27.233/uploadImg.do", data={}, headers=header, files=files)
        
        return ret.json()

if __name__ == "__main__":
    
    #switchMedia = SwitchMedia('192.168.5.21', 'root', 'root', 'construction', 'utf8')
    switchMedia = SwitchMedia('localhost', 'root', 'mysqlG2DNG32!', 'construction', 'utf8')
    
    action = sys.argv[1]

    if action == 'switch':
        _ = sys.argv[2]

        if getattr(switchMedia, _):
            getattr(switchMedia, _)()
        
    elif action == "count":
        _ = sys.argv[2]
        
        switchMedia.counts(_)
    else:
        print("No available method")

#    sys.exit(0)
