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
        self.size = 400

        self.colum = """
            dai.no '礼品单号',
            d.orderId '装修单号',
            co.name '公司',
            dr.name '设计分区',
            dd.name '设计部',
            du.currentName '设计师',
            dai.createtime '下单时间',
            dai.activityItemName '礼品名称',
            communion.kv('decoration', 'decoration', 'status', d.status) '装修状态',
            aws.unitPrice '礼品价格',
            dai.num/1000 '数量',
            dai.money/1000 '礼品积分',
            (dai.num/1000 * aws.unitPrice/1000) '积分小计',
            (dai.num/1000 * dai.money/1000) '实际积分',
            '2,3,5' as '核销比例',
            (dai.num/1000 * dai.money/1000) * 0.2 '运营分摊',
            (dai.num/1000 * dai.money/1000) * 0.3 '主材分摊',
            (dai.num/1000 * dai.money/1000) * 0.5 '工程分摊',
            cr.balance '剩余积分'
        """

        self.SELECT_SQL = """
        
            select
                %s
            from 
                decoration.decorationactivityitem dai 
                LEFT JOIN decoration.decoration d ON dai.orderId = d.orderId
                LEFT JOIN communion.company co ON d.company = co.cid
                LEFT JOIN communion.user du ON d.dsuid = du.uid
                LEFT JOIN communion.department dd ON du.deptid = dd.did
                LEFT JOIN communion.department dr ON dd.fdid = dr.did
                LEFT JOIN information.awardstock aws ON dai.asid = aws.asid
                LEFT JOIN customer.cppointrecord cr ON dai.no = cr.no AND cr.pointType = 2
            where 
                %s >= '%s 00:00:00' AND 
                %s <= '%s 23:59:59' AND 
                dai.no is not null
        
            SELECT
                %s
            FROM
                payment.proxypayment pp
                LEFT JOIN payment.proxyreceipt pr ON pp.prid = pr.prid
                LEFT JOIN communion.user cu ON pp.cuid = cu.uid
                LEFT JOIN communion.duty dt ON cu.did = dt.did
                LEFT JOIN communion.company co ON pp.company = co.cid
                LEFT JOIN communion.department dd ON pp.did = dd.did
                LEFT JOIN communion.department dr ON pp.rid = dr.did
            WHERE
              pp.isexpire = 0 AND
              %s >= '%s 00:00:00' AND
              %s <= '%s 23:59:59' 
        """

    def sqler(self, timeargs):

        startTime, endTime = timeargs.split("-")
        
        timetype = 'dai.createtime'

        return self.SELECT_SQL % ("%s", timetype, startTime, timetype, endTime)

    def main(self, pid, args):
    
        tableheads = [
            "礼品单号", "装修单号", "所属公司", "设计分区", "设计部", "设计师", "下单时间", "礼品名称", "装修状态", "礼品价格", 
            "数量", "礼品积分", "积分小计", "实际积分", "核销比例", "运营分摊", "主材分摊", "工程分摊", "剩余积分"
        ]
    
        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sql = exporter.sqler(args)
    
        self.exporter(pid, args, "礼品活动积分信息", tableheads, self.colum, sql, None)

if __name__ == '__main__':

    """
        导出代付款信息脚本说明:
            根据查询条件,以分页拿数据的方式导出代付款信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 3143;
        2.脚本传参说明:
            plan_export_payment_proxy.py  type   pid   args
            plan_export_payment_proxy.py  0      299   2015/01/01-2015-01-01
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    # pid = 299

    pid = sys.argv[1]
    args = sys.argv[2]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args)