var materialOutside = {
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
};

var materialOutsidePostData = {};

jQuery(function($) {
	materialOutside.listgrid = $("#listgrid");
	materialOutside.gridPager = "#gridPager";
	
	
	materialOutsidePostData["materialOutside.status"] = 0;
	
	var searchOpts = {
		url: materialOutside.queryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialOutside.listgrid,
		items: [
			{label:"品类", id:"materialTypeSearch", name:"materialTypeId", type:"select"},
			{label:"品牌", id:"materialBrandSearch", name:"materialBrandId", type:"select"},
			{label:"状态", id:"statusSearch", name:"status", type:"select", op:"eq"},
        ]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#relationshipSearch").bindData(materialOutside.relationshipType, "", "", true);
	
	$("#materialTypeSearch").change(function(){
		var _materialTypeId = $("#materialTypeSearch").val();
		if(_materialTypeId == undefined || _materialTypeId == ""){
			return false;
		}
		com.post(api.data.queryBrandByCategoryId, {"brand.cid": _materialTypeId, }, function(res){
			$("#materialBrandSearch").bindData(res.brands, "bId", "brandName", true);
		});
	});
	
	com.post(api.material.queryMaterialType, {}, function(res){
		materialOutside.data.materialTypeData = res.categorys;
		$("#materialTypeSearch").bindData(materialOutside.data.materialTypeData, "cid", "categoryName", true);
	});
	
	$("#statusSearch").bindData(materialOutside.statusData, "id", "name", true);
	
	initializeListgrid();
	
});
function initializeListgrid(){
	materialOutside.listgrid.jqGrid({		
		url: api.material.pageMaterialOutside.url,
		postData: materialOutsidePostData,
		colNames:['编号', '楼盘地址', '客户姓名', '品类Id', '品类', '品牌Id', '品牌', '设计师Id', '设计师', '创建时间', '销售额', '利润', '状态', '状态', '备注', ],
		colModel:[
		    {name:'moId', hidden:true},
		    {name:'orderAddr'},
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
			{name:'status'},
			{name:'showStatus', formatter: statusInit},
			{name:'des'},
		], 
		pager : materialOutside.gridPager,
		caption: "场外信息列表"
	});

	materialOutside.listgrid.navGrid(materialOutside.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false},{},{},{}	,$.jgrid.searchFunc($(this)))
	.navButtonAdd(materialOutside.gridPager, {
		caption:"确认",
		buttonicon: 'icon-ok blue',
		onClickButton: function(){
			
			var num = materialOutside.listgrid.jqGrid('getGridParam','selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialOutside.listgrid.attr("id"));
				return false;
			}else{
				bootbox.confirm("确定要将符合条件的所有收款项目，置为已确认状态吗?", function(result) {
					if(result) {
						var _rowIds = materialOutside.listgrid.jqGrid('getGridParam','selarrrow');
						var options = {};
						
						for(var i=0;i<_rowIds.length;i++){
							_rowInfo = materialOutside.listgrid.jqGrid("getRowData", _rowIds[i]);
							options["moIds[" + i + "]"] = _rowInfo.moId;
						}
						
						com.post(api.materia.confirmMaterialOutsideByIds, options, function(result){
							com.showAlert(com.info, "确认成功!");
							for(var i=0;i<_rowIds.length;i++){
								materialOutside.listgrid.setCell(_rowIds[i], "status", 1);
								materialOutside.listgrid.setCell(_rowIds[i], "showStatus", "已确认");
							}
						}, function(result){
							com.showAlert(com.error, "确认失败!");
						});
					}
				});
			}
		},
		position: 'first'
	});
};

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	if(rowdata.status == "0"){
		result += '待确认';
	}else{
		result += '已确认';
	}
	return result;
	
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	materialOutside.listgrid.trigger("reloadGrid");
}
