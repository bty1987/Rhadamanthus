$(function() {

    var customerSourceRecord = {

        csid: params.customer.customerSource.csid,
        pageType: params['urlLoadParams'].type
    };

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("customerSourceRecord");

    var searcher = new Searcher();

    searcher.base("recordCondList", "recordPagenation", "recordResultList", pageConfig.apiPage || api.customer.pageCustomerSourceRecord);
    searcher.condition();
    searcher.history("customerSourceRecordData" + customerSourceRecord.pageType);

    var param = {
        "customerSourceRecord.csid": customerSourceRecord.csid
    };

    if (customerSourceRecord.pageType == "0") {
        param["customerSourceRecord.type"] = customerSourceRecord.pageType;
    }

    searcher.param(param);

    var propertyMap = {
        "operater": {
            fieId: "userName",
            name: "操作人",
            prop: "operater.userName",
            clazz: "grey"
        },
        "operatTime": {
            fieId: "operatTime",
            name: "记录时间",
            prop: "operatTime",
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

    searcher.line("comment", lineprops, []).render();

});