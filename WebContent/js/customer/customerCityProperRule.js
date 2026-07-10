$(function() {

    var customerCityProperRule = {

        modals: {
            customerCityProperRuleModal: com.focusPage("#customerCityProperRuleModal")
        },

        items: {
            type: com.focusPage("#type", "#customerCityProperRuleModal"),
            company: com.focusPage("#company", "#customerCityProperRuleModal"),
            citySel: com.focusPage("#citySel", "#customerCityProperRuleModal"),
            cityProperSel: com.focusPage("#cityProperSel", "#customerCityProperRuleModal"),
            busitypeSel: com.focusPage("#busitypeSel", "#customerCityProperRuleModal"),
            targetCompany: com.focusPage("#targetCompany", "#customerCityProperRuleModal"),
            deptSel: com.focusPage("#deptSel", "#customerCityProperRuleModal"),
            userSel: com.focusPage("#userSel", "#customerCityProperRuleModal"),
            priority: com.focusPage("#priority", "#customerCityProperRuleModal"),
            status: com.focusPage("#status", "#customerCityProperRuleModal"),
            comment: com.focusPage("#comment", "#customerCityProperRuleModal")
        }
    };

    // 规则类型常量
    var TYPE_COMPANY_INT = 0; // 城区→公司
    var TYPE_DEPT_INT = 1; // 城区→部门
    var TYPE_USER_INT = 2; // 城区→设计师

    // 绑定类型下拉框
    customerCityProperRule.items.type.bindData([{
        key: TYPE_COMPANY_INT,
        value: "城区→公司"
    }, {
        key: TYPE_DEPT_INT,
        value: "城区→部门"
    }, {
        key: TYPE_USER_INT,
        value: "城区→设计师"
    }], "key", "value", true);

    // 绑定状态下拉框
    customerCityProperRule.items.status.bindData([{
        key: 0,
        value: "启用"
    }, {
        key: 1,
        value: "禁用"
    }], "key", "value", true);

    // 初始化加载公司列表
    com.post(api.system.queryCompany, {
        "company.atttype": "1"
    }, function(res) {

        customerCityProperRule.items.company.bindData(res.companys, "cid", "name", true);
        customerCityProperRule.items.targetCompany.bindData(res.companys, "cid", "name", true);
    }, null, false);

    // 初始化加载业务类型列表
    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        customerCityProperRule.items.busitypeSel.bindData(res.decorationBusitypes, "dbid", "name", true);
    }, null, false);

    // 初始化加载城市列表
    com.post(api.system.queryCity, {}, function(res) {

        customerCityProperRule.items.citySel.bindData(res.citys, "cid", "name", true);
    }, null, false);

    // 监听城市选择变化，加载对应城区列表
    customerCityProperRule.items.citySel.on("change", function() {

        var cityId = $(this).val();
        customerCityProperRule.items.cityProperSel.html('<option value="">请选择城区</option>');

        if (cityId) {
            com.post(api.system.queryCityProperByCid, {
                "cityProper.city.cid": cityId
            }, function(res) {

                customerCityProperRule.items.cityProperSel.bindData(res.cityPropers, "cpid", "name", true);
            });
        }
    });

    // 初始化加载部门列表
    com.post(api.communion.queryDepartmentType, {}, function(res) {

        // 部门类型列表（如需要）
    }, null, false);

    // 类型切换事件
    customerCityProperRule.items.type.change(function() {

        var type = parseInt($(this).val());

        // 隐藏所有特定字段
        com.focusPage(".targetCompanyGroup", "#customerCityProperRuleModal").hide();
        com.focusPage(".deptGroup", "#customerCityProperRuleModal").hide();
        com.focusPage(".userGroup", "#customerCityProperRuleModal").hide();

        // 根据类型显示对应字段
        if (type === TYPE_COMPANY_INT) {
            // 城区→公司：显示目标公司
            com.focusPage(".targetCompanyGroup", "#customerCityProperRuleModal").show();
        } else if (type === TYPE_DEPT_INT) {
            // 城区→部门：显示部门
            com.focusPage(".deptGroup", "#customerCityProperRuleModal").show();
        } else if (type === TYPE_USER_INT) {
            // 城区→设计师：显示设计师
            com.focusPage(".userGroup", "#customerCityProperRuleModal").show();
        }
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("customerCityProperRule");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 初始化搜索器
    var searcher = new Searcher();
    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageCustomerCityProperRule);
    searcher.result("customerCityProperRules");
    searcher.button([{
        id: "addCustomerCityProperRule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);
    searcher.history("addCustomerCityProperRulePostData");
    // 配置查询条件
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-customerCityProperRule-type", "customer-customerCityProperRule-status", "customer-customerCityProperRule-city"]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "type": {
            fieId: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: {
                "0": "城区→公司",
                "1": "城区→部门",
                "2": "城区→设计师"
            }
        },
        "city": {
            fieId: "city.name",
            name: "城区",
            prop: "city.name",
            clazz: "blue"
        },
        "busitype": {
            fieId: "busitype.name",
            name: "业务类型",
            prop: "busitype.name",
            clazz: "purple"
        },
        "targetCompany": {
            fieId: "targetCompany.name",
            name: "目标公司",
            prop: "targetCompany.name",
            clazz: "grey",
            show: function(v) {

                return v.type == TYPE_COMPANY_INT;
            }
        },
        "department": {
            fieId: "department.name",
            name: "部门",
            prop: "department.name",
            clazz: "grey",
            show: function(v) {

                return v.type == TYPE_DEPT_INT;
            }
        },
        "user": {
            fieId: "user.currentName",
            name: "设计师",
            prop: "user.currentName",
            clazz: "grey",
            show: function(v) {

                return v.type == TYPE_USER_INT;
            }
        },
        "priority": {
            fieId: "priority",
            name: "优先级",
            prop: "priority",
            clazz: "red"
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: {
                "0": "启用",
                "1": "禁用"
            }
        },
        "comment": {
            fieId: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    // 列表操作按钮
    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确认删除该规则吗？", function() {

                com.post(api.customer.deleteCustomerCityProperRule, {
                    "customerCityProperRule.ccrrid": v.ccrid
                }, function(res) {

                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function() { return btnVisible("del"); }
    }];

    searcher.line("city.name", lineprops, linebtns).render();

    // 添加按钮点击事件
    com.focusPage('#addCustomerCityProperRule', '#pagenation').on("click", function() {

        // 隐藏所有特定字段
        com.focusPage(".targetCompanyGroup", "#customerCityProperRuleModal").hide();
        com.focusPage(".deptGroup", "#customerCityProperRuleModal").hide();
        com.focusPage(".userGroup", "#customerCityProperRuleModal").hide();

        // 清空表单
        com.cleanItems(customerCityProperRule.items);
        com.clearValidator();

        // 设置默认值
        customerCityProperRule.items.priority.val("0");
        customerCityProperRule.items.status.val("0");

        customerCityProperRule.modals.customerCityProperRuleModal.modal("show");
    });

    // 保存按钮点击事件
    com.focusPage("#saveBtn", "#customerCityProperRuleModal").on("click", function() {

        // 验证表单：如果验证失败，直接返回
        if (com.validate('customerCityProperRuleModal')) {
            return false;
        }

        var url = api.customer.addCustomerCityProperRule;
        var options = {
            "customerCityProperRule.city.cpid": customerCityProperRule.items.cityProperSel.val(),
            "customerCityProperRule.company.cid": customerCityProperRule.items.company.val(),
            "customerCityProperRule.type": customerCityProperRule.items.type.val(),
            "customerCityProperRule.priority": customerCityProperRule.items.priority.val(),
            "customerCityProperRule.status": customerCityProperRule.items.status.val(),
            "customerCityProperRule.comment": customerCityProperRule.items.comment.val()
        };

        // 添加业务类型（可选）
        if (customerCityProperRule.items.busitypeSel.val()) {
            options["customerCityProperRule.busitype.dbid"] = customerCityProperRule.items.busitypeSel.val();
        }

        // 根据类型添加对应字段
        var type = parseInt(customerCityProperRule.items.type.val());
        if (type === TYPE_COMPANY_INT) {
            options["customerCityProperRule.targetCompany.cid"] = customerCityProperRule.items.targetCompany.val();
        } else if (type === TYPE_DEPT_INT) {
            options["customerCityProperRule.department.did"] = customerCityProperRule.items.deptSel.val();
        } else if (type === TYPE_USER_INT) {
            options["customerCityProperRule.user.uid"] = customerCityProperRule.items.userSel.val();
        }
        
        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            // 先关闭 modal
            customerCityProperRule.modals.customerCityProperRuleModal.modal("hide");
            // 再刷新列表
            searcher.doSearch();
        });
    });

    // 取消按钮点击事件
    com.focusPage("#cancelBtn", "#customerCityProperRuleModal").on("click", function() {

        customerCityProperRule.modals.customerCityProperRuleModal.modal("hide");
    });

    // 模态框关闭事件
    customerCityProperRule.modals.customerCityProperRuleModal.on("hide.bs.modal", function() {

        com.cleanItems(customerCityProperRule.items);
        com.clearValidator();
    });

});
