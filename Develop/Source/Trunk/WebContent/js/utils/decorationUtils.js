var decorationUtils = {
	createDecorationOrderCondition: function(listGrid, queryUrl, searchDivId, postParms, postDataName){
		
		var conditions = [
			{label:"订单编号", id:"orderId", name:"orderId", type:'text', op:"eq"},
			{label:"楼盘", id:"village", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"楼号", id:"houseNumber", name:"houseNumber", type:"text"},
			{label:"面积", id:"houseArea", name:"houseArea", type:"text", op:"eq"},
			{label:"客户电话", id:"customerPhone", name:"customerPhone", type:"text"},
			{label:"设计师", id:"designer", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
			{label:"业务员", id:"salesman", name:"salesman", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
		];
		
		var condition = 0;
		var _postParms = {};
		
		var designerRegions = [];
		var designerDepartment = [];
		var salesmanRegions = [];
		var salesmanDepartment = [];
		
		var statusData = {};
		var houseClass = {};
		
		com.post(api.ds.decorationInfo, {"timestamp": new Date().getTime()}, function(res){
			statusData = res.decorationOrderStatus;
		}, null, false);
		
		com.post(api.ds.houseInfo, {"timestamp": new Date().getTime()}, function(res){
			houseClass = res.houseClass;
		}, null, false);
		
		com.post(api.decoration.queryDecorationOrderForCondition, {}, function(res){
			
			condition = res.condition;
			
			if(condition == 0){
				return conditions;
			}
			if((condition & 1) == 1){ // 设计师
				//conditions.push();
			}
			if((condition & 2) == 2){ // 业务员
				//conditions.push();
			}
			if((condition & 4) == 4){ // 设计中心
				conditions.push({label:"设计中心", id:"designerRegionId", name:"designerRegionId", type:"select", op:"eq"});
			}
			if((condition & 8) == 8){ // 设计部
				conditions.push({label:"设计部", id:"designerDepartmentId", name:"designerDepartmentId", type:"select", op:"eq"});
			}
			if((condition & 16) == 16){ // 业务中心
				conditions.push({label:"业务中心", id:"salesmanRegionId", name:"salesmanRegionId", type:"select", op:"eq"});
			}
			if((condition & 32) == 32){ // 业务部
				conditions.push({label:"业务部", id:"salesmanDepartmentId", name:"salesmanDepartmentId", type:"select", op:"eq"});
			}
			if((condition & 64) == 64){ // 量尺时间
				conditions.push({label:"量尺时间", id:"createTimeDateRange", name:"createTimeDateRange", type:"dateRangePicker"});
			}
			if((condition & 128) == 128){ // 签单时间
				conditions.push({label:"签单时间", id:"signTimeDateRange", name:"signTimeDateRange", type:"dateRangePicker"});
			}
		}, null, false);
		
		conditions.push({label:"房屋类型", id:"houseClass", name:"houseClass", type:"select", op:"eq", data:houseClass});
		conditions.push({label:"状态", id:"status", name:"status", type:"select", op:"eq", data:statusData});
		
		for(var k in postParms){
			_postParms[k] = postParms[k];
		}
		
		$("#" + searchDivId).flSearch({
			url: queryUrl,
			postDataName: postDataName,
			postParmas: _postParms,
			listgrid: listGrid,
			items: conditions
		});
		
		com.post(api.department.queryDepartment, {"dept.type": "all"}, function(res){
			var deptList = res.deptList;
			
			for(var i=0;i<deptList.length;i++){
				
				var dept = deptList[i];
				var type = dept.type;
				
				if(type == "设计部"){
					designerDepartment.push(dept);
				}else if(type == "设计大区"){
					designerRegions.push(dept);
					salesmanRegions.push(dept);
				}else if(type == "业务大区"){
					salesmanRegions.push(dept);
				}
				
				salesmanDepartment.push(dept); // 业务部
			}
			
			if(condition & 4 == 4){
				$("#designerRegionId").bindData(designerRegions, 'deptId', 'deptName', true);
			}
			if(condition & 8 == 8){
				$("#designerDepartmentId").bindData(designerDepartment, 'deptId', 'deptName', true);
			}
			if(condition & 16 == 16){
				$("#salesmanRegionId").bindData(salesmanRegions, 'deptId', 'deptName', true);
			}
			if(condition & 32 == 32){
				$("#salesmanDepartmentId").bindData(salesmanDepartment, 'deptId', 'deptName', true);
			}
		}, null, false);
	},	loadQuotationDetail: function(){
		
		var quotation = null;
		
		decorationOrderDetail.quotationDetail = {};
		
		com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": decorationOrderDetail.decorationOrderId}, function(res){
			decorationOrderDetail.quotation = res.quotation;
		}, null, false);
		
		var quotationId = decorationOrderDetail.quotation.qid;
		
		if(quotationId){
			$("#printProjectBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=1");
			$("#printFinanceBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=2");
			$("#printCustomerBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=3");
			
			com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": quotationId}, function(res){
				decorationOrderDetail.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
			}, null, false);
			
			var addReduceIds = {};
			
			com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": decorationOrderDetail.decorationOrderId}, function(res){
				var addReduces = res.addReduces;
				
				console.log(addReduces);
				
				var n = 0;
				
				$.each(addReduces, function(i, v){
					v.type == 0 && (addReduceIds["addReduceIds[" + n + "]"] = v.arId, n++);
				});
				
			}, null, false);
			
			console.log(addReduceIds);
			
			com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function(res){
				decorationOrderDetail.quotationDetail.addReduceItems = res.addReduceItems;
			}, null, false);
			
			console.log(decorationOrderDetail.quotationDetail.addReduceItems);
			
			decorationUtils.initQuotationDetailItem(decorationOrderDetail.quotation, decorationOrderDetail.quotationDetail.quotationFunctionAreas, decorationOrderDetail.quotationDetail.addReduceItems);
			
			decorationUtils.initQuotationDetail();
			
			$("#showWay").on("change", function() {
				decorationUtils.initQuotationDetail();
			});
		}else{
			$("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
		}
	}, initQuotationDetailItem: function(quotation, quotationFunctionAreas, addReduceItems) {
		
		var discount = quotation.discount;
		
		var quotationFunctionAreaItemCs = {};
		var quotationFunctionAreaItemWs = {};
		
		var quotationFunctionAreaLength = quotationFunctionAreas.length;

		for(var i=0;i<quotationFunctionAreaLength;++i) {
			
			var quotationFunctionAreaTotal = 0;
			
			var quotationFunctionArea = quotationFunctionAreas[i];
			var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
			var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
			
			quotationFunctionAreaItemCs[quotationFunctionArea.functionAreaName] = [];
			
			for(var j=0;j<quotationFunctionAreaItemLength;j++) {
				
				var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

				if(!quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType]){
					quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType] = [];
				}
				
				var _dcp = quotationFunctionAreaItem.type < 2 ?  utils.changeTwoDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, (quotationFunctionAreaItem.discount == 1 ? utils.accDiv(discount, 10) : 1))) : quotationFunctionAreaItem.unitPrice;
				var _dcpt = utils.changeTwoDecimal(utils.accMul(quotationFunctionAreaItem.num,  _dcp));
				
				quotationFunctionAreaTotal = utils.accAdd(quotationFunctionAreaTotal, _dcpt)
				
				quotationFunctionAreaItem.dcp = _dcp;
				quotationFunctionAreaItem.dcpt = _dcpt;
				
				if(quotationFunctionAreaItem.type == 2){
					quotationFunctionAreaItem.num = quotation.trafficPrice;
					quotationFunctionAreaItem.dcpt = quotation.trafficPrice;
				}else if(quotationFunctionAreaItem.type == 3){
					quotationFunctionAreaItem.num = quotation.managePrice;
					quotationFunctionAreaItem.dcpt = quotation.managePrice;
				}
				
				quotationFunctionAreaItemCs[quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);
				quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType].push(quotationFunctionAreaItem);
			}
		}
		
		var addReduceItemLength = addReduceItems.length;

		for (var i=0;i<addReduceItemLength;++i) {
			
			var addReduceItem = addReduceItems[i];
			
			var _dcp = utils.changeTwoDecimal(addReduceItem.unitPrice);
			var _dcpt = utils.changeTwoDecimal(utils.accMul(addReduceItem.num,  _dcp));
			
			addReduceItem.dcp = _dcp;
			addReduceItem.dcpt = _dcpt;
			
			if(quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaName]){
				quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaName].push(addReduceItem);
			}
			
			if(!quotationFunctionAreaItemWs[addReduceItem.workType]){
				quotationFunctionAreaItemWs[addReduceItem.workType] = [];
			}
			
			quotationFunctionAreaItemWs[addReduceItem.workType].push(addReduceItem);
		}
		
		decorationOrderDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;
		decorationOrderDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
	}, initQuotationDetail: function(){
		
		var quotationItemListDiv = $("#quotationItemListDiv").html("");
		
		if ($("#showWay").val() == 0) {
			_data = decorationOrderDetail.quotationFunctionAreaItemCs;
		} else {
			_data = decorationOrderDetail.quotationFunctionAreaItemWs;
		}
		
		_data && $.each(_data, function(i, v){
			
			var $dcpts = 0.0;
			var $domain, $dhead, $dname, $btns, $dbody, $dbodyInner, $list;
			
			$domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom" : "20px"});
			$dhead = $('<div></div>').addClass('widget-header');
			$dname = $('<h4></h4>').append($('<strong></strong>').html(i));
			
			$dbody = $('<div></div>').addClass('widget-body');
			$dbodyInner = $('<div></div>').addClass('widget-body-inner');
			$list = $('<ul></ul>').addClass('fl-quo-list');
			
			$dhead.append($dname);
			$dbodyInner.append($list).appendTo($dbody);
			$domain.append($dhead).append($dbody);
			
			$.each(v, function(linenum, qv){
				
				$dcpts = utils.accAdd($dcpts, qv.dcpt)
				
				var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);
				
				var _lineSet = [
					["line", linenum + 1],
					["num", qv.num],
					["name", qv.itemName],
					["type", qv.type== 0 ? "普通" : qv.type== 1 ? "自定义" : "---", ["data-type", qv.type]],
					["unit", qv.measurementUnit],
					["worktype", qv.workType],
					["price unitprice", qv.unitPrice],
					["price discountprice", qv.dcp, ["data-discount", qv.discount]],
					["price totalprice-discount",  qv.type < 2 ? qv.dcpt : qv.unitPrice],
				];

				$.each(_lineSet, function(i, v){
					var $cell = $('<div></div>').addClass('cell ' + v[0]);
					var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
					
					$cell.append($cellWrap).appendTo($item);
				});
				
				$item.appendTo($list);
			});
			
			var $totalInner = $("<span></span>").addClass('fl-quo-total').text("总额:" + $dcpts);
			var $total = $('<div></div>').addClass("pull-right inline").append($totalInner);
			var $item = $('<li></li>').append($total).appendTo($list);
			
			$domain.appendTo(quotationItemListDiv);
		});
		
		$domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom" : "20px"}).appendTo(quotationItemListDiv);
		$dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
		$dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + decorationOrderDetail.quotation.totalPrice)).appendTo($dhead);
	}, initMaterial: function(orderId){
		
		var $material = $('#materialPaymentDiv').html("");
		
		var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($material);
		
		var materialPayments = null;
		
		com.post(api.payment.queryMaterialPaymentByOrderId, {"materialPayment.orderId": orderId}, function(res){
			materialPayments = res.materialPayments;
		}, null, false);
		
		if(materialPayments && materialPayments.length){
			$.each(materialPayments, function(i, v){
				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.msoNo + " " + materialUtils.materialPaymentTypeData[v.paymentType]));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
				
				var propertyArr = [
					["品类:", v.materialType, "grey"],
					["品牌:", v.materialBrand, "grey"],
					["应收额:", v.referMoney, "grey"],
					["实收额:", v.realMoney, "grey"],
					["收款时间:", v.collectTime, "grey"],
					["状态:", materialUtils.paymentStatusInit(v.paymentStatus), "red"]
				];
				
				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});
				
				var styleArr = [];
				
				v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
				v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
					  var info = bank + ", ";
					  var _s = bankInfo.split('#');
					  for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
					  }
					  
					  return info
				})(v.bank, v.bankInfo), "grey"]) : true;
				v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "grey"]) : true;
				v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "grey"]) : true;
				v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "grey"]) : true;
				v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "grey"]) : true;
				v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "grey"]) : true;
				
				$.each(styleArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulStyle);
				});
				
				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ul);
			});
		}else{
			var $resultList = $('#materialPaymentDiv').html('');
	    	var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
	    	var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
	    	var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
		}
	}, decorationActivityInfo: function(activitys, uiBtnMethod, orderId){
		
		var options = {
			"decorationActivity.orderId": orderId,
		}
		
		activitys.html('');
		
		com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res){
			var decorationActivitys = res.decorationActivitys;
			
			for(var i=0;i<decorationActivitys.length;i++){
				decorationUtils.addDecorationActivityForDiv(activitys, decorationActivitys[i], uiBtnMethod);
			}
		});
		
	}, addDecorationActivityForDiv: function(_activitys, _decorationActivity, uiBtnMethod){
		
		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "dactivity_" + _decorationActivity.daId).prependTo(_activitys);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);
		
		var widgetHeader = $("<div></div>").addClass("widget-header").addClass("header-color-pink").attr("id", "widgetHeader_" + _decorationActivity.daId).appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").text("活动").appendTo(widgetHeader);
		
		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").text(_decorationActivity.activity.activityName).appendTo(nameLi);
		
		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
		
		if(uiBtnMethod != null){
			uiBtnMethod(uiPgDiv, _decorationActivity);
		}
		
	}, decorationActivityItemInfo: function(activityItems, uiBtnMethod, orderId){
		
		var options = {
			"decorationOrder.orderId": orderId,
		}
		
		activityItems.html("");
		
		com.post(api.decoration.queryDecorationActivityItem, options, function(res){
			var decorationActivityItems = res.decorationActivityItems;
			
			for(var i=0;i<decorationActivityItems.length;i++){
				decorationUtils.addActivityItemForDiv(activityItems, decorationActivityItems[i], uiBtnMethod);
			}
		});
	}, addActivityItemForDiv: function(_activityItems, _activityItem, uiBtnMethod){
		
		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "pricing_" + _activityItem.daiId).prependTo(_activityItems);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);
		
		var widgetHeader = $("<div></div>").addClass("widget-header").attr("id", "widgetHeader_" + _activityItem.daiId).appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);
		
		if(_activityItem.type == 0){
			widgetHeaderH5.text("券");
		}else if(_activityItem.type == 1){
			widgetHeaderH5.text("物品");
		}
		
		if(_activityItem.state == 0){
			if(_activityItem.type == 0){
				widgetHeader.addClass("header-color-blue");
			}else if(_activityItem.type == 1){
				widgetHeader.addClass("header-color-green");
			}
		}else if(_activityItem.state == 1){
			widgetHeader.addClass("header-color-grey");
		}else if(_activityItem.state == 2){
			widgetHeader.addClass("header-color-orange");
		}
		
		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").attr("id", "activityItemName_" + _activityItem.daiId).text(_activityItem.activityItemName).appendTo(nameLi);
		var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
		var moneySpan = $("<span></span>").attr("id", "money_" + _activityItem.daiId).text(_activityItem.money).appendTo(moneyLi);
		var numLi = $("<li></li>").text("数量:").appendTo(ul);
		var numSpan = $("<span></span>").attr("id", "money_" + _activityItem.daiId).text(_activityItem.num).appendTo(numLi);
		
		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
		
		if(uiBtnMethod != null){
			uiBtnMethod(uiPgDiv, _activityItem);
		}
	}, initPayment: function(orderId, editFunc, submitFunc, refundFunc){
		
		var baseTypes = ["定金", "设计费", "首付款", "首付二期款", "二期款", "尾款"];
		
		var $base = $("#basePaymentDiv").html("");
		var $other = $("#otherPaymentDiv").html("");
		
		var $baseul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($base);
		var $otherul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($other);
		
		var decorationPayments = null;
		
		com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.orderId": orderId}, function(res){
			decorationPayments = res.decorationPayments;
		}, null, false);
		
		if(decorationPayments && decorationPayments.length){
			$.each(decorationPayments, function(i, v){
				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.paymentType));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
				
				var propertyArr = [
					["应收额:", v.referMoney, "grey"],
					["实收额:", v.realMoney, "grey"],
					["收款时间:", v.collectTime, "grey"],
					["状态:", v.paymentStatus, "red"]
				];
				
				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});
				
				var styleArr = [];
				
				v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
				v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
					  var info = bank + ", ";
					  var _s = bankInfo.split('#');
					  for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
					  }
					  
					  return info
				})(v.bank, v.bankInfo), "grey"]) : true;
				v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "grey"]) : true;
				v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "grey"]) : true;
				v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "grey"]) : true;
				v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "grey"]) : true;
				v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "grey"]) : true;
				
				$.each(styleArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulStyle);
				});
				
				var $paymentType = v.paymentType;
				var $paymentStatus = v.paymentStatus;
				
				var $btnEdit = editFunc ? $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑').click(function(){
					editFunc(v.autoId, v.referMoney);
				}) : $('<a></a>');
				
				var $btnSubmit = submitFunc ? $('<a></a>').addClass('btn btn-minier btn-primary').html('提交').click(function(){
					submitFunc(v.autoId, $paymentType);
				}) : $('<a></a>');
				
				var $btnRefund = refundFunc ? $('<a></a>').addClass('btn btn-minier btn-danger').html('编辑').click(function(){
					refundFunc(v.autoId, v.referMoney, $paymentType);
				}) : $('<a></a>');
				
				if($paymentType != "定金"){
					if($paymentStatus == '未提交'){
						$paymentType == "设计费" ? $divBtnWrap.append($btnEdit).append($btnSubmit) : true;
						baseTypes.indexOf($paymentType) != -1 ? $divBtnWrap.append($btnSubmit) : true;
						v.paymentType.search('退款') != -1 || v.paymentType == '违约金' ? $divBtnWrap.append($btnSubmit) : true;
					}else if($paymentStatus == '未付款'){
						$paymentType == "设计费" ? $divBtnWrap.append($btnEdit) : true;
					}else if($paymentStatus == '申请审批' || $paymentStatus == '审批未通过'){
						baseTypes.indexOf($paymentType) == -1 ? $divBtnWrap.append($btnRefund) : true;
					}
				}
				
				$divBtnWrap.appendTo($h4);
				
				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);
				
				baseTypes.indexOf($paymentType) != -1 ? $liLine.appendTo($baseul) : $liLine.appendTo($otherul);
			});
		}
	}, initOrderBelongInfo: function(orderId){
		
		var $design = $("#belongDesignInfo").html('');
		var $salesman = $("#belongSalesmanInfo").html('');
		
		var $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
		var $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);
		
		var orderBelongInfos = null;
		
		com.post(api.decoration.queryOrderBelongInfoByOrderId, {"orderBelongInfo.orderId": orderId}, function(res){
			orderBelongInfos = res.orderBelongInfos;
		}, null, false);
		
		if(orderBelongInfos && orderBelongInfos.length){
			$.each(orderBelongInfos, function(i, v){
				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belongUser));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
				
				var propertyArr = [
					["员工号:", v.belongUserId, "grey"],
					["所属部门:", v.belongDept, "grey"],
					["所属大区:", v.belongRegion, "grey"],
					["分配比例:", v.belongRate, "grey"],
					["默认:", v.defaultFlag, "grey"]
				];
				
				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});
				
				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);
				
				v.belongType == "设计" ? $liLine.appendTo($designul) : $liLine.appendTo($salesmanul);
			});
		}
	}, loadHuploadify: function(eId, ename, fileType, callback){
		
		$("#" + eId).Huploadify({
			'debug' : false, // 开启调试
			'auto' : true, // 是否自动上传
			'successTimeout' : 150, // 超时时间
			'formData' : { // 附带值
				'uploadType' : 2
			},
			'buttonClass': 'btn btn-success',
	        'buttonText': ename,
	        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
	        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
	        'uploader': window.mediaServer + api.common.uploadImg.url, // 上传处理程序
	        'width':'100', // 浏览按钮的宽度
	        'height': '32', // 浏览按钮的高度
	        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
	        'fileTypeExts':fileType, // 允许上传的文件后缀
	        'fileSizeLimit':'5MB', // 上传文件的大小限制
	        'queueSizeLimit' : 1, // 上传数量
	        'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
	        	callback(data);
			}
		});
		
	}, addDecorationPicture: function(data, type, eId){
		
		var dateObj = eval("("+data+")");
    	
    	if(dateObj.errorCode == 0){
    		 bootbox.prompt("请输入备注:", function(result) {
    			 
    			 if(!result){
    				 return;
    			 }
    			 
				var options = {
					"decorationPicture.path": dateObj.resUrl,
					"decorationPicture.name": dateObj.strutsUploadsFileName,
					"decorationPicture.content": result,
					"decorationPicture.orderId": decorationOrderDetail.decorationOrderId,
					"decorationPicture.type": type
				};
				
				com.post(api.decoration.addDecorationPicture, options, function(res) {
					if(type == 0){
						decorationUtils.addCAD($("#" + eId), res.decorationPicture);
					}else if(type == 1){
						decorationUtils.addPicture($("#" + eId), res.decorationPicture);
					}
				});
			});
		}else{
			com.showAlert(com.error, dateObj.errorMsg);
		}
	}, initDecorationPicture: function(pictureId, cadId, orderId) {
		
		var $picture = $("#" + pictureId).html("");
		var $cad = $("#" + cadId).html("");
		
		com.post(api.decoration.queryDecorationPictureByOrderId, {"decorationPicture.orderId": orderId}, function(res) {
			var decorationPictures = res.decorationPictures;
			var decorationPictureLength = decorationPictures.length;
			
			for(var i=0;i<decorationPictureLength;i++){
				var decorationPicture = decorationPictures[i];
				
				if(decorationPicture.type == 0){
					decorationUtils.addCAD($cad, decorationPicture);
				}else if(decorationPicture.type == 1){
					decorationUtils.addPicture($picture, decorationPicture);
				}
			}
		});
	},addPicture:function(e, i){
		var $li = $('<li></li>').appendTo(e);
		var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', window.mediaServer + api.common.showImg.url + '?imgBasePath=' + i.path).attr('target', '_blank').appendTo($li);
		var $img = $('<img></img>').attr('alt', '200x200').attr('width', 200).attr('height', 200).attr('src', window.mediaServer + api.common.showImg.url + '?imgBasePath=' + i.path + '&divFlag=1&width=200&height=200').appendTo($imgA);
		
		var $tags = $('<div></div>').addClass('tags').appendTo($li);
		var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
		var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
		var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
		var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.uploadTime).appendTo($timeHolder);
		
		var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
		var $toolLabel = $('<label></label>').appendTo($tools);
		var $downA = $('<a></a>').addClass("icon-download-alt").attr('href', window.mediaServer + api.common.downloadFile.url + '?downloadFilePath=' + i.path + '&fileName=' + i.name).attr('target', '_blank').appendTo($tools);
	}, addCAD: function(e, i){
		
		var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').appendTo(e);
		var $infoboxIcon = $('<div></div>').addClass('infobox-icon').appendTo($infobox);
		var $downIcon = $('<a></a>').addClass('icon-download-alt').attr('href', window.mediaServer + api.common.downloadFile.url + "?downloadFilePath=" + i.path + "&fileName=" + i.name).attr('target', '_blank').appendTo($infoboxIcon);
		
		var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
		var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.name).appendTo($infoboxData);
		var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.uploadTime).appendTo($infoboxData);
		
	}, initConstructionScheduleInfo: function(){
		
		var options = {};
		options["constructionSchedule.orderId"] = decorationOrderDetail.decorationOrderId;
		
		com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res){
			for(var qualityName in decorationUtils.qualityIds){
				$("#"+qualityName+"QualityId").val(res.constructionSchedule[qualityName+"QualityName"]);
			}
			
			$("#schedule").val(decorationUtils.scheduleInfos[parseInt(res.constructionSchedule.schedule)]);
		});
	}, initBaseInfo: function(orderId, callback){
		
		com.post(api.decoration.queryDecorationOrderForCommonByOrderId, {"decorationOrder.orderId": orderId}, function(res){
			callback(res.decorationOrder);
		}, null, false);
		
	}, init: function(){
		
		com.post(api.common.queryReceiptType, {}, function(res){
			
			decorationUtils.qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
			decorationUtils.scheduleInfos = ["铲大白", "放线", "水力电", "瓦工", "地面找平", "木工", "油工", "水电验收", "保洁"];
			
			decorationUtils.cashInfo = {};
			decorationUtils.bankInfo = {};
			decorationUtils.checkBankInfo = {};
			decorationUtils.accountsInfo = {};
			
			$.each(res.receiptTypes, function(i, v){
				if(v.type == 1){
					decorationUtils.cashInfo[v.key] = v.name;
				}else if(v.type == 2){
					decorationUtils.bankInfo[v.key] = v.name;
				}else if(v.type == 3){
					decorationUtils.checkBankInfo[v.key] = v.name;
				}else if(v.type == 4){
					decorationUtils.accountsInfo[v.key] = v.name;
				}
			});
		}, null, false);
	}
}

