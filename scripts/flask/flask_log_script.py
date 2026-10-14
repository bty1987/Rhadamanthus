import datetime

class logReport():
    # 当前时间
    def startTime(self):
        return datetime.datetime.now().date()

    def dayLevelTrend(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]

        endTime = self.startTime() - datetime.timedelta(days=60)

        ys = []
        xs = []
        oneData = mongoCount.aggregate(
            [{"$match": {"time": {"$gt": str(endTime), "$lte": str(self.startTime())}}}, {"$group": {"_id": "$time", "count": {"$sum": "$count"}}},{"$sort": {"_id": 1}}])

        for count in oneData:
            ys.append(count['count'])
            xs.append(count['_id'])

        options = {
            'title': {'text': '天级请求总数走势图'},
            "tooltip": {"trigger": "axis"},
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": [{"type": "line", "name": "总数", "data": ys, "areaStyle": {}}]
        }

        return options


    #请求总数
    def requestCount(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]

        count = mongoCount.aggregate([{"$group": {"_id": "", "count": {"$sum": "$count"}}}])
        result = {}
        for sumcount in count:
            result = sumcount['count']

        return result

    #当天 , 主机请求总数
    def intradayCount(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]

        count = mongoCount.aggregate([{"$match" : {"time" : {"$eq": str(self.startTime())}}},{"$group" : {"_id" : "", "count" : {"$sum" : "$count"}}}])
        result = {}
        for intraday in count:
            result = intraday['count']

        return result

    # 7天内 , 主机请求总数
    def hostRequestsSeven(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]
        endTime = self.startTime() - datetime.timedelta(days=60)

        return self.common(mongoCount, str(endTime), "host" , "服务器天级请求", '230px')

    #7天内 , 人员请求总数
    def userRequestsSeven(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]
        endTime = self.startTime() - datetime.timedelta(days=7)

        return self.common(mongoCount, str(endTime), "userId" , "人员天级请求(TOP10)", '455px')

    #7天内 , api请求总数
    def apiRequestsSeven(self, args, logger, redis, mongo):
        mongoCount = mongo.log[datetime.datetime.now().strftime('%Y')]
        endTime = self.startTime() - datetime.timedelta(days=7)

        return self.common(mongoCount, str(endTime), "api", "天级API请求数(TOP10)", '455px')

    def common(self, mongoCount, endTime, id, title, y):
        _id = "$%s" % id
        commonCount = mongoCount.aggregate([{"$match": {"time": {"$gt": endTime, "$lte": str(self.startTime())}}},{"$group": {"_id": _id, "count": {"$sum": "$count"}}},{"$sort": {"count": -1}}, {"$limit": 10}])

        xs = []
        datas = {}
        data = []
        commonid = []
        options = {
            "series": []
        }
        for con in commonCount:
            commonid.append(con['_id'])

        concount = mongoCount.aggregate([{"$match":{"time": {"$gt": endTime, "$lte": str(self.startTime())},"%s" % id:{"$in":commonid}}},{"$group" : {"_id":{"time": "$time", "%s" % id: _id}, "count": {"$sum": "$count"}}},{"$sort": {"_id": 1}}])
        for total in concount:

            if total['_id']['time'] not in xs:
                xs.append(total['_id']['time'])

            if total['_id']["%s" % id] not in data:
                data.append(total['_id']["%s" % id])
                datas[total['_id']["%s" % id]] = [total['count']]

            else:
                datas[total['_id']["%s" % id]].append(total['count'])

        for ds in data:
            options["series"].append({"type": "line", "name": ds , "data": datas[ds]})

        options["title"] = {'text': title}
        options["tooltip"] = {"trigger": "axis"}
        options["legend"] = {"data": data, 'y': y}
        options["xAxis"] = [{"type": "category", "data": xs, "boundaryGap": False}]
        options["yAxis"] = [{"type": "value"}]
        options["grid"] = {"containLabel": True,"bottom": '13%', "left": '4%'}

        return options