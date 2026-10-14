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

        self.column = """
            d.contractTime AS '签单时间',
            d.orderId AS '装修单号',
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            h.buildArea AS '面积',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS '装修单类型',
            cr.name AS '客户姓名',
            du.userid AS '设计师工号',
            du.currentname AS '设计师',
            dd.name AS '设计部',
            dr.name AS '设计分区',
            sv.currentname AS '监理',
            cn.name AS '工程状态',
            c.endtime AS '工程状态更新时间',
            ap.materialbalance AS '主材预付款',
            if(d.type = 0, dm.materialPrice, if(d.type = 2, dh.materialPrice, 0)) AS '主材配比',
            '' AS '总金额'
        """

        self.QUERY_SQL_STR = """
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.USER du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.USER sv ON d.svuid = sv.uid
                LEFT JOIN communion.customer cr ON d.customerid = cr.cid
                LEFT JOIN DATA.constructionnode cn ON d.projectStatus = cn.cnid
                LEFT JOIN payment.advancepayment ap ON d.orderId = ap.orderId
                LEFT JOIN construction.construction c ON d.orderId = c.orderId 
                LEFT JOIN decoration.decorationmidpack dm ON d.orderId = dm.orderId
                LEFT JOIN decoration.decorationinclusive di ON d.orderId = di.orderId
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
            WHERE
                d.contractTime >= '%s 00:00:00' AND 
                d.contractTime <= '%s 23:59:59' AND 
                d.company = %s
        """

        self.QUERY_CATEGORY_SQL_STR = """
            SELECT
                CONCAT( b.name, '(内)' ) AS 'brand',
                ca.name,
                IF(sp.type in (4, 5, 6, 7), -sp.referMoney, sp.referMoney),
                sp.type
            FROM
                payment.salespayment sp,
                sales.sales s,
                communion.brand b,
                communion.category ca 
            WHERE
                s.orderId = '%s' AND 
                s.sid = sp.sid AND 
                s.status IN (0, 5) AND 
                sp.status IN (1, 2) AND 
                s.bid = b.bid AND 
                b.cid = ca.cid;
        """

        self.QUERY_CATEGORY_OALES_STR = """
            SELECT
                CONCAT( o.brand, '(外)' ) AS 'brand',
                o.category,
                0,
                o.atttype 
            FROM
                sales.oales o 
            WHERE
                o.STATUS IN (2, 4) AND 
                o.orderId = '%s'
        """

    def createTableHead(self, sheet, tableHeadList, num=0):
    
        count = 0
        
        for v in tableHeadList:
        
            ta = " " if v == None else v
            tableName = "%s" % ta

            self.writeWorkbook(sheet, num, count, tableName)
            count += 1

    def main(self, type, pid, args, company):
    
        try:
        
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            startTime, endTime = args.split("-")

            checkFlag = self.controlTime(startTime, endTime)
            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.QUERY_SQL_STR % ("count(*)", startTime, endTime, company)
            count = self.count(sqlcount)
            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "无可导出数据"
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            workbook, sheet = self.createWorkbook("主材信息")

            sql = self.QUERY_SQL_STR % (self.column, startTime, endTime, company)

            tableHead = [
                "签单时间", "装修单号", "楼盘", "楼号", "面积", "装修单类型", "客户姓名", "设计师工号", "设计师", "设计部",
                "设计分区", "监理", "工程状态", "工程状态更新时间", "主材预付款", "主材配比", "总金额"
            ]
            categorys = [
                '电梯', '门窗', '地热', '新风', '空调', '瓷砖', '五金', '木门', '美缝剂', '石材', 
                '壁纸', '硅藻泥', '地板', '板式家具', '油漆家具', '吊顶', '浴屏', '卫浴', '橱柜', '电器', 
                '水槽', '净水器', '开关', '灯具', '晾衣架', '垃圾处理器', '提升泵', '软包', '软装', '家具', 
                '其他', '榻榻米', '楼梯', '窗帘', '饰品', '幕墙', '楼板', '马赛克', '铁艺', 
                '防水', '隔断', '排污泵'
            ]
            dictionary = {}

            count = 1
            nowPage = 1
            pageflag = True
            
            while pageflag:

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    rows = list(v)

                    sql_categorys = self.QUERY_CATEGORY_SQL_STR % (rows[1])
                    categorys_Date = self.executeQuerySQL(sql_categorys)

                    oales_categorys = self.QUERY_CATEGORY_OALES_STR % (rows[1])
                    oales_Date = self.executeQuerySQL(oales_categorys)

                    categorys_Date = categorys_Date + oales_Date

                    totalAmount = 0
                    new_category = []
                    cate = []
                    result = ['' for x in range(len(categorys))]

                    for j, k in enumerate(categorys_Date):
                    
                        row_ca = list(k)
                        
                        category = (row_ca[0] + row_ca[1])
                        
                        if row_ca[1] not in categorys:
                            continue
                            
                        index = categorys.index(row_ca[1])
                        
                        if row_ca[1] in cate:
                            if category in new_category:
                                category = 0
                            else:
                                value = dictionary.get(row_ca[1])
                                dictionary[row_ca[1]] = (category + "/" + value)
                        else:
                            dictionary[row_ca[1]] = category

                        result[index] = dictionary[row_ca[1]]
                        new_category.append(category)
                        cate.append(row_ca[1])
                        totalAmount = row_ca[2] + totalAmount
                        
                    rows = rows + result
                    rows[16] = float(totalAmount)

                    self.divNum(rows, [4, 14, 15, 16])

                    if type == "1":
                        rows[14] = 0
                        rows[15] = 0
                        rows[16] = 0

                    self.createTableHead(sheet, rows, count)
                    count += 1

                tableHead = tableHead + categorys
                nowPage = nowPage + 1
                if len(data) < self.size:
                    pageflag = False

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

            self.createTableHead(sheet, tableHead)
            
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
        装修单主材信息脚本说明:
            根据查询条件,以分页形式导出装修单主材信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        2022/12/01-2022/12/31
            3.company     公司:1
        2.命令使用 plan_export_sales_decoration_brand_amount.py  pid  args                  company
                   plan_export_sales_decoration_brand_amount.py  4070 2022/12/01-2022/12/31 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    # type = 1
    # pid = 4963
    # args = "2023/10/01-2023/10/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))