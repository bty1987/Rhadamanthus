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
            value: com.focusPage("#value", "#customerProtectRule"),
            days: com.focusPage("#days", "#customerProtectRule")
        }
    };

    customerProtectRule.modals.addCustomerProtectRuleModal.on("hide.bs.modal", function(a) {
        com.cleanItems(customerProtectRule.items);
        com.clearValidator();
    });

    customerProtectRule.items.type.bindData(constant.customer().customerProtectRule.type.datas, "key", "value");

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerProtectRule);
    searcher.condition(["customer-customerProtectRule-type", "customer-customerProtectRule-value", "customer-customerProtectRule-status"]);
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
        fieId: "value",
        name: "数值",
        prop: "value",
        clazz: "blue"
    }, {
        fieId: "days",
        name: "天数",
        prop: "days",
        clazz: "green"
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
                com.post(api.customer.deleteCustomerProtectRule, {"customerProtectRule.cprid": v.cprid}, function(res) {
                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            return false;
        }
    }];

    searcher.line("title", lineprops, linebtns).render();

    com.focusPage('#addCustomerProtectRule', '#pagenation').on("click", function() {

        customerProtectRule.modals.addCustomerProtectRuleModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCustomerProtectRuleModal'))
            return false;

        var url = api.customer.addCustomerProtectRule;
        var options = {
            "customerProtectRule.title": customerProtectRule.items.title.val(),
            "customerProtectRule.type": customerProtectRule.items.type.val(),
            "customerProtectRule.value": customerProtectRule.items.value.val(),
            "customerProtectRule.days": customerProtectRule.items.days.val()
        };

        com.post(url, options, function () {
            searcher.doSearch();
            customerProtectRule.modals.addCustomerProtectRuleModal.modal("hide");
        });

    }
});
