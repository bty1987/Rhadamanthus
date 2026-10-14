#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

from datetime import datetime
from elasticsearch import Elasticsearch
from urllib import request, parse
import json
import os
import pymysql
import re
import uuid

servers = {
    "FIP-523": ["192.168.5.23", "sensors", "nginx", "tomcat", "mysql", "master"],
    "FIP-521": ["192.168.5.21", "sensors", "nginx", "tomcat", "mysql", "slave"],
}

result = {}
updates = []

success = "update communion.monitor set comment ='%s', value = '%s', status = 0, count = 0 updateTime = CURRENT_TIMESTAMP where name = '%s' and type = '%s';"
fail = "update communion.monitor set comment ='%s', status = 1, count = count + 1, updateTime = CURRENT_TIMESTAMP where name = '%s' and type = '%s';"

try:
    es = Elasticsearch('http://192.168.5.153:9200')
except Exception, e:
    es = None
    
def init():
    
    for name, info in servers.items():
        
        host = info[0]
        
#        print name, host
        
        for m in info[1:]:
            
            print "insert into communion.monitor (name, host, type, comment, status, count, updateTime, value) values ('%s', '%s', '%s', '', 0, 0, '%s', '');" % (name, host, m, '2017-01-01 00:00:00')
    
def execute():
    
    for name, info in servers.items():
        
        host = info[0]
        
#        print name, host
        
        for m in info[1:]:
            
            try:
                eval(m)(name, host)
            except Exception, e:
                message("Monitor Exception: %s" % e)
                
def sensors(name, host):
    
    if not result.has_key(name):
        result[name] = {}
    
    result.get(name)["temperature"] = "Temperature: NaN"
    
    sql = fail % ('', name, 'sensors')
    
    response = os.popen('''ssh -p 19182 root@%s "sensors"''' % host).readlines()
    
    ___ = []
    es_out = []
    
    total, div = 0.0, 0.0
    
    for i in range(len(response)):
        
        info = response[i]
        
        if info.find("Physical") != -1:
            t = re.findall(r"Physical id (.+?): \+(.+?)°C", info)
            
            no, tp = t[0]
            
            total += float(tp)
            div += 1
            
            ___.append("%s:%s" % (no, tp))
            es_out.append({"name": name, "host": host, "no": int(no), "temperature": float(tp), 'timestamp': datetime.now()})
            
    if result.get(name).get("temperature"):
        
        if div != 0 and (total / div) < 36:
            
            result.get(name)["temperature"] = "Temperature: %s" % ",".join(___)
            
            sql = success % ("Temperature: %s" % ",".join(___), str(total/div), name, 'sensors')
        else:
            sql = fail % ("Temperature: %s" % ",".join(___), name, 'sensors')
        
        for out in es_out:
            esout("TP", out)
            
    updates.append(sql)
        
