var audit = {
	orderId:null,
	
	orderAudit:null,
	loadOrderAudit:loadOrderAudit,
	initAuditItem:initAuditItem,
	
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
	$('#fl-statement').statement("预算审计", "报价项详细");
	
	audit.orderId = params.orderId;

	//报价项
	audit.quotationItemModal = $("#quotationItemModal");
	audit.quotationItemSearchDiv = $("#quotationItemSearchDiv");
	audit.quotationItemListGrid = $("#quotationItemListGrid");
	audit.quotationItemGridPager = $("#quotationItemGridPager");
	
	//报价项 自定义
	audit.customItemModal = $("#customItemModal");
	audit.customItemSearchDiv = $("#customItemSearchDiv");
	audit.customItemListGrid = $("#customItemListGrid");
	audit.customItemGridPager = $("#customItemGridPager");
	
	//系统定义项
	audit.systemDefineItemModal = $("#systemDefineItemModal");
	audit.systemDefineItemSearchDiv = $("#systemDefineItemSearchDiv");
	audit.systemDefineItemListGrid = $("#systemDefineItemListGrid");
	audit.systemDefineItemGridPager = $("#systemDefineItemGridPager");
	
	//新增项
	audit.addItemModal = $("#addItemModal");
	
	initDataMap();
		
	$('#detailBckBtn').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderAuditIndex.url);
	});
	
	$('#saveOrderAuditBtn').on(ace.click_event, function(){
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su = $("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				
				audit.lastEditId=-1;
				changeItem("auditItemList");
				initAuditItem();
			}else{
				return;
			}
		}
		saveOrderAudit(0);
	});
	
	$('#submitOrderAuditBtn').on(ace.click_event, function(){
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				
				audit.lastEditId=-1;
				changeItem("auditItemList");
				initAuditItem();
			}else{
				return;
			}
		}
		
		bootbox.confirm("工作量是0的报价项将会被删除，确认提交吗？",function(res){
			if(res == true){
				saveOrderAudit(1);
			}
		});
	});
		
