import datetime
import heapq
class flask_monitor:

    def select(self, args, logger, redis, mongo):

        record = mongo.monitor.record

        nowTime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        nowTime8 = (datetime.datetime.now() - datetime.timedelta(hours = +16)).strftime('%Y-%m-%d %H:%M:%S')

        nowTime = datetime.datetime.strptime(nowTime, '%Y-%m-%d %H:%M:%S')
        nowTime8 = datetime.datetime.strptime(nowTime8, '%Y-%m-%d %H:%M:%S')

        res = record.aggregate([{'$match': {'timestamp': {'$gte': nowTime8, '$lte': nowTime}}}])

        keyName = {}
        timeList = []
        nameValue = []
        for i, v in enumerate(res):
            times = v['timestamp'] + datetime.timedelta(hours = +8)
            times = str(times)
            year = times[:4]
            month = times[5:7]
            day = times[8:10]
            hour = times[11:13]
            minute = times[14:16]
            YMDHM = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
            timeList.append(YMDHM)

            date = v['temperature']

            if v['name'] in keyName:
                keyName[v['name']].append(date)
            else:
                keyName[v['name']] = [date]
                nameValue.append(v['name'])

        timeList = list(set(timeList))
        timeList = sorted(timeList)

        return keyName, timeList, nameValue

    def getSensors(self,args, logger, redis, mongo):

        data, timeList, nameValue = self.select(args, logger, redis, mongo)
        seriesOptions = []
        yMin = []
        for i, v in enumerate(nameValue):
            sensorsMin =  heapq.nsmallest(1, data[v])[0]#返回最小元素
            yMin.append(sensorsMin)
            options = {"type": "line", "name": v, "data": data[v]}
            seriesOptions.append(options)
        ySensorsMin = heapq.nsmallest(1, yMin)[0]#返回最小元素

        ops = {
            'title': {'text': '温度'},
            'tooltip': {'trigger': 'axis'},
            "legend": {"data": nameValue},
            "xAxis": [{"type": "category", "data": timeList}],
            "yAxis": [{"type": "value", 'min':ySensorsMin-5, 'axisLabel':{'formatter': '{value}°C'}}],#{'formatter': '{value} %s' % '°C'}
            "series": seriesOptions
            }
        return ops