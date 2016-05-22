var drawLineDeployment = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	deployedBtn: null,
	modal: null,
	drawLineDeploymentItems: {},
	
	drawLineGroup:null,
	
	postData:{},
	editFlag: false,
	
	deployedFlag: false,
	
	drawLineDateCount:null
};

var drawLineDeploymentPostData = {};

var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuit":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};

jQuery(function($) {
//	$('#fl-statement').statement("放线申请管理", "放线申请信息列表");
	
	drawLineDeployment.saveBtn = $("#saveBtn").on("click", saveData);
	drawLineDeployment.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	drawLineDeployment.cancelBtn = $("#cancelBtn");
	drawLineDeployment.drawLineDeploymentModal = $("#drawLineDeploymentModal");
	drawLineDeployment.drawLineModal = $("#drawLineModal");
	
	drawLineDeployment.drawLineDeploymentItems.supervisorQuality = $("#supervisorQuality");
	drawLineDeployment.drawLineDeploymentItems.chanQuality = $("#chanQuality");
	drawLineDeployment.drawLineDeploymentItems.putlineQuality = $("#putlineQuality");
	drawLineDeployment.drawLineDeploymentItems.waterwayCircuitPowerQuality = $("#waterwayCircuitPowerQuality");
	drawLineDeployment.drawLineDeploymentItems.powerQuality = $("#powerQuality");
	drawLineDeployment.drawLineDeploymentItems.bricklayQuality = $("#bricklayQuality");
	drawLineDeployment.drawLineDeploymentItems.carpentQuality = $("#carpentQuality");
	drawLineDeployment.drawLineDeploymentItems.oilQuality = $("#oilQuality");
	drawLineDeployment.drawLineDeploymentItems.cleaningQuality = $("#cleaningQuality");
	
	drawLineDeployment.drawLineDeploymentItems.supervisorSwitch = $("#supervisorSwitch");
	drawLineDeployment.drawLineDeploymentItems.powerSwitch = $("#powerSwitch");
	
	drawLineDeployment.drawLineDeploymentItems.supervisorSwitch.switchBtn();
	drawLineDeployment.drawLineDeploymentItems.powerSwitch.switchBtn();
	
	drawLineDeployment.drawLineApplyModal = $("#drawLineApplyModal");
	
	drawLineDeployment.drawLineDeploymentItems.supervisorSwitch.click(function(){
		var otherSupervisor = $("#otherSupervisor");
		drawLineDeployment.drawLineDeploymentItems.supervisorSwitch.value = this.checked ? otherSupervisor.css('display','inline') : otherSupervisor.hide();
	});
	
	drawLineDeployment.drawLineDeploymentItems.powerSwitch.click(function(){
		var otherPower = $("#otherPower");
		drawLineDeployment.drawLineDeploymentItems.powerSwitch.value = this.checked ? otherPower.css('display','inline') : otherPower.hide();
	});
	
	com.post(api.ds.drawLineInfo, {}, function(res){
		drawLineDeployment.drawLineGroup = res.drawLineGroup;
		$("#drawLineGroup").bindData(drawLineDeployment.drawLineGroup, 'key', 'value');
		$("#drawLineGroupList").html("");
		
		for(var i=0;i< drawLineDeployment.drawLineGroup.length;++i){
			initDrawLineDeploymentList(i,drawLineDeployment.drawLineGroup[i].value);
		}
		
		var searchOpts = {
			url: drawLineDeployment.queryUrl,
			postParmas: {"paging.rows":10, "paging.page":1},
			postSearch: function(opts){
				for(var i=0;i< drawLineDeployment.drawLineGroup.length;++i){
					
					opts['drawLine.drawLineGroup'] = drawLineDeployment.drawLineGroup[i].key;
					
					$.jgrid.refreshGrid($("#listGridGroup_"+i), opts);
				}
			},
			items: [
		        {label:"状态", id:"statusSearch", name:"status", type:"select", op:"eq"},
		        {label:"放线时间", id:"drawLineTimeId", name:"actualDate", type:'datePicker', op:"between", notempty:"notempty"}
			]
		};
		$("#searchDiv").flSearch(searchOpts);
		
		var status = [{"key":"申请放线","value":"申请放线"},{"key":"放线失败","value":"放线失败"},{"key":"放线成功","value":"放线成功"}];
		$("#statusSearch").bindData(status, 'key', 'value', true);

		$('.date-picker').datepicker({format:'yyyy-mm-dd' ,autoclose:true, todayBtn:true, todayHighlight:true}).next().on(ace.click_event, function(){
			$(this).prev().focus();
		});
		
		$("#searchDiv > .fl_search").append('&nbsp<button id="showDrawLineApplyInfos" class="btn btn-sm no-border">放线申请信息</button>');
		
		$("#searchDiv .clearfix").removeClass("clearfix");
		
		$('#showDrawLineApplyInfos').on('click',function(){
			drawLineDeployment.drawLineApplyModal.modal("show");
		});
	});
	
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	
	drawLineDeployment.drawLineApplyModal.on('shown.bs.modal', function(e){
		initPlan();
	});
	
	//$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true, startDate:'d+3'}).next().on(ace.click_event, function(){
	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	$('#startTime').timepicker({
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});
	
	$('#endTime').timepicker({
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});
});

