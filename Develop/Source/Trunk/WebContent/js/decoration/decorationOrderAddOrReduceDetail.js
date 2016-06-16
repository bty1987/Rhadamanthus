var addOrReduceDetail = {
	
	addOrReduceId:null,
	decorationOrderId:null,
	
	addOrReduceDetail:null,
	loadAddOrReduceDetail:loadAddOrReduceDetail,
	initAddOrReduceDetail:initAddOrReduceDetail,
	
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
	
	addOrReduceDetail.addOrReduceId = params.addOrReduceId;

	addOrReduceDetail.customItemsModal = $("#customItemsModal");
	
	addOrReduceDetail.quotationItemModal = $("#quotationItemModal");
	addOrReduceDetail.quotationItemSearchDiv = $("#quotationItemSearchDiv");
	addOrReduceDetail.quotationItemListGrid = $("#quotationItemListGrid");
	addOrReduceDetail.quotationItemGridPager = $("#quotationItemGridPager");
	
	addOrReduceDetail.customItemModal = $("#customItemModal");
	addOrReduceDetail.customItemSearchDiv = $("#customItemSearchDiv");
	addOrReduceDetail.customItemListGrid = $("#customItemListGrid");
	addOrReduceDetail.customItemGridPager = $("#customItemGridPager");
	
	addOrReduceDetail.systemDefineItemModal = $("#systemDefineItemModal");
	addOrReduceDetail.systemDefineItemSearchDiv = $("#systemDefineItemSearchDiv");
	addOrReduceDetail.systemDefineItemListGrid = $("#systemDefineItemListGrid");
	addOrReduceDetail.systemDefineItemGridPager = $("#systemDefineItemGridPager");
	
	addOrReduceDetail.addItemModal = $("#addItemModal");
	
	initDataMap();
		
//----------------------------------------------返回----------------------------
	$('#detailBckBtn').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderAddOrReduceIndex.url, {}, function(){
			addOrReduce.decorationOrderId = addOrReduceDetail.addOrReduceDetail.orderId;
			
			addOrReduce.initAddOrReduceList();
		});
	});
//----------------------------------------保存----------------
	$('#saveAddOrReduceDetailBtn').on(ace.click_event, function(){

		if(addOrReduceDetail.lastEditId!=-1){
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su = $("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
			}else{
				return;
			}
		}

		saveAddOrReduceDetail(0);
	});
	
	$('#submitAddOrReduceDetailOKBtn').on(ace.click_event, function(){

		if(addOrReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su = $("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
				
			}else{
				return;
			}
		}

		bootbox.confirm("工作量是0的报价项将会被删除，确认提交吗？",function(res){
			if(res == false){
				return;
			}else{
				saveAddOrReduceDetail(1);
			}
		});
	});
		
