#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from dateutil.relativedelta import relativedelta


class Export_Sales(Util):
    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.flag = True
        self.user = {}
        self.region = {}
        self.department = {}
        self.list1 = []  # 购货
        self.colum = u"""
            s.orderId AS '装修单号',
            v.`name` AS '楼盘',
            h.houseNumber AS '楼号',
            s.`no` AS '销售单号',
            de.no AS '业务分区ID',
            de.name AS '业务分区',
            d.no AS '业务部ID',
            d.name AS '业务部',
            u.userId AS '业务员ID',
            u.userName AS '业务员',
            s.total AS '总额',
            s.coupon AS '券',
            s.maling AS '抹零',
            s.venderMaling AS '厂商抹零',
            u.uid AS '业务员UID',
            s.coupon AS `主材卷`, 
            ss.balance AS `预结算值`,
            ss.type	AS `0购1退`,
            s.company AS `公司`,
            ss.createTime AS `时间`,
            ss.sid AS 'sid',
            s.category AS `品类`,
            s.brand AS `品牌`,
            c.`name` AS `公司名`,
            cc.name AS `装修单归属公司`,
            dc.typeness AS '半包半价' ,
            dc.contractTime AS '装修单签单时间',
            u.`status` AS '业务员状态',
            ss.rid AS 'rid',
            depa.no AS '装修单业务分区ID',
            depa.name AS '装修单业务分区',
            dep.no AS '装修单业务部ID',
            dep.name AS '装修单业务部',
            uu.userId AS '装修单业务员ID',
            uu.userName AS '装修单业务员',
            uu.`status` AS '装修单业务员在离职'
        """

        self.SELECT_SALES = """
            SELECT
                %s
            FROM
                sales.sales s,
                communion.house h,
                communion.village v,
                communion.department de,
                communion.department d,
                communion.`user` u,
                sales.salesbalance ss,
                communion.company c,
                communion.company cc,
                decoration.decoration dc,
                communion.`user` uu,
                communion.department dep,
                communion.department depa
            WHERE
                s.sid = ss.sid
                AND s.hid = h.hid
                AND h.vid = v.vid
                AND s.did = d.dId
                AND s.rid = de.dId
                AND s.suid = u.uid
                AND s.company = c.cid
                AND s.dompany = cc.cid
                %s
                AND s.orderId = dc.orderId
                AND dc.smuid = uu.uid
                AND uu.deptId = dep.dId
                AND dep.fdid = depa.dId
                AND ss.createTime BETWEEN '%s' AND '%s'
           """

        # 购货
        self.BUYSQLBYPAYMENT = """
            SELECT 
                SUM(sp.referMoney) AS '定+补',
                SUM(sr.coupon)  AS '款项卷',
                sp.sid
            FROM
                payment.salespayment AS sp LEFT JOIN payment.salesreceipt AS sr ON sp.srid = sr.srid 
            WHERE
                sp.sid = %d
                AND sp.type in(2,3)
        """

        # 退货
        self.REFUND = """
            SELECT 
                sum(sr.total) AS `退款额`, 
                sum(psr.coupon) AS `款项卷`,
                sr.rid
            FROM
                sales.refunds AS sr,
                payment.salespayment AS sp LEFT   JOIN payment.salesreceipt AS psr ON sp.srid = psr.srid
            WHERE
                sr.spid = sp.spid 
                AND sr.rid = %d
        """

    def assortDate(self, v, Performance):
        uid = v[14]
        userId = v[8]
        userName = v[9]

        if uid not in self.user:
            self.user[uid] = (userId, userName, Performance)
        else:
            price = self.user[uid][2]
            sumPrice = price + Performance
            self.user[uid] = (userId, userName, sumPrice)

    def business(self, v, Performance):

        rid = v[4]
        rName = v[5]

        if rid not in self.region:
            self.region[rid] = (rid, rName, Performance)
        else:
            price = self.region[rid][2]
            sumPrice = price + Performance
            self.region[rid] = (rid, rName, sumPrice)

    def departments(self, v, Performance):
        did = v[6]
        dName = v[7]

        if did not in self.department:
            self.department[did] = (did, dName, Performance)
        else:
            price = self.department[did][2]
            sumPrice = price + Performance
            self.department[did] = (did, dName, sumPrice)

    def addSheet1(self):
        params = self.createWorkbook(u"Sheet1")

        workbook = params[0]
        sheet1 = params[1]

        tableHead = [u"装修单号", u"楼盘", u"楼号", u"销售单号", u"业务分区ID", u"业务分区", u"业务部ID", u"业务部", u"业务员ID", u"业务员",u"在职/离职", u"总额",
                     u"主材券", u"抹零", u"厂商抹零", u"款项总额", u"款项劵", u"预结算值", u"净业绩", u"复合业绩", u"类型", u"公司", u"装修单归属公司", u"品类",
                     u"品牌", u"装修单状态", u"签单时间",u"装修单业务分区ID", u"装修单业务分区", u"装修单业务部ID", u"装修单业务部", u"装修单业务员ID", u"装修单业务员",u"在职/离职"]
        self.createTableHead(sheet1, tableHead)

        portraits = 1
        for i, v in enumerate(self.list1):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet1, portraits, j, k)
            portraits = portraits + 1

        return workbook, sheet1

    def addSheet2(self, workbook):

        sheet2 = workbook.add_sheet(u"Sheet2", cell_overwrite_ok=True)
        tableHead2 = [u"业务员userId", u"业务员", u"复合业绩"]
        self.createTableHead(sheet2, tableHead2)

        self.user = self.user.values()
        self.user = sorted(self.user, key=lambda user: user[2], reverse=True)

        length = 1
        for i, v in enumerate(self.user):
            for ii, vv in enumerate(v):
                self.writeWorkbook(sheet2, length, ii, vv)
            length = length + 1

    def addSheet3(self, workbook):

        sheet3 = workbook.add_sheet(u"Sheet3", cell_overwrite_ok=True)
        tableHead3 = [u"业务分区ID", u"业务分区", u"复合业绩"]
        self.createTableHead(sheet3, tableHead3)

        self.region = self.region.values()
        self.region = sorted(self.region, key=lambda region: region[2], reverse=True)
        length = 1
        for i, v in enumerate(self.region):
            for ri, rv in enumerate(v):
                self.writeWorkbook(sheet3, length, ri, rv)
            length = length + 1

    def addSheet4(self, workbook):

        sheet4 = workbook.add_sheet(u"Sheet4", cell_overwrite_ok=True)
        tableHead4 = [u"业务部ID", u"业务部", u"复合业绩"]
        self.createTableHead(sheet4, tableHead4)

        self.department = self.department.values()
        self.department = sorted(self.department, key=lambda department: department[2], reverse=True)

        length = 1
        for i, v in enumerate(self.department):
            for di, dv in enumerate(v):
                self.writeWorkbook(sheet4, length, di, dv)
            length = length + 1

    def Ranking(self, v, Performance):
        self.assortDate(v, Performance)
        self.business(v, Performance)
        self.departments(v, Performance)

    def executeSQL(self, sql):

        self.cursor.execute(sql)
        data = self.cursor.fetchall()

        return data

    def getBuybyzero(self, sid):

        sql = self.BUYSQLBYPAYMENT % (sid)
        data = self.executeSQL(sql)

        referMoney = data[0][0]
        coupon = data[0][1]

        return referMoney, coupon

    def backGoods(self, rid):

        sql = self.REFUND % (rid)
        data = self.executeSQL(sql)

        total = data[0][0]  # 退款额
        coupon = data[0][1]  # 款项卷

        return total, coupon

    def main(self, pid, startTime, endTime, dompany):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            dompanyId = " "
            if dompany != 0:
                dompanyId = "AND s.dompany = %s" % dompany

            countSQL = self.SELECT_SALES % (u"count(*)", dompanyId, startTime, endTime)

            count = self.count(countSQL)

            if count == 0:
                raise RuntimeError(u'The query result is zero!')

            all = count / 0.8

            molecular = all * 0.1

            schedule = (molecular / all) * 100

            paln = {
                u"plan.schedule": int(schedule),
                u"plan.status": 4
            }
            self.updataSchedule(self.pthost, pid, paln)

            sql = self.SELECT_SALES % (self.colum, dompanyId, startTime, endTime)
            nowPage = 1
            flag = True

            startTimes = startTime + datetime.timedelta(days=1)  #当月2日

            endTimess = endTime - datetime.timedelta(days=1)    #当月月末

            while (flag):

                data = self.page(sql, nowPage, size=200)

                for i, v in enumerate(data):
                    v = list(v)
                    self.divNum(v, [10, 11, 12, 13, 15, 16])
                    
                    orderId = v[0]  # 装修单号
                    name = v[1]  # 楼盘
                    houseNumber = v[2]  # 楼号
                    no = v[3]  # 销售单号
                    deptId = v[4]  # 业务分区ID
                    deptName = v[5]  # 业务分区
                    ydeptId = v[6]  # 业务部ID
                    ydeptName = v[7]  # 业务部
                    userId = v[8]  # 业务员ID
                    userName = v[9]  # 业务员
                    total = v[10]  # 总额
                    coupons = v[11]  # 券
                    maling = v[12]  # 抹零
                    venderMaling = v[13]  # 厂商抹零
                    sid = v[20]
                    coupon = float(v[15])  # 主材卷
                    balance = float(v[16])  # 预结算值
                    type = v[17]  # 0购1退
                    company = v[18]  # 公司
                    createTime = v[19]  # 时间
                    category = v[21]  # 品类
                    brand = v[22]  # 品牌
                    companyName = v[23]  # 公司名
                    dompanyName = v[24]  # 装修单归属公司名
                    dtype = v[25] # 装修单类型
                    contractTime = v[26] #装修单签单时间
                    status = v[27] #业务员在职/离职
                    rid = v[28]
                    decorationDeptId = v[29]  # 装修单业务分区ID
                    decorationDeptName = v[30]  # 装修单业务分区
                    decorationYdeptId = v[31]  # 装修单业务部ID
                    decorationYdeptName = v[32]  # 装修单业务部
                    decorationUserId = v[33]  # 装修单业务员ID
                    decorationUserName = v[34]  # 装修单业务员
                    decorationStatus = v[35]    #装修单业务员在职/离职

                    if contractTime == None:
                        contractTime = u"无"
                    else:
                        contractTime = u"%s" % contractTime

                    if decorationStatus == 0:
                        decorationStatusName = u'在职'
                    if decorationStatus == 1:
                        decorationStatusName = u'离职'

                    if status == 0:
                        statusName = u'在职'
                    if status == 1:
                        statusName = u'离职'

                    if dtype == 0:
                        typeName = u"半包"
                    if dtype == 1:
                        typeName = u"套餐"
                    if dtype == 2:
                        typeName = u"半价"

                    createTime = datetime.datetime.strptime(str(createTime), '%Y-%m-%d %H:%M:%S')

                    if type == 0:

                        if startTimes <= createTime <= endTime:

                            parames = []
                            param = self.getBuybyzero(sid)
                            parames.append(float(param[0]))
                            parames.append(float(param[1]))

                            self.divNum(parames, [0, 1])
                            referMoney = parames[0]  # 定金 + 补款
                            coupon_pay = parames[1]  # 款项券

                            if coupon_pay == None:
                                coupon_pay = u"无"
                                coupon_payment = 0
                            else:
                                coupon_pay = parames[1]
                                coupon_payment = parames[1]

                            # 净业绩 = 定金 + 补款 - 款项券
                            NetPerformance = referMoney - coupon_payment

                            # 净业绩保留小数点后3位
                            NetPerformance = round(NetPerformance, 3)

                            # 复合业绩 = (预结算值 - 主材券 - 款项券) / 0.16 , 注: 宜家为0.13
                            if company != 3:
                                CompoundPerformance = (balance - coupon - coupon_payment) / 0.16

                            else:
                                CompoundPerformance = (balance - coupon - coupon_payment) / 0.13  # 注: 宜家为0.13

                            # 复合业绩保留小数点后3位
                            CompoundPerformance = round(CompoundPerformance, 3)

                            self.Ranking(v,CompoundPerformance)

                            datas = (orderId, name, houseNumber, no, deptId, deptName, ydeptId, ydeptName,
                                     userId, userName, statusName, total, coupons, maling, venderMaling, referMoney, coupon_pay,
                                     balance, NetPerformance, CompoundPerformance, u'购货', companyName, dompanyName,
                                     category, brand, typeName, contractTime,decorationDeptId,decorationDeptName,decorationYdeptId,
                                     decorationYdeptName,decorationUserId,decorationUserName,decorationStatusName)

                            self.list1.append(datas)

                    else:

                        if startTime <= createTime <= endTimess:

                            parames = []
                            param = list(self.backGoods(rid))

                            if param[1] == None:
                                param[1] = 0

                            parames.append(float(param[0]))
                            parames.append(float(param[1]))
                            self.divNum(parames, [0])

                            if param[0] != None:

                                backtotal = -parames[0]  # 退款额
                                backcoupon = parames[1]  # 款项卷

                                if backcoupon == None:
                                    backcoupon = u"无"
                                    backcoupon_payment = 0
                                else:
                                    backcoupon = parames[1]
                                    backcoupon_payment = parames[1]

                                #净业绩 = 退款额 + 款项券
                                backNetPerformance = backtotal + backcoupon_payment

                                # 净业绩保留小数点后3位
                                backNetPerformance = round(backNetPerformance, 3)

                                # 复合业绩 = (预结算值 + 款项券) / 0.16 注: 宜家为0.13
                                if company != 3:
                                    backCompoundPerformance = (balance + backcoupon_payment) / 0.16

                                else:
                                    backCompoundPerformance = (balance + backcoupon_payment) / 0.13  # 注: 宜家为0.13

                                # 复合业绩保留小数点后3位
                                backCompoundPerformance = round(backCompoundPerformance, 3)

                                self.Ranking(v, backCompoundPerformance)

                                datas = (orderId, name, houseNumber, no, deptId, deptName, ydeptId, ydeptName,
                                         userId, userName, statusName, total, coupons, maling, venderMaling, backtotal, backcoupon,
                                         balance, backNetPerformance, backCompoundPerformance, u'退货', companyName,
                                         dompanyName, category, brand, typeName, contractTime,decorationDeptId,decorationDeptName,decorationYdeptId,
                                         decorationYdeptName,decorationUserId,decorationUserName,decorationStatusName)

                                self.list1.append(datas)


                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                paln = {
                    u"plan.schedule": int(schedules),
                }

                self.updataSchedule(self.pthost, pid, paln)

                nowPage = nowPage + 1

                if len(data) < 200:
                    flag = False

            path = tempfile.gettempdir() + u"/sales.xls"
            params = self.addSheet1()

            workbook = params[0]

            self.addSheet2(workbook)
            self.addSheet3(workbook)
            self.addSheet4(workbook)
            
            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                u"plan.resultFilepath": resultfilepath
            })

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost,self.media, e)
        finally:
        
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)