//---------------------------添加报价项------------------------
	$("#addQuotaionItemBtn").on(ace.click_event, function(event){
		$("#itemNameSearch").val("");
		$("#quotationWorkTypeSearch").val("");
		$("#quotationBigCategorySearch").val("");
		
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				audit.lastEditId = -1;
				changeItem("auditItemList");
				initAuditItem();
				
			}else{
				return;
			}
		}
		
		audit.quotationItemPostParam.versionId = audit.orderAudit.versionId;
		
		audit.quotationItemPostParam["quotationItem.versionId"] = audit.orderAudit.versionId;
		
		$.jgrid.refreshGrid(audit.quotationItemListGrid, audit.quotationItemPostParam);
		
		audit.quotationItemModal.modal("show");
	});
	
	$("#saveAddItemsBtn").on(ace.click_event, function(event){
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				audit.lastEditId = -1;
				changeItem("auditItemList");
				initAuditItem();
			}else{
				return;
			}
		}
		
		var nums = audit.quotationItemListGrid.jqGrid("getGridParam","selarrrow");
		if(nums.length != 0){
			$("#functionAreaModal").modal("show");
			$("#functionAreaId").get(0).selectedIndex = 0;
			audit.addType = 1;
		}
	});
	
	//=======================报价项 - 自定义===================
	$("#addCunstomItemsBtn").on(ace.click_event, function(event){
		$("#itemNameSearch2").val("");
		$("#quotationWorkTypeSearch2").val("");
		$("#quotationBigCategorySearch2").val("");
		
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				audit.lastEditId = -1;
				changeItem("auditItemList");
				initAuditItem();
			}else{
				return;
			}
		}
		
		audit.customItemPostParam.quotationId = audit.orderAudit.quotationId;
		$.jgrid.refreshGrid(audit.customItemListGrid, audit.customItemPostParam);
		
		audit.customItemModal.modal("show");
	});
	
	$("#saveCustomItemBtn").on(ace.click_event, function(event){
		var nums = audit.customItemListGrid.jqGrid("getGridParam","selarrrow");
		if(nums.length != 0){
			$("#functionAreaModal").modal("show");
			$("#functionAreaId").get(0).selectedIndex = 0;
			audit.addType = 2;
		}
	});
	
	//=====================系统定义项====================
	$("#addSystemDefineItemBtn").on(ace.click_event, function(event){
		$("#itemNameSearch1").val("");
		$("#quotationWorkTypeSearch1").val("");
		$("#quotationBigCategorySearch1").val("");
		
		$.jgrid.refreshGrid(audit.customItemListGrid, audit.customItemPostParam);
		
		audit.systemDefineItemModal.modal("show");
	});
	
	$("#saveSysDefineItemBtn").on(ace.click_event, function(event){
		var nums = audit.systemDefineItemListGrid.jqGrid("getGridParam","selarrrow");
		if(nums.length!=0){
			$("#functionAreaModal").modal("show");
			$("#functionAreaId").get(0).selectedIndex = 0;
			audit.addType = 3;
		}
	});
	
	//=====================新加报价项=====================
	$("#addNewItemBtn").on(ace.click_event, function(event){
		com.clearValidator();
		if(audit.lastEditId != -1){
			
			var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
			if(gridEditRes){
				
				var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
				var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
				audit.lastEditId = -1;
				changeItem("auditItemList");
				initAuditItem();
				
			}else{
				return;
			}
		}
		$("#itemName").val("");
		$("#des").val("");
		$("#unitPrice").val("");
		$("#num").val("");
		$("#quotationBigCategory").get(0).selectedIndex = 0;
		$("#measurementUnit").get(0).selectedIndex = 0;
		$("#itemWorkType").get(0).selectedIndex = 0;
		
		audit.addItemModal.modal("show");
	});
	
	$("#saveAddNewItemBtn").on(ace.click_event, function(event){
		
		if(com.validate("addItemModal")){
			return;
		}
		
		var addRow = {};
		addRow.num = $("#num").val();
		addRow.itemName = $("#itemName").val();
		addRow.categoryId = $("#quotationBigCategory").val();
		addRow.measurementUnitId = $("#measurementUnit").val();
		addRow.unitPrice = $("#unitPrice").val();
		addRow.des = $("#des").val();
		addRow.workTypeId = $("#itemWorkType").val();
		addRow.functionAreaId = $("#functionAreaId").val();
		
		addRow.itemType = 2; // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目

		if(audit.lastEditId != -1){
			$("#auditItemList").jqGrid('restoreRow',audit.lastEditId);
			audit.lastEditId = -1;
		}
		var ids = $("#auditItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		
		if(maxid == -Infinity){
			maxid = 0;
		}
		
		$("#auditItemList").jqGrid('addRowData',maxid+1,addRow,"first");
		
		changeItem("auditItemList");
		initAuditItem();
		
		audit.addItemModal.modal("hide");
	});
	
	$("#confirmItemBtn").on(ace.click_event, function(event){
		addAuditItems();
		$("#functionAreaModal").modal("hide");
	});
	
	loadOrderAudit();
});

