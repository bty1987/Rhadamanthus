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
            d.orderId,
            v.name,
            h.housenumber,
            su.userid,
            su.currentname,
            wu.userid,
            wu.currentName,
            cn.name,
            cu.sendTime,
            cu.finishTime,
            cu.rate,
            cu.rate1,
            cu.rate2,
            cu.assessment
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                construction.constructer AS cu,
                decoration.decoration AS d,
                communion.village AS v,
                communion.house AS h,
                communion.user AS su,
                communion.user AS wu,
                data.constructionnode AS cn
            WHERE
                cu.sendTime >= '%s 00:00:00' AND
                cu.sendTime <= '%s 23:59:59' AND
                cu.orderId = d.orderId AND
                d.hid = h.hid AND
                h.vid = v.vid AND
                cu.wuid = wu.uid AND
                d.svuid = su.uid AND
                cu.cnid = cn.cnid
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

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"监理工号", u"监理", u"工人工号", u"工人", u"施工节点", u"推送时间", u"确认时间",
            u"工地卫生", u"质量标准", u"沟通服务", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"工人评分信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出工人评分信息脚本说明:
            根据查询条件,以分页拿数据的方式导出工人评分信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_constructer_rate.py  pid args                  company
            plan_export_constructer_rate.py  299 2018/11/01-2018/11/30 1

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
