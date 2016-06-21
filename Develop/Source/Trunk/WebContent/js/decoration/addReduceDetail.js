var addReduceDetail = {
	
	addReduceId:null,
	decorationOrderId:null,
	
	addReduceDetail:null,
	loadAddReduceDetail:loadAddReduceDetail,
	initAddReduceDetail:initAddReduceDetail,
	
	addType:0,

	quotationTypes:null,
	quotationClassifications:null,
	quotationBigCategorys:null,
	quotationSmallCategorys:null,
	measurementUnits:null,
	workTypes:null,
	quotationFunctionAreas:null,

	quotationTypesStr:"",
	quotationClassificationsStr:"",
	quotationBigCategorysStr:"",
	quotationSmallCategorysStr:"",
	measurementUnitsStr:"",
	workTypesStr:"",
	quotationFunctionAreasStr:"",
	
	lastEditId:-1,
	
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	
	modal: null,
	quotationItemItems: {},
	listInitFlag : false,
	postParam:{},
	
	quotationItemPostParam:{},
	systemDefineItemPostParam:{},
	customItemPostParam:{},
};

jQuery(function($) {
	$('#fl-statement').statement("增减项", "增减项详细");
	
	addReduceDetail.addReduceId = params.addReduceId;

	addReduceDetail.customItemsModal = $("#customItemsModal");
	
	addReduceDetail.quotationItemModal = $("#quotationItemModal");
	addReduceDetail.quotationItemSearchDiv = $("#quotationItemSearchDiv");
	addReduceDetail.quotationItemListGrid = $("#quotationItemListGrid");
	addReduceDetail.quotationItemGridPager = $("#quotationItemGridPager");
	
	addReduceDetail.customItemModal = $("#customItemModal");
	addReduceDetail.customItemSearchDiv = $("#customItemSearchDiv");
	addReduceDetail.customItemListGrid = $("#customItemListGrid");
	addReduceDetail.customItemGridPager = $("#customItemGridPager");
	
	addReduceDetail.systemDefineItemModal = $("#systemDefineItemModal");
	addReduceDetail.systemDefineItemSearchDiv = $("#systemDefineItemSearchDiv");
	addReduceDetail.systemDefineItemListGrid = $("#systemDefineItemListGrid");
	addReduceDetail.systemDefineItemGridPager = $("#systemDefineItemGridPager");
	
	addReduceDetail.addItemModal = $("#addItemModal");
	
	initDataMap();
		
//----------------------------------------------返回----------------------------
	$('#detailBckBtn').on(ace.click_event, function(){
		com.switchPage(api.index.addReduceIndex.url, {}, function(){
			addReduce.decorationOrderId = addReduceDetail.addReduceDetail.orderId;
			addReduce.initAddReduceList();
		});
	});
//----------------------------------------保存----------------
	$('#saveAddReduceDetailBtn').on(ace.click_event, function(){

		if(addReduceDetail.lastEditId!=-1){
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su = $("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
			}else{
				return;
			}
		}

		saveAddReduceDetail(0);
	});
	
	$('#submitAddReduceDetailOKBtn').on(ace.click_event, function(){

		if(addReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su = $("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
				
			}else{
				return;
			}
		}

		bootbox.confirm("工作量是0的报价项将会被删除，确认提交吗？",function(res){
			if(res == false){
				return;
			}else{
				saveAddReduceDetail(1);
			}
		});
	});
		
//------------------------------------------------添加报价项------------------------
	$("#addNewItemBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		if(addReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su = $("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemName").val("");
		$("#quotationItemDes").val("");
		$("#unitPrice").val("");
		$("#num").val("");
		$("#quotationBigCategory").get(0).selectedIndex = 0;
		$("#measurementUnit").get(0).selectedIndex = 0;
		$("#workType").get(0).selectedIndex = 0;
		
		addReduceDetail.addItemModal.modal("show");
		event.stopPropagation();
	});
	
	$("#addSystemDefineItemBtn").on(ace.click_event, function(event){
		
		if(addReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su=$("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch1").val("");
		$("#quotationWorkTypeSearch1").val("");
		$("#quotationBigCategorySearch1").val("");
		
		$.jgrid.refreshGrid(addReduceDetail.customItemListGrid, addReduceDetail.customItemPostParam);
		
		addReduceDetail.systemDefineItemModal.modal("show");

		return false;
	});

	$("#addQuotaionItemBtn").on(ace.click_event, function(event){
		if(addReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su=$("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch").val("");
		$("#quotationWorkTypeSearch").val("");
		$("#quotationBigCategorySearch").val("");
		
		addReduceDetail.quotationItemPostParam.versionId = addReduceDetail.addReduceDetail.versionId;
		
		addReduceDetail.quotationItemPostParam["quotationItem.versionId"] = addReduceDetail.addReduceDetail.versionId;
		
		$.jgrid.refreshGrid(addReduceDetail.quotationItemListGrid, addReduceDetail.quotationItemPostParam);
		
		addReduceDetail.quotationItemModal.modal("show");
	});
	
	$("#addCunstomItemsBtn").on(ace.click_event, function(event){
		if(addReduceDetail.lastEditId != -1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su=$("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch2").val("");
		$("#quotationWorkTypeSearch2").val("");
		$("#quotationBigCategorySearch2").val("");
		
		addReduceDetail.customItemPostParam["customQuotationItem.quotationId"] = addReduceDetail.addReduceDetail.quotationId;
		$.jgrid.refreshGrid(addReduceDetail.customItemListGrid, addReduceDetail.customItemPostParam);
		
		addReduceDetail.customItemModal.modal("show");
	});

	$("#addItemsBtn").on(ace.click_event, function(event){
		addQuotationItemFunctionArea();
		
		return false;
	});
	
	$("#customItemBtn").on(ace.click_event, function(event){
		addCustomItemFunctionArea();
		
		return false;
	});
	
	$("#systemDefineItemBtn").on(ace.click_event, function(event){
		addSystemDefineItemFunctionArea();
	});
	
	$("#confirmItemBtn").on(ace.click_event, function(event){
		confirmItemAdd();
		event.stopPropagation();
	});
	
	$("#saveAddItemBtn").on(ace.click_event, function(event){
		if(com.validate("addItemModal"))
			return;
		
		var functionAreaType = "";
		for(var lp =0;lp < addReduceDetail.quotationFunctionAreas.length; ++lp){
			if(addReduceDetail.quotationFunctionAreas[lp].autoId == $("#quotationFunctionAreaId").val()){
				functionAreaType = addReduceDetail.quotationFunctionAreas[lp].functionAreaType;
				break;
			}
		}
		var temAddReduceDetail = addReduceDetail.addReduceDetail;
		var addReduceItems = temAddReduceDetail.addReduceItems;
		var addRow = {};
		
		addRow.num = $("#num").val();
		addRow.itemName = $("#itemName").val();
		addRow.quotationBigCategoryId = $("#quotationBigCategory").val();
		addRow.measurementUnitId = $("#measurementUnit").val();
		addRow.unitPrice = $("#unitPrice").val();
		addRow.quotationItemDes = $("#quotationItemDes").val();
		addRow.workTypeId = $("#workType").val();
		addRow.quotationFunctionAreaId = $("#quotationFunctionAreaId").val();
		
//		if(functionAreaType == '一次性包死' ){
//			addRow.quotationClassificationId =3;
//			addRow.quotationClassification = '一次性包死';
//		}else if(functionAreaType == '综合项目' && addRow.quotationClassificationId != '4'){
//			addRow.quotationClassificationId = 4;
//			addRow.quotationClassification = '综合项目';
//		}else if(functionAreaType == '管理费' && addRow.quotationClassificationId != '5'){
//			addRow.quotationClassificationId = 5;
//			addRow.quotationClassification = '管理费';
//		}else{
			addRow.quotationClassificationId = 2;
			addRow.quotationClassification = '其他部分';
//		}

		//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
		addRow.itemType = 2;

		if(addReduceDetail.lastEditId!=-1){
			$("#addReduceItemList").jqGrid('restoreRow',addReduceDetail.lastEditId);
			addReduceDetail.lastEditId=-1;
		}
		
		console.log($("#addReduceItemList"));
		var addFlag = true;
		for(var loop=0;loop<addReduceItems.length;++loop){
			if(addReduceItems[loop].itemType == addRow.itemType 
					&& addReduceItems[loop].itemName == addRow.itemName 
					&& addReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
				addFlag = false;
				break;
			}
		}
		
		if(addFlag){ // 已存在
			var ids = $("#addReduceItemList").jqGrid('getDataIDs');
			var maxid = Math.max.apply(null, ids);
			if(maxid == -Infinity){
				maxid = 0;
			}
			$("#addReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
			changeItem("addReduceItemList");
			initAddReduceDetail();
			addReduceDetail.addItemModal.modal("hide");
			maxid++;
		}else{
			bootbox.alert('该报价('+addRow.itemName+')已存在');
		}
		
		return false;
	});
	
	loadAddReduceDetail();
});

//---------------------------------------------字典初始化--------------------------------
function initDataMap(){
	com.post(api.quotation.queryQuotationType, {}, function(res){
		if(res.errorCode == 0){
			addReduceDetail.quotationTypes = res.quotationTypes;
			addReduceDetail.quotationTypesStr = "";
			
			for(var tem=0;tem<res.quotationTypes.length;++tem){
				addReduceDetail.quotationTypesStr += (res.quotationTypes[tem].id + ":" + res.quotationTypes[tem].name + ";");
			}
			
			addReduceDetail.quotationTypesStr = addReduceDetail.quotationTypesStr.substr(0,addReduceDetail.quotationTypesStr.length - 1);
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.common.queryMeasurementUnit,{},function(res){
		if(res.errorCode == 0){
			addReduceDetail.measurementUnits = res.measurementUnits;
			addReduceDetail.measurementUnitsStr= "";
			
			for(var tem=0;tem<res.measurementUnits.length;++tem){
				addReduceDetail.measurementUnitsStr += (res.measurementUnits[tem].id + ":" + res.measurementUnits[tem].name + ";");
			}
			addReduceDetail.measurementUnitsStr = addReduceDetail.measurementUnitsStr.substr(0, addReduceDetail.measurementUnitsStr.length - 1);
			$("#measurementUnit").bindData(addReduceDetail.measurementUnits, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.quotation.queryQuotationBigCategory, {},function(res){
		if(res.errorCode==0){
			addReduceDetail.quotationBigCategorys = res.quotationBigCategorys;
			addReduceDetail.quotationBigCategorysStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationBigCategorys.length;++tem){
				addReduceDetail.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
			}
			addReduceDetail.quotationBigCategorysStr = addReduceDetail.quotationBigCategorysStr.substr(0,addReduceDetail.quotationBigCategorysStr.length-1);
			
			$("#quotationBigCategory").bindData(addReduceDetail.quotationBigCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.common.queryWorkType, {}, function(res){
		if(res.errorCode == 0){
			addReduceDetail.workTypes = res.workTypes;
			addReduceDetail.workTypesStr = "";
			var tem = 0;
			for(tem=0;tem<res.workTypes.length;++tem){
				addReduceDetail.workTypesStr += (res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
			}
			addReduceDetail.workTypesStr = addReduceDetail.workTypesStr.substr(0,addReduceDetail.workTypesStr.length-1);
			
			$("#workType").bindData(addReduceDetail.workTypes, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.quotation.queryQuotationClassification, {}, function(res){
		if(res.errorCode==0){
			
			addReduceDetail.quotationClassifications = res.quotationClassifications;
			addReduceDetail.quotationClassificationsStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationClassifications.length;++tem){
				addReduceDetail.quotationClassificationsStr+=(res.quotationClassifications[tem].id+":"+res.quotationClassifications[tem].name+";");
			}
			addReduceDetail.quotationClassificationsStr =addReduceDetail.quotationClassificationsStr.substr(0,addReduceDetail.quotationClassificationsStr.length-1);
		}else{
			bootbox.alert("系统异常");
		}
	}, function(res){},false);
}

//--------------------------------------------------------服务器端加载数据-------------------------------------------------------
function loadAddReduceDetail(){
	com.post(api.decoration.queryAddReduceDetailById, {"addReduceDetail.arId":addReduceDetail.addReduceId}, function(res){
		addReduceDetail.addReduceDetail = res.addReduceDetail;
		
		console.log("load addReduceDetail:",addReduceDetail.addReduceDetail);

		addReduceDetail.customItemPostParam.quotationId = addReduceDetail.addReduceDetail.quotationId;
		addReduceDetail.quotationItemPostParam.versionId = addReduceDetail.addReduceDetail.versionId;
		addReduceDetail.customItemPostParam["customQuotationItem.quotationId"] = addReduceDetail.addReduceDetail.quotationId;
		
		com.post(api.quotation.queryQuotationFunctionAreaForCommonById, {"quotationDetail.autoId":addReduceDetail.addReduceDetail.quotationId}, function(res){
	
				addReduceDetail.quotationFunctionAreas = res.quotationFunctionAreas;
				addReduceDetail.quotationFunctionAreasStr="";
				
				for(var i=0;i<res.quotationFunctionAreas.length;++i){
					addReduceDetail.quotationFunctionAreasStr+=(res.quotationFunctionAreas[i].autoId+":"+res.quotationFunctionAreas[i].functionAreaName+";");
				}
				
				addReduceDetail.quotationFunctionAreasStr = addReduceDetail.quotationFunctionAreasStr.substr(0,addReduceDetail.quotationFunctionAreasStr.length - 1);
				$("#addQuotationFunctionAreaId").bindData(addReduceDetail.quotationFunctionAreas, "autoId", "functionAreaName");
				$("#quotationFunctionAreaId").bindData(addReduceDetail.quotationFunctionAreas, "autoId", "functionAreaName");
				
				initAddReduceDetail();
	
		});
		
		initQuotationItemList();
		initCustomItemList();
		initSystemDefineItemList();
	});
}

function initQuotationItemList(){
	
	var quotationItemSearchOpts = {
		url: api.quotation.pageQuotationItemByVersionId,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId":addReduceDetail.addReduceDetail.versionId},
		listgrid: addReduceDetail.quotationItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch",name:"itemName", type:'text'},
	        {label:"分类", id:"quotationClassificationSearch", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"小类", id:"quotationSmallCategorySearch", name:"quotationSmallCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addReduceDetail.quotationItemSearchDiv.flSearch(quotationItemSearchOpts);
	$("#quotationBigCategorySearch").bindData(addReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch").bindData(addReduceDetail.workTypes, "id", "name", true);
	$("#quotationClassificationSearch").bindData(addReduceDetail.quotationClassifications, "id", "name", true);
	$("#quotationSmallCategorySearch").bindData(addReduceDetail.quotationSmallCategorys, "id", "name", true);
	
	addReduceDetail.quotationItemListGrid.jqGrid({		
		url: api.quotation.pageQuotationItemByVersionId.url,
		postData:addReduceDetail.quotationItemPostParam,
		colNames:['autoId','编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '说明', '单价', '版本','workTypeId','measurementUnitId','quotationClassificationId','quotationBigCategoryId','quotationSmallCategoryId','quotationTypeId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:300,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification',width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', width:50,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice',width:50},
			{name:'version',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'workTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategoryId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId',hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:810,
		rowNum:15,
		rowList:[15,30,50],
		height: '450',
		pager : addReduceDetail.quotationItemGridPager,
		caption: ""
	});

	addReduceDetail.quotationItemListGrid.navGrid(addReduceDetail.quotationItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initSystemDefineItemList(){
	
	var systemDefineItemSearchOpts = {
		url: api.quotation.pageSystemDefineItem,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: addReduceDetail.systemDefineItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch1",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch1", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch1", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addReduceDetail.systemDefineItemSearchDiv.flSearch(systemDefineItemSearchOpts);
	$("#quotationBigCategorySearch1").bindData(addReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch1").bindData(addReduceDetail.workTypes, "id", "name", true);
	
	addReduceDetail.systemDefineItemListGrid.jqGrid({		
		url: api.quotation.pageSystemDefineItem.url,
		postData: {},
		colNames:['autoId','编号', '名称',  '大类', '单位', '工种', '说明', '单价', 'workTypeId','measurementUnitId','quotationBigCategoryId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName',  width:200,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice'},
			{name:'workTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:810,
		rowNum:15,
		rowList:[15,30,50],
		height: '450',
		pager : addReduceDetail.systemDefineItemGridPager,
		caption: ""
	});

	addReduceDetail.systemDefineItemListGrid.navGrid(addReduceDetail.systemDefineItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initCustomItemList(){
	
	console.log(addReduceDetail.customItemPostParam);
	
	var customItemSearchOpts = {
		url: api.decoration.pageCustomerItemByQuotationId,
		postParmas: {"paging.rows":10, "paging.page":1,"customQuotationItem.quotationId":addReduceDetail.addReduceDetail.quotationId},
		listgrid: addReduceDetail.quotationItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch2",name:"itemName", type:'text'},
	        {label:"分类", id:"quotationClassificationSearch2", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch2", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch2", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addReduceDetail.customItemSearchDiv.flSearch(customItemSearchOpts);
	$("#quotationBigCategorySearch2").bindData(addReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch2").bindData(addReduceDetail.workTypes, "id", "name", true);
	$("#quotationClassificationSearch2").bindData(addReduceDetail.quotationClassifications, "id", "name", true);
	
	addReduceDetail.customItemListGrid.jqGrid({		
		url: api.decoration.pageCustomerItemByQuotationId.url,
		postData: addReduceDetail.customItemPostParam,
		colNames:['autoId','编号', '名称', '分类',  '大类', '单位', '工种', '说明', '单价', 'workTypeId','quotationClassificationId','measurementUnitId','quotationBigCategoryId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:200,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice'},
			{name:'workTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:810,
		rowNum:15,
		rowList:[15,30,50],
		height: '450',
		pager : addReduceDetail.customItemGridPager,
		caption: ""
	});

	addReduceDetail.customItemListGrid.navGrid(addReduceDetail.customItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

//------------------------------------------------------------------界面初始化---------------------------------------------

function calAddReduceSum(){
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	
	var totalPrice = 0;//总价
	var discountPrice = 0;//打折
	var noDiscountTotalPrice = 0;//不打折
	
	var i = 0;
	for(i=0;i<addReduceItems.length;++i){

		// 0 增项 1 减项 2 漏项 
		// 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
		if(temAddReduceDetail.addReduceType == '0' || temAddReduceDetail.addReduceType == '2'){ // 增项漏项不打折
			
			var tem = Math.round((parseFloat(addReduceItems[i].unitPrice)*parseFloat(addReduceItems[i].num))*100)/100;
			noDiscountTotalPrice += tem;
			
			totalPrice += tem;
			
		}else {//减项
			// 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			var itemType = addReduceItems[i].itemType;
			var quotationClassificationId = addReduceItems[i].quotationClassificationId;
			if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
				var tem = Math.round((parseFloat(addReduceItems[i].unitPrice) * parseFloat(addReduceItems[i].num)) * 100) / 100;
				noDiscountTotalPrice += tem;
				totalPrice += tem;
			}else{
				var tem = Math.round(parseFloat(addReduceItems[i].unitPrice) * addReduceDetail.addReduceDetail.quotationDiscount * parseFloat(addReduceItems[i].num) / 10 * 100) / 100;
				
				discountPrice +=tem;
				totalPrice += tem;
			}
		}
	}
	
	temAddReduceDetail.totalPrice = Math.round(totalPrice * 100) / 100;//总价
	temAddReduceDetail.discountPrice =  Math.round(discountPrice * 100) / 100;//打折
	temAddReduceDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice * 100) / 100;//不打折
}

function initAddReduceDetail(){
	
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	
	calAddReduceSum();
	
	$("#addReduceItemDiv").html("");
	$("#addReduceItemDiv").html('<table id="addReduceItemList"></table> '); 
	
	$("#addReduceItemList").jqGrid({		
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['工程预算量' , '名称' ,'功能区', '大类' , '单位' , '单价' , '折后单价' , '总价' , '工艺说明','操作','itemId','workTypeId','arId','itemType','quotationClassificationId','quotationClassification'],
		colModel:[
		  {name:"num",width:40,editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
		 
		  {name:"itemName",editable:true,edittype: "text",editoptions:{maxlength:32},editrules:{ required:true ,custom:true,custom_func:checkGridItemName}},
		  {name:"quotationFunctionAreaId",width:60,formatter:"select",editable:false,edittype: "select",editoptions:{value:addReduceDetail.quotationFunctionAreasStr}},
		  {name:"quotationBigCategoryId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:addReduceDetail.quotationBigCategorysStr}},
		  {name:"measurementUnitId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:addReduceDetail.measurementUnitsStr}},
		  {name:"unitPrice",width:50,editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
		  {name:"discountUnitPrice",width:50,formatter:discountUnitPriceFormatter},
		  {name:"sumMoney",width:50,formatter:sumMoneyFormatter},
		  {name:"quotationItemDes",width:50,formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat,editable:true, edittype:'textarea',editoptions:{maxlength:500},editrules:{ required:true ,custom:true,custom_func:checkGridQuotationItemDes}},
		  {name:'deleteAction',width:50,title:false,formatter:deleteActionFormatter},
		  {name:"itemId",hidden:true},
		  {name:"workTypeId",hidden:true},
		  {name:"arId",hidden:true},
		  {name:"itemType",hidden:true},
		  {name:"quotationClassificationId",hidden:true},
		  {name:"quotationClassification",hidden:true}
		  
		], 
		onSelectRow: function(id){
			if(id && (id !== addReduceDetail.lastEditId)){
				
				var rowData = $(this).jqGrid("getRowData", id); 
				
				$('[data-rel="tooltip"]').tooltip('hide');
				if(addReduceDetail.lastEditId!=-1){
					
					var gridEditRes = $(this).jqGrid('saveRow',addReduceDetail.lastEditId);
					if(gridEditRes){
						
						var newRowData = $(this).jqGrid("getRowData", addReduceDetail.lastEditId); 
						var su=$(this).jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
						addReduceDetail.lastEditId=-1;
						changeItem("addReduceItemList");
						
					}else{
						return;
					}
				}
				
				$(this).jqGrid('editRow',id,{
					keys : true, // 这里按[enter]保存
					url: "clientArray",
					oneditfunc:function(rowid){
						var rowObject = $(this).jqGrid("getRowData", rowid); 
						if(rowObject.itemType == 0 || rowObject.itemType == 1 || rowObject.itemType == 3){ // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
							$("#" + rowid + "_quotationBigCategoryId").prop("disabled", true);
							$("#" + rowid + "_unitPrice").prop("disabled", true);
							$("#" + rowid + "_measurementUnitId").prop("disabled", true);
							$("#" + rowid + "_itemName").prop("disabled", true);
							$("#" + rowid + "_quotationItemDes").prop("disabled", true);
						}
									
						$("#" + rowid + "_num").on('focus',function(){
							this.select(); 
						});
					}, aftersavefunc: function(rowid){
						var newRowData = $(this).jqGrid("getRowData", rowid); 
						var su = $(this).jqGrid('setRowData',rowid,newRowData);
						console.log(newRowData);
						addReduceDetail.lastEditId = -1;
					
						changeItem("addReduceItemList");
						
						initAddReduceDetail();
						$('[data-rel="tooltip"]').tooltip({container:'#addReduceItemDiv'});
					}, afterrestorefunc:function(rowid){
						addReduceDetail.lastEditId = -1;
					}
				});
				
				addReduceDetail.lastEditId=id;
			}
		}
	});
	
	for(var j=0;j<addReduceItems.length;j++){
		$("#addReduceItemList").jqGrid("addRowData",j,addReduceItems[j]);
	}
	
	//初始化报价概要信息
	$("#sumLabActivityName").html(addReduceDetail.addReduceDetail.orderActivity);
	
	var discountMoney  = parseFloat(addReduceDetail.addReduceDetail.discountPrice)/parseFloat(addReduceDetail.addReduceDetail.quotationDiscount)*(10-parseFloat(addReduceDetail.addReduceDetail.quotationDiscount));
	console.log(discountMoney);
	
	$("#sumLabSumMoney").html(Math.round((addReduceDetail.addReduceDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(Math.round(addReduceDetail.addReduceDetail.quotationDiscount*100)/100);
	$("#sumLabDiscountMoney").html(Math.round(addReduceDetail.addReduceDetail.totalPrice*100)/100);
	
	if(addReduceDetail.addReduceDetail.addReduceType == '0'){
		$("#sumLabType").html("增项");
	}else if(addReduceDetail.addReduceDetail.addReduceType == '1'){
		$("#sumLabType").html("减项");
	}else {
		$("#sumLabType").html("漏项");
	}
	$("#addReduceDes").html(addReduceDetail.addReduceDetail.addReduceDes);
	
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#addReduceItemDiv'});

	if(addReduceDetail.addReduceDetail!='2'&&(addReduceDetail.addReduceDetail.addReduceStatus == '0' || addReduceDetail.addReduceDetail.addReduceStatus == '1')){
		$("#submitAddReduceDetailOKBtn").attr("disabled",false);
		$("#saveAddReduceDetailBtn").attr("disabled",false);
	}else{
		$("#submitAddReduceDetailOKBtn").attr("disabled",true);
		$("#saveAddReduceDetailBtn").attr("disabled",true);
	}
}

//-------------------------------------------------报价项的格式化------------------------------------------
function deleteActionFormatter(cellvalue, options, rowObject){
	var str = '<div title="" style="float: right; margin-right: 5px; display: block;" class="ui-pg-div ui-inline-del" id="jDeleteButton_'+options.rowId+"\"";
	str += ' onclick="removeItem('+options.rowId+')" onmouseover="jQuery(this).addClass(\'ui-state-hover\');" onmouseout="jQuery(this).removeClass(\'ui-state-hover\');" ><span class="ui-icon ui-icon-trash"></span></div>'
	return str;
  }

function discountUnitPriceFormatter(cellvalue, options, rowObject){

	//0 增项 1 减项 2 漏项 
	//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	//增项漏项不打折--系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
	//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	//alert(rowObject);
	if(addReduceDetail.addReduceDetail.addReduceType=='1' ){ // 减项
		
		var itemType = rowObject.itemType;
		var quotationClassificationId = rowObject.quotationClassificationId;
		
		if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
			return Math.round(parseFloat(rowObject.unitPrice) * 100) / 100; // 不打折
		}else{
			return Math.round(parseFloat(rowObject.unitPrice) * parseFloat(addReduceDetail.addReduceDetail.quotationDiscount) / 10 * 100) / 100;
		}
	}else{
		return Math.round(parseFloat(rowObject.unitPrice) * 100) / 100; // 不打折
	}
}

function sumMoneyFormatter(cellvalue, options, rowObject){
	//0 增项 1 减项 2 漏项 
	//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	//增项漏项不打折--系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
	//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	console.log(addReduceDetail.addReduceDetail.addReduceType,rowObject);
	if(addReduceDetail.addReduceDetail.addReduceType=='1' ){ // 减项
		
		var itemType = rowObject.itemType;
		var quotationClassificationId = rowObject.quotationClassificationId;
		
		if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
			return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num) * 100) / 100;//不打折
		}else{
			return  Math.round(parseFloat(rowObject.unitPrice)*parseFloat(addReduceDetail.addReduceDetail.quotationDiscount)*parseFloat(rowObject.num) / 10 * 100) / 100;
		}
	}else{
		return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num)*100)/100;//不打折
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
	if(value.length <= 0 || value.length > 6){
		return [false,"\""+colname+"\"的长度应在1~5之间."];
	}
	
	 if ((/^((\d)+(\.)?(\d)*)$/).test(value)==false){ 
         return [false,"\""+colname+"\"需要不小于0的数浮点数"];
	 }else{ 
         return [true,""];
	 }
}

function checkGridItemName(value, colname){
	if(value.length <= 0 || value.length > 33){
		return [false,"\""+colname+"\"的长度应在1~32之间."];
	}else{ 
         return [true,""];
	}
      
}

function checkGridQuotationItemDes(value, colname){
	if(value.length <= 0 || value.length > 501){
		return [false,"\""+colname+"\"的长度应在1~500之间."];
	}else{
         return [true,""];
	}
}

function removeItem(rowId){
	
	var row = $("#addReduceItemList").jqGrid('getRowData',rowId);
	if(addReduceDetail.lastEditId != -1 && addReduceDetail.lastEditId != rowId){
		var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
		
		if(gridEditRes){
			var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
			var su = $("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
			
			addReduceDetail.lastEditId=-1;
			changeItem("addReduceItemList");
			initAddReduceDetail();
		}else{
			return;
		}
	}
	
	bootbox.confirm("确定要删除吗?",function(result){
		if(result){
			console.log('--------------removeItem-');
			addReduceDetail.lastEditId = -1;
			$("#addReduceItemList").jqGrid('delRowData',rowId);
			changeItem("addReduceItemList");
			initAddReduceDetail();
		}
	});
}

function changeItem(tableId){
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	console.log('--------------changeItem-');
	console.log(addReduceItems);
	
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	addReduceItems.splice(0);
	console.log(addReduceItems);
	  
	console.log('------ids-------',ids);
	for(var index=0;index< ids.length;++index){
		var rowData = $("#"+tableId).jqGrid('getRowData',ids[index]);
		var item = {};
		item.arId = rowData.arId;
        item.itemId= rowData.itemId;
        item.itemName= rowData.itemName;
        item.quotationBigCategoryId = rowData.quotationBigCategoryId;
        item.measurementUnitId= rowData.measurementUnitId;
        item.num= rowData.num;
        item.quotationItemDes= rowData.quotationItemDes;
        item.itemType= rowData.itemType;
        item.unitPrice=  rowData.unitPrice;
        item.workTypeId= rowData.workTypeId;
        item.quotationFunctionAreaId = rowData.quotationFunctionAreaId;
        item.quotationClassificationId = rowData.quotationClassificationId;
        item.quotationClassificationId = rowData.quotationClassificationId;
        
        addReduceItems.push(item);
        console.log(rowData);
	}
	console.log(addReduceItems);
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	
	calAddReduceSum();
	
	var discountMoney  = parseFloat(addReduceDetail.addReduceDetail.discountPrice)/parseFloat(addReduceDetail.addReduceDetail.quotationDiscount)*(10-parseFloat(addReduceDetail.addReduceDetail.quotationDiscount));
	console.log(discountMoney);
	
	$("#sumLabSumMoney").html(Math.round((addReduceDetail.addReduceDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(Math.round(addReduceDetail.addReduceDetail.quotationDiscount*100)/100);
	$("#sumLabDiscountMoney").html(Math.round(addReduceDetail.addReduceDetail.totalPrice*100)/100);
}

function confirmItemAdd(){
	if(com.validate("functionAreaModal")){
		return;
	}
	
	if(addReduceDetail.addType==1){
		addQuotationItem();
	}else if(addReduceDetail.addType == 2){
		addCustomItem();
	}else if(addReduceDetail.addType == 3){
		addSystemDefineItem();
	}
	
	$("#functionAreaModal").modal("hide");
}

function addQuotationItemFunctionArea(){
	var nums = addReduceDetail.quotationItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length != 0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addReduceDetail.addType = 1;
	}
}

function addQuotationItem(){
	
	var nums = addReduceDetail.quotationItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	var options = {};
	
	var functionAreaType = "";
	for(var lp =0;lp < addReduceDetail.quotationFunctionAreas.length; ++lp){
		if(addReduceDetail.quotationFunctionAreas[lp].autoId == $("#quotationFunctionAreaId").val()){
			functionAreaType = addReduceDetail.quotationFunctionAreas[lp].functionAreaType;
			break;
		}
	}
	
	if(nums.length!=0){
	
		if(addReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addReduceItemList").jqGrid('saveRow',addReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addReduceItemList").jqGrid("getRowData", addReduceDetail.lastEditId); 
				var su = $("#addReduceItemList").jqGrid('setRowData',addReduceDetail.lastEditId,newRowData);
				
				addReduceDetail.lastEditId=-1;
				changeItem("addReduceItemList");
				initAddReduceDetail();
			}else{
				return;
			}
		}
		
		var ids = $("#addReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity){
			maxid = 0;
		}
		
		for(var i = 0; i< nums.length; i++){
			var row = addReduceDetail.quotationItemListGrid.jqGrid('getRowData', nums[i]);

			var addRow = {};
			addRow.num = 0;
			addRow.itemName = row.itemName;
			addRow.quotationBigCategoryId = row.quotationBigCategoryId;
			addRow.measurementUnitId = row.measurementUnitId;
			addRow.unitPrice = row.unitPrice;
			addRow.quotationItemDes = row.quotationItemDes;
			addRow.workTypeId = row.workTypeId;
			addRow.itemId = row.itemId;
			addRow.quotationFunctionAreaId = $("#quotationFunctionAreaId").val();
			addRow.quotationClassificationId = row.quotationClassificationId;
			addRow.quotationClassification = row.quotationClassification;
			console.log("row "+ addRow);
			
			addRow.itemType = '0'; // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			var judgeFlag = true;
			
			if(functionAreaType == '普通' && (addRow.quotationClassificationId != '1' && addRow.quotationClassificationId != '2')){
				bootbox.alert('不能将报价项('+addRow.itemName+')添加到所选择的的功能区');
				continue;
			}else if(functionAreaType == '一次性包死' && addRow.quotationClassificationId != '3'){
				bootbox.alert('不能将报价项('+addRow.itemName+')添加到所选择的的功能区');
				continue;
			}else if(functionAreaType == '综合项目' && addRow.quotationClassificationId != '4'){
				bootbox.alert('不能将报价项('+addRow.itemName+')添加到所选择的的功能区');
				continue;
			}else if(functionAreaType == '管理费' && addRow.quotationClassificationId != '5'){
				bootbox.alert('不能将报价项('+addRow.itemName+')添加到所选择的的功能区');
				continue;
			}
			
			var addFlag = true;
			for(var loop=0;loop<addReduceItems.length;++loop){
				if(addReduceItems[loop].itemType == addRow.itemType 
						&& addReduceItems[loop].itemId == row.itemId 
						&& addReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){//已存在
				$("#addReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addReduceItemList");
		initAddReduceDetail();
	}
	addReduceDetail.quotationItemModal.modal("hide");
}

function addCustomItemFunctionArea(){
	var nums = addReduceDetail.customItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length!=0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addReduceDetail.addType = 2;
	}
}

function addCustomItem(){

	var nums = addReduceDetail.customItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	var options = {};
	
	if(nums.length!=0){
		if(addReduceDetail.lastEditId!=-1){
			$("#addReduceItemList").jqGrid('restoreRow',addReduceDetail.lastEditId);
			addReduceDetail.lastEditId=-1;
		}
		
		var ids =  $("#addReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		
		for(var i = 0; i< nums.length; i++){
			var row = addReduceDetail.customItemListGrid.jqGrid('getRowData', nums[i]);

			var addRow = {};
			addRow.num = 0;
			addRow.itemName = row.itemName;
			addRow.quotationBigCategoryId = row.quotationBigCategoryId;
			addRow.measurementUnitId = row.measurementUnitId;
			addRow.unitPrice = row.unitPrice;
			addRow.quotationItemDes = row.quotationItemDes;
			addRow.workTypeId = row.workTypeId;
			addRow.itemId = row.itemId;
			addRow.quotationFunctionAreaId = $("#quotationFunctionAreaId").val();
			addRow.quotationClassificationId = row.quotationClassificationId;
			addRow.quotationClassification = row.quotationClassification;
			
			//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			addRow.itemType = '1';
			
			var addFlag = true;
			for(var loop=0;loop<addReduceItems.length;++loop){
				if(addReduceItems[loop].itemType == addRow.itemType 
						&& addReduceItems[loop].itemId == row.itemId
						&& addReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){ // 已存在
				$("#addReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addReduceItemList");
		initAddReduceDetail();

	}
	addReduceDetail.customItemModal.modal("hide");
}

function addSystemDefineItemFunctionArea(){
	var nums = addReduceDetail.systemDefineItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length!=0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addReduceDetail.addType = 3;
	}
}

function addSystemDefineItem(){

	var nums = addReduceDetail.systemDefineItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	var options = {};
	
	if(nums.length!=0){
		if(addReduceDetail.lastEditId!=-1){
			$("#addReduceItemList").jqGrid('restoreRow',addReduceDetail.lastEditId);
			addReduceDetail.lastEditId=-1;
		}
		
		var ids =  $("#addReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		
		for(var i = 0; i< nums.length; i++){
			var row = addReduceDetail.systemDefineItemListGrid.jqGrid('getRowData', nums[i]);

			var addRow = {};
			addRow.num = 0;
			addRow.itemName = row.itemName;
			addRow.quotationBigCategoryId = row.quotationBigCategoryId;
			addRow.measurementUnitId = row.measurementUnitId;
			addRow.unitPrice = row.unitPrice;
			addRow.quotationItemDes = row.quotationItemDes;
			addRow.workTypeId = row.workTypeId;
			addRow.itemId = row.itemId;
			addRow.quotationFunctionAreaId = $("#quotationFunctionAreaId").val();
			addRow.quotationClassificationId = '3';
			addRow.quotationClassification = '一次性包死';
			
			//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			addRow.itemType = '3';
			
			var addFlag = true;
			for(var loop=0;loop<addReduceItems.length;++loop){
				if(addReduceItems[loop].itemType == addRow.itemType 
						&&  addReduceItems[loop].itemId == row.itemId 
						&& addReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){//已存在
				$("#addReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addReduceItemList");
		initAddReduceDetail();
	}
	addReduceDetail.systemDefineItemModal.modal("hide");
}

//-------------------------------------------------------------save -------------------------------

function saveAddReduceDetail(submitFlag){
	var url = "";
	var option={};
	var num = 0;
	
	var temAddReduceDetail = addReduceDetail.addReduceDetail;
	var addReduceItems = temAddReduceDetail.addReduceItems;
	
	for(var i = 0;i<addReduceItems.length;++i){
		if(submitFlag == 1 && temAddReduceDetail.addReduceItems[i].num==0){
			continue;
		}
		option['addReduceDetail.addReduceItems['+num+'].itemId'] = temAddReduceDetail.addReduceItems[i].itemId;
		option['addReduceDetail.addReduceItems['+num+'].itemName'] = temAddReduceDetail.addReduceItems[i].itemName;
		option['addReduceDetail.addReduceItems['+num+'].measurementUnitId'] = temAddReduceDetail.addReduceItems[i].measurementUnitId;
		option['addReduceDetail.addReduceItems['+num+'].measurementUnit'] = temAddReduceDetail.addReduceItems[i].measurementUnit;
		option['addReduceDetail.addReduceItems['+num+'].num'] = temAddReduceDetail.addReduceItems[i].num;
		option['addReduceDetail.addReduceItems['+num+'].quotationBigCategory'] = temAddReduceDetail.addReduceItems[i].quotationBigCategory;
		option['addReduceDetail.addReduceItems['+num+'].quotationBigCategoryId'] = temAddReduceDetail.addReduceItems[i].quotationBigCategoryId;
		option['addReduceDetail.addReduceItems['+num+'].quotationItemDes'] = temAddReduceDetail.addReduceItems[i].quotationItemDes;
		option['addReduceDetail.addReduceItems['+num+'].unitPrice'] = temAddReduceDetail.addReduceItems[i].unitPrice;
		option['addReduceDetail.addReduceItems['+num+'].workType'] = temAddReduceDetail.addReduceItems[i].workType;
		option['addReduceDetail.addReduceItems['+num+'].workTypeId'] = temAddReduceDetail.addReduceItems[i].workTypeId;	
		option['addReduceDetail.addReduceItems['+num+'].quotationFunctionAreaId'] = temAddReduceDetail.addReduceItems[i].quotationFunctionAreaId;
		option['addReduceDetail.addReduceItems['+num+'].quotationClassificationId'] = temAddReduceDetail.addReduceItems[i].quotationClassificationId;
		option['addReduceDetail.addReduceItems['+num+'].quotationClassification'] = temAddReduceDetail.addReduceItems[i].quotationClassification;
		option['addReduceDetail.addReduceItems['+num+'].itemType'] = temAddReduceDetail.addReduceItems[i].itemType;
		
		++num;
	}
	
	option['addReduceDetail.arId'] = temAddReduceDetail.arId;
	option['addReduceDetail.OrderId'] = temAddReduceDetail.OrderId;
	option['addReduceDetail.versionId'] = temAddReduceDetail.versionId;
	option['addReduceDetail.versionName'] = temAddReduceDetail.versionName;
	option['addReduceDetail.orderTotalPrice'] = temAddReduceDetail.orderTotalPrice;
	option['addReduceDetail.quotationDiscount'] = temAddReduceDetail.quotationDiscount;
	option['addReduceDetail.addReduceType'] = temAddReduceDetail.addReduceType;
	option['addReduceDetail.addReduceTotal'] = Math.round(temAddReduceDetail.totalPrice);
	if(submitFlag){
		option['addReduceDetail.addReduceStatus'] = 1;
		
		if(addReduceDetail.lastEditId != -1){
			$(this).jqGrid('restoreRow', addReduceDetail.lastEditId);
			addReduceDetail.lastEditId=-1;
		}
	}else{
		option['addReduceDetail.addReduceStatus'] = 0;
	}
	
	option['addReduceDetail.orderPaymentId'] = temAddReduceDetail.orderPaymentId;
	option['addReduceDetail.addReduceDes'] = temAddReduceDetail.addReduceDes;
	
	if(submitFlag){
		url = api.decoration.submitAddReduceDetail;
	}else{
		url = api.decoration.saveAddReduceDetail;
	}
	
	com.post(api.decoration.checkAddReduceForPenalty, option, function(res1){
		
		if(res1.breachContractFlag == 1){
			bootbox.confirm("增减项总和满足违约金条件,继续吗?", function(res2){
				if(res2){
					com.post(url, option, function(res){
						if(submitFlag){
							com.showAlert(com.info, "提交成功");
							com.switchPage(api.index.addReduceIndex.url, {}, function(){
								addReduce.decorationOrderId = addReduceDetail.addReduceDetail.orderId;
								addReduce.initAddReduceList();
							});
						}else{
							com.showAlert(com.info, "保存成功");
						}
					});
				}
			});
		}else{
			com.post(url, option, function(res){
				if(submitFlag){
					com.showAlert(com.info, "提交成功");
					com.switchPage(api.index.addReduceIndex.url, {}, function(){
						addReduce.decorationOrderId = addReduceDetail.addReduceDetail.orderId;
						addReduce.initAddReduceList();
					});
				}else{
					com.showAlert(com.info, "保存成功");
				}
			});
		}
	});
}