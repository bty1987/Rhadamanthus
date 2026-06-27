var materialSubOrderCollectionPostData = {};

jQuery(function($) {

    com.focusPage('#fl-statement').statement("主材子订单", "收款信息");

    var materialSubOrderCollection = {

        bankType: {},
        couponType: {},
        accountsType: {},

        saveBtn: null,
        cancelBtn: null,

        baseModal: null,
        addOrReduceModal: null,
        refundModal: null,
        materialSubOrderCollectionItems: {},

        editFlg: false,
        historyFlag: false,
        batchFlag: true,

        queryUrl: null,
        queryMpid: null,
        paymentType: null,
        flag: null,
    };

    materialSubOrderCollectionPostData["materialPayment.material.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
    materialSubOrderCollection.queryMpid = materialSubOrderPostData["materialSubOrderPostBalance.mpId"];
    materialSubOrderCollection.paymentType = materialSubOrderPostData["materialSubOrderPostBalance.type"];
    materialSubOrderCollection.flag = materialSubOrderPostData["flag"];

    com.post(api.data.queryReceiptType, {}, function(res) {

        materialSubOrderCollection.cash = [];
        materialSubOrderCollection.bank = [];
        materialSubOrderCollection.checkBank = [];
        materialSubOrderCollection.accounts = [];
        materialSubOrderCollection.couponType = [];

        materialSubOrderCollection.bankInfo = {};

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == 1) {
                materialSubOrderCollection.cash.push(v);
            } else if (v.type == 2) {
                materialSubOrderCollection.bank.push(v);
                materialSubOrderCollection.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                materialSubOrderCollection.checkBank.push(v);
            } else if (v.type == 4) {
                materialSubOrderCollection.accounts.push(v);
            } else if (v.type == 5) {
                materialSubOrderCollection.couponType.push(v);
            }
        });

        com.focusPage("#bankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#checkvBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#installmentBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#accountsBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#refundBankName").bindData(materialSubOrderCollection.bank, 'no', 'value');
        com.focusPage("#accountsBankName").bindData(materialSubOrderCollection.accounts, 'no', 'value');
        com.focusPage("#couponType").bindData(materialSubOrderCollection.couponType, 'no', 'value');
    }, null, false);

    var lineprops = (function() {

        var rowShow = function(v) {
            return materialSubOrderCollection.paymentType == 0 || materialSubOrderCollection.flag == true || materialSubOrderCollection.queryMpid == v.mpId;
        };

        return [{
            field: "material.no",
            name: "主材单号",
            prop: "material.no",
            clazz: "blue",
            show: rowShow
        }, {
            field: "category",
            name: "品类",
            prop: "category",
            clazz: "grey",
            show: rowShow
        }, {
            field: "brand",
            name: "品牌",
            prop: "brand",
            clazz: "grey",
            show: rowShow
        }, {
            field: "referMoney",
            name: "应收额",
            prop: "referMoney",
            clazz: "blue",
            show: rowShow
        }, {
            field: "referMoney",
            name: "实收额",
            prop: "referMoney",
            clazz: "blue",
            show: rowShow
        }, {
            field: "collectTime",
            name: "收款时间",
            prop: "collectTime",
            clazz: "green",
            show: rowShow
        }, {
            field: "paymentStatus",
            name: "状态",
            prop: function(v) { return v.paymentStatus == 0 ? '待收款' : v.paymentStatus == 1 ? '待确认' : '已确认'; },
            clazz: "red",
            show: rowShow
        }, {
            type: "newline"
        }, {
            field: "cash",
            name: "现金",
            prop: "cash",
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.cash != null && v.cash != "0"; }
        }, {
            field: "bank",
            name: "银行",
            prop: function(v) {
                var info = v.bank + ", ";
                var _s = v.bankInfo.split('#');
                for (var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += materialSubOrderCollection.bankInfo[_i[0]] + " " + _i[1] + ", ";
                }
                return info;
            },
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.bank != null && v.bank != "0"; }
        }, {
            field: "checkv",
            name: "转账",
            prop: "checkv",
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.checkv != null && v.checkv != "0"; }
        }, {
            field: "installment",
            name: "分期",
            prop: "installment",
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.installment != null && v.installment != "0"; }
        }, {
            field: "accounts",
            name: "对公帐户",
            prop: "accounts",
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.accounts != null && v.accounts != "0"; }
        }, {
            field: "advance",
            name: "预付款",
            prop: "advance",
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.advance != null && v.advance != "0"; }
        }, {
            field: "coupon",
            name: "优惠券",
            prop: function(v) { return v.coupon + v.couponInfo.split('#').join(' '); },
            clazz: "blue",
            show: function(v) { return rowShow(v) && v.coupon != null && v.coupon != "0"; }
        }];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.payment.queryMaterialPaymentByMid, materialSubOrderCollectionPostData, [], null, "materialPayments", true, null);
    searcher.line(function(v) { return constant.payment().materialPayment.paymentType.keys[v.paymentType]; }, lineprops, {}).render();

    com.focusPage('#back').click(function() {

        com.switchPage(params.historyPage);
    });

});
