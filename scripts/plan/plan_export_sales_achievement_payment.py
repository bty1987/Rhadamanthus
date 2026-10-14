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
            h.housenumber AS `楼号`,
            d.grade AS `等级`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '类型',
            communion.kv('decoration', 'decoration', 'status', d.status) as '状态',
            d.contractTime AS `签单时间`,
            iu.userid AS `主材员编号`,
            iu.currentname AS `主材员`,
            ir.name AS `主材分区`,
            co.name AS `装修公司`,
            du.userid AS `设计师编号`,
            du.currentname AS `设计师`,
            communion.kv('personel', 'user', 'status', du.status) as '人员状态',
            dr.no AS `设计分区编号`,
            dr.name AS `设计分区`,
            dd.no AS `设计部编号`,
            dd.name AS `设计部`,
            sdu.userId as `签单设计师编号`,
            sdu.currentname as `签单设计师`,
            sdr.no as `签单设计分区编号`,
            sdr.name as `签单设计分区`,
            sdd.no as `签单设计部编号`,
            sdd.name as `签单设计部`,
            eu.userId AS `方案设计编号`,
            eu.currentname AS `方案设计`,
            (sr.cash + sr.bank + sr.checkv + sr.coupon) AS `款项金额`,
            (sr.cash + sr.bank + sr.checkv) AS `净业绩`,
            sr.coupon AS `券用`,
            sr.couponInfo AS `券信息`,
            communion.kv('payment', 'salespayment', 'type', sp.type) as '款项类型',
            sp.type as '款项类型',
            sr.collectTime AS `收款时间`,
            sp.refermoney / (sr.cash + sr.bank + sr.checkv + sr.advance + sr.coupon) as '比例'
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                payment.salespayment sp
                LEFT JOIN payment.salesreceipt sr ON sp.srid = sr.srid
                LEFT JOIN sales.sales s ON sp.sid = s.sid
                LEFT JOIN decoration.decoration d ON s.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId AND db.type = 0 AND db.status = 0 AND db.defaultflag = 1)
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON s.suid = du.uid
                LEFT JOIN communion.department dd ON du.deptId = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user iu ON s.iuid = iu.uid
                LEFT JOIN communion.department id ON iu.deptid = id.did
                LEFT JOIN communion.department ir ON id.fdid = ir.did
                LEFT JOIN communion.user sdu ON db.buid = sdu.uid
                LEFT JOIN communion.department sdd ON db.did = sdd.did
                LEFT JOIN communion.department sdr ON db.rid = sdr.did
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.company co ON d.company = co.cid
            WHERE
                sr.collectTime >= '%s 00:00:00' AND
                sr.collectTime <= '%s 23:59:59' AND
                (sp.type in (2, 3, 8) OR (sp.type in (4, 5, 6, 7) and sr.coupon != 0)) AND
                d.company = %s
        """

        self.SQL_RECEIPT = """
            SELECT rt.no, rt.name, rt.fund FROM data.receipttype rt 
            WHERE rt.rtid = IFNULL((SELECT r.rtid FROM data.receipttype r WHERE %s AND r.company = %s), 1)
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

    def getReiceipt(self, dbcursor, noname, value, company):

        conditionstr = ""

        if noname == "no":
            conditionstr = "r.`no` = '%s'" % value
        elif noname == "name":
            conditionstr = "r.`name` = '%s' AND r.status = 1" % value

        dbcursor.cursor.execute(dbcursor.SQL_RECEIPT % (conditionstr, company))  # 收据类型

        return dbcursor.cursor.fetchall()

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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, company)
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

            sql = self.SQL_QUERY % (self.column, startTime, endTime, company)
            factor = self.SQL_FACTOR %(company)
            
            

            tableHead = [
                "装修单号", "楼盘", "楼号", "等级", "类型", "状态", "签单时间", "主材员编号", "主材员", "主材分区",
                "装修公司", "设计师编号", "设计师", "人员状态", "设计师分区编号", "设计师分区", "设计师部编号", "设计师部", "签单设计师编号", "签单设计师", 
                "签单设计部编号", "签单设计部", "签单设计分区编号", "签单设计分区", "方案设计编号", "方案设计", "款项金额", "净业绩", "券用", "券信息", 
                "款项类型", "收款时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            rate = self.page(factor, 1, 1)
            rate = (len(rate) > 0 and rate[0][0]) and rate[0][0] or 1

            while pageflag:

                data = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(data):
                
                    rows = list(v)
                    
                    if rows[30] in(4, 5, 6, 7):
                        rows[26] = -rows[26]
                        rows[27] = -rows[27]

                    self.divNum(rows, [26, 27, 28])
                    coupon = 0
                    couponinfo = ""
                    bankinfos = rows[29].split("#")

                    for k in range(1, len(bankinfos) - 1):

                        if bankinfos[k].find(":") == -1: continue

                        bankinfo = bankinfos[k].split(":")

                        receiptBank = self.getReiceipt(self, 'no', bankinfo[0], company)

                        if receiptBank[0][2] == 0 or (rows[30] in ('4', '5', '6', '7')):  # 资金 或者 退款
                            coupon = coupon + float(bankinfo[1])
                            couponinfo = rows[29].replace("#%s" % receiptBank[0][0], "#%s" % receiptBank[0][0])

                    if rows[33] == None: rows[33] = 0

                    rows[28] = float(coupon) * float(rows[33])
                    rows[29] = couponinfo

                    rows[26] = float(rows[26]) * float(rows[33])
                    rows[27] = float(rows[27]) * float(rows[33]) * float(rate)

                    self.createTableHead(sheet, rows[:33], count)

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
        销售业绩(销售款)脚本说明:
            根据查询条件,以分页形式导出销售业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/8/01-2022/8/31
            3.company     公司:1
        2.命令使用 plan_export_sales_achievement_payment.py  pid args company
                   plan_export_sales_achievement_payment.py  3866 2022/8/01-2022/8/31 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4309
    # args = "2023/03/01-2023/03/14"
    # company = "1"

    achievement = Achievement(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    achievement.main(pid, args, int(company))
