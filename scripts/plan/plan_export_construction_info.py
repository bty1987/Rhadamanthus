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
            CONCAT(c.`name`, '  ', cp.`name`, '  ', v.`name`, '  ', h.houseNumber),
            h.buildArea,
            dr.name,
            dd.name,
            du.currentName,
            sv.currentName,
            d.contractTime,
            cni.keyTime,
            cni.drawlineTime,
            cni.finishTime,
            cni.designTime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            cn.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                construction.constructioninfo AS cni
                LEFT JOIN decoration.decoration AS d ON cni.orderId = d.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.cityproper AS cp ON v.cityProperId = cp.cpid
                LEFT JOIN communion.city AS c ON cp.cid = c.cid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS dd ON dd.did = du.deptId
                LEFT JOIN communion.department AS dr ON dr.did = dd.fdid
                LEFT JOIN communion.user AS sv ON d.svuid = sv.uid
                LEFT JOIN data.constructionnode AS cn ON d.projectStatus = cn.cnid
            WHERE
                cni.drawlineTime >= '%s 00:00:00' AND
                cni.drawlineTime <= '%s 23:59:59'
                %s
            ORDER BY cni.drawlineTime ASC, d.orderId ASC
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

        self.divNum(row, [2])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u"装修单号", u"楼盘地址", u"面积", u"设计分区", u"设计部", u"设计师", u"监理", u"签单时间", u"预计交钥匙时间", u"预计放线时间",
            u"预计完工时间", u"预计设计完成时间", u"订单类型", u"工程状态"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(args, company)

        self.exporter(pid, args, u"工程计划", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出工程计划脚本说明:
        根据查询条件(公司 + 预计放线时间范围), 导出工程计划并上传文件服务器, 任务页面下载;
        简单版框架: plan_util.Util.exporter 统一处理 31天校验/计数/分页/进度/打包上传(openpyxl xlsx, 超50万行自动分sheet);
        company=0 时不过滤公司(全部); 无数据时 plan.status=2(与 drawline 等家族口径一致)

        1.参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1 (0=全部)
        2.脚本传参说明
            python   plan_export_construction_info.py pid     args      company
            python   plan_export_construction_info.py 1207 "2016/07/01-2016/07/30" 1
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
