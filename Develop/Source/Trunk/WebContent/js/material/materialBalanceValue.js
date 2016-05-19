var materialModel = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	materialModelItems:{},
	data:{
		materialTypeData: {},
		materialBrandData: {},
		measurementUnitData: {},
	},
	
	editFlg: false,
	repeatFlg: false,
	
	validator: {
		materialBrandName: {
			type: "v_materialBrandName",
			regex:/^.{2,64}$/g,
			errorMsg: "主材型号名称格式错误."
		}, price: {
			type: "v_price",
			regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
			errorMsg: "价格内容输入错误错误."
		}, discount: {
			type: "v_discount",
			regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/g,
			errorMsg: "折扣内容输入错误错误."
		}, point: {
			type: "v_point",
			regex: /^(1\.0{1,2}|1|0\.[0-9]{1,3})$/g,
			errorMsg: "点位内容输入错误错误."
		}
	},
};

jQuery(function($) {
	$('#fl-statement').statement("主材型号", "主材型号信息列表");
	
	materialModel.listGrid = $("#listGrid");
	materialModel.gridPager = "#gridPager";
	materialModel.saveBtn = $("#saveBtn").on("click", saveData);
	materialModel.cancelBtn = $("#cancelBtn");
	materialModel.modal = $("#materialModelModal");
	
	materialModel.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#materialModelName", true);
		com.clearValidator("#materialModelNo", true);
	});
	
	materialModel.materialModelItems.mmId = $("#mmId");
	materialModel.materialModelItems.materialModelNo = $("#materialModelNo").on("blur", function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.material.queryMaterialModelByNo, {"materialModel.materialModelNo":$this.val()}, function(res){
			if(res.materialModel.mmId != 0){
				com.showTips($this, "该型号编号已存在", true);
				materialModel.repeatFlg = true;
			}else{
				com.clearValidator("#materialModelNo", true);
				materialModel.repeatFlg = false;
			}
		});
	});
	
	materialModel.materialModelItems.materialModelName = $("#materialModelName");
	materialModel.materialModelItems.materialTypeId = $("#materialTypeId");
	materialModel.materialModelItems.materialBrandId = $("#materialBrandId");
	materialModel.materialModelItems.measurementUnitId = $("#measurementUnitId");
	materialModel.materialModelItems.materialUnitPrice = $("#materialUnitPrice");
	materialModel.materialModelItems.materialPurchasePrice = $("#materialPurchasePrice");
	materialModel.materialModelItems.discount = $("#discount");
	materialModel.materialModelItems.calcTypeSwitch = $("#calcTypeSwitch").switchBtn("calcType").on("change", function(){
		if(materialModel.materialModelItems.calcTypeSwitch.prop("checked")){
			materialModel.materialModelItems.pointDiv.css("display", "block");
			materialModel.materialModelItems.baseDiv.css("display", "none");
		}else{
			materialModel.materialModelItems.pointDiv.css("display", "none");
			materialModel.materialModelItems.baseDiv.css("display", "block");
		}
	});
	materialModel.materialModelItems.calcType = $("#calcType");
	materialModel.materialModelItems.pointDiv = $("#pointDiv");
	materialModel.materialModelItems.point = $("#point");
	materialModel.materialModelItems.baseDiv = $("#baseDiv");
	materialModel.materialModelItems.base = $("#base");
	
	$.extend(com.validator, materialModel.validator);
	
	var searchOpts = {
		url: api.material.pageMaterialModel,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialModel.listGrid,
		items: [
		    {label:"编号", id:"materialModelNoSearch", name:"materialModelNo", type:"text"},
	        {label:"名称", id:"materialModelNameSearch", name:"materialModelName", type:"text"},
	        {label:"品类", id:"materialTypeSearch", name:"materialTypeId", type:"select"},
	        {label:"品牌", id:"materialBrandSearch", name:"materialBrandId", type:"select"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#materialTypeSearch").change(function(){
		var _materialTypeId = $("#materialTypeSearch").val();
		
		if(_materialTypeId == ""){
			$("#materialBrandSearch").bindData([], "bid", "brandName", true);
		}else{
			com.post(api.data.queryBrandByCategoryId, {"brand.cid": _materialTypeId, }, function(res){
				$("#materialBrandSearch").bindData(res.brands, "bid", "brandName", true);
			});
		}
	});
	
	com.post(api.data.queryCategory, {}, function(res){
		materialModel.data.materialTypeData = res.categorys;
		$("#materialTypeId").bindData(materialModel.data.materialTypeData, "cid", "categoryName");
		$("#materialTypeSearch").bindData(materialModel.data.materialTypeData, "cid", "categoryName", true);
	});
	
	com.post(api.common.queryMeasurementUnit, {}, function(res){
		materialModel.data.measurementUnitData = res.measurementUnits;
		$("#measurementUnitId").bindData(materialModel.data.measurementUnitData, "id", "name");
	});
	
	materialModel.materialModelItems.materialTypeId.change(function(){
		var _materialTypeId = materialModel.materialModelItems.materialTypeId.val();
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": _materialTypeId, }, function(res){
			materialModel.data.materialBrandData[_materialTypeId] = res.brands;
			$("#materialBrandId").bindData(materialModel.data.materialBrandData[_materialTypeId+""], "bid", "brandName");
		});
	});
	
	materialModel.listGrid.jqGrid({
		url: api.material.pageMaterialModel.url,
		postData: materialModel.postParam,
		colNames:['ID', '编号', '名称', '品类ID', '品类', '品牌ID', '品牌', '单位ID', '单位', '进价', '标价', '折扣', '计算方式', '计算值', '点位', '底价'],
		colModel:[
		    {name:'mmId', hidden:true},
		    {name:'materialModelNo'},
			{name:'materialModelName', width:360},
			{name:'materialTypeId', hidden:true},
			{name:'materialTypeName'},
			{name:'materialBrandId', hidden:true},
			{name:'materialBrandName'},
			{name:'measurementUnitId', hidden:true},
			{name:'measurementUnitName'},
			{name:'materialPurchasePrice'},
			{name:'materialUnitPrice'},
			{name:'discount'},
			{name:'calcType', formatter: calcTypeInit},
			{name:'value', formatter: valueInit},
			{name:'base', hidden:true},
			{name:'point', hidden:true},
		],
		pager : materialModel.gridPager,
		caption: "主材品类"
	});

	materialModel.listGrid.navGrid(materialModel.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialModel.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			var num = materialModel.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num==null){
				$.jgrid.viewModal("#alertmod_listGrid",{gbox:"#gbox_"+materialModel.listGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			var row = materialModel.listGrid.jqGrid("getRowData", num);
			
			materialModel.materialModelItems.mmId.val(row.mmId);
			materialModel.materialModelItems.materialModelNo.val(row.materialModelNo).attr("disabled", true);
			materialModel.materialModelItems.materialModelName.val(row.materialModelName);
			materialModel.materialModelItems.materialTypeId.val(row.materialTypeId);
			
			com.post(api.data.queryBrandByCategoryId, {"brand.cid": row.materialTypeId}, 
				function(res){
					materialModel.data.materialBrandData[row.materialTypeId] = res.brands;
					$("#materialBrandId").bindData(materialModel.data.materialBrandData[row.materialTypeId+""], "bid", "brandName");
					
					materialModel.materialModelItems.materialBrandId.val(row.materialBrandId);
				}, 
				function(msg){
					return {};
			});
			
			materialModel.materialModelItems.measurementUnitId.val(row.measurementUnitId);
			materialModel.materialModelItems.materialUnitPrice.val(row.materialUnitPrice);
			materialModel.materialModelItems.materialPurchasePrice.val(row.materialPurchasePrice);
			materialModel.materialModelItems.discount.val(row.discount);
			materialModel.materialModelItems.base.val(row.base);
			materialModel.materialModelItems.point.val(row.point);
			
			if(row.calcType.indexOf("点位") != -1){
				materialModel.materialModelItems.calcTypeSwitch.prop('checked', true);
				materialModel.materialModelItems.pointDiv.css("display", "block");
				materialModel.materialModelItems.baseDiv.css("display", "none");
			}else if(row.calcType.indexOf("底价") != -1){
				materialModel.materialModelItems.calcTypeSwitch.prop('checked', false);
				materialModel.materialModelItems.pointDiv.css("display", "none");
				materialModel.materialModelItems.baseDiv.css("display", "block");
			}
			
			materialModel.modal.modal("show");
		},
		position: 'first'
	});
	
});

