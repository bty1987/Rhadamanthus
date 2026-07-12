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

        self.colum = u"""
            dl.orderId,
            c.name,
            cp.name,
            v.name,
            h.houseNumber,
            dr.name,
            dd.name,
            du.currentName,
            mu.currentName,
            sr.name,
            sd.name,
            su.currentName,
            h.innerArea,
            d.factPrice,
            d.discount,
            (q.undisPrice + q.disPrice + q.managePrice + q.trafficPrice + q.taxPrice),
            dl.applayTime,
            dl.actualTime,
            dg.name,
            dl.status,
            dl.content,
            ci.ishovel,
            ci.iskey,
            ci.isCeremony,
            dl.startTime,
            dl.endTime,
            d.precontractTime,
            d.contractTime,
            ci.comment,
            co.name
        """

        self.SQL_QUERY = u"""
            SELECT
                %s
            FROM
                construction.drawline AS dl
                LEFT JOIN decoration.decoration AS d ON dl.orderId = d.orderId
                LEFT JOIN quotation.quotation AS q ON q.orderId = d.orderId AND q.defaults = 1
                LEFT JOIN communion.house AS h ON d.hid = h.hid
                LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.cityproper AS cp ON v.cityProperId = cp.cpid
                LEFT JOIN communion.city AS c ON cp.cid = c.cid
                LEFT JOIN construction.constructioninfo AS ci ON dl.orderId = ci.orderId
                LEFT JOIN data.drawlinegroup AS dg ON dl.dgid = dg.gid
                LEFT JOIN communion.user AS du ON d.dsuid = du.uid
                LEFT JOIN communion.user AS su ON d.svuid = su.uid
                LEFT JOIN communion.user AS mu ON mu.uid = d.msuid 
                LEFT JOIN communion.department AS dd ON dd.did = du.deptId
                LEFT JOIN communion.department AS dr ON dr.did = dd.fdid
                LEFT JOIN communion.department AS sd ON sd.dId = su.deptId
                LEFT JOIN communion.department AS sr ON sr.did = sd.fdid
                LEFT JOIN communion.company AS co ON d.company = co.cid
            WHERE
                dl.applayTime >= '%s 00:00:00' AND
                dl.applayTime <= '%s 23:59:59'
                %s
                ORDER BY dg.gid ASC, dl.actualTime ASC, dl.startTime ASC
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

            workbook, sheet = self.createWorkbook(u"放线信息")

            tableHead = [
                u"装修单号", u"城市", u"城区", u"楼盘", u"楼号", u"设计分区", u"设计部", u'设计师', u"跟单员", u"工程分区", 
                u"工程部", u"监理", u"面积", u"签单额", u"折扣", u"折前总价", u"申请时间", u"放线时间", u"放线小组", u"状态", 
                u"备注", u"是否铲大白", u"是否交钥匙", u"开工仪式", u"开工时间", u"完工时间", u"预签时间", u"签单时间", u"备注", u"公司",
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)
                    self.divNum(data, [12, 13, 14, 15])

                    if(data[19] != None):
                        data[19] = self.constructionDrawlineIstatus[data[19]]
                    if (data[21] != None):
                        data[21] = self.constructionIshovel[data[21]]
                    if (data[22] != None):
                        data[22] = self.constructionIskey[data[22]]
                    if (data[23] != None):
                        data[23] = self.constructionIsCeremony[data[23]]

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
        导出放线信息脚本说明:
        根据查询条件,以分页拿数据的方式导出放线信息;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_awardStock_collecter.py pid     args      company
             plan_export_awardStock_collecter.py 1207 "2016/07/01-2016/07/30" 1

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