function initPlan(){
	
	$('#calendar').fullCalendar('destroy');
	$('#calendar').fullCalendar('today');
	
	$('#calendar').fullCalendar({
		buttonText: {    
            today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
		}, 
		dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],    
		monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], 
		eventLimit: true,
		events: function(start, end, callback){
			
			var startTime = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
			var endTime = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 23:59:59";
			
			var options = {
				"drawLine.startTime": startTime,
				"drawLine.endTime": endTime,
			}
			
			com.post(api.construction.queryDecorationOrderDrawLineForCountByDate, options, function(res){
				drawLineDeployment.drawLineDateCount = res.drawLineDateCount;
				
				var events = [];
				
				for(var i in drawLineDeployment.drawLineDateCount){
				 
					var s = i.split('-');
					var drawLineDateCount = drawLineDeployment.drawLineDateCount[i];
					
					for(var j in drawLineDeployment.drawLineDateCount[i]){
						
						var _ = drawLineDateCount[j];
						
						var event = {
							title: j + _ + "个",
							start: new Date(s[0], s[1]-1, s[2]),
							allDay: true
						}
						
						events.push(event);
					}
				}
				
				callback(events);
			});
		}
	})
}

function initDrawLineDeploymentList(i, groupName){
	
	var drawLineGroupList = $("#drawLineGroupList");
	var groupDiv = $("<div></div>").addClass("col-xs-12 col-md-12 no-padding widget-container-span ui-sortable").attr("id", "Group_"+i).appendTo(drawLineGroupList);
	var groupWidgetBox = $("<div></div>").addClass("widget-box").appendTo(groupDiv);
	var groupWidgetHeader = $("<div></div>").addClass("widget-header").appendTo(groupWidgetBox);
	var groupH5 = $("<h5></h5>").appendTo(groupWidgetHeader);
	var groupStrong = $("<strong></strong>").attr("id", "labGroup_"+i).text(groupName).appendTo(groupH5);
	var groupWidgetToolbar = $("<div></div>").addClass("widget-toolbar").appendTo(groupWidgetHeader);
	var groupA = $("<a></a>").attr("href", "#").attr("data-action", "collapse").appendTo(groupWidgetToolbar);
	var groupI = $("<i></i>").addClass("1 bigger-125 icon-chevron-up").appendTo(groupA);
	var groupWidgetBody = $("<div></div>").addClass("widget-body").appendTo(groupWidgetBox);
	var groupWidgetBodyInner = $("<div></div>").addClass("widget-body-inner").css("display", "block").appendTo(groupWidgetBody);
	var groupTable = $("<table></table>").attr("id", "listGridGroup_"+i).attr("dataIndex", i).appendTo(groupWidgetBodyInner);
	var groupGridDiv = $("<div></div>").attr("id", "gridPagerGroup_"+i).appendTo(groupWidgetBodyInner);
	
	$("#listGridGroup_"+i).jqGrid({
		url: api.construction.pageDecorationOrderDrawLineForAssign.url, 
		postData:{"drawLine.drawLineGroup":groupName,"filters[0].field":"orderId","filters[0].op":"eq","filters[0].data":"null"},
		colNames:['autoId', '订单编号', '放线时间', '楼盘地址', '面积 ', '合同额', '折扣', '申请人', '监理', '报价版本', '状态 ', '备注', '操作', 'houseNumber', 'startTime', 'endTime', 'drawLineGroup', 'cityP'],
		colModel:[
		    {name:'autoId',hidden:true},
		    {name:'orderId'},
		    {name:'actualDate',formatter: actualDateInit,width:300},
		    {name:'village',formatter: villageInit,width:300},
		    {name:'houseArea'},
		    {name:'orderTotalPrice'},
		    {name:'discount'},
		    {name:'applayUser'},
		    {name:'supervisor'},
		    {name:'versionName'},
		    {name:'status',formatter: statusInit},
			{name:'applayDes',formatter: applayDesInit},		
			{name:'action', width:180, sortable:false, editable:false, formatter:actionInit},
			{name:"houseNumber", hidden:true},
			{name:'startTime', hidden:true},
			{name:'endTime', hidden:true},		
			{name:'drawLineGroup', hidden:true},
			{name:"cityProper", hidden:true}
		], 
		pager : "#gridPagerGroup_"+i,
		gridComplete: function () {
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel="tooltip"]').tooltip({container:'#DrawLineDeploymentPageContent'});
			
			var grid = $(this);
			var rowNum = grid.getGridParam("reccount");
			var gridName = grid.attr("id");
			
			for(var i=1;i<=rowNum;i++){
				var rowInfo = grid.jqGrid('getRowData', i);
				var supervisor = rowInfo.supervisor;
				
				if(supervisor != null && supervisor != "" && supervisor != "null" && supervisor != undefined && supervisor != "undefined"){
					$("#" + gridName + " tr[id=" + (i) + "]").css('background-color', '#ccffdd');
				}
			}
        },
		caption: ""
	});
}

