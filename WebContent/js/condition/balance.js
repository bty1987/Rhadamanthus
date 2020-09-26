
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
    
});