var materialSubOrderDetail = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderDetailItems: {},
	
	columnNames:["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName"],
	disabledColumnNames: ["materialTypeName", "materialBrandName", "measurementUnitName", "salePrice", "price"],
	
	mmIdLimit: 2,
	
	record: {},
	
	_noValue: {},
	_noAction: {},
	_actionValue: {},
	
	editFlag: false
};

var materialSubOrderItemData = {};
var materialSubOrderItemPostData = {};
var refundMaterialSubOrderData = {};
var refundMaterialSubOrderItemData = {};
var refundMaterialSubOrderItemIdData = [];
var updateMaterialSubOrderItemData = [];
var deleteMaterialSubOrderItemData = [];

var refundMaterialSubOrderItemArgs = {};

var _lastRowId = -1;
var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("子订单项", "子订单项信息列表");
	
	materialSubOrderItemPostData["materialSubOrder.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderItemPostData["materialSubOrder.msoNo"] = materialSubOrderPostData["materialSubOrder.msoNo"];
	materialSubOrderItemPostData["materialSubOrder.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
	materialSubOrderItemPostData["materialSubOrder.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
	materialSubOrderItemPostData["materialSubOrder.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
	materialSubOrderItemPostData["materialSubOrder.maling"] = materialSubOrderPostData["materialSubOrder.maling"];
	materialSubOrderItemPostData["materialSubOrder.venderMaling"] = materialSubOrderPostData["materialSubOrder.venderMaling"];
	
	materialSubOrderDetail.listGrid = $("#listGrid");
	materialSubOrderDetail.gridPager = "#gridPager";
	materialSubOrderDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialSubOrderDetail.saveRefundBtn = $("#saveRefundBtn").on("click", saveRefundData);
	materialSubOrderDetail.cancelBtn = $("#cancelBtn");
	materialSubOrderDetail.rejectMaterialSubOrderModal = $("#rejectMaterialSubOrderModal").on('show.bs.modal',function(e){
		$("#refund").val("");
		$("#refundDes").val("");
		
		com.updateChosen('approver', '', '');
		
		com.clearValidator();
		com.clearValidator("#refund", true);
	});
	
	com.initChosen('approver', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"userApprove.type": shenPiType}, "autoFillKeyValue", "key", "value");
	
	com.post(api.material.queryMaterialSubOrderItemByMsoId, materialSubOrderPostData, function(result){
		
		materialSubOrderItemData = result.materialSubOrderItems;
		materialSubOrderItemListGridInit();
		
		$("#backBtn").on("click", function(){
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		});
		
		materialSubOrderDetail.refundBtn = $("#refundBtn");
		materialSubOrderDetail.refundCommitBtn = $("#refundCommitBtn");
		materialSubOrderDetail.refundCancelBtn = $("#refundCancelBtn");
		
		materialSubOrderDetail.refundBtn.on("click", function(){
			console.log("refundBtn");
			
			refundMaterialSubOrderItemIdData = [];
			
			$("[name='refund']").each(function(i, e){
				if(e.checked){
					
					refundMaterialSubOrderItemIdData.push(e.id);
			    	 
					var _refundId = e.id.split('_');
					var rowId = parseInt(_refundId[1]);
					var level = _refundId[2];
					var isLeaf = _refundId[3];
					
					var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
				    		
					if(isLeaf == "true"){
						actionColumnOpen(rowId, materialSubOrderItem.action, "cancel");
					}else{
						actionColumnOpen(rowId, materialSubOrderItem.action, "cancel");
						
						while(true){
							rowId = rowId + 1;
							
							var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
							if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
								break;
							}
						
							actionColumnOpen(rowId, materialSubOrderItem.action, "cancelItem");
						}
					}
					
					materialSubOrderDetail.refundBtn.css("display", "none");
					materialSubOrderDetail.refundCommitBtn.css("display", "block");
					materialSubOrderDetail.refundCancelBtn.css("display", "block");
				}
			});
		});
		
		materialSubOrderDetail.refundCommitBtn.click(function(){
			
			updateMaterialSubOrderItemData = [];
			deleteMaterialSubOrderItemData = [];
			
			var args = "";
			var refundTotal = 0;
			var index = 0;
			
			args += "mi:" + materialSubOrderItemPostData["materialSubOrder.msoId"] + ";"; // msoId
			args += "mn:" + materialSubOrderItemPostData["materialSubOrder.msoNo"] + ";"; // msoNo
			args += "ci:" + materialSubOrderItemPostData["materialSubOrder.customerId"] + ";"; // customerId
			args += "cn:" + materialSubOrderItemPostData["materialSubOrder.customerName"] + ";"; // customerName
			args += "t:rma;"; // type
			
			refundMaterialSubOrderData["approvalMaterialRefund.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];
			
			for(var i=0;i<refundMaterialSubOrderItemIdData.length;i++){
				var refundId = refundMaterialSubOrderItemIdData[i].split('_');
				var rowId = parseInt(refundId[1]);
				
				var fullTotalFlag = false;
				var fullFlags = [];
				var zeroFlags = [];
				
				var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
				
				if(materialSubOrderItem.isLeaf == "true"){
					var num = $("#"+rowId+"_cancel");
					var _num = parseFloat(num.val());
					var _originalNum = parseFloat(materialSubOrderItem.num);
					
					var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
					if(!numRex.test(_num)){
						num.focus().select();
						com.showAlert(com.warning, "总数输入内容格式错误!");
						return false;
					}else if(_num <= 0){
						num.focus().select();
						com.showAlert(com.warning, "总数数据需要大于零!");
						return false;
					}
					
					if(_num > _originalNum){
						num.focus().select();
						com.showAlert(com.warning, "退货总数不能超过原有总数!");
						return false;
					}
					
					fullTotalFlag = true;
					
					if(_num == materialSubOrderItem.num){
						deleteMaterialSubOrderItemData.push(rowId);
					}else{
						_num_ = utils.accSub(materialSubOrderItem.num, _num);
						updateMaterialSubOrderItemData.push([rowId, "num", _num_]);
						updateMaterialSubOrderItemData.push([rowId, "total", utils.accMul(_num_, materialSubOrderItem.price)]);
					}
					
					args += "i" + index + ":" + materialSubOrderItem.msoiId + ";n" + index + ":" + _num + ";it"+index+":0;";
					
					refundTotal = utils.accAdd(refundTotal, utils.accMul(_num, materialSubOrderItem.price));
					
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].msoiId"] = materialSubOrderItem.msoiId;
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].num"] = _num;
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].total"] = utils.accMul(_num, materialSubOrderItem.price);
					
					index++;
				}else{
					total = $("#"+rowId+"_cancel");
					_total = parseFloat(total.val());
					var _originalTotal = parseFloat(materialSubOrderItem.total);
					
					var totalRex = /^[0-9]+(\.[0-9]{1,3})?$/;
					if(!totalRex.test(_total)){
						total.focus().select();
						com.showAlert(com.warning, "总价输入内容格式错误!");
						return false;
					}
					if(_total <= 0){
						total.focus().select();
						com.showAlert(com.warning, "总价需要大于零!");
						return false;
					}
					
					if(_total > _originalTotal){
						total.focus().select();
						com.showAlert(com.warning, "退货总价不能超过原有总价!");
						return false;
					}else if(_total == _originalTotal){
						fullTotalFlag = true;
					}else{
						fullTotalFlag = false;
					}
					
					if(materialSubOrderItem.total != _total){
						updateMaterialSubOrderItemData.push([rowId, "total", utils.accSub(materialSubOrderItem.total, _total)]);
						packageFlag = false;
					}else{
						deleteMaterialSubOrderItemData.push(rowId);
					}
					
					refundTotal = utils.accAdd(refundTotal, _total);
				}
				
				while(true){
					rowId = rowId + 1;
					
					var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
					if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
						break;
					}
					
					num = $("#"+rowId+"_cancelItem");
					_num = parseFloat($("#"+rowId+"_cancelItem").val());
					
					_originalNum = parseFloat(item.num);
					
					var numRex =  /^[0-9]+(\.[0-9]{1,4})?$/;
					if(!numRex.test(_num)){
						num.focus().select();
						com.showAlert(com.warning, "总数输入内容格式错误!");
						return false;
					}
					
					if(_num < 0){
						num.focus().select();
						com.showAlert(com.warning, "总数数据需要大于零!");
						return false;
					}else if(_num == 0){
						zeroFlags.push(true);
					}else{
						zeroFlags.push(false);
					}
					
					if(_num > _originalNum){
						num.focus().select();
						com.showAlert(com.warning, "退货总数不能超过原有总数!");
						return false;
					}else if(_num == _originalNum){
						fullFlags.push(true);
					}else{
						fullFlags.push(false);
					}
					
					if(_num == item.num){
						deleteMaterialSubOrderItemData.push(rowId);
					}else{
						updateMaterialSubOrderItemData.push([rowId, "num", utils.accSub(item.num, _num)]);
						packageItemFlag = false;
					}
					
					args += "i" + index + ":" + item.msoiId + ";n" + index + ":" + $("#" + rowId + "_cancelItem").val() + ";it" + index + ":1;t" + index + ":" + _total + ";";
					
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].msoiId"] = item.msoiId;
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].num"] = $("#" + rowId + "_cancelItem").val();
					refundMaterialSubOrderData["approvalMaterialRefundItems[" + index + "].total"] = _total;
					
					index++;
				}
				
				if(zeroFlags.length > 0){
					var _zeroFlag = true;
					for(var j=0;j<zeroFlags.length;j++){
						_zeroFlag &= zeroFlags[j];
					}
					
					if(_zeroFlag){
						com.showAlert(com.warning, "套餐中,退货数量不能全部为零!");
						return false;
					}
				}
				
				var _fullFlag = true;
				for(var j=0;j<fullFlags.length;j++){
					_fullFlag &= fullFlags[j];
				}
				
				if(!!(_fullFlag ^ fullTotalFlag)){
					com.showAlert(com.warning, "套餐中,退货数量或总价为全退,请确保数量和总价都为全退!");
					return false;
				}
				
			}
			
			args += "in:" + index + ";";
			
			refundMaterialSubOrderItemArgs = args;
			
			$("#refundTotal").val(refundTotal);
			
			materialSubOrderDetail.rejectMaterialSubOrderModal.modal("show");
			
		});
		
		materialSubOrderDetail.refundCancelBtn.click(function(){
			
			for(var i=0;i<refundMaterialSubOrderItemIdData.length;i++){
				var refundId = refundMaterialSubOrderItemIdData[i].split('_');
				var rowId = parseInt(refundId[1]);
				
				cancelRowDataCancel(rowId);
			}
			
			materialSubOrderDetail.refundBtn.css("display", "block");
			materialSubOrderDetail.refundCommitBtn.css("display", "none");
			materialSubOrderDetail.refundCancelBtn.css("display", "none");
		});
	}, null, false);
});

