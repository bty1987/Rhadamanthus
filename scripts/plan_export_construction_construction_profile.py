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
        self.size = 100

        self.colum = """
            d.orderId '装修单号',
            v.name '楼盘',
            h.housenumber '楼号',
            h.innerarea '计价面积',
            dr.name '设计分区',
            dd.name '设计部',
            du.currentName '设计师',
            d.houseClass '房屋类型',
            qu.currentName '预算员',
            su.currentName '监理',
            d.contractTime '签单时间',
            d.sdesignTime '合同方案确认时间',
            CASE ci.handoverStatus WHEN 0 THEN '未交接' WHEN 1 THEN '已交接' WHEN 2 THEN '不验证' END '交接状态',
            ci.handoverTime '交接时间',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.constructionprofileitem i JOIN construction.constructionprofileoption o ON o.cpiid = i.cpiid AND o.checked = 1 WHERE i.cpid = cp.cpid AND i.name = '审核结果') '审核结果',
            co.name '公司'
        """

        self.SQL_QUERY_HANDLE = """
            SELECT
                %s
            FROM
                construction.constructionprofile cp
                LEFT JOIN construction.constructioninfo ci ON cp.orderId = ci.orderId
                LEFT JOIN decoration.decoration d ON cp.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user qu ON d.quid = qu.uid
                LEFT JOIN communion.user su ON d.svuid = su.uid
                LEFT JOIN communion.company co ON cp.company = co.cid
            WHERE
                %s >= '%s 00:00:00' AND
                %s <= '%s 23:59:59'
                %s
        """

    def company(self, column, company):

        if int(company) != 0:
            companyId = "AND %s = %s" % (column, company)
        else:
            companyId = " "

        return companyId

    def rower(self, row):

        self.divNum(row, [3])

        return row

    def sqler(self, field, args, company):

        startTime, endTime = args.split("-")

        return self.SQL_QUERY_HANDLE % ("%s", field, startTime, field, endTime, self.company("cp.company", company))

    def main(self, type, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "装修单号", "楼盘", "楼号", "计价面积", "设计分区", "设计部", "设计师", "房屋类型",
            "预算员", "监理", "签单时间", "合同方案确认时间", "交接状态", "交接时间", "审核结果", "公司"
        ]

        if type == "0":
            field = "cp.createTime"
        elif type == "1":
            field = "ci.handoverTime"
        else:
            self.flag = False
            self.updataSchedule(self.pthost, pid, {
                "plan.status": 3,
                "plan.info": '未知的导出类型'
            })
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            return False

        sql = self.sqler(field, args, company)

        self.exporter(pid, args, "工程标签", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出工程标签说明:
            根据查询条件,以分页拿数据的方式导出工程标签(construction.constructionprofile, 预交会标签)信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            type=0按标签创建时间(constructionprofile.createTime), type=1按交接时间(constructioninfo.handoverTime)过滤;
            合同方案确认时间取decoration.sdesignTime(与工程信息页面口径一致);审核结果取标签表单勾选选项(constructionprofileitem+constructionprofileoption checked=1)聚合;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type          0:创建时间 1:交接时间;
            2.pid           information.plan的主键;
            3.args          "2024/07/01 - 2024/7/30"
            4.company       公司
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # type = 0
    # pid = 4991
    # args = "2024/07/01-2024/07/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, company)
