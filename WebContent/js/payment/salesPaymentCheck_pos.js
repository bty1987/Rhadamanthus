
$(function () {
    var salesPaymentForStatus = {
        salesPaymentTypeData: {},
        salesPaymentRevTypeData: {},
        customerId: null,
        items: {
            couponType: com.focusPage('#couponType'),
            cash: com.focusPage("#cash"),
            payAdvance: com.focusPage("#payAdvance"),
            collectDes: com.focusPage("#collectDes")
        },
        checkvNums: [],
        coupon: 0,
        couponInfo: null,
        htmlName: "salesCheck",
        modelId: 'layerAddSalesCheck',
        myModalLabel: com.focusPage("#myModalLabelSalesCheck"),
        modals: {
            layerAdd: com.focusPage("#layerAddSalesCheck")
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
        checkBankUtilForGrade: []
    };

    paymentUtils_pos.getReceiptType(salesPaymentForStatus);

    //隐藏触发
    salesPaymentForStatus.modals.layerAdd.on('hide.bs.modal', function(){
        com.cleanItems(salesPaymentForStatus.items);
        com.closeTip();

        salesPaymentForStatus.checkvNums=[];
        salesPaymentForStatus.bankUtilForGrade = [];
        salesPaymentForStatus.checkBankUtilForGrade = [];

        com.focusPage('[name="top"]').addClass('hide');
        com.focusPage('#salesCheckbankAdd').attr("num", 0).attr("maxnum", 0);
        com.focusPage('#salesCheckcheckvAdd').attr("num", 0).attr("maxnum", 0);
        com.focusPage('input[type="checkbox"]','#form').removeAttr('checked');
        com.focusPage('#salesCheckbankDivGroup').empty();
        com.focusPage('#salesCheckcheckvDivGroup').empty();
        com.focusPage('.search-choice').find('input').val('');

        com.cleanTypeahead('salesCheckcashInfo');

        com.focusPage("#salesCheckposDivGroup").html("");
    });

    baseClick();

    com.focusPage("#advanceType").bindData([{"key": "1", "value": "合同预付款"}, {"key": "2", "value": "工程预付款"}, {"key": "3", "value": "主材预付款"}, {"key": "4", "value": "正林预付款"}], 'key', 'value');

    //现金 转账 刷卡
    com.selectTypeahead("salesCheckcashInfo", salesPaymentForStatus.cashUtil, "key", "value", null);

    com.focusPage("#salesCheckcheckvAdd").on('click',function(){
        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;
        $(this).attr("num", nextNum);

        var maxNum = $(this).attr("maxnum");
        maxNum = parseInt(maxNum)+1;
        $(this).attr("maxnum", maxNum);
        paymentUtils_pos.addBankUtil(maxNum, "checkvDiv", "#salesCheckcheckvDivGroup", salesPaymentForStatus.checkvNums, salesPaymentForStatus.checkBankUtilForGrade, salesPaymentForStatus);

        return false;
    });

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
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["楼盘地址:",  v.sales.house.village.cityProper.city.name + ' ' + v.sales.house.village.cityProper.name + ' ' + v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
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
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", paymentUtils_pos.splitBankInfo(v.salesReceipt.bank, v.salesReceipt.bankInfo, salesPaymentForStatus.bankInfo), "blue"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["转账:", paymentUtils_pos.splitBankInfo(v.salesReceipt.checkv, v.salesReceipt.checkvBank, salesPaymentForStatus.checkBankInfo), "blue"]) : true;
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

            $divBtnWrap.append($btnPrint).append($btnUpdate).appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            $btnPrint.click(function () {
                printPayment(v.sales.orderId, v.salesReceipt.srId,v);
            });

            //更新
            $btnUpdate.click(function () {
                paymentUtils_pos.salesPaymentUpdate(v, salesPaymentForStatus);
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
            batchConfirm(salesPaymentSearcher, hsearcher);
        });

        $impa.click(function () {
            salesPaymentForCollentImport("pagenation");
        });

        return [$adda, $impa]
    }, 'resultList');

    salesPaymentForStatus.salesPaymentSearcher = salesPaymentSearcher;

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
                ["楼盘地址:",  v.sales.house.village.cityProper.city.name + ' ' + v.sales.house.village.cityProper.name + ' ' + v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
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
            v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? styleArr.push(["银行:", paymentUtils_pos.splitBankInfo(v.salesReceipt.bank, v.salesReceipt.bankInfo, salesPaymentForStatus.bankInfo), "blue"]) : true;
            v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? styleArr.push(["转账:", paymentUtils_pos.splitBankInfo(v.salesReceipt.checkv, v.salesReceipt.checkvBank, salesPaymentForStatus.checkBankInfo), "blue"]) : true;
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

    salesPaymentForStatus.hsearcher = hsearcher;

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
                    ['楼盘地址', ['sales.house.village.cityProper.city.name', 'sales.house.village.cityProper.name', 'sales.house.village.name','sales.house.houseNumber']],
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
                    ['楼盘地址', ['sales.house.village.cityProper.city.name', 'sales.house.village.cityProper.name', 'sales.house.village.name','sales.house.houseNumber']],
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

        com.showConfirm('确定要将符合条件的所有收款项目,置为已确认状态吗?', function (index, layero) {
            com.post(api.payment.confirmSalesPayment, option, function (res) {
                salesPaymentSearcher.doSearch();
                hsearcher.doSearch();
                com.showAlert(com.info, '确认成功');
            })
        }, null);
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

    com.focusPage("#collectOrRefundBtn").click(function(){
        //更新收款
        var spid = salesPaymentForStatus.modals.layerAdd.attr('spid');
        var referMoney = com.focusPage('#referMoney').val();

        paymentUtils_pos.aboutcollectAndRefundMoney(null, spid, null, referMoney, salesPaymentForStatus.coupon, salesPaymentForStatus.couponInfo, "single", api.payment.updateSalesPayment, "update", salesPaymentForStatus);
    });
});
