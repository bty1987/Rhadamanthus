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

        if (customerProtectRule.items.type.val() == 0) {
            com.focusPage("#uppvalDiv").removeClass("hide");
        } else {
            com.focusPage("#uppvalDiv").addClass("hide");
        }
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerProtectRule);
    searcher.condition(["customer-customerProtectRule-type", "customer-customerProtectRule-uppval", "customer-customerProtectRule-lowval", "customer-customerProtectRule-status"]);
    searcher.history("customerProtectRulePostData");

    searcher.button([{
        id: "addCustomerProtectRule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerProtectRule.type.keys
    }, {
        fieId: "uppval",
        name: "起始值",
        prop: "uppval",
        clazz: "blue"
    }, {
        fieId: "lowval",
        name: "终止值",
        prop: "lowval",
        clazz: "blue"
    }, {
        fieId: "duty",
        name: "岗位",
        prop: "duty.name",
        clazz: "purple"
    }, {
        fieId: "days",
        name: "天数",
        prop: "days",
        clazz: "blue"
    }, {
        fieId: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerProtectRule.status.keys
    }];

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
        }
    }];

    searcher.line("title", lineprops, linebtns).render();

    com.focusPage('#addCustomerProtectRule', '#pagenation').on("click", function() {

        com.focusPage("#uppvalDiv").removeClass("hide");
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
