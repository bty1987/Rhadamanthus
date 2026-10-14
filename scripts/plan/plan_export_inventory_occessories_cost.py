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
        self.size = 300

        self.column = u"""
            d.orderId,
            o.NO,
            v.NAME,
            h.housenumber,
            d.grade,
            h.buildArea,
            co.NAME,
            sv.currentName,
            su.currentName,
            cu.currentName,
            o.createTime,
            o.deliveTime,
            o.receiveTime,
            communion.kv('inventory', 'occessories', 'status', o.status),
            communion.kv('inventory', 'occessories', 'isEnter', o.isEnter),
            communion.kv('inventory', 'occessories', 'isAttic', o.isAttic),
            communion.kv('inventory', 'occessories', 'isExceed', o.isExceed),
            communion.kv('inventory', 'occessories', 'isLift', o.isLift),
            o.COMMENT,
            o.content,
            oc.initprice,
            oc.price,
            oc.cost,
            communion.kv('inventory', 'occessoriesCost', 'type', oc.type)
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.occessories o,
                inventory.occessoriescost oc,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion. USER sv,
                communion. USER cu,
                communion. USER su,
                communion.company co
            WHERE
                o.receiveTime >= '%s 00:00:00'
                AND o.receiveTime <= '%s 23:59:59'
                AND o.oid = oc.oid
                AND o.orderId = d.orderId
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND d.svuid = sv.uid
                AND o.cuid = cu.uid
                AND o.spuid = su.uid
                AND o.company = co.cid
                AND o.company = %s
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
        count = 0
        for v in tableHeadList:
            ta = u" " if v == None else v
            tableName = u"%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, company)
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

            workbook, sheet = self.createWorkbook(u"外销单付款明细")

            sql = self.SQL_QUERY % (self.column, startTime, endTime, company)

            tableHead = [
                u"装修单号", u"外辅单号", u"楼盘", u"楼号", u"等级", u"建筑面积", u"公司", u"监理", u"厂商", u"创建人", u"创建时间", u"送货时间", u"到货时间", u"状态",
                u"可进园区", u"有无阁楼", u"有无超阶", u"有无电梯", u"说明备注", u"内容备注", u"原费用", u"费用", u"成本", u"类型"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            pageflag = True

            while pageflag:

                data = self.page(sql, nowPage, self.size)
                for i, v in enumerate(data):
                    rows = list(v)
                    self.divNum(rows, [5, 20, 21, 22])
                    self.createTableHead(sheet, rows, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
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
        导出外辅单费用脚本说明:
            根据查询条件,以分页形式导出外辅单费用;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/8/01-2022/8/31
            3.company     公司:1
        2.命令使用 plan_export_inventory_occessories_cost.py  pid args company
                    plan_export_inventory_occessories_cost.py  4304 2022/05/01-2022/05/31 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4304
    # args = "2022/05/01-2022/05/31"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)
