#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from dateutil import parser
import opensdk

class Statement(Util):
    def __init__(self, dbconf, config, swiftpass, charset='utf8'):
        self.dbconn = None
        self.mulNum = 1000

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = charset
        self.media = config.get("media")
        self.pthost = config.get("pthost")
        self.authentication = config.get("authentication")

        self.keyid = swiftpass.get("keyid")
        self.key = swiftpass.get("key")
        self.resp_pub_key = swiftpass.get("resp_pub_key")
        self.req_param_encrypt_key = swiftpass.get("req_param_encrypt_key")
        self.resp_sign_algorithm = swiftpass.get("resp_sign_algorithm")
        self.key_sign_type = swiftpass.get("key_sign_type")
        self.env_url_prod = swiftpass.get("env_url_prod")
        self.env_url_dev = swiftpass.get("env_url_dev")
        self.downloadBill = swiftpass.get("downloadBill")

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

    def saveData(self, host, api, data):
        param_header = {'Content-Type':'application-json', "Accept": "*/*"}
        requests.post("%s/%s.do" % (host, api), data, param_header)

    def main(self, mchNo, date):

        conf = opensdk.OpenSdkConfig()

        conf.keyid = self.keyid
        conf.key = self.key
        conf.resp_pub_key = self.resp_pub_key
        conf.req_param_encrypt_key = self.req_param_encrypt_key
        conf.resp_sign_algorithm = self.resp_sign_algorithm
        conf.key_sign_type = self.key_sign_type
        conf.env_url_prod = self.env_url_prod
        conf.env_url_dev = self.env_url_dev

        body_params = {"mchNo": mchNo, "randomStr": "SWIFT_PASS", "billDate": date, "billType": "SUCCESS", "channelType": "OPEN_ECO"}
        request = opensdk.opensdk(conf, self.downloadBill, 'POST', None, None, body_params, None)

        fileId = json.loads(request)["fileId"]

        file_path = "%s%s%s%s" % (os.path.dirname(__file__), "/swiftpass_", date, ".txt")
        opensdk.download_file(conf, fileId, file_path)

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        content = open(file_path, "r", encoding="utf-8-sig")
        all_lines = content.readlines()

        if len(all_lines) == 0:
            options = {
                "kingdeeRecord.orderId": "postarBug",
                "kingdeeRecord.rtid": 0,
                "kingdeeRecord.type": -2,
                "kingdeeRecord.message": "The query result is zero!",
                "authentication": self.authentication
            }

            self.saveData(self.pthost, "addKingdeeRecord", options)

            return False

        statements = ""

        for i in range(1, len(all_lines)-2):
            files = all_lines[i].split(",")

            statement = (files[1].replace("`" , ""), files[5].replace("`" , ""), float(files[10].replace("`" , ""))*self.mulNum,  float(files[22].replace("`" , ""))*self.mulNum,  float(files[23].replace("`" , ""))*self.mulNum, files[0].replace("`" , ""), 1, 0)
            statements = "%s%s," % (statements, statement)

        statements = statements[:-1]

        sql = self.SQL_STATEMENT % statements

        self.cursor.execute(sql)
        self.commit()

        content.close()
        os.remove(file_path)


if __name__ == '__main__':
    """
            兴业银行流水脚本说明:
            下载兴业银行流水, 将其数据分析之后存入到信息平台中;
            当该脚本执行出现异常时, 将错误信息存入到数据库中;
            
            1.参数说明参数要对应
                1.mchNo  商户号 "shenyang-lnalzszx"
                2.date   时间 "20231113"
            2.脚本传参说明:
                cron_payment_statement_swiftpass.py mchNo date
                cron_payment_statement_swiftpass.py shenyang-lnalzszx 20231113

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding='UTF-8'))
    dbconf = config.get("database")
    swiftpass = config.get("swiftpass")

    mchNo = sys.argv[1]
    args = sys.argv[2]

    if args == "auto":
        current_date = time.strftime("%Y%m%d", time.localtime())
    else:
        current_date = parser.parse(args).strftime("%Y%m%d")

    statement = Statement(dbconf, config, swiftpass)
    statement.main(mchNo, current_date)