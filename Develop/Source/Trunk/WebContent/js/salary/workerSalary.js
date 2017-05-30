
jQuery(function($) {


    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.user.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [

                ["创建时间:", v.createTime , "grey"],
                ["结算时间:", v.balanceTime , "grey"],
                ["工费:", v.salary ,  "grey"],
                ["类型：", v.type == 0 ? "工费" : "扣款", "red"],
                ["状态:", v.status == 0 ? "初始":"未处理" ,"grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $divBtnWrap.append($btnDel).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function(){
                deletebystatus(v.wsId);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var _condArr = [ 'orderId','jober'];
    searcher.init(_condArr, "condList", api.salary.pageWorkerSalary, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "workersalaryPostData", null, false, null,null);

    function deletebystatus(wsId){

        com.post(api.salary.deleteWorkerSalary,{

            "workerSalary.wsId": wsId
        
        }, function(res){
            searcher.doSearch();
        },function(data){
            com.showAlert(com.error,"工费状态不可操作")
        });
    }

  

});
