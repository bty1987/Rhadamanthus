var venderBalance = {
	listGrid: null,
	gridPager: null,
	
	listHistoryGrid: null,
	gridHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	venderBalanceItems: {},
	
	statusTypeData: {"0":"初始", "1":"已发"},
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
};

jQuery(function($) {
	venderBalance.modal = $("#paySalaryModal");
	venderBalance.listGrid = $("#listGrid");
	venderBalance.gridPager = "#gridPager";
	
	venderBalance.listHistoryGrid = $("#listHistoryGrid");
	venderBalance.gridHistoryPager = "#gridHistoryPager";

	initSalaryList();
	initSalaryHistoryList();
	
	var searchOpts = {
		url: api.salary.pageVenderBalanceForInit,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: venderBalance.listGrid,
		items: [
	        {label:"品牌名称",id:"materialBrandNameSearch",name:"materialBrandName", type:'autoFillPinyinText', url:api.data.queryBrandForPinYinName, op:"eq"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#searchDiv > .fl_search").append('<button id="payoff" class="btn btn-sm btn-danger" style="padding-left:15px;">厂商结算</button>');
	$("#payoff").on("click", function(){
		bootbox.confirm("当前操作系统将针对当前未完成结算的主材厂商进行结算 , 是否提交完成主材厂商结算", function(result) {
			if(result){
				com.post(api.salary.payVenderBalance, {}, function(result){
					com.showAlert(com.info, "结算成功!");
					venderBalance.listGrid.trigger("reloadGrid");
					venderBalance.listHistoryGrid.trigger("reloadGrid");
				}, function(result){
					com.showAlert(com.error, "结算失败!");
				});
			}
		});
	});
	
	var searchHistoryOpts = {
		url: api.salary.pageVenderBalanceForPayOff.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: venderBalance.listHistoryGrid,
		items: [
	        {label:"品牌名称",id:"materialBrandNameSearch",name:"materialBrandName", type:'autoFillPinyinText', url:api.data.queryBrandForPinYinName, op:"eq"},
		]
	};
	$("#searchHistoryDiv").flSearch(searchHistoryOpts);

	$("#venderBalanceHistory").removeClass("active");
});

function initSalaryList(){
	venderBalance.listGrid.jqGrid({
		url: api.salary.pageVenderBalanceForInit.url,
		colNames:['dsId', '品牌', '起始时间', '结束时间', '结算', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'materialBrandName'},
			{name:'createTime'},
			{name:'endTime', hidden:true},
			{name:'balance'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', hidden:true, formatter: actionInit}
		],
		sortable:false,
		pager : venderBalance.gridPager,
		caption: ""
	});

	venderBalance.listGrid.navGrid(venderBalance.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initSalaryHistoryList(){
	venderBalance.listHistoryGrid.jqGrid({		
		url: api.salary.pageVenderBalanceForInit.url,
		colNames:['dsId', '品牌', '起始时间', '结束时间', '主材', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'materialBrandName'},
			{name:'createTime'},
			{name:'endTime'},
			{name:'balance'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', hidden:true, formatter: actionInit}
		],
		sortable:false,
		pager :venderBalance.gridHistoryPager,
		caption: ""
	});

	venderBalance.listHistoryGrid.navGrid(venderBalance.gridHistoryPager, 
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="paySalary(\''+cellvalue+'\');">发放工资</button>';
	result += '</div>';
	
	return result;
}

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = venderBalance.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += venderBalance.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += venderBalance.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}