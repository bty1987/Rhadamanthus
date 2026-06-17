jQuery(function($) {

    var pointRecord = {
        accountId: params.customer.accountId
    };

    var searcher = new Searcher();

    searcher.base("condListPointRecord", "pagenationPointRecord", "resultListsPointRecord", api.customer.queryPointRecord);
    searcher.param({
        "pointAccount.accountId": pointRecord.accountId
    });

    var lineprops = [{
        field: "operater.userName",
        name: "操作人",
        prop: "operater.userName",
        clazz: "blue",
        click: function(btn, v) {

            tools.personel.info(btn, v.operater.userId);
        }
    }, {
        field: "pointType",
        name: "类型",
        prop: "pointType",
        formatter: function(v) {

            return constant.customer().cppoint.type.keys[v.pointType];
        },
        clazz: "red"
    }, {
        field: "type",
        name: "操作类型",
        prop: "type",
        formatter: function(v) {

            return constant.customer().cppoint.cppointType.keys[v.type];
        },
        clazz: "red"
    }, {
        field: "point",
        name: "积分",
        prop: "point",
        clazz: "blue"
    }, {
        field: "balance",
        name: "剩余积分",
        prop: "balance",
        clazz: "blue"
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }];

    searcher.line("operater.userName", lineprops, []).render();
});
