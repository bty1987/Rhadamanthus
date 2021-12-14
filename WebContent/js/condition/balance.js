
Condition.addupRule("balance", {
    
    "account-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "account-status": {
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
            listPath: [{key: "0", value: "有效"}, {key: "1", value: "无效"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-no": {
        label: "结算单编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "balance-type": {
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
            listPath: [{key: "0", value: "支出"}, {key: "1", value: "收款"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-status": {
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
            listPath: [{key: "0", value: "初始"}, {key: "1", value: "完结"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "balanceSelse-brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "brandId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name",
        }
    },
    "balanceSelse-grade" : {
        label:"等级",
        type:"select",
        submitConfig:{
            name: "grade",
            op: "eq",
            validate: null 
        },
        dataSource: {
            url: api.ds.balance,
            postData: {},
            listPath: "balanceSalesGrade",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-status" : {
        label:"状态",
        type:"select",
        submitConfig:{
            name: "status",
            op: "eq",
            validate: null 
        },
        dataSource: {
            url: api.ds.balance,
            postData: {},
            listPath: "balanceSalesStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "balanceSelse-creater": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "createrId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },

});