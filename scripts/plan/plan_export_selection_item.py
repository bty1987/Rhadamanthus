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
        self.size = 400

        self.colunm = """
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '地址',
            su.userId AS '业务员工号',
            su.currentName AS '业务员',
            du.userId AS '设计师工号',
            du.currentName AS '设计师',
            dd.name AS '设计部',
            dr.name AS '设计分区',
            d.contractTime AS '签单时间',
            d.precontractTime AS '预签时间',
            d.accountTime AS '决算时间',
            c.createTime AS '开工时间',
            h.buildArea AS '建筑面积',
            h.freeArea AS '赠送面积',
            h.innerArea AS '套内面积',
            h.houseType AS '户型',
            g.no AS '商品编号',
            g.name AS '商品名称',
            g.category AS '品类',
            g.brand AS '品牌',
            si.type AS '选材类型',
            si.num AS '选材数量',
            si.refnum AS '退货数量',
            si.num-si.refnum AS '剩余数量',
            si.initnum AS '工程量',
            si.preprice AS '报价项单价',
            si.postprice AS '结算价',
            si.balanceTime AS '结算时间',
            si.status AS '状态',
            si.comment AS '备注',
            si.areaName AS '功能区',
            si.preprice AS '预算金额',
            bu.currentName AS '结算人',
            bu.userId AS '结算人工号',
            ju.currentName AS '监理',
            ju.userId AS '监理工号',
            si.finishTime AS '完结时间',
            ocu.currentName AS '供应商',
            co.name AS '公司',
            b.kiname AS '金蝶名称',
            b.kino AS '金蝶编号',
            communion.kv('balance', 'balance', 'ispay', b.ispay) '付款状态',
            b.payedtime '付款时间'
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                quotation.selectionitem si
                LEFT JOIN quotation.selection s ON si.sid = s.sid
                LEFT JOIN data.goods g ON si.gid = g.gid
                LEFT JOIN decoration.decoration d ON si.orderId = d.orderId
                LEFT JOIN construction.construction c ON d.orderId = c.orderId
                LEFT JOIN construction.acceptance ca ON d.orderId = ca.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user su ON d.smuid = su.uid
                LEFT JOIN communion.user bu ON si.buid = bu.uid
                LEFT JOIN communion.user ju ON d.svuid = ju.uid
                LEFT JOIN communion.brand b ON g.bid = b.bid 
                LEFT JOIN communion.user ocu ON b.ocuid = ocu.uid
                LEFT JOIN communion.company co ON d.company = co.cid
                LEFT JOIN balance.balanceselectionitem bsi ON si.siid = bsi.siid
                LEFT JOIN balance.balanceselection bs ON bsi.bsid = bs.bsid
                LEFT JOIN balance.balance b ON bs.bid = b.bid
            WHERE
                %s
                %s
        """

    def datetime(self, type, beginTime, endTime):
            
        if type == "0":
            _type = "si.balanceTime"
        elif type == "1":
            _type = "si.createTime"
        elif type == "2":
            _type = "si.finishTime"
        elif type == "3":
            _type = "d.accountTime"
        elif type == "4":
            _type = "ca.acceptanceTime"
        else:
            return " "

        return "%s >= '%s 00:00:00' AND %s <= '%s 23:59:59'" % (_type, beginTime, _type, endTime)

    def company(self, cloumCompany, company):
        if company != 0:
            companyId = "AND %s = %s" % (cloumCompany, company)
        else:
            companyId = " "

        return companyId

    def main(self, pid, type, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '时间范围大于31天'
                })
                return False
                
            timeColumn = self.datetime(type, startTime, endTime)
            
            if timeColumn == ' ':
                print("Date or Time is Empty")
                raise RuntimeError(u'时间应在1-31内')

            path = tempfile.gettempdir() + "/selectionItem.xls"

            sqlcount = self.SQL_QUERY % ("count(*)", timeColumn, self.company("si.company", company))

            count = self.count(sqlcount)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            paln = {
                "plan.schedule": schedule,
                "plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, paln)

            sql = self.SQL_QUERY % (self.colunm, timeColumn, self.company("si.company", company))

            workbook, sheet = self.createWorkbook("选材结算导出")

            tableHead = [
                "装修单号", "楼盘", "地址", "业务员工号", "业务员", "设计师工号", "设计师", "设计部", "设计分区", "签单时间",
                "预签时间", "决算时间", "开工时间", "建筑面积", "赠送面积", "套内面积", "户型", "商品编号", "商品名称", "品类", 
                "品牌", "选材类型", "选材数量", "退货数量", "剩余数量", "工程量", "报价项单价", "结算价", "结算时间", "状态", 
                "备注", "功能区", "预算金额", "结算人", "结算人工号", "监理", "监理工号", "完结时间", "供应商", "公司", 
                "金蝶名称", "金蝶编号", "付款状态", "付款时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)

                    self.divNum(data, [13, 14, 15, 22, 23, 24, 25, 26, 27])

                    data[21] = self.selectionType[data[21]]
                    data[29] = self.selectionStatus[data[29]]

                    self.createTableHead(sheet, data, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                paln = {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                }
                self.updataSchedule(self.pthost, pid, paln)

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导出选材项脚本说明:
            根据查询条件,以分页拿数据的方式导出选材项;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        结算时间 0/创建时间 1/完结时间 2
            2.pid         information.plan的主键;
            3.args        "2020/06/01-2020/06/30"
            4.company     公司:1

        2.使用
            python plan_export_selection_item.py type pid args company
            python plan_export_selection_item.py 1 942 2020/06/01-2020/06/30 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, type, args, int(company))
