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

		constructionSchedules: {},

		schedule: 0,

		scheduleNum: 0,

		numi: 0,

		construstionSchedule : "construstionSchedule",

		operateDict: {
			"1": {
				num: 1,
				name:"chan",
				nodeName:"铲大白",
				nodeNamePinyin: "chan",
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
				status: "chanStatus",

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
				name: "putline",
				nodeName:"放线",
				nodeNamePinyin: "putline",
				galleryId: "putlineGallery",
				uploadId: "putlineUpload",
				tabbable: "putlineDrawing",

				startTimeId: "putlineStartTime",
				startTimeFlagId: "putlineStartTimeFlag",
				endTimeId: "putlineEndTime",
				endTimeFlagId: "putlineEndTimeFlag",
				putlineTimeId: "putlineStartTime",
				putlineStatusId: "putlineStatus",
				workerInfos: "putlineWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				startTimeFlag: "startTimeFlag",
				endTime: "endTime",
				endTimeFlag: "endTimeFlag",
				schedule: "schedule",
				putlineTime: "putlineStartTime",
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
				nodeName:"力水电",
				nodeNamePinyin: "waterwayCircuitPower",
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
				nodeName:"瓦工",
				nodeNamePinyin: "bricklay",
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
				nodeName:"地面找平",
				nodeNamePinyin: "groundLeveling",
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
				nodeName:"木工",
				nodeNamePinyin: "carpent",
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
				nodeName:"油工",
				nodeNamePinyin: "oil",
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
				nodeName:"水电验收",
				nodeNamePinyin: "waterwayCircuitCheck",
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
				nodeName:"保洁",
				nodeNamePinyin: "cleaning",
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

	//动态获取节点轴
	com.post(api.construction.queryConstructionScheduleByOrderId,{"constructionSchedule.orderId":params.orderId},function(res){

		var constructionSchedule = res.constructionSchedules;

		workerAllocationDetail.constructionSchedules = res.constructionSchedules;

		$.each(constructionSchedule, function(i, v){
			constructerNode("#stepId", v.schedule,workerAllocationDetail.operateDict[v.schedule].nodeName);
			constructerPane("#step-container", v.schedule,workerAllocationDetail.operateDict[v.schedule].nodeNamePinyin, workerAllocationDetail.operateDict[v.schedule].nodeName);
		});


			initWizardSept(workerAllocationDetail.operateDict[1], 1);

			$('#fuelux-wizard').ace_wizard({status:true, currentStep: 1}).on('finished', function(e) {
				com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
			}).on('stepclick', function(e, info){

				var stepId = $("[flag]").eq(info.step-1).attr("id");
				var sd = stepId.substr(4,1);
				if(!workerAllocationDetail.wizardSept[sd]){
					initWizardSept(workerAllocationDetail.operateDict[sd], sd);
				}
			});


	},null,false);

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
					$("#"+operate.startTimeId).val( element[0].startTime);
					$("#"+operate.endTimeId).val( element[0].endTime);

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
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					com.post(operate.queryWorkerUrl, options, function (res) {
						queryWorkerUrl(operate,res,options);
					}, null, false);


					com.initChosen('chanWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

					$("#chanWorkerSubmit").on("click", function(){
						var args = {};
						args[operate.elementConstructerName + ".cid"] = element[0].cid;
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

					if( element[0].startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options[operate.elementName+"."+operate.elementId] = element[0][operate.elementId];
							options[operate.elementName+"."+operate.startTimeFlag] = 1;
							options[operate.elementName+"."+operate.endTimeFlag] = element[0][operate.endTimeFlag];
							 element[0][operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							if( element[0].endTimeFlag != 0 && workerInfoCondition){
								if(elemen[schedule-1].status != undefined && ( element[0].status != 0 || element[0].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}else if( element[0].endTimeFlag != 0 && !workerInfoCondition){
								if( element[0].status != undefined && element[0].status == 4){
									workerAllocationDetail.controlCondition = true;
								}
							}

							return false;
						});
					}else{
						$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
					}

					if( element[0].endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[0].csId;//这里的cid不确定是cid 还是csid
							options["constructionSchedule.endTimeFlag"] = 1;
							options["constructionSchedule.startTimeFlag"] = element[0][operate.startTimeFlag];
							 element[0][operate.endTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
							});

							if( element[0].startTimeFlag != 0 && workerInfoCondition){
								if( element[0].status != undefined && ( element[0].status != 0 || element[0].status != 2)){
									workerAllocationDetail.controlCondition = true;
								}else{
									workerAllocationDetail.controlCondition = true;
								}
							}else if( element[0].startTimeFlag != 0 && !workerInfoCondition){
								if( element[0].status != undefined && element[0].status == 4){
									workerAllocationDetail.controlCondition = true;
								}
							}

							return false;
						});
					}else{
						$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
					}

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

					$("#"+operate.putlineTimeId).val( element[0].startTime).attr("disabled", "disabled");
					var options = {};
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					com.post(operate.queryWorkerUrl, options, function (res) {
						queryWorkerUrl(operate,res,options);
					}, null, false);


					com.initChosen('putlineWorkerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": operate.duty}, "autoFillKeyValue", "key", "value");

					$("#putlineWorkerSubmit").on("click", function(){
						var args = {};
						args[operate.elementConstructerName + ".cid"] = element[0].cid;
						args[operate.elementConstructerName + ".schedule"] = schedule;
						args[operate.elementConstructerName + ".user.userId"] = $('#putlineWorkerName').val();

						if($("#putlineWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}

						var ly_userId = $('#putlineWorkerName').val();
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
						},function(data){
							com.showAlert(com.error, "工程信息不存在!");
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

					$("#"+operate.startTimeId).val(element[0].startTime);
					$("#"+operate.endTimeId).val(element[0].endTime);

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
						args[operate.elementConstructerName + ".cid"] = element[0].cid;
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

					if( element[0].startTimeFlag == 0){
						$("#"+operate.startTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[0].csId;
							options["constructionSchedule."+operate.startTimeFlag] = 1;
							options["constructionSchedule."+operate.endTimeFlag] = element[0][operate.endTimeFlag];
							 element[0][operate.startTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.startTimeFlagId).attr("disabled", "disabled");
							});

							if( element[0].endTimeFlag != 0 && workerInfoCondition){
								if( element[0].status != undefined && ( element[0].status != 0 || element[0].status != 2)){
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

					if( element[0].endTimeFlag == 0){
						$("#"+operate.endTimeFlagId).click(function(){
							var options = {};
							options["constructionSchedule.csId"] = element[0].csId;
							options["constructionSchedule."+operate.endTimeFlag] = 1;
							options["constructionSchedule."+operate.startTimeFlag] = element[0][operate.startTimeFlag];
							 element[0][operate.endTimeFlag] = 1;

							com.post(operate.setTimeFlagUrl, options, function(res){
								$("#"+operate.endTimeFlagId).attr("disabled", "disabled");
							});

							if( element[0].startTimeFlag != 0 && workerInfoCondition){
								if( element[0].status != undefined && ( element[0].status != 0 || element[0].status != 2)){
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

					if( element[0].startTimeFlag != 0 && element[0].endTimeFlag != 0 && workerInfoCondition){
						if( element[0].status != undefined && ( element[0].status == 0 || element[0].status == 2)){
							workerAllocationDetail.controlCondition = false;
						}else if( element[0].status != undefined && element[0].status == 1){
							workerAllocationDetail.controlCondition = true;
						}else{
							workerAllocationDetail.controlCondition = true;
						}
					}
				}

				$('#'+operate.tabbable).removeClass("active");

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

	//画节点信息轴
	function constructerNode(stepul,schedule, nodeName){
		var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
		var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
		var stepSpan = $("<span></span>").addClass("title").html(nodeName).appendTo(stepLi);
	}

	//画施工人员面板
	function constructerPane(paneId, schedule, scheduleNamePinyin, scheduleNameGBK){

		console.log(paneId, schedule, scheduleNamePinyin, scheduleNameGBK);

		var paneWorker = $("<div></div>").addClass("step-pane").attr("id","step" + schedule).attr("flag","step").appendTo(paneId);
		var paneWorkerRow = $("<div></div>").addClass("row").appendTo(paneWorker);
		var paneWorkerForm = $("<form></form>").addClass("form-horizontal").appendTo(paneWorkerRow);
		var paneWorkerGroup = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);

		var paneWorkerSm = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroup);
		var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSm);
		var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
		var paneWorkerSpan = $("<span></span>").html(scheduleNameGBK + "信息").appendTo(paneWorkerH3);

		//开工时间
		var paneWorkerGroupTwo = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
		var paneWorkerStart = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for",scheduleNamePinyin + "StartTime").html("开工时间").appendTo(paneWorkerGroupTwo);
		var paneWorkerSmTwo = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTwo);
		var paneWorkerInput = $("<input/>").attr("id",scheduleNamePinyin + "StartTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerSmTwo);
		var paneWorkerSpace = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);

		//完工时间
		if(schedule != 2){
			var paneWorkerGroupTh = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
			var paneWorkerEnd = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for",scheduleNamePinyin + "EndTime").html("完工时间").appendTo(paneWorkerGroupTh);
			var paneWorkerSmTh = $("<div></div>").addClass("col-sm-4").appendTo(paneWorkerGroupTh);
			var paneWorkerInputTwo = $("<input/>").attr("id",scheduleNamePinyin + "EndTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerSmTh);
			var paneWorkerSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupTwo);
		}

		//铲大白放线状态
		if(schedule == 1 || schedule == 2){
			var paneWorkerGroupF = $("<div></div>").addClass("form-group").appendTo(paneWorkerGroup);
			var paneWorkerLab = $("<label></label>").addClass("col-sm-2 control-label no-padding-right").attr("for",scheduleNamePinyin + "Status").html(scheduleNameGBK + "状态").appendTo(paneWorkerGroupF);
			var paneWorkerLabDiv = $("<div></div>").attr("id",scheduleNamePinyin + "Status").addClass("col-sm-6").appendTo(paneWorkerGroupF);
			var paneWorkerSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneWorkerGroupF);

			var paneWorkerGroupFive = $("<div></div>").addClass("form-group").attr("id",scheduleNamePinyin + "Operate").appendTo(paneWorkerGroup);
			var paneWorkerSmFive = $("<div></div>").addClass("col-sm-offset-2").appendTo(paneWorkerGroupFive);
			var paneWorkerBtnS = $("<button></button>").attr("id",scheduleNamePinyin + "Success").addClass("btn btn-xs btn-success").html("成功").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			var paneWorkerBtnD = $("<button></button>").attr("id",scheduleNamePinyin + "Fail").addClass("btn btn-xs btn-danger").html("失败").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			if(schedule == 1){
				var paneWorkerBtnW = $("<button></button>").attr("id",scheduleNamePinyin + "Delay").addClass("btn btn-xs btn-warning").html("延迟").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
				var paneWorkerBtnI = $("<button></button>").attr("id",scheduleNamePinyin + "Pass").addClass("btn btn-xs btn-info").html("通过").attr("style","margin-right:5px").appendTo(paneWorkerSmFive);
			}
		}
		var paneWorkerGroupS = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmS = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupS);
		var paneWorkerHTh = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorkerSmS);
		var paneWorkerHThi = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerHTh);
		var paneWorkerHThSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerHTh);

		var paneWorkerGroupSe = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerEnter = $("<div></div>").attr("id",scheduleNamePinyin + "WorkerEnter").appendTo(paneWorkerGroupSe);
		var paneWorkerEnlab = $("<lable></lable>").addClass("col-sm-1 control-label").attr("for",scheduleNamePinyin + "WorkerName").html("工人姓名").appendTo(paneWorkerEnter);
		var paneWorkerSel = $("<select></select>").attr("id",scheduleNamePinyin + "WorkerName").addClass("chosen-select col-sm-2 v_required").attr("data-placeholder","请输入工人名称").attr("data-toggle","popover").attr("data-trigger","manual").appendTo(paneWorkerEnter);
		var paneWorkerOp = $("<option></option>").attr("value","").html("&nbsp;").appendTo(paneWorkerSel);

		var paneWorkerGroupEi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmEi = $("<div></div>").addClass("col-sm-offset-1").appendTo(paneWorkerGroupEi);
		var paneWorkerbtnEi = $("<button></button>").attr("id",scheduleNamePinyin + "WorkerSubmit").addClass("btn btn-xs col-sm-2 workerSubmit").html("确认").appendTo(paneWorkerSmEi);
		var paneWorkerSpaceEi = $("<div></div>").addClass("space-4").appendTo(paneWorkerForm);

		var paneWorkerGroupNi = $("<div></div>").addClass("form-group").appendTo(paneWorkerForm);
		var paneWorkerSmNi = $("<div></div>").addClass("col-sm-12").appendTo(paneWorkerGroupNi);
		var paneWorkerInfoNi = $("<div></div>").attr("id",scheduleNamePinyin + "WorkerInfos").appendTo(paneWorkerSmNi);
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
