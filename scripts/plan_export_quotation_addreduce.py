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
            h.housenumber,
            h.buildArea,
            h.innerArea,
            dr.name,
            dd.name,
            du.userId,
            du.currentName,
            su.userId,
            su.currentName,
            communion.kv('quotation', 'addreduce', 'type', ar.type),
            communion.kv('quotation', 'addreduce', 'atttype', ar.atttype),
            communion.kv('quotation', 'addreduce', 'paytype', ar.paytype),
            communion.kv('quotation', 'addreduce', 'status', ar.status),
            ar.total,
            ar.createTime,
            %s
            ar.sendtime,
            ar.affirmTime,
            co.name
        """

        self.SQL_QUERY_HANDLE = """
            SELECT
                %s
            FROM
                quotation.addreduce ar
                LEFT JOIN decoration.decoration d ON ar.orderId = d.orderId 
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did 
                LEFT JOIN communion.department dr ON dd.fdid = dr.did 
                LEFT JOIN communion.user su ON d.svuid = su.uid
                LEFT JOIN communion.company co ON d.company = co.cid
                %s
            WHERE
                %s >= '%s 00:00:00' AND 
                %s <= '%s 23:59:59'  
                %s
        """

    def company(self, column, company):

        if int(company) != 0:
            companyId = "AND %s = %s" % (column, company)
        else:
            companyId = " "

        return companyId

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
                
            tableHead = [
                "装修单号", "楼盘", "楼号", "建筑面积", "计价面积", "设计分区", "设计部", "设计师工号", "设计师", "监理工号", 
                "监理", "类型", "业务类型", "付款类型", "付款状态", "总价", "创建时间", "公司"
            ]
            
            field = "ar.createTime"
            joint = ""
            colum = ""
            
            if type == "0":
                field = "ar.createTime"
            elif type == "1":
                field = "ar.sendTime"
            elif type == '2':
                colum = "dr.collectTime,"
                joint = "LEFT JOIN payment.decorationpayment dp ON ar.dpid = dp.dpid LEFT JOIN payment.decorationreceipt dr ON dp.drid = dr.drid"
                field = "dr.collectTime"
                tableHead = tableHead + ["收款时间", ]
                
            tableHead = tableHead + ["推送时间", "确认时间", ]

            sqlcount = self.SQL_QUERY_HANDLE % ("count(*)", joint, field, startTime, field, endTime, self.company("d.company", company))

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

            plan = {
                "plan.schedule": schedule,
                "plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, plan)

            workbook, sheet = self.createWorkbook("增减项确认信息")

            sql = self.SQL_QUERY_HANDLE % (self.column % (colum), joint, field, startTime, field, endTime, self.company("d.company", company))

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:

                data = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(data):
                
                    rows = list(v)
                    
                    self.divNum(rows, [3, 4, 15])
                    
                    self.createTableHead(sheet, rows, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                plan = {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                }
                self.updataSchedule(self.pthost, pid, plan)
            
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
        增减项确认信息脚本说明:
            根据查询条件,以分页形式导出销售业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/8/01-2022/8/31
            3.company     公司:1
        2.命令使用 plan_export_sales_quotation_addreduce.py  pid args company
                   plan_export_sales_quotation_addreduce.py  4209 2023/03/01-2023/03/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # type = 0
    # pid = 4304
    # args = "2023/05/01-2023/05/31"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args, company)
