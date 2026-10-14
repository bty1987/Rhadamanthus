# -*- encoding: utf-8 -*-

from elasticsearch import Elasticsearch
from datetime import timedelta, datetime
import elasticsearch.helpers
import datetime
import pymysql
import sys
import json

class Material():

    SQL_MATERIAL_STR = """
            SELECT
                mt.`no`,
                mt.orderId,
                co.`name`,
                salesman.uid,
                salesman.currentName,
                materialer.uid,
                materialer.currentName,
                instorer.uid,
                instorer.currentName,
                mt.category,
                mt.brand,
                region.no,
                region.name,
                dept.no,
                dept.name,
                mdept.no,
                mdept.name,
                mt.preBalanceTime,
                mt.postBalanceTime,
                mt.depositPayment,
                mt.fullPayment,
                mt.total,
                mt.distotal,
                mt.coupon,
                mt.couponInfo,
                mrpt.collectTime,
                mpay.paymentStatus,
                CASE
                        WHEN mpay.paymentStatus = 1 THEN '已收款'
                        WHEN mpay.paymentStatus = 2 THEN '已确认'
                END AS paymentStatusExplanation,
                mpay.paymentType,
                CASE
                        WHEN mpay.paymentType = 1 THEN '预付款'
                        WHEN mpay.paymentType = 2 THEN '定金'
                        WHEN mpay.paymentType = 3 THEN '补款'
                        WHEN mpay.paymentType = 4 THEN '退款'
                        WHEN mpay.paymentType = 5 THEN '补款退款'
                        WHEN mpay.paymentType = 6 THEN '券退款'
                        WHEN mpay.paymentType = 7 THEN '定金退款'
                END AS paymentTypeExplanation,
                mpay.referMoney
            FROM
                payment.materialpayment as mpay,
                payment.materialreceipt as mrpt,
                material.material as mt,
                communion.department as dept,
                communion.department as region,
                communion.department as mdept,
                communion.`user` as salesman,
                communion.`user` as materialer,
                communion.`user` as instorer,
                communion.company as co
            where 
                mt.mid = mpay.mid AND
                mt.smuid = salesman.uid AND
                mt.muid = materialer.uid AND
                mt.iuid = instorer.uid AND
                mt.departmentId = dept.dId AND
                mt.regionId = region.dId  AND
                mt.materialDeptId = mdept.dId AND
                mt.company = co.cid AND
                mpay.mrId = mrpt.mrId AND
                mpay.paymentStatus in (1,2) AND
                %s LIMIT % d OFFSET % d
        """
            
    def __init__(self, host='', username='', password='', esHost='', timeDiff='', charset='utf8'):

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.esHost = esHost
        
        self.dbconn = None
        self.cursor = None
        
        self.userCounts = {}
        self.departmentCounts = {}
        self.regionCounts = {}
        self.es = Elasticsearch(self.esHost)
        self.timeDiff = timeDiff
        self._source = ['materialNo','orderId', 'company', 'salesmanUid', 'salesmanName', 'materialUid', 'materialName', 'instorerUid', 'instorerName', 'category', 'brand', 'salesmanRegionId', 'salesmanRegionName', 'salesmanDeptId', 'salesmanDeptName', 'materialDeptId', 'materialDeptName', 'preBalanceTime', 'postBalanceTime', 'depositPayment', 'fullPayment', 'total', 'distotal', 'coupon', 'couponInfo', 'materialPaymentCollectTime', 'paymentStatus', 'paymentStatusExplanation', 'paymentType', 'paymentTypeExplanation', 'materialPaymentReferMoney']
        
    def openDBConnect(self):
        self.dbconn = pymysql.connect(self.host, self.username, self.password, charset=self.charset)
    
    def closeDBConnect(self):
        
        if self.dbconn:
            self.dbconn.close()
            self.dbconn = None
            
    def getDBCursor(self):
        
        if not self.dbconn:
            self.openDBConnect()
            
        self.cursor = self.dbconn.cursor()
        
    def commit(self):
        self.dbconn and self.dbconn.commit()
        
    def rollback(self):
        self.dbconn and self.dbconn.rollback()
        
    def searchMaterial(self, sql, date, startTime, limit):
        
        self.getDBCursor()
        
        pages = 0
        
        startTime = datetime.datetime.strptime(startTime, '%Y-%m-%d').strftime('%Y%m')

        while pages % limit == 0:
            
            self.cursor.execute(sql % (date, limit, pages))
            
            materials = self.cursor.fetchall()
            
            material = list(materials)
            
            package = []

            if len(material) == 0:
                
                break
            
            for i in range(len(material)):
                
                pages += 1
                
                _sources = {}
                
                [_sources.setdefault(y, datetime.datetime.strptime(material[i][x].strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S") - datetime.timedelta(hours=self.timeDiff) if (y == "materialPaymentCollectTime" or y == "preBalanceTime" or y == "postBalanceTime") else material[i][x]) for x, y in enumerate(self._source)]
                
                row = {
                    '_op_type': 'index',
                    '_index': 'material-' + startTime,
                    '_type': 'material',
                    '_source': _sources
                }
                
                package.append(row)

            elasticsearch.helpers.bulk(self.es, package, request_timeout=60)
            
        self.closeDBConnect()

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

    def customize_main(self, limit, startTime, endTime):

        falg = self.time(startTime, endTime)
        if falg == False:
            raise RuntimeError(u'时间范围不在1-31天之内')
        
        pdate = "(mrpt.collectTime between '%s 00:00:00' and '%s 23:59:59')" % (startTime, endTime) 
        
        self.searchMaterial(self.SQL_MATERIAL_STR, pdate, startTime, limit)
        
    def daily_main(self, limit):
        
        yesterday = datetime.date.today() + timedelta(-1)
    
        yesterday_format = yesterday.strftime('%Y-%m-%d')
        
        pdate = "(mrpt.collectTime between '%s 00:00:00' and '%s 23:59:59')" % (yesterday_format, yesterday_format) 
        
        self.searchMaterial(self.SQL_MATERIAL_STR, pdate, yesterday_format, limit)

if __name__ == "__main__":
    
    """
    1.按照指定日期查询主材信息：查询参数：
                        主材单编号，订单号，公司名称，业务员，主材员，驻店员，品类，品牌，业务员大区，业务员部门，主材部，
                        预结算时间，结算时间，定金金额，补款金额，总价，折扣总价，券值，券信息， 
                        主材款收款时间， 状态， 状态说明，款项类型， 款项类型说明 ， 主材款应收金额。
    
    2.传入参数：
        limit（必填项）： 查询条数 （50） 查询limit条数据
        startTime（可填项）：起始时间 （2018-01-01） 主材款项收款日期从startTime开始的主材信息
        endTime（可填项）：结束时间 （2018-05-01） 主材款项收款日期已endTime结束的主材信息
    
    3.开关控制：
        customize：定制。 必须传入startTime与endTime，指定查询从startTime到endTime的区间数据
        daily：每天。 不需要传递startTime与endTime，查询当天的前一天数据。
                        注：两种方式都必须传入limit。
    
    4.python es_material_collecter.py customize <limit> <startTime> <endTime>
                         例：python es_material_collecter.py customize 50 2018-01-01 2018-05-01
                         则：执行脚本，查询2018-01-01到2018-05-01的主材款项收款信息，以50条显示。
                         
      python es_material_collecter.py daily <limit>
                          例：python es_material_collecter.py daily 50 
                         则：执行脚本，查询前一天的主材款项收款信息，以50条显示。
    """
    
    config = json.load(open("config.json"))
    
    dbconf = config.get("database")

    material = Material(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("eshost"), int(config.get("timeDiff")))
    
    option = sys.argv[1]

    if option == "customize" :
        material.customize_main(int(sys.argv[2]), sys.argv[3], sys.argv[4])

    elif option == "daily" :
        material.daily_main(int(sys.argv[2]))
        
    else :
        print ('python es_material_collecter.py customize <limit> <startTime> <endTime>')
        print ('python es_material_collecter.py daily <limit>')
        sys.exit()

        