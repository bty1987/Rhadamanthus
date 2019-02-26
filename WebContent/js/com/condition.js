/**
 * 存放查询条件的js,定义全项目的查询条件
 */

var Condition = function (api) {

    var _condRules = {

		material_salesman: {
            label: "业务员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "salesman",//接口中的参数名
                op: "eq",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,//获取数据要调用的接口
                postData: {"user.status":"","departmentType.name":""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },

        material_orderAddr: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "village",
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
        material_brand: {
            label: "品牌",
            type: "autofill",
            submitConfig: {
                name: "brand",
                op: "eq",
                validate: null
            }, dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "value",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        paymentDesigner: {
            label: "设计师",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "designer",//接口中的参数名
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
        paymentVillage: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "village",
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
        paymentMsoDesigner: {
            label: "设计师",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "designer",//接口中的参数名
                op: "cn",//查询方式
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
        paymentOrderAddr: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "villageName",
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
        paymentVillageName: {
            label: "楼盘名称",
            type: "autofill",
            submitConfig: {
                name: "name",
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

        //例子 autofill
        designer: {
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
        //text
        orderId: {
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
        //select
        designerRegionId: {
            label: "设计中心",
            type: "selectCaching",
            submitConfig: {
                name: "designerRegionId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.communion.queryDepartment,
                postData: {"dept.type.name": "设计大区"},
                listPath: "deptList",
                keyPath: "no",
                valuePath: "name"
            }
        },
        //timeRange
        measureTimeDateRange: {
            label: "量尺时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "measureTimeDateRange",
                op: "cn",
                validate: null
            }
        },
		//timeRange
        createTimeDateRange: {
            label: "创建时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTimeDateRange",
                op: "cn",
                validate: null
            }
        },
        //---------------系统配置------------------
        systemConfig: {
            label: "关键字查询",
            type: "text",
            submitConfig: {
                name: "key",
                op: "cn",
                validate: null,
            },
        },
        //-------系统
        regionName: {
            label: "大区名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        departmentName: {
            label: "归属部门",
            type: "text",
            submitConfig: {
                name: "departmentName",
                op: "cn",
                validate: null
            }
        },
        cityName: {
            label: "城市名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        companyName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        dutyName: {
            label: "职位名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        cityProperName: {
            label: "城区名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        subFunctionName: {
            label: "自功能名称",
            type: "text",
            submitConfig: {
                name: "subFunctionName",
                op: "cn",
                validate: null
            }
        },
        roleName: {
            label: "角色名称",
            type: "text",
            submitConfig: {
                name: "roleName",
                op: "cn",
                validate: null
            }
        },
        region: {
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
        city: {
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
        //-------部门
        sdeptName: {
            label: "大区名称",
            type: "text",
            submitConfig: {
                name: "deptName",
                op: "cn",
                validate: null
            }
        },
        deptName: {
            label: "部门名称",
            type: "text",
            submitConfig: {
                name: "deptName",
                op: "cn",
                validate: null
            }
        },
        //-------信息-公告查询条件
        theme: {
            label: "主题", //中文名
            type: "text", // 类型
            submitConfig: { // 向后台提交的配置
                name: "theme", // 接口中的参数名
                op: "cn", // 查询方式
                validate: null // 校验规则
            }
        },
        dateRange: {
            label: "时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "dateRange",
                op: "cn",
                validate: null
            }
        },
        //-------信息-活动查询条件
        activityName: {
            label: "名称", //中文名
            type: "text", // 类型
            submitConfig: { // 向后台提交的配置
                name: "name", // 接口中的参数名
                op: "cn", // 查询方式
                validate: null // 校验规则
            }
        },
        activityStatus: {
            label: "状态", //中文名
            type: "select", // 类型
            submitConfig: { // 向后台提交的配置
                name: "status", // 接口中的参数名
                op: "eq", // 查询方式
                validate: null // 校验规则
            },
            dataSource: { // 从后台取数据的各种配置
                url: null, // 获取数据要调用的接口
                postData: null, // 获取数据时的请求参数
                listPath: [{key: "0", value: "\u6709\u6548"}, {key: "1", value: "\u65e0\u6548"}], // 响应list的json路径
                keyPath: "key", // 用来向后台提交的字段的json路径
                valuePath: "value" // 用来在页面显示的字段的json路径
            }
        },
        activityType: {
            label: "类型", //中文名
            type: "select", // 类型
            submitConfig: { // 向后台提交的配置
                name: "type", // 接口中的参数名
                op: "eq", // 查询方式
                validate: null // 校验规则
            },
            dataSource: { // 从后台取数据的各种配置
                url: null, // 获取数据要调用的接口
                postData: null, // 获取数据时的请求参数
                listPath: [{key: "0", value: "\u88c5\u4fee"}, {key: "1", value: "\u4e3b\u6750"}], // 响应list的json路径
                keyPath: "key", // 用来向后台提交的字段的json路径
                valuePath: "value" // 用来在页面显示的字段的json路径
            }
        },
        inf_tno: {
            label: "活动票号",
            type: "text",
            submitConfig: {
                name: "tno",
                op: "eq",
                validate: null
            }
        },
        inf_userName: {
            label: "姓名",
            type: "text",
            submitConfig: {
                name: "name",
                op: "eq",
                validate: null
            }
        },
        inf_orderId: {
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

        //大活动--活动款
        vp_mno: {
            label: "会员号",
            type: "text",
            submitConfig: {
                name: "mno",
                op: "eq",
                validate:null,
            }
        },
        vp_brand: {
            label: "品牌",
            type: "autofill",
            submitConfig: {
                name: "brand",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "value",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        v_createrName: {
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
        prizeName: {
            label: "物品名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "eq",
                validate:null
            }
        },
        prizeNo: {
            label: "物品编号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "eq",
                validate:null
            }
        },
        awardStockType: {
            label: "类型",
            type: "select",
            submitConfig: {
                name: "type",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.ds.information,
                postData: {},
                listPath: "awardStockType",
                keyPath: "key",
                valuePath:"value"
            }
        },

        StockDate: {
            label: "记录时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "awardRecordTimeDateRange",
                op: "cn",
                validate: null
            }
        },
        StockName:{
            label: "物品名称",
            type: "text",
            submitConfig: {
                name: "awardStock.name",
                op: "eq",
                validate: null
            }
        },

        //-------数据-报价-报价版本
        versionName: {
            label: "版本名称",
            type: "text",
            submitConfig: {
                name: "versionName",
                op: "cn",
                validate: null
            }
        },
        //--------数据-报价-报价项
        itemName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "itemName",
                op: "cn",
                validate: null
            }
        },
        quotationTypeId: {
            label: "类型",
            type: "select",
            submitConfig: {
                name: "quotationTypeId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.quotation.queryQuotationType,
                postData: {},
                listPath: "quotationTypes",
                keyPath: "id",
                valuePath: "name"
            }
        },
        quotationClassificationId: {
            label: "分类",
            type: "select",
            submitConfig: {
                name: "quotationClassificationId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.quotation.queryQuotationClassification,
                postData: {},
                listPath: "quotationClassifications",
                keyPath: "id",
                valuePath: "name"
            }
        },
        quotationBigCategoryId: {
            label: "大类",
            type: "select",
            submitConfig: {
                name: "quotationBigCategoryId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.quotation.queryQuotationBigCategory,
                postData: {},
                listPath: "quotationBigCategorys",
                keyPath: "id",
                valuePath: "name"
            }
        },
        quotationSmallCategoryId: {
            label: "小类",
            type: "select",
            submitConfig: {
                name: "quotationSmallCategoryId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.quotation.queryQuotationSmallCategory,
                postData: {},
                listPath: "quotationSmallCategorys",
                keyPath: "id",
                valuePath: "name"
            }
        },
        versionId: {
            label: "版本",
            type: "select",
            submitConfig: {
                name: "versionId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.quotation.queryQuotationVersion,
                postData: {},
                listPath: "quotationVersions",
                keyPath: "versionId",
                valuePath: "versionName"
            }
        },
        quotationWorkTypeId: {
            label: "工种",
            type: "select",
            submitConfig: {
                name: "quotationWorkTypeId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.common.queryWorkType,
                postData: {},
                listPath: "workTypes",
                keyPath: "id",
                valuePath: "name"
            }
        },
        //--------数据-服务节点------
        serviceNodeType : {
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
        //--------放线小组---------
        groupName: {
            label: "放线小组",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        //------添加单位---------
        measurementUnitName: {
            label: "查询单位",
            type: "text",
            submitConfig: {
                name: "name",
                op: "eq",
                validate: null
            }
        },
        //--------数据-楼盘
        villageName: {
            label: "楼盘名称",
            type:  "text",
            submitConfig: {
                name: "villageName",
                op: "cn",
                validate: null
            }
        },
        datacity: {
            label: "所属城市",
            type: "select",
            submitConfig: {
                name: "cityId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.system.queryCity,
                postData: {},
                listPath: "citys",
                keyPath: "cid",
                valuePath: "name"
            }
        },
        cityProperId: null,
        //---------数据-主材-型号 页面的各种查询条件
        materialModelNo: { //
            label: "主材单号",
            type: "text",
            submitConfig: {
                name: "materialModelNo",
                op: "cn",
                validate: null
            }
        },
        materialModelName: { //
            label: "名称",
            type: "text",
            submitConfig: {
                name: "materialModelName",
                op: "cn",
                validate: null
            }
        },
        materialTypeId: {
            label: "品类",
            type: "select",
            submitConfig: {
                name: "materialTypeId",
                op: "cn",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryCategory,
                postData: {},
                listPath: "categorys",
                keyPath: "cid",
                valuePath: "categoryName"
            }
        },
        materialerName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "userName",
                op: "cn",
                validate: null
            }, dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":0,"departmentType.name":"主材部"},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value"
            }
        },
        categoryId: {
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
        categoryName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "eq",
                validate: null
            }
        },
        brandName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        materialBrandName: {
            label: "品牌",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "materialBrandName",//接口中的参数名
                op: "eq",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "value",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        //---------数据-收据类型 页面的各种查询条件
        receiptTypeName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        receiptType: {
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
        receiptTypeStatus: {
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
        //--------人事-员工 页面的各种查询条件
        userId: { //
            label: "员工号",
            type: "text",
            submitConfig: {
                name: "userId",
                op: "eq",
                validate: null
            }
        },
        receiverName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "receiverName",
                op: "cn",
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
        senderName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "senderName",
                op: "cn",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status": ""},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value"
            }
        },
        userName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "userName",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":""},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value"
            }
        },
        identity: { //
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
        roleId: {
            label: "角色",
            type: "select",
            submitConfig: {
                name: "roleId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.system.queryRole,
                postData: {},
                listPath: "roleList",
                keyPath: "rid",
                valuePath: "name"
            }
        },
        deptType: {
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
        deptId: {
            label: "部门",
            type: "selectCaching",
            submitConfig: {
                name: "deptId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.communion.queryDepartment,
                postData: {},
                listPath: "deptList",
                keyPath: "no",
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
            dataSource: {//从后台取数据的各种配置
                url: api.ds.personel,
                postData: {},
                listPath: "statusType",
                keyPath: "key",
                valuePath:"value"
            }
        },
        performanceType: {
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
        performancestartTime: {
            label: "开始时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "performancestartTime",
                op: "cn",
                validate: null
            }
        },
        performanceendTime: {
            label: "结束时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "performanceendTime",
                op: "cn",
                validate: null
            }
        },
        //装修订单-设计 页面的各种查询条件
        village: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "villageId",
                op: "eq ",
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
        houseNumber: {
            label: "楼号",
            type: "text",
            submitConfig: {
                name: "houseNumber",
                op: "cn",
                validate: null
            }
        },
        houseArea: {
            label: "面积",
            type: "text",
            submitConfig: {
                name: "houseArea",
                op: "eq",
                validate: {
                    "reg": /^[A-Z0-9]*$/,
                    "msg": "格式不正确A-Z,0-9"
                }
            }
        },
        customerId: {
            label: "客户编号",
            type: "text",
            submitConfig: {
                name: "customerId",
                op: "cn",
                validate: null
            }
        },
        customerPhone: {
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
        relationshipType: {
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

        selectCompany: {
            label: "公司名称",
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

        salesman: {
            label: "业务员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "salesmanId",//接口中的参数名
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
        quoter: {
            label: "报价员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "quoterId",//接口中的参数名
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
        escorter: {
            label: "跟单员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "escorterId",//接口中的参数名
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
        designerDepartmentId: {
            label: "设计部",
            type: "selectCaching",
            submitConfig: {
                name: "designerDepartmentId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.communion.queryDepartment,
                postData: {"dept.type.name": "设计部"},
                listPath: "deptList",
                keyPath: "no",
                valuePath: "name"
            }
        },
        salesmanRegionId: {
            label: "业务中心",
            type: "selectCaching",
            submitConfig: {
                name: "salesmanRegionId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.communion.queryDepartment,
                postData: {"dept.type.name": "业务大区"},
                listPath: "deptList",
                keyPath: "no",
                valuePath: "name"
            }
        },
        salesmanDepartmentId: {
            label: "业务部",
            type: "selectCaching",
            submitConfig: {
                name: "salesmanDepartmentId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.communion.queryDepartment,
                postData: {},
                listPath: "deptList",
                keyPath: "no",
                valuePath: "name"
            }
        },
        signTimeDateRange: {
            label: "签单时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "signTimeDateRange",
                op: "cn",
                validate: null
            }
        },
        auditTime: {
            label: "审核时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "auditTime",
                op: "cn",
                validate: null
            }
        },
        depositTimeDateRange : {
            label:"定金时间",
            type:"dateRangePicker",
            submitConfig : {
                name : "depositTimeDateRange",
                op : "cn",
                validate:null
            }
        },
        houseClass: {
            label: "房屋类型",
            type: "select",
            submitConfig: {
                name: "houseClass",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.decoration,
                postData: {"timestamp": new Date().getTime()},
                listPath: "houseClass",
                keyPath: "key",
                valuePath: "value"
            }
        },
        auditName: {
            label: "审核人",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "auditer",//接口中的参数名
                op: "eq",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,//获取数据要调用的接口
                postData: {"user.status":0,"departmentType.name":"职能部"},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        auditStatus: {
            label: "审核状态",
            type: "select",
            submitConfig: {
                name: "auditStatus",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.decoration,
                postData: {"timestamp": new Date().getTime()},
                listPath: "auditStatus",
                keyPath: "key",
                valuePath: "value"
            }
        },
        status: {
            label: "状态",
            type: "select",
            submitConfig: {
                name: "status",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.decoration,
                postData: {"timestamp": new Date().getTime()},
                listPath: "decorationOrderStatus",
                keyPath: "key",
                valuePath: "value"
            }
        },
        orderType: {
            label: "订单类型",
            type: "select",
            submitConfig: {
                name: "orderType",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.decoration,
                postData: {"timestamp": new Date().getTime()},
                listPath: "orderType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        salesmanType: {
            label: "业务员类型",
            type: "select",
            submitConfig: {
                name: "salesmanType",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.decoration,
                postData: {"timestamp": new Date().getTime()},
                listPath: "salesmanType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        approvalType: {
            label: "审批类型",
            type: "select",
            submitConfig: {
                name: "type",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.approval,
                postData: {"timestamp": new Date().getTime()},
                listPath: "approvalType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        approvalcreateTime: {
            label: "提交时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        approvalTime: {
            label: "审批时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "approvalTime",
                op: "between",
                validate: null
            }
        },
        // 收款
        orderAddr: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "orderAddr",
                op: "cn",
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
        collectTimeDateRange: {
            label: "收款时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "collectTime",
                op: "between",
                validate: null
            }
        },
        advancePaymentcollectTime: {
            label: "收款时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "collectTimeDateRange",
                op: "between",
                validate: null
            }
        },

        //status (Short) – 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
        //    type (Short) – 类型 , 0: 购货 , 1: 退货

        balanceStatus: {
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
        }, balanceType: {
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
        // 主材
        msoNo: {
            label: "主材号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "eq",
                validate: null
            }
        }, msoDesigner: {
            label: "设计师",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "designerName",//接口中的参数名
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,//获取数据要调用的接口
                postData: {"user.status":0,"departmentType.name":""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        }, fullCollectTimeRange: {
            label: "收款时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "fullCollectTimeRange",
                op: "between",
                validate: null
            }
        }, preBalanceTimeRange: {
            label: "预结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "preBalanceTimeRange",
                op: "between",
                validate: null
            }
        }, vbalanceTimeRange: {
            label: "厂商结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "vbalanceTimeRange",
                op: "between",
                validate: null
            }
        }, postBalanceTimeRange: {
            label: "结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "postBalanceTimeRange",
                op: "between",
                validate: null
            }
        }, msalesman: {
            label: "业务员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "salesman",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,//获取数据要调用的接口
                postData: {"user.status":"" },//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        }, materialOutPaymentStatus: {
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
                    {key: "0", value: "待收款"},
                    {key: "1", value: "已收款"},
                    {key: "2", value: "退款"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        }, materialType: {
            label: "品类",
            type: "select",
            submitConfig: {
                name: "materialType",
                op: "cn",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryCategory,
                postData: {},
                listPath: "categorys",
                keyPath: "categoryName",
                valuePath: "categoryName"
            }
        }, materialBrand: {
            label: "品牌",
            type: "autofill",
            submitConfig: {
                name: "materialBrand",
                op: "cn",
                validate: null
            }, dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },

        // 日志
        loginId: {
            label: "帐号",
            type: "text",
            submitConfig: {
                name: "loginId",
                op: "eq",
                validate: null
            }
        }, sourceIp: {
            label: "IP",
            type: "text",
            submitConfig: {
                name: "sourceIp",
                op: "eq",
                validate: null
            }
        }, loginTime: {
            label: "登录时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "loginTime",
                op: "between",
                validate: null
            }
        }, successFlag: {
            label: "状态",
            type: "select",
            submitConfig: {
                name: "successFlag",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: null,
                postData: null,
                listPath: [
                    {key: "1", value: "成功"},
                    {key: "0", value: "失败"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        }, jober: {
            label: "工人姓名",
            type: "autofill",
            submitConfig: {
                name: "userName",
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
        }, salarystatus: {
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
                    {key: "0", value: "初始"},
                    {key: "1", value: "通过"},
                    {key: "2", value: "驳回"},
                    {key: "3", value: "撤销"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        },
        approveTime: {
            label: "审批时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "approveTime",
                op: "between",
                validate: null
            }
        },

        cerateTime: {
            label: "创建时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        salaryWorkduty: {
            label: "工种",
            type: "select",
            submitConfig: {
                name: "duty",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.ds.construction,
                postData: {},
                listPath: "workType",
                keyPath: "value",
                valuePath: "value"
            }
        },
        upgradeNumber: {
            label: "适用版本",
            type: "text",
            submitConfig: {
                name: "trialVersion",
                op: "eq",
                validate: null
            }
        }, upgradeCreateTime: {
            label: "创建时间",
            type: "text",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },

        //进销存
        goodsNo: {
            label: "商品编号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "cn",
                validate: null
            }
        },

        goodsName: {
            label: "商品名",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },

        goodName: {
            label: "商品名",
            type: "text",
            submitConfig: {
                name: "goods.name",
                op: "cn",
                validate: null
            }
        },

        goodsBarcode: {
            label: "条形码",
            type: "text",
            submitConfig: {
                name: "barcode",
                op: "cn",
                validate: null
            }
        },

        goodsGid: {
            label: "商品ID",
            type: "text",
            submitConfig: {
                name: "gid",
                op: "cn",
                validate: null
            }
        },

        goodsStatus: {
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

        storehouseNumber: {
            label: "库房编号",
            type: "text",
            submitConfig: {
                name: "code",
                op: "cn",
                validate: null
            }
        },

        storehouseName: {
            label: "仓库名",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        storehouseUserName: {
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
                listPath: "userBases",
                keyPath: "userId",
                valuePath: "currentName"
            }
        },

        manifestTemplateName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        workTypeName: {
            label: "工种",
            type: "select",
            submitConfig: {
                name: "workTypeName",
                op: "eq",
                validate: null
            },
            dataSource: {// 从后台取数据的各种配置
                url: api.common.queryWorkType,
                postData: {},
                listPath: "workTypes",
                keyPath: "name",
                valuePath: "name"
            }
        },
        manifestCode: {
            label: "货单号",
            type: "text",
            submitConfig: {
                name: "code",
                op: "eq",
                validata: null
            }
        },
        manifestTime: {
            label: "创建时间",
            type: "datePicker",
            submitConfig: {
                name: "manifestTime",
                op: "between",
                validata: null
            }
        },
        CheckListGoodsName: {
            label: "商品名",
            type: "text",
            submitConfig: {
                name: "goodsName",
                op: "cn",
                validate: null
            }
        },
        goodsBrand: {
            label: "商品品牌",
            type: "text",
            submitConfig: {
                name: "brand",
                op: "cn",
                validate: null
            }
        },

        purchaseUserName: {
            label: "创建人",
            type: "autofill",
            submitConfig: {
                name: "purchaseUserName",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":"" },
                listPath: "userBases",
                keyPath: "userId",
                valuePath: "currentName"
            }
        },
        purchaseNo: {
            label: "采购单号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "cn",
                validate: null
            }
        },
        purchaseTime: {
            label: "创建时间",
            type: "datePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        createrName: {
            label: "创建人",
            type: "autofill",
            submitConfig: {
                name: "createrName",//后台判断匹配
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":"" },
                listPath: "userBases",
                keyPath: "userId",//后台i
                valuePath: "currentName"//前台
            }
        },
        accessoriesNo: {
            label: "辅料单号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "eq",
                validate: null
            }
        },
        approverName: {
            label: "审批人",
            type: "autofill",
            submitConfig: {
                name: "approverName",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":"" },
                listPath: "userBases",
                keyPath: "userId",//后台i
                valuePath: "currentName"//前台
            }
        },
        createTime: {
            label: "创建时间",
            type: "datePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        approverTime: {
            label: "审批时间",
            type: "datePicker",
            submitConfig: {
                name: "approverTime",
                op: "between",
                validate: null
            }
        },

        fullpayTimeRange : {
            label:"补款时间",
            type:"dateRangePicker",
            submitConfig : {
                name : "fullpayTimeRange",
                op : "between",
                validate:null
            }
        },

        salesPaymentOrderId:{
            label:"装修单号",
            type:"text",
            submitConfig : {
                name : "sid",
                op : "eq",
                validate:{
                    "reg" : /^[A-Z0-9]*$/,
                    "msg" : "格式不正确A-Z,0-9"
                }
            }
        },
        salesPaymentNo:{
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
        salesPaymentUserName : {
            label: "设计师",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "userName",//接口中的参数名
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
        salesPaymentVillage: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "villageName",
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
        salesReceiptCollectTime:{
            label:"收款时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"collectTime",
                op:"between",
                validate:null
            }
        },
        salesReceiptConfirmTime:{
            label:"确认时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"confirmTime",
                op:"between",
                validate:null
            }
        },
        roleName:{
            label:"角色名称",
            type:"text",
            submitConfig:{
                name:"roleName",
                op:"cn",
                validate:null
            }
        },
        approvalUserName : {
            label : "姓名",
            type : "autofill",
            submitConfig : {
                name : "userName",
                op : "cn",
                validate: null
            },
            dataSource : {
                url : api.personel.queryUserByPinyin,
                postData:{"user.status":"","departmentType.name":""},
                listPath: "autoFillKeyValue",
                keyPath:"key",
                valuePath:"value"
            }
        },
        fullpayTime: {
            label: "补款时间",
            type: "datePicker",
            submitConfig: {
                name: "fullpayTime",
                op: "between",
                validata: null
            }
        },
 //审批
        approval_receiverName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "receiverName",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":"","departmentType.name":""},
                listPath: "userBases",
                keyPath: "userId",
                valuePath: "userName"
            }
        },
        approval_senderName: {
            label: "姓名",
            type: "autofill",
            submitConfig: {
                name: "senderName",
                op: "cn",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserByPinyin,
                postData: {"user.status":"","departmentType.name":""},
                listPath: "userBases",
                keyPath: "userId",
                valuePath: "userName"
            }
        },
        approval_Type: {
            label: "审批类型",
            type: "select",
            submitConfig: {
                name: "type",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.approval,
                postData: {"timestamp": new Date().getTime()},
                listPath: "approvalType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        approval_createTime: {
            label: "提交时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        approval_Time: {
            label: "审批时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "approvalTime",
                op: "between",
                validate: null
            }
        },

        //production eg:p_***
        p_quoteItemName:{
            label: "报价名称",
            type: "text",
            submitConfig:{
                name : "name",
                op: "cn",
                validata: null
            }
        },
        p_quotetype: {
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
        p_workplanName: {
            label: "工序组名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        p_workflowName : {
            label : "工序名称",
            type : "text",
            submitConfig : {
                name : "name",
                op : "cn",
                validate: null
            }
        },
        p_workshopName: {
            label: "车间名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        p_startTime:{
            label:"投料时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"startTime",
                op:"between",
                validate:null
            }
        },
        p_endTime:{
            label:"出货时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"endTime",
                op:"between",
                validate:null
            }
        },
        p_productionPlanStatus:{
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
                listPath : "productionplanStatus",
                keyPath:"key",
                valuePath:"value"
            }
        },
        p_quoteTypeName: {
            label: "报价类型",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validata: null
            }
        },
        p_orderId : {
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
        p_productionStatus:{
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
        p_productionPNo:{
            label: "生产单号",
            type: "text",
            submitConfig: {
                name: "pno",
                op: "eq",
                validate: null}
        },

        /*-------房产building : start----*/
		b_villageName: {
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
        buildingNodeType : {
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
        buildingNo : {
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
        customerNo : {
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
        houseSourceNo : {
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
        roomNum: {
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
        orientation: {
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
        waterVapour: {
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
        parlourType: {
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
        heatingType: {
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
        houseType: {
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
        through: {
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
        houseStatus: {
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
        buildingArea: {
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
        b_unitPrice: {
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
        b_totalPrice: {
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
        b_custumerName: {
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
        b_houseSourceType: {
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
        b_decorateDegree: {
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
        b_allowLoan: {
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
        b_housingGrade: {
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
        b_rentType: {
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
        b_status: {
            label: "状态",
            type: "select",
            submitConfig: {
                name: "status",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.building,
                postData: {},
                listPath: "status",
                keyPath: "key",
                valuePath: "value"
            }
        },
        
        /*-------房产building : end----*/

        /*-------销售sales : start----*/
        sales_no : {
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

        sales_orderId: {
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
        sales_instorer : {
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

        sales_salesman : {
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

        sales_deptName: {
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


        sales_brade:{
            label: "品牌",
            type: "autofill",
            submitConfig: {
                name: "brand",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.data.queryBrandForPinYinName,
                postData: {},
                listPath: "autoFillKeyValue",
                keyPath: "value",
                valuePath: "value"
            }
        },

        sales_balanceOrderId:{
            label: "装修单号",
            type: "text",
            submitConfig: {
                name: "sales.orderId",
                op: "eq",
                validata: null
            }
        },
        sales_balanceNo:{
            label: "销售单号",
            type: "text",
            submitConfig: {
                name: "sales.no",
                op: "eq",
                validata: null
            }
        },
        sales_balanceBrand:{
            label: "品牌",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "sales.brand",//接口中的参数名
                op: "eq",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "value",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        sales_balanceVillage:{
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
        sales_balanceRegion:{
            label: "大区名称",
            type: "text",
            submitConfig: {
                name: "region.name",
                op: "cn",
                validata: null
            }
        },
        sales_balanceDept:{
            label: "归属部门",
            type: "text",
            submitConfig: {
                name: "dept.name",
                op: "cn",
                validata: null
            }
        },
        sales_balanceStatus:{
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
        sales_balanceType:{
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
        sales_balanceFullpayTime:{
            label: "补款时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "sales.fullpayTime",
                op: "between",
                validate: null
            }
        },
        sales_balanceCreateTime:{
            label: "预结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        sales_balanceVenderTime:{
            label: "厂商结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "venderTime",
                op: "between",
                validate: null
            }
        },
        sales_balancePostTiem:{
            label: "结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "postTime",
                op: "between",
                validate: null
            }
        },
        sales_fullpayTimeRange : {
            label:"补款时间",
            type:"dateRangePicker",
            submitConfig : {
                name : "fullpayTimeRange",
                op : "between",
                validate:null
            }
        },
        sales_fullpayTime: {
            label: "补款时间",
            type: "datePicker",
            submitConfig: {
                name: "fullpayTime",
                op: "between",
                validate: null
            }
        },
        /*-------销售sales : end----*/

        /*-------工程construction : start----*/
        c_orderId : {
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
        c_village: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "village",
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
        c_houseNumber: {
            label: "楼号",
            type: "text",
            submitConfig: {
                name: "houseNumber",
                op: "cn",
                validate: null
            }
        },
        c_designer: {
            label: "设计师",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "designer",//接口中的参数名
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
        c_schedule: {
            label: "进度",
            type: "select",
            submitConfig: {
                name: "schedule",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.ds.construction,
                postData: {"timestamp": (new Date).getTime()},
                listPath: "constructionSchedule",
                keyPath: "key",
                valuePath: "value"
            }
        },
        c_projectStatusFlag: {
            label: "完工状态",
            type: "select",
            submitConfig: {
                name: "projectStatus",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: null,
                postData: null,
                listPath: [
                    {key: "未完工", value: "未完工"},
                    {key: "已完工", value: "已完工"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        },
        c_supervisor: {
            label: "监理",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "supervisor",//接口中的参数名
                op: "eq",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,//获取数据要调用的接口
                postData: {"user.status":0,"departmentType.name":"工程部"},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        c_acceptanceFlag: {
            label: "验收状态",
            type: "select",
            submitConfig: {
                name: "acceptanceFlag",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: null,
                postData: null,
                listPath: [
                    {key: "notAcceptanced", value: "未验收"},
                    {key: "acceptanced", value: "已验收"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        },
        c_salesman: {
            label: "业务员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "salesman",//接口中的参数名
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
        c_actualDate: {
            label: "放线时间",
            type: "datePicker",
            submitConfig: {
                name: "actualDate",
                op: "between",
                validate: null
            }
        },
        c_drawLineStatus: {
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
                    {"key": "1", "value": "申请放线"},
                    {"key": "3", "value": "放线失败"},
                    {"key": "2", "value": "放线成功"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        },
        c_name: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        /*-------工程construction : end----*/
        
        /*-------客户customer : start----*/
        cu_name : {
            label:"客户名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },
        /*-------客户customer : end----*/
		 customerSourcePhone :{
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
		
		/*-------商城store : start----*/
        mgoodsNo: {
            label: "商品编号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "cn",
                validate: null
            }
        },
        mgoodsNames: {
            label: "商品名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "eq",
                validate: null
            }
        },

        mgoodsBarcodes: {
            label: "商品条形码",
            type: "text",
            submitConfig: {
                name: "barcode",
                op: "eq",
                validate: null
            }
        },

        mgoodsBrands: {
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

        mcategory : {
            label:"品类名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },
		
		mbrandName : {
            label:"品牌名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },
        
        muserName : {
            label:"用户名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },
		
		morderNo:{
            label:"订单号",
            type:"text",
            submitConfig : {
                name : "no",
                op : "eq",
                validate:null
            }
        },

        morderByStatus: {
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
		
		mgoodsno: {
            label: "商品编号",
            type: "text",
            submitConfig: {
                name: "mgoods",
                op: "eq",
                validate: null
            }
        },

        /*-------商城store : end----*/
		
		 labelname : {
            label:"名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },
		

        /*-------标签label----*/
		
		taskName : {
            label:"任务名称",
            type:"text",
            submitConfig : {
                name : "taskName",
                op : "eq",
                validate:null
            }
        },
        
        taskselect : {
            label:"任务名称",
            type:"select",
            submitConfig : {
                name : "taskName",
                op : "eq",
                validate:null
            },
            dataSource: {
                url: api.information.queryTask,
                postData: {},
                listPath: "tasks",
                keyPath: "tid",
                valuePath: "name"
            }
        },
        /*-------积分记录----*/
        vscoreRecordType : {
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

        /*------创建反馈时间----------*/
        feedbackCreateTime: {
            label: "创建时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },

        /*-------群--------*/
        groupName : {
            label:"名称",
            type:"text",
            submitConfig : {
                name : "name",
                op : "eq",
                validate:null
            }
        },

        groupOrderId : {
            label:"装修单号",
            type:"text",
            submitConfig : {
                name : "orderId",
                op : "eq",
                validate:null
            }
        },

        /*--------------会员----------------*/
        cu_no: {
            label: "会员编号",
            type: "text",
            submitConfig: {
                name: "no",
                op: "eq",
                validate:null,
            }
        },

        cu_phone :{
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

        /*-------易居market : start----*/
        e_designer: {
            label: "设计师",
            type: "autofill",
            submitConfig: {
                name: "designer",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.market.queryEpersonByPinYin,
                postData: {},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value",
                query: "epseron.pinyin"
            }
        },
        e_supervisor: {
            label: "监理",
            type: "autofill",
            submitConfig: {
                name: "supervisor",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.market.queryEpersonByPinYin,
                postData: {},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value",
                query: "eperson.pinyin"
            }
        },
        e_pictureType: {
            label: "类型",
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
                    {"key": "0", "value": "效果图"},
                    {"key": "1", "value": "施工图"}
                ],
                keyPath: "key",
                valuePath: "value"
            }
        },
        e_name : {
            label:"姓名",
            type:"text",
            submitConfig : {
                name : "name",
                op : "cn",
                validate:null
            }
        },
        e_style : {
            label:"风格",
            type:"text",
            submitConfig : {
                name : "style",
                op : "cn",
                validate:null
            }
        },
        e_houseType: {
            label: "户型",
            type: "select",
            submitConfig: {
                name: "houseType",
                op: "cn",
                validate: null
            },
            dataSource: {
                url: api.ds.market,
                postData: {"timestamp": new Date().getTime()},
                listPath: "room",
                keyPath: "key",
                valuePath: "value"
            }
        },

        e_area: {
            label: "面积",
            type: "select",
            submitConfig: {
                name: "area",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.market,
                postData: {"timestamp": new Date().getTime()},
                listPath: "area",
                keyPath: "key",
                valuePath: "value"
            }
        },
        e_customerName: {
            label:"姓名",
            type:"text",
            submitConfig : {
                name : "name",
                op : "cn",
                validate:null
            }
        },
        e_city: {
            label:"城市",
            type:"text",
            submitConfig : {
                name : "city",
                op : "cn",
                validate:null
            }
        },
        e_cityId: {
            label: "城市",
            type: "autofill",
            submitConfig: {
                name: "cityId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.market.queryEcityByPinYin,
                postData: {},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value",
                query: "ecity.pinyin"
            }
        },
		
		e_phone : {
            label:"电话",
            type:"text",
            submitConfig : {
                name : "phone",
                op : "cn",
                validate:{
                    "reg": /^[0-9]*$/,
                    "msg": "电话格式不正确"
                }
            }
        },
        e_industry : {
            label:"行业",
            type:"text",
            submitConfig : {
                name : "industry",
                op : "cn",
                validate:null
            }
        },

        /*-------易居market : end----*/

        /*-------款项payment新增 : start----*/
        r_paymentType : {
            label: "款项类型",
            type: "select",
            submitConfig: {
                name: "paymentType",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.payment,
                postData: {},
                listPath: "receiptPaymentType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        r_receiptType : {
            label:"收据类型",
            type: "select",
            submitConfig: {
                name: "receiptType",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.ds.payment,
                postData: {},
                listPath: "receiptType",
                keyPath: "key",
                valuePath: "value"
            }
        },
        r_collectTime:{
            label:"收款时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"collectTime",
                op:"between",
                validate:null
            }
        }
        /*-------款项payment新增 : end----*/
    };
    return {
        getRuleByCondName: function (condName) {
            return _condRules[condName];
        }
    }
};
