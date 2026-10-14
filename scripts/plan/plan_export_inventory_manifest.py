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
            m.code AS '货单号',
            u.currentName AS '创建人',
            m.createTime AS '创建时间',
            m.manifestTime AS '货单时间',
            g.no AS '商品编号',
            g.name AS '商品名称',
            g.category AS '品类',
            g.brand AS '品牌',
            c.name AS '颜色',
            f.info AS '规格',
            g.measurementUnit AS '单位',
            g.pieceNum AS '件数',
            mi.num AS '数量',
            ish.name AS '进货仓库',
            osh.name AS '出货仓库',
            m.type AS '货单类型',
            mi.inprice AS '入库价',
            mi.outprice AS '出库价',
            m.`comment` AS '订单备注',
            mi.`comment` AS '项目备注'
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
                communion.`user` u
            WHERE
                m.mid = mi.mid AND 
                mi.gid = g.gid AND 
                mi.cid = c.cid AND 
                mi.fid = f.fid AND 
                m.cuid = u.uid AND 
                mi.siid = 0 AND 
                %s BETWEEN '%s 00:00:00' AND '%s 23:59:59'
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

            params = self.createWorkbook(u"货单")
            workbook = params[0]
            sheet = params[1]

            tableHead = [
                u"货单号", u"创建人", u"创建时间", u"货单时间", u"商品编号", u"商品名称", u"品类", u"品牌", u"颜色", u"规格", u"单位", u"件数",
                u"数量", u"进货仓库", u"出货仓库", u"货单类型", u"入库价", u"出库价", u"订单备注", u"项目备注"
            ]
            self.createTableHead(sheet, tableHead)

            sql = self.SQL_QUERY % (self.column, column, startTime, endTime, self.company(u"m.company", company))

            nowPage = 1
            length = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    self.divNum(data, [11, 12, 16, 17])
                    
                    if (data[13] is None): data[13] = "无"
                    if (data[14] is None): data[14] = "无"
                    if (data[18] is None): data[18] = ""
                    if (data[19] is None): data[19] = ""
                    
                    data[15] = self.manifestType[data[15]]

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
            python plan_export_inventory_manifest.py   0  942 2018/12/01-2018/12/31 1
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
