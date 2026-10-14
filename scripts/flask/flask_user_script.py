#coding: UTF-8
import re

class report():
    """
        在mongo数据库中获取人员信息, 提供<报表_人员>页面下画图所需要的数据
    """

    def getCompanyName(mongo):
        mongoCompany = mongo.communion.company
        companys = mongoCompany.find()

        companysData = {}

        for i, v in enumerate(companys):
            companysData[v["cid"]] = v["name"]

        return companysData

    # 人员性别分布 , 男/女 , (集团)
    def gender4group(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user

        userGender = mongoUser.aggregate([{"$match": {"status": 0}},
                                          {"$group": {"_id": {"gender": "$gender", "company": "$company"}, "count": {"$sum": 1}}},
                                          {'$sort':{"_id.company":1, "_id.gender":1}}])

        xs = []
        gys = []
        bys = []

        collectData = {}

        companys = report.getCompanyName(mongo)

        for i, v in enumerate(userGender):
            cidNum = v["_id"]["company"]
            cid = "%s" % cidNum
            companyName = companys[cid]

            if companyName not in xs:
                xs.append(companyName)

            if cidNum not in collectData:
                collectData[cidNum] = {v["_id"]["gender"]: v["count"]}
            else:
                collectData[cidNum][v["_id"]["gender"]] = v["count"]

        for i, v in enumerate(collectData):
            if collectData[v].get("女"):
                gys.append(collectData[v].get("女"))
            else:
                gys.append(0)

            if collectData[v].get("男"):
                bys.append(collectData[v].get("男"))
            else:
                bys.append(0)

        nameAndValue = []

        nameAndValue.append({"name": '男', "value": sum(bys)})
        nameAndValue.append({"name": '女', "value": sum(gys)})

        options = {
            'title': {'text': '人员性别分布'},
            'tooltip': {'trigger': 'axis'},
            'grid': {
                'top': 80,
                'bottom': 40,
                'tooltip': {
                    'trigger': 'axis',
                    'axisPointer': {
                        'type': 'shadow',
                        'label': {
                            'show': True,
                        }
                    }
                }
            },
            "xAxis": [{"type": "category", "data": xs}],
            "yAxis": [{"type": "value", 'name': '数量(名)'}],
            "series":[{"type": "bar", "name": "男", "data": bys},
                      {"type": "bar", "name": "女", "data": gys},
                      {
                            'name': '数量',
                            'type': 'pie',
                            'center': ['80%', '20%'],
                            'radius': '28%',
                            'z': 100,
                            'data': nameAndValue
                        }]
        }

        return options

    # 人员部门分布 , 各部门对应人员数 , (公司)
    def department4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        usercommon = mongoUser.aggregate([{"$match": {"company": int(company), "status": 0}}, {"$group": {"_id": {"deptName": "$deptName", "deptTypeName": "$deptTypeName"}, "count": {"$sum": 1}}}])

        zs = []
        deptData = {}
        deptTypeArray = []

        deptData["name"] = "公司部门"
        deptData["children"] = []

        for i, v in enumerate(usercommon):
            deptName = v["_id"]["deptName"]
            deptTypeName = v["_id"]["deptTypeName"]

            deptParam = {}

            if deptTypeName in deptTypeArray:
                typeIndex = deptTypeArray.index(deptTypeName)
                deptData["children"][typeIndex]["children"].append({"name":("\n").join(re.split("", deptName)).replace('\n', '', 1)})
            else:
                deptParam["name"] = deptTypeName
                deptParam["children"] = [{"name":("\n").join(re.split("", deptName)).replace('\n', '', 1)}]
                deptData["children"].append(deptParam)
                deptTypeArray.append(deptTypeName)

        zs.append(deptData)

        options = {
            'title': {'text': '人员部门分布'},
            'toolbox': {
                'show': True,
                'feature': {
                    'mark': {'show': True},
                    'dataVie': {'show': True, 'readOnly': False},
                    'restore': {'show': True},
                    'saveAsImage': {'show': True}
                }
            },
            "series": [{
                'name': '公司部门',
                'type': 'tree',
                'orient': 'vertical',
                'rootLocation': {'x': 'center', 'y': 30},
                'nodePadding': 300,
                'layerPadding': 50,
                'hoverable': False,
                'roam': True,
                'symbolSize': 6,
                'itemStyle': {
                    'normal': {
                        'color': '#4883b4',
                        'label': {
                            'show': True,
                            'position': 'bottom',
                            'formatter': "{b}",
                            'textStyle': {
                                'color': '#000',
                                'fontSize': 9
                            },
                            'orient': 'vertical',
                        },
                        'lineStyle': {
                            'color': '#ccc',
                            'type': 'curve'
                        }
                    },
                    'emphasis': {
                        'color': '#4883b4',
                        'label': {
                            'show': False
                        },
                        'borderWidth': 0
                    }
                },
                'data': zs
            }]
        }

        return options

    # 人员公司分布 , 各公司对应人员数
    def total4group(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        userCompany = mongoUser.aggregate([{"$group": {"_id": {"company": "$company"}, "count": {"$sum": 1}}},{'$sort':{"_id.company":1}}])

        xs = []
        ys = []
        zs = []

        companyNames = report.getCompanyName(mongo)

        for i, v in enumerate(userCompany):
            companyName = companyNames[str(v["_id"]["company"])]

            xs.append(companyName)
            ys.append(v["count"])
            zs.append({"name":companyName, "value":v["count"]})

        options = {
            'title': {'text': '人员公司分布'},
            'tooltip': {'trigger': 'axis'},
            'grid': {
                'top': 80,
                'bottom': 40,
                'tooltip': {
                    'trigger': 'axis',
                    'axisPointer': {
                        'type': 'shadow',
                        'label': {
                            'show': True,
                        }
                    }
                }
            },
            "xAxis": [{"type": "category", "data": xs}],
            "yAxis": [{"type": "value", "name": "数量(名)"}],
            "series": [{"type": "bar", "name": "数量", "data": ys}, {
                        'name': '数量',
                        'type': 'pie',
                        'center': ['80%', '25%'],
                        'radius': '28%',
                        'z': 100,
                        'data': zs
                    }]
        }

        return options

    # 人员员工总数 , 在职数 , 离职数 , (集团)
    def status4group(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user

        usercommon = mongoUser.aggregate([{"$group": {"_id": {"company": "$company", "status": "$status"}, "count": {"$sum": 1}}},
                                          {'$sort': {"_id.company": 1, "_id.status": 1}}])

        xs = []

        jobNum = []
        leaveNum = []
        moneyNum = []

        collectData = {}

        companys = report.getCompanyName(mongo)

        for i, v in enumerate(usercommon):
            status = v["_id"]["status"]
            cidNum = v["_id"]["company"]

            cid = "%s" % cidNum
            companyName = companys[cid]

            if companyName not in xs:
                xs.append(companyName)

            if cidNum not in collectData:
                collectData[cidNum] = {status: v["count"]}
            else:
                collectData[cidNum][status] = v["count"]

        for i, v in enumerate(collectData):
            if collectData[v].get(0):
                jobNum.append(collectData[v].get(0))
            else:
                jobNum.append(0)

            if collectData[v].get(1):
                leaveNum.append(collectData[v].get(1))
            else:
                leaveNum.append(0)

            if collectData[v].get(2):
                moneyNum.append(collectData[v].get(2))
            else:
                moneyNum.append(0)

        nameAndValue = []
        nameAndValue.append({"name": "在职", "value": sum(jobNum)})
        nameAndValue.append({"name": "离职", "value": sum(leaveNum)})
        nameAndValue.append({"name": "停薪留职", "value": sum(moneyNum)})

        options = {
            'title': {'text': '人员员工总数'},
            'tooltip': {'trigger': 'axis'},
            'grid': {
                'top': 80,
                'bottom': 40,
                'tooltip': {
                    'trigger': 'axis',
                    'axisPointer': {
                        'type': 'shadow',
                        'label': {
                            'show': True,
                        }
                    }
                }
            },
            "xAxis": [{"type": "category", "data": xs}],
            "yAxis": [{"type": "value", 'name': '数量(名)'}],
            "series": [{"type": "bar", "name": "在职", "data": jobNum},
                       {"type": "bar", "name": "离职", "data": leaveNum},
                       {"type": "bar", "name": "停薪留职", "data": moneyNum},
                       {
                           'name': '数量',
                           'type': 'pie',
                           'center': ['80%', '20%'],
                           'radius': '28%',
                           'z': 100,
                           'data': nameAndValue
                       }]
        }

        return options

    #人员员工总数 , 在职数 , 离职数 , (公司)
    def status4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        usercommon = mongoUser.aggregate([{"$match": {"company": int(company)}},
                                          {"$group": {"_id": {"status": "$status"}, "count": {"$sum": 1}}},
                                          {'$sort':{"_id.status":1}}])

        zs = []

        for i, v in enumerate(usercommon):
            status = v["_id"]["status"]
            if status == 0:
                statusName = "在职"
            elif status == 1:
                statusName = "离职"
            elif status == 2:
                statusName = "停薪留职"
            zs.append({"name":statusName, "value":v["count"]})

        options = {
            'title': {'text': '人员员工总数'},
            'tooltip': {'trigger': 'item', 'formatter': "{a} <br/>{b} : {c} ({d}%)"},
            "series": [{"name": "数量", "type": "pie", 'radius': '55%', 'center': ['50%', '60%'], "data": zs,
                        'itemStyle': {
                            'emphasis': {
                                'shadowBlur': 10,
                                'shadowOffsetX': 0,
                                'shadowColor': 'rgba(0, 0, 0, 0.5)'
                            }
                        }}]
        }

        return options

    #人员职位分布 , 各职位对应人员数 , (公司)
    def duty4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        usercommon = mongoUser.aggregate([{"$match": {"company": int(company), "status": 0}}, {"$group": {"_id": {"duty": "$duty"}, "count": {"$sum": 1}}}])

        xs = []
        ys = []

        for i, v in enumerate(usercommon):
            xs.append(v["_id"]["duty"])
            ys.append(v["count"])

        options = {
            'title': {'text': '人员职位分布'},
            'tooltip': {'trigger': 'axis'},
            'grid': {
                'top': 80,
                'bottom': 40,
                'tooltip': {
                    'trigger': 'axis',
                    'axisPointer': {
                        'type': 'shadow',
                        'label': {
                            'show': True,
                        }
                    }
                }
            },
            "xAxis": [{"type": "category", "data": xs}],
            "yAxis": [{"type": "value", "name": "数量(名)"}],
            "series": [{"type": "bar", "name": "数量", "data": ys}]
        }

        return options

    # 人员部门类型分布 , 各类型对应人员数 , (公司)
    def departmenttype4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        usercommon = mongoUser.aggregate([{"$match": {"company": int(company), "status": 0}}, {"$group": {"_id": {"deptTypeName": "$deptTypeName"}, "count": {"$sum": 1}}}])

        xs = []
        ys = []

        for i, v in enumerate(usercommon):
            xs.append(v["_id"]["deptTypeName"])
            ys.append(v["count"])

        options = {
            'title': {'text': '人员部门类型分布'},
            'tooltip': {'trigger': 'axis'},
            'grid': {
                'top': 80,
                'bottom': 40,
                'tooltip': {
                    'trigger': 'axis',
                    'axisPointer': {
                        'type': 'shadow',
                        'label': {
                            'show': True,
                        }
                    }
                }
            },
            "xAxis": [{"type": "category", "data": xs}],
            "yAxis": [{"type": "value", "name": "数量(名)"}],
            "series": [{"type": "bar", "name": "数量", "data": ys}]
        }

        return options

    # 人员工龄分布 , 1年以下/1年/2年/3-5年/6-8年/9-10年/十年以上 , (集团)
    def servicelength4group(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user

        jobYearsDate = mongoUser.aggregate([{"$match": {"status": 0}}, {"$group": {"_id": {"jobYears": "$jobYears"}, "count": {"$sum": 1}}},{'$sort':{"_id.jobYears":1}}])

        zs = []

        oneCount = 0
        twoCount = 0
        threeCount = 0
        fourCount = 0

        for i, v in enumerate(jobYearsDate):
            num = v["_id"]["jobYears"]
            if num < 1:
                zs.append({'name':'1年以下', 'value':v["count"]})
            elif num in [1, 2]:
                zs.append({'name': '%s年' % num, 'value': v["count"]})
            elif num in [3, 4, 5]:
                oneCount += v["count"]
            elif num in [6, 7, 8]:
                twoCount += v["count"]
            elif num in [9, 10]:
                threeCount += v["count"]
            elif num > 10:
                fourCount += v["count"]

        if oneCount > 0:
            zs.append({'name': '3-5年', 'value': oneCount})

        if twoCount > 0:
            zs.append({'name': '6-8年', 'value': twoCount})

        if threeCount > 0:
            zs.append({'name': '9-10年', 'value': threeCount})

        if fourCount > 0:
            zs.append({'name':'10年以上', 'value': fourCount})

        options = {
            'title': {'text': '人员工龄分布'},
            'tooltip': {'trigger': 'item', 'formatter': "{a} <br/>{b} : {c} ({d}%)"},
            "series": [{"name": "数量", "type": "pie", 'radius' : '55%', 'center': ['50%', '60%'], "data": zs,
            'itemStyle': {
                'emphasis': {
                    'shadowBlur': 10,
                    'shadowOffsetX': 0,
                    'shadowColor': 'rgba(0, 0, 0, 0.5)'
                }
            }}]
        }

        return options

    # 人员工龄分布 , 1年以下/1年/2年/3-5年/6-8年/9-10年/十年以上 , (公司)
    def servicelength4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        jobYearsDate = mongoUser.aggregate([{"$match": {"company": int(company), "status": 0}},
                                            {"$group": {"_id": {"jobYears": "$jobYears"}, "count": {"$sum": 1}}},
                                            {'$sort': {"_id.jobYears": 1}}])

        zs = []

        oneCount = 0
        twoCount = 0
        threeCount = 0
        fourCount = 0

        for i, v in enumerate(jobYearsDate):
            num = v["_id"]["jobYears"]
            if num < 1:
                zs.append({"name": '1年以下', "value": v["count"]})
            elif num in [1, 2]:
                zs.append({"name": '%s年' % num, "value": v["count"]})
            elif num in [3, 4, 5]:
                oneCount += v["count"]
            elif num in [6, 7, 8]:
                twoCount += v["count"]
            elif num in [9, 10]:
                threeCount += v["count"]
            elif num > 10:
                fourCount += v["count"]

        if oneCount > 0:
            zs.append({"name": '3-5年', "value": oneCount})

        if twoCount > 0:
            zs.append({"name": '6-8年', "value": twoCount})

        if threeCount > 0:
            zs.append({"name": '9-10年', "value": threeCount})

        if fourCount > 0:
            zs.append({"name": '10年以上', "value": fourCount})

        options = {
            'title': {'text': '人员工龄分布'},
            'tooltip': {'trigger': 'item', 'formatter': "{a} <br/>{b} : {c} ({d}%)"},
            "series": [{"name": "数量", "type": "pie", 'radius' : '55%', 'center': ['50%', '60%'], "data": zs,
            'itemStyle': {
                'emphasis': {
                    'shadowBlur': 10,
                    'shadowOffsetX': 0,
                    'shadowColor': 'rgba(0, 0, 0, 0.5)'
                }
            }}]
        }

        return options

    # 人员学历分布 , 其他/大专/本科/硕士/博士/博士以上 , (集团)
    def education4group(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user

        educationDate = mongoUser.aggregate([{"$match": {"status": 0}}, {"$group": {"_id": {"education": "$education"}, "count": {"$sum": 1}}}])

        zs = []

        eduOtherCount = 0

        for i, v in enumerate(educationDate):
            if v["_id"]["education"] not in ["", None, "无"]:
                zs.append({"name": v["_id"]["education"], "value": v["count"]})
            else:
                eduOtherCount += v["count"]

        if eduOtherCount > 0:
            zs.append({"name": '其他', "value": eduOtherCount})

        options = {
            'title': {'text': '人员学历分布'},
            'tooltip': {'trigger': 'item', 'formatter': "{a} <br/>{b} : {c} ({d}%)"},
            'toolbox': {
                'show': True,
                'feature': {
                    'mark': {'show': True},
                    'dataView': {'show': True, 'readOnly': False},
                    'magicType': {
                        'show': True,
                        'type': ['pie', 'funnel']
                    },
                    'restore': {'show': True},
                    'saveAsImage': {'show': True}
                }
            },
            'calculable': True,
            'series': [
                {
                    'name': '数量',
                    'type': 'pie',
                    'radius': [30, 200],
                    'roseType': 'area',
                    'data': zs
                }
            ]
        }

        return options

    # 人员学历分布 , 其他/大专/本科/硕士/博士/博士以上 , (公司)
    def education4company(self, args, logger, redis, mongo):
        mongoUser = mongo.communion.user
        company = args.get('company')

        educationDate = mongoUser.aggregate([{"$match": {"company": int(company), "status": 0}},
                                             {"$group": {"_id": {"education": "$education"}, "count": {"$sum": 1}}}])

        zs = []

        eduOtherCount = 0

        for i, v in enumerate(educationDate):
            if v["_id"]["education"] not in ["", None, "无"]:
                zs.append({'name': v["_id"]["education"], 'value': v["count"]})
            else:
                eduOtherCount += v["count"]

        if eduOtherCount > 0:
            zs.append({'name': '其他', 'value': eduOtherCount})


        options = {
            'title': {'text': '人员学历分布'},
            'tooltip': {'trigger': 'item', 'formatter': "{a} <br/>{b} : {c} ({d}%)"},
            'toolbox': {
                'show': True,
                'feature': {
                    'mark': {'show': True},
                    'dataView': {'show': True, 'readOnly': False},
                    'magicType': {
                        'show': True,
                        'type': ['pie', 'funnel']
                    },
                    'restore': {'show': True},
                    'saveAsImage': {'show': True}
                }
            },
            'calculable': True,
            'series': [
                {
                    'name': '数量',
                    'type': 'pie',
                    'radius': [30, 200],
                    'roseType': 'area',
                    'data': zs
                }
            ]
        }

        return options