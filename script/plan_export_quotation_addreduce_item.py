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

        self.colum = """
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            d.houseClass AS '房屋类型',
            dr.name AS '设计分区',
            dd.name AS '设计部',
            du.currentname AS '设计师',
            sv.currentname AS '监理',
            d.factPrice AS '实收额',
            p.product AS '预签产品',
            a.content AS '增减单',
            qfa.functionAreaName AS '功能区',
            ai.itemName AS '项目名',
            ai.workType AS '工种',
            ai.measurementUnit AS '单位',
            communion.kv('quotation', 'addreduce', 'type', a.type) AS '类型',
            communion.kv('quotation', 'addreduce', 'atttype', a.atttype),
            communion.kv('quotation', 'addreduce', 'paytype', a.paytype),
            communion.kv('quotation', 'addreduceitem', 'type', ai.type) AS '类型',
            communion.kv('quotation', 'addreduceitem', 'subtype', ai.subtype) AS '类型',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS '类型',
            ai.num AS '数量',
            ai.unitPrice AS '折前单价',
            ai.num*ai.unitPrice/1000 AS '折前金额',
            d.contractTime AS '签单时间',
            co.name AS `公司`
        """

        self.SELECT_SQL = """
            SELECT
                %s
            FROM
                decoration.decoration d 
                LEFT JOIN quotation.protation p ON (d.orderId = p.orderId and p.defaults = 1)
                LEFT JOIN communion.user sv ON d.svuid = sv.uid,
                quotation.addreduce a
                LEFT JOIN payment.decorationpayment dp ON a.dpid = dp.dpid
                LEFT JOIN payment.decorationreceipt dr ON dp.drid = dr.drid,
                quotation.addreduceitem ai, 
                quotation.quotationfunctionarea qfa,
                communion.house h,
                communion.village v,
                communion.department dr,
                communion.department dd,
                communion.user du,
                communion.company co
            WHERE
                %s > '%s 00:00:00' 
                AND %s < '%s 23:59:59' 
                AND d.orderId = a.orderId 
                AND a.status in (2, 3)
                AND a.arid = ai.arid 
                AND ai.quotationfunctionareaid = qfa.qfaid
                AND d.hid = h.hid 
                AND h.vid = v.vid 
                AND d.dsuid = du.uid 
                AND du.deptid = dd.did 
                AND dd.fdid = dr.did 
                AND d.company = co.cid 
                %s 
        """

    def company(self, columnCompany, company):
        if company != 0:
            companyString = u" AND %s = %s " % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

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

            timeColumn = "d.contractTime"
            if type == "0":
                timeColumn = "d.contractTime"
            elif type == "1":
                timeColumn = "d.accountTime"
            elif type == "2":
                timeColumn = "a.sendTime"
            elif type == "3":
                timeColumn = "a.createTime"
            elif type == "4":
                timeColumn = "dr.collectTime"
            elif type == "5":
                timeColumn = "d.balanceTime"

            sqlcount = self.SELECT_SQL % ("count(*)", timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

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

            sql = self.SELECT_SQL % (self.colum, timeColumn, startTime, timeColumn, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook("拓展项信息")

            tableHead = [
                "装修单号", "楼盘", "楼号", "房屋类型", "设计分区", "设计部", "设计师", "监理", "实收额", "预签产品",
                "增减单", "功能区", "项目名", "工种", "单位", "类型", "业务类型", "付款类型", "类型", 
                "类型", "订单类型", "数量", "折前单价", "折前金额", "签单时间", "公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    row = list(v)

                    self.divNum(row, [8, 21, 22, 23])

                    self.createTableHead(sheet, row, count)
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
        导出增减项信息脚本说明:
            根据查询条件,以分页拿数据的方式导出增减项信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_addreduce_item.py  pid args company
            plan_export_addreduce_item.py  299 2018/11/01-2018/11/30 1
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