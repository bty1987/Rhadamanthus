var decorationOrderDetail  = {
	decorationOrderId:null,
	
	initBaseInfo:initBaseInfo,
	initUplodify:initUploadify,
	customer:{},
	village:{},
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	materialItemListGrid: null,
	materialItemGridPager: null,
	
	mediaServer:null,
	quotations:null,
	quotationDetail:null,
	
	reloadFlag:0,
	decorationOrderQuotationItemData:[],
	decorationOrderQuotationItemGroupByJob: []
};

var decorationPayment = {
	postParam:{},
	
	items:{},
	basePaymentGrid:null,
	otherPaymentGrid:null,
	otherPaymentPager:null,
	
	editFlag:0,
};

var decorationOrderPostData = {};

jQuery(function($) {
	
	decorationOrderDetail .decorationOrderId = params.orderId;
	decorationOrderPostData["decorationOrderId"] = params.orderId;
	
	decorationPayment.postParam["decorationPayment.orderId"] = params.orderId;
	
	var options = {
		"quotation.orderId": decorationOrderDetail .decorationOrderId,
	};
	
	com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function(res){
		if(res.errorCode == 0){
			decorationOrderDetail ["quotation.autoId"] = res.quotation.autoId;
		}
	});
	
	decorationOrderDetail .quotationItemListGrid = $("#quotationItemListGrid");
	decorationOrderDetail .quotationItemGridPager = "#quotationItemGridPager";
	
	decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
	decorationPayment.otherPaymentPager="#otherPaymentGridPager";
	decorationPayment.basePaymentGrid = $("#basePaymentTable");
	
	initUploadify();
	
	$('#btnBack').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderAuditIndex.url);
	});
	
	initBaseInfo();
});

//----------------------------------------------款项信息---------------------------------------------------------------
function initBasePayment(){
	decorationPayment.postParam.decorationOrderId = decorationOrderDetail .decorationOrderId;

	$("#basePaymentTable").jqGrid({
		url: api.payment.pageDecorationPaymentForBaseByOrderId.url,
		postData:decorationPayment.postParam,
		multiselect : false,
        multiboxonly: false,
		colNames:['autoId','款项名称', '应收款项', '实收金额', '款项状态', '操作','现金','刷卡','分期','转账','对公账户','代金券','预付款'],
		colModel:[
		    {name:'autoId',hidden:true},
			{name:'paymentType'},
			{name:'referMoney'},
			{name:'realMoney',formatter:realMoneyFormatter},
			{name:'paymentStatus'},
			{name:'action',formatter:basePaymentActionFormatter, hidden:true},
			{name:'cash',hidden:true},
			{name:'swipe',hidden:true},
			{name:'installment',hidden:true},
			{name:'checkPay',hidden:true},
			{name:'accounts',hidden:true},
			{name:'coupon',hidden:true},
			{name:'advancePayment',hidden:true}
		], 
		pager : "#basePaymentPager",
		caption: ""
	});
}

function initOtherPayment(){

	decorationPayment.otherPaymentGrid.jqGrid({		
		url: api.payment.pageDecorationPaymentForOtherByOrderId.url,
		postData: decorationPayment.postParam,
		multiselect : false,
        multiboxonly: false,
		colNames:['autoId','款项名称', '应收款项', '实收金额', '款项状态','操作','现金','刷卡','分期','转账','对公账户','代金券','预付款'],
		colModel:[
		    {name:'autoId',hidden:true},
			{name:'paymentType'},
			{name:'referMoney'},
			{name:'realMoney',formatter:realMoneyFormatter},
			{name:'paymentStatus'},
			{name:'action',formatter:otherPaymentActionFormatter, hidden:true},
			{name:'cash',hidden:true},
			{name:'swipe',hidden:true},
			{name:'installment',hidden:true},
			{name:'checkPay',hidden:true},
			{name:'accounts',hidden:true},
			{name:'coupon',hidden:true},
			{name:'advancePayment',hidden:true}
		], 
		pager : decorationPayment.otherPaymentPager,
		caption: ""
	});
}

