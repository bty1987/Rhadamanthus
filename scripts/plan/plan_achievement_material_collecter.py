#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from dateutil.relativedelta import relativedelta

class Achievement(Util):

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
        self.department = {}
        self.updepartment = {}
        self.list1 = []
        
        self.colum = u"""
            m.orderId AS '装修单号',
            v.`name` AS '楼盘',
            h.houseNumber AS '楼号',
            m.`no` AS '主材单号',
            de.no AS '主材业务分区ID',
            de.name AS '主材业务分区',
            d.no AS '主材业务部ID',
            d.name AS '主材业务部',
            u.userId AS '主材业务员ID',
            u.userName AS '主材业务员',
            u.status AS '主材业务员状态',
            m.total AS '总额',
            m.coupon AS '券',
            m.maling AS '抹零',
            m.venderMaling AS '厂商抹零',
            u.uid AS '业务员ID',
            de.dId AS '业务分区ID',
            d.dId AS '业务部ID',
            m1.mid AS `mid`, 
            m1.type	AS `0购1退`,
            m.coupon AS `主材卷`, 
            m1.balance AS `预结算值`,
            m.company AS `公司`,
            m1.balanceTime AS `时间`,
            m1.mpid AS `退货主键`,
            c.name AS '公司名',
            m.category AS '品类',
            m.brand AS '品牌',
            dc.typeness AS '装修类型',
            dc.contractTime AS '签单时间',
            m1.mpid AS 'mpid',
            du.userName AS '装修业务员',
            du.userId AS '装修业务员Id',
            du.status AS '装修业务员状态',
            dd.name AS '装修业务分区',
            dd.no AS '装修业务分区Id',
            dde.name AS '装修业务大区',
            dde.no AS '装修业务大区Id'
        """

        self.SELECT_Material = u"""
            SELECT 
                %s
            FROM
                material.materialbalance AS m1,
                material.material AS m,
                communion.house AS h,
                communion.village AS v,
                communion.department AS de,
                communion.department AS d,
                communion.user AS u,
                communion.company AS c,
                decoration.decoration AS dc,
                communion.user AS du,
                communion.department AS dde,
                communion.department AS dd
            WHERE
                m.hid = h.hid 
                AND m1.mid= m.mid
                AND h.vid = v.vid
                AND m.smuid = u.uid
                AND m.departmentId = de.did
                AND m.regionId = d.did
                AND m.company = c.cid
                AND dc.orderId = m.orderId
                AND dc.smuid = du.uid
                AND du.deptId = dd.dId
                AND dde.dId = dd.fdid
                AND m1.balanceTime BETWEEN '%s' AND '%s'
                %s
        """

		# 购货
        self.BUYSQLBYPAYMENT = u"""
            SELECT 
                SUM(mp.referMoney) AS '定+补',
                SUM(mr.coupon)  AS '款项卷'
            FROM
                payment.materialpayment AS mp LEFT JOIN payment.materialreceipt AS mr ON mp.mrid = mr.mrid 
            WHERE  
                mp.mid = %d
                AND mp.paymentType in(2,3)
        """
        # 退货
        self.REFUND = u"""
            SELECT
                sum(mp.referMoney) AS `退款额`, 
                sum(msr.coupon) AS `款项卷`
            FROM
                material.materialbalance AS mb,
                payment.materialpayment AS mp LEFT JOIN payment.materialreceipt AS msr ON mp.mrid = msr.mrid
            WHERE 
                mb.mpid = %d AND  
                mb.mpid = mp.mpId 
        """

    def executeSQL(self, sql):

        self.cursor.execute(sql)
        data = self.cursor.fetchall()

        return data

    def BuyGoods(self, mid):

        sql = self.BUYSQLBYPAYMENT % (mid)
        data = self.executeSQL(sql)

        referMoney = data[0][0]
        coupon = data[0][1]

        return referMoney, coupon

    def backGoods(self, mpid):

        sql = self.REFUND % (mpid)
        data = self.executeSQL(sql)

        total = data[0][0]  # 退款额
        coupon = data[0][1]  # 款项卷

        return total, coupon

    def newData(self, v, Performance):
    
        uid = v[15]
        userId = v[8]
        userName = v[9]
        total = v[10]

        if uid not in self.user:
            self.user[uid] = (userId, userName, Performance)
        else:
            Performances = self.user[uid][2]
            sumPerformance =  Performances + Performance
            self.user[uid] = (userId, userName, sumPerformance)

    def newDeptData(self, v, Performance):
    
        did = v[16]
        deptId = v[4]
        deptName = v[5]

        if did not in self.department:
            self.department[did] = (deptId, deptName, Performance)
        else:
            Performances = self.department[did][2]
            sumPerformance = Performances + Performance
            self.department[did] = (deptId, deptName, sumPerformance)

    def newUpdeptData(self, v, Performance):
    
        did = v[17]
        deptId = v[6]
        upDeptName = v[7]

        if did not in self.updepartment:
            self.updepartment[did] = (deptId, upDeptName, Performance)
        else:
            Performances = self.updepartment[did][2]
            sumPerformance = Performances + Performance
            self.updepartment[did] = (deptId, upDeptName, sumPerformance)

    def addSheet1(self):
    
        params = self.createWorkbook(u"Sheet1")

        workbook = params[0]
        sheet1 = params[1]

        tableHead = [
            u"装修单号", u"楼盘", u"楼号", u"主材单号", u"主材业务分区ID", u"主材业务分区", u"主材业务部ID", u"主材业务部", u"主材业务员ID", 
            u"主材业务员", u"主材业务员状态", u"总额", u"券", u"抹零", u"厂商抹零", u"类型", u'款项总额', u"款项劵", u"预结算值", 
            u"净业绩", u"复合业绩",u"公司", u"品类", u"品牌", u'装修类型', u'签单时间', u'装修业务员', u'装修业务员Id', u'装修业务员状态', 
            u'装修业务分区', u'装修业务分区Id', u'装修业务大区', u'装修业务大区Id'
        ]
        self.createTableHead(sheet1, tableHead)

        portraits = 1
        for i, v in enumerate(self.list1):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet1, portraits, j, k)
            portraits = portraits + 1

        return workbook, sheet1

    def addsheet2(self, workbook):
    
        self.user = self.user.values()
        self.user = sorted(self.user, key=lambda user: user[2], reverse=True)
        tableHead2 = [u"业务员ID", u"业务员",u'复合业绩']
        sheet2 = workbook.add_sheet(u"sheet2", cell_overwrite_ok=True)
        self.createTableHead(sheet2, tableHead2)
        portrait = 1
        for i, v in enumerate(self.user):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet2, portrait, j, k)
            portrait = portrait + 1

    def addsheet3(self, workbook):
    
        self.department = self.department.values()
        self.department = sorted(self.department, key=lambda user: user[2], reverse=True)
        tableHead3 = [ u"业务分区ID", u"业务分区", u'复合业绩']
        sheet3 = workbook.add_sheet(u"sheet3", cell_overwrite_ok=True)
        self.createTableHead(sheet3, tableHead3)

        portrait = 1
        for i, v in enumerate(self.department):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet3, portrait, j, k)
            portrait = portrait + 1

    def addsheet4(self, workbook):
    
        self.updepartment = self.updepartment.values()
        self.updepartment = sorted(self.updepartment, key=lambda user: user[2], reverse=True)
        tableHead4 = [ u"业务部ID", u"业务部", u'复合业绩']
        sheet4 = workbook.add_sheet(u"sheet4", cell_overwrite_ok=True)
        self.createTableHead(sheet4, tableHead4)

        portrait = 1
        for i, v in enumerate(self.updepartment):
            for j, k in enumerate(v):
                self.writeWorkbook(sheet4, portrait, j, k)
            portrait = portrait + 1

    def main(self, pid, company, startTime, endTime):
    
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            companyId = """ """

            if company != 0:
                companyId = "AND m.company = %s" % company

            countSQL = self.SELECT_Material % (u"count(*)", startTime, endTime, companyId)
            count = self.count(countSQL)

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
                u"plan.schedule": int(schedule),
                u"plan.status": 4
            })
            sql = self.SELECT_Material % (self.colum, startTime, endTime, companyId)
            nowPage = 1
            flag = True

            startTimes = startTime + datetime.timedelta(days=1)

            endTimes = endTime - datetime.timedelta(days=1)
            while (flag):

                    data = self.page(sql, nowPage, size=200)

                    for i, v in enumerate(data):
                        v = list(v)
                        self.divNum(v, [11, 12, 13, 14, 20, 21])
                        
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
                        muserStatus = v[10] #业务员状态
                        total = v[11]  # 总额
                        coupons = v[12]  # 券
                        maling = v[13]  # 抹零
                        venderMaling = v[14]  # 厂商抹零
                        mid = v[18]
                        coupon = float(v[20]) # 主材卷
                        balance = float(v[21])# 预结算值
                        type = v[19]  # 0购1退
                        company = v[22]  # 公司
                        balanceTime = v[23]  # 时间
                        companyName = v[25]  #公司名
                        category = v[26] #品类
                        brand = v[27] #品牌
                        decorationType = v[28] #装修类型
                        contractTime = v[29] #签单时间
                        mpid = v[30]
                        demuserName = v[31] #装修业务员
                        demuserNameId = v[32] #装修业务员Id
                        demuserStatus = v[33] #装修业务员状态
                        dedeptName = v[34] #装修业务分区
                        dedeptNameId = v[35] #装修业务分区Id
                        ydedeptName = v[36] #装修业务大区
                        ydedeptNameId = v[37] #装修业务大区Id

                        if demuserStatus == 0:
                            demuserStatus = u"在职"
                        else:
                            demuserStatus = u"离职"

                        if muserStatus == 0:
                            muserStatus = u"在职"
                        else:
                            muserStatus = u"离职"

                        if decorationType == 0:
                            decorationType = u"半包"
                        elif decorationType == 1:
                            decorationType = u"套餐 "
                        elif decorationType == 2:
                            decorationType = u"半价"

                        balanceTime = datetime.datetime.strptime(str(balanceTime), '%Y-%m-%d %H:%M:%S')

                        if contractTime != None:
                            contractTime = u"%s" % contractTime
                        else:
                            contractTime = u"无"

                        Performance = 0
                        if type == 0:
                            if startTimes <= balanceTime <= endTime:

                                parames = []
                                param = self.BuyGoods(mid)
                                parames.append(float(param[0]))
                                parames.append(float(param[1]))

                                self.divNum(parames, [0, 1])
                                referMoney = parames[0]  # 定金 + 补款
                                coupon_pay = parames[1] # 款项券

                                # 净业绩 = 定金 + 补款 - 款项券
                                NetPerformance = referMoney - coupon_pay
                                NetPerformance = round(NetPerformance, 3)
                                # 复合业绩 = (预结算值 - 主材券 - 款项券) / 0.16 , 注: 宜家为0.13
                                if company != 3:
                                    CompoundPerformance = (balance - coupon - coupon_pay) / 0.16
                                else:
                                    CompoundPerformance = (balance - coupon - coupon_pay) / 0.13  # 注: 宜家为0.13

                                CompoundPerformance = round(CompoundPerformance, 3)
                                Performance = CompoundPerformance

                                datas = (orderId, name, houseNumber, no, deptId, deptName, ydeptId, ydeptName, userId,
                                         userName, muserStatus, total, coupons, maling, venderMaling,u"购货", referMoney, coupon_pay,
                                         balance, NetPerformance,CompoundPerformance, companyName, category, brand, decorationType, contractTime, demuserName, demuserNameId, demuserStatus, dedeptName, dedeptNameId, ydedeptName, ydedeptNameId)
                                self.list1.append(datas)
                        else:
                            if startTime <= balanceTime <= endTimes:

                                parames = []
                                param = list(self.backGoods(mpid))
                                if param[1] == None:
                                    param[1] = 0
                                parames.append(float(param[0]))
                                parames.append(float(param[1]))
                                self.divNum(parames, [0])

                                if param[0]!= None:

                                    backtotal = -parames[0]  # 退款额

                                    if param[1] == None:
                                        backcoupon = u"无"
                                        nullbackcoupon = 0
                                    else:
                                        backcoupon = parames[1]  # 款项卷
                                        nullbackcoupon = parames[1]
                                        # 净业绩 = 退款额 + 款项券
                                    backNetPerformance = backtotal + nullbackcoupon
                                    backNetPerformance = round(backNetPerformance, 3)
                                    # 复合业绩 = (预结算值 + 款项券) / 0.16 注: 宜家为0.13
                                    if company != 3:
                                        backCompoundPerformance = (balance + nullbackcoupon) / 0.16

                                    else:
                                        backCompoundPerformance = (balance + nullbackcoupon) / 0.13  # 注: 宜家为0.13

                                    backCompoundPerformance = round(backCompoundPerformance, 3)
                                    Performance = backCompoundPerformance

                                    datas = (orderId, name, houseNumber, no, deptId, deptName, ydeptId, ydeptName, userId,
                                             userName, muserStatus, total, coupons, maling, venderMaling,u"退货", backtotal, backcoupon,
                                             balance, backNetPerformance, backCompoundPerformance, companyName, category, brand, decorationType, contractTime, demuserName, demuserNameId, demuserStatus, dedeptName, dedeptNameId, ydedeptName, ydedeptNameId)

                                    self.list1.append(datas)

                        self.newData(v, Performance)
                        self.newDeptData(v, Performance)
                        self.newUpdeptData(v, Performance)

                    molecular = molecular + len(data)
                    schedules = (molecular / all) * 100

                    self.updataSchedule(self.pthost, pid, {
                        u"plan.schedule": int(schedules),
                    })

                    nowPage = nowPage + 1

                    if len(data) < 200:
                        flag = False

            path = tempfile.gettempdir() + u"/material.xls"
            params = self.addSheet1()

            workbook = params[0]

            self.addsheet2(workbook)
            self.addsheet3(workbook)
            self.addsheet4(workbook)
            
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
        导出主材单业绩统计脚本说明:
            根据查询条件,以分页拿数据的方式导出商品;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        查询时间
            3.company     公司
        2,sheet1:在原有基础上增加: 类型, 款项总额, 款项劵, 预结算值, 净业绩, 复合业绩, 字段
        装修单号	        楼盘	    楼号	    主材单号	    业务分区ID	    业务分区	    业务部ID	业务部	    业务员ID	业务员 业务员状态	总额	券	    抹零	厂商抹零	类型      款项总额        款项劵	    预结算值	    净业绩	    复合业绩	    公司名     品类      品牌  订单类型 签单时间  装修业务员  装修业务员状态  装修业务员ID 装修业务员分区 装修业务员分区Id 装修业务员大区  装修业务员大区ID
        1709200005	爱都新城一期	9#1-3-1	    M1711072845	FL_MD_01	    主材中心一组	FL_MR_01	主材大区	FL-03526	张企	在职       5750	0	    0	    0	          0          5750         0	        1150	        5750	    7187.5	        方林装饰   壁纸   欧汇美     半包    2017-01-01 张企         在职         FL-03526     主材中心一组  FL_MD_01        主材大区        FL_MR_01
        1707170039	苓湖经典	    8#8-8-8	M1801037586	FL_DD_13	    设计中心十二部	FL_DR_03	设计三分区	FL-00288	曹海    在职       9000	0	    0	    0	          0          9000         0	        9000	        9000	    56250	        方林装饰    壁纸  欧汇美     半包   2017-01-01 曹海          在职         FL-00288     主材中心一组  FL_MD_01        主材大区        FL_MR_01
        1709300009	爱顿国际城	    9#1-4-1	M1801076952	FL_DD_05	    浑南分公司	    FL_DR_01	设计一分区	FL-00060	白金	在职        3889	0	    0	    0	          0          9000         0	        5394	        9000	    33712.5	    方林装饰    壁纸  欧汇美      半包  2017-01-01 张企          在职          FL-03526     主材中心一组 FL_MD_01        主材大区        FL_MR_01
        
        3.sheet2:根据uid合并数据,根据复合业绩降序排名
        例:
            业务员Id	    业务员	        复合业绩
            FL-00060	    白金           16289
            FL-05150	    袁帅	        11500
            FL-00186	    白世忱	        5175
            
        4.sheet3:根据业务分区did合并数据,根据复合业绩降序排名 
            业务分区Id	 业务分区	            复合业绩
            FL_MD_01	    主材中心一组           1880250
            FL_ED_02	    铲大白/地面找平部	     675738
            FL_ZD_09	    ERP开发部	            422009.11
            
        5.sheet4:根据业务大区did合并数据,根据复合业绩降序排名 
            业务大区Id	 业务大区	            复合业绩
            FL_MR_01	    主材大区               1880250
            FL_ZR_01	    职能中心	            422009.11
            FL_DR_01	    设计一分区	            246716
                    
		6.脚本传参说明:
        python plan_achievement_material_collecter.py pid       args    company
               plan_achievement_material_collecter.py 299      "2018-10-27"  0
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    args = args[0:4] + "/" + args[5:7]
    startTime = datetime.datetime.strptime(args, '%Y/%m')
    endTime = startTime + relativedelta(months=1)
    endTime = endTime + datetime.timedelta(days=1) - datetime.timedelta(seconds=1)

    Achievement = Achievement(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    Achievement.main(pid, company, startTime, endTime)