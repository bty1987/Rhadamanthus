$(function() {

    var salesBalance = {

        sales: null,

        postData: "salesBalancePostData",
        pageType: params['urlLoadParams'].type,

        items: {
            viewPopUp: com.focusPage("#viewPopUp"),
            vbalanceValue: com.focusPage('#vbalanceValue'),
            pbalanceValue: com.focusPage('#pbalanceValue')
        },
        btns: {
            supplierSaveBtn: com.focusPage("#supplierSaveBtn"),
            balanceSaveBtn: com.focusPage("#balanceSaveBtn")
        },

        modals: {
            decorationInfo: com.focusPage("#decorationInfo"),
        },

        typeness: {},
        projectStatus: {},
        balanceType: {},
        status: {},
        paymentStatus: {},
        paymentType: {},
        oneType: {},

    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    if (salesBalance.pageType == "bdompany") {
        salesBalance.postData = "salesBalanceForDompanyPostData";
    }

    if (salesBalance.pageType == "bsupplier") {
        salesBalance.postData = "salesBalanceForSuppleirPostData";
    }

    if (salesBalance.pageType == "bpompany") {
        salesBalance.postData = "salesBalanceForPompanyPostData";
    }

    com.post(api.data.queryReceiptType, {}, function(res) {

        salesBalance.paymentStatus.cash = [];
        salesBalance.paymentStatus.bank = [];
        salesBalance.paymentStatus.checkBank = [];
        salesBalance.paymentStatus.accounts = [];
        salesBalance.paymentStatus.couponType = [];

        salesBalance.paymentStatus.cashInfo = {};
        salesBalance.paymentStatus.bankInfo = {};
        salesBalance.paymentStatus.checkBankInfo = {};
        salesBalance.paymentStatus.accountsInfo = {};
        salesBalance.paymentStatus.couponTypeData = {};

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == 1) {
                salesBalance.paymentStatus.cash.push(v);
                salesBalance.paymentStatus.cashInfo[v.no] = v.name;
            } else if (v.type == 2) {
                salesBalance.paymentStatus.bank.push(v);
                salesBalance.paymentStatus.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                salesBalance.paymentStatus.checkBank.push(v);
                salesBalance.paymentStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == 4) {
                salesBalance.paymentStatus.accounts.push(v);
                salesBalance.paymentStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == 5) {
                salesBalance.paymentStatus.couponType.push(v);
                salesBalance.paymentStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });

    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-purple').html('装修单');
                    var $btnVbalanceValue = $('<a></a>').addClass('btn btn-minier btn-yellow').html('厂结值');
                    var $btnVbalance = $('<a></a>').addClass('btn btn-minier btn-success').html('厂结');
                    var $btnBalanceValue = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算值');
                    var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-inverse').html('结算');
                    var $btnPayment = $('<a></a>').addClass('btn btn-minier btn-danger').html('款项');
                    var $btnBalanceItem = $('<a></a>').addClass('btn btn-minier btn-pink').html('子项');
                    var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-purple').html('反结');

                    var coupon = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.coupon;
                    var maling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.maling;
                    var venderMaling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.venderMaling;
                    var propertyArr = [];
                    var styleArr = [];
                    $.each(pageConfig.propertyArr, function(pi, pv) {

                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.sales.orderId, "blue"]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey"]);
                                break;
                            case "dept":
                                propertyArr.push(["归属部门:", v.dept.name, "grey"]);
                                break;
                            case "region":
                                propertyArr.push(["归属大区:", v.region.name, "grey"]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.sales.instorer.currentName, "grey"]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.sales.brand, "grey"]);
                                break;
                            case "depositpay":
                                propertyArr.push(["定金:", v.sales.depositpay, "blue"]);
                                break;
                            case "fullpay":
                                propertyArr.push(["补款:", v.sales.fullpay, "blue"]);
                                break;
                            case "prevalue":
                                propertyArr.push(["预结值:", v.balance, "blue"]);
                                break;
                            case "preCreateTime":
                                propertyArr.push(["预结时间:", v.createTime, "green"]);
                                break;
                            case "precreater":
                                propertyArr.push(["预结人:", v.creater.currentName, "grey"]);
                                break;
                            case "vbalance":
                                propertyArr.push(["厂结值:", v.vbalance, "blue"]);
                                break;
                            case "venderTime":
                                propertyArr.push(["厂结时间:", v.venderTime, "green"]);
                                break;
                            case "pbalance":
                                propertyArr.push(["结算值:", v.pbalance, "blue"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["结算时间:", v.postTime, "green"]);
                                break;
                            case "poster":
                                propertyArr.push(["结算人:", v.poster.currentName, "grey"]);
                                break;
                            case "grade":
                                propertyArr.push(["等级:", v.sales.grade, "red"]);
                                break;
                            case "maling":
                                propertyArr.push(["抹零:", maling, "blue"]);
                                break;
                            case "venderMaling":
                                propertyArr.push(["厂商抹零:", venderMaling, "blue"]);
                                break;
                            case "coupon":
                                propertyArr.push(["券值:", coupon, "blue"]);
                                break;
                            case "couponInfo":
                                propertyArr.push(["券信息:", v.sales.couponInfo, "grey"]);
                                break;
                            case "type":
                                propertyArr.push(["类型:", constant.sales().salesBalance.type.keys[v.type], "red"]);
                                break;
                            case "voster":
                                propertyArr.push(["厂结人:", v.voster.currentName, "red"]);
                                break;
                            case "allowance":
                                styleArr.push(["补贴:", v.allowance, "blue"]);
                                break;
                            case "total":
                                styleArr.push(["总价:", v.total, "blue"]);
                                break;
                            case "oneType":
                                styleArr.push(["一类:", constant.sales().salesBalance.onetype.keys[v.onetype], "red"]);
                                break;
                            case "status":
                                styleArr.push(["状态:", constant.sales().salesBalance.status.keys[v.status], "red"]);

                                break;
                        }
                    });

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });
                    var _label = $('<label></label>');
                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "sbids",
                        "class": "",
                        "data-sbid": v.sbid,
                        "data-status": v.status,
                        "data-vbalance": v.vbalance,
                        "data-pbalance": v.pbalance,
                        "data-supplier": v.sales.supplier.uid
                    }).addClass('ace ace-checkbox-2');
                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.sales.no);
                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $.each(styleArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulStyle);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty).append($ulStyle);

                    $.each(pageConfig.pageBtn, function(k, b) {

                        switch (b) {

                            case "decoration":
                                $btnDiv.append($btnDecoration);
                                break;
                            case "sub":
                                $btnDiv.append($btnBalanceItem);
                                break;
                            case "payment":
                                $btnDiv.append($btnPayment);
                                break;
                            case "vbalancevalue":
                                $btnDiv.append($btnVbalanceValue);
                                break;
                            case "status":
                                $btnDiv.append($btnStatus);
                                break;
                            case "vbalance":
                                $btnDiv.append($btnVbalance);
                                break;
                            case "balancevalue":
                                $btnDiv.append($btnBalanceValue);
                                break;
                            case "balance":
                                $btnDiv.append($btnBalance);
                                break;
                        }
                    });
                    $label.appendTo($h3);
                    $btnDiv.appendTo($h3);

                    // 装修单显示详情
                    $btnDecoration.click(function() {
                        console.log(v.sales.orderId);
                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.decoration.queryDecorationByOrderId, {
                            "decorationOrderId": v.sales.orderId
                        }, function(res) {

                            var decorationInfo = res.decoration;

                            com.focusPage("#orderId").html(decorationInfo.orderId); // 装修单号
                            com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);// 装修楼盘地址
                            com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);// 装修设计师
                            com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);// 装修跟单员
                            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);// 装修监理
                            com.focusPage("#typeness").html(constant.decoration().decoration.typeness.keys[decorationInfo.typeness]);
                            com.focusPage("#projectStatus").html(constant.construction().constructionSchedule.status.keys[decorationInfo.projectStatus]);

                            salesBalance.modals.decorationInfo.modal("show");
                        });

                    });

                    $btnVbalanceValue.click(function(e) {

                        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return false;
                        }

                        salesBalance.items.vbalanceValue.find('input[name="total"]').val(v.total);

                        com.popup4model("#vbalanceValue", "厂商结算值", function() {

                            salesBalance.sales = v;
                        }, function() {

                            com.clearValidator();
                            com.cleanItems(salesBalance.items);
                        });
                    });

                    $btnVbalance.click(function(e) {

                        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
                            com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                            return false;
                        }

                        if (v.vbalance == 0) {
                            com.showAlert(com.warning, "厂商结算值未填写 , 请检查");
                            return false;
                        }

                        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行厂商结算吗?', function(index, layero) {

                            com.post(api.sales.vpostSalesBalance, {
                                "salesBalances[0].sbid": v.sbid
                            }, function(res) {

                                com.showAlert(com.info, "厂商结算成功");
                                salesBalanceSearcher.doSearch();
                            });

                        }, function() {

                            salesBalanceSearcher.doSearch();
                        });
                    });

                    $btnBalanceValue.click(function(e) {

                        if (v.status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return false;
                        }

                        salesBalance.items.pbalanceValue.find('input[name="balanceValue"]').val(v.balance);
                        salesBalance.items.pbalanceValue.find('input[name="vbalanceValue"]').val(v.vbalance);

                        com.popup4model("#pbalanceValue", "结算值", function() {

                            salesBalance.sales = v;
                        }, function() {

                            com.clearValidator();
                            com.cleanItems(salesBalance.items);
                        });
                    });

                    $btnBalance.click(function(e) {

                        if (v.status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
                            com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                            return false;
                        }

                        if (v.pbalance == 0) {
                            com.showAlert(com.warning, "结算值未填写 , 请检查");
                            return false;
                        }

                        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行结算吗?', function(index, layero) {

                            com.post(api.sales.postSalesBalance, {
                                "salesBalances[0].sbid": v.sbid
                            }, function(res) {

                                com.showAlert(com.info, "结算成功");
                                salesBalanceSearcher.doSearch();
                            });

                        }, function() {

                            salesBalanceSearcher.doSearch();
                        });

                    });

                    $btnPayment.click(function(e) {

                        params.sales.sales = v.sales;
                        params.sales.type = "balance";

                        com.popup4page("#viewPopUp", "views/sales/sales4payment.html?type=balance", "收款");
                    });

                    $btnBalanceItem.click(function(e) {

                        params.sales.sales = v.sales;
                        params.sales.salesBalance = v;

                        com.popup4page("#viewPopUp", "views/sales/salesItem4balance.html", "子项");
                    });

                    $btnStatus.click(function(e) {

                        com.post(api.sales.rpreSalesBalance, {
                            "salesBalance.sbid": v.sbid
                        }, function(res) {

                            com.showAlert(com.info, "更新为预结算成功");
                            salesBalanceSearcher.doSearch();
                        });
                    });
                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();

    var salesBalanceSearcher = new Searcher();

    salesBalanceSearcher.init(pageConfig.condArr, 'condList', pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);

    }, 'pagenation', salesBalance.postData, null, false, null, function() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $addaExportSales = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importSalesBalance').css('margin-top', '0px 3px');
        var $addaExporti = $('<i></i>').addClass('icon-check bigger-110').appendTo($addaExportSales);
        var $addaExportspan = $('<span></span>').text('导出').appendTo($addaExportSales);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'batchVendor').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-check bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量厂商结算').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'batchSettlement').css("margin", "0px 3px");
        var $addiEnd = $('<i></i>').addClass('icon-check bigger-110').appendTo($addaEnd);
        var $addspanEnd = $('<span></span>').text('批量结算').appendTo($addaEnd);

        var $balanceEnd = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'balanceEnd').css("margin", "0px 3px");
        var $balanceiEnd = $('<i></i>').addClass('icon-check bigger-110').appendTo($balanceEnd);
        var $balancespanEnd = $('<span></span>').text('结算单').appendTo($balanceEnd);

        $checka.click(function() {

            checkAll();
        });

        $addaExportSales.click(function() {

            pageSalesBalanceExport();
        });

        $adda.click(function() {

            vpostBalance();
        });

        $addaEnd.click(function() {

            postBalance();
        });

        $balanceEnd.click(function() {

            crebalance();
        });

        if (salesBalance.pageType == "bdompany" || salesBalance.pageType == "bsupplier") {
            return [$checka, $addaExportSales, $adda, $balanceEnd];
        } else {
            return [$checka, $addaExportSales, $adda, $addaEnd, $balanceEnd];
        }

    }, 'resultList');

    salesBalance.btns.supplierSaveBtn.on('click', function() {

        var _vBalance = salesBalance.items.vbalanceValue.find('input[name="vbalanceValue"]').val();

        if (com.validate('vbalanceValue', 'right') == false) {

            com.post(api.sales.updateSalesBalanceForVBalance, {
                "salesBalance.sbid": salesBalance.sales.sbid,
                "salesBalance.vbalance": _vBalance
            }, function(res) {

                com.showAlert(com.info, "更新成功");

                com.closePopup();
                com.cleanItems(salesBalance.items);

                salesBalanceSearcher.doSearch();
            });
        }
    });

    salesBalance.btns.balanceSaveBtn.on('click', function() {

        if (com.validate('pbalanceValue', 'right'))
            return false;

        var _pBalance = salesBalance.items.pbalanceValue.find('input[name="pbalanceValue"]').val();

        var options = {
            "salesBalance.sbid": salesBalance.sales.sbid,
            "salesBalance.pbalance": _pBalance
        };

        com.post(api.sales.updateSalesBalanceForPBalance, options, function(res) {

            com.showAlert(com.info, "更新成功");

            com.closePopup();
            com.cleanItems(salesBalance.items);

            salesBalanceSearcher.doSearch();
        });
    });

    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    }

    function pageSalesBalanceExport() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        var historicalRecord = null;
        if (salesBalance.pageType == "bdompany") {
            historicalRecord = params.salesBalanceForDompanyPostData;
        } else if (salesBalance.pageType == "bpompany") {
            historicalRecord = params.salesBalanceForPompanyPostData;
        } else if (salesBalance.pageType == "bsupplier") {
            historicalRecord = params.salesBalanceForSuppleirPostData;
        } else {
            historicalRecord = params.salesBalancePostData;
        }

        com.post(pageConfig.apiPage, $.extend({}, historicalRecord, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['装修单号', 'sales.orderId'], ['销售单号', 'sales.no'], ['楼盘地址', ['sales.house.village.name', 'sales.house.houseNumber']], ['品牌', 'sales.brand'], ['渠道', 'salesman.currentName'], ['渠道ID', 'salesman.userId'], ['归属大区', 'region.name'], ['归属部门', 'dept.name'], ['总价', 'total'], ["券值:", 'sales.coupon'], ["券信息:", 'sales.couponInfo'], ["驻店:", 'sales.instorer.currentName'], ["预结算值:", 'balance'], ["预结算时间:", 'createTime'], ["预结算人:", 'creater.currentName'], ["厂商结算:", 'vbalance'], ["厂商结算人:", 'voster.currentName'], ["厂商结算时间:", 'venderTime'], ["结算值:", 'pbalance'], ["结算时间:", 'postTime'], ["结算人:", 'poster.currentName'], ["抹零:", 'sales.maling'], ["厂商抹零:", 'sales.venderMaling'], ["状态:", 'status'], ["类型:", 'type'], ["等级:", 'sales.grade'], ],
                list: res.paging.data

            }, function(v) {

                v.venderTime = v.venderTime == null ? '' : v.venderTime;
                v.postTime = v.postTime == null ? '' : v.postTime;
                v.poster.currentName = v.poster.currentName == null ? '' : v.poster.currentName;
                v.status = v.status == constant.sales().salesBalance.STATUS_PREBALANCE_INT ? '预结算' : v.status == constant.sales().salesBalance.STATUS_VENDORBALANCE_INT ? "厂商结算" : "结算";
                v.type = v.type == constant.sales().salesBalance.TYPE_INIT_INT ? "购货" : v.type == constant.sales().salesBalance.TYPE_PREBALANCEREFUNDS_INT ? "预结算退货" : "结算退货";
                v.voster.currentName = v.voster.currentName == null ? '' : v.voster.currentName;
            });
        });
    }

    // 批量厂商结算
    function vpostBalance() {

        var options = checkedInput(true);

        if (!options)
            return false;

        com.post(api.sales.vpostSalesBalance, options, function(res) {

            com.showAlert(com.info, "厂商结算成功");
            salesBalanceSearcher.doSearch();
        });
    }

    // 批量结算
    function postBalance() {

        var options = checkedInput(false);

        if (!options)
            return false;

        com.post(api.sales.postSalesBalance, options, function(res) {

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

        if (!inputs.length) {
            com.showAlert(com.warning, "请选择需要进行结算的销售单");
            return false;
        }

        var options = {};

        for ( var i = 0; i < inputs.length; i++) {

            var input = $(inputs[i]);

            var status = input.attr("data-status");
            var vbalance = input.attr("data-vbalance");
            var pbalance = input.attr("data-pbalance");
            var sbid = input.attr("data-sbid");

            if (flag && status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
                com.showAlert(com.warning, "非预结算状态下不允许进行厂商结算");
                return false;
            } else if (flag && vbalance == 0) {
                com.showAlert(com.warning, "厂商结算值未填写 , 请检查");
                return false;
            } else if (!flag && status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
                com.showAlert(com.warning, "非厂商结算状态下不允许进行结算");
                return false;
            } else if (!flag && pbalance == 0) {
                com.showAlert(com.warning, "结算值未填写 , 请检查");
                return false;
            }

            options["salesBalances[" + i + "].sbid"] = sbid;
        }

        return options;
    }

    // 结算单
    function crebalance() {

        var options = {};
        var index = 0;

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        var inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');

        if (!inputs.length) {
            com.showAlert(com.warning, "请选择结算单");
            return false;
        }

        var belonger = null;

        for ( var i = 0; i < inputs.length; i++) {

            var input = $(inputs[i]);

            var status = input.attr("data-status");
            var supplier = input.attr('data-supplier');
            var sbid = input.attr('data-sbid');

            if (status != constant.sales().salesBalance.STATUS_BALANCE_INT) {
                com.showAlert(com.warning, "请选择结算状态的结算单");
                return false;
            }

            if (belonger != null && supplier && supplier != belonger) {
                com.showAlert(com.warning, "厂商不一致");
                return false;
            }

            belonger = supplier;

            options["balanceSaless[" + index + "].salesBalance.sbid"] = sbid;
            index += 1;
        }

        options["balance.belonger.uid"] = belonger;

        com.post(api.balance.submitBalanceSales, options, function(res) {

            com.showAlert(com.info, "创建结算单成功");
            salesBalanceSearcher.doSearch();
        });
    }

});
