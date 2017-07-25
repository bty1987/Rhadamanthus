jQuery(function($) {
	var workers = {};
	var ly_constructer;
	var workerAllocationDetailPostData = {};
	var ly_copyworkers = function (constructers){
		if(constructers && constructers.length){
			for(var i = 0;i < constructers.length; i++){
				workers[constructers[i].user.userId] = constructers[i];
			}
		}
	}
	var workerAllocationDetail = {

		construstion: {},

		controlCondition: false,

		schedule: 0,

		construstionSchedule : "construstionSchedule",

		operateDict: {
			"1": {
				num: 1,
				galleryId: "chanGallery",
				uploadId: "chanUpload",
				tabbable: "chanDrawing",

				workerId: "chanWorker",
				startTimeId: "chanStartTime",
				startTimeFlagId: "chanStartTimeFlag",
				endTimeId: "chanEndTime",
				endTimeFlagId: "chanEndTimeFlag",
				statusId: "status",
				workerInfos: "chanWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",
				status: "status",

				setStatusUrl: api.construction.setConstructionScheduleForStatus,
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				duty: "铲大白工人",

				drawingType: 6,

				errorMsg: "开工时间或者完工时间没有进行确认或者当前铲大白状态没有成功!",
			}, "2": {
				num: 2,
				galleryId: "putlineGallery",
				uploadId: "putlineUpload",
				tabbable: "putlineDrawing",

				startTimeId: "putlineStartTime",
				startTimeFlagId: "putlineStartTimeFlag",
				endTimeId: "putlineEndTime",
				endTimeFlagId: "putlineEndTimeFlag",
				putlineTimeId: "putlineTime",
				putlineStatusId: "putlineStatus",
				workerInfos: "fangWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",
				putlineTime: "putlineTime",
				putlineStatus: "putlineStatus",

				setStatusUrl: api.construction.setConstructionScheduleForStatus,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",


				nextElementName: "waterwayCircuitPowerConstructionSchedule",

				duty: "放线小组",

				drawingType: 7,

				errorMsg: "放线状态不满足进行下个阶段要求!",
			}, "3": {
				num: 3,
				name: "waterwayCircuitPower",
				galleryId: "waterwayCircuitPowerGallery",
				uploadId: "waterwayCircuitPowerUpload",
				tabbable: "waterwayCircuitPowerDrawing",

				workerId: "waterwayCircuitPowerWorker",
				waterwayWorkerId: "waterwayWorker",
				circuitWorkerId: "circuitWorker",
				powerWorkerId: "powerWorker",
				startTimeId: "waterwayCircuitPowerStartTime",
				startTimeFlagId: "waterwayCircuitPowerStartTimeFlag",
				endTimeId: "waterwayCircuitPowerEndTime",
				endTimeFlagId: "waterwayCircuitPowerEndTimeFlag",
				workerInfos: "waterwayCircuitPowerWorkerInfos",

				waterwayWorker: "waterwayWorkerId",
				circuitWorker: "circuitWorkerId",
				powerWorker: "powerWorkerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "bricklayConstructionSchedule",

				waterwayDuty: "水暖工",
				circuitDuty: "电工",
				powerDuty: "力工",
				waterwayCircuitDuty: "水电工",

				drawingType: 8,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "4": {
				num: 4,
				name: "bricklay",
				galleryId: "bricklayGallery",
				uploadId: "bricklayUpload",
				tabbable: "bricklayDrawing",

				workerId: "bricklayWorker",
				startTimeId: "bricklayStartTime",
				startTimeFlagId: "bricklayStartTimeFlag",
				endTimeId: "bricklayEndTime",
				endTimeFlagId: "bricklayEndTimeFlag",
				workerInfos: "bricklayWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "groundLevelingConstructionSchedule",

				duty: "瓦工",

				drawingType: 9,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "5": {
				num: 5,
				name: "groundLeveling",
				galleryId: "groundLevelingGallery",
				uploadId: "groundLevelingUpload",
				tabbable: "groundLevelingDrawing",

				workerId: "groundLevelingWorker",
				startTimeId: "groundLevelingStartTime",
				startTimeFlagId: "groundLevelingStartTimeFlag",
				endTimeId: "groundLevelingEndTime",
				endTimeFlagId: "groundLevelingEndTimeFlag",
				workerInfos: "groundLevelingWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "carpentConstructionSchedule",

				duty: "地面找平",

				drawingType: 12,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "6": {
				num: 6,
				name: "carpent",
				galleryId: "carpentGallery",
				uploadId: "carpentUpload",
				tabbable: "carpentDrawing",

				workerId: "carpentWorker",
				startTimeId: "carpentStartTime",
				startTimeFlagId: "carpentStartTimeFlag",
				endTimeId: "carpentEndTime",
				endTimeFlagId: "carpentEndTimeFlag",
				workerInfos: "carpentWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",


				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "oilConstructionSchedule",

				duty: "木工",

				drawingType: 11,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "7": {
				num: 7,
				name: "oil",
				galleryId: "oilGallery",
				uploadId: "oilUpload",
				tabbable: "oilDrawing",

				workerId: "oilWorker",
				startTimeId: "oilStartTime",
				startTimeFlagId: "oilStartTimeFlag",
				endTimeId: "oilEndTime",
				endTimeFlagId: "oilEndTimeFlag",
				workerInfos: "oilWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "waterwayCircuitCheckConstructionSchedule",

				duty: "油工",

				drawingType: 12,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "8": {
				num: 8,
				name: "waterwayCircuitCheck",
				galleryId: "waterwayCircuitCheckGallery",
				uploadId: "waterwayCircuitCheckUpload",
				tabbable: "waterwayCircuitCheckDrawing",

				workerId: "waterwayCircuitCheckWorker",
				waterwayWorkerId: "waterwayWorker",
				circuitWorkerId: "circuitWorker",
				powerWorkerId: "powerWorker",
				startTimeId: "waterwayCircuitCheckStartTime",
				startTimeFlagId: "waterwayCircuitCheckStartTimeFlag",
				endTimeId: "waterwayCircuitCheckEndTime",
				endTimeFlagId: "waterwayCircuitCheckEndTimeFlag",
				workerInfos: "waterwayCircuitCheckWorkerInfos",

				waterwayWorker: "waterwayWorkerId",
				circuitWorker: "circuitWorkerId",
				powerWorker: "powerWorkerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				nextElementName: "cleaningConstructionSchedule",

				waterwayDuty: "水暖工",
				circuitDuty: "电工",
				powerDuty: "力工",
				waterwayCircuitDuty: "水电工",

				drawingType: 13,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "9": {
				num: 9,
				name: "cleaning",
				galleryId: "cleaningGallery",
				uploadId: "cleaningUpload",
				tabbable: "cleaningDrawing",

				workerId: "cleaningWorker",
				startTimeId: "cleaningStartTime",
				startTimeFlagId: "cleaningStartTimeFlag",
				endTimeId: "cleaningEndTime",
				endTimeFlagId: "cleaningEndTimeFlag",
				workerInfos: "cleaningWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",

				setTimeFlagUrl: api.construction.setConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				setWorkerUrl: api.construction.addConstructer,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				deleteWorkerUrl: api.construction.deleteConstructer,

				elementConstructerId: "crid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",
				elementConstructerCsId: "csId",
				user: "user",
				userId: "userId",

				duty: "保洁工",

				drawingType: 6,

				errorMsg: "开工时间或者完工时间没有进行确认!",
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

		operateInfo: {},
		workerUserId: {},
	};

	var orderId = params.orderId;

	com.post(api.construction.queryConstructionByOrderId, {
		"construction.orderId": params.orderId
	}, function(res){

		workerAllocationDetail.construstion = res.construction;

		var schedule = res.construction.schedule;
		var operate = workerAllocationDetail.operateDict[schedule];

		workerAllocationDetail.schedule = schedule;

		if(!workerAllocationDetail.wizardSept[schedule]){
			initWizardSept(operate, schedule);
			workerAllocationDetail.wizardSept[schedule] = true;
		}

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: schedule}).on('change' , function(e, info){
			var step = 0;
			var direction = info.direction;

			if(direction == "previous"){
				step = info.step - 1;

				if(!workerAllocationDetail.wizardSept[step.toString()]){
					initWizardSept(workerAllocationDetail.operateDict[step.toString()], step.toString());
					workerAllocationDetail.wizardSept[step.toString()] = true;
				}
			}else if(direction == "next"){
				step = info.step + 1;

				if(step > workerAllocationDetail.schedule){
					com.showAlert(com.warning, "当前功能不能进行施工阶段操作.");

					return false;
				}else{
					if(!workerAllocationDetail.wizardSept[step]){
						initWizardSept(workerAllocationDetail.operateDict[step], step);
						workerAllocationDetail.wizardSept[step] = true;
					}
				}
			}
		}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){
			if(!workerAllocationDetail.wizardSept[info.step]){
				initWizardSept(workerAllocationDetail.operateDict[info.step], info.step);
				workerAllocationDetail.wizardSept[info.step] = true;
			}
		});
	});

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('#showConstructionPicture').click(function(){
		workerAllocationDetail.constructionPictureModal.modal("show");
	});

	$('[data-rel=popover]').popover({html:true});

	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.workerAllocationIndex.url);
	});

	function initWizardSept(operate, schedule){

		var elementPostData = {};
		var workerInfoCondition = false;

		var orderId = params.orderId;
		elementPostData["constructionSchedule.orderId"] = params.orderId;
		workerAllocationDetail.controlCondition = false;

		com.post(api.construction.queryConstructionScheduleByOrderId, elementPostData, function(res){

			var elements = res.constructionSchedules;
			var element = [];
			var eleSch = [];
			var numi;
			var ifFlag = false;

			$.each(elements, function(i,v){
				element.push(v)
			});

			$.each(element, function(i,v){
				eleSch.push(v.schedule)
			});

			if(eleSch.contains(operate.num)){
				for(var i = 0; i < element.length; i++){
					if(element[i].schedule == operate.num){
						ifFlag = true;
						numi = i;
						break;
					}
				}
			}else{
				com.showAlert(com.error,"工程信息不存在");
			}

			workerAllocationDetailPostData["constructionSchedule.cid"] = element[numi].cid;
			workerAllocationDetailPostData["constructionSchedule.csId"] = element[numi].csId;

			if(ifFlag && element[numi].cid != 0){

				if(schedule == 1){

					$("#"+operate.startTimeId).val( element[numi].startTime);
					$("#"+operate.endTimeId).val( element[numi].endTime);

					var chanStatus = element[numi].status;
					var chanSuccessBtn = $("#chanSuccess");
					var chanFailBtn = $("#chanFail");
					var chanDelayBtn = $("#chanDelay");
					var chanPassBtn = $("#chanPass");

					chanSuccessBtn.click(function(){
						var options = {};

						options["constructionSchedule.csId"] = element[numi].csId;
						options["constructionSchedule.orderId"] = orderId;
						options["constructionSchedule.status"] = 1;

						console.log(options);
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

						options["constructionSchedule.csId"] = element[numi].csId;
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
						options["constructionSchedule.csId"] = element[numi].csId;
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
						options["constructionSchedule.csId"] = element[numi].csId;
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
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					com.post(operate.queryWorkerUrl, options, function (res) {
						queryWorkerUrl(operate,res,options);
					}, null, false);


					com.initChosen('chanWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

					$("#chanWorkerSubmit").on("click", function(){
						var args = {};
						args[operate.elementConstructerName + ".cid"] = element[numi].cid;
						args[operate.elementConstructerName + ".schedule"] = schedule;
						args[operate.elementConstructerName + ".user.userId"] = $('#chanWorkerName').val();

						if($("#chanWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}

						var ly_userId = $('#chanWorkerName').val();
						if(ly_constructer && ly_constructer.length){
							for (var i = 0; i < ly_constructer.length; i++){
								var c = ly_constructer[i];
								var uid = c.user.userId;
								if(uid == ly_userId){
									com.showAlert(com.error, "当前工人已经添加,不能重复添加同一工人");
									return false;
								}
							}
						}

						com.post(operate.setWorkerUrl, args,
							function(res){
								workerAllocationDetailPostData[operate.elementConstructerName + ".csId"] = res[operate.elementConstructerName][operate.elementConstructerCsId];
								setWorkerUrl(operate,res,options,ly_userId);
						},function(data){
								com.showAlert(com.error, "工程信息不存在，不能添加工人");
							});
						return false;
					});

					if( element[numi].startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options[operate.elementName+"."+operate.elementId] = element[numi][operate.elementId];
							options[operate.elementName+"."+operate.startTimeFlag] = 1;
							options[operate.elementName+"."+operate.endTimeFlag] = element[numi][operate.endTimeFlag];
							 element[numi][operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							if( element[numi].endTimeFlag != 0 && workerInfoCondition){
								if(elemen[schedule-1].status != undefined && ( element[numi].status != 0 || element[numi].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}else if( element[numi].endTimeFlag != 0 && !workerInfoCondition){
								if( element[numi].status != undefined && element[numi].status == 4){
									workerAllocationDetail.controlCondition = true;
								}
							}

							return false;
						});
					}else{
						$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
					}

					if( element[numi].endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[numi].csId;//这里的cid不确定是cid 还是csid
							options["constructionSchedule.endTimeFlag"] = 1;
							options["constructionSchedule.startTimeFlag"] = element[numi][operate.startTimeFlag];
							 element[numi][operate.endTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
							});

							if( element[numi].startTimeFlag != 0 && workerInfoCondition){
								if( element[numi].status != undefined && ( element[numi].status != 0 || element[numi].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}else if( element[numi].startTimeFlag != 0 && !workerInfoCondition){
								if( element[numi].status != undefined && element[numi].status == 4){
									workerAllocationDetail.controlCondition = true;
								}
							}

							return false;
						});
					}else{
						$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
					}

					if( element[numi].startTimeFlag != 0 && element[numi].endTimeFlag != 0 && workerInfoCondition){
						if( element[numi].status != undefined && ( element[numi].status == 0 || element[numi].status == 2)){
							workerAllocationDetail.controlCondition = false;
						}else if( element[numi].status != undefined && element[numi].status == 1){
							workerAllocationDetail.controlCondition = true;
						}else{
							workerAllocationDetail.controlCondition = true;
						}
					}else if( element[numi].startTimeFlag != 0 && element[numi].endTimeFlag != 0 && !workerInfoCondition){
						if( element[numi].status != undefined && element[numi].status == 4){
							workerAllocationDetail.controlCondition = true;
						}
					}
				}else if(schedule == 2){

					$("#"+operate.putlineTimeId).val( element[numi].startTime).attr("disabled", "disabled");
					var options = {};
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					com.post(operate.queryWorkerUrl, options, function (res) {
						queryWorkerUrl(operate,res,options);
					}, null, false);


					com.initChosen('fangWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

					$("#fangWorkerSubmit").on("click", function(){
						var args = {};
						args[operate.elementConstructerName + ".cid"] = element[numi].cid;
						args[operate.elementConstructerName + ".schedule"] = schedule;
						args[operate.elementConstructerName + ".user.userId"] = $('#fangWorkerName').val();

						if($("#fangWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}

						var ly_userId = $('#fangWorkerName').val();
						if(ly_constructer && ly_constructer.length){
							for (var i = 0; i < ly_constructer.length; i++){
								var c = ly_constructer[i];
								var uid = c.user.userId;
								if(uid == ly_userId){
									com.showAlert(com.error, "当前工人已经添加,不能重复添加同一工人");
									return false;
								}
							}
						}

						com.post(operate.setWorkerUrl, args,
							function(res){
								workerAllocationDetailPostData[operate.elementConstructerName + ".csId"] = res[operate.elementConstructerName][operate.elementConstructerCsId];
								setWorkerUrl(operate,res,options,ly_userId);
							},function(data){
								com.showAlert(com.error,"工程信息不存在，不能添加工人");
							});
						return false;
					});

					var putlineStatus = element[numi].status;
					var putlineSuccessBtn = $("#putlineSuccess");
					var putlineFailBtn = $("#putlineFail");

					changeFangStatus(putlineStatus);

					if(putlineStatus == 2 || putlineStatus == 1){
						putlineSuccessBtn.attr("disabled", "disabled");
						putlineFailBtn.attr("disabled", "disabled");
					}

					putlineSuccessBtn.click(function(){

						var options = {};
						options["constructionSchedule.csId"] = element[numi].csId;
						options["constructionSchedule.orderId"] = orderId;
						options["constructionSchedule.status"] = 1;

						com.post(operate.setStatusUrl, options, function(res){
							com.showAlert(com.info, "成功放线!");
							putlineSuccessBtn.attr("disabled", "disabled");
							putlineFailBtn.attr("disabled", "disabled");

							changeFangStatus(1);
						},function(data){
							com.showAlert(com.error, "工程信息不存在!");
						});

						return false;
					});

					putlineFailBtn.click(function(){

						var options = {};
						options["constructionSchedule.csId"] = element[numi].csId;
						options["constructionSchedule.orderId"] = orderId;
						options["constructionSchedule.status"] = 2;

						com.post(operate.setStatusUrl, options, function(res){
							com.showAlert(com.warning, "放线失败!");
							putlineSuccessBtn.attr("disabled", "disabled");
							putlineFailBtn.attr("disabled", "disabled");

							changeFangStatus(2);
						},function(data){
							com.showAlert(com.error, "工程信息不存在!");
						});

						return false;
					});
				}else{
					if(schedule == 3 || schedule == 8){
						com.initChosen(operate.name + "WorkerName", api.personel.queryUserForNameByDutysAO, "pinyinName", {"dutysO[0]":operate.waterwayDuty, "dutysO[1]":operate.circuitDuty, "dutysO[2]":operate.powerDuty, "dutysO[3]":operate.waterwayCircuitDuty}, "autoFillKeyValue", "key", "value");
					}else{
						com.initChosen(operate.name + "WorkerName", api.personel.queryUserForNameByDuty, "pinyinName", {"duty":operate.duty}, "autoFillKeyValue", "key", "value");
					}

					$("#"+operate.startTimeId).val(element[numi].startTime);
					$("#"+operate.endTimeId).val(element[numi].endTime);

					var options = {};
					options[operate.elementConstructerName+".orderId"] = params.orderId;
					options[operate.elementConstructerName+".schedule"] = schedule;

					com.post(operate.queryWorkerUrl, options, function(res){
						queryWorkerUrl(operate,res,options);
					}, null, false);

					$("#" + operate.name + "WorkerSubmit").on("click", function(){

						if($("#" + operate.name + "WorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}

						var args = {};
						args[operate.elementConstructerName + ".cid"] = element[numi].cid;
						args[operate.elementConstructerName + ".schedule"] = schedule;
						args[operate.elementConstructerName + ".user.userId"] = $('#' + operate.name + "WorkerName").val();

						var ly_userId = $('#' + operate.name + "WorkerName").val();
						if(ly_constructer && ly_constructer.length){
							for(var i = 0; i < ly_constructer.length; i++){
								var c = ly_constructer[i];
								var uid = c.user.userId;
								if(uid == ly_userId ){
									com.showAlert(com.error,"当前工人已经添加,不能重复添加同一工人");
									return false;
								}
							}
						}

						com.post(operate.setWorkerUrl, args,
							function(res) {
								setWorkerUrl(operate,res,options,ly_userId);
						},function(data){
								com.showAlert(com.error, "工程信息不存在，不能添加工人");
							});
						return false;
					});

					if( element[numi].startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[numi].csId;
							options["constructionSchedule."+operate.startTimeFlag] = 1;
							options["constructionSchedule."+operate.endTimeFlag] = element[numi][operate.endTimeFlag];
							 element[numi][operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							if( element[numi].endTimeFlag != 0 && workerInfoCondition){
								if( element[numi].status != undefined && ( element[numi].status != 0 || element[numi].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}

							return false;
						});
					}else{
						$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
					}

					if( element[numi].endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[numi].csId;
							options["constructionSchedule."+operate.endTimeFlag] = 1;
							options["constructionSchedule."+operate.startTimeFlag] = element[numi][operate.startTimeFlag];
							 element[numi][operate.endTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
							});

							if( element[numi].startTimeFlag != 0 && workerInfoCondition){
								if( element[numi].status != undefined && ( element[numi].status != 0 || element[numi].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}
							return false;
						});
					}else{
						$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
					}

					if( element[numi].startTimeFlag != 0 && element[numi].endTimeFlag != 0 && workerInfoCondition){
						if( element[numi].status != undefined && ( element[numi].status == 0 || element[numi].status == 2)){
							workerAllocationDetail.controlCondition = false;
						}else if( element[numi].status != undefined && element[numi].status == 1){
							workerAllocationDetail.controlCondition = true;
						}else{
							workerAllocationDetail.controlCondition = true;
						}
					}
				}

				$('#'+operate.tabbable).removeClass("active");

				return false;

			}else{
				workerAllocationDetailPostData["construction.cid"] = 0;
			}
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
	function queryWorkerUrl(operate,res,options){
			constructers = res[operate.elementConstructers];
			ly_constructer = constructers;
			ly_copyworkers(constructers);
			$("#"+operate.workerInfos).html("");
			if(constructers.length != 0){
				for(var i = 0; i < constructers.length; i++) {
					var workerIf = constructers[i];
					var workerId = workerIf.user.userId;
					workers[workerId] = workerIf;

					var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", "worker-" + workerId);
					var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
					var profileImg = $('<img />').attr("alt", workerIf.user.userId+"'s Photo").appendTo(imgDiv);

					if(workerIf.user.userPhoto != null && workerIf.user.userPhoto != ""){
						com.showImg(profileImg, workerIf.user.userPhoto, 150, 150, '');
					}

					var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
					var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerIf.user.userId + "" + workerIf.user.userName + "<br/>" + workerIf.user.duty).appendTo(buttonsDiv);
					var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerId).click(function(){

						var id = $(this).attr('cId');

						var worker = workers[id];

						var args = {};
						args[operate.elementConstructerName + "." + operate.elementConstructerId] = worker.crid;

						if(worker){
							com.post(operate.deleteWorkerUrl, args, function(res){
								com.post(operate.queryWorkerUrl,options,function(data){
									ly_constructer = data[operate.elementConstructers];
									ly_copyworkers(ly_constructer);
								})
								$("#worker-" + id).remove();
							},function(data){
								com.showAlert(com.error," 施工人员存在工费,不可删除");
							});
						}
					}).appendTo(buttonsDiv);
					var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

					profileDiv.appendTo($("#"+operate.workerInfos));
				}

				workerInfoCondition = true;
			}else{
				$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#"+operate.workerInfos));
			}
	}

	//添加
	function setWorkerUrl(operate,res,options,ly_userId){
				var workerInfo = res.constructer.user;
				com.post(operate.queryWorkerUrl,options,function(data){
					ly_constructer = data[operate.elementConstructers];
					ly_copyworkers(ly_constructer);
				})

				var workerId = workerInfo.userId;
				var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", "worker-" + workerId);
				var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
				var profileImg = $('<img />').attr("alt", workerInfo.userId + "'s Photo").appendTo(imgDiv);

				if (workerInfo.userPhoto != "" && workerInfo.userPhoto != null && workerInfo.userPhoto != undefined) {
					com.showImg(profileImg, workerInfo.userPhoto, 150, 150, '');
				}

				var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
				var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.userId + "" + workerInfo.userName + "<br/>" + workerInfo.duty).appendTo(buttonsDiv);
				var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("cId", workerInfo.userId).click(
					function () {

						var id = $(this).attr('cId');

						var worker = workers[id];

						var args = {};
						args[operate.elementConstructerName + "." + operate.elementConstructerId] = workers[ly_userId].crid;

						if (worker) {
							com.post(operate.deleteWorkerUrl, args, function (res) {
								com.post(operate.queryWorkerUrl,options,function(data){
									ly_constructer = data[operate.elementConstructers];
									ly_copyworkers(ly_constructer);
								})
								$("#worker-" + id).remove();
							},function(data){
								com.showAlert(com.error," 施工人员存在工费,不可删除");
							});
						}
					}).appendTo(buttonsDiv);

				var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);

				var workerInfos = $("#"+operate.workerInfos);

				if(workerInfos.children(".profile-picture").length == 0){
					workerInfos.html("");
				}
				profileDiv.appendTo(workerInfos);
				com.showAlert(com.info, "工人信息提交成功!");
	}
});
