$(function() {

    var normrice = {

        items: {
            constructionNode: com.focusPage('#constructionNode', "#addNormriceModal"),
            unit: com.focusPage('#unit', "#addNormriceModal"),
            trannum: com.focusPage('#trannum', "#addNormriceModal"),
            salary: com.focusPage('#salary', "#addNormriceModal"),
            stuff: com.focusPage('#stuff', "#addNormriceModal")
        },
        modals: {
            addNormriceModal: com.focusPage('#addNormriceModal')
        },
        btns: {
            addNormriceBtn: com.focusPage('#addNormriceBtn'),
            addNormriceItemBtn: com.focusPage('#addNormriceItemBtn').on("click", saveData),
            normriceBackBtn: com.focusPage('#normriceBackBtn'),
        },

        qiid: params.data.quotationItem != null ? params.data.quotationItem.qiid : "",

        pageType: params.urlLoadParams.pageType
    };

    normrice.modals.addNormriceModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(normrice.items);
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        normrice.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        normrice.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
    });

    var searcher = new Searcher();

    var normprops = [{
        fieId: "constructionNode",
        name: "施工节点",
        prop: "constructionNode.name",
        clazz: "grey"
    }, {
        fieId: "quotationItem",
        name: "报价项",
        prop: "quotationItem.name",
        clazz: "grey"
    }, {
        fieId: "quotationUnit",
        name: "报价单位",
        prop: "quotationItem.unit.name",
        clazz: "grey"
    }, {
        fieId: "unit",
        name: "定额单位",
        prop: "unit",
        clazz: "grey"
    }, {
        fieId: "trannum",
        name: "转换量",
        prop: "trannum",
        clazz: "blue"
    }, {
        fieId: "salary",
        name: "工费",
        prop: "salary",
        clazz: "blue"
    }, {
        fieId: "stuff",
        name: "材料费",
        prop: "stuff",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().normrice.status.keys
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

                com.post(api.data.deleteNormrice, {
                    "normrice.npid": v.npid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });

        }
    }];

    if (normrice.pageType == "query") {

        searcher.base("normriceCondList", "normricePagenation", "normriceResultList", api.data.queryNormriceByQiid);
        searcher.result("normrices").isPage(true);

        searcher.param({
            "normrice.quotationItem.qiid": normrice.qiid
        });

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("constructionNode.name", normprops, linebtns).render();
    } else {

        searcher.history("normricePostData");
        searcher.base("normriceCondList", "normricePagenation", "normriceResultList", api.data.pageNormrice);
        searcher.condition(["data-normrice-quotationItem", "data-normrice-quotation-version", "data-normrice-constructionNode", "data-normrice-status"]);

        searcher.line("constructionNode.name", normprops.concat({
            type: "newline"
        }).concat(quoteprops), linebtns).render();
    }

    com.focusPage("#add").click(function() {

        normrice.modals.addNormriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('addNormriceModal')) {
            return false;
        }

        var option = {
            "normrice.constructionNode.cnid": normrice.items.constructionNode.val(),
            "normrice.unit": normrice.items.unit.val(),
            "normrice.trannum": normrice.items.trannum.val(),
            "normrice.salary": normrice.items.salary.val(),
            "normrice.stuff": normrice.items.stuff.val(),
            "normrice.quotationItem.qiid": normrice.qiid
        };

        com.post(api.data.addNormrice, option, function(e) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            normrice.modals.addNormriceModal.modal("hide");
        });
    }
});