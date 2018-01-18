jQuery(function($) {
	
	var buildingSchedules = {};
	var buildingNodeName = {};
	var sd = {};
	
	$('#btnSave').addClass("hide");		
	if(params.type == 0){
		
		buildingNodeName = {
			"1": {
				name:"payment",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			}	
		};
	}else if(params.type == 1){
		buildingNodeName = {
			"1": {
				name:"contractExamine",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"financialAudit",
				flag: false,
				drawingType: 9,
			}, "3": {
				name:"consultFiles",
				flag: false,
				drawingType: 9,
			}, "4": {
				name:"tax",
				flag: false,
				drawingType: 9,
			}, "5": {
				name:"payTaxes",
				flag: false,
				drawingType: 9,
			}, "6": {
				name:"changeHouseCard",
				flag: false,
				drawingType: 9,
			}, "7": {
				name:"capitalSupervision",
				flag: false,
				drawingType: 9,
			}, "8": {
				name:"realCard",
				flag: true,
				drawingType: 9,
			}, "9": {
				name:"loan",
				flag: false,
				drawingType: 9,
			}, "10": {
				name:"transactionStatement",
				flag: false,
				drawingType: 9,
			}, "11": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			},
		}
	}else if(params.type == 2){
		buildingNodeName = {
			"1": {
				name:"contractExamine",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"interview",
				flag: true,
				drawingType: 9,
			}, "3": {
				name:"reportedVolume",
				flag: true,
				drawingType: 9,
			}, "4": {
				name:"grantLoan",
				flag: false,
				drawingType: 9,
			}, "5": {
				name:"financialAudit",
				flag: false,
				drawingType: 9,
			}, "6": {
				name:"consultFiles",
				flag: false,
				drawingType: 9,
			}, "7": {
				name:"tax",
				flag: false,
				drawingType: 9,
			}, "8": {
				name:"payTaxes",
				flag: false,
				drawingType: 9,
			}, "9": {
				name:"changeHouseCard",
				flag: false,
				drawingType: 9,
			}, "10": {
				name:"capitalSupervision",
				flag: false,
				drawingType: 9,
			}, "11": {
				name:"realCard",
				flag: true,
				drawingType: 9,
			}, "12": {
				name:"loan",
				flag: false,
				drawingType: 9,
			}, "13": {
				name:"transactionStatement",
				flag: false,
				drawingType: 9,
			}, "14": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			},
		}
	}else if(params.type == 3){
		buildingNodeName = {
			"1": {
				name:"contractExamine",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"financialAudit",
				flag: false,
				drawingType: 9,
			}, "3": {
				name:"consultFiles",
				flag: false,
				drawingType: 9,
			}, "4": {
				name:"tax",
				flag: false,
				drawingType: 9,
			}, "5": {
				name:"payTaxes",
				flag: false,
				drawingType: 9,
			}, "6": {
				name:"changeHouseCard",
				flag: false,
				drawingType: 9,
			}, "7": {
				name:"capitalSupervision",
				flag: false,
				drawingType: 9,
			}, "8": {
				name:"realCard",
				flag: true,
				drawingType: 9,
			}, "9": {
				name:"applicationProvident",
				flag: true,
				drawingType: 9,
			}, "10": {
				name:"mortgage",
				flag: true,
				drawingType: 9,
			}, "11": {
				name:"loan",
				flag: false,
				drawingType: 9,
			}, "12": {
				name:"transactionStatement",
				flag: false,
				drawingType: 9,
			}, "13": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			},
		}	
	}else if(params.type == 4){
		buildingNodeName = {
			"1": {
				name:"contractExamine",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"interview",
				flag: true,
				drawingType: 9,
			}, "3": {
				name:"reportedVolume",
				flag: true,
				drawingType: 9,
			}, "4": {
				name:"grantLoan",
				flag: false,
				drawingType: 9,
			}, "5": {
				name:"financialAudit",
				flag: false,
				drawingType: 9,
			}, "6": {
				name:"consultFiles",
				flag: false,
				drawingType: 9,
			}, "7": {
				name:"tax",
				flag: false,
				drawingType: 9,
			}, "8": {
				name:"payTaxes",
				flag: false,
				drawingType: 9,
			}, "9": {
				name:"changeHouseCard",
				flag: false,
				drawingType: 9,
			}, "10": {
				name:"capitalSupervision",
				flag: false,
				drawingType: 9,
			}, "11": {
				name:"realCard",
				flag: true,
				drawingType: 9,
			}, "12": {
				name:"loan",
				flag: false,
				drawingType: 9,
			}, "13": {
				name:"transactionStatement",
				flag: false,
				drawingType: 9,
			}, "14": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			},
		}
	}else if(params.type == 5){
		buildingNodeName = {
			"1": {
				name:"financialAudit",
				flag: false,
				drawingType: 9,
			}, "2": {
				name:"houseHandover",
				flag: false,
				drawingType: 9,
			}, "3": {
				name:"transactionStatement",
				flag: false,
				drawingType: 9,
			}, "4": {
				name:"financialSettlement",
				flag: false,
				drawingType: 9,
			},
		}	
	}else{
		com.showAlert(com.warning, "无此付款类型!!!");
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
		};
	
	according();
	
	function bNodeLength(obj){
	    var count = 0;
	    for(var i in obj){
	        if(obj.hasOwnProperty(i)){
	            count++;
	        };
	    };
	    return count;   
	};
	
	if(buildingSchedules.length != 0){
		
		var stepnum = buildingSchedules[buildingSchedules.length-1].buildingNode.sore;
		
		initWizardSept(buildingNodeName[stepnum], stepnum);
		
	}
	
	if(buildingSchedules.length == bNodeLength(buildingNodeName)){
		
		$('#btnNext').addClass("hide");
		
	};
	
	$('#btnNext').on("click", function(){
		
		var currentNum = buildingSchedules[buildingSchedules.length-1].buildingNode.sore;
		var num = buildingSchedules[buildingSchedules.length-1].bsid;
		var addNext = buildingSchedules[buildingSchedules.length-1].buildingNode.sore+1;
		
		nextBuildingSchedule(params.type, addNext, num)
		
	});
	
	if(buildingSchedules.length == bNodeLength(buildingNodeName) && buildingSchedules[buildingSchedules.length-1].status !=2){
		
		$('#btnSave').removeClass("hide");
		
	};
	
	$('#btnSave').on(ace.click_event, function(){
		
		var updateParam = buildingSchedules[buildingSchedules.length-1].bsid;
		
		updateSchedule(updateParam);
		
	});
	
	$('#btnUpdate').on(ace.click_event, function(){
		
		if(isNaN(sd)){
			
			updateTimeOrStatus(buildingNodeName[buildingSchedules.length], buildingSchedules.length);
			
		}else{
			
			updateTimeOrStatus(buildingNodeName[sd], sd);
			
		}
		
	});
	
	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.building.url);
	});
	
	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
	$('[data-rel=popover]').popover({html:true});
	
	function initWizardSept(operate, schedule){

		addActive(schedule);
		if($("#" + operate.name + "PlanTime").size()>0){
			$("#" + operate.name + "PlanTime").val(buildingSchedules[schedule-1].planTime);
		}
		$("#" + operate.name + "Record").val(buildingSchedules[schedule-1].comment);
		$("#" + operate.name + "OperatTime").val(buildingSchedules[schedule-1].operatTime);
		$("#" + operate.name + "Operater").val(buildingSchedules[schedule-1].operater.currentName);
		
		var statusDiv = $("#" + operate.name + "Status").html("");
		
		if(buildingSchedules[schedule-1].status == 0){
			$("<span></span>").addClass("label label-success").text("初始").appendTo(statusDiv);
		}else if(buildingSchedules[schedule-1].status == 1){
			$("<span></span>").addClass("label label-danger").text("失效").appendTo(statusDiv);
		}else if(buildingSchedules[schedule-1].status == 2){
			$("<span></span>").addClass("label").text("完结").appendTo(statusDiv);
		}else{
			
		};
		
		var options = {};
		options["buildingDrawing.sid"] = buildingSchedules[schedule-1].bsid;
		options["buildingDrawing.type"] = 3;
		
		com.post(api.building.queryBuildingDrawing,options,function(res){
			
			$('#'+operate.name+"Gallery").empty();
			
			var buildingDrawings = res.buildingDrawings;
			
			for(var i=0; i<buildingDrawings.length; i++){
				var buildingDrawing = buildingDrawings[i];
					
				appendGalleryElement(operate.name+"Gallery", buildingDrawing.bdid, buildingDrawing.drawingUrl, buildingDrawing.drawingType, "", api.building.deleteBuildingDrawing)
					
			};
				
		});
		
		initUploadBtn(operate, buildingSchedules[schedule-1].bsid, buildingSchedules[schedule-1].buildingNode.name);
		$('#'+operate.name + "Drawing").removeClass("active");

		if($('#' + operate.name + "NavTab" + ' li:last-of-type').hasClass("active")){
			$('#' + operate.name + "Drawing").addClass("active");
		};
		
	};
	
	function initUploadBtn(operate, ele, dwName){

		$("#" + operate.name + "Upload").html("").Huploadify({
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

					options["buildingDrawing.sid"] = ele;
					options["buildingDrawing.name"] = dwName + "图片";
					options["buildingDrawing.drawingUrl"] = dateObj.resUrl;
					options["buildingDrawing.drawingType"] = 0;
					options["buildingDrawing.type"] = 3;

					com.post(api.building.addBuildingDrawing, options, function(res){
						var drawing = res.buildingDrawing;
						appendGalleryElement(operate.name + "Gallery", drawing.bdid, dateObj.resUrl, 0, "", api.building.deleteBuildingDrawing);
					});
				}else{
					console.log(data);
				}
			}
		});
	};
	
	function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl){
		
		var gallery = $("#" + galleryId);
		var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("col-xs-2 text-center").css("border-color", "#ddd").appendTo(gallery);
		var img = $('<img />');
		var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(imgLi);
		var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
		var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
			var options = {};
			options["buildingDrawing.bdid"] = imgId;

			com.post(deleteUrl, options, function(res){
				$("#gallery_li"+imgId).remove();
			});
		}).appendTo(toolsDiv);
		$("<i></i>").addClass("icon-remove red").appendTo(toolsA);
		imgA.colorbox(colorboxArgs);
	};
	
	function updateSchedule(num){
		
		var options = {};
		
		options["buildingSchedule.bsid"] = num;
		
		com.post(api.building.updateBuildingScheduleForStatus, options, function(res){
			
			according();
			
			initWizardSept(buildingNodeName[buildingSchedules.length], buildingSchedules.length);
			
			$('#btnSave').addClass("hide");
		});
	}
	
	function updateTimeOrStatus(operate, schedule){
		
		var options = {};
		
		if(buildingSchedules[schedule-1].planTime == $("#" + operate.name + "PlanTime").val() && buildingSchedules[schedule-1].comment != $("#" + operate.name + "Record").val()){
			
			options["buildingSchedule.bsid"] = buildingSchedules[schedule-1].bsid;
			options["buildingSchedule.comment"] = $("#" + operate.name + "Record").val();
			
		}
		if(buildingSchedules[schedule-1].planTime != $("#" + operate.name + "PlanTime").val() && buildingSchedules[schedule-1].comment == $("#" + operate.name + "Record").val()){
			
			options["buildingSchedule.bsid"] = buildingSchedules[schedule-1].bsid;
			options["buildingSchedule.planTime"] = $("#" + operate.name + "PlanTime").val() + " 23:59:59";
			
		}
		if(buildingSchedules[schedule-1].planTime != $("#" + operate.name + "PlanTime").val() && buildingSchedules[schedule-1].comment != $("#" + operate.name + "Record").val()){
			
			options["buildingSchedule.planTime"] = $("#" + operate.name + "PlanTime").val() + " 23:59:59";
			options["buildingSchedule.bsid"] = buildingSchedules[schedule-1].bsid;
			options["buildingSchedule.comment"] = $("#" + operate.name + "Record").val();
			
		}
		
		com.post(api.building.updateBuildingSchedule, options, function(res){
			
			com.showAlert(com.info, "更新成功!");
			
			according();
			
			initWizardSept(buildingNodeName[schedule], schedule);
			
		})
		
	}
	
	function nextBuildingSchedule(type, sore, num){
		
		var ops = {};
		ops["buildingSchedule.buildingNode.type"] = type;
		ops["buildingSchedule.building.boid"] = params.boid;
		ops["buildingSchedule.buildingNode.sore"] = sore;
			
		if(num != 0){
				
			ops["buildingSchedule.bsid"] = num;
				
		}
			
		com.post(api.building.nextBuildingSchedule, ops, function(res){
			
			according();

			initWizardSept(buildingNodeName[sore], sore);
			
			if(buildingSchedules.length == bNodeLength(buildingNodeName)){
				
				$('#btnNext').addClass("hide");
				$('#btnSave').removeClass("hide");
				
			};
				
		}, null, false);
			
	};
	
	function according(){
		
		com.post(api.building.queryBuildingScheduleByBoid,{"buildingSchedule.building.boid":params.boid},function(res){

			buildingSchedules = res.buildingSchedules;
			
			$("#stepId").empty();
			$("#step-container").empty();
			
			if(buildingSchedules.length == 0){
				
				nextBuildingSchedule(params.type, 1, 0)
				
			}else{
				
				$.each(buildingSchedules, function(i, v){
					
					showBuildingNode("#stepId", v.buildingNode.sore);
					
					buildingPane("#step-container", v.buildingNode.sore, buildingNodeName[v.buildingNode.sore]);
					
				});
				
			}
			
			if(buildingSchedules.length != 0){
				
				$('#fuelux-wizard').off('stepclick').ace_wizard({status:true}).on('stepclick', function(e, info){
					
					var stepId = $("[flag]").eq(info.step-1).attr("id");
					sd = stepId.substring(4);
					
					initWizardSept(buildingNodeName[sd], sd);
					
				});
				
			}
			
		},null,false);
		
	}
	
	//画节点信息轴
	function showBuildingNode(stepul, schedule){
	
		if(buildingSchedules[schedule-1].status == 2){
			showCondition = true;
		}else{
			showCondition = false;
		};
		
		if(showCondition){
			var stepLi = $("<li></li>").attr("id", "#step" + schedule).addClass("complete").appendTo(stepul);
			var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
			var stepSpan = $("<span></span>").addClass("title").html(buildingSchedules[schedule-1].buildingNode.name).appendTo(stepLi);
			
		}else{
			var stepLi = $("<li></li>").attr("id", "#step" + schedule).addClass("").appendTo(stepul);
			var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
			var stepSpan = $("<span></span>").addClass("title").html(buildingSchedules[schedule-1].buildingNode.name).appendTo(stepLi);
			
		}
		
	}

	function buildingPane(paneId, schedule,scheduleNamePinyin){
		
		if(buildingSchedules[schedule-1].status == 2){
			var ableTime = false;
		}else{
			var ableTime = true;
		}
		
		if(scheduleNamePinyin.flag){
			var timeShow = true;
		}else{
			var timeShow = false;
		}

		var paneDiv = $("<div></div>").addClass("step-pane").attr("id","step" + schedule).attr("flag","step").appendTo(paneId);

		if(schedule == 1){
			paneDiv.removeClass("step-pane");
			paneDiv.attr("class", "active");
		}

		var paneDivTwo = $("<div></div>").addClass("row").appendTo(paneDiv);
		var paneDivThree = $("<div></div>").addClass("tabbable").appendTo(paneDivTwo);
		var paneul = $("<ul></ul>").addClass("nav nav-tabs").attr("id",scheduleNamePinyin.name + "NavTab").appendTo(paneDivThree);
		var paneli = $("<li></li>").addClass("active").appendTo(paneul);
		var panelia = $("<a></a>").attr("data-toggle","tab").attr("href","#" + scheduleNamePinyin.name + "Info").html("信息").appendTo(paneli);

		var paneTabContent = $("<div></div>").addClass("tab-content").appendTo(paneDivThree);
		var paneTabTwo = $("<div></div>").addClass("tab-pane in active").attr("id",scheduleNamePinyin.name + "Info").appendTo(paneTabContent);
		var paneTabForm = $("<form></form>").addClass("form-horizontal").appendTo(paneTabTwo);

		var paneTabThree = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneTabH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneTabThree);
		var paneTabH3I = $("<i></i>").addClass("icon-edit").appendTo(paneTabH3);
		var paneTabSpan = $("<span></span>").html(buildingSchedules[schedule-1].buildingNode.name + "信息").appendTo(paneTabH3);

		if(timeShow){
			
			var panePlanTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var panePlanTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(panePlanTime);
			var panePTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "PlanTime").html("计划时间").appendTo(panePlanTimeTwo);
			var panePTThree = $("<div></div>").addClass("input-group col-sm-2 no-padding-right v_required").attr("data-for", scheduleNamePinyin.name + "PlanTime").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(panePlanTimeTwo);
			
			if(ableTime){
				
				var panePTInput = $("<input/>").attr("id", scheduleNamePinyin.name + "PlanTime").attr("type","text").addClass("form-control date-picker").attr("data-date-format", "yyyy-mm-dd").appendTo(panePTThree);

				$(".date-picker").datepicker({autoclose : !0}).on("show", function() {
				       setTimeout(function() {
				           $(".dropdown-menu").css("z-index", 1060);
				       },0);
				}).next().on(ace.click_event, function() {
				       $(this).prev().focus();
				   });
				
			}else{
				
				var panePTInput = $("<input/>").attr("id", scheduleNamePinyin.name + "PlanTime").attr("type","text").attr("readonly","readonly").appendTo(panePTThree);

			}
						
			var paneOTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "OperatTime").html("操作时间").appendTo(panePlanTimeTwo);
			var paneOTFour = $("<div></div>").addClass("col-sm-2").appendTo(panePlanTimeTwo);
			var paneOTInput = $("<input/>").attr("id", scheduleNamePinyin.name + "OperatTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneOTFour);
		
			var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			
			var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);
			var paneOplable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Operater").html("操作人").appendTo(paneStatusTwo);
			var paneOpFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStatusTwo);
			var paneOpInput = $("<input/>").attr("id", scheduleNamePinyin.name + "Operater").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneOpFour);	
			
			var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			
			var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Status").html(buildingSchedules[schedule-1].buildingNode.name + "状态").appendTo(paneStatusTwo);
			var paaneStatusTh = $("<div></div>").attr("id",scheduleNamePinyin.name + "Status").addClass("col-sm-2").appendTo(paneStatusTwo);
			
			var paneRecordContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var paneRecordOne = $("<div></div>").addClass("col-sm-14").appendTo(paneRecordContent);
			var paneRecordLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Record").html(buildingSchedules[schedule-1].buildingNode.name + "备注").appendTo(paneRecordOne);
			var paneRecordTwo = $("<div></div>").addClass("col-sm-10").appendTo(paneRecordOne);
			var paneRecordInfo = $("<textarea/>").addClass("col-sm-8").attr("id",scheduleNamePinyin.name + "Record").attr("type","text").appendTo(paneRecordTwo);
			
			var paneRecordSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			
		}else{
			
			var panePlanTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var panePlanTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(panePlanTime);
			var panePTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "OperatTime").html("操作时间").appendTo(panePlanTimeTwo);
			var panePTThree = $("<div></div>").addClass("col-sm-2").appendTo(panePlanTimeTwo);
			var panePTInput = $("<input/>").attr("id", scheduleNamePinyin.name + "OperatTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(panePTThree);

			var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			
			var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);
			
			var paneOplable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Operater").html("操作人").appendTo(paneStatusTwo);
			var paneOpFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStatusTwo);
			var paneOpInput = $("<input/>").attr("id", scheduleNamePinyin.name + "Operater").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneOpFour);	
			
			var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			
			var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Status").html(buildingSchedules[schedule-1].buildingNode.name + "状态").appendTo(paneStatusTwo);
			var paaneStatusTh = $("<div></div>").attr("id",scheduleNamePinyin.name + "Status").addClass("col-sm-2").appendTo(paneStatusTwo);
			
			var paneRecordContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var paneRecordOne = $("<div></div>").addClass("col-sm-14").appendTo(paneRecordContent);
			var paneRecordLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin.name + "Record").html(buildingSchedules[schedule-1].buildingNode.name + "备注").appendTo(paneRecordOne);
			var paneRecordTwo = $("<div></div>").addClass("col-sm-10").appendTo(paneRecordOne);
			var paneRecordInfo = $("<textarea/>").addClass("col-sm-8").attr("id",scheduleNamePinyin.name + "Record").attr("type","text").appendTo(paneRecordTwo);
			
			var paneRecordSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
		}
		
		//图片信息
		var panePic = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var panePicH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(panePic);
		var panePicI = $("<i></i>").addClass("icon-edit").appendTo(panePicH3);
		var panePicSpan = $("<span></span>").html("附件图片信息").appendTo(panePicH3);

		var panePicContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var panePicInfo = $("<div></div>").addClass("tab-pane in active").attr("id",scheduleNamePinyin.name + "PicInfos").appendTo(panePicContent);
		var paneSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
		
		//附件图片信息内容
		var paneDrawing = $("<div></div>").addClass("tab-pane in").attr("id",scheduleNamePinyin.name + "Drawing").appendTo(panePicContent);
		var paneDrawingRow = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowOne = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRow);
		var paneDrawingRowTwo = $("<div></div>").addClass("row-fluid").appendTo(paneDrawingRowOne);
		var paneDrawingRowUl = $("<ul></ul>").addClass("ace-thumbnails").attr("id",scheduleNamePinyin.name + "Gallery").appendTo(paneDrawingRowTwo);

		var paneDrawingRowT = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowTOne = $("<div></div>").addClass("hr hr32 hr-dotted").appendTo(paneDrawingRowT);
		var paneDrawingRowTTwo = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRowT)
		var paneDrawingRowTh = $("<div></div>").addClass("pull-left inline").appendTo(paneDrawingRowTTwo);
		var paneDrawingRowFour = $("<div></div>").attr("id",scheduleNamePinyin.name + "Upload").appendTo(paneDrawingRowTh);
		var paneDrawingRowInp = $("<input />").attr("type","text").addClass("hidden").attr("id", scheduleNamePinyin.name + "picture").appendTo(paneDrawingRowTh);

		//上传按钮
		var paneDrawingBtn = $("<input />").attr("id", scheduleNamePinyin.name + "select_btn_1").addClass("selectbtn").attr("style","display:none").attr("type","file").attr("name","fileselect[]").attr("multiple","").attr("accept","image/jpeg,image/gif,image/png").appendTo(paneDrawingRowTTwo);
		var paneDrawingA = $("<a></a>").attr("id","file_upload_1-button").attr("href","javascript:void(0)").addClass("uploadify-button btn btn-success").html("上传").appendTo(paneDrawingRowFour);
		var paneDrawingUpDiv = $("<div></div>").attr("id","file_upload_1-queue").addClass("uploadify-queue").attr("style","width: 300px;").appendTo(paneDrawingRowFour);
	
	}

	function addActive(schedule){
		
		if(buildingSchedules.length == 0){
			
			$("#step" + schedule-1).removeClass("active");
			$("#step" + schedule-1).addClass("step-pane");
			$("#step" + schedule).removeClass("step-pane");
			$("#step" + schedule).addClass("active");
		}else{
			
			$.each(buildingSchedules,function(i, v){
				$("#step" + v.buildingNode.sore).removeClass("active");
				$("#step" + v.buildingNode.sore).addClass("step-pane");
				$("#step" + v.buildingNode.sore+1).removeClass("active");
				$("#step" + v.buildingNode.sore+1).removeClass("active");
			});
			$("#step" + schedule).removeClass("step-pane");
			$("#step" + schedule).addClass("active");
		}
		
	}

});
