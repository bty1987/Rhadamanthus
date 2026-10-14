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
            rdo.s0 AS `装修单号`,
            rdo.s1 AS `预签时间`,
            rdo.s2 as `签单时间`,
            rdo.s3 AS `决算时间`,
            rdo.s4 AS `订单类型`,
            rdo.s5 AS `房屋类别`,
            rdo.s6 AS `非业务提成`,
            rdo.s7 AS `非业务比例`,
            rdo.s8 AS `预签额`,
            rdo.s9 AS `签单额`,
            rdo.s10 AS `实收额`,
            rdo.s11 AS `计业绩券`,
            rdo.s12 AS `计金额券`,
            rdo.s13 AS `特批券`,
            rdo.s14 AS `物品`,
            rdo.s15 AS `服务费`,
            rdo.s16 AS `主材总额`,
            rdo.s17 AS `最终签单额`,
            rdo.s18 AS `设计费`,
            rdo.s19 AS `报价总额`,
            rdo.s20 AS `折前总价`,
            rdo.s21 AS `不打折总额`,
            rdo.s22 AS `打折总额`,
            rdo.s23 AS `车运费`,
            rdo.s24 AS `管理费`,
            rdo.s25 AS `管理费提点`,
            rdo.s26 AS `运输费`,
            rdo.s27 AS `业务类型`,
            rdo.s28 AS `工程状态`,
            su.currentName AS `监理`,
            rdo.s30 AS `付款比例`,
            rdo.s31 AS `订单等级`,
            qu.currentName AS `报价员`,
            rdo.s33 AS `房屋类型`,
            rdo.s34 AS `首付款`,
            rdo.s35 AS `收款时间`,
            rdo.s36 AS `券值`,
            rdo.s37 AS `券信息`,
            rdo.s38 AS `首付二期款`,
            rdo.s39 AS `收款时间`,
            rdo.s40 AS `券值`,
            rdo.s41 AS `券信息`,
            rdo.s42 AS `二期款`,
            rdo.s43 AS `收款时间`,
            rdo.s44 AS `券值`,
            rdo.s45 AS `券信息`,
            rdo.s46 AS `尾款`,
            rdo.s47 AS `尾款时间`,
            rdo.s48 AS `券值`,
            rdo.s49 AS `券信息`,
            rdo.s50 AS `违约金`,
            rdo.s51 AS `预付款余额`,
            rdo.s52 AS `未付款金额`,
            rdo.s53 AS `满减金额`,
            rdo.s54 AS `业绩归属月份`,
            rdo.s55 AS `发生月`,
            rdo.s56 AS `操作业务类型`,
            rdo.s60 AS `当前操作类型`,
            rdo.s61 AS `当前操作时间`,
            rdo.s62 AS `比例`,
            buc.`name` AS `归属人公司`,
            bu.userId AS `归属人编号`,
            bu.currentName AS `订单归属人`,
            bd.`no` AS `归属人部门编号`,
            bd.`name`AS `归属人部门`,
            br.`no` AS `归属人分区编号`,
            br.`name` AS `归属人分区`,
            v.NAME AS `楼盘`,
            h.houseNumber AS `楼号`,
            h.buildArea AS `建筑面积`,
            h.freeArea AS `赠送面积`,
            h.innerArea AS `套内面积`,
            h.totalArea AS `总面积`
        """

        self.SELECT_SQL1 = u"""
            SELECT
                %s
            FROM
                decoration.decorationoperate AS ddo,
                decoration.decoration AS d
            WHERE
                ddo.type IN (3, 5, 6)
                AND ddo.operateTime >= '%s 00:00:00' 
                AND ddo.operateTime <= '%s 23:59:59' 
                AND ddo.orderId = d.orderId
                %s
            GROUP BY
                ddo.orderId
        """


        self.SELECT_SQL2 = u"""
            SELECT
                %s
            FROM
                report.decoration7operation AS rdo
                LEFT JOIN communion.`user` AS su ON rdo.s29 = su.uid
                LEFT JOIN communion.`user` AS qu ON rdo.s32 = qu.uid ,
                decoration.decoration AS dd,
                communion.`user` AS bu,
                communion.company AS buc,
                communion.department AS bd,
                communion.department AS br,
                communion.house AS h,
                communion.village AS v
            WHERE
                rdo.s0 IN (%s)
                AND rdo.s0 = dd.orderId
                AND rdo.s57 = bu.uid 
                AND bu.company = buc.cid 
                AND rdo.s58 = bd.dId 
                AND rdo.s59 = br.dId 
                AND dd.hid = h.hid 
                AND h.vid = v.vid 

        """

    def company(self, columnCompany, company):
        if company != 0:
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

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

            sqlcount = self.SELECT_SQL1 % ("count(*)", startTime, endTime, self.company("d.company", company))

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

            sql = self.SELECT_SQL2 % (self.colum, self.SELECT_SQL1 % ("ddo.orderId", startTime, endTime, self.company("d.company", company)))

            workbook, sheet = self.createWorkbook(u"装修信息")

            tableHead = [
                 u"装修单号", u"预签时间", u"签单时间", u"决算时间", u"订单类型", u'房屋类别', u'非业务提成', u'非业务比例', u"预签额", u"签单额",
                 u"实收额", u"计业绩券" , u"计金额券", u"特批券", u"物品", u"服务费", u"主材总额", u"最终签单额", u"设计费", u"报价总额",
                 u"折前总价", u"不打折总额", u"打折总额", u"车运费", u"管理费", u"管理费提点", u"运输费", u"业务类型", u"工程状态" ,u"监理",
                 u"付款比例", u"订单等级", u"报价员", u"房屋类型", u"首付款", u"收款时间", u"券值", u"券信息", u"首付二期款", u"收款时间",
                 u"券值", u"券信息", u"二期款", u"收款时间", u"券值", u"券信息", u"尾款", u"尾款时间", u"券值", u"券信息",
                 u"违约金", u"预付款余额", u"未付款金额", u"满减金额", u"业绩归属月份", u"发生月", u"操作业务类型", u"当前操作类型", u"当前操作时间", u"比例",
                 u"归属人公司", u"归属人编号", u"订单归属人", u"归属人部门编号", u"归属人部门", u"归属人分区编号", u"归属人分区", u"楼盘", u"楼号", u"建筑面积",
                 u"赠送面积",u"套内面积", u"总面积", u"净业绩", u"复合业绩", u"最终净业绩", u"最终复合业绩", u"违约金比例",
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    row = list(v)

                    self.divNum(row, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 34, 36, 38, 40, 42, 44, 46, 48, 50, 51, 52, 53, 59])

                    row[4] = self.decorationType[row[4]]
                    row[56] = self.decorationOperateAtttype[row[56]]
                    row[57] = self.decorationOperateType[row[57]]

                    # 净业绩 = 签单额 - 非业务提成 - 券优惠 - 物品优化
                    row.append(row[9] - row[6] - row[11] - row[14])

                    # 复合业绩
                    # 推回8.8折合同报价=打折总额*0.88+不打折总额+车运费+管理费
                    backCal = (row[22] * 0.88 + row[21] + row[23] + row[24])

                    # 复核业绩=[(推回8.8折合同报价—非业务人员提点金额)*0.38-券-礼品+签单额-推回8.8折合同报价]/0.38
                    row.append(((backCal - row[6]) * 0.38 - row[11] - row[14] + row[9] - backCal) / 0.38)

                    # 最终净业绩 = 最终签单额 - 非业务提成 - 券优惠 - 物品优化
                    row.append(row[17] - row[6] - row[11] - row[14])

                    # 最终复核业绩=[(推回8.8折合同报价—非业务人员提点金额)*0.38-券-礼品+最终签单额-推回8.8折合同报价]/0.38
                    row.append(((backCal - row[6]) * 0.38 - row[11] - row[14] + row[17] - backCal) / 0.38)

                    # 违约金比例
                    row.append('%.1f' % ((row[50] / row[9]) * 100) + "%")

                    test_list = [8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 52, 69, 70, 71, 72, 73, 74, 75, 76]

                    self.rates(row, row[59], test_list)

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
        导出装修单信息脚本说明:
            根据查询条件,以分页拿数据的方式导出装修信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
            2.args        2018/11/01-2018/11/30
            3.company     0
        2.脚本传参说明:
            plan_export_decoration_order_operation.py  pid args
            plan_export_decoration_order_operation.py  299 2018/11/01-2018/11/30

        """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2022/11/01-2022/11/30'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, int(company))