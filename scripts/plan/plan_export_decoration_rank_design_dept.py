#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Rank(Util):

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

        self.colum_sign = u"""
            dd.NO AS `部门编号`,
            dd.NAME AS `设计部门`,
            dr.NO AS `分区编号`,
            dr.NAME AS `设计分区`,
            sum( db.rate ) AS `签单户数`,
            sum( IF ( d.type = 1, d.precontractPrice * db.rate / 1000, d.orderTotalPrice * db.rate / 1000) ) AS `签单额`,
            sum( IF ( d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) * db.rate / 1000 ) AS `非业务提成`,
            sum( d.couponCut * db.rate / 1000 ) AS `券优惠`,
            sum( d.thingCut * db.rate / 1000 ) AS `物品优惠`,
            sum( dh.servicePaidup * db.rate / 1000 ) AS `服务费`,
            sum( IF ( d.type = 1, d.precontractPrice * db.rate / 1000, (d.orderTotalPrice - d.couponCut) * db.rate / 1000) ) AS `净业绩`  
        """

        self.SELECT_SQL_SIGN = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
                LEFT JOIN quotation.quotation q ON q.orderId = d.orderId AND q.defaults = 1,
                communion.department AS dd,
                communion.department AS dr,
                decoration.decorationbelong AS db
            WHERE
                d.orderId = db.orderId 
                AND db.did = dd.did 
                AND db.rid = dr.did 
                AND (
                  (d.contractTime >= '%s 00:00:00' AND d.contractTime <= '%s 23:59:59' AND d.type != 1 AND d.status in (3, 7)) OR 
                  (d.precontractTime >= '%s 00:00:00' AND d.precontractTime <= '%s 23:59:59' AND d.type = 1))
                AND d.company = %s
                AND db.`status` = 0
                AND db.`type` = 0
        """

        self.colum_devise = u"""
            dd.NO AS `部门编号`,
            dd.NAME AS `设计部门`,
            dr.NO AS `分区编号`,
            dr.NAME AS `设计分区`,
            sum( db.rate ) AS `设计费户数`,
            sum( dp.referMoney * db.rate/1000 ) AS `设计费` 
        """

        self.SELECT_SQL_DEVISE = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.department dd,
                communion.department dr,
                (
                    SELECT 
                        dp.orderId as orderId, 
                        dp.paymenttype, 
                        sum( IF ( dp.paymenttype = '设计费退款', -dp.refermoney, dp.refermoney )) AS referMoney
                    FROM 
                        payment.decorationpayment dp,
                        payment.decorationreceipt pr
                    WHERE
                        dp.paymentType IN ( '设计费', '设计费退款', '设计费历史' ) AND
                        pr.collectTime > '%s 00:00:00' AND
                        pr.collecttime < '%s 23:59:59' AND
                        dp.drId = pr.drid
                    GROUP BY
                        dp.orderId
                ) dp
            WHERE
                d.orderId = db.orderId 
                AND db.did = dd.did 
                AND db.rid = dr.did 
                AND d.orderId = dp.orderId 
                AND d.company = %s
                AND db.type = 0 
                AND db.status = 0
        """

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

            sqlcount1 = self.SELECT_SQL_SIGN % ("count(*)", startTime, endTime, startTime, endTime, company)
            sqlcount2 = self.SELECT_SQL_DEVISE % ("count(*)", startTime, endTime, company)

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

            sql1 = "%s GROUP BY db.did" % (self.SELECT_SQL_SIGN % (self.colum_sign, startTime, endTime, startTime, endTime, company))
            sql2 = "%s GROUP BY db.did" % (self.SELECT_SQL_DEVISE % (self.colum_devise, startTime, endTime, company))

            self.cursor.execute(sql1)

            decorationSigns = self.cursor.fetchall()

            results = []
            fields = ["部门编号", "设计部门", "分区编号", "设计分区", "签单户数", "签单额", "非业务提成", "券优惠", "物品优惠", "服务费", "净业绩"]

            for decorationsign in decorationSigns:
                _ = dict(zip(fields, decorationsign))
                _["设计户数"] = 0
                _["设计费"] = 0
                _["服务费"] = _["服务费"] if _["服务费"] else 0
                _["非业务提成"] = _["非业务提成"] if _["非业务提成"] else 0 
                _["净业绩"] = int(_["净业绩"]) - int(_["非业务提成"]) - int(_["物品优惠"])
                _["总业绩"] = int(_["净业绩"]) + int(_["服务费"])

                results.append(_)

            self.cursor.execute(sql2)

            decorationDevises = self.cursor.fetchall()
            fields = ["部门编号", "设计部门", "分区编号", "设计分区", "设计户数", "设计费"]

            for decorationDevise in decorationDevises:
                _ = dict(zip(fields, decorationDevise))
                index = 0

                for result in results:
                    if (_['部门编号'] == result['部门编号']):
                        index = 1
                        _["总业绩"] = int(result["净业绩"]) + int(result["服务费"]) + int(_["设计费"])
                        result.update(_)

                if (index == 0):
                    _["签单户数"] = 0
                    _["签单额"] = 0
                    _["非业务提成"] = 0
                    _["券优惠"] = 0
                    _["物品优惠"] = 0
                    _["服务费"] = 0
                    _["净业绩"] = 0
                    _["总业绩"] = _["设计费"]
                    results.append(_)

            results.sort(key=lambda x:x['总业绩'],reverse=True)
            workbook, sheet = self.createWorkbook(u"设计部门签单业绩排名")

            tableHead = [u"部门编号", u"设计部门", u"分区编号", u"设计分区", u"签单户数", u'签单额', u'服务费',u"设计费户数", u"设计费", u'净业绩',
                         u"总业绩"]

            self.createTableHead(sheet, tableHead)

            count = 1

            for i, v in enumerate(results):
                row = []

                row.append(v["部门编号"])
                row.append(v["设计部门"])
                row.append(v["分区编号"])
                row.append(v["设计分区"])
                row.append(v["签单户数"])
                row.append(v["签单额"])
                row.append(v["服务费"])
                row.append(v["设计户数"])
                row.append(v["设计费"])
                row.append(v["净业绩"])
                row.append(v["总业绩"])

                self.divNum(row, [4, 5, 6, 7, 8, 9, 10])

                self.createTableHead(sheet, row, count)
                count += 1

            molecular = molecular + len(results)
            schedules = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": int(schedules),
                u"plan.status": 4
            })

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
        设计部门签单业绩排名脚本说明:
            根据查询条件,以分页拿数据的方式导出设计部门签单业绩排名信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_decoration_rank_design_dept.py  pid args
            plan_export_decoration_rank_design_dept.py  299 2018/11/01-2018/11/30
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2022/10/01-2022/10/30'
    # company = 1
    
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    rank = Rank(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    rank.main(pid, args, int(company))
