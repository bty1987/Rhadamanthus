from dateutil.relativedelta import relativedelta
from dateutil import rrule
import datetime
import json


class decoration():

    # 集团
    # 近12个月签单额走势(cs2) 近12个月签单数走势(cs0) 近12个月设计户数走势(cs1) 近12个月设计费走势(cs4)
    def cs0(self, args, logger, redis, mongo):

        cs = int(args.get("cs"))

        if cs == 0 or cs == 2:
            decorationAchievements = redis.get('cs0')
            test = "签单户数" if cs == 0 else "签单额"
        if cs == 1 or cs == 4:
            decorationAchievements = redis.get('cs6')
            test = "设计户数" if cs == 1 else "设计费"

        if not decorationAchievements: return {}

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        if cs == 2 or cs == 4:
            yAxis = [{"type": "value", "name": "万元", "axisLabel": {"formatter": '{value} W'}}]
        else:
            yAxis = [{"type": "value", "name": "户数"}]

        for value in decorationAchievements:
            if count < 12 :
                xs.append("%s年%s月" % (value['year'], value['month']))
            if company != value['company']:
                legend.append(value['name'])
                ys["name"] = value['name']
                ys["type"] = 'line'
                company = value['company']
            if intel <= 12:
                if cs == 2 or cs == 4:
                    data.append(int(value['cs%s' % cs])/10000)
                else :
                    data.append(value['cs%s' % cs])
            if intel == 12:
                ys["data"] = data
                series.append(ys)
                intel = 0
                data = []
                ys = {}

            intel = intel + 1
            count = count + 1

        options = {
            'title': {'text': '近12月%s'% test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": yAxis,
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "" ,"type": "line"}
        return res

    # group 集团:0 公司:1
    # 签单类型比例(饼状)
    def cs1(self, args, logger, redis, mongo):

        group = int(args.get("group"))
        company = int(args.get("company"))

        if group:
            redisV = redis.get('cs1' + '_' + str(company))
            if not redisV == None:
                redisV = json.loads(redisV and redisV or {})
                return redisV

        decorationAchievements = redis.get('cs1')

        if not decorationAchievements: return {}

        cname = "" if group else "方林集团(全公司)"

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})
        data = []
        typeness = -1
        cs0 = 0

        for value in decorationAchievements:
            if company == value.get('company') and group:

                content = {}
                content["value"] = value["cs0"]
                content["name"] = value["name"]
                cname = value["cname"]
                data.append(content)

            if not group:

                if typeness != value.get("typeness"):
                    if cs0: data.append({"name": name, "value": cs0})
                    cs0 = value.get("cs0")
                    name = value.get("name")
                    typeness = value.get("typeness")
                else:
                    cs0 = cs0 + value.get("cs0")

        options = {
            'title': {'text': '签单类型比例', 'left': 'center' },
            "tooltip": {"trigger": "item"},
            "legend": { 'orient': 'vertical', 'left': 'left', "bottom": 50,},
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': { 'itemStyle': { 'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)' }}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "","type": "pie"}

        if group:
            redis.set("cs1" + "_" + str(company), json.dumps(res), 12 * 60 * 60)

        return res

    # group 集团:0 公司:1
    # 签单额排名(表格)
    def cs2(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        group = int(args.get("group"))

        if group:
            redisV = redis.get('cs2' + '_' + str(company))
            if not redisV == None:
                redisV = json.loads(redisV and redisV or {})
                return redisV

        results = redis.get('cs2')
        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []
        cid = -1
        cs2 = 0
        for v in results:
            if company == v.get("company") and group:
                dataset.append({"key": v.get("rename"), "value": "%d%s" % (int(v.get("cs2")) / 1000 if int(v.get("cs2")) / 1000 > 1 else 1, "k"), "sort": v.get("cs2")})
            if not group:

                if cid != v.get("company"):
                    if cs2: dataset.append({"key": name, "value": "%d%s" % (int(cs2) / 10000 if int(cs2) / 10000 > 1 else 1, "w"), "sort": cs2})
                    cs2 = v.get("cs2")
                    cid = v.get("company")
                    name = v.get("name")
                else:
                    cs2 = cs2 + v.get("cs2")

        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse = True)

        if group:
            title = "分区签单额排名"
        else :
            title = "公司签单额排名"

        res = {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", "title": title}

        if group:
            redis.set("cs2" + "_" + str(company), json.dumps(res), 12 * 60 * 60)

        return res

    # 15-22各公司月签单额走势(cs2)
    def cs3(self, args, logger, redis, mongo):

        decorationAchievements = redis.get('cs3')

        if not decorationAchievements: return {}

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})

        today = datetime.datetime.now()
        months = rrule.rrule(rrule.MONTHLY, dtstart=datetime.date(2015, 1, 1), until=today).count()

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = True
        intel = 1
        company = -1

        for value in decorationAchievements:

            if count:
                xs.append("%s年%s月" % (value['year'], value['month']))
            if company != value['company']:
                legend.append(value['name'])
                ys["name"] = value['name']
                ys["type"] = 'line'
                company = value['company']
            if intel <= months:
                data.append(int(value['cs2'])/10000)
            if intel == months:
                ys["data"] = data
                series.append(ys)
                count = False
                intel = 0
                data = []
                ys = {}

            intel = intel + 1

        options = {
            'title': {'text': '2015 - %s 各公司月签单额走势' % today.year},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value","name": "万元", "axisLabel": {"formatter": '{value} W'}}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "","type": "line"}

        return res

    # group: 集团:0 公司: 1
    # 15 - 22 年签单额对比(柱状)
    def cs4(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        group = int(args.get("group"))

        if group:
            redisV = redis.get('cs4' + '_' + str(company))
            if not redisV == None:
                redisV = json.loads(redisV and redisV or {})
                return redisV

        decorationAchievements = redis.get('cs4')
        if not decorationAchievements: return {}

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})
        today = datetime.datetime.now()
        count = today.year - 2014
        xAxis = []
        series = []
        offset = True
        index = 0

        for value in decorationAchievements:

            if count == index:
                index = 0
                offset = False

            if value["company"] == company and group:
                xAxis.append("%s年" % value['year'])
                series.append(int(value['cs2'])/1000)

            if not group:
                if offset:
                    xAxis.append("%s年" % value['year'])
                    series.append(int(value['cs2'])/10000)

                if not offset:

                    series[index] = series[index] + int(value['cs2'])/10000

            index = index + 1

        if group:
            yAxis = [{"type": "value", "name": "千元", "axisLabel": {"formatter": '{value} K'}}]
        else:
            yAxis = [{"type": "value", "name": "万元", "axisLabel": {"formatter": '{value} W'}}]

        option = {
            'title': { 'text': '2015 - %s 年签单额对比' % today.year , 'left': 'center' },
            'tooltip': { 'trigger': 'axis', 'axisPointer': { 'type': 'shadow' } },
            'xAxis': { 'type': 'category', 'data': xAxis },
            'yAxis': yAxis,
            'series': [{
                    'data': series,
                    'type': 'bar',
                    'showBackground': True,
                    'backgroundStyle': { 'color': 'rgba(180, 180, 180, 0.2)' }
                }]
        };

        res = {"option": option, "errorCode": 0, "errorMsg": "","type": "bar"}

        if group:
            redis.set("cs4" + "_" + str(company), json.dumps(res), 12 * 60 * 60)

        return res

    # group: 集团:0 公司:1
    # 签单总额(数字) 签单总数(数字) (集团公司版)
    def cs5(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        group = int(args.get("group"))

        if group:
            redisV = redis.get('cs5' + '_' + str(company))
            if not redisV == None:
                redisV = json.loads(redisV and redisV or {})
                return redisV

        results = redis.get('cs5')
        if not results: return {}

        results = json.loads(results and results or {})
        
        dataset = []
        cs0 = 0
        cs2 = 0

        for result in results:
            if result["company"] == company and group:
                dataset.append({"key": "", "value": ""})
                dataset.append({"key": "签单总数", "value": result["cs0"]})
                dataset.append({"key": "签单总额", "value": "%d%s" % (int(result["cs2"]) / 1000 if int(result["cs2"]) / 1000 > 1 else 1 , "k")})

                res = {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}
                redis.set("cs5" + "_" + str(company), json.dumps(res), 12 * 60 * 60)

                return res

            if not group:
                cs0 = cs0 + result["cs0"]
                cs2 = cs2 + result["cs2"]

        dataset.append({"key": "", "value": ""})
        dataset.append({"key": "签单总数", "value": cs0})
        dataset.append({"key": "签单总额", "value": "%d%s" % (int(cs2) / 10000 if int(cs2) / 10000 > 1 else 1, "w")})

        return {"option": dataset, "errorCode": 0, "errorMsg": "" ,"type": "number"}

    # 公司
    # 近12个月签单额走势(cs2) 近12个月签单数走势(cs0) 近12个月设计户数走势(cs1) 近12个月设计费走势(cs4)
    def cs6(self, args, logger, redis, mongo):

        cs = int(args.get("cs"))
        company = int(args.get("company"))

        if cs == 0 or cs == 2:
            redisV = redis.get('cs7' + '_' + str(company) + '_' + str(cs))
            test = "签单户数" if cs == 0 else "签单额"
        if cs == 1 or cs == 4:
            redisV = redis.get('cs9' + '_' + str(company) + '_' + str(cs))
            test = "设计户数" if cs == 1 else "设计费"

        if not redisV == None:
            redisV = json.loads(redisV and redisV or {})
            return redisV

        if cs == 0 or cs == 2:
            decorationAchievements = redis.get('cs7')
            test = "签单户数" if cs == 0 else "签单额"
        if cs == 1 or cs == 4:
            decorationAchievements = redis.get('cs9')
            test = "设计户数" if cs == 1 else "设计费"

        if not decorationAchievements: return {}

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        if cs == 2 or cs == 4:
            yAxis = [{"type": "value", "name": "千元", "axisLabel": {"formatter": '{value} K'}}]
        else:
            yAxis = [{"type": "value", "name": "户数"}]

        for value in decorationAchievements:
            if value['company'] == company:

                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

                if intel <= 12:
                    if cs == 2 or cs == 4:
                        data.append(int(value['cs%s' % cs])/1000)
                    else:
                        data.append(value['cs%s' % cs])
                if intel == 12:
                    ys["data"] = data
                    series.append(ys)
                    intel = 0
                    data = []
                    ys = {}

                intel = intel + 1
                count = count + 1

        options = {
            'title': {'text': '近12月各分区%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": yAxis,
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}

        if cs == 0 or cs == 2:
            key = "cs7"
        if cs == 1 or cs == 4:
            key = "cs9"

        redis.set(key + "_" + str(company)+ '_' + str(cs), json.dumps(res), 12 * 60 * 60)

        return res

    # 15 - 22月签单额走势(折线)
    def cs7(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        redisV = redis.get('cs8' + '_' + str(company))

        if not redisV == None:
            redisV = json.loads(redisV and redisV or {})
            return redisV

        decorationAchievements = redis.get('cs8')

        if not decorationAchievements: return {}

        decorationAchievements = json.loads(decorationAchievements and decorationAchievements or {})

        today = datetime.datetime.now()
        months = rrule.rrule(rrule.MONTHLY, dtstart=datetime.date(2015, 1, 1), until=today).count()

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = True
        intel = 1
        regionds = -1

        for value in decorationAchievements:
            if value['company'] == company:
                if count:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['company']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

                if intel <= months:
                    data.append(int(value['cs2'])/1000)
                if intel == months:
                    ys["data"] = data
                    series.append(ys)
                    count = False
                    intel = 0
                    data = []
                    ys = {}

                intel = intel + 1

        options = {
            'title': {'text': '2015 - %s 各分区月签单额走势' % today.year},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value","name": "千元", "axisLabel": {"formatter": '{value} K'}}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "","type": "line"}

        redis.set("cs8" + "_" + str(company), json.dumps(res), 12 * 60 * 60)
        return res

    # 签单排名TOP9
    def cs8(self, args, logger, redis, mongo):

        type = int(args.get("type"))
        if type:
            results = redis.get('cs11')
        else:
            results = redis.get('cs10')

        company = int(args.get("company"))

        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []

        for result in results:
            if result["company"] == company:
                dataset.append({"key": result["currentName"], "value": result["department"], "photo": result["userPhoto"]})
                if len(dataset) > 5:
                    break

        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "top"}