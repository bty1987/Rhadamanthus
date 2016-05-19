var quotationItem = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	importBtn:null,
	importCancelBtn:null,
	modal: null,
	quotationItemItems: {},
	data: {
		quotationTypeData:{},
		quotationClassificationData: {},
		quotationBigCategoryData: {},
		quotationSmallCategoryData: {},
		measurementUnitData: {},
		workTypeData: {},
		versionData: {}
	},
	
	editFlag: false,
	repeatFlg:false,
	
	validator: {
		region: {
			type: "v_itemId", 
			regex: /^QI_\d{5}$/g,
			errorMsg: "请以QI_作为前缀 , 之后以五个位数字组成(如QI_00001)."
		}
	}
};

jQuery(function($) {
	
	quotationItem.listGrid = $("#listGrid");
	quotationItem.gridPager = "#gridPager";
	quotationItem.saveBtn = $("#saveBtn").on("click", saveData);
	quotationItem.cancelBtn = $("#cancelBtn");
	quotationItem.modal = $("#quotationItemModal");
	quotationItem.importModal = $("#quotationItemImportModal");
	quotationItem.importBtn = $("#importBtn").on("click", importItems);
	quotationItem.importCancelBtn = $("#importCancelBtn");
	quotationItem.quotationItemItems.itemId = $("#itemId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == ""){
			return;
		}
		
		var options = {
			"quotationItem.itemId": $this.val(),
			"quotationItem.versionId": $("#version").val(),
		}
		
		com.post(api.quotation.queryQuotationItemByItemIdAVersionId, options, function(res){
			if(res.quotationItem && res.quotationItem.itemId){
				com.showTips($this, "该版本的项目编号已存在", true);
				quotationItem.repeatFlg = true;
			}else{
				com.clearValidator("#itemId", true);
				quotationItem.repeatFlg = false;
			}
		});
	});
	
	quotationItem.quotationItemItems.autoId = $("#autoId");
	quotationItem.quotationItemItems.quotationType = $("#quotationType");
	quotationItem.quotationItemItems.quotationClassification = $("#quotationClassification");
	quotationItem.quotationItemItems.quotationBigCategory = $("#quotationBigCategory");
	quotationItem.quotationItemItems.quotationSmallCategory = $("#quotationSmallCategory");
	quotationItem.quotationItemItems.itemName = $("#itemName");
	quotationItem.quotationItemItems.measurementUnit = $("#measurementUnit");
	quotationItem.quotationItemItems.workType = $("#workType");
	quotationItem.quotationItemItems.quotationItemDes = $("#quotationItemDes");
	quotationItem.quotationItemItems.unitPrice = $("#unitPrice");
	quotationItem.quotationItemItems.version = $("#version").on("change",function(){
		$this = $(this);
		
		if(quotationItem.quotationItemItems.itemId.val() == ""){
			return;
		}
		
		var options = {
			"quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
			"quotationItem.versionId": $("#version").val(),
		}
		
		com.post(api.quotation.queryQuotationItemByItemIdAVersionId, options, function(res){
			if(res.quotationItem && res.quotationItem.itemId){
				com.showTips(quotationItem.quotationItemItems.itemId, "该版本的项目编号已存在", true);
				quotationItem.repeatFlg = true;
			}else{
				com.clearValidator("#itemId", true);
				quotationItem.repeatFlg = false;
			}
		});
	});
	
	quotationItem.quotationItemItems.importVersion = $("#importVersion");
	
	quotationItem.modal.on('shown.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#itemId", true);
		
		if(quotationItem.editFlg == false){
			quotationItem.quotationItemItems.quotationType.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.quotationClassification.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.quotationBigCategory.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.quotationSmallCategory.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.workType.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.measurementUnit.get(0).selectedIndex = 0;
			quotationItem.quotationItemItems.version.get(0).selectedIndex = 0;
		}
	});
	
	quotationItem.importModal.on('shown.bs.modal', function(e){
		$("#importVersion").get(0).selectedIndex = 0;
	});
	
	quotationItem.importModal.on('hide.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#itemId", true);
	});
	
	$.extend(com.validator, quotationItem.validator);
	
	var searchOpts = {
		url: api.quotation.pageQuotationItem,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: quotationItem.listGrid,
		items: [
	        {label:"名称",id:"itemNameSearch",name:"itemName", type:'text'},
	        {label:"类型", id:"quotationTypeSearch", name:"quotationTypeId", type:"select",op:"eq"},
	        {label:"分类", id:"quotationClassificationSearch", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"小类", id:"quotationSmallCategorySearch", name:"quotationSmallCategoryId", type:"select",op:"eq"},
	        {label:"版本", id:"versionSearch", name:"versionId", type:"select",op:"eq"}
	    ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	bindQuotationItemPageSelect();

	quotationItem.listGrid.jqGrid({		
		url: api.quotation.pageQuotationItem.url,
		colNames:['autoId','编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种','类型', '分类', '大类', '小类', '单位', '版本', '工种', '说明', '单价', '版本'],
		colModel:[
		    {name:'autoId',hidden:true},
			{name:'itemId', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'workType', search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationTypeId',hidden:true},
			{name:'quotationClassificationId',hidden:true},
			{name:'quotationBigCategoryId',hidden:true},
			{name:'quotationSmallCategoryId',hidden:true},
			{name:'measurementUnitId',hidden:true},
			{name:'workTypeId',hidden:true},
			{name:'versionId', hidden:true},
			{name:'quotationItemDes'},
			{name:'unitPrice'},
			{name:'version', search: true, searchoptions: {sopt: ["cn"]}},
		], 
		rowNum:50,
		rowList:[50,100,200],
		pager : quotationItem.gridPager,
		caption: "报价项信息列表"
		
	});

	quotationItem.listGrid.navGrid(quotationItem.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(quotationItem.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			quotationItem.editFlg = true;
			var num = quotationItem.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(quotationItem.listGrid.attr("id"));
				return;
			}
			
			var row = quotationItem.listGrid.jqGrid("getRowData", num);
			quotationItem.quotationItemItems.autoId.val(row.autoId);
			quotationItem.quotationItemItems.itemId.val(row.itemId);
			quotationItem.quotationItemItems.itemName.val(row.itemName);
			quotationItem.quotationItemItems.quotationType.val(row.quotationTypeId); 
			quotationItem.quotationItemItems.quotationClassification.val(row.quotationClassificationId); 
			quotationItem.quotationItemItems.quotationBigCategory.val(row.quotationBigCategoryId); 
			quotationItem.quotationItemItems.quotationSmallCategory.val(row.quotationSmallCategoryId); 
			quotationItem.quotationItemItems.workType.val(row.workTypeId); 
			quotationItem.quotationItemItems.measurementUnit.val(row.measurementUnitId); 
			
			quotationItem.quotationItemItems.quotationItemDes.val(row.quotationItemDes);
			quotationItem.quotationItemItems.unitPrice.val(row.unitPrice);
			quotationItem.quotationItemItems.version.val(row.versionId); 
			quotationItem.quotationItemItems.itemId.prop("disabled", true);
			quotationItem.quotationItemItems.version.prop("disabled", true);
			quotationItem.modal.modal("show");
		},
		position: "first"
	}).navButtonAdd(quotationItem.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			quotationItem.editFlg = false;
			com.cleanItems(quotationItem.quotationItemItems);
			quotationItem.quotationItemItems.itemId.prop("disabled", false);
			quotationItem.quotationItemItems.version.prop("disabled", false);
			quotationItem.modal.modal("show");
		},
		position: "first"
	});
});

