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
	quotationDetail:null,
	
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
			loadQuotationDetail(decorationOrderDetail["quotation.autoId"]);
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
			loadQuotationDetail(decorationOrderDetail["quotation.autoId"]);
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

function calQuotationDetailSum(){
	var temQuotationDetail = decorationOrderDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	var totalPrice = 0;//总价
	var discountPrice = 0;//打折
	var noDiscountTotalPrice = 0;//不打折
	var carManagePrice = 0;//车运费
	var managePrice = 0;//管理费
	
	var carManageFunctionAreaIndex = -1;
	var manageFunctionAreaIndex = -1;
	var carManageItemIndex = -1;
	var manageItemIndex = -1;
	
	decorationOrderDetail.quotationDetail.manageRate =  0;
	decorationOrderDetail.quotationDetail.carManageRate = 0;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		functionAreas[i].sum = 0;
		if(functionAreas[i].functionAreaType == '普通'){//参与打折
			var sum = 0;
			
			for(var j=0;j<functionAreas[i].items.length;j++){
				functionAreas[i].items[j].discountUnitPrice = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail.quotationDetail.discount/10)*100)/100;
				functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail.quotationDetail.discount*parseFloat(functionAreas[i].items[j].num)/10)*100)/100;
				sum+=functionAreas[i].items[j].sum;
				
			}
			functionAreas[i].sum = sum;
			discountPrice += sum;
			totalPrice+=sum;
			
		}else {
			var sum = 0;
			for(var j=0;j<functionAreas[i].items.length;j++){
				
				if(/*functionAreas[i].items[j].customFlag == 1 
						||*/((functionAreas[i].items[j].itemName.search('车运费')==-1) && (functionAreas[i].items[j].itemName.search('管理费')==-1))){//不打折
					
					functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*parseFloat(functionAreas[i].items[j].num))*100)/100;
					sum+=functionAreas[i].items[j].sum;
				}else if((functionAreas[i].items[j].itemName.search('车运费')!=-1)){
					decorationOrderDetail.quotationDetail.carManageRate = functionAreas[i].items[j].unitPrice;
					carManageFunctionAreaIndex = i;
					carManageItemIndex = j;
				}else if((functionAreas[i].items[j].itemName.search('管理费')!=-1)){
					functionAreas[i].items[j].unitPrice = parseFloat(functionAreas[i].items[j].unitPrice)+parseFloat(decorationOrderDetail.quotationDetail.notSalesmanRate);
					decorationOrderDetail.quotationDetail.manageRate = functionAreas[i].items[j].unitPrice;
					manageFunctionAreaIndex = i;
					manageItemIndex = j;
				}
				functionAreas[i].items[j].discountUnitPrice =  Math.round(parseFloat(functionAreas[i].items[j].unitPrice)*100)/100;
			}
			functionAreas[i].sum = sum;
			noDiscountTotalPrice += sum;
			totalPrice+=sum;
		}
		
	}
	
	var commonPrice = discountPrice + noDiscountTotalPrice;
	carManagePrice = Math.round(((commonPrice)*parseFloat(decorationOrderDetail.quotationDetail.carManageRate))*100)/100;
	if( parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice) > carManagePrice){
		carManagePrice =  Math.round(parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice)*100)/100;
	}
	
	if(carManageFunctionAreaIndex!=-1){
		commonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum +=carManagePrice;
		functionAreas[carManageFunctionAreaIndex].items[carManageItemIndex].sum =carManagePrice;
		totalPrice+=carManagePrice;
	}
	
	managePrice = Math.round(((commonPrice)*parseFloat(decorationOrderDetail.quotationDetail.manageRate))*100)/100;

	if(manageFunctionAreaIndex!=-1){
		functionAreas[manageFunctionAreaIndex].sum +=managePrice;
		functionAreas[manageFunctionAreaIndex].items[manageItemIndex].sum =managePrice;
		totalPrice+=managePrice;
	}
	
	var otherItems = temQuotationDetail.otherItems;
	
	for(var i=0;i<otherItems.length;++i){

		var tem  = 0;
		//0 增项 1 减项 2 漏项 
		//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
		if(otherItems.itemType == '增项' || otherItems.itemType == '扣款' || otherItems.itemType == '特批'){//增项漏项不打折
			
			tem = Math.round((parseFloat(otherItems[i].unitPrice)*parseFloat(otherItems[i].num))*100)/100;
			otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount)*100)/100;
			otherItems[i].sum = tem;
			
			noDiscountTotalPrice +=tem;
			
			totalPrice+=tem;
			
		}else {//减项
			if((otherItems[i].itemType == '减项' && (otherItems[i].quotationClassificationId == '3' || otherItems[i].quotationClassificationId == '4' || otherItems[i].quotationClassificationId == '5'))){//减项的一次性包死 综合项目 管理费 不打折
				tem = Math.round((parseFloat(otherItems[i].unitPrice)*parseFloat(otherItems[i].num))*100)/100;
				otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice))*100)/100;
				otherItems[i].sum =tem;
				
				noDiscountTotalPrice +=tem;
				totalPrice+=tem;
			}else{
				tem = Math.round(parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount*parseFloat(otherItems[i].num)/10*100)/100;
				otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount/10)*100)/100;
				otherItems[i].sum = tem;
				
				discountPrice +=tem;
				totalPrice+=tem;
			}
		}
		
		for(var j=0;j<functionAreas.length;++j){
			if(functionAreas[j].functionAreaId == otherItems[i].functionAreaId){
				functionAreas[j].sum +=tem;
				break;
			}
		}
	}
	
	temQuotationDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
	temQuotationDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
	temQuotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	temQuotationDetail.carManagePrice =  Math.round(carManagePrice*100)/100;//车运费
	temQuotationDetail.managePrice =  Math.round(managePrice*100)/100;//管理费
	
	temQuotationDetail.userdata = {};
	temQuotationDetail.userdata.num="总价:";
	temQuotationDetail.userdata.sum = Math.round(temQuotationDetail.totalPrice*100)/100;
	
	console.log("cal total:",temQuotationDetail);
}

