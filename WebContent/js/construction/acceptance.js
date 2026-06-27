jQuery(function ($) {

    var lineprops = constructionUtils.makeDecorationLineProps().concat([{
        field: "house.buildArea",
        name: "面积",
        prop: "house.buildArea",
        clazz: "blue"
    }, {
        field: "orderTotalPrice",
        name: "合同额",
        prop: "orderTotalPrice",
        clazz: "blue"
    }, {
        field: "version.name",
        name: "报价版本",
        prop: "version.name",
        clazz: "grey"
    }, {
        field: "projectStatus",
        name: "进度",
        prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
        clazz: "red"
    }]);

    var linebtns = (function() {

        return {
            view: {
                name: "验收",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewAcceptanceDetailIndex(v.orderId);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstructionForAcceptance, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'construction-supervisor', 'decoration-projectStatus', 'construction-acceptanceFlag'], "acceptanceSeacherSeacherPostData", null, true, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewAcceptanceDetailIndex(orderId) {
        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/acceptance4detail.html","查看");
    }

});
