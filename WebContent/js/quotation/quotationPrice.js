jQuery(function($) {

    var quotationPrice = {

        quotationItem: params.data.quotationItem,
        qpid: null,

        btns: {
            saveQuotationPriceBtn: com.focusPage("#saveQuotationPriceBtn").on("click", saveData)
        },

        modals: {
            createQuotationPriceModal: com.focusPage("#createQuotationPriceModal")
        },

        items: {
            addPrice: com.focusPage("#addPrice", "#createQuotationPriceModal"),
            unitPrice: com.focusPage("#unitPrice", "#createQuotationPriceModal"),
            subPrice: com.focusPage("#subPrice", "#createQuotationPriceModal"),
            updateTime: com.focusPage("#updateTime", "#createQuotationPriceModal")
        },

        status: {},
        type: {}
    };

    com.datetime(com.focusPage(".date-picker"), "date");

    quotationPrice.modals.createQuotationPriceModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(quotationPrice.items);
    });

    var searcher = new Searcher();

    searcher.base("quotationPriceCondList", "quotationPricePagenation", "quotationPriceResultList", api.quotation.pageQuotationPrice);

    searcher.condition(["data-quotation-price-createTime"]);

    searcher.button([{
        id: "createQuotationPrice",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.param({
        "quotationPrice.quotationItem.qiid": quotationPrice.quotationItem.qiid
    });

    searcher.history("quotationPricePostData");

    var lineprops = [{
        fieId: "quotationItem.name",
        name: "报价项名称",
        prop: "quotationItem.name",
        clazz: "grey"
    }, {
        fieId: "addPrice",
        name: "增补价",
        prop: "addPrice",
        clazz: "blue"
    }, {
        fieId: "unitPrice",
        name: "单价",
        prop: "unitPrice",
        clazz: "blue"
    }, {
        fieId: "subPrice",
        name: "退减价",
        prop: "subPrice",
        clazz: "blue"
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        dataset: constant.data().quotationPrice.status.keys,
        clazz: "red"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationPrice.qpid = v.qpid;

            quotationPrice.items.addPrice.val(v.addPrice);
            quotationPrice.items.unitPrice.val(v.unitPrice);
            quotationPrice.items.subPrice.val(v.subPrice);
            quotationPrice.items.updateTime.val(v.updateTime);

            quotationPrice.modals.createQuotationPriceModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteQuotationPrice, {
                "quotationPrice.qpid": v.qpid
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        }
    }];

    searcher.line("quotationItem.name", lineprops, linebtns).render();

    com.focusPage('#createQuotationPrice', '#quotationPricePagenation').on("click", function() {

        quotationPrice.qpid = null;
        quotationPrice.modals.createQuotationPriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('createQuotationPriceModal'))
            return false;

        var options = {
            "quotationPrice.quotationItem.qiid": quotationPrice.quotationItem.qiid,
            "quotationPrice.addPrice": quotationPrice.items.addPrice.val(),
            "quotationPrice.unitPrice": quotationPrice.items.unitPrice.val(),
            "quotationPrice.subPrice": quotationPrice.items.subPrice.val(),
            "quotationPrice.updateTime": quotationPrice.items.updateTime.val()
        };

        var url;

        if (quotationPrice.qpid != null) {
            url = api.quotation.updateQuotationPrice;
            options["quotationPrice.qpid"] = quotationPrice.qpid;
        } else {
            url = api.quotation.addQuotationPrice;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        quotationPrice.modals.createQuotationPriceModal.modal("hide");
    }

});
