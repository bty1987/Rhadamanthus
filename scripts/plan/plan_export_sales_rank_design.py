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
        self.size = 400

        self.colum_advance = u"""
            sdu.userid AS '设计师编号',
            sdu.currentName AS '设计师',
            sdd.no AS '部门编号',
            sdd.name AS '设计部门',
            sdr.no AS '分区编号',
            sdr.name AS '设计分区',
            IF(p.type = 1, p.recharge, -p.recharge) AS '款项金额',
            IF(p.type = 1, p.recharge, -p.recharge) AS '净业绩'
        """

        self.SELECT_SQL_ADVANCE = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                payment.payment AS p,
                payment.advancereceipt ar,
                communion.company AS co,
                communion.user as sdu,
                communion.department sdd,
                communion.department sdr
            WHERE
                d.orderId = p.orderId
                AND d.orderId = db.orderId
                AND p.arid = ar.arid
                AND d.company = co.cid
                AND db.buid = sdu.uid
                AND db.did = sdd.did
                AND db.rid = sdr.did
                AND p.type IN (0, 1)
                AND p.paymentType = 2
                AND db.type = 0
                AND db.status = 0
                AND db.defaultflag = 1
                AND ar.collecttime >= '%s 00:00:00'
                AND ar.collecttime <= '%s 23:59:59'
                AND d.company = %s
        """

        self.colum_balance = u"""
            du.userId AS '设计师编号',
            du.currentName AS '设计师',
            dd.no AS '部门编号',
            dd.name AS '设计部门',
            dr.no AS '分区编号',
            dr.name AS '设计分区',
            IF(sp.type in (2, 3, 8), (sr.cash + sr.bank + sr.checkv + sr.coupon), -(sr.cash + sr.bank + sr.checkv + sr.coupon)) AS `款项金额`,
            IF(sp.type in (2, 3, 8), (sr.cash + sr.bank + sr.checkv), -(sr.cash + sr.bank + sr.checkv)) AS `净业绩`
        """

        self.SELECT_SQL_BALANCE = u"""
            SELECT
                %s
            FROM
                payment.salespayment sp,
                payment.salesreceipt sr,
                decoration.decoration d,
                sales.sales s,
                communion. USER du,
                communion.department dd,
                communion.department dr,
                communion.company co
            WHERE
                sp.srid = sr.srid
                AND sp.sid = s.sid
                AND s.orderId = d.orderId
                AND d.dsuid = du.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND d.company = co.cid
                AND sr.collectTime >= '%s 00:00:00'
                AND sr.collectTime <= '%s 23:59:59'
                AND (sp.type in (2, 3, 8) OR (sp.type in (4, 5, 6, 7) and sr.coupon != 0))
                AND d.company = %s
        """

    def sheet2(self, workbook, data):

        tableHead2 = [u"部门编号", u"设计部门", u"分区编号", u"设计分区", u"款项金额", u'净业绩']
        sheet2 = workbook.add_sheet(u"设计部门主材业绩排名", cell_overwrite_ok=True)

        self.createTableHead(sheet2, tableHead2)

        portrait = 1

        for i, v in enumerate(data):

            row = []

            row.append(v["部门编号"])
            row.append(v["设计部门"])
            row.append(v["分区编号"])
            row.append(v["设计分区"])
            row.append(v["款项金额"])
            row.append(v["净业绩"])

            self.divNum(row, [4, 5])

            self.createTableHead(sheet2, row, portrait)
            
            portrait = portrait + 1

    def sheet3(self, workbook, data):

        tableHead2 = [u"分区编号", u"设计分区", u"款项金额", u'净业绩']
        sheet2 = workbook.add_sheet(u"设计分区主材业绩排名", cell_overwrite_ok=True)

        self.createTableHead(sheet2, tableHead2)

        portrait = 1

        for i, v in enumerate(data):

            row = []

            row.append(v["分区编号"])
            row.append(v["设计分区"])
            row.append(v["款项金额"])
            row.append(v["净业绩"])

            self.divNum(row, [2, 3])

            self.createTableHead(sheet2, row, portrait)
            
            portrait = portrait + 1

    def groupBy(self, datas, string):
        results = []

        fields = ["员工编号", "设计师", "部门编号", "设计部门", "分区编号", "设计分区", "款项金额", "净业绩"]

        for data in datas:
            _ = dict(zip(fields, data))
            index = 0
            for result in results:
                if (_[string] == result[string]):
                    index = 1
                    _["款项金额"] = _["款项金额"] if _["款项金额"] else 0
                    _["净业绩"] = _["净业绩"] if _["净业绩"] else 0

                    _["款项金额"] = int(_["款项金额"]) + int(result["款项金额"])
                    _["净业绩"] = int(_["净业绩"]) + int(result["净业绩"])

                    result.update(_)
            if (index == 0):
                _["款项金额"] = _["款项金额"] if _["款项金额"] else 0
                _["净业绩"] = _["净业绩"] if _["净业绩"] else 0

                results.append(_)
        return results

    def main(self, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount1 = self.SELECT_SQL_ADVANCE % ("count(*)", startTime, endTime, company)
            sqlcount2 = self.SELECT_SQL_BALANCE % ("count(*)", startTime, endTime, company)

            count = self.count(sqlcount1) + self.count(sqlcount2)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sql1 = self.SELECT_SQL_ADVANCE % (self.colum_advance, startTime, endTime, company)
            sql2 = self.SELECT_SQL_BALANCE % (self.colum_balance, startTime, endTime, company)
            
            self.cursor.execute(sql1)
            data1 = self.cursor.fetchall()

            self.cursor.execute(sql2)
            data2 = self.cursor.fetchall()
            
            data = list(data1 + data2)
            
            data.sort(key=lambda x: x[7], reverse=True)

            resultsu = self.groupBy(data, "员工编号")
            resultsd = self.groupBy(data, "部门编号")
            resultsr = self.groupBy(data, "分区编号")

            resultsu.sort(key=lambda x: x['净业绩'], reverse=True)
            resultsd.sort(key=lambda x: x['净业绩'], reverse=True)
            resultsr.sort(key=lambda x: x['净业绩'], reverse=True)

            workbook, sheet = self.createWorkbook(u"设计师主材业绩排名")

            tableHead = [u"设计师编号", u"设计师", u"部门编号", u"设计部门", u"分区编号", u"设计分区", u"款项金额", u'净业绩']

            self.createTableHead(sheet, tableHead)

            count = 1
            
            for i, v in enumerate(resultsu):
            
                row = []
                
                row.append(v["员工编号"])
                row.append(v["设计师"])
                row.append(v["部门编号"])
                row.append(v["设计部门"])
                row.append(v["分区编号"])
                row.append(v["设计分区"])
                row.append(v["款项金额"])
                row.append(v["净业绩"])
                
                self.divNum(row, [6, 7])
                
                self.createTableHead(sheet, row, count)
                
                count += 1

            molecular = molecular + len(resultsu)
            schedules = (molecular / all) * 100
            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": int(schedules),
                u"plan.status": 4
            })

            self.sheet2(workbook, resultsd)
            self.sheet3(workbook, resultsr)
            
            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                u"plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        设计师签单业绩排名脚本说明:
            根据查询条件,以分页拿数据的方式导出设计师签单业绩排名信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

            sheet1页: 按设计师进行合并,并累加总业绩后进行排序(高>低)
            sheet2页: 按设计部门进行合并,并累加总业绩后进行排序(高>低)
            sheet3页: 按设计分区进行合并,并累加总业绩后进行排序(高>低)
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_sales_rank_design.py  pid args
            plan_export_sales_rank_design.py  299 2018/11/01-2018/11/30

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = 4543
    args = '2020/04/01-2023/04/30'
    company = 1

    # pid = sys.argv[1]
    # args = sys.argv[2]
    # company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))