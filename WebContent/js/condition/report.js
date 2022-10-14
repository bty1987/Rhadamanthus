Condition.addupRule("report", {

    "year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
    "typeness": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "typeness",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "typeness",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "sales-year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "sales-month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
    "construction-year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "construction-month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
    "user-year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "user-month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
    "approval-year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "approval-month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
    "approval-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.approval,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "approvalType",
            keyPath: "key",
            valuePath: "value"
        }
    },
});