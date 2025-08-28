Condition.addupRule("balance", {

    "balanceAccount-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "balanceAccount-status": {
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
            listPath: constant.balance().balanceAccount.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-no": {
        label: "结算单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "balance-type": {
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
            listPath: constant.balance().balance.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-status": {
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
            listPath: constant.balance().balance.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-isPay": {
        label: "付款标识",
        type: "select",
        submitConfig: {
            name: "isPay",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.isPay.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "balanceSelse-brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "brandId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            query: "brand.pinyin",
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name",
        }
    },
    "balanceSelse-grade": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "grade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.balance().balanceSales.grade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-status": {
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
            listPath: constant.balance().balanceSales.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "balanceSelse-creater": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "createrId",
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
    "balanceSelse-lockTime": {
        label: "锁定时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "lockTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "balanceDccount-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "balanceDccount-status": {
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
            listPath: constant.balance().balanceDccount.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-balance-no": {
        label: "结算单号",
        type: "text",
        submitConfig: {
            name: "balanceNo",
            op: "cn",
            validate: null
        }
    },
    "balanceSelse-balance-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "balanceType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-balance-status": {
        label: "结算状态",
        type: "select",
        submitConfig: {
            name: "balanceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-balanceSelse-status": {
        label: "结销状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.balance().balanceSales.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelse-balance-isPay": {
        label: "付款标识",
        type: "select",
        submitConfig: {
            name: "balanceIsPay",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.isPay.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelection-grade": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "grade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.balance().balanceSelection.grade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelection-balance-no": {
        label: "结算单号",
        type: "text",
        submitConfig: {
            name: "balanceNo",
            op: "cn",
            validate: null
        }
    },
    "balanceSelection-balance-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "balanceType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelection-balance-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "balanceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelection-balance-isPay": {
        label: "付款标识",
        type: "select",
        submitConfig: {
            name: "balanceIsPay",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.isPay.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceSelection-brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "brandId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            query: "brand.pinyin",
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name",
        }
    },
    "balanceSelection-status": {
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
            listPath: constant.balance().balanceSelection.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "selection-item-orderId": {
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
    
    "balanceOales-balance-no": {
        label: "结算单号",
        type: "text",
        submitConfig: {
            name: "balanceNo",
            op: "cn",
            validate: null
        }
    },
    "balanceOales-balance-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "balanceType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceOales-balance-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "balanceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balanceOales-balance-isPay": {
        label: "付款标识",
        type: "select",
        submitConfig: {
            name: "balanceIsPay",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balance.isPay.datas,
            keyPath: "key",
            valuePath: "value"
        }
    }
});