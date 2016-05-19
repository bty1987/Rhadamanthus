var workerSalaryDetail = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerSalaryDetailItems: {},
	
	statusTypeData: {"0":"初始", "1":"通过", "2":"确认", "3":"已发", "4":"撤销"},
	
	workerUserId: "",
	workerUserName: "",
	workerDuty: "",
	
	editFlag: false,
	commitFlag: false,
};

var workerSalaryDetailPostData = {};

var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("工人工资", "订单工人工资列表");
	
	workerSalaryDetail.listGrid = $("#listGrid");
	workerSalaryDetail.gridPager = "#gridPager";
	workerSalaryDetail.saveBtn = $("#saveBtn").on("click", saveData);
	workerSalaryDetail.cancelBtn = $("#cancelBtn");
	workerSalaryDetail.modal = $("#baseSalaryModal").on('show.bs.modal',function(e){
		com.clearValidator();
		workerSalaryDetail.commitFlag = false;
		
		$("#userName_chosen").css("width", "42%");
	});
	
	initChange("userName", api.personel.queryUserForNameByDuty, api.personel.queryUserByUserId.url, {});
	
	workerSalaryDetail.workerSalaryDetailItems.workType = $("#workType").on("change", function(){
		workerSalaryDetail.workerDuty = $(this).find("option:selected").text();
	});
	workerSalaryDetail.workerSalaryDetailItems.base = $("#base");
	workerSalaryDetail.workerSalaryDetailItems.userName = $("#userName").typeahead({
		reverseFlag: false,
	    source: function (query, process) {
	        var options = {"materialModel.materialModelName": query};
	        if(typeof this.options.url !== "string"){
	        	com.showAlert(com.error, "the autoFillText has no any url.");
	        }
	        com.post("", options, function(data){
	        	var _autoFillList = data.autoFillList;
	        	autoFillList = [];
        		autoFillNameList = [];
        		for(var i=0;i<_autoFillList.length;i++){
        			autoFillList[i] = _autoFillList[i].value;
        			autoFillNameList[i] = _autoFillList[i].key;
        		}
	        	process(autoFillList);
	        });
	    },
	    matcher: function (item) {
	        return true;
	    }
	}).attr("autocomplete", "off").on("change", function(){
		
		var userId = autoFillList.indexOf($(this).val());
		
		if(userId){
			workerSalaryDetailPostData["workerBaseSalary.userId"] = userId;
			workerSalaryDetailPostData["workerBaseSalary.userName"] = $(this).val();
			
			workerSalaryDetail.commitFlag = true;
		}else{
			return false;
		}
		
	}).on("keydown", function(){
		workerSalaryDetail.commitFlag = false;
	});
	
	workerSalaryDetailPostData["workerBaseSalary.orderId"] = workerSalaryPostData["workerSalary.orderId"];
	
	var workerSalaryDetailSearchOpts = {
		url: api.salary.pageWorkerBaseSalaryByOrderIdAUserId,
		listgrid: workerSalaryDetail.listGrid,
		postParmas: {"paging.rows":10, "paging.page":1, "workerBaseSalary.orderId":workerSalaryDetailPostData["workerBaseSalary.orderId"]},
		items: [
	        {label:"工人姓名",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"工种",id:"workeTypeSearch",name:"workTypeId",type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(workerSalaryDetailSearchOpts);
	
	com.post(api.ds.workType, {}, function(res){
		$("#workeTypeSearch").bindData(res.workType, "key", "value", true);
		$("#workType").bindData(res.workType, "key", "value", false);
		
		workerSalaryDetail.workerDuty = $("#workType").find("option:selected").text();
	});
	
	workerSalaryDetail.listGrid.jqGrid({		
		url: api.salary.pageWorkerBaseSalaryByOrderIdAUserId.url,
		postData: workerSalaryDetailPostData,
		colNames:['wbsId', 'wsId', 'userId', '姓名', '工种Id', '工种', '时间', '基本工资', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'wbsId', hidden:true},
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'base'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionInit}
		], 
		pager: workerSalaryDetail.gridPager,
		caption: "订单工人工资列表"
	});
	
	workerSalaryDetail.listGrid.navGrid(workerSalaryDetail.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false},{},{},
	$.jgrid.deleteFunc(removeRow),
	$.jgrid.searchFunc($(this)))
	.navButtonAdd(workerSalaryDetail.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			
			var num = workerSalaryDetail.listGrid.jqGrid("getGridParam", 'selrow');
			if(num == null){
				$.jgrid.showSelectInfo(workerSalaryDetail.listGrid.attr("id"));
				return;
			}
			
			var row = workerSalaryDetail.listGrid.jqGrid("getRowData", num);
			
			workerSalaryDetail.workerSalaryDetailItems.workType.val(row.workTypeId);
			workerSalaryDetail.workerSalaryDetailItems.base.val(row.base);
			$("#userName_chosen span")[0].textContent = row.userName + "-" + row.userId;
			
			workerSalaryDetail.workerUserId = row.userId;
			workerSalaryDetail.workerDuty = row.workType;
			
			workerSalaryDetailPostData["workerBaseSalary.wbsId"] = row.wbsId;
			
			workerSalaryDetail.modal.modal("show");
		},
		position: "first",
	})
	.navButtonAdd(workerSalaryDetail.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			com.cleanItems(workerSalaryDetail.workerSalaryDetailItems);
			
			if($("#userName_chosen span").length > 0){
				$("#userName_chosen span")[0].textContent = "";
			}
			workerSalaryDetail.workerDuty = $("#workType").find("option:selected").text();
			
			workerSalaryDetail.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(workerSalaryDetail.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.workerBaseSalaryScheduleIndex.url);
		},
		position: "first",
	});
	
});

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = workerSalaryDetail.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerSalaryDetail.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerSalaryDetail.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	if(rowdata.status == 0){
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="passWorderBaseSalary(' + options.rowId + ');">通过</button>';
	}
	if(cellvalue == "pass"){
		result = "";
	}
	return result;
}

