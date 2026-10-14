#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host="", username="", password="", media="", pthost="", charset="utf8"):

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
            d.orderId,
            v.name,
            h.houseNumber,
            communion.kv('decoration', 'decoration', 'status', d.status),
            a.name,
            a.starttime,
            a.endtime,
            aws.name,
            aws.format,
            communion.kv('information', 'awardstock', 'storeroom', aws.storeroom),
            communion.kv('information', 'awardstock', 'type', aws.type),
            communion.kv('information', 'awardstock', 'subtype', aws.subtype),
            communion.kv('information', 'awardrecord', 'type', awr.subtype),
            communion.kv('information', 'awardrecord', 'subtype', awr.subtype),
            communion.kv('information', 'awardstock', 'isPrefor', aws.isPrefor),
            awr.num,
            awr.totalPrice,
            awr.content,
            du.currentName,
            u.currentName,
            awr.operateTime,
            dai.receivetime
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                information.awardrecord AS awr
                LEFT JOIN information.awardstock AS aws ON awr.asid = aws.asid
                LEFT JOIN decoration.decoration AS d ON d.orderId = awr.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS u ON awr.ouid = u.uid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN decoration.decorationactivity da on d.orderId = da.orderId
                LEFT JOIN information.activity a on da.aid = a.aid
                LEFT JOIN decoration.decorationactivityitem dai on aws.asid = dai.asid and dai.orderId = d.orderId
            WHERE
                awr.operateTime >= '%s 00:00:00' AND
                awr.operateTime <= '%s 23:59:59'
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

        return self.SQL_QUERY % ("%s", startTime, endTime, self.company("aws.company", company))

    def rower(self, row):

        self.divNum(row, [16, 17])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"编号", u"装修单号", u"楼盘", u"楼号", u"装修状态", u"活动名", u"活动开始时间", u"活动结束时间", u"名称", u"规格",
            u"库房", u"类型", u"子类", u"类型", u"子类", u"业绩标识", u"单价", u"数量", u"总额", u"说明",
            u"设计师", u"操作人", u"操作时间", u"客户确认时间"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"奖品记录", tableheads, self.colum, sql, self.rower)


if __name__ == '__main__':

    """
        导出奖品记录脚本说明:
        根据查询条件,以分页拿数据的方式导出奖品记录;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_information_award_record.py pid     args                    company
             plan_export_information_award_record.py 929  2018/12/01-2018/12/31      1
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
