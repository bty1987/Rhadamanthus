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
            a.orderId AS '装修单号',
            a. NO AS '辅料单号',
            v. NAME AS '楼盘',
            h.houseNumber AS '楼号',
            sv.userId AS '监理工号',
            sv.userName AS '监理',
            au.userName AS '审批人',
            m.manifestTime AS '审批时间',
            m.`code` AS '货单编号',
            cu.userName AS '创建人',
            g.brand AS '品牌',
            g.`no` AS '商品编号',
            g.`name` AS '商品名称',
            g.measurementUnit AS '单位',
            mi.num AS '数量',
            f.info AS '规格',
            c.`name` AS '颜色',
            ish.`name` AS '入货仓库',
            osh.`name` AS '出货仓库',
            m.type AS '类型',
            d.`grade` AS '等级',
            d.paySacle AS '付款比例',
            co.name AS '公司名',
            a.comment AS '备注'
        """

        self.SQL_QUERY = u"""           
            SELECT
                %s
            FROM
                inventory.accessories a,
                decoration.decoration d
                LEFT JOIN communion.`user` sv on d.svuid = sv.uid,
                inventory.accessoriesitem ai,
                inventory.accessoriesmanifest am,
                inventory.manifest m,
                inventory.manifestitem mi
                LEFT JOIN inventory.storehouse ish ON mi.ishid = ish.shid
                LEFT JOIN inventory.storehouse osh ON mi.oshid = osh.shid,
                data.goods g,
                data.format f,
                data.color c,
                communion.house h,
                communion.village v,
                communion.`user` au,
                communion.`user` cu,
                communion.company co
            WHERE
                a.orderId = d.orderId
                AND a.aid = am.aid
                AND a.aid = ai.aid
                AND am.mid = m.mid
                AND m.mid = mi.mid
                AND ai.gid = mi.gid
                AND mi.gid = g.gid
                AND mi.cid = c.cid
                AND mi.fid = f.fid
                AND d.hid = h.hid
                AND h.vid = v.vid
                AND m.cuid = au.uid
                AND a.cuid = cu.uid
                AND mi.aiid = ai.aiid
                AND d.company = co.cid
                AND m.manifestTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
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

            countSQL = self.SQL_QUERY % (u"count(*)", startTime, endTime, self.company(u"a.company", company))
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

            params = self.createWorkbook(u"辅料单")
            workbook = params[0]
            sheet = params[1]

            tableHead = [
                u"装修单号", u"辅料单号", u"楼盘", u"楼号", u"监理工号", u"监理", u"审批人", u"审批时间", u"货单编号", u"创建人",
                u"品牌", u"商品编号", u"商品名称", u"单位", u"数量", u"规格", u"颜色", u"入货仓库", u"出货仓库", u"类型",
                u"等级", u"付款比例", u"公司名", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            path = tempfile.gettempdir() + u"/accessories.xls"
            self.saveWorkbook(path, workbook)

            sql = self.SQL_QUERY % (self.column, startTime, endTime, self.company(u"a.company", company))

            nowPage = 1
            length = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):

                    data = list(v)

                    self.divNum(data, [14, 21])

                    if (data[17] is None): data[17] = ""
                    if (data[18] is None): data[18] = ""

                    data[19] = self.accessoriesType[data[19]]

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
        导出辅料单脚本说明:
            根据查询条件,以分页拿数据的方式导出辅料单;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1

        2.使用
            python plan_export_inventory_accessories.py pid args company
            python plan_export_inventory_accessories.py 942 2018/12/13-2018/12/13 1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299
    # args = '2023/03/01-2023/03/30'
    # company = 1

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