function bindQuotationItemPageSelect(){
	com.post(api.quotation.queryQuotationType, {}, function(res){
		quotationItem.data.quotationTypeData = res.quotationTypes;
		$("#quotationType").bindData(quotationItem.data.quotationTypeData, "id", "name");
		$("#quotationTypeSearch").bindData(quotationItem.data.quotationTypeData, "id", "name", true);
	}, function(msg){
		return {};
	});
		
	com.post(api.quotation.queryQuotationClassification, {}, function(res){
		quotationItem.data.quotationClassificationData = res.quotationClassifications;
		$("#quotationClassification").bindData(quotationItem.data.quotationClassificationData, "id", "name");
		$("#quotationClassificationSearch").bindData(quotationItem.data.quotationClassificationData, "id", "name", true);
	}, function(msg){
		return {};
	});
		
	com.post(api.quotation.queryQuotationBigCategory, {}, function(res){
		quotationItem.data.quotationBigCategoryData = res.quotationBigCategorys;
		$("#quotationBigCategory").bindData(quotationItem.data.quotationBigCategoryData, "id", "name");
		$("#quotationBigCategorySearch").bindData(quotationItem.data.quotationBigCategoryData, "id", "name", true);
	}, function(msg){
		return {};
	});
	
	com.post(api.quotation.queryQuotationSmallCategory, {}, 
		function(res){
			quotationItem.data.quotationSmallCategoryData = res.quotationSmallCategorys;
			$("#quotationSmallCategorySearch").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name", true);
			$("#quotationSmallCategory").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name");
		}, 
		function(msg){
			return {};
	});
	
	com.post(api.common.queryMeasurementUnit, {}, function(res){
		quotationItem.data.measurementUnitData = res.measurementUnits;
		$("#measurementUnit").bindData(quotationItem.data.measurementUnitData, "id", "name");
	}, 	function(msg){
		return {};
	});
	
	com.post(api.common.queryWorkType, {}, function(res){
		quotationItem.data.workTypeData = res.workTypes;
		$("#workType").bindData(quotationItem.data.workTypeData, "id", "name");
	}, function(msg){
		return {};
	});
	
	com.post(api.quotation.queryQuotationVersion, {}, function(res){
		quotationItem.data.VersionData = res.quotationVersions;
		quotationItem.quotationItemItems.version.bindData(quotationItem.data.VersionData, "versionId", "versionName");
		
		$("#importVersion").bindData(quotationItem.data.VersionData, "versionId", "versionName");
		$("#versionSearch").bindData(quotationItem.data.VersionData, "versionId", "versionName",true);
	}, function(msg){
		return {};
	});
}

