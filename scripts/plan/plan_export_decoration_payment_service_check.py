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
            v.NAME,
            h.houseNumber,
            dr.NAME,
            dd.NAME,
            du.currentName,
            su.currentName,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.contractTime,
            dh.servicePrice,
            dh.servicePaidup,
            dh.servicePrice-dh.servicePaidup,
            d.balanceTime,
            communion.kv('decoration', 'decoration', 'repairStatus', d.repairStatus)
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationholonomy dh,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.`user` su,
                communion.`user` du
            WHERE
                d.hid = h.hid
                AND h.vid = v.vid
                AND d.dsuid = du.uid
                AND d.svuid = su.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND d.orderId = dh.orderId
                AND d.contractTime > '%s 00:00:00'
                AND d.contractTime < '%s 23:59:59'
                AND (dh.servicePrice - dh.servicePaidup) IS NOT NULL
                AND (dh.servicePrice - dh.servicePaidup) <> 0
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

        # 差额为0的行已下沉为SQL条件过滤(NULL差额原逻辑不跳过, 故用 IS NOT NULL AND <> 0 保持原语义)
        self.divNum(row, [9, 10, 11])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"设计分区", u"设计部", u"设计师", u"监理", u"装修单类型", u"签单时间", u"应收服务费", u"实收服务费",
            u"差额", u"内决时间", u"保修状态"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"服务费信息导出", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出服务款项验证脚本说明:
            根据查询条件,以分页拿数据的方式导出付款代理信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_decoration_payment_service_check.py  pid args company
            plan_export_decoration_payment_service_check.py  299 2022/12/01-2022/12/30 1
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
