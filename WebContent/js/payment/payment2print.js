jQuery(function($) {
    params = parent.params;
    com = parent.com;
    api = parent.api;
    utils = parent.utils;
    constant = parent.constant;

    var print = {
        decoration: params["printConf"].decoration,
        ptype: params["printConf"].ptype,
        rtype: params["printConf"].rtype,
        index: 1,
        projectAmount: 0,
        materialAmount: 0,
        refundAmount: 0
    };

    printHeader();
    printTable();
    printFoot();

    function printHeader() {
        var $table = $('<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0"></table>').appendTo($("#receiptList"));
        var $tbody = $('<tbody></tbody>').appendTo($table);
        var $tr1 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td1 = $('<td colspan="8" style="font-size: 20px" align="center"></td>').appendTo($tr1);
        var $b1 = $('<b>收款明细表</b>').appendTo($td1);
        var $tr2 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td2 = $('<td colspan="8" height="10"></td>').appendTo($tr2);
        var $tr3 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td31 = $('<td colspan="4" width="50%"></td>').html("客户姓名:" + print.decoration.customer.name).appendTo($tr3);
        var $td32 = $('<td colspan="4" width="50%"></td>').html("装修单号:" + print.decoration.orderId).appendTo($tr3);
        var $tr4 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td41 = $('<td colspan="4" width="50%"></td>').html("楼盘地址:" + print.decoration.house.village.name).appendTo($tr4);
        var $td42 = $('<td colspan="4" width="50%"></td>').html("设 计 师:" + print.decoration.designer.currentName).appendTo($tr4);
        var $tr5 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td5 = $('<td colspan="8" height="10"></td>').appendTo($tr5);
    }

    function printTable() {

        var $table = $('<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0"></table>').appendTo($("#receiptList"));
        var $tbody = $('<tbody></tbody>').appendTo($table);
        var $tr = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td1 = $('<td width="5%" align="center"></td>').appendTo($tr);
        var $str1 = $('<strong>序号</strong>').appendTo($td1);
        var $td2 = $('<td width="20%" align="center"></td>').appendTo($tr);
        var $str2 = $('<strong>收款类型</strong>').appendTo($td2);
        var $td3 = $('<td width="10%" align="center"></td>').appendTo($tr);
        var $str3 = $('<strong>收款金额</strong>').appendTo($td3);
        var $td4 = $('<td width="10%" align="center"></td>').appendTo($tr);
        var $str4 = $('<strong>结算方式</strong>').appendTo($td4);
        var $td5 = $('<td width="20%" align="center"></td>').appendTo($tr);
        var $str5 = $('<strong>收款时间</strong>').appendTo($td5);

        print.ptype.contains("0") ? queryAdvance($tbody) : "";
        print.ptype.contains("1") ? queryDecoration($tbody) : "";
        print.ptype.contains("3") ? querySales($tbody) : "";
        print.ptype.contains("4") ? queryService($tbody) : "";
    }

    function printFoot () {
        var $table = $('<table style="font-size: 14px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0"></table>').appendTo($("#receiptList"));
        var $tbody = $('<tbody></tbody>').appendTo($table);

        var $tr6 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td6 = $('<td width="100%"></td>').appendTo($tr6);
        var $str6 = $('<strong></strong>').html("工程收款总额: ￥" + print.projectAmount).appendTo($td6);

        var $tr7 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td7 = $('<td width="100%"></td>').appendTo($tr7);
        var $str7 = $('<strong></strong>').html("主材收款总额: ￥" + print.materialAmount).appendTo($td7);

        var $tr8 = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td8 = $('<td width="100%"></td>').appendTo($tr8);
        var $str8 = $('<strong></strong>').html("退款总额: ￥" + print.refundAmount).appendTo($td8);
    }

    function queryAdvance($tbody) {
        var options = {
            "paging.noPage": 1,
            "filters[0].field": "decoration.orderId",
            "filters[0].data": print.decoration.orderId,
            "filters[0].op": "eq",
            "filters[1].field": "status",
            "filters[1].data": 0,
            "filters[1].op": "ne"
        };

        com.post(api.payment.pagePayment, options, function(res) {
            var payments = res.paging.data;

            $.each(payments, function(i, v) {
                var type = v.type;
                v["type"] = constant.payment().advancePayment.paymentType.keys[v.paymentType] + " " + constant.payment().advancePayment.type.keys[v.type];
                drawPaymentLine(v, $tbody, function (money) {
                    if (v.paymentType == 0 && type == 1) print.projectAmount = utils.accAdd(print.projectAmount, money); //合同预付款收款
                    if (v.paymentType == 2 && type == 1) print.materialAmount = utils.accAdd(print.materialAmount, money); //主材预付款收款
                    if (type == 0) print.refundAmount = utils.accAdd(print.refundAmount, money); //预付款退款
                });
            });
        }, null, false)
    }

    function queryDecoration($tbody) {
        var options = {
            "paging.noPage": 1,
            "filters[0].field": "decoration.orderId",
            "filters[0].data": print.decoration.orderId,
            "filters[0].op": "eq"
        };

        com.post(api.payment.pageDecorationPayment, options, function(res) {
            var decorationPayments = res.paging.data;

            $.each(decorationPayments, function(i, v) {
                if (v.paymentStatus == 1 || v.paymentStatus == 2 || v.paymentStatus == 4) {
                    v["type"] = v.paymentType;
                    drawPaymentLine(v, $tbody, function (money) {
                        if (v.oneType == 0) print.projectAmount = utils.accAdd(print.projectAmount, money); //收款
                        if (v.oneType == 1) print.refundAmount = utils.accAdd(print.refundAmount, money); //退款
                    });
                }
            });
        }, null, false)
    }

    function querySales($tbody) {
        var srid = [];
        var options = {
            "paging.noPage": 1,
            "filters[0].field": "sales.orderId",
            "filters[0].data": print.decoration.orderId,
            "filters[0].op": "eq",
            "filters[1].field": "status",
            "filters[1].data": 0,
            "filters[1].op": "ne"
        };

        com.post(api.payment.pageSalesPayment, options, function(res) {
            var salsePayments = res.paging.data;

            $.each(salsePayments, function(i, v) {
                if (srid.indexOf(v.salesReceipt.srId) == -1) {
                    srid.push(v.salesReceipt.srId);

                    v.salesReceipt["type"] = constant.payment().materialPayment.paymentType.keys[v.type] + "-" + v.sales.brand;
                    drawPaymentLine(v.salesReceipt, $tbody, function (money) {
                        if ([2, 3, 8].indexOf(v.type) > -1) print.materialAmount = utils.accAdd(print.materialAmount, money); //收款
                        if ([4, 5, 6, 7].indexOf(v.type) > -1) print.refundAmount = utils.accAdd(print.refundAmount, money);//退款
                    });
                }
            });
        }, null, false)
    }

    function queryService($tbody) {
        var options = {
            "paging.noPage": 1,
            "filters[0].field": "decoration.orderId",
            "filters[0].data": print.decoration.orderId,
            "filters[0].op": "eq",
            "filters[1].field": "status",
            "filters[1].data": 0,
            "filters[1].op": "ne"
        };

        com.post(api.payment.pageServicePayment, options, function(res) {
            var servicePayments = res.paging.data;

            $.each(servicePayments, function(i, v) {
                v.serviceReceipt["type"] = "服务费" + " " + constant.payment().servicePayment.type.keys[v.type];
                drawPaymentLine(v.serviceReceipt, $tbody, function (money) {
                    if (v.type == 0) print.projectAmount = utils.accAdd(print.projectAmount, money); //收款
                    if (v.type == 1) print.refundAmount = utils.accAdd(print.refundAmount, money); //退款
                });
            });
        }, null, false)
    }

    function drawPaymentLine(payment, $tbody, func) {
        var options = {
            "type": payment.type,
            "collectTime": payment.collectTime
        };

        if (payment.cash > 0 && print.rtype.contains("1")) {

            options["money"] = payment.cash;
            options["receiptType"] = "现金";

           drawLine(options, $tbody);
           func(payment.cash);
        }

        if (payment.bank > 0 && print.rtype.contains("2")) {

            if (payment.bankInfo.indexOf("#") != -1) {
                var _s = payment.bankInfo.split('#');

                options["type"] = payment.type;
                options["receiptType"] = "刷卡";

                for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                    var _i = _s[i].split('|');

                    options["money"] = _i[1];
                    options["collectTime"] = _i[2];

                    drawLine(options, $tbody);
                    func(_i[1]);

                }
            } else {
                options["money"] = payment.bank;

                drawLine(options, $tbody);
                func(payment.bank)
            }
        }

        if (payment.checkv > 0 && print.rtype.contains("3")) {
            if (payment.checkvBank.indexOf("#") != -1) {
                var _s = payment.checkvBank.split('#');

                options["type"] = payment.type;
                options["receiptType"] = "银行";

                for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                    var _i = _s[i].split('|');

                    options["money"] = _i[1];
                    options["collectTime"] = _i[2];

                    drawLine(options, $tbody);
                    func(_i[1]);

                }
            } else {
                options["money"] = payment.checkv;

                drawLine(options, $tbody);
                func(payment.checkv)
            }
        }

        if (payment.advance > 0 && print.rtype.contains("4")) {
            options["money"] = payment.advance;
            options["receiptType"] = "预付款";

            drawLine(options, $tbody);
        }

        if (payment.coupon > 0 && print.rtype.contains("5")) {

            options["receiptType"] = "优惠券";

            var _s = payment.couponInfo.split('#');

            for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                var _i = _s[i].split(':');

                options["money"] = _i[1];

                drawLine(options, $tbody);
            }
        }
    }

    function drawLine(data, $tbody) {
        var $tr = $('<tr bgcolor="#FFFFFF"></tr>').appendTo($tbody);
        var $td1 = $('<td width="5%" align="center">' + print.index + '</td>').appendTo($tr);
        var $td2 = $('<td width="20%" align="center">' + data.type + '</td>').appendTo($tr);
        var $td3 = $('<td width="10%" align="center">' + data.money + '</td>').appendTo($tr);
        var $td4 = $('<td width="10%" align="center">' + data.receiptType + '</td>').appendTo($tr);
        var $td5 = $('<td width="20%" align="center">' + data.collectTime + '</td>').appendTo($tr);

        print.index++;
    }
});
