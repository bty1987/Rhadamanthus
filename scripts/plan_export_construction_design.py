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
            d.precontractTime,
            d.contractTime,
            communion.kv('decoration', 'decoration', 'type', d.type),
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.orderId,
            v.name,
            h.houseNumber,
            h.innerArea,
            co.name,
            dr.name,
            dd.name,
            du.currentName,
            du.userId,
            '' AS designFee,
            ci.designPeriod,
            ci.designTime,
            ci.initDesignTime,
            d.sdesignTime,
            communion.kv('decoration', 'decoration', 'designStatus', d.designStatus),
            ci.designOverdueDays,
            d.terminalTime,
            d.recontractTime
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.company AS co ON d.company = co.cid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS dd ON dd.did = du.deptId
                LEFT JOIN communion.department AS dr ON dr.did = dd.fdid
                LEFT JOIN construction.constructioninfo AS ci ON d.orderId = ci.orderId
            WHERE
                ci.initDesignTime >= '%s 00:00:00' AND
                ci.initDesignTime <= '%s 23:59:59'
                %s
            ORDER BY ci.initDesignTime ASC, d.orderId ASC
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

        self.divNum(row, [7])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"预签时间", u"签单时间", u"模式", u"订单类型", u"装修单号", u"楼盘", u"楼号", u"计价面积", u"公司", u"设计分区", u"设计部", u"设计师", u"设计师工号", u"设计费", u"设计天数",
            u"预计设计完成时间", u"初始设计完成时间", u"合同方案确认时间", u"设计状态", u"超期天数", u"终止时间", u"重签时间"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"设计信息", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出设计信息脚本说明:
        根据查询条件(公司 + 初始设计完成时间范围), 导出设计信息并上传文件服务器, 任务页面下载;
        简单版框架: plan_util.Util.exporter 统一处理 31天校验/计数/分页/进度/打包上传(openpyxl xlsx, 超50万行自动分sheet);

        字段口径:
            模式 = decoration.type(包型), 订单类型 = decoration.typeness(细分)
            计价面积 = house.innerArea(÷1000), 设计费 = 暂留空待补口径
            初始设计完成时间/超期天数 = constructioninfo.initDesignTime/designOverdueDays
            楼号(houseNumber)密文/明文混合现状原样导出(同存量导出口径)
        company=0 时不过滤公司(全部)

        1.参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1 (0=全部)
        2.脚本传参说明
            python   plan_export_construction_design.py pid     args      company
            python   plan_export_construction_design.py 1207 "2016/07/01-2016/07/30" 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
