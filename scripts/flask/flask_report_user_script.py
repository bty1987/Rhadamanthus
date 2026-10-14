from dateutil.relativedelta import relativedelta
from dateutil import rrule
import datetime
import json


class user():

    #  集团
    # 人员公司总数(表格)
    def ucs0(self, args, logger, redis, mongo):

        results = redis.get('ucs0')
        company = int(args.get("company"))
        group = int(args.get("group"))

        if not results: return {}

        results = json.loads(results and results or {})
        dataset = []

        for v in results:
            if company == v.get("company") and group:
                dataset.append({"key": v.get("name"), "value":  v.get("cs0"), "sort": v.get("cs0")})
            if not group:
                dataset.append({"key": v.get("name"), "value": v.get("cs0"), "sort": v.get("cs0")})

        new_dataset = sorted(dataset, key=lambda e: e.__getitem__('sort'), reverse=True)

        if group:
            title = "公司人员总数"
        else :
            title = "集团人员总数"

        return {"option": new_dataset, "errorCode": 0, "errorMsg": "", "type": "table", "title": title}

    # 在职/离职/总人数(数字)
    def ucs1(self, args, logger, redis, mongo):

        results = redis.get('ucs1')

        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        cs0 = 0
        cs1 = 0
        cs2 = 0

        for result in results:
            dataset.append({"key": "总人数", "value": result["cs0"]})
            dataset.append({"key": "在职人数", "value": result["cs1"]})
            dataset.append({"key": "离职人数", "value": result["cs2"]})

            return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

        dataset.append({"key": "", "value": ""})
        dataset.append({"key": "总人数", "value": cs0})
        dataset.append({"key": "在职人数", "value": cs1})
        dataset.append({"key": "离职人数", "value": cs2})

        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

    # 在离职总数(饼状)
    def ucs2(self, args, logger, redis, mongo):

        user7achievements = redis.get('ucs2')

        if not user7achievements: return {}

        cname = "方林集团(全公司)"

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        cs0 = 0
        cs1 = 0
        cs2 = 0

        for value in user7achievements:
             data.append({"name": "总人数", "value": value.get("cs0")})
             data.append({"name": "在职人数", "value": value.get("cs1")})
             data.append({"name": "离职人数", "value": value.get("cs2")})

        options = {
            'title': {'text': '在离职总数比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res

    # 近12个月人员入职人数走势(折线)
    def ucs3(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))

        user7achievements = redis.get('ucs3')
        test = "人员入职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in user7achievements:
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

    # 近12个月人员离职人数走势(折线)
    def ucs4(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))

        user7achievements = redis.get('ucs4')
        test = "人员离职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in user7achievements:
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

    #  近12个月人员调职人数走势(折线)
    def ucs5(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))

        user7achievements = redis.get('ucs5')
        test = "人员调职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1
        company = -1

        for value in user7achievements:
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

    # 人员工龄分布(柱状)
    def ucs6(self, args, logger, redis, mongo):

        user7achievements = redis.get('ucs6')

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xAxis = []
        series = []

        for value in user7achievements:
            xAxis.append("%s年" % value['jobYears'])
            series.append(value['j'])

        option = {
            'title': {'text': '人员工龄分布', 'left': 'center'},
            'tooltip': {'trigger': 'axis', 'axisPointer': {'type': 'shadow'}},
            'xAxis': {'type': 'category', 'data': xAxis},
            'yAxis': {'type': 'value'},
            'series': [{
                'data': series,
                'type': 'bar',
                'showBackground': True,
                'backgroundStyle': {'color': 'rgba(180, 180, 180, 0.2)'}
            }]
        };

        res = {"option": option, "errorCode": 0, "errorMsg": "", "type": "bar"}

        return res

    # 性别分布(饼状)
    def ucs7(self, args, logger, redis, mongo):

        user7achievements = redis.get('ucs7')

        if not user7achievements: return {}

        cname = "方林集团(全公司)"

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        gender: -1

        for value in user7achievements:
            data.append({"name": value.get("name"), "value": value.get("u")})

        options = {
            'title': {'text': '性别比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res

    # 人员学历分布(饼状)
    def ucs8(self, args, logger, redis, mongo):

        user7achievements = redis.get('ucs8')

        if not user7achievements: return {}

        cname = "方林集团(全公司)"

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        education:-1

        for value in user7achievements:
            data.append({"name": value.get("name"), "value": value.get("e")})

        options = {
            'title': {'text': '人员学历比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res

    # 公司
    # 在职/离职/总人数(数字)
    def ucs10(self, args, logger, redis, mongo):

        results = redis.get('ucs10')
        company = int(args.get("company"))

        if not results: return {}

        results = json.loads(results and results or {})

        dataset = []
        cs0 = 0
        cs1 = 0
        cs2 = 0

        for result in results:
            if result["company"] == company:
                dataset.append({"key": "总人数", "value": result["cs0"]})
                dataset.append({"key": "在职人数", "value": result["cs1"]})
                dataset.append({"key": "离职人数", "value": result["cs2"]})

        return {"option": dataset, "errorCode": 0, "errorMsg": "", "type": "number"}

    # 近12个月人员入职人数走势(折线)(公司版)
    def ucs12(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))
        company = int(args.get("company"))
        user7achievements = redis.get('ucs3')
        test = "人员入职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in user7achievements:
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

    # 近12个月人员离职人数走势(折线)(公司版)
    def ucs13(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))
        company = int(args.get("company"))
        user7achievements = redis.get('ucs4')
        test = "人员离职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in user7achievements:
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

    #  近12个月人员调职人数走势(折线)(公司版)
    def ucs14(self, args, logger, redis, mongo):

        cs = int(args.get("ucs"))

        user7achievements = redis.get('ucs5')
        company = int(args.get("company"))
        test = "人员调职人数"

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xs = []
        ys = {}
        data = []
        series = []
        legend = []
        count = 0
        intel = 1

        for value in user7achievements:
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

    # 人员工龄分布(柱状)
    def ucs15(self, args, logger, redis, mongo):

        user7achievements = redis.get('ucs15')
        company = int(args.get("company"))

        if not user7achievements: return {}

        user7achievements = json.loads(user7achievements and user7achievements or {})

        xAxis = []
        series = []

        for value in user7achievements:
            if value["company"] == company:
                xAxis.append("%s年" % value['jobYears'])
                series.append(value['j'])

        option = {
            'title': {'text': '公司人员工龄分布', 'left': 'center'},
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

    # 在离职总数(饼状)
    def ucs11(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        user7achievements = redis.get('ucs11')

        if not user7achievements: return {}

        cname = company

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        cs1 = 0
        cs2 = 0

        for value in user7achievements:
            if company == value.get('company'):
                data.append({"name": "在职人数", "value": value.get("cs1")})
                data.append({"name": "离职人数", "value": value.get("cs2")})

        options = {
            'title': {'text': '公司在离职比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res

    # 性别分布(饼状)
    def ucs16(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        user7achievements = redis.get('ucs16')

        if not user7achievements: return {}

        cname = company

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        gender: -1
        u = 0

        for value in user7achievements:
            if company == value.get('company'):

                content = {}
                content["value"] = value["u"]
                content["name"] = value["name"]
                data.append(content)

        options = {
            'title': {'text': '公司性别比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {
                    'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res

    # 人员学历分布(饼状)
    def ucs17(self, args, logger, redis, mongo):

        company = int(args.get("company"))
        user7achievements = redis.get('ucs17')

        if not user7achievements: return {}

        cname = company

        user7achievements = json.loads(user7achievements and user7achievements or {})
        data = []
        education: -1

        for value in user7achievements:
            if company == value.get('company'):

                content = {}
                content["value"] = value["e"]
                content["name"] = value["name"]
                data.append(content)

        options = {
            'title': {'text': '公司人员学历比例', 'left': 'center'},
            "tooltip": {"trigger": "item"},
            "legend": {'orient': 'vertical', 'left': 'left', "bottom": 50, },
            'series': [{
                'name': cname,
                'type': 'pie',
                'radius': '50%',
                'data': data,
                'emphasis': {'itemStyle': {'shadowBlur': 10, 'shadowOffsetX': 0, 'shadowColor': 'rgba(0, 0, 0, 0.5)'}}
            }]
        }

        res = {"option": options, "errorCode": 0, "errorMsg": "", "type": "pie"}

        return res