
jQuery(function($) {
	
	var activityItem = {

		saveBtn: com.focusPage("#saveActivityItemBtn"),
		cancelBtn : com.focusPage("#cancelBtn"),

		modals: {
			activityItemModal : com.focusPage("#activityItemModal")
		},
		items : {
			activityName : com.focusPage("#activityNames"),
			activityItems : com.focusPage("#activityItems"),
			activityItemName : com.focusPage("#activityItemName"),
			moneyInfo : com.focusPage("#moneyInfo"),
		    name : com.focusPage("#awardStocksname"),
		    awardStockstype : com.focusPage("#awardStockstype"),
		    awardStockshide : com.focusPage("#awardStockshide"),
		    money : com.focusPage("#money")
		},
		activityItemPostData : {
			aid: params.aid,
			activityName: params.activityName
		}
	};

	activityItem.saveBtn.bindClick(saveData);
	activityItem.items.awardStockstype.change(changeAwardStock);

	com.post(api.ds.information, {"timestamp": new Date().getTime()}, function(res){
		activityItem.items.awardStockstype.bindData(res.activityItemType, "key", "value", true);
	}, null, false);

	activityItem.items.activityName.text(activityItem.activityItemPostData.activityName);

	com.post(api.information.queryActivityItemByAid, {"activity.aid": activityItem.activityItemPostData.aid}, function(res){

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
		}else if(_activityItem.type == 2){
			widgetHeader.addClass("header-color-orange");
			widgetHeaderH5.text("特殊劵");
		}else if(_activityItem.type == 3){
			widgetHeader.addClass("header-color-red");
			widgetHeaderH5.text("特殊物品");
		}

		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").attr("id", "activityItemName_" + _activityItem.aiid).text(_activityItem.name).appendTo(nameLi);
		var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
		var moneySpan = $("<span></span>").attr("id", "money_" + _activityItem.aiid).text(_activityItem.money).appendTo(moneyLi);

		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
		var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-trash").attr("id", "delete_" + _activityItem.aiid).appendTo(uiPgDiv);

		deleteBtn.on("click", function(){
			deleteActivityItem(_activityItem.aiid, _activityItem.name);
		});
	}

	com.focusPage("#addBtn").on("click", function(){

		activityItem.modals.activityItemModal.modal("show");

		activityItem.editFlag = false;
	});

	com.focusPage("#cancelBtn").on("click", function () {

		com.cleanItems(activityItem.activityItems);
		activityItem.items.awardStockshide.addClass("hide");
	});

	function saveData(){

		if(com.validate('form')){
			return false;
		}

		var options = {
			"activity.aid":activityItem.activityItemPostData.aid,
			"activityItem.asid":activityItem.items.name.val(),
			"activityItem.money":activityItem.items.money.val(),
			"activityItem.type":activityItem.items.awardStockstype.val(),
			"activityItem.activity":activityItem.activityItemPostData.activityName
		};
            com.cleanItems(activityItem.activityItems);
			activityItem.items.awardStockshide.addClass("hide");

		com.post(api.information.addActivityItem, options, function(res){
			com.showAlert(com.info, "操作成功");
			activityItem.items.money.val("")
			if(activityItem.editFlag){
				com.focusPage("#pricing_" + activityItem.activityItemPostData.aiid).remove();
			}
			
			addActivityItemForDiv(activityItem.items.activityItems, res.activityItem);

		});
		
		activityItem.modals.activityItemModal.modal("hide");
	}

	function changeAwardStock () {
		if(activityItem.items.awardStockstype.val()!=""){
			var awardStockstypes = activityItem.items.awardStockstype.val();
			awardStockstypes = awardStockstypes==2?0:(awardStockstypes==3?1:awardStockstypes);
			var options = {
				"awardStock.type": awardStockstypes,
				"awardStock.storeroom": params.type
			};
			activityItem.items.awardStockshide.removeClass("hide");
			com.post(api.information.queryAwardStockByType, options, function(res){

				activityItem.items.name.bindData(res.awardStocks, "asId", "name",true);
			});
		}
	}

	function deleteActivityItem(aiId, activityItemName){
		
		com.showConfirm("是否需要删除" + activityItemName + "活动物品?", function(result) {

			com.post(api.information.deleteActivityItemByAiid, {"activityItem.aiid": aiId}, function(res){
				com.showAlert(com.info, "操作成功");

				com.focusPage("#pricing_" + aiId).remove();
			});
		});
	}

});
