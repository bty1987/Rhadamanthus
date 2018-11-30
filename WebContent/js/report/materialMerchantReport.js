var merchantReport = {
	listgrid: null,
	chart: null,
	swith: null,
};

var reportTypeData = [{"id":"1", "name":"主材"}];

$(function() {
	
	$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
	com.focusPage("#dateRangeSearch").attr("readonly", "readonly");
	
	com.focusPage("#reportType").bindData(reportTypeData, "id", "name", false);
	
	com.focusPage("#fl_btn_searchDiv").on("click", function(){
		var dateRange = com.focusPage("#dateRangeSearch").val();
		var reportType = com.focusPage("#reportType").val();
		
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
		
		merchantReport.options = options;
		
		com.focusPage("#materialTypeReport").html("");
		com.focusPage("#materialBrandReport").html("");
		
		com.focusPage("#materialTypeTable").html("");
		com.focusPage("#materialBrandTable").html("");
		
		initTypeReport();
		initBrandReport();
	});
});

function initTypeReport(){
	
	var options = merchantReport.options;
	
	com.post(api.report.countMaterialType, options, function(res){
		
		var thead = $("<thead></thead>");
		var tbody = $("<tbody></tbody>");
		var theadTr = $("<tr></tr>").appendTo(thead);
		var theadThO = $("<th></th>").text("品类").appendTo(theadTr);
		var theadThT = $("<th></th>").text("业绩").appendTo(theadTr);
		
		var materialTypeCounts = res.materialTypeCounts;
		var series = [];
		
		for(var i=0;i<materialTypeCounts.length;i++){
				
			var materialTypeCount = materialTypeCounts[i];
			
			series[i] = {
				name: materialTypeCount.materialType,
				data: [{
					id: materialTypeCount.materialType,
					y: materialTypeCount.total,
				}],
			}
			
			var _tr = $("<tr></tr>").appendTo(tbody);
			var _tdO = $("<td></td>").text(materialTypeCount.materialType).appendTo(_tr);
			var _tdT = $("<td></td>").text(materialTypeCount.total).appendTo(_tr);
		}
		
		if(series.length == 0){
			com.showAlert(com.warning, "当前查询数据为空!");
			return;
		}
		
		com.focusPage('#materialTypeReport').highcharts({
			chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['品类业绩']
	        },
	        credits: {
	            enabled: false
	        },
	        series:series,
	    });
		
		var materialTypeTable = com.focusPage("#materialTypeTable").html("");
		tbody.appendTo(materialTypeTable);
		thead.appendTo(materialTypeTable);
		
	}, function(res){
		com.showAlert(com.error, res);
	}, false);
}

function initBrandReport(){
	
	var options = merchantReport.options;
	
	com.post(api.report.countMaterialBrand, options, function(res){
		
		var thead = $("<thead></thead>");
		var tbody = $("<tbody></tbody>");
		var theadTr = $("<tr></tr>").appendTo(thead);
		var theadThO = $("<th></th>").text("品牌").appendTo(theadTr);
		var theadThT = $("<th></th>").text("业绩").appendTo(theadTr);
		
		var materialBrandCounts = res.materialBrandCounts;
		var series = [];
		
		for(var i=0;i<materialBrandCounts.length;i++){
				
			var materialBrandCount = materialBrandCounts[i];
			
			series[i] = {
				name: materialBrandCount.materialBrand,
				data: [{
					id: materialBrandCount.materialBrand,
					y: materialBrandCount.total,
				}],
			}
			
			var _tr = $("<tr></tr>").appendTo(tbody);
			var _tdO = $("<td></td>").text(materialBrandCount.materialBrand).appendTo(_tr);
			var _tdT = $("<td></td>").text(materialBrandCount.total).appendTo(_tr);
		}
		
		if(series.length == 0){
			com.showAlert(com.warning, "当前查询数据为空!");
			return;
		}
		
		com.focusPage('#materialBrandReport').highcharts({
			chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['品牌业绩'],
	        	type: 'category',
	            labels: {
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif'
	                }
	            }
	        },
	        yAxis: {
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        credits: {
	            enabled: false
	        },
	        series:series,
	    });
		
		var materialBrandTable = com.focusPage("#materialBrandTable").html("");
		tbody.appendTo(materialBrandTable);
		thead.appendTo(materialBrandTable);
		
	}, function(res){
		com.showAlert(com.error, res);
	}, false);
}
