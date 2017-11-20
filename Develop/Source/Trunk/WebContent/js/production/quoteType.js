
$(function(){

    var $layerAdd = $('#layerAdd');
    var $quoteTypeName = $('#quoteTypeName');
    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');
            var titleName = '编号,报价类型,状态';
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

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');
            var propertyArr = [
                v.qtid,
                v.name,
                v.status == 0 ?"启用":"禁用",
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-4').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            //操作按钮下面的选项
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl
                .append($btnEdit)
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

            //编辑点击事件
            $btnEdit.click(function () {
                var layerType = "编辑";
                $quoteTypeName.attr("data-qtid", v.qtid);
                $quoteTypeName.val(v.name);
                com.clearValidator();
                openlayer(layerType,function () {
                    if (!com.validate("layerAdd",null)) {
                        com.post(api.production.updateQuoteType,{
                            "quoteType.qtid": v.qtid,
                            "quoteType.name": $quoteTypeName.val()
                        },function(res){
                            layer.closeAll();
                            //$layerAdd.attr('data-qtid', null);
                            $quoteTypeName.val("");
                            quoteTypeSeacher.doSearch();
                            layer.msg('编辑成功',{time:2e3});
                        },function(e){
                            layer.closeAll();
                            $quoteTypeName.val("");
                           // $layerAdd.attr('data-qtid', null);
                            com.showAlert(com.error, e.exception.errorMessage);
                        });

                    }

                });
            });

            //状态启用事件
            $btnStart.click(function () {
                layer.confirm('是否启用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    $layerAdd.attr('data-qtid', v.qtid);
                    $layerAdd.attr('data-status', v.status);
                    var qtid = $layerAdd.attr('data-qtid');
                    var status = $layerAdd.attr('data-status');
                    startQuoteTypeStatus(qtid, status, function () {
                        layer.closeAll();
                        $layerAdd.attr({'data-qtid': null, 'data-status': null});
                        layer.msg('启用成功', {icon: 1, time: 2e3});
                    });
                }, function () {

                });
            });
            //状态禁用事件
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    $layerAdd.attr('data-qtid', v.qtid);
                    $layerAdd.attr('data-status', v.status);
                    var qtid = $layerAdd.attr('data-qtid');
                    var status = $layerAdd.attr('data-status');
                    stopQuoteTypeStatus(qtid, status, function () {
                        layer.closeAll();
                        $layerAdd.attr({'data-qtid': null, 'data-status': null});
                        layer.msg('禁用成功', {icon: 1, time: 2e3});
                    });
                }, function () {

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

    var quoteTypeSeacher = new Searcher();

    quoteTypeSeacher.init( ["quoteTypeName"],"condList",api.production.pageQuoteType,function(data){
            displayFunc.init('resultList', data);

        },"pagenation","quoteTypePostData",null,false,null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
            $adda.click(function () {
                var layerType = "添加";
                com.clearValidator();
                openlayer(layerType,function (index, layero) {
                    if (!com.validate("layerAdd",null)) {
                        saveData(function(){
                            layer.closeAll();
                            $quoteTypeName.val("");
                            quoteTypeSeacher.doSearch();

                        });
                    }

                });
            });
            return [$adda];
        },'resultList'
    );

    function openlayer(layerType,callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title:layerType ,
            content:$('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);

            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                $quoteTypeName.val("");

            },
            cancel: function(){
                //右上角关闭回调
                $quoteTypeName.val("");

            }
        });
    }

    //添加数据
    function saveData(callback){

        var name = $quoteTypeName.val();
        com.post(api.production.addQuoteType,{
            "quoteType.name":name
        },function(res){
            callback();
            layer.msg('添加成功',{icon:1,time:2e3});
        },function(){
            callback();
            com.showAlert(com.warning, "添加失败");
        });


    }

    //状态启用
    function startQuoteTypeStatus(qtid, status, callback) {
        if (status == "1") {
            com.post(api.production.updateQuoteTypeForStatus, {
                "quoteType.qtid": qtid,
                "quoteType.status":"0"
            }, function (res) {
                callback();
                quoteTypeSeacher.doSearch();
            });
        } else {
            $layerAdd.attr({'data-qtid': null, 'data-status': null});
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    //状态禁用
    function stopQuoteTypeStatus(qtid, status, callback) {

        if (status == "0") {
            com.post(api.production.updateQuoteTypeForStatus, {
                "quoteType.qtid": qtid,
                "quoteType.status":"1"
            }, function (res) {
                callback();
                quoteTypeSeacher.doSearch();
            });
        } else {
            $layerAdd.attr({'data-qtid': null, 'data-status': null});
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

});
