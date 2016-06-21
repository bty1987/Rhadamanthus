var rework = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	reworkItems: {},
	
	editFlag: false,
	repeatFlg: false,
};

var reworkData = [
	{"reworkTime":"2014-09-02", "reworkComment":"针对我是吊顶部分进行后期补充工作."}
];

jQuery(function($) {
	$('#fl-statement').statement("监理控制", "返工信息列表");
	
	rework.listGrid = $("#listGrid");
	rework.gridPager = "#gridPager";
	rework.saveBtn = $("#saveBtn").on("click", saveData);
	rework.cancelBtn = $("#cancelBtn");
	rework.modal = $("#reworkModal");
	
	rework.reworkItems.createTime = $("#createTime");
	rework.reworkItems.reworkDes = $("#reworkDes");
	
	rework.listGrid.jqGrid({
		url: api.construction.pageReworkByOrderId.url,
		postData: supervisionPostData,
		colNames:['id', '创建人Id', '创建人', '返工时间', '返工说明', '操作'],
		colModel:[
		    {name:'rwId', hidden:true},
		    {name:'createrId', hidden:true},
		    {name:'createrName'},
		    {name:'createTime'},
		    {name:'reworkDes'},
		    {name:'action', formatter: actionInit},
		], 
		pager : rework.gridPager,
		caption: "返工信息列表"
	});
	
	rework.listGrid.navGrid(rework.gridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(rework.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			rework.editFlag = true;
			var num = rework.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_listGrid",{gbox:"#gbox_"+rework.listGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			
			var row = rework.listGrid.jqGrid("getRowData", num);
			
			rework.reworkItems.createTime.val(row.createTime);
			rework.reworkItems.reworkDes.val(row.reworkDes);
			supervisionPostData["rework.rwId"] = row.rwId;
			
			rework.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(rework.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "创建",
		onClickButton: function(){
			
			rework.editFlag = false;
			com.cleanItems(rework.reworkItems);
			
			rework.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(rework.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			com.switchPage(api.index.supervisionIndex.url);
		},
		position: "first",
	});
	
	$('.date-picker').datepicker({autoclose:true});
	
});

function saveData(){
	
	if(com.validate()|| rework.repeatFlg)
		return;
	
	var url;
	var options = {
		"rework.createTime": rework.reworkItems.createTime.val(),
		"rework.reworkDes": rework.reworkItems.reworkDes.val(),
		"rework.orderId": supervisionPostData["rework.orderId"]
	};
	
	if(rework.editFlag){
		url = api.construction.updateRework;
		options["rework.rwId"] = supervisionPostData["rework.rwId"];
	}else{
		url = api.construction.addRework;
	}
	
	com.post(url, options, successCallback, failCallback);
	rework.modal.modal("hide");
	
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		options["rwIds[" + i + "]"] = row.rwId;
	}
	
	com.post(api.construction.deleteRework, options, successCallback, failCallback);
	$("#eData").trigger("click");
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewSupervisionReworkDrawingIndex(' + rowdata.rwId + ');">图纸</button>';
	result += '</div>';
	
	return result;
}

function viewSupervisionReworkDrawingIndex(rwId){
	supervisionPostData["reworkDrawing.rwId"] = rwId;
	$("#supervisionPageContent").load(api.index.supervisionReworkDrawingIndex.url);
}

function successCallback(result){
	rework.listGrid.jqGrid().trigger("reloadGrid");
}

function failCallback(){
	
}