function statusInit(cellvalue, options, rowdata){
	
	if(rowdata.status == "放线失败"){
		return '<span class="label label-danger arrowed">'+rowdata.status+'</span>';
	}
	
	if(rowdata.status == "放线成功"){
		return '<span class="label label-success arrowed-right">'+rowdata.status+'</span>';
	}
	
	if(rowdata.status == "申请放线"){
		return '<span class="label label-warning">'+rowdata.status+'</span>';
	}
	
	return cellvalue;
}

function actualDateInit(cellvalue, options, rowdata){
	return rowdata.actualDate+" "+rowdata.startTime+"~"+rowdata.endTime;
}

function applayDesInit(cellvalue, options, rowdata){
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowdata.applayDes+'">说明</span>';
	html += "<input type='text' class='hide' value='"+rowdata.applayDes+"' />";
	return html;
}

function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.cityProper+rowdata.village + ''+rowdata.houseNumber;
	return html;
}

function supervisorInit(cellvalue, options, rowdata){
	return cellvalue;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	if(rowdata.status == '申请放线'){
		result += '<button id="deployedBtn" class="btn btn-minier btn-blue" onclick="updateDeployed(\''+options.gid+'\',\''+rowdata.autoId+'\',\''+rowdata.actualDate+'\',\''+rowdata.startTime+'\',\''+rowdata.endTime+'\',\''+rowdata.drawLineGroup+'\')">编辑</button>';
		result += '<button id="deployedBtn" class="btn btn-minier btn-primary" onclick="deployed(\'' + options.gid + '\',\'' + options.rowId + '\',\'' + rowdata.orderId+'\');">人员部署</button>';
	}
	if(rowdata.status == '放线失败' || rowdata.status == '放线成功'){
		
	}else{
		result += '<button id="deployedBtn" class="btn btn-minier btn-yellow" onclick="reset(\''+options.gid+'\',\''+rowdata.autoId+'\')">重置</button>';
	}
	
	result += '</div>';
	
	return result;
}

function deployed(gid, rowId, orderId){
	
	drawLineDeploymentPostData["listGridGroupId"] = gid;
	drawLineDeploymentPostData["listGridGroupTrId"] = rowId;
	
	var options = {};
	options["constructionSchedule.orderId"] = orderId;
	
	com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
		
		var queryUserNameUrl = "";
		
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
			
			if(res.constructionSchedule[qualityName+"QualityName"] == null){
				$("#"+qualityName+"Quality").val("");
				$("#"+qualityName+"Quality_chosen span")[0].textContent = "";
			}else{
				$("#"+qualityName+"Quality").val(res.constructionSchedule[qualityName + "QualityId"]);
				$("#"+qualityName+"Quality_chosen span")[0].textContent = res.constructionSchedule[qualityName + "QualityName"] + "-" + res.constructionSchedule[qualityName + "QualityId"];
			}
			
			qualityIds[qualityName] = res.constructionSchedule[qualityName+"QualityId"];
			
			$("#"+qualityName+"Quality_chosen").css("width", "150px");
		}
		
		drawLineDeploymentPostData["orderId"] = orderId;
		
		var rowInfo = $("#"+gid).jqGrid('getRowData', rowId);
		
		$("#orderInfos").html(rowInfo.orderId + " " + rowInfo.village);
		
		drawLineDeployment.drawLineDeploymentModal.modal("show");
	}, function(){
		com.showAlert(com.error, "获取订单对应人员部署信息失败!");
	});
}

