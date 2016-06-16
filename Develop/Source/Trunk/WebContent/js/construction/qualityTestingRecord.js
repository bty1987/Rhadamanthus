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
	$('#fl-statement').statement("质检控制", "记录信息列表");
	
	record.recordListGrid = $("#recordListGrid");
	record.recordGridPager = "#recordGridPager";
	record.saveBtn = $("#saveBtn").on("click", saveData);
	record.cancelBtn = $("#cancelBtn");
	record.modal = $("#recordModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});;
	
	record.recordItems.orderId = $("#orderId");
	record.recordItems.orderAddr = $("#orderAddr");
	record.recordItems.recordDate = $("#recordDate");
	record.recordItems.recordTime = $("#recordTime");
	record.recordItems.recordDes = $("#recordDes");
	
	record.recordListGrid.jqGrid({
		url: api.construction.pageInspectionRecordByOrderId.url,
		postData: qualityTestingPostData,
		colNames:['Id', '订单编号', '楼盘名', '操作人Id', '操作人', '时间', '信息'],
		colModel:[
		    {name:'qtrId', hidden:true},
		    {name:'orderId'},
			{name:'orderAddr'},
			{name:'operaterId', hidden:true},
			{name:'operaterName'},
			{name:'recordTime'},
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
//			qualityTestingPostData["inspectionRecord.irId"] = row.irId;
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
			
			record.recordItems.orderId.val(qualityTestingPostData["qualityTestingRecord.orderId"]);
			record.recordItems.orderAddr.val(qualityTestingPostData["qualityTestingRecord.orderAddr"]);
			
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
			$("#fl-container").load(api.index.qualityTestingIndex.url);
		},
		position: "first",
	});
	
	$('.date-picker').datepicker({autoclose:true});
	$('#recordTime').timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
	
});

function saveData(){
	if(com.validate()|| record.repeatFlg)
		return;
	
	var url;
	var options = {
		"qualityTestingRecord.orderId": record.recordItems.orderId.val(),
		"qualityTestingRecord.orderAddr": record.recordItems.orderAddr.val(),
		"qualityTestingRecord.recordTime": record.recordItems.recordDate.val() + " " + record.recordItems.recordTime.val(),
		"qualityTestingRecord.recordDes": record.recordItems.recordDes.val(),
	};
	
	if(record.editFlag){
		
		url = api.construction.updateInspectionRecord;
		options["qualityTestingRecord.qtrId"] = qualityTestingPostData["qualityTestingRecord.qtrId"];
		
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