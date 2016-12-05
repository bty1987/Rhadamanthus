
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
	materialModel.materialModelItems.materialModelNo = $("#materialModelNo");
	
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
	
	com.post(api.data.queryCategory, {}, function(res){
		materialModel.data.materialTypeData = res.categorys;
		$("#materialTypeId").bindData(materialModel.data.materialTypeData, "cid", "categoryName");
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
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.materialModelName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

            var propertyArr = [
                ["型号:", v.materialModelNo, "grey"],
                ["品类:", v.materialTypeName, "grey"],
                ["品牌:", v.materialBrandName, "grey"],
                ["单位:", v.measurementUnitName, "grey"],
                ["进价:", v.materialPurchasePrice, "blue"],
                ["标价:", v.materialUnitPrice, "blue"],
                ["折扣:", v.discount, "blue"],
                ["计算方式:", "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : "", "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""],
                ["计算值:", "1" == v.calcType ? v.point: "0" == v.calcType ? v.base : "", "blue"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
            	editBalanceValue(v);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var seacher = new Searcher();

    seacher.init(['materialModelName', 'categoryId', 'brandName'], "condList", api.material.pageMaterialModel, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "materialBalanceValuePostData");
    
    function editBalanceValue(v){
    	
    	editFlg = true;
		
		materialModel.materialModelItems.mmId.val(v.mmId);
		materialModel.materialModelItems.materialModelNo.val(v.materialModelNo).attr("disabled", true);
		materialModel.materialModelItems.materialModelName.val(v.materialModelName);
		materialModel.materialModelItems.materialTypeId.val(v.materialTypeId);
		
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": v.materialTypeId}, 
			function(res){
				materialModel.data.materialBrandData[v.materialTypeId] = res.brands;
				$("#materialBrandId").bindData(materialModel.data.materialBrandData[v.materialTypeId+""], "bid", "brandName");
				
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
    	if(com.validate()) return;
    	
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
    		seacher.doSearch();
    	});
    	
    	materialModel.modal.modal("hide");
    }
	
});

