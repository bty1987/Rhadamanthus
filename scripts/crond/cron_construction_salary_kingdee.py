#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import time
import json
import datetime
import requests
import sys
import os

from cron_kingdee_util import kingdeeUtil

class funds_ranking(kingdeeUtil):
    
    def __init__(self, dbconf, khost, kloginconf, urlconf, media, pthost, authentication):
        
        self.dbconn = None
        self.cursor = None
        self.kingdeeCookies = None

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = 'utf8'
        self.media = media
        self.pthost = pthost
        self.authentication = authentication

        self.kloginconf = kloginconf
        self.login = "%s%s" % (khost, urlconf.get("Login"))
        self.save = "%s%s" % (khost, urlconf.get("Save"))
        self.batchSave = "%s%s" % (khost, urlconf.get("BatchSave"))
        self.view = "%s%s" % (khost, urlconf.get("View"))

        self.flag = True
        self.size = 300
        self.kingdeeSize = 50

        self.purposes = None
        self.collectReceiptType = None
        self.otherReceiptType = None

        self.logFile = "construction_salary_kingdee"
        self.tableHead = [u"装修单号", u"工费类型", u"工人工费ID", u"错误信息"]
        self.fieldNo = [1, 7, 15]
        self.fieldName = ["orderId", "twotype", "wsid"]

        self.SALARY_COLUMN = u"""
            ws.approveTime AS '审批时间',
            d.orderId AS '装修单号',
            u.userId AS '监理编号',
            u.userName AS '监理姓名',
            wu.userId AS '工人工号',
            wu.userName AS '工人姓名',
            cn.`kino` AS '施工节点',
            ws.twotype AS '工费类型',
            d.company AS '装修公司',
            o.`no` AS '装修公司装修编号',
            d.conpany AS '工程公司',
            cso.`no` AS '工程公司销售编号',
            d.grade AS '等级',
            ws.salary AS '工费',
            CONCAT(v.NAME, ' ', h.houseNumber) AS `客户地址`,
            ws.wsid AS '工人工费ID',
            dcp.`no` AS '装修公司编号',
            ccp.name AS '工程公司名称'
        """

        self.SQL_SALARY = u"""
            SELECT
                %s
            FROM
                salary.workersalary ws,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                construction.construction c,
                communion.`user` u,
                communion.`user` wu,
                `data`.constructionnode cn,
                communion.company dcp,
                communion.organization o,
                communion.company ccp,
                communion.organization cso
            WHERE
                ws.orderId = d.orderId AND
                d.hid = h.hid AND 
                h.vid = v.vid AND 
                ws.cid = c.cid AND
                c.suid = u.uid AND
                ws.wuid = wu.uid AND
                ws.cnid = cn.cnid AND
                d.company = dcp.cid AND
                dcp.doid = o.oid AND
                d.conpany = ccp.cid AND
                ccp.soid = cso.oid AND
                ws.`status` = 1 AND
                ws.salary > 0 AND
                ws.approveTime >= '%s 00:00:00' AND 
                ws.approveTime <= '%s 23:59:59'
                %s
        """

    def company(self, company):

        if company != 0:
            companyId = u"AND ws.company = %s" % company
        else:
            companyId = u" "

        return companyId

    def main(self, startTime, endTime, company):

        falgs = self.controlTime(startTime, endTime)

        if falgs == False:
            return

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.SQL_SALARY % (self.SALARY_COLUMN, startTime, endTime, self.company(company))

        nowPage = 1
        flag = True

        payableBillBatchs = [] # 应付单批量
        payableBillBatch = ["AP_Payable", {"IsAutoSubmitAndAudit": "False", "Model": []}]

        # 金蝶登录
        self.kingdeeCookies = self.kingdeeLogin(self)
        if not self.kingdeeCookies:
            return

        while (flag):

            rows = self.page(sql, nowPage, self.size)

            for i, v in enumerate(rows):

                data = list(v)
                # 处理数值
                self.divNum(data, [13])

                # 业务日期/结算组织/币别/单据类型/到期日/供应商/业务类型/付款组织/客户/监理/工人/施工节点/工费类型/劳务公司/签单公司/核算类别/单据体明细
                payableBill = '{"FDATE": "%s", "FSETTLEORGID": {"FNumber": "200"}, "FCURRENCYID": {"FNumber": "PRE001"}, "FBillTypeID": {"FNumber": "YFD02_SYS"}, "FENDDATE_H": "%s", "FSUPPLIERID": {"FNumber": "%s"}, "FBUSINESSTYPE": "FY", "FPAYORGID": {"FNumber": "%s"}, "F_ora_Base": {"FNumber": "%s"}, "F_SFKD_Base": {"FNumber": "%s"}, "F_SFKD_Base1": {"FNumber": "%s"}, "F_SFKD_Base2": {"FNumber": "%s"}, "F_SFKD_Assistant": {"FNumber": "%s"}, "F_SFKD_Assistant1": {"FNumber": "%s"}, "F_SFKD_Assistant2": {"FNumber": "%s"}, "F_SFKD_Base7": {"FNumber": "%s"}}'  # 应付单

                payableBillItems = []  # 应付单单据体

                # 项目费用编码/计价单位/单价/计价数量/含税单价/税率/不含税金额/税额/价税合计
                payableBillItem = '{"FCOSTID": {"FNumber": "CI002"}, "FPRICEUNITID":{"FNumber": "UOM001"}, "Fprice":"%s", "FPriceQty":"1", "FTaxPrice": "%s", "FEntryTaxRate": "0.00", "FNoTaxAmountFor_D": "%s", "FTAXAMOUNTFOR_D": "0.00", "FALLAMOUNTFOR_D": "%s"}'

                payableBillItems.append(json.loads(payableBillItem % (data[13], data[13], data[13], data[13])))

                if (data[12] == "A" or data[12] == "C") and data[17] == "中迈劳务" :
                    payOrg = data[9]
                    supplier = "000030"
                else :
                    payOrg = "200"
                    supplier = "200"

                # 业务日期/到期日/供应商/付款组织/客户/监理/工人/施工节点/工费类型/劳务公司/签单公司/核算类别
                payableBill = json.loads(payableBill % (data[0], data[0], supplier, payOrg, data[1], data[2], data[4], data[6], data[7], data[11], data[16], data[12]))
                payableBill["FEntityDetail"] = payableBillItems

                payableBillBatch[1]["Model"].append(payableBill)

                if len(payableBillBatch[1]["Model"]) >= self.kingdeeSize:

                    payableBillBatchs.append(payableBillBatch)
                    payableBillBatch = ["AP_Payable", {"IsAutoSubmitAndAudit": "False", "Model": []}]

            nowPage = nowPage + 1

            if len(rows) < self.size:
                flag = False

        payableBillBatchs.append(payableBillBatch)

        # 将信息存入到金蝶
        for i, payableBillBatch in enumerate(payableBillBatchs):

            if len(payableBillBatch[1]["Model"]) == 0: continue

            payableBillData = {"parameters": str(payableBillBatch)}
            requests.post(url=self.batchSave, data=payableBillData, cookies=self.kingdeeCookies)

