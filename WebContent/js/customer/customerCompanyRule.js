jQuery(function($) {

    var customerCompanyRule = {

        ccrid: null,
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            cancelBtn: com.focusPage("#cancelBtn"),
        },
        modals: {
            customerCompanyRuleModal: com.focusPage("#customerCompanyRuleModal")
        },
        items: {
            type: com.focusPage("#customerCompanyRuleType", "#customerCompanyRuleModal"),
            company: com.focusPage("#company", "#customerCompanyRuleModal"),
            deptTypeSel: com.focusPage("#deptTypeSel", "#customerCompanyRuleModal"),
            deptSel: com.focusPage("#deptSel", "#customerCompanyRuleModal"),
            uppval: com.focusPage("#customerCompanyRuleUppval", "#customerCompanyRuleModal"),
            lowval: com.focusPage("#customerCompanyRuleLowval", "#customerCompanyRuleModal")
        },
    };

    com.post(api.ds.customer, {}, function(res) {

        com.focusPage("#customerCompanyRuleType").bindData(res.companyType, "key", "value");
        customerCompanyRule.type = res.companyType.split("key", "value");
    }, null, false);

    customerCompanyRule.modals.customerCompanyRuleModal.on('show.bs.modal', function() {

        com.cleanItems(customerCompanyRule.items);
        com.clearValidator();
    });
    
    com.post(api.communion.queryDepartmentType, {}, function(res) {

        customerCompanyRule.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name");
    }, null, false);

    customerCompanyRule.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            customerCompanyRule.items.deptSel.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");

    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("customerCompanyRule");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageCustomerCompanyRule);

    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ['customer-customerCompanyRule-type', 'customer-customerCompanyRule-uppval', 'customer-customerCompanyRule-lowval']);

    searcher.button([{
        id: "addServiceNode",
        name: "添加",
        clazz: "btn-primary",
        icon: "icon-plus"
    }]);

    searcher.history("customerCompanyRuleData");

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "companyName": {
            field: "companyName",
            name: "公司",
            prop: "company.name",
            clazz: "grey",
        },
        "deptName": {
            field: "deptName",
            name: "部门",
            prop: "dept.name",
            clazz: "grey",
            show: function(v){

               return v.dept && v.dept.name;
            },
        },
        "type": {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: customerCompanyRule.type
        },
        "uppval": {
            field: "uppval",
            name: "起始值",
            prop: "uppval",
            clazz: "blue",
            dataset: customerCompanyRule.uppval
        },
        "lowval": {
            field: "lowval",
            name: "终止值",
            prop: "lowval",
            clazz: "blue",
            dataset: customerCompanyRule.lowval
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
        clazz: "btn-warning",
        handle: function(v) {

            remove(v.ccrid);
        },
        show: function() { return btnVisible("del"); }
    }, ];

    searcher.line(function(v){
        return customerCompanyRule.type[v.type] + " " + (v.company ? v.company.name : "") + " " + (v.dept && v.dept.name ? v.dept.name : " ");
    }, lineprops, linebtns).render();

    com.focusPage('#addServiceNode', '#pagenation').on("click", function() {

        customerCompanyRule.snid = null;

        customerCompanyRule.modals.customerCompanyRuleModal.modal("show");
    });

    com.post(api.system.queryCompany, {
        "company.atttype": "1",
    }, function(res) {

        customerCompanyRule.items.company.bindData(res.companys, 'cid', 'name', true);
    });

    function remove(ccrid) {

        com.post(api.customer.deleteCustomerCompanyRule, {
            "customerCompanyRule.ccrid": ccrid,
        }, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function saveData() {

        if (com.validate('customerCompanyRuleModal'))
            return false;

        var url = api.customer.addCustomerCompanyRule;

        var options = {
            "customerCompanyRule.type": customerCompanyRule.items.type.val(),
            "customerCompanyRule.uppval": customerCompanyRule.items.uppval.val(),
            "customerCompanyRule.lowval": customerCompanyRule.items.lowval.val(),
            "customerCompanyRule.company.cid": customerCompanyRule.items.company.val(),
            "customerCompanyRule.dept.did": customerCompanyRule.items.deptSel.val(),
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            customerCompanyRule.modals.customerCompanyRuleModal.modal("hide");
        });
    }

});