function materialSubOrderItemListGridInit(){
	materialSubOrderDetail.listGrid.jqGrid({
		treeGrid: true,
		treeGridModel: 'adjacency',
		ExpandColumn: 'id',
		datastr: JSON.stringify(materialSubOrderItemData),
		datatype: "jsonstring",
	    rowNum : "-1",
	    height: "1000",
		colNames:['编号', 'id', 'msoiId', 'msoId', '名称', '品类', '品牌', '单位', '折扣价', '售价', '数量', '总价', '状态', '级别', '叶子', '结算值', '描述', '操作'],
		colModel:[
		    {name:'materialModelNo', editable:true, hidden:true},
		    {name:'id', hidden:true},
		    {name:'msoiId', hidden:true},
		    {name:'msoId', hidden:true},
		    {name:'materialModelName', width: 250, editable:true},
			{name:'materialTypeName', editable:true},
			{name:'materialBrandName', editable:true},
			{name:'measurementUnitName', editable:true},
			{name:'salePrice', editable:true},
			{name:'price', editable:true},
			{name:'num', editable: true},
			{name:'total', editable: true},
			{name:'status', hidden: true},
			{name:'level', hidden:true},
			{name:'isLeaf', hidden:true},
			{name:'prePoint'},
			{name:'des', width:100, align:"center", formatter: desInit},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		],
	    pager: "false",
		caption: "子项信息列表 <a><span id='refundBtn' class='ui-icon icon-remove white' style='width:60px;height:30px;top:12px;right:70px;cursor:pointer'>退货</span></a>" +
				"<a><span id='refundCommitBtn' class='ui-icon icon-remove green' style='width:60px;height:30px;top:12px;right:70px;cursor:pointer;display:none;'>确认</span></a>" +
				"<a><span id='refundCancelBtn' class='ui-icon icon-remove red' style='width:60px;height:30px;top:12px;right:120px;cursor:pointer;display:none;'>取消</span></a>" +
				"<a><span id='backBtn' class='ui-icon icon-mail-forward white' style='width:60px;height:30px;top:12px;right:20px;cursor:pointer'>返回</span></a>",
		jsonReader: {
	        root: "dataRows",
	        repeatitems : false
	    }, treeReader : {
	        level_field: "level",
	        parent_id_field: "parent",
	        leaf_field: "isLeaf",
	        expanded_field: "expanded"
	    }, ondblClickRow: function(id){
	    	
	    }, gridComplete: function(){
	    	$(".tree-minus").unbind();
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialSubOrderPageContent'});
	    },
	});
	
	materialSubOrderDetail.listGrid.navGrid(materialSubOrderDetail.gridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialSubOrderDetail.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		},
		position: "first",
	});
}

