jQuery(function($) {
	var constructionNode = {};
	var workerAllocationDetail = {

		controlCondition: false,

		constructionSchedules: {},

		operateDict: {
			"1": {
				name: "chan",
				setStatusUrl: api.construction.setConstructionScheduleForStatus,
				duty: "铲大白工人",
			}, "2": {
				name: "putline",
				setStatusUrl: api.construction.setConstructionScheduleForStatus,
				duty: "放线小组",
			}, "3": {
				name: "waterwayCircuitPower",
				waterwayDuty: "水暖工",
				circuitDuty: "电工",
				powerDuty: "力工",
				waterwayCircuitDuty: "水电工",
			}, "4": {
				name: "bricklay",
				duty: "瓦工",
			}, "5": {
				name: "groundLeveling",
				duty: "地面找平",
			}, "6": {
				name: "carpent",
				duty: "木工",
			}, "7": {
				name: "oil",
				duty: "油工",
			}, "8": {
				name: "waterwayCircuitCheck",
				waterwayDuty: "水暖工",
				circuitDuty: "电工",
				powerDuty: "力工",
				waterwayCircuitDuty: "水电工",
			}, "9": {
				name: "cleaning",
				duty: "保洁工",
			},
		},

		wizardSept: {
			"1": false,
			"2": false,
			"3": false,
			"4": false,
			"5": false,
			"6": false,
			"7": false,
			"8": false,
			"9": false,
		},
	};

	var orderId = params.orderId;

	//获取所有节点
	com.post(api.data.queryConstructionNode, {}, function(res){
		$.each(res.constructionNodes, function(i, v){
			constructionNode[v.cnid] = v.name;
		})
	}, null, false);

	//动态获取节点轴
	com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId":params.orderId}, function(res){

		var constructionSchedule = res.constructionSchedules;

		workerAllocationDetail.constructionSchedules = res.constructionSchedules;

		$.each(constructionSchedule, function(i, v){
			constructerNode("#stepId", v.schedule);
			constructerPane("#step-container", v.schedule, workerAllocationDetail.operateDict[v.schedule].name);
		});

		var stepnum = constructionSchedule[0].schedule;
		initWizardSept(workerAllocationDetail.operateDict[stepnum], stepnum);

		$('#fuelux-wizard').ace_wizard({status:true}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){
			var stepId = $("[flag]").eq(info.step-1).attr("id");
			var sd = stepId.substring(4);
			if(!workerAllocationDetail.wizardSept[sd]){
				initWizardSept(workerAllocationDetail.operateDict[sd], sd);
			}
		});
	},null,false);

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('[data-rel=popover]').popover({html:true});

	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.workerAllocationIndex.url);
	});

	function initWizardSept(operate, schedule){

		addActive(schedule);

		var elementPostData = {};
		var workerInfoCondition = false;

		var orderId = params.orderId;
		elementPostData["constructionSchedule.orderId"] = params.orderId;
		elementPostData["constructionSchedule.schedule"] = schedule;
		workerAllocationDetail.controlCondition = false;

		com.post(api.construction.queryConstructionScheduleByOrderId, elementPostData, function(res){

			var element = res.constructionSchedules;

			if(schedule == 1){
				$("#" + operate.name + "StartTime").val( element[0].startTime);
				$("#" + operate.name + "EndTime").val( element[0].endTime);

				var chanStatus = element[0].status;
				var chanSuccessBtn = $("#chanSuccess");
				var chanFailBtn = $("#chanFail");
				var chanDelayBtn = $("#chanDelay");
				var chanPassBtn = $("#chanPass");

				chanSuccessBtn.click(function(){
					var options = {};

					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 1;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.info, "铲大白成功!");
						chanSuccessBtn.attr("disabled", "disabled");
						chanFailBtn.attr("disabled", "disabled");
						chanDelayBtn.attr("disabled", "disabled");
						chanPassBtn.attr("disabled", "disabled");

						changeChanStatus(1);
					});
					return false;
				});

				chanFailBtn.click(function(){
					var options = {};

					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 2;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.warning, "铲大白失败!");
						chanSuccessBtn.attr("disabled", "disabled");
						chanFailBtn.attr("disabled", "disabled");
						chanDelayBtn.attr("disabled", "disabled");
						chanPassBtn.attr("disabled", "disabled");

						changeChanStatus(2);
					});
					return false;
				});

				chanDelayBtn.click(function(){
					var options = {};
					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 3;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.warning, "铲大白延迟!");
						chanFailBtn.attr("disabled", "disabled");
						chanDelayBtn.attr("disabled", "disabled");

						changeChanStatus(3);
					});
					return false;
				});

				chanPassBtn.click(function(){
					var options = {};
					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 4;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.info, "铲大白通过!");
						chanSuccessBtn.attr("disabled", "disabled");
						chanFailBtn.attr("disabled", "disabled");
						chanDelayBtn.attr("disabled", "disabled");
						chanPassBtn.attr("disabled", "disabled");

						changeChanStatus(4);
					});
					return false;
				});

				changeChanStatus(chanStatus);

				if(chanStatus == 1 || chanStatus == 2 || chanStatus == 4){
					chanSuccessBtn.attr("disabled", "disabled");
					chanFailBtn.attr("disabled", "disabled");
					chanDelayBtn.attr("disabled", "disabled");
					chanPassBtn.attr("disabled", "disabled");
				}else if( chanStatus == 3){
					chanFailBtn.attr("disabled", "disabled");
					chanDelayBtn.attr("disabled", "disabled");
				}

				var options = {};
				options["constructer.orderId"] = params.orderId;
				options["constructer.schedule"] = schedule;

				com.post(api.construction.queryConstructerByOrderId, options, function (res) {
					queryWorkerUrl(operate, res);
				}, null, false);


				com.initChosen('chanWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

				$("#chanWorkerSubmit").unbind("click");
				$("#chanWorkerSubmit").on("click", function(){
					var args = {};
					args["constructer.cid"] = element[0].cid;
					args["constructer.schedule"] = schedule;
					args["constructer.user.userId"] = $('#chanWorkerName').val();

					if($("#chanWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}

					com.post(api.construction.addConstructer, args, function(res){
							setWorkerUrl(operate, res);
					});
					return false;
				});

				if( workerInfoCondition){
					if( element[0].status != undefined && ( element[0].status == 0 || element[0].status == 2)){
						workerAllocationDetail.controlCondition = false;
					}else if( element[0].status != undefined && element[0].status == 1){
						workerAllocationDetail.controlCondition = true;
					}else{
						workerAllocationDetail.controlCondition = true;
					}
				}else if( !workerInfoCondition){
					if( element[0].status != undefined && element[0].status == 4){
						workerAllocationDetail.controlCondition = true;
					}
				}
			}else if(schedule == 2){

				$("#" + operate.name + "StartTime").val( element[0].startTime).attr("disabled", "disabled");

				var options = {};
				options["constructer.orderId"] = params.orderId;
				options["constructer.schedule"] = schedule;

				com.post(api.construction.queryConstructerByOrderId, options, function (res) {
					queryWorkerUrl(operate, res);
				}, null, false);


				com.initChosen('putlineWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

				$("#putlineWorkerSubmit").unbind("click");
				$("#putlineWorkerSubmit").on("click", function(){
					var args = {};
					args["constructer.cid"] = element[0].cid;
					args["constructer.schedule"] = schedule;
					args["constructer.user.userId"] = $('#putlineWorkerName').val();

					if($("#putlineWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}

					com.post(api.construction.addConstructer, args, function(res){
							setWorkerUrl(operate, res);
						});
					return false;
				});

				var putlineStatus = element[0].status;
				var putlineSuccessBtn = $("#putlineSuccess");
				var putlineFailBtn = $("#putlineFail");

				changeFangStatus(putlineStatus);

				if(putlineStatus == 2 || putlineStatus == 1){
					putlineSuccessBtn.attr("disabled", "disabled");
					putlineFailBtn.attr("disabled", "disabled");
				}

				putlineSuccessBtn.click(function(){

					var options = {};
					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 1;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.info, "成功放线!");
						putlineSuccessBtn.attr("disabled", "disabled");
						putlineFailBtn.attr("disabled", "disabled");

						changeFangStatus(1);
					});

					return false;
				});

				putlineFailBtn.click(function(){

					var options = {};
					options["constructionSchedule.csId"] = element[0].csId;
					options["constructionSchedule.orderId"] = orderId;
					options["constructionSchedule.status"] = 2;

					com.post(operate.setStatusUrl, options, function(res){
						com.showAlert(com.warning, "放线失败!");
						putlineSuccessBtn.attr("disabled", "disabled");
						putlineFailBtn.attr("disabled", "disabled");

						changeFangStatus(2);
					});

					return false;
				});
			}else{
				if(schedule == 3 || schedule == 8){
					com.initChosen(operate.name + "WorkerName", api.personel.queryUserForNameByDutysAO, "pinyinName", {"dutysO[0]":operate.waterwayDuty, "dutysO[1]":operate.circuitDuty, "dutysO[2]":operate.powerDuty, "dutysO[3]":operate.waterwayCircuitDuty}, "autoFillKeyValue", "key", "value");
				}else{
					com.initChosen(operate.name + "WorkerName", api.personel.queryUserForNameByDuty, "pinyinName", {"duty":operate.duty}, "autoFillKeyValue", "key", "value");
				}

				$("#" + operate.name + "StartTime").val(element[0].startTime);
				$("#" + operate.name + "EndTime").val(element[0].endTime);

				var options = {};
				options["constructer.orderId"] = params.orderId;
				options["constructer.schedule"] = schedule;

				com.post(api.construction.queryConstructerByOrderId, options, function(res){
					queryWorkerUrl(operate, res);
				}, null, false);

				$("#" + operate.name + "WorkerSubmit").unbind("click");
				$("#" + operate.name + "WorkerSubmit").on("click", function(){

					if($("#" + operate.name + "WorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}

					var args = {};
					args["constructer.cid"] = element[0].cid;
					args["constructer.schedule"] = schedule;
					args["constructer.user.userId"] = $('#' + operate.name + "WorkerName").val();

					com.post(api.construction.addConstructer, args, function(res) {
							setWorkerUrl(operate, res);
					});
					return false;
				});

				if(workerInfoCondition){
					if( element[0].status != undefined && ( element[0].status == 0 || element[0].status == 2)){
						workerAllocationDetail.controlCondition = false;
					}else if( element[0].status != undefined && element[0].status == 1){
						workerAllocationDetail.controlCondition = true;
					}else{
						workerAllocationDetail.controlCondition = true;
					}
				}
			}

			$('#' + operate.name + "Drawing").removeClass("active");

			return false;

		});
	}

	function changeChanStatus(chanStatus){
		var statusDiv = $("#chanStatus").html("");

		if(chanStatus == 1){
			$("<span></span>").addClass("label label-success col-sm-4").text("成功").appendTo(statusDiv);
		}else if(chanStatus == 2){
			$("<span></span>").addClass("label label-danger col-sm-4").text("失败").appendTo(statusDiv);
		}else if(chanStatus == 3){
			$("<span></span>").addClass("label label-warning col-sm-4").text("延迟").appendTo(statusDiv);
		}else if(chanStatus == 4){
			$("<span></span>").addClass("label label-info col-sm-4").text("通过").appendTo(statusDiv);
		}else{
			$("<span></span>").addClass("label col-sm-4").text("待处理").appendTo(statusDiv);
		}
	}

	function changeFangStatus(fangStatus){
		var putlineStatusDiv = $("#putlineStatus").html("");

		if(fangStatus == 1){
			$("<span></span>").addClass("label label-success").text("成功").appendTo(putlineStatusDiv);
		}else if(fangStatus == 2){
			$("<span></span>").addClass("label label-danger").text("失败").appendTo(putlineStatusDiv);
		}else{
			$("<span></span>").addClass("label label-warning").text("等待").appendTo(putlineStatusDiv);
		}
	}

	//查询
	function queryWorkerUrl(operate, res){

		constructers = res.constructers;
		$("#" + operate.name + "WorkerInfos").html("");

		if(constructers.length != 0){
			for(var i = 0; i < constructers.length; i++) {
				var workerIf = constructers[i];

				var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", workerIf.crid);
				var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
				var profileImg = $('<img />').attr("alt", workerIf.user.userId+"'s Photo").appendTo(imgDiv);

				if(workerIf.user.userPhoto != null && workerIf.user.userPhoto != ""){
					com.showImg(profileImg, workerIf.user.userPhoto, 150, 150, '');
				}

				var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
				var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerIf.user.userId + "" + workerIf.user.userName + "<br/>" + workerIf.user.duty).appendTo(buttonsDiv);
				var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerIf.crid).click(function(){

					var id = $(this).attr('cId');

					var args = {};
					args["constructer.crid"] = id;

					com.post(api.construction.deleteConstructer, args, function(){
						$("#" + id).remove();
					});

				}).appendTo(buttonsDiv);
				var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

				profileDiv.appendTo($("#" + operate.name + "WorkerInfos"));
			}

			workerInfoCondition = true;
		}else{
			$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#" + operate.name + "WorkerInfos"));
		}
	}

	//添加
	function setWorkerUrl(operate, res){

		var worker = res.constructer;
		var workerInfo = res.constructer.user;

		var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", worker.crid);
		var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
		var profileImg = $('<img />').attr("alt", workerInfo.userId + "'s Photo").appendTo(imgDiv);

		if (workerInfo.userPhoto != "" && workerInfo.userPhoto != null && workerInfo.userPhoto != undefined) {
			com.showImg(profileImg, workerInfo.userPhoto, 150, 150, '');
		}

		var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
		var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.userId + "" + workerInfo.userName + "<br/>" + workerInfo.duty).appendTo(buttonsDiv);
		var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerInfo.userId).click(
			function () {

				var args = {};
				args["constructer.crid"] = worker.crid;

				com.post(api.construction.deleteConstructer, args, function () {
					$("#" + worker.crid).remove();
				});

			}).appendTo(buttonsDiv);

		var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

		var workerInfos = $("#" + operate.name + "WorkerInfos");

		if(workerInfos.children(".profile-picture").length == 0){
			workerInfos.html("");
		}
		profileDiv.appendTo(workerInfos);
		com.showAlert(com.info, "工人信息提交成功!");
	}

	//画节点信息轴
	function constructerNode(stepul, schedule){
		var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
		var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
		var stepSpan = $("<span></span>").addClass("title").html(constructionNode[schedule]).appendTo(stepLi);
	}

	//画施工人员面板
	function constructerPane(paneId, schedule, name){

		var paneWorker = $("<div></div>").addClass("step-pane").attr("id","step" + schedule).attr("flag","step").appendTo(paneId);
		var paneWorkerRow = $("<div></div>").addClass("row").appendTo(paneWorker);
		var paneWorkerForm = $("<form></form>").addClass("form-horizontal").appendTo(paneWorkerRow);
		var paneWorkerGroup = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);

		var paneWorkerSm = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroup);
		var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSm);
		var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
		var paneWorkerSpan = $("<span></span>").html(constructionNode[schedule] + "信息").appendTo(paneWorkerH3);

		//开工时间
		var paneWorkerGroupTwo = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
		var paneWorkerStart = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for",name + "StartTime").html("开工时间").appendTo(paneWorkerGroupTwo);
		var paneWorkerSmTwo = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTwo);
		var paneWorkerInput = $("<input/>").attr("id", name + "StartTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerSmTwo);
		var paneWorkerSpace = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

		//完工时间
		if(schedule != 2){
			var paneWorkerGroupTh = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
			var paneWorkerEnd = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "EndTime").html("完工时间").appendTo(paneWorkerGroupTh);
			var paneWorkerSmTh = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTh);
			var paneWorkerInputTwo = $("<input/>").attr("id", name + "EndTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerSmTh);
			var paneWorkerSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);
		}

		//铲大白放线状态
		if(schedule == 1 || schedule == 2){
			var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
			var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for", name + "Status").html(constructionNode[schedule] + "状态").appendTo(paneWorkerGroupF);
			var paneWorkerLabDiv = $("<div></div>").attr("id", name + "Status").addClass("col-sm-6").appendTo(paneWorkerGroupF);
			var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);

			var paneWorkerGroupFive = $("<div></div>").addClass("form-group").attr("id", name + "Operate").appendTo(paneWorkerGroup);
			var paneWorkerSmFive = $("<div></div>").addClass("col-sm-offset-2").appendTo(paneWorkerGroupFive);
			var paneWorkerBtnS = $("<button></button>").attr("id", name + "Success").addClass("btn btn-xs btn-success").html("成功").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			var paneWorkerBtnD = $("<button></button>").attr("id", name + "Fail").addClass("btn btn-xs btn-danger").html("失败").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			if(schedule == 1){
				var paneWorkerBtnW = $("<button></button>").attr("id", name + "Delay").addClass("btn btn-xs btn-warning").html("延迟").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
				var paneWorkerBtnI = $("<button></button>").attr("id", name + "Pass").addClass("btn btn-xs btn-info").html("通过").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			}
		}
		var paneWorkerGroupS = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmS = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupS);
		var paneWorkerHTh = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSmS);
		var paneWorkerHThi = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerHTh);
		var paneWorkerHThSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerHTh);

		var paneWorkerGroupSe = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerEnter = $("<div></div>").attr("id", name + "WorkerEnter").appendTo(paneWorkerGroupSe);
		var paneWorkerEnlab = $("<lable></lable>").addClass("col-sm-1 control-label").attr("for", name + "WorkerName").html("工人姓名").appendTo(paneWorkerEnter);
		var paneWorkerSelDiv = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerEnter);
		var paneWorkerSel = $("<select></select>").attr("id", name + "WorkerName").addClass("chosen-select col-sm-2 v_required").attr("data-placeholder","请输入工人名称").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerSelDiv);
		var paneWorkerOp = $("<option></option>").attr("value","").html("&nbsp;").appendTo(paneWorkerSel);

		var paneWorkerGroupEi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmEi = $("<div></div>").addClass("col-sm-offset-1").appendTo(paneWorkerGroupEi);
		var paneWorkerbtnEi = $("<button></button>").attr("id", name + "WorkerSubmit").addClass("btn btn-xs col-sm-2 workerSubmit").html("确认").appendTo(paneWorkerSmEi);
		var paneWorkerSpaceEi = $("<div></div>").addClass("space-4").appendTo(paneWorkerForm);

		var paneWorkerGroupNi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmNi = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupNi);
		var paneWorkerInfoNi = $("<div></div>").attr("id", name + "WorkerInfos").appendTo(paneWorkerSmNi);
		var paneWorkerSpaceNi = $("<div></div>").addClass("space-4").appendTo(paneWorkerForm);

	}

	function addActive(schedule){
		var con = workerAllocationDetail.constructionSchedules;
		$.each(con,function(i, v){
			$("#step" + v.schedule).removeClass("active");
			$("#step" +  v.schedule).addClass("step-pane");
		});
		$("#step" + schedule).removeClass("step-pane");
		$("#step" + schedule).addClass("active");
	}

});
