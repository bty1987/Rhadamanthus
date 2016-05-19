var materialOrderPostBalanceDetail = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderBalanceDetailItems: {},
	
	editFlag: false
};

var materialOrderPostBalanceDetailPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("结算", "订单信息列表");
	
	materialOrderPostBalanceDetail.listGrid = $("#listGrid");
	materialOrderPostBalanceDetail.gridPager = "#gridPager";
	materialOrderPostBalanceDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPostBalanceDetail.cancelBtn = $("#cancelBtn");
	materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal = $("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.calcType = $("#calcType");
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value = $("#value");
	
	var options = {};
	options["materialSubOrder.msoId"] = materialOrderPostBalancePostData["materialOrderPostBalance.msoId"];
	
	com.post(api.material.queryMaterialSubOrderItemByMsoId, options, function(result){
		materialSubOrderItemData = result.materialSubOrderItems;
		materialSubOrderItemListGridInit();
		
		var materialSubOrderInfo = "";
		materialSubOrderInfo += "抹零:"+materialOrderPostBalancePostData["materialOrderPostBalance.maling"];
		materialSubOrderInfo += ",厂商抹零:"+materialOrderPostBalancePostData["materialOrderPostBalance.venderMaling"];
		
		if(materialOrderPostBalancePostData["materialOrderPostBalance.couponInfo"] != ""){
			materialSubOrderInfo += ",券信息:"+materialOrderPostBalancePostData["materialOrderPostBalance.couponInfo"];
		}
		$("#showMaterialSubOrderInfo").html(materialSubOrderInfo);
	});
});

function materialSubOrderItemListGridInit(){
	materialOrderPostBalanceDetail.listGrid.jqGrid({
		treeGrid: true,
		treeGridModel: 'adjacency',
		ExpandColumn: 'id',
		datastr: JSON.stringify(materialSubOrderItemData),
		datatype: "jsonstring",
	    rowNum : "-1",
		colNames:['编号', 'id', 'msoiId', 'msoId', '名称', '品类', '品牌', '单位', '折扣价', '售价', '数量', '总价', '状态', '计算方式', '预结算值', '结算值', '描述', '级别', '叶子', '操作'],
		colModel:[
		    {name:'materialModelNo'},
		    {name:'id', hidden:true},
		    {name:'msoiId', hidden:true},
		    {name:'msoId', hidden:true},
		    {name:'materialModelName'},
			{name:'materialTypeName'},
			{name:'materialBrandName'},
			{name:'measurementUnitName'},
			{name:'salePrice'},
			{name:'price'},
			{name:'num'},
			{name:'total'},
			{name:'status', hidden:true},
			{name:'calcType', hidden:true},
			{name:'prePoint'},
			{name:'postPoint'},
			{name:'des'},
			{name:'level', hidden:true},
			{name:'isLeaf', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		],
		caption: "订单信息列表 <span id='showMaterialSubOrderInfo'></span>",
		pager: materialOrderPostBalanceDetail.gridPager,

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
	
	materialOrderPostBalanceDetail.listGrid.navGrid(materialOrderPostBalanceDetail.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialOrderPostBalanceDetail.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#materialOrderPostBalancePageContent").load(api.index.materialOrderPostBalanceIndex.url);
		},
	});
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="dialogMaterialSubOrderItemBalanceModal(' + options.rowId + ');">';
	
	if(rowdata.level == 0 && rowdata.isLeaf == true){
		if(rowdata.calcType == 0){
			result += '底价';
		}else{
			result += '点位';
		}
	}else if(rowdata.level == 0 && rowdata.isLeaf == false){
		result += '点位';
	}else if(rowdata.level == 1){
		return "";
	}
	
	result += '</button>';
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

function saveData(){
	
	var i = 0;
	var options = {};
	
	var rowId = materialOrderPostBalanceDetailPostData["materialOrderPostBalanceDetail.rowId"];
	var prowId = rowId;
	
	var rowInfo = materialOrderPostBalanceDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(rowInfo.isLeaf == "true"){
		options["msoiIds[" + i++ + "]"] = rowInfo.msoiId;
	}else if(rowInfo.isLeaf == "false"){
		while(true){
			rowId = rowId + 1;
			
			var item = materialOrderPostBalanceDetail.listGrid.jqGrid('getRowData', rowId);
			if(item.level == 0 && item.isLeaf || rowId > materialOrderPostBalanceDetail.listGrid.jqGrid('getGridParam','records')){
				break;
			}
			
			options["msoiIds[" + i++ + "]"] = item.msoiId;
			
		}
	}
	
	if(rowInfo.calcType == "0"){
		var base = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
		var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		if(!(priceRex.test(base) && parseFloat(base) > 0)){
			materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
			com.showTips(materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value, "底价输入内容格式错误!", true);
			return false;
		}
	}else if(rowInfo.calcType == "1"){
		var point = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
		if(!postDiscountRex.test(point)){
			materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
			com.showTips(materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value, "点位输入内容格式错误!", true);
			return false;
		}
	}
	
	options["materialSubOrderItem.postPoint"] = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
	options["materialSubOrderItem.mosId"] = materialOrderPostBalancePostData["materialOrderPostBalance.msoId"];
	
	com.post(api.material.updateMaterialSubOrderItemForPostPT, options, function(result){
		materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
		materialOrderPostBalanceDetail.listGrid.setCell(prowId, "postPoint", materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val());
	});
}

function dialogMaterialSubOrderItemBalanceModal(rowId){
	
	var _info = materialOrderPostBalanceDetail.listGrid.jqGrid('getRowData', rowId);
	
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.calcType.val(_info.calcType == 0 ? "底价" : "点位");
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val(_info.postPoint);
	
	materialOrderPostBalanceDetailPostData["materialOrderPostBalanceDetail.rowId"] = rowId;
	
	materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal.modal("show");
}