def nginx(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["nginx"] = "Nginx: NaN"
    
    sql = fail % ('', name, 'nginx')
    
#    ssh -p 19182 root@192.168.5.12 "osqueryi --json \"select pid, name, path from processes where cmdline like '%nginx%'\""

    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%nginx%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        cmdline = i.get("cmdline")
        
        if cmdline.find("nginx") != -1 and cmdline.find("master") != -1:
            
            pid = i.get("pid")
            
            result.get(name)["nginx"] = "Nginx normal, PID: %s" % pid
            
            sql = success % ("Nginx normal, PID: %s" % pid, pid, name, 'nginx')
            
#            print "Nginx normal\n%s" % i.get("pid")

    updates.append(sql)

def tomcat(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["tomcat"] = "Tomcat: NaN"
    
    sql = fail % ('', name, 'tomcat')
    
    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%tomcat%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        path = i.get("path")
        
        if path.find("jdk") != -1:
            
            pid = i.get("pid")
            
            result.get(name)["tomcat"] = "Tomcat normal, PID: %s" % pid
            
            sql = success % ("Tomcat normal, PID: %s" % pid, pid, name, 'tomcat')
            
#            print "Tomcat normal\n%s" % i.get("pid")

    updates.append(sql)

def mysql(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["mysql"] = "Mysql: NaN"
    
    sql = fail % ('', name, 'mysql')
    
    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%mysql%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        pname = i.get("name")
        
        if pname == "mysqld":
            
            pid = i.get("pid")
            
            result.get(name)["mysql"] = "Mysql normal, PID: %s" % pid
            
            sql = success % ("Mysql normal, PID: %s" % pid, pid, name, 'mysql')
            
#            print "Mysql normal\n%s" % i.get("pid")

    updates.append(sql)

def logstash(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["logstash"] = "Logstash: NaN"
    
    sql = fail % ('', name, 'logstash')
    
    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%logstash%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        path = i.get("path")
        
        if path.find("jdk") != -1:
            
            pid = i.get("pid")
            
            result.get(name)["logstash"] = "Logstash normal, PID: %s" % pid
            
            sql = success % ("Logstash normal, PID: %s" % pid, pid, name, 'logstash')
            
#            print "Logstash normal\n%s" % i.get("pid")

    updates.append(sql)

def fdfs(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["fdfs"] = "FastDFS: NaN"
    
    sql = fail % ('', name, 'fdfs')
    
    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%fdfs%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        path = i.get("path")
        
        if path.find("fdfs") != -1:
            
            pid = i.get("pid")
            
            result.get(name)["fdfs"] = "FastDFS normal, PID: %s" % pid
            
            sql = success % ("FastDFS normal, PID: %s" % pid, pid, name, 'fdfs')
            
#            print "FastDFS normal\n%s" % i.get("pid")

    updates.append(sql)

def kibana(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["kibana"] = "Kibana: NaN"
    
    sql = fail % ('', name, 'kibana')
    
    response = os.popen('''ssh -p 19182 root@%s "osqueryi --json \\"select pid, name, path, cmdline from processes where cmdline like '%%kibana%%'\\""''' % host).readlines()
    
    infos = eval(''.join(response))
    
    for i in infos:
        
        path = i.get("path")
        
        if path.find("kibana") != -1:
            
            pid = i.get("pid")
            
            result.get(name)["kibana"] = "Kibana normal, PID: %s" % pid
            
            sql = success % ("Kibana normal, PID: %s" % pid, name, 'kibana')
            
#            print "FastDFS normal\n%s" % i.get("pid")

    updates.append(sql)

def master(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["master"] = "Mysql master: NaN"
    
    dbconn = pymysql.connect(host, "monitor", "monitor", "", charset="utf8")
    
    cursor = dbconn.cursor()
    
    cursor.execute("show master status")
    row = cursor.fetchone()
    
    if row:
        result.get(name)["master"] = "Mysql master, File: %s, Position: %s" % (str(row[0]), str(row[1]))
        
    dbconn.close()
    
    updates.append(success % ("Mysql master, File: %s, Position: %s" % (str(row[0]), str(row[1])), str(row[1]), name, 'master'))
    
def slave(name, host):
    
    if not result.has_key(name):
        result[name] = {}
        
    result.get(name)["slave"] = "Mysql slave: NaN"
    
    dbconn = pymysql.connect(host, "monitor", "monitor", "", charset="utf8")
    
    cursor = dbconn.cursor()
    
    cursor.execute("show slave status")
    row = cursor.fetchone()
    
    if row:
        
        if row[18] != 0:
            result.get(name)["slave"] = "Mysql slave, File: %s, Position: %s, Error: %s" % (str(row[5]), str(row[6]), str(row[19]))
            
            updates.append(fail % ("Mysql slave, File: %s, Position: %s, Error: %s" % (str(row[5]), str(row[6]), str(row[19])), name, 'slave'))
        else:
            result.get(name)["slave"] = "Mysql slave, File: %s, Position: %s, Error: %s" % (str(row[5]), str(row[6]), str(row[0]))
            
            updates.append(success % ("Mysql slave, File: %s, Position: %s, Error: %s" % (str(row[5]), str(row[6]), str(row[0])), str(row[6]), name, 'slave'))
        
    dbconn.close()
        
def output():
    
    for name, info in result.items():
        
        _str = "-----------------------------------%s------------------------------" % name
        
        os.system("echo %s >> /home/fanglin/logs/monitor.log" % _str)
        
        for i in info.values():
            
            os.system("echo %s >> /home/fanglin/logs/monitor.log" % i)
            
def esout(doc_type, output):
    
    if not es: return
    
    _index = "monitor-%s" % datetime.now().strftime('%Y%m')
    _id = str(uuid.uuid1()).replace('-', '')
    
    res = es.index(index=_index, doc_type=doc_type, id=_id, body=output)
    
def monitor():
    
    dbconn = pymysql.connect("192.168.5.11", "monitor", "monitor", "", charset="utf8")
    
    cursor = dbconn.cursor()
    
    for sql in updates:
        cursor.execute(sql)
        
    dbconn.commit()
    
    cursor.execute("select * from communion.monitor where count in (1, 2, 5, 10)");
    rows = cursor.fetchall()
    
    print rows
    
    text = []
    
    for row in rows:
        text.append("%s:%s" % (row[1], row[5]))
    
    if len(text) != 0: 
        message(','.join(text))
    
def message(message):
    
    response = post("http://service-erp.fanglin.vip/queryDAccessTokenForNew.do?company=29521582141", {})
    
    if response.has_key("errorCode") and response.get("errorCode") == 0:
        accesstoken = response.get("dAccessToken").get("accesstoken")
        
        url = "https://oapi.dingtalk.com/message/send?access_token=%s" % accesstoken
        
        params = {"touser": "FL-00479", "agentid": 23525686, "msgtype": "text", "text": {"content": "%s" % message}}
        
        print post(url, params)
    
def post(url, params):
    
    textmod = parse.urlencode(params).encode("utf-8")
    
    header_dict = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',"Content-Type": "application/json"}
    
    req = request.Request(url=url,data=textmod,headers=header_dict)
    res = request.urlopen(req)
    
    return json.loads(res.read().decode('utf-8'))
            
if __name__ == "__main__":
    
    execute()
    output()
    monitor()
#    init()

