var materialSaleOrder = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSaleOrderItems: {},
	
	mmIdLimit: 2,
	
	record: {},
	typeahead: {
		queryByNameUrl: api.material.queryMaterialModelForAllByName,
		queryByNoUrl: api.material.queryMaterialModelForAllByNo,
		queryItemUrl: api.material.queryMaterialModelById,
		
		materialModels: "materialModels",
		itemId: "mmId",
		itemName: "materialModel",
		
		optionName: "materialModel.materialModelName",
		optionNo: "materialModel.materialModelNo",
		optionMsoId: "",
		optionItemId: "materialModel.mmId",
	},
	
	columnNames:["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName", "materialUnitPrice", "materialPurchasePrice", "discount", "salePrice", "postDiscount", "price", "calcType", "point", "base", "num", "total", "packageName"],
	disabledColumnNames: ["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName", "materialUnitPrice", "materialPurchasePrice", "discount", "total"],
	
	editFlag: false,
};

var materialSaleOrderOrderData = [ 
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
];

var materialSaleOrderPostData = {};

var _lastRowId;
var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("销售订单", "订单信息列表");
	
	if(materialOrder.saleType == "mend"){
		materialSaleOrder.typeahead.queryByNameUrl = api.material.queryMaterialSubOrderItemForNameByName;
		materialSaleOrder.typeahead.queryByNoUrl = api.material.queryMaterialSubOrderItemForNameByNo;
		materialSaleOrder.typeahead.queryItemUrl = api.material.queryMaterialSubOrderItemForSaleByMsoiId;
		
		materialSaleOrder.typeahead.materialModels = "materialSubOrderItems";
		materialSaleOrder.typeahead.itemId = "msoiId";
		materialSaleOrder.typeahead.itemName = "materialSubOrderItem";
		
		materialSaleOrder.typeahead.optionName = "materialSubOrderItem.materialModelName";
		materialSaleOrder.typeahead.optionNo = "materialSubOrderItem.materialModelNo";
		materialSaleOrder.typeahead.optionMsoId = "materialSubOrderItem.msoId";
		materialSaleOrder.typeahead.optionItemId = "materialSubOrderItem.msoiId";
	}
	
	materialSaleOrder.listGrid = $("#listGrid");
	materialSaleOrder.gridPager = "#gridPager";
	materialSaleOrder.saveBtn = $("#saveBtn");
	materialSaleOrder.cancelBtn = $("#cancelBtn");
	materialSaleOrder.materialSaleOrderModal = $("#materialSaleOrderModal");
	
	materialSaleOrderPostData["materialSubOrder.customerId"] = materialOrderPostData["materialOrder.customerId"].indexOf('--') != -1 ? "" : materialOrderPostData["materialOrder.customerId"];
	materialSaleOrderPostData["materialSubOrder.designerId"] = materialOrderPostData["materialOrder.designerId"].indexOf('--') != -1 ? "" : materialOrderPostData["materialOrder.designerId"];
	materialSaleOrderPostData["materialSubOrder.designerName"] = materialOrderPostData["materialOrder.designerName"].indexOf('--') != -1 ? "" : materialOrderPostData["materialOrder.designerName"];
	
	materialSaleOrder.materialSaleOrderItems.orderId = $("#orderId").val(materialOrderPostData["materialOrder.orderId"]);
	materialSaleOrder.materialSaleOrderItems.customerName = $("#customerName").val(materialOrderPostData["materialOrder.customerName"]);
	materialSaleOrder.materialSaleOrderItems.salesmanName = $("#salesmanName").val(materialOrderPostData["materialOrder.designerName"]);
	materialSaleOrder.materialSaleOrderItems.materialerName = $("#materialerName");
	materialSaleOrder.materialSaleOrderItems.orderAddr = $("#orderAddr").val(materialOrderPostData["materialOrder.orderAddr"]);
	materialSaleOrder.materialSaleOrderItems.msoType = $("#msoType");
	materialSaleOrder.materialSaleOrderItems.des = $("#des");
	
	com.initChosen('salesmanName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty":""}, "autoFillKeyValue", "key", "value");
	com.initChosen('materialerName', api.personel.queryUserForNameByDutysAO, "pinyinName", {"dutysO[0]":"主材组长", "dutysO[1]":"主材导购"}, "autoFillKeyValue", "key", "value");
	com.initChosen('instoreName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty":"驻店"}, "autoFillKeyValue", "key", "value");
	com.initChosen('materialBrand', api.data.queryBrandForPinYinNameACategoryName, "pinyinName", {}, "autoFillKeyValue", "key", "value");
	
//	initChange("salesmanName", "salesmanId", api.personel.queryUserForNameByDuty, {"duty":""});
//	initChange("materialerName", "materialerId", api.personel.queryUserForNameByDutysAO, {"dutysO[0]":"主材组长", "dutysO[1]":"主材导购"});
//	initChange("instoreName", "instoreId", api.personel.queryUserForNameByDuty, {"duty":"驻店"});
//	initChange("materialBrand", "materialBrandName", api.data.queryBrandForPinYinNameACategoryName, {});
	
	com.updateChosen("salesmanName", materialSaleOrderPostData["materialSubOrder.designerId"], materialSaleOrderPostData["materialSubOrder.designerName"]);
	
	com.post(api.ds.materialInfo, {}, function(res){
		materialSaleOrder.materialOrderType = res.materialOrderType;
		
		materialSaleOrder.materialSaleOrderItems.msoType.bindData(materialSaleOrder.materialOrderType, "key", "value");
	});
	
	materialSaleOrder.listGrid.jqGrid({		
		data: materialSaleOrderOrderData, 
		datatype: "local",
		rowNum: 15,
		multiselect : false,
		multiboxonly: false,
		forceFit: false,
		colNames:['名称', '编号', '品类', '品牌', '单位', '单价', '标价', '折扣', '折扣价', '折让', '售价', '计算方式', '底价', '点位', '数量', '总价', '套餐', '备注', '',],
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
					result += '<div id="jCancelButton_' + _rowId + '" class="ui-pg-div ui-inline-cancel" onclick="cancleRowData(materialSaleOrder.listGrid, ' + _rowId + ');" style="float: left; margin-left: 5px;" title="取消"><span class="ui-icon ui-icon-cancel"></span></div>';
					
					return result;
				}
			}
		], onSelectRow: function(id){
			console.log("onSelectRow");
			if(id && id !== _lastRowId){
				
				if(materialSaleOrder.record[_lastRowId]){
					
					if(!checkRowValue(_lastRowId)){
						return false;
					};
					
					materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId);
				}else{
					clearnRowData(_lastRowId);
					materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId);
				}
				
				cyclTotal();
				
				materialSaleOrder.listGrid.jqGrid('editRow', id);
				_lastRowId = id;
				
				if(materialSaleOrder.record[id]){
					for(var i=0;i<materialSaleOrder.disabledColumnNames.length;i++){
						var _id = "#" + id + "_" + materialSaleOrder.disabledColumnNames[i];
						$(_id).attr("disabled", "disabled");
					}
				}
				
				if(materialSaleOrder.record[id]){
					columnActionInit(id, {}, false);
				}
				
				var rowNumLimit = materialSaleOrder.listGrid.getGridParam("reccount")/2;
				var limitFlag = false;
				
				if(id > rowNumLimit){
					limitFlag = true;
				}
				
				$("#"+id+"_materialModelName").typeahead({
					url: materialSaleOrder.typeahead.queryByNameUrl.url,
					reverseFlag: limitFlag,
				    source: function (query, process) {
				        var options = {};
				        
				        options[materialSaleOrder.typeahead.optionMsoId] = materialOrder.msoId;
				        options[materialSaleOrder.typeahead.optionName] = query;
				        
				        if(typeof this.options.url !== "string")
				        	com.showAlert(com.error, "the autoFillText has no any url.");
				        com.post(materialSaleOrder.typeahead.queryByNameUrl, options, function(data){
				        	var materialModels = data[materialSaleOrder.typeahead.materialModels];
				        	autoFillList = [];
			        		autoFillNameList = [];
			        		for(var i=0;i<materialModels.length;i++){
			        			
			        			var _ = materialModels[i];
			        			
			        			autoFillList[i] = _.materialModelName;
			        			autoFillNameList[i] = _[materialSaleOrder.typeahead.itemId];
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
					url: materialSaleOrder.typeahead.queryByNoUrl.url,
					reverseFlag: limitFlag,
				    source: function (query, process) {
				        var options = {};
				        
				        options[materialSaleOrder.typeahead.optionMsoId] = materialOrder.msoId;
				        options[materialSaleOrder.typeahead.optionNo] = query;
				        
				        if(typeof this.options.url !== "string")
				        	com.showAlert(com.error, "the autoFillText has no any url.");
				        com.post(materialSaleOrder.typeahead.queryByNoUrl, options, function(data){
				        	var materialModels = data[materialSaleOrder.typeahead.materialModels];
			        		autoFillList = [];
			        		autoFillNameList = [];
			        		for(var i=0;i<materialModels.length;i++){
			        			
			        			var _ = materialModels[i];
			        			
			        			autoFillList[i] = _.materialModelNo;
			        			autoFillNameList[i] = _[materialSaleOrder.typeahead.itemId];
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
		pager:materialSaleOrder.gridPager,
	});
	
	materialSaleOrder.listGrid.navGrid(materialSaleOrder.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialSaleOrder.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		onClickButton: function(){
			materialSaleOrder.listGrid.jqGrid('addRowData', materialSaleOrder.listGrid.getGridParam("reccount")+1, {}); 
		},
		position: "first",
	});
	
	$('#addSaleOrder').click(function(){
		
		if(materialSaleOrder.record[_lastRowId]){
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId); 
		}else{
			clearnRowData(_lastRowId);
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId); 
		}
		
		cyclTotal();
		
		materialSaleOrder.listGrid.jqGrid('addRowData', materialSaleOrder.listGrid.getGridParam("reccount")+1, {});
	});
	
	$('#submitSaleOrder').click(function(){
		
		com.clearValidator("#salesmanName", true);
		
		var options = {};
		
		var materialBrandStr = "";
		var materialBrandFlag = true;
		var salesmanNameFlag = false;
		
		if($("#salesmanName").val() == ""){
			com.showTips($("#salesmanName"), "字段不能为空!", true);
			salesmanNameFlag = true;
		}
		
		if(com.validate() || salesmanNameFlag)
			return;
		
		if(materialSaleOrder.record[_lastRowId]){
			
			if(!checkRowValue(_lastRowId)){
				return false;
			};
			
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId);
		}else{
			clearnRowData(_lastRowId);
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId);
		}
		
		cyclTotal();
		
		if(materialSaleOrder.totalSum < 0){
			com.showAlert(com.error, "当前录入订单总数小于0");
			return false;
		}
		
		materialBrandStr = $("#materialBrand_chosen span")[0].textContent;
		var orderId = materialSaleOrder.materialSaleOrderItems.orderId.val();
		var customerId = materialSaleOrderPostData["materialSubOrder.customerId"];
		var customerName = materialSaleOrder.materialSaleOrderItems.customerName.val();
		
		var materialType = materialBrandStr.split('-')[1];
		var materialBrand = materialBrandStr.split('-')[0];
		
		console.log($('#instoreName').val());
		
		options["materialSubOrder.orderId"] = orderId;
		options["materialSubOrder.orderAddr"] = materialSaleOrder.materialSaleOrderItems.orderAddr.val();
		options["materialSubOrder.customerId"] = customerId;
		options["materialSubOrder.customerName"] = customerName;
		options["materialSubOrder.msoType"] = materialSaleOrder.materialSaleOrderItems.msoType.val();
		options["materialSubOrder.des"] = materialSaleOrder.materialSaleOrderItems.des.val();
		options["materialSubOrder.salesmanId"] = $('#salesmanName').val();
		options["materialSubOrder.materialerId"] = $('#materialerName').val();
		options["materialSubOrder.instoreId"] = $('#instoreName').val() ? $('#instoreName').val() : "";
		options["materialSubOrder.materialType"] = materialType;
		options["materialSubOrder.materialBrand"] = materialBrand;
		
		var rowNum = materialSaleOrder.listGrid.getGridParam("reccount");
		
		var i = 0;
		
		for(var r in materialSaleOrder.record){
			if(materialSaleOrder.record[r]){
				var materialSubOrderItem = materialSaleOrder.listGrid.jqGrid('getRowData', r);
				
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
				
				if(materialBrand == ""){
					materialBrand = materialSubOrderItem.materialBrandName;
				}else{
					if(materialBrand != materialSubOrderItem.materialBrandName){
						materialBrandFlag = false;
					}
				}
				
				i++;
			}
		}
		
		if(!materialBrandFlag){
			com.showAlert(com.error, "销售订单中,所有项目需要是相同品牌信息!");
			return false;
		}
		
		var btn = $(this);
		btn.button('loading');
		
		com.post(api.material.addMaterialSubOrder, options, function(){
			materialOrderPostData["materialOrder.orderId"] = orderId;
			materialOrderPostData["materialOrder.customerId"] = customerId;
			materialOrderPostData["materialOrder.customerName"] = customerName;
			
			btn.button('reset');
			
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		}, function(){
			btn.button('reset');
		});
	});
	
	$("#backBtn").on("click", function(){
		com.switchPage(api.index.materialOrderIndex.url);
	});
});

function saveRowData(rowId){
	console.log("saveRowData");
	
	if(!materialSaleOrder.record[rowId]){
		materialSaleOrder.listGrid.jqGrid('saveRow', rowId);
		return false;
	}
	
	if(!checkRowValue(rowId)){
		return false;
	};
	
	if(materialSaleOrder.record[rowId]){
		materialSaleOrder.listGrid.jqGrid('saveRow', rowId);
	}else{
		clearnRowData(rowId);
		materialSaleOrder.listGrid.jqGrid('saveRow', rowId);
	}
	
	cyclTotal();
}

function cancleRowData(listGrid, rowId){
	console.log("cancleRowData");
	
	if(rowId != _lastRowId){
		if(materialSaleOrder.record[_lastRowId]){
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId); 
		}else{
			clearnRowData(_lastRowId);
			materialSaleOrder.listGrid.jqGrid('saveRow', _lastRowId);
			materialSaleOrder.record[rowId] = false;
		}
	}
	
	materialSaleOrder.listGrid.jqGrid('editRow', rowId);
	clearnRowData(rowId);
	materialSaleOrder.listGrid.jqGrid('saveRow', rowId);
	materialSaleOrder.record[rowId] = false;
}

function clearnRowData(rowId){
	for(var i=0;i<materialSaleOrder.columnNames.length;i++){
		var _id = "#" + rowId + "_" + materialSaleOrder.columnNames[i];
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

function initTypeahead(query, process){
	
}

function fillData(id, content){
	
	var options = {};
	var itemId = autoFillNameList[autoFillList.indexOf(content)];
	
	if(itemId){
		options[materialSaleOrder.typeahead.optionItemId] = itemId;
	}else{
		return false;
	}
	
	com.post(materialSaleOrder.typeahead.queryItemUrl, options, function(data){
		
		var _item = data[materialSaleOrder.typeahead.itemName];
		
		console.log(_item);
		
		columnActionInit(id, _item, true);
	}, function(data){
		com.showAlert(com.error, "获取数据失败!");
	});
	
	materialSaleOrder.record[id] = true;
}

function columnActionInit(id, data, flag){
	for(var i=0;i<materialSaleOrder.columnNames.length;i++){
		var _materialModel = data;
		var _id = "#" + id + "_" + materialSaleOrder.columnNames[i];
		var _materialModelColumn = materialSaleOrder.columnNames[i];
		
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
					$("#"+id+"_total").val(utils.changeTwoDecimal(utils.accMul(parseFloat($("#"+id+"_price").val()), parseFloat($("#"+id+"_num").val())))).attr("disabled", "disabled");
				}
			});
		}else if(_materialModelColumn == "des"){
			continue;
		}else{
			if(flag){
				$(_id).val(_materialModel[materialSaleOrder.columnNames[i]]);
			}
			$(_id).attr("disabled", "disabled");
		}
	}
}

