var systemDefineItem = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,

	modal: null,
	systemDefineItemItems: {},
	
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
	
	validator: {
		region: {
			type: "v_itemId", 
			regex: /^SI_\d{5}$/g,
			errorMsg: "请以SI_作为前缀 , 之后以五个位数字组成(如SI_00001)."
		}
	},
	editFlag: false,
	repeatFlg:false
	
};

jQuery(function($) {
	
	systemDefineItem.listGrid = $("#systemDefineItemListGrid");
	systemDefineItem.gridPager = "#systemDefineItemGridPager";
	systemDefineItem.saveBtn = $("#saveAddItemBtn").on("click", saveData);
	systemDefineItem.cancelBtn = $("#cancelBtn");
	systemDefineItem.modal = $("#addItemModal");

	systemDefineItem.systemDefineItemItems.autoId = $("#autoId");
	systemDefineItem.systemDefineItemItems.quotationBigCategory = $("#quotationBigCategory");
	systemDefineItem.systemDefineItemItems.itemName = $("#itemName");
	systemDefineItem.systemDefineItemItems.measurementUnit = $("#measurementUnit");
	systemDefineItem.systemDefineItemItems.itemWorkType = $("#itemWorkType");
	systemDefineItem.systemDefineItemItems.quotationItemDes = $("#quotationItemDes");
	systemDefineItem.systemDefineItemItems.unitPrice = $("#unitPrice");
	systemDefineItem.systemDefineItemItems.itemId = $("#itemId").on("blur", function(){
		$this = $(this);
		if($this.val() == ""){
			return;
		}
		
		var options = {
			"systemDefineItem.itemId": $this.val(),
		}
		
		com.post(api.quotation.querySystemDefineItemByItemId, options, function(res){
			if(res.systemDefineItem && res.systemDefineItem.itemId){
				com.showTips($this, "该版本的编号已存在", true);
				systemDefineItem.repeatFlg = true;
			}else{
				com.clearValidator("#itemId", true);
				systemDefineItem.repeatFlg = false;
			}
		});
	});
	
	systemDefineItem.modal.on('shown.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#itemId", true);
		
		if(systemDefineItem.editFlg == false){
			systemDefineItem.systemDefineItemItems.quotationBigCategory.get(0).selectedIndex = 0;
			systemDefineItem.systemDefineItemItems.itemWorkType.get(0).selectedIndex = 0;
			systemDefineItem.systemDefineItemItems.measurementUnit.get(0).selectedIndex = 0;
		}
	
	});
	$.extend(com.validator, systemDefineItem.validator);

	initDataMap();
	
	var systemDefineItemSearchOpts = {
		url: api.quotation.pageSystemDefineItem,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: systemDefineItem.listGrid,
		items: [
	        {label:"名称",id:"itemNameSearch1",name:"itemName", type:'text'},
	        {label:"大类", id:"quotationBigCategorySearch1", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"工种", id:"quotationWorkTypeSearch1", name:"quotationWorkTypeId", type:"select",op:"eq"}
		]
	};
		
	$("#systemDefineItemSearchDiv").flSearch(systemDefineItemSearchOpts);
	$("#quotationBigCategorySearch1").bindData(systemDefineItem.quotationBigCategorys, "id", "name", true);
	$("#quotationWorkTypeSearch1").bindData(systemDefineItem.workTypes, "id", "name", true);
	
	systemDefineItem.listGrid.jqGrid({		
		url: api.quotation.pageSystemDefineItem.url,
		colNames:['autoId','编号', '名称',  '大类', '单位', '工种', '说明', '单价', 'itemWorkTypeId', 'measurementUnitId', 'quotationBigCategoryId'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId', search: true},
			{name:'itemName', search: true},
			{name:'quotationBigCategory', search: true},
			{name:'measurementUnit', search: true},
			{name:'itemWorkType', search: true},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice'},
			{name:'itemWorkTypeId',hidden: true},
			{name:'measurementUnitId',hidden: true},
			{name:'quotationBigCategoryId', hidden: true}
		],  
		pager : systemDefineItem.gridPager,
		caption: "系统定义项列表"
	});

	systemDefineItem.listGrid.navGrid(systemDefineItem.gridPager, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {},
		$.jgrid.deleteFunc(removeSystemDefineItems),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(systemDefineItem.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			systemDefineItem.editFlg = true;
			var num = systemDefineItem.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(systemDefineItem.listGrid.attr("id"));
				return;
			}
			
			var row = systemDefineItem.listGrid.jqGrid("getRowData", num);
			systemDefineItem.systemDefineItemItems.autoId.val(row.autoId);
			systemDefineItem.systemDefineItemItems.itemId.val(row.itemId);
			systemDefineItem.systemDefineItemItems.itemName.val(row.itemName);
			systemDefineItem.systemDefineItemItems.quotationBigCategory.val(row.quotationBigCategoryId); 
			systemDefineItem.systemDefineItemItems.itemWorkType.val(row.itemWorkTypeId); 
			systemDefineItem.systemDefineItemItems.measurementUnit.val(row.measurementUnitId); 
			
			systemDefineItem.systemDefineItemItems.quotationItemDes.val(row.quotationItemDes);
			systemDefineItem.systemDefineItemItems.unitPrice.val(row.unitPrice);	
			systemDefineItem.systemDefineItemItems.itemId.prop("disabled", true);

			systemDefineItem.modal.modal("show");
		},
		position: "first"
	}).navButtonAdd(systemDefineItem.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			systemDefineItem.editFlg = false;
			systemDefineItem.systemDefineItemItems.itemId.prop("disabled", false);
			com.cleanItems(systemDefineItem.systemDefineItemItems);
			systemDefineItem.modal.modal("show");
		},
		position: "first"
	});
});

