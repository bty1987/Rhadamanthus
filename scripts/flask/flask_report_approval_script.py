from dateutil.relativedelta import relativedelta
from dateutil import rrule
import datetime
import json


class approval():

    # 集团
    # 近12个月创建数量走势(折线)
    def acs0(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))

        approvalAchievements = redis.get('acs0')
        test = "创建数量 "

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in approvalAchievements:
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

    # 近12个月通过数量走势(折线)
    def acs1(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))

        approvalAchievements = redis.get('acs1')
        test = "通过数量"

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in approvalAchievements:
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

    # 近12个月驳回数量走势(折线)
    def acs2(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))

        approvalAchievements = redis.get('acs2')
        test = "驳回数量"

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in approvalAchievements:
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

    # 各类型审批总数(柱状)
    def acs3(self, args, logger, redis, mongo):

        approvalAchievements = redis.get('acs3')

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xAxis = []
        series = []

        for value in approvalAchievements:
            xAxis.append(value['name'])
            series.append(value['cs0'])

        option = {
            'title': { 'text': '各类型审批总数' , 'left': 'center' },
            'tooltip': { 'trigger': 'axis', 'axisPointer': { 'type': 'shadow' } },
            'xAxis': { 'type': 'category', 'data': xAxis },
            'yAxis': { 'type': 'value'},
            'series': [{
                    'data': series,
                    'type': 'bar',
                    'showBackground': True,
                    'backgroundStyle': { 'color': 'rgba(180, 180, 180, 0.2)' }
                }]
        };

        res = {"option": option, "errorCode": 0, "errorMsg": "","type": "bar"}

        return res

    # 集团版各类型审批总数(表格)
    def acs4(self, args, logger, redis, mongo):

        results = redis.get('acs4')

        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []

        for v in results:
            dataset.append({"key": v.get("name"), "value": v.get("cs0"), "sort": v.get("type")})

        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        return {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table"}

    # group: 集团:0 公司:1
    # 总数/未处理/通过/驳回总数(数字)
    def acs5(self, args, logger, redis, mongo):

        results = redis.get('acs5')
        company = int(args.get("company"))
        group = int(args.get("group"))

        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        cs0 = 0
        cs2 = 0
        cs3 = 0
        cs4 = 0

        for result in results:
            if result["company"] == company and group:
                dataset.append({"key": "", "value": ""})
                dataset.append({"key": "总数", "value": result["cs0"]})
                dataset.append({"key": "未处理总数", "value": result["cs2"]})
                dataset.append({"key": "通过总数", "value": result["cs3"]})
                dataset.append({"key": "驳回总数", "value": result["cs4"]})

                return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

            if not group:
                cs0 = cs0 + result["cs0"]
                cs2 = cs2 + result["cs2"]
                cs3 = cs3 + result["cs3"]
                cs4 = cs4 + result["cs4"]

        dataset.append({"key": "", "value": ""})
        dataset.append({"key": "总数", "value": cs0})
        dataset.append({"key": "未处理总数", "value": cs2})
        dataset.append({"key": "通过总数", "value": cs3})
        dataset.append({"key": "驳回总数", "value": cs4})

        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

    # 公司
    # 近12个月创建数量走势(折线)
    def acs6(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))
        company = int(args.get("company"))
        approvalAchievements = redis.get('acs0')
        test = "创建数量 "

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in approvalAchievements:
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

    # 近12个月通过数量走势(折线)
    def acs7(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))
        company = int(args.get("company"))
        approvalAchievements = redis.get('acs1')
        test = "通过数量"

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in approvalAchievements:
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

    # 近12个月驳回数量走势(折线)
    def acs8(self, args, logger, redis, mongo):

        cs = int(args.get("acs"))
        company = int(args.get("company"))
        approvalAchievements = redis.get('acs2')
        test = "驳回数量"

        if not approvalAchievements: return {}

        approvalAchievements = json.loads(approvalAchievements and approvalAchievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in approvalAchievements:
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

    # 公司版各类型审批总数(表格)
    def acs9(self, args, logger, redis, mongo):

        results = redis.get('acs6')
        company = int(args.get("company"))
        group = int(args.get("group"))

        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []

        for v in results:

            if company == v.get("company") and group:
                dataset.append({"key": v.get("name"), "value": v.get("cs0"), "sort": v.get("type")})
            if not group:
                dataset.append({"key": v.get("name"), "value": v.get("cs0"), "sort": v.get("type")})

        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        return {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table"}