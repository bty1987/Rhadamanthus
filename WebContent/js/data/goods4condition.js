$(function() {

    var searcher = new Searcher();

    searcher.base("cond4condList", "cond4pagenation", "cond4resultList", api.data.pageGoodsForAdvance);

    searcher.condition(['data-goods-no', 'data-goods-name', 'data-goods-name-one', 'data-goods-brand-name', 'data-goods-status']);

    var lineprops = [{
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "alias",
        name: "别名",
        prop: "alias",
        clazz: "grey"
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey"
    }, {
        field: "measurementUnit",
        name: "单位",
        prop: "measurementUnit",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "选择",
        clazz: "btn-warning",
        handle: function(v) {

            params.data.goods = v;

            com.closePopup();

            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns);

    searcher.render();
});
