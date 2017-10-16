/**
 * Created by Administrator on 2017/3/6.
 */
$(function(){
var flag = 0;
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
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var titleName = '名称,车间,说明,状态';
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-4').html(v);
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
                v.name,
                v.workshop.name,
                v.comment,
                v.status=="0"?"启用":"禁用"
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑')) ;
            var $btnView = $('<li></li>').append($('<a></a>').html('工序'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
            $btnUl
                .append($btnEdit)
                .append($btnView)
                .append($btnStart)
                .append($btnStop);
            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnEdit.click(function(){
                var name = $('#layerAdd').find('input[name="name"]').val(v.name);
                var workshop = $('#layerAdd').find('select[name="workshop"]').val(v.workshop.wsid);
                var comment = $('#layerAdd').find('input[name="comment"]').val(v.comment);
                $('#layerAdd').attr('data-wpid', v.wpid);
                openlayer(function(){
                    var id = $('#layerAdd').attr('data-wpid');
                    if(checkRowValue()){
                        saveData(id, function(){
                            layer.closeAll();
                        });
                    }
                });
            });

            //查看
            $btnView.click(function () {
                $('#layerAdd').attr('data-wpid', v.wpid);
                var id = $('#layerAdd').attr('data-wpid');
                checkWorkflow(id,v);
            });

            $btnStart.click(function(){
                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-wpid', v.wpid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-wpid');
                    var status = $('#layerAdd').attr('data-status');
                    startGoodsStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('启用成功',{icon:1,time:2e3});
                    });
                }, function(){

                });
            });

            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-wpid', v.wpid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-wpid');
                    var status = $('#layerAdd').attr('data-status');
                    stopGoodsStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2e3});
                    });
                }, function(){
                });
            })
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
    var goodsSeacher = new Searcher();
    com.post(api.production.queryWorkshop,{},function(res){
        $('select[name="workshop"]').bindData(res.workshops,"wsid","name");
    });

     goodsSeacher.init( ["WorkplanName"], "condList", api.production.pageWorkplan, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "assisTypePostData", null, false, null, function(){

         var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
         var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
         var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){

            productionUtils.clearForm('form1');

            openlayer(function(index, layero){
                if(checkRowValue()){
                    saveData(null, function(){
                        layer.closeAll();
                    });
                }
            });
        });
        return [$adda];
    },'resultList');

    function checkWorkflow(wpid,v) {
        var $popup = $('#checkWorkflow');
        $popup.attr({'data-wpid': wpid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看工序",
            content: $popup,
            area:["800px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: true,
            zIndex: 9999,
            success: function (layer, index) {
                params["wpid"] = wpid ;
                params["v"] = v ;
                $popup.load("views/production/checkWorkflow.html");
            },
            end: function () {
                $popup.attr('data-wpid', null);
            }
        });
    }

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:"添加",
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: true,
            zIndex:9999,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
                $('#layerAdd').find('input[name="comment"]').val("");
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                $('#layerAdd').find('input[name="comment"]').val("");
            },
            cancel: function(){
                //右上角关闭回调
                $('#layerAdd').find('input[name="comment"]').val("");
            }
        });
    }


    //状态启用
    function startGoodsStatus(id,status,callback){
        if(status=="1"){
                com.post(api.production.updateWorkplanForStatus,{
                "workplan.wpid": id,
                "workplan.status": "0"
            },function(res){
                callback();
                goodsSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }
    //状态禁用
    function stopGoodsStatus(id,status,callback){
        if(status=="0"){
                com.post(api.production.updateWorkplanForStatus,{
                "workplan.wpid": id,
                 "workplan.status": "1"
            },function(res){
                callback();
                goodsSeacher.doSearch();
            })
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            })
        }
    }

    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var workshop = $layer.find('select[name="workshop"] option:selected').val();
        var comment = $layer.find('input[name="comment"]').val();

        if(!id){
            com.post(api.production.addWorkplan, {
                "workplan.name": name,
                "workplan.comment": comment,
                "workplan.workshop.wsid": workshop
            }, function(res){
                callback();
                goodsSeacher.doSearch();
            });

        }else{
            com.post(api.production.updateWorkplan, {
                "workplan.wpid": id,
                "workplan.name": name,
                "workplan.comment": comment,
                "workplan.workshop.wsid": workshop
            }, function(res){
                callback();
                goodsSeacher.doSearch();
            });
        }
    }

    function checkRowValue(){
        var _flag = true;
        //判断五金单说明是否输入正确
        var $name = $('#layerAdd').find("input[name='name']");
        if(!$name.val()){
            _flag = false;
            $name.focus().select();
            $name.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "名称不能为空"
            }).popover('show');
        }else{
            $name.popover('destroy');
        }
        return _flag;
    }
});

