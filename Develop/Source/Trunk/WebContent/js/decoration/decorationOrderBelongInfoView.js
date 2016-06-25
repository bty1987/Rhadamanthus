var orderBelongInfo = {
	belongType:null,
	decorationOrderId:null,
	belongStatus:null,
	
	orderBelongDesignInfos:null,
	orderBelongSalesmanInfos:null,
};

jQuery(function($) {
	$('#fl-statement').statement("订单归属", "归属详细信息");
	
	orderBelongInfo.decorationOrderId = params.orderId;
	
	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.decorationOrderBelongIndex.url);
	});
	
	decorationUtils.initOrderBelongInfo(orderBelongInfo.decorationOrderId);
});
