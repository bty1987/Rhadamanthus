var guarantee = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	guaranteeItems: {},
	
	levelDict: {"0":"普通", "1":"重要"},
	
	editFlag: false,
	repeatFlg: false,
};

jQuery(function($) {
	$('#fl-statement').statement("巡检控制", "保修信息列表");
	
	guarantee.guaranteeListGrid = $("#guaranteeListGrid");
	guarantee.guaranteeGridPager = "#guaranteeGridPager";
	guarantee.saveBtn = $("#saveBtn").on("click", saveData);
	guarantee.cancelBtn = $("#cancelBtn");
	guarantee.modal = $("#guaranteeModal");
	
	guarantee.guaranteeItems.orderId = $("#orderId");
	guarantee.guaranteeItems.customerName = $("#customerName");
	guarantee.guaranteeItems.guaranteeTime = $("#guaranteeTime");
	guarantee.guaranteeItems.guaranteeDes = $("#guaranteeDes");
	
	guarantee.guaranteeListGrid.jqGrid({
		url: api.construction.pageCustomerServiceGuarantee.url,
		postData: customerServicePostData,
		colNames:['Id', '订单编号', '客户名', '时间', '备注'],
		colModel:[
		    {name:'csgId', hidden:true},
		    {name:'orderId'},
			{name:'customerName'},
			{name:'guaranteeTime'},
			{name:'guaranteeDes'},
		], 
		pager : guarantee.guaranteeGridPager,
		caption: "保修信息列表"
	});
	
	guarantee.guaranteeListGrid.navGrid(guarantee.guaranteeGridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(guarantee.guaranteeGridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			guarantee.editFlag = true;
			var num = guarantee.guaranteeListGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_guaranteeListGrid",{gbox:"#gbox_"+guarantee.guaranteeListGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			
			var row = guarantee.guaranteeListGrid.jqGrid("getRowData", num);
			
			guarantee.guaranteeItems.orderId.val(row.orderId);
			guarantee.guaranteeItems.customerName.val(row.customerName);
			guarantee.guaranteeItems.guaranteeTime.val(row.guaranteeTime);
			guarantee.guaranteeItems.guaranteeDes.val(row.guaranteeDes);
			customerServicePostData["customerServiceGuarantee.csgId"] = row.csgId;
			
			guarantee.guaranteeItems.orderId.attr('disabled', true);
			guarantee.guaranteeItems.customerName.attr('disabled', true);
			guarantee.guaranteeItems.guaranteeTime.attr("disabled", true);
			
			guarantee.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(guarantee.guaranteeGridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			guarantee.editFlag = false;
			com.cleanItems(guarantee.guaranteeItems);
			
			guarantee.guaranteeItems.orderId.val(customerServicePostData["customerServiceGuarantee.orderId"]);
			guarantee.guaranteeItems.customerName.val(customerServicePostData["customerServiceGuarantee.customerName"]);
			
			guarantee.guaranteeItems.orderId.attr("disabled", true);
			guarantee.guaranteeItems.customerName.attr("disabled", true);
			guarantee.guaranteeItems.guaranteeTime.attr("disabled", false);
			
			guarantee.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(guarantee.guaranteeGridPager, {
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

function levelFormat(cellvalue, options, rowdata){
	
	var result = '';
	
	var level = guarantee.levelDict[cellvalue];
	
	if(cellvalue == 0){
		result += "<span class='label label-warning'>" + level + "</span>";
	}else if(cellvalue == 1){
		result += "<span class='label label-danger'>" + level + "</span>";
	}
	
	return result;
	
}

function saveData(){
	if(com.validate()|| guarantee.repeatFlg)
		return;
	
	var url;
	var options = {
		"customerServiceGuarantee.orderId": guarantee.guaranteeItems.orderId.val(),
		"customerServiceGuarantee.customerName": guarantee.guaranteeItems.customerName.val(),
		"customerServiceGuarantee.guaranteeTime": guarantee.guaranteeItems.guaranteeTime.val(),
		"customerServiceGuarantee.guaranteeDes": guarantee.guaranteeItems.guaranteeDes.val(),
	};
	
	if(guarantee.editFlag){
		url = api.construction.updateCustomerServiceGuarantee;
		options["customerServiceGuarantee.csgId"] = customerServicePostData["customerServiceGuarantee.csgId"];
	}else{
		url = api.construction.addCustomerServiceGuarantee;
	}
	
	com.post(url, options, successCallback, failCallback);
	guarantee.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["csgIds[" + i + "]"] = row.csgId;
	}
	
	com.post(api.construction.deleteCustomerServiceGuarantee, options, successCallback, failCallback);
	
	$("#eData").trigger("click");
}

function successCallback(result){
	guarantee.guaranteeListGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}