var materialSubOrderAdd = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderAddItems: {},
	
	materialSubOrderAddTypeData: [{"id": "1", "name":"普通"}, {"id": "2", "name":"员工自购"}, {"id":"3", "name":"老总关系"}, {"id":"4", "name":"赠送"}],
	
	mmIdLimit: 2,
	
	record: {},
	
	columnNames:["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName", "materialUnitPrice", "materialPurchasePrice", "discount", "salePrice", "postDiscount", "price", "calcType", "point", "base", "num", "total", "packageName"],
	disabledColumnNames: ["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName", "materialUnitPrice", "materialPurchasePrice", "discount", "total"],
	
	editFlag: false,
};

var materialSubOrderAddOrderData = [ 
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
];

var materialSubOrderAddPostData = {};

var _lastRowId;
var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("销售订单", "订单信息列表");
	
	materialSubOrderAdd.listGrid = $("#listGrid");
	materialSubOrderAdd.gridPager = "#gridPager";
	materialSubOrderAdd.saveBtn = $("#saveBtn");
	materialSubOrderAdd.cancelBtn = $("#cancelBtn");
	materialSubOrderAdd.materialSubOrderAddModal = $("#materialSubOrderAddModal");
	
	materialSubOrderAddPostData["materialSubOrder.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderAddPostData["materialSubOrder.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
	
	com.post(api.material.queryMaterialSubOrderByMsoId, materialSubOrderAddPostData, function(res){
		
		materialSubOrderAddPostData = res;
		
		materialSubOrderAdd.materialSubOrderAddItems.msoNo = $("#msoNo").val(materialSubOrderAddPostData.materialSubOrder.msoNo);
		materialSubOrderAdd.materialSubOrderAddItems.designerName = $("#designerName").val(materialSubOrderAddPostData.materialSubOrder.designerName);
		materialSubOrderAdd.materialSubOrderAddItems.customerName = $("#customerName").val(materialSubOrderAddPostData.materialSubOrder.customerName);
		materialSubOrderAdd.materialSubOrderAddItems.salesmanName = $("#salesmanName").val(materialSubOrderAddPostData.materialSubOrder.salesmanName);
		materialSubOrderAdd.materialSubOrderAddItems.instoreId = $("#materialerName").val(materialSubOrderAddPostData.materialSubOrder.materialerName);
		materialSubOrderAdd.materialSubOrderAddItems.instoreId = $("#instoreName").val(materialSubOrderAddPostData.materialSubOrder.instoreName);
		materialSubOrderAdd.materialSubOrderAddItems.orderAddr = $("#orderAddr").val(materialSubOrderAddPostData.materialSubOrder.orderAddr);
		materialSubOrderAdd.materialSubOrderAddItems.msoType = $("#msoType").val(materialSubOrderAddPostData.materialSubOrder.msoType);
		materialSubOrderAdd.materialSubOrderAddItems.des = $("#des").val(materialSubOrderAddPostData.materialSubOrder.des);
		
		materialSubOrderAdd.materialSubOrderAddItems.materialOrderBrand = $("#materialOrderBrand").text(materialSubOrderPostData["materialSubOrder.materialBrand"]);
		
		materialSubOrderAdd.materialSubOrderAddItems.originalTotal = $("#originalTotalSpan").text(materialSubOrderAddPostData.materialSubOrder.total);
		materialSubOrderAdd.materialSubOrderAddItems.total = $("#totalSpan").text(materialSubOrderAddPostData.materialSubOrder.total);
	});
	
	materialSubOrderAdd.listGrid.jqGrid({		
		data: materialSubOrderAddOrderData, 
		datatype: "local",
		rowNum: 15,
		multiselect : false,
		multiboxonly: false,
		forceFit: false,
		colNames:['编号', '名称', '品类', '品牌', '单位', '单价', '标价', '折扣', '折扣价', '折让', '售价', '计算方式', '底价', '点位', '数量', '总价', '套餐', '备注', '',],
		colModel:[
		    {name:'materialModelName', editable:true, width:300},
		    {name:'materialModelNo', editable:true, hidden:true},
		    {name:'materialTypeName', editable:true},
			{name:'materialBrandName', editable:true},
			{name:'measurementUnitName', editable:true},
			{name:'materialUnitPrice', editable:true},
			{name:'materialPurchasePrice', editable:true, hidden:true},
			{name:'discount', editable:true},
			{name:'salePrice', editable:true},
			{name:'postDiscount', editable:true},
			{name:'price', editable:true},
			{name:'calcType', editable:true, hidden:true},
			{name:'base', editable:true, hidden:true},
			{name:'point', editable:true, hidden:true},
			{name:'num', editable:true},
			{name:'total', editable:true},
			{name:'packageName', editable:true},
			{name:'des', editable:true},
			{name:'action', formatter:function(cellvalue, options, rowObject){
					var result = "";
					var _rowId = options.rowId;
					result += '<div id="jSaveButton_' + _rowId + '" class="ui-pg-div ui-inline-save" onclick="saveRowData(' + _rowId + ');" style="float: left;" title="提交"><span class="ui-icon ui-icon-disk"></span></div>';
					result += '<div id="jCancelButton_' + _rowId + '" class="ui-pg-div ui-inline-cancel" onclick="cancleRowData(materialSubOrderAdd.listGrid, ' + _rowId + ');" style="float: left; margin-left: 5px;" title="取消"><span class="ui-icon ui-icon-cancel"></span></div>';
					return result;
				}
			}
		],
		onSelectRow: function(id){
			console.log("onSelectRow");
			if(id && id !== _lastRowId){
				
				if(materialSubOrderAdd.record[_lastRowId]){
					
					if(!checkRowValue(_lastRowId)){
						return false;
					};
					
					materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId);
				}else{
					clearnRowData(_lastRowId);
					materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId);
				}
				
				cyclTotal();
				
				materialSubOrderAdd.listGrid.jqGrid('editRow', id);
				_lastRowId = id;
				
				if(materialSubOrderAdd.record[id]){
					for(var i=0;i<materialSubOrderAdd.disabledColumnNames.length;i++){
						var _id = "#" + id + "_" + materialSubOrderAdd.disabledColumnNames[i];
						$(_id).attr("disabled", "disabled");
					}
				}
				
				if(materialSubOrderAdd.record[id]){
					columnActionInit(id, {}, false);
				}
				
				var rowNumLimit = materialSubOrderAdd.listGrid.getGridParam("reccount")/2;
				var limitFlag = false;
				
				if(id > rowNumLimit){
					limitFlag = true;
				}
				
				$("#"+id+"_materialModelName").typeahead({
					url: api.material.queryMaterialModelForAllByName.url,
					reverseFlag: limitFlag,
				    source: function (query, process) {
				        var options = {"materialModel.materialModelName": query};
				        if(typeof this.options.url !== "string")
				        	com.showAlert(com.error, "the autoFillText has no any url.");
				        com.post(api.material.queryMaterialModelForAllByName, options, function(data){
				        	var materialModels = data.materialModels;
				        	autoFillList = [];
			        		autoFillNameList = [];
			        		for(var i=0;i<materialModels.length;i++){
			        			autoFillList[i] = materialModels[i].materialModelName;
			        			autoFillNameList[i] = materialModels[i].mmId;
			        		}
				        	process(autoFillList);
				        });
				    },
				    matcher: function (item) {
				        return true;
				    }
				}).attr("autocomplete", "off").on("change", function(){
					fillData(id, $(this).val());
				});
				
				$("#"+id+"_materialModelNo").typeahead({
					url: api.material.queryMaterialModelForAllByNo.url,
					reverseFlag: limitFlag,
				    source: function (query, process) {
				        var options = {"materialModel.materialModelNo": query};
				        if(typeof this.options.url !== "string")
				        	com.showAlert(com.error, "the autoFillText has no any url.");
				        com.post(api.material.queryMaterialModelForAllByNo, options, function(data){
				        	var materialModels = data.materialModels;
			        		autoFillList = [];
			        		autoFillNameList = [];
			        		for(var i=0;i<materialModels.length;i++){
			        			autoFillList[i] = materialModels[i].materialModelNo;
			        			autoFillNameList[i] = materialModels[i].mmId;
			        		}
			        		
				        	process(autoFillList);
				        });
				    },
				    matcher: function (item) {
				        return true;
				    }
				}).attr("autocomplete", "off").on("change", function(){
					fillData(id, $(this).val());
				});
			}
		},
		gridComplete: function () {
			console.log("gridComplete");
	        $(this).setGridParam().hideCol("cb");
	        _lastRowId = -1;
	    },
		pager:materialSubOrderAdd.gridPager,
	});
	
	materialSubOrderAdd.listGrid.navGrid(materialSubOrderAdd.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialSubOrderAdd.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		onClickButton: function(){
			materialSubOrderAdd.listGrid.jqGrid('addRowData', materialSubOrderAdd.listGrid.getGridParam("reccount")+1, {}); 
		},
		position: "first",
	});
	
	$('#addSubOrderItem').click(function(){
		
		if(materialSubOrderAdd.record[_lastRowId]){
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId); 
		}else{
			clearnRowData(_lastRowId);
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId); 
		}
		
		cyclTotal();
		
		materialSubOrderAdd.listGrid.jqGrid('addRowData', materialSubOrderAdd.listGrid.getGridParam("reccount")+1, {});
	});
	
	$('#submitSubOrderItem').click(function(){
		
		com.clearValidator("#salesmanName", true);
		
		var options = {};
		
		var materialBrandStr = "";
		var materialBrandFlag = true;
		var salesmanNameFlag = false;
		
		if(com.validate() || salesmanNameFlag)
			return;
		
		if(materialSubOrderAdd.record[_lastRowId]){
			
			if(!checkRowValue(_lastRowId)){
				return false;
			};
			
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId);
		}else{
			clearnRowData(_lastRowId);
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId);
		}
		
		cyclTotal();
		
		options["materialSubOrder.msoId"] = materialSubOrderAddPostData.materialSubOrder.msoId;
		
		var orderId = materialSubOrderAddPostData.materialSubOrder.orderId;
		var customerId = materialSubOrderAddPostData.materialSubOrder.customerId;
		var customerName = materialSubOrderAddPostData.materialSubOrder.customerName;
		
		var msoId = materialSubOrderAddPostData.materialSubOrder.msoId;
		
		var rowNum = materialSubOrderAdd.listGrid.getGridParam("reccount");
		
		var i = 0;
		
		for(var r in materialSubOrderAdd.record){
			if(materialSubOrderAdd.record[r]){
				var materialSubOrderItem = materialSubOrderAdd.listGrid.jqGrid('getRowData', r);
				options["materialSubOrderItems["+i+"].msoId"] = msoId;
				options["materialSubOrderItems["+i+"].materialModelNo"] = materialSubOrderItem.materialModelNo;
				options["materialSubOrderItems["+i+"].materialModelName"] = materialSubOrderItem.materialModelName;
				options["materialSubOrderItems["+i+"].materialTypeName"] = materialSubOrderItem.materialTypeName;
				options["materialSubOrderItems["+i+"].materialBrandName"] = materialSubOrderItem.materialBrandName;
				options["materialSubOrderItems["+i+"].measurementUnitName"] = materialSubOrderItem.measurementUnitName;
				options["materialSubOrderItems["+i+"].materialUnitPrice"] = materialSubOrderItem.materialUnitPrice;
				options["materialSubOrderItems["+i+"].materialPurchasePrice"] = materialSubOrderItem.materialPurchasePrice;
				options["materialSubOrderItems["+i+"].discount"] = materialSubOrderItem.discount;
				options["materialSubOrderItems["+i+"].salePrice"] = materialSubOrderItem.salePrice;
				options["materialSubOrderItems["+i+"].postDiscount"] = materialSubOrderItem.postDiscount;
				options["materialSubOrderItems["+i+"].price"] = materialSubOrderItem.price;
				options["materialSubOrderItems["+i+"].calcType"] = materialSubOrderItem.calcType;
				options["materialSubOrderItems["+i+"].num"] = materialSubOrderItem.num;
				options["materialSubOrderItems["+i+"].total"] = materialSubOrderItem.total;
				options["materialSubOrderItems["+i+"].packageName"] = materialSubOrderItem.packageName;
				options["materialSubOrderItems["+i+"].des"] = materialSubOrderItem.des;
				
				if(materialSubOrderItem.calcType == 1){
					options["materialSubOrderItems["+i+"].prePoint"] = materialSubOrderItem.point;
				}else{
					options["materialSubOrderItems["+i+"].prePoint"] = materialSubOrderItem.base;
				}
				
				if(materialSubOrderAddPostData.materialSubOrder.materialBrand == ""){
					materialSubOrderAddPostData.materialSubOrder.materialBrand = materialSubOrderItem.materialBrandName;
				}else{
					if(materialSubOrderAddPostData.materialSubOrder.materialBrand != materialSubOrderItem.materialBrandName){
						materialBrandFlag = false;
					}
				}
				
				i++;
			}
		}
		
		if(!materialBrandFlag){
			com.showAlert(com.error, "订单添加型号品牌与原型号品牌不同,原品牌名称为:"+materialSubOrderAddPostData.materialSubOrder.materialBrand+"!");
			return false;
		}
		
		console.log(options);
		
		var btn = $(this);
		btn.button('loading');
		
		if(i > 0){
			com.post(api.material.addMaterialSubOrderItem, options, function(){
				materialOrderPostData["materialOrder.orderId"] = orderId;
				materialOrderPostData["materialOrder.customerId"] = customerId;
				materialOrderPostData["materialOrder.customerName"] = customerName;
				$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
				
				btn.button('reset');
			}, function(res){
				btn.button('reset');
			});
		}else{
			btn.button('reset');
			com.showAlert(com.error, "当前没有添加型号信息");
		}
	});
	
	$("#backBtn").on("click", function(){
		materialOrderPostData["materialOrder.orderId"] = materialSubOrderAddPostData.materialSubOrder.orderId;
		materialOrderPostData["materialOrder.customerId"] = materialSubOrderAddPostData.materialSubOrder.customerId;
		materialOrderPostData["materialOrder.customerName"] = materialSubOrderAddPostData.materialSubOrder.customerName;
		$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
	});
});

