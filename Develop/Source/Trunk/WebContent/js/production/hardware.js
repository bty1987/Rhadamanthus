$(function(){

    var $layerAdd = $("#layerAdd");
    var $layerImport = $("#layerImport");
    var $pid = params["pid"];
    var $status = params["status"];

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     **/
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){
                $.each(listData,function(i, v){

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color:'grey',"font-weight":"bold"}).html(' ' + v.comment);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnEdit = $('<a></a>').addClass(' btn btn-minier').html('编辑');
                    var $btnUpload = $('<a></a>').addClass(' btn btn-minier').html('图表');
                    var $btnHr = $('<a></a>').addClass(' btn btn-minier ').html('五金项');
                    var $btnArrival = $('<a></a>').addClass(' btn btn-minier ').html('到货');
                    var $btnDestory = $('<a></a>').addClass(' btn btn-minier ').html('废弃');

                    var status = "";

                    switch (v.status){
                        case 0: status = "未到货"; break;
                        case 1: status = "已到货"; break;
                        case 2: status = "废除";   break;
                    }
                    var propertyArr = [
                        ["状态:", status, "grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    if(v.status == 0 && ($status != 4 && $status != 5)){
                        $btnDiv.append($btnEdit)
                               .append($btnUpload).append($btnHr)
                               .append($btnArrival).append($btnDestory)
                               .appendTo($h3);
                    }else{
                        $btnDiv.append($btnUpload).append($btnHr)
                            .appendTo($h3);
                    }

                    //编辑按钮
                    $btnEdit.click(function(){
                        productionUtils.clearForm('form1');

                        $layerAdd.attr('data-hid', v.hid);
                        $layerAdd.find('input[name="comment"]').val(v.comment);

                        var $title = "修改五金单";
                        openlayer($title,function(index,layero){

                            var id = $layerAdd.attr('data-hid');

                            if(checkValue()){
                                saveData(id, function(){
                                    layer.closeAll();
                                    layer.msg("修改成功",{icon:1,time:2000});
                                },function(){
                                    layer.closeAll();
                                    layer.msg("修改失败");
                                });
                            }

                        });
                    });

                    //上传按钮
                    $btnUpload.click(function () {

                        productionUtils.clearForm('form2');
                        openlayerImport();

                        $layerImport.find(".infobox").remove();

                        if(v.path){
                            createLine(v.path, v.comment);
                        }

                        $('#importProductionPicture').empty();

                        hidBtn($('#importProductionPicture'), v.status);

                        $("#importProductionPicture").Huploadify({
                            'debug': false, // 开启调试
                            'auto': true, // 是否自动上传
                            'successTimeout': 99999, // 超时时间
                            'formData': { // 附带值
                                'uploadType': 2
                            },
                            'buttonClass': 'btn btn-success blue',
                            'buttonText': "添加上传文件",
                            'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
                            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                            'uploader':config.media + api.common.uploadOther.url, // 上传处理程序
                            'width' : '100',
                            'height': '30', // 浏览按钮的高度
                            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
                            'fileTypeExts': "*.xlsx", // 允许上传的文件后缀
                            'fileSizeLimit': '5MB', // 上传文件的大小限制
                            'multi': true,
                            'queueSizeLimit': 1, // 上传数量
                            'onUploadSuccess': function (file, data, response) {
                                updateHardwarePath(data, v.hid);
                                // 上传到服务器，服务器返回相应信息到data里
                            }});

                    });


                    //五金项按钮
                    $btnHr.click(function () {

                        params.hid = v.hid;
                        params.hardwareStatus = v.status;
                        params.productionStatus = $status;
                        com.switchPage(api.index.hardwareItemIndex.url);

                    });

                    //废除按钮
                    $btnDestory.click(function () {
                        layer.confirm('是否删除？', {
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){
                            hardwareDestory(v.hid,function(){
                                layer.closeAll();
                                layer.msg('删除成功',{icon:1,time:2000});
                            });
                        }, function(){

                        });
                    });

                    //已到货按钮
                    $btnArrival.click(function () {
                        layer.confirm('确定到货？', {
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){
                            hardwareArrived(v.hid,function(){
                                layer.closeAll();
                                layer.msg('到货成功',{icon:1,time:2000});
                            });
                        }, function(){

                        });
                    });
                });
                $ul.appendTo($tableWrap);
            }
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        };

    })();

    /*分页*/
    var hardwareSeacher = new Searcher();

    var _condArr = [];

    hardwareSeacher.init( _condArr, "condList", api.production.pageHardware, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "hardwarePostData", {"production.pid":$pid}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-xs pull-left btn-info').attr('name', 'addHardwareVersion').css("margin", "0px 3px");
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $backBtn = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'backProductionVersion').css("margin", "0px 3px")
        var $backspan = $('<span></span>').text('返回').appendTo($backBtn);

        hidBtn($adda,0);

        $adda.click(function(){

            productionUtils.clearForm('form1');

            var $title = "添加五金单";
            openlayer($title,function(index, layero){
                if(checkValue()){
                    saveData(null, function(){
                        layer.closeAll();
                        layer.msg("添加成功");
                    },function(){
                        layer.closeAll();
                        layer.msg("添加失败");
                    });
                }
            });
        });

        $backBtn.click(function() {
            com.switchPage(api.index.productionIndex.url)
        })
        return [$adda,$backBtn];

    },'resultList');




    function openlayerImport(){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "导入excel",
            content: $('#layerImport'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9999,
            btn: ['确定'],
            zIndex: 9999,
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }

    function openlayer($title,callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: $title,
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9999,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    function saveData(id,callback1,callback2){

        var $comment = $layerAdd.find('input[name="comment"]').val();

        if(!id){
            com.post(api.production.addHardware, {
                "hardware.pid": $pid,
                "hardware.comment": $comment,
                "hardware.path":""
            }, function(res){
                callback1();
                hardwareSeacher.doSearch();
            },function(e){
                callback2();
            });
        }else{
            com.post(api.production.updateHardware, {
                "hardware.hid": id,
                "hardware.comment": $comment
            }, function(res){
                callback1();
                hardwareSeacher.doSearch();
            },function(){
                callback2();
            });

        }
    }

    //状态已到货
    function hardwareArrived(id,callback){

            com.post(api.production.updateHardwareForStatus,{
                "hardware.hid":id,
                "hardware.status":"1"
            },function(res){
                callback();
                hardwareSeacher.doSearch();
            },function(e){
                layer.closeAll();
                layer.msg('确认失败',{icon:2,time:2000});
            });

    }

    //状态废除
    function hardwareDestory(id,callback){

            com.post(api.production.updateHardwareForStatus,{
                "hardware.hid":id,
                "hardware.status":"2"
            },function(res){
                callback();
                hardwareSeacher.doSearch();
            },function(e){
                layer.closeAll();
                layer.msg('废除失败',{icon:2,time:2000});
            });

    }

    function updateHardwarePath(data,hid){

        var dateObj = eval("(" + data + ")");
        var option = {};

        option["hardware.hid"] = hid;

        if (dateObj.errorCode == 0) {
            option["hardware.path"] = dateObj.resUrl;
        }else{
            layer.msg('上传失败',{icon:2,time:2000});
        }

        com.post(api.production.updateHardware,option,function(res){
            layer.closeAll();
            layer.msg('上传成功',{icon:1,time:2000});
            hardwareSeacher.doSearch();
        },function(){
            layer.closeAll();
            layer.msg('上传失败',{icon:2,time:2000});
            hardwareSeacher.doSearch();
        })
    }


    function createLine(path, comment){

        var $name = comment+".xlsx";//文件名称

        var $line = $layerImport.find(".infobox-container");
        var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");

        var $iconGrouop = $("<div></div>").addClass("infobox-icon");
        var $icondownload = $("<a></a>").addClass("icon-download-alt");

        com.downloadFile($icondownload, path, $name.toString());

        var $dataGrouop = $("<div></div>").addClass("infobox-data");
        var $name = $("<div></div>").addClass("infobox-content").html($name);

        $dataGrouop.append($name);
        $iconGrouop.append($icondownload);
        $box.append($iconGrouop).append($dataGrouop);
        $line.append($box)

    }

    function checkValue(){
        var _flag = true;
        //判断五金单说明是否输入正确
        var $comment = $layerAdd.find("input[name='comment']");
        if(!$comment.val() || $comment.val().length > 128){
            _flag = false;
            $comment.focus().select();
            $comment.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "说明格式错误"
            }).popover('show');
        }else{
            $comment.popover('destroy');
        }
        return _flag;
    }

    //根据订单状态隐藏按钮
    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');

        if ($status == 5 || $status == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});

