var activity = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {},
	
	statusType: [{"key": "0", "value":"有效"}, {"key": "1", "value":"无效"}],
};

var activityPostData = {};

jQuery(function($) {
	
	activity.listgrid = $("#listgrid");
	activity.gridPager = "#gridPager";
	activity.saveBtn = $("#saveBtn").on("click", saveData);
	activity.cancelBtn = $("#cancelBtn");
	$.extend(com.validator, activity.validator);
	
	activity.items.activityName = $("#activityName");
	activity.items.startTime = $("#startTime");
	activity.items.endTime = $("#endTime");
	activity.modal = $("#activityModal");
	activity.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	var searchOpts = {
		url: api.information.pageActivity.url,
		listgrid: activity.listgrid,
		items: [
	        {label: "名称", id: "activityNameSearch", name: "activityName", type: 'text'},
	        {label: "状态", id: "statusSearch", name: "status", type: "select", op:"eq"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#statusSearch").bindData(activity.statusType, "key", "value", true);
	
	$('.date-picker').datepicker({autoclose:true}).on("show",function(){
		setTimeout(function(){
            $('.dropdown-menu').css('z-index', 1060);
        }, 0);
	}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	initializeListgrid();
});

function initializeListgrid(){
	activity.listgrid.jqGrid({		
		url: api.information.pageActivity.url,
		postData: activity.postParam,
		colNames:["活动ID", '活动名', '创建人', '开始时间', '结束时间', '状态', '操作'],
		colModel:[
            {name:'aid', hidden: true},
            {name:'activityName'},
            {name:'createUserName'},
			{name:'startTime'},
			{name:'endTime'},
			{name:'status', formatter: statusInit},
			{name:'action', formatter: actionInit}
		], 
		pager : activity.gridPager,
		caption: "活动列表"
	});

	activity.listgrid.navGrid(activity.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(activity.gridPager, { //edit
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			
			var row = $.jgrid.getRowData.call(activity.listgrid, "aid");
			
			if(row == undefined){
				return;
			}
			
			activity.items.aid = row.aid;
			activity.items.status = row.status;
			activity.items.activityName.val(row.activityName).attr("disabled", "disabled");
			activity.items.startTime.val(row.startTime).attr("disabled", "disabled");
			activity.items.endTime.val(row.endTime);
			activity.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(activity.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			
			com.cleanItems(activity.items);
			
			activity.items.activityName.removeAttr("disabled", "disabled");
			activity.items.startTime.removeAttr("disabled", "disabled");
			
			activity.modal.modal("show");   
		},
		position: 'first'
	});
}

function statusInit(cellvalue, options, rowdata){
	
	var status = "";
	var labelInfo = "";
	
	if(cellvalue == 0){
		status = "有效";
		labelInfo = "label-success";
	}else if(cellvalue == 1){
		status = "无效";
		labelInfo = "label-danger";
	}
	
	return '<span class="label ' + labelInfo + '">' + status + "</span>";
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	var rowId = options.rowId;
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-success" onclick="viewActivityItemIndex(\'' + rowId + '\', \'' + rowdata.activityName + '\');">活动物品</button>';
	result += '</div>';
	
	return result;
}

function viewActivityItemIndex(rowId, activityName){
	
	var rowInfo = activity.listgrid.jqGrid('getRowData', rowId);
	
	activityPostData.aid = rowInfo.aid;
	activityPostData.activityName = rowInfo.activityName;
	
	$("#activityPageContent").load(api.index.activityItemIndex.url);
}

function saveData(){
	if(com.validate() || activity.repeatFlg){
		return;
	}
	
	var startTime = activity.items.startTime.val();
	var end = activity.items.endTime.val();
	
	if(startTime > end){
		com.showAlert(com.warning, "开始时间不能大于结束时间");
		return;
	}
	
	var url;
	var options = {
		'activity.activityName': activity.items.activityName.val(),
		'activity.startTime': activity.items.startTime.val() + " 00:00:00",
		'activity.endTime': activity.items.endTime.val() + " 23:59:59",
		'activity.content': "",
	};
	
	if(editFlg){
		url = api.information.updateActivity;
		options['activity.aid'] = activity.items.aid;
	}else{
		url = api.information.addActivity;
	}
	
	com.post(url, options, successCallback);
	
	activity.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(activity.listgrid, activity.postParam);
}
