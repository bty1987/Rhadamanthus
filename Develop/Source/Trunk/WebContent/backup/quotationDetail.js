var quotationDetail = {
		
		quotationId:null,
		decorationOrderId:null,
		
		quotationDetail:null,
		loadQuotationDetail:loadQuotationDetail,
		initQuotationDetail:initQuotationDetail,
		loadDiscount:10,

		queryQuotationDetailByIdUrl:"queryQuotationDetailById.do",
		saveQuotaionDetailUrl:"saveQuotaionDetail.do",
		
		queryQuotationTypeUrl: "queryQuotationType.do",
		queryQuotationClassificationUrl: "queryQuotationClassification.do",
		queryQuotationBigCategoryUrl: "queryQuotationBigCategory.do",
		queryQuotationSmallCategoryUrl: "queryQuotationSmallCategory.do",
		queryMeasurementUnitUrl: "queryMeasurementUnit.do",
		queryWorkTypeUrl: "queryWorkType.do",
		
		queryAllFunctionAreasByVersionIdUrl:"queryFunctionAreaByVersionId.do",
		
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
		listInitFlag : false,
		postParam:{},
		queryQuotationItemUrl: "pageQuotationItemByVersionId.do",
		applayDiscountApproveUrl:"approveQuotationForDiscount.do"
};

jQuery(function($) {
	$('#jh-statement').statement("装修订单报价", "报价信息详细");
	
	main.skipFlag = true;
	
	quotationDetail.decorationOrderId = params.orderId;
	quotationDetail.quotationId = params.quotationId;
	
	quotationDetail.functionAreaTemplateModal = $("#functionAreaTemplateModal");
	quotationDetail.quotationItemModal = $("#quotationItemModal");
	
	quotationDetail.customFunctionAreaItemsModal = $("#customFunctionAreaItemsModal");
	
	quotationDetail.quotationItemSearchDiv = $("#quotationItemSearchDiv");
	quotationDetail.quotationItemListGrid = $("#quotationItemListGrid");
	quotationDetail.quotationItemGridPager = $("#quotationItemGridPager");
	
	quotationDetail.functionAreaModal = $("#functionAreaModal");
	quotationDetail.discountModal = $("#discountModal");
	
	quotationDetail.spinner = $("#spinner");
	
	initDataMap();
		
	//---------------------------------------------功能区模板--------------
	
	$("#functionAreaTemplateBtn").click(function(){
		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}

		$(".tree-item").removeClass("tree-selected");
		$(".tree-item i").addClass("icon-remove");
		quotationDetail.functionAreaTemplateModal.modal("show");
	});
	
	$('#addFunctionAreasBtn').on('click', function () {
		
		var option = {};
		var selectNodes = $('#functionAreaTemplateTree').tree('selectedItems');
		
		if(selectNodes.length <= 0){
			quotationDetail.functionAreaTemplateModal.modal("hide");
			return;
		}
		
		for(var i=0;i<selectNodes.length;++i){
			option['functionAreaIds['+i+']'] = selectNodes[i].additionalParameters.id;
		}
 		com.post(api.quotation.queryQuotationFunctionAreaByIds.url, option, function(res){
 			if(res.errorCode == 0){
 				for(var j=0;j<res.quotationFunctionAreas.length;++j){
 					res.quotationFunctionAreas[j].collapsed = true;
 					quotationDetail.quotationDetail.functionAreas.push(res.quotationFunctionAreas[j]);
 				}
 				initQuotationDetail();
 				quotationDetail.functionAreaTemplateModal.modal("hide");
 			}else{
 				bootbox.alert("系统异常");
 			}
 		});
 		
	});
//------------------------------------------------------------------折扣修改-------------------------
	$('#discountBtn').on(ace.click_event, function(){
		//折扣界面
		com.clearValidator();
		com.clearValidator("#discount", true);
		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}

		$("#discount").val(quotationDetail.quotationDetail.discount);
		$("#limitDiscount").val(quotationDetail.quotationDetail.orderActivityDiscount);
		quotationDetail.discountModal.modal("show");
	});
	
	$('#saveDisCountBtn').on(ace.click_event, function(){
		//折扣界面	
		if(com.validate())
			return;
		
		var dis = $("#discount").val();
		if(parseFloat(dis)<=0|| parseFloat(dis)>10){
			com.showTips($("#discount"), "折扣非法", true);
			return;
		}else{
			com.clearValidator("#discount", true);
		}
		
		if(parseFloat(dis)<quotationDetail.quotationDetail.orderActivityDiscount && parseFloat(dis)<quotationDetail.loadDiscount){
			bootbox.prompt("折扣审批",function(res){
				if (res === null) {
					//Example.show("Prompt dismissed");
				} else {
					
					quotationDetail.quotationDetail.discount = quotationDetail.quotationDetail.orderActivityDiscount>quotationDetail.loadDiscount?quotationDetail.loadDiscount: quotationDetail.quotationDetail.orderActivityDiscount;
					var option = {};
					
					option['quotationDetail.autoId']=quotationDetail.quotationDetail.autoId;
					option['quotationDetail.discount']=dis;
					option['quotationDetail.orderId']=quotationDetail.quotationDetail.orderId;
					option['quotationDetail.applayContent'] = res;
					com.post(api.quotation.approveQuotationForDiscount.url, option, function(res){
						com.showAlert(com.info, "折扣申请成功");
					});
					initQuotationDetail();//界面级联修改

					quotationDetail.discountModal.modal("hide");
				}
			});
		}else{		
			quotationDetail.quotationDetail.discount =  Math.round(parseFloat(dis)*100)/100;
			initQuotationDetail();//界面级联修改

			quotationDetail.discountModal.modal("hide");
		}	
	});
	
	
//	
//	$('.dd').nestable({maxDepth:2});
//	$('.dd-handle a').on('mousedown', function(e){
//		e.stopPropagation();
//	});
	
