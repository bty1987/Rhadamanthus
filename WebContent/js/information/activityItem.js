
jQuery(function($) {
	
	var activityItem = {
		activityType: null,
		items:{}
	};
	
	var activityItemPostData = {};
	
	activityItemPostData.aid = params.aid;

	activityItemPostData.activityName = params.activityName;
	
	com.post(api.ds.information, {"timestamp": new Date().getTime()}, function(res){
	}, null, false);

	activityItem.items.activityName = com.focusPage("#activityName");
	activityItem.items.activityItems = com.focusPage("#activityItems");
	activityItem.items.activityItemName = com.focusPage("#activityItemName");
	activityItem.items.moneyInfo = com.focusPage("#moneyInfo");
    activityItem.items.name = com.focusPage("#awardStocksname");
    activityItem.items.awardStockstype = com.focusPage("#awardStockstype");
    activityItem.items.awardStockshide = com.focusPage("#awardStockshide");
    activityItem.items.money = com.focusPage("#money");
    activityItem.items.cancelBtn = com.focusPage("#cancelBtn");
	activityItem.items.activityItemModal = com.focusPage("#activityItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	bindingType("awardStockstype");

	function bindingType(idName) {
		com.post(api.ds.information, {}, function (res) {
			com.focusPage("#" + idName).bindData(res.activityItemType, "key", "value", true)
		});
	}

	activityItem.items.addBtn = com.focusPage("#addBtn").on("click", function(){

        com.focusPage("#awardStockstype").on("click", function () {

            if(activityItem.items.awardStockstype.val()!=""){
				var awardStockstypes = activityItem.items.awardStockstype.val();
				awardStockstypes = awardStockstypes==2?0:(awardStockstypes==3?1:awardStockstypes);
                var options = {
                    "awardStock.type":awardStockstypes
                };
				activityItem.items.awardStockshide.removeClass("hide");
                com.post(api.information.queryAwardStockByType, options, function(res){
                    com.focusPage("#awardStocksname").bindData(res.awardStocks, "asId", "name",true);

                });
            }
        });

		activityItem.items.activityItemModal.modal("show");

		activityItem.editFlag = false;
	});
	
	activityItem.items.backBtn = com.focusPage("#backBtn").on("click", function(){
		com.focusPage("#activityPageContent").load(api.index.activityIndex.url);
	});
	
	activityItem.items.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	
	activityItem.items.activityName.text(activityItemPostData.activityName);
	
	var options = {
		"activity.aid": activityItemPostData.aid
	};
	
	com.post(api.information.queryActivityItemByAid, options, function(res){

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

	//保存
	function saveData(){

		if(com.validate()){
			return;
		}
		var url = "";
		var options = {
			"activity.aid":activityItemPostData.aid,
			"activityItem.asid":activityItem.items.name.val(),
			"activityItem.money":activityItem.items.money.val(),
			"activityItem.type":activityItem.items.awardStockstype.val(),
			"activityItem.activity":activityItemPostData.activityName
		};
            com.cleanItems(activityItem.activityItems);
			activityItem.items.awardStockshide.addClass("hide");

		com.post(api.information.addActivityItem, options, function(res){
			com.showAlert(com.info, "操作成功");
			activityItem.items.money.val("")
			if(activityItem.editFlag){
				com.focusPage("#pricing_" + activityItemPostData.aiid).remove();
			}
			
			addActivityItemForDiv(activityItem.items.activityItems, res.activityItem);

		});
		
		activityItem.items.activityItemModal.modal("hide");
	}

	function deleteActivityItem(aiId, activityItemName){
		
		bootbox.confirm("是否需要删除" + activityItemName + "活动物品?", function(result) {
			if(result){
				
				var options = {
					"activityItem.aiid": aiId
				};
				com.post(api.information.deleteActivityItemByAiid, options, function(res){
					com.showAlert(com.info, "操作成功");

					com.focusPage("#pricing_" + aiId).remove();
				});
			}
		});
	}

    com.focusPage("#cancelBtn").on("click", function () {

        com.cleanItems(activityItem.activityItems);
		activityItem.items.awardStockshide.addClass("hide");
    });
});
