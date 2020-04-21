
jQuery(function($) {

    var constructionInfo = {

        type:{},
        projectStatus:{},
        editFlg: false,
    };

    com.post(api.ds.decoration, {}, function(res){
        constructionInfo.type = res.type.split("key", "value");
    },null ,false);

    com.post(api.ds.construction, {}, function(res){
        constructionInfo.projectStatus = res.constructionSchedule.split("key", "value");
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
            var $title = $('<small></small>').addClass('blue').html(' ' + v.decoration.orderId);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $invalid = $('<div></div>').addClass('pull-right');
            var propertyArr = [
                ["楼盘地址:", (v.decoration.house.village.cityProper.city.name == null ? " " : v.decoration.house.village.cityProper.city.name) + " " + (v.decoration.house.village.cityProper == null ? " " : v.decoration.house.village.cityProper.name) + " " + v.decoration.house.village.name + " " + (v.decoration.house.houseNumber == null ? " " : v.decoration.house.houseNumber), "grey"],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["签单时间: ", v.decoration.contractTime, "grey"],
                ["预计交钥匙时间: ", v.keyTime, "grey"],
                ["预计放线时间: ", v.drawlineTime, "grey"],
                ["预计竣工时间: ", v.finishTime, "grey"],
                ["订单类型: ", constructionInfo.type[v.decoration.type], "red"],
                ["工程状态: ", constructionInfo.projectStatus[v.decoration.projectStatus], "red"],
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

    searcher.init(["c_orderId","c_keyTime","c_drawlineTime","c_finishTime"], "condList", api.construction.pageConstructionInfo, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionCostPostData",null, false, null,null);


})