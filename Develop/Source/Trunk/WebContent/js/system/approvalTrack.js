var track = {
	listgrid: null,
	gridPager: null,
	
	postParam: {},
	type: ["审批消息", "楼号审批反馈消息",  "客户信息审批反馈消息", '折扣审批反馈消息', '退款审批反馈消息']
};

jQuery(function($) {
	track.listgrid = $("#listgrid");
	track.gridPager = "#gridPager";
	
	var searchOpts = {
		url: api.information.pageApprovalTrack,
		listgrid: track.listgrid,
		items: [{label:"审批类型", id:"typeSearch", name:"type", type:"select"},
	        {label:"申请人", id:"userNameSearch", name:"senderName",type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	        {label:"审批人", id:"userNameSearch", name:"receiverName",type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	    ]
	};
	
	$("#searchDiv").flSearch(searchOpts);
	$("#typeSearch").bindData(track.type, "", "", true);
	
	track.listgrid.jqGrid({		
		url: api.information.pageApprovalTrack.url,
		postData: track.postParam,
		colNames:['审批编号', '审批类型', '申请人', '审批人', '审批内容', '审批时间'],
		colModel:[
		    {name:'approvalTrackId'},
			{name:'type'},
			{name:'sender', jsonmap: "sender.userName"},
			{name:'receiver', jsonmap: "receiver.userName"},
			{name:'contents'},
			{name:'createTime'}
		], 
		pager : track.gridPager,
		caption: "审批消息列表"
	});

});
