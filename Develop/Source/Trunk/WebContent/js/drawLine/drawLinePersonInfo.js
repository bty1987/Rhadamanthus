var personInfo = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	personInfoItems: {},
	
	editFlag: false
};

var personInfoPostData = {};

var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuit":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};

var scheduleInfos = {"铲大白":[10, "progress-bar-primary"], "放线":[10, "progress-bar-warning"], "水电力":[10, "progress-bar-danger"], "瓦工":[15, "progress-bar-inverse"], "木工":[20, "progress-bar-purple"], "油工":[20, "progress-bar-pink"], "保洁":[15, "progress-bar-success"]};

jQuery(function($) {
	$('#fl-statement').statement("工程验收", "订单信息列表");
	
	personInfo.listGrid = $("#listGrid");
	personInfo.gridPager = "#gridPager";
	personInfo.saveBtn = $("#saveBtn").on("click", saveData);
	personInfo.cancelBtn = $("#cancelBtn");
	personInfo.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	personInfo.personInfoModal = $("#personInfoModal");
	
	var personInfoSearchOpts = {
		url: api.construction.pageDecorationOrderByPersonInfo,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: personInfo.listGrid,
		items: [
	        {label:"订单编号",id:"searchOrderId",name:"orderId",type:"text"},
			{label:"楼盘",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"楼号",id:"searchHouseNum",name:"houseNumber",type:"text"},
			{label:"面积",id:"searchHouseArea",name:"houseArea",type:"text",op:"eq"},
			{label:"业务员",id:"searchSalesman",name:"salesman",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":""}},
			{label:"设计师",id:"searchDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
		]
	};
	$("#personInfoSearchDiv").flSearch(personInfoSearchOpts);
	
	com.post(api.ds.constructionInfo, {}, function(res){
		$("#scheduleSearch").bindData(res.constructionSchedule, "key", "value", true);
	});
	
	personInfo.listGrid.jqGrid({
		url: api.construction.pageDecorationOrderByPersonInfo.url,
		colNames:['编号', '楼盘地址', '客户名', '设计师', '面积', '创建时间', '状态', '进度', '工程状态', '操作', 'houseNumber'],
		colModel:[
		    {name:'orderId'},
			{name:'village', width:300, formatter: villageInit},
			{name:'customerName', jsonmap:'customer.customerName'},
			{name:'designer'},
			{name:'houseArea'},
			{name:'createTime'},
			{name:'status'},
			{name:'schedule', formatter: scheduleInit, hidden:true},
			{name:'projectStatus', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber", hidden:true}
		], 
		pager : personInfo.gridPager,
		caption: "订单信息列表"
	});
	
	for(var qualityName in qualityInfo){
		
		var options = {};
		if(qualityName == "supervisor"){
			options["duty"] = qualityInfo[qualityName];
			queryUserNameUrl = api.personel.queryUserForNameByDuty;
		}else if(qualityName == "waterwayCircuitPower"){
			queryUserNameUrl = api.personel.queryUserForNameByDutysAO;
			dutys = qualityInfo[qualityName].split(",");
			for(var i=0;i<dutys.length;i++){
				options["dutysO["+i+"]"] = dutys[i]+"工";
			}
			options["dutys[0]"] = "质检";
		}else{
			options["dutys[0]"] = qualityInfo[qualityName];
			options["dutys[1]"] = "质检";
			queryUserNameUrl = api.personel.queryUserForNameByDutys;
		}
		
		if(!qualityFlag[qualityName]){
			initChange(qualityName, queryUserNameUrl, options);
			qualityFlag[qualityName] = true;
		}else{
			var id = "#" + qualityName + "Quality";
			$(id).html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		}
	}
});

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="deployedBtn" class="btn btn-minier btn-primary" onclick="deployed(\''+options.gid+'\',\''+rowdata.orderId+'\');">人员部署</button>';
	result += '</div>';
	
	return result;
}

function villageInit(cellvalue, options, rowdata){
	return rowdata.village.villageName + ' ' + rowdata.houseNumber;
}

function scheduleInit(cellvalue, options, rowdata){
	var result = '';
	var _result = "";
	var projectStatus = rowdata.projectStatus;
	var flag = false;
	
	result += '<div class="progress" style="margin-bottom: 0px;" data-percent="' + rowdata.projectStatus + '">';
	
	for(var schedule in scheduleInfos){
		scheduleInfo = scheduleInfos[schedule];
		_result += '<div style="width: ' + scheduleInfo[0] + '%;" class="progress-bar ' + scheduleInfo[1] + '"></div>';
		if(schedule == projectStatus){
			flag = true;
			break;
		}
	}
	
	if(flag){
		result += _result;
	}
	
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function initChange(id, queryElementsUrl, queryElementUrl, options){
	
	id = "#" + id;
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true
	});
	
	$(chosenNameId).bind("input", function(){
		var autoFileSearchValue = $(chosenNameId).val();
		com.post(queryElementsUrl, {"autoFileSearch":autoFileSearchValue}, function(res){
			if(res.errorCode == 0){
				var html1 = '';
				if(res.autoFillList != null){
					for(var i=0;i<res.autoFillList.length;++i){
						html1+= '<option value="'+res.autoFillList[i].key+'">'+res.autoFillList[i].value+'</option>';
					}
				}
				$(id).html(html1).trigger("chosen:updated");
				$(chosenNameId).val(autoFileSearchValue);
			}
		});
	});
}

function deployed(gid, orderId){
	
	for(var qualityName in qualityInfo){
		com.clearValidator("#"+qualityName+"Quality_chosen", true);
	}
	
	var options = {};
	options["constructionSchedule.orderId"] = orderId;
	
	com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
		
		var queryUserNameUrl = "";
		
		for(var qualityName in qualityInfo){
			
			if(res.constructionSchedule[qualityName+"QualityName"] == null){
				$("#"+qualityName+"Quality_chosen span")[0].textContent = "";
			}else{
				$("#"+qualityName+"Quality_chosen span")[0].textContent = res.constructionSchedule[qualityName+"QualityName"]+"-"+res.constructionSchedule[qualityName+"QualityId"];
			}
			
			qualityIds[qualityName] = res.constructionSchedule[qualityName+"QualityId"];
			
			$("#"+qualityName+"Quality_chosen").css("width", "150px");
		}
		
		personInfoPostData["orderId"] = orderId;
		
		personInfo.personInfoModal.modal("show");
	}, function(){
		com.showAlert(com.error, "获取订单对应人员部署信息失败!");
	});
}

