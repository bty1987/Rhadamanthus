#!/usr/bin/python
# -*- coding:UTF-8 -*-

import json
import os
import requests

class Dict(dict):
    
    def __init__(self, *args, **kwargs):
        super(Dict, self).__init__(*args, **kwargs)
        
    def __getattr__(self, key):
        
        value = self[key]
        
        if isinstance(value, dict):
            value = Dict(value)
        
        return value

class Constant():
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    
    config = json.load(open(configPath, encoding="utf-8"))
    
    res = requests.post("%s/queryConstant.do" % (config.get("mthost")), {"constant.status": 0, "authentication": config.get("authentication")})
    
    for v in res.json().get("constants"):
        
        module = v.get("module", "")
        clazz = v.get("clazz", "")
        type = v.get("type", "")
        field = v.get("field", "")
        key = v.get("key", "")
        value = v.get("value", "")
        
        if not locals().get(module):
            locals()[module] = Dict({})
            
        if not locals().get(module).get(clazz):
            locals()[module][clazz] = Dict({})
            
        if not locals().get(module).get(clazz).get(type):
            locals()[module][clazz][type] = Dict({
                "data": [],
                "key": {},
                "value": {}
            })
            
        locals()[module][clazz][field] = key;
        locals()[module][clazz][type]["key"][key] = value;
        locals()[module][clazz][type]["value"][value] = key;
        
        locals()[module][clazz][type]["data"].append({
            "key": key,
            "value": value
        });
        
    def constructionnode(self, company):
    
        if int(company) == 0:
            company = ''
        else:
            company = 'where company = %s' % company

        sql = "SELECT cnid, name from data.constructionnode %s" % company

        self.cursor.execute(sql)
        nodes = self.cursor.fetchall()

        for node in nodes:
            self.projectStatus[node[0]] = node[1]

    decorationStatus = {
        0: "初始",
        1: "定金",
        2: "预签",
        3: "签约",
        4: "重签",
        5: "废单",
        6: "终止",
        7: "决算",
        8: "完结"
    }

    decorationType = {
        0: "半包",
        1: "整装",
        2: "半价",
        3: "满减",
        4: "减上捡",
        5: "达额减",
        6: "新满减",
        7: "局改",
        8: "全翻",
        9: "全案",
        10: "新达额减",
        11: "满额减",
    }

    decorationbelongType = {
        0: "设计",
        1: "业务"
    }

    paymentStatus = {
        0: "未付款",
        1: "已付款",
        2: "已确认",
    }

    paymentType = {
        2: "定金",
        3: "补款",
        4: "退款",
        5: "补款退款",
        6: "劵退款",
        7: "定金退款",
        8: "不可退定金"
    }

    advanceType = {
        0: "None",
        1: "合同预付款",
        2: "工程预付款",
        3: "主材预付款",
        4: "正林预付款"
    }

    types = {
        0: "提现",
        1: "收款",
        2: "付款",
        3: "退款"
    }

    advancePaymentType = {
        0: "合同预付款",
        1: "工程预付款",
        2: "主材预付款",
        3: "正林预付款"
    }

    decorationPaymentStatus = {
        0: "未付款",
        1: "已付款",
        2: "已确认",
        3: "审批中",
        4: "历史"
    }
    materialPaymentAdvanceType = {
        0: "None",
        1: "主材预付款",
        2: "正林预付款"
    }

    servicePaymentTypes = {
        0: "收款",
        1: "退款",
    }

    receiptPaymentType = {
        0: "预付款",
        1: "装修款",
        2: "主材款",
        3: "销售款",
        4: "服务款"
    }

    receipt = {
        0: "现金",
        1: "银行",
        2: "转账",
        3: "对公",
        4: "分期",
        5: "优惠"
    }

    projectStatus = {
        0: "初始",
        1: "开工",
        2: "完工",
        3: "砌墙",
        4: "铲大白",
        5: "放线",
        6: "水工",
        7: "力工",
        8: "电工",
        9: "瓦工",
        10: "地面找平",
        11: "木工",
        12: "油工",
        13: "水电验收",
        14: "保洁"
    }

    constructionStatus = {
        0: "初始",
        1: "开工",
        2: "完工"
    }

    constructionIshovel = {
        0: "公司",
        1: "客户"
    }

    constructionIskey = {
        0: "工程中心",
        1: "客户"
    }

    constructionIsCeremony = {
        0: "有",
        1: "无"
    }

    constructionDrawlineIstatus = {
        0: "排队",
        1: "放线申请",
        2: "放线成功",
        3: "放线失败"
    }

    accessoriesType = {
        7: "辅料",
        8: "辅退",
    }

    purchaseStatus = {
        0: "初始",
        1: "部分入库",
        2: "全部入库"
    }

    purchaseBalanceStatus = {
        0: "初始",
        1: "已结算",
        2: "完结"
    }

    manifestType = {
        1: "进货",
        2: "进退",
        3: "出货",
        4: "出返",
        5: "调拨",
        6: "采购",
        7: "辅料",
        8: "辅退",
        9: "套合",
        10: "套拆",
        11: "盘盈",
        12: "盘亏"
    }

    workerSalaryType = {
        0: "加",
        1: "减"
    }

    workerSalaryOneType = {
        0: "工费",
        1: "扣/罚",
        2: "转款",
        3: "其他",
    }

    workerSalaryTwoType = {
        1: "工费",
        2: "增项",
        3: "油工一级奖励",
        4: "维修款",
        5: "罚款",
        6: "工程质保金",
        7: "工具押金",
        8: "借款",
        9: "工人家属保险",
        10: "附加项",
        11: "预支工费",
        12: "运费",
        13: "上楼费",
        14: "工人维修款"
    }

    workerSalaryStatus = {
        0: "初始",
        1: "通过",
        2: "驳回",
        3: "撤销",
    }
    
    salesStatus = {
        0: "初始", 
        2: "全退", 
        3: "倒单", 
        4: "废单", 
        5: "完结"
    }
    
    salesPriceType = {
        0: "正价",
        1: "特价"
    }
    
    salesCType = {
        0: "底价", 
        1: "点位"
    }
    
    salesBalanceType = { 
        0: "购货", 
        1: "预结算退货", 
        2: "结算退货",
        3: "定金",
        4: "结算"
    }

    salesBalanceOneType = {
        0: "购货",
        1: "退货",
        2: "全退",
        3: "倒单"
    }
    
    salesBalanceStatus = {
        0: "预结算", 
        1: "厂商结算", 
        2: "结算"
    }

    vticketIsregist = {
        0: "未注册",
        1: "已注册"
    }

    vticketIscome = {
        0: "未到场",
        1: "已到场"
    }
    
    vpaymentType = {
        0: "装修款",
        1: "装修定金",
        2: "主材款",
        3: "主材定金",
    }

    addReduceType = {
        0: "增项",
        1: "减项"
    }
    
    awardStockType = {
        0: "劵",
        1: "物品",
        2: "红包",
    }

    awardStoreRoom = {
        0: "无",
        1: "装修",
        2: "主材",
        3: "销售"
    }

    awardSubtype = {
        0: "床上用品",
        1: "电器",
        2: "厨具",
        3: "日用品",
        4: "现金资产",
        5: "食品",
        6: "洁具",
        7: "工具",
        8: "其它"
    }

    awardPurchaseStart ={
        0: "初始",
        1: "采购",
        2: "入库",
        3: "结算"
    }
    
    isStock = {
        0: "计算",
        1: "不计算",
    }
    
    isPreforType = {
        0: "计算业绩",
        1: "不计算业绩"
    }
    
    isStateType = {
        0: "初始",
        1: "失效",
        2: "已领",
        3: "退货",
        4: "配送",
        5: "未退",
        6: "升级",
        7: "消耗",
        8: "折现",
        9: "签单抽奖",
        10: "活动抽奖",
        11: "签单特批",
        12: "活动特批"
    }
    
    awardRecordSubtype = {
        0: "入库",
        1: "出库",
        2: "盘盈",
        3: "盘亏",
        6: "退货",
        8: "采购",
        10: "公司回库",
        12: "剩余回库",
        14: "厂家赠送",
        5: "领取",
        7: "配送",
        9: "赔偿",
        11: "自购",
        13: "福利",
        15: "营销",
        17: "跨帐"
    }

    selectionType = {
        0: "报价项",
        1: "拓展增",
        2: "拓展减",
        3: "增项增",
        4: "增项减",
        5: "选材项",
        13: "增项下拨",
        23: "增项特批",
        14: "减项不退",
        30: "报价项(补量)",
        31: "拓展增(补量)",
        32: "拓展减(补量)",
        33: "增减增(补量)",
        34: "增减减(补量)",
    }

    selectionStatus = {
        0: "拆单",
        1: "下单",
        2: "审核",
        3: "确认",
        4: "完结",
        5: "核对",
        6: "结算",
        7: "失效"
    }

    userStatus = {
        0: "在职",
        1: "离职",
        2: "停薪留职"
    }

    # 1: 辽宁方林, 16: 吉林方林, 7: 安徽方林, 8: 湖北方林, 34: 武汉1918
    company4Scale = {
        1: 0.41,
        7: 0.392,
        8: 0.406,
        16: 0.467,
        34: 0.406
    }

    salesDeliveryStatus = {
        0: "初始",
        1: "配送",
        2: "审核",
        3: "确认",
        4: "完结"
    }

    userinfoLevelStatus = {
        "员工": 0,
        "核心员工": 1,
        "主管": 2,
        "经理": 3,
        "总监及以上": 4
    }
    
    userinfo2LevelStatus = {
        0: "员工",
        1: "核心员工",
        2: "主管",
        3: "经理",
        4: "总监及以上"
    }

    userinfoPoliticalStatus = {
        "群众": 0,
        "团员": 1,
        "党员": 2,
        "其它党派": 3
    }
    
    userinfo2PoliticalStatus = {
        0: "群众",
        1: "团员",
        2: "党员",
        3: "其它党派"
    }

    userinfoEducationStatus = {
        "小学及以下": 0,
        "初中": 1,
        "中专": 2,
        "高中": 3,
        "大专": 4,
        "本科": 5,
        "研究生及以上": 6
    }
    
    userinfo2EducationStatus = {
        0: "小学及以下",
        1: "初中",
        2: "中专",
        3: "高中",
        4: "大专",
        5: "本科",
        6: "研究生及以上"
    }

    userinfoEmployWayStatus = {
         "校园招聘": 0,
         "网络招聘": 1,
         "内部推荐": 2,
         "主动应聘": 3,
         "猎头": 4,
         "社会招聘": 5
    }
    
    userinfo2EmployWayStatus = {
         0: "校园招聘",
         1: "网络招聘",
         2: "内部推荐",
         3: "主动应聘",
         4: "猎头",
         5: "社会招聘"
    }

    userinfoStatus = {
        "是": 0,
        "否": 1
    }
    
    userinfo2Status = {
        0: "是",
        1: "否"
    }

    userinfoGenderStatus = {
        "女": 0,
        "男": 1
    }
    
    userinfo2GenderStatus = {
        0: "女",
        1: "男"
    }

    userinfoHouseholdTypeStatus = {
        "农村": 0,
        "城镇": 1,
        "非农业": 2
    }
    
    userinfo2HouseholdTypeStatus = {
        0: "农村",
        1: "城镇",
        2: "非农业"
    }

    userinfoEmployTypeStatus = {
        "正式": 0,
        "试用": 1
    }
    
    userinfo2EmployTypeStatus = {
        0: "正式",
        1: "试用"
    }

    occessoriesStatus = {
        0: "初始",
        1: "分配",
        2: "送货",
        3: "到货",
        4: "结算"
    }

    isEnter = {
        0: "是",
        1: "否"
    }

    isLift = {
        0: "有",
        1: "无"
    }

    isExceed = {
        0: "有",
        1: "无"
    }

    isAttic = {
        0: "有",
        1: "无"
    }
    reType = {
        1: "现金",
        2: "银行",
        3: "转账",
        4: "对公",
        5: "优惠"
    }
    reFund = {
        0: "普通",
        1: "资金"
    }
    reStatus = {
        0: "失效",
        1: "有效"
    }

    decorationOperateAtttype = {
        0: "通用",
        1: "设计",
        2: "业务"
    }

    decorationOperateType = {
        3: "终止",
        5: "签单",
        6: "重签"
    }