//---------------------------------------------字典初始化--------------------------------
function initDataMap(){
	
	$.when(
		com.post(api.quotation.queryQuotationType), 
		com.post(api.common.queryMeasurementUnit), 
		com.post(api.quotation.queryQuotationBigCategory), 
		com.post(api.common.queryWorkType), 
		com.post(api.quotation.queryQuotationClassification)
	).done(function(quotaTypeRes, unitRes, categoryRes, workTypeRes, quotaClassifyRes){
		audit.quotationTypes = quotaTypeRes.quotationTypes;
		audit.quotationTypesStr = "";
		
		for(var i=0;i<audit.quotationTypes.length;++i){
			audit.quotationTypesStr += (audit.quotationTypes[i].id + ":" + audit.quotationTypes[i].name + ";");
		}
		
		audit.quotationTypesStr = audit.quotationTypesStr.substr(0,audit.quotationTypesStr.length-1);
		
		audit.measurementUnits = unitRes.measurementUnits;
		audit.measurementUnitsStr = "";
		
		for(var i=0;i<audit.measurementUnits.length;++i){
			audit.measurementUnitsStr += (audit.measurementUnits[i].id+":"+audit.measurementUnits[i].name+";");
		}
		
		audit.measurementUnitsStr = audit.measurementUnitsStr.substr(0,audit.measurementUnitsStr.length-1);
		$("#measurementUnit").bindData(audit.measurementUnits, "id", "name");
		
		audit.quotationBigCategorys = categoryRes.quotationBigCategorys;
		audit.quotationBigCategorysStr = "";
		
		for(var i=0;i<audit.quotationBigCategorys.length;++i){
			audit.quotationBigCategorysStr+=(audit.quotationBigCategorys[i].id+":"+audit.quotationBigCategorys[i].name+";");
		}
		audit.quotationBigCategorysStr = audit.quotationBigCategorysStr.substr(0,audit.quotationBigCategorysStr.length-1);
		$("#quotationBigCategory").bindData(audit.quotationBigCategorys, "id", "name");
		
		audit.workTypes = workTypeRes.workTypes;
		audit.workTypesStr = "";
		
		for(var i=0;i<audit.workTypes.length;++i){
			audit.workTypesStr += (audit.workTypes[i].id+":"+audit.workTypes[i].name+";");
		}
		audit.workTypesStr = audit.workTypesStr.substr(0,audit.workTypesStr.length-1);
		$("#itemWorkType").bindData(audit.workTypes, "id", "name");
		
		audit.quotationClassifications = quotaClassifyRes.quotationClassifications;
		audit.quotationClassificationsStr = "";
		for(var i=0;i<audit.quotationClassifications.length;++i){
			audit.quotationClassificationsStr+=(audit.quotationClassifications[i].id+":"+audit.quotationClassifications[i].name+";");
		}
		audit.quotationClassificationsStr =audit.quotationClassificationsStr.substr(0,audit.quotationClassificationsStr.length-1);
		
	}).fail(function(){
		console.log("initialize date map fail ...");
	});
}

function loadOrderAudit(){
	com.post(api.audit.queryBudgetAuditItemByOrderId, {"orderAudit.orderId": audit.orderId}, function(res){
		audit.orderAudit = res.orderAudit;
		
		audit.customItemPostParam["customQuotationItem.quotationId"] = audit.orderAudit.quotationId;
		audit.quotationItemPostParam.versionId = audit.orderAudit.versionId;
		
		com.post(api.quotation.queryQuotationFunctionAreaForCommonById, {"quotationDetail.autoId": audit.orderAudit.quotationId}, function(res){
			audit.quotationFunctionAreas = res.quotationFunctionAreas;
			audit.quotationFunctionAreasStr = "";
			
			for(var i=0;i<res.quotationFunctionAreas.length;++i){
				audit.quotationFunctionAreasStr+=(res.quotationFunctionAreas[i].autoId+":"+res.quotationFunctionAreas[i].functionAreaName+";");
			}
			
			audit.quotationFunctionAreasStr =audit.quotationFunctionAreasStr.substr(0,audit.quotationFunctionAreasStr.length-1);
			$("#addQuotationFunctionAreaId").bindData(audit.quotationFunctionAreas, "autoId", "functionAreaName");
			$("#functionAreaId").bindData(audit.quotationFunctionAreas, "autoId", "functionAreaName");
			
			initAuditItem();
		});
		
		initQuotationItemList();
		initCustomItemList();
		initSystemDefineItemList();
	});
}

