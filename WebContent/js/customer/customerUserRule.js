$(function() {

    var customerUserRule = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addCustomerUserRuleModal: com.focusPage("#addCustomerUserRuleModal")
        },

        items: {
            user: com.focusPage("#user", "#customerUserRule"),
            period: com.focusPage("#period", "#customerUserRule"),
            measureNum: com.focusPage("#measureNum", "#customerUserRule"),
            contractNum: com.focusPage("#contractNum", "#customerUserRule"),
            contractPrice: com.focusPage("#contractPrice", "#customerUserRule"),
            materialPrice: com.focusPage("#materialPrice", "#customerUserRule"),
            designPrice: com.focusPage("#designPrice", "#customerUserRule")
        },

        currentCurid: null,
        status: constant.customer().customerUserRule.status.keys
    };

    customerUserRule.modals.addCustomerUserRuleModal.on("hide.bs.modal", function(a) {

        com.cleanItems(customerUserRule.items);
        com.clearValidator();

        customerUserRule.items.user.removeAttr("disabled");
        customerUserRule.currentCurid = null;
    });

    com.initTypeahead('user', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerUserRule);

    searcher.condition(["customer-customerUserRule-user", "customer-customerUserRule-creater", "customer-customerUserRule-createTime", "customer-customerUserRule-finishTime", "customer-customerUserRule-status"]);

    searcher.button([{
        id: "addCustomerUserRule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }, {
        id: "import",
        name: "批量导入",
        clazz: "btn-info",
        icon: "icon-upload"
    }, {
        id: "update",
        name: "失效",
        clazz: "btn-danger",
        icon: "icon-ban-circle"
    }]);

    searcher.history("addCustomerUserRulePostData");

    var lineprops = [{
        fieId: "period",
        name: "周期",
        prop: "period",
        clazz: "grey"
    }, {
        fieId: "measureNum",
        name: "量尺数",
        prop: "measureNum",
        clazz: "blue"
    }, {
        fieId: "contractNum",
        name: "签单数",
        prop: "contractNum",
        clazz: "blue"
    }, {
        fieId: "contractPrice",
        name: "签单额",
        prop: "contractPrice",
        clazz: "blue"
    }, {
        fieId: "materialPrice",
        name: "主材额",
        prop: "materialPrice",
        clazz: "blue"
    }, {
        fieId: "designPrice",
        name: "设计费",
        prop: "designPrice",
        clazz: "blue"
    }, {
        fieId: "score",
        name: "得分",
        prop: "score",
        clazz: "blue"
    }, {
        fieId: "rank",
        name: "排名",
        prop: "rank",
        clazz: "blue"
    }, {
        fieId: "chance",
        name: "机会数",
        prop: "chance",
        clazz: "blue"
    }, {
        fieId: "surplus",
        name: "剩余数",
        prop: "surplus",
        clazz: "blue"
    }, {
        fieId: "polling",
        name: "轮询数",
        prop: "polling",
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
        fieId: "finishTime",
        name: "结束时间",
        prop: "finishTime",
        clazz: "green",
        show: function(v) {

            return v.finishTime = com.checkNull(v.finishTime, "无");
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: customerUserRule.status
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            customerUserRule.currentCurid = v.curid;

            customerUserRule.items.user.val(v.user.currentName);
            customerUserRule.items.period.val(v.period);
            customerUserRule.items.measureNum.val(v.measureNum);
            customerUserRule.items.contractNum.val(v.contractNum);
            customerUserRule.items.contractPrice.val(v.contractPrice);
            customerUserRule.items.materialPrice.val(v.materialPrice);
            customerUserRule.items.designPrice.val(v.designPrice);

            customerUserRule.items.user.attr("disabled", "disabled");

            customerUserRule.modals.addCustomerUserRuleModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {
            if (v.status == 2) {
                com.showAlert(com.warning, "状态不可操作.");
                return false;
            }

            com.post(api.customer.updateCustomerUserRuleForStatus, {
                "customerUserRule.curid": v.curid,
                "customerUserRule.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("user.currentName", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();

    com.focusPage('#addCustomerUserRule', '#pagenation').on("click", function() {

        customerUserRule.modals.addCustomerUserRuleModal.modal("show");
    });

    com.focusPage('#import', '#pagenation').on("click", function() { // 导入数据

    });

    com.focusPage('#update', '#pagenation').on("click", function() {

        com.showConfirm("确认将当前所有人员规则置为失效?", function(result) {

            com.post(api.customer.disableCustomerUserRule, {}, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "已完成.")
            });
        })
    });

    function saveData() {

        if (com.validate('addCustomerUserRuleModal'))
            return false;

        var url = api.customer.addCustomerUserRule;
        var options = {
            "customerUserRule.user.userId": com.typeahead("user"),
            "customerUserRule.period": customerUserRule.items.period.val(),
            "customerUserRule.measureNum": customerUserRule.items.measureNum.val(),
            "customerUserRule.contractNum": customerUserRule.items.contractNum.val(),
            "customerUserRule.contractPrice": customerUserRule.items.contractPrice.val(),
            "customerUserRule.materialPrice": customerUserRule.items.materialPrice.val(),
            "customerUserRule.designPrice": customerUserRule.items.designPrice.val()
        };

        if (customerUserRule.currentCurid != null) {
            url = api.customer.updateCustomerUserRule;
            options["customerUserRule.curid"] = customerUserRule.currentCurid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            customerUserRule.modals.addCustomerUserRuleModal.modal("hide");
        });
    }

});
