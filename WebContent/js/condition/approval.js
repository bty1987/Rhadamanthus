
Condition.addupRule("approval", {
    
    "approver-username": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "senderName",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"","departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiver-name": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "receiverName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"","departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "sender-name": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "senderName",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"","departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "type": {
        label: "审批类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.approval,
            postData: {"timestamp": new Date().getTime()},
            listPath: "approvalType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "status": {
        label: "审批状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.approval,
            postData: {"timestamp": new Date().getTime()},
            listPath: "approvalStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "createTime": {
        label: "提交时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "approvalTime": {
        label: "审批时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "approvalTime",
            op: "between",
            validate: null
        }
    },
    "process-no": {
        label: "编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "process-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    //状态栏（是否启用）
    "process-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        //dataSource是下拉框
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
});