jQuery(function($) {

    //隐藏触发
    com.focusPage("#processInfo").on('hide.bs.modal', function () {
        com.focusPage("#processfield").empty();
        com.focusPage("#processitem").empty();
        com.focusPage("#processcomment").empty();
    });

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            $btnEdit.click(function(){
                //显示表单
                params.process = v;
                com.popup4page("#layerPopUp", "views/approval/process2create.html", "审批");
            });

            var propertyArr = [
                ["名称:", v.name, "grey"],
                ["编号:", v.no, "blue"],
                ["code:", v.code, "grey"],
                ["状态:", v.status == 0 ? "启用" : "禁用", "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);
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
        };
    })();

    var searcher = new Searcher();
    params.searcher = searcher;

    searcher.init(["approval-process-no", "approval-process-name"], "condList", api.approval.pageProcess, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "processPostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProcess').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });
    
    com.focusPage("#addProcess").click(function() {

        params.process = null;

        com.popup4page("#layerPopUp", "views/approval/process2create.html", "审批");
    });

});
