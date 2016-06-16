var message={
	listgrid: null,
	gridPager: null,
	
	messageItems: {},
	
	READED: "已读",
	UNREAD: "未读",
	
	currMessageId: "",
	
	editFlag: false,
	repeatFlg: false,
};

messagePostData = {};

jQuery(function($){
	message.listgrid = $("#listgrid");
	message.gridPager = "#gridPager";
	message.saveBtn = $("#saveBtn").on("click", saveData);
	message.cancelBtn = $("#cancelBtn");
	message.messageList = $("#messageList");
	message.messageDetail = $("#messageDetail");
	
	message.isPerformance = $("#isPerformance").switchBtn("isOrNot");
	$("#performanceSaveBtn").on("click", function(){
		var isPerformance = com.isOrNotType[message.isPerformance.prop("checked")];
		var options = {'message.messageId': message.currMessageId, 'approveParams': "pass"};
		
		if(isPerformance == "是"){
			options['approveParams'] += "-1";
		}else{
			options['approveParams'] += "-0";
		}
		
		com.post(api.information.approveMessage, options, function(){
			$("#discountModal").modal("hide");
			$(".approve-btn").prop("disabled", true);
			
			com.showAlert(com.info, "操作成功");
		});
	});
	
	message.modal = $("#messageModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	message.messageItems.receiver = $("#receiver");
	message.messageItems.contents = $("#contents");
	
	$(".approve-btn").on("click", function(){
		var passCard = this.id == "passBtn" ? "pass" : "refuse";
		
		if(this.id == "passBtn" && message.currArgs.type == "orderDiscountApprove" && parseFloat(message.currArgs.newDiscount) < 7.5){
			$("#discountModal").modal("show");
			message.isPerformance.prop('checked', com.isOrNotType["否"]);
			
			return false;
		}
		
		var options = {
			'message.messageId': message.currMessageId, 
			'approveParams': passCard
		};
		
		com.post(api.information.approveMessage, options, function(){
			$(".approve-btn").prop("disabled", true);
			com.showAlert(com.info, "操作成功");
		});
	});
	
	$("#returnBtn").on("click", function(){
		$(".sysMessage").text("系统消息");
		message.messageList.show();
		message.messageDetail.hide();
		$.jgrid.refreshGrid(message.listgrid);
	});
	
	initializeListgrid();
});

function initializeListgrid(){
	message.listgrid.jqGrid({	
		url: api.information.pageMessage.url,
		colNames:['编号', '消息分类', '内容', '状态', '发送人','时间', '消息参数'],
		colModel:[
		    {name:'messageId', hidden:true},
			{name:'type', width:30, formatter:messageTypeFormat},
			{name:'contents', formatter:contentFormat}, 
			{name:'status', width:15, formatter:contentFormat},
			{name:'sender', width:15, jsonmap:'sender.userName', formatter:contentFormat},
			{name:'createTime', width:35, formatter:contentFormat},
			{name:'args', hidden:true}
		], 
		pager : message.gridPager
	});

	message.listgrid.navGrid(message.gridPager, {edit:false, add:false, del:false, search:false, refresh:false, view:false}, {}, {}).navButtonAdd(message.gridPager, {
		caption: "",
		buttonicon: 'icon-eye-open blue',
		title: "标记已读",
		onClickButton: function(){    
			var nums = message.listgrid.jqGrid("getGridParam", 'selarrrow');
			if(nums==null || nums.length ==0){
				$.jgrid.showSelectInfo(message.listgrid.attr("id"));
				return;
			}
			var options = {};
			for(var i = 0; i< nums.length; i++){
				var row = message.listgrid.jqGrid('getRowData', nums[i]);
				options["messageIds["+i+"]"] = row.messageId;
			}
			com.post(api.information.updateMessageForRead, options, successCallback);
		},
		position: 'first'
	}).navButtonAdd(message.gridPager, {
		caption: "",
		buttonicon: 'ui-icon icon-envelope purple',
		title: "发送消息",
		onClickButton: function(){    
			message.editFlg = false;
			com.cleanItems(message.messageItems);
			
			initChange("receiver", "receiver", api.personel.queryUserForNameByPinyinName, {});
			$("#receiver_chosen").css("width", "50%");
			
			message.modal.modal("show");
		},
		position: 'first'
	});
}

function contentFormat( cellvalue, options, row ){  
	return row.status == message.READED ? cellvalue : "<b>"+cellvalue+"</b>";
}

function messageTypeFormat(cellvalue, options, row){  
	var cell = row.status == message.READED ? cellvalue : "<b>"+cellvalue+"</b>";
	return '<a href="javascript:messageDetail(\''+row.messageId+'\', \''+row.type+'\', \''+row.sender.userName+'\', \''+row.createTime+'\', \''+row.contents+'\', \''+row.args+'\');">' + cell + '</a>';
}

function saveData(){
	
	if(com.validate() || message.repeatFlg)
		return;
	
	var options = {
		"message.receiver.userId": message.messageItems.receiver.val(),
		"message.contents": message.messageItems.contents.val(),
		"message.type": "个人消息",
	};
	
	com.post(api.information.sendMessage, options, function(){
		message.modal.modal("hide");
		successCallback();
	});
}

function messageDetail(messageId, type, sender, createTime, contents, args){
	
	$('.uselessMsg').hide();
	message.currMessageId = messageId;
	
	$(".approve-btn").hide();
	
	$(".sender").text(sender);
	$(".createTime").text(createTime);
	$(".contents").html(contents);
	$(".sysMessage").text(type);
	
	message.messageList.hide();
	message.messageDetail.show();
	
	com.post(api.information.updateMessageForRead, {"messageIds[0]": messageId}, successCallback);
}

function successCallback(){
	$.jgrid.refreshGrid(message.listgrid);
	loadMessageCount();
}

function initChange(id, postId, queryElementsUrl, options){
	
	id = "#" + id;
	var chosenNameId = id+"_chosen input";
	
	$(id).chosen({
	    allow_single_deselect: true
	});
	
	$(id).on("change", function(){
		messagePostData[postId] = $(id).val();
	});
	
	$(chosenNameId).bind("input", function(){
		var autoFileSearchValue = $(chosenNameId).val();
		if(autoFileSearchValue == ""){
			return false;
		}
		options["pinyinName"] = autoFileSearchValue;
		com.post(queryElementsUrl, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillKeyValue != null){
					for(var i=0;i<res.autoFillKeyValue.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				$(id).html(html1).trigger("chosen:updated");
				$(chosenNameId).val(autoFileSearchValue);
			}
		});
	});
}