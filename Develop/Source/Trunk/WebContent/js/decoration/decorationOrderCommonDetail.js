var decorationOrderDetail = {
	decorationOrderId:null,
	
	initBaseInfo:initBaseInfo,
	customer:{},
	village:{},
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	materialPaymentListGrid: null,
	materialPaymentGridPager: null,
	
	mediaServer:null,
	
	quotations:null,
	quotationDetail:{},
	
	reloadFlag:0,
	decorationOrderQuotationItemData:[]
};

var qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
var scheduleInfos = ["铲大白", "放线", "水力电", "瓦工", "地面找平", "木工", "油工", "水电验收", "保洁"];

var decorationPayment = {
	postParam:{},
	
	items:{},
	basePaymentGrid:null,
	otherPaymentGrid:null,
	otherPaymentPager:null,
	
	editFlag:0,
};

jQuery(function($) {
	
	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;

	decorationOrderDetail.quotationItemListGrid = $("#quotationItemListGrid");
	decorationOrderDetail.quotationItemGridPager = "#quotationItemGridPager";
	decorationOrderDetail.materialPaymentListGrid = $("#materialPaymentListGrid");
	decorationOrderDetail.materialPaymentGridPager = "#materialPaymentGridPager";
	
	decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
	decorationPayment.otherPaymentPager="#otherPaymentGridPager";
	decorationPayment.basePaymentGrid = $("#basePaymentTable");
	
	decorationOrderDetail.activitys = $("#activitys");
	decorationOrderDetail.activityItems = $("#activityItems");
	
	$('#customerInfosBtn').on(ace.click_event, function(){
		$.gritter.add({
			title: '客户敏感信息',
			text: '邮箱 :'+decorationOrderDetail.customer.email+'<br /> QQ:'+decorationOrderDetail.customer.qq+'<br /> 微信:'+decorationOrderDetail.customer.wechat+'<br />  电话 :'+decorationOrderDetail.customer.phone+'<br />  客户类型:'+decorationOrderDetail.customer.relationshipType+'<br /> ',
			class_name: 'gritter-info gritter-center gritter-light'
		});

		return false;
	});
	
	$('#btnBack').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderCommonIndex.url);
	});
	
	initBaseInfo();
});

