from dateutil.relativedelta import relativedelta
from dateutil import rrule
import datetime
import json


class construction():


    # 近12个月未开工数走势(折线)
    def ccs0(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        cs = int(args.get("ccs"))
        decoration7achievements= redis.get('ccs0')
        test = "未开工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in decoration7achievements:
            if count < 12:
                xs.append("%s年%s月" % (value['year'], value['month']))
            if company != value['company']:
                legend.append(value['name'])
                ys["name"] = value['name']
                ys["type"] = 'line'
                company = value['company']
            if intel <= 12:
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
            'title': {'text': '近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res

    # 近12个月开工数走势(折线)
    def ccs1(self, args, logger, redis, mongo):

        cs = int(args.get("ccs"))

        decoration7achievements = redis.get('ccs1')
        test = "开工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in decoration7achievements:
            if count < 12:
                xs.append("%s年%s月" % (value['year'], value['month']))
            if company != value['company']:
                legend.append(value['name'])
                ys["name"] = value['name']
                ys["type"] = 'line'
                company = value['company']
            if intel <= 12:
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
            'title': {'text': '近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res

    #  近12个月完工数走势(折线)
    def ccs2(self, args, logger, redis, mongo):

        cs = int(args.get("ccs"))

        decoration7achievements = redis.get('ccs2')
        test = "完工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in decoration7achievements:
            if count < 12:
                xs.append("%s年%s月" % (value['year'], value['month']))
            if company != value['company']:
                legend.append(value['name'])
                ys["name"] = value['name']
                ys["type"] = 'line'
                company = value['company']
            if intel <= 12:
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
            'title': {'text': '近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res

    # 公司
    # 近12个月未开工数走势(折线)(公司版)
    def ccs4(self, args, logger, redis, mongo):

        cs = int(args.get("ccs"))
        company = int(args.get("company"))
        decoration7achievements= redis.get('ccs0')
        test = "未开工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1


        for value in decoration7achievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                    legend.append(value['name'])
                    ys["name"] = value['name']
                    ys["type"] = 'line'

                if intel <= 12:
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
            'title': {'text': '公司近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }
        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res

    # 近12个月开工数走势(折线)(公司版)
    def ccs5(self, args, logger, redis, mongo):

        cs = int(args.get("ccs"))
        company = int(args.get("company"))
        decoration7achievements = redis.get('ccs1')
        test = "开工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in decoration7achievements:
            if value['company'] == company:

                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                    legend.append(value['name'])
                    ys["name"] = value['name']
                    ys["type"] = 'line'
                if intel <= 12:
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
            'title': {'text': '公司近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res

    # 近12个月完工数走势(折线)(公司版)
    def ccs6(self, args, logger, redis, mongo):

        cs = int(args.get("ccs"))
        company = int(args.get("company"))
        decoration7achievements = redis.get('ccs2')
        test = "完工数"

        if not decoration7achievements: return {}

        decoration7achievements = json.loads(decoration7achievements and decoration7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in decoration7achievements:
            if value['company'] == company:

                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                    legend.append(value['name'])
                    ys["name"] = value['name']
                    ys["type"] = 'line'
                if intel <= 12:
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
            'title': {'text': '公司近12月%s' % test},
            "tooltip": {"trigger": "axis"},
            "legend": {
                "data": legend,
                "left": "center",
                "bottom": 10,
                "type": "scroll"
            },
            "xAxis": [{"type": "category", "data": xs, "boundaryGap": False}],
            "yAxis": [{"type": "value"}],
            "series": series
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "line"}
        return res


    # 各施工节点数(数字)
    def ccs8(self, args, logger, redis, mongo):

        results = redis.get('ccs3')

        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        dataset.append({"key": "砌墙", "value": 0})
        dataset.append({"key": "铲大白", "value": 0})
        dataset.append({"key": "放线", "value": 0})
        dataset.append({"key": "水暖", "value": 0})
        dataset.append({"key": "力工", "value":0})
        dataset.append({"key": "电工", "value": 0})
        dataset.append({"key": "石膏", "value": 0})
        dataset.append({"key": "瓦工", "value": 0})
        dataset.append({"key": "地面找平", "value": 0})
        dataset.append({"key": "木工", "value": 0})
        dataset.append({"key": "油工", "value": 0})
        dataset.append({"key": "水电验收", "value": 0})
        dataset.append({"key": "保洁", "value": 0})

        num = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        for result in results:
            if result.get("schedule") > 2:
                 num[int(result.get("schedule")) - 3] = num[int(result.get("schedule")) - 3] + result.get("count")
            if result.get("schedule") > 2:
                dataset[int(result.get("schedule")) - 3] = {"key": result.get("name"), "value":  num[int(result.get("schedule")) - 3]}
        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

    # 各施工节点数(数字)
    def ccs9(self, args, logger, redis, mongo):

        results = redis.get('ccs3')
        company = int(args.get("company"))
        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        dataset.append({"key": "砌墙", "value": 0})
        dataset.append({"key": "铲大白", "value": 0})
        dataset.append({"key": "放线", "value": 0})
        dataset.append({"key": "水暖", "value": 0})
        dataset.append({"key": "力工", "value": 0})
        dataset.append({"key": "电工", "value": 0})
        dataset.append({"key": "石膏", "value": 0})
        dataset.append({"key": "瓦工", "value": 0})
        dataset.append({"key": "地面找平", "value": 0})
        dataset.append({"key": "木工", "value": 0})
        dataset.append({"key": "油工", "value": 0})
        dataset.append({"key": "水电验收", "value": 0})
        dataset.append({"key": "保洁", "value": 0})


        for result in results:
            if result["company"] == company:
                if result.get("schedule") > 2:
                    dataset[int(result.get("schedule"))-3] = {"key": result.get("name"), "value": result.get("count")}

        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

    # 签单排名TOP9
    def ccs10(self, args, logger, redis, mongo):

        results = redis.get('ccs4')
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
