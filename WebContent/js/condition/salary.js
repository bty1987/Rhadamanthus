Condition.addupRule("salary", {

    "user": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "orderId" : {
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
    "withhold-type": {
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
            listPath: [{key: "0", value: "普通"}, {key: "1", value: "装修款"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "withhold-status": {
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
            listPath: [{key: "0", value: "初始"}],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "createTime":{
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "operateTime":{
        label: "操作时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "operateTime",
            op: "between",
            validate: null
        }
    },
    "salary-status": {
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
                {key: "1", value: "通过"},
                {key: "2", value: "拒绝"},
                {key: "3", value: "撤销"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "jober": {
        label: "工人姓名",
        type: "autofill",
        submitConfig: {
            name: "userName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salaryWorkduty": {
        label: "工种",
        type: "select",
        submitConfig: {
            name: "duty",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.construction,
            postData: {},
            listPath: "constructionSchedule",
            keyPath: "value",
            valuePath: "value"
        }
    },
    "salaryschedule": {
        label: "施工节点",
        type: "select",
        submitConfig: {
            name: "schedule",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.construction,
            postData: {},
            listPath: "constructionSchedule",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salarystatus": {
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
                {key: "1", value: "通过"},
                {key: "2", value: "驳回"},
                {key: "3", value: "撤销"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "approveTime": {
        label: "审批时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "approveTime",
            op: "between",
            validate: null
        }
    },
})