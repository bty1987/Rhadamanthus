var materialSubOrderCollectionPostData = {};

jQuery(function($) {

    com.focusPage('#fl-statement').statement("主材子订单", "收款信息");

    var materialSubOrderCollection = {

        materialPaymentTypeData: {
            "1": "预付款",
            "2": "定金",
            "3": "补款",
            "4": "退款",
            "5": "补款退款",
            "6": "券退款"
        },
        materialPaymentRevTypeData: {
            "预付款": "1",
            "定金": "2",
            "补款": "3",
            "退款": "4",
            "补款退款": "5",
            "券退款": "6"
        },

        bankType: {},
        couponType: {},
        accountsType: {},

        saveBtn: null,
        cancelBtn: null,

        baseModal: null,
        addOrReduceModal: null,
        refundModal: null,
        materialSubOrderCollectionItems: {},

        editFlg: false,
        historyFlag: false,
        batchFlag: true,

        queryUrl: null,
        queryMpid: null,
        paymentType: null,
        flag: null,
    };

    materialSubOrderCollectionPostData["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
    materialSubOrderCollection.queryMpid = materialSubOrderPostData["materialSubOrderPostBalance.mpId"];
    materialSubOrderCollection.paymentType = materialSubOrderPostData["materialSubOrderPostBalance.type"];
    materialSubOrderCollection.flag = materialSubOrderPostData["flag"];

    com.post(api.data.queryReceiptType, {}, function(res) {

        materialSubOrderCollection.cash = [];
        materialSubOrderCollection.bank = [];
        materialSubOrderCollection.checkBank = [];
        materialSubOrderCollection.accounts = [];
        materialSubOrderCollection.couponType = [];

        materialSubOrderCollection.bankInfo = {};

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == 1) {
                materialSubOrderCollection.cash.push(v);
            } else if (v.type == 2) {
                materialSubOrderCollection.bank.push(v);
                materialSubOrderCollection.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                materialSubOrderCollection.checkBank.push(v);
            } else if (v.type == 4) {
                materialSubOrderCollection.accounts.push(v);
            } else if (v.type == 5) {
                materialSubOrderCollection.couponType.push(v);
            }
        });

        com.focusPage("#bankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#checkvBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#installmentBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#accountsBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#refundBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#accountsBankName").bindData(materialSubOrderCollection.accounts, 'no', 'value');
        com.focusPage("#couponType").bindData(materialSubOrderCollection.couponType, 'no', 'value');
    }, null, false);

    com.post(api.ds.payment, {}, function(res) {

        for ( var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            materialSubOrderCollection.materialPaymentTypeData[paymentType.key] = paymentType.value;
            materialSubOrderCollection.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    if (materialSubOrderCollection.paymentType == 0 || materialSubOrderCollection.flag == true) {
                        var $liLine = $('<li></li>').addClass('item-orange clearfix');
                        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(materialSubOrderCollection.materialPaymentTypeData[v.paymentType]));
                        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                        var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                        var propertyArr = [["主材单号:", v.material.no, "blue"], ["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["应收额:", v.referMoney, "blue"], ["实收额:", v.referMoney, "blue"], ["收款时间:", v.collectTime, "green"], ["状态:", v.paymentStatus == 0 ? '待收款' : v.paymentStatus == 1 ? '待确认' : '已确认', "red"]];

                        $.each(propertyArr, function(index, value) {

                            var $liProperty = $('<li></li>');
                            $('<strong></strong>').html(value[0]).appendTo($liProperty);
                            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                            $liProperty.appendTo($ulProperty);
                        });

                        var styleArr = [];

                        v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
                        v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                            var info = bank + ", ";
                            var _s = bankInfo.split('#');
                            for ( var i = 1; i < _s.length - 1; i++) {
                                var _i = _s[i].split('|');
                                info += materialSubOrderCollection.bankInfo[_i[0]] + " " + _i[1] + ", ";
                            }

                            return info;
                        })(v.bank, v.bankInfo), "blue"]) : true;
                        v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "blue"]) : true;
                        v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
                        v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
                        v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
                        v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

                        $.each(styleArr, function(index, value) {

                            var $liProperty = $('<li></li>');
                            $('<strong></strong>').html(value[0]).appendTo($liProperty);
                            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                            $liProperty.appendTo($ulStyle);
                        });

                        $liLine.append($h3).append($ulProperty).append($ulStyle).appendTo($ul);
                    } else {
                        if (materialSubOrderCollection.queryMpid == v.mpId) {
                            var $_liLine = $('<li></li>').addClass('item-orange clearfix');
                            var $_h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(materialSubOrderCollection.materialPaymentTypeData[v.paymentType]));
                            var $_ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                            var $_ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                            var _propertyArr = [["主材单号:", v.material.no, "blue"], ["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["应收额:", v.referMoney, "blue"], ["实收额:", v.referMoney, "blue"], ["收款时间:", v.collectTime, "green"], ["状态:", v.paymentStatus == 0 ? '待收款' : v.paymentStatus == 1 ? '待确认' : '已确认', "red"]];

                            $.each(_propertyArr, function(index, value) {

                                var $_liProperty = $('<li></li>');
                                $('<strong></strong>').html(value[0]).appendTo($_liProperty);
                                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($_liProperty);
                                $_liProperty.appendTo($_ulProperty);
                            });

                            var _styleArr = [];

                            v.cash != null && v.cash != "0" ? _styleArr.push(["现金:", v.cash, "blue"]) : true;
                            v.bank != null && v.bank != "0" ? _styleArr.push(["银行:", (function(bank, bankInfo) {

                                var info = bank + ", ";
                                var _s = bankInfo.split('#');
                                for ( var i = 1; i < _s.length - 1; i++) {
                                    var _i = _s[i].split('|');
                                    info += materialSubOrderCollection.bankInfo[_i[0]] + " " + _i[1] + ", ";
                                }

                                return info;
                            })(v.bank, v.bankInfo), "grey"]) : true;
                            v.checkv != null && v.checkv != "0" ? _styleArr.push(["转账:", v.checkv, "blue"]) : true;
                            v.installment != null && v.installment != "0" ? _styleArr.push(["分期:", v.installment, "blue"]) : true;
                            v.accounts != null && v.accounts != "0" ? _styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
                            v.advance != null && v.advance != "0" ? _styleArr.push(["预付款:", v.advance, "blue"]) : true;
                            v.coupon != null && v.coupon != "0" ? _styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

                            $.each(_styleArr, function(index, value) {

                                var $_liProperty = $('<li></li>');
                                $('<strong></strong>').html(value[0]).appendTo($_liProperty);
                                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($_liProperty);
                                $_liProperty.appendTo($_ulStyle);
                            });

                            $_liLine.append($_h3).append($_ulProperty).append($_ulStyle).appendTo($ul);
                        }

                    }

                });

                $ul.appendTo($tableWrap);
            }
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init([], "condList", api.payment.queryMaterialPaymentByMid, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", null, materialSubOrderCollectionPostData, true, "materialPayments");

    com.focusPage('#back').click(function() {

        com.switchPage(params.historyPage);
    });

});
