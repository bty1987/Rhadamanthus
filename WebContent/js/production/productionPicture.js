$(function(){
    var productionPicture1 = {

        picturePage: com.focusPage("#picturePage"),
        pid: params.pid,
        status : params["status"]
    }
    
    com.post(api.production.queryProductionPictureByPid ,{"productionPicture.pid": productionPicture1.pid} ,function (res) {

        productionPicture1.picturePage.append(drawProductionPicture());

        var productionPictures = res.productionPictures;

        for (var i = 0; i < productionPictures.length; i++) {
            var productionPicture = productionPictures[i];
            if (productionPicture.type == 0) {
                addCAD(com.focusPage("#productionUploadTheCAD"), productionPicture);
            } else if (productionPicture.type == 1) {
                addPicture(com.focusPage("#productionUploadPlan"), productionPicture);
            }
        }
        
        com.popup4photos("#productionUploadPlan");

        productionUtils.loadHuploadify("CADUploadProduction", "上传文件", "*.dwg;*.dwt", false, function (data) {
            addDecorationPicture (data, '0');
        }, "btn btn-warning");

        productionUtils.loadHuploadify("pictureUploadProduction", "上传设计图", "*.jpg;*.jpge;*.gif;*.png", true, function (data) {
            addDecorationPicture (data, '1');
        }, "btn btn-success");

    }, null, false);

    function queryDate (){
        com.post(api.production.queryProductionPictureByPid ,{"productionPicture.pid": productionPicture1.pid} ,function (res) {

            var productionPictures = res.productionPictures;

            com.focusPage("#productionUploadTheCAD").empty();
            com.focusPage("#productionUploadPlan").empty();

            for (var i = 0; i < productionPictures.length; i++) {
                var productionPicture = productionPictures[i];
                if (productionPicture.type == 0) {
                    addCAD(com.focusPage("#productionUploadTheCAD"), productionPicture);
                } else if (productionPicture.type == 1) {
                    addPicture(com.focusPage("#productionUploadPlan"), productionPicture);
                }
            }
            
            com.popup4photos("#productionUploadPlan");
        });
    }

    function addPicture (e, i) {

        var $li = $('<li></li>').attr("id", "imgLi_" + i.ppid).appendTo(e);
        var $img = $('<img></img>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);
        
        com.showImg($img, i.path, 200, 200, '');

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.createTime).appendTo($timeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

        var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

        $delA.click(function () {

            com.post(api.production.deleteProductionPicture, {"productionPicture.ppid": i.ppid}, function (res) {
                com.focusPage("#imgLi_" + res.productionPicture.ppid).remove();
            });
        });

        com.downloadFile($downA, i.path, i.name);

    }
    function addCAD (e, i) {

        var $name = i.name;

        var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').attr("id", "cad_" + i.ppid).appendTo(e);
        var $infoboxIcon = $('<div></div>').addClass('infobox-icon').appendTo($infobox);
        var $downIcon = $('<a></a>').addClass('icon-download-alt').appendTo($infoboxIcon);

        com.downloadFile($downIcon, i.path, new Date().getTime() + '.' + $name.split('.')[1]);

        var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
        var $infoboxLeft = $('<div></div>').css('float', 'left').appendTo($infoboxData);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text($name.split('.')[0].substr(0, 8) + '.' + $name.split('.')[1]).appendTo($infoboxLeft);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.createTime).appendTo($infoboxLeft);


        var $delA = $('<a></a>').addClass("icon-remove").css({
            'float': 'right',
            'font-size': '22px',
            'color': 'white'
        }).appendTo($infoboxData);

        $delA.click(function () {
            com.post(api.production.deleteProductionPicture, {"productionPicture.ppid": i.ppid}, function (res) {
                com.focusPage("#cad_" + res.productionPicture.ppid).remove();
            });
        });
    };

    function drawProductionPicture(res) {

        function createDiv(classes, id, css) {
            var div = $('<div></div>').attr("class", classes);
            if (id) div.attr("id", id);
            if (css) div.attr("style", css);
            return div;
        }

        function createLabel(classes, text, forId) {
            var label = $('<label></label>').attr("class", classes).text(text);
            if (forId) label.attr("for", forId);
            return label;
        }

        function createUl(id, classes, css) {
            var ul = $("<ul></ul>").attr("class", classes);
            if (css) ul.attr("style", css);
            if (id) ul.attr("id", id);
            return ul;
        }

        var row1 = createDiv("row").append(createDiv("col-md-6").append(createDiv("col-md-2", "pictureUploadProduction"),createDiv("col-md-2", "CADUploadProduction")));

        var row2 = createDiv("row").append(
            createDiv("col-xs-12").append(createLabel("control-label", "设计图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("productionUploadPlan", "ace-thumbnails")))
            , createDiv("col-xs-12").append(createLabel("control-label", "文件:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createDiv("col-sm-7 infobox-container", "productionUploadTheCAD")))

        );

        return [row1, row2];
    }

    function addDecorationPicture (data, type) {

        if (data.errorCode == 0) {

            var option = {
                "productionPicture.pid": productionPicture1.pid,
                "productionPicture.name": data.strutsUploadsFileName,
                "productionPicture.path": data.resUrl,
                "productionPicture.status": 0,
                "productionPicture.type": type
            }

            com.post(api.production.addProductionPicture, option, function (res) {
                queryDate();
            });
        } else {
            com.showAlert(com.error, data.errorMsg);
        }
    };

    if (productionPicture1.status != 1) {
        com.focusPage("#CADUploadProduction").addClass('hide');
        com.focusPage("#pictureUploadProduction").addClass('hide');
    };
});