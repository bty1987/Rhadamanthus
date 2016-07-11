var materialInside = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	items: {},
	data:{
		materialTypeData: {},
		materialBrandData: {},
	},
	
	statusData: [{"id":"0", "name":"初始"}, {"id":"1", "name":"已确认"}],
	
	editFlag: false,
	repeatFlg:false,
	commitFlag: false,
};

var materialInsidePostData = {};

jQuery(function($) {
	materialInside.listgrid = $("#listgrid");
	materialInside.gridPager = "#gridPager";
	materialInside.saveBtn = $("#saveBtn").on("click", saveData);
	materialInside.cancelBtn = $("#cancelBtn");
	materialInside.modal = $("#materialInsideModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#orderId", true);
	});
	
	materialInside.items.orderId = $("#orderId").on("blur", function(){
		
		$this = $(this);
		
		com.clearValidator("#orderId", true);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.decoration.checkDecorationOrderExist, {"decorationOrder.orderId": $this.val()}, function(res){
			if(res.decorationOrder.autoId == null || res.decorationOrder.autoId == 0){
				materialInside.commitFlag = false;
				com.showTips($this, "该订单编号不存在", true);
			}else{
				materialInside.commitFlag = true;
				decorationOrder = res.decorationOrder;
				materialInsidePostData["orderId"] = decorationOrder.orderId;
				materialInsidePostData["customerId"] = decorationOrder.customer.customerId;
				materialInsidePostData["customerName"] = decorationOrder.customer.customerName;
				materialInsidePostData["orderAddr"] = decorationOrder.village.villageName + " " + decorationOrder.houseNumber;
			}
		});
	});
	
	materialInside.items.materialType = $("#materialType");
	materialInside.items.materialBrand = $("#materialBrand");
	materialInside.items.designerName = $("#designerName");
	materialInside.items.sales = $("#sales");
	materialInside.items.profit = $("#profit");
	materialInside.items.des = $("#des");
	
	var searchOpts = {
		url: api.material.pageMaterialInsideByUserId,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialInside.listgrid,
		items: [
			{label:"品类", id:"materialTypeSearch", name:"materialTypeId", type:"select"},
			{label:"品牌", id:"materialBrandSearch", name:"materialBrandId", type:"select"},
			{label:"状态", id:"statusSearch", name:"status", type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#relationshipSearch").bindData(materialInside.relationshipType, "", "", true);
	
	$("#materialTypeSearch").change(function(){
		var _materialTypeId = $("#materialTypeSearch").val();
		if(_materialTypeId == undefined || _materialTypeId == ""){
			return false;
		}
		com.post(api.data.queryBrandByCategoryId.url, {"brand.cid": _materialTypeId, }, function(res){
			$("#materialBrandSearch").bindData(res.brands, "bId", "brandName", true);
		});
	});
	
	com.post(api.material.queryCategory, {}, function(res){
		materialInside.data.materialTypeData = res.categorys;
		$("#materialType").bindData(materialInside.data.materialTypeData, "cid", "categoryName");
		$("#materialTypeSearch").bindData(materialInside.data.materialTypeData, "categoryName", "categoryName", true);
	});
	
	$("#statusSearch").bindData(materialInside.statusData, "id", "name", true);
	
	materialInside.items.materialType.change(function(){
		var _materialTypeId = materialInside.items.materialType.val();
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": _materialTypeId, }, function(res){
			materialInside.data.materialBrandData[_materialTypeId] = res.materialBrands;
			$("#materialBrand").bindData(materialInside.data.materialBrandData[_materialTypeId+""], "mbId", "materialBrandName");
		});
	});
	
	com.initChosen('designerName', api.personel.queryUserForNameByDuty, "pinyinName", {"duty":"设计师"}, "autoFillKeyValue", "key", "value");
	
	initializeListgrid();
	
});
function initializeListgrid(){
	materialInside.listgrid.jqGrid({		
		url: api.material.pageMaterialInsideByUserId.url,
		colNames: ['编号', '订单编号', '楼盘地址', '客户Id', '客户姓名', '品类Id', '品类', '品牌Id', '品牌', '设计师Id', '设计师', '创建时间', '销售额', '利润', '状态', '状态', '备注'],
		multiboxonly: true,
		forceFit: false,
		colModel: [
		    {name:'moId', hidden:true},
		    {name:'orderId'},
		    {name:'orderAddr', width: 350},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'materialTypeId', hidden:true},
			{name:'materialType'},
			{name:'materialBrandId', hidden:true},
			{name:'materialBrand'},
			{name:'designerId', hidden:true},
			{name:'designerName'},
			{name:'createTime'},
			{name:'sales'},
			{name:'profit'},
			{name:'status', hidden:true},
			{name:'showStatus', formatter: statusInit},
			{name:'des'}
		], 
		pager: materialInside.gridPager,
		caption: "场外信息列表"
	});

	materialInside.listgrid.navGrid(materialInside.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {}, 
		$.jgrid.deleteFunc(removeRow), 
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialInside.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			var num = materialInside.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialInside.listgrid.attr("id"));
				return;
			}
			
			var row = materialInside.listgrid.jqGrid("getRowData", num);
			
			if(row.status != "0"){
				com.showAlert(com.error, "当前编辑场外结算信息已经确认 , 不能进行编辑动作!");
				return false;
			}
			
			materialInside.items.orderId.val(row.orderId).attr("readonly", "readonly");
			
			materialInsidePostData["materialInside.moId"] = row.moId;
			materialInsidePostData["materialInside.customerId"] = row.customerId;
			
			com.updateChosen('designerName', row.designerId, row.designerName);
			$("#buildingRuleContent").html("");
			
			materialInside.items.materialType.val(row.materialTypeId);
			
			com.post(api.data.queryBrandByCategoryId, {"brand.cid": row.materialTypeId}, function(res){
					
				materialInside.data.materialBrandData[row.materialTypeId] = res.materialBrands;
				materialBrands = materialInside.data.materialBrandData[row.materialTypeId+""];
				$("#materialBrand").bindData(materialBrands, "mbId", "materialBrandName");
				
				materialInside.items.materialBrand.val(row.materialBrandId);
			}, null);
			
			materialInside.items.materialBrand.val(row.materialBrand);
			materialInside.items.designerName.val(row.designerName);
			materialInside.items.sales.val(row.sales);
			materialInside.items.profit.val(row.profit);
			materialInside.items.des.val(row.des);
			
			materialInside.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(materialInside.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			
			materialInside.items.materialBrand.html("");
			var materialTypeId = materialInside.items.materialType.val();
			
			materialInside.items.orderId.val("").removeAttr("readonly");
			
			com.post(api.data.queryBrandByCategoryId, {"brand.cid": materialTypeId}, function(res){
				materialInside.data.materialBrandData[materialTypeId] = res.materialBrands;
				$("#materialBrand").bindData(materialInside.data.materialBrandData[materialTypeId+""], "mbId", "materialBrandName");
			}, null);
			
			com.updateChosen('designerName', '', '');
			$("#buildingRuleContent").html("");
			
			com.cleanItems(materialInside.items);
			materialInside.modal.modal("show");
		},
		position: "first",
	});
};

