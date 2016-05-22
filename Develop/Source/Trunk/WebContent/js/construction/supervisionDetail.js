var supervisionDetail = {
	
	mediaServer: "",
	construstionSchedule: {},
	
	controlCondition: false,
	
	schedule: 0,
	
	operateDict: {
		"1": {
			
			galleryId: "chanGallery",
			uploadId: "chanUpload",
			tabbable: "chanDrawing",
			
			workerId: "chanWorker",
			startTimeId: "chanStartTime",
			startTimeFlagId: "chanStartTimeFlag",
			endTimeId: "chanEndTime",
			endTimeFlagId: "chanEndTimeFlag",
			statusId: "status",
			
			worker: "workerId",
			startTime: "startTime",
			startTimeFlag: "startTimeFlag",
			endTime: "endTime",
			endTimeFlag: "endTimeFlag",
			schedule: "schedule",
			status: "status",
			
			queryInfoUrl: api.construction.queryChanConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateChanConstructionSchedule,
			setTimeFlagUrl: api.construction.setChanConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setChanConstructionScheduleForSalary,
			confirmStartTimeUrl: api.construction.setChanConstructionScheduleForSalary,
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
			
			nextElementName: "putlineConstructionSchedule",
			
			duty: "铲大白工人",
			
			drawingType: 6,
			
			errorMsg: "开工时间或者完工时间没有进行确认或者当前铲大白状态没有成功!",
		}, "2": {
			galleryId: "putlineGallery",
			uploadId: "putlineUpload",
			tabbable: "putlineDrawing",
			
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
			
			queryInfoUrl: api.construction.queryPutlineConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updatePutlineConstructionSchedule,
			setWorkerSalaryUrl: api.construction.setPutlineConstructionScheduleForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryPutlineDrawingByCsId,
			addDrawingUrl: api.construction.addPutlineDrawing,
			deleteDrawingUrl: api.construction.deletePutlineDrawing,
			
			elementId: "plcsId",
			elementName: "putlineConstructionSchedule",
			drawingId: "pldId",
			drawingName: "putlineDrawing",
			drawings: "putlineDrawings",
			
			nextElementName: "waterwayCircuitPowerConstructionSchedule",
			
			duty: "放线小组",
			
			drawingType: 7,
			
			errorMsg: "放线状态不满足进行下个阶段要求!",
		}, "3": {
			name: "waterwayCircuitPower",
			galleryId: "waterwayCircuitPowerGallery",
			uploadId: "waterwayCircuitPowerUpload",
			tabbable: "waterwayCircuitPowerDrawing",
			
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
			queryWorkerUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			setTimeFlagUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateBricklayConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryWaterwayCircuitPowerDrawingByCsId,
			addDrawingUrl: api.construction.addWaterwayCircuitPowerDrawing,
			deleteDrawingUrl: api.construction.deleteWaterwayCircuitPowerDrawing,
			
			elementId: "wcpcsId",
			elementName: "waterwayCircuitPowerConstructionSchedule",
			workerId: "wcpcswId",
			drawingId: "wcpdId",
			drawingName: "waterwayCircuitPowerDrawing",
			drawings: "waterwayCircuitPowerDrawings",
			
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
			queryWorkerUrl: api.construction.queryBricklayConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateBricklayConstructionSchedule,
			setTimeFlagUrl: api.construction.setBricklayConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setBricklayConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryBricklayDrawingByCsId,
			addDrawingUrl: api.construction.addBricklayDrawing,
			deleteDrawingUrl: api.construction.deleteBricklayDrawing,
			
			elementId: "bcsId",
			elementName: "bricklayConstructionSchedule",
			workerId: "bcswId",
			drawingId: "bdId",
			drawingName: "bricklayDrawing",
			drawings: "bricklayDrawings",
			
			nextElementName: "groundLevelingConstructionSchedule",
			
			duty: "瓦工",
			
			drawingType: 9,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "5": {
			
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
			
			queryInfoUrl: api.construction.queryGroundLevelingConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryGroundLevelingConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			setTimeFlagUrl: api.construction.setGroundLevelingConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setGroundLevelingConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateCarpentConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryGroundLevelingDrawingByCsId,
			addDrawingUrl: api.construction.addGroundLevelingDrawing,
			deleteDrawingUrl: api.construction.deleteGroundLevelingDrawing,
			
			elementId: "glcsId",
			elementName: "groundLevelingConstructionSchedule",
			workerId: "glcswId",
			drawingId: "gldId",
			drawingName: "groundLevelingDrawing",
			drawings: "groundLevelingDrawings",
			
			nextElementName: "carpentConstructionSchedule",
			
			duty: "地面找平",
			
			drawingType: 10,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "6": {
			
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
			
			queryInfoUrl: api.construction.queryCarpentConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryCarpentConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCarpentConstructionSchedule,
			setTimeFlagUrl: api.construction.setCarpentConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setCarpentConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateOilConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryCarpentDrawingByCsId,
			addDrawingUrl: api.construction.addCarpentDrawing,
			deleteDrawingUrl: api.construction.deleteCarpentDrawing,
			
			elementId: "ccsId",
			elementName: "carpentConstructionSchedule",
			workerId: "ccswId",
			drawingId: "cdId",
			drawingName: "carpentDrawing",
			drawings: "carpentDrawings",
			
			nextElementName: "oilConstructionSchedule",
			
			duty: "木工",
			
			drawingType: 11,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "7": {
			
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
			
			queryInfoUrl: api.construction.queryOilConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryOilConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateOilConstructionSchedule,
			setTimeFlagUrl: api.construction.setOilConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setOilConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryOilDrawingByCsId,
			addDrawingUrl: api.construction.addOilDrawing,
			deleteDrawingUrl: api.construction.deleteOilDrawing,
			
			elementId: "ocsId",
			elementName: "oilConstructionSchedule",
			workerId: "ocswId",
			drawingId: "odId",
			drawingName: "oilDrawing",
			drawings: "oilDrawings",
			
			nextElementName: "waterwayCircuitCheckConstructionSchedule",
			
			duty: "油工",
			
			drawingType: 12,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "8": {
			name: "waterwayCircuitCheck",
			galleryId: "waterwayCircuitCheckGallery",
			uploadId: "waterwayCircuitCheckUpload",
			tabbable: "waterwayCircuitCheckDrawing",
			
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
			queryWorkerUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			setTimeFlagUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			nextAddInfoUrl: api.construction.updateCleaningConstructionSchedule,
			
			queryDrawingUrl: api.construction.queryWaterwayCircuitCheckDrawingByCsId,
			addDrawingUrl: api.construction.addWaterwayCircuitCheckDrawing,
			deleteDrawingUrl: api.construction.deleteWaterwayCircuitCheckDrawing,
			
			elementId: "wcccsId",
			elementName: "waterwayCircuitCheckConstructionSchedule",
			workerId: "wcccswId",
			drawingId: "wccdId",
			drawingName: "waterwayCircuitCheckDrawing",
			drawings: "waterwayCircuitCheckDrawings",
			
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
			queryWorkerUrl: api.construction.queryCleaningConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCleaningConstructionSchedule,
			setTimeFlagUrl: api.construction.setCleaningConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setCleaningConstructionScheduleWorkerForSalary,
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

var workerSalaryData = {};

jQuery(function($) {
	
	var orderId = supervisionPostData["constructionSchedule.orderId"];
	
	supervisionDetail.saveBtn = $("#saveBtn").on("click", saveData);
	supervisionDetail.cancelBtn = $("#cancelBtn");
	supervisionDetail.modal = $("#workerSalaryModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	com.post(api.construction.queryConstructionScheduleByOrderId, supervisionPostData, function(res){
		
		supervisionDetail.construstionSchedule = res.constructionSchedule;
		supervisionDetail.mediaServer = window.mediaServer;
		supervisionDetail.dmediaServer = window.dmediaServer;
		
		var schedule = res.constructionSchedule.schedule;
		var operate = supervisionDetail.operateDict[schedule];
		
		supervisionDetail.schedule = schedule;
		
		if(!supervisionDetail.wizardSept[schedule]){
			initWizardSept(operate, schedule);
			supervisionDetail.wizardSept[schedule] = true;
		}
		
		$('#fuelux-wizard').ace_wizard({status:true, currentStep: schedule}).on('change' , function(e, info){
			var step = 0;
			var direction = info.direction;
			
			if(direction == "previous"){
				step = info.step - 1;
				
				if(!supervisionDetail.wizardSept[step.toString()]){
					initWizardSept(supervisionDetail.operateDict[step.toString()], step.toString());
					supervisionDetail.wizardSept[step.toString()] = true;
				}
			}else if(direction == "next"){
				step = info.step + 1;
				
				if(step > supervisionDetail.schedule){
					if(!supervisionDetail.controlCondition){
						com.showAlert(com.warning, operate.errorMsg);
						return false;
					}else{
						supervisionPostData["constructionSchedule."+operate.schedule] = step;
						supervisionPostData["constructionSchedule.csId"] = res.constructionSchedule["csId"];
						
						/**
						 * 施工进度针对订单款项收取情况进行判断以及相应控制
						 */
//						var nextFlag = true;
//						if(step == 3){
//							
//							com.post(api.construction.checkConstructionScheduleForChanStatus, supervisionPostData, null, function(res){
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
//							com.post(api.construction.checkFirstPayment, supervisionPostData, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}else if(step == 6){
//							com.post(api.construction.checkSecondPayment, supervisionPostData, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}else if(step == 9){
//							com.post(api.construction.checkFinalyPayment, supervisionPostData, null, function(res){
//								if(res.errorCode != 0){
//									nextFlag = false;
//									return false;
//								}
//							}, false);
//						}
						
						com.post(api.construction.nextConstructionScheduleByOrderId, supervisionPostData, function(res){
							var options = {};
							options[operate.nextElementName+".orderId"] = supervisionPostData["constructionSchedule.orderId"];
							operate = supervisionDetail.operateDict[step];
							initWizardSept(operate, step);
							supervisionDetail.wizardSept[step] = true;
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
						supervisionDetail.wizardSept[step] = true;
					}
				}
			}
			
		}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){
			if(!supervisionDetail.wizardSept[info.step]){
				initWizardSept(supervisionDetail.operateDict[info.step], info.step);
				supervisionDetail.wizardSept[info.step] = true;
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
		$("#fl-container").load(api.index.supervisionIndex.url);
	});
	
});

function initWizardSept(operate, schedule){
	
	console.log("initWizardSept : " + schedule);
	
	var elementPostData = {};
	elementPostData[operate.elementName+".orderId"] = supervisionPostData["constructionSchedule.orderId"];
	
	supervisionDetail.controlCondition = false;
	var workerInfoCondition = false;
	
	com.post(operate.queryInfoUrl, elementPostData, function(res){
		
		var element = res[operate.elementName];
		
		if(element[operate.elementId] != 0){
			
			supervisionPostData[operate.elementName+"."+operate.elementId] = element[operate.elementId];
			
			if(schedule == 1){
				
				$("#"+operate.startTimeId).val(element.startTime);
				$("#"+operate.endTimeId).val(element.endTime);
				
				var statusDiv = $("#"+operate.status);
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
				
				if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
					$("#chanWorkerImg").attr("src", supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#chanWorkerNameSpan").html(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
					
					workerSalaryData["btnId"] = "chanWorkSalary";
					workerSalaryData["csId"] = element["csId"];
					workerSalaryData["pcsId"] = element[operate.elementId];
					workerSalaryData["workerId"] = element.workerId;
					workerSalaryData["workerName"] = element.workerName;
					workerSalaryData["workerSalary"] = element.workerSalary;
					workerSalaryData["url"] = operate.setWorkerSalaryUrl;
					
					$("#chanWorkSalary").on("click", function(){
						
						var _workerInfo = eval('(' + $(this).attr("workerinfo") + ')');
						
						$("#saveBtn").attr("workerinfo", $(this).attr("workerinfo"));
						$("#workerName").val(_workerInfo.workerName).attr("readonly", "readonly");
						$("#workerSalary").val(_workerInfo.workerSalary);
						
						supervisionDetail.modal.modal("show");
					}).attr("workerinfo", JSON.stringify(workerSalaryData));
					
					workerInfoCondition = true;
				}else{
					var chanWorkerInfo = $("#chanWorkerInfo").html("").removeClass("");
					$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(chanWorkerInfo);
				}
				
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
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
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
						var options = {};
						options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
						options[operate.elementName+"."+operate.endTimeFlag] = 1;
						options[operate.elementName+"."+operate.startTimeFlag] = element[operate.startTimeFlag];
						element[operate.endTimeFlag] = 1;
						
						com.post(operate.setTimeFlagUrl, options, function(res){
							$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
						});
						
						if(element.startTimeFlag != 0 && workerInfoCondition){
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
							}
						}else if(element.startTimeFlag != 0 && !workerInfoCondition){
							if(element.status != undefined && element.status == 4){
								supervisionDetail.controlCondition = true;
							}
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
				
				if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
					$("#fangWorkerImg").attr("src", supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#fangWorkerNameSpan").html(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
					
					workerSalaryData["btnId"] = "fangWorkSalary";
					workerSalaryData["csId"] = element["csId"];;
					workerSalaryData["pcsId"] = element[operate.elementId];
					workerSalaryData["workerId"] = element.workerId;
					workerSalaryData["workerName"] = element.workerName;
					workerSalaryData["workerSalary"] = element.workerSalary;
					workerSalaryData["url"] = operate.setWorkerSalaryUrl;
					
					$("#fangWorkSalary").on("click", function(){
						
						var _workerInfo = eval('(' + $(this).attr("workerinfo") + ')');
						
						$("#saveBtn").attr("workerinfo", $(this).attr("workerinfo"));
						$("#workerName").val(_workerInfo.workerName).attr("readonly", "readonly");
						$("#workerSalary").val(_workerInfo.workerSalary);
						
						supervisionDetail.modal.modal("show");
					}).attr("workerinfo", JSON.stringify(workerSalaryData));
					
					workerInfoCondition = true;
				}else{
					var fangWorkerInfo = $("#fangWorkerInfo").html("").removeClass("");
					$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(fangWorkerInfo);
				}
				
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
				$("#"+operate.startTimeId).val(element.startTime);
				$("#"+operate.endTimeId).val(element.endTime);
				
				var options = {};
				options[operate.elementName+".csId"] = element["csId"];
				options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
				
				com.post(operate.queryWorkerUrl, options, function(res){
					constructionScheduleWorkers = res.constructionScheduleWorkers;
					
					$("#"+operate.workerInfos).html("");
					
					if(constructionScheduleWorkers.length != 0){
						for(var i=0;i<constructionScheduleWorkers.length;i++){
							
							var workerInfo = constructionScheduleWorkers[i];
							
							workerSalaryData["btnId"] = workerInfo.workerId + "workerSalary";
							workerSalaryData["csId"] = element["csId"];
							workerSalaryData["pcsId"] = element[operate.elementId];
							workerSalaryData["pcswId"] = workerInfo[operate.workerId];
							workerSalaryData["workerId"] = workerInfo.workerId;
							workerSalaryData["workerName"] = workerInfo.workerName;
							workerSalaryData["workerSalary"] = workerInfo.workerSalary;
							workerSalaryData["url"] = operate.setWorkerSalaryUrl;
							
							var profileDiv = $('<div class="profile-picture col-sm-2 text-center" style="margin: 4px;"></div>');
							var profileImg = $('<img id="workerImg" src="" alt="" class="editable img-responsive" style="height: 150px"></img>').attr("alt", workerInfo.workerId + "'s Photo").appendTo(profileDiv);
							
							if(workerInfo["workerPhoto"] != null && workerInfo.workerPhoto != ""){
								profileImg.attr("src", supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
							}
							
							var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
							var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty).appendTo(buttonsDiv);
							
							var buttonA = $('<a class="blue pull-left" href="#"></a>').attr("id", workerInfo.workerId+"workerSalary").html('<i class="icon-money bigger-130"></i>').appendTo(profileDiv).on("click", function(){
								$("#saveBtn").attr("workerinfo", $(this).attr("workerinfo"));
								
								var workerInfo = eval('(' + $(this).attr("workerinfo") + ')');
								
								$("#workerName").val(workerInfo.workerName).attr("readonly", "readonly");
								$("#workerSalary").val(workerInfo.workerSalary);
								
								supervisionDetail.modal.modal("show");
							}).attr("workerinfo", JSON.stringify(workerSalaryData));
							
							profileDiv.appendTo($("#"+operate.workerInfos));
						}
						
						workerInfoCondition = true;
					}else{
						$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#"+operate.workerInfos));
					}
					
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
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
								supervisionDetail.controlCondition = true;
							}else{
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
						var options = {};
						options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
						options[operate.elementName+"."+operate.endTimeFlag] = 1;
						options[operate.elementName+"."+operate.startTimeFlag] = element[operate.startTimeFlag];
						element[operate.endTimeFlag] = 1;
						
						com.post(operate.setTimeFlagUrl, options, function(res){
							$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
						});
						
						if(element.startTimeFlag != 0 && workerInfoCondition){
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
							}
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
			}
			
			var options = {};
			options[operate.drawingName+".csId"] = supervisionDetail.construstionSchedule.csId;
			
			com.post(operate.queryDrawingUrl, options, function(res){
				var drawings = res[operate.drawings];
				
				$("#"+operate.galleryId).html("");
				
				for(var i=0;i<drawings.length;i++){
					var drawing = drawings[i];
					
					var imgAddUrl = null;
					var imgUrl = null;
					
					if(drawing.type == 0){
						imgAddUrl = supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
						imgUrl = supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&timestamp='+ new Date().getTime();
					}else{
						imgAddUrl = supervisionDetail.dmediaServer + drawing.drawingUrl + '_150x150.' + drawing.drawingUrl.split('.')[1] + '?timestamp='+ new Date().getTime();
						imgUrl = supervisionDetail.dmediaServer + drawing.drawingUrl + '?timestamp='+ new Date().getTime();
					}
					
					options[operate.drawingName+"."+operate.drawingId] = drawing[operate.drawingId];
					
					appendGalleryElement(operate.galleryId, drawing[operate.drawingId], imgUrl, imgAddUrl, "", operate.deleteDrawingUrl, operate);
				}
			});
			
			initUploadBtn(operate, element);
			$('#'+operate.tabbable).removeClass("active");
			
			return false;
			
		}else{
			supervisionPostData[operate.elementName+"."+operate.elementId] = 0;
		}
	});
}

function initUploadBtn(operate, element){
	console.log("initUploadBtn");
	
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
        //'swf': "./js/uploadify/uploadify.swf", // flash
        'overrideEvents' : ['onDialogClose'],  // 不执行默认的onSelect事件
        //'queueID': 'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader':supervisionDetail.mediaServer + api.common.uploadImg.url, // 上传处理程序
        //'buttonImage': 'upbutton.gif', // 浏览按钮的背景图片路径
        //'width': '100', // 浏览按钮的宽度
        'height': '45', // 浏览按钮的高度
        //'expressInstall': 'expressInstall.swf', // expressInstall.swf文件的路径
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit': '5MB', // 上传文件的大小限制
        'queueSizeLimit' : 10, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
        	// 每次更新上载的文件的进展
            // 有时候上传进度什么想自己个性化控制，可以利用这个方法
            // 使用方法见官方说明
        }, 'onSelect' : function(file) { // 选择上传文件后调用
                  
        }, 'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#file_upload').uploadify('settings','queueSizeLimit')+"个文件!");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#file_upload').uploadify('settings','fileSizeLimit')+"大小!");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常!");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确!");
                    break;
            }
        },
        //'onFallback':function(){ // 检测FLASH失败调用
        //    alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
        //},
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里
        	
        	var dateObj=eval("("+data+")");
        	
        	if(dateObj.errorCode == 0){
				var options = {};
				
				options[operate.drawingName+"."+operate.elementId] = element[operate.elementId];
				options[operate.drawingName+"."+operate.drawingId] = 0;
				options[operate.drawingName+".csId"] = supervisionDetail.construstionSchedule.csId;
				options[operate.drawingName+".drawingName"] = "";
				options[operate.drawingName+".drawingUrl"] = dateObj.resUrl;
				options[operate.drawingName+".drawingAddUrl"] = "";
				
				var imgAddUrl = supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
				var imgUrl = supervisionDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&timestamp='+ new Date().getTime();
				
				com.post(operate.addDrawingUrl, options, function(res){
					var drawing = res[operate.drawingName];
					appendGalleryElement(operate.galleryId, drawing[operate.drawingId], imgUrl, imgAddUrl, "", operate.deleteDrawingUrl, operate);
				});
			}else{
				console.log(data);
			}
        }
    });
}

function appendGalleryElement(galleryId, imgId, imgUrl, imgAddUrl, editUrl, deleteUrl, operate){
	console.log("appendGalleryElement");
	
	var gallery = $("#"+galleryId);
	
	var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
	var imgA = $("<a></a>").attr("href", imgUrl).attr("data-rel", "colorbox").css("height", "150px").appendTo(imgLi);
	$("<img></img>").attr("src", imgAddUrl).attr("alt", "150x150").appendTo(imgA);
	var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
	var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
		var options = {};
		
		options[operate.drawingName+"."+operate.drawingId] = imgId;
		
		com.post(deleteUrl, options, function(res){
			$("#gallery_li"+imgId).remove();
		});
	}).appendTo(toolsDiv);
	$("<i></i>").addClass("icon-remove red").appendTo(toolsA);
};

function saveData(){
	
	var workerInfo = eval('(' + $("#saveBtn").attr("workerinfo") + ')');
	var options = {};
	
	for(var i in workerInfo){
		options["constructionScheduleWorker." + i] = workerInfo[i];
	}
	
	options["constructionScheduleWorker.workerSalary"] = $("#workerSalary").val();
	options["constructionScheduleWorker.orderId"] = workerSalaryData["constructionSchedule.orderId"];
	
	com.post(workerInfo.url, options, function(res){
		workerInfo["workerSalary"] = $("#workerSalary").val();
		$("#"+workerInfo["btnId"]).attr("workerinfo", JSON.stringify(workerInfo));
		
		supervisionDetail.modal.modal("hide");
		
		com.showAlert(com.info, "工人工资设置成功!");
	});
}
