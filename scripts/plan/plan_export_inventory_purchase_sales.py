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
            p.no,
            s.no,
            s.orderId,
            v.name,
            h.housenumber,
            cu.currentName,
            gu.currentname,
            iu.currentname,
            s.category,
            s.brand,
            g.no,
            g.name,
            pi.num,
            pi.inprice,
            g.measurementUnit,
            p.deliveryTime,
            p.balanceTime,
            p.status,
            p.balanceStatus,
            p.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.purchase p,
                inventory.purchaseitem pi,
                sales.sales s,
                sales.salesitem si,
                data.goods g,
                decoration.decoration d,
                communion.house h,
                communion.village v,
                communion.user gu,
                communion.user iu,
                communion.user cu
            
            WHERE
                p.pid = pi.pid AND
                pi.siid = si.siid AND
                si.sid = s.sid AND
                si.gid = g.gid AND
                s.orderId = d.orderId AND
                d.hid = h.hid AND 
                h.vid = v.vid AND
                s.guid = gu.uid AND
                s.iuid = iu.uid AND
                p.cuid = cu.uid AND
                p.createTime > '%s 00:00:00' AND 
                p.createTime < '%s 23:59:59' 
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

            countSQL = self.SQL_QUERY % (u"count(*)", startTime, endTime, self.company(u"p.company", company))

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

            params = self.createWorkbook(u"货单")
            workbook = params[0]
            sheet = params[1]

            tableHead = ["采购单号", "销售单号", "装修单号", "楼盘", "楼号", "创建人", "驻店", "导购", "品类", "品牌", "型号", "商品名", "数量", "采购价", "单位", "交货时间", "结算时间", "状态", "结算状态", "备注"]
            self.createTableHead(sheet, tableHead)
            
            sql = self.SQL_QUERY % (self.column, startTime, endTime, self.company(u"p.company", company))

            nowPage = 1
            length = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    
                    data = list(v)
                    
                    self.divNum(data, [12, 13])
                    
                    data[17]=self.purchaseStatus[data[17]]
                    data[18]=self.purchaseBalanceStatus[data[18]]

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
        * 导出采购单脚本说明:
        * 根据查询条件,以分页拿数据的方式导出货单;并上传到文件服务器中,可从任务页面上点击下载即可;
        * 当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        
        1.传入必须参数说明
            pid         information.plan的主键;
            args        "2018/12/13-2018/12/13"
            company     公司:1

        2.使用
            python plan_export_inventory_purchase_sales.py type pid args company
            python plan_export_inventory_purchase_sales.py 1 942 2018/12/13-2018/12/13 1
    """
        
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
