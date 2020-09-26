
$(function () {
    var salesPayment = {
        salesPaymentModelNameData: ["bank", "advance"],
        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        customerId: null,
        items: {
            bankCheckbox: com.focusPage("#bankCheckbox"),
            advanceCheckbox: com.focusPage("#advanceCheckbox"),
            payAdvance: com.focusPage("#payAdvance"),
            collectDes: com.focusPage("#collectDes")
        },
        collectOrRefundFalg: null,
        coupon: 0,
        couponInfo: null,
        firstSid: 0,
        spids: [],
        decorationType: [],
        htmlName: "salesPos",
        modelId: 'layerAdd',
        myModalLabel: com.focusPage("#myModalLabel"),
        modals: {
            layerAdd: com.focusPage("#layerAdd")
        },

        cash: [],
        bank: [],
        checkBank: [],
        accounts: [],
        couponType: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkBankUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkBankInfo: {},
        accountsInfo: {},
        couponTypeData: {},

        bankUtilForGrade: [],
        checkBankUtilForGrade: [],

        mno: null,
        _posway: [],
        pointofsalesType: 3
    };

    var salesPaymentPostData = {};

    //获得页面控制参数
    var pageConfig = params.urlLoadParams.depage;

    paymentUtils.getReceiptType(salesPayment);

    //checkbox选中时联动
    com.focusPage("#layerAdd :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
        if($(this).prop("checked") && this.id == "bankCheckbox"){
            com.focusPage("#salesPosbankDivGroup").html("");
            paymentUtils.addBankPosUtil("#salesPosbankDivGroup", salesPayment.bankUtilForGrade, salesPayment);
        }else if($(this).prop("checked") && this.id == "advanceCheckbox"){
            var orderId = com.focusPage('#layerAdd').attr('orderId');

            com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": orderId}, function (res) {
                com.focusPage("#advance").val(res["materialAdvance"]).attr("readonly", "readonly");
            }, null, false);
        }
    });

    com.post(api.ds.payment, {}, function (res) {
        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPayment.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }

        $.each(res.posway, function (i, v) {
            salesPayment._posway.push(v);
        });
    }, null, false);

    com.post(api.ds.decoration, {}, function(res){
        salesPayment.decorationType = res.typeness;
    }, null, false);

    com.focusPage("#advanceType").bindData([{"key": "3", "value": "主材预付款"}], 'key', 'value');

    com.focusPage("#historySalesPaymentPosList").removeClass("active");

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
                ["销售单等级:", v.sales.grade, "blue"],
                ["楼盘地址:", v.sales.house.village.cityProper.city.name + ' ' + v.sales.house.village.cityProper.name + ' ' + v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
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
                com.focusPage('#collectDes').removeAttr('readonly');
                com.focusPage("#historyUpdateSA").addClass("hide");
                com.focusPage("#couponDiv div.form-group").removeClass("hide");
                com.focusPage('.couponBlue').remove();
                com.focusPage('#advanceType').removeAttr("disabled");
                com.focusPage('#payAdvance').removeAttr("readonly");

                var $layerrAdd = com.focusPage('#layerAdd');
                $layerrAdd.attr('spid', v.spid);
                $layerrAdd.attr('sid', v.sales.sid);

                if ([4, 5, 6, 7].indexOf(v.type) != -1) {
                    //退款
                    salesPayment.collectOrRefundFalg = 2;
                    com.focusPage("#bankCheckbox").attr("disabled","disabled");
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
                }else{
                    //收款
                    salesPayment.collectOrRefundFalg = 1;
                    com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
                    com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');

                    //查询是否有pos推送数据
                    com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.sales.orderId}, function(res){
                        $.each(res.pointofsaleses, function(i, value){
                            if(value.status == 0 || value.status == 1) {
                                paymentUtils.addPos(value, salesPayment.htmlName);
                                com.focusPage("#bankCheckbox").prop("checked", true);
                                com.focusPage("#posDiv").prop("style", "display: block");
                                com.focusPage("#bankDiv").prop("style", "display: block");
                            }
                        });
                        res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#salesPosbankDivGroup", salesPayment.bankUtilForGrade, salesPayment) : "";
                    });
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

                //所有款项的pid都使用装修单号
                salesPayment.mno = v.sales.orderId;

                com.focusPage("#layerAdd").modal("show");
            });

            //查看装修单
            $btnDecorationInfo.click(function(){
                paymentUtils.decorationInfoShow(v.sales.orderId, salesPayment.decorationType);
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

    //画页面的过滤条件
    paymentUtils.drawFilter(com.focusPage("#condList"), [{"labelVal":"装修单号", "inputId":"salesFilterOrderId"}, {"labelVal":"销售单号", "inputId":"salesFilterNo"}], getSalesPayment);

    //页面初始查询
    getSalesPayment();

    //批量收款
    var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px").appendTo(com.focusPage("#pagenation"));
    var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
    var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

    $adda.click(function () {
        salesPayment.collectOrRefundFalg = 3;

        com.focusPage("#myModalLabel").html("批量收款信息");

        com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
        com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
        com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');

        com.focusPage('#advanceCheckbox').removeAttr('disabled');
        com.focusPage('#collectDes').removeAttr('readonly');
        com.focusPage("#historyUpdateSA").addClass("hide");
        com.focusPage('#advanceType').removeAttr("disabled");
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

        com.focusPage('#referMoney').val(sumMoney);

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

        //查询是否有pos推送数据
        com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": orderId[0]}, function(res){
            $.each(res.pointofsaleses, function(i, value){
                if(value.status == 0 || value.status == 1) {
                    paymentUtils.addPos(value, salesPayment.htmlName);
                    com.focusPage("#bankCheckbox").prop("checked", true);
                    com.focusPage("#posDiv").prop("style", "display: block");
                    com.focusPage("#bankDiv").prop("style", "display: block");
                }
            });
            res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#salesPosbankDivGroup", salesPayment.bankUtilForGrade, salesPayment) : "";
        });

        salesPayment.mno = orderId[0];

        com.focusPage("#layerAdd").modal('show');
    });

    //合计
    var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px").appendTo(com.focusPage("#pagenation"));
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
        }), com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>'));
    });

    //为了在util中可以拿到Searcher
    salesPayment.salesPaymentSearcher = {"doSearch": getSalesPayment};

    com.focusPage("#collectOrRefundBtn").click(function(){
        if(salesPayment.collectOrRefundFalg <= 2){
            var $layerrAdd = com.focusPage('#layerAdd');
            var spid = $layerrAdd.attr('spid');
            var sid = $layerrAdd.attr('sid');
            var referMoney = com.focusPage('#referMoney').val();

            var _coupon = 0;
            var _couponInfo = "#";

            if(salesPayment.collectOrRefundFalg == 1){
                //收款
                paymentUtils.aboutcollectAndRefundMoney(sid, spid, null, referMoney, _coupon, _couponInfo, "single", api.payment.collectSalesPayment, "collect", salesPayment);
            }
        }else if(salesPayment.collectOrRefundFalg == 3){
            //批量收款
            paymentUtils.aboutcollectAndRefundMoney(salesPayment.firstSid, null, salesPayment.spids, com.focusPage('#referMoney').val(), 0, null, "many", api.payment.collectSalesPayments, "collect", salesPayment);
        }
    });

    //历史收款页面
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

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["销售单等级:", v.sales.grade, "blue"],
                ["楼盘地址:",  v.sales.house.village.cityProper.city.name + ' ' + v.sales.house.village.cityProper.name + ' ' + v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
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
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(v.salesReceipt.bank, v.salesReceipt.bankInfo, salesPayment.bankInfo), "blue"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.salesReceipt.checkv, v.salesReceipt.checkvBank, salesPayment.checkBankInfo), "blue"]) : true;
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

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            //查看装修单
            $decorationInfoBtn.click(function(){
                paymentUtils.decorationInfoShow(v.sales.orderId, salesPayment.decorationType);
            });

            $btnPrint.click(function () {
            	params.salesReceiptSrId = v.salesReceipt.srId;
                com.popup("专用收款收据__装修单号: " + v.sales.orderId, api.index.salesPaymentReceiptIndex.url, function () {
                    parent.layer.getFrameIndex(window.name);
                }, null, true);
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

    hsearcher.init(["payment-orderId", "payment-sales-no"], "hcondList", api.payment.pageSalesPaymentForNotInit, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hsalesPaymentPostDataPos"+pageConfig, {"companyType": pageConfig}, false, null, null, "hresultList");

    //隐藏触发
    com.focusPage("#layerAdd").on('hide.bs.modal', function(){
        com.closeTip();

        salesPayment.bankUtilForGrade = [];
        salesPayment.checkBankUtilForGrade = [];

        com.focusPage('#salesPosbankDivGroup').empty();

        com.cleanItems(salesPayment.items);
        com.focusPage("#salesPosposDivGroup").html("");
        com.focusPage("#bankCheckbox").removeAttr("disabled");
    });

    //获取销售款项
    function getSalesPayment(){
        var salesPaymentOptions = {
            "salesPayment.sales.orderId" : com.focusPage("#salesFilterOrderId").val(),
            "salesPayment.sales.no" : com.focusPage("#salesFilterNo").val(),
            "salesPayment.status" : 0,
            "companyType": pageConfig,
            "filters[0].field": "type",
            "filters[0].data": "[2, 3, 8]",
            "filters[0].op": "in"
        };

        com.post(api.payment.querySalesPaymentByOrderId, salesPaymentOptions, function(res){
            var data = res.salesPayments;
            data != null && data.length > 0 ? displayFunc.init('resultList', data) : paymentUtils.emptyData(com.focusPage("#resultList"));
        });
    }
});
