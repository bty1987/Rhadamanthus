/**
 * Created by Administrator on 2017/4/24.
 */

var salesPayment = {
    //付款方式选择 cash:现金 bank:银行 checkv:转账 installment:分期 accounts:对公 advance:预付款 coupon:卷值
    salesLayerNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],

    salesPaymentTypeData: {},
    salesPaymentRevTypeData: {},//反向
    //卷值类型
    couponType: {},
    //卷值类型信息
    couponTypeData: {},
    //客户id
    customerId: null,
    //银行卡信息集合
    bankDataList: [],
    //保存按钮
    saveBtn: null,
    //取消按钮
    cancelBtn: null,
    //基础弹窗
    baseLayer: null,
    //退款弹窗
    refundLayer: null,
    //销售款子项
    salesPaymentItems: {},
    //多条
    items: {},

    editFlag: false,
    historyFlag: false,
    //批量
    batchFlag: true,
    //校验
    validator: {
        price: {
            type: 'v_price',
            regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
            errorMsg: "价格内容输入错误"
        }
    }
}
//销售单提交信息
var salesPaymentPostData = {};



$(function () {
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    salesPayment.items.couponType = $('#couponType');

    core.post(api.data.queryReceiptType, {}, function (res) {
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
                salesPayment.cashInfo[v.key] = v.name;
            } else if (v.type == 2) {
                salesPayment.bank.push(v);
                salesPayment.bankInfo[v.key] = v.name;
            } else if (v.type == 3) {
                salesPayment.checkBank.push(v);
                salesPayment.checkBankInfo[v.key] = v.name;
            } else if (v.type == 4) {
                salesPayment.accounts.push(v);
                salesPayment.accountsInfo[v.key] = v.name;
            } else if (v.type == 5) {
                salesPayment.couponType.push(v);
                salesPayment.couponTypeData[v.key] = [v.key, v.name];
            }
        });

        $("#cashInfo").bindData(salesPayment.cash, 'key', 'name');
        $("#refundCashInfo").bindData(salesPayment.cash, 'key', 'name');

        $("#installmentBankName").bindData(salesPayment.bank, 'key', 'name');
        $("#refundBankName").bindData(salesPayment.bank, 'key', 'name');

        $("#checkvBankName").bindData(salesPayment.checkBank, 'key', 'name');

        $("#accountsBankName").bindData(salesPayment.accounts, 'key', 'name');

        $("#couponType").bindData(salesPayment.couponType, 'key', 'name');
        $("#couponType").trigger("chosen:updated");

        $("#refundCouponType").bindData(salesPayment.couponType, 'key', 'name');
        $("#refundCouponType").trigger("chosen:updated");
    })

    $.extend(core.validator, salesPayment.validator);

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

    for (var i = 0; i < salesPayment.salesLayerNameData.length; i++) {
        $("#" + salesPayment.salesLayerNameData[i] + "Checkbox").on("click", function (e) {
            var _name = $(this).attr("key");
            var _checkboxId = "#" + _name + "Checkbox";
            var _divId = "#" + _name + "Div";

            if ($(_checkboxId).attr("checked") != "checked") {
                $(_divId).removeClass("hide");
                $(_checkboxId).attr("checked", "checked");

                if (_name == "advance") {
                    core.post(api.data.queryCustomerForAdvanceByCustomerId, {"customer.customerId": salesPaymentPostData.customerId}, function (res) {
                        $("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
                        $("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
                    });
                }
            } else {
                $(_divId).addClass("hide");
                $(_checkboxId).removeAttr("checked", "checked");
            }
        });
    }

    core.post(api.ds.materialInfo, {}, function (res) {
        $("#advanceType").bindData(res.advanceType, 'key', 'value');

        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPayment.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    $("#couponType").chosen({width: "216px", multi_type: "input"});
    $("#refundCouponType").chosen({width: "216px", multi_type: "input"});

    $('#AddBank').on('click', function () {
        var num = $(this).attr("num");
        var nextNum = parseInt(num) + 1;
        addBankDiv(nextNum);
        $(this).attr("num", nextNum);

        return false;
    })
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            var propertyArr = [
                ["订单号:", v.sales.orderId, "color-grey"],
                ["销售单:", v.sales.no, "color-grey"],
                ["楼盘地址:", v.sales.village.villageName, "color-grey"],
                ["客户:", v.sales.customer.customerName, "color-grey"],
                ["品牌:", v.brand, "color-grey"],
                ["操作人:", v.createrName, "color-grey"],
                ["应收金额:", v.referMoney, "color-blue"],
            ];

            var $label = $('<label></label>').addClass('control-label');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "spids",
                "class": "",
                "spid": v.spid,
                "orderId": v.sales.orderId,
                "referMoney": v.referMoney,
                "customerId": v.sales.customer.customerId,
                "paymentType": v.type,
            }).css('margin-bottom', '5px').val(v.salesReceipt.srId);
            var $span = $('<span></span>').addClass('controls').text(salesPayment.salesPaymentTypeData[v.type]);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.append($input).append($span).appendTo($h3);

            $divBtnWrap.append($btnCollect).appendTo($h3);
            if ([4, 5, 6, 7].indexOf(v.type) != -1) {
                $btnCollect.text('退款').addClass("small red");
            } else {
                $btnCollect.text('收款').addClass("small blue");
            }

            $liLine.append($h3).append($ulProperty);
            $btnCollect.click(function () {
                $('#referMoney').val(v.referMoney);

                openlayer(function () {
                    payment();
                    layer.closeAll();
                    layer.msg('收款成功',{icon:1})

                },function(){
                    layer.msg('收款失败',{icon:2})
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
        }
    })();

    var shoukuanSearcher = new Searcher();
    shoukuanSearcher.init(["orderId"], 'condList', api.payment.pageSalesPaymentForInit, function (data) {
        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesPaymentPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn small blue pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

        $adda.click(function(){
            openlayer(function(){

            })
        })


        var $showa = $('<a></a>').addClass('btn small pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
        var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
        var $showspan = $('<span></span>').text('合计').appendTo($showa);

        $showa.click(function(){
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

        })

        return [$adda, $showa];
    }, 'resultList')

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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn small blue').html('打印');
            var $btnEdit = $('<a></a>').addClass('btn small yellow').html('编辑');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "color-grey"],
                ["销售单号:", v.sales.no, "color-grey"],
                ["楼盘地址:", v.sales.village.villageName, "color-grey"],
                ["客户:", v.sales.customer.customerName, "color-grey"],
                ["品牌:", v.brand, "grey"],
                ["操作人:", v.createrName, "color-grey"],
                ["应收金额:", v.referMoney, "color-blue"],
                ["收款人:", v.salesReceipt.collecter.currentName, "color-grey"],
                ["收款时间:", v.salesReceipt.collectTime, "color-grey"],
                ["状态:", v.status == 1 ? '待确认' : '已确认', "color-red"],
                ["备注:", v.salesReceipt.des, "color-grey"],
            ];

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "hspids",
                "class": "",
                "spId": v.spId,
                "srId": v.srId,
                "orderId": v.sales.orderId,
                "referMoney": v.referMoney,
                "customerId": v.sales.customer.customerId,
                "paymentType": v.type,
            }).val(v.arId);
            var $span = $('<span></span>').addClass('lbl');

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var styleArr = [];

            v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? styleArr.push(["现金:", v.salesReceipt.cash, "grey"]) : true;
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                var info = bank + ", ";
                var _s = bankInfo.split('#');
                for (var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += salesPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
                }

                return info
            })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "grey"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["转账:", v.salesReceipt.checkv, "grey"]) : true;
            v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? styleArr.push(["分期:", v.salesReceipt.installment, "grey"]) : true;
            v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? styleArr.push(["对公帐户:", v.salesReceipt.accounts, "grey"]) : true;
            v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? styleArr.push(["预付款:", v.salesReceipt.advance, "grey"]) : true;
            v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? styleArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "grey"]) : true;

            $.each(styleArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulStyle);
            });

            $label.append($input).append($span);
            $h3.append($('<small></small>').addClass('color-blue').html(salesPayment.salesPaymentTypeData[v.type]));

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint.click(function () {
                printPayment(v.srId, v.sales.orderId);
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
        }
    })();

    var hsearcher = new Searcher();

    hsearcher.init(["orderId"], "hcondList", api.payment.pageSalesPaymentForNotInit, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hsalesPaymentPostData", null, false, null, function () {

        var $impa = $('<a></a>').addClass('btn small green pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        return [$impa];
    }, "hresultList");

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title: "添加",
            content: $('#layerAdd'),
            area: ["650px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
                closeLayer();
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeLayer();
            },
            cancel: function () {
                //右上角关闭回调
                closeLayer();
            }
        });
    }

    function closeLayer(){
        $('#couponCheckbox').parent().parent().parent().removeClass('hidden')
        $('.checkbox', '#form').find('span').removeClass('checked');
        $('[name="top"]').addClass('hide')
    }
    function printPayment(mrId, orderId) {
        var url = api.index.salesPaymentReceiptIndex.url + "?orderId=" + orderId + "&materialReceipt.mrId=" + mrId + "&time=" + params.loginTime;
        window.open(url);
    }

    function addBankDiv(index) {

        var d = new Date();
        var currentData = d.getFullYear() + "-" + (d.getMonth().toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass('control-group').attr("id", "bankDiv_" + index).appendTo($("#bankDivGroup"));

        var bankNameLabel = $('<label></label>').addClass('control-label no-padding-right').text('开户行').appendTo(bankDiv);
        var bankNameDiv = $('<div></div>').addClass('controls').appendTo(bankDiv);
        var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_" + index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(salesPayment.bank, 'key', 'name').appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankDiv);
        var bankDelBtn = $('<button></button>').addClass('btn small red pull-right').text("删除").attr("id", "bankDel_" + index).attr("index", index).appendTo(bankDelDiv).click(function () {
            $("#bankDiv_" + $(this).attr("index")).remove();
            var bankAdd = $("#AddBank");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num) - 1);
            return false;
        });

        var bankMoneyLabel = $('<label></label>').addClass('control-label no-padding-right').css('margin-left', '-160px').text('刷卡金额').appendTo(bankDiv);
        var bankMoneyDiv = $('<div></div>').addClass('controls').appendTo(bankDiv);
        var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_price").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_" + index).appendTo(bankMoneyDiv);

        var bankDateLabel = $('<label></label>').addClass('control-label no-padding-right').css('margin-left', '-160px').text('日期').appendTo(bankDiv);
        var bankDateDiv = $('<div></div>').addClass('controls').appendTo(bankDiv);
        var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_" + index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose: true}).appendTo(bankDateDiv);

        var bankTimeLabel = $('<label></label>').addClass('control-label no-padding-right').css('margin-left', '-160px').text('时间').appendTo(bankDiv);
        var bankTimeDiv = $('<div></div>').addClass('controls').appendTo(bankDiv);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput = $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "time").attr("id", "bankTime_" + index).attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(bankTimePicker);

    }

    function baseClick() {
        var label = $('.checkbox', '#controls');
        $.each(label, function (i, v) {
            var $this = $(this);
            $this.find('div').click(function () {
                $('.checkbox', '#form').find('input').removeAttr('disabled');

                var span = $this.find('span')
                span.toggleClass('checked');

                if (span.hasClass('checked')) {
                    var text = $.trim($this.text());
                    if (text == "银行") {
                        $('#bankDiv').removeClass('hide')
                    }
                    var DivText = $('[name="top"]', '#form').find('h4');
                    $.each(DivText, function (index, value) {
                        if (text == $.trim($(value).text())) {
                            $(value).parent().removeClass('hide')
                        }
                    })
                } else {
                    var text = $.trim($this.text());
                    if (text == "银行") {
                        $('#bankDiv').addClass('hide')
                    }
                    var DivText = $('[name="top"]', '#form').find('h4');
                    $.each(DivText, function (index, value) {
                        if (text == $.trim($(value).text())) {
                            $(value).parent().addClass('hide')
                        }
                    })
                }

            })

        })
    }

    baseClick()

    $('a[name="collects"]', '#pagenation').click(function () {

        $('#couponCheckbox').parent().parent().parent().addClass('hidden')
        var $inputs = $('input[name="spids"]:checked');
        var referMoney = 0;
        if (!$inputs.length) return;

        var _orderId = "";
        var _paymentType = 0;
        var _paymentTypeFlag = 0;
        var customerId = "";

        var sumMoney = 0;
        var referMoney = 0;

        salesPaymentPostData.paymentInfo = [];
        $.each($inputs, function (i, v) {
            var $input = $(v);

            var row = {
                "orderId": $input.attr("orderid"),
                "customerId": $input.attr("customerid"),
                "paymentType": $input.attr("paymentType"),
                "referMoney": $input.attr("refermoney"),
                "spid": $input.attr("spid"),
            }

            if (_orderId == "") {
                _orderId = row.orderId;
            } else {
                if (_orderId != row.orderId) {
                    core.showAlert(core.warning, "批量收款不支持不同订单间的操作.");
                    _paymentTypeFlag = 1;
                }
            }

            if (customerId == "") {
                customerId = row.customerId;
            } else {
                if (customerId != row.customerId) {
                    core.showAlert(core.warning, "批量收款不支持不同客户间的操作.");
                    _paymentTypeFlag = 2;
                }
            }

            salesPaymentPostData.orderId = _orderId;
            salesPaymentPostData.customerId = customerId;

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
        });

        $("#sumMoney").val(sumMoney);
        $("#sumMoneyShow").html(sumMoney);

        if (_paymentTypeFlag != 0) {
            _paymentTypeFlag != 1 ? _paymentTypeFlag != 2 ? core.showAlert(core.warning, "批量收款只能选择相同类型的收款项") : core.showAlert(core.warning, "批量收款只能选择相同类型的收款项") : core.showAlert(core.warning, "批量收款不支持不同订单间的操作");
            return false;
        }

        if (sumMoney >= 0) {
            initBaseModal();

            $("#referMoney").val(sumMoney).attr("disabled", "disabled");
            $("#couponCheckbox").attr("disabled", "disabled");

        } else {
            core.showAlert(core.warning, "退款不支持批量操作!");
        }

        $.each($inputs, function (index, value) {
            var $that = $(value);
            referMoney += parseFloat($that.attr('referMoney'));
        })
        $('#referMoney').val(referMoney);

        openlayer(function () {
            payment();
            layer.closeAll();
        })
    });


    $('a[name="import"]', '#hpagenation').click(function () {

        if ($('span[name="totalRecords"]').text() == 0) {
            core.showAlert(core.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
            core.showAlert(core.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        core.post(api.payment.pageSalesPaymentForNotInit, $.extend({}, params.hsalesPaymentPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["编号", "sales.no"],
                    ['楼盘地址', 'sales.village.villageName '],
                    ['品牌', 'brand'],
                    ['应收金额', 'referMoney'],
                    ['收款人', 'collecter.currentName '],
                    ['收款时间', 'collectTime'],
                    ['类型', 'type'],
                    ['状态', 'status'],
                    ['备注', 'des'],
                    ['现金', 'cash'],
                    ['银行', ['bank', 'bankInfo']],
                    ['转账', ['checkv', 'checkvBank']],
                    ['分期', ['installment', 'installmentBank']],
                    ['对公', ['accounts', 'accountsBank']],
                    ['预付款', 'advance'],
                    ['券', ['coupon', 'couponInfo']],
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

                v.checkvBankName = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPayment.checkBankInfo[v.checkvBankName] : '';
                v.installmentBankName = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPayment.bankInfo[v.installmentBankName] : '';
                v.accountsBankName = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPayment.accountsInfo[v.accountsBankName] : '';

                v.paymentType = salesPayment.salesPaymentTypeData[v.type];
                v.paymentStatus = v.status == 1 ? '待确认' : '已确认';
            });
        });
    });

    function initBaseModal() {

        for (var i = 0; i < salesPayment.salesLayerNameData.length; i++) {
            var _name = salesPayment.salesLayerNameData[i];
            var _checkboxId = "#" + _name + "Checkbox";
            var _divId = "#" + _name + "Div";
            var _inputId = "#" + _name;
            var _selectId = "";
            if (_name != "bank") {
                _selectId = "#" + _name + "BankName";
            } else {
                _selectId = "#" + _name + "Name";
            }

            $(_divId).addClass("hide");
            $(_checkboxId).removeAttr("checked").removeAttr("disabled");

            $(_inputId).val("");
            $(_selectId).val("");

            if (_name == "coupon") {
                $("#couponType").chosen("destroy");
                $("#couponType").chosen({width: "216px", multi_type: "input"});
                $("#couponType").bindData(salesPayment.couponType, 'key', 'name');
                $("#couponType").trigger("chosen:updated");
            } else if (_name == "bank") {
                $("#bankDivGroup").html("");
                $("#AddBank").attr("num", 0);
            }
        }

        $("des").val("");
    }

    function showInfo(msg) {
        layer.msg(msg);
    }

    function dialogPayment(payment){

        if([1, 2, 3].indexOf(payment.paymentType) != -1){ // 预付款、订金、全款
            initBaseModal();
            $("#referMoney").val(payment.referMoney).attr("disabled", "disabled");

            salesPaymentPostData.orderId = payment.orderId;
            salesPaymentPostData.customerId = payment.customerId;

            salesPayment.items.couponType.chosen("destroy");
            salesPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
            salesPayment.items.couponType.bindData(salesPayment.couponType, 'key', 'name');
            salesPayment.items.couponType.trigger("chosen:updated");

            openlayer(function(){

            })
        }else if([4, 5, 6, 7].indexOf(payment.paymentType) != -1){ // 退款
            initRefundModal();
            $("#refundSum").val(payment.referMoney).attr("disabled", "disabled");
            $("#refundCouponDiv").addClass("hide");

            core.post(api.payment.refundSalesPaymentForCoupon, {
                "sales.sid":payment.sales.sid,
                "sales.coupon":payment.salesReceipt.coupon,
                "sales.couponInfo":payment.salesReceipt.couponInfo
            }, function(res){
                if(res.coupon != 0){
                    $("#refundCouponDiv").removeClass("hide");
                    $("#couponValue").attr("disabled", "disabled");
                    $("#couponValue").val(res.salesReceipt.coupon);
                }
            });

            openlayer(function(){})
        }

        salesPaymentPostData.paymentInfo = [payment];

        salesPayment.editFlg =  false;
    }

    function initRefundModal(){
        $("#refundBankCardDiv").addClass("hide");
        $("#refundBankCard").removeAttr("checked","checked");
        $("#refundBankName").removeClass("v_required");
        $("#refundCash").attr("checked","checked");

        $("#refundSum").val("");
        $("#refundBankName").val("");
        $("#refundContent").val("");

        $("#refundCouponType").chosen("destroy");
        $("#refundCouponType").chosen({width: "216px", multi_type: "input"});
        $("#refundCouponType").bindData(salesPayment.couponType, 'key', 'name');
        $("#refundCouponType").trigger("chosen:updated");
    }


    function payments(){

        var url = "";
        var options = {};
        var args = {};
        var referPayment = $("#referMoney").val();
        var realPayment = 0;
        var couponCount = 0;

        var resMrIdIndex = "";

        var mpIds = "";
        var _paymentInfo = "#paymentInfo";

        $(_paymentInfo).text("");

        for(var i=0;i<salesPayment.salesLayerNameData.length;i++){

            var _paymentName = salesPayment.salesLayerNameData[i];
            var _checkboxId = "#" + _paymentName + "Checkbox";
            var _inputId = _paymentName;
            var _selectId = "";

            if(_paymentName == "coupon" || _paymentName == "advance"){
                _selectId = _paymentName + "Type";
            }else if(_paymentName != "bank"){
                _selectId = _paymentName + "Bank";
            }else{
                _selectId = _paymentName + "Name";
            }

            $(_checkboxId).on("change", function(){
                $(_paymentInfo).text("");
            });

            $("#"+_selectId).on("change", function(){
                $(_paymentInfo).text("");
            });

            $("#"+_paymentName).on("keydown", function(){
                $(_paymentInfo).text("");
            });

            if($(_checkboxId).prop("checked")){

                var _payment = 0;

                if(_paymentName == "cash"){
                    args["cash"] = $("#cash").val();
                    args["cashInfo"] = $("#cashInfo").val();

                    _payment = $("#cash").val();
                }else if(_paymentName == "bank"){
                    var _bank = 0;
                    var _bankInfo = "#";

                    var bankAdd = $("#AddBank");
                    var num = parseInt(bankAdd.attr("num"));
                    for(var j=0;j<num;j++){
                        var index = j + 1;
                        var bankName = $("#bankName_"+index).val();
                        var bankMoney = $("#bank_"+index).val();
                        var bankDate = $("#bankDate_"+index).val();
                        var bankTime = $("#bankTime_"+index).val();

                        _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

                        _bank = utils.accAdd(parseFloat(bankMoney), _bank);
                    }

                    args["bank"] = _bank;
                    args["bankInfo"] = _bankInfo;

                    _payment = _bank;
                }else if(_paymentName == "coupon"){
                    var _coupon = 0;
                    var _couponInfo = "#";

                    $("[class='search-choice']", $("#couponType_chosen")).each(function(i, e){

                        var _ = $(e);

                        _couponVal = _.children('span').children('input').val();
                        _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                        _couponInfo += _.children('span').text() + ":" + _couponVal + "#";

                        couponCount++;
                    });

                    args["coupon"] = _coupon;
                    args["couponInfo"] = _couponInfo;

                    _payment = _coupon;
                }else{
                    args[_inputId] = $("#" + _inputId).val();
                    _payment = $("#" + _inputId).val();
                }

                if($(_checkboxId).attr("select") == "1"){
                    args[_selectId] = $("#" + _selectId).val();
                }

                realPayment = utils.accAdd(realPayment, parseFloat(_payment));
            }
        }

        if(referPayment != realPayment){
            core.showAlert(core.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if($("#advanceCheckbox").prop("checked")){
            var _advance = 0;
            var advanceType = $("#advanceType").val();

            if(advanceType == 1){
                _advance = parseFloat($("#materialAdvance").val());
            }else if(advanceType == 2){
                _advance = parseFloat($("#zaterialAdvance").val());
            }

            if(_advance > 0 && _advance < parseFloat($("#advance").val())){
                core.showAlert(core.warning, "预付款金额大于当前客户预付款余额!");
                return false;
            }
        }

        if($.isEmptyObject(args)){
            core.showAlert(core.warning, "无收款方式信息");
            return false;
        }

        url = api.payment.collectSalesPayments;

        $.each(salesPaymentPostData.paymentInfo, function(i, v){
            options["salesPayments["+i+"].spId"] = v.spId;
        })

        for(var arg in args){
            options["materialReceipt."+arg] = args[arg];
        }

        options["materialReceipt.des"] = $("#des").val();

        resMrIdIndex = "materialReceipt";

        options["materialSubOrder.orderId"] = salesPaymentPostData.orderId;

        core.post(url, options, function(result){

            shoukuanSearcher.doSearch();

            salesPayment.historyFlag = false;

            var srId = "&salesReceipt.srId=" + result.salesReceipt.srId;

            bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                if(result){
                    var url = api.index.salesPaymentReceiptIndex.url + "?orderId=" + srId + "&time=" + params.loginTime;
                    window.open(url);
                }
            });
        });

        salesPaymentPostData.paymentInfo = []
    }

    function payment(){

        var url = "";
        var options = {};
        var args = {};
        var referPayment = $("#referMoney").val();
        var realPayment = 0;
        var couponCount = 0;

        var resMrIdIndex = "";

        var spIds = "";
        var _paymentInfo = "#paymentInfo";

        $(_paymentInfo).text("");

        for(var i=0;i<salesPayment.salesLayerNameData.length;i++){

            var _paymentName = salesPayment.salesLayerNameData[i];
            var _checkboxId = "#" + _paymentName + "Checkbox";
            var _inputId = _paymentName;
            var _selectId = "";

            if(_paymentName == "advance"){
                _selectId = _paymentName + "Type";
            }else if( _paymentName == "coupon" || _paymentName == "bank" ||_paymentName == "cash"){
                _selectId = _paymentName + "Info";
            }else{
                _selectId = _paymentName + "Bank";
            }

            if($(_checkboxId).parent().hasClass('checked')){
                $(_paymentInfo).text("");
            }

            $("#"+_selectId).on("change", function(){
                $(_paymentInfo).text("");
            });

            $("#"+_paymentName).on("keydown", function(){
                $(_paymentInfo).text("");
            });

            if($(_checkboxId).prop("checked")){

                var _payment = 0;

                if(_paymentName == "cash"){
                    args["cash"] = $("#cash").val();
                    args["cashInfo"] = $("#cashInfo").val();

                    _payment = $("#cash").val();
                }else if(_paymentName == "bank"){
                    var _bank = 0;
                    var _bankInfo = "#";

                    var bankAdd = $("#AddBank");
                    var num = parseInt(bankAdd.attr("num"));
                    for(var j=0;j<num;j++){
                        var index = j + 1;
                        var bankName = $("#bankName_"+index).val();
                        var bankMoney = $("#bank_"+index).val();
                        var bankDate = $("#bankDate_"+index).val();
                        var bankTime = $("#bankTime_"+index).val();

                        _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

                        _bank = utils.accAdd(parseFloat(bankMoney), _bank);
                    }

                    args["bank"] = _bank;
                    args["bankInfo"] = _bankInfo;

                    _payment = _bank;
                }else if(_paymentName == "coupon"){
                    var _coupon = 0;
                    var _couponInfo = "#";

                    $("[class='search-choice']", $("#couponType_chosen")).each(function(i, e){

                        var _ = $(e);

                        _couponVal = _.children('span').children('input').val();
                        _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                        _couponInfo += _.children('span').text() + ":" + _couponVal + "#";

                        couponCount++;
                    });

                    args["coupon"] = _coupon;
                    args["couponInfo"] = _couponInfo;

                    _payment = _coupon;
                }else{
                    args[_inputId] = $("#" + _inputId).val();
                    _payment = $("#" + _inputId).val();
                }

                if($(_checkboxId).attr("select") == "1"){
                    args[_selectId] = $("#" + _selectId).val();
                }

                realPayment = utils.accAdd(realPayment, parseFloat(_payment));
            }
        }

        if(referPayment != realPayment){
            core.showAlert(core.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if($("#advanceCheckbox").prop("checked")){
            var _advance = 0;
            var advanceType = $("#advanceType").val();

            if(advanceType == 1){
                _advance = parseFloat($("#materialAdvance").val());
            }else if(advanceType == 2){
                _advance = parseFloat($("#zaterialAdvance").val());
            }

            if(_advance > 0 && _advance < parseFloat($("#advance").val())){
                core.showAlert(core.warning, "预付款金额大于当前客户预付款余额!");
                return false;
            }
        }

        if($.isEmptyObject(args)){
            core.showAlert(core.warning, "无收款方式信息");
            return false;
        }

        url = api.payment.collectSalesPayments;

        $.each(salesPaymentPostData.paymentInfo, function(i, v){
            options["salesPayments["+i+"].spId"] = v.spId;
        })

        for(var arg in args){
            options["materialReceipt."+arg] = args[arg];
        }

        options["materialReceipt.des"] = $("#des").val();

        resMrIdIndex = "materialReceipt";

        options["materialSubOrder.orderId"] = salesPaymentPostData.orderId;

        core.post(url, options, function(result){

            shoukuanSearcher.doSearch();

            salesPayment.historyFlag = false;

            var srId = "&salesReceipt.srId=" + result.salesReceipt.srId;

            bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                if(result){
                    var url = api.index.salesPaymentReceiptIndex.url + "?orderId=" + srId + "&time=" + params.loginTime;
                    window.open(url);
                }
            });
        });

        salesPaymentPostData.paymentInfo = []
    }

});
