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
            g.name,
            g.brand,
            g.category,
            communion.kv('quotation', 'selectionitem', 'type', qs.type),
            qs.postprice,
            qs.num,
            qs.refnum,
            qs.num-qs.refnum,
            s.total,
            qs.finishTime,
            qs.orderId,
            v.name,
            h.housenumber,
            su.name
        """

        self.SELECT_SQL = u"""
            select
                %s
            from
                quotation.selectionItem qs
                left join data.goods g on qs.gid = g.gid
                left join sales.sales s on qs.sid = s.sid
                left join decoration.decoration d on qs.orderId = d.orderId
                left join communion.house h on d.hid = h.hid
                left join communion.village v on h.vid = v.vid
                left join communion.supplier su on qs.sid = su.sid
            where
                qs.finishTime >= '%s'
                AND qs.finishTime <= '%s'
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

        return self.SELECT_SQL % ("%s", startTime, endTime, self.company("qs.company", company))

    def main(self, pid, args, company):

        tableheads = [u"名称", u"品牌", u"品类", u"类型", u"结算价", u"数量", u'退数量', u'剩余数量', u'总金额', u'完结时间', u'装修单号', u'楼盘', u'地址', u'供应商']

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        # 选材类型已由SQL层communion.kv翻译, 无需行加工
        self.exporter(pid, args, u"选材项导出", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出选材项完结脚本说明:
        根据查询条件,以分页拿数据的方式导出选材项完结数据;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2020/04/03-2020/04/13"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_selection_item_finish.py pid args company
             plan_export_selection_item_finish.py 929 2020/04/03-2020/04/13 1
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
