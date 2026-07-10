jQuery(function($) {

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
            focus: com.focusPage("#focus", "#customerDeptRuleModal"),
        },
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
    customerDeptRule.items.focus.bindData(constant.customer().customerDeptRule.focus.datas, "key", "value");

    customerDeptRule.modals.customerDeptRuleModal.on('hide.bs.modal', function(e) {

        com.cleanItems(customerDeptRule.items);
        com.closeTip();
    });

    drawInfo();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("customerDeptRule");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageCustomerDeptRule);
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ['customer-customerDeptRule-name', 'customer-customerDeptRule-type', 'customer-customerDeptRule-atttype']);
    searcher.history("customerDeptRulePostData");

    searcher.button([{
        id: "addCustomerDeptRule",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "name": {
            fieId: "name",
            name: "名称",
            prop: "name",
            clazz: "blue"
        },
        "type": {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.customer().customerDeptRule.type.keys
        },
        "atttype": {
            field: "atttype",
            name: "类型",
            prop: "atttype",
            clazz: "red",
            dataset: constant.customer().customerDeptRule.atttype.keys
        },
        "busitype": {
            field: "busitype",
            name: "业务类型",
            prop: "busitype.name",
            clazz: "red"
        },
        "deptStatus": {
            field: "department.status",
            name: "部门状态",
            prop: "department.status",
            clazz: "red",
            dataset: constant.personel().dept.status.keys
        },
        "focus": {
            field: "focus",
            name: "聚焦",
            prop: "focus",
            clazz: "red",
            dataset: constant.customer().customerDeptRule.focus.keys
        },
        "creater": {
            field: "creater",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
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

            remove(v.cdrid);
        },
        show: function() { return btnVisible("del"); }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addCustomerDeptRule', '#pagenation').on("click", function() {

        customerDeptRule.modals.customerDeptRuleModal.modal("show");
    });

    function remove(cdrid) {

        var options = {
            "customerDeptRule.cdrid": cdrid,
        };

        com.post(api.customer.deleteCustomerDeptRule, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function saveData() {

        if (com.validate('customerDeptRuleModal'))
            return false;

        var url = api.customer.addCustomerDeptRule;

        var options = {
            "customerDeptRule.atttype": customerDeptRule.items.atttype.val(),
            "customerDeptRule.department.did": customerDeptRule.items.deptSel.val(),
            "customerDeptRule.busitype.dbid": customerDeptRule.items.busitype.val(),
            "customerDeptRule.focus": customerDeptRule.items.focus.val(),
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            customerDeptRule.modals.customerDeptRuleModal.modal("hide");
        });
    }

    function drawInfo() {

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-4").prependTo(com.focusPage("#infolist"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'worksheet4content').text("默认规则").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('默认规则: 手动')).appendTo($main);
    }

});
