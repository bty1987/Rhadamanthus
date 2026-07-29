#!/usr/bin/python
# -*- coding:UTF-8 -*-

import os
import sys
import json
import xlrd
import xlwt
import pymysql
import requests
import tempfile
import traceback
import datetime


class importItem():
    def __init__(self, host='', username='', password='', media='', charset='utf8'):
        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media

        self.dbconn = None
        self.cursor = None

        self.tempPath = tempfile.gettempdir()
        self.errPath = self.tempPath + "/err.log"
        self.SQL_INSERT_QUOTATION_QUOTATIONITEM = """
                        insert into 
                          quotation.quotationitem 
                            (itemId,
                            versionId,
                            itemName,
                            quotationTypeId,
                            quotationClassificationId,
                            quotationBigCategoryId,
                            quotationSmallCategoryId,
                            measurementUnitId,
                            itemWorkTypeId,
                            quotationItemDes,
                            unitPrice,
                            status,
                            discount) 
                        values 
                          %s;
                          """

    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def getDBCursor(self):

        if not self.dbconn:
            self.openDBConnect()

        self.cursor = self.dbconn.cursor()

    def commit(self):
        self.dbconn and self.dbconn.commit()

    def closeDBConnect(self):
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def mkdir(self, path):
        isExists = os.path.exists(path)
        if not isExists:
            os.makedirs(path)

    def post(self, url, param_dict, param_header, filePath='', param_type='x-www-form-urlencode'):
        """
        @功能：封装post方式
    　　@paramType:指传入参数类型，可以是form-data、x-www-form-urlencode、json
        """
        params = None
        if param_type == "x-www-form-urlencode":
            params = param_dict
        elif param_type == 'json':
            params = json.dumps(param_dict)

        if filePath == "":
            ret = requests.post(url, data=params, headers=param_header)
        else:

            fileName = os.path.basename(filePath)
            extensionName = os.path.splitext(fileName)[1]

            files = {'strutsUploads': (extensionName, open(filePath, 'rb'), {"name": "strutsUploads"})}

            ret = requests.post(url, data=params, headers=param_header, files=files)

        return ret

    def uploudFile(self, filePath, url="", param_dict={}):

        if url == "":
            return

        if filePath == None and filePath == "":
            return

        param_header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}

        res = self.post(url, param_dict, param_header, filePath)

        path = res.json()
        path = path["resUrl"]

        return path

    def downLoadFile(self, url, path):

        if path == None and path == "":
            return

        html = requests.get(url)

        fileName = os.path.basename(path)
        filePath = self.tempPath + "/" + fileName

        with open(filePath, 'wb') as f:
            f.write(html.content)

        return filePath

    def delFile(self, path):
        if os.path.isfile(path):
            os.remove(path)

    def updataSchedule(self, pid, param):

        arry = [k + '=' + '"' + str(param[k]) + '"' for k in param]

        sqls = """update information.plan set %s where pid = %s ;""" % (','.join(arry), pid)

        self.cursor.execute(sqls)

        self.commit()

    def createWorkbook(self, sheetName):
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet(sheetName, cell_overwrite_ok=True)

        return workbook, sheet

    def saveWorkbook(self, filePaths, workbook):

        filePath = os.path.dirname(filePaths)
        self.mkdir(filePath)

        workbook.save(filePaths)

    def writeWorkbook(self, sheet, row, col, value, css=None):
        if css != None:

            patterns = xlwt.Pattern()
            patterns.pattern = xlwt.Pattern.SOLID_PATTERN
            patterns.pattern_fore_colour = css
            styles = xlwt.XFStyle()
            styles.pattern = patterns

            sheet.write(row, col, value, styles)
        else:
            sheet.write(row, col, value)

    def openWorkbook(self, filePath, sheetsNum=0):
        book = xlrd.open_workbook(filePath, formatting_info=True)
        table = book.sheets()[sheetsNum]

        return book, table

    def importCommit(self, sql, res, pid, cmt=500):

        all = len(res) / 0.9
        molecular = all * 0.1
        schedule = (molecular / all) * 100
        plan = {
            u"schedule": schedule,
            u"status": 4
        }
        self.updataSchedule(pid, plan)

        for i in range(0, len(res), cmt):
            lists = res[i:i + cmt]
            sqls = sql % (",".join(lists))
            try:
                self.cursor.execute(sqls)
            except Exception as e:
                sqls = self.delspace(sqls)
                strs = u"%s err: start %s -- end %s;" % (self.nowTime(), i + 1, i + len(lists))
                self.writeFile(self.errPath, self.nowTime() + str(e))
                self.writeFile(self.errPath, strs)
                self.writeFile(self.errPath, sqls)

                paln = {u"status": 3}
                self.updataSchedule(pid, paln)

            molecular = molecular + len(lists)
            schedules = (molecular / all) * 100

            plan = {
                u"schedule": schedules
            }
            self.updataSchedule(pid, plan)

    def readFilesByline(self, filePath):
        sheet = self.openWorkbook(filePath)[1]

        num_rows = sheet.nrows

        rowsList = []

        for i in range(0, num_rows):
            row = sheet.row_values(i)
            rowsList.append(row)

        return rowsList

    def writeFile(self, path, srts):
        with open(path, 'ab+') as f:
            srts = u"%s " % srts
            f.write(srts.encode("utf-8"))
            n = "\n"
            f.write(n.encode("utf-8"))

    def delspace(self, strs):
        strs = strs.replace(u" ", u"")
        strs = strs.replace(u"\n", u"")
        strs = strs.replace(u"\t", u"")
        strs = strs.replace(u"\r", u"")
        return strs

    def nowTime(self):
        nowTime = datetime.datetime.now()
        strNowTime = nowTime.strftime("%Y-%m-%d %H:%M:%S")
        return strNowTime

    def errCall(self, err=None):

        if err != None:
            self.writeFile(self.errPath, self.nowTime() + str(err))
            self.writeFile(self.errPath, self.nowTime() + u"\n" + traceback.format_exc())

        paln = {u"status": 3}
        self.updataSchedule(pid, paln)

    def main(self, pid, path):

        try:
            url = self.media + path
            downLoadPath = self.downLoadFile(url, path)
            data = self.readFilesByline(downLoadPath)

            res = []
            valus = """("%s", "%s", "%s", %d, %d, %d, %d, %d, %d, "%s", %s, %d, %d)"""
            for i, v in enumerate(data):
                del v[0]
                v = tuple(v)

                res.append(valus % v)

            self.getDBCursor()
            self.importCommit(self.SQL_INSERT_QUOTATION_QUOTATIONITEM, res, pid, 100)

            self.delFile(downLoadPath)

            plan = {
                u"schedule": 100,
                u"status": 2
            }
            self.updataSchedule(pid, plan)

        except Exception as e:
            self.errCall(e)

        finally:

            url = self.media + u"uploadOther.do"

            if os.path.isfile(self.errPath):
                infofilepath = self.uploudFile(self.errPath, url)

                paln = {
                    u"infofilepath": infofilepath
                }

                self.updataSchedule(pid, paln)

                self.delFile(self.errPath)

            self.closeDBConnect()

            sys.exit(0)


