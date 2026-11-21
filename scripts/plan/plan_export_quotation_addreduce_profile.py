#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

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
        self.size = 100

        self.colum = """
            d.orderId '装修单号',
            v.name '楼盘',
            h.housenumber '楼号',
            h.innerarea '计价面积',
            dr.name '设计分区',
            dd.name '设计部',
            du.currentName '设计师',
            communion.kv('quotation', 'addreduce', 'type', ar.type) '类型',
            communion.kv('quotation', 'addreduce', 'atttype', ar.atttype) '业务类型',
            communion.kv('quotation', 'addreduce', 'paytype', ar.paytype) '付款类型',
            communion.kv('quotation', 'addreduce', 'status', ar.status) '付款状态',
            ar.total '总价',
            st.name '标签模板',
            qp.name '标签名称',
            cu.currentName '创建人',
            qp.createTime '创建时间',
            CASE qp.status WHEN 0 THEN '初始' WHEN 1 THEN '发送' WHEN 2 THEN '完成' END '状态',
            CASE WHEN i.name IS NULL OR i.name = '' THEN '(无题目)' ELSE i.name END '题目',
            CASE i.type WHEN 0 THEN '文本' WHEN 1 THEN '输入' WHEN 2 THEN '单选' WHEN 3 THEN '多选' WHEN 4 THEN '日期' END '题型',
            CASE WHEN i.type IN (2, 3) THEN (SELECT GROUP_CONCAT(REPLACE(o.title, '\\n', ' ') ORDER BY o.qpoid SEPARATOR '\\n') FROM quotation.quotationprofileoption o WHERE o.qpiid = i.qpiid AND o.checked = 1) ELSE REPLACE(i.content, '\\n', ' ') END '答案',
            co.name '公司'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM
                quotation.quotationprofile qp
                LEFT JOIN quotation.quotationprofileitem i ON i.qpid = qp.qpid
                LEFT JOIN quotation.addreduce ar ON qp.qid = ar.arId
                LEFT JOIN data.surveytemplate st ON qp.tid = st.stid
                LEFT JOIN decoration.decoration d ON qp.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user cu ON qp.cuid = cu.uid
                LEFT JOIN communion.company co ON qp.company = co.cid
            WHERE
                %s
        """

    def rower(self, row):

        self.divNum(row, [3, 11])

        # 单选/多选答案按'\n'拆分,一勾选项一格(答案1..答案N);文本类答案单值落答案1;超出预估列数截断兜底
        answers = row[self.answerIndex] and u"%s" % row[self.answerIndex] or ""
        row[self.answerIndex:self.answerIndex + 1] = (answers.split("\n") + [""] * self.answerNum)[:self.answerNum]

        return row

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        # 集团导出: 不限制公司条件, company参数仅保留传参兼容
        self.condition = " qp.type = 5 AND qp.createTime >= '%s 00:00:00' AND qp.createTime <= '%s 23:59:59' " % (startTime, endTime)

        return self.SQL_QUERY_STR % ("%s", self.condition)

    # @功能: 实测查询范围内单题最多勾选项数, 决定答案拆分列数(答案1..答案N); 无勾选数据时返回1(单列)
    def maxAnswer(self):

        sql = """
            SELECT MAX(c) FROM (
                SELECT (SELECT COUNT(*) FROM quotation.quotationprofileoption o WHERE o.qpiid = i.qpiid AND o.checked = 1) c
                FROM quotation.quotationprofileitem i
                JOIN quotation.quotationprofile qp ON i.qpid = qp.qpid
                WHERE %s
            ) t
        """ % self.condition

        self.cursor.execute(sql)
        data = self.cursor.fetchall()

        return (data and len(data) > 0 and data[0][0] or 0) or 1

    def main(self, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "装修单号", "楼盘", "楼号", "计价面积", "设计分区", "设计部", "设计师", "类型", "业务类型",
            "付款类型", "付款状态", "总价", "标签模板", "标签名称", "创建人",
            "创建时间", "状态", "题目", "题型", "答案", "公司"
        ]
        sql = self.sqler(args, int(company))

        # 答案拆列: 列数=范围内单题最多勾选项数(执行前实测), 单值时保持单列"答案"
        self.answerNum = self.maxAnswer()
        self.answerIndex = tableHead.index("答案")
        tableHead[self.answerIndex:self.answerIndex + 1] = self.answerNum > 1 and ["答案%s" % (i + 1) for i in range(self.answerNum)] or ["答案"]

        self.exporter(pid, "", "增减单标签", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出增减单标签说明:
            根据查询条件,以分页拿数据的方式导出增减单标签(quotation.quotationprofile, type=5)信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            集团导出: 不限制公司条件, 导出全公司数据, 以"公司"列区分归属;
            增减单标签通过qp.qid关联quotation.addreduce.arId;
            行粒度为标签题目:join quotationprofileitem 后每题一行;单选/多选(type=2/3)答案按勾选项(quotationprofileoption.checked=1按qpoid序)拆列,一勾选项一格(答案1..答案N,N=范围内单题最多勾选项数执行前实测,单值时单列"答案"),文本/输入(type=0/1)答案取item.content(换行替换为空格)置于答案1;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid           information.plan的主键;
            2.args          "2024/07/01 - 2024/7/30"
            3.company       公司(集团导出: 不限制公司条件, 该参数仅保留传参兼容)
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 4991
    # args = "2024/07/01-2024/07/30"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    exporter.main(pid, args, company)
