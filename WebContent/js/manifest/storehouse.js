/**
 * Created by Administrator on 2016/9/20.
 */
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

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

        /*表格头*/
        var createTableTitle = function(){

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '仓库,状态';

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
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col2');

            var propertyArr = [
                [v.name,'grey'],
                [v.status =="0" ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
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
            $btnStart.click(function(shId,status){

                com.focusPage('#layerAdd').attr('data-shId', v.shId);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-shId');
                var status = com.focusPage('#layerAdd').attr('data-status');
                startStatus(id,status,function(){
                    layer.closeAll();
                    layer.msg('启用成功',{icon:1});
                });
            });
            /*状态禁用*/
            $btnBan.click(function(){
                com.focusPage('#layerAdd').attr('data-shId', v.shId);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-shId');
                var status = com.focusPage('#layerAdd').attr('data-status');

                stopStatus(id,status,function(){
                    layer.closeAll();
                    layer.msg('禁用成功',{icon:1});
                });
            });


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

    /*分页*/
    var _condArr = ['storehouseName', 'storehouseNumber'];

    var storehouseSeacher = new Searcher();

    storehouseSeacher.init( _condArr, "condList", api.inventory.pageStorehouse, function(data){
    	
        displayFunc.init('resultList', data);

    }, "pagenation", "storehousePostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            clearForm('form1');
            openlayer(function(index, layero){
                if(com.validate('form1'))
                    return;

                saveData(null, function(){
                    com.clearValidator("#code", true);
                    com.clearValidator("#name", true);
                    com.clearValidator();
                    layer.closeAll();
                });


            });
        });

        return [$adda];
    },'resultList');


    function clearForm(formId){
        var $form = com.focusPage("#"+formId);
        var error = com.focusPage('.alert-error', $form);
        var success = com.focusPage('.alert-success', $form);
        com.focusPage('.control-group').removeClass("success").removeClass("error");
        com.focusPage(".ok").remove();
        com.focusPage(".help-inline").remove();
        success.hide();
        error.hide();
        $("span.checked",$form).removeClass("checked");
        $("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        com.focusPage(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        $('input[type="hidden"]',$form).val('');
        document.getElementById(formId).reset();
    }

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title:"添加",
            content: com.focusPage('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);

            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                com.clearValidator();
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    /*状态信息验证*/
    function startStatus(id,status,callback){
        if(status=="1"){
            com.post(api.inventory.updateStorehouseForStatus,{
                "storehouse.shId":id,
                "storehouse.status":"0"
            },function(res){
                callback();
                storehouseSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }
    function stopStatus(id,status,callback){
        if(status=="0"){
            com.post(api.inventory.updateStorehouseForStatus,{
                "storehouse.shId":id,
                "storehouse.status":"1"
            },function(res){
                callback();
                storehouseSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    /*添加仓库信息*/
    function saveData(id,callback){
        var $layer = com.focusPage('#layerAdd');
        var code = $layer.find('input[name="code"]').val();
        var name = $layer.find('input[name="name"]').val();
        if(!id){

            com.post(api.inventory.addStorehouse, {
                "storehouse.code": code,
                "storehouse.name": name
            }, function(res){
                callback();
                storehouseSeacher.doSearch();
            });

        }
    }

});
