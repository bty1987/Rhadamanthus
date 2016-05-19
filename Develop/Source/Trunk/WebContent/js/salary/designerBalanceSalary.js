var designerBalanceSalary = {
	preListGrid: null,
	preGridPager: null,
	
	postListGrid: null,
	postGridPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerSalaryCalculationItems: {},
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
	
};

jQuery(function($) {
	designerBalanceSalary.preListGrid = $("#preListGrid");
	designerBalanceSalary.preGridPager = "#preGridPager";
	
	designerBalanceSalary.postListGrid = $("#postListGrid");
	designerBalanceSalary.postGridPager = "#postGridPager";

	initPreListGrid();
	initPostListGrid();
	
	var preSearchOpts = {
		url: api.salary.pageDesignerPreBalanceSalary,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerBalanceSalary.preListGrid,
		items: [
	        {label:"装修订单编号",id:"orderIdSearch",name:"orderId", type:'text'},
	        {label:"主材订单编号",id:"msoIdSearch",name:"msoNo", type:'text'},
	        {label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#preSearchDiv").flSearch(preSearchOpts);
	
	var postSearchOpts = {
		url: api.salary.pageDesignerPostBalanceSalary,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerBalanceSalary.postListGrid,
		items: [
			{label:"装修订单编号",id:"orderIdSearch",name:"orderId", type:'text'},
			{label:"主材订单编号",id:"msoIdSearch",name:"msoNo", type:'text'},
			{label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
			{label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
        ]
	};
	$("#postSearchDiv").flSearch(postSearchOpts);

	$("#postBalance").removeClass("active");
	
});
function initPreListGrid(){
	designerBalanceSalary.preListGrid.jqGrid({		
		url: api.salary.pageDesignerPreBalanceSalary.url,
		colNames:['编号', '编号', '装修订单编号', '主材订单Id', '主材订单编号', '员工编号', '姓名', '金额', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'dprbsId',hidden:true},
		    {name:'dsId',hidden:true},
		    {name:'orderId'},
		    {name:'msoId', hidden:true},
		    {name:'msoNo'},
		    {name:'userId'},
			{name:'userName'},
			{name:'preBalance'},
			{name:'status', hidden:true},
			{name:'action', formatter: actionInit, hidden:true}
		], 
		sortable:false,
		pager : designerBalanceSalary.preGridPager,
		caption: ""
	});

	designerBalanceSalary.preListGrid.navGrid(designerBalanceSalary.preGridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initPostListGrid(){
	designerBalanceSalary.postListGrid.jqGrid({		
		url: api.salary.pageDesignerPostBalanceSalary.url,
		colNames:['编号', '编号', '装修订单编号', '主材订单Id', '主材订单编号', '员工编号', '姓名', '金额', '状态', '操作'],
		colModel:[
		    {name:'dpobsId',hidden:true},
		    {name:'dsId',hidden:true},
		    {name:'orderId'},
		    {name:'msoId', hidden:true},
		    {name:'msoNo'},
		    {name:'userId'},
			{name:'userName'},
			{name:'postBalance'},
			{name:'status', hidden:true},
			{name:'action', formatter: actionInit, hidden:true}
		], 
		sortable:false,
		pager : designerBalanceSalary.postGridPager,
		caption: ""
	});

	designerBalanceSalary.postListGrid.navGrid(designerBalanceSalary.postGridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(designerBalanceSalary.postGridPager, {
		caption:"",
		buttonicon: 'icon-download blue',
		onClickButton: function(){    

			alert("导出");
		},
		position: 'first'
	}).navButtonAdd(designerBalanceSalary.postGridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    

			var num = designerBalanceSalary.listCalSalaryHistoryGrid.jqGrid("getGridParam", 'selrow');
			
			if(num==null){
				$.jgrid.showSelectInfo(designerBalanceSalary.listCalSalaryHistoryGrid.attr("id"));
				return;
			}
			var row = designerBalanceSalary.listCalSalaryHistoryGrid.jqGrid("getRowData", num);
			
			designerBalanceSalary.editFlg =  true;
			
			designerBalanceSalary.workerSalaryCalculationItems.workerSalaryId.val(row.workerSalaryId);
			designerBalanceSalary.workerSalaryCalculationItems.salaryContent.val(row.salaryContent);
			designerBalanceSalary.workerSalaryCalculationItems.realSalary.val(row.realSalary);
			
			designerBalanceSalary.modal.modal("show");
		},
		position: 'first'
	});
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="paySalary(\''+cellvalue+'\');">发放工资</button>';
	result += '</div>';
	
	return result;
}

