
jQuery(function($) {
	
	var materialModel = {
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
				errorMsg: "价格内容输入错误."
			}, discount: {
				type: "v_discount",
				regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/g,
				errorMsg: "折扣内容输入错误."
			}, point: {
				type: "v_point",
				regex: /^(1\.0{1,2}|1|0\.[0-9]{1,3})$/g,
				errorMsg: "点位内容输入错误."
			}
		},
	};
	
	com.focusPage('#fl-statement').statement("主材型号", "主材型号信息列表");
	
	materialModel.listGrid = com.focusPage("#listGrid");
	materialModel.gridPager = "#gridPager";
	materialModel.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	materialModel.cancelBtn = com.focusPage("#cancelBtn");
	materialModel.modal = com.focusPage("#materialModelModal");
	
	materialModel.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#materialModelName", true);
		com.clearValidator("#materialModelNo", true);
	});
	
	materialModel.materialModelItems.mmId = com.focusPage("#mmId");
	materialModel.materialModelItems.materialModelNo = com.focusPage("#materialModelNo");
	
	materialModel.materialModelItems.materialModelName = com.focusPage("#materialModelName");
	materialModel.materialModelItems.materialTypeId = com.focusPage("#materialTypeId");
	materialModel.materialModelItems.materialBrandId = com.focusPage("#materialBrandId");
	materialModel.materialModelItems.measurementUnitId = com.focusPage("#measurementUnitId");
	materialModel.materialModelItems.materialUnitPrice = com.focusPage("#materialUnitPrice");
	materialModel.materialModelItems.materialPurchasePrice = com.focusPage("#materialPurchasePrice");
	materialModel.materialModelItems.discount = com.focusPage("#discount");
	materialModel.materialModelItems.calcTypeSwitch = com.focusPage("#calcTypeSwitch").switchBtn("calcType").on("change", function(){
		if(materialModel.materialModelItems.calcTypeSwitch.prop("checked")){
			materialModel.materialModelItems.pointDiv.css("display", "block");
			materialModel.materialModelItems.baseDiv.css("display", "none");
		}else{
			materialModel.materialModelItems.pointDiv.css("display", "none");
			materialModel.materialModelItems.baseDiv.css("display", "block");
		}
	});
	materialModel.materialModelItems.calcType = com.focusPage("#calcType");
	materialModel.materialModelItems.pointDiv = com.focusPage("#pointDiv");
	materialModel.materialModelItems.point = com.focusPage("#point");
	materialModel.materialModelItems.baseDiv = com.focusPage("#baseDiv");
	materialModel.materialModelItems.base = com.focusPage("#base");
	
	$.extend(com.validator, materialModel.validator);
	
	com.post(api.data.queryCategory, {}, function(res){
		materialModel.data.materialTypeData = res.categorys;
		com.focusPage("#materialTypeId").bindData(materialModel.data.materialTypeData, "cid", "name");
	});
	
	com.post(api.common.queryMeasurementUnit, {}, function(res){
		materialModel.data.measurementUnitData = res.measurementUnits;
		com.focusPage("#measurementUnitId").bindData(materialModel.data.measurementUnitData, "id", "name");
	});
	
	materialModel.materialModelItems.materialTypeId.change(function(){
		var _materialTypeId = materialModel.materialModelItems.materialTypeId.val();
		com.post(api.data.queryBrandByCid, {"brand.cid": _materialTypeId, }, function(res){
			materialModel.data.materialBrandData[_materialTypeId] = res.brands;
			com.focusPage("#materialBrandId").bindData(materialModel.data.materialBrandData[_materialTypeId+""], "bid", "name");
		});
	});
	
    function buildMaterialBalanceValueLineprops() {

        return [{
            field: "materialModelNo",
            name: "型号",
            prop: "materialModelNo",
            clazz: "grey"
        }, {
            field: "materialTypeName",
            name: "品类",
            prop: "materialTypeName",
            clazz: "grey"
        }, {
            field: "materialBrandName",
            name: "品牌",
            prop: "materialBrandName",
            clazz: "grey"
        }, {
            field: "measurementUnitName",
            name: "单位",
            prop: "measurementUnitName",
            clazz: "grey"
        }, {
            field: "materialPurchasePrice",
            name: "进价",
            prop: "materialPurchasePrice",
            clazz: "blue"
        }, {
            field: "materialUnitPrice",
            name: "标价",
            prop: "materialUnitPrice",
            clazz: "blue"
        }, {
            field: "discount",
            name: "折扣",
            prop: "discount",
            clazz: "blue"
        }, {
            field: "calcType",
            name: "计算方式",
            prop: function(v) { return "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : ""; },
            clazz: function(v) { return "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""; }
        }, {
            field: "calcValue",
            name: "计算值",
            prop: function(v) { return "1" == v.calcType ? v.point : "0" == v.calcType ? v.base : ""; },
            clazz: "blue"
        }];
    }

    function buildMaterialBalanceValueLinebtns() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-primary",
                handle: function(v) {
                    editBalanceValue(v);
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.material.pageMaterialModel, null, ['data-model-name', 'material-category-name', 'material-brand-name'], "materialBalanceValuePostData", null, false, null);
    searcher.line("materialModelName", buildMaterialBalanceValueLineprops(), buildMaterialBalanceValueLinebtns()).render();
    
    function editBalanceValue(v){
    	
    	editFlg = true;
		
		materialModel.materialModelItems.mmId.val(v.mmId);
		materialModel.materialModelItems.materialModelNo.val(v.materialModelNo).attr("disabled", true);
		materialModel.materialModelItems.materialModelName.val(v.materialModelName);
		materialModel.materialModelItems.materialTypeId.val(v.materialTypeId);
		
		com.post(api.data.queryBrandByCid, {"brand.cid": v.materialTypeId},
			function(res){
				materialModel.data.materialBrandData[v.materialTypeId] = res.brands;
				com.focusPage("#materialBrandId").bindData(materialModel.data.materialBrandData[v.materialTypeId+""], "bid", "name");
				
				materialModel.materialModelItems.materialBrandId.val(v.materialBrandId);
			}, 
			function(msg){
				return {};
		});
		
		materialModel.materialModelItems.measurementUnitId.val(v.measurementUnitId);
		materialModel.materialModelItems.materialUnitPrice.val(v.materialUnitPrice);
		materialModel.materialModelItems.materialPurchasePrice.val(v.materialPurchasePrice);
		materialModel.materialModelItems.discount.val(v.discount);
		materialModel.materialModelItems.base.val(v.base);
		materialModel.materialModelItems.point.val(v.point);
		
		if(v.calcType == 1){
			materialModel.materialModelItems.calcTypeSwitch.prop('checked', true);
			materialModel.materialModelItems.pointDiv.css("display", "block");
			materialModel.materialModelItems.baseDiv.css("display", "none");
		}else if(v.calcType == 0){
			materialModel.materialModelItems.calcTypeSwitch.prop('checked', false);
			materialModel.materialModelItems.pointDiv.css("display", "none");
			materialModel.materialModelItems.baseDiv.css("display", "block");
		}
		
		materialModel.modal.modal("show");
    }
    
    function saveData(){
        
    	if(com.validate("materialModelModal")) return false;
    	
    	var url;
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
    	
    	if(editFlg){
    		url = api.material.updateMaterialModel;
    	}else{
    		url = api.material.addMaterialModel;
    	}
    	
    	com.post(url, options, function(res){
    		searcher.doSearch();
    	});
    	
    	materialModel.modal.modal("hide");
    }
	
});

