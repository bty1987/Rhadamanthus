var actionLog = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	actionLogItems:{},
	
	postParam: {},
	
	regionList: [],
	regionKey: "regionId",
	regionValue: "regionName"
};

jQuery(function($) {
	
	actionLog.listgrid = $("#listgrid");
	actionLog.gridPager = "#gridPager";
	
	var searchOpts = {
		url: api.log.pageActionLog,
		postParmas: {"paging.rows":100, "paging.page":1},
		listgrid: actionLog.listgrid,
		items: [
	        {label:"操作人",id:"createUserSearch",name:"createUser",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":""}}, 
	        {label:"操作名称", id:"actionNameSearch", name:"actionName",type:"text",op:"cn"},
//		    {label:"操作时间", id:"createTimeSearch", name:"createTime",type:"dateRangePicker",op:"between"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
});

function initializeListgrid(){
	actionLog.listgrid.jqGrid({		
		url: api.log.pageActionLog.url,
		postData: actionLog.postParam,
		colNames:['编号', '操作人编号', '操作人', '操作名称', '创建时间', '运行时间'],
		colModel:[
			{name:'uuid', hidden: true},
			{name:'createUserId', hidden: true},
			{name:'createUserName'},
			{name:'actionName'},
			{name:'createTime'},
			{name:'runTime'},
		], 
		rowList:[50,100,200,300],
		rowNum:100,
		pager : actionLog.gridPager,
		caption: "日志列表"
	});

	actionLog.listgrid.navGrid(actionLog.gridPager, {edit:false,add:false,del:false,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {}, {}, {});
}
