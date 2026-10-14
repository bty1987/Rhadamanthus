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

        self.column = u"""
            u.username,
            u.userid,
            d.name,
            u.phone,
            u.identity,
            ui.bankCardNum,
            co.name,
            u.status
        """

        self.SQL_Sales_Funds = u"""
            SELECT
                %s
            FROM
                communion.user u,
                communion.department d,
                communion.userinfo ui,
                communion.company co 
            WHERE
                u.deptid = d.dId AND
                u.uid = ui.uid AND
                u.company = co.cid AND
                d.type = 8 
        """

    def main(self, pid):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SQL_Sales_Funds % ("count(*)")

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

            sql = self.SQL_Sales_Funds % (self.column)

            workbook, sheet = self.createWorkbook(u"工人信息")

            tableHead = [u"姓名", u"工号", u"部门", u"电话号", u"身份证", u"银行卡", u"公司", u'状态']

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    
                    data = list(v)

                    data[7] = self.userStatus[data[7]]

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

            filename = str(int(time.time() * 1000))
            tmppath = tempfile.gettempdir()
            xlspath = u"%s/%s.xls" % (tmppath, filename)
            zippath = u"%s/%s.zip" % (tmppath, filename)

            self.saveWorkbook(xlspath, workbook)

            os.system("zip -P %s -j %s %s" % (pid.zfill(8)[::-1], zippath, xlspath))

            resultfilepath = self.uploudFile(zippath, self.media + u"uploadOther.do")

            self.delFile(xlspath)
            self.delFile(zippath)

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
            导出导出工人信息脚本说明:
            根据查询条件,以分页拿数据的方式导出工人信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(pid)