function initChange(id, postId, queryElementsUrl, options){
	
	id = "#" + id;
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true
	});
	
	$(id).on("change", function(){
		materialSaleOrderPostData[postId] = $(id).val();
	});
	
	$(chosenNameId).bind("input", function(){
		var autoFileSearchValue = $(chosenNameId).val();
		if(autoFileSearchValue == ""){
			return false;
		}
		options["pinyinName"] = autoFileSearchValue;
		com.post(queryElementsUrl, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillKeyValue != null){
					for(var i=0;i<res.autoFillKeyValue.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				$(id).html(html1).trigger("chosen:updated");
				$(chosenNameId).val(autoFileSearchValue);
			}
		});
	});
}

function defaultChange(id, postId, eid, ename){
	if(eid.replace(/\s+/g, "") != "" && ename.replace(/\s+/g, "") != ""){
		$("#" + id + "_chosen span")[0].textContent = ename;
		materialSaleOrderPostData[postId] = eid;
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
	
	var salePrice = $("#"+rowId+"_salePrice");
	var salePriceRex = /^(\d+|\d+\.[0-9]{1,4})$/;
	if(!salePriceRex.test(salePrice.val())){
		salePrice.focus().select();
		com.showAlert(com.warning, "折扣价输入内容格式错误!");
		return false;
	}
	
	var postDiscount = $("#"+rowId+"_postDiscount");
	var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
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
	
	for(var r in materialSaleOrder.record){
		if(materialSaleOrder.record[r]){
			var materialSubOrderItem = materialSaleOrder.listGrid.jqGrid('getRowData', r);
			_total = utils.accAdd(parseFloat(materialSubOrderItem.total), parseFloat(_total));
		}
	}
	
	materialSaleOrder.totalSum = _total;
	
	$("#totalSpan").text(_total);
}

function isEmptyObject(obj){
    for(var n in obj){return false} 
    return true;
}
