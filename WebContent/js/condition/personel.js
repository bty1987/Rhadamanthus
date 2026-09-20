Condition.addupRule("personel", {

    userId: {
        label: "员工号",
        type: "text",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        }
    },
    userName: {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "userName",
            op: "cn",
            validate: null
        }
    },
    roleId: {
        label: "角色",
        type: "autofill",
        submitConfig: {
            name: "roleId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryRoleByName,
            postData: {},
            listPath: "roleList",
            keyPath: "rid",
            valuePath: "name",
            query: "role.name"
        }
    },
    deptId: {
        label: "部门",
        type: "autofill",
        submitConfig: {
            name: "deptId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": "0"
            },
            listPath: "deptList",
            keyPath: "did",
            valuePath: "name"
        }
    },
    userstatus: {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            listPath: constant.personel().user.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    name: {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    identity: {
        label: "身份证号",
        type: "text",
        submitConfig: {
            name: "identity",
            op: "eq",
            validate: null
        }
    },
    phone: {
        label: "手机号",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "cn",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },

    "recruitment-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            listPath: constant.personel().recruitment.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "info-level": {
        label: "职级",
        type: "select",
        submitConfig: {
            name: "level",
            op: "eq",
            validate: null
        },
        dataSource: {
            listPath: constant.personel().userInfo.level.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "duty-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "region-name": {
        label: "大区名称",
        type: "text",
        submitConfig: {
            name: "deptName",
            op: "cn",
            validate: null
        }
    },

    "dept": {
        label: "名称",
        type: "autofill",
        submitConfig: {
            name: "deptName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {
                "dept.type.dtid": ""
            },
            listPath: "deptList",
            keyPath: "did",
            valuePath: "name"
        }
    },
    "dept-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "dept-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "deptType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentType,
            postData: {},
            listPath: "departmentTypes",
            keyPath: "dtid",
            valuePath: "name"
        }
    },
    "dept-isdet": {
        label: "定岗",
        type: "select",
        submitConfig: {
            name: "isdet",
            op: "eq",
            validate: null
        },
        dataSource: {
            listPath: constant.personel().dept.isdet.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },
    "dept-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            listPath: constant.personel().dept.status.datas,
            keyPath: "key",
            valuePath: "value"
        }
    },

    "performance-type": {
        label: "绩效类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.personel,
            postData: {},
            listPath: "perType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "performance-startTime": {
        label: "开始时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "performancestartTime",
            op: "cn",
            validate: null
        }
    },
    "performance-endTime": {
        label: "结束时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "performanceendTime",
            op: "cn",
            validate: null
        }
    },

    "label-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },

    "recruitment-name": {
        label: "姓名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "recruitment-phone": {
        label: "电话",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: null
        }
    },
    "recruitment-identity": {
        label: "身份证号",
        type: "text",
        submitConfig: {
            name: "identity",
            op: "eq",
            validate: null
        }
    },
});