$(function() {

    var normood = {

        items: {
            quotationItem: com.focusPage('#quotationItem', "#addNormoodModal"),
            normunit: com.focusPage('#normunit', "#addNormoodModal"),
            normnum: com.focusPage('#normnum', "#addNormoodModal"),
            storeunit: com.focusPage('#storeunit', "#addNormoodModal"),
            storenum: com.focusPage('#storenum', "#addNormoodModal"),
            noodsName: com.focusPage('#noodsName', "#addNormoodModal"),
            price: com.focusPage('#price', "#addNormoodModal")
        },
        modals: {
            addNormoodModal: com.focusPage('#addNormoodModal')
        },
        btns: {
            addNormoodItemBtn: com.focusPage('#addNormoodItemBtn').on("click", saveData)
        },

        qiid: params.data.quotationItem != null ? params.data.quotationItem.qiid : "",

        status: constant.data().normood.status.keys,

        pageType: params.urlLoadParams.pageType
    };

    normood.modals.addNormoodModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("noodsName");
        com.cleanItems(normood.items);
    });

    com.initTypeahead(normood.items.noodsName, api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        normood.items.normunit.bindData(res.measurementUnits, "name", "name");
        normood.items.storeunit.bindData(res.measurementUnits, "name", "name");
    });

    var searcher = new Searcher();

    var normprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "noods",
        name: "定材",
        prop: "noods.name",
        clazz: "grey"
    }, {
        fieId: "normunit",
        name: "定额单位",
        prop: "normunit",
        clazz: "grey"
    }, {
        fieId: "quotationUnit",
        name: "报价单位",
        prop: "quotationItem.unit.name",
        clazz: "grey"
    }, {
        fieId: "normnum",
        name: "定额数量",
        prop: "normnum",
        clazz: "blue"
    }, {
        fieId: "storeunit",
        name: "库房单位",
        prop: "storeunit",
        clazz: "grey"
    }, {
        fieId: "storenum",
        name: "库房数量",
        prop: "storenum",
        clazz: "blue"
    }, {
        fieId: "price",
        name: "价格",
        prop: "price",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: normood.status
    }];

    var quoteprops = [{
        fieId: "name",
        name: "报价项",
        prop: "quotationItem.name",
        clazz: "grey"
    }, {
        fieId: "category",
        name: "类型",
        prop: "quotationItem.category.name",
        clazz: "red"
    }, {
        fieId: "classification",
        name: "分类",
        prop: "quotationItem.classification.name",
        clazz: "red"
    }, {
        fieId: "bigCategory",
        name: "大类",
        prop: "quotationItem.bigCategory.name",
        clazz: "red"
    }, {
        fieId: "smallCategory",
        name: "小类",
        prop: "quotationItem.smallCategory.name",
        clazz: "red"
    }, {
        fieId: "unit",
        name: "单位",
        prop: "unit",
        clazz: "red"
    }, {
        fieId: "workType",
        name: "工种",
        prop: "quotationItem.workType.name",
        clazz: "grey"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "quotationItem.comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            com.showConfirm("确认删除吗?", function(result) {

                com.post(api.data.deleteNormood, {
                    "normood.ngid": v.ngid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });
        }
    }];

    if (normood.pageType == "query") {

        searcher.base("normoodCondList", "normoodPagenation", "normoodResultList", api.data.queryNormoodByQiid);
        searcher.result("normoods").isPage(true);

        searcher.param({
            "normood.quotationItem.qiid": normood.qiid
        });

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("name", normprops, linebtns).render();
    } else {

        searcher.history("normoodPostData");
        searcher.base("normoodCondList", "normoodPagenation", "normoodResultList", api.data.pageNormood);
        searcher.condition(["data-normood-quotationItem", "data-normood-quotation-version", "data-normood-name", "data-normood-no", "data-normood-status"]);

        searcher.line("name", normprops.concat({
            type: "newline"
        }).concat(quoteprops), linebtns).render();
    }

    com.focusPage("#add").click(function() {

        normood.modals.addNormoodModal.modal("show");
    });

    function saveData() {

        if (com.validate('addNormoodModal')) {
            return false;
        }

        var option = {
            "normood.goods.gid": null,
            "normood.noods.nid": com.typeahead(normood.items.noodsName),
            "normood.normunit": normood.items.normunit.val(),
            "normood.normnum": normood.items.normnum.val(),
            "normood.storeunit": normood.items.storeunit.val(),
            "normood.storenum": normood.items.storenum.val(),
            "normood.quotationItem.qiid": normood.qiid,
            "normood.name": normood.items.noodsName.val(),
            "normood.price": normood.items.price.val()
        };

        com.post(api.data.addNormood, option, function(e) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            normood.modals.addNormoodModal.modal("hide");
        });
    }
});
