
jQuery(function($) {

    var phoneCall = {

        stopReason: {},
        recordType: {}
    };

    com.post(api.ds.information, {}, function(res){

        phoneCall.stopReason = res.stopReason.split("key", "value");
        phoneCall.recordType = res.recordType.split("key", "value");

    },null,false);     
    
    var displayFunc  = (function(){
		
		Date.prototype.Format = function (fmt) {  
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

            return fmt;
        };

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };        
        
        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.operater.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-primary').html('录音地址');                        
            
            var startTime = new Date(v.startTime).Format("yyyy-MM-dd hh:mm:ss");
            
            var endTime = new Date(v.endTime).Format("yyyy-MM-dd hh:mm:ss");
           
            var propertyArr = [
                ["编号:",v.callbackId,"grey"],
                ["订单编号:", v.orderId, "red"],                
                ["操作时间:", v.operateTime, "red"],
                ["主叫号码:", v.caller,"blue"],
                ["被叫号码:", v.callee,"blue"],
                ["开始时间:", startTime,"red"],
                ["结束时间:", endTime,"red"],
                ["挂断原因:", phoneCall.stopReason[v.stopReason],"green"],
                ["通话时长:", v.duration,"grey"],
                ["录音类型:", phoneCall.recordType[ v.recordType],"blue"]
            ];
            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if(v.recordUrl != undefined && v.recordUrl != null && v.recordUrl != "" && v.recordType == 1){
            	
            	$divBtnWrap.append($btnRecord).appendTo($h3);
        	}else{
            
            $divBtnWrap.appendTo($h3);

        	}
            
            $liLine.append($h3).append($ulProperty);

            $btnRecord.click(function(){
        		
        		var url = config.media + v.recordUrl;	
            	com.popup("录音地址:" ,url,function () {
            	    	
        	    });
        		
        	});
            
            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
    
    var searcher = new Searcher();

    searcher.init(['userId'], "condList", api.information.pagePhoneCall, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "callphonePostData", null, false, null, function(){

    });

});
