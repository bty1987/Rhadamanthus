
jQuery(function($) {

	var customerServiceDetail = {

		construstion: {},

		stepLimit: 0,

		constructionSchedules:{},

		errorMsg: "进度控制",

		operateDict: {
			"1": {
				workerInfos: "chanWorkerInfos",
				nodeName:"铲大白",
				nodeNamePinyin: "chan",

				workerId: "chanWorker",
				workerRatyId: "chanWorkerRaty",
				workerDesId: "chanWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ccsId",
				elementName: "chanConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "铲大白工人",
			}, "2": {
				workerInfos: "putlineWorkerInfos",
				nodeName:"放线",
				nodeNamePinyin: "putline",

				workerId: "putlineWorker",
				workerRatyId: "putlineWorkerRaty",
				workerDesId: "putlineWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "plcsId",
				elementName: "putlineConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "放线小组",
			}, "3": {
				workerInfos: "waterwayCircuitPowerWorkerInfos",
				nodeName:"力水电",
				nodeNamePinyin: "waterwayCircuitPower",

				workerId: "waterwayCircuitPowerWorkerId",
				waterwayWorkerId: "waterwayWorker",
				waterwayWorkerRatyId: "waterwayWorkerRaty",
				waterwayWorkerRatyDesId: "waterwayWorkerRatyDes",
				circuitWorkerId: "circuitWorker",
				circuitWorkerRatyId: "circuitWorkerRaty",
				circuitWorkerRatyDesId: "circuitWorkerRatyDes",
				powerWorkerId: "powerWorker",

				worker: "wcpcswId",
				waterwayWorker: "waterwayWorkerId",
				waterwayWorkerRaty: "waterwayWorkerRaty",
				waterwayWorkerRatyDes: "waterwayWorkerRatyDes",
				circuitWorker: "circuitWorkerId",
				circuitWorkerRaty: "circuitWorkerRaty",
				circuitWorkerRatyDes: "circuitWorkerRatyDes",
				powerWorker: "powerWorkerId",
				powerWorkerRaty: "powerWorkerRaty",
				powerWorkerRatyDes: "powerWorkerRatyDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "wcpcsId",
				elementName: "waterwayCircuitPowerConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				waterwayDuty: "水暖工",
				circuitDuty:"电工",
				powerDuty:"力工",
			}, "4": {
				workerInfos: "bricklayWorkerInfos",
				nodeName:"瓦工",
				nodeNamePinyin: "bricklay",

				workerId: "bricklayWorker",
				workerRatyId: "bricklayWorkerRaty",
				workerDesId: "bricklayWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "bcsId",
				elementName: "bricklayConstructionSchedule",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "瓦工",
			}, "5": {
				workerInfos: "groundLevelingWorkerInfos",
				nodeName:"地面找平",
				nodeNamePinyin: "groundLeveling",

				workerId: "groundLevelingWorker",
				workerRatyId: "groundLevelingWorkerRaty",
				workerDesId: "groundLevelingWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "glcsId",
				elementName: "groundLevelingConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "地面找平",
			}, "6": {
				workerInfos: "carpentWorkerInfos",
				nodeName:"木工",
				nodeNamePinyin: "carpent",

				workerId: "carpentWorker",
				workerRatyId: "carpentWorkerRaty",
				workerDesId: "carpentWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ccsId",
				elementName: "carpentConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "木工",
			}, "7": {
				workerInfos: "oilWorkerInfos",
				nodeName:"油工",
				nodeNamePinyin: "oil",

				workerId: "oilWorker",
				workerRatyId: "oilWorkerRaty",
				workerDesId: "oilWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ocsId",
				elementName: "oilConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "油工",
			}, "8": {
				workerInfos: "waterwayCircuitCheckWorkerInfos",
				nodeName:"水电验收",
				nodeNamePinyin: "waterwayCircuitCheck",

				workerId: "waterwayCircuitCheckWorker",
				workerRatyId: "waterwayCircuitCheckWorkerRaty",
				workerDesId: "waterwayCircuitCheckWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "wcccsId",
				elementName: "waterwayCircuitCheckConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				waterwayDuty: "水暖工",
				circuitDuty:"电工",
				powerDuty:"力工",
			}, "9": {
				workerInfos: "cleaningWorkerInfos",
				nodeName:"保洁",
				nodeNamePinyin: "cleaning",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ccsId",
				elementName: "cleaningConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

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


		initWizardSept(customerServiceDetail.operateDict[1], 1);

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: 1}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){

			var stepId = $("[flag]").eq(info.step-1).attr("id");
			var sd = stepId.substr(4,1);
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
		elementPostData[operate.elementConstructerName+".orderId"] = params.orderId;
		elementPostData[operate.elementConstructerName+".schedule"] = schedule;

		//得到全部的施工人员
		com.post(operate.queryInfoUrl, elementPostData, function(res){
			constructers = res[operate.elementConstructers];

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
							com.post(operate.setWorkerRaty, options, function(res){
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
					customerServiceDetail[operate.elementConstructerName+".crid"] = 0;
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

	////画面板
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
