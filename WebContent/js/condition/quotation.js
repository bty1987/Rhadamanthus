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
            url: null,
            postData: null,
            listPath: constant.data().presignItem.type.datas,
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
            url: null,
            listPath: constant.quotation().protation.status.datas,
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
            url: null,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().quotation.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 报价-报退单
    "quotationRefund-decoration-orderId": {
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
            url: null,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().extension.status.datas,
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

    "selection-item-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().selectionItem.type.datas,
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
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().selectionItem.status.datas,
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

    "selection-item-reviewTime": {
        label: "核对时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "reviewTime",
            op: "between",
            validate: null
        }
    },

    "selection-item-accountStatus": {
        label: "对账状态",
        type: "select",
        submitConfig: {
            name: "accountStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.quotation().selectionItem.accountStatus.datas,
            keyPath: "key",
            valuePath: "value"
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
            url: null,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().selection.isAffirm.datas,
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
            url: null,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: constant.quotation().addreduce.isAffirm.datas,
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
    },
    "addreduce-constructionNode": {
        label: "施工节点",
        type: "select",
        submitConfig: {
            name: "constructionNodeId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryConstructionNode,
            postData: {},
            listPath: "constructionNodes",
            keyPath: "cnid",
            valuePath: "name"
        }
    },

    "quotationLabel-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },

    // 记录
    "quotationRecord-operatTime": {
        label: "记录时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "operatTime",
            op: "eq",
            validate: null
        }
    },

    // ==================== 报价预算员分配相关条件 ====================

    // 预算员规则 - 状态
    "budgetUserRule-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "budgetUserRule.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "1",
                value: "可用"
            }, {
                key: "2",
                value: "忙碌"
            }, {
                key: "3",
                value: "已停用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 预算员规则 - 姓名
    "budgetUserRule-userName": {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "budgetUserRule.userName",
            op: "cn",
            validate: null
        }
    },

    // 待分配队列 - 状态
    "quotation-assignRequest-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "quotationAssignRequest.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "1",
                value: "待分配"
            }, {
                key: "2",
                value: "已分配"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 待分配队列 - 优先级
    "quotation-assignRequest-priority": {
        label: "优先级",
        type: "select",
        submitConfig: {
            name: "quotationAssignRequest.priority",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "1",
                value: "最高"
            }, {
                key: "2",
                value: "高"
            }, {
                key: "5",
                value: "普通"
            }, {
                key: "9",
                value: "最低"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 待分配队列 - 装修单号
    "quotation-assignRequest-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "quotationAssignRequest.orderId",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确，仅支持A-Z,0-9"
            }
        }
    },

    // ==================== 预算配置管理相关条件 ====================

    // 预算配置 - 公司
    "quotation-assignConfig-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 预算配置 - 启用状态
    "quotation-assignConfig-enabled": {
        label: "启用状态",
        type: "select",
        submitConfig: {
            name: "enabled",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "",
                value: "全部"
            }, {
                key: "1",
                value: "已启用"
            }, {
                key: "0",
                value: "已禁用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 预算配置 - 分配方式
    "quotation-assignConfig-autoAssign": {
        label: "分配方式",
        type: "select",
        submitConfig: {
            name: "autoAssign",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "",
                value: "全部"
            }, {
                key: "1",
                value: "自动分配"
            }, {
                key: "0",
                value: "手动分配"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // ==================== 预算员规则管理相关条件 ====================

    // 预算员规则 - 状态
    "quotation-assignUserRule-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "",
                value: "全部"
            }, {
                key: "1",
                value: "可用"
            }, {
                key: "2",
                value: "制作中"
            }, {
                key: "3",
                value: "已停用"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 预算员规则 - 用户姓名
    "quotation-assignUserRule-userName": {
        label: "用户姓名",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "like",
            validate: null
        }
    },

    // ==================== 预算员分配配置相关条件 ====================

    // 预算配置 - 公司
    "assign-config-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 预算配置 - 启用状态
    "assign-config-enabled": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "enabled",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.quotation().quotationAssignConfig.enabled.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    // ==================== 预算员规则管理相关条件 ====================

    // 预算员规则 - 公司
    "assign-user-rule-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 预算员规则 - 状态
    "assign-user-rule-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.quotation().quotationAssignUserRule.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 预算员规则 - 用户姓名
    "assign-user-rule-userName": {
        label: "预算员",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "like",
            validate: null
        }
    },

    // ==================== 预算员规则明细（Item）管理相关条件 ====================

    // 规则明细 - 公司
    "assign-user-rule-item-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 规则明细 - 支持类型
    "assign-user-rule-item-supportedType": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "supportedType",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.quotation().quotationAssignUserRule.supportedType.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 规则明细 - 预算员姓名
    "assign-user-rule-item-userName": {
        label: "预算员",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "like",
            validate: null
        }
    },

    // ==================== 分配请求管理相关条件 ====================

    // 分配请求 - 公司
    "assign-request-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 分配请求 - 状态
    "assign-request-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                key: "",
                value: "全部"
            }, {
                key: "1",
                value: "待分配"
            }, {
                key: "2",
                value: "已分配"
            }, {
                key: "3",
                value: "已完成"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    // 分配请求 - 装修单号
    "assign-request-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "like",
            validate: null
        }
    },

    // 分配请求 - 预算员
    "assign-request-user": {
        label: "预算员",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "cn",
            validate: null
        }
    },

    // 分配请求 - 请求人
    "assign-request-requestUser": {
        label: "请求人",
        type: "text",
        submitConfig: {
            name: "requestUserName",
            op: "cn",
            validate: null
        }
    },

    // 分配请求 - 分配时间
    "assign-request-assignTime": {
        label: "分配时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "assignTime",
            op: "cn",
            validate: null
        }
    },

    // 分配请求 - 请求时间
    "assign-request-requestTime": {
        label: "请求时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "requestTime",
            op: "cn",
            validate: null
        }
    },

    // 分配请求 - 完成时间
    "assign-request-finishTime": {
        label: "完成时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "cn",
            validate: null
        }
    },

    // 分配请求(设计) - 设计师
    "assign-request-user-designer": {
        label: "设计师",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "cn",
            validate: null
        }
    },

    // ==================== 分配记录管理相关条件 ====================

    // 分配记录 - 公司
    "assign-record-company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
            op: "eq",
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    // 分配记录 - 预算员
    "assign-record-user": {
        label: "预算员",
        type: "text",
        submitConfig: {
            name: "budgetUserName",
            op: "like",
            validate: null
        }
    },

    // 分配记录 - 装修单号
    "assign-record-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "like",
            validate: null
        }
    },

});