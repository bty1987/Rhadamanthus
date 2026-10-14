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
        self.size = 300

        self.colum = u"""
            g.gid,
            g.no,
            g.name,
            g.barcode,
            g.category,
            g.bid,
            b.brand,
            g.measurementUnit,
            g.pieceNum,
            communion.kv('data', 'goods', 'type', g.type)
        """

        self.SQL_QUERY = u"""
            SELECT %s FROM data.goods g, communion.brand b WHERE %s %s
        """

    # 公司条件识别(动态条件拼接场景: 无前置条件时不带AND)
    def company(self, cloumCompany, company, args):

        companyId = u"%s %s = %s" % (args != '' and 'AND' or '', cloumCompany, company)

        return companyId

    def sqler(self, args, company):

        strs = u""
        parameter = args.split(u',')

        for i, v in enumerate(parameter):

            if v == "": continue

            parm = v.split(u'-')

            if len(parm) != 2: continue

            if parm[0] == "status":
                strs = strs + u""" %s g.%s = %s """ % (i != 0 and "AND" or "", parm[0], parm[1])
            else:
                # like中的%需双写, 供exporter二次%格式化时还原为单个%
                strs = strs + u""" %s g.%s like "%%%%%s%%%%" """ % (i != 0 and "AND" or "", parm[0], parm[1])

        return self.SQL_QUERY % ("%s", strs, self.company(u"g.company", company, strs))

    def rower(self, row):

        self.divNum(row, [8])

        return row

    def main(self, pid, args, company):

        tableheads = [u"商品ID", u"商品编码", u"商品名称", u"条形码", u"品类", u"品牌ID", u"品牌", u"单位", u"件数", u"类型"]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, "", u"sheet1", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出商品脚本说明:
            根据查询条件,以分页拿数据的方式导出商品;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        查询条件(由页面传入) 对应数据库的字段名-字段值,方式拼接;
            3.company     公司cid, 0为全部(不传默认0)

        2.使用
            python plan_export_inventory_goods.py pid args company
            python plan_export_inventory_goods.py 942 no-UDJ293JJK23,name-水泥,barcode-UDJ293JJK23,brand-圣象地板,status-0, 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2] if len(sys.argv) > 2 else ""
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
