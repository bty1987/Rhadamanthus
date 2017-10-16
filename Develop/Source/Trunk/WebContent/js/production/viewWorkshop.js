$(function(){
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);

            if(listData && listData.length){

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };
        var createTableTitle = function(){

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var titleName = '工序组名称,备注';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });


            $liTitle.append($indexWrap)
                .append($contentWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){


            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');
            var propertyArr = [
                v.name,
                v.comment
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            $btnGroup
                .append($btnUl)
                .appendTo($cellOption);
            $liLine.append($indexWrap)
                .append($contentWrap);
            return $liLine;
        };
        return {
            init : function(tableId,listData){
                if(!listData.length){
                    $('#' + tableId).html("暂无工序组信息");
                }else{
                    $('#' + tableId).html(null);
                    renderList(tableId,listData);
                }

            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
    var $popup = $('#viewPopUp');
    var mid =  $popup.attr('data-mid');
    com.post(api.production.queryWorkplanByWsid,{
        "workplan.workshop.wsid": mid
    },function(res){
            displayFunc.init('resultList1',res.workplans);
    });

    //弹出内容许些样式
    $('#resultList1').css({'width':'96%','margin':'0 auto'});

});

