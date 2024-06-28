Condition.addupRule("sales", {

    "orderId": {
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
    "no": {
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
    "village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "sales.village.no",
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
    "category-name": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validate: null
        },
    },
    "brand-name": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validate: null
        },
    },
    "brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "sales.brand.bid",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            query: "brand.pinyin",
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name"
        }
    },
    "brand-all": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyinForAll,
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name"
        }
    },
    "status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "sales.status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().sales.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "fullpayStatus": {
        label: "补款状态",
        type: "select",
        submitConfig: {
            name: "sales.fullpayStatus",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().sales.fullpayStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "instorer": {
        label: "驻店员",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "sales.instorer.userId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
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
    "designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "sales.salesman.userId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
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
        label: "渠道",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "sales.salesman.userId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
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
    "guider": {
        label: "导购",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "sales.guider.userId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
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
    "region-name": {
        label: "大区名称",
        type: "text",
        submitConfig: {
            name: "region.name",
            op: "cn",
            validata: null
        }
    },
    "dept-name": {
        label: "归属部门",
        type: "text",
        submitConfig: {
            name: "dept.name",
            op: "cn",
            validata: null
        }
    },
    "dept": {
        label: "部门",
        type: "selectCaching",
        submitConfig: {
            name: "sales.department.name",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.communion.queryDepartment,
            postData: {},
            listPath: "deptList",
            keyPath: "name",
            valuePath: "name"
        }
    },
    "fullpayTime": {
        label: "补款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.fullpayTime.range",
            op: "between",
            validate: null
        }
    },
    "affirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.affirmTime.range",
            op: "between",
            validate: null
        }
    },
    "isAffirm": {
        label: "确认状态",
        type: "select",
        submitConfig: {
            name: "sales.isAffirm",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().sales.isAffirm.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "dompany1": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "sales.dompany",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryCompany,
            postData: {},
            listPath: "companys",
            keyPath: "cid",
            valuePath: "name"
        }
    },

    "activity-name": {
        label: "活动名称", // 中文名
        type: "text", // 类型
        submitConfig: { // 向后台提交的配置
            name: "sales.activity.name", // 接口中的参数名
            op: "cn", // 查询方式
            validate: null
        // 校验规则
        }
    },
    "activity-category-name": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validate: null
        },
    },
    "activity-brand-name": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validate: null
        },
    },

    "balance-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "balance-no": {
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "balance-category-name": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validate: null
        },
    },
    "balance-brand-name": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validate: null
        },
    },
    "balance-brand": {
        label: "品牌",// 中文名
        type: "autofill",// 类型
        submitConfig: {// 向后台提交的配置
            name: "sales.brand",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
        // 校验规则
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
    "balance-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.sales,
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
            url: api.ds.sales,
            postData: {},
            listPath: "balanceType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-deliverStatus": {
        label: "配送状态",
        type: "select",
        submitConfig: {
            name: "deliverStatus",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().salesBalance.deliverStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-verifyStatus": {
        label: "审核状态",
        type: "select",
        submitConfig: {
            name: "verifyStatus",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().salesBalance.verifyStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-confirmStatus": {
        label: "确认状态",
        type: "select",
        submitConfig: {
            name: "confirmStatus",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().salesBalance.confirmStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-fullpayTime": {
        label: "补款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.fullpayTime",
            op: "between",
            validate: null
        }
    },
    "balance-createTime": {
        label: "预结时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "balance-venderTime": {
        label: "厂结时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "venderTime",
            op: "between",
            validate: null
        }
    },
    "balance-postTime": {
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "postTime",
            op: "between",
            validate: null
        }
    },
    "balance-grade": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "sales.grade",
            op: "cn",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.ds.sales,
            postData: {},
            listPath: "balanceGrade",
            keyPath: "key",
            valuePath: "value"
        }
    },

    "sale-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.createTime.range",
            op: "between",
            validate: null
        }
    },
    "salesDelivery-no": {
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "salesDelivery-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "salesDelivery-category": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-brand": {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-goods": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validata: null
        }
    },
    "salesDelivery-tranTime": {
        label: "配送时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "tranTime",
            op: "between",
            validata: null
        }
    },
    "salesDelivery-checkTime": {
        label: "审核时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "checkTime",
            op: "between",
            validata: null
        }
    },
    "salesDelivery-confirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "confirmTime",
            op: "between",
            validata: null
        }
    },
    "salesDelivery-finishTime": {
        label: "完结时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "between",
            validata: null
        }
    },
    "salesDelivery-traner": {
        label: "配送人",
        type: "autofill",
        submitConfig: {
            name: "traner",
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
    "salesDelivery-creater": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "creater",
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
    "salesDelivery-checker": {
        label: "审核人",
        type: "autofill",
        submitConfig: {
            name: "checker",
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
    "salesDelivery-confirmer": {
        label: "确认人",
        type: "autofill",
        submitConfig: {
            name: "confirmer",
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
    "salesDelivery-finisher": {
        label: "完结人",
        type: "autofill",
        submitConfig: {
            name: "finisher",
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
    "salesDelivery-status": {
        label: "配送状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: {},
            listPath: constant.sales().salesDeliveryItem.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salesActivity-no": {
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "salesActivity-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "salesActivity-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.createTime",
            op: "between",
            validata: null
        }
    },

    "refunds-status": {
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
            listPath: constant.sales().refunds.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "oales-no": {
        label: "外销单号",
        type: "text",
        submitConfig: {
            name: "oales.no",
            op: "eq",
            validate: null
        }
    },
    "oales-orderId": {
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
    "oales-dept": {
        label: "部门",
        type: "autofill",
        submitConfig: {
            name: "oales.dept.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 2
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "oales-region": {
        label: "分区",
        type: "autofill",
        submitConfig: {
            name: "oales.region.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 1
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "oales-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "oales.createTime",
            op: "cn",
            validata: null
        }
    },
    "oales-confirmTime": {
        label: "确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "oales.confirmTime",
            op: "cn",
            validata: null
        }
    },
    "oales-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "oales.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: {},
            listPath: constant.sales().oales.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "oales-brand": {
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "oales.brand.bid",
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
    "oales-category": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "oales.category",
            op: "eq",
            validata: null
        }
    },
    "oalesPay-payTime": {
        label: "付款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "payTime",
            op: "cn",
            validata: null
        }
    },
});