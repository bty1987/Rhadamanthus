#!/usr/bin/python
# -*- coding:UTF-8 -*-

import pyaes
import base64

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
        self.size = 200
        
        self.key = "844dd1be967b6e9e"
        self.iv = "cdb421d038104126"

        self.colum = u"""
            r.orderId AS `装修单号`,
            ct.province AS `省份`,
            ct.`name` AS `城市`,
            ctp.`name` AS `城区`,
            v.name AS `楼盘`,
            h.houseNumber AS `楼号`,
            c.name AS `客户名`,
            c.phone AS `客户电话`,
            c.identity AS `身份证号`,
            communion.kv('payment', 'receipt', 'paymentType', r.paymentType) AS `款项类型`,
            r.paymentName AS `款项名称`,
            r.name AS `收据名称`,
            communion.kv('data', 'receiptType', 'fund', rt.fund) AS `资金类型`,
            communion.kv('payment', 'servicePayment', 'type', r.type) AS `操作类型`,
            r.collectTime AS `收款时间`,
            r.money AS `金额`,
            communion.kv('customer', 'customer', 'customerType', c.type) AS `客户类型`,
            c.companyBankno AS `银行卡号`,
            c.companyNo AS `公司编号`
        """

        self.SQL_EXPORT_RECEIPT = u"""
            SELECT 
                %s
            FROM
                 payment.receipt AS r LEFT JOIN data.receipttype AS rt ON r.rtid = rt.rtid,
                 decoration.decoration AS d,
                 communion.house AS h,
                 communion.village AS v,
                 communion.cityproper AS ctp,
                 communion.city AS ct,
                 communion.customer AS c
            WHERE
                 r.orderId = d.orderId
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND v.cityProperId = ctp.cpid
                AND ctp.cid = ct.cid
                AND d.customerId = c.cid
                AND r.paymentType IN (1, 4)
                AND r.collectTime >= '%s 00:00:00'
                AND r.collectTime <= '%s 23:59:59'
                AND r.company = %s
        """
        
    def pad(self, data):
        padding_len = 16 - (len(data) % 16)
        return data + bytes([padding_len] * padding_len)
    
    def unpad(self, data):
        padding_len = data[-1]
        return data[:-padding_len]
    
    def decrypt(self, encrypted_base64, key, iv):
        key_bytes = key.encode('utf-8')
        iv_bytes = iv.encode('utf-8')
        encrypted_bytes = base64.b64decode(encrypted_base64)
    
        aes = pyaes.AESModeOfOperationCBC(key_bytes, iv=iv_bytes)
        decrypted = aes.decrypt(encrypted_bytes)
        return self.unpad(decrypted).decode('utf-8')

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

            sqlcount = self.SQL_EXPORT_RECEIPT % (u"count(*)", startTime, endTime, company)

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

            sql = self.SQL_EXPORT_RECEIPT % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook(u"发票数据")

            tableHead = [
                u"装修单号", u"省份", u"城市", u"城区", u"楼盘", u"楼号", u"客户名", u"客户电话", u"身份证号", u"款项类型",
                u"款项名称", u"收据名称", u"资金类型", u"操作类型", u"收款时间", u"金额", u"客户类型", u"银行卡号", u"公司编号"
            ]

            self.createTableHead(sheet, tableHead)

            counts = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)
                    
                    data[7] = self.decrypt(data[7], self.key, self.iv)

                    self.createTableHead(sheet, data, counts)
                    counts += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

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
        导出发票数据脚本说明:
            根据查询条件,以时间为条件查询数据导出收据;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.命令使用 python plan_export_payment_invoice.py pid args company
               python plan_export_payment_invoice.py 911 2018/10/01-2018/12/13 1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
