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
            v. NAME AS '楼盘',
            h.housenumber AS '楼号',
            d.grade AS '装修单等级',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '装修单类型',
            d.contractTime as '签单时间',
            communion.kv('decoration', 'decoration', 'status', d.status) as '装修单状态',
            dco.name as '装修公司',
            pco.name as '款项公司',
            su.userId as '设计师工号',
            su.currentname as '设计师',
            communion.kv('personel', 'user', 'status', su.status) as '人员状态',
            sr. NAME AS '渠道分区',
            sd. NAME AS '渠道部门',
            dr. NAME AS '签单分区',
            dd. NAME AS '签单部门',
            IF (sp.type in (2, 3, 8), sr.cash + sr.bank + sr.checkv, - (sr.cash + sr.bank + sr.checkv)) AS '款项金额',
            IF (sp.type in (2, 3, 8), sr.cash + sr.bank + sr.checkv - sr.coupon, - (sr.cash + sr.bank + sr.checkv - sr.coupon)) AS '净业绩',
            sr.coupon AS '券',
            s.couponinfo AS '券信息',
            sr.collecttime AS '收款时间'
        """
        
        self.columny = u"""
            d.orderId AS '装修单号',
            v. NAME AS '楼盘',
            h.housenumber AS '楼号',
            d.grade AS '装修单等级',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) as '装修单类型',
            d.contractTime as '签单时间',
            communion.kv('decoration', 'decoration', 'status', d.status) as '装修单状态',
            dco.name as '装修公司',
            pco.name as '款项公司',
            su.userId as '设计师工号',
            su.currentname as '设计师',
            communion.kv('personel', 'user', 'status', su.status) as '人员状态',
            sr. NAME AS '渠道分区',
            sd. NAME AS '渠道部门',
            dr. NAME AS '签单分区',
            dd. NAME AS '签单部门',
            ap.recharge AS '款项金额',
            ap.recharge AS '净业绩',
            0 AS '券',
            '' AS '券信息',
            ar.collecttime AS '收款时间'
        """

        self.self.SQL_QUERY_SALESPAYMENT = u"""
            SELECT
                %s
            FROM
                payment.salespayment sp,
                payment.salesreceipt sr,
                sales.sales s,
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.house h,
                communion.village v,
                communion.user su,
                communion.department sd,
                communion.department sr,
                communion. USER du,
                communion.department dd,
                communion.department dr,
                communion.company dco,
                communion.company pco
            WHERE
                sp. STATUS IN (1, 2)
                AND sp.srid = sr.srid
                AND sp.sid = s.sid
                AND s.orderId = d.orderId
                AND d.orderId = db.orderId
                AND db. STATUS = 0
                AND db.type = 0
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND s.suid = su.uid
                AND su.deptid = sd.did
                AND sd.fdid = sr.did
                AND db.buid = du.uid
                AND db.did = dd.did
                AND db.rid = dr.did
                AND sp.company = pco.cid
                AND d.company = dco.cid
                AND sr.collectTime >= '%s 00:00:00'
                AND sr.collectTime <= '%s 23:59:59'
                AND sp.company = %s
            GROUP BY 
                sr.srid
            """

        self.self.SQL_QUERY_ADVANCEPAYMENT = u"""
            SELECT
                %s
            FROM
                payment.payment ap,
                payment.advancereceipt ar,
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.house h,
                communion.village v,
                communion. USER su,
                communion.department sd,
                communion.department sr,
                communion. USER du,
                communion.department dd,
                communion.department dr,
                communion.company dco,
                communion.company pco
            WHERE
                ar.collectTime >= '%s 00:00:00'
                AND ar.collectTime <= '%s 00:00:00'
                AND d.company = %s
                AND ap. STATUS IN (1, 2)
                AND ap.arid = ar.arid
                AND ap.orderId = d.orderId
                AND d.orderId = db.orderId
                AND db. STATUS = 0
                AND db.type = 0
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND d.svuid = su.uid
                AND su.deptid = sd.did
                AND sd.fdid = sr.did
                AND db.buid = du.uid
                AND db.did = dd.did
                AND db.rid = dr.did
                AND d.company = pco.cid
                AND d.company = dco.cid
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def main(self, pid, args, company):
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

            sqlcount = self.self.SQL_QUERY_SALESPAYMENT % ("count(*)", startTime, endTime, company)
            count = self.count(sqlcount)
            
            sqlcounty = self.self.SQL_QUERY_ADVANCEPAYMENT % ("count(*)", startTime, endTime, company)
            county = self.count(sqlcounty)
            
            if count + county == 0:
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

            workbook, sheet = self.createWorkbook(u"销售业绩")

            sql = self.self.SQL_QUERY_SALESPAYMENT % (self.column, startTime, endTime, company)
            sqly = self.self.SQL_QUERY_ADVANCEPAYMENT % (self.columny, startTime, endTime, company)
            
            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"装修单等级", u"装修单类型", u"签单时间", u"装修单状态", u"装修公司",
                u"款项公司", u"设计师工号", u"设计师", u"人员状态", u"渠道分区", u"渠道部门", u"签单分区", u"签单部门",
                u"款项金额", u"净业绩", u"券", u"券信息", u"收款时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True
            
            while pageflag:

                data = self.page(sql, nowPage, self.size)
                datay = self.page(sqly, nowPage, self.size)
                datac = data + datay
                for i, v in enumerate(datac):

                    rows = list(v)
                    self.divNum(rows, [16, 17, 18])
                    self.createTableHead(sheet, rows, count)
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
        销售业绩脚本说明:
            根据查询条件,以分页形式导出销售业绩;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/8/01-2022/8/31
            3.company     公司:1
        2.命令使用 plan_export_payment_sales_achievement.py  pid args company
                    plan_export_payment_sales_achievement.py  3866 2022/8/01-2022/8/31 1

        """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 3936
    # args = "2022/07/01-2022/07/31"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)