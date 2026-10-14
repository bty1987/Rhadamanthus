#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Export_Communion_User(Util):

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
        self.size = 400

        self.userinfoLevelStatus = {
            0: u"员工",
            1: u"核心员工",
            2: u"主管",
            3: u"经理",
            4: u"总监及以上"
        }

        self.userinfoPoliticalStatus = {
            0: u"群众",
            1: u"团员",
            2: u"党员",
            3: u"其它党派"
        }

        self.userinfoEducationStatus = {
            0:u"小学及以下",
            1:u"初中",
            2:u"中专",
            3:u"高中",
            4:u"大专",
            5:u"本科",
            6:u"研究生及以上"
        }

        self.userinfoEmployWayStatus = {
            0: u"校园招聘",
            1: u"网络招聘",
            2: u"内部推荐",
            3: u"主动应聘",
            4: u"猎头",
            5: u"社会招聘"
        }

        self.userinfoStatus = {
            0: u"是",
            1: u"否"
        }

        self.userinfoHouseholdTypeStatus = {
            0: u"农村",
            1: u"城镇",
            2: u"非农业"
        }

        self.userinfoEmployTypeStatus = {
            0:u"正式",
            1:u"试用"
        }

        self.colum = u"""
            (@i:=@i+1) AS `序号`,
            u.userId AS `工号`,
            u.userName AS `姓名`,
            u.currentName as `现用名`,
            u.gender AS `性别`,
            de.name AS `部门`,
            ui.level AS `职级`,
            left(ui.ranks,1) AS `序列`,
            right(ui.ranks,1) AS `等级`,
            du.name AS `职位`,
            DATE_FORMAT(ui.firstTime,'%Y/%m/%d') AS `集团入职时间`,
            DATE_FORMAT(ui.entryTime,'%Y/%m/%d') AS `入职时间`,
            u.identity AS `身份证`,
            u.phone AS `联系电话`,
            ui.qq AS `QQ号码`,
            ui.wechat AS `微信号码`,
            ui.height AS `身高`,
            ui.weight AS `体重`,
            ui.nation AS `民族`,
            ui.political AS `政治面貌`,
            DATE_FORMAT(ui.graduateTime,'%Y/%m/%d') AS `毕业时间`,
            ui.school AS `毕业院校`,
            ui.education AS `学历`,
            ui.specialty AS `专业`,
            ui.employWay AS `招聘渠道`,
            ui.recommendMan AS `推荐人`,
            ui.isMarried AS `婚姻状况`,
            ui.isBirth AS `生育状况`,
            ui.lover AS `爱人`,
            ui.fuid AS `是否有家属在方林工作`,
            ui.clanerCom AS `直系亲属公司/家属部门`,
            ui.claner AS `直系亲属/家属姓名`,
            fu.userId AS `家属工号`,
            ui.emergencyMan AS `紧急联络人`,
            ui.emergencyPhone AS `紧急联络人电话`,
            ui.householdType AS `户籍性质`,
            ui.hometownPlace AS `户籍所在地`,
            ui.hometownAddress AS `身份证地址`,
            ui.address AS `现住址`,
            ui.isHouseLoan AS `是否有房贷`,
            ui.isCarLoan AS `是否有车贷`,
            ui.isCarID AS `是否有驾照`,
            ui.isPassID AS `是否有护照`,
            ui.isHMID AS `是否有港澳通行证`,
            ui.isTWID AS `是否有台湾通行证`,
            ui.isContract AS `是否签订劳动合同`,
            DATE_FORMAT(ui.signTime,'%Y/%m/%d') AS `现合同开始时间`,
            DATE_FORMAT(ui.eignTime,'%Y/%m/%d') AS `现合同结束时间`,
            DATE_FORMAT(ui.fignTime,'%Y/%m/%d') AS `首次签订劳动合同时间`,
            ui.signNum AS `续签合同次数`,
            ui.employType AS `录用类型`,
            DATE_FORMAT(ui.formTime,'%Y/%m/%d') AS `转正时间`,
            ui.preformNum AS `试用期限`,
            ui.palary AS `试用期工资`,
            ui.salary AS `转正后工资`,
            ui.isInsurance AS `是否缴纳保险`,
            DATE_FORMAT(ui.insuranceTime,'%Y/%m/%d') AS `保险缴纳时间`,
            ui.bankCardNum AS `银行卡账号`,
            ui.bank AS `所属银行`,
            ui.comment AS `备注`
        """

        self.SELECT_SQL = u"""
            SELECT
                %s
            FROM
                (SELECT @i := 0) AS it,
                communion.user AS u,
                communion.department AS de,
                communion.duty AS du,
                communion.userinfo AS ui
                LEFT JOIN communion. user AS fu ON fu.uid = ui.fuid
            WHERE
                u.uid = ui.uid
                AND u.deptId = de.did
                AND u.did = du.did
                AND u.type = 0
                AND u.company = %s
        """

    def main(self, pid, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            sqlcount = self.SELECT_SQL % ("count(*)", company)
            
            count = self.count(sqlcount)
            
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

            sql = self.SELECT_SQL % (self.colum, company)

            workbook, sheet = self.createWorkbook(u"基础数据")

            tableHead = [
                u"序号", u"工号", u"姓名", u"现用名", u"性别", u"部门", u"职级", u'序列', u'等级', u'职位',
                u'集团入职时间', u"入职时间", u"身份证", u"联系电话", u"QQ号码", u"微信号码", u"身高",
                u"体重", u"民族", u"政治面貌",u"毕业时间", u"毕业院校", u"学历", u"专业", u"招聘渠道",
                u"推荐人",u"婚姻状况", u"生育状况", u"爱人", u"是否有家属在方林工作", u"直系亲属公司/家属部门", u"直系亲属/家属姓名",
                u"家属工号", u"紧急联络人", u"紧急联络人电话", u"户籍性质", u"户籍所在地", u"身份证地址", u"现住址",
                u"是否有房贷", u"是否有车贷", u"是否有驾照", u"是否有护照",u"是否有港澳通行证", u"是否有台湾通行证",
                u"是否签订劳动合同", u"现合同开始时间", u"现合同结束时间", u"首次签订劳动合同时间", u"续签合同次数",
                u"录用类型", u"转正时间", u"试用期限", u"试用期工资", u"转正后工资",u"是否缴纳保险", u"保险缴纳时间",
                u"银行卡账号", u"所属银行", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                    row = list(v)

                    if (row[7] is None): row[7] = ""
                    if (row[8] is None): row[8] = ""
                    if (row[10] is None): row[10] = ""
                    if (row[11] is None): row[11] = ""
                    if (row[14] is None): row[14] = ""
                    if (row[15] is None): row[15] = ""
                    if (row[18] is None): row[18] = ""
                    if (row[20] is None): row[20] = ""
                    if (row[21] is None): row[21] = ""
                    if (row[23] is None): row[23] = ""
                    if (row[25] is None): row[25] = ""
                    if (row[28] is None): row[28] = ""
                    if (row[30] is None): row[30] = ""
                    if (row[31] is None): row[31] = ""
                    if (row[32] is None): row[32] = ""
                    if (row[33] is None): row[33] = ""
                    if (row[34] is None): row[34] = ""
                    if (row[36] is None): row[36] = ""
                    if (row[37] is None): row[37] = ""
                    if (row[38] is None): row[38] = ""
                    if (row[46] is None): row[46] = ""
                    if (row[47] is None): row[47] = ""
                    if (row[48] is None): row[48] = ""
                    if (row[51] is None): row[51] = ""
                    if (row[52] is None): row[52] = ""
                    if (row[53] is None): row[53] = ""
                    if (row[56] is None): row[56] = ""
                    if (row[57] is None): row[57] = ""
                    if (row[58] is None): row[58] = ""
                    if (row[59] is None): row[59] = ""

                    row[6] = self.userinfoLevelStatus[row[6]]
                    row[19] = "群众" if row[19] is None else self.userinfoPoliticalStatus[row[19]]
                    row[22] = "小学及以下" if row[22] is None else self.userinfoEducationStatus[row[22]]
                    row[24] = "校园招聘" if row[24] is None else self.userinfoEmployWayStatus[row[24]]
                    row[26] = "否" if row[26] is None else self.userinfoStatus[row[26]]
                    row[27] = "否" if row[27] is None else self.userinfoStatus[row[27]]
                    row[29] = "是" if row[29] else "否"
                    row[35] = "农村" if row[35] is None else self.userinfoHouseholdTypeStatus[row[35]]
                    row[39] = "否" if row[39] is None else self.userinfoStatus[row[39]]
                    row[40] = "否" if row[40] is None else self.userinfoStatus[row[40]]
                    row[41] = "否" if row[41] is None else self.userinfoStatus[row[41]]
                    row[42] = "否" if row[42] is None else self.userinfoStatus[row[42]]
                    row[43] = "否" if row[43] is None else self.userinfoStatus[row[43]]
                    row[44] = "否" if row[44] is None else self.userinfoStatus[row[44]]
                    row[45] = "否" if row[45] is None else self.userinfoStatus[row[45]]
                    row[50] = "试用" if row[50] is None else self.userinfoEmployTypeStatus[row[50]]
                    row[55] = "否" if row[55] is None else self.userinfoStatus[row[55]]

                    self.createTableHead(sheet, row, count)
                    count += 1

                nowPage = nowPage + 1
                if len(data) < self.size:
                    flag = False
                    
                molecular = molecular + len(data)
                schedules = (molecular / all) * 100
                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                })

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
        导出人员信息脚本说明:
            根据查询条件,以分页拿数据的方式导出人员信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键;
        2.脚本传参说明:
            plan_export_communion_user.py  pid
            plan_export_communion_user.py  3074
        """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    Export_Communion_User = Export_Communion_User(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    Export_Communion_User.main(pid, int(company))