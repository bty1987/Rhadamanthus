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

	decorationQuotation.quotationItems.quotationType = $('#quotationType').on('change', function(){
		if($(this).val() == 1) $('#setpackage').addClass('v_required').removeAttr('disabled');
		else $("#setpackage").removeClass('v_required').attr('disabled', true).val('');
	});
	decorationQuotation.quotationItems.setpackage = $('#setpackage');

	decorationQuotation.quotationModal = $('#quotationModal');
	decorationQuotation.replicaQuotationModal = $('#replicaQuotationModal');

	com.post(api.ds.quotationInfo, {}, function(res){
		if(res.setpackage.length){
			$('#setpackage').bindData(res.setpackage, 'key', 'value');
			$("<option value='' selected>请选择</option>").insertBefore($('option:eq(0)','#setpackage'))
		}
	});
	
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

				"quotation.type": $('#quotationType').val(),
				"quotation.setpackage": $('#setpackage').val() ? $('#setpackage').val() : 0
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
				"quotation.content":$("#content").val(),
				"quotation.type": $('#quotationType').val(),
				"quotation.setpackage": $('#setpackage').val() ? $('#setpackage').val() : 0
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
		decorationQuotation.quotationItems.quotationType.get(0).selectedIndex = 0;

		decorationQuotation.quotationItems.quotationType.removeAttr('v_required');
		$('#setpackage').attr('disabled',true).removeClass('v_required');


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
			var quotationList2 = $("#quotationList2").html("");

			for(var i = 0;i<res.quotations.length;++i){
				
				var $q = res.quotations[i];
				var qid = $q.qid;
				var totalPrice = $q.type == 0 ? $q.totalPrice : utils.accAdd(utils.accAdd($q.basicPrice, $q.qdiff), $q.mdiff);
				
				var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").appendTo($q.type == 0 ? quotationList : quotationList2);
				var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);
				var quotationWidgetHeader = $('<div></div>').addClass("widget-header " + ($q.type == 0 ? 'header-color-blue' : 'header-color-green')).appendTo(quotationWidget);
				
				if($q.saveStatus == 0){
					quotationWidgetHeader.addClass("header-color-red");
				}
				
				var quotationName = $('<h4></h4>').text($q.quotationName).appendTo(quotationWidgetHeader);
				
				var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
				var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
				var quotationWidgetInfoDiv = $('<div></div>').addClass("col-md-12").appendTo(quotationWidgetMain);
				
				var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').text('名称:'+$q.quotationName).appendTo(quotationWidgetDivOne);
				var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').text('风格:'+$q.decorationStyle).appendTo(quotationWidgetDivTwo);
				var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').text('时间:'+$q.createTime).appendTo(quotationWidgetDivThr);
				var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').text('总价:'+totalPrice).appendTo(quotationWidgetDivFiv);
				var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
				var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').text('备注:'+$q.content).appendTo(quotationWidgetDivSix);
				
				var quotationHr = $('<hr></hr>');
				
				var quotationWidgetToolDiv = $('<div></div>').addClass("ui-pg-div").appendTo(quotationWidgetMain);
				var copySpan = $('<span></span>').addClass('ui-icon icon-copy blue').attr('title', '复制').attr('id', 'copyQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '复制').appendTo(quotationWidgetToolDiv);
				var editSpan = $('<span></span>').addClass('ui-icon icon-pencil blue').attr('title', '修改').attr('id', 'editQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '修改').appendTo(quotationWidgetToolDiv);
				var editDetailSpan = $('<span></span>').addClass('ui-icon icon-edit blue').attr('title', '报价').attr('id', 'editQuotationDetail_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '报价').appendTo(quotationWidgetToolDiv).attr('data-type', $q.type);
				var deleteSpan = $('<span></span>').addClass('ui-icon ui-icon-trash').attr('title', '删除').attr('id', 'deleteQuotation_'+qid).attr('data', qid).attr('data-rel', 'tooltip').attr('dataname', $q.quotationName).attr('data-original-title', '删除').appendTo(quotationWidgetToolDiv);
				
				var statusDiv = $('<div></div>').addClass('pull-right inline').appendTo(quotationWidgetToolDiv);
				var statusInput = $('<input></input>').attr('id', 'id-button-borders_'+qid).addClass('ace ace-switch ace-switch-5').attr('data', qid).attr('type', 'checkbox');
				var statusSpan = $('<span></span>').addClass('lbl');
				
				if($q.status == 1){
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


				com.post(api.quotation.queryQuotationById, {"quotation.qid":$(this).attr("data")} ,function(res){
					if(res.quotation != null){
						decorationQuotation.quotationItems.quotationType.val(res.quotation.type);
						decorationQuotation.quotationItems.setpackage.val(res.quotation.setpackage);
						$('#quotationType').attr('disabled',true);
						if(res.quotation.type == 1)$('#setpackage').removeAttr('disabled').addClass('v_required');
						else $('#setpackage').attr('disabled',true).removeClass('v_required');

						decorationQuotation.quotationModal.modal("show");
					}
				});
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
						decorationQuotation.quotationItems.quotationType.val(res.quotation.type);
						decorationQuotation.quotationItems.setpackage.val(res.quotation.setpackage);

						$('#quotationType').attr('disabled',true);
						if(res.quotation.type == 1)$('#setpackage').removeAttr('disabled').addClass('v_required');
						else $('#setpackage').attr('disabled',true).removeClass('v_required');

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
				//setTimeout("editQuotationDetail('"+$(this).attr("data")+"')", 300);

				editQuotationDetail($(this).attr("data"), $(this).attr("data-type"));
			});
			
			$('[data-rel=tooltip]').tooltip();
		}
	});
}

function editQuotationDetail(quotationId, type){
	
	params["orderId"] = decorationQuotation.decorationOrderId;
	params["quotationId"] = quotationId;

	if(type == 0){
		com.switchPage(api.index.quotationPartIndex.url);
	}
	if(type == 1){
		com.switchPage(api.index.quotationWholeIndex.url);
	}
}