if __name__ == '__main__':
    """
    导入报价项:
        根据用户提供的报价项表格进行导入
        首先下载该文件并按行读取表格内容,经处理后的数据批量插入到数据库,然后删除临时文件
        处理:表格中首列无用删除
    异常处理:
        在当出现异常时,跟新状态为失败将异常记录到log文件中
        其中,在插入数据出现错误时将记录该次批量插入数据,然后继续执行
        最后上传,并删除临时文件
        
    传入必须参数说明
        1.pid         information.plan的主键;
        2.path        下载文件地址
    该脚本主要参数和方法简介:
        按行读取数据readFilesByline方法
            返回[["a","b","c"],["a2","b2",3]]这种格式数据
            其中 ["a","b","c"]就是第一行数据["a2","b2",3]为第二行数据
        批量插入数据importCommit 
            sql : 传入插入SQL
            res : 要插入的数据(列表)
            pid : 更新进度使用
            cmt : 每次批量插入条数,默认500
            该方法是把要插入的数据值拼装 sql (数据1条),(数据2条),(数据3条) 这种格式
            
        封装了POST请求
        提供上传,下载, 文件的创建,写入,删除功能;
        常用的关于xls文件的创建,写入,保存方法;
        
    """
    modernFilePath = os.path.realpath(__file__)

    filepath = os.path.dirname(modernFilePath)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    importItem = importItem(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"))

    pid = sys.argv[1]
    path = sys.argv[2]

    importItem.main(pid, path)
