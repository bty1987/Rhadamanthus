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

        self.column = """
            d.orderId AS `装修单号`,
            h.hid AS `房产ID`,
            v.name AS `楼盘`,
            c.name AS `客户名`,
            ddr.name AS `归属设计分区`,
            ddd.name AS `归属设计部`,
            dr.name AS `设计分区`,
            dd.name AS `设计部`,
            du.userid AS `设计师工号`,
            du.currentname AS `设计师`,
            sr.name AS `业务分区`,
            sd.name AS `业务部`,
            su.userid AS `业务员工号`,
            su.currentName AS `业务员`,
            eu.currentName AS `跟单员`,
            h.innerarea AS `面积`,
            d.createTime AS `创建时间`,
            d.measureTime AS `量尺时间`,
            da.meetTime AS `到店时间`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `订单类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `装修状态`,
            cn.name AS `工程状态`,
            bt.name as `业务类型`,
            co.name AS '公司',
            cc.annotate AS '批注',
            cc.comment AS '备注',
            if(acsa.aid != null, acsa.comment, acso.comment) AS '备注',
            if(acsa.aid != null, acsa.annotate, acso.annotate) AS '备注'
        """
        
        self.SQL_EXPORT_DECORATION_MEASUREINFO = """
            SELECT 
                %s
            FROM 
                decoration.decoration AS d
                LEFT JOIN decoration.decorationaddition AS da ON da.orderId = d.orderId
                LEFT JOIN communion.user AS eu ON d.euid = eu.uid
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.smuid = su.uid
                LEFT JOIN communion.department AS dd ON du.deptid = dd.did
                LEFT JOIN communion.department AS sd ON su.deptid = sd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN communion.department AS sr ON sd.fdid = sr.did
                LEFT JOIN communion.department AS ddd ON d.ddid = ddd.did
                LEFT JOIN communion.department AS ddr ON ddd.fdid = ddr.did
                LEFT JOIN communion.company AS co ON d.company = co.cid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN data.decorationbusitype AS bt ON d.busitype = bt.dbid
                LEFT JOIN data.constructionnode AS cn ON d.projectstatus = cn.cnid
                LEFT JOIN customer.customerchance AS cc ON cc.orderId = d.orderId
                LEFT JOIN customer.customersource AS cs ON cs.csid = cc.csid
                LEFT JOIN customer.customerorigin AS oc ON oc.orderId = d.orderId
                LEFT JOIN approval.approvalcustomersource AS acs ON cc.ccid = acs.ccid
                LEFT JOIN approval.approval AS acsa ON acs.aid = acsa.aid
                LEFT JOIN approval.approvalcustomerorigintdecoration AS aco ON oc.coid = aco.csid 
                LEFT JOIN approval.approval AS acso ON aco.aid = acso.aid
            WHERE
                d.createTime >= '%s 00:00:00' AND 
                d.createTime <= '%s 23:59:59' 
                %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def company(self, type, columnCompany, company):
    
        companyString = " "
    
        if company != 0:
            companyString = "AND %s = %s" % (columnCompany, company)

        if type == "1" or type == 1:
            companyString = " GROUP BY h.hid"

        return companyString

    def main(self, type, pid, args, company):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)
            
            self.constructionnode(company)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_EXPORT_DECORATION_MEASUREINFO % ("count(*)" ,startTime, endTime, self.company(type, "d.company", company))

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

            sql = self.SQL_EXPORT_DECORATION_MEASUREINFO % (self.column, startTime, endTime, self.company(type, "d.company", company))

            workbook, sheet = self.createWorkbook("shee1")

            tableHead = [
                "装修单号", "房产编号", "楼盘", "客户名", "归属设计分区", "归属设计部", "设计分区", "设计部", "设计师工号", "设计师", 
                "业务分区", "业务部", "业务员工号", "业务员", "跟单员", "面积", "创建时间", "量尺时间", "到店时间", "订单类型", 
                "装修状态", "工程状态", "业务类型", "公司", "批注", "备注", "备注", "备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(data):
                
                    row = list(v)
                    
                    row[1] = str(row[1]).zfill(11)
                    
                    self.divNum(row, [15])

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
        导出量尺信息脚本说明:
            根据查询条件,以分页形式导出装修竣工信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2018/11/01-2018/11/30
            3.company     公司:1
        2.命令使用 plan_export_decoration_order_measure.py  pid args company
                   plan_export_decoration_order_measure.py  299 2018/11/01-2018/11/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath,encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
    