$(function () {
    var walletres = {
        walletresType: {},
        item: {
            type: com.focusPage("#type")
        }
    };

    upload(com.focusPage("#pictureUpload"), "上传图片");

    com.post(api.ds.payment, "", function(data){
        $.each(data.walletresType, function(i, v){
            drawPicDiv(v.key+"Pictures", v.value);
            walletres.walletresType[v.key] = v.value;
        });

        walletres.item.type.bindData(data.walletresType, "key", "value")
    });

    com.post(api.payment.queryWalletres, {"walletres.wid": params.wid}, function(res){
        $.each(res.walletreses, function(i, v){
            addPicture(v.type, v);
        });
    });

    com.focusPage("#pictureUpload a").click(function(){
        if(com.validate("top")) return false;
    });

    function upload(id, name){

        com.uploadify(id, name, api.common.uploadImg, 'btn btn-success', "*.jpg;*.jpge;*.gif;*.png", {'uploadType': 2}, 5, function(data){
            var options = {
                "walletres.wid": params.wid,
                "walletres.name": data.strutsUploadsFileName,
                "walletres.path": data.resUrl,
                "walletres.type": com.focusPage("#type").val(),
                "walletres.comment": ""
            };

            com.post(api.payment.addWalletres, options, function (res) {
                addPicture(walletres.item.type.val(), res.walletres);
            });
        });
    }

    function addPicture (id, i) {
        var $li = $('<li></li>').attr("id", "imgLi_" + i.wrid).appendTo(com.focusPage("#"+id+"Pictures"));
        var $img = $('<img/>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, i.path, 200, 200, i.name);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(walletres.walletresType[i.type]).appendTo($timeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

        var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

        $delA.click(function () {
            com.post(api.payment.deleteWalletres, {"walletres.wrid": i.wrid}, function (res) {
                com.focusPage("#imgLi_" + res.walletres.wrid).remove();
            });
        });

        com.downloadFile($downA, i.path, i.name);

        com.popup4photos("#"+id+"Pictures");

    }

    function drawPicDiv(id, name){
        var $picDiv = $('<div></div>').addClass("col-md-12").appendTo(com.focusPage("#down"));
        var $label = $('<label></label>').addClass("col-md-3 control-label").html(name).appendTo($picDiv);
        var $hr = $('<div></div>').addClass("col-md-12 hr").appendTo($picDiv);
        var $pic = $('<div></div>').addClass('row-fluid').appendTo($picDiv);
        var $picUl = $('<ul></ul>').addClass('ace-thumbnails').prop("id", id).appendTo($pic);
    }

});