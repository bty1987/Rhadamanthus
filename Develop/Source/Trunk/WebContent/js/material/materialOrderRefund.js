var materialSubOrderRefund = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderRefundItems: {},
	
	editFlag: false
};

var materialSubOrderRefundPostData = {};

var materialSubOrderRefundData = [];

jQuery(function($) {
	$('#fl-statement').statement("主材退款", "退款信息列表");
	
	materialSubOrderRefund.listGrid = $("#listGrid");
	materialSubOrderRefund.gridPager = "#gridPager";
	materialSubOrderRefund.saveBtn = $("#saveBtn");
	materialSubOrderRefund.cancelBtn = $("#cancelBtn");
	
	materialSubOrderRefundPostData["materialSubOrder.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderRefundPostData["materialSubOrder.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
	
	com.post(api.material.queryMaterialSubOrderRefund, materialSubOrderPostData, function(result){
		
		materialSubOrderRefundData = result.materialSubOrderRefunds;
		materialSubOrderRefundListGridInit();
		
		$("#backBtn").on("click", function(){
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		});
		
		$("#printBtn").on("click", function(){
			
			var url = api.index.materialSubOrderReceipt.url + "?type=2&materialSubOrder.msoId=" + materialSubOrderRefundPostData["materialSubOrder.msoId"];
			var printFlag = false;
			var index = 0;
			
			$("[name='print']").each(function(i, e){
			     if(e.checked){
			    	 url += "&idents["+index+"]="+$("#"+e.id).attr('ident');
			    	 index++;
			    	 printFlag = true;
			     }
			 });
			
			if(printFlag){
				window.open(url);
			}
		});
	});
	
});

function materialSubOrderRefundListGridInit(){
	materialSubOrderRefund.listGrid.jqGrid({
		treeGrid: true,
		treeGridModel: 'adjacency',
		ExpandColumn: 'id',
		datastr: JSON.stringify(materialSubOrderRefundData),
		datatype: "jsonstring",
	    rowNum : "-1",
	    height: "1000",
	    multiselect: true,
		colNames:['编号', 'id', 'msoiId', 'msoiId', 'msoId', '名称', '品类', '品牌', '单位', '售价', '数量', '总价', '状态', '结算类型', '级别', '叶子', '操作', 'ident', '打印'],
		colModel:[
		    {name:'materialModelNo', editable:true},
		    {name:'id', hidden:true},
		    {name:'msorId', hidden:true},
		    {name:'msoiId', hidden:true},
		    {name:'msoId', hidden:true},
		    {name:'materialModelName', editable:true},
			{name:'materialTypeName', editable:true},
			{name:'materialBrandName', editable:true},
			{name:'measurementUnitName', editable:true},
			{name:'price', editable:true},
			{name:'num', editable: true},
			{name:'total', editable: true},
			{name:'status', hidden: true},
			{name:'balanceType', hidden: true},
			{name:'level', hidden:true},
			{name:'isLeaf', hidden:true},
			{name:'action', sortable: false, hidden:true, editable: false, formatter: actionInit},
			{name:'ident', hidden:true},
			{name:'print', width:80, formatter:printInit}
		],
	    pager: "false",
		caption: "子项信息列表 <a><span id='printBtn' class='ui-icon icon-print white' style='width:50px;height:30px;top:12px;right:70px;cursor:pointer'>打印</span><a><span id='backBtn' class='ui-icon icon-mail-forward white' style='width:50px;height:30px;top:12px;right:20px;cursor:pointer'>返回</span></a>",

		jsonReader: {
	        root: "dataRows",
	        repeatitems : false
	    },
	    treeReader : {
	        level_field: "level",
	        parent_id_field: "parent",
	        leaf_field: "isLeaf",
	        expanded_field: "expanded"
	    },
	    ondblClickRow: function(id){
	    	console.log("ondblClickRow");
	    },
	    gridComplete: function(){
	    	console.log("gridComplete");
	    	$(".tree-minus").unbind();
	    },
	});
	
	materialSubOrderRefund.listGrid.navGrid(materialSubOrderRefund.gridPager,
		{edit: false, add: false, del: true, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialSubOrderRefund.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		},
		position: "first",
	});
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(rowdata.level == 0 || cellvalue == "subItem"){
		result += '<div class="ui-pg-div btn-group">';
		if(rowdata.status == 0 && rowdata.balanceType == 0){
//			result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="cancelMaterialSubOrderRefund('+ options.rowId + ', ' + rowdata.level + ', ' + rowdata.isLeaf + ');">撤销</button>';
		}
		result += '</div>';
	}else{
	}
	
	return result;
}

function printInit(cellvalue, options, rowdata){
	
	var result ='';
	
	if(rowdata.level == 0 || cellvalue == "subItem"){
		result += '<div class="ui-pg-div btn-group">';
		if(rowdata.status == 0 && rowdata.balanceType == 0){
			result += '<input id="print_'+ rowdata["ident"] +'" ident="'+ rowdata["ident"] +'" name="print" class="cbox ace" type="checkbox" role="checkbox">';
		}
		result += '</div>';
	}else{
	}
	
	return result;
}

function cancelMaterialSubOrderRefund(rowId, level, isLeaf){
	
	var options = {};
	var rowIds = [];
	var url = "";
	var i = 0;
		
	var _materialSubOrderRefund = materialSubOrderRefund.listGrid.jqGrid('getRowData', rowId);
	
	rowIds.push(rowId);
	
	if(isLeaf){
		url = api.material.cancelMaterialSubOrderRefundForModel;
		options["materialSubOrderRefund.msorId"] = _materialSubOrderRefund.msorId;
		
	}else{
		url = api.material.cancelMaterialSubOrderRefundForPackage;
		options["msoId"] = _materialSubOrderRefund.msoId;
		while(true){
			rowId = rowId + 1;
			
			var item = materialSubOrderRefund.listGrid.jqGrid('getRowData', rowId);
			if(item.level == 0 && item.isLeaf || rowId > materialSubOrderRefund.listGrid.jqGrid('getGridParam','records')){
				break;
			}
			
			options["msorIds["+i+"]"] = item.msorId;
			
			rowIds.push(rowId);
			
			i++;
		}
	}
	
	com.post(url, options, function(result){
		com.showAlert(com.info, "数据提交成功!");
		for(var i=0;i<rowIds.length;i++){
			materialSubOrderRefund.listGrid.jqGrid("delRowData", rowIds[i]);
		}
	}, function(result){
		com.showAlert(com.error, "数据提交失败!");
	});
	
}
