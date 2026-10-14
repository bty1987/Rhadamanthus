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
            v.name,
            h.housenumber,
            h.buildArea,
            h.innerArea,
            dr.name,
            dd.name,
            du.currentname,
            pp.name,
            p.quoteArea,
            p.quotePrice,
            p.preferPrice,
            p.managePrice,
            p.accdPrice + p.accmPrice,
            p.basicPrice,
            p.adddPrice + p.addmPrice,
            p.subdPrice + p.submPrice,
            p.totalPrice,
            p.discount,
            d.thingCut,
            d.couponCut,
            d.thingCut + d.couponCut,
            communion.kv('decoration', 'decoration', 'status', d.status)
        """

        self.SELECT_SQL = u"""
            select
                %s
            from
                decoration.decoration d,
                quotation.protation p,
                quotation.presignproduce pp,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.user du
            where
                d.precontractTime > '%s 00:00:00'
                AND d.precontractTime < '%s 23:59:59'
                AND d.orderId = p.orderId
                AND p.defaults = 1
                AND p.ppid = pp.ppid
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
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

        return self.SELECT_SQL % ("%s", startTime, endTime, self.company("d.company", company))

    def rower(self, row):

        # 装修状态已由SQL层communion.kv翻译, rower仅做金额/面积÷1000
        self.divNum(row, [3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"建筑面积", u"计价面积", u"设计分区", u"设计部", u"设计师", u"预签产品", u"计价面积",
            u"起报价", u"优惠金额", u"管理费", u"赋能总额", u"功能区总额", u"个性化总额", u"减项总额", u"总额", u"折扣", u"物品优惠",
            u"券优惠", u"优惠总额", u"装修状态"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"整装预签信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出整装预签信息脚本说明:
            根据查询条件,以分页拿数据的方式导出整装预签信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_quotation_protation.py  pid args company
            plan_export_quotation_protation.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
