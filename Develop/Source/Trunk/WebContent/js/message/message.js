var message={
		
	listgrid: null,
	gridPager: null,
	
	postParam: {},
	messageItems:{},
	
	delUrl:null,
	queryUrl:null,
	
	currentRow:{}
};

var gridData = [];

jQuery(function($){
	message.listgrid = $("#listgrid");
	message.gridPager = "#gridPager";
	
	$("#gobackMessageList").on("click", gobackMessageList);
	
	initializeListgrid();
	
});

function initializeListgrid(){
	message.listgrid.jqGrid({	
		data: gridData,
		datatype: "local",
		postData: {},
		colNames:[ '类别', '内容', '发送人', '时间', '已读', '照片', '编号'],
		colModel:[
			{name:'messageType', width:30,formatter:messageTypeFormat, sortable:false},
			{name:'content', formatter:contentFormat, sortable:false}, 
			{name:'fromUser', width:20, formatter:contentFormat, sortable:false},
			{name:'createTime', width:30, formatter:contentFormat, sortable:false},
			{name:'flag', width:0, hidden:true, sortable:false},
			{name:'userPicture', width:0, hidden:true, sortable:false},
			{name:'id', width:0, hidden:true, sortable:false}
		], 
		autowidth: true,
		pager : message.gridPager
	});

	message.listgrid.navGrid(message.gridPager, {edit:false, add:false, del:true, search:false, searchicon: 'icon-search orange', refresh:false, view:false}, {}, {}, $.jgrid.deleteFunc(removeRow), null)
	.navButtonAdd(message.gridPager, {
		caption:"",
		buttonicon: 'icon-eye-open blue',
		onClickButton: function(){    
			message.editFlg = true;
			var num = message.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(message.listgrid.attr("id"));
				return;
			}
			var row = message.listgrid.jqGrid("getRowData", num);
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){

	var nums = rowNums.split(",");
	var options = {};
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["messageIds["+i+"]"] = row.roleId;
	}
	com.post(message.delUrl, options, successCallback);
	$("#eData").trigger("click");
}

function messageTypeFormat( cellvalue, options, rowObject ){  

	var con = "";
	if(rowObject.flag == 1){
		con = "<b>" + cellvalue + "</b>";
	}else{
		con = cellvalue;
	}
	
	message.currentRow = rowObject;
	return '<a href="javascript:gotoMessageInfo();">' + con + '</a>';
} 

function contentFormat( cellvalue, options, rowObject ){
	var con = "";
	if(rowObject.flag == 1){
		con = "<b>" + cellvalue + "</b>";
	}else{
		con = "" + cellvalue;
	}
	
	return con;
}

function gotoMessageInfo(){
	$("#listMessage").addClass("hide");
	$("#id-message-content").removeClass("hide");
}

function gobackMessageList(){
	$("#listMessage").removeClass("hide");
	$("#id-message-content").addClass("hide");
	$.jgrid.refreshGrid(message.listgrid, message.postParam);
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(message.listgrid, message.postParam);
}
