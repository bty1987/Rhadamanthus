
/**
 * Created by Administrator on 2016/9/20.
 */
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var goodsColorPopUp = $('#goodsColorPopUp')

    var displayFunc  = (function(){

        /*表格样式*/
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

                $('#resultListColor').css({'width':'96%','margin':'0 auto','height':'560px','marigin-top':'20px'})

            }
        };

        /*表格头*/
        var createTableTitle = function(){

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '颜色,状态';

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

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {


            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var propertyArr = [
                //v.gid,
                v.name,
                v.status =="0" ? "启用" : "禁用"
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');


            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl
                .append($btnStart)
                .append($btnBan);
            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);


            /*状态启用*/
            $btnStart.click(function(){
                $('#layerAdd').attr('data-cid', v.cid);
                $('#layerAdd').attr('data-status', v.status);

                var id = $('#layerAdd').attr('data-cid');
                var status = $('#layerAdd').attr('data-status');
                startStatus(id,status,function(){
                    layer.msg('启用成功',{icon:1})
                    doSearcher()
                });
            });
            /*状态禁用*/
            $btnBan.click(function(){
                $('#layerAdd').attr('data-cid', v.cid);
                $('#layerAdd').attr('data-status', v.status);

                var id = $('#layerAdd').attr('data-cid');
                var status = $('#layerAdd').attr('data-status');

                stopStatus(id,status,function(){
                    layer.msg('禁用成功',{icon:1})
                    doSearcher();
                });
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
    /*分页*/
    function doSearcher(){
    	com.post(api.inventory.queryColorByGid,{
            "color.gid": goodsColorPopUp.attr('data-gid')
        },function(res){
            displayFunc.init('resultListColor',res.colors)
        })
    }
    doSearcher();

    /*状态信息验证*/
    function startStatus(id,status,callback){
        if(status=="1"){
            com.post(api.inventory.updateColorForStatus,{
                "color.cid":id,
                "color.status":"0"
            },function(res){
                callback();
                doSearcher();
            })
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            })
        }
    }
    function stopStatus(id,status,callback){
        if(status=="0"){
            com.post(api.inventory.updateColorForStatus,{
                "color.cid":id,
                "color.status":"1"
            },function(res){
                callback();
                doSearcher();
            })
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            })
        }
    }

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col1');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass : "name", hasInput : !0},//名称
        ];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            var gid = $(this).parents('li.line.current').attr('data-gid');
            var options = {
                "color.gid":goodsColorPopUp.attr('data-gid'),
                "color.name": $lineInfoWrap.find('.name input').val()
            };
            if(checkRowValue($line)){
                com.post(api.inventory.addColor,options,function(){
                    $('#list').empty();
                    addline(1).addClass('current').appendTo('#list');
                    com.post(api.inventory.queryColorByGid,{
                        "color.gid":goodsColorPopUp.attr('data-gid')
                    },function(data){
                        displayFunc.init('resultListColor',data.colors)
                        doSearcher();
                    })
                },function(e){
                    com.showAlert(com.info, e.errorMsg);
                })
            }

        })

        $btndel.click(function (e) {

            $('#list').empty();

            addline(1).addClass('current').appendTo('#list');

        })

        return $line;

    }
    addline(1).addClass('current').appendTo('#list');

    function checkRowValue($line){

        var flag = true;

        var name = $line.find('.name input');
        if(!name.val()){
            name.focus().select();

            name.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写颜色名称"

            }).popover('show');

            flag =  false;
        }else{
            name.popover('destroy');
        }



        return flag;
    }


    $('.layui-layer-content').css('overflow','hidden');
    $('#showColor').css('height','560px');
    $('#addColor').css({'width':'96%','margin':'0 auto','margin-top':'15px'})

});
