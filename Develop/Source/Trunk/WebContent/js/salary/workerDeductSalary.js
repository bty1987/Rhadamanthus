var workerDeductSalary = {
	listGridOrder: null,
	gridPagerOrder: null,
	
	listGridOrderDetail: null,
	gridPagerOrderDetail: null,
	
	listGridPersonal: null,
	gridPagerPersonal: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerDeductSalaryItems: {},
	
	statusTypeData: {"0":"初始", "1":"通过", "2":"确认", "3":"已发", "4":"撤销"},
	deductTypeData: {},
	
	operateType:false,
	workerUserId: "",
	
	workerDuty: "",
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	deductTypeFlag: true,
	editFlg: false,
	commitFlag: false,
};

var workerDeductSalaryData = {};

jQuery(function($) {
	
	workerDeductSalaryData["workerDeductSalary.orderId"] = "orderId";
	
	workerDeductSalary.saveBtn = $("#saveBtn").on("click", saveData);
	workerDeductSalary.cancelBtn = $("#cancelBtn");
	workerDeductSalary.modal = $("#deductSalaryModal");
	workerDeductSalary.modal.on('show.bs.modal', function(e){
		com.clearValidator();
		workerDeductSalary.commitFlag = false;
		
		$("#userName_chosen").css("width", "42%");
	});
	
	workerDeductSalary.listGridOrder = $("#listGridOrder");
	workerDeductSalary.gridPagerOrder = "#gridPagerOrder";
	
	workerDeductSalary.listGridOrderDetail = $("#listGridOrderDetail");
	workerDeductSalary.gridPagerOrderDetail = "#gridPagerOrderDetail";
	
	workerDeductSalary.listGridPersonal = $("#listGridPersonal");
	workerDeductSalary.gridPagerPersonal = "#gridPagerPersonal";
	
	initChange("userName", api.personel.queryUserForNameByDuty, api.personel.queryUserByUserId, {});

	workerDeductSalary.workerDeductSalaryItems.workType = $("#workType").on("change", function(){
		workerDeductSalary.workerDuty = $(this).find("option:selected").text();
	});
	workerDeductSalary.workerDeductSalaryItems.deduct = $("#deduct");
	workerDeductSalary.workerDeductSalaryItems.userName = $("#userName");
	workerDeductSalary.workerDeductSalaryItems.des = $("#des");
	
	initOrderList();
	initOrderDetailList();
	initPersonalList();
	
	var SearchOpts = {
		url: workerDeductSalary.queryDecorationOrderUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerDeductSalary.listGridOrder,
		items: [
			{label:"楼盘地址",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"业务员",id:"searchSalesman",name:"salesman",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"业务员"}},
			{label:"设计师",id:"searchDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
		]
	};
	$("#searchOrderDiv").flSearch(SearchOpts);
	
	var searchOrderOpts = {
		url: api.salary.pageWorkerDeductSalaryByOrderIdAUserId.url,
		postParmas: {"paging.rows":10, "paging.page":1, "workerDeductSalary.orderId":workerDeductSalaryData["workerDeductSalary.orderId"]},
		listgrid: workerDeductSalary.listGridOrderDetail,
		items: [
	        {label:"员工编号",id:"ouserIdSearch",name:"userId", type:'text'},
	        {label:"工人姓名",id:"ouserNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"工种",id:"oworkTypeSearch",name:"workType",type:"select",op:"eq"}
		]
	};
	$("#searchOrderDetailDiv").flSearch(searchOrderOpts);
	
	var searchPersonalOpts = {
		url: api.salary.pageWorkerDeductSalaryForPersonal,
		postParmas: {"paging.rows":10, "paging.page":1, "workerDeductSalary.orderId":""},
		listgrid: workerDeductSalary.listGridPersonal,
		items: [
	        {label:"员工编号",id:"puserIdSearch",name:"userId", type:'text'},
	        {label:"工人姓名",id:"puserNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"工种",id:"pworkTypeSearch",name:"workType",type:"select",op:"eq"}
		]
	};
	$("#searchPersonalDiv").flSearch(searchPersonalOpts);
	
	com.post(api.ds.workType, {}, function(res){
		var workType = res.workType;
		$("#oworkTypeSearch").bindData(workType, "key", "value", true);
		$("#pworkTypeSearch").bindData(workType, "key", "value", true);
		$("#workType").bindData(workType, "key", "value", false);
		
		workerDeductSalary.workerDuty = $("#workType").find("option:selected").text();
	});
	
	com.post(api.ds.deductType, {}, function(res){
		$("#orderDeductType").bindData(res.orderDeductType, "key", "value", false);
		$("#presonDeductType").bindData(res.personDeductType, "key", "value", false);
		
		for(var i in res.orderDeductType){
			workerDeductSalary.deductTypeData[res.orderDeductType[i]["key"]] = res.orderDeductType[i]["value"];
		}
		
		for(var i in res.personDeductType){
			workerDeductSalary.deductTypeData[res.personDeductType[i]["key"]] = res.personDeductType[i]["value"];
		}
	});

	$("#personal").removeClass("active");
	$("#listOrderDetail").css("display", "none");
});

function initOrderList(){
	workerDeductSalary.listGridOrder.jqGrid({		
		url: api.construction.pageDecorationOrderForConstructionSchedule.url,
		colNames:['编号', '楼盘地址', '客户名', '设计师', '面积', '状态', '工程状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'orderId'},
			{name:'villageName', jsonmap:'village.villageName'},
			{name:'customerName', jsonmap:'customer.customerName'},
			{name:'salesman'},
			{name:'houseArea'},
			{name:'status'},
			{name:'projectStatus', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: deductOrderActionInit}
		], 
		pager : workerDeductSalary.gridPagerOrder,
		caption: "订单信息列表"
	});

	workerDeductSalary.listGridOrder.navGrid(workerDeductSalary.gridPagerOrder,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initOrderDetailList(){
	workerDeductSalary.listGridOrderDetail.jqGrid({
		url: api.salary.pageWorkerDeductSalaryByOrderIdAUserId.url,
		postData: workerDeductSalaryData,
		colNames:['wdsId', 'wsId', 'userId', '姓名', '工种Id', '工种', '时间', '扣款类型Id', '扣款类型', '扣款', '状态', '状态', '备注', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'wdsId', hidden:true},
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'deductType', hidden:true},
			{name:'deductType', formatter: deductTypeInit},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: deductOrderDetailStatusInit},
			{name:'des'},
			{name:'action', formatter: deductOrderDetailActionInit}
		], 
		sortable:false,
		pager : workerDeductSalary.gridPagerOrderDetail,
		caption: ""
	});

	workerDeductSalary.listGridOrderDetail.navGrid(workerDeductSalary.gridPagerOrderDetail, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(deductOrderDetailRemoveRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(workerDeductSalary.gridPagerOrderDetail,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			
			var num = workerDeductSalary.listGridOrderDetail.jqGrid("getGridParam", 'selrow');
			
			if(num==null){
				$.jgrid.showSelectInfo(workerDeductSalary.listGridOrderDetail.attr("id"));
				return;
			}
			
			var row = workerDeductSalary.listGridOrderDetail.jqGrid("getRowData", num);
			
			workerDeductSalary.deductTypeFlag = true;
			
			$("#orderDeductTypeDiv").css("display", "block");
			$("#presonDeductTypeDiv").css("display", "none");
			
			workerDeductSalary.workerDeductSalaryItems.workType.val(row.workTypeId);
			$("#orderDeductType").val(row.deductType);
			workerDeductSalary.workerDeductSalaryItems.deduct.val(row.deduct);
			$("#userName_chosen span")[0].textContent = row.userName + "-" + row.userId;
			
			workerDeductSalary.workerUserId = row.userId;
			workerDeductSalary.workerDuty = row.workType;
			
			workerDeductSalaryData["workerDeductSalary.wdsId"] = row.wdsId;
			
			workerDeductSalary.operateType = false;
			workerDeductSalary.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(workerDeductSalary.gridPagerOrderDetail, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			com.cleanItems(workerDeductSalary.workerDeductSalaryItems);
			
			workerDeductSalary.deductTypeFlag = true;
			
			$("#orderDeductTypeDiv").css("display", "block");
			$("#presonDeductTypeDiv").css("display", "none");
			
			if($("#userName_chosen span").length > 0){
				$("#userName_chosen span")[0].textContent = "";
			}
			workerDeductSalary.workerDuty = $("#workType").find("option:selected").text();
			
			workerDeductSalary.operateType = false;
			workerDeductSalary.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(workerDeductSalary.gridPagerOrderDetail, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			
			$("#listOrder").css("display", "block");
			$("#listOrderDetail").css("display", "none");
		},
		position: "first",
	});
}

function initPersonalList(){
	workerDeductSalary.listGridPersonal.jqGrid({		
		url: api.salary.pageWorkerDeductSalaryForPersonal.url,
		postData: workerDeductSalaryData,
		colNames:['wdsId', 'wsId', 'userId', '姓名', '工种Id', '工种', '时间', '扣款类型Id', '扣款类型', '扣款', '状态', '状态', '备注', '操作'],
		colModel:[
		    {name:'wdsId', hidden:true},
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'deductType', hidden:true},
			{name:'deductType', formatter: deductTypeInit},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: deductOrderPersonalStatusInit},
			{name:'des'},
			{name:'action', formatter: deductOrderPersonalActionInit}
		], 
		sortable:false,
		pager : workerDeductSalary.gridPagerPersonal,
		caption: ""
	});

	workerDeductSalary.listGridPersonal.navGrid(workerDeductSalary.gridPagerPersonal, {edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, 
		$.jgrid.deleteFunc(deductOrderPersonalRemoveRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(workerDeductSalary.gridPagerPersonal,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			
			var num = workerDeductSalary.listGridPersonal.jqGrid("getGridParam", 'selrow');
			if(num == null){
				$.jgrid.showSelectInfo(workerDeductSalary.listGridPersonal.attr("id"));
				return;
			}
			
			var row = workerDeductSalary.listGridPersonal.jqGrid("getRowData", num);
			
			workerDeductSalary.deductTypeFlag = false;
			
			$("#orderDeductTypeDiv").css("display", "none");
			$("#presonDeductTypeDiv").css("display", "block");
			
			workerDeductSalary.workerDeductSalaryItems.workType.val(row.workTypeId);
			$("#presonDeductType").val(row.deductType);
			workerDeductSalary.workerDeductSalaryItems.deduct.val(row.deduct);
			$("#userName_chosen span")[0].textContent = row.userName + "-" + row.userId;
			
			workerDeductSalary.workerUserId = row.userId;
			workerDeductSalary.workerDuty = row.workType;
			
			workerDeductSalaryData["workerDeductSalary.wdsId"] = row.wdsId;
			
			workerDeductSalary.operateType = true;
			workerDeductSalary.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(workerDeductSalary.gridPagerPersonal, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			com.cleanItems(workerDeductSalary.workerDeductSalaryItems);
			
			workerDeductSalary.deductTypeFlag = false;
			
			$("#orderDeductTypeDiv").css("display", "none");
			$("#presonDeductTypeDiv").css("display", "block");
			
			workerDeductSalary.operateType = true;
			workerDeductSalary.modal.modal("show");
		},
		position: "first",
	});
}

function deductOrderDetailActionInit(cellvalue, options, rowdata){
	var result = '';
	
	if(rowdata.status == 0){
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="confirmWorderDeductSalaryDetail(' + options.rowId + ');">确认</button>';
	}
	
	if(cellvalue == "confirm"){
		result = "";
	}
	
	return result;
}

function deductOrderPersonalActionInit(cellvalue, options, rowdata){
	var result = '';
	
	if(rowdata.status == 0){
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="confirmWorderDeductSalaryPersonal(' + options.rowId + ');">确认</button>';
	}
	
	if(cellvalue == "confirm"){
		result = "";
	}
	
	return result;
}

function deductOrderActionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="viewWorkerDeductSalaryDetail(' + rowdata.orderId + ');">详细</button>';
	result += '</div>';
	
	return result;
}

function deductOrderDetailStatusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "confirm"){
		var row = workerDeductSalary.listGridOrderDetail.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalary.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalary.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function deductTypeInit(cellvalue, options, rowdata){
	return workerDeductSalary.deductTypeData[rowdata.deductType];
}

function deductOrderPersonalStatusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "confirm"){
		var row = workerDeductSalary.listGridPersonal.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalary.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalary.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function deductOrderDetailRemoveRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	var flag = false;
	var index = 0;
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		if(row.status == 0){
			options["wdsIds["+index+++"]"] = row.wdsId;
		}else{
			flag = true;
		}
	}
	
	if(flag){
		$("#eData").trigger("click");
		bootbox.confirm("存在不能删除状态的工资记录, 是否进行可删除状态工资信息的删除动作?", function(result) {
			if(result){
				if(!isEmpty(options)){
					com.post(api.salary.deleteWorkerDeductSalary, options, detailSuccessCallback);
				}else{
					detailSuccessCallback();
				}
			}
		});
	}else{
		if(!isEmpty(options)){
			com.post(api.salary.deleteWorkerDeductSalary, options, detailSuccessCallback);
		}else{
			detailSuccessCallback();
		}
		$("#eData").trigger("click");
	}
}

function deductOrderPersonalRemoveRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	var flag = false;
	var index = 0;
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		if(row.status == 0){
			options["wdsIds["+index+++"]"] = row.wdsId;
		}else{
			flag = true;
		}
	}
	
	if(flag){
		$("#eData").trigger("click");
		bootbox.confirm("存在不能删除状态的工资记录, 是否进行可删除状态工资信息的删除动作?", function(result) {
			if(result){
				if(!isEmpty(options)){
					com.post(api.salary.deleteWorkerDeductSalary, options, personalSuccessCallback);
				}else{
					personalSuccessCallback();
				}
			}
		});
	}else{
		if(!isEmpty(options)){
			com.post(api.salary.deleteWorkerDeductSalary, options, personalSuccessCallback);
		}else{
			personalSuccessCallback();
		}
		$("#eData").trigger("click");
	}
}

function saveData(){
	
	var userNameFlag = false;
	
	if($("#userName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
		com.showTips($("#userName"), "字段不能为空!", true);
		userNameFlag = true;
	}
	
	if(com.validate() || userNameFlag){
		return;
	}
	
	var deductType = workerDeductSalary.deductTypeFlag ? $("#orderDeductType").val() : $("#presonDeductType").val();
	
	var url;
	var options = {
		"workerDeductSalary.workTypeId": workerDeductSalary.workerDeductSalaryItems.workType.val(),
		"workerDeductSalary.workType": workerDeductSalary.workerDeductSalaryItems.workType.find("option:selected").text(),
		"workerDeductSalary.deductType": deductType,
		"workerDeductSalary.deduct": workerDeductSalary.workerDeductSalaryItems.deduct.val(),
		"workerDeductSalary.userId": workerDeductSalary.workerUserId,
		"workerDeductSalary.userName": $("#userName_chosen span")[0].textContent.split("-")[0],
		"workerDeductSalary.des": workerDeductSalary.workerDeductSalaryItems.des.val(),
	};
	
	if(!workerDeductSalary.operateType){
		options["workerDeductSalary.orderId"] = workerDeductSalaryData["workerDeductSalary.orderId"];
	}else{
		options["workerDeductSalary.orderId"] = "";
	}
	
	if(editFlg){
		url = api.salary.updateWorkerDeductSalary;
		options["workerDeductSalary.wdsId"] = workerDeductSalaryData["workerDeductSalary.wdsId"];
	}else{
		url = api.salary.addWorkerDeductSalary;
	}
	
	com.post(url, options, function(){
		if(!workerDeductSalary.operateType){
			detailSuccessCallback();
		}else{
			personalSuccessCallback();
		}
	});
	
	workerDeductSalary.modal.modal("hide");
}

function viewWorkerDeductSalaryDetail(orderId){
	workerDeductSalaryData["workerDeductSalary.orderId"] = orderId;
	
	$("#listOrder").css("display", "none");
	$("#listOrderDetail").css("display", "block");
	
	workerDeductSalary.listGridOrderDetail.jqGrid('setGridParam', { postData: workerDeductSalaryData});
	workerDeductSalary.listGridOrderDetail.trigger("reloadGrid");
}

function confirmWorderDeductSalaryDetail(rowId){
	
	var row = workerDeductSalary.listGridOrderDetail.jqGrid("getRowData", rowId);
	
	var options = {};
	options["workerDeductSalary.wdsId"] = row.wdsId;
	
	com.post(api.salary.confirmWorkerDeductSalary, options, function(){
		workerDeductSalary.listGridOrderDetail.setCell(rowId, "status", "1");
		workerDeductSalary.listGridOrderDetail.setCell(rowId, "statusShow", "confirm");
		workerDeductSalary.listGridOrderDetail.setCell(rowId, "action", "confirm");
	});
}

function confirmWorderDeductSalaryPersonal(rowId){
	
	var row = workerDeductSalary.listGridPersonal.jqGrid("getRowData", rowId);
	
	var options = {};
	options["workerDeductSalary.wdsId"] = row.wdsId;
	
	com.post(api.salary.confirmWorkerDeductSalary, options, function(){
		workerDeductSalary.listGridPersonal.setCell(rowId, "status", "1");
		workerDeductSalary.listGridPersonal.setCell(rowId, "statusShow", "confirm");
		workerDeductSalary.listGridPersonal.setCell(rowId, "action", "confirm");
	});
}

function detailSuccessCallback(){
	com.showAlert(com.info, "操作成功");
	workerDeductSalary.listGridOrderDetail.trigger("reloadGrid");
}

function personalSuccessCallback(){
	com.showAlert(com.info, "操作成功");
	workerDeductSalary.listGridPersonal.trigger("reloadGrid");
}

function isEmpty(obj){ 
    for (var name in obj){ 
    	_name = name;
        return false;
    } 
    return true; 
}; 
