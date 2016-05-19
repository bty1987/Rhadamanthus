var drawLineApply = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	drawLineApplyItems: {},
	
	drawLineGroup:null,
	drawLineDateCount:null,
	
	editFlag: false
};
	
jQuery(function($) {
	drawLineApply.listGrid = $("#listGrid");
	drawLineApply.gridPager = "#gridPager";
	drawLineApply.saveBtn = $("#saveBtn").on("click", saveData);
	drawLineApply.cancelBtn = $("#cancelBtn");
	drawLineApply.drawLineApplyModal = $("#drawLineApplyModal");
	drawLineApply.drawLineModal = $("#drawLineModal");
	
	drawLineApply.drawLineApplyItems.autoId =  $("#autoId");
	drawLineApply.drawLineApplyItems.actualDate =  $("#actualDate");
	drawLineApply.drawLineApplyItems.startTime =  $("#startTime");
	drawLineApply.drawLineApplyItems.endTime =  $("#endTime");
	drawLineApply.drawLineApplyItems.drawLineGroup =  $("#drawLineGroup");
	
	var drawLineSearchOpts = {
		url: null,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: drawLineApply.listGrid,
		items: [
		    {label:"订单号",id:"searchOrderId",name:"orderId",type:"text"},
			{label:"楼盘",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"楼号",id:"searchHouseNum",name:"houseNumber",type:"text"},
			{label:"面积",id:"searchHouseArea",name:"houseArea",type:"text",op:"eq"},
			{label:"业务员",id:"searchSalesman",name:"salesman",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
			{label:"设计师",id:"searchDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}}
		]
	};
	$("#drawLineSearchDiv").flSearch(drawLineSearchOpts);
	
	$("#drawLineSearchDiv > .fl_search").append('<button id="showDrawLineApplyInfos" class="btn btn-sm no-border">放线申请信息</button>');
	
	com.post(api.ds.drawLineInfo, {}, function(res){
		drawLineApply.drawLineGroup = res.drawLineGroup;
		drawLineApply.drawLineApplyItems.drawLineGroup.bindData(drawLineApply.drawLineGroup, 'key', 'value');
	});
	
	drawLineApply.listGrid.jqGrid({	
		url: api.construction.pageDecorationOrderDrawLineForPlan.url,
		colNames:['autoId','订单编号', '楼盘名', '设计师', '申请人', '申请时间', '放线次数', '面积', '备注', '操作', 'houseNumber', 'cityP'],
		colModel:[
		    {name:"autoId", hidden:true},
		    {name:'orderId'},
			{name:'village', width:300, formatter: villageInit},
			{name:'designer'},
			{name:'applayUser'},
			{name:'applayTime'},
			{name:'applayCount'},
			{name:'houseArea'},
			{name:'applayDes', formatter: applayDesInit},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber", hidden:true},
			{name:"cityProper", hidden:true}
		], 
		pager : drawLineApply.gridPager,
		caption: "放线申请信息列表",
		gridComplete: function () {
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel="tooltip"]').tooltip({container:'#DrawLineApplyPageContent'});
        }
	});
	
	drawLineApply.listGrid.navGrid(drawLineApply.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
	
	$('#showDrawLineApplyInfos').click(function(){
		drawLineApply.drawLineApplyModal.modal("show");
	});
	
	$('.date-picker').datepicker().next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	$('#startTime').timepicker({
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});
	
	$('#endTime').timepicker({
		minuteStep: 1,
		showSeconds: false,
		showMeridian: false
	});
	
	drawLineApply.drawLineApplyModal.on('shown.bs.modal',function(e){
		initPlan();
	});
});

function initPlan(){
	
	$('#calendar').fullCalendar('destroy');
	$('#calendar').fullCalendar('today');
	
	$('#calendar').fullCalendar({
		buttonText: {    
            today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
		}, 
		dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],    
		monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], 
		eventLimit: true,
		events: function(start, end, callback){
			
			var startTime = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
			var endTime = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 23:59:59";
			
			var options = {
				"drawLine.startTime": startTime,
				"drawLine.endTime": endTime,
			}
			
			com.post(api.construction.queryDecorationOrderDrawLineForCountByDate, options, function(res){
				drawLineApply.drawLineDateCount = res.drawLineDateCount;
				
				var events = [];
				
				for(var i in drawLineApply.drawLineDateCount){
				 
					var s = i.split('-');
					var drawLineDateCount = drawLineApply.drawLineDateCount[i];
					
					for(var j in drawLineApply.drawLineDateCount[i]){
						
						var _ = drawLineDateCount[j];
						
						var event = {
							title: j + _ + "个",
							start: new Date(s[0], s[1]-1, s[2]),
							allDay: true
						}
						
						events.push(event);
					}
				}
				
				callback(events);
			});
		}
	})
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div">';
	result += '<button id="drawLine" class="btn btn-minier btn-yellow" onclick="drawLine('+rowdata.autoId+',\''+rowdata.applayTime+'\');">放线</button>';
	result += '</div>';
	
	return result;
}

function applayDesInit(cellvalue, options, rowdata){
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowdata.applayDes+'">说明</span>';
	html += "<input type='text' class='hide' value='"+rowdata.applayDes+"' />";
	return html;
}

function villageInit(cellvalue, options, rowdata){
	return rowdata.cityProper+rowdata.village + ' ' + rowdata.houseNumber;
}

function saveData(){
	bootbox.confirm("确认提交申请吗？",function(res){
		if(res){
			if(com.validate("drawLineModal")){
				return;
			}
			
			var start = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-","/") +" " +drawLineApply.drawLineApplyItems.startTime.val());
			var end = Date.parse(drawLineApply.drawLineApplyItems.actualDate.val().replace("-","/") +" " +drawLineApply.drawLineApplyItems.endTime.val());
			
			if(start == NaN || end == NaN || start >= end){
				bootbox.alert("起始时间和结束时间非法");
				return;
			}
			
			var options ={
				"drawLine.autoId":drawLineApply.drawLineApplyItems.autoId.val(),
				"drawLine.actualDate":drawLineApply.drawLineApplyItems.actualDate.val(),
				"drawLine.startTime":drawLineApply.drawLineApplyItems.startTime.val(),
				"drawLine.endTime":drawLineApply.drawLineApplyItems.endTime.val(),
				"drawLine.drawLineGroup":drawLineApply.drawLineApplyItems.drawLineGroup.val()
			};
			
			com.post(api.construction.saveDecorationOrderDrawLine, options, function(res){
				com.showAlert(com.info, "提交成功");
				$.jgrid.refreshGrid(drawLineApply.listGrid, {});
			});
		
			drawLineApply.drawLineModal.modal("hide");
		}else{
			return ;
		}
	});
}

function successCallback(){
	$.jgrid.refreshGrid(drawLineApply.listGrid, {});
}

function failCallback(){
	
}

function cleanItems(){
	
}

function drawLine(autoId, applayTime){
	com.clearValidator();
	com.cleanItems(drawLineApply.drawLineApplyItems);
	drawLineApply.drawLineApplyItems.autoId.val(autoId);
	drawLineApply.drawLineApplyItems.actualDate.datepicker('update', applayTime);
	
	drawLineApply.drawLineApplyItems.drawLineGroup.get(0).selectedIndex = 0;
	drawLineApply.drawLineModal.modal("show");
}
