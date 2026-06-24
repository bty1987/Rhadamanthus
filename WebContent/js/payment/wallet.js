jQuery(function ($) {
    var wallet = {
        items: {
            title: com.focusPage("#title", "#wallet"),
            phone: com.focusPage("#phone", "#wallet"),
            code: com.focusPage("#code", "#wallet"),

            amount: com.focusPage("#amount", "#wallet"),
            card: com.focusPage("#card", "#wallet"),
            withdrawcode: com.focusPage("#withdrawcode", "#wallet"),

            transferUser: com.focusPage("#transferUser", "#wallet"),
            transferAmount: com.focusPage("#transferAmount", "#wallet"),
            transfercode: com.focusPage("#transfercode", "#wallet")
        },
        modals: {
            bindModal: com.focusPage("#bindModal", "#wallet"),
            withdrawModal: com.focusPage("#withdrawModal", "#wallet"),
            transferModal: com.focusPage("#transferModal", "#wallet")
        },
        btns: {
            bindBtn: com.focusPage("#bindBtn", "#wallet"),
            getCode: com.focusPage("#getCode", "#wallet"),
            withdrawBtn: com.focusPage("#withdrawBtn", "#wallet"),
            withdrawgetCode: com.focusPage("#withdrawgetCode", "#wallet"),
            transferBtn: com.focusPage("#transferBtn", "#wallet"),
            transfergetCode: com.focusPage("#transfergetCode", "#wallet")
        },
        types: constant.payment().wallet.type.keys,
        status: constant.payment().wallet.status.keys,
        currentWallet: null,
        //phoneCode: null,
        phoneCode: "1111",
        countdown: 60,
        bindOrupdate: null
    };

    //绑定
    wallet.btns.bindBtn.click(bindWallet);
    wallet.btns.getCode.click(function(){
        paymentUtils.getCode(this, wallet, wallet.items.phone.val());
    });

    //提现
    wallet.btns.withdrawBtn.click(withdrawWallet);
    wallet.btns.withdrawgetCode.click(function(){
        paymentUtils.getCode(this, wallet, wallet.currentWallet.phone);
    });

    //转账
    wallet.btns.transferBtn.click(transferWallet);
    wallet.btns.transfergetCode.click(function(){
        paymentUtils.getCode(this, wallet, wallet.currentWallet.phone);
    });

    wallet.modals.bindModal.on('hide.bs.modal', function () {
        com.closeTip();
        com.cleanItems(wallet.items);
        wallet.currentWallet = null;
        wallet.phoneCode = null;
        wallet.bindOrupdate = null;
    });

    wallet.modals.withdrawModal.on('hide.bs.modal', function () {
        com.closeTip();
        com.cleanItems(wallet.items);
        wallet.currentWallet = null;
        wallet.phoneCode = null;
    });

    wallet.modals.transferModal.on('hide.bs.modal', function () {
        com.closeTip();
        com.cleanItems(wallet.items);
        wallet.currentWallet = null;
        wallet.phoneCode = null;
    });

    com.initTypeahead('transferUser', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);

    function bindWalletLine(v) {

        wallet.currentWallet = v;
        wallet.items.title.html("绑定信息");
        wallet.bindOrupdate = "bind";
        wallet.items.phone.attr("disabled", true);
        wallet.items.phone.val(v.phone);
        wallet.modals.bindModal.modal("show");
    }

    function updateWalletLine(v) {

        wallet.currentWallet = v;
        wallet.items.title.html("更新信息");
        wallet.bindOrupdate = "update";
        wallet.items.phone.removeAttr("disabled");
        wallet.items.phone.val(v.phone);
        wallet.modals.bindModal.modal("show");
    }

    function freezeWalletLine(v) {

        com.showConfirm("确认要冻结该账户吗?", function() {
            com.post(api.payment.freezeWallet, {"wallet.wid": v.wid}, function() {
                com.showAlert(com.info, "冻结成功");
                searcher.doSearch();
            });
        });
    }

    function unfreezeWalletLine(v) {

        com.showConfirm("确认要解冻该账户吗?", function() {
            com.post(api.payment.unfreezeWallet, {"wallet.wid": v.wid}, function() {
                com.showAlert(com.info, "解冻成功");
                searcher.doSearch();
            });
        });
    }

    function withdrawWalletLine(v) {

        com.post(api.payment.queryWalletard, {"walletard.wid": v.wid}, function(res) {
            wallet.currentWallet = v;
            wallet.items.card.bindData(res.walletards, "wcid", "bankName");
            wallet.modals.withdrawModal.modal("show");
        });
    }

    function transferWalletLine(v) {

        wallet.currentWallet = v;
        wallet.modals.transferModal.modal("show");
    }

    function cardsWalletLine(v) {

        params.payment.wid = v.wid;
        params.payment.phone = v.phone;
        com.popup4page('#walletardPopup', api.index.walletardIndex.url, "银行卡");
    }

    function walletranWalletLine(v) {

        params.payment.wid = v.wid;
        com.popup4page('#walletranPopup', api.index.walletranIndex.url, "交易记录");
    }

    function walletresWalletLine(v) {

        params.payment.wid = v.wid;
        com.popup4page('#walletranPopup', api.index.walletresIndex.url, "资源");
    }

    function buildWalletLineprops() {

        return [{
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "blue"
        }, {
            field: "identity",
            name: "身份证",
            prop: "identity",
            clazz: "blue"
        }, {
            field: "balance",
            name: "余额",
            prop: "balance",
            clazz: "blue"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) {
                return wallet.types[v.type];
            },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {
                return wallet.status[v.status];
            },
            clazz: "red"
        }];
    }

    function buildWalletLinebtns() {

        return {
            bind: {name: "绑定", clazz: "btn-info", handle: bindWalletLine},
            update: {name: "更新", clazz: "btn-yellow", handle: updateWalletLine},
            freeze: {name: "冻结", clazz: "btn-success", handle: freezeWalletLine},
            unfreeze: {name: "解冻", clazz: "btn-warning", handle: unfreezeWalletLine},
            withdraw: {name: "提现", clazz: "btn-pink", handle: withdrawWalletLine},
            transfer: {name: "转账", clazz: "btn-danger", handle: transferWalletLine},
            cards: {name: "银行卡", clazz: "btn-purple", handle: cardsWalletLine},
            walletran: {name: "交易记录", clazz: "btn-inverse", handle: walletranWalletLine},
            walletres: {name: "资源", clazz: "btn-info", handle: walletresWalletLine}
        };
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pageWallet);
    searcher.condition(["payment-wallet-belonger-name"]);
    searcher.history("walletPostData");
    searcher.line("belonger.currentName", buildWalletLineprops(), buildWalletLinebtns()).render();

    //绑定
    function bindWallet() {

        if(com.validate("bindWallet")) return;

        //验证二维码
        if(wallet.items.code.val() != wallet.phoneCode){
            com.showAlert(com.error, "验证码错误");
            return false;
        }

        var url = api.payment.confirmWallet;

        var options = {
            "wallet.wid": wallet.currentWallet.wid
        };

        if (wallet.bindOrupdate == "update") {
            url = api.payment.updateWallet;
            options["wallet.phone"] = wallet.items.phone.val();
        }

        com.post(url, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            wallet.modals.bindModal.modal("hide");
        })
    }

    //提现
    function withdrawWallet(){
        if (com.validate("withdrawModal")) return;

        //验证二维码
        if(wallet.items.withdrawcode.val() != wallet.phoneCode){
            com.showAlert(com.error, "验证码错误");
            return false;
        }

        var options = {
            "wallet.wid": wallet.currentWallet.wid,
            "wallet.amount": wallet.items.amount.val()
        };

        com.post(api.payment.withdrawWallet, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info, "提现成功");
            wallet.modals.withdrawModal.modal("hide");
        })

    }

    //转账
    function transferWallet(){
        if (com.validate("transferModal")) return;

        //验证二维码
        if(wallet.items.transfercode.val() != wallet.phoneCode){
            com.showAlert(com.error, "验证码错误");
            return false;
        }

        var options = {
            "wallet.wid": wallet.currentWallet.wid,
            "wallet.amount": wallet.items.transferAmount.val(),
            "tallet.no": com.typeahead("transferUser")
        };

        com.post(api.payment.transferWallet, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info, "转账成功");
            wallet.modals.transferModal.modal("hide");
        })

    }

});

