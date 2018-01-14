var decorationBelong = {
	belongType:null,
	decorationOrderId:null,
	belongStatus:null,
	
	orderBelongDesignInfos:null,
	orderBelongSalesmanInfos:null,
};

jQuery(function($) {
	$('#fl-statement').statement("订单归属", "归属详细信息");
	
	decorationBelong.decorationOrderId = params.orderId;
	
	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.decorationOrderBelongIndex.url);
	});
	
	decorationUtils.initDecorationBelong(decorationBelong.decorationOrderId);
});
