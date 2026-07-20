

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

    // ===== actionLog 专用条件（Phase 2）=====
    "actionUserId": {
        label: "操作人账号",
        type: "text",
        submitConfig: {
            name: "createUserId",
            op: "eq",
            validate: null
        }
    },
    "actionUserName": {
        label: "操作人姓名",
        type: "text",
        submitConfig: {
            name: "createUser",
            op: "cn",
            validate: null
        }
    },
    "actionName": {
        label: "接口名",
        type: "text",
        submitConfig: {
            name: "actionName",
            op: "cn",
            validate: null
        }
    },
    "actionModule": {
        label: "业务模块",
        type: "select",
        submitConfig: {
            name: "moduleId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {key: "decoration", value: "装修订单"},
                {key: "quotation", value: "报价"},
                {key: "construction", value: "施工"},
                {key: "customer", value: "客户"},
                {key: "balance", value: "结算"},
                {key: "payment", value: "款项"},
                {key: "material", value: "主材"},
                {key: "sales", value: "销售"},
                {key: "personel", value: "人员"},
                {key: "system", value: "系统"},
                {key: "approval", value: "审批"},
                {key: "information", value: "信息"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "actionOperateType": {
        label: "操作类型",
        type: "select",
        submitConfig: {
            name: "operateType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {key: "ADD", value: "新增"},
                {key: "UPDATE", value: "修改"},
                {key: "DELETE", value: "删除"},
                {key: "QUERY", value: "查询"},
                {key: "EXPORT", value: "导出"},
                {key: "LOGIN", value: "登录"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "actionResultState": {
        label: "结果",
        type: "select",
        submitConfig: {
            name: "resultState",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {key: "0", value: "成功"},
                {key: "1", value: "失败"},
                {key: "2", value: "异常"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "actionTime": {
        label: "操作时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "actionIp": {
        label: "来源IP",
        type: "text",
        submitConfig: {
            name: "ip",
            op: "eq",
            validate: null
        }
    },
    "actionBusinessId": {
        label: "业务对象ID",
        type: "text",
        submitConfig: {
            name: "businessId",
            op: "eq",
            validate: null
        }
    }

});

