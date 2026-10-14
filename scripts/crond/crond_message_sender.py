#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import pymysql
import datetime
import os
import requests
import sys

class Sender():

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None

        self.accesstokens = {}
        self.agentids = {}

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

    def company(self, company):
        return "%s0%d" % (company, len(str(company)))

    def accesstoken(self, company):

        if self.accesstokens.get(company):
            return self.accesstokens.get(company)

        response = requests.get("http://service-erp.fanglin.vip/queryDAccessTokenForNew.do?company=%s" % self.company(company))

        accesstoken = json.loads(response.text)

        self.accesstokens[company] = accesstoken.get("dAccessToken", {}).get("accesstoken")

        return accesstoken.get("dAccessToken", None).get("accesstoken")

    def agentid(self):

        sql = "select company, `value` from communion.systemconfig where `key` = 'messageAgentId'"

        self.cursor.execute(sql);

        agentids = self.cursor.fetchall()

        for agentid in agentids:
            self.agentids[str(agentid[0])] = agentid[1]

    def message(self, receiver, title, content, company):

        company = str(company)

        url = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=%s" % self.accesstoken(company)
        content = {"msgtype": "markdown", "markdown": {"title": title, "text": content}}
        params = {"agent_id": self.agentids.get(company), "msg": content, "userid_list": receiver}

        response = requests.post(url, json.dumps(params))

    def rebot(self, group, title, content, ats=[]):

        headers = {"Content-Type": "application/json"}

        url = "https://oapi.dingtalk.com/robot/send?access_token=%s" % group
        content = {"msgtype": "markdown", "markdown": {"title": title, "text": content}}
        
        if ats and len(ats) > 0:
            content["at"] = {"atUserIds": ats}

        response = requests.post(url, json.dumps(content), headers=headers)

    def ding(self, receiver, content):
        
        headers = {
            'x-acs-dingtalk-access-token': self.accesstoken(0)
        }

        params = {
            "robotCode": "dingonatbwxggsycm8go",
            "remindType": 2,
            "receiverUserIdList": [receiver],
            "content": "test"
        }
        
        requests.post("https://api.dingtalk.com/v1.0/robot/ding/send", json=params, headers=headers)

    def handle(self, sql, receiver, title, message, offset, company):

        rows = 0

        while True:
        
            self.cursor.execute("%s limit %d, %d" % (sql, rows, offset))

            datas = self.cursor.fetchall()

            for info in datas:
                self.message(receiver(info), title, message(info), company(info))

            if len(datas) < offset: break

            rows += offset

    def customer_chance(self, args):
        
        self.getDBCursor()
        
        deptline = (datetime.datetime.now() - datetime.timedelta(minutes=3)).strftime("%Y-%m-%d %H:%M:%S")
        regiline = (datetime.datetime.now() - datetime.timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S")
        
        sql = """
            select 
                cc.isread,
                cu.currentname,
                cdm.userId,
                crm.userId
            from 
                customer.customerchance cc 
                left join communion.user cu on cc.cuid = cu.uid 
                left join communion.department cd on cu.deptid = cd.did
                left join communion.user cdm on cd.muid = cdm.uid
                left join communion.department cr on cd.fdid = cr.did
                left join communion.user crm on cr.muid = crm.uid
            where 
                (cc.isRead = 0 and cc.createtime < '%s') or 
                (cc.isread = 2 and cc.createtime < '%s')
        """ % (deptline, regiline)
        
        self.cursor.execute(sql)
        
        datas = self.cursor.fetchall()
        
        for info in datas:
        
            isread = info[0]
            creater = info[1]
            deptmer = info[2]
            regimer = info[3]
            
            if isread == "0" and deptmer:
                self.ding(deptmer, "部门成员%s有一条新的客源信息, 请提醒他到方林办公小程序或钉钉信息平台查看." % (creater))
            
            if isread == "2" and regimer:
                self.ding(regimer, "部门成员%s有一条新的客源信息, 请提醒他到方林办公小程序或钉钉信息平台查看." % (creater))
                
        self.cursor.execute("update customer.customerchance set isread = 2 where isread = 0 and createtime < '%s'" % (deptline))
        self.cursor.execute("update customer.customerchance set isread = 3 where isread = 2 and createtime < '%s'" % (regiline))
        
        self.commit()

        self.closeDBConnect()

    def drawline_pro(self, args):

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select 
                d.orderId, ci.drawlineTime, du.userId, du.company, v.name, h.housenumber
            from 
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v
            where 
                ci.drawlineTime >= '%s 00:00:00' AND ci.drawlineTime <= '%s 23:59:59' AND 
                ci.orderId = d.orderId AND d.dsuid = du.uid AND d.hid = h.hid AND h.vid = v.vid
        """

        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        self.handle(sql % (operatime, operatime), lambda info: info[2], "预计放线提醒", lambda info: "装修单: %s, 地址: %s %s , 预计放线时间%s , 还剩%s天 , 请及时对接放线安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])

        self.closeDBConnect()

    def drawline_complete(self, args):

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select
                d.orderId, ci.finishTime, du.userId, du.company, v.name, h.housenumber
            from
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v
            where
                ci.finishTime >= '%s 00:00:00' AND ci.finishTime <= '%s 23:59:59' and
                ci.orderId = d.orderId AND d.dsuid = du.uid AND d.hid = h.hid AND h.vid = v.vid
        """

        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        self.handle(sql % (operatime, operatime), lambda info: info[2], "预计完工提醒", lambda info: "装修单: %s, 地址: %s %s , 预计完工时间%s , 还剩%s天 , 请及时对接完工安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])

        self.closeDBConnect()

    def drawline_designer(self, args):
    
        regions = {
            "FL_DR_18": "***WEBHOOK_KEY_REMOVED***", # 一分区
            "FL_DR_16": "***WEBHOOK_KEY_REMOVED***", # 二分区
            "FL_DR_17" : "***WEBHOOK_KEY_REMOVED***", # 三分区
        }

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select
                d.orderId, ci.drawlineTime, du.userId, du.company, v.name, h.housenumber, dd.no, dd.name, dr.no, dr.name, du.currentName
            from
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v, communion.department dd, communion.department dr
            where
                ci.drawlineTime >= '%s 00:00:00' AND ci.drawlineTime <= '%s 23:59:59' AND
                ci.orderId = d.orderId AND d.dsuid = du.uid AND d.hid = h.hid AND h.vid = v.vid AND du.deptid = dd.did AND dd.fdid = dr.did
        """

        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        #self.handle(sql % (operatime, operatime), lambda info: info[2], "预计设计提醒", lambda info: "装修单: %s, 地址: %s , 预计设计日期%s , 还剩%s天 , 请及时对接设计安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])
        
        title = "放线时间提醒(10天)"
        message = "放线时间提醒(10天), 装修单: %s, 地址: %s, 放线时间提醒日期: %s, 分区: %s, 部门: %s, 设计师: %s, 请及时对接."
        
        self.cursor.execute(sql % (operatime, operatime))
        datas = self.cursor.fetchall()
        self.closeDBConnect()

        for info in datas:
        
            region = info[8]
            
            if not region in regions.keys(): continue
        
            self.rebot(regions.get(region), title, message % (info[0], info[4] + " " + info[5], info[1].strftime('%Y-%m-%d'), info[9], info[7], info[10]), [info[2]])

    def drawline_supervisor(self, args):

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select
                d.orderId, ci.finishTime, du.userId, du.company, v.name, h.housenumber
            from
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v
            where
                ci.finishTime >= '%s 00:00:00' AND ci.finishTime <= '%s 23:59:59' and
                ci.orderId = d.orderId AND d.svuid = du.uid AND d.hid = h.hid AND h.vid = v.vid
        """

        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        self.handle(sql % (operatime, operatime), lambda info: info[2], "预计竣工提醒", lambda info: "装修单: %s, 地址: %s %s , 预计竣工时间%s , 还剩%s天 , 请及时对接竣工安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])

        self.closeDBConnect()

    def construction_key_designer(self, args):
    
        regions = {
            "FL_DR_18": "***WEBHOOK_KEY_REMOVED***", # 一分区
            "FL_DR_16": "***WEBHOOK_KEY_REMOVED***", # 二分区
            "FL_DR_17" : "***WEBHOOK_KEY_REMOVED***", # 三分区
        }

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select
                d.orderId, ci.keyTime, du.userId, du.company, v.name, h.housenumber, dd.no, dd.name, dr.no, dr.name, du.currentName
            from
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v, communion.department dd, communion.department dr
            where
                ci.keyTime >= '%s 00:00:00' AND ci.keyTime <= '%s 23:59:59' AND
                ci.orderId = d.orderId AND d.dsuid = du.uid AND d.hid = h.hid AND h.vid = v.vid AND du.deptid = dd.did AND dd.fdid = dr.did
        """

        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        #self.handle(sql % (operatime, operatime), lambda info: info[2], "预计设计提醒", lambda info: "装修单: %s, 地址: %s , 预计设计日期%s , 还剩%s天 , 请及时对接设计安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])
        
        title = "领取钥匙时间提醒(10天)"
        message = "领取钥匙时间提醒(10天), 装修单: %s, 地址: %s, 日期: %s, 分区: %s, 部门: %s, 设计师: %s, 请及时对接."
        
        self.cursor.execute(sql % (operatime, operatime))
        datas = self.cursor.fetchall()
        self.closeDBConnect()

        for info in datas:
        
            region = info[8]
            
            if not region in regions.keys(): continue
        
            self.rebot(regions.get(region), title, message % (info[0], info[4] + " " + info[5], info[1].strftime('%Y-%m-%d'), info[9], info[7], info[10]), [info[2]])

    def decoration_design_designer(self, args):
    
        python3.7 /home/fanglin/cronbin/py3/crond_message_sender.py decoration_design_designer 5
    
        regions = {
            "FL_DR_18": "***WEBHOOK_KEY_REMOVED***", # 一分区
            "FL_DR_16": "***WEBHOOK_KEY_REMOVED***", # 二分区
            "FL_DR_17" : "***WEBHOOK_KEY_REMOVED***", # 三分区
        }

        self.getDBCursor()

        self.agentid()

        day = int(args[2])

        sql = """
            select
                d.orderId, ci.designTime, du.userId, du.company, v.name, h.housenumber, dd.no, dd.name, dr.no, dr.name, du.currentName
            from
                construction.constructioninfo ci, decoration.decoration d, communion.user du, communion.house h, communion.village v, communion.department dd, communion.department dr
            where
                ci.designTime >= '%s 00:00:00' AND ci.designTime <= '%s 23:59:59' AND
                ci.orderId = d.orderId AND d.dsuid = du.uid AND d.hid = h.hid AND h.vid = v.vid AND du.deptid = dd.did AND dd.fdid = dr.did
        """

        starttime = datetime.datetime.now().strftime("%Y-%m-%d")
        operatime = (datetime.datetime.now() + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
        #self.handle(sql % (operatime, operatime), lambda info: info[2], "预计设计提醒", lambda info: "装修单: %s, 地址: %s , 预计设计日期%s , 还剩%s天 , 请及时对接设计安排 . " % (info[0], info[4], info[5], info[1].strftime('%Y-%m-%d'), day), 10, lambda info: info[3])
        
        title = "设计完成时间提醒(5天)"
        message = "设计完成时间提醒(5天), 装修单: %s, 地址: %s, 日期: %s, 分区: %s, 部门: %s, 设计师: %s, 请及时对接."
        
        self.cursor.execute(sql % (starttime, operatime))
        datas = self.cursor.fetchall()
        self.closeDBConnect()

        for info in datas:
        
            region = info[8]
            
            if not region in regions.keys(): continue
        
            self.rebot(regions.get(region), title, message % (info[0], info[4] + " " + info[5], info[1].strftime('%Y-%m-%d'), info[9], info[7], info[10]), [info[2]])

    def worker_salary(self, args):

        wsids = []

        self.getDBCursor()

        self.agentid()

        sql = """
            select 
                d.orderId, v.name, h.housenumber, w.userId, w.currentname, su.currentname, ws.money/1000, d.company, ws.wsid, cn.name
            from 
                salary.workersalary ws, communion.user w, decoration.decoration d, communion.house h, communion.village v, communion.user su, construction.constructionschedule cs, communion.constructionnode cn
            where 
                ws.issend = 1 AND ws.wuid = w.uid AND ws.orderId = d.orderId AND d.hid = h.hid AND h.vid = v.vid AND d.svuid = su.uid AND ws.csid = cs.csid AND cs.schedule = cn.sort AND d.company = cn.company
            order by 
                ws.wuid
            limit 50;
            
        """

        self.cursor.execute(sql)

        datas = self.cursor.fetchall()

        for info in datas:
            self.message(info[3], "工人工费通知", "装修单: %s, 地址%s %s, 监理: %s, 工人: %s, 施工节点: %s, 工费: %s . " % (info[0], info[1], info[2], info[5], info[4], info[6], info[9]), info[7])

            wsids.append(str(info[8]))

        if len(wsids) > 0:

            update = "update salary.workersalary set issend = 2 where wsid in (%s)" % ",".join(wsids);

            print(update)

            self.cursor.execute(update)

            self.commit()

        self.closeDBConnect()

    status = {
        0: u"初始",
        1: u"通过",
        2: u"驳回",
        3: u"撤销"
    }

    def worker_salary_tosupervisor(self, args):

        wsids = []

        self.getDBCursor()

        self.agentid()

        sql = """
            SELECT 
                d.orderId, v.name, h.housenumber, su.userId, cn.name, d.company, ws.wsid, ws.status
            FROM 
                salary.workersalary ws, 
                decoration.decoration d, 
                communion.house h, 
                communion.village v, 
                communion.user su, 
                construction.constructionschedule cs, 
                communion.constructionnode cn
            WHERE 
                ws.isappr = 1 AND 
                ws.orderId = d.orderId AND 
                d.hid = h.hid AND 
                h.vid = v.vid AND 
                ws.cuid = su.uid AND 
                ws.csid = cs.csid AND 
                cs.schedule = cn.sort AND 
                d.company = cn.company
            ORDER BY 
                ws.wuid
            LIMIT 50;
        """

        self.cursor.execute(sql)

        datas = self.cursor.fetchall()
        for info in datas:
            row = list(info)
            row[7] = self.status[row[7]]

            self.message(info[3], "工费通知","%s装修单号, %s %s楼盘地址, %s施工节点的工费已%s" % (info[0], info[1], info[2], info[4], row[7]), info[5])

            wsids.append(str(info[6]))

        if len(wsids) > 0:
            update = "update salary.workersalary set isappr = 2 where wsid in (%s)" % ",".join(wsids)

            self.cursor.execute(update)

            self.commit()

        self.closeDBConnect()

    def information_message(self, args):

        mids = []

        self.getDBCursor()

        self.agentid()

        current = datetime.datetime.now().strftime('%Y-%m-%d')

        sql = """
            select 
                m.contents, u.userid, sc.value, u.company, m.ruid
            from 
                information.message m 
            left join 
                communion.systemconfig sc on m.group = sc.scid, 
                communion.user u
            where 
                m.createTime >= '%s 00:00:00'
                AND m.status = 2 
                AND m.ruid = u.uid
            limit 50;
        """

        self.cursor.execute(sql % current)

        datas = self.cursor.fetchall()

        for info in datas:
            if info[2]:
                self.rebot(info[2], "消息", info[0])
            else:
                self.message(info[1], "消息", info[0], info[3])

            mids.append(str(info[4]))

        if len(mids) > 0:
            update = "update information.message set status = 1 where status = 2  AND ruid in (%s)" % ",".join(mids)

            print(update)

            self.cursor.execute(update)

            self.commit()

        self.closeDBConnect()

    def init(self):

        self.getDBCursor()

        users = self.query4user()

        self.update2mongo(users)
        self.update2database()

        self.closeDBConnect()

    def update(self):

        self.getDBCursor()

        users = self.query4user(True)

        self.update2mongo(users)
        self.update2database()

        self.closeDBConnect()
        self.mongo2close()

if __name__ == '__main__':
    """
        1.脚本说明: 每分钟执行 , 根据设置好的查询条件完成对应人的消息发送
        
        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_message_sender.py
    
        3.定时任务: 每分钟判断执行消息发送
    
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))

    collecter = Sender(config.get("database"))

    callback = sys.argv[1]
    args = sys.argv

    # callback = 'information_message'
    # args = 'information_message'

    method = getattr(collecter, callback)
    if method: method(args)
