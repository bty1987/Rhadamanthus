
$(function () {
    var salesPayment = {
        salesPaymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        customerId: null,
        items: {
            cashCheckbox: com.focusPage("#cashCheckbox"),
            bankCheckbox: com.focusPage("#bankCheckbox"),
            checkvCheckbox: com.focusPage("#checkvCheckbox"),
            advanceCheckbox: com.focusPage("#advanceCheckbox"),
            couponCheckbox: com.focusPage("#couponCheckbox"),
            couponType: com.focusPage('#couponType'),
            couponVal: com.focusPage("#couponVal"),
            cash: com.focusPage("#cash"),
            payAdvance: com.focusPage("#payAdvance"),
            collectDes: com.focusPage("#collectDes")
        },
        checkvNums: [],
        collectOrRefundFalg: null,
        coupon: 0,
        couponInfo: null,
        firstSid: 0,
        spids: [],
        decorationType: [],
        htmlName: "sales",
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

    com.selectTypeahead("salescashInfo", salesPayment.cashUtil, "key", "value", null);

    com.focusPage("#historySales").removeClass("active");

    //checkbox选中时联动
    com.focusPage("#layerAdd :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
        if($(this).prop("checked") && this.id == "bankCheckbox"){
            com.focusPage("#salesbankDivGroup").html("");
            paymentUtils.addBankPosUtil("#salesbankDivGroup", salesPayment.bankUtilForGrade, salesPayment);
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

    com.focusPage("#salescheckvAdd").on('click',function(){
        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;
        $(this).attr("num", nextNum);

        var maxNum = $(this).attr("maxnum");
        maxNum = parseInt(maxNum)+1;
        $(this).attr("maxnum", maxNum);
        paymentUtils.addBankUtil(maxNum, "checkvDiv", "#salescheckvDivGroup", salesPayment.checkvNums, salesPayment.checkBankUtilForGrade, salesPayment);

        return false;
    });

    //优惠券
    com.selectTypeahead("couponType", salesPayment.couponType, 'no', 'name');

    com.focusPage("#couponAdd").unbind().click(function(){
        if(com.validate("couponInputs")){
            return;
        }

        paymentUtils.createCounpon();

        com.focusPage("#couponType").val('');
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
                com.focusPage('#couponCheckbox').removeAttr('disabled');
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
                    com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
                }else{
                    //收款
                    salesPayment.collectOrRefundFalg = 1;
                    com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
                    com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
                    com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
                    com.focusPage('#couponCheckbox').parents('.inline').addClass('show');

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
                        res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#salesbankDivGroup", salesPayment.bankUtilForGrade, salesPayment) : "";
                    });

                    //所有款项的pid都使用装修单号
                    salesPayment.mno = v.sales.orderId;
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

    var salesPaymentSearcher = new Searcher();

    salesPaymentSearcher.init(["payment-orderId", "payment-sales-no", "payment-designer", "payment-village"], 'condList', api.payment.pageSalesPaymentForInit, function (data) {
        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesPaymentPostData'+pageConfig, {"companyType": pageConfig}, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

        $adda.click(function () {
            salesPayment.collectOrRefundFalg = 3;

            com.focusPage("#myModalLabel").html("批量收款信息");

            com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
            com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
            com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
            com.focusPage('#couponCheckbox').parents('.inline').addClass('hidden');

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
                res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#salesbankDivGroup", salesPayment.bankUtilForGrade, salesPayment) : "";
            });

            //推送pos信息需要的参数
            salesPayment.mno = orderId[0];

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
            }), com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>'));
        });

        return [$adda, $showa];
    }, 'resultList');

    //为了在util中可以拿到Searcher
    salesPayment.salesPaymentSearcher = salesPaymentSearcher;

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

            if(v.status == 1){
                $divBtnWrap.append($btnUpdate);
            }

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            //查看装修单
            $decorationInfoBtn.click(function(){
                paymentUtils.decorationInfoShow(v.sales.orderId, salesPayment.decorationType);
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

    hsearcher.init(["payment-orderId", "payment-sales-no", "payment-designer", "payment-village", "payment-collectTime"], "hcondList", api.payment.pageSalesPaymentForNotInit, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hsalesPaymentPostData"+pageConfig, {"companyType": pageConfig}, false, null, function () {
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        $impa.click(function () {
            salesPaymentForNotInitImport();
        });

        return [$impa];
    }, "hresultList");

    salesPayment.hsearcher = hsearcher;

    function salesPaymentForNotInitImport() {
        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPaymentForNotInit, $.extend({}, params["hsalesPaymentPostData"+pageConfig], {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["销售单号", "sales.no"],
                    ['楼盘地址', ['sales.house.village.cityProper.city.name', 'sales.house.village.cityProper.name', 'sales.house.village.name', 'sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['应收金额', 'referMoney'],
                    ['收款人', 'salesReceipt.collecter.currentName'],
                    ['收款时间', 'salesReceipt.collectTime'],
                    ['类型', 'type'],
                    ['状态', 'status'],
                    ['备注', 'salesReceipt.comment'],
                    ['现金', 'salesReceipt.cash'],
                    ['刷卡', ['salesReceipt.bank', 'salesReceipt.bankInfo']],
                    ['银行', ['salesReceipt.checkv', 'salesReceipt.checkvBank']],
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
    	params.salesReceiptSrId = srId;
        com.popup("专用收款收据__装修单号: " + orderId, api.index.salesPaymentReceiptIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);
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
            com.focusPage("#couponUl>li").each(function (i, v) {
                var _ = com.focusPage(v);
                var _couponVal = _.children('span').attr('money');

                if (_couponVal < 0) {
                    flagCoupon = false;
                }

                if (_couponVal == "") {
                    _couponVal = 0;
                }

                _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                _couponInfo += _.children('span').attr('typeName') + ":" + _couponVal + "#";

            });

            if (!flagCoupon) {
                com.showAlert(com.warning, '代金券价格填写错误');
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
    });

    //隐藏触发
    com.focusPage("#layerAdd").on('hide.bs.modal', function(){
        com.closeTip();

        salesPayment.checkvNums=[];
        salesPayment.bankUtilForGrade = [];
        salesPayment.checkBankUtilForGrade = [];

        com.focusPage('#salescheckvAdd').attr("num", 0).attr("maxnum", 0);
        com.focusPage('#salesbankDivGroup').empty();
        com.focusPage('#salescheckvDivGroup').empty();
        com.focusPage('.search-choice').find('input').val('');

        com.cleanTypeahead('salescashInfo');
        com.cleanItems(salesPayment.items);
        com.focusPage("#couponUl").html("");
        com.focusPage("#salesposDivGroup").html("");
        com.focusPage("#bankCheckbox").removeAttr("disabled");
    });
});
