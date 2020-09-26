var decorationBelong = {
	belongType:null,
	decorationOrderId:null,
	belongStatus:null,
	
	orderBelongDesignInfos:null,
	orderBelongSalesmanInfos:null,
};

jQuery(function($) {
	com.focusPage('#fl-statement').statement("订单归属", "归属详细信息");
	
	decorationBelong.decorationOrderId = params.orderId;
	
	com.focusPage('#btnBack').on("click", function(){
		//com.switchPage(api.index.decorationBelongIndex.url);
	});
	
	decorationUtils.initDecorationBelong(decorationBelong.decorationOrderId);
});
