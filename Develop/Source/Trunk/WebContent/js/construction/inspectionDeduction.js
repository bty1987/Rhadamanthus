var deduction = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	deductionItems: {},
	
	editFlag: false,
	repeatFlg: false,
};

var deductionData = [
	{"orderId":"D2193C022B046", "villageName":"鑫丰雍景豪城12#1-1-1", "customerName":"刘文伟", "designDepartment":"设计一部", "designerName":"李丽", "salesmanDepartment":"一部", "salesmanName":"王涛", "houseArea":"160", "houseStyle":"欧式", "measureTime":"2014-08-15", "status":"量房", "schedule":"1", "time":"2014-09-01", "money":"156", "comment":"卫生不合格"}
];

jQuery(function($) {
	$('#fl-statement').statement("巡检控制", "扣款信息列表");
	
	deduction.deductionListGrid = $("#deductionListGrid");
	deduction.deductionGridPager = "#deductionGridPager";
	deduction.saveBtn = $("#saveBtn").on("click", saveData);
	deduction.cancelBtn = $("#cancelBtn");
	deduction.modal = $("#deductionModal");
	
	deduction.deductionItems.orderId = $("#orderId");
	deduction.deductionItems.orderAddr = $("#orderAddr");
	deduction.deductionItems.deductionMoney = $("#deductionMoney");
	deduction.deductionItems.deductionTime = $("#deductionTime");
	deduction.deductionItems.deductionDes = $("#deductionDes");
	
	deduction.deductionListGrid.jqGrid({
		url: api.construction.pageInspectionDeductionByOrderId.url,
		postData: inspectionPostData,
		colNames:['Id', '订单编号', '楼盘地址', '时间', '金额', '备注'],
		colModel:[
		    {name:'idId', hidden:true},
		    {name:'orderId'},
			{name:'orderAddr'},
			{name:'deductionTime'},
			{name:'deductionMoney'},
			{name:'deductionDes'},
		], 
		pager : deduction.deductionGridPager,
		caption: "扣款信息列表"
	});
	
	deduction.deductionListGrid.navGrid(deduction.deductionGridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(deduction.deductionGridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			deduction.editFlag = true;
			var num = deduction.deductionListGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_deductionListGrid",{gbox:"#gbox_"+deduction.deductionListGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			
			var row = deduction.deductionListGrid.jqGrid("getRowData", num);
			
			deduction.deductionItems.orderId.val(row.orderId);
			deduction.deductionItems.orderAddr.val(row.orderAddr);
			deduction.deductionItems.deductionMoney.val(row.deductionMoney);
			deduction.deductionItems.deductionTime.val(row.deductionTime);
			deduction.deductionItems.deductionDes.val(row.deductionDes);
			inspectionPostData["inspectionDeduction.idId"] = row.idId;
			
			deduction.deductionItems.orderId.attr('disabled', true);
			deduction.deductionItems.orderAddr.attr('disabled', true);
			
			deduction.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(deduction.deductionGridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			deduction.editFlag = false;
			com.cleanItems(deduction.deductionItems);
			
			deduction.deductionItems.orderId.val(inspectionPostData["inspectionDeduction.orderId"]);
			deduction.deductionItems.orderAddr.val(inspectionPostData["inspectionDeduction.orderAddr"]);
			
			deduction.deductionItems.orderId.attr("disabled", true);
			deduction.deductionItems.orderAddr.attr("disabled", true);
			
			deduction.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(deduction.deductionGridPager, {
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
	
});

function saveData(){
	if(com.validate()|| deduction.repeatFlg)
		return;
	
	var url;
	var options = {
		"inspectionDeduction.orderId": deduction.deductionItems.orderId.val(),
		"inspectionDeduction.orderAddr": deduction.deductionItems.orderAddr.val(),
		"inspectionDeduction.deductionMoney": deduction.deductionItems.deductionMoney.val(),
		"inspectionDeduction.deductionTime": deduction.deductionItems.deductionTime.val(),
		"inspectionDeduction.deductionDes": deduction.deductionItems.deductionDes.val(),
	};
	
	if(deduction.editFlag){
		
		url = api.construction.updateInspectionDeduction;
		options["inspectionDeduction.idId"] = inspectionPostData["inspectionDeduction.idId"];
		
	}else{
		url = api.construction.addInspectionDeduction;
	}
	
	com.post(url, options, successCallback, failCallback);
	deduction.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["idIds[" + i + "]"] = row.idId;
	}
	
	com.post(api.construction.deleteInspectionDeduction, options, successCallback, failCallback);
	
	$("#eData").trigger("click");
}

function successCallback(result){
	deduction.deductionListGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}