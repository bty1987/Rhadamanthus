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
        self.size = 300

        self.column = u"""
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            du.currentname AS '设计师',
            dr.name AS '设计分区',
            dd.name AS '设计部',
            co.name AS '公司',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '类型',
            cn.name AS '工程状态',
            s.name AS '调研名称',
            s.createtime AS '创建时间',
            s.sendtime AS '推送时间',
            communion.kv('customer', 'survey', 'status', s.status) as '调研状态',
            si.name AS '调研问题名称',
            communion.kv('customer', 'survey', 'surveyType', si.type) as '问题类型',
            si.content AS '调研内容',
            so.title AS '调研选项'
        """

        self.QUERY_SQL_STR = u"""
            SELECT
                %s
            FROM
                customer.survey s
	            left join customer.surveyitem si on s.sid = si.sid
	            left join customer.surveyoption so on si.siid = so.siid and so.checked = 0,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion. USER du,
                communion.department dd,
                communion.department dr,
                communion.company co,
                DATA .constructionnode cn
            WHERE
                s.orderId = d.orderId
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND d.company = co.cid
                AND d.projectStatus = cn.cnid
                AND s.%s >= '%s 00:00:00'
                AND s.%s <= '%s 23:59:59'
                AND s.company = %s
        """

    def sqler(self, timeType, timeargs, company):
    
        startTime, endTime = timeargs.split("-")
        
        timeColumn = "finishTime"
        if timeType == "0":
            timeColumn = "finishTime"
        elif timeType == "1":
            timeColumn = "sendTime"
        
        return self.EXPORTER_SQL_STR % ("%s", timeColumn, startTime, timeColumn, endTime, company)

    def main(self, timeType, pid, args, company):
    
        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"设计师", u"设计分区", u"设计部", u"公司", u"签约类型", u"工程状态", u"调研名称", 
            u"创建时间", u"推送时间", u"调研状态", u"调研问题名称", u"问题类型", u"调研内容", u"调研选项"
        ]
        
        self.getDBCursor(self.host, self.username, self.password, self.charset)
        
        sql = self.sqler(timeType, args, int(company))
        
        self.exporter(pid, args, u"调研信息", tableheads, self.column, sql, None)

if __name__ == '__main__':
    """
        调研信息脚本说明:
            根据查询条件,以分页形式导出调研信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/12/01-2022/12/31
            3.company     公司:1
        2.命令使用 plan_export_payment_customer_survey_item.py  pid args company
                   plan_export_payment_customer_survey_item.py  4070 2022/12/01-2022/12/31 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    timeType = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(timeType, pid, args, company)