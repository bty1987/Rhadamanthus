var category = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	categoryItems:{},
	
	editFlg: false,
	repeatFlg: false,
	
	validator: {
		categoryId: {
			type: "v_categoryId", 
			regex: /^C_\d{3}$/g,
			errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
		}
	},
};

jQuery(function($) {
	$('#fl-statement').statement("主材品类", "主材品类信息列表");
	
	category.listGrid = $("#listGrid");
	category.gridPager = "#gridPager";
	category.saveBtn = $("#saveBtn").on("click", saveData);
	category.cancelBtn = $("#cancelBtn");
	category.modal = $("#categoryModal");
	category.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#categoryId", true);
	});
	
	category.categoryItems.cId = $("#cId");
	category.categoryItems.categoryId = $("#categoryId").on("blur", function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.data.queryCategoryById, {"category.cId":$this.val()}, function(res){
			if(res.category.cId != 0){
				com.showTips($this, "该品类编号已存在", true);
				category.repeatFlg = true;
			}else{
				com.clearValidator("#categoryId", true);
				category.repeatFlg = false;
			}
		});
	});
	category.categoryItems.categoryName = $("#categoryName");
	
	$.extend(com.validator, category.validator);
	
	var searchOpts = {
		url: api.data.pageCategory,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: category.listGrid,
		items: [
	        {label:"编号",id:"categoryIdSearch",name:"categoryId", type:'text'},
	        {label:"名称", id:"categoryNameSearch", name:"categoryName", type:"text"}
        ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	category.listGrid.jqGrid({
		url: api.data.pageCategory.url,
		postData: category.postParam,
		colNames:['ID', '编号', '名称'],
		colModel:[
		    {name:'cid', "hidden": true},
			{name:'categoryId', searchoptions: {sopt: ['cn']}},
			{name:'categoryName',  searchoptions: {sopt: ['cn']}}
		],
		pager : category.gridPager,
		caption: "主材品类"
	});

	category.listGrid.navGrid(category.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(category.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		title: "编辑",
		onClickButton: function(){
			editFlg = true;
			var num = category.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_listGrid",{gbox:"#gbox_"+category.listGrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				return;
			}
			var row = category.listGrid.jqGrid("getRowData", num);
			
			category.categoryItems.cId.val(row.cid);
			category.categoryItems.categoryId.val(row.categoryId).attr("disabled", "true").css("display", "block");
			category.categoryItems.categoryName.val(row.categoryName);
			
			category.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(category.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		title: "添加",
		onClickButton: function(){
			editFlg = false;
			
			com.cleanItems(category.categoryItems);
			
			category.categoryItems.categoryId.css("display", "none");
			
			category.modal.modal("show");   
		},
		position: 'first'
	});
	
});

function saveData(){
	if(com.validate() || category.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'category.cid': category.categoryItems.cId.val(),
		'category.categoryId': category.categoryItems.categoryId.val(),
		'category.categoryName': category.categoryItems.categoryName.val(),
	};
	
	if(editFlg){
		url = api.data.updateCategory;
	}else{
		url = api.data.addCategory;
	}
	
	com.post(url, options, successCallback);
	
	category.modal.modal("hide");   
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["ids["+i+"]"] = row.cId;
	}
	com.post(api.material.deletecategoryByIds, options, successCallback);
	$("#eData").trigger("click");
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(category.listGrid, category.postParam);
}
