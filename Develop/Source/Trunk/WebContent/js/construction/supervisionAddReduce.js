var addReduce = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	addReduceItems: {},
	
	typeDict : {"0":"增项", "1":"减项", "2":"漏项"},
	statusDict : {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"},
	
	editFlag: false,
	repeatFlg: false,
};

var addReducePostData = {};


jQuery(function($) {
	$('#fl-statement').statement("监理控制", "增减项信息列表");
	
	addReduce.listGrid = $("#listGrid");
	addReduce.gridPager = "#gridPager";
	addReduce.saveBtn = $("#saveBtn").on("click", saveData);
	addReduce.cancelBtn = $("#cancelBtn");
	addReduce.modal = $("#addReduceModal");
	addReduce.addOrReduceDetailModal = $("#addOrReduceDetailModal");
	
	addReduce.addReduceItems.addReduceDes = $("#addReduceDes");
	addReduce.addReduceItems.addReduceType = $("#addReduceType");
	
	addReduce.listGrid.jqGrid({
		url: api.addReduce.pageAddReduceByOrderId.url,
		postData: supervisionPostData,
		colNames:['id', '说明', '总价', '类别', '状态', '时间', '操作'],
		colModel:[
		    {name:'arId', hidden:true},
		    {name:'addReduceDes'},
			{name:'addReduceTotal'},
			{name:'addReduceType', formatter: typeFormat},
			{name:'addReduceStatus', formatter: statusFormat},
			{name:'createTime'},
			{name:'action', formatter: actionInit}
		], 
		pager : addReduce.gridPager,
		caption: "增减项信息列表"
	});
	
	addReduce.listGrid.navGrid(addReduce.gridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(addReduce.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			addReduce.editFlag = true;
			var num = addReduce.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_listGrid",{gbox:"#gbox_"+addReduce.listGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			
			var addReduceTypeId = 0;
			
			var row = addReduce.listGrid.jqGrid("getRowData", num);
			
			$.each(addReduce.typeDict, function(key) {
			    if(addReduce.typeDict[key] == row.addReduceType){
			    	addReduceTypeId = key;
			    }
			});
			
			addReduce.addReduceItems.addReduceDes.val(row.addReduceDes);
			addReduce.addReduceItems.addReduceType.val(addReduceTypeId);
			supervisionPostData["addReduce.arId"] = row.arId;
			
			addReduce.addReduceItems.addReduceType.attr('disabled', true);
			
			addReduce.modal.modal("show");
		},
		position: "first",
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
		position: "first",
	}).navButtonAdd(addReduce.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.supervisionIndex.url);
		},
		position: "first",
	});
});

function initAddOrReduceDetailListGrid(){
	
	$("#addOrReduceItemDiv").html("");
	$("#addOrReduceItemDiv").html('<table id="addOrReduceItemList"></table> <div id="addOrReduceItemListGridPager"></div> '); 
	
	$("#addOrReduceItemList").jqGrid({	
		url: api.addReduce.pageAddReduceDetailByArId.url,
		postData: addReducePostData,
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['arId', '名称', '工种', '大类', '单位', '单价', '数量', '总价', 'itemType'],
		colModel:[
		  {name:"arId",hidden:true},
		  {name:"itemName", width:300},
		  {name:"workType"},
		  {name:"quotationBigCategory"},
		  {name:"measurementUnit"},
		  {name:"unitPrice"},
		  {name:"num"},
		  {name:"sumMoney", hidden:true},
		  {name:"itemType", hidden:true}
		],
		autowidth:false,
		width:'535',
		pager : "#addOrReduceItemListGridPager",
		caption: ""
	});

	$("#addOrReduceItemList").navGrid("#addOrReduceItemListGridPager", {edit:false,add:false,del:false,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {} ,null,null);
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
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="dialogAddReduceDetail(' + rowdata.arId + ');">查看</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
	if(com.validate()|| addReduce.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"addReduce.addReduceDes": addReduce.addReduceItems.addReduceDes.val(),
		"addReduce.addReduceType": addReduce.addReduceItems.addReduceType.val(),
		"addReduce.orderId": supervisionPostData["addReduce.orderId"]
	};
	
	if(addReduce.editFlag){
		url = api.addReduce.updateAddReduce;
		options["addReduce.arId"] = supervisionPostData["addReduce.arId"];
	}else{
		url = api.addReduce.addAddReduce;
		options["addReduce.addReduceStatus"] = 0;
		options["addReduce.addReduceTotal"] = 0;
	}
	
	com.post(url, options, successCallback, failCallback);
	
	addReduce.modal.modal("hide");
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid("getRowData", nums[i]);
		
		options["arIds[" + i + "]"] = row.arId;
	}
	
	com.post(api.addReduce.deleteAddReduce, options, successCallback, failCallback);
	
	$("#eData").trigger("click");
}

function dialogAddReduceDetail(arId){
	
	addReducePostData["addReduce.arId"] = arId;
	
	initAddOrReduceDetailListGrid();
	addReduce.addOrReduceDetailModal.modal("show");
}

function successCallback(result){
	
	addReduce.listGrid.jqGrid().trigger("reloadGrid");
	
	if(result.deleteFlag == "EXIST"){
		com.showAlert(com.warning,"删除增减项中存在提交状态,不能删除!");
	}
}

function failCallback(){
	
}
