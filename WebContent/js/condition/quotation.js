
Condition.addupRule("quotation", {
    
    "worktype": {
        label: "工种",
        type: "select",
        submitConfig: {
            name: "quotationWorkTypeId",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.common.queryWorkType,
            postData: {},
            listPath: "workTypes",
            keyPath: "id",
            valuePath: "name"
        }
    },
    
    "selection-orderId":{
        label:"装修单号",
        type:"text",
        submitConfig : {
            name : "orderId",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "selection-item-status": {
        label: "状态",
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
                {key: "0", value: "初始"},
                {key: "1", value: "配送"},
                {key: "2", value: "审核"},
                {key: "3", value: "确认"},
                {key: "4", value: "完结"},
                {key: "5", value: "结算"},
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "selection-category" : {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "goods.category",
            op: "cn",
            validate: null
        },
    },
    "selection-brand" : {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "goods.brand",
            op: "cn",
            validate: null
        },
    },
    "selection-item-name" : {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    
});