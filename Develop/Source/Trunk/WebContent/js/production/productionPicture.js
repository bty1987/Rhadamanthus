$(function(){

    var $uploadBtn = $("#uploadBtn");
    var $back = $("#backBtn");

    var $pid = params["pid"];
    var $status = params["status"];

    var $pictureStatus = false;
    var $replacePicture = {};

    var $layerImport = $("#layerProductionImport");

    createPage();

    function createPage(){
        com.post(api.production.queryProductionPictureByPid,{"productionPicture.pid":$pid},function(listData){

            $.each(listData.productionPictures,function(i,v){
                if(v.status != 2){
                    $pictureStatus = true;
                    $replacePicture["production["+i+"].pid"] = v.ppid;
                }else{
                    return true;
                }
            });
            createLine(listData);
        },function(e){

        });
    }


    function createLine(data){

        var $tableWrap = $('#resultList').find("#uploadCAD");

        $.each(data.productionPictures,function(i,v){

            if(v.status == 2){
                return true;
            }

            var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");

            var $iconGrouop = $("<div></div>").addClass("infobox-icon");
            var $icondownload = $("<a></a>").addClass("icon-download-alt");
            com.downloadFile($icondownload, v.path, v.name);

            var $dataGrouop = $("<div></div>").addClass("infobox-data");
            var $name = $("<div></div>").addClass("infobox-content").html(v.name);
            var $time = $("<div></div>").addClass("infobox-content").html(v.createTime);
            var $comment = $("<div></div>").addClass("infobox-content").html(v.comment);

            $dataGrouop.append($name).append($time).append($comment);
            $iconGrouop.append($icondownload);
            $box.append($iconGrouop).append($dataGrouop).appendTo($tableWrap);;

        });

    }


    $back.click(function(){
        com.switchPage(api.index.productionIndex.url);
    });

    
    $uploadBtn.click(function(){

        if($status == 4 || $status == 5 ||$status == 3){
            $("#importProductionPicture").addClass("hide")
        }

        productionUtils.clearForm('form1');
        $('#importProductionPicture').empty();
        openlayerImportProduction();

        $("#importProductionPicture").click(function(){
            if(!checkAddValue()){
                return false;
            }
        });

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
            'fileTypeExts': "*.dwg;*.dwt", // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'multi': true,
            'queueSizeLimit': 1, // 上传数量
            'onUploadSuccess': function (file, data, response) {
                addProductionPicture(data);
                // 上传到服务器，服务器返回相应信息到data里
            }});

    });

    function openlayerImportProduction(){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "导入图纸",
            content: $layerImport ,
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9999,
            btn: ['确定'],
            zIndex: 9999,
            success: function (layers, index) {

            },
            end: function () {
                $("#uploadCAD").empty();
                createPage();
            }
        });
    }


    function addProductionPicture(data){

        //存在非废弃状态的图纸项
        //if($pictureStatus){
        //    var option = {};
        //    var dateObj = eval("(" + data + ")");
        //
        //    if (dateObj.errorCode == 0) {
        //        option["productionPicture.pid"] = $pid;
        //        option["productionPicture.name"] = dateObj.strutsUploadsFileName;
        //        option["productonPicture.path"] = dateObj.resUrl;
        //        option["productionPicture.comment"] = $layerImport.find("input[name='pictureComment']");
        //        option["productionPicture.status"] = 0;
        //    }
        //
        //    com.post(api.production.deleteProductionPicture,$replacePicture,function(res){
        //    },function(e){
        //        com.showAlert(com.info, "替换失败")
        //        return false;
        //    })
        //
        //    com.post(api.production.addProductionPicture,option,function(data){
        //    },function(e){
        //    });
        //
        //}else{
        //    var option = {};
        //    var dateObj = eval("(" + data + ")");
        //
        //    if (dateObj.errorCode == 0) {
        //        option["productionPicture.pid"] = $pid;
        //        option["productionPicture.name"] = dateObj.strutsUploadsFileName;
        //        option["productonPicture.path"] = dateObj.resUrl;
        //        option["productionPicture.comment"] = $layerImport.find("input[name='pictureComment']");
        //        option["productionPicture.status"] = 0;
        //    }
        //
        //    com.post(api.production.addProductionPicture,option,function(data){
        //    },function(e){
        //    });
        //}

        var option = {};
        var dateObj = eval("(" + data + ")");

        if (dateObj.errorCode == 0) {
            option["productionPicture.pid"] = $pid;
            option["productionPicture.name"] = dateObj.strutsUploadsFileName;
            option["productionPicture.path"] = dateObj.resUrl;
            option["productionPicture.comment"] = $layerImport.find("input[name='pictureComment']").val();
            option["productionPicture.status"] = 0;
        }

        com.post(api.production.addProductionPicture,option,function(data){
            layer.close();
        },function(e){
            com.showAlert(com.info, "上传失败");
        });

    }

    function checkAddValue(){
        var flag = true;
        //判断说明是否输入正确
        var $pictureComment = $layerImport.find("input[name='pictureComment']");

        if(!$pictureComment.val()){
            $pictureComment.focus().select();
            $pictureComment.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "图纸说明不能为空"
            }).popover('show');
            flag= false;
        }else{
            $pictureComment.popover('destroy');
        }
        return flag;
    }


});
