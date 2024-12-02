$(function() {

    var customerUserRuleItem = {

        btns: {
            saveBtn: com.focusPage("#saveItemBtn", "#customerUserRuleItem").on("click", saveData)
        },

        modals: {
            addCustomerUserRuleItemModal: com.focusPage("#addCustomerUserRuleItemModal")
        },

        items: {
            name: com.focusPage("#name", "#customerUserRuleItem"),
            type: com.focusPage("#type", "#customerUserRuleItem"),
            uppval: com.focusPage("#uppval", "#customerUserRuleItem"),
            lowval: com.focusPage("#lowval", "#customerUserRuleItem"),
            priority: com.focusPage("#priority", "#customerUserRuleItem"),
            isSurplus: com.focusPage("#isSurplus", "#addCustomerUserRuleItemModal"),
            isDelete: com.focusPage("#isDelete", "#addCustomerUserRuleItemModal"),
            status: com.focusPage("#status", "#customerUserRuleItem"),
        },

        getProp: {
            "0": true,
            "1": false,
            "true": 0,
            "false": 1
        },
    };

    customerUserRuleItem.items.type.bindData(constant.customer().customerUserRuleItem.type.datas, "key", "value");
    customerUserRuleItem.items.status.bindData(constant.customer().customerUserRuleItem.status.datas, "key", "value");
    customerUserRuleItem.items.priority.bindData(constant.customer().customerUserRuleItem.priority.datas, "key", "value");
    customerUserRuleItem.items.isSurplus.bindData(constant.customer().customerUserRuleItem.isSurplus.datas, "key", "value");
    customerUserRuleItem.items.isDelete.bindData(constant.customer().customerUserRuleItem.isDelete.datas, "key", "value");

    customerUserRuleItem.modals.addCustomerUserRuleItemModal.on("hide.bs.modal", function(a) {

        com.cleanItems(customerUserRuleItem.items);
        com.clearValidator();
    });

    var searcher = new Searcher();

    searcher.base("condListCustomerUserRuleItem", "pagenationCustomerUserRuleItem", "resultListCustomerUserRuleItem", api.customer.queryCustomerUserRuleItem);

    searcher.param({
        "customerUserRuleItem.curid": params.customer.curid
    });

    searcher.result("customerUserRuleItems").isPage(true);

    searcher.button([{
        id: "addCustomerUserRuleItem",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    searcher.history("addCustomerUserRuleItemPostData");

    var lineprops = [{
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerUserRuleItem.type.keys
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
        fieId: "priority",
        name: "优先级",
        prop: "priority",
        clazz: "red",
        dataset: constant.customer().customerUserRuleItem.priority.keys
    }, {
        fieId: "isSurplus",
        name: "是否减剩余数",
        prop: "isSurplus",
        clazz: "red",
        dataset: constant.customer().customerUserRuleItem.isSurplus.keys
    }, {
        fieId: "isDelete",
        name: "是否删除",
        prop: "isDelete",
        clazz: "red",
        dataset: constant.customer().customerUserRuleItem.isDelete.keys
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerUserRuleItem.status.keys
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.customer.deleteCustomerUserRuleItem, {
                "customerUserRuleItem.curiid": v.curiid
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#resultListCustomerUserRuleItem").find("div.action-buttons").find("a.btn-yellow").hide();

    com.focusPage('#addCustomerUserRuleItem', '#pagenationCustomerUserRuleItem').on("click", function() {

        customerUserRuleItem.modals.addCustomerUserRuleItemModal.modal("show");
    });

    function saveData(v) {

        if (com.validate('addCustomerUserRuleItemModal'))
            return false;

        var url = api.customer.addCustomerUserRuleItem;
        var options = {
            "customerUserRuleItem.curid": params.customer.curid,
            "customerUserRuleItem.name": customerUserRuleItem.items.name.val(),
            "customerUserRuleItem.type": customerUserRuleItem.items.type.val(),
            "customerUserRuleItem.uppval": customerUserRuleItem.items.uppval.val(),
            "customerUserRuleItem.priority": customerUserRuleItem.items.priority.val(),
            "customerUserRuleItem.status": customerUserRuleItem.items.status.val(),
            "customerUserRuleItem.isSurplus": customerUserRuleItem.getProp[customerUserRuleItem.items.isSurplus.prop("checked")],
            "customerUserRuleItem.isDelete": customerUserRuleItem.getProp[customerUserRuleItem.items.isDelete.prop("checked")]

        };

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            customerUserRuleItem.modals.addCustomerUserRuleItemModal.modal("hide");
        });

    }

});