function saveRowData(rowId){
	console.log("saveRowData");
	
	if(!materialSubOrderAdd.record[rowId]){
		materialSubOrderAdd.listGrid.jqGrid('saveRow', rowId);
		return false;
	}
	
	if(!checkRowValue(rowId)){
		return false;
	};
	
	if(materialSubOrderAdd.record[rowId]){
		materialSubOrderAdd.listGrid.jqGrid('saveRow', rowId);
	}else{
		clearnRowData(rowId);
		materialSubOrderAdd.listGrid.jqGrid('saveRow', rowId);
	}
	
	cyclTotal();
}

function cancleRowData(listGrid, rowId){
	console.log("cancleRowData");
	
	if(rowId != _lastRowId){
		if(materialSubOrderAdd.record[_lastRowId]){
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId); 
		}else{
			clearnRowData(_lastRowId);
			materialSubOrderAdd.listGrid.jqGrid('saveRow', _lastRowId);
			materialSubOrderAdd.record[rowId] = false;
		}
	}
	
	materialSubOrderAdd.listGrid.jqGrid('editRow', rowId);
	clearnRowData(rowId);
	materialSubOrderAdd.listGrid.jqGrid('saveRow', rowId);
	materialSubOrderAdd.record[rowId] = false;
}

function clearnRowData(rowId){
	for(var i=0;i<materialSubOrderAdd.columnNames.length;i++){
		var _id = "#" + rowId + "_" + materialSubOrderAdd.columnNames[i];
		$(_id).val("");
	}
}