function desInit(cellvalue, options, rowdata){
	var des = rowdata.des;
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+des+'">备注</span>';
	html += "<input type='text' class='hide' value='"+des+"' />";
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	var _rowId = options.rowId;
	
	if(cellvalue == "edit"){
		result += '<div id="jSaveButton_' + _rowId + '" class="ui-pg-div ui-inline-save" onclick="saveRowData(' + _rowId + ');" style="float: left;" title="提交"><span class="ui-icon ui-icon-disk"></span></div>';
		result += '<div id="jCancelButton_' + _rowId + '" class="ui-pg-div ui-inline-cancel" onclick="cancleRowData(' + _rowId + ');" style="float: left;" title="取消"><span class="ui-icon ui-icon-cancel"></span></div>';
		return result;
	}else if(cellvalue == "restore"){
		result += materialSubOrderDetail._actionValue[_rowId];
		return result;
	}else if(cellvalue == "cancel"){
//		result += '<div id="jSaveButton_' + _rowId + '" class="ui-pg-div ui-inline-save" onclick="saveRowDataCancel(' + _rowId + ');" style="float: left;" title="提交"><span class="ui-icon ui-icon-disk"></span></div>';
//		result += '<div id="jCancelButton_' + _rowId + '" class="ui-pg-div ui-inline-cancel" onclick="cancelRowDataCancel(' + _rowId + ');" style="float: left;" title="取消"><span class="ui-icon ui-icon-cancel"></span></div>';
		result += '<input id="' + _rowId + '_cancel" class="editable" type="text" name="cancel" style="width: 40%;margin-left: 5px;" role="textbox" placeholder="总数">';
		return result;
	}else if(cellvalue == "cancelItem"){
		result += '<input id="' + _rowId + '_cancelItem" class="editable" type="text" name="cancelItem" style="width: 40%;margin-left: 5px;" role="textbox" placeholder="数量">';
		return result;
	}
	
	var depositStatus = materialSubOrderPostData["materialSubOrder.depositStatus"];
	var fullStatus = materialSubOrderPostData["materialSubOrder.fullStatus"];
	
	if(rowdata.level == 0 || cellvalue == "subItem"){
		result += '<div class="ui-pg-div btn-group">';
		if(fullStatus == 0){
			result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="editMaterialSubOrderItem('+ _rowId + ', ' + rowdata.level + ', ' + rowdata.isLeaf + ');">编辑</button>';
			result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="deleteMaterialSubOrderItem('+ _rowId + ', ' + rowdata.level + ', ' + rowdata.isLeaf + ');">删除</button>';
		}else if(fullStatus == 2 || fullStatus == 3){
			result += '<div class="ui-pg-div btn-group"><input id="refund_'+ _rowId + '_' + rowdata.level + '_' + rowdata.isLeaf + '" ident="'+ _rowId +'" name="refund" class="cbox ace" type="checkbox" role="checkbox"></div>';
		}
		result += '</div>';
	}else{
	}
	
	return result;
}

