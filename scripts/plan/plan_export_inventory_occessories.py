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
        
        self.costType = {
            "0": "车运费",
            "1": "搬运费",
            "2": "上楼费",
        }

        self.colum = u"""
            o.no AS `外辅单号`,
            d.orderId AS `装修单号`,
            su.currentName AS `监理姓名`,
            CONCAT(v.name, h.houseNumber) AS `楼盘地址`,
            h.buildArea AS `建筑面积`,
            g.no AS `商品编号`,
            g.name AS `商品名称`,
            g.measurementUnit AS `单位`,
            oi.num AS `数量`,
            oi.sennum AS `送货数量`,
            oc.price AS `费用金额`,
            oc.type AS `类型`,
            c.name AS `公司`,
            up.currentName AS `厂商`
        """
        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                inventory.occessories o
                left join inventory.occessoriescost oc on o.oid = oc.oid,
                inventory.occessoriesItem oi,
                communion.company c,
                communion.village v,
                communion.house h,
                data.goods g,
                communion.user up,
                communion.user su
            WHERE
                o.oid = oi.oid
                AND o.spuid = up.uid
                AND o.svuid = su.uid
                AND d.company = c.cid
                AND o.orderId = d.orderId
                AND d.hid = h.hid
                AND v.vid = h.vid
                AND oi.gid = g.gid
                AND o.createTime >= '%s 00:00:00'
                AND o.createTime <= '%s 23:59:59'
        """

    def main(self, pid, args):
        
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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime)
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

            sql = self.SQL_QUERY % (self.colum, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"外辅单")

            tableHead = [
                u"外辅单号", u"装修单号", u"监理姓名", u"楼盘地址", u"建筑面积", u"商品编号", u"商品名称", u"单位", u"数量", 
                u"送货数量", u"费用金额", u"类型", u"公司", u"厂商"
            

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    self.divNum(data, [4, 8, 9, 10])
                    
                    data[11] = self.costType[data[11]]
                    
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
        导出外辅单脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅单;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.company     公司:1
        2.脚本传参说明:
             plan_Export_Inventory_Occessories.py pid   company
             plan_Export_Inventory_Occessories.py 929      1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]

    # pid = 1482
    # args = "2021/01/01-2021/09/24"

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args)
