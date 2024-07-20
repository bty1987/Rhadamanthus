Condition.addupRule("decoration", {

    "orderId": {
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
    "village": {
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "decoration.village.no",
            op: "eq ",
            validate: null
        },
        dataSource: {
            url: api.data.queryVillageForNameByPinyin,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        },
        detail: {
            url: api.index.village4condition.url,
            content: "layerPopUp",
            key: "no",
            value: "name"
        }
    },
    "houseNumber": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "decoration.house.houseNumber",
            op: "cn",
            validate: null
        }
    },
    "houseArea": {
        label: "面积",
        type: "text",
        submitConfig: {
            name: "decoration.houseArea",
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
            name: "decoration.designer.userId",
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
        },
        detail: {
            url: api.index.user4condition.url,
            content: "layerPopUp",
            key: "userId",
            value: "currentName"
        }
    },
    "salesman": {
        label: "业务员",
        type: "autofill",
        submitConfig: {
            name: "decoration.salesman.userId",
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
        },
        detail: {
            url: api.index.user4condition.url,
            content: "layerPopUp",
            key: "userId",
            value: "currentName"
        }
    },
    "quoter": {
        label: "报价员",
        type: "autofill",
        submitConfig: {
            name: "decoration.quoter.userId",
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
    "escorter": {
        label: "跟单员",
        type: "autofill",
        submitConfig: {
            name: "decoration.escorter.userId",
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
    "supervisor": {
        label: "监理",
        type: "autofill",
        submitConfig: {
            name: "decoration.supervisor.userId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3,
                "departmentType.name": "工程部"
            },
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
            postData: {
                "user.status": 3,
                "departmentType.name": "职能部"
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "type": {
        label: "订单类型",
        type: "select",
        submitConfig: {
            name: "decoration.orderType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryDecorationAtttype,
            postData: {},
            listPath: "decorationAtttypes",
            keyPath: "key",
            valuePath: "name"
        }
    },
    "salesType": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "decoration.busitype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryDecorationBusitype,
            postData: {
                "timestamp": new Date().getTime()
            },
            listPath: "decorationBusitypes",
            keyPath: "dbid",
            valuePath: "name"
        }
    },
    "houseClass": {
        label: "房屋类型",
        type: "select",
        submitConfig: {
            name: "decoration.houseClass",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.houseClass.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "design-region": {
        label: "设计中心",
        type: "autofill",
        submitConfig: {
            name: "decoration.designer.region.no",
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
        },
        detail: {
            url: api.index.department4condition.url,
            content: "layerPopUp",
            data: {
                "dept.type.dtid": 1
            },
            key: "no",
            value: "name"
        }
    },
    "design-dept": {
        label: "设计部",
        type: "autofill",
        submitConfig: {
            name: "decoration.designer.department.no",
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
    "sales-region": {
        label: "业务中心",
        type: "autofill",
        submitConfig: {
            name: "decoration.salesman.region.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 3
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "sales-dept": {
        label: "业务部",
        type: "autofill",
        submitConfig: {
            name: "decoration.salesman.department.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 0
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "cross-company-design-region": {
        label: "设计中心",
        type: "autofill",
        submitConfig: {
            name: "decoration.designer.region.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 1,
                "dept.company": 0
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "cross-company-design-dept": {
        label: "设计部",
        type: "autofill",
        submitConfig: {
            name: "decoration.designer.department.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 2,
                "dept.company": 0
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "cross-company-sales-region": {
        label: "业务中心",
        type: "autofill",
        submitConfig: {
            name: "decoration.salesman.region.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 3,
                "dept.company": 0
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "cross-company-sales-dept": {
        label: "业务部",
        type: "autofill",
        submitConfig: {
            name: "decoration.salesman.department.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": 0,
                "dept.company": 0
            },
            listPath: "deptList",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.createTime.range",
            op: "cn",
            validate: null
        }
    },
    "measureTime": {
        label: "量尺时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.measureTime.range",
            op: "cn",
            validate: null
        }
    },
    "depositTime": {
        label: "定金时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.depositTime.range",
            op: "cn",
            validate: null
        }
    },
    "precontractTime": {
        label: "预签时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.precontractTime.range",
            op: "cn",
            validate: null
        }
    },
    "sdesignTime": {
        label: "合同确认",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.sdesignTime.range",
            op: "between",
            validate: null
        }
    },
    "edesignTime": {
        label: "放线确认",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.edesignTime.range",
            op: "between",
            validate: null
        }
    },
    "designTime": {
        label: "设计时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.designTime.range",
            op: "between",
            validate: null
        }
    },
    "signTime": {
        label: "签单时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.signTime.range",
            op: "cn",
            validate: null
        }
    },
    "accountTime": {
        label: "决算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.accountTime.range",
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
    "balanceTime": {
        label: "内决时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.balanceTime.range",
            op: "cn",
            validate: null
        }
    },
    "terminalTime": {
        label: "终止时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "decoration.terminalTime.range",
            op: "cn",
            validate: null
        }
    },
    "balanceStatus": {
        label: "内决状态",
        type: "select",
        submitConfig: {
            name: "decoration.balanceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.balanceStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "status": {
        label: "订单状态",
        type: "select",
        submitConfig: {
            name: "decoration.status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "designStatus": {
        label: "设计状态",
        type: "select",
        submitConfig: {
            name: "decoration.designStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.designStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "sourceStatus": {
        label: "确认状态",
        type: "select",
        submitConfig: {
            name: "decoration.sourceStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.sourceStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "projectStatus": {
        label: "工程状态",
        type: "selectCaching",
        submitConfig: {
            name: "decoration.projectStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryConstructionNode,
            postData: {},
            listPath: "constructionNodes",
            keyPath: "cnid",
            valuePath: "name",
            appresult: [{
                "cnid": 0,
                "name": "初始"
            }, {
                "cnid": 1,
                "name": "开工"
            }, {
                "cnid": 2,
                "name": "完工"
            }]
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
            url: null,
            postData: null,
            listPath: constant.decoration().audit.auditStatus.datas,
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
            name: "decoration.company",
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
            name: "decoration.repairStatus",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: constant.decoration().decoration.repairStatus.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
});