function initQuotationDetailItem(){
	decorationOrderDetail.decorationOrderQuotationItemData = [];
	
	var temQuotationDetail = decorationOrderDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		for(var j=0;j<functionAreas[i].items.length;j++){
			var item = functionAreas[i].items[j];
			var tem = {};
			tem.itemName = item.itemName;
			tem.itemId = item.itemId;
			tem.functionAreaName = functionAreas[i].functionAreaName;
			tem.measurementUnit = item.measurementUnit;
			tem.unitPrice = item.unitPrice;
			tem.discountUnitPrice = item.discountUnitPrice;
			tem.num = item.num;
			tem.sum = item.sum;
			tem.quotationItemDes = item.quotationItemDes;
			tem.itemType = item.itemType;
			
			decorationOrderDetail.decorationOrderQuotationItemData.push(tem);
		}
	}
	
	var otherItems = temQuotationDetail.otherItems;
	
	for(var i=0;i<otherItems.length;++i){
		var item = otherItems[i];
		var tem = {};
		tem.itemName = item.itemName;
		tem.itemId = item.itemId;
		tem.functionAreaName = item.functionAreaName;
		tem.measurementUnit = item.measurementUnit;
		tem.unitPrice = item.unitPrice;
		tem.discountUnitPrice = item.discountUnitPrice;
		tem.num = item.num;
		tem.sum = item.sum;
		tem.quotationItemDes = item.quotationItemDes;
		tem.itemType = item.itemType;
		
		decorationOrderDetail.decorationOrderQuotationItemData.push(tem);
	}
}

function loadQuotationDetail(quotationAutoId){
	
	if(quotationAutoId){
		$("#printProjectBtn").attr('href', decorationOrderDetail.printQuotationIndexUrl + "?quotationDetail.autoId=" + quotationAutoId + "&type=1");
		$("#printFinanceBtn").attr('href', decorationOrderDetail.printQuotationIndexUrl + "?quotationDetail.autoId=" + quotationAutoId + "&type=2");
		$("#printCustomerBtn").attr('href', decorationOrderDetail.printQuotationIndexUrl + "?quotationDetail.autoId=" + quotationAutoId + "&type=3");
		
		com.post(api.quotation.queryQuotationDetailForAllInfoById, {"quotationDetail.autoId": quotationAutoId} ,function(res){
			if(res.errorCode == 0){
				decorationOrderDetail.quotationDetail = res.quotationDetail;
				
				calQuotationDetailSum(); //计算总值
				initQuotationDetailItem(); // 初始化 数据initQuotationDetailItem
				decorationUtils.initQuotationDetailItemGroupByJob(decorationOrderDetail.quotationDetail);
				
				$("#showWay").on("change", function() {
					initQuotationDetail();
				});
				
				initQuotationDetail();
			}else{
				bootbox.alert("操作失败");
			}
		});
	}else{
		$("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
	}
}

function initQuotationDetail(){
	
	var _data = decorationOrderDetail.decorationOrderQuotationItemData;
	var _groupField = [ 'functionAreaName' ];
	if ($("#showWay").val() == 0) {
		_data = decorationOrderDetail.decorationOrderQuotationItemData;
		_groupField = [ 'functionAreaName' ];
	} else {
		_data = decorationOrderDetail.decorationOrderQuotationItemGroupByJob;
		_groupField = [ 'workType' ];
	}

	$grid = $('<table id="quotationItemListGrid"></table><div id="quotationItemGridPager"></div>');  
	$('#quotationItemListDiv').empty().html($grid);  
	$("#quotationItemListGrid").jqGrid({
		data: _data, 
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['编号', '名称', '功能区', '项目类型', '工种', '单位', '单价', '折后单价', '数量', '总价', '工艺说明'],
		colModel:[
			{name:"itemId"},
			{name:"itemName", width:400, summaryType:'count', summaryTpl:'<b class="blue">共{0}项</b>'},
			{name:'functionAreaName'},
			{name:"itemType"},
			{name:'workType'},
			{name:"measurementUnit"},
			{name:"unitPrice"},
			{name:"discountUnitPrice"},
			{name:"num"},
			{name:"sum", formatter:"number", summaryType:'sum'},
			{name:"quotationItemDes",formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat}
		], 
		pager: "#quotationItemGridPager" ,
		rowNum:200,
		rowList:[50,100,200],
		grouping: true,
	   	groupingView: {
	   		groupField: _groupField,
	   		groupColumnShow: [true],
	   		groupText: ['<b>{0}</b>'],
	   		groupCollapse : false,
			groupOrder: ['asc'],
			groupSummary: [true],
			showSummaryOnHide: true,
			groupDataSorted: true
	   	},
	   	userData:decorationOrderDetail.quotationDetail.userdata,
	    footerrow: true,
	    userDataOnFooter: true
	});
		
	$("#quotationItemListGrid").navGrid("#quotationItemGridPager", {edit: false, add: false, del: false, search: false});

	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderDetailCommonPageContent'});
	$('.ui-widget-content.footrow.footrow-ltr').addClass("red");
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