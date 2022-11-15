$(function() {

    var quotationCtem = {
        qcid: null,

        btns: {
            saveBtn: com.focusPage("#saveQuotationCtemBtn").on("click", saveData)

        },
        modals: {
            updateQuotationCtemModal: com.focusPage("#updateQuotationCtemModal")
        },
        items: {
            name: com.focusPage("#name", "#updateQuotationCtemModal")
        },

        status: {},
    };

    quotationCtem.modals.updateQuotationCtemModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(quotationCtem.items);
    });

    var searcher = new Searcher();

    com.focusPage("#quotationCtemPageContent").removeClass("page-content");

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageQuotationCtem);
    searcher.condition(["data-quotation-ctem-name"]);

    searcher.button([{
        id: "addQuotationCtem",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.history("quotationCtemPostData");

    var ctemprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationCtem.qcid = v.qcid;

            quotationCtem.items.name.val(v.name);

            quotationCtem.modals.updateQuotationCtemModal.modal("show");

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateQuotationCtemForStatus, {
                "quotationCtem.qcid": v.qcid,
                "quotationCtem.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", ctemprops, linebtns).render();

    com.focusPage('#addQuotationCtem', '#pagenation').on("click", function() {

        quotationCtem.qcid = null;

        quotationCtem.modals.updateQuotationCtemModal.modal("show");
    });

    function saveData() {

        if (com.validate('updateQuotationCtemModal'))
            return false;

        var url = api.quotation.addQuotationCtem;

        var options = {
            "quotationCtem.name": quotationCtem.items.name.val()
        };

        if (quotationCtem.qcid) {
            url = api.quotation.updateQuotationCtem;
            options['quotationCtem.qcid'] = quotationCtem.qcid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        quotationCtem.modals.updateQuotationCtemModal.modal("hide");
    }

});