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

        self.colum = """
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            d.houseClass AS `房屋类型`,
            dr.name AS `设计分区`,
            dd.name AS `设计部`,
            du.currentName AS `设计师`,
            sv.currentName AS `监理`,
            cn.name AS `工程状态`,
            communion.kv('decoration', 'decoration', 'designStatus', d.designStatus) AS `合同方案确认状态`,
            d.sdesignTime AS `合同方案确认时间`,
            communion.kv('construction', 'constructioninfo', 'handoverStatus', ci.handoverStatus) AS `预交会状态`,
            ci.handoverTime AS `交接时间`,
            communion.kv('decoration', 'decoration', 'sourceStatus', d.sourceStatus) AS `放线方案确认状态`,
            d.edesignTime AS `放线方案确认时间`,
            qfa.functionAreaName AS `功能区`,
            ai.itemName AS `项目名`,
            ai.workType AS `工种`,
            ai.measurementUnit AS `单位`,
            communion.kv('quotation', 'addreduce', 'type', a.type) AS '类型',
            communion.kv('quotation', 'addreduce', 'atttype', a.atttype) AS '类型',
            communion.kv('quotation', 'addreduce', 'paytype', a.paytype) AS '类型',
            communion.kv('quotation', 'addreduceitem', 'type', ai.type) AS '类型',
            communion.kv('quotation', 'addreduceitem', 'subtype', ai.subtype) AS '类型',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS '类型',
            ai.num AS `数量`,
            ai.unitPrice AS `折前单价`,
            ai.num*ai.unitPrice/1000 AS `折前金额`,
            d.factPrice AS `实收额`,
            co.name AS `公司`
        """

        self.SELECT_SQL = """
            SELECT
                %s
            FROM
                decoration.decoration d 
                LEFT JOIN data.constructionnode cn on d.projectStatus = cn.cnid
                LEFT JOIN communion.user sv ON d.svuid = sv.uid
                LEFT JOIN construction.constructioninfo ci ON d.orderId = ci.orderId,
                quotation.addreduce a
                LEFT JOIN payment.decorationpayment dp ON a.dpid = dp.dpid
                LEFT JOIN payment.decorationreceipt dr ON dp.drid = dr.drid,
                quotation.addreduceitem ai, 
                quotation.quotationfunctionarea qfa,
                communion.house h,
                communion.village v,
                communion.department dr,
                communion.department dd,
                communion.user du,
                communion.company co
            WHERE
                %s >= '%s 00:00:00' 
                AND %s <= '%s 23:59:59' 
                AND d.orderId = a.orderId 
                AND a.status in (2, 3)
                AND a.arid = ai.arid 
                AND ai.quotationFunctionAreaId = qfa.qfaId
                AND d.hid = h.hid 
                AND h.vid = v.vid 
                AND d.dsuid = du.uid 
                AND du.deptId = dd.did 
                AND dd.fdid = dr.did 
                AND d.company = co.cid 
                %s 
        """

    def sqler(self, timeargs, company):

        startTime, endTime = timeargs.split("-")

        if company != 0:
            companyId = " AND d.company = %s" % (company)
        else:
            companyId = " "

        return self.SELECT_SQL % ("%s", self.timeColumn, startTime, self.timeColumn, endTime, companyId)

    def rower(self, row):

        self.divNum(row, [25, 26, 27, 28])

        return row

    def main(self, type, pid, args, company):

        self.timeColumn = "d.contractTime"
        if type == "0":
            self.timeColumn = "d.contractTime"
        elif type == "1":
            self.timeColumn = "d.accountTime"
        elif type == "2":
            self.timeColumn = "a.sendTime"
        elif type == "3":
            self.timeColumn = "a.createTime"
        elif type == "4":
            self.timeColumn = "dr.collectTime"
        elif type == "5":
            self.timeColumn = "d.balanceTime"
        elif type == "6":
            self.timeColumn = "ci.handoverTime"

        tableheads = [
            "装修单号", "楼盘", "楼号", "房屋类型", "设计分区", "设计部", "设计师", "监理",
            "工程状态", "合同方案确认状态", "合同方案确认时间", "预交会状态", "交接时间", "放线方案确认状态", "放线方案确认时间",
            "功能区", "项目名", "工种", "单位", "类型", "业务类型", "付款类型", "类型", "类型", "订单类型", 
            "数量", "折前单价", "折前金额", "实收额", "公司"
        ]

        sql = self.sqler(args, company)

        self.exporter(pid, args, "增减项信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出增减项信息脚本说明:
            根据查询条件,以分页拿数据的方式导出增减项信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.type        时间类型 0:签单时间 1:结算时间 2:发送时间 3:创建时间 4:收款时间 5:决算时间 6:交接时间;
            2.pid         information.plan的主键;
            3.args        2018/11/01-2018/11/30
            4.company     0
        2.脚本传参说明:
            plan_export_quotation_addreduce_item.py  type pid args company
            plan_export_quotation_addreduce_item.py  0 299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