function saveData(){
	
	if(com.validate() || !materialInside.commitFlag){
		return;
	}
	
	var url;
	var options = {
		"materialInside.orderId": materialInsidePostData["orderId"],
		"materialInside.orderAddr": materialInsidePostData["orderAddr"],
		"materialInside.customerId": materialInsidePostData["customerId"],
		"materialInside.customerName": materialInsidePostData["customerName"],
		"materialInside.materialType": materialInside.items.materialType.find("option:selected").text(),
		"materialInside.materialTypeId": materialInside.items.materialType.val(),
		"materialInside.materialBrand": materialInside.items.materialBrand.find("option:selected").text(),
		"materialInside.materialBrandId": materialInside.items.materialBrand.val(),
		"materialInside.designerId": materialInside.items.designerName.val(),
		"materialInside.designerName": $("#designerName_chosen span")[0].textContent.split("-")[0],
		"materialInside.sales": materialInside.items.sales.val(),
		"materialInside.profit": materialInside.items.profit.val(),
		"materialInside.des": materialInside.items.des.val()
	};
	
	if(editFlg){
		url = api.material.updateMaterialInside;
		options['materialInside.moId'] = materialInsidePostData["materialInside.moId"];
	}
	else {
		url = api.material.addMaterialInside;
	}
	com.post(url, options, successCallback);
	materialInside.modal.modal("hide");
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	
	var statusNotInitMoIds = [];
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		if(row.status.toString() == "0"){
			options["miIds["+i+"]"] = row.moId;
		}else{
			statusNotInitMoIds.push(row.moId);
		}
	}
	
	console.log(options);
	
	bootbox.confirm("删除数据中存在已经完成确认的记录 , 这些记录将不会进行删除操作!", function(result) {
		if(result){
			if(!isEmptyObject(options)){
				com.post(api.material.deleteMaterialInsideByMiIds, options, successCallback);
			}
		}
	});
	
	if(statusNotInitMoIds.length > 0){
		com.showAlert(com.warning, "删除数据中存在已经完成确认的记录 , 这些记录将不会进行删除操作!");
	}
	
	if(!isEmptyObject(options)){
		com.post(api.material.deleteMaterialInsideByMiIds, options, successCallback);
	}
	
	$("#eData").trigger("click");
}

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	if(rowdata.status == "0"){
		result += '待确认';
	}else{
		result += '已确认';
	}
	return result;
	
}

function isEmptyObject(obj){
    for(var n in obj){return false} 
    return true; 
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	materialInside.listgrid.trigger("reloadGrid");
}