
jQuery(function($) {
	
	var loginLog = {
		modal: null,
		loginLogItems:{},
		
		postParam: {},
		
		regionList: [],
		regionKey: "regionId",
		regionValue: "regionName"
	};
	
	var displayFunc  = (function(){

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.loginId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
               ["登陆Ip地址:", v.sourceIp, "grey"],
               ["登陆时间:", v.loginTime, "grey"],
               ["登陆结果:", v.successFlag == 1 ? "成功" : "失败", "red"]
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $liLine.append($h3).append($ulProperty);
            
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
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["loginId", "sourceIp", "loginTime", "successFlag"], "condList", api.log.pageLoginLog, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "loginLogPostData");
	
});