if __name__ == '__main__':
    """
            工费进入金蝶脚本说明:
            应付单：费用应付单
            供应商：装修单等级AC && 工程公司=中迈劳务 ==》中迈劳务
                    其他情况 ==》智林慧达
            结算组织：安徽智林
            付款组织：装修单等级AC && 工程公司=中迈劳务 ==》装修单公司的装修组织
                      其他情况 ==》智林慧达

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding='UTF-8'))
    dbconf = config.get("database")
    khost = config.get("khost")
    kloginconf = config.get("kingdeeData")
    urlconf = config.get("kingdeeUrl")

    pid = 0
    args = sys.argv[2]
    company = sys.argv[3]

    if args == "auto":
        nowTime = datetime.datetime.now()
        strNowTime = nowTime.strftime("%Y-%m-%d %H:%M:%S")

        startTime = str(datetime.datetime.now() - datetime.timedelta(days=1))[0:10]
        endTime = startTime
    else:
        spargs = args.split("-")
        startTime = spargs[0]
        endTime = spargs[1]
        pid = sys.argv[1]

    funds_ranking = funds_ranking(dbconf, khost, kloginconf, urlconf, config.get("media"), config.get("pthost"), config.get("authentication"))
    funds_ranking.main(startTime, endTime, int(company))

    if pid != 0: funds_ranking.updataSchedule(config.get("pthost"), pid, {u"plan.schedule": 100, u"plan.status": 2})
