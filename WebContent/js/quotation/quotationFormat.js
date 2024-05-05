jQuery(function($) {

    var quotationFormat = {
        qcid: params.data.quotationCtem.qcid,
        qfid: null,
        items: {
            name: com.focusPage('#name', "#addQuotationFormatModal"),
            format: com.focusPage('#format', "#addQuotationFormatModal"),
        },
        modals: {
            addQuotationFormatModal: com.focusPage('#addQuotationFormatModal')
        },
        btns: {
            addQuotationFormatBtn: com.focusPage('#addQuotationFormatBtn'),
            quotationFormatBackBtn: com.focusPage('#quotationFormatBackBtn'),
            quotationFormatBtn: com.focusPage('#quotationFormatBtn'),
        },

    };

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationFormat.qfid = v.qfid;
            quotationFormat.items.name.val(v.name).attr("disabled", "disabled");
            quotationFormat.items.format.val(v.format);

            quotationFormat.modals.addQuotationFormatModal.modal("show");
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteQuotationFormat, {
                "quotationFormat.qfid": v.qfid
            }, function(e) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateQuotationFormatForStatus, {
                "quotationFormat.qfid": v.qfid,
                "quotationFormat.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.set("quotationFormatCondList", "quotationFormatPagenation", "quotationFormatResultList", api.quotation.queryQuotationFormatByQcid, {
        "quotationFormat.quotationCtem.qcid": quotationFormat.qcid
    }, null, null, "quotationFormats", true);

    var lineprops = [{
        field: "format",
        name: "规格",
        prop: "format",
        clazz: "grey"
    }, {
        field: "name",
        name: "名字",
        prop: "name",
        clazz: "grey"
    }];

    searcher.line("format", lineprops, linebtns).render();

    quotationFormat.btns.quotationFormatBackBtn.click(function() {

        com.closePopup();
    });

    quotationFormat.btns.addQuotationFormatBtn.click(function() {

        quotationFormat.qfid = null;
        quotationFormat.items.name.val("").removeAttr("disabled");
        quotationFormat.items.format.val("");

        quotationFormat.modals.addQuotationFormatModal.modal("show");
    });

    quotationFormat.btns.quotationFormatBtn.click(function() {

        if (com.validate('addQuotationFormatModal')) {
            return false;
        }

        var url = api.quotation.addQuotationFormat;

        var option = {
            "quotationFormat.quotationCtem.qcid": quotationFormat.qcid,
            "quotationFormat.name": quotationFormat.items.name.val(),
            "quotationFormat.format": quotationFormat.items.format.val(),
        };

        if (quotationFormat.qfid != null) {
            url = api.quotation.updateQuotationFormat;
            option["quotationFormat.qfid"] = quotationFormat.qfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            quotationFormat.modals.addQuotationFormatModal.modal("hide");
        });
    });
});