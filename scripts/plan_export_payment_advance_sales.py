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

        self.colum = """
            d.orderId,
            d.grade,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS 'typeness',
            city.name,
            cp.name, 
            CONCAT(v.name, ' ', h.houseNumber) housenumber,
            c.name,
            du.userId,
            du.currentName,
            dr.no,
            dr.alias,
            dd.no,
            dd.alias,
            sdr.no,
            sdr.alias,
            sdd.no,
            sdd.alias,
            eu.userId,
            eu.currentName,
            cu.currentName,
            r.collectTime,
            IF(p.type in (1, 3), p.recharge, -p.recharge) AS 'recharge',
            communion.kv('payment', 'advancepayment', 'type', p.type) AS 'type',
            communion.kv('payment', 'advancepayment', 'paymenttype', p.paymenttype) AS 'paymenttype',
            communion.kv('payment', 'payment', 'status', p.status) AS 'status',
            r.cash,
            r.cashInfo,
            r.bank,
            r.bankInfo,
            r.checkv,
            r.checkvBank,
            r.installment,
            r.installmentBank,
            r.accounts,
            r.accountsBank,
            d.contractTime,
            communion.kv('decoration', 'decoration', 'status', d.status) AS 'status',
            dc.name,
            pc.name,
            r.comment
        """

        self.SELECT_SQL = """
            SELECT
                %s
            FROM
                payment.payment p
                LEFT JOIN payment.advancereceipt r ON p.arid = r.arid
                LEFT JOIN decoration.decoration d ON p.orderId = d.orderId
                LEFT JOIN decoration.decorationbelong db ON (d.orderId = db.orderId and db.type = 0 and db.defaultFlag = 1 and db.status = 0)
                LEFT JOIN communion.customer c ON d.customerId = c.cid
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.cityproper cp ON v.cityProperId = cp.cpid
                LEFT JOIN communion.city city ON cp.cid = city.cid
                LEFT JOIN communion.user du ON db.buid = du.uid
                LEFT JOIN communion.user eu ON d.euid = eu.uid
                LEFT JOIN communion.department dd ON db.did = dd.did
                LEFT JOIN communion.department dr ON db.rid = dr.did
                LEFT JOIN communion.department sdd ON du.deptid = sdd.did
                LEFT JOIN communion.department sdr ON sdd.fdid = sdr.did
                LEFT JOIN communion.user cu ON r.cluid = cu.uid
                LEFT JOIN communion.company dc ON d.company = dc.cid
                LEFT JOIN communion.company pc ON p.company = pc.cid
            WHERE
                r.%s >= '%s 00:00:00' AND 
                r.%s <= '%s 23:59:59' 
                %s
            """

    def company(self, cloumCompany, company):
    
        if company != 0:
            companyId = "AND %s = %s" % (cloumCompany, company)
        else:
            companyId = " "

        return companyId

    def main(self, timeType, pid, args, company):

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

            timeColumn = "collectTime"
            if timeType == "0":
                timeColumn = "collectTime"
            elif timeType == "1":
                timeColumn = "confirmTime"

            sqlcount = self.SELECT_SQL % ("count(*)", timeColumn, startTime, timeColumn, endTime, self.company("p.company", company))

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

            sql = self.SELECT_SQL % (self.colum, timeColumn, startTime, timeColumn, endTime, self.company("p.company", company))

            workbook, sheet = self.createWorkbook("预付款")

            tableHead = [
                "装修单号", "装修单等级", "装修单类型", "城市", "城区", "楼盘地址", "客户", "设计师编号", "设计师", "签约设计分区编号", 
                "签约设计分区", "签约设计部编号", "签约设计部", "设计师分区编号", "设计师分区", "设计师部编号", "设计师部", "方案设计编号", "方案设计", "收款人", 
                "收款时间", "金额", "类型", "预付款类型", "状态", "现金", "现金信息", "刷卡", "刷卡信息", "转账", 
                "转账银行", "分期", "分期银行", "对公", "对公银行", "签单时间", "订单状态", "装修单公司", "款项公司", "备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    
                    data = list(v)

                    self.divNum(data, [21, 25, 27, 29, 31, 33])

                    self.createTableHead(sheet, data, count)
                    
                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

            resultfilepath = self.packFile(pid, workbook, True)

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
        导出装修款_外链统计脚本说明:
        根据查询条件,以分页拿数据的方式导出主材收款;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.timeType 时间, 0: 收款时间 1: 确认时间
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司:1
        2.脚本传参说明:
             plan_export_payment_advance.py time pid     args             company
             plan_export_payment_advance.py 0 929 2018/12/01-2018/12/31 1

        3.注:
            1.结束时间不能大于开始时间31天

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    timeType = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(timeType, pid, args, int(company))
