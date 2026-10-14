#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import os
import sys
import calendar
import datetime
import time
from dateutil.relativedelta import relativedelta

import pymysql


class Decoration7operation():

    SQL_INSERT_INTO_DECORATION7OPERATION = """
        INSERT INTO 
            report.decoration7operation
            (s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20,s21,s22,s23,s24,s25,s26,s27,s28,s29,s30,s31,s32,s33,s34,s35,s36,s37,s38,s39,s40,s41,s42,s43,s44,s45,s46,s47,s48,s49,s50,s51,s52,s53,s54,s55,s56,s57,s58,s59,s60,s61,s62) 
        SELECT
            d.orderId AS `装修单号`,
            d.precontractTime AS `预签时间`,
            d.contractTime AS `签单时间`,
            d.accountTime AS `决算时间`,
            d.typeness AS `订单类型`,
            d.houseType AS `房屋类别`,
            IF(d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.notSalesmanRate AS `非业务比例`,
            d.precontractPrice AS `预签额`,
            d.orderTotalPrice AS `签单额`,
            d.factPrice AS `实收额`,
            d.couponCut AS 计业绩券,
            SUM(IF( dai.type != 1 AND dai.isPayment != 1 AND dai.state in (0,2,4,5,6), (dai.money * dai.num)/1000, 0)) AS `计金额券`,
            SUM(IF( dai.type != 1 AND dai.stateType = 4 AND dai.state in (0,2,4,5,6), (dai.money * dai.num)/1000, 0)) AS `特批券`,
            d.thingCut AS `物品`,
            dh.servicePrice AS `服务费`,
            dh.materialPrice AS `主材总额`,
            IF(d.orderTotalPrice,d.orderTotalPrice,d.precontractPrice) AS `最终签单额`,
            sj.referMoney AS `设计费`,
            q.totalPrice AS `报价总额`,
            (q.undisPrice + q.disPrice + q.managePrice + q.trafficPrice) AS `折前总价`,
            q.undisPrice AS `不打折总额`,
            q.disPrice AS `打折总额`,
            q.trafficPrice AS `车运费`,
            q.managePrice AS `管理费`,
            q.manageRate AS `管理费提点`,
            q.trafficPrice AS `运输费`,
            bt.`name` AS `业务类型`,
            d.projectStatus AS `工程状态`,
            d.svuid AS `监理ID`,
            d.paySacle AS `付款比例`,
            d.grade AS `订单等级`,
            d.quid AS `报价员ID`,
            d.houseClass AS `房屋类型`,
            sf.referMoney AS `首付款`,
            sfpr.collectTime AS `收款时间`,
            sfpr.coupon AS `券值`,
            sfpr.couponInfo AS `券信息`,
            sfe.referMoney AS `首付二期款`,
            sfepr.collectTime AS `收款时间`,
            sfepr.coupon AS `券值`,
            sfepr.couponInfo AS `券信息`,
            eq.referMoney AS `二期款`,
            eqpr.collectTime AS `收款时间`,
            eqpr.coupon AS `券值`,
            eqpr.couponInfo AS `券信息`,
            wk.referMoney AS `尾款`,
            wkpr.collectTime AS `尾款时间`,
            wkpr.coupon AS `券值`,
            wkpr.couponInfo AS `券信息`,
            wy.referMoney AS `违约金`,
            yfy.balance AS `预付款余额`,
            (SELECT SUM(referMoney) FROM payment.decorationpayment wfj WHERE wfj.paymentStatus = 0  AND wfj.onetype = 0 AND wfj.twotype = 1 AND wfj.orderId= d.orderId) AS `未付款金额`,
            zb.referMoney AS `满减金额`,
            IF(d.precontractTime IS NULL,EXTRACT(month FROM d.contractTime),EXTRACT(month FROM d.precontractTime)) AS `业绩归属月份`,
            EXTRACT(month FROM ddo.operateTime) AS `发生月`,
            ddo.atttype AS `操作业务类型` ,
            ddo.buid AS `归属人ID`,
            ddo.bdid AS `归属部门ID`,
            ddo.brid AS `归属分区ID`,
            ddo.type AS `当前操作类型`,
            ddo.operateTime AS `当前操作时间`,
            ddo.rate AS `比例`
        FROM
            decoration.decorationoperate AS ddo,
            decoration.decoration AS d 
            LEFT JOIN payment.decorationpayment AS sf ON d.orderId = sf.orderId AND sf.paymentType = '首付款' LEFT JOIN payment.decorationreceipt AS sfpr on sf.drId = sfpr.drId
            LEFT JOIN payment.decorationpayment AS sfe ON d.orderId = sfe.orderId AND sfe.paymentType = '首付二期款' LEFT JOIN payment.decorationreceipt AS sfepr on sfe.drId = sfepr.drId
            LEFT JOIN payment.decorationpayment AS eq ON d.orderId = eq.orderId AND eq.paymentType = '二期款' LEFT JOIN payment.decorationreceipt AS eqpr on eq.drId = eqpr.drId
            LEFT JOIN payment.decorationpayment AS wk ON d.orderId = wk.orderId AND wk.paymentType = '尾款' LEFT JOIN payment.decorationreceipt AS wkpr on wk.drId = wkpr.drId
            LEFT JOIN payment.decorationpayment AS wy ON d.orderId = wy.orderId AND wy.paymentType = '违约金'
            LEFT JOIN payment.decorationpayment AS sj ON d.orderId = sj.orderId AND sj.paymentType = '设计费'
            LEFT JOIN payment.decorationpayment AS zb ON d.orderId = zb.orderId AND zb.paymentType = '质保金'
            LEFT JOIN decoration.decorationholonomy AS dh ON d.orderId = dh.orderid
            LEFT JOIN payment.advancepayment AS yfy ON d.orderId = yfy.orderId
            LEFT JOIN decoration.decorationactivityitem AS dai ON d.orderId = dai.orderId,
            data.decorationbusitype AS bt,
            quotation.quotation AS q
        WHERE
            ddo.orderId = d.orderId 
            AND d.busitype = bt.dbid 
            AND d.orderId = q.orderId 
            AND q.defaults = 1 
            AND ddo.type IN (3, 5, 6)
            AND ddo.operateTime >= '%s 00:00:00' 
            AND ddo.operateTime <= '%s 23:59:59' 
        GROUP BY
            ddo.doid;
        """

    def __init__(self, dbconf):

        self.host = dbconf.get("host")
        self.username = dbconf.get("username")
        self.password = dbconf.get("password")
        self.charset = dbconf.get("charset")

        self.dbconn = None
        self.cursor = None
        
    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

    def getDBCursor(self):
    
        if not self.dbconn:
            self.openDBConnect()

        self.cursor = self.dbconn.cursor()

    def closeDBConnect(self):
    
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None

    def commit(self):
        self.dbconn and self.dbconn.commit()

    def automatic(self):

        # 获取昨天日期
        yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        self.getDBCursor()

        sql = self.SQL_INSERT_INTO_DECORATION7OPERATION % (yesterday, yesterday)
        self.cursor.execute(sql)
        self.commit()

        self.closeDBConnect()

    def manual(self, args):

        startTime, endTime = args.split("-")
        self.getDBCursor()

        sql = self.SQL_INSERT_INTO_DECORATION7OPERATION % (startTime, endTime)

        self.cursor.execute(sql)
        self.commit()

        self.closeDBConnect()


if __name__ == '__main__':

    """
        1.脚本说明: 每天执行记录昨日业绩

        2.本脚本命令为:
        python3 /home/fanglin/cronbin/crond_decoration_operation_collecter.py

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    decoration7operation = Decoration7operation(config.get("database"))

    callback = sys.argv[1]

    # callback = "automatic"
    # callback = "manual"

    if callback == 'automatic':

        getattr(decoration7operation, callback)()
    elif callback == 'manual':

        # args = '2022/11/01-2022/11/30'
        args = sys.argv[2]

        getattr(decoration7operation, callback)(args)
    elif callback == 'help':
        print ('python es_decoration_operation_collecter.py automatic')
        print ('python es_decoration_operation_collecter.py manual <2022/11/01-2022/11/30>')
    else:
        sys.exit()