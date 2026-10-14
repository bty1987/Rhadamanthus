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

        self.column = u"""
            d.orderId,
            v.name,
            h.houseNumber,
            dr.no,
            dr.name,
            dd.no,
            dd.name,
            du.userId,
            du.currentName,
            h.buildArea,
            d.factPrice,
            IF ( d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, d.orderTotalPrice * d.notSalesmanRate, d.notSalesmanRate) AS notSalesmanRate
        """

        self.SQL_QUERY_DECORATION = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid 
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
            WHERE
                d.contractTime >= '%s 00:00:00' AND 
                d.contractTime <= '%s 23:59:59' AND 
                d.company = %s
        """
        
        self.SQL_QUERY_QUOTATION_FUNCTION_AREA_ITEM = """
            SELECT 
                q.qid, 
                qfa.qfaid, 
                qfai.qfaiid, 
                qfai.num, 
                qfai.unitprice 
            FROM 
                quotation.quotation q 
                left join quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId 
                left join quotation.quotationfunctionareaitem%s qfai ON qfa.qfaid = qfai.quotationFunctionAreaId
            WHERE 
                q.orderId = '%s' AND 
                q.defaults = 1 AND 
                qfai.subtype = %s;
        """
        
        self.SQL_QUERY_EXTENSION_ITEM = """
            SELECT 
                e.eid, 
                e.type, 
                ei.type, 
                ei.quoteItemId, 
                ei.num, 
                ei.unitPrice 
            FROM 
                quotation.extension e 
                left join quotation.extensionitem ei ON e.eid = ei.eid 
            WHERE 
                e.orderId = '%s' AND 
                ei.subtype = %s;
        """

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

            sqlcount = self.SQL_QUERY_DECORATION % ("count(*)" , startTime, endTime, company)

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
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            workbook, sheet = self.createWorkbook(u"装修时间信息")

            sql = self.SQL_QUERY_DECORATION % (self.column, startTime, endTime, company)
            
            tableHead = [
                "装修单号", "楼盘", "楼号", "设计分区", "分区标号", "设计部", "部门编号", "设计师", "设计师工号", "面积",
                "套餐工程成本", "扩展项工程成本", "主材项目成本", "实收额", "非业务提点", "签单毛利润", "签单毛利率"
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

                    quoteIds = []
                    extension_decoration_total = 0
                    extension_material_total = 0
                    quotation_material_total = 0

                    self.cursor.execute(self.SQL_QUERY_EXTENSION_ITEM % (orderId, 1))
                    eitems = self.cursor.fetchall()

                    for eitem in eitems:
                        extension_decoration_total += eitem[1] == 0 and (eitem[4] * eitem[5] / 1000) or (eitem[4] * eitem[5] * -1 / 1000)

                    self.cursor.execute(self.SQL_QUERY_EXTENSION_ITEM % (orderId, 2))
                    eitems = self.cursor.fetchall()

                    for eitem in eitems:
                        extension_material_total += eitem[1] == 0 and (eitem[4] * eitem[5] / 1000) or (eitem[4] * eitem[5] * -1 / 1000)
                        if eitem[2] == 5: quoteIds.append(eitem[3])

                    for quoindex in [0, 1, 2]:
                        self.cursor.execute(self.SQL_QUERY_QUOTATION_FUNCTION_AREA_ITEM % (quoindex, orderId, 2))
                        qitems = self.cursor.fetchall()

                        for qitem in qitems:
                            if not qitem[2] in quoteIds: quotation_material_total += qitem[3] * qitem[4] / 1000

                    infos = rows[:10]

                    infos.append(rows[9] * 479)  # 报价工程
                    infos.append(quotation_material_total)  # 报价主材
                    infos.append(extension_decoration_total)  # 扩展工程
                    infos.append(extension_material_total)  # 扩展主材
                    infos.append(rows[10]) # 实收
                    infos.append(rows[11]) # 非提
                    infos.append(rows[10] - infos[10] - infos[11] - infos[12] - infos[13] - rows[11])
                    infos.append(infos[16] / rows[10])

                    self.divNum(infos, [9, 10, 11, 12, 13, 14, 15, 16])

                    self.createTableHead(sheet, infos, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    pageflag = False

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
        导出装修利润率信息说明:
            根据查询条件,以分页形式导出装修图纸信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2023/9/01-2023/9/30
            3.company     公司:1
        2.命令使用 
            plan_export_decoration_profit_rate.py  pid args company
            plan_export_decoration_profit_rate.py  4572 2023/9/01-2023/9/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)
