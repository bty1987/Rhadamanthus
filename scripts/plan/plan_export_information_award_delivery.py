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
            aws.no,
            dai.orderId,
            v.name,
            h.houseNumber,
            dai.activityName,
            communion.kv('decoration', 'decorationactivityitem', 'statetype', dai.statetype),
            communion.kv('decoration', 'decorationactivityitem', 'status', dai.state),
            aws.name,
            aws.format,
            communion.kv('information', 'awardstock', 'status', aws.status),
            communion.kv('information', 'awardstock', 'storeroom', aws.storeroom),
            communion.kv('information', 'awardstock', 'type', aws.type),
            communion.kv('information', 'awardstock', 'subtype', aws.subtype),
            communion.kv('information', 'awardstock', 'isPrefor', aws.isPrefor),
            dai.money,
            dai.num,
            (dai.num * dai.money / 1000),
            du.currentName,
            dem.name,
            de.name,
            u.currentName,
            d.depositTime,
            d.precontractTime,
            d.contractTime
        """

        self.SQL_Delivery_Funds = u"""
            SELECT
                %s
            FROM
                decoration.decorationactivityitem AS dai
                LEFT JOIN information.awardstock AS aws ON dai.asid = aws.asid
                LEFT JOIN decoration.decoration AS d ON d.orderId = dai.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS u ON dai.ruid = u.uid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS de ON de.did = du.deptId
                LEFT JOIN communion.department AS dem ON dem.did = de.fdid
            WHERE
                %s >= '%s 00:00:00' AND
                %s <= '%s 23:59:59'
                %s
            ORDER BY %s ASC
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
            timeColumn = "d.precontractTime"
        elif type == "2":
            timeColumn = "d.accountTime"

        return self.SQL_Delivery_Funds % ("%s", timeColumn, startTime, timeColumn, endTime, self.company("aws.company", company), timeColumn)

    def rower(self, row):

        self.divNum(row, [14, 15, 16])

        row[15] = int(row[15])

        return row

    def main(self, pid, type, args, company):

        tableheads = [
            u"编号", u"装修单号", u"楼盘", u"楼号", u"活动名称", u"状态", u"状态类型", u"名称", u"状态", u"规格",
            u"库房", u"奖品类型", u"子类", u"业绩标识", u"单价", u"数量", u"总额", u"设计师", u"设计分区", u"设计部",
            u"操作人", u"定金时间", u"预签时间", u"签单时间"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, u"奖品配送", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出奖品配送脚本说明:
        根据查询条件,以分页拿数据的方式导出奖品配送;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        签单时间 0/预签时间 1/决算时间 2
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_information_award_delivery.py type  pid  args                    company
             plan_export_information_award_delivery.py  0   929  2018/12/01-2018/12/31   1
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
    exporter.main(pid, type, args, int(company))
