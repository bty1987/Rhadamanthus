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

    paytran.items.way.bindData(constant.payment().receiptType.posway.datas, "key", "value");

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
            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": orderIdVal
            }, function(res) {

                paytran.decoration = res.decoration;
            }, null, false);
        }

        if (!paytran.decoration) return false;

        var grade = "";
        var atttype = paytran.items.atttype.val();

        if (atttype == constant.payment().paytran.ATTTYPE_DECORATION_INT) {
            grade = ["A", "C"].contains(paytran.decoration.grade) ? "A" : "";
        } else if (atttype == constant.payment().paytran.ATTTYPE_MATERIAL_INT) {
            grade = paytran.decoration.grade == "C" ? "B" : "";
        }

        com.selectTypeahead(paytran.items.bankName, paytran.bankGrade, "key", "value", null);
        paymentUtils.initBankGrade(paytran, grade);

    }

    paytran.items.orderId.on('blur', function() {
        initBank();
    });

    paytran.items.atttype.on('change', function() {
        initBank();
    });

    function cancelPaytran(v) {

        com.post(api.payment.cancelPaytran, {
            "paytran.ptid": v.ptid
        }, function() {
            com.showAlert(com.info, "撤销完成");
            searcher.doSearch();
        });
    }

    function checkPaytran(v) {

        com.post(api.payment.checkPaytran, {
            "paytran.ptid": v.ptid
        }, function() {
            com.showAlert(com.info, "验证完成");
            searcher.doSearch();
        });
    }

    function deletePaytran(v) {

        com.post(api.payment.deletePaytran, {
            "paytran.ptid": v.ptid
        }, function() {
            com.showAlert(com.info, "删除成功");
            searcher.doSearch();
        });
    }

    function codePaytran(v) {

        com.focusPage("#paytranCodeQrcodeModal").html("");
        paymentUtils.initQrcode("paytran", "paytranCodeQrcodeModal");
        var pid = v.type == '6' ? v.ptid : v.pid;
        paymentUtils.showQRCode("paytranqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.orderId + "&paymentType=" + v.type + "&pid=" + pid + "&atttype=" + v.atttype, "paytranCodeQrcodeModal");
    }

    function wechatPaytran(v) {

        com.showConfirm("是否发送付款通知", function() {
            com.post(api.payment.sendPaytran, {
                "paytran.ptid": v.ptid
            }, function() {
                com.showAlert(com.info, "发送成功");
            });
        });
    }

    function posPaytran(v) {

        com.closeTip();
        com.cleanItems(paytran.items);
        paytran.currentPtid = v.ptid;
        paytran.modals.posPayModal.modal("show");
    }

    var lineprops = (function() {

        return [{
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "blue"
        }, {
            field: "atttype",
            name: "业务类型",
            prop: function(v) {
                return v.atttype == 0 ? "装修" : "主材";
            },
            clazz: "red"
        }, {
            field: "no",
            name: "收据名称",
            prop: "no",
            clazz: "blue"
        }, {
            field: "sn",
            name: "机器编号",
            prop: "sn",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {
                return constant.payment().paytran.status.keys[v.status];
            },
            clazz: "red"
        }, {
            field: "money",
            name: "金额",
            prop: "money",
            clazz: "green"
        }, {
            field: "creater",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "pushTime",
            name: "推送时间",
            prop: "pushTime",
            clazz: "green"
        }];
    })();

    var linebtns = (function() {

        var show = function(v) {
            return v.status == constant.payment().paytran.STATUS_INIT_INT;
        };

        return {
            cancel: {name: "撤销", clazz: "btn-danger", show: show, handle: cancelPaytran},
            check: {name: "验证", clazz: "btn-orange", show: show, handle: checkPaytran},
            delete: {name: "删除", clazz: "btn-inverse", show: show, handle: deletePaytran},
            code: {name: "收款码", clazz: "btn-purple", show: show, handle: codePaytran},
            wechat: {name: "微信推送", clazz: "btn-success", show: show, handle: wechatPaytran},
            pos: {name: "POS推送", clazz: "btn-warning", show: show, handle: posPaytran}
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('创建转换款').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.payment.pagePaytran, null, ["payment-orderId", "payment-point-sn", "payment-activity-creater-name", "payment-createTime", "payment-paymentType", "payment-point-status"], "paytranPostData", null, false, buttons);
    searcher.line(function(v) {
        return constant.payment().receipt.paymentType.keys[v.type];
    }, lineprops, linebtns).render();

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
            "paytran.sn": paytran.posValues[com.typeahead(paytran.items.bankName)].value, // 收据类型中pos的value值
            "paytran.way": 0
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            paytran.modals.createPaytranModal.modal("hide");
        });
    }, 3000);

    paytran.btns.posConfirmBtn.bindClick(function() {

        var option = {
            "paytran.ptid": paytran.currentPtid,
            "paytran.way": paytran.items.way.val()
        };

        com.post(api.payment.posPay, option, function(res) {

            com.showAlert(com.info, "推送成功");
        });
    }, 3000);

});
