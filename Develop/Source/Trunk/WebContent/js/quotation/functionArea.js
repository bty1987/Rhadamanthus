var functionArea = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	functionAreaItems: {},
	
	oldFunctionAreaType:null,
	
	quotationVersionList: [],
	quotationVersionKey: "versionId",
	quotationVersionValue: "versionName",
	
	postParam:{},
	
	validator: {
		region: {
			type: "v_functionAreaId", 
			regex: /^D_\d{3}$/g,
			errorMsg: "请以D_作为前缀 , 之后以三个位数字组成(如D_001)."
		}
	},
	
	editFlg:false,
	repeatFunctionIdFlg:false,
};

var functionAreaItem = {
	listGrid: null,
	gridPager: null,
	btnBack: null,
	
	listInitFlag : false,
	postParam:{},
};

var quotationItem = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	quotationItemItems: {},
	data: {
		quotationTypeData:{},
		quotationClassificationData: {},
		quotationBigCategoryData: {},
		quotationSmallCategoryData: {}

	},
	listInitFlag : false,
	postParam:{},
};

jQuery(function($) {
	functionArea.modal = $("#functionAreaModal");
	functionArea.listGrid = $("#listGrid");
	functionArea.gridPager = "#gridPager";
	functionArea.saveBtn = $("#saveBtn").on('click',saveFunctionArea);
	functionArea.functionAreaItems.autoId = $("#autoId");
	functionArea.functionAreaItems.functionAreaId = $("#functionAreaId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == ""){
			return;
		}
		
		com.post(api.quotation.queryFunctionAreaByIdAVersionId, {"functionArea.functionAreaId": $this.val(), "functionArea.versionId": $("#versionId").val()}, function(res){
			if(res.functionArea&&res.functionArea.functionAreaId){
				com.showTips($this, "该版本的功能区编号已存在", true);
				functionArea.repeatFunctionIdFlg = true;
			}else{
				com.clearValidator("#functionAreaId", true);
				functionArea.repeatFunctionIdFlg = false;
			}
		});
	});
	functionArea.functionAreaItems.functionAreaName = $("#functionAreaName");
	functionArea.functionAreaItems.versionId = $("#versionId").on("change",function(){
		$this = $(this);
		
		if(functionArea.functionAreaItems.functionAreaId.val() == ""){
			return;
		}
		
		com.post(api.quotation.queryFunctionAreaByIdAVersionId, {"functionArea.functionAreaId": $("#functionAreaId").val(),"functionArea.versionId": $("#versionId").val()}, function(res){
			if(res.functionArea&&res.functionArea.functionAreaId){
				com.showTips($("#functionAreaId"), "该版本的功能区编号已存在", true);
				functionArea.repeatFunctionIdFlg = true;
			}else{
				com.clearValidator("#functionAreaId", true);
				functionArea.repeatFunctionIdFlg = false;
			}
		});
	});
	functionArea.functionAreaItems.functionAreaType = $("#functionAreaType");
	functionArea.functionAreaItems.functionAreaOrder = $("#functionAreaOrder");
	functionArea.modal.on('shown.bs.modal',function(e){
		com.clearValidator();
		
		if(functionArea.editFlg == false){
			functionArea.functionAreaItems.functionAreaType.get(0).selectedIndex = 0;
		}
	});
	
	var searchOpts = {
		url: api.quotation.pageQuotationItemByVersionId,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: functionArea.listGrid,
		items: [
		    {label:"报价版本",id:"quotationVersionSearch", name:"versionId", type:'select', op:"eq"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	com.post(api.quotation.queryQuotationVersion, {}, function(res){
		functionArea.quotationVersionList = res.quotationVersions;
		$("#quotationVersionSearch").bindData(functionArea.quotationVersionList, functionArea.quotationVersionKey, functionArea.quotationVersionValue,true);
	});
	
	$.extend(com.validator, functionArea.validator);
	
	initFunctionAreaList();
	//--------------------------------------------------
	functionAreaItem.listGrid = $("#listFunctionAreaItemGrid");
	functionAreaItem.gridPager = "#listFunctionAreaItemGridPager";
	functionAreaItem.btnBack = $("#btnBack").on("click",showFunctionAreaList);
	functionAreaItem.modal = $("#selectItemModal");
	
	functionAreaItem.modal.on('show.bs.modal', function(e){

	});
	//--------------------------------------------------
	quotationItem.listGrid = $("#itemListGrid");
	quotationItem.gridPager = "#itemGridPager";
	quotationItem.saveBtn = $("#saveSelectItemBtn").on("click", addSelectItem);
	quotationItem.cancelBtn = $("#cancelSelectItemBtn").on("click",function(e){
		functionAreaItem.modal.modal("hide");   
	});
});

function initFunctionAreaList(){
	functionArea.listGrid.jqGrid({		
		url: api.quotation.pageFunctionArea.url,
		colNames:['autoId','编号', '报价版本', '报价版本Id', '名称', '类型','排序', '操作'],
		colModel:[
		    {name:'autoId',hidden:true},
		    {name:'functionAreaId'},
		    {name:'version'},
			{name:'versionId',hidden:true},
			{name:'functionAreaName'},
			{name:'functionAreaType'},
			{name:'functionAreaOrder'},
			{name:'action',jsonmap:'autoId', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		sortable:false,
		pager : functionArea.gridPager,
		caption: "功能区列表"
	});

	functionArea.listGrid.navGrid(functionArea.gridPager, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeFunctionArea),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(functionArea.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			functionArea.editFlg = true;
			var num = functionArea.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(functionArea.listGrid.attr("id"));
				return;
			}
			var row = functionArea.listGrid.jqGrid("getRowData", num);
			
			bindVersion(row.versionId);
			
			functionArea.functionAreaItems.autoId.val(row.autoId);
			functionArea.functionAreaItems.functionAreaId.val(row.functionAreaId);
			functionArea.functionAreaItems.functionAreaName.val(row.functionAreaName);
			functionArea.functionAreaItems.functionAreaOrder.val(row.functionAreaOrder);
			functionArea.functionAreaItems.functionAreaType.val(row.functionAreaType);
			functionArea.oldFunctionAreaType = row.functionAreaType;
			functionArea.functionAreaItems.versionId.val(row.versionId);
			
			functionArea.functionAreaItems.functionAreaId.prop("disabled", true).css("display", "block");
			functionArea.functionAreaItems.versionId.prop("disabled", true);
			
			functionArea.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(functionArea.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			functionArea.editFlg = false;
			com.cleanItems(functionArea.functionAreaItems);
		
			bindVersion();		
			functionArea.functionAreaItems.functionAreaId.css("display", "none");
			functionArea.functionAreaItems.versionId.prop("disabled", false);
			functionArea.modal.modal("show");   
		},
		position: 'first'
	});
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="assignQuotationItemIndex(\''+cellvalue+'\',\''+rowdata.versionId+'\',\''+rowdata.functionAreaType+'\');">分配报价项</button>';
	result += '</div>';
	
	return result;
}

function assignQuotationItemIndex(functionAreaId, versionId, functionAreaType){
	$("#selectFunctionAreaId").val(functionAreaId);
	$("#selectVersionId").val(versionId);

	$("#functionAreaList").addClass("hide");
	$("#functionAreaQuotationItemList").removeClass("hide");
	
	quotationItem.postParam["quotationItem.versionId"] = versionId;
	
	functionAreaItem.postParam.functionAreaId = functionAreaId;
	functionAreaItem.postParam.functionAreaType = functionAreaType;
	
	functionAreaItem.postParam["functionAreaItem.functionArea.autoId"] = functionAreaId;
	functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"] = functionAreaType;
	
	initFunctionAreaItemList();
	
	$.jgrid.refreshGrid(functionAreaItem.listGrid, functionAreaItem.postParam);
}

function bindVersion(versionId){
	com.post(api.quotation.queryQuotationVersion, {}, function(res){
		functionArea.quotationVersionList = res.quotationVersions;
		
		functionArea.functionAreaItems.versionId.bindData(functionArea.quotationVersionList, functionArea.quotationVersionKey, functionArea.quotationVersionValue);
		
		if(typeof(versionId) == "undefined" || versionId == null){
			functionArea.functionAreaItems.versionId.get(0).selectedIndex = 0;
		}else{
			functionArea.functionAreaItems.versionId.val(versionId);
		}		
	});
}

function saveFunctionArea(){
	if(com.validate("functionAreaModal") || functionArea.repeatFunctionIdFlg){
		return;
	}
	
	var url;
	var options = {
		"functionArea.functionAreaId":functionArea.functionAreaItems.functionAreaId.val(),
		"functionArea.functionAreaName":functionArea.functionAreaItems.functionAreaName.val(),
		"functionArea.functionAreaOrder":functionArea.functionAreaItems.functionAreaOrder.val(),
		"functionArea.functionAreaType":functionArea.functionAreaItems.functionAreaType.val(),
		"functionArea.versionId":functionArea.functionAreaItems.versionId.val()
	};
	
	if(functionArea.editFlg) {
		url = api.quotation.updateFunctionArea;
		options["functionArea.autoId"] = functionArea.functionAreaItems.autoId.val();
		if(functionArea.oldFunctionAreaType!=functionArea.functionAreaItems.functionAreaType.val()){
			bootbox.confirm("功能区的类型修改，会清空以前包含的报价项，确认修改吗？",function(res){
				if(res){
					com.post(url, options, successFunctionAreaCallback);
					functionArea.modal.modal("hide");
				}
			});
		}else{
			com.post(url, options, successFunctionAreaCallback);
			functionArea.modal.modal("hide");
		}
	}else{
		url = api.quotation.addFunctionArea;
		com.post(url, options, successFunctionAreaCallback);
		functionArea.modal.modal("hide");
	}
}

function removeFunctionArea(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["ids["+i+"]"] = row.autoId;
	}
	
	com.post(api.quotation.deleteFunctionArea, options, successFunctionAreaCallback);
	
	$("#eData").trigger("click");
}

function successFunctionAreaCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(functionArea.listGrid, functionArea.postParam);
}

//--------------------------------------------------

function initFunctionAreaItemList(){
	if(functionAreaItem.listInitFlag == true){
		return;
	}
	
	functionAreaItem.listInitFlag = true;
	functionAreaItem.listGrid.jqGrid({		
		url: api.quotation.queryFunctionAreaItemByFunctionAreaId.url,
		postData: functionAreaItem.postParam,
		colNames:['autoId','报价项编号',  '分类', '大类', '小类', '名称','单位', '工种', '单价'],
		colModel:[
          {name:"autoId",hidden:true},
          {name:'itemId', jsonmap:'quotationItem.itemId'},
          {name:'quotationClassification', jsonmap:'quotationItem.quotationClassification'},
          {name:'quotationBigCategory', jsonmap:'quotationItem.quotationBigCategory'},
          {name:'quotationSmallCategory', jsonmap:'quotationItem.quotationSmallCategory'},
          {name:'itemName', jsonmap:'quotationItem.itemName'},
          {name:'measurementUnit', jsonmap:'quotationItem.measurementUnit'},
          {name:'itemWorkType', jsonmap:'quotationItem.itemWorkType'},
          {name:'unitPrice', jsonmap:'quotationItem.unitPrice'}       		
		], 
		rowNum: "-1",
		jsonReader: {root:"functionAreaItems"},
		pager : functionAreaItem.gridPager,
		caption: "报价项信息列表"
	});

	$("#listFunctionAreaItemGridPager_center").addClass("hide");
	$("#listFunctionAreaItemGridPager_right").addClass("hide");

	functionAreaItem.listGrid.navGrid(functionAreaItem.gridPager, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {},
		$.jgrid.deleteFunc(removeFunctionAreaItem),
	    $.jgrid.searchFunc($(this))
	).navButtonAdd(functionAreaItem.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
		
			functionAreaItem.modal.modal("show");   

			$("#itemNameSearch").val("");
			$("#quotationTypeSearch").val("");
			$("#quotationClassificationSearch").val("");
			$("#quotationBigCategorySearch").val("");
			$("#quotationSmallCategorySearch").val("");
			initQuotationItemList();
			$.jgrid.refreshGrid(quotationItem.listGrid, quotationItem.postParam);
		},
		position: 'first'
	});
}

