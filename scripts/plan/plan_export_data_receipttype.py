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
            rt.name,
            rt.no,
            rt.type,
            rt.fund,
            rt.status,
            rt.grade,
            rt.kibalance,
            rt.kiname,
            rt.kino,
            rt.bankno,
            co.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                data.receipttype rt,
                communion.company co
            WHERE
                rt.company = co.cid
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, company):

        return self.SQL_QUERY % ("%s", self.company("rt.company", company))

    def rower(self, row):

        row[2] = self.reType[row[2]]
        row[3] = self.reFund[row[3]]
        row[4] = self.reStatus[row[4]]

        return row

    def main(self, pid, company):

        tableheads = [u"名称", u"键值", u"类型", u"资金类型", u"状态", u"等级", u"结算方式", u"金蝶名称", u"金蝶编号", u"银行卡", u"公司"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)

        self.exporter(pid, '', u"集团收据类型", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出集团收据类型脚本说明:
        根据查询条件,以分页拿数据的方式导出集团收据类型;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_data_receipttype.py pid   company
             plan_export_data_receipttype.py 929      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    company = sys.argv[2] if len(sys.argv) > 2 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, int(company))
