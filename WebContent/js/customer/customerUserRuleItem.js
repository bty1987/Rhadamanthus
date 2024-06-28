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
            lowval: com.focusPage("#lowval", "#customerUserRuleItem")
        },

        currentCurid: params["customerUserRule.curid"],
        types: constant.customer().customerUserRuleItem.type.keys
    };

    customerUserRuleItem.items.type.bindData(constant.customer().customerUserRuleItem.type.datas, "key", "value");

    customerUserRuleItem.modals.addCustomerUserRuleItemModal.on("hide.bs.modal", function(a) {

        com.cleanItems(customerUserRuleItem.items);
        com.clearValidator();
    });

    var searcher = new Searcher();

    searcher.base("condListCustomerUserRuleItem", "pagenationCustomerUserRuleItem", "resultListCustomerUserRuleItem", api.customer.queryCustomerUserRuleItem);

    searcher.param({"customerUserRuleItem.curid": customerUserRuleItem.currentCurid});

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
        dataset: customerUserRuleItem.types
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

    function saveData() {

        if (com.validate('addCustomerUserRuleItemModal'))
            return false;

        var url = api.customer.addCustomerUserRuleItem;
        var options = {
            "customerUserRuleItem.curid": customerUserRuleItem.currentCurid,
            "customerUserRuleItem.name": customerUserRuleItem.items.name.val(),
            "customerUserRuleItem.type": customerUserRuleItem.items.type.val(),
            "customerUserRuleItem.uppval": customerUserRuleItem.items.uppval.val(),
            "customerUserRuleItem.lowval": customerUserRuleItem.items.lowval.val()
        };

        com.post(url, options, function() {

            searcher.doSearch();
            customerUserRuleItem.modals.addCustomerUserRuleItemModal.modal("hide");
        });
    }

});
