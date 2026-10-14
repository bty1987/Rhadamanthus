#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-
import datetime


class report():

    def queryContractAndMeasure(self, company, userId, mongo, ustype):
        decoration = mongo.decoration.contract
        decorations = mongo.decoration.measure
        startTime = datetime.datetime.now().date()
        endTime = startTime - datetime.timedelta(days=7)
        dates = []
        total = []
        count=[]

        # 查询签单数
        mongodata = decoration.aggregate([
            {"$match": {"contractTime": {"$lt": str(startTime), "$gte": str(endTime)}, "userId": userId,
                        "cid": int(company), "type": int(ustype)}},
            {"$group": {"_id": "$contractTime", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ])
        # 查询量尺数
        mongodatas = decorations.aggregate([
            {"$match": {"measureTime": {"$lt": str(startTime), "$gte": str(endTime)}, "userId": userId,
                        "cid": int(company), "type": int(ustype)}},
            {"$group": {"_id": "$measureTime", "count": {"$sum": "$count"}}},
            {"$sort": {"_id": 1}}
        ])

        # 查询签单数
        for v in mongodata:
            total.append(v['count'])
            if v['_id'] not in dates:
                dates.append(v['_id'])

        # 查询量尺数
        for v in mongodatas:
            count.append(v['count'])
            if v['_id'] not in dates:
                dates.append(v['_id'])
        dates.sort()
        return [dates, total, count]

    def queryContract(self, company, userId, mongo, ustype):
        decoration = mongo.decoration.contract
        startTime = datetime.datetime.now().date()
        endTime = startTime - datetime.timedelta(days=7)
        mongodata = decoration.aggregate([
            {"$match": {"contractTime": {"$lt": str(startTime), "$gte": str(endTime)}, "userId": userId,
                        "cid": int(company), "type": int(ustype)}},
            {"$group": {"_id": "$contractTime", "count": {"$sum": "$orderTotalPrice"}}},
            {"$sort": {"_id": 1}}
        ])
        dates = []
        total = []
        for v in mongodata:
            dates.append(v['_id'])
            total.append(v['count'])

        return [dates, total]

    # 设计师签单额
    def designContract(self, args, logger, redis, mongo):
        company = args.get('company')
        userId = args.get('userId')
        designContractData = report.queryContract(self, company, userId, mongo, 0)
        data = report.getDesignAndSalesman(self, designContractData, "设计师签单额")
        return data

    # 业务员签单额
    def salesmanContract(self, args, logger, redis, mongo):
        company = args.get('company')
        userId = args.get('userId')
        salesmanContractData = report.queryContract(self, company, userId, mongo, 1)
        data = report.getDesignAndSalesman(self, salesmanContractData, "业务员签单额")
        return data

    # 设计师签单数和量尺数
    def designContractAndMeasure(self, args, logger, redis, mongo):
        company = args.get('company')
        userId = args.get('userId')
        designData = report.queryContractAndMeasure(self, company, userId, mongo, 0)
        data = report.getContractData(self, designData, "设计师业绩")
        return data

    # 业务员签单数和量尺数
    def salesmanContractAndMeasure(self, args, logger, redis, mongo):
        company = args.get('company')
        userId = args.get('userId')
        salesmanData = report.queryContractAndMeasure(self, company, userId, mongo, 1)
        data = report.getContractData(self, salesmanData, "业务员业绩")
        return data

    def getContractData(self, contractData, title):
        xs = [d for d in contractData[0]]
        ys = [d for d in contractData[1]]
        cs = [d for d in contractData[2]]
        options = {
            'title': {'text': title},
            'tooltip': {'trigger': 'axis'},
            "legend": {"data": ['签单数', '量尺数']},
            "xAxis": [{
                "axisLabel": {
                    "rotate": 30,
                    "interval": 0
                },
                "type": 'category',
                "data": xs,
            }],
            "yAxis": [{"type": "value"}],
            "series": [{"type": "line", "name": "签单数", "data": ys},
                       {"type": "line", "name": "量尺数", "data": cs}]
        }
        return options

    def getDesignAndSalesman(self, contractData, title):
        xs = [d for d in contractData[0]]
        ys = [d for d in contractData[1]]
        options = {
            'title': {'text': title},
            'tooltip': {'trigger': 'axis'},
            "xAxis": [{
                "axisLabel": {
                    "rotate": 30,
                    "interval": 0
                },
                "type": 'category',
                "data": xs,
            }],
            "yAxis": [{"type": "value"}],
            "series": [{"type": "line", "name": "签单额", "data": ys}]
        }
        return options
