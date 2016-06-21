var qualityTestingDetail = {
		
	mediaServer: "",
	construstionSchedule: {},
	
	qualityGalleryId: "qualityGallery",
	qualityUpload: "qualityUpload",
	
	operateDict: {
		"1": {
			queryInfoUrl: api.construction.queryChanConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateChanConstructionSchedule,
//			setInfoUrl: api.construction.setChanConstructionScheduleForInfo,
			setInfoUrl: api.construction.updateChanConstructionSchedule,
			setWorkerUrl: api.construction.setChanConstructionScheduleWorker,
			setStatusUrl: api.construction.setChanConstructionScheduleForStatus,
			
			queryDrawingUrl: api.construction.queryChanDrawingByCsId,
			addDrawingUrl: api.construction.addChanDrawing,
			deleteDrawingUrl: api.construction.deleteChanDrawing,
			
			elementId: "ccsId",
			elementName: "chanConstructionSchedule",
			drawingId: "cdId",
			drawingName: "chanDrawing",
			drawings: "chanDrawings",
			
			duty: "铲大白",
			
			drawingType: 6,
		}, "2": {
			queryInfoUrl: api.construction.queryPutlineConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updatePutlineConstructionSchedule,
			setInfoUrl: api.construction.setPutlineConstructionScheduleForInfo,
			setWorkerUrl: api.construction.setPutlineConstructionScheduleWorker,
			setStatusUrl: api.construction.setPutlineConstructionScheduleForStatus,
			
			queryDrawingUrl: api.construction.queryPutlineDrawingByCsId,
			addDrawingUrl: api.construction.addPutlineDrawing,
			deleteDrawingUrl: api.construction.deletePutlineDrawing,
			
			elementId: "plcsId",
			elementName: "putlineConstructionSchedule",
			drawingId: "pldId",
			drawingName: "putlineDrawing",
			drawings: "putlineDrawings",
			
			duty: "放线",
			
			drawingType: 7,
		}, "3": {
			queryInfoUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleWorker,
			addWorkerUrl: api.construction.addWaterwayCircuitPowerConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			setInfoUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleForInfo,
			setWorkerUrl: api.construction.setWaterwayCircuitPowerConstructionScheduleWorker,
			
			queryDrawingUrl: api.construction.queryWaterwayCircuitPowerDrawingByCsId,
			addDrawingUrl: api.construction.addWaterwayCircuitPowerDrawing,
			deleteDrawingUrl: api.construction.deleteWaterwayCircuitPowerDrawing,
			
			elementId: "wcpcsId",
			elementName: "waterwayCircuitPowerConstructionSchedule",
			workerId: "wcpcswId",
			workerName: "waterwayCircuitPowerConstructionScheduleWorker",
			drawingId: "wcpdId",
			drawingName: "waterwayCircuitPowerDrawing",
			drawings: "waterwayCircuitPowerDrawings",
			
			waterwayDuty: "水暖工",
			circuitDuty:"电工",
			powerDuty:"力工",
			waterwayCircuitDuty: "水电工",
			
			drawingType: 8,
		}, "4": {
			queryInfoUrl: api.construction.queryBricklayConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryBricklayConstructionScheduleWorker,
			addWorkerUrl: api.construction.addBricklayConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateBricklayConstructionSchedule,
			setInfoUrl: api.construction.setBricklayConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryBricklayDrawingByCsId,
			addDrawingUrl: api.construction.addBricklayDrawing,
			deleteDrawingUrl: api.construction.deleteBricklayDrawing,
			
			elementId: "bcsId",
			elementName: "bricklayConstructionSchedule",
			workerId: "bcswId",
			workerName: "bricklayConstructionScheduleWorker",
			drawingId: "bdId",
			drawingName: "bricklayDrawing",
			drawings: "bricklayDrawings",
			
			duty: "瓦工",
			
			drawingType: 9,
		}, "5": {
			queryInfoUrl: api.construction.queryGroundLevelingConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryGroundLevelingConstructionScheduleWorker,
			addWorkerUrl: api.construction.addGroundLevelingConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			setInfoUrl: api.construction.setGroundLevelingConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryGroundLevelingDrawingByCsId,
			addDrawingUrl: api.construction.addGroundLevelingDrawing,
			deleteDrawingUrl: api.construction.deleteGroundLevelingDrawing,
			
			elementId: "glcsId",
			elementName: "groundLevelingConstructionSchedule",
			workerId: "glcswId",
			workerName: "groundLevelingConstructionScheduleWorker",
			drawingId: "gldId",
			drawingName: "groundLevelingDrawing",
			drawings: "groundLevelingDrawings",
			
			duty: "地面找平",
			
			drawingType: 10,
		}, "6": {
			queryInfoUrl: api.construction.queryCarpentConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryCarpentConstructionScheduleWorker,
			addWorkerUrl: api.construction.addCarpentConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCarpentConstructionSchedule,
			setInfoUrl: api.construction.setCarpentConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryCarpentDrawingByCsId,
			addDrawingUrl: api.construction.addCarpentDrawing,
			deleteDrawingUrl: api.construction.deleteCarpentDrawing,
			
			elementId: "ccsId",
			elementName: "carpentConstructionSchedule",
			workerId: "ccswId",
			workerName: "carpentConstructionScheduleWorker",
			drawingId: "cdId",
			drawingName: "carpentDrawing",
			drawings: "carpentDrawings",
			
			duty: "木工",
			
			drawingType: 11,
		}, "7": {
			queryInfoUrl: api.construction.queryOilConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryOilConstructionScheduleWorker,
			addWorkerUrl: api.construction.addOilConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateOilConstructionSchedule,
			setInfoUrl: api.construction.setOilConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryOilDrawingByCsId,
			addDrawingUrl: api.construction.addOilDrawing,
			deleteDrawingUrl: api.construction.deleteOilDrawing,
			
			elementId: "ocsId",
			elementName: "oilConstructionSchedule",
			workerId: "ocswId",
			workerName: "oilConstructionScheduleWorker",
			drawingId: "odId",
			drawingName: "oilDrawing",
			drawings: "oilDrawings",
			
			duty: "油工",
			
			drawingType: 12,
		}, "8": {
			queryInfoUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleWorker,
			addWorkerUrl: api.construction.addWaterwayCircuitCheckConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			setInfoUrl: api.construction.setWaterwayCircuitCheckConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryWaterwayCircuitCheckDrawingByCsId,
			addDrawingUrl: api.construction.addWaterwayCircuitCheckDrawing,
			deleteDrawingUrl: api.construction.deleteWaterwayCircuitCheckDrawing,
			
			elementId: "wcccsId",
			elementName: "waterwayCircuitCheckConstructionSchedule",
			workerId: "wcccswId",
			workerName: "waterwayCircuitCheckConstructionScheduleWorker",
			drawingId: "wccdId",
			drawingName: "waterwayCircuitCheckDrawing",
			drawings: "waterwayCircuitCheckDrawings",
			
			waterwayDuty: "水暖工",
			circuitDuty:"电工",
			powerDuty:"力工",
			waterwayCircuitDuty: "水电工",
			
			drawingType: 13,
		}, "9": {
			queryInfoUrl: api.construction.queryCleaningConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryCleaningConstructionScheduleWorker,
			addWorkerUrl: api.construction.addCleaningConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCleaningConstructionSchedule,
			setInfoUrl: api.construction.setCleaningConstructionScheduleForInfo,
			
			queryDrawingUrl: api.construction.queryCleaningDrawingByCsId,
			addDrawingUrl: api.construction.addCleaningDrawing,
			deleteDrawingUrl: api.construction.deleteCleaningDrawing,
			
			elementId: "ccsId",
			elementName: "cleaningConstructionSchedule",
			workerId: "ccswId",
			workerName: "cleaningConstructionScheduleWorker",
			drawingId: "cdId",
			drawingName: "cleaningDrawing",
			drawings: "cleaningDrawings",
			
			duty: "保洁工",
			
			drawingType: 14,
		},
	},
	
	operateInfo: {},
	workerUserId: {},
};

