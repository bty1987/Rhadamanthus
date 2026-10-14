#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
    
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.size = 400

        self.colum = u"""
            pp.ppid AS `流水号`,
            pp.address AS `楼盘地址`,
            cu.userId AS `工号`,
            cu.currentname AS `姓名`,
            dt.name AS `职位`,
            co.name AS `分公司`,
            dr.name AS `分区`,
            dd.name AS `部门`,
            communion.kv('payment', 'proxyPayment', 'status', pp.status) AS `状态`,
            pp.createTime AS `创建时间`,
            pr.collectTime AS `收款时间`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                payment.proxypayment pp
                LEFT JOIN payment.proxyreceipt pr ON pp.prid = pr.prid
                LEFT JOIN communion.user cu ON pp.cuid = cu.uid
                LEFT JOIN communion.duty dt ON cu.did = dt.did
                LEFT JOIN communion.company co ON pp.company = co.cid
                LEFT JOIN communion.department dd ON pp.did = dd.did
                LEFT JOIN communion.department dr ON pp.rid = dr.did
            WHERE
              pp.isexpire = 0 AND
              %s >= '%s 00:00:00' AND
              %s <= '%s 23:59:59' 
        """

    def sqler(self, type, timeargs):

        startTime, endTime = timeargs.split("-")
        
        timetype = 'pp.createTime'
        
        if type == '0':
            timetype = 'pp.createTime'
        elif type == '1':
            timetype = 'pr.collectTime'

        return self.SELECT_SQL % ("%s", timetype, startTime, timetype, endTime)

    def main(self, type, pid, args):
    
        tableheads = [u"流水号", u"楼盘地址", u"工号", u"姓名", u"职位", u"分公司", u"分区", u"部门", u"状态", u'创建时间', u'收款时间']
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = exporter.sqler(type, args)
    
        self.exporter(pid, args, u"代付款信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出代付款信息脚本说明:
            根据查询条件,以分页拿数据的方式导出代付款信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
        2.脚本传参说明:
            plan_export_payment_proxy.py  type   pid   args
            plan_export_payment_proxy.py  0      299   2015/01/01-2015-01-01
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args)