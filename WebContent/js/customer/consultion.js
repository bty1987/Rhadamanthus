$(function () {

    function buildConsultionLineprops() {

        return [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: function(v) { return com.checkNull(v.decoration.orderId, "无"); },
            clazz: "blue"
        }, {
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "blue"
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }];
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.customer.pageConsultion, null, ["customer-service-orderId"], "consultionPostData", null, false, null);
    searcher.line("comment", buildConsultionLineprops(), {}).render();
});
