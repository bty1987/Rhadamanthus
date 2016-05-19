var designReport = {
	listgrid: null,
	chart: null,
	swith: null,
};

var reportTypeData = [{"id":"1", "name":"主材"}, {"id":"2", "name":"正林"}];

$(function() {
	
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	$("#dateRangeSearch").attr("readonly", "readonly");
	
	$("#reportType").bindData(reportTypeData, "id", "name", false);
	
	$("#fl_btn_searchDiv").on("click", function(){
		var dateRange = $("#dateRangeSearch").val();
		var reportType = $("#reportType").val();
		
		if(dateRange == ""){
			com.showAlert(com.error, "请输入需要查询的时期范围");
			return false;
		}
		
		if(!reportType || reportType == 0){
			com.showAlert(com.error, "请选择查询类型");
			return false;
		}
		
		var startTime = dateRange.split("-")[0].replace(/\//g, "-");
		var endTime = dateRange.split("-")[1].replace(/\//g, "-");
		
		var options = {};
		options["filters[0].field"] = "startTime";
		options["filters[0].data"] = startTime;
		options["filters[0].op"] = "eq";
		options["filters[1].field"] = "endTime";
		options["filters[1].data"] = endTime;
		options["filters[1].op"] = "eq";
		options["reportType"] = reportType;
		
		designReport.options = options;
		
		$("#designerRegionReport").html("");
		$("#designerDepartmentReport").html("");
		$("#designerReport").html("");
		
		$("#designerRegionTable").html("");
		$("#designerDepartmentTable").html("");
		$("#designerTable").html("");
		
		initRegionReport();
	});
});

function initRegionReport(){
	
	var options = designReport.options;
	
	com.post(api.report.countDesignerRegion, options, function(res){
		
		var thead = $("<thead></thead>");
		var tbody = $("<tbody></tbody>");
		var theadTr = $("<tr></tr>").appendTo(thead);
		var theadThO = $("<th></th>").text("分区").appendTo(theadTr);
		var theadThT = $("<th></th>").text("业绩").appendTo(theadTr);
		
		var regionReports = res.designerRegions;
		var series = [];
		
		for(var i=0;i<regionReports.length;i++){
				
			var designRegion = regionReports[i];
			
			series[i] = {
				name: designRegion.designerRegionName,
				data: [{
					id: designRegion.designerRegionId,
					y: designRegion.total,
				}],
			}
			
			var _tr = $("<tr></tr>").appendTo(tbody);
			var _tdO = $("<td></td>").text(designRegion.designerRegionName).appendTo(_tr);
			var _tdT = $("<td></td>").text(designRegion.total).appendTo(_tr);
		}
		
		if(series.length == 0){
			com.showAlert(com.warning, "当前查询数据为空!");
			return;
		}
		
		$('#designerRegionReport').highcharts({
			chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['分区业绩']
	        },
	        credits: {
	            enabled: false
	        },
	        plotOptions: {
	        	column: {
	                cursor: 'pointer',
	                events:{
	                    click: function(e) {
	                    	$("#designerReport").html("");
	                    	$("#designerTable").html("");
	                    	
	                    	initDepartmentReport(e.point.id);
	                    }
	                }
	            }
	        },
	        series:series,
	    });
		
		var designerRegionTable = $("#designerRegionTable").html("");
		tbody.appendTo(designerRegionTable);
		thead.appendTo(designerRegionTable);
		
	}, function(res){
		com.showAlert(com.error, res);
	}, false);
}

function initDepartmentReport(regionId){
	
	var options = designReport.options;
	
	options["filters[2].field"] = "designerRegionId";
	options["filters[2].data"] = regionId;
	options["filters[2].op"] = "eq";
	
	com.post(api.report.countDesignerDepartment, options, function(res){
		
		var thead = $("<thead></thead>");
		var tbody = $("<tbody></tbody>");
		var theadTr = $("<tr></tr>").appendTo(thead);
		var theadThO = $("<th></th>").text("部门").appendTo(theadTr);
		var theadThT = $("<th></th>").text("业绩").appendTo(theadTr);
		
		var designerDepartments = res.designerDepartments;
		var series = [{type: "pie", name: "", data: []}];
		
		for(var i=0;i<designerDepartments.length;i++){
				
			var designerDepartment = designerDepartments[i];
			
			series[i] = {
				name: designerDepartment.designerDeptName,
				data: [{
					id: designerDepartment.designerDeptId,
					y: designerDepartment.total,
				}],
			}
			
			var _tr = $("<tr></tr>").appendTo(tbody);
			var _tdO = $("<td></td>").text(designerDepartment.designerDeptName).appendTo(_tr);
			var _tdT = $("<td></td>").text(designerDepartment.total).appendTo(_tr);
		}
		
		$('#designerDepartmentReport').highcharts({
			chart: {
	            type: 'column'
	        }, title: {
	            text: ''
	        }, xAxis: {
	            categories: ['部门业绩']
	        }, credits: {
	            enabled: false
	        }, plotOptions: {
	        	column: {
	                cursor: 'pointer',
	                events:{
	                    click: function(e) {
	                    	initDesignerReport(e.point.id);
	                    }
	                }
	            }
	        },
	        series:series,
	    });
		
		var designerDepartmentTable = $("#designerDepartmentTable").html("");
		tbody.appendTo(designerDepartmentTable);
		thead.appendTo(designerDepartmentTable);
		
	}, function(res){
		com.showAlert(com.error, res);
	}, false);
}

function initDesignerReport(departmentId){
	
	var options = designReport.options;
	
	options["filters[2].field"] = "designerDepartmentId";
	options["filters[2].data"] = departmentId;
	options["filters[2].op"] = "eq";
	
	com.post(api.report.countDesigner, options, function(res){
		
		var thead = $("<thead></thead>");
		var tbody = $("<tbody></tbody>");
		var theadTr = $("<tr></tr>").appendTo(thead);
		var theadThO = $("<th></th>").text("部门").appendTo(theadTr);
		var theadThT = $("<th></th>").text("业绩").appendTo(theadTr);
		
		var designers = res.designers;
		var series = [{type: "pie", name: "", data: []}];
		
		for(var i=0;i<designers.length;i++){
				
			var designer = designers[i];
			
			series[i] = {
				name: designer.designerName,
				data: [{
					id: designer.designerId,
					y: designer.total,
				}],
			}
			
			var _tr = $("<tr></tr>").appendTo(tbody);
			var _tdO = $("<td></td>").text(designer.designerName).appendTo(_tr);
			var _tdT = $("<td></td>").text(designer.total).appendTo(_tr);
		}
		
		$('#designerReport').highcharts({
			chart: {
	            type: 'column'
	        }, title: {
	            text: ''
	        }, xAxis: {
	            categories: ['设计师业绩']
	        }, credits: {
	            enabled: false
	        },
	        series:series,
	    });
		
		var designerTable = $("#designerTable").html("");
		tbody.appendTo(designerTable);
		thead.appendTo(designerTable);
		
	}, function(res){
		com.showAlert(com.error, res);
	}, false);
}
