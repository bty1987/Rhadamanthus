var order = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	orderItems: {},

	orderStatus: [],
	businessDepartments:[],
	postParam:{},

	editFlag: false
};

var contract = {
	decorationOrderId:null,
};

var decorationOrderPostData = {};

$(function(){

	order.cancelBtn = $("#cancelBtn");
	order.decorationOrderModal = $("#decorationOrderModal");
	order.agreementModal = $("#agreementModal");
	order.drawLineModal = $("#drawLineModal");

	//--------------------------------放线申请 ---------------------
	$("#applayDrawLineBtn").on("click",function(){
		if(com.validate("drawLineModal")){
			return;
		}
		bootbox.confirm("确认申请放线吗？", function(res){
			if(res){
				var options ={
					"drawLine.applayDes":$("#applayDes").val(),
					"drawLine.applayTime":$("#applayTime").val(),
					"drawLine.orderId":$("#decorationOrderId").val()
				};

				com.post(api.construction.applayDecorationOrderDrawLine, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "申请成功");
						$.jgrid.refreshGrid(order.listGrid, order.postParam);
					}
				});
				order.drawLineModal.modal("hide");
			}else{
				order.drawLineModal.modal("hide");
			}
		});
	});

	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});

	//-----------------------------------合同----------------------------
	$("#additionalInfoBtn").on('click',function(res){

		com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
			if(res.decorationContract == null || res.decorationContract.autoId == null){
				$("#workingDuration").val("");
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

		bootbox.confirm("确认要保存合同信息吗？",function(result){
			if(result){
				var options ={
					"decorationContract.orderId":contract.decorationOrderId,
					"decorationContract.workingDuration":$("#workingDuration").val(),
					"decorationContract.startTime":$("#startTime").val(),
					"decorationContract.endTime":$("#endTime").val(),
					"decorationContract.additionalInfo":$("#additionalInfo").html()
				};

				com.post(api.decoration.saveDecorationContract, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "保存成功");
					}
				});

				$("#additionalTermsModal").modal("hide");
			}
		});
	});

	initializeContent();

	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});


	/**
	 * 回调函数比速提供 init(tableId, result.list)方法
	 * tableId ，用来显示的div的id
	 * result.list 列表的json数组
	 * */
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<b></b>').html(v.orderId));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnView = $('<a></a>').addClass('btn btn-minier btn-primary').html('查看');
					var $btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
					var $btnLine = $('<a></a>').addClass('btn btn-minier btn-warning').html('放线');
					var $btnContract = $('<a></a>').addClass('btn btn-minier btn-danger').html('合同');
					var $btnPrice = $('<a></a>').addClass('btn btn-minier btn-default').html('报价');
					var $btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-purple').html('增减项');
					
					var propertyArr = [
						["楼盘地址:", v.village.cityProper.cityProperName + v.village.villageName + " " + v.houseNumber, "grey"],
						["客户名:", v.customer.customerName, "grey"],
						["余额:", v.freeArea, "grey"],
						["设计部:", v.designDepartment, "grey"],
						["设计师:", v.designer, "grey"],
						["业务部:", v.businessDepartment, "grey"],
						["业务员:", v.salesman, "grey"],
						["面积:", v.houseArea, "grey"],
						["合同报价:", v.orderTotalPrice, "grey"],
						["量房时间:", v.createTime, "grey"],
						["状态:", v.status, "red"]
					];

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					$btnView.click(function(){
						viewDecorationOrderDetail(v.orderId+"");
					});
					$btnPrice.click(function(){
						viewDecorationQuotateIndex(v.orderId+"");
					});
					$btnRevie.click(function(){
						viewDecorationOrderBackVisitIndex(v.orderId+"");
					});
					$btnLine.click(function(){
						modalDrawLineModal(v.orderId+"");
					});

					$btnContract.click(function(){
						modalAgreementModal(v.orderId+"");
					});
					$btnAddMinus.click(function(){
						viewDecorationOrderInDecreaseIndex(v.orderId+"");
					});

					$divBtnWrap.append($btnView).append($btnRevie).append($btnLine).appendTo($h3);
					
					if(["量房", "咨询", "定金", "已报价", "重签合同"].indexOf(v.status) != -1){
						$divBtnWrap.append($btnPrice);
					}
					
					if(["定金", "已报价", "已签约", "重签合同", "已完工"].indexOf(v.status) != -1){
						$divBtnWrap.append($btnContract);
					}
					
					if(["已签约", "已完工"].indexOf(v.status) != -1){
						$divBtnWrap.append($btnAddMinus);
					}

					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		//查看
		var viewDecorationOrderDetail = function (decorationOrderId){
			decorationOrderPostData["decorationOrderId"] = decorationOrderId;
			com.switchPage(api.index.decorationOrderDesignerDetailIndex.url);
		}
		//报价
		var viewDecorationQuotateIndex = function (decorationOrderId){
			decorationOrderPostData["decorationOrderId"] = decorationOrderId;
			com.switchPage(api.index.quotationIndex.url);
		}
		//回访
		var viewDecorationOrderBackVisitIndex = function (decorationOrderId){
			decorationOrderPostData["decorationOrderId"] = decorationOrderId;
			params.historyOrderPage = api.index.decorationOrderDesignerIndex.url;
			$("#decorationOrderPageContent").load(api.index.backVisitIndex.url);
		}
		//放线
		var modalDrawLineModal = function (decorationOrderId){
			com.clearValidator();

			$("#applayDes").val("");
			$("#applayTime").val("");
			$("#decorationOrderId").val(decorationOrderId);

			order.drawLineModal.modal("show");
		}
		//合同
		var modalAgreementModal = function (decorationOrderId){
			contract.decorationOrderId = decorationOrderId;

			$("#printContractBtn").attr('href', api.decoration.decorationContractIndex.url + "?decorationContract.orderId=" + contract.decorationOrderId);

			order.agreementModal.modal("show");
		}
		//增减项
		var viewDecorationOrderInDecreaseIndex = function (decorationOrderId){
			params.decorationOrderId = decorationOrderId;
			com.switchPage(api.index.addReduceIndex.url);
		}

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();

	var _condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'customerPhone', 'designer', 'salesman'];

	com.post(api.decoration.queryDecorationOrderForCondition, {}, function(res){
		var condition = res.condition;

		if((condition & 4) == 4){ // 设计中心
			_condArr.push('designerRegionId');

		}
		if((condition & 8) == 8){ // 设计部
			_condArr.push('designerDepartmentId');

		}
		if((condition & 16) == 16){ // 业务中心
			_condArr.push('salesmanRegionId');

		}
		if((condition & 32) == 32){ // 业务部
			_condArr.push('salesmanDepartmentId');

		}
		if((condition & 64) == 64){ // 量尺时间
			_condArr.push('createTimeDateRange');

		}
		if((condition & 128) == 128){ // 签单时间
			_condArr.push('signTimeDateRange');

		}
	}, null, false);

	_condArr.push('houseClass');
	_condArr.push('status');

	var decorationOrderDesignerSeacher = new Searcher();

	decorationOrderDesignerSeacher.init( _condArr, "condList", api.decoration.pageDecorationOrderForDesigner, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationOrderDesignerPostData");
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
	}else{
		console.log("error uploading file", reason, detail);
	}
	$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
}
