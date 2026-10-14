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
            a.no,
            a.name,
            a.format,
            communion.kv('information', 'awardstock', 'type', a.type),
            communion.kv('information', 'awardstock', 'storeroom', a.storeroom),
            communion.kv('information', 'awardstock', 'subtype', a.subtype),
            communion.kv('information', 'awardstock', 'isStock', a.isStock),
            a.num,
            a.content,
            communion.kv('information', 'awardstock', 'status', a.status)
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                information.awardstock a
            WHERE
                1 = 1
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, company):

        return self.SQL_QUERY % ("%s", self.company("a.company", company))

    def rower(self, row):

        self.divNum(row, [7])

        row[7] = int(row[7])

        return row

    def main(self, pid, company):

        tableheads = [
            u"编号", u"名称", u"规格", u"类型", u"库房", u"子类", u"是否计入库存", u"数量", u"备注", u"状态"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)

        self.exporter(pid, '', u"奖品库存", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出奖品库存脚本说明:
        根据查询条件,以分页拿数据的方式导出奖品库存;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        预留参数(当前未使用,占位必传);
            3.company     公司cid, 0为全部
        2.脚本传参说明:
             plan_export_information_award_stock.py pid  args  company
             plan_export_information_award_stock.py 929   0      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, int(company))
