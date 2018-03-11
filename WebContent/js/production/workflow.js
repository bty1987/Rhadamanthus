$(function(){

    //var $workflowName = $('#workflowName');
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
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                [v.name,'grey'],
                [v.status == 0 ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6 '+v[1]+'').html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnEdit).append($btnStart).append($btnStop);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnEdit.on("click",function () {
                productionUtils.clearForm("form1");
                com.clearValidator();
                $('#layerAdd').find('input[name="name"]').val(v.name);
                openlayer("编辑",function(){
                    if(!com.validate("layerAdd",null)){
                        saveData(v.wfid, function(){
                            Seacher.doSearch();
                            layer.closeAll();
                        });
                    }
                });
            });

            $btnStart.click(function () {

                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    changeQuoteTypeStatus(v.wfid,0,(v.status == 0) ,function(){
                        layer.closeAll();
                        layer.msg('启用成功',{icon:1,time:2e3});
                    });
                }, function(){});

            });

            $btnStop.click(function () {

                layer.confirm('是否禁用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    changeQuoteTypeStatus(v.wfid,1,(v.status == 1),function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2e3});
                    });
                }, function(){});
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

        Seacher.init(["p_workflowName"], "condList", api.production.pageWorkflow, function (data) {
            displayFunc.init('resultList', data);
        }, "pagenation", "Workflow", null, false, null,function () {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            $adda.on("click",function () {
                productionUtils.clearForm("form1");
                com.clearValidator();
                openlayer("添加",function(index, layero){
                    if(!com.validate("layerAdd",null)){
                        saveData(null, function(){
                            Seacher.doSearch();
                            layer.closeAll();
                        });
                    }

                });
            });

            return [$adda];
        },'resultList');

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

    function saveData(id,callback){
        var name = $('#layerAdd').find('input[name="name"]').val();

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

    /*btnType:0 启用功能,1 禁用功能
     statusFlag:当前状态是否与想要完成的功能相冲 */
    function changeQuoteTypeStatus(qtid,btnType,statusFlag ,callback) {

        if(!statusFlag){
            com.post(api.production.updateWorkflowForStatus, {
                "workflow.wfid": qtid,
                "workflow.status": btnType
            }, function (res) {
                callback();
                Seacher.doSearch();
            });
        }else{
            layer.alert(btnType == 0 ? '已经启用':'已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

});
