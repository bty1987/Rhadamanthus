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
            v.name,
            h.housenumber,
            dr.name,
            dd.name,
            du.currentname,
            sv.currentname,
            qfa.functionAreaName,
            ei.itemName,
            ei.workType,
            ei.measurementUnit,
            communion.kv('quotation', 'extension', 'type', e.type),
            communion.kv('quotation', 'extensionitem', 'type', ei.type),
            communion.kv('quotation', 'extensionitem', 'subtype', ei.subtype),
            ei.num,
            ei.unitPrice,
            ei.num*ei.unitPrice/1000,
            d.factPrice,
            p.product,
            co.name
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN quotation.protation p on (d.orderId = p.orderId and p.defaults = 1)
                LEFT JOIN construction.construction c on d.orderId = c.orderId
                LEFT JOIN communion.user sv ON d.svuid = sv.uid
                LEFT JOIN quotation.extension e ON d.orderId = e.orderId
                LEFT JOIN quotation.extensionitem ei ON e.eid = ei.eid
                LEFT JOIN quotation.quotationfunctionarea qfa ON ei.quotationfunctionareaid = qfa.qfaid
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE
                %s > '%s 00:00:00' AND
                %s < '%s 23:59:59'
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = "d.contractTime"
        if type == "0":
            timeColumn = "d.contractTime"
        elif type == "1":
            timeColumn = "d.accountTime"
        elif type == "2":
            timeColumn = "c.finishTime"

        return self.SELECT_SQL % ("%s", timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

    def rower(self, row):

        # 类型三列已由SQL层communion.kv翻译, rower仅做金额÷1000与监理缺省
        self.divNum(row, [14, 15, 16, 17])

        row[6] = row[6] if row[6] else u"暂无"

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"设计分区", u"设计部", u"设计师", u"监理", u"功能区", u"报价名称", u"工种",
            u"单位", u"类型", u"类型", u"类型", u"数量", u"折前单价", u"折前金额", u"实收额", u"预签产品", u"公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"拓展项信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出拓展项信息脚本说明:
            根据查询条件,以分页拿数据的方式导出拓展项信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.type        签单时间 0/决算时间 1/完工时间 2
            2.pid         information.plan的主键 3143;
            3.args        2018/11/01-2018/11/30
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_extension_item.py type  pid args company
            plan_export_extension_item.py  0  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
