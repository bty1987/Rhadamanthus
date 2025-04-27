$(function() {

    var goodsRecord = {
        goods: params.data.goods,
        types: constant.data().goodsRecord.type.keys
    };

    var searcher = new Searcher();

    searcher.base("condListGoodsRecord", "pagenationGoodsRecord", "resultListGoodsRecord", api.data.pageGoodsRecord);

    searcher.param({"goodsRecord.goods.gid": goodsRecord.goods.gid});

    searcher.condition(["data-goodsRecord-type", "data-goodsRecord-operator", "data-goodsRecord-operateTime"]);

    searcher.history("goodsRecordPostData");

    var lineprops = [{
        fieId: "soods.name",
        name: "名称",
        prop: "soods.name",
        clazz: "grey",
        show: function(v) {

            return v.type == constant.data().goodsRecord.TYPE_SOODS_SHORT;
        }
    },{
        fieId: "aoods.name",
        name: "名称",
        prop: "aoods.name",
        clazz: "grey",
        show: function(v) {

            return v.type == constant.data().goodsRecord.TYPE_AOODS_SHORT;
        }
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().goodsRecord.type.keys
    }, {
        fieId: "operator.userName",
        name: "操作人",
        prop: "operator.userName",
        clazz: "grey"
    }, {
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "grey"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line("goods.name", lineprops, []).render();

    com.focusPage("#resultListGoodsRecord").find("div.action-buttons").find("a.btn-yellow").hide();

});
