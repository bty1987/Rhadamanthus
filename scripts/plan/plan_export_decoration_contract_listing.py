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

        self.user = {}
        self.signArea = {}
        self.signUnit = {}
        self.smuser = {}
        self.smSignArea = {}
        self.smSignUnit = {}

        self.colum =u"""
            dl.rate AS rate,
            des.name AS defaname,
            de.name AS dename,
            desi.userName AS username,
            dl.rate * dd.orderTotalPrice AS price,
            dl.buid AS buid,
            dl.rid AS rid,
            dl.did AS did,
            dl.type AS type
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS dd, 
                communion.user AS desi,
                decoration.decorationbelong AS dl,
                communion.department AS de,
                communion.department AS des
            WHERE
                dd.orderId = dl.orderId AND 
                dd.company = %s AND 
                dl.buid = desi.uid AND 
                dl.did = de.did AND 
                dl.rid = des.did AND 
                de.status = 1 AND 
                de.company = %s AND 
                des.status = 1 AND 
                des.company = %s AND 
                dd.status = 2 AND 
                dl.status = 0 AND 
                dd.contractTime >= '%s 00:00:00' AND 
                dd.contractTime <= '%s 23:59:59'		
        """

    # 创建表格返回sheet页
    def createWorkbookAndSheet(self, path, workbook, sheet):

        self.workbooks = workbook
        table1 = [u"排名", u"部门", u"分区", u"签单数量", u"签单额"]  # 设计部门排名
        table2 = [u"排名", u"分区", u"签单数量", u"签单额"]  # 设计分区排名
        table3 = [u"排名", u"设计师", u"部门名称", u"分区名称", u"签单数量", u"签单额"]  # 设计师排名

        sheet1 = sheet
        sheet2 = self.workbooks.add_sheet(u"设计分区排名", cell_overwrite_ok=True)
        sheet3 = self.workbooks.add_sheet(u"设计师排名", cell_overwrite_ok=True)
        sheet4 = self.workbooks.add_sheet(u"业务部门排名", cell_overwrite_ok=True)
        sheet5 = self.workbooks.add_sheet(u"业务分区排名", cell_overwrite_ok=True)
        sheet6 = self.workbooks.add_sheet(u"业务员排名", cell_overwrite_ok=True)

        self.createTableHead(sheet1, table1)
        self.createTableHead(sheet2, table2)
        self.createTableHead(sheet3, table3)
        self.createTableHead(sheet4, table1)
        self.createTableHead(sheet5, table2)
        table3[1] = u"业务员"
        self.createTableHead(sheet6, table3)

        self.saveWorkbook(path, self.workbooks)

        return sheet1, sheet2, sheet3, sheet4, sheet5, sheet6

    def assortDate(self, v):

        rate = int(v[0])
        regionName = u'%s' % v[1]
        deptName = u'%s' % v[2]
        userName = u'%s' % v[3]
        price = int(v[4])/ 1000000
        userId = u'%s' % v[5]
        regionId = u'%s' % v[6]
        deptId = u'%s' % v[7]
        types = int(v[8])

        # type == 0
        signUnit = (deptName, regionName, rate, price)
        signArea = (regionName, rate, price)
        user = (userName, deptName, regionName, rate, price)

        # type == 1
        smSignUnit = (deptName, regionName, rate, price)
        smSignArea = (regionName, rate, price)
        smuser = (userName, deptName, regionName, rate, price)

        if types == 0:
            if userId not in self.user:
                self.user[userId] = user
            else:
                user = list(self.user[userId])
                sumRate = user[3] + rate
                sumPrice = user[4] + price

                self.user[userId] = (userName, deptName, regionName, sumRate, sumPrice)

            if regionId not in self.signArea:
                self.signArea[regionId] = signArea
            else:
                signArea = list(self.signArea[regionId])
                sumRate = signArea[1] + rate
                sumPrice = signArea[2] + price
                self.signArea[regionId] = (regionName, sumRate, sumPrice)

            if deptId not in self.signUnit:
                self.signUnit[deptId] = signUnit
            else:
                signUnit = list(self.signUnit[deptId])
                sumRate = signUnit[2] + rate
                sumPrice = signUnit[3] + price
                self.signUnit[deptId] = (deptName, regionName, sumRate, sumPrice)

        else:

            if userId not in self.smuser:
                self.smuser[userId] = smuser
            else:
                smuser = list(self.smuser[userId])
                smRate = smuser[3] + rate
                smPrice = smuser[4] + price
                self.smuser[userId] = (userName, deptName, regionName, smRate, smPrice)

            if regionId not in self.smSignArea:
                self.smSignArea[regionId] = smSignArea
            else:
                smSignArea = list(self.smSignArea[regionId])
                smRate = smSignArea[1] + rate
                smPrice = smSignArea[2] + price
                self.smSignArea[regionId] = (regionName, smRate, smPrice)

            if deptId not in self.smSignUnit:
                self.smSignUnit[deptId] = smSignUnit
            else:
                smSignUnit = list(self.smSignUnit[deptId])
                smRate = smSignUnit[2] + rate
                smPrice = smSignUnit[3] + price
                self.smSignUnit[deptId] = (deptName, regionName, smRate, smPrice)

    def wirteSheetByAssortDate(self):

        listDate = [self.signUnit, self.signArea, self.user, self.smSignUnit, self.smSignArea, self.smuser]
        sortRuler = [3, 2, 4, 3, 2, 4]

        for i, v in enumerate(self.sheets):

            listDate[i] = listDate[i].values()
            listDate[i] = sorted(listDate[i], key=lambda ruler: ruler[sortRuler[i]], reverse=True)

            portraits = 1
            money = 0
            num = 0
            for j, k in enumerate(listDate[i]):
                money += k[len(k) - 1]
                num += k[len(k) - 2]
                self.createTableHead(v, (portraits,) + k, portraits)
                portraits = portraits + 1

            alignment = xlwt.Alignment()
            alignment.horz = xlwt.Alignment.HORZ_CENTER
            style = xlwt.XFStyle()
            style.alignment = alignment
            v.write_merge(portraits, portraits, 0, sortRuler[i] - 1, u"合计", style)
            self.writeWorkbook(v, portraits, sortRuler[i], str(num))
            self.writeWorkbook(v, portraits, sortRuler[i]+1, str(money))

    def main(self, pid, args, company, decompany, descompany,):
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

            sql1 = self.SQL_QUERY % ("count(*)", company, decompany, descompany, startTime, endTime)
            count = self.count(sql1)

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

            sqls = self.SQL_QUERY % (self.colum, company, decompany, descompany, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"设计部门排名")

            flags = True
            nowPage = 1
            
            while (flags):

                data = self.page(sqls, nowPage, self.size)

                for i, v in enumerate(data):
                    # 整理数数据准备排名
                    datas = list(v)
                    self.divNum(datas, [0])
                    self.assortDate(datas)

                self.updataSchedule(self.pthost, pid, paln)

                nowPage = nowPage + 1
                if len(data) < self.size:
                    flags = False

                molecular = molecular + len(data)
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
        签单排名脚本说明:
            根据查询条件,以分页形式分别以设计师,部门,分区分别导出签单排名;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/11/01-2018/11/30"
            3.company     公司:1
        2.命令使用 plan_export_decoration_contract_listing.py  pid            args                    company
                   plan_export_decoration_contract_listing.py  299    "2018/11/01-2018/11/30"           1

    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    decompany = company
    descompany = company

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"),dbconf.get("password"), config.get("media"),config.get("pthost"))
    exporter.main(pid, args, int(company), int(decompany), int(descompany))