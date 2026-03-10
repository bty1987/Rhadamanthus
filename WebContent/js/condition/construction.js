Condition.addupRule("construction", {

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
    "village-name": {
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
    "houseNumber-name": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "houseNumber",
            op: "cn",
            validate: null
        }
    },
    "designer": {
        label: "设计师",// 中文名
        type: "autofill",// 类型
        submitConfig: {// 向后台提交的配置
            name: "designer",// 接口中的参数名
            op: "eq",// 查询方式
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
    "schedule": {
        label: "进度",
        type: "select",
        submitConfig: {
            name: "construction.schedule",
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
    "process": {
        label: "进度",
        type: "select",
        submitConfig: {
            name: "construction.process",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.construction().construction.process.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "projectStatusFlag": {
        label: "完工状态",
        type: "select",
        submitConfig: {
            name: "projectStatus",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: [{
                key: "未完工",
                value: "未完工"
            }, {
                key: "已完工",
                value: "已完工"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "supervisor": {
        label: "监理",// 中文名
        type: "autofill",// 类型
        submitConfig: {// 向后台提交的配置
            name: "construction.supervisor",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
        // 校验规则
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,// 获取数据要调用的接口
            postData: {
                "user.status": 3,
                "departmentType.name": "工程部"
            },// 获取数据时的请求参数
            listPath: "autoFillKeyValue",// 响应list的json路径
            keyPath: "key",// 用来向后台提交的字段的json路径
            valuePath: "value"// 用来在页面显示的字段的json路径
        }
    },
    "acceptanceFlag": {
        label: "验收状态",
        type: "select",
        submitConfig: {
            name: "acceptanceFlag",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: [{
                key: "notAcceptanced",
                value: "未验收"
            }, {
                key: "acceptanced",
                value: "已验收"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "createTime": {
        label: "开工时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "construction.createTime",
            op: "between",
            validate: null
        }
    },
    "startTime": {
        label: "开工时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "construction.startTime",
            op: "between",
            validate: null
        }
    },
    "endTime": {
        label: "完工时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "construction.endTime",
            op: "between",
            validate: null
        }
    },
    "finishTime": {
        label: "验收时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "construction.finishTime",
            op: "between",
            validate: null
        }
    },
    "salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "salesman",// 接口中的参数名
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
    "schedule-decoration-design-region": {
        label: "设计中心",
        type: "autofill",
        submitConfig: {// 向后台提交的配置
            name: "designerRegionId",// 接口中的参数名
            op: "eq",// 查询方式
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.communion.queryDepartmentByName,// 获取数据要调用的接口
            query: "dept.name",
            postData: {
                "dept.type.dtid": 1
            },// 获取数据时的请求参数
            listPath: "deptList",// 响应list的json路径
            keyPath: "no",// 用来向后台提交的字段的json路径
            valuePath: "name"// 用来在页面显示的字段的json路径
        }
    },
    "schedule-decoration-design-dept": {
        label: "设计部",
        type: "autofill",
        submitConfig: {
            name: "designerDepartmentId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 2
            },// 获取数据时的请求参数
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "schedule-decoration-status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "decorationStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                "key": "0",
                "value": "初始"
            }, {
                "key": "1",
                "value": "开工"
            }, {
                "key": "2",
                "value": "完工"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "schedule-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "schedule-startTime": {
        label: "开工时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "startTime",
            op: "between",
            validate: null
        }
    },
    "schedule-endTime": {
        label: "完工时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "endTime",
            op: "between",
            validate: null
        }
    },
    "schedule-enterTime": {
        label: "进场时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "enterTime",
            op: "between",
            validate: null
        }
    },
    "schedule-leaveTime": {
        label: "离场时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "leaveTime",
            op: "between",
            validate: null
        }
    },
    "schedule-status": {
        label: "环节状态",
        type: "select",
        submitConfig: {
            name: "construction.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [{
                "key": "0",
                "value": "初始"
            }, {
                "key": "1",
                "value": "开工"
            }, {
                "key": "2",
                "value": "完工"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },

    "drawLine-actualDate": {
        label: "放线时间",
        type: "datePicker",
        submitConfig: {
            name: "actualDate",
            op: "between",
            validate: null
        }
    },
    "drawLine-applayTime": {
        label: "申请时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "applayTime",
            op: "between",
            validate: null
        }
    },

    "drawLine-status": {
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
                "key": "1",
                "value": "申请放线"
            }, {
                "key": "3",
                "value": "放线失败"
            }, {
                "key": "2",
                "value": "放线成功"
            }],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "info-isIssue": {
        label: "监理状态",
        type: "select",
        submitConfig: {
            name: "isIssue",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.construction().constructionInfo.isIssue.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "info-isCheck": {
        label: "验房",
        type: "select",
        submitConfig: {
            name: "isIssue",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.construction().constructionInfo.isCheck.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "info-keyTime": {
        label: "预交钥匙",
        type: "dateRangePicker",
        submitConfig: {
            name: "keyTime",
            op: "between",
            validate: null
        }
    },
    "info-drawlineTime": {
        label: "预计放线",
        type: "dateRangePicker",
        submitConfig: {
            name: "drawlineTime",
            op: "between",
            validate: null
        }
    },
    "info-finishTime": {
        label: "预计完工",
        type: "dateRangePicker",
        submitConfig: {
            name: "finishTime",
            op: "between",
            validate: null
        }
    },
    "info-designTime": {
        label: "预完设计",
        type: "dateRangePicker",
        submitConfig: {
            name: "designTime",
            op: "between",
            validate: null
        }
    },
    "info-sdesignTimeRange": {
        label: "合同方案确认",
        type: "dateRangePicker",
        submitConfig: {
            name: "sdesignTimeRange",
            op: "between",
            validate: null
        }
    },
    "info-edesignTimeRange": {
        label: "放线方案确认",
        type: "dateRangePicker",
        submitConfig: {
            name: "edesignTimeRange",
            op: "eq",
            validate: null
        }
    },
    "diary-isUpload": {
        label: "是否上传图片",
        type: "select",
        submitConfig: {
            name: "isUpload",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.construction().constructionDiary.isUpload.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "constructionSchedule-node-cnid": {
        label: "施工节点",
        type: "select",
        submitConfig: {
            name: "constructionSchedule.node.cnid",
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
    "constructionSchedule-status": {
        label: "计划状态",
        type: "select",
        submitConfig: {
            name: "constructionSchedule.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.construction().constructionSchedule.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
});