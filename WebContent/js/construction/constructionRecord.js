jQuery(function($) {

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("constructionRecord");

    var searcher = new Searcher();

    searcher.base("recordCondLists", "recordPagenations", "recordResultLists", pageConfig.apiPage || api.construction.queryConstructionRecordByOrderId);
    searcher.isPage(true).result("constructionRecords");
    searcher.param({
        "constructionRecord.orderId": params.orderId
    });

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            fieId: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "grey"
        },
        "operater": {
            fieId: "operater.currentName",
            name: "操作人",
            prop: "operater.currentName",
            clazz: "grey"
        },
        "operateTime": {
            fieId: "operateTime",
            name: "操作时间",
            prop: "operateTime",
            clazz: "grey"
        },
        "comment": {
            fieId: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
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

    var linebtns = [];

    searcher.line("operater.currentName", lineprops, linebtns).render();

});
