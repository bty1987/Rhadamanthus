var materialOrderPreBalanceDetail = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderBalanceDetailItems: {},
	
	editFlag: false
};

var materialOrderPreBalanceDetailPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("预结算", "订单信息列表");
	
	materialOrderPreBalanceDetail.listGrid = $("#listGrid");
	materialOrderPreBalanceDetail.gridPager = "#gridPager";
	materialOrderPreBalanceDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalanceDetail.cancelBtn = $("#cancelBtn");
	materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal = $("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType = $("#calcType");
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value = $("#value");
	
	var options = {};
	options["materialSubOrder.msoId"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
	
	com.post(api.material.queryMaterialSubOrderItemByMsoId, options, function(result){
		
		materialSubOrderItemData = result.materialSubOrderItems;
		materialSubOrderItemListGridInit();
	});
});

function materialSubOrderItemListGridInit(){
	materialOrderPreBalanceDetail.listGrid.jqGrid({
		treeGrid: true,
		treeGridModel: 'adjacency',
		ExpandColumn: 'id',
		datastr: JSON.stringify(materialSubOrderItemData),
		datatype: "jsonstring",
	    rowNum : "-1",
		colNames:['编号', 'id', 'msoiId', 'msoId', '名称', '品类', '品牌', '单位', '折扣价', '售价', '数量', '总价', '状态', '计算方式', '结算值', '利润', '描述', '级别', '叶子', '操作'],
		colModel:[
		    {name:'materialModelName', width:250},
		    {name:'materialModelNo', hidden:true},
		    {name:'id', hidden:true},
		    {name:'msoiId', hidden:true},
		    {name:'msoId', hidden:true},
			{name:'materialTypeName', formatter: materialTypeInit},
			{name:'materialBrandName'},
			{name:'measurementUnitName'},
			{name:'salePrice'},
			{name:'price'},
			{name:'num'},
			{name:'total'},
			{name:'status', hidden:true},
			{name:'calcType', hidden:true},
			{name:'prePoint'},
			{name:'profit', formatter: profitInit},
			{name:'des'},
			{name:'level', hidden:true},
			{name:'isLeaf', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		],
		caption: "订单信息列表",
		pager: materialOrderPreBalanceDetail.gridPager,

		jsonReader: {
	        root: "dataRows",
	        repeatitems : false
	    },
	    treeReader : {
	        level_field: "level",
	        parent_id_field: "parent",
	        leaf_field: "isLeaf",
	        expanded_field: "expanded"
	    },
	    ondblClickRow: function(id){
	    	console.log("ondblClickRow");
	    },
	    gridComplete: function(){
	    	console.log("gridComplete");
	    	$(".tree-minus").unbind();
	    },
	});
	
	materialOrderPreBalanceDetail.listGrid.navGrid(materialOrderPreBalanceDetail.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialOrderPreBalanceDetail.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceIndex.url);
		},
		
	}).navButtonAdd(materialOrderPreBalanceDetail.gridPager, {
		caption:"",
		buttonicon: 'icon-ok blue',
		title: "预结算",
		onClickButton: function(){
			
			var options = {};
			
			options["msoIds[0]"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
			console.log(options);
			
			bootbox.confirm("确定需要提交当前子订单的预结算处理吗?", function(result) {
				if(result){
					com.post(api.material.preBalanceMaterialSubOrder, options, function(result){
						$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceIndex.url);
					}, function(result){
						com.showAlert(com.error, "确认失败!");
					});
				}
			});
		},
	});
}

function pointCacl(salePrice, price, point, num, maling){
	// (售价 - 折扣价 * (1 - 点位)) * 数量
	return utils.accMul(utils.accSub(price, utils.accMul(salePrice, utils.accSub(1, point))), num)
}

function baseCacl(price, base, num, maling){
	// (售价 - 底价) * 数量
	return utils.accMul(utils.accSub(price, base), num);
}

function packageCacl(total, point){
	return utils.accMul(total, point);
}

function profitInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue){
		return cellvalue;
	}
	
	if(rowdata.level == 0 && rowdata.isLeaf == true){
		if(rowdata.calcType == 0){
			result += baseCacl(rowdata.price, rowdata.prePoint, rowdata.num);
		}else{
			result += pointCacl(rowdata.salePrice, rowdata.price, rowdata.prePoint, rowdata.num);
		}
	}else if(rowdata.level == 0 && rowdata.isLeaf == false){
		result += packageCacl(rowdata.total, rowdata.prePoint);
	}else if(rowdata.level == 1){
		return "";
	}
	
	return result;
}

function materialTypeInit(cellvalue, options, rowdata){
	return '<div style="" onclick="changeCalcType('+rowdata.msoiId+')">'+cellvalue+'</div>';
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	var rowId = options.rowId
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail_' + rowId + '" class="btn btn-minier btn-success" onclick="dialogMaterialSubOrderItemBalanceModal(' + rowId + ');">';
	
	if(rowdata.level == 0 && rowdata.isLeaf == true){
		if(rowdata.calcType == 0){
			result += '底价</button>';
		}else{
			result += '点位</button>';
		}
		
		result += '<button id="changeDecorationOrderCalcType_' + rowId + '" class="btn btn-minier btn-danger" onclick="changeCalcType(' + rowId + ',' + rowdata.msoiId + ',' + rowdata.calcType + ');">计算方式</div>';
	}else if(rowdata.level == 0 && rowdata.isLeaf == false){
		result += '点位</button>';
	}else if(rowdata.level == 1){
		return "";
	}
	
	result += '</div>';
	
	return result;
}

