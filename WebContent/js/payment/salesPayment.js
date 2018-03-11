/**
 * Created by Administrator on 2017/4/27.
 */
$(function () {
    var salesPayment = {
        salesLayerNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],

        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        couponType: {},
        couponTypeData: {},
        customerId: null,
        bankDataList: [],
        salesPaymentItems: {},
        items: {},

        editFlag: false,
        historyFlag: false,
        batchFlag: true,
        validator: {
            price: {
                type: 'v_price',
                regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
                errorMsg: "价格内容输入错误"
            }
        }
    };
    var salesPaymentPostData = {};

    salesPayment.items.couponType = $('#couponType');

    com.post(api.common.queryReceiptType, {}, function (res) {
        salesPayment.cash = [];
        salesPayment.bank = [];
        salesPayment.checkBank = [];
        salesPayment.accounts = [];
        salesPayment.couponType = [];

        salesPayment.cashInfo = {};
        salesPayment.bankInfo = {};
        salesPayment.checkBankInfo = {};
        salesPayment.accountsInfo = {};
        salesPayment.couponTypeData = {};

        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 1) {
                salesPayment.cash.push(v);
                salesPayment.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesPayment.bank.push(v);
                salesPayment.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesPayment.checkBank.push(v);
                salesPayment.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesPayment.accounts.push(v);
                salesPayment.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesPayment.couponType.push(v);
                salesPayment.couponTypeData[v.no] = [v.no, v.name];
            }
        });

        $("#cashInfo").bindData(salesPayment.cash, 'no', 'name');
        $("#refundCashInfo").bindData(salesPayment.cash, 'no', 'name');

        $("#installmentBankName").bindData(salesPayment.bank, 'no', 'name');
        $("#refundBankName").bindData(salesPayment.bank, 'no', 'name');

        $("#checkvBankName").bindData(salesPayment.checkBank, 'no', 'name');

        $("#accountsBankName").bindData(salesPayment.accounts, 'no', 'name');

        $("#couponType").bindData(salesPayment.couponType, 'no', 'name');
        $("#couponType").trigger("chosen:updated");

        $("#refundCouponType").bindData(salesPayment.couponType, 'no', 'name');
        $("#refundCouponType").trigger("chosen:updated");
    }, null, false);

    $.extend(com.validator, salesPayment.validator);

    $("#history").removeClass("active");

    $("#refundBankCard").on("click", function (e) {
        $("#refundBankCardDiv").removeClass("hide");
        $("#refundBankName").addClass("v_required");

        $("#refundCashInfoDiv").addClass("hide");
        $("#refundCashInfo").removeClass("v_required");
    });

    $("#refundCash").on("click", function (e) {
        $("#refundBankCardDiv").addClass("hide");
        $("#refundBankName").removeClass("v_required");

        $("#refundCashInfoDiv").removeClass("hide");
        $("#refundCashInfo").addClass("v_required");
    });


    com.post(api.ds.payment, {}, function (res) {

        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPayment.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    $("#advanceType").bindData([{"key": "1", "value": "合同预付款"}, {"key": "2", "value": "工程预付款"}, {
        "key": "3",
        "value": "主材预付款"
    }, {"key": "4", "value": "正林预付款"}], 'key', 'value');

    var advanceType = null;

    $("#advanceCheckbox").on("click", function () {
        changeValue();
    });

    $("#advanceType").on("change", function () {
        changeValue();
    });

    function changeValue() {

        advanceType = $("#advanceType option:checked").val();
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

        var orderId = $('#layerAdd').attr('orderId');
        com.post(api.payment.queryAdvancePaymentByOrderId, {"decoration.orderId": orderId}, function (res) {

            $("#advance").val(res[typeStr]).attr("readonly", "readonly");

        }, null, false);
    }


    $("#couponType").chosen({width: "100%", multi_type: "input"});
    $("#refundCouponType").chosen({width: "100%", multi_type: "input"});

    $("#bankAdd").on('click',function(){

        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;

        addBankDiv(nextNum);
        $(this).attr("num", nextNum);

        return false;
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
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
                ["应收金额:", v.referMoney, "blue"],
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
                "paymentType": v.type,
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(salesPayment.salesPaymentTypeData[v.type]);

            _label.append($input).append(_span).appendTo($label)

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

                $('#layerAdd').attr('orderId', v.sales.orderId);

                $('#referMoney').val(v.referMoney);
                var $layerrAdd = $('#layerAdd');
                $layerrAdd.attr('spid', v.spid);
                $layerrAdd.attr('sid', v.sales.sid);
                if ($btnCollect.text() == '退款') {
                    $('#couponCheckbox').parents('.inline').removeClass('hidden');
                    $('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
                }
                if ($btnCollect.text() == '收款') {

                    $('#advanceCheckbox').parents('.inline').removeClass('hidden');
                    $('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
                    $('#advanceCheckbox').parents('.inline').addClass('show');
                    $('#couponCheckbox').parents('.inline').removeClass('hidden');
                    $('#couponCheckbox').parents('.inline').addClass('show');
                }

                openlayer($btnCollect.text(), function () {
                    var spid = $layerrAdd.attr('spid');
                    var sid = $layerrAdd.attr('sid');
                    var referMoney = $('#referMoney').val();
                    var flagCoupon = true;

                    var _coupon = 0;
                    var _couponInfo = "#";
                    $("li[class='search-choice']", $('#couponType_chosen')).each(function (i, v) {

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
                        return
                    }

                    if ($btnCollect.text() == '收款') {

                        collectSalesPayment(sid, spid, referMoney, _coupon, _couponInfo);

                    }
                    if ($btnCollect.text() == '退款') {

                        collectSalesPaymentForRefund(sid, spid, referMoney,_coupon, _couponInfo);

                    }
                });

            });


            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
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

            $('#advanceCheckbox').parents('.inline').removeClass('hidden');
            $('#advanceCheckbox').parents('.inline').addClass('show');
            $('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
            $('#couponCheckbox').parents('.inline').addClass('hidden');
            var $inputs = $('input[name="spids"]:checked', '#resultList');
            var referMoney = 0;
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
                    "spid": $input.attr("spid"),
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

            $('#layerAdd').attr('orderId', orderIds);

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
            })

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
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.")
                return false;
            }

            $('#referMoney').val(referMoney);

            openlayer($addspan.text(), function () {

                collectSalesPayments(sid[0], spids, $('#referMoney').val());

            });

        });


        var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
        var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
        var $showspan = $('<span></span>').text('合计').appendTo($showa);

        $showa.click(function () {
            var $total = 0;

            var $inputs = $('input[name="spids"]:checked');

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
            var $tableWrap = $('#' + tableId);
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
                ["状态:", v.status == 1 ? '待确认' : '已确认', "red"],
                ["备注:", v.salesReceipt.comment, "grey"],
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
                "paymentType": v.type,
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
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                var info = bank + ", ";
                var _s = bankInfo.split('#');
                for (var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += salesPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
                }

                return info;
            })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "blue"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["转账:", v.salesReceipt.checkv, "blue"]) : true;
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

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint.click(function () {
                printPayment(v.sales.orderId, v.salesReceipt.srId,v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
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

    function openlayer(type, callback) {
        layer.closeAll();
        var index = layer.open({
            type: 1,
            title: type,
            content: $('#layerAdd'),
            area: ["650px", ( $(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if(com.validate('layerAdd')){
                    return;
                }
                callback(index, layero);
                salesPaymentSearcher.doSearch();
            },
            btn2: function (index, layero) {
                com.clearValidator();
                salesPaymentSearcher.doSearch();
                closeLayer();
            },
            cancel: function () {
                salesPaymentSearcher.doSearch();
                closeLayer();
            }
        });
    }

    function closeLayer() {

        $('[name="top"]').addClass('hide');
        $('#cash').val("");
        $('#bankAdd').attr("num", 0);
        $('input[type="checkbox"]','#form').removeAttr('checked')
        $('#bank').val("");
        $('#checkv').val("");
        $('#installment').val("");
        $('#accounts').val("");
        $('#bankDivGroup').empty();
        $('#payAdvance').val("");
        $('.search-choice').find('input').val('');
        $('#collectDes').val("");
    }

    function addBankDiv(index){

        var d = new Date();
        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));

        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(salesPayment.bank, 'no', 'name').appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankDiv);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", "bankDel_"+index).attr("index", index).appendTo(bankDelDiv).click(function(){
            $("#bankDiv_"+$(this).attr("index")).remove();
            var bankAdd = $("#bankAdd");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num)-1);
            return false;
        });

        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankDiv);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);

        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

    }

    function baseClick() {

        var $input = $('input[type="checkbox"]','#form');

        $.each($input, function (i, v) {
            var $v = $(v);
            $v.click(function () {
                var id = $v.attr('key') + "Div";

                if ($v.is(':checked')) {
                    $("#" + id).removeClass('hide');
                } else {
                    $("#" + id).addClass('hide');
                }
            });
        });

    }

    baseClick();

    function showInfo(msg) {
        layer.msg(msg);
    }

    function collectSalesPayments(sid, spids, referMoney) {

        var layerAdd = $('#layerAdd');
        var bankAdd = $("#bankAdd");

        var referMoney = parseFloat(referMoney);

        checkPaymentHideFlag();

        var _coupon = 0;
        var _couponInfo = "#";

        var _bank = 0;
        var _bankInfo = "#";

        var num = parseInt(bankAdd.attr("num"));
        for (var j = 0; j < num; j++) {
            var index = j + 1;
            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val();

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        }

        $("[class='search-choice']", $('#couponType_chosen')).each(function (i, v) {
            var _ = $(v);
            var _couponVal = _.find('input').val();
            _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
            _couponInfo += _.find('span').text() + ":" + _couponVal + "#";
        });

        var cash = layerAdd.find('#cash').val();
        var cashInfo = layerAdd.find('#cashInfo').val();

        var bank = _bank;
        var bankInfo = _bankInfo;

        var checkv = layerAdd.find('#checkv').val();
        var checkvBank = layerAdd.find('#checkvBankName').val();

        var installment = layerAdd.find('#installment').val();
        var installBank = layerAdd.find('#installmentBankName').val();

        var accounts = layerAdd.find('#accounts').val();
        var accountsBank = layerAdd.find('#accountsBankName').val();

        var payAdvance = layerAdd.find('#payAdvance').val();
        var advance = layerAdd.find('#advance').val();
        var advanceType = layerAdd.find('#advanceType option:selected').val();

        if (parseFloat(payAdvance) > parseFloat(advance)) {
            com.showAlert(com.warning, "当前实收款项总数大于预付款项,请核实再进行提交!");
            return false;
        }


        var des = $('#collectDes').val();
        var realMoney = parseFloat(cash != "" ? cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(checkv != "" ? checkv : 0) + parseFloat(installment != "" ? installment : 0) + parseFloat(accounts != "" ? accounts : 0) + parseFloat(payAdvance != "" ? payAdvance : 0);//+parseFloat(coupon);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "sales.sid": sid,
            "salesPayment.sales.sid": sid,
            "salesReceipt.realMoney": realMoney,
            "salesReceipt.cash": cash == "" ? 0 : cash,
            "salesReceipt.cashInfo": cashInfo,
            "salesReceipt.bank": bank == "" ? 0 : bank,
            "salesReceipt.bankInfo": bankInfo,
            "salesReceipt.checkv": checkv == "" ? 0 : checkv,
            "salesReceipt.checkvBank": checkvBank,
            "salesReceipt.installment": installment == "" ? 0 : installment,
            "salesReceipt.installBank": installBank,
            "salesReceipt.accounts": accounts == "" ? 0 : accounts,
            "salesReceipt.accountsBank": accountsBank,
            "salesReceipt.advance": payAdvance == "" ? 0 : payAdvance,
            "salesReceipt.advanceType": advanceType,
            "salesReceipt.comment": des,
        };

        if (!$('#advanceDiv').hasClass('hide')) {
            option["salesPayment.advanceType"] = advanceType;
            option["salesPayment.advance"] = parseFloat(payAdvance).toFixed(2);
        }


        $.each(spids, function (i, v) {
            option["spids[" + i + "]"] = v;
        });

        if (checkInfo()) {
            com.post(api.payment.collectSalesPayments, option, function () {
                layer.closeAll();
                salesPaymentSearcher.doSearch();
                layer.msg('批量收款成功', {icon: 1});
                closeLayer();

            });
        }

    }

    function collectSalesPayment(sid, spid, referMoney, coupon, couponInfo) {

        var layerAdd = $('#layerAdd');
        var bankAdd = $("#bankAdd");
        var layerOrderId = $('#layerAdd').attr('orderId');

        salesPayment.items.couponType.chosen("destroy");
        salesPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
        salesPayment.items.couponType.bindData(salesPayment.couponType, 'no', 'name');
        salesPayment.items.couponType.trigger("chosen:updated");

        var referMoney = parseFloat(referMoney);

        checkPaymentHideFlag();

        if ($('#couponDiv').hasClass('hide')) {
            coupon = 0;
            couponInfo = "#";
        }

        var _bank = 0;
        var _bankInfo = "#";
        var num = parseInt(bankAdd.attr("num"));
        for (var j = 0; j < num; j++) {
            var index = j + 1;
            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val() + ":00";

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        }

        var sid = sid;
        var spid = spid;

        var cash = layerAdd.find('#cash').val() != "" ? layerAdd.find('#cash').val() : 0;
        var cashInfo = layerAdd.find('#cashInfo').val();

        var bank = _bank;
        var bankInfo = _bankInfo;

        var checkv = layerAdd.find('#checkv').val() != "" ? layerAdd.find('#checkv').val() : 0;
        var checkvBank = layerAdd.find('#checkvBankName').val();

        var installment = layerAdd.find('#installment').val() != "" ? layerAdd.find('#installment').val() : 0;
        var installBank = layerAdd.find('#installmentBankName').val();

        var accounts = layerAdd.find('#accounts').val() != "" ? layerAdd.find('#accounts').val() : 0;
        var accountsBank = layerAdd.find('#accountsBankName').val();

        var advance = layerAdd.find('#advance').val() != "" ? layerAdd.find('#advance').val() : 0;
        var advanceType = layerAdd.find('#advanceType option:selected').val();

        var payAdvance = layerAdd.find('#payAdvance').val();

        if (parseFloat(payAdvance) > parseFloat(advance)) {
            com.showAlert(com.warning, "当前实收款项总数大于预付款项,请核实再进行提交!");
            return false;
        }

        var des = $('#collectDes').val();

        var realMoney = parseFloat(cash != "" ? cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(checkv != "" ? checkv : 0) + parseFloat(installment != "" ? installment : 0) + parseFloat(accounts != "" ? accounts : 0) + parseFloat(coupon != "" ? coupon : 0) + parseFloat(payAdvance != "" ? payAdvance : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "sales.sid": sid,
            "salesPayment.sales.sid": sid,
            "salesPayment.spid": spid,
            "salesReceipt.realMoney": realMoney,
            "salesReceipt.cash": cash,
            "salesReceipt.cashInfo": cashInfo,
            "salesReceipt.bank": bank,
            "salesReceipt.bankInfo": bankInfo,
            "salesReceipt.checkv": checkv,
            "salesReceipt.checkvBank": checkvBank,
            "salesReceipt.installment": installment,
            "salesReceipt.installBank": installBank,
            "salesReceipt.accounts": accounts,
            "salesReceipt.accountsBank": accountsBank,
            "salesReceipt.coupon": coupon,
            "salesReceipt.couponInfo": couponInfo,
            "salesReceipt.advance": payAdvance,
            "salesReceipt.advanceType": advanceType,
            "salesReceipt.comment": des,
        };

        if (!$('#advanceDiv').hasClass('hide')) {
            option["salesPayment.advanceType"] = advanceType;
            option["salesPayment.advance"] = parseFloat(payAdvance).toFixed(2);
        }

        if (checkInfo()) {
            com.post(api.payment.collectSalesPayment, option, function () {
                layer.closeAll();
                salesPaymentSearcher.doSearch();
                layer.msg('收款成功', {icon: 1});
                closeLayer();
            });
        }

    }

    function collectSalesPaymentForRefund(sid, spid, referMoney, coupon, couponInfo) {

        var layerAdd = $('#layerAdd');
        var bankAdd = $("#bankAdd");


        var referMoney = parseFloat(referMoney);

        checkPaymentHideFlag();

        if ($('#couponDiv').hasClass('hide')) {
            coupon = 0;
            couponInfo = "#";
        }

        var _bank = 0;
        var _bankInfo = "#";
        var num = parseInt(bankAdd.attr("num"));
        for (var j = 0; j < num; j++) {
            var index = j + 1;
            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val() + ":00";

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        }

        var sid = sid;
        var spid = spid;

        var cash = layerAdd.find('#cash').val();
        var cashInfo = layerAdd.find('#cashInfo').val();

        var bank = _bank;
        var bankInfo = _bankInfo;

        var checkv = layerAdd.find('#checkv').val();
        var checkvBank = layerAdd.find('#checkvBankName').val();

        var installment = layerAdd.find('#installment').val();
        var installBank = layerAdd.find('#installmentBankName').val();

        var accounts = layerAdd.find('#accounts').val();
        var accountsBank = layerAdd.find('#accountsBankName').val();

        var des = $('#collectDes').val();

        var realMoney = parseFloat(cash != "" ? cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(checkv != "" ? checkv : 0) + parseFloat(installment != "" ? installment : 0) + parseFloat(accounts != "" ? accounts : 0) + parseFloat(coupon != "" ? coupon : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "salesPayment.sales.sid": sid,
            "salesPayment.spid": spid,
            "salesReceipt.realMoney": realMoney,
            "salesReceipt.cash": cash,
            "salesReceipt.cashInfo": cashInfo,
            "salesReceipt.bank": bank,
            "salesReceipt.bankInfo": bankInfo,
            "salesReceipt.checkv": checkv,
            "salesReceipt.checkvBank": checkvBank,
            "salesReceipt.installment": installment,
            "salesReceipt.installBank": installBank,
            "salesReceipt.accounts": accounts,
            "salesReceipt.accountsBank": accountsBank,
            "salesReceipt.coupon": coupon,
            "salesReceipt.couponInfo": couponInfo,
            "salesReceipt.comment": des,
        };

        if (checkInfo()) {
            com.post(api.payment.collectSalesPaymentForRefund, option, function () {
                layer.closeAll();
                salesPaymentSearcher.doSearch();
                layer.msg('退款成功', {icon: 1});
                closeLayer();

            });
        }

    }

    function salesPaymentForNotInitImport() {

        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
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
                    ['券', ['salesReceipt.coupon', 'salesReceipt.couponInfo']],
                ],
                list: res.paging.data,
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

                v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPayment.checkBankInfo[v.salesReceipt.checkvBank] : '';
                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPayment.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPayment.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPayment.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '待确认' : '已确认';
            });
        });
    }

    function printPayment(orderId, srId,v) {
        if(v.salesReceipt.collecter.userId!=params.userInfo.user.userId){
            com.showAlert(com.warning, "收款人不匹配，不能打印");
            return false;
        }else{
            params.salesReceiptSrId = srId;
            com.popup("专用收款收据__订单编号：" + orderId, api.index.salesPaymentReceiptIndex.url, function () {
                parent.layer.getFrameIndex(window.name);
            }, null, true);
        }
    }


    function checkPaymentHideFlag() {

        if ($('#cashDiv').hasClass('hide')) {
            $('#cash').val("");
        }
        if ($('#bankDiv').hasClass('hide')) {

            $('#bankAdd').attr("num", 0);
            $('#bankDivGroup').empty();

        }

        if ($('#checkvDiv').hasClass('hide')) {
            $('#checkv').val("");
        }

        if ($('#installmentDiv').hasClass('hide')) {
            $('#installment').val("");
        }

        if ($('#accountsDiv').hasClass('hide')) {
            $('#accounts').val("");
        }

        if ($('#advanceDiv').hasClass('hide')) {
            $('#payAdvance').val("");
        }

        if ($('#couponDiv').hasClass('hide')) {

            $('.search-choice').find('input').val("")

        }

    }

    function checkInfo() {

        var flag = true;

        if (!$('#cashDiv').hasClass('hide')) {

            var num = $('#cash');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        }

        if (!$('#bankDiv').hasClass('hide')) {

            var date = $('.date-picker-date', '#bankDivGroup');
            if (!date.val()) {
                date.focus().select();

                date.addClass('popover-notitle').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "请选择日期"

                }).popover('show');

                flag = false;
            } else {
                date.popover('destroy');
            }

            var time = $('.v_time', '#bankDivGroup');
            var timerex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;

            $.each(time, function (i, v) {
                var $v = $(v);
                if (!$v.val() && !timerex.test($v.val())) {
                    $v.focus().select();

                    $v.addClass('popover-notitle').attr({
                        "data-rel": "popover",
                        "data-placement": "right",
                        "data-original-title": "",
                        "title": "",
                        "data-content": "请填写正确的时间"

                    }).popover('show');

                    flag = false;

                } else {

                    $v.popover('destroy');

                }

            });

            var price = $('.v_price', '#bankDivGroup');
            var priceRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            $.each(price, function (i, v) {
                var $v = $(v);
                if (!(parseFloat($v.val()) >= 0 && priceRex.test($v.val()))) {
                    $v.focus().select();

                    $v.addClass('popover-notitle').attr({
                        "data-rel": "popover",
                        "data-placement": "right",
                        "data-original-title": "",
                        "title": "",
                        "data-content": "价格输入内容格式错误"

                    }).popover('show');

                    flag = false;

                } else {

                    $v.popover('destroy');

                }

            })
        }

        if (!$('#checkvDiv').hasClass('hide')) {
            var num = $('#checkv');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }
        }

        if (!$('#installmentDiv').hasClass('hide')) {
            var num = $('#installment');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }
        }

        if (!$('#accountsDiv').hasClass('hide')) {
            var num = $('#accounts');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }
        }

        if (!$('#advanceDiv').hasClass('hide')) {
            var num = $('#payAdvance');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }
        }

        return flag;

    }

});
