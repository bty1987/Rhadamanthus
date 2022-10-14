$(function() {

    var walletard = {
        items: {
            bankNo: com.focusPage("#bankNo", "#walletard"),
            bankName: com.focusPage("#bankName", "#walletard"),
            validTime: com.focusPage("#validTime ", "#walletard"),
            cvv: com.focusPage("#cvv", "#walletard"),
            type: com.focusPage("#type", "#walletard"),
            mobile: com.focusPage("#mobile", "#walletard"),
            bindCardcode: com.focusPage("#bindCardcode", "#walletard")
        },
        modals: {
            bindCardModal: com.focusPage("#bindCardModal", "#walletard")
        },
        btns: {
            bindCardBtn: com.focusPage("#bindCardBtn", "#walletard"),
            bindCardgetCode: com.focusPage("#bindCardgetCode", "#walletard")
        },
        status: constant.payment.walletard.status.keys,
        types: constant.payment.walletard.type.keys,
        phoneCode: "1111",
        countdown: 60
    };

    // 绑定银行卡
    walletard.btns.bindCardBtn.click(bindCard);
    walletard.btns.bindCardgetCode.click(function() {
        paymentUtils.getCode(this, walletard, params.payment.phone);
    });

    walletard.modals.bindCardModal.on('hide.bs.modal', function() {

        com.closeTip();
        com.cleanItems(walletard.items);
        walletard.phoneCode = null;
    });

    walletard.items.type.bindData(constant.payment.walletard.type.datas, "key", "value");

    com.datetime(com.focusPage("#validTime"));

    initRecord();

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.bankName));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $unbind = $("<a></a>").addClass("btn btn-minier btn-yellow").html("解绑");
            var $delete = $("<a></a>").addClass("btn btn-minier btn-danger").html("删除");

            var customersArr = [
                ["卡号:", v.bankNo, "grey"],
                ["有效期:", v.validTime, "green"],
                ["类型:", walletard.types[v.type], "red"],
                ["状态:", walletard.status[v.status], "red"],
                ["电话:", v.mobile, "blue"],
                ["绑定时间:", v.bindTime, "green"],
                ["备注:", v.comment, "grey"]
            ];
            $.each(customersArr, function(index, value) {

                var $Lics = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($Lics);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
                $Lics.appendTo($ulProperty);
            });

            // 解绑
            $unbind.click(function() {

                com.showConfirm("确认要解绑当前银行卡吗?", function(res) {

                    com.post(api.payment.unbindWalletard, {"walletard.wcid": v.wcid}, function(res) {

                        com.showAlert(com.info, "解绑成功");
                        initRecord();
                    });
                });
            });

            // 删除
            $delete.click(function() {

                com.showConfirm("确认要删除当前银行卡吗?", function(res) {

                    com.post(api.payment.deleteWalletard, {"walletard.wcid": v.wcid}, function(res) {

                        com.showAlert(com.info, "删除成功");
                        initRecord();
                    });
                });
            });

            $divBtnWrap.append($unbind).append($delete);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    function initRecord() {

        com.post(api.payment.queryWalletard, {"walletard.wid": params.payment.wid}, function(res) {

            displayFunc.init('walletardResultList', res.walletards);
        });
    }

    // 银行卡弹窗
    com.focusPage("#bindCard").click(function() {

        walletard.modals.bindCardModal.modal("show");
    });

    // 绑定银行卡
    function bindCard() {

        if (com.validate("bindCardModal"))
            return;

        // 验证二维码
        if (walletard.items.bindCardcode.val() != walletard.phoneCode) {
            com.showAlert(com.error, "验证码错误");
            return false;
        }

        var options = {
            "walletard.wid": params.payment.wid,
            "walletard.bankNo": walletard.items.bankNo.val(),
            "walletard.bankName": walletard.items.bankName.val(),
            "walletard.validTime": walletard.items.validTime.val(),
            "walletard.cvv": walletard.items.cvv.val(),
            "walletard.type": walletard.items.type.val(),
            "walletard.mobile": walletard.items.mobile.val()
        };

        com.post(api.payment.bindWalletard, options, function(res) {

            initRecord();
            com.showAlert(com.info, "绑定成功");
            walletard.modals.bindCardModal.modal("hide");
        })

    }

});