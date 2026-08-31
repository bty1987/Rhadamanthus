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
            dp.orderId '装修单号',
            v.name '楼盘',
            h.housenumber '楼号',
            h.innerarea '计价面积',
            dr.name '设计分区',
            dd.name '设计部',
            du.currentName '设计师',
            su.currentName '监理',
            dg.name '放线小组',
            dl.applayTime '申请时间',
            dl.actualTime '放线时间',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '施工图问题') '施工图问题',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '橱柜图问题') '橱柜图问题',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '效果图问题') '效果图问题',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '销售单问题') '销售单问题',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '具备开工条件截图问题') '具备开工条件截图问题',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '修改方式') '修改方式',
            (SELECT GROUP_CONCAT(DISTINCT o.title SEPARATOR '、') FROM construction.drawlineprofileitem i JOIN construction.drawlineprofileoption o ON o.dpiid = i.dpiid AND o.checked = 1 WHERE i.dpid = dp.dpid AND i.name = '审核结果') '审核结果',
            st.name '标签模板',
            cu.currentName '创建人',
            dp.createTime '创建时间',
            CASE dp.status WHEN 0 THEN '初始' WHEN 1 THEN '发送' WHEN 2 THEN '完成' END '状态',
            co.name '公司'
        """

        self.SQL_QUERY_STR = """
            SELECT
                %s
            FROM
                construction.drawlineprofile dp
                LEFT JOIN construction.drawline dl ON dp.dlid = dl.dlid
                LEFT JOIN data.drawlinegroup dg ON dl.dgid = dg.gid
                LEFT JOIN data.surveytemplate st ON dp.tid = st.stid
                LEFT JOIN decoration.decoration d ON dp.orderId = d.orderId
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.vid = v.vid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN communion.user su ON d.svuid = su.uid
                LEFT JOIN communion.user cu ON dp.cuid = cu.uid
                LEFT JOIN communion.company co ON dp.company = co.cid
            WHERE
                %s
        """

    def rower(self, row):

        self.divNum(row, [3])

        return row

    def sqler(self, args, company):

        startTime, endTime = args.split("-")

        if company != 0:
            companyId = "AND dp.company = %s " % company
        else:
            companyId = " "

        condition = " dp.createTime >= '%s 00:00:00' AND dp.createTime <= '%s 23:59:59' %s" % (startTime, endTime, companyId)

        return self.SQL_QUERY_STR % ("%s", condition)

    def main(self, pid, args, company):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        tableHead = [
            "装修单号", "楼盘", "楼号", "计价面积", "设计分区", "设计部", "设计师", "监理", "放线小组",
            "申请时间", "放线时间", "施工图问题", "橱柜图问题", "效果图问题", "销售单问题",
            "具备开工条件截图问题", "修改方式", "审核结果", "标签模板", "创建人", "创建时间", "状态", "公司"
        ]
        sql = self.sqler(args, int(company))

        self.exporter(pid, "", "放线标签", tableHead, self.colum, sql, self.rower)

if __name__ == '__main__':

    """
        导出放线标签说明:
            根据查询条件,以分页拿数据的方式导出放线标签(construction.drawlineprofile)信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            含放线方案标签与预交会标签两类模板,以"标签模板"列区分;问题项答案取标签表单勾选选项(drawlineprofileitem+drawlineprofileoption checked=1)聚合;
            dlid关联construction.drawline(259/325标签dlid=0无关联,放线小组/申请时间/放线时间为空);放线时间为YYYYMMDD整型,与导出放线脚本口径一致;
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
