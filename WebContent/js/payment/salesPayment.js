
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
        spids: [],
        decorationType: [],
        htmlName: "sales"
    };

    var salesPaymentPostData = {};

    salesPayment.layerAdd = com.focusPage("#layerAdd");
    salesPayment.myModalLabel = com.focusPage("#myModalLabel");
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

    salesPayment.bankUtilForGrade = [];
    salesPayment.checkBankUtilForGrade = [];

    salesPayment.cashInfo = {};
    salesPayment.bankInfo = {};
    salesPayment.checkBankInfo = {};
    salesPayment.accountsInfo = {};
    salesPayment.couponTypeData = {};

    paymentUtils.getReceiptType(salesPayment);
    com.focusPage("#couponType").bindData(salesPayment.couponType, 'no', 'name');
    com.focusPage("#couponType").trigger("chosen:updated");

    paymentUtils.dynamicChosen('layerAdd', "salescashInfo", salesPayment.cashUtil, "key", "value");

    $.extend(com.validator, salesPayment.validator);

    com.focusPage("#historySales").removeClass("active");

    com.post(api.ds.payment, {}, function (res) {
        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPayment.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    com.post(api.ds.decoration, {}, function(res){
        salesPayment.decorationType = res.type;
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
        paymentUtils.addBankUtil(maxNum, "bankDiv", "#salesbankDivGroup", salesPayment.bankNums, salesPayment.bankUtilForGrade, salesPayment.htmlName, 'layerAdd');

        return false;
    });

    com.focusPage("#salescheckvAdd").on('click',function(){
        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;
        $(this).attr("num", nextNum);

        var maxNum = $(this).attr("maxnum");
        maxNum = parseInt(maxNum)+1;
        $(this).attr("maxnum", maxNum);
        paymentUtils.addBankUtil(maxNum, "checkvDiv", "#salescheckvDivGroup", salesPayment.checkvNums, salesPayment.checkBankUtilForGrade, salesPayment.htmlName, 'layerAdd');

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

            var $btnDecorationInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
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
                "paymentType": v.type,
                "grade": v.sales.grade
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

            $divBtnWrap.append($btnDecorationInfo).append($btnCollect).appendTo($h3);
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

                var gradeParam;
                if(v.sales.grade == "B"){
                    gradeParam = "B";
                }else{
                    gradeParam = "";
                }

                // 根据等级在数组中筛选出符合要求的用于显示
                var returnGradeParams = paymentUtils.getValueForGrade(salesPayment.bank, salesPayment.checkBank, gradeParam);
                salesPayment.bankUtilForGrade = returnGradeParams[0];
                salesPayment.checkBankUtilForGrade = returnGradeParams[1];

                com.focusPage("#layerAdd").modal("show");
            });

            //查看装修单
            $btnDecorationInfo.click(function(){
                decorationInfoShow(v);
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
            var gradeArray = [];

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
                    "grade": $input.attr("grade")
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
                gradeArray.indexOf(row.grade) == 0 ? gradeArray : gradeArray.push(row.grade);
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

            if(gradeArray.length > 1){
                com.showAlert(com.warning, "批量收款不支持不同销售单类型之间的操作.");
                return false;
            }

            var gradeParam;
            if(gradeArray[0] == "B"){
                gradeParam = "B";
            }else{
                gradeParam = "";
            }

            // 根据等级在数组中筛选出符合要求的用于显示
            var returnGradeParams = paymentUtils.getValueForGrade(salesPayment.bank, salesPayment.checkBank, gradeParam);
            salesPayment.bankUtilForGrade = returnGradeParams[0];
            salesPayment.checkBankUtilForGrade = returnGradeParams[1];

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

            var $decorationInfoBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
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

            $divBtnWrap.append($decorationInfoBtn).append($btnPrint).appendTo($h3);

            if(v.status == 1){
                $divBtnWrap.append($btnUpdate);
            }

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            //查看装修单
            $decorationInfoBtn.click(function(){
                decorationInfoShow(v);
            });

            $btnPrint.click(function () {
                printPayment(v.sales.orderId, v.salesReceipt.srId, v);
            });

            //更新功能
            $btnUpdate.click(function(){
                paymentUtils.salesPaymentUpdate(v, salesPayment);
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

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
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
                paymentUtils.aboutcollectAndRefundMoney(sid, spid, null, referMoney, _coupon, _couponInfo, "single", api.payment.collectSalesPayment, "collect", salesPayment);
            }else if(salesPayment.collectOrRefundFalg == 2){
                //退款
                paymentUtils.aboutcollectAndRefundMoney(sid, spid, null, referMoney, _coupon, _couponInfo, "single", api.payment.refundSalesPayment, "refund", salesPayment);
            }
        }else if(salesPayment.collectOrRefundFalg == 3){
            //批量收款
            paymentUtils.aboutcollectAndRefundMoney(salesPayment.firstSid, null, salesPayment.spids, com.focusPage('#referMoney').val(), 0, null, "many", api.payment.collectSalesPayments, "collect", salesPayment);
        }else if(salesPayment.collectOrRefundFalg == 4){
            //更新收款
            var spid = com.focusPage('#layerAdd').attr('spid');
            var referMoney = com.focusPage('#referMoney').val();
            paymentUtils.aboutcollectAndRefundMoney(null, spid, null, referMoney, salesPayment.coupon, salesPayment.couponInfo, "single", api.payment.updateSalesPayment, "update", salesPayment);
        }
        salesPaymentSearcher.doSearch();
        hsearcher.doSearch();
    });

    //隐藏触发
    com.focusPage("#layerAdd").on('hidden.bs.modal', function(){
        com.cleanItems("layerAdd");
        com.clearValidator("layerAdd");

        salesPayment.bankNums=[];
        salesPayment.checkvNums=[];
        salesPayment.bankUtilForGrade = [];
        salesPayment.checkBankUtilForGrade = [];

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

    function decorationInfoShow(v){
        com.focusPage("text").css("line-height", "27px");
        com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId" : v.sales.orderId}, function(res){
            var decorationInfo = res.decoration;
            com.focusPage("#orderId").html(decorationInfo.orderId);
            com.focusPage("#address").html(decorationInfo.house.village.name +''+ decorationInfo.house.houseNumber);
            com.focusPage("#type").html(salesPayment.decorationType[decorationInfo.type].value);
            com.focusPage("#grade").html(decorationInfo.grade);
            com.focusPage("#decorationInfo").modal("show");
        });
    }
});
