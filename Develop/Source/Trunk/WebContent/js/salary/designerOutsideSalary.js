var designerOutsideSalary = {
	listGrid: null,
	gridPager: null,
	
	listHistoryGrid: null,
	gridHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	designerOutsideSalaryItems: {},
	
	statusTypeData: [{"id":"0", "name":"初始"}, {"id":"1", "name":"已发"}],
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
	
};

jQuery(function($) {
	designerOutsideSalary.modal = $("#paySalaryModal");
	designerOutsideSalary.listGrid = $("#listGrid");
	designerOutsideSalary.gridPager = "#gridPager";
	
	initSalaryList();
	
	var searchOpts = {
		url: api.salary.pageDesignerOutsideSalary,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerOutsideSalary.listGrid,
		items: [
	        {label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"状态",id:"statusSearch",name:"status", type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#statusSearch").bindData(designerOutsideSalary.statusTypeData, "id", "name", true);
});

function initSalaryList(){
	designerOutsideSalary.listGrid.jqGrid({
		url: api.salary.pageDesignerOutsideSalary.url,
		colNames:['dsId', 'userId', '姓名', '起始时间', '场外', '状态', '状态'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'createTime'},
			{name:"outside"},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
		],
		sortable:false,
		pager : designerOutsideSalary.gridPager,
		caption: ""
	});

	designerOutsideSalary.listGrid.navGrid(designerOutsideSalary.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
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