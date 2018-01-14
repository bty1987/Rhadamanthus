/**
 * 存放查询条件的js,定义全项目的查询条件
 */

var Condition = function (api) {

    var _condRules = {

        //例子 autofill
        designer: {
            label: "设计师",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "designer",//接口中的参数名
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty":""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        //text
        orderId: {
            label: "订单编号",
            type: "text",
            submitConfig: {
                name: "orderId",
                op: "eq",
                validate: {
                    "reg": /^[0-9]*$/,
                    "msg": "请输入数字"
                }
            }
        },
        //select
        designerRegionId: {
            label: "设计中心",
            type: "select",
            submitConfig: {
                name: "designerRegionId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.department.queryDepartment,
                postData: {"dept.type.name": "设计大区"},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
            }
        },
        //timeRange
        createTimeDateRange: {
            label: "量尺时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTimeDateRange",
                op: "cn",
                validate: null
            }
        },
        //-------订单-施工进度-工程验收
        acceptanceFlag: {
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
        //-------订单-施工进度-监理控制查询条件
        schedule: {
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
        projectStatusFlag: {
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
        //-------订单-施工进度-巡检控制查询条件
        supervisor: {
            label: "监理",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "supervisor",//接口中的参数名
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": "监理"},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        //-------订单-施工进度-质检控制查询条件
        allocationWorkerFlag: {
            label: "分配状态",
            type: "select",
            submitConfig: {
                name: "allocationWorkerFlag",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: null,
                postData: null,
                listPath: [
                    {key: "notAllocationed", value: "未分配工人"},
                    {key: "allocationed", value: "已分配工人"}
                ],
                keyPath: "key",
                valuePath: "value"
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
                name: "regionName",
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
                name: "cityName",
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
                name: "cityProperName",
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
                listPath: "regionList",
                keyPath: "regionId",
                valuePath: "regionName"
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
                listPath: "cityList",
                keyPath: "cityId",
                valuePath: "cityName"
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
                name: "activityName", // 接口中的参数名
                op: "cn", // 查询方式
                validate: null // 校验规则
            }
        },
        activityStatus: {
            label: "类型", //中文名
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
            type: "autofill",
            submitConfig: {
                name: "villageName",
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
        cityId: {
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
                listPath: "cityList",
                keyPath: "cityId",
                valuePath: "cityName"
            }
        },
        cityProperId: null,
        //---------数据-主材-型号 页面的各种查询条件
        materialModelNo: { //
            label: "编号",
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
                url: api.personel.queryUserForNameByPinyinName,
                postData: {"duty": "驻店导购"},
                listPath: "autoFillKeyValue",
                keyPath: "key",
                valuePath: "value"
            }
        },
        categoryId: {
            label: "品类",
            type: "select",
            submitConfig: {
                name: "categoryId",
                op: "eq",
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
        categoryName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "categoryName",
                op: "eq",
                validate: null
            }
        },
        brandName: {
            label: "名称",
            type: "text",
            submitConfig: {
                name: "brandName",
                op: "cn",
                validate: null
            }
        },
        materialBrandName: {
            label: "品牌",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "materialBrandName",//接口中的参数名
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
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
                url: api.personel.queryUserForNameByPinyinName,
                postData: {},
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
                url: api.personel.queryUserForNameByPinyinName,
                postData: {},
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
                op: "cn",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserForNameByPinyinName,
                postData: {},
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
                keyPath: "roleId",
                valuePath: "roleName"
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
                url: api.department.queryDepartmentType,
                postData: {},
                listPath: "departmentTypes",
                keyPath: "dtid",
                valuePath: "name"
            }
        },
        deptId: {
            label: "部门",
            type: "select",
            submitConfig: {
                name: "deptId",
                op: "eq",
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.department.queryDepartment,
                postData: {},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
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
                keyPath: null,
                valuePath: null
            }
        },
        //装修订单-设计 页面的各种查询条件
        village: {
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "village",
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
                    "reg": /^[0-9]*$/,
                    "msg": "请输入数字"
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
                op: "cn",
                validate: {
                    "reg": /^[0-9]*$/,
                    "msg": "请输入数字"
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
        salesman: {
            label: "业务员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "salesman",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": ""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
		quoter: {
            label: "报价员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "quoter",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": ""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
		escorter: {
            label: "跟单员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "escorter",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": ""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        designerDepartmentId: {
            label: "设计部",
            type: "select",
            submitConfig: {
                name: "designerDepartmentId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.department.queryDepartment,
                postData: {"dept.type.name": "设计部"},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
            }
        },
        salesmanRegionId: {
            label: "业务中心",
            type: "select",
            submitConfig: {
                name: "salesmanRegionId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.department.queryDepartment,
                postData: {"dept.type.name": "业务大区"},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
            }
        },
        salesmanDepartmentId: {
            label: "业务部",
            type: "select",
            submitConfig: {
                name: "salesmanDepartmentId",
                op: "eq",
                validate: null
            },
            dataSource: {
                url: api.department.queryDepartment,
                postData: {},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
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
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": "预算审核专员"},//获取数据时的请求参数
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
                name: "msoNo",
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
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty": ""},//获取数据时的请求参数
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
                url: api.personel.queryUserForNameByPinyinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
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
        // 放线
        actualDate: {
            label: "放线时间",
            type: "datePicker",
            submitConfig: {
                name: "actualDate",
                op: "between",
                validate: null
            }
        }, drawLineStatus: {
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
                    {"key": "申请放线", "value": "申请放线"},
                    {"key": "放线失败", "value": "放线失败"},
                    {"key": "放线成功", "value": "放线成功"}
                ],
                keyPath: "key",
                valuePath: "value"
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
                op: "cn",
                validate: null
            },
            dataSource: {
                url: api.personel.queryUserForNameByPinyinName,
                postData: {},
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
                    {key: "2", value: "驳回"}
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
        }, createVipTime: {
            label: "创建时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },


        //jinxiaocun
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

        storehouseNumber: {
            label: "编号",
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
            label: "货单编号",
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
            type: "text",
            submitConfig: {
                name: "purchaseUserName",
                op: "cn",
                validate: null
            }
        },
        purchaseNo: {
            label: "编号",
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
            type: "text",
            submitConfig: {
                name: "createrName",
                op: "cn",
                validate: null
            }
        },
        approverName: {
            label: "审批人",
            type: "text",
            submitConfig: {
                name: "approverName",
                op: "cn",
                validate: null
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

        no : {
            label:"销售单号",
            type:"text",
            submitConfig : {
                name : "no",
                op : "eq",
                validate:{
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
                }
            }
        },

        instorerId : {
            label: "驻店员",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "currentName",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: {"duty" : "驻店导购"},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },

        salesmanId : {
            label: "渠道",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "userName",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: { "duty" : ""},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
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
            label:"订单编号",
            type:"text",
            submitConfig : {
                name : "sid",
                op : "eq",
                validate:{
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
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
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
                }
            }
        },
        salesPaymentUserName : {
            label: "设计师",
            type: "autofill",
            submitConfig: {//向后台提交的配置
                name: "userName",//接口中的参数名
                op: "cn",//查询方式
                validate: null
            },
            dataSource: {//从后台取数据的各种配置
                url: api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData: { "duty" : ""},//获取数据时的请求参数
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
        salesReceiptCollectTime:{
            label:"收款时间",
            type:"datePicker",
            submitConfig:{
                name:"collectTime",
                op:"between",
                validate:null
            }
        },
        salesReceiptConfirmTime:{
            label:"确认时间",
            type:"datePicker",
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
                url : api.personel.queryUserForNameByPinyinName,
                postData:{},
                listPath: "autoFillKeyValue",
                keyPath:"key",
                valuePath:"value"
            }
        },

        salesDeptName: {
            label: "部门",
            type: "select",
            submitConfig: {
                name: "dept.deptName",
                op: "eq",
                validate: null
            },
            dataSource: {// 从后台取数据的各种配置
                url: api.department.queryDepartment,
                postData: {},
                listPath: "deptList",
                keyPath: "deptName",
                valuePath: "deptName"
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
        salesBalanceOrderId:{
            label: "订单编号",
            type: "text",
            submitConfig: {
                name: "sales.orderId",
                op: "eq",
                validata: null
            }
        },
        salesBalanceNo:{
            label: "销售单号",
            type: "text",
            submitConfig: {
                name: "sales.no",
                op: "eq",
                validata: null
            }
        },
        salesBalanceBrand:{
            label: "品牌",//中文名
            type: "autofill",//类型
            submitConfig: {//向后台提交的配置
                name: "sales.brand",//接口中的参数名
                op: "cn",//查询方式
                validate: null//校验规则
            },
            dataSource: {//从后台取数据的各种配置
                url: api.data.queryBrandForPinYinName,//获取数据要调用的接口
                postData: {},//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath: "key",//用来向后台提交的字段的json路径
                valuePath: "value"//用来在页面显示的字段的json路径
            }
        },
        salesBalanceVillage:{
            label: "楼盘",
            type: "autofill",
            submitConfig: {
                name: "village.villageName",
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
        salesBalanceRegion:{
            label: "大区名称",
            type: "text",
            submitConfig: {
                name: "region.deptName",
                op: "cn",
                validata: null
            }
        },
        salesBalanceDept:{
            label: "归属部门",
            type: "text",
            submitConfig: {
                name: "dept.deptName",
                op: "cn",
                validata: null
            }
        },
        salesBalanceStatus:{
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
        salesBalanceType:{
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
        salesBalanceFullpayTime:{
            label: "补款时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "sales.fullpayTime",
                op: "between",
                validate: null
            }
        },
        salesBalanceCreateTime:{
            label: "预结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "between",
                validate: null
            }
        },
        salesBalanceVenderTime:{
            label: "厂商结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "venderTime",
                op: "between",
                validate: null
            }
        },
        salesBalancePostTiem:{
            label: "结算时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "postTime",
                op: "between",
                validate: null
            }
        },
		
		quoteItemName:{
            label: "报价名称",
            type: "text",
            submitConfig:{
                name : "name",
                op: "cn",
                validata: null
            }
        },

        quotetype: {
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
        WorkplanName: {
            label: "工序组名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        workflowName : {
            label : "工序名称",
            type : "autofill",
            submitConfig : {
                name : "name",
                op : "eq",
                validate: null
            }
        },
        workshopName: {
            label: "车间名称",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validate: null
            }
        },
        startTime:{
            label:"投料时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"startTime",
                op:"between",
                validate:null
            }
        },
        endTime:{
            label:"出货时间",
            type:"dateRangePicker",
            submitConfig:{
                name:"endTime",
                op:"between",
                validate:null
            }
        },
        productionPlanStatus:{
            label: "状态",
            type: "select",
            submitConfig: {
                name: "status",
                op: "eq",
                validate: null
            },
            dataSource : {
                url : null,
                postData : null,
                listPath : [
                    {key: 0, value: "初始"},
					{key: 3, value: "生产中"},
                    {key: 1, value: "入库"},
                    {key: 2, value: "送货"}
                ],
                keyPath:"key",
                valuePath:"value"
            }
        },

        quoteTypeName: {
            label: "报价类型",
            type: "text",
            submitConfig: {
                name: "name",
                op: "cn",
                validata: null
            },
        },

        orderId : {
            label:"订单编号",
            type:"text",
            submitConfig : {
                name : "orderId",
                op : "eq",
                validate:{
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
                }
            },
        },

        productionStatus:{
            label: "状态",
            type: "select",
            submitConfig: {
                name: "status",
                op: "eq",
                validate: null
            },
            dataSource : {
                url : null,
                postData : null,
                listPath : [
                    {key: 0, value: "初始"},
                    {key: 1, value: "签约"},
                    {key: 2, value: "已审核"},
                    {key: 3, value: "生产"},
                    {key: 4, value: "废单"},
                    {key: 5, value: "完结"}
                ],
                keyPath:"key",
                valuePath:"value"
            }
        },

        productionPNo:{
            label: "生产单编号",
            type: "text",
            submitConfig: {
                name: "pno",
                op: "eq",
                validate: null}
        },




    };
    return {
        getRuleByCondName: function (condName) {
            return _condRules[condName];
        }
    }
};
