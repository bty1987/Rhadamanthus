#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host="", username="", password="", media="", pthost="", charset="utf8"):
    
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

        self.stockType = {
            0: "入库",
            1: "出库",
            2: "盘盈",
            3: "盘亏"
        }

        self.colum = """
            aws.no,
            d.orderId,
            v.name,
            h.houseNumber,
            communion.kv('decoration', 'decoration', 'status', d.status) '装修状态',
            a.name,
            a.starttime,
            a.endtime,
            aws.name,
            aws.format,
            communion.kv('information', 'awardstock', 'storeroom', aws.storeroom) '库房',
            communion.kv('information', 'awardstock', 'type', aws.type) '类型',
            communion.kv('information', 'awardstock', 'subtype', aws.subtype) '子类',
            communion.kv('information', 'awardrecord', 'type', awr.subtype) '类型',
            communion.kv('information', 'awardrecord', 'subtype', awr.subtype) '子类',
            communion.kv('information', 'awardstock', 'isPrefor', aws.isPrefor) '业绩标识',
            awr.num,
            awr.totalPrice,
            awr.content,
            du.currentName,
            u.currentName,
            awr.operateTime,
            dai.receivetime
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                information.awardrecord AS awr
                LEFT JOIN information.awardstock AS aws ON awr.asid = aws.asid
                LEFT JOIN decoration.decoration AS d ON d.orderId = awr.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.user AS u ON awr.ouid = u.uid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN decoration.decorationactivity da on d.orderId = da.orderId
                LEFT JOIN information.activity a on da.aid = a.aid
                LEFT JOIN decoration.decorationactivityitem dai on aws.asid = dai.asid and dai.orderId = d.orderId
            WHERE
                awr.operateTime >= '%s 00:00:00' AND 
                awr.operateTime <= '%s 23:59:59' AND 
                aws.company = %s 
            """

    def main(self, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            pageflag = True
            startTime, endTime = args.split("-")
            
            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, company)

            count = self.count(sqlcount)
            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100
            
            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            sql = self.SQL_QUERY % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook("奖品库存")

            tableHead = [
                "编号", "装修单号", "楼盘", "楼号", "装修状态", "活动名", "活动开始时间", "活动结束时间", "名称", "规格", 
                "库房", "类型", "子类", "类型", "子类", "业绩标识", "单价", "数量", "总额", "说明", 
                "设计师", "操作人", "操作时间", "客户确认时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)

                    self.divNum(data, [16, 17])

                    self.createTableHead(sheet, data, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False
            
            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)


if __name__ == '__main__':

    """
        导出奖品记录脚本说明:
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

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
