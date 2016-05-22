var materialDepartmentReport = {
	listgrid: null,
	chart: null,
	swith: null,
	
	materialDepartmentIds: [],
	materialDepartmentInfos: {},
	materialDepartmentSeries: [],
};

$(function() {
	
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	$("#dateRangeSearch").attr("readonly", "readonly");
	
	com.post(api.department.queryDepartment, {"dept.type": "主材部"}, function(res){
		var deptList = res.deptList;
		
		for(var i=0;i<deptList.length;i++){
			
			var dept = deptList[i];
			
			materialDepartmentReport.materialDepartmentIds[i] = dept.deptName;
			materialDepartmentReport.materialDepartmentInfos[dept.deptId] = [dept.deptId, dept.deptName];
			materialDepartmentReport.materialDepartmentSeries[i] = {
	            type: 'line',
	            name: dept.deptName,
	            pointInterval: 24 * 3600 * 1000,
	            pointStart: null,
	            data: []
	        };
		}
	}, null, false);
	
	$("#fl_btn_searchDiv").on("click", function(){
		var dateRange = $("#dateRangeSearch").val();
		
		if(dateRange == ""){
			com.showAlert(com.warning, "请输入需要查询的时期范围");
			return false;
		}
		
		var startTime = dateRange.split("-")[0].replace(/\//g, "-");
		var endTime = dateRange.split("-")[1].replace(/\//g, "-");
		var _arrayLength = dateDiff('D', startTime, endTime) + 1;
		var _array = fillArray(_arrayLength, 0);
		
		var startTimeArgs = startTime.split("-");
		
		for(var index in materialDepartmentReport.materialDepartmentSeries){
			materialDepartmentReport.materialDepartmentSeries[index]["data"] = [].concat(_array);
			materialDepartmentReport.materialDepartmentSeries[index]["pointStart"] = Date.UTC(startTimeArgs[0], startTimeArgs[1], startTimeArgs[2]);
		}
		
		var options = {};
		options["filters[0].field"] = "startTime";
		options["filters[0].data"] = startTime;
		options["filters[0].op"] = "eq";
		options["filters[1].field"] = "endTime";
		options["filters[1].data"] = endTime;
		options["filters[1].op"] = "eq";
		
		com.post(api.report.materialDepartmentReport, options, function(res){
			materialReportInfos = res.materialDepartmentCounts;
			
			for(var i=0;i<materialReportInfos.length;i++){
				var createTime = materialReportInfos[i]["createTime"];
				var materialDeptId = materialReportInfos[i]["materialDeptId"];
				var total = materialReportInfos[i]["total"];
				
				var index = materialDepartmentReport.materialDepartmentIds.indexOf(materialDeptId);
				if(index == -1){
					continue;
				}else{
					var jndex = dateDiff('D', startTime, createTime);
					materialDepartmentReport.materialDepartmentSeries[index]["data"][jndex] = total;
				}
			}
		}, null, false);
		
		highcharts(materialDepartmentReport.materialDepartmentSeries);
		
	});
	
	highcharts(materialDepartmentReport.materialDepartmentSeries);
});

function highcharts(series){
	$('#materialDepartmentReport').highcharts({
        chart: {
            zoomType: 'x',
            spacingRight: 20
        },
        title: {
            text: '主材部门业绩统计图标'
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 14 * 24 * 3600000, // fourteen days
            title: {
                text: null,
            }
        },
        yAxis: {
            title: {
                text: '业绩信息'
            }
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions: {},
        series: series,
    });
	
//	$('text[text-anchor=end]').css("display", "none");
}

function fillArray(length, defValue){
	var _array = [];
	
	if(defValue == undefined || defValue == null){
		defValue = 0;
	}
	
	for(var i=0;i<length;i++){
		_array[i] = defValue;
	}
	
	return _array;
}

function dateDiff(interval, date1, date2){
    var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
    interval = interval.toUpperCase();
    var dt1 = Date.parse(date1.replace(/-/g, '/'));
    var dt2 = Date.parse(date2.replace(/-/g, '/'));
    try{
        return Math.round((dt2 - dt1) / objInterval[interval]);
    }catch (e){
        return e.message;
    }
}