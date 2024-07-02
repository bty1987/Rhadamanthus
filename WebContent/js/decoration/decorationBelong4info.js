var decorationBelong = {

    belongType: null,
    orderId: null,
    belongStatus: null,

    orderBelongDesignInfos: null,
    orderBelongSalesmanInfos: null,
};

jQuery(function($) {

    com.focusPage('#fl-statement').statement("订单归属", "归属详细信息");

    decorationBelong.orderId = params.decoration.orderId;

    com.focusPage('#btnBack').on("click", function() {

        com.switchPage(api.index.decorationBelongIndex.url);
    });

    decorationUtils.initDecorationBelong(decorationBelong.orderId, 0);
    decorationUtils.initDecorationBelong(decorationBelong.orderId, 1);
});
