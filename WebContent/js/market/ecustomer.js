jQuery(function($) {
    var ecityItem = [];

    com.post(api.market.queryEcity, {}, function(res){
        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v){
            ecityItem[v.ecid] = v.city;
        })
    }, null, false);

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
            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["城市:", ecityItem[v.cityId], "grey"],
                ["姓名:", v.name, "grey"],
                ["电话:", v.phone, "grey"],
                ["楼盘名称:", v.villageName, "grey"],
                ["面积:", v.area + "平", "blue"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
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
    var conditionList = ["market-city", "market-customer-name"];

    searcher.init(conditionList, "condList", api.market.pageEcustomer, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "ecustomerPostData", null, false, null, null);
});
