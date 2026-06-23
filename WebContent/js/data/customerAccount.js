jQuery(function($) {

    var customerAccount = {

        cid: params.customer.cid,

        caid: null,

        editFlag: false,

        types: ["对私", "对公"],

        defaultsArr: ["否", "是"],

        btns: {
            saveBtn: com.focusPage("#accountSaveBtn", "#customerAccountModal").on("click", saveAccount)
        },

        modals: {
            customerAccountModal: com.focusPage("#customerAccountModal").on("show.bs.modal", function() {
                com.clearValidator();
            })
        },

        items: {
            type: com.focusPage("#accountType", "#customerAccountModal"),
            no: com.focusPage("#accountNo", "#customerAccountModal"),
            name: com.focusPage("#accountName", "#customerAccountModal"),
            phone: com.focusPage("#accountPhone", "#customerAccountModal"),
            address: com.focusPage("#accountAddress", "#customerAccountModal"),
            bank: com.focusPage("#accountBank", "#customerAccountModal"),
            bankno: com.focusPage("#accountBankno", "#customerAccountModal")
        }
    };

    var searcher = new Searcher();

    // 默认账户不显示「设为默认」「删除」按钮(name 返回 null 即跳过渲染)
    var linebtns = [{
        name: function(v) {

            return v.defaults == 1 ? null : "设为默认";
        },
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.communion.setDefaultCustomerAccount, {
                "customerAccount.caid": v.caid,
                "customerAccount.cid": customerAccount.cid
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            customerAccount.editFlag = true;
            customerAccount.caid = v.caid;

            customerAccount.items.type.val(v.type);
            customerAccount.items.no.val(v.no);
            customerAccount.items.name.val(v.name);
            customerAccount.items.phone.val(v.phone);
            customerAccount.items.address.val(v.address);
            customerAccount.items.bank.val(v.bank);
            customerAccount.items.bankno.val(v.bankno);

            customerAccount.modals.customerAccountModal.modal("show");

            return false;
        }
    }, {
        name: function(v) {

            return v.defaults == 1 ? null : "删除";
        },
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确认删除该账户?", function() {

                com.post(api.communion.deleteCustomerAccount, {
                    "customerAccount.caid": v.caid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        }
    }];

    searcher.base("accountCondList", "accountPagenation", "accountResultList", api.communion.queryCustomerAccount);

    searcher.param({
        "customerAccount.cid": customerAccount.cid
    });

    searcher.isPage(true);

    searcher.result("customerAccounts");

    searcher.button([{
        id: "addCustomerAccount",
        name: "添加账户",
        clazz: "btn-primary",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "type",
        name: "账户类型",
        prop: "type",
        clazz: "grey",
        dataset: customerAccount.types
    }, {
        fieId: "name",
        name: "户名",
        prop: "name",
        clazz: "blue"
    }, {
        fieId: "bank",
        name: "开户银行",
        prop: "bank",
        clazz: "grey"
    }, {
        fieId: "bankno",
        name: "银行账号",
        prop: "bankno",
        clazz: "grey"
    }, {
        fieId: "no",
        name: "证件号",
        prop: function(v) {

            return v.no ? v.no : "---";
        },
        clazz: "grey"
    }, {
        fieId: "phone",
        name: "联系电话",
        prop: function(v) {

            return v.phone ? v.phone : "---";
        },
        clazz: "grey"
    }, {
        fieId: "defaults",
        name: "默认",
        prop: "defaults",
        clazz: "red",
        dataset: customerAccount.defaultsArr
    }];

    searcher.line("bankno", lineprops, linebtns).render();

    com.focusPage('#addCustomerAccount', '#accountPagenation').on("click", function() {

        customerAccount.editFlag = false;

        com.cleanItems(customerAccount.items);

        customerAccount.items.type.val(1);

        customerAccount.modals.customerAccountModal.modal("show");
    });

    // 保存(新增/更新)
    function saveAccount() {

        if (com.validate("customerAccountModal")) {
            return false;
        }

        var url = api.communion.addCustomerAccount;

        var options = {
            "customerAccount.cid": customerAccount.cid,
            "customerAccount.type": customerAccount.items.type.val(),
            "customerAccount.no": customerAccount.items.no.val(),
            "customerAccount.name": customerAccount.items.name.val(),
            "customerAccount.phone": customerAccount.items.phone.val(),
            "customerAccount.address": customerAccount.items.address.val(),
            "customerAccount.bank": customerAccount.items.bank.val(),
            "customerAccount.bankno": customerAccount.items.bankno.val()
        };

        if (customerAccount.editFlag) {
            options["customerAccount.caid"] = customerAccount.caid;
            url = api.communion.updateCustomerAccount;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            customerAccount.modals.customerAccountModal.modal("hide");
        });
    }
});
