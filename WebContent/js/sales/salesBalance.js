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
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
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

    if (salesBalance.pageType.indexOf("allowance") != -1) {
        salesBalance.postData = "salesBalanceForAllowancePostData";
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

    function decorationBalance(v) {

        com.focusPage("text").css("line-height", "27px");
        com.post(api.decoration.queryDecorationByOrderId, {
            "decorationOrderId": v.sales.orderId
        }, function(res) {

            var decorationInfo = res.decoration;
            com.focusPage("#orderId").html(decorationInfo.orderId);
            com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);
            com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);
            com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);
            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);
            com.focusPage("#typeness").html(constant.decoration().decoration.typeness.keys[decorationInfo.typeness]);
            com.focusPage("#projectStatus").html(constant.decoration().decoration.projectStatus.keys[decorationInfo.projectStatus]);

            salesBalance.modals.decorationInfo.modal("show");
        });
    }

    function vbalancevalueBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
            com.showAlert(com.warning, "非预结状态下不允许进行厂结");
            return false;
        }

        salesBalance.items.vbalanceValue.find('input[name="total"]').val(v.total);

        com.popup4model("#vbalanceValue", "厂结值", function() {
            salesBalance.sales = v;
        }, function() {
            com.clearValidator();
            com.cleanItems(salesBalance.items);
        });
    }

    function vbalanceBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_PREBALANCE_INT) {
            com.showAlert(com.warning, "非预结状态下不允许进行厂结");
            return false;
        }

        if (v.vbalance == 0) {
            com.showAlert(com.warning, "厂结值未填写 , 请检查");
            return false;
        }

        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行厂结吗?', function() {
            com.post(api.sales.vpostSalesBalance, {
                "salesBalances[0].sbid": v.sbid
            }, function() {
                com.showAlert(com.info, "厂结成功");
                searcher.doSearch();
            });
        }, function() {
            searcher.doSearch();
        });
    }

    function balancevalueBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
            com.showAlert(com.warning, "非厂结状态下不允许进行结算");
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
    }

    function balanceBalance(v) {

        if (v.status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
            com.showAlert(com.warning, "非厂结状态下不允许进行结算");
            return false;
        }

        com.showConfirm('确定要将单号为 ' + v.sales.no + ' 的销售单进行结算吗?', function() {
            com.post(api.sales.postSalesBalance, {
                "salesBalances[0].sbid": v.sbid
            }, function() {
                com.showAlert(com.info, "结算成功");
                searcher.doSearch();
            });
        }, function() {
            searcher.doSearch();
        });
    }

    function paymentBalance(v) {

        params.sales.sales = v.sales;
        params.sales.type = "balance";

        com.popup4page("#viewPopUp", "views/sales/sales4payment.html?type=balance", "收款");
    }

    function subBalance(v) {

        params.sales.sales = v.sales;
        params.sales.salesBalance = v;

        com.popup4page("#viewPopUp", "views/sales/salesItem4balance.html", "子项");
    }

    function statusBalance(v) {

        com.post(api.sales.rpreSalesBalance, {
            "salesBalance.sbid": v.sbid
        }, function() {
            com.showAlert(com.info, "更新为预结成功");
            searcher.doSearch();
        });
    }

    function rejectBalance(v) {

        com.post(api.sales.rejectSalesBalance, {
            "salesBalance.sbid": v.sbid
        }, function() {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    function pictureBalance(v) {

        managedrawing(v);
        initUploadBtn(v);
    }

    function buildBalanceLineprops() {

        var propertyMap = {
            orderId: {field: "orderId", name: "装修单号", prop: "sales.orderId", clazz: "blue", click: function($this, v) {tools.decoration.info($this, v.sales.orderId);}},
            address: {field: "address", name: "楼盘地址", prop: function(v) {return v.sales.house.village.name + " " + v.sales.house.houseNumber;}, clazz: "grey"},
            depositpay: {field: "depositpay", name: "定金", prop: "sales.depositpay", clazz: "blue"},
            fullpay: {field: "fullpay", name: "补款", prop: "sales.fullpay", clazz: "blue"},
            prevalue: {field: "prevalue", name: "预结值", prop: "balance", clazz: "blue"},
            preCreateTime: {field: "preCreateTime", name: "预结时间", prop: "createTime", clazz: "green"},
            precreater: {field: "precreater", name: "预结人", prop: "creater.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.creater.userId);}},
            vbalance: {field: "vbalance", name: "厂结值", prop: "vbalance", clazz: "blue"},
            venderTime: {field: "venderTime", name: "厂结时间", prop: "venderTime", clazz: "green"},
            pbalance: {field: "pbalance", name: "结算值", prop: "pbalance", clazz: "blue"},
            balanceTime: {field: "balanceTime", name: "结算时间", prop: "postTime", clazz: "green"},
            poster: {field: "poster", name: "结算人", prop: "poster.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.poster.userId);}},
            grade: {field: "grade", name: "等级", prop: "sales.grade", clazz: "red"},
            type: {field: "type", name: "类型", prop: function(v) {return constant.sales().salesBalance.type.keys[v.type];}, clazz: "red"},
            voster: {field: "voster", name: "厂结人", prop: "voster.currentName", clazz: "red", click: function($this, v) {tools.personel.info($this, v.voster.userId);}},
            "sales-creater": {field: "sales-creater", name: "创建人", prop: "sales.creater.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.sales.creater.userId);}},
            maling: {field: "maling", name: "抹零", prop: function(v) {return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.maling;}, clazz: "blue"},
            venderMaling: {field: "venderMaling", name: "厂商抹零", prop: function(v) {return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.venderMaling;}, clazz: "blue"},
            coupon: {field: "coupon", name: "券值", prop: function(v) {return v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? 0 : v.sales.coupon;}, clazz: "blue"},
            couponInfo: {field: "couponInfo", name: "券信息", prop: "sales.couponInfo", clazz: "grey"}
        };

        var props = [{
            type: "checkbox",
            field: "data-sbid",
            prop: "sbid",
            name: "sbids",
            value: "sbid",
            attrs: function(v) {
                return {
                    "data-sbid": v.sbid,
                    "data-status": v.status,
                    "data-vbalance": v.vbalance,
                    "data-pbalance": v.pbalance,
                    "data-supplier": v.sales.supplier.uid
                };
            }
        }];

        $.each(pageConfig.propertyArr, function(i, key) {
            if (propertyMap[key]) {
                props.push(propertyMap[key]);
                return true;
            }
            if (key == "salesBananceCoupon") {props.push({type: "newline"}); props.push({field: "salesBananceCoupon", name: "款项券", prop: "coupon", clazz: "blue"}); return true;}
            if (key == "allowance") {props.push({field: "allowance", name: "补贴", prop: "allowance", clazz: "blue"}); return true;}
            if (key == "total") {props.push({field: "total", name: "总价", prop: "total", clazz: "blue"}); return true;}
            if (key == "oneType") {props.push({field: "oneType", name: "一类", prop: function(v) {return constant.sales().salesBalance.onetype.keys[v.onetype];}, clazz: "red"}); return true;}
            if (key == "status") {props.push({field: "balanceStatus", name: "状态", prop: function(v) {return constant.sales().salesBalance.status.keys[v.status];}, clazz: "red"}); return true;}
            if (key == "deliverStatus") {props.push({field: "deliverStatus", name: "配送状态", show: function(v) {return v.type == 0 && v.onetype == 0;}, prop: function(v) {return constant.sales().salesBalance.deliverStatus.keys[v.deliverStatus];}, clazz: "red"}); return true;}
            if (key == "verifyStatus") {props.push({field: "verifyStatus", name: "审核状态", prop: function(v) {return constant.sales().salesBalance.verifyStatus.keys[v.verifyStatus];}, clazz: "red"}); return true;}
            if (key == "confirmStatus") {props.push({field: "confirmStatus", name: "确认状态", prop: function(v) {return constant.sales().salesBalance.confirmStatus.keys[v.confirmStatus];}, clazz: "red"}); return true;}
        });

        return props;
    }

    function buildBalanceLinebtns() {

        var buttonMap = {
            decoration: {name: "装修单", clazz: "btn-purple", show: function(v) {return v.type != 4;}, handle: decorationBalance},
            sub: {name: "子项", clazz: "btn-pink", show: function(v) {return v.type != 4;}, handle: subBalance},
            payment: {name: "款项", clazz: "btn-danger", show: function(v) {return v.type != 4;}, handle: paymentBalance},
            vbalancevalue: {name: "厂结值", clazz: "btn-yellow", show: function(v) {return v.type != 4;}, handle: vbalancevalueBalance},
            status: {name: "反结", clazz: "btn-purple", show: function(v) {return v.type != 4;}, handle: statusBalance},
            reject: {name: "驳回", clazz: "btn-purple", show: function(v) {return v.type != 4;}, handle: rejectBalance},
            vbalance: {name: "厂结", clazz: "btn-success", show: function(v) {return v.type != 4;}, handle: vbalanceBalance},
            balancevalue: {name: "结算值", clazz: "btn-warning", show: function(v) {return v.type != 4;}, handle: balancevalueBalance},
            balance: {name: "结算", clazz: "btn-inverse", show: function(v) {return v.type != 4;}, handle: balanceBalance},
            salesBalancePicture: {name: "图片", clazz: "btn-search", show: function(v) {return v.type != 4;}, handle: pictureBalance}
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {
            buttonMap[key] && (btns[key] = $.extend({}, buttonMap[key]));
        });

        return btns;
    }

    function buildBalanceButtons() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);

        var $addaExportSales = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importSalesBalance').css('margin-top', '0px 3px');
        $('<i></i>').addClass('icon-check bigger-110').appendTo($addaExportSales);
        $('<span></span>').text('导出').appendTo($addaExportSales);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'batchVendor').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($adda);
        $('<span></span>').text('批量厂结').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'batchSettlement').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($addaEnd);
        $('<span></span>').text('批量结算').appendTo($addaEnd);

        var $balanceEnd = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'balanceEnd').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($balanceEnd);
        $('<span></span>').text('结算单').appendTo($balanceEnd);

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
    }

    var searcher = new Searcher();

    var salesBalanceParams = {}

    if (salesBalance.pageType.indexOf("allowance") != -1) {
        salesBalanceParams["salesBalance.sales.type"] = 1;
    }

    var searcher = new Searcher();

    var salesBalanceParams = {}

    if (salesBalance.pageType.indexOf("allowance") != -1) {
        salesBalanceParams["salesBalance.sales.type"] = 1;
    }

    searcher.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, salesBalanceParams, pageConfig.condArr, salesBalance.postData, null, false, buildBalanceButtons);
    searcher.line('sales.no', buildBalanceLineprops(), buildBalanceLinebtns()).render();


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

                searcher.doSearch();
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

            searcher.doSearch();
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
        } else if (salesBalance.pageType.indexOf("allowance") != -1) {
            historicalRecord = params.salesBalanceForAllowancePostData;
        } else {
            historicalRecord = params.salesBalancePostData;
        }

        com.post(pageConfig.apiPage, $.extend({}, historicalRecord, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [//
                ['装修单号', 'sales.orderId'], //
                ['销售单号', 'sales.no'], //
                ['楼盘地址', ['sales.house.village.name', 'sales.house.houseNumber']], //
                ['品牌', 'sales.brand.name'], //
                ['渠道ID', 'salesman.userId'], //
                ['渠道', 'salesman.currentName'], //
                ['渠道大区', 'salesman.dept.name'], //
                ['渠道部门', 'salesman.dept.fatherDept.name'], //
                ['归属大区', 'region.name'], //
                ['归属部门', 'dept.name'], //
                ['总价', 'total'], //
                ['券值', 'sales.coupon'], //
                ['券信息', 'sales.couponInfo'], //
                ['驻店', 'sales.instorer.currentName'], //
                ['预结值', 'balance'], //
                ['预结时间', 'createTime'], //
                ['预结人', 'creater.currentName'], //
                ['厂结', 'vbalance'], //
                ['厂结人', 'voster.currentName'], //
                ['厂结时间', 'venderTime'], //
                ['结算值', 'pbalance'], //
                ['结算时间', 'postTime'], //
                ['结算人', 'poster.currentName'], //
                ['抹零', 'sales.maling'], //
                ['厂商抹零', 'sales.venderMaling'], //
                ['补贴', 'allowance'], //
                ['状态', 'status'], //
                ['类型', 'type'], //
                ['等级', 'sales.grade'], //
                ],
                list: res.paging.data

            }, function(v) {

                v.venderTime = v.venderTime == null ? '' : v.venderTime;
                v.postTime = v.postTime == null ? '' : v.postTime;
                v.poster.currentName = v.poster.currentName == null ? '' : v.poster.currentName;
                v.status = v.status == constant.sales().salesBalance.STATUS_PREBALANCE_INT ? '预结' : v.status == constant.sales().salesBalance.STATUS_VENDORBALANCE_INT ? "厂结" : "结算";
                v.type = v.type == constant.sales().salesBalance.TYPE_INIT_INT ? "购货" : v.type == constant.sales().salesBalance.TYPE_PREBALANCEREFUNDS_INT ? "预结退货" : "结算退货";
                v.voster.currentName = v.voster.currentName == null ? '' : v.voster.currentName;

                v.sales.coupon = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.coupon;
                v.sales.maling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.maling;
                v.sales.venderMaling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.venderMaling;

            });
        });
    }

    // 批量厂结
    function vpostBalance() {

        var options = checkedInput(true);

        if (!options)
            return false;

        com.post(api.sales.vpostSalesBalance, options, function(res) {

            com.showAlert(com.info, "厂结成功");
            searcher.doSearch();
        });
    }

    // 批量结算
    function postBalance() {

        var options = checkedInput(false);

        if (!options)
            return false;

        com.post(api.sales.postSalesBalance, options, function(res) {

            com.showAlert(com.info, "结算成功");
            searcher.doSearch();
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
                com.showAlert(com.warning, "非预结状态下不允许进行厂结");
                return false;
            } else if (flag && vbalance == 0) {
                com.showAlert(com.warning, "厂结值未填写 , 请检查");
                return false;
            } else if (!flag && status != constant.sales().salesBalance.STATUS_VENDORBALANCE_INT) {
                com.showAlert(com.warning, "非厂结状态下不允许进行结算");
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
            searcher.doSearch();
        });
    }

    function managedrawing(v) {

        com.focusPage('#salesDrawing').html("");

        com.post(api.sales.querySalesPicture, {
            "salesPicture.siid": v.sbid,
            "salesPicture.type": 3
        }, function(data) {

            var salesPictures = data.salesPictures;
            if (salesPictures && salesPictures.length) {
                $.each(salesPictures, function(i, value) {

                    if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                        appendGalleryElement("salesDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#salesDrawing"));
            }
        }, null, false);

        salesBalance.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.spid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, 0);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.sales.deleteSalesPicture, {
                "salesPicture.spid": value.spid
            }, function(res) {

                com.focusPage("#gallery_li" + value.spid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(v) {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["salesPicture.sid"] = v.sales.sid;
            options["salesPicture.siid"] = v.sbid;
            options["salesPicture.name"] = data.strutsUploadsFileName;
            options["salesPicture.path"] = data.resUrl;
            options["salesPicture.type"] = 3;
            options["salesPicture.filesize"] = data.filesize;
            com.post(api.sales.addSalesPicture, options, function(res) {

                var salesPicture = res.salesPicture;

                appendGalleryElement("salesDrawing", salesPicture);

                com.popup4photos("#salesDrawing");

            });

            searcher.doSearch();
        });
    }

});
