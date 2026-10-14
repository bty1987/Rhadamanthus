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
            d.orderId,
            v.name,
            h.housenumber,
            sai.activity,
            sai.name,
            communion.kv('sales', 'salesactivityitem', 'type', sai.type),
            communion.kv('sales', 'salesactivityitem', 'state', sai.state),
            communion.kv('sales', 'salesactivityitem', 'isAffirm', sai.isAffirm),
            sai.money,
            sai.num,
            (sai.money * sai.num)/1000,
            du.currentname,
            dd.name,
            dr.name,
            ou.currentName,
            sai.operateTime,
            sai.comment,
            ru.currentName,
            sai.refundTime,
            sai.content
        """

        self.EXPORTER_SQL_STR = u"""
           SELECT
                %s
            FROM
                sales.salesactivityitem sai
                LEFT JOIN decoration.decoration d ON sai.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid 
                LEFT JOIN communion.department dd ON du.deptid = dd.did 
                LEFT JOIN communion.department dr ON dd.fdid = dr.did 
                LEFT JOIN communion.user ou ON sai.ouid = ou.uid 
                LEFT JOIN communion.user ru ON sai.ruid = ru.uid
                
            WHERE 
                sai.createtime >= '%s 00:00:00' AND
                sai.createtime <= '%s 23:59:59' 
                %s
            """

    def sqler(self, timeargs, company):
    
        startTime, endTime = timeargs.split("-")

        if company != 0:
            companyStr = u"AND %s = %s" % ("d.company", company)
        else:
            companyStr = u" "
        
        return self.EXPORTER_SQL_STR % ("%s", startTime, endTime, companyStr)

    def rower(self, row):
    
        self.divNum(row, [8, 9, 10])
        
        return row

    def main(self, pid, args, company):

        tableheads = [
            u'装修单号', u'楼盘', u'楼号', u'活动名称', u'奖品名称', u'类型', u' 状态', u'是否确认', u'金额', u'数量',
            u'总额', u'设计师', u'设计部', u'设计分区', u'操作人', u'操作时间', u'说明', u'操作人', u'操作时间', u'说明'
        ]
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, int(company))

        self.exporter(pid, args, u"销售活动物品明细", tableheads, self.colum, sql, self.rower)


if __name__ == '__main__':

    """
        导出销售活动物品明细脚本说明:
        根据查询条件,以分页拿数据的方式导出销售活动物品明细;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid    information.plan的主键;
            2.args    创建时间 "2018/12/13-2018/12/13"
            3.company 公司 1
        2.脚本传参说明:
             plan_export_sales_activity_item.py    pid    args    company
             plan_export_sales_activity_item.py    4916   "2023/10/01-2023/10/31"    1

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
