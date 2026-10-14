from xlutils.copy import copy
from plan_util import *

class kingdeeUtil(Util):

    def querySystemConfig(self, self_data, sql, key, company):
        if not self_data:
            self.cursor.execute(sql % (key, company))
            purposeDatas = self.cursor.fetchall()
            self_data = purposeDatas[0][0]

        return self_data

    # 款项类型
    def queryPaymentType(self, sql, condition, company):
        salesPaymentTypes = {}

        self.cursor.execute(sql % (condition, company))
        salesPaymentTypeDatas = self.cursor.fetchall()

        if len(salesPaymentTypeDatas) == 0:
            self.cursor.execute(sql % (condition, "AND pt.company = 0"))
            salesPaymentTypeDatas = self.cursor.fetchall()

        for i, v in enumerate(salesPaymentTypeDatas):
            salesPaymentTypes[v[0]] = (v[1], v[2])

        return salesPaymentTypes

    def company(self, cloumCompany, company):
        if company != 0:
            companyId = u" AND %s IN (%s)" % (cloumCompany, company)
        else:
            companyId = u" "

        return companyId

    # 检查基础数据是否存在 不存在就保存
    def verifyBasicData(self, tableName, no, houseNumber, dorgNo, selfAllInfo):
        post_data = {"FormId": tableName, "Data": json.dumps({"Number": no})}
        view_basic_response = requests.post(url=selfAllInfo.view, data=post_data, cookies=selfAllInfo.kingdeeCookies)

        isSuccess = json.loads(view_basic_response.text)["Result"]["ResponseStatus"]["IsSuccess"]

        if isSuccess == False:
            basicData = "['%s', {'IsAutoSubmitAndAudit': 'true', 'Model':{'FNumber': '%s', 'FName': '%s', 'FDescription': '%s'}}]" % (tableName, no, houseNumber, dorgNo) # 金蝶基础数据格式
            saveData = {"parameters": basicData}

            save_basic_response = requests.post(url=selfAllInfo.save, data=saveData, cookies=selfAllInfo.kingdeeCookies)

            selfAllInfo.logFile = "payment_customer_kingdee"
            selfAllInfo.tableHead = ["装修单号", "错误信息"]
            self.errInfo(selfAllInfo.media, save_basic_response.text, selfAllInfo.login, selfAllInfo.kloginconf, selfAllInfo.kingdeeCookies, selfAllInfo, no)

    # 错误日志
    def errInfo(self, media, err, login, kloginconf, kingdeeCookies, selfAllInfo, data, flag=False):
        # errPath = "%s/%s.log" % (tempfile.gettempdir(), selfAllInfo.logFile)
        # dateString = ("%s%s%s") % (datetime.datetime.now().year, datetime.datetime.now().month, datetime.datetime.now().day)
        # errExcelPath = "%s/%s%s.xls" % (tempfile.gettempdir(), selfAllInfo.logFile, dateString)
        # rows = 1 # 0是表头
        #
        # if os.path.exists(errExcelPath):  # 表格已经存在
        #     workbook, sheet, rows = self.copy_to_excel(errExcelPath)
        #
        # else:
        #     workbook, sheet = self.createWorkbook(selfAllInfo.logFile)
        #     self.createTableHead(sheet, selfAllInfo.tableHead)

        isSuccess = json.loads(err)["Result"]["ResponseStatus"]["IsSuccess"]
        msgCode = json.loads(err)["Result"]["ResponseStatus"]["MsgCode"]

        if isSuccess == False:
            flag = True
            errs = json.loads(err)["Result"]["ResponseStatus"]["Errors"]

            for i in range(len(errs)):
                # self.writeFile(errPath, self.nowTime() + str(errs[i]))

                returnData = []
                options = {}

                if isinstance(data, str):
                    returnData.append(data)
                    options["kingdeeRecord.orderId"] = data
                    options["kingdeeRecord.rtid"] = 0
                    options["kingdeeRecord.atttype"] = -1
                    options["kingdeeRecord.type"] = -2
                else:
                    for index in range(len(selfAllInfo.fieldNo)):

                        currentVal = data[errs[i]["DIndex"]][selfAllInfo.fieldNo[index]]

                        returnData.append(currentVal)
                        options["kingdeeRecord.%s" % selfAllInfo.fieldName[index]] = currentVal

                returnData.append(errs[i]["Message"])
                options["kingdeeRecord.message"] = errs[i]["Message"][0:254]
                options["authentication"] = selfAllInfo.authentication
                self.saveKingdeeRecord(selfAllInfo.pthost, options)

                # 添加内容
            #     for j in range(len(returnData)):
            #         sheet.write(rows, j, u"%s" % returnData[j])
            #     rows += 1
            #
            # self.saveWorkbook(errExcelPath, workbook)

        # if flag:
        #     url = media + u"uploadOther.do"
        #     self.uploudFile(errPath, url)

        if msgCode == 1:
            login_response = requests.post(url=login, data=kloginconf)
            kingdeeCookies = login_response.cookies

        return kingdeeCookies

    def copy_to_excel(self, fileAddress):
        word_book = xlrd.open_workbook(fileAddress)
        work_sheet = word_book.sheets()[0]
        old_rows = work_sheet.nrows
        new_work_book = copy(word_book) # 将xlrd对象变成xlwt
        new_sheet = new_work_book.get_sheet(0) # 添加内容
        new_work_book.save(fileAddress)

        return new_work_book, new_sheet, old_rows

    def saveKingdeeRecord(self, host, data):
        param_header = {'Content-Type':'application-json', "Accept": "*/*"}
        ret = requests.post("%s/addKingdeeRecord.do" % host, data, param_header)

    def kingdeeLogin(self, selfAllInfo):
        login_response = requests.post(url=selfAllInfo.login, data=selfAllInfo.kloginconf)
        successFlag = json.loads(login_response.text)["IsSuccessByAPI"]

        if successFlag == False:
            options = {
                "kingdeeRecord.orderId": "kingdeeBug",
                "kingdeeRecord.rtid": 0,
                "kingdeeRecord.atttype": -1,
                "kingdeeRecord.type": -1,
                "kingdeeRecord.message": json.loads(login_response.text)["Message"][0:254],
                "authentication": selfAllInfo.authentication
            }
            self.saveKingdeeRecord(selfAllInfo.pthost, options)
            return False

        return login_response.cookies

    def saveBillToKingdee(self, selfAll, billBatch, batchData):
        if len(billBatch[1]["Model"]) > 0:
            save_data = {"parameters": str(billBatch)}
            save_response = requests.post(url=selfAll.batchSave, data=save_data, cookies=selfAll.kingdeeCookies)
            selfAll.kingdeeCookies = selfAll.errInfo(selfAll.media, save_response.text, selfAll.login, selfAll.kloginconf, selfAll.kingdeeCookies, selfAll, batchData)

    def getReiceipt(self, currentSelf, noOrName, columnval, company):

        conditionstr = ""

        if noOrName == "no":
            conditionstr = "r.`no` = '%s'" % columnval
        elif noOrName == "name":
            conditionstr = "r.`name` = '%s' AND r.status = 1" % columnval

        currentSelf.cursor.execute(currentSelf.SQL_RECEIPT % (conditionstr, company))  # 收据类型

        return currentSelf.cursor.fetchall()

    def getReceiptTypeItem(self, currentSelf, rtid, paytype, type):

        currentSelf.cursor.execute(currentSelf.SQL_RECEIPT_ITEMS % (rtid, paytype, type))  # 收据类型-单据

        return currentSelf.cursor.fetchall()

    def getPayTran(self, currentSelf, ptid):

        currentSelf.cursor.execute(currentSelf.SQL_PAYTRAN % ptid)  # 转换款

        return currentSelf.cursor.fetchall()