
jQuery(function($) {

	var customerServiceDetail = {

		constructionSchedules:{},

		operateDict: {
			"1": {
				workerInfos: "chanWorkerInfos",
				nodeName:"铲大白",
				nodeNamePinyin: "chan",

			}, "2": {
				workerInfos: "putlineWorkerInfos",
				nodeName:"放线",
				nodeNamePinyin: "putline",

			}, "3": {
				workerInfos: "waterwayCircuitPowerWorkerInfos",
				nodeName:"力水电",
				nodeNamePinyin: "waterwayCircuitPower",

			}, "4": {
				workerInfos: "bricklayWorkerInfos",
				nodeName:"瓦工",
				nodeNamePinyin: "bricklay",

			}, "5": {
				workerInfos: "groundLevelingWorkerInfos",
				nodeName:"地面找平",
				nodeNamePinyin: "groundLeveling",

			}, "6": {
				workerInfos: "carpentWorkerInfos",
				nodeName:"木工",
				nodeNamePinyin: "carpent",

			}, "7": {
				workerInfos: "oilWorkerInfos",
				nodeName:"油工",
				nodeNamePinyin: "oil",

			}, "8": {
				workerInfos: "waterwayCircuitCheckWorkerInfos",
				nodeName:"水电验收",
				nodeNamePinyin: "waterwayCircuitCheck",

			}, "9": {
				workerInfos: "cleaningWorkerInfos",
				nodeName:"保洁",
				nodeNamePinyin: "cleaning",
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
		},
	};

	var orderId = params;
	var commitFlag = false;
	var workerIdsData = [];

	//动态获取节点轴
	com.post(api.construction.queryConstructionScheduleByOrderId,{"constructionSchedule.orderId":params.orderId},function(res){

		var constructionSchedule = res.constructionSchedules;

		customerServiceDetail.constructionSchedules = res.constructionSchedules;

		$.each(constructionSchedule, function(i, v){
			customerServiceNode("#stepId", v.schedule,customerServiceDetail.operateDict[v.schedule].nodeName);
			customerServicePane("#step-container", v.schedule,customerServiceDetail.operateDict[v.schedule].nodeNamePinyin, customerServiceDetail.operateDict[v.schedule].nodeName);
		});

		var stepnum = constructionSchedule[0].schedule;
		initWizardSept(customerServiceDetail.operateDict[stepnum], stepnum);

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: stepnum}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){

			var stepId = $("[flag]").eq(info.step-1).attr("id");
			var sd = stepId.substring(4);
			if(!customerServiceDetail.wizardSept[sd]){
				initWizardSept(customerServiceDetail.operateDict[sd], sd);
			}
		});


	},null,false);

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.customerServiceIndex.url);
	});

	function initWizardSept(operate, schedule){

		addActive(schedule)

		var elementPostData = {};
		elementPostData["constructer.orderId"] = params.orderId;
		elementPostData["constructer.schedule"] = schedule;

		//得到全部的施工人员
		com.post(api.construction.queryConstructerByOrderId, elementPostData, function(res){
			constructers = res.constructers;

			$("#btnSave").unbind("click");

			if(schedule){
				workerIdsData = [];
				commitFlag = false;
				$("#"+operate.workerInfos).html("");

				if(constructers.length != 0 ){
					for(var i=0;i<constructers.length;i++){
						var workerInfo =  constructers[i];
						var profileDiv = $('<div class="profile-picture col-sm-4" style="padding: 5px;"></div>');

						var imgDiv = $('<div class="col-sm-6 workerImg"></div>').appendTo(profileDiv);
						var img = $('<img />').attr("alt", workerInfo.user.userId +"'s photo").attr("id", workerInfo.user.userId +"WorkerImg").appendTo(imgDiv);

						if(workerInfo.user.userPhoto != null && workerInfo.user.userPhoto != ""){
							img.attr("src", config.media + api.common.showImg.url + '?imgBasePath='+workerInfo.user.userPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
						}

						var horizontalDiv = $('<div class="form-horizontal col-sm-6">').appendTo(profileDiv);
						var workerNameGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerNameSpan = $('<span id="workerNameSpan"></span>').text(workerInfo.user.userName).appendTo(workerNameGroupDiv);

						var workerRatyGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerRatyDiv = $('<div></div>').attr("id", workerInfo.crid+"workerRaty").appendTo(workerRatyGroupDiv);

						var workerDesGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerDesTextarea = $('<textarea rows="3"></textarea>').attr("id", workerInfo.crid+"workerRatyDes").val(workerInfo.assessment).appendTo(workerDesGroupDiv);

						profileDiv.appendTo($("#"+operate.workerInfos));

						setWorkerRaty('#'+workerInfo.crid+"workerRaty", workerInfo.rate);
						setWorkerDes("#"+workerInfo.crid+"workerRatyDes", workerInfo.assessment);

						workerIdsData.push(constructers[i].crid);
					}

					commitFlag = true;
				}else{
					$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#"+operate.workerInfos));
				}

				$("#btnSave").click(function(){
					for(var i=0;i<workerIdsData.length;i++){
						var options = {};
						options["constructer.crid"] = workerIdsData[i];
						options["constructer.rate"] = $("#"+workerIdsData[i] + "workerRaty-score").val();
						options["constructer.assessment"] = $("#"+workerIdsData[i] + "workerRatyDes").val();

						if(commitFlag){
							com.post(api.construction.updateConstructerForRate, options, function(res){
								com.showAlert(com.info, "保存成功!");
							});
						}
					}
				});
			}

			return false;

			for (var i = 0; i < constructers.length; i++){
				var workerInfo = constructers[i];
				if(workerInfo.cid == 0){
					customerServiceDetail["constructer.crid"] = 0;
				}
			}
		});
	}

	function setWorkerDes(id, des){
		$(id).val(des);
	}

	function setWorkerRaty(id, raty){
		$(id).raty({
			path: './assets/images/',
			start: raty,
		});
	}

	//画节点信息轴
	function customerServiceNode(stepul,schedule, nodeName){
		var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
		var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
		var stepSpan = $("<span></span>").addClass("title").html(nodeName).appendTo(stepLi);
	}

	//画面板
	function customerServicePane(paneId, schedule,scheduleNodeNamePinyin, scheduleNodeNameGBK){
		var paneCus = $("<div></div>").addClass("step-pane").attr("id","step" + schedule).attr("flag","step").appendTo(paneId);
		var paneCusRow = $("<div></div>").addClass("row").appendTo(paneCus);
		var paneCusForm = $("<form></form>").addClass("form-horizontal").appendTo(paneCusRow);
		var paneCusGroup = $("<div></div>").addClass("form-group").appendTo(paneCusForm);
		var paneCusSm = $("<div></div>").addClass("col-sm-12").appendTo(paneCusGroup);
		var paneCusCent = $("<div></div>").addClass("text-center").appendTo(paneCusSm);
		var paneCusH3 = $("<h3></h3>").addClass("header smaller lighter green").appendTo(paneCusCent);
		var paneCusI = $("<i></i>").addClass("icon-group").appendTo(paneCusH3);
		var paneCusSpan = $("<span></span>").html(scheduleNodeNameGBK + "工人信息").appendTo(paneCusH3);
		var paneCusInfo = $("<div></div>").attr("id",scheduleNodeNamePinyin + "WorkerInfos").appendTo(paneCusCent);
		var paneCusSpace = $("<div></div>").addClass("space-4").appendTo(paneCusForm);

	}

	function addActive(schedule){
		var con = customerServiceDetail.constructionSchedules;
		$.each(con,function(i, v){
			$("#step" + v.schedule).removeClass("active");
			$("#step" +  v.schedule).addClass("step-pane");
		});
		$("#step" + schedule).removeClass("step-pane");
		$("#step" + schedule).addClass("active");

	}
});