function saveData(){
	if(com.validate()  || materialModel.repeatFlg)
		return;
	
	var options = {
		'materialModel.mmId': materialModel.materialModelItems.mmId.val(),
		'materialModel.materialModelNo': materialModel.materialModelItems.materialModelNo.val(),
		'materialModel.materialModelName': materialModel.materialModelItems.materialModelName.val(),
		'materialModel.materialBrandId': materialModel.materialModelItems.materialBrandId.val(),
		'materialModel.materialBrandName': materialModel.materialModelItems.materialBrandId.find("option:selected").text(),
		'materialModel.materialTypeName': materialModel.materialModelItems.materialTypeId.find("option:selected").text(),
		'materialModel.measurementUnitId': materialModel.materialModelItems.measurementUnitId.val(),
		'materialModel.measurementUnitName': materialModel.materialModelItems.measurementUnitId.find("option:selected").text(),
		'materialModel.materialUnitPrice': materialModel.materialModelItems.materialUnitPrice.val(),
		'materialModel.materialPurchasePrice': materialModel.materialModelItems.materialPurchasePrice.val(),
		'materialModel.discount': materialModel.materialModelItems.discount.val(),
		'materialModel.calcType': materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? 1 : 0,
		'materialModel.point': materialModel.materialModelItems.point.val() == "" ? 0 : materialModel.materialModelItems.point.val(),
		'materialModel.base': materialModel.materialModelItems.base.val() == "" ? 0 : materialModel.materialModelItems.base.val(),
	};
	var url;
	if(editFlg){
		url = api.material.updateMaterialModel;
	}else{
		url = api.material.addMaterialModel;
	}
	com.post(url, options, function(res){
		if(res.errorCode == 1){
			com.showTips(materialModel.materialModelItems.materialModelName, "当前创建型号已经存在!", true);
		}else{
			materialModel.modal.modal("hide");
			$.jgrid.refreshGrid(materialModel.listGrid, materialModel.postParam);
		}
	}, function(res){
		com.showTips(materialModel.materialModelItems.materialModelName, res, true);
	});
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["ids["+i+"]"] = row.mmId;
	}
	com.post(api.material.deleteMaterialModelByIds, options, successCallback);
	$("#eData").trigger("click");
}

function successCallback(){
	$.jgrid.refreshGrid(materialModel.listGrid, materialModel.postParam);
}

function mapData(data, key, value){
	if(!key) key = "id";
	if(!value) value = "name";
	_data = {};
	
	for(var i=0;i<data.length;i++){
		_data[data[i][key]] = data[i][value];
	}
	return _data;
}

function calcTypeInit(cellvalue, options, rowdata){
	
	var result = "";
	
	if(cellvalue == "1"){
		 result = '<span class="label label-success arrowed">点位</span>';
	}else if(cellvalue == "0"){
		result = '<span class="label label-danger arrowed">底价</span>';
	}
	
	return result;
}

function valueInit(cellvalue, options, rowdata){
	
	var result = "";
	var calcType = rowdata.calcType;
	
	if(calcType == "1"){
		result = rowdata.point;
	}else if(calcType == "0"){
		result = rowdata.base;
	}
	
	return result;
}
