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
            b.name,
            b.kino,
            b.kiname,
            c.name,
            c.kino,
            c.kiname,
            s.currentname,
            co.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                communion.brand b
                left join communion.category c on b.cid = c.cid
                left join communion.company co on b.company = co.cid
                left join communion.USER s on b.ocuid = s.uid
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

        return self.SQL_QUERY % ("%s", self.company("b.company", company))

    def main(self, pid, company):

        tableheads = [u"品牌名称", u"品牌金蝶编号", u"品牌金蝶名称", u"品类名称", u"品类金蝶编号", u"品类金蝶名称", u"现用名", u"公司"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)

        self.exporter(pid, '', u"品牌信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出品牌脚本说明:
        根据查询条件,以分页拿数据的方式导出品牌信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.company     公司cid, 0为全部
        2.脚本传参说明:
             plan_export_data_brand.py pid   company
             plan_export_data_brand.py 929      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    if len(sys.argv) == 3:
        pid = sys.argv[1]
        company = sys.argv[2]
    elif len(sys.argv) == 4:
        pid = sys.argv[1]
        company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, int(company))
