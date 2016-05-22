
var Charge = (function(){

    var basicConf = {
        serverHost : config.serverHost,
        orderId : "",
        param: {
            "authentication" : ""
        },
        utils : {
            materialPaymentType : {},
            materialPaymentStatus : {}
        },
        apis : [
            {
                "url" : "queryDecorationPaymentByOrderId.do",
                "idName" : "decorationPayment.orderId",
                "resName" : "decorationPayments",
                "useUtils" : false,
                "isAdvance" : false
            },
            {
                "url" : "queryMaterialPaymentByOrderId.do",
                "idName" : "materialPayment.orderId",
                "resName" : "materialPayments",
                "useUtils" : true,
                "isAdvance" : false
            },
            {
                "url" : "queryPaymentByOrderId.do",
                "idName" : "payment.orderId",
                "resName" : "payments",
                "useUtils" : false,
                "isAdvance" : true
            },

        ],
        setUtils : function(){
            var that = this;
            $.ajax({
                type: 'GET',
                url: basicConf.serverHost + "/ds/materialInfo.json",
                data: {},
                dataType : "json",
                async: false,
                success: function(res){

                    $.each(res.materialPaymentType, function(i, v){
                        that.utils.materialPaymentType [v.key] = v.value;
                    });
                    $.each(res.materialPaymentStatus, function(i, v){
                        that.utils.materialPaymentStatus [v.key] = v.value;
                    });
                },error: function (xhr, errorType, error) {
                    $.alert("错误" + error + errorType);
                }

            });
        }
    };

    var charge = {

        getPayments : function(){
            $.each(basicConf.apis, function(i, v){

                var _params = {};
                _params[v.idName] = basicConf.orderId;

                $.ajax({
                    type: 'POST',
                    url: basicConf.serverHost + v.url,
                    data: $.extend(true, {}, basicConf.param, _params),
                    dataType : "json",
                    success: function(res){

                        var $list = $( '.list-block.cards-list' , '#tab'+ (i+1));
                        res[v.resName].length ? $.each(res[v.resName], function(index, value){
                            var $card = painter.getCard(value, v.useUtils, v.isAdvance);
                            $list.append($card);
                        }) : $list.append('<div style="text-align:center;color:#aeaeae;">未找到信息</div>');
                    },error: function (xhr, errorType, error) {
                        $.alert("错误" + error + errorType);
                    }

                });
            });
        }

    };



    var painter = {
        //返回一个显示款项信息的card
        getCard : function(v, useUtils, isAdvance){



            var $card = $('<div></div>').addClass('card');
            var $cardHeader = $('<div></div>').addClass('card-header').html(useUtils ? basicConf.utils.materialPaymentType[v.paymentType] :  v.paymentType);
            var $cardFooter = $('<div></div>').addClass('card-footer').html("收款时间：" + v.collectTime);
            var $cardContent = $('<div></div>').addClass('card-content');
            var $contentWraper = $('<div></div>').addClass('card-content-inner list-block');
            var $item = $('<div></div>').addClass('item-content');
            var $itemInner = $('<div></div>').addClass('item-inner');
            var $itemTitle = $('<div></div>').addClass('item-title');
            var $itemAfter = $('<div></div>').addClass('item-after');
            var $item1, $item2, $item3;
            $itemInner.append($itemTitle).append($itemAfter).appendTo($item);
            $item1 = $item.clone(true);
            $item1.find('.item-title').html("应收金额");
            $item1.find('.item-after').html(isAdvance ? v.recharge : v.referMoney);
            $item2 = $item.clone(true);
            $item2.find('.item-title').html("实收金额");
            $item2.find('.item-after').html(v.realMoney);
            $item3 = $item.clone(true);
            $item3.find('.item-title').html("款项状态");
            $item3.find('.item-after').html(useUtils ? basicConf.utils.materialPaymentStatus[v.paymentStatus] : isAdvance ? v.status : v.paymentStatus);

            $contentWraper.append($item1).append($item2).append($item3).appendTo($cardContent);
            $card.append($cardHeader).append($cardContent);
            v.collectTime && $card.append($cardFooter);
            return $card;
        }
    };

    return {
        init : function(){
            var _params = utils.getUrlParams();
            basicConf.param.authentication = _params.authentication;
            basicConf.orderId = _params.orderid;
            basicConf.setUtils();
            charge.getPayments();
        }
    };
})();


$(function(){
    Charge.init();
});