function realMoneyFormatter(cellvalue, options, rowObject){
	return  Math.round(
			(parseFloat(rowObject.cash)
			+parseFloat(rowObject.swipe)
			+parseFloat(rowObject.installment)
			+parseFloat(rowObject.checkPay)
			+parseFloat(rowObject.accounts)
			+parseFloat(rowObject.coupon)
			+parseFloat(rowObject.advancePayment))*100)/100;
}

function basePaymentActionFormatter(cellvalue, options, rowObject){
	if(rowObject.paymentStatus == '未提交'){
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment('+rowObject.autoId+',\''+rowObject.paymentType+'\');">提交</button>';
		if(rowObject.paymentType != '首付款' && rowObject.paymentType !='首付二期款'
			&& rowObject.paymentType !='二期款'&& rowObject.paymentType !='尾款'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editPayment('+rowObject.autoId+','+rowObject.referMoney+');">修改</button>';
		}
		result += '</div>';
		
		return result;
	}else if('未付款'==rowObject.paymentStatus){
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		if(rowObject.paymentType != '首付款' && rowObject.paymentType !='首付二期款'
			&& rowObject.paymentType !='二期款'&& rowObject.paymentType !='尾款'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editPayment('+rowObject.autoId+','+rowObject.referMoney+');">修改</button>';
		}
		result += '</div>';
		
		return result;
	}else {
		return "";
	}
}

function otherPaymentActionFormatter(cellvalue, options, rowObject){
	if(rowObject.paymentStatus == '未提交'){
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		if(rowObject.paymentType == '退款'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment('+rowObject.autoId+',\''+rowObject.paymentType+'\');">提交</button>';
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editRefundPayment('+rowObject.autoId+','+rowObject.referMoney+');">修改</button>';
		}else if(rowObject.paymentType == '违约金'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment('+rowObject.autoId+',\''+rowObject.paymentType+'\');">提交</button>';
		}
		result += '</div>';
		
		return result;
	}else if(rowObject.paymentStatus == '申请审批'||rowObject.paymentStatus == '审批未通过'){
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editRefundPayment('+rowObject.autoId+','+rowObject.referMoney+');">修改</button>';
		result += '</div>';
		
		return result;
	}else{
		return "";
	}
}

function submintPayment(paymentId,paymentType){
	bootbox.confirm("确认要提交"+paymentType+"吗？",function(result){
		if(result){
			com.post(api.payment.submitDecorationPayment, {"decorationPayment.autoId":paymentId}, function(res){
				if(res.errorCode == 0){
					$.jgrid.refreshGrid($("#basePaymentTable"), decorationPayment.postParam);
					$.jgrid.refreshGrid(decorationPayment.otherPaymentGrid, decorationPayment.postParam);
					$("#quotationTotalPriceModal").modal("hide");
				}else{
					bootbox.alert("系统出错");
				}
			});
		}
	});
}

function editPayment(paymentId,oldmoney){
	
	decorationPayment.editFlag = 1;
	com.clearValidator();
	
	$("#autoId").val(paymentId);
	$("#referMoney").val(oldmoney);
	$("#decorationPaymentModal").modal("show");
}

function editRefundPayment(paymentId,oldmoney){
	
	decorationPayment.editFlag = 2;
	com.clearValidator();
	
	$("#autoId").val(paymentId);
	$("#referMoney").val(oldmoney);
	$("#decorationPaymentModal").modal("show");
}

//-------------------------------------------------------------------------------初始化- initWizard------------------
function initWizard(){
	$('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
		if((info.step == 4 && info.direction ==="previous")||(info.step == 2 && info.direction ==="next")){
			initDecorationPicture();
			initCADPicture();
		}
		if((info.step == 3 && info.direction ==="previous")||(info.step == 1 && info.direction ==="next")){
			loadQuotationDetail(decorationOrderDetail ["quotation.autoId"]);
		}
		if ((info.step == 5 && info.direction === "previous") || (info.step == 3 && info.direction === "next")) {
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}
		if((info.step == 4 && info.direction ==="next")){
			
		}
	}).on('finished', function(e) {
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	}).on('stepclick', function(e,info){
		if(info.step == 2){
			loadQuotationDetail(decorationOrderDetail ["quotation.autoId"]);
		}else if(info.step == 3){
			initDecorationPicture();
			initCADPicture();
		}else if (info.step == 4){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if(info.step == 5){
			
		}
	}).on('next', function(e,info){
		
	}).on('previous', function(e,info){
	});
}

//--------------------------------------------------------------------基本信息--------------------------------------------------------------
function initBaseInfo(){
	com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {"decorationOrder.orderId":decorationOrderDetail .decorationOrderId}, function(res){
		decorationOrderDetail .mediaServer = res.mediaServer;
		
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
		
        decorationOrderDetail .customer.id = res.decorationOrder.customer.id;
		decorationOrderDetail .customer.phone = res.decorationOrder.customer.phone;
		decorationOrderDetail .customer.qq = res.decorationOrder.customer.qq;
		decorationOrderDetail .customer.wechat = res.decorationOrder.customer.wechat;
		decorationOrderDetail .customer.email = res.decorationOrder.customer.email;
		decorationOrderDetail .customer.relationshipType = res.decorationOrder.customer.relationshipType;
		decorationOrderDetail .customer.approveStatus = res.decorationOrder.customer.approveStatus;
		decorationOrderDetail .village.ruleExample = res.decorationOrder.village.buildingNameRule.ruleExample;
		decorationOrderDetail .village.ruleContent = res.decorationOrder.village.buildingNameRule.ruleContent;
		decorationOrderDetail .village.rule = res.decorationOrder.village.buildingNameRule.rule;
	});
	
	var options = {
		"quotation.orderId": decorationOrderDetail .decorationOrderId,
	}
	
	//-----初始化报价列表---------------------
	com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function(res){
		if(res.errorCode == 0){
			decorationOrderDetail .quotations = res.quotations;
			$("#quotationsList").bindData(decorationOrderDetail .quotations, 'autoId', 'quotationName');
		}
	});
	
	//-----------------------初始化款项信息-----------
	initBasePayment();
	initOtherPayment();
	
	if(decorationOrderDetail .firstInit==undefined || decorationOrderDetail .firstInit == true){
		initWizard();
		decorationOrderDetail .firstInit = false;
	}
}

//--------------------------------------------------------------图纸信息-----------------------
function initUploadify(){
	$("#pictureUpload").Huploadify({
        //开启调试
        'debug' : false,
        //是否自动上传
        'auto':true,
        //超时时间
        'successTimeout':150,
        //附带值
        'formData':{
            'uploadType':1
        },
        //flash
        //'swf': "./js/uploadify/uploadify.swf",

        //不执行默认的onSelect事件
        'overrideEvents' : ['onDialogClose'],
        //文件选择后的容器ID
        //'queueID':'uploadfileQueue',
        //服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'fileObjName':'strutsUploads',
        //上传处理程序
        'uploader':decorationOrderDetail .mediaServer + api.common.uploadImg.url,
        //浏览按钮的背景图片路径
        //'buttonImage':'upbutton.gif',
        //浏览按钮的宽度
        'width':'100',
        //浏览按钮的高度
        'height':'32',
        //expressInstall.swf文件的路径。
        //'expressInstall':'expressInstall.swf',
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeDesc':'支持的格式：',
        //允许上传的文件后缀
        'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png',
        //上传文件的大小限制
        'fileSizeLimit':'2MB',
        //上传数量
        'queueSizeLimit' : 1,
        //每次更新上载的文件的进展
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
             //有时候上传进度什么想自己个性化控制，可以利用这个方法
             //使用方法见官方说明
        },
        //选择上传文件后调用
        'onSelect' : function(file) {
                  
        },
        //返回一个错误，选择文件的时候触发
        'onSelectError':function(file, errorCode, errorMsg){
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#pictureUpload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#pictureUpload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            }
        },
        //检测FLASH失败调用
//        'onFallback':function(){
//            alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
//        },
        //上传到服务器，服务器返回相应信息到data里
        'onUploadSuccess':function(file, data, response){
        	var dateObj = eval("("+data+")");
        	if(dateObj.errorCode == 0){
        		 bootbox.prompt("请输入备注:", function(result) {                
					if (result === null) {                                             

					} else {
						var options ={
						  	"orderDesignPicture.picturePath":dateObj.resUrl,
							"orderDesignPicture.uploadFileName":dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent":result,
							"orderDesignPicture.orderId":decorationOrderDetail .decorationOrderId
						};
						
						com.post(api.decoration.addOrderDesignPicture, options, function(res){
							if(res.errorCode == 0){
								com.showAlert(com.info, "操作成功");
								initDecorationPicture();
							}else{
								com.showAlert(com.info, res.errorMsg);
							}
						});               
					}
        		 });
			}else{
				alert(data);
			}
        }
    });
	
	$("#CADUpload").Huploadify({
        //开启调试
        'debug' : false,
        //是否自动上传
        'auto':true,
        //超时时间
        'successTimeout':150,
        //附带值
        'formData':{
            'uploadType':2
        },
        //flash
        //'swf': "./js/uploadify/uploadify.swf",

        //不执行默认的onSelect事件
        'overrideEvents' : ['onDialogClose'],
        //文件选择后的容器ID
        //'queueID':'uploadfileQueue',
        //服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'fileObjName':'strutsUploads',
        //上传处理程序
        'uploader':decorationOrderDetail .mediaServer + api.common.uploadOther.url,
        //浏览按钮的背景图片路径
        //'buttonImage':'upbutton.gif',
        //浏览按钮的宽度
        'width':'100',
        //浏览按钮的高度
        'height':'32',
        //expressInstall.swf文件的路径。
        //'expressInstall':'expressInstall.swf',
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeDesc':'支持的格式：',
        //允许上传的文件后缀
        'fileTypeExts':'*.dwt',
        //上传文件的大小限制
        'fileSizeLimit':'2MB',
        //上传数量
        'queueSizeLimit' : 1,
        //每次更新上载的文件的进展
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
             //有时候上传进度什么想自己个性化控制，可以利用这个方法
             //使用方法见官方说明
        },
        //选择上传文件后调用
        'onSelect' : function(file) {
                  
        },
        //返回一个错误，选择文件的时候触发
        'onSelectError':function(file, errorCode, errorMsg){
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#CADUpload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#CADUpload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            }
        },
        //检测FLASH失败调用
//        'onFallback':function(){
//            alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
//        },
        //上传到服务器，服务器返回相应信息到data里
        'onUploadSuccess':function(file, data, response){
        	var dateObj=eval("("+data+")");
        	if(dateObj.errorCode==0){
        		 bootbox.prompt("请输入备注：", function(result) {                
					if (result === null) {                                             
					                                  
					} else {
						var options ={
						  	"orderDesignPicture.picturePath":dateObj.resUrl,
							"orderDesignPicture.uploadFileName":dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent":result,
							"orderDesignPicture.orderId":decorationOrderDetail .decorationOrderId
						};
						
						com.post(api.decoration.addOrderDesignPictureForCAD, options, function(res){
							if(res.errorCode == 0){
								com.showAlert(com.info, "操作成功");
								initCADPicture();
							}else{
								com.showAlert(com.info, res.errorMsg);
							}
						});               
					}
        		 });
		
			}else{
				alert(data);
			}
        }
    });
}

