var notice = {
	listgrid: null,
	gridPager: null,
	postParam: {}
};

jQuery(function($) {
	
	notice.listgrid = $("#listgrid");
	notice.gridPager = "#gridPager";
	
	notice.postParam["notice.type"] = params["notice.type"];
	
	var searchOpts = {
		url: api.information.pageNoticeForDeptAValid,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: notice.listgrid,
		items: [
	        {label:"主题",id:"theme",name:"theme", type:'text'},
	        {label: "时间", id: "dateRangeSearch", name:"dateRange", type: "dateRangePicker"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
});

function initializeListgrid(){
	
	console.log("initializeListgrid");
	
	notice.listgrid.jqGrid({		
		url: api.information.pageNoticeForDeptAValid.url,
		postData: notice.postParam,
		colNames:['ID', '主题', '类型', '优先级', '发布部门', '发布人', '开始时间', '结束时间', '公开', '内容', '附件'],
		colModel:[
		    {name:'noticeId', hidden: true},
			{name:'theme', width:40},
			{name:'type', width:10},
			{name:'priority', width:15},
			{name:'deptName', width:20, jsonmap:'dept.deptName'},
			{name:'userName', width:20, jsonmap:'user.userName'},
			{name:'startTime', width:25},
			{name:'endTime', width:25},
			{name:'isPublic', width:10},
			{name:'contentsText'},
			{name:'attachmemt', width:12, align:"center", formatter: attachmentIcon}
		], 
		pager : notice.gridPager,
		caption: "公告列表"
	});

	notice.listgrid.navGrid(notice.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false}, {}, {}
	).navButtonAdd(notice.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			isF5 = true;
			$(".tooltip").remove();
			window.location.reload();
		},
		position: "first"
	});
}

function attachmentIcon(cellvalue, options, row){
	var res = "";
	
	if(row.filePath!=undefined && row.filePath != null && row.filePath != ""){
		res = "<a href="+window.mediaServer+row.filePath+" onclick='window.open(this.href); return false;'><i id="+row.noticeId+" class='icon-download-alt bigger-110 blue'></i>";
	}
	
	return res;
}