function saveData(){
	
	var userNameFlag = false;
	
	if($("#userName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
		com.showTips($("#userName"), "字段不能为空!", true);
		userNameFlag = true;
	}
	
	if(com.validate() || userNameFlag)
		return;
	
	var url;
	var options = {
		"workerBaseSalary.workTypeId": workerSalaryDetail.workerSalaryDetailItems.workType.val(),
		"workerBaseSalary.workType": workerSalaryDetail.workerSalaryDetailItems.workType.find("option:selected").text(),
		"workerBaseSalary.base": workerSalaryDetail.workerSalaryDetailItems.base.val(),
		"workerBaseSalary.userId": workerSalaryDetail.workerUserId,
		"workerBaseSalary.userName": $("#userName_chosen span")[0].textContent.split("-")[0],
		"workerBaseSalary.orderId": workerSalaryDetailPostData["workerBaseSalary.orderId"],
	};
	
	console.log(options);
	
	if(editFlg){
		url = api.salary.updateWorkerBaseSalary;
		options["workerBaseSalary.wbsId"] = workerSalaryDetailPostData["workerBaseSalary.wbsId"];
	}else{
		url = api.salary.addWorkerBaseSalary;
	}
	
	com.post(url, options, successCallback);
	
	workerSalaryDetail.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	var flag = false;
	var index = 0;
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		if(row.status == 0){
			options["wbsIds["+index+++"]"] = row.wbsId;
		}else{
			flag = true;
		}
	}
	
	if(flag){
		$("#eData").trigger("click");
		bootbox.confirm("存在不能删除状态的工资记录 , 是否进行可删除状态工资信息的删除动作?", function(result) {
			if(result){
				if(!isEmpty(options)){
					com.post(api.salary.deleteWorkerBaseSalary, options, successCallback);
				}else{
					successCallback();
				}
			}
		});
	}else{
		if(!isEmpty(options)){
			com.post(api.salary.deleteWorkerBaseSalary, options, successCallback);
		}else{
			successCallback();
		}
		$("#eData").trigger("click");
	}
}

function passWorderBaseSalary(rowId){
	
	var row = workerSalaryDetail.listGrid.jqGrid("getRowData", rowId);
	
	var options = {};
	options["workerBaseSalary.wbsId"] = row.wbsId;
	
	com.post(api.salary.passWorkerBaseSalary, options, function(){
		workerSalaryDetail.listGrid.setCell(rowId, "status", "1");
		workerSalaryDetail.listGrid.setCell(rowId, "statusShow", "pass");
		workerSalaryDetail.listGrid.setCell(rowId, "action", "pass");
	});
}

function initChange(id, queryElementsUrl, queryElementUrl, options){
	
	id = "#" + id;
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true,
	});
	
	$(id).on("change", function(){
		var args = {};
		args["user.userId"] = $(id).val();
		workerSalaryDetail.workerUserId = $(id).val();
	});
	
	$(chosenNameId).bind("input", function(){
		var autoFileSearchValue = $(chosenNameId).val();
		if(autoFileSearchValue == ""){
			return false;
		}
		
		options["pinyinName"] = autoFileSearchValue;
		options["duty"] = workerSalaryDetail.workerDuty;
		
		com.post(queryElementsUrl, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillKeyValue != null){
					for(var i=0;i<res.autoFillKeyValue.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				$(id).html(html1).trigger("chosen:updated");
				$(chosenNameId).val(autoFileSearchValue);
			}
		});
	});
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	workerSalaryDetail.listGrid.trigger("reloadGrid");
}

function isEmpty(obj){ 
    for (var name in obj){ 
    	_name = name;
        return false; 
    } 
    return true; 
};
