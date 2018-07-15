$(function () {
    var pictures = [];
    var pictureUrl = [];
    var colorboxArgs = {
        reposition:true,
        scalePhotos:true,
        scrolling:false,
        previous:'<i class="icon-arrow-left"></i>',
        next:'<i class="icon-arrow-right"></i>',
        close:'&times;',
        current:'{current} of {total}',
        maxWidth:'100%',
        maxHeight:'100%'
    };

    var slideImgs = [];
    var detailImgs = [];
    var gid = $("#goodsPicturePopUp").attr("data-gid");

    initUploadBtn(gid, 0, "slideImg", "slideBtn");
    initUploadBtn(gid, 1, "detailImg", "detailBtn");

    com.post(api.store.queryPictureByGid, {"picture.gid": gid}, function (res) {
        pictures = res.pictures;
        $.each(pictures, function (i, v) {
            //0是轮播图 1是详情图
            if (v.type == 0) {
                slideImgs[v.pid] = v;
                appendGalleryElement("slideImg", v.pid, v.img, 0, api.store.deletePicture, api.store.updatePictureForSort);
            } else if (v.type == 1) {
                detailImgs[v.pid] = v;
                appendGalleryElement("detailImg", v.pid, v.img, 0, api.store.deletePicture, api.store.updatePictureForSort);
            }
        });
    });

    function initUploadBtn(gid, type, divId, btnDiv){
        $("#" + btnDiv).html("").Huploadify({
            'debug' : false, // 开启调试
            'auto':true, // 是否自动上传
            'successTimeout':150, // 超时时间
            'formData':{ // 附带值
                'uploadType':0,
                'username':'用户名',
                'rnd':'加密密文'
            },
            'multi': true, // 批量上传
            'buttonClass': 'btn btn-success',
            'buttonText': '上传图片',
            'overrideEvents' : ['onDialogClose'],  // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
            'uploader':config.media + api.common.uploadImg.url, // 上传处理程序
            'height': '45', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png', // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'queueSizeLimit' : 10, // 上传数量
            'onUploadSuccess':function(file, data, response){ //上传到服务器,服务器返回相应信息到data里
                var dateObj=eval("("+data+")");
                if(dateObj.errorCode == 0){
                    pictureUrl.push(dateObj.resUrl);
                }else{
                    console.log(data);
                }
            },'onQueueComplete':function(){
                var options = {};
                options["picture.gid"] = gid;
                options["picture.type"] = type;
                $.each(pictureUrl, function(i, v){
                    options["imgs[" + i + "]"] = v;
                });

                com.post(api.store.addPicture, options, function(res){
                    var pictures = res.pictures;
                    $.each(pictures, function(i, v){
                        if(type == 0){
                            slideImgs.push(v);
                            appendGalleryElement("slideImg", v.pid, v.img, 0, api.store.deletePicture, api.store.updatePictureForSort);
                        }else if(type == 1){
                            detailImgs.push(v);
                            appendGalleryElement("detailImg", v.pid, v.img, 0, api.store.deletePicture, api.store.updatePictureForSort);
                        }
                    });
                    pictureUrl.length = 0;
                });
            }
        });
    }

    //追加图片元素
    function appendGalleryElement(galleryId, imgId, imgUrl, type, deleteUrl, updateUrl){
        var gallery = $("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("text-center").attr("data-pid", imgId).css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(imgLi);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $('<a></a>').attr({
            "data-rel" : "tooltip",//提示框
            "href" : "javascript:void(0)",
            "data-original-title" : "向前"//提示框内容
        }).css({"padding-left" : "6px","text-decoration" : "none"})
            .append('<i class="icon-arrow-left bigger-110 green"></i>')
            .tooltip().appendTo(toolsDiv);

        toolsA.click(function(){
            //向前移动
            var prevData = $("#gallery_li" + imgId).prev().attr("data-pid");
            if(prevData != undefined){
                var opt = {
                    "pictures[0].pid": imgId,
                    "pictures[1].pid": prevData
                };
                com.post(updateUrl, opt, function(res){
                    $("#gallery_li" + imgId).insertBefore($("#gallery_li" + imgId).prev());
                });
            }else{
                com.showAlert(com.warning, "当前图片为第一张,不能再向前更换！");
            }
        });

        var toolsB = $("<a></a>").attr({
            "data-rel" : "tooltip",
            "href" : "javascript:void(0)",
            "data-original-title" : "删除"
        }).css({"padding-left" : "6px","text-decoration" : "none"})
            .append( '<i class="icon-remove red"></i>')
            .tooltip().appendTo(toolsDiv);

        toolsB.click(function(){
            var options = {};
            options["picture.pid"] = imgId;

            com.post(deleteUrl, options, function(res){
                $("#gallery_li"+imgId).remove();
            });
        });

        var toolsC = $("<a></a>").attr({
            "data-rel" : "tooltip",
            "href" : "javascript:void(0)",
            "data-original-title" : "主图"
        }).css({"padding-left" : "6px","text-decoration" : "none"})
            .append( '<i class="icon-ok"></i>')
            .tooltip().appendTo(toolsDiv);

        toolsC.click(function(){
            var options = {};
            options["mgoods.gid"] = gid;
            options["mgoods.defaultImg"] = imgUrl;

            com.post(api.store.updateMgoods, options, function(res){
                $("#goodsPicturePopUp").attr({'data-flag': true});
                com.showAlert(com.info, "图片设置成功！");
            });
        });

        var toolsD = $('<a></a>').attr({
            "data-rel" : "tooltip",
            "href" : "javascript:void(0)",
            "data-original-title" : "向后"
        }).css({"padding-left" : "6px","text-decoration" : "none"})
            .append( '<i class="icon-arrow-right bigger-110 blue"></i>')
            .tooltip().appendTo(toolsDiv);

        toolsD.click(function(){
            //向后移动
            var nextData = $("#gallery_li" + imgId).next().attr("data-pid");
            if(nextData != undefined){
                var opts = {
                    "pictures[0].pid": imgId,
                    "pictures[1].pid": nextData
                };
                com.post(updateUrl, opts, function(res){
                    $("#gallery_li" + imgId).insertAfter($("#gallery_li" + imgId).next());
                });
            }else{
                com.showAlert(com.warning, "当前图片为最后一张,不能再向后更换！");
            }

        });
        imgA.colorbox(colorboxArgs);
    };
});