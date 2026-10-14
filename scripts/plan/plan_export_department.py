#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
    
        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.size = 400

        self.colum = u"""
            t.no AS `编号`,
            t.name AS `名称`,
            d.name AS `所属分区`,
            t.createTime AS `创建时间`,
            if(t.status = 0 , '禁用', '启用') AS `状态`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
               communion.department d 
               INNER JOIN communion.department t ON d.dId = t.fdid
            WHERE
                t.company = %s
        """

    def main(self, pid, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SELECT_SQL % ("count(*)", company)

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

            sql = self.SELECT_SQL % (self.colum, company)

            workbook, sheet = self.createWorkbook(u"部门")

            tableHead = [u"编号", u"名称", u"所属分区", u"创建时间", u"状态"]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    row = list(v)
                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    flag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                paln = {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                }
                self.updataSchedule(self.pthost, pid, paln)

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
        导出代付款信息脚本说明:
            根据查询条件,以分页拿数据的方式导出付款代理信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
        2.脚本传参说明:
            plan_export_department.py pid
            plan_export_department.py  299

        """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # company = 0

    pid = sys.argv[1]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, company)