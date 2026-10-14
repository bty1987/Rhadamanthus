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
        self.size = 300

        self.colum = u"""
            d.orderId,
            v.name,
            h.housenumber,
            c.name,
            h.buildArea,
            h.innerArea,
            eu.userId,
            eu.currentName,
            d.contractTime,
            d.accountTime,
            communion.kv('decoration', 'decoration', 'status', d.status),
            cn.name,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            u.userId,
            u.currentName,
            db.type,
            ur.no,
            ur.name,
            ud.no,
            ud.name,
            communion.kv('decoration', 'decorationbelong', 'defaultflag', db.defaultflag),
            db.rate,
            da.paidupMatching,
            cc.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN decoration.decorationaccount AS da ON d.orderId = da.orderId
                LEFT JOIN data.constructionnode AS cn on d.projectstatus = cn.cnid
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.company AS cc ON d.company = cc.cid
                LEFT JOIN decoration.decorationbelong AS db ON (d.orderId = db.orderId and db.status = 0)
                LEFT JOIN communion.user AS u ON db.buid = u.uid
                LEFT JOIN communion.department AS ud ON u.deptId = ud.did
                LEFT JOIN communion.department AS ur ON ud.fdid = ur.did
            WHERE
                d.accountTime >= '%s 00:00:00' AND
                d.accountTime <= '%s 23:59:59'
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

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("d.company", company))

    def rower(self, row):

        self.divNum(row, [4, 5, 21, 22])

        rates = float(row[21] or 0)

        # 归属类型(0设计/1业务), constant_ref中无decorationbelong.type码表, 保留本地字典翻译
        row[15] = self.decorationbelongType.get(row[15], row[15])

        # 决算实花配比 = 配比 * 归属比例
        row[22] = (row[22] or 0) * rates

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"客户名", u"建筑面积", u"计价面积", u"方案设计工号", u"方案设计", u"签单时间", u"决算时间",
            u"订单状态", u"工程状态", u"订单类型", u"归属人工号", u"归属人", u"归属类型", u"分区编号", u"分区名称", u"部门编号", u"部门名称",
            u"是否默认", u"归属比例", u"决算实花配比", u"公司"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"装修决算信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出装修决算信息脚本说明:
            根据查询条件,以分页形式导出决算订单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司cid, 0为全部(不传默认0)
        2.命令使用 plan_export_decoration_order_account.py  pid args company
                   plan_export_decoration_order_account.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2021/04/01-2021/04/30'
    # company = 0
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
