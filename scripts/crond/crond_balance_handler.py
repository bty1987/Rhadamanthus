#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import pymysql
import datetime
import os
import requests
import sys

class Handler():

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

    def auto_balance_selection(self, args):
        
        self.getDBCursor()

        sql = """
            INSERT balance.balanceselection (bid, name, brid, grade, cuid, createtime, status, company)
            SELECT 0, concat(b.name, '-', DATE_FORMAT(NOW(), '%Y%m%d'), '-D'), g.bid, 'D', si.ruid, current_timestamp, 0, si.company
            FROM quotation.selectionitem si 
            LEFT JOIN data.goods g ON si.gid = g.gid 
            LEFT JOIN communion.brand b ON g.bid = b.bid 
            LEFT JOIN balance.balanceselection bs ON (g.bid = bs.brid AND bs.grade = 'D' AND bs.status = 0) 
            LEFT JOIN balance.balanceselectionitem bsi ON si.siid = bsi.siid 
            WHERE si.status = 5 AND si.accountStatus = 0 AND bsi.bsiid is null AND bs.bsid is null AND si.reviewTime >= TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)) AND si.reviewTime < TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY))
            GROUP BY g.bid;
        """
        
        self.cursor.execute(sql)
        
        sql = """
            INSERT into balance.balanceselectionitem (bsid, siid)
            SELECT bs.bsid, si.siid FROM quotation.selectionitem si 
            LEFT JOIN data.goods g ON si.gid = g.gid 
            LEFT JOIN balance.balanceselectionitem bsi ON si.siid = bsi.siid 
            LEFT JOIN balance.balanceselection bs ON (g.bid = bs.brid AND bs.grade = 'D' AND bs.status = 0) 
            WHERE si.status = 5 AND si.accountStatus = 0 AND bsi.bsiid is null AND bs.bsid is not null AND si.reviewTime >= TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)) AND si.reviewTime < TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY))
            GROUP BY bs.brid, si.siid order by bs.bsid desc;
        """
        
        self.cursor.execute(sql)
        
        sql = """
            UPDATE balance.balanceselection bs, (
                SELECT bs.bsid, SUM(if(si.type in (2, 4),-(si.num-si.refnum),(si.num-si.refnum))*si.postprice/1000) amount 
                FROM balance.balanceselectionitem bsi, quotation.selectionitem si, balance.balanceselection bs
                WHERE si.accountstatus = 0 AND si.reviewTime >= TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)) AND si.reviewTime < TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY)) AND si.siid = bsi.siid AND bsi.bsid = bs.bsid
                GROUP BY bs.bsid) t 
            set bs.cost = t.amount, bs.payment = t.amount WHERE bs.bsid = t.bsid;
        """
        
        self.cursor.execute(sql)
        
        sql = """
            UPDATE quotation.selectionitem si, balance.balanceselectionitem bsi 
            SET si.accountstatus = 1, si.accounttime = current_timestamp, si.auid = si.ruid
            WHERE si.siid = bsi.siid AND si.accountstatus = 0 AND si.reviewTime >= TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)) AND si.reviewTime < TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 0 DAY));
        """
        
        self.cursor.execute(sql)
        
        sql = """
            UPDATE quotation.selectionitem si SET si.ruid = si.fuid, si.reviewTime = current_timestamp, si.status = 5
            WHERE si.accountstatus = 0 AND si.status = 4 AND si.finishTime <= TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 14 DAY)) AND si.type in (2, 4, 14);
        """
        
        self.cursor.execute(sql)

        self.commit()

        self.closeDBConnect()

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

    collecter = Handler(config.get("database"))

    callback = sys.argv[1]
    args = sys.argv

    # callback = 'information_message'
    # args = 'information_message'

    method = getattr(collecter, callback)
    if method: method(args)
