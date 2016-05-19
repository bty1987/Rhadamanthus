var addOrReduce = {
	decorationOrderId:null,
	initAddOrReduceList:initAddOrReduceList,
	
	typeDict : {"0":"增项", "1":"减项", "2":"漏项"},
	typeList : [{"key":"0","value":"增项"}, {"key":"1","value":"减项"},{"key":"2","value":"漏项"}],
	statusDict : {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"},
	
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	addOrReduceItems: {},
	
	editFlag: false,
	repeatFlg: false
};

jQuery(function($) {
	//$('#fl-statement').statement("装修订单", "增减项信息列表");
	
	addOrReduce.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	addOrReduce.listGrid = $("#listGrid");
	addOrReduce.gridPager = "#gridPager";
	
	addOrReduce.addOrReduceItems.addReduceDes = $("#addReduceDes");
	addOrReduce.addOrReduceItems.addReduceType = $("#addReduceType");
	
	addOrReduce.saveBtn = $("#saveBtn").on("click", saveData);
	addOrReduce.cancelBtn = $("#cancelBtn");
	addOrReduce.modal = $("#addOrReduceModal");
	
	initAddOrReduceList();
});

function initAddOrReduceList(){
	var searchOpts = {
		url: api.addReduce.pageAddReduceByOrderId,
		postParmas: {"paging.rows":10, "paging.page":1,"addReduce.orderId":addOrReduce.decorationOrderId},
		listgrid: addOrReduce.listGrid,
		items: [
	        {label:"类型",id:"searchAddReduceType",name:"addReduceType",type:"select",op:"eq"}
		]
	};
	$("#addOrReduceSearchDiv").flSearch(searchOpts);
	$("#searchAddReduceType").bindData(addOrReduce.typeList, 'key', 'value', true);
	
	addOrReduce.listGrid.jqGrid({
		url: api.addReduce.pageAddReduceByOrderId.url,
		postData: {"addReduce.orderId":addOrReduce.decorationOrderId},
		colNames:['id', '说明', '总价', '类别', '状态', '添加时间', '操作','orderPaymentId'],
		colModel:[
		    {name:'arId', hidden:true},
		    {name:'addReduceDes'},
			{name:'addReduceTotal'},
			{name:'addReduceType', formatter: typeFormat},
			{name:'addReduceStatus', formatter: statusFormat},
			{name:'createTime'},
			{name:'action', formatter: actionInit},
			{name:'orderPaymentId', hidden:true}
		], 
		rowNum:200,
		rowList:[200,500,1000],
		pager : addOrReduce.gridPager,
		caption: "增减项信息列表"
	});
	
	addOrReduce.listGrid.navGrid(addOrReduce.gridPager, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(addOrReduce.gridPager, { 
		caption:"",
		buttonicon: 'icon-print blue',
		onClickButton: function(){
			var nums = addOrReduce.listGrid.jqGrid("getGridParam","selarrrow");
			if(nums == null){
				$.jgrid.showSelectInfo(addOrReduce.listGrid.attr("id"));
				return;
			}
			var row = addOrReduce.listGrid.jqGrid('getRowData', nums[0]);
			var addOrReduceIds = "a=1";
			
			for(var i = 0; i< nums.length; i++){
				row = addOrReduce.listGrid.jqGrid('getRowData', nums[i]);
				
				addOrReduceIds+="&addOrReduceIds["+i+"]="+row.arId;
			}
				
			var url = api.index.printAddOrReduceInfoIndex.url + "?" + addOrReduceIds;
			window.open(url);
		},
		position: 'first'
	}).navButtonAdd(addOrReduce.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			addOrReduce.editFlag = false;
			com.cleanItems(addOrReduce.addOrReduceItems);
			
			addOrReduce.addOrReduceItems.addReduceType.attr('disabled', false);
			
			addOrReduce.modal.modal("show");
		},
		position: "first"
	}).navButtonAdd(addOrReduce.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
		},
		position: "first"
	});
}

function statusFormat(cellvalue, options, rowdata){
	
	var result = addOrReduce.statusDict[cellvalue];
	
	return result;
}

function typeFormat(cellvalue, options, rowdata){
	
	var result = addOrReduce.typeDict[cellvalue];
	
	return result;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-yellow" onclick="viewDetailAddOrReduce('+rowdata.arId+');">查看</button>';
	result += '</div>';
	
	return result;
}

function viewDetailAddOrReduce(addOrReduceId){
	
	params["addOrReduceId"] = addOrReduceId;
	
	$("#fl-container").load(api.index.decorationOrderAddOrReduceDetailIndex.url, {});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = addOrReduce.listGrid.jqGrid('getRowData', nums[i]);
		options["arIds["+i+"]"] = row.arId;
	}
	
	com.post(api.addReduce.deleteAddReduce, options, function(res){
		if(res.deleteFlag == "EXIST"){
			com.showAlert(com.warning, "删除增减项中存在提交状态,不能删除!");
		}else{
			com.showAlert(com.info, "操作成功!");
		}
		
		$.jgrid.refreshGrid(addOrReduce.listGrid, {"addReduce.orderId":addOrReduce.decorationOrderId});
	});
	
	$("#eData").trigger("click");
}

function saveData(){
	
	if(com.validate() || addOrReduce.repeatFlg)
		return;
	
	var url;
	var options = {
		"addReduce.addReduceDes": addOrReduce.addOrReduceItems.addReduceDes.val(),
		"addReduce.addReduceType": addOrReduce.addOrReduceItems.addReduceType.val(),
		"addReduce.orderId": addOrReduce.decorationOrderId
	};
	
	url = api.addReduce.addAddReduce;
	options["addReduce.addReduceStatus"] = 0;
	options["addReduce.addReduceTotal"] = 0;
	
	com.post(url, options, function(res){
		com.showAlert(com.info, "操作成功");
		
		addOrReduce.listGrid.trigger("reloadGrid");
	});
	
	addOrReduce.modal.modal("hide");
}
