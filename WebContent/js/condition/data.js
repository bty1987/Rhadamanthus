
Condition.addupRule("data", {
    
    "worktype": {
        label: "工种",
        type: "select",
        submitConfig: {
            name: "workTypeName",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.common.queryWorkType,
            postData: {},
            listPath: "workTypes",
            keyPath: "name",
            valuePath: "name"
        }
    },
   
    "unit-name": {
        label: "查询单位",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "serviceNode-type" : {
        label: "节点类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "serviceNodeType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "village-name": {
        label: "楼盘名称",
        type:  "text",
        submitConfig: {
            name: "villageName",
            op: "cn",
            validate: null
        }
    },
    
    "receiptType-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "receiptType-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.data,
            postData: {},
            listPath: "receiptType",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "receiptType-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.data,
            postData: {},
            listPath: "receiptTypeStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "quotation-version-name": {
        label: "版本名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-functionArea-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-version": {
        label: "版本",
        type: "select",
        submitConfig: {
            name: "versionId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "quotation-item-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "itemName",
            op: "cn",
            validate: null
        }
    },
    "quotation-item-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "quotationTypeId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationType,
            postData: {},
            listPath: "quotationTypes",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-classification": {
        label: "分类",
        type: "select",
        submitConfig: {
            name: "quotationClassificationId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationClassification,
            postData: {},
            listPath: "quotationClassifications",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-bigcategory": {
        label: "大类",
        type: "select",
        submitConfig: {
            name: "quotationBigCategoryId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationBigCategory,
            postData: {},
            listPath: "quotationBigCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-item-smallcategory": {
        label: "小类",
        type: "select",
        submitConfig: {
            name: "quotationSmallCategoryId",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationSmallCategory,
            postData: {},
            listPath: "quotationSmallCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    "quotation-additem-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "quotation-additem-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
	    dataSource : {
	        url : api.ds.data,
	        postData : {},
	        listPath :"Status",
	        keyPath:"key",
	        valuePath:"value"
	    }
    },
    
    "model-no": {
        label: "型号",
        type: "text",
        submitConfig: {
            name: "materialModelNo",
            op: "cn",
            validate: null
        }
    },
    "model-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "materialModelName",
            op: "cn",
            validate: null
        }
    },
    "model-category": {
        label: "品类",
        type: "select",
        submitConfig: {
            name: "materialTypeId",
            op: "cn",
            validate: null
        },
        dataSource: {
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "model-brand": {
        label: "品牌",//中文名
        type: "autofill",//类型
        submitConfig: {//向后台提交的配置
            name: "materialBrandName",//接口中的参数名
            op: "eq",//查询方式
            validate: null//校验规则
        },
        dataSource: {//从后台取数据的各种配置
            url: api.data.queryBrandByPinyin,//获取数据要调用的接口
            postData: {},//获取数据时的请求参数
            listPath: "autoFillKeyValue",//响应list的json路径
            keyPath: "value",//用来向后台提交的字段的json路径
            valuePath: "value"//用来在页面显示的字段的json路径
        }
    },
    "model-righter": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userId",
            op: "eq",
            validate: null
        }, dataSource: {
            url: api.personel.queryUserByPinyin,
            postData: {"user.status":0,"departmentType.name":"主材部"},
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "goods-no": {
        label: "商品编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "cn",
            validate: null
        }
    },
    "goods-name": {
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "goods-barcode": {
        label: "条形码",
        type: "text",
        submitConfig: {
            name: "barcode",
            op: "cn",
            validate: null
        }
    },
    "goods-gid": {
        label: "商品ID",
        type: "text",
        submitConfig: {
            name: "gid",
            op: "cn",
            validate: null
        }
    },
    "goods-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.ds.manifest,
            postData: {},
            listPath: "statusType",
            keyPath: "key",
            valuePath:"value"
        }
    },
    "brand-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "brand-category": {
        label: "品类",
        type: "select",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: api.data.queryCategory,
            postData: {},
            listPath: "categorys",
            keyPath: "cid",
            valuePath: "name"
        }
    },
    "category-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    "goods-brand-name": {
        label: "商品品牌",
        type: "text",
        submitConfig: {
            name: "brand",
            op: "cn",
            validate: null
        }
    },
    
    "aoods-name" :{
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "aoods-type": {
        label: "辅类",
        type: "text",
        submitConfig: {
            name: "accessoriesType.name",
            op: "cn",
            validate: null
        }
    },
    "aoods-status": {
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
                {key: "0", value: "启用"},
                {key: "1", value: "禁用"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    "aoods-bompany": {
        label: "归属公司",
        type: "select",
        submitConfig: {
            name: "bompany",
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
    
    "soods-name" :{
        label: "商品名",
        type: "text",
        submitConfig: {
            name: "goods.name",
            op: "cn",
            validate: null
        }
    },
    "soods-quotation-item-name" :{
        label: "报价名称",
        type: "text",
        submitConfig: {
            name: "quotationItem.itemName",
            op: "cn",
            validate: null
        }
    },
    "soods-quotation-version" :{
        label: "报价版本",
        type: "select",
        submitConfig: {
            name: "quotationItem.quotationVersion.no",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationVersion,
            postData: {},
            listPath: "quotationVersions",
            keyPath: "no",
            valuePath: "name"
        }
    },
    "soods-category" : {
        label: "品类",
        type: "text",
        submitConfig: {
            name: "goods.category",
            op: "cn",
            validate: null
        },
    },
    "soods-brand" : {
        label: "品牌",
        type: "text",
        submitConfig: {
            name: "goods.brand",
            op: "cn",
            validate: null
        },
    },
    "soods-quotation-smallcategory": {
        label: "小类",
        type: "select",
        submitConfig: {
            name: "quotationSmallCategory.id",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.quotation.queryQuotationSmallCategory,
            postData: {},
            listPath: "quotationSmallCategorys",
            keyPath: "id",
            valuePath: "name"
        }
    },
    
    "storehouse-no": {
        label: "库房编号",
        type: "text",
        submitConfig: {
            name: "code",
            op: "cn",
            validate: null
        }
    },

    "storehouse-name": {
        label: "仓库名",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "storehouse-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource: {
            url: api.ds.data,
            postData: null,
            listPath: "status",
            keyPath: "key",
            valuePath: "value"
        }
    },
    "storehouse-righter": {
        label: "姓名",
        type: "autofill",
        submitConfig: {
            name: "userId",
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
    "manifest-template-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    
    "drawline-group-name": {
        label: "放线小组",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "construction-node-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "construction-cost-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    
    "task-name" : {
        label:"任务名称",
        type:"text",
        submitConfig : {
            name : "taskName",
            op : "eq",
            validate:null
        }
    },
    
    "task-isShow" : {
        label:"显示",
        type:"select",
        submitConfig:{
        	name: "taskIsShow",
        	op: "eq",
        	validate: null 
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "taskIsShow",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "task-status" : {
        label:"状态",
        type:"select",
        submitConfig:{
        	name: "taskStatus",
        	op: "eq",
        	validate: null 
        },
        dataSource: {
            url: api.ds.data,
            postData: {},
            listPath: "taskStatus",
            keyPath: "key",
            valuePath: "value"
        }
    },
    
    "chart-no": {
        label: "编号",
        type: "text",
        submitConfig: {
            name: "no",
            op: "eq",
            validate: null
        }
    },
    "chart-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "eq",
            validate: null
        }
    },
    
    "contract-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "signet-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "talking-name": {
        label: "名称",
        type: "text",
        submitConfig: {
            name: "name",
            op: "cn",
            validate: null
        }
    },
    "talking-type": {
        label: "类型",
        type: "select",
        submitConfig: {
            name: "type",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.data,
            postData : {},
            listPath :"talkingType",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "talking-status": {
        label: "状态",
        type: "select",
        submitConfig: {
            name: "status",
            op: "eq",
            validate: null
        },
        dataSource : {
            url : api.ds.data,
            postData : {},
            listPath :"talkingStatus",
            keyPath:"key",
            valuePath:"value"
        }
    },
    "taskParam-module": {
        label: "模块",
        type: "select",
        submitConfig: {
            name: "module",
            op: "eq",
            validate: null
        },
        dataSource: {//从后台取数据的各种配置
            url: null,
            postData: null,
            listPath: [
                {key: "decoration", value: "装修"},
                {key: "payment", value: "款项"},
                {key: "sales", value: "销售"},
                {key: "inventory", value: "仓储"},
                {key: "construction", value: "工程"}
            ],
            keyPath: "key",
            valuePath: "value"
        }
    },
    
});