
$(function () {
    var salesPaymentForStatus = {
        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        couponType: {},
        couponTypeData: {},
        customerId: null,
        validator: {
            price: {
                type: 'v_price',
                regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
                errorMsg: "价格内容输入错误"
            }
        }
    };

    com.post(api.common.queryReceiptType, {}, function (res) {
        salesPaymentForStatus.cash = [];
        salesPaymentForStatus.bank = [];
        salesPaymentForStatus.checkBank = [];
        salesPaymentForStatus.accounts = [];
        salesPaymentForStatus.couponType = [];

        salesPaymentForStatus.cashInfo = {};
        salesPaymentForStatus.bankInfo = {};
        salesPaymentForStatus.checkBankInfo = {};
        salesPaymentForStatus.accountsInfo = {};
        salesPaymentForStatus.couponTypeData = {};

        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 1) {
                salesPaymentForStatus.cash.push(v);
                salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesPaymentForStatus.bank.push(v);
                salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesPaymentForStatus.checkBank.push(v);
                salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesPaymentForStatus.accounts.push(v);
                salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesPaymentForStatus.couponType.push(v);
                salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });
    }, null, false);

    $.extend(com.validator, salesPaymentForStatus.validator);

    com.post(api.ds.payment, {}, function (res) {
        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPaymentForStatus.salesPaymentTypeData[paymentType.key] = paymentType.value;
            salesPaymentForStatus.salesPaymentRevTypeData[paymentType.value] = paymentType.key;
        }
    }, null, false);

    com.focusPage("#salesPaymentHistoryList").removeClass("active");

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
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["楼盘地址:", v.sales.house.village.name+" "+ v.sales.house.houseNumber, "grey"],
                ["客户:", v.sales.customer.name, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["应收金额:", v.referMoney, "blue"],
                ["收款人:", v.salesReceipt.collecter.currentName, "grey"],
                ["收款时间:", v.salesReceipt.collectTime, "green"],
                ["状态:", v.status == 1 ? '已付款' : '已确认', "red"],
                ["备注:", v.salesReceipt.comment, "grey"]
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': '#478fca !important',
                'font-size': '17px'
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type":"checkbox",
                "name": "spids",
                "spid": v.spid
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(salesPaymentForStatus.salesPaymentTypeData[v.type]);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.appendTo($h3);

            var styleArr = [];

            v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? styleArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                var info = bank + ", ";
                var _s = bankInfo.split('#');
                for (var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint.click(function () {
                printPayment(v.sales.orderId,v.salesReceipt.srId,v);
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
        }
    })();

    var salesPaymentSearcher = new Searcher();
    salesPaymentSearcher.init(["salesPaymentOrderId", "salesPaymentNo", "salesPaymentUserName", "salesPaymentVillage", "salesReceiptCollectTime"], 'condList', api.payment.pageSalesPaymentForCollect, function (data) {
        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesPaymentForStatusPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        $adda.click(function () {
            batchConfirm(salesPaymentSearcher,hsearcher);
        });

        $impa.click(function () {
            salesPaymentForCollentImport("pagenation");
        });

        return [$adda, $impa]
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

            var $btnPrint1 = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["楼盘地址:", v.sales.house.village.name+" "+ v.sales.house.houseNumber, "grey"],
                ["客户:", v.sales.customer.name, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["应收金额:", v.referMoney, "blue"],
                ["收款人:", v.salesReceipt.collecter.currentName, "grey"],
                ["收款时间:", v.salesReceipt.collectTime, "green"],
                ["确认人:", v.salesReceipt.confirmer.currentName, "grey"],
                ["确认时间:", v.salesReceipt.confirmTime, "green"],
                ["状态:", v.status == 1 ? '已付款' : '已确认', "red"],
                ["备注:", v.salesReceipt.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
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
                    info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

            $h3.append($('<small></small>').addClass('blue').html(salesPaymentForStatus.salesPaymentTypeData[v.type]));

            $divBtnWrap.append($btnPrint1).appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint1.click(function () {
                printPayment(v.sales.orderId,v.salesReceipt.srId,v);
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
        }
    })();

    var hsearcher = new Searcher();

    hsearcher.init(["salesPaymentOrderId", "salesPaymentNo", "salesPaymentUserName", "salesPaymentVillage", "salesReceiptConfirmTime"], "hcondList", api.payment.pageSalesPaymentForConfirm, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hsalesPaymentForStatusPostData", null, false, null, function () {
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        $impa.click(function () {
            salesPaymentForConfirmImport("hpagenation");
        });

        return [$impa];
    }, "hresultList");

    function salesPaymentForCollentImport(id) {
        if (com.focusPage('span[name="totalRecords"]', '#' + id).text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPaymentForCollect, $.extend({}, params.salesPaymentForStatusPostData, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["销售单号", "sales.no"],
                    ['楼盘地址', ['sales.house.village.name','sales.house.houseNumber']],
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
                        $info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
                            $checkvInfo += salesPaymentForStatus.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                        }

                        v.salesReceipt.checkvBank = $checkvInfo;
                    }else{
                        v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPaymentForStatus.checkBankInfo[v.salesReceipt.checkvBank] : '';
                    }
                }

                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPaymentForStatus.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPaymentForStatus.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPaymentForStatus.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '已付款' : '已确认';
            });
        });
    }

    function salesPaymentForConfirmImport(id) {
        if (com.focusPage('span[name="totalRecords"]', '#' + id).text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPaymentForConfirm, $.extend({}, params.hsalesPaymentForStatusPostData, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["销售单号", "sales.no"],
                    ['楼盘地址', ['sales.house.village.name','sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['应收金额', 'referMoney'],
                    ['收款人', 'salesReceipt.collecter.currentName'],
                    ['收款时间', 'salesReceipt.collectTime'],
                    ['确认人', 'salesReceipt.confirmer.currentName'],
                    ['确认时间', 'salesReceipt.confirmTime'],
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
                        $info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
                            $checkvInfo += salesPaymentForStatus.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                        }

                        v.salesReceipt.checkvBank = $checkvInfo;
                    }else{
                        v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPaymentForStatus.checkBankInfo[v.salesReceipt.checkvBank] : '';
                    }
                }

                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPaymentForStatus.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPaymentForStatus.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPaymentForStatus.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '已付款' : '已确认';
            });
        });
    }

    function batchConfirm(salesPaymentSearcher,hsearcher) {
        var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

        if (!$inputs.length) return;

        var spids = [];
        var option = {};

        $.each($inputs, function (i, v) {
            var $input = $(v);

            var row = {
                "spid": $input.attr("spid")
            };
            spids.push(row.spid);
        });
        $.each(spids, function (index, value) {
            option["spids[" + index + "]"] = value;
        });

        layer.confirm('确定要将符合条件的所有收款项目,置为已确认状态吗?', {
            btn: ['确定', '取消'] //按钮
        }, function (index, layero) {
            com.post(api.payment.confirmSalesPayment, option, function (res) {
                salesPaymentSearcher.doSearch();
                hsearcher.doSearch();
                layer.msg('确认成功', {icon: 1})
            })
        }, function () {

        });
    }

    function printPayment(orderId,srId,v){
        if(v.salesReceipt.collecter.userId!=params.userInfo.user.userId){
            com.showAlert(com.warning, "收款人不匹配, 不能打印");
            return false;
        }else{
            params.salesReceiptSrId = srId;
            com.popup("专用收款收据__装修单号: " + orderId ,api.index.salesPaymentReceiptIndex.url + "?salesReceipt.srId=" + srId + "&time=" + params.loginTime,function () {
                parent.layer.getFrameIndex(window.name);
            },null,true);
        }
    }

});
