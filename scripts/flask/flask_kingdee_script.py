#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

import os
import json
import requests
import datetime
import hmac
import hashlib
import urllib.parse

class kingdee():
    def __login__(self, redis):

        kingdee = redis.get('kingdee')

        if kingdee:
            return kingdee

        config = json.load(open("%s/%s" % (os.getcwd(), "config.json"), encoding='UTF-8'))

        urlconf = config.get("kingdeeUrl")
        khost = config.get("khost")
        login_kingdeeData = config.get("kingdeeData")

        login = "%s%s" % (khost, urlconf.get("Login"))
        save = "%s%s" % (khost, urlconf.get("Save"))
        view = "%s%s" % (khost, urlconf.get("View"))

        # kingdee login
        login_response = requests.post(url=login, data=login_kingdeeData)
        successFlag = json.loads(login_response.text)["IsSuccessByAPI"]

        if successFlag == False:
            return {"code": -1, "msg": "REQUEST ERROR"}

        cookies = json.dumps(requests.utils.dict_from_cookiejar(login_response.cookies))

        data = {'cookies': cookies, 'save': save, 'view': view, 'code': 0}

        redis.set('kingdee', json.dumps(data), 20 * 60)

        return json.dumps(data)

    def save(self, args, logger, redis, mongo, params):
        config = json.loads(self.__login__(redis))

        if config.get("code", -1) == -1:
            return {"code": -1, "msg": "KINGDEE LOGIN ERROR"}

        if args.get("decorationInfos"):
            decorationInfos = args.get("decorationInfos")

            for i in range(0, len(decorationInfos)):
                decorationInfo = decorationInfos[i]

                customer = self.customer(decorationInfo.get("orderId"), decorationInfo.get("address"), decorationInfo.get("dorgNo"))

                self.verifyBasicData(decorationInfo.get("orderId"), customer, config)
        elif args.get("orderId"):
            customer = self.customer(args.get("orderId"), args.get("address"), args.get("dorgNo"))

            self.verifyBasicData(args.get("orderId"), customer, config)

        # receipt params
        billFieldNames = list(json.loads(params[0]).keys())
        paramsData = []

        for i in range(0, len(billFieldNames) - 1):
            paramsData.append(str(args.get(billFieldNames[i])))

        bill = json.loads(params[0] % tuple(paramsData))

        billItems = []

        lastParamName = billFieldNames[len(billFieldNames) - 1]
        # lastParam = args.get(lastParamName)
        lastParam = json.loads(args.get(lastParamName))

        billItemFieldNames = list(json.loads(params[1]).keys())
        for i in range(0, len(lastParam)):
            itemParamsData = []

            # receiptItem params
            for j in range(0, len(billItemFieldNames)):
                itemParamsData.append(str(lastParam[i].get(billItemFieldNames[j])))

            billItemData = params[1] % tuple(itemParamsData)
            billItems.append(json.loads(billItemData))

        bill[lastParamName] = billItems

        params = {"FormID": params[2], "Data": json.dumps({"IsAutoSubmitAndAudit": params[3] and 'true' or 'false', "Model": bill})}

        cookies = requests.utils.cookiejar_from_dict(json.loads(config.get("cookies", {})))
        response = requests.post(url=config.get("save"), data=params, cookies=cookies)

        status = json.loads(response.text)["Result"]["ResponseStatus"]

        if status["IsSuccess"] == False:
            return {"code": status["ErrorCode"], "msg": status["Errors"]}

        return {"code": 0, "msg": ""}

    # 付款单
    def paybill(self, args, logger, redis, mongo):

        TYPE = args.get("TYPE", "")

        if TYPE not in []:
            return {"code": -1, "msg": "TYPE NOT EXIST"}

        config = json.loads(self.__login__(redis))

        if config.get("code", -1) == -1:
            return {"code": -1, "msg": "KINGDEE LOGIN ERROR"}

        FSETTLEORGID = args.get("FSETTLEORGID", "").split("-")[1] if args.get("FSETTLEORGID", "").find("-") != -1 else ""
        FPAYORGID = args.get("FPAYORGID", "").split("-")[1] if args.get("FPAYORGID", "").find("-") != -1 else ""
        F_SFKD_Combo = args.get("F_SFKD_Combo", "").split("-")[1] if args.get("F_SFKD_Combo", "").find("-") != -1 else ""
        FSETTLETYPEID = args.get("FSETTLETYPEID", "").split("-")[1] if args.get("FSETTLETYPEID", "").find("-") != -1 else ""
        FPURPOSEID = args.get("FPURPOSEID", "").split("-")[1] if args.get("FPURPOSEID", "").find("-") != -1 else ""

        paybill = {
            "FCURRENCYID": {"FNumber": args.get("FCURRENCYID", "")},
            "FDATE": datetime.datetime.now().strftime('%Y/%m/%d'),
            "FBillTypeID": {"FNumber": args.get("FBillTypeID", "")},
            "FCONTACTUNITTYPE": args.get("FCONTACTUNITTYPE", ""),
            "FCONTACTUNIT": {"FNumber": args.get("FCONTACTUNIT", "")},
            "FRECTUNITTYPE": args.get("FRECTUNITTYPE", ""),
            "FRECTUNIT": {"FNumber": args.get("FRECTUNIT", "")},
            "FPAYORGID": {"FNumber": FPAYORGID},
            "FSETTLEORGID ": {"FNumber": FSETTLEORGID},
            "F_SFKD_Combo": F_SFKD_Combo,
            "F_SFKD_Base1": {"FSTAFFNUMBER": args.get("F_SFKD_Base1", "")},
            "F_SFKD_Base": {"FNumber": args.get("F_SFKD_Base", "")},
            "FPAYBILLENTRY": []
        }

        paybillItem = {
            "FSETTLETYPEID": {"FNumber": FSETTLETYPEID},
            "FPURPOSEID": {"FNumber": FPURPOSEID},
            "FPAYTOTALAMOUNTFOR": args.get("FPAYTOTALAMOUNTFOR", ""),
            "FACCOUNTID": {"FNumber": args.get("FACCOUNTID", "").replace(' ', '')},
            "FCONTACTUNIT": {"FNumber": args.get("FCONTACTUNIT", "")},
            "FOPPOSITEBANKNAME": args.get("FOPPOSITEBANKNAME", ""),
            "FOPPOSITEBANKACCOUNT": args.get("FOPPOSITEBANKACCOUNT", "").replace(' ', ''),
            "FOPPOSITECCOUNTNAME": args.get("FOPPOSITECCOUNTNAME", ""),
            "FCOMMENT": args.get("FCOMMENT", "")
        }

        paybill.get("FPAYBILLENTRY").append(paybillItem)

        params = {"FormID": "AP_PAYBILL", "Data": json.dumps({"Model": paybill})}

        cookies = requests.utils.cookiejar_from_dict(json.loads(config.get("cookies", {})))
        response = requests.post(url=config.get("save"), data=params, cookies=cookies)

        status = json.loads(response.text)["Result"]["ResponseStatus"]

        if status["IsSuccess"] == False:
            return {"code": status["ErrorCode"], "msg": status["Errors"]}

        return {"code": 0, "msg": ""}

    # 收款单
    def collectbill(self, args, logger, redis, mongo):

        # 收款日期/单据类型/往来单位类型(FCONTACTUNITTYPE)/单号/付款单位类型(FPAYUNITTYPE)/付款单位(FPAYUNIT)/款项公司/结算组织/等级/款项类型/备注/单据体明细
        collectbill = """{
            "FDATE": "%s",
            "FBILLTYPEID": {"FNumber": "%s"},
            "FCONTACTUNITTYPE": "%s",
            "FCONTACTUNIT": {"FNumber": "%s"},
            "FPAYUNITTYPE": "%s",
            "FPAYUNIT": {"FNumber": "%s"},
            "FPAYORGID": {"FNumber": "%s"},
            "FSETTLEORGID": {"FNumber": "%s"},
            "F_SFKD_Hslb": {"FNumber": "%s"},
            "F_SFKD_Base": {"FNumber": "%s"},
            "FREMARK": "%s",
            "FRECEIVEBILLENTRY": []
        }"""

        # 收款用途/结算方式/应收金额/银行账号/结算号/备注
        collectbillItem = """{
            "FPURPOSEID": {"FNumber": "%s"},
            "FSETTLETYPEID":{"FNumber": "%s"},
            "FRECTOTALAMOUNTFOR":"%s", 
            "FACCOUNTID":{"FNumber": "%s"},
            "FSETTLENO": "%s",
            "FCOMMENT": "%s"
        }"""

        return self.save(args, logger, redis, mongo, [collectbill, collectbillItem, "AR_RECEIVEBILL", True])

    # 收款退款单
    def collectRefundBill(self, args, logger, redis, mongo):

        # 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
        collectRefundBill = """{
            "FDATE": "%s",
            "FBILLTYPEID": {"FNumber": "%s"},
            "FSETTLEORGID": {"FNumber": "%s"},
            "FCONTACTUNITTYPE": "%s",
            "FRECTUNITTYPE": "%s",
            "FCONTACTUNIT": {"FNumber": "%s"},
            "FRECTUNIT": {"FNumber": "%s"},
            "FPAYORGID": {"FNumber": "%s"},
            "F_ORA_BASE": {"FNumber": "%s"},
            "F_SFKD_GCKXLX": {"FNumber": "%s"},
            "FREFUNDBILLENTRY": []
        }"""

        # 结算方式/原收款用途/应退金额/我方银行账号/备注/对方账户名称/对方开户行/对方银行账号
        collectRefundBillItem = """{
            "FSETTLETYPEID": {"FNumber": "%s"},
            "FPURPOSEID":{"FNumber": "%s"},
            "FREFUNDAMOUNTFOR":"%s",
            "FACCOUNTID":{"FNumber": "%s"},
            "FNOTE":"%s",
            "FOPPOSITECCOUNTNAME": "%s",
            "FOPPOSITEBANKNAME": "%s",
            "FOPPOSITEBANKACCOUNT": "%s"
        }"""

        return self.save(args, logger, redis, mongo, [collectRefundBill, collectRefundBillItem, "AR_REFUNDBILL", False])

    # 银行过渡单
    def bankTransitionBill(self, args, logger, redis, mongo):

        # 单据编号/业务日期/往来单位类型/付款单位类型/收款组织/销售组织/核算类别/客户/实收金额/单据体明细
        bankTransitionBill = """{
            "FBillNo": "%s",
            "F_SFKD_Date": "%s",
            "F_SFKD_WangLaiOrgType": "%s",
            "F_SFKD_RecOrgType": "%s",
            "F_SFKD_RecOrg": {"FNumber": "%s"},
            "F_SFKD_SaleOrg": {"FNumber": "%s"},
            "F_ora_Base3": {"FNumber": "%s"},
            "F_ora_Base2": {"FNumber": "%s"},
            "F_SFKD_RealAmount": "%s",
            "FEntity": []
        }"""

        # 实收金额/款项类型
        bankTransitionBillItem = """{
            "F_SFKD_ShiShouAmount": "%s",
            "F_ora_Base6": {"FNumber": "%s"}
        }"""

        return self.save(args, logger, redis, mongo, [bankTransitionBill, bankTransitionBillItem, "SFKD_BankTransBill", True])

    # 转款单
    def materialTransferBill(self, args, logger, redis, mongo):

        # 单据编号/业务日期/往来单位类型/付款单位类型/核算类别/收款组织/销售组织/客户/实收金额/单据体明细
        materialTransferBill = """{
            "FBillNo": "%s",
            "F_SFKD_Date": "%s",
            "F_SFKD_WangLaiUnitType": "%s",
            "F_SFKD_PayUnitType": "%s",
            "F_SFKD_ABC": {"FNumber": "%s"},
            "F_SFKD_RecOrgId": {"FNumber": "%s"},
            "F_SFKD_SaleOrgId": {"FNumber": "%s"},
            "F_ora_Base": {"FNumber": "%s"},
            "F_SFKD_ShiShouAmount": "%s",
            "FEntity": []
        }"""

        # 实收金额/品牌/供应商/销售单号/款项类型
        materialTransferBillItem = """{
            "F_SFKD_RealAmount": "%s",
            "F_ora_Base3":{"FNumber": "%s"},
            "F_ora_Base4":{"FNumber": "%s"},
            "F_ora_Text":"%s",
            "F_SFKD_Base":{"FNumber": "%s"}
        }"""

        return self.save(args, logger, redis, mongo, [materialTransferBill, materialTransferBillItem, "SFKD_ZhuCaiZhuanKuanBill", True])

    # 应收单
    def receivableBill(self, args, logger, redis, mongo):

        # 收款日期/单据类型/客户/结算组织/收款单位/核算类别/款项类型/备注/单据体明细
        receivableBill = """{
            "FDATE": "%s",
            "FBillTypeID": {"FNumber": "%s"},
            "FCUSTOMERID": {"FNumber": "%s"},
            "FSETTLEORGID": {"FNumber": "%s"},
            "FPAYORGID": {"FNumber": "%s"},
            "F_ORA_BASE1": {"FNumber": "%s"},
            "F_SFKD_Base2": {"FNumber": "%s"},
            "FAR_Remark": "%s",
            "FENTITYDETAIL": []
        }"""

        # 费用项目编码/不含税金额/税额
        receivableBillItem = """{
            "FCOSTID": {"FNumber": "%s"},
            "FNoTaxAmountFor_D":"%s",
            "FTAXAMOUNTFOR_D":"%s"
        }"""

        return self.save(args, logger, redis, mongo, [receivableBill, receivableBillItem, "AR_receivable", True])

    # 应付单
    def payableBill(self, args, logger, redis, mongo):

        # 业务日期/结算组织/币别/单据类型/到期日/供应商/业务类型/付款组织/客户/监理/工人/施工节点/工费类型/劳务公司/签单公司/核算类别/单据体明细
        payableBill = """{
            "FDATE": "%s",
            "FSETTLEORGID": {"FNumber": "%s"},
            "FCURRENCYID": {"FNumber": "%s"},
            "FBillTypeID": {"FNumber": "%s"},
            "FENDDATE_H": "%s",
            "FSUPPLIERID": {"FNumber": "%s"},
            "FBUSINESSTYPE": "%s",
            "FPAYORGID": {"FNumber": "%s"},
            "F_ora_Base": {"FNumber": "%s"},
            "F_SFKD_Base": {"FNumber": "%s"},
            "F_SFKD_Base1": {"FNumber": "%s"},
            "F_SFKD_Base2": {"FNumber": "%s"},
            "F_SFKD_Assistant": {"FNumber": "%s"},
            "F_SFKD_Assistant1": {"FNumber": "%s"},
            "F_SFKD_Assistant2": {"FNumber": "%s"},
            "F_SFKD_Base7": {"FNumber": "%s"},
            "FEntityDetail": []
        }"""

        # 项目费用编码/计价单位/单价/计价数量/含税单价/税率/不含税金额/税额/价税合计
        payableBillItem = """{
            "FCOSTID": {"FNumber": "%s"},
            "FPRICEUNITID":{"FNumber": "%s"},
            "Fprice":"%s", 
            "FPriceQty":"%s",
            "FTaxPrice": "%s",
            "FEntryTaxRate": "%s",
            "FNoTaxAmountFor_D": "%s",
            "FTAXAMOUNTFOR_D": "%s",
            "FALLAMOUNTFOR_D": "%s"
        }"""

        return self.save(args, logger, redis, mongo, [payableBill, payableBillItem, "AP_Payable", False])

    # 结算单
    def balanceBill(self, args, logger, redis, mongo):

        # 单据编号/创建人/业务日期/币别/类型/核算类别/款项组织/结算组织/品牌/供应商/结算单号/代收服务费合计/代收合计/单据体明细
        balanceBill = """{
            "FBillNo": "%s",
            "F_SFKD_ywcjr": {"FSTAFFNUMBER": "%s"},
            "F_SFKD_Date": "%s",
            "F_SFKD_Cur": {"FNumber": "%s"},
            "F_SFKD_Assistant": {"FNumber": "%s"},
            "F_SFKD_ABC": {"FNumber": "%s"},
            "F_SFKD_OrgId": {"FNumber": "%s"},
            "F_SFKD_OrgId1": {"FNumber": "%s"},
            "F_SFKD_Brand": {"FNumber": "%s"},
            "F_SFKD_Supplier": {"FNumber": "%s"},
            "F_SFKD_SaleBillNo": "%s",
            "F_SFKD_Amount1": "%s",
            "F_SFKD_dshj": "%s",
            "FEntity": []
        }"""

        # 代收金额/服务费金额/客户/销售单号/优惠券
        balanceBillItem = """{
            "F_SFKD_JieSuanAmount": "%s",
            "F_SFKD_ShiShouAmount": "%s",
            "F_ora_Base": {"FNumber": "%s"},
            "F_SFKD_Text": "%s",
            "F_SFKD_yhq": "%s"
        }"""

        return self.save(args, logger, redis, mongo, [balanceBill, balanceBillItem, "SFKD_JieSuanBill", False])

    # 调用第三方接口保存金蝶数据
    def thirdPartyCommon(self, args, logger, redis, mongo):

        url = "http://116.205.110.157:623"
        appid = '907D91319B494A5381916476CB710B9C'
        minute = 60

        tableName = args.get("tableName")

        # data = args.get("data") # 本地格式
        data = json.loads(args.get("data")) # 服务器格式

        utc_time = datetime.datetime.utcnow() # 获取当前的UTC时间

        formatted_utc_time = utc_time.strftime('%Y-%m-%dT%H:%M:%SZ')  # 将UTC时间格式化为字符串

        encoded_time_string = urllib.parse.quote(formatted_utc_time, safe='') # 使用quote函数进行URL编码，safe参数指定哪些字符不需要进行编码

        message = 'POST/api/MasterData/%s?Appid=%s&Expires=%s&Timestamp=%s' % (tableName, appid, minute, encoded_time_string)

        hash_hex = self.hmacMD5(message)

        url_json = '%s/api/MasterData/%s' % (url, tableName)

        params = {'Appid': appid, 'Expires': minute,  'Timestamp': formatted_utc_time}
        headers = {'Signature': hash_hex}

        response = requests.post(url_json, params=params, json=data, headers=headers)

        if response.status_code == 200:
            return {"code": 0, "msg": ""}
        else:
            return {"code": response.status_code, "msg": response.reason}

    def hmacMD5(self, message):

        key = b'09O16k2q1838hG710cb1'

        hmac_obj = hmac.new(key, message.encode('utf-8'), hashlib.md5)  # 创建 HMAC 对象

        hash_hex = hmac_obj.hexdigest().upper()  # 获取哈希值的十六进制表示并大写

        return hash_hex

    def organization(self, args, logger, redis, mongo):

        organization = {
            "FName": "%s",
            "FCreateOrgId": {"FNumber": "%s"},
            "FUseOrgId": {"FNumber": "%s"}
        }

        return {"code": 0, "msg": ""}

    def employee(self, args, logger, redis, mongo):

        employee = {
            "FName": "%s",
            "FCreateOrgId": {"FNumber": "%s"},
            "FUseOrgId": {"FNumber": "%s"},
            "FStaffNumber": "%s"
        }

        return {"code": 0, "msg": ""}

    def brand(self, args, logger, redis, mongo):

        brand = {
            "FName": "%s",
            "FNumber": "%s"
        }

        return {"code": 0, "msg": ""}

    def customer(self, orderId, address, dorgNo):

        customer = {
            "FName": address,
            "FNumber": orderId,
            "FCreateOrgId": {"FNumber": "100"},
            "FTRADINGCURRID": {"FNumber": "PRE001"},
            "FDescription": dorgNo
        }

        return ["BD_Customer", customer]

    # 检查基础数据是否存在 不存在就保存
    def verifyBasicData(self, no, data, config):

        cookies = requests.utils.cookiejar_from_dict(json.loads(config.get("cookies", {})))

        post_data = {"FormId": data[0], "Data": json.dumps({"Number": no})}

        view_basic_response = requests.post(url=config.get("view"), data=post_data, cookies=cookies)

        isSuccess = json.loads(view_basic_response.text)["Result"]["ResponseStatus"]["IsSuccess"]

        if isSuccess == False:
            params = {"FormID": data[0], "Data": json.dumps({'IsAutoSubmitAndAudit': 'true', "Model": data[1]})}
            requests.post(url=config.get("save"), data=params, cookies=cookies)