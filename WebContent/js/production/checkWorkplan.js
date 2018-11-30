/**
 * Created by Administrator on 2016/10/7.
 */
$(function(){
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');

            var titleName = '名称,状态,车间名,备注信息';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });


            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){


            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                v.workplan.name,
                v.workplan.status=="0"?"启用":"禁用",
                v.workplan.workshop.name,
                v.workplan.comment
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            $btnGroup.append($btnUl).appendTo($cellOption);
            $liLine.append($indexWrap).append($contentWrap);
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
    var $popup = com.focusPage('#checkWorkplan');
    var wfid =  $popup.attr('data-wfid');
    com.post(api.production.queryWorkflowPlanByWfid,{
        "workflowPlan.workflow.wfid": wfid
    },function(res){
        displayFunc.init('resultList1',res.workflowPlans);
    });

    //弹出内容许些样式
    com.focusPage('#resultList1').css({'width':'96%','margin':'0 auto'});

});
