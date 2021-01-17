
Condition.addupRule("decoration", {
    
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
    "houseNumber": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "houseNumber",
            op: "cn",
            validate: null
        }
    },
    "houseArea": {
        label: "面积",
        type: "text",
        submitConfig: {
            name: "houseArea",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
    "designer": {
        label: "设计师",
        type: "autofill",
        submitConfig: {
            name: "designerId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "salesmanId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "quoter": {
        label: "报价员",
        type: "autofill",
        submitConfig: {
            name: "quoterId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "escorter": {
        label: "跟单员",
        type: "autofill",
        submitConfig: {
            name: "escorterId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "supervisor": {
        label: "监理",
        type: "autofill",
        submitConfig: {
            name: "supervisor",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":"工程部"},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "auditor": {
        label: "审核人",
        type: "autofill",
        submitConfig: {
            name: "auditer",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":3,"departmentType.name":"职能部"},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "type": {
        label: "订单类型",
        type: "select",
        submitConfig: {
            name: "orderType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "typeness",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salesType": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "salesmanType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "salesmanType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "houseClass": {
        label: "房屋类型",
        type: "select",
        submitConfig: {
            name: "houseClass",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "houseClass",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "design-region": {
        label: "设计中心",
        type: "autofill",
        submitConfig: {
            name: "designerRegionId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {"dept.type.dtid": 1},
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "design-dept": {
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
            postData: {"dept.type.dtid": 2},
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "sales-region": {
        label: "业务中心",
        type: "autofill",
        submitConfig: {
            name: "salesmanRegionId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {"dept.type.dtid": 3},
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "sales-dept": {
        label: "业务部",
        type: "autofill",
        submitConfig: {
            name: "salesmanDepartmentId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {"dept.type.dtid": 0},
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "measureTime": {
        label: "量尺时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "measureTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "depositTime" : {
        label:"定金时间",
        type:"dateRangePicker",
        submitConfig : {
            name : "depositTimeDateRange",
            op : "cn",
            validate:null
        }
    },
    "precontractTime" : {
        label:"预签时间",
        type:"dateRangePicker",
        submitConfig : {
            name : "precontractTime",
            op : "cn",
            validate:null
        }
    },
    "sdesignTime": {
        label: "合同确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sdesignTime",
            op: "between",
            validate: null
        }
    },
    "edesignTime": {
        label: "放线确认时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "edesignTime",
            op: "between",
            validate: null
        }
    },
    "designTime": {
        label: "设计时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "designTimeRange",
            op: "between",
            validate: null
        }
    },
    "signTime": {
        label: "签单时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "signTimeDateRange",
            op: "cn",
            validate: null
        }
    },
    "accountTime": {
        label: "决算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "accountTime",
            op: "cn",
            validate: null
        }
    },
    "auditTime": {
        label: "审核时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "auditTime",
            op: "cn",
            validate: null
        }
    },
    "status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "decorationOrderStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "designStatus": {
        label: "设计状态",
        type: "select",
        submitConfig: {
            name: "designStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "designStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "sourceStatus": {
        label: "确认状态",
        type: "select",
        submitConfig: {
            name: "sourceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "sourceStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "projectStatus": {
        label: "工程状态",
        type: "selectCaching",
        submitConfig: {
            name: "projectStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryConstructionNode,
            postData: {},
            listPath: "constructionNodes",
            keyPath: "sort",
            valuePath: "name",
            appresult: [
                {"sort": 0, "name": "初始"},
                {"sort": 1, "name": "开工"},
                {"sort": 2, "name": "完工"}
            ]
        }
    },
    "auditStatus": {
        label: "审核状态",
        type: "select",
        submitConfig: {
            name: "auditStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "auditStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customerPhone": {
        label: "客户电话",
        type: "text",
        submitConfig: {
            name: "customerPhone",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            },
            alone: true
        }
    },
    "company": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "company",
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
    "repairStatus": {
        label: "保修状态",
        type: "select",
        submitConfig: {
            name: "repairStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.decoration,
            postData: {"timestamp": new Date().getTime()},
            listPath: "repairStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
});