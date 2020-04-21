$(function () {
    
    var attendance = function(res){
    		
        
        var options = res.option;
        var data = options.series.data;
        
        $.each(data, function(i, v){
            var m = Math.floor(v[1]/10);
            var e = Math.floor(v[1]%10);
            
            v[2] = v[0] + ": 早" + (m == "1" ? "正常" : (m == "2" ? "迟到" : "未打卡")) + ", 晚" + (e == "1" ? "正常" : (e == "2" ? "早退" : "未打卡"));
            
            data[i] = {
                "value": [v[0], m > e ? m : e],
                "label": v[2]
            };
            
        });
        
        options.visualMap.min = 1;
        options.visualMap.max = 4;
        
        options.tooltip = {
            position: 'top',
            formatter: function (p) {
                return p.data.label;
            }
        };
    };
    
    com.post(api.data.queryChartForLogin, {}, function(res){
    	$.each(res.charts, function(i, v){
    		com.charts("customize", v.no, com.getProp(v.api), JSON.parse(v.param), v.clazz, v.style, null, attendance);
    	});
	});
    
});