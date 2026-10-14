from cron_kingdee_util import *

class bankCheckBill(kingdeeUtil):
    def __init__(self, dbconf, khost, kloginconf, urlconf, media, pthost, authentication):
        self.dbconn = None
        self.cursor = None
        self.kingdeeCookies = None
        self.ten = 10
        self.thousand = 1000

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

        self.bankCheckBillBatch = ["CN_BANKACNTSTATE", {"BatchCount": 10, "IsAutoSubmitAndAudit": "true", "Model": []}]  # 银行对账单批量

        # 起始日期/银行账号/结束日期/创建组织/单据体-FEntity
        self.bankCheckBill = """{"FBEGINDATE": "%s", "FBANKACNTID": {"FNumber": "%s"}, "FENDDATE": "%s", "FCreateOrgId": {"FNumber": "%s"}}"""

        # 业务日期/摘要/借方_收款金额/贷方_收款金额/结算号/对方银行账号/对方账号名称
        self.bankCheckBillItem = """{"FTRANSDATE":"%s", "FEXPLANATION":"%s", "FDEBITAMOUNT":"%s", "FCREDITAMOUNT":"%s", "FSETTLENO":"%s", "FOPPOSITEBANKACNTNO":"%s", "FOPPOSITECCOUNTNAME":"%s" }"""

        self.SQL_ORGANIZATION = u"""
            SELECT
                o.`no`,
                rt.bankno
            FROM
                payment.paytran pt,
                communion.custype ct,
                `data`.receipttype rt,
                communion.company cp,
                communion.organization o
            WHERE
                pt.ctid = ct.ctid
            AND ct.rtid = rt.rtid
            AND ct.company = cp.cid
            AND IF(pt.atttype=0,cp.doid=o.oid,cp.soid=o.oid) 
            AND	pt.outOrderNo = '%s'
        """

        self.SQL_STATEMENT = u"""
            INSERT INTO payment.statement(
                custNo,
                orderNo,
                price,
                fee,
                rate,
                payTime,
                type,
                status
            )
            VALUES
                %s
        """

    def getParams(self, data):
        if isinstance(data, dict):
            keys = data.keys()

            for key in keys:
                self.iterParam(data[key])

        elif isinstance(data, list):

            bankCheckBillItems = []
            lastAmount = 0

            for j in range(len(data)):
                line = data[j]

                busDate = datetime.datetime.strptime(line["JY_TIME"], '%Y%m%d%H%M%S')
                settleDate = busDate.strftime('%Y-%m-%d %H:%M:%S')

                money = float(line["JY_OLD_TXAMT"]) / 100

                # 业务日期/摘要/借方_收款金额/贷方_收款金额/结算号/对方银行账号/对方账号名称
                bankCheckBillItem = self.bankCheckBillItem % (
                busDate, line["JY_ORDER_NO"], 0, money, settleDate, line["BANK_NO"], line["STORE_NAME"])
                bankCheckBillItems.append(json.loads(bankCheckBillItem))

                lastAmount = sum([lastAmount, money])

            # 业务日期/摘要/借方_收款金额/贷方_收款金额/结算号/对方银行账号/对方账号名称
            bankCheckBillItem = self.bankCheckBillItem % (self.startTime, '', lastAmount, 0, "%s %s" % (self.startTime, "23:59:59"), '', '')
            bankCheckBillItems.append(json.loads(bankCheckBillItem))

            # 起始日期/银行账号/结束日期/创建组织
            bankCheckBill = json.loads(self.bankCheckBill % (self.startTime, data[0]["BANK_NO"], self.startTime, data[0]["COMPANY_NO"]))
            bankCheckBill["FEntity"] = bankCheckBillItems
            self.bankCheckBillBatch[1]["Model"].append(bankCheckBill)

    def iterParam(self, param):
        it = iter(param)

        while True:
            try:
                val = next(it) # 获得下一个值:
                self.getParams(param[val])
            except StopIteration:
                # 遇到StopIteration就退出循环
                break

    def main(self, agent, current_date):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        trans_date = current_date + datetime.timedelta(days=-1)

        # TODO 文件地址要换一下
        path = "%s\\%s_%s.txt" % ("C:\\Users\\Administrator\\Desktop", agent, trans_date.strftime('%Y%m%d'))

        self.startTime = trans_date.strftime('%Y-%m-%d')

        content = open(path, "r", encoding="utf-8-sig")
        all_lines = content.readlines()

        if len(all_lines) == 0:
            options = {
                "kingdeeRecord.orderId": "postarBug",
                "kingdeeRecord.rtid": 0,
                "kingdeeRecord.type": -2,
                "kingdeeRecord.message": "The query result is zero!",
                "authentication": self.authentication
            }

            self.saveKingdeeRecord(self.pthost, options)

            return False

        # 金蝶登录
        self.kingdeeCookies = self.kingdeeLogin(self)
        if not self.kingdeeCookies:
            return

        company_cust_bank_line = {}
        statements = ""

        for i in range(1, len(all_lines)):
            line = json.loads(all_lines[i].strip().split("\t")[0])
            threeOrderId = line["JY_FLOW_NO"]

            self.cursor.execute(self.SQL_ORGANIZATION % threeOrderId)
            companyParam = self.cursor.fetchone()

            if companyParam:
                line["COMPANY_NO"] = companyParam[0]
                line["BANK_NO"] = companyParam[1]

            custNo = line["CUST_ID"]
            bankNo = line["CARD_NO"]
            company = companyParam[0]

            if company in company_cust_bank_line: # 公司是否存在

                if custNo not in company_cust_bank_line[company]: # 商户不存在追加新商户

                    company_cust_bank_line[company][custNo] = {}
                    company_cust_bank_line[company][custNo][bankNo] = []
                    company_cust_bank_line[company][custNo][bankNo].append(line)
                else:

                    if bankNo in company_cust_bank_line[company][custNo]:
                        company_cust_bank_line[company][custNo][bankNo].append(line)

                    else:
                        company_cust_bank_line[company][custNo][bankNo] = []
                        company_cust_bank_line[company][custNo][bankNo].append(line)

            else:

                company_cust_bank_line[company] = {}
                company_cust_bank_line[company][custNo] = {}
                company_cust_bank_line[company][custNo][bankNo] = []
                company_cust_bank_line[company][custNo][bankNo].append(line)


            custNo = line["CUST_ID"]
            price = float(line["JY_TXAMT"])*self.ten
            fee = float(line["JY_FEE"])*self.ten
            rate = float(line["JY_RATE"])*self.thousand
            payTime = line["JY_TIME"]

            statement = (custNo, threeOrderId, price, fee, rate, payTime, 0, 0)
            statements = "%s%s," % (statements, statement)

        statements = statements[:-1]

        sql = self.SQL_STATEMENT % statements

        self.cursor.execute(sql)
        self.commit()

        self.iterParam(company_cust_bank_line)

        self.saveBillToKingdee(self, self.bankCheckBillBatch, "postarBug")

if __name__ == '__main__':
    """
            银行对账单脚本说明:
            将文件内容转化成json格式, 自动生成金蝶中的银行对账单;
            当该脚本执行出现异常时, 将错误信息存入到数据库中;

            1.参数说明参数要对应
                1.pid         机构号
            2.脚本传参说明:
                 cron_postar_kingdee.py agent
                 cron_postar_kingdee.py "6100000127"
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding='UTF-8'))
    dbconf = config.get("database")
    khost = config.get("khost")
    kloginconf = config.get("kingdeeData")
    urlconf = config.get("kingdeeUrl")

    agent = sys.argv[1]
    args = sys.argv[2]

    if args == "auto":
        current_date = datetime.datetime.now()
    else:
        current_date = datetime.datetime.strptime(args, "%Y%m%d")

    bankCheckBill = bankCheckBill(dbconf, khost, kloginconf, urlconf, config.get("media"), config.get("pthost"), config.get("authentication"))
    bankCheckBill.main(agent, current_date)