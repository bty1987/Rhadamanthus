#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

from elasticsearch import Elasticsearch
import pymysql.cursors
import elasticsearch.helpers
import sys
import datetime, time

class ES():

    SQL_PAYMENT_DECORATION_STR = """SELECT
                decorationpayment.orderId,
                decorationpayment.paymentType,
                decorationpayment.referMoney,
                decorationreceipt.collectTime,
                NULL,
                NULL,
                userp.userName,
                village.`name`,
                house.houseNumber,
                customer.`no` 
            FROM
                payment.decorationpayment AS decorationpayment,
                payment.decorationreceipt AS decorationreceipt,
                decoration.decoration AS decorationorder,
                communion.`user` AS userp,
                communion.house AS house,
                communion.village AS village,
                communion.customer AS customer 
            WHERE
                decorationpayment.orderId = decorationorder.orderId 
                AND decorationpayment.drId = decorationreceipt.drId 
                AND decorationreceipt.cluid = userp.uid 
                AND decorationorder.hid = house.hid 
                AND house.vid = village.vid 
                AND customer.cid = decorationorder.customerId 
                AND decorationreceipt.collectTime % s 
                LIMIT % d OFFSET %d"""

    SQL_PAYMENT_MATERISL_STR = """SELECT
                ms.orderId,
                mp.paymentType,
                mp.referMoney,
                mr.collectTime,
                ms.type,
                ms.brand,
                mr.collecterName,
                village.`name`,
                house.houseNumber,
                customer.`no` 
            FROM
                material.material AS ms,
                payment.materialpayment AS mp,
                decoration.decoration AS de,
                payment.materialreceipt AS mr,
                communion.house AS house,
                communion.village AS village,
                communion.customer AS customer 
            WHERE
                ms.mid = mp.mid 
                AND ms.orderId = de.orderId 
                AND mp.mrId = mr.mrId 
                AND de.hid = house.hid 
                AND house.vid = village.vid 
                AND customer.cid = de.customerId 
                AND mr.collectTime % s 
                LIMIT % d OFFSET %d"""

    SQL_PAYMENT_SALES_STR = """SELECT
                s.orderId,
                sp.type,
                s.total,
                sr.collectTime,
                s.category,
                s.brand,
                sr.collecterName,
                cv.`name`,
                hu.houseNumber,
                cc.`no` 
            FROM
                inventory.sales AS s,
                payment.salespayment AS sp,
                payment.salesreceipt AS sr,
                communion.village AS cv,
                communion.customer AS cc,
                communion.`user` AS cu,
                communion.department AS cd,
                communion.department AS rd,
                communion.house AS hu 
            WHERE
                s.sid = sp.sid 
                AND sp.srid = sr.srid 
                AND cc.cid = s.cid 
                AND s.hid = hu.hid 
                AND hu.vid = cv.vid 
                AND s.suid = cu.uid 
                AND cd.fdid = rd.did 
                AND s.did = cd.dId 
                AND sr.collectTime % s 
                LIMIT % d OFFSET %d"""

    SQL_PAYMENT_ADVANCE_STR = """SELECT
                payment.orderId,
                payment.paymentType,
                payment.recharge,
                advancereceipt.collectTime,
                NULL,
                NULL,
                usera.username,
                village.`name`,
                house.houseNumber,
                customer.`no` 
            FROM
                payment.payment AS payment,
                payment.advancereceipt AS advancereceipt,
                decoration.decoration AS decorationorder,
                communion.`user` AS usera,
                communion.house AS house,
                communion.village AS village,
                communion.customer AS customer 
            WHERE
                payment.arId = advancereceipt.arId 
                AND payment.orderId = decorationorder.orderId 
                AND advancereceipt.cluid = usera.uid 
                AND decorationorder.hid = house.hid 
                AND house.vid = village.vid 
                AND customer.cid = decorationorder.customerId 
                AND advancereceipt.collectTime % s 
                LIMIT % d OFFSET %d"""

    SQL_PAYMENT_SERVICE_STR = """SELECT
                servicepayment.orderId,
                servicepayment.type,
                servicepayment.serviceMoney,
                servicereceipt.collectTime,
                NULL,
                NULL,
                servicereceipt.collecterName,
                village.`name`,
                house.houseNumber,
                customer.`no` 
            FROM
                payment.servicepayment,
                payment.servicereceipt,
                decoration.decoration AS decorationos,
                communion.house AS house,
                communion.village AS village,
                communion.customer AS customer 
            WHERE
                servicepayment.srid = servicereceipt.srid 
                AND servicepayment.orderId = decorationos.orderId 
                AND decorationos.hid = house.hid 
                AND house.vid = village.vid 
                AND customer.cid = decorationos.customerId 
                AND servicereceipt.collectTime % s 
                LIMIT % d OFFSET %d"""

    def __init__(self, host='', username='', password='', eshost='', charset='utf8'):

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.eshost = eshost
        self._source = ["OrderId", "PaymentType", "Money", "CollectTime", "Category", "Brand", "CollecterName", "VillageName", "VillageHousenumber" , "ClientNo"]

    def _payment(self, limit, index, sql, typename, date, startTime):

        es = Elasticsearch(self.eshost)
        connection = pymysql.connect(self.host, self.username, self.password, charset=self.charset)

        pages = 0

        startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d').strftime('%Y%m')

        with connection.cursor() as curors:

            while pages % limit == 0:

                curors.execute(sql % (date, limit, pages))

                results = curors.fetchall()

                result = list(results)

                package = []

                if len(result) == 0:
                    break

                for v in range(len(result)):

                    pages += 1

                    _sources = {}

                    [_sources.setdefault(y, datetime.datetime.strptime(result[v][x].strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S") if y == "CollectTime" else(result[v][x])) for x, y in enumerate(self._source)]

                    action = {
                        "_op_type": "index",
                        "_index": 'payment-' + index + '-' + startTime,
                        "_type": typename,
                        "_source": _sources
                    }

                    dirs = {2: ["定金", 1], 3: ["补款", 1], 4: ["退款", -1], 5: ["补款退款", -1], 6: ["券退款", -1], 7: ["定金退款", -1]}
                    dir = {0: ["收款", 1], 1: ["退款", -1]}
                    dirtype = action["_type"]
                    dir_source = action["_source"]["PaymentType"]

                    if dirtype == "material" or dirtype == "sales":

                        action["_source"]["PaymentType"] = dirs[dir_source][0]
                        if dirs[dir_source][1] < 0:
                            action["_source"]["Money"] = 0 - action["_source"]["Money"]
                    elif dirtype == "service":

                        action["_source"]["PaymentType"] = dir[dir_source][0]
                        if dir[dir_source][1] < 0:
                            action["_source"]["Money"] = 0 - action["_source"]["Money"]
                    elif dirtype == "decoration":
                        if "退款" in dir_source:
                            action["_source"]["Money"] = 0 - action["_source"]["Money"]

                    package.append(action)

                elasticsearch.helpers.bulk(es, package, raise_on_error=True)

    def time(self, startTime, endTime, num=31):
        if type(startTime) != datetime.datetime:
            if startTime.find(u"/") != -1:
                startTime = startTime.replace("/", "-")
                endTime = endTime.replace("/", "-")

            if len(startTime) == 10:
                startTime = "%s 00:00:00" % startTime
                endTime = "%s 23:59:59" % endTime

            startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')

        if endTime - startTime <= datetime.timedelta(days=num):
            return True
        else:
            return False

    def all(self, limit, index, startTime , endTime):

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')

        p = " between '%s 00:00:00' and '%s 23:59:59' " % (startTime, endTime)

        self._payment(limit, index, self.SQL_PAYMENT_SALES_STR, "sales", p, startTime)
        self._payment(limit, index, self.SQL_PAYMENT_DECORATION_STR, "decoration", p, startTime)
        self._payment(limit, index, self.SQL_PAYMENT_MATERISL_STR, "material", p, startTime)
        self._payment(limit, index, self.SQL_PAYMENT_ADVANCE_STR, "advance", p, startTime)
        self._payment(limit, index, self.SQL_PAYMENT_SERVICE_STR, "service", p, startTime)

    def current(self, limit, index):


        yesterday = datetime.datetime.today() + datetime.timedelta(-1)
        yesterday_format = yesterday.strftime('%Y-%m-%d')
        p = " between '%s 00:00:00' and '%s 23:59:59' " % (yesterday_format, yesterday_format)

        self._payment(limit, index, self.SQL_PAYMENT_SALES_STR, "sales", p, yesterday_format)
        self._payment(limit, index, self.SQL_PAYMENT_DECORATION_STR, "decoration", p, yesterday_format)
        self._payment(limit, index, self.SQL_PAYMENT_MATERISL_STR, "material", p, yesterday_format)
        self._payment(limit, index, self.SQL_PAYMENT_ADVANCE_STR, "advance", p, yesterday_format)
        self._payment(limit, index, self.SQL_PAYMENT_SERVICE_STR, "service", p, yesterday_format)

if __name__ == "__main__":

    es = ES('192.168.5.21', 'root', 'root', "192.168.5.22:9200")

    action = sys.argv[1]

    if action == 'all':
        getattr(es, action)(int(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5])
    elif action == 'current':
        getattr(es, action)(int(sys.argv[2]), sys.argv[3])
    elif action == 'help':
        print('python es_payment_collecter.py all <limit> <index> <startTime> <endTime>')
        print('python es_payment_collecter.py current <limit> <index>')
    else:
        sys.exit()

