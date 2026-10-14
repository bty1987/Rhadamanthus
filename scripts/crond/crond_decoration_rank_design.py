#!/usr/bin/python
# -*- coding:UTF-8 -*-
from plan_util import *
import datetime
import calendar

class Rank(Util):

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

        self.colum_sign = u"""
            u.uid AS `设计师ID`,
            dd.dId AS `归属部门ID`,
            dr.dId AS `归属分区ID`,
            db.`type`,
            d.company AS `公司`,
            db.rate AS `签单户数`,
            IF ( d.type = 1, d.precontractPrice * db.rate / 1000, d.orderTotalPrice * db.rate / 1000) AS `签单额`,
            IF ( d.notSalesmanRate >= 0 and d.notSalesmanRate <= 1000, IF(q.manageRate = 0 or q.manageRate is null, 0, q.managePrice / (q.manageRate + d.notSalesmanRate) * d.notSalesmanRate), d.notSalesmanRate) AS `非业务提成`,
            d.couponCut * db.rate / 1000 AS `券优惠`,
            d.thingCut * db.rate / 1000 AS `物品优惠`,
            dh.servicePaidup * db.rate / 1000 AS `服务费`, 
            IF ( d.type = 1, d.precontractPrice * db.rate / 1000, (d.orderTotalPrice - d.couponCut) * db.rate / 1000) AS `净业绩`

        """

        self.SELECT_SQL_SIGN = u"""
            SELECT
                %s
            FROM
                decoration.decoration d
                LEFT JOIN decoration.decorationholonomy dh ON d.orderId = dh.orderId
                LEFT JOIN quotation.quotation AS q ON d.orderId = q.orderId,
                communion.`user` AS u,
                communion.department AS dd,
                communion.department AS dr,
                decoration.decorationbelong AS db
            WHERE
                d.orderId = db.orderId 
                AND db.buid = u.uid 
                AND db.did = dd.did
                AND db.rid = dr.did
                AND (
                  (d.contractTime >= '%s 00:00:00' AND d.contractTime <= '%s 23:59:59' AND d.type != 1 AND q.defaults = 1) OR 
                  (d.precontractTime >= '%s 00:00:00' AND d.precontractTime <= '%s 23:59:59' AND d.type = 1))
                AND db.`status` = 0
                AND db.`type` = %s
        """

        self.colum_devise = u"""
            u.uid AS `设计师ID`,
            dd.dId AS `归属部门ID`,
            dr.dId AS `归属分区ID`,
            db.type,
            d.company AS `公司`,
            db.rate AS `设计费户数`,
            dp.referMoney * db.rate/1000 AS `设计费`
        """

        self.SELECT_SQL_DEVISE = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                communion.user u,
                communion.department AS dd,
                communion.department AS dr,
                (
                SELECT 
                    dp.orderId as orderId, 
                    dp.paymenttype, 
                    sum( IF ( dp.paymenttype = '设计费', dp.refermoney, - dp.refermoney )) AS referMoney
                FROM 
                    payment.decorationpayment dp,
                    payment.decorationreceipt pr
                WHERE
                    dp.paymentType IN ( '设计费', '设计费退款' ) AND
                    pr.collectTime > '%s 00:00:00' AND
                    pr.collecttime < '%s 23:59:59' AND
                    dp.drId = pr.drid
                GROUP BY
                    dp.orderId
                ) dp
            WHERE
                d.orderId = db.orderId 
                AND db.buid = u.uid 
                AND db.did = dd.did
                AND db.rid = dr.did
                AND d.orderId = dp.orderId
                AND db.type = %s
                AND db.status = 0
        """

        self.colum_advance = u"""
            sdu.uid AS `设计师ID`,
            sdd.did AS `部门ID`,
            sdr.did AS `分区ID`,
            d.company AS `公司`,
            IF(p.type = 1, p.recharge, -p.recharge) AS `净业绩`
        """

        self.SELECT_SQL_ADVANCE = u"""
            SELECT
                %s
            FROM
                decoration.decoration d,
                decoration.decorationbelong db,
                payment.payment p,
                payment.advancereceipt ar,
                communion.user sdu,
                communion.department sdd,
                communion.department sdr
            WHERE
                d.orderId = p.orderId
                AND d.orderId = db.orderId
                AND p.arid = ar.arid
                AND db.buid = sdu.uid
                AND db.did = sdd.did
                AND db.rid = sdr.did
                AND p.type IN (0, 1)
                AND p.paymentType = 2
                AND db.type = 0
                AND db.status = 0
                AND db.defaultflag = 1
                AND ar.collecttime >= '%s 00:00:00'
                AND ar.collecttime <= '%s 23:59:59'
        """

        self.colum_balance = u"""
            du.uid AS `设计师ID`,
            dd.did AS `部门ID`,
            dr.did AS `分区ID`,
            d.company AS `公司`,
            IF(sp.type in (2, 3, 8), (sr.cash + sr.bank + sr.checkv), -(sr.cash + sr.bank + sr.checkv)) AS `净业绩`
        """

        self.SELECT_SQL_BALANCE = u"""
            SELECT
                %s
            FROM
                payment.salespayment sp,
                payment.salesreceipt sr,
                decoration.decoration d,
                sales.sales s,
                communion.user du,
                communion.department dd,
                communion.department dr
            WHERE
                sp.srid = sr.srid
                AND sp.sid = s.sid
                AND s.orderId = d.orderId
                AND d.dsuid = du.uid
                AND du.deptId = dd.did
                AND dd.fdid = dr.did
                AND sr.collectTime >= '%s 00:00:00'
                AND sr.collectTime <= '%s 23:59:59'
                AND (sp.type in (2, 3, 8) OR (sp.type in (4, 5, 6, 7) and sr.coupon != 0))
        """

        self.SELECT_SQL_DU_RANK1 ="""
            REPLACE INTO 
                report.decorationrank (duid, ddid, drid, month, type, rank, %s, company, rank2, rank3, sachi, %s, srankd, srankr, tachi, %s, trankd, trankr)
            SELECT 
                s1.duid, 
                s1.ddid, 
                s1.drid, 
                s1.month,
                s1.type,
                s1.rank, 
                @rank := IF(@did = s1.company, @rank + 1, 1) AS %s, 
                @did := IF(@did != s1.company, s1.company, @did) company,
                s1.rank2,
                s1.rank3,
                s1.sachi,
                s1.%s,
                s1.srankd,
                s1.srankr,
                s1.tachi,
                s1.%s,
                s1.trankd,
                s1.trankr
            FROM 
                report.decorationrank s1, 
                (SELECT @rank := 0, @did := -1) r 
            WHERE 
                s1.month = %s 
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.%s DESC
        """

        self.SELECT_SQL_DU_RANK2 ="""
            REPLACE INTO 
                report.decorationrank (duid, drid, month, type, rank, rank1, %s, ddid, rank3, company, sachi, sranku, %s, srankr, tachi, tranku, %s, trankr)
            SELECT 
                s1.duid, 
                s1.drid, 
                s1.month,
                s1.type,
                s1.rank, 
                s1.rank1, 
                @rank := IF(@did = s1.ddid, @rank + 1, 1) AS %s, 
                @did := IF(@did != s1.ddid, s1.ddid, @did) ddid, 
                s1.rank3,
                s1.company,
                s1.sachi,
                s1.sranku,
                s1.%s,
                s1.srankr,
                s1.tachi,
                s1.tranku,
                s1.%s,
                s1.trankr
            FROM 
                report.decorationrank s1, 
                (SELECT @rank := 0, @did := -1) r 
            WHERE 
                s1.month = %s 
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.ddid, 
                s1.%s DESC
        """

        self.SELECT_SQL_DU_RANK3 ="""
            REPLACE INTO 
                report.decorationrank (duid, ddid, month, type, rank, rank1, rank2, %s, drid, company, sachi, sranku, srankd, %s, tachi, tranku, trankd, %s)
            SELECT 
                s1.duid, 
                s1.ddid, 
                s1.month,
                s1.type,
                s1.rank, 
                s1.rank1,
                s1.rank2,
                @rank := IF(@did = s1.drid, @rank + 1, 1) AS %s, 
                @did := IF(@did != s1.drid, s1.drid, @did) drid,
                s1.company,
                s1.sachi,
                s1.sranku,
                s1.srankd,
                s1.%s,
                s1.tachi,
                s1.tranku,
                s1.trankd,
                s1.%s
            FROM 
                report.decorationrank s1, 
                (SELECT @rank := 0, @did := -1) r
            WHERE 
                s1.month = %s 
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.drid, 
                s1.%s DESC
        """

        self.SELECT_SQL_DD_RANK1 ="""
            REPLACE INTO 
                report.decorationdepartmentrank (ddid, drid, month, type, rank, %s, company, rank2, sachi, %s, srankr, tachi, %s, trankr)
            SELECT 
                s1.ddid, 
                s1.drid, 
                s1.month,
                s1.type,
                s1.rank, 
                @rank := if(@did = s1.company, @rank + 1, 1) AS %s, 
                @did := if(@did != s1.company, s1.company, @did) company,
                s1.rank2,
                s1.sachi,
                s1.%s,
                s1.srankr,
                s1.tachi,
                s1.%s,
                s1.trankr
            FROM 
                report.decorationdepartmentrank s1, 
                (SELECT @rank := 0, @did := -1) r 
            WHERE
                s1.month = %s
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.%s DESC
        """

        self.SELECT_SQL_DD_RANK2 ="""
            REPLACE INTO 
                report.decorationdepartmentrank (ddid, month, type, rank, rank1, %s, drid, company, sachi, srankd, %s, tachi, trankd, %s)
            SELECT 
                s1.ddid, 
                s1.month, 
                s1.type,
                s1.rank, 
                s1.rank1,
                @rank := if(@did = s1.drid, @rank + 1, 1) AS %s, 
                @did := if(@did != s1.drid, s1.drid, @did) drid,
                s1.company,
                s1.sachi,
                s1.srankd,
                s1.%s,
                s1.tachi,
                s1.trankd,
                s1.%s
            FROM 
                report.decorationdepartmentrank s1, 
                (SELECT @rank := 0, @did := -1) r
            WHERE
                s1.month = %s
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.drid, 
                s1.%s DESC
        """

        self.SELECT_SQL_DR_RANK1 ="""
            REPLACE INTO 
                report.decorationregionrank (drid, month, type, rank, %s, company, sachi, %s, tachi, %s)
            SELECT 
                s1.drid, 
                s1.month, 
                s1.type,
                s1.rank, 
                @rank := if(@did = s1.company, @rank + 1, 1) AS %s, 
                @did := if(@did != s1.company, s1.company, @did) company,
                s1.sachi,
                s1.%s,
                s1.tachi,
                s1.%s
            FROM 
                report.decorationregionrank s1, 
                (SELECT @rank := 0, @did := -1) r
            WHERE
                s1.month = %s
                AND s1.type = %s
            ORDER BY 
                s1.company, 
                s1.%s DESC
        """

    def replace(self, outside, resultsu, decorationRank):

        for results in resultsu:

            keys = []
            values = []

            for key in results:
                if key in decorationRank:
                    keys.append(key)
                    values.append(str(results[key] if results[key] else 0))

            REP_SQL = "REPLACE INTO report.%s (%s) VALUES (%s);" % (outside, ",".join(keys), ",".join(values))
            # print(REP_SQL)
            self.cursor.execute(REP_SQL)
            self.commit()

    def groupBy(self, decorationSigns, decorationDevises, decorationMaterials, month, str_1, str_2):
        results = []

        # rank 总业绩
        fields = ["duid", "ddid", "drid", "type", "company", "签单户数", "签单额", "非业务提成", "券优惠", "物品优惠", "服务费",
                  "净业绩"]

        for decorationsign in decorationSigns:
            _ = dict(zip(fields, decorationsign))
            index = 0

            for result in results:

                if (_[str_1] == result[str_1] and _[str_2] == result[str_2] and _["drid"] == result["drid"]  and _["company"] == result["company"] ):
                    index = 1

                    _["服务费"] = _["服务费"] if _["服务费"] else 0
                    _["非业务提成"] = _["非业务提成"] if _["非业务提成"] else 0

                    _["month"] = month
                    _["rank"] = int(_["净业绩"])- int(_["非业务提成"]) - int(_["物品优惠"]) + int(_["服务费"]) + int(result["rank"])
                    _["tachi"] = _["rank"]
                    _["净业绩"] = int(_["净业绩"]) - int(_["非业务提成"]) - int(_["物品优惠"]) + int(result["净业绩"])

                    _["服务费"] = int(_["服务费"]) + int(result["服务费"])
                    _["券优惠"] = int(_["券优惠"]) + int(result["券优惠"])
                    _["签单额"] = int(_["签单额"]) + int(result["签单额"])
                    _["签单户数"] = int(_["签单户数"]) + int(result["签单户数"])
                    _["物品优惠"] = int(_["物品优惠"]) + int(result["物品优惠"])
                    _["非业务提成"] = int(_["非业务提成"]) + int(result["非业务提成"])

                    result.update(_)

            if (index == 0):

                _["设计费"] = 0
                _["设计户数"] = 0
                _["服务费"] = _["服务费"] if _["服务费"] else 0
                _["非业务提成"] = _["非业务提成"] if _["非业务提成"] else 0
                _["净业绩"] = int(_["净业绩"]) - int(_["非业务提成"]) - int(_["物品优惠"])
                _["rank"] = int(_["净业绩"]) + int(_["服务费"])
                _["month"] = month
                _["sachi"] = 0
                _["tachi"] = _["rank"]

                results.append(_)

        fields = ["duid", "ddid", "drid", "type", "company", "设计户数", "设计费"]

        for decorationDevise in decorationDevises:
            _ = dict(zip(fields, decorationDevise))
            index = 0

            for result in results:

                if (_[str_1] == result[str_1] and _[str_2] == result[str_2] and _["drid"] == result["drid"] and _["company"] == result["company"]):
                    index = 1

                    _["month"] = month
                    _["tachi"] = int(_["设计费"]) + int(result["rank"]) + int(result["sachi"])
                    _["rank"] = int(result["rank"]) + int(_["设计费"])
                    _["设计费"] = int(_["设计费"]) + int(result["设计费"])
                    _["设计户数"] = int(_["设计户数"]) + int(result["设计户数"])

                    result.update(_)

            if (index == 0):

                _["券优惠"] = 0
                _["服务费"] = 0
                _["净业绩"] = 0
                _["签单额"] = 0
                _["签单户数"] = 0
                _["物品优惠"] = 0
                _["非业务提成"] = 0
                _["sachi"] = 0

                _["rank"] = _["设计费"]
                _["tachi"] = _["rank"]
                _["month"] = month

                results.append(_)

        fields = ["duid", "ddid", "drid", "company", "sachi"]

        for decorationMaterial in decorationMaterials:
            _ = dict(zip(fields, decorationMaterial))
            index = 0

            for result in results:
                if (_[str_1] == result[str_1] and _[str_2] == result[str_2] and _["company"] == result["company"]):
                    index = 1

                    _["sachi"] = _["sachi"] if _["sachi"] else 0
                    _["tachi"] = int(_["sachi"]) + int(result["rank"]) + int(result["sachi"])
                    _["sachi"] = int(_["sachi"]) + int(result["sachi"])

                    result.update(_)
            if (index == 0):

                _["month"] = month
                _["rank"] = 0
                _["type"] = 0
                _["sachi"] = _["sachi"] if _["sachi"] else 0
                _["tachi"] = _["sachi"]

                results.append(_)

        return results

    def main(self, start, end, month):

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        sqlcount1 = self.SELECT_SQL_SIGN % ("count(*)", start, end, start, end, 0)
        sqlcount2 = self.SELECT_SQL_DEVISE % ("count(*)", start, end, 0)
        sqlcount3 = self.SELECT_SQL_SIGN % ("count(*)", start, end, start, end, 1)
        sqlcount4 = self.SELECT_SQL_DEVISE % ("count(*)", start, end, 1)

        sqlcount5 = self.SELECT_SQL_ADVANCE % ("count(*)", start, end)
        sqlcount6 = self.SELECT_SQL_BALANCE % ("count(*)", start, end)

        count = self.count(sqlcount1) + self.count(sqlcount2) + self.count(sqlcount3) + self.count(sqlcount4) + self.count(sqlcount5) + self.count(sqlcount6)

        if count == 0:
            raise RuntimeError(u'The query result is zero!')

        sql1 = self.SELECT_SQL_SIGN % (self.colum_sign, start, end, start, end, 0)
        sql2 = self.SELECT_SQL_DEVISE % (self.colum_devise, start, end, 0)

        sql3 = self.SELECT_SQL_SIGN % (self.colum_sign, start, end, start, end, 1)
        sql4 = self.SELECT_SQL_DEVISE % (self.colum_devise, start, end, 1)

        sql5 = self.SELECT_SQL_ADVANCE % (self.colum_advance, start, end)
        sql6 = self.SELECT_SQL_BALANCE % (self.colum_balance, start, end)

        self.cursor.execute(sql1)

        decorationDesignSigns = self.cursor.fetchall()

        self.cursor.execute(sql2)

        decorationDesignDevises = self.cursor.fetchall()

        self.cursor.execute(sql3)

        decorationSalesSigns = self.cursor.fetchall()

        self.cursor.execute(sql4)

        decorationSalesDevises = self.cursor.fetchall()

        self.cursor.execute(sql5)

        decorationAdvance = self.cursor.fetchall()

        self.cursor.execute(sql6)

        decorationBalance = self.cursor.fetchall()

        decorationMaterial = list(decorationAdvance + decorationBalance)

        resultDesignSu = self.groupBy(decorationDesignSigns, decorationDesignDevises, decorationMaterial, month, "duid", "ddid")
        resultDesignSd = self.groupBy(decorationDesignSigns, decorationDesignDevises, decorationMaterial, month, "ddid", "drid")
        resultDesignSr = self.groupBy(decorationDesignSigns, decorationDesignDevises, decorationMaterial, month, "drid", "drid")

        resultDesignSu.sort(key=lambda x: x['rank'], reverse=True)
        resultDesignSd.sort(key=lambda x: x['rank'], reverse=True)
        resultDesignSr.sort(key=lambda x: x['rank'], reverse=True)

        self.replace("decorationRank", resultDesignSu, ["drid", "ddid", "duid", "month", "type", "rank", "sachi", "tachi","company"])
        self.replace("decorationDepartmentRank", resultDesignSd, ["ddid", "drid", "month","type", "rank", "sachi", "tachi", "company"])
        self.replace("decorationRegionRank", resultDesignSr, ["drid", "month", "type", "rank", "sachi", "tachi", "company"])

        resultSalesSu = self.groupBy(decorationSalesSigns, decorationSalesDevises, [], month, "duid", "ddid")
        resultSalesSd = self.groupBy(decorationSalesSigns, decorationSalesDevises, [], month, "ddid", "drid")
        resultSalesSr = self.groupBy(decorationSalesSigns, decorationSalesDevises, [], month, "drid", "drid")

        resultSalesSu.sort(key=lambda x: x['rank'], reverse=True)
        resultSalesSd.sort(key=lambda x: x['rank'], reverse=True)
        resultSalesSr.sort(key=lambda x: x['rank'], reverse=True)

        self.replace("decorationRank", resultSalesSu, ["drid", "ddid", "duid", "month", "type", "rank","company"])
        self.replace("decorationDepartmentRank", resultSalesSd, ["ddid", "drid", "month","type", "rank", "company"])
        self.replace("decorationRegionRank", resultSalesSr, ["drid", "month", "type", "rank", "company"])

        self.cursor.execute(self.SELECT_SQL_DU_RANK1 % ("rank1", "sranku", "tranku", "rank1", "sranku", "tranku", month, 0, "rank"))# 更新设计业绩人员排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK2 % ("rank2", "srankd", "trankd", "rank2", "srankd", "trankd", month, 0, "rank"))# 更新设计业绩个人在部门内排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK3 % ("rank3", "srankr", "trankr", "rank3", "srankr", "trankr", month, 0, "rank"))# 更新设计业绩个人在分区内排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK1 % ("rank1", "srankd", "trankd", "rank1", "srankd", "trankd", month, 0, "rank"))# 更新设计业绩部门排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK2 % ("rank2", "srankr", "trankr", "rank2", "srankr", "trankr", month, 0, "rank"))# 更新设计业绩部门在分区排名
        self.cursor.execute(self.SELECT_SQL_DR_RANK1 % ("rank1", "srankr", "trankr", "rank1", "srankr", "trankr", month, 0, "rank"))# 更新设计业绩分区排名

        self.cursor.execute(self.SELECT_SQL_DU_RANK1 % ("rank1", "sranku", "tranku", "rank1", "sranku", "tranku", month, 1, "rank"))# 更新业务业绩人员排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK2 % ("rank2", "srankd", "trankd", "rank2", "srankd", "trankd", month, 1, "rank"))# 更新业务业绩个人在部门内排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK3 % ("rank3", "srankr", "trankr", "rank3", "srankr", "trankr", month, 1, "rank"))# 更新业务业绩个人在分区内排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK1 % ("rank1", "srankd", "trankd", "rank1", "srankd", "trankd", month, 1, "rank"))# 更新业务业绩部门排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK2 % ("rank2", "srankr", "trankr", "rank2", "srankr", "trankr", month, 1, "rank"))# 更新业务业绩部门在分区排名
        self.cursor.execute(self.SELECT_SQL_DR_RANK1 % ("rank1", "srankr", "trankr", "rank1", "srankr", "trankr", month, 1, "rank"))# 更新业务业绩分区排名

        self.cursor.execute(self.SELECT_SQL_DU_RANK1 % ("sranku", "rank1", "tranku", "sranku", "rank1", "tranku", month, 0, "sachi"))# 更新主材业绩人员排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK2 % ("srankd", "rank2", "trankd", "srankd", "rank2", "trankd", month, 0, "sachi"))# 更新主材业绩个人在部门内排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK3 % ("srankr", "rank3", "trankr", "srankr", "rank3", "trankd", month, 0, "sachi"))# 更新主材业绩个人在分区内排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK1 % ("srankd", "rank1", "trankd", "srankd", "rank1", "trankd", month, 0, "sachi"))# 更新主材业绩部门排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK2 % ("srankr", "rank2", "trankr", "srankr", "rank2", "trankr", month, 0, "sachi"))# 更新主材业绩部门在分区排名
        self.cursor.execute(self.SELECT_SQL_DR_RANK1 % ("srankr", "rank1", "trankr", "srankr", "rank1", "trankr", month, 0, "sachi"))# 更新主材业绩分区排名

        self.cursor.execute(self.SELECT_SQL_DU_RANK1 % ("tranku", "rank1", "sranku", "tranku", "rank1", "sranku", month, 0, "tachi"))# 更新总业绩人员排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK2 % ("trankd", "rank2", "srankd", "trankd", "rank2", "srankd", month, 0, "tachi"))# 更新总业绩个人在部门内排名
        self.cursor.execute(self.SELECT_SQL_DU_RANK3 % ("trankr", "rank3", "srankr", "trankr", "rank3", "srankr", month, 0, "tachi"))# 更新总业绩个人在分区内排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK1 % ("trankd", "rank1", "srankd", "trankd", "rank1", "srankd", month, 0, "tachi"))# 更新总业绩部门排名
        self.cursor.execute(self.SELECT_SQL_DD_RANK2 % ("trankr", "rank2", "srankr", "trankr", "rank2", "srankr", month, 0, "tachi"))# 更新总业绩部门在分区排名
        self.cursor.execute(self.SELECT_SQL_DR_RANK1 % ("trankr", "rank1", "srankr", "trankr", "rank1", "srankr", month, 0, "tachi"))# 更新总业绩分区排名

        self.commit()

if __name__ == '__main__':

    """
        设计师签单业绩排名脚本说明:
        根据当前月份查询,以分页拿数据的方式计算设计师签单业绩排名信息,并上传到数据库中;
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")
    
    rank = Rank(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    
    if len(sys.argv) == 2:
    
        month = sys.argv[1]
        
        curtime = datetime.datetime.strptime(month, "%Y-%m")
        
        month = curtime.strftime("%Y%m")
        
        last_day = calendar.monthrange(curtime.year, curtime.month)[1]
        start = datetime.date(curtime.year, curtime.month, 1)
        end = datetime.date(curtime.year, curtime.month, last_day)
        
        rank.main(start, end, month)
    else:
        
        curtime = datetime.datetime.now()  # 当天日期
        
        month = curtime.strftime("%Y%m")

        last_day = calendar.monthrange(curtime.year, curtime.month)[1]
        start = datetime.date(curtime.year, curtime.month, 1)
        end = datetime.date(curtime.year, curtime.month, last_day)

        # start = "2023-07-01"
        # end = "2023-07-30"
        # month = 202307

        rank.main(start, end, month)