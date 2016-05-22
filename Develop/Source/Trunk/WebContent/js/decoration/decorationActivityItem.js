var decorationActivityItem = {
	items: {},
};

var decorationActivityItemPostData = {};

jQuery(function($) {
	
	decorationActivityItemPostData.decorationOrderId = decorationActivityPostData.decorationOrderId;
	
	decorationActivityItem.items.decorationActivityItems = $("#decorationActivityItems");
	decorationActivityItem.items.backBtn = $("#backBtn").on("click", function(){
		console.log("decorationActivityIndex");
		$("#decorationActivityItemPageContent").load(api.index.decorationActivityIndex.url);
	});
	
	decorationUtils.decorationActivityItemInfo(decorationActivityItem.items.decorationActivityItems, uiBtnMethod, decorationActivityItemPostData.decorationOrderId);
	
});

function uiBtnMethod(uiPgDiv, activityItem){
	
//	var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);
	
	var receiveBtn = $("<span></span>").addClass("ui-icon icon-bookmark").attr("id", "receive_" + activityItem.daiId).appendTo(uiPgDiv);

	if(activityItem.state == 0){
		if(activityItem.type == 1){
			receiveBtn.on("click", function(){
				receiveDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
			});
		}
	}
}

function receiveDecorationActivityItem(daiId, activityItemName){
	
	bootbox.confirm("是否确认领取" + activityItemName + "活动物品?", function(result) {
		if(result){
			
			var options = {
				"decorationActivityItem.daiId": daiId,
			}
			
			com.post(api.decoration.receiveDecorationActivityItem, options, function(res){
				
				var daiId = res.decorationActivityItem.daiId;
				
				$("#convert_" + daiId).unbind();
				$("#abate_" + daiId).unbind();
				$("#widgetHeader_" + daiId).addClass("header-color-orange");
			})
		}
	});
}