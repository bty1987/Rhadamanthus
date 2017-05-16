
jQuery(function($) {

	var customerServiceDetail = {

		construstionSchedule: {},

		stepLimit: 0,

		errorMsg: "进度控制",

		operateDict: {
			"1": {
				workerInfos: "chanWorkerInfos",

				workerId: "chanWorker",
				workerRatyId: "chanWorkerRaty",
				workerDesId: "chanWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				updateInfoUrl: api.construction.updateChanConstructionSchedule,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ccsId",
				elementName: "chanConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "铲大白工人",
			}, "2": {
				workerInfos: "putlineWorkerInfos",

				workerId: "putlineWorker",
				workerRatyId: "putlineWorkerRaty",
				workerDesId: "putlineWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				updateInfoUrl: api.construction.updatePutlineConstructionSchedule,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "plcsId",
				elementName: "putlineConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "放线小组",
			}, "3": {
				workerInfos: "waterwayCircuitPowerWorkerInfos",

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
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
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

				workerId: "bricklayWorker",
				workerRatyId: "bricklayWorkerRaty",
				workerDesId: "bricklayWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateBricklayConstructionSchedule,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "bcsId",
				elementName: "bricklayConstructionSchedule",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "瓦工",
			}, "5": {
				workerInfos: "groundLevelingWorkerInfos",

				workerId: "groundLevelingWorker",
				workerRatyId: "groundLevelingWorkerRaty",
				workerDesId: "groundLevelingWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "glcsId",
				elementName: "groundLevelingConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "地面找平",
			}, "6": {
				workerInfos: "carpentWorkerInfos",

				workerId: "carpentWorker",
				workerRatyId: "carpentWorkerRaty",
				workerDesId: "carpentWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateCarpentConstructionSchedule,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ccsId",
				elementName: "carpentConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "木工",
			}, "7": {
				workerInfos: "oilWorkerInfos",

				workerId: "oilWorker",
				workerRatyId: "oilWorkerRaty",
				workerDesId: "oilWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateOilConstructionSchedule,
				setWorkerRaty: api.construction.updateConstructerForRate,

				elementId: "ocsId",
				elementName: "oilConstructionSchedule",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "油工",
			}, "8": {
				workerInfos: "waterwayCircuitCheckWorkerInfos",

				workerId: "waterwayCircuitCheckWorker",
				workerRatyId: "waterwayCircuitCheckWorkerRaty",
				workerDesId: "waterwayCircuitCheckWorkerDes",

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
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

				queryInfoUrl: api.construction.queryConstructerByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByCsId,
				updateInfoUrl: api.construction.updateCleaningConstructionSchedule,
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

	com.post(api.construction.queryConstructionScheduleByOrderId, {
		"constructionSchedule.orderId": params.orderId
	}, function(res){

		customerServiceDetail.construstionSchedule = res.constructionSchedule;

		var schedule = res.constructionSchedule.schedule;

		var operate = customerServiceDetail.operateDict[schedule];

		if(!customerServiceDetail.wizardSept[schedule]){
			initWizardSept(operate, schedule);
			customerServiceDetail.wizardSept[schedule] = true;
			customerServiceDetail.stepLimit = schedule;
		}

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: schedule}).on('change' , function(e, info){

			var step = 0;
			var direction = info.direction;

			if(direction == "previous"){
				step = info.step - 1;
			}else if(direction == "next"){
				step = info.step + 1;

				if(step > customerServiceDetail.stepLimit){
					com.showAlert(com.warning, customerServiceDetail.errorMsg);
					return false;
				}
			}
			if(customerServiceDetail.wizardSept[schedule]) {
				initWizardSept(customerServiceDetail.operateDict[step.toString()], step.toString());
				customerServiceDetail.wizardSept[step.toString()] = true;
			}
		}).on('finished', function(e) {
			bootbox.dialog({
				message: "Thank you! Your information was successfully saved!",
				buttons: {
					"success" : {
						"label" : "OK",
						"className" : "btn-sm btn-primary"
					}
				}
			});

		}).on('stepclick', function(e, info){
			if(customerServiceDetail.wizardSept[schedule]) {
				initWizardSept(customerServiceDetail.operateDict[info.step], info.step);
				customerServiceDetail.wizardSept[info.step] = true;
			}
		});

	});

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.customerServiceIndex.url);
	});

	function initWizardSept(operate, schedule){

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
						var workerRatyDiv = $('<div></div>').attr("id", workerInfo.cid+"workerRaty").appendTo(workerRatyGroupDiv);

						var workerDesGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerDesTextarea = $('<textarea rows="3"></textarea>').attr("id", workerInfo.cid+"workerRatyDes").val(workerInfo.assessment).appendTo(workerDesGroupDiv);

						profileDiv.appendTo($("#"+operate.workerInfos));

						setWorkerRaty('#'+workerInfo.cid+"workerRaty", workerInfo.rate);
						setWorkerDes("#"+workerInfo.cid+"workerRatyDes", workerInfo.assessment);

						workerIdsData.push(constructers[i].cid);
					}

					commitFlag = true;
				}else{
					$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#"+operate.workerInfos));
				}

				$("#btnSave").click(function(){
					for(var i=0;i<workerIdsData.length;i++){
						var options = {};
						options["constructer.cid"] = workerIdsData[i];
						options["constructer.rate"] = $("#"+workerIdsData[i] + "workerRaty-score").val();
						options["constructer.assessment"] = $("#"+workerIdsData[i] + "workerRatyDes").val();
						console.log(options);
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
					customerServiceDetail[operate.elementConstructerName+".cid"] = 0;
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
});
