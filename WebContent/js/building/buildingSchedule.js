jQuery(function($) {
	var buildingNodes = [];
	var buildingSchedules = {};
	var buildingSores = [];
	
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

	//获取所有节点
	com.post(api.building.queryBuildingNodeByType, {"buildingNode.type":params.type, "buildingNode.status":0}, function(res){
		$.each(res.buildingNodes, function(i, v){
			buildingNodes[i] = (v.sore);
		});
	}, null, false);

	//动态获取节点轴
	com.post(api.building.queryBuildingScheduleByBid, {"buildingSchedule.building.bid":params.bid}, function(res){
		$.each(res.buildingSchedules, function(i, v){
			buildingSchedules[v.buildingNode.sore] = v;
			buildingSores[i] = v.buildingNode.sore;
			showBuildingNode("#stepId", v.buildingNode.sore);
			buildingPane("#step-container", v.buildingNode.sore);
		});

		$('#fuelux-wizard').ace_wizard({status:true}).on('finished', function(e) {
			com.showAlert(com.info, "当前房产单流转已完成！");
		}).on('stepclick', function(e, info){
			var stepId = $("[flag]").eq(info.step-1).attr("id");
			var sd = stepId.substring(4);
			initWizardSept(sd);
		});
	},null,false);

	$('#modal-wizard .modal-header').ace_wizard();
	$('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');

	$('[data-rel=popover]').popover({html:true});

	//显示初始页面是最后一个
	initWizardSept(buildingSores[buildingSores.length-1]);

	//当前面板显示内容
	function initWizardSept(sore){
		addActive(sore);
		scheduleMessage(sore);
		scheduleStatus(sore);

		var options = {};
		options["buildingDrawing.sid"] = buildingSchedules[sore].bsid;
		options["buildingDrawing.type"] = 3;

		com.post(api.building.queryBuildingDrawing, options, function(res){
			$('#' + sore + "Gallery").empty();
			var buildingDrawings = res.buildingDrawings;

			for(var i = 0; i < buildingDrawings.length; i++){
				var buildingDrawing = buildingDrawings[i];
				appendGalleryElement(sore + "Gallery", buildingDrawing.bdid, buildingDrawing.drawingUrl, buildingDrawing.drawingType, "", api.building.deleteBuildingDrawing)
			};
		});

		initUploadBtn(sore, buildingSchedules[sore].bsid, buildingSchedules[sore].buildingNode.name);

		$('#'+ sore + "Drawing").removeClass("active");

		if($('#' + sore + "NavTab" + ' li:last-of-type').hasClass("active")){
			$('#' + sore + "Drawing").addClass("active");
		};

		//点击更新按钮  更新计划时间和备注信息(计划时间可能没有)
		$("#" + sore + "btnUpdate").unbind("click");
		$("#" + sore + "btnUpdate").on("click", function(){
			if(buildingSchedules[sore].status == 2){
				com.showAlert(com.warning, "当前节点已完成，不能修改节点信息！");
				return;
			}

			var options = {};
			options["buildingSchedule.bsid"] = buildingSchedules[sore].bsid;
			options["buildingSchedule.comment"] = $("#" + sore + "Record").val();
			options["buildingSchedule.planTime"] = $("#" + sore + "PlanTime").val();

			com.post(api.building.updateBuildingSchedule, options, function(res){
				buildingSchedules[sore] = res.buildingSchedule;
				buildingSchedules[sore].operatTime = getCurrentDate();
				scheduleStatus(sore);
				scheduleMessage(sore);
				com.showAlert(com.info, "更新成功！");
			});
		});

		//点击下一步
		$("#" + sore + "btnNext").unbind("click");
		$("#" + sore + "btnNext").on("click", function(){
			var nodeSore = buildingNodes.indexOf(parseInt(sore));
			var nextNodeSore = buildingNodes[parseInt(nodeSore)+1];

			if((buildingNodes).indexOf(parseInt(nextNodeSore)) > 0){
				if(buildingSores.indexOf(parseInt(nextNodeSore)) < 0){
					//更新节点状态、生成下一节点
					var bsDate = {};
					bsDate["buildingSchedule.bsid"] = buildingSchedules[sore].bsid;
					bsDate["buildingSchedule.comment"] = $("#" + sore + "Record").val();
					bsDate["buildingSchedule.planTime"] = $("#" + sore + "PlanTime").val();
					bsDate["buildingSchedule.buildingNode.sore"] = nextNodeSore;

					com.post(api.building.nextBuildingSchedule, bsDate, function(res){
						buildingSchedules[sore].status = 2;
						buildingSchedules[sore].planTime = $("#" + sore + "PlanTime").val();
						buildingSchedules[sore].operatTime = getCurrentDate();
						buildingSchedules[sore].comment = $("#" + sore + "Record").val();
						var num = res.buildingSchedule.buildingNode.sore;
						buildingSchedules[num] = res.buildingSchedule;
						buildingSores.push(num);
						$("#sstep" + sore).addClass("complete");

						showBuildingNode("#stepId", nextNodeSore);
						buildingPane("#step-container", nextNodeSore);
						$("#step" + nextNodeSore).removeClass("step-pane").addClass("active complete");

						initWizardSept(nextNodeSore);
					});
				}else{
					initWizardSept(nextNodeSore);
				}

			}else if(sore == buildingNodes[buildingNodes.length-1]){
				if(buildingSchedules[sore].status == 2){
					com.showAlert(com.warning, "当前房产单流转已完成！");
					return;
				}

				var datas = {};
				datas["buildingSchedule.bsid"] = buildingSchedules[sore].bsid;
				datas["buildingSchedule.comment"] = $("#" + sore + "Record").val();
				datas["buildingSchedule.planTime"] = $("#" + sore + "PlanTime").val();

				com.post(api.building.updateBuildingSchedule, datas, function(res){
					buildingSchedules[sore] = res.buildingSchedule;
					$("#" + sore + "OperatTime").val(getCurrentDate());
					buildingSchedules[sore].operatTime = getCurrentDate();
				});

				var options = {};
				options["buildingSchedule.bsid"] = buildingSchedules[sore].bsid;

				com.post(api.building.updateBuildingScheduleForStatus, options, function(res){
					buildingSchedules[sore].status = 2;
					$("#sstep" + sore).addClass("complete");
					scheduleStatus(sore);
					com.showAlert(com.info, "当前房产单流转已完成！");
				});
			}

		});

		$("#" + sore + "btnBack").on("click", function(){
			com.switchPage(api.index.building.url);
		});
	};

	//图片上传
	function initUploadBtn(sore, ele, dwName){
		$("#" + sore + "Upload").html("").Huploadify({
			'debug' : false, // 开启调试
			'auto':true, // 是否自动上传
			'successTimeout':150, // 超时时间
			'formData':{ // 附带值
				'uploadType':0,
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
						appendGalleryElement(sore + "Gallery", drawing.bdid, dateObj.resUrl, 0, "", api.building.deleteBuildingDrawing);
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
	
	//画节点信息轴
	function showBuildingNode(stepul, schedule){
		var stepLi = $("<li></li>").attr("id", "sstep" + schedule).appendTo(stepul);
		var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
		var stepSpan = $("<span></span>").addClass("title").html(buildingSchedules[schedule].buildingNode.name).appendTo(stepLi);

		if(buildingSchedules[schedule].status == 2){
			stepLi.addClass("complete");
		}
	}

	//画房产单节点的面板
	function buildingPane(paneId, sore){
		var statusFlag;

		if(buildingSchedules[sore].status == 2){
			statusFlag = false;
		}else{
			statusFlag = true;
		}

		var paneDiv = $("<div></div>").addClass("step-pane").attr("id","step" + sore).attr("flag","step").appendTo(paneId);

		var paneDivTwo = $("<div></div>").addClass("row").appendTo(paneDiv);
		var paneDivThree = $("<div></div>").addClass("tabbable").appendTo(paneDivTwo);
		var paneul = $("<ul></ul>").addClass("nav nav-tabs").attr("id", sore + "NavTab").appendTo(paneDivThree);
		var paneli = $("<li></li>").addClass("active").appendTo(paneul);
		var panelia = $("<a></a>").attr("data-toggle","tab").attr("href","#" + sore + "Info").html("信息").appendTo(paneli);

		var paneTabContent = $("<div></div>").addClass("tab-content").appendTo(paneDivThree);
		var paneTabTwo = $("<div></div>").addClass("tab-pane in active").attr("id", sore  + "Info").appendTo(paneTabContent);
		var paneTabForm = $("<form></form>").addClass("form-horizontal").appendTo(paneTabTwo);

		var paneTabThree = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneTabH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneTabThree);
		var paneTabH3I = $("<i></i>").addClass("icon-edit").appendTo(paneTabH3);
		var paneTabSpan = $("<span></span>").html(buildingSchedules[sore].buildingNode.name + "信息").appendTo(paneTabH3);

		var panePlanTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var panePlanTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(panePlanTime);
		var panePTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",sore + "OperatTime").html("操作时间").appendTo(panePlanTimeTwo);
		var panePTThree = $("<div></div>").addClass("col-sm-2").appendTo(panePlanTimeTwo);
		var panePTInput = $("<input/>").attr("id", sore + "OperatTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(panePTThree);

		var thisPayType = params.type;
		var thisNodeSore = buildingSchedules[sore].buildingNode.sore;

		if(thisPayType == 1){
			if(thisNodeSore == 8){
				planTime(sore, panePlanTimeTwo, statusFlag);
			}
		}else if(thisPayType == 2 || thisPayType == 4){
			if(thisNodeSore == 2 || thisNodeSore == 3 || thisNodeSore == 11){
				planTime(sore, panePlanTimeTwo, statusFlag);
			}
		}else if(thisPayType == 3){
			if(thisNodeSore == 8 || thisNodeSore == 9 || thisNodeSore == 10){
				planTime(sore, panePlanTimeTwo, statusFlag);
			}
		}

		var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

		var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);

		var paneOplable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", sore + "Operater").html("操作人").appendTo(paneStatusTwo);
		var paneOpFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStatusTwo);
		var paneOpInput = $("<input/>").attr("id", sore + "Operater").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneOpFour);

		var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

		var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", sore + "Status").html(buildingSchedules[sore].buildingNode.name + "状态").appendTo(paneStatusTwo);
		var paaneStatusTh = $("<div></div>").attr("id", sore + "Status").addClass("col-sm-2").appendTo(paneStatusTwo);

		var paneRecordContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneRecordOne = $("<div></div>").addClass("col-sm-14").appendTo(paneRecordContent);
		var paneRecordLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", sore + "Record").html(buildingSchedules[sore].buildingNode.name + "备注").appendTo(paneRecordOne);
		var paneRecordTwo = $("<div></div>").addClass("col-sm-10").appendTo(paneRecordOne);
		var paneRecordInfo = $("<textarea/>").addClass("col-sm-8").attr("id", sore + "Record").attr("type","text").appendTo(paneRecordTwo);

		var paneRecordSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
		//}
		
		//图片信息
		var panePic = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var panePicH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(panePic);
		var panePicI = $("<i></i>").addClass("icon-edit").appendTo(panePicH3);
		var panePicSpan = $("<span></span>").html("附件图片信息").appendTo(panePicH3);

		var panePicContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var panePicInfo = $("<div></div>").addClass("tab-pane in active").attr("id", sore + "PicInfos").appendTo(panePicContent);
		var paneSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

		//附件图片信息内容
		var paneDrawing = $("<div></div>").addClass("tab-pane in").attr("id", sore + "Drawing").appendTo(panePicContent);
		var paneDrawingRow = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowOne = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRow);
		var paneDrawingRowTwo = $("<div></div>").addClass("row-fluid").appendTo(paneDrawingRowOne);
		var paneDrawingRowUl = $("<ul></ul>").addClass("ace-thumbnails").attr("id", sore + "Gallery").appendTo(paneDrawingRowTwo);

		var paneDrawingRowT = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowTOne = $("<div></div>").addClass("hr hr32 hr-dotted").appendTo(paneDrawingRowT);
		var paneDrawingRowTTwo = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRowT)
		var paneDrawingRowTh = $("<div></div>").addClass("pull-left inline").appendTo(paneDrawingRowTTwo);
		var paneDrawingRowFour = $("<div></div>").attr("id", sore + "Upload").appendTo(paneDrawingRowTh);
		var paneDrawingRowInp = $("<input />").attr("type","text").addClass("hidden").attr("id", sore + "picture").appendTo(paneDrawingRowTh);

		//上传按钮
		var paneDrawingA = $("<a></a>").attr("id","file_upload_1-button").attr("href","javascript:void(0)").addClass("uploadify-button btn btn-success").appendTo(paneDrawingRowFour);
		var paneDrawingUpDiv = $("<div></div>").attr("id","file_upload_1-queue").addClass("uploadify-queue").attr("style","width: 300px;").appendTo(paneDrawingRowFour);

		//三个按钮
		var divWizard = $("<div></div>").addClass("row-fluid wizard-actions").appendTo(paneDiv);
		var updateBtn = $("<button></button>").addClass("btn btn-info").prop("id", sore + "btnUpdate").css("margin-right", "10px").appendTo(divWizard);
		var updateI = $("<i></i>").addClass("icon-ok bigger-110").html("更新").appendTo(updateBtn);
		var nextBtn = $("<button></button>").addClass("btn btn-info btn-next").attr("data-last", "Finish").prop("id", sore + "btnNext").css("margin-right", "10px").html("下一步").appendTo(divWizard);
		var nextI = $("<i></i>").addClass("icon-arrow-right icon-on-right").appendTo(nextBtn);
		var backBtn = $("<button></button>").addClass("btn btn-info").prop("id", sore + "btnBack").css("margin-right", "10px").appendTo(divWizard);
		var backI = $("<i></i>").addClass("icon-ok bigger-110").html("返回").appendTo(backBtn);
	}

	function addActive(sore){
		$.each(buildingSchedules, function(i, v){
			$("#step" + v.buildingNode.sore).removeClass("active");
			$("#step" + v.buildingNode.sore).addClass("step-pane");
		});
		$("#step" + sore).removeClass("step-pane");
		$("#step" + sore).addClass("active");
	}

	//画计划时间输入框
	function planTime(sore, panePlanTimeTwo, statusFlag){
		var panePTTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for", sore + "PlanTime").html("计划时间").appendTo(panePlanTimeTwo);
		var panePTTThree = $("<div></div>").addClass("col-sm-2").appendTo(panePlanTimeTwo);

		if(statusFlag){
			var panePTTInput = $("<input/>").attr("id", sore + "PlanTime").attr("type","text").addClass("form-control date-picker").attr("data-date-format", "yyyy-mm-dd").appendTo(panePTTThree);

			$(".date-picker").datepicker({autoclose : !0}).on("show", function(){
			   setTimeout(function() {
				   $(".dropdown-menu").css("z-index", 1060);
			   },0);
			}).next().on(ace.click_event, function() {
				   $(this).prev().focus();
			});
		}else{
			var panePTTInput = $("<input/>").attr("id", sore + "PlanTime").attr("type", "text").attr("readonly", "readonly").appendTo(panePTTThree);
		}
	}

	//设置节点信息、节点状态
	function scheduleMessage(sore){
		$("#" + sore + "PlanTime").val(buildingSchedules[sore].planTime);
		$("#" + sore + "Record").val(buildingSchedules[sore].comment);
		$("#" + sore + "OperatTime").val(buildingSchedules[sore].operatTime);
		$("#" + sore + "Operater").val(buildingSchedules[sore].operater.currentName);
	}

	function scheduleStatus(sore){
		var statusDiv = $("#" + sore + "Status").html("");

		if(buildingSchedules[sore].status == 0){
			$("<span></span>").addClass("label label-success").text("初始").appendTo(statusDiv);
		}else if(buildingSchedules[sore].status == 2){
			$("<span></span>").addClass("label").text("完结").appendTo(statusDiv);
		};
	}

	//获取当前时间
	function getCurrentDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
		return currentdate;
	}

});
