
Condition.addupRule("system", {
    
    "company-name": {
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
    "role-no":{
        label:"角色编号",
        type:"text",
        submitConfig:{
            name:"roleNo",// 字段
            op:"eq",// 查询方式
            validate:null
        }
    },
    "role-name": {
        label:"角色名称",
        type:"autofill",
        submitConfig:{
            name:"roleId",// 字段
            op:"eq",// 查询方式
            validate:null
        },
        dataSource: {
            url: api.system.queryRoleByName,// 请求接口
            postData: {},//获取数据时的请求参数
            listPath: "roleList",// 返回值
            keyPath: "rid",// 元素的key值
            valuePath: "name",// 元素的value值
            query:"role.name"// 请求参数
        }
    },
    "config": {
        label: "关键字查询",
        type: "text",
        submitConfig: {
            name: "key",
            op: "cn",
            validate: null
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
    }

});