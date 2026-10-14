#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost="", charset='utf8'):

        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        
        self.flag = True
        self.list = []
        self.size = 400

        self.colum = u"""
            cs.name AS '客户',
            v1.name AS '楼盘',
            h1.housenumber AS '楼号',
            h1.innerarea AS '面积',
            su.userid AS '业务员编号',
            su.currentname AS '业务员',
            sd.name AS '业务部',
            sr.name AS '业务分区',
            db.name AS '业务类型',
            cs.createtime AS '创建时间',
            communion.kv('customer', 'customerChance', 'status', cs.status) AS '状态',
            cso.name AS '资源公司',
            du.userId AS '设计师ID',
            du.currentName AS '设计师',
            dd.name AS '设计部',
            dr.name AS '设计分区',
            cc.issueTime AS '分配时间',
            cco.name AS '机会公司',
            d.orderId AS '装修单号',
            v2.name AS '楼盘',
            h2.housenumber AS '楼号',
            h2.innerarea AS '面积',
            d.contracttime AS '签单时间',
            dsu.userid AS '设计师ID',
            dsu.currentName AS '设计师',
            cs.comment AS '备注'
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT 
                %s
            FROM
                customer.customerchance cc
                LEFT JOIN customer.customersource cs ON cc.csid = cs.csid
                LEFT JOIN communion.house h1 ON cc.hid = h1.hid
                LEFT JOIN communion.village v1 ON h1.vid = v1.vid
                LEFT JOIN data.decorationbusitype db ON cc.dbid = db.dbid
                LEFT JOIN communion.user su ON cs.cuid = su.uid
                LEFT JOIN communion.department sd ON su.deptid = sd.did
                LEFT JOIN communion.department sr ON sd.fdid = sr.did
                LEFT JOIN communion.user du ON cc.buid = du.uid 
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.company cso ON cs.company = cso.cid
                LEFT JOIN communion.company cco ON cc.company = cco.cid
                LEFT JOIN decoration.decoration d ON cc.orderId = d.orderId
                LEFT JOIN communion.house h2 ON d.hid = h2.hid
                LEFT JOIN communion.village v2 ON h2.vid = v2.vid
                LEFT JOIN communion.user dsu ON d.dsuid = dsu.uid
            WHERE 
                cc.issueTime >= '%s 00:00:00' AND
                cc.issueTime <= '%s 23:59:59' 
                %s
            """

    def sqler(self, timeargs, company):
    
        startTime, endTime = timeargs.split("-")
        
        if company != 0:
            companyId = u"AND cc.company = %s" % company
        else:
            companyId = u" "
        
        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, companyId)
        
    def rower(self, row):
    
        self.divNum(row, [3, 21])
        
        return row

    def main(self, pid, args, company):

        tableheads = [
            u'客户', u'楼盘', u'楼号', u'面积', u'业务员编号', u'业务员', u'业务部', u'业务分区', u'业务类型', u'创建时间', u'状态',
            u'资源公司', u'设计师ID', u'设计师', u'设计部', u'设计分区', u'分配时间', u'机会公司', u'装修单号', u'楼盘', u'楼号',
            u'面积', u'签单时间', u'设计师ID', u'设计师', "备注"
        ]
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"客户机会信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出客户机会信息数据脚本说明:
        根据查询条件,以分页拿数据的方式导出客户机会;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_customer_chance.py    pid              args              company
             plan_export_customer_chance.py    5010     2024/07/26-2024/07/26         1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))
