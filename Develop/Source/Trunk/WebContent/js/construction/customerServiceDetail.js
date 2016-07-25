var customerServiceDetail = {
	
	construstionSchedule: {},
	
	stepLimit: 0,
	
	errorMsg: "进度控制",
	
	operateDict: {
		"1": {
			workerId: "chanWorker",
			workerRatyId: "chanWorkerRaty",
			workerDesId: "chanWorkerDes",
			
			worker: "workerId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryChanConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updateChanConstructionSchedule,
			
			elementId: "ccsId",
			elementName: "chanConstructionSchedule",
			
			duty: "铲大白工人",
		}, "2": {
			workerId: "putlineWorker",
			workerRatyId: "putlineWorkerRaty",
			workerDesId: "putlineWorkerDes",
			
			worker: "workerId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryPutlineConstructionScheduleByOrderId,
			updateInfoUrl: api.construction.updatePutlineConstructionSchedule,
			
			elementId: "plcsId",
			elementName: "putlineConstructionSchedule",
			
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
			powerWorkerRatyId: "powerWorkerRaty",
			powerWorkerRatyDesId: "powerWorkerRatyDes",
			
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
			
			queryInfoUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryWaterwayCircuitPowerConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitPowerConstructionSchedule,
			setWrokerRaty: api.construction.setWaterwayCircuitPowerConstructionScheduleWorkerForSalary,
			
			elementId: "wcpcsId",
			elementName: "waterwayCircuitPowerConstructionSchedule",
			
			waterwayDuty: "水暖工",
			circuitDuty:"电工",
			powerDuty:"力工",
		}, "4": {
			workerInfos: "bricklayWorkerInfos",
			
			workerId: "bricklayWorker",
			workerRatyId: "bricklayWorkerRaty",
			workerDesId: "bricklayWorkerDes",
			
			worker: "bcswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryBricklayConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryBricklayConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateBricklayConstructionSchedule,
			setWrokerRaty: api.construction.setBricklayConstructionScheduleWorkerForRaty,
			
			elementId: "bcsId",
			elementName: "bricklayConstructionSchedule",
			
			duty: "瓦工",
		}, "5": {
			workerInfos: "groundLevelingWorkerInfos",
			
			workerId: "groundLevelingWorker",
			workerRatyId: "groundLevelingWorkerRaty",
			workerDesId: "groundLevelingWorkerDes",
			
			worker: "glcswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryGroundLevelingConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryGroundLevelingConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateGroundLevelingConstructionSchedule,
			setWrokerRaty: api.construction.setGroundLevelingConstructionScheduleWorkerForRaty,
			
			elementId: "glcsId",
			elementName: "groundLevelingConstructionSchedule",
			
			duty: "地面找平",
		}, "6": {
			workerInfos: "carpentWorkerInfos",
			
			workerId: "carpentWorker",
			workerRatyId: "carpentWorkerRaty",
			workerDesId: "carpentWorkerDes",
			
			worker: "ccswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryCarpentConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryCarpentConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCarpentConstructionSchedule,
			setWrokerRaty: api.construction.setCarpentConstructionScheduleWorkerForRaty,
			
			elementId: "ccsId",
			elementName: "carpentConstructionSchedule",
			
			duty: "木工",
		}, "7": {
			workerInfos: "oilWorkerInfos",
			
			workerId: "oilWorker",
			workerRatyId: "oilWorkerRaty",
			workerDesId: "oilWorkerDes",
			
			worker: "ocswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryOilConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryOilConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateOilConstructionSchedule,
			setWrokerRaty: api.construction.setOilConstructionScheduleWorkerForRaty,
			
			elementId: "ocsId",
			elementName: "oilConstructionSchedule",
			
			duty: "油工",
		}, "8": {
			workerInfos: "waterwayCircuitCheckWorkerInfos",
			
			workerId: "waterwayCircuitCheckWorker",
			workerRatyId: "waterwayCircuitCheckWorkerRaty",
			workerDesId: "waterwayCircuitCheckWorkerDes",
			
			worker: "wcccswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryWaterwayCircuitCheckConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateWaterwayCircuitCheckConstructionSchedule,
			setWrokerRaty: api.construction.setWaterwayCircuitCheckConstructionScheduleWorkerForRaty,
			
			elementId: "wcccsId",
			elementName: "waterwayCircuitCheckConstructionSchedule",
			
			waterwayDuty: "水暖工",
			circuitDuty:"电工",
			powerDuty:"力工",
		}, "9": {
			workerInfos: "cleaningWorkerInfos",
			
			workerId: "cleaningWorker",
			workerRatyId: "cleaningWorkerRaty",
			workerDesId: "cleaningWorkerDes",
			
			worker: "ccswId",
			workerRaty: "workerRaty",
			workerDes: "workerRatyDes",
			
			queryInfoUrl: api.construction.queryCleaningConstructionScheduleByOrderId,
			queryWorkerUrl: api.construction.queryCleaningConstructionScheduleWorker,
			updateInfoUrl: api.construction.updateCleaningConstructionSchedule,
			setWrokerRaty: api.construction.setCleaningConstructionScheduleWorkerForRaty,
			
			elementId: "ccsId",
			elementName: "cleaningConstructionSchedule",
			
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

commitFlag = false;

workerIdsData = [];

jQuery(function($) {
	
	var orderId = customerServicePostData["constructionSchedule.orderId"];
	
	com.post(api.construction.queryConstructionScheduleByOrderId, customerServicePostData, function(res){
		
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
			
			if(!customerServiceDetail.wizardSept[step.toString() ]){
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
			if(!customerServiceDetail.wizardSept[info.step]){
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

});


function initWizardSept(operate, schedule){
	
	var elementPostData = {};
	elementPostData[operate.elementName+".orderId"] = customerServicePostData["constructionSchedule.orderId"];
	
	com.post(operate.queryInfoUrl, elementPostData, function(res){
		var element = res[operate.elementName];
		
		workerIdsData = [];
		commitFlag = false;
		
		$("#btnSave").unbind("click");
		
		customerServicePostData[operate.elementName+"."+operate.elementId] = element[operate.elementId];
		
		if(schedule == 1){
			if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
				com.post(api.personel.queryUserByUserId, {"user.userId": element.workerId}, function(res){
					if(res.user){
						$("#chanWorkerImg").attr("src", config.media + api.common.showImg.url + '?imgBasePath='+res.user.userPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", res.user.userId+"'s Photo");
						$("#chanWorkerNameSpan").text(res.user.userName);
						
						setWorkerRaty('#chanWorkerRaty', element.workerRaty);
						setWorkerDes("#chanWorkerDes", element[operate.workerDes]);
						
						commitFlag = true;
					}else{
						$("#chanWorkerImg").attr("src", "").attr("alt", res.user.userId+"'s Photo");
					}
				}, null, false);
			}else{
				var chanWorkerInfo = $("#chanWorkerInfo").html("").removeClass("");
				$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(chanWorkerInfo);
			}
			
			$("#btnSave").click(function(){
				
				var options = {};
				options[operate.elementName+".orderId"] = customerServicePostData["constructionSchedule.orderId"];
				options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
				
				options[operate.elementName+"."+operate.workerRaty] = $("#"+operate.workerRatyId+"-score").attr("value");
				options[operate.elementName+"."+operate.workerDes] = $("#"+operate.workerDesId).val();
				
				if(commitFlag){
					com.post(api.construction.setChanConstructionScheduleForService, options, function(res){
						com.showAlert(com.info, "保存成功!");
					});
				}
			});
		}else if(schedule == 2){
			if(element.workerId != "" && element.workerId != null && element.workerId != undefined){
				com.post(api.personel.queryUserByUserId, {"user.userId": element.workerId}, function(res){
					if(res.user){
						$("#putlineWorkerImg").attr("src", config.media + api.common.showImg.url + '?imgBasePath='+res.user.userPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime()).attr("alt", res.user.userId+"'s Photo");
						$("#putlineWorkerNameSpan").text(res.user.userName);
						
						setWorkerRaty('#putlineWorkerRaty', element.workerRaty);
						setWorkerDes("#putlineWorkerDes", element[operate.workerDes]);
						
						commitFlag = true;
					}else{
						$("#putlineWorkerImg").attr("src", "").attr("alt", res.user.userId+"'s Photo");
					}
				}, null, false);
			}else{
				var chanWorkerInfo = $("#putlineWorkerInfo").html("").removeClass("");
				$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo(chanWorkerInfo);
			}
			
			$("#btnSave").click(function(){
				
				var options = {};
				options[operate.elementName+".orderId"] = customerServicePostData["constructionSchedule.orderId"];
				options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
				
				options[operate.elementName+"."+operate.workerRaty] = $("#"+operate.workerRatyId+"-score").attr("value");
				options[operate.elementName+"."+operate.workerDes] = $("#"+operate.workerDesId).val();
				
				if(commitFlag){
					com.post(api.construction.setPutlineConstructionScheduleForService, options, function(res){
						com.showAlert(com.info, "保存成功!");
					});
				}
			});
		}else{
			var options = {};
			options[operate.elementName+".csId"] = element["csId"];
			options[operate.elementName+"."+operate.elementId] = element[operate.elementId];
			
			com.post(operate.queryWorkerUrl, options, function(res){
				constructionScheduleWorkers = res.constructionScheduleWorkers;
				
				$("#"+operate.workerInfos).html("");
				
				if(constructionScheduleWorkers.length != 0){
					for(var i=0;i<constructionScheduleWorkers.length;i++){
						
						var profileDiv = $('<div class="profile-picture col-sm-4" style="padding: 5px;"></div>');
						
						var imgDiv = $('<div class="col-sm-6"></div>').appendTo(profileDiv);
						var img = $('<img class="editable img-responsive" style="height: 150px">').attr("alt", constructionScheduleWorkers[i]["workerId"]+"'s photo").attr("id", constructionScheduleWorkers[i][operate.worker]+"WorkerImg").appendTo(imgDiv);
						
						if(constructionScheduleWorkers[i]["workerPhoto"] != null && constructionScheduleWorkers[i]["workerPhoto"] != ""){
							img.attr("src", config.media + api.common.showImg.url + '?imgBasePath='+constructionScheduleWorkers[i]["workerPhoto"]+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
						}
						
						var horizontalDiv = $('<div class="form-horizontal col-sm-6">').appendTo(profileDiv);
						var workerNameGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerNameSpan = $('<span id="workerNameSpan"></span>').text(constructionScheduleWorkers[i]["workerName"]).appendTo(workerNameGroupDiv);
						
						var workerRatyGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerRatyDiv = $('<div></div>').attr("id", constructionScheduleWorkers[i][operate.worker]+operate.workerId+"workerRaty").appendTo(workerRatyGroupDiv);
						
						var workerDesGroupDiv = $('<div class="form-group">').appendTo(horizontalDiv);
						var workerDesTextarea = $('<textarea rows="3"></textarea>').attr("id", constructionScheduleWorkers[i][operate.worker]+operate.workerId+"workerRatyDes").val(constructionScheduleWorkers[i]["workerRatyDes"]).appendTo(workerDesGroupDiv);
						
						profileDiv.appendTo($("#"+operate.workerInfos));
						
						setWorkerRaty('#'+constructionScheduleWorkers[i][operate.worker]+operate.workerId+"workerRaty", constructionScheduleWorkers[i]["workerRaty"]);
						setWorkerDes("#"+constructionScheduleWorkers[i][operate.worker]+operate.workerId+"workerRatyDes", constructionScheduleWorkers[i]["workerRatyDes"]);
						
						workerIdsData.push(constructionScheduleWorkers[i][operate.worker]);
					}
					
					commitFlag = true;
				}else{
					$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#"+operate.workerInfos));
				}
				
			}, null, false);
			
			$("#btnSave").click(function(){
				
				var options = {};
				
				for(var i=0;i<workerIdsData.length;i++){
					options["constructionScheduleWorkers["+i+"]."+operate.worker] = workerIdsData[i];
					options["constructionScheduleWorkers["+i+"].workerRaty"] = $("#"+workerIdsData[i]+operate.workerId+"workerRaty-score").attr("value");
					options["constructionScheduleWorkers["+i+"].workerRatyDes"] = $("#"+workerIdsData[i]+operate.workerId+"workerRatyDes").val();
				}
				
				if(commitFlag){
					com.post(operate.setWrokerRaty, options, function(res){
						com.showAlert(com.info, "保存成功!");
					});
				}
			});
		}
		
		return false;

		if(element[operate.elementId] == 0){
			customerServicePostData[operate.elementName+"."+operate.elementId] = 0;
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
