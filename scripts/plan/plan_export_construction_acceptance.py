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
        self.size = 200

        self.colum = u"""
            d.orderId,
            v.NAME,
            h.housenumber,
            d.grade,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            busitype.name,
            communion.kv('decoration', 'decoration', 'status', d.status),
            h.buildArea,
            h.freeArea,
            h.innerArea,
            h.totalArea,
            dr.NAME,
            dd.NAME,
            du.userid,
            du.currentname,
            sv.userid,
            sv.currentname,
            co.NAME,
            d.precontractTime,
            d.contractTime,
            d.precontractPrice,
            d.orderTotalPrice,
            d.factPrice,
            d.paySacle,
            d.couponCut,
            d.thingCut,
            SUM(IF( ar.type = 0, ar.total, 0 )),
            SUM(IF( ar.type = 1, ar.total, 0 ))
        """

        self.SQL_QUERY_STR = u"""
            SELECT
                %s
            FROM
                construction.acceptance ca
                LEFT JOIN decoration.decoration d ON ca.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid 
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did 
                LEFT JOIN communion.user sv ON d.svuid = sv.uid 
                LEFT JOIN communion.company co ON d.company = co.cid 
                LEFT JOIN quotation.addreduce ar ON (d.orderId = ar.orderId AND ar.atttype = 0 AND ar.paytype = 0 AND ar.status IN (2, 3)),
                data.decorationbusitype AS busitype
            WHERE
                ca.acceptanceTime >= '%s 00:00:00' AND
                ca.acceptanceTime <= '%s 00:00:00' AND
                busitype.dbid = d.busitype AND 
                d.company = %s
            GROUP BY
	            d.orderId
        """

    def sqler(self, timeargs, company):
        startTime, endTime = timeargs.split("-")

        return self.SQL_QUERY_STR % ("%s", startTime, endTime, company)

    def rower(self, row):
        self.divNum(row, [7, 8, 9, 10, 20, 21, 22, 23, 24, 25, 26, 27])
        return row

    def main(self, pid, args, company):
        tableheads = [
            u'装修单号', u'楼盘', u"楼号", u"等级", u"类型", u"业务类型", u"状态", u"建筑面积", u"赠送面积", u"套内面积", u"总面积",
            u"设计分区", u"设计部", u"设计师编号", u"设计师", u"监理编号", u"监理", u"公司", u"预签时间", u"签单时间", u"预签额", u"签单额",
            u"实收额", u"付款比例", u"券优惠", u"物品优惠", u"工程增项金额合计", u"工程减项金额合计"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, int(company))
        self.exporter(pid, '', u"施工验收信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':
    """
        导出施工验收信息脚本说明:
            根据查询条件,以分页拿数据的方式导出施工验收信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

            1.参数说明参数要对应
                1.form        自动获取查询条件公司
                2.args        2023/12/01-2023/12/30
                3.company     公司:1
            2.脚本传参说明:
                 plan_export_construction_acceptance.py   form     pid      company
                 plan_export_construction_acceptance.py    0       6861      1

            3.注:
                1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4866
    # args = "2023/12/01-2023/12/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
