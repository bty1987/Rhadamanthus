#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from openpyxl import Workbook

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

        self.colum = """
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            dr.name AS '设计分区',
            dd.name AS '设计部',
            du.currentname AS '设计师',
            sv.currentname AS '监理',
            qfa.functionAreaName AS '功能区',
            qfai.itemName AS '项目名',
            qfai.workType AS '工种',
            qfai.measurementUnit AS '单位',
            communion.kv('quotation', 'quotationFunctionAreaItem', 'type', qfai.type) AS '类型',
            communion.kv('quotation', 'quotationFunctionAreaItem', 'subtype', qfai.subtype) AS '类型',
            q.discount AS '折扣',
            qfai.initnum AS '数量',
            qfai.unitPrice AS '折前单价',
            qfai.initnum*qfai.unitPrice/1000 AS '折前金额',
            d.factPrice AS '实收额',
            p.product AS '预签产品'
        """

        self.SELECT_SQL = """
            SELECT
                %s
            FROM
                decoration.decoration d 
                LEFT JOIN quotation.protation p on (d.orderId = p.orderId and p.defaults = 1)
                LEFT JOIN communion.user sv ON d.svuid = sv.uid
                LEFT JOIN quotation.quotation q ON (d.orderId = q.orderId AND q.defaults = 1 )
                LEFT JOIN quotation.quotationfunctionarea qfa ON q.qid = qfa.quotationId 
                LEFT JOIN quotation.quotationfunctionareaitem%s qfai ON qfa.qfaid = qfai.quotationFunctionAreaId 
                LEFT JOIN communion.house h ON d.hid = h.hid 
                LEFT JOIN communion.village v ON h.vid = v.vid 
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did 
                LEFT JOIN communion.department dr ON dd.fdid = dr.did 
            WHERE
                d.%s > '%s 00:00:00' AND 
                d.%s < '%s 23:59:59' AND 
                qfai.qfaiid is not null 
                %s 
        """

    def company(self, column, company):

        if int(company) != 0:
            companyId = "AND %s = %s" % (column, company)
        else:
            companyId = " "

        return companyId

    def main(self, type, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            path = tempfile.gettempdir() + "/quotationFunctionAreaItem.xls"

            startTime, endTime = args.split("-")
            
            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间应在1-31内"
                })
                return False
            
            timeColumn = "contractTime"
            if type == "0":
                timeColumn = "contractTime"
            elif type == "1":
                timeColumn = "accountTime"

            my_list = ["0", "1", "2"]
            count = 0
            sqls = []

            for ele in my_list:

                sqlcount = self.SELECT_SQL % ("count(*)", ele, timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))
                counts = self.count(sqlcount);

                if counts != 0:
                    sqls.append( self.SELECT_SQL % (self.colum, ele, timeColumn, startTime, timeColumn, endTime, self.company("d.company", company)))

                count = count + counts

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
                "plan.schedule": schedule,
                "plan.status": 4
            })

            # 使用 openpyxl 创建 xlsx 格式工作簿, 支持超过 65535 行
            workbook = Workbook()
            sheet = workbook.active
            sheet.title = u"报价项信息"

            tableHead = [
                "装修单号", "楼盘", "楼号", "设计分区", "设计部", "设计师", "监理", "功能区", "项目名", "工种",
                "单位", "类型", "类型", "折扣", "数量", "折前单价", "折前金额", "实收额", "预签产品"
            ]

            sheet.append(tableHead)

            count = 1

            for sql in sqls:
            
                nowPage = 1
                flag = True

                while (flag):

                    data = self.page(sql, nowPage, self.size)

                    for i, v in enumerate(data):
                    
                        row = list(v)

                        self.divNum(row, [13, 14, 15, 16, 17])

                        row[6] = row[6] if row[6] else "暂无"
                        row[16] = row[16] if row[14] or row[7] != "生成项目" else row[15]

                        sheet.append(row)
                        count += 1

                    nowPage = nowPage + 1
                    if len(data) < self.size:
                        flag = False

                    molecular = molecular + len(data)
                    schedules = (molecular / all) * 100
                    self.updataSchedule(self.pthost, pid, {
                        "plan.schedule": int(schedules),
                        "plan.status": 4
                    })
                    
            resultfilepath = self.packXlsxFile(pid, workbook)

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
        导出报价项信息脚本说明:
            根据查询条件,以分页拿数据的方式导出报价项信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_quotation_function_area_item.py  pid args company
            plan_export_quotation_function_area_item.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # pid = 299
    # args = "2022/08/01-2022/08/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(type, pid, args, int(company))