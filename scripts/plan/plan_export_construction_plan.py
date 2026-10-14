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
            dr.name AS `设计分区`,
            dd.name AS `设计部`,
            du.currentname AS `设计师`,
            sd.name AS `监理部门`,
            su.currentname AS `监理`,
            h.innerArea AS `计价面积`,
            d.houseClass AS `房屋类型`,
            cp.name AS `工程节点名称`,
            cp.createtime AS `工程节点创建时间`,
            cp.startTime AS `工程节点开始时间`,
            cp.endTime AS `工程节点结束时间`
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT
                %s
            FROM
            construction.constructionplan cp
            LEFT JOIN decoration.decoration d ON cp.orderId = d.orderId
            LEFT JOIN communion.house h ON d.hid = h.hid
            LEFT JOIN communion.village v ON h.vid = v.vid
            LEFT JOIN communion. USER du ON d.dsuid = du.uid
            LEFT JOIN communion.department dd ON du.deptid = dd.did
            LEFT JOIN communion.department dr ON dd.fdid = dr.did
            LEFT JOIN communion. USER su ON d.svuid = su.uid
            LEFT JOIN communion.department sd ON su.deptid = sd.did
            WHERE
            cp.createtime >= '%s 00:00:00' AND
            cp.createtime <= '%s 23:59:59'
            %s
            """

    def sqler(self, timeargs, company):
    
        startTime, endTime = timeargs.split("-")
            
        if company != 0:
            companyId = u"AND %s = %s" % ("d.company", company)
        else:
            companyId = u" "
        
        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, companyId)
        
    def rower(self, row):
    
        self.divNum(row, [8])
        
        return row

    def main(self, pid, args, company):

        tableheads = [
            u'装修单号', u'楼盘', u"楼号", u'设计分区', u'设计部', u'设计师', u'监理部门', u'监理', u'计价面积', u'房屋类型',
            u'工程节点名称', u'工程节点创建时间', u'工程节点开始时间', u'工程节点结束时间'
        ]
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"工程计划", tableheads, self.colum, sql, self.rower)


if __name__ == '__main__':

    """
        导出工程计划功能脚本说明:
        根据查询条件,以分页拿数据的方式导出工程计划;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_construction_plan.py    pid          args              company
             plan_export_construction_plan.py    1314   2018/12/01-2018/12/31         1

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
