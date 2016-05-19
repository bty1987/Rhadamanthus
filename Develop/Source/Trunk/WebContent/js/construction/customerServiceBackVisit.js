var backVisit = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	backVisitItems: {},
	
	levelDict: {"0":"普通", "1":"重要"},
	
	backVisitTypeData: [{"id":"1", "name":"普通"}],
	
	editFlag: false,
	repeatFlg: false,
};

jQuery(function($) {
	$('#fl-statement').statement("巡检控制", "保修信息列表");
	
	backVisit.backVisitListGrid = $("#backVisitListGrid");
	backVisit.backVisitGridPager = "#backVisitGridPager";
	backVisit.saveBtn = $("#saveBtn").on("click", saveData);
	backVisit.cancelBtn = $("#cancelBtn");
	backVisit.modal = $("#backVisitModal");
	
	backVisit.backVisitItems.orderId = $("#orderId");
	backVisit.backVisitItems.orderAddr = $("#orderAddr");
	backVisit.backVisitItems.customerName = $("#customerName");
	backVisit.backVisitItems.backVisitTime = $("#backVisitTime");
	backVisit.backVisitItems.backVisitType = $("#backVisitType");
	backVisit.backVisitItems.backVisitDes = $("#backVisitDes");
	
	backVisit.backVisitItems.backVisitType.bindData(backVisit.backVisitTypeData, "id", "name", false);
	
	backVisit.backVisitListGrid.jqGrid({
		url: api.construction.pageCustomerServiceBackVisit.url,
		postData: customerServicePostData,
		colNames:['Id', '订单编号', '楼盘地址', '客户名', '时间', '类型', '类型', '备注'],
		colModel:[
		    {name:'csbvId', hidden:true},
		    {name:'orderId'},
		    {name:'orderAddr'},
			{name:'customerName'},
			{name:'backVisitTime'},
			{name:'backVisitType', hidden:true},
			{name:'backVisitTypeShow', formatter: typeInit},
			{name:'backVisitDes'},
		], 
		pager : backVisit.backVisitGridPager,
		caption: "保修信息列表"
	});
	
	backVisit.backVisitListGrid.navGrid(backVisit.backVisitGridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(backVisit.backVisitGridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			backVisit.editFlag = true;
			var num = backVisit.backVisitListGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_backVisitListGrid",{gbox:"#gbox_"+backVisit.backVisitListGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			
			var row = backVisit.backVisitListGrid.jqGrid("getRowData", num);
			
			backVisit.backVisitItems.orderId.val(customerServicePostData["customerServiceBackVisit.orderId"]);
			backVisit.backVisitItems.orderAddr.val(customerServicePostData["customerServiceBackVisit.orderAddr"]);
			backVisit.backVisitItems.customerName.val(customerServicePostData["customerServiceBackVisit.customerName"]);
			backVisit.backVisitItems.backVisitTime.val(row.backVisitTime);
			backVisit.backVisitItems.backVisitType.val(row.backVisitType);
			backVisit.backVisitItems.backVisitDes.val(row.backVisitDes);
			customerServicePostData["customerServiceBackVisit.csbvId"] = row.csbvId;
			
			backVisit.backVisitItems.orderId.attr('disabled', true);
			backVisit.backVisitItems.orderAddr.attr("disabled", true);
			backVisit.backVisitItems.customerName.attr('disabled', true);
			
			backVisit.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(backVisit.backVisitGridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			backVisit.editFlag = false;
			com.cleanItems(backVisit.backVisitItems);
			
			backVisit.backVisitItems.orderId.val(customerServicePostData["customerServiceBackVisit.orderId"]);
			backVisit.backVisitItems.orderAddr.val(customerServicePostData["customerServiceBackVisit.orderAddr"]);
			backVisit.backVisitItems.customerName.val(customerServicePostData["customerServiceBackVisit.customerName"]);
			
			backVisit.backVisitItems.orderId.attr("disabled", true);
			backVisit.backVisitItems.orderAddr.attr("disabled", true);
			backVisit.backVisitItems.customerName.attr("disabled", true);
			
			backVisit.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(backVisit.backVisitGridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.customerServiceIndex.url);
		},
		position: "first",
	});
	
	$('.date-picker').datepicker({autoclose:true});
	
});

function typeInit(cellvalue, options, rowdata){
	
	var result = "";
	
	for(var i=0;i<backVisit.backVisitTypeData.length;i++){
		if(rowdata["backVisitType"] == backVisit.backVisitTypeData[i]["id"]){
			result = backVisit.backVisitTypeData[i]["name"];
		}
	}
	
	return result;
}

function saveData(){
	if(com.validate()|| backVisit.repeatFlg)
		return;
	
	var url;
	var options = {
		"customerServiceBackVisit.orderId": backVisit.backVisitItems.orderId.val(),
		"customerServiceBackVisit.orderAddr": backVisit.backVisitItems.orderAddr.val(),
		"customerServiceBackVisit.customerName": backVisit.backVisitItems.customerName.val(),
		"customerServiceBackVisit.backVisitTime": backVisit.backVisitItems.backVisitTime.val(),
		"customerServiceBackVisit.backVisitType": backVisit.backVisitItems.backVisitType.val(),
		"customerServiceBackVisit.backVisitDes": backVisit.backVisitItems.backVisitDes.val(),
	};
	
	if(backVisit.editFlag){
		url = api.construction.updateCustomerServiceBackVisit;
		options["customerServiceBackVisit.csbvId"] = customerServicePostData["customerServiceBackVisit.csbvId"];
	}else{
		url = api.construction.addCustomerServiceBackVisit;
	}
	
	com.post(url, options, successCallback, failCallback);
	backVisit.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["csbvIds[" + i + "]"] = row.csbvId;
	}
	
	com.post(api.construction.deleteCustomerServiceBackVisit, options, successCallback, failCallback);
	$("#eData").trigger("click");
}

function successCallback(result){
	backVisit.backVisitListGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}