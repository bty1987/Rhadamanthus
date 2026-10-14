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

        self.type = {
            1: u"退货",
            2: u"全退",
            3: u"倒单"
        }

        self.colum = u"""
            sal.orderId,
            cc.name,
            v.name,
            h.houseNumber,
            sal.no,
            c.name,
            sal.brand,
            u.userId,
            u.currentName,
            d.name,
            da.name,
            sal.total,
            sal.amount,
            apr.refund,
            ua.currentName,
            ur.userName,
            apr.type,
            app.createTime,
            app.approvalTime,
            communion.kv('approval', 'approval', 'status', app.status),
            app.contents,
            app.comment,
            app.annotate,
            b.kino,
            b.kiname
        """

        self.SQL_APPROVAL_APPROVALSALESREFUND = u"""
            select
                %s
            from
                approval.approvalsalesrefund AS apr
                LEFT JOIN approval.approval AS app on apr.aid = app.aid
                LEFT JOIN sales.sales AS sal ON apr.sid = sal.sid
                LEFT JOIN communion.house AS h ON sal.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.`user` as u on sal.suid = u.uid
                LEFT JOIN communion.`user` as ua on app.suid = ua.uid
                LEFT JOIN communion.`user` as ur on app.ruid = ur.uid
                LEFT JOIN communion.department as da on sal.did = da.dId
                LEFT JOIN communion.department as d on sal.rid = d.dId
                LEFT JOIN communion.company as c on c.cid = sal.company
                LEFT JOIN communion.company cc ON sal.dompany = cc.cid
                LEFT JOIN communion.brand b ON sal.bid = b.bid
            WHERE
                app.approvalTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
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

        return self.SQL_APPROVAL_APPROVALSALESREFUND % ("%s", startTime, endTime, self.company("sal.company", company))

    def rower(self, row):

        self.divNum(row, [11, 12, 13])

        if row[16]: row[16] = self.type[row[16]]

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"装修单公司", u"楼盘", u"楼号", u"销售单号", u"销售单公司", u"品牌", u"渠道ID", u"渠道", u"分区", u"部门", u"总额", u"当前总额", u"退款额",
            u"申请人", u"审批人", u"退货类型", u"提交时间", u"审批时间", u"审批状态", u"审批说明", u"审批备注", u"审批批注", u"金蝶编号", u"金蝶名称"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"销售退货审批", tableheads, self.colum, sql, self.rower)


if __name__ == '__main__':

    """
        导出销售退货审批记录脚本说明:
        根据查询条件,以分页拿数据的方式导出销售退货审批记录;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_approval_sales_refund.py    pid     args                    company
             plan_export_approval_sales_refund.py    929    2018/12/01-2018/12/31       1
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
