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
        self.size = 400

        self.colum = u"""
            r.vrid, 
            t.orderId,
            r.cash, 
            r.bank, 
            r.bankInfo, 
            r.coupon, 
            r.couponInfo, 
            r.comment, 
            cu.userId, 
            cu.currentName, 
            r.collectTime, 
            p.mno, 
            p.type,
            p.category,
            p.brand, 
            p.money, 
            p.comment
        """

        self.SELECT_SQL = u"""
            select
                %s
            from 
                information.vpayment p,
                information.vreceipt r,
                information.vticket t,
                communion.user cu
            where 
                p.vrid = r.vrid and 
                p.mno = t.tno and
                r.cluid = cu.uId and
                t.vaid = %s and
                r.collectTime >= '%s 00:00:00' and 
                r.collectTime <= '%s 23:59:59'
        """

    def main(self, pid, vaid, args):

        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)
            
            startTime, endTime = args.split("-")
            
            checkFlag = self.controlTime(startTime, endTime)

            if checkFlag == False:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '时间范围大于31天'
                })
                return False
            
            sqlcount = self.SELECT_SQL % ("count(*)", vaid, startTime, endTime)

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

            sql = self.SELECT_SQL % (self.colum, vaid, startTime, endTime)

            workbook, sheet = self.createWorkbook(u"大活动款")

            tableHead = [
                u"收据号", u"装修单号", u"现金", u"刷卡金额", u"刷卡信息", u"优惠劵金额", u"优惠劵信息", u"收据备注", u"收款人id", u"收款人", 
                u"收款时间", u"会员号", u"收款类型", u"品类", u"品牌", u"收款金额", u"备注"
            ]

            self.createTableHead(sheet, tableHead)

            count = 1
            nowPage = 1
            flag = True
            
            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                
                    data = list(v)
                    
                    self.divNum(data, [2, 3, 5, 15])
                    
                    data[12] = self.vpaymentType[data[12]]

                    self.createTableHead(sheet, data, count)

                    count += 1

                nowPage = nowPage + 1
                if len(rows) < self.size:
                    flag = False
                    
                molecular = molecular + len(rows)
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
        导出大活动款脚本说明:
        根据查询条件,以分页拿数据的方式导出大活动票;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;

        1.参数说明参数要对应
            1.pid         information.plan的主键;
        2.脚本传参说明:
             plan_export_information_vpayment.py pid  vaid   args
             plan_export_information_vpayment.py 1    1      2018/12/01-2018/12/31
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    vaid = sys.argv[1]
    pid = sys.argv[2]
    args = sys.argv[3]

    Exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    Exporter.main(pid, vaid, args)