function initQuotationItemList(){
	
	var quotationItemSearchOpts = {
		url: api.quotation.pageQuotationItemByVersionId,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId": audit.orderAudit.versionId},
		listgrid: audit.quotationItemListGrid,
		items: [
	        {label:"名称", id:"itemNameSearch", name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select", op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch", name:"quotationWorkTypeId", type:"select", op:"eq"}
        ]
	};
	
	audit.quotationItemSearchDiv.flSearch(quotationItemSearchOpts);
	$("#quotationBigCategorySearch").bindData(audit.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch").bindData(audit.workTypes, "id", "name", true);
	
	audit.quotationItemListGrid.jqGrid({		
		url: api.quotation.pageQuotationItemByVersionId.url,
		postData:audit.quotationItemPostParam,
		colNames:['autoId','编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '说明', '单价', '版本', 'itemWorkTypeId', 'measurementUnitId', 'quotationClassificationId', 'categoryId', 'quotationSmallCategoryId', 'quotationTypeId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName',  width:300,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification',  width:50,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit',  width:50,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkType',  width:40,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice' ,width:50},
			{name:'version',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassificationId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategoryId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId',hidden: true, searchoptions: {sopt: ["cn"]}}
		], 
		autowidth:false,
		width:'690',
		pager : audit.quotationItemGridPager,
		caption: ""
	});
}

function initSystemDefineItemList(){
	var systemDefineItemSearchOpts = {
		url: api.quotation.pageSystemDefineItem,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: audit.systemDefineItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch1",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch1", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch1", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
	
	audit.systemDefineItemSearchDiv.flSearch(systemDefineItemSearchOpts);
	$("#quotationBigCategorySearch1").bindData(audit.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch1").bindData(audit.workTypes, "id", "name", true);
	
	audit.systemDefineItemListGrid.jqGrid({		
		url: api.quotation.pageSystemDefineItem.url,
		postData: {},
		colNames:['autoId','编号', '名称',  '大类', '单位', '工种', '说明', '单价', 'itemWorkTypeId', 'measurementUnitId', 'categoryId', 'status'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice'},
			{name:'itemWorkTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'status', hidden: true}
		], 
		autowidth:false,
		width:'690',
		pager : audit.systemDefineItemGridPager,
		caption: ""
	});
}

function initCustomItemList(){
	var customItemSearchOpts = {
		url: api.decoration.pageCustomerItemByQuotationId,
		postParmas: {"paging.rows":10, "paging.page":1, "customQuotationItem.quotationId":audit.orderAudit.quotationId},
		listgrid: audit.quotationItemListGrid,
		items: [
	        {label:"名称",id:"itemNameSearch2",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch2", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch2", name:"quotationWorkTypeId", type:"select",op:"eq"}
	    ]
	};
	
	audit.customItemSearchDiv.flSearch(customItemSearchOpts);
	$("#quotationBigCategorySearch2").bindData(audit.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch2").bindData(audit.workTypes, "id", "name", true);
	
	audit.customItemListGrid.jqGrid({		
		url: api.decoration.pageCustomerItemByQuotationId.url,
		postData: audit.customItemPostParam,
		colNames:['autoId','编号', '名称',  '大类', '单位', '工种', '说明', '单价', 'itemWorkTypeId','measurementUnitId','quotationBigCategoryId', 'status'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice'},
			{name:'itemWorkTypeId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnitId',hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategoryId', hidden: true, searchoptions: {sopt: ["cn"]}},
			{name:'status', hidden: true}
		],
		autowidth:false,
		width:'690',
		pager : audit.customItemGridPager,
		caption: ""
	});
}

function calAuditItemSum(){
	var orderAudit = audit.orderAudit;
	var auditItems = audit.orderAudit.budgetAuditItems;
	
	var totalPrice = 0;//总价
	var discountPrice = 0;//打折
	var noDiscountTotalPrice = 0;//不打折
	
	for(var i=0;i<auditItems.length;++i){
		var tem = Math.round(parseFloat(auditItems[i].unitPrice)*parseFloat(auditItems[i].num)*100)/100;
		discountPrice +=tem;
		totalPrice+=tem;
	}
	
	orderAudit.totalPrice = Math.round(totalPrice*100)/100;//总价
	orderAudit.discountPrice =  Math.round(discountPrice*100)/100;//打折
	orderAudit.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
}

function initAuditItem(){
	
	var auditItems = audit.orderAudit.budgetAuditItems;
	
	calAuditItemSum();
	
	$("#auditItemDiv").html("");
	$("#auditItemDiv").html('<table id="auditItemList"></table> '); 
	
	$("#auditItemList").jqGrid({		
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['工程预算量', '名称', '功能区', '大类', '单位', '单价', '总价', '工艺说明', '操作', 'itemId', 'workTypeId', 'itemType', "状态", '状态说明'],
		colModel:[
			{name:"num",editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
			{name:"itemName",editable:true,edittype: "text",editoptions:{maxlength:32},editrules:{ required:true ,custom:true,custom_func:checkGridItemName}},
			{name:"functionAreaId",formatter:"select",editable:true,edittype: "select",editoptions:{value:audit.quotationFunctionAreasStr}},
			{name:"categoryId",formatter:"select",editable:true,edittype: "select",editoptions:{value:audit.quotationBigCategorysStr}},
			{name:"measurementUnitId",formatter:"select",editable:true,edittype: "select",editoptions:{value:audit.measurementUnitsStr}},
			{name:"unitPrice",editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridNum}},
			{name:"sumMoney",formatter:sumMoneyFormatter},
			{name:"des",width:100,formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat,editable:true, edittype:'textarea',editoptions:{maxlength:500},editrules:{ required:true ,custom:true,custom_func:checkGridQuotationItemDes}},
			{name:'deleteAction', width: 50, title:false,formatter:deleteActionFormatter,unformat:quotationItemDesUnformat},
			{name:"itemId",hidden:true},
			{name:"workTypeId",hidden:true},
			{name:"itemType",hidden:true},
			{name:"status",hidden:true},
			{name:"comment",hidden:true}
		], onSelectRow: function(id){
			if(id && (id !== audit.lastEditId)){
				var rowData = $(this).jqGrid("getRowData", id); 
				if(rowData.status == "扣款")
					return;
				
				$('[data-rel="tooltip"]').tooltip('hide');
				
				if(audit.lastEditId != -1){
					
					var gridEditRes = $(this).jqGrid('saveRow',audit.lastEditId);
					if(gridEditRes){
						
						var newRowData = $(this).jqGrid("getRowData", audit.lastEditId); 
						var su=$(this).jqGrid('setRowData',audit.lastEditId,newRowData);
						audit.lastEditId=-1;
						changeItem("auditItemList");
						
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
							$("#"+rowid+"_categoryId").prop("disabled", true);
							$("#"+rowid+"_unitPrice").prop("disabled", true);
							$("#"+rowid+"_measurementUnitId").prop("disabled", true);
							$("#"+rowid+"_itemName").prop("disabled", true);
							$("#"+rowid+"_des").prop("disabled", true);
						}
									
						$("#"+rowid+"_num").on('focus',function(){
							this.select(); 
						});
					}, aftersavefunc: function(rowid){
						var newRowData = $(this).jqGrid("getRowData", rowid); 
						var su=$(this).jqGrid('setRowData',rowid,newRowData);
						console.log(newRowData);
						audit.lastEditId = -1;
					
						changeItem("auditItemList");
						
						initAuditItem();
						$('[data-rel="tooltip"]').tooltip({container:'#auditItemDiv'});
					}, afterrestorefunc:function(rowid){
						audit.lastEditId = -1;
					}
					
				});
				
				audit.lastEditId = id;
			}
		}
	});
	
	for(var j=0;j<auditItems.length;j++){
		$("#auditItemList").jqGrid("addRowData",j,auditItems[j]);
	}
	
	//初始化报价概要信息
	$("#sumLabActivityName").html(audit.orderAudit.orderActivity);
	$("#sumLabSumMoney").html(Math.round((audit.orderAudit.totalPrice)*100)/100);
	$("#sumLabType").html("扣款");
	$('[data-rel="tooltip"]').tooltip('destroy');
	$('[data-rel="tooltip"]').tooltip({container:'#auditItemDiv'});
}

//-------------------------------------------------报价项的格式化------------------------------------------
function deleteActionFormatter(cellvalue, options, row){
	var str = "";
	if(row.status != "扣款"){
		str +='<div title="" style="margin-right: 5px; display: block;" class="ui-pg-div ui-inline-del" id="jDeleteButton_'+options.rowId+"\"";
		str +=' onclick="removeItem('+options.rowId+', \''+row.status+'\')" onmouseover="jQuery(this).addClass(\'ui-state-hover\');" onmouseout="jQuery(this).removeClass(\'ui-state-hover\');" ><span class="ui-icon ui-icon-trash"></span></div>';
	}
	return str;
  }

function discountUnitPriceFormatter(cellvalue, options, rowObject){
	return Math.round(parseFloat(rowObject.unitPrice)*100)/100;//不打折
}

function sumMoneyFormatter(cellvalue, options, rowObject){
	return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num)*100)/100; // 不打折
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.des+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.des+"' />";
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
	return $('input', cell).val();
}

//----------------------------------报价项的编辑和删除以及添加-----------------------------------------
function checkGridNum(value, colname){
	if(value.length <= 0 || value.length > 6){
		return [false, "\"" + colname + "\"的长度应在1~5之间."];
	}
	
	if((/^((\d)+(\.)?(\d)*)$/).test(value) == false){ 
         return [false,"\"" + colname + "\"需要不小于0的数浮点数"];
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
		return [false,"\"" + colname + "\"的长度应在1~500之间."];
	}else{ 
        return [true,""];
	}
}

function removeItem(rowId, status){
	if(status == "扣款"){
		bootbox.alert("该记录已被扣款, 不能进行删除.");
		return;
	}
	if(audit.lastEditId != -1 && rowId != audit.lastEditId){
		
		var gridEditRes = $("#auditItemList").jqGrid('saveRow',audit.lastEditId);
		if(gridEditRes){
			
			var newRowData = $("#auditItemList").jqGrid("getRowData", audit.lastEditId); 
			var su=$("#auditItemList").jqGrid('setRowData',audit.lastEditId,newRowData);
			audit.lastEditId = -1;
			changeItem("auditItemList");
			initAuditItem();
			
		}else{
			return;
		}
	}
	
	var row = $("#auditItemList").jqGrid('getRowData',rowId);
	
	bootbox.confirm("确定要删除吗?",function(result){
		if(result){
			audit.lastEditId=-1;
			$("#auditItemList").jqGrid('delRowData',rowId);
			changeItem("auditItemList");
			initAuditItem();
		}
	});
}

function addAuditItems(){
	var listgrid = null, modal = null, itemType = null;
	if(audit.addType == 1){
		listgrid = audit.quotationItemListGrid;
		modal = audit.quotationItemModal;
		itemType = 0; // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	}else if(audit.addType == 2){
		listgrid = audit.customItemListGrid;
		modal = audit.customItemModal;
		itemType = 1;
	}else if(audit.addType == 3){
		listgrid = audit.systemDefineItemListGrid;
		modal = audit.systemDefineItemModal;
		itemType = 3;
	}
	
	var auditItems = audit.orderAudit.budgetAuditItems;
	
	var nums = listgrid.jqGrid("getGridParam","selarrrow");
	if(nums.length != 0){
		if(audit.lastEditId != -1){
			$("#auditItemList").jqGrid('restoreRow',audit.lastEditId);
			audit.lastEditId = -1;
		}
		
		var ids = $("#auditItemList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity)
			maxid = 0;
		
		for(var i=0;i< nums.length;i++){
			var addRow = {};
			
			addRow.num = 0;
			addRow.itemName = row.itemName;
			addRow.categoryId = row.quotationBigCategoryId;
			addRow.measurementUnitId = row.measurementUnitId;
			addRow.unitPrice = row.unitPrice;
			addRow.des = row.quotationItemDes;
			addRow.workTypeId = row.itemWorkTypeId;
			addRow.itemId = row.itemId;
			addRow.functionAreaId = $("#functionAreaId").val();
			console.log("row "+ addRow);
			
			addRow.itemType = itemType; // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			addRow.status = row.status;
			
			var addFlag = true;
			for(var j=0;j<auditItems.length;++j){
				if(auditItems[j].itemType == addRow.itemType && auditItems[j].itemName == row.itemName && auditItems[j].functionAreaId == row.functionAreaId){
					addFlag = false;
					break;
				}
			}
			
			if(addFlag){ // 已存在
				$("#auditItemList").jqGrid('addRowData', ++maxid, addRow, "first");
			}else{
				bootbox.alert('该报价('+addRow.itemName+')已存在');
			}
		}
		
		changeItem("auditItemList");
		initAuditItem();
	}
	
	modal.modal("hide");
}

function changeItem(tableId){
	var auditItems = audit.orderAudit.budgetAuditItems;
	
	if(audit.lastEditId != -1){
		$("#"+tableId).jqGrid('restoreRow',audit.lastEditId);
		audit.lastEditId = -1;
	}
	
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	auditItems.splice(0);
	  
	for(var i=0;i< ids.length;++i){
		var item = {};
		var rowData = $("#" + tableId).jqGrid('getRowData',ids[i]);
		
        item.itemId= rowData.itemId;
        item.itemName= rowData.itemName;
        item.categoryId = rowData.categoryId;
        item.measurementUnitId= rowData.measurementUnitId;
        item.num= rowData.num;
        item.des= rowData.des;
        item.itemType= rowData.itemType;
        item.unitPrice=  rowData.unitPrice;
        item.workTypeId= rowData.workTypeId;
        item.functionAreaId = rowData.functionAreaId;
        item.status = rowData.status;
        item.comment = rowData.comment;
        
        auditItems.push(item);
	}
	
	calAuditItemSum();
	
	$("#sumLabSumMoney").html(Math.round((audit.orderAudit.totalPrice) * 100) / 100);
}

function saveOrderAudit(submitFlag){
	
	var url = "";
	var num = 0;
	var option = {};
	
	var temp = audit.orderAudit;
	var auditItems = temp.budgetAuditItems;
	
	for(var i = 0;i<auditItems.length;++i){
		if(submitFlag == 1 && auditItems[i].num == 0){
			continue;
		}
		
		option['orderAudit.budgetAuditItems['+num+'].orderId'] = temp.orderId;
		option['orderAudit.budgetAuditItems['+num+'].itemId'] = temp.budgetAuditItems[i].itemId;
		option['orderAudit.budgetAuditItems['+num+'].itemName'] = temp.budgetAuditItems[i].itemName;
		option['orderAudit.budgetAuditItems['+num+'].itemType'] = temp.budgetAuditItems[i].itemType;
		option['orderAudit.budgetAuditItems['+num+'].measurementUnitId'] = temp.budgetAuditItems[i].measurementUnitId;
		option['orderAudit.budgetAuditItems['+num+'].measurementUnitName'] = temp.budgetAuditItems[i].measurementUnitName;
		option['orderAudit.budgetAuditItems['+num+'].num'] = temp.budgetAuditItems[i].num;
		option['orderAudit.budgetAuditItems['+num+'].categoryName'] = temp.budgetAuditItems[i].categoryName;
		option['orderAudit.budgetAuditItems['+num+'].categoryId'] = temp.budgetAuditItems[i].categoryId;
		option['orderAudit.budgetAuditItems['+num+'].des'] = temp.budgetAuditItems[i].des;
		option['orderAudit.budgetAuditItems['+num+'].unitPrice'] = temp.budgetAuditItems[i].unitPrice;
		option['orderAudit.budgetAuditItems['+num+'].workTypeName'] = temp.budgetAuditItems[i].workTypeName;
		option['orderAudit.budgetAuditItems['+num+'].workTypeId'] = temp.budgetAuditItems[i].workTypeId;	
		option['orderAudit.budgetAuditItems['+num+'].functionAreaId'] = temp.budgetAuditItems[i].functionAreaId;	
		option['orderAudit.budgetAuditItems['+num+'].status'] = temp.budgetAuditItems[i].status;
		option['orderAudit.budgetAuditItems['+num+'].comment'] = temp.budgetAuditItems[i].comment;	
		
		++num;
	}
	
	option['orderAudit.orderId'] = temp.orderId;
	option['orderAudit.versionId'] = temp.versionId;
	option['orderAudit.versionName'] = temp.versionName;
	option['orderAudit.orderTotalPrice'] = temp.orderTotalPrice;
	option['orderAudit.quotationDiscount'] = temp.quotationDiscount;
	
	
	if(submitFlag){
		url = api.audit.submitBudgetAuditItem;
	}else{
		url = api.audit.addBudgetAuditItem;
	}
	
	com.post(url, option, function(res){
		if(submitFlag){
			com.showAlert(com.info, "提交成功");
			$("#fl-container").load(api.index.decorationOrderAuditIndex.url, {}, function(){
				audit.orderId = audit.orderAudit.orderId;
			});
		}else{
			com.showAlert(com.info, "保存成功");
		}
	});
}