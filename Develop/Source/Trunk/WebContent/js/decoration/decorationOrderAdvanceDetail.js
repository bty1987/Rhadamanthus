var decorationOrderDetail = {
	decorationOrderId:null,
	
	initBaseInfo:initBaseInfo,
	initUplodify:initUploadify,
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
	decorationOrderQuotationItemData:[],
	decorationOrderQuotationItemGroupByJob: [],
	
	btnSaveBaseDecorationOrderInfo:null,
	
	validator: {
		houseNumber: {
			type: "v_houseNumber", 
			regex: /^D_\d{3}$/g,
			errorMsg: "楼盘名称规则"
		}
	},
	
	vRepeatFlg: false,
	cRepeatFlg: false
};

var decorationPayment = {
	postParam:{},
	
	items:{},
	basePaymentGrid:null,
	otherPaymentGrid:null,
	otherPaymentPager:null,
	
	editFlag:0,
};

var materialSubOrderItemData = {};

jQuery(function($) {
	
	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;
	
	decorationOrderDetail.btnSaveBaseDecorationOrderInfo = $("#btnSaveBaseDecorationOrderInfo").on("click", saveBaseDecorationOrderInfo);
	
	decorationOrderDetail.quotationItemListGrid = $("#quotationItemListGrid");
	decorationOrderDetail.quotationItemGridPager = "#quotationItemGridPager";
	decorationOrderDetail.materialPaymentListGrid = $("#materialPaymentListGrid");
	decorationOrderDetail.materialPaymentGridPager = "#materialPaymentGridPager";

	decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
	decorationPayment.otherPaymentPager="#otherPaymentGridPager";
	decorationPayment.basePaymentGrid = $("#basePaymentTable");
	
	decorationOrderDetail.printQuotationModal = $("#printQuotationModal");
	
	decorationOrderDetail.activitys = $("#activitys");
	decorationOrderDetail.activityItems = $("#activityItems");
	
	$("#btnPrintDefaultQuotationInfo").on('click',function(res){
		decorationOrderDetail.printQuotationModal.modal("show");
	});
	
	$('#customerInfosBtn').on(ace.click_event, function(){
		if(decorationOrderDetail.showCustomerInfoFlag==undefined || decorationOrderDetail.showCustomerInfoFlag==0 ){
			$.gritter.add({
				title: '客户敏感信息',
				text: '邮箱 :'+decorationOrderDetail.customer.email+'<br /> QQ:'+decorationOrderDetail.customer.qq+'<br /> 微信:'+decorationOrderDetail.customer.wechat+'<br />  电话 :'+decorationOrderDetail.customer.phone+'<br />  客户类型:'+decorationOrderDetail.customer.relationshipType+'<br /> ',
				class_name: 'gritter-info gritter-center gritter-light',
				after_close: function(e, manual_close){
					decorationOrderDetail.showCustomerInfoFlag = 0;
				}
			});
			decorationOrderDetail.showCustomerInfoFlag = 1;
		}

		return false;
	});
	
	$.extend(com.validator, decorationOrderDetail.validator);
	//==============customer approve=====================
	$('#customerApproveBtn').on("click", function(){
		com.clearValidator();
		com.clearValidator("#customerPhone", true);
		$("#customerName").val($("#customer").val());
		$("#customerPhone").val(decorationOrderDetail.customer.phone).on("blur",function(){
			$this = $(this);
			if($this.val() == undefined || $this.val().trim() == ""){
				com.clearValidator("#customerPhone", true);
				decorationOrderDetail.cRepeatFlg = false;
				return;
			}
			if((com.validator.phones.regex).test($this.val())){
				com.post(api.data.checkCustomerForPhone, {"customer.phone":$this.val()}, function(res){
					var customerIds = res.customerIds;
					var count = customerIds.length;
					if(count == 1){
						if(customerIds[0] != decorationOrderDetail.customer.id){
							com.showTips($this, "该联系方式已存在", true);
							decorationOrderDetail.cRepeatFlg = true;
						}else{
							com.clearValidator("#customerPhone", true);
							decorationOrderDetail.cRepeatFlg = false;
						}
							
					}else if(count > 1){
						com.showTips($this, "该联系方式已存在", true);
						decorationOrderDetail.cRepeatFlg = true;
					}else{
						com.clearValidator("#customerPhone", true);
						decorationOrderDetail.cRepeatFlg = false;
					}
				});
			}
		});
		$("#customerDes").val("");
		$("#approveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		$("#customerApproveModal").modal("show");
	});
	
	$("#approveManSel").chosen({allow_single_deselect: true}); 
	$("#approveManSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val() != ""){
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin": pinyinName, "userApprove.type": 1}, function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
						
					}
					$("#approveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveManSel_chosen").css("width", "200px");
	
	$("#cApproveSaveBtn").on("click", function(){
		
		if (com.validate('customerApproveModal')){
			return;
		}
		
		var options = {
			"approval.receiverId": $("#approveManSel").val(),
			"approval.comment": $("#customerDes").val(),
			"approvalCustomer.customerId": decorationOrderDetail.customer.id,
			"approvalCustomer.newCustomerName": $("#customerName").val(),
			"approvalCustomer.newCustomerPhone": $("#customerPhone").val(),
		}
		
		com.post(api.approval.submitApprovalForCustomer, options, function(res){
			com.showAlert(com.info, "操作成功");
		})
		
		$("#customerApproveModal").modal("hide");
	});
	
	$('#villageApproveBtn').on("click", function(){
		com.clearValidator();
		com.clearValidator("#houseNumber", true);
		$("#villageSel").html('<option value="'+decorationOrderDetail.village.villageId+'">'+decorationOrderDetail.village.villageName+'</option>');
		$("#villageSel").trigger("chosen:updated");
		$("#houseNumber").val(decorationOrderDetail.village.houseNumber);
		
		com.validator.houseNumber["regex"] = eval("/^"+decorationOrderDetail.village.rule+"$/g");
		com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+decorationOrderDetail.village.ruleContent+")";
		
		$("#buildingRuleContent").text("说明："+decorationOrderDetail.village.ruleContent+";eg."+decorationOrderDetail.village.ruleExample);
		$("#villageDes").val("");
		$("#vApproveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		$("#villageApproveModal").modal("show");
	});
	
	$("#villageSel").chosen({allow_single_deselect: true}); 
	$("#villageSel_chosen input").bind("input", function(){
		var auroFileSearchValue = $("#villageSel_chosen input").val();
		if($("#villageSel_chosen input").val() != ""){
			com.post(api.data.queryVillageForNameByPinyin, {"pinyinName":auroFileSearchValue},function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						var i = 0;
						for(i=0;i<res.autoFillList.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#villageSel").html(html1);
					$("#villageSel").trigger("chosen:updated");
				}
			});
		}
	});
	
	$("#villageSel").on("change",function(e){
		if($("#villageSel").val() == null||$("#villageSel").val() == "") return;
		com.post(api.data.queryVillageById, {"village.villageId": $("#villageSel").val()}, function(res){
			$("#houseNumber").val("");
			com.validator.houseNumber["regex"] = eval("/^"+res.village.buildingNameRule.rule+"$/g");
			com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.village.buildingNameRule.ruleContent+")";
			$("#buildingRuleContent").html("说明："+res.village.buildingNameRule.ruleContent+";eg."+res.village.buildingNameRule.ruleExample);
		});
	});
	$("#villageSel_chosen").css("width", "200px");
	
	//village house number
	$("#houseNumber").on("blur",function(e){
		if($(this).val() == "" || $("#villageSel").val()==""){
			return;
		}
		
		com.post(api.decoration.queryDecorationOrderByVillageIdAHouseNumber, {"decorationOrder.village.villageId":$("#villageSel").val(),"decorationOrder.houseNumber":$("#houseNumber").val()}, function(res){
			if(res.decorationOrder&&res.decorationOrder.orderId){
					com.showTips($("#houseNumber"), "订单已存在：订单号："+res.decorationOrder.orderId+" 订单所属设计师:"+res.decorationOrder.designer, true);
					decorationOrderDetail.vRepeatFlg = true;
			}else{
				com.clearValidator("#houseNumber", true);
				decorationOrderDetail.vRepeatFlg = false;
			}
		});
	});
	
	//village approve: approve-man-select
	$("#vApproveManSel").chosen({allow_single_deselect: true}); 
	$("#vApproveManSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val() != ""){
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin": pinyinName, "userApprove.type": 2}, function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#vApproveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#vApproveManSel_chosen").css("width", "200px");
	
	//village approve modal save button
	$("#vApproveSaveBtn").on("click", function(){
		
		if(com.validate('villageApproveModal')|| decorationOrderDetail.vRepeatFlg){
			return;
		}
			
		var options = {
			"approval.receiverId": $("#vApproveManSel").val(),
			"approval.comment": $("#villageDes").val(),
			"approvalVillage.orderId": $("#orderId").val(),
			"approvalVillage.newVillageId": $("#villageSel").val(),
			"approvalVillage.newHouseNumber": $("#houseNumber").val(),
		}
		
		com.post(api.approval.submitApprovalForVillage, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		$("#villageApproveModal").modal("hide");
	});
	
	$('#btnBack').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderAdvanceIndex.url);
	});
	
	initBaseInfo();
});

