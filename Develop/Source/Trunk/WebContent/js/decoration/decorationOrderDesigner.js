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
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
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
						["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
						["客户名:", v.customer.customerName, "grey"],
						["余额:", v.customer.balance, "blue"],
						["设计部:", v.designDepartment, "grey"],
						["设计师:", v.designer, "grey"],
						["业务部:", v.businessDepartment, "grey"],
						["业务员:", v.salesman, "grey"],
						["面积:", v.houseArea, "blue"],
						["合同报价:", v.orderTotalPrice, "grey"],
						["量房时间:", v.createTime, "grey"],
						["签单时间:", v.contractTime, "grey"],
						["类型:", v.type == 0 ? '半包' : '全包', "red"],
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
						viewDecorationQuotateIndex(v.orderId+"", v.type);
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
		var viewDecorationQuotateIndex = function (decorationOrderId, type){
			decorationOrderPostData["decorationOrderId"] = decorationOrderId;
			decorationOrderPostData["decorationOrderType"] = type;
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
			
			com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
				
				var decorationContract = res.decorationContract;
				
	    		if(res.decorationContract == null || res.decorationContract.autoId == null){
	    			$("#printContractBtn").attr("disabled",true);
	    		}else{
	    			$("#printContractBtn").attr("disabled",false).attr('href', '/views/contract/' + res.decorationContract.templateHtml + "?decorationContract.orderId=" + contract.decorationOrderId + "&time=" + params.loginTime);
	    		}
	    		
	    		order.agreementModal.modal("show");
	    	});
		}
		//增减项
		var viewDecorationOrderInDecreaseIndex = function (decorationOrderId){
			params.decorationOrderId = decorationOrderId;
			params.historyOrderPage = api.index.decorationOrderDesignerIndex.url;
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

	var searcher = new Searcher();

	searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForDesigner, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationOrderDesignerPostData", null, false, null, function(){
    	
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
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
		
		com.post(api.decoration.pageDecorationOrderForDesigner, $.extend({}, params.decorationOrderDesignerPostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["订单编号","orderId"],
					['楼盘地址',['village.villageName', 'houseNumber']],
					['客户名','customer.customerName'],
					['设计部','designDepartment'],
					['设计师', 'designer'],
					['业务部', 'businessDepartment'],
					['业务员', 'salesman'],
					['面积', 'houseArea'],
					['合同报价', 'orderTotalPrice'],
					['量房时间', 'createTime'],
					['签单时间', 'contractTime'],
					['状态', 'status'],
				],
				list: res.paging.data,
			});
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
	}else{
		console.log("error uploading file", reason, detail);
	}
	$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
}
