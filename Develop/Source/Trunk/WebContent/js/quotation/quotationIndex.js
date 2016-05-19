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
	
	decorationQuotation.quotationItems.autoId = $("#autoId");
	decorationQuotation.quotationItems.quotationName = $("#quotationName");
	decorationQuotation.quotationItems.decorationStyle = $("#decorationStyle");
	decorationQuotation.quotationItems.quotationContent = $("#quotationContent");
	decorationQuotation.quotationItems.quotationNames = $('#quotationNames');
	decorationQuotation.quotationItems.replicaOrderId = $('#replicaOrderId').on("blur", function(){
		
		var options = {
			"quotation.orderId": $(this).val(),
		}
		
		com.post(api.quotation.queryQuotationByOrderId, options, function(res){
			decorationQuotation.quotationItems.quotationNames.bindData(res.quotations, 'autoId', 'quotationName');
		});
	});
	
	decorationQuotation.quotationModal = $('#quotationModal');
	decorationQuotation.replicaQuotationModal = $('#replicaQuotationModal');
	
	$('#saveBtn').click(function(){
		
		if(decorationQuotation.canChangeStatus > 0){
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
					"quotation.quotationContent":$("#quotationContent").val()
				};
				
				com.post(api.quotation.addQuotation, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "操作成功");
					}else{
						com.showAlert(com.info, "操作失败");
					}
					
					initQuotationList();
					
					btn.button("reset");
				}, function(error){
					btn.button("reset");
				});
				
			}else if(decorationQuotation.editFlg == 1){
				var options = {
					"quotation.orderId":decorationQuotation.decorationOrderId,
					"quotation.autoId":$("#autoId").val(),
					"quotation.quotationName":$("#quotationName").val(),
					"quotation.decorationStyle":$("#decorationStyle").val(),
					"quotation.quotationContent":$("#quotationContent").val()
				};
				
				com.post(api.quotation.updateQuotation, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "操作成功");
					}else{
						com.showAlert(com.error, "操作失败");
					}
					
					initQuotationList();
					
					btn.button("reset");
				}, function(error){
					btn.button("reset");
				});
			}else{
				var options = {
					"quotation.autoId": $("#autoId").val(),
					"quotation.orderId": decorationQuotation.decorationOrderId,
					"quotation.quotationName": $("#quotationName").val(),
					"quotation.decorationStyle": $("#decorationStyle").val(),
					"quotation.quotationContent": $("#quotationContent").val()
				};
				
				com.post(api.quotation.copyQuotation, options, function(res){
					if(res.errorCode == 0){
						com.showAlert(com.info, "操作成功");
					}else{
						com.showAlert(com.info, "操作失败");
					}
					
					initQuotationList();
					
					btn.button("reset");
				}, function(error){
					btn.button("reset");
				});
			}
		
		}else{
			bootbox.alert("该报价已经不可以修改");
		}
	});
	
	$("#replicaBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"replicaOrderId":decorationQuotation.quotationItems.quotationNames.val(),
			"quotation.orderId":decorationQuotation.decorationOrderId,
		};
		
		var btn = $(this).button('loading');
		
		com.post(api.quotation.replicaQuotation, options, function(res){
			if(res.errorCode == 0){
				com.showAlert(com.info, "操作成功");
			}else{
				com.showAlert(com.error, res.errorMsg);
			}
			
			initQuotationList();
			
			btn.button("reset");
		}, function(res){
			btn.button("reset");
		});
		
		decorationQuotation.replicaQuotationModal.modal("hide");
	});
	
	$('#btnBack').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	});
	
	$('#createQuotation').on(ace.click_event, function(){
		if(decorationQuotation.canChangeStatus > 0){
			decorationQuotation.editFlg = 0;
			
			com.clearValidator();
			com.cleanItems(decorationQuotation.quotationItems);
			
			decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
			decorationQuotation.quotationModal.modal("show");
		}else{
			bootbox.alert("该报价已经不可以修改");
		}
	});
	
	$('#replicaQuotation').on(ace.click_event, function(){
		com.clearValidator();
		com.cleanItems(decorationQuotation.quotationItems);
		
		decorationQuotation.quotationItems.quotationNames.bindData([], 'autoId', 'quotationName');
		
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
				
				var autoId = res.quotations[i].autoId;
				
				var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").appendTo(quotationList);
				var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);
				var quotationWidgetHeader = $('<div></div>').addClass("widget-header").appendTo(quotationWidget);
				
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
				var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').text('备注:'+res.quotations[i].quotationContent).appendTo(quotationWidgetDivSix);
				
				var quotationHr = $('<hr></hr>');
				
				var quotationWidgetToolDiv = $('<div></div>').addClass("ui-pg-div").appendTo(quotationWidgetMain);
				var copySpan = $('<span></span>').addClass('ui-icon icon-copy blue').attr('title', '复制').attr('id', 'copyQuotation_'+autoId).attr('data', autoId).attr('data-rel', 'tooltip').attr('data-original-title', '复制').appendTo(quotationWidgetToolDiv);
				var editSpan = $('<span></span>').addClass('ui-icon icon-pencil blue').attr('title', '修改').attr('id', 'editQuotation_'+autoId).attr('data', autoId).attr('data-rel', 'tooltip').attr('data-original-title', '修改').appendTo(quotationWidgetToolDiv);
				var editDetailSpan = $('<span></span>').addClass('ui-icon icon-edit blue').attr('title', '报价').attr('id', 'editQuotationDetail_'+autoId).attr('data', autoId).attr('data-rel', 'tooltip').attr('data-original-title', '报价').appendTo(quotationWidgetToolDiv);
				var deleteSpan = $('<span></span>').addClass('ui-icon ui-icon-trash').attr('title', '删除').attr('id', 'deleteQuotation_'+autoId).attr('data', autoId).attr('data-rel', 'tooltip').attr('dataname', res.quotations[i].quotationName).attr('data-original-title', '删除').appendTo(quotationWidgetToolDiv);
				
				var statusDiv = $('<div></div>').addClass('pull-right inline').appendTo(quotationWidgetToolDiv);
				var statusInput = $('<input></input>').attr('id', 'id-button-borders_'+autoId).addClass('ace ace-switch ace-switch-5').attr('data', autoId).attr('type', 'checkbox');
				var statusSpan = $('<span></span>').addClass('lbl');
				
				if(res.quotations[i].status == 1){
					statusInput.attr('checked', 'checked');
				}
				
				statusInput.appendTo(statusDiv);
				statusSpan.appendTo(statusDiv);
			}
			
			$(".ui-icon.icon-copy.blue").on(ace.click_event, function(){
				if(decorationQuotation.canChangeStatus > 0){
					decorationQuotation.editFlg = 2;
					com.clearValidator();
					com.cleanItems(decorationQuotation.quotationItems);
					decorationQuotation.quotationItems.autoId.val($(this).attr("data"));
					decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
					decorationQuotation.quotationModal.modal("show");
				}else{
					bootbox.alert("该报价已经不可以修改");
				}
			});
			
			$(".ui-icon.icon-pencil.blue").on(ace.click_event, function(){
				decorationQuotation.editFlg = 1;
				com.clearValidator();
				com.post(api.quotation.queryQuotationById, {"quotation.autoId":$(this).attr("data")} ,function(res){
					if(res.quotation != null){
						decorationQuotation.quotationItems.autoId.val(res.quotation.autoId);
						decorationQuotation.quotationItems.quotationName.val(res.quotation.quotationName);
						decorationQuotation.quotationItems.decorationStyle.val(res.quotation.decorationStyle);
						decorationQuotation.quotationItems.quotationContent.val(res.quotation.quotationContent);
						decorationQuotation.quotationModal.modal("show");
					}
				});
			});
			
			$(".ace.ace-switch.ace-switch-5").on(ace.click_event, function(){
				if(decorationQuotation.canChangeStatus > 0){
					com.post(api.quotation.changeQuotationForDefault, {"quotation.autoId":$(this).attr("data"), "quotation.orderId":decorationQuotation.decorationOrderId}, function(res){
						initQuotationList();
					});
				}else{
					bootbox.alert("该报价已经不可以修改");
				}
			});
			
			$(".ui-icon.ui-icon-trash").on(ace.click_event, function(){
				if($("#id-button-borders_"+$(this).attr("data")).attr("checked")){
					bootbox.alert("默认报价不能删除");
					initQuotationList();
					return;
				}
				
				if(decorationQuotation.canChangeStatus > 0){
					var autoData = $(this).attr("data");
					bootbox.confirm("确定要删除报价("+$(this).attr("dataname")+")?",function(result){
						if(result){
							com.post(api.quotation.deleteQuotationById, {"quotation.autoId":autoData,"quotation.orderId":decorationQuotation.decorationOrderId}, function(res){
								initQuotationList();
							});
						}
					});
				}else{
					bootbox.alert("该报价已经不可以修改");
				}
			});
			
			$(".ui-icon.icon-edit.blue").on(ace.click_event, function(){
				
				if(decorationQuotation.canChangeStatus > 0){
					setTimeout("editQuotationDetail('"+$(this).attr("data")+"')", 300);
				}else{
					bootbox.alert("该报价已经不可以修改");
				}
			});
			
			$('[data-rel=tooltip]').tooltip();
		}
	});
	
	com.post(api.quotation.queryQuotationForStatusByOrderId,{"quotation.orderId":decorationQuotation.decorationOrderId},function(res){
		decorationQuotation.canChangeStatus = res.canChange;
	});
}

function editQuotationDetail(quotationId){
	
	params["orderId"] = decorationQuotation.decorationOrderId;
	params["quotationId"] = quotationId;
	
	$("#fl-container").load(api.index.quotationDetailIndex.url);
}
