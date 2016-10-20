var decorationQuotation = {
	decorationOrderId: null,
	initQuotationList: initQuotationList,
	canChangeStatus: 0,
	
	quotationItems:{},
	
	editFlg: 0
};

jQuery(function($) {
	$('#fl-statement').statement("装修订单报价", "报价信息列表");
	
	decorationQuotation.decorationOrderId = decorationOrderPostData.decorationOrderId;
	decorationQuotation.type = decorationOrderPostData.decorationOrderType;
	
	decorationQuotation.quotationItems.qid = $("#qid");
	decorationQuotation.quotationItems.quotationName = $("#quotationName");
	decorationQuotation.quotationItems.decorationStyle = $("#decorationStyle");
	decorationQuotation.quotationItems.content = $("#content");
	decorationQuotation.quotationItems.quotationNames = $('#quotationNames');
	decorationQuotation.quotationItems.replicaOrderId = $('#replicaOrderId').on("blur", function(){
		
		var options = {
			"quotation.orderId": $(this).val(),
		}
		
		com.post(api.quotation.queryQuotationByOrderId, options, function(res){
			decorationQuotation.quotationItems.quotationNames.bindData(res.quotations, 'qid', 'quotationName');
		});
	});
	
	decorationQuotation.quotationModal = $('#quotationModal');
	decorationQuotation.replicaQuotationModal = $('#replicaQuotationModal');
	
	$('#saveBtn').click(function(){
		
		if(com.validate()){
			return;
		}
		
		decorationQuotation.quotationModal.modal("hide");
		
		var btn = $(this).button('loading');
		
		if(decorationQuotation.editFlg == 0){
		
			var options = {
				"quotation.orderId":decorationQuotation.decorationOrderId,
				"quotation.quotationName":$("#quotationName").val(),
				"quotation.decorationStyle":$("#decorationStyle").val(),
				"quotation.content":$("#content").val(),
			};
			
			com.post(api.quotation.addQuotation, options, function(res){
				com.showAlert(com.info, "操作成功");
				initQuotationList();
				
			}, null, false);
			
			btn.button("reset");
			
		}else if(decorationQuotation.editFlg == 1){
			var options = {
				"quotation.orderId":decorationQuotation.decorationOrderId,
				"quotation.qid":$("#qid").val(),
				"quotation.quotationName":$("#quotationName").val(),
				"quotation.decorationStyle":$("#decorationStyle").val(),
				"quotation.content":$("#content").val()
			};
			
			com.post(api.quotation.updateQuotation, options, function(res){
				com.showAlert(com.info, "操作成功");
				initQuotationList();
			}, null, false);
			
			btn.button("reset");
		}else{
			var options = {
				"quotation.qid": $("#qid").val(),
				"quotation.orderId": decorationQuotation.decorationOrderId,
				"quotation.quotationName": $("#quotationName").val(),
				"quotation.decorationStyle": $("#decorationStyle").val(),
				"quotation.content": $("#content").val(),
			};
			
			com.post(api.quotation.copyQuotation, options, function(res){
				com.showAlert(com.info, "操作成功");
				initQuotationList();
			}, null, false);
			
			btn.button("reset");
		}
	});
	
	$("#replicaBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"quotation.qid":decorationQuotation.quotationItems.quotationNames.val(),
			"quotation.orderId":decorationQuotation.decorationOrderId,
		};
		
		van = $(this).button('loading');
		
		com.post(api.quotation.replicaQuotation, options, function(res){
			com.showAlert(com.info, "操作成功");
			initQuotationList();
		}, null, false);
		
		btn.button("reset");
		
		decorationQuotation.replicaQuotationModal.modal("hide");
	});
	
	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.decorationOrderDesignerIndex.url);
	});
	
	$('#createQuotation').on(ace.click_event, function(){
		decorationQuotation.editFlg = 0;
		
		com.clearValidator();
		com.cleanItems(decorationQuotation.quotationItems);
		
		decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
		decorationQuotation.quotationModal.modal("show");
	});
	
	$('#replicaQuotation').on(ace.click_event, function(){
		com.clearValidator();
		com.cleanItems(decorationQuotation.quotationItems);
		
		decorationQuotation.quotationItems.quotationNames.bindData([], 'qid', 'quotationName');
		
		decorationQuotation.replicaQuotationModal.modal("show");
	});
	
	initQuotationList();
});