function saveData(){

}

function editMaterialSubOrderItem(rowId, level, isLeaf){
	console.log("editMaterialSubOrderItem");
	
	cancleRowData(_lastRowId);
	cancelRowDataCancel(_lastRowId);

	_lastRowId = rowId;
	
	materialSubOrderDetail.record[rowId] = true;
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(isLeaf){
		materialSubOrderDetail.listGrid.jqGrid('editRow', rowId, true);
		disabledInput(rowId);
		noColumnOpen(rowId);
		actionColumnOpen(rowId, materialSubOrderItem.action, "edit");
		autoInput(rowId, "materialModelNo", api.material.queryMaterialModelForAllByNo, api.material.queryMaterialModelById, ["materialModel.materialModelNo", "materialModelNo"]);
		autoInput(rowId, "materialModelName", api.material.queryMaterialModelForAllByName, api.material.queryMaterialModelById, ["materialModel.materialModelName", "materialModelName"]);
		
		disabledColumn(rowId, "total");
		
		$("#"+rowId+"_num").on("focusout", function(){
			$("#"+rowId+"_total").val(utils.accMul(parseFloat($("#"+rowId+"_price").val()), parseFloat($("#"+rowId+"_num").val())));
		});
	}else{
		
		materialSubOrderDetail.listGrid.jqGrid('editRow', rowId, true);
		disabledInput(rowId);
		noColumnOpen(rowId);
		actionColumnOpen(rowId, materialSubOrderItem.action, "edit");
		
		disabledColumn(rowId, "num");
		disabledColumn(rowId, "des");
		disabledColumn(rowId, "materialModelName");
		
		$("#"+rowId+"_num").on("focusout", function(){
			$("#"+rowId+"_total").val(utils.accMul(parseFloat($("#"+rowId+"_price").val()), parseFloat($("#"+rowId+"_num").val())));
		});
		
		while(true){
			rowId = rowId + 1;
			
			var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
			if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam', 'records')){
				break;
			}
			
			materialSubOrderDetail.record[rowId] = true;
			
			materialSubOrderDetail.listGrid.jqGrid('editRow', rowId, true);
			disabledInput(rowId);
			noColumnOpen(rowId);
			
			autoInput(rowId, "materialModelNo", api.material.queryMaterialModelForAllByNo, api.material.queryMaterialModelById, ["materialModel.materialModelNo", "materialModelNo"]);
			autoInput(rowId, "materialModelName", api.material.queryMaterialModelForAllByName, api.material.queryMaterialModelById, ["materialModel.materialModelName", "materialModelName"]);
			
			disabledColumn(rowId, "total");
			
			$("#"+rowId+"_num").on("focusout", function(){
				$("#"+rowId+"_total").val(utils.accMul(parseFloat($("#"+rowId+"_price").val()), parseFloat($("#"+rowId+"_num").val())));
			});
		}
	}
}

function cancelMaterialSubOrderItem(rowId, level, isLeaf){
	console.log("cancelMaterialSubOrderItem");
	
	cancleRowData(_lastRowId);
	cancelRowDataCancel(_lastRowId);
	
	_lastRowId = rowId;
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(isLeaf){
		actionColumnOpen(rowId, materialSubOrderItem.action, "cancel");
	}else{
		actionColumnOpen(rowId, materialSubOrderItem.action, "cancel");
		
		while(true){
			rowId = rowId + 1;
			
			var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
			if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
				break;
			}
			
			actionColumnOpen(rowId, materialSubOrderItem.action, "cancelItem");
		}
	}
}

function deleteMaterialSubOrderItem(rowId, level, isLeaf){

	var i = 0;
	var options = {};
	var rowIds = [];
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	options["msoId"] = materialSubOrderItem.msoId;
	options["msoiIds["+i+"]"] = materialSubOrderItem.msoiId;
	rowIds.push(rowId);
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		options["msoiIds["+i+"]"] = item.msoiId;
		rowIds.push(rowId);
		
		i++;
	}
	
	com.post(api.material.deleteMaterialSubOrderItem, options, function(result){
		com.showAlert(com.info, "数据删除成功!");
		if(result.redirect == 1 || result.redirect == "1"){
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		}else{
			for(var i=0;i<rowIds.length;i++){
				materialSubOrderDetail.listGrid.jqGrid("delRowData", rowIds[i]);
			}
		}
	}, function(result){
		com.showAlert(com.error, "数据删除失败!");
		materialSubOrderDetail.listGrid.trigger("reloadGrid");
	});
	
}