function beforeDeleteCallback(e) {
	var form = $(e[0]);
	if(form.data('styled')) return false;
	
	form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
	style_delete_form(form);
	
	form.data('styled', true);
}

function fillData(id, content){
	var options = {};
	var mmId = autoFillNameList[autoFillList.indexOf(content)];
	
	if(mmId){
		options["materialModel.mmId"] = mmId;
	}else{
		return false;
	}
	
	com.post(api.material.queryMaterialModelById, options, function(data){
		columnActionInit(id, data, true);
	}, function(data){
		com.showAlert(com.error, "获取数据失败!");
	});
	
	materialSubOrderAdd.record[id] = true;
}

function columnActionInit(id, data, flag){
	for(var i=0;i<materialSubOrderAdd.columnNames.length;i++){
		var _materialModel = data.materialModel;
		var _id = "#" + id + "_" + materialSubOrderAdd.columnNames[i];
		var _materialModelColumn = materialSubOrderAdd.columnNames[i];
		
		if(_materialModelColumn == "salePrice"){
			if(flag){
				$(_id).val(utils.changeTwoDecimal(utils.accMul(parseFloat(_materialModel["materialUnitPrice"]), parseFloat(_materialModel["discount"]))));
			}
			$(_id).on("focusout", function(){
				if(checkDataValue(id)){
					$("#"+id+"_price").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_salePrice").val()), parseFloat($("#"+id+"_postDiscount").val()))));
					$("#"+id+"_total").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val()))));
				}
			});
		}else if(_materialModelColumn == "postDiscount"){
			if(flag){
				$(_id).val(1);
			}
			$(_id).on("focusout", function(){
				if(checkDataValue(id)){
					$("#"+id+"_price").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_salePrice").val()), parseFloat($("#"+id+"_postDiscount").val()))));
					$("#"+id+"_total").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val()))));
				}
			});
		}else if(_materialModelColumn == "price"){
			if(flag){
				$(_id).val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_salePrice").val()), parseFloat($("#"+id+"_postDiscount").val()))));
			}
			$(_id).on("focusout", function(){
				if(checkDataValue(id)){
					$("#"+id+"_total").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val()))));
				}
			});
		}else if(_materialModelColumn == "num"){
			if(flag){
				$(_id).val(1);
			}
			$(_id).on("focusout", function(){
				if(checkDataValue(id)){
					$("#"+id+"_total").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val()))));
				}
			});
		}else if(_materialModelColumn == "total"){
			if(flag){
				$(_id).val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val()))));
			}
			
			if(!$("#"+id+"_packageName").val()){
				$(_id).attr("disabled", "disabled");
			}else{
				$(_id).removeAttr("disabled");
			}
		}else if(_materialModelColumn == "packageName"){
			$(_id).on("focusout", function(){
				if($(_id).val()){
					$("#"+id+"_total").removeAttr("disabled");
				}else{
					$("#"+id+"_total").val(changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val())))).attr("disabled", "disabled");
				}
			});
		}else if(_materialModelColumn == "des"){
			continue;
		}else{
			if(flag){
				$(_id).val(_materialModel[materialSubOrderAdd.columnNames[i]]);
			}
			$(_id).attr("disabled", "disabled");
		}
	}
}

