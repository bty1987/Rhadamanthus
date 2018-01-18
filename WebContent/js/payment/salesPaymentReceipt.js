
var receipt = {
    pageCount:5,
    tableList:[],
    args:null,

    paymentTypeData: {},
    advanceTypeData: {"0":"-"},

    commonInfo: {},
    paymentItems: [],
    receiptItems: [],
};

jQuery(function($) {

    var params = {};
    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    $ = parent.$;

    params.serverPath = window.server;
    params.authentication = parent.params.authentication;
    params = parent.params;

    var querySalesPaymentForNotInitBySrId = api.payment.querySalesPaymentForNotInitBySrId;

    com.post(api.ds.payment, {}, function(res){
        $("#advanceType").bindData(res.advanceTypeForSalesMaterial, 'key', 'value');

        for(var i=0;i<res.advanceTypeForSalesMaterial.length;i++){
            var type = res.advanceTypeForSalesMaterial[i];
            receipt.advanceTypeData[type.key] = type.value;
        }

        for(var i=0;i<res.materialPaymentType.length;i++){
            var paymentType = res.materialPaymentType[i];
            receipt.paymentTypeData[paymentType.key] = paymentType.value;
        }

    }, null, false);

    com.post(querySalesPaymentForNotInitBySrId, {"salesReceipt.srId":params.salesReceiptSrId}, function(res){

        var salesPayments = res.salesPayments;

        var commonInfo = {};

        var paymentItems = [];
        var salesBrand = "";
        var salesPaymentDes = "";

        for(var i=0;i<salesPayments.length;i++){

            var salesPayment = salesPayments[i];
            salesBrand = salesPayment.sales.brand;

            commonInfo["orderId"] = salesPayment.sales.orderId;
            commonInfo["no"] = salesPayment.sales.no;
            commonInfo["orderAddr"] = salesPayment.sales.house.village.name + " " + salesPayment.sales.house.houseNumber;
            commonInfo["customerName"] = salesPayment.sales.customer.name;
            commonInfo["salesmanName"] = salesPayment.sales.salesman.currentName;
            commonInfo["departmentName"] = salesPayment.sales.dept.deptName;

            commonInfo["collectUserName"] = salesPayment.salesReceipt.collecterName;
            commonInfo["collectTime"] = salesPayment.salesReceipt.collectTime;

            receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[salesPayment.type], "money": salesPayment.referMoney, "salesBrand": salesBrand});

        }

        if(salesPayment.salesReceipt.comment && salesPayment.salesReceipt.comment != ""){
            salesPaymentDes = salesPayment.salesReceipt.comment
        }

        commonInfo["salesPaymentDes"] = salesPaymentDes;

        receipt.commonInfo = commonInfo;

    }, null ,false);

    var querysalesReceiptBySrId = api.payment.querySalesReceiptBySrId;

    com.post(querysalesReceiptBySrId, {"salesReceipt.srId":params.salesReceiptSrId}, function(res){

        var salesReceipt = res.salesReceipt;

        receipt.salesReceipt = res.salesReceipt;

        if(parseFloat(salesReceipt.cash) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.cash),
                "paymentWay":"现金",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.bank) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.bank),
                "paymentWay":"刷卡",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.checkv) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.checkv),
                "paymentWay":"转账",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.installment) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.installment),
                "paymentWay":"分期",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.accounts) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.accounts),
                "paymentWay":"对公账户",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.coupon) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.coupon),
                "paymentWay":"优惠券",
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.advance) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.advance),
                "paymentWay":receipt.advanceTypeData[salesReceipt.advanceType] + " 预付款",
            };
            receipt.receiptItems.push(tem);
        }

    }, null, false);

    if(receipt.paymentItems.length > 0){
        createReceiptTable();
    }

});

function createReceiptTable(){

    var commonInfo = receipt.commonInfo;
    var paymentItems = receipt.paymentItems;
    var receiptItems = receipt.receiptItems;

    var srId = parent.params.salesReceiptSrId;
    var noInit = "000000000000"+srId;

    var no = noInit.substring(srId.length, noInit.length);


    var center = $("<center></center>").appendTo("#salesPaymentReceipt");

    var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
    var noTr = $('<tr></tr>').appendTo(noTable);
    var noTd = $('<td colspan="4" style="text-align: right;padding-right: 10px;font-family: 微软雅黑;"></td>').html("NO:"+no).appendTo(noTr);

    var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
    var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
    var headReceiptTd = $('<td colspan="4"></td>').appendTo(headReceiptTr);
    var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
    var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收据").appendTo(headReceiptDiv);

    var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
    var noReceiptTd = $('<td style="width: 15%"></td>').text('订单编号: ' + commonInfo["orderId"]).appendTo(orderReceiptTr);
    var customerReceiptTd = $('<td style="width: 20%"></td>').text('客户名: ' + commonInfo["customerName"]).appendTo(orderReceiptTr);
    var designerReceiptTd = $('<td style="width: 35%"></td>').text('设计师: ' + commonInfo["salesmanName"] + "-" + commonInfo["departmentName"]).appendTo(orderReceiptTr);
    var supervisorNameTd = $('<td style="width: 30%"></td>').text('监 理: ' + " " + "-" + " ").appendTo(orderReceiptTr);

    var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
    var timeReceiptTd = $('<td colspan="2" style="width: 25%"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);
    var addrReceiptTd = $('<td colspan="2"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(presonReceiptTr);

    var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);

    var balancePaymentTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (paymentItems.length+1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
    var typePaymentTd = $('<td style="width: 20%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
    var typePaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
    var amountPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

    var total = 0;

    for(var j=0;j<paymentItems.length;j++){

        var paymentItem = paymentItems[j];

        var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
        var typeInfoPaymentTd = $('<td style="width: 20%; text-align: center;"></td>').text(paymentItem["salesBrand"]).appendTo(receInfoPaymentTr);
        var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
        var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
    }

    var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);

    var balanceReceiptTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (receiptItems.length+1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
    var typeReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
    var amountReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

    for(var i=0;i<receiptItems.length;i++){

        var receiptItem = receiptItems[i];

        var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
        var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);

        if(receiptItem["paymentWay"].indexOf("预付款") == -1){
            total += parseFloat(receiptItem["money"]);
        }
    }

    var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
    var renReceiptTd = $('<td colspan="2"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
    var renMoneyReceiptTd = $('<td colspan="2"></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);

    var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);;
    var summaryReceiptTd = $('<td colspan="4"></td>').appendTo(summaryReceiptTr);
    var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
    var receReceiptSpan = $('<span></span>').text('收款人:' + receipt.salesReceipt.collecter.currentName).appendTo(summaryReceiptDiv);
    var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);

    var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
    var paymentDesTd = $('<td colspan="4"></td>').text('备注: ' + commonInfo["salesPaymentDes"]).appendTo(addrReceiptTr);

}
