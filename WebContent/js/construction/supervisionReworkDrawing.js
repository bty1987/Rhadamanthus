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

    com.focusPage('#fl-statement').statement("监理控制", "返工图纸");

    drawing.galleryId = "reworkDrawingGallery";

    drawing.mediaServer = window.mediaServer;

    com.focusPage("#btnBack").click(function () {
        com.closePopup();
        com.popup4page("#stockRecordPopUp", "/views/construction/supervisionRework.html", "返工");
    });

    com.post(api.construction.queryReworkDrawingByReworkId, {
        "reworkDrawing.rwId": params.rwId
    }, function (res) {
        var reworkDrawings = res.reworkDrawings;
        for (var i = 0; i < reworkDrawings.length; i++) {
            var reworkDrawing = reworkDrawings[i];

            appendGalleryElement("reworkDrawingGallery", reworkDrawing.rwdId, reworkDrawing.rwdUrl, 0, "", api.construction.deleteReworkDrawingById.url, {});
        }
        com.popup4photos("#reworkDrawingGallery");
    });
    
    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpge;*.gif;*.png', {'uploadType': 0}, 1, function(data){
        
        var options = {
            "reworkDrawing.rwId": params.rwId,
            "reworkDrawing.rwdName": "",
            "reworkDrawing.rwdUrl": data.resUrl,
            "reworkDrawing.rwdAddUrl": ""
        };

        com.post(api.construction.addReworkDrawing, options, function (res) {
            var reworkDrawing = res.reworkDrawing;
            appendGalleryElement("reworkDrawingGallery", reworkDrawing.rwdId, data.resUrl, 0, "", api.construction.deleteReworkDrawingById.url, {});
            com.popup4photos("#reworkDrawingGallery");
        });
    });

    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, operate) {

        var gallery = com.focusPage("#" + galleryId);
        
        var imgLi = $("<li></li>").attr("id", "gallery_li" + imgId).css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").append(img).appendTo(imgLi);
        
        com.showImg(img, imgUrl, 150, 150, '', null, type);
        
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

    }

});

