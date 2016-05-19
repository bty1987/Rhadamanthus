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
	},	initQuotationDetailItemGroupByJob: function(quotationDetail){

		decorationOrderDetail.decorationOrderQuotationItemGroupByJob = [];
		
		var functionAreas = quotationDetail.functionAreas;
		
		var quotationAreaItemsMap = {};

		for(var i=0;i<functionAreas.length;++i) {
			for(var j=0;j<functionAreas[i].items.length;j++) {
				var item = functionAreas[i].items[j];
				var tem = {};
				
				if(quotationAreaItemsMap[item.itemId] == undefined){
					tem.itemId = item.itemId;
					tem.itemName = item.itemName;
					tem.functionAreaName = functionAreas[i].functionAreaName;
					tem.workType = item.workType;
					tem.measurementUnit = item.measurementUnit;
					tem.unitPrice = item.unitPrice;
					tem.discountUnitPrice = item.discountUnitPrice;
					tem.num = parseFloat(item.num);
					tem.sum = parseFloat(item.sum);
					tem.quotationItemDes = item.quotationItemDes;
					tem.itemType = item.itemType;
					
					quotationAreaItemsMap[item.itemId] = tem;
				}else{
					quotationAreaItemsMap[item.itemId]["num"] = quotationAreaItemsMap[item.itemId]["num"] + parseFloat(item.num);
					quotationAreaItemsMap[item.itemId]["sum"] = quotationAreaItemsMap[item.itemId]["sum"] + parseFloat(item.sum);
				}
			}
		}

		var otherItems = quotationDetail.otherItems;

		for(var i=0;i<otherItems.length;++i){
			var item = otherItems[i];
			var tem = {};
			
			if(quotationAreaItemsMap[item.itemId] == undefined){
				tem.itemId = item.itemId;
				tem.itemName = item.itemName;
				tem.workType = item.workType;
				tem.measurementUnit = item.measurementUnit;
				tem.unitPrice = item.unitPrice;
				tem.discountUnitPrice = item.discountUnitPrice;
				tem.num = parseFloat(item.num);
				tem.sum = parseFloat(item.sum);
				tem.quotationItemDes = item.quotationItemDes;
				tem.itemType = item.itemType;
				
				quotationAreaItemsMap[item.itemId] = tem;
			}else{
				quotationAreaItemsMap[item.itemId]["num"] = quotationAreaItemsMap[item.itemId]["num"] + parseFloat(item.num);
				quotationAreaItemsMap[item.itemId]["sum"] = quotationAreaItemsMap[item.itemId]["sum"] + parseFloat(item.sum);
			}
		}
		
		for(var itemId in quotationAreaItemsMap){
			decorationOrderDetail.decorationOrderQuotationItemGroupByJob.push(quotationAreaItemsMap[itemId]);
		}
	},	materialPaymentListGridInit: function(){

		$grid = $('<table id="materialPaymentListGrid"></table><div id="materialPaymentGridPager"></div>');
		$('#materialPaymentDiv').empty().html($grid);

		var materialPaymentListGrid = $("#materialPaymentListGrid");
		var materialPaymentGridPager = $("#materialPaymentGridPager");
		
		materialPaymentListGrid.jqGrid({
			url: api.payment.pageMaterialPaymentByOrderId.url,
			postData: {"materialPayment.orderId": decorationOrderPostData.decorationOrderId},
			colNames:['编号', '订单编号', '收款类型', '收款类型Id', '品类', '品牌', '应收款', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '预付款类型', '优惠券', '券类型', '券信息', '收款时间', '状态名称', '状态', '收款信息'],
			multiboxonly: true,
			forceFit: false,
			colModel:[
			    {name:'mpId', hidden:true},
			    {name:'msoNo'},
			    {name:'paymentTypeName', formatter: materialUtils.paymentTypeInit},
				{name:'paymentType', hidden:true},
				{name:'materialType'},
				{name:'materialBrand'},
				{name:'referMoney'},
				{name:'cash', hidden:true},
				{name:'bank', hidden:true},
				{name:'bankInfo', hidden:true},
				{name:'checkv', hidden:true},
				{name:'checkvBankName', hidden:true},
				{name:'installment', hidden:true},
				{name:'installmentBankName', hidden:true},
				{name:'accounts', hidden:true},
				{name:'accountsBankName', hidden:true},
				{name:'advance', hidden:true},
				{name:'advanceType', hidden:true},
				{name:'coupon', hidden:true},
				{name:'couponType', hidden:true},
				{name:'couponInfo', hidden:true},
				{name:'collectTime'},
				{name:'paymentStatusName', formatter: materialUtils.paymentStatusInit, unformat: materialUtils.unformatStatus},
				{name:'paymentStatus', hidden:true},
				{name:'info', formatter:materialUtils.infoInit},
			], 
			rowNum:20,
			sortable:false,
			pager : materialPaymentGridPager,
			caption: "",
			gridComplete: function(){
				$('[data-rel="tooltip"]').tooltip('destroy');
				$('[data-rel=tooltip]').tooltip({container:'#decorationOrderDetailDesignerPageContent'});
			}
		});

		materialPaymentListGrid.navGrid(materialPaymentGridPager,
			{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
			$.jgrid.searchFunc($(this))
		);
	}, decorationActivityInfo: function(activitys, uiBtnMethod, orderId){
		
		var options = {
			"decorationActivity.orderId": orderId,
		}
		
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
	}, paymentInfoInit: function(cellvalue, options, rowdata){
		
		var info = "";
		
		if(rowdata.cash != null && rowdata.cash != "0"){
			info += "现金: " + rowdata.cash + " " + decorationUtils.cashInfo[rowdata.cashInfo] + ", ";
		}
		if(rowdata.bank != null && rowdata.bank != "0"){
			
			console.log(rowdata.bank);
			
			info += "刷卡: " + rowdata.bank + " ";
			
			var _s = rowdata.bankInfo.split('#');
			
			for(var i=1;i<_s.length-1;i++){
				
				var _i = _s[i].split('|');
				
				info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
			}
		}
		if(rowdata.checkv != null && rowdata.checkv != "0"){
			info += "转账: " + rowdata.checkv + " " + decorationUtils.checkBankInfo[rowdata.checkvBankName] + ", ";
		}
		if(rowdata.installment != null && rowdata.installment != "0"){
			info += "分期: " + rowdata.installment + " " + decorationUtils.bankInfo[rowdata.installmentBankName] + ", ";
		}
		if(rowdata.accounts != null && rowdata.accounts != "0"){
			info += "对公帐户: " + rowdata.accounts + " " + decorationUtils.accountsInfo[rowdata.accountsBankName] + ", ";
		}
		if(rowdata.advance != null && rowdata.advance != "0"){
			info += "预付款: " + rowdata.advance + ", ";
		}
		if(rowdata.coupon != null && rowdata.coupon != "0"){
			info += "券: " + rowdata.coupon + " " + rowdata.couponInfo + ", ";
		}
		if(rowdata.collectTime != null && rowdata.collectTime != ""){
			info += "收款时间: " + rowdata.collectTime + ", ";
		}
		if(rowdata.des != null && rowdata.des != ""){
			info += "描述: " + rowdata.des + ", ";
		}
		
		var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
		html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
		
		return html;
	}, initBasePayment: function(postData, paymentActionFunc, tooltipId){
		
		var actionFlag = true;
		
		if(paymentActionFunc != null){
			actionFlag = false;
		}
		
		$("#basePaymentTable").jqGrid({
			url: api.payment.pageDecorationPaymentForBaseByOrderId.url,
			postData:postData,
			viewrecords : false,
			multiselect : false,
	        multiboxonly: false,
			colNames:['autoId','款项名称', '应收款项', '实收金额', '款项状态', '信息', '操作', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '代金券', '券信息'],
			colModel:[
			    {name:'autoId',hidden:true},
				{name:'paymentType'},
				{name:'referMoney'},
				{name:'realMoney'},
				{name:'paymentStatus'},
				{name:'info', formatter:decorationUtils.paymentInfoInit},
				{name:'action', hidden:actionFlag, formatter:paymentActionFunc},
				{name:'cash', hidden:true},
				{name:'bank', hidden:true},	
				{name:'bankInfo', hidden:true},	
				{name:'checkv', hidden:true},
				{name:'checkvBankName', hidden:true},
				{name:'installment', hidden:true},
				{name:'installmentBankName', hidden:true},
				{name:'accounts', hidden:true},
				{name:'accountsBankName', hidden:true},
				{name:'advance', hidden:true},
				{name:'coupon', hidden:true},
				{name:'couponInfo', hidden:true},
			], 
			pager : "#basePaymentPager",
			caption: "",
			gridComplete: function(){
				$('[data-rel="tooltip"]').tooltip('destroy');
				$('[data-rel=tooltip]').tooltip({container: tooltipId});
			}
		});
	}, initOtherPayment: function(postData, paymentActionFunc, tooltipId) {
		
		var actionFlag = true;
		
		if(paymentActionFunc != null){
			actionFlag = false;
		}

		decorationPayment.otherPaymentGrid.jqGrid({
			url: api.payment.pageDecorationPaymentForOtherByOrderId.url,
			postData: postData,
			viewrecords : false,
			multiselect : false,
	        multiboxonly: false,
			colNames: [ 'autoId', '款项名称', '应收款项', '实收金额', '款项状态', '信息', '操作', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '代金券', '券信息'],
			colModel: [ 
			    {name: 'autoId',hidden : true}, 
			    {name: 'paymentType'}, 
			    {name: 'referMoney'}, 
			    {name: 'realMoney'}, 
			    {name: 'paymentStatus'},
			    {name: 'info', formatter:decorationUtils.paymentInfoInit},
			    {name: 'action', hidden:actionFlag, formatter: paymentActionFunc}, 
			    {name: 'cash', hidden:true},
				{name: 'bank', hidden:true},	
				{name: 'bankInfo', hidden:true},	
				{name: 'checkv', hidden:true},
				{name: 'checkvBankName', hidden:true},
				{name: 'installment', hidden:true},
				{name: 'installmentBankName', hidden:true},
				{name: 'accounts', hidden:true},
				{name: 'accountsBankName', hidden:true},
				{name: 'advance', hidden:true},
				{name: 'coupon', hidden:true},
				{name: 'couponInfo', hidden:true},
			],
			pager : decorationPayment.otherPaymentPager,
			caption : "",
			gridComplete: function(){
				$('[data-rel="tooltip"]').tooltip('destroy');
				$('[data-rel=tooltip]').tooltip({container:tooltipId});
			}
		});

		decorationPayment.otherPaymentGrid.navGrid(decorationPayment.otherPaymentPager, {edit : false, add : false, del : false, search : false, 	searchicon : 'icon-search orange', refresh : false, view : false	}, {}, {}, {}, $.jgrid.searchFunc($(this)));
	}, initOrderBelongInfo: function(orderId){
		
		var belongDesignInfo = $("#belongDesignInfo");
		var belongSalesmanInfo = $("#belongSalesmanInfo");
		
		var options = {
			"orderBelongInfo.orderId": orderId,
		}
		
		com.post(api.decoration.queryOrderBelongInfoForBusinessnByOrderId, options, function(res){
			
			var _orderBelongInfos = res.orderBelongInfos;
			
			belongDesignInfo.jqGrid({
				datatype: "local",
				data: _orderBelongInfos,
				viewrecords : false,
				multiselect : false,
		        multiboxonly: false,
				colNames:['员工编号' , '员工名' ,  '所属部门' ,'所属大区' , '分配比例' ,"默认",'belongDeptId','belongRegionId'],
				colModel:[
				  {name:"belongUserId"},
				  {name:"belongUser"},
				  {name:"belongDept"},
				  {name:"belongRegion"},
				  {name:"belongRate"},
				  {name:"defaultFlag"},
				  {name:"belongDeptId",hidden:true},
				  {name:"belongRegionId",hidden:true},
				]
			});
		});
		
		com.post(api.decoration.queryOrderBelongInfoForDesignByOrderId, options, function(res){
			
			var _orderBelongInfos = res.orderBelongInfos;
			
			belongSalesmanInfo.jqGrid({		
				datatype: "local",
				data: _orderBelongInfos,
				viewrecords : false,
				multiselect : false,
		        multiboxonly: false,
				colNames:['员工编号' , '员工名' ,  '所属部门' ,'所属大区' , '分配比例' ,"默认",'belongDeptId','belongRegionId'],
				colModel:[
				  {name:"belongUserId"},
				  {name:"belongUser"},
				  {name:"belongDept"},
				  {name:"belongRegion"},
				  {name:"belongRate"},
				  {name:"defaultFlag"},
				  {name:"belongDeptId",hidden:true},
				  {name:"belongRegionId",hidden:true},
				]
			});
		});
	}, init: function(){
		com.post(api.ds.bankType, {}, function(res){
			
			decorationUtils.cashInfo = res.cashInfo;
			decorationUtils.bankInfo = res.bankInfo;
			decorationUtils.checkBankInfo = res.checkBankInfo;
			decorationUtils.accountsInfo = res.accountsInfo;
		});
	}
}

