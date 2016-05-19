/**
 * 存放查询条件的js，定义全项目的查询条件
 */

var Condition = function(){

    var _condRules = {
        //例子 autofill
        designer : {
            label : "设计师",//中文名
            type : "autofill",//类型
            submitConfig : {//向后台提交的配置
                name : "",//接口中的参数名
                op : "cn",//查询方式
                validate: null//校验规则
            },
            dataSource : {//从后台取数据的各种配置
                url : api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData:{ "duty" : "设计师" },//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath:"key",//用来向后台提交的字段的json路径
                valuePath:"value"//用来在页面显示的字段的json路径
            }
        },
        //text
        orderId : { //
            label:"订单编号",
            type:"text",
            submitConfig : {
                name : "",
                op : "eq",
                validate:{
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
                }
            }
        },
        //select
        designerRegionId : {
            label:"设计中心",
            type:"select",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.department.queryDepartment,
                postData:{ "dept.type" : "设计大区" },
                listPath: "deptList",
                keyPath:"deptId",
                valuePath:"deptName"
            }
        },
        //timeRange
        createTimeDateRange : {
            label:"量尺时间",
            type:"dateRangePicker",
            submitConfig : {
                name : "account.assistant.orderId",
                op : "cn",
                validate:null
            }
        },

        //人事-员工 页面的各种查询条件

        userId : { //
            label:"员工号",
            type:"text",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            }
        },
        userName : {
            label : "姓名",
            type : "autofill",
            submitConfig : {
                name : "",
                op : "cn",
                validate: null
            },
            dataSource : {
                url : api.personel.queryUserForNameByPinyinName,
                postData:{ "duty" : "设计师" },
                listPath: "autoFillKeyValue",
                keyPath:"key",
                valuePath:"value"
            }
        },
        identity : { //
            label:"身份证号",
            type:"text",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            }
        },

        roleId : {
            label:"角色",
            type:"select",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.system.queryRole,
                postData:{},
                listPath: "roleList",
                keyPath:"roleId",
                valuePath:"roleName"
            }
        },
        deptType : {
            label:"部门类型",
            type:"select",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.ds.departmentInfo,
                postData:{},
                listPath: "deptType",
                keyPath:null,
                valuePath:null
            }
        },
        deptId : {
            label:"设计中心",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.department.queryDepartment,
                postData:{"dept.type" : "all"},
                listPath: "deptList",
                keyPath: "deptId",
                valuePath: "deptName"
            }
        },
        status : {
            label:"设计中心",
            type:"select",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.ds.personInfo,
                postData:{},
                listPath: "statusType",
                keyPath:null,
                valuePath:null
            }
        },
        //装修订单-设计 页面的各种查询条件
        village : {
            label:"楼盘",
            type:"autofill",
            submitConfig : {
                name : "",
                op : "cn",
                validate:null
            },
            dataSource : {
                url : api.data.queryVillageForNameByPinyin,
                postData:{},
                listPath: "autoFillKeyValue",
                keyPath:"key",
                valuePath:"value"
            }
        },
        houseNumber : {
            label:"楼号",
            type:"text",
            submitConfig : {
                name : "",
                op : "cn",
                validate:null
            }
        },
        houseArea : {
            label:"面积",
            type:"text",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            }
        },
        customerPhone : {
            label:"客户电话",
            type:"text",
            submitConfig : {
                name : "",
                op : "cn",
                validate:{
                    "reg" : /^[0-9]*$/,
                    "msg" : "请输入数字"
                }
            }
        },
        salesman : {
            label:"业务员",
            type : "autofill",
            submitConfig : {//向后台提交的配置
                name : "account.assistant.salesman.uid",//接口中的参数名
                op : "cn",//查询方式
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.personel.queryUserForNameByDuty,//获取数据要调用的接口
                postData:{ "duty" : "业务" },//获取数据时的请求参数
                listPath: "autoFillKeyValue",//响应list的json路径
                keyPath:"key",//用来向后台提交的字段的json路径
                valuePath:"value"//用来在页面显示的字段的json路径
            }
        },

        designerDepartmentId : {
            label:"设计部",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.department.queryDepartment,
                postData:{ "dept.type" : "设计部" },
                listPath: "deptList",
                keyPath:"deptId",
                valuePath:"deptName"
            }
        },
        salesmanRegionId : {
            label:"业务中心",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.department.queryDepartment,
                postData:{ "dept.type" : "业务大区" },
                listPath: "deptList",
                keyPath:"deptId",
                valuePath:"deptName"
            }
        },
        salesmanDepartmentId : {
            label:"业务部",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.department.queryDepartment,
                postData:{ "dept.type" : "业务部" },
                listPath: "deptList",
                keyPath:"deptId",
                valuePath:"deptName"
            }
        },
        signTimeDateRange : {
            label:"签单时间",
            type:"dateRangePicker",
            submitConfig : {
                name : "account.assistant.orderId",
                op : "cn",
                validate:null
            }
        },
        houseClass : {
            label:"房屋类型",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.ds.houseInfo,
                postData:{ "timestamp": new Date().getTime()},
                listPath: "houseClass",
                keyPath:"key",
                valuePath:"value"
            }
        },
        status : {
            label:"状态",
            type:"select",
            submitConfig : {
                name : "account.assistant.salesman.uid",
                op : "eq",
                validate:null
            },
            dataSource : {
                url : api.ds.decorationInfo,
                postData:{ "timestamp": new Date().getTime() },
                listPath: "decorationOrderStatus",
                keyPath:"key",
                valuePath:"value"
            }
        },
        customerName : {
            label : "姓名",
            type : "autofill",
            submitConfig : {
                name : "",
                op : "cn",
                validate: null
            },
            dataSource : {
                url : api.data.queryCustomerForName,
                postData:{},
                listPath: "autoFileCustomer",
                keyPath:"key",
                valuePath:"value"
            }
        },
        relationshipType : {
            label:"关系客户",
            type:"select",
            submitConfig : {
                name : "",
                op : "eq",
                validate:null
            },
            dataSource : {//从后台取数据的各种配置
                url : api.ds.customerInfo,
                postData:{},
                listPath: "relationshipType",
                keyPath:"key",
                valuePath:"value"
            }
        }
    };
    return {
        getRuleByCondName:function(condName){
            return _condRules[condName];
        }
    }
}();