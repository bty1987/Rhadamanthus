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
            bs.name AS '结算销售名称',
            b.no AS '结算单号',
            b_s.name AS '品牌名',
            bs.status AS '结算销售状态',
            bs.grade AS '等级',
            bs.income AS '收入',
            bs.cost AS '成本',
            bs.payment AS '应付',
            bs.profit AS '利润',
            cu.currentName AS '创建人',
            su.currentName AS '厂商',
            bs.createTime AS '创建时间',
            bs.lockTime AS '锁定时间',
            bs.balanceTime AS '结算时间',
            bu.currentName AS '结算人',
            s.no AS '销售单号',
            s.orderId AS '装修单号',
            CONCAT(v.name, ' ', h.houseNumber) AS '楼盘地址',
            s.category AS '品类',
            sb_b.name AS '品牌',
            sb.type AS '销售类型',
            sb.onetype AS '销售一类',
            sb.pbalance AS '结算值',
            sb.status AS '销售状态',
            sb.total AS '销售总额',
            sb.allowance AS '折扣/抹零金额',
            s.venderMaling AS '供应商减免金额',
            s.depositpay AS '定金',
            s.fullpay AS '补款',
            0 AS '销售收入',
            0 AS '销售金额',
            sb.pbalance AS '销售成本',
            0 AS '应付账款',
            0 AS '结算利润',
            0 AS '公司利润',
            sb.postTime AS '收款时间',
            0 AS '销售成本比例',
            0 AS '结算利润占比',
            0 AS '公司利润占比',
            0 AS '主材打折占比',
            sdd.no AS '现设计部编号',
            sdd.alias AS '现设计部',
            sdr.no AS '现设计分区编号',
            sdr.alias AS '现设计分区',
            dd.no AS '签约设计部编号',
            dd.alias AS '签约设计部',
            dr.no AS '签约设计分区编号',
            dr.alias AS '签约设计分区'
        """

        self.salesBalance_SQL = """
            SELECT
                %s
            FROM
                sales.salesbalance sb
                INNER JOIN balance.balancesalesbalance bsb ON sb.sbid = bsb.sbid
                INNER JOIN balance.balancesales bs ON bsb.bsid = bs.bsid
                INNER JOIN balance.balance b ON bs.brid = b.bid
                LEFT JOIN communion.brand b_s ON b.bid = b_s.bid
                LEFT JOIN sales.sales s ON sb.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId AND db.type = 0 AND db.defaultFlag = 1 AND db.status = 0)
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user su ON sb.suid = su.uid
                LEFT JOIN communion.user cu ON bs.cuid = cu.uid
                LEFT JOIN communion.user bu ON bs.buid = bu.uid
                LEFT JOIN communion.department sdd ON sb.did = sdd.did
                LEFT JOIN communion.department sdr ON sb.drid = sdr.did
                LEFT JOIN communion.department dd ON db.did = dd.did
                LEFT JOIN communion.department dr ON db.rid = dr.did
                LEFT JOIN communion.brand sb_b ON sb.bid = sb_b.bid
            WHERE
                %s
        """

    def rower(self, row):

        # 列索引对照:
        # 3: bs.status (结算销售状态)
        # 20: sb.type (销售类型)
        # 21: sb.onetype (销售一类)
        # 22: sb.pbalance (结算值/销售成本)
        # 23: sb.status (销售状态)
        # 24: sb.total (销售总额)
        # 25: sb.allowance (折扣/抹零金额)
        # 26: s.venderMaling (供应商减免金额)
        # 27: s.depositpay (定金)
        # 28: s.fullpay (补款)

        # 枚举值转换
        # 结算销售状态: 0-初始 1-锁定 2-确认 3-结算
        bs_status_map = {0: '初始', 1: '锁定', 2: '确认', 3: '结算'}
        if row[3] is not None:
            row[3] = bs_status_map.get(row[3], row[3])

        # 销售类型: 0-购货 1-预结退货 2-结算退货 3-定金 4-多次结算
        sb_type_map = {0: '购货', 1: '预结退货', 2: '结算退货', 3: '定金', 4: '多次结算'}
        if row[20] is not None:
            row[20] = sb_type_map.get(row[20], row[20])

        # 销售一类: 0-正常 1-退货 2-全退 3-定金后退
        onetype_map = {0: '正常', 1: '退货', 2: '全退', 3: '定金后退'}
        if row[21] is not None:
            row[21] = onetype_map.get(row[21], row[21])

        # 销售状态: 0-预结 1-厂结 2-结算
        sb_status_map = {0: '预结', 1: '厂结', 2: '结算'}
        if row[23] is not None:
            row[23] = sb_status_map.get(row[23], row[23])

        onetype = row[21] if isinstance(row[21], int) else 0
        sb_type = row[20] if isinstance(row[20], int) else 0

        venderMaling = row[26] or 0
        allowance = row[25] or 0
        pbalance = row[22] or 0
        total = row[24] or 0
        depositpay = row[27] or 0
        fullpay = row[28] or 0

        # 销售收入、销售金额、应付账款计算
        salesRevenue = 0
        salesAmount = 0
        accountsPayable = 0

        if onetype == 0:  # ONETYPE_INIT_INT 正常销售
            if sb_type == 3:  # TYPE_DEPOSITPAY_INT 定金
                venderMaling = 0
                allowance = 0
                salesRevenue = depositpay
                salesAmount = salesRevenue + venderMaling + allowance
                accountsPayable = pbalance - venderMaling
            else:
                salesRevenue = depositpay + fullpay
                salesAmount = salesRevenue + venderMaling + allowance
                accountsPayable = pbalance - venderMaling

        elif onetype == 1:  # ONETYPE_REFUND_INT 预结退货
            venderMaling = 0
            salesRevenue = total
            salesAmount = salesRevenue + allowance
            accountsPayable = pbalance

        elif onetype == 2 or onetype == 3:  # ONETYPE_ALLBACK_INT 或 ONETYPE_DBACKORDER_INT 全退/定金后退
            salesRevenue = total
            salesAmount = (salesRevenue - venderMaling) + allowance
            accountsPayable = pbalance + venderMaling
            venderMaling = -venderMaling

        # 更新行数据
        row[29] = salesRevenue    # 销售收入
        row[30] = salesAmount     # 销售金额
        row[32] = accountsPayable # 应付账款

        # 结算利润 = 销售金额 - 销售成本
        settlementProfit = salesAmount - pbalance
        row[33] = settlementProfit

        # 公司利润 = 销售收入 - 应付账款
        corporateProfit = salesRevenue - accountsPayable
        row[34] = corporateProfit

        # 比例计算
        if salesAmount != 0:
            row[36] = pbalance / float(salesAmount)  # 销售成本比例
            row[37] = settlementProfit / float(salesAmount)  # 结算利润占比
            row[39] = 1 - (allowance / float(salesAmount)) if salesAmount != 0 else 0  # 主材打折占比
        else:
            row[36] = 0
            row[37] = 0
            row[39] = 0

        # 公司利润占比
        base = salesAmount + (venderMaling if onetype == 0 else 0)
        if base != 0:
            row[38] = corporateProfit / float(base)
        else:
            row[38] = 0

        # 千倍处理: 收入(5), 成本(6), 应付(7), 利润(8), 结算值(22), 销售总额(24), 折扣抹零(25), 供应商减免(26), 定金(27), 补款(28), 销售收入(29), 销售金额(30), 销售成本(31), 应付账款(32), 结算利润(33), 公司利润(34)
        self.divNum(row, [5, 6, 7, 8, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34])



        return row

    def sqler(self, timeargs, company=None):
        startTime, endTime = timeargs.split("-")
        condition = " sb.postTime >= '%s 00:00:00' AND sb.postTime <= '%s 23:59:59'" % (startTime, endTime)
        if company is not None and company != '':
            condition += " AND bs.company = %s" % company
        return self.salesBalance_SQL % ("%s", condition)

    def main(self, pid, args, company=None):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            # 结算销售汇总信息
            "结算销售名称", "结算单号", "品牌名", "结算销售状态", "等级",
            "收入", "成本", "应付", "利润", "创建人", "厂商", "创建时间",
            "锁定时间", "结算时间", "结算人",
            # 销售结算单明细信息
            "销售单号", "装修单号", "楼盘地址", "品类", "品牌", "销售类型",
            "销售一类", "结算值", "销售状态", "销售总额", "折扣/抹零金额",
            "供应商减免金额", "定金", "补款", "销售收入", "销售金额", "销售成本",
            "应付账款", "结算利润", "公司利润", "收款时间", "销售成本比例",
            "结算利润占比", "公司利润占比", "主材打折占比",
            "现设计部编号", "现设计部", "现设计分区编号", "现设计分区",
            "签约设计部编号", "签约设计部", "签约设计分区编号", "签约设计分区"
        ]

        sql = self.sqler(args, company)

        self.exporter(pid, '', "sheet1", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出结算销售-销售明细说明:
            根据结算时间导出销售结算单明细，关联结算销售汇总信息;
            每行对应一个销售结算单，包含所属结算销售的汇总信息;
            计算销售收入、销售金额、应付账款、结算利润、公司利润等衍生字段;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args         "2018/10/01-2018/10/30" (结算时间范围)
            3.company     公司ID (可选)
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3] if len(sys.argv) > 3 else None

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
