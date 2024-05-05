Condition.addupRule("salary", {

    "user": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
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
            listPath: [{
                key: "0",
                value: "标准"
            }, {
                key: "1",
                value: "装修款"
            }],
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
            listPath: [{
                key: "0",
                value: "初始"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "checkTime": {
        label: "质检时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "checkTime",
            op: "between",
            validate: null
        }
    },
    "operateTime": {
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
            listPath: [{
                key: "0",
                value: "初始"
            }, {
                key: "1",
                value: "通过"
            }, {
                key: "2",
                value: "拒绝"
            }, {
                key: "3",
                value: "撤销"
            }],
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
            postData: {
                "user.status": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "checker": {
        label: "质检人",
        type: "autofill",
        submitConfig: {
            name: "checker",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": ""
            },
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
        dataSource: {// 从后台取数据的各种配置
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
            name: "cnid",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.data.queryConstructionNode,
            postData: {},
            listPath: "constructionNodes",
            keyPath: "cnid",
            valuePath: "name"
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
            listPath: [{
                key: "0",
                value: "初始"
            }, {
                key: "1",
                value: "通过"
            }, {
                key: "2",
                value: "驳回"
            }, {
                key: "3",
                value: "撤销"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "twotype": {
        label: "二类",
        type: "select",
        submitConfig: {
            name: "twotype",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.salary,
            postData: {},
            listPath: "SalaryTwoType",
            keyPath: "key",
            valuePath: "name"
        }
    },
    "isCheck": {
        label: "质检状态",
        type: "select",
        submitConfig: {
            name: "isCheck",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "0",
                value: "初始"
            }, {
                key: "1",
                value: "确认"
            }],
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
    "worker-count": {
        label: "计数",
        type: "select",
        submitConfig: {
            name: "count",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "1",
                value: "单条"
            }, {
                key: "2",
                value: "多条"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "decoraitonSalary-orderId": {
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
    "decoraitonSalary-belonger": {
        label: "归属人",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": "",
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "decoraitonSalary-type": {
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
            listPath: constant.salary().decorationSalary.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "decoraitonSalary-atttype": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.salary().decorationSalary.atttype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "decoraitonSalary-stage": {
        label: "阶段",
        type: "select",
        submitConfig: {
            name: "stage",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.salary().decorationSalary.stage.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "decoraitonSalary-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validata: null
        }
    },

    "materialSalary-orderId": {
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
    "materialSalary-sales-no": {
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
    "materialSalary-belonger": {
        label: "归属人",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validata: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 0,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "materialSalary-stage": {
        label: "阶段",
        type: "select",
        submitConfig: {
            name: "stage",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.salary,
            postData: {},
            listPath: "stage",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "materialSalary-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validata: null
        }
    },

});