function disabledInput(id){
	for(var i=0;i<materialSubOrderDetail.disabledColumnNames.length;i++){
		var _id = "#" + id + "_" + materialSubOrderDetail.disabledColumnNames[i];
		$(_id).attr("disabled", "disabled");
	}
}

function saveRowData(rowId){
	console.log("saveRowData");
	
	var frowId = rowId;
	var excuteRowId = [];
	var saveFlags = [];
	
	var materialBrand = materialSubOrderItemPostData["materialSubOrder.materialBrand"]
	
	if(rowId < 0){
		return false;
	}
	
	var saveOldFlag = materialSubOrderDetail.record[_lastRowId];
	var saveFlag = materialSubOrderDetail.record[rowId];
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(materialSubOrderItem.isLeaf == "true"){
		
		if(materialBrand != $("#"+rowId+"_materialBrandName").val()){
			com.showAlert(com.error, "当前添加型号的品牌名称与订单不符,订单品牌为:"+materialBrand);
			return false;
		}
		
		var num = $("#"+rowId+"_num");
		var _num = parseFloat(num.val());
		var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!numRex.test(_num)){
			num.focus().select();
			com.showAlert(com.warning, "总数输入内容格式错误!");
			return false;
		}else if(_num <= 0){
			num.focus().select();
			com.showAlert(com.warning, "总数数据需要大于零!");
			return false;
		}
		
		saveFlags.push(materialSubOrderDetail.record[rowId]);
	}else{
		var materialModelNo = $("#"+rowId+"_materialModelNo");
		if(materialModelNo.val().length > 8){
			materialModelNo.focus().select();
			com.showAlert(com.warning, "套餐名称长度需要大于0小于8!");
			return false;
		}
		
		var total = $("#"+rowId+"_total");
		var _total = parseFloat(total.val());
		var totalRex = /^[0-9]+([.]{1}[0-9]{1,3})?$/;
		if(!totalRex.test(_total)){
			total.focus().select();
			com.showAlert(com.warning, "总价输入内容格式错误!");
			return false;
		}else if(_total <= 0){
			total.focus().select();
			com.showAlert(com.warning, "总价需要大于零!");
			return false;
		}
	}
	
	excuteRowId.push(rowId);
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		if(materialBrand != $("#"+rowId+"_materialBrandName").val()){
			com.showAlert(com.error, "当前添加型号的品牌名称与订单不符,订单品牌为:"+materialBrand);
			return false;
		}
		
		var num = $("#"+rowId+"_num");
		var _num = parseFloat(num.val());
		var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!numRex.test(_num)){
			num.focus().select();
			com.showAlert(com.warning, "总数输入内容格式错误!");
			return false;
		}else if(_num <= 0){
			num.focus().select();
			com.showAlert(com.warning, "总数需要大于零!");
			return false;
		}
		
		materialSubOrderDetail.listGrid.setCell(rowId, "materialModelNo", materialSubOrderDetail._noValue[rowId].replace("#1#", $("#"+rowId+"_materialModelNo").val()));
		materialSubOrderDetail._noValue[rowId] = "";
		
		excuteRowId.push(rowId);
		saveFlags.push(materialSubOrderDetail.record[rowId]);
	}
	
	materialSubOrderDetail.listGrid.setCell(frowId, "materialModelNo", materialSubOrderDetail._noValue[frowId].replace("#1#", $("#"+frowId+"_materialModelNo").val()));
	materialSubOrderDetail.listGrid.setCell(frowId, "action", "restore");
	
	for(var i=0;i<saveFlags.length;i++){
		saveFlag &= saveFlags[i];
	}
	
	if(saveFlag){
		for(var i=0;i<excuteRowId.length;i++){
			materialSubOrderDetail.listGrid.jqGrid("saveRow", excuteRowId[i]);
		}
		
		if(materialSubOrderItem.isLeaf == "true"){
			submitMaterialSubOrderItem(frowId);
		}else{
			submitMaterialSubOrderPackage(frowId);
		}
	}else{
		for(var i=0;i<excuteRowId.length;i++){
			materialSubOrderDetail.listGrid.jqGrid("restoreRow", excuteRowId[i]);
		}
	}
}

