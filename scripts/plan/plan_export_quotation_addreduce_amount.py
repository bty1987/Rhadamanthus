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
        self.list = []
        self.size = 300

        self.colum = u"""
            d.orderId,
            h.houseNumber,
            v.`name`,
            dp.referMoney,
            communion.kv('quotation', 'addreduce', 'type', ar.type),
            IF (ari.subtype = 1,sum(ari.num * ari.unitprice)/1000,0),
            IF(subtype != 1 and subtype != 0, sum(ari.num * ari.unitprice)/1000, 0),
            ar.total,
            ar.managePrice,
            ar.taxPrice,
            ar.createTime,
            dr.collectTime,
            ar.sendTime,
            ar.affirmTime,
            communion.kv('quotation', 'addreduce', 'status', ar.status),
            c.`name`
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                quotation.addreduce ar
                LEFT JOIN payment.decorationpayment dp ON ar.dpid = dp.dpid
                LEFT JOIN payment.decorationreceipt dr ON dp.drid = dr.drid
                LEFT JOIN quotation.addreduceitem ari ON ar.arid = ari.arid
                LEFT JOIN decoration.decoration d ON dp.orderId = d.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.company c ON dp.company = c.cid
            WHERE
                %s >= '%s 00:00:00' AND %s <= '%s 23:59:59'
                %s
            GROUP BY
                ar.arid
        """

    # 公司条件识别
    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = "dr.collectTime"
        if type == "1":
            timeColumn = "ar.sendTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, self.company("dp.company", company))

    def rower(self, row):

        self.divNum(row, [3, 5, 6, 7, 8, 9])

        return row

    def main(self, pid, type, args, company):

        tableheads = [u"装修单号", u"楼号", u"楼盘", u"款项金额", u"增减类型", u"工程折前总价", u"主材折前总价", u"总价", u"管理费", u"税金",
                      u"创建时间", u"收款时间", u"推送时间", u"确认时间", u"状态", u"公司"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"报价增减工程信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
      报价增减工程信息统计脚本说明:
          根据查询条件,以分页形式导出报价增减工程信息统计信息;并上传到文件服务器中,可从任务页面上点击下载即可;
          当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
      1.传入必须参数说明
          1.type        0: 收款时间 1: 推送时间
          2.pid         information.plan的主键;
          3.args        2020/08/01-2020/08/30
          4.company     公司cid, 0为全部(不传默认0)
      2.命令使用 plan_export_quotation_addreduce_amount.py type pid args company
                plan_export_quotation_addreduce_amount.py 0 299 2020/08/01-2020/08/30 1

      """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args, int(company))
