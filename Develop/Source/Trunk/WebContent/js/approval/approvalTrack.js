var track = {
	listgrid: null,
	gridPager: null,
	
	postParam: {},
	type: ["审批消息", "楼号审批反馈消息",  "客户信息审批反馈消息", '折扣审批反馈消息', '退款审批反馈消息']
};

jQuery(function($) {
	track.listgrid = $("#listgrid");
	track.gridPager = "#gridPager";
	
	com.post(api.ds.approvalType, {"timestamp": new Date().getTime()}, function(res){
		track.approvalType = res.approvalType;
		
		track.approvalTypeData = {};
		
		for(var i=0;i<track.approvalType.length;i++){
			var _ = track.approvalType[i];
			track.approvalTypeData[_["key"]] = _["value"];
		}
	}, null, false);
	
	var searchOpts = {
		url: api.information.pageApprovalByReceiveId,
		listgrid: track.listgrid,
		items: [
		    {label:"审批类型", id:"typeSearch", name:"type", type:"select", op:"eq"},
	        {label:"申请人", id:"userNameSearch", name:"sender", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	    ]
	};
	
	$("#searchDiv").flSearch(searchOpts);
	$("#typeSearch").bindData(track.approvalType, "key", "value", true);
	
	track.listgrid.jqGrid({
		url: api.approval.pageApprovalByReceiveId.url,
		postData: track.postParam,
		colNames:['审批编号', '审批类型', '申请人', '提交时间', '审批时间', '审批内容', '状态', '操作'],
		colModel:[
		    {name:'aid', hidden:true},
			{name:'type', formatter: approvalTypeInit},
			{name:'senderName'},
			{name:'createTime'},
			{name:'approvalTime'},
			{name:'contents'},
			{name:'status', width: 80, formatter: statusInit},
			{name:'action', width: 80, formatter: actionInit}
		], 
		pager : track.gridPager,
		caption: "审批消息列表"
	});

});

function approvalTypeInit(cellvalue, options, rowdata){
	return track.approvalTypeData[cellvalue];
}

function statusInit(cellvalue, options, rowdata){
	
	var label = "";
	var str = "";
	
	if(cellvalue == '0'){
		label = "label-warning";
		str = "等待";
	}else if(cellvalue == '1'){
		label = "label-success";
		str = "通过";
	}else if(cellvalue == '2'){
		label = "label-danger";
		str = "拒绝";
	}
	
	return '<span class="label ' + label + '">' + str + "</span>";
}

function actionInit(cellvalue, options, rowdata){
	
	var result = "";
	
	if(rowdata.status == '0'){
		result += '<div class="ui-pg-div btn-group">';
		result += '<button class="btn btn-minier btn-success" onclick="approveApproval(' + options.rowId + ', ' + rowdata.aid + ');">通过</button>';
		result += '<button class="btn btn-minier btn-danger" onclick="refuseApproval(' + options.rowId + ', ' + rowdata.aid + ');">拒绝</button>';
		result += '</div>';
	}
	
	return result;
}

function approveApproval(rowId, aId){
	
	var options = {
		"approval.aid": aId,
	}
	
	com.post(api.approval.approveApproval, options, function(res){
		com.showAlert(com.info, "操作成功");
		
		track.listgrid.setCell(rowId, "status", 1);
		track.listgrid.setCell(rowId, "action", 1);
	});
}

function refuseApproval(rowId, aId){
	
	var options = {
		"approval.aid": aId,
	}
	
	com.post(api.approval.refuseApproval, options, function(res){
		com.showAlert(com.info, "操作成功");
		
		track.listgrid.setCell(rowId, "status", 2);
		track.listgrid.setCell(rowId, "action", 1);
	});
}