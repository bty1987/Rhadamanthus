var workerDeductSalaryDetail = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerDeductSalaryDetailItems: {},
	
	statusTypeData: {"0":"初始", "1":"通过", "2":"确认", "3":"已发", "4":"撤销"},
	
	editFlag: false,
	commitFlag: false,
};

var workerDeductSalaryDetailPostData = {};

var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("工人工资", "订单工人扣款列表");
	
	workerDeductSalaryDetail.listGrid = $("#listGrid");
	workerDeductSalaryDetail.gridPager = "#gridPager";
	
	workerDeductSalaryDetailPostData["workerDeductSalary.orderId"] = workerSalaryPostData["workerSalary.orderId"];
	
	var workerDeductSalaryDetailSearchOpts = {
		url: api.salary.pageWorkerDeductSalaryByOrderIdAUserId,
		listgrid: workerDeductSalaryDetail.listGrid,
		postParmas: {"paging.rows":10, "paging.page":1, "workerDeductSalary.orderId":workerDeductSalaryDetailPostData["workerDeductSalary.orderId"]},
		items: [
	        {label:"工人姓名",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"工种",id:"workeTypeSearch",name:"workType",type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(workerDeductSalaryDetailSearchOpts);
	
	com.post(api.ds.workType, {}, function(res){
		$("#workeTypeSearch").bindData(res.workType, "key", "value", true);
		$("#workType").bindData(res.workType, "key", "value", false);
		
		workerSalaryDetail.workerDuty = $("#workType").val();
	});
	
	workerDeductSalaryDetail.listGrid.jqGrid({		
		url: api.salary.pageWorkerDeductSalaryByOrderIdAUserId.url,
		postData: workerDeductSalaryDetailPostData,
		colNames:['wbsId', 'wsId', 'userId', '姓名', '工种', '时间', '基本工资', '状态', '状态'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'wbsId', hidden:true},
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workType'},
			{name:'createTime'},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
		], 
		pager: workerDeductSalaryDetail.gridPager,
		caption: "订单工人扣款列表"
	});
	
	workerDeductSalaryDetail.listGrid.navGrid(workerDeductSalaryDetail.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(workerDeductSalaryDetail.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.workerBaseSalaryScheduleIndex.url);
		},
		position: "first",
	});
});

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = workerDeductSalaryDetail.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalaryDetail.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerDeductSalaryDetail.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}
