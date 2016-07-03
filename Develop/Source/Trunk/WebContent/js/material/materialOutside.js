var materialOutside = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	items: {},
	data:{
		materialTypeData: {},
		materialBrandData: {},
	},
	
	statusData: [{"id":"0", "name":"待收款"}, {"id":"1", "name":"已收款"}, {"id":"2", "name":"退款"}],
	
	saveFlag: false,
	editFlag: false,
	repeatFlg:false,
};

var materialOutsidePostData = {};

jQuery(function($) {
	materialOutside.saveBtn = $("#saveBtn").on("click", saveData);
	materialOutside.cancelBtn = $("#cancelBtn");
	materialOutside.modal = $("#materialOutsideModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	materialOutside.items.orderId = $("#orderId");
	materialOutside.items.orderAddr = $("#orderAddr");
	materialOutside.items.orderAddrInfo = $("#orderAddrInfo");
	materialOutside.items.customerName = $("#customerName");
	materialOutside.items.customerNameInfo = $("#customerNameInfo");
	materialOutside.items.materialBrandInfo = $("#materialBrandInfo");
	materialOutside.items.materialType = $("#materialType");
	materialOutside.items.materialBrand = $("#materialBrand");
	materialOutside.items.salesmanName = $("#salesmanName");
	materialOutside.items.sales = $("#sales");
	materialOutside.items.profit = $("#profit");
	materialOutside.items.des = $("#des");
	
	materialOutside.items.approvalMaterialOutsideRefundModal = $("#approvalMaterialOutsideRefundModal");
	
	com.post(api.data.queryCategory, {}, function(res){
		$("#materialType").bindData(res.categorys, "cid", "categoryName");
	});
	
	$("#statusSearch").bindData(materialOutside.statusData, "id", "name", true);
	
	materialOutside.items.materialType.change(function(){
		var _materialTypeId = materialOutside.items.materialType.val();
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": _materialTypeId, }, function(res){
			$("#materialBrand").bindData(res.brands, "bid", "brandName");
		});
	});
	
	materialOutside.items.orderId.on("blur", function(){
		var $this = $(this);
		
		if($this.val() == ""){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $this.val(),
		}
		
		com.post(api.decoration.queryDecorationOrderForCommonByOrderId, options, function(res){
			
			var decorationOrder = res.decorationOrder;
			
			materialOutside.items.orderAddr.css("display", "block");
			materialOutside.items.orderAddrInfo.val(decorationOrder.village.villageName + " " + decorationOrder.houseNumber);
			materialOutside.items.customerName.css("display", "block");
			materialOutside.items.customerNameInfo.val(decorationOrder.customer.customerName);
			
			materialOutside.saveFlag = true;
		}, function(error){
			materialOutside.items.orderAddr.css("display", "none");
			materialOutside.items.customerName.css("display", "none");
			
			materialOutside.saveFlag = false;
		});
	});
	
	materialOutside.items.salesmanName.chosen({allow_single_deselect: true});
	$("#salesmanName_chosen input").bind("input", function(){
		var auroFileSearchValue = $("#salesmanName_chosen input").val();
		if($("#salesmanName_chosen input").val()!=""){
			com.post(api.personel.queryUserForNameByDuty, {"pinyinName":auroFileSearchValue,"duty":""},function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillList!=null){
						for(var i=0;i<res.autoFillList.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#salesmanName").html(html1);
					$("#salesmanName").trigger("chosen:updated");
				}
			});
		}
	});
	$("#salesmanName_chosen").css("width", "150px");
	
	$("#vApproveManSel").chosen({
		allow_single_deselect : true
	});
	$("#vApproveManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 7}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					if (res.autoFillKeyValue != null) {
						var i = 0;
						for(i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#vApproveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#vApproveManSel_chosen").css("width", "200px");
	
	$("#vApproveSaveBtn").on("click", function(){
		if(com.validate('approvalMaterialOutsideRefundModal')){
			return;
		}
			
		var options = {
			"approval.receiverId": $("#vApproveManSel").val(),
			"approval.comment": $("#materialOutsideRefundDes").val(),
			"approvalMaterialOutsideRefund.moId": materialOutsidePostData.moId,
		}
		
		com.post(api.approval.submitApprovalForMaterialOutsideRefund, options);
		
		materialOutside.items.approvalMaterialOutsideRefundModal.modal("hide");
	});
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
					var $btnRefund = $('<a></a>').addClass('btn btn-minier btn-success').html('退款');
					
					var propertyArr = [
						["楼盘地址:", v.orderAddr, "grey"],
						["客户名:", v.customerName, "grey"],
						["业务员:", v.salesmanName, "grey"],
						["品类:", v.materialType, "grey"],
						["品牌:", v.materialBrand, "grey"],
						["创建时间:", v.createTime, "grey"],
						["销售额:", v.sales, "grey"],
						["利润:", v.profit, "grey"],
						["状态:", v.status == 0 ? '待收款' : v.status == 1 ? '已收款' : '已确认', "red"],
					];
					
					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
					
					$btnEdit.click(function(){
						editMaterialOutside(v);
					});
					
					$btnRefund.click(function(){
						dialogApprovalMaterial(v.moId);
					});

					v.status == 0 && $divBtnWrap.append($btnEdit);
					v.status == 1 &&  $divBtnWrap.append($btnRefund);
					
					$divBtnWrap.appendTo($h3);
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init(["materialType", "materialBrand", "materialOutPaymentStatus"], "condList", api.material.pageMaterialOutsideByUserId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOutsidePostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css('margin-top', '7px').css('margin-right', '7px');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
	
	$('a[name="add"]','#pagenation').click(function(){
		editFlg = false;
		
		materialOutside.saveFlag = false;
		
		materialOutside.items.orderId.removeAttr("disabled");
		materialOutside.items.orderAddr.css("display", "none");
		materialOutside.items.customerName.css("display", "none");
		materialOutside.items.materialBrandInfo.css("display", "block");
		materialOutside.items.materialBrand.html("");
		
		var materialTypeId = materialOutside.items.materialType.val();
		
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": materialTypeId}, function(res){
			$("#materialBrand").bindData(res.materialBrands, "mbId", "materialBrandName");
		});
		
		$("#salesmanName_chosen span")[0].textContent = "";
		$("#buildingRuleContent").html("");
		
		com.cleanItems(materialOutside.items);
		
		materialOutside.modal.modal("show");
    });
	
	function editMaterialOutside(v){
		materialOutside.editFlag = true;
		
		if(v.status != "0"){
			com.showAlert(com.error, "当前编辑场外结算信息已经确认 , 不能进行编辑动作!");
			return false;
		}
		
		materialOutside.items.orderId.attr("disabled", "disabled");
		materialOutside.items.materialBrandInfo.css("display", "none");
		
		materialOutsidePostData.moId = v.moId;
		
		$("#salesmanName_chosen span")[0].textContent = "";
		$("#buildingRuleContent").html("");
		
		$("#salesmanName_chosen span")[0].textContent = v.salesmanName;
		
		materialOutside.items.orderId.val(v.orderId);
		materialOutside.items.materialBrand.val(v.materialBrand);
		materialOutside.items.salesmanName.val(v.salesmanName);
		materialOutside.items.sales.val(v.sales);
		materialOutside.items.profit.val(v.profit);
		materialOutside.items.des.val(v.des);
		
		materialOutside.modal.modal("show");
	}
	
	function dialogApprovalMaterial(moId){
		
		materialOutsidePostData.moId = moId;
		
		$("#villageDes").val("");
		$("#vApproveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		
		materialOutside.items.approvalMaterialOutsideRefundModal.modal("show");
	}
	
	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {};
		
		if(materialOutside.editFlag){
			url = api.material.updateMaterialOutside;
			
			options['materialOutside.moId'] = materialOutsidePostData.moId;
			options['materialOutside.sales'] = materialOutside.items.sales.val();
			options['materialOutside.profit'] = materialOutside.items.profit.val();
		}else{
			url = api.material.addMaterialOutside;
			
			options = {
				"materialOutside.orderId": materialOutside.items.orderId.val(),
				"materialOutside.materialType": materialOutside.items.materialType.find("option:selected").text(),
				"materialOutside.materialTypeId": materialOutside.items.materialType.val(),
				"materialOutside.materialBrand": materialOutside.items.materialBrand.find("option:selected").text(),
				"materialOutside.materialBrandId": materialOutside.items.materialBrand.val(),
				"materialOutside.salesmanId": materialOutside.items.salesmanName.val(),
				"materialOutside.salesmanName": $("#salesmanName_chosen span")[0].textContent.split("-")[0],
				"materialOutside.sales": materialOutside.items.sales.val(),
				"materialOutside.profit": materialOutside.items.profit.val(),
				"materialOutside.des": materialOutside.items.des.val()
			};
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		materialOutside.modal.modal("hide");
	}
	
});
//
//function initializeListgrid(){
//	materialOutside.listgrid.jqGrid({		
//		url: api.material.pageMaterialOutsideByUserId.url,
//		colNames:['编号', '订单号', '楼盘地址', '客户姓名', '品类Id', '品类', '品牌Id', '品牌', '业务员', '创建时间', '销售额', '利润', '状态', '状态', '备注', '操作'],
//		multiboxonly: true,
//		forceFit: false,
//		colModel:[
//		    {name:'moId', hidden:true},
//		    {name:'orderId'},
//		    {name:'orderAddr', width:200},
//			{name:'customerName', width:80},
//			{name:'materialTypeId', hidden:true},
//			{name:'materialType', width:80},
//			{name:'materialBrandId', hidden:true},
//			{name:'materialBrand', width:80},
//			{name:'salesmanName', width:80},
//			{name:'createTime', width:200},
//			{name:'sales', width:80},
//			{name:'profit', width:80},
//			{name:'status', hidden:true},
//			{name:'showStatus', formatter: statusInit},
//			{name:'des', hidden: true},
//			{name:'action', formatter: actionInit},
//		], 
//		pager : materialOutside.gridPager,
//		caption: "场外信息列表"
//	});
//
//	materialOutside.listgrid.navGrid(materialOutside.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false}, {}, {}, {}
//		,$.jgrid.searchFunc($(this))
//	).navButtonAdd(materialOutside.gridPager,{
//		caption: "",
//		buttonicon: "icon-pencil blue",
//		title: "编辑",
//		onClickButton: function(){
//			materialOutside.editFlag = true;
//			
//			var num = materialOutside.listgrid.jqGrid("getGridParam", 'selrow');
//			
//			if(num == null){
//				$.jgrid.showSelectInfo(materialOutside.listgrid.attr("id"));
//				return;
//			}
//			
//			var row = materialOutside.listgrid.jqGrid("getRowData", num);
//			
//			if(row.status != "0"){
//				com.showAlert(com.error, "当前编辑场外结算信息已经确认 , 不能进行编辑动作!");
//				return false;
//			}
//			
//			materialOutside.items.orderId.attr("disabled", "disabled");
//			materialOutside.items.materialBrandInfo.css("display", "none");
//			
//			materialOutsidePostData["materialOutside.moId"] = row.moId;
//			
//			$("#salesmanName_chosen span")[0].textContent = "";
//			$("#buildingRuleContent").html("");
//			
//			$("#salesmanName_chosen span")[0].textContent = row.salesmanName;
//			
//			materialOutside.items.orderId.val(row.orderId);
//			materialOutside.items.materialBrand.val(row.materialBrand);
//			materialOutside.items.salesmanName.val(row.salesmanName);
//			materialOutside.items.sales.val(row.sales);
//			materialOutside.items.profit.val(row.profit);
//			materialOutside.items.des.val(row.des);
//			
//			materialOutside.modal.modal("show");
//		},
//		position: "first",
//	}).navButtonAdd(materialOutside.gridPager, {
//		caption: "",
//		buttonicon: "icon-plus-sign purple",
//		title: "添加",
//		onClickButton: function(){
//			editFlg = false;
//			
//			materialOutside.saveFlag = false;
//			
//			materialOutside.items.orderId.removeAttr("disabled");
//			materialOutside.items.orderAddr.css("display", "none");
//			materialOutside.items.customerName.css("display", "none");
//			materialOutside.items.materialBrandInfo.css("display", "block");
//			materialOutside.items.materialBrand.html("");
//			
//			var materialTypeId = materialOutside.items.materialType.val();
//			
//			com.post(api.data.queryBrandByCategoryId, {"brand.cid": materialTypeId}, function(res){
//				materialOutside.data.materialBrandData[materialTypeId] = res.materialBrands;
//				$("#materialBrand").bindData(materialOutside.data.materialBrandData[materialTypeId+""], "mbId", "materialBrandName");
//			}, function(msg){
//				return {};
//			});
//			
//			$("#salesmanName_chosen span")[0].textContent = "";
//			$("#buildingRuleContent").html("");
//			
//			com.cleanItems(materialOutside.items);
//			materialOutside.modal.modal("show");
//		},
//		position: "first",
//	});
//};
//
//function actionInit(cellvalue, options, rowdata){
//	
//	var result = '';
//	var rowId = options.rowId;
//	
//	if(rowdata.status == '1'){
//		result += '<div class="ui-pg-div btn-group">';
//		result += '<button id="viewMateriSubOrderDetiail" class="btn btn-minier btn-info" onclick="dialogApprovalMaterial(\'' + rowId + '\', \'' + rowdata.moId + '\');">退款</button>';
//		result += '</div>';
//	}
//	
//	return result;
//}
//
//function saveData(){
//	
//	if(com.validate()){
//		return;
//	}
//	
//	var url;
//	var options = {};
//	
//	if(materialOutside.editFlag){
//		url = api.material.updateMaterialOutside;
//		
//		options['materialOutside.moId'] = materialOutsidePostData["materialOutside.moId"];
//		options['materialOutside.sales'] = materialOutside.items.sales.val();
//		options['materialOutside.profit'] = materialOutside.items.profit.val();
//	}else{
//		url = api.material.addMaterialOutside;
//		
//		options = {
//			"materialOutside.orderId": materialOutside.items.orderId.val(),
//			"materialOutside.materialType": materialOutside.items.materialType.find("option:selected").text(),
//			"materialOutside.materialTypeId": materialOutside.items.materialType.val(),
//			"materialOutside.materialBrand": materialOutside.items.materialBrand.find("option:selected").text(),
//			"materialOutside.materialBrandId": materialOutside.items.materialBrand.val(),
//			"materialOutside.salesmanId": materialOutside.items.salesmanName.val(),
//			"materialOutside.salesmanName": $("#salesmanName_chosen span")[0].textContent.split("-")[0],
//			"materialOutside.sales": materialOutside.items.sales.val(),
//			"materialOutside.profit": materialOutside.items.profit.val(),
//			"materialOutside.des": materialOutside.items.des.val()
//		};
//	}
//	
//	com.post(url, options, successCallback);
//	
//	materialOutside.modal.modal("hide");
//}
//
//function statusInit(cellvalue, options, rowdata){
//	
//	var result = '';
//	var status = rowdata.status;
//	
//	if(status == "0"){
//		result += '待收款';
//	}else if(status == '1'){
//		result += '已收款';
//	}else if(status == '2'){
//		result += '退款';
//	}
//	
//	return result;
//}
//
//function isEmptyObject(obj){
//    for(var n in obj){
//    	return false
//    } 
//    
//    return true; 
//}
//
//function successCallback(){
//	com.showAlert(com.info, "操作成功");
//	materialOutside.listgrid.trigger("reloadGrid");
//}