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
        self.size = 100

        self.colum = """
            d.orderId '装修单号',
            v.name '楼号',
            h.housenumber '楼号',
            h.innerarea '计价面积',
            dr.name '设计分区',
            dd.name '设计部',
            du.currentName '设计师',
            d.houseClass '房屋类型',
            qu.currentname '报价员',
            qd.totalPrice '报价总额',
            q.name '报价名称',
            communion.kv('quotation', 'quotation', 'attstatus', q.attstatus) '业务状态',
            q.createTime '提交时间',
            q.finishTime '完成时间',
            q.workTime '制作时长',
            q.auditTime '审核时长',
            TIMESTAMPDIFF(SECOND, q.createTime, q.finishTime) '总时长',
            co.name '公司'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM 
                quotation.quotation q 
                LEFT JOIN decoration.decoration d ON q.orderId = d.orderId
                LEFT JOIN quotation.quotation qd ON (q.orderId = qd.orderId AND qd.defaults = 1)
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid 
                LEFT JOIN communion.department dd ON du.deptid = dd.did 
                LEFT JOIN communion.department dr ON dd.fdid = dr.did 
                LEFT JOIN communion.user qu ON d.quid = qu.uid
                LEFT JOIN communion.company co ON d.company = co.cid 
            WHERE
                %s
        """
        
    def sts(self, seconds):
        
        days = seconds // 86400
        hours = (seconds % 86400) // 3600
        minutes = (seconds % 3600) // 60
        seconds = seconds % 60
        
        if days > 0:
            return f"{days}天 {hours:02d}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    def rower(self, row):
    
        self.divNum(row, [3, 9])
        
        #row[16] = self.sts(int(row[16]))
        row[16] = int(row[16] and row[16] or 0)

        return row

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        if company != 0:
            companyId = "AND d.company = %s " % company
        else:
            companyId = " "

        condition = " q.createtime >= '%s 00:00:00' AND q.createtime <= '%s 23:59:59' %s" % (startTime, endTime, companyId)

        return self.SQL_QUERY_STR % ("%s", condition)

    def main(self, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "装修单号", "楼盘", "楼号", "计价面积", "设计分区", "设计部", "设计师", "房屋类型", "预算员", "报价总价", 
            "报价名称", "状态", "提交时间", "完成时间", "制作时长", "审核时长", "总时长", "公司"
        ]
        sql = self.sqler(args, int(company))

        self.exporter(pid, "", "sheet1", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出客户资源信息说明:
            根据查询条件,以分页拿数据的方式导出客户资源信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid           information.plan的主键;
            2.args          "2024/07/01 - 2024/7/30"
            3.company       公司
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4991
    # args = "2024/07/01-2024/07/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
