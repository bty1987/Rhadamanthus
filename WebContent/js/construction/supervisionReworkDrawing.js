jQuery(function ($) {

    var drawing = {
        galleryId: null,
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        drawingItems: {},

        mediaServer: "",

        editFlag: false
    };

    var colorboxArgs = {
        reposition: true,
        scalePhotos: true,
        scrolling: false,
        previous: '<i class="icon-arrow-left"></i>',
        next: '<i class="icon-arrow-right"></i>',
        close: '&times;',
        current: '{current} of {total}',
        maxWidth: '100%',
        maxHeight: '100%'
    };

    com.focusPage('#fl-statement').statement("监理控制", "返工图纸");


    drawing.galleryId = "reworkDrawingGallery";

    drawing.mediaServer = window.mediaServer;

    com.focusPage("#btnBack").click(function () {
        com.switchPage(api.index.supervisionReworkIndex.url);
    });

    com.post(api.construction.queryReworkDrawingByReworkId, {
        "reworkDrawing.rwId": params.rwId
    }, function (res) {
        var reworkDrawings = res.reworkDrawings;
        for (var i = 0; i < reworkDrawings.length; i++) {
            var reworkDrawing = reworkDrawings[i];

            appendGalleryElement("reworkDrawingGallery", reworkDrawing.rwdId, reworkDrawing.rwdUrl, 0, "", api.construction.deleteReworkDrawingById.url, {});
        }
    });

    com.focusPage("#pictureUpload").Huploadify({
        'debug': false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': 150, // 超时时间
        'formData': { // 附带值
            'username': '用户名',
            'rnd': '加密密文'
        },
        'buttonClass': 'btn btn-success',
        'buttonText': '上传',
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
        'height': '45', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit': '3MB', // 上传文件的大小限制
        'queueSizeLimit': 25, // 上传数量
        'onUploadSuccess': function (file, data, response) { // 上传到服务器, 服务器返回相应信息到data里
            var dateObj = eval("(" + data + ")");

            if (dateObj.errorCode == 0) {

                var options = {
                    "reworkDrawing.rwId": params.rwId,
                    "reworkDrawing.rwdName": "",
                    "reworkDrawing.rwdUrl": dateObj.resUrl,
                    "reworkDrawing.rwdAddUrl": ""
                };

                com.post(api.construction.addReworkDrawing, options, function (res) {
                    var reworkDrawing = res.reworkDrawing;
                    appendGalleryElement("reworkDrawingGallery", reworkDrawing.rwdId, dateObj.resUrl, 0, "", api.construction.deleteReworkDrawingById.url, {});
                });
            } else {
                console.log(data);
            }
        }
    });

    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, operate) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + imgId).css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").append(img).appendTo(imgLi);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function () {
            var options = {
                "reworkDrawing.rwId": params.rwId,
                "reworkDrawing.rwdId": imgId
            };
            com.post(api.construction.deleteReworkDrawingById, options, function (res) {
                com.focusPage("#gallery_li" + imgId).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        imgA.colorbox(colorboxArgs);
    }

});

