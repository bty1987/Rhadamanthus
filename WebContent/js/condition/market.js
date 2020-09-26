
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
    
});