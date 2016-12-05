
jQuery(function($) {
	
	var drawLineDeployment = {
		saveBtn: null,
		cancellBtn: null,
		deployedBtn: null,
		modal: null,
		drawLineDeploymentItems: {},
		
		drawLineGroup:[],
		
		postData:{},
		editFlag: false,
		
		deployedFlag: false,
		
		drawLineDateCount:null
	};
	
	var drawLineDeploymentPostData = {};

	var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
	var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
	var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};
	
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
	
	drawLineDeployment.drawLineApplyModal = $("#drawLineApplyModal");
	
	com.post(api.ds.drawLineInfo, {}, function(res){
		$("#drawLineGroup").bindData(res.drawLineGroup, 'key', 'value');
		
		$.each(res.drawLineGroup, function(i, v){
			drawLineDeployment.drawLineGroup.push(v.value);
		});
	}, null, false);
	
	$('.date-picker').datepicker({format:'yyyy-mm-dd' ,autoclose:true, todayBtn:true, todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	$("#searchDiv .clearfix").removeClass("clearfix");
		
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	
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
		
		com.initChosen(qualityName + 'Quality', queryUserNameUrl, "pinyinName", options, "autoFillKeyValue", "key", "value");
	}
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            if(listData && listData.length){ 
                $.each(listData,function(i, v){
                    creatLine(v);
                });
            }
        };

        var creatLine = function(v){
        	
        	var $i = drawLineDeployment.drawLineGroup.indexOf(v.drawLineGroup)
        	var $tableWrap = $("#group" + $i);
        	
        	if(!$tableWrap.attr('id')){
        		var resultList = $("#resultList");
        		var groupDiv = $("<div></div>").addClass("col-xs-6 col-md-6 widget-container-span ui-sortable").appendTo(resultList);
        		var groupWidgetBox = $("<div></div>").addClass("widget-box transparent").appendTo(groupDiv);
        		var groupWidgetHeader = $("<div></div>").addClass("widget-header").appendTo(groupWidgetBox);
        		var groupH5 = $("<h4></h4>").appendTo(groupWidgetHeader);
        		var groupStrong = $("<strong></strong>").text(v.drawLineGroup).appendTo(groupH5);
        		var groupWidgetBody = $("<div></div>").addClass("widget-body").appendTo(groupWidgetBox);
        		var groupWidgetBodyInner = $("<div></div>").addClass("widget-body-inner").css("display", "block").appendTo(groupWidgetBody);
        		var resultList = $('<div></div>').attr("id", "group" + $i).addClass("clearfix tab-pane active").appendTo(groupWidgetBodyInner);
        		
        		$tableWrap = resultList;
        	}
        	
        	var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);
            var $liLine = $('<li></li>').addClass('item-blue clearfix').appendTo($ul);
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-blue').html('编辑');
            var $btnDeplory = $('<a></a>').addClass('btn btn-minier btn-primary').html('人员部署');
            var $btnReset = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重置');
            
            var propertyArr = [
               ["楼盘地址:", v.village + ' ' + v.houseNumber, "grey"],
               ["面积:", v.houseArea, "blue"],
               ["合同额:", v.orderTotalPrice, "blue"],
               ["折扣:", v.discount, "blue"],
               ["申请人:", v.applayUser, "grey"],
               ["监理:", v.supervisor, "grey"],
               ["放线时间:", v.actualDate, "grey"],
               ["开始时间:", v.startTime, "grey"],
               ["结束时间:", v.endTime, "grey"],
               ["报价版本:", v.versionName, "green"],
               ["状态:", v.status, "red"],
               ["描述:", v.applayDes, "grey"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });
           
           if(v.status == '申请放线'){
        	   $divBtnWrap.append($btnEdit).append($btnDeplory).append($btnReset).appendTo($h3);
           }
            
           $liLine.append($h3).append($ulProperty);
            
           $btnEdit.click(function(){
        	   updateDeployed(v);
           });
           
           $btnDeplory.click(function(){
        	   deployed(v);
           });
           
           $btnReset.click(function(){
        	   reset(v.dlId);
           });
            
        };
      
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["drawLineStatus", "actualDate"], "condList", api.drawline.queryDrawLine, function(data){
		$("#resultList").html("");
		displayFunc.init('resultList', data);
	}, "pagenation", "drawLineDeploymentPostData", null, true, "drawLines");
	
	$("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');
	
	$('#showDrawLineApplyInfos').on('click',function(){
		drawLineDeployment.drawLineApplyModal.modal("show");
	});
	
	function updateDeployed(v){
		$("#dlId").val(v.dlId);
		$("#actualDate").datepicker('update', v.actualDate);
		$("#startTime").val(v.startTime);
		$("#endTime").val(v.endTime);
		$("#drawLineGroup").val(v.drawLineGroup);
		
		drawLineDeployment.drawLineModal.modal("show");
	}
	
	function deployed(v){
		
		var options = {
			"constructionSchedule.orderId": v.orderId,
		};
		
		com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
			
			var queryUserNameUrl = "";
			
			for(var qualityName in qualityInfo){
				
				if(res.constructionSchedule[qualityName+"QualityName"] != null){
					com.updateChosen(qualityName+"Quality", res.constructionSchedule[qualityName + "QualityId"], res.constructionSchedule[qualityName + "QualityName"])
				}
				
				qualityIds[qualityName] = res.constructionSchedule[qualityName+"QualityId"];
			}
		});
		
		drawLineDeploymentPostData.orderId = v.orderId;
		
		$("#orderInfos").html(v.orderId + " " + v.village);
		
		drawLineDeployment.drawLineDeploymentModal.modal("show");
	}
	
	function reset(dlId){
		bootbox.confirm("确认重置申请吗？",function(res){
			if(res){
				com.post(api.drawline.setDrawLineForFailure, {"drawLine.dlId":dlId}, function(res){
					searcher.doSearch();
				});
			}
		});
	}
	
	function saveData(){
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
			"drawLine.dlId":$("#dlId").val(),
			"drawLine.actualDate":$("#actualDate").val(),
			"drawLine.startTime":$("#startTime").val(),
			"drawLine.endTime":$("#endTime").val(),
			"drawLine.drawLineGroup":$("#drawLineGroup").val()
		};
		
		com.post(api.drawline.resetDrawLine, options, function(res){
			searcher.doSearch();
		});
		
		drawLineDeployment.drawLineModal.modal("hide");
	}

	function drawLineDeployed(){
		
		var options = {
			"constructionSchedule.orderId": drawLineDeploymentPostData["orderId"],
		};
		
		for(var qualityId in qualityIds){
			
			var $id = $('#' + qualityId + 'Quality').val();
			
			if(!$id){
				com.showTips($("#"+qualityId+"Quality_chosen"), "内容不能为空");
				return;
			}
			
			options["constructionSchedule."+qualityId+"QualityId"] = $id;
		}
		
		com.post(api.construction.updateConstructionScheduleByOrderId, options, function(res){
			searcher.doSearch();
		});
		
		drawLineDeployment.drawLineDeploymentModal.modal("hide");
	}

	drawLineDeployment.drawLineApplyModal.on('shown.bs.modal', function(e){
		initPlan();
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
				
				com.post(api.drawline.countDrawLineByDate, options, function(res){
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
		});
	}
	
});
