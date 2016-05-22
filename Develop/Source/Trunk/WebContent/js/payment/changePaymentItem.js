var changePaymentItem = {
	listChangePaymentItemHistoryGrid: null,
	gridChangePaymentItemHistoryPager: null,
	
	searchDiv:null,
	listGrid:null,
	gridPager:null,
	
	changePaymentItemModal: null,

	changePaymentItemItems: {},
	
	orderId:null,
	historyPostParam:{},
};

jQuery(function($) {
	changePaymentItem.listChangePaymentItemHistoryGrid = $("#listChangePaymentItemHistoryGrid");
	changePaymentItem.gridChangePaymentItemHistoryPager = "#gridChangePaymentItemHistoryPager";
	
	changePaymentItem.listGrid = $("#listGrid");
	changePaymentItem.gridPager = "#gridPager";
	
	changePaymentItem.changePaymentItemModal = $("#changePaymentItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#changeMoney", true);
	});
	
	var searchOpts = {
		url: api.payment.pageDecorationPaymentForChange,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: changePaymentItem.listGrid,
		items: [
		    {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
	        {label:"客户电话", id:"searchPhone",name:"customerPhone", type:"text"},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber",type:"text"},
			{label:"订单编号", id:"searchOrderId", name:"orderId", type:'text'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);

	$("#saveChangePaymentBtn").on('click',function(){
		com.clearValidator();
		com.clearValidator("#changeMoney", true);
		if(com.validate("changePaymentItemModal")){
			return;
		}
		
		if(parseFloat($("#changeMoney").val()) > parseFloat($("#paymentBlance").val())){
			com.showTips($("#changeMoney"), "余额不足", true);
			return;
		}else{
			com.clearValidator("#changeMoney", true);
		}
		
		changePaymentItemOk();
	});
	
	initChangePaymentItemHistoryList();
});

function initChangePaymentItemHistoryList(){
	changePaymentItem.listGrid.jqGrid({		
		url: api.payment.pageDecorationPaymentForChange.url,
		postData: {"filters[0].field":"orderId","filters[0].op":"eq","filters[0].data":"null"},
		colNames:['编号', '订单编号', '收款类型', '客户名', '设计师', '楼盘地址', '剩余金额', '操作', 'cityP'],
		colModel:[
		    {name:'autoId',hidden:true},
		    {name:'orderId'},
		    {name:'paymentType'},
			{name:'customer'},
			{name:'designer'},
			{name:'village',jsonmap:'village',formatter: villageInit},
			{name:'paymentBlance'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit},
			{name:"cityProper",hidden:true}
		], 
		rowNum:20,
		sortable:false,
		pager : changePaymentItem.gridPager,
		caption: ""
	});

	changePaymentItem.listGrid.navGrid(changePaymentItem.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this)));
}

function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.cityProper+rowdata.village + ''+rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="changePaymentItemShow(\''+rowdata.autoId+'\',\''+rowdata.paymentType+'\','+rowdata.paymentBlance+',\''+rowdata.orderId+'\');">转换款项</button>';
	result += '</div>';
	
	return result;
}

function changePaymentItemShow(decorationPaymentId,paymentType,paymentBlance,orderId){
	
	$("#decorationPaymentId").val(decorationPaymentId);
	$("#paymentBlance").val(paymentBlance);
	changePaymentItem.changePaymentItemModal.modal("show");
	
	changePaymentItem.orderId = orderId;
}

function changePaymentItemOk(){
	
	var options = {
		"decorationPayment.autoId":$("#decorationPaymentId").val(),
		"decorationPayment.cash":$("#changeMoney").val()
	};
	
	bootbox.confirm("确认要转换（"+$("#changeMoney").val()+"）元吗?",function(res){
		if(res){	
			com.post(api.payment.convertDecorationPayment, options, function(res){

				$("#fl_btn_searchDiv").trigger("click");
				
				com.showAlert(com.info, "操作成功");
			});
			
			changePaymentItem.changePaymentItemModal.modal("hide");
		}
	});
}
