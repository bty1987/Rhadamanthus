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
            d.orderId,
            v.name,
            h.houseNumber,
            c.name,
            d.houseType,
            dr.name,
            dd.name,
            du.currentName,
            su.currentName,
            qu.currentName,
            sv.currentName,
            h.innerArea,
            d.factPrice,
            qv.name,
            d.contractTime,
            ci.issuetime,
            ci.designPeriod,
            ci.keyTime,
            ci.drawlineTime,
            ci.finishTime,
            ci.designTime,
            d.sdesigntime,
            d.edesigntime,
            communion.kv('decoration', 'decoration', 'typeness', d.typeness),
            cn.name,
            communion.kv('decoration', 'decoration', 'status', d.status),
            db.name AS busitypeName,
            d.houseType,
            ci.comment,
            co.name
        """

        self.SQL_QUERY = """
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN construction.constructioninfo AS ci ON d.orderId = ci.orderId
                LEFT JOIN quotation.quotationversion AS qv ON d.versionId = qv.no
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.smuid = su.uid
                LEFT JOIN communion.user AS qu ON d.quId = qu.uid
                LEFT JOIN communion.user AS sv ON d.svuid = sv.uid
                LEFT JOIN communion.department AS dd ON du.deptId = dd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN data.decorationbusitype AS db ON d.busitype = db.dbid
                LEFT JOIN data.constructionnode AS cn ON d.projectstatus = cn.cnid
                LEFT JOIN communion.company co on d.company = co.cid
            WHERE
                %s
                %s
        """

    def company(self, columnCompany, company):

        if company != 0:
            companyString = "AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

    def timeCondition(self, queryType, startTime, endTime):

        if queryType == 1:
            # 使用 issuetime 查询
            condition = "ci.issuetime >= '%s 00:00:00' AND ci.issuetime <= '%s 23:59:59'" % (startTime, endTime)
        else:
            # 使用 sdesigntime 查询（原有逻辑）
            condition = "d.sdesigntime >= '%s 00:00:00' AND d.sdesigntime <= '%s 23:59:59'" % (startTime, endTime)

        return condition

    def main(self, queryType, pid, args, company):

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

            timeCond = self.timeCondition(queryType, startTime, endTime)
            companyCond = self.company("d.company", company)

            sqlcount = self.SQL_QUERY % ("count(*)", timeCond, companyCond)

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

            sql = self.SQL_QUERY % (self.colum, timeCond, companyCond)

            workbook, sheet = self.createWorkbook("装修单信息")

            tableHead = [
                "装修单号", "楼盘", "楼号", "客户", "房屋类型", "设计分区", "设计部", "设计师", "业务员", "方案设计", "监理",
                "面积", "合同额", "报价版本", "签单时间", "分配时间", "设计天数", "预计交钥匙时间", "预计放线时间", "预计完工时间", "预计设计完成时间", "合同方案确认时间",
                "放线方案确认时间", "装修类型", "工程状态", "装修状态", "装修业务", "房屋类型", "备注", "公司"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    self.divNum(data, [11, 12, 16])

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
        导出装修单信息脚本说明:
        根据时间范围查询导出装修单相关信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将更新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        查询类型: 0=签单时间(sdesigntime), 1=下达时间(issuetime)
            2.pid         information.plan的主键;
            3.args        "2018/12/13-2018/12/13"
            4.company     公司:1(0表示全部)
        2.脚本传参说明:
             plan_export_construction_info_pro.py type pid     args      company
             plan_export_construction_info_pro.py 0    1207 "2016/07/01-2016/07/30" 1
             plan_export_construction_info_pro.py 1    1207 "2016/07/01-2016/07/30" 1

        3.导出字段说明:
            装修单/楼盘/楼号/客户/设计分区/设计部/设计师/业务员/方案设计/监理/面积/合同额/报价版本/签单时间/分配时间
            设计天数/预计交钥匙时间/预计放线时间/预计完工时间/预计设计完成时间/合同方案确认时间/放线方案确认时间
            装修类型/工程状态/装修状态/装修业务/备注

        4.注:
            结束时间不能大于开始时间31天
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    queryType = int(sys.argv[1])
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(queryType, pid, args, int(company))