if __name__ == '__main__':
    """
    导出销售脚本说明: 
        根据结算时间查询,以分页拿数据的方式导出销售;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        
    脚本传参说明:
        python plan_achievement_balance_collecter.py pid     args     company
               plan_achievement_balance_collecter.py 299 "2018-10-27"  0     
    
    1.传入必须参数说明
        1.pid           information.plan的主键;
        2.args          查询的年月 例:2018/07;
        
    2.sheet1:在原有基础上增加: 款项总额, 款项, 预结算值, 净业绩, 复合业绩, 状态 ,公司, 装修单归属公司, 品类, 品牌, 装修单状态, 签单时间, 装修单业务分区ID, 装修单业务分区, 装修单业务部ID, 装修单业务部, 装修单业务员ID,	 装修单业务员, 在职/离职
        装修单号	        楼盘	          楼号	        销售单号	    业务分区ID	    业务分区	    业务部ID	      业务部	    业务员ID	       业务员	总额	券	抹零	厂商抹零	款项总额	款项	预结算值	 净业绩	复合业绩	  状态   公司   装修单归属公司  品类   品牌    装修单状态  签单时间	            装修单业务分区ID	  装修单业务分区	装修单业务部ID	装修单业务部	装修单业务员ID	装修单业务员	在职/离职
        1608020003	万达广场二期	    C3#B-2-1	20180510000003	 FL_DR_10	大东独立运营分区	FL_DD_01	大东分公司	FL-07237	杨亚慧微应用	8000	0	0	0	-4900	0	-490	-4900	 -3062.5	1  方林装饰	方林装饰	     瓷砖	金意陶     半包   2018-04-24 16:19:00	        FL_ER_01	    工程大区	        FL_ED_09	监理部	        FL-02056	  査焰青	       在职
        1608020003	万达广场二期	    C3#B-2-1	20180522000003	 FL_DR_10	大东独立运营分区	FL_DD_01	大东分公司	FL-07237	杨亚慧微应用	12000	0	0	0	20000	0	4000	19900	  24375	    0  方林装饰	方林装饰	     瓷砖	金意陶     半价   2018-04-24 16:19:00	        FL_ER_01	    工程大区	        FL_ED_09	监理部	        FL-02056	  査焰青	       在职
        1805240009	   帝景湾	    8#5-5-5	    20180529000013	 FL_DR_10	大东独立运营分区	FL_DD_01	大东分公司	FL-10360	郭峰	        100	    0	0	0	-15000	0	-4000	-15000	  -25000	1  方林装饰	1918	     瓷砖	金意陶     半价   2017-09-20 17:34:22        	FL_BR_01	    市场营销一分区	FL_BD_01	市场营销一部	    FL-00297	  白淑侠	       在职
        
    3.sheet2:根据uid合并数据,根据金额降序排名
        例:
            业务员userId	    业务员	        复合业绩
            FL-07237	    杨亚慧微应用	    15950
            FL-06474	    王莹钰	        8000
            FL-10360	    郭峰	            4900
            
    4.sheet3:根据rid合并数据,根据金额降序排名
        例:
            业务分区ID	    业务员	        复合业绩
                352	        职能中心	        12900
                150  	    设计三分区	    9150
                164	     大东独立运营分区	    8000

    
    5.sheet4:根据did合并数据,根据金额降序排名
        例:
            业务部ID	        业务部	        复合业绩
              78	      大东分公司	        8000
              250	      ERP开发部	        8000
              96	      设计中心二部	    6750
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    dompany = sys.argv[3]

    args = args[0:4] + "/" + args[5:7]
    startTime = datetime.datetime.strptime(args, '%Y/%m')
    endTime = startTime + relativedelta(months=1)
    endTime = endTime + datetime.timedelta(days=1) - datetime.timedelta(seconds=1)
    Export_Sales = Export_Sales(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    Export_Sales.main(pid, startTime, endTime, dompany)
