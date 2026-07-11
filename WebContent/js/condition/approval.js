
Condition.addupRule("approval", {

    "orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
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
        label: "审批人",
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
        label: "申请人",
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
            url: null,
            postData: null,
            listPath: constant.approval().approval.type.datas,
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
            url: null,
            postData: null,
            listPath: constant.approval().approval.status.datas,
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
            url: null,
            postData: null,
            listPath: constant.data().common.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
});