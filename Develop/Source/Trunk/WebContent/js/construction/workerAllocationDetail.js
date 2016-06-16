var workerAllocationDetail = {
	
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
			setStatusUrl: api.construction.setChanConstructionScheduleForStatus,
			confirmStartTimeUrl: api.construction.setChanConstructionScheduleForSalary,
			confirmEndTimeUrl: "",
			
			setWorkerUrl: api.construction.setChanConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updatePutlineConstructionSchedule,
			
			elementId: "ccsId",
			elementName: "chanConstructionSchedule",
			
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
			setStatusUrl: api.construction.setPutlineConstructionScheduleForStatus,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			setWorkerUrl: api.construction.setPutlineConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			
			elementId: "plcsId",
			elementName: "putlineConstructionSchedule",
			
			nextElementName: "waterwayCircuitPowerConstructionSchedule",
			
			duty: "放线小组",
			
			drawingType: 7,
			
			errorMsg: "放线状态不满足进行下个阶段要求!",
		}, "3": {
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
			
			queryInfoUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			setTimeFlagUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleWorker,
			addWorkerUrl: api.construction.addWaterwayCircuitPowerConstructionScheduleWorker,
			setWorkerUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteWaterwayCircuitPowerConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateBricklayConstructionSchedule,
			
			elementId: "wcpcsId",
			elementName: "waterwayCircuitPowerConstructionSchedule",
			workerId: "wcpcswId",
			workerName: "waterwayCircuitPowerConstructionScheduleWorker",
			
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
			updateInfoUrl: api.construction.updateBricklayConstructionSchedule,
			setTimeFlagUrl: api.construction.setBricklayConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setBricklayConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryBricklayConstructionScheduleWorker,
			addWorkerUrl: api.construction.addBricklayConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteBricklayConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			
			elementId: "bcsId",
			elementName: "bricklayConstructionSchedule",
			workerId: "bcswId",
			workerName: "bricklayConstructionScheduleWorker",
			
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
			updateInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			setTimeFlagUrl: api.construction.setGroundLevelingConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setGroundLevelingConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryGroundLevelingConstructionScheduleWorker,
			addWorkerUrl: api.construction.addGroundLevelingConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteGroundLevelingConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateCarpentConstructionSchedule,
			
			elementId: "glcsId",
			elementName: "groundLevelingConstructionSchedule",
			workerId: "glcswId",
			workerName: "groundLevelingConstructionScheduleWorker",
			
			nextElementName: "carpentConstructionSchedule",
			
			duty: "地面找平",
			
			drawingType: 12,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "6": {
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
			
			queryInfoUrl: api.construction.queryCarpentConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateCarpentConstructionSchedule,
			setTimeFlagUrl: api.construction.setCarpentConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setCarpentConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryCarpentConstructionScheduleWorker,
			addWorkerUrl: api.construction.addCarpentConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteCarpentConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateOilConstructionSchedule,
			
			elementId: "ccsId",
			elementName: "carpentConstructionSchedule",
			workerId: "ccswId",
			workerName: "carpentConstructionScheduleWorker",
			
			nextElementName: "oilConstructionSchedule",
			
			duty: "木工",
			
			drawingType: 11,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "7": {
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
			
			queryInfoUrl: api.construction.queryOilConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateOilConstructionSchedule,
			setTimeFlagUrl: api.construction.setOilConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setOilConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryOilConstructionScheduleWorker,
			addWorkerUrl: api.construction.addOilConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteOilConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			
			elementId: "ocsId",
			elementName: "oilConstructionSchedule",
			workerId: "ocswId",
			workerName: "oilConstructionScheduleWorker",
			
			nextElementName: "waterwayCircuitCheckConstructionSchedule",
			
			duty: "油工",
			
			drawingType: 12,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "8": {
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
			
			queryInfoUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			setTimeFlagUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleWorker,
			addWorkerUrl: api.construction.addWaterwayCircuitCheckConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteWaterwayCircuitCheckConstructionScheduleWorker,
			
			nextAddInfoUrl: api.construction.updateCleaningConstructionSchedule,
			
			elementId: "wcccsId",
			elementName: "waterwayCircuitCheckConstructionSchedule",
			workerId: "wcccswId",
			workerName: "waterwayCircuitCheckConstructionScheduleWorker",
			
			nextElementName: "cleaningConstructionSchedule",
			
			waterwayDuty: "水暖工",
			circuitDuty:"电工",
			powerDuty:"力工",
			waterwayCircuitDuty: "水电工",
			
			drawingType: 13,
			
			errorMsg: "开工时间或者完工时间没有进行确认!",
		}, "9": {
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
			
			queryInfoUrl: api.construction.queryCleaningConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateCleaningConstructionSchedule,
			setTimeFlagUrl: api.construction.setCleaningConstructionScheduleForTimeFlag,
			setWorkerSalaryUrl: api.construction.setCleaningConstructionScheduleWorkerForSalary,
			confirmStartTimeUrl: "",
			confirmEndTimeUrl: "",
			
			queryWorkerUrl: api.construction.queryCleaningConstructionScheduleWorker,
			addWorkerUrl: api.construction.addCleaningConstructionScheduleWorker,
			deleteWorkerUrl: api.construction.deleteCleaningConstructionScheduleWorker,
			
			elementId: "ccsId",
			elementName: "cleaningConstructionSchedule",
			workerId: "ccswId",
			workerName: "cleaningConstructionScheduleWorker",
			
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

var workers = {};

var workerAllocationDetailPostData = {};

var workerSalaryData = {};

jQuery(function($) {
	
	var orderId = workerAllocationPostData["constructionSchedule.orderId"];
	
	workerAllocationDetail.saveBtn = $("#saveBtn").on("click", saveData);
	workerAllocationDetail.cancelBtn = $("#cancelBtn");
	workerAllocationDetail.modal = $("#workerSalaryModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	com.post(api.construction.queryConstructionScheduleByOrderId, workerAllocationPostData, function(res){
		
		workerAllocationDetail.construstionSchedule = res.constructionSchedule;
		workerAllocationDetail.mediaServer = window.mediaServer;
		
		var schedule = res.constructionSchedule.schedule;
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
				}else if(step == workerAllocationDetail.schedule){
					if(!(step == 8 && workerAllocationDetail.wizardSept[step])){
						initWizardSept(workerAllocationDetail.operateDict[step], step);
					}
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
		$("#fl-container").load(api.index.workerAllocationIndex.url);
	});
});

function initWizardSept(operate, schedule){
	
	console.log("initWizardSept : " + schedule);
	
	var elementPostData = {};
	var workerInfoCondition = false;
	
	var orderId = workerAllocationPostData["constructionSchedule.orderId"];
	elementPostData[operate.elementName+".orderId"] = workerAllocationPostData["constructionSchedule.orderId"];
	
	workerAllocationDetail.controlCondition = false;
	
	com.post(operate.queryInfoUrl, elementPostData, function(res){
		
		var element = res[operate.elementName];
		
		workerAllocationDetailPostData[operate.elementName+".csId"] = element["csId"];
		workerAllocationDetailPostData[operate.elementName+"."+operate.elementId] = element[operate.elementId];
		
		if(element[operate.elementId] != 0){
			
			workerAllocationDetailPostData[operate.elementName+"."+operate.elementId] = element[operate.elementId];
			
			if(schedule == 1){
				
				$("#"+operate.startTimeId).val(element.startTime);
				$("#"+operate.endTimeId).val(element.endTime);
				
				var chanStatus = element.status;
				var chanSuccessBtn = $("#chanSuccess");
				var chanFailBtn = $("#chanFail");
				var chanDelayBtn = $("#chanDelay");
				var chanPassBtn = $("#chanPass");
				
				chanSuccessBtn.click(function(){
					var options = {};
					
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".status"] = 1;
					
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
					
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".status"] = 2;
					
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
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".status"] = 3;
					
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
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".status"] = 4;
					
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
				
				if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
					$("#chanWorkerImg").attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#chanWorkerNameSpan").html(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
					
					workerInfoCondition = true;
				}else{
					$("#chanWorkerEnter").css("display", "block");
					$("#chanWorkerInfo").css("display", "none");
				}
				
				initChange("chanWorkerName", api.personel.queryUserForNameByDuty, api.personel.queryUserByUserId, {"duty": operate.duty});
				
				$("#chanWorkerSubmit").on("click", function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".workerId"] = workerAllocationDetail.workerUserId["#chanWorkerName"];
					
					if($("#chanWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}
					
					com.post(operate.setWorkerUrl, options, function(res){
						workerAllocationDetailPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
						
						var workerInfo = res[operate.elementName];
						
						$("#chanWorkerEnter").css("display", "none");
						$("#chanWorkerInfo").css("display", "block");
						
						$("#chanWorkerImg").attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", workerInfo.workerId+"'s Photo");
						$("#chanWorkerNameSpan").html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty);
						
						com.showAlert(com.info, "工人信息提交成功!");
					});
					
					return false;
				});
				
				$("#removeChanWork").on("click", function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".workerId"] = "";
					
					console.log(options)
					
					com.post(operate.setWorkerUrl, options, function(res){
						$("#chanWorkerEnter").css("display", "block");
						$("#chanWorkerInfo").css("display", "none");
						
						com.showAlert(com.info, "操作成功");
					})
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
						
						if(element.endTimeFlag != 0 && workerInfoCondition){
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
								workerAllocationDetail.controlCondition = true;
							}else{
								workerAllocationDetail.controlCondition = true;
							}
						}else if(element.endTimeFlag != 0 && !workerInfoCondition){
							if(element.status != undefined && element.status == 4){
								workerAllocationDetail.controlCondition = true;
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
								workerAllocationDetail.controlCondition = true;
							}else{
								workerAllocationDetail.controlCondition = true;
							}
						}else if(element.startTimeFlag != 0 && !workerInfoCondition){
							if(element.status != undefined && element.status == 4){
								workerAllocationDetail.controlCondition = true;
							}
						}
						
						return false;
					});
				}else{
					$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
				}
				
				if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && workerInfoCondition){
					if(element.status != undefined && (element.status == 0 || element.status == 2)){
						workerAllocationDetail.controlCondition = false;
					}else if(element.status != undefined && element.status == 1){
						workerAllocationDetail.controlCondition = true;
					}else{
						workerAllocationDetail.controlCondition = true;
					}
				}else if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && !workerInfoCondition){
					if(element.status != undefined && element.status == 4){
						workerAllocationDetail.controlCondition = true;
					}
				}
			}else if(schedule == 2){
				
				$("#"+operate.putlineTimeId).val(element.startTime).attr("disabled", "disabled");
				
				if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
					$("#fangWorkerImg").attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#fangWorkerNameSpan").html(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
					
					workerInfoCondition = true;
				}else{
					$("#fangWorkerEnter").css("display", "block");
					$("#fangWorkerInfo").css("display", "none");
				}
				
				initChange("fangWorkerName", api.personel.queryUserForNameByDuty, api.personel.queryUserByUserId, {"duty":operate.duty});
				
				$("#fangWorkerSubmit").on("click", function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".workerId"] = workerAllocationDetail.workerUserId["#fangWorkerName"];
					
					if($("#fangWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}
					
					com.post(operate.setWorkerUrl, options, function(res){
						workerAllocationDetailPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
						
						$("#fangWorkerEnter").css("display", "none");
						$("#fangWorkerInfo").css("display", "block");
						
						var workerInfo = res[operate.elementName];
						
						$("#fangWorkerImg").attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", workerInfo.workerId+"'s Photo");
						$("#fangWorkerNameSpan").html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty);
						
						com.showAlert(com.info, "工人信息提交成功!");
					});
					
					return false;
				});
				
				$("#removeFangWork").on("click", function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".workerId"] = "";
					
					console.log(options)
					
					com.post(operate.setWorkerUrl, options, function(res){
						$("#fangWorkerEnter").css("display", "block");
						$("#fangWorkerInfo").css("display", "none");
						
						com.showAlert(com.info, "操作成功");
					})
				});
				
				var putlineStatus = element.putlineStatus;
				var putlineSuccessBtn = $("#putlineSuccess");
				var putlineFailBtn = $("#putlineFail");
				
				changeFangStatus(putlineStatus);
				
				if(putlineStatus == 2 || putlineStatus == 1){
					putlineSuccessBtn.attr("disabled", "disabled");
					putlineFailBtn.attr("disabled", "disabled");
				}
				
				putlineSuccessBtn.click(function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".putlineStatus"] = 1;
					
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
					options[operate.elementName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".putlineStatus"] = 2;
					
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
					initChange(operate.name + "WorkerName", api.personel.queryUserForNameByDutysAO, api.personel.queryUserByUserId, {"dutysO[0]":operate.waterwayDuty, "dutysO[1]":operate.circuitDuty, "dutysO[2]":operate.powerDuty, "dutysO[3]":operate.waterwayCircuitDuty});
				}else{
					initChange(operate.name + "WorkerName", api.personel.queryUserForNameByDuty, api.personel.queryUserByUserId, {"duty":operate.duty});
				}
				
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
							
							var workerId = workerInfo[operate.elementId] + "-" + workerInfo[operate.workerId];
							
							workers[workerId] = workerInfo;
							
							var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", "worker-" + workerId);
							var profileImg = $('<img></img>').addClass("editable img-responsive").css("height", "150px").attr("id", "workerImg").attr("alt", workerInfo.workerId+"'s Photo").appendTo(profileDiv);
							
							if(workerInfo.workerPhoto != null && workerInfo.workerPhoto != ""){
								profileImg.attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
							}
							
							var buttonsDiv = $('<div></div>').addClass("visible-md visible-lg hidden-sm hidden-xs action-buttons").css("padding", "5px").appendTo(profileDiv);
							var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty).appendTo(buttonsDiv);
							var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("wId", workerId).click(function(){
								
								var id = $(this).attr('wId');
								
								var worker = workers[id];
								
								var args = {};
								args[operate.workerName+"."+operate.workerId] = worker[operate.workerId];
								
								if(worker){
									com.post(operate.deleteWorkerUrl, args, function(res){
										$("#worker-" + id).remove();
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
				}, null, false);
				
				$("#" + operate.name + "WorkerSubmit").on("click", function(){
					
					if($("#" + operate.name + "WorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}
					
					var args = {};
					args[operate.workerName+".csId"] = workerAllocationDetailPostData[operate.elementName+".csId"];
					args[operate.workerName+"."+operate.elementId] = workerAllocationDetailPostData[operate.elementName+"."+operate.elementId];
					args[operate.workerName+".orderId"] = workerAllocationPostData["constructionSchedule.orderId"];
					args[operate.workerName+".workerId"] = workerAllocationDetail.workerUserId["#" + operate.name + "WorkerName"];
					args[operate.workerName+".workerName"] = $("#" + operate.name + "WorkerName_chosen span")[0].textContent.split("-")[0];
					
					com.post(operate.addWorkerUrl, args, function(res){
						
						var workerInfo = res[operate.workerName];
						
						var workerId = workerInfo[operate.elementId] + "-" + workerInfo[operate.workerId];
						
						workers[workerId] = workerInfo;
						
						var profileDiv = $('<div></div>').addClass("profile-picture col-sm-2 text-center").css("margin", "4px").attr("id", "worker-" + workerId);
						var profileImg = $('<img src="" alt="" class="editable img-responsive" style="height: 150px;"></img>').attr("alt", workerInfo.workerId+"'s Photo").appendTo(profileDiv);
						
						if(workerInfo.workerPhoto != null && workerInfo.workerPhoto != ""){
							profileImg.attr("src", workerAllocationDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
						}
						
						var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
						var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty).appendTo(buttonsDiv);
						var removeBtn = $('<a></a>').addClass('red pull-left').attr('href', '#').attr("wId", workerId).click(function(){
							var id = $(this).attr('wId');
							
							var worker = workers[id];
							
							var args = {};
							args[operate.workerName+"."+operate.workerId] = worker[operate.workerId];
							
							if(worker){
								com.post(operate.deleteWorkerUrl, args, function(res){
									$("#worker-" + id).remove();
								});
							}
						}).appendTo(buttonsDiv);
						var removeI = $('<i></i>').addClass("icon-remove bigger-130").appendTo(removeBtn);
						
						var workerInfos = $("#" + operate.name + "WorkerInfos");
						
						if(workerInfos.children(".profile-picture").length == 0){
							workerInfos.html("");
						}
						
						profileDiv.appendTo(workerInfos);
					});
					
					return false;
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
						
						if(element.endTimeFlag != 0 && workerInfoCondition){
							if(element.status != undefined && (element.status != 0 || element.status != 2)){
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
				
				if(element.startTimeFlag != 0 && element.endTimeFlag != 0 && workerInfoCondition){
					if(element.status != undefined && (element.status == 0 || element.status == 2)){
						workerAllocationDetail.controlCondition = false;
					}else if(element.status != undefined && element.status == 1){
						workerAllocationDetail.controlCondition = true;
					}else{
						workerAllocationDetail.controlCondition = true;
					}
				}
			}
			
			$('#'+operate.tabbable).removeClass("active");
			
			return false;
			
		}else{
			workerAllocationDetailPostData[operate.elementName+"."+operate.elementId] = 0;
		}
	});
}

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
		
		workerAllocationDetail.modal.modal("hide");
		
		com.showAlert(com.info, "工人工资设置成功!");
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

function initChange(id, queryElementsUrl, queryElementUrl, options){
	
	console.log("initChange");
	
	id = "#" + id;
	var imgId = id + "Img";
	var chosenNameId = id+"_chosen input";
	var chosenName = id+"_chosen";
	
	$(id).chosen({
	    allow_single_deselect: true
	})
	
	$(id).on("change", function(){
		var args = {};
		args["user.userId"] = $(id).val();
		workerAllocationDetail.workerUserId[id] = $(id).val();
	});
	
	$(chosenNameId).bind("input", function(){
		var autoFileSearchValue = $(chosenNameId).val();
		if(!autoFileSearchValue || autoFileSearchValue == ""){
			return;
		}
		options["pinyinName"] = autoFileSearchValue;
		com.post(queryElementsUrl, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillKeyValue != null){
					for(var i=0;i<res.autoFillKeyValue.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				$(id).html(html1).trigger("chosen:updated");
				$(chosenNameId).val(autoFileSearchValue);
			}
		});
	});
	
	$(chosenName).css("width", "240px");
}
