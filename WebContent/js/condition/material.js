Condition.addupRule("material", {

    orderId: {
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
            name: "villageId",
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
    "category-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "category": {
        label: "品类",
        type: "select",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "brand-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "brand",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.data.queryBrandByPinyin,// 获取数据要调用的接口
            query: "brand.pinyin",
            postData: {},// 获取数据时的请求参数
            listPath: "brands",// 响应list的json路径
            keyPath: "name",// 用来向后台提交的字段的json路径
            valuePath: "name"// 用来在页面显示的字段的json路径
        }
    },
    "no": {
        label: "主材号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "designer": {
        label: "设计师",// 中文名
        type: "autofill",// 类型
        submitConfig: {// 向后台提交的配置
            name: "designerName",// 接口中的参数名
            op: "cn",// 查询方式
            validate: null
        // 校验规则
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,// 获取数据要调用的接口
            postData: {
                "user.status": 0,
                "departmentType.name": ""
            },// 获取数据时的请求参数
            listPath: "autoFillKeyValue",// 响应list的json路径
            keyPath: "key",// 用来向后台提交的字段的json路径
            valuePath: "value"// 用来在页面显示的字段的json路径
        }
    },
    "salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "salesmanId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,// 获取数据要调用的接口
            postData: {
                "user.status": "",
                "departmentType.name": ""
            },// 获取数据时的请求参数
            listPath: "autoFillKeyValue",// 响应list的json路径
            keyPath: "key",// 用来向后台提交的字段的json路径
            valuePath: "value"// 用来在页面显示的字段的json路径
        }
    },
    "fullpayTime": {
        label: "收款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "fullCollectTimeRange",
            op: "between",
            validate: null
        }
    },
    "region-name": {
        label: "大区名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "dept-name": {
        label: "归属部门",
        type: "text",
        submitConfig: {
            name: "departmentName",
            op: "cn",
            validate: null
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
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.material,
            postData: {},
            listPath: "balanceStatus",
            keyPath: "key",
            valuePath: "value"
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
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.material,
            postData: {},
            listPath: "balanceType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "prebalanceTime": {
        label: "预结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "preBalanceTimeRange",
            op: "between",
            validate: null
        }
    },
    "vbalanceTime": {
        label: "厂商结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "vbalanceTimeRange",
            op: "between",
            validate: null
        }
    },
    "postBalanceTime": {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "postBalanceTimeRange",
            op: "between",
            validate: null
        }
    },

});