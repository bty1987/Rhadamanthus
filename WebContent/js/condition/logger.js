

Condition.addupRule("log", {
    
    "loginId": {
        label: "帐号",
        type: "text",
        submitConfig: {
            name: "loginId",
            op: "eq",
            validate: null
        }
    },
    "sourceIp": {
        label: "IP",
        type: "text",
        submitConfig: {
            name: "sourceIp",
            op: "eq",
            validate: null
        }
    },
    "loginTime": {
        label: "登录时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "loginTime",
            op: "between",
            validate: null
        }
    },
    "successFlag": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "successFlag",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {key: "1", value: "成功"},
                {key: "0", value: "失败"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
});

