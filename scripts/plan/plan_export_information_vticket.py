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
            t.tno,
            bu.currentName,
            bd.name,
            br.name,
            t.orderId,
            v.name,
            c.name,
            cp.phone,
            t.isregist,
            t.iscome
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM 
                information.vticket t 
                LEFT JOIN communion.user bu ON t.buid = bu.uid
                LEFT JOIN communion.department bd ON t.did = bd.did
                LEFT JOIN communion.department br ON t.rid = br.did
                LEFT JOIN decoration.decoration d ON t.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.customer c ON d.customerId = c.cid
                LEFT JOIN communion.customerphone cp ON d.customerId = cp.cid AND cp.defaults = 1
            WHERE
                t.expire = 0
        """

    def main(self, pid):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SELECT_SQL % ("count(*)")

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

            sql = self.SELECT_SQL % (self.colum)

            workbook, sheet = self.createWorkbook(u"大活动票")

            tableHead = [u"票号", u"操作人", u"部门", u"分区", u"装修单号", u"楼盘名称", u'客户姓名', u'客户电话', u'是否注册', u'是否到场']

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    data[8] = self.vticketIsregist[data[8]]
                    data[9] = self.vticketIscome[data[9]]

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
        2.脚本传参说明:
             plan_export_information_awardStock.py pid
             plan_export_information_awardStock.py 929
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid)