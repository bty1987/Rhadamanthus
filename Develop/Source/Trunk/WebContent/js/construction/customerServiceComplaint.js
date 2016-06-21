var complaint = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	complaintItems: {},
	
	levelDict: {"0":"普通", "1":"重要"},
	typeDict: {"0":"装修", "1":"主材"},
	
	editFlag: false,
	repeatFlg: false,
};

jQuery(function($) {
	$('#fl-statement').statement("客服控制", "投诉信息列表");
	
	complaint.complaintListGrid = $("#complaintListGrid");
	complaint.complaintGridPager = "#complaintGridPager";
	complaint.saveBtn = $("#saveBtn").on("click", saveData);
	complaint.cancelBtn = $("#cancelBtn");
	complaint.saveHandleBtn = $("#saveHandleBtn").on("click", saveHandleData);
	complaint.canceHandlelBtn = $("#cancelBtn");
	complaint.modal = $("#complaintModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});;
	complaint.handleModal = $("#complaintHandleModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});;
	
	complaint.complaintItems.orderId = $("#orderId");
	complaint.complaintItems.customerName = $("#customerName");
	complaint.complaintItems.complaintLevel = $("#complaintLevel");
	complaint.complaintItems.complaintTime = $("#complaintTime");
	complaint.complaintItems.complaintDes = $("#complaintDes");
	
	complaint.complaintItems.handleOrderId = $("#handleOrderId");
	complaint.complaintItems.handleCustomerName = $("#handleCustomerName");
	complaint.complaintItems.handleComplaintLevel = $("#handleComplaintLevel");
	complaint.complaintItems.handleComplaintType = $("#handleComplaintType");
	complaint.complaintItems.complaintHandleDes = $("#complaintHandleDes");
	
	complaint.complaintListGrid.jqGrid({
		url: api.construction.pageCustomerServiceComplaint.url,
		postData: customerServicePostData,
		colNames:['Id', '订单编号', '客户名', '创建人Id', '创建人', '操作人Id', '操作人', '等级', '等级', '类型', '类型', '时间', '备注', '状态', '处理信息', '操作'],
		colModel:[
		    {name:'cscId', hidden:true},
		    {name:'orderId'},
			{name:'customerName'},
			{name:'createrId', hidden:true},
			{name:'createrName'},
			{name:'operaterId', hidden:true},
			{name:'operaterName', formatter: operaterNameInit},
			{name:'complaintLevel', hidden:true},
			{name:'showComplaintLevel', formatter: levelInit},
			{name:'complaintType', hidden:true},
			{name:'showComplaintType', formatter: typeInit},
			{name:'complaintTime'},
			{name:'complaintDes'},
			{name:'complaintStatus', hidden:true},
			{name:'complaintHandle', hidden:true},
			{name:'action', formatter: actionInit},
		], 
		pager : complaint.complaintGridPager,
		caption: "投诉信息列表"
	});
	
	complaint.complaintListGrid.navGrid(complaint.complaintGridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	)
//	.navButtonAdd(complaint.complaintGridPager,{
//		caption: "",
//		buttonicon: "icon-pencil blue",
//		title: "编辑",
//		onClickButton: function(){
//			complaint.editFlag = true;
//			var num = complaint.complaintListGrid.jqGrid("getGridParam", 'selrow');
//			
//			if(num == null){
//				$.jgrid.viewModal("#alertmod_complaintListGrid",{gbox:"#gbox_"+complaint.complaintListGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
//				return;
//			}
//			
//			var complaintLevelId = 0;
//			
//			var row = complaint.complaintListGrid.jqGrid("getRowData", num);
//			
//			$.each(complaint.levelDict, function(key) {
//			    if(row.complaintLevel.indexOf(complaint.levelDict[key]) != -1){
//			    	complaintLevelId = key;
//			    }
//			});
//			
//			complaint.complaintItems.orderId.val(row.orderId);
//			complaint.complaintItems.customerName.val(row.customerName);
//			complaint.complaintItems.complaintLevel.val(complaintLevelId);
//			complaint.complaintItems.complaintTime.val(row.complaintTime);
//			complaint.complaintItems.complaintDes.val(row.complaintDes);
//			customerServicePostData["customerServiceComplaint.cscId"] = row.cscId;
//			
//			complaint.complaintItems.orderId.attr('disabled', true);
//			complaint.complaintItems.customerName.attr('disabled', true);
//			complaint.complaintItems.complaintTime.attr("disabled", true);
//			
//			complaint.modal.modal("show");
//		},
//		position: "first",
//	})
	.navButtonAdd(complaint.complaintGridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			complaint.editFlag = false;
			com.cleanItems(complaint.complaintItems);
			
			complaint.complaintItems.orderId.val(customerServicePostData["customerServiceComplaint.orderId"]);
			complaint.complaintItems.customerName.val(customerServicePostData["customerServiceComplaint.customerName"]);
			
			complaint.complaintItems.orderId.attr("disabled", true);
			complaint.complaintItems.customerName.attr("disabled", true);
			complaint.complaintItems.complaintTime.attr("disabled", false);
			
			complaint.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(complaint.complaintGridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			com.switchPage(api.index.customerServiceIndex.url);
		},
		position: "first",
	});
	
	$('.date-picker').datepicker({autoclose:true});
	
});

function levelInit(cellvalue, options, rowdata){
	
	var result = '';
	
	var level = complaint.levelDict[rowdata.complaintLevel];
	
	if(rowdata.complaintLevel == 0){
		result += "<span class='label label-warning'>" + level + "</span>";
	}else if(rowdata.complaintLevel == 1){
		result += "<span class='label label-danger'>" + level + "</span>";
	}
	
	return result;
}

function typeInit(cellvalue, options, rowdata){
	return complaint.typeDict[rowdata.complaintType];;
}

function operaterNameInit(cellvalue, options, rowdata){
	
	if(cellvalue == ""){
		return "-";
	}else{
		return cellvalue;
	}
}

function actionInit(cellvalue, options, rowdata){
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="dialogCustomerServiceComplaintHandle(' + options.rowId  + ');">处理</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	if(com.validate()|| complaint.repeatFlg)
		return;
	
	var url;
	var options = {
		"customerServiceComplaint.orderId": complaint.complaintItems.orderId.val(),
		"customerServiceComplaint.customerName": complaint.complaintItems.customerName.val(),
		"customerServiceComplaint.complaintLevel": complaint.complaintItems.complaintLevel.val(),
		"customerServiceComplaint.complaintTime": complaint.complaintItems.complaintTime.val(),
		"customerServiceComplaint.complaintDes": complaint.complaintItems.complaintDes.val(),
	};
	
	if(complaint.editFlag){
		
		url = api.construction.updateCustomerServiceComplaint;
		options["customerServiceComplaint.cscId"] = customerServicePostData["customerServiceComplaint.cscId"];
		
	}else{
		url = api.construction.addCustomerServiceComplaint;
	}
	
	com.post(url, options, successCallback, failCallback);
	complaint.modal.modal("hide");
}

function saveHandleData(){
	if(com.validate())
		return;
	
	if(customerServicePostData["customerServiceComplaint.complaintStatus"] == "1"){
		complaint.handleModal.modal("hide");
		return false;
	}
	
	var url = api.construction.handleCustomerServiceComplaint.url;
	var options = {
		"customerServiceComplaint.cscId": customerServicePostData["customerServiceComplaint.cscId"],
		"customerServiceComplaint.complaintHandle": complaint.complaintItems.complaintHandleDes.val(),
	};
	
	com.post(url, options, successCallback, failCallback);
	complaint.handleModal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["cscIds[" + i + "]"] = row.cscId;
	}
	
	com.post(api.construction.deleteCustomerServiceComplaint, options, successCallback, failCallback);
	
	$("#eData").trigger("click");
}

function dialogCustomerServiceComplaintHandle(rowId){
	com.cleanItems(complaint.complaintItems);
	
	var row = complaint.complaintListGrid.jqGrid("getRowData", rowId);
	
	customerServicePostData["customerServiceComplaint.cscId"] = row.cscId;
	customerServicePostData["customerServiceComplaint.complaintStatus"] = row.complaintStatus;
	
	complaint.complaintItems.handleOrderId.val(row.orderId).attr('disabled', true);
	complaint.complaintItems.handleCustomerName.val(row.customerName).attr('disabled', true);
	complaint.complaintItems.handleComplaintLevel.val(row.complaintLevel).attr('disabled', true);
	complaint.complaintItems.handleComplaintType.val(row.complaintType).attr('disabled', true);
	complaint.complaintItems.complaintHandleDes.val(row.complaintHandle);
	
	if(row.complaintStatus == "1"){
		complaint.complaintItems.complaintHandleDes.attr("disabled", true);
	}else{
		complaint.complaintItems.complaintHandleDes.attr("disabled", false);
	}
	
	complaint.handleModal.modal("show");
}

function successCallback(result){
	complaint.complaintListGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}