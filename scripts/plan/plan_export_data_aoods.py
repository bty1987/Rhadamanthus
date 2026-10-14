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
            a.aid,
            g.NAME,
            g.category,
            g.brand,
            g.measurementUnit,
            a.selling
        """

        self.SQL_Data_Aoods = u"""
            SELECT
                %s
            FROM
                DATA.aoods a
                LEFT JOIN DATA.goods g ON a.gid = g.gid
            WHERE
                a.company = %s
                AND a.STATUS = 0
        """

    def sqler(self, company):

        return self.SQL_Data_Aoods % ("%s", company)

    def rower(self, row):

        self.divNum(row, [5])

        return row

    def main(self, pid, company):

        tableheads = [
            u'辅材ID', u'商品名', u'品牌', u'品类', u'单位', u'结算价'
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)
        
        self.exporter(pid, '', u"辅材商品", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':
    """
        导出辅材商品数据脚本说明:
            根据查询条件,以分页拿数据的方式导出辅材商品数据;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.form        自动获取查询条件公司
            2.pid         information.plan的主键;
            4.company     公司:1
        2.脚本传参说明:
             plan_export_data_aoods.py   form     pid      company
             plan_export_data_aoods.py    0       299      1

        3.注:
            1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    company = sys.argv[2]

    # pid = 4795
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, int(company))
