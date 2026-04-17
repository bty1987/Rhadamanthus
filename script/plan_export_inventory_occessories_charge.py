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

        self.colunm = u"""
            o.no AS `外辅单号`,
            d.orderId AS `装修单号`,
            CONCAT(v.name, h.houseNumber) AS `楼盘地址`,
            su.userId AS `监理工号`,
            su.currentName AS `监理姓名`,
            o.floorNum AS `上料楼层`,
            g.no AS `商品编号`,
            g.name AS `商品名称`,
            g.measurementUnit AS `商品单位`,
            oi.num AS `数量`,
            c.name AS `公司`,
            up.currentName AS `厂商`,
            cu.currentName AS `创建人`,
            o.createTime AS `创建时间`,
            o.deliveTime AS `送货时间`,
            o.receiveTime AS `到货时间`,
            o.balanceTime AS `结算时间`,
            o.status AS `状态`,
            oi.vbalance AS `结算价`,
            oi.sennum * oi.vbalance AS `结算金额`,
            o.isLift AS `有无电梯`,
            o.isExceed AS `有无超阶`,
            o.isAttic AS `有无阁楼`,
            o.comment AS `外辅单备注`,
            o.content AS `厂商备注`,
            d.grade AS `装修单等级`,
            oi.sennum * oi.vbalance AS `材料金额`,
            oc.surplus AS `费用金额`,
            oi.sennum * oi.vbalance AS `材料结算额`,
            oc.surplus AS `费用结算额`,
            oc.name AS `费用名称`,
            oc.num AS `费用数量`,
            oc.price AS `费用单价`
        """
        
        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                inventory.occessories o,
                inventory.occessoriesItem oi,
                inventory.occessoriescharge oc,
                communion.company c,
                communion.village v,
                communion.house h,
                inventory.goods g,
                communion.user up,
                communion.user su,
                communion.user cu
            WHERE
                o.oid = oi.oid
                AND o.oid = oc.oid
                AND oi.oiid = oc.oiid
                AND o.spuid = up.uid
                AND o.svuid = su.uid
                AND o.cuid = cu.uid
                AND d.company = c.cid
                AND o.orderId = d.orderId
                AND d.hid = h.hid
                AND v.vid = h.vid
                AND oi.gid = g.gid
                AND d.company = %s
                AND o.createTime >= '%s 00:00:00'
                AND o.createTime <= '%s 23:59:59'
            ORDER BY
                oi.oiid
        """

    def main(self, pid, type, args):
        
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于90天'
                })
                return False

            sqlcount = self.SQL_QUERY % ("count(*)", type, startTime, endTime)

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

            sql = self.SQL_QUERY % (self.colunm, type, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"外辅费用")

            tableHead = [
                u"外辅单号", u"装修单号", u"楼盘地址", u"监理工号", u"监理姓名", u"上料楼层",
                u"商品编号", u"商品名称", u"商品单位", u"数量",
                u"公司", u"厂商", u"创建人", u"创建时间", u"送货时间", u"到货时间", u"结算时间", u"状态",
                u"结算价", u"结算金额",
                u"有无电梯", u"有无超阶", u"有无阁楼",
                u"外辅单备注", u"厂商备注", u"装修单等级",
                u"材料金额", u"费用金额", u"材料结算额", u"费用结算额",
                u"费用名称", u"费用数量", u"费用单价"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    # 分→元: 结算价(18), 结算金额(19), 材料金额(26), 费用金额(27), 材料结算额(28), 费用结算额(29), 费用单价(31)
                    self.divNum(data, [18, 19, 26, 27, 28, 29, 31])
                    
                    # 状态映射
                    data[17] = self.occessoriesStatus[data[17]]
                    data[20] = self.isLift[data[20]]
                    data[21] = self.isExceed[data[21]]
                    data[22] = self.isAttic[data[22]]
                    
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
        导出外辅费用脚本说明:
        根据查询条件,以分页拿数据的方式导出外辅费用;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        公司cid
            2.pid         information.plan的主键;
            3.args        "2022/03/07-2022/03/24"
        2.脚本传参说明:
             plan_export_inventory_occessories_charge.py type pid   args
             plan_export_inventory_occessories_charge.py   1  1482  "2022/03/07-2022/03/24"
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args)
