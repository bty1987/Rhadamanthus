var designerSalaryCalculation = {
	listGrid: null,
	gridPager: null,
	
	listCalSalaryHistoryGrid: null,
	gridCalSalaryHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	designerSalaryCalculationItems: {},
	
	queryUrl:null,
	queryHistoryUrl:null,
	
	editFlg: false
	
};

jQuery(function($) {
	designerSalaryCalculation.modal = $("#paySalaryModal");
	designerSalaryCalculation.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	designerSalaryCalculation.listGrid = $("#listGrid");
	designerSalaryCalculation.gridPager = "#gridPager";
	
	designerSalaryCalculation.listCalSalaryHistoryGrid = $("#listCalSalaryHistoryGrid");
	designerSalaryCalculation.gridCalSalaryHistoryPager = "#gridCalSalaryHistoryPager";

	designerSalaryCalculation.designerSalaryCalculationItems.designerSalaryId = $("#designerSalaryId");
	designerSalaryCalculation.designerSalaryCalculationItems.salaryContent = $("#salaryContent");
	designerSalaryCalculation.designerSalaryCalculationItems.realSalary = $("#realSalary");
	
	initPaySalaryList();
	initPaySalaryHistoryList();
	
	var searchOpts = {
		url: designerSalaryCalculation.queryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerSalaryCalculation.listgrid,
		items: [
		        {label:"设计分区",id:"designRegionSearch",name:"designRegionId",type:"select",op:"eq"},
		        {label:"设计部",id:"designDeptSearch",name:"designDeptId",type:"select",op:"eq"},
		        {label:"员工编号",id:"userIdSearch",name:"userId", type:'text'},
		        {label:"工资时间", id:"salaryMonthSearch", name:"salaryMonth",type:"dateRangePicker",op:"between"}
		       ]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#designRegionSearch").bindData([{"key":"0","value":"设计一分区 "},{"key":"1","value":"设计二分区 "},{"key":"2","value":"设计三分区  "}], "key", "value", true);
	$("#designDeptSearch").bindData([{"key":"0","value":"设计一部 "},{"key":"1","value":"宏发部 "},{"key":"2","value":"设计四部  "}], "key", "value", true);
	
	var searchHistoryOpts = {
		url: designerSalaryCalculation.queryHistoryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerSalaryCalculation.listCalSalaryHistoryGrid,
		items: [ 
		         	{label:"设计分区",id:"designRegionHistorySearch",name:"designRegionId",type:"select",op:"eq"},
			        {label:"设计部",id:"designDeptHistorySearch",name:"designDeptId",type:"select",op:"eq"},
			        {label:"员工编号",id:"userIdHistorySearch",name:"userId", type:'text'},
			        {label:"工资时间", id:"salaryMonthHistorySearch", name:"salaryMonth",type:"dateRangePicker",op:"between"}
			   ]
	};
	$("#searchCalSalaryHistoryDiv").flSearch(searchHistoryOpts);
	$("#designRegionHistorySearch").bindData([{"key":"0","value":"设计一分区 "},{"key":"1","value":"设计二分区 "},{"key":"2","value":"设计三分区  "}], "key", "value", true);
	$("#designDeptHistorySearch").bindData([{"key":"0","value":"设计一部 "},{"key":"1","value":"宏发部 "},{"key":"2","value":"设计四部  "}], "key", "value", true);
	
	$("#history").removeClass("active");
	
});
function initPaySalaryList(){
	designerSalaryCalculation.listGrid.jqGrid({		
		colNames:['编号','员工编号', '姓名', '工资月份', '基本工资' , '基本工资扣款' , '主材提成' , '主材提成扣款' , '正林提成' , '正林提成扣款 ', '工程提成' , '工程提成扣款','应发工资','操作'],
		colModel:[
		    {name:"designerSalaryId",hidden:true},
		    {name:'userId'},
			{name:'userName'},
			{name:'salaryMonth'},
			{name:'baseSalary'},
			{name:'reduceBaseSalary'},
			{name:'materialSalary'},
			{name:'reduceMaterialSalary'},
			{name:'zhengLinSalary'},
			{name:'reduceZhengLinSalary'},
			{name:'projectSalary'},
			{name:'reduceProjectSalary'},
			{name:'referSalary'},
			{name:'action', jsonmap:'designerSalaryId', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		sortable:false,
		pager : designerSalaryCalculation.gridPager,
		caption: ""
		
	});

	designerSalaryCalculation.listGrid.navGrid(designerSalaryCalculation.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initPaySalaryHistoryList(){
	designerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid({		
		url: "ds/designerSalaryHistory.json",
		colNames:['编号','员工编号', '姓名', '工资月份', '基本工资' , '基本工资扣款' , '主材提成' , '主材提成扣款' , '正林提成' , '正林提成扣款 ', '工程提成' , '工程提成扣款','应发工资','实发工资','说明'],
		colModel:[
		    {name:"designerSalaryId",hidden:true},
		    {name:'userId'},
			{name:'userName'},
			{name:'salaryMonth'},
			{name:'baseSalary'},
			{name:'reduceBaseSalary'},
			{name:'materialSalary'},
			{name:'reduceMaterialSalary'},
			{name:'zhengLinSalary'},
			{name:'reduceZhengLinSalary'},
			{name:'projectSalary'},
			{name:'reduceProjectSalary'},
			{name:'referSalary'},
			{name:'realSalary'},
			{name:'salaryContent'}
		], 
		sortable:false,
		pager : designerSalaryCalculation.gridCalSalaryHistoryPager,
		caption: ""
		
	});

	designerSalaryCalculation.listCalSalaryHistoryGrid.navGrid(designerSalaryCalculation.gridCalSalaryHistoryPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(designerSalaryCalculation.gridCalSalaryHistoryPager, { //edit
		caption:"",
		buttonicon: 'icon-download blue',
		onClickButton: function(){    

			alert(1);
		},
		position: 'first'
	}).navButtonAdd(designerSalaryCalculation.gridCalSalaryHistoryPager, { //edit
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    

			var num = designerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid("getGridParam", 'selrow');
			
			if(num==null){
				$.jgrid.showSelectInfo(designerSalaryCalculation.listCalSalaryHistoryGrid.attr("id"));
				return;
			}
			var row = designerSalaryCalculation.listCalSalaryHistoryGrid.jqGrid("getRowData", num);
			
			designerSalaryCalculation.editFlg =  true;
			
			designerSalaryCalculation.designerSalaryCalculationItems.designerSalaryId.val(row.designerSalaryId);
			designerSalaryCalculation.designerSalaryCalculationItems.salaryContent.val(row.salaryContent);
			designerSalaryCalculation.designerSalaryCalculationItems.realSalary.val(row.realSalary);
			
			designerSalaryCalculation.modal.modal("show");
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

function paySalary(designerSalaryId){

	com.cleanItems(designerSalaryCalculation.designerSalaryCalculationItems);
	designerSalaryCalculation.editFlg = false;
	designerSalaryCalculation.designerSalaryCalculationItems.designerSalaryId.val(designerSalaryId);
	
	designerSalaryCalculation.modal.modal("show");
}


