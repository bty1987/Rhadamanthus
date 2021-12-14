jQuery(function ($) {

    var quotationItem = {

        quotationItem: params.quotationItem,


        modals: {
            createQuotationItemModal: com.focusPage("#createQuotationItemmModal"),
        },

        items: {
            qiid: com.focusPage("#qiid"),
            itemId: com.focusPage("#no"),
            name: com.focusPage("#name"),
            version: com.focusPage("#version"),
            quotationType: com.focusPage("#quotationType"),
            quotationClassification: com.focusPage("#quotationClassification"),
            quotationBigCategory: com.focusPage("#quotationBigCategory"),
            quotationSmallCategory: com.focusPage("#quotationSmallCategory"),
            measurementUnit: com.focusPage("#measurementUnit"),
            workType: com.focusPage("#workType"),
            comment: com.focusPage("#comment"),
            unitPrice: com.focusPage("#unitPrice"),
            addPrice: com.focusPage("#addPrice"),
            subPrice: com.focusPage("#subPrice"),
        },

        editFlag: false,
        repeatFlg: false,

        args: {
            qiid: null,
        },
    };

    var searcher = new Searcher();

    searcher.base("quotationItemCondList", "quotationItemPagenation", "quotationItemResultList", api.data.pageSoodsBySid);

    searcher.param({"soods.sid": params.sid});

    var lineprops = [
        {fieId: "quotationItem.no", name: "编号", prop:"quotationItem.no", clazz: "grey"},
        {fieId: "quotationItem.name", name: "类型", prop: "quotationItem.name", clazz: "red"},
        {fieId: "quotationTypeId", name: "报价名称", prop: "quotationItem.version.name", clazz: "grey"},
        {fieId: "version", name: "报价版本", prop: "quotationItem.version.no", clazz: "grey"},
        {fieId: "goods.name", name: "商品名称", prop: "goods.name", clazz: "red"},
        {fieId: "goods.brand", name: "商品品牌", prop: "goods.brand", clazz: "grey"},
        {fieId: "accessoriesType", name: "商品辅类", prop: "goods.accessoriesType", clazz: "grey"},
    ];
    var linebtns = [
        {name: "删除", clazz: "btn-success", handle: function(v){
                var options = {
                    "soods.sid": v.sid,
                    "soods.quotationItem.qiid": v.quotationItem.qiid,
                };
                com.post(api.data.deleteSoodsItem,options, function(e) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            }}
    ];

    searcher.line("goods.name", lineprops, linebtns).render();


});
