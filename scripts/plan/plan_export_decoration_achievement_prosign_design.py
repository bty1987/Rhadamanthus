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
            d.orderId AS `装修单号`,
            v.`name` AS `楼盘`,
            h.houseNumber AS `楼号`,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `类型`,
            communion.kv('decoration', 'decoration', 'status', d.status) AS `状态`,
            d.precontractTime AS `预签时间`,
            u.userId AS `设计师编号`,
            u.currentName AS `设计师`,
            dd.no AS `设计部编号`,
            dd.name AS `设计部`,
            dr.no AS `设计分区编号`,
            dr.name AS `设计分区`,
            db.rate AS `比例`,
            d.precontractPrice AS `预签额`,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.couponCut AS `券优惠`,
            d.thingCut AS `物品优惠`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                left join communion.house AS h on d.hid = h.hid
                left join communion.village AS v on h.vid = v.vid
                left join decoration.decorationbelong AS db on d.orderId = db.orderId and db.`status` = 0 and db.`type` = 0
                left join communion.`user` AS u on db.buid = u.uid
                left join communion.department AS dd on db.did = dd.did
                left join communion.department AS dr on db.rid = dr.did
                left join quotation.quotation AS q on d.orderId = q.orderId and q.defaults = 1
            WHERE
                d.precontractTime >= '%s 00:00:00' 
                AND d.precontractTime <= '%s 23:59:59'
                AND d.company = %s
        """

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

            sqlcount = self.SELECT_SQL % ("count(*)", startTime, endTime, company)

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

            sql = self.SELECT_SQL % (self.colum, startTime, endTime, company)

            workbook, sheet = self.createWorkbook(u"整装设计师签单业绩")

            tableHead = [
                u"装修单号", u"楼盘", u"楼号", u"类型", u"状态", u"预签时间", u"设计师编号", u'设计师', u'设计部编号', u'设计部',
                u"设计分区编号", u"设计分区", u"比例", u"签单额", u"净业绩"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    rows = list(v)

                    self.divNum(rows, [12, 13, 14, 15, 16])

                    rates = float(rows[12])

                    rows[13] = float(rows[13]) + float(rows[15])  # 签单总额 = 预签额 + 券优惠
                    notSalesPrice = float(rows[14]) # 非业务提成
                    couponCut = float(rows[15]) # 券优惠
                    thingCut = float(rows[16]) # 物品优惠

                    # 净业绩 = 签单总额 - 非业务提成 - 券优惠 - 物品优化
                    template = (int(rows[13]) - int(notSalesPrice) - int(couponCut) - int(thingCut)) * rates

                    row = rows[0:14]
                    row.append(template)

                    test_list = [13]

                    self.rates(row, rates, test_list)

                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage = nowPage + 1

                if len(data) < self.size:
                    flag = False

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
        整装设计师签单业绩脚本说明:
            根据查询条件,以分页拿数据的方式导出设计师签单信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2022/12/01-2022/12/30
            3.company     1
        2.脚本传参说明:
            plan_decoration_achievement_prosign_design.py  pid args company
            plan_decoration_achievement_prosign_design.py  299 2022/12/01-2022/12/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/10/01-2023/10/30'
    # company = 1
    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))