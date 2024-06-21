jQuery(function ($) {

    var customerDeptRule = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },
        modals: {
            customerDeptRuleModal: com.focusPage("#customerDeptRuleModal")
        },
        items: {
            deptTypeSel: com.focusPage("#deptTypeSel", "#customerDeptRuleModal"),
            deptSel: com.focusPage("#deptSel", "#customerDeptRuleModal"),
            atttype: com.focusPage("#atttype", "#customerDeptRuleModal"),
            busitype: com.focusPage("#busitype", "#customerDeptRuleModal"),
        },
        deptType: [],
    };

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        customerDeptRule.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name");
    }, null, false);

    customerDeptRule.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            customerDeptRule.items.deptSel.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");
    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        customerDeptRule.items.busitype.bindData(res.decorationBusitypes, 'dbid', 'name');
    });

    customerDeptRule.items.atttype.bindData(constant.customer().customerDeptRule.atttype.datas, "key", "value");

    customerDeptRule.modals.customerDeptRuleModal.on('hide.bs.modal', function(e) {

        com.cleanItems(customerDeptRule.items);
        com.closeTip();
    });
    var searcher = new Searcher();

    var url = api.customer.pageCustomerDeptRule;

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(['customer-customerDeptRule-name', 'customer-customerDeptRule-type', 'customer-customerDeptRule-atttype']);
    searcher.history("customerDeptRulePostData");

    searcher.button([{
        id: "addCustomerDeptRule",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);
    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    },{
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerDeptRule.type.keys
    }, {
        field: "atttype",
        name: "类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.customer().customerDeptRule.atttype.keys,
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "busitype.name",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }];
    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function (v) {
            remove(v.cdrid);
        },
    },];
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addCustomerDeptRule', '#pagenation').on("click", function() {

        customerDeptRule.modals.customerDeptRuleModal.modal("show");
    });

    function remove(cdrid) {

        var options = {
            "customerDeptRule.cdrid": cdrid,
        };
        com.post(api.customer.deleteCustomerDeptRule, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }
    function saveData() {

        if (com.validate('customerDeptRuleModal'))
            return false;

        var url = api.customer.addcustomerDeptRule;

        var options = {
            "customerDeptRule.atttype": customerDeptRule.items.atttype.val(),
            "customerDeptRule.department.did": customerDeptRule.items.deptSel.val(),
            "customerDeptRule.busitype.dbid": customerDeptRule.items.busitype.val(),
        };
        com.post(url, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            customerDeptRule.modals.customerDeptRuleModal.modal("hide");
        });

    }
});