//------------------------------------------------添加报价项------------------------
	$("#addNewItemBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		if(addOrReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su = $("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
				
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
		
		addOrReduceDetail.addItemModal.modal("show");
		event.stopPropagation();
	});
	
	$("#addSystemDefineItemBtn").on(ace.click_event, function(event){
		
		if(addOrReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su=$("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch1").val("");
		$("#quotationWorkTypeSearch1").val("");
		$("#quotationBigCategorySearch1").val("");
		
		$.jgrid.refreshGrid(addOrReduceDetail.customItemListGrid, addOrReduceDetail.customItemPostParam);
		
		addOrReduceDetail.systemDefineItemModal.modal("show");

		return false;
	});

	$("#addQuotaionItemBtn").on(ace.click_event, function(event){
		if(addOrReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su=$("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch").val("");
		$("#quotationWorkTypeSearch").val("");
		$("#quotationBigCategorySearch").val("");
		
		addOrReduceDetail.quotationItemPostParam.versionId = addOrReduceDetail.addOrReduceDetail.versionId;
		
		addOrReduceDetail.quotationItemPostParam["quotationItem.versionId"] = addOrReduceDetail.addOrReduceDetail.versionId;
		
		$.jgrid.refreshGrid(addOrReduceDetail.quotationItemListGrid, addOrReduceDetail.quotationItemPostParam);
		
		addOrReduceDetail.quotationItemModal.modal("show");
	});
	
	$("#addCunstomItemsBtn").on(ace.click_event, function(event){
		if(addOrReduceDetail.lastEditId != -1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su=$("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
				
			}else{
				return;
			}
		}

		$("#itemNameSearch2").val("");
		$("#quotationWorkTypeSearch2").val("");
		$("#quotationBigCategorySearch2").val("");
		
		addOrReduceDetail.customItemPostParam["customQuotationItem.quotationId"] = addOrReduceDetail.addOrReduceDetail.quotationId;
		$.jgrid.refreshGrid(addOrReduceDetail.customItemListGrid, addOrReduceDetail.customItemPostParam);
		
		addOrReduceDetail.customItemModal.modal("show");
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
		for(var lp =0;lp < addOrReduceDetail.quotationFunctionAreas.length; ++lp){
			if(addOrReduceDetail.quotationFunctionAreas[lp].autoId == $("#quotationFunctionAreaId").val()){
				functionAreaType = addOrReduceDetail.quotationFunctionAreas[lp].functionAreaType;
				break;
			}
		}
		var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
		var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
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

		if(addOrReduceDetail.lastEditId!=-1){
			$("#addOrReduceItemList").jqGrid('restoreRow',addOrReduceDetail.lastEditId);
			addOrReduceDetail.lastEditId=-1;
		}
		
		console.log($("#addOrReduceItemList"));
		var addFlag = true;
		for(var loop=0;loop<addOrReduceItems.length;++loop){
			if(addOrReduceItems[loop].itemType == addRow.itemType 
					&& addOrReduceItems[loop].itemName == addRow.itemName 
					&& addOrReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
				addFlag = false;
				break;
			}
		}
		
		if(addFlag){ // 已存在
			var ids = $("#addOrReduceItemList").jqGrid('getDataIDs');
			var maxid = Math.max.apply(null, ids);
			if(maxid == -Infinity){
				maxid = 0;
			}
			$("#addOrReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
			changeItem("addOrReduceItemList");
			initAddOrReduceDetail();
			addOrReduceDetail.addItemModal.modal("hide");
			maxid++;
		}else{
			bootbox.alert('该报价('+addRow.itemName+')已存在');
		}
		
		return false;
	});
	
	loadAddOrReduceDetail();
});

//---------------------------------------------字典初始化--------------------------------
function initDataMap(){
	com.post(api.quotation.queryQuotationType, {}, function(res){
		if(res.errorCode == 0){
			addOrReduceDetail.quotationTypes = res.quotationTypes;
			addOrReduceDetail.quotationTypesStr = "";
			
			for(var tem=0;tem<res.quotationTypes.length;++tem){
				addOrReduceDetail.quotationTypesStr += (res.quotationTypes[tem].id + ":" + res.quotationTypes[tem].name + ";");
			}
			
			addOrReduceDetail.quotationTypesStr = addOrReduceDetail.quotationTypesStr.substr(0,addOrReduceDetail.quotationTypesStr.length - 1);
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.common.queryMeasurementUnit,{},function(res){
		if(res.errorCode == 0){
			addOrReduceDetail.measurementUnits = res.measurementUnits;
			addOrReduceDetail.measurementUnitsStr= "";
			
			for(var tem=0;tem<res.measurementUnits.length;++tem){
				addOrReduceDetail.measurementUnitsStr += (res.measurementUnits[tem].id + ":" + res.measurementUnits[tem].name + ";");
			}
			addOrReduceDetail.measurementUnitsStr = addOrReduceDetail.measurementUnitsStr.substr(0, addOrReduceDetail.measurementUnitsStr.length - 1);
			$("#measurementUnit").bindData(addOrReduceDetail.measurementUnits, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.quotation.queryQuotationBigCategory, {},function(res){
		if(res.errorCode==0){
			addOrReduceDetail.quotationBigCategorys = res.quotationBigCategorys;
			addOrReduceDetail.quotationBigCategorysStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationBigCategorys.length;++tem){
				addOrReduceDetail.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
			}
			addOrReduceDetail.quotationBigCategorysStr = addOrReduceDetail.quotationBigCategorysStr.substr(0,addOrReduceDetail.quotationBigCategorysStr.length-1);
			
			$("#quotationBigCategory").bindData(addOrReduceDetail.quotationBigCategorys, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.common.queryWorkType, {}, function(res){
		if(res.errorCode == 0){
			addOrReduceDetail.workTypes = res.workTypes;
			addOrReduceDetail.workTypesStr = "";
			var tem = 0;
			for(tem=0;tem<res.workTypes.length;++tem){
				addOrReduceDetail.workTypesStr += (res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
			}
			addOrReduceDetail.workTypesStr = addOrReduceDetail.workTypesStr.substr(0,addOrReduceDetail.workTypesStr.length-1);
			
			$("#workType").bindData(addOrReduceDetail.workTypes, "id", "name");
		}else{
			bootbox.alert("系统异常");
		}
	});
	
	com.post(api.quotation.queryQuotationClassification, {}, function(res){
		if(res.errorCode==0){
			
			addOrReduceDetail.quotationClassifications = res.quotationClassifications;
			addOrReduceDetail.quotationClassificationsStr="";
			var tem = 0;
			for(tem=0;tem<res.quotationClassifications.length;++tem){
				addOrReduceDetail.quotationClassificationsStr+=(res.quotationClassifications[tem].id+":"+res.quotationClassifications[tem].name+";");
			}
			addOrReduceDetail.quotationClassificationsStr =addOrReduceDetail.quotationClassificationsStr.substr(0,addOrReduceDetail.quotationClassificationsStr.length-1);
		}else{
			bootbox.alert("系统异常");
		}
	}, function(res){},false);
}

//--------------------------------------------------------服务器端加载数据-------------------------------------------------------
function loadAddOrReduceDetail(){
	com.post(api.decoration.queryAddOrReduceDetailById, {"addOrReduceDetail.arId":addOrReduceDetail.addOrReduceId}, function(res){
		addOrReduceDetail.addOrReduceDetail = res.addOrReduceDetail;
		
		console.log("load addOrReduceDetail:",addOrReduceDetail.addOrReduceDetail);

		addOrReduceDetail.customItemPostParam.quotationId = addOrReduceDetail.addOrReduceDetail.quotationId;
		addOrReduceDetail.quotationItemPostParam.versionId = addOrReduceDetail.addOrReduceDetail.versionId;
		addOrReduceDetail.customItemPostParam["customQuotationItem.quotationId"] = addOrReduceDetail.addOrReduceDetail.quotationId;
		
		com.post(api.quotation.queryQuotationFunctionAreaForCommonById, {"quotationDetail.autoId":addOrReduceDetail.addOrReduceDetail.quotationId}, function(res){
	
				addOrReduceDetail.quotationFunctionAreas = res.quotationFunctionAreas;
				addOrReduceDetail.quotationFunctionAreasStr="";
				
				for(var i=0;i<res.quotationFunctionAreas.length;++i){
					addOrReduceDetail.quotationFunctionAreasStr+=(res.quotationFunctionAreas[i].autoId+":"+res.quotationFunctionAreas[i].functionAreaName+";");
				}
				
				addOrReduceDetail.quotationFunctionAreasStr = addOrReduceDetail.quotationFunctionAreasStr.substr(0,addOrReduceDetail.quotationFunctionAreasStr.length - 1);
				$("#addQuotationFunctionAreaId").bindData(addOrReduceDetail.quotationFunctionAreas, "autoId", "functionAreaName");
				$("#quotationFunctionAreaId").bindData(addOrReduceDetail.quotationFunctionAreas, "autoId", "functionAreaName");
				
				initAddOrReduceDetail();
	
		});
		
		initQuotationItemList();
		initCustomItemList();
		initSystemDefineItemList();
	});
}

function initQuotationItemList(){
	
	var quotationItemSearchOpts = {
		url: api.quotation.pageQuotationItemByVersionId,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId":addOrReduceDetail.addOrReduceDetail.versionId},
		listgrid: addOrReduceDetail.quotationItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch",name:"itemName", type:'text'},
	        {label:"分类", id:"quotationClassificationSearch", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"小类", id:"quotationSmallCategorySearch", name:"quotationSmallCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addOrReduceDetail.quotationItemSearchDiv.flSearch(quotationItemSearchOpts);
	$("#quotationBigCategorySearch").bindData(addOrReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch").bindData(addOrReduceDetail.workTypes, "id", "name", true);
	$("#quotationClassificationSearch").bindData(addOrReduceDetail.quotationClassifications, "id", "name", true);
	$("#quotationSmallCategorySearch").bindData(addOrReduceDetail.quotationSmallCategorys, "id", "name", true);
	
	addOrReduceDetail.quotationItemListGrid.jqGrid({		
		url: api.quotation.pageQuotationItemByVersionId.url,
		postData:addOrReduceDetail.quotationItemPostParam,
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
		pager : addOrReduceDetail.quotationItemGridPager,
		caption: ""
	});

	addOrReduceDetail.quotationItemListGrid.navGrid(addOrReduceDetail.quotationItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initSystemDefineItemList(){
	
	var systemDefineItemSearchOpts = {
		url: api.quotation.pageSystemDefineItem,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: addOrReduceDetail.systemDefineItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch1",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch1", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch1", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addOrReduceDetail.systemDefineItemSearchDiv.flSearch(systemDefineItemSearchOpts);
	$("#quotationBigCategorySearch1").bindData(addOrReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch1").bindData(addOrReduceDetail.workTypes, "id", "name", true);
	
	addOrReduceDetail.systemDefineItemListGrid.jqGrid({		
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
		pager : addOrReduceDetail.systemDefineItemGridPager,
		caption: ""
	});

	addOrReduceDetail.systemDefineItemListGrid.navGrid(addOrReduceDetail.systemDefineItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initCustomItemList(){
	
	console.log(addOrReduceDetail.customItemPostParam);
	
	var customItemSearchOpts = {
		url: api.decoration.pageCustomerItemByQuotationId,
		postParmas: {"paging.rows":10, "paging.page":1,"customQuotationItem.quotationId":addOrReduceDetail.addOrReduceDetail.quotationId},
		listgrid: addOrReduceDetail.quotationItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch2",name:"itemName", type:'text'},
	        {label:"分类", id:"quotationClassificationSearch2", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch2", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch2", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	addOrReduceDetail.customItemSearchDiv.flSearch(customItemSearchOpts);
	$("#quotationBigCategorySearch2").bindData(addOrReduceDetail.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch2").bindData(addOrReduceDetail.workTypes, "id", "name", true);
	$("#quotationClassificationSearch2").bindData(addOrReduceDetail.quotationClassifications, "id", "name", true);
	
	addOrReduceDetail.customItemListGrid.jqGrid({		
		url: api.decoration.pageCustomerItemByQuotationId.url,
		postData: addOrReduceDetail.customItemPostParam,
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
		pager : addOrReduceDetail.customItemGridPager,
		caption: ""
	});

	addOrReduceDetail.customItemListGrid.navGrid(addOrReduceDetail.customItemGridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

//------------------------------------------------------------------界面初始化---------------------------------------------

function calAddOrReduceSum(){
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	
	var totalPrice = 0;//总价
	var discountPrice = 0;//打折
	var noDiscountTotalPrice = 0;//不打折
	
	var i = 0;
	for(i=0;i<addOrReduceItems.length;++i){

		// 0 增项 1 减项 2 漏项 
		// 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
		if(temAddOrReduceDetail.addReduceType == '0' || temAddOrReduceDetail.addReduceType == '2'){ // 增项漏项不打折
			
			var tem = Math.round((parseFloat(addOrReduceItems[i].unitPrice)*parseFloat(addOrReduceItems[i].num))*100)/100;
			noDiscountTotalPrice += tem;
			
			totalPrice += tem;
			
		}else {//减项
			// 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			var itemType = addOrReduceItems[i].itemType;
			var quotationClassificationId = addOrReduceItems[i].quotationClassificationId;
			if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
				var tem = Math.round((parseFloat(addOrReduceItems[i].unitPrice) * parseFloat(addOrReduceItems[i].num)) * 100) / 100;
				noDiscountTotalPrice += tem;
				totalPrice += tem;
			}else{
				var tem = Math.round(parseFloat(addOrReduceItems[i].unitPrice) * addOrReduceDetail.addOrReduceDetail.quotationDiscount * parseFloat(addOrReduceItems[i].num) / 10 * 100) / 100;
				
				discountPrice +=tem;
				totalPrice += tem;
			}
		}
	}
	
	temAddOrReduceDetail.totalPrice = Math.round(totalPrice * 100) / 100;//总价
	temAddOrReduceDetail.discountPrice =  Math.round(discountPrice * 100) / 100;//打折
	temAddOrReduceDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice * 100) / 100;//不打折
}

function initAddOrReduceDetail(){
	
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	
	calAddOrReduceSum();
	
	$("#addOrReduceItemDiv").html("");
	$("#addOrReduceItemDiv").html('<table id="addOrReduceItemList"></table> '); 
	
	$("#addOrReduceItemList").jqGrid({		
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['工程预算量' , '名称' ,'功能区', '大类' , '单位' , '单价' , '折后单价' , '总价' , '工艺说明','操作','itemId','workTypeId','arId','itemType','quotationClassificationId','quotationClassification'],
		colModel:[
		  {name:"num",width:40,editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
		 
		  {name:"itemName",editable:true,edittype: "text",editoptions:{maxlength:32},editrules:{ required:true ,custom:true,custom_func:checkGridItemName}},
		  {name:"quotationFunctionAreaId",width:60,formatter:"select",editable:false,edittype: "select",editoptions:{value:addOrReduceDetail.quotationFunctionAreasStr}},
		  {name:"quotationBigCategoryId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:addOrReduceDetail.quotationBigCategorysStr}},
		  {name:"measurementUnitId",width:50,formatter:"select",editable:true,edittype: "select",editoptions:{value:addOrReduceDetail.measurementUnitsStr}},
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
			if(id && (id !== addOrReduceDetail.lastEditId)){
				
				var rowData = $(this).jqGrid("getRowData", id); 
				
				$('[data-rel="tooltip"]').tooltip('hide');
				if(addOrReduceDetail.lastEditId!=-1){
					
					var gridEditRes = $(this).jqGrid('saveRow',addOrReduceDetail.lastEditId);
					if(gridEditRes){
						
						var newRowData = $(this).jqGrid("getRowData", addOrReduceDetail.lastEditId); 
						var su=$(this).jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
						addOrReduceDetail.lastEditId=-1;
						changeItem("addOrReduceItemList");
						
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
						addOrReduceDetail.lastEditId = -1;
					
						changeItem("addOrReduceItemList");
						
						initAddOrReduceDetail();
						$('[data-rel="tooltip"]').tooltip({container:'#addOrReduceItemDiv'});
					}, afterrestorefunc:function(rowid){
						addOrReduceDetail.lastEditId = -1;
					}
				});
				
				addOrReduceDetail.lastEditId=id;
			}
		}
	});
	
	for(var j=0;j<addOrReduceItems.length;j++){
		$("#addOrReduceItemList").jqGrid("addRowData",j,addOrReduceItems[j]);
	}
	
	//初始化报价概要信息
	$("#sumLabActivityName").html(addOrReduceDetail.addOrReduceDetail.orderActivity);
	
	var discountMoney  = parseFloat(addOrReduceDetail.addOrReduceDetail.discountPrice)/parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount)*(10-parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount));
	console.log(discountMoney);
	
	$("#sumLabSumMoney").html(Math.round((addOrReduceDetail.addOrReduceDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(Math.round(addOrReduceDetail.addOrReduceDetail.quotationDiscount*100)/100);
	$("#sumLabDiscountMoney").html(Math.round(addOrReduceDetail.addOrReduceDetail.totalPrice*100)/100);
	
	if(addOrReduceDetail.addOrReduceDetail.addReduceType == '0'){
		$("#sumLabType").html("增项");
	}else if(addOrReduceDetail.addOrReduceDetail.addReduceType == '1'){
		$("#sumLabType").html("减项");
	}else {
		$("#sumLabType").html("漏项");
	}
	$("#addReduceDes").html(addOrReduceDetail.addOrReduceDetail.addReduceDes);
	
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#addOrReduceItemDiv'});

	if(addOrReduceDetail.addOrReduceDetail!='2'&&(addOrReduceDetail.addOrReduceDetail.addReduceStatus == '0' || addOrReduceDetail.addOrReduceDetail.addReduceStatus == '1')){
		$("#submitAddOrReduceDetailOKBtn").attr("disabled",false);
		$("#saveAddOrReduceDetailBtn").attr("disabled",false);
	}else{
		$("#submitAddOrReduceDetailOKBtn").attr("disabled",true);
		$("#saveAddOrReduceDetailBtn").attr("disabled",true);
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
	if(addOrReduceDetail.addOrReduceDetail.addReduceType=='1' ){ // 减项
		
		var itemType = rowObject.itemType;
		var quotationClassificationId = rowObject.quotationClassificationId;
		
		if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
			return Math.round(parseFloat(rowObject.unitPrice) * 100) / 100; // 不打折
		}else{
			return Math.round(parseFloat(rowObject.unitPrice) * parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount) / 10 * 100) / 100;
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
	console.log(addOrReduceDetail.addOrReduceDetail.addReduceType,rowObject);
	if(addOrReduceDetail.addOrReduceDetail.addReduceType=='1' ){ // 减项
		
		var itemType = rowObject.itemType;
		var quotationClassificationId = rowObject.quotationClassificationId;
		
		if(itemType == '3' || (itemType == '0' && (quotationClassificationId == '3' || quotationClassificationId == '4' || quotationClassificationId == '5'))){ // 系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
			return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num) * 100) / 100;//不打折
		}else{
			return  Math.round(parseFloat(rowObject.unitPrice)*parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount)*parseFloat(rowObject.num) / 10 * 100) / 100;
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
	
	var row = $("#addOrReduceItemList").jqGrid('getRowData',rowId);
	if(addOrReduceDetail.lastEditId != -1 && addOrReduceDetail.lastEditId != rowId){
		var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
		
		if(gridEditRes){
			var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
			var su = $("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
			
			addOrReduceDetail.lastEditId=-1;
			changeItem("addOrReduceItemList");
			initAddOrReduceDetail();
		}else{
			return;
		}
	}
	
	bootbox.confirm("确定要删除吗?",function(result){
		if(result){
			console.log('--------------removeItem-');
			addOrReduceDetail.lastEditId = -1;
			$("#addOrReduceItemList").jqGrid('delRowData',rowId);
			changeItem("addOrReduceItemList");
			initAddOrReduceDetail();
		}
	});
}

function changeItem(tableId){
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	console.log('--------------changeItem-');
	console.log(addOrReduceItems);
	
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	addOrReduceItems.splice(0);
	console.log(addOrReduceItems);
	  
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
        
        addOrReduceItems.push(item);
        console.log(rowData);
	}
	console.log(addOrReduceItems);
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	
	calAddOrReduceSum();
	
	var discountMoney  = parseFloat(addOrReduceDetail.addOrReduceDetail.discountPrice)/parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount)*(10-parseFloat(addOrReduceDetail.addOrReduceDetail.quotationDiscount));
	console.log(discountMoney);
	
	$("#sumLabSumMoney").html(Math.round((addOrReduceDetail.addOrReduceDetail.totalPrice + discountMoney)*100)/100);
	$("#sumLabDiscount").html(Math.round(addOrReduceDetail.addOrReduceDetail.quotationDiscount*100)/100);
	$("#sumLabDiscountMoney").html(Math.round(addOrReduceDetail.addOrReduceDetail.totalPrice*100)/100);
}

function confirmItemAdd(){
	if(com.validate("functionAreaModal")){
		return;
	}
	
	if(addOrReduceDetail.addType==1){
		addQuotationItem();
	}else if(addOrReduceDetail.addType == 2){
		addCustomItem();
	}else if(addOrReduceDetail.addType == 3){
		addSystemDefineItem();
	}
	
	$("#functionAreaModal").modal("hide");
}

function addQuotationItemFunctionArea(){
	var nums = addOrReduceDetail.quotationItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length != 0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addOrReduceDetail.addType = 1;
	}
}

function addQuotationItem(){
	
	var nums = addOrReduceDetail.quotationItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	var options = {};
	
	var functionAreaType = "";
	for(var lp =0;lp < addOrReduceDetail.quotationFunctionAreas.length; ++lp){
		if(addOrReduceDetail.quotationFunctionAreas[lp].autoId == $("#quotationFunctionAreaId").val()){
			functionAreaType = addOrReduceDetail.quotationFunctionAreas[lp].functionAreaType;
			break;
		}
	}
	
	if(nums.length!=0){
	
		if(addOrReduceDetail.lastEditId!=-1){
			
			var gridEditRes = $("#addOrReduceItemList").jqGrid('saveRow',addOrReduceDetail.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#addOrReduceItemList").jqGrid("getRowData", addOrReduceDetail.lastEditId); 
				var su = $("#addOrReduceItemList").jqGrid('setRowData',addOrReduceDetail.lastEditId,newRowData);
				
				addOrReduceDetail.lastEditId=-1;
				changeItem("addOrReduceItemList");
				initAddOrReduceDetail();
			}else{
				return;
			}
		}
		
		var ids = $("#addOrReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity){
			maxid = 0;
		}
		
		for(var i = 0; i< nums.length; i++){
			var row = addOrReduceDetail.quotationItemListGrid.jqGrid('getRowData', nums[i]);

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
			for(var loop=0;loop<addOrReduceItems.length;++loop){
				if(addOrReduceItems[loop].itemType == addRow.itemType 
						&& addOrReduceItems[loop].itemId == row.itemId 
						&& addOrReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){//已存在
				$("#addOrReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addOrReduceItemList");
		initAddOrReduceDetail();
	}
	addOrReduceDetail.quotationItemModal.modal("hide");
}

function addCustomItemFunctionArea(){
	var nums = addOrReduceDetail.customItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length!=0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addOrReduceDetail.addType = 2;
	}
}

function addCustomItem(){

	var nums = addOrReduceDetail.customItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	var options = {};
	
	if(nums.length!=0){
		if(addOrReduceDetail.lastEditId!=-1){
			$("#addOrReduceItemList").jqGrid('restoreRow',addOrReduceDetail.lastEditId);
			addOrReduceDetail.lastEditId=-1;
		}
		
		var ids =  $("#addOrReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		
		for(var i = 0; i< nums.length; i++){
			var row = addOrReduceDetail.customItemListGrid.jqGrid('getRowData', nums[i]);

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
			for(var loop=0;loop<addOrReduceItems.length;++loop){
				if(addOrReduceItems[loop].itemType == addRow.itemType 
						&& addOrReduceItems[loop].itemId == row.itemId
						&& addOrReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){ // 已存在
				$("#addOrReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addOrReduceItemList");
		initAddOrReduceDetail();

	}
	addOrReduceDetail.customItemModal.modal("hide");
}

function addSystemDefineItemFunctionArea(){
	var nums = addOrReduceDetail.systemDefineItemListGrid.jqGrid("getGridParam","selarrrow");
	
	if(nums.length!=0){
		$("#functionAreaModal").modal("show");
		$("#quotationFunctionAreaId").get(0).selectedIndex = 0;
		addOrReduceDetail.addType = 3;
	}
}

function addSystemDefineItem(){

	var nums = addOrReduceDetail.systemDefineItemListGrid.jqGrid("getGridParam","selarrrow");
	
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	var options = {};
	
	if(nums.length!=0){
		if(addOrReduceDetail.lastEditId!=-1){
			$("#addOrReduceItemList").jqGrid('restoreRow',addOrReduceDetail.lastEditId);
			addOrReduceDetail.lastEditId=-1;
		}
		
		var ids =  $("#addOrReduceItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		
		for(var i = 0; i< nums.length; i++){
			var row = addOrReduceDetail.systemDefineItemListGrid.jqGrid('getRowData', nums[i]);

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
			for(var loop=0;loop<addOrReduceItems.length;++loop){
				if(addOrReduceItems[loop].itemType == addRow.itemType 
						&&  addOrReduceItems[loop].itemId == row.itemId 
						&& addOrReduceItems[loop].quotationFunctionAreaId == addRow.quotationFunctionAreaId){
					addFlag = false;
					break;
				}
			}
			if(addFlag){//已存在
				$("#addOrReduceItemList").jqGrid('addRowData',maxid+1,addRow,"first");
				maxid++;
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		changeItem("addOrReduceItemList");
		initAddOrReduceDetail();
	}
	addOrReduceDetail.systemDefineItemModal.modal("hide");
}

//-------------------------------------------------------------save -------------------------------

function saveAddOrReduceDetail(submitFlag){
	var url = "";
	var option={};
	var num = 0;
	
	var temAddOrReduceDetail = addOrReduceDetail.addOrReduceDetail;
	var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
	
	for(var i = 0;i<addOrReduceItems.length;++i){
		if(submitFlag == 1 && temAddOrReduceDetail.addOrReduceItems[i].num==0){
			continue;
		}
		option['addOrReduceDetail.addOrReduceItems['+num+'].itemId'] = temAddOrReduceDetail.addOrReduceItems[i].itemId;
		option['addOrReduceDetail.addOrReduceItems['+num+'].itemName'] = temAddOrReduceDetail.addOrReduceItems[i].itemName;
		option['addOrReduceDetail.addOrReduceItems['+num+'].measurementUnitId'] = temAddOrReduceDetail.addOrReduceItems[i].measurementUnitId;
		option['addOrReduceDetail.addOrReduceItems['+num+'].measurementUnit'] = temAddOrReduceDetail.addOrReduceItems[i].measurementUnit;
		option['addOrReduceDetail.addOrReduceItems['+num+'].num'] = temAddOrReduceDetail.addOrReduceItems[i].num;
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationBigCategory'] = temAddOrReduceDetail.addOrReduceItems[i].quotationBigCategory;
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationBigCategoryId'] = temAddOrReduceDetail.addOrReduceItems[i].quotationBigCategoryId;
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationItemDes'] = temAddOrReduceDetail.addOrReduceItems[i].quotationItemDes;
		option['addOrReduceDetail.addOrReduceItems['+num+'].unitPrice'] = temAddOrReduceDetail.addOrReduceItems[i].unitPrice;
		option['addOrReduceDetail.addOrReduceItems['+num+'].workType'] = temAddOrReduceDetail.addOrReduceItems[i].workType;
		option['addOrReduceDetail.addOrReduceItems['+num+'].workTypeId'] = temAddOrReduceDetail.addOrReduceItems[i].workTypeId;	
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationFunctionAreaId'] = temAddOrReduceDetail.addOrReduceItems[i].quotationFunctionAreaId;
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationClassificationId'] = temAddOrReduceDetail.addOrReduceItems[i].quotationClassificationId;
		option['addOrReduceDetail.addOrReduceItems['+num+'].quotationClassification'] = temAddOrReduceDetail.addOrReduceItems[i].quotationClassification;
		option['addOrReduceDetail.addOrReduceItems['+num+'].itemType'] = temAddOrReduceDetail.addOrReduceItems[i].itemType;
		
		++num;
	}
	
	option['addOrReduceDetail.arId'] = temAddOrReduceDetail.arId;
	option['addOrReduceDetail.OrderId'] = temAddOrReduceDetail.OrderId;
	option['addOrReduceDetail.versionId'] = temAddOrReduceDetail.versionId;
	option['addOrReduceDetail.versionName'] = temAddOrReduceDetail.versionName;
	option['addOrReduceDetail.orderTotalPrice'] = temAddOrReduceDetail.orderTotalPrice;
	option['addOrReduceDetail.quotationDiscount'] = temAddOrReduceDetail.quotationDiscount;
	option['addOrReduceDetail.addReduceType'] = temAddOrReduceDetail.addReduceType;
	option['addOrReduceDetail.addReduceTotal'] = Math.round(temAddOrReduceDetail.totalPrice);
	if(submitFlag){
		option['addOrReduceDetail.addReduceStatus'] = 1;
		
		if(addOrReduceDetail.lastEditId != -1){
			$(this).jqGrid('restoreRow', addOrReduceDetail.lastEditId);
			addOrReduceDetail.lastEditId=-1;
		}
	}else{
		option['addOrReduceDetail.addReduceStatus'] = 0;
	}
	
	option['addOrReduceDetail.orderPaymentId'] = temAddOrReduceDetail.orderPaymentId;
	option['addOrReduceDetail.addReduceDes'] = temAddOrReduceDetail.addReduceDes;
	
	if(submitFlag){
		url = api.decoration.submitAddOrReduceDetail;
	}else{
		url = api.decoration.saveAddOrReduceDetail;
	}
	
	com.post(api.decoration.checkAddOrReduceForPenalty, option, function(res1){
		
		if(res1.breachContractFlag == 1){
			bootbox.confirm("增减项总和满足违约金条件,继续吗?", function(res2){
				if(res2){
					com.post(url, option, function(res){
						if(submitFlag){
							com.showAlert(com.info, "提交成功");
							$("#fl-container").load(api.index.decorationOrderAddOrReduceIndex.url, {}, function(){
								addOrReduce.decorationOrderId = addOrReduceDetail.addOrReduceDetail.orderId;
								addOrReduce.initAddOrReduceList();
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
					$("#fl-container").load(api.index.decorationOrderAddOrReduceIndex.url, {}, function(){
						addOrReduce.decorationOrderId = addOrReduceDetail.addOrReduceDetail.orderId;
						addOrReduce.initAddOrReduceList();
					});
				}else{
					com.showAlert(com.info, "保存成功");
				}
			});
		}
	});
}