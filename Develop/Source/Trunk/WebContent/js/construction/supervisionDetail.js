
jQuery(function($) {

	var gcsId;

	//从服务器查询出来的所有工人
	var constructionScheduleWorkers;

	//var saveBtn = $("#saveBtn").on("click", saveData);

	var supervisionDetail = {

		construstionSchedule: {},

		controlCondition: false,

		schedule: 0,

		operateDict: {
			"1": {

				galleryId: "chanGallery",
				uploadId: "chanUpload",
				tabbable: "chanDrawing",
				navTabbable:"chanNavTab",

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

				queryInfoUrl: api.construction.queryChanConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setChanConstructionScheduleForTimeFlag,
				confirmEndTimeUrl: "",

				nextAddInfoUrl: api.construction.updatePutlineConstructionSchedule,

				queryDrawingUrl: api.construction.queryChanDrawingByCsId,
				addDrawingUrl: api.construction.addChanDrawing,
				deleteDrawingUrl: api.construction.deleteChanDrawing,

				elementId: "ccsId",
				elementName: "chanConstructionSchedule",
				drawingId: "cdId",
				drawingName: "chanDrawing",
				drawings: "chanDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "putlineConstructionSchedule",

				duty: "铲大白工人",

				drawingType: 6,

				errorMsg: "开工时间或者完工时间没有进行确认或者当前铲大白状态没有成功!",
			}, "2": {
				galleryId: "putlineGallery",
				uploadId: "putlineUpload",
				tabbable: "putlineDrawing",
				navTabbable:"putlineNavTab",

				workerId: "putlineWorker",
				startTimeId: "putlineStartTime",
				startTimeFlagId: "putlineStartTimeFlag",
				endTimeId: "putlineEndTime",
				endTimeFlagId: "putlineEndTimeFlag",
				putlineTimeId: "putlineTime",
				putlineStatusId: "putlineStatus",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",
				putlineTime: "putlineTime",
				putlineStatus: "putlineStatus",
				workerInfos: "fangWorkerInfos",

				queryInfoUrl: api.construction.queryPutlineConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				updateInfoUrl: api.construction.updatePutlineConstructionSchedule,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryPutlineDrawingByCsId,
				addDrawingUrl: api.construction.addPutlineDrawing,
				deleteDrawingUrl: api.construction.deletePutlineDrawing,

				elementId: "plcsId",
				elementName: "putlineConstructionSchedule",
				drawingId: "pldId",
				drawingName: "putlineDrawing",
				drawings: "putlineDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "waterwayCircuitPowerConstructionSchedule",

				duty: "放线小组",

				drawingType: 7,

				errorMsg: "放线状态不满足进行下个阶段要求!",
			}, "3": {
				name: "waterwayCircuitPower",
				galleryId: "waterwayCircuitPowerGallery",
				uploadId: "waterwayCircuitPowerUpload",
				tabbable: "waterwayCircuitPowerDrawing",
				navTabbable:"waterwayCircuitPowerNavTab",

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

				queryInfoUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryWaterwayCircuitPowerDrawingByCsId,
				addDrawingUrl: api.construction.addWaterwayCircuitPowerDrawing,
				deleteDrawingUrl: api.construction.deleteWaterwayCircuitPowerDrawing,

				elementId: "wcpcsId",
				elementName: "waterwayCircuitPowerConstructionSchedule",
				workerId: "wcpcswId",
				drawingId: "wcpdId",
				drawingName: "waterwayCircuitPowerDrawing",
				drawings: "waterwayCircuitPowerDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "bricklayConstructionSchedule",

				waterwayDuty: "水暖工",
				circuitDuty:"电工",
				powerDuty:"力工",
				waterwayCircuitDuty: "水电工",

				drawingType: 8,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "4": {
				name: "bricklay",
				galleryId: "bricklayGallery",
				uploadId: "bricklayUpload",
				tabbable: "bricklayDrawing",
				navTabbable:"bricklayNavTab",

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

				queryInfoUrl: api.construction.queryBricklayConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setBricklayConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryBricklayDrawingByCsId,
				addDrawingUrl: api.construction.addBricklayDrawing,
				deleteDrawingUrl: api.construction.deleteBricklayDrawing,

				elementId: "bcsId",
				elementName: "bricklayConstructionSchedule",
				workerId: "bcswId",
				drawingId: "bdId",
				drawingName: "bricklayDrawing",
				drawings: "bricklayDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "groundLevelingConstructionSchedule",

				duty: "瓦工",

				drawingType: 9,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "5": {

				name: "groundLeveling",
				galleryId: "groundLevelingGallery",
				uploadId: "groundLevelingUpload",
				tabbable: "groundLevelingDrawing",
				navTabbable:"groundLevelingNavTab",

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

				queryInfoUrl: api.construction.queryGroundLevelingConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setGroundLevelingConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryGroundLevelingDrawingByCsId,
				addDrawingUrl: api.construction.addGroundLevelingDrawing,
				deleteDrawingUrl: api.construction.deleteGroundLevelingDrawing,

				elementId: "glcsId",
				elementName: "groundLevelingConstructionSchedule",
				workerId: "glcswId",
				drawingId: "gldId",
				drawingName: "groundLevelingDrawing",
				drawings: "groundLevelingDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "carpentConstructionSchedule",

				duty: "地面找平",

				drawingType: 10,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "6": {

				galleryId: "carpentGallery",
				uploadId: "carpentUpload",
				tabbable: "carpentDrawing",
				navTabbable:"carpentNavTab",

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

				queryInfoUrl: api.construction.queryCarpentConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setCarpentConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryCarpentDrawingByCsId,
				addDrawingUrl: api.construction.addCarpentDrawing,
				deleteDrawingUrl: api.construction.deleteCarpentDrawing,

				elementId: "ccsId",
				elementName: "carpentConstructionSchedule",
				workerId: "ccswId",
				drawingId: "cdId",
				drawingName: "carpentDrawing",
				drawings: "carpentDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "oilConstructionSchedule",

				duty: "木工",

				drawingType: 11,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "7": {

				galleryId: "oilGallery",
				uploadId: "oilUpload",
				tabbable: "oilDrawing",
				navTabbable:"oilNavTab",

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

				queryInfoUrl: api.construction.queryOilConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setOilConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryOilDrawingByCsId,
				addDrawingUrl: api.construction.addOilDrawing,
				deleteDrawingUrl: api.construction.deleteOilDrawing,

				elementId: "ocsId",
				elementName: "oilConstructionSchedule",
				workerId: "ocswId",
				drawingId: "odId",
				drawingName: "oilDrawing",
				drawings: "oilDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "waterwayCircuitCheckConstructionSchedule",

				duty: "油工",

				drawingType: 12,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "8": {
				name: "waterwayCircuitCheck",
				galleryId: "waterwayCircuitCheckGallery",
				uploadId: "waterwayCircuitCheckUpload",
				tabbable: "waterwayCircuitCheckDrawing",
				navTabbable:"waterwayCircuitCheckNavTab",

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

				queryInfoUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryWaterwayCircuitCheckDrawingByCsId,
				addDrawingUrl: api.construction.addWaterwayCircuitCheckDrawing,
				deleteDrawingUrl: api.construction.deleteWaterwayCircuitCheckDrawing,

				elementId: "wcccsId",
				elementName: "waterwayCircuitCheckConstructionSchedule",
				workerId: "wcccswId",
				drawingId: "wccdId",
				drawingName: "waterwayCircuitCheckDrawing",
				drawings: "waterwayCircuitCheckDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "cleaningConstructionSchedule",

				waterwayDuty: "水暖工",
				circuitDuty:"电工",
				powerDuty:"力工",
				waterwayCircuitDuty: "水电工",

				drawingType: 13,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "9": {

				galleryId: "cleaningGallery",
				uploadId: "cleaningUpload",
				tabbable: "cleaningDrawing",
				navTabbable:"cleaningNavTab",

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

				queryInfoUrl: api.construction.queryCleaningConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				setTimeFlagUrl: api.construction.setCleaningConstructionScheduleForTimeFlag,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				queryDrawingUrl: api.construction.queryCleaningDrawingByCsId,
				addDrawingUrl: api.construction.addCleaningDrawing,
				deleteDrawingUrl: api.construction.deleteCleaningDrawing,

				elementId: "ccsId",
				elementName: "cleaningConstructionSchedule",
				workerId: "ccswId",
				drawingId: "cdId",
				drawingName: "cleaningDrawing",
				drawings: "cleaningDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				duty: "保洁工",

				drawingType: 14,

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
	};

	var colorboxArgs = {
		reposition:true,
		scalePhotos:true,
		scrolling:false,
		previous:'<i class="icon-arrow-left"></i>',
		next:'<i class="icon-arrow-right"></i>',
		close:'&times;',
		current:'{current} of {total}',
		maxWidth:'100%',
		maxHeight:'100%'
	}

	var orderId = params.orderId;

	com.post(api.construction.queryConstructionScheduleByOrderId, {
		"constructionSchedule.orderId": params.orderId
	}, function(res){

		supervisionDetail.construstionSchedule = res.constructionSchedule;

		var schedule = res.constructionSchedule.schedule;
		var operate = supervisionDetail.operateDict[schedule];

		supervisionDetail.schedule = schedule;

		if(!supervisionDetail.wizardSept[schedule]){
			initWizardSept(operate, schedule);
		}

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: schedule}).on('change' , function(e, info){
			var step = 0;
			var direction = info.direction;
			if(direction == "previous"){
				step = info.step - 1;

				if(!supervisionDetail.wizardSept[step.toString()]){
					initWizardSept(supervisionDetail.operateDict[step.toString()], step.toString());
				}
			}else if(direction == "next"){
				step = info.step + 1;
				if(step > supervisionDetail.schedule){
					if(!supervisionDetail.controlCondition){
						com.showAlert(com.warning, operate.errorMsg);
						return false;
					}else{
						var options = {};

						options["constructionSchedule.orderId"] = params.orderId;
						options["constructionSchedule."+operate.schedule] = step;
						options["constructionSchedule.csId"] = res.constructionSchedule["csId"];

						/**
						 * 施工进度针对订单款项收取情况进行判断以及相应控制
						 */
//						var nextFlag = true;
//						if(step == 3){
//
//							com.post(api.construction.checkConstructionScheduleForChanStatus, options, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//
//							if(!nextFlag){
//								return false;
//							}
//
//							com.post(api.construction.checkFirstPayment, options, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}else if(step == 6){
//							com.post(api.construction.checkSecondPayment, options, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}else if(step == 9){
//							com.post(api.construction.checkFinalyPayment, options, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}
						com.post(api.construction.nextConstructionScheduleByOrderId, options, function(res){
							operate = supervisionDetail.operateDict[step];
							initWizardSept(operate, step);
							supervisionDetail.schedule = step;
						}, false);
					}
				}else if(step == supervisionDetail.schedule){
					if(!(step == 8 && supervisionDetail.wizardSept[step])){
						initWizardSept(supervisionDetail.operateDict[step], step);
					}

				}else{
					if(!supervisionDetail.wizardSept[step]){
						initWizardSept(supervisionDetail.operateDict[step], step);
					}
				}
			}

		}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){
			if(!supervisionDetail.wizardSept[info.step]){
				initWizardSept(supervisionDetail.operateDict[info.step], info.step);
			}
		});
	});

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('#showConstructionPicture').click(function(){
		supervisionDetail.constructionPictureModal.modal("show");
	});

	$('[data-rel=popover]').popover({html:true});

	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.supervisionIndex.url);
	});

	function initWizardSept(operate, schedule){
		var elementPostData = {};
		elementPostData[operate.elementName+".orderId"] = params.orderId;
		supervisionDetail.controlCondition = false;
		var workerInfoCondition = false;

		com.post(operate.queryInfoUrl, elementPostData, function(res){
			var element = res[operate.elementName];

			if(element[operate.elementId] != 0){

				supervisionDetail[operate.elementName+"."+operate.elementId] = element[operate.elementId];

				if(schedule == 1){

					var workerLength = 0;
					$("#"+operate.startTimeId).val(element.startTime);
					$("#"+operate.endTimeId).val(element.endTime);

					var statusDiv = $("#"+operate.status).html("");
					if(element.status == 1){
						$("<span></span>").addClass("label label-success").text("成功").appendTo(statusDiv);
					}else if(element.status == 2){
						$("<span></span>").addClass("label label-danger").text("失败").appendTo(statusDiv);
					}else if(element.status == 3){
						$("<span></span>").addClass("label label-warning").text("延迟").appendTo(statusDiv);
					}else if(element.status == 4){
						$("<span></span>").addClass("label label-info").text("通过").appendTo(statusDiv);
					}else{
						$("<span></span>").addClass("label").text("待处理").appendTo(statusDiv);
					}

					var options = {};
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;
					com.post(operate.queryWorkerUrl,options, function(res){
						workerInfoCondition = queryConstructer(operate, res);

						if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && workerInfoCondition){

							if(element.status != undefined && (element.status == 0 || element.status == 2)){
								supervisionDetail.controlCondition = false;
							}else if(element.status != undefined && element.status == 1){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
							}
						}else if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && !workerInfoCondition){
							if(element.status != undefined && element.status == 4){
								supervisionDetail.controlCondition = true;
							}
						}
					});

					if(element.startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
							options[operate.elementName+"."+operate.startTimeFlag] = 1;
							options[operate.elementName+"."+operate.endTimeFlag] = element[operate.endTimeFlag];
							element[operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							//如果完工时间不可编辑并且有工人的情况下
							if(element.endTimeFlag != 0 && workerInfoCondition){
								// 134
								if(element.status != undefined && (element.status != 0 && element.status != 2)){
									supervisionDetail.controlCondition = true;
								}else{
									//supervisionDetail.controlCondition = true;
									supervisionDetail.controlCondition = false;
								}
							}else if(element.endTimeFlag != 0 && !workerInfoCondition){
								if(element.status != undefined && element.status == 4){
									supervisionDetail.controlCondition = true;
								}
							}
							return false;
						});
					}else{
						$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
					}

					if(element.endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							if(element.startTimeFlag == 1){
								var options = {};
								options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
								options[operate.elementName+"."+operate.endTimeFlag] = 1;
								options[operate.elementName+"."+operate.startTimeFlag] = element[operate.startTimeFlag];
								element[operate.endTimeFlag] = 1;

								com.post(operate.setTimeFlagUrl, options, function(res){
									$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
								});
								if(element.startTimeFlag != 0 && workerInfoCondition){
									if(element.status != undefined && (element.status != 0 && element.status != 2)){
										supervisionDetail.controlCondition = true;
									}else{
										//supervisionDetail.controlCondition = true;
										supervisionDetail.controlCondition = false;
									}
								}else if(element.startTimeFlag != 0 && !workerInfoCondition){
									if(element.status != undefined && element.status == 4){
										supervisionDetail.controlCondition = true;
									}
								}
							}else{
								com.showAlert(com.warning,"请先确认开工时间！");
							}
							return false;
						});
					}else{
						$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
					}

					if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && workerInfoCondition){
						if(element.status != undefined && (element.status == 0 || element.status == 2)){
							supervisionDetail.controlCondition = false;
						}else if(element.status != undefined && element.status == 1){
							supervisionDetail.controlCondition = true;
						}else{
							supervisionDetail.controlCondition = true;
						}
					}else if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && !workerInfoCondition){
						if(element.status != undefined && element.status == 4){
							supervisionDetail.controlCondition = true;
						}
					}
				}else if(schedule == 2){
					$("#"+operate.putlineTimeId).val(element.startTime).attr("disabled", "disabled");

					var putlineStatusDiv = $("#"+operate.putlineStatusId).html("");

					var options = {};
					options[operate.elementConstructerName+".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					//查询施工人员
					com.post(operate.queryWorkerUrl, options, function(res){
						workerInfoCondition = queryConstructer(operate, res);
					}, null, false);

					if(element.putlineStatus == 1){
						if(workerInfoCondition){
							supervisionDetail.controlCondition = true;
						}
						$("<span></span>").addClass("label label-success").text("成功").appendTo(putlineStatusDiv);
					}else if(element.putlineStatus == 2){
						$("<span></span>").addClass("label label-danger").text("失败").appendTo(putlineStatusDiv);
					}else{
						$("<span></span>").addClass("label label-warning").text("等待").appendTo(putlineStatusDiv);
					}
				}else{
					//这里是3-9
					$("#"+operate.startTimeId).val(element.startTime);
					$("#"+operate.endTimeId).val(element.endTime);

					var options = {};
					options[operate.elementConstructerName+".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					//查询施工人员
					com.post(operate.queryWorkerUrl, options, function(res){
						workerInfoCondition = queryConstructer(operate, res);
					}, null, false);

					if(element.startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
							options[operate.elementName+"."+operate.startTimeFlag] = 1;
							options[operate.elementName+"."+operate.endTimeFlag] = element[operate.endTimeFlag];
							element[operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							if(element.endTimeFlag != 0 && workerInfoCondition){
								supervisionDetail.controlCondition = false;
							}
							return false;
						});
					}else{
						$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
					}

					if(element.endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							if(element.startTimeFlag == 1){
								var options = {};
								options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
								options[operate.elementName+"."+operate.endTimeFlag] = 1;
								options[operate.elementName+"."+operate.startTimeFlag] = element[operate.startTimeFlag];
								element[operate.endTimeFlag] = 1;

								com.post(operate.setTimeFlagUrl, options, function(res){
									$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
								});

								if(element.startTimeFlag != 0 && workerInfoCondition){
									supervisionDetail.controlCondition = true;
								}
							}else{
								com.showAlert(com.warning, "请先确认开工时间!");
							}
							return false;
						});
					}else{
						$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
					}

					if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && workerInfoCondition){
						if(element.status != undefined && (element.status == 0 || element.status == 2)){
							supervisionDetail.controlCondition = false;
						}else if(element.status != undefined && element.status == 1){
							supervisionDetail.controlCondition = true;
						}else{
							supervisionDetail.controlCondition = true;
						}
					}
				}   //这里是3-9结束

				var options = {};
				options[operate.drawingName+".csId"] = supervisionDetail.construstionSchedule.csId;
				com.post(operate.queryDrawingUrl, options, function(res){
					var drawings = res[operate.drawings];

					$("#"+operate.galleryId).html("");

					for(var i=0;i<drawings.length;i++){
						var drawing = drawings[i];
						var imgAddUrl = null;
						var imgUrl = null;
						options[operate.drawingName+"."+operate.drawingId] = drawing[operate.drawingId];
						appendGalleryElement(operate.galleryId, drawing[operate.drawingId], drawing.drawingUrl, drawing.type, "", operate.deleteDrawingUrl, operate);
					}
				});
				initUploadBtn(operate, element);
				$('#'+operate.tabbable).removeClass("active");

				if($('#'+operate.navTabbable+' li:last-of-type').hasClass("active")){
					$('#'+operate.tabbable).addClass("active");
				}
				return false;
			}else{
				supervisionDetail[operate.elementName+"."+operate.elementId] = 0;
			}
		});
	}

	function initUploadBtn(operate, element){

		$("#"+operate.uploadId).html("").Huploadify({
			'debug' : false, // 开启调试
			'auto':true, // 是否自动上传
			'successTimeout':150, // 超时时间
			'formData':{ // 附带值
				'uploadType':operate.drawingType,
				'username':'用户名',
				'rnd':'加密密文'
			},
			'multi': true, // 批量上传
			'buttonClass': 'btn btn-success',
			'buttonText': '上传',
			'overrideEvents' : ['onDialogClose'],  // 不执行默认的onSelect事件
			'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
			'uploader':config.media + api.common.uploadImg.url, // 上传处理程序
			'height': '45', // 浏览按钮的高度
			'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
			'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
			'fileSizeLimit': '5MB', // 上传文件的大小限制
			'queueSizeLimit' : 10, // 上传数量
			'onUploadSuccess':function(file, data, response){ //上传到服务器,服务器返回相应信息到data里
				var dateObj=eval("("+data+")");
				if(dateObj.errorCode == 0){
					var options = {};

					options[operate.drawingName+"."+operate.elementId] = element[operate.elementId];
					options[operate.drawingName+"."+operate.drawingId] = 0;
					options[operate.drawingName+".csId"] = supervisionDetail.construstionSchedule.csId;
					options[operate.drawingName+".drawingName"] = "";
					options[operate.drawingName+".drawingUrl"] = dateObj.resUrl;
					options[operate.drawingName+".drawingAddUrl"] = "";

					com.post(operate.addDrawingUrl, options, function(res){
						var drawing = res[operate.drawingName];
						appendGalleryElement(operate.galleryId, drawing[operate.drawingId], dateObj.resUrl, 0, "", operate.deleteDrawingUrl, operate);
					});
				}else{
					console.log(data);
				}
			}
		});
	}

	function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, operate){

		var gallery = $("#"+galleryId);

		var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
		var img = $('<img />');
		var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(imgLi);
		var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
		var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
			var options = {};
			options[operate.drawingName+"."+operate.drawingId] = imgId;
			com.post(deleteUrl, options, function(res){
				$("#gallery_li"+imgId).remove();
			});
		}).appendTo(toolsDiv);
		$("<i></i>").addClass("icon-remove red").appendTo(toolsA);
		imgA.colorbox(colorboxArgs);
	};

	function _show_WorkerSalary(_index){
		//获得对应位置的工人
		var workerInfo = constructionScheduleWorkers[_index];
		var options = {
			"workerSalary.csId": workerInfo.csId,
			"workerSalary.user.userId": workerInfo.user.userId,
		};
		queryConstructerSalary(options);
	}

	//查询施工人员
	function queryConstructer(operate, res) {
		constructionScheduleWorkers = res.constructers;
		$("#" + operate.workerInfos).html("");
		if (constructionScheduleWorkers.length != 0) {
			//迭代所有的工人
			for (var i = 0; i < constructionScheduleWorkers.length; i++) {
				var workerInfo = constructionScheduleWorkers[i];
				var profileDiv = $('<div class="profile-picture col-sm-2 text-center" style="margin: 4px;"></div>').attr("wd","worker");
				var imgDiv = $('<div></div>').addClass('workerImg').appendTo(profileDiv);
				var profileImg = $('<img />').attr("alt", workerInfo.user.userId + "'s Photo").appendTo(imgDiv);
				if (workerInfo.user.userPhoto != null && workerInfo.user.userPhoto != "") {
					com.showImg(profileImg, workerInfo.user.userPhoto, 150, 150, '');
				}
				var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
				//buttonSpan工人工费按钮
				var buttonSpan = $('<div id="workerNameSpan"></div>').html('<a style="float: left; margin-left: -5px;" class="icon-money icon-2x" href="#"></a>').appendTo(buttonsDiv);
				//工人编号、名称、职务
				var buttonPeople = $('<div id="workerNameSpan" style="float: right"></div>').html(workerInfo.user.oldUserId + "" + workerInfo.user.userName + "<br/>" + workerInfo.user.duty).appendTo(buttonsDiv);

				//循环一个人，将当前这个人的下标绑定到原始对象上，因为jquery对象是原始对象的封装，每次获取都不一样，所以没法用jquery对象存
				//这个就是存储到原始dom对象上,简单说就是给你的对应的按钮添加一个_index属性正好和循环的i进行绑定
				buttonSpan[0]._index = i;
				buttonSpan.click(function () {
					_show_WorkerSalary(this._index);
				});
				profileDiv.appendTo($("#" + operate.workerInfos));
			}
			return true;
		} else {
			$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#" + operate.workerInfos));
			return false;
		}
	}

	//查询工人工费
	function queryConstructerSalary(options) {
		if ($('#workerSalaryList').children()) {
			$('#workerSalaryList').empty();
		}
		com.post(api.salary.queryWorkerSalary, options, function(res) {
			$.each(res.workerSalarys, function(i, v) {
				var workerSalary = $('<div></div>').prop("id","salary" + i);
				workerSalary.append(addspan('10', '姓名  : ', v.user.userName))
					.append(addspan('40', '创建时间  : ', v.createTime))
					.append(addspan('40', '薪资  : ', v.salary))
					.append($('<button>删除</button>').addClass("btn btn-xs btn-danger pull-right").css("margin-left","35px").attr("id","deleteBtn" + i)
						.click(function(){
							var data = {
								"workerSalary.wsId" : v.wsId,
							};
							com.post(api.salary.deleteWorkerSalary, data,function(){
								$("#salary" + i).remove();
							},function(res){
								com.showAlert(com.error, "工费状态不可操作！");
							});
						}))
					.append('<hr/>');
				workerSalary.appendTo($("#workerSalaryList"))
			})
			var salaryDiv = $('<div></div>').addClass("form-group");
			var salaryLabelT = $('<label><b>添加工人工资</b></label>').addClass('col-sm-3 control-label no-padding-right').attr("for","form-field-1").attr("for","salary").appendTo(salaryDiv);
			var salaryDivT = $('<div></div>').addClass("col-sm-9").css("padding-right","0px").appendTo(salaryDiv);
			var salaryInputT = $('<input />').addClass("col-xs-10 col-sm-9").attr("id","salary").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(salaryDivT);
			var salaryBtn = $('<button>保存</button>').addClass("btn btn-xs  btn-primary pull-right").attr("id","saveBtn").appendTo(salaryDivT)
				.click(function(){
					saveData(options)
				});
			salaryDiv.appendTo($("#workerSalaryList"));
			$('#guaranteeModal').modal('show');
		}, null, false)
	}

	function addspan(px, name, value) {
		var $10pxdiv = $('<div></div>').css({
			'display' : 'inline-block',
			'margin-left' : '10px'
		});
		var $40pxdiv = $('<div></div>').css({
			'display' : 'inline-block',
			'margin-left' : '40px'
		});
		var $nameSpan = $('<b></b>').html(name);
		var $valueSpan = $('<span></span>').text(value);

		if (px == '40') {
			return $40pxdiv.append($nameSpan).append($valueSpan);
		} else if (px == '10') {
			return $10pxdiv.append($nameSpan).append($valueSpan);
		}
	}

	//添加工人工费
	function saveData(options){
		var url = api.salary.addWorkerSalary;
		if(($('#salary').val()) == ""){
			com.showAlert(com.error,"请输入工人工费！");
		}else{
			if(/^(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/.test($('#salary').val()) ){
				options["workerSalary.salary"] = $('#salary').val();
				options["workerSalary.type"] = 0;
				com.post(url,options);
				$('#guaranteeModal').modal('hide');
			}else{
				com.showAlert(com.error,"请正确输入工人工费，小数点后最多保留3位！");
			}
		}
	}
});