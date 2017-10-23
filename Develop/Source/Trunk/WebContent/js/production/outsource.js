$(function(){

    var $pid = params["pid"];
    var $status = params["status"];
    var $layerAdd = $("#layerAdd");
    var $layerImport = $("#layerImport");

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){
                $.each(listData,function(i, v){

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color:'grey',"font-weight":"bold"}).html(v.comment);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnimport = $('<a></a>').addClass(' btn btn-minier').html('图表');
                    var $btnChild = $('<a></a>').addClass(' btn btn-minier ').html('外协项');
                    var $btnReceipt = $('<a></a>').addClass(' btn btn-minier ').html('收货');
                    var $btnaBolition = $('<a></a>').addClass(' btn btn-minier ').html('废除');
                    var $btnEdit = $('<a></a>').addClass(' btn btn-minier ').html('编辑');


                    var propertyArr = [
                        ["状态:",v.status == 0 ? "未到货" : (v.status == 1 ? "已到货" :  "废除"),"grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    if (v.status ==0 && ($status != 4 && $status != 5)){
                        $btnDiv.append($btnChild).append($btnimport).append($btnEdit).append($btnReceipt).append($btnaBolition).appendTo($h3);

                    }else{
                        $btnDiv.append($btnChild).append($btnimport).appendTo($h3);
                    }

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                    $btnimport.click(function () {

                        productionUtils.clearForm('form1');
                        openlayerImport();

                        $layerImport.find(".infobox").remove();

                        if(v.path){
                            createLine(v.path, v.comment);
                        }

                        $('#importProductionPicture').empty();

                        hidBtn( $('#importProductionPicture'), v.status);

                        var $downloadGroup = $("#layerImport").find("#downLoad");
                        com.downloadFile($downloadGroup, v.path, null);



                        $("#importProductionPicture").Huploadify({
                            'debug': false, // 开启调试
                            'auto': true, // 是否自动上传
                            'successTimeout': 150, // 超时时间
                            'formData': { // 附带值
                                'uploadType': 2
                            },
                            'buttonClass': 'btn btn-success col-sm-12',
                            'buttonText': "添加上传文件",
                            'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
                            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                            'uploader': config.media + api.common.uploadImg.url, // 上传处理程序

                            'height': '30', // 浏览按钮的高度
                            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
                            'fileTypeExts': "*.xlsx", // 允许上传的文件后缀
                            'fileSizeLimit': '5MB', // 上传文件的大小限制
                            'multi': false,
                            'queueSizeLimit': 1, // 上传数量
                            'onUploadSuccess': function (file, data, response) {
                                updateoutsourcePath(data, v.oid);
                                // 上传到服务器，服务器返回相应信息到data里
                            }
                        });
                    });

                    $btnEdit.click(function() {

                        productionUtils.clearForm('form1');
                        var comment = $("#layerEdit").find('input[name="comment"]').val(v.comment);

                        $("#layerEdit").attr("attr-oid",v.oid);
                        openlayerEdit(function (index, layero) {

                            id =  $("#layerEdit").attr("attr-oid");
                            saveData(id,function () {
                                layer.closeAll();
                            });

                        });
                    });

                    $btnReceipt.click(function () {
                        layer.confirm('确定到货？', {
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){
                            outsourceArrived(v.oid,function(){
                                layer.closeAll();
                                layer.msg('到货成功',{icon:1,time:2000});
                            });
                        }, function(){

                        });


                    });

                    $btnaBolition.click(function () {
                        layer.confirm('是否废除？', {
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){
                            outsourceDestory(v.oid,function(){
                                layer.closeAll();
                                layer.msg('废除成功',{icon:1,time:2000});
                            });
                        }, function(){

                        });
                    });


                    $btnChild.click(function () {
                        params["oid"] = v.oid;
                        params.outsourceStatus = v.status;
                        params.productionStatus = $status;
                        com.switchPage(api.index.outsourceItemIndex.url);
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
    var _condArr = [];

    var salesSearcher = new Searcher();

    salesSearcher.init( _condArr, "condList", api.production.pageOutsource, function(data){

        displayFunc.init('resultList', data);

    }, "pagenation", "outsourcePostData",{"pid":$pid}, false, null,function () {

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $backBtn = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'backProductionVersion').css("margin", "0px 3px").html('返回');

        hidBtn($adda,0);

        $adda.click(function () {
            productionUtils.clearForm('form3');
            openlayer(function (index, layero) {
                if (checkValue()) {
                    saveData(null, function () {
                    });
                }
            });
        });


        $backBtn.click(function() {
            com.switchPage(api.index.productionIndex.url)
        });

        return [$adda,$backBtn];

    },"resultList");


    function outsourceArrived(id,callback){

        com.post(api.production.updateOutsourceForStatus, {
            "outsource.oid":id ,
            "outsource.status": "1"
        },function(res){
            callback();
            salesSearcher.doSearch();
        },function(e){
            layer.closeAll();
            layer.msg('确认失败',{icon:2,time:2000});
        });

    }
    function outsourceDestory(id,callback){

        com.post(api.production.updateOutsourceForStatus,{
            "outsource.oid":id ,
            "outsource.status": "2"
        },function(res){
            callback();
            salesSearcher.doSearch();
        },function(e){
            layer.closeAll();
            layer.msg('废除失败',{icon:2,time:2000});
        });

    }

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: "添加",
            skin: 'layui-layer-lan',
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
    function openlayerEdit(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "修改",
            content: $('#layerEdit'),
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

    function saveData(id, callback) {
        var $layer = $('#layerAdd');

        var comment = $layer.find('input[name="comment"]').val();
        var path = $('#layerEdit').find('input[name="path"]').val();
        var commen = $('#layerEdit').find('input[name="comment"]').val();

        if (!id) {

            com.post(api.production.addOutsource, {
                "outsource.pid": $pid,
                "outsource.comment": comment
            }, function (res) {

                salesSearcher.doSearch();
                layer.closeAll();
                layer.msg('添加成功', {icon: 1, time: 2e3});

            });

        }else {
            com.post(api.production.updateOutsource, {
                "outsource.oid": id,
                "outsource.path":"",
                "outsource.comment": commen
            }, function (res) {
                salesSearcher.doSearch();
                layer.closeAll();
                layer.msg("修改成功",{icon: 1,time:2e3})
            });

        }
    }

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

    function createLine(path, comment){

        var $line = $layerImport.find(".infobox-container");

        var $name = comment+".xlsx";

        var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");

        var $iconGrouop = $("<div></div>").addClass("infobox-icon");
        var $icondownload = $("<a></a>").addClass("icon-download-alt");
        com.downloadFile($icondownload, path, $name);

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
        if(!$comment.val()){
            _flag = false;
            $comment.focus().select();
            $comment.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "说明不能为空"
            }).popover('show');
        }else{
            $comment.popover('destroy');
        }
        return _flag;
    }

    function updateoutsourcePath(data,oid){

        var dateObj = eval("(" + data + ")");
        var option = {};

        option["outsource.oid"] = oid;

        if (dateObj.errorCode == 0) {
            option["outsource.path"] = dateObj.resUrl;
        }else{
            layer.msg('上传失败',{icon:2,time:2000});
        }

        com.post(api.production.updateOutsource,option,function(res){
            layer.closeAll();
            layer.msg('上传成功',{icon:1,time:2000});
            salesSearcher.doSearch();
        },function(){
            layer.closeAll();
            layer.msg('上传失败',{icon:2,time:2000});
            salesSearcher.doSearch();
        })
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if ($status == 5 || $status == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }
    }

});