function initDecorationPicture(){
	
	com.post(api.decoration.queryOrderDesignPictureByOrderId, {"orderDesignPicture.orderId":decorationOrderDetail.decorationOrderId}, function(res){
		var html = "";
		var i = 0;
		
		if(res.orderDesignPictures != null && res.orderDesignPictures.length > 0){
			for(i=0;i<res.orderDesignPictures.length;++i){
				html+='<li>';
				html+='<a data-rel="colorbox" href="'+res.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'" class="cboxElement" target="_blank">';
				html+='		<img src="'+res.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'&divFlag=1&width=200&height=200" alt="200x200" width="200" height="200">';
				html+='</a>';
				
				html+='<div class="tools tools-top">';
				html+='		<label>'+res.orderDesignPictures[i].uploadFileName+'</label>';
				html+='		<a href="'+decorationOrderDetail .mediaServer + api.common.downloadFile.url + '?downloadFilePath='+res.orderDesignPictures[i].picturePath+'&fileName='+res.orderDesignPictures[i].uploadFileName+'" target="_blank"><i class="icon-download-alt"></i></a>';
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
				html+=" <a class='icon-download-alt' href='"+decorationOrderDetail .mediaServer + api.common.downloadFile.url + "?downloadFilePath="+res.orderDesignPictures[i].picturePath+"&fileName="+res.orderDesignPictures[i].uploadFileName+"' target='_blank'> <i class=''></i></a>";
				html+='</div>';
	
				html+='	<div class="infobox-data">';
				html+='		<div class="infobox-content">'+res.orderDesignPictures[i].uploadFileName+'</div>';
				html+='	</div>';
				html+='</div>';
			}
			$("#CADProjectPicture").html(html);
		}
		else{
			$("#CADProjectPicture").html("");
		}
	});
}

