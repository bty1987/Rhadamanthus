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

        # 装修类型映射
        self.decorationType = {
            0: u"半包",
            1: u"整装",
            2: u"全包"
        }

        # 工程状态映射
        self.projectStatus = {
            0: u"初始",
            1: u"开工",
            2: u"完工"
        }

        # 装修状态映射
        self.decorationStatus = {
            0: u"初始",
            1: u"定金",
            2: u"预签",
            3: u"签约",
            4: u"重签",
            5: u"废单",
            6: u"终止",
            7: u"决算",
            8: u"完工"
        }

        self.colum = u"""
            d.orderId,
            v.name,
            h.houseNumber,
            c.name,
            dr.alias AS designRegion,
            dd.alias AS designDept,
            du.currentName AS designerName,
            su.currentName AS salesmanName,
            qu.currentName AS schemeDesignerName,
            sv.currentName AS supervisorName,
            h.innerArea,
            d.factPrice,
            qv.name AS versionName,
            d.contractTime,
            ci.designPeriod,
            ci.keyTime,
            ci.drawlineTime,
            ci.finishTime,
            ci.designTime,
            NULL AS contractConfirmTime,
            NULL AS drawlineConfirmTime,
            d.type,
            d.projectStatus,
            d.status,
            db.name AS busitypeName,
            ci.comment
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                decoration.decoration AS d
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.customer AS c ON d.customerId = c.cid
                LEFT JOIN construction.constructioninfo AS ci ON d.orderId = ci.orderId
                LEFT JOIN data.quotationversion AS qv ON d.versionId = qv.no
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.smuid = su.uid
                LEFT JOIN communion.user AS qu ON d.quId = qu.uid
                LEFT JOIN communion.user AS sv ON d.svuid = sv.uid
                LEFT JOIN communion.department AS dd ON du.deptId = dd.did
                LEFT JOIN communion.department AS dr ON dd.fdid = dr.did
                LEFT JOIN data.decorationbusitype AS db ON d.busitype = db.dbid
            WHERE
                d.contractTime >= '%s 00:00:00' AND
                d.contractTime <= '%s 23:59:59'
                %s
                ORDER BY d.contractTime DESC
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

            sqlcount = self.SQL_QUERY % ("count(*)", startTime, endTime, self.company("d.company", company))

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
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            sql = self.SQL_QUERY % (self.colum, startTime, endTime, self.company("d.company", company))

            workbook, sheet = self.createWorkbook(u"装修单信息")

            tableHead = [
                u"装修单", u"楼盘", u"楼号", u"客户", u"设计分区", u"设计部", u"设计师", u"业务员", u"方案设计",
                u"监理", u"面积", u"合同额", u"报价版本", u"签单时间", u"设计天数", u"预计交钥匙时间",
                u"预计放线时间", u"预计完工时间", u"预计设计完成时间", u"合同方案确认时间", u"放线方案确认时间",
                u"装修类型", u"工程状态", u"装修状态", u"装修业务", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)

                    # 处理金额字段（合同额），转换为万元
                    self.divNum(data, [10])

                    # 处理装修类型
                    if data[20] != None:
                        data[20] = self.decorationType.get(data[20], data[20])

                    # 处理工程状态
                    if data[21] != None:
                        data[21] = self.projectStatus.get(int(data[21]), data[21])

                    # 处理装修状态
                    if data[22] != None:
                        data[22] = self.decorationStatus.get(data[22], data[22])

                    self.createTableHead(sheet, data, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
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
        导出装修单信息脚本说明:
        根据签单时间范围查询导出装修单相关信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将更新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1(0表示全部)
        2.脚本传参说明:
             plan_export_decoration_info.py pid     args      company
             plan_export_decoration_info.py 1207 "2016/07/01-2016/07/30" 1

        3.导出字段说明:
            装修单/楼盘/楼号/客户/设计分区/设计部/设计师/业务员/方案设计/监理/面积/合同额/报价版本/签单时间
            设计天数/预计交钥匙时间/预计放线时间/预计完工时间/预计设计完成时间/合同方案确认时间/放线方案确认时间
            装修类型/工程状态/装修状态/装修业务/备注

        4.注:
            结束时间不能大于开始时间31天
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
