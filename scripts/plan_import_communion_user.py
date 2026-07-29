#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from xlrd import xldate_as_tuple
from datetime import datetime

class User(Util):
    
    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.flag = True

        self.SELECT_COMMUNION_UID = """SELECT uid FROM communion.user where userId="%s";"""

        self.department_Data = {}
        self.duty_Data = {}

        self.rules = {

            "1": {"name": "工号", "type": "str", "field": "userId", "database": "user"},
            "2": {"name": "姓名", "type": "str", "field": "userName", "rule": r'^.{1,10}$', "message": "姓名错误,内容应在1-10字以内", "database": "user"},
            "3": {"name": "现用名", "type": "str", "field": "currentName", "rule": r'^.{1,10}$', "message": "姓名错误,内容应在1-10字以内", "database": "user"},
            "4": {"name": "性别", "type": "enum", "field": "gender", "method": "userinfoGenderStatus", "database": "info"},
            "5": {"name": "部门", "type": "casc", "field": "deptId", "method": "getDepartment", "message": "部门有误", "database": "user"},
            "6": {"name": "职级", "type": "enum", "field": "level", "method": "userinfoLevelStatus", "database": "info"},
            "7": {"name": "序列", "type": "meet", "field": "ranks", "database": "info"},
            "8": {"name": "等级" },
            "9": {"name": "职位", "type": "casc", "field": "did", "method": "getDuty", "message": "职位有误", "database": "user"},
            "10": {"name": "集团入职时间", "type": "time", "field": "firstTime", "method": "read_excel", "database": "info"},
            "11": {"name": "入职时间", "type": "time", "field": "entryTime", "method": "read_excel", "database": "info"},
            "12": {"name": "身份证", "type": "str", "field": "identity", "database": "user"},
            "13": {"name": "联系电话", "type": "str", "field": "phone", "rule": r'^"(1[0-9]{10})((#1[0-9]{10})){0,4}"$', "message": "请输入正确的手机格式 (如:13619181918).如果为多条电话请用#号分隔", "database": "user"},
            "14": {"name": "QQ号码", "type": "str", "field": "qq", "rule": r'^.{0,15}$', "message": "QQ超出长度范围,内容应在15字以内", "database": "info"},
            "15": {"name": "微信号码", "type": "str", "field": "wechat", "rule": r'^.{0,15}$', "message": "微信超出长度范围,内容应在15字以内", "database": "info"},
            "16": {"name": "身高", "type": "int", "field": "height", "database": "info"},
            "17": {"name": "体重", "type": "int", "field": "weight", "database": "info"},
            "18": {"name": "民族", "type": "str", "field": "nation", "database": "info"},
            "19": {"name": "政治面貌", "type": "enum", "field": "political", "method": "userinfoPoliticalStatus", "message": "政治面貌书写不符规范", "database": "info"},
            "20": {"name": "入职时间", "type": "time", "field": "graduateTime", "method": "read_excel", "database": "info"},
            "21": {"name": "毕业院校", "type": "str", "field": "school", "database": "info"},
            "22": {"name": "学历", "type": "enum", "field": "education", "method": "userinfoEducationStatus", "message": "学历书写不符规范", "database": "info"},
            "23": {"name": "专业", "type": "str", "field": "specialty", "database": "info"},
            "24": {"name": "招聘渠道", "type": "enum", "field": "employWay", "method": "userinfoEmployWayStatus",  "message": "招聘渠道书写不符规范", "database": "info"},
            "25": {"name": "推荐人", "type": "str", "field": "recommendMan", "database": "info"},
            "26": {"name": "婚姻状况", "type": "enum", "field": "isMarried", "method": "userinfoStatus", "message": "婚姻状况书写不符规范", "database": "info"},
            "27": {"name": "生育状况", "type": "enum", "field": "isBirth", "method": "userinfoStatus", "message": "生育状况书写不符规范", "database": "info"},
            "28": {"name": "爱人", "type": "str", "field": "lover", "database": "info"},
            "30": {"name": "直系亲属公司/家属部门", "type": "str", "field": "clanerCom", "database": "info"},
            "31": {"name": "直系亲属/家属姓名", "type": "str", "field": "claner", "database": "info"},
            "32": {"name": "家属工号", "type": "casc", "field": "fuid", "method": "getUser", "message": "家属工号有误", "database": "info"},
            "33": {"name": "紧急联络人", "type": "str", "field": "emergencyMan", "database": "info"},
            "34": {"name": "紧急联络人电话", "type": "str", "field": "emergencyPhone", "rule": r'^"(1[0-9]{10})"$', "message": "请输入正确的紧急联络人手机格式 (如:13619181918)", "database": "info"},
            "35": {"name": "户籍性质", "type": "enum", "field": "householdType", "method": "userinfoHouseholdTypeStatus", "message": "户籍性质书写不符规范", "database": "info"},
            "36": {"name": "户籍所在地", "type": "str", "field": "hometownPlace", "database": "info"},
            "37": {"name": "身份证地址", "type": "str", "field": "hometownAddress", "database": "info"},
            "38": {"name": "现住址", "type": "str", "field": "address", "database": "info"},
            "39": {"name": "是否有房贷", "type": "enum", "field": "isHouseLoan", "method": "userinfoStatus", "message": "是否有房贷书写不符规范", "database": "info"},
            "40": {"name": "是否有车贷", "type": "enum", "field": "isCarLoan", "method": "userinfoStatus", "message": "是否有车贷书写不符规范", "database": "info"},
            "41": {"name": "是否有驾照", "type": "enum", "field": "isCarID", "method": "userinfoStatus", "message": "是否有驾照书写不符规范", "database": "info"},
            "42": {"name": "是否有护照", "type": "enum", "field": "isPassID", "method": "userinfoStatus", "message": "是否有护照书写不符规范", "database": "info"},
            "43": {"name": "是否有港澳通行证", "type": "enum", "field": "isHMID", "method": "userinfoStatus", "message": "是否有港澳通行证书写不符规范", "database": "info"},
            "44": {"name": "是否有台湾通行证", "type": "enum", "field": "isTWID", "method": "userinfoStatus", "message": "是否有台湾通行证书写不符规范", "database": "info"},
            "45": {"name": "是否签订劳动合同", "type": "enum", "field": "isContract", "method": "userinfoStatus", "message": "是否签订劳动合同书写不符规范", "database": "info"},
            "46": {"name": "现合同开始时间", "type": "time", "field": "signTime", "method": "read_excel", "database": "info"},
            "47": {"name": "现合同结束时间", "type": "time", "field": "eignTime", "method": "read_excel", "database": "info"},
            "48": {"name": "首次签订劳动合同时间", "type": "time", "field": "fignTime", "method": "read_excel", "database": "info"},
            "49": {"name": "续签合同次数", "type": "int", "field": "signNum", "database": "info"},
            "50": {"name": "录用类型", "type": "enum", "field": "employType", "method": "userinfoEmployTypeStatus","message": "录用类型书写不符规范", "database": "info"},
            "51": {"name": "转正时间", "type": "time", "field": "formTime", "method": "read_excel", "database": "info"},
            "52": {"name": "试用期限", "type": "str", "field": "preformNum", "database": "info"},
            "53": {"name": "试用期工资", "type": "str", "field": "palary", "database": "info"},
            "54": {"name": "转正后工资", "type": "str", "field": "salary", "database": "info"},
            "55": {"name": "是否缴纳保险", "type": "enum", "field": "isInsurance", "method": "userinfoStatus", "message": "是否缴纳保险写不符规范", "database": "info"},
            "56": {"name": "保险缴纳时间", "type": "time", "field": "insuranceTime", "method": "read_excel", "database": "info"},
            "57": {"name": "银行卡账号", "type": "str", "field": "bankCardNum", "database": "info"},
            "58": {"name": "所属银行", "type": "str", "field": "bank", "database": "info"},
            "59": {"name": "备注", "type": "str", "field": "comment", "database": "info"}
        }

    # 缓存department部门
    def cacheDepartment(self):
        sql = u"SELECT name, company, did FROM communion.department"
        data = self.executeQuerySQL(sql)
        for i, v in enumerate(data):
            name = v[0]
            company = int(v[1])
            keyName = u"%s-%s" % (name, company)

            self.department_Data[keyName] = {"no":name, "company":company , "did":v[2]}

    # 通过 name company获得department部门
    def getDepartment(self, name, company):
        keyName = u"%s-%s" % (name, int(company))
        if keyName in self.department_Data:
            return self.department_Data[keyName]["did"]
        else:
            return None

    # 缓存duty职位
    def cacheDuty(self):
        sql = u"SELECT name, did FROM communion.duty"
        data = self.executeQuerySQL(sql)
        for i, v in enumerate(data):
            name = v[0]
            keyName = name

            self.duty_Data[keyName] = {"no": name, "did": v[1]}

    # 通过 name 获得duty职位
    def getDuty(self, name, company):
        keyName = name
        if keyName in self.duty_Data :
            return self.duty_Data[keyName]["did"]
        else:
            return None

    # 通过 userId 获得uid
    def getUser(self, userId, company):

        sql = self.SELECT_COMMUNION_UID % userId
        result = self.executeQuerySQL(sql)

        return len(result) == 0 is None or result[0][0]

    # 转成datetime对象
    def read_excel(self, date):
        if isinstance(date, float):
            date = datetime(*xldate_as_tuple(date, 0))
            cell = date.strftime('"%Y-%m-%d"')
        if isinstance(date, str):
            cell = '"%s"' % date

        return cell

    def main(self, pid, path, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)
            url = self.media + path
            filePath = self.downLoadFile(url, path)

            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise RuntimeError(u'The query result is zero!')

            all = lengths / 0.9
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            paln = {
                u"plan.schedule": int(schedule),
                u"plan.status": 4
            }

            self.cacheDepartment()
            self.cacheDuty()

            self.updataSchedule(self.pthost, pid, paln)

            for i, v in enumerate(list):

                userId = v[1]

                sqlt = self.SELECT_COMMUNION_UID % (userId)
                result = self.executeQuerySQL(sqlt)

                if v[0] == "序号":
                    continue
                if len(result) == 0:
                    self.errCall(pid, self.pthost, self.media, "请检查该行内容,错误内容在第%s行, 人员信息不存在" % (i), False)
                    continue

                uid = result[0][0]

                userupsets = []
                infoupsets = []
                for index in range(len(v)):

                    rule = self.rules.get(str(index))

                    if not rule: continue

                    value = v[index]

                    if not self.paramCheck(r'^\S', value):
                        continue

                    if rule.get("type") == "str":
                        if isinstance(value, str):
                            value = '"%s"' % value
                        if isinstance(value, float):
                            value = '"%s"' % int(value)
                    if rule.get("type") == "int":
                        value = int(value)
                    if rule.get("type") == "meet":
                        value = '"%s"' % (str(v[7]) + str(int(v[8])))
                    if rule.get("type") == "time":
                        value = getattr(self, rule.get("method"))(value)
                    if rule.get("type") == "enum":
                        if  not value in getattr(self, rule.get("method")):
                            self.errCall(pid, self.pthost, self.media,"请检查该行内容,错误内容在第%s行, %s" % (i, rule.get("message")), False)
                            continue
                        value = getattr(self, rule.get("method"))[value]
                    if rule.get("type") == "casc":
                        value = getattr(self, rule.get("method"))(value, company)
                        if not value:
                            self.errCall(pid, self.pthost, self.media, "请检查该行内容,错误内容在第%s行, %s" % (i, rule.get("message")), False)
                            continue

                    if rule.get("rule") and not self.paramCheck(rule.get("rule"), value):
                        self.errCall(pid,self.pthost, self.media, "请检查该行内容,错误内容在第%s行, %s" % (i, rule.get("message")), False)
                        continue

                    if rule.get("database") == "user": userupsets.append("%s = %s" % (rule.get("field"), value))
                    if rule.get("database") == "info": infoupsets.append("%s = %s" % (rule.get("field"), value))

                if len(userupsets) != 0:
                    sql = "update communion.user set %s where uid = %s;" % (",".join(userupsets), uid)

                    self.cursor.execute(sql)
                    self.commit()
                    
                if len(infoupsets) != 0:
                    sql = "update communion.userinfo set %s where uid = %s;" % (",".join(infoupsets), uid)

                    self.cursor.execute(sql)
                    self.commit()
                
                molecular = molecular + 1
                schedules = (molecular / all) * 100

                paln = {
                    u"plan.schedule": int(schedules),
                }

                self.updataSchedule(self.pthost, pid, paln)

            self.delFile(filePath)

        except Exception as e:

            self.flag=False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)

            sys.exit(0)


if __name__ == '__main__':
    """
        导入人员脚本说明: 
        在信息中创建导入人员计划,并上传导入人员的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;

        脚本传参说明:
        python plan_import_communion_user.py pid   path   company
               plan_import_communion_user.py 3125  group2/M00/14/72/wKgFbmEht_-ARHqjAAHIACrDAqg410.xls  1
        
        self.rules={            
            "0": {"name": "例子", "type": "str/int/fcasc/enum/time", "field": "字段", "rule": "正则规则", 
            "message": "规则错误信息", "method": "执行方法", "database": "user/info"},
        }

    """
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    company = sys.argv[3]

    User = User(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    User.main(pid, path, int(company))