function valueInit(cellvalue, options, rowdata){
	
	var calcType = rowdata.calcType;
	
	if(calcType == 0){
		return rowdata.point;
	}else{
		return rowdata.base;
	}
}

function changeCalcType(rowId, msoiId, calcType){
	console.log("changeCalcType");
	
	var options = {};
	var rowInfo = materialOrderPreBalanceDetail.listGrid.jqGrid('getRowData', rowId);
	
	options["materialSubOrderItem.msoiId"] = msoiId;
	
	bootbox.confirm("确认需要修改当前型号的计算方式?", function(result) {
		if(result){
			com.post(api.material.changeMaterialSubOrderItemForCaclType, options, function(result){
				var prePoint = 0;
				var profit = 0;
				
				var calcTypeBtn = $("#viewDecorationOrderDetiail_" + rowId);
				var changeBtn = $("#changeDecorationOrderCalcType_" + rowId);
				
				if(rowInfo.level == "0" && rowInfo.isLeaf == "true"){
					if(calcType == 1){
						profit = baseCacl(parseFloat(rowInfo.price), prePoint, parseFloat(rowInfo.num));
						calcType = 0;
						
						calcTypeBtn.text("底价");
					}else{
						profit = pointCacl(parseFloat(rowInfo.salePrice), parseFloat(rowInfo.price), prePoint, parseFloat(rowInfo.num));
						calcType = 1;
						
						calcTypeBtn.text("点位");
					}
				}
				
				materialOrderPreBalanceDetail.listGrid.setCell(rowId, "calcType", calcType);
				materialOrderPreBalanceDetail.listGrid.setCell(rowId, "profit", profit.toString());
				materialOrderPreBalanceDetail.listGrid.setCell(rowId, "prePoint", prePoint);
				
				changeBtn.attr("onclick", 'changeCalcType(' + rowId + ',' + msoiId + ',' + calcType + ');')
			});
		}
	});
}

function saveData(){
	
	var i = 0;
	var options = {};
	
	var rowId = materialOrderPreBalanceDetailPostData["materialOrderPreBalanceDetail.rowId"];
	var prowId = rowId;
	
	var rowNum = materialOrderPreBalanceDetail.listGrid.jqGrid('getGridParam', 'records');
	var rowInfo = materialOrderPreBalanceDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(rowInfo.isLeaf == "true"){
		options["msoiIds[" + i++ + "]"] = rowInfo.msoiId;
	}else if(rowInfo.isLeaf == "false"){
		while(true){
			rowId = rowId + 1;
			
			var item = materialOrderPreBalanceDetail.listGrid.jqGrid('getRowData', rowId);
			if(item.level == 0 && item.isLeaf || rowId > rowNum){
				break;
			}
			
			options["msoiIds[" + i++ + "]"] = item.msoiId;
		}
	}
	
	if(rowInfo.calcType == "0"){
		var base = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		if(!(priceRex.test(base) && parseFloat(base) > 0)){
			materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
			com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "底价输入内容格式错误!", true);
			return false;
		}
	}else if(rowInfo.calcType == "1"){
		var point = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
		if(!postDiscountRex.test(point)){
			materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
			com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "点位输入内容格式错误!", true);
			return false;
		}
	}
	
	options["materialSubOrderItem.prePoint"] = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
	options["materialSubOrderItem.mosId"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
	
	console.log(options);
	
	com.post(api.material.updateMaterialSubOrderItemForPrePT, options, function(result){
		var prePoint = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		var profit = 0;
		
		if(rowInfo.level == "0" && rowInfo.isLeaf == "true"){
			if(rowInfo.calcType == "0"){
				profit = baseCacl(parseFloat(rowInfo.price), prePoint, parseFloat(rowInfo.num));
			}else{
				profit = pointCacl(parseFloat(rowInfo.salePrice), parseFloat(rowInfo.price), prePoint, parseFloat(rowInfo.num));
			}
		}else if(rowInfo.level == "0" && rowInfo.isLeaf == "false"){
			profit = packageCacl(parseFloat(rowInfo.total), prePoint);
		}
		
		materialOrderPreBalanceDetail.listGrid.setCell(prowId, "profit", profit.toString());
		materialOrderPreBalanceDetail.listGrid.setCell(prowId, "prePoint", prePoint);
		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
	});
}

function dialogMaterialSubOrderItemBalanceModal(rowId){
	
	com.cleanItems(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems);
	
	var _info = materialOrderPreBalanceDetail.listGrid.jqGrid('getRowData', rowId);
	
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType.val(_info.calcType == "0" ? "底价" : "点位");
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val(_info.prePoint);
	
	materialOrderPreBalanceDetailPostData["materialOrderPreBalanceDetail.rowId"] = rowId;
	
	materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("show");
}