function checkDataValue(rowId){
	
	var salePrice = $("#"+rowId+"_salePrice").val();
	var postDiscount = $("#"+rowId+"_postDiscount").val();
	var price = $("#"+rowId+"_price").val();
	var num = $("#"+rowId+"_num").val();
	
	if(isNaN(salePrice)){
		com.showAlert(com.warning, "折扣价需要数字类型信息!");
		return false;
	}
	
	if(isNaN(postDiscount)){
		com.showAlert(com.warning, "折让需要数字类型信息!");
		return false;
	}
	
	if(isNaN(price)){
		com.showAlert(com.warning, "售价需要数字类型信息!");
		return false;
	}
	
	if(isNaN(num)){
		com.showAlert(com.warning, "数量需要数字类型信息!");
		return false;
	}
	
	return true;
}

function checkRowValue(rowId){
	
	if($("#"+rowId+"_materialModelNo").val() == undefined){
		return true;
	}
	
	var postDiscount = $("#"+rowId+"_postDiscount");
	var postDiscountRex = /^(\d+|\d+\.[0-9]{1,4})$/;
	if(!postDiscountRex.test(postDiscount.val())){
		postDiscount.focus().select();
		com.showAlert(com.warning, "折让输入内容格式错误!");
		return false;
	}
	
	var price = $("#"+rowId+"_price");
	var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
	if(!(priceRex.test(price.val()) && parseFloat(price.val()) > 0)){
		price.focus().select();
		com.showAlert(com.warning, "售价输入内容格式错误!");
		return false;
	}
	
	var num = $("#"+rowId+"_num");
	var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
	if(!(numRex.test(num.val()) && parseFloat(num.val()) > 0)){
		num.focus().select();
		com.showAlert(com.warning, "数量输入内容格式错误!");
		return false;
	}
	
	var packageName = $("#"+rowId+"_packageName");
	if(packageName.val().length > 8){
		packageName.focus().select();
		com.showAlert(com.warning, "套餐名称长度需要小于8!");
		return false;
	}
	
	var des = $("#"+rowId+"_des");
	if(des.val().length > 128){
		des.focus().select();
		com.showAlert(com.warning, "备注信息长度需要小于128!");
		return false;
	}
	
	return true;
}

function cyclTotal(){
	
	var _total = 0;
	
	for(var r in materialSubOrderAdd.record){
		if(materialSubOrderAdd.record[r]){
			var materialSubOrderItem = materialSubOrderAdd.listGrid.jqGrid('getRowData', r);
			_total = utils.accAdd(parseFloat(materialSubOrderItem.total), parseFloat(_total));
		}
	}
	
	_total = utils.accAdd(parseFloat(_total), parseFloat(materialSubOrderAdd.materialSubOrderAddItems.originalTotal.text()));
	
	_total = Math.round(_total);
	
	materialSubOrderAdd.totalSum = _total;
	
	$("#totalSpan").text(_total);
}

function isEmptyObject(obj){
    for(var n in obj){return false} 
    return true;
}
