
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
        dataSource: {//从后台取数据的各种配置
            url: api.system.queryRoleByName,
            postData: {},
            listPath: "roleList",
            keyPath: "rid",
            valuePath: "name",
            query:"role.name"// 请求参数
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
        dataSource: {//从后台取数据的各种配置
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {"dept.type.dtid": ""},//获取数据时的请求参数
            listPath: "deptList",//响应list的json路径
            keyPath: "did",//用来向后台提交的字段的json路径
            valuePath: "name"//用来在页面显示的字段的json路径
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
        dataSource: {//从后台取数据的各种配置
            url: api.ds.personel,
            postData: {},
            listPath: "statusType",
            keyPath: "key",
            valuePath:"value"
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
    phone: { //
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
    
    "duty-name": {
        label: "职位名称",
        type: "autofill",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryDutyByName,
            postData: {"duty.status":"", "duty.departmentType.dtid": ""},//获取数据时的请求参数
            listPath: "dutys",//响应list的json路径
            keyPath: "did",//用来向后台提交的字段的json路径
            valuePath: "name"//用来在页面显示的字段的json路径
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
    
    "dept-name": {
        label: "部门名称",
        type: "autofill",
        submitConfig: {
            name: "deptName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.communion.queryDepartmentByName,
            query: "dept.name",
            postData: {"dept.type.dtid": ""},//获取数据时的请求参数
            listPath: "deptList",//响应list的json路径
            keyPath: "did",//用来向后台提交的字段的json路径
            valuePath: "name"//用来在页面显示的字段的json路径
        }
    },
    
    "dept-type": {
        label: "部门类型",
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
    
    "dept-isdet" :{
        label: "是否定岗",
        type: "select",
        submitConfig: {
            name: "isdet",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.department,
            postData: {},
            listPath: "deptIsdet",
            keyPath: "key",
            valuePath:"value"
        }
    }, 	
   
    "dept-status" :{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.department,
            postData: {},
            listPath: "deptStatus",
            keyPath: "key",
            valuePath:"value"
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
        dataSource: {//从后台取数据的各种配置
            url: api.ds.personel,
            postData: {},
            listPath: "perType",
            keyPath: "key",
            valuePath:"value"
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
        label:"名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    
});