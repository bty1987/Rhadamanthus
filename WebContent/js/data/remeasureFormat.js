jQuery(function($) {
    var remeasureFormat = {
        btns: {
            saveBtn: com.focusPage("#saveBtn", "#remeasureFormatModal").on("click", saveData),
            addQuotationItemBtn: com.focusPage("#addQuotationItemBtn", "#remeasureFormatModal")
        },

        items: {
            name: com.focusPage("#name", "#remeasureFormatModal"),
            quotationItem: com.focusPage("#quotationItem", "#remeasureFormatModal"),
            goods: com.focusPage("#goods", "#remeasureFormatModal"),
            type: com.focusPage("#type", "#remeasureFormatModal"),
            value: com.focusPage("#value", "#remeasureFormatModal")
        },

        modals: {
            remeasureFormatModal: com.focusPage("#remeasureFormatModal" , "#remeasureFormat"),
            quotationItemsModal: com.focusPage("#quotationItemsModal", "#remeasureFormat")
        },
        editFlag: false,
        currentRfid: null,
        quotationItemId: null
    };

    remeasureFormat.items.type.bindData(constant.data().remeasureFormat.type.datas, 'key', 'value');

    com.initTypeahead(remeasureFormat.items.goods, api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name");

    remeasureFormat.modals.remeasureFormatModal.on('hide.bs.modal', function(e) {
        com.clearValidator();
        com.cleanItems(remeasureFormat.items);
        remeasureFormat.currentRfid = null;
        remeasureFormat.quotationItemId = null;

        remeasureFormat.items.goods.removeClass("v_typeahead");
    });

    remeasureFormat.items.goods.on("blur", function () {
        if (remeasureFormat.items.goods.val().trim() != "") {
            remeasureFormat.items.goods.addClass("v_typeahead");
        } else {
            remeasureFormat.items.goods.removeClass("v_typeahead");
        }
    });

    remeasureFormat.btns.addQuotationItemBtn.on("click", function() {
        showQuotationItemList();
        remeasureFormat.modals.quotationItemsModal.modal("show");
    });

    var searcher = new Searcher();

    searcher.base("condListRemeasureFormat", "pagenationRemeasureFormat", "resultListRemeasureFormat", api.data.queryRemeasureFormatByBid);
    searcher.param({"remeasureFormat.brand.bid": params.remeasureFormatBid});
    searcher.isPage(true);
    searcher.result("remeasureFormats");
    searcher.history("remeasureFormatPostData");

    searcher.button([{
        id: "addRemeasureFormat",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "brand.name",
        name: "品牌",
        prop: "brand.name",
        clazz: "gred"
    }, {
        fieId: "quotationItem.name",
        name: "报价项",
        prop: "quotationItem.name",
        clazz: "gred",
        show: function (v) {
            return v.quotationItem.name = com.checkNull(v.quotationItem && v.quotationItem.name, "暂无")
        }
    }, {
        fieId: "goods.name",
        name: "商品",
        prop: "goods.name",
        clazz: "gred",
        show: function (v) {
            return v.goods.name = com.checkNull(v.goods && v.goods.name, "暂无")
        }
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().remeasureFormat.type.keys
    }, {
        fieId: "value",
        name: "数值",
        prop: "value",
        clazz: "gred"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().remeasureFormat.status.keys
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            remeasureFormat.editFlag = true;

            remeasureFormat.currentRfid = v.rfid;

            remeasureFormat.items.name.val(v.name);
            v.quotationItem != null ? com.updateTypeahead("quotationItem", v.quotationItem.qiid, v.quotationItem.name) : "";
            v.goods != null ? com.updateTypeahead("goods", v.goods.gid, v.goods.name) : "";
            remeasureFormat.items.type.val(v.type);
            remeasureFormat.items.value.val(v.value);

            remeasureFormat.modals.remeasureFormatModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateRemeasureFormatForStatus, {
                "remeasureFormat.rfid": v.rfid,
                "remeasureFormat.status": check ? 0 : 1
            });
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line(function(v) {return v.name;}, lineprops, linebtns).render();

    com.focusPage('#addRemeasureFormat', '#pagenationRemeasureFormat').on("click", function() {

        remeasureFormat.editFlag = false;

        remeasureFormat.modals.remeasureFormatModal.modal("show");

    });

    function saveData() {

        if (com.validate('remeasureFormatModal')) return false;

        var url = api.data.addRemeasureFormat;

        var options = {
            'remeasureFormat.name': remeasureFormat.items.name.val(),
            'remeasureFormat.brand.bid': params.remeasureFormatBid,
            'remeasureFormat.type': remeasureFormat.items.type.val(),
            'remeasureFormat.value': remeasureFormat.items.value.val()
        };

        if (remeasureFormat.items.quotationItem.val() != "") options["remeasureFormat.quotationItem.qiid"] = remeasureFormat.quotationItemId;
        if (com.typeahead(remeasureFormat.items.goods) != "") options["remeasureFormat.goods.gid"] = com.typeahead(remeasureFormat.items.goods);

        if (remeasureFormat.editFlag) {
            options["remeasureFormat.rfid"] = remeasureFormat.currentRfid;
            url = api.data.updateRemeasureFormat;
        }

        com.post(url, options, function(res) {
            searcher.doSearch();
            remeasureFormat.modals.remeasureFormatModal.modal("hide");
        });
    }

    function showQuotationItemList() {

        var searcher = new Searcher();

        searcher.base("condListQuotationItem", "pagenationQuotationItem", "resultListQuotationItem", api.quotation.pageQuotationItem);
        searcher.condition(['data-quotation-item-name']);
        searcher.history("remeasureFormatQuotaitonitemsPostData");

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

                remeasureFormat.items.quotationItem.val(v.name);
                remeasureFormat.quotationItemId = v.qiid;

                remeasureFormat.modals.quotationItemsModal.modal("hide");

                return false;
            }
        }];

        searcher.line("name", itemprops, itembtns).render();
    }
});
