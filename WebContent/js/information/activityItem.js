
jQuery(function($) {
	
	var activityItem = {
		activityType: null,
		items:{},
	}
	
	var activityItemPostData = {};
	
	activityItemPostData.aid = params.aid;
	activityItemPostData.activityName = params.activityName;
	
	com.post(api.ds.information, {"timestamp": new Date().getTime()}, function(res){
		activityItem.activityItemType = res.activityItemType;
	}, null, false);
	
	activityItem.items.activityName = $("#activityName");
	activityItem.items.activityItems = $("#activityItems");
	activityItem.items.type = $("#type").bindData(activityItem.activityItemType, "key", "value").change(function(){
		var $this = $(this);
			activityItem.items.moneyInfo.css("display", "block");
	});
	
	activityItem.items.activityItemName = $("#activityItemName");
	activityItem.items.money = $("#money");
	activityItem.items.moneyInfo = $("#moneyInfo");
	activityItem.items.activityItemModal = $("#activityItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	activityItem.items.addBtn = $("#addBtn").on("click", function(){
		activityItem.items.activityItemModal.modal("show");
		
		activityItem.items.moneyInfo.css("display", "none");
		
		activityItem.items.activityItemName.val("");
		activityItem.items.type.val("");
		activityItem.items.money.val(0);
		
		activityItem.editFlag = false;
	});
	
	activityItem.items.backBtn = $("#backBtn").on("click", function(){
		$("#activityPageContent").load(api.index.activityIndex.url);
	});
	
	activityItem.items.saveBtn = $("#saveBtn").on("click", saveData);
	
	activityItem.items.activityName.text(activityItemPostData.activityName);
	
	var options = {
		"activity.aid": activityItemPostData.aid,
	}
	
	com.post(api.information.queryActivityItemByAId, options, function(res){
		var activityItems = res.activityItems;
		
		for(var i=0;i<activityItems.length;i++){
			var _activityItem = activityItems[i];
			
			addActivityItemForDiv(activityItem.items.activityItems, _activityItem);
		}
	});
	
	function addActivityItemForDiv(_activityItems, _activityItem){
		
		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "pricing_" + _activityItem.aiid).prependTo(_activityItems);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);
		
		var widgetHeader = $("<div></div>").addClass("widget-header").appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);
		
		if(_activityItem.type == 0){
			widgetHeader.addClass("header-color-blue");
			widgetHeaderH5.text("券");
		}else if(_activityItem.type == 1){
			widgetHeader.addClass("header-color-green");
			widgetHeaderH5.text("物品");
		}
		
		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").attr("id", "activityItemName_" + _activityItem.aiid).text(_activityItem.name).appendTo(nameLi);
		var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
		var moneySpan = $("<span></span>").attr("id", "money_" + _activityItem.aiid).text(_activityItem.money).appendTo(moneyLi);
		
		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
		var editBtn = $("<span></span>").addClass("ui-icon icon-pencil blue").attr("id", "edit_" + _activityItem.aiid).appendTo(uiPgDiv);
		var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-trash").attr("id", "delete_" + _activityItem.aiid).appendTo(uiPgDiv);
		
		editBtn.on("click", function(){
			updateActivityItem(_activityItem.aid, _activityItem.aiid, _activityItem.name, _activityItem.type, _activityItem.money);
		});
		
		deleteBtn.on("click", function(){
			deleteActivityItem(_activityItem.aiid, _activityItem.name);
		})
	}

	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url = "";
		var options = {
			"activity.aid": activityItemPostData.aid,
			"activityItem.activityName": activityItemPostData.activityName,
			"activityItem.name": activityItem.items.activityItemName.val(),
			"activityItem.type": activityItem.items.type.val(),
			"activityItem.money": activityItem.items.money.val()
		}

		if(activityItem.editFlag){
			url = api.information.updateActivityItem;
			options["activityItem.aiid"] = activityItemPostData.aiid;
		}else{
			url = api.information.addActivityItem;
		}
		
		com.post(url, options, function(res){
			com.showAlert(com.info, "操作成功");
			
			if(activityItem.editFlag){
				$("#pricing_" + activityItemPostData.aiid).remove();
			}
			
			addActivityItemForDiv(activityItem.items.activityItems, res.activityItem);
		});
		
		activityItem.items.activityItemModal.modal("hide");
	}

	function updateActivityItem(aid, aiId, activityItemName, type, money){
		
		activityItem.items.activityItemName.val(activityItemName);
		activityItem.items.type.val(type);
		
			activityItem.items.moneyInfo.css("display", "block").val(money);
			activityItem.items.money.val(money);
		
		activityItemPostData.aiid = aiId;
		
		activityItem.editFlag = true;
		
		activityItem.items.activityItemModal.modal("show");
	}

	function deleteActivityItem(aiId, activityItemName){
		
		bootbox.confirm("是否需要删除" + activityItemName + "活动物品?", function(result) {
			if(result){
				
				var options = {
					"activityItem.aiid": aiId,
				}
				
				com.post(api.information.deleteActivityItemByAiId, options, function(res){
					com.showAlert(com.info, "操作成功");
					
					$("#pricing_" + aiId).remove();
				})
			}
		});
	}
	
});