function deleteOrderImg(autoId,decorationOrderId){
	var options = {
			"orderDesignPicture.autoId":autoId,
			"decorationOrderId":decorationOrderId
	};
	com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options, function(res){
		if(res.errorCode == 0){
			com.showAlert(com.info, "操作成功");
			initDecorationPicture();
		}else{
			com.showAlert(com.info, res.errorMsg);
		}
	});
}

function deleteOrderCAD(autoId,decorationOrderId){
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

function downloadFile(picturePath,uploadFileName){
	window.open(decorationOrderDetail .mediaServer + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
}

//------------------------------------------------------------------报价信息----------------------------------------------
function calQuotationDetailSum(){
	var temQuotationDetail = decorationOrderDetail .quotationDetail;
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
	
	decorationOrderDetail .quotationDetail.manageRate =  0;
	decorationOrderDetail .quotationDetail.carManageRate = 0;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		functionAreas[i].sum = 0;
		if(functionAreas[i].functionAreaType == '普通'){//参与打折
			var sum = 0;
			
			for(var j=0;j<functionAreas[i].items.length;j++){
				functionAreas[i].items[j].discountUnitPrice = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail .quotationDetail.discount/10)*100)/100;
				functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail .quotationDetail.discount*parseFloat(functionAreas[i].items[j].num)/10)*100)/100;
				sum+=functionAreas[i].items[j].sum;
				
			}
			functionAreas[i].sum = sum;
			discountPrice += sum;
			totalPrice+=sum;
			
		}else {
			var sum = 0;
			console.log('tesu--',functionAreas[i].items);
			for(var j=0;j<functionAreas[i].items.length;j++){
				if(/*functionAreas[i].items[j].customFlag == 1 
						||*/((functionAreas[i].items[j].itemName.search('车运费')==-1) && (functionAreas[i].items[j].itemName.search('管理费')==-1))){//不打折
					
					functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*parseFloat(functionAreas[i].items[j].num))*100)/100;
					sum+=functionAreas[i].items[j].sum;
				}else if((functionAreas[i].items[j].itemName.search('车运费')!=-1)){
					decorationOrderDetail .quotationDetail.carManageRate = functionAreas[i].items[j].unitPrice;
					carManageFunctionAreaIndex = i;
					carManageItemIndex = j;
				}else if((functionAreas[i].items[j].itemName.search('管理费')!=-1)){
					functionAreas[i].items[j].unitPrice = parseFloat(functionAreas[i].items[j].unitPrice)+parseFloat(decorationOrderDetail .quotationDetail.notSalesmanRate);
					
					decorationOrderDetail .quotationDetail.manageRate = functionAreas[i].items[j].unitPrice;
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
	carManagePrice = Math.round(((commonPrice)*parseFloat(decorationOrderDetail .quotationDetail.carManageRate))*100)/100;
	if( parseFloat(decorationOrderDetail .quotationDetail.limitCarManagePrice) > carManagePrice){
		carManagePrice =  Math.round(parseFloat(decorationOrderDetail .quotationDetail.limitCarManagePrice)*100)/100;
	}
	
	if(carManageFunctionAreaIndex!=-1){
		commonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum +=carManagePrice;
		functionAreas[carManageFunctionAreaIndex].items[carManageItemIndex].sum =carManagePrice;
		totalPrice+=carManagePrice;
	}
	
	managePrice = Math.round(((commonPrice)*parseFloat(decorationOrderDetail .quotationDetail.manageRate))*100)/100;

	if(manageFunctionAreaIndex!=-1){
		functionAreas[manageFunctionAreaIndex].sum +=managePrice;
		functionAreas[manageFunctionAreaIndex].items[manageItemIndex].sum =managePrice;
		totalPrice+=managePrice;
	}
	
	temQuotationDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
	temQuotationDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
	temQuotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	temQuotationDetail.carManagePrice =  Math.round(carManagePrice*100)/100;//车运费
	temQuotationDetail.managePrice =  Math.round(managePrice*100)/100;//管理费
	
	temQuotationDetail.userdata = {};
	temQuotationDetail.userdata.num="总价:";
	temQuotationDetail.userdata.sum = temQuotationDetail.totalPrice;
	
	console.log("cal total:",temQuotationDetail);
}

