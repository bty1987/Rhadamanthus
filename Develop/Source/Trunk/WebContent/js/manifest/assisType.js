/**
 * Created by Administrator on 2017/3/6.
 */
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var titleName = '名称,工种,说明,状态';
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                v.name,
                v.workType.name,
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
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
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
            $btnEdit.click(function(){
                var name = $('#layerAdd').find('input[name="name"]').val(v.name);
                var workType = $('#layerAdd').find('select[name="workType"]').val(v.workType.id);
                var comment = $('#layerAdd').find('input[name="comment"]').val(v.comment);
                $('#layerAdd').attr('data-atid', v.atid);
                openlayer(function(){
                    var id = $('#layerAdd').attr('data-atid');
                    if(com.validate('form1'))
                        return;
                    saveData(id, function(){
                        com.clearValidator("#name", true);
                        com.clearValidator("#workType", true);
                        com.clearValidator("#comment", true);
                        com.clearValidator();
                        layer.closeAll();
                    });

                });
            });


            $btnStart.click(function(){
                layer.confirm('是否启用？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    $('#layerAdd').attr('data-atid', v.atid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-atid');
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
                    $('#layerAdd').attr('data-atid', v.atid);
                    $('#layerAdd').attr('data-status', v.status);
                    var id = $('#layerAdd').attr('data-atid');
                    var status = $('#layerAdd').attr('data-status');
                    stopGoodsStatus(id,status,function(){
                        layer.closeAll();
                        layer.msg('禁用成功',{icon:1,time:2e3});
                    });
                }, function(){

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
    var goodsSeacher = new Searcher();
    com.post(api.common.queryWorkType,{},function(res){
        $('select[name="workType"]').bindData(res.workTypes,"id","name");
    });
    //"workType"   api.inventory.pageAssisType
    goodsSeacher.init( ["workTypeName"], "condList", api.inventory.pageAssisType, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "assisTypePostData", null, false, null, function(){


        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-top':'-2px','margin-left':'4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $importAssisType = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'addQuotationVersion').css('margin-top', '-2px');
        var $addaAssisType = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($importAssisType);
        var $addaAssisTypespan = $('<span></span>').text('导入').appendTo($importAssisType);

        $adda.click(function(){
            clearForm('form1');
            openlayer(function(index, layero){
                if(com.validate('form1'))
                    return;

                saveData(null, function(){
                    com.clearValidator("#name", true);
                    com.clearValidator("#workType", true);
                    com.clearValidator("#comment", true);
                    com.clearValidator();
                    layer.closeAll();
                });

            });
        });

        $importAssisType.click(function(){

            clearForm('form2');
            $('#importSelectAssisType').empty();

            openlayerImportAssisType();

            $('#importSelectAssisType').Huploadify({

                'debug' : false, // 开启调试
                'auto':true, // 是否自动上传
                'successTimeout':config.uploadTimeout, // 超时时间
                'formData':{
                    'uploadType':4,
                },
                'buttonClass': 'btn btn-success col-sm-6',
                'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
                'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                'uploader': config.server + 'importAssisType.do', // 上传处理程序
                'height':'30', // 浏览按钮的高度
                'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
                'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
                'fileSizeLimit':'2MB', // 上传文件的大小限制
                'queueSizeLimit' : 1, // 上传数量
                'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里

                    var dateObj = eval("("+data+")");
                    goodsSeacher.doSearch();

                }
            });

        });

        return [$importAssisType,$adda];

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
            maxmin: true,
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

    function openlayerImportAssisType(){

        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "导入辅类",
            content: $('#importAssisType'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9000,
            btn: ['确定'],
            zIndex: 9000,
            success: function (layers, index) {

            },
            end: function () {
                goodsSeacher.doSearch();
            }
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
                },
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
    //状态启用
    function startGoodsStatus(id,status,callback){
        if(status=="1"){
            com.post(api.inventory.updateAssisTypeForStatus,{
                "assisType.atid": id,
                "assisType.status": "0"
            },function(res){
                callback();
                goodsSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }
    //状态禁用
    function stopGoodsStatus(id,status,callback){
        if(status=="0"){
            com.post(api.inventory.updateAssisTypeForStatus,{
                "assisType.atid": id,
                "assisType.status": "1"
            },function(res){
                callback();
                goodsSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }
    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var workType = $layer.find('select[name="workType"] option:selected').val();
        var comment = $layer.find('input[name="comment"]').val();
        if(!id){
            com.post(api.inventory.addAssisType, {
                "assisType.name": name,
                "assisType.comment": comment,
                "assisType.workType.id": workType
            }, function(res){
                callback();
                goodsSeacher.doSearch();
            });

        }else{
            com.post(api.inventory.updateAssisType, {
                "assisType.atid": id,
                "assisType.name": name,
                "assisType.comment": comment,
                "assisType.workType.id": workType
            }, function(res){
                callback();
                goodsSeacher.doSearch();
            });

        }
    }

});
