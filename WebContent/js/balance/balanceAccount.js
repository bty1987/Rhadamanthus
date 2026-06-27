jQuery(function($) {

    var balanceAccount = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            withdrawBtn: com.focusPage("#withdrawBtn"),

            saveBccountBtn: com.focusPage("#saveBccountBtn"),
            saveCccountBtn: com.focusPage("#saveCccountBtn"),
        },

        modals: {
            addBalanceAccountModal: com.focusPage("#addBalanceAccountModal"),
            withdrawModal: com.focusPage("#withdrawModal"),

            addBccountModal: com.focusPage("#addBccountModal"),
            addCccountModal: com.focusPage("#addCccountModal"),
        },

        items: {
            money: com.focusPage("#money"),

            bname: com.focusPage("#name", "#addBccountModal"),
            buser: com.focusPage("#bccount", "#addBccountModal"),
            baddress: com.focusPage("#address", "#addBccountModal"),
            bphone: com.focusPage("#phone", "#addBccountModal"),
            bbank: com.focusPage("#bank", "#addBccountModal"),
            bbankno: com.focusPage("#bankno", "#addBccountModal"),

            cname: com.focusPage("#name", "#addCccountModal"),
            caddress: com.focusPage("#address", "#addCccountModal"),
            cphone: com.focusPage("#phone", "#addCccountModal"),
            cbank: com.focusPage("#bank", "#addCccountModal"),
            cbankno: com.focusPage("#bankno", "#addCccountModal"),
        },

        addItems: {
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            belonger: com.focusPage("#belonger")
        },

        baid: null,
        isBalanceAccountType: {},
        isBalanceAccountStatus: {}
    };

    balanceAccount.btns.saveBtn.bindClick(saveData);
    balanceAccount.btns.withdrawBtn.bindClick(withdraw);
    balanceAccount.btns.saveBccountBtn.bindClick(addBccount);
    balanceAccount.btns.saveCccountBtn.bindClick(addCccount);

    balanceAccount.modals.addBalanceAccountModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(balanceAccount.addItems);
    });

    balanceAccount.modals.withdrawModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(balanceAccount.items);
    });

    balanceAccount.addItems.type.bindData(constant.balance().balanceAccount.type.datas, "key", "value");

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    com.initTypeahead('bccount', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "departmentType.name": "",
        "user.status": 0
    }, "suppliers", "userId", "currentName", null);

    var lineprops = (function() {

        return [{
            field: "address",
            name: "地址",
            prop: "address",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "bank",
            name: "银行",
            prop: "bank",
            clazz: "grey"
        }, {
            field: "bankno",
            name: "卡号",
            prop: "bankno",
            clazz: "grey"
        }, {
            field: "belonger.userName",
            name: "归属人",
            prop: "belonger.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.belonger.userId);
            }
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }, {
            field: "referMoney",
            name: "应付额",
            prop: "referMoney",
            clazz: "grey"
        }, {
            field: "realMoney",
            name: "实付额",
            prop: "realMoney",
            clazz: "grey"
        }, {
            field: "surplus",
            name: "余额",
            prop: "surplus",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.balance().balanceAccount.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.balance().balanceAccount.status.keys[v.status]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return !v.status;
                },
                handle: function(v, check) {
                    updatastatus(v.baid, check ? 0 : 1);
                }
            },
            withdraw: {
                name: "提款",
                clazz: "btn-yellow",
                handle: function(v) {
                    balanceAccount.baid = v.baid;
                    balanceAccount.modals.withdrawModal.modal("show");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBalanceAccount').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $badda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBccount').css("margin", "0px 3px");
        var $baddi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($badda);
        var $baddspan = $('<span></span>').text('添加结算').appendTo($badda);

        var $cadda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addCccount').css("margin", "0px 3px");
        var $caddi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($cadda);
        var $caddspan = $('<span></span>').text('添加出纳').appendTo($cadda);

        return [$adda, $badda, $cadda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.balance.pageBalanceAccount, null, ["balance-account-name", "balance-account-type", "balance-account-status"], "accountPostData", null, false, buildBalanceAccountButtons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addBalanceAccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.addItems);

        balanceAccount.modals.addBalanceAccountModal.modal("show");
    });

    com.focusPage('#addBccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.items);

        balanceAccount.modals.addBccountModal.modal("show");
    });

    com.focusPage('#addCccount', '#pagenation').click(function() {

        balanceAccount.baid = null;

        com.clearValidator();
        com.cleanItems(balanceAccount.items);

        balanceAccount.modals.addCccountModal.modal("show");
    });

    function saveData() {

        if (com.validate("addBalanceAccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': com.typeahead("belonger"),
            'balanceAccount.name': balanceAccount.addItems.name.val(),
            'balanceAccount.type': balanceAccount.addItems.type.val()
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            balanceAccount.modals.addBalanceAccountModal.modal("hide");
        });
    }

    function addBccount() {

        if (com.validate("addBccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': com.typeahead("bccount"),
            'balanceAccount.name': balanceAccount.items.bname.val(),
            'balanceAccount.type': 0,
            'balanceAccount.phone': balanceAccount.items.bphone.val(),
            'balanceAccount.address': balanceAccount.items.baddress.val(),
            'balanceAccount.bank': balanceAccount.items.bbank.val(),
            'balanceAccount.bankno': balanceAccount.items.bbankno.val(),
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            balanceAccount.modals.addBccountModal.modal("hide");
        });
    }

    function addCccount() {

        if (com.validate("addCccountModal")) {
            return false;
        }

        var options = {
            'balanceAccount.belonger.userId': params.userInfo.user.userId,
            'balanceAccount.name': balanceAccount.items.cname.val(),
            'balanceAccount.type': 1,
            'balanceAccount.phone': balanceAccount.items.cphone.val(),
            'balanceAccount.address': balanceAccount.items.caddress.val(),
            'balanceAccount.bank': balanceAccount.items.cbank.val(),
            'balanceAccount.bankno': balanceAccount.items.cbankno.val(),
        };

        com.post(api.balance.addBalanceAccount, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            balanceAccount.modals.addCccountModal.modal("hide");
        });
    }

    function updatastatus(baid, newstatus) {

        com.post(api.balance.updateBalanceAccountForStatus, {
            "balanceAccount.baid": baid,
            "balanceAccount.status": newstatus
        }, function() {

            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");

            searcher.doSearch();
        });
    }

    function withdraw() {

        com.post(api.balance.withdrawBalanceAccount, {
            "balanceAccount.baid": balanceAccount.baid,
            "balanceAccount.money": balanceAccount.items.money.val()
        }, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            balanceAccount.modals.withdrawModal.modal("hide");
        });
    }
});
