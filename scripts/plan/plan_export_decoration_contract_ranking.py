# !/usr/bin/python
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
        self.size = 400
        self.workbooks = None
        self.sheets = None

        self.user = {}  # 设计师
        self.signArea = {}  # 设计大区
        self.signUnit = {}  # 设计部

        self.smuser = {}  # 业务员
        self.smSignArea = {}  # 业务大区
        self.smSignUnit = {}  # 业务部

        self.colum = u"""
                db.rate AS rate,
                dr.name AS defaname,
                dd.name AS dename,
                du.userName AS username,
                db.rate * d.orderTotalPrice AS price,
                du.userId AS userId,
                dr.`no` AS drno,
                dd.`no` AS ddno,
                (orderTotalPrice - (IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate)) - couponCut - thingCut) * db.rate AS cs3,
                0 AS cs1,
                0 AS cs4,
                0 AS cs5
            """

        self.colum_cs1 = u"""
                sum(db.rate) AS rate,
                dg.name AS defaname,
                dd.name AS dename,
                du.userName AS username,
                sum(dp.refermoney * db.rate) AS cs4, 
                du.userId AS userId,
                dg.`no` AS drno,
                dd.`no` AS ddno
            """

        self.colum_cs5 = u"""
                dr.name AS defaname,
                dd.name AS dename,
                du.userName AS username,
                sum(sp.serviceMoney * (db.rate)) AS cs5,
                du.userId AS userId,
                dr.`no` AS drno,
                dd.`no` AS ddno
            """


        self.SQL_Order_Signing_Informations = u""" 
            SELECT 
                %s
            FROM
                decoration.decorationbelong db,
                decoration.decoration d,
                communion.department dd,
                communion.department dr,
                quotation.quotation q,
                communion.user du
            WHERE
                d.orderId = db.orderId
                AND d.orderId = q.orderId
                AND db.buid = du.uid
                AND db.did = dd.did
                AND db.rid = dr.did
                AND db.type = %s
                AND db.status = 0
                AND q.defaults = 1 
                AND d.company = %s
                AND d.contractTime >= '%s 00:00:00'
                AND d.contractTime <= '%s 23:59:59'
        """

        self.SQL_cs1 = u""" 
            SELECT
                %s
            FROM
                decoration.decorationbelong db,
                payment.decorationpayment dp,
                payment.decorationreceipt dr,
                data.paymenttype cp, 
                communion.department dd,
                communion.department dg,
                decoration.decoration d,
                communion.user du
            WHERE
                dp.drid = dr.drid
                AND d.orderId = db.orderId
                AND dp.orderId = d.orderId 
                AND db.buid = du.uid
                AND db.did = dd.did
                AND db.rid = dg.did
                AND db.`status` = 0
                AND db.`type` = 0
                AND dp.ptid = cp.ptid 
                AND cp.paytype = 0 
                AND cp.bustype = 0 
                AND cp.atttype = 0 
                AND dp.paymentStatus in ( 1, 2 )
                AND d.company = %s
                AND dr.collectTime > '%s 00:00:00'
                AND dr.collectTime < '%s 23:59:59'
                %s
        """

        self.SQL_cs5 = """
            SELECT
                %s
            FROM
                decoration.decorationbelong db, 
                payment.servicepayment sp,
                payment.servicereceipt sr,
                decoration.decoration d,
                communion.department dd,
                communion.department dr,
                communion.user du
            WHERE
                sp.srid = sr.srid
                AND sp.orderId = d.orderId 
                AND d.orderId = db.orderId 
                AND db.buid = du.uid
                AND db.did = dd.did
                AND db.rid = dr.did
                AND db.`status` = 0 
                AND db.`type` = 0 
                AND d.company = %s
                AND sr.collectTime > '%s 00:00:00'
                AND sr.collectTime < '%s 23:59:59'
                %s
            """


    # 创建表格返回sheet页
    def createWorkbookAndSheet(self, path, workbook, sheet):

        self.workbooks = workbook
        # 设计部门排名
        table1 = [u"排名", u"部门编号", u"部门", u"分区编号", u"分区", u"签单数量", "设计户数", u"签单额", u"工程净业绩", "设计费", u'服务费', u"工程总净业绩"]
        # 设计分区排名
        table2 = [u"排名", u"分区", u"签单数量", u"签单额"]
        # 设计师排名
        table3 = [u"排名", u"人员工号", u"设计师", u"部门名称", u"分区名称", u"签单数量", u"设计户数", u"签单额", u"工程净业绩", u"设计费", u'服务费', u"工程总净业绩"]
        # 业务分区排名
        table4 = [u"排名", u"部门",  u"分区", u"签单数量", u"签单额" ]
        # 业务员排名
        table5 = [u"排名", u"业务员", u"部门名称", u"分区名称", u"签单数量", u"签单额", ]

        sheet1 = sheet
        sheet2 = self.workbooks.add_sheet(u"设计分区排名", cell_overwrite_ok=True)
        sheet3 = self.workbooks.add_sheet(u"设计师排名", cell_overwrite_ok=True)
        sheet4 = self.workbooks.add_sheet(u"业务部门排名", cell_overwrite_ok=True)
        sheet5 = self.workbooks.add_sheet(u"业务分区排名", cell_overwrite_ok=True)
        sheet6 = self.workbooks.add_sheet(u"业务员排名", cell_overwrite_ok=True)

        self.createTableHead(sheet1, table1)
        self.createTableHead(sheet2, table2)
        self.createTableHead(sheet3, table3)
        self.createTableHead(sheet4, table4)
        self.createTableHead(sheet5, table2)
        self.createTableHead(sheet6, table5)

        self.saveWorkbook(path, self.workbooks)

        return sheet1, sheet2, sheet3, sheet4, sheet5, sheet6

    # 排序数据
    def assortDate(self, v, type):
        rate = int(v["rate"]) / 1000 # 比例,签单数
        regionName = u'%s' % v["defaname"]  # 大区ID名称
        deptName = u'%s' % v["dename"]  # 部门名称
        userName = u'%s' % v["username"]
        price = int(v["price"]) / 1000000
        userId = u'%s' % v["userId"]
        regionId = u'%s' % v["drno"]
        deptId = u'%s' % v["ddno"]
        cs3 = int(v["cs3"] if v["cs3"] else 0) / 1000000 # 工程净业绩
        cs1 = int(v["cs1"]) / 1000  # 设计户数
        cs4 = int(v["cs4"]) / 1000000  # 设计费
        cs5 = int(v["cs5"]) / 1000000  # 服务费

        cs6 = cs3 + cs4 + cs5
        # type == 0
        signUnit = (deptId, deptName, regionId, regionName, rate, cs1, price, cs3, cs4, cs5, cs6) # 设计部门排名
        signArea = (regionName, rate, price)                                                      # 设计大区排名
        user = (userId, userName, deptName, regionName, rate, cs1, price, cs3, cs4, cs5, cs6)     # 设计师排名

        # type == 1
        smSignUnit = (deptName, regionName, rate, price)        # 业务部门排名
        smSignArea = (regionName, rate, price)                  # 业务大区排名
        smuser = (userName, deptName, regionName, rate, price)  # 业务员排名
        if type == 0:
            if userId not in self.user:
                self.user[userId] = user
            else:
                user = list(self.user[userId])
                sumRate = user[4] + rate
                sumPrice = user[6] + price
                sumCs3 = user[7] + cs3
                sumCs4 = user[8] + cs4
                sumCs5 = user[9] + cs5
                sumCs6 = user[10] + cs6
                self.user[userId] = (userId, userName, deptName, regionName, sumRate, cs1, sumPrice, sumCs3, sumCs4, sumCs5, sumCs6)

            # 大区
            if regionId not in self.signArea:
                self.signArea[regionId] = signArea
            else:
                signArea = list(self.signArea[regionId])
                sumRate = signArea[1] + rate  # 签单数量签单额
                sumPrice = signArea[2] + price
                self.signArea[regionId] = (regionName, sumRate, sumPrice)
            # 部门排名
            if deptId not in self.signUnit:
                self.signUnit[deptId] = signUnit
            else:
                signUnit = list(self.signUnit[deptId])
                sumRate = signUnit[4] + rate  # 签单数量签单额
                sumCs1 = signUnit[5] + cs1
                sumPrice = signUnit[6] + price
                sumCs3 = signUnit[7] + cs3
                sumCs4 = signUnit[8] + cs4
                sumCs5 = signUnit[9] + cs5
                sumCs6 = signUnit[10] + cs6
                self.signUnit[deptId] = (deptId, deptName, regionId, regionName, sumRate, sumCs1, sumPrice, sumCs3, sumCs4, sumCs5, sumCs6)

        else:
            if userId not in self.smuser:
                self.smuser[userId] = smuser
            else:
                smuser = list(self.smuser[userId])
                smRate = smuser[3] + rate
                smPrice = smuser[4] + price
                self.smuser[userId] = (userName, deptName, regionName, smRate, smPrice)

            # 大区
            if regionId not in self.smSignArea:
                self.smSignArea[regionId] = smSignArea
            else:
                smSignArea = list(self.smSignArea[regionId])
                smRate = smSignArea[1] + rate  # 签单数量签单额
                smPrice = smSignArea[2] + price
                self.smSignArea[regionId] = (regionName, smRate, smPrice)

            # 部门排名
            if deptId not in self.smSignUnit:
                self.smSignUnit[deptId] = smSignUnit
            else:
                smSignUnit = list(self.smSignUnit[deptId])
                smRate = smSignUnit[2] + rate  # 签单数量
                smPrice = smSignUnit[3] + price
                self.smSignUnit[deptId] = (deptName, regionName, smRate, smPrice)


    def wirteSheetByAssortDate(self):

        listDate = [self.signUnit, self.signArea, self.user, self.smSignUnit, self.smSignArea, self.smuser]
        sortRuler = [3, 2, 4, 3, 2, 4]

        for i, v in enumerate(self.sheets):
            listDate[i] = listDate[i].values()
            listDate[i] = sorted(listDate[i], key=lambda ruler: ruler[sortRuler[i]], reverse=True)

            portraits = 1
            for j, k in enumerate(listDate[i]):
                self.createTableHead(v, (portraits,) + k, portraits)
                portraits = portraits + 1

    def main(self, pid, args, company):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            type = {
                0: u"dsuid",
                1: u"smuid"
            }
            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sql1 = self.SQL_Order_Signing_Informations % ("count(*)", 0, company, startTime, endTime)
            sql2 = self.SQL_Order_Signing_Informations % ("count(*)", 1, company, startTime, endTime)
            sql3 = self.SQL_cs1 % ("count(*)", company, startTime, endTime, " ")
            sql4 = self.SQL_cs5 % ("count(*)", company, startTime, endTime, " ")

            countAll = self.count(sql1) + self.count(sql2) + self.count(sql3) + self.count(sql4)

            if countAll == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '无可导出数据'
                })
                return False

            all = countAll / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sqlc1 = self.SQL_cs1 % (self.colum_cs1, company, startTime, endTime, "GROUP BY du.userId")
            sqlc5 = self.SQL_cs5 % (self.colum_cs5, company, startTime, endTime, "GROUP BY du.userId")
            result = []

            workbook, sheet = self.createWorkbook(u"设计部门排名")

            fields = ["rate", "defaname", "dename", "username", "price", "userId", "drno", "ddno", "cs3", "cs1", "cs4", "cs5"]
            fields2 = ["cs1", "defaname", "dename", "username", "cs4", "userId", "drno", "ddno"]
            fields3 = ["defaname", "dename", "username", "cs5", "userId", "drno", "ddno"]

            self.cursor.execute(sqlc1)
            datac1 = self.cursor.fetchall()

            self.cursor.execute(sqlc5)
            datac5 = self.cursor.fetchall()

            for i, v in enumerate(type):
                sqls = self.SQL_Order_Signing_Informations % (self.colum, i, company, startTime, endTime)

                self.cursor.execute(sqls)
                datas = self.cursor.fetchall()

                for data in datas:
                    _ = dict(zip(fields, data))
                    result.append(_)

                if not i:

                    userId1 = -1
                    for data1 in datac1:
                        _ = dict(zip(fields2, data1))
                        index = 0

                        for decorationcontract in result:
                            if (_['userId'] == decorationcontract['userId'] and userId1 != decorationcontract['userId']):
                                index = 1
                                userId1 = decorationcontract['userId']
                                decorationcontract["cs1"] = int(_["cs1"])
                                decorationcontract["cs4"] = int(_["cs4"])

                        if (index == 0):
                            _["rate"] = 0
                            _["price"] = 0
                            _["cs3"] = 0
                            _["cs5"] = 0
                            result.append(_)

                    userId5 = -1
                    for data5 in datac5:
                        _ = dict(zip(fields3, data5))
                        index = 0

                        for decorationcontract in result:
                            if (_['userId'] == decorationcontract['userId'] and userId5 != decorationcontract['userId']):
                                index = 1
                                userId5 = decorationcontract['userId']
                                decorationcontract["cs5"] = int(_["cs5"])

                        if (index == 0):
                            _["rate"] = 0
                            _["price"] = 0
                            _["cs1"] = 0
                            _["cs3"] = 0
                            _["cs4"] = 0
                            result.append(_)

                    for value in result:
                        self.assortDate(value, v)  # 整理数数据准备排名
                else:

                    for value in result:
                        self.assortDate(value, v)  # 整理数数据准备排名

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules)
                })

            self.sheets = self.createWorkbookAndSheet(xlspath, workbook, sheet)

            self.wirteSheetByAssortDate()

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
        签单排名脚本说明:
            根据查询条件,以分页形式分别以设计师,部门,分区分别导出签单排名;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2017/10/17-2018/12/12"
            3.company     公司:1
        2.命令使用 python plan_export_decoration_contract_ranking.py  pid            args                company
                   python plan_export_decoration_contract_ranking.py  3625    "2022/06/01-2022/06/30"         1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]
    
    # pid = 3625
    # args = "2023/10/01-2023/10/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"),dbconf.get("password"), config.get("media"),config.get("pthost"))
    exporter.main(pid, args, int(company))