//-------------------------------------------------------------------------------初始化- initWizard------------------
function initWizard(){
	$('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
//		if(info.step == 1 && $validation) {
//			if(!$('#validation-form').valid()) return false;
//		}
		
		if((info.step == 3 && info.direction ==="previous")||(info.step == 1 && info.direction ==="next")){
			decorationUtils.loadQuotationDetail();
		}
	
		if((info.step == 4 && info.direction ==="previous")||(info.step == 2 && info.direction ==="next")){
			initDecorationPicture();
			initCADPicture();
		}
		
		if ((info.step == 5 && info.direction === "previous") || (info.step == 3 && info.direction === "next")) {
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}
		
		if ((info.step == 6 && info.direction === "previous") || (info.step == 4 && info.direction === "next")) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}
		
		if ((info.step == 8 && info.direction === "previous") || (info.step == 6 && info.direction === "next")) {
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
		
		if((info.step == 7 && info.direction ==="next")){
			constructionScheduleInfoInit();
		}
	}).on('finished', function(e) {
		$("#fl-container").load(api.index.decorationOrderCommonIndex.url);
		
	}).on('stepclick', function(e,info){
		
		if(info.step == 2){
			decorationUtils.loadQuotationDetail();
		}else if(info.step == 3){
			initDecorationPicture();
			initCADPicture();
		}else if(info.step == 4){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if(info.step == 5){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 7){
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}else if(info.step == 8){
			constructionScheduleInfoInit();
		}
	}).on('next', function(e,info){
		
	}).on('previous', function(e,info){
		
	});
}
//--------------------------------------------------------------------基本信息--------------------------------------------------------------
function initBaseInfo(){
	
	var options = {
		"decorationOrder.orderId": decorationOrderDetail.decorationOrderId,
	}
	
	com.post(api.decoration.queryDecorationOrderForCommonByOrderId, options, function(res){
		decorationOrderDetail.mediaServer = window.mediaServer;
		
		if(res.decorationOrder.status == "咨询" || res.decorationOrder.status=="量房" || res.decorationOrder.status=="已报价" || res.decorationOrder.status=="定金"){
			$("#houseType").prop("disabled", false);
		}else{
			if(res.decorationOrder.status == "已签约"){
				$("#houseType").prop("disabled", true);
			}else{
				$("#houseType").prop("disabled", false);
			}
		}
		$("#orderId").val(res.decorationOrder.orderId);
		$("#customer").val(res.decorationOrder.customer.customerName);
		$("#houseAddr").val(res.decorationOrder.village.villageName + res.decorationOrder.houseNumber);
		$("#designDepartment").val(res.decorationOrder.designDepartment);
		$("#designer").val(res.decorationOrder.designer);
		$("#businessDepartment").val(res.decorationOrder.businessDepartment);
		$("#salesman").val(res.decorationOrder.salesman);
		$("#houseType").val(res.decorationOrder.houseType);
		$("#houseClass").val(res.decorationOrder.houseClass);
		$("#houseArea").val(res.decorationOrder.houseArea);
		$("#freeArea").val(res.decorationOrder.freeArea);
		$("#status").val(res.decorationOrder.status);
		$("#createTime").val(res.decorationOrder.createTime);
		//$("#workingDuration").val(res.decorationOrder.workingDuration);
		
		$("#backOrderName").val(res.decorationOrder.backOrderName);
		$("#backOrderPhone").val(res.decorationOrder.backOrderPhone);
		$("#backOrderContent").val(res.decorationOrder.backOrderContent);
		
		$("#notSalesmanName").val(res.decorationOrder.notSalesmanName);
		$("#notSalesmanPhone").val(res.decorationOrder.notSalesmanPhone);
		$("#notSalesmanRate").val(res.decorationOrder.notSalesmanRate);
		$("#notSalesmanContent").val(res.decorationOrder.notSalesmanContent);
		
		$("#salesmanType").val(res.decorationOrder.salesmanType);
		
        decorationOrderDetail.customer.id = res.decorationOrder.customer.id;
		decorationOrderDetail.customer.phone = res.decorationOrder.customer.phone;
		decorationOrderDetail.customer.qq = res.decorationOrder.customer.qq;
		decorationOrderDetail.customer.wechat = res.decorationOrder.customer.wechat;
		decorationOrderDetail.customer.email = res.decorationOrder.customer.email;
		decorationOrderDetail.customer.relationshipType = res.decorationOrder.customer.relationshipType;
		decorationOrderDetail.customer.approveStatus = res.decorationOrder.customer.approveStatus;
		
		if(decorationOrderDetail.customer.approveStatus == 1){
			$(".customerApprovingLabel").show();
		}else{
			$(".customerApprovingLabel").hide();
		}
		
		if(res.decorationOrder.approveStatus == 1){
			$(".villageApprovingLabel").show();
		}else{
			$(".villageApprovingLabel").hide();
		}
		
		$("#orderId").attr("disabled",true);
		$("#customer").attr("disabled",true);
		$("#houseAddr").attr("disabled",true);
		$("#designDepartment").attr("disabled",true);
		$("#designer").attr("disabled",true);
		$("#businessDepartment").attr("disabled",true);
		$("#salesman").attr("disabled",true);
		$("#houseType").attr("disabled",true);
		$("#houseClass").attr("disabled",true);
		$("#houseArea").attr("disabled",true);
		$("#freeArea").attr("disabled",true);
		$("#status").attr("disabled",true);
		$("#createTime").attr("disabled",true);
		$("#houseType").prop("disabled", true);
		$("#houseType").prop("disabled", true);
	});
	
	var options = {
		"quotation.orderId": decorationOrderDetail.decorationOrderId,
	};
	
	//-----初始化报价列表---------------------
	com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function(res){
		if(res.errorCode == 0){
			decorationOrderDetail["quotation.autoId"] = res.quotation.autoId;
		}
	});
	
	decorationUtils.initBasePayment(decorationPayment.postParam, null, "#decorationOrderDetailCommonPageContent");
	decorationUtils.initOtherPayment(decorationPayment.postParam, null, "#decorationOrderDetailCommonPageContent");
	
	//$("#otherPaymentWidget").addClass("collapsed");
	if(decorationOrderDetail.firstInit==undefined || decorationOrderDetail.firstInit == true){
		initWizard();
		decorationOrderDetail.firstInit = false;
	}
}
//--------------------------------------------------------------图纸信息-----------------------
function initDecorationPicture(){
	
	com.post(api.decoration.queryOrderDesignPictureByOrderId, {"orderDesignPicture.orderId":decorationOrderDetail.decorationOrderId}, function(res){
		var html = "";
		var i = 0;
		
		if(res.orderDesignPictures != null && res.orderDesignPictures.length > 0){
			for(i=0;i<res.orderDesignPictures.length;++i){
				html+='<li>';
				html+='<a data-rel="colorbox" href="'+decorationOrderDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'" class="cboxElement" target="_blank">';
				html+='		<img src="'+decorationOrderDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'&divFlag=1&width=200&height=200" alt="200x200" width="200" height="200">';
				html+='</a>';
				
				html+='<div class="tools tools-top">';
				//html+='		<a href="#"><i class="icon-link"></i></a>';
				html+='		<label>'+res.orderDesignPictures[i].uploadFileName+'</label>';
				html+='		<a href="'+decorationOrderDetail.mediaServer + api.common.downloadFile.url + '?downloadFilePath='+res.orderDesignPictures[i].picturePath+'&fileName='+res.orderDesignPictures[i].uploadFileName+'" target="_blank"><i class="icon-download-alt"></i></a>';
				html+='		<a href="javascript:void(0);" onclick="deleteOrderImg('+res.orderDesignPictures[i].autoId+','+decorationOrderDetail.decorationOrderId+')"><i class="icon-remove red"></i></a>';
				html+='</div>';
				html+='</li>';
			}
			$("#designPictures").html(html);
		}else{
			$("#designPictures").html("");
		}
	});
}

