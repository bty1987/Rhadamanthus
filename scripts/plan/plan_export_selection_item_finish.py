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
        self.size = 400

        self.colum = u"""
            g.name,
            g.brand,
            g.category,
            qs.type,
            qs.postprice,
            qs.num,
            qs.refnum,
            qs.num-qs.refnum,
            s.total,
            qs.finishTime,
            qs.orderId,
            v.name,
            h.housenumber,
            su.name
        """

        self.SELECT_SQL = u"""
            select
                %s
            from 
                quotation.selectionItem qs
                left join data.goods g on qs.gid = g.gid
                left join sales.sales s on qs.sid = s.sid
                left join decoration.decoration d on qs.orderId = d.orderId
                left join communion.house h on d.hid = h.hid
                left join communion.village v on h.vid = v.vid
                left join communion.supplier su on qs.sid = su.sid
            where
                qs.finishTime >= '%s'
                AND qs.finishTime <= '%s'
            """

    def main(self, pid,args):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime)

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"选材项导出")

            tableHead = [u"名称", u"品牌", u"品类", u"类型", u"结算价", u"数量", u'退数量', u'剩余数量', u'总金额', u'完结时间', u'装修单号', u'楼盘',u'地址', u'供应商']

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    data[3] = self.selectionType[data[3]]

                    self.createTableHead(sheet, data, count)

                    count += 1

                nowPage = nowPage + 1
                if len(rows) < self.size:
                    flag = False

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

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
        导出大活动票脚本说明:
        根据查询条件,以分页拿数据的方式导出大活动票;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2020/04/03-2020/04/13"
        2.脚本传参说明:
             plan_export_information_awardStock.py pid args
             plan_export_information_awardStock.py 929 2020/04/03-2020/04/13
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args)