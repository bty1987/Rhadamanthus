
jQuery(function($) {

	var gcsId;

	//从服务器查询出来的所有工人
	var constructionScheduleWorkers;

	//var saveBtn = $("#saveBtn").on("click", saveData);

	var supervisionDetail = {

		construstion: {},

		controlCondition: false,

		schedule: 0,

		constructionSchedule:"constructionSchedule",

		operateDict: {
			"1": {
				num: 1,
				Gallery:"chanGallery",
				uploadId: "chanUpload",
				tabbable: "chanDrawing",
				navTabbable:"chanNavTab",

				workerId: "chanWorker",
				startTimeId: "chanStartTime",
				endTimeId: "chanEndTime",
				statusId: "status",
				workerInfos: "chanWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",
				status: "status",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmEndTimeUrl: "",

				drawings: "chanDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "putlineConstructionSchedule",

				duty: "铲大白工人",

				drawingType: 6,

				errorMsg: "开工时间或者完工时间没有进行确认或者当前铲大白状态没有成功!",
			}, "2": {
				num: 2,
				Gallery:"putlineGallery",
				uploadId: "putlineUpload",
				tabbable: "putlineDrawing",
				navTabbable:"putlineNavTab",

				workerId: "putlineWorker",
				startTimeId: "putlineStartTime",
				endTimeId: "putlineEndTime",
				putlineTimeId: "putlineTime",
				putlineStatusId: "putlineStatus",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",
				putlineTime: "putlineTime",
				putlineStatus: "putlineStatus",
				workerInfos: "fangWorkerInfos",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				drawings: "putlineDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "waterwayCircuitPowerConstructionSchedule",

				duty: "放线小组",

				drawingType: 7,

				errorMsg: "放线状态不满足进行下个阶段要求!",
			}, "3": {
				num: 3,
				Gallery: "waterwayCircuitPowerGallery",
				name: "waterwayCircuitPower",
				uploadId: "waterwayCircuitPowerUpload",
				tabbable: "waterwayCircuitPowerDrawing",
				navTabbable:"waterwayCircuitPowerNavTab",

				waterwayWorkerId: "waterwayWorker",
				circuitWorkerId: "circuitWorker",
				powerWorkerId: "powerWorker",
				startTimeId: "waterwayCircuitPowerStartTime",
				endTimeId: "waterwayCircuitPowerEndTime",
				workerInfos: "waterwayCircuitPowerWorkerInfos",

				waterwayWorker: "waterwayWorkerId",
				circuitWorker: "circuitWorkerId",
				powerWorker: "powerWorkerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

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
				num: 4,
				Gallery: "bricklayGallery",
				name: "bricklay",
				uploadId: "bricklayUpload",
				tabbable: "bricklayDrawing",
				navTabbable:"bricklayNavTab",

				workerId: "bricklayWorker",
				startTimeId: "bricklayStartTime",
				endTimeId: "bricklayEndTime",
				workerInfos: "bricklayWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				drawings: "bricklayDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "groundLevelingConstructionSchedule",

				duty: "瓦工",

				drawingType: 9,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "5": {
				num: 5,
				Gallery : "groundLevelingGallery",
				name: "groundLeveling",
				uploadId: "groundLevelingUpload",
				tabbable: "groundLevelingDrawing",
				navTabbable:"groundLevelingNavTab",

				workerId: "groundLevelingWorker",
				startTimeId: "groundLevelingStartTime",
				endTimeId: "groundLevelingEndTime",
				workerInfos: "groundLevelingWorkerInfos",

				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				drawings: "groundLevelingDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "carpentConstructionSchedule",

				duty: "地面找平",

				drawingType: 10,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "6": {
				num: 6,
				Gallery: "carpentGallery",
				uploadId: "carpentUpload",
				tabbable: "carpentDrawing",
				navTabbable:"carpentNavTab",

				workerId: "carpentWorker",
				startTimeId: "carpentStartTime",
				endTimeId: "carpentEndTime",
				workerInfos: "carpentWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				drawings: "carpentDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "oilConstructionSchedule",

				duty: "木工",

				drawingType: 11,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "7": {
				num: 7,
				Gallery: "oilGallery",
				uploadId: "oilUpload",
				tabbable: "oilDrawing",
				navTabbable:"oilNavTab",

				workerId: "oilWorker",
				startTimeId: "oilStartTime",
				endTimeId: "oilEndTime",
				workerInfos: "oilWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

				drawings: "oilDrawings",
				elementConstructerId: "cid",
				elementConstructerName: "constructer",
				elementConstructers: "constructers",

				nextElementName: "waterwayCircuitCheckConstructionSchedule",

				duty: "油工",

				drawingType: 12,

				errorMsg: "开工时间或者完工时间没有进行确认!",
			}, "8": {
				num: 8,
				Gallery: "waterwayCircuitCheckGallery",
				name: "waterwayCircuitCheck",
				uploadId: "waterwayCircuitCheckUpload",
				tabbable: "waterwayCircuitCheckDrawing",
				navTabbable:"waterwayCircuitCheckNavTab",

				waterwayWorkerId: "waterwayWorker",
				circuitWorkerId: "circuitWorker",
				powerWorkerId: "powerWorker",
				startTimeId: "waterwayCircuitCheckStartTime",
				endTimeId: "waterwayCircuitCheckEndTime",
				workerInfos: "waterwayCircuitCheckWorkerInfos",

				waterwayWorker: "waterwayWorkerId",
				circuitWorker: "circuitWorkerId",
				powerWorker: "powerWorkerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",

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
				num: 9,
				Gallery: "cleaningGallery",
				uploadId: "cleaningUpload",
				tabbable: "cleaningDrawing",
				navTabbable:"cleaningNavTab",

				workerId: "cleaningWorker",
				startTimeId: "cleaningStartTime",
				endTimeId: "cleaningEndTime",
				workerInfos: "cleaningWorkerInfos",

				worker: "workerId",
				startTime: "startTime",
				endTime: "endTime",
				schedule: "schedule",

				queryInfoUrl: api.construction.queryConstructionScheduleByOrderId,
				queryWorkerUrl: api.construction.queryConstructerByOrderId,
				confirmStartTimeUrl: "",
				confirmEndTimeUrl: "",


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

	com.post(api.construction.queryConstructionByOrderId, {
		"construction.orderId": params.orderId
	}, function(res){

		supervisionDetail.construstion = res.construction;

		var schedule = res.construction.schedule;
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

						options["construction.orderId"] = params.orderId;
						options["construction."+operate.schedule] = step;
						options["construction.cid"] = res.construction["cid"];

						com.post(api.construction.nextConstructionByOrderId, options, function(res){
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
		elementPostData["constructionSchedule.orderId"] = params.orderId;
		supervisionDetail.controlCondition = false;
		var workerInfoCondition = false;

		com.post(operate.queryInfoUrl, elementPostData, function(res){

			var elements = res.constructionSchedules;
			var element = [];
			var eleSch = [];
			var numi;
			var ifFlag = false;

			$.each(elements, function(i, v){
				element.push(v);
			});

			$.each(element, function(i, v){
				eleSch.push(v.schedule);
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

			if(ifFlag && element[numi].cid != 0){

				supervisionDetail["constructionSchedule.csId"] = element[numi].csId;

				if(schedule == 1){

					var workerLength = 0;
					$("#"+operate.startTimeId).val(element[numi].startTime);
					$("#"+operate.endTimeId).val(element[numi].endTime);

					var statusDiv = $("#"+operate.status).html("");
					if(element[numi].status == 1){
						$("<span></span>").addClass("label label-success").text("成功").appendTo(statusDiv);
					}else if(element[numi].status == 2){
						$("<span></span>").addClass("label label-danger").text("失败").appendTo(statusDiv);
					}else if(element[numi].status == 3){
						$("<span></span>").addClass("label label-warning").text("延迟").appendTo(statusDiv);
					}else if(element[numi].status == 4){
						$("<span></span>").addClass("label label-info").text("通过").appendTo(statusDiv);
					}else{
						$("<span></span>").addClass("label").text("待处理").appendTo(statusDiv);
					}

					var options = {};
					options[operate.elementConstructerName + ".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;
					com.post(operate.queryWorkerUrl,options, function(res){
						workerInfoCondition = queryConstructer(operate, res);

						if(workerInfoCondition){

							if(element[numi].status != undefined && (element[numi].status == 0 || element[numi].status == 2)){
								supervisionDetail.controlCondition = false;
							}else if(element[numi].status != undefined && element[numi].status == 1){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
							}
						}else if(!workerInfoCondition){
							if(element[numi].status != undefined && element[numi].status == 4){
								supervisionDetail.controlCondition = true;
							}
						}
					});

					if(workerInfoCondition){
						if(element[numi].status != undefined && (element[numi].status == 0 || element[numi].status == 2)){
							supervisionDetail.controlCondition = false;
						}else if(element[numi].status != undefined && element[numi].status == 1){
							supervisionDetail.controlCondition = true;
						}else{
							supervisionDetail.controlCondition = true;
						}
					}else if(!workerInfoCondition){
						if(element[numi].status != undefined && element[numi].status == 4){
							supervisionDetail.controlCondition = true;
						}
					}
				}else if(schedule == 2){

					$("#"+operate.putlineTimeId).val(element[numi].startTime).attr("disabled", "disabled");

					var putlineStatusDiv = $("#"+operate.putlineStatusId).html("");

					var options = {};
					options[operate.elementConstructerName+".orderId"] = params.orderId;
					options[operate.elementConstructerName + ".schedule"] = schedule;

					//查询施工人员
					com.post(operate.queryWorkerUrl, options, function(res){
						workerInfoCondition = queryConstructer(operate, res);
					}, null, false);

					if(element[numi].status == 1){
						if(workerInfoCondition){
							supervisionDetail.controlCondition = true;
						}
						$("<span></span>").addClass("label label-success").text("成功").appendTo(putlineStatusDiv);
					}else if(element[numi].status == 2){
						$("<span></span>").addClass("label label-danger").text("失败").appendTo(putlineStatusDiv);
					}else{
						$("<span></span>").addClass("label label-warning").text("等待").appendTo(putlineStatusDiv);
					}
				}else{
					//这里是3-9
					if(schedule == element[numi].schedule){
						$("#"+operate.startTimeId).val(element[numi].startTime);
						$("#"+operate.endTimeId).val(element[numi].endTime);

						var options = {};
						options[operate.elementConstructerName+".orderId"] = params.orderId;
						options[operate.elementConstructerName + ".schedule"] = schedule;

						//查询施工人员
						com.post(operate.queryWorkerUrl, options, function(res){
							workerInfoCondition = queryConstructer(operate, res);
						}, null, false);

						if(workerInfoCondition){
							if(element[numi].status != undefined && (element[numi].status == 0 || element[numi].status == 2)){
								supervisionDetail.controlCondition = false;
							}else if(element[numi].status != undefined && element[numi].status == 1){
								supervisionDetail.controlCondition = true;
							}else{
								supervisionDetail.controlCondition = true;
							}
						}
					}
				}//这里是3-9结束

				var options = {};
				options["constructionDrawing.cid"] = supervisionDetail.construstion.cid;

				com.post(api.construction.queryConstructionDrawing, options, function(res){
					var drawings = res.constructionDrawings;
					$("#" + operate.Gallery).html("");

					for(var i=0;i<drawings.length;i++){
						var drawing = drawings[i];

						options["constructionDrawing.cdId"] = drawing.cdId;

						if(drawing.schedule == operate.num ){
							appendGalleryElement(operate.Gallery, drawing.cdId, drawing.drawingUrl, drawing.type, "", api.construction.deleteConstructionDrawing);
						}
					}
				});
				initUploadBtn(operate,element, operate.num);
				$('#'+operate.tabbable).removeClass("active");

				if($('#'+operate.navTabbable+' li:last-of-type').hasClass("active")){
					$('#'+operate.tabbable).addClass("active");
				}
				return false;
			}else{
				supervisionDetail["construction.cid"] = 0;
			}
		});
	}

	function initUploadBtn(operate, ele, eleschedule){

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

					options["constructionDrawing.cdId"] = 0;
					options["constructionDrawing.cid"] = supervisionDetail.construstion.cid;
					options["constructionDrawing.drawingName"] = "";
					options["constructionDrawing.drawingUrl"] = dateObj.resUrl;
					options["constructionDrawing.drawingAddUrl"] = "";
					options["constructionDrawing.schedule"] = eleschedule;

					com.post(api.construction.addConstructionDrawing, options, function(res){
						var drawing = res.constructionDrawing;
							appendGalleryElement(operate.Gallery, drawing.cdId, dateObj.resUrl, 0, "", api.construction.deleteConstructionDrawing);
					});
				}else{
					console.log(data);
				}
			}
		});
	}

	function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl){

		var gallery = $("#"+galleryId);
		var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
		var img = $('<img />');
		var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(imgLi);
		var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
		var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
			var options = {};
			options["constructionDrawing.cdId"] = imgId;

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
			"workerSalary.cid": workerInfo.cid,
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
				var buttonPeople = $('<div id="workerNameSpan" style="float: right"></div>').html(workerInfo.user.userId + "" + workerInfo.user.userName + "<br/>" + workerInfo.user.duty).appendTo(buttonsDiv);

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
				var vsubtype, vstatus;
				switch(v.subtype)
				{
					case 1:
						vsubtype = "工费"
						break;
					case 2:
						vsubtype = "增项"
						break;
					case 3:
						vsubtype = "油工一级奖励"
						break;
					case 4:
						vsubtype = "维修款"
						break;
					case 5:
						vsubtype = "罚款"
						break;
					case 6:
						vsubtype = "工程质保金"
						break;
					case 7:
						vsubtype = "工具押金"
						break;
					case 8:
						vsubtype = "借款"
						break;
					case 9:
						vsubtype = "工人家属保险"
						break;
				}

				switch(v.status)
				{
					case 0:
						vstatus = "初始"
						break;
					case 1:
						vstatus = "通过"
						break;
					default:
						vstatus = "拒绝"
				}

				var workerSalary = $('<div></div>').prop("id","salary" + i);
				workerSalary.append(addspan('10', '姓名  : ', v.user.userName))
					.append(addspan('40', '创建时间  : ', v.createTime))
					.append(addspan('40', '薪资  : ', v.salary))
					.append(addspan('40','类型  : ', vsubtype))
					.append(addspan('40','状态  : ', vstatus))
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

			var salaryDiv = $('<div></div>').addClass("form-group").css("height","50px").css("margin-bottom","0px");
			var salaryDivT = $('<div></div>').addClass("col-sm-9").css("width", "550px").appendTo(salaryDiv);
			var salaryLabelT = $('<label><b>添加工费</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for","form-field-1").attr("for","salary").appendTo(salaryDivT);
			var salaryInputT = $('<input />').addClass("col-xs-10 col-sm-9").attr("id","salary").attr("data-toggle","popover").attr("data-trigger","manual").css("width", "320px").css("height", "30px").appendTo(salaryDivT);
			var salaryText = $('<span><b>* 扣款项请输入负数，如：-123 !!!</b></span>').css("color","red").css("margin-left","-50px").appendTo(salaryDiv);

			var salaryDiv3 = $('<div></div>').addClass("form-group").css("height","50px").css("margin-bottom","0px");
			var salaryDivTh = $('<div></div>').addClass("col-sm-9").css("width", "550px").appendTo(salaryDiv3);
			var salaryType = $('<label><b>类型</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for","form-field-1").attr("for","salaryType").appendTo(salaryDivTh);
			var $item = $('<span></span>').addClass('inline').appendTo(salaryDivTh);
			var salaryTypeS = $('<select></select>').attr("id","salaryType").css("width","320px").css("height", "30px").append('<option value="0">请选择类型...</option>').appendTo($item);

			com.post(api.ds.salaryType, {}, function(data){
				var constructerSalaryType = data.SalaryType;
				if(constructerSalaryType && constructerSalaryType.length){
					$.each(constructerSalaryType,function(i,v){
						$('<option></option>').attr("value" , v.key).html(v.name).appendTo(salaryTypeS);
					})
				}
			}, null, false);

			var salaryDiv4 = $('<div></div>').addClass("form-group").css("height","80px");
			var salaryDivF = $('<div></div>').addClass("col-sm-9").css("width", "550px").appendTo(salaryDiv4);
			var salaryBz = $('<label><b>备注</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for","form-field-1").attr("for","comment").appendTo(salaryDivF);
			var salaryBzInp = $('<textarea></textarea>').attr("id","comment").css("width","320px").appendTo(salaryDivF);

			var salaryDivFi = $('<div></div>').addClass("col-sm-9").css("width","850px").css("padding-top","20px").css("text-align","center").css("height","50px").appendTo(salaryDiv4);
			var salaryBtn = $('<button><b>保存</b></button>').addClass("btn btn-sm  btn-primary").attr("id","saveBtn").appendTo(salaryDivFi)
				.click(function(){
					saveData(options)
				});
			salaryDiv.appendTo($("#workerSalaryList"));
			salaryDiv3.appendTo($("#workerSalaryList"));
			salaryDiv4.appendTo($("#workerSalaryList"));
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
		}else if($("#salaryType").val() == 0){
			com.showAlert(com.error,"请选择工费类型！");
		}else{
			if(/^-?(([1-9]\d{0,6})|(([1-9]\d{0,6}\.\d{1,3})|(0\.[1-9]{1,3})))$/.test($('#salary').val()) ){
				if($("#salaryType").val() == 1 || $("#salaryType").val() == 2 || $("#salaryType").val() == 3 ){
					options["workerSalary.type"] = 0;
				}else if($("#salaryType").val() == 4 && $('#salary').val() > 0){
					options["workerSalary.type"] = 0;
				}else{
					options["workerSalary.type"] = 1;
				}
				options["workerSalary.salary"] = $('#salary').val();
				options["workerSalary.subtype"] = $("#salaryType").val();
				options["workerSalary.comment"] = $("#comment").val();
				com.post(url,options);
				$('#guaranteeModal').modal('hide');
			}else{
				com.showAlert(com.error,"请正确输入工人工费，小数点后最多保留3位！");
			}
		}
	}
});