function saveRowDataCancel(rowId){
	console.log("saveRowDataCancel");
	
	if(rowId < 0){
		return false;
	}
	
	var prowId = rowId;
	var i = 0;
	var total = 0;
	var refundTotal = 0;
	var url = "";
	var type = "";
	var rowIds = [];
	var fullTotalFlag = false;
	var fullFlags = [];
	var zeroFlags = [];
	var packageFlag = true;
	var packageItemFlag = true;
	
	updateMaterialSubOrderItemData = [];
	
	var options = {};
	var args = "";
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	if(materialSubOrderItem.isLeaf == "true"){
		var num = $("#"+rowId+"_cancel");
		var _num = parseFloat(num.val());
		var _originalNum = parseFloat(materialSubOrderItem.num);
		
		var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!numRex.test(_num)){
			num.focus().select();
			com.showAlert(com.warning, "总数输入内容格式错误!");
			return false;
		}else if(_num <= 0){
			num.focus().select();
			com.showAlert(com.warning, "总数数据需要大于零!");
			return false;
		}
		
		if(_num > _originalNum){
			num.focus().select();
			com.showAlert(com.warning, "退货总数不能超过原有总数!");
			return false;
		}
		
		fullTotalFlag = true;
	}else{
		total = $("#"+rowId+"_cancel");
		_total = parseFloat(total.val());
		var _originalTotal = parseFloat(materialSubOrderItem.total);
		
		var totalRex = /^[0-9]+(\.[0-9]{1,3})?$/;
		if(!totalRex.test(_total)){
			total.focus().select();
			com.showAlert(com.warning, "总价输入内容格式错误!");
			return false;
		}
		if(_total <= 0){
			total.focus().select();
			com.showAlert(com.warning, "总价需要大于零!");
			return false;
		}
		
		if(_total > _originalTotal){
			total.focus().select();
			com.showAlert(com.warning, "退货总价不能超过原有总价!");
			return false;
		}else if(_total == _originalTotal){
			fullTotalFlag = true;
		}else{
			fullTotalFlag = false;
		}
	}
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		num = $("#"+rowId+"_cancelItem");
		_num = parseFloat($("#"+rowId+"_cancelItem").val());
		
		_originalNum = parseFloat(item.num);
		
		var numRex = /^[0-9]+(\.[0-9]{1,4})?$/;
		if(!numRex.test(_num)){
			num.focus().select();
			com.showAlert(com.warning, "总数输入内容格式错误!");
			return false;
		}
		
		if(_num < 0){
			num.focus().select();
			com.showAlert(com.warning, "总数数据需要大于零!");
			return false;
		}else if(_num == 0){
			zeroFlags.push(true);
		}else{
			zeroFlags.push(false);
		}
		
		if(_num > _originalNum){
			num.focus().select();
			com.showAlert(com.warning, "退货总数不能超过原有总数!");
			return false;
		}else if(_num == _originalNum){
			fullFlags.push(true);
		}else{
			fullFlags.push(false);
		}
		
		i++;
	}
	
	if(zeroFlags.length > 0){
		var _zeroFlag = true;
		for(var i=0;i<zeroFlags.length;i++){
			_zeroFlag &= zeroFlags[i];
		}
		
		if(_zeroFlag){
			com.showAlert(com.warning, "套餐中,退货数量不能全部为零!");
			return false;
		}
	}
	
	var _fullFlag = true;
	for(var i=0;i<fullFlags.length;i++){
		_fullFlag &= fullFlags[i];
	}
	
	if(!!(_fullFlag ^ fullTotalFlag)){
		com.showAlert(com.warning, "套餐中,退货数量或总价为全退,请确保数量和总价都为全退!");
		return false;
	}
	
	i = 0;
	rowId = prowId;
	
	options["msoId"] = materialSubOrderItem.msoId;
	
	args += "mi:" + materialSubOrderItem.msoId + ";"; // msoId
	args += "mn:" + materialSubOrderItemPostData["materialSubOrder.msoNo"] + ";"; // msoNo
	args += "ci:" + materialSubOrderItemPostData["materialSubOrder.customerId"] + ";"; // customerId
	args += "cn:" + materialSubOrderItemPostData["materialSubOrder.customerName"] + ";"; // customerName
	args += "t:rma;"; // type
	
	if(materialSubOrderItem.isLeaf == "true"){
		var num = $("#" + rowId + "_cancel");
		var _num = parseFloat(num.val());
		
		options["materialSubOrderItem.msoiId"] = materialSubOrderItem.msoiId;
		options["materialSubOrderItem.num"] = _num;
		args += "rt:0;"; // refundType
		args += "i:" + materialSubOrderItem.msoiId + ";"; // msoiId
		args += "n:" + _num + ";"; // num
		
		type = 0;
		url = api.material.refundMaterialSubOrderItemForModel.url;
		
		if(_num == materialSubOrderItem.num){
			rowIds.push(rowId);
		}else{
			_num_ = utils.accSub(materialSubOrderItem.num, _num);
			updateMaterialSubOrderItemData.push([rowId, "num", _num_]);
			updateMaterialSubOrderItemData.push([rowId, "total", utils.accMul(_num_, materialSubOrderItem.price)]);
		}
		packageItemFlag = false;
		
		refundTotal = utils.accAdd(utils.accMul(_num, materialSubOrderItem.price), refundTotal);
	}else{
		total = $("#"+rowId+"_cancel");
		_total = parseFloat(total.val());
		
		args += "rt:1;"; // refundType
		
		type = 1;
		url = api.material.refundMaterialSubOrderItemForPackage.url;
		if(materialSubOrderItem.total != _total){
			updateMaterialSubOrderItemData.push([rowId, "total", utils.accSub(materialSubOrderItem.total, _total)]);
			packageFlag = false;
		}else{
			rowIds.push(rowId);
		}
		
		refundTotal = utils.accAdd(_total, refundTotal);
	}
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam', 'records')){
			break;
		}
		
		num = $("#"+rowId+"_cancelItem");
		_num = parseFloat($("#"+rowId+"_cancelItem").val());
		
		_originalNum = item.num;
		
		materialSubOrderDetail.listGrid.setCell(rowId, "action", "empty");
		
		if(_num > 0){
			options["materialSubOrderItems["+i+"].msoiId"] = item.msoiId;
			options["materialSubOrderItems["+i+"].num"] = _num;
			options["materialSubOrderItems["+i+"].total"] = _total;
			
			args += "i" + i + ":" + item.msoiId + ";"; // msoiId
			args += "n" + i + ":" + _num + ";"; // num
			args += "t" + i + ":" + _total + ";"; // total
			
			i++;
		}
		
		if(_num == item.num){
			rowIds.push(rowId);
		}else{
			updateMaterialSubOrderItemData.push([rowId, "num", utils.accSub(item.num, _num)]);
			packageItemFlag = false;
		}
		
	}
	
	args += "in:" + i + ";";
	
	materialSubOrderDetail.listGrid.setCell(prowId, "action", "restore");
	
	if(packageItemFlag){
		rowIds.push(prowId);
	}
	
	options["materialSubOrder.msoNo"] = materialSubOrderItemPostData["materialSubOrder.msoNo"];
	options["materialSubOrder.customerId"] = materialSubOrderItemPostData["materialSubOrder.customerId"];
	options["materialSubOrder.customerName"] = materialSubOrderItemPostData["materialSubOrder.customerName"];
	options["deleteRowIds"] = rowIds;
	options["url"] = url;
	options["refundType"] = type;
	
	refundMaterialSubOrderItemData = options;
	refundMaterialSubOrderItemArgs = args;
	
	$("#refundTotal").val(refundTotal);
	
	materialSubOrderDetail.rejectMaterialSubOrderModal.modal("show");
	
	return false;
}

