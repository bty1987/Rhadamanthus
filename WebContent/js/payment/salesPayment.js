
$(function () {
    var salesPayment = {
        salesPaymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        couponType: {},
        couponTypeData: {},
        customerId: null,
        items: {},
        validator: {
            price: {
                type: 'v_price',
                regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
                errorMsg: "价格内容输入错误"
            }
        },
        bankNums: [],
        checkvNums: [],
        collectOrRefundFalg: null,
        coupon: 0,
        couponInfo: null,
        firstSid: 0,
        spids: []
    };

    var salesPaymentPostData = {};

    salesPayment.items.couponType = com.focusPage('#couponType');

    salesPayment.cash = [];
    salesPayment.bank = [];
    salesPayment.bankUtil = [];
    salesPayment.checkBank = [];
    salesPayment.accounts = [];
    salesPayment.couponType = [];

    salesPayment.cashUtil = [];
    salesPayment.bankUtil = [];
    salesPayment.checkBankUtil = [];

    salesPayment.cashInfo = {};
    salesPayment.bankInfo = {};
    salesPayment.checkBankInfo = {};
    salesPayment.accountsInfo = {};
    salesPayment.couponTypeData = {};

    com.post(api.common.queryReceiptType, {}, function (res) {
        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 1) {
                salesPayment.cash.push(v);
                salesPayment.cashUtil.push({"key":v.no,"value":v.name});
                salesPayment.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesPayment.bank.push(v);
                salesPayment.bankUtil.push({"key":v.no,"value":v.name});
                salesPayment.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesPayment.checkBank.push(v);
                salesPayment.checkBankUtil.push({"key":v.no,"value":v.name});
                salesPayment.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesPayment.accounts.push(v);
                salesPayment.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesPayment.couponType.push(v);
                salesPayment.couponTypeData[v.no] = [v.no, v.name];
            }
        });

        com.focusPage("#couponType").bindData(salesPayment.couponType, 'no', 'name');
        com.focusPage("#couponType").trigger("chosen:updated");
    }, null, false);

    paymentUtils.dynamicChosen('layerAdd',"salescashInfo",salesPayment.cashUtil,"key","value");

    $.extend(com.validator, salesPayment.validator);

    com.focusPage("#historySales").removeClass("active");

    com.post(api.ds.payment, {}, function (res) {
        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPayment.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    com.focusPage("#advanceType").bindData([{"key": "1", "value": "合同预付款"}, {"key": "2", "value": "工程预付款"}, {"key": "3", "value": "主材预付款"}, {"key": "4", "value": "正林预付款"}], 'key', 'value');

    var advanceType = null;

    com.focusPage("#advanceCheckbox").on("click", function () {
        changeValue();
    });

    com.focusPage("#advanceType").on("change", function () {
        changeValue();
    });

    function changeValue() {
        advanceType = com.focusPage("#advanceType option:checked").val();
        var typeStr = "";

        if (advanceType == 1) {
            typeStr = "balanceAdvance";
        } else if (advanceType == 2) {
            typeStr = "projectAdvance";
        } else if (advanceType == 3) {
            typeStr = "materialAdvance";
        } else if (advanceType == 4) {
            typeStr = "zaterialAdvance";
        }

        var orderId = com.focusPage('#layerAdd').attr('orderId');

        com.post(api.payment.queryAdvancePaymentByOrderId, {"decoration.orderId": orderId}, function (res) {
            com.focusPage("#advance").val(res[typeStr]).attr("readonly", "readonly");
        }, null, false);
    }

    com.focusPage("#couponType").chosen({width: "100%", multi_type: "input"});
    com.focusPage("#refundCouponType").chosen({width: "100%", multi_type: "input"});

    com.focusPage("#salesbankAdd").on('click',function(){
        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;
        $(this).attr("num", nextNum);

        var maxNum = $(this).attr("maxnum");
        maxNum = parseInt(maxNum)+1;
        $(this).attr("maxnum", maxNum);
        paymentUtils.addBankUtil(maxNum, "bankDiv", "#salesbankDivGroup", salesPayment.bankNums, salesPayment.bankUtil, "sales");

        return false;
    });

    com.focusPage("#salescheckvAdd").on('click',function(){
        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;
        $(this).attr("num", nextNum);

        var maxNum = $(this).attr("maxnum");
        maxNum = parseInt(maxNum)+1;
        $(this).attr("maxnum", maxNum);
        paymentUtils.addBankUtil(maxNum, "checkvDiv", "#salescheckvDivGroup", salesPayment.checkvNums, salesPayment.checkBankUtil, "sales");

        return false;
    });

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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单:", v.sales.no, "blue"],
                ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                ["客户:", v.sales.customer.name, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["操作人:", v.creater.currentName, "grey"],
                ["应收金额:", v.referMoney, "blue"]
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': '#478fca !important',
                'font-size': '17px'
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "spids",
                "class": "",
                "sid": v.sales.sid,
                "spid": v.spid,
                "orderId": v.sales.orderId,
                "referMoney": v.referMoney,
                "customerId": v.sales.customer.cid,
                "paymentType": v.type
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(salesPayment.salesPaymentTypeData[v.type]);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.appendTo($h3);

            $divBtnWrap.append($btnCollect).appendTo($h3);
            if ([4, 5, 6, 7].indexOf(v.type) != -1) {
                $btnCollect.text('退款').addClass("btn-danger");
            } else {
                $btnCollect.text('收款').addClass("btn-info");
            }

            $liLine.append($h3).append($ulProperty);
            $btnCollect.click(function () {
                com.focusPage("#myModalLabel").html($btnCollect.html() + "信息");
                com.focusPage('#layerAdd').attr('orderId', v.sales.orderId);
                com.focusPage('#referMoney').val(v.referMoney);
                com.focusPage('#advanceCheckbox').removeAttr('disabled');
                com.focusPage('#couponCheckbox').removeAttr('disabled');
                com.focusPage('#collectDes').removeAttr('readonly');
                com.focusPage("#historyUpdateSA").addClass("hide");
                com.focusPage("#couponDiv div.form-group").removeClass("hide");
                com.focusPage('.couponBlue').remove();
                com.focusPage('#advanceType').val(1).removeAttr("disabled");
                com.focusPage('#payAdvance').removeAttr("readonly");

                var $layerrAdd = com.focusPage('#layerAdd');
                $layerrAdd.attr('spid', v.spid);
                $layerrAdd.attr('sid', v.sales.sid);

                if ($btnCollect.text() == '退款') {
                    salesPayment.collectOrRefundFalg = 2;
                    com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
                }
                if ($btnCollect.text() == '收款') {
                    salesPayment.collectOrRefundFalg = 1;
                    com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
                    com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
                    com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#couponCheckbox').parents('.inline').addClass('show');
                }

                com.focusPage("#layerAdd").modal("show");
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
        };
    })();

    var salesPaymentSearcher = new Searcher();
    salesPaymentSearcher.init(["salesPaymentOrderId", "salesPaymentNo", "salesPaymentUserName", "salesPaymentVillage"], 'condList', api.payment.pageSalesPaymentForInit, function (data) {
        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesPaymentPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

        $adda.click(function () {
            salesPayment.collectOrRefundFalg = 3;

            com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
            com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
            com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
            com.focusPage('#couponCheckbox').parents('.inline').addClass('hidden');

            com.focusPage('#advanceCheckbox').removeAttr('disabled');
            com.focusPage('#collectDes').removeAttr('readonly');
            com.focusPage("#historyUpdateSA").addClass("hide");
            com.focusPage('#advanceType').val(1).removeAttr("disabled");
            com.focusPage('#payAdvance').removeAttr("readonly");

            var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

            if (!$inputs.length) return;

            var _orderId = "";
            var _paymentType = 0;
            var _paymentTypeFlag = 0;
            var _customerId = "";
            var _sid = [];
            var sid = [];
            var orderIdArr = [];
            var orderId = [];
            var spids = [];
            var sumMoney = 0;
            var referMoney = 0;
            var flags = [];
            var flag = 0;

            salesPaymentPostData.paymentInfo = [];

            $.each($inputs, function (i, v) {
                var $input = $(v);
                orderIds = $input.attr("orderid");

                var row = {
                    "sid": $input.attr('sid'),
                    "orderId": $input.attr("orderid"),
                    "customerId": $input.attr("customerid"),
                    "paymentType": $input.attr("paymentType"),
                    "referMoney": $input.attr("refermoney"),
                    "spid": $input.attr("spid")
                };

                flags.push(row.paymentType);
                salesPaymentPostData.orderId = _orderId;
                salesPaymentPostData.customerId = _customerId;

                if (_paymentType == 0) {
                    _paymentType = row.paymentType;
                }

                if ([4, 5, 6, 7].indexOf(row.paymentType) != -1) {
                    sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
                    if ([4, 5, 6, 7].indexOf(_paymentType) == -1) {
                        _paymentTypeFlag = 3;
                    }
                } else {
                    sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
                    if ([4, 5, 6, 7].indexOf(_paymentType) != -1) {
                        _paymentTypeFlag = 3;
                    }
                }

                salesPaymentPostData.paymentInfo.push(row);

                _sid.push(row.sid);
                spids.push(row.spid);
                orderIdArr.push(row.orderId);
                referMoney += parseFloat(row.referMoney);
            });

            com.focusPage('#layerAdd').attr('orderId', orderIds);

            for (var i = 0; i < _sid.length; i++) {
                var items = _sid[i];
                if ($.inArray(items, sid) == -1) {
                    sid.push(items);
                }
            }

            $.each(orderIdArr, function (i, v) {
                if ($.inArray(v, orderId) == -1) {
                    orderId.push(v);
                }
            });

            $.each(flags, function (i, v) {
                if (["4", "5", "6", "7"].indexOf(v) != -1) {
                    flag = 1;
                }
            });

            if (flag == 1) {
                com.showAlert(com.warning, "批量收款不支持退款");
                return false;
            }

            if (orderId.length != 1) {
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
                return false;
            }

            com.focusPage('#referMoney').val(referMoney);

            salesPayment.firstSid = sid[0];
            salesPayment.spids = spids;

            com.focusPage("#layerAdd").modal('show');
        });

        var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
        var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
        var $showspan = $('<span></span>').text('合计').appendTo($showa);

        $showa.click(function () {
            var $total = 0;
            var $inputs = com.focusPage('input[name="spids"]:checked');

            $inputs.length && ($.each($inputs, function (i, v) {
                var $that = $(v);
                var $type = parseInt($that.attr('paymentType'));
                var $referMoney = $that.attr('referMoney');

                if ([4, 5, 6, 7].indexOf($type) != -1) {
                    $total = utils.accSub($total, $referMoney);
                } else {
                    $total = utils.accAdd($total, $referMoney);
                }
            }), showInfo('<h3>合计金额: ' + $total + '</h3>'));
        });

        return [$adda, $showa];
    }, 'resultList');

    var hdisplayFunc = (function () {
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                ["客户:", v.sales.customer.name, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["操作人:", v.creater.currentName, "grey"],
                ["应收金额:", v.referMoney, "blue"],
                ["收款人:", v.salesReceipt.collecter.currentName, "grey"],
                ["收款时间:", v.salesReceipt.collectTime, "green"],
                ["状态:", v.status == 1 ? '已付款' : '已确认', "red"],
                ["备注:", v.salesReceipt.comment, "grey"]
            ];

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "hspids",
                "class": "",
                "spId": v.spId,
                "srId": v.salesReceipt.srId,
                "orderId": v.sales.orderId,
                "referMoney": v.referMoney,
                "customerId": v.sales.customer.cid,
                "paymentType": v.type
            }).val(v.arId);
            var $span = $('<span></span>').addClass('lbl');

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var styleArr = [];

            v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? styleArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.salesReceipt.bank, v.salesReceipt.bankInfo, salesPayment.bankInfo), "blue"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.salesReceipt.checkv, v.salesReceipt.checkvBank, salesPayment.checkBankInfo), "blue"]) : true;
            v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? styleArr.push(["分期:", v.salesReceipt.installment, "blue"]) : true;
            v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? styleArr.push(["对公帐户:", v.salesReceipt.accounts, "blue"]) : true;
            v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? styleArr.push(["预付款:", v.salesReceipt.advance, "blue"]) : true;
            v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? styleArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "blue"]) : true;

            $.each(styleArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulStyle);
            });

            $label.append($input).append($span);
            $h3.append($('<small></small>').addClass('blue').html(salesPayment.salesPaymentTypeData[v.type]));

            $divBtnWrap.append($btnPrint).appendTo($h3);

            if(v.status == 1){
                $divBtnWrap.append($btnUpdate);
            }

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint.click(function () {
                printPayment(v.sales.orderId, v.salesReceipt.srId, v);
            });

            //更新功能
            $btnUpdate.click(function(){
                com.focusPage("#myModalLabel").html("更新款项信息");
                salesPayment.collectOrRefundFalg = 4;
                var $layerrAdd = com.focusPage('#layerAdd');
                com.focusPage('#layerAdd').attr('orderId', v.sales.orderId);
                com.focusPage('#layerAdd').attr('spid', v.spid);
                com.focusPage('#collectDes').val(v.salesReceipt.comment).attr("readonly", "readonly");
                com.focusPage("#historyUpdateSA").removeClass("hide");

                com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
                com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
                com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
                com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
                com.focusPage('#couponCheckbox').parents('.inline').addClass('show');

                var spid = $layerrAdd.attr('spid', v.spid);
                var sid = $layerrAdd.attr('sid', v.sales.sid);

                if(com.focusPage('#advanceCheckbox').attr("disabled")){
                    com.focusPage('#advanceCheckbox').removeAttr('disabled');
                }
                if(com.focusPage('#couponCheckbox').attr("disabled")){
                    com.focusPage('#couponCheckbox').removeAttr('disabled');
                }

                //预付款
                if(v.salesReceipt.advance!="" && v.salesReceipt.advance!=null && v.salesReceipt.advance!=0){
                    com.focusPage("#advanceCheckbox").trigger("click");
                    com.focusPage("#advanceDiv").removeClass("hide");
                    com.focusPage("#advanceType").val(3).attr("disabled", "disabled");

                    com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": v.sales.customer.cid},function(res){
                        com.focusPage("#advance").val(res.materialAdvance);
                        com.focusPage("#payAdvance").val(v.salesReceipt.advance).attr("readonly", "readonly");
                    });
                }

                //券信息
                if(v.salesReceipt.coupon!="" && v.salesReceipt.coupon!=null && v.salesReceipt.coupon!=0){
                    com.focusPage("#couponCheckbox").trigger("click");

                    var couponInfoList = {};
                    var couponInfoAll = "";
                    couponInfoAll = v.salesReceipt.couponInfo.substring(1,v.salesReceipt.couponInfo.length-1);
                    couponInfoList = couponInfoAll.split("#");

                    com.focusPage("#couponDiv").removeClass("hide");
                    com.focusPage('.couponBlue').remove();
                    com.focusPage("#couponDiv div.form-group").addClass("hide");

                    $.each(couponInfoList,function (i,v) {
                        var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
                        com.focusPage("#couponDiv").append($couponSpan);
                    });
                }

                com.focusPage('#advanceCheckbox').attr('disabled', 'disabled');
                com.focusPage('#couponCheckbox').attr('disabled', 'disabled');

                //历史收款信息
                com.focusPage("#cashHistorySA").text("现金: "+com.checkNull(salesPayment.cashInfo[v.salesReceipt.cashInfo],"")+" "+com.checkNull(v.salesReceipt.cash,"无"));
                com.focusPage("#bankHistorySA").text("银行卡: " + (v.salesReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.salesReceipt.bank, v.salesReceipt.bankInfo, salesPayment.bankInfo)));
                com.focusPage("#checkvHistorySA").text("转账: " + (v.salesReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.salesReceipt.checkv, v.salesReceipt.checkvBank, salesPayment.checkBankInfo)));
                com.focusPage("#installmentHistorySA").text("分期: "+com.checkNull(salesPayment.bankInfo[v.salesReceipt.installmentBank],"")+" "+com.checkNull(v.salesReceipt.installment,"无"));
                com.focusPage("#accountsHistorySA").text("对公账户: "+com.checkNull(salesPayment.accountsInfo[v.salesReceipt.accountsBank],"")+" "+com.checkNull(v.salesReceipt.accounts,"无"));

                salesPayment.coupon = v.salesReceipt.coupon;
                salesPayment.couponInfo = v.salesReceipt.couponInfo;

                var cashAndBank = utils.accAdd(v.salesReceipt.cash,v.salesReceipt.bank);
                var checkvAndCoupon = utils.accAdd(v.salesReceipt.checkv,v.salesReceipt.coupon);

                var historyReferMoney = utils.accAdd(utils.accAdd(cashAndBank, checkvAndCoupon), v.salesReceipt.advance);
                com.focusPage('#referMoney').val(historyReferMoney);

                com.focusPage("#layerAdd").modal("show");
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
        };
    })();

    var hsearcher = new Searcher();
    hsearcher.init(["salesPaymentOrderId", "salesPaymentNo", "salesPaymentUserName", "salesPaymentVillage", "salesReceiptCollectTime"], "hcondList", api.payment.pageSalesPaymentForNotInit, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hsalesPaymentPostData", null, false, null, function () {
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        $impa.click(function () {
            salesPaymentForNotInitImport();
        });

        return [$impa];
    }, "hresultList");

    function baseClick() {
        var $input = com.focusPage('input[type="checkbox"]','#form');

        $.each($input, function (i, v) {
            var $v = $(v);
            $v.click(function () {
                var id = $v.attr('key') + "Div";

                if ($v.is(':checked')) {
                    com.focusPage("#" + id).removeClass('hide');
                } else {
                    com.focusPage("#" + id).addClass('hide');
                }
            });
        });
    }

    baseClick();

    function showInfo(msg) {
        layer.msg(msg);
    }

    function salesPaymentForNotInitImport() {
        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPaymentForNotInit, $.extend({}, params.hsalesPaymentPostData, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["销售单号", "sales.no"],
                    ['楼盘地址', ['sales.house.village.name', 'sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['应收金额', 'referMoney'],
                    ['收款人', 'salesReceipt.collecter.currentName'],
                    ['收款时间', 'salesReceipt.collectTime'],
                    ['类型', 'type'],
                    ['状态', 'status'],
                    ['备注', 'salesReceipt.comment'],
                    ['现金', 'salesReceipt.cash'],
                    ['银行', ['salesReceipt.bank', 'salesReceipt.bankInfo']],
                    ['转账', ['salesReceipt.checkv', 'salesReceipt.checkvBank']],
                    ['分期', ['salesReceipt.installment', 'salesReceipt.installBank']],
                    ['对公', ['salesReceipt.accounts', 'salesReceipt.accountsBank']],
                    ['预付款', 'salesReceipt.advance'],
                    ['券', ['salesReceipt.coupon', 'salesReceipt.couponInfo']]
                ],
                list: res.paging.data
            }, function (v) {
                if (v.salesReceipt.bank != null && v.salesReceipt.bank != 0) {
                    var $info = ' ';
                    var _s = v.salesReceipt.bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        $info += salesPayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                    }

                    v.salesReceipt.bankInfo = $info;
                }

                if (v.salesReceipt.checkv!= null && v.salesReceipt.checkv != 0) {
                    var checkBankInfoStr = v.salesReceipt.checkvBank;
                    if(checkBankInfoStr.indexOf("#") != -1){
                       var $checkvInfo = ' ';
                       var _c = v.salesReceipt.checkvBank.split('#');
                       for(var i=1;i<_c.length-1;i++){
                           var _i = _c[i].split('|');
                           $checkvInfo += salesPayment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                       }

                       v.salesReceipt.checkvBank = $checkvInfo;
                   }else{
                        v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPayment.checkBankInfo[v.salesReceipt.checkvBank] : '';
                   }
                }

                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPayment.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPayment.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPayment.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '已付款' : '已确认';
            });
        });
    }

    function printPayment(orderId, srId, v) {
        if(v.salesReceipt.collecter.userId!=params.userInfo.user.userId){
            com.showAlert(com.warning, "收款人不匹配, 不能打印");
            return false;
        }else{
            params.salesReceiptSrId = srId;
            com.popup("专用收款收据__装修单号: " + orderId, api.index.salesPaymentReceiptIndex.url, function () {
                parent.layer.getFrameIndex(window.name);
            }, null, true);
        }
    }

    function checkPaymentHideFlag() {
        if (com.focusPage('#cashDiv').hasClass('hide')) {
            com.focusPage('#cash').val("");
        }

        if (com.focusPage('#bankDiv').hasClass('hide')) {
            com.focusPage('#salesbankAdd').attr("num", 0).attr("maxnum", 0);
            com.focusPage('#salesbankDivGroup').empty();
        }

        if (com.focusPage('#checkvDiv').hasClass('hide')) {
            com.focusPage('#salescheckvAdd').attr("num", 0).attr("maxnum", 0);
            com.focusPage('#salescheckvDivGroup').empty();
        }

        if (com.focusPage('#advanceDiv').hasClass('hide')) {
            com.focusPage('#payAdvance').val("");
        }

        if (com.focusPage('#couponDiv').hasClass('hide')) {
            com.focusPage('.search-choice').find('input').val("")
        }
    }

    com.focusPage("#collectOrRefundBtn").click(function(){
        if(salesPayment.collectOrRefundFalg <= 2){
            var $layerrAdd = com.focusPage('#layerAdd');
            var spid = $layerrAdd.attr('spid');
            var sid = $layerrAdd.attr('sid');
            var referMoney = com.focusPage('#referMoney').val();
            var flagCoupon = true;

            var _coupon = 0;
            var _couponInfo = "#";
            com.focusPage("li[class='search-choice']", '#couponType_chosen').each(function (i, v) {
                var _ = $(v);
                var _couponVal = _.find('input[name="multi_input"]').val();

                if (_couponVal < 0) {
                    flagCoupon = false;
                }

                if (_couponVal == "") {
                    _couponVal = 0;
                }

                _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                _couponInfo += _.find('span').text() + ":" + _couponVal + "#";

            });

            if (!flagCoupon) {
                layer.msg('代金券价格填写错误');
                return;
            }
            if(salesPayment.collectOrRefundFalg == 1){
                //收款
                aboutcollectAndRefundMoney(sid, spid, null, referMoney, _coupon, _couponInfo, "single", api.payment.collectSalesPayment, "collect");
            }else if(salesPayment.collectOrRefundFalg == 2){
                //退款
                aboutcollectAndRefundMoney(sid, spid, null, referMoney, _coupon, _couponInfo, "single", api.payment.refundSalesPayment, "refund");
            }
        }else if(salesPayment.collectOrRefundFalg == 3){
            //批量收款
            aboutcollectAndRefundMoney(salesPayment.firstSid, null, salesPayment.spids, com.focusPage('#referMoney').val(), 0, null, "many", api.payment.collectSalesPayments, "collect");
        }else if(salesPayment.collectOrRefundFalg == 4){
            //更新收款
            var spid = com.focusPage('#layerAdd').attr('spid');
            var referMoney = com.focusPage('#referMoney').val();
            aboutcollectAndRefundMoney(null, spid, null, referMoney, salesPayment.coupon, salesPayment.couponInfo, "single", api.payment.updateSalesPayment, "update");
        }
        salesPaymentSearcher.doSearch();
        hsearcher.doSearch();
    });

    com.focusPage("#layerAdd").on('hidden.bs.modal', function(){
        com.cleanItems("layerAdd");
        com.clearValidator("layerAdd");

        salesPayment.bankNums=[];
        salesPayment.checkvNums=[];

        com.focusPage('[name="top"]').addClass('hide');
        com.focusPage('#cash').val("");
        com.focusPage('#salesbankAdd').attr("num", 0).attr("maxnum", 0);
        com.focusPage('#salescheckvAdd').attr("num", 0).attr("maxnum", 0);
        com.focusPage('input[type="checkbox"]','#form').removeAttr('checked');
        com.focusPage('#bank').val("");
        com.focusPage('#checkv').val("");
        com.focusPage('#salesbankDivGroup').empty();
        com.focusPage('#salescheckvDivGroup').empty();
        com.focusPage('#payAdvance').val("");
        com.focusPage('.search-choice').find('input').val('');
        com.focusPage('#collectDes').val("");

        paymentUtils.EmptyChosen('salescashInfo');
    });

    function aboutcollectAndRefundMoney(sid, spid, spids, referMoney, coupon, couponInfo, singleFlag, url, collectOrRefund){
        if(com.validate("layerAdd")){
            return;
        }

        var layerAdd = com.focusPage('#layerAdd');
        var des = com.focusPage('#collectDes').val();

        if(singleFlag == "single"){
            if(collectOrRefund != "update"){
                if (com.focusPage('#couponDiv').hasClass('hide')) {
                    coupon = 0;
                    couponInfo = "#";
                }
            }
        }

        var referMoney = parseFloat(referMoney);

        checkPaymentHideFlag();

        var cash = 0;
        var cashInfo = "";
        var bank = 0;
        var bankInfo = "";
        var checkv = 0;
        var checkvBank = "";
        var payAdvance = 0;
        var advanceType;


        if(com.focusPage("#cashCheckbox").prop("checked")){
            cash = layerAdd.find('#cash').val() != "" ? layerAdd.find('#cash').val() : 0;
            cashInfo = layerAdd.find('#salescashInfo').val();
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var aboutBankParams = paymentUtils.returnBankParams(salesPayment.bankNums, "salesbank");
            bank = aboutBankParams[0];
            bankInfo = aboutBankParams[1];
            if (bank == 0) {
                bankInfo = "";
            }
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var aboutCheckvParams = paymentUtils.returnBankParams(salesPayment.checkvNums, "salescheckv");
            checkv = aboutCheckvParams[0];
            checkvBank = aboutCheckvParams[1];
            if (checkv == 0) {
                checkvBank = "";
            }
        }

        var realMoney = utils.accAdd(utils.accAdd(cash, bank), checkv);

        if (collectOrRefund != "refund") {
            if(com.focusPage("#advanceCheckbox").prop("checked")) {
                var advance = layerAdd.find('#advance').val() != "" ? layerAdd.find('#advance').val() : 0;
                advanceType = layerAdd.find('#advanceType option:selected').val();
                payAdvance = layerAdd.find('#payAdvance').val();

                if(collectOrRefund == "collect"){
                    if (parseFloat(payAdvance) > parseFloat(advance)) {
                        com.showAlert(com.warning, "当前实收款项总数大于预付款项,请核实再进行提交!");
                        return false;
                    }
                }

                realMoney = realMoney + parseFloat(payAdvance != "" ? payAdvance : 0);
            }
        }

        if (singleFlag == "single") {
            if(com.focusPage("#couponCheckbox").prop("checked")){
                realMoney = realMoney + parseFloat(coupon != "" ? coupon : 0);
            }
        }

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "salesReceipt.cash": cash,
            "salesReceipt.cashInfo": cashInfo,
            "salesReceipt.bank": bank,
            "salesReceipt.bankInfo": bankInfo,
            "salesReceipt.checkv": checkv,
            "salesReceipt.checkvBank": checkvBank,
            "salesReceipt.comment": des
        };

        if(collectOrRefund != "update"){
            option["salesPayment.sales.sid"] = sid;
        }

        if(collectOrRefund != "refund"){
            if(singleFlag == "single" && collectOrRefund != "update"){
                option["sales.sid"] = sid;
            }

            option["salesReceipt.advance"] = payAdvance;
            option["salesReceipt.advanceType"] = advanceType;
        }

        if(spid != null){
            option["salesPayment.spid"] = spid;
            if(coupon != 0 && couponInfo != null){
                option["salesReceipt.coupon"] = coupon;
                option["salesReceipt.couponInfo"] = couponInfo;
            }
        }

        if(spids != null && spids.length > 0){
            $.each(spids, function (i, v) {
                option["spids[" + i + "]"] = v;
            });
        }

        if(collectOrRefund == "collect"){
            if (!com.focusPage('#advanceDiv').hasClass('hide')) {
                option["salesPayment.advanceType"] = advanceType;
                option["salesPayment.advance"] = parseFloat(payAdvance).toFixed(2);
            }
        }

        com.post(url, option, function () {
            if(collectOrRefund == "collect"){
                com.showAlert(com.info, singleFlag == "single" ? '收款成功' : "批量收款成功")
            }else if(collectOrRefund == "refund"){
                com.showAlert(com.info, '退款成功')
            }else if(collectOrRefund == "update"){
                com.showAlert(com.info, '更新成功')
            }

            if(singleFlag == "single" && collectOrRefund != "refund"){
                salesPayment.items.couponType.chosen("destroy");
                salesPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
                salesPayment.items.couponType.bindData(salesPayment.couponType, 'no', 'name');
                salesPayment.items.couponType.trigger("chosen:updated");
            }
            com.focusPage("#layerAdd").modal("hide");
        });
    }
});
