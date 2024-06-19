jQuery(function ($) {

    var searcher = new Searcher();

    var url = api.customer.pageCustomerDeptRule;

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition([]);
    searcher.history("customerDeptRulePostData");
    var lineprops = [{
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

    function remove(cdrid) {

        var options = {
            "customerDeptRule.cdrid": cdrid,
        };
        com.post(api.customer.deleteCustomerDeptRule, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }
});
