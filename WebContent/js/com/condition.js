/**
 * 存放查询条件的js,定义全项目的查询条件
 */

var Condition = function(api) {

    var _condRules = {

        // autofill
        "demo-designer": {
            label: "设计师",// 中文名
            type: "autofill",// 类型
            submitConfig: {// 向后台提交的配置
                name: "designerId",// 接口中的参数名
                op: "eq",// 查询方式
                validate: null
            // 校验规则
            },
            dataSource: {// 从后台取数据的各种配置
                url: api.personel.queryUserByPinyin,// 获取数据要调用的接口
                postData: {
                    "user.status": 3,
                    "departmentType.name": ""
                },// 获取数据时的请求参数
                listPath: "autoFillKeyValue",// 响应list的json路径
                keyPath: "key",// 用来向后台提交的字段的json路径
                valuePath: "value"// 用来在页面显示的字段的json路径
            }
        },
        // text
        "demo-orderId": {
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
        // select
        "demo-design-region": {
            label: "设计中心",
            type: "selectCaching",
            submitConfig: {
                name: "designerRegionId",
                op: "eq",
                validate: null
            },
            dataSource: {// 从后台取数据的各种配置
                url: api.communion.queryDepartment,
                postData: {
                    "dept.type.name": "设计大区"
                },
                listPath: "deptList",
                keyPath: "no",
                valuePath: "name"
            }
        },
        // timeRange
        "demo-confirmTime": {
            label: "补款时间",
            type: "datePicker",
            submitConfig: {
                name: "fullpayTime",
                op: "between",
                validata: null
            }
        },
        // timeRange
        "demo-createTime": {
            label: "创建时间",
            type: "dateRangePicker",
            submitConfig: {
                name: "createTime",
                op: "cn",
                validate: null
            }
        },

    };

    var fillCondition = function(url) {

        if (parent.window.isPC && parent.window.isEncryption) {
            url = url.substring(0, url.lastIndexOf('.')) + '.bin';
            require('nw.gui').Window.get().evalNWBin(null, url);
        } else {
            $.ajax({
                url: url,
                cache: false,
                type: 'get',
                dataType: 'script',
                async: false
            });
        }
    };

    return {
        init: function(path) {

            window.console && window.console.log && console.log("%cCondition Config Ready 条件配置就绪", "color:#0a0; font-size:1em");

            var dtd = $.Deferred();

            fillCondition(path + 'approval.js');
            fillCondition(path + 'balance.js');
            fillCondition(path + 'building.js');
            fillCondition(path + 'customer.js');
            fillCondition(path + 'construction.js');
            fillCondition(path + 'data.js');
            fillCondition(path + 'decoration.js');
            fillCondition(path + 'information.js');
            fillCondition(path + 'inventory.js');
            fillCondition(path + 'logger.js');
            fillCondition(path + 'market.js');
            fillCondition(path + 'material.js');
            fillCondition(path + 'payment.js');
            fillCondition(path + 'personel.js');
            fillCondition(path + 'production.js');
            fillCondition(path + 'quotation.js');
            fillCondition(path + 'report.js');
            fillCondition(path + 'salary.js');
            fillCondition(path + 'sales.js');
            fillCondition(path + 'store.js');
            fillCondition(path + 'system.js');

            return dtd.promise();
        },
        getRuleByCondName: function(condName) {

            return _condRules[condName];
        },
        addupRule: function(module, conditions) {

            $.each(conditions, function(k, v) {

                var _key = module + "-" + k;

                if (_condRules[_key])
                    return true;

                _condRules[_key] = v;
            });
        }
    };
};
