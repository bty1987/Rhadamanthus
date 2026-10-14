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

        self.size = 300

        self.column = u"""
            ac.no AS '辅料单号',
            ac.orderId AS '装修单号',
            g.`name` AS '商品名称',
            g.category AS '品类',
            g.brand AS '品牌',
            g.measurementUnit AS '单位',
            ai.num AS '数量',
            g.pieceNum  AS '件数',
            cu.userName AS '创建人',
            ac.createTime AS '创建时间',
            ac.`schedule` AS '施工环节',
            d.`grade` AS '等级',
            ac.`comment` AS '备注'
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
             FROM 
                inventory.accessoriesitem ai,
                inventory.accessories ac,
                decoration.decoration d,
                data.goods g,
                communion.`user` cu
            WHERE
                ai.aid = ac.aid AND 
                ac.orderId = d.orderId AND 
                cu.uid = ac.cuid AND 
                ai.gid = g.gid AND 
                ac.`status` = 0 AND 
                ac.createTime >='%s 00:00:00' AND 
                ac.createTime <= '%s 23:59:59'
                %s
        """

    # 公司条件识别
    def company(self, cloumCompany, company):
        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "
        return companyId

    def main(self, pid, args, company):
    
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

            countSQL = self.SQL_QUERY % (u"count(*)", startTime, endTime, self.company(u"ac.company", company))
            count = self.count(countSQL)
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

            params = self.createWorkbook(u"辅料单(初始)")
            workbook = params[0]
            sheet = params[1]

            tableHead = [
                u"辅料单号", u"装修单号", u"商品名称", u"品类", u"品牌", u"单位", u"数量", u"件数", u"创建人", u"创建时间", 
                u"施工环节", u"等级", u"备注"
            ]
            self.createTableHead(sheet, tableHead)

            sql = self.SQL_QUERY % (self.column, startTime, endTime, self.company(u"ac.company", company))
            
            nowPage = 1
            length = 1
            flag = True
            
            while (flag):
            
                rows = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    self.divNum(data,[6,7])
                    
                    data[10] = self.projectStatus[data[10]]
                    self.createTableHead(sheet, data, length)

                    length = length + 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules)
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
        导出辅料单脚本说明:
            根据查询条件,以分页拿数据的方式导出辅料单;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1

        2.使用
            python plan_export_inventory_accessories_init.py pid args company
            python plan_export_inventory_accessories_init.py 942 2018/12/13-2018/12/13,status=0, 1
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
