
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var $workflowName = $('#workflowName');
    var displayFunc  = (function() {

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

            var titleName = '工序名称,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };


        var creatLine = function(i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [

                v.name,
                v.status == "0" ? "启用" : "禁用"

            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));

            //var $btnShow = $('<li></li>').append($('<a></a>').html('查看'));

            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));

            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnEdit).append($btnStart).append($btnStop);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);


            $btnEdit.on("click",function () {

                var name = $('#layerAdd').find('input[name="name"]').val(v.name);
                $('#layerAdd').attr('data-atid', v.wfid);
                openlayer(function(){
                    var id = $('#layerAdd').attr('data-atid');
                        if(submitValidate()){
                            saveData(id, function(){
                                Seacher.doSearch();
                                layer.closeAll();
                                $workflowName.val("");
                            });
                        }

                });

            });


           /* $btnShow.click(function () {

                $('#layerAdd').attr('data-wfid', v.wfid);
                var id = $('#layerAdd').attr('data-wfid');
                ShowWorkplan(id);

            });*/


            $btnStart.click(function () {

                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-atid', v.wfid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-atid');
                    var status = $('#layerAdd').attr('data-status');
                    startStatus(id,status,function(){
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
                    $('#layerAdd').attr('data-atid', v.wfid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-atid');
                    var status = $('#layerAdd').attr('data-status');
                    stopStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2e3});
                    });
                }, function(){

                });
            });


        return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


        var Seacher = new Searcher();

        Seacher.init(["workflowName"], "condList", api.production.pageWorkflow, function (data) {
            displayFunc.init('resultList', data);
        }, "pagenation", "Workflow", null, false, null,function () {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            $adda.on("click",function () {
                openlayer(function(index, layero){
                    if(submitValidate()){
                        saveData(null, function(){
                            Seacher.doSearch();
                            layer.closeAll();
                            $workflowName.val("");
                        });
                    }

                });
            });

            return [$adda];
        },'resultList');


    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:"添加",
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);

            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                $workflowName.val("");
            },
            cancel: function(){
                //右上角关闭回调
                $workflowName.val("");
            }
        });
    }


    //function ShowWorkplan(wfid) {
    //
    //    var $popup = $('#checkWorkplan');
    //    $popup.attr({'data-wfid': wfid});
    //
    //    //弹出即全屏
    //    var index = layer.open({
    //        type: 1,
    //        skin: 'layui-layer-molv',
    //        title: "查看工序组",
    //        content: $popup,
    //        area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
    //        maxmin: true,
    //        zIndex: 9999,
    //        btn: ['取消'],
    //        success: function (layer, index) {
    //            $popup.load("views/production/checkWorkplan.html");
    //        },
    //        end: function () {
    //            $popup.attr('data-wfid', null);
    //        }
    //    });
    //}

    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var name = $layer.find('input[name="name"]').val();

        if(!id){

            com.post(api.production.addWorkflow, {
                "workflow.name": name
            }, function(res){

                callback();
                layer.msg('添加成功',{icon:1,time:2e3});

            });

        }
        else{
          com.post(api.production.updateWorkflow, {
                "workflow.wfid": id,
                "workflow.name": name
            }, function(res){
              callback();
                    layer.alert('操作完成', {
                        icon: 1,
                        skin: 'layer-ext-moon'
                    });
            });


        }
    }
    function startStatus(id,status,callback){
        if(status=="1"){

            com.post(api.production.updateWorkflowForStatus,{
                "workflow.wfid": id,
                "workflow.status": "0"
            },function(res){
                callback();
               Seacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }
    function stopStatus(id,status,callback){
        if(status=="0"){
            com.post(api.production.updateWorkflowForStatus,{
                "workflow.wfid": id,
                "workflow.status": "1"
            },function(res){
                callback();
                Seacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    function submitValidate() {
        var flag = true;
        if(!$workflowName.val()){
            $workflowName.focus().select();
            $workflowName.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写工序名称"
            }).popover('show');

            flag =  false;
        }else{
            $workflowName.popover('destroy');

        }
        return flag;
    }
});
