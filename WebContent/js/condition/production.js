
Condition.addupRule("production", {
    
    "quoteType-name": {
        label: "报价类型",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validata: null
        }
    },
    "quoteItem-name":{
        label: "报价名称",
        type: "text",
        submitConfig:{
            name : "name",
            op: "cn",
            validata: null
        }
    },
    "quoteItem-type": {
        label: "报价类型",
        type: "select",
        submitConfig: {
            name: "quoteType.name",
            op: "eq",
            validate: null
        },
        dataSource: {// 从后台取数据的各种配置
            url: api.production.queryQuoteType,
            postData: {},
            listPath: "quoteTypes",
            keyPath: "name",
            valuePath: "name"
        }
    },
    "workshop-name": {
        label: "车间名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "workflow-name" : {
        label : "工序名称",
        type : "text",
        submitConfig : {
            name : "name",
            op : "cn",
            validate: null
        }
    },
    "workplan-name": {
        label: "工序组名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "orderId" : {
        label:"装修单号",
        type:"text",
        submitConfig : {
            name : "orderId",
            op : "eq",
            validate:{
                "reg" : /^[A-Z0-9]*$/,
                "msg" : "格式不正确A-Z,0-9"
            }
        }
    },
    "no":{
        label: "生产单号",
        type: "text",
        submitConfig: {
            name: "pno",
            op: "eq",
            validate: null}
    },
    "plan-no" : {
        label: "计划单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "hardware-no":{
        label: "五金单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null}
    },
    "outsource-no":{
        label: "外协单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null}
    },
    "tranpack-no":{
        label: "物流单号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null}
    },
    "village":{
        label: "楼盘",
        type: "autofill",
        submitConfig: {
            name: "villageId",
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
    "creater": {
        label: "创建人",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "createrId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "designer": {
        label: "设计师",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "designerId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "salesman": {
        label: "销售员",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "salesmanId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "spliter": {
        label: "拆单员",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "spliterId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "supplier": {
        label: "厂商",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "supplierId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.querySupplierByPinyin,//获取数据要调用的接口
            postData: {"user.status" : 0},//获取数据时的请求参数
            listPath: "suppliers",//响应list的json路径
            keyPath: "userId",//用来向后台提交的字段的json路径
            valuePath: "userName",//用来在页面显示的字段的json路径
            query: "supplier.pinYin"//用来向后台提交要查询的属性值的json路径
        }
    },
    "sender": {
        label: "送货人",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "senderId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "mounter": {
        label: "安装人",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "mounterId",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.personel.queryUserByPinyin,//获取数据要调用的接口
            postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "key",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "createTime":{
        label:"创建时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"createTime",
            op:"between",
            validate:null
        }
    },
    "designTime":{
        label:"设计时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"designTime",
            op:"between",
            validate:null
        }
    },
    "divideTime":{
        label:"生产时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"divideTime",
            op:"between",
            validate:null
        }
    },
    "storeTime":{
        label:"入库时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"storeTime",
            op:"between",
            validate:null
        }
    },
    "planTime":{
        label:"物流时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"planTime",
            op:"between",
            validate:null
        }
    },
    "tranTime":{
        label:"运输时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"tranTime",
            op:"between",
            validate:null
        }
    },
    "mountTime":{
        label:"安装时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"mountTime",
            op:"between",
            validate:null
        }
    },
    "finishTime":{
        label:"完成时间",
        type:"dateRangePicker",
        submitConfig:{
            name:"finishTime",
            op:"between",
            validate:null
        }
    },
    "tranpack-type":{
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"tranpackType",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "type":{
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"productionType",
            keyPath:"key",
            valuePath:"value"
        }
    },
    
    "status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"productionStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "plan-status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath : "productionPlanStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "hardware-status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"hardwareStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "outsource-status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"outsourceStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "tranpack-status":{
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.production,
            postData : {},
            listPath :"tranpackStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    
});