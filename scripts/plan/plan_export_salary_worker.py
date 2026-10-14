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
            communion.kv('salary', 'salary', 'type', ws.type),
            communion.kv('salary', 'salary', 'onetype', ws.onetype),
            communion.kv('salary', 'salary', 'SalaryTwoType', ws.twotype),
            communion.kv('salary', 'salary', 'status', ws.status),
            ws.checkTime,
            coo.name,
            co.name,
            ws.comment,
            ws.annotate,
            ws.count
         """

        self.SQL_QUERY_WORKER_SALARY = u"""
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
            companyString = u"AND %s = %s" % (columnCompany, company)
        else:
            companyString = u" "

        return companyString

    def sqler(self, type, args, company):

        condition = ""

        if type == 0:

            startTime, endTime = args.split("-")
            condition = "ws.createTime >= '%s 00:00:00' AND ws.createTime <= '%s 23:59:59' %s" % (startTime, endTime, self.company("ws.company", company))

        elif type == 1:

            condition = "ws.orderId = '%s'" % (args)

        elif type == 2:

            startTime, endTime = args.split("-")
            condition = "ws.approveTime >= '%s 00:00:00' AND ws.approveTime <= '%s 23:59:59' %s" % (startTime, endTime, self.company("ws.company", company))

        return self.SQL_QUERY_WORKER_SALARY % ("%s", condition)

    def rower(self, row):

        # 类型/一类/二类/状态四列已由SQL层communion.kv翻译, rower仅做金额量纲处理
        self.divNum(row, [12, 14, 15, 16])

        return row

    def main(self, type, pid, args, company):

        tableheads = [
            u"工人姓名", u"工人工号", u"开户行", u"银行卡号", u"创建人编号", u"创建人", u"创建时间", u"审批人编号", u"审批人", u"审批时间",
            u"装修单号", u"楼盘地址", u"计价面积", u"监理编号", u"监理", u"操作金额", u"工费", u"质保金", u"施工节点", u"工种", u"类型",
            u"一类", u"二类", u"状态", u"质检时间", u"工程公司", u"装修公司", u"备注", u"备注", u"计数"
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = self.sqler(type, args, company)

        # type=1时args为装修单号而非日期段, 不做31天时间校验
        self.exporter(pid, None if type == 1 else args, u"工人工费", tableheads, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出工人工费脚本说明:
        根据查询条件,以分页拿数据的方式导出工人工费;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.type        创建时间 0/装修单号 1/审批时间 2
            2.pid         information.plan的主键;
            3.args        type为0/2时:"2018/12/13-2018/12/13", type为1时:装修单号
            4.company     公司cid, 0为全部(不传默认0)
        2.脚本传参说明:
            python plan_export_Salary_worker.py type pid args company
            python plan_export_Salary_worker.py  0  1207 2016/07/01-2016/07/30  1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    type = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]
    company = sys.argv[4] if len(sys.argv) > 4 else 0

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(int(type), pid, args, int(company))