function initQuotationDetailItem(){
	decorationOrderDetail .decorationOrderQuotationItemData = [];
	
	var temQuotationDetail = decorationOrderDetail .quotationDetail;
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
			
			decorationOrderDetail .decorationOrderQuotationItemData.push(tem);
		}
	}
	
}

//group by JOB
function initQuotationDetailItemGroupByJob(){
	var map = {};
	
	var temQuotationDetail = decorationOrderDetail .quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		for(var j=0;j<functionAreas[i].items.length;j++){
			var item = functionAreas[i].items[j];
			var tem = {};
			tem.itemId = item.itemId;
			tem.itemName = item.itemName;
			tem.functionAreaName = functionAreas[i].functionAreaName;
			tem.workType = item.workType;
			tem.measurementUnit = item.measurementUnit;
			tem.unitPrice = item.unitPrice;
			tem.discountUnitPrice = item.discountUnitPrice;
			tem.num = item.num;
			tem.sum = item.sum;
			tem.quotationItemDes = item.quotationItemDes;
			
			if(map[tem.itemId] != undefined){
				map[tem.itemId].num += tem.num;
				map[tem.itemId].sum += tem.sum;
			}else{
				map[tem.itemId] = tem;
			}
		}
	}
	
	$.each(map, function(i, v){
		decorationOrderDetail .decorationOrderQuotationItemGroupByJob.push(v);
	});
}

