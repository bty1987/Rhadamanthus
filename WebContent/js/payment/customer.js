jQuery(function ($) {
    var customerPayment = {
        orderId: com.focusPage("#orderId", "#paymentCustomer"),
        items: {
            orderNumber: com.focusPage("#orderNumber", "#paymentCustomer"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#paymentCustomer"),
            collectDes: com.focusPage("#collectDes", "#paymentCustomer"),
            posDiv: com.focusPage("#posDiv", "#paymentCustomer"),
            posGroup: com.focusPage("#posGroup", "#paymentCustomer"),
            bankDiv: com.focusPage("#bankDiv", "#paymentCustomer"),
            bankGroup: com.focusPage("#bankGroup", "#paymentCustomer"),
            bankName: com.focusPage("#bankName", "#paymentCustomer"),
            bank: com.focusPage("#bank", "#paymentCustomer"),
            posway: com.focusPage("#posway", "#paymentCustomer")
        },

        btns: {
            selectBtn: com.focusPage("#selectBtn", "#paymentCustomer").click(query),
            resetBtn: com.focusPage("#resetBtn", "#paymentCustomer").click(reset),
            collectBtn: com.focusPage("#collectBtn", "#paymentCustomer").click(showCollectModel),
            creatPaytran: com.focusPage("#creatPaytran", "#paymentCustomer"),
            collectMoney: com.focusPage("#collect", "#paymentCustomer").click(collectMoney)

        },

        modals: {
            collectModal: com.focusPage("#collectModal", "#paymentCustomer")
        },

        bankUtil: [],
        posValues: {},

        pageConfig: {},
        salesPaymentTypeData: constant.payment.materialPayment.paymentType.keys,
        count: 0,
        typeNo: 6,
        atttype: 0
    };

    customerPayment.items.posway.bindData(constant.payment.receiptType.posway.datas, "key", "value");

    com.post(api.data.queryReceiptTypeByType, {"receiptType.type": 2}, function(res){
        $.each(res.receiptTypes, function(i, v){
            customerPayment.posValues[v.no] = v;
            customerPayment.bankUtil.push({"key": v.no, "value": v.name});
        });
        com.selectTypeahead("#bankName", customerPayment.bankUtil, "key", "value", null);
    });

    com.focusPage("#collectModal :checkbox", "#paymentCustomer").on("change", function(){
        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#paymentCustomer");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    //pos推送
    customerPayment.btns.creatPaytran.unbind().click(function(){
        paymentUtils.pushPos(customerPayment, customerPayment.items.orderNumber.val());
        return false;
    });

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v, tableId);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v, tableId) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(tableId == "advance" ? "预付款" : tableId == "decoration" ? v.paymentType : customerPayment.salesPaymentTypeData[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = paymentUtils.getPropertyArr(customerPayment, v, tableId == "advance" ? v.decoration : v[tableId], []);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

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

    function getAllData() {

        customerPayment.count = 0;
        com.focusPage("#noDataDiv").addClass("hide");

        var decorationOption = {
            "decorationPayment.decoration.orderId": customerPayment.orderId.val(),
            "decorationPayment.paymentStatus": 0,
            "decorationPayment.oneType": 0
        };

        com.post(api.payment.queryDecorationPaymentByOrderId, decorationOption, function (res) {
            customerPayment.pageConfig.propertyArr = [];
            customerPayment.pageConfig.propertyArr = ["orderId", "customerName", "address", "designerName", "designDepartment", "grade", "referMoney"];
            displayFunc.init('decoration', res.decorationPayments);
            customerPayment.count += res.decorationPayments.length;
        }, null, false);

        var salesOption = {
            "salesPayment.sales.orderId": customerPayment.orderId.val(),
            "salesPayment.status": 0
        };

        com.post(api.payment.querySalesPaymentByOrderId, salesOption, function (res) {
            customerPayment.pageConfig.propertyArr = [];
            customerPayment.pageConfig.propertyArr = ["orderId", "salesNo", "customerName", "address", "salesGrade", "brand", "operator", "referMoney"];
            displayFunc.init('sales', res.salesPayments);
            customerPayment.count += res.salesPayments.length;
        }, null, false);

        var advanceOption = {
            "paging.noPage": 1,
            "filters[0].data": customerPayment.orderId.val(),
            "filters[0].field": "orderId",
            "filters[0].op": "eq"
        };

        com.post(api.payment.pageAdvancePayment, advanceOption, function (res) {
            customerPayment.pageConfig.propertyArr = [];
            customerPayment.pageConfig.propertyArr = ["orderId", "customerName", "address", "designerName", "grade", "contractBalance", "projectBalance", "materialBalance", "zhenglinBalance"];
            displayFunc.init('advance', res.paging.data);
            customerPayment.count += res.paging.data.length;
        }, null, false);

        if (customerPayment.count == 0) {
            com.focusPage("#noDataDiv").removeClass("hide");
        }
    }

    function query(){
        if (customerPayment.orderId.val() == "") {
            return;
        }
        getAllData();
    }

    function reset(){
        customerPayment.orderId.val("");
    }

    function showCollectModel(){
        com.cleanItems(customerPayment.items);
        customerPayment.modals.collectModal.modal("show");
    }

    function collectMoney(){
        if (com.validate("collectModal")) return false;
    }

});

