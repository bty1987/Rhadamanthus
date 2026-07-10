jQuery(function($) {

    var pointRecord = {
        accountId: params.customer.accountId
    };

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("pointRecord");

    var searcher = new Searcher();

    searcher.base("condListPointRecord", "pagenationPointRecord", "resultListsPointRecord", pageConfig.apiPage || api.customer.queryPointRecord);
    searcher.param({
        "pointAccount.accountId": pointRecord.accountId
    });

    var propertyMap = {
        "operater": {
            field: "operater.userName",
            name: "操作人",
            prop: "operater.userName",
            clazz: "blue",
            click: function(btn, v) {

                tools.personel.info(btn, v.operater.userId);
            }
        },
        "pointType": {
            field: "pointType",
            name: "类型",
            prop: "pointType",
            formatter: function(v) {

                return constant.customer().cppoint.type.keys[v.pointType];
            },
            clazz: "red"
        },
        "type": {
            field: "type",
            name: "操作类型",
            prop: "type",
            formatter: function(v) {

                return constant.customer().cppoint.cppointType.keys[v.type];
            },
            clazz: "red"
        },
        "point": {
            field: "point",
            name: "积分",
            prop: "point",
            clazz: "blue"
        },
        "balance": {
            field: "balance",
            name: "剩余积分",
            prop: "balance",
            clazz: "blue"
        },
        "operateTime": {
            field: "operateTime",
            name: "操作时间",
            prop: "operateTime",
            clazz: "green"
        }
    };

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

    searcher.line("operater.userName", lineprops, []).render();
});