function initCADPicture(){
	com.post(api.decoration.queryOrderDesignPictureForCADByOrderId, {"orderDesignPicture.orderId":decorationOrderDetail.decorationOrderId}, function(res){
		var i = 0;
		if(res.orderDesignPictures!=null&& res.orderDesignPictures.length>0){
			var html ="";
			for(i=0;i<res.orderDesignPictures.length;++i){
				html+='<div class="infobox infobox-blue infobox-small infobox-dark">';
				html+='	<div class="infobox-icon">';
				html+=" <a class='icon-download-alt' href='"+decorationOrderDetail.mediaServer + api.common.downloadFile.url + "?downloadFilePath="+res.orderDesignPictures[i].picturePath+"&fileName="+res.orderDesignPictures[i].uploadFileName+"' target='_blank'> <i class=''></i></a>";
				html+='</div>';
	
				html+='	<div class="infobox-data">';
				html+='		<div class="infobox-content">'+res.orderDesignPictures[i].uploadFileName+'</div>';
				//html+='		<div class="infobox-content">$32,000</div>';
				html+='	</div>';
				html+='<a  href="javascript:void(0);" onclick="deleteOrderCAD('+res.orderDesignPictures[i].autoId+','+decorationOrderDetail.decorationOrderId+')" class="badge"><i class="icon-remove red"></i></a>';
				html+='</div>';
			}
			$("#CADProjectPicture").html(html);
		}else{
			$("#CADProjectPicture").html("");
		}
	});
}

function deleteOrderImg(autoId,decorationOrderId){
	bootbox.confirm("确认要删除吗？",function(res){
		if(res ){
			var options = {
				"orderDesignPicture.autoId":autoId,
				"decorationOrderId":decorationOrderId
			};
			com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options,function(res){
				if(res.errorCode == 0){
					com.showAlert(com.info, "操作成功");
					initDecorationPicture();
				}else{
					com.showAlert(com.info, res.errorMsg);
				}
			});
		}
	});
}

function deleteOrderCAD(autoId,decorationOrderId){
	bootbox.confirm("确认要删除吗？",function(res){
		if(res ){
			var options = {
				"orderDesignPicture.autoId":autoId,
				"decorationOrderId":decorationOrderId
			};
			com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options, function(res){
				if(res.errorCode == 0){
					com.showAlert(com.info, "操作成功");
					initCADPicture();
				}else{
					com.showAlert(com.info, res.errorMsg);
				}
			});
		}
	});
}

function downloadFile(picturePath,uploadFileName){
	window.open(decorationOrderDetail.mediaServer + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
	return $('input', cell).val();
}

function constructionScheduleInfoInit(){
	
	var options = {};
	options["constructionSchedule.orderId"] = decorationOrderDetail.decorationOrderId;
	
	com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
		for(var qualityName in qualityIds){
			$("#"+qualityName+"QualityId").val(res.constructionSchedule[qualityName+"QualityName"]);
		}
		
		$("#schedule").val(scheduleInfos[parseInt(res.constructionSchedule.schedule)]);
	});
}