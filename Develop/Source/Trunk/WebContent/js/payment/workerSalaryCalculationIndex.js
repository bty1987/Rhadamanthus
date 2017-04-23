var workerSalaryCalculation = {
	listGrid: null,
	gridPager: null,
	
	listCalSalaryHistoryGrid: null,
	gridCalSalaryHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerSalaryCalculationItems: {},
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
	
};

jQuery(function($) {
	workerSalaryCalculation.modal = $("#paySalaryModal");
	workerSalaryCalculation.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	workerSalaryCalculation.listGrid = $("#listGrid");
	workerSalaryCalculation.gridPager = "#gridPager";
	
	workerSalaryCalculation.listCalSalaryHistoryGrid = $("#listCalSalaryHistoryGrid");
	workerSalaryCalculation.gridCalSalaryHistoryPager = "#gridCalSalaryHistoryPager";

	workerSalaryCalculation.workerSalaryCalculationItems.workerSalaryId = $("#workerSalaryId");
	workerSalaryCalculation.workerSalaryCalculationItems.salaryContent = $("#salaryContent");
	workerSalaryCalculation.workerSalaryCalculationItems.realSalary = $("#realSalary");
	
	initPaySalaryList();
	initPaySalaryHistoryList();
	
	var searchOpts = {
		url: workerSalaryCalculation.queryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerSalaryCalculation.listgrid,
		items: [
	        {label:"员工编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"工资时间", id:"salaryMonthSearch", name:"salaryMonth",type:"dateRangePicker",op:"between"},
	        {label:"工种",id:"workerTypeSearch",name:"workerType",type:"select",op:"eq"}
        ]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#workerTypeSearch").bindData([{"key":"0","value":"铲大白 "},{"key":"1","value":"水电"},{"key":"2","value":"力工 "}], "key", "value", true);
	
	var searchHistoryOpts = {
		url: workerSalaryCalculation.queryHistoryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerSalaryCalculation.listCalSalaryHistoryGrid,
		items: [{label:"员工编号",id:"userIdHistorySearch",name:"userId", type:'text'},
		        {label:"工资时间", id:"salaryMonthHistorySearch", name:"salaryMonth",type:"dateRangePicker",op:"between"},
		        {label:"工种",id:"workerTypeHistorySearch",name:"workerType",type:"select",op:"eq"}
		       ]
	};
	$("#searchCalSalaryHistoryDiv").flSearch(searchHistoryOpts);
	$("#workerTypeHistorySearch").bindData([{"key":"0","value":"铲大白 "},{"key":"1","value":"水电"},{"key":"2","value":"力工 "}], "key", "value", true);

	$("#history").removeClass("active");
	
});
function initPaySalaryList(){
	workerSalaryCalculation.listGrid.jqGrid({
		url: "ds/workerSalary.json",
		colNames:['编号','员工编号', '姓名', '工资月份', '应发工资',  '操作'],
		colModel:[
		    {name:'workerSalaryId',hidden:true},
		    {name:'userId'},
			{name:'userName'},
			{name:'salaryMonth'},
			{name:'referSalary'},
			{name:'action',  jsonmap:'workerSalaryId',width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		sortable:false,
		pager : workerSalaryCalculation.gridPager,
		caption: ""
	});

	workerSalaryCalculation.listGrid.navGrid(workerSalaryCalculation.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initPaySalaryHistoryList(){
	workerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid({		
		url: "ds/workerSalaryHistory.json",
		colNames:['编号','员工编号', '姓名', '工资月份', '应发工资','实发工资','说明'],
		colModel:[
		    {name:'workerSalaryId',hidden:true},
		    {name:'userId'},
			{name:'userName'},
			{name:'salaryMonth'},
			{name:'referSalary'},
			{name:'realSalary'},
			{name:'salaryContent'}
		], 
		sortable:false,
		pager : workerSalaryCalculation.gridCalSalaryHistoryPager,
		caption: ""
	});

	workerSalaryCalculation.listCalSalaryHistoryGrid.navGrid(workerSalaryCalculation.gridCalSalaryHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this)))
		.navButtonAdd(workerSalaryCalculation.gridCalSalaryHistoryPager, { //edit
			caption:"",
			buttonicon: 'icon-download blue',
			onClickButton: function(){    

				alert("导出");
			},
			position: 'first'
		})
		.navButtonAdd(workerSalaryCalculation.gridCalSalaryHistoryPager, { //edit
			caption:"",
			buttonicon: 'icon-pencil blue',
			onClickButton: function(){    

				var num = workerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid("getGridParam", 'selrow');
				
				if(num == null){
					$.jgrid.showSelectInfo(workerSalaryCalculation.listCalSalaryHistoryGrid.attr("id"));
					return;
				}
				var row = workerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid("getRowData", num);
				
				workerSalaryCalculation.editFlg =  true;
				
				workerSalaryCalculation.workerSalaryCalculationItems.workerSalaryId.val(row.workerSalaryId);
				workerSalaryCalculation.workerSalaryCalculationItems.salaryContent.val(row.salaryContent);
				workerSalaryCalculation.workerSalaryCalculationItems.realSalary.val(row.realSalary);
				
				workerSalaryCalculation.modal.modal("show");
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

function paySalary(workerSalaryId){
	workerSalaryCalculation.editFlg = false;
	
	com.cleanItems(workerSalaryCalculation.workerSalaryCalculationItems);
	workerSalaryCalculation.workerSalaryCalculationItems.workerSalaryId.val(workerSalaryId);
	
	workerSalaryCalculation.modal.modal("show");
}


