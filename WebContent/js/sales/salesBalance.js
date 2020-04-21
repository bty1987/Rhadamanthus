$(function () {
    
    var salesBalance = {
        salesBalance_Manufacturer_Data : {},
        salesBalance_Settlement_Data :{},
        balanceType:{},
        status:{},
        salesPaymentForStatus:{},
        salesPaymentType : {},
        oneType:{},
        url : api.sales.pageSalesBalance,
        postData : "salesBalancePostData",
        pageType : params['urlLoadParams'].type,
        items: {
            viewPopUp : com.focusPage("#viewPopUp"),
            vbalanceValue : com.focusPage('#vbalanceValue'),
            pbalanceValue : com.focusPage('#pbalanceValue')
        },
        btns : {
            supplierSaveBtn : com.focusPage("#supplierSaveBtn"),
            balanceSaveBtn : com.focusPage("#balanceSaveBtn")
        }

    };

    if(salesBalance.pageType == "dompany"){
        salesBalance.url = api.sales.pageSalesBalanceForDompany;
        salesBalance.postData = "salesBalanceForDompanyPostData";
    }

    if(salesBalance.pageType == "supplier"){
        salesBalance.url = api.sales.pageSalesBalanceForSupplier;
        salesBalance.postData = "salesBalanceForSuppleirPostData";
    }

    if(salesBalance.pageType == "pompany"){
        salesBalance.url = api.sales.pageSalesBalanceForPompany;
        salesBalance.postData = "salesBalanceForPompanyPostData";
    }

    com.post(api.ds.payment, {}, function(res){
        salesBalance.balanceType = res.balanceType.split("key", "value");
        salesBalance.status = res.balanceStatus.split("key", "value");
        salesBalance.salesPaymentType = res.materialPaymentType.split("key", "value");
    }, null, false);

    com.post(api.ds.sales, {}, function(res){
        salesBalance.oneType = res.oneType.split("key", "value");
    }, null, false);

    com.post(api.common.queryReceiptType, {}, function (res) {
        salesBalance.salesPaymentForStatus.cash = [];
        salesBalance.salesPaymentForStatus.bank = [];
        salesBalance.salesPaymentForStatus.checkBank = [];
        salesBalance.salesPaymentForStatus.accounts = [];
        salesBalance.salesPaymentForStatus.couponType = [];

        salesBalance.salesPaymentForStatus.cashInfo = {};
        salesBalance.salesPaymentForStatus.bankInfo = {};
        salesBalance.salesPaymentForStatus.checkBankInfo = {};
        salesBalance.salesPaymentForStatus.accountsInfo = {};
        salesBalance.salesPaymentForStatus.couponTypeData = {};

        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 1) {
                salesBalance.salesPaymentForStatus.cash.push(v);
                salesBalance.salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesBalance.salesPaymentForStatus.bank.push(v);
                salesBalance.salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesBalance.salesPaymentForStatus.checkBank.push(v);
                salesBalance.salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesBalance.salesPaymentForStatus.accounts.push(v);
                salesBalance.salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesBalance.salesPaymentForStatus.couponType.push(v);
                salesBalance.salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });

    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnVbalanceValue = $('<a></a>').addClass('btn btn-minier btn-yellow').html('厂商结算值');
                    var $btnVbalance = $('<a></a>').addClass('btn btn-minier btn-success').html('厂商结算');
                    var $btnBalanceValue = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算值');
                    var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-inverse').html('结算');
                    var $btnPayment = $('<a></a>').addClass('btn btn-minier btn-danger').html('款项');
                    var $btnBalanceItem = $('<a></a>').addClass('btn btn-minier btn-pink').html('子项');
                    var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-purple').html('预结算状态');

                    var coupon =  v.onetype == 1 ? 0 : v.sales.coupon;
                    var maling =  v.onetype == 1 ? 0 : v.sales.maling;
                    var venderMaling =  v.onetype == 1 ? 0 : v.sales.venderMaling;

                    var propertyArr = [
                        ["装修单号:", v.sales.orderId, "blue"],
                        ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                        ["品牌:", v.sales.brand, "grey"],
                        ["渠道:", v.salesman.currentName, "grey"],
                        ["归属大区:", v.region.name, "grey"],
                        ["归属部门:", v.dept.name, "grey"],
                        ["定金:", v.sales.depositpay, "blue"],
                        ["补款:", v.sales.fullpay, "blue"],
                        ["等级:", v.sales.grade, "red"],
                        ["券值:", coupon, "blue"],
                        ["券信息:", v.sales.couponInfo, "grey"],
                        ["驻店:", v.sales.instorer.currentName, "grey"],
                        ["预结算值:", v.balance, "blue"],
                        ["预结算人:", v.creater.currentName, "grey"],
                        ["厂商结算:", v.vbalance, "blue"],
                        ["结算值:", v.pbalance, "blue"],
                        ["结算时间:", v.postTime, "green"],
                        ["结算人:", v.poster.currentName, "grey"],
                        ["抹零:", maling, "blue"],
                        ["厂商抹零:", venderMaling, "blue"],
                        ["类型:", salesBalance.balanceType[v.type], "red"]
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({'color': 'grey', 'font-size': '20px', "font-weight": "bold"});
                    var _label = $('<label></label>');
                    var $input = $('<input>').attr({"type": "checkbox", "name": "sbids", "class": "", "data-sbid": v.sbid, "data-status":v.status, "data-vbalance":v.vbalance, "data-pbalance":v.pbalance, "data-supplier":v.sales.supplier.uid}).addClass('ace ace-checkbox-2');
                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.sales.no);
                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    var styleArr = [
                        ["补贴:", v.allowance, "blue"],
                        ["总价:", v.total, "blue"],
                        ["预结算时间:", v.createTime, "green"],
                        ["厂商结算时间:", v.venderTime, "green"],
                        ["一类:", salesBalance.oneType[v.onetype] , "red"],
                        ["状态:", salesBalance.status[v.status], "red"]
                    ];

                    $.each(styleArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulStyle);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty).append($ulStyle);
                    $btnDiv.append($btnVbalanceValue).append($btnVbalance);

                    if(salesBalance.pageType == "dompany") {
                        $btnDiv.append($btnPayment).append($btnBalanceItem);
                    }else if(salesBalance.pageType == "supplier"){
                        $btnDiv.append($btnPayment).append($btnBalanceItem);
                    }else if(salesBalance.pageType == "pompany"){
                        $btnDiv.append($btnBalanceValue).append($btnBalance).append($btnPayment).append($btnBalanceItem);
                    }else {
                        $btnDiv.append($btnBalanceValue).append($btnBalance).append($btnPayment).append($btnBalanceItem);
                    }

                    $btnDiv.append($btnStatus);
                    $label.appendTo($h3);
                    $btnDiv.appendTo($h3);

                    $btnVbalanceValue.click(function (e) {
                        e.stopPropagation();

                        if (v.status != 0) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return
                        }

                        salesBalance.items.vbalanceValue.find('input[name="total"]').val(v.total);

                        com.popup4model("#vbalanceValue", "厂商结算值", function () {
                            salesBalance.salesBalance_Manufacturer_Data = v;
                        }, function () {
                            com.clearValidator();
                            clearinput(salesBalance.items.vbalanceValue);
                        });
                    });

                    $btnVbalance.click(function (e) {
                        e.stopPropagation();
                        
                        if (v.status != 0) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return;
                        }

                        if(v.vbalance == 0){
                            com.showAlert(com.warning,"厂商结算值未填写，请检查");
                            return;
                        }

                        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行厂商结算吗?', function (index, layero) {

                            com.post(api.sales.vpostSalesBalance, {
                                "salesBalances[0].sbid": v.sbid
                            }, function (res) {
                                com.showAlert(com.info, "厂商结算成功");
                                salesBalanceSearcher.doSearch();
                            });

                        }, function () {
                            salesBalanceSearcher.doSearch();
                        });
                    });

                    $btnBalanceValue.click(function (e) {
                        e.stopPropagation();

                        if (v.status != 1) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return
                        }

                        salesBalance.items.pbalanceValue.find('input[name="balanceValue"]').val(v.balance);
                        salesBalance.items.pbalanceValue.find('input[name="vbalanceValue"]').val(v.vbalance);

                        com.popup4model("#pbalanceValue", "结算值", function () {
                            salesBalance.salesBalance_Settlement_Data = v;
                        }, function () {
                            com.clearValidator();
                            clearinput(salesBalance.items.pbalanceValue);
                        });
                    });

                    $btnBalance.click(function (e) {
                        
                        e.stopPropagation();

                        if (v.status != 1) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return;
                        }

                        if(v.pbalance == 0){
                            com.showAlert(com.warning,"结算值未填写，请检查");
                            return;
                        }

                        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行结算吗?', function (index, layero) {

                            com.post(api.sales.postSalesBalance, {
                                "salesBalances[0].sbid": v.sbid
                            }, function (res) {

                                com.showAlert(com.info, "结算成功");
                                salesBalanceSearcher.doSearch();
                            });

                        }, function () {

                            salesBalanceSearcher.doSearch();
                        });

                    });

                    $btnPayment.click(function (e) {

                        e.stopPropagation();

                        com.popup4model("#viewPopUp", "收款", "", function () {
                            salesBalance.items.viewPopUp.find('#resultListItem').empty();
                            salesBalanceSearcher.doSearch();
                        }, function () {
                            com.post(api.payment.querySalesPaymentBySid, {
                                "salesPayment.sales.sid": v.sales.sid
                            }, function (res) {
                                viewSalesPaymentLine('resultListItem', res);
                            }, null, false);
                        });
                    });

                    $btnBalanceItem.click(function (e) {

                        e.stopPropagation();

                        com.popup4model("#viewPopUp", "子项", "", function () {
                            salesBalance.items.viewPopUp.find('#resultListItem').empty();
                            salesBalanceSearcher.doSearch();
                        },function () {
                            com.post(api.sales.querySalesBalanceItemBySbid,{
                                "salesBalance.sbid":v.sbid
                            },function(res){
                                salesBalanceItemList.init('resultListItem', res.salesBalanceItems);
                            }, null, false);
                        });
                    });


                    $btnStatus.click(function (e) {
                        com.post(api.sales.rpreSalesBalance,{"salesBalance.sbid":v.sbid},function(res){
                            com.showAlert(com.info, "更新为预结算成功");
                            salesBalanceSearcher.doSearch();
                        });
                    });


                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();

    /*分页*/
    var _condArr = ['sales_balanceOrderId', 'sales_balanceNo', 'sales_balanceBrand', 'sales_balanceVillage', 'sales_balanceRegion', 'sales_balanceDept', 'sales_balanceStatus', 'sales_balanceType', 'sales_balanceFullpayTime', 'sales_balanceCreateTime', 'sales_balanceVenderTime', 'sales_balancePostTiem'];

    if(salesBalance.pageType == "pompany") _condArr.push('salesDompany');

    var salesBalanceSearcher = new Searcher();

    salesBalanceSearcher.init(_condArr, 'condList', salesBalance.url, function (data) {

        displayFunc.init('resultList', data);

    }, 'pagenation', salesBalance.postData , null, false, null, function () {

        var $addaExportSales = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importSalesBalance').css('margin-top','-2px');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportSales);
        var $addaExportspan = $('<span></span>').text('导出').appendTo($addaExportSales);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'batchVendor').css("margin", "-2px 3px");
        var $addi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量厂商结算').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'batchSettlement').css("margin", "-2px 3px");
        var $addiEnd = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaEnd);
        var $addspanEnd = $('<span></span>').text('批量结算').appendTo($addaEnd);

        var $balanceEnd = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'balanceEnd').css("margin", "-2px 3px");
        var $balanceiEnd = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($balanceEnd);
        var $balancespanEnd = $('<span></span>').text('结算单').appendTo($balanceEnd);

        $addaExportSales.click(function(){
            pageSalesBalanceExport();
        });

        $adda.click(function(){
            vpostBalance();
        });

        $addaEnd.click(function(){
            postBalance();
        });

        $balanceEnd.click(function(){
            crebalance();
        });

        if(salesBalance.pageType == "dompany" || salesBalance.pageType == "supplier"){
            return [$addaExportSales, $adda, $balanceEnd];
        }else {
            return [$addaExportSales, $adda, $addaEnd, $balanceEnd];
        }

    }, 'resultList');

    salesBalance.btns.supplierSaveBtn.on('click', function () {
        var _vBalance = salesBalance.items.vbalanceValue.find('input[name="vbalanceValue"]').val();
    
        if (com.validate('vbalanceValue','right')==false) {
    
            com.post(api.sales.updateSalesBalanceForVBalance, {
                "salesBalance.sbid": salesBalance.salesBalance_Manufacturer_Data.sbid,
                "salesBalance.vbalance": _vBalance
            }, function (res) {
    
                com.closePopup();
                com.showAlert(com.info, "更新成功");
                clearinput(salesBalance.items.vbalanceValue);
                salesBalanceSearcher.doSearch();
    
            });
    
        }
    });

    salesBalance.btns.balanceSaveBtn.on('click', function () {
        var _pBalance = salesBalance.items.pbalanceValue.find('input[name="pbalanceValue"]').val();

        if (com.validate('pbalanceValue','right')==false) {

            com.post(api.sales.updateSalesBalanceForPBalance, {
                "salesBalance.sbid": salesBalance.salesBalance_Settlement_Data.sbid,
                "salesBalance.pbalance": _pBalance
            }, function (res) {

                com.closePopup();
                com.showAlert(com.info, "更新成功");
                clearinput(salesBalance.items.pbalanceValue);
                salesBalanceSearcher.doSearch();

            });

        }
    });
    
    //清空弹窗输入框的值
    function clearinput($line) {
        $line.find('input').val('');
    }

    //收款显示
    function viewSalesPaymentLine(tableId, listData) {
        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(salesBalance.salesPaymentType[v.type]);

                var propertyArr = [
                    ["销售单号:", v.sales.no, "blue"],
                    ["品类：", v.sales.category, "grey"],
                    ["品牌：", v.sales.brand, "grey"],
                    ["应收额：", v.referMoney, "blue"],
                    ["收款时间：", v.salesReceipt.collectTime, "green"],
                    ["确认时间：", v.salesReceipt.confirmTime, "green"],
                    ["状态：", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];
                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息：", (function (bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += salesBalance.salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info;
                })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "blue"]) : true;
                v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? addPropertyArr.push(["转账:", v.salesReceipt.checkv, "blue"]) : true;
                v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? addPropertyArr.push(["分期:", v.salesReceipt.installment, "blue"]) : true;
                v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? addPropertyArr.push(["对公帐户:", v.salesReceipt.accounts, "blue"]) : true;
                v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? addPropertyArr.push(["预付款:", v.salesReceipt.advance, "blue"]) : true;
                v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? addPropertyArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "blue"]) : true;

                $.each(addPropertyArr, function (index, value) {
                    var $liPropertys = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liPropertys);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertys);
                    $liPropertys.appendTo($ulProperty);
                });
                $small.appendTo($h3);
                $liLine.append($h3).append($ulProperty).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        }

    }

    //子项显示
    var salesBalanceItemList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');//.addClass('siid')
                    var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                    
                    var propertyArr = [
                        ["商品品类:", v.salesItem.goods.category, "grey", "category"],
                        ["商品颜色:", v.salesItem.color.name, "grey", "color"],
                        ["商品规格:", v.salesItem.format.info, "grey", "format"],
                        ["售价:", v.salesItem.selling, "blue", "selling"],
                        ["折扣价:", v.salesItem.disPrice, "blue", "disPrice"],
                        ["折让价:", v.salesItem.price, "blue", "price"],
                        ["数量:", v.num, "blue", "num"],
                        ["总价:", v.total, "blue", "total"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "red", "ctype"],
                        ["结算值:", v.cvalue, "blue", "cvalue"],
                        ["备注:", v.salesItem.comment, "grey", "comment"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $small.appendTo($h3);
                    $btnDiv.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                });

                $ul.appendTo($tableWrap);
            }
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    function pageSalesBalanceExport(){

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        var historicalRecord = null;
        if(salesBalance.pageType == "dompany"){
            historicalRecord = params.salesBalanceForDompanyPostData
        }else if(salesBalance.pageType == "pompany"){
            historicalRecord = params.salesBalanceForPompanyPostData
        }else if(salesBalance.pageType == "supplier"){
            historicalRecord = params.salesBalanceForSuppleirPostData
        }else{
            historicalRecord = params.salesBalancePostData;
        }

        com.post(salesBalance.url, $.extend({}, historicalRecord, {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ['装修单号', 'sales.orderId'],
                    ['销售单号', 'sales.no'],
                    ['楼盘地址',['sales.house.village.name','sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['渠道', 'salesman.currentName'],
                    ['渠道ID', 'salesman.userId'],
                    ['归属大区', 'region.name'],
                    ['归属部门', 'dept.name'],
                    ['总价', 'total'],
                    ["券值:", 'sales.coupon'],
                    ["券信息:", 'sales.couponInfo'],
                    ["驻店:", 'sales.instorer.currentName'],
                    ["预结算值:", 'balance'],
                    ["预结算时间:", 'createTime'],
                    ["预结算人:", 'creater.currentName'],
                    ["厂商结算:", 'vbalance'],
                    ["厂商结算时间:", 'venderTime'],
                    ["结算值:", 'pbalance'],
                    ["结算时间:", 'postTime'],
                    ["结算人:", 'poster.currentName'],
                    ["抹零:", 'sales.maling'],
                    ["厂商抹零:", 'sales.venderMaling'],
                    ["状态:", 'status'],
                    ["类型:", 'type']
                ],
                list: res.paging.data

            },function(v){
                v.venderTime = v.venderTime == null? '':v.venderTime;
                v.postTime = v.postTime == null? '':v.postTime;
                v.poster.currentName = v.poster.currentName==null? '':v.poster.currentName;
                v.status = v.status == 0 ? '预结算' : v.status == 1 ? "厂商结算" : "结算" ;
                v.type = v.type == 0 ? "购货" : v.type == 1 ? "预结算退货" : "结算退货";
            });

        });
    }


    //批量厂商结算
    function vpostBalance() {

        var ops = checkedInput(true);
        
        if(ops){
            
            com.post(api.sales.vpostSalesBalance, ops, function (res) {
                com.showAlert(com.info, "厂商结算成功");
                salesBalanceSearcher.doSearch();
            });
        }
    }
    
    //批量结算
    function postBalance() {

        var ops = checkedInput(false);

        if(ops){
            com.post(api.sales.postSalesBalance, ops, function (res) {
                com.showAlert(com.info, "结算成功");
                salesBalanceSearcher.doSearch();
            });
        }

    }

    function checkedInput(flag) {

        var Identification = true;

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            Identification = false;
            return false;
        }

        var $inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');
        if(!$inputs.length) {
            com.showAlert(com.warning, "请选择需要进行结算的销售单");
            Identification = false;
            return false;
        }

        if(Identification){

            var _option = {};
            var statusFalg = true;

            $.each($inputs, function (i, v) {

                var $this = $(v);

                if(flag){
                    if ($this.attr('data-status') != 0) {
                        com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                        statusFalg = false;
                        return;
                    }

                    if($this.attr('data-vbalance') == 0){
                        com.showAlert(com.warning,"厂商结算值未填写，请检查");
                        statusFalg = false;
                        return;
                    }
                }
                if(!flag){
                    if ($this.attr('data-status') != 1) {
                        com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                        statusFalg = false;
                        return;
                    }

                    if($this.attr('data-pbalance') == 0){
                        com.showAlert(com.warning,"结算值未填写，请检查");
                        statusFalg = false;
                        return;
                    }
                }

                if(statusFalg) _option["salesBalances[" + i + "].sbid"] = $this.attr('data-sbid');

            });

            if(statusFalg) return _option;
            if(!statusFalg) return null;
        }

    }

    //结算单
    function crebalance() {

        var opt = {};
        var falg = true;
        var supplierFalg = true;
        var index = 0;
        var list = [];

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            falg = false;
            return false;
        }

        var $inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');

        if(!$inputs.length) {
            com.showAlert(com.warning, "请选择结算单");
            falg = false;
            return false;
        }

        if(falg){

            $.each($inputs, function (i, v) {

                var $this = $(v);
                var status = $this.attr("data-status");
                if(status != 2){
                    com.showAlert(com.warning, "请选择结算状态的结算单");
                    supplierFalg = false;
                    return false;
                }
                list.push($this.attr('data-supplier'));

                if($this.attr('data-supplier')){
                    opt["balanceSaless[" + index + "].salesBalance.sbid"] = $this.attr('data-sbid');
                    index += 1;
                }else {
                    com.showAlert(com.warning, "厂商不一致");
                    supplierFalg = false;
                    return false;
                }

            });

            var isAllFalg = isAllEqual(list);

            if(supplierFalg && isAllFalg){
                com.post(api.balance.submitBalanceSales, opt, function (res) {
                    com.showAlert(com.info, "创建结算单成功");
                    salesBalanceSearcher.doSearch();
                });
            }

        }

    }

    function isAllEqual(array){
        if(array.length>0){
            return !array.some(function(value,index){
                return value != array[0];
            });
        }
    }

    com.focusPage('#resultListItem').css({'width': '96%', 'margin': '0 auto'});

});
