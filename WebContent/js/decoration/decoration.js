
$(function(){

	var order = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        orderItems: {},
        type: {0: "半包", 1: "套餐", 2: "半价"},

        orderStatus: [],
        businessDepartments: [],
        postParam: {},

        editFlag: false,
        projectStatusArr: {
			0: '初始',
			1: '开工',
			2: '已完工'
		}
	};

	order.cancelBtn = $("#cancelBtn");
	order.decorationModal = $("#decorationModal");
	order.agreementModal = $("#agreementModal");
	order.drawLineModal = $("#drawLineModal");
	order.refundContractModal = $("#refundContractModal");
	order.customerInfoModal = $("#customerInfoModal");

	var contract = {
		decorationOrderId:null
	};

	var decorationAdvance = {
		items: {}
	};

	decorationAdvance.items.customerName = $('#customerName');
	decorationAdvance.items.phone = $('#phone');

	var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

	$("#applayDrawLineBtn").on("click",function(){
		if(com.validate("drawLineModal")){
			return;
		}
		bootbox.confirm("确认申请放线吗?", function(res){
			if(res){
				var options ={
					"drawLine.applayDes":$("#applayDes").val(),
					"drawLine.applayTime":$("#applayTime").val()+" 00:00:00",
					"drawLine.orderId":$("#decorationOrderId").val(),
				};

				com.post(api.drawline.applayDrawLine, options);
			}
			
			order.drawLineModal.modal("hide");
		});
	});

	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});

	$("#additionalInfoBtn").on('click',function(res){

		com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
			if(res.decorationContract == null || res.decorationContract.autoId == null){
				$("#workingDuration").val(0);
				$("#startTime").val("");
				$("#endTime").val("");
				$("#additionalInfo").html("");
				$("#additionalTermsModal").modal("show");
			}else{
				$("#workingDuration").val(res.decorationContract.workingDuration);
				$("#startTime").datepicker('update',res.decorationContract.startTime);
				$("#endTime").datepicker('update',res.decorationContract.endTime);
				$("#additionalInfo").html(res.decorationContract.additionalInfo);
				$("#additionalTermsModal").modal("show");
			}
		});
	});

	$("#saveAdditionalInfoBtn").on('click',function(res){
		if(com.validate("additionalTermsModal")){
			return;
		}

		bootbox.confirm("确认要保存合同信息吗?",function(result){
			if(result){
				var options ={
					"decorationContract.orderId":contract.decorationOrderId,
					"decorationContract.workingDuration":$("#workingDuration").val(),
					"decorationContract.additionalInfo":$("#additionalInfo").html()
				};
				
				$("#startTime").val() && (options["decorationContract.startTime"] = $("#startTime").val()+" 00:00:00");
				$("#endTime").val() && (options["decorationContract.endTime"] = $("#endTime").val()+" 00:00:00");
				
				com.post(api.decoration.saveDecorationContract, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "保存成功");
					}
				});

				$("#additionalTermsModal").modal("hide");
			}
		});
	});

	$("#refundContractBtn").on("click", function(){
		if(com.validate("refundContractModal")){
			return;
		}
		var refundValue = $("#refundValue").val();

		var options = {
			"decoration.orderId": params["decoration.orderId"],
			"refundValue": refundValue,
			"paymentValue": order.paymentValue,
		};

		if(refundValue > order.paymentValue){
			bootbox.confirm("请注意:退款金额大于已付款金额!", function(result) {
				if(result){
					com.post(api.decoration.terminalDecoration, options, function(res){
						com.showAlert(com.info, "申请成功");
						searcher.doSearch();
						$("#" + params["decoration.rowId"] + "_terminalBtn").css("display", "none");
					});
				}
			});
		}else {
			com.post(api.decoration.terminalDecoration, options, function(res){
				com.showAlert(com.info, "申请成功");
				searcher.doSearch();
				$("#" + params["decoration.rowId"] + "_terminalBtn").css("display", "none");
			});
		}

		order.refundContractModal.modal("hide");
	});

	$("#customerInfoBtn").on("click", function() {
		if(com.validate()){
			return;
		}

		var cId = params["customer.customerId"];

		var options = {
			"customer.cid": cId,
			"customer.name": $("#customerName").val(),
			"customer.phone": $("#phone").val(),
			"decorationContract.orderId": params["decoration.orderId"],
		}

		com.post(api.data.checkCustomerForPhone, {"customerPhone.phone": $("#phone").val(),
			"customerPhone.status": 0}, function(res){

			if(res.customer.cid != cId){
				com.showAlert(com.error, "客户电话已经存在");
				return false;
			}

		}, function () {
			return;
		}, false);

		com.post(api.quotation.queryQuotationForDefaultByOrderId,{"quotation.orderId":params["decoration.orderId"]},function (res) {
			if(utils.accSub($("#customerInfoDialog").attr("totalPrice"), res.quotation.totalPrice) > 100){
				bootbox.confirm("合同金额与报价金额相差大于100，确认签单？", function(yes) {
					if(yes){
						com.post(api.decoration.signDecorationContract, options, function(res){
							searcher.doSearch();
						}, null, false);
						order.customerInfoModal.modal("hide");
					}
				});
			}else {
				com.post(api.decoration.signDecorationContract, options, function(res){
					searcher.doSearch();
				}, null, false);
				order.customerInfoModal.modal("hide");
			}
		},function () {
			com.showAlert(com.error,"报价不存在")
			return;
		},false)


	});

	initializeContent();

	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});

    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes,function(i,v){
            order.projectStatusArr[v.cnid] = v.name;
        })
    }, null, false);

	/**
	 * 回调函数比速提供 init(tableId, result.list)方法
	 * tableId ,用来显示的div的id
	 * result.list 列表的json数组
	 * */
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
					var btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
					var btnLine = $('<a></a>').addClass('btn btn-minier btn-warning').html('放线');
					var btnContract = $('<a></a>').addClass('btn btn-minier btn-inverse').html('合同');
					var btnScal = $('<a></a>').addClass('btn btn-minier btn-danger').html('扣款');
					var btnPrice = $('<a></a>').addClass('btn btn-minier btn-pink').html('报价');
					var btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-purple').html('增减项');
					var btnExtension = $('<a></a>').addClass('btn btn-minier btn-yellow').html('扩展项');
					var btnInfo = $('<a></a>').addClass('btn btn-minier btn-success').html('信息轴');
					var btnCal = $('<a></a>').addClass('btn btn-minier btn-warning').html('决算');
					var btnActivity = $('<a></a>').addClass('btn btn-minier btn-inverse').html('活动物品');
					var btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('废单');
					var btnSign = $('<a></a>').addClass('btn btn-minier btn-pink').html('签订合同');
					var btnTerminal = $('<a></a>').addClass('btn btn-minier btn-purple').html('合同终止');
					var btnResign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重签合同');

					var propertyArr = [];
					$.each(pageConfig.propertyArr,function (pi,pv) {
						switch (pv){
							case "楼盘地址":
								propertyArr.push(["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"]);
								break;
							case "客户名":
								propertyArr.push(["客户名:", v.customer.name, "grey"]);
								break;
							case "设计部":
								propertyArr.push(["设计部:", v.designer.dept.deptName, "grey"]);
								break;
							case "设计师":
								propertyArr.push(["设计师:", v.designer.userName, "grey"]);
								break;
							case "业务部":
								propertyArr.push(["业务部:", v.salesman.dept.deptName, "grey"]);
								break;
							case "业务员":
								propertyArr.push(["业务员:", v.salesman.userName, "grey"]);
								break;
							case "面积":
								propertyArr.push(["面积:", v.house.buildArea, "blue"]);
								break;
							case "折扣":
								propertyArr.push(["折扣:", com.checkNull(v.discount,10), "blue"]);
								break;
							case "签单额":
								propertyArr.push(["签单额:", v.orderTotalPrice, "grey"]);
								break;
							case "报价金额":
								propertyArr.push(["报价金额:", v.quotationPrice, "grey"]);
								break;
							case "量房时间":
								propertyArr.push(["量房时间:", v.measureTime, "green"]);
								break;
							case "签单时间":
								propertyArr.push(["签单时间:", v.contractTime, "green"]);
								break;
							case "定金时间":
								propertyArr.push(["定金时间:", v.depositTime, "green"]);
								break;
							case "类型":
								propertyArr.push(["类型:", order.type[v.type], "red"]);
								break;
							case "状态":
								propertyArr.push(["状态:", v.status, "red"]);
								break;
							case "工程状态":
								propertyArr.push(["工程状态:", order.projectStatusArr[v.projectStatus], "red"]);
								break;
						}
					});

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					btnView.click(function(){
						viewdecorationDetail(v.orderId, v.type, v.version.versionId, v.notSalesmanRate, v.status);
					});
					
					btnPrice.click(function(){
						viewDecorationQuotateIndex(v.orderId, v.type);
					});
					
					btnRevie.click(function(){
						viewdecorationBackVisitIndex(v.orderId);
					});
					
					btnLine.click(function(){
						modalDrawLineModal(v.orderId);
					});

					btnContract.click(function(){
						modalAgreementModal(v.orderId);
					});
					
					btnAddMinus.click(function(){
						viewdecorationInDecreaseIndex(v.orderId, v.type);
					});
					
					btnInfo.click(function(){
						viewdecorationTimelineIndex(v.orderId);
					});

					btnScal.click(function(){
						viewdecorationInAudit(v.orderId);
					});

					btnExtension.click(function(){
						viewExtension(v.orderId);
					});

					btnCal.click(function(){
						viewDecorationFinalSettlement(v.orderId, v.type);
					});

					btnActivity.click(function(){
						viewDecorationActivityItem(v.orderId);
					});

					btnDelete.click(function(){
						obsoleteOrder(v.orderId);
					});

					btnSign.click(function(){
						signOrder(v.orderId,v.customer.cid,v.orderTotalPrice);
					});

					btnTerminal.click(function(){
						terminalOrder(v.orderId);
					});

					btnResign.click(function(){
						resignOrder(v.orderId);
					});
					
					$.each(pageConfig.pageBtn,function (k,b) {
						switch (b){
							case "view":
								$divBtnWrap.append(btnView);
								break;
							case "revie":
								$divBtnWrap.append(btnRevie);
								break;
							case "line":
								$divBtnWrap.append(btnLine);
								break;
							case "contract":
								if(["定金", "已报价", "已签约", "重签合同", "已完工"].indexOf(v.status) != -1){
									$divBtnWrap.append(btnContract);
								}
								break;
							case "scal":
								$divBtnWrap.append(btnScal);
								break;
							case "price":
								if(["初始", "定金", "已报价", "重签合同"].indexOf(v.status) != -1){
									$divBtnWrap.append(btnPrice);
								}
								break;
							case "addminus":
								if(["已签约", "已完工"].indexOf(v.status) != -1){
									$divBtnWrap.append(btnAddMinus);
								}
								break;
							case "extension":
								if([ "定金", "已报价", "重签合同","已签约", "已完工"].indexOf(v.status) != -1){
									$divBtnWrap.append(btnExtension);
								}
								break;
							case "info":
								$divBtnWrap.append(btnInfo);
								break;
							case "cal":
								if(["已签约", "已完工"].indexOf(v.status) != -1 && v.type == 2){
									$divBtnWrap.append(btnCal);
								}
								break;
							case "activity":
								$divBtnWrap.append(btnActivity);
								break;
							case "delete":
								if(v.status != "已签约" && v.status != "合同终止" && v.status != "废单"){
									$divBtnWrap.append(btnDelete);
								}
								break;
							case "sign":
								if(v.status == "定金" || v.status == "重签合同"){
									$divBtnWrap.append(btnSign);
								}
								break;
							case "terminal":
								if(v.status == "已签约"){
									$divBtnWrap.append(btnTerminal);
								}
								break;
							case "resign":
								if(v.status == "已签约"){
									$divBtnWrap.append(btnResign);
								}
								break;
						}
					});
					$divBtnWrap.appendTo($h3);
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		//查看
		var viewdecorationDetail = function (decorationOrderId, type, versionId, notSalesmanRate, status){
			params["decorationOrderId"] = decorationOrderId;
			params["orderType"] = type;
			params["versionId"] = versionId;
			params["notSalesmanRate"] = notSalesmanRate;
			params["orederStatus"] = status;
			params["viewNode"] = pageConfig.nodes;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.decorationDetailIndex.url);
		}
		//报价
		var viewDecorationQuotateIndex = function (decorationOrderId, type){
			params["decorationOrderId"] = decorationOrderId;
			params["orderType"] = type;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.quotationIndex.url);
		}
		//回访
		var viewdecorationBackVisitIndex = function (decorationOrderId){
			params["decorationOrderId"] = decorationOrderId;
			params.historyPage = api.index.decorationIndex.url;
			$("#decorationPageContent").load(api.index.backVisitIndex.url);
		}
		//放线
		var modalDrawLineModal = function (decorationOrderId,company){
			com.clearValidator();

			$("#applayDes").val("");
			$("#applayTime").val("");
			$("#decorationOrderId").val(decorationOrderId);
			order.drawLineModal.modal("show");
		}
		//合同
		var modalAgreementModal = function (decorationOrderId){
			contract.decorationOrderId = decorationOrderId;

			com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){

				var decorationContract = res.decorationContract;
				
	    		if(res.decorationContract == null || res.decorationContract.autoId == null){
	    			$("#printContractBtn").attr("disabled",true);
	    		}else{
	    			$("#printContractBtn").attr("disabled",false).off("click").on("click",function () {
						params.orderId = contract.decorationOrderId;
						com.popup("打印合同",'/views/contract/' + res.decorationContract.templateHtml ,null,null,true)
					});
	    		}

	    		order.agreementModal.modal("show");
	    	});
		}
		//增减项
		var viewdecorationInDecreaseIndex = function (decorationOrderId, type){
			params.decorationOrderId = decorationOrderId;
			params.decorationType = type;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.addReduceIndex.url);
		}
		//扣款
		var viewdecorationInAudit = function(orderId){
			params['decorationOrderId'] = orderId;
			params['auditStatusType'] = 'select';
			params['historyPage'] = api.index.decorationIndex.url;
			com.switchPage(api.index.auditRecordIndex.url);
		}
		//时间轴
		var viewdecorationTimelineIndex = function(orderId){
			params.decorationOrderId = orderId;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.decorationTimelineIndex.url);
		}
		//扩展项
		var viewExtension = function (decorationOrderId){
			params.decorationOrderId = decorationOrderId;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.extensionIndex.url);
		}
		//决算
		function viewDecorationFinalSettlement(decorationOrderId,type){
			params.decorationOrderId = decorationOrderId;
			params.type = type;
			params.historyPage = api.index.decorationIndex.url;
			com.switchPage(api.index.decorationFinalSettlementIndex.url);
		}
		//活动物品
		function viewDecorationActivityItem(decorationOrderId){
			params.decorationOrderId = decorationOrderId;
			com.switchPage(api.index.decorationActivityItemIndex.url);
		}
		//废单
		function obsoleteOrder(orderId){
			params["decoration.orderId"] = orderId;

			bootbox.confirm("确认要废单吗?", function(result){
				if(result){
					com.post(api.decoration.obsoleteDecoration, {"decoration.orderId":orderId}, function(res){
						com.showAlert(com.info, "操作成功");
						searcher.doSearch();
					});
				}
			});
		}
		//签订合同
		function signOrder(orderId, customerId, orderTotalPrice){
			// params["decoration.orderId"] = orderId;
			// params["customer.customerId"] = customerId;
			// $("#customerInfoDialog").attr("totalPrice",orderTotalPrice);

			// com.cleanItems(decorationAdvance.items);
            //
			// order.customerInfoModal.modal("show");

			var cId = params["customer.customerId"];

			var options = {
				"decorationContract.orderId": orderId,
			}

			com.post(api.quotation.queryQuotationForDefaultByOrderId,{"quotation.orderId":orderId},function (res) {

				if(res.quotation.qid == null){
					com.showAlert(com.error,"报价不存在")
					return;
				}

				if(utils.accSub(orderTotalPrice, res.quotation.totalPrice) > 100){
					bootbox.confirm("合同金额与报价金额相差大于100，确认签单？", function(yes) {
						if(yes){
							com.post(api.decoration.signDecorationContract, options, function(res){
								searcher.doSearch();
							}, null, false);
						}
					});
				}else {
					com.post(api.decoration.signDecorationContract, options, function(res){
						searcher.doSearch();
					}, null, false);
				}
			},function () {
				com.showAlert(com.error,"报价不存在")
				return;
			},false)

		}
		//合同终止
		function terminalOrder(decorationOrderId, rowId){

			params["decoration.orderId"] = decorationOrderId;
			params["decoration.rowId"] = rowId;

			com.post(api.payment.queryDecorationPaymentForContractByOrderId, {"decorationPayment.decoration.orderId":decorationOrderId}, function(res){

				var refundValue = 0;
				var decorationPaymentInfo = "";
				var decorationPayments = res.decorationPayments;

				for(var i=0;i<decorationPayments.length;i++){

					var decorationPayment = decorationPayments[i];
					var paymentType = decorationPayment.paymentType;
					var paymentStatus = decorationPayment.paymentStatus;
					var referMoney = decorationPayment.referMoney;

					if(paymentStatus == "已付款" || paymentStatus == "已确认"){
						decorationPaymentInfo += paymentType + ":" + referMoney + "<br/>";
						refundValue = utils.accAdd(refundValue, referMoney);
					}
				}

				if(decorationPaymentInfo == ""){
					decorationPaymentInfo == "无付款信息";
				}

				$("#decorationPaymentInfo").html(decorationPaymentInfo);
				$("#refundValue").val(refundValue);
				$("#paymentValue").val(refundValue);
				order.paymentValue = refundValue;

				com.clearValidator();

				order.refundContractModal.modal("show");
			});
		}
		//重签合同
		function resignOrder(decorationOrderId, rowId){
			params["decoration.orderId"] = decorationOrderId;
			params["decoration.rowId"] = rowId;

			bootbox.confirm("确认要重签合同吗?", function(result){
				if(result){
					com.post(api.decoration.resignDecorationContract, {"decorationContract.orderId": decorationOrderId}, function(res){
						com.showAlert(com.info, "操作成功");
						searcher.doSearch();
					});
				}
			});
		}

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();

	var searcher = new Searcher();

	searcher.init( pageConfig.condArr, "condList", pageConfig.apiPage, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", pageConfig.postDataName, null, false, null, function() {
		if (pageConfig.hasExport) {
			var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
			var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
			var $impspan = $('<span></span>').text('导出').appendTo($impa);

			return [$impa];
		}
    });
	
	$('a[name="import"]', '#pagenation').click(function(){
		
		if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
		
		if($('span[name="totalRecords"]').text() > 200){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(pageConfig.apiPage, $.extend({}, params[pageConfig.postDataName], {"paging.noPage": 1}), function(res){

			$.exceler({
				column : pageConfig.column,
				list: res.paging.data,
			});
		});
    });

	//-----------------------------------------------------合同-----------------------------------------
	function initializeContent(){
		$('#additionalInfo').ace_wysiwyg({
			toolbar:['font', null, 'fontSize', null, {name:'bold', className:'btn-info'}, {name:'italic', className:'btn-info'}, {name:'strikethrough', className:'btn-info'},
				{name:'underline', className:'btn-info'}, null,{name:'insertunorderedlist', className:'btn-success'},{name:'insertorderedlist', className:'btn-success'},
				{name:'outdent', className:'btn-purple'},{name:'indent', className:'btn-purple'},null,{name:'justifyleft', className:'btn-primary'},
				{name:'justifycenter', className:'btn-primary'}, {name:'justifyright', className:'btn-primary'}, {name:'justifyfull', className:'btn-inverse'}, null,
				null,null,null,null,null,'foreColor',null,{name:'undo', className:'btn-grey'},
				{name:'redo', className:'btn-grey'}],
			'wysiwyg': {fileUploadError: showErrorAlert}
		}).prev().addClass('wysiwyg-style2');

		if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
			var lastResizableImg = null;
			function destroyResizable() {
				if(lastResizableImg == null) return;
				lastResizableImg.resizable( "destroy" );
				lastResizableImg.removeData('resizable');
				lastResizableImg = null;
			}
			var enableImageResize = function() {
				$('.wysiwyg-editor').on('mousedown', function(e) {
					var target = $(e.target);
					if(e.target instanceof HTMLImageElement) {
						if(!target.data('resizable')) {
							target.resizable({
								aspectRatio: e.target.width / e.target.height
							});
							target.data('resizable', true);

							if( lastResizableImg != null ) { // disable previous resizable image
								lastResizableImg.resizable( "destroy" );
								lastResizableImg.removeData('resizable');
							}
							lastResizableImg = target;
						}
					}
				}).on('click', function(e) {
					if( lastResizableImg != null && !(e.target instanceof HTMLImageElement) ) {
						destroyResizable();
					}
				}).on('keydown', function() {
					destroyResizable();
				});
			};
			enableImageResize();
		}
	}

	function showErrorAlert (reason, detail) {
		var msg = '';
		if (reason === 'unsupported-file-type') {
			msg = "Unsupported format " + detail;
		}
		$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
	}

});


