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
            rt. NAME 名称,
            rt. NO 键值,
            rt.type 类型,
            rt.fund 资金类型,
            rt. STATUS 状态,
            rt.grade 等级,
            rt.kibalance 结算方式,
            rt.kiname 金蝶名称,
            rt.kino 金蝶编号,
            rt.bankno 银行卡,
            co. NAME 公司
        """
        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM 
                data.receipttype rt,
                communion.company co
            WHERE 
                rt.company = co.cid
        """

    def main(self, pid):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SQL_QUERY % ("count(*)")
            
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

            sql = self.SQL_QUERY % (self.colum)

            workbook, sheet = self.createWorkbook(u"集团收据类型")

            tableHead = [u"名称", u"键值", u"类型", u"资金类型", u"状态", u"等级", u"结算方式", u"金蝶名称", u"金蝶编号", u"银行卡", u"公司"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)
                    rows[2] = self.reType[rows[2]]
                    rows[3] = self.reFund[rows[3]]
                    rows[4] = self.reStatus[rows[4]]

                    self.createTableHead(sheet, rows, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                paln = {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                }
                self.updataSchedule(self.pthost, pid, paln)

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
        导出外辅单脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅单;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.company     公司:1
        2.脚本传参说明:
             plan_export_data_receipt_type.py pid   company
             plan_export_data_receipt_type.py 929      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    
    # pid = 3734
    
    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid)