function drawLineDeployed(){
	console.log("drawLinedeployed");
	
	for(var qualityName in qualityInfo){
		
		var qualityNameInput = $("#"+qualityName+"Quality_chosen span");
		
		console.log(qualityNameInput[0].textContent);
		console.log(qualityNameInput[0].textContent.trim() == "");
		
		if(qualityNameInput[0].textContent.trim() == ""){
			com.showTips($("#"+qualityName+"Quality_chosen"), "人员部署信息不能为空", true);
			
			return false;
		}
	}
	
	var options = {};
	
	for(var qualityId in qualityIds){
		options["constructionSchedule."+qualityId+"QualityId"] = qualityIds[qualityId];
	}
	options["constructionSchedule.orderId"] = personInfoPostData["orderId"];
	
	com.post(api.construction.updateConstructionScheduleByOrderId, options, function(res){
		com.showAlert(com.info, "人员部署成功!");
	}, function(){
		com.showAlert(com.error, "人员部署失败!");
	});
	
	personInfo.personInfoModal.modal("hide");
}

function initChange(initId, queryElementsUrl, options){
	console.log("initChange");
	
	id = "#" + initId + "Quality";
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true
	});
	
	$(id).on("change", function(){
		qualityIds[initId] = $("#"+$(this).attr("id")).val();
	});
	
	$(chosenNameId).on("change", function(){
		qualityIds[initId] = $("#"+$(this).attr("id")).val();
	});
	
	$(chosenNameId).unbind("input").bind("input", function(){
		var _id = "#"+$(this).parents('.chosen-container').attr("id").split("_")[0];
		var _chosenNameId = "#"+$(this).parents('.chosen-container').attr("id")+" input";
		
		var autoFileSearchValue = $(_chosenNameId).val();
		options["pinyinName"] = autoFileSearchValue;
		com.post(queryElementsUrl, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillKeyValue != null){
					for(var i=0;i<res.autoFillKeyValue.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				
				$(_id).html(html1).trigger("chosen:updated");
				$(_chosenNameId).val(autoFileSearchValue);
			}
		});
	});
}