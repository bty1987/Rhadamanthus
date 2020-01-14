/**
 * Created by Administrator on 2019/11/21.
 */
$(function () {
    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    printer = parent.printer;
    var params = {
        serverPath : window.server,
        authentication : parent.params.authentication,
        params : parent.params,
        amountInTotal:0,
        numberOfCases:0,
        designer:null,//设计师
        supervisor:null//监理
    };
    var trList = $("#refundsReslist");
    var querySalesItemBySid = api.sales.queryRefundsItemBySid;
    
    //初始化状态/结算状态
    com.post(api.ds.sales, {}, function(res){
        params.statues = res.statues.split("key", "value");
    }, null, false);

    com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId": params.params.data.orderId}, function(res){
        var decorationInfo = res.decoration;
        params.designer = decorationInfo.designer.currentName == null ? "" : decorationInfo.designer.currentName;
        params.supervisor = decorationInfo.supervisor.currentName == null ? "" : decorationInfo.supervisor.currentName;
    },null, false);
    
    printer.name = "salesPaymentForRefund";
    printer.args = {
        "orderId": params.params.data.orderId,
        "orderAddr": params.params.data.house.village.name + " " + params.params.data.house.houseNumber,
        "designer": params.designer,
        "supervisor": params.supervisor,
        "salesNo": params.params.data.no,
        "brand": params.params.data.brand,
        "createTime": params.params.data.createTime,
        "referMoney": utils.accAdd(params.params.data.depositpay,params.params.data.fullpay),
        "capitalize": utils.getCNMoney(utils.accAdd(params.params.data.depositpay,params.params.data.fullpay)),
        "salesItems": []
    };

    com.post(querySalesItemBySid, {'refunds.sid':params.params.data.sid}, function (data) {
        createList(data.refundsItems).appendTo(trList);
    },null, false);

    function createList(data) {
        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:40px;">主材代购退货单</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td1 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("装修单号").appendTo(tr1);
        var td2 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.orderId).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("楼盘地址").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.house.village.name + " " + params.params.data.house.houseNumber).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("设计师").appendTo(tr2);
        var td6 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.designer).appendTo(tr2);
        var td7 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("监理").appendTo(tr2);
        var td8 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.supervisor).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td9 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("销售单号").appendTo(tr3);
        var td10 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.no).appendTo(tr3);
        var td11 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("品牌").appendTo(tr3);
        var td12 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.brand).appendTo(tr3);

        var tr4 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("退货日期").appendTo(tr4);
        var td14 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.createTime).appendTo(tr4);
        var td15 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("类型").appendTo(tr4);
        var td16 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.type).appendTo(tr4);

        var tr6 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td17 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("商品名称").appendTo(tr6);
        var td18 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("规格").appendTo(tr6);
        var td19 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("数量").appendTo(tr6);
        var td20 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("售价").appendTo(tr6);
        var td21 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("总价").appendTo(tr6);

        var propertyArr = [];
        var total = 0;
        $.each(data, function (i, v) {
            
            if(v.rid != params.params.rid) return true;
            
            propertyArr.push([
                v.salesItem.goods.name,
                v.salesItem.format.info,
                v.num,
                v.salesItem.price,
                v.total
            ]);
            
            total = utils.accAdd(total, v.total);
            
            printer.args.salesItems.push({
                "name":v.salesItem.goods.name,
                "num":v.num,
                "price":v.salesItem.price,
                "total":v.total
            });

        });

        $.each(propertyArr, function (index, value) {
            var tr = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>');
            $.each(value, function (j, k) {
                var $td = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').html(k);
                $td.appendTo(tr);
            });
            tr.appendTo(table);
        });

        var tr8 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td25 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("退款金额").appendTo(tr8);
        var td26 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>').text(utils.changeThrDecimal(total)).appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td27 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("退款金额大写").appendTo(tr9);
        var td28 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>').text(utils.getCNMoney(utils.changeThrDecimal(total))).appendTo(tr9);

        var tr10 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td29 = $('<td colspan="3" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("客户退款银行:").appendTo(tr10);
        var td31 = $('<td colspan="2" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("银行卡号:").appendTo(tr10);

        var tr11 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td33 = $('<td colspan="3" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("开户行省份:").appendTo(tr11);
        var td35 = $('<td colspan="2" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("开户行城市:").appendTo(tr11);

        var tr12 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td37 = $('<td colspan="3" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("持卡人姓名:").appendTo(tr12);
        var td38 = $('<td colspan="2" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("开户行网点:").appendTo(tr12);

        var tr13 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td39 = $('<td colspan="3" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("持卡人电话:").appendTo(tr13);
        var td40 = $('<td colspan="2" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("客户确认:").appendTo(tr13);

        var tr14 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td41 = $('<td colspan="5" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("退款经手人:").appendTo(tr14);

        var tr15 = $('<tr style="border: 1px solid;height: 54px;"></tr>').appendTo(table);
        var td42 = $('<td colspan="5" style="border: 1px solid;height: 54px;padding-left:75px"></td>').text("备注: 客户打款在退款办理后7个工作日到账").appendTo(tr15);

        return div;
    }
});