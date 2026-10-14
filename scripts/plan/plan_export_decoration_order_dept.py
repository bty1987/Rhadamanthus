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
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            h.buildArea AS `面积`,
            c.name AS `客户`,
            dd.name AS `设计部`,
            du.userId AS `设计师编号`,
            du.currentName AS `设计师`,
            sd.name AS `业务部`,
            su.userId AS `业务员编号`,
            su.currentname AS `业务员`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`,
            db.name AS `业务类型`,
            d.quotationPrice AS `报价额`,
            d.factprice AS `实收额`,
            dp.refermoney AS `设计费`,
            dh.serviceprice AS `服务费`
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer c ON d.customerid = c.cid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.user su ON d.smuid = su.uid
                LEFT JOIN communion.department sd ON su.deptid = sd.did
                LEFT JOIN payment.decorationpayment dp ON (d.orderid = dp.orderId AND dp.paymenttype = '设计费' AND dp.paymentstatus in (1, 2))
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
                LEFT JOIN data.decorationbusitype db ON d.busitype = db.dbid
            WHERE 
                d.contractTime >= '%s 00:00:00' AND
                d.contractTime <= '%s 23:59:59' AND
                d.company =  %s
                %s
            """

    def plan(self, pid):

        sql = "SELECT CONCAT(cuid, '') FROM information.plan WHERE pid = %s" % pid

        self.cursor.execute(sql)

        plan = self.cursor.fetchall()

        return (plan and len(plan) >= 1) and plan[0][0] or None

    def deptright(self, uid, company):

        depts = []

        sql = "SELECT CONCAT(did, '') FROM platform.decorationdesigndepartmentright WHERE uid = %s AND company = %s" % (uid, company)
        self.cursor.execute(sql)
        rights = self.cursor.fetchall()

        for right in rights:
            depts.append(right[0])
            
        condition = ",".join(depts)

        return condition != "-1" and " AND dd.did IN (%s) " % condition or ""

    def statusright(self, uid, company):

        status = []

        sql = "SELECT CONCAT(status, '') FROM platform.decorationstatusright WHERE uid = %s AND company = %s" % (uid, company)
        self.cursor.execute(sql)
        rights = self.cursor.fetchall()

        for right in rights:
            status.append(right[0])

        condition = ",".join(status)

        return condition != "-1" and " AND d.status in (%s)" % condition or ""

    def dept(self, uid, company):

        depts = []

        sql = "select CONCAT(deptid, '') from communion.user where uid = %s" % uid
        self.cursor.execute(sql)
        users = self.cursor.fetchall()

        did = (users and len(users) >= 1) and users[0][0] or -1

        depts.append(did)

        sql = "select CONCAT(did, '') from communion.department where fdid = %s" % did
        self.cursor.execute(sql)
        infos = self.cursor.fetchall()

        for info in infos:
            depts.append(info[0])

        return ",".join(depts)    

    def sqler(self, timeargs, company, right):

        startTime, endTime = timeargs.split("-")

        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, company, right)

    def rower(self, row):

        self.divNum(row, [14, 15, 16, 17])

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u'装修单号', u'楼盘', u'楼号', u'面积', u'客户', u'设计部', u'设计师编号', u'设计师', u'业务部', u'业务员编号',
            u'业务员', u'类型', u'状态', u'业务类型', u'报价额', u'实收额', u'设计费', u'服务费'
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        uid = self.plan(pid)

        if not uid: return
        
        right = ""

        if type == '0':
            right = " AND dd.did IN (%s)" % self.dept(uid, company)
        elif type == '1':
            right = right + self.deptright(uid, company)
            right = right + self.statusright(uid, company)
            
        if right == "": right = " AND dd.did in (-1) "

        sql = self.sqler(args, int(company), right)

        self.exporter(pid, args, u"装修签单部门信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出装修签单部门信息脚本说明:
        根据查询条件,以分页拿数据的方式导出签单装修签单部门信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid    information.plan的主键;
            2.args    创建时间 "2018/12/13-2018/12/13"
            3.company 公司 1
        2.脚本传参说明:
             plan_export_decoration_order_dept.py    type    pid    args    company
             plan_export_decoration_order_dept.py    0    4916    "2023/10/01-2023/10/31"    1

        3.注:
            1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # type = "1"
    # pid = 299
    # args = "2023/10/01-2023/10/31"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
