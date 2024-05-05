jQuery(function($) {

    var payment4common = {
        orderId: params.orderId,
        decoration: {},
        customer: {},

        cash: [],
        bank: [],
        checkv: [],
        accounts: [],
        couponType: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkvUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkvInfo: {},
        accountsInfo: {},
        couponTypeData: {},

        modals: {
            printPaymentModal: com.focusPage("#printPaymentModal", "#paymentCommon")
        },
        btns: {
            searcher: com.focusPage("#searcher", "#paymentCommon"),
            print: com.focusPage("#print", "#paymentCommon"),
            printBtn: com.focusPage("#printBtn", "#paymentCommon")
        }
    };

    com.focusPage('#fl-statement').statement("款项", "汇总").show();

    payment4common.modals.printPaymentModal.on('hide.bs.modal', function() {

        com.focusPage("#printPaymentModal :checkbox", "#paymentCommon").prop("checked", false).trigger("change");
    });

    paymentUtils.getReceiptType(payment4common);

    if (params.orderId) {

        com.focusPage("#orderIdDiv").css("display", "none");

        main();
    } else {
        com.focusPage("#orderIdDiv").css("display", "block")
    }

    payment4common.btns.searcher.click(function() {

        if (com.focusPage("#orderId").val() == "") {
            com.showAlert(com.warning, "请输入装修单号.");
            return false;
        }

        payment4common.orderId = com.focusPage("#orderId").val();
        main();
    });

    payment4common.btns.print.click(function() {

        payment4common.modals.printPaymentModal.modal("show");
    });

    payment4common.btns.printBtn.click(function() {

        var printConf = {
            "decoration": payment4common.decoration,
            "ptype": [],
            "rtype": []
        };

        var $ptypes = com.focusPage('input[name="ptype"]:checked', '#printPaymentModal');
        var $rtypes = com.focusPage('input[name="rtype"]:checked', '#printPaymentModal');

        $.each($ptypes, function(i, v) {

            printConf["ptype"].push($(v).attr('value'));
        });

        $.each($rtypes, function(i, v) {

            printConf["rtype"].push($(v).attr('value'));
        });

        if (printConf.ptype.length == 0 || printConf.rtype.length == 0) {
            com.showAlert(com.warning, "请勾选打印参数.");
            return false;
        }

        params["printConf"] = printConf;
        com.popup("打印款项明细", api.index.payment2printIndex.url, null, null, true);
    });

    function main() {

        com.focusPage("#infolist").css("display", "block");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment4common.orderId
        }, function(res) {

            payment4common.decoration = res.decoration;

        }, null, false);

        com.post(api.data.queryCustomerById, {
            "customer.cid": payment4common.decoration.customer.cid
        }, function(res) {

            payment4common.customer = res.customer;

        }, null, false);

        var customerInfo = [{
            "key": "姓名",
            "value": payment4common.customer ? payment4common.customer.name : ""
        }, {
            "key": "性别",
            "value": payment4common.customer ? payment4common.customer.gender : ""
        }, {
            "key": "类型",
            "value": payment4common.customer ? constant.customer().customer.customerType.keys[payment4common.customer.type] : ""
        }, {
            "key": "电话",
            "value": payment4common.customer ? payment4common.customer.phone : ""
        }, {
            "key": "微信",
            "value": payment4common.customer ? payment4common.customer.wechat : ""
        }];

        var decorationInfo = [{
            "key": "装修单号",
            "value": payment4common.decoration ? payment4common.decoration.orderId : ""
        }, {
            "key": "楼盘",
            "value": payment4common.decoration ? payment4common.decoration.house.village.name : ""
        }, {
            "key": "楼号",
            "value": payment4common.decoration ? payment4common.decoration.house.houseNumber : ""
        }, {
            "key": "类型",
            "value": payment4common.decoration ? constant.decoration().decoration.typeness.keys[payment4common.decoration.type] : ""
        }, {
            "key": "等级",
            "value": payment4common.decoration ? payment4common.decoration.grade : ""
        }];

        drawInfo("customerInfo", "客户", "header-color-orange", customerInfo);
        drawInfo("decorationInfo", "装修单", "header-color-blue", decorationInfo);

        advance();
        decoration();
        sales();
        service();
    }

    function drawInfo(id, name, style, infos) {

        com.focusPage("#" + id).remove();

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").attr("id", id).prependTo(com.focusPage("#infolist"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header " + style).appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text(name).appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $.each(infos, function(i, v) {

            $('<div></div>').append($('<label></label>').attr('for', 'form-field').text(v.key + ": " + v.value)).appendTo($info);
        });
    }

    function advance() {

        var searcherAdvance = new Searcher();

        searcherAdvance.base("condListAdvance", "pagenationAdvance", "resultListAdvance", api.payment.pagePayment);
        searcherAdvance.history("advanceCommonPostData");
        searcherAdvance.param({
            "filters[0].field": "decoration.orderId",
            "filters[0].data": payment4common.decoration.orderId
        });

        var linepropsAdvance = [{
            field: "type",
            name: "收款类型",
            prop: "type",
            clazz: "red",
            dataset: constant.payment().advancePayment.type.keys
        }, {
            field: "paymentType",
            name: "类型",
            prop: "paymentType",
            clazz: "red",
            dataset: constant.payment().advancePayment.paymentType.keys
        }, {
            field: "recharge",
            name: "操作金额",
            prop: "recharge",
            clazz: "blue"
        }, {
            field: "balance",
            name: "余额",
            prop: "balance",
            clazz: "blue"
        }, {
            field: "realMoney",
            name: "实收额",
            prop: "realMoney",
            clazz: "blue"
        }, {
            field: "collectUser",
            name: "收款人",
            prop: "collectUser.currentName",
            clazz: "grey",
            show: function(v) {

                return v.collectUser == null ? false : v.collectUser.currentName;
            }
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "collectTime",
            clazz: "green",
            show: function(v) {

                return v.collectTime == null ? false : v.collectTime;
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.payment().payment.status.keys
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];

        var lineprops = [].concat(linepropsAdvance, getReceiptTypeLineprops());

        searcherAdvance.line(function(v) {

            return constant.payment().advancePayment.type.keys[v.type];
        }, lineprops, []).render();

    }

    function decoration() {

        var searcherDecoration = new Searcher();

        searcherDecoration.base("condListDecoration", "pagenationDecoration", "resultListDecoration", api.payment.pageDecorationPayment);
        searcherDecoration.history("decorationCommonPostData");
        searcherDecoration.param({
            "filters[0].field": "decoration.orderId",
            "filters[0].data": payment4common.decoration.orderId
        });

        var linepropsDecoration = [{
            field: "paymentType",
            name: "款项",
            prop: "paymentType",
            clazz: "grey"
        }, {
            field: "referMoney",
            name: "应收金额",
            prop: "referMoney",
            clazz: "blue"
        }, {
            field: "collecter",
            name: "收款人",
            prop: "collecter.currentName",
            clazz: "grey",
            show: function(v) {

                return v.collecter == null ? false : v.collecter.currentName;
            }
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "collectTime",
            clazz: "green",
            show: function(v) {

                return v.collectTime == null ? false : v.collectTime;
            }
        }, {
            field: "paymentStatus",
            name: "状态",
            prop: "paymentStatus",
            clazz: "red",
            dataset: constant.payment().decorationPayment.paymentStatus.keys
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];

        var lineprops = [].concat(linepropsDecoration, getReceiptTypeLineprops());

        searcherDecoration.line("paymentType", lineprops, []).render();
    }

    function sales() {

        var searcherSales = new Searcher();

        searcherSales.base("condListSales", "pagenationSales", "resultListSales", api.payment.pageSalesPayment);
        searcherSales.history("salesCommonPostData");
        searcherSales.param({
            "filters[0].field": "sales.orderId",
            "filters[0].data": payment4common.decoration.orderId
        });

        var linepropsSales = [{
            field: "no",
            name: "销售单号",
            prop: "sales.no",
            clazz: "blue"
        }, {
            field: "grade",
            name: "等级",
            prop: "sales.grade",
            clazz: "red"
        }, {
            field: "brand",
            name: "品牌",
            prop: "sales.brand",
            clazz: "grad"
        }, {
            field: "dept",
            name: "渠道部门",
            prop: "sales.dept.name",
            clazz: "grad"
        }, {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.payment().salespayment.type.keys
        }, {
            field: "referMoney",
            name: "应收金额",
            prop: "referMoney",
            clazz: "blue"
        }, {
            field: "collecter",
            name: "收款人",
            prop: "salesReceipt.collecter.currentName",
            clazz: "grey",
            show: function(v) {

                return v.salesReceipt.collecter == null ? false : v.salesReceipt.collecter.currentName;
            }
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "salesReceipt.collectTime",
            clazz: "green",
            show: function(v) {

                return v.salesReceipt.collectTime == null ? false : v.salesReceipt.collectTime;
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.payment().salesPayment.status.keys
        }, {
            field: "comment",
            name: "备注",
            prop: "salesReceipt.comment",
            clazz: "grey"
        }];

        var lineprops = linepropsSales.concat(getReceiptTypeLineprops("salesReceipt"));

        searcherSales.line("sales.brand", lineprops, []).render();
    }

    function service() {

        var searcherService = new Searcher();

        searcherService.base("condListService", "pagenationService", "resultListService", api.payment.pageServicePayment);
        searcherService.history("serviceCommonPostData");
        searcherService.param({
            "filters[0].field": "decoration.orderId",
            "filters[0].data": payment4common.decoration.orderId
        });

        var linepropsService = [{
            field: "advanceMoney",
            name: "预付款金额",
            prop: "advanceMoney",
            clazz: "blue"
        }, {
            field: "serviceMoney",
            name: "服务费",
            prop: "serviceMoney",
            clazz: "blue"
        }, {
            field: "serviceReceipt.realMoney",
            name: "实收额",
            prop: "serviceReceipt.realMoney",
            clazz: "blue"
        }, {
            field: "collecter",
            name: "收款人",
            prop: "serviceReceipt.collecter.currentName",
            clazz: "grey",
            show: function(v) {

                return v.serviceReceipt.collecter == null ? false : v.serviceReceipt.collecter.currentName;
            }
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "serviceReceipt.collectTime",
            clazz: "green",
            show: function(v) {

                return v.serviceReceipt.collectTime == null ? false : v.serviceReceipt.collectTime;
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.payment().servicePayment.status.keys
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];

        var lineprops = [].concat(linepropsService, getReceiptTypeLineprops("serviceReceipt"));

        searcherService.line(function(v) {

            return constant.payment().servicePayment.type.keys[v.type];
        }, lineprops, []).render();
    }

    function getReceiptTypeLineprops(param) {

        var obj = "";

        if (param != null)
            obj = param + ".";

        var linepropsCommonEnd = [{
            type: "newline"
        }, {
            field: "cash",
            name: "现金",
            prop: obj + "cash",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];

                if (data.cash > 0) {
                    return data.cash = data.cash + " " + (data.cashInfo ? payment4common.cashInfo[data.cashInfo] == null ? "无匹配" : payment4common.cashInfo[data.cashInfo] : "");
                } else {
                    return false;
                }
            }
        }, {
            field: "bank",
            name: "刷卡",
            prop: obj + "bank",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];

                if (v.bank > 0) {
                    return data.bank = paymentUtils.splitBankInfo(data.bank, data.bankInfo, payment4common.bankInfo);
                } else {
                    return false;
                }
            }
        }, {
            field: "checkv",
            name: "银行",
            prop: obj + "checkv",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];

                if (data.checkv > 0) {
                    return data.checkv = paymentUtils.splitBankInfo(data.checkv, data.checkvBank, payment4common.checkvInfo);
                } else {
                    return false;
                }
            }
        }, {
            field: "installment",
            name: "分期",
            prop: obj + "installment",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];
                return data.installment > 0 ? data.installment : false;
            }
        }, {
            field: "accounts",
            name: "对公账户",
            prop: obj + "accounts",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];
                return data.accounts > 0 ? data.accounts : false;
            }
        }, {
            field: "advance",
            name: "预付款",
            prop: obj + "advance",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];
                return data.advance > 0 ? data.advance : false;
            }
        }, {
            field: "coupon",
            name: "优惠券",
            prop: obj + "coupon",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];

                if (data.coupon > 0) {
                    return data.coupon = paymentUtils.splitCoupon(data.coupon, data.couponInfo, payment4common.couponTypeData);
                } else {
                    return false;
                }
            }
        }, {
            field: "transfer",
            name: "预付款转换",
            prop: obj + "transfer",
            clazz: "blue",
            show: function(v) {

                var data = param == null ? v : v[param];
                return data.transfer > 0 ? data.transfer : false;
            }
        }];

        return linepropsCommonEnd;
    }

});
