var designerDeductSalary = {
	listGrid: null,
	gridPager: null,
	
	listHistoryGrid: null,
	gridHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	designerDeductSalaryItems: {},
	
	statusTypeData: [{"id":"0", "name":"初始"}, {"id":"1", "name":"已发"}],
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
};

jQuery(function($) {
	designerDeductSalary.modal = $("#paySalaryModal");
	designerDeductSalary.listGrid = $("#listGrid");
	designerDeductSalary.gridPager = "#gridPager";
	
	initSalaryList();
	
	var searchOpts = {
		url: api.salary.pageDesignerDeductSalary,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerDeductSalary.listGrid,
		items: [
	        {label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"类型",id:"typeSearch",name:"type", type:"select", op:"eq"},
	        {label:"状态",id:"statusSearch",name:"status", type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#statusSearch").bindData(designerDeductSalary.statusTypeData, "id", "name", true);
	
});

function initSalaryList(){
	designerDeductSalary.listGrid.jqGrid({
		url: api.salary.pageDesignerDeductSalary.url,
		colNames:['dsId', 'userId', '姓名', '起始时间', '场外', '类型', '类型', '状态', '状态'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'createTime'},
			{name:"deduct"},
			{name:"type", hidden:true},
			{name:"showType", formatter: typeInit},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
		],
		sortable:false,
		pager : designerDeductSalary.gridPager,
		caption: ""
		
	});

	designerDeductSalary.listGrid.navGrid(designerDeductSalary.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function typeInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(rowdata.type.toString() == "0"){
		result = "无";
	}else if(rowdata.type.toString() == "1"){
		result = "增减项";
	}
	
	return result;
}

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(rowdata.status.toString() == "0"){
		result = "初始";
	}else if(rowdata.status.toString() == "1"){
		result = "已付";
	}
	
	return result;
}