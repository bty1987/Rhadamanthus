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
            name: "createrName",// 后台判断匹配
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
            postData: {
                "user.status": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "accessories-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "cn",
            validate: null
        }
    },
    "accessories-deliveTime": {
        label: "送货时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "deliveTime",
            op: "cn",
            validate: null
        }
    },
    "accessories-receiveTime": {
        label: "到货时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "receiveTime",
            op: "cn",
            validate: null
        }
    },
    "accessories-balanceTime": {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "balanceTime",
            op: "cn",
            validate: null
        }
    },
    "accessories-approverTime": {
        label: "审批时间",
        type: "dateRangePicker",
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
    "accessories-assignFlag": {
        label: "分配状态",
        type: "select",
        submitConfig: {
            name: "assignFlag",
            op: "eq",
            validate: null
        },
        dataSource: {
            // 字面量选项: 规避条件装载期常量组依赖(condition-loadtime-constant-ref教训)
            listPath: [{key: "0", value: "未标记"}, {key: "1", value: "需分配"}, {key: "2", value: "已分配"}],
            postData: {},
            keyPath: "key",
            valuePath: "value"
        }
    },
    "accessories-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.manifest,
            postData: {},
            listPath: "accessoriesType",
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
    "occessories-supplier": {
        label: "厂商",
        type: "autofill",
        submitConfig: {
            name: "supplier",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.querySupplierByPinyin,
            postData: {
                "user.status": 0
            },
            listPath: "suppliers",
            keyPath: "uid",
            valuePath: "userName",
            query: "supplier.pinYin"
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
            postData: {
                "user.status": ""
            },
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
    "goods-status": {
        label: "商品状态",
        type: "select",
        submitConfig: {
            name: "goods.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.data().common.status.datas,
            keyPath: "key",
            valuePath: "value"
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
    "storehouse-status": {
        label: "仓库状态",
        type: "select",
        submitConfig: {
            name: "storehouse.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.inventory().storehouse.status.datas,
            keyPath: "key",
            valuePath: "value"
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