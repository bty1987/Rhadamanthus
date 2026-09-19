Condition.addupRule("balance", {

    "account-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "account-type": {
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
            listPath: constant.balance().balanceAccount.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "account-status": {
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
    "account-utype": {
        label: "主体类型",
        type: "select",
        submitConfig: {
            name: "belongerType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.balance().balanceAccount.utype ? constant.balance().balanceAccount.utype.datas : [{
                key: "0",
                value: "员工"
            }, {
                key: "1",
                value: "厂商"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "dccount-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "dccount-status": {
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

    "cutpay-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "cutpay-operater": {
        label: "操作人",
        type: "autofill",
        submitConfig: {
            name: "operaterId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": "0"
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "balance-no": {
        label: "结算单号",
        type: "text",
        submitConfig: {
            name: "balance.no",
            op: "cn",
            validate: null
        }
    },
    "balance-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "balance.type",
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
            name: "balance.status",
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
            name: "balance.isPay",
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

    "sales-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "sales-brand": {
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
    "sales-grade": {
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
    "sales-status": {
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
    "sales-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeRange",
            op: "cn",
            validate: null
        }
    },
    "sales-creater": {
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
    "sales-lockTime": {
        label: "锁定时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "lockTimeRange",
            op: "cn",
            validate: null
        }
    },
    "sales-balanceTime": {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "balanceTimeRange",
            op: "cn",
            validate: null
        }
    },
    "sales-salesBalance-status": {
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
    "salesBalance-sales-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },

    "selection-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "selection-brand": {
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
    "selection-grade": {
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
    "selection-status": {
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
    "selection-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeRange",
            op: "cn",
            validate: null
        }
    },
    "selection-creater": {
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
    "selection-lockTime": {
        label: "锁定时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "lockTimeRange",
            op: "cn",
            validate: null
        }
    },
    "selection-balanceTime": {
        label: "审核时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "balanceTimeRange",
            op: "cn",
            validate: null
        }
    },
    "selection-brand": {
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
    "selection-status": {
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

    "oales-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null,
        }
    },
    "oales-grade": {
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
            listPath: constant.balance().balanceOales.grade.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "oales-status": {
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
            listPath: constant.balance().balanceOales.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "oales-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeRange",
            op: "cn",
            validate: null
        }
    },
    "oales-creater": {
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
    "oales-lockTime": {
        label: "锁定时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "lockTimeRange",
            op: "cn",
            validate: null
        }
    },

});