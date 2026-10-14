#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Achievement(Util):

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
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.houseNumber AS `楼号`,
            d.grade AS `等级`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '类型',
            communion.kv('decoration', 'decoration', 'status', d.status) as '状态',
            d.contractTime AS `签单时间`,
            du.userId AS `设计师编号`,
            du.currentName AS `设计师`,
            communion.kv('personel', 'user', 'status', du.status) as '人员状态',
            dd.no AS `设计部编号`,
            dd.name AS `设计部`,
            dr.no AS `设计分区编号`,
            dr.name AS `设计分区`,
            sdu.userId as `签单设计师编号`,
            sdu.currentname as `签单设计师`,
            sdd.no as `签单设计部编号`,
            sdd.name as `签单设计部`,
            sdr.no as `签单设计分区编号`,
            sdr.name as `签单设计分区`,
            eu.userId AS `方案设计编号`,
            eu.currentname AS `方案设计`,
            p.recharge AS `款项金额`,
            p.recharge AS `款项净业绩`,
            communion.kv('payment', 'advancepayment', 'type', p.type) as '款项类型',
            ar.collectTime AS `收款时间`,
            co.name AS `公司名`
        """


        self.SQL_EXPORT_SALES_ACHIEVEMENT = """
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId AND db.type = 0 AND db.status = 0 AND db.defaultflag = 1)
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS dd ON du.deptid = dd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN payment.payment AS p ON (d.orderId = p.orderId AND p.type IN (0, 1) AND p.paymentType = 2)
                LEFT JOIN payment.advancereceipt ar ON p.arid = ar.arid
                LEFT JOIN communion.company AS co ON d.company = co.cid
                LEFT JOIN communion.user as sdu ON db.buid = sdu.uid
                LEFT JOIN communion.department sdd ON db.did = sdd.did
                LEFT JOIN communion.department sdr ON db.rid = sdr.did
                LEFT JOIN communion.user as eu ON d.euid = eu.uid
            WHERE
                ar.collecttime >= '%s 00:00:00' AND 
                ar.collecttime <= '%s 23:59:59' AND
                d.company = %s
        """

        self.SQL_FACTOR = """
            SELECT `value` FROM communion.systemconfig sys WHERE `key` = 'SALES_ACHE_RATE' AND company = %s
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
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_SALES_ACHIEVEMENT % ("count(*)", startTime, endTime, company)

            count = self.count(sqlcount)
            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False


            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            workbook, sheet = self.createWorkbook("销售业绩")

            sql = self.SQL_EXPORT_SALES_ACHIEVEMENT % (self.column, startTime, endTime, company)
            factor = self.SQL_FACTOR % (company)

            tableHead = [
                "装修单号", "楼盘", "楼号", "等级", "类型", "状态", "签单时间", "设计师编号", "设计师", "人员状态",
                "设计部编号", "设计部", "设计分区编号", "设计分区", "签单设计师编号", "签单设计师", "签单设计部编号", "签单设计部", "签单设计分区编号", "签单设计分区", 
                "方案设计编号", "方案设计", "款项金额", "净业绩", "款项类型", "收款时间", "公司名"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            rate = self.page(factor, 1, 1)
            rate = len(rate) > 0 and rate[0][0] or 1

            while pageflag:

                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):

                    rows = list(v)
                    
                    if rows[24] in("提现", "付款"):
                        rows[22] = -rows[22]
                        rows[23] = -rows[23]
                        
                    self.divNum(rows, [22, 23])
                    
                    rows[23] = float(rows[23]) * float(rate)

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
        销售业绩脚本说明:
            根据查询条件,以分页形式导出销售业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/7/01-2022/7/31
            3.company     公司:1
        2.命令使用 plan_export_sales_achievement_designpay.py  pid args company
                    plan_export_sales_achievement_designpay.py  3866 2022/7/01-2022/7/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid =  4062
    # args = "2022/09/01-2022/09/30"
    # company = 1

    achievement = Achievement(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    achievement.main(pid, args, int(company))
    