function updateDeployed(gid,autoId,actualDate,startTime,endTime,drawLineGroup){
	$("#autoId").val(autoId);
	$("#actualDate").datepicker('update', actualDate);
	$("#startTime").val(startTime);
	$("#endTime").val(endTime);
	$("#drawLineGroup").val(drawLineGroup);
	$("#groupIndex").val($("#"+gid).attr("dataIndex"));
	
	drawLineDeployment.drawLineModal.modal("show");
}

function saveData(){
	bootbox.confirm("确认提交申请吗？",function(res){
		if(res){
			if(com.validate("drawLineModal")){
				return;
			}
			
			var start = Date.parse($("#actualDate").val().replace("-","/") +" " +$("#startTime").val());
			var end = Date.parse($("#actualDate").val().replace("-","/") +" " +$("#endTime").val());
			
			if(start == NaN || end==NaN || start>=end){
				bootbox.alert("起始时间和结束时间非法");
				return;
			}
			
			var options ={
				"drawLine.autoId":$("#autoId").val(),
				"drawLine.actualDate":$("#actualDate").val(),
				"drawLine.startTime":$("#startTime").val(),
				"drawLine.endTime":$("#endTime").val(),
				"drawLine.drawLineGroup":$("#drawLineGroup").val()
			};
			
			com.post(api.construction.saveDecorationOrderDrawLine, options, function(res){
				com.showAlert(com.info, "提交成功");
				$.jgrid.refreshGrid($("#listGridGroup_"+$("#groupIndex").val()), {"drawLine.drawLineGroup":drawLineDeployment.drawLineGroup[$("#groupIndex").val()].key});
				if($("#groupIndex").val()!=$("#drawLineGroup").get(0).selectedIndex){
					$.jgrid.refreshGrid($("#listGridGroup_"+$("#drawLineGroup").get(0).selectedIndex), {"drawLine.drawLineGroup": $("#drawLineGroup").val()});	
				}
				$('[data-rel="tooltip"]').tooltip('destroy');
				$('[data-rel="tooltip"]').tooltip({container:'#DrawLineDeploymentPageContent'});
			});
			drawLineDeployment.drawLineModal.modal("hide");
		}else{
			return ;
		}
	});
}

function drawLineDeployed(){
	console.log("drawLinedeployed");
	
	if(validateDeployed()){
		return;
	}
	
	var options = {};
	
	for(var qualityId in qualityIds){
		options["constructionSchedule."+qualityId+"QualityId"] = qualityIds[qualityId];
	}
	options["constructionSchedule.orderId"] = drawLineDeploymentPostData["orderId"];
	
	com.post(api.construction.updateConstructionScheduleByOrderId, options, function(res){
		
		var gid = drawLineDeploymentPostData["listGridGroupId"];
		var rowId = drawLineDeploymentPostData["listGridGroupTrId"];
		
		$("#" + gid + " tr[id=" + rowId + "]").css('background-color', '#ccffdd');
		
		com.showAlert(com.info, "人员部署成功!");
	});
	
	drawLineDeployment.drawLineDeploymentModal.modal("hide");
}

function reset(gid,autoId){
	bootbox.confirm("确认重置申请吗？",function(res){
		if(res){
			com.post(api.construction.drawLineForFailure, {"drawLine.autoId":autoId}, function(res){
				if(res.errorCode == 0){
					com.showAlert(com.info, "提交成功");
					$.jgrid.refreshGrid($("#"+gid), {"drawLine.drawLineGroup":drawLineDeployment.drawLineGroup[$("#"+gid).attr("dataIndex")].key});
				}else{
					com.showAlert(com.info, "操作失败");
				}
			});
		}
	});
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

function validateDeployed(){
	
	com.clearValidator();
	
	var count = 0;
	
	for(var qualityName in qualityInfo){
		
		var inputObj = $("#"+qualityName+"Quality");
		var chosenObj = $("#"+qualityName+"Quality_chosen span");
		
		if($.trim(chosenObj[0].textContent) == ""){
			com.showTips(inputObj, "内容不能为空");
			count++
		}
	}
	
	return count == 0 ? false : true;
}

function successCallback(){
	
}

function failCallback(){
	
}

function cleanItems(){
	
}