#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):

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
            t.no,
            t.name,
            d.name,
            t.createTime,
            if(t.status = 0 , '禁用', '启用')
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
               communion.department d
               INNER JOIN communion.department t ON d.dId = t.fdid
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

        return self.SELECT_SQL % ("%s", self.company("t.company", company))

    def main(self, pid, company):

        tableheads = [u"编号", u"名称", u"所属分区", u"创建时间", u"状态"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(company)

        self.exporter(pid, '', u"部门", tableheads, self.colum, sql, None)

if __name__ == '__main__':
    """
        导出部门信息脚本说明:
            根据查询条件,以分页拿数据的方式导出部门信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.company     公司cid, 0为全部
        2.脚本传参说明:
            plan_export_department.py pid company
            plan_export_department.py  299 1

        """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, int(company))
