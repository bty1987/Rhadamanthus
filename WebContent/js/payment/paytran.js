jQuery(function($) {

    paytran = {
        modals: {
            createPaytranModal: com.focusPage("#createPaytranModal", "#paytranContent"),
            posPayModal: com.focusPage("#posPayModal", "#paytranContent")
        },
        btns: {
            confirmBtn: com.focusPage("#confirmBtn", "#paytranContent"),
            posConfirmBtn: com.focusPage("#posConfirmBtn", "#paytranContent")
        },
        items: {
            orderId: com.focusPage("#orderId", "#createPaytranModal"),
            bankName: com.focusPage("#bankName", "#createPaytranModal"),
            money: com.focusPage("#money", "#createPaytranModal"),
            atttype: com.focusPage("#atttype", "#createPaytranModal"),
            way: com.focusPage("#way", "#posPayModal")
        },

        posValues: {},
        currentPtid: 0,

        decoration: null,

        bank: [],
        checkv: [],
        bankGrade: [],
        checkvGrade: []

    };

    // 隐藏触发
    paytran.modals.createPaytranModal.on('hide.bs.modal', function() {

        com.closeTip();
        com.cleanItems(paytran.items);

        paytran.decoration = null;
    });

    paytran.items.way.bindData(constant.payment.receiptType.posway.datas, "key", "value");

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type != constant.data().receiptType.TYPE_CARD_INT)
                return true;

            if (v.status != constant.data().receiptType.STATUS_ENABLE_INT)
                return true;

            paytran.bank.push(v);
            paytran.posValues[v.no] = v;

        });
    }, null, false);

    function initBank() {

        paytran.decoration = null;

        com.cleanTypeahead(paytran.items.bankName);
        var orderIdVal = paytran.items.orderId.val();

        if (!paytran.decoration && orderIdVal != "") {
            com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": orderIdVal}, function(res) {
                paytran.decoration = res.decoration;
            }, null, false);
        }

        if (!paytran.decoration) return false;

        var grade = null;
        var atttype = paytran.items.atttype.val();

        if (atttype == constant.payment.paytran.ATTTYPE_DECORATION_INT) {
            grade = ["A", "C"].contains(paytran.decoration.grade) ? "A" : "";
        } else if (atttype == constant.payment.paytran.ATTTYPE_MATERIAL_INT) {
            grade = paytran.decoration.grade == "C" ? "B" : "";
        }

        if (!grade) return false;

        com.selectTypeahead(paytran.items.bankName, paytran.bankGrade, "key", "value", null);
        paymentUtils.initBankGrade(paytran, grade);

    }

    paytran.items.orderId.on('blur', function() {
        initBank();
    });

    paytran.items.atttype.on('change', function() {
        initBank();
    });

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(constant.payment.receipt.paymentType.keys[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $cancel = $('<a></a>').addClass('btn btn-minier btn-danger').html('撤销');
            var $check = $('<a></a>').addClass('btn btn-minier btn-orange').html('验证');
            var $code = $('<a></a>').addClass('btn btn-minier btn-purple').html('收款码');
            var $wechat = $('<a></a>').addClass('btn btn-minier btn-success').html('微信推送');
            var $pos = $('<a></a>').addClass('btn btn-minier btn-warning').html('POS推送');

            var propertyArr = [
                ["装修单号:", v.orderId, "blue"],
                ["业务类型:", v.atttype == 0 ? "装修" : "主材", "red"],
                ["收据名称:", v.no, "blue"],
                ["机器编号:", v.sn, "blue"],
                ["状态:", constant.payment.paytran.status.keys[v.status] , "red"],
                ["金额:", v.money, "green"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "green"]
            ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($cancel).append($check).append($code).append($wechat).append($pos);

            if (v.status == constant.payment.paytran.STATUS_INIT_INT) {
                $divBtnWrap.appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $cancel.click(function() {

                com.post(api.payment.cancelPaytran, {"paytran.ptid": v.ptid}, function(res) {
                    com.showAlert(com.info, "撤销完成");
                    searcher.doSearch();
                });

                return false;
            });

            $check.click(function() {

                com.post(api.payment.checkPaytran, {"paytran.ptid": v.ptid}, function(res) {
                    com.showAlert(com.info, "验证完成");
                    searcher.doSearch();

                });

                return false;
            });

            $code.click(function() {

                com.focusPage("#paytranCodeQrcodeModal").html("");
                paymentUtils.initQrcode("paytran", "paytranCodeQrcodeModal"); // 收款码
                var pid = v.type == '6' ? v.ptid : v.pid;
                paymentUtils.showQRCode("paytranqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.orderId + "&paymentType=" + v.type + "&pid=" + pid, "paytranCodeQrcodeModal");
            });

            $wechat.click(function() {

                com.showConfirm("是否发送付款通知", function() {

                    com.post(api.payment.sendPaytran, {
                        "paytran.ptid": v.ptid
                    }, function(res) {

                        com.showAlert(com.info, "发送成功");
                    });
                });

                return false;
            });

            $pos.click(function() {

                com.closeTip();
                com.cleanItems(paytran.items);
                paytran.currentPtid = v.ptid;
                paytran.modals.posPayModal.modal("show");
            });

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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["payment-orderId", "payment-point-sn", "payment-activity-creater-name", "payment-createTime", "payment-paymentType", "payment-point-status"], "condList", api.payment.pagePaytran, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "paytranPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('创建转换款').appendTo($adda);

        return [$adda];
    });

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        paytran.modals.createPaytranModal.modal("show");
    });

    paytran.btns.confirmBtn.bindClick(function() {

        if (com.validate("createPaytranModal"))
            return;

        var url = api.payment.addPaytran;
        var options = {
            "paytran.orderId": paytran.items.orderId.val(),
            "paytran.money": paytran.items.money.val(),
            "paytran.type": 6,
            "paytran.atttype": paytran.items.atttype.val(),
            "paytran.no": com.typeahead(paytran.items.bankName),
            "paytran.sn": paytran.posValues[com.typeahead(paytran.items.bankName)].value
            // 收据类型中pos的value值
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            paytran.modals.createPaytranModal.modal("hide");
        });
    });

    paytran.btns.posConfirmBtn.bindClick(function() {

        var option = {
            "paytran.ptid": paytran.currentPtid,
            "paytran.way": paytran.items.way.val()
        };

        com.post(api.payment.posPay, option, function(res) {

            com.showAlert(com.info, "推送成功");
        });
    });

});
