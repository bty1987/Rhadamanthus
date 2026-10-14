#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

from plan_util import *
from pymongo import MongoClient

class Merge(Util):
    def __init__(self, host='', username='', password='', media='', pthost='', mongoDB='', nowFilePath="", charset='utf8'):
        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.nowFilePath = nowFilePath

        self.dbconn = None
        self.cursor = None

        self.flag = True

        self.mongodbConf = mongoDB
        self.mongodb = None

    # mongodb连接池
    def mongodbPool(self):
        m = MongoClient(host = self.mongodbConf.get("host"), port = self.mongodbConf.get("port"))
        self.mongodb = m

    def wokerType(self, type):

        if type == int(0):
            type = "正常"
        if type == int(1):
            type = "早退"
        if type == int(2):
            type = "迟到"
        if type == int(3):
            type = "严重迟到"
        if type == int(4):
            type = "旷工迟到"
        if type == int(5):
            type = "未打卡"

        return type

    def main(self, pid, startTime, endTime):

        try:

            self.getDBCursor(self.host, self.username, self.password, charset=self.charset)

            falgs = merge.controlTime(startTime, endTime)
            if falgs == False:
                raise RuntimeError(u'时间应在1-31内')

            sTime = datetime.datetime.now()

            startTimeKey = u"%s 00:00:00" % startTime.replace("/", "-")
            endTimeKey = u"%s 23:59:59" % endTime.replace("/", "-")
            start = datetime.datetime.strptime(startTimeKey, '%Y-%m-%d %H:%M:%S')
            end = datetime.datetime.strptime(endTimeKey, '%Y-%m-%d %H:%M:%S')

            selectStartTime, selectEndTime= start, end

            chazhi = (end - start).days + 1

            userRead = []
            workbook, sheet = self.createWorkbook(u"Sheet1")
            path = tempfile.gettempdir() + u"/考勤.xls"

            all = 100
            molecular = all * 0.05
            schedule = (molecular / all) * 100
            paln = {
                u"plan.schedule": int(schedule),
                u"plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, paln)

            tableRow = 0#横坐标
            tableCol = 3#纵坐标

            dataRow = 1#数据横坐标

            self.mongodbPool()

            mongo = self.mongodb.attendance # 连接attendance数据库，没有则自动创建
            myMongoDB = mongo.ac2019  # 连接attendance数据库下ac2019表，没有则自动创建

            mongoCol = 3  # 纵坐标

            for i in range(0, chazhi):

                startYMDKEY = start.strftime('%y%m%d')

                # 创建表头
                self.writeWorkbook(sheet, tableRow, tableCol,u"%s月%s日" % (startYMDKEY[2:4],startYMDKEY[4:]))
                sheet.write(0, 0, u"工号")
                sheet.write(0, 1, u"姓名")
                sheet.write(0, 2, u"班次")
                tableCol+=1
                start = start + datetime.timedelta(days=1)

            for v in myMongoDB.aggregate([{'$match': {'creatrTime': {'$gte': selectStartTime, '$lte': selectEndTime}}}]):

                userId = v["userId"]
                userName = v["userName"]
                shangban = v["onduty"]
                xiaban = v["offduty"]
                creatrTime = v["creatrTime"]

                shangban = self.wokerType(shangban)
                xiaban = self.wokerType(xiaban)

                dataTime = (creatrTime-selectStartTime).days#脚本结束时间-开始时间 -----天数 #日期相差几天
                mDataCol = mongoCol + dataTime #数据纵坐标

                if shangban == u"正常" or xiaban == u"正常":
                    style0 = xlwt.easyxf('font: name Times New Roman, color-index black, bold on',num_format_str='#,##0.00')
                if shangban != u"正常" or xiaban != u"正常":
                    style0 = xlwt.easyxf('font: name Times New Roman, color-index red, bold on',num_format_str='#,##0.00')

                if userId not in userRead:
                    userRead.append(userId)

                    self.writeSheetPage(sheet, dataRow, 0, userId)
                    self.writeSheetPage(sheet, dataRow, 1, u"%s" % userName)
                    self.writeSheetPage(sheet, dataRow, 2, u"上班")
                    self.writeSheetPage(sheet, dataRow + 1, 2, u"下班")
                    self.writeSheetPage(sheet, dataRow, mDataCol, shangban,  style0)
                    self.writeSheetPage(sheet, dataRow + 1, mDataCol, xiaban,  style0)
                    dataRow += 2
                else:
                    index = userRead.index(userId)
                    index *= 2
                    self.writeSheetPage(sheet, index + 1, mDataCol, shangban, style0)
                    self.writeSheetPage(sheet, index + 2, mDataCol, xiaban, style0)
                    mDataCol+=1

                molecular = (molecular + len(userRead))/10
                schedules = (molecular / all) * 100

                paln = {
                    u"plan.schedule": int(schedules),
                }

                self.updataSchedule(self.pthost, pid, paln)

            self.saveWorkbook(path, workbook)

            url = self.media + u"uploadOther.do"
            resultfilepath = self.uploudFile(path, url)

            self.delFile(path)

            paln = {
                u"plan.resultFilepath": resultfilepath
            }

            self.updataSchedule(self.pthost, pid, paln)

            eTime = datetime.datetime.now()
            print (u"执行完毕,总耗时(s): %s" % (eTime - sTime).seconds)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost,self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)

            sys.exit(0)


if __name__ == '__main__':
    """
     1.脚本说明:
        配合crond_attendance.py合并指定时间的考勤文件,在mongoDB导出数据生成一个新的文件
        上传合并文件到服务器中后删除临时文件
        状态:正常--灰色
            异常--黄色
     3.例:
        1.  最多支持导出31天的数据
        Python plan_merge_personel_attendance.py <pid><手动输入时间>手动指定时间
               plan_merge_personel_attendance.py 142   2018/05/01-2018/05/05 
        2.
           任务计划中参数请填写
           例如: 
            1.指定日期: 2019/02/14-2019/02/20

     3.导出结果:
        员工号    姓名      xx月xx号      xx月xx号        ....
        FL-0001  王xx    正常,迟到  正常,正常     ....
        FL-0002  李xx    正常,正常  正常,正常     ....
     4. 异常处理
         在当出现异常时,跟新状态为失败将异常记录到log文件中,最后上传,并删除临时文件
    """
    modernFilePath = os.path.realpath(__file__)
    filepath = os.path.dirname(modernFilePath)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")
    merge = Merge(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"), config.get('mongoDB'), filepath)

    pid = sys.argv[1]
    args = sys.argv[2]
    times = args.split("-")
    startTime = times[0]
    endTime = times[1]

    merge.main(pid, startTime, endTime)