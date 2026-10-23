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
        self.size = 4000

        self.colum = u"""
            d.orderId,
            v.name,
            h.houseNumber,
            dr.name,
            dd.name,
            du.currentName,
            su.currentName,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            dp.paymentType,
            dp.referMoney,
            cs.endTime,
            pcn.name,
            cn.name,
            d.balanceTime,
            communion.kv('decoration', 'decoration', 'repairStatus', d.repairStatus),
            communion.kv('decoration', 'decoration', 'status', d.status),
            co.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.user su,
                communion.user du,
                payment.decorationpayment dp,
                construction.constructionschedule cs,
                data.constructionnode cn,
                data.constructionnode pcn,
                communion.company co
            WHERE
                d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND d.svuid = su.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND d.orderId = cs.orderId
                AND cs.cnid = cn.cnid
                AND d.orderId = dp.orderId
                AND d.projectstatus = pcn.cnid
                AND d.company = co.cid
                AND ((dp.paymentType = '二期款' AND cn.name = '瓦工' AND cs.status = 2) OR
                     (dp.paymentType = '二期款' AND cn.name = '木工' AND cs.status = 1) OR
                     (dp.paymentType = '尾款' AND cn.name = '油工' AND cs.status = 2) OR
                     (dp.paymentType = '尾款' AND cn.name = '保洁' AND cs.status = 1) OR
                     ((dp.paymentType = '增项款' OR dp.paymentType = '减项款') AND cn.name = '放线'))
                AND dp.paymentStatus = 0
                AND d.contractTime >= '%s 00:00:00'
                AND d.contractTime <= '%s 23:59:59'
                %s
            GROUP BY dp.dpid
        """

        self.SQL_QUERY_FINISH = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.user su,
                communion.user du,
                payment.decorationpayment dp,
                construction.constructionschedule cs,
                data.constructionnode cn,
                data.constructionnode pcn,
                communion.company co,
                construction.construction c
            WHERE
                d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND d.svuid = su.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND d.orderId = cs.orderId
                AND cs.cnid = cn.cnid
                AND d.orderId = dp.orderId
                AND d.projectstatus = pcn.cnid
                AND d.company = co.cid
                AND c.orderId = d.orderId
                AND ((dp.paymentType = '二期款' AND cn.name = '瓦工' AND cs.status = 2) OR
                     (dp.paymentType = '二期款' AND cn.name = '木工' AND cs.status = 1) OR
                     (dp.paymentType = '尾款' AND cn.name = '油工' AND cs.status = 2) OR
                     (dp.paymentType = '尾款' AND cn.name = '保洁' AND cs.status = 1) OR
                     ((dp.paymentType = '增项款' OR dp.paymentType = '减项款') AND cn.name = '放线'))
                AND dp.paymentStatus = 0
                AND c.finishTime >= '%s 00:00:00'
                AND c.finishTime <= '%s 23:59:59'
                %s
            GROUP BY dp.dpid
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, args, company, type=0):

        startTime, endTime = args.split("-")

        # type: 0=按签单时间过滤(缺省, 历史行为) / 1=按工程验收时间(construction.construction.finishTime)过滤
        sql = self.SQL_QUERY_FINISH if type == 1 else self.SQL_QUERY

        return sql % ("%s", startTime, endTime, self.company("d.company", company))

    def rower(self, row):

        self.divNum(row, [9])

        # 说明列由款项类型+工程节点翻译(业务规则文案, 非常量码值, 保留rower翻译)
        if row[8] == '二期款' and row[11] == '瓦工': row[12] = u"瓦工完工未交二期款"
        if row[8] == '二期款' and row[11] == '木工': row[12] = u"木工开工未交二期款"
        if row[8] == '尾款' and row[11] == '油工': row[12] = u"油工完工未交尾款"
        if row[8] == '尾款' and row[11] == '保洁': row[12] = u"保洁开工未交尾款"
        if row[8] == '增项款': row[12] = u"签单未交增项款"
        if row[8] == '减项款': row[12] = u"签单未交减项款"

        return row

    def main(self, pid, args, company, type=0):

        tableheads = [u"装修单号", u"楼盘", u"楼号", u"设计分区", u"设计部", u'设计师', u'监理', u'装修单类型', u"款项类型", u"款项金额",
                      u"完工时间", u"工程节点", u"说明", u"内决时间", u"保修状态", u"状态", u"公司"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company, type)

        self.exporter(pid, args, u"款项工程验证", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出款项工程验证(导出瓦工完工未缴二期款/木工完工未缴尾款)脚本说明:
            根据查询条件,以分页拿数据的方式导出瓦工完工未缴二期款/木工完工未缴尾款信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     公司cid, 0为全部(不传默认0)
            4.type        查询时间类型: 0=签单时间(缺省, 历史行为) / 1=工程验收时间(construction.construction.finishTime)
        2.脚本传参说明(与exporter族type前置惯例一致):
            plan_export_decoration_payment_construction_check.py  type pid args company
            plan_export_decoration_payment_construction_check.py  0 299 2022/12/01-2022/12/30 1
            plan_export_decoration_payment_construction_check.py  1 299 2022/12/01-2022/12/30 1
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
    exporter.main(pid, args, int(company), int(type))
