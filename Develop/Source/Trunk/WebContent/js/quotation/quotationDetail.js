var quotationDetail = {
	
	quotationId:null,
	decorationOrderId:null,
	
	quotationDetail:null,
	loadQuotationDetail:loadQuotationDetail,
	initQuotationDetail:initQuotationDetail,
	loadDiscount:10,

	versionFunctionAreas:null,
	quotationTypes:null,
	quotationClassifications:null,
	quotationBigCategorys:null,
	quotationSmallCategorys:null,
	measurementUnits:null,
	workTypes:null,

	quotationTypesStr:"",
	quotationClassificationsStr:"",
	quotationBigCategorysStr:"",
	quotationSmallCategorysStr:"",
	measurementUnitsStr:"",
	workTypesStr:"",
	
	lastEditGrid:"",
	lastEditId:-1,
	
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	
	modal: null,
	quotationItemItems: {},
	postParam:{},
	
	selectQuotationItems: {},
	
	saveFlag: false,
	listInitFlag : false,
	
	latexCutInfos: {},
	trafficPriceInfos: {},
	
	historyQuotationItemIds: [],
	historyQuotationItems: [],
	
	functionAreaTotal: 0,
};

jQuery(function($) {
	
	main.skipFlag = true;
	
	quotationDetail.decorationOrderId = params.orderId;
	quotationDetail.quotationId = params.quotationId;
	
	quotationDetail.functionAreaTemplateModal = $("#functionAreaTemplateModal");
	quotationDetail.quotationItemModal = $("#quotationItemModal");
	quotationDetail.historyQuotationItemModal = $("#historyQuotationItemModal");
	
	quotationDetail.customFunctionAreaItemsModal = $("#customFunctionAreaItemsModal");
	
	quotationDetail.quotationItemSearchDiv = $("#quotationItemSearchDiv");
	quotationDetail.quotationItemListGrid = $("#quotationItemListGrid");
	quotationDetail.quotationItemGridPager = $("#quotationItemGridPager");
	
	quotationDetail.historyQuotationItemDiv = $("#historyQuotationItemDiv");
	quotationDetail.historyQuotationItemListGrid = $("#historyQuotationItemListGrid");
	quotationDetail.historyQuotationItemGridPager = $("#historyQuotationItemGridPager");
	
	quotationDetail.functionAreaModal = $("#functionAreaModal");
	quotationDetail.discountModal = $("#discountModal");
	
	quotationDetail.spinner = $("#spinner");
	
	$("#openFunctionAreasBtn").click(function(){
		
		var functionAreas = quotationDetail.quotationDetail.functionAreas;
		
		var functionAreaLength = functionAreas.length;
		
		for(var i=0;i<functionAreaLength;i++){
			
			var functionAreasId = functionAreas[i].id;
			
			functionAreas[i].collapsed = true;
			
			$("#oneCollapsed_" + functionAreasId).removeClass("collapsed");
			$("#oneChevron_" + functionAreasId).removeClass("icon-chevron-down");
			$("#oneChevron_" + functionAreasId).addClass("icon-chevron-up");
		}
	});
	
	$("#closeFunctionAreasBtn").click(function(){
		
		var functionAreas = quotationDetail.quotationDetail.functionAreas;
		var functionAreaLength = functionAreas.length;
		
		for(var i=0;i<functionAreaLength;i++){
			
			var functionAreasId = functionAreas[i].id;
			
			functionAreas[i].collapsed = false;
			
			$("#oneCollapsed_" + functionAreasId).addClass("collapsed");
			$("#oneChevron_" + functionAreasId).addClass("icon-chevron-down");
			$("#oneChevron_" + functionAreasId).removeClass("icon-chevron-up");
		}
	});
		
	//---------------------------------------------功能区模板--------------
	
	$("#functionAreaTemplateBtn").click(function(){
		if(!submitFunctionAreaItem()){
			return false;
		}

		$(".tree-item").removeClass("tree-selected");
		$(".tree-item i").addClass("icon-remove");
		
		quotationDetail.functionAreaTemplateModal.modal("show");
	});
	
	$('#addFunctionAreasBtn').on('click', function () {
		
		var _quotationDetail = quotationDetail.quotationDetail;
		
		var _functionAreas = [];
		var option = {};
		var selectNodes = $('#functionAreaTemplateTree').tree('selectedItems');
		
		if(selectNodes.length <= 0){
			quotationDetail.functionAreaTemplateModal.modal("hide");
			return;
		}
		
		var selectNodeLength = selectNodes.length;
		
		for(var i=0;i<selectNodeLength;++i){
			option['functionAreaIds['+i+']'] = selectNodes[i].additionalParameters.id;
		}
		
		option["quotationDetail.autoId"] = _quotationDetail.autoId;
		option["quotationDetail.discount"] = _quotationDetail.discount;
		option["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
		option["quotationDetail.latexCut"] = _quotationDetail.latexCut;
		option["quotationDetail.managePrice"] = _quotationDetail.managePrice;
		option["quotationDetail.manageRate"] = _quotationDetail.manageRate;
		option["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		
 		com.post(api.quotation.addQuotationFunctionAreaByIds, option, function(res){
 			if(res.errorCode == 0){
 				
 				_functionAreas = res.quotationFunctionAreas;
 				
 				var functionAreaLength = _functionAreas.length;
 				
 				for(var j=0;j<functionAreaLength;++j){
 					
 					var functionAreas = quotationDetail.quotationDetail.functionAreas;
 					var functionArea = _functionAreas[j];
 					var items = functionArea.items;
 					
 					functionArea.collapsed = true;
 					functionAreas.push(functionArea);
 					
 					sortFunctionArea();
 					
 					var index = functionAreas.indexOf(functionArea);
 					var id = functionAreas.length;
 					var itemsLength = items.length;
 					
 					functionArea["id"] = ++quotationDetail.functionAreaTotal;
 					
 					mapFunctionArea(); // id和index的映射关系
 					
 					insertFunctionArea(functionArea, index);
 				}

 				$('.editFunctionArea').unbind("click").on("click", editFunctionArea);
 				$('.addFunctionAreaItem').unbind("click").on("click", addFunctionAreaItem);
 				$('.customFunctionAreaItem').unbind("click").on("click", customFunctionAreaItem);
 				$('.historyFunctionAreaItem').unbind("click").on("click", historyFunctionAreaItem);
 				$('.removeFunctionAreaItems').unbind("click").on("click", removeFunctionAreaItems);
 				$('.deleteFunctionArea').unbind("click").on("click", deleteFunctionArea);
 				
 				updateFunctionAreaSumList();
 				initTooltip();
 				
 				quotationDetail.saveFlag = true;
 				
 				quotationDetail.functionAreaTemplateModal.modal("hide");
 			}else{
 				bootbox.alert("系统异常");
 			}
 		}, null, false);
	});
	
	$('#saveQuotationBtn').on(ace.click_event, function(){ // 保存报价信息
		
		var _quotationDetail = quotationDetail.quotationDetail;
		
		if(!submitFunctionAreaItem()){
			return false;
		}

		var args = {};
		
		args["quotationDetail.autoId"] = _quotationDetail.autoId;
 		args["quotationDetail.discount"] = _quotationDetail.discount;
 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		
		com.post(api.quotation.updateQuotationDetail, args, function(res){
			com.showAlert(com.info, "操作成功");
		}, function(res){
			console.log(res)
		});
	});
	
//------------------------------------------------------------------折扣修改-------------------------
	$('#discountBtn').on(ace.click_event, function(){ // 折扣界面
		
		com.clearValidator();
		com.clearValidator("#discount", true);
		
		if(!submitFunctionAreaItem()){
			return false;
		}

		$("#discount").val(quotationDetail.quotationDetail.discount);
		$("#limitDiscount").val(quotationDetail.quotationDetail.orderActivityDiscount);
		
		quotationDetail.discountModal.modal("show");
	});
	
	$('#saveDisCountBtn').on(ace.click_event, function(){ //折扣保存
		
		if(com.validate()){
			return;
		}
		
		var _quotationDetail = quotationDetail.quotationDetail;
		
		var dis = $("#discount").val();
		
		if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
			com.showTips($("#discount"), "折扣非法", true);
			return;
		}else{
			com.clearValidator("#discount", true);
		}
		
		if(parseFloat(dis) < config.quotationLimitDiscount){
			bootbox.prompt("折扣审批", function(res){
				_quotationDetail.discount = config.quotationLimitDiscount;
				
				var options = {
					"approval.comment": res,
					"approvalQuotationDiscount.orderId": _quotationDetail.orderId,
					"approvalQuotationDiscount.quotationId": _quotationDetail.autoId,
					"approvalQuotationDiscount.newDiscount": dis,
				}
				
				com.post(api.approval.submitApprovalForQuotationDiscount, options, function(res){
					com.showAlert(com.info, "折扣申请成功.");
				});
			});
		}else{
			_quotationDetail.discount =  Math.round(parseFloat(dis) * 100) / 100;
		}
		
		calQuotationDetailSum(); // 计算汇总信息
		updateFunctionAreaSumList(); // 更新汇总信息
		updateManagePrice(); // 更新报价项中管理费类的信息
		
		var args = {};
		
		args["quotationDetail.autoId"] = _quotationDetail.autoId;
 		args["quotationDetail.discount"] = _quotationDetail.discount;
 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		
		com.post(api.quotation.updateQuotationDetail, args, function(res){
		}, function(res){
			console.log(res)
		});
		
		quotationDetail.saveFlag = true;
		
		quotationDetail.discountModal.modal("hide");
	});
	
//----------------------------------------------返回----------------------------
	$('#detailBckBtn').on(ace.click_event, function(){
		bootbox.confirm("当前页面存在重要数据,是否进行当前操作?", function(result) {
			if(result){
				
				if(!submitFunctionAreaItem()){
					return false;
				}
				
				$("#fl-container").load(api.index.quotationIndex.url, {}, function(){
					
					if(main.quotationIntervalId != -1){
						clearInterval(main.quotationIntervalId);
						main.quotationIntervalId = -1;
					}
					
					decorationQuotation.decorationOrderId = quotationDetail.decorationOrderId;
					decorationQuotation.initQuotationList();
				});
			}
		});
	});
	
//----------------------------------------保存----------------
	$('#saveQuotationDetailBtn').on(ace.click_event, function(){
		
		quotationDetail.spinner.show();
		
		if(!submitFunctionAreaItem()){
			return false;
		}
		
		var btn = $(this);
		saveQuotationDetail(0, btn.attr('id'));
	});
	
	$('#saveQuotationDetailOKBtn').on(ace.click_event, function(){
		
		quotationDetail.spinner.show();
		
		if(!submitFunctionAreaItem()){
			return false;
		}
		
		var btn = $(this);
		saveQuotationDetail(1, btn.attr('id'));
	});
	
//---------------------------------------功能区编辑-------------------------------	
	$('#saveFunctionAreaBtn').on(ace.click_event, function(){ // 编辑功能区页面
		
		if(com.validate())
			return;
		
		var _quotationDetail = quotationDetail.quotationDetail;
		
		var functionArea = null;
		var functionAreas = _quotationDetail.functionAreas;
		
		var functionAreaIndex = $("#functionAreaIndex").val();
		
		var functionAreaLength = functionAreas.length;
		
		for(var i=0;i<functionAreaLength;i++){
			if(functionAreaIndex == functionAreas[i].id){
				functionArea = functionAreas[i];
			}
		}
		
		functionArea.functionAreaName = $("#functionAreaName").val();
		functionArea.functionAreaOrder = $("#functionAreaOrder").val();
		
		sortFunctionArea();
		mapFunctionArea(); // id和index的映射关系
		
		var _index = functionAreas.indexOf(functionArea);
		var _functionAreaObj = $("#oneFunctionArea_" + functionArea.id).detach();
		
		if(_index == 0){
			_functionAreaObj.prependTo($("#functionAreaDetailList"));
		}else{
			var _preIndex = functionAreas[_index-1].id;
			
			$("#oneFunctionArea_" + _preIndex).after(_functionAreaObj);
		}
		
		$("#labFunctionAreaName" + functionArea.id).text(functionArea.functionAreaOrder + " " + functionArea.functionAreaName);

		$('.editFunctionArea').unbind("click").on("click", editFunctionArea);
		$('.addFunctionAreaItem').unbind("click").on("click", addFunctionAreaItem);
		$('.customFunctionAreaItem').unbind("click").on("click", customFunctionAreaItem);
		$('.historyFunctionAreaItem').unbind("click").on("click", historyFunctionAreaItem);
		$('.removeFunctionAreaItems').unbind("click").on("click", removeFunctionAreaItems);
		$('.deleteFunctionArea').unbind("click").on("click", deleteFunctionArea);
		
		updateFunctionAreaSumList();
		
		quotationDetail.saveFlag = true;
		
		var args = {};
		
		args["quotationFunctionArea.autoId"] = functionArea.autoId;
		args["quotationFunctionArea.functionAreaName"] = functionArea.functionAreaName;
		args["quotationFunctionArea.functionAreaOrder"] = functionArea.functionAreaOrder;
		
		args["quotationDetail.autoId"] = _quotationDetail.autoId;
 		args["quotationDetail.discount"] = _quotationDetail.discount;
 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		
		com.post(api.quotation.updateQuotationFunctionArea, args, function(res){
		}, function(res){
			console.log(res)
		});
		
		quotationDetail.functionAreaModal.modal("hide");
	});
	
//------------------------------------------------添加报价项------------------------
	$("#addFunctionAreaItemsBtn").on(ace.click_event, function(event){
		
		var functionAreaIndex = $("#addItemFunctionAreaIndex").val();
		
		addItemToFunctionArea(functionAreaIndex);
		
		quotationDetail.saveFlag = true;
			
		quotationDetail.quotationItemModal.modal("hide");
		
		return false;
	});
	
	$("#addHistoryItemsBtn").on(ace.click_event, function(event){
		
		var functionAreaIndex = $("#addItemFunctionAreaIndex").val();
		
		addItemToFunctionArea(functionAreaIndex);
		
		quotationDetail.saveFlag = true;
			
		quotationDetail.historyQuotationItemModal.modal("hide");
		
		return false;
	});
	
	$("#addCustomFunctionAreaItemsBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		$("#itemName").val("");
		$("#quotationItemDes").val("");
		$("#unitPrice").val("");
		$("#num").val("");
		$("#quotationBigCategory").get(0).selectedIndex = 0;
		$("#measurementUnit").get(0).selectedIndex = 0;
		$("#workType").get(0).selectedIndex = 0;
		
		quotationDetail.selectQuotationItems = {};
		
		quotationDetail.customFunctionAreaItemsModal.modal("show");
		
		return false;
	});
	
	$("#saveCustomFunctionAreaItemBtn").on(ace.click_event, function(event){
		if(com.validate()){
			return;
		}
		
		if(!submitFunctionAreaItem()){
			return false;
		}
		
		var _quotationDetail = quotationDetail.quotationDetail;
		var functionAreas = _quotationDetail.functionAreas;
		
		var functionAreaIndex = quotationDetail.customerQuotationFunctionAreaIndex;
		var functionAreaItemsTable = "functionAreaItemsTable_" + functionAreaIndex;
		var functionArea = functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]];
		
		var addRow = {};
		
		addRow.num = $("#num").val();
		addRow.itemName = $("#itemName").val();
		addRow.quotationBigCategoryId = $("#quotationBigCategory").val();
		addRow.measurementUnitId = $("#measurementUnit").val();
		addRow.unitPrice = $("#unitPrice").val();
		addRow.quotationItemDes = $("#quotationItemDes").val();
		addRow.workTypeId = $("#workType").val();
		addRow.customFlag = 1;
		
		var args = {};
		
		args["customQuotationItem.itemName"] = addRow.itemName;
		args["customQuotationItem.quotationBigCategoryId"] = addRow.quotationBigCategoryId;
		args["customQuotationItem.measurementUnitId"] = addRow.measurementUnitId;
		args["customQuotationItem.workTypeId"] = addRow.workTypeId;
		args["customQuotationItem.functionAreaId"] = functionArea.autoId;
		args["customQuotationItem.functionAreaType"] = functionArea.functionAreaType;
		args["customQuotationItem.unitPrice"] = addRow.unitPrice;
		args["customQuotationItem.num"] = addRow.num;
		args["customQuotationItem.customFlag"] = addRow.customFlag;
		args["customQuotationItem.quotationItemDes"] = addRow.quotationItemDes;
		
		args["quotationDetail.autoId"] = _quotationDetail.autoId;
 		args["quotationDetail.discount"] = _quotationDetail.discount;
 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		
		com.post(api.quotation.addCustomQuotationItem, args, function(res){
			addRow.qfaiId = res.customQuotationItem.autoId;
		}, function(res){
			console.log(res);
		}, false);
		
		var functionAreaItemNum = $("#" + functionAreaItemsTable).getGridParam("reccount");
		
		$("#" + functionAreaItemsTable).addRowData(functionAreaItemNum + 1, addRow, "last");
		
		changeFunctionAreaItem(functionAreaItemsTable);
		calQuotationDetailSum();
		updateManagePrice(); // 更新报价项中管理费类的信息
		
		quotationDetail.saveFlag = true;
		
		quotationDetail.customFunctionAreaItemsModal.modal("hide");
		
		initTooltip();
		
		return false;
	});
	
	initTooltip();
	
