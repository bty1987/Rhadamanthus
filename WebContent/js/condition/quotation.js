Condition.addupRule("quotation", {

    "worktype": {
        label: "工种",
        type: "select",
        submitConfig: {
            name: "quotationWorkTypeId",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.common.queryWorkType,
            postData: {},
            listPath: "workTypes",
            keyPath: "id",
            valuePath: "name"
        }
    },

    "presignProduce-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "presignProduce-status": {
        label: "类型",
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
                value: "发布"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "presignItem-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "presignItem-status": {
        label: "类型",
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
                value: "启用"
            }, {
                key: "1",
                value: "禁用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "presignPrice-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "presignPrice-status": {
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
                value: "启用"
            }, {
                key: "1",
                value: "禁用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "presignItem-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            postData: {},
            listPath: "presignItemType",
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-预签单
    "protation-decoration-orderId": {
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
    "protation-decoration-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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
    "protation-decoration-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "protation-decoration-salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "protation-decoration-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "decorationOrderStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "protation-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validate: null
        }
    },
    "protation-status": {
        label: "预签状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            listPath: "protationStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-报价单
    "quotation-decoration-orderId": {
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
    "quotation-decoration-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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
    "quotation-decoration-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quotation-decoration-salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quotation-decoration-status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "decorationOrderStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quotation-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validate: null
        }
    },
    "quotation-status": {
        label: "报价状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "quotationStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-拓展单
    "extension-decoration-orderId": {
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
    "extension-decoration-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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
    "extension-decoration-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "extension-salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "extension-decoration-status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "decorationOrderStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "extension-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "extension-status": {
        label: "扩展状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "extensionStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 选材单
    "selection-decoration-orderId": {
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
    "selection-decoration-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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

    "selection-decoration-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "selection-decoration-salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "selection-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },

    "selection-decoration-status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "decorationOrderStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "selection-status": {
        label: "选材状态",
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
                value: "锁定"
            }, ],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "selection-item-status": {
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
                value: "配送"
            }, {
                key: "2",
                value: "审核"
            }, {
                key: "3",
                value: "确认"
            }, {
                key: "4",
                value: "完结"
            }, {
                key: "5",
                value: "结算"
            }, ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "selection-category": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "goods.category",
            op: "cn",
            validate: null
        },
    },
    "selection-brand": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "goods.brand",
            op: "cn",
            validate: null
        },
    },
    "selection-item-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "selection-item-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-tranTime": {
        label: "配送时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "tranTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-checkTime": {
        label: "审核时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "checkTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-confirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "confirmTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-finishTime": {
        label: "完结时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "between",
            validate: null
        }
    },
    "selection-item-balanceTime": {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "balanceTime",
            op: "between",
            validate: null
        }
    },

    "selection-affirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "affirmTime",
            op: "eq",
            validate: null
        }
    },

    "selection-isAffirm": {
        label: "客户确认",
        type: "select",
        submitConfig: {
            name: "isAffirm",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "addReduceisAffirmDict",
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-定额单
    "norm-decoration-orderId": {
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
    "norm-decoration-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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
    "norm-decoration-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "norm-decoration-salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "norm-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "norm-decoration-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "decorationOrderStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-增减单
    "addreduce-orderId": {
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
    "addreduce-designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "addreduce-village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
            op: "eq ",
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
    "addreduce-houseNumber": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "houseNumber",
            op: "cn",
            validate: null
        }
    },
    "addreduce-houseArea": {
        label: "面积",
        type: "text",
        submitConfig: {
            name: "buildArea",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
    "addreduce-isaffirm": {
        label: "客户确认",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.quotation,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "addReduceisAffirmDict",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "addreduce-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "eq",
            validate: null
        }
    },
    "addreduce-affirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "affirmTime",
            op: "eq",
            validate: null
        }
    },
    "addreduce-sendTime": {
        label: "推送时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sendTime",
            op: "eq",
            validate: null
        }
    }
});