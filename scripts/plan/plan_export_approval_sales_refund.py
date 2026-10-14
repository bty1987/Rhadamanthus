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

        self.status = {
            0: u"初始",
            1: u"审批通过",
            2: u"审批拒绝",
            3: u"审批中",
            4: u"发起失败"
        }

        self.type = {
            1: u"退货",
            2: u"全退",
            3: u"倒单"
        }

        self.colum = u"""
            sal.orderId,
            cc.name,
			v.`name`,
            h.houseNumber,
            sal.`no`,
            c.`name`,
            sal.brand,
            u.userId,
            u.currentName,
            d.`name`,
            da.`name`,
            sal.total,
            sal.amount,
            apr.refund,
            ua.currentName,
            ur.userName,
			apr.type,
            app.createTime,
            app.approvalTime,
            app.`status`,
            app.contents,
            app.`comment`,
            app.annotate,
            b.kino AS '金蝶编号',
            b.kiname AS '金蝶名称'
            
        """

        self.SQL_APPROVAL_APPROVALSALESREFUND = u"""
            select 
                %s
            from 
               	approval.approvalsalesrefund AS apr
                LEFT JOIN approval.approval AS app on apr.aid = app.aid
                LEFT JOIN sales.sales AS sal ON apr.sid = sal.sid
                LEFT JOIN communion.house AS h ON sal.hid = h.hid
				LEFT JOIN communion.village AS v ON h.vid = v.vid
                LEFT JOIN communion.`user` as u on sal.suid = u.uid
                LEFT JOIN communion.`user` as ua on app.suid = ua.uid
                LEFT JOIN communion.`user` as ur on app.ruid = ur.uid
                LEFT JOIN communion.department as da on sal.did = da.dId
                LEFT JOIN communion.department as d on sal.rid = d.dId
                LEFT JOIN communion.company as c on c.cid = sal.company
                LEFT JOIN communion.company cc ON sal.dompany = cc.cid
                LEFT JOIN communion.brand b ON sal.bid = b.bid
            WHERE
                app.approvalTime BETWEEN '%s 00:00:00' AND '%s 23:59:59'
                %s
            """

    def company(self, company):

        if company != 0:
            companyId = u"AND sal.company = %s " % company
        else:
            companyId = u" "

        return companyId

    def main(self, pid, args, company):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            pageflag = True
            startTime, endTime = args.split("-")
            
            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False

            sqlcount = self.SQL_APPROVAL_APPROVALSALESREFUND % (u"count(*)", startTime, endTime, self.company(company))

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

            paln = {
                u"plan.schedule": schedule,
                u"plan.status": 4
            }

            self.updataSchedule(self.pthost, pid, paln)

            sql = self.SQL_APPROVAL_APPROVALSALESREFUND % (self.colum, startTime, endTime, self.company(company))

            workbook, sheet = self.createWorkbook(u"销售退货审批")

            tableHead = [
                u"装修单号", u"装修单公司", u"楼盘" ,u"楼号", u"销售单号", u"销售单公司", u"品牌", u"渠道ID", u"渠道", u"分区", u'部门', u'总额', u'当前总额', u'退款额',
                u'申请人', u'审批人',u'退货类型' , u'提交时间', u'审批时间', u'审批状态', u'审批说明', u"审批备注", u"审批批注", u"金蝶编号", u"金蝶名称"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)

                    self.divNum(data, [11, 12, 13])

                    if data[16]: data[16] = self.type[data[16]]
                    if data[19]: data[19] = self.status[data[19]]

                    self.createTableHead(sheet, data, count)

                    count += 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100
                paln = {
                    u"plan.schedule": int(schedules),
                    u"plan.status": 4
                }
                self.updataSchedule(self.pthost, pid, paln)

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
        导出销售退货审批记录脚本说明:
        根据查询条件,以分页拿数据的方式导出库存记录;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
            2.args        "2018/12/13-2018/12/13"
            3.company     公司:1
        2.脚本传参说明:
             plan_export_approval_sale_refund.py    pid     args                    company
             plan_export_approval_sale_refund.py     929    2018/12/01-2018/12/31       1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"),
                                                                    dbconf.get("password"),
                                                                    config.get("media"), config.get("pthost"))
    exporter.main(pid, args, int(company))
