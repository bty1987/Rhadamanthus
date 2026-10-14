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
            d.orderId AS '装修单号',
            h.houseNumber AS '楼号',
            v.`name` AS '楼盘',
            dp.referMoney AS '款项金额',
            ar.type AS '增减类型',
            IF (ari.subtype = 1,sum(ari.num * ari.unitprice)/1000,0) AS '工程折前总价',
            IF(subtype != 1 and subtype != 0, sum(ari.num * ari.unitprice)/1000, 0) AS '主材折前总价',
            ar.total AS '总额',
            ar.managePrice AS '管理费',
            ar.taxPrice AS '税金',
            ar.createTime AS '创建时间',
            dr.collectTime AS '收款时间',
            ar.sendTime AS '推送时间',
            ar.affirmTime AS '确认时间',
            communion.kv('quotation', 'addreduce', 'status', ar.status) AS '状态',
            c.`name` AS '公司'
        """

        self.EXPORT_QUOTATION_ADDREDUCE = u"""
            SELECT
                %s
            FROM
                quotation.addreduce ar
                LEFT JOIN payment.decorationpayment dp ON ar.dpid = dp.dpid
                LEFT JOIN payment.decorationreceipt dr ON dp.drid = dr.drid
                LEFT JOIN quotation.addreduceitem ari ON ar.arid = ari.arid
                LEFT JOIN decoration.decoration d ON dp.orderId = d.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.company c ON dp.company = c.cid
            WHERE
                %s >= '%s 00:00:00' AND %s <= '%s 23:59:59'
                %s
            GROUP BY
                ar.arid
        """

    # 公司条件识别
    def company(self, cloumCompany, company):
    
        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "
            
        return companyId

    def main(self, type, pid, args, company):

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
                
            field = 'dr.collectTime'
                
            if type == '1':
                field = 'ar.sendTime'
                
            sqlcount = self.EXPORT_QUOTATION_ADDREDUCE % ("count(*)", field, startTime, field, endTime, self.company("dp.company", company))
            
            count = self.count(sqlcount)

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

            plan = {
                u"plan.schedule": schedule,
                u"plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, plan)

            params = self.createWorkbook(u"报价增减工程信息")
            workbook = params[0]
            sheet = params[1]

            tableHead = [u"装修单号", u"楼号", u"楼盘", u"款项金额", u"增减类型", u"工程折前总价", u"主材折前总价", u"总价", u"管理费", u"税金", 
                         u"创建时间", u"收款时间", u"推送时间", u"确认时间", u"状态", u"公司"]

            self.createTableHead(sheet, tableHead)

            path = tempfile.gettempdir() + u"/quotation.xls"
            self.saveWorkbook(path, workbook)

            sql = self.EXPORT_QUOTATION_ADDREDUCE % (self.column, field, startTime, field, endTime, self.company("dp.company", company))

            nowPage = 1
            length = 1
            flag = True

            while flag:

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)
                    self.divNum(data, [3, 5, 6, 7, 8, 9])
                    data[4] = self.addReduceType[data[4]]

                    self.createTableHead(sheet, data, length)

                    length = length + 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                plan = {
                    u"plan.schedule": int(schedules)
                }

                self.updataSchedule(self.pthost, pid, plan)

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

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
      报价增减工程信息统计脚本说明:
          根据查询条件,以分页形式导出报价增减工程信息统计信息;并上传到文件服务器中,可从任务页面上点击下载即可;
          当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
      1.传入必须参数说明
          1.pid         information.plan的主键;
          2.args        2020/08/01-2020/08/30
          3.company     公司:1
      2.命令使用 plan_export_quotation_addreduce.py  pid args company
                plan_export_quotation_addreduce.py  299 2020/08/01-2020/08/30 1

      """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
