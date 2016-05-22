var chargeback = {
	orderId: null,	
	listgrid: null,
	gridPager: null,
	initChargebackList:initChargebackList,
	auditId: null, 
	status: ""
};

jQuery(function($) {
	
	chargeback.orderId = params.orderId;
	
	chargeback.listgrid = $("#listgrid");
	chargeback.gridPager = "#gridPager";
	
	$("#saveBtn").on("click", function(){
		var options = {
			'auditItem.auditId': chargeback.auditId, 
			'auditItem.status': chargeback.status, 
			'auditItem.orderId': chargeback.orderId,
			'auditItem.comment': $("#comment").val()
		}
		
		com.post(api.audit.changeBudgetAuditItemForStatus, options, successCallback);
		
		$("#statusModal").modal("hide");  
	});
	
	initChargebackList();
});

function initChargebackList(){
	initializeListgrid();
}

function initializeListgrid(){
	chargeback.listgrid.jqGrid({		
		url: api.audit.pageBudgetAuditItemByOrderId.url,
		postData: {"orderAudit.orderId": chargeback.orderId},
		colNames:['工程预算量', '名称', '功能区', '大类', '单位', '单价', '总价', '状态', '工艺说明', '操作说明', '操作'],
		colModel:[
		  {name:"num",width:40},
		  {name:"itemName",width:40},
		  {name:"functionAreaName",width:40},
		  {name:"categoryName",width:40},
		  {name:"measurementUnitName",width:40},
		  {name:"unitPrice",width:20},
		  {name:"sumMoney", formatter:sumMoneyFormatter,width:20},
		  {name:"status",width:30},
		  {name:"des"},
		  {name:"comment"},
		  {name:'action',width:80 , formatter: actionFormatter},
		], 
		pager : chargeback.gridPager,
		caption: "扣款信息列表"
	});

	chargeback.listgrid.navGrid(chargeback.gridPager, {edit:false,add:false,del:false,search:false, refresh: false,view: false},{},{}
	).navButtonAdd(chargeback.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.decorationOrderAuditIndex.url);
		},
		position: "first"
	});
}

function sumMoneyFormatter(cellvalue, options, rowObject){
	return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num)*100)/100;//不打折
}

function actionFormatter(cellvalue, options, row){
	var str = "";
	
	if(row.status != "已增"){
		str += '&nbsp;<div class="ui-pg-div btn-group"><button class="btn btn-minier btn-primary" onclick="actionClick('+row.auditId+', \'已增\', \''+row.comment+'\');">已增</button></div>';
	}
	
	if(row.status != "特批"){
		str += '&nbsp;<div class="ui-pg-div btn-group"><button class="btn btn-minier btn-yellow" onclick="actionClick('+row.auditId+', \'特批\', \''+row.comment+'\');">特批</button></div>';
	}
	
	if(row.status != "扣款"){
		str += '&nbsp;<div class="ui-pg-div btn-group"><button class="btn btn-minier btn-danger" onclick="actionClick('+row.auditId+', \'扣款\', \''+row.comment+'\');">扣款</button></div>';
	}
	
	return str;
}

function actionClick(auditId, status, comment){
	$("#statusModal .commontStaticText").text("确定要将该记录设置为 [ "+status+" ] 状态吗?");
	$("#comment").val(comment == "null" ? "" : comment);
	
	chargeback.auditId = auditId;
	chargeback.status = status;
	
	$("#statusModal").modal("show");
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	
	$.jgrid.refreshGrid(chargeback.listgrid, {"orderId": chargeback.orderId});
}
