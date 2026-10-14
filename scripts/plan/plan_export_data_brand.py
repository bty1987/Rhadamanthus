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
            b.name '品牌',
            b.kino '金蝶编号',
            b.kiname '金蝶名称',
            c.name '品类',
            c.kino '金蝶编号',
            c.kiname '金蝶名称',
            s.currentname '厂商',
            co.name '公司'
        """
        self.SQL_QUERY = u"""
            SELECT 
                %s
            FROM 
                communion.brand b
                left join communion.category c on b.cid = c.cid
                left join communion.company co on b.company = co.cid
                left join communion.USER s on b.ocuid = s.uid
            WHERE 
                b.company = %s
        """

    def main(self, pid, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SQL_QUERY % ("count(*)", company)
            
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

            sql = self.SQL_QUERY % (self.colum, company)
            print(sql)

            workbook, sheet = self.createWorkbook(u"品牌信息")

            tableHead = [u"品牌名称", u"品牌金蝶编号", u"品牌金蝶名称", u"品类名称", u"品类金蝶编号", u"品类金蝶名称", u"现用名", u"公司"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):

                    rows = list(v)

                    self.createTableHead(sheet, rows, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

                nowPage = nowPage + 1

                if len(data) < self.size:
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
        导出品牌脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅单;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.company     公司:1
        2.脚本传参说明:
             plan_export_data_brand.py pid   company
             plan_export_data_brand.py 929      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")
    
    # pid = 3734
    # company = 1
    
    if len(sys.argv) == 3:
        pid = sys.argv[1]
        company = sys.argv[2]
    elif len(sys.argv) == 4:
        pid = sys.argv[1]
        company = sys.argv[3]
    
    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, company)
