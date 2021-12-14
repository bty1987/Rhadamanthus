
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
    "selection-item-createTime" : {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-tranTime" : {
        label: "配送时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "tranTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-checkTime" : {
        label: "审核时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "checkTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-confirmTime" : {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "confirmTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-finishTime" : {
        label: "完结时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-balanceTime" : {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "balanceTime",
            op: "between",
            validate: null
        }
    },
    "presignProduce-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "presignProduce-status": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{key: "0", value: "初始"}, {key: "1", value: "发布"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "presignItem-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "presignItem-status": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{key: "0", value: "启用"}, {key: "1", value: "禁用"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "presignItem-type": {
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
            listPath: [{key: "0", value: "基础"}, {key: "1", value: "工程"}, {key: "2", value: "主材"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
});