function saveRefundData(){
	
	com.clearValidator("#couponType", true);
	
	if(com.validate()){
		return;
	}
	
	var options = refundMaterialSubOrderItemData;
	
	var rowIds = options["deleteRowIds"];
	var url = options["url"];
	
	var refundTotal = $("#refundTotal");
	var refund = $("#refund");
	var refundDes = $("#refundDes");
	
	if(parseFloat(refund.val()) > parseFloat(refundTotal.val())){
		com.showTips(refund, "退款不能大于型号退款总金额.", true);
		return ;
	}
	
	options["materialSubOrder.refund"] = refund.val();
	options["materialSubOrder.refundDes"] = refundDes.val();
	
	refundMaterialSubOrderData["approval.receiverId"] = $("#approver").val();
	refundMaterialSubOrderData["approval.comment"] = refundDes.val();
	refundMaterialSubOrderData["approvalMaterialRefund.refund"] = refund.val();
	
	materialSubOrderDetail.saveRefundBtn.button('loading')
	
	com.post(api.approval.submitApprovalForMaterialRefund, refundMaterialSubOrderData, function(result){
		com.showAlert(com.info, "数据提交成功!");
		
		for(var i=0;i<refundMaterialSubOrderItemIdData.length;i++){
			var refundId = refundMaterialSubOrderItemIdData[i].split('_');
			var rowId = parseInt(refundId[1]);
			
			cancelRowDataCancel(rowId);
		}
		
		for(var i=0;i<deleteMaterialSubOrderItemData.length;i++){
			materialSubOrderDetail.listGrid.jqGrid("delRowData", deleteMaterialSubOrderItemData[i]);
		}
		
		for(var i=0;i<updateMaterialSubOrderItemData.length;i++){
			var updateItem = updateMaterialSubOrderItemData[i];
			materialSubOrderDetail.listGrid.jqGrid('setCell', updateItem[0], updateItem[1], updateItem[2]);
		}
		
		materialSubOrderDetail.refundBtn.css("display", "block");
		materialSubOrderDetail.refundCommitBtn.css("display", "none");
		materialSubOrderDetail.refundCancelBtn.css("display", "none");
		
		materialSubOrderDetail.saveRefundBtn.button('reset');
		materialSubOrderDetail.rejectMaterialSubOrderModal.modal("hide");
	}, function(result){
		com.showAlert(com.error, result);
		
		materialSubOrderDetail.saveRefundBtn.button('reset');
		materialSubOrderDetail.listGrid.trigger("reloadGrid");
	});
}

function cancleRowData(rowId){
	console.log("cancleRowData");
	
	if(rowId < 0){
		return false;
	}
	
	materialSubOrderDetail.listGrid.jqGrid("restoreRow", rowId);
	materialSubOrderDetail.listGrid.jqGrid("saveRow", rowId);
	
	materialSubOrderDetail.listGrid.setCell(rowId, "action", "restore");
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		materialSubOrderDetail.listGrid.jqGrid("restoreRow", rowId);
		materialSubOrderDetail.listGrid.jqGrid("saveRow", rowId);
	}
}

function cancelRowDataCancel(rowId){
	console.log("cancelRowDataCancel");
	
	if(rowId < 0){
		return false;
	}
	
	materialSubOrderDetail.listGrid.setCell(rowId, "action", "restore");
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		materialSubOrderDetail.listGrid.setCell(rowId, "action", "empty");
	}
}

function noColumnOpen(rowId){
	var materialModelNoValue = $("#"+rowId+"_materialModelNo");
	var _noValue = materialModelNoValue.val();
	var _replacestr = '">' + materialModelNoValue.parent()[0].title + '</';
	
	materialSubOrderDetail._noValue[rowId] = _noValue.replace(_replacestr, '">#1#</');
	materialModelNoValue.val(materialModelNoValue.parent()[0].title);
}

