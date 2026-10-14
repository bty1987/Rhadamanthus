#!/usr/bin/python
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
        self.list = []
        self.size = 400

        self.colum = u"""
            ms.orderId AS '订单编号',
            ms.no AS '主材编号',
            communion.kv('decoration', 'decoration', 'typeness', de.typeness) AS '订单类型',
            de.contractTime AS '签单时间',
            CONCAT(cv.name, " ", h.houseNumber) AS `楼盘地址`,
            cc.name AS '客户',
            designer.userId AS '装修顾问ID',
            designer.currentName AS '装修顾问',
            dept.name AS '部门',
            region.name AS '分区',
            ms.category AS '品类',
            ms.brand AS '品牌',
            ms.depositPayment AS '定金',
            ms.total AS '主材订单总价',
            ms.coupon AS '主材券值',
            ms.couponInfo AS '主材券',
            mr.mrid AS 'MRID',
            mr.cash AS '现金',
            mr.bank AS '刷卡',
            mr.bankInfo AS '刷卡信息',
            mr.checkv AS '转账',
            mr.checkvBank AS '转账银行',
            mr.installment AS '分期',
            mr.installmentBank AS '分期银行',
            mr.accounts AS '对公',
            mr.accountsBank AS '对公银行',
            mr.coupon AS '收款券值',
            mr.couponInfo AS '收款券',
            mr.advance AS '预付款',
            communion.kv('payment', 'materialPayment', 'advanceType', mr.advanceType) AS '预付款类型',
            communion.kv('payment', 'materialPayment', 'paymentType', mp.paymentType) AS '收款类型',
            IF(mp.paymentType in (4, 5, 6, 7), -mp.referMoney, mp.referMoney) AS '收款金额',
            ct.currentName AS '创建人',
            mr.collecterName AS '收款人',
            mr.collectTime AS '收款时间',
            mr.confirmTime AS '确认时间',
            mr.comment AS '备注'
        """

        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM
                material.material AS ms,
                communion.house AS h,
                communion.village AS cv,
                communion.user AS designer,
                communion.user AS ct,
                communion.customer AS cc,
                payment.materialpayment AS mp,
                decoration.decoration AS de,
                payment.materialreceipt AS mr,
                communion.department AS dept,
                communion.department AS region
            WHERE
                ms.mid = mp.mid
                AND ms.orderId = de.orderId
                AND mp.mrId = mr.mrId
                AND ms.hid = h.hid
                AND h.vid = cv.vid
                AND mp.cuid = ct.uid
                AND ms.departmentId = dept.did
                AND ms.regionId = region.did
                AND ms.customerId = cc.cid
                AND de.dsuid = designer.uid
                AND mr.collectTime >= '%s'
                AND mr.collectTime <= '%s'
                %s
        """

    def company(self, cloumCompany, company):
        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "

        return companyId

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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, self.company("ms.company", company))

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

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sql = self.SQL_QUERY % (self.colum, startTime, endTime, self.company("ms.company", company))

            workbook, sheet = self.createWorkbook(u"主材收款")

            tableHead = [
                u"订单编号", u"主材编号", u"订单类型", u"签单时间", u"楼盘地址", u"客户", u"装修顾问ID", u"装修顾问", u"部门", u"分区",
                u"品类", u"品牌", u"定金", u"主材订单总价", u"主材劵值", u"主材劵", u"MRID", u"现金", u"刷卡", u"刷卡信息",
                u"转账", u"转账银行", u"分期", u"分期银行", u"对公", u"对公银行", u"收款劵值", u"收款劵", u"预付款", u"预付款类型",
                u"收款类型", u"收款金额", u"创建人", u"收款人", u"收款时间", u"确认时间", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    v = list(v)

                    self.divNum(v, [12, 13, 14, 17, 18, 20, 22, 24, 26, 28, 31])

                    self.createTableHead(sheet, v, count)
                    count += 1

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

                nowPage = nowPage + 1

                if len(data) < self.size:
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
        导出主材收款_外链统计脚本说明:
            根据查询条件,以分页拿数据的方式导出主材收款;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1. pid : information.plan的主键;
            2. args:startTime:开始时间, endTime:结束时间
            3. company: 0 代表总公司
            
        2.脚本传参说明:
             plan_export_material_payment.py         pid         args                company
             plan_export_material_payment.py         299  "2018/10/01-2018/10/31"      0
        
        3.注:1,结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
