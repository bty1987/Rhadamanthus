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
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM quotation.quotationprofileitem i JOIN quotation.quotationprofileoption o ON o.qpiid = i.qpiid AND o.checked = 1 WHERE i.qpid = qp.qpid AND i.name = '变更原因') '变更原因',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM quotation.quotationprofileitem i JOIN quotation.quotationprofileoption o ON o.qpiid = i.qpiid AND o.checked = 1 WHERE i.qpid = qp.qpid AND i.name = '减免原因') '减免原因',
            st.name '标签模板',
            qp.name '标签名称',
            cu.currentName '创建人',
            qp.createTime '创建时间',
            CASE qp.status WHEN 0 THEN '初始' WHEN 1 THEN '发送' WHEN 2 THEN '完成' END '状态',
            communion.kv('quotation', 'quotationprofile', 'type', qp.type) '用途',
            co.name '公司'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM
                quotation.quotationprofile qp
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

        return row

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        if company != 0:
            companyId = "AND qp.company = %s " % company
        else:
            companyId = " "

        condition = " qp.type = 5 AND qp.createTime >= '%s 00:00:00' AND qp.createTime <= '%s 23:59:59' %s" % (startTime, endTime, companyId)

        return self.SQL_QUERY_STR % ("%s", condition)

    def main(self, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "装修单号", "楼盘", "楼号", "计价面积", "设计分区", "设计部", "设计师", "类型", "业务类型",
            "付款类型", "付款状态", "总价", "变更原因", "减免原因", "标签模板", "标签名称", "创建人",
            "创建时间", "状态", "用途", "公司"
        ]
        sql = self.sqler(args, int(company))

        self.exporter(pid, "", "增减单标签", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出增减单标签说明:
            根据查询条件,以分页拿数据的方式导出增减单标签(quotation.quotationprofile, type=5)信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            增减单标签通过qp.qid关联quotation.addreduce.arId;变更原因/减免原因取标签表单勾选选项(quotationprofileitem+quotationprofileoption checked=1);
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid           information.plan的主键;
            2.args          "2024/07/01 - 2024/7/30"
            3.company       公司
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
