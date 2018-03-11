
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){
        var binding = {
            //操作配置
            optAction : function(userId, user){

                var $popup = $("#optPopUp");
                $popup.attr('data-userId', userId);
                //$popup.attr('data-name', name);
                //弹出即全屏
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-lan',
                    title:"仓库权限配置",
                    content: $popup,
                    area: ["800px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
                    maxmin: false,
                    zIndex:9999,
                    success: function(){
                        params["promissionUser"] = user ;
                        //params["storehouseUsersStorehouse"] = storehouse;
                        $popup.load("views/manifest/storehouseUserItem.html");
                    },
                    end:function(){
                        $popup.attr('data-userId', null);
                    }
                });
            },
        };

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');

            var titleName = '员工编号,用户名,现用名,职位';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                [v.userId,'grey'],
                [v.userName,'grey'],
                [v.currentName,'grey'],
                [v.duty.name,'grey']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');


            var $btnstorehouse = $('<li></li>').append($('<a></a>').html('仓库')) ;

            $btnUl
                .append($btnstorehouse);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnstorehouse.click(function(){
                binding.optAction(v.userId, v);
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
        };
    })();


    var userSeacher = new Searcher();

    userSeacher.init( ["storehouseUserName"], "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "storehouseUserPostData", null, false, null, null, 'resultList');

});
