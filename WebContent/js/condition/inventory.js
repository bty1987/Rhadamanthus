Condition.addupRule("inventory", {
    /* -------辅料单--------- */
    "accessories-orderId": {
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
    "accessories-no": {
        label: "辅料单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "accessories-createrName": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "createrName",//后台判断匹配
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status": ""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "accessories-approverName": {
        label: "审批人",
        type: "autofill",
        submitConfig: {
            name: "approverName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status": ""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "accessories-createTime": {
        label: "创建时间",
        type: "datePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "accessories-approverTime": {
        label: "审批时间",
        type: "datePicker",
        submitConfig: {
            name: "approverTime",
            op: "between",
            validate: null
        }
    },
    "accessories-stauts": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "accessoriesStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    /* -------外辅单--------- */
    "occessories-no": {
        label: "外辅单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "occessories-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "occessoriesStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "occessories-isEnter": {
        label: "可进园区",
        type: "select",
        submitConfig: {
            name: "isEnter",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "occessoriesisEnter",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "occessories-isLift": {
        label: "有无电梯",
        type: "select",
        submitConfig: {
            name: "isLift",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "occessoriesisLift",
            keyPath: "key",
            valuePath: "value"
        }
    },

    /* ---------采购单-------- */
    "purchase-no": {
        label: "采购单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "purchase-createName": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "purchaseUserName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status": ""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "purchase-createTime": {
        label: "创建时间",
        type: "datePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "purchase-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "purchaseStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "purchaseStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "purchase-balanceStatus": {
        label: "结算状态",
        type: "select",
        submitConfig: {
            name: "purchaseBalanceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "purchaseBalanceStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    /* ---------货单---------- */
    "manifest-code": {
        label: "货单号",
        type: "text",
        submitConfig: {
            name: "code",
            op: "eq",
            validata: null
        }
    },
    "manifest-createTime": {
        label: "创建时间",
        type: "datePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validata: null
        }
    },
    "manifest-manifestTime": {
        label: "货单时间",
        type: "datePicker",
        submitConfig: {
            name: "manifestTime",
            op: "between",
            validata: null
        }
    },
    "manifest-manifestType": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "manifestType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "manifestType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "manifest-manifestStatus": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "manifestStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "manifestStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },

    /* --------------库存------------- */
    "goods-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "goods-barcode": {
        label: "条形码",
        type: "text",
        submitConfig: {
            name: "barcode",
            op: "cn",
            validate: null
        }
    },
    "storehouse-name": {
        label: "仓库名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "goods-goodsName": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goodsName",
            op: "cn",
            validate: null
        }
    },
    "brand-name": {
        label: "商品品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",
            validate: null
        }
    },

});