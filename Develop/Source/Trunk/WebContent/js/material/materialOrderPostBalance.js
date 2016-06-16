var materialOrderPostBalance = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderPostBalanceItems: {},
	
	caclTypeData: [{"id":"0", "name":"点位"}, {"id":"1", "name":"底价"}],
	
	editFlag: false
};

var materialOrderPostBalancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	materialOrderPostBalance.listGrid = $("#listGrid");
	materialOrderPostBalance.gridPager = "#gridPager";
	materialOrderPostBalance.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPostBalance.cancelBtn = $("#cancelBtn");
	
	materialOrderPostBalance.custProfit = $("#custProfit");
	
	materialOrderPostBalance.materialSubOrderPostBalanceModal = $("#materialSubOrderPostBalanceModal").on('show.bs.modal',function(e){
		materialOrderPostBalance.custProfit.val(0);
		
		com.clearValidator();
	});
	
	materialOrderPostBalance.postBalanceBtn = $("#postBalanceBtn").on("click", function(){
		
		var options = {
			"materialSubOrder.msoId": materialOrderPostBalancePostData.msoId,
			"materialSubOrder.custProfit": materialOrderPostBalance.custProfit.val(),
		}
		
		com.post(api.material.postBalanceMaterialSubOrder, options, function(res){
			materialOrderPostBalance.listGrid.setCell(materialOrderPostBalancePostData.rowId, "action", "commit");
		});
		
		materialOrderPostBalance.materialSubOrderPostBalanceModal.modal("hide");
	});
	
	var orderSearchOpts = {
		url: api.material.pageMaterialSubOrderForPostBalance,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialOrderPostBalance.listGrid,
		items: [
	        {label:"订单号",id:"orderIdSearch",name:"orderId", type:'text'},
	        {label:"装修订单号",id:"orderIdSearch",name:"msoNo", type:'text'},
			{label:"楼盘地址",id:"orderAddrSearch",name:"orderAddr", type:'text'},
			{label:"业务员",id:"salesmanSearch",name:"salesman", type:'text'},
		]
	};
	$("#searchDiv").flSearch(orderSearchOpts);
	
	materialOrderPostBalance.listGrid.jqGrid({		
		url: api.material.pageMaterialSubOrderForPostBalance.url,
		colNames:['msoId', '编号', '楼盘名', '客户名', '业务员', '品牌', '点位', '底价', '抹零', '厂商抹零', '券信息', '描述', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'msoId', hidden:true},
		    {name:'msoNo'},
		    {name:'orderAddr', width:300},
		    {name:'customerName'},
		    {name:'salesmanName'},
		    {name:'materialBrand'},
		    {name:'point', hidden:true},
		    {name:'base', hidden:true},
		    {name:'maling', hidden:true},
		    {name:'venderMaling', hidden:true},
		    {name:'couponInfo', hidden:true},
			{name:'des'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		pager : materialOrderPostBalance.gridPager,
		caption: "结算信息列表"
	});
	
	materialOrderPostBalance.listGrid.navGrid(materialOrderPostBalance.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	);
//	.navButtonAdd(materialOrderPostBalance.gridPager, {
//		caption:"",
//		buttonicon: 'icon-ok blue',
//		title: "结算",
//		onClickButton: function(){
//			
//			var options = {};
//			
//			var num = materialOrderPostBalance.listGrid.jqGrid('getGridParam','selrow');
//			
//			if(num == null){
//				$.jgrid.showSelectInfo(materialOrderPostBalance.listGrid.attr("id"));
//				return false;
//			}else{
//				
//				var _rowIds = materialOrderPostBalance.listGrid.jqGrid('getGridParam','selarrrow');
//				
//				for(var i=0;i<_rowIds.length;i++){
//					_rowInfo = materialOrderPostBalance.listGrid.jqGrid("getRowData", i+1);
//					options["msoIds[" + i + "]"] = _rowInfo.msoId;
//				}
//			
//				console.log(options);
//				
//				bootbox.confirm("确定需要提交当前子订单的结算处理吗?", function(result) {
//					if(result){
//						com.post(api.material.postBalanceMaterialSubOrder, options, function(result){
//							materialOrderPostBalance.listGrid.trigger("reloadGrid");
//							com.showAlert(com.info, "确认成功!");
//						}, function(result){
//							com.showAlert(com.error, "确认失败!");
//						});
//					}
//				});
//			}
//		},
//	});
	
});

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "commit"){
		result = "已结算";
		
		return result;
	}
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewMaterialOrderBalanceDetailIndex(\'' + rowdata.msoId + '\', \'' + rowdata.maling + '\', \'' + rowdata.venderMaling + '\', \'' + rowdata.couponInfo + '\');">子项</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="dialogMaterialOrderBalanceIndex(\'' + options.rowId + '\', \'' + rowdata.msoId + '\');">结算</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
}

function viewMaterialOrderBalanceDetailIndex(msoId, maling, venderMaling, couponInfo){
	materialOrderPostBalancePostData["materialOrderPostBalance.msoId"] = msoId;
	materialOrderPostBalancePostData["materialOrderPostBalance.maling"] = maling;
	materialOrderPostBalancePostData["materialOrderPostBalance.venderMaling"] = venderMaling;
	materialOrderPostBalancePostData["materialOrderPostBalance.couponInfo"] = couponInfo;
	$("#materialOrderPostBalancePageContent").load(api.index.materialOrderPostBalanceDetailIndex.url);
}

function dialogMaterialOrderBalanceIndex(rowId, msoId){
	
	materialOrderPostBalancePostData.rowId = rowId;
	materialOrderPostBalancePostData.msoId = msoId;
	
	materialOrderPostBalance.materialSubOrderPostBalanceModal.modal("show");
}

