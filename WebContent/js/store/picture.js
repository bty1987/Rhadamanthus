$(function () {
    
    var picture = {
        
        gid: params.goods.gid,
            
    }
    
    var pictures = [];
    var pictureUrl = [];

    var slideImgs = [];
    var detailImgs = [];
    
    com.post(api.store.queryPictureByGid, {"picture.gid": picture.gid}, function (res) {
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
        
        com.popup4photos("#slideImg");
        com.popup4photos("#detailImg");
    });
    
    com.uploadify("#slideImg", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {'uploadType': 2}, 10, function(data){
        pictureUrl.push(data.resUrl);
    }, function(){
        uploadComplete(picture.gid, 0);
    });
    
    com.uploadify("#detailImg", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {'uploadType': 2}, 10, function(data){
        pictureUrl.push(data.resUrl);
    }, function(){
        uploadComplete(picture.gid, 1);
    });
    
    function uploadComplete(gid, type){
        
        var options = {
            "picture.gid": gid,
            "picture.type": type
        };
        
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
            
            com.popup4photos("#slideImg");
            com.popup4photos("#detailImg");
        });
    }

    //追加图片元素
    function appendGalleryElement(galleryId, imgId, imgUrl, type, deleteUrl, updateUrl){
        
        var gallery = com.focusPage("#" + galleryId);
        
        var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("text-center").attr("data-pid", imgId).css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(imgLi);
        
        com.showImg(img, imgUrl, 150, 150, '150x150', null, type);
        
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        
        var toolsA = $('<a></a>').attr({"href" : "javascript:void(0)"}).css({"padding-left" : "6px"}).append('<i class="icon-arrow-left bigger-110 green"></i>').appendTo(toolsDiv).mouseenter(function(){
            com.showTip(this, "向前", "top");
        });

        toolsA.click(function(){
            //向前移动
            var prevData = com.focusPage("#gallery_li" + imgId).prev().attr("data-pid");
            if(prevData != undefined){
                var opt = {
                    "pictures[0].pid": imgId,
                    "pictures[1].pid": prevData
                };
                com.post(updateUrl, opt, function(res){
                    com.focusPage("#gallery_li" + imgId).insertBefore(com.focusPage("#gallery_li" + imgId).prev());
                });
            }else{
                com.showAlert(com.warning, "当前图片为第一张,不能再向前更换");
            }
        });

        var toolsB = $("<a></a>").attr({"href" : "javascript:void(0)"}).css({"padding-left" : "6px"}).append( '<i class="icon-remove red"></i>').appendTo(toolsDiv).mouseenter(function(){
            com.showTip(this, "删除", "top");
        });

        toolsB.click(function(){
            var options = {};
            options["picture.pid"] = imgId;

            com.post(deleteUrl, options, function(res){
                com.focusPage("#gallery_li"+imgId).remove();
            });
        });

        var toolsC = $("<a></a>").attr({"href" : "javascript:void(0)"}).css({"padding-left" : "6px"}).append( '<i class="icon-ok"></i>').appendTo(toolsDiv).mouseenter(function(){
            com.showTip(this, "主图", "top");
        });

        toolsC.click(function(){
            var options = {};
            options["mgoods.gid"] = gid;
            options["mgoods.defaultImg"] = imgUrl;

            com.post(api.store.updateMgoods, options, function(res){
                com.focusPage("#goodsPicturePopUp").attr({'data-flag': true});
                com.showAlert(com.info, "图片设置成功");
            });
        });

        var toolsD = $('<a></a>').attr({"href" : "javascript:void(0)"}).css({"padding-left" : "6px"}).append( '<i class="icon-arrow-right bigger-110 blue"></i>').appendTo(toolsDiv).mouseenter(function(){
            com.showTip(this, "向后", "top");
        });

        toolsD.click(function(){
            //向后移动
            var nextData = com.focusPage("#gallery_li" + imgId).next().attr("data-pid");
            if(nextData != undefined){
                var opts = {
                    "pictures[0].pid": imgId,
                    "pictures[1].pid": nextData
                };
                com.post(updateUrl, opts, function(res){
                    com.focusPage("#gallery_li" + imgId).insertAfter(com.focusPage("#gallery_li" + imgId).next());
                });
            }else{
                com.showAlert(com.warning, "当前图片为最后一张,不能再向后更换");
            }
        });
    }
});