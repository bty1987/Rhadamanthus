jQuery(function($) {

    var quotationLabel = {
        btns: {
            saveBtn: com.focusPage("#saveBtn", "#quotationLabelModal").on("click", saveData)
        },

        items: {
            name: com.focusPage("#name", "#quotationLabelModal")
        },

        modals: {
            quotationLabelModal: com.focusPage("#quotationLabelModal")
        },

        currentQlid: null
    };

    quotationLabel.modals.quotationLabelModal.on('hide.bs.modal', function(e) {
        com.clearValidator();
        com.cleanItems(quotationLabel.items);
        quotationLabel.currentQlid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageQuotationLabel);
    searcher.condition(["quotation-quotationLabel-name"]);
    searcher.history("quotationLabelPostData");

    searcher.button([{
        id: "addQuotationLabel",
        name: "添加",
        clazz: "btn-info",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationLabel.editFlag = true;
            quotationLabel.currentQlid = v.qlid;

            quotationLabel.items.name.val(v.name);

            quotationLabel.modals.quotationLabelModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确定删除当前标签吗?", function(res) {
                com.post(api.quotation.deleteQuotationLabel, {"quotationLabel.qlid": v.qlid}, function(res) {
                    com.showAlert(com.info, "删除成功.")
                });

                searcher.doSearch();
            });

            return false;
        }
    }];

    searcher.line("", lineprops, linebtns).render();

    com.focusPage('#addQuotationLabel', '#pagenation').on("click", function() {

        quotationLabel.editFlag = false;

        quotationLabel.modals.quotationLabelModal.modal("show");

    });

    function saveData() {

        if (com.validate('quotationLabelModal')) return false;

        var url = api.quotation.addQuotationLabel;

        var options = {
            'quotationLabel.name': quotationLabel.items.name.val()
        };

        if (quotationLabel.editFlag) {
            options["quotationLabel.qlid"] = quotationLabel.currentQlid;
            url = api.quotation.updateQuotationLabel;
        }

        com.post(url, options, function(res) {
            searcher.doSearch();
            quotationLabel.modals.quotationLabelModal.modal("hide");
        });
    }
});
