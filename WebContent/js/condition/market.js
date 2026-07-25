
Condition.addupRule("market", {
    
    "ecase-city": {
        label: "城市",
        type: "autofill",
        submitConfig: {
            name: "cityId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.market.queryEcityByPinYin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            query: "ecity.pinyin"
        }
    },
    
    "designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designer",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.market.queryEpersonByPinYin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            query: "epseron.pinyin"
        }
    },
    "supervisor": {
        label: "监理",
        type: "autofill",
        submitConfig: {
            name: "supervisor",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.market.queryEpersonByPinYin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            query: "eperson.pinyin"
        }
    },
    "pictureType": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "效果图"},
                {"key": "1", "value": "施工图"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "person-name" : {
        label:"姓名",
        type:"text",
        submitConfig : {
            name : "name",
            op : "cn",
            validate:null
        }
    },
    "style" : {
        label:"风格",
        type:"text",
        submitConfig : {
            name : "style",
            op : "cn",
            validate:null
        }
    },
    "houseType": {
        label: "户型",
        type: "select",
        submitConfig: {
            name: "houseType",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.ds.market,
            postData: {"timestamp": new Date().getTime()},
            listPath: "room",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "area": {
        label: "面积",
        type: "select",
        submitConfig: {
            name: "area",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.market,
            postData: {"timestamp": new Date().getTime()},
            listPath: "area",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customer-name": {
        label:"姓名",
        type:"text",
        submitConfig : {
            name : "name",
            op : "cn",
            validate:null
        }
    },
    "city": {
        label:"城市",
        type:"text",
        submitConfig : {
            name : "city",
            op : "cn",
            validate:null
        }
    },
    "phone" : {
        label:"电话",
        type:"text",
        submitConfig : {
            name : "phone",
            op : "cn",
            validate:{
                "reg": /^[0-9]*$/,
                "msg": "电话格式不正确"
            }
        }
    },
    "industry" : {
        label:"行业",
        type:"text",
        submitConfig : {
            name : "industry",
            op : "cn",
            validate:null
        }
    },
    "campaign-name": {
        label: "活动名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "campaign-type": {
        label: "活动类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "常规"},
                {"key": "1", "value": "线上"},
                {"key": "2", "value": "线下"},
                {"key": "3", "value": "异业"},
                {"key": "4", "value": "转介绍"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "campaign-status": {
        label: "活动状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "草稿"},
                {"key": "1", "value": "预热"},
                {"key": "2", "value": "进行中"},
                {"key": "3", "value": "暂停"},
                {"key": "4", "value": "结束"},
                {"key": "5", "value": "归档"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "channel-name": {
        label: "渠道名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "channel-platform": {
        label: "平台",
        type: "text",
        submitConfig: {
            name: "platform",
            op: "cn",
            validate: null
        }
    },
    "channel-type": {
        label: "渠道类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "未知"},
                {"key": "1", "value": "搜索"},
                {"key": "2", "value": "社媒"},
                {"key": "3", "value": "信息流"},
                {"key": "4", "value": "线下"},
                {"key": "5", "value": "合作"},
                {"key": "6", "value": "转介绍"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "channel-status": {
        label: "渠道状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "启用"},
                {"key": "1", "value": "停用"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "source-code": {
        label: "来源码",
        type: "text",
        submitConfig: {
            name: "code",
            op: "cn",
            validate: null
        }
    },
    "source-campaign": {
        label: "活动ID",
        type: "text",
        submitConfig: {
            name: "campaignId",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "活动ID格式不正确"}
        }
    },
    "source-channel": {
        label: "渠道ID",
        type: "text",
        submitConfig: {
            name: "channelId",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "渠道ID格式不正确"}
        }
    },
    "source-status": {
        label: "来源状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "启用"},
                {"key": "1", "value": "停用"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "source-utm": {
        label: "UTM Source",
        type: "text",
        submitConfig: {
            name: "utmSource",
            op: "cn",
            validate: null
        }
    },
    "inbound-no": {
        label: "入站编号",
        type: "text",
        submitConfig: {
            name: "inboundNo",
            op: "cn",
            validate: null
        }
    },
    "inbound-name": {
        label: "称呼",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "inbound-phone-hash": {
        label: "电话哈希",
        type: "text",
        submitConfig: {
            name: "phoneHash",
            op: "cn",
            validate: null
        }
    },
    "inbound-orderId": {
        label: "订单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "cn",
            validate: null
        }
    },
    "inbound-status": {
        label: "入站状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key": "0", "value": "待承接"},
                {"key": "1", "value": "成功"},
                {"key": "2", "value": "失败"},
                {"key": "3", "value": "重试中"},
                {"key": "4", "value": "忽略"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "inbound-campaign": {
        label: "活动ID",
        type: "text",
        submitConfig: {
            name: "campaignId",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "活动ID格式不正确"}
        }
    },
    "inbound-channel": {
        label: "渠道ID",
        type: "text",
        submitConfig: {
            name: "channelId",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "渠道ID格式不正确"}
        }
    },
    "inbound-source": {
        label: "来源ID",
        type: "text",
        submitConfig: {
            name: "sourceId",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "来源ID格式不正确"}
        }
    },
    "inbound-csid": {
        label: "客资ID",
        type: "text",
        submitConfig: {
            name: "csid",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "客资ID格式不正确"}
        }
    },
    "inbound-ccid": {
        label: "机会ID",
        type: "text",
        submitConfig: {
            name: "ccid",
            op: "eq",
            validate: {"reg": /^[0-9]*$/, "msg": "机会ID格式不正确"}
        }
    },
    
});