//----------------------------------------------返回----------------------------
	$('#detailBckBtn').on(ace.click_event, function(){
		bootbox.confirm("当前页面存在重要数据,是否进行当前操作?", function(result) {
			if(result){
				$("#fl-container").load("quotationIndex.do",{},function(){
					decorationQuotation.decorationOrderId=quotationDetail.decorationOrderId;
					decorationQuotation.initQuotationList();
				});
			}
		});
	});
//----------------------------------------保存----------------
	$('#saveQuotationDetailBtn').on(ace.click_event, function(){
		
		quotationDetail.spinner.show();
		
		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}
		
		var btn = $(this);

		saveQuotationDetail(0, btn.attr('id'));
	});
	
	$('#saveQuotationDetailOKBtn').on(ace.click_event, function(){
		
		if(quotationDetail.lastEditId != -1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}
		
		var btn = $(this);

		bootbox.confirm("提交后工程量为0的报价项将被删掉,确认提交吗？",function(res){
			
			if(res == false){
				return;
			}else{
				
				quotationDetail.spinner.show();
				
				saveQuotationDetail(1, btn.attr('id'));
			}
		});
	});
	
//---------------------------------------功能区编辑-------------------------------	
	$('#saveFunctionAreaBtn').on(ace.click_event, function(){
		//编辑功能区页面
		if(com.validate())
			return;
		
		var functionAreaIndex = $("#functionAreaIndex").val();
		
		quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaName = $("#functionAreaName").val();
		quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaOrder = $("#functionAreaOrder").val();
		
		initQuotationDetail();
		
		quotationDetail.functionAreaModal.modal("hide");
	});
	
//------------------------------------------------添加报价项------------------------
	$("#addFunctionAreaItemsBtn").on(ace.click_event, function(event){
		
		var nums = quotationDetail.quotationItemListGrid.jqGrid("getGridParam","selarrrow");

		var functionAreaIndex = $("#addItemFunctionAreaIndex").val();
		var functionArea = quotationDetail.quotationDetail.functionAreas[functionAreaIndex];
		var options = {};
		
		if(nums.length!=0){
			if(quotationDetail.lastEditId!=-1){
				$("#"+quotationDetail.lastEditGrid).jqGrid('restoreRow',quotationDetail.lastEditId);
				quotationDetail.lastEditId=-1;
			}
			
			var ids = $("#functionAreaItemsTable_"+functionAreaIndex).jqGrid('getDataIDs');
			var maxid = Math.max.apply(null, ids);
			if(maxid == -Infinity)
				maxid = 0;
			
			for(var i = 0; i< nums.length; i++){
				var row = quotationDetail.quotationItemListGrid.jqGrid('getRowData', nums[i]);

				var addRow = {};
				addRow.num = 0;
				addRow.itemName = row.itemName;
				addRow.quotationBigCategoryId = row.quotationBigCategoryId;
				addRow.measurementUnitId = row.measurementUnitId;
				addRow.unitPrice = row.unitPrice;
				addRow.quotationItemDes = row.quotationItemDes;
				addRow.workTypeId = row.itemWorkTypeId;
				addRow.itemIdAutoId = row.autoId;
				addRow.itemId = row.itemId;
				addRow.customFlag = 0;
				if((functionArea.functionAreaType=='普通' && (row.quotationClassification=='基础部分'||row.quotationClassification=='其他部分'))||functionArea.functionAreaType == row.quotationClassification){
					var addFlag = true;
					for(var loop=0;loop<functionArea.items.length;++loop){
						if(functionArea.items[loop].itemName == row.itemName){
							addFlag = false;
							break;
						}
					}
					if(addFlag){//不存在
						$("#functionAreaItemsTable_"+functionAreaIndex).jqGrid('addRowData',maxid+1,addRow,"first");
						maxid++;
					}else{
						bootbox.alert('报价项('+row.itemName+')已在('+functionArea.functionAreaType+')功能区中存在!');
					}
					
				}else{
					bootbox.alert('不能将报价项('+row.itemName+')添加到('+functionArea.functionAreaType+')功能区中!');
				}	
			}
			calQuotationDetailSum();
			changeFunctionAreaItem("functionAreaItemsTable_"+functionAreaIndex);
			initQuotationDetail();
		}
		 
		quotationDetail.quotationItemModal.modal("hide");
		event.stopPropagation();
	});
	
	$("#addCustomFunctionAreaItemsBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		$("#itemName").val("");
		$("#quotationItemDes").val("");
		$("#unitPrice").val("");
		$("#num").val("");
		$("#quotationBigCategory").get(0).selectedIndex = 0;
		$("#measurementUnit").get(0).selectedIndex = 0;
		$("#itemWorkType").get(0).selectedIndex = 0;
		
		quotationDetail.customFunctionAreaItemsModal.modal("show");
		event.stopPropagation();
	});
	
	$("#saveCustomFunctionAreaItemBtn").on(ace.click_event, function(event){
		if(com.validate())
			return;
		var functionAreaIndex = $("#addItemFunctionAreaIndex").val();
		
		var addRow = {};
		addRow.num = $("#num").val();
		addRow.itemName = $("#itemName").val();
		addRow.quotationBigCategoryId = $("#quotationBigCategory").val();
		addRow.measurementUnitId = $("#measurementUnit").val();
		addRow.unitPrice = $("#unitPrice").val();
		addRow.quotationItemDes = $("#quotationItemDes").val();
		addRow.workTypeId = $("#itemWorkType").val();
		addRow.customFlag = 1;

		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
	
		}
		var ids = $("#functionAreaItemsTable_"+functionAreaIndex).jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		$("#functionAreaItemsTable_"+functionAreaIndex).jqGrid('addRowData',maxid+1,addRow,"first");
		
		calQuotationDetailSum();
		changeFunctionAreaItem("functionAreaItemsTable_"+functionAreaIndex);
		initQuotationDetail();
		
		quotationDetail.customFunctionAreaItemsModal.modal("hide");
		event.stopPropagation();
	});
	
	
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
	
