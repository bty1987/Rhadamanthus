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

        self.stateType = {
            0: u"到店",
            1: u"定金",
            2: u"签单",
            3: u"抽奖",
            4: u"特批",
            5: u"购买(过时)",
            6: u"其他(过时)",
            7: u"升级",
            8: u"折现",
            9: u"签单抽奖",
            10: u"活动抽奖",
            11: u"签单特批",
            12: u"活动特批"
        }

        self.colum = u"""
            aws.no,
            dai.orderId,
            v.name,
            h.houseNumber,
            dai.activityName,
            communion.kv('decoration', 'decorationactivityitem', 'statetype', dai.statetype) '状态',
            communion.kv('decoration', 'decorationactivityitem', 'status', dai.state) '状态类型',
            aws.name,
            aws.format,
            communion.kv('information', 'awardstock', 'status', aws.status) '状态',
            communion.kv('information', 'awardstock', 'storeroom', aws.storeroom) '库房',
            communion.kv('information', 'awardstock', 'type', aws.type) '类型',
            communion.kv('information', 'awardstock', 'subtype', aws.subtype) '子类',
            communion.kv('information', 'awardstock', 'isPrefor', aws.isPrefor) '业绩标识',
            dai.money,
            dai.num,
            (dai.num * dai.money / 1000),
            du.currentName,
            dem.name,
            de.name,
            u.currentName,
            d.depositTime,
            d.precontractTime,
            d.contractTime
        """

        self.SQL_Delivery_Funds = u"""
            SELECT
                %s
            FROM
                decoration.decorationactivityitem AS dai
                LEFT JOIN information.awardstock AS aws ON dai.asid = aws.asid
                LEFT JOIN decoration.decoration AS d ON d.orderId = dai.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS u ON dai.ruid = u.uid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS de ON de.did = du.deptId
                LEFT JOIN communion.department AS dem ON dem.did = de.fdid
            WHERE
                aws.company = %s AND 
                %s
            """
            
    def datetime(self, type, beginTime, endTime):
        
        _type = "d.contractTime"
        
        if type == "0":
            _type = "d.contractTime"
        elif type == "1":
            _type = "d.precontractTime"
        elif type == "2":
            _type = "d.accountTime"
            
        return "%s >= '%s 00:00:00' AND %s <= '%s 23:59:59' ORDER BY %s ASC" % (_type, beginTime, _type, endTime, _type)

    def main(self, pid, type, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            pageflag = True
            startTime, endTime = args.split("-")
            
            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_Delivery_Funds % ("count(*)", company, self.datetime(type, startTime, endTime))

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

            sql = self.SQL_Delivery_Funds % (self.colum, company, self.datetime(type, startTime, endTime))

            workbook, sheet = self.createWorkbook(u"奖品配送")

            tableHead = [
                u"编号", u'装修单号', u'楼盘', u'楼号', u"活动名称", u"状态", u"状态类型", u"名称", u"状态", u"规格", 
                u"库房", u"奖品类型", u"子类", u'业绩标识', u'单价', u'数量', u'总额', u'设计师', u"设计分区", u"设计部", 
                u"操作人", u"定金时间", u"预签时间", u"签单时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    self.divNum(data, [14, 15, 16])

                    data[15] = int(data[15])

                    self.createTableHead(sheet, data, count)

                    count += 1

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
        导出奖品配送脚本说明:
        根据查询条件,以分页拿数据的方式导出库存记录;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_information_awardRecord.py pid     args             company
             plan_export_information_awardRecord.py 929 2018/12/01-2018/12/31 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args, int(company))
