var loginLog = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	loginLogItems:{},
	
	postParam: {},
	
	regionList: [],
	regionKey: "regionId",
	regionValue: "regionName"
};

jQuery(function($) {
	loginLog.listgrid = $("#listgrid");
	loginLog.gridPager = "#gridPager";
	
	var searchOpts = {
		url: api.log.pageLoginLog,
		postParmas: {"paging.rows":30, "paging.page":1},
		listgrid: loginLog.listgrid,
		items: [
	        {label:"登陆账号",id:"loginIdSearch",name:"loginId", type:'text'}, 
	        {label:"登陆IP", id:"sourceIpSearch", name:"sourceIp", type:"text"},
	        {label:"登陆时间", id:"loginTimeSearch", name:"loginTime",type:"dateRangePicker",op:"between"},
	        {label:"登陆结果", id:"successFlagSearch", name:"successFlag",type:"select",op:"eq"}
		]
	};
	
	$("#searchDiv").flSearch(searchOpts);
	$("#successFlagSearch").bindData([{"key":1,"value":"成功"},{"key":0,"value":"失败"}], "key", "value", true);
	
	initializeListgrid();
});

function initializeListgrid(){
	loginLog.listgrid.jqGrid({		
		url: api.log.pageLoginLog.url,
		postData: loginLog.postParam,
		colNames:['编号', '登陆账号', '登陆IP','登陆时间',"登陆结果"],
		colModel:[
			{name:'id', hidden: true},
			{name:'loginId'},
			{name:'sourceIp'},
			{name:'loginTime'},
			{name:'successFlag',formatter:successFlagFormat},
		], 
		pager : loginLog.gridPager,
		caption: "登陆日志列表"
	});

	loginLog.listgrid.navGrid(loginLog.gridPager, {edit:false,add:false,del:false,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {}, {}, {});
}

function successFlagFormat( cellvalue, options, rowObject ){  
	if(cellvalue==1){
		return '成功<input type="text" value="1" class="hidden" />  ';
	}
	
    return '失败<input type="text" value="0" class="hidden" />';  
}  
