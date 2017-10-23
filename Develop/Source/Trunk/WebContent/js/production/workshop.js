$(function(){
    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var $workshopName = $('#workshopName');
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);

            if(listData && listData.length){

                var $ulTitle = createTableTitle();
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '名称,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

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

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑')) ;
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
            var $btncheck = $('<li></li>').append($('<a></a>').html('查看'));


            $btnUl
                .append($btnEdit)
                .append($btnStart)
                .append($btnStop)
                .append($btncheck);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);


            $btnEdit.click(function(){
                $workshopName.val(v.name);
               $('#layerAdd').attr('test-wsid', v.wsid);
                openlayer(function(){
                    var id = $('#layerAdd').attr('test-wsid');
                    if(submitValidate()){
                        saveData(id, function(){
                            layer.closeAll();
                            $workshopName.val("");
                        });
                    }

                });
            });

            $btnStart.click(function () {
                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('test-wtId', v.wsid);
                    $('#layerAdd').attr('test-status', v.status);
                    var id = $('#layerAdd').attr('test-wtId');
                    var status = $('#layerAdd').attr('test-status');
                    startStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('启用成功',{icon:1,time:2000});
                    });
                }, function(){

                });
            });
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('test-wtId', v.wsid);
                    $('#layerAdd').attr('test-status', v.status);
                    var id = $('#layerAdd').attr('test-wtId');
                    var status = $('#layerAdd').attr('test-status');
                    stopStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2000});
                    });
                }, function(){

                });
            });
            $btncheck.click(function(){
                queryWorkplan(v.wsid,function(){
                    layer.closeAll();
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
        };
    })();


    var workshopSeacher = new Searcher();

    workshopSeacher.init( ['workshopName'], "condList", api.production.pageWorkshop, function(data){
        displayFunc.init('resultList', data);

    }, "pagenation", "workshopPostData", null, false, null, function(){

        //var $adda = $('<a></a>').addClass('btn mini pull-left').attr('name', 'addWorkshopVersion').css('margin-top', '-2px').html('添加');
        var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        $adda.click(function(){
            openlayer(function(index, layero){
                if(submitValidate()){
                    saveData(null, function(){
                        layer.closeAll();
                        $workshopName.val("");
                        layer.msg("添加成功");
                    },function(){
                        $workshopName.val("");
                        layer.msg("添加失败");
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
            skin: 'layui-layer-lan',
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
                $workshopName.val("");
            },
            cancel: function(){
                //右上角关闭回调
                $workshopName.val("");
            }
        });
    }


    function startStatus(id,status,callback){
        if(status=="1"){
            com.post(api.production.updateWorkshopForStatus,{
                "workshop.wsid":id,
                "workshop.status":"0"
            },function(res){
                callback();
                workshopSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }
    //状态禁用
    function stopStatus(id,status,callback){
        if(status=="0"){
            com.post(api.production.updateWorkshopForStatus,{
                "workshop.wsid":id,
                "workshop.status":"1"
            },function(res){
                callback();
                workshopSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }


    function submitValidate() {
        var flag = true;
        if(!$workshopName.val()){
            $workshopName.focus().select();
            $workshopName.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写车间名称"
            }).popover('show');

            flag =  false;
        }else{
            $workshopName.popover('destroy');
        }
        return flag;
    }


    function saveData(id,callback){
        var name = $workshopName.val();
        if(!id){

            com.post(api.production.addWorkshop, {
                "workshop.name": name
            }, function(res){
                callback();
                //layer.closeAll();
                layer.msg("添加成功");
                workshopSeacher.doSearch();
            });

        }else{

            com.post(api.production.updateWorkshop, {
                "workshop.wsid": id,
                "workshop.name": name
            }, function(res){
                callback();
                layer.msg("编辑成功");
                workshopSeacher.doSearch();
            });

        }
    }

    function queryWorkplan(id,callback){

        var $popup = $('#viewPopUp');
        $popup.attr({'data-mid': id});
        layer.closeAll();
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title:"查看工序组",
            content: $popup,
            area: ($(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
            btn: ['取消'],
            success: function (layer, index) {
                $popup.load("views/production/viewWorkshop.html");
            },
            end: function () {
                $popup.attr('data-mid', null);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

});