//-------------------------------------------------------------------------------初始化- initWizard------------------
function initWizard(){
	$('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
		
		if(info.step == 2 && info.direction ==="previous"){
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		}else{
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
		
		if((info.step == 3 && info.direction ==="previous") || (info.step == 1 && info.direction ==="next")){
			decorationUtils.loadQuotationDetail();
		}
		
		if ((info.step == 4 && info.direction === "previous") || (info.step == 2 && info.direction === "next")) {
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}
		
		if ((info.step == 5 && info.direction === "previous") || (info.step == 3 && info.direction === "next")) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}
		
		if (info.step == 5 && info.direction === "next") {
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
		
	}).on('finished', function(e) {
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	}).on('stepclick', function(e,info){
		
		decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		
		if(info.step == 1){
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		}else if(info.step == 2){
			decorationUtils.loadQuotationDetail();
		}else if(info.step == 3){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if(info.step == 4){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 6){
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
	}).on('next', function(e,info){
		if(info.step == 1){
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		}else{
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
	}).on('previous', function(e,info){
		if(info.step == 1){
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		}else{
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
	});
}

//--------------------------------------------------------------------基本信息--------------------------------------------------------------
function initBaseInfo(){
	com.post(api.decoration.queryDecorationOrderForCommonByOrderId, {"decorationOrder.orderId":decorationOrderDetail.decorationOrderId},function(res){
		decorationOrderDetail.mediaServer = window.mediaServer;
		
		//initUploadify();
		
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

		decorationOrderDetail.village.villageId = res.decorationOrder.village.villageId;
		decorationOrderDetail.village.villageName = res.decorationOrder.village.villageName;
		decorationOrderDetail.village.houseNumber = res.decorationOrder.houseNumber;
		decorationOrderDetail.village.ruleExample = res.decorationOrder.village.buildingNameRule.ruleExample;
		decorationOrderDetail.village.ruleContent = res.decorationOrder.village.buildingNameRule.ruleContent;
		decorationOrderDetail.village.rule = res.decorationOrder.village.buildingNameRule.rule;
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
	
	//-----------------------初始化款项信息-----------
	decorationUtils.initBasePayment(decorationPayment.postParam, null, "#decorationOrderDetailSalesmanPageContent");
	decorationUtils.initOtherPayment(decorationPayment.postParam, null, "#decorationOrderDetailSalesmanPageContent");
	
	if(decorationOrderDetail.firstInit==undefined || decorationOrderDetail.firstInit == true){
		initWizard();
		decorationOrderDetail.firstInit = false;
	}
}

function saveBaseDecorationOrderInfo(){
	if(com.validate("step1")){
		return;
	}
	
	bootbox.confirm("确定要保存基本信息吗?", function(result) {
		if(result) {
			var options = {
				"decorationOrder.orderId": decorationOrderDetail.decorationOrderId,
				"decorationOrder.houseType": $("#houseType").val(),
				"decorationOrder.houseClass": $("#houseClass").val(),
				"decorationOrder.houseArea": $("#houseArea").val(),
				"decorationOrder.freeArea": $("#freeArea").val(),
				"decorationOrder.notSalesmanRate": $("#notSalesmanRate").val(),
				"decorationOrder.notSalesmanName": $("#notSalesmanName").val(),
				"decorationOrder.notSalesmanPhone": $("#notSalesmanPhone").val(),
				"decorationOrder.notSalesmanContent": $("#notSalesmanContent").val(),
			};
			
			com.post(api.decoration.changeDecorationOrderForActivity, options, function(){
				com.showAlert(com.info, "操作成功");
				initBaseInfo();
			});
		}
	});
}

//--------------------------------------------------------------图纸信息-----------------------
function initUploadify(){
	console.log(decorationOrderDetail.mediaServer);
	$("#pictureUpload").Huploadify({
        'debug' : false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': 150, //超时时间
        'formData': { // 附带值
            'uploadType':1
        },
        //'swf': "./js/uploadify/uploadify.swf", // flash
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID':'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader':decorationOrderDetail.mediaServer + api.common.uploadImg.url, // 上传处理程序
        //'buttonImage':'upbutton.gif', // 浏览按钮的背景图片路径
        'width':'100', // 浏览按钮的宽度
        'height':'32', // 浏览按钮的高度
        //'expressInstall':'expressInstall.swf', // expressInstall.swf文件的路径
        'fileTypeDesc':'支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
        	//每次更新上载的文件的进展
            //有时候上传进度什么想自己个性化控制，可以利用这个方法
            //使用方法见官方说明
        }, 'onSelect' : function(file) { // 选择上传文件后调用
                  
        },
        'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
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
        }, 'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
        	var dateObj=eval("("+data+")");
        	if(dateObj.errorCode==0){
        		 bootbox.prompt("请输入备注：", function(result) {                
					if (result === null) {                                             
					                                  
					} else {
						var options ={
						  	"orderDesignPicture.picturePath":dateObj.resUrl,
							"orderDesignPicture.uploadFileName":dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent":result,
							"orderDesignPicture.orderId":decorationOrderDetail.decorationOrderId
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
        'successTimeout':99999,
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
        'uploader':decorationOrderDetail.mediaServer + api.common.uploadOther.url,
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
        }, 'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
        	var dateObj=eval("("+data+")");
        	if(dateObj.errorCode==0){
        		 bootbox.prompt("请输入备注：", function(result) {                
					if (result === null) {                                             
					                                  
					} else {
						var options ={
						  	"orderDesignPicture.picturePath":dateObj.resUrl,
							"orderDesignPicture.uploadFileName":dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent":result,
							"orderDesignPicture.orderId":decorationOrderDetail.decorationOrderId
							};
						com.post(api.decoration.addOrderDesignPictureForCAD, options, function(res){
							if(res.errorCode==0){
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
			com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options, function(res){
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

//------------------------------------------------------------------报价信息----------------------------------------------

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell){
	return $('input', cell).val();
}
