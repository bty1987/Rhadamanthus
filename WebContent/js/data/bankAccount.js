$(function() {

    var bankAccount = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addBankAccountModal: com.focusPage("#addBankAccountModal")
        },

        items: {
            name: com.focusPage("#name", "#bankAccount"),
            bankName: com.focusPage("#bankName", "#bankAccount"),
            bankNo: com.focusPage("#bankNo", "#bankAccount")
        },

        status: constant.data().bankAccount.status.keys,
        currentBaid: null
    };

    bankAccount.modals.addBankAccountModal.on("hide.bs.modal", function(a) {

        com.cleanItems(bankAccount.items);
        com.clearValidator();
        bankAccount.currentBaid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageBankAccount);

    searcher.condition(["data-bankAccount-name", "data-bankAccount-bankNo", "data-bankAccount-status"]);

    searcher.button([{
        id: "addBankAccount",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    searcher.history("bankAccountPostData");

    var lineprops = [{
        fieId: "bankName",
        name: "银行名称",
        prop: "bankName",
        clazz: "grey"
    }, {
        fieId: "bankNo",
        name: "卡号",
        prop: "bankNo",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: bankAccount.status
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            bankAccount.currentBaid = v.baid;

            bankAccount.items.name.val(v.name);
            bankAccount.items.bankName.val(v.bankName);
            bankAccount.items.bankNo.val(v.bankNo);

            bankAccount.modals.addBankAccountModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateBankAccountForStatus, {
                "bankAccount.baid": v.baid,
                "bankAccount.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();

    com.focusPage('#addBankAccount', '#pagenation').on("click", function() {

        bankAccount.modals.addBankAccountModal.modal("show");
    });

    function saveData() {

        if (com.validate('addBankAccountModal'))
            return false;

        var url = api.data.addBankAccount;
        var options = {
            "bankAccount.name": bankAccount.items.name.val(),
            "bankAccount.bankName": bankAccount.items.bankName.val(),
            "bankAccount.bankNo": bankAccount.items.bankNo.val()
        };

        if (bankAccount.currentBaid != null) {
            url = api.data.updateBankAccount;
            options["bankAccount.baid"] = bankAccount.currentBaid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            bankAccount.modals.addBankAccountModal.modal("hide");
        });
    }

});
