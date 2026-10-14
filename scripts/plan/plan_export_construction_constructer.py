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

        self.colum = u"""
            cn.orderId,
            v. NAME,
            h. houseNumber,
            deu.currentName,
            du.currentName,
            u.userId,
            u.currentName,
            cns.cnid,
            cns.startTime,
            cns.status,
            cn.createTime
         """
        self.SQL_Constructer_Funds = u"""
            select
                %s
            FROM
                construction.constructer AS cn
                LEFT JOIN decoration.decoration AS d ON cn.orderId = d.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion. user AS deu ON d.dsuid = deu.uid
                LEFT JOIN communion. user AS du ON d.svuid = du.uid
                LEFT JOIN communion. user AS u ON cn.wuid = u.uid
                LEFT JOIN construction.constructionschedule AS cns ON cn.cid = cns.cid
            WHERE
                d.company = %s
                AND cn.createTime >= '%s 00:00:00'
                AND cn.createTime <= '%s 23:59:59'
                AND cn.`schedule` = cns.`schedule`
                AND cn.status = 0
        """

    def main(self, pid, args, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            self.constructionnode(company)

            times = args.split("-")

            startTime = times[0]
            endTime = times[1]

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.SQL_Constructer_Funds % ("count(*)", company, startTime, endTime)

            count = self.count(sqlcount)
            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "无可导出数据"
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sql = self.SQL_Constructer_Funds % (self.colum, company, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"施工人员")

            tableHead = [u"装修单号", u"楼盘", u"楼号", u"设计师", u"监理", u'工人编号',
                         u"工人", u"工程环节", u"开工时间", u"状态", u"创建时间"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    if (data[7] != None):
                        data[7] = self.projectStatus[data[7]]
                    if (data[9] != None):
                        data[9] = self.constructionStatus[data[9]]


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
        导出施工人员脚本说明:
        根据查询条件,以分页拿数据的方式导出施工人员;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
        python   plan_export_construction_constructer.py pid     args      company
        python   plan_export_construction_constructer.py 1207 "2016/07/01-2016/07/30"
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