//---------------------------------------------------报价统计----------------------------
	$("#viewStatisticalBtn").on(ace.click_event, function(event){
		$("#quotationStatisticalModal").modal("show");
	});
	
	$("#quotationStatisticalModal").on('shown.bs.modal',function(e){
		initStatisticalInfo();
	});
	
	loadQuotationDetail();
});

//---------------------------------------------字典初始化--------------------------------
function initDataMap(){
	com.post(quotationDetail.queryQuotationTypeUrl,{},function(res){
		if(res.errorCode==0){
			quotationDetail.quotationTypes = res.quotationTypes;
			quotationDetail.quotationTypesStr = "";
			var tem = 0;
			for(tem=0;tem<res.quotationTypes.length;++tem){
				quotationDetail.quotationTypesStr+=(res.quotationTypes[tem].id+":"+res.quotationTypes[tem].name+";");
			}
			
			quotationDetail.quotationTypesStr = quotationDetail.quotationTypesStr.substr(0,quotationDetail.quotationTypesStr.length-1);
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(quotationDetail.queryMeasurementUnitUrl,{},function(res){
		if(res.errorCode==0){
			quotationDetail.measurementUnits = res.measurementUnits;
			quotationDetail.measurementUnitsStr= "";
			var tem = 0;
			for(tem=0;tem<res.measurementUnits.length;++tem){
				quotationDetail.measurementUnitsStr+=(res.measurementUnits[tem].id+":"+res.measurementUnits[tem].name+";");
			}
			quotationDetail.measurementUnitsStr = quotationDetail.measurementUnitsStr.substr(0,quotationDetail.measurementUnitsStr.length-1);
			$("#measurementUnit").bindData(quotationDetail.measurementUnits, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(quotationDetail.queryQuotationBigCategoryUrl,{},function(res){
		if(res.errorCode==0){
			quotationDetail.quotationBigCategorys = res.quotationBigCategorys;
			quotationDetail.quotationBigCategorysStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationBigCategorys.length;++tem){
				quotationDetail.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
			}
			quotationDetail.quotationBigCategorysStr = quotationDetail.quotationBigCategorysStr.substr(0,quotationDetail.quotationBigCategorysStr.length-1);
			
			$("#quotationBigCategory").bindData(quotationDetail.quotationBigCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(quotationDetail.queryQuotationSmallCategoryUrl,{},function(res){
		if(res.errorCode==0){
			quotationDetail.quotationSmallCategorys = res.quotationSmallCategorys;
			quotationDetail.quotationSmallCategorysStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationSmallCategorys.length;++tem){
				quotationDetail.quotationSmallCategorysStr+=(res.quotationSmallCategorys[tem].id+":"+res.quotationSmallCategorys[tem].name+";");
			}
			quotationDetail.quotationSmallCategorysStr = quotationDetail.quotationSmallCategorysStr.substr(0,quotationDetail.quotationSmallCategorysStr.length-1);
			
			//$("#quotationSmallCategory").bindData(quotationDetail.quotationSmallCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(quotationDetail.queryWorkTypeUrl,{},function(res){
		if(res.errorCode==0){
			quotationDetail.workTypes = res.workTypes;
			quotationDetail.workTypesStr="";
			var tem = 0;
			for(tem=0;tem<res.workTypes.length;++tem){
				quotationDetail.workTypesStr+=(res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
			}
			quotationDetail.workTypesStr = quotationDetail.workTypesStr.substr(0,quotationDetail.workTypesStr.length-1);
			
			$("#itemWorkType").bindData(quotationDetail.workTypes, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(quotationDetail.queryQuotationClassificationUrl,{},function(res){
		if(res.errorCode==0){
			
			quotationDetail.quotationClassifications = res.quotationClassifications;
			quotationDetail.quotationClassifications="";
			var tem = 0;
			for(tem=0;tem<res.quotationClassifications.length;++tem){
				quotationDetail.quotationClassificationsStr+=(res.quotationClassifications[tem].id+":"+res.quotationClassifications[tem].name+";");
			}
			quotationDetail.quotationClassificationsStr =quotationDetail.quotationClassificationsStr.substr(0,quotationDetail.quotationClassificationsStr.length-1);
		}else{
			bootbox.alert("系统异常");
		}
	});
}

//--------------------------------------------------------服务器端加载数据-------------------------------------------------------
function loadQuotationDetail(){
	
	console.log(quotationDetail.quotationId);
	
	com.post(quotationDetail.queryQuotationDetailByIdUrl, {"quotationDetail.autoId":quotationDetail.quotationId}, function(res){
		if(res.errorCode == 0){
			quotationDetail.quotationDetail = res.quotationDetail;
			quotationDetail.loadDiscount = res.quotationDetail.discount;
			
			$("#functionAreaDetailList").html("");
			
			//加载模板功能区
			com.post(quotationDetail.queryAllFunctionAreasByVersionIdUrl,{"functionArea.versionId":quotationDetail.quotationDetail.versionId},function(res){
				if(res.errorCode==0){
					quotationDetail.versionFunctionAreas = res.functionAreas;
					
					initFunctionAreaTemplate();
					initQuotationItemList();
					initQuotationDetail();
					
				}else{
					bootbox.alert("系统异常");
				}
			});
						
		}else{
			bootbox.alert("操作失败");
		}
	});
}

function initQuotationItemList(){
	
	var quotationItemSearchOpts = {
		url: quotationDetail.queryQuotationItemUrl,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId":quotationDetail.quotationDetail.versionId},
		listgrid: quotationDetail.quotationItemListGrid,
		items: [{label:"名称",id:"itemNameSearch",name:"itemName", type:'text'},
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
	
	quotationDetail.quotationItemListGrid.jqGrid({		
		url: quotationDetail.queryQuotationItemUrl,
		postData:quotationDetail.postParam,
		multiboxonly: false,
		colNames:['autoId','编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '单价', '说明', '版本', 'itemWorkTypeId', 'measurementUnitId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationTypeId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:300,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkType', width:40, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'unitPrice', width:50},
			//{name:'quotationItemDes',hidden: false},
			{name:"quotationItemDes", width:50,formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat},
			{name:'version',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategoryId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId',hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		gridComplete: function () {
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
		},
		autowidth:false,
		width:810,
		rowNum:50,
		rowList:[50,100,200],
		height: '450',
		pager : quotationDetail.quotationItemGridPager,
		caption: ""
	});

	//navButtons
	quotationDetail.quotationItemListGrid.navGrid(quotationDetail.quotationItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initFunctionAreaTemplate(){
	
	$('#functionAreaTemplateTree').html("");
	var tree_data = {};
	var index = 0;
	for(var i=0;i<quotationDetail.versionFunctionAreas.length;++i){
		if((quotationDetail.versionFunctionAreas[i].functionAreaType == '管理费') == false){
			++index;
			var node = {
				name:quotationDetail.versionFunctionAreas[i].functionAreaName,
				additionalParameters: { id: quotationDetail.versionFunctionAreas[i].autoId },
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
function sortFunctionAreaOrder(a,b){
	return a.functionAreaOrder - b.functionAreaOrder;
}

function calQuotationDetailSum(){
	var temQuotationDetail = quotationDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;

	quotationDetail.quotationDetail.manageRate =  0;
	quotationDetail.quotationDetail.carManageRate = 0;
	//排序
	functionAreas.sort(sortFunctionAreaOrder);
	
	var totalPrice = 0; //总价
	var normalPrice = 0; // 正常价格
	var discountPrice = 0; //折后价格
	var noDiscountTotalPrice = 0; // 不打折
	var carManagePrice = 0; // 车运费
	var managePrice = 0; // 管理费
	
	var carManageFunctionAreaIndex = -1;
	var manageFunctionAreaIndex = -1;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		functionAreas[i].sum = 0;
		if(functionAreas[i].functionAreaType == '普通'){ // 参与打折
			var sum = 0;
			var preDiscountSum = 0;
			
			for(var j=0;j<functionAreas[i].items.length;j++){
				sum += Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*quotationDetail.quotationDetail.discount*parseFloat(functionAreas[i].items[j].num)/10)*100)/100;
				preDiscountSum += Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * parseFloat(functionAreas[i].items[j].num)) * 100) / 100;
			}
			
			functionAreas[i].sum = sum;
			normalPrice += preDiscountSum;
			discountPrice += sum;
			totalPrice+=sum;
		}else {
			var sum = 0;
			for(var j=0;j<functionAreas[i].items.length;j++){
				if(((functionAreas[i].items[j].itemName.search('车运费') == -1) && (functionAreas[i].items[j].itemName.search('管理费') == -1))){ // 不打折
					sum += Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * parseFloat(functionAreas[i].items[j].num)) * 100) / 100;
				}else if((functionAreas[i].items[j].itemName.search('车运费') != -1)){
					carManageFunctionAreaIndex = i;
					quotationDetail.quotationDetail.carManageRate = functionAreas[i].items[j].unitPrice;
				}else if((functionAreas[i].items[j].itemName.search('管理费') != -1)){
					// functionAreas[i].items[j].unitPrice = parseFloat(functionAreas[i].items[j].unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate);
					quotationDetail.quotationDetail.manageRate = parseFloat(functionAreas[i].items[j].unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate);
					if(quotationDetail.quotationDetail.manageRate){
						manageFunctionAreaIndex = i;
					}
				}
			}
			
			functionAreas[i].sum = sum;
			noDiscountTotalPrice += sum;
			totalPrice += sum;
		}
	}
	
	var commonPrice = discountPrice + noDiscountTotalPrice;
	var preDiscountCommonPrice = normalPrice + noDiscountTotalPrice;
	
	carManagePrice = Math.round(((preDiscountCommonPrice)*parseFloat(quotationDetail.quotationDetail.carManageRate))*100)/100;
	
//	if( parseFloat(quotationDetail.quotationDetail.limitCarManagePrice) > carManagePrice){
//		carManagePrice =  Math.round(parseFloat(quotationDetail.quotationDetail.limitCarManagePrice)*100)/100;
//	}
	
	if(carManageFunctionAreaIndex != -1){
		preDiscountCommonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum += carManagePrice;
		totalPrice += carManagePrice;
	}
	
	managePrice = Math.round(((preDiscountCommonPrice)*parseFloat(quotationDetail.quotationDetail.manageRate))*100)/100;

	if(manageFunctionAreaIndex != -1){
		functionAreas[manageFunctionAreaIndex].sum += managePrice;
		totalPrice += managePrice;
	}
	
	temQuotationDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
	temQuotationDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
	temQuotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	temQuotationDetail.carManagePrice =  Math.round(carManagePrice*100)/100;//车运费
	temQuotationDetail.managePrice =  Math.round(managePrice*100)/100;//管理费
	
}

function updateManagePrice(){
	var functionAreas = quotationDetail.quotationDetail.functionAreas;
	
	for(var i=0;i<functionAreas.length;++i){
		var functionAreaType = functionAreas[i].functionAreaType;
		if(functionAreaType == '管理费' || functionAreaType == '综合项目'){
			var _gridList = $("#functionAreaItemsTable_"+i).jqGrid();
			var _gridListLength = _gridList.getGridParam("reccount");
			for(var j=0;j<_gridListLength;j++){
				var rowdata = _gridList.jqGrid("getRowData", j);
				var _itemName = rowdata.itemName;
				if(_itemName == "管理费"){
					_gridList.setCell(j, "sumMoney", quotationDetail.quotationDetail.managePrice);
				}else if(_itemName == "车运费"){
					_gridList.setCell(j, "sumMoney", quotationDetail.quotationDetail.carManagePrice);
				}
			}
		}
	}
}

function updateFunctionAreaItem(gridList, functionAreaId, itemIndex){
	
	var functionAreaIndex = functionAreaId.split('_')[1];
	var functionArea = quotationDetail.quotationDetail.functionAreas[functionAreaIndex];
	var functionAreaItem = functionArea.items[itemIndex];
	
	var discount = quotationDetail.quotationDetail.discount;
	var functionAreaType = functionArea.functionAreaType;
	var functionAreaItemName = functionAreaItem.itemName;
	var unitPrice = functionAreaItem.unitPrice;
	var num = functionAreaItem.num;
	
	var sum = 0;
	
	if(functionAreaType == '普通'){
		sum = Math.round((parseFloat(unitPrice)*discount*parseFloat(num)/10)*100)/100;
	}else{
		if(((functionAreaItemName.search('车运费') == -1) && (functionAreaItemName.search('管理费') == -1))){ // 不打折
			sum = Math.round((parseFloat(unitPrice) * parseFloat(num)) * 100) / 100;
		}
	}
	
	gridList.setCell(itemIndex, "sumMoney", sum);
}

function initQuotationDetail(){
	
	var temQuotationDetail = quotationDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	calQuotationDetailSum(); // 计算总值 并对功能区排序
	
	$("#functionAreaDetailList").html("");
	$("#functionAreaSumList").html("");
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		var html = "";
		html+='<div class="col-xs-12 col-md-12 no-padding widget-container-span ui-sortable" id="oneFunctionArea_'+i+'"  functionIndexData="'+i+'">         ';
		html+='	<div id="oneCollapsed_'+i+'" class="widget-box ">                                                              ';
		html+='		<div class="widget-header">                                                       ';
		html+='			<h5 ><strong id="labFunctionAreaName_'+i+'">'+functionAreas[i].functionAreaOrder+" "+functionAreas[i].functionAreaName+'</strong>                           ';
		html+='			</h5>                                                                         ';
		html+='                                                                                       ';
		html+='			<div class="widget-toolbar">                                                  ';
		html+='				<a href="#" data-action="collapse">                                       ';
		html+='					<i id="oneChevron_'+i+'" class="1 bigger-125 icon-chevron-up" functionIndexData="'+i+'"></i>                          ';
		html+='				</a>                                                                      ';
		html+='			</div>                                                                        ';
		html+='                                                                                       ';
		html+='			<div class="widget-toolbar no-border">                                        ';
		if(functionAreas[i].functionAreaType == '管理费'){
			html+='			                                                                              ';
			html+='				<a href="#" class="quotationDetailAddFunctionAreaItem" data="'+i+'">           ';
			html+='					<i class="bigger-125  icon-plus-sign purple"></i>                     ';
			html+='				</a>                                                                      ';
			html+='				                                                                          ';
			html+='				<a href="#" class="quotationDetailEditFunctionArea" data="'+i+'">              ';
			html+='					<span class="bigger-125 icon-pencil blue" ></span>                    ';
			html+='				</a>                                                                      ';
			html+='				                                                                          ';
		}else{
			html+='			                                                                              ';
			html+='				<a href="#" class="quotationDetailAddFunctionAreaItem" data="'+i+'">           ';
			html+='					<i class="bigger-125  icon-plus-sign purple"></i>                     ';
			html+='				</a>                                                                      ';
			html+='				                                                                          ';
			html+='				<a href="#" class="quotationDetailEditFunctionArea" data="'+i+'">              ';
			html+='					<span class="bigger-125 icon-pencil blue" ></span>                    ';
			html+='				</a>                                                                      ';
			html+='				                                                                          ';
			html+='				<a href="#" class="quotationDetailDeleteFunctionArea" data="'+i+'">            ';
			html+='					<span class="bigger-125 icon-trash red"></span>                       ';
			html+='				</a>                                                                      ';
			html+='				                                                                          ';
		}
		html+='		</div>                                                                            ';
		html+='		</div>                                                                            ';
		html+='                                                                                       ';
		html+='		<div class="widget-body">                                                         ';
		html+='			<div class="widget-body-inner" style="display: block;">                       ';
		html+='				<table id="functionAreaItemsTable_'+i+'" functionIndexData="'+i+'"></table>                               ';
		html+='			</div>                                                                        ';
		html+='		</div>                                                                            ';
		html+='	</div>                                                                                ';
		html+='</div>                                                                                 ';
		
		$("#functionAreaDetailList").append(html);
		$("#functionAreaItemsTable_"+i).jqGrid({
			//data: functionAreas[i].items, 
			datatype: "local",
			viewrecords : false,
			multiselect : false,
	        multiboxonly: false,
			colNames:['工程预算量' , '名称' , '大类' , '单位' , '单价' , '折后单价' , '总价' , '工艺说明','操作','uuid','itemIdAutoId','itemId','workTypeId','quotationClassificationId','quotationClassification','customFlag'],
			colModel:[
			  {name:"num",width:40,editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
			  {name:"itemName",editable:true,edittype: "text",editoptions:{maxlength:32},editrules:{ required:true ,custom:true,custom_func:checkGridItemName}},
			  {name:"quotationBigCategoryId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:quotationDetail.quotationBigCategorysStr}},
			  {name:"measurementUnitId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:quotationDetail.measurementUnitsStr}},
			  {name:"unitPrice",formatter:unitPriceFormatter,width:50,editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
			  {name:"discountUnitPrice",width:50,formatter:discountUnitPriceFormatter},
			  {name:"sumMoney",width:50,formatter:sumMoneyFormatter},
			  {name:"quotationItemDes",width:50,formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat,editable:false, edittype:'textarea',editoptions:{maxlength:500},editrules:{ required:true ,custom:true,custom_func:checkGridQuotationItemDes}},
			  {name:'deleteAction',width:50,title:false,formatter:deleteActionFormatter,unformat:quotationItemDesUnformat},
			  {name:"uuid",hidden:true},
			  {name:"itemIdAutoId",hidden:true},
			  {name:"itemId",hidden:true},
			  {name:"workTypeId",hidden:true},
			  {name:"quotationClassificationId",hidden:true},
			  {name:"quotationClassification",hidden:true},
			  {name:"customFlag",hidden:true}
			], 
			rowNum:10,
			rowList:[10,20,30],
			onSelectRow: function(id){
				if(id && (id !== quotationDetail.lastEditId || quotationDetail.lastEditGrid != $(this).attr("id"))){
					
					var rowData = $(this).jqGrid("getRowData", id); 
					$('[data-rel="tooltip"]').tooltip('hide');
					
					if(quotationDetail.lastEditId!=-1){
						var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow', quotationDetail.lastEditId);
						if(gridEditRes){
							var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
							var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
							quotationDetail.lastEditId=-1;
							calQuotationDetailSum();
							changeFunctionAreaItem(quotationDetail.lastEditGrid);
						}else{
							return;
						}
					}
					
					if(rowData.customFlag == 0 && (rowData.itemName.search('管理费')!=-1 || rowData.itemName.search('车运费')!=-1)){
						return;
					}
					
					//$("#functionAreaItemsTable_"+i).jqGrid('saveRow',lastsel);
					$(this).jqGrid('editRow', id,{
						keys : true,		//这里按[enter]保存
						url: "clientArray",
						oneditfunc:function(rowid){
							var rowObject = $(this).jqGrid("getRowData", rowid); 
							if(rowObject.customFlag==0){
								$("#"+rowid+"_quotationBigCategoryId").prop("disabled", true);
								$("#"+rowid+"_unitPrice").prop("disabled", true);
								$("#"+rowid+"_measurementUnitId").prop("disabled", true);
								$("#"+rowid+"_itemName").prop("disabled", true);
								$("#"+rowid+"_quotationItemDes").prop("disabled", true);
								if($("#"+rowid+"_itemName").val().search('管理费')!=-1 || $("#"+rowid+"_itemName").val().search('车运费')!=-1){
									$("#"+rowid+"_num").prop("disabled", true);
								}
							}
							
							$("#"+rowid+"_num").on('focus', function(){
								this.select(); 
							});
						},
						aftersavefunc: function(rowid){
							var newRowData = $(this).jqGrid("getRowData", rowid); 
							var su = jQuery(this).jqGrid('setRowData', rowid, newRowData);
							
							quotationDetail.lastEditId = -1;
							quotationDetail.lastEditGrid = "";
						
							calQuotationDetailSum();
							changeFunctionAreaItem($(this).attr("id"));
							updateManagePrice();
							updateFunctionAreaItem($(this), $(this).attr("id"), rowid);
							
							var _length = $(this).getGridParam("reccount");
							var nextRowId = parseInt(rowid)+2;
							
							if(nextRowId <= _length){
								$(this).children().children('tr')[nextRowId].click();
							}
							
							$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
						},
						afterrestorefunc:function(rowid){
							quotationDetail.lastEditId = -1;
							quotationDetail.lastEditGrid="";
						}
					});
					
					quotationDetail.lastEditId=id;
					quotationDetail.lastEditGrid=$(this).attr("id");
				}
			},gridComplete: function () {
	           // $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-hdiv').hide();
	        }
		});
		
		for(var j=0;j<functionAreas[i].items.length;j++){
			$("#functionAreaItemsTable_"+i).jqGrid("addRowData",j,functionAreas[i].items[j]);
		}
		
		if(functionAreas[i].functionAreaName!='管理费'){
			//初始化功能区总值信息
			var sumHtml = "";
			
			sumHtml+='<div class="col-md-12">                                                                     ';
			sumHtml+='	<label class=" col-md-6  no-padding-right" id="sumLabfunctionAreaName_'+i+'">'+functionAreas[i].functionAreaName+':</label>       ';
			sumHtml+='	<label id="sumLabfunctionAreaMoney_'+i+'" class="col-md-6  no-padding-left">'+ Math.round(functionAreas[i].sum*100)/100+'</label>      ';
			sumHtml+='</div>                                                                                       ';
			
			$("#functionAreaSumList").append(sumHtml);
		}
		
		if(functionAreas[i].collapsed==undefined || functionAreas[i].collapsed == false){
			functionAreas[i].collapsed = false;
			
			$("#oneCollapsed_"+i).addClass("collapsed");
			$("#oneChevron_"+i).addClass("icon-chevron-down");
			$("#oneChevron_"+i).removeClass("icon-chevron-up");
		}else{
			functionAreas[i].collapsed = true;
			$("#oneCollapsed_"+i).removeClass("collapsed");
			$("#oneChevron_"+i).removeClass("icon-chevron-down");
			$("#oneChevron_"+i).addClass("icon-chevron-up");
		}
	}
	
	//初始化报价概要信息
	$("#sumLabActivityName").html(quotationDetail.quotationDetail.orderActivity);
	
	var discountMoney  = Math.round(parseFloat(quotationDetail.quotationDetail.discountPrice)/(quotationDetail.quotationDetail.discount/10)*((10-quotationDetail.quotationDetail.discount)/10)*100)/100;
	$("#sumLabSumMoney").html(Math.round((quotationDetail.quotationDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(quotationDetail.quotationDetail.discount);
	$("#sumLabDiscountMoney").html(Math.round(quotationDetail.quotationDetail.totalPrice*100)/100);
	$("#quotationName").html(quotationDetail.quotationDetail.quotationName);
	
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
	
	$('.icon-chevron-down,.icon-chevron-up').on('click', function(event){
		if(temQuotationDetail.functionAreas[$(this).attr("functionIndexData")].collapsed==false){
			temQuotationDetail.functionAreas[$(this).attr("functionIndexData")].collapsed =true;
		}else{
			
			temQuotationDetail.functionAreas[$(this).attr("functionIndexData")].collapsed = false;
			//initQuotationDetail();
		}
	});
	
	$('.quotationDetailDeleteFunctionArea').on(ace.click_event, function(event){
		var that = this;
		var functionAreaIndex = $(that).attr("data");
		if(quotationDetail.lastEditId!=-1 && "functionAreaItemsTable_"+functionAreaIndex!=quotationDetail.lastEditGrid){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}
		
		bootbox.confirm("确定要删除功能区吗？",function(res){
			if(res){
				quotationDetail.lastEditId=-1;
				quotationDetail.quotationDetail.functionAreas.splice(functionAreaIndex,1);
				
				initQuotationDetail();
			}else{}
		});
		event.stopPropagation();
	});
	
	$('.quotationDetailEditFunctionArea').on(ace.click_event, function(event){
		
		var that = this;
		
		var functionAreaIndex = $(that).attr("data");
		
		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}
		
		$("#functionAreaName").val(quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaName);
		$("#functionAreaIndex").val(functionAreaIndex);
		$("#functionAreaOrder").val(quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaOrder);
		
		com.clearValidator();
		
		quotationDetail.functionAreaModal.modal("show");
		event.stopPropagation();
	});
	
	$('.quotationDetailAddFunctionAreaItem').on(ace.click_event, function(event){
		var that = this;
		
		var functionAreaIndex = $(that).attr("data");
		if(quotationDetail.lastEditId!=-1){
			var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
			if(gridEditRes){
				var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
				var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
				quotationDetail.lastEditId=-1;
				calQuotationDetailSum();
				changeFunctionAreaItem(quotationDetail.lastEditGrid);
				initQuotationDetail();
			}else{
				return;
			}
		}
        
		$("#itemNameSearch").val("");
		$("#quotationWorkTypeSearch").val("");
		$("#quotationBigCategorySearch").val("");
		$("#quotationSmallCategorySearch").val("");
		
		$("#addItemFunctionAreaIndex").val(functionAreaIndex);
		
		quotationDetail.postParam.versionId = quotationDetail.quotationDetail.versionId;
		quotationDetail.postParam["quotationItem.versionId"] = quotationDetail.quotationDetail.versionId;
		
		$.jgrid.refreshGrid(quotationDetail.quotationItemListGrid, quotationDetail.postParam);
		
		quotationDetail.quotationItemModal.modal("show");
		event.stopPropagation();
	});

}

//-------------------------------------------------报价项的格式化------------------------------------------
function deleteActionFormatter(cellvalue, options, rowObject){
//	if(rowObject.quotationClassification!=undefined && rowObject.quotationClassification!=null&& rowObject.quotationClassification=='管理费'){//管理费
//		return "";
//	}
	var str = '<div title="" style="float: right; margin-right: 5px; display: block;" class="ui-pg-div ui-inline-del" id="jDeleteButton_'+options.rowId+"\"";
	  
	str += ' onclick="removeItem('+options.gid+','+options.rowId+')" onmouseover="jQuery(this).addClass(\'ui-state-hover\');" onmouseout="jQuery(this).removeClass(\'ui-state-hover\');" ><span class="ui-icon ui-icon-trash"></span></div>'
	return str;
  }

function unitPriceFormatter(cellvalue, options, rowObject){

//	var functionAreaIndex = $("#"+options.gid).attr("functionIndexData");
//	if(quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaType == '普通'){//打折
//		
//		return Math.round(parseFloat(rowObject.unitPrice)*quotationDetail.quotationDetail.discount/10*100)/100;
//	}else{
		if(rowObject.quotationClassificationId == '5'){//管理费
//			//if( Math.round((parseFloat(rowObject.unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate))*100)/100 > parseFloat(rowObject.unitPrice)){
//				rowObject.unitPrice = Math.round((parseFloat(rowObject.unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate))*100)/100;
//			//}
			return (parseFloat(rowObject.unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate));//不打折+非业务人员比例
		}else{
			return parseFloat(rowObject.unitPrice);
		}
//	}

}

function discountUnitPriceFormatter(cellvalue, options, rowObject){

	var functionAreaIndex = $("#"+options.gid).attr("functionIndexData");
	if(quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaType == '普通'){//打折
		
		return Math.round(parseFloat(rowObject.unitPrice)*quotationDetail.quotationDetail.discount/10*100)/100;
	}else{
		if(rowObject.quotationClassificationId == '5'){//管理费
			return (parseFloat(rowObject.unitPrice)+parseFloat(quotationDetail.quotationDetail.notSalesmanRate));//不打折+非业务人员比例
		}else{
			return parseFloat(rowObject.unitPrice);//不打折
		}
	}
}

function sumMoneyFormatter(cellvalue, options, rowObject){
	var functionAreaIndex = $("#"+options.gid).attr("functionIndexData");
	
	if(cellvalue){
		return cellvalue;
	}
	
	if(quotationDetail.quotationDetail.functionAreas[functionAreaIndex].functionAreaType == '普通'){
		return  Math.round(parseFloat(rowObject.unitPrice)*quotationDetail.quotationDetail.discount*parseFloat(rowObject.num)/10*100)/100;
	}else if(rowObject.customFlag==1 || (rowObject.itemName.search('管理费')==-1 && rowObject.itemName.search('车运费')==-1) ){
		return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num)*100)/100;//不打折
	}else if(rowObject.itemName.search('管理费')!=-1){
		return quotationDetail.quotationDetail.managePrice;
	}else if(rowObject.itemName.search('车运费')!=-1){
		return quotationDetail.quotationDetail.carManagePrice;//车运费
	}else{
		return 0;
	}
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
	return $('input', cell).val();
}

//----------------------------------报价项的编辑和删除以及添加-----------------------------------------

function checkGridNum(value, colname){
	if(value.length<=0 || value.length>6)
		return [false,"\""+colname+"\"的长度应在1~5之间."];
	 if ((/^((\d)+(\.)?(\d)*)$/).test(value)==false) 
         return [false,"\""+colname+"\"需要不小于0的数浮点数"];
      else 
         return [true,""];
}

function checkGridItemName(value, colname){
	if(value.length<=0 || value.length>100)
		return [false,"\""+colname+"\"的长度应在1~100之间."];
//	if ((/^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]+$/).test(value)==false) 
//         return [false,"\""+colname+"\"需要由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."];
    else 
         return [true,""];
}

function checkGridQuotationItemDes(value, colname){
	if(value.length<=0 || value.length>501)
		return [false,"\""+colname+"\"的长度应在1~500之间."];
//	if ((/^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]+$/).test(value)==false) 
//         return [false,"\""+colname+"\"需要由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."];
    else 
         return [true,""];
}

function removeItem(grideId,rowId){
	var row = $(grideId).jqGrid('getRowData',rowId);
	
	if(quotationDetail.lastEditId!=-1 && quotationDetail.lastEditId!=rowId){
		var gridEditRes = $("#"+quotationDetail.lastEditGrid).jqGrid('saveRow',quotationDetail.lastEditId);
		if(gridEditRes){
			var newRowData = $("#"+quotationDetail.lastEditGrid).jqGrid("getRowData", quotationDetail.lastEditId); 
			var su=$("#"+quotationDetail.lastEditGrid).jqGrid('setRowData',quotationDetail.lastEditId,newRowData);
			quotationDetail.lastEditId=-1;
			calQuotationDetailSum();
			changeFunctionAreaItem(quotationDetail.lastEditGrid);
			initQuotationDetail();
		}else{
			return;
		}
	}
	
	bootbox.confirm("确定要删除吗?",function(result){
		if(result){
			quotationDetail.lastEditId=-1;
			$(grideId).jqGrid('delRowData',rowId);
			calQuotationDetailSum();
			changeFunctionAreaItem($(grideId).attr("id"));
			initQuotationDetail();
		}
	});
}

function changeFunctionAreaItem(tableId){
	var functionAreaIndex = $("#"+tableId).attr("functionIndexData");
	var functionArea = quotationDetail.quotationDetail.functionAreas[functionAreaIndex];
	
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	functionArea.items.splice(0);
	
	for(var index=0;index< ids.length;++index){
		var rowData = $("#"+tableId).jqGrid('getRowData',ids[index]);
		var item = {};
		item.customFlag = rowData.customFlag;
        item.itemId= rowData.itemId;
        item.itemIdAutoId= rowData.itemIdAutoId;
        item.itemName= rowData.itemName;
        item.measurementUnitId= rowData.measurementUnitId;
        item.num= rowData.num;
        item.quotationBigCategoryId= rowData.quotationBigCategoryId;
        item.quotationItemDes= rowData.quotationItemDes;
        item.quotationTypeId= rowData.quotationType;
        item.unitPrice=  rowData.unitPrice;
        item.uuid= rowData.uuid;
        item.workTypeId= rowData.workTypeId;
        functionArea.items.push(item);
	}
	
	//初始化功能区总值信息
	var sumHtml = "";
	$("#functionAreaSumList").html("");
	var temQuotationDetail = quotationDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		if(functionAreas[i].functionAreaName!='管理费'){
			// 初始化功能区总值信息	
			sumHtml+='<div class="col-md-12">';
			sumHtml+='	<label class=" col-md-6  no-padding-right" id="sumLabfunctionAreaName_'+i+'">'+functionAreas[i].functionAreaName+':</label>';
			sumHtml+='	<label id="sumLabfunctionAreaMoney_'+i+'" class="col-md-6  no-padding-left">'+ Math.round(functionAreas[i].sum*100)/100+'</label>';
			sumHtml+='</div>';
		}                                                                             
	}
	
	$("#functionAreaSumList").append(sumHtml);
	
	var discountMoney  = Math.round(parseFloat(quotationDetail.quotationDetail.discountPrice)/(quotationDetail.quotationDetail.discount/10)*((10-quotationDetail.quotationDetail.discount)/10)*100)/100;
	$("#sumLabSumMoney").html(Math.round((quotationDetail.quotationDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(quotationDetail.quotationDetail.discount);
	$("#sumLabDiscountMoney").html(Math.round(quotationDetail.quotationDetail.totalPrice*100)/100);
	$("#quotationName").html(quotationDetail.quotationDetail.quotationName);
	
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderMaterialDetailed'});
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
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].quotationItemDes'] = item.quotationItemDes;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].unitPrice'] = item.unitPrice;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].uuid'] = item.uuid;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].workType'] = item.workType;
			option['quotationDetail.functionAreas[' + i + '].items[' + jindex + '].workTypeId'] = item.workTypeId;
			
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
	
	com.post(api.quotation.saveQuotaionDetail.url, option, function(res){
		
		if(res.errorCode!=0){
			bootbox.alert(res.errorMsg);
		}else{
			
			if(cleanFlag == 1){
				$("#fl-container").load("quotationIndex.do", {}, function(){
					decorationQuotation.decorationOrderId = quotationDetail.decorationOrderId;
					
					decorationQuotation.initQuotationList();
				});
			}else{
				quotationDetail.quotationDetail.functionAreas = res.quotationDetail.functionAreas;
				
				initQuotationDetail();
			}
		}
		
		btn.button('reset');
	}, function(res){
		btn.button('reset');
	}, false);
	
	setTimeout(function(){
		quotationDetail.spinner.hide();
	}, 1000);
}

function initStatisticalInfo(){
	
}