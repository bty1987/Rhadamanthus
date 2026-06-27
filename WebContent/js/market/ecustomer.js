jQuery(function($) {

    var ecityItem = [];

    com.post(api.market.queryEcity, {}, function(res) {

        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v) {

            ecityItem[v.ecid] = v.city;
        })
    }, null, false);

    var lineprops = (function() {

        return [{
            field: "cityId",
            name: "城市",
            prop: function(v) { return ecityItem[v.cityId]; },
            clazz: "grey"
        }, {
            field: "name",
            name: "姓名",
            prop: "name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "villageName",
            name: "楼盘名称",
            prop: "villageName",
            clazz: "grey"
        }, {
            field: "area",
            name: "面积",
            prop: function(v) { return v.area + "平"; },
            clazz: "blue"
        }];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageEcustomer, null, ["market-city", "market-customer-name"], "ecustomerPostData", null, false, null);
    searcher.line("name", lineprops, {}).render();
});