function initQuotationList(){
	
	var options = {
		"quotation.orderId": decorationQuotation.decorationOrderId,
	}

	com.post(api.quotation.queryQuotationByOrderId, options, function(res){
		if(res.errorCode == 0){
			var html = "";
			
			if(res.quotations == null || res.quotations.length == 0){
				return ;
			}
			
			var quotationList = $("#quotationList").html("");
			
			for(var i = 0;i<res.quotations.length;++i){
				
				var qid = res.quotations[i].qid;
				
				var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").appendTo(quotationList);
				var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);
				var quotationWidgetHeader = $('<div></div>').addClass("widget-header header-color-blue").appendTo(quotationWidget);
				
				if(res.quotations[i].saveStatus == 0){
					quotationWidgetHeader.addClass("header-color-red");
				}
				
				var quotationName = $('<h4></h4>').text(res.quotations[i].quotationName).appendTo(quotationWidgetHeader);
				
				var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
				var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
				var quotationWidgetInfoDiv = $('<div></div>').addClass("col-md-12").appendTo(quotationWidgetMain);
				
				var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').text('名称:'+res.quotations[i].quotationName).appendTo(quotationWidgetDivOne);
				var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').text('风格:'+res.quotations[i].decorationStyle).appendTo(quotationWidgetDivTwo);
				var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').text('时间:'+res.quotations[i].createTime).appendTo(quotationWidgetDivThr);
				var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').text('总价:'+res.quotations[i].totalPrice).appendTo(quotationWidgetDivFiv);
				var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').text('备注:'+res.quotations[i].content).appendTo(quotationWidgetDivSix);
				
				var quotationHr = $('<hr></hr>');
				
				var quotationWidgetToolDiv = $('<div></div>').addClass("ui-pg-div").appendTo(quotationWidgetMain);
				var copySpan = $('<span></span>').addClass('ui-icon icon-copy blue').attr('title', '复制').attr('id', 'copyQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '复制').appendTo(quotationWidgetToolDiv);
				var editSpan = $('<span></span>').addClass('ui-icon icon-pencil blue').attr('title', '修改').attr('id', 'editQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '修改').appendTo(quotationWidgetToolDiv);
				var editDetailSpan = $('<span></span>').addClass('ui-icon icon-edit blue').attr('title', '报价').attr('id', 'editQuotationDetail_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '报价').appendTo(quotationWidgetToolDiv);
				var deleteSpan = $('<span></span>').addClass('ui-icon ui-icon-trash').attr('title', '删除').attr('id', 'deleteQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('dataname', res.quotations[i].quotationName).attr('data-original-title', '删除').appendTo(quotationWidgetToolDiv);
				
				var statusDiv = $('<div></div>').addClass('pull-right inline').appendTo(quotationWidgetToolDiv);
				var statusInput = $('<input></input>').attr('id', 'id-button-borders_'+qid).addClass('ace ace-switch ace-switch-5').attr('data', qid).attr('type', 'checkbox');
				var statusSpan = $('<span></span>').addClass('lbl');
				
				if(res.quotations[i].status == 1){
					statusInput.attr('checked', 'checked');
				}
				
				statusInput.appendTo(statusDiv);
				statusSpan.appendTo(statusDiv);
			}
			
			$(".ui-icon.icon-copy.blue").on(ace.click_event, function(){
				decorationQuotation.editFlg = 2;
				com.clearValidator();
				com.cleanItems(decorationQuotation.quotationItems);
				decorationQuotation.quotationItems.qid.val($(this).attr("data"));
				decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
				decorationQuotation.quotationModal.modal("show");
			});
			
			$(".ui-icon.icon-pencil.blue").on(ace.click_event, function(){
				decorationQuotation.editFlg = 1;
				com.clearValidator();
				com.post(api.quotation.queryQuotationById, {"quotation.qid":$(this).attr("data")} ,function(res){
					if(res.quotation != null){
						decorationQuotation.quotationItems.qid.val(res.quotation.qid);
						decorationQuotation.quotationItems.quotationName.val(res.quotation.quotationName);
						decorationQuotation.quotationItems.decorationStyle.val(res.quotation.decorationStyle);
						decorationQuotation.quotationItems.content.val(res.quotation.content);
						decorationQuotation.quotationModal.modal("show");
					}
				});
			});
			
			$(".ace.ace-switch.ace-switch-5").on(ace.click_event, function(){
				com.post(api.quotation.changeQuotationForDefault, {"quotation.qid":$(this).attr("data"), "quotation.orderId":decorationQuotation.decorationOrderId}, function(res){
					initQuotationList();
				});
			});
			
			$(".ui-icon.ui-icon-trash").on(ace.click_event, function(){
				if($("#id-button-borders_"+$(this).attr("data")).attr("checked")){
					bootbox.alert("默认报价不能删除");
					initQuotationList();
					return;
				}
				
				var autoData = $(this).attr("data");
				bootbox.confirm("确定要删除报价("+$(this).attr("dataname")+")?",function(result){
					if(result){
						com.post(api.quotation.deleteQuotationById, {"quotation.qid":autoData,"quotation.orderId":decorationQuotation.decorationOrderId}, function(res){
							initQuotationList();
						});
					}
				});
			});
			
			$(".ui-icon.icon-edit.blue").on(ace.click_event, function(){
//				setTimeout("editQuotationDetail('"+$(this).attr("data")+"')", 300);
				
				params["orderId"] = decorationQuotation.decorationOrderId;
				params["quotationId"] = $(this).attr("data");
				
				com.switchPage(api.index.quotationDetailIndex.url);
			});
			
			$('[data-rel=tooltip]').tooltip();
		}
	});
}

function editQuotationDetail(quotationId){
	
	params["orderId"] = decorationQuotation.decorationOrderId;
	params["quotationId"] = quotationId;
	
	com.switchPage(api.index.quotationDetailIndex.url);
}
