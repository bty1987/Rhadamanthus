
Condition.addupRule("store", {
    
    "mcategory" : {
        label:"品类名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    "mbrand" : {
        label:"品牌名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    
    "mgoods-no": {
        label: "商品编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "mgoods-name": {
        label: "商品名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },

    "mgoods-barcode": {
        label: "商品条形码",
        type: "text",
        submitConfig: {
            name: "barcode",
            op: "eq",
            validate: null
        }
    },

    "mgoods-brand": {
        label: "商品品牌",
        type: "autofill",
        submitConfig: {
            name: "mbrand.bid",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.store.queryBaseMbrandByName,
            postData: {},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            query:"mbrand.name"
        }
    },

    "muser-name" : {
        label:"用户名称",
        type:"text",
        submitConfig : {
            name : "name",
            op : "eq",
            validate:null
        }
    },
    
    "morder-no":{
        label:"订单号",
        type:"text",
        submitConfig : {
            name : "no",
            op : "eq",
            validate:null
        }
    },

    "morder-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.store,
            postData: {},
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "coupon-mgoods-no": {
        label: "商品编号",
        type: "text",
        submitConfig: {
            name: "mgoods",
            op: "eq",
            validate: null
        }
    },
    
});