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
            h.hid,
            v.name,
            c.name,
            ddr.name,
            ddd.name,
            dr.name,
            dd.name,
            du.userid,
            du.currentname,
            sr.name,
            sd.name,
            su.userid,
            su.currentName,
            eu.currentName,
            h.innerarea,
            d.createTime,
            d.measureTime,
            da.meetTime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            communion.kv('decoration', 'decoration', 'status', d.status),
            cn.name,
            bt.name,
            co.name,
            cc.annotate,
            cc.comment,
            if(acsa.aid != null, acsa.comment, acso.comment),
            if(acsa.aid != null, acsa.annotate, acso.annotate)
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN decoration.decorationaddition AS da ON da.orderId = d.orderId
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.smuid = su.uid
                LEFT JOIN communion.department AS dd ON du.deptid = dd.did
                LEFT JOIN communion.department AS sd ON su.deptid = sd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN communion.department AS sr ON sd.fdid = sr.did
                LEFT JOIN communion.department AS ddd ON d.ddid = ddd.did
                LEFT JOIN communion.department AS ddr ON ddd.fdid = ddr.did
                LEFT JOIN communion.company AS co ON d.company = co.cid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN data.decorationbusitype AS bt ON d.busitype = bt.dbid
                LEFT JOIN data.constructionnode AS cn ON d.projectstatus = cn.cnid
                LEFT JOIN customer.customerchance AS cc ON cc.orderId = d.orderId
                LEFT JOIN customer.customersource AS cs ON cs.csid = cc.csid
                LEFT JOIN customer.customerorigin AS oc ON oc.orderId = d.orderId
                LEFT JOIN approval.approvalcustomersource AS acs ON cc.ccid = acs.ccid
                LEFT JOIN approval.approval AS acsa ON acs.aid = acsa.aid
                LEFT JOIN approval.approvalcustomerorigintdecoration AS aco ON oc.coid = aco.csid
                LEFT JOIN approval.approval AS acso ON aco.aid = acso.aid
            WHERE
                d.createTime >= '%s 00:00:00' AND
                d.createTime <= '%s 23:59:59'
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

        # type=1 按房产去重, 等价原逻辑: GROUP BY h.hid 且不加公司过滤
        if type == "1" or type == 1:
            tail = u" GROUP BY h.hid"
        else:
            tail = self.company("d.company", company)

        return self.SQL_QUERY % ("%s", startTime, endTime, tail)

    def rower(self, row):

        row[1] = str(row[1]).zfill(11)

        self.divNum(row, [15])

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u"装修单号", u"房产编号", u"楼盘", u"客户名", u"归属设计分区", u"归属设计部", u"设计分区", u"设计部", u"设计师工号", u"设计师",
            u"业务分区", u"业务部", u"业务员工号", u"业务员", u"跟单员", u"面积", u"创建时间", u"量尺时间", u"到店时间", u"订单类型",
            u"装修状态", u"工程状态", u"业务类型", u"公司", u"批注", u"备注", u"备注", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"shee1", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出量尺信息脚本说明:
            根据查询条件,以分页形式导出量尺信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        明细 0/按房产去重 1
            2.pid         information.plan的主键;
            3.args        2018/11/01-2018/11/30
            4.company     公司cid, 0为全部(不传默认0)
        2.命令使用 plan_export_decoration_order_measure.py  type pid args company
                   plan_export_decoration_order_measure.py  0 299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
