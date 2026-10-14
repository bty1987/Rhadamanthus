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
            d.orderId,
            v.name,
            h.houseNumber,
            c.name,
            d.houseType,
            dr.name,
            dd.name,
            du.currentName,
            su.currentName,
            qu.currentName,
            sv.currentName,
            h.innerArea,
            d.factPrice,
            qv.name,
            d.contractTime,
            ci.designPeriod,
            ci.keyTime,
            ci.drawlineTime,
            ci.finishTime,
            ci.designTime,
            d.sdesigntime,
            d.edesigntime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            cn.name,
            communion.kv('decoration', 'decoration', 'status', d.status),
            db.name,
            ci.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN construction.constructioninfo AS ci ON d.orderId = ci.orderId
                LEFT JOIN quotation.quotationversion AS qv ON d.versionId = qv.no
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.smuid = su.uid
                LEFT JOIN communion.user AS qu ON d.quId = qu.uid
                LEFT JOIN communion.user AS sv ON d.svuid = sv.uid
                LEFT JOIN communion.department AS dd ON du.deptId = dd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN data.decorationbusitype AS db ON d.busitype = db.dbid
                LEFT JOIN data.constructionnode AS cn ON d.projectstatus = cn.cnid
            WHERE
                d.sdesigntime >= '%s 00:00:00' AND
                d.sdesigntime <= '%s 23:59:59'
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

        self.divNum(row, [11, 12, 15])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘", u"楼号", u"客户", u"房屋类别", u"设计分区", u"设计部", u"设计师", u"业务员", u"方案设计", u"监理",
            u"面积", u"合同额", u"报价版本", u"签单时间", u"设计天数", u"预计交钥匙时间", u"预计放线时间", u"预计完工时间", u"预计设计完成时间", u"合同方案确认时间",
            u"放线方案确认时间", u"装修类型", u"工程状态", u"装修状态", u"装修业务", u"备注"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"装修单信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出装修单信息脚本说明:
        根据签单时间范围查询导出装修单相关信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将更新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
             plan_export_construction_plan_pro.py pid     args      company
             plan_export_construction_plan_pro.py 1207 "2016/07/01-2016/07/30" 1

        3.导出字段说明:
            装修单/楼盘/楼号/客户/设计分区/设计部/设计师/业务员/方案设计/监理/面积/合同额/报价版本/签单时间
            设计天数/预计交钥匙时间/预计放线时间/预计完工时间/预计设计完成时间/合同方案确认时间/放线方案确认时间
            装修类型/工程状态/装修状态/装修业务/备注

        4.注:
            结束时间不能大于开始时间31天
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
