$(function(){
    var mcategory = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        mcategoryItems:{},
        data:{
            mcategoryData: {}
        },
        editFlg: false,
        repeatFlg: false
    };

    mcategory.mcategoryItems.name = com.focusPage("#name");
    mcategory.mcategoryItems.icon = com.focusPage("#icon");

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

            var titleName = '品类,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

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
                [v.isShow =="0" ? "首页显示" : "首页不显示", 'red']
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

            var $btnStart = $('<li></li>').append($('<a></a>').html('不显示'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('显示'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($btnStart).append($btnBan).append($update);

            $btnUl.append($btnStart).append($btnBan).append($update);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $update.click(function(){
                //editBrand(v);
                com.focusPage("#name").val(v.name);
                com.focusPage("#icon").val(v.icon);
                openlayer(function(index, layero){
                    if(com.validate('form1'))
                        return;

                    updateData(v.cid, function(){
                        com.clearValidator("#cid", true);
                        com.clearValidator("#name", true);
                        com.clearValidator();
                        layer.closeAll();
                    });
                });
            });

         /*不显示 ==》显示*/
            $btnStart.click(function(){
                com.focusPage('#layerAdd').attr('data-cid', v.cid);
                com.focusPage('#layerAdd').attr('data-status', v.isShow);

                var id = com.focusPage('#layerAdd').attr('data-cid');
                var status = com.focusPage('#layerAdd').attr('data-status');
                startStatus(id,status,function(){
                    layer.closeAll();
                    layer.msg('首页不显示',{icon:1});
                });
            });
            /*显示 ==》不显示*/
            $btnBan.click(function(){
                com.focusPage('#layerAdd').attr('data-bid', v.cid);
                com.focusPage('#layerAdd').attr('data-status', v.isShow);

                var id = com.focusPage('#layerAdd').attr('data-bid');
                var status = com.focusPage('#layerAdd').attr('data-status');

                stopStatus(id,status,function(){
                    layer.closeAll();
                    layer.msg('首页显示',{icon:1});
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
    var _condArr = ["mcategory"];
    var mcategorySeacher = new Searcher();

    mcategorySeacher.init( _condArr, "condList", api.store.pageMcategory, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "mcategoryPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            com.cleanItems(mcategory.mcategoryItems);
            openlayer(function(index, layero){
                if(com.validate('form1'))
                    return;
                saveData(null, function(){
                    com.clearValidator("#cid", true);
                    com.clearValidator("#name", true);
                    com.clearValidator();
                    layer.closeAll();
                });
            });
        });
        return [$adda];
    },'resultList');

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:" ",
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
    function startStatus(id,isShow,callback){
        if(isShow == "0"){
            com.post(api.store.updateMcategoryForShow,{
                "mcategory.cid": id,
                "mcategory.isShow": 1
            },function(res){
                callback();
                mcategorySeacher.doSearch();
            });
        }else{
            layer.alert('已经不显示', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    function stopStatus(id, isShow, callback){
        if(isShow == "1"){
            com.post(api.store.updateMcategoryForShow,{
                "mcategory.cid": id,
                "mcategory.isShow": 0
            },function(res){
                callback();
                mcategorySeacher.doSearch();
            });
        }else{
            layer.alert('已经显示', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    /*添加信息*/
    function saveData(id, callback){
        var $layer = com.focusPage('#layerAdd');
        var mcategory = com.focusPage("#name").val();
        var icon = com.focusPage("#icon").val();

        com.post(api.store.addMcategory, {
            "mcategory.name": mcategory,
            "mcategory.icon": icon
        }, function(res){
            callback();
            mcategorySeacher.doSearch();
        });
    }

    function updateData(id, callback){
        var $layer = com.focusPage('#layerAdd');
        var name = com.focusPage("#name").val();
        var icon = mcategory.mcategoryItems.icon.val();
        com.post(api.store.updateMcategory, {
            'mcategory.cid':id,
            "mcategory.name": name,
            "mcategory.icon": icon
        }, function(res){
            callback();
            mcategorySeacher.doSearch();
        });
    }
});
