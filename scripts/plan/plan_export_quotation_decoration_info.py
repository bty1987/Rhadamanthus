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
            d.orderId,
            v.name,
            h.houseNumber,
            h.buildArea,
            h.innerArea,
            dr.name,
            dd.name,
            du.userId,
            du.currentName,
            sr.name,
            sd.name,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '类型',
            cn.name,
            d.contractTime,
            d.%s,
            d.orderTotalPrice,
            q.totalprice,
            q.undisPrice,
            q.disPrice,
            q.trafficPrice,
            q.managePrice,
            q.taxPrice
        """

        self.SQL_EXPORT_DECORATION_INFO = """
            SELECT
                %s
            FROM
                decoration.decoration d,
                communion.village v,
                communion.house h,
                communion.user du,
                communion.department dd,
                communion.department dr,
                communion.user su,
                communion.department sd,
                communion.department sr,
                data.constructionnode cn,
                quotation.quotation q
            WHERE
                d.hid = h.hid AND
                h.vid = v.vid AND
                d.dsuid = du.uid AND
                du.deptId = dd.did AND
                dd.fdid = dr.did AND
                d.smuid = su.uid AND
                su.deptid = sd.did AND
                sd.fdid = sr.did AND
                d.projectStatus = cn.cnid AND
                d.orderId = q.orderId AND
                q.defaults = 1 AND
                d.%s >= '%s 00:00:00' AND
                d.%s <= '%s 23:59:59' AND
                d.company = %s
        """

        self.SQL_SALESTOTAL = """
            SELECT 
                SUM(IF(sp.type IN (2, 3, 8), sp.referMoney, -sp.referMoney)) AS 'salesTotal'
            FROM 
                sales.sales s,
                payment.salespayment sp
            WHERE
                s.orderId = '%s' AND
                s.sid = sp.sid AND
                sp.status in (1, 2)
        """
        
        self.SQL_MATERIALTOTAL = """
            SELECT 
                SUM(IF(mp.paymenttype IN (2, 3), mp.referMoney, -mp.referMoney)) AS 'materialTotal'
            FROM 
                material.material m,
                payment.materialpayment mp
            WHERE
                m.orderId = '%s' AND
                m.mid = mp.mid AND
                mp.paymentstatus in (1, 2)
        """
    def createTableHead(self, sheet, tableHeadList, num=0):
    
        count = 0
        
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def main(self, type, pid, args, company):
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

            # 0 决算时间 1 内决时间 2 签单时间
            if type == "0":
                timeColumn = "accountTime"
            elif type == "1":
                timeColumn = "balanceTime"
            elif type == "2":
                timeColumn = "contractTime"

            sqlcount = self.SQL_EXPORT_DECORATION_INFO % ("count(*)", timeColumn, startTime, timeColumn, endTime, company)
                
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

            workbook, sheet = self.createWorkbook("决算信息")

            # 0 决算时间 1 内决时间 2 签单时间
            if type == "0":
                time = "accountTime"
            elif type == "1":
                time = "balanceTime"
            elif type == "2":
                time = "accountTime"

            sql = self.SQL_EXPORT_DECORATION_INFO % (self.column%(time), timeColumn, startTime, timeColumn, endTime, company)

            tableHead = [
                "装修单号", "楼盘", "楼号", "建筑面积", "计价面积", "设计分区", "设计部", "工号", "设计师", "业务分区", 
                "业务部", "类型", "工程状态", "签单时间", "决算时间", "净业绩", "折前总额", "打折总额", "不打折总额", "车运费", 
                "管理费", "税金", "总金额"
            ]

            self.createTableHead(sheet, tableHead)
            
            count = 1
            nowPage = 1
            pageflag = True
            
            while pageflag:
            
                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    rows = list(v)

                    orderId = rows[0]

                    self.cursor.execute(self.SQL_SALESTOTAL % (orderId))

                    salesData = self.cursor.fetchall()
                    salesTotal = len(salesData) > 0 and salesData[0][0] or 0

                    self.cursor.execute(self.SQL_MATERIALTOTAL % (orderId))

                    materialData = self.cursor.fetchall()
                    materialTotal = len(materialData) > 0 and materialData[0][0] or 0

                    total = salesTotal + materialTotal

                    rows.append(total)
                    
                    rows[15] = rows[16] + rows[17] + rows[18] + rows[19] + rows[20]
                    
                    self.divNum(rows, [3, 4, 15, 16, 17, 18, 19, 20, 21, 22])
                    
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
        决算信息脚本说明:
            根据查询条件,以分页形式导出外销单业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/12/01-2022/12/31
            3.company     公司:1
        2.命令使用 plan_export_quotation_decoration_info.py  pid args company
                   plan_export_quotation_decoration_info.py  4070 2022/12/01-2022/12/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # type = "0"
    # pid = 4535
    # args = "2022/08/01-2022/08/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, company)