function loadQuotationDetail(quotationAutoId){
	
	console.log("loadQuotationDetail");
	console.log(api.quotation.queryQuotationDetailById.url);
	
	if(quotationAutoId){
		com.post(api.quotation.queryQuotationDetailForAllInfoById, {"quotationDetail.autoId": quotationAutoId}, function(res){
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
	}
}

function initQuotationDetail(){
	var _data = decorationOrderDetail .decorationOrderQuotationItemData;
	var _groupField = ['functionAreaName'];
	if($("#showWay").val() == 0){
		_data = decorationOrderDetail .decorationOrderQuotationItemData; 
		_groupField = ['functionAreaName'];
	}else{
		_data = decorationOrderDetail .decorationOrderQuotationItemGroupByJob;
		_groupField = ['workType'];
	}
	$grid = $('<table id="quotationItemListGrid"></table><div id="quotationItemGridPager"></div>');  
	$('#quotationItemListDiv').empty().html($grid);  
		$("#quotationItemListGrid").jqGrid({
			data: _data, 
			datatype: "local",
			viewrecords : false,
			multiselect : false,
	        multiboxonly: false,
			colNames:['编号' , '名称' ,'功能区', '工种', '单位' , '单价' , '折后单价' ,'数量', '总价' , '工艺说明'],
			colModel:[
			  {name:"itemId"},
			  {name:"itemName",summaryType:'count', summaryTpl:'<b class="blue">共{0}项</b>'},
			  {name:'functionAreaName'},
			  {name:'workType'},
			  {name:"measurementUnit"},
			  {name:"unitPrice"},
			  {name:"discountUnitPrice"},
			  {name:"num"},
			  {name:"sum", formatter:"number", summaryType:'sum'},
			  {name:"quotationItemDes",formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat}
			], 
			pager: "#quotationItemGridPager" ,
			grouping: true,
		   	groupingView : {
		   		groupField : _groupField,
		   		groupColumnShow : [true],
		   		groupText : ['<b>{0}</b>'],
		   		groupCollapse : false,
				groupOrder: ['asc'],
				groupSummary : [true],
				showSummaryOnHide: true,
				groupDataSorted : true
		   	},
		   	userData:decorationOrderDetail .quotationDetail.userdata,
		    footerrow: true,
		    userDataOnFooter: true

		});

	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderDetailDesignerPageContent'});
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
