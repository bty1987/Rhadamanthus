var brand = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	brandItems:{},
	data:{
		categoryData: {},
	},
	
	editFlg: false,
	repeatFlg: false,
	
	validator: {
		brandId: {
			type: "v_brandId", 
			regex: /^B_\d{3}$/g,
			errorMsg: "请以B_作为前缀 , 之后以三位数字组成(如B_001)."
		}
	},
};

jQuery(function($) {
	$('#fl-statement').statement("主材品牌", "主材品牌信息列表");
	
	brand.listGrid = $("#listGrid");
	brand.gridPager = "#gridPager";
	brand.saveBtn = $("#saveBtn").on("click", saveData);
	brand.cancelBtn = $("#cancelBtn");
	brand.modal = $("#brandModal");
	
	brand.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#brandId", true);
	});
	
	brand.brandItems.bId = $("#bId");
	brand.brandItems.brandId = $("#brandId").on("blur", function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.data.queryBrandByBId, {"brand.brandId":$this.val()}, function(res){
			if(res.brand.bId != 0){
				com.showTips($this, "该品牌编号已存在", true);
				brand.repeatFlg = true;
			}else{
				com.clearValidator("#brandId", true);
				brand.repeatFlg = false;
			}
		});
	});
	brand.brandItems.brandName = $("#brandName");
	brand.brandItems.categoryId = $("#categoryId");
	
	$.extend(com.validator, brand.validator);
	
	var searchOpts = {
		url: api.data.pageBrand,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: brand.listGrid,
		items: [
	        {label:"编号",id:"brandIdSearch",name:"brandId", type:'text'},
	        {label:"名称",id:"brandNameSearch",name:"brandName", type:'text'},
	        {label:"品类", id:"categorySearch", name:"categoryId", type:"select", op: 'eq'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	com.post(api.data.queryCategory, {}, function(res){
		brand.data.categoryData = res.categorys;
		$("#categoryId").bindData(brand.data.categoryData, "cid", "categoryName");
		$("#categorySearch").bindData(brand.data.categoryData, "cid", "categoryName", true);
	});
	
	brand.listGrid.jqGrid({
		url: api.data.pageBrand.url,
		postData: brand.postParam,
		colNames:['ID', '编号', '名称', '品类编号', '品类ID', '品类'],
		colModel:[
		    {name:'bid', "hidden": true},
			{name:'brandId', searchoptions: {sopt: ['cn']}},
			{name:'brandName', searchoptions: {sopt: ['cn']}},
			{name:'cid', hidden: true},
			{name:'categoryId', hidden: true, stype:"select", searchoptions: {value:mapData(brand.data.categoryData, "cid", "categoryName")}},
			{name:'categoryName', search: false}
		],
		pager : brand.gridPager,
		caption: "主材品牌"
	});

	brand.listGrid.navGrid(brand.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(brand.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			var num = brand.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_listGrid", {gbox:"#gbox_"+brand.listGrid.attr("id"), jqm:true});
				$("#jqg_alrt").focus();
				return;
			}
			var row = brand.listGrid.jqGrid("getRowData", num);
			
			brand.brandItems.bId.val(row.bid);
			brand.brandItems.brandId.val(row.brandId).attr("disabled", "true").css("display", "block");
			brand.brandItems.brandName.val(row.brandName);
			brand.brandItems.categoryId.val(row.cid);
			
			brand.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(brand.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			com.cleanItems(brand.brandItems);
			
			brand.brandItems.brandId.val("").css("disabled", false).css("display", "none");
			
			brand.modal.modal("show");   
		},
		position: 'first'
	});
	
});

function saveData(){
	if(com.validate() || brand.repeatFlg)
		return;
	
	var url;
	var options = {
		'brand.bid': brand.brandItems.bId.val(),
		'brand.brandId': brand.brandItems.brandId.val(),
		'brand.brandName': brand.brandItems.brandName.val(),
		'brand.cid': brand.brandItems.categoryId.val(),
	};
	
	if(editFlg){
		url = api.data.updateBrand;
	}else{
		url = api.data.addBrand;
	}
	
	com.post(url, options, successCallback);
	
	brand.modal.modal("hide");   
}

function removeRow(params, rowNums){
	
	var nums = rowNums.split(",");
	var options = {};
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["bIds["+i+"]"] = row.bId;
	}
	
	com.post(api.data.deleteBrandByBIds, options, successCallback);
	
	$("#eData").trigger("click");
}

function successCallback(){
	$.jgrid.refreshGrid(brand.listGrid, brand.postParam);
}

function mapData(data, key, value){
	if(!key){
		key = "id";
	}
	if(!value){
		value = "name";
	}
	
	_data = {};
	
	for(var i=0;i<data.length;i++){
		_data[data[i][key]] = data[i][value];
	}
	
	return _data;
}
