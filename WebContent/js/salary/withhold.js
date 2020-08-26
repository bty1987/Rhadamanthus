jQuery(function($) {

    var withhold = {

        wid: null,

        withholdType:{},
        withholdStatus:{},
        editFlg: false,
    };

    com.post(api.ds.salary, {}, function(res){
        withhold.withholdStatus = res.withholdStatus.split("key", "value");
    },null ,false);

    com.post(api.ds.salary, {}, function(res){
        withhold.withholdType = res.withholdType.split("key", "value");
    },null ,false);

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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.orderId);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [
                ["姓名: ", v.user.currentName, "grey"],
                ["类型: ", withhold.withholdType[v.type], "red"],
                ["操作金额: ", v.money, "blue"],
                ["创建时间: ", v.createTime, "grey"],
                ["操作人: ", v.operater.currentName, "grey"],
                ["操作时间: ", v.operateTime, "grey"],
                ["状态: ", withhold.withholdStatus[v.status], "red"],
                ["说明: ", v.comment, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $h3.append($title).append($btnDiv);

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

    searcher.init(["inf_userName", "c_orderId", "w_type", "w_status", "w_createTime", "operateTime"], "condList", api.salary.pageWithhold, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "WithholdPostData",null, false, null, null);

})