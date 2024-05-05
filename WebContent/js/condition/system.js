Condition.addupRule("system", {

    "company-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "company-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.system,
            postData: {},
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "company-atttype": {
        label: "业务类型",
        type: "select",
        submitConfig: {
            name: "atttype",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.system,
            postData: {},
            listPath: "atttype",
            keyPath: "key",
            valuePath: "value"
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
    "region": {
        label: "所属大区",
        type: "select",
        submitConfig: {
            name: "regionId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryRegion,
            postData: {},
            listPath: "regions",
            keyPath: "rid",
            valuePath: "name"
        }
    },
    "city-name": {
        label: "城市名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "city": {
        label: "所属城市",
        type: "select",
        submitConfig: {
            name: "cityId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.system.queryCity,
            postData: {},
            listPath: "citys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "cityProper-name": {
        label: "城区名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "role-no": {
        label: "角色编号",
        type: "text",
        submitConfig: {
            name: "roleNo",// 字段
            op: "eq",// 查询方式
            validate: null
        }
    },
    "role-name": {
        label: "角色名称",
        type: "autofill",
        submitConfig: {
            name: "roleId",// 字段
            op: "eq",// 查询方式
            validate: null
        },
        dataSource: {
            url: api.system.queryRoleByName,// 请求接口
            postData: {},// 获取数据时的请求参数
            listPath: "roleList",// 返回值
            keyPath: "rid",// 元素的key值
            valuePath: "name",// 元素的value值
            query: "role.name"// 请求参数
        }
    },
    "config": {
        label: "关键字",
        type: "text",
        submitConfig: {
            name: "key",
            op: "cn",
            validate: null
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
    "upgrade-version": {
        label: "适用版本",
        type: "text",
        submitConfig: {
            name: "trialVersion",
            op: "eq",
            validate: null
        }
    },
    "upgrade-createTime": {
        label: "创建时间",
        type: "text",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "organization-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },

    "operation-name": {
        label: "操作说明",
        type: "text",
        submitConfig: {
            name: "operationName",
            op: "cn",
            validate: null
        }
    },
    "operation-operation": {
        label: "操作",
        type: "text",
        submitConfig: {
            name: "operation",
            op: "cn",
            validate: null
        }
    },
    "operation-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "operationType",// 字段
            op: "eq",// 查询方式
            validate: null
        },
        dataSource: {
            url: api.ds.system,// 请求接口
            postData: {},// 获取数据时的请求参数
            listPath: "operationType",
            keyPath: "key",// 元素的key值
            valuePath: "value",// 元素的value值
        }
    },
    "module-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "module-level": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "level",// 字段
            op: "eq",// 查询方式
            validate: null
        },
        dataSource: {
            url: api.ds.system,// 请求接口
            postData: {},// 获取数据时的请求参数
            listPath: "level",
            keyPath: "key",// 元素的key值
            valuePath: "value",// 元素的value值
        }
    },
});