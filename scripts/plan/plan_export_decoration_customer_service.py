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
            d.houseClass,
            h.innerArea,
            dr.name,
            dd.name,
            du.userId,
            du.currentName,
            sv.userId,
            sv.currentName,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.contracttime,
            communion.kv('decoration', 'decoration', 'status', d.status),
            cn.name,
            d.createtime,
            d.measureTime,
            d.accounttime,
            d.balancetime,
            dl.applayTime,
            ci.comment,
            c.companyName,
            c.companyBank,
            c.companyBankno,
            co.name AS `公司`
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did 
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user sv ON d.svuid = sv.uid
                LEFT JOIN data.constructionnode cn ON d.projectstatus = cn.cnid
                LEFT JOIN construction.drawline dl ON (d.orderId = dl.orderId AND dl.status IN (0, 2))
                LEFT JOIN construction.constructioninfo ci ON d.orderId = ci.orderId
                LEFT JOIN communion.company co ON d.company = co.cid
                LEFT JOIN communion.customer c ON d.customerId = c.cid
            WHERE
                %s >= '%s 00:00:00' AND 
                %s <= '%s 23:59:59' 
                %s
        """

    def sqler(self, type, timeargs, company):

        startTime, endTime = timeargs.split("-")
        
        column = "d.contractTime"
        
        if type == "0":
            column = "d.contractTime"
        
        if type == "1":
            column = "dl.applayTime"
            
        companyId = " "
        
        if int(company) != 0:
            companyId = u" AND %s = %s" % ("d.company", company)

        return self.EXPORTER_SQL_STR % ("%s", column, startTime, column, endTime, companyId)
        
    def rower(self, row):
    
        self.divNum(row, [4])
        
        return row

    def main(self, type, pid, args, company):

        tableheads = [
            "装修单号", "楼盘", u"楼号", "房屋类型", "计价面积", "设计分区", "设计部", "设计师工号", "设计师", "监理工号", 
            "监理", "订单类型", "签单时间", "状态", "工程状态", "创建时间", "量房时间", "决算时间", "内决时间", "放线时间", 
            "放线备注", "客户", "客户银行", "客户帐号", "公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)
        
        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"施工信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出装修单施工信息（签单时间）_外链统计脚本说明:
        根据查询条件,以分页拿数据的方式导出销售收款;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_decoration_customer_service.py    pid              args              company
             plan_export_decoration_customer_service.py    929     2018/12/01-2018/12/31         1

        3.注:
            1.结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args, int(company))
