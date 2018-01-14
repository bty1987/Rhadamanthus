
jQuery(function($) {
	
	var cityName = "沈阳";
	var status = {"amount": "量尺", "consult": "咨询", "quotation": "报价", "deposit": "定金", "signed": "签约", "resigned": "重签", "waste": "废单", "completed": "完工", "termination": "终止"};
	
	var dates = []; // 横坐标日期数据
	var totalPies = []; // 饼状图数据
	var lines = {};
	var contractPrice = 0;
	var orderTotal = 0;
	
	var date = new Date();
	var beginDate = new Date(Date.parse(date) - (86400000 * 20));
	var beginMonth = beginDate.getMonth() + 1;
	var endMonth = date.getMonth() + 1;
	var begin = beginDate.getFullYear() + "/" + (beginMonth > 9 ? beginMonth.toString() : '0' + beginMonth) + "/" + (beginDate.getDate() > 9 ? beginDate.getDate().toString() : '0' + beginDate.getDate());
	var end = date.getFullYear() + "/" + (endMonth > 9 ? endMonth.toString() : '0' + endMonth) + "/" + (date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
	
	var options = {
		"filters[0].field": "createDateRange",
		"filters[0].data": begin + "-" + end,
		"filters[0].op": "between",
	}
	
	com.post(api.report.reportCityCount, options, function(res){
		
		var cityCounts = res.cityCounts;
		
		$.each(cityCounts, function(i, v){
			
			var city = v.city;
			
			if(city.cityName != cityName) return true;
			
			dateHandle(v.createDate);
			lineHandle(v);
			
			if(v.createDate == end.replace(/\//gm, '-')){
				totalPieHandle(v);
			}
			
		});
		
		canPie();
		canTotal();
//		canLine();
		amountLine();
		consultLine();
		quotationLine();
		depositLine();
		signedLine();
	});
	
	function dateHandle(createDate){
		if(dates.indexOf(createDate) == -1) dates.push(createDate.split('-')[1] + createDate.split('-')[2]);
	}
	
	function totalPieHandle(data){
		
		contractPrice = data.contractPrice;
		
		$.each(data, function(n, k){
			if(["createDate", "contractPrice", "city", "ccdId"].indexOf(n) != -1) return true;
			
			totalPies.push([status[n], k]);
			
			orderTotal += k;
		});
	}
	
	function lineHandle(data){
		
		if(!lines[data.city.cityName]){
			lines[data.city.cityName] = {}
		}
		
		var line = lines[data.city.cityName];
		
		$.each(data, function(n, k){
			
			if(["createDate", "contractPrice", "city", "ccdId"].indexOf(n) != -1) return true;
			
			if(!line[n]) line[n] = [];
			
			line[n].push(k);
		});
	}
	
	function canPie(){
		var $container =  $('<div></div>').addClass('col-sm-6').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "pies").appendTo($container);
        
        Pies("pies", "汇总", totalPies);
	}
	
	function canTotal(){
		var $container =  $('<div></div>').addClass('col-sm-6').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "total").css({height: '400', position: 'relative'}).appendTo($container);
        var $div = $('<div></div>').addClass('center').css({position: 'absolute', top: '30%', width: '80%'}).appendTo($chart);
        
        var $cpdiv = $('<div></div>').addClass('grid2').appendTo($div);
        var $cp = $('<span></span>').addClass('bigger-275 blue').text(contractPrice).appendTo($cpdiv);
        var $cps = $('<h5></h5>').text('签单总额').appendTo($cpdiv);
        var $otdiv = $('<div></div>').addClass('grid2').appendTo($div);
        var $ot = $('<span></span>').addClass('bigger-275 blue').text(orderTotal).appendTo($otdiv);
        var $ots = $('<h5></h5>').text('订单总数').appendTo($otdiv);
	}
	
	function canLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "lines").appendTo($container);
        
        Charts("lines", "test", dates, chartDataFormat(lines));
	}
	
	function amountLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "amountLine").appendTo($container);
        
        Charts("amountLine", "量尺", dates, chartDataFormat(lines, "amount"));
	}
	
	function consultLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "consultLine").appendTo($container);
        
        Charts("consultLine", "咨询", dates, chartDataFormat(lines, "consult"));
	}
	
	function quotationLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "quotationLine").appendTo($container);
        
        Charts("quotationLine", "报价", dates, chartDataFormat(lines, "quotation"));
	}
	
	function depositLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "depositLine").appendTo($container);
        
        Charts("depositLine", "定金", dates, chartDataFormat(lines, "deposit"));
	}
	
	function signedLine(){
		var $container =  $('<div></div>').addClass('col-sm-4').appendTo("#charts");
        var $chart = $('<div></div>').attr('id', "signedLine").appendTo($container);
        
        Charts("signedLine", "签约", dates, chartDataFormat(lines, "signed"));
	}
	
	function chartDataFormat(data, name){
		
		var _data = [];
		$.each(data[cityName], function(n, v){
			
			if(name && n != name) return true; 
			
			_data.push({name: status[n], data: v});
		})
		
		return _data;
	}
	
	function Charts(chartId, title, categories, series){
        $('#' + chartId).highcharts({
            credits:{
                enabled: false // 禁用版权信息
            },
            title: {
                text: title,
                x: -20
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                labels:{
                    step: 5,
                },
                categories: categories,
            },
            yAxis: {
                min: null,
                title: {
                    text: '订单数量'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '单'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: series
        });
    };
    
    function Pies(chartId, title, series){
    	$('#' + chartId).highcharts({
    		credits:{
                enabled: false // 禁用版权信息
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '订单数',
                data: series
            }]
        });
    }
	
});