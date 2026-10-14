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
            d.orderId,
            v.`name`,
            h.houseNumber,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            communion.kv('decoration', 'decoration', 'status', d.status),
            d.precontractTime,
            u.userId,
            u.currentName,
            dd.no,
            dd.name,
            dr.no,
            dr.name,
            db.rate,
            d.precontractPrice,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate),
            d.couponCut,
            d.thingCut
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                left join communion.house AS h on d.hid = h.hid
                left join communion.village AS v on h.vid = v.vid
                left join decoration.decorationbelong AS db on d.orderId = db.orderId and db.`status` = 0 and db.`type` = 0
                left join communion.`user` AS u on db.buid = u.uid
                left join communion.department AS dd on db.did = dd.did
                left join communion.department AS dr on db.rid = dr.did
                left join quotation.quotation AS q on d.orderId = q.orderId and q.defaults = 1
            WHERE
                d.precontractTime >= '%s 00:00:00'
                AND d.precontractTime <= '%s 23:59:59'
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("d.company", company))

    def rower(self, row):

        self.divNum(row, [12, 13, 14, 15, 16])

        rates = float(row[12])

        row[13] = float(row[13]) + float(row[15])  # 签单总额 = 预签额 + 券优惠
        notSalesPrice = float(row[14])  # 非业务提成
        couponCut = float(row[15])  # 券优惠
        thingCut = float(row[16])  # 物品优惠

        # 净业绩 = 签单总额 - 非业务提成 - 券优惠 - 物品优惠
        template = (int(row[13]) - int(notSalesPrice) - int(couponCut) - int(thingCut)) * rates

        row = row[0:14]
        row.append(template)

        self.rates(row, rates, [13])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"类型", u"状态", u"预签时间", u"设计师编号", u'设计师', u'设计部编号', u'设计部',
            u"设计分区编号", u"设计分区", u"比例", u"签单额", u"净业绩"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"整装设计师签单业绩", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        整装设计师签单业绩脚本说明:
            根据查询条件,以分页拿数据的方式导出设计师签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_decoration_achievement_prosign_design.py  pid args company
            plan_export_decoration_achievement_prosign_design.py  299 2022/12/01-2022/12/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))