var workerSalaryData = {};

jQuery(function($) {

	var orderId = qualityTestingPostData["constructionSchedule.orderId"];
	
	qualityTestingDetail.saveBtn = $("#saveBtn").on("click", saveData);
	qualityTestingDetail.cancelBtn = $("#cancelBtn");
	qualityTestingDetail.modal = $("#workerSalaryModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	com.post(api.construction.queryConstructionScheduleByOrderId, qualityTestingPostData, function(res){
		qualityTestingDetail.construstionSchedule = res.constructionSchedule;
		qualityTestingDetail.mediaServer = window.mediaServer;
		qualityTestingDetail.dmediaServer = window.dmediaServer;
		
		var operate = qualityTestingDetail.operateDict[qualityTestingDetail.construstionSchedule.schedule];
		
		var elementPostData = {};
		elementPostData[operate.elementName+".orderId"] = orderId;
		
		com.post(operate.queryInfoUrl, elementPostData, function(res){
			var element = res[operate.elementName];
			qualityTestingPostData[operate.elementName+".csId"] = element["csId"];
			qualityTestingPostData[operate.elementName+"."+operate.elementId] = element[operate.elementId];
			var schedule = qualityTestingDetail.construstionSchedule.schedule;
			
			if(schedule == 1){
				$("#chan").css("display", "block");
				$("#putline").css("display", "none");
				$("#common").css("display", "none");
				
				var chanStatus = element.status;
				var chanSuccessBtn = $("#chanSuccess");
				var chanFailBtn = $("#chanFail");
				var chanDelayBtn = $("#chanDelay");
				var chanPassBtn = $("#chanPass");
				
				chanSuccessBtn.click(function(){
					var options = {};
					
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
					
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
				
				$("#chanStartTime").val(element.startTime);
				$("#chanEndTime").val(element.endTime);
				
				element.startTimeFlag == 1 ? $("#chanStartTime").attr("disabled", "disabled") : $("#chanStartTime").removeAttr("disabled");
				element.endTimeFlag == 1 ? $("#chanEndTime").attr("disabled", "disabled") : $("#chanEndTime").removeAttr("disabled");
				
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
					$("#chanWorkerEnter").css("display", "none");
					$("#chanWorkerInfo").css("display", "block");
					
					$("#chanWorkerImg").attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#chanWorkerNameSpan").text(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
				}else{
					$("#chanWorkerEnter").css("display", "block");
					$("#chanWorkerInfo").css("display", "none");
					
					initChange("chanWorkerName", api.personel.queryUserForNameByDutyADept, api.personel.queryUserByUserId, {"duty":operate.duty});
					
					$("#chanWorkerSubmit").on("click", function(){
						console.log("chanWorkerSubmit");
						
						var options = {};
						options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
						options[operate.elementName+".orderId"] = orderId;
						options[operate.elementName+".workerId"] = qualityTestingDetail.workerUserId["#chanWorkerName"];
						
						if($("#chanWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}
						
						com.post(operate.setWorkerUrl, options, function(res){
							qualityTestingPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
							
							var workerInfo = res[operate.elementName];
							
							$("#chanWorkerEnter").css("display", "none");
							$("#chanWorkerInfo").css("display", "block");
							
							$("#chanWorkerImg").attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", workerInfo.workerId+"'s Photo");
							$("#chanWorkerNameSpan").text(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty);
							
							com.showAlert(com.info, "工人信息提交成功!");
						});
						
						return false;
					});
				}
				
				$("#btnSubmit").click(function(){
					var options = {};
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					
					var _startTime = $("#chanStartTime").val();
					var _endTime = $("#chanEndTime").val();
					
					if(!_startTime || !_endTime){
						com.showAlert(com.error, "请填写施工进度中必要信息!");
						return false;
					}
					
					if(_endTime < _startTime){
						com.showAlert(com.error, "完工时间必须大于开工时间!");
						return false;
					}
					
					options[operate.elementName+".startTime"] = _startTime;
					options[operate.elementName+".endTime"] = _endTime;
					
					com.post(api.construction.setChanConstructionScheduleForInfo, options, function(res){
						qualityTestingPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
						
						com.showAlert(com.info, "当前施工进度信息提交成功!");
					});
				});
			}else if(schedule == 2){
				$("#chan").css("display", "none");
				$("#putline").css("display", "block");
				$("#common").css("display", "none");
				
				$("#putlineTime").val(element.startTime);
				
				if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
					$("#fangWorkerEnter").css("display", "none");
					$("#fangWorkerInfo").css("display", "block");
					
					$("#fangWorkerImg").attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+element.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", element.workerId+"'s Photo");
					$("#fangWorkerNameSpan").html(element.workerOldId + "" + element.workerName + "<br/>" + element.workerDuty);
				}else{
					$("#fangWorkerEnter").css("display", "block");
					$("#fangWorkerInfo").css("display", "none");
					
					initChange("fangWorkerName", api.personel.queryUserForNameByDutyADept, api.personel.queryUserByUserId, {"duty":operate.duty});
					
					$("#fangWorkerSubmit").on("click", function(){
						console.log("fangWorkerSubmit");
						
						var options = {};
						options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
						options[operate.elementName+".orderId"] = orderId;
						options[operate.elementName+".workerId"] = qualityTestingDetail.workerUserId["#fangWorkerName"];
						
						if($("#fangWorkerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
							com.showAlert(com.error, "工人名称不能为空!");
							return false;
						}
						
						com.post(operate.setWorkerUrl, options, function(res){
							qualityTestingPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
							
							var workerInfo = res[operate.elementName];
							
							$("#fangWorkerEnter").css("display", "none");
							$("#fangWorkerInfo").css("display", "block");
							
							$("#fangWorkerImg").attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", workerInfo.workerId+"'s Photo");
							$("#fangWorkerNameSpan").html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty);
							
							com.showAlert(com.info, "工人信息提交成功!");
						});
						
						return false;
					});
				}
				
				$("#btnSubmit").click(function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					options[operate.elementName+".putlineTime"] = $("#putlineTime").val();
					options[operate.elementName+".status"] = "";
					
					if($("#putlineTime").val() == ""){
						com.showAlert(com.error, "放线时间需要填写,不能为空!");
						return false;
					}
					
					com.post(operate.setInfoUrl, options, function(res){
						qualityTestingPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
						com.showAlert(com.info, "设置成功!");
					});
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
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
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
				$("#chan").css("display", "none");
				$("#putline").css("display", "none");
				$("#common").css("display", "block");
				
				if(schedule == 3 || schedule == 8){
					initChange("workerName", api.personel.queryUserForNameByDutysAODept, api.personel.queryUserByUserId, {"dutysO[0]":operate.waterwayDuty, "dutysO[1]":operate.circuitDuty, "dutysO[2]":operate.powerDuty, "dutysO[3]":operate.waterwayCircuitDuty});
				}else{
					initChange("workerName", api.personel.queryUserForNameByDutyADept, api.personel.queryUserByUserId, {"duty":operate.duty});
				}
				
				$("#startTime").val(element.startTime);
				$("#endTime").val(element.endTime);
				
				if(element.startTimeFlag == 1){
					$("#startTime").attr("disabled", "disabled");
				}else{
					$("#startTime").removeAttr("disabled");
				}
				
				if(element.endTimeFlag == 1){
					$("#endTime").attr("disabled", "disabled");
				}else{
					$("#endTime").removeAttr("disabled");
				}
				
				var options = {};
				options[operate.elementName+".csId"] = qualityTestingPostData[operate.elementName+".csId"];
				options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
				
				com.post(operate.queryWorkerUrl, options, function(res){
					constructionScheduleWorkers = res.constructionScheduleWorkers;
					
					if(constructionScheduleWorkers.length != 0){
						for(var i=0;i<constructionScheduleWorkers.length;i++){
							
							var workerInfo = constructionScheduleWorkers[i];
							
							var profileDiv = $('<div class="profile-picture col-sm-2 text-center" style="margin: 4px;"></div>');
							var profileImg = $('<img id="workerImg" src="" alt="" class="editable img-responsive" style="height: 150px;"></img>').attr("alt", workerInfo["workerId"]+"'s Photo").appendTo(profileDiv);
							
							if(workerInfo.workerPhoto != null && workerInfo.workerPhoto != ""){
								profileImg.attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
							}
							
							var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
							var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty).appendTo(buttonsDiv);
							
							profileDiv.appendTo($("#workerInfos"));
						}
					}
				});
				
				$("#workerSubmit").on("click", function(){
					if($("#workerName_chosen span")[0].textContent.replace(/\s+/g, "") == ""){
						com.showAlert(com.error, "工人名称不能为空!");
						return false;
					}
					
					var args = {};
					args[operate.workerName+".csId"] = qualityTestingPostData[operate.elementName+".csId"];
					args[operate.workerName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
					args[operate.workerName+".orderId"] = qualityTestingPostData["constructionSchedule.orderId"];
					args[operate.workerName+".workerId"] = qualityTestingDetail.workerUserId["#workerName"];
					args[operate.workerName+".workerName"] = $("#workerName_chosen span")[0].textContent.split("-")[0];
					
					com.post(operate.addWorkerUrl, args, function(res){
						
						var workerInfo = res[operate.workerName];
						
						var profileDiv = $('<div class="profile-picture col-sm-2 text-center" style="margin: 4px;"></div>');
						var profileImg = $('<img src="" alt="" class="editable img-responsive" style="height: 150px;"></img>').attr("alt", workerInfo.workerId+"'s Photo").appendTo(profileDiv);
						
						if(workerInfo.workerPhoto != null && workerInfo.workerPhoto != ""){
							profileImg.attr("src", qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+workerInfo.workerPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
						}
						
						var buttonsDiv = $('<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons" style="padding: 5px;"></div>').appendTo(profileDiv);
						var buttonSpan = $('<span id="workerNameSpan" class="pull-right"></span>').html(workerInfo.workerOldId + "" + workerInfo.workerName + "<br/>" + workerInfo.workerDuty).appendTo(buttonsDiv);
						
						profileDiv.appendTo($("#workerInfos"));
					});
					
					return false;
				});
				
				$("#btnSubmit").click(function(){
					
					var options = {};
					options[operate.elementName+"."+operate.elementId] = qualityTestingPostData[operate.elementName+"."+operate.elementId];
					options[operate.elementName+".orderId"] = orderId;
					
					var _startTime = $("#startTime").val();
					var _endTime = $("#endTime").val();
					
					if(!_startTime || !_endTime){
						com.showAlert(com.error, "请填写施工进度中必要信息!");
						return false;
					}
					
					if(_endTime < _startTime){
						com.showAlert(com.error, "完工时间必须大于开工时间!");
						return false;
					}
					
					options[operate.elementName+".startTime"] = _startTime;
					options[operate.elementName+".endTime"] = _endTime;
					
					com.post(operate.setInfoUrl, options, function(res){
						qualityTestingPostData[operate.elementName+"."+operate.elementId] = res[operate.elementName][operate.elementId];
						com.showAlert(com.info, "当前施工进度信息提交成功!");
					});
				});
			}
			
			initUploadBtn(qualityTestingDetail.qualityGalleryId, qualityTestingDetail.qualityUpload, operate.drawingType, operate.drawingName, operate.elementId, element[operate.elementId], operate.addDrawingUrl, operate.deleteDrawingUrl, operate.drawingId);
			
			var options = {};
			options[operate.drawingName+".csId"] = qualityTestingDetail.construstionSchedule.csId;
			
			com.post(operate.queryDrawingUrl, options, function(res){
				var drawings = res[operate.drawings];
				for(var i=0;i<drawings.length;i++){
					
					var drawing = drawings[i];
					
					if(drawing.type == 0){
						imgAddUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
						imgUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&timestamp='+ new Date().getTime();
					}else{
						imgAddUrl = qualityTestingDetail.dmediaServer + drawing.drawingUrl + '_150x150.' + drawing.drawingUrl.split('.')[1] + '?timestamp='+ new Date().getTime();
						imgUrl = qualityTestingDetail.dmediaServer + drawing.drawingUrl + '?timestamp='+ new Date().getTime();
					}
					
					var imgAddUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
					var imgUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+drawing.drawingUrl+'&timestamp='+ new Date().getTime();
					
					options[operate.drawingName+"."+operate.drawingId] = drawing[operate.drawingId];
					
					appendGalleryElement(qualityTestingDetail.qualityGalleryId, drawing[operate.drawingId], imgUrl, imgAddUrl, "", operate.deleteDrawingUrl, options);
				}
			});
			
			return false;
			
		});
	});
	
	$('#btnBackInfo').on(ace.click_event, function(){
		com.switchPage(api.index.qualityTestingIndex.url);
	});
	
	$('#btnBackDrawing').on(ace.click_event, function(){
		com.switchPage(api.index.qualityTestingIndex.url);
	});
	
	$('[data-rel=popover]').popover({html:true});
	
	$('#drawing').removeClass("active");
	
	$('.date-picker').datepicker({autoclose:true});
});

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
	var putlineStatusDiv = $("#fangStatus").html("");
	
	if(fangStatus == 1){
		$("<span></span>").addClass("label label-success").text("成功").appendTo(putlineStatusDiv);
	}else if(fangStatus == 2){
		$("<span></span>").addClass("label label-danger").text("失败").appendTo(putlineStatusDiv);
	}else{
		$("<span></span>").addClass("label label-warning").text("等待").appendTo(putlineStatusDiv);
	}
}

function initUploadBtn(galleryId, btnId, uploadType, name, id, fId, addUrl, deleteUrl, drawingId){
	$("#"+btnId).Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':150, // 超时时间
        'formData':{ // 附带值
            'uploadType':uploadType,
            'username':'用户名',
            'rnd':'加密密文'
        },
        'buttonClass': 'btn btn-success',
        'buttonText': '上传',
        //'swf': "./js/uploadify/uploadify.swf", // flash

        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID':'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader':qualityTestingDetail.mediaServer + api.common.uploadImg.url, // 上传处理程序
        //'buttonImage':'upbutton.gif', // 浏览按钮的背景图片路径
        //'width':'100', // 浏览按钮的宽度
        'height':'45', // 浏览按钮的高度
        //'expressInstall':'expressInstall.swf', // expressInstall.swf文件的路径。
        'fileTypeDesc':'支持的格式：', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 25, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
        	//每次更新上载的文件的进展
            //有时候上传进度什么想自己个性化控制，可以利用这个方法
            //使用方法见官方说明
        }, 'onInit': function(uploadify){
        	
        }, 'onSelect' : function(file) { // 选择上传文件后调用
                  
        }, 'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#file_upload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#file_upload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            };
        },
		'onFallback':function(){ // 检测FLASH失败调用
			alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
		},
        'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
        	var dateObj=eval("("+data+")");
        	if(dateObj.errorCode==0){
				var options = {};
				options[name+"."+id] = fId;
				options[name+".csId"] = qualityTestingDetail.construstionSchedule.csId;
				options[name+".drawingName"] = "";
				options[name+".drawingUrl"] = dateObj.resUrl;
				options[name+".drawingAddUrl"] = "";
				
				var imgAddUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
				var imgUrl = qualityTestingDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&timestamp='+ new Date().getTime();
				
				com.post(addUrl, options, function(res){
					var drawing = res[name];
					var args = {};
					args[name+"."+drawingId] = res[name][drawingId];
					appendGalleryElement(galleryId, drawing[id], imgUrl, imgAddUrl, "", deleteUrl, args);
				});
			}else{
				console.log(data);
			}
        }
    });
}

function appendGalleryElement(galleryId, imgId, imgUrl, imgAddUrl, editUrl, deleteUrl, options){
	
	var gallery = $("#"+galleryId);
	var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
	var imgA = $("<a></a>").attr("href", imgUrl).attr("data-rel", "colorbox").css("height", "150px").appendTo(imgLi);
	$("<img></img>").attr("src", imgAddUrl).attr("alt", "暂无照片").appendTo(imgA);
	var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
	var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
		com.post(deleteUrl, options, function(res){
			$("#gallery_li"+imgId).remove();
		});
	}).appendTo(toolsDiv);
	$("<i></i>").addClass("icon-remove red").appendTo(toolsA);
};

function initChange(id, queryElementsUrl, queryElementUrl, options){
	
	id = "#" + id;
	var imgId = id + "Img";
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true
	});
	
	$(id).on("change", function(){
		var args = {};
		args["user.userId"] = $(id).val();
		qualityTestingDetail.workerUserId[id] = $(id).val();
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
}
