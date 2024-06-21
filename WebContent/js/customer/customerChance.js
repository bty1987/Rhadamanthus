jQuery(function($) {

    var customerChance = {

    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerChance);

    searcher.condition(["customer-customerChance-createTime", "customer-customerChance-type", "customer-customerChance-status"]);

    searcher.history("customerChancePostData");

    var lineprops = [{
        field: "source",
        name: "客户姓名",
        prop: "source.name",
        clazz: "grey"
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "busitype.name",
        clazz: "red",
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "issuer",
        name: "分配人",
        prop: "issuer.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "issueTime",
        name: "分配时间",
        prop: "issueTime",
        clazz: "green"
    }, {
        field: "confirmTime",
        name: "确认时间",
        prop: "confirmTime",
        clazz: "green"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey"
    }, {
        field: "department",
        name: "归属部门",
        prop: "department.name",
        clazz: "grey"
    }, {
        field: "region",
        name: "归属分区",
        prop: "region.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerChance.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerChance.status.keys,
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "分配",
        clazz: "btn-yellow",
        handle: function(v) {

            issue(v.csid);
        },
    }, {
        name: "失效",
        clazz: "btn-success",
        handle: function(v) {

            disable(v.ccid);
        },
    }, {
        name: "推送",
        clazz: "btn-warning",
        handle: function(v) {

            send(v.ccid);
        },
    }, {
        name: "确认",
        clazz: "btn-inverse",
        handle: function(v) {

            confirm(v.ccid);
        },
    }];

    searcher.line("source.name", lineprops, linebtns).render();

    console.log(2);

    function issue(csid) {

        var options = {
            "customerChance.source.csid": csid,
        };
        com.post(api.customer.issueCustomerChance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function disable(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认失效机会", function() {

            com.post(api.customer.disableCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        });

    }

    function send(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认推送信息", function() {

            com.post(api.customer.sendCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "推送成功");
            });
        });

    }

    function confirm(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认机会信息", function() {

            com.post(api.customer.confirmCustomerChange, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功!");
            });
        });
    }
});
