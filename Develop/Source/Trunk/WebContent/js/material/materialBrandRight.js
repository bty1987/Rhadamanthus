var materialBrandRight = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	
	editFlg: false,
	repeatFlg: false,
	
	postParam: {"filters[0].data":"驻店导购", "filters[0].field":"duty", "filters[0].op":"eq"},
	
	userId: "",
};

jQuery(function($) {
	
	materialBrandRight.listGrid = $("#listGrid");
	materialBrandRight.gridPager = "#gridPager";
	materialBrandRight.saveBtn = $("#saveBtn").on("click", saveData);
	materialBrandRight.cancelBtn = $("#cancelBtn");
	materialBrandRight.modal = $("#materialBrandRightModal");
	
	var searchOpts = {
		url: api.personel.queryUserForNameByDuty,
		postParmas: {"paging.rows":10, "paging.page":1, "duty":"驻店导购"},
		listgrid: materialBrandRight.listGrid,
		items: [
		    {label:"姓名", id:"userNameSearch", name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByDuty, postData:{"duty":"驻店导购"}}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#brandright").chosen({width: "216px"});
	
	materialBrandRight.listGrid.jqGrid({
		url: api.personel.pageUser.url,
		postData: materialBrandRight.postParam,
		colNames:['员工工号', '姓名', '用户名', '操作'],
		colModel:[
		    {name:'userId'},
		    {name:'userName'},
		    {name:'loginId'},
		    {name:'action', formatter: actionInit},
		], 
		pager: materialBrandRight.gridPager,
		caption: "主材用户信息列表"
	});
	
	materialBrandRight.listGrid.navGrid(materialBrandRight.gridPage, {edit:false, add:false, del:false, search:false, searchicon : 'icon-search orange', refresh: false, view: false}, {}, {}, {}, {});
	
	com.post(api.data.queryBrand, {}, function(res){
		materialBrandRight.materialBrands = res.brands;
	});
	
});

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	var rowId = options.rowId;
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="' + rowId + '_viewMateriSubOrderAdd" class="btn btn-minier btn-inverse" onclick="dialogMaterialBrandRight(\'' + rowdata.userId + '\');">型号权限</button>';
	result += '</div>';
	
	return result;
}

function dialogMaterialBrandRight(userId){
	
	materialBrandRight.userId = userId;
	
	com.post(api.material.queryMaterialBrandRight, {"materialBrandRight.userId": userId}, function(res){
		
		$("#brandright").chosen("destroy");
		$("#brandright").chosen({width: "216px"});
		$("#brandright").bindData(materialBrandRight.materialBrands, 'brandId', 'brandName');
		$("#brandright").trigger("chosen:updated");
		
		var brandId = res.materialBrandRight.brandId;
		var brandIds = brandId.split("#");
		
		for(var i=0;i<brandIds.length;i++){
			
			var _brandId = brandIds[i];
			
			$("option[value='"+_brandId+"']", $("#brandright")).attr("selected", "selected");
			$("#brandright").trigger("chosen:updated");
		}
	});
	
	materialBrandRight.modal.modal("show");
}

function saveData(){
	
	if(com.validate() || materialBrandRight.repeatFlg)
		return;
	
	var options = {};
	var brandright = "#";
	
	var brandIds = $("#brandright").val();
	
	if(brandIds == null){
		brandright = "";
	}else{
		for(var i=0;i<brandIds.length;i++){
			brandright += brandIds[i] + "#";
		}
	}
	
	options["materialBrandRight.userId"] = materialBrandRight.userId;
	options["materialBrandRight.brandId"] = brandright;
	
	com.post(api.material.saveMaterialBrandRight, options);
	
	materialBrandRight.modal.modal("hide");   
}