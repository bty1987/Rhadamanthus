(function($){

	$.extend({
		Exporter: function(options) {
			var defaults = {};

			var conf = $.extend(defaults, options);

			var columnLabels = [], columnNames = [];
			$.each(conf.column, function (i, v) {
				columnLabels[i] = v[0];
				columnNames[i] = v[1];
			});

			var list = conf.list;

			var excel="<table>";

			// Header
			excel += "<tr>";
			$.each(columnLabels, function(i, v){
				excel += "<td>" + v + "</td>";
			});
			excel += '</tr>';

			// Row Vs Column
			$.each(list, function(i, v){
				excel += "<tr>";
				$.each(columnNames, function(index, val){
					if(typeof val != 'string'){
						var tempstr = '';
						$.each (val, function(si, sv){
							tempstr += eval('v.'+sv) ? eval('v.'+sv) : "xxx";
						});
						excel += "<td>" + tempstr + "</td>";
					}else{
						excel += "<td>" + (eval('v.'+val) ? eval('v.'+val) : "xxx")   + "</td>";
					}
				});
				excel += '</tr>';
			});

			excel += "</table>";

			$('body').append(excel);

			var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
			excelFile += "<head>";
			excelFile += "<!--[if gte mso 9]>";
			excelFile += "<xml>";
			excelFile += "<x:ExcelWorkbook>";
			excelFile += "<x:ExcelWorksheets>";
			excelFile += "<x:ExcelWorksheet>";
			excelFile += "<x:Name>";
			excelFile += "Sheet1";
			excelFile += "</x:Name>";
			excelFile += "<x:WorksheetOptions>";
			excelFile += "<x:DisplayGridlines/>";
			excelFile += "</x:WorksheetOptions>";
			excelFile += "</x:ExcelWorksheet>";
			excelFile += "</x:ExcelWorksheets>";
			excelFile += "</x:ExcelWorkbook>";
			excelFile += "</xml>";
			excelFile += "<![endif]-->";
			excelFile += "</head>";
			excelFile += "<body>";
			excelFile += excel;
			excelFile += "</body>";
			excelFile += "</html>";
			var base64data = "base64," + Base64.encode(excelFile);
			window.open('data:application/vnd.ms-excel;filename=exportData.doc;' + base64data);
		}
	});

	/*$('#export').click(function(){
		$.Exporter({
			column : [
				["订单编号","orderId"],
				['楼盘地址',['village.villageName','houseNumber']],
				['客户名','customer.customerName'],
				['设计部','designDepartment'],
				['设计师', 'designer'],
				['监理','supervisor'],
				['业务员', 'salesman'],
				['面积', 'houseArea'],
			],
			list : list,
		});

	});*/

})(jQuery);
        