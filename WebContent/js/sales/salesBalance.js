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
                    var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-purple').html('反结算');

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
                        
                        if (v.status != 0) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return false;
                        }

                        salesBalance.items.vbalanceValue.find('input[name="total"]').val(v.total);

                        com.popup4model("#vbalanceValue", "厂商结算值", function () {
                            salesBalance.salesBalance_Manufacturer_Data = v;
                        }, function () {
                            com.clearValidator();
                            com.cleanItems(salesBalance.items);
                        });
                    });

                    $btnVbalance.click(function (e) {

                        if (v.status != 0) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return false;
                        }

                        if(v.vbalance == 0){
                            com.showAlert(com.warning,"厂商结算值未填写 , 请检查");
                            return false;
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

                        if (v.status != 1) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return false;
                        }

                        salesBalance.items.pbalanceValue.find('input[name="balanceValue"]').val(v.balance);
                        salesBalance.items.pbalanceValue.find('input[name="vbalanceValue"]').val(v.vbalance);

                        com.popup4model("#pbalanceValue", "结算值", function () {
                            salesBalance.salesBalance_Settlement_Data = v;
                        }, function () {
                            com.clearValidator();
                            com.cleanItems(salesBalance.items);
                        });
                    });

                    $btnBalance.click(function (e) {

                        if (v.status != 1) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return false;
                        }

                        if(v.pbalance == 0){
                            com.showAlert(com.warning,"结算值未填写 , 请检查");
                            return false;
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
                        params["sid"] = v.sales.sid;
                        params["type"] = "balance";
                        com.popup4page("#viewPopUp", "views/sales/sales4payment.html?type=balance", "收款");
                    });

                    $btnBalanceItem.click(function (e) {
                        params["sbid"] = v.sbid;
                        com.popup4page("#viewPopUp", "views/sales/salesItem4balance.html", "子项");
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
    var _condArr = ['sales-balance-orderId', 'sales-balance-no', 'sales-village', 'sales-balance-brand', 'sales-region-name', 'sales-dept-name', 'sales-balance-status', 'sales-balance-type', 'sales-balance-fullpayTime', 'sales-balance-createTime', 'sales-balance-venderTime', 'sales-balance-postTime'];

    if(salesBalance.pageType == "pompany") _condArr.push('sales-dompany');

    var salesBalanceSearcher = new Searcher();

    salesBalanceSearcher.init(_condArr, 'condList', salesBalance.url, function (data) {

        displayFunc.init('resultList', data);

    }, 'pagenation', salesBalance.postData , null, false, null, function () {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

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

        $checka.click(function(){
           checkAll();
        });

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
            return [$checka, $addaExportSales, $adda, $balanceEnd];
        }else {
            return [$checka, $addaExportSales, $adda, $addaEnd, $balanceEnd];
        }

    }, 'resultList');

    salesBalance.btns.supplierSaveBtn.on('click', function () {
        
        var _vBalance = salesBalance.items.vbalanceValue.find('input[name="vbalanceValue"]').val();

        if (com.validate('vbalanceValue','right')==false) {

            com.post(api.sales.updateSalesBalanceForVBalance, {
                "salesBalance.sbid": salesBalance.salesBalance_Manufacturer_Data.sbid,
                "salesBalance.vbalance": _vBalance
            }, function (res) {

                com.showAlert(com.info, "更新成功");
                
                com.closePopup();
                com.cleanItems(salesBalance.items);
                
                salesBalanceSearcher.doSearch();
            });
        }
    });

    salesBalance.btns.balanceSaveBtn.on('click', function () {
        
        if (com.validate('pbalanceValue', 'right')) return false;
        
        var _pBalance = salesBalance.items.pbalanceValue.find('input[name="pbalanceValue"]').val();
        
        var options = {
            "salesBalance.sbid": salesBalance.salesBalance_Settlement_Data.sbid,
            "salesBalance.pbalance": _pBalance
        }

        com.post(api.sales.updateSalesBalanceForPBalance, options, function (res) {
            
            com.showAlert(com.info, "更新成功");

            com.closePopup();
            com.cleanItems(salesBalance.items);
            
            salesBalanceSearcher.doSearch();
        });
    });

    function checkAll (){
        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    }

    function pageSalesBalanceExport(){

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
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

        var options = checkedInput(true);
        
        if(!options) return false;

        com.post(api.sales.vpostSalesBalance, options, function (res) {
            com.showAlert(com.info, "厂商结算成功");
            salesBalanceSearcher.doSearch();
        });
    }

    //批量结算
    function postBalance() {

        var options = checkedInput(false);
        
        if(!options) return false;

        com.post(api.sales.postSalesBalance, options, function (res) {
            com.showAlert(com.info, "结算成功");
            salesBalanceSearcher.doSearch();
        });
    }

    function checkedInput(flag) {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        var inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');
        
        if(!inputs.length) {
            com.showAlert(com.warning, "请选择需要进行结算的销售单");
            return false;
        }

        var options = {};
        
        for(var i=0;i<inputs.length;i++){
            
            var input = $(inputs[i]);
            
            var status = input.attr("data-status");
            var vbalance = input.attr("data-vbalance");
            var pbalance = input.attr("data-pbalance");
            var sbid = input.attr("data-sbid");
            
            if(flag && status != 0){
                com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                return false;
            }else if(flag && vbalance == 0){
                com.showAlert(com.warning,"厂商结算值未填写 , 请检查");
                return false;
            }else if(!flag && status != 1){
                com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                return false;
            }else if(!flag && pbalance == 0){
                com.showAlert(com.warning,"结算值未填写 , 请检查");
                return false;
            }
            
            options["salesBalances[" + i + "].sbid"] = sbid;
        }
        
        return options;
    }

    //结算单
    function crebalance() {

        var options = {};
        var index = 0;

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        var inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');

        if(!inputs.length) {
            com.showAlert(com.warning, "请选择结算单");
            return false;
        }
        
        var belonger = null;
        
        for(var i=0;i<inputs.length;i++){
            
            var input = $(inputs[i]);
            
            var status = input.attr("data-status");
            var supplier = input.attr('data-supplier');
            var sbid = input.attr('data-sbid');
            
            if(status != 2){
                com.showAlert(com.warning, "请选择结算状态的结算单");
                return false;
            }
            
            if(belonger != null && supplier && supplier != belonger){
                com.showAlert(com.warning, "厂商不一致");
                return false
            }
            
            belonger = supplier;
            
            options["balanceSaless[" + index + "].salesBalance.sbid"] = sbid;
            index += 1;
        }
        
        options["balance.belonger.uid"] = belonger;
        
        com.post(api.balance.submitBalanceSales, options, function (res) {
            com.showAlert(com.info, "创建结算单成功");
            salesBalanceSearcher.doSearch();
        });
    }
    
});
