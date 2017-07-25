
jQuery(function($) {
	var	pageGroup = new Array();
	var drawLineDeployment = {
		saveBtn: null,
		cancellBtn: null,
		deployedBtn: null,
		modal: null,
		drawLineDeploymentItems: {},
		
		drawLineGroup:[],
		
		postData:{},
		editFlag: false,
		up : false,
		deployedFlag: false,

		drawLineDateCount:null
	};
	
	var drawLineDeploymentPostData = {};

	var qualityInfo = {"supervisor":"工程部监理", "chan":"铲大白工人", "putline":"放线小组", "waterwayCircuitPower":"水暖,电,力", "bricklay":"瓦工", "carpent":"木工", "oil":"油工", "cleaning":"保洁工"};
	var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
	var qualityFlag = {"supervisor":false, "chan":false, "putline":false, "waterwayCircuitPower":false, "bricklay":false, "carpent":false, "oil":false, "cleaning":false};
	
//	$('#fl-statement').statement("放线申请管理", "放线申请信息列表");
	//保存按钮   编辑   状态确认
	drawLineDeployment.saveBtn = $("#saveBtn").on("click", saveData);
	//人员部署确认按钮
	drawLineDeployment.deployedBtn = $("#deployedBtn").on("click", drawLineDeployed);
	//编辑 与状态确认的取消按钮
	drawLineDeployment.cancelBtn = $("#cancelBtn");
	//人员部署的动态模块的DIV
	drawLineDeployment.drawLineDeploymentModal = $("#drawLineDeploymentModal");
	//放线确认信息的动态模块DIV
	drawLineDeployment.drawLineModal = $("#drawLineModal");
	//人员部署中监理的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.supervisorQuality = $("#supervisorQuality");
	//人员部署中铲大白的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.chanQuality = $("#chanQuality");
	//人员部署中放线质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.putlineQuality = $("#putlineQuality");
	//人员部署中水电力质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.waterwayCircuitPowerQuality = $("#waterwayCircuitPowerQuality");

	drawLineDeployment.drawLineDeploymentItems.powerQuality = $("#powerQuality");
	//人员部署中瓦工质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.bricklayQuality = $("#bricklayQuality");
	//人员部署中木工质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.carpentQuality = $("#carpentQuality");
	//人员部署中油工质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.oilQuality = $("#oilQuality");
	//人员部署中保洁质检的select标签与DIV
	drawLineDeployment.drawLineDeploymentItems.cleaningQuality = $("#cleaningQuality");
	
	drawLineDeployment.drawLineApplyModal = $("#drawLineApplyModal");
	//同步的ajax

	com.post(api.data.queryDrawlineGroup, {}, function(res){
		if(res.drawLineGroups == null|| res.drawLineGroups == ""){
			drawLineDeployment.up = true;
		}
		//绑定select标签,第一个是参数,第二个是option的标签ID 第三个值是循环的value的值
		$("#drawLineGroup").bindData(res.drawLineGroups, 'gid', 'name');
		
		$.each(res.drawLineGroups, function(i, v){
			drawLineDeployment.drawLineGroup.push(v.name);
		});
	}, null, false);
	
	$('.date-picker').datepicker(
		{	//显示的时间格式
			format:'yyyy-mm-dd' ,
			//当选择一个日期后是否立即关闭
			autoclose:true,
			//如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "Today"
			// 按钮用以选择当前日期。如果是true的话，"Today" 按钮仅仅将视图转到当天的日期，如果是"linked"，当天日期将会被选中。
			todayBtn:true,
			//如果为true, 高亮当前日期。
			todayHighlight:true
		}
	).next().on(ace.click_event, function(){
		//上一个同级元素获取焦点
		$(this).prev().focus();
	});
	
	$("#searchDiv .clearfix").removeClass("clearfix");
	//获取下一个同类标签的焦点
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	
	$('.date-picker').datepicker(
		{	//显示的时间格式
			format:'yyyy-mm-dd' ,
			//当选择一个日期后是否立即关闭
			autoclose:true,
			//如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "Today"
			// 按钮用以选择当前日期。如果是true的话，"Today" 按钮仅仅将视图转到当天的日期，如果是"linked"，当天日期将会被选中。
			todayBtn:true,
			//如果为true, 高亮当前日期。
			todayHighlight:true
		}
	).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	//编辑模块中的开始时间选项
	$('#startTime').timepicker({
		//可选时间分钟间隔   1为每一分钟一选
		minuteStep: 1,
		//是否显示秒字段
		showSeconds: false,
		//默认是false  true为12小时制  false为24小时制。
		showMeridian: false
	});
	
	$('#endTime').timepicker({
		//可选时间分钟间隔   1为每一分钟一选
		minuteStep: 1,
		//是否显示秒字段
		showSeconds: false,
		//默认是false  true为12小时制  false为24小时制。
		showMeridian: false
	});
	//循环定义好的字典
	for(var qualityName in qualityInfo){
		//创建个局部变量
		var options = {};

		if(qualityName == "supervisor"){
			//给options赋值 duty是职位 工程部监理
			options["duty"] = qualityInfo[qualityName];
			queryUserNameUrl = api.personel.queryUserForNameByDuty;
		}else if(qualityName == "waterwayCircuitPower"){
			//交集查询
			queryUserNameUrl = api.personel.queryUserForNameByDutysAO;
			//根据,拆分成数组
			dutys = qualityInfo[qualityName].split(",");
			for(var i=0;i<dutys.length;i++){
				//根据数组 将所有字段后面拼接一个字  赋值给字典中
				options["dutysO["+i+"]"] = dutys[i]+"工";
			}
			//根据职位查找员工
			options["dutys[0]"] = "质检";
		}else{
			//联合查询
			//员工职位1
			options["dutys[0]"] = qualityInfo[qualityName];
			//员工职位2
			options["dutys[1]"] = "质检";
			queryUserNameUrl = api.personel.queryUserForNameByDutys;
		}
		//select标签的下拉框的样式  第一个参数为显示ID,第二个为API路径,第三个为前台输入的拼音,第四个为查询条件,第五个为返回的数组,第六个为数组中的KEY,第七个为数组中的value
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

			var drawLineGroup = v.drawLineGroup;
			var nub = 0;
			var boo = true ;
			if(pageGroup.length>0){
				$.each(pageGroup,function(i, v){
					if(v == drawLineGroup){
						nub = pageGroup.indexOf(drawLineGroup);
						return false;
					}
				})
			}else {
				pageGroup.push(drawLineGroup);
				boo = false ;
			}

			if(nub == 0 && pageGroup.length>0 && boo){
				pageGroup.push(drawLineGroup);
				nub = pageGroup.indexOf(drawLineGroup);
			}

			var $tableWrap = $("#group" + nub);
        	//如果创建的标签中的ID为空
        	if(!$tableWrap.attr('id')){
        		var resultList = $("#resultList");
        		var groupDiv = $("<div></div>").addClass("col-xs-6 col-md-6 widget-container-span ui-sortable").appendTo(resultList);
        		var groupWidgetBox = $("<div></div>").addClass("widget-box transparent").appendTo(groupDiv);
        		var groupWidgetHeader = $("<div></div>").addClass("widget-header").appendTo(groupWidgetBox);
        		var groupH5 = $("<h4></h4>").appendTo(groupWidgetHeader);
        		var groupStrong = $("<strong></strong>").text(v.drawLineGroup).appendTo(groupH5);
        		var groupWidgetBody = $("<div></div>").addClass("widget-body").appendTo(groupWidgetBox);
        		var groupWidgetBodyInner = $("<div></div>").addClass("widget-body-inner").css("display", "block").appendTo(groupWidgetBody);
        		var resultList = $('<div></div>').attr("id", "group" + nub).addClass("clearfix tab-pane active").appendTo(groupWidgetBodyInner);
        		
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
			   //绑定事件  显示编辑的模态块
        	   updateDeployed(v);
           });
           
           $btnDeplory.click(function(){
				//显示人员部署模块框
        	   deployed(v);
           });
           
           $btnReset.click(function(){
				//放线信息ID
        	   reset(v.dlId);
           });
            
        };
      
        return {
            init : function(tableId,listData){
				//创建DIV 并且内容为null
                $('#' + tableId).html(null);

                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	//查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名,分页查询的其他查询参数{key:val}形式,不分页标识,
	searcher.init(["drawLineStatus", "actualDate"], "condList", api.drawline.queryDrawLine, function(data){
		$("#resultList").html("");
		displayFunc.init('resultList', data);
	}, "pagenation", "drawLineDeploymentPostData", null, true, "drawLines");
	//拼接一个按钮
	$("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');
	//点击申请信息 显示模块
	$('#showDrawLineApplyInfos').on('click',function(){
		drawLineDeployment.drawLineApplyModal.modal("show");
	});
	
	function updateDeployed(v){
		$("#dlId").val(v.dlId);
		//update使用当前输入框中的值更新日期时间选择器。
		$("#actualDate").datepicker('update', v.actualDate);
		$("#startTime").val(v.startTime);
		$("#endTime").val(v.endTime);
		$("#drawLineGroup").val(v.gid);
		//显示模态块
		drawLineDeployment.drawLineModal.modal("show");
		if(drawLineDeployment.up){
			bootbox.alert("无可用放线小组");
		}

	}
	
	function deployed(v){
		//订单编号
		var options = {
			"construction.orderId": v.orderId,
		};
		//通过订单编号获取人员信息
		com.post(api.construction.queryConstructionForWorkerNameByOrderId, options, function(res){
			
			var queryUserNameUrl = "";
			
			for(var qualityName in qualityInfo){
				//判断返回的字段是否有值
				if(res.construction[qualityName+"QualityName"] != null){
					//更新信息    第一个值是想更新信息的ID名,第二个是创建的option的value值,第三个是显示的value值
					com.updateChosen(qualityName+"Quality", res.construction[qualityName + "QualityId"], res.construction[qualityName + "QualityName"])
				}
				
				qualityIds[qualityName] = res.construction[qualityName+"QualityId"];
			}
		});
		
		drawLineDeploymentPostData.orderId = v.orderId;
		//人员部署的表头
		$("#orderInfos").html(v.orderId + " " + v.village);
		//显示人员部署的动态模块
		drawLineDeployment.drawLineDeploymentModal.modal("show");
	}
	
	function reset(dlId){
		//弹出确认框
		bootbox.confirm("确认重置申请吗？",function(res){
			//如果为ture
			if(res){
				//更新状态为放线失败
				com.post(api.drawline.setDrawLineForFailure, {"drawLine.dlId":dlId}, function(res){
					//重新查询分页信息
					com.showAlert(com.info, "操作成功");
					searcher.doSearch();
				});
			}
		});
	}
	
	function saveData(){
		//正则表达式
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
			"drawLine.gid":$("#drawLineGroup").val()
		};
		//重置放线 , 重新设置相关信息
		com.post(api.drawline.resetDrawLine, options, function(res){
			com.showAlert(com.info, "操作成功");
			searcher.doSearch();
		});
		
		drawLineDeployment.drawLineModal.modal("hide");
	}

	function drawLineDeployed(){
		
		var options = {
			"construction.orderId": drawLineDeploymentPostData["orderId"],
		};
		
		for(var qualityId in qualityIds){
			
			var $id = $('#' + qualityId + 'Quality').val();
			
			if(!$id){
				com.showTips($("#"+qualityId+"Quality_chosen"), "内容不能为空");
				return;
			}
			
			options["construction."+qualityId+"QualityId"] = $id;
		}
		//通过订单编号更新工程信息
		com.post(api.construction.updateConstructionByOrderId, options, function(res){
			com.showAlert(com.info, "操作成功");
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
