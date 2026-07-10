$(function() {

    var customerProtectRule = {
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addCustomerProtectRuleModal: com.focusPage("#addCustomerProtectRuleModal")
        },

        items: {
            title: com.focusPage("#title", "#customerProtectRule"),
            type: com.focusPage("#type", "#customerProtectRule"),
            uppval: com.focusPage("#uppval", "#customerProtectRule"),
            lowval: com.focusPage("#lowval", "#customerProtectRule"),
            duty: com.focusPage("#duty", "#customerProtectRule"),
            days: com.focusPage("#days", "#customerProtectRule")
        }
    };

    customerProtectRule.modals.addCustomerProtectRuleModal.on("hide.bs.modal", function(a) {

        com.cleanItems(customerProtectRule.items);
        com.clearValidator();
    });

    customerProtectRule.items.type.bindData(constant.customer().customerProtectRule.type.datas, "key", "value");

    // 加载岗位数据
    com.post(api.personel.queryDutyForOption, {}, function(res) {
        customerProtectRule.items.duty.bindData(res.duties, "did", "name");
    });

    customerProtectRule.items.type.on("change", function() {

        var type = parseInt(customerProtectRule.items.type.val());

        // 根据类型控制控件显示
        // type = 0(面积), 1(预付款), 2(设计费), 3(定金): 显示起始值/终止值，隐藏岗位
        // type = 4(岗位): 隐藏起始值/终止值，显示岗位
        if (type <= 3) {
            com.focusPage("#uppvalDiv").removeClass("hide");
            com.focusPage("#lowvalDiv").removeClass("hide");
            com.focusPage("#dutyDiv").addClass("hide");
        } else {
            com.focusPage("#uppvalDiv").addClass("hide");
            com.focusPage("#lowvalDiv").addClass("hide");
            com.focusPage("#dutyDiv").removeClass("hide");
        }
    });

    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("customerProtectRule");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageCustomerProtectRule);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-customerProtectRule-type", "customer-customerProtectRule-uppval", "customer-customerProtectRule-lowval", "customer-customerProtectRule-status"]);
    searcher.history("customerProtectRulePostData");

    searcher.button([{
        id: "addCustomerProtectRule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "type": {
            fieId: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.customer().customerProtectRule.type.keys
        },
        "uppval": {
            fieId: "uppval",
            name: "起始值",
            prop: "uppval",
            clazz: "blue"
        },
        "lowval": {
            fieId: "lowval",
            name: "终止值",
            prop: "lowval",
            clazz: "blue"
        },
        "duty": {
            fieId: "duty",
            name: "岗位",
            prop: "duty.name",
            clazz: "purple"
        },
        "days": {
            fieId: "days",
            name: "天数",
            prop: "days",
            clazz: "blue"
        },
        "creater": {
            fieId: "creater",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        },
        "createTime": {
            fieId: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.customer().customerProtectRule.status.keys
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

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确认删除当前规则吗?", function(res) {

                com.post(api.customer.deleteCustomerProtectRule, {
                    "customerProtectRule.cprid": v.cprid
                }, function(res) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            return false;
        },
        show: function() { return btnVisible("del"); }
    }];

    searcher.line("title", lineprops, linebtns).render();

    com.focusPage('#addCustomerProtectRule', '#pagenation').on("click", function() {

        // 默认显示面积类型的控件状态
        com.focusPage("#uppvalDiv").removeClass("hide");
        com.focusPage("#lowvalDiv").removeClass("hide");
        com.focusPage("#dutyDiv").addClass("hide");

        customerProtectRule.modals.addCustomerProtectRuleModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCustomerProtectRuleModal'))
            return false;

        var url = api.customer.addCustomerProtectRule;
        var options = {
            "customerProtectRule.title": customerProtectRule.items.title.val(),
            "customerProtectRule.type": customerProtectRule.items.type.val(),
            "customerProtectRule.uppval": customerProtectRule.items.uppval.val(),
            "customerProtectRule.lowval": customerProtectRule.items.lowval.val(),
            "customerProtectRule.duty.did": customerProtectRule.items.duty.val(),
            "customerProtectRule.days": customerProtectRule.items.days.val()
        };

        if (customerProtectRule.items.uppval.val() == "")
            options["customerProtectRule.uppval"] = customerProtectRule.items.lowval.val();

        com.post(url, options, function() {

            searcher.doSearch();
            customerProtectRule.modals.addCustomerProtectRuleModal.modal("hide");
        });

    }
});
