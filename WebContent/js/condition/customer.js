
Condition.addupRule("customer", {
    
    "no": {
        label: "客户编号",
        type: "text",
        submitConfig: {
            name: "customerId",
            op: "cn",
            validate: null
        }
    },
    "phone": {
        label: "客户电话",
        type: "text",
        submitConfig: {
            name: "customerPhone",
            op: "eq",
            validate: {
                "reg": /^[A-Z0-9]*$/,
                "msg": "格式不正确A-Z,0-9"
            }
        }
    },
    "relationship": {
        label: "关系客户",
        type: "select",
        submitConfig: {
            name: "relationshipType",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.data,
            postData: {},
            listPath: "relationshipType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "service-orderId": {
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
    "service-creater-name": {
        label: "创建人",
        type: "autofill",
        submitConfig: {
            name: "creater",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"0" },
            listPath: "userBases",
            keyPath: "userId",
            valuePath: "currentName"
        }
    },
    "service-updater-name": {
        label: "操作人",
        type: "autofill",
        submitConfig: {
            name: "updater",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":"" },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-aepair-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.customer,
            postData: {},
            listPath: "aepair_status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-complain-status": {
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
            listPath: [
                {"key":"0","value":"初始"},
                {"key":"1","value":"处理"},
                {"key":"2","value":"完结"},
                {"key":"3","value":"关闭"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "service-complain-level": {
        label: "等级",
        type: "select",
        submitConfig: {
            name: "level",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key":"0","value":"普通"},
                {"key":"1","value":"重大"},
                {"key":"2","value":"危机"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "customerSource-phone" :{
        label: "客源电话",
        type: "text",
        submitConfig: {
            name: "customerSourcePhone",
            op: "eq",
            validate: {
                "reg": /^[0-9]*$/,
                "msg": "电话格式不正确"
            }
        }
    },
    
    "v-name" : {
        label:"客户名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    "v-type": {
        label: "回访类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: null,
            postData: null,
            listPath: [
                {"key":"0","value":"保修"},
                {"key":"1","value":"投诉"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "feedback-createTime": {
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    
    "member-no": {
        label: "会员编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate:null,
        }
    },

    "member-phone" :{
        label: "手机号",
        type: "text",
        submitConfig: {
            name: "phone",
            op: "eq",
            validate: {
                "reg": /^[0-9]*$/,
                "msg": "请输入数字"
            }
        }
    },
    
    "vscoreRecord-type" : {
        label:"积分类型",
        type:"select",
        submitConfig : {
            name : "VscoreRecordType",
            op : "eq",
            validate:null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "vscoreRecordtype",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "group-name" : {
        label:"名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    "group-orderId" : {
        label:"装修单号",
        type:"text",
        submitConfig : {
            name : "orderId",
            op : "eq",
            validate:null
        }
    },
    
});