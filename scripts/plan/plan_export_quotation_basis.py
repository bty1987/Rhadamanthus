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
            d.orderId AS '装修单号',
            h.houseNumber AS '楼号',
            v.`name` AS '楼盘',
            d.type AS '订单类型',
            h.buildArea AS '建筑面积',
            h.innerArea AS '套内面积',
            h.freeArea AS '赠送面积',
            h.totalArea AS '总面积',
            d.couponCut AS '优惠券总额',
            c.`name` AS '公司',
            q.managePrice AS '管理费'
        """

        self.SQL_EXPORT_DECORATION = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN quotation.quotation AS q ON d.orderId = q.orderId
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.company c ON d.company = c.cid
            WHERE
                d.contractTime >= '%s 00:00:00' AND 
                d.contractTime <= '%s 23:59:59' AND
                d.status in (3, 7)
                %s
        """

        self.quotation = u"""
            SELECT
                q.qid,
                q.trafficPrice
            FROM
                quotation.quotation q
            WHERE
                q.orderId = '%s' AND
                q.defaults = 1;
        """

        self.quotationfunctionarea = u"""
            SELECT
                qfa.qfaid,
                `index`
            FROM
                quotation.quotationfunctionarea qfa
            WHERE
                qfa.quotationId = %s;
        """

        self.sum = u"""
            SELECT
                sum(i.initnum * i.unitprice)/1000,
                sum(IF (i.discount = 1,i.initnum * i.unitprice,0))/1000,
                sum(IF (i.discount = 0,i.initnum * i.unitprice,0))/1000
            FROM
                quotation.quotationfunctionareaitem%s i
            WHERE
                i.quotationFunctionAreaId IN (%s) AND
                i.subtype = 1;
        """

        self.addExtension = u"""
            SELECT
                sum(ei.num * ei.unitprice)/1000
            FROM
                quotation.extension e
                LEFT JOIN quotation.extensionitem ei ON e.eid = ei.eid
            WHERE
                e.orderId = '%s' AND 
                e.type = 0 AND
                ei.subtype = 1;
        """

        self.reduceExtension = u"""
            SELECT
                SUM(ei.num * ei.unitprice)/1000
            FROM
                quotation.extension e
                LEFT JOIN quotation.extensionitem ei ON e.eid = ei.eid
            WHERE
                e.orderId = '%s' AND
                e.type = 1 AND
                ei.subtype = 1;
        """

    # 获取报价车运费值和报价ID
    def handleQuotation(self, orderId):

        sql_quotation = self.quotation % (orderId)
        quotation_data = self.executeQuerySQL(sql_quotation)

        if quotation_data != () and quotation_data[0][1] != None:
            return quotation_data[0]

    # 获取基础报价额/不打折总额/打折总额
    def handleSumPrice(self, quotationId):

        quotation_data = self.quotationfunctionarea % (quotationId)
        quotationfunctionarea_data = self.executeQuerySQL(quotation_data)
        dic = {}
        arr = []
        for i, v in enumerate(quotationfunctionarea_data):
            arr.append(v[0])
            dic = {"index": v[1], "value": arr}
        index = dic['index']
        quotationFunctionAreaId = ",".join([str(x) for x in dic['value']])
        sumSql = self.sum % (index, quotationFunctionAreaId)
        sumData = self.executeQuerySQL(sumSql)
        data = list(sumData[0])

        basisPrice = data[0]  # 基础报价额
        noDisPrice = data[2]  # 不打折总额
        disPrice = data[1]  # 打折总额

        return basisPrice and basisPrice or 0, noDisPrice and noDisPrice or 0, disPrice and disPrice or 0

    # 扩展增额
    def handleAddExtension(self, orderId):

        sql_add = self.addExtension % (orderId)
        add_data = self.executeQuerySQL(sql_add)

        addPrice = add_data[0][0]

        return addPrice and addPrice or 0

    # 扩展减额
    def handleReduceExtension(self, orderId):

        sql_reduce = self.reduceExtension % (orderId)
        reduce_data = self.executeQuerySQL(sql_reduce)

        reducePrice = reduce_data[0][0]

        return reducePrice and reducePrice or 0

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

            sqlcount = self.SQL_EXPORT_DECORATION % ("count(*)", startTime, endTime, self.company(u"d.company", company))
                
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

            plan = {
                u"plan.schedule": schedule,
                u"plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, plan)

            params = self.createWorkbook(u"报价基础工程信息")
            workbook = params[0]
            sheet = params[1]

            tableHead = [u"装修单号", u"楼号", u"楼盘", u"订单类型", u"建筑面积", u"套内面积", u"赠送面积", u"总面积", u"优惠券总额", u"公司", u"管理费", u"基础报价额",
                         u"扩展增额", u"扩展减额", u"不打折总额", u"打折总额", u"车运费"]

            self.createTableHead(sheet, tableHead)

            path = tempfile.gettempdir() + u"/quotation.xls"
            self.saveWorkbook(path, workbook)

            sql = self.SQL_EXPORT_DECORATION % (self.column, startTime, endTime, self.company(u"d.company", company))

            nowPage = 1
            length = 1
            flag = True

            while flag:

                rows = self.page(sql, nowPage, self.size)
                
                for i, v in enumerate(rows):
                
                    price = self.handleQuotation(v[0])  # 车运费
                    sumPrice = self.handleSumPrice(price[0])  # 基础报价额/不打折总额/打折总额
                    addExtensionPrice = self.handleAddExtension(v[0])  # 扩展增额
                    reduceExtensionPrice = self.handleReduceExtension(v[0])  # 扩展减额

                    datas = (sumPrice[0], addExtensionPrice, reduceExtensionPrice, sumPrice[1], sumPrice[2], price[1])
                    temp = tuple(v) + tuple(datas)
                    data = list(temp)
                    self.divNum(data, [4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16])
                    data[3] = self.decorationType[data[3]]

                    self.createTableHead(sheet, data, length)

                    length = length + 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                plan = {
                    u"plan.schedule": int(schedules)
                }

                self.updataSchedule(self.pthost, pid, plan)

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
      报价基础工程信息统计脚本说明:
          根据查询条件,以分页形式导出报价基础工程信息统计信息;并上传到文件服务器中,可从任务页面上点击下载即可;
          当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
      1.传入必须参数说明
          1.pid         information.plan的主键;
          2.args        2020/08/01-2020/08/30
          3.company     公司:1
      2.命令使用 plan_export_quotation_basis.py  pid args company
                 plan_export_quotation_basis.py  299 2020/08/01-2020/08/30 1

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
