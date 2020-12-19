
Condition.addupRule("sales", {
    
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
    "no" : {
        label:"销售单号",
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
    "village":{
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "village.no",
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
    "category-name" : {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "category",
            op: "cn",
            validate: null
        },
    },
    "brand-name" : {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",
            validate: null
        },
    },
    "brand":{
        label: "品牌",
        type: "autofill",
        submitConfig: {
            name: "bid",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.data.queryBrandByPinyin,
            postData: {},
            listPath: "brands",
            keyPath: "bid",
            valuePath: "name"
        }
    },
    "brand-all":{
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",        
            validate: null
        },
    },
    "status":{
        label: "销售单状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.sales,
            postData: {},
            listPath: "statues",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "instorer" : {
        label: "驻店员",
        type: "autofill",
        submitConfig: {//向后台提交的配置
            name: "instorer",//接口中的参数名
            op: "eq",//查询方式
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "salesman" : {
        label: "渠道",
        type: "autofill",
        submitConfig: {//向后台提交的配置
            name: "salesman",//接口中的参数名
            op: "eq",//查询方式
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: { "user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "guider": {
        label: "导购",
        type: "autofill",
        submitConfig: {//向后台提交的配置
            name: "guider",//接口中的参数名
            op: "eq",//查询方式
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: { "user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "region-name":{
        label: "大区名称",
        type: "text",
        submitConfig: {
            name: "region.name",
            op: "cn",
            validata: null
        }
    },
    "dept-name":{
        label: "归属部门",
        type: "text",
        submitConfig: {
            name: "dept.name",
            op: "cn",
            validata: null
        }
    },
    "dept": {
        label: "部门",
        type: "selectCaching",
        submitConfig: {
            name: "dept.name",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.communion.queryDepartment,
            postData: {},
            listPath: "deptList",
            keyPath: "name",
            valuePath: "name"
        }
    },
    "fullpayTime" : {
        label:"补款时间",
        type:"dateRangePicker",
        submitConfig : {
            name : "fullpayTimeRange",
            op : "between",
            validate:null
        }
    },
    "dompany": {
        label: "公司",
        type: "select",
        submitConfig: {
            name: "dompany",
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
    
    "activity" : {
        label: "活动名称", //中文名
        type: "text", // 类型
        submitConfig: { // 向后台提交的配置
            name: "activity.name", // 接口中的参数名
            op: "cn", // 查询方式
            validate: null // 校验规则
        }
    },
    "activity-category-name": {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validate: null
        },
    },
    "activity-brand-name" : {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validate: null
        },
    },
    
    "balance-orderId":{
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "balance-no":{
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "balance-category-name" : {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validate: null
        },
    },
    "balance-brand-name" : {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validate: null
        },
    },
    "balance-brand":{
        label: "品牌",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "sales.brand",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.data.queryBrandByPinyin,//获取数据要调用的接口
            postData: {},//获取数据时的请求参数
            listPath: "brands",//响应list的json路径
            keyPath: "name",//用来向后台提交的字段的json路径
            valuePath: "name"//用来在页面显示的字段的json路径
        }
    },
    "balance-status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.payment,
            postData: {},
            listPath: "balanceStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-type":{
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.payment,
            postData: {},
            listPath: "balanceType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "balance-fullpayTime":{
        label: "补款时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.fullpayTime",
            op: "between",
            validate: null
        }
    },
    "balance-createTime":{
        label: "预结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "balance-venderTime":{
        label: "厂商结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "venderTime",
            op: "between",
            validate: null
        }
    },
    "balance-postTime":{
        label: "结算时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "postTime",
            op: "between",
            validate: null
        }
    },
    "sale-createTime":{
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "createTime",
            op: "between",
            validate: null
        }
    },
    "salesDelivery-no":{
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "salesDelivery-orderId":{
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "salesDelivery-category":{
        label: "品类",
        type: "text",
        submitConfig: {
            name: "sales.category",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-brand":{
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "sales.brand",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-goods":{
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validata: null
        }
    },
    "salesDelivery-traner":{
        label: "配送人",
        type: "autofill",
        submitConfig: {
            name: "traner",
            op: "eq",
            validata: null
        },
        dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":0,"departmentType.name":""},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "salesActivity-no":{
        label: "销售单号",
        type: "text",
        submitConfig: {
            name: "sales.no",
            op: "eq",
            validata: null
        }
    },
    "salesActivity-orderId":{
        label: "装修单号",
        type: "text",
        submitConfig: {
            name: "sales.orderId",
            op: "eq",
            validata: null
        }
    },
    "salesActivity-createTime":{
        label: "创建时间",
        type: "dateRangePicker",
        submitConfig: {
            name: "sales.createTime",
            op: "between",
            validata: null
        }
    },
});