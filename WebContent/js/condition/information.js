Condition.addupRule("information", {

    "v-activity-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "v-activity-status": {
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
    "v-prize-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "v-prize-status": {
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
    "v-ticket-no": {
        label: "活动票号",
        type: "text",
        submitConfig: {
            name: "tno",
            op: "eq",
            validate: null
        }
    },
    "v-ticket-name": {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "v-ticket-orderId": {
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
    "v-payment-no": {
        label: "会员号",
        type: "text",
        submitConfig: {
            name: "mno",
            op: "eq",
            validate: null,
        }
    },
    "v-payment-brand": {
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
    "v-payment-creater-name": {
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

    "award-no": {
        label: "物品编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "award-name": {
        label: "物品名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "awardStock-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.information().awardStock.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardStock-subtype": {
        label: "子类",
        type: "select",
        submitConfig: {
            name: "subtype",
            op: "op",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.information().awardStock.subtype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardStock-room": {
        label: "库房信息",
        type: "select",
        submitConfig: {
            name: "storeroom",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.information().awardStock.storeroom.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardStock-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.information().awardStock.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "awardRecord-orderId": {
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "orderId",
            op: "eq",
            validate: null
        }
    },
    "awardRecord-name": {
        label: "物品名称",
        type: "text",
        submitConfig: {
            name: "awardStock.name",
            op: "cn",
            validate: null
        }
    },
    "awardRecord-type": {
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
            listPath: constant.information().awardRecord.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardRecord-onetype": {
        label: "一类",
        type: "select",
        submitConfig: {
            name: "onetype",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.information().awardRecord.onetype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardRecord-subtype": {
        label: "子类",
        type: "select",
        submitConfig: {
            name: "subtype",
            op: "op",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.information().awardRecord.subtype.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardRecord-recordTime": {
        label: "记录时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "awardRecordTimeDateRange",
            op: "cn",
            validate: null
        }
    },

    "activity-name": {
        label: "名称", // 中文名
        type: "text", // 类型
        submitConfig: { // 向后台提交的配置
            name: "name", // 接口中的参数名
            op: "cn", // 查询方式
            validate: null
        // 校验规则
        }
    },
    "activity-status": {
        label: "状态", // 中文名
        type: "select", // 类型
        submitConfig: { // 向后台提交的配置
            name: "status", // 接口中的参数名
            op: "eq", // 查询方式
            validate: null
        // 校验规则
        },
        dataSource: { // 从后台取数据的各种配置
            url: null, // 获取数据要调用的接口
            postData: null, // 获取数据时的请求参数
            listPath: [{
                key: "0",
                value: "\u6709\u6548"
            }, {
                key: "1",
                value: "\u65e0\u6548"
            }], // 响应list的json路径
            keyPath: "key", // 用来向后台提交的字段的json路径
            valuePath: "value" // 用来在页面显示的字段的json路径
        }
    },
    "activity-type": {
        label: "类型", // 中文名
        type: "select", // 类型
        submitConfig: { // 向后台提交的配置
            name: "type", // 接口中的参数名
            op: "eq", // 查询方式
            validate: null
        // 校验规则
        },
        dataSource: { // 从后台取数据的各种配置
            url: null, // 获取数据要调用的接口
            postData: null, // 获取数据时的请求参数
            listPath: constant.information().activity.type.datas, // 响应list的json路径
            keyPath: "key", // 用来向后台提交的字段的json路径
            valuePath: "value" // 用来在页面显示的字段的json路径
        }
    },

    "notice-theme": {
        label: "主题", // 中文名
        type: "text", // 类型
        submitConfig: { // 向后台提交的配置
            name: "theme", // 接口中的参数名
            op: "cn", // 查询方式
            validate: null
        // 校验规则
        }
    },
    "notice-creater-name": {
        label: "发布人",
        type: "autofill",
        submitConfig: {
            name: "creater",// 后台判断匹配
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

    "notice-dateTime": {
        label: "时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "dateRange",
            op: "cn",
            validate: null
        }
    },

    "plan-task": {
        label: "任务名称",
        type: "select",
        submitConfig: {
            name: "taskName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryTask,
            postData: {
                "task.level": 0
            },
            listPath: "tasks",
            keyPath: "tid",
            valuePath: "name"
        }
    },
    "plan-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "planTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "plan-status": {
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
            listPath: constant.information().plan.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "worksheet-code": {
        label: "单号",
        type: "text",
        submitConfig: {
            name: "code",
            op: "eq",
            validate: null
        }
    },
    "worksheet-status": {
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
            listPath: constant.information().worksheet.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "worksheet-creater": {
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
                "user.status": ""
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "worksheet-handler": {
        label: "处理人",
        type: "autofill",
        submitConfig: {
            name: "handler",
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
    "award-status": {
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
            listPath: constant.information().awardPurchase.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "awardPurchase-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeAwardPurchase",
            op: "cn",
            validate: null
        }
    },
    "awardPurchase-purchaseTime": {
        label: "采购时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "purchaseTimeAwardPurchase",
            op: "cn",
            validate: null
        }
    },
    "awardPurchase-instoreTime": {
        label: "入库时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "instoreTimeAwardPurchase",
            op: "cn",
            validate: null
        }
    },
    "awardPurchase-name": {
        label: "物品名称",
        type: "text",
        submitConfig: {
            name: "awardStock.name",
            op: "cn",
            validate: null
        }
    },
    "awardPurchase-no": {
        label: "物品编号",
        type: "text",
        submitConfig: {
            name: "awardStock.no",
            op: "eq",
            validate: null
        }
    },
    "awardPurchase-activity": {
        label: "活动名称",
        type: "text",
        submitConfig: {
            name: "activity",
            op: "eq",
            validate: null
        }
    },
    "awardPurchase-dept": {
        label: "部门名称",
        type: "text",
        submitConfig: {
            name: "dept",
            op: "eq",
            validate: null
        }
    },
    "awardPurchase-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "awardStock.type",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: constant.information().awardStock.type.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

});