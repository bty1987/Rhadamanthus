$(function () {

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("consultion");

    var lineprops = (function() {

        var propertyMap = {
            "orderId": {
                field: "decoration.orderId",
                name: "装修单号",
                prop: function(v) { return com.checkNull(v.decoration.orderId, "无"); },
                clazz: "blue"
            },
            "no": {
                field: "no",
                name: "编号",
                prop: "no",
                clazz: "blue"
            },
            "creater": {
                field: "creater.currentName",
                name: "创建人",
                prop: "creater.currentName",
                clazz: "grey"
            }
        };

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

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageConsultion, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-service-orderId"], "consultionPostData", null, false, null);
    searcher.line("comment", lineprops, {}).render();
});
