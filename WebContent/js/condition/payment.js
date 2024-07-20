
Condition.addupRule("payment", {

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
    "village": {
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
    "houseNumber": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "houseNumber",
            op: "cn",
            validate: null
        }
    },
    "designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designer",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":0, "departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "collectTime": {
        label: "收款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "collectTime",
            op: "between",
            validate: null
        }
    },
    "confirmTime":{
        label:"确认时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"confirmTime",
            op:"between",
            validate:null
        }
    },
    "material-no": {
        label: "主材号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "sales-no":{
        label:"销售单号",
        type:"text",
        submitConfig : {
            name : "no",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "paymentType" : {
        label: "款项类型",
        type: "select",
        submitConfig: {
            name: "paymentType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.payment().receipt.paymentType.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType" : {
        label:"收据类型",
        type: "select",
        submitConfig: {
            name: "receiptType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.payment().receiptType.receiptType.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "activity-no": {
        label: "会员号",
        type: "text",
        submitConfig: {
            name: "mno",
            op: "eq",
            validate:null
        }
    },
    "activity-category": {
        label: "品类",
        type: "autofill",
        submitConfig: {
            name: "category",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "name",
            valuePath: "name"
        }
    },
    "activity-brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "brand",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            query: "brand.pinyin",
            postData: {},
            listPath: "brands",
            keyPath: "name",
            valuePath: "name"
        }
    },
    "activity-creater-name": {
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
    "point-sn": {
        label: "机器编号",
        type: "text",
        submitConfig: {
            name: "sn",
            op: "eq",
            validate: null
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
    "point-status" : {
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
            listPath: constant.payment().paytran.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "wallet-belonger-name": {
        label: "归属人",
        type: "autofill",
        submitConfig: {
            name: "belonger",
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
    "kingdee-orderId": {
        label: "单号",
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
    "name": {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "phone": {
        label: "手机号",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: null
        }
    },
    "isexpire" : {
        label: "过期标识",
        type: "select",
        submitConfig: {
            name: "isexpire",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.payment().proxyPayment.isexpire.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "statement-custNo": {
        label: "商户号",
        type: "text",
        submitConfig: {
            name: "custNo",
            op: "eq",
            validate: null
        }
    },
    "statement-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.payment().statement.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "statement-status": {
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
            listPath: constant.payment().statement.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "statement-payTime": {
        label: "付款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "payTime",
            op: "between",
            validate: null
        }
    },
    "paymentActivity-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.payment().receipt.paymentType.datas,
            keyPath: "key",
            valuePath: "value"
        }
    }
});