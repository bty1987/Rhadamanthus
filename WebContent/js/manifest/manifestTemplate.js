
$(function(){

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var titleName = '名称,说明,状态';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var propertyArr = [

                [v.name,'grey'],
                [v.comment,'grey'],
                [v.status == "0" ? "启用" : "禁用",'red']
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


            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑')) ;
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
            var $btnDel = $('<li></li>').append($('<a></a>').html('删除')) ;
            var $btnBinbing = $('<li></li>').append($('<a></a>').html('绑定'));


            $btnUl
                .append($btnEdit)
                .append($btnStart)
                .append($btnStop)
                .append($btnDel)
                .append($btnBinbing);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);



            $btnEdit.click(function(){


                var name = $('#layerAdd').find('input[name="name"]').val( v.name);
                var comment = $('#layerAdd').find('input[name="comment"]').val(v.comment);


                $('#layerAdd').attr('data-mtid', v.mtId);
                //com.clearForm('form1')
                openlayer(function(){
                    var id = $('#layerAdd').attr('data-mtid');
                    if(com.validate('form1'))
                        return;

                    saveData(id, function(){
                        com.clearValidator("#name", true);
                        com.clearValidator("#comment", true);
                        com.clearValidator();
                        layer.closeAll();
                    });




                });
            });
            $btnStart.click(function () {
                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-mtId', v.mtId);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-mtId');
                    var status = $('#layerAdd').attr('data-status');
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
                    $('#layerAdd').attr('data-mtId', v.mtId);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-mtId');
                    var status = $('#layerAdd').attr('data-status');
                    stopStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2000});
                    });
                }, function(){

                });
            });
            $btnDel.click(function(){
                layer.confirm('是否确定删除？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-mtId', v.mtId);
                    var id = $('#layerAdd').attr('data-mtId');
                   deleteManifestTemplate(id,function(){
                       layer.closeAll();
                       layer.msg('删除成功',{icon:1,time:2000});
                   });
                }, function(){

                });

            });

            /*绑定*/
            $btnBinbing.click(function(mtId){
                $('#layerAdd').attr('data-mtid', v.mtId);
                mtId = $('#layerAdd').attr('data-mtid');
                params.mtid = mtId;
                com.switchPage('views/manifest/manifestTemplateItem.html');

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


    var manifestSeacher = new Searcher();

    manifestSeacher.init( ['manifestTemplateName'], "condList", api.inventory.pageManifestTemplate, function(data){
        displayFunc.init('resultList', data);

    }, "pagenation", "manifestTemplatePostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            clearForm('form1');
            openlayer(function(index, layero){
                if(com.validate('form1'))
                    return;

                saveData(null, function(){
                    com.clearValidator("#name", true);
                    com.clearValidator("#comment", true);
                    com.clearValidator();
                    layer.closeAll();
                });


            });
        });


        return [$adda];
    },'resultList');

    function clearForm(formId){
        var $form = $("#"+formId);
        var error = $('.alert-error', $form);
        var success = $('.alert-success', $form);
        $('.control-group').removeClass("success").removeClass("error");
        $(".ok").remove();
        $(".help-inline").remove();
        success.hide();
        error.hide();
        $("span.checked",$form).removeClass("checked");
        $("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        $(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        $('input[type="hidden"]',$form).val('');
        document.getElementById(formId).reset();
    }

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title:"添加",
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
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


    function startStatus(id,status,callback){
        if(status=="1"){
            com.post(api.inventory.updateManifestTemplateForStatus,{
                "manifestTemplate.mtId":id,
                "manifestTemplate.status":"0"
            },function(res){
                callback();
                manifestSeacher.doSearch();
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
            com.post(api.inventory.updateManifestTemplateForStatus,{
                "manifestTemplate.mtId":id,
                "manifestTemplate.status":"1"
            },function(res){
                callback();
                manifestSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    function deleteManifestTemplate(id,callback){
        com.post(api.inventory.deleteManifestTemplate,{
            "manifestTemplate.mtId":id
        }, function (res) {
            callback();
            manifestSeacher.doSearch();
        });
    }
    /*登录表单校验*/
    var submitValidate = function(){
        $("#form1 .alert-error").hide();

        var validator = com.validate("#form1",{
            //一些校验规则
            messages: {
                name: {
                    required: "请填写名称."
                },
                comment: {
                    required: "请填写说明."
                }
            },
            success: function (label) {
                label.closest('.control-group').removeClass('error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.addClass('help-small no-left-padding').insertAfter(element);
            }
        });
        return validator;
    };


    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var comment = $layer.find('input[name="comment"]').val();

        if(!id){

            com.post(api.inventory.addManifestTemplate, {
                "manifestTemplate.name": name,
                "manifestTemplate.comment": comment
            }, function(res){
                callback();
                manifestSeacher.doSearch();
            });

        }else{

            com.post(api.inventory.updateManifestTemplate, {
                "manifestTemplate.mtId": id,
                "manifestTemplate.name": name,
                "manifestTemplate.comment": comment
            }, function(res){
                callback();
                manifestSeacher.doSearch();
            });

        }
    }

});
