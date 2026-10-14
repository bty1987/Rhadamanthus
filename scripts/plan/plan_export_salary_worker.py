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
            u.currentName,
            u.userId,
            ui.bank,
            ui.bankCardNum,
            cu.userId,
            cu.userName,
            ws.createTime,
            au.userId,
            au.userName,
            ws.approveTime,
            d.orderId,
            CONCAT(v.`name`, ' ', h.`houseNumber`),
            h.innerarea,
            sv.userId,
            sv.userName,
            ws.money,
            ws.salary,
            ws.deposit,
            cn.name,
            du.name,
            communion.kv('salary', 'salary', 'type', ws.type) '类型',
            communion.kv('salary', 'salary', 'onetype', ws.onetype) '一类',
            communion.kv('salary', 'salary', 'SalaryTwoType', ws.twotype) '二类',
            communion.kv('salary', 'salary', 'status', ws.status) '状态',
            ws.checkTime,
            coo.name,
            co.name,
            ws.comment,
            ws.annotate,
            ws.count
         """
         
        self.SQL_QUERY_WORKER_SALARY = """
           SELECT
              %s
           FROM
              salary.workersalary AS ws
              LEFT JOIN communion.user AS u ON ws.wuid = u.uid
              LEFT JOIN communion.userinfo AS ui ON  u.uid = ui.uid
              LEFT JOIN communion.user AS cu ON ws.cuid = cu.uid
              LEFT JOIN communion.user AS au ON ws.auid = au.uid
              LEFT JOIN decoration.decoration AS d ON ws.orderId = d.orderId
              LEFT JOIN communion.house AS h ON d.hid = h.hid
              LEFT JOIN communion.village AS v ON h.vid = v.vid
              LEFT JOIN communion.user AS sv ON d.svuid = sv.uid
              LEFT JOIN communion.duty AS du ON u.did = du.did
              LEFT JOIN data.constructionnode AS cn ON ws.cnid = cn.cnid 
              LEFT JOIN communion.company AS coo ON d.conpany = coo.cid
              LEFT JOIN communion.company AS co ON d.company = co.cid
           WHERE
              %s
        """

    def company(self, columnCompany, company):
        if company != 0:
            companyString = " AND %s = %s" % (columnCompany, company)
        else:
            companyString = " "

        return companyString

    def main(self, type, pid, args, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)
            
            self.constructionnode(company)
            
            condition = ""
            
            if type == 0:

                startTime, endTime = args.split("-")

                if self.controlTime(startTime, endTime) == False:
                    self.updataSchedule(self.pthost, pid, {
                        "plan.status": 3,
                        "plan.info": '时间范围大于31天'
                    })
                    return False
                    
                condition = "ws.createTime >= '%s 00:00:00' AND ws.createTime <= '%s 23:59:59' %s" % (startTime, endTime, self.company("ws.company", company))

            elif type == 1:
            
                condition = "ws.orderId = '%s'" % (args)
            elif type == 2:
                
                startTime, endTime = args.split("-")

                if self.controlTime(startTime, endTime) == False:
                    self.updataSchedule(self.pthost, pid, {
                        "plan.status": 3,
                        "plan.info": '时间范围大于31天'
                    })
                    return False
                    
                condition = "ws.approveTime >= '%s 00:00:00' AND ws.approveTime <= '%s 23:59:59' %s" % (startTime, endTime, self.company("ws.company", company))

            path = tempfile.gettempdir() + "/Funds.xls"

            sqlcount = self.SQL_QUERY_WORKER_SALARY % ("count(*)", condition)

            count = self.count(sqlcount)

            if count == 0:
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 2,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            sql = self.SQL_QUERY_WORKER_SALARY % (self.colum, condition)

            workbook, sheet = self.createWorkbook("工人工费")

            tableHead = [
                "工人姓名", "工人工号", "开户行", "银行卡号", "创建人编号", "创建人", "创建时间", "审批人编号", "审批人", "审批时间", 
                "装修单号", "楼盘地址", "计价面积", "监理编号", "监理", "操作金额", "工费", "质保金", "施工节点", "工种", "类型", 
                "一类", "二类", "状态", "质检时间", "工程公司", "装修公司", "备注", "备注", "计数"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)

                    self.divNum(data, [12, 14, 15, 16])

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

            self.saveWorkbook(path, workbook)

            url = self.media + "uploadOther.do"
            resultfilepath = self.uploudFile(path, url)
            self.delFile(path)

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
        导出工人工费脚本说明:
        根据查询条件,以分页拿数据的方式导出工人工费;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
        python plan_export_salary_worker_salary.py pid        args             company
        python plan_export_salary_worker_salary.py 1207 2016/07/01-2016/07/30     0

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(int(type), pid, args, int(company))
