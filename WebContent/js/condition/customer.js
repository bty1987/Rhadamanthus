Condition.addupRule("customer", {

    "no": {
        label: "客户编号",
        type: "text",
        submitConfig: {
            name: "customerId",
            op: "cn",
            validate: null
        }
    },
    "phone": {
        label: "客户电话",
        type: "text",
        submitConfig: {
            name: "customer.phone",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            },
            alone: true
        },
    },
    "relationship": {
        label: "关系客户",
        type: "select",
        submitConfig: {
            name: "relationshipType",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.data,
            postData: {},
            listPath: "relationshipType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "customerType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "decoration.orderId",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
    "service-creater-name": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "creater",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": "0"
            },
            listPath: "userBases",
            keyPath: "userId",
            valuePath: "currentName"
        }
    },
    "service-updater-name": {
        label: "操作人",
        type: "autofill",
        submitConfig: {
            name: "updater",
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
    "service-aepair-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "aepair_status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-complain-status": {
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
                "key": "0",
                "value": "初始"
            }, {
                "key": "1",
                "value": "处理"
            }, {
                "key": "2",
                "value": "完结"
            }, {
                "key": "3",
                "value": "关闭"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-complain-level": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "level",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                "key": "0",
                "value": "标准"
            }, {
                "key": "1",
                "value": "重大"
            }, {
                "key": "2",
                "value": "危机"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerDeptRule-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "customerDeptRule-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "cusType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.customer().customerDeptRule.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerDeptRule-atttype": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "cusAtttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.customer().customerDeptRule.atttype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerChance-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validate: null
        }
    },
    "customerChance-type": {
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
            listPath: constant.customer().customerChance.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerChance-status": {
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
            listPath: constant.customer().customerChance.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "customerOrigine-phone": {
        label: "客源电话",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: {
                "reg": /^[0-9]*$/,
                "msg": "电话格式不正确"
            }
        }
    },
    "customerOrigine-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "village",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryVillageForNameByPinyin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerOrigine-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "customerOrigine-designer": {
        label: "归属设计师",
        type: "autofill",
        submitConfig: {
            name: "designer",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 0,
                "departmentType.name": ""
            },
            listPath: "userBases",
            keyPath: "uid",
            valuePath: "currentName"
        }
    },
    "customerOrigine-salesman": {
        label: "归属业务员",
        type: "autofill",
        submitConfig: {
            name: "salesman",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 0,
                "departmentType.name": ""
            },
            listPath: "userBases",
            keyPath: "uid",
            valuePath: "currentName"
        }
    },
    "customerOrigine-status": {
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
                "key": "0",
                "value": "初始"
            }, {
                "key": "1",
                "value": "初审"
            }, {
                "key": "2",
                "value": "提交"
            }, {
                "key": "3",
                "value": "确认"
            }, {
                "key": "4",
                "value": "审批"
            }, {
                "key": "5",
                "value": "绑定"
            }, {
                "key": "6",
                "value": "拒绝"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerSource-phone": {
        label: "电话",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: {
                "reg": /^[0-9]*$/,
                "msg": "电话格式不正确"
            }
        }
    },
    "customerSource-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "village",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryVillageForNameByPinyin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerSource-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "customerSource-status": {
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
            listPath: constant.customer().customerSource.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "v-name": {
        label: "客户名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "v-type": {
        label: "回访类型",
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
                "key": "0",
                "value": "保修"
            }, {
                "key": "1",
                "value": "投诉"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "feedback-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "feedback-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: null
        }
    },
    "feedback-phone": {
        label: "电话",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "cn",
            validate: null
        }
    },
    "feedback-type": {
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
                "key": "0",
                "value": "反馈"
            }, {
                "key": "1",
                "value": "投诉"
            }, {
                "key": "2",
                "value": "维修"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "member-no": {
        label: "会员编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null,
        }
    },

    "member-phone": {
        label: "手机号",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: {
                "reg": /^[0-9]*$/,
                "msg": "请输入数字"
            }
        }
    },

    "vscoreRecord-type": {
        label: "积分类型",
        type: "select",
        submitConfig: {
            name: "VscoreRecordType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "vscoreRecordtype",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "group-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "group-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: null
        }
    },
    "survey-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: null
        }
    },
    "survey-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validate: null
        }
    },
    "survey-sendTime": {
        label: "推送时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sendTime",
            op: "cn",
            validate: null
        }
    },
    "survey-handleTime": {
        label: "处理时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "handleTime",
            op: "cn",
            validate: null
        }
    },
    "survey-finishTime": {
        label: "完成时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "cn",
            validate: null
        }
    },
    "survey-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "surveyStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "droup-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: null
        }
    },
    "droup-updateTime": {
        label: "更新时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "updateTime",
            op: "cn",
            validate: null
        }
    },
    "droup-handleTime": {
        label: "处理时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "handleTime",
            op: "eq",
            validate: null
        }
    },
    "droup-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "droupStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "droup-isHandle": {
        label: "处理状态",
        type: "select",
        submitConfig: {
            name: "isHandle",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "droupIsHandle",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "droup-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "droupType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerUserRule-user": {
        label: "人员",
        type: "autofill",
        submitConfig: {
            name: "user",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"0" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerUserRule-creater": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "creater",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"0" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerUserRule-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "customerUserRule-finishTime": {
        label: "结束时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "customerUserRule-status" : {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.customer().customerUserRule.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    }

});