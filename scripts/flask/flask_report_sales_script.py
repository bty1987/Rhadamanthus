from dateutil.relativedelta import relativedelta
from dateutil import rrule
import datetime
import json


class sales():
    # 集团
    # 近12个月销售单数量走势(折线)
    def scs0(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        if cs == 0 or cs == 2:
            salesAchievements = redis.get('scs0')
            test = "销售单数" if cs == 0 else "补款总额"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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
    # 近12个月补款总额走势(折线)
    def scs1(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))

        salesAchievements = redis.get('scs1')
        test = "补款总额"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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
    # 近12个月退货数量走势(折线)
    def scs2(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))

        salesAchievements = redis.get('scs2')
        test = "退货数量"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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
    #  近12个月退货总额走势(折线)
    def scs3(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))

        salesAchievements = redis.get('scs3')
        test = "退货总额"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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
    #  近12个月结算数量走势(折线)
    def scs4(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))

        salesAchievements = redis.get('scs4')
        test = "结算数量"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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
    #  近12个月结算总额走势(折线)
    def scs5(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))

        salesAchievements = redis.get('scs5')
        test = "结算总额"

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in salesAchievements:
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

    # group: 集团:0 公司:1
    # 销售单总数(数字) 销售单总额(数字)
    def scs6(self, args, logger, redis, mongo):

        results = redis.get('scs6')
        company = int(args.get("company"))
        group = int(args.get("group"))
        salesOr = redis.get('scs6' + '_' + str(company))
        if group == 1:
            if not salesOr == None:
                salesOr = json.loads(salesOr and salesOr or {})
                return salesOr
        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        cs0 = 0
        cs2 = 0

        for result in results:
            if result["company"] == company and group:
                dataset.append({"key": "", "value": ""})
                dataset.append({"key": "销售单总数", "value": result["cs0"]})
                dataset.append({"key": "销售单总额", "value": "%d%s" % (int(result["cs2"]) / 1000 if int(result["cs2"]) / 1000 > 1 else 1, "k")})

                return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

            if not group:
                cs0 = cs0 + result["cs0"]
                cs2 = cs2 + result["cs2"]

        dataset.append({"key": "", "value": ""})
        dataset.append({"key": "销售单总数", "value": cs0})
        dataset.append({"key": "销售单总额", "value": "%d%s" % (int(cs2) / 10000 if int(cs2) / 10000 > 1 else 1, "w")})
        res = {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

        redis.set("scs6" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res
    # 15-22 销售总额对比(柱状)
    def scs7(self, args, logger, redis, mongo):

        salesAchievements = redis.get('scs7')

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})
        today = datetime.datetime.now()
        count = today.year - 2014
        print(count)
        xAxis = []
        series = []
        offset = True
        index = 0

        for value in salesAchievements:

            if count == index:
                index = 0
                offset = False

            xAxis.append("%s年" % value['year'])
            series.append(value['cs2'])

            if not offset:
                print(series)
                print(index)
                series[index] = series[index] + value['cs2']

            index = index + 1
        option = {
            'title': {'text': '2015 - %s 年销售总额对比' % today.year, 'left': 'center'},
            'tooltip': {'trigger': 'axis', 'axisPointer': {'type': 'shadow'}},
            'xAxis': {'type': 'category', 'data': xAxis},
            'yAxis': {'type': 'value'},
            'series': [{
                'data': series,
                'type': 'bar',
                'showBackground': True,
                'backgroundStyle': {'color': 'rgba(180, 180, 180, 0.2)'}
            }]
        }
        res = {"option": option, "errorCode": 0, "errorMsg": "", "type": "bar"}

        return res

    # 品牌销售TOP10(表格)
    def scs8(self, args, logger, redis, mongo):

        results = redis.get('scs8')

        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []
        for v in results:
            dataset.append({"key": v.get("brand"), "value": "%d%s, %s" % (int(v.get("total")) / 1000 if int(v.get("total")) / 1000 > 1 else 1, "k", int(v.get("cs2"))), "sort": v.get("total")})
            if len(dataset) > 9:
                break
        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        return {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", 'title': '品牌销售TOP10'}

    # 品牌退货TOP10(表格)
    def scs9(self, args, logger, redis, mongo):

        results = redis.get('scs9')

        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []
        for v in results:
            dataset.append({"key": v.get("brand"), "value": "%d%s, %s" % (int(v.get("total")) / 1000 if int(v.get("total")) / 1000 > 1 else 1, "k", int(v.get("cs2"))), "sort": v.get("total")})
            if len(dataset) > 9:
                break
        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        return {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", 'title': '品牌退货TOP10'}

    # 公司
    # 近12个月销售单数量走势(折线)
    def scs12(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs12')
        test = "销售单数"

        salesOr = redis.get('scs12' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr
        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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

        redis.set("scs12" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res

    # 近12个月补款总额走势(折线)
    def scs13(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs13')
        test = "补款总额 "
        salesOr = redis.get('scs13' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr
        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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
        redis.set("scs13" + "_" + str(company), json.dumps(res), 22 * 60 * 60)

        return res

    # 近12个月退货数量走势(折线)
    def scs14(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs14')
        test = "退货数量 "
        salesOr = redis.get('scs14' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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
        redis.set("scs14" + "_" + str(company), json.dumps(res), 22 * 60 * 60)

        return res

    # 近12个月退货总额走势(折线)
    def scs15(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs15')
        test = "退货总额 "
        salesOr = redis.get('scs15' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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
        redis.set("scs15" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res

    #  近12个月结算数量走势(折线)
    def scs16(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs16')
        test = "结算数量 "
        salesOr = redis.get('scs16' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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
        redis.set("scs16" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res
    #  近12个月结算总额走势(折线)
    def scs17(self, args, logger, redis, mongo):

        cs = int(args.get("scs"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs17')
        test = "结算总额 "
        salesOr = redis.get('scs17' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr

        if not salesAchievements: return {}

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        regionds = -1

        for value in salesAchievements:
            if value['company'] == company:
                if count < 12:
                    xs.append("%s年%s月" % (value['year'], value['month']))
                if regionds != value['regionds']:
                    legend.append(value['rename'])
                    ys["name"] = value['rename']
                    ys["type"] = 'line'
                    regionds = value['regionds']

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
            'title': {'text': '近12月各分区%s' % test},
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
        redis.set("scs17" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res

 # 公司品牌销售TOP10(表格)
    def scs20(self, args, logger, redis, mongo):

        results = redis.get('scs20')
        company = int(args.get("company"))
        salesOr = redis.get('scs20' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr
        if not results: return {}
        results = json.loads(results and results or {})
        dataset = []
        for v in results:
            if company == v.get("company"):
                dataset.append({"key": v.get("brand"), "value": "%d%s, %s" % (int(v.get("total")) / 1000 if int(v.get("total")) / 1000 > 1 else 1, "k", int(v.get("cs2"))), "sort": v.get("total")})
            if len(dataset) > 9:
                break
        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)
        res = {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", 'title': '公司品牌销售TOP10'}
        redis.set("scs20" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res

    # 公司品牌退货TOP10(表格)
    def scs21(self, args, logger, redis, mongo):

        results = redis.get('scs21')
        company = int(args.get("company"))
        salesOr = redis.get('scs21' + '_' + str(company))
        if not salesOr == None:
            salesOr = json.loads(salesOr and salesOr or {})
            return salesOr
        if not results: return {}
        results = json.loads(results and results or {})
        dataset = []
        for v in results:
            if company == v.get("company"):
                dataset.append({"key": v.get("brand"), "value": "%d%s, %s" % (int(v.get("total")) / 1000 if int(v.get("total")) / 1000 > 1 else 1, "k", int(v.get("cs2"))), "sort": v.get("total")})
            if len(dataset) > 9:
                break
        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        res = {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", 'title': '公司品牌退货TOP10'}
        redis.set("scs21" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res

    # group 集团:0 公司:1
    # 退货类型比例(饼状)
    def scs10(self, args, logger, redis, mongo):

        group = int(args.get("group"))
        company = int(args.get("company"))
        salesAchievements = redis.get('scs10')
        salesOr = redis.get('scs10' + '_' + str(company))
        if group == 1:
            if not salesOr == None:
                salesOr = json.loads(salesOr and salesOr or {})
                return salesOr
        if not salesAchievements: return {}

        cname = "" if group else "方林集团(全公司)"

        salesAchievements = json.loads(salesAchievements and salesAchievements or {})
        data = []
        type = -1
        cs0 = 0

        for value in salesAchievements:
            if company == value.get('company') and group:

                content = {}
                content["value"] = value["cs0"]
                content["name"] = value["name"]
                cname = value["cname"]
                data.append(content)

            if not group:

                if type != value.get("type"):
                    if cs0: data.append({"name": name, "value": cs0})
                    cs0 = value.get("cs0")
                    name = value.get("name")
                    type = value.get("type")
                else:
                    cs0 = cs0 + value.get("cs0")

        options = {
            'title': {'text': '退货类型比例', 'left': 'center' },
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
        redis.set("scs10" + "_" + str(company), json.dumps(res), 22 * 60 * 60)
        return res