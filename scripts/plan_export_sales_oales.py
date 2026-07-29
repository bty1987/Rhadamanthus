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

        self.column = """
            o.`no` AS '外销单号',
            d.orderId AS `装修单号`,
            d.grade AS `装修等级`,
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            o.category AS '品类',
            o.brand AS '品牌',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '销售单类型',
            communion.kv('sales', 'oales', 'status', o.status) as '外销单状态',
            communion.kv('sales', 'oales', 'atttype', o.atttype) as '外销单类型',
            o.createTime AS '创建时间',
            d.contractTime AS '签单时间',
            o.checkTime AS '复核时间',
            du.userid AS '设计师工号',
            du.currentname AS '设计师',
            dr.no AS '签约设计分区编号',
            dr.alias AS '签约设计分区',
            dd.no AS '签约设计部编号',
            dd.alias AS '签约设计部',
            sdr.no AS '设计师大区编号',
            sdr.alias AS '设计师大区',
            sdd.no AS '设计师部编号',
            sdd.alias AS '设计师部',
            mu.userId AS '主材员工号',
            mu.currentName AS '主材员',
            chu.userId AS '渠道工号',
            chu.currentName AS '渠道',
            su.userId AS '服务管家工号',
            su.currentName AS '服务管家',
            eu.userId AS '方案设计编号',
            eu.currentName AS '方案设计',
            o.profit AS '利润',
            o.threshold AS '系数',
            o.cost AS '成本',
            o.total AS '总额',
            o.award AS '奖励',
            communion.kv('sales', 'oales', 'awardType', o.awardType) as '奖励类型',
            communion.kv('sales', 'oales', 'type', o.type) as '类型',
            ((o.profit/1000)/(o.threshold/1000)) AS '复合业绩',
            bu.userId AS '业务工号',
            bu.currentName AS '业务姓名',
            bdd.no AS '业务部门编号',
            bdd.alias AS '业务部门',
            bdr.no AS '业务分区编号',
            bdr.alias AS '业务分区',
            b.kiname AS '品牌金蝶名称',
            b.kino AS '品牌金蝶编码'
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                sales.oales o
                LEFT JOIN decoration.decoration d on o.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db on d.orderId = db.orderId
                LEFT JOIN communion.house h on d.hid = h.hid
                LEFT JOIN communion.village v on h.vid = v.vid
                LEFT JOIN communion.user du on o.chauid = du.uid
                LEFT JOIN communion.department dd on db.did = dd.did
                LEFT JOIN communion.department dr on db.rid = dr.did
                LEFT JOIN communion.department sdd on du.deptid = sdd.did
                LEFT JOIN communion.department sdr on sdd.fdid = sdr.did
                LEFT JOIN communion.user mu on o.mauid = mu.uid
                LEFT JOIN communion.user chu on o.chauid = chu.uid
                LEFT JOIN communion.user su on o.svuid = su.uid
                LEFT JOIN communion.user eu on d.euid = eu.uid
                LEFT JOIN communion.user bu on d.smuid = bu.uid
                LEFT JOIN communion.department bdd on bu.deptid = bdd.did
                LEFT JOIN communion.department bdr on bdd.fdid = bdr.did
                LEFT JOIN communion.brand b on o.bid = b.bid
            WHERE
                db.type = 0 AND
                db.status = 0 AND
                db.defaultflag = 1 AND
                o.%s >= '%s 00:00:00' AND
                o.%s <= '%s 23:59:59' AND
                o.company = %s
            """

    def sqler(self, type, args, company):

        startTime, endTime = args.split("-")

        timeColumn = "createTime"
        if type == "0":
            timeColumn = "createTime"
        elif type == "1":
            timeColumn = "checkTime"

        return self.SQL_QUERY % ("%s", timeColumn, startTime, timeColumn, endTime, company)

    def rower(self, row):

        self.divNum(row, [31, 32, 33, 34, 35])

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            "外销单号", "装修单号", "装修等级", "楼盘", "楼号", "品类", "品牌", "销售单类型", "外销单状态", "外销单类型",
            "创建时间", "签单时间", "复核时间", "设计师工号", "设计师", "签约设计分区编号", "签设计分区", "签约设计部编号", "签约设计部", "设计师分区编号",
            "设计师分区", "设计师部编号", "设计师部", "主材员工号", "主材员", "渠道工号", "渠道", "服务管家工号", "服务管家", "方案设计工号",
            "方案设计", "利润", "系数", "成本", "总额", "奖励", "奖励类型", "类型", "复合业绩",
            "业务工号", "业务姓名", "业务部门编号", "业务部门", "业务分区编号", "业务分区", "品牌金蝶名称", "品牌金蝶编码"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        self.exporter(pid, args, "销售业绩", tableheads, self.column, sql, self.rower)

if __name__ == '__main__':

    """
        外销单业绩脚本说明:
            根据查询条件,以分页形式导出外销单业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/12/01-2022/12/31
            3.company     公司:1
        2.命令使用 plan_export_payment_oales_achievement.py  pid args company
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args, company)
