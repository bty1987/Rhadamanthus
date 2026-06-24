jQuery(function($) {

    var proxyPayment = {
        type: params['urlLoadParams'].paytype,
        modals: {
            createProxyPaymentModal: com.focusPage("#createProxyPaymentModal", "#proxyPayment"),
            collectModal: com.focusPage("#collectModal", "#proxyPayment")
        },
        btns: {
            createBtn: com.focusPage("#createBtn", "#proxyPayment"),
            collectBtn: com.focusPage("#collectBtn", "#proxyPayment"),
            refundBtn: com.focusPage("#refundBtn", "#proxyPayment"),
            checkvAdd: com.focusPage("#checkvAdd", "#proxyPayment"),
            createPaytran: com.focusPage("#createPaytran", "#proxyPayment")
        },
        items: {
            title: com.focusPage("#title", "#proxyPayment"),
            name: com.focusPage("#name", "#proxyPayment"),
            phone: com.focusPage("#phone", "#proxyPayment"),
            address: com.focusPage("#address", "#proxyPayment"),
            money: com.focusPage("#money", "#proxyPayment"),

            cashCheckbox: com.focusPage("#cashCheckbox", "#proxyPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#proxyPayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#proxyPayment"),

            historyDiv: com.focusPage("#historyDiv", "#proxyPayment"),
            historyData: com.focusPage("#historyData", "#proxyPayment"),
            cashDiv: com.focusPage("#cashDiv", "#proxyPayment"),
            checkvDiv: com.focusPage("#checkvDiv", "#proxyPayment"),

            comment: com.focusPage("#comment", "#proxyPayment"),

            cash: com.focusPage("#cash", "#proxyPayment"),
            cashInfo: com.focusPage("#cashInfo", "#proxyPayment"),

            bankName: com.focusPage("#bankName", "#proxyPayment"),
            bank: com.focusPage("#bank", "#proxyPayment"),
            posway: com.focusPage("#posway", "#proxyPayment"),

            posDiv: com.focusPage("#posDiv", "#proxyPayment"),
            posGroup: com.focusPage("#posGroup", "#proxyPayment"),
            bankDiv: com.focusPage("#bankDiv", "#proxyPayment"),
            bankGroup: com.focusPage("#bankGroup", "#proxyPayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#proxyPayment"),

            referMoney: com.focusPage("#referMoney", "#proxyPayment")
        },
        paymentType: constant.payment().proxyPayment.type.keys,
        status: constant.payment().proxyPayment.status.keys,
        currentPpid: 0,

        cash: [],
        bank: [],
        checkv: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkvUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkvInfo: {},

        bankGrade: [],
        checkvGrade: [],

        htmlName: "proxy",
        typeNo: 7,
        atttype: 0,
        isexpires: constant.payment().proxyPayment.isexpire.keys,
        decoration: {}
    };

    // 隐藏触发
    proxyPayment.modals.createProxyPaymentModal.on('hide.bs.modal', function() {
        com.closeTip();
        com.cleanItems(proxyPayment.items);
    });

    proxyPayment.modals.collectModal.on('hide.bs.modal', function() {
        proxyPayment.bankGrade = [];
        proxyPayment.checkvGrade = [];

        proxyPayment.items.posGroup.html("");
        proxyPayment.items.bankGroup.removeClass('hide');
        proxyPayment.items.checkvGroup.html("");
        proxyPayment.items.historyData.html("");

        proxyPayment.items.bankName.removeClass("v_required v_typeahead");
        proxyPayment.items.bank.removeClass("v_required v_float_3");

        proxyPayment.payment = null;

        com.closeTip();
        com.cleanItems(proxyPayment.items);
    });

    proxyPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    com.focusPage("#collectModal :checkbox", "#proxyPayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#proxyPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    // 绑定收款单位的基础信息
    paymentUtils.getReceiptType(proxyPayment);

    // 现金方式
    com.selectTypeahead("cashInfo", proxyPayment.cashUtil, "key", "value", null);

    // 转账方式(银行)
    proxyPayment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(proxyPayment);
        return false;
    });

    proxyPayment.btns.collectBtn.bindClick(collect);

    proxyPayment.btns.refundBtn.bindClick(collect);

    proxyPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(proxyPayment, null);
        return false;
    });

    // 不同页面的不同参数
    proxyPayment.pageConfig = paymentUtils.getConfig(proxyPayment.type, 64);


    function paymentPropertyText(propertyArr) {

        var infos = [];

        $.each(propertyArr, function(index, value) {
            infos.push(value[0] + value[1]);
        });

        return infos.join(" ");
    }

    function drawPaymentProperties($ulProperty, propertyArr) {

        $.each(propertyArr, function(index, value) {

            var $liProperty = $('<li></li>').appendTo($ulProperty);
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

            if (value[3]) {
                $b.click(function() {
                    value[3]($b);
                }).css("cursor", "pointer");
            }
        });
    }

    function getProxyPropertyArr(v) {

        return paymentUtils.getPropertyArr(proxyPayment, v, v, proxyPayment.status);
    }

    function buildProxyLineprops() {

        var lineprops = [{
            type: "checkbox",
            name: "ppids",
            clazz: "ace ace-checkbox-2",
            value: function(v) {
                return v.arId;
            },
            show: function() {
                return proxyPayment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {
                return {
                    "ppid": v.ppid
                };
            }
        }, {
            field: "paymentInfo",
            name: "款项信息",
            type: "custom",
            prop: function(v) {
                return paymentPropertyText(getProxyPropertyArr(v));
            },
            render: function($liLine, v, $ulProperty) {
                drawPaymentProperties($ulProperty, getProxyPropertyArr(v));
            }
        }];

        if (proxyPayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {
                    return paymentUtils.getHistoryText(proxyPayment, v.proxyReceipt);
                },
                render: function($liLine, v) {
                    paymentUtils.drawHistoryData(proxyPayment, v.proxyReceipt, $liLine, "");
                }
            });
        }

        return lineprops;
    }

    function buildProxyLinebtns() {

        return {
            collect: {
                name: "收款",
                clazz: "btn-info",
                show: function(v) {
                    return v.type == constant.payment().proxyPayment.TYPE_COLLECT_INT && proxyPayment.pageConfig.pageBtn.contains("collect");
                },
                handle: function(v) {
                    paymentUtils.showPos(proxyPayment, {"paytran.pid": v.ppid}, [0, 1]);
                    initCollect(v);
                }
            }
        };
    }

    function buildProxyButtons() {

        var $createa = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'creates').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($createa);
        $('<span></span>').text('创建代付款').appendTo($createa);

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        $('<span></span>').text('批量确认').appendTo($adda);

        var btnParams = [];

        if (proxyPayment.pageConfig.pageBtn.contains("createProxy"))
            btnParams.push($createa);
        if (proxyPayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (proxyPayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($adda);

        return btnParams;
    }

    var searcher = new Searcher();

    var extraParams = {};
    if (proxyPayment.pageConfig.statusExtraParam != null && proxyPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["proxyPayment.status"] = proxyPayment.pageConfig.statusExtraParam[0];
    }

    searcher.set("condList", "pagenation", "resultList", proxyPayment.pageConfig.apiPage, extraParams, proxyPayment.pageConfig.condArr, "proxyPaymentPostData" + proxyPayment.type, null, false, buildProxyButtons);
    searcher.line("name", buildProxyLineprops(), buildProxyLinebtns()).render();

    // 创建代付款窗口
    com.focusPage('a[name="creates"]', '#pagenation').click(function() {
        proxyPayment.modals.createProxyPaymentModal.modal("show");
    });

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {
        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var options = {};
        var $inputs = com.focusPage('input[name="ppids"]:checked');

        $.each($inputs, function(i, v) {

            options["ppids[" + i + "]"] = $(v).attr('ppid');
        });

        if ($inputs.length == 0) {
            com.showAlert(com.warning, "当前未选择要确认的代付款项信息");
            return false;
        }

        com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {

            com.post(api.payment.confirmProxyPayment, options, function(res) {
                searcher.doSearch();
                com.showAlert(com.info, "确认成功")
            });
        });
    });

    proxyPayment.btns.createBtn.bindClick(function() {

        if (com.validate("createProxyPaymentModal"))
            return;

        var url = api.payment.addProxyPayment;
        var options = {
            "proxyPayment.title": proxyPayment.items.title.val(),
            "proxyPayment.name": proxyPayment.items.name.val(),
            "proxyPayment.phone": proxyPayment.items.phone.val(),
            "proxyPayment.address": proxyPayment.items.address.val(),
            "proxyPayment.referMoney": proxyPayment.items.money.val()
        };

        com.post(url, options, function(res) {
            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            proxyPayment.modals.createProxyPaymentModal.modal("hide");
        });
    });

    // 收款-初始化模态框
    function initCollect(payment) {

        com.cleanItems(proxyPayment.items);

        proxyPayment.items.historyDiv.hide();

        proxyPayment.payment = payment;

        proxyPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        proxyPayment.items.comment.removeAttr("disabled");

        var type = payment.type ; // 0: 收款类型 , 1: 退款类型

        if (proxyPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(proxyPayment);
        if (proxyPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(proxyPayment, type);
        if (proxyPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(proxyPayment);

        // 根据等级在数组中筛选出符合要求的用于显示
        //paymentUtils.initBankGrade(proxyPayment, grade);
        proxyPayment.bankGrade = proxyPayment.bankUtil;
        proxyPayment.checkvGrade = proxyPayment.checkvUtil;

        com.resetTypeahead(proxyPayment.items.bankName, proxyPayment.bankGrade);

        if (type == constant.payment().proxyPayment.TYPE_REFUND_INT) {// 退款

            com.focusPage("#myModalPayLabel").text("退款信息");

            proxyPayment.btns.collectBtn.addClass("hide");
            proxyPayment.btns.refundBtn.removeClass("hide");
        } else {

            com.focusPage("#myModalPayLabel").text("付款信息");

            proxyPayment.btns.collectBtn.removeClass("hide");
            proxyPayment.btns.refundBtn.addClass("hide");
        }

        proxyPayment.modals.collectModal.modal("show");
    }

    // 收款
    function collect() {

        if (com.validate("collectModal", "#proxyPayment")) {
            return false;
        }

        var url = "";
        var options = {};

        var realPayment = 0;
        var referPayment = proxyPayment.items.referMoney.val();
        var comment = proxyPayment.items.comment.val();
        var type = 0;

        var payment = proxyPayment.payment;

        if (payment.type == constant.payment().proxyPayment.TYPE_COLLECT_INT && payment.status == constant.payment().proxyPayment.STATUS_INIT_INT) {
            url = api.payment.collectProxyPayment;
            options["proxyReceipt.comment"] = comment;
        } else if (payment.type == constant.payment().proxyPayment.TYPE_REFUND_INT && payment.status == constant.payment().proxyPayment.STATUS_INIT_INT) {
            url = api.payment.refundProxyPayment;
            options["proxyReceipt.comment"] = comment;
            type = 1;
        }

        var cash = paymentUtils.paramCash(proxyPayment, "proxyReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));

        var bank = paymentUtils.paramBank(proxyPayment, proxyPayment.payment, "proxyReceipt", options, type);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(proxyPayment, "proxyReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));

        if (referPayment != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if ($.isEmptyObject(options)) {
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        options["proxyPayment.ppid"] = payment.ppid;

        com.post(url, options, function(res) {

            searcher.doSearch();
            proxyPayment.modals.collectModal.modal("hide");
        });
    }

});