function saveData(){
	if(com.validate() || quotationItem.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
		"quotationItem.itemName": quotationItem.quotationItemItems.itemName.val(),
		"quotationItem.quotationTypeId": quotationItem.quotationItemItems.quotationType.val(),
		"quotationItem.quotationType": "",
		"quotationItem.quotationClassificationId": quotationItem.quotationItemItems.quotationClassification.val(),
		"quotationItem.quotationClassification": "",
		"quotationItem.quotationBigCategoryId": quotationItem.quotationItemItems.quotationBigCategory.val(),
		"quotationItem.quotationBigCategory": "",
		"quotationItem.quotationSmallCategoryId": quotationItem.quotationItemItems.quotationSmallCategory.val(),
		"quotationItem.quotationSmallCategory": "",
		"quotationItem.measurementUnitId": quotationItem.quotationItemItems.measurementUnit.val(),
		"quotationItem.measurementUnit": "",
		"quotationItem.workTypeId": quotationItem.quotationItemItems.workType.val(),
		"quotationItem.workType": "",
		"quotationItem.quotationItemDes": quotationItem.quotationItemItems.quotationItemDes.val(),
		"quotationItem.unitPrice": quotationItem.quotationItemItems.unitPrice.val()

	};
	
	if(quotationItem.editFlg) {
		url = api.quotation.updateQuotationItem;
		options["quotationItem.versionId"]= quotationItem.quotationItemItems.version.val();
		options["quotationItem.version"]= "";
		options["quotationItem.autoId"] = quotationItem.quotationItemItems.autoId.val();
	}else{
		options["quotationItem.versionId"]= quotationItem.quotationItemItems.version.val();
		options["quotationItem.version"]= "";
		url = api.quotation.addQuotationItem;
	}
	com.post(url, options, successCallback, failCallback);
	quotationItem.modal.modal("hide");
}

function successCallback(){
	quotationItem.listGrid.jqGrid().trigger("reloadGrid");
	com.showAlert(com.info, "操作成功");
}

function failCallback(){
	
}

function cleanItems(){
	
}

function importItems(){
	
}

function initSelect(id, data, key, value){
	if(!key){
		key = "id";
	}
	
	if(!value){
		value = "name";
	}
	
	var select = $("#" + id);
	select.empty();
	
	for(var i=0;i<data.length;i++){
	    var option = $("<option>").text(data[i][value]).val(data[i][key]);
	    select.append(option);
	}
}