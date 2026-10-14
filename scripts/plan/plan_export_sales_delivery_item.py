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
            s.no,
            d.orderid,
            v.name,
            h.housenumber,
            du.currentname,
            dd.name,
            dr.name,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.contractTime,
            cn.name,
            communion.kv('decoration', 'decoration', 'status', d.status),
            s.category,
            s.brand,
            su.userid,
            su.currentName,
            iu.userid,
            iu.userName,
            vu.userName,
            communion.kv('sales', 'salesdeliveryitem', 'status', di.status),
            di.createtime,
            di.tranTime,
            tu.currentName,
            di.checkTime,
            chu.currentName,
            di.confirmTime,
            cou.currentName,
            di.finishTime,
            fu.currentName,
            di.protranTime,
            g.no,
            g.name,
            si.num,
            si.initnum-si.num
        """

        self.SQL_QUERY = u"""
            select
                %s
            from
                sales.salesdeliveryitem di
                LEFT JOIN communion.user tu ON di.tuid = tu.uid
                LEFT JOIN communion.user chu ON di.chuid = chu.uid
                LEFT JOIN communion.user cou ON di.couid = cou.uid
                LEFT JOIN communion.user fu ON di.fuid = fu.uid
                LEFT JOIN sales.salesitem si ON di.siid = si.siid
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN sales.sales s ON di.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN data.constructionNode cn ON cn.cnid = d.projectStatus
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user vu ON d.svuid = vu.uid
                LEFT JOIN communion.user iu ON s.iuid = iu.uid
                LEFT JOIN communion.department id ON iu.deptid = id.did
                LEFT JOIN communion.user su ON s.suid = su.uid
                LEFT JOIN communion.department gd ON s.gdid = gd.did
            where
                %s
                %s
        """

    def datetime(self, type, beginTime, endTime):

        if type == "0":
            _type = "di.createtime"
        elif type == "1":
            _type = "di.trantime"
        elif type == "2":
            _type = "di.protranTime"
        else:
            return " "

        return " %s >= '%s 00:00:00' AND %s <= '%s 23:59:59'" % (_type, beginTime, _type, endTime)

    def company(self, columnCompany, company):

        if company != 0:
            companyId = u"and %s = %s" % (columnCompany, company)
        else:
            companyId = u" "

        return companyId

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY % ("%s", self.datetime(type, startTime, endTime), self.company("di.company", company))

    def rower(self, row):

        # 装修单类型/订单状态/配送状态已由SQL层communion.kv翻译, rower仅做数量÷1000
        self.divNum(row, [31, 32])

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u"销售单号", u"装修单号", u"楼盘", u"楼号", u"设计师", u"设计部", u"设计分区", u"装修单类型", u"签单时间", u"工程状态", u"订单状态",
            u"品类", u"品牌", u"渠道工号", u"渠道", u"驻店工号", u"驻店人", u"监理", u"配送状态", u"创建时间", u"配送时间", u"配送人",
            u"审核时间", u"审核人", u"确认时间", u"确认人", u"完结时间", u"完结人", u"预计配送时间", u"商品编号", u"商品名称", u"数量",
            u"退货数量"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"销售配送项", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出销售配送项统计脚本说明:
        根据查询条件(配送的创建时间),以分页拿数据的方式导出销售配送项;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        创建时间 0/配送时间 1/预计配送时间 2
            2.pid         information.plan的主键;
            3.args        "2021/04/01-2021/04/15"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            plan_export_sales_delivery_item.py type   pid         args             company
            plan_export_sales_delivery_item.py  0     2892 2021/04/01-2021/04/15      1

        3.注:
            1.结束时间不能大于开始时间31天
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
