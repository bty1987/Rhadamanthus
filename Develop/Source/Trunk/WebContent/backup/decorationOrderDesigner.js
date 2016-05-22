var order = {
	listGrid: null,
	gridPager: null,
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

jQuery(function($) {
	order.listGrid = $("#listGrid");
	order.gridPager = "#gridPager";
	order.saveBtn = $("#saveBtn").on("click", saveData);
	order.cancelBtn = $("#cancelBtn");
	order.decorationOrderModal = $("#decorationOrderModal");
	order.agreementModal = $("#agreementModal");
	order.drawLineModal = $("#drawLineModal");
	
	decorationUtils.createDecorationOrderCondition(order.listGrid, api.decoration.pageDecorationOrderForDesigner.url, "orderSearchDiv", {}, "decorationOrderDesignerPostData");
	
	initDecorationOrderList();
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
					"decorationContract.quotationDetail.orderId":contract.decorationOrderId,
					"decorationContract.workingDuration":$("#workingDuration").val(),
					"decorationContract.startTime":$("#startTime").val(),
					"decorationContract.endTime":$("#endTime").val(),
					"decorationContract.additionalInfo":$("#additionalInfo").html()
				};
				
				console.log('hetong--', options);
				
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

//---------------------------------------------------------------------------init begin ---------------------------------------------------------

function initDecorationOrderList(){
	order.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForDesigner.url,
		postData: params["decorationOrderDesignerPostData"],
		colNames:['订单编号', '楼盘地址', '客户名', '余额','设计部', '设计师', '业务部', '业务员', '面积', '合同报价', '量房时间', '签单时间', '状态', '操作', 'houseNumber', 'cityP'],
		colModel:[
		    {name:'orderId', width: 70},
			{name:'villageName', jsonmap:'village.villageName', formatter: villageInit, width: 180},
			{name:'customerName', jsonmap:'customer.customerName', width: 50},
			{name:'balance', jsonmap:'customer.balance', width: 35},
			{name:'designDepartment', width: 70},
			{name:'designer', width: 50},
			{name:'businessDepartment', width: 70},
			{name:'salesman', width: 50},
			{name:'houseArea', width: 50},
			{name:'orderTotalPrice', width: 50},
			{name:'createTime', width: 70},
			{name:'contractTime', width: 70},
			{name:'status', width: 50},
			{name:'action', jsonmap:'status', width: 100, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber", hidden:true},
			{name:"cityProperName", jsonmap:"village.cityProper.cityProperName", hidden:true}
		], 
		pager : order.gridPager,
		caption: "装修订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["decorationOrderDesignerPostData"] ? params["decorationOrderDesignerPostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["decorationOrderDesignerPostData"] = _param;
		}
	});

	order.listGrid.navGrid(order.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.village.cityProper.cityProperName+rowdata.village.villageName + ' ' + rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewDecorationOrderDetail(\''+rowdata.orderId+'\');">查看</button>';
	result += '<button  type="button" class="btn btn-minier btn-primary" onclick="viewDecorationQuotateIndex(\''+rowdata.orderId+'\');">报价</button>';
	result += '<button type="button" class="btn btn-minier btn-success" onclick="viewDecorationOrderBackVisitIndex(\''+rowdata.orderId+'\');">回访</button>';
	result += '<button type="button" class="btn btn-minier btn-danger" onclick="modalDrawLineModal(\''+rowdata.orderId+'\');">放线</button>';
	
	if(cellvalue == "已报价" || cellvalue == "定金" || cellvalue == "已签约" || cellvalue == "已完工" || cellvalue == "重签合同"){
		result += '<button type="button" class="btn btn-minier" onclick="modalAgreementModal(\''+rowdata.orderId+'\');">合同</button>';
		if(cellvalue == "已签约" || cellvalue == "已完工"){
			result += '<button type="button" class="btn btn-minier btn-purple" onclick="viewDecorationOrderInDecreaseIndex(\''+rowdata.orderId+'\');">增减项</button>';
		}
	}
	result += '</div>';
	
	return result;
}

function viewDecorationOrderDetail(decorationOrderId){
	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	$("#fl-container").load(api.index.decorationOrderDetailDesignerIndex.url);
}

function viewDecorationQuotateIndex(decorationOrderId){
	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	
	$("#fl-container").load(api.index.quotationIndex.url);
}

function viewDecorationOrderBackVisitIndex(decorationOrderId){
	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	
	$("#decorationOrderPageContent").load(api.index.decorationOrderBackVisitIndex.url);
}

function viewDecorationOrderInDecreaseIndex(decorationOrderId){
	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	
	$("#fl-container").load(api.index.decorationOrderAddOrReduceIndex.url);
}

function modalAgreementModal(decorationOrderId){
	contract.decorationOrderId = decorationOrderId;
	
	$("#printContractBtn").attr('href', api.decoration.decorationContractIndex.url + "?decorationContract.orderId=" + contract.decorationOrderId);
	
	order.agreementModal.modal("show");
}

function modalDrawLineModal(decorationOrderId){
	com.clearValidator();
	
	$("#applayDes").val("");
	$("#applayTime").val("");
	$("#decorationOrderId").val(decorationOrderId);
	
	order.drawLineModal.modal("show");
}

function saveData(){
	
	var url;
	var options = {
		"customer.customerName": order.orderItems.customerName.val(),
		"customer.gender": order.orderItems.gender.value,
		"customer.phone": order.orderItems.phone.val(),
		"customer.qq": order.orderItems.qq.val(),
		"customer.wechat": order.orderItems.wechat.val(),
		"customer.email": order.orderItems.email.val(),
		"customer.address": order.orderItems.address.val(),
		"customer.relationshipType": order.orderItems.relationshipType.val()
	};
	
	if(order.editFlg){
		url = order.editUrl;
	}else{
		url = order.addUrl;
	}
	
	com.post(url, options, successCallback, failCallback);
	
	order.modal.modal("hide");
}

function successCallback(){
	order.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
