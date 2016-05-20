var record = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	recordItems: {},
	
	editFlag: false,
	repeatFlg: false,
};

jQuery(function($) {
	$('#fl-statement').statement("巡检控制", "记录信息列表");
	
	record.recordListGrid = $("#recordListGrid");
	record.recordGridPager = "#recordGridPager";
	record.saveBtn = $("#saveBtn").on("click", saveData);
	record.cancelBtn = $("#cancelBtn");
	record.modal = $("#recordModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	record.recordItems.orderId = $("#orderId");
	record.recordItems.orderAddr = $("#orderAddr");
	record.recordItems.startDate = $("#startDate");
	record.recordItems.startTime = $("#startTime");
	record.recordItems.endDate = $("#endDate");
	record.recordItems.endTime = $("#endTime");
	record.recordItems.recordDes = $("#recordDes");
	
	record.recordListGrid.jqGrid({
		url: api.construction.pageInspectionRecordByOrderId.url,
		postData: inspectionPostData,
		colNames:['Id', '订单编号', '楼盘名', '操作人Id', '操作人', '开始时间', '结束时间', '信息'],
		colModel:[
		    {name:'irId', hidden:true},
		    {name:'orderId'},
			{name:'orderAddr'},
			{name:'operaterId', hidden:true},
			{name:'operaterName'},
			{name:'startTime'},
			{name:'endTime'},
			{name:'recordDes'},
		],
		pager : record.recordGridPager,
		caption: "记录信息列表"
	});
	
	record.recordListGrid.navGrid(record.recordGridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	)
//	.navButtonAdd(record.recordGridPager,{
//		caption: "",
//		buttonicon: "icon-pencil blue",
//		title: "编辑",
//		onClickButton: function(){
//			record.editFlag = true;
//			var num = record.recordListGrid.jqGrid("getGridParam", 'selrow');
//			
//			if(num == null){
//				$.jgrid.viewModal("#alertmod_recordListGrid",{gbox:"#gbox_"+record.recordListGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
//				return;
//			}
//			
//			var row = record.recordListGrid.jqGrid("getRowData", num);
//			
//			record.recordItems.orderId.val(row.orderId);
//			record.recordItems.orderAddr.val(row.orderAddr);
//			record.recordItems.recordTime.val(row.recordTime);
//			record.recordItems.recordDes.val(row.recordDes);
//			inspectionPostData["inspectionRecord.irId"] = row.irId;
//			
//			record.recordItems.orderId.attr('disabled', true);
//			record.recordItems.orderAddr.attr('disabled', true);
//			
//			record.modal.modal("show");
//		},
//		position: "first",
//	})
	.navButtonAdd(record.recordGridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			record.editFlag = false;
			
			com.cleanItems(record.recordItems);
			
			record.recordItems.orderId.val(inspectionPostData["inspectionRecord.orderId"]);
			record.recordItems.orderAddr.val(inspectionPostData["inspectionRecord.orderAddr"]);
			
			record.recordItems.orderId.attr('disabled', true);
			record.recordItems.orderAddr.attr('disabled', true);
			
			record.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(record.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.inspectionIndex.url);
		},
		position: "first",
	});
	
	$('.date-picker').datepicker({autoclose:true});
	record.recordItems.startTime.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
	record.recordItems.endTime.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
	
});

function saveData(){
	if(com.validate() || record.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"inspectionRecord.orderId": record.recordItems.orderId.val(),
		"inspectionRecord.orderAddr": record.recordItems.orderAddr.val(),
		"inspectionRecord.startTime": record.recordItems.startDate.val() + " " + record.recordItems.startTime.val(),
		"inspectionRecord.endTime": record.recordItems.endDate.val() + " " + record.recordItems.endTime.val(),
		"inspectionRecord.recordDes": record.recordItems.recordDes.val(),
	};
	
	if(options["inspectionRecord.startTime"] > options["inspectionRecord.endTime"]){
		com.showAlert(com.warning, "开始时间需要小于结束时间");
		return false;
	}
	
	if(record.editFlag){
		url = api.construction.updateInspectionRecord;
		options["inspectionRecord.irId"] = inspectionPostData["inspectionRecord.irId"];
	}else{
		url = api.construction.addInspectionRecord;
	}
	
	com.post(url, options, successCallback, failCallback);
	record.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["irIds[" + i + "]"] = row.irId;
	}
	
	com.post(api.construction.deleteInspectionRecord, options, successCallback, failCallback);
	$("#eData").trigger("click");
}

function successCallback(result){
	record.recordListGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}