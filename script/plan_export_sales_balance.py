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
            s.no AS '销售单号',
            s.grade AS '销售等级',
            s.orderId AS '装修单号',
            v.name AS '楼盘',
            h.houseNumber AS '楼号',
            su.userId AS '设计师编号',
            su.currentName AS '设计师',
            dd.no AS '签约设计部编号',
            dd.alias AS '签约设计部',
            dr.no AS '签约设计分区编号',
            dr.alias AS '签约设计分区',
            sdd.no AS '设计师部编号',
            sdd.alias AS '设计师部',
            sdr.no AS '设计师分区编号',
            sdr.alias AS '设计师分区',
            cu.userId AS '创建人编号',
            cu.currentName AS '创建人',
            iu.userId AS '驻店编号',
            iu.currentName AS '驻店',
            gu.userId AS '导购编号',
            gu.currentName AS '主材导购',
            eu.userId AS '方案设计编号',
            eu.currentName AS '方案设计',
            communion.kv('sales', 'sales', 'type', s.type) as '销售类型',
            s.category AS '品类',
            b.name AS '品牌',
            sb_b.name AS '结算品牌',
            su.userId AS '渠道编号',
            su.currentName AS '渠道',
            s.coupon AS '劵',
            s.maling AS '抹零',
            s.venderMaling AS '厂商抹零',
            sb.total AS '总价',
            sb.total - if(sb.type = 0, s.venderMaling, 0) AS '实收额',
            sb.allowance AS '补贴',
            s.fullpayTime AS '补款时间',
            sb.balance AS '预结算值',
            sb.createTime AS '预结算时间',
            sb.pbalance AS '结算值',
            sb.postTime AS '结算时间',
            communion.kv('sales', 'salesbalance', 'type', sb.type) as '结算类型',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '装修单类型',
            d.contractTime AS '签单时间',
            pbu.currentName AS '预结算人',
            pu.currentName AS '结算人',
            d.balanceTime AS '内决时间',
            d.accountTime AS '决算时间',
            b.kino AS '金蝶编号',
            b.kiname AS '金蝶名称',
            dc.name AS '装修公司',
            sc.name AS '销售公司',
            pc.name AS '款项公司',
            s.comment AS '备注'
        """

        self.salesBalance_SQL = """
            SELECT
                %s
            FROM
                sales.salesbalance sb
                INNER JOIN sales.sales s ON s.sid = sb.sid
                INNER JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN construction.acceptance ca ON d.orderId = ca.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.department dd ON db.did = dd.did
                LEFT JOIN communion.department dr ON db.rid = dr.did
                LEFT JOIN communion.department sdd ON du.deptid = sdd.did
                LEFT JOIN communion.department sdr ON dd.fdid = sdr.did
                LEFT JOIN communion.department bd ON s.did = bd.did
                LEFT JOIN communion.user su ON s.suid = su.uid
                LEFT JOIN communion.user iu ON s.iuid = iu.uid
                LEFT JOIN communion.user gu ON s.guid = gu.uid
                LEFT JOIN communion.user cu ON s.cuid = cu.uid
                LEFT JOIN communion.user pbu ON sb.cuid = pbu.uid
                LEFT JOIN communion.user pu ON sb.puid = pu.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.company sc ON s.company = sc.cid
                LEFT JOIN communion.company dc ON s.dompany = dc.cid
                LEFT JOIN communion.company pc ON s.pompany = pc.cid
                LEFT JOIN communion.brand b ON s.bid = b.bid
                LEFT JOIN communion.brand sb_b ON sb.bid = sb_b.bid
            WHERE
                %s
        """

    def rower(self, row):

        self.divNum(row, [29, 30, 31, 32, 33, 34, 36, 38])

        return row

    def sqler(self, form, timetype, type, timeargs, company):

        startTime, endTime = timeargs.split("-")

        companyId = " "
        if company != 0:
            if form == "0":
                companyId = "AND s.company = %s " % company
            elif form == "1":
                companyId = "AND s.dompany = %s " % company
            elif form == "2":
                companyId = "AND s.pompany = %s " % company
        else:
            companyId = " "

        _type = "sb.createTime"

        if timetype == "1":
            _type = "sb.createTime"
        elif timetype == "2":
            _type = "sb.postTime"
        elif timetype == "3":
            _type = "d.accountTime"
        elif timetype == "4":
            _type = "d.balanceTime"
        elif timetype == "5":
            _type = "s.createTime"
        elif timetype == "6":
            _type = "ca.acceptanceTime"
            
        condition = " %s >= '%s 00:00:00' AND %s <= '%s 23:59:59' %s" % (_type, startTime, _type, endTime, companyId)
        
        if type == "1":
            condition = condition + " AND s.type = 1"

        return self.salesBalance_SQL % ("%s", condition)

    def main(self, form, timetype, type, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "销售单号", "销售等级", "装修单号", "楼盘", "楼号", "设计师编号", "设计师", "签约设计部编号", "签约设计部", "签约设计分区编号",
            "签约设计分区", "设计师部编号", "设计师部", "设计师大区编号", "设计师大区", "创建人编号", "创建人", "驻店编号", "驻店", "导购编号",
            "主材导购", "方案设计编号", "方案设计", "销售类型", "品类", "品牌", "结算品牌", "渠道编号", "渠道", "劵", "抹零",
            "厂商抹零", "总价", "实收额", "补贴", "补款时间", "预结值", "预结时间", "结算值", "结算时间", "结算类型",
            "装修类型", "签单时间", "预结算人", "结算人", "内决时间", "决算时间", "金蝶编号", "金蝶名称", "装修公司",
            "销售公司", "款项公司", "备注"
        ]

        sql = self.sqler(form, timetype, type, args, int(company))

        self.exporter(pid, '', "sheet1", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出销售结算说明:
            根据查询条件,以分页拿数据的方式导出销售结算信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.form        脚本自传参数
            2.pid         information.plan的主键;
            3.args         "2018/10/01 - 2018/10/30"
            4.company      1 --公司
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    form = sys.argv[1]
    timetype = sys.argv[2]
    type = sys.argv[3]
    pid = sys.argv[4]
    args = sys.argv[5]
    company = sys.argv[6]

    # timetype = "0"
    # form = "0"
    # type = 0
    # pid = 4997
    # args = "2024/07/01-2024/07/24"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(form, timetype, type, pid, args, company)
