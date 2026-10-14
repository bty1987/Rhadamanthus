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
            d.orderId AS `装修单号`,
            v.name AS `楼盘`,
            h.housenumber AS `楼号`,
            h.buildArea AS `建筑面积`,
            h.innerArea AS `计价面积`,
            dr.name AS `设计分区`,
            dd.name AS `设计部`,
            du.currentname AS `设计师`,
            pp.name AS `预签产品`,
            p.quoteArea AS `计价面积`,
            p.quotePrice AS `起报价`,
            p.preferPrice AS `优惠金额`,
            p.managePrice AS `管理费`,
            p.accdPrice + p.accmPrice AS `赋能总额`,
            p.basicPrice AS `功能区总额`,
            p.adddPrice + p.addmPrice AS `个性化总额`,
            p.subdPrice + p.submPrice AS `减项总额`,
            p.totalPrice AS `总额`,
            p.discount AS `折扣`,
            d.thingCut AS `物品优惠`,
            d.couponCut AS `券优惠`,
            d.thingCut + d.couponCut AS `优惠总额`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`
        """

        self.SELECT_SQL = """
            select 
                %s
            from 
                decoration.decoration d,
                quotation.protation p,
                quotation.presignproduce pp,
                communion.village v,
                communion.house h,
                communion.department dr,
                communion.department dd,
                communion.user du
            where 
                d.precontractTime > '%s 00:00:00'  
                AND d.precontractTime < '%s 23:59:59'  
                AND d.company = %s 
                AND d.orderId = p.orderId
                AND p.defaults = 1 
                AND p.ppid = pp.ppid 
                AND d.hid = h.hid 
                AND h.vid = v.vid 
                AND d.dsuid = du.uid 
                AND du.deptId = dd.did 
                AND dd.fdid = dr.did
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
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime, company)

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook("整装预签信息")

            tableHead = [
                "装修单号", "楼盘", "楼号", "建筑面积", "计价面积", "设计分区", "设计部", "设计师", "预签产品", "计价面积", 
                "起报价", "优惠金额", "管理费", "赋能总额", "功能区总额", "个性化总额" ,"减项总额", "总额", "折扣", "物品优惠", 
                "券优惠", "优惠总额", "装修状态"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    row = list(v)

                    self.divNum(row, [3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])

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
        导出整装预签信息脚本说明:
            根据查询条件,以分页拿数据的方式导出整装预签信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_quotation_protation.py  pid args
            plan_export_quotation_protation.py  299 2018/11/01-2018/11/30

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/03/01-2023/03/31'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))