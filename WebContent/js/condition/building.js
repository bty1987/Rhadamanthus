
Condition.addupRule("building", {
    
    "no" : {
        label:"房产单号",
        type:"text",
        submitConfig : {
            name : "no",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "village": {
        label: "楼盘名称",
        type: "autofill",
        submitConfig: {
            name: "villageNo",
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
    "houseNumber": {
        label: "楼号",
        type: "text",
        submitConfig: {
            name: "houseNumber",
            op: "cn",
            validate: null
        }
    },
    "node-type" : {
        label: "节点类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "payType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "customer-no" : {
        label:"客源编号",
        type:"text",
        submitConfig : {
            name : "no",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "houseSource-no" : {
        label:"房源编号",
        type:"text",
        submitConfig : {
            name : "no",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "roomNum": {
        label: "户型",
        type: "select",
        submitConfig: {
            name: "roomNum",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "roomNum",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "orientation": {
        label: "房屋朝向",
        type: "select",
        submitConfig: {
            name: "orientation",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "orientation",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "waterVapour": {
        label: "水气设施",
        type: "select",
        submitConfig: {
            name: "waterVapour",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "waterVapour",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "parlourType": {
        label: "客厅类型",
        type: "select",
        submitConfig: {
            name: "parlourType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "parlourType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "heatingType": {
        label: "供暖类型",
        type: "select",
        submitConfig: {
            name: "heatingType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "heatingType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "houseType": {
        label: "房屋类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "houseType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "through": {
        label: "是否越层",
        type: "select",
        submitConfig: {
            name: "through",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "through",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "status": {
        label: "房产状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "area": {
        label: "面积",
        type: "select",
        submitConfig: {
            name: "buildingArea",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {"timestamp": new Date().getTime()},
            listPath: "area",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "unitPrice": {
        label: "单价",
        type: "select",
        submitConfig: {
            name: "unitPrice",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "unitPrice",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "totalPrice": {
        label: "总价",
        type: "select",
        submitConfig: {
            name: "totalPrice",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "totalPrice",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "custumerName": {
        label: "客户姓名",
        type: "autofill",
        submitConfig: {
            name: "custumerName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryCustomerForName,
            postData: {},
            listPath: "autoFillCustomer",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "houseSource-type": {
        label: "房源类型",
        type: "select",
        submitConfig: {
            name: "houseSourceType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "hsType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "decorateDegree": {
        label: "装修程度",
        type: "select",
        submitConfig: {
            name: "decorateDegree",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "decorateDegree",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "allowLoan": {
        label: "允许贷款",
        type: "select",
        submitConfig: {
            name: "allowLoan",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "allowLoan",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "housingGrade": {
        label: "房源等级",
        type: "select",
        submitConfig: {
            name: "housingGrade",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "grade",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "rentType": {
        label: "交租方式",
        type: "select",
        submitConfig: {
            name: "rentType",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.building,
            postData: {},
            listPath: "rentType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
});