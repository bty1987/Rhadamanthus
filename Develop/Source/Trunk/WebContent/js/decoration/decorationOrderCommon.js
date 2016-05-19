var order = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
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
	
	order.agreementModal = $("#agreementModal");
	
	decorationUtils.createDecorationOrderCondition(order.listGrid, api.decoration.pageDecorationOrderForCommon.url, "orderSearchDiv", {}, "");
	
	initDecorationOrderList();
	
	//-----------------------------------合同----------------------------
	$("#additionalInfoBtn").on('click',function(res){
		
		com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
			if(res.decorationContract == null || res.decorationContract.autoId == null){
				$("#workingDuration").val("");
				$("#startTime").val("");
				$("#endTime").val("");
				$("#additionalInfo").html("");
				$("#additionalTermsModal").modal("show");
				$("#printContractBtn").attr("disabled",true);
			}else{
				$("#printContractBtn").attr("disabled",false);
				$("#signContractBtn").attr("disabled",false);
				$("#workingDuration").val(res.decorationContract.workingDuration);
				$("#endTime").datepicker('update',res.decorationContract.endTime);
				$("#startTime").datepicker('update',res.decorationContract.startTime);
				$("#additionalInfo").html(res.decorationContract.additionalInfo);
				$("#additionalTermsModal").modal("show");
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
			{name:'justifycenter', className:'btn-primary'},{name:'justifyright', className:'btn-primary'},{name:'justifyfull', className:'btn-inverse'},null,
			null,null,null,null,null,'foreColor',null,{name:'undo', className:'btn-grey'},
			{name:'redo', className:'btn-grey'}],
		'wysiwyg': {fileUploadError: showErrorAlert}
	}).prev().addClass('wysiwyg-style2');
	
	if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
		var lastResizableImg = null;
		
		function destroyResizable() {
			if(lastResizableImg == null){
				return;
			}
			
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
						
						if( lastResizableImg != null ) {//disable previous resizable image
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
	var msg='';
	if(reason === 'unsupported-file-type') {
		msg = "Unsupported format " + detail; 
	}else{
		console.log("error uploading file", reason, detail);
	}
	$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' + '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
}

//---------------------------------------------------------------------------init begin ---------------------------------------------------------

function initDecorationOrderList(){
	order.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForCommon.url,
		postData: {"filters[0].field":"orderId","filters[0].op":"eq","filters[0].data":"null"},
		colNames:['订单编号', '楼盘地址', '客户名', '余额','设计部', '设计师', '业务部', '业务员', '面积', '合同报价', '折扣', '量房时间', '签单时间', '状态', '操作', 'houseNumber', 'cityP'],
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
			{name:'discount', width: 35},
			{name:'createTime', width: 70},
			{name:'contractTime', width: 70},
			{name:'status', width: 50},
			{name:'action', jsonmap:'status', width: 100, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber", hidden:true},
			{name:"cityProperName", jsonmap:"village.cityProper.cityProperName", hidden:true}
		], 
		pager : order.gridPager,
		caption: "装修订单信息列表"
	});

	order.listGrid.navGrid(order.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewDecorationOrderDetail(\'' + rowdata.orderId + '\');">查看</button>';
	
	if(cellvalue == "已签约"||cellvalue == "已完工"){
		result += '<button type="button" class="btn btn-minier" onclick="modalAgreementModal(\'' + rowdata.orderId + '\');">合同</button>';
	}
	result += '</div>';
	
	return result;
}


function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.village.cityProper.cityProperName+rowdata.village.villageName + ' '+rowdata.houseNumber;
	return html;
}

function viewDecorationOrderDetail(decorationOrderId){
	
	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	
	$("#fl-container").load(api.index.decorationOrderDetailCommonIndex.url);
}

function modalAgreementModal(decorationOrderId){
	contract.decorationOrderId = decorationOrderId;
	
	com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
		if(res.decorationContract==null || res.decorationContract.autoId == null){
			$("#printContractBtn").attr("disabled",true);
		}else{
			$("#printContractBtn").attr("disabled",false);
		}
		order.agreementModal.modal("show");
	});
	
	$("#printContractBtn").attr('href', api.decoration.decorationContractIndex.url + "?decorationContract.orderId=" + contract.decorationOrderId);
}

function successCallback(){
	order.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