//---------------------------------------------------报价统计----------------------------
	$("#viewStatisticalBtn").on(ace.click_event, function(event){
		$("#quotationStatisticalModal").modal("show");
	});
	
	$("#quotationStatisticalModal").on('shown.bs.modal', function(e){
		initStatisticalInfo();
	});
	
	if(main.quotationIntervalId != -1){
		clearInterval(main.quotationIntervalId);
	}
	
	loadQuotationDetail();
});

//---------------------------------------------字典初始化--------------------------------
function initDataMap(){
	
	com.post(api.quotation.queryQuotationType, {}, function(res){
		if(res.errorCode == 0){
			quotationDetail.quotationTypes = res.quotationTypes;
			quotationDetail.quotationTypesStr = "";
			
			var quotationTypeLength = res.quotationTypes.length;
			
			for(var i=0;i<quotationTypeLength;++i){
				
				var quotationType = res.quotationTypes[i];
				
				quotationDetail.quotationTypesStr += (quotationType.id + ":" + quotationType.name + ";");
			}
			
			quotationDetail.quotationTypesStr = quotationDetail.quotationTypesStr.substr(0,quotationDetail.quotationTypesStr.length-1);
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
	
	com.post(api.common.queryMeasurementUnit, {}, function(res){
		if(res.errorCode == 0){
			quotationDetail.measurementUnits = res.measurementUnits;
			quotationDetail.measurementUnitsStr = "";
			
			var measurementUnitLength = res.measurementUnits.length;
			
			for(var i=0;i<measurementUnitLength;++i){
				
				var measurementUnit = res.measurementUnits[i];
				
				quotationDetail.measurementUnitsStr += (measurementUnit.id + ":" + measurementUnit.name + ";");
			}
			
			quotationDetail.measurementUnitsStr = quotationDetail.measurementUnitsStr.substr(0, quotationDetail.measurementUnitsStr.length - 1);
			
			$("#measurementUnit").bindData(quotationDetail.measurementUnits, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
	
	com.post(api.quotation.queryQuotationBigCategory, {}, function(res){
		if(res.errorCode == 0){
			quotationDetail.quotationBigCategorys = res.quotationBigCategorys;
			quotationDetail.quotationBigCategorysStr = "";
			
			var quotationBigCategoryLength = res.quotationBigCategorys.length;
			
			for(var i=0;i<quotationBigCategoryLength;++i){
				
				var quotationBigCategory = res.quotationBigCategorys[i];
				
				quotationDetail.quotationBigCategorysStr += (quotationBigCategory.id + ":" + quotationBigCategory.name + ";");
			}
			quotationDetail.quotationBigCategorysStr = quotationDetail.quotationBigCategorysStr.substr(0, quotationDetail.quotationBigCategorysStr.length - 1);
			
			$("#quotationBigCategory").bindData(quotationDetail.quotationBigCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
	
	com.post(api.quotation.queryQuotationSmallCategory, {}, function(res){
		if(res.errorCode == 0){
			quotationDetail.quotationSmallCategorys = res.quotationSmallCategorys;
			quotationDetail.quotationSmallCategorysStr = "";
			
			var quotationSmallCategoryLength = res.quotationSmallCategorys.length;
			
			for(var i=0;i<quotationSmallCategoryLength;++i){
				
				var quotationSmallCategory = res.quotationSmallCategorys[i];
				
				quotationDetail.quotationSmallCategorysStr += (quotationSmallCategory.id + ":" + quotationSmallCategory.name + ";");
			}
			quotationDetail.quotationSmallCategorysStr = quotationDetail.quotationSmallCategorysStr.substr(0, quotationDetail.quotationSmallCategorysStr.length-1);
			
			//$("#quotationSmallCategory").bindData(quotationDetail.quotationSmallCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
	
	com.post(api.common.queryWorkType, {} ,function(res){
		if(res.errorCode == 0){
			quotationDetail.workTypes = res.workTypes;
			quotationDetail.workTypesStr = "";
			
			var workTypeLength = res.workTypes.length;
			
			for(var i=0;i<workTypeLength;++i){
				
				var workType = res.workTypes[i];
				
				quotationDetail.workTypesStr += (workType.id + ":" + workType.name + ";");
			}
			
			quotationDetail.workTypesStr = quotationDetail.workTypesStr.substr(0, quotationDetail.workTypesStr.length - 1);
			
			$("#workType").bindData(quotationDetail.workTypes, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
	
	com.post(api.quotation.queryQuotationClassification, {}, function(res){
		if(res.errorCode == 0){
			quotationDetail.quotationClassifications = res.quotationClassifications;
			quotationDetail.quotationClassifications = "";
			
			var quotationClassificationLength = res.quotationClassifications.length;
			
			for(var i=0;i<quotationClassificationLength;++i){
				
				var quotationClassification = res.quotationClassifications[i];
				
				quotationDetail.quotationClassificationsStr += (quotationClassification.id + ":" + quotationClassification.name + ";");
			}
			
			quotationDetail.quotationClassificationsStr = quotationDetail.quotationClassificationsStr.substr(0, quotationDetail.quotationClassificationsStr.length - 1);
		}else{
			bootbox.alert("系统异常");
		}
	}, null, false);
}

//--------------------------------------------------------服务器端加载数据-------------------------------------------------------
function loadQuotationDetail(){
	
	$("#functionAreaDetailList").html("");
	
	com.post(api.quotation.queryQuotationDetailById, {"quotationDetail.autoId":quotationDetail.quotationId}, function(res){
		quotationDetail.quotationDetail = res.quotationDetail;
		quotationDetail.loadDiscount = res.quotationDetail.discount;
		
		$("#printFinanceBtn").attr('href', api.index.quotationListIndex.url + "?quotationDetail.autoId=" + res.quotationDetail.autoId + "&type=2");
	}, null, false);
	
	com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.versionId":quotationDetail.quotationDetail.versionId}, function(res){
		quotationDetail.versionFunctionAreas = res.functionAreas;
	}, null, false);
	
	initDataMap();
	initFunctionAreaTemplate();
	initQuotationItemList();
	initQuotationDetail();
	initHistoryQuotationItemList();
}

function initQuotationItemList(){
	
	var quotationItemSearchOpts = {
		url: api.quotation.pageQuotationItemByVersionId,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId":quotationDetail.quotationDetail.versionId},
		listgrid: quotationDetail.quotationItemListGrid,
		items: [
	        {label:"名称", id:"itemNameSearch",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"小类", id:"quotationSmallCategorySearch", name:"quotationSmallCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	quotationDetail.quotationItemSearchDiv.flSearch(quotationItemSearchOpts);
	$("#quotationBigCategorySearch").bindData(quotationDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch").bindData(quotationDetail.workTypes, "id", "name", true);
	$("#quotationSmallCategorySearch").bindData(quotationDetail.quotationSmallCategorys, "id", "name", true);
	$("#quotationClassificationSearch").bindData(quotationDetail.quotationClassifications, "id", "name", true);
	
	quotationDetail.postParam["quotationItem.versionId"] = quotationDetail.quotationDetail.versionId;
	
	quotationDetail.quotationItemListGrid.jqGrid({		
		url: api.quotation.pageQuotationItemByVersionId.url,
		postData: quotationDetail.postParam,
		multiboxonly: false,
		colNames:['autoId', '编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '单价', '说明', '版本', 'workTypeId', 'measurementUnitId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationTypeId'],
		colModel:[
		    {name:'autoId', hidden: true},  
			{name:'itemId', hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:300,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', width:40, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'unitPrice', width:50},
			{name:"quotationItemDes", hidden:true, width:50}, // formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat
			{name:'version', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'workTypeId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId', hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:810,
		rowNum:50,
		rowList:[50, 100, 200],
		height: '450',
		pager : quotationDetail.quotationItemGridPager,
		caption: "",
		gridComplete: function(){
//			initTooltip();
		}, loadComplete: function(xhr){
			
			var rowNum = quotationDetail.quotationItemListGrid.getGridParam("reccount");
			var selectQuotationItems = quotationDetail.selectQuotationItems;
			
			for(var i=0;i<rowNum;i++){
				
				var index = i + 1;
				var info = quotationDetail.quotationItemListGrid.jqGrid('getRowData', index);
				
				if(selectQuotationItems[info.autoId] != null){
					quotationDetail.quotationItemListGrid.setSelection(index, false);
				}
			}
		}, onSelectAll: function(rowIds, status){
			
			var rowIdsLength = rowIds.length;
			
			for(var i=0;i<rowIdsLength;i++){
				var info = quotationDetail.quotationItemListGrid.jqGrid('getRowData', rowIds[i]);
				
				if(status){
					quotationDetail.selectQuotationItems[info.autoId] = info;
				}else{
					var item = quotationDetail.selectQuotationItems[info.autoId];
					
					if(item != undefined){
						quotationDetail.selectQuotationItems[info.autoId] = null;
					}
				}
			}
		}, onSelectRow: function(rowId, status){
			
			var info = quotationDetail.quotationItemListGrid.jqGrid('getRowData', rowId);
			
			if(status){
				quotationDetail.selectQuotationItems[info.autoId] = info;
			}else{
				var item = quotationDetail.selectQuotationItems[info.autoId];
				if(item != undefined){
					quotationDetail.selectQuotationItems[info.autoId] = null;
				}
			}
		}
	});

	quotationDetail.quotationItemListGrid.navGrid(quotationDetail.quotationItemGridPager, {edit: false, add: false, del: false, search: false, refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initHistoryQuotationItemList(){
	
	quotationDetail.historyQuotationItemDiv.html("");
	
	quotationDetail.historyQuotationItemGridPager = $("<div></div>").attr("id", "historyQuotationItemGridPager").appendTo(quotationDetail.historyQuotationItemDiv);
	quotationDetail.historyQuotationItemListGrid = $("<table></table>").attr("id", "historyQuotationItemListGrid").appendTo(quotationDetail.historyQuotationItemDiv);
	
	quotationDetail.historyQuotationItemListGrid.jqGrid({
		datatype: "local",
		data: quotationDetail.historyQuotationItems,
		multiboxonly: false,
		colNames:['autoId', '编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '单价', '说明', '版本', 'workTypeId', 'measurementUnitId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationTypeId'],
		colModel:[
		    {name:'autoId', hidden: true},  
			{name:'itemId', hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:300,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', width:40, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'unitPrice', width:50},
			{name:"quotationItemDes", hidden:true, width:50}, // formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat
			{name:'version', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'workTypeId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId', hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:810,
		rowNum:quotationDetail.historyQuotationItems.length,
		height: '450',
		pager : quotationDetail.historyQuotationItemGridPager,
		caption: "",
		gridComplete: function(){
//			initTooltip();
		}, loadComplete: function(xhr){
			
			var rowNum = quotationDetail.historyQuotationItemListGrid.getGridParam("reccount");
			var selectQuotationItems = quotationDetail.selectQuotationItems;
			
			for(var i=0;i<rowNum;i++){
				
				var index = i + 1;
				var info = quotationDetail.historyQuotationItemListGrid.jqGrid('getRowData', index);
				
				if(selectQuotationItems[info.itemId] != null){
					quotationDetail.quotationItemListGrid.setSelection(index, false);
				}
			}
		}, onSelectAll: function(rowIds, status){
			
			var rowIdsLength = rowIds.length;
			
			for(var i=0;i<rowIdsLength;i++){
				var info = quotationDetail.historyQuotationItemListGrid.jqGrid('getRowData', rowIds[i]);
				
				if(status){
					quotationDetail.selectQuotationItems[info.itemId] = info;
				}else{
					var item = quotationDetail.selectQuotationItems[info.itemId];
					
					if(item != undefined){
						quotationDetail.selectQuotationItems[info.itemId] = null;
					}
				}
			}
		}, onSelectRow: function(rowId, status){
			
			var info = quotationDetail.historyQuotationItemListGrid.jqGrid('getRowData', rowId);
			
			if(status){
				quotationDetail.selectQuotationItems[info.itemId] = info;
			}else{
				var item = quotationDetail.selectQuotationItems[info.itemId];
				if(item != undefined){
					quotationDetail.selectQuotationItems[info.itemId] = null;
				}
			}
		}
	});

	quotationDetail.quotationItemListGrid.navGrid(quotationDetail.quotationItemGridPager, {edit: false, add: false, del: false, search: false, refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initFunctionAreaTemplate(){
	
	$('#functionAreaTemplateTree').html("");
	
	var tree_data = {};
	var index = 0;
	
	var versionFunctionAreaLength = quotationDetail.versionFunctionAreas.length;
	
	for(var i=0;i<versionFunctionAreaLength;++i){
		
		var versionFunctionArea = quotationDetail.versionFunctionAreas[i];
		
		if((versionFunctionArea.functionAreaType == '管理费') == false){
			++index;
			
			var node = {
				name:versionFunctionArea.functionAreaName,
				additionalParameters: {id: versionFunctionArea.autoId},
				type:"item"
			};
			tree_data[index] = node;
		}
	}
	
	$('#functionAreaTemplateTree').ace_tree({
		dataSource: new DataSourceTree({data: tree_data}),
		multiSelect:true,
		loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
		'open-icon' : 'icon-minus',
		'close-icon' : 'icon-plus',
		'selectable' : true,
		'selected-icon' : 'icon-ok',
		'unselected-icon' : 'icon-remove'
	});
}
//------------------------------------------------------------------界面初始化---------------------------------------------
function sortFunctionArea(){
	quotationDetail.quotationDetail.functionAreas.sort(function(a, b){
		return parseInt(a.functionAreaOrder) - parseInt(b.functionAreaOrder);
	});
}

function mapFunctionArea(){
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreas = quotationDetail.quotationDetail.functionAreas;
	var functionAreasLength = functionAreas.length;
	
	_quotationDetail.functionAreaId2Index = {};
	
	for(var i=0;i<functionAreasLength;i++){
		var functionArea = functionAreas[i];
		_quotationDetail.functionAreaId2Index[functionArea.id.toString()] = i;
	}
}

function calQuotationDetailSum(){
	
	var _quotationDetail =   quotationDetail.quotationDetail;
	var functionAreas = _quotationDetail.functionAreas;

	_quotationDetail.manageRate =  0;
	_quotationDetail.carManageRate = 0;
	
	_quotationDetail.trafficPrice = 0;
	_quotationDetail.latexCut = 0;
	
	var totalPrice = 0; //总价
	var normalPrice = 0; // 正常价格
	var discountPrice = 0; //折后价格
	var noDiscountTotalPrice = 0; // 不打折
	var carManagePrice = 0; // 车运费
	var managePrice = 0; // 管理费
	
	var carManageFunctionAreaIndex = -1;
	var manageFunctionAreaIndex = -1;
	
	var functionAreaLength = functionAreas.length;
	
	for(var i=0;i<functionAreaLength;++i){
		
		var functionArea = functionAreas[i];
		
		functionArea.sum = 0;
		if(functionArea.functionAreaType == '普通'){ // 参与打折
			var sum = 0;
			var preDiscountSum = 0;
			
			var functionAreaItemLength = functionArea.items.length;
			
			for(var j=0;j<functionArea.items.length;j++){
				
				var functionAreaItem = functionArea.items[j];
				
				sum += Math.round((parseFloat(functionAreaItem.unitPrice) * quotationDetail.quotationDetail.discount * parseFloat(functionAreaItem.num) / 10) * 100) / 100;
				preDiscountSum += Math.round((parseFloat(functionAreaItem.unitPrice) * parseFloat(functionAreaItem.num)) * 100) / 100;
				
				updateOtherPrice(functionAreaItem.itemIdAutoId, functionAreaItem.num, functionAreaItem.unitPrice);
			}
			
			functionArea.sum = sum;
			normalPrice += preDiscountSum;
			discountPrice += sum;
			totalPrice += sum;
		}else {
			var sum = 0;
			
			var functionAreaItemLength = functionArea.items.length;
			
			for(var j=0;j<functionAreaItemLength;j++){
				
				var functionAreaItem = functionArea.items[j];
				
				if(((functionAreaItem.itemName.search('车运费') == -1) && (functionAreaItem.itemName.search('管理费') == -1))){ // 不打折
					sum += Math.round((parseFloat(functionAreaItem.unitPrice) * parseFloat(functionAreaItem.num)) * 100) / 100;
				}else if((functionAreaItem.itemName.search('车运费') != -1)){
					carManageFunctionAreaIndex = i;
					quotationDetail.quotationDetail.carManageRate = functionAreaItem.unitPrice;
				}else if((functionAreaItem.itemName.search('管理费') != -1)){
					quotationDetail.quotationDetail.manageRate = parseFloat(functionAreaItem.unitPrice) + parseFloat(quotationDetail.quotationDetail.notSalesmanRate);
					
					if(quotationDetail.quotationDetail.manageRate){
						manageFunctionAreaIndex = i;
					}
				}
				
				updateOtherPrice(functionAreaItem.itemIdAutoId, functionAreaItem.num, functionAreaItem.unitPrice);
			}
			
			functionArea.sum = sum;
			noDiscountTotalPrice += sum;
			totalPrice += sum;
		}
	}
	
	var commonPrice = discountPrice + noDiscountTotalPrice;
	var preDiscountCommonPrice = normalPrice + noDiscountTotalPrice;
	
	carManagePrice = Math.round(((preDiscountCommonPrice) * parseFloat(quotationDetail.quotationDetail.carManageRate)) * 100) / 100;
	
//	if( parseFloat(quotationDetail.quotationDetail.limitCarManagePrice) > carManagePrice){
//		carManagePrice =  Math.round(parseFloat(quotationDetail.quotationDetail.limitCarManagePrice)*100)/100;
//	}
	
	if(carManageFunctionAreaIndex != -1){
		preDiscountCommonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum += carManagePrice;
		totalPrice += carManagePrice;
	}
	
	managePrice = Math.round(((preDiscountCommonPrice) * parseFloat(quotationDetail.quotationDetail.manageRate)) * 100) / 100;

	if(manageFunctionAreaIndex != -1){
		functionAreas[manageFunctionAreaIndex].sum += managePrice;
		totalPrice += managePrice;
	}
	
	// 总价 | 打折 | 不打折 | 车运费 | 管理费
	_quotationDetail.totalPrice = Math.round(totalPrice * 100) / 100; 
	_quotationDetail.discountPrice =  Math.round(discountPrice * 100) / 100;
	_quotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice * 100) / 100;
	_quotationDetail.carManagePrice =  Math.round(carManagePrice * 100) / 100;
	_quotationDetail.managePrice =  Math.round(managePrice * 100) / 100;
}

function updateManagePrice(){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	var functionAreas = _quotationDetail.functionAreas;
	
	var functionAreaLength = functionAreas.length;
	
	for(var i=0;i<functionAreaLength;++i){
		var functionArea = functionAreas[i];
		var functionAreaType = functionArea.functionAreaType;
		var functionAreaTableId = functionArea.id;
		
		if(functionAreaType == '管理费' || functionAreaType == '综合项目'){
			var _gridList = $("#functionAreaItemsTable_" + functionAreaTableId).jqGrid();
			var _rowIds = _gridList.getDataIDs();
			
			var _gridListLength = _rowIds.length;
			
			for(var j=0;j<=_gridListLength;j++){
				var _rowId = _rowIds[j];
				var rowdata = _gridList.jqGrid("getRowData", _rowId);
				var _itemName = rowdata.itemName;
				
				if(_itemName != null || _itemName != undefined){
					if(_itemName.indexOf("管理费") != -1){
						rowdata.sumMoney = _quotationDetail.managePrice;
						_gridList.jqGrid("setRowData", rowdata);
					}else if(_itemName.indexOf("车运费") != -1){
						rowdata.sumMoney = _quotationDetail.carManagePrice;
						_gridList.jqGrid("setRowData", rowdata);
					}
				}
			}
		}
	}
}

function updateOtherPrice(itemIdAutoId, num, unitPrice){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	var latexCutScale = _quotationDetail.latexCutScale;
	var trafficPriceScale = _quotationDetail.trafficPriceScale;
	
	if(latexCutScale[itemIdAutoId]){
		
		var _latexCut = utils.accMul(parseFloat(num), parseFloat(latexCutScale[itemIdAutoId]));
		
		_quotationDetail.latexCut = utils.accAdd(_quotationDetail.latexCut, _latexCut);
	}
	
	if(trafficPriceScale.indexOf(parseInt(itemIdAutoId)) != -1){
		
		var _trafficPrice = utils.accMul(parseFloat(num), parseFloat(unitPrice));
		
		_quotationDetail.trafficPrice = utils.accAdd(_quotationDetail.trafficPrice, _trafficPrice);
	}
}

function updateFunctionAreaItem(gridList, functionAreaId, itemIndex, itemrn){
	
	var functionAreaIndex = functionAreaId.split('_')[1];
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	var functionAreas = _quotationDetail.functionAreas;
	var functionArea = functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]];
	var functionAreaItem = functionArea.items[itemrn-1];
	
	var discount = quotationDetail.quotationDetail.discount;
	var functionAreaType = functionArea.functionAreaType;
	var functionAreaItemName = functionAreaItem.itemName;
	var unitPrice = functionAreaItem.unitPrice;
	var num = functionAreaItem.num;
	
	var sum = 0;
	
	if(functionAreaType == '普通'){
		sum = Math.round((parseFloat(unitPrice) * discount * parseFloat(num) / 10) * 100) / 100;
	}else{
		if(((functionAreaItemName.search('车运费') == -1) && (functionAreaItemName.search('管理费') == -1))){ // 不打折
			sum = Math.round((parseFloat(unitPrice) * parseFloat(num)) * 100) / 100;
		}
	}
	
	gridList.setCell(itemIndex, "sumMoney", sum);
}

function initQuotationDetail(){
	
	console.log("initQuotationDetail");
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreas = _quotationDetail.functionAreas;
	
	sortFunctionArea(); // 排序
	calQuotationDetailSum(); // 计算总值
	
	$("#functionAreaSumList").html("");
	
	for(var i=0;i<functionAreas.length;++i){ // 初始化映射关系前提需要拥有id
		functionAreas[i]["id"] = ++quotationDetail.functionAreaTotal;
	}
	
	mapFunctionArea(); // id和index的映射关系
	
	var functionAreasLength = functionAreas.length;
	
	for(var i=0;i<functionAreasLength;++i){
		
		var functionArea = functionAreas[i];
		var items = functionArea.items;
		var itemsLength = items.length;
		
		insertFunctionArea(functionArea, i);
		
		for(var j=0;j<itemsLength;j++){
			var item = items[j];
			
			addHistoryQuotationItem(item);
		}
		
		if(functionArea.functionAreaName != '管理费'){ // 初始化功能区总值信息
			var sumDiv = $("<div></div>").addClass("col-md-12").appendTo($("#functionAreaSumList"));
			var functionAreaNameLabel = $("<label></label>").addClass("col-md-6 no-padding-right").attr("id", "sumLabfunctionAreaName_" + i).text(functionArea.functionAreaName).appendTo(sumDiv);
			var functionAreaMoneyLabel = $("<label></label>").addClass("col-md-6 no-padding-left").text(Math.round(functionArea.sum * 100) / 100).appendTo(sumDiv);
		}
		
		if(functionArea.collapsed == undefined || functionArea.collapsed == false){
			functionArea.collapsed = false;
			
			$("#oneCollapsed_" + i).addClass("collapsed");
			$("#oneChevron_" + i).addClass("icon-chevron-down");
			$("#oneChevron_" + i).removeClass("icon-chevron-up");
		}else{
			functionArea.collapsed = true;
			
			$("#oneCollapsed_" + i).removeClass("collapsed");
			$("#oneChevron_" + i).removeClass("icon-chevron-down");
			$("#oneChevron_" + i).addClass("icon-chevron-up");
		}
	}
	
	var discountMoney  = Math.round(parseFloat(_quotationDetail.discountPrice) / (_quotationDetail.discount / 10) * ((10 - _quotationDetail.discount) / 10) * 100) / 100;
	$("#sumLabSumMoney").html(Math.round((_quotationDetail.totalPrice + discountMoney) * 100) / 100);
	$("#sumLabDiscount").html(_quotationDetail.discount);
	$("#sumLabDiscountMoney").html(Math.round(_quotationDetail.totalPrice * 100) / 100);
	$("#quotationName").html(_quotationDetail.quotationName);
	
	initTooltip(); // 重置描述信息

	$('.editFunctionArea').unbind("click").on("click", editFunctionArea);
	$('.addFunctionAreaItem').unbind("click").on("click", addFunctionAreaItem);
	$('.customFunctionAreaItem').unbind("click").on("click", customFunctionAreaItem);
	$('.historyFunctionAreaItem').unbind("click").on("click", historyFunctionAreaItem);
	$('.removeFunctionAreaItems').unbind("click").on("click", removeFunctionAreaItems);
	$('.deleteFunctionArea').unbind("click").on("click", deleteFunctionArea);
}

function insertFunctionArea(functionArea, index){
	
	console.log("insertFunctionArea");
	
	var id = functionArea.id;
	var functionAreaDiv = $('<div></div>').addClass("col-xs-12 col-md-12 no-padding widget-container-span ui-sortable").attr("id", "oneFunctionArea_" + id).attr("functionIndexData", id);
	
	if(index == 0){
		functionAreaDiv.prependTo($("#functionAreaDetailList"));
	}else if(index != 0 && index > 0){
		var functionAreasDiv = $("#functionAreaDetailList > .widget-container-span");
		var preFunctionAreaId = functionAreasDiv[index-1].id;
		
		$("#" + preFunctionAreaId).after(functionAreaDiv);
	}
	
	var collapseDiv = $('<div></div>').addClass("widget-box transparent").attr("id", "oneCollapsed_"+id).appendTo(functionAreaDiv);
	var widgetHeaderDiv = $('<div></div>').addClass("widget-header").appendTo(collapseDiv);
	var h5 = $('<h5></h5>').appendTo(widgetHeaderDiv);
	var strong = $('<strong></strong>').attr("id", "labFunctionAreaName"+id).text(functionArea.functionAreaOrder+" "+functionArea.functionAreaName).appendTo(h5);
	var widgetToolbarDiv = $('<div></div>').addClass("widget-toolbar no-border").appendTo(widgetHeaderDiv);
	
	var editA = $('<a></a>').attr("href", "javascript:void(0)").addClass("editFunctionArea").attr("data", id).attr("index", index).attr("data-rel", "tooltip").attr("title", "编辑功能区").css("padding-left", "5px").appendTo(widgetToolbarDiv);
	var editI = $('<i></i>').addClass("bigger-125 icon-pencil blue").appendTo(editA);
	
	var plusA = $('<a></a>').attr("href", "javascript:void(0)").addClass("addFunctionAreaItem").attr("data", id).attr("index", index).attr("data-rel", "tooltip").attr("title", "添加报价项").css("padding-left", "5px").appendTo(widgetToolbarDiv);
	var plusI = $('<i></i>').addClass("bigger-125 icon-plus-sign purple").appendTo(plusA);
	
	if(functionArea.functionAreaType != '管理费'){
		var customA = $('<a></a>').attr("href", "javascript:void(0)").addClass("customFunctionAreaItem").attr("data", id).attr("index", index).attr("data-rel", "tooltip").attr("title", "自定义报价项").css("padding-left", "5px").appendTo(widgetToolbarDiv);
		var customI = $('<i></i>').addClass("bigger-125 icon-cog purple").appendTo(customA);
		
		var historyA = $('<a></a>').attr("href", "javascript:void(0)").addClass("historyFunctionAreaItem").attr("data", id).attr("index", index).attr("data-rel", "tooltip").attr("title", "历史报价项").css("padding-left", "5px").appendTo(widgetToolbarDiv);
		var historyI = $('<i></i>').addClass("bigger-125 icon-hdd green").appendTo(historyA);
		
		var removeA = $('<a></a>').attr("href", "javascript:void(0)").addClass("removeFunctionAreaItems").attr("data", id).attr("index", index).attr("data-rel", "tooltip").attr("title", "批量删除报价项").css("padding-left", "5px").appendTo(widgetToolbarDiv);
		var removeI = $('<i></i>').addClass("bigger-125 icon-remove pink").appendTo(removeA);
		
		var deleteA = $('<a></a>').attr("href", "javascript:void(0)").addClass("deleteFunctionArea").attr("data", id).attr("index", index).attr("index", index).attr("data-rel", "tooltip").attr("title", "删除功能区").css("padding-left", "5px").appendTo(widgetToolbarDiv);
		var deleteI = $('<i></i>').addClass("bigger-125 icon-trash red").appendTo(deleteA);
	}
	
	var chevronA = $('<a></a>').attr("href", "javascript:void(0)").attr("data-action", "collapse").css("padding-left", "5px").appendTo(widgetToolbarDiv);
	var chevronI = $('<i></i>').addClass("bigger-125 icon-chevron-up").attr("functionIndexData", id).attr("id", "oneChevron_"+id).appendTo(chevronA);
	
	var widgetBodyDiv = $('<div></div>').addClass("widget-body").appendTo(collapseDiv);
	var widgetBodyInnerDiv = $('<div></div>').addClass("widget-body-inner").css("display", "block").appendTo(widgetBodyDiv);
	var functionAreaItemsTable = $('<table></table>').attr("id", "functionAreaItemsTable_"+id).attr("functionIndexData", id).appendTo(widgetBodyInnerDiv);
	
	$("#functionAreaItemsTable_" + id).jqGrid({
		datatype: "local",
		data: functionArea.items,
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['qfaiId' ,'工程预算量', '名称', '大类', '单位', '单价', '折后单价', '总价', '工艺说明', '操作', 'uuid', 'itemIdAutoId', 'itemId', 'workTypeId', 'quotationClassificationId', 'quotationClassification', 'customFlag', 'functionAreaId', 'functionAreaName'],
		colModel:[
		    {name:"qfaiId", hidden:true},
			{name:"num", width:40, editable:true, sortable: false, edittype: "text", editoptions:{maxlength:5}, editrules:{required:true ,custom:true, custom_func:checkGridNum}},
			{name:"itemName", editable:true, sortable: false, edittype: "text", editoptions:{maxlength:32}, editrules:{required:true, custom:true, custom_func:checkGridItemName}},
			{name:"quotationBigCategoryId", width:50, sortable: false, formatter:"select", editable:true, edittype: "select", editoptions:{value:quotationDetail.quotationBigCategorysStr}},
			{name:"measurementUnitId", width:50, sortable: false, formatter:"select", editable:true, edittype: "select", editoptions:{value:quotationDetail.measurementUnitsStr}},
			{name:"unitPrice", formatter:unitPriceFormatter, width:50, sortable: false, editable:true, edittype: "text", editoptions:{maxlength:5}, editrules:{ required:true, custom:true, custom_func:checkGridNum}},
			{name:"discountUnitPrice", width:50, sortable: false, formatter:discountUnitPriceFormatter},
			{name:"sumMoney", width:50, sortable: false, formatter:sumMoneyFormatter},
			{name:"quotationItemDes", hidden:true, width:50, sortable: false, editable:false, edittype:'textarea', editoptions:{maxlength:500}, editrules:{ required:true, custom:true, custom_func:checkGridQuotationItemDes}, formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat},
			{name:'deleteAction', width:50, sortable: false, title:false, formatter:deleteActionFormatter, unformat:quotationItemDesUnformat},
			{name:"uuid", hidden:true},
			{name:"itemIdAutoId", hidden:true},
			{name:"itemId", hidden:true},
			{name:"workTypeId", hidden:true},
			{name:"quotationClassificationId", hidden:true},
			{name:"quotationClassification", hidden:true},
			{name:"customFlag", hidden:true},
			{name:"functionAreaId", hidden:true},
			{name:"functionAreaName", hidden:true},
		], 
		rowNum:functionArea.items.length,
		rowList:[10, 20, 30],
		beforeSelectRow: function(rowId, e){
			
			var clickObj = $(e.target).closest('td')[0];
			
			if(clickObj == undefined || clickObj == null){
				return true;
			}
			
	        var i = $.jgrid.getCellIndex(clickObj);
	        var cm =  $(this).jqGrid('getGridParam', 'colModel');
	        
			return (cm[i].name != 'deleteAction');  
		}, 	onSelectRow: function(id){
			
			if(id && (id !== quotationDetail.lastEditId || quotationDetail.lastEditGrid != $(this).attr("id"))){
				
				var _grid = $(this);
				
				var rowData = _grid.jqGrid("getRowData", id); 
				$('[data-rel="tooltip"]').tooltip('hide');
				
				if(!submitFunctionAreaItem()){
					return false;
				}
				
				if(rowData.customFlag == 0 && (rowData.itemName.search('管理费') != -1 || rowData.itemName.search('车运费') != -1)){
					return;
				}
				
				$(this).jqGrid('editRow', id, {
					keys : true,
					url: "clientArray",
					oneditfunc:function(rowid){
						var rowObject = $(this).jqGrid("getRowData", rowid); 
						
						if(rowObject.customFlag == 0){
							$("#"+rowid+"_quotationBigCategoryId").prop("disabled", true);
							$("#"+rowid+"_unitPrice").prop("disabled", true);
							$("#"+rowid+"_measurementUnitId").prop("disabled", true);
							$("#"+rowid+"_itemName").prop("disabled", true);
							$("#"+rowid+"_quotationItemDes").prop("disabled", true);
							
							if($("#"+rowid+"_itemName").val().search('管理费') != -1 || $("#"+rowid+"_itemName").val().search('车运费') != -1){
								$("#"+rowid+"_num").prop("disabled", true);
							}
						}
						
						$("#"+rowid+"_num").on('focus', function(){
							this.select(); 
						});
					}, aftersavefunc: function(rowid){
						var newRowData = $(this).getRowData(rowid);
						
						var _grid = $(this);
						
						var rn = _grid.getCell(rowid, "rn");
						var su = _grid.jqGrid('setRowData', rowid, newRowData);
						
						var _quotationDetail = quotationDetail.quotationDetail;
						
						var url = "";
						var args = {};
						
						changeFunctionAreaItem($(this).attr("id")); // 更新报价项对应数据信息
						updateFunctionAreaItem($(this), $(this).attr("id"), rowid, rn); // 更新报价项信息
						calQuotationDetailSum(); // 计算汇总信息
						updateFunctionAreaSumList(); // 更新汇总信息
						updateManagePrice(); // 更新报价项中管理费类的信息
						
						if(newRowData.customFlag == 0){
							args["quotationFunctionAreaItem.uuid"] = newRowData.uuid;
							args["quotationFunctionAreaItem.functionAreaId"] = newRowData.functionAreaId;
							args["quotationFunctionAreaItem.itemIdAutoId"] = newRowData.itemIdAutoId;
							args["quotationFunctionAreaItem.num"] = newRowData.num;
							
							url = api.quotation.updateQuotationFunctionAreaItem;
						}else if(newRowData.customFlag == 1){
							args["customQuotationItem.autoId"] = newRowData.qfaiId;
							
							args["customQuotationItem.itemName"] = newRowData.itemName;
							args["customQuotationItem.quotationBigCategoryId"] = newRowData.quotationBigCategoryId;
							args["customQuotationItem.measurementUnitId"] = newRowData.measurementUnitId;
							args["customQuotationItem.unitPrice"] = newRowData.unitPrice;
							args["customQuotationItem.num"] = newRowData.num;
							
							url = api.quotation.updateCustomQuotationItem;
						}
						
						args["quotationDetail.autoId"] = _quotationDetail.autoId;
				 		args["quotationDetail.discount"] = _quotationDetail.discount;
				 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
				 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
				 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
				 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
				 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
				 		
				 		com.post(url, args, function(res){
				 			_grid.setCell(rowid, "uuid", res.quotationFunctionAreaItem.uuid);
				 			_grid.setCell(rowid, "qfaiId", res.quotationFunctionAreaItem.qfaiId);
				 		}, function(res){
				 			console.log(res)
				 		}, false);
				 		
						quotationDetail.lastEditId = -1;
						quotationDetail.lastEditGrid = "";
					
						var _length = $(this).getGridParam("reccount");
						var nextRowId = parseInt($("#" + $(this).attr("id") + " tr[id=" + rowid + "]>td")[0].textContent) + 1; // 通过行属性获取当前行位置索引
						
						if(nextRowId <= _length){
							$(this).children().children('tr')[nextRowId].click();
						}
						
					}, afterrestorefunc:function(rowid){
						quotationDetail.lastEditId = -1;
						quotationDetail.lastEditGrid="";
					}
				});
				
				quotationDetail.lastEditId = id;
				quotationDetail.lastEditGrid = $(this).attr("id");
			}
		}, gridComplete: function () {
			$(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-hdiv').hide();
        }
	});
}

//-------------------------------------------------报价项的格式化------------------------------------------
function deleteActionFormatter(cellvalue, options, rowObject){
	
	var str = "";
	var gid = options.gid;
	var rowId = options.rowId;
	
	var itemName = rowObject.itemName;
	
	str += '<div class="ui-pg-div">';
	
	if(itemName.search('车运费') == -1){
		if(cellvalue == undefined || cellvalue == "on"){
			str += '<label><input id="deleteItem_'+ rowId +'" name="deleteItems" class="cbox ace" type="checkbox" role="checkbox" /><span class="lbl align-top"></span></label>';
		}else{
			str += '<input id="deleteItem_'+ rowId +'" name="deleteItems" class="cbox ace" type="checkbox" role="checkbox" />';
		}
		
		str += '<a href="javascript:void(0)" class="" data="0" index="0" style="padding-left: 5px;text-decoration: none;" data-rel="tooltip" title="删除报价项" onclick="removeItem(' + gid + ',' + rowId + ')"><i class="bigger-125 icon-remove pink"></i></a>';
	}
	
	str += '<a href="javascript:void(0)" class="" data="0" index="0" style="padding-left: 5px;text-decoration: none;" data-rel="tooltip" title="查看报价信息" onclick="com.showInfo(\'' + rowObject.itemName + '\',\'' + rowObject.quotationItemDes + '\')"><i class="bigger-125 icon-search"></i></a>';
	str += '</div>';
	
	return str;
  }

function unitPriceFormatter(cellvalue, options, rowObject){

	if(rowObject.quotationClassificationId == '5'){//管理费
		return (parseFloat(rowObject.unitPrice) + parseFloat(quotationDetail.quotationDetail.notSalesmanRate)); // 不打折+非业务人员比例
	}else{
		return parseFloat(rowObject.unitPrice);
	}
}

function discountUnitPriceFormatter(cellvalue, options, rowObject){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreaIndex = $("#" + options.gid).attr("functionIndexData");
	
	if(_quotationDetail.functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]].functionAreaType == '普通'){ // 打折
		return Math.round(parseFloat(rowObject.unitPrice) * _quotationDetail.discount / 10 * 100) / 100;
	}else{
		if(rowObject.quotationClassificationId == '5'){ // 管理费
			return (parseFloat(rowObject.unitPrice) + parseFloat(_quotationDetail.notSalesmanRate)); // 不打折+非业务人员比例
		}else{
			return parseFloat(rowObject.unitPrice); // 不打折
		}
	}
}

function sumMoneyFormatter(cellvalue, options, rowObject){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreaIndex = $("#"+options.gid).attr("functionIndexData");
	
	if(typeof(cellvalue) == "number"){
		return cellvalue;
	}
	
	if(_quotationDetail.functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]].functionAreaType == '普通'){
		return  Math.round(parseFloat(rowObject.unitPrice) * _quotationDetail.discount * parseFloat(rowObject.num) / 10 * 100) / 100;
	}else if(rowObject.customFlag == 1 || (rowObject.itemName.search('管理费') == -1 && rowObject.itemName.search('车运费') == -1) ){
		return Math.round(parseFloat(rowObject.unitPrice) * parseFloat(rowObject.num) * 100) / 100; /* 不打折 */
	}else if(rowObject.itemName.search('管理费') != -1){
		return _quotationDetail.managePrice;
	}else if(rowObject.itemName.search('车运费') != -1){
		return _quotationDetail.carManagePrice; // 车运费
	}else{
		return 0;
	}
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="' + rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='" + rowObject.quotationItemDes+"' />";
	
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
	return $('input', cell).val();
}

//----------------------------------报价项的编辑和删除以及添加-----------------------------------------

function addItemToFunctionArea(functionAreaIndex, historyFlag){
	
	var message = "";
	var existMessage = "";
	var notAddMessage = "";
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var items = quotationDetail.selectQuotationItems;
	
//	var functionAreaIndex = $("#addItemFunctionAreaIndex").val();
	var functionAreaItemsTable = "functionAreaItemsTable_" + functionAreaIndex;
	
	var functionArea = _quotationDetail.functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]];
	var functionAreaItems = functionArea.items;
	
	var functionAreaItemNames = [];
	var functionAreaItemAutoIds = [];
	
	quotationDetail.selectQuotationItems = {};
	
	var functionAreaItemLength = functionAreaItems.length;
	
	for(var i=0;i<functionAreaItemLength;i++){
		var functionAreaItem = functionAreaItems[i];
		
		functionAreaItemNames.push(functionAreaItem.itemName);
		functionAreaItemAutoIds.push(parseInt(functionAreaItem.itemIdAutoId));
	}
	
	var rowNum = quotationDetail.quotationItemListGrid.getGridParam("reccount");
	
	for(var k in items){
		
		if(items[k] == null){
			continue;
		}
		
		var row = items[k];
		var addRow = {};
		
		var itemName = row.itemName;
		
		addRow.num = 0;
		addRow.itemName = itemName;
		addRow.quotationType = row.quotationType;
		addRow.quotationClassification = row.quotationClassification;
		addRow.quotationBigCategoryId = row.quotationBigCategoryId;
		addRow.quotationBigCategory = row.quotationBigCategory;
		addRow.measurementUnitId = row.measurementUnitId;
		addRow.measurementUnit = row.measurementUnit;
		addRow.unitPrice = row.unitPrice;
		addRow.quotationItemDes = row.quotationItemDes;
		addRow.workTypeId = row.workTypeId;
		addRow.workType = row.workType;
		addRow.itemIdAutoId = row.autoId;
		addRow.itemId = row.itemId;
		addRow.customFlag = 0;
		addRow.functionAreaId = functionArea.autoId;
		addRow.functionAreaName = functionArea.functionAreaName;
		
		addHistoryQuotationItem(addRow)
		
		if((functionArea.functionAreaType == '普通' && (row.quotationClassification == '基础部分' || row.quotationClassification == '其他部分')) || functionArea.functionAreaType == row.quotationClassification){
			var addFlag = true;
			
			if(functionAreaItemNames.indexOf(row.itemName) != -1){
				addFlag = false;
			}
			
			if(addFlag){ // 不存在
				var autoId = parseInt(row.autoId);
				
				functionAreaItemAutoIds.push(autoId);
				functionAreaItemAutoIds.sort(function(a, b){
					return a - b;
				});
				
				var autoIndex = functionAreaItemAutoIds.indexOf(autoId) - 1;
				var functionAreaItemNum = $("#" + functionAreaItemsTable).getGridParam("reccount");
				
				$("#" + functionAreaItemsTable).addRowData(autoId, addRow, "first", 0);
				
//				if(autoIndex < 0 && functionAreaItemNum == 0){
//					$("#" + functionAreaItemsTable).addRowData(0, addRow, "first", 0);
//				}else{
//					$("#" + functionAreaItemsTable).addRowData(functionAreaItemNum, addRow, "after", autoIndex); // functionAreaItemAutoIds.indexOf(autoId)-1
//				}
				
				if(itemName.search("管理费") != -1 || itemName.search("车运费") != -1){
					var args = {};
					
					args["quotationFunctionAreaItem.uuid"] = "";
					args["quotationFunctionAreaItem.functionAreaId"] = functionArea.autoId;
					args["quotationFunctionAreaItem.itemIdAutoId"] = row.autoId;
					args["quotationFunctionAreaItem.num"] = 0;
					
					args["quotationDetail.autoId"] = _quotationDetail.autoId;
			 		args["quotationDetail.discount"] = _quotationDetail.discount;
			 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
			 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
			 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
			 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
			 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;	
			 		
			 		com.post(api.quotation.updateQuotationFunctionAreaItem, args, function(res){
			 			addRow.uuid = res.quotationFunctionAreaItem.uuid;
			 		}, function(res){
			 			console.log(res);
			 		}, false);
			 		
			 		if(itemName.search("管理费") != -1){
			 			_quotationDetail.manageRate = addRow.unitPrice;
			 		}else if(itemName.search("车运费") != -1){
			 			_quotationDetail.carManageRate = addRow.unitPrice;
			 		}
				}
			}else{
				existMessage += row.itemName + ", ";
			}
		}else{
			notAddMessage += row.itemName + ", ";
		}
	}
	
	if(existMessage != ""){
		message += '报价项(' + existMessage + ')已在(' + functionArea.functionAreaType + ')功能区中存在! ';
	}
	if(notAddMessage != ""){
		message += '不能将报价项(' + notAddMessage + ')添加到(' + functionArea.functionAreaType + ')功能区中存在! ';
	}
	if(message != ""){
		bootbox.alert(message);
	}
	
	changeFunctionAreaItem(functionAreaItemsTable); // 更新报价项对应数据信息
	calQuotationDetailSum();
	updateManagePrice(); // 更新报价项中管理费类的信息
}

function removeItem(grideId, rowId){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	if(quotationDetail.lastEditId != -1 && quotationDetail.lastEditId != rowId){
		if(!submitFunctionAreaItem()){
			return false;
		}
	}
	
	var _grid = $(grideId);
	var row = _grid.jqGrid('getRowData', rowId);
	
	$(grideId).jqGrid('delRowData', rowId);
	
	var url = "";
	var args = {};
	
	if(row.customFlag == "0"){
		args["uuids[0]"] = row.uuid;
		
		url = api.quotation.deleteQuotationFunctionAreaItemByUuids;
	}else if(row.customFlag == "1"){
		args["autoIds[0]"] = row.qfaiId;
		
		url = api.quotation.deleteCustomQuotationItemByIds;
	}
	
	changeFunctionAreaItem(_grid.attr("id")); // 更新报价项对应数据信息
	calQuotationDetailSum(); // 计算汇总信息
	updateFunctionAreaSumList(); // 更新汇总信息
	updateManagePrice(); // 更新报价项中管理费类的信息
	
	args["quotationDetail.autoId"] = _quotationDetail.autoId;
	args["quotationDetail.discount"] = _quotationDetail.discount;
	args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
	args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
	args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
	args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
	args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
	
	com.post(url, args, function(res){
		console.log(res);
	}, function(res){
		console.log(res);
	}, false);
	
	$(".tooltip").remove();
	
	quotationDetail.lastEditId = -1;
	quotationDetail.saveFlag = true;
	
	return false;
}

function checkGridNum(value, colname){
	if(value.length <= 0 || value.length > 6)
		return [false, "\""+colname+"\"的长度应在1~5之间."];
	 if ((/^((\d)+(\.)?(\d)*)$/).test(value) == false){ 
         return [false, "\"" + colname + "\"需要不小于0的数浮点数"];
	 }else{ 
         return [true, ""];
	 }
}

function checkGridItemName(value, colname){
	if(value.length <= 0 || value.length > 100){
		return [false, "\"" + colname + "\"的长度应在1~100之间."];
	}else{ 
		return [true, ""];
	}
}

function checkGridQuotationItemDes(value, colname){
	if(value.length <= 0 || value.length > 501){
		return [false,"\"" + colname + "\"的长度应在1~500之间."];
	}else{
         return [true,""];
	}
}

function changeFunctionAreaItem(tableId){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreaIndex = $("#"+tableId).attr("functionIndexData");
	var functionArea = _quotationDetail.functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]];
	var functionAreaItems = functionArea.items;
	var _items = [];
	
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	
	var idsLength = ids.length;
	
	for(var i=0;i<idsLength;++i){
		var rowData = $("#"+tableId).jqGrid('getRowData', ids[i]);
		var item = {};
		
		var _item = functionAreaItems[i]
		
		item.customFlag = rowData.customFlag;
        item.itemId = rowData.itemId;
        item.itemIdAutoId = rowData.itemIdAutoId;
        item.itemName = rowData.itemName;
        item.measurementUnitId = rowData.measurementUnitId;
        item.num = rowData.num;
        item.quotationBigCategoryId = rowData.quotationBigCategoryId;
        item.quotationItemDes = rowData.quotationItemDes;
        item.quotationTypeId = rowData.quotationType;
        item.unitPrice =  rowData.unitPrice;
        item.uuid = (_item == undefined || _item == null) ? "" : _item.uuid;
        item.workTypeId = rowData.workTypeId;
        
        _items.push(item);
	}
	
	functionArea.items.splice(0);
	functionArea.items = _items;
}

function updateFunctionAreaSumList(){
	$("#functionAreaSumList").html("");
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var functionAreas = _quotationDetail.functionAreas;
	
	var functionAreaLength = functionAreas.length;
	
	for(var i =0;i<functionAreaLength;i++){
		var functionArea = functionAreas[i];
		
		if(functionArea.functionAreaName != '管理费'){ // 初始化功能区总值信息
			var sumDiv = $("<div></div>").addClass("col-md-12").appendTo($("#functionAreaSumList"));
			var functionAreaNameLabel = $("<label></label>").addClass("col-md-6 no-padding-right").attr("id", "sumLabfunctionAreaName_"+i).text(functionArea.functionAreaName).appendTo(sumDiv);
			var functionAreaMoneyLabel = $("<label></label>").addClass("col-md-6 no-padding-left").text(Math.round(functionArea.sum*100)/100).appendTo(sumDiv);
		}
	}
	
	var discountMoney  = Math.round(parseFloat(_quotationDetail.discountPrice) / (quotationDetail.quotationDetail.discount/10) * ((10 - _quotationDetail.discount) / 10) * 100) / 100;
	$("#sumLabSumMoney").html(Math.round((_quotationDetail.totalPrice + discountMoney) * 100) / 100);
	$("#sumLabDiscount").html(_quotationDetail.discount);
	$("#sumLabDiscountMoney").html(Math.round(_quotationDetail.totalPrice * 100) / 100);
	$("#quotationName").html(_quotationDetail.quotationName);
}

function submitFunctionAreaItem(){
	
	var result = true;
	
	if(quotationDetail.lastEditId != -1){
		
		var _quotationDetail = quotationDetail.quotationDetail;

		var _lastEditId = quotationDetail.lastEditId;
		var _lastEditGridId = quotationDetail.lastEditGrid;
		
		var _lastEditGrid = $("#" + _lastEditGridId);
		
		var gridEditRes = _lastEditGrid.jqGrid('saveRow', _lastEditId);
		
		if(gridEditRes){
			
			var newRowData = _lastEditGrid.getRowData(_lastEditId);
			var rn = _lastEditGrid.getCell(_lastEditId, "rn");
			var su = _lastEditGrid.jqGrid('setRowData', _lastEditGridId, newRowData);
			
			quotationDetail.lastEditId = -1;
			
			changeFunctionAreaItem(_lastEditGridId); // 更新报价项对应数据信息
			updateFunctionAreaItem(_lastEditGrid, _lastEditGridId, _lastEditId, rn); // 更新报价项信息
			calQuotationDetailSum(); // 计算汇总信息
			updateFunctionAreaSumList(); // 更新汇总信息
			updateManagePrice(); // 更新报价项中管理费类的信息
			
			var url = "";
			var args = {};
			
			if(newRowData.customFlag == 0){
				args["quotationFunctionAreaItem.uuid"] = newRowData.uuid;
				args["quotationFunctionAreaItem.functionAreaId"] = newRowData.functionAreaId;
				args["quotationFunctionAreaItem.itemIdAutoId"] = newRowData.itemIdAutoId;
				args["quotationFunctionAreaItem.num"] = newRowData.num;
				
				url = api.quotation.updateQuotationFunctionAreaItem;
			}else if(newRowData.customFlag == 1){
				args["customQuotationItem.autoId"] = newRowData.qfaiId;
				
				args["customQuotationItem.itemName"] = newRowData.itemName;
				args["customQuotationItem.quotationBigCategoryId"] = newRowData.quotationBigCategoryId;
				args["customQuotationItem.measurementUnitId"] = newRowData.measurementUnitId;
				args["customQuotationItem.unitPrice"] = newRowData.unitPrice;
				args["customQuotationItem.num"] = newRowData.num;
				
				url = api.quotation.updateCustomQuotationItem;
			}
			
			args["quotationDetail.autoId"] = _quotationDetail.autoId;
	 		args["quotationDetail.discount"] = _quotationDetail.discount;
	 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
	 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
	 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
	 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
	 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
	 		
	 		com.post(url, args, function(res){
	 			console.log(res);
	 			
	 			if(newRowData.customFlag == 0){
	 				_lastEditGrid.setCell(_lastEditId, "uuid", res.quotationFunctionAreaItem.uuid);
		 			_lastEditGrid.setCell(_lastEditId, "qfaiId", res.quotationFunctionAreaItem.qfaiId);
	 			}else if(newRowData.customFlag == 1){
		 			_lastEditGrid.setCell(_lastEditId, "qfaiId", res.customQuotationItem.autoId);
	 			}
	 		}, function(res){
	 			console.log(res)
	 		}, false);
		}else{
			result = false;
		}
	}
	
	return result;
}

function addFunctionAreaItem(){
	
	var functionAreaIndex = $(this).attr("data");
	
	if(!submitFunctionAreaItem()){
		return false;
	}
    
	$("#itemNameSearch").val("");
	$("#quotationWorkTypeSearch").val("");
	$("#quotationBigCategorySearch").val("");
	$("#quotationSmallCategorySearch").val("");
	
	$("#addItemFunctionAreaIndex").val(functionAreaIndex);
	
	quotationDetail.postParam.versionId = quotationDetail.quotationDetail.versionId;
	
	quotationDetail.postParam["quotationItem.versionId"] = quotationDetail.quotationDetail.versionId;
	
	$.jgrid.refreshGrid(quotationDetail.quotationItemListGrid, quotationDetail.postParam);
	
	quotationDetail.selectQuotationItems = {};
	
	quotationDetail.quotationItemModal.modal("show");
	
	return false;
}

function customFunctionAreaItem(){
	
	com.clearValidator();
	
	$("#itemName").val("");
	$("#quotationItemDes").val("");
	$("#unitPrice").val("");
	$("#num").val("");
	$("#quotationBigCategory").get(0).selectedIndex = 0;
	$("#measurementUnit").get(0).selectedIndex = 0;
	$("#workType").get(0).selectedIndex = 0;
	
	quotationDetail.customerQuotationFunctionAreaIndex = $(this).attr("data");
	quotationDetail.selectQuotationItems = {};
	
	quotationDetail.customFunctionAreaItemsModal.modal("show");
	
	return false;
}

function historyFunctionAreaItem(){
	
	var functionAreaIndex = $(this).attr("data");
	
	if(!submitFunctionAreaItem()){
		return false;
	}
	
	$("#addItemFunctionAreaIndex").val(functionAreaIndex);
	
	$.jgrid.refreshGrid(quotationDetail.historyQuotationItemListGrid, {});
	
//	quotationDetail.historyQuotationItemListGrid.jqGrid('setGridParam', {datatype:'local', data:quotationDetail.historyQuotationItems}).trigger("reloadGrid"); //重新载入
	
	initHistoryQuotationItemList();
	
	quotationDetail.selectQuotationItems = {};
	
	quotationDetail.historyQuotationItemModal.modal("show");
	
	return false;
}

function editFunctionArea(){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	var functionAreas = _quotationDetail.functionAreas;
	var functionAreaIndex = $(this).attr("data");
	var functionArea = functionAreas[_quotationDetail.functionAreaId2Index[functionAreaIndex]];
	
	if(!submitFunctionAreaItem()){ // 提交正在编辑的信息
		return false;
	}
	
	var functionAreaLength = functionAreas.length;
	
	for(var i=0;i<functionAreaLength;i++){
		if(functionAreaIndex == functionAreas[i].id){
			$("#functionAreaName").val(functionAreas[i].functionAreaName);
			$("#functionAreaIndex").val(functionAreaIndex);
			$("#functionAreaOrder").val(functionAreas[i].functionAreaOrder);
		}
	}
	
	com.clearValidator();
	
	quotationDetail.functionAreaModal.modal("show");
	
	return false;
}

function removeFunctionAreaItems(){
	
	var _quotationDetail = quotationDetail.quotationDetail;
	
	var functionAreaIndex = $(this).attr("data");
	
	if(!submitFunctionAreaItem()){
		return false;
	}
	
	var gridTableId = "functionAreaItemsTable_" + functionAreaIndex;
	var gridTable = $("#" + gridTableId);
	
	var ii = 0;
	var ci = 0;
	var args = {};
	
	$("[name='deleteItems']").each(function(i, e){
		if(e.checked){
			
			var rowId = e.id.split('_')[1];
			
			var row = gridTable.jqGrid('getRowData', rowId);
			
			if(row.customFlag == "0" && row.uuid){
				args["uuids[" + ii + "]"] = row.uuid;
				
				ii++;
			}else if(row.customFlag == "1" && row.qfaiId){
				args["autoIds[" + ci + "]"] = row.qfaiId;
				
				ci++;
			}
			
	 		gridTable.jqGrid('delRowData', rowId);
	     }
	 });
	
	changeFunctionAreaItem(gridTableId); // 更新报价项对应数据信息
	calQuotationDetailSum(); // 计算汇总信息
	updateFunctionAreaSumList(); // 更新汇总信息
	updateManagePrice(); // 更新报价项中管理费类的信息
	
	args["quotationDetail.autoId"] = _quotationDetail.autoId;
	args["quotationDetail.discount"] = _quotationDetail.discount;
	args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
	args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
	args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
	args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
	args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
	
	com.post(api.quotation.deleteQuotationFunctionAreaItemByUuids, args, function(res){
		console.log(res);
	}, function(res){
		console.log(res);
	});
	
	com.post(api.quotation.deleteCustomQuotationItemByIds, args, function(res){
		console.log(res);
	}, function(res){
		console.log(res);
	});
	
	quotationDetail.saveFlag = true;
}

function deleteFunctionArea(){
	
	var _quotationDetail = quotationDetail.quotationDetail;

	var functionAreas = _quotationDetail.functionAreas;
	var functionAreaIndex = $(this).attr("data");
	
	if(quotationDetail.lastEditId != -1 && "functionAreaItemsTable_" + functionAreaIndex != quotationDetail.lastEditGrid){
		if(!submitFunctionAreaItem()){
			return false;
		}
	}
	
	bootbox.confirm("确定要删除功能区吗？", function(res){
		if(res){
			
			var removeFunctionAreaAutoId = -1;
			
			var holdFunctionAreas = [];
			
			var functionAreaLength = functionAreas.length;
			
			for(var i=0;i<functionAreaLength;i++){
				
				var functionArea = functionAreas[i];
				
				if(functionAreaIndex == functionArea.id){
//					functionAreas.splice(i, 1);
					$("#oneFunctionArea_" + functionAreaIndex).remove();
					removeFunctionAreaAutoId = functionArea.autoId;
				}else{
					holdFunctionAreas.push(functionArea);
				}
			}
			
			quotationDetail.quotationDetail.functionAreas = holdFunctionAreas;
			
			mapFunctionArea();
			calQuotationDetailSum(); // 计算汇总信息
			updateFunctionAreaSumList(); // 更新汇总信息
			updateManagePrice(); // 更新报价项中管理费类的信息
			
			quotationDetail.lastEditId = -1;
			quotationDetail.saveFlag = true;
			
			if(removeFunctionAreaAutoId > 0){
				
				var args = {};
				
				args["quotationFunctionArea.autoId"] = removeFunctionAreaAutoId;
				
				args["quotationDetail.autoId"] = _quotationDetail.autoId;
		 		args["quotationDetail.discount"] = _quotationDetail.discount;
		 		args["quotationDetail.totalPrice"] = _quotationDetail.totalPrice;
		 		args["quotationDetail.latexCut"] = _quotationDetail.latexCut;
		 		args["quotationDetail.managePrice"] = _quotationDetail.managePrice;
		 		args["quotationDetail.manageRate"] = _quotationDetail.manageRate;
		 		args["quotationDetail.trafficPrice"] = _quotationDetail.trafficPrice;
		 		
		 		com.post(api.quotation.deleteQuotationFunctionArea, args, function(res){
		 			console.log(res);
		 		}, function(res){
		 			console.log(res);
		 		});
			}
		}
	});
	
	return false;
}

function addHistoryQuotationItem(item){
	
	var itemIdAutoId = parseInt(item.itemIdAutoId);
	
	var historyQuotationItemIds = quotationDetail.historyQuotationItemIds;
	var historyQuotationItems = quotationDetail.historyQuotationItems;
	
	if(historyQuotationItemIds.indexOf(itemIdAutoId) < 0){
		
		item.autoId = itemIdAutoId;
		
		historyQuotationItemIds.push(itemIdAutoId);
		historyQuotationItems.push(item);
	}
}

function initTooltip(id){
//	$('[data-rel="tooltip"]').tooltip('destroy');
//	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
}

//-------------------------------------------------------------save -------------------------------

function saveQuotationDetail(cleanFlag, btnId){
	
	var option = {};
	
	var _quotationDetail = quotationDetail.quotationDetail;
	var latexCutScale = _quotationDetail.latexCutScale;
	var trafficPriceScale = _quotationDetail.trafficPriceScale;
	
	var latexCut = 0;
	var trafficPrice = 0;
	
	var functionAreaLength = _quotationDetail.functionAreas.length;
	
	for(var i = 0;i<functionAreaLength;++i){
		
		var functionArea = _quotationDetail.functionAreas[i];
		
		option['quotationDetail.functionAreas['+i+'].id'] = functionArea.id;
		option['quotationDetail.functionAreas['+i+'].autoId'] = functionArea.autoId;
		option['quotationDetail.functionAreas['+i+'].functionAreaName'] = functionArea.functionAreaName;
		option['quotationDetail.functionAreas['+i+'].functionAreaOrder'] = functionArea.functionAreaOrder;
		option['quotationDetail.functionAreas['+i+'].functionAreaType'] = functionArea.functionAreaType;
		
		var jindex = 0;
		var functionAreaItemLength = _quotationDetail.functionAreas[i].items.length;
		
		for(var j=0;j<functionAreaItemLength;++j){
			
			var item = functionArea.items[j];
			
			if(cleanFlag && item.num == 0 && (item.customFlag == 1 || (item.customFlag == 0 && item.itemName.search('车运费') == -1 && item.itemName.search('管理费') == -1))){
				continue;
			}
			
			if(latexCutScale[item.itemIdAutoId] != undefined || latexCutScale[item.itemIdAutoId] != null){
				latexCut = utils.accAdd(latexCut, utils.accMul(parseFloat(item.num), parseFloat(latexCutScale[item.itemIdAutoId])));
			}
			
			if(trafficPriceScale.indexOf(parseInt(item.itemIdAutoId)) != -1){
				trafficPrice = utils.accAdd(trafficPrice, utils.accMul(parseFloat(item.num), item.unitPrice));
			}
			
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].customFlag'] = item.customFlag;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].itemId'] = item.itemId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].itemIdAutoId'] = item.itemIdAutoId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].itemName'] = item.itemName;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].measurementUnitId'] = item.measurementUnitId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].measurementUnit'] = item.measurementUnit;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].num'] = item.num;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationBigCategory'] = item.quotationBigCategory;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationBigCategoryId'] = item.quotationBigCategoryId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationClassification'] = item.quotationClassification;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationClassificationId'] = item.quotationClassificationId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].unitPrice'] = item.unitPrice;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].uuid'] = item.uuid;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].workType'] = item.workType;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].workTypeId'] = item.workTypeId;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationItemDes'] = item.quotationItemDes;
			
			jindex++;
		}	
	}
	
	option['quotationDetail.autoId'] = _quotationDetail.autoId;
	option['quotationDetail.contractTime'] = _quotationDetail.contractTime;
	option['quotationDetail.decorationStyle'] = _quotationDetail.decorationStyle;
	option['quotationDetail.designer'] = _quotationDetail.designer;
	option['quotationDetail.designerId'] = _quotationDetail.designerId;
	option['quotationDetail.discount'] = _quotationDetail.discount;
	option['quotationDetail.orderActivity'] = _quotationDetail.orderActivity;
	option['quotationDetail.orderActivityDiscount'] = _quotationDetail.orderActivityDiscount;
	option['quotationDetail.orderId'] = _quotationDetail.orderId;
	option['quotationDetail.orderStatus'] = _quotationDetail.orderStatus;
	option['quotationDetail.orderTotalPrice'] = _quotationDetail.orderTotalPrice;
	option['quotationDetail.totalPrice'] = _quotationDetail.totalPrice;
	option['quotationDetail.versionId'] = _quotationDetail.versionId;
	option['quotationDetail.quotationName'] = _quotationDetail.quotationName;
	option['quotationDetail.status'] = _quotationDetail.status;
	option['quotationDetail.saveStatus'] = _quotationDetail.saveStatus;
	option['quotationDetail.manageRate'] = _quotationDetail.manageRate;
	option['quotationDetail.carManageRate'] = _quotationDetail.carManageRate;
	option['quotationDetail.managePrice'] = _quotationDetail.managePrice;
	option['quotationDetail.carManagePrice'] = _quotationDetail.carManagePrice;
	option['quotationDetail.latexCut'] = latexCut;
	option['quotationDetail.trafficPrice'] = trafficPrice;
	
	var btn = $("#" + btnId).button('loading');
	
	com.post(api.quotation.saveQuotaionDetail, option, function(res){
		
		if(res.errorCode != 0){
			bootbox.alert(res.errorMsg);
		}else{
			
			if(cleanFlag == 1){
				$("#fl-container").load(api.index.quotationIndex.url, {}, function(){
					decorationQuotation.decorationOrderId = quotationDetail.decorationOrderId;
					
					decorationQuotation.initQuotationList();
				});
			}else{
				quotationDetail.quotationDetail.functionAreas = res.quotationDetail.functionAreas;
			}
		}
		
		setTimeout(function(){
			btn.button('reset');
			quotationDetail.spinner.hide();
		}, 1000);
	}, function(res){
		setTimeout(function(){
			btn.button('reset');
			quotationDetail.spinner.hide();
		}, 1000);
	}, false);
	
}

function initStatisticalInfo(){
	
}