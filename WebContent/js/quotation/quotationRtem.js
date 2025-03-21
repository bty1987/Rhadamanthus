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
        prop: "formula",
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

        var options = {
            "quotationRtem.source.qiid": quotationRtem.quotationItem.qiid,
            "quotationRtem.target.qiid": quotationRtem.targetId,
            "quotationRtem.type": quotationRtem.items.type.val(),
            "quotationRtem.formula": quotationRtem.items.formula.val(),
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

});