function initDataMap(){
	
	com.post(api.common.queryMeasurementUnit, {}, function(res){

		systemDefineItem.measurementUnits = res.measurementUnits;
		systemDefineItem.measurementUnitsStr = "";
		
		for(var tem=0;tem<res.measurementUnits.length;++tem){
			systemDefineItem.measurementUnitsStr+=(res.measurementUnits[tem].id+":"+res.measurementUnits[tem].name+";");
		}
		
		systemDefineItem.measurementUnitsStr = systemDefineItem.measurementUnitsStr.substr(0,systemDefineItem.measurementUnitsStr.length-1);
		$("#measurementUnit").bindData(systemDefineItem.measurementUnits, "id", "name");
		
	}, null, false);
	
	com.post(api.quotation.queryQuotationBigCategory,{},function(res){
	
		systemDefineItem.quotationBigCategorys = res.quotationBigCategorys;
		systemDefineItem.quotationBigCategorysStr = "";
		
		for(var tem=0;tem<res.quotationBigCategorys.length;++tem){
			systemDefineItem.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
		}
		systemDefineItem.quotationBigCategorysStr = systemDefineItem.quotationBigCategorysStr.substr(0,systemDefineItem.quotationBigCategorysStr.length-1);
		
		
		$("#quotationBigCategory").bindData(systemDefineItem.quotationBigCategorys, "id", "name");
		
	}, null, false);
	
	com.post(api.common.queryWorkType, {}, function(res){

		systemDefineItem.workTypes = res.workTypes;
		systemDefineItem.workTypesStr = "";
		
		for(var tem=0;tem<res.workTypes.length;++tem){
			systemDefineItem.workTypesStr += (res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
		}
		systemDefineItem.workTypesStr = systemDefineItem.workTypesStr.substr(0,systemDefineItem.workTypesStr.length-1);
		
		$("#itemWorkType").bindData(systemDefineItem.workTypes, "id", "name");
	
	}, null, false);
}

function saveData(){
	if(com.validate()|| systemDefineItem.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"systemDefineItem.itemId":systemDefineItem.systemDefineItemItems.itemId.val(),
		"systemDefineItem.itemName": systemDefineItem.systemDefineItemItems.itemName.val(),
		"systemDefineItem.quotationBigCategoryId": systemDefineItem.systemDefineItemItems.quotationBigCategory.val(),
		"systemDefineItem.quotationBigCategory": "",
		"systemDefineItem.measurementUnitId": systemDefineItem.systemDefineItemItems.measurementUnit.val(),
		"systemDefineItem.measurementUnit": "",
		"systemDefineItem.itemWorkTypeId": systemDefineItem.systemDefineItemItems.itemWorkType.val(),
		"systemDefineItem.itemWorkType": "",
		"systemDefineItem.quotationItemDes": systemDefineItem.systemDefineItemItems.quotationItemDes.val(),
		"systemDefineItem.unitPrice": systemDefineItem.systemDefineItemItems.unitPrice.val()
	};
	
	if(systemDefineItem.editFlg) {
		url = api.quotation.updateSystemDefineItem;
		options["systemDefineItem.autoId"] = systemDefineItem.systemDefineItemItems.autoId.val();
	}else{
		url = api.quotation.addSystemDefineItem;
	}
	
	com.post(url, options, successCallback);
	
	systemDefineItem.modal.modal("hide");
}

function removeSystemDefineItems(params, rowNums){
	
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["ids["+i+"]"] = row.autoId;
	}
	
	com.post(api.quotation.deleteSystemDefineItemByIds, options, function(res){
		$("#fl_btn_systemDefineItemSearchDiv").trigger("click");
		com.showAlert(com.info, "操作成功");
	});
	
	$("#eData").trigger("click");	
}

function successCallback(){
	systemDefineItem.listGrid.jqGrid().trigger("reloadGrid");
}