function autoInput(rowId, rowName, urls, url, args){
	$("#"+rowId+"_"+rowName).typeahead({
		url: urls.url,
	    source: function (query, process) {
	        var options = {};
	        options[args[0]] = query;
	        if(typeof this.options.url !== "string")
	        	com.showAlert(com.error, "the autoFillText has no any url.");
	        com.post(urls, options, function(data){
	        	var materialModels = data.materialModels;
	        	autoFillList = [];
	        	autoFillNameList = [];
        		for(var i=0;i<materialModels.length;i++){
        			autoFillList[i] = materialModels[i][args[1]];
        			autoFillNameList[i] = materialModels[i].mmId;
        		}
	        	process(autoFillList);
	        });
	    },
	    matcher: function (item) {
	        return true;
	    }
	}).attr("autocomplete", "off").on("change", function(){
		var options = {};
		var mmId = autoFillNameList[autoFillList.indexOf($(this).val())];
		
		if(mmId == 0 || undefined == mmId){
			return false;
		}else{
			options["materialModel.mmId"] = mmId;
		}
		
		com.post(url, options, function(data){
			for(var i=0;i<materialSubOrderDetail.columnNames.length;i++){
				var _id = "#" + rowId + "_" + materialSubOrderDetail.columnNames[i];
				var _materialModel = data.materialModel;
				$(_id).val(_materialModel[materialSubOrderDetail.columnNames[i]]);
			}
		}, function(data){
			com.showAlert(com.error, "获取数据失败!");
		});
		
		materialSubOrderDetail.record[rowId] = true;
	}).on("keydown", function(){
		materialSubOrderDetail.record[rowId] = false;
	});
}

function noColumnActionToNull(rowId){
	$("#"+rowId+" > td[aria-describedby='listGrid_materialModelNo'] > div > div").unbind();
}

function actionColumnOpen(rowId, actionValue, action){
	materialSubOrderDetail._actionValue[rowId] = actionValue;
	$("#"+rowId+"_action").val();
	materialSubOrderDetail.listGrid.setCell(rowId, "action", action);
}

function disabledColumn(rowId, columnName){
	$("#"+rowId+"_"+columnName).attr("disabled", "disabled");
}

function submitMaterialSubOrderItem(rowId){
	console.log("submitMaterialSubOrderItem");
	
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	var options = {};
	options["materialSubOrderItem.msoiId"] = materialSubOrderItem.msoiId;
	options["materialSubOrderItem.materialModelNo"] = $("#"+rowId+" > td[aria-describedby='listGrid_materialModelNo'] > span").text();
	options["materialSubOrderItem.materialModelName"] = materialSubOrderItem.materialModelName;
	options["materialSubOrderItem.materialTypeName"] = materialSubOrderItem.materialTypeName;
	options["materialSubOrderItem.materialBrandName"] = materialSubOrderItem.materialBrandName;
	options["materialSubOrderItem.measurementUnitName"] = materialSubOrderItem.measurementUnitName;
	
	options["materialSubOrderItem.num"] = materialSubOrderItem.num;
	options["materialSubOrderItem.total"] = materialSubOrderItem.total;
//	options["materialSubOrderItem.des"] = materialSubOrderItem.des;
	
	options["materialSubOrder.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];
	
	com.post(api.material.updateMaterialSubOrderItemForModel, options, function(result){
		com.showAlert(com.info, "数据提交成功!");
	}, function(result){
		com.showAlert(com.error, "数据提交失败!");
	});
	
	return false;
}

function submitMaterialSubOrderPackage(rowId){
	console.log("submitMaterialSubOrderPackage");
	
	var options = {};
	var materialSubOrderItem = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
	
	var packageName = $("#"+rowId+" > td[aria-describedby='listGrid_materialModelNo'] > span").text();
	var total = materialSubOrderItem.total;
	
	var i = 0;
	
	while(true){
		rowId = rowId + 1;
		
		var item = materialSubOrderDetail.listGrid.jqGrid('getRowData', rowId);
		if(item.level == 0 && item.isLeaf || rowId > materialSubOrderDetail.listGrid.jqGrid('getGridParam','records')){
			break;
		}
		
		options["materialSubOrderItems["+i+"].msoiId"] = item.msoiId;
		options["materialSubOrderItems["+i+"].materialModelNo"] = $("#"+rowId+" > td[aria-describedby='listGrid_materialModelNo'] > span").text();
		options["materialSubOrderItems["+i+"].materialModelName"] = item.materialModelName;
		options["materialSubOrderItems["+i+"].materialTypeName"] = item.materialTypeName;
		options["materialSubOrderItems["+i+"].materialBrandName"] = item.materialBrandName;
		options["materialSubOrderItems["+i+"].measurementUnitName"] = item.measurementUnitName;
		
		options["materialSubOrderItems["+i+"].packageName"] = packageName;
		options["materialSubOrderItems["+i+"].num"] = item.num;
		options["materialSubOrderItems["+i+"].total"] = total;
//		options["materialSubOrderItems["+i+"].des"] = item.des;
		
		i++;
	}
	
	options["materialSubOrder.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];
	
	com.post(api.material.updateMaterialSubOrderItemForPackage, options, function(result){
		com.showAlert(com.info, "数据提交成功!");
	}, function(result){
		com.showAlert(com.error, "数据提交失败!");
	});
}
