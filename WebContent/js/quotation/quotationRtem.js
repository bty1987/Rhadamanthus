jQuery(function($) {

    var quotationRtem = {

        quotationItem: params.data.quotationItem,
        targetId: null,

        btns: {
            addQuotationRtemBtn: com.focusPage("#addQuotationRtemBtn"),
            saveQuotationRtemBtn: com.focusPage("#saveQuotationRtemBtn"),
            addQuotationItemBtn: com.focusPage("#addQuotationItemBtn"),
        },

        modals: {
            createQuotationRtemModal: com.focusPage("#createQuotationRtemModal"),
            quotationItemsModal: com.focusPage("#quotationItemsModal")
        },

        items: {
            targetItem: com.focusPage("#targetItem", "#createQuotationRtemModal"),
            type: com.focusPage("#type", "#createQuotationRtemModal"),
            formula: com.focusPage("#formula", "#createQuotationRtemModal"),
            comment: com.focusPage("#comment", "#createQuotationRtemModal"),
        }
    };

    quotationRtem.items.type.bindData(constant.data().quotationRtem.type.datas, "key", "value");

    quotationRtem.modals.createQuotationRtemModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(quotationRtem.items);
        quotationRtem.targetId = null;
    });

    quotationRtem.btns.addQuotationRtemBtn.on("click", function() {

        quotationRtem.modals.createQuotationRtemModal.modal("show");
    });

    quotationRtem.btns.addQuotationItemBtn.on("click", function() {

        quotationItemList();
        quotationRtem.modals.quotationItemsModal.modal("show");

    });

    var searcher = new Searcher();

    searcher.set("rtemCondList", "rtemPagenation", "rtemResultList", api.quotation.queryQuotationRtem, {
        "quotationRtem.source.qiid": quotationRtem.quotationItem.qiid
    }, null, null, "quotationRtems", true);

    var rtemprops = [{
        field: "target.name",
        name: "关联报价项",
        prop: "target.name",
        clazz: "red"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: constant.data().quotationRtem.type.keys,
        clazz: "red"
    }, {
        field: "formula",
        name: "公式",
        prop: function (v){
            return paramToFormula(v.formula);
        },
        clazz: "grey"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var rtembtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteQuotationRtem, {
                "quotationRtem.qrid": v.qrid
            }, function(e) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        }
    }];

    searcher.line("source.name", rtemprops, rtembtns).render();

    quotationRtem.btns.saveQuotationRtemBtn.on("click", function() {

        if (com.validate('createQuotationRtemModal'))
            return false;

        if (quotationRtem.targetId == null) {

            com.showAlert(com.warning, "未选择关联报价项");
            return false;
        }

        var formula = quotationRtem.items.formula.val();

        if (formula.replace(/(\u5468\u957f|\u9762\u79ef|\u4e3e\u67b6|\u6d1e\u9762|\u53c2\u6570|\u7a97\u9762|\u53d8\u91cf|\u6881\u957f|\u6881\u9ad8)|\u8f66\u8fd0\u8d39|\u7a0e\u91d1|\u7ba1\u7406\u8d39|\u4e0d\u6253\u6298\u603b\u989d|\u6253\u6298\u603b\u989d|\u5de5\u7a0b\u91cf/g, "").replace(/[\+\-\*\/\(\)]/g, "").replace(/[0-9]/g, "") != "") {

            com.showAlert(com.warning, "公式存在无效参数");

            return false;
        }

        if (evals(formulaToParam(formula))) {

            com.showAlert(com.warning, "公式运算结果失败");

            return false;
        }

        var options = {
            "quotationRtem.source.qiid": quotationRtem.quotationItem.qiid,
            "quotationRtem.target.qiid": quotationRtem.targetId,
            "quotationRtem.type": quotationRtem.items.type.val(),
            "quotationRtem.formula": formulaToParam(formula),
            "quotationRtem.comment": quotationRtem.items.comment.val()
        };

        com.post(api.quotation.addQuotationRtem, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            quotationRtem.modals.createQuotationRtemModal.modal("hide");
        });

    });

    function quotationItemList() {

        var searcher = new Searcher();

        searcher.base("itemCondList", "itemPagenation", "itemResultList", api.quotation.pageQuotationItemByVersionId);
        searcher.condition(['data-quotation-item-name']);
        searcher.param({
            "quotationItem.version.no": quotationRtem.quotationItem.version.no
        });
        searcher.history("quotaitonitemsPostData");

        var itemprops = [{
            fieId: "category.name",
            name: "类型",
            prop: "category.name",
            clazz: "red"
        }, {
            fieId: "classification.name",
            name: "分类",
            prop: "classification.name",
            clazz: "red"
        }, {
            fieId: "bigCategory.name",
            name: "大类",
            prop: "bigCategory.name",
            clazz: "red"
        }, {
            fieId: "smallCategory.name",
            name: "小类",
            prop: "smallCategory.name",
            clazz: "red"
        }, {
            fieId: "unit.name",
            name: "单位",
            prop: "unit.name",
            clazz: "red"
        }, {
            fieId: "workType.name",
            name: "工种",
            prop: "workType.name",
            clazz: "red"
        }, {
            fieId: "unitPrice",
            name: "单价",
            prop: "unitPrice",
            clazz: "blue"
        }, {
            fieId: "version.name",
            name: "版本",
            prop: "version.name",
            clazz: "grey"
        }];

        var itembtns = [{
            name: "选择",
            clazz: "btn-yellow",
            handle: function(v) {

                quotationRtem.items.targetItem.val(v.name);
                quotationRtem.targetId = v.qiid;

                quotationRtem.modals.quotationItemsModal.modal("hide");

                return false;
            }
        }];

        searcher.line("name", itemprops, itembtns).render();
    }

    function formulaToParam(formula) {

        return formula.replace(/\u5468\u957f/g, "{a}").replace(/\u9762\u79ef/g, "{b}").replace(/\u4e3e\u67b6/g, "{c}").replace(/\u6d1e\u9762/g, "{d}").replace(/\u7a97\u9762/g, "{f}").replace(/\u6881\u957f/g, "{h}").replace(/\u6881\u9ad8/g, "{i}").replace(/\u53c2\u6570/g, "{e}").replace(/\u53d8\u91cf/g, "{g}").replace(/\u8f66\u8fd0\u8d39/g, "{z}").replace(/\u7a0e\u91d1/g, "{u}").replace(/\u7ba1\u7406\u8d39/g, "{v}").replace(/\u4e0d\u6253\u6298\u603b\u989d/g, "{x}").replace(/\u6253\u6298\u603b\u989d/g, "{y}").replace(/\u5de5\u7a0b\u91cf/g, "{w}");
    }

    function paramToFormula(param) {

        return param.replace(/\{a\}/g, "\u5468\u957f").replace(/\{b\}/g, "\u9762\u79ef").replace(/\{c\}/g, "\u4e3e\u67b6").replace(/\{d\}/g, "\u6d1e\u9762").replace(/\{f\}/g, "\u7a97\u9762").replace(/\{h\}/g, "\u6881\u957f").replace(/\{i\}/g, "\u6881\u9ad8").replace(/\{e\}/g, "\u53c2\u6570").replace(/\{g\}/g, "\u53d8\u91cf").replace(/{z}/g, "\u8f66\u8fd0\u8d39").replace(/{u}/g, "\u7a0e\u91d1").replace(/{v}/g, "\u7ba1\u7406\u8d39").replace(/{x}/g, "\u4e0d\u6253\u6298\u603b\u989d").replace(/{y}/g, "\u6253\u6298\u603b\u989d").replace(/{w}/g, "\u5de5\u7a0b\u91cf");
    }

    function evals(formula) {

        formula = com.format(formula, {
            "a": 1,
            "b": 1,
            "c": 1,
            "d": 1,
            "e": 1,
            "f": 1,
            "g": 1,
            "h": 1,
            "i": 1,
            "z": 1,
            "u": 1,
            "v": 1,
            "x": 1,
            "y": 1,
            "w": 1,
        });

        var res = new Function("return function(){return " + formula + "}")()();

        return isNaN(res) || !Number.isFinite(res);
    }

});
