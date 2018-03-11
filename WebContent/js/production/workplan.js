$(function(){

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
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                [v.name,'grey'],
                [v.workshop.name,'grey'],
                [ v.comment,'grey'],
                [v.status == 0 ? "启用" : "禁用",'red']
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
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
                productionUtils.clearForm("form1");
                com.clearValidator();
                $('#layerAdd').find('input[name="name"]').val(v.name);
                $('#layerAdd').find('select[name="workshop"]').val(v.workshop.wsid);
                $('#layerAdd').find('input[name="comment"]').val(v.comment);
                openlayer("编辑",function(){
                    if(!com.validate("layerAdd",null)){
                        saveData(v.wpid, function(){
                            layer.closeAll();
                            workplanSeacher.doSearch();
                        });
                    }
                });
            });

            //查看
            $btnView.click(function () {
                checkWorkflow(v.wpid);
            });

            $btnStart.click(function(){
                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    changeQuoteTypeStatus(v.wpid, 0,(v.status == 0) ,function(){
                        layer.closeAll();
                        workplanSeacher.doSearch();
                        layer.msg('启用成功',{icon:1,time:2e3});
                    });
                }, function(){});
            });

            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    changeQuoteTypeStatus(v.wpid,1,(v.status == 1) ,function(){
                        layer.closeAll();
                        workplanSeacher.doSearch();
                        layer.msg('禁用成功',{icon:1,time:2e3});
                    });
                }, function(){});
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

    var workplanSeacher = new Searcher();

    workplanSeacher.init( ["p_workplanName"], "condList", api.production.pageWorkplan, function(data){

        displayFunc.init('resultList', data);

    }, "pagenation", "assisTypePostData", null, false, null, function(){


         var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
         var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
         var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            productionUtils.clearForm('form1');
            com.clearValidator();
            openlayer("添加",function(index, layero){
                if(!com.validate("layerAdd",null)){
                    saveData(null, function(){
                        layer.closeAll();
                        workplanSeacher.doSearch();
                    });
                }
            });
        });
        return [$adda];
    },'resultList');

    //绑定车间下拉菜单
    com.post(api.production.queryWorkshop,{},function(res){
        $('select[name="workshop"]').bindData(res.workshops,"wsid","name");
    });

    function checkWorkflow(wpid) {
        var $popup = $('#checkWorkflow');
        $popup.attr('data-wpid',wpid);
        //弹出即全屏
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看工序",
            content: $popup,
            area:["800px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/production/checkWorkflow.html");
            },
            end: function () {
                $popup.attr('data-wpid', null);
            }
        });
    }

    function openlayer(layerType,callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:layerType,
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    /*btnType:0 启用功能,1 禁用功能
     statusFlag:当前状态是否与想要完成的功能相冲 */
    function changeQuoteTypeStatus(qtid,btnType,statusFlag ,callback) {

        if(!statusFlag){
            com.post(api.production.updateWorkplanForStatus, {
                "workplan.wpid": qtid,
                "workplan.status": btnType
            }, function (res) {
                callback();
            });
        }else{
            layer.alert(btnType == 0 ? '已经启用':'已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
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
            });
        }else{
            com.post(api.production.updateWorkplan, {
                "workplan.wpid": id,
                "workplan.name": name,
                "workplan.comment": comment,
                "workplan.workshop.wsid": workshop
            }, function(res){
                callback();
            });
        }
    }

});

