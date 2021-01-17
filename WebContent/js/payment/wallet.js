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
        types: [],
        status: [],
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

    com.post(api.ds.payment, {}, function (res) {
        $.each(res.walletType, function (i, v) {
            wallet.types[v.key] = v.value;
        });

        $.each(res.walletStatus, function (i, v) {
            wallet.status[v.key] = v.value;
        });
    }, null, false);

    com.initTypeahead('transferUser', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.belonger.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $bind = $("<a></a>").addClass("btn btn-minier btn-info").html("绑定");
            var $update = $("<a></a>").addClass("btn btn-minier btn-yellow").html("更新");
            var $freeze = $("<a></a>").addClass("btn btn-minier btn-success").html("冻结");
            var $unfreeze = $("<a></a>").addClass("btn btn-minier btn-warning").html("解冻");
            var $withdraw = $("<a></a>").addClass("btn btn-minier btn-pink").html("提现");
            var $transfer = $("<a></a>").addClass("btn btn-minier btn-danger").html("转账");
            var $cards = $("<a></a>").addClass("btn btn-minier btn-purple").html("银行卡");
            var $walletran = $("<a></a>").addClass("btn btn-minier btn-inverse").html("交易记录");

            var propertyArr = [
                ["编号:", v.no, "grey"],
                ["电话:", v.phone, "blue"],
                ["身份证:", v.identity, "blue"],
                ["余额:", v.balance, "blue"],
                ["类型:", wallet.types[v.type], "red"],
                ["状态:", wallet.status[v.status], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($bind).append($update).append($freeze).append($unfreeze).append($withdraw).append($transfer).append($cards).append($walletran);
            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //绑定
            $bind.click(function(){
                wallet.currentWallet = v;
                wallet.items.title.html("绑定信息");
                wallet.bindOrupdate = "bind";
                wallet.items.phone.attr("disabled", true);
                wallet.items.phone.val(v.phone);
                wallet.modals.bindModal.modal("show");
            });

            //更新
            $update.click(function(){
                wallet.currentWallet = v;
                wallet.items.title.html("更新信息");
                wallet.bindOrupdate = "update";
                wallet.items.phone.removeAttr("disabled");
                wallet.items.phone.val(v.phone);
                wallet.modals.bindModal.modal("show");
            });

            //冻结
            $freeze.click(function(){
                com.showConfirm("确认要冻结该账户吗?", function(res) {
                    com.post(api.payment.freezeWallet, {"wallet.wid": v.wid}, function(res){
                        com.showAlert(com.info, "冻结成功");
                        searcher.doSearch();
                    });
                });
            });

            //解冻
            $unfreeze.click(function(){
                com.showConfirm("确认要解冻该账户吗?", function(res) {
                    com.post(api.payment.unfreezeWallet, {"wallet.wid": v.wid}, function(res){
                        com.showAlert(com.info, "解冻成功");
                        searcher.doSearch();
                    });
                });
            });

            //提现
            $withdraw.click(function(){
                com.post(api.payment.queryWalletard, {"walletard.wid": v.wid}, function(res){
                    wallet.currentWallet = v;
                    wallet.items.card.bindData(res.walletards, "wcid", "bankName");
                    wallet.modals.withdrawModal.modal("show");
                });
            });

            //转账
            $transfer.click(function(){
                wallet.currentWallet = v;
                wallet.modals.transferModal.modal("show");
            });

            //银行卡
            $cards.click(function(){
                params.wid = v.wid;
                params.phone = v.phone;
                com.popup4page('#walletardPopup', "views/payment/walletard.html", "银行卡");
            });

            //交易记录
            $walletran.click(function(){
                params.wid = v.wid;
                com.popup4page('#walletranPopup', "views/payment/walletran.html", "交易记录");
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["payment-wallet-belonger-name"], "condList", api.payment.pageWallet, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "walletPostData", null, false, null, null);

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

