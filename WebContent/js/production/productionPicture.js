$(function(){

    var productionPicture={
          btns:{
              uploadBtn:com.focusPage("#uploadBtn"),
              back:com.focusPage("#backBtn"),
          },
          models:{
              layerProductionImport :com.focusPage("#layerProductionImport"),
          },
          items:{
          comment:com.focusPage("#comment"),
          },

        pid:params.pid,
        status:params,
        pictureStatus :false,
        replacePicture :{}
    };

    createPage();

    function createPage(){

        com.post(api.production.queryProductionPictureByPid,{"productionPicture.pid":productionPicture.pid},function(listData){

            $.each(listData.productionPictures,function(i,v){
                if(v.status != 2){
                    productionPicture.pictureStatus = true;
                    productionPicture.replacePicture["production["+i+"].pid"] = v.ppid;
                }else{
                    return true;
                }
            });
            createLine(listData);
        },function(e){

        });
    }


    function createLine(data){

        var $tableWrap = com.focusPage('#resultList').find("#uploadCAD");

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


    productionPicture.btns.back.click(function(){
        com.switchPage(api.index.productionIndex.url);
    });

    
    productionPicture.btns.uploadBtn.click(function(){
        com.clearValidator();


        if(productionPicture.status == 4 || productionPicture.status == 5 ||productionPicture.status == 3){
            $("#importProductionPicture").addClass("hide")
        }

        com.focusPage('#importProductionPicture').empty();


        com.focusPage("#importProductionPicture").click(function(){
            if(com.validate("layerProductionImport",null)){
                return false;
            }
        });

        com.uploadify("#importProductionPicture", "添加上传文件", 'btn btn-success blue ', "*.dwg;*.dwt", {'uploadType': 2}, 1, function(data){

            var option = {};

            if (data.errorCode == 0) {
                option["productionPicture.pid"] = productionPicture.pid;
                option["productionPicture.name"] = data.strutsUploadsFileName;
                option["productionPicture.path"] = data.resUrl;
                option["productionPicture.comment"] = productionPicture.items.comment.val();
                option["productionPicture.status"] = 0;
            }

            com.post(api.production.addProductionPicture,option,function(data){
                com.showAlert(com.info, "上传成功");
                createPage();
            },function(e){
                com.showAlert(com.info, "上传失败");
            });

        });
        com.focusPage("#uploadCAD").empty();
        productionPicture.models.layerProductionImport.modal("show");

    });

    com.focusPage("#confirmBtn").click(function () {

        productionPicture.models.layerProductionImport.modal("hide");
    })

});
