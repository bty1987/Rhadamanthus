
jQuery(function($) {

	//从服务器查询出来的所有工人
	var constructionScheduleWorkers;
	var constructionNodes = {};

	var supervisionDetail = {

		controlCondition: false,

		constructionSchedules:{},

		operateDict: {
			"1": {
				name:"chan",
				drawingType: 6,
			}, "2": {
				name:"putline",
				drawingType: 7,
			}, "3": {
				name:"waterwayCircuitPower",
				drawingType: 8,
			}, "4": {
				name:"bricklay",
				drawingType: 9,
			}, "5": {
				name:"groundLeveling",
				drawingType: 10,
			}, "6": {
				name:"carpent",
				drawingType: 11,
			}, "7": {
				name:"oil",
				drawingType: 12,
			}, "8": {
				name:"waterwayCircuitCheck",
				drawingType: 13,
			}, "9": {
				name:"cleaning",
				drawingType: 14,
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

	//获取节点名称
	com.post(api.data.queryConstructionNode, {}, function(res){
		$.each(res.constructionNodes, function(i, v){
			constructionNodes["num" + v.cnid] = v.cnid;
			constructionNodes[v.cnid] = v.name;
		})
	}, null, false);

	//动态获取节点轴
	com.post(api.construction.queryConstructionScheduleByOrderId,{"constructionSchedule.orderId":params.orderId},function(res){

		var constructionSchedule = res.constructionSchedules;

		supervisionDetail.constructionSchedules = res.constructionSchedules;

		$.each(constructionSchedule, function(i, v){
			constructionNode("#stepId", v.schedule);
			constructionPane("#step-container", v.schedule,supervisionDetail.operateDict[v.schedule].name);
			params.cid = v.cid;
		});

		var stepnum = constructionSchedule[0].schedule;
		initWizardSept(supervisionDetail.operateDict[stepnum], stepnum);

		$('#fuelux-wizard').ace_wizard({status:true, currentStep: stepnum}).on('finished', function(e) {
			com.showAlert(com.info, "工程已经结束,之后可以进行验收工作!");
		}).on('stepclick', function(e, info){
			var stepId = $("[flag]").eq(info.step-1).attr("id");
			var sd = stepId.substring(4);
			if(!supervisionDetail.wizardSept[sd]){
				initWizardSept(supervisionDetail.operateDict[sd], sd);
			}
		});
	},null,false);

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

		addActive(schedule);

		var elementPostData = {};
		elementPostData["constructionSchedule.orderId"] = params.orderId;
		elementPostData["constructionSchedule.schedule"] = schedule;
		supervisionDetail.controlCondition = false;
		var workerInfoCondition = false;

		com.post(api.construction.queryConstructionScheduleByOrderId, elementPostData, function(res){

			var element = res.constructionSchedules;

			supervisionDetail["constructionSchedule.csId"] = element[0].csId;

			if(schedule == 1){

				var workerLength = 0;
				$("#" + operate.name + "StartTime").val(element[0].startTime);
				$("#" + operate.name + "EndTime").val(element[0].endTime);

				var statusDiv = $("#" + operate.name + "Status").html("");
				if(element[0].status == 1){
					$("<span></span>").addClass("label label-success").text("成功").appendTo(statusDiv);
				}else if(element[0].status == 2){
					$("<span></span>").addClass("label label-danger").text("失败").appendTo(statusDiv);
				}else if(element[0].status == 3){
					$("<span></span>").addClass("label label-warning").text("延迟").appendTo(statusDiv);
				}else if(element[0].status == 4){
					$("<span></span>").addClass("label label-info").text("通过").appendTo(statusDiv);
				}else{
					$("<span></span>").addClass("label").text("待处理").appendTo(statusDiv);
				}

				var options = {};
				options["constructer.orderId"] = params.orderId;
				options["constructer.schedule"] = schedule;

				com.post(api.construction.queryConstructerByOrderId, options, function(res){
					workerInfoCondition = queryConstructer(operate, res);

					if(workerInfoCondition){

						if(element[0].status != undefined && (element[0].status == 0 || element[0].status == 2)){
							supervisionDetail.controlCondition = false;
						}else if(element[0].status != undefined && element[0].status == 1){
							supervisionDetail.controlCondition = true;
						}else{
							supervisionDetail.controlCondition = true;
						}
					}else if(!workerInfoCondition){
						if(element[0].status != undefined && element[0].status == 4){
							supervisionDetail.controlCondition = true;
						}
					}
				});

				if(workerInfoCondition){
					if(element[0].status != undefined && (element[0].status == 0 || element[0].status == 2)){
						supervisionDetail.controlCondition = false;
					}else if(element[0].status != undefined && element[0].status == 1){
						supervisionDetail.controlCondition = true;
					}else{
						supervisionDetail.controlCondition = true;
					}
				}else if(!workerInfoCondition){
					if(element[0].status != undefined && element[0].status == 4){
						supervisionDetail.controlCondition = true;
					}
				}
			}else if(schedule == 2){

				$("#"+operate.name + "StartTime").val(element[0].startTime).attr("disabled", "disabled");

				var putlineStatusDiv = $("#" + operate.name + "Status").html("");

				var options = {};
				options["constructer.orderId"] = params.orderId;
				options["constructer.schedule"] = schedule;

				//查询施工人员
				com.post(api.construction.queryConstructerByOrderId, options, function(res){
					workerInfoCondition = queryConstructer(operate, res);
				}, null, false);

				if(element[0].status == 1){
					if(workerInfoCondition){
						supervisionDetail.controlCondition = true;
					}

					$("<span></span>").addClass("label label-success").text("成功").appendTo(putlineStatusDiv);
				}else if(element[0].status == 2){
					$("<span></span>").addClass("label label-danger").text("失败").appendTo(putlineStatusDiv);
				}else{
					$("<span></span>").addClass("label label-warning").text("等待").appendTo(putlineStatusDiv);
				}
			}else{
				//这里是3-9
				if(schedule == element[0].schedule){
					$("#" + operate.name + "StartTime").val(element[0].startTime);
					$("#" + operate.name + "EndTime").val(element[0].endTime);

					var options = {};
					options["constructer.orderId"] = params.orderId;
					options["constructer.schedule"] = schedule;

					//查询施工人员
					com.post(api.construction.queryConstructerByOrderId, options, function(res){
						workerInfoCondition = queryConstructer(operate, res);
					}, null, false);

					if(workerInfoCondition){
						if(element[0].status != undefined && (element[0].status == 0 || element[0].status == 2)){
							supervisionDetail.controlCondition = false;
						}else if(element[0].status != undefined && element[0].status == 1){
							supervisionDetail.controlCondition = true;
						}else{
							supervisionDetail.controlCondition = true;
						}
					}
				}
			}//这里是3-9结束

			var options = {};
			options["constructionDrawing.cid"] = params.cid;

			com.post(api.construction.queryConstructionDrawingByCid, options, function(res){
				var drawings = res.constructionDrawings;
				$("#" + operate.name + "Gallery").html("");

				for(var i=0;i<drawings.length;i++){
					var drawing = drawings[i];

					options["constructionDrawing.cdId"] = drawing.cdId;

					if(drawing.schedule == constructionNodes["num" + schedule] ){
						appendGalleryElement(operate.name + "Gallery", drawing.cdId, drawing.drawingUrl, drawing.type, "", api.construction.deleteConstructionDrawing);
					}
				}
			});
			initUploadBtn(operate, element, constructionNodes["num" + schedule]);
			$('#'+operate.name + "Drawing").removeClass("active");

			if($('#' + operate.name + "NavTab" + ' li:last-of-type').hasClass("active")){
				$('#' + operate.name + "Drawing").addClass("active");
			}
			return false;
		});
	}

	function initUploadBtn(operate, ele, eleschedule){

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

					options["constructionDrawing.cdId"] = 0;
					options["constructionDrawing.cid"] = params.cid;
					options["constructionDrawing.drawingName"] = "";
					options["constructionDrawing.drawingUrl"] = dateObj.resUrl;
					options["constructionDrawing.drawingAddUrl"] = "";
					options["constructionDrawing.schedule"] = eleschedule;

					com.post(api.construction.addConstructionDrawing, options, function(res){
						var drawing = res.constructionDrawing;
						appendGalleryElement(operate.name + "Gallery", drawing.cdId, dateObj.resUrl, 0, "", api.construction.deleteConstructionDrawing);
					});
				}else{
					console.log(data);
				}
			}
		});
	}

	function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl){
		
		var gallery = $("#" + galleryId);
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
		$("#" + operate.name + "WorkerInfos").html("");
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
				//工人编号, 名称, 职务
				var buttonPeople = $('<div id="workerNameSpan" style="float: right"></div>').html(workerInfo.user.userId + "" + workerInfo.user.userName + "<br/>" + workerInfo.user.duty).appendTo(buttonsDiv);

				//循环一个人, 将当前这个人的下标绑定到原始对象上, 因为jquery对象是原始对象的封装，每次获取都不一样, 所以没法用jquery对象存
				//这个就是存储到原始dom对象上, 简单说就是给你的对应的按钮添加一个_index属性正好和循环的i进行绑定
				buttonSpan[0]._index = i;
				buttonSpan.click(function () {
					_show_WorkerSalary(this._index);
				});
				profileDiv.appendTo($("#" + operate.name + "WorkerInfos"));
			}
			return true;
		} else {
			$('<div class="alert alert-info">').text("当前进度没有分配工人!").appendTo($("#" + operate.name + "WorkerInfos"));
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

				com.post(api.ds.salaryType, {}, function(res){
					vsubtype = res.SalaryType[v.subtype - 1].name;
				},null,false);

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
								com.showAlert(com.error, "工费状态不可操作!");
							});
						}))
					.append('<hr/>');
				workerSalary.appendTo($("#workerSalaryList"))
			})

			var salaryDiv = $('<div></div>').addClass("form-group").css("height","50px").css("margin-bottom","0px");
			var salaryDivT = $('<div></div>').addClass("col-sm-9").css("width", "550px").appendTo(salaryDiv);
			var salaryLabelT = $('<label><b>添加工费</b></label>').addClass('col-sm-3 control-label no-padding-left').attr("for","form-field-1").attr("for","salary").appendTo(salaryDivT);
			var salaryInputT = $('<input />').addClass("col-xs-10 col-sm-9").attr("id","salary").attr("data-toggle","popover").attr("data-trigger","manual").css("width", "320px").css("height", "30px").appendTo(salaryDivT);
			var salaryText = $('<span><b>* 扣款项请输入负数, 如: -123 !!!</b></span>').css("color","red").css("margin-left","-50px").appendTo(salaryDiv);

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
			var salaryBzInp = $('<textarea></textarea>').attr("id","comment").attr("maxlength","256").css("width","320px").appendTo(salaryDivF);

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
			com.showAlert(com.error,"请输入工人工费!");
		}else if($("#salaryType").val() == 0){
			com.showAlert(com.error,"请选择工费类型!");
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
				com.showAlert(com.error,"请正确输入工人工费, 小数点后最多保留3位!");
			}
		}
	}

	//画节点信息轴
	function constructionNode(stepul, schedule){
		var stepLi = $("<li></li>").attr("data-targe", "#step" + schedule).addClass("complete").appendTo(stepul);
		var stepSpan = $("<span></span>").addClass("step").html(schedule).appendTo(stepLi);
		var stepSpan = $("<span></span>").addClass("title").html(constructionNodes[schedule]).appendTo(stepLi);
	}

	//画节点下面的面板
	function constructionPane(paneId, schedule,scheduleNamePinyin){

		var paneDiv = $("<div></div>").addClass("step-pane").attr("id","step" + schedule).attr("flag","step").appendTo(paneId);

		if(schedule == 1){
			paneDiv.removeClass("step-pane");
			paneDiv.attr("class", "active");
		}

		var paneDivTwo = $("<div></div>").addClass("row").appendTo(paneDiv);
		var paneDivThree = $("<div></div>").addClass("tabbable").appendTo(paneDivTwo);
		var paneul = $("<ul></ul>").addClass("nav nav-tabs").attr("id",scheduleNamePinyin + "NavTab").appendTo(paneDivThree);
		var paneli = $("<li></li>").addClass("active").appendTo(paneul);
		var panelia = $("<a></a>").attr("data-toggle","tab").attr("href","#" + scheduleNamePinyin + "Info").html("信息").appendTo(paneli);

		var paneliTwo = $("<li></li>").addClass("").appendTo(paneul);
		var paneliTwoa = $("<a></a>").attr("data-toggle","tab").attr("href","#" + scheduleNamePinyin + "Drawing").html("施工图片").appendTo(paneliTwo);

		var paneTabContent = $("<div></div>").addClass("tab-content").appendTo(paneDivThree);
		var paneTabTwo = $("<div></div>").addClass("tab-pane in active").attr("id",scheduleNamePinyin + "Info").appendTo(paneTabContent);
		var paneTabForm = $("<form></form>").addClass("form-horizontal").appendTo(paneTabTwo);

		var paneTabThree = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneTabH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneTabThree);
		var paneTabH3I = $("<i></i>").addClass("icon-edit").appendTo(paneTabH3);
		var paneTabSpan = $("<span></span>").html(constructionNodes[schedule] + "信息").appendTo(paneTabH3);

		//开工时间
		var paneStartTime = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneStartTimeTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStartTime);
		var paneSTlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin + "StartTime").html("开工时间").appendTo(paneStartTimeTwo);
		var paneSTThree = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
		var paneSTInput = $("<input/>").attr("id", scheduleNamePinyin + "StartTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneSTThree);

		//完工时间
		if(schedule != 2){
			var paneETlable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin + "EndTime").html("完工时间").appendTo(paneStartTimeTwo);
			var paneETFour = $("<div></div>").addClass("col-sm-2").appendTo(paneStartTimeTwo);
			var paneETInput = $("<input/>").attr("id", scheduleNamePinyin + "EndTime").attr("type","text").addClass("col-sm-12").attr("readonly","readonly").attr("data-toggle","popover").attr("data-trigge","manual").appendTo(paneETFour);
		}
		//铲大白状态
		if(schedule == 1 || schedule == 2){
			var paneSpace = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
			var paneStatus = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
			var paneStatusTwo = $("<div></div>").addClass("col-sm-12").appendTo(paneStatus);
			var paneStatusLable = $("<label></label>").addClass("col-sm-1 control-label no-padding-right").attr("for",scheduleNamePinyin + "Status").html(constructionNodes[schedule]  + "状态").appendTo(paneStatusTwo);
			var paaneStatusTh = $("<div></div>").attr("id",scheduleNamePinyin + "Status").addClass("col-sm-6").appendTo(paneStatusTwo);
			var paneSpaceTwo = $("<div></div>").addClass("space-4").appendTo(paneTabForm);
		}
		//工人信息
		var paneWorker = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneWorkerH3 = $("<h3></h3>").addClass("header smaller lighter blue").appendTo(paneWorker);
		var paneWorkerI = $("<i></i>").addClass("icon-edit").appendTo(paneWorkerH3);
		var paneWorkerSpan = $("<span></span>").html("工人信息").appendTo(paneWorkerH3);

		var paneWorkerContent = $("<div></div>").addClass("form-group").appendTo(paneTabForm);
		var paneWorkerInfo = $("<div></div>").addClass("tab-pane in active").attr("id",scheduleNamePinyin + "WorkerInfos").appendTo(paneWorkerContent);
		var paneSpaceTh = $("<div></div>").addClass("space-4").appendTo(paneTabForm);

		//施工图片信息
		var paneDrawing = $("<div></div>").addClass("tab-pane in").attr("id",scheduleNamePinyin + "Drawing").appendTo(paneTabContent);
		var paneDrawingRow = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowOne = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRow);
		var paneDrawingRowTwo = $("<div></div>").addClass("row-fluid").appendTo(paneDrawingRowOne);
		var paneDrawingRowUl = $("<ul></ul>").addClass("ace-thumbnails").attr("id",scheduleNamePinyin + "Gallery").appendTo(paneDrawingRowTwo);

		var paneDrawingRowT = $("<div></div>").addClass("row").appendTo(paneDrawing);
		var paneDrawingRowTOne = $("<div></div>").addClass("hr hr32 hr-dotted").appendTo(paneDrawingRowT);
		var paneDrawingRowTTwo = $("<div></div>").addClass("col-xs-12").appendTo(paneDrawingRowT)
		var paneDrawingRowTh = $("<div></div>").addClass("pull-left inline").appendTo(paneDrawingRowTTwo);
		var paneDrawingRowFour = $("<div></div>").attr("id",scheduleNamePinyin + "Upload").appendTo(paneDrawingRowTh);
		var paneDrawingRowInp = $("<input />").attr("type","text").addClass("hidden").attr("id","picture").appendTo(paneDrawingRowTh);

		//上传按钮
		var paneDrawingBtn = $("<input />").attr("id","select_btn_1").addClass("selectbtn").attr("style","display:none").attr("type","file").attr("name","fileselect[]").attr("multiple","").attr("accept","image/jpeg,image/gif,image/png").appendTo(paneDrawingRowTTwo);
		var paneDrawingA = $("<a></a>").attr("id","file_upload_1-button").attr("href","javascript:void(0)").addClass("uploadify-button btn btn-success").html("上传").appendTo(paneDrawingRowFour);
		var paneDrawingUpDiv = $("<div></div>").attr("id","file_upload_1-queue").addClass("uploadify-queue").attr("style","width: 300px;").appendTo(paneDrawingRowFour);

	}

	function addActive(schedule){
		var con = supervisionDetail.constructionSchedules;
		$.each(con,function(i, v){
			$("#step" + v.schedule).removeClass("active");
			$("#step" +  v.schedule).addClass("step-pane");
		});
		$("#step" + schedule).removeClass("step-pane");
		$("#step" + schedule).addClass("active");
	}
});