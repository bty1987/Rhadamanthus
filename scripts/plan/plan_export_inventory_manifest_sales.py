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

        self.type = {
            1: u"进货",
            2: u"进退",
            3: u"出货",
            4: u"出返",
            5: u"调拨",
            6: u"采购",
            7: u"辅料",
            8: u"辅退",
            9: u"套合",
            10: u"套拆",
            11: u"盘盈",
            12: u"盘亏"
        }

        self.column = u"""
            m.code,
            m.createTime,
            m.manifestTime,
            s.no,
            d.orderId,
            v.name,
            h.housenumber,
            g.no,
            g.name,
            g.category,
            g.brand,
            c.name,
            f.info,
            g.measurementUnit,
            g.pieceNum,
            mi.num,
            ish.name,
            osh.name,
            m.type,
            mi.inprice,
            mi.outprice,
            m.`comment`,
            mi.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                inventory.manifest m,
                inventory.manifestitem mi
                LEFT JOIN inventory.storehouse ish ON mi.ishid = ish.shid
                LEFT JOIN inventory.storehouse osh ON mi.oshid = osh.shid,
                data.goods g,
                data.color c,
                data.format f,
                sales.salesitem si,
                sales.sales s,
                decoration.decoration d,
                communion.house h,
                communion.village v
            WHERE
                m.mid = mi.mid
            AND mi.siid = si.siid
            AND si.sid = s.sid
            AND mi.gid = g.gid
            AND mi.cid = c.cid
            AND mi.fid = f.fid
            AND s.orderId = d.orderId
            AND d.hid = h.hid
            AND h.vid = v.vid
            AND %s BETWEEN '%s 00:00:00' AND '%s 23:59:59'
            AND mi.siid != 0
                %s 
        """

    # 公司条件识别
    def company(self, cloumCompany, company):
        if company != 0:
            companyId = u"AND %s = %s" % (cloumCompany, company)
        else:
            companyId = u" "
        return companyId

    def main(self, type, pid, args, company):
    
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

            column = ""
            if type == "0":
                column = u"m.createTime"
            elif type == "1":
                column = u"m.manifestTime"

            countSQL = self.SQL_QUERY % (u"count(*)", column, startTime, endTime, self.company(u"m.company", company))

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

            params = self.createWorkbook(u"货单-销售")
            workbook = params[0]
            sheet = params[1]

            tableHead = [u"货单号", u"创建时间", u"货单时间", u"销售单号", u"装修单号", u"楼盘", u"楼号", u"商品编号", u"商品名称", u"品类", u"品牌",
                         u"颜色", u"规格", u"单位", u"件数", u"数量", u"进货仓库", u"出货仓库", u"货单类型", u"入库价", u"出库价", u"订单备注", u"项目备注"]
            self.createTableHead(sheet, tableHead)

            sql = self.SQL_QUERY % (self.column, column, startTime, endTime, self.company(u"m.company", company))

            nowPage = 1
            length = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    self.divNum(data, [14, 15, 19, 20])
                    
                    if (data[16] is None): data[16] = "无"
                    if (data[17] is None): data[17] = "无"
                    if (data[22] is None): data[22] = ""
                    
                    data[18] = self.type[data[18]]

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
        导出货单脚本说明:
            根据查询条件,以分页拿数据的方式导出货单;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.type        0(创建时间) 1(货单时间)
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司:1

        2.使用
            python plan_export_inventory_manifest.py type pid args company
            python plan_export_inventory_manifest.py   1  942 2018/12/01-2018/12/31 1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"),config.get("media"), config.get("pthost"))
    exporter.main(type, pid, args, int(company))
