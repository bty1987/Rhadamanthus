var addReduce = {
	decorationOrderId:null,
	
	typeDict : {"0":"增项", "1":"减项", "2":"漏项"},
	typeList : [{"key":"0","value":"增项"}, {"key":"1","value":"减项"},{"key":"2","value":"漏项"}],
	statusDict : {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"},
	
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	addReduceItems: {},
	
	editFlag: false,
	repeatFlg: false
};

jQuery(function($) {
	//$('#fl-statement').statement("装修订单", "增减项信息列表");
	
	addReduce.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	addReduce.listGrid = $("#listGrid");
	addReduce.gridPager = "#gridPager";
	
	addReduce.addReduceItems.addReduceDes = $("#addReduceDes");
	addReduce.addReduceItems.addReduceType = $("#addReduceType");
	
	addReduce.saveBtn = $("#saveBtn").on("click", saveData);
	addReduce.cancelBtn = $("#cancelBtn");
	addReduce.modal = $("#addReduceModal");
	
	initaddReduceList();
});

function initaddReduceList(){
	var searchOpts = {
		url: api.addReduce.pageAddReduceByOrderId,
		postParmas: {"paging.rows":10, "paging.page":1,"addReduce.orderId":addReduce.decorationOrderId},
		listgrid: addReduce.listGrid,
		items: [
	        {label:"类型",id:"searchAddReduceType",name:"addReduceType",type:"select",op:"eq"}
		]
	};
	$("#addReduceSearchDiv").flSearch(searchOpts);
	$("#searchAddReduceType").bindData(addReduce.typeList, 'key', 'value', true);
	
	addReduce.listGrid.jqGrid({
		url: api.addReduce.pageAddReduceByOrderId.url,
		postData: {"addReduce.orderId":addReduce.decorationOrderId},
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
		pager : addReduce.gridPager,
		caption: "增减项信息列表"
	});
	
	addReduce.listGrid.navGrid(addReduce.gridPager, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(addReduce.gridPager, { 
		caption:"",
		buttonicon: 'icon-print blue',
		onClickButton: function(){
			var nums = addReduce.listGrid.jqGrid("getGridParam","selarrrow");
			if(nums == null){
				$.jgrid.showSelectInfo(addReduce.listGrid.attr("id"));
				return;
			}
			var row = addReduce.listGrid.jqGrid('getRowData', nums[0]);
			var addReduceIds = "a=1";
			
			for(var i = 0; i< nums.length; i++){
				row = addReduce.listGrid.jqGrid('getRowData', nums[i]);
				
				addReduceIds+="&addReduceIds["+i+"]="+row.arId;
			}
				
			var url = api.index.addReduceOutputIndex.url + "?" + addReduceIds;
			window.open(url);
		},
		position: 'first'
	}).navButtonAdd(addReduce.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			addReduce.editFlag = false;
			com.cleanItems(addReduce.addReduceItems);
			
			addReduce.addReduceItems.addReduceType.attr('disabled', false);
			
			addReduce.modal.modal("show");
		},
		position: "first"
	}).navButtonAdd(addReduce.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			com.switchPage(api.index.decorationOrderDesignerIndex.url);
		},
		position: "first"
	});
}

function statusFormat(cellvalue, options, rowdata){
	
	var result = addReduce.statusDict[cellvalue];
	
	return result;
}

function typeFormat(cellvalue, options, rowdata){
	
	var result = addReduce.typeDict[cellvalue];
	
	return result;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-yellow" onclick="viewDetailAddReduce('+rowdata.arId+');">查看</button>';
	result += '</div>';
	
	return result;
}

function viewDetailAddReduce(addReduceId){
	params["addReduceId"] = addReduceId;
	com.switchPage(api.index.AddReduceDetailIndex.url);
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = addReduce.listGrid.jqGrid('getRowData', nums[i]);
		options["arIds["+i+"]"] = row.arId;
	}
	
	com.post(api.addReduce.deleteAddReduce, options, function(res){
		if(res.deleteFlag == "EXIST"){
			com.showAlert(com.warning, "删除增减项中存在提交状态,不能删除!");
		}else{
			com.showAlert(com.info, "操作成功!");
		}
		
		$.jgrid.refreshGrid(addReduce.listGrid, {"addReduce.orderId":addReduce.decorationOrderId});
	});
	
	$("#eData").trigger("click");
}

function saveData(){
	
	if(com.validate() || addReduce.repeatFlg)
		return;
	
	var url;
	var options = {
		"addReduce.content": addReduce.addReduceItems.addReduceDes.val(),
		"addReduce.type": addReduce.addReduceItems.addReduceType.val(),
		"addReduce.orderId": addReduce.decorationOrderId
	};
	
	url = api.addReduce.addAddReduce;
	options["addReduce.status"] = 0;
	options["addReduce.total"] = 0;
	
	com.post(url, options, function(res){
		com.showAlert(com.info, "操作成功");
		
		addReduce.listGrid.trigger("reloadGrid");
	});
	
	addReduce.modal.modal("hide");
}
