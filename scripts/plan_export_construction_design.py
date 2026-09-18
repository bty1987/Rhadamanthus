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

        self.colum = """
            d.precontractTime,
            d.contractTime,
            communion.kv('decoration', 'decoration', 'type', d.type),
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            d.orderId,
            v.name,
            h.houseNumber,
            h.innerArea,
            co.name,
            dr.name,
            dd.name,
            du.currentName,
            du.userId,
            '' AS designFee,
            ci.designPeriod,
            ci.designTime,
            ci.initDesignTime,
            d.sdesignTime,
            communion.kv('decoration', 'decoration', 'designStatus', d.designStatus),
            ci.designOverdueDays,
            d.terminalTime,
            d.recontractTime
         """
        self.SQL_DesignInfo = """
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.company AS co ON d.company = co.cid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.department AS dd ON dd.did = du.deptId
                LEFT JOIN communion.department AS dr ON dr.did = dd.fdid
                LEFT JOIN construction.constructioninfo AS ci ON d.orderId = ci.orderId
            WHERE
                d.company = %s
                AND ci.initDesignTime >= '%s 00:00:00'
                AND ci.initDesignTime <= '%s 23:59:59'
        """

    def main(self, pid, args, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            times = args.split("-")

            startTime = times[0]
            endTime = times[1]

            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": "时间范围大于31天"
                })
                return False

            sqlcount = self.SQL_DesignInfo % ("count(*)", company, startTime, endTime)

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

            sql = self.SQL_DesignInfo % (self.colum, company, startTime, endTime)

            workbook, sheet = self.createWorkbook("设计信息")

            tableHead = [
                "预签时间", "签单时间", "模式", "订单类型", "装修单号", "楼盘", "楼号", "计价面积", "公司", "设计分区", "设计部", "设计师", "设计师工号", "设计费", "设计天数",
                "预计设计完成时间", "初始设计完成时间", "合同方案确认时间", "设计状态", "超期天数", "终止时间", "重签时间"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):

                    data = list(v)

                    self.divNum(data, [7])

                    self.createTableHead(sheet, data, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules),
                    "plan.status": 4
                })

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
        导出设计信息脚本说明:
        根据查询条件(公司 + 初始设计完成时间范围),以分页拿数据的方式导出设计信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        字段口径:
            模式   = decoration.type(包型, 半包/整装/满减等)
            订单类型 = decoration.typeness(细分类型)
            计价面积 = house.innerArea(÷1000)
            设计费   = 暂留空, 数据源待定后补
            初始设计完成时间/超期天数 = constructioninfo.initDesignTime/designOverdueDays
            设计状态 = kv('decoration','decoration','designStatus')
        楼号(houseNumber)为密文/明文混合现状, 原样导出(同存量导出脚本口径)

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明
            python   plan_export_construction_design.py pid     args      company
            python   plan_export_construction_design.py 1207 "2016/07/01-2016/07/30" 1
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
