var backVisit = {
	decorationOrderId : null,
	initBackVisitList : initBackVisitList,
	listGrid : null,
	gridPager : null,
	saveBtn : null,
	cancellBtn : null,
	modal : null,
	backVisitItems : {},
	postParam : {},
};

jQuery(function($) {
	
	backVisit.decorationOrderId = decorationOrderPostData.decorationOrderId;

	backVisit.listGrid = $("#listGrid");
	backVisit.gridPager = "#gridPager";
	backVisit.saveBtn = $("#saveBtn").on("click", saveData);
	backVisit.cancelBtn = $("#cancelBtn");
	backVisit.modal = $("#backVisitModal");
	
	backVisit.backVisitItems.backVisitContent = $("#backVisitContent");
	backVisit.backVisitItems.grade = $("#grade");
	
	initBackVisitList();
});

function initBackVisitList() {
	var backVisitSearchOpts = {
		url: api.decoration.pageBackVisitByOrderId.url,
		postParmas : {"backVisit.orderId": ""},
		listgrid : backVisit.listGrid,
		items : [ {
			label : "等级",
			id : "searchGrade",
			name : "grade",
			type : "select",
			op : "eq"
		} ]
	};

	$("#backVisitSearchDiv").flSearch(backVisitSearchOpts);
	
	//$("#backVisitSearchDiv > .fl_search").append('&nbsp;<button id="obsoleteOrderBtn" class="btn btn-sm btn-primary no-border">废单</button>');
	
//	$("#obsoleteOrderBtn").on("click",function(){
//		bootbox.confirm("确认要废单吗?",function(result){
//			if(result){
//				com.post(api.decoration.obsoleteDecorationOrder, {"decorationOrder.orderId":backVisit.decorationOrderId}, function(res){
//					if(res.errorCode==0){
//						com.showAlert(com.info, "操作成功");
//					}else{
//						com.showAlert(com.info, res.errorMsg);
//					}
//				});
//			}
//			
//		});
//	});
	
	com.post(api.ds.backVisitGrade, {}, function(res) {
		order.grade = res.grade;
		$("#searchGrade").bindData(order.grade, 'key', 'value', true);
		$("#grade").bindData(order.grade, 'key', 'value');
	});

	backVisit.listGrid.jqGrid({
		url: api.decoration.pageBackVisitByOrderId.url,
		postData : {"backVisit.orderId": backVisit.decorationOrderId},
		colNames : [ '编号', '操作人', '内容', '等级', '创建时间' ],
		colModel : [
		    {name: "autoId", hidden : true}, 
		    {name: 'designer'},
		    {name: 'backVisitContent'},
		    {name: 'grade',formatter: gradeInit},
		    {name: 'createTime'},
		],
		pager : backVisit.gridPager,
		caption : "回访信息列表"
	});

	backVisit.listGrid.navGrid(backVisit.gridPager, {
		edit : false,
		add : false,
		del : false,
		search : false,
		searchicon : 'icon-search orange',
		refresh : false,
		view : false
	}, {}, {}, {}, $.jgrid.searchFunc($(this))).navButtonAdd(
			backVisit.gridPager, {
				caption : "",
				buttonicon : "icon-plus-sign purple",
				title : "添加",
				onClickButton : function() {
					com.clearValidator();
					com.cleanItems(backVisit.backVisitItems);
					
					backVisit.backVisitItems.backVisitContent.get(0).selectedIndex = 0;
					backVisit.modal.modal("show");
				},
				position : "first"
			}).navButtonAdd(backVisit.gridPager, {
		caption : "",
		buttonicon : "icon-mail-forward",
		title : "返回",
		onClickButton : function() {
			$(".tooltip").remove();
			$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
		},
		position : "first"
	});
}
function gradeInit(cellvalue, options, rowdata){
	if(cellvalue == 0){
		return '普通';
	}else if(cellvalue == 1){
		return '重要';
	}else if(cellvalue == 2){
		return '紧急';
	}
}
function saveData(){
	
	if(com.validate()){
		return;
	}
	
	var options = {
		"backVisit.orderId":backVisit.decorationOrderId,
		"backVisit.backVisitContent":backVisit.backVisitItems.backVisitContent.val(),
		"backVisit.grade":backVisit.backVisitItems.grade.val()
	};
	
	com.post(api.decoration.addBackVisit, options, successCallback);
}

function successCallback(res) {
	if(res.errorCode == 0){
		com.showAlert(com.info, "操作成功");
		backVisit.listGrid.trigger("reloadGrid");
		backVisit.modal.modal("hide");
	}
}

function failCallback() {

}
