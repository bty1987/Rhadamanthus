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
        self.size = 400

        self.colum = u"""
            u.username,
            u.userid,
            d.name,
            u.phone,
            u.identity,
            ui.bankCardNum,
            co.name,
            communion.kv('personel', 'user', 'status', u.status)
        """

        self.SQL_Sales_Funds = u"""
            SELECT
                %s
            FROM
                communion.user u,
                communion.department d,
                communion.userinfo ui,
                communion.company co
            WHERE
                u.deptid = d.dId AND
                u.uid = ui.uid AND
                u.company = co.cid AND
                d.type = 8
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, company):

        return self.SQL_Sales_Funds % ("%s", self.company("u.company", company))

    def main(self, pid, company):

        tableheads = [u"姓名", u"工号", u"部门", u"电话号", u"身份证", u"银行卡", u"公司", u"状态"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)

        # 用户状态已由SQL层communion.kv翻译, 无需行加工; 无时间查询条件
        self.exporter(pid, None, u"工人信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
            导出工人信息脚本说明:
            根据查询条件,以分页拿数据的方式导出工人信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
            1.参数说明参数要对应
                1.pid         information.plan的主键;
                2.company     公司cid, 0为全部(不传默认0)
            2.脚本传参说明:
                plan_export_user_worker.py pid company
                plan_export_user_worker.py 1000 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    company = sys.argv[2] if len(sys.argv) > 2 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, int(company))
