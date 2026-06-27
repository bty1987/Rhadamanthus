$(function() {

    var salesBalance = {

        balanceType: {},
        status: {},
        salesPaymentForStatus: {},
        salesPaymentType: {},
        oneType: {},
        balanceSaleses: {},

        items: {
            balanceSales: com.focusPage("#balanceSales"),
        },

        modals: {
            balanceSalesModal: com.focusPage("#balanceSalesModal"),
        },

        btns: {
            balanceSalesBtn: com.focusPage("#balanceSalesBtn", "#balanceSalesModal"),
        },
        salesBalanceItem: []

    };
    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    salesBalance.btns.balanceSalesBtn.click(balanceSales);

    com.post(api.data.queryReceiptType, {}, function(res) {

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

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == constant.data().receiptType.TYPE_CASH_INT) {
                salesBalance.salesPaymentForStatus.cash.push(v);
                salesBalance.salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_BANK_INT) {
                salesBalance.salesPaymentForStatus.bank.push(v);
                salesBalance.salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_CHECK_INT) {
                salesBalance.salesPaymentForStatus.checkBank.push(v);
                salesBalance.salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_ACCOUNT_INT) {
                salesBalance.salesPaymentForStatus.accounts.push(v);
                salesBalance.salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_COUPON_INT) {
                salesBalance.salesPaymentForStatus.couponType.push(v);
                salesBalance.salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });

    }, null, false);

    function paymentCheck(v) {

        params.sales.sales = v.sales;
        params.sales.type = "balance";

        com.popup4page("#viewPopUp", "views/sales/sales4payment.html", "收款");
    }

    function subCheck(v) {

        params.sales.sales = v.sales;
        params.sales.salesBalance = v;

        com.popup4page("#viewPopUp", "views/sales/salesItem4balance.html", "子项");
    }

    var lineprops = (function() {

        var propertyMap = {
            orderId: {
                field: "orderId",
                name: "装修单号",
                prop: "sales.orderId",
                clazz: "blue",
                click: function($this, v) {

                    tools.decoration.info($this, v.sales.orderId);
                }
            },
            address: {
                field: "address",
                name: "楼盘地址",
                prop: function(v) {

                    return v.sales.house.village.name + " " + v.sales.house.houseNumber;
                },
                clazz: "grey"
            },
            salesman: {
                field: "salesman",
                name: "渠道",
                prop: "salesman.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.salesman.userId);
                }
            },
            dept: {
                field: "dept",
                name: "归属部门",
                prop: "dept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.dept.did);
                }
            },
            region: {
                field: "region",
                name: "归属大区",
                prop: "region.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.region.did);
                }
            },
            instorer: {
                field: "instorer",
                name: "驻店",
                prop: "sales.instorer.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.sales.instorer.userId);
                }
            },
            brand: {
                field: "brand",
                name: "品牌",
                prop: "sales.brand.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.brand.info($this, v.sales.brand.bid);
                }
            },
            depositpay: {
                field: "depositpay",
                name: "定金",
                prop: "sales.depositpay",
                clazz: "blue"
            },
            fullpay: {
                field: "fullpay",
                name: "补款",
                prop: "sales.fullpay",
                clazz: "blue"
            },
            prevalue: {
                field: "prevalue",
                name: "预结值",
                prop: "balance",
                clazz: "blue"
            },
            precreater: {
                field: "precreater",
                name: "预结人",
                prop: "creater.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.creater.userId);
                }
            },
            pbalance: {
                field: "pbalance",
                name: "结算值",
                prop: "pbalance",
                clazz: "blue"
            },
            balanceTime: {
                field: "balanceTime",
                name: "结算时间",
                prop: "postTime",
                clazz: "green"
            },
            poster: {
                field: "poster",
                name: "结算人",
                prop: "poster.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.poster.userId);
                }
            },
            vbalance: {
                field: "vbalance",
                name: "厂结值",
                prop: "vbalance",
                clazz: "blue"
            },
            grade: {
                field: "grade",
                name: "等级",
                prop: "sales.grade",
                clazz: "red"
            },
            maling: {
                field: "maling",
                name: "抹零",
                prop: function(v) {

                    return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.maling;
                },
                clazz: "blue"
            },
            coupon: {
                field: "coupon",
                name: "券值",
                prop: function(v) {

                    return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.coupon;
                },
                clazz: "blue"
            },
            couponInfo: {
                field: "couponInfo",
                name: "券信息",
                prop: "sales.couponInfo",
                clazz: "grey"
            },
            type: {
                field: "type",
                name: "类型",
                prop: function(v) {

                    return constant.sales().salesBalance.type.keys[v.type];
                },
                clazz: "red"
            }
        };

        var props = [{
            type: "checkbox",
            field: "data-sbid",
            prop: "sbid",
            name: "salesBalanceItem",
            value: "sbid",
            attrs: function(v) {

                return {
                    "data-sbid": v.sbid,
                    "data-status": v.status,
                    "data-vbalance": v.vbalance,
                    "data-pbalance": v.pbalance,
                    "data-bid": v.sales.brand.bid,
                    "data-onetype": v.onetype,
                    "data-type": v.type,
                    "data-depositpay": v.sales.depositpay,
                    "data-fullpay": v.sales.fullpay,
                    "data-total": v.total,
                    "data-allowance": v.allowance,
                    "data-venderMaling": v.sales.venderMaling
                };
            },
            checked: function(v) {

                return salesBalance.salesBalanceItem.contains(String(v.sbid));
            },
            click: function($input, v) {

                var checked = $input.prop("checked");
                if (checked)
                    !salesBalance.salesBalanceItem.contains(v.sbid) && salesBalance.salesBalanceItem.push(v.sbid);
                else
                    salesBalance.salesBalanceItem.contains(v.sbid) && salesBalance.salesBalanceItem.splice(salesBalance.salesBalanceItem.indexOf(v.sbid), 1);
            }
        }];

        $.each(pageConfig.propertyArr, function(i, key) {

            if (propertyMap[key]) {
                props.push(propertyMap[key]);
                return true;
            }
            if (key == "venderMaling") {
                props.push({
                    type: "newline"
                });
                props.push({
                    field: "venderMaling",
                    name: "厂商抹零",
                    prop: function(v) {

                        return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.venderMaling;
                    },
                    clazz: "green"
                });
                return true;
            }
            if (key == "allowance") {
                props.push({
                    field: "allowance",
                    name: "补贴",
                    prop: "allowance",
                    clazz: "blue"
                });
                return true;
            }
            if (key == "salesBananceCoupon") {
                props.push({
                    field: "salesBananceCoupon",
                    name: "结算券值",
                    prop: "coupon",
                    clazz: "blue"
                });
                return true;
            }
            if (key == "total") {
                props.push({
                    field: "total",
                    name: "总价",
                    prop: "total",
                    clazz: "blue"
                });
                return true;
            }
            if (key == "preCreateTime") {
                props.push({
                    field: "preCreateTime",
                    name: "预结时间",
                    prop: "createTime",
                    clazz: "green"
                });
                return true;
            }
            if (key == "venderTime") {
                props.push({
                    field: "venderTime",
                    name: "厂结时间",
                    prop: "venderTime",
                    clazz: "green"
                });
                return true;
            }
            if (key == "oneType") {
                props.push({
                    field: "oneType",
                    name: "一类",
                    prop: function(v) {

                        return constant.sales().salesBalance.onetype.keys[v.onetype];
                    },
                    clazz: "red"
                });
                return true;
            }
            if (key == "status") {
                props.push({
                    field: "balanceStatus",
                    name: "状态",
                    prop: function(v) {

                        return constant.sales().salesBalance.status.keys[v.status];
                    },
                    clazz: "red"
                });
                return true;
            }
            if (key == "realSalesTotal") {
                props.push({
                    type: "newline"
                });
                props.push({
                    field: "realSalesTotal",
                    name: "实际销售额",
                    prop: function(v) {

                        return utils.changeThrDecimal(v.total - v.sales.venderMaling - v.sales.maling - v.sales.coupon);
                    },
                    clazz: "blue"
                });
                return true;
            }
            if (key == "salesvtotal") {
                props.push({
                    field: "salesvtotal",
                    name: "销售收入厂商结算额",
                    prop: "total",
                    clazz: "blue"
                });
                return true;
            }
            if (key == "salesvpay") {
                props.push({
                    field: "salesvpay",
                    name: "销售成本厂商借款额",
                    prop: "vbalance",
                    clazz: "green"
                });
                return true;
            }
            if (key == "accountPay") {
                props.push({
                    field: "accountPay",
                    name: "应付账款",
                    prop: function(v) {

                        return utils.changeThrDecimal(v.vbalance - v.sales.venderMaling);
                    },
                    clazz: "red"
                });
                return true;
            }
        });

        return props;
    })();

    var linebtns = (function() {

        var buttonMap = {
            sub: {
                name: "子项",
                clazz: "btn-pink",
                handle: subCheck
            },
            payment: {
                name: "款项",
                clazz: "btn-danger",
                handle: paymentCheck
            }
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {

            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    })();

    var buttons = (function() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);

        var $balanceEnd = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'balanceEnd').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($balanceEnd);
        $('<span></span>').text('对账').appendTo($balanceEnd);

        $checka.click(function() {

            checkAll();
        });

        $balanceEnd.click(function() {

            salesBalance.modals.balanceSalesModal.modal("show");
        });

        return [$checka, $balanceEnd];
    })();

    var searcher = new Searcher();

    var searcher = new Searcher();

    searcher.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, null, pageConfig.condArr, "salesBalanceCheckPostData", null, false, buildBalanceCheckButtons);
    searcher.line('sales.no', lineprops, linebtns).render();

    com.initTypeahead("balanceSales", api.balance.queryBalanceSales, "balanceSales.name", {}, "balanceSaleses", "bsid", function(v) {

        return v["name"] + " " + v["grade"]
    });

    // 收款显示
    function viewSalesPaymentLine(tableId, listData) {

        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(constant.payment().materialPayment.paymentType.keys[v.type]);
                var propertyArr = [["销售单号:", v.sales.no, "blue"], ["品类:", v.sales.category, "grey"], ["品牌:", v.sales.brand.name, "grey"], ["应收额:", v.referMoney, "blue"], ["收款时间:", v.salesReceipt.collectTime, "green"], ["确认时间:", v.salesReceipt.confirmTime, "green"], ["状态:", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "red"]];
                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];

                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
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

                $.each(addPropertyArr, function(index, value) {

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

    // 子项显示
    var salesBalanceItemList = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var propertyArr = [["商品品类:", v.salesItem.goods.category, "grey", "category"], ["商品颜色:", v.salesItem.color.name, "grey", "color"], ["商品规格:", v.salesItem.format.info, "grey", "format"], ["售价:", v.salesItem.selling, "blue", "selling"], ["折扣价:", v.salesItem.disPrice, "blue", "disPrice"], ["折让价:", v.salesItem.price, "blue", "price"], ["数量:", v.num, "blue", "num"], ["总价:", v.total, "blue", "total"], ["结算方式:", v.ctype == 0 ? "底价" : "点位", "red", "ctype"], ["结算值:", v.cvalue, "blue", "cvalue"], ["备注:", v.salesItem.comment, "grey", "comment"]];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').css({
                            "border-bottom": "0px"
                        });
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
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }

        $.each(com.focusPage('input[type="checkbox"]'), function(i, e) {

            var $that = $(e);
            var sbid = $that.attr("data-sbid");

            var checked = $that.prop("checked");

            if (checked)
                !salesBalance.salesBalanceItem.contains(sbid) && salesBalance.salesBalanceItem.push(sbid);
            else
                salesBalance.salesBalanceItem.contains(sbid) && salesBalance.salesBalanceItem.splice(salesBalance.salesBalanceItem.indexOf(sbid), 1);
        });
    }

    function balanceSales() {

        if (com.validate('balanceSalesModal'))
            return false;

        var options = {};
        var balanceSales = {};

        var inputs = com.focusPage('input[name="salesBalanceItem"]:checked', '#resultList');
        var bsid = com.typeahead("balanceSales");

        if (!inputs.length) {
            com.showAlert(com.warning, "请选择结算单");
            return false;
        }
        com.post(api.balance.countBalanceSalesBalance, {
            "balanceSales.bsid": bsid
        }, function(res) {

            count = res.count;
        }, null, false);

        if (count + inputs.length > 500) {
            com.showAlert(com.warning, "数据量过大");
            return false;
        }

        com.post(api.balance.queryBalanceSalesByBsid, {
            "balanceSales.bsid": bsid
        }, function(res) {

            balanceSales = res.balanceSales;
        }, null, false);

        for ( var i = 0; i < salesBalance.salesBalanceItem.length; i++) {

            options["balanceSalesBalances[" + i + "].salesBalance.sbid"] = salesBalance.salesBalanceItem[i];

        }
        if (!options)
            return false;

        options["balanceSales.bsid"] = bsid;

        com.post(api.balance.submitBalanceSales, options, function(res) {

            com.showAlert(com.info, "操作成功");
            salesBalance.salesBalanceItem = [];
            searcher.doSearch();
        });
    }

});