function removeFunctionAreaItem(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["ids["+i+"]"] = row.autoId;
	}
	com.post(api.quotation.deleteFunctionAreaItemByIds, options, successFunctionAreaItemCallback);
	$("#eData").trigger("click");
}

function addSelectItem(){
	var nums = quotationItem.listGrid.jqGrid("getGridParam","selarrrow");

	var options = {};
	
	if(nums.length != 0){
		for(var i=0;i<nums.length;i++){
			
			var postParam = functionAreaItem.postParam;
			var row = quotationItem.listGrid.jqGrid('getRowData', nums[i]);
			
			
			if(row.quotationClassification == postParam.functionAreaType || (postParam.functionAreaType == '普通' && (row.quotationClassification == '基础部分' || row.quotationClassification == '其他部分'))){
				options["functionAreaItems["+i+"].functionArea.autoId"] = postParam.functionAreaId;
				options["functionAreaItems["+i+"].quotationItem.autoId"] = row.autoId;
				options["functionAreaItems["+i+"].quotationItem.quotationClassification"] = row.quotationClassification;
			}else{
				bootbox.alert("不能将("+row.itemName+")添加到该功能区中");
			}
		}
		
		console.log(options)
		
		com.post(api.quotation.addFunctionAreaItem, options, successFunctionAreaItemCallback);
	}
	
	functionAreaItem.modal.modal("hide");   
}

function successFunctionAreaItemCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(functionAreaItem.listGrid, functionAreaItem.postParam);
}

//--------------------------------------------------
function initQuotationItemList(){
	var quotationItemSearchOpts = {
		url: api.quotation.pageQuotationItemByVersionId.url,
		postParmas: {"paging.rows":10, "paging.page":1, "quotationItem.versionId":quotationItem.postParam["quotationItem.versionId"]},
		listgrid: quotationItem.listGrid,
		items: [
	        {label:"名称",id:"itemNameSearch",name:"itemName", type:'text'},
	        {label:"类型", id:"quotationTypeSearch", name:"quotationTypeId", type:"select",op:"eq"},
	        {label:"分类", id:"quotationClassificationSearch", name:"quotationClassificationId", type:"select",op:"eq"},
	        {label:"大类", id:"quotationBigCategorySearch", name:"quotationBigCategoryId", type:"select",op:"eq"},
	        {label:"小类", id:"quotationSmallCategorySearch", name:"quotationSmallCategoryId", type:"select",op:"eq"}
        ]
	};
	
	$("#itemSearchDiv").flSearch(quotationItemSearchOpts);
	
	com.post(api.quotation.queryQuotationType, {}, function(res){
		quotationItem.data.quotationTypeData = res.quotationTypes;
		$("#quotationTypeSearch").bindData(quotationItem.data.quotationTypeData, "id", "name", true);
	}, function(msg){
		return {};
	});
	
	com.post(api.quotation.queryQuotationClassification, {}, function(res){
		quotationItem.data.quotationClassificationData = res.quotationClassifications;
		$("#quotationClassificationSearch").bindData(quotationItem.data.quotationClassificationData, "id", "name", true);
	}, function(msg){
		return {};
	});
	
	com.post(api.quotation.queryQuotationBigCategory, {}, function(res){
		quotationItem.data.quotationBigCategoryData = res.quotationBigCategorys;
		$("#quotationBigCategorySearch").bindData(quotationItem.data.quotationBigCategoryData, "id", "name", true);
	}, function(msg){
		return {};
	});
	
	com.post(api.quotation.queryQuotationSmallCategory, {}, function(res){
		quotationItem.data.quotationSmallCategoryData = res.quotationSmallCategorys;
		$("#quotationSmallCategorySearch").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name", true);
	}, function(msg){
		return {};
	});
	
	if(quotationItem.listInitFlag==true){
		return;
	}
	
	quotationItem.listInitFlag = true;
	quotationItem.listGrid.jqGrid({		
		url: api.quotation.pageQuotationItemByVersionId.url,
		postData:quotationItem.postParam,
		colNames:['autoId','编号', '名称', '类型', '分类', '大类', '小类', '单位', '工种', '说明', '单价', '版本'],
		colModel:[
		    {name:'autoId',hidden: true},  
			{name:'itemId',width:80, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemName', width:180,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationType',hidden: true, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationClassification',width:50, search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationBigCategory', width:50,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationSmallCategory', width:50,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'measurementUnit', width:30,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'itemWorkType', width:30,search: true, searchoptions: {sopt: ["cn"]}},
			{name:'quotationItemDes',hidden: true},
			{name:'unitPrice',width:50},
			{name:'version',hidden: true, searchoptions: {sopt: ["cn"]}},
		], 
		autowidth:false,
		width:810,
		rowNum:15,
		rowList:[15,30,50],
		height: '450',
		pager : quotationItem.gridPager,
		caption: ""
	});

	quotationItem.listGrid.navGrid(quotationItem.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function showFunctionAreaList(){
	$("#functionAreaQuotationItemList").addClass("hide");
	$("#functionAreaList").removeClass("hide");
	$.jgrid.refreshGrid(functionArea.listGrid, functionArea.postParam);
}

function showFunctionAreaItemList(){
	$("#functionAreaList").addClass("hide");
	$("#functionAreaQuotationItemList").removeClass("hide");
	$.jgrid.refreshGrid(functionAreaItem.listGrid, functionAreaItem.postParam);
}

