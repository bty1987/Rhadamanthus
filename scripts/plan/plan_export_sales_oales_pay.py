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
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '装修单类型',
            d.contractTime AS '签单时间',
            o.confirmTime AS '确认时间',
            o.category AS '品类',
            o.brand AS '品牌',
			communion.kv('sales', 'oales', 'status', o.status) as '外销单状态',
            du.userid AS '设计师工号',
            du.currentname AS '设计师',
            dd.name AS '设计部',
            dr.name AS '设计分区',
            mu.userId AS '主材员工号',
            mu.currentName AS '主材员',
            chu.userId AS '渠道工号',
            chu.currentName AS '渠道',
            eu.userId AS '方案设计工号',
            eu.currentName AS '方案设计',
            su.userId AS '服务管家工号',
            su.currentName AS '服务管家',
            communion.kv('sales', 'oales', 'atttype', o.atttype) as '类型',
            communion.kv('sales', 'oales', 'awardType', o.awardType) as '奖励类型',
            o.award AS '奖励',
            o.cost AS '成本',
            o.total AS '总额',
            o.profit AS '利润',
            o.threshold AS '系数',
            op.name AS '名称',
            op.money AS '金额',
            communion.kv('sales', 'oalespay', 'type', op.type) as '付款单类型',
            op.payTime AS '付款时间',
            op. COMMENT AS '备注'
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                sales.oales o
                LEFT JOIN sales.oalespay op ON o.oid = op.oid
                left join decoration.decoration d on o.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db on (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON db.buid = du.uid
                LEFT JOIN communion.department dd ON db.did = dd.did
                LEFT JOIN communion.department dr ON db.rid = dr.did
                LEFT JOIN communion.user mu ON o.mauid = mu.uid
                LEFT JOIN communion.user chu ON o.chauid = chu.uid
                LEFT JOIN communion.user su ON o.svuid = su.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
            WHERE
                o.confirmTime >= '%s 00:00:00' AND 
                o.confirmTime <= '%s 23:59:59' AND 
                o.company = %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def main(self, pid, args, company):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)
            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, company)
            count = self.count(sqlcount)
            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "无可导出数据"
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            workbook, sheet = self.createWorkbook("外销单付款明细")

            sql = self.SQL_QUERY % (self.column, startTime, endTime, company)

            tableHead = [
                "外销单号", "装修单号", "楼盘", "楼号", "装修单类型", "签单时间", "确认时间", "品类", "品牌", "外销单状态", 
                "设计师工号", "设计师", "设计部", "设计分区", "主材员工号", "主材员", "渠道工号", "渠道", "方案设计工号", "方案设计", 
                "服务管家工号", "服务管家", "类型", "奖励类型", "奖励", "成本", "总额", "利润", "系数", "名称", 
                "金额", "付款单类型", "付款时间", "备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:

                data = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(data):
                
                    rows = list(v)
                    
                    self.divNum(rows, [24, 25, 26, 27, 28, 30])
                    
                    self.createTableHead(sheet, rows, count)
                    
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        外销单付款明细脚本说明:
            根据查询条件,以分页形式导出销售业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/8/01-2022/8/31
            3.company     公司:1
        2.命令使用 plan_export_sales_oales_pay.py  pid args company
                    plan_export_sales_oales_pay.py  4209 2023/03/01-2023/03/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4250
    # args = "2023/03/01